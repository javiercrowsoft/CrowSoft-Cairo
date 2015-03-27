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

case class Marca(
              id: Int,
              name: String,
              code: String,
              active: Boolean,
              descrip: String,
              textoWeb: String,
              createdAt: Date,
              updatedAt: Date,
              updatedBy: Int) {

  def this(
      id: Int,
      name: String,
      code: String,
      active: Boolean,
      descrip: String,
      textoWeb: String) = {

    this(
      id,
      name,
      code,
      active,
      descrip,
      textoWeb,
      DateUtil.currentTime,
      DateUtil.currentTime,
      DBHelper.NoId)
  }

  def this(
      name: String,
      code: String,
      active: Boolean,
      descrip: String,
      textoWeb: String) = {

    this(
      DBHelper.NoId,
      name,
      code,
      active,
      descrip,
      textoWeb)

  }

}

object Marca {

  lazy val emptyMarca = Marca(
    "",
    "",
    false,
    "",
    "")

  def apply(
      id: Int,
      name: String,
      code: String,
      active: Boolean,
      descrip: String,
      textoWeb: String) = {

    new Marca(
      id,
      name,
      code,
      active,
      descrip,
      textoWeb)
  }

  def apply(
      name: String,
      code: String,
      active: Boolean,
      descrip: String,
      textoWeb: String) = {

    new Marca(
      name,
      code,
      active,
      descrip,
      textoWeb)
  }

  private val marcaParser: RowParser[Marca] = {
      SqlParser.get[Int](C.MARC_ID) ~
      SqlParser.get[String](C.MARC_NAME) ~
      SqlParser.get[String](C.MARC_CODE) ~
      SqlParser.get[Int](DBHelper.ACTIVE) ~
      SqlParser.get[String](C.MARC_DESCRIP) ~
      SqlParser.get[String](C.MARC_TEXTO_WEB) ~
      SqlParser.get[Date](DBHelper.CREATED_AT) ~
      SqlParser.get[Date](DBHelper.UPDATED_AT) ~
      SqlParser.get[Int](DBHelper.UPDATED_BY) map {
      case
              id ~
              name ~
              code ~
              active ~
              descrip ~
              textoWeb  ~
              createdAt ~
              updatedAt ~
              updatedBy =>
        Marca(
              id,
              name,
              code,
              active != 0,
              descrip,
              textoWeb,
              createdAt,
              updatedAt,
              updatedBy)
    }
  }

  def create(user: CompanyUser, marca: Marca): Marca = {
    save(user, marca, true)
  }

  def update(user: CompanyUser, marca: Marca): Marca = {
    save(user, marca, false)
  }

  private def save(user: CompanyUser, marca: Marca, isNew: Boolean): Marca = {
    def getFields = {
      List(
        Field(C.MARC_NAME, marca.name, FieldType.text),
        Field(C.MARC_CODE, marca.code, FieldType.text),
        Field(DBHelper.ACTIVE, (if(marca.active) 1 else 0), FieldType.boolean),
        Field(C.MARC_DESCRIP, marca.descrip, FieldType.text),
        Field(C.MARC_TEXTO_WEB, marca.textoWeb, FieldType.text)
      )
    }
    def throwException = {
      throw new RuntimeException(s"Error when saving ${C.MARCA}")
    }

    DBHelper.saveEx(
      user,
      Register(
        C.MARCA,
        C.MARC_ID,
        marca.id,
        false,
        true,
        true,
        getFields),
      isNew,
      C.MARC_CODE
    ) match {
      case SaveResult(true, id) => load(user, id).getOrElse(throwException)
      case SaveResult(false, id) => throwException
    }
  }

  def load(user: CompanyUser, id: Int): Option[Marca] = {
    loadWhere(user, s"${C.MARC_ID} = {id}", 'id -> id)
  }

  def loadWhere(user: CompanyUser, where: String, args : scala.Tuple2[scala.Any, anorm.ParameterValue[_]]*) = {
    DB.withConnection(user.database.database) { implicit connection =>
      SQL(s"SELECT t1.* FROM ${C.MARCA} t1 WHERE $where")
        .on(args: _*)
        .as(marcaParser.singleOpt)
    }
  }

  def delete(user: CompanyUser, id: Int) = {
    DB.withConnection(user.database.database) { implicit connection =>
      try {
        SQL(s"DELETE FROM ${C.MARCA} WHERE ${C.MARC_ID} = {id}")
        .on('id -> id)
        .executeUpdate
      } catch {
        case NonFatal(e) => {
          Logger.error(s"can't delete a ${C.MARCA}. ${C.MARC_ID} id: $id. Error ${e.toString}")
          throw e
        }
      }
    }
  }

  def get(user: CompanyUser, id: Int): Marca = {
    load(user, id) match {
      case Some(p) => p
      case None => emptyMarca
    }
  }
}

