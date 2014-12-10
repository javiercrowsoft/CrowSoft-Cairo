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

case class Productohelpconfig(
              id: Int,
              name: String,
              tecla: String,
              valorCode: String,
              atributoIndice: Int,
Int,
              default: Int,
              defaultSrv: Int,
              defaultPrp: Int,
              defaultPrns: Int,
              descrip: String,
              createdAt: Date,
              updatedAt: Date,
              updatedBy: Int) {

  def this(
      id: Int,
      name: String,
      tecla: String,
      valorCode: String,
      atributoIndice: Int,
Int,
      default: Int,
      defaultSrv: Int,
      defaultPrp: Int,
      defaultPrns: Int,
      descrip: String) = {

    this(
      id,
      name,
      tecla,
      valorCode,
      atributoIndice,
      default,
      defaultSrv,
      defaultPrp,
      defaultPrns,
      descrip,
      DateUtil.currentTime,
      DateUtil.currentTime,
      DBHelper.NoId)
  }

  def this(
      name: String,
      tecla: String,
      valorCode: String,
      atributoIndice: Int,
Int,
      default: Int,
      defaultSrv: Int,
      defaultPrp: Int,
      defaultPrns: Int,
      descrip: String) = {

    this(
      DBHelper.NoId,
      name,
      tecla,
      valorCode,
      atributoIndice,
      default,
      defaultSrv,
      defaultPrp,
      defaultPrns,
      descrip)

  }

}

object Productohelpconfig {

  lazy val emptyProductohelpconfig = Productohelpconfig(
    "",
    "",
    "",
    null,
    null,
    null,
    null,
    null,
    null,
    "")

  def apply(
      id: Int,
      name: String,
      tecla: String,
      valorCode: String,
      atributoIndice: Int,
Int,
      default: Int,
      defaultSrv: Int,
      defaultPrp: Int,
      defaultPrns: Int,
      descrip: String) = {

    new Productohelpconfig(
      id,
      name,
      tecla,
      valorCode,
      atributoIndice,
      default,
      defaultSrv,
      defaultPrp,
      defaultPrns,
      descrip)
  }

  def apply(
      name: String,
      tecla: String,
      valorCode: String,
      atributoIndice: Int,
Int,
      default: Int,
      defaultSrv: Int,
      defaultPrp: Int,
      defaultPrns: Int,
      descrip: String) = {

    new Productohelpconfig(
      name,
      tecla,
      valorCode,
      atributoIndice,
      default,
      defaultSrv,
      defaultPrp,
      defaultPrns,
      descrip)
  }

  private val productohelpconfigParser: RowParser[Productohelpconfig] = {
      SqlParser.get[Int](C.PRHC_ID) ~
      SqlParser.get[String](C.PRHC_NAME) ~
      SqlParser.get[String](C.PRHC_TECLA) ~
      SqlParser.get[String](C.PRHC_VALOR_CODE) ~
      SqlParser.get[Int](C.PRHC_ATRIBUTO_INDICE) ~
      SqlParser.get[Int](C.PRHC_ATRIBUTO_INDICE) ~
      SqlParser.get[Int](C.PRHC_DEFAULT) ~
      SqlParser.get[Int](C.PRHC_DEFAULT_SRV) ~
      SqlParser.get[Int](C.PRHC_DEFAULT_PRP) ~
      SqlParser.get[Int](C.PRHC_DEFAULT_PRNS) ~
      SqlParser.get[String](C.PRHC_DESCRIP) ~
      SqlParser.get[Date](DBHelper.CREATED_AT) ~
      SqlParser.get[Date](DBHelper.UPDATED_AT) ~
      SqlParser.get[Int](DBHelper.UPDATED_BY) map {
      case
              id ~
              name ~
              tecla ~
              valorCode ~
              atributoIndice ~
              default ~
              defaultSrv ~
              defaultPrp ~
              defaultPrns ~
              descrip  ~
              createdAt ~
              updatedAt ~
              updatedBy =>
        Productohelpconfig(
              id,
              name,
              tecla,
              valorCode,
              atributoIndice,
              default,
              defaultSrv,
              defaultPrp,
              defaultPrns,
              descrip,
              createdAt,
              updatedAt,
              updatedBy)
    }
  }

  def create(user: CompanyUser, productohelpconfig: Productohelpconfig): Productohelpconfig = {
    save(user, productohelpconfig, true)
  }

  def update(user: CompanyUser, productohelpconfig: Productohelpconfig): Productohelpconfig = {
    save(user, productohelpconfig, false)
  }

  private def save(user: CompanyUser, productohelpconfig: Productohelpconfig, isNew: Boolean): Productohelpconfig = {
    def getFields = {
      List(
        Field(C.PRHC_NAME, productohelpconfig.name, FieldType.text),
        Field(C.PRHC_TECLA, productohelpconfig.tecla, FieldType.text),
        Field(C.PRHC_VALOR_CODE, productohelpconfig.valorCode, FieldType.text),
        Field(C.PRHC_ATRIBUTO_INDICE, productohelpconfig.atributoIndice, FieldType.number),
        Field(C.PRHC_ATRIBUTO_INDICE, productohelpconfig.atributoIndice, FieldType.number),
        Field(C.PRHC_DEFAULT, productohelpconfig.default, FieldType.number),
        Field(C.PRHC_DEFAULT_SRV, productohelpconfig.defaultSrv, FieldType.number),
        Field(C.PRHC_DEFAULT_PRP, productohelpconfig.defaultPrp, FieldType.number),
        Field(C.PRHC_DEFAULT_PRNS, productohelpconfig.defaultPrns, FieldType.number),
        Field(C.PRHC_DESCRIP, productohelpconfig.descrip, FieldType.text)
      )
    }
    def throwException = {
      throw new RuntimeException(s"Error when saving ${C.PRODUCTOHELPCONFIG}")
    }

    DBHelper.saveEx(
      user,
      Register(
        C.PRODUCTOHELPCONFIG,
        C.PRHC_ID,
        productohelpconfig.id,
        false,
        true,
        true,
        getFields),
      isNew,
      C.PRHC_CODE
    ) match {
      case SaveResult(true, id) => load(user, id).getOrElse(throwException)
      case SaveResult(false, id) => throwException
    }
  }

  def load(user: CompanyUser, id: Int): Option[Productohelpconfig] = {
    loadWhere(user, s"${C.PRHC_ID} = {id}", 'id -> id)
  }

  def loadWhere(user: CompanyUser, where: String, args : scala.Tuple2[scala.Any, anorm.ParameterValue[_]]*) = {
    DB.withConnection(user.database.database) { implicit connection =>
      SQL(s"SELECT t1.*, t2.${C.FK_NAME} FROM ${C.PRODUCTOHELPCONFIG} t1 INNER JOIN ${C.???} t2 ON t1.${C.FK_ID} = t2.${C.FK_ID} WHERE $where")
        .on(args: _*)
        .as(productohelpconfigParser.singleOpt)
    }
  }

  def delete(user: CompanyUser, id: Int) = {
    DB.withConnection(user.database.database) { implicit connection =>
      try {
        SQL(s"DELETE FROM ${C.PRODUCTOHELPCONFIG} WHERE ${C.PRHC_ID} = {id}")
        .on('id -> id)
        .executeUpdate
      } catch {
        case NonFatal(e) => {
          Logger.error(s"can't delete a ${C.PRODUCTOHELPCONFIG}. ${C.PRHC_ID} id: $id. Error ${e.toString}")
          throw e
        }
      }
    }
  }

  def get(user: CompanyUser, id: Int): Productohelpconfig = {
    load(user, id) match {
      case Some(p) => p
      case None => emptyProductohelpconfig
    }
  }
}

