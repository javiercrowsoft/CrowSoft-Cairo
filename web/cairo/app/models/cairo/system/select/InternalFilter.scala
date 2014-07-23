package models.cairo.system.select

import models.cairo.system.database.{DBHelper, QueryParameter}
import models.domain.CompanyUser
import play.api.Logger
import scala.util.control.NonFatal

case class InternalFilter(query: String, filters: List[QueryParameter]) {
  val isEmpty = query.isEmpty
}

object InternalFilter {

  val filters = Map(
    "supplier_list_price" -> "f:supplierListPrice"
  )

  val emptyFilter = InternalFilter("", List())

  def parseDefinition(filterDefinition: String): (String, List[String]) = {
    val info = filterDefinition.split("[|]")
    (info(0), info(1).split("[,]").toList)
  }

  def getFilter(user: CompanyUser, filterDefinition: String): InternalFilter = {
    try {
      parseDefinition(filterDefinition) match {
        case (key, parameters) => {
          filters.getOrElse(key, "") match {
            case "f:supplierListPrice" => supplierListPrice(user, parameters)
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



}