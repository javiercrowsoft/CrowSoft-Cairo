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

case class Gasto(
              id: Int,
              name: String,
              code: String,
              active: Boolean,
              tipo: String,
              fijo: Double,
              minimo: Double,
              porcentaje: Double,
              importe: Double,
              monId: Int,
              monName: String,
              tiId: Int,
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
      tipo: String,
      fijo: Double,
      minimo: Double,
      porcentaje: Double,
      importe: Double,
      monId: Int,
      tiId: Int,
      descrip: String) = {

    this(
      id,
      name,
      code,
      active,
      tipo,
      fijo,
      minimo,
      porcentaje,
      importe,
      monId,
      "",
      tiId,
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
      tipo: String,
      fijo: Double,
      minimo: Double,
      porcentaje: Double,
      importe: Double,
      monId: Int,
      tiId: Int,
      descrip: String) = {

    this(
      DBHelper.NoId,
      name,
      code,
      active,
      tipo,
      fijo,
      minimo,
      porcentaje,
      importe,
      monId,
      tiId,
      descrip)

  }

}

object Gasto {

  lazy val emptyGasto = Gasto(
    "",
    "",
    false,
    "",
    0,
    0,
    0,
    0,
    DBHelper.NoId,
    DBHelper.NoId,
    "")

  def apply(
      id: Int,
      name: String,
      code: String,
      active: Boolean,
      tipo: String,
      fijo: Double,
      minimo: Double,
      porcentaje: Double,
      importe: Double,
      monId: Int,
      tiId: Int,
      descrip: String) = {

    new Gasto(
      id,
      name,
      code,
      active,
      tipo,
      fijo,
      minimo,
      porcentaje,
      importe,
      monId,
      tiId,
      descrip)
  }

  def apply(
      name: String,
      code: String,
      active: Boolean,
      tipo: String,
      fijo: Double,
      minimo: Double,
      porcentaje: Double,
      importe: Double,
      monId: Int,
      tiId: Int,
      descrip: String) = {

    new Gasto(
      name,
      code,
      active,
      tipo,
      fijo,
      minimo,
      porcentaje,
      importe,
      monId,
      tiId,
      descrip)
  }

  private val gastoParser: RowParser[Gasto] = {
      SqlParser.get[Int](C.GTO_ID) ~
      SqlParser.get[String](C.GTO_NAME) ~
      SqlParser.get[String](C.GTO_CODE) ~
      SqlParser.get[Int](DBHelper.ACTIVE) ~
      SqlParser.get[String](C.GTO_TIPO) ~
      SqlParser.get[Double](C.GTO_FIJO) ~
      SqlParser.get[Double](C.GTO_MINIMO) ~
      SqlParser.get[Double](C.GTO_PORCENTAJE) ~
      SqlParser.get[Double](C.GTO_IMPORTE) ~
      SqlParser.get[Int](C.MON_ID) ~
      SqlParser.get[String](C.MON_NAME) ~
      SqlParser.get[Int](C.TI_ID) ~
      SqlParser.get[String](C.TI_NAME) ~
      SqlParser.get[String](C.GTO_DESCRIP) ~
      SqlParser.get[Date](DBHelper.CREATED_AT) ~
      SqlParser.get[Date](DBHelper.UPDATED_AT) ~
      SqlParser.get[Int](DBHelper.UPDATED_BY) map {
      case
              id ~
              name ~
              code ~
              active ~
              tipo ~
              fijo ~
              minimo ~
              porcentaje ~
              importe ~
              monId ~
              monName ~
              tiId ~
              tiName ~
              descrip  ~
              createdAt ~
              updatedAt ~
              updatedBy =>
        Gasto(
              id,
              name,
              code,
              active != 0,
              tipo,
              fijo,
              minimo,
              porcentaje,
              importe,
              monId,
              monName,
              tiId,
              tiName,
              descrip,
              createdAt,
              updatedAt,
              updatedBy)
    }
  }

  def create(user: CompanyUser, gasto: Gasto): Gasto = {
    save(user, gasto, true)
  }

  def update(user: CompanyUser, gasto: Gasto): Gasto = {
    save(user, gasto, false)
  }

  private def save(user: CompanyUser, gasto: Gasto, isNew: Boolean): Gasto = {
    def getFields = {
      List(
        Field(C.GTO_NAME, gasto.name, FieldType.text),
        Field(C.GTO_CODE, gasto.code, FieldType.text),
        Field(DBHelper.ACTIVE, (if(gasto.active) 1 else 0), FieldType.boolean),
        Field(C.GTO_TIPO, gasto.tipo, FieldType.text),
        Field(C.GTO_FIJO, gasto.fijo, FieldType.number),
        Field(C.GTO_MINIMO, gasto.minimo, FieldType.number),
        Field(C.GTO_PORCENTAJE, gasto.porcentaje, FieldType.number),
        Field(C.GTO_IMPORTE, gasto.importe, FieldType.number),
        Field(C.MON_ID, gasto.monId, FieldType.id),
        Field(C.TI_ID, gasto.tiId, FieldType.id),
        Field(C.GTO_DESCRIP, gasto.descrip, FieldType.text)
      )
    }
    def throwException = {
      throw new RuntimeException(s"Error when saving ${C.GASTO}")
    }

    DBHelper.saveEx(
      user,
      Register(
        C.GASTO,
        C.GTO_ID,
        gasto.id,
        false,
        true,
        true,
        getFields),
      isNew,
      C.GTO_CODE
    ) match {
      case SaveResult(true, id) => load(user, id).getOrElse(throwException)
      case SaveResult(false, id) => throwException
    }
  }

  def load(user: CompanyUser, id: Int): Option[Gasto] = {
    loadWhere(user, s"${C.GTO_ID} = {id}", 'id -> id)
  }

  def loadWhere(user: CompanyUser, where: String, args : scala.Tuple2[scala.Any, anorm.ParameterValue[_]]*) = {
    DB.withConnection(user.database.database) { implicit connection =>
      SQL(s"SELECT t1.*, t2.${C.MON_NAME}, t3.${C.TI_NAME}" +
        s" FROM ${C.GASTO} t1" +
        s" LEFT JOIN ${C.MONEDA} t2 ON t1.${C.MON_ID} = t2.${C.MON_ID}" +
        s" LEFT JOIN ${C.TASA_IMPOSITIVA} t3 ON t1.${C.TI_ID} = t3.${C.TI_ID} WHERE $where")
        .on(args: _*)
        .as(gastoParser.singleOpt)
    }
  }

  def delete(user: CompanyUser, id: Int) = {
    DB.withConnection(user.database.database) { implicit connection =>
      try {
        SQL(s"DELETE FROM ${C.GASTO} WHERE ${C.GTO_ID} = {id}")
        .on('id -> id)
        .executeUpdate
      } catch {
        case NonFatal(e) => {
          Logger.error(s"can't delete a ${C.GASTO}. ${C.GTO_ID} id: $id. Error ${e.toString}")
          throw e
        }
      }
    }
  }

  def get(user: CompanyUser, id: Int): Gasto = {
    load(user, id) match {
      case Some(p) => p
      case None => emptyGasto
    }
  }
}

