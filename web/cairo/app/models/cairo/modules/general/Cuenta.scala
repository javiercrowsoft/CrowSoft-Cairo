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

case class Cuenta(
              id: Int,
              name: String,
              code: String,
              identificacionExterna: String,
              active: Boolean,
              monId: Int,
              monName: Int,
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
              cuecDescrip: String,
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
      cuecDescrip: String) = {

    this(
      id,
      name,
      code,
      identificacionExterna,
      active,
      monId,
      "",
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
      cuecDescrip,
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
      cuecDescrip: String) = {

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
      cuecDescrip)

  }

}

object Cuenta {

  lazy val emptyCuenta = Cuenta(
    "",
    "",
    "",
    falDBHelper.NoId,
    DBHelper.NoId,
    false,
    false,
    false,
    false,
    DBHelper.NoDBHelper.NoId,
    "",
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
      cuecDescrip: String) = {

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
      cuecDescrip)
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
      cuecDescrip: String) = {

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
      cuecDescrip)
  }

  private val cuentaParser: RowParser[Cuenta] = {
      SqlParser.get[Int](C.CUE_ID) ~
      SqlParser.get[String](C.CUE_NAME) ~
      SqlParser.get[String](C.CUE_CODE) ~
      SqlParser.get[String](C.CUE_IDENTIFICACION_EXTERNA) ~
      SqlParser.get[Int](C.MON_ID) ~
      SqlParser.get[String](C.MON_NAME) ~
      SqlParser.get[Int](C.MON_ID) ~
      SqlParser.get[String](C.MON_NAME) ~
      SqlParser.get[Boolean](C.CUE_LLEVA_CENTRO_COSTO) ~
      SqlParser.get[Boolean](C.CUE_PRODUCTO) ~
      SqlParser.get[Boolean](C.CUE_ES_EFECTIVO) ~
      SqlParser.get[Boolean](C.CUE_ES_TICKET) ~
      SqlParser.get[Int](C.CUEC_ID) ~
      SqlParser.get[Int](C.BCO_ID) ~
      SqlParser.get[String](C.BCO_NAME) ~
      SqlParser.get[String](C.BCO_ID) ~
      SqlParser.get[String](C.CUE_CODIGO_RPT) ~
      SqlParser.get[String](C.CUEC_DESCRIP) ~
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
              cuecDescrip  ~
              createdAt ~
              updatedAt ~
              updatedBy =>
        Cuenta(
              id,
              name,
              code,
              identificacionExterna,
              (if(active != 0) true else false),
              monId,
              monName,
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
              cuecDescrip,
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
        Field(DBHelper.ACTIVE, (if(cuenta.active) 1 else 0), FieldType.id),
        Field(C.MON_ID, cuenta.monId, FieldType.id),
        Field(C.CUE_LLEVA_CENTRO_COSTO, cuenta.llevaCentroCosto, FieldType.boolean),
        Field(C.CUE_PRODUCTO, cuenta.producto, FieldType.boolean),
        Field(C.CUE_ES_EFECTIVO, cuenta.esEfectivo, FieldType.boolean),
        Field(C.CUE_ES_TICKET, cuenta.esTicket, FieldType.boolean),
        Field(C.CUEC_ID, cuenta.cuecId, FieldType.id),
        Field(C.BCO_ID, cuenta.bcoId, FieldType.text),
        Field(C.CUE_CODIGO_RPT, cuenta.codigoRpt, FieldType.text),
        Field(C.CUEC_DESCRIP, cuenta.cuecDescrip, FieldType.text)
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
      SQL(s"SELECT t1.*, t2.${C.FK_NAME} FROM ${C.CUENTA} t1 LEFT JOIN ${C.???} t2 ON t1.${C.FK_ID} = t2.${C.FK_ID} WHERE $where")
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
}
