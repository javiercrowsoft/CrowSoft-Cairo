package models.cairo

import java.sql.{Connection, CallableStatement, ResultSet, Types, SQLException}
import services.db.DB
import play.api.Play.current
import models.domain.CompanyUser

case class Menu(
                 pre_id: Int,
                 text: String,
                 father: String,
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
          rs.getString("text"),
          rs.getString("father"),
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

}