package models.cairo.modules.general

import java.sql.{Connection, CallableStatement, ResultSet, Types, SQLException}
import anorm.SqlParser._
import anorm._
import services.DateUtil
import services.db.DB
import models.cairo.system.database.{DBHelper, Register, Field, FieldType, SaveResult}
import play.api.Play.current
import models.domain.CompanyUser
import java.util.Date
import play.api.Logger
import play.api.libs.json._
import scala.util.control.NonFatal


case class ProveedorInfo(
                          cpgId: Int,
                          cpgName: String,
                          cpgEsLibre: Boolean,
                          lpId: Int,
                          lpName: String,
                          ldId: Int,
                          ldName: String,
                          ivaRi: Boolean,
                          ivaRni: Boolean
                        )

object Proveedor {

  def info(user: CompanyUser, id: Int, docId: Int): ProveedorInfo = {

    DB.withTransaction(user.database.database) { implicit connection =>

      val sql = "{call sp_proveedor_get_info(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)}"
      val cs = connection.prepareCall(sql)

      cs.setInt(1, id)
      cs.setInt(2, docId)
      cs.registerOutParameter(3, Types.INTEGER)
      cs.registerOutParameter(4, Types.VARCHAR)
      cs.registerOutParameter(5, Types.SMALLINT)
      cs.registerOutParameter(6, Types.INTEGER)
      cs.registerOutParameter(7, Types.VARCHAR)
      cs.registerOutParameter(8, Types.INTEGER)
      cs.registerOutParameter(9, Types.VARCHAR)
      cs.registerOutParameter(10, Types.SMALLINT)
      cs.registerOutParameter(11, Types.SMALLINT)

      try {
        cs.execute()

        ProveedorInfo(
          cs.getInt(3),
          cs.getString(4),
          cs.getShort(5) != 0,
          cs.getInt(6),
          cs.getString(7),
          cs.getInt(8),
          cs.getString(9),
          cs.getShort(10) != 0,
          cs.getShort(11) != 0
        )

      } catch {
        case NonFatal(e) => {
          Logger.error(s"can't get proveedor info with provId $id and docId $docId for user ${user.toString}. Error ${e.toString}")
          throw e
        }
      } finally {
        cs.close
      }
    }
  }
}

