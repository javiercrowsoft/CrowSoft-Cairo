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

case class PercepcionTipo(
              id: Int,
              name: String,
              code: String,
              active: Boolean,
              generaSicore: Boolean,
              codigoSicore: String,
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
      generaSicore: Boolean,
      codigoSicore: String,
      cueId: Int,
      descrip: String) = {

    this(
      id,
      name,
      code,
      active,
      generaSicore,
      codigoSicore,
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
      generaSicore: Boolean,
      codigoSicore: String,
      cueId: Int,
      descrip: String) = {

    this(
      DBHelper.NoId,
      name,
      code,
      active,
      generaSicore,
      codigoSicore,
      cueId,
      descrip)

  }

}

object PercepcionTipo {

  lazy val emptyPercepcionTipo = PercepcionTipo(
    "",
    "",
    false,
    false,
    "",
    DBHelper.NoId,
    "")

  def apply(
      id: Int,
      name: String,
      code: String,
      active: Boolean,
      generaSicore: Boolean,
      codigoSicore: String,
      cueId: Int,
      descrip: String) = {

    new PercepcionTipo(
      id,
      name,
      code,
      active,
      generaSicore,
      codigoSicore,
      cueId,
      descrip)
  }

  def apply(
      name: String,
      code: String,
      active: Boolean,
      generaSicore: Boolean,
      codigoSicore: String,
      cueId: Int,
      descrip: String) = {

    new PercepcionTipo(
      name,
      code,
      active,
      generaSicore,
      codigoSicore,
      cueId,
      descrip)
  }

  private val percepcionTipoParser: RowParser[PercepcionTipo] = {
      SqlParser.get[Int](C.PERCT_ID) ~
      SqlParser.get[String](C.PERCT_NAME) ~
      SqlParser.get[String](C.PERCT_CODE) ~
      SqlParser.get[Int](DBHelper.ACTIVE) ~
      SqlParser.get[Int](C.PERCT_GENERA_SICORE) ~
      SqlParser.get[String](C.PERCT_CODIGO_SICORE) ~
      SqlParser.get[Int](C.CUE_ID) ~
      SqlParser.get[String](C.CUE_NAME) ~
      SqlParser.get[String](C.PERCT_DESCRIP) ~
      SqlParser.get[Date](DBHelper.CREATED_AT) ~
      SqlParser.get[Date](DBHelper.UPDATED_AT) ~
      SqlParser.get[Int](DBHelper.UPDATED_BY) map {
      case
              id ~
              name ~
              code ~
              active ~
              generaSicore ~
              codigoSicore ~
              cueId ~
              cueName ~
              descrip  ~
              createdAt ~
              updatedAt ~
              updatedBy =>
        PercepcionTipo(
              id,
              name,
              code,
              active != 0,
              generaSicore != 0,
              codigoSicore,
              cueId,
              cueName,
              descrip,
              createdAt,
              updatedAt,
              updatedBy)
    }
  }

  def create(user: CompanyUser, percepcionTipo: PercepcionTipo): PercepcionTipo = {
    save(user, percepcionTipo, true)
  }

  def update(user: CompanyUser, percepcionTipo: PercepcionTipo): PercepcionTipo = {
    save(user, percepcionTipo, false)
  }

  private def save(user: CompanyUser, percepcionTipo: PercepcionTipo, isNew: Boolean): PercepcionTipo = {
    def getFields = {
      List(
        Field(C.PERCT_NAME, percepcionTipo.name, FieldType.text),
        Field(C.PERCT_CODE, percepcionTipo.code, FieldType.text),
        Field(DBHelper.ACTIVE, (if(percepcionTipo.active) 1 else 0), FieldType.boolean),
        Field(C.PERCT_GENERA_SICORE, (if(percepcionTipo.generaSicore) 1 else 0), FieldType.boolean),
        Field(C.PERCT_CODIGO_SICORE, percepcionTipo.codigoSicore, FieldType.text),
        Field(C.CUE_ID, percepcionTipo.cueId, FieldType.id),
        Field(C.PERCT_DESCRIP, percepcionTipo.descrip, FieldType.text)
      )
    }
    def throwException = {
      throw new RuntimeException(s"Error when saving ${C.PERCEPCIONTIPO}")
    }

    DBHelper.saveEx(
      user,
      Register(
        C.PERCEPCIONTIPO,
        C.PERCT_ID,
        percepcionTipo.id,
        false,
        true,
        true,
        getFields),
      isNew,
      C.PERCT_CODE
    ) match {
      case SaveResult(true, id) => load(user, id).getOrElse(throwException)
      case SaveResult(false, id) => throwException
    }
  }

  def load(user: CompanyUser, id: Int): Option[PercepcionTipo] = {
    loadWhere(user, s"${C.PERCT_ID} = {id}", 'id -> id)
  }

  def loadWhere(user: CompanyUser, where: String, args : scala.Tuple2[scala.Any, anorm.ParameterValue[_]]*) = {
    DB.withConnection(user.database.database) { implicit connection =>
      SQL(s"SELECT t1.*, t2.${C.CUE_NAME}" +
        s" FROM ${C.PERCEPCIONTIPO} t1" +
        s" LEFT JOIN ${C.CUENTA} t2 ON t1.${C.CUE_ID} = t2.${C.CUE_ID} WHERE $where")
        .on(args: _*)
        .as(percepcionTipoParser.singleOpt)
    }
  }

  def delete(user: CompanyUser, id: Int) = {
    DB.withConnection(user.database.database) { implicit connection =>
      try {
        SQL(s"DELETE FROM ${C.PERCEPCIONTIPO} WHERE ${C.PERCT_ID} = {id}")
        .on('id -> id)
        .executeUpdate
      } catch {
        case NonFatal(e) => {
          Logger.error(s"can't delete a ${C.PERCEPCIONTIPO}. ${C.PERCT_ID} id: $id. Error ${e.toString}")
          throw e
        }
      }
    }
  }

  def get(user: CompanyUser, id: Int): PercepcionTipo = {
    load(user, id) match {
      case Some(p) => p
      case None => emptyPercepcionTipo
    }
  }
}

