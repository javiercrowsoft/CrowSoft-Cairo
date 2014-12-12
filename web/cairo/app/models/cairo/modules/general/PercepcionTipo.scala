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

case class Percepciontipo(
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

object Percepciontipo {

  lazy val emptyPercepciontipo = Percepciontipo(
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

    new Percepciontipo(
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

    new Percepciontipo(
      name,
      code,
      active,
      generaSicore,
      codigoSicore,
      cueId,
      descrip)
  }

  private val percepciontipoParser: RowParser[Percepciontipo] = {
      SqlParser.get[Int](C.PERCT_ID) ~
      SqlParser.get[String](C.PERCT_NAME) ~
      SqlParser.get[String](C.PERCT_CODE) ~
      SqlParser.get[Int](DBHelper.ACTIVE) ~
      SqlParser.get[Boolean](C.PERCT_GENERA_SICORE) ~
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
        Percepciontipo(
              id,
              name,
              code,
              (if(active != 0) true else false),
              generaSicore,
              codigoSicore,
              cueId,
              cueName,
              descrip,
              createdAt,
              updatedAt,
              updatedBy)
    }
  }

  def create(user: CompanyUser, percepciontipo: Percepciontipo): Percepciontipo = {
    save(user, percepciontipo, true)
  }

  def update(user: CompanyUser, percepciontipo: Percepciontipo): Percepciontipo = {
    save(user, percepciontipo, false)
  }

  private def save(user: CompanyUser, percepciontipo: Percepciontipo, isNew: Boolean): Percepciontipo = {
    def getFields = {
      List(
        Field(C.PERCT_NAME, percepciontipo.name, FieldType.text),
        Field(C.PERCT_CODE, percepciontipo.code, FieldType.text),
        Field(DBHelper.ACTIVE, (if(percepciontipo.active) 1 else 0), FieldType.boolean),
        Field(C.PERCT_GENERA_SICORE, percepciontipo.generaSicore, FieldType.boolean),
        Field(C.PERCT_CODIGO_SICORE, percepciontipo.codigoSicore, FieldType.text),
        Field(C.CUE_ID, percepciontipo.cueId, FieldType.id),
        Field(C.PERCT_DESCRIP, percepciontipo.descrip, FieldType.text)
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
        percepciontipo.id,
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

  def load(user: CompanyUser, id: Int): Option[Percepciontipo] = {
    loadWhere(user, s"${C.PERCT_ID} = {id}", 'id -> id)
  }

  def loadWhere(user: CompanyUser, where: String, args : scala.Tuple2[scala.Any, anorm.ParameterValue[_]]*) = {
    DB.withConnection(user.database.database) { implicit connection =>
      SQL(s"SELECT t1.*, t2.${C.CUE_NAME}" +
        s" FROM ${C.PERCEPCIONTIPO} t1" +
        s" LEFT JOIN ${C.CUENTA} t2 ON t1.${C.CUE_ID} = t2.${C.CUE_ID} WHERE $where")
        .on(args: _*)
        .as(percepciontipoParser.singleOpt)
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

  def get(user: CompanyUser, id: Int): Percepciontipo = {
    load(user, id) match {
      case Some(p) => p
      case None => emptyPercepciontipo
    }
  }
}

