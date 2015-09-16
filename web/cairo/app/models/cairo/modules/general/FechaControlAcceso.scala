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

case class FechaControlAcceso(
                               id: Int,
                               name: String,
                               code: String,
                               active: Boolean,
                               desde: Date,
                               hasta: Date,
                               createdAt: Date,
                               updatedAt: Date,
                               updatedBy: Int
                               ) {

  def this(
            id: Int,
            name: String,
            code: String,
            active: Boolean,
            desde: Date,
            hasta: Date) = {

    this(
      id,
      name,
      code,
      active,
      desde,
      hasta,
      DateUtil.currentTime,
      DateUtil.currentTime,
      DBHelper.NoId)
  }

  def this(
            name: String,
            code: String,
            active: Boolean,
            desde: Date,
            hasta: Date) = {

    this(
      DBHelper.NoId,
      name,
      code,
      active,
      desde,
      hasta)

  }

}

object FechaControlAcceso {

  lazy val emptyFechaControlAcceso = FechaControlAcceso(
    "",
    "",
    false,
    U.NO_DATE,
    U.NO_DATE)

  def apply(
             id: Int,
             name: String,
             code: String,
             active: Boolean,
             desde: Date,
             hasta: Date) = {

    new FechaControlAcceso(
      id,
      name,
      code,
      active,
      desde,
      hasta)
  }

  def apply(
             name: String,
             code: String,
             active: Boolean,
             desde: Date,
             hasta: Date) = {

    new FechaControlAcceso(
      name,
      code,
      active,
      desde,
      hasta)
  }

  private val fechaControlAccesoParser: RowParser[FechaControlAcceso] = {
      SqlParser.get[Int](C.FCA_ID) ~
      SqlParser.get[String](C.FCA_NAME) ~
      SqlParser.get[String](C.FCA_CODE) ~
      SqlParser.get[Int](DBHelper.ACTIVE) ~
      SqlParser.get[Date](C.FCA_FECHA_DESDE) ~
      SqlParser.get[Date](C.FCA_FECHA_HASTA) ~
      SqlParser.get[Date](DBHelper.CREATED_AT) ~
      SqlParser.get[Date](DBHelper.UPDATED_AT) ~
      SqlParser.get[Int](DBHelper.UPDATED_BY) map {
      case
          id ~
          name ~
          code ~
          active ~
          desde ~
          hasta ~
          createdAt ~
          updatedAt ~
          updatedBy =>
        FechaControlAcceso(
          id,
          name,
          code,
          active != 0,
          desde,
          hasta,
          createdAt,
          updatedAt,
          updatedBy)
    }
  }

  def create(user: CompanyUser, fechaControlAcceso: FechaControlAcceso): FechaControlAcceso = {
    save(user, fechaControlAcceso, true)
  }

  def update(user: CompanyUser, fechaControlAcceso: FechaControlAcceso): FechaControlAcceso = {
    save(user, fechaControlAcceso, false)
  }

  private def save(user: CompanyUser, fechaControlAcceso: FechaControlAcceso, isNew: Boolean): FechaControlAcceso = {
    def getFields = {
      List(
        Field(C.FCA_NAME, fechaControlAcceso.name, FieldType.text),
        Field(C.FCA_CODE, fechaControlAcceso.code, FieldType.text),
        Field(DBHelper.ACTIVE, (if(fechaControlAcceso.active) 1 else 0), FieldType.boolean),
        Field(C.FCA_FECHA_DESDE, fechaControlAcceso.desde, FieldType.text),
        Field(C.FCA_FECHA_HASTA, fechaControlAcceso.hasta, FieldType.text)
      )
    }
    def throwException = {
      throw new RuntimeException(s"Error when saving ${C.FECHA_CONTROL_ACCESO}")
    }

    DBHelper.saveEx(
      user,
      Register(
        C.FECHA_CONTROL_ACCESO,
        C.FCA_ID,
        fechaControlAcceso.id,
        false,
        true,
        true,
        getFields),
      isNew,
      C.FCA_CODE
    ) match {
      case SaveResult(true, id) => load(user, id).getOrElse(throwException)
      case SaveResult(false, id) => throwException
    }
  }

  def load(user: CompanyUser, id: Int): Option[FechaControlAcceso] = {
    loadWhere(user, s"${C.FCA_ID} = {id}", 'id -> id)
  }

  def loadWhere(user: CompanyUser, where: String, args : scala.Tuple2[scala.Any, anorm.ParameterValue[_]]*) = {
    DB.withConnection(user.database.database) { implicit connection =>
      SQL(s"SELECT * FROM ${C.FECHA_CONTROL_ACCESO} WHERE $where")
        .on(args: _*)
        .as(fechaControlAccesoParser.singleOpt)
    }
  }

  def delete(user: CompanyUser, id: Int) = {
    DB.withConnection(user.database.database) { implicit connection =>
      try {
        SQL(s"DELETE FROM ${C.FECHA_CONTROL_ACCESO} WHERE ${C.FCA_ID} = {id}")
          .on('id -> id)
          .executeUpdate
      } catch {
        case NonFatal(e) => {
          Logger.error(s"can't delete a ${C.FECHA_CONTROL_ACCESO}. ${C.FCA_ID} id: $id. Error ${e.toString}")
          throw e
        }
      }
    }
  }

  def get(user: CompanyUser, id: Int): FechaControlAcceso = {
    load(user, id) match {
      case Some(p) => p
      case None => emptyFechaControlAcceso
    }
  }
}