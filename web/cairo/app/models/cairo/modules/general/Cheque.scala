package models.cairo.modules.general

import java.sql.Types

import models.domain.CompanyUser
import play.api.Logger
import play.api.Play.current
import services.db.DB
import java.util.Date

import scala.util.control.NonFatal

case class ChequeInfo(
                       bcoName: String,
                       cueName: String,
                       cliName: String,
                       cleName: String,
                       bcoId: Int,
                       cueId: Int,
                       fechaVto: Date,
                       fechaCobro: Date,
                       importe: Double,
                       importeOrigen: Double
                      )

object Cheque {

  def info(user: CompanyUser, id: Int): ChequeInfo = {

    DB.withTransaction(user.database.database) { implicit connection =>

      val sql = "{call sp_cheque_get_info(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)}"
      val cs = connection.prepareCall(sql)

      cs.setInt(1, id)
      cs.registerOutParameter(2, Types.VARCHAR)
      cs.registerOutParameter(3, Types.VARCHAR)
      cs.registerOutParameter(4, Types.VARCHAR)
      cs.registerOutParameter(5, Types.VARCHAR)

      cs.registerOutParameter(6, Types.INTEGER)
      cs.registerOutParameter(7, Types.INTEGER)

      cs.registerOutParameter(8, Types.DATE)
      cs.registerOutParameter(9, Types.DATE)

      cs.registerOutParameter(10, Types.DECIMAL)
      cs.registerOutParameter(11, Types.DECIMAL)

      try {
        cs.execute()

        ChequeInfo(
          cs.getString(2),
          cs.getString(3),
          cs.getString(4),
          cs.getString(5),
          cs.getInt(6),
          cs.getInt(7),
          cs.getDate(8),
          cs.getDate(9),
          cs.getBigDecimal(10).doubleValue(),
          cs.getBigDecimal(11).doubleValue()
        )

      } catch {
        case NonFatal(e) => {
          Logger.error(s"can't get cheque info with cheqId $id for user ${user.toString}. Error ${e.toString}")
          throw e
        }
      } finally {
        cs.close
      }
    }
  }

}
