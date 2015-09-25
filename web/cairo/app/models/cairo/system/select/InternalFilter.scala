package models.cairo.system.select

import models.cairo.system.database.{DBHelper, QueryParameter}
import models.domain.CompanyUser
import play.api.Logger
import scala.util.control.NonFatal

/*
*
* the internalFilter can have additional filters
*
* a filterDefinition is a key and a list of parameters
*
* f:supplierListPrice|supplierId:1,documentId:1
*
* */

case class InternalFilter(query: String, filters: List[QueryParameter]) {
  val isEmpty = query.isEmpty
}

object InternalFilter {

  val filters = Map(
    "supplier_list_price" -> "f:supplierListPrice",
    "document" -> "f:document",
    "account_in_current_company" -> "f:accountInCurrentCompany",
    "supplier_account_group" -> "f:supplierAccountGroup",
    "supplier_account" -> "f:supplierAccount",
    "account_for_cuec_id" -> "f:accountForCuecId"
  )

  val emptyFilter = InternalFilter("", List())

  def parseDefinition(filterDefinition: String): (String, List[String]) = {
    if(filterDefinition == "-") ("", List())
    else {
      val info = filterDefinition.split("[|]")
      if(info.length > 1) {
         (info(0), info(1).split("[,]").toList)
      }
      else {
        (info(0), List())
      }
    }
  }

  /*
  *
  * a filterDefinition is a key and a list of parameters
  *
  * f:supplierListPrice|supplierId:1,documentId:1
  *
  * */
  def getFilter(user: CompanyUser, filterDefinition: String): InternalFilter = {
    try {
      parseDefinition(filterDefinition) match {
        case (key, parameters) => {
          filters.getOrElse(key, "") match {
            case "f:supplierListPrice" => supplierListPrice(user, parameters)
            case "f:document" => document(user, parameters)
            case "f:accountInCurrentCompany" => accountInCurrentCompany(user)
            case "f:supplierAccountGroup" => supplierAccountGroup(user)
            case "f:supplierAccount" => supplierAccount(user)
            case "f:accountForCuecId" => accountForCuecId(user, parameters)
            case _ => emptyFilter
          }
        }
      }
    }
    catch {
      case NonFatal(e) => {
        val message = s"Error when getting internalFilter. Definition: ${filterDefinition}]. Error ${e.toString}"
        Logger.error(message)
        throw new RuntimeException(message)
      }
    }
  }

  private def parseParameters(parameters: List[String]): Map[String, String] = {
    def parseParam(param: String) = {
      val v = param.split("[:]")
      (v(0) -> v(1))
    }
    parameters.map(parseParam).toMap
  }

  private def documentCurrencyId(user: CompanyUser, documentId: Int): Int = {
    DBHelper.getIntValue(
        user,
        "select mon_id from Documento where doc_id = ?",
        List(QueryParameter(documentId))
    )
  }

  private def supplierListPrice(user: CompanyUser, parameters: List[String]): InternalFilter = {
    val params = parseParameters(parameters)
    val documentId = params("documentId").toInt
    val supplierId = params("supplierId").toInt

    if(documentId == 0) {
      val sqlstmt = """
        |(exists(select lp_id from ListaPrecioProveedor where prov_id = ? and lp_id = ListaPrecio.lp_id)
        | or (lp_default <> 0 and lp_tipo in (2,3))
        |)
      """.stripMargin
      InternalFilter(
        sqlstmt,
        List(
          QueryParameter(supplierId)
        )
      )
    }
    else {
      val currencyId = documentCurrencyId(user, documentId)
      val sqlstmt = """
        |(exists(select lp_id from ListaPrecioProveedor where prov_id = ? and lp_id = ListaPrecio.lp_id)
        | or (lp_default <> 0 and lp_tipo in (2,3))
        |) and mon_id = ?
      """.stripMargin

      InternalFilter(
        sqlstmt,
        List(
          QueryParameter(supplierId),
          QueryParameter(currencyId)
        )
      )
    }
  }

  /*
  * IMPORTANT: there is no way to set parameters using the methods setInt, setString, etc, from
  *            PreparedStatement when the parameter is a string containing other parameters
  *
  *            ex:   {call sp_documentohelp( 1, 1, 0, ?, 0, ?, 'doct_id = ? or doct_id = ? or doct_id = ?', ? )}
  *
  *            for PrepareStatement the above call has only 3 parameters
  *
  *            all the ? (question marks) surrounded by ' (apostrophe) are ignored by PrepareStatement
  *
  *            For this reason all internalFilters for stored procedures must try to avoid strings as parameters
  *            and the parameters must be always cast to integer or any other number value like in the document
  *            filter below. Notice it takes a list of doctIds and them are parsed to Int when mapped
  *
  * */

  private def document(user: CompanyUser, parameters: List[String]): InternalFilter = {
    val params = parseParameters(parameters)
    val doctIds = {
      if(params.contains("documentTypeId")) {
        params("documentTypeId").split("[*]").map(doctId => s"doct_id = ${doctId.toInt}").mkString(" or ")
      }
      else ""
    }
    val invoiceTypes = {
      if(params.contains("invoiceType")) {
        params("invoiceType").split("[*]").map(invoiceType => s"doc_tipofactura = ${invoiceType.toInt}").mkString(" or ")
      }
      else ""
    }
    val sqlstmt = {
      if(doctIds.isEmpty) {
        invoiceTypes
      }
      else if(invoiceTypes.isEmpty) {
        doctIds
      }
      else s"(($doctIds) and ($invoiceTypes))"
    }
    InternalFilter(
      sqlstmt,
      List()
    )
  }

  private def accountInCurrentCompany(user: CompanyUser): InternalFilter = {
    InternalFilter(s"(emp_id = ${user.cairoCompanyId} or emp_id is null)", List())
  }

  private def supplierAccountGroup(user: CompanyUser): InternalFilter = {
    InternalFilter("(cueg_tipo in (2,3))", List()) // productoCompra: 2, acreedor: 3
  }

  private def supplierAccount(user: CompanyUser): InternalFilter = {
    InternalFilter("(cuec_id in (8,19,2,6) or cue_producto <> 0)", List()) // acreedores: 8, depositoCupones: 19, bancos: 2, bienesDeCambio: 6
  }

  private def accountForCuecId(user: CompanyUser, parameters: List[String]): InternalFilter = {
    val params = parseParameters(parameters)
    val cuecIds = {
      if(params.contains("cuecId")) {
        params("cuecId").split("[*]").map(cuecId => s"cuec_id = ${cuecId.toInt}").mkString(" or ")
      }
      else ""
    }
    val sqlstmt = {
      if(cuecIds.isEmpty) {
        ""
      }
      else {
        cuecIds
      }
    }
    InternalFilter(
      sqlstmt,
      List()
    )
  }

}