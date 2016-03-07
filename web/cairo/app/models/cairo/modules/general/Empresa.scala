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

case class Empresa(
              id: Int,
              name: String,
              active: Boolean,
              razonsocial: String,
              cuit: String,
              ingresosbrutos: String,
              catfiscal: Int,
              chequeorden: String,
              calle: String,
              callenumero: String,
              piso: String,
              depto: String,
              localidad: String,
              codpostal: String,
              tel: String,
              fax: String,
              email: String,
              web: String,
              descrip: String,
              createdAt: Date,
              updatedAt: Date,
              updatedBy: Int) {

  def this(
      id: Int,
      name: String,
      active: Boolean,
      razonsocial: String,
      cuit: String,
      ingresosbrutos: String,
      catfiscal: Int,
      chequeorden: String,
      calle: String,
      callenumero: String,
      piso: String,
      depto: String,
      localidad: String,
      codpostal: String,
      tel: String,
      fax: String,
      email: String,
      web: String,
      descrip: String) = {

    this(
      id,
      name,
      active,
      razonsocial,
      cuit,
      ingresosbrutos,
      catfiscal,
      chequeorden,
      calle,
      callenumero,
      piso,
      depto,
      localidad,
      codpostal,
      tel,
      fax,
      email,
      web,
      descrip,
      DateUtil.currentTime,
      DateUtil.currentTime,
      DBHelper.NoId)
  }

  def this(
      name: String,
      active: Boolean,
      razonsocial: String,
      cuit: String,
      ingresosbrutos: String,
      catfiscal: Int,
      chequeorden: String,
      calle: String,
      callenumero: String,
      piso: String,
      depto: String,
      localidad: String,
      codpostal: String,
      tel: String,
      fax: String,
      email: String,
      web: String,
      descrip: String) = {

    this(
      DBHelper.NoId,
      name,
      active,
      razonsocial,
      cuit,
      ingresosbrutos,
      catfiscal,
      chequeorden,
      calle,
      callenumero,
      piso,
      depto,
      localidad,
      codpostal,
      tel,
      fax,
      email,
      web,
      descrip)

  }

}

object Empresa {

  lazy val emptyEmpresa = Empresa(
    "",
    false,
    "",
    "",
    "",
    0,
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "")

  def apply(
      id: Int,
      name: String,
      active: Boolean,
      razonsocial: String,
      cuit: String,
      ingresosbrutos: String,
      catfiscal: Int,
      chequeorden: String,
      calle: String,
      callenumero: String,
      piso: String,
      depto: String,
      localidad: String,
      codpostal: String,
      tel: String,
      fax: String,
      email: String,
      web: String,
      descrip: String) = {

    new Empresa(
      id,
      name,
      active,
      razonsocial,
      cuit,
      ingresosbrutos,
      catfiscal,
      chequeorden,
      calle,
      callenumero,
      piso,
      depto,
      localidad,
      codpostal,
      tel,
      fax,
      email,
      web,
      descrip)
  }

  def apply(
      name: String,
      active: Boolean,
      razonsocial: String,
      cuit: String,
      ingresosbrutos: String,
      catfiscal: Int,
      chequeorden: String,
      calle: String,
      callenumero: String,
      piso: String,
      depto: String,
      localidad: String,
      codpostal: String,
      tel: String,
      fax: String,
      email: String,
      web: String,
      descrip: String) = {

    new Empresa(
      name,
      active,
      razonsocial,
      cuit,
      ingresosbrutos,
      catfiscal,
      chequeorden,
      calle,
      callenumero,
      piso,
      depto,
      localidad,
      codpostal,
      tel,
      fax,
      email,
      web,
      descrip)
  }

  private val empresaParser: RowParser[Empresa] = {
      SqlParser.get[Int](C.EMP_ID) ~
      SqlParser.get[String](C.EMP_NAME) ~
      SqlParser.get[Int](DBHelper.ACTIVE) ~
      SqlParser.get[String](C.EMP_RAZONSOCIAL) ~
      SqlParser.get[String](C.EMP_CUIT) ~
      SqlParser.get[String](C.EMP_INGRESOSBRUTOS) ~
      SqlParser.get[Int](C.EMP_CATFISCAL) ~
      SqlParser.get[String](C.EMP_CHEQUEORDEN) ~
      SqlParser.get[String](C.EMP_CALLE) ~
      SqlParser.get[String](C.EMP_CALLENUMERO) ~
      SqlParser.get[String](C.EMP_PISO) ~
      SqlParser.get[String](C.EMP_DEPTO) ~
      SqlParser.get[String](C.EMP_LOCALIDAD) ~
      SqlParser.get[String](C.EMP_CODPOSTAL) ~
      SqlParser.get[String](C.EMP_TEL) ~
      SqlParser.get[String](C.EMP_FAX) ~
      SqlParser.get[String](C.EMP_EMAIL) ~
      SqlParser.get[String](C.EMP_WEB) ~
      SqlParser.get[String](C.EMP_DESCRIP) ~
      SqlParser.get[Date](DBHelper.CREATED_AT) ~
      SqlParser.get[Date](DBHelper.UPDATED_AT) ~
      SqlParser.get[Int](DBHelper.UPDATED_BY) map {
      case
              id ~
              name ~
              active ~
              razonsocial ~
              cuit ~
              ingresosbrutos ~
              catfiscal ~
              chequeorden ~
              calle ~
              callenumero ~
              piso ~
              depto ~
              localidad ~
              codpostal ~
              tel ~
              fax ~
              email ~
              web ~
              descrip  ~
              createdAt ~
              updatedAt ~
              updatedBy =>
        Empresa(
              id,
              name,
              active != 0,
              razonsocial,
              cuit,
              ingresosbrutos,
              catfiscal,
              chequeorden,
              calle,
              callenumero,
              piso,
              depto,
              localidad,
              codpostal,
              tel,
              fax,
              email,
              web,
              descrip,
              createdAt,
              updatedAt,
              updatedBy)
    }
  }

  def create(user: CompanyUser, empresa: Empresa): Empresa = {
    save(user, empresa, true)
  }

  def update(user: CompanyUser, empresa: Empresa): Empresa = {
    save(user, empresa, false)
  }

  private def save(user: CompanyUser, empresa: Empresa, isNew: Boolean): Empresa = {
    def getFields = {
      List(
        Field(C.EMP_NAME, empresa.name, FieldType.text),
        Field(DBHelper.ACTIVE, Register.boolToInt(empresa.active), FieldType.boolean),
        Field(C.EMP_RAZONSOCIAL, empresa.razonsocial, FieldType.text),
        Field(C.EMP_CUIT, empresa.cuit, FieldType.text),
        Field(C.EMP_INGRESOSBRUTOS, empresa.ingresosbrutos, FieldType.text),
        Field(C.EMP_CATFISCAL, empresa.catfiscal, FieldType.integer),
        Field(C.EMP_CHEQUEORDEN, empresa.chequeorden, FieldType.text),
        Field(C.EMP_CALLE, empresa.calle, FieldType.text),
        Field(C.EMP_CALLENUMERO, empresa.callenumero, FieldType.text),
        Field(C.EMP_PISO, empresa.piso, FieldType.text),
        Field(C.EMP_DEPTO, empresa.depto, FieldType.text),
        Field(C.EMP_LOCALIDAD, empresa.localidad, FieldType.text),
        Field(C.EMP_CODPOSTAL, empresa.codpostal, FieldType.text),
        Field(C.EMP_TEL, empresa.tel, FieldType.text),
        Field(C.EMP_FAX, empresa.fax, FieldType.text),
        Field(C.EMP_EMAIL, empresa.email, FieldType.text),
        Field(C.EMP_WEB, empresa.web, FieldType.text),
        Field(C.EMP_DESCRIP, empresa.descrip, FieldType.text)
      )
    }
    def throwException = {
      throw new RuntimeException(s"Error when saving ${C.EMPRESA}")
    }

    DBHelper.saveEx(
      user,
      Register(
        C.EMPRESA,
        C.EMP_ID,
        empresa.id,
        false,
        true,
        true,
        getFields),
      isNew,
      ""
    ) match {
      case SaveResult(true, id) => load(user, id).getOrElse(throwException)
      case SaveResult(false, id) => throwException
    }
  }

  def load(user: CompanyUser, id: Int): Option[Empresa] = {
    loadWhere(user, s"${C.EMP_ID} = {id}", 'id -> id)
  }

  def loadWhere(user: CompanyUser, where: String, args : scala.Tuple2[scala.Any, anorm.ParameterValue[_]]*) = {
    DB.withConnection(user.database.database) { implicit connection =>
      SQL(s"SELECT t1.* FROM ${C.EMPRESA} t1 WHERE $where")
        .on(args: _*)
        .as(empresaParser.singleOpt)
    }
  }

  def delete(user: CompanyUser, id: Int) = {
    DB.withConnection(user.database.database) { implicit connection =>
      try {
        SQL(s"DELETE FROM ${C.EMPRESA} WHERE ${C.EMP_ID} = {id}")
        .on('id -> id)
        .executeUpdate
      } catch {
        case NonFatal(e) => {
          Logger.error(s"can't delete a ${C.EMPRESA}. ${C.EMP_ID} id: $id. Error ${e.toString}")
          throw e
        }
      }
    }
  }

  def get(user: CompanyUser, id: Int): Empresa = {
    load(user, id) match {
      case Some(p) => p
      case None => emptyEmpresa
    }
  }
}
