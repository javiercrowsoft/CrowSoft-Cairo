package models.cairo

case class RouterEntry(fileHandler: String, action: String, path: String, action2: String, path2: String) {
  val handlerObject = fileHandler.substring(fileHandler.indexOf("/") + 2)
}

object Router {

  def createRouter(menus: List[Menu]): List[RouterEntry] = {
    menus.map( menu => RouterEntry(menu.handler, menu.action, menu.path, menu.action2, menu.path2) )
  }
}