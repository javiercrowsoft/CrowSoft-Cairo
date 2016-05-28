package models.cairo

import java.sql.{Connection, CallableStatement, ResultSet, Types, SQLException}
import models.cairo.system.database.Recordset
import models.domain.CompanyUser
import play.api.Play.current
import play.api.Logger
import services.db.DB

import scala.util.control.NonFatal

object DesktopDB {

  def listReports(user: CompanyUser): Recordset = {

    DB.withTransaction(user.database.database) { implicit connection =>

      val sql = "{call sp_desktop_get_reportes(?, ?)}"
      val cs = connection.prepareCall(sql)

      cs.setInt(1, user.masterUserId)
      cs.registerOutParameter(2, Types.OTHER)

      try {
        cs.execute()

        val rs = cs.getObject(2).asInstanceOf[java.sql.ResultSet]
        Recordset.load(rs)

      } catch {
        case NonFatal(e) => {
          Logger.error(s"can't get listing of reports for user ${user.toString}. Error ${e.toString}")
          throw e
        }
      } finally {
        cs.close
      }
    }
  }
}