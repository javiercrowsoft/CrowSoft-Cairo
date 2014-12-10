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

case class Listapreciomarcado(
              id: Int,
              name: String,
              code: String,
              active: Boolean,
              base: Double,
              porcentaje: Double,
              salto: Double,
              decremento: Double,
              porcminimo: Double,
              porcmaximo: Double,
              montominimo: Double,
              monId: Int,
              monName: String,
              descrip: String,
              createdAt: Date,
              updatedAt: Date,
              updatedBy: Int) {

  def this(
      id: Int,
      name: String,
      code: String,
      active: Boolean,
      base: Double,
      porcentaje: Double,
      salto: Double,
      decremento: Double,
      porcminimo: Double,
      porcmaximo: Double,
      montominimo: Double,
      monId: Int,
      descrip: String) = {

    this(
      id,
      name,
      code,
      active,
      base,
      porcentaje,
      salto,
      decremento,
      porcminimo,
      porcmaximo,
      montominimo,
      monId,
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
      base: Double,
      porcentaje: Double,
      salto: Double,
      decremento: Double,
      porcminimo: Double,
      porcmaximo: Double,
      montominimo: Double,
      monId: Int,
      descrip: String) = {

    this(
      DBHelper.NoId,
      name,
      code,
      active,
      base,
      porcentaje,
      salto,
      decremento,
      porcminimo,
      porcmaximo,
      montominimo,
      monId,
      descrip)

  }

}

object Listapreciomarcado {

  lazy val emptyListapreciomarcado = Listapreciomarcado(
    "",
    "",
    false,
    0,
    0,
    0,
    0,
    0,
    0,
    DBHelper.NoId,
    "",
    "")

  def apply(
      id: Int,
      name: String,
      code: String,
      active: Boolean,
      base: Double,
      porcentaje: Double,
      salto: Double,
      decremento: Double,
      porcminimo: Double,
      porcmaximo: Double,
      montominimo: Double,
      monId: Int,
      descrip: String) = {

    new Listapreciomarcado(
      id,
      name,
      code,
      active,
      base,
      porcentaje,
      salto,
      decremento,
      porcminimo,
      porcmaximo,
      montominimo,
      monId,
      descrip)
  }

  def apply(
      name: String,
      code: String,
      active: Boolean,
      base: Double,
      porcentaje: Double,
      salto: Double,
      decremento: Double,
      porcminimo: Double,
      porcmaximo: Double,
      montominimo: Double,
      monId: Int,
      descrip: String) = {

    new Listapreciomarcado(
      name,
      code,
      active,
      base,
      porcentaje,
      salto,
      decremento,
      porcminimo,
      porcmaximo,
      montominimo,
      monId,
      descrip)
  }

  private val listapreciomarcadoParser: RowParser[Listapreciomarcado] = {
      SqlParser.get[Int](C.LPM_ID) ~
      SqlParser.get[String](C.LPM_NAME) ~
      SqlParser.get[String](C.LPM_CODE) ~
      SqlParser.get[Int](DBHelper.ACTIVE) ~
      SqlParser.get[Double](C.LPM_BASE) ~
      SqlParser.get[Double](C.LPM_PORCENTAJE) ~
      SqlParser.get[Double](C.LPM_SALTO) ~
      SqlParser.get[Double](C.LPM_DECREMENTO) ~
      SqlParser.get[Double](C.LPM_PORCMINIMO) ~
      SqlParser.get[Double](C.LPM_PORCMAXIMO) ~
      SqlParser.get[Int](C.MON_ID) ~
      SqlParser.get[String](C.MON_NAME) ~
      SqlParser.get[String](C.MON_ID) ~
      SqlParser.get[String](C.LPM_DESCRIP) ~
      SqlParser.get[Date](DBHelper.CREATED_AT) ~
      SqlParser.get[Date](DBHelper.UPDATED_AT) ~
      SqlParser.get[Int](DBHelper.UPDATED_BY) map {
      case
              id ~
              name ~
              code ~
              active ~
              base ~
              porcentaje ~
              salto ~
              decremento ~
              porcminimo ~
              porcmaximo ~
              montominimo ~
              monId ~
              monName ~
              descrip  ~
              createdAt ~
              updatedAt ~
              updatedBy =>
        Listapreciomarcado(
              id,
              name,
              code,
              (if(active != 0) true else false),
              base,
              porcentaje,
              salto,
              decremento,
              porcminimo,
              porcmaximo,
              montominimo,
              monId,
              monName,
              descrip,
              createdAt,
              updatedAt,
              updatedBy)
    }
  }

  def create(user: CompanyUser, listapreciomarcado: Listapreciomarcado): Listapreciomarcado = {
    save(user, listapreciomarcado, true)
  }

  def update(user: CompanyUser, listapreciomarcado: Listapreciomarcado): Listapreciomarcado = {
    save(user, listapreciomarcado, false)
  }

  private def save(user: CompanyUser, listapreciomarcado: Listapreciomarcado, isNew: Boolean): Listapreciomarcado = {
    def getFields = {
      List(
        Field(C.LPM_NAME, listapreciomarcado.name, FieldType.text),
        Field(C.LPM_CODE, listapreciomarcado.code, FieldType.text),
        Field(DBHelper.ACTIVE, (if(listapreciomarcado.active) 1 else 0), FieldType.boolean),
        Field(C.LPM_BASE, listapreciomarcado.base, FieldType.number),
        Field(C.LPM_PORCENTAJE, listapreciomarcado.porcentaje, FieldType.number),
        Field(C.LPM_SALTO, listapreciomarcado.salto, FieldType.number),
        Field(C.LPM_DECREMENTO, listapreciomarcado.decremento, FieldType.number),
        Field(C.LPM_PORCMINIMO, listapreciomarcado.porcminimo, FieldType.number),
        Field(C.LPM_PORCMAXIMO, listapreciomarcado.porcmaximo, FieldType.number),
        Field(C.LPM_MONTOMINIMO, listapreciomarcado.montominimo, FieldType.id),
        Field(C.MON_ID, listapreciomarcado.monId, FieldType.text),
        Field(C.LPM_DESCRIP, listapreciomarcado.descrip, FieldType.text)
      )
    }
    def throwException = {
      throw new RuntimeException(s"Error when saving ${C.LISTAPRECIOMARCADO}")
    }

    DBHelper.saveEx(
      user,
      Register(
        C.LISTAPRECIOMARCADO,
        C.LPM_ID,
        listapreciomarcado.id,
        false,
        true,
        true,
        getFields),
      isNew,
      C.LPM_CODE
    ) match {
      case SaveResult(true, id) => load(user, id).getOrElse(throwException)
      case SaveResult(false, id) => throwException
    }
  }

  def load(user: CompanyUser, id: Int): Option[Listapreciomarcado] = {
    loadWhere(user, s"${C.LPM_ID} = {id}", 'id -> id)
  }

  def loadWhere(user: CompanyUser, where: String, args : scala.Tuple2[scala.Any, anorm.ParameterValue[_]]*) = {
    DB.withConnection(user.database.database) { implicit connection =>
      SQL(s"SELECT t1.*, t2.${C.FK_NAME} FROM ${C.LISTAPRECIOMARCADO} t1 INNER JOIN ${C.???} t2 ON t1.${C.FK_ID} = t2.${C.FK_ID} WHERE $where")
        .on(args: _*)
        .as(listapreciomarcadoParser.singleOpt)
    }
  }

  def delete(user: CompanyUser, id: Int) = {
    DB.withConnection(user.database.database) { implicit connection =>
      try {
        SQL(s"DELETE FROM ${C.LISTAPRECIOMARCADO} WHERE ${C.LPM_ID} = {id}")
        .on('id -> id)
        .executeUpdate
      } catch {
        case NonFatal(e) => {
          Logger.error(s"can't delete a ${C.LISTAPRECIOMARCADO}. ${C.LPM_ID} id: $id. Error ${e.toString}")
          throw e
        }
      }
    }
  }

  def get(user: CompanyUser, id: Int): Listapreciomarcado = {
    load(user, id) match {
      case Some(p) => p
      case None => emptyListapreciomarcado
    }
  }
}

