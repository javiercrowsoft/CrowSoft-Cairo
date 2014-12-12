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

case class Feriado(
              id: Int,
              name: String,
              code: String,
              dia: Int,
              mes: Int,
              anio: Int,
              recurrente: Boolean,
              banco: Boolean,
              laboral: Boolean,
              local: Boolean,
              paId: Int,
              paName: String,
              proId: Int,
              proName: String,
              descrip: String,
              createdAt: Date,
              updatedAt: Date,
              updatedBy: Int) {

  def this(
      id: Int,
      name: String,
      code: String,
      dia: Int,
      mes: Int,
      anio: Int,
      recurrente: Boolean,
      banco: Boolean,
      laboral: Boolean,
      local: Boolean,
      paId: Int,
      proId: Int,
      descrip: String) = {

    this(
      id,
      name,
      code,
      dia,
      mes,
      anio,
      recurrente,
      banco,
      laboral,
      local,
      paId,
      "",
      proId,
      "",
      descrip,
      DateUtil.currentTime,
      DateUtil.currentTime,
      DBHelper.NoId)
  }

  def this(
      name: String,
      code: String,
      dia: Int,
      mes: Int,
      anio: Int,
      recurrente: Boolean,
      banco: Boolean,
      laboral: Boolean,
      local: Boolean,
      paId: Int,
      proId: Int,
      descrip: String) = {

    this(
      DBHelper.NoId,
      name,
      code,
      dia,
      mes,
      anio,
      recurrente,
      banco,
      laboral,
      local,
      paId,
      proId,
      descrip)

  }

}

object Feriado {

  lazy val emptyFeriado = Feriado(
    "",
    "",
    null,
    null,
    null,
    false,
    false,
    false,
    false,
    DBHelper.NoId,
    DBHelper.NoId,
    "")

  def apply(
      id: Int,
      name: String,
      code: String,
      dia: Int,
      mes: Int,
      anio: Int,
      recurrente: Boolean,
      banco: Boolean,
      laboral: Boolean,
      local: Boolean,
      paId: Int,
      proId: Int,
      descrip: String) = {

    new Feriado(
      id,
      name,
      code,
      dia,
      mes,
      anio,
      recurrente,
      banco,
      laboral,
      local,
      paId,
      proId,
      descrip)
  }

  def apply(
      name: String,
      code: String,
      dia: Int,
      mes: Int,
      anio: Int,
      recurrente: Boolean,
      banco: Boolean,
      laboral: Boolean,
      local: Boolean,
      paId: Int,
      proId: Int,
      descrip: String) = {

    new Feriado(
      name,
      code,
      dia,
      mes,
      anio,
      recurrente,
      banco,
      laboral,
      local,
      paId,
      proId,
      descrip)
  }

  private val feriadoParser: RowParser[Feriado] = {
      SqlParser.get[Int](C.FE_ID) ~
      SqlParser.get[String](C.FE_NAME) ~
      SqlParser.get[String](C.FE_CODE) ~
      SqlParser.get[Int](C.FE_DIA) ~
      SqlParser.get[Int](C.FE_MES) ~
      SqlParser.get[Int](C.FE_ANIO) ~
      SqlParser.get[Boolean](C.FE_RECURRENTE) ~
      SqlParser.get[Boolean](C.FE_BANCO) ~
      SqlParser.get[Boolean](C.FE_LABORAL) ~
      SqlParser.get[Boolean](C.FE_LOCAL) ~
      SqlParser.get[Int](C.PA_ID) ~
      SqlParser.get[String](C.PA_NAME) ~
      SqlParser.get[Int](C.PRO_ID) ~
      SqlParser.get[String](C.PRO_NAME) ~
      SqlParser.get[String](C.FE_DESCRIP) ~
      SqlParser.get[Date](DBHelper.CREATED_AT) ~
      SqlParser.get[Date](DBHelper.UPDATED_AT) ~
      SqlParser.get[Int](DBHelper.UPDATED_BY) map {
      case
              id ~
              name ~
              code ~
              dia ~
              mes ~
              anio ~
              recurrente ~
              banco ~
              laboral ~
              local ~
              paId ~
              paName ~
              proId ~
              proName ~
              descrip  ~
              createdAt ~
              updatedAt ~
              updatedBy =>
        Feriado(
              id,
              name,
              code,
              dia,
              mes,
              anio,
              recurrente,
              banco,
              laboral,
              local,
              paId,
              paName,
              proId,
              proName,
              descrip,
              createdAt,
              updatedAt,
              updatedBy)
    }
  }

  def create(user: CompanyUser, feriado: Feriado): Feriado = {
    save(user, feriado, true)
  }

  def update(user: CompanyUser, feriado: Feriado): Feriado = {
    save(user, feriado, false)
  }

  private def save(user: CompanyUser, feriado: Feriado, isNew: Boolean): Feriado = {
    def getFields = {
      List(
        Field(C.FE_NAME, feriado.name, FieldType.text),
        Field(C.FE_CODE, feriado.code, FieldType.text),
        Field(C.FE_DIA, feriado.dia, FieldType.number),
        Field(C.FE_MES, feriado.mes, FieldType.number),
        Field(C.FE_ANIO, feriado.anio, FieldType.number),
        Field(C.FE_RECURRENTE, feriado.recurrente, FieldType.boolean),
        Field(C.FE_BANCO, feriado.banco, FieldType.boolean),
        Field(C.FE_LABORAL, feriado.laboral, FieldType.boolean),
        Field(C.FE_LOCAL, feriado.local, FieldType.boolean),
        Field(C.PA_ID, feriado.paId, FieldType.id),
        Field(C.PRO_ID, feriado.proId, FieldType.id),
        Field(C.FE_DESCRIP, feriado.descrip, FieldType.text)
      )
    }
    def throwException = {
      throw new RuntimeException(s"Error when saving ${C.FERIADO}")
    }

    DBHelper.saveEx(
      user,
      Register(
        C.FERIADO,
        C.FE_ID,
        feriado.id,
        false,
        true,
        true,
        getFields),
      isNew,
      C.FE_CODE
    ) match {
      case SaveResult(true, id) => load(user, id).getOrElse(throwException)
      case SaveResult(false, id) => throwException
    }
  }

  def load(user: CompanyUser, id: Int): Option[Feriado] = {
    loadWhere(user, s"${C.FE_ID} = {id}", 'id -> id)
  }

  def loadWhere(user: CompanyUser, where: String, args : scala.Tuple2[scala.Any, anorm.ParameterValue[_]]*) = {
    DB.withConnection(user.database.database) { implicit connection =>
      SQL(s"SELECT t1.*, t2.${C.PRO_NAME}" +
        s" FROM ${C.FERIADO} t1" +
        s" LEFT JOIN ${C.PROVINCIA} t2 ON t1.${C.PRO_ID} = t2.${C.PRO_ID} WHERE $where")
        .on(args: _*)
        .as(feriadoParser.singleOpt)
    }
  }

  def delete(user: CompanyUser, id: Int) = {
    DB.withConnection(user.database.database) { implicit connection =>
      try {
        SQL(s"DELETE FROM ${C.FERIADO} WHERE ${C.FE_ID} = {id}")
        .on('id -> id)
        .executeUpdate
      } catch {
        case NonFatal(e) => {
          Logger.error(s"can't delete a ${C.FERIADO}. ${C.FE_ID} id: $id. Error ${e.toString}")
          throw e
        }
      }
    }
  }

  def get(user: CompanyUser, id: Int): Feriado = {
    load(user, id) match {
      case Some(p) => p
      case None => emptyFeriado
    }
  }
}
