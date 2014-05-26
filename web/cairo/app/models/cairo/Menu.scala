package models.cairo

import java.sql.{Connection, CallableStatement, ResultSet, Types, SQLException}
import services.db.DB
import play.api.Play.current
import models.domain.CompanyUser

case class MenuFather(id: Int, text: String)

case class MenuItem(id: Int, text: String, items: List[MenuItem], hasSeparator: Boolean)

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
                 is_popup_menu: Boolean
                 )

object Menu {

  def list(user: CompanyUser): List[Menu] = {
    val sql = "{call sp_sys_menu_get(?, ?, ?)}";
    val connection = DB.getConnection(user.database.database, false)
    val cs = connection.prepareCall(sql)

    cs.setInt(1, user.user.id.getOrElse(0))
    cs.setInt(2, user.company.id.getOrElse(0))
    cs.registerOutParameter(3, Types.OTHER)

    cs.execute()

    val rs = cs.getObject(3).asInstanceOf [java.sql.ResultSet]
    def fillList(): List[Menu] = {
      if (rs.next()) {
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
          rs.getInt("me_is_popup_menu") != 0
        ) :: fillList()
      }
      else {
        rs.close
        cs.close
        List()
      }
    }
    fillList()
  }

  def createMenu(menus: List[Menu]): List[MenuItem] = {

    val emptyFather = MenuFather(0, "")
    val emptyMenuItem = MenuItem(0, "", List(), false)

    def createIfNotExistsMenuFather(father: MenuFather, items: List[MenuItem]): MenuItem = {
      val item = findMenuInList(father, items)
      if(item != null) item else MenuItem(father.id, father.text, List(), false)
    }

    def findMenuInList(father: MenuFather, items: List[MenuItem]): MenuItem = items match {
      case Nil => null
      case h :: t => if(h.id == father.id) h else findMenuInList(father, t)
    }

    def updateMenu(menu: MenuItem, items: List[MenuItem], newItems: List[MenuItem]): List[MenuItem] = items match {
      case Nil => MenuItem(menu.id, menu.text, newItems, menu.hasSeparator) :: items
      case h :: t => if(h.id == menu.id) MenuItem(menu.id, menu.text, newItems, menu.hasSeparator) :: t else h :: updateMenu(menu, t, newItems)
    }

    def createMenuItem(menu: Menu,
                       grandFather: MenuFather,
                       fathers: List[MenuFather],
                       grandFatherItem: MenuItem,
                       items: List[MenuItem]): List[MenuItem] = fathers match {
      case Nil => {
        MenuItem(menu.id, menu.text, List(), menu.have_separator) :: grandFatherItem.items
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