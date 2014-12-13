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

case class PersonaDocumentoTipo(
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

object PersonaDocumentoTipo {

  lazy val emptyPersonaDocumentoTipo = PersonaDocumentoTipo(
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

    new PersonaDocumentoTipo(
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

    new PersonaDocumentoTipo(
      name,
      code,
      active,
      descrip)
  }

  private val personaDocumentoTipoParser: RowParser[PersonaDocumentoTipo] = {
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
        PersonaDocumentoTipo(
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

  def create(user: CompanyUser, personaDocumentoTipo: PersonaDocumentoTipo): PersonaDocumentoTipo = {
    save(user, personaDocumentoTipo, true)
  }

  def update(user: CompanyUser, personaDocumentoTipo: PersonaDocumentoTipo): PersonaDocumentoTipo = {
    save(user, personaDocumentoTipo, false)
  }

  private def save(user: CompanyUser, personaDocumentoTipo: PersonaDocumentoTipo, isNew: Boolean): PersonaDocumentoTipo = {
    def getFields = {
      List(
        Field(C.PRSDT_NAME, personaDocumentoTipo.name, FieldType.text),
        Field(C.PRSDT_CODE, personaDocumentoTipo.code, FieldType.text),
        Field(DBHelper.ACTIVE, (if(personaDocumentoTipo.active) 1 else 0), FieldType.boolean),
        Field(C.PRSDT_DESCRIP, personaDocumentoTipo.descrip, FieldType.text)
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
        personaDocumentoTipo.id,
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

  def load(user: CompanyUser, id: Int): Option[PersonaDocumentoTipo] = {
    loadWhere(user, s"${C.PRSDT_ID} = {id}", 'id -> id)
  }

  def loadWhere(user: CompanyUser, where: String, args : scala.Tuple2[scala.Any, anorm.ParameterValue[_]]*) = {
    DB.withConnection(user.database.database) { implicit connection =>
      SQL(s"SELECT t1.* FROM ${C.PERSONADOCUMENTOTIPO} t1 WHERE $where")
        .on(args: _*)
        .as(personaDocumentoTipoParser.singleOpt)
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

  def get(user: CompanyUser, id: Int): PersonaDocumentoTipo = {
    load(user, id) match {
      case Some(p) => p
      case None => emptyPersonaDocumentoTipo
    }
  }
}

