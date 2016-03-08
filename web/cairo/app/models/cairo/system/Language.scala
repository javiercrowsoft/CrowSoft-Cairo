package models.cairo.system

import java.sql.{Connection, CallableStatement, ResultSet, Types, SQLException}
import models.domain.CompanyUser
import play.api.Logger
import play.api.Play.current
import services.db.DB

import scala.util.control.NonFatal

case class LanguageEntry(code: String, text: String)

object Language {

  def list(user: CompanyUser): List[LanguageEntry] = {

    DB.withTransaction(user.database.database) { implicit connection =>

      val sql = "{call sp_sys_language_get(?, ?)}"
      val cs = connection.prepareCall(sql)

      cs.setInt(1, user.masterUserId)
      cs.registerOutParameter(2, Types.OTHER)

      try {
        cs.execute()

        val rs = cs.getObject(2).asInstanceOf[java.sql.ResultSet]

        try {
          def fillList(): List[LanguageEntry] = {
            if(rs.next()) {
              LanguageEntry(
                rs.getString("sysl_code"),
                rs.getString("sysl_text").replaceAll("\\&", "").replaceAll("[\\r\\n]", "\\\\n")
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
          Logger.error(s"can't load language for user ${user.toString}. Error ${e.toString}")
          throw e
        }
      } finally {
        cs.close
      }
    }
  }
}