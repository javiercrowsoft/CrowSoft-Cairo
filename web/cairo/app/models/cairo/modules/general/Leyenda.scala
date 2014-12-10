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

case class Leyenda(
              id: Int,
              name: String,
              code: String,
              active: Boolean,
              idmId: Int,
              idmName: String,
              descrip: String,
              leytexto: String,
              createdAt: Date,
              updatedAt: Date,
              updatedBy: Int) {

  def this(
      id: Int,
      name: String,
      code: String,
      active: Boolean,
      idmId: Int,
      descrip: String,
      leytexto: String) = {

    this(
      id,
      name,
      code,
      active,
      idmId,
      "",
      descrip,
      leytexto,
      DateUtil.currentTime,
      DateUtil.currentTime,
      DBHelper.NoId)
  }

  def this(
      name: String,
      code: String,
      active: Boolean,
      idmId: Int,
      descrip: String,
      leytexto: String) = {

    this(
      DBHelper.NoId,
      name,
      code,
      active,
      idmId,
      descrip,
      leytexto)

  }

}

object Leyenda {

  lazy val emptyLeyenda = Leyenda(
    "",
    "",
    falDBHelper.NoId,
    "",
    "",
    "")

  def apply(
      id: Int,
      name: String,
      code: String,
      active: Boolean,
      idmId: Int,
      descrip: String,
      leytexto: String) = {

    new Leyenda(
      id,
      name,
      code,
      active,
      idmId,
      descrip,
      leytexto)
  }

  def apply(
      name: String,
      code: String,
      active: Boolean,
      idmId: Int,
      descrip: String,
      leytexto: String) = {

    new Leyenda(
      name,
      code,
      active,
      idmId,
      descrip,
      leytexto)
  }

  private val leyendaParser: RowParser[Leyenda] = {
      SqlParser.get[Int](C.LEY_ID) ~
      SqlParser.get[String](C.LEY_NAME) ~
      SqlParser.get[String](C.LEY_CODE) ~
      SqlParser.get[Int](C.IDM_ID) ~
      SqlParser.get[String](C.IDM_NAME) ~
      SqlParser.get[String](C.IDM_ID) ~
      SqlParser.get[String](C.LEY_DESCRIP) ~
      SqlParser.get[String](C.LEYTEXTO) ~
      SqlParser.get[Date](DBHelper.CREATED_AT) ~
      SqlParser.get[Date](DBHelper.UPDATED_AT) ~
      SqlParser.get[Int](DBHelper.UPDATED_BY) map {
      case
              id ~
              name ~
              code ~
              active ~
              idmId ~
              idmName ~
              descrip ~
              leytexto  ~
              createdAt ~
              updatedAt ~
              updatedBy =>
        Leyenda(
              id,
              name,
              code,
              (if(active != 0) true else false),
              idmId,
              idmName,
              descrip,
              leytexto,
              createdAt,
              updatedAt,
              updatedBy)
    }
  }

  def create(user: CompanyUser, leyenda: Leyenda): Leyenda = {
    save(user, leyenda, true)
  }

  def update(user: CompanyUser, leyenda: Leyenda): Leyenda = {
    save(user, leyenda, false)
  }

  private def save(user: CompanyUser, leyenda: Leyenda, isNew: Boolean): Leyenda = {
    def getFields = {
      List(
        Field(C.LEY_NAME, leyenda.name, FieldType.text),
        Field(C.LEY_CODE, leyenda.code, FieldType.text),
        Field(DBHelper.ACTIVE, (if(leyenda.active) 1 else 0), FieldType.id),
        Field(C.IDM_ID, leyenda.idmId, FieldType.text),
        Field(C.LEY_DESCRIP, leyenda.descrip, FieldType.text),
        Field(C.LEYTEXTO, leyenda.leytexto, FieldType.text)
      )
    }
    def throwException = {
      throw new RuntimeException(s"Error when saving ${C.LEYENDA}")
    }

    DBHelper.saveEx(
      user,
      Register(
        C.LEYENDA,
        C.LEY_ID,
        leyenda.id,
        false,
        true,
        true,
        getFields),
      isNew,
      C.LEY_CODE
    ) match {
      case SaveResult(true, id) => load(user, id).getOrElse(throwException)
      case SaveResult(false, id) => throwException
    }
  }

  def load(user: CompanyUser, id: Int): Option[Leyenda] = {
    loadWhere(user, s"${C.LEY_ID} = {id}", 'id -> id)
  }

  def loadWhere(user: CompanyUser, where: String, args : scala.Tuple2[scala.Any, anorm.ParameterValue[_]]*) = {
    DB.withConnection(user.database.database) { implicit connection =>
      SQL(s"SELECT t1.*, t2.${C.FK_NAME} FROM ${C.LEYENDA} t1 INNER JOIN ${C.???} t2 ON t1.${C.FK_ID} = t2.${C.FK_ID} WHERE $where")
        .on(args: _*)
        .as(leyendaParser.singleOpt)
    }
  }

  def delete(user: CompanyUser, id: Int) = {
    DB.withConnection(user.database.database) { implicit connection =>
      try {
        SQL(s"DELETE FROM ${C.LEYENDA} WHERE ${C.LEY_ID} = {id}")
        .on('id -> id)
        .executeUpdate
      } catch {
        case NonFatal(e) => {
          Logger.error(s"can't delete a ${C.LEYENDA}. ${C.LEY_ID} id: $id. Error ${e.toString}")
          throw e
        }
      }
    }
  }

  def get(user: CompanyUser, id: Int): Leyenda = {
    load(user, id) match {
      case Some(p) => p
      case None => emptyLeyenda
    }
  }
}
