package models.cairo.system.select

import models.cairo.system.database.{DBHelper, QueryParameter}
import models.domain.CompanyUser
import play.api.Logger
import services.G
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
    "account_for_cuec_id" -> "f:accountForCuecId",
    "rubro_tabla_item" -> "f:rubroTablaItem",
    "serial_number" -> "f:serialNumber"
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
            case "f:rubroTablaItem" => rubroTablaItem(user, parameters)
            case "f:serialNumber" => serialNumber(user, parameters)
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
    val documentId = G.getIntOrZero(params("documentId"))
    val supplierId = G.getIntOrZero(params("supplierId"))

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
        params("documentTypeId").split("[*]").map(doctId => s"doct_id = ${G.getIntOrZero(doctId)}").mkString(" or ")
      }
      else ""
    }
    val invoiceTypes = {
      if(params.contains("invoiceType")) {
        params("invoiceType").split("[*]").map(invoiceType => s"doc_tipofactura = ${G.getIntOrZero(invoiceType)}").mkString(" or ")
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
        params("cuecId").split("[*]").map(cuecId => s"cuec_id = ${G.getIntOrZero(cuecId)}").mkString(" or ")
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

  private def rubroTablaItem(user: CompanyUser, parameters: List[String]): InternalFilter = {
    val params = parseParameters(parameters)
    val rubtId = {
      if(params.contains("rubtId")) {
        G.getIntOrZero(params("rubtId"))
      }
      else 0
    }
    InternalFilter(s"(rubt_id = ${rubtId})", List())
  }

  private def serialNumber(user: CompanyUser, parameters: List[String]): InternalFilter = {
    val params = parseParameters(parameters)

    //---------------------------------------------
    val editKit = G.getIntOrZero(params("editKit")) != 0
    val parteProdKit = G.getIntOrZero(params("parteProdKit")) != 0
    val prIdKit = G.getIntOrZero(params("prIdKit"))
    val prnsId = G.getIntOrZero(params("prnsId"))
    val noFilterDepl = G.getIntOrZero(params("noFilterDepl")) != 0
    val deplId = G.getIntOrZero(params("deplId"))
    val depfId = G.getIntOrZero(params("depfId"))
    val cliId = G.getIntOrZero(params("cliId"))
    val provId = G.getIntOrZero(params("provId"))
    val rowPrId = G.getIntOrZero(params("rowPrId"))
    val prId = G.getIntOrZero(params("prId"))
    val crlStock = G.getIntOrZero(params("ctrlStock"))

    val filter =
      if(editKit && !parteProdKit) {
        //
        // it must be a serial number associated to a kit of this pr_id
        //
        "pr_id = " + rowPrId + " and pr_id_kit = " + prId
      }
      else if(parteProdKit) {
        //
        // it must be a serial number that is NOT associated to any kit or
        // it is associated to a kit that is a component of the kit we are editing
        //
        "pr_id = " + rowPrId + (if(prIdKit != 0) " and pr_id_kit = " + prIdKit else " and pr_id_kit is null")
      }
      else {
        //
        // it must be a serial number that is NOT associated to any kit
        //
        "pr_id = " + prId + " and pr_id_kit is null"
      }

    val filterWithDeposit = filter + (

      if(! noFilterDepl) {

        // Los contra-documentos (devoluciones y notas de credito) envian
        // el deposito del tercero y el cliente o proveedor segun corresponda
        //
        if(deplId == DEPL_ID_TERCERO) {

          filter = filter+ " and depl_id = "+ csE_DepositosInternos.cSEDEPLIDTERCERO.toString();

          if(m_cliId != NO_ID) {
            filter = filter+ " and cli_id = "+ m_cliId;

          }
          else if(m_provId != NO_ID) {

            filter = filter+ " and (prov_id = "+ m_provId+ " or prov_id is null)";
          }

        }
        else {
          // No puede estar en depositos internos del sistema
          //
          filter = filter+ " and depl_id not in (-2,-3)";
        }

        if(m_deplId != NO_ID) {
          // Este 'OR' es momentaneo hasta
          // que el control de stock este estable
          //
          if(m_ctrlStock === csEStockFisico || m_ctrlStock === csENoControlaStock) {
            // Si me indico un deposito y el stock es por deposito fisico
            // exijo que el numero de serie este en algun deposito logico
            // del deposito fisico al que pertenece el deposito logico
            // que me pasaron.
            //
            filter = filter+ " and "+ Cairo.General.Constants.DEPL_ID+ " in (select depl_id from depositoLogico where depf_id = "+ m_depfId+ ")";

            // Sino es por deposito fisico exijo que este
            // en el deposito logico que me pasaron
            //
          }
          else if(m_ctrlStock === csEStockLogico) {
            filter = filter+ " and "+ Cairo.General.Constants.DEPL_ID+ " = "+ m_deplId;
          }

        }
        else {
          filter = filter+ " and (1=2)";
        }
      }
      else ""
    )

    if(pt.getPrnsId()) {
      filter = "("+ filter+ ") or (prns_id = "+ pt.getPrnsId().toString()+ ")";
    }

    return filter;
  }

}