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

case class CuentaInfo(
                      monId: Int,
                      empId: Int
                     )
case class Cuenta(
              id: Int,
              name: String,
              code: String,
              identificacionExterna: String,
              active: Boolean,
              monId: Int,
              monName: String,
              llevaCentroCosto: Boolean,
              producto: Boolean,
              esEfectivo: Boolean,
              esTicket: Boolean,
              cuecId: Int,
              cuecName: String,
              bcoId: Int,
              bcoName: String,
              codigoRpt: String,
              descrip: String,
              createdAt: Date,
              updatedAt: Date,
              updatedBy: Int) {

  def this(
      id: Int,
      name: String,
      code: String,
      identificacionExterna: String,
      active: Boolean,
      monId: Int,
      llevaCentroCosto: Boolean,
      producto: Boolean,
      esEfectivo: Boolean,
      esTicket: Boolean,
      cuecId: Int,
      bcoId: Int,
      codigoRpt: String,
      descrip: String) = {

    this(
      id,
      name,
      code,
      identificacionExterna,
      active,
      monId,
      "",
      llevaCentroCosto,
      producto,
      esEfectivo,
      esTicket,
      cuecId,
      "",
      bcoId,
      "",
      codigoRpt,
      descrip,
      DateUtil.currentTime,
      DateUtil.currentTime,
      DBHelper.NoId)
  }

  def this(
      name: String,
      code: String,
      identificacionExterna: String,
      active: Boolean,
      monId: Int,
      llevaCentroCosto: Boolean,
      producto: Boolean,
      esEfectivo: Boolean,
      esTicket: Boolean,
      cuecId: Int,
      bcoId: Int,
      codigoRpt: String,
      descrip: String) = {

    this(
      DBHelper.NoId,
      name,
      code,
      identificacionExterna,
      active,
      monId,
      llevaCentroCosto,
      producto,
      esEfectivo,
      esTicket,
      cuecId,
      bcoId,
      codigoRpt,
      descrip)

  }

}

object Cuenta {

  lazy val emptyCuenta = Cuenta(
    "",
    "",
    "",
    false,
    DBHelper.NoId,
    false,
    false,
    false,
    false,
    DBHelper.NoId,
    DBHelper.NoId,
    "",
    "")

  def apply(
      id: Int,
      name: String,
      code: String,
      identificacionExterna: String,
      active: Boolean,
      monId: Int,
      llevaCentroCosto: Boolean,
      producto: Boolean,
      esEfectivo: Boolean,
      esTicket: Boolean,
      cuecId: Int,
      bcoId: Int,
      codigoRpt: String,
      descrip: String) = {

    new Cuenta(
      id,
      name,
      code,
      identificacionExterna,
      active,
      monId,
      llevaCentroCosto,
      producto,
      esEfectivo,
      esTicket,
      cuecId,
      bcoId,
      codigoRpt,
      descrip)
  }

  def apply(
      name: String,
      code: String,
      identificacionExterna: String,
      active: Boolean,
      monId: Int,
      llevaCentroCosto: Boolean,
      producto: Boolean,
      esEfectivo: Boolean,
      esTicket: Boolean,
      cuecId: Int,
      bcoId: Int,
      codigoRpt: String,
      descrip: String) = {

    new Cuenta(
      name,
      code,
      identificacionExterna,
      active,
      monId,
      llevaCentroCosto,
      producto,
      esEfectivo,
      esTicket,
      cuecId,
      bcoId,
      codigoRpt,
      descrip)
  }

  private val cuentaParser: RowParser[Cuenta] = {
      SqlParser.get[Int](C.CUE_ID) ~
      SqlParser.get[String](C.CUE_NAME) ~
      SqlParser.get[String](C.CUE_CODE) ~
      SqlParser.get[String](C.CUE_IDENTIFICACION_EXTERNA) ~
      SqlParser.get[Int](DBHelper.ACTIVE) ~
      SqlParser.get[Int](C.MON_ID) ~
      SqlParser.get[String](C.MON_NAME) ~
      SqlParser.get[Boolean](C.CUE_LLEVA_CENTRO_COSTO) ~
      SqlParser.get[Boolean](C.CUE_PRODUCTO) ~
      SqlParser.get[Boolean](C.CUE_ES_EFECTIVO) ~
      SqlParser.get[Boolean](C.CUE_ES_TICKET) ~
      SqlParser.get[Int](C.CUEC_ID) ~
      SqlParser.get[String](C.CUEC_NAME) ~
      SqlParser.get[Int](C.BCO_ID) ~
      SqlParser.get[String](C.BCO_NAME) ~
      SqlParser.get[String](C.CUE_CODIGO_RPT) ~
      SqlParser.get[String](C.CUE_DESCRIP) ~
      SqlParser.get[Date](DBHelper.CREATED_AT) ~
      SqlParser.get[Date](DBHelper.UPDATED_AT) ~
      SqlParser.get[Int](DBHelper.UPDATED_BY) map {
      case
              id ~
              name ~
              code ~
              identificacionExterna ~
              active ~
              monId ~
              monName ~
              llevaCentroCosto ~
              producto ~
              esEfectivo ~
              esTicket ~
              cuecId ~
              cuecName ~
              bcoId ~
              bcoName ~
              codigoRpt ~
              descrip  ~
              createdAt ~
              updatedAt ~
              updatedBy =>
        Cuenta(
              id,
              name,
              code,
              identificacionExterna,
              active != 0,
              monId,
              monName,
              llevaCentroCosto,
              producto,
              esEfectivo,
              esTicket,
              cuecId,
              cuecName,
              bcoId,
              bcoName,
              codigoRpt,
              descrip,
              createdAt,
              updatedAt,
              updatedBy)
    }
  }

  def create(user: CompanyUser, cuenta: Cuenta): Cuenta = {
    save(user, cuenta, true)
  }

  def update(user: CompanyUser, cuenta: Cuenta): Cuenta = {
    save(user, cuenta, false)
  }

  private def save(user: CompanyUser, cuenta: Cuenta, isNew: Boolean): Cuenta = {
    def getFields = {
      List(
        Field(C.CUE_NAME, cuenta.name, FieldType.text),
        Field(C.CUE_CODE, cuenta.code, FieldType.text),
        Field(C.CUE_IDENTIFICACION_EXTERNA, cuenta.identificacionExterna, FieldType.text),
        Field(DBHelper.ACTIVE, Register.boolToInt(cuenta.active), FieldType.id),
        Field(C.MON_ID, cuenta.monId, FieldType.id),
        Field(C.CUE_LLEVA_CENTRO_COSTO, cuenta.llevaCentroCosto, FieldType.boolean),
        Field(C.CUE_PRODUCTO, cuenta.producto, FieldType.boolean),
        Field(C.CUE_ES_EFECTIVO, cuenta.esEfectivo, FieldType.boolean),
        Field(C.CUE_ES_TICKET, cuenta.esTicket, FieldType.boolean),
        Field(C.CUEC_ID, cuenta.cuecId, FieldType.id),
        Field(C.BCO_ID, cuenta.bcoId, FieldType.text),
        Field(C.CUE_CODIGO_RPT, cuenta.codigoRpt, FieldType.text),
        Field(C.CUE_DESCRIP, cuenta.descrip, FieldType.text)
      )
    }
    def throwException = {
      throw new RuntimeException(s"Error when saving ${C.CUENTA}")
    }

    DBHelper.saveEx(
      user,
      Register(
        C.CUENTA,
        C.CUE_ID,
        cuenta.id,
        false,
        true,
        true,
        getFields),
      isNew,
      C.CUE_CODE
    ) match {
      case SaveResult(true, id) => load(user, id).getOrElse(throwException)
      case SaveResult(false, id) => throwException
    }
  }

  def load(user: CompanyUser, id: Int): Option[Cuenta] = {
    loadWhere(user, s"${C.CUE_ID} = {id}", 'id -> id)
  }

  def loadWhere(user: CompanyUser, where: String, args : scala.Tuple2[scala.Any, anorm.ParameterValue[_]]*) = {
    DB.withConnection(user.database.database) { implicit connection =>
      SQL(s"SELECT t1.*, t2.${C.MON_NAME}, t2.${C.CUEC_NAME}, t2.${C.BCO_NAME}" +
        s" FROM ${C.CUENTA} t1" +
        s" LEFT JOIN ${C.MONEDA} t2 ON t1.${C.MON_ID} = t2.${C.MON_ID}" +
        s" LEFT JOIN ${C.CUENTA_CATEGORIA} t3 ON t1.${C.CUEC_ID} = t3.${C.CUEC_ID}" +
        s" LEFT JOIN ${C.BANCO} t4 ON t1.${C.BCO_ID} = t4.${C.BCO_ID}" +
        s" WHERE $where")
        .on(args: _*)
        .as(cuentaParser.singleOpt)
    }
  }

  def delete(user: CompanyUser, id: Int) = {
    DB.withConnection(user.database.database) { implicit connection =>
      try {
        SQL(s"DELETE FROM ${C.CUENTA} WHERE ${C.CUE_ID} = {id}")
        .on('id -> id)
        .executeUpdate
      } catch {
        case NonFatal(e) => {
          Logger.error(s"can't delete a ${C.CUENTA}. ${C.CUE_ID} id: $id. Error ${e.toString}")
          throw e
        }
      }
    }
  }

  def get(user: CompanyUser, id: Int): Cuenta = {
    load(user, id) match {
      case Some(p) => p
      case None => emptyCuenta
    }
  }

  def info(user: CompanyUser, id: Int): CuentaInfo = {

    DB.withTransaction(user.database.database) { implicit connection =>

      val sql = "{call sp_cuenta_get_info(?, ?, ?)}"
      val cs = connection.prepareCall(sql)

      cs.setInt(1, id)
      cs.registerOutParameter(2, Types.INTEGER)
      cs.registerOutParameter(3, Types.INTEGER)

      try {
        cs.execute()

        CuentaInfo(
          cs.getInt(2),
          cs.getInt(3)
        )

      } catch {
        case NonFatal(e) => {
          Logger.error(s"can't get cuenta info with cueId $id for user ${user.toString}. Error ${e.toString}")
          throw e
        }
      } finally {
        cs.close
      }
    }
  }
}
