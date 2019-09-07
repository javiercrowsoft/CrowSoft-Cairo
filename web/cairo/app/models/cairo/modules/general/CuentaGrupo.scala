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

case class CuentaGrupo(
              id: Int,
              name: String,
              code: String,
              active: Boolean,
              tipo: Int,
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
      tipo: Int,
      cueId: Int,
      descrip: String) = {

    this(
      id,
      name,
      code,
      active,
      tipo,
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
      tipo: Int,
      cueId: Int,
      descrip: String) = {

    this(
      DBHelper.NoId,
      name,
      code,
      active,
      tipo,
      cueId,
      descrip)

  }

}

object CuentaGrupo {

  lazy val emptyCuentaGrupo = CuentaGrupo(
    "",
    "",
    false,
    0,
    DBHelper.NoId,
    "")

  def apply(
      id: Int,
      name: String,
      code: String,
      active: Boolean,
      tipo: Int,
      cueId: Int,
      descrip: String) = {

    new CuentaGrupo(
      id,
      name,
      code,
      active,
      tipo,
      cueId,
      descrip)
  }

  def apply(
      name: String,
      code: String,
      active: Boolean,
      tipo: Int,
      cueId: Int,
      descrip: String) = {

    new CuentaGrupo(
      name,
      code,
      active,
      tipo,
      cueId,
      descrip)
  }

  private val cuentaGrupoParser: RowParser[CuentaGrupo] = {
      SqlParser.get[Int](C.CUEG_ID) ~
      SqlParser.get[String](C.CUEG_NAME) ~
      SqlParser.get[String](C.CUEG_CODE) ~
      SqlParser.get[Int](DBHelper.ACTIVE) ~
      SqlParser.get[Int](C.CUEG_TIPO) ~
      SqlParser.get[Int](C.CUE_ID) ~
      SqlParser.get[String](C.CUE_NAME) ~
      SqlParser.get[String](C.CUEG_DESCRIP) ~
      SqlParser.get[Date](DBHelper.CREATED_AT) ~
      SqlParser.get[Date](DBHelper.UPDATED_AT) ~
      SqlParser.get[Int](DBHelper.UPDATED_BY) map {
      case
              id ~
              name ~
              code ~
              active ~
              tipo ~
              cueId ~
              cueName ~
              descrip  ~
              createdAt ~
              updatedAt ~
              updatedBy =>
        CuentaGrupo(
              id,
              name,
              code,
              active != 0,
              tipo,
              cueId,
              cueName,
              descrip,
              createdAt,
              updatedAt,
              updatedBy)
    }
  }

  def create(user: CompanyUser, cuentaGrupo: CuentaGrupo): CuentaGrupo = {
    save(user, cuentaGrupo, true)
  }

  def update(user: CompanyUser, cuentaGrupo: CuentaGrupo): CuentaGrupo = {
    save(user, cuentaGrupo, false)
  }

  private def save(user: CompanyUser, cuentaGrupo: CuentaGrupo, isNew: Boolean): CuentaGrupo = {
    def getFields = {
      List(
        Field(C.CUEG_NAME, cuentaGrupo.name, FieldType.text),
        Field(C.CUEG_CODE, cuentaGrupo.code, FieldType.text),
        Field(DBHelper.ACTIVE, Register.boolToInt(cuentaGrupo.active), FieldType.boolean),
        Field(C.CUEG_TIPO, cuentaGrupo.tipo, FieldType.integer),
        Field(C.CUE_ID, cuentaGrupo.cueId, FieldType.id),
        Field(C.CUEG_DESCRIP, cuentaGrupo.descrip, FieldType.text)
      )
    }
    def throwException = {
      throw new RuntimeException(s"Error when saving ${C.CUENTA_GRUPO}")
    }

    DBHelper.saveEx(
      user,
      Register(
        C.CUENTA_GRUPO,
        C.CUEG_ID,
        cuentaGrupo.id,
        false,
        true,
        true,
        getFields),
      isNew,
      C.CUEG_CODE
    ) match {
      case SaveResult(true, id) => load(user, id).getOrElse(throwException)
      case SaveResult(false, _) => throwException
    }
  }

  def load(user: CompanyUser, id: Int): Option[CuentaGrupo] = {
    loadWhere(user, s"${C.CUEG_ID} = {id}", 'id -> id)
  }

  def loadWhere(user: CompanyUser, where: String, args : scala.Tuple2[scala.Any, anorm.ParameterValue[_]]*) = {
    DB.withConnection(user.database.database) { implicit connection =>
      SQL(s"SELECT t1.*, t2.${C.CUE_NAME} " +
        s"FROM ${C.CUENTA_GRUPO} t1 " +
        s"LEFT JOIN ${C.CUENTA} t2 ON t1.${C.CUE_ID} = t2.${C.CUE_ID} WHERE $where")
        .on(args: _*)
        .as(cuentaGrupoParser.singleOpt)
    }
  }

  def delete(user: CompanyUser, id: Int) = {
    DB.withConnection(user.database.database) { implicit connection =>
      try {
        SQL(s"DELETE FROM ${C.CUENTA_GRUPO} WHERE ${C.CUEG_ID} = {id}")
        .on('id -> id)
        .executeUpdate
      } catch {
        case NonFatal(e) => {
          Logger.error(s"can't delete a ${C.CUENTA_GRUPO}. ${C.CUEG_ID} id: $id. Error ${e.toString}")
          throw e
        }
      }
    }
  }

  def get(user: CompanyUser, id: Int): CuentaGrupo = {
    load(user, id) match {
      case Some(p) => p
      case None => emptyCuentaGrupo
    }
  }
}

