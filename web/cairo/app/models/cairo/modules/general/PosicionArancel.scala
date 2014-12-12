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

case class Posicionarancel(
              id: Int,
              name: String,
              code: String,
              active: Boolean,
              tiIdDerechos: Int,
              tiName: String,
              tiIdEstadistica: Int,
              tiName: String,
              descrip: String,
              createdAt: Date,
              updatedAt: Date,
              updatedBy: Int) {

  def this(
      id: Int,
      name: String,
      code: String,
      active: Boolean,
      tiIdDerechos: Int,
      tiIdEstadistica: Int,
      descrip: String) = {

    this(
      id,
      name,
      code,
      active,
      tiIdDerechos,
      "",
      tiIdEstadistica,
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
      tiIdDerechos: Int,
      tiIdEstadistica: Int,
      descrip: String) = {

    this(
      DBHelper.NoId,
      name,
      code,
      active,
      tiIdDerechos,
      tiIdEstadistica,
      descrip)

  }

}

object Posicionarancel {

  lazy val emptyPosicionarancel = Posicionarancel(
    "",
    "",
    falDBHelper.NoId,
    DBHelper.NoId,
    "",
    "")

  def apply(
      id: Int,
      name: String,
      code: String,
      active: Boolean,
      tiIdDerechos: Int,
      tiIdEstadistica: Int,
      descrip: String) = {

    new Posicionarancel(
      id,
      name,
      code,
      active,
      tiIdDerechos,
      tiIdEstadistica,
      descrip)
  }

  def apply(
      name: String,
      code: String,
      active: Boolean,
      tiIdDerechos: Int,
      tiIdEstadistica: Int,
      descrip: String) = {

    new Posicionarancel(
      name,
      code,
      active,
      tiIdDerechos,
      tiIdEstadistica,
      descrip)
  }

  private val posicionarancelParser: RowParser[Posicionarancel] = {
      SqlParser.get[Int](C.POAR_ID) ~
      SqlParser.get[String](C.POAR_NAME) ~
      SqlParser.get[String](C.POAR_CODE) ~
      SqlParser.get[Int](C.TI_ID_DERECHOS) ~
      SqlParser.get[String](C.TI_NAME) ~
      SqlParser.get[Int](C.TI_ID_ESTADISTICA) ~
      SqlParser.get[String](C.TI_NAME) ~
      SqlParser.get[String](C.TI_ID_ESTADISTICA) ~
      SqlParser.get[String](C.POAR_DESCRIP) ~
      SqlParser.get[Date](DBHelper.CREATED_AT) ~
      SqlParser.get[Date](DBHelper.UPDATED_AT) ~
      SqlParser.get[Int](DBHelper.UPDATED_BY) map {
      case
              id ~
              name ~
              code ~
              active ~
              tiIdDerechos ~
              tiName ~
              tiIdEstadistica ~
              tiName ~
              descrip  ~
              createdAt ~
              updatedAt ~
              updatedBy =>
        Posicionarancel(
              id,
              name,
              code,
              (if(active != 0) true else false),
              tiIdDerechos,
              tiName,
              tiIdEstadistica,
              tiName,
              descrip,
              createdAt,
              updatedAt,
              updatedBy)
    }
  }

  def create(user: CompanyUser, posicionarancel: Posicionarancel): Posicionarancel = {
    save(user, posicionarancel, true)
  }

  def update(user: CompanyUser, posicionarancel: Posicionarancel): Posicionarancel = {
    save(user, posicionarancel, false)
  }

  private def save(user: CompanyUser, posicionarancel: Posicionarancel, isNew: Boolean): Posicionarancel = {
    def getFields = {
      List(
        Field(C.POAR_NAME, posicionarancel.name, FieldType.text),
        Field(C.POAR_CODE, posicionarancel.code, FieldType.text),
        Field(DBHelper.ACTIVE, (if(posicionarancel.active) 1 else 0), FieldType.id),
        Field(C.TI_ID_DERECHOS, posicionarancel.tiIdDerechos, FieldType.id),
        Field(C.TI_ID_ESTADISTICA, posicionarancel.tiIdEstadistica, FieldType.text),
        Field(C.POAR_DESCRIP, posicionarancel.descrip, FieldType.text)
      )
    }
    def throwException = {
      throw new RuntimeException(s"Error when saving ${C.POSICIONARANCEL}")
    }

    DBHelper.saveEx(
      user,
      Register(
        C.POSICIONARANCEL,
        C.POAR_ID,
        posicionarancel.id,
        false,
        true,
        true,
        getFields),
      isNew,
      C.POAR_CODE
    ) match {
      case SaveResult(true, id) => load(user, id).getOrElse(throwException)
      case SaveResult(false, id) => throwException
    }
  }

  def load(user: CompanyUser, id: Int): Option[Posicionarancel] = {
    loadWhere(user, s"${C.POAR_ID} = {id}", 'id -> id)
  }

  def loadWhere(user: CompanyUser, where: String, args : scala.Tuple2[scala.Any, anorm.ParameterValue[_]]*) = {
    DB.withConnection(user.database.database) { implicit connection =>
      SQL(s"SELECT t1.*, t2.${C.TI_NAME}, t3.${C.TI_NAME}" +
        s" FROM ${C.POSICIONARANCEL} t1" +
        s" LEFT JOIN ${C.TASAIMPOSITIVA} t2 ON t1.${C.TI_ID} = t2.${C.TI_ID}" +
        s" LEFT JOIN ${C.TASAIMPOSITIVA} t3 ON t1.${C.TI_ID} = t2.${C.TI_ID} WHERE $where")
        .on(args: _*)
        .as(posicionarancelParser.singleOpt)
    }
  }

  def delete(user: CompanyUser, id: Int) = {
    DB.withConnection(user.database.database) { implicit connection =>
      try {
        SQL(s"DELETE FROM ${C.POSICIONARANCEL} WHERE ${C.POAR_ID} = {id}")
        .on('id -> id)
        .executeUpdate
      } catch {
        case NonFatal(e) => {
          Logger.error(s"can't delete a ${C.POSICIONARANCEL}. ${C.POAR_ID} id: $id. Error ${e.toString}")
          throw e
        }
      }
    }
  }

  def get(user: CompanyUser, id: Int): Posicionarancel = {
    load(user, id) match {
      case Some(p) => p
      case None => emptyPosicionarancel
    }
  }
}

