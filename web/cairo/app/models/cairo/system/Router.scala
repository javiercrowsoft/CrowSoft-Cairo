package models.cairo.system

import play.api.Logger

case class RouterEntry(fileHandler: String, action: String, path: String, action2: String, path2: String) {
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

  def createRouter(menus: List[Menu]): List[RouterEntry] = {
    /*menus.filter( menu => menu.action == "show" ).map( menu => Logger.debug(
      s"""
         |${menu.handler}
         |${menu.action}
         |${menu.path}
       """.stripMargin) )*/
    menus.map( menu => RouterEntry(menu.handler, menu.action, menu.path, menu.action2, menu.path2) )
  }
}