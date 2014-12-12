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

case class Tasaimpositiva(
              id: Int,
              name: String,
              code: String,
              active: Boolean,
              porcentaje: Double,
              cuecId: Int,
              cuecName: String,
              codigoDgi1: String,
              codigoDgi2: String,
              tipo: Int,
              createdAt: Date,
              updatedAt: Date,
              updatedBy: Int) {

  def this(
      id: Int,
      name: String,
      code: String,
      active: Boolean,
      porcentaje: Double,
      cuecId: Int,
      codigoDgi1: String,
      codigoDgi2: String,
      tipo: Int) = {

    this(
      id,
      name,
      code,
      active,
      porcentaje,
      cuecId,
      "",
      codigoDgi1,
      codigoDgi2,
      tipo,
      DateUtil.currentTime,
      DateUtil.currentTime,
      DBHelper.NoId)
  }

  def this(
      name: String,
      code: String,
      active: Boolean,
      porcentaje: Double,
      cuecId: Int,
      codigoDgi1: String,
      codigoDgi2: String,
      tipo: Int) = {

    this(
      DBHelper.NoId,
      name,
      code,
      active,
      porcentaje,
      cuecId,
      codigoDgi1,
      codigoDgi2,
      tipo)

  }

}

object Tasaimpositiva {

  lazy val emptyTasaimpositiva = Tasaimpositiva(
    "",
    "",
    false,
    0,
    DBHelper.NoId,
    "",
    "",
    0)

  def apply(
      id: Int,
      name: String,
      code: String,
      active: Boolean,
      porcentaje: Double,
      cuecId: Int,
      codigoDgi1: String,
      codigoDgi2: String,
      tipo: Int) = {

    new Tasaimpositiva(
      id,
      name,
      code,
      active,
      porcentaje,
      cuecId,
      codigoDgi1,
      codigoDgi2,
      tipo)
  }

  def apply(
      name: String,
      code: String,
      active: Boolean,
      porcentaje: Double,
      cuecId: Int,
      codigoDgi1: String,
      codigoDgi2: String,
      tipo: Int) = {

    new Tasaimpositiva(
      name,
      code,
      active,
      porcentaje,
      cuecId,
      codigoDgi1,
      codigoDgi2,
      tipo)
  }

  private val tasaimpositivaParser: RowParser[Tasaimpositiva] = {
      SqlParser.get[Int](C.TI_ID) ~
      SqlParser.get[String](C.TI_NAME) ~
      SqlParser.get[String](C.TI_CODE) ~
      SqlParser.get[Int](DBHelper.ACTIVE) ~
      SqlParser.get[Double](C.TI_PORCENTAJE) ~
      SqlParser.get[Int](C.CUEC_ID) ~
      SqlParser.get[String](C.CUEC_NAME) ~
      SqlParser.get[String](C.TI_CODIGO_DGI1) ~
      SqlParser.get[String](C.TI_CODIGO_DGI2) ~
      SqlParser.get[Int](C.TI_TIPO) ~
      SqlParser.get[Date](DBHelper.CREATED_AT) ~
      SqlParser.get[Date](DBHelper.UPDATED_AT) ~
      SqlParser.get[Int](DBHelper.UPDATED_BY) map {
      case
              id ~
              name ~
              code ~
              active ~
              porcentaje ~
              cuecId ~
              cuecName ~
              codigoDgi1 ~
              codigoDgi2 ~
              tipo  ~
              createdAt ~
              updatedAt ~
              updatedBy =>
        Tasaimpositiva(
              id,
              name,
              code,
              (if(active != 0) true else false),
              porcentaje,
              cuecId,
              cuecName,
              codigoDgi1,
              codigoDgi2,
              tipo,
              createdAt,
              updatedAt,
              updatedBy)
    }
  }

  def create(user: CompanyUser, tasaimpositiva: Tasaimpositiva): Tasaimpositiva = {
    save(user, tasaimpositiva, true)
  }

  def update(user: CompanyUser, tasaimpositiva: Tasaimpositiva): Tasaimpositiva = {
    save(user, tasaimpositiva, false)
  }

  private def save(user: CompanyUser, tasaimpositiva: Tasaimpositiva, isNew: Boolean): Tasaimpositiva = {
    def getFields = {
      List(
        Field(C.TI_NAME, tasaimpositiva.name, FieldType.text),
        Field(C.TI_CODE, tasaimpositiva.code, FieldType.text),
        Field(DBHelper.ACTIVE, (if(tasaimpositiva.active) 1 else 0), FieldType.boolean),
        Field(C.TI_PORCENTAJE, tasaimpositiva.porcentaje, FieldType.number),
        Field(C.CUEC_ID, tasaimpositiva.cuecId, FieldType.id),
        Field(C.TI_CODIGO_DGI1, tasaimpositiva.codigoDgi1, FieldType.text),
        Field(C.TI_CODIGO_DGI2, tasaimpositiva.codigoDgi2, FieldType.text),
        Field(C.TI_TIPO, tasaimpositiva.tipo, FieldType.integer)
      )
    }
    def throwException = {
      throw new RuntimeException(s"Error when saving ${C.TASA_IMPOSITIVA}")
    }

    DBHelper.saveEx(
      user,
      Register(
        C.TASA_IMPOSITIVA,
        C.TI_ID,
        tasaimpositiva.id,
        false,
        true,
        true,
        getFields),
      isNew,
      C.TI_CODE
    ) match {
      case SaveResult(true, id) => load(user, id).getOrElse(throwException)
      case SaveResult(false, id) => throwException
    }
  }

  def load(user: CompanyUser, id: Int): Option[Tasaimpositiva] = {
    loadWhere(user, s"${C.TI_ID} = {id}", 'id -> id)
  }

  def loadWhere(user: CompanyUser, where: String, args : scala.Tuple2[scala.Any, anorm.ParameterValue[_]]*) = {
    DB.withConnection(user.database.database) { implicit connection =>
      SQL(s"SELECT t1.*, t2.${C.CUEC_NAME}" +
        s" FROM ${C.TASA_IMPOSITIVA} t1" +
        s" LEFT JOIN ${C.CUENTA} t2 ON t1.${C.CUE_ID} = t2.${C.CUE_ID} WHERE $where")
        .on(args: _*)
        .as(tasaimpositivaParser.singleOpt)
    }
  }

  def delete(user: CompanyUser, id: Int) = {
    DB.withConnection(user.database.database) { implicit connection =>
      try {
        SQL(s"DELETE FROM ${C.TASA_IMPOSITIVA} WHERE ${C.TI_ID} = {id}")
        .on('id -> id)
        .executeUpdate
      } catch {
        case NonFatal(e) => {
          Logger.error(s"can't delete a ${C.TASA_IMPOSITIVA}. ${C.TI_ID} id: $id. Error ${e.toString}")
          throw e
        }
      }
    }
  }

  def get(user: CompanyUser, id: Int): Tasaimpositiva = {
    load(user, id) match {
      case Some(p) => p
      case None => emptyTasaimpositiva
    }
  }
}

