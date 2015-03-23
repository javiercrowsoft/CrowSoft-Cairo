package models.cairo.modules.documentos

import java.sql.{Connection, CallableStatement, ResultSet, Types, SQLException}
import anorm.SqlParser._
import anorm._
import services.DateUtil
import services.db.DB
import models.cairo.system.database.{DBHelper, Register, Field, FieldType, SaveResult, Recordset}
import play.api.Play.current
import models.domain.CompanyUser
import play.api.Logger
import play.api.libs.json._
import scala.util.control.NonFatal
import models.cairo.modules.general.U

case class DocumentEditStatus(status: Int, message: String)
case class DocumentInfo(monId: Int, doctId: Int, docTipoFactura: Int, mueveStock: Boolean)
case class DocumentNumberInfo(number: Int, mask: String, enabled: Boolean)

object Document {

  def editStatus(user: CompanyUser, id: Int, preId: Int): DocumentEditStatus = {

    DB.withTransaction(user.database.database) { implicit connection =>

      val sql = "{call sp_doc_get_editable(?, ?, ?, ?, ?, ?)}"
      val cs = connection.prepareCall(sql)

      cs.setInt(1, user.cairoCompanyId)
      cs.setInt(2, id)
      cs.setInt(3, user.userId)
      cs.setInt(4, preId)
      cs.registerOutParameter(5, Types.INTEGER)
      cs.registerOutParameter(6, Types.VARCHAR)

      try {
        cs.execute()

        DocumentEditStatus(cs.getInt(5), cs.getString(6))

      } catch {
        case NonFatal(e) => {
          Logger.error(s"can't get document edit staus with docId $id and preId $preId for user ${user.toString}. Error ${e.toString}")
          throw e
        }
      } finally {
        cs.close
      }
    }
  }

  def info(user: CompanyUser, id: Int): DocumentInfo = {

    DB.withTransaction(user.database.database) { implicit connection =>

      val sql = "{call sp_doc_get_info(?, ?, ?, ?, ?, ?, ?)}"
      val cs = connection.prepareCall(sql)

      cs.setInt(1, user.cairoCompanyId)
      cs.setInt(2, id)
      cs.setInt(3, user.userId)
      cs.registerOutParameter(4, Types.INTEGER)
      cs.registerOutParameter(5, Types.INTEGER)
      cs.registerOutParameter(6, Types.INTEGER)
      cs.registerOutParameter(7, Types.INTEGER)

      try {
        cs.execute()

        DocumentInfo(cs.getInt(4), cs.getInt(5), cs.getInt(6), (if(cs.getInt(7) != 0) true else false))

      } catch {
        case NonFatal(e) => {
          Logger.error(s"can't get document info with docId $id for user ${user.toString}. Error ${e.toString}")
          throw e
        }
      } finally {
        cs.close
      }
    }
  }

  def supplierNextNumber(user: CompanyUser, id: Int, provId: Int): DocumentNumberInfo = {

    DB.withTransaction(user.database.database) { implicit connection =>

      val sql = "{call sp_proveedor_get_next_number(?, ?, ?, ?, ?)}"
      val cs = connection.prepareCall(sql)

      cs.setInt(1, provId)
      cs.setInt(2, id)
      cs.registerOutParameter(3, Types.INTEGER)
      cs.registerOutParameter(4, Types.VARCHAR)
      cs.registerOutParameter(5, Types.INTEGER)

      try {
        cs.execute()

        DocumentNumberInfo(cs.getInt(3), cs.getString(4), (if(cs.getInt(5) != 0) true else false))

      } catch {
        case NonFatal(e) => {
          Logger.error(s"can't get document next number info for suppliers with docId $id and provId $provId for user ${user.toString}. Error ${e.toString}")
          throw e
        }
      } finally {
        cs.close
      }
    }
  }
}