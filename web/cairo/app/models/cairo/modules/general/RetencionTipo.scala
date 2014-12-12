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

case class Retenciontipo(
              id: Int,
              name: String,
              code: String,
              active: Boolean,
              generaSicore: Boolean,
              codigoSicore: String,
              cueId: Int,
              cueName: String,
              tipo:               descrip: String,
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
      tipo:       descrip: String) = {

    this(
      id,
      name,
      code,
      active,
      generaSicore,
      codigoSicore,
      cueId,
      "",
      tipo,
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
      tipo:       descrip: String) = {

    this(
      DBHelper.NoId,
      name,
      code,
      active,
      generaSicore,
      codigoSicore,
      cueId,
      tipo,
      descrip)

  }

}

object Retenciontipo {

  lazy val emptyRetenciontipo = Retenciontipo(
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
      tipo:       descrip: String) = {

    new Retenciontipo(
      id,
      name,
      code,
      active,
      generaSicore,
      codigoSicore,
      cueId,
      tipo,
      descrip)
  }

  def apply(
      name: String,
      code: String,
      active: Boolean,
      generaSicore: Boolean,
      codigoSicore: String,
      cueId: Int,
      tipo:       descrip: String) = {

    new Retenciontipo(
      name,
      code,
      active,
      generaSicore,
      codigoSicore,
      cueId,
      tipo,
      descrip)
  }

  private val retencionTipoParser: RowParser[Retenciontipo] = {
      SqlParser.get[Int](C.RETT_ID) ~
      SqlParser.get[String](C.RETT_NAME) ~
      SqlParser.get[String](C.RETT_CODE) ~
      SqlParser.get[Int](DBHelper.ACTIVE) ~
      SqlParser.get[Boolean](C.RETT_GENERA_SICORE) ~
      SqlParser.get[String](C.RETT_CODIGO_SICORE) ~
      SqlParser.get[Int](C.CUE_ID) ~
      SqlParser.get[String](C.CUE_NAME) ~
      SqlParser.get[String](C.RETT_DESCRIP) ~
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
              tipo ~
              descrip  ~
              createdAt ~
              updatedAt ~
              updatedBy =>
        Retenciontipo(
              id,
              name,
              code,
              (if(active != 0) true else false),
              generaSicore,
              codigoSicore,
              cueId,
              cueName,
              tipo,
              descrip,
              createdAt,
              updatedAt,
              updatedBy)
    }
  }

  def create(user: CompanyUser, retencionTipo: Retenciontipo): Retenciontipo = {
    save(user, retencionTipo, true)
  }

  def update(user: CompanyUser, retencionTipo: Retenciontipo): Retenciontipo = {
    save(user, retencionTipo, false)
  }

  private def save(user: CompanyUser, retencionTipo: Retenciontipo, isNew: Boolean): Retenciontipo = {
    def getFields = {
      List(
        Field(C.RETT_NAME, retencionTipo.name, FieldType.text),
        Field(C.RETT_CODE, retencionTipo.code, FieldType.text),
        Field(DBHelper.ACTIVE, (if(retencionTipo.active) 1 else 0), FieldType.boolean),
        Field(C.RETT_GENERA_SICORE, retencionTipo.generaSicore, FieldType.boolean),
        Field(C.RETT_CODIGO_SICORE, retencionTipo.codigoSicore, FieldType.text),
        Field(C.CUE_ID, retencionTipo.cueId, FieldType.id),
        Field(C.RETT_DESCRIP, retencionTipo.descrip, FieldType.text)
      )
    }
    def throwException = {
      throw new RuntimeException(s"Error when saving ${C.RETENCIONTIPO}")
    }

    DBHelper.saveEx(
      user,
      Register(
        C.RETENCIONTIPO,
        C.RETT_ID,
        retencionTipo.id,
        false,
        true,
        true,
        getFields),
      isNew,
      C.RETT_CODE
    ) match {
      case SaveResult(true, id) => load(user, id).getOrElse(throwException)
      case SaveResult(false, id) => throwException
    }
  }

  def load(user: CompanyUser, id: Int): Option[Retenciontipo] = {
    loadWhere(user, s"${C.RETT_ID} = {id}", 'id -> id)
  }

  def loadWhere(user: CompanyUser, where: String, args : scala.Tuple2[scala.Any, anorm.ParameterValue[_]]*) = {
    DB.withConnection(user.database.database) { implicit connection =>
      SQL(s"SELECT t1.*, t2.${C.CUE_NAME} FROM ${C.RETENCIONTIPO} t1" +
        s" LEFT JOIN ${C.CUENTA} t2 ON t1.${C.CUE_ID} = t2.${C.CUE_ID} WHERE $where")
        .on(args: _*)
        .as(retencionTipoParser.singleOpt)
    }
  }

  def delete(user: CompanyUser, id: Int) = {
    DB.withConnection(user.database.database) { implicit connection =>
      try {
        SQL(s"DELETE FROM ${C.RETENCIONTIPO} WHERE ${C.RETT_ID} = {id}")
        .on('id -> id)
        .executeUpdate
      } catch {
        case NonFatal(e) => {
          Logger.error(s"can't delete a ${C.RETENCIONTIPO}. ${C.RETT_ID} id: $id. Error ${e.toString}")
          throw e
        }
      }
    }
  }

  def get(user: CompanyUser, id: Int): Retenciontipo = {
    load(user, id) match {
      case Some(p) => p
      case None => emptyRetenciontipo
    }
  }
}

