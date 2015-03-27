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

case class FormaPago(
              id: Int,
              name: String,
              code: String,
              active: Boolean,
              lunes: Boolean,
              martes: Boolean,
              miercoles: Boolean,
              jueves: Boolean,
              viernes: Boolean,
              sabado: Boolean,
              domingo: Boolean,
              descrip: String,
              createdAt: Date,
              updatedAt: Date,
              updatedBy: Int) {

  def this(
      id: Int,
      name: String,
      code: String,
      active: Boolean,
      lunes: Boolean,
      martes: Boolean,
      miercoles: Boolean,
      jueves: Boolean,
      viernes: Boolean,
      sabado: Boolean,
      domingo: Boolean,
      descrip: String) = {

    this(
      id,
      name,
      code,
      active,
      lunes,
      martes,
      miercoles,
      jueves,
      viernes,
      sabado,
      domingo,
      descrip,
      DateUtil.currentTime,
      DateUtil.currentTime,
      DBHelper.NoId)
  }

  def this(
      name: String,
      code: String,
      active: Boolean,
      lunes: Boolean,
      martes: Boolean,
      miercoles: Boolean,
      jueves: Boolean,
      viernes: Boolean,
      sabado: Boolean,
      domingo: Boolean,
      descrip: String) = {

    this(
      DBHelper.NoId,
      name,
      code,
      active,
      lunes,
      martes,
      miercoles,
      jueves,
      viernes,
      sabado,
      domingo,
      descrip)

  }

}

object FormaPago {

  lazy val emptyFormaPago = FormaPago(
    "",
    "",
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    "")

  def apply(
      id: Int,
      name: String,
      code: String,
      active: Boolean,
      lunes: Boolean,
      martes: Boolean,
      miercoles: Boolean,
      jueves: Boolean,
      viernes: Boolean,
      sabado: Boolean,
      domingo: Boolean,
      descrip: String) = {

    new FormaPago(
      id,
      name,
      code,
      active,
      lunes,
      martes,
      miercoles,
      jueves,
      viernes,
      sabado,
      domingo,
      descrip)
  }

  def apply(
      name: String,
      code: String,
      active: Boolean,
      lunes: Boolean,
      martes: Boolean,
      miercoles: Boolean,
      jueves: Boolean,
      viernes: Boolean,
      sabado: Boolean,
      domingo: Boolean,
      descrip: String) = {

    new FormaPago(
      name,
      code,
      active,
      lunes,
      martes,
      miercoles,
      jueves,
      viernes,
      sabado,
      domingo,
      descrip)
  }

  private val formaPagoParser: RowParser[FormaPago] = {
      SqlParser.get[Int](C.FP_ID) ~
      SqlParser.get[String](C.FP_NAME) ~
      SqlParser.get[String](C.FP_CODE) ~
      SqlParser.get[Int](DBHelper.ACTIVE) ~
      SqlParser.get[Boolean](C.FP_LUNES) ~
      SqlParser.get[Boolean](C.FP_MARTES) ~
      SqlParser.get[Boolean](C.FP_MIERCOLES) ~
      SqlParser.get[Boolean](C.FP_JUEVES) ~
      SqlParser.get[Boolean](C.FP_VIERNES) ~
      SqlParser.get[Boolean](C.FP_SABADO) ~
      SqlParser.get[Boolean](C.FP_DOMINGO) ~
      SqlParser.get[String](C.FP_DESCRIP) ~
      SqlParser.get[Date](DBHelper.CREATED_AT) ~
      SqlParser.get[Date](DBHelper.UPDATED_AT) ~
      SqlParser.get[Int](DBHelper.UPDATED_BY) map {
      case
              id ~
              name ~
              code ~
              active ~
              lunes ~
              martes ~
              miercoles ~
              jueves ~
              viernes ~
              sabado ~
              domingo ~
              descrip  ~
              createdAt ~
              updatedAt ~
              updatedBy =>
        FormaPago(
              id,
              name,
              code,
              active != 0,
              lunes,
              martes,
              miercoles,
              jueves,
              viernes,
              sabado,
              domingo,
              descrip,
              createdAt,
              updatedAt,
              updatedBy)
    }
  }

  def create(user: CompanyUser, formaPago: FormaPago): FormaPago = {
    save(user, formaPago, true)
  }

  def update(user: CompanyUser, formaPago: FormaPago): FormaPago = {
    save(user, formaPago, false)
  }

  private def save(user: CompanyUser, formaPago: FormaPago, isNew: Boolean): FormaPago = {
    def getFields = {
      List(
        Field(C.FP_NAME, formaPago.name, FieldType.text),
        Field(C.FP_CODE, formaPago.code, FieldType.text),
        Field(DBHelper.ACTIVE, (if(formaPago.active) 1 else 0), FieldType.boolean),
        Field(C.FP_LUNES, formaPago.lunes, FieldType.boolean),
        Field(C.FP_MARTES, formaPago.martes, FieldType.boolean),
        Field(C.FP_MIERCOLES, formaPago.miercoles, FieldType.boolean),
        Field(C.FP_JUEVES, formaPago.jueves, FieldType.boolean),
        Field(C.FP_VIERNES, formaPago.viernes, FieldType.boolean),
        Field(C.FP_SABADO, formaPago.sabado, FieldType.boolean),
        Field(C.FP_DOMINGO, formaPago.domingo, FieldType.boolean),
        Field(C.FP_DESCRIP, formaPago.descrip, FieldType.text)
      )
    }
    def throwException = {
      throw new RuntimeException(s"Error when saving ${C.FORMAPAGO}")
    }

    DBHelper.saveEx(
      user,
      Register(
        C.FORMAPAGO,
        C.FP_ID,
        formaPago.id,
        false,
        true,
        true,
        getFields),
      isNew,
      C.FP_CODE
    ) match {
      case SaveResult(true, id) => load(user, id).getOrElse(throwException)
      case SaveResult(false, id) => throwException
    }
  }

  def load(user: CompanyUser, id: Int): Option[FormaPago] = {
    loadWhere(user, s"${C.FP_ID} = {id}", 'id -> id)
  }

  def loadWhere(user: CompanyUser, where: String, args : scala.Tuple2[scala.Any, anorm.ParameterValue[_]]*) = {
    DB.withConnection(user.database.database) { implicit connection =>
      SQL(s"SELECT t1.* FROM ${C.FORMAPAGO} t1 WHERE $where")
        .on(args: _*)
        .as(formaPagoParser.singleOpt)
    }
  }

  def delete(user: CompanyUser, id: Int) = {
    DB.withConnection(user.database.database) { implicit connection =>
      try {
        SQL(s"DELETE FROM ${C.FORMAPAGO} WHERE ${C.FP_ID} = {id}")
        .on('id -> id)
        .executeUpdate
      } catch {
        case NonFatal(e) => {
          Logger.error(s"can't delete a ${C.FORMAPAGO}. ${C.FP_ID} id: $id. Error ${e.toString}")
          throw e
        }
      }
    }
  }

  def get(user: CompanyUser, id: Int): FormaPago = {
    load(user, id) match {
      case Some(p) => p
      case None => emptyFormaPago
    }
  }
}
