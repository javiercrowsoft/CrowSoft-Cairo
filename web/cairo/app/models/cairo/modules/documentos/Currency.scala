package models.cairo.modules.documentos

import java.sql.{Connection, CallableStatement, ResultSet, Types, SQLException}
import anorm.SqlParser._
import anorm._
import services.DateUtil
import services.db.DB
import models.cairo.system.database.{DBHelper, Register, Field, FieldType, SaveResult, Recordset}
import java.math.BigDecimal
import play.api.Play.current
import models.domain.CompanyUser
import java.util.Date
import play.api.Logger
import play.api.libs.json._
import scala.util.control.NonFatal
import models.cairo.modules.general.U


object Currency {

  def rate(user: CompanyUser, id: Int, date: Date): Double = {

    DB.withTransaction(user.database.database) { implicit connection =>

      val sql = "{call sp_moneda_get_cotizacion(?, ?, ?, ?)}"
      val cs = connection.prepareCall(sql)

      cs.setInt(1, id)
      cs.setDate(2, new java.sql.Date(date.getTime()))
      cs.setShort(3, 0.toShort)
      cs.registerOutParameter(4, Types.DECIMAL)

      try {
        cs.execute()

        cs.getBigDecimal(4).doubleValue

      } catch {
        case NonFatal(e) => {
          Logger.error(s"can't get rate with monId $id and date $date for user ${user.toString}. Error ${e.toString}")
          throw e
        }
      } finally {
        cs.close
      }
    }
  }
}