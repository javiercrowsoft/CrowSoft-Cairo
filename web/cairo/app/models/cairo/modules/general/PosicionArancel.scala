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

case class PosicionArancel(
              id: Int,
              name: String,
              code: String,
              active: Boolean,
              tiIdDerechos: Int,
              tiDerechos: String,
              tiIdEstadistica: Int,
              tiEstadistica: String,
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

object PosicionArancel {

  lazy val emptyPosicionArancel = PosicionArancel(
    "",
    "",
    false,
    DBHelper.NoId,
    DBHelper.NoId,
    "")

  def apply(
      id: Int,
      name: String,
      code: String,
      active: Boolean,
      tiIdDerechos: Int,
      tiIdEstadistica: Int,
      descrip: String) = {

    new PosicionArancel(
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

    new PosicionArancel(
      name,
      code,
      active,
      tiIdDerechos,
      tiIdEstadistica,
      descrip)
  }

  private val posicionArancelParser: RowParser[PosicionArancel] = {
      SqlParser.get[Int](C.POAR_ID) ~
      SqlParser.get[String](C.POAR_NAME) ~
      SqlParser.get[String](C.POAR_CODE) ~
      SqlParser.get[Int](DBHelper.ACTIVE) ~
      SqlParser.get[Int](C.TI_ID_DERECHOS) ~
      SqlParser.get[String](C.TI_DERECHOS) ~
      SqlParser.get[Int](C.TI_ID_ESTADISTICA) ~
      SqlParser.get[String](C.TI_ESTADISTICA) ~
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
              tiDerechos ~
              tiIdEstadistica ~
              tiEstadistica ~
              descrip  ~
              createdAt ~
              updatedAt ~
              updatedBy =>
        PosicionArancel(
              id,
              name,
              code,
              active != 0,
              tiIdDerechos,
              tiDerechos,
              tiIdEstadistica,
              tiEstadistica,
              descrip,
              createdAt,
              updatedAt,
              updatedBy)
    }
  }

  def create(user: CompanyUser, posicionArancel: PosicionArancel): PosicionArancel = {
    save(user, posicionArancel, true)
  }

  def update(user: CompanyUser, posicionArancel: PosicionArancel): PosicionArancel = {
    save(user, posicionArancel, false)
  }

  private def save(user: CompanyUser, posicionArancel: PosicionArancel, isNew: Boolean): PosicionArancel = {
    def getFields = {
      List(
        Field(C.POAR_NAME, posicionArancel.name, FieldType.text),
        Field(C.POAR_CODE, posicionArancel.code, FieldType.text),
        Field(DBHelper.ACTIVE, Register.boolToInt(posicionArancel.active), FieldType.boolean),
        Field(C.TI_ID_DERECHOS, posicionArancel.tiIdDerechos, FieldType.id),
        Field(C.TI_ID_ESTADISTICA, posicionArancel.tiIdEstadistica, FieldType.text),
        Field(C.POAR_DESCRIP, posicionArancel.descrip, FieldType.text)
      )
    }
    def throwException = {
      throw new RuntimeException(s"Error when saving ${C.POSICION_ARANCEL}")
    }

    DBHelper.saveEx(
      user,
      Register(
        C.POSICION_ARANCEL,
        C.POAR_ID,
        posicionArancel.id,
        false,
        true,
        true,
        getFields),
      isNew,
      C.POAR_CODE
    ) match {
      case SaveResult(true, id) => load(user, id).getOrElse(throwException)
      case SaveResult(false, _) => throwException
    }
  }

  def load(user: CompanyUser, id: Int): Option[PosicionArancel] = {
    loadWhere(user, s"${C.POAR_ID} = {id}", 'id -> id)
  }

  def loadWhere(user: CompanyUser, where: String, args : scala.Tuple2[scala.Any, anorm.ParameterValue[_]]*) = {
    DB.withConnection(user.database.database) { implicit connection =>
      SQL(s"SELECT t1.*, t2.${C.TI_NAME} AS ${C.TI_DERECHOS}, t3.${C.TI_NAME} AS ${C.TI_ESTADISTICA}" +
        s" FROM ${C.POSICION_ARANCEL} t1" +
        s" LEFT JOIN ${C.TASA_IMPOSITIVA} t2 ON t1.${C.TI_ID_DERECHOS} = t2.${C.TI_ID}" +
        s" LEFT JOIN ${C.TASA_IMPOSITIVA} t3 ON t1.${C.TI_ID_ESTADISTICA} = t3.${C.TI_ID} WHERE $where")
        .on(args: _*)
        .as(posicionArancelParser.singleOpt)
    }
  }

  def delete(user: CompanyUser, id: Int) = {
    DB.withConnection(user.database.database) { implicit connection =>
      try {
        SQL(s"DELETE FROM ${C.POSICION_ARANCEL} WHERE ${C.POAR_ID} = {id}")
        .on('id -> id)
        .executeUpdate
      } catch {
        case NonFatal(e) => {
          Logger.error(s"can't delete a ${C.POSICION_ARANCEL}. ${C.POAR_ID} id: $id. Error ${e.toString}")
          throw e
        }
      }
    }
  }

  def get(user: CompanyUser, id: Int): PosicionArancel = {
    load(user, id) match {
      case Some(p) => p
      case None => emptyPosicionArancel
    }
  }
}

