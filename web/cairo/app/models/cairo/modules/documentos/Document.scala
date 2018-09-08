package models.cairo.modules.documentos

import java.sql.{Connection, CallableStatement, ResultSet, Types, SQLException}
import anorm.SqlParser._
import anorm._
import services.DateUtil
import services.db.DB
import models.cairo.system.database.{DBHelper, Register, Field, FieldType, SaveResult, Recordset}
import play.api.Play.current
import models.domain.CompanyUser
import java.util.Date
import play.api.Logger
import play.api.libs.json._
import scala.util.control.NonFatal
import models.cairo.modules.general.U

case class DocumentEditStatus(status: Int, message: String)
case class TransInfo(
                      id: Int,
                      cotizacion: Double,
                      total: Double,
                      nrodoc: String,
                      provId: Int,
                      provName: String,
                      cliId: Int,
                      cliName: String,
                      sucId: Int,
                      docId: Int,
                      doctId: Int,
                      empId: Int,
                      empName: String)
case class DocumentInfo(monId: Int, doctId: Int, docTipoFactura: Int, mueveStock: Boolean)
case class DocInfo(id: Int, name: String, monId: Int)
case class DocumentNumberInfo(number: Int, mask: String, enabled: Boolean)
case class AccountInfo(cueId: Int, monId: Int)
case class DateInfo(isValid: Boolean, range: String)

object Document {

  def editStatus(user: CompanyUser, id: Int, preId: Int): DocumentEditStatus = {

    DB.withTransaction(user.database.database) { implicit connection =>

      val sql = "{call sp_doc_get_editable(?, ?, ?, ?, ?, ?)}"
      val cs = connection.prepareCall(sql)

      cs.setInt(1, user.cairoCompanyId)
      cs.setInt(2, id)
      cs.setInt(3, user.masterUserId)
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
      cs.setInt(3, user.masterUserId)
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

  def transInfo(user: CompanyUser, doctId: Int, id: Int): TransInfo = {

    DB.withTransaction(user.database.database) { implicit connection =>

      val sql = "{call sp_doc_get_trans_info(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)}"
      val cs = connection.prepareCall(sql)

      cs.setInt(1, user.cairoCompanyId)
      cs.setInt(2, doctId)
      cs.setInt(3, id)
      cs.setInt(4, user.masterUserId)
      cs.registerOutParameter(5, Types.DECIMAL)
      cs.registerOutParameter(6, Types.DECIMAL)
      cs.registerOutParameter(7, Types.VARCHAR)
      cs.registerOutParameter(8, Types.INTEGER)
      cs.registerOutParameter(9, Types.VARCHAR)
      cs.registerOutParameter(10, Types.INTEGER)
      cs.registerOutParameter(11, Types.VARCHAR)
      cs.registerOutParameter(12, Types.INTEGER)
      cs.registerOutParameter(13, Types.INTEGER)
      cs.registerOutParameter(14, Types.INTEGER)
      cs.registerOutParameter(15, Types.INTEGER)
      cs.registerOutParameter(16, Types.VARCHAR)

      try {
        cs.execute()

        TransInfo(
          id,
          cs.getBigDecimal(5).doubleValue,
          cs.getBigDecimal(6).doubleValue,
          cs.getString(7),
          cs.getInt(8),
          cs.getString(9),
          cs.getInt(10),
          cs.getString(11),
          cs.getInt(12),
          cs.getInt(13),
          cs.getInt(14),
          cs.getInt(15),
          cs.getString(16))

      } catch {
        case NonFatal(e) => {
          Logger.error(s"can't get transaction info with doctId $doctId and Id $id for user ${user.toString}. Error ${e.toString}")
          throw e
        }
      } finally {
        cs.close
      }
    }
  }

  def nextNumber(user: CompanyUser, id: Int): DocumentNumberInfo = {

    DB.withTransaction(user.database.database) { implicit connection =>

      val sql = "{call sp_documento_get_next_number(?, ?, ?, ?)}"
      val cs = connection.prepareCall(sql)

      cs.setInt(1, id)
      cs.registerOutParameter(2, Types.INTEGER)
      cs.registerOutParameter(3, Types.VARCHAR)
      cs.registerOutParameter(4, Types.INTEGER)

      try {
        cs.execute()

        DocumentNumberInfo(cs.getInt(2), cs.getString(3), (if(cs.getInt(4) != 0) true else false))

      } catch {
        case NonFatal(e) => {
          Logger.error(s"can't get document next number info for suppliers with docId $id for user ${user.toString}. Error ${e.toString}")
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

  def supplierAccount(user: CompanyUser, id: Int, provId: Int): AccountInfo = {

    DB.withTransaction(user.database.database) { implicit connection =>

      val sql = "{call sp_doc_get_cue_id(?, ?, ?, ?)}"
      val cs = connection.prepareCall(sql)

      cs.setInt(1, provId)
      cs.setInt(2, id)
      cs.registerOutParameter(3, Types.INTEGER)
      cs.registerOutParameter(4, Types.INTEGER)

      try {
        cs.execute()

        AccountInfo(cs.getInt(3), cs.getInt(4))

      } catch {
        case NonFatal(e) => {
          Logger.error(s"can't get document account for suppliers with docId $id and provId $provId for user ${user.toString}. Error ${e.toString}")
          throw e
        }
      } finally {
        cs.close
      }
    }
  }

  def customerNextNumber(user: CompanyUser, id: Int, cliId: Int): DocumentNumberInfo = {

    DB.withTransaction(user.database.database) { implicit connection =>

      val sql = "{call sp_cliente_get_next_number(?, ?, ?, ?, ?)}"
      val cs = connection.prepareCall(sql)

      cs.setInt(1, cliId)
      cs.setInt(2, id)
      cs.registerOutParameter(3, Types.INTEGER)
      cs.registerOutParameter(4, Types.VARCHAR)
      cs.registerOutParameter(5, Types.INTEGER)

      try {
        cs.execute()

        DocumentNumberInfo(cs.getInt(3), cs.getString(4), (if(cs.getInt(5) != 0) true else false))

      } catch {
        case NonFatal(e) => {
          Logger.error(s"can't get document next number info for customers with docId $id and provId $cliId for user ${user.toString}. Error ${e.toString}")
          throw e
        }
      } finally {
        cs.close
      }
    }
  }

  def customerAccount(user: CompanyUser, id: Int, cliId: Int): AccountInfo = {

    DB.withTransaction(user.database.database) { implicit connection =>

      val sql = "{call sp_doc_get_cue_id(?, ?, ?, ?)}"
      val cs = connection.prepareCall(sql)

      cs.setInt(1, cliId)
      cs.setInt(2, id)
      cs.registerOutParameter(3, Types.INTEGER)
      cs.registerOutParameter(4, Types.INTEGER)

      try {
        cs.execute()

        AccountInfo(cs.getInt(3), cs.getInt(4))

      } catch {
        case NonFatal(e) => {
          Logger.error(s"can't get document account for suppliers with docId $id and cliId $cliId for user ${user.toString}. Error ${e.toString}")
          throw e
        }
      } finally {
        cs.close
      }
    }
  }

  def isValidDate(user: CompanyUser, id: Int, date: Date): DateInfo = {

    DB.withTransaction(user.database.database) { implicit connection =>

      val sql = "{call sp_doc_validate_date(?, ?, ?, ?)}"
      val cs = connection.prepareCall(sql)

      cs.setInt(1, id)
      cs.setDate(2, new java.sql.Date(date.getTime()))
      cs.registerOutParameter(3, Types.INTEGER)
      cs.registerOutParameter(4, Types.VARCHAR)

      try {
        cs.execute()

        DateInfo(cs.getInt(3) != 0, cs.getString(4))

      } catch {
        case NonFatal(e) => {
          Logger.error(s"can't validate date for document with docId $id and date $date for user ${user.toString}. Error ${e.toString}")
          throw e
        }
      } finally {
        cs.close
      }
    }
  }

  def fromDoctId(user: CompanyUser, doctId: Int, doctIdApplic: Int, id: Int, idEx: Int): DocInfo = {

    DB.withTransaction(user.database.database) { implicit connection =>

      val sql = "{call sp_doc_get_doc_id_for_doct_id(?, ?, ?, ?, ?, ?, ?, ?, ?)}"
      val cs = connection.prepareCall(sql)

      cs.setInt(1, user.cairoCompanyId)
      cs.setInt(2, user.masterUserId)
      cs.setInt(3, doctId)
      cs.setInt(4, doctIdApplic)
      cs.setInt(5, id)
      cs.setInt(6, idEx)
      cs.registerOutParameter(7, Types.INTEGER)
      cs.registerOutParameter(8, Types.VARCHAR)
      cs.registerOutParameter(9, Types.INTEGER)

      try {
        cs.execute()

        DocInfo(cs.getInt(7), cs.getString(8), cs.getInt(9))

      } catch {
        case NonFatal(e) => {
          Logger.error(s"can't get the docInfo for document type with doctId $doctId, id $id and idEx $idEx for user ${user.toString}. Error ${e.toString}")
          throw e
        }
      } finally {
        cs.close
      }
    }
  }

  def reports(user: CompanyUser, docId: Int): Recordset = DB.withTransaction(user.database.database) { implicit connection =>
    val statement = connection.createStatement
    val sql = s"select rptf_Id, rptf_nombre, rptf_copias, rptf_sugeridoemail as rptf_sugerido, rptf_csrfile, rptf_object from reporteformulario where doc_id = $docId"
    val res = statement.executeQuery(sql)

    connection.setAutoCommit(false)

    try {

      Recordset.load(res)

    } catch {
      case NonFatal(e) => {
        Logger.error(s"can't get reports for docId $docId and empId ${user.cairoCompanyId} for user ${user.toString}. Error ${e.toString}")
        throw e
      }
    } finally res.close
  }

}

object DocumentEditStatus {
  val PENDING = 1
}