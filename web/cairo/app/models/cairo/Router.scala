package models.cairo

case class RouterEntry(action: String, fileHandler: String, path: String) {
  val handlerObject = fileHandler.substring(fileHandler.indexOf("/") + 1)
}

object Router {

  def createRouter(menus: List[Menu]): List[RouterEntry] = {
    menus.map( menu => RouterEntry(menu.action, menu.handler, menu.path) )
  }
}