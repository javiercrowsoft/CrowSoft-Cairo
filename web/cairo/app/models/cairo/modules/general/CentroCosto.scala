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

case class CentroCosto(
              id: Int,
              name: String,
              code: String,
              active: Boolean,
              compra: Int,
              venta: Int,
              idPadre: Int,
              padreName: String,
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

object CentroCosto {

  lazy val emptyCentroCosto = CentroCosto(
    "",
    "",
    false,
    0,
    0,
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

    new CentroCosto(
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

    new CentroCosto(
      name,
      code,
      active,
      compra,
      venta,
      idPadre,
      descrip)
  }

  private val centroCostoParser: RowParser[CentroCosto] = {
      SqlParser.get[Int](C.CCOS_ID) ~
      SqlParser.get[String](C.CCOS_NAME) ~
      SqlParser.get[String](C.CCOS_CODE) ~
      SqlParser.get[Int](DBHelper.ACTIVE) ~
      SqlParser.get[Int](C.CCOS_COMPRA) ~
      SqlParser.get[Int](C.CCOS_VENTA) ~
      SqlParser.get[Int](C.CCOS_ID_PADRE) ~
      SqlParser.get[String](C.CCOS_PADRE_NAME) ~
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
              padreName ~
              descrip  ~
              createdAt ~
              updatedAt ~
              updatedBy =>
        CentroCosto(
              id,
              name,
              code,
              (if(active != 0) true else false),
              compra,
              venta,
              idPadre,
              padreName,
              descrip,
              createdAt,
              updatedAt,
              updatedBy)
    }
  }

  def create(user: CompanyUser, centroCosto: CentroCosto): CentroCosto = {
    save(user, centroCosto, true)
  }

  def update(user: CompanyUser, centroCosto: CentroCosto): CentroCosto = {
    save(user, centroCosto, false)
  }

  private def save(user: CompanyUser, centroCosto: CentroCosto, isNew: Boolean): CentroCosto = {
    def getFields = {
      List(
        Field(C.CCOS_NAME, centroCosto.name, FieldType.text),
        Field(C.CCOS_CODE, centroCosto.code, FieldType.text),
        Field(DBHelper.ACTIVE, (if(centroCosto.active) 1 else 0), FieldType.boolean),
        Field(C.CCOS_COMPRA, centroCosto.compra, FieldType.number),
        Field(C.CCOS_VENTA, centroCosto.venta, FieldType.number),
        Field(C.CCOS_ID_PADRE, centroCosto.idPadre, FieldType.id),
        Field(C.CCOS_DESCRIP, centroCosto.descrip, FieldType.text)
      )
    }
    def throwException = {
      throw new RuntimeException(s"Error when saving ${C.CENTRO_COSTO}")
    }

    DBHelper.saveEx(
      user,
      Register(
        C.CENTRO_COSTO,
        C.CCOS_ID,
        centroCosto.id,
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

  def load(user: CompanyUser, id: Int): Option[CentroCosto] = {
    loadWhere(user, s"${C.CCOS_ID} = {id}", 'id -> id)
  }

  def loadWhere(user: CompanyUser, where: String, args : scala.Tuple2[scala.Any, anorm.ParameterValue[_]]*) = {
    DB.withConnection(user.database.database) { implicit connection =>
      SQL(s"SELECT t1.*,  t2.${C.CCOS_NAME} AS ${C.CCOS_PADRE_NAME}" +
        s" FROM ${C.CENTRO_COSTO} t1" +
        s" LEFT JOIN ${C.CENTRO_COSTO} t2 ON t1.${C.CCOS_ID_PADRE} = t2.${C.CCOS_ID}" +
        s" WHERE $where")
        .on(args: _*)
        .as(centroCostoParser.singleOpt)
    }
  }

  def delete(user: CompanyUser, id: Int) = {
    DB.withConnection(user.database.database) { implicit connection =>
      try {
        SQL(s"DELETE FROM ${C.CENTRO_COSTO} WHERE ${C.CCOS_ID} = {id}")
        .on('id -> id)
        .executeUpdate
      } catch {
        case NonFatal(e) => {
          Logger.error(s"can't delete a ${C.CENTRO_COSTO}. ${C.CCOS_ID} id: $id. Error ${e.toString}")
          throw e
        }
      }
    }
  }

  def get(user: CompanyUser, id: Int): CentroCosto = {
    load(user, id) match {
      case Some(p) => p
      case None => emptyCentroCosto
    }
  }
}
