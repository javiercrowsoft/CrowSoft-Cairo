package models.cairo

case class RouterEntry(path: String, handler: String)

object Router {

  def createRouter(menus: List[Menu]): List[RouterEntry] = {
    menus.map( menu => RouterEntry(menu.action, menu.handler) )
  }
}