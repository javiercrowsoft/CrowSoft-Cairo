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

case class Cuentagrupo(
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

object Cuentagrupo {

  lazy val emptyCuentagrupo = Cuentagrupo(
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

    new Cuentagrupo(
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

    new Cuentagrupo(
      name,
      code,
      active,
      tipo,
      cueId,
      descrip)
  }

  private val cuentagrupoParser: RowParser[Cuentagrupo] = {
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
        Cuentagrupo(
              id,
              name,
              code,
              (if(active != 0) true else false),
              tipo,
              cueId,
              cueName,
              descrip,
              createdAt,
              updatedAt,
              updatedBy)
    }
  }

  def create(user: CompanyUser, cuentagrupo: Cuentagrupo): Cuentagrupo = {
    save(user, cuentagrupo, true)
  }

  def update(user: CompanyUser, cuentagrupo: Cuentagrupo): Cuentagrupo = {
    save(user, cuentagrupo, false)
  }

  private def save(user: CompanyUser, cuentagrupo: Cuentagrupo, isNew: Boolean): Cuentagrupo = {
    def getFields = {
      List(
        Field(C.CUEG_NAME, cuentagrupo.name, FieldType.text),
        Field(C.CUEG_CODE, cuentagrupo.code, FieldType.text),
        Field(DBHelper.ACTIVE, (if(cuentagrupo.active) 1 else 0), FieldType.boolean),
        Field(C.CUEG_TIPO, cuentagrupo.tipo, FieldType.integer),
        Field(C.CUE_ID, cuentagrupo.cueId, FieldType.id),
        Field(C.CUEG_DESCRIP, cuentagrupo.descrip, FieldType.text)
      )
    }
    def throwException = {
      throw new RuntimeException(s"Error when saving ${C.CUENTAGRUPO}")
    }

    DBHelper.saveEx(
      user,
      Register(
        C.CUENTAGRUPO,
        C.CUEG_ID,
        cuentagrupo.id,
        false,
        true,
        true,
        getFields),
      isNew,
      C.CUEG_CODE
    ) match {
      case SaveResult(true, id) => load(user, id).getOrElse(throwException)
      case SaveResult(false, id) => throwException
    }
  }

  def load(user: CompanyUser, id: Int): Option[Cuentagrupo] = {
    loadWhere(user, s"${C.CUEG_ID} = {id}", 'id -> id)
  }

  def loadWhere(user: CompanyUser, where: String, args : scala.Tuple2[scala.Any, anorm.ParameterValue[_]]*) = {
    DB.withConnection(user.database.database) { implicit connection =>
      SQL(s"SELECT t1.*, t2.${C.CUE_NAME} " +
        s"FROM ${C.CUENTAGRUPO} t1 " +
        s"LEFT JOIN ${C.CUENTA} t2 ON t1.${C.CUE_ID} = t2.${C.CUE_ID} WHERE $where")
        .on(args: _*)
        .as(cuentagrupoParser.singleOpt)
    }
  }

  def delete(user: CompanyUser, id: Int) = {
    DB.withConnection(user.database.database) { implicit connection =>
      try {
        SQL(s"DELETE FROM ${C.CUENTAGRUPO} WHERE ${C.CUEG_ID} = {id}")
        .on('id -> id)
        .executeUpdate
      } catch {
        case NonFatal(e) => {
          Logger.error(s"can't delete a ${C.CUENTAGRUPO}. ${C.CUEG_ID} id: $id. Error ${e.toString}")
          throw e
        }
      }
    }
  }

  def get(user: CompanyUser, id: Int): Cuentagrupo = {
    load(user, id) match {
      case Some(p) => p
      case None => emptyCuentagrupo
    }
  }
}

