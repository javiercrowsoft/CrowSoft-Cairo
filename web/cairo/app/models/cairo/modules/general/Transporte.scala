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

case class Transporte(
              id: Int,
              name: String,
              code: String,
              active: Boolean,
              direccion: String,
              telefono: String,
              proId: Int,
              proName: String,
              mail: String,
              web: String,
              provId: Int,
              provName: String,
              horarioMdesde: Date,
              horarioMhasta: Date,
              horarioTdesde: Date,
              horarioThasta: Date,
              descrip: String,
              createdAt: Date,
              updatedAt: Date,
              updatedBy: Int) {

  def this(
      id: Int,
      name: String,
      code: String,
      active: Boolean,
      direccion: String,
      telefono: String,
      proId: Int,
      mail: String,
      web: String,
      provId: Int,
      horarioMdesde: Date,
      horarioMhasta: Date,
      horarioTdesde: Date,
      horarioThasta: Date,
      descrip: String) = {

    this(
      id,
      name,
      code,
      active,
      direccion,
      telefono,
      proId,
      "",
      mail,
      web,
      provId,
      "",
      horarioMdesde,
      horarioMhasta,
      horarioTdesde,
      horarioThasta,
      descrip,
      DateUtil.currentTime,
      DateUtil.currentTime,
      DBHelper.NoId)
  }

  def this(
      name: String,
      code: String,
      active: Boolean,
      direccion: String,
      telefono: String,
      proId: Int,
      mail: String,
      web: String,
      provId: Int,
      horarioMdesde: Date,
      horarioMhasta: Date,
      horarioTdesde: Date,
      horarioThasta: Date,
      descrip: String) = {

    this(
      DBHelper.NoId,
      name,
      code,
      active,
      direccion,
      telefono,
      proId,
      mail,
      web,
      provId,
      horarioMdesde,
      horarioMhasta,
      horarioTdesde,
      horarioThasta,
      descrip)

  }

}

object Transporte {

  lazy val emptyTransporte = Transporte(
    "",
    "",
    false,
    "",
    "",
    DBHelper.NoId,
    "",
    "",
    DBHelper.NoId,
    null,
    null,
    null,
    null,
    "")

  def apply(
      id: Int,
      name: String,
      code: String,
      active: Boolean,
      direccion: String,
      telefono: String,
      proId: Int,
      mail: String,
      web: String,
      provId: Int,
      horarioMdesde: Date,
      horarioMhasta: Date,
      horarioTdesde: Date,
      horarioThasta: Date,
      descrip: String) = {

    new Transporte(
      id,
      name,
      code,
      active,
      direccion,
      telefono,
      proId,
      mail,
      web,
      provId,
      horarioMdesde,
      horarioMhasta,
      horarioTdesde,
      horarioThasta,
      descrip)
  }

  def apply(
      name: String,
      code: String,
      active: Boolean,
      direccion: String,
      telefono: String,
      proId: Int,
      mail: String,
      web: String,
      provId: Int,
      horarioMdesde: Date,
      horarioMhasta: Date,
      horarioTdesde: Date,
      horarioThasta: Date,
      descrip: String) = {

    new Transporte(
      name,
      code,
      active,
      direccion,
      telefono,
      proId,
      mail,
      web,
      provId,
      horarioMdesde,
      horarioMhasta,
      horarioTdesde,
      horarioThasta,
      descrip)
  }

  private val transporteParser: RowParser[Transporte] = {
      SqlParser.get[Int](C.TRANS_ID) ~
      SqlParser.get[String](C.TRANS_NAME) ~
      SqlParser.get[String](C.TRANS_CODE) ~
      SqlParser.get[Int](DBHelper.ACTIVE) ~
      SqlParser.get[String](C.TRANS_DIRECCION) ~
      SqlParser.get[String](C.TRANS_TELEFONO) ~
      SqlParser.get[Int](C.PRO_ID) ~
      SqlParser.get[String](C.PRO_NAME) ~
      SqlParser.get[String](C.TRANS_MAIL) ~
      SqlParser.get[String](C.TRANS_WEB) ~
      SqlParser.get[Int](C.PROV_ID) ~
      SqlParser.get[String](C.PROV_NAME) ~
      SqlParser.get[Date](C.TRANS_HORARIO_MDESDE) ~
      SqlParser.get[Date](C.TRANS_HORARIO_MHASTA) ~
      SqlParser.get[Date](C.TRANS_HORARIO_TDESDE) ~
      SqlParser.get[Date](C.TRANS_HORARIO_THASTA) ~
      SqlParser.get[String](C.TRANS_DESCRIP) ~
      SqlParser.get[Date](DBHelper.CREATED_AT) ~
      SqlParser.get[Date](DBHelper.UPDATED_AT) ~
      SqlParser.get[Int](DBHelper.UPDATED_BY) map {
      case
              id ~
              name ~
              code ~
              active ~
              direccion ~
              telefono ~
              proId ~
              proName ~
              mail ~
              web ~
              provId ~
              provName ~
              horarioMdesde ~
              horarioMhasta ~
              horarioTdesde ~
              horarioThasta ~
              descrip  ~
              createdAt ~
              updatedAt ~
              updatedBy =>
        Transporte(
              id,
              name,
              code,
              (if(active != 0) true else false),
              direccion,
              telefono,
              proId,
              proName,
              mail,
              web,
              provId,
              provName,
              horarioMdesde,
              horarioMhasta,
              horarioTdesde,
              horarioThasta,
              descrip,
              createdAt,
              updatedAt,
              updatedBy)
    }
  }

  def create(user: CompanyUser, transporte: Transporte): Transporte = {
    save(user, transporte, true)
  }

  def update(user: CompanyUser, transporte: Transporte): Transporte = {
    save(user, transporte, false)
  }

  private def save(user: CompanyUser, transporte: Transporte, isNew: Boolean): Transporte = {
    def getFields = {
      List(
        Field(C.TRANS_NAME, transporte.name, FieldType.text),
        Field(C.TRANS_CODE, transporte.code, FieldType.text),
        Field(DBHelper.ACTIVE, (if(transporte.active) 1 else 0), FieldType.boolean),
        Field(C.TRANS_DIRECCION, transporte.direccion, FieldType.text),
        Field(C.TRANS_TELEFONO, transporte.telefono, FieldType.text),
        Field(C.PRO_ID, transporte.proId, FieldType.id),
        Field(C.TRANS_MAIL, transporte.mail, FieldType.text),
        Field(C.TRANS_WEB, transporte.web, FieldType.text),
        Field(C.PROV_ID, transporte.provId, FieldType.id),
        Field(C.TRANS_HORARIO_MDESDE, transporte.horarioMdesde, FieldType.number),
        Field(C.TRANS_HORARIO_MHASTA, transporte.horarioMhasta, FieldType.number),
        Field(C.TRANS_HORARIO_TDESDE, transporte.horarioTdesde, FieldType.number),
        Field(C.TRANS_HORARIO_THASTA, transporte.horarioThasta, FieldType.number),
        Field(C.TRANS_DESCRIP, transporte.descrip, FieldType.text)
      )
    }
    def throwException = {
      throw new RuntimeException(s"Error when saving ${C.TRANSPORTE}")
    }

    DBHelper.saveEx(
      user,
      Register(
        C.TRANSPORTE,
        C.TRANS_ID,
        transporte.id,
        false,
        true,
        true,
        getFields),
      isNew,
      C.TRANS_CODE
    ) match {
      case SaveResult(true, id) => load(user, id).getOrElse(throwException)
      case SaveResult(false, id) => throwException
    }
  }

  def load(user: CompanyUser, id: Int): Option[Transporte] = {
    loadWhere(user, s"${C.TRANS_ID} = {id}", 'id -> id)
  }

  def loadWhere(user: CompanyUser, where: String, args : scala.Tuple2[scala.Any, anorm.ParameterValue[_]]*) = {
    DB.withConnection(user.database.database) { implicit connection =>
      SQL(s"SELECT t1.*, t2.${C.PRO_NAME}, t3.${C.PROV_NAME}" +
        s" FROM ${C.TRANSPORTE} t1" +
        s" LEFT JOIN ${C.PROVINCIA} t2 ON t1.${C.PRO_ID} = t2.${C.PRO_ID}" +
        s" LEFT JOIN ${C.PROVEEDOR} t3 ON t1.${C.PROV_ID} = t3.${C.PROV_ID} WHERE $where")
        .on(args: _*)
        .as(transporteParser.singleOpt)
    }
  }

  def delete(user: CompanyUser, id: Int) = {
    DB.withConnection(user.database.database) { implicit connection =>
      try {
        SQL(s"DELETE FROM ${C.TRANSPORTE} WHERE ${C.TRANS_ID} = {id}")
        .on('id -> id)
        .executeUpdate
      } catch {
        case NonFatal(e) => {
          Logger.error(s"can't delete a ${C.TRANSPORTE}. ${C.TRANS_ID} id: $id. Error ${e.toString}")
          throw e
        }
      }
    }
  }

  def get(user: CompanyUser, id: Int): Transporte = {
    load(user, id) match {
      case Some(p) => p
      case None => emptyTransporte
    }
  }
}

