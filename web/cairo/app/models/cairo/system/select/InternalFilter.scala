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
    "document" -> "f:document"
  )

  val emptyFilter = InternalFilter("", List())

  def parseDefinition(filterDefinition: String): (String, List[String]) = {
    if(filterDefinition == "-") ("", List())
    else {
      val info = filterDefinition.split("[|]")
      (info(0), info(1).split("[,]").toList)
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
    val currencyId = documentCurrencyId(user, documentId)
    val supplierId = params("supplierId").toInt
    val sqlstmt =
      """
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

  /*
  * IMPORTANT: there is no way to set parameters using the methods setInt, setString, etc, from
  *            PreparedStatement when the parameter is a string containing other parameters
  *
  *            ex:   {call sp_documentohelp( 1, 1, 0, ?, 0, ?, 'doct_id = ? or doct_id = ? or doct_id = ?', ?)}
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
    val doctIds = params("documentTypeId").split("[*]")
    val sqlstmt = doctIds.map(doctId => s"doct_id = ${doctId.toInt}").mkString(" or ")
    InternalFilter(
      sqlstmt,
      List()
    )
  }

}