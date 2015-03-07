package models.cairo.system

import java.sql.{Connection, CallableStatement, ResultSet, Types, SQLException}
import play.api.Logger
import services.db.DB
import play.api.Play.current
import models.domain.CompanyUser

import scala.util.control.NonFatal

case class MenuFather(id: Int, text: String)

case class MenuItem(id: Int, text: String, items: List[MenuItem], path: String, hasSeparator: Boolean)

case class Menu(
                 id: Int,
                 pre_id: Int,
                 text: String,
                 fathers: List[MenuFather],
                 position: Int,
                 is_last: Boolean,
                 is_separator: Boolean,
                 have_separator: Boolean,
                 is_main_menu: Boolean,
                 is_popup_menu: Boolean,
                 handler: String,
                 action: String,
                 path: String,
                 action2: String,
                 path2: String
                 )

object Menu {

  def list(user: CompanyUser): List[Menu] = {

    DB.withTransaction(user.database.database) { implicit connection =>

      val sql = "{call sp_sys_menu_get(?, ?, ?)}"
      val cs = connection.prepareCall(sql)

      cs.setInt(1, user.userId)
      cs.setInt(2, user.cairoCompanyId)
      cs.registerOutParameter(3, Types.OTHER)

      try {
        cs.execute()

        val rs = cs.getObject(3).asInstanceOf[java.sql.ResultSet]

        try {
          def fillList(): List[Menu] = {
            if(rs.next()) {
              Menu(
                rs.getInt("pre_id"),
                rs.getInt("me_id"),
                rs.getString("text").replace("&", ""),
                List(
                  MenuFather(rs.getInt("father5_id"), rs.getString("father5").replace("&", "")),
                  MenuFather(rs.getInt("father4_id"), rs.getString("father4").replace("&", "")),
                  MenuFather(rs.getInt("father3_id"), rs.getString("father3").replace("&", "")),
                  MenuFather(rs.getInt("father2_id"), rs.getString("father2").replace("&", "")),
                  MenuFather(rs.getInt("father1_id"), rs.getString("father1").replace("&", ""))
                ),
                rs.getInt("me_position"),
                rs.getInt("me_is_last") != 0,
                rs.getInt("me_is_separator") != 0,
                rs.getInt("me_have_separator") != 0,
                rs.getInt("me_is_main_menu") != 0,
                rs.getInt("me_is_popup_menu") != 0,
                rs.getString("handler"),
                rs.getString("me_action"),
                rs.getString("me_path"),
                rs.getString("me_action2"),
                rs.getString("me_path2")
              ) :: fillList()
            }
            else {
              List()
            }
          }
          fillList()

        } finally {
          rs.close
        }

      } catch {
        case NonFatal(e) => {
          Logger.error(s"can't load menu for user ${user.toString}. Error ${e.toString}")
          throw e
        }
      } finally {
        cs.close
      }
    }
  }

  def createMenu(menus: List[Menu]): List[MenuItem] = {

    val emptyFather = MenuFather(0, "")
    val emptyMenuItem = MenuItem(0, "", List(), "", false)

    def createIfNotExistsMenuFather(father: MenuFather, items: List[MenuItem]): MenuItem = {
      val item = findMenuInList(father, items)
      if(item != null) item else MenuItem(father.id, father.text, List(), "", false)
    }

    def findMenuInList(father: MenuFather, items: List[MenuItem]): MenuItem = items match {
      case Nil => null
      case h :: t => if(h.id == father.id) h else findMenuInList(father, t)
    }

    def updateMenu(menu: MenuItem, items: List[MenuItem], newItems: List[MenuItem]): List[MenuItem] = items match {
      case Nil => MenuItem(menu.id, menu.text, newItems, menu.path, menu.hasSeparator) :: items
      case h :: t => {
        if(h.id == menu.id) MenuItem(menu.id, menu.text, newItems, menu.path, menu.hasSeparator) :: t
        else h :: updateMenu(menu, t, newItems)
      }
    }

    def createMenuItem(menu: Menu,
                       grandFather: MenuFather,
                       fathers: List[MenuFather],
                       grandFatherItem: MenuItem,
                       items: List[MenuItem]): List[MenuItem] = fathers match {
      case Nil => {
        MenuItem(menu.id, menu.text, List(), menu.path, menu.have_separator) :: grandFatherItem.items
      }
      case father :: fathers => {
        if(father.id == 0) createMenuItem(menu, father, fathers, grandFatherItem, items)
        else {
          val itemFather = if(grandFather.id == 0) /* main menu */
                              createIfNotExistsMenuFather(father, items)
                           else /* sub menu */
                              createIfNotExistsMenuFather(father, grandFatherItem.items)
          val newItems = createMenuItem(menu, father, fathers, itemFather, itemFather.items)
          updateMenu(itemFather, items, newItems)
        }
      }
    }

    def createMenuItemList(menus: List[Menu], items: List[MenuItem]): List[MenuItem] = menus match {
      case Nil => items
      case h :: t => createMenuItemList(t, createMenuItem(h, emptyFather, h.fathers, emptyMenuItem, items))
    }

    createMenuItemList(menus, List())

  }

}