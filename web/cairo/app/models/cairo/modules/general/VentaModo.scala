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

case class VentaModo(
              id: Int,
              name: String,
              code: String,
              active: Boolean,
              ctaCte: Int,
              pv: Boolean,
              os: Boolean,
              cobz: Boolean,
              cmvxi: Boolean,
              cueId: Int,
              cueName: String,
              descrip: String,
              createdAt: Date,
              updatedAt: Date,
              updatedBy: Int) {

  def this(
      id: Int,
      name: String,
      code: String,
      active: Boolean,
      ctaCte: Int,
      pv: Boolean,
      os: Boolean,
      cobz: Boolean,
      cmvxi: Boolean,
      cueId: Int,
      descrip: String) = {

    this(
      id,
      name,
      code,
      active,
      ctaCte,
      pv,
      os,
      cobz,
      cmvxi,
      cueId,
      "",
      descrip,
      DateUtil.currentTime,
      DateUtil.currentTime,
      DBHelper.NoId)
  }

  def this(
      name: String,
      code: String,
      active: Boolean,
      ctaCte: Int,
      pv: Boolean,
      os: Boolean,
      cobz: Boolean,
      cmvxi: Boolean,
      cueId: Int,
      descrip: String) = {

    this(
      DBHelper.NoId,
      name,
      code,
      active,
      ctaCte,
      pv,
      os,
      cobz,
      cmvxi,
      cueId,
      descrip)

  }

}

object VentaModo {

  lazy val emptyVentamodo = VentaModo(
    "",
    "",
    false,
    0,
    false,
    false,
    false,
    false,
    DBHelper.NoId,
    "")

  def apply(
      id: Int,
      name: String,
      code: String,
      active: Boolean,
      ctaCte: Int,
      pv: Boolean,
      os: Boolean,
      cobz: Boolean,
      cmvxi: Boolean,
      cueId: Int,
      descrip: String) = {

    new VentaModo(
      id,
      name,
      code,
      active,
      ctaCte,
      pv,
      os,
      cobz,
      cmvxi,
      cueId,
      descrip)
  }

  def apply(
      name: String,
      code: String,
      active: Boolean,
      ctaCte: Int,
      pv: Boolean,
      os: Boolean,
      cobz: Boolean,
      cmvxi: Boolean,
      cueId: Int,
      descrip: String) = {

    new VentaModo(
      name,
      code,
      active,
      ctaCte,
      pv,
      os,
      cobz,
      cmvxi,
      cueId,
      descrip)
  }

  private val ventamodoParser: RowParser[VentaModo] = {
      SqlParser.get[Int](C.VM_ID) ~
      SqlParser.get[String](C.VM_NAME) ~
      SqlParser.get[String](C.VM_CODE) ~
      SqlParser.get[Int](DBHelper.ACTIVE) ~
      SqlParser.get[Int](C.VM_CTA_CTE) ~
      SqlParser.get[Int](C.VM_PV) ~
      SqlParser.get[Int](C.VM_OS) ~
      SqlParser.get[Int](C.VM_COBZ) ~
      SqlParser.get[Int](C.VM_CMVXI) ~
      SqlParser.get[Int](C.CUE_ID) ~
      SqlParser.get[String](C.CUE_NAME) ~
      SqlParser.get[String](C.VM_DESCRIP) ~
      SqlParser.get[Date](DBHelper.CREATED_AT) ~
      SqlParser.get[Date](DBHelper.UPDATED_AT) ~
      SqlParser.get[Int](DBHelper.UPDATED_BY) map {
      case
              id ~
              name ~
              code ~
              active ~
              ctaCte ~
              pv ~
              os ~
              cobz ~
              cmvxi ~
              cueId ~
              cueName ~
              descrip  ~
              createdAt ~
              updatedAt ~
              updatedBy =>
        VentaModo(
              id,
              name,
              code,
              active != 0,
              ctaCte,
              pv != 0,
              os != 0,
              cobz != 0,
              cmvxi != 0,
              cueId,
              cueName,
              descrip,
              createdAt,
              updatedAt,
              updatedBy)
    }
  }

  def create(user: CompanyUser, ventamodo: VentaModo): VentaModo = {
    save(user, ventamodo, true)
  }

  def update(user: CompanyUser, ventamodo: VentaModo): VentaModo = {
    save(user, ventamodo, false)
  }

  private def save(user: CompanyUser, ventamodo: VentaModo, isNew: Boolean): VentaModo = {
    def getFields = {
      List(
        Field(C.VM_NAME, ventamodo.name, FieldType.text),
        Field(C.VM_CODE, ventamodo.code, FieldType.text),
        Field(DBHelper.ACTIVE, Register.boolToInt(ventamodo.active), FieldType.boolean),
        Field(C.VM_CTA_CTE, ventamodo.ctaCte, FieldType.integer),
        Field(C.VM_PV, ventamodo.pv, FieldType.boolean),
        Field(C.VM_OS, ventamodo.os, FieldType.boolean),
        Field(C.VM_COBZ, ventamodo.cobz, FieldType.boolean),
        Field(C.VM_CMVXI, ventamodo.cmvxi, FieldType.boolean),
        Field(C.CUE_ID, ventamodo.cueId, FieldType.id),
        Field(C.VM_DESCRIP, ventamodo.descrip, FieldType.text)
      )
    }
    def throwException = {
      throw new RuntimeException(s"Error when saving ${C.VENTA_MODO}")
    }

    DBHelper.saveEx(
      user,
      Register(
        C.VENTA_MODO,
        C.VM_ID,
        ventamodo.id,
        false,
        true,
        true,
        getFields),
      isNew,
      C.VM_CODE
    ) match {
      case SaveResult(true, id) => load(user, id).getOrElse(throwException)
      case SaveResult(false, _) => throwException
    }
  }

  def load(user: CompanyUser, id: Int): Option[VentaModo] = {
    loadWhere(user, s"${C.VM_ID} = {id}", 'id -> id)
  }

  def loadWhere(user: CompanyUser, where: String, args : scala.Tuple2[scala.Any, anorm.ParameterValue[_]]*) = {
    DB.withConnection(user.database.database) { implicit connection =>
      SQL(s"SELECT t1.*, t2.${C.CUE_NAME}" +
        s" FROM ${C.VENTA_MODO} t1" +
        s" LEFT JOIN ${C.CUENTA} t2 ON t1.${C.CUE_ID} = t2.${C.CUE_ID} WHERE $where")
        .on(args: _*)
        .as(ventamodoParser.singleOpt)
    }
  }

  def delete(user: CompanyUser, id: Int) = {
    DB.withConnection(user.database.database) { implicit connection =>
      try {
        SQL(s"DELETE FROM ${C.VENTA_MODO} WHERE ${C.VM_ID} = {id}")
        .on('id -> id)
        .executeUpdate
      } catch {
        case NonFatal(e) => {
          Logger.error(s"can't delete a ${C.VENTA_MODO}. ${C.VM_ID} id: $id. Error ${e.toString}")
          throw e
        }
      }
    }
  }

  def get(user: CompanyUser, id: Int): VentaModo = {
    load(user, id) match {
      case Some(p) => p
      case None => emptyVentamodo
    }
  }

  def list(user: CompanyUser) = {
    DB.withConnection(user.database.database) { implicit connection =>
      SQL(s"SELECT t1.*, t2.${C.CUE_NAME} FROM ${C.VENTA_MODO} t1 INNER JOIN ${C.CUENTA} t2 ON t1.${C.CUE_ID} = t2.${C.CUE_ID} WHERE ${C.VM_PV} <> 0 AND t1.${DBHelper.ACTIVE} <> 0 ORDER BY ${C.VM_CODE}").as(ventamodoParser *)
    }
  }
}
