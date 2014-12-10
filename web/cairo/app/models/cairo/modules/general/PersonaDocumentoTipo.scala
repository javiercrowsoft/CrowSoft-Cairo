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

case class Personadocumentotipo(
              id: Int,
              name: String,
              code: String,
              active: Boolean,
              descrip: String,
              createdAt: Date,
              updatedAt: Date,
              updatedBy: Int) {

  def this(
      id: Int,
      name: String,
      code: String,
      active: Boolean,
      descrip: String) = {

    this(
      id,
      name,
      code,
      active,
      descrip,
      DateUtil.currentTime,
      DateUtil.currentTime,
      DBHelper.NoId)
  }

  def this(
      name: String,
      code: String,
      active: Boolean,
      descrip: String) = {

    this(
      DBHelper.NoId,
      name,
      code,
      active,
      descrip)

  }

}

object Personadocumentotipo {

  lazy val emptyPersonadocumentotipo = Personadocumentotipo(
    "",
    "",
    false,
    "")

  def apply(
      id: Int,
      name: String,
      code: String,
      active: Boolean,
      descrip: String) = {

    new Personadocumentotipo(
      id,
      name,
      code,
      active,
      descrip)
  }

  def apply(
      name: String,
      code: String,
      active: Boolean,
      descrip: String) = {

    new Personadocumentotipo(
      name,
      code,
      active,
      descrip)
  }

  private val personadocumentotipoParser: RowParser[Personadocumentotipo] = {
      SqlParser.get[Int](C.PRSDT_ID) ~
      SqlParser.get[String](C.PRSDT_NAME) ~
      SqlParser.get[String](C.PRSDT_CODE) ~
      SqlParser.get[Int](DBHelper.ACTIVE) ~
      SqlParser.get[String](C.PRSDT_DESCRIP) ~
      SqlParser.get[Date](DBHelper.CREATED_AT) ~
      SqlParser.get[Date](DBHelper.UPDATED_AT) ~
      SqlParser.get[Int](DBHelper.UPDATED_BY) map {
      case
              id ~
              name ~
              code ~
              active ~
              descrip  ~
              createdAt ~
              updatedAt ~
              updatedBy =>
        Personadocumentotipo(
              id,
              name,
              code,
              (if(active != 0) true else false),
              descrip,
              createdAt,
              updatedAt,
              updatedBy)
    }
  }

  def create(user: CompanyUser, personadocumentotipo: Personadocumentotipo): Personadocumentotipo = {
    save(user, personadocumentotipo, true)
  }

  def update(user: CompanyUser, personadocumentotipo: Personadocumentotipo): Personadocumentotipo = {
    save(user, personadocumentotipo, false)
  }

  private def save(user: CompanyUser, personadocumentotipo: Personadocumentotipo, isNew: Boolean): Personadocumentotipo = {
    def getFields = {
      List(
        Field(C.PRSDT_NAME, personadocumentotipo.name, FieldType.text),
        Field(C.PRSDT_CODE, personadocumentotipo.code, FieldType.text),
        Field(DBHelper.ACTIVE, (if(personadocumentotipo.active) 1 else 0), FieldType.boolean),
        Field(C.PRSDT_DESCRIP, personadocumentotipo.descrip, FieldType.text)
      )
    }
    def throwException = {
      throw new RuntimeException(s"Error when saving ${C.PERSONADOCUMENTOTIPO}")
    }

    DBHelper.saveEx(
      user,
      Register(
        C.PERSONADOCUMENTOTIPO,
        C.PRSDT_ID,
        personadocumentotipo.id,
        false,
        true,
        true,
        getFields),
      isNew,
      C.PRSDT_CODE
    ) match {
      case SaveResult(true, id) => load(user, id).getOrElse(throwException)
      case SaveResult(false, id) => throwException
    }
  }

  def load(user: CompanyUser, id: Int): Option[Personadocumentotipo] = {
    loadWhere(user, s"${C.PRSDT_ID} = {id}", 'id -> id)
  }

  def loadWhere(user: CompanyUser, where: String, args : scala.Tuple2[scala.Any, anorm.ParameterValue[_]]*) = {
    DB.withConnection(user.database.database) { implicit connection =>
      SQL(s"SELECT t1.*, t2.${C.FK_NAME} FROM ${C.PERSONADOCUMENTOTIPO} t1 INNER JOIN ${C.???} t2 ON t1.${C.FK_ID} = t2.${C.FK_ID} WHERE $where")
        .on(args: _*)
        .as(personadocumentotipoParser.singleOpt)
    }
  }

  def delete(user: CompanyUser, id: Int) = {
    DB.withConnection(user.database.database) { implicit connection =>
      try {
        SQL(s"DELETE FROM ${C.PERSONADOCUMENTOTIPO} WHERE ${C.PRSDT_ID} = {id}")
        .on('id -> id)
        .executeUpdate
      } catch {
        case NonFatal(e) => {
          Logger.error(s"can't delete a ${C.PERSONADOCUMENTOTIPO}. ${C.PRSDT_ID} id: $id. Error ${e.toString}")
          throw e
        }
      }
    }
  }

  def get(user: CompanyUser, id: Int): Personadocumentotipo = {
    load(user, id) match {
      case Some(p) => p
      case None => emptyPersonadocumentotipo
    }
  }
}

