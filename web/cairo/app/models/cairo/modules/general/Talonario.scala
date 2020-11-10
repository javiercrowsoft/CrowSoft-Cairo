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

case class Talonario(
                   id: Int,
                   name: String,
                   code: String,
                   descrip: String,
                   ultimoNro: Int,
                   tipo: Int,
                   mascara: String,
                   tipoAFIP: Int,
                   puntoVta: Int,
                   active: Boolean,
                   cai: String,
                   empId: Int,
                   empName: String,
                   createdAt: Date,
                   updatedAt: Date,
                   updatedBy: Int) {

  def this(
            id: Int,
            name: String,
            code: String,
            descrip: String,
            ultimoNro: Int,
            tipo: Int,
            mascara: String,
            tipoAFIP: Int,
            puntoVta: Int,
            active: Boolean,
            cai: String,
            empId: Int) = {

    this(
      id,
      name,
      code,
      descrip,
      ultimoNro,
      tipo,
      mascara,
      tipoAFIP,
      puntoVta,
      active,
      cai,
      empId,
      "",
      DateUtil.currentTime,
      DateUtil.currentTime,
      DBHelper.NoId)
  }

  def this(
            name: String,
            code: String,
            descrip: String,
            ultimoNro: Int,
            tipo: Int,
            mascara: String,
            tipoAFIP: Int,
            puntoVta: Int,
            active: Boolean,
            cai: String,
            empId: Int) = {

    this(
      DBHelper.NoId,
      name,
      code,
      descrip,
      ultimoNro,
      tipo,
      mascara,
      tipoAFIP,
      puntoVta,
      active,
      cai,
      empId)

  }

}

object Talonario {

  lazy val emptyTalonario = Talonario(
    "",
    "",
    "",
    0,
    0,
    "",
    0,
    0,
    false,
    "",
    DBHelper.NoId)

  def apply(
             id: Int,
             name: String,
             code: String,
             descrip: String,
             ultimoNro: Int,
             tipo: Int,
             mascara: String,
             tipoAFIP: Int,
             puntoVta: Int,
             active: Boolean,
             cai: String,
             empId: Int) = {

    new Talonario(
      id,
      name,
      code,
      descrip,
      ultimoNro,
      tipo,
      mascara,
      tipoAFIP,
      puntoVta,
      active,
      cai,
      empId)
  }

  def apply(
             name: String,
             code: String,
             descrip: String,
             ultimoNro: Int,
             tipo: Int,
             mascara: String,
             tipoAFIP: Int,
             puntoVta: Int,
             active: Boolean,
             cai: String,
             empId: Int) = {

    new Talonario(
      name,
      code,
      descrip,
      ultimoNro,
      tipo,
      mascara,
      tipoAFIP,
      puntoVta,
      active,
      cai,
      empId)
  }

  private val talonarioParser: RowParser[Talonario] = {
    SqlParser.get[Int](C.TA_ID) ~
      SqlParser.get[String](C.TA_NAME) ~
      SqlParser.get[String](C.TA_CODE) ~
      SqlParser.get[String](C.TA_DESCRIP) ~
      SqlParser.get[Int](C.TA_ULTIMO_NRO) ~
      SqlParser.get[Int](C.TA_TIPO) ~
      SqlParser.get[String](C.TA_MASCARA) ~
      SqlParser.get[Int](C.TA_TIPO_AFIP) ~
      SqlParser.get[Int](C.TA_PUNTO_VTA) ~
      SqlParser.get[Int](DBHelper.ACTIVE) ~
      SqlParser.get[String](C.TA_CAI) ~
      SqlParser.get[Option[Int]](C.EMP_ID) ~
      SqlParser.get[Option[String]](C.EMP_NAME) ~
      SqlParser.get[Date](DBHelper.CREATED_AT) ~
      SqlParser.get[Date](DBHelper.UPDATED_AT) ~
      SqlParser.get[Int](DBHelper.UPDATED_BY) map {
      case
        id ~
          name ~
          code ~
          descrip ~
          ultimoNro ~
          tipo ~
          mascara ~
          tipoAFIP ~
          puntoVta ~
          active ~
          cai ~
          empId ~
          empName ~
          createdAt ~
          updatedAt ~
          updatedBy =>
        Talonario(
          id,
          name,
          code,
          descrip,
          ultimoNro,
          tipo,
          mascara,
          tipoAFIP,
          puntoVta,
          active != 0,
          cai,
          empId.getOrElse(DBHelper.NoId),
          empName.getOrElse(""),
          createdAt,
          updatedAt,
          updatedBy)
    }
  }

  def create(user: CompanyUser, talonario: Talonario): Talonario = {
    save(user, talonario, true)
  }

  def update(user: CompanyUser, talonario: Talonario): Talonario = {
    save(user, talonario, false)
  }

  private def save(user: CompanyUser, talonario: Talonario, isNew: Boolean): Talonario = {
    def getFields = {
      List(
        Field(C.TA_NAME, talonario.name, FieldType.text),
        Field(C.TA_CODE, talonario.code, FieldType.text),
        Field(C.TA_DESCRIP, talonario.descrip, FieldType.text),
        Field(C.TA_ULTIMO_NRO, talonario.ultimoNro, FieldType.integer),
        Field(C.TA_TIPO, talonario.tipo, FieldType.integer),
        Field(C.TA_MASCARA, talonario.mascara, FieldType.text),
        Field(C.TA_TIPO_AFIP, talonario.tipoAFIP, FieldType.integer),
        Field(C.TA_PUNTO_VTA, talonario.puntoVta, FieldType.integer),
        Field(DBHelper.ACTIVE, Register.boolToInt(talonario.active), FieldType.boolean),
        Field(C.TA_CAI, talonario.cai, FieldType.text),
        Field(C.EMP_ID, talonario.empId, FieldType.id)
      )
    }
    def throwException = {
      throw new RuntimeException(s"Error when saving ${C.TALONARIO}")
    }

    DBHelper.saveEx(
      user,
      Register(
        C.TALONARIO,
        C.TA_ID,
        talonario.id,
        false,
        true,
        true,
        getFields),
      isNew,
      C.TA_CODE
    ) match {
      case SaveResult(true, id) => load(user, id).getOrElse(throwException)
      case SaveResult(false, _) => throwException
    }
  }

  def load(user: CompanyUser, id: Int): Option[Talonario] = {
    loadWhere(user, s"${C.TA_ID} = {id}", 'id -> id)
  }

  def loadWhere(user: CompanyUser, where: String, args : scala.Tuple2[scala.Any, anorm.ParameterValue[_]]*) = {
    DB.withConnection(user.database.database) { implicit connection =>
      SQL(s"SELECT t1.*, t2.${C.EMP_NAME}" +
        s" FROM ${C.TALONARIO} t1" +
        s" LEFT JOIN ${C.EMPRESA} t2 ON t1.${C.EMP_ID} = t2.${C.EMP_ID}" +
        s" WHERE $where")
        .on(args: _*)
        .as(talonarioParser.singleOpt)
    }
  }

  def delete(user: CompanyUser, id: Int) = {
    DB.withConnection(user.database.database) { implicit connection =>
      try {
        SQL(s"DELETE FROM ${C.TALONARIO} WHERE ${C.TA_ID} = {id}")
          .on('id -> id)
          .executeUpdate
      } catch {
        case NonFatal(e) => {
          Logger.error(s"can't delete a ${C.TALONARIO}. ${C.TA_ID} id: $id. Error ${e.toString}")
          throw e
        }
      }
    }
  }

  def get(user: CompanyUser, id: Int): Talonario = {
    load(user, id) match {
      case Some(p) => p
      case None => emptyTalonario
    }
  }

}
