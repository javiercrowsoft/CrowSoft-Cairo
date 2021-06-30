package models.cairo.system

import play.api.Logger

case class Wizard(fileHandler: String, routerEntry: Option[RouterEntry] = None)

case class RouterEntry(fileHandler: String, action: String, path: String, action2: String, path2: String, wizards: List[Wizard]) {
  val handlerObject = fileHandler.substring(fileHandler.indexOf("/") + 2)

  val pathForNavigate = forNavigate(path)
  val path2ForNavigate = forNavigate(path2)

  val pathParam = param(path)
  val path2Param = param(path2)

  def param(path: String) = {
    if(path.contains(":")) "id" else ""
  }

  def forNavigate(path: String) = {
    if(path.contains(":")) s""""${path.substring(0, path.indexOf(":"))}" + id""" else s""""$path/""""
  }
}

object Router {

  def createEntry(fileHandler: String, action: String, path: String, action2: String, path2: String): RouterEntry = {
    val wizards: List[Wizard] = {
      fileHandler match {
        case "CSCompra2/cFacturaCompra" =>
          List(
            Wizard("CSCompra2/cFacturaCompraRemitoWiz"),
            Wizard("CSCompra2/cFacturaCompraAplic", Some(RouterEntry("cFacturaCompra","edit","","editAplic","compra/facturacompraaplic/:id", List()))))
        case "CSVenta2/cFacturaVenta" =>
          List(
            Wizard("CSVenta2/cFacturaVentaRemitoWiz"),
            Wizard("CSVenta2/cFacturaVentaAplic", Some(RouterEntry("cFacturaVenta","edit","","editAplic","venta/facturaventaaplic/:id", List()))))
        case "CSTesoreria2/cCobranza" =>
          List(
            Wizard("CSTesoreria2/cCobranzaWizard"),
            Wizard("CSTesoreria2/cCobranzaAplic", Some(RouterEntry("cCobranza","edit","","editAplic","tesoreria/cobranzaaplic/:id", List()))))
        case "CSTesoreria2/cOrdenPago" =>
          List(
            Wizard("CSTesoreria2/cOrdenPagoWizard"),
            Wizard("CSTesoreria2/cOrdenPagoAplic", Some(RouterEntry("cOrdenPago","edit","","editAplic","tesoreria/ordenpagoaplic/:id", List()))))
        case _ => List()
      }
    }
    RouterEntry(fileHandler, action, path, action2, path2, wizards)
  }

  def createRouter(menus: List[Menu]): List[RouterEntry] = {
    /*menus.filter( menu => menu.action == "show" ).map( menu => Logger.debug(
      s"""
         |${menu.handler}
         |${menu.action}
         |${menu.path}
       """.stripMargin) )*/
    val entries: List[RouterEntry] = menus.map( menu => createEntry(menu.handler, menu.action, menu.path, menu.action2, menu.path2) )

    val maybeMissingConfigObjects = List(
      MissingEntry("CSContabilidadConfig/cContConfig", "edit", "contabilidad/contconfig", "", ""),
      MissingEntry("CSStockConfig/cStockConfig", "edit", "stock/stockconfig", "", ""),
      MissingEntry("CSVentaConfig/cVentaConfig", "edit", "venta/ventaconfig", "", ""),
      MissingEntry("CSTesoreriaConfig/cTesoreriaConfig", "edit", "tesoreria/tesoreriaconfig", "", ""),
      MissingEntry("CSGeneralEx2/cUsuarioConfig", "edit", "general/usuarioconfig", "", "")
    )

    addMissingConfigObjects(entries, maybeMissingConfigObjects)
  }

  case class MissingEntry(fileHandler: String, action: String, path: String, action2: String, path2: String)

  def addMissingConfigObjects(entries: List[RouterEntry], mos: List[MissingEntry]): List[RouterEntry] = mos match {
    case Nil => entries
    case mo :: t => addMissingConfigObjects(addMissingConfigObject(entries, mo), t)
  }
  def addMissingConfigObject(entries: List[RouterEntry], mo: MissingEntry) = {
    if(! entries.filter(c => c.fileHandler.equals(mo.fileHandler)).isEmpty) {
      entries
    } else {
      createEntry(mo.fileHandler, mo.action, mo.path, mo.action2, mo.path2) :: entries
    }
  }
}