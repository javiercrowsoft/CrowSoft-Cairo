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

case class Centrocosto(
              id: Int,
              name: String,
              code: String,
              active: Boolean,
              compra: Int,
              venta: Int,
              idPadre: Int,
              idName: String,
              descrip: String,
              createdAt: Date,
              updatedAt: Date,
              updatedBy: Int) {

  def this(
      id: Int,
      name: String,
      code: String,
      active: Boolean,
      compra: Int,
      venta: Int,
      idPadre: Int,
      descrip: String) = {

    this(
      id,
      name,
      code,
      active,
      compra,
      venta,
      idPadre,
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
      compra: Int,
      venta: Int,
      idPadre: Int,
      descrip: String) = {

    this(
      DBHelper.NoId,
      name,
      code,
      active,
      compra,
      venta,
      idPadre,
      descrip)

  }

}

object Centrocosto {

  lazy val emptyCentrocosto = Centrocosto(
    "",
    "",
    false,
    null,
    null,
    DBHelper.NoId,
    "")

  def apply(
      id: Int,
      name: String,
      code: String,
      active: Boolean,
      compra: Int,
      venta: Int,
      idPadre: Int,
      descrip: String) = {

    new Centrocosto(
      id,
      name,
      code,
      active,
      compra,
      venta,
      idPadre,
      descrip)
  }

  def apply(
      name: String,
      code: String,
      active: Boolean,
      compra: Int,
      venta: Int,
      idPadre: Int,
      descrip: String) = {

    new Centrocosto(
      name,
      code,
      active,
      compra,
      venta,
      idPadre,
      descrip)
  }

  private val centrocostoParser: RowParser[Centrocosto] = {
      SqlParser.get[Int](C.CCOS_ID) ~
      SqlParser.get[String](C.CCOS_NAME) ~
      SqlParser.get[String](C.CCOS_CODE) ~
      SqlParser.get[Int](DBHelper.ACTIVE) ~
      SqlParser.get[Int](C.CCOS_COMPRA) ~
      SqlParser.get[Int](C.CCOS_VENTA) ~
      SqlParser.get[Int](C.CCOS_ID_PADRE) ~
      SqlParser.get[String](C.ID_NAME) ~
      SqlParser.get[String](C.CCOS_DESCRIP) ~
      SqlParser.get[Date](DBHelper.CREATED_AT) ~
      SqlParser.get[Date](DBHelper.UPDATED_AT) ~
      SqlParser.get[Int](DBHelper.UPDATED_BY) map {
      case
              id ~
              name ~
              code ~
              active ~
              compra ~
              venta ~
              idPadre ~
              idName ~
              descrip  ~
              createdAt ~
              updatedAt ~
              updatedBy =>
        Centrocosto(
              id,
              name,
              code,
              (if(active != 0) true else false),
              compra,
              venta,
              idPadre,
              idName,
              descrip,
              createdAt,
              updatedAt,
              updatedBy)
    }
  }

  def create(user: CompanyUser, centrocosto: Centrocosto): Centrocosto = {
    save(user, centrocosto, true)
  }

  def update(user: CompanyUser, centrocosto: Centrocosto): Centrocosto = {
    save(user, centrocosto, false)
  }

  private def save(user: CompanyUser, centrocosto: Centrocosto, isNew: Boolean): Centrocosto = {
    def getFields = {
      List(
        Field(C.CCOS_NAME, centrocosto.name, FieldType.text),
        Field(C.CCOS_CODE, centrocosto.code, FieldType.text),
        Field(DBHelper.ACTIVE, (if(centrocosto.active) 1 else 0), FieldType.boolean),
        Field(C.CCOS_COMPRA, centrocosto.compra, FieldType.number),
        Field(C.CCOS_VENTA, centrocosto.venta, FieldType.number),
        Field(C.CCOS_ID_PADRE, centrocosto.idPadre, FieldType.id),
        Field(C.CCOS_DESCRIP, centrocosto.descrip, FieldType.text)
      )
    }
    def throwException = {
      throw new RuntimeException(s"Error when saving ${C.CENTROCOSTO}")
    }

    DBHelper.saveEx(
      user,
      Register(
        C.CENTROCOSTO,
        C.CCOS_ID,
        centrocosto.id,
        false,
        true,
        true,
        getFields),
      isNew,
      C.CCOS_CODE
    ) match {
      case SaveResult(true, id) => load(user, id).getOrElse(throwException)
      case SaveResult(false, id) => throwException
    }
  }

  def load(user: CompanyUser, id: Int): Option[Centrocosto] = {
    loadWhere(user, s"${C.CCOS_ID} = {id}", 'id -> id)
  }

  def loadWhere(user: CompanyUser, where: String, args : scala.Tuple2[scala.Any, anorm.ParameterValue[_]]*) = {
    DB.withConnection(user.database.database) { implicit connection =>
      SQL(s"SELECT t1.*, t2.${C.FK_NAME} FROM ${C.CENTROCOSTO} t1 INNER JOIN ${C.???} t2 ON t1.${C.FK_ID} = t2.${C.FK_ID} WHERE $where")
        .on(args: _*)
        .as(centrocostoParser.singleOpt)
    }
  }

  def delete(user: CompanyUser, id: Int) = {
    DB.withConnection(user.database.database) { implicit connection =>
      try {
        SQL(s"DELETE FROM ${C.CENTROCOSTO} WHERE ${C.CCOS_ID} = {id}")
        .on('id -> id)
        .executeUpdate
      } catch {
        case NonFatal(e) => {
          Logger.error(s"can't delete a ${C.CENTROCOSTO}. ${C.CCOS_ID} id: $id. Error ${e.toString}")
          throw e
        }
      }
    }
  }

  def get(user: CompanyUser, id: Int): Centrocosto = {
    load(user, id) match {
      case Some(p) => p
      case None => emptyCentrocosto
    }
  }
}
