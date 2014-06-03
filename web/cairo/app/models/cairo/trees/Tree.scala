package models.cairo.trees

import java.sql.{Connection, CallableStatement, ResultSet, Types, SQLException}
import services.db.DB
import play.api.Play.current
import models.domain.CompanyUser

case class Tree(id: Int, name: String, root: Int)

object Tree {

  def loadForTable(user: CompanyUser, tableId: Int): List[Tree] = {
    val sql = "{call sp_arbgetarboles(?, ?)}";
    val connection = DB.getConnection(user.database.database, false)
    val cs = connection.prepareCall(sql)

    cs.setInt(1, tableId)
    cs.registerOutParameter(2, Types.OTHER)

    cs.execute()

    val rs = cs.getObject(2).asInstanceOf [java.sql.ResultSet]
    def fillList(): List[Tree] = {
      if (rs.next()) {
        Tree(rs.getInt("arb_id"), rs.getString("arb_nombre"), rs.getInt("ram_id")) :: fillList()
      }
      else {
        rs.close
        cs.close
        connection.commit
        connection.close
        List()
      }
    }
    fillList()
  }
}