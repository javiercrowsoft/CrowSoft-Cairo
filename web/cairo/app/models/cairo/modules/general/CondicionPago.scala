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

case class CondicionPago(
                   id: Int,
                   name: String,
                   code: String,
                   esLibre: Boolean,
                   active: Boolean,
                   createdAt: Date,
                   updatedAt: Date,
                   updatedBy: Int) {

  def this(
            id: Int,
            name: String,
            code: String,
            esLibre: Boolean,
            active: Boolean) = {

    this(
      id,
      name,
      code,
      esLibre,
      active,
      DateUtil.currentTime,
      DateUtil.currentTime,
      DBHelper.NoId)
  }

  def this(
            name: String,
            code: String,
            esLibre: Boolean,
            active: Boolean) = {

    this(
      DBHelper.NoId,
      name,
      code,
      esLibre,
      active)

  }

}

case class CondicionPagoInfo(
                          id: Int,
                          name: String,
                          esLibre: Boolean
                          )

object CondicionPago {

  lazy val emptyCondicionPago = CondicionPago(
    "",
    "",
    false,
    false)

  def apply(
             id: Int,
             name: String,
             code: String,
             esLibre: Boolean,
             active: Boolean) = {

    new CondicionPago(
      id,
      name,
      code,
      esLibre,
      active)
  }

  def apply(
             name: String,
             code: String,
             esLibre: Boolean,
             active: Boolean) = {

    new CondicionPago(
      name,
      code,
      esLibre,
      active)
  }

  private val condicionPagoParser: RowParser[CondicionPago] = {
    SqlParser.get[Int](C.CPG_ID) ~
    SqlParser.get[String](C.CPG_NAME) ~
    SqlParser.get[String](C.CPG_CODE) ~
    SqlParser.get[Int](C.CPG_ES_LIBRE) ~
    SqlParser.get[Int](DBHelper.ACTIVE) ~
    SqlParser.get[Date](DBHelper.CREATED_AT) ~
    SqlParser.get[Date](DBHelper.UPDATED_AT) ~
    SqlParser.get[Int](DBHelper.UPDATED_BY) map {
      case
          id ~
          name ~
          code ~
          esLibre ~
          active  ~
          createdAt ~
          updatedAt ~
          updatedBy =>
        CondicionPago(
          id,
          name,
          code,
          (if(esLibre != 0) true else false),
          (if(active != 0) true else false),
          createdAt,
          updatedAt,
          updatedBy)
    }
  }

  def load(user: CompanyUser, id: Int): Option[CondicionPago] = {
    loadWhere(user, s"${C.CPG_ID} = {id}", 'id -> id)
  }

  def loadWhere(user: CompanyUser, where: String, args : scala.Tuple2[scala.Any, anorm.ParameterValue[_]]*) = {
    DB.withConnection(user.database.database) { implicit connection =>
      SQL(s"SELECT t1.* FROM ${C.CONDICION_PAGO} t1 WHERE $where")
        .on(args: _*)
        .as(condicionPagoParser.singleOpt)
    }
  }

  def get(user: CompanyUser, id: Int): CondicionPago = {
    load(user, id) match {
      case Some(p) => p
      case None => emptyCondicionPago
    }
  }

  def info(user: CompanyUser, id: Int): CondicionPagoInfo = {
    val cp = get(user, id)
    CondicionPagoInfo(cp.id, cp.name, cp.esLibre)
  }
}

