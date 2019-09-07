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

case class ProductoHelpConfig(
              id: Int,
              name: String,
              tecla: String,
              valorCode: String,
              atributoIndice: Int,
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

object ProductoHelpConfig {

  lazy val emptyProductoHelpConfig = ProductoHelpConfig(
    "",
    "",
    "",
    0,
    0,
    0,
    0,
    0,
    "")

  def apply(
      id: Int,
      name: String,
      tecla: String,
      valorCode: String,
      atributoIndice: Int,
      default: Int,
      defaultSrv: Int,
      defaultPrp: Int,
      defaultPrns: Int,
      descrip: String) = {

    new ProductoHelpConfig(
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
      default: Int,
      defaultSrv: Int,
      defaultPrp: Int,
      defaultPrns: Int,
      descrip: String) = {

    new ProductoHelpConfig(
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

  private val productoHelpConfigParser: RowParser[ProductoHelpConfig] = {
      SqlParser.get[Int](C.PRHC_ID) ~
      SqlParser.get[String](C.PRHC_NAME) ~
      SqlParser.get[String](C.PRHC_TECLA) ~
      SqlParser.get[String](C.PRHC_VALOR_CODE) ~
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
        ProductoHelpConfig(
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

  def create(user: CompanyUser, productoHelpConfig: ProductoHelpConfig): ProductoHelpConfig = {
    save(user, productoHelpConfig, true)
  }

  def update(user: CompanyUser, productoHelpConfig: ProductoHelpConfig): ProductoHelpConfig = {
    save(user, productoHelpConfig, false)
  }

  private def save(user: CompanyUser, productoHelpConfig: ProductoHelpConfig, isNew: Boolean): ProductoHelpConfig = {
    def getFields = {
      List(
        Field(C.PRHC_NAME, productoHelpConfig.name, FieldType.text),
        Field(C.PRHC_TECLA, productoHelpConfig.tecla, FieldType.text),
        Field(C.PRHC_VALOR_CODE, productoHelpConfig.valorCode, FieldType.text),
        Field(C.PRHC_ATRIBUTO_INDICE, productoHelpConfig.atributoIndice, FieldType.number),
        Field(C.PRHC_DEFAULT, productoHelpConfig.default, FieldType.number),
        Field(C.PRHC_DEFAULT_SRV, productoHelpConfig.defaultSrv, FieldType.number),
        Field(C.PRHC_DEFAULT_PRP, productoHelpConfig.defaultPrp, FieldType.number),
        Field(C.PRHC_DEFAULT_PRNS, productoHelpConfig.defaultPrns, FieldType.number),
        Field(C.PRHC_DESCRIP, productoHelpConfig.descrip, FieldType.text)
      )
    }
    def throwException = {
      throw new RuntimeException(s"Error when saving ${C.PRODUCTO_HELP_CONFIG}")
    }

    DBHelper.saveEx(
      user,
      Register(
        C.PRODUCTO_HELP_CONFIG,
        C.PRHC_ID,
        productoHelpConfig.id,
        false,
        true,
        true,
        getFields),
      isNew,
      ""
    ) match {
      case SaveResult(true, id) => load(user, id).getOrElse(throwException)
      case SaveResult(false, _) => throwException
    }
  }

  def load(user: CompanyUser, id: Int): Option[ProductoHelpConfig] = {
    loadWhere(user, s"${C.PRHC_ID} = {id}", 'id -> id)
  }

  def loadWhere(user: CompanyUser, where: String, args : scala.Tuple2[scala.Any, anorm.ParameterValue[_]]*) = {
    DB.withConnection(user.database.database) { implicit connection =>
      SQL(s"SELECT t1.*, FROM ${C.PRODUCTO_HELP_CONFIG} t1 WHERE $where")
        .on(args: _*)
        .as(productoHelpConfigParser.singleOpt)
    }
  }

  def delete(user: CompanyUser, id: Int) = {
    DB.withConnection(user.database.database) { implicit connection =>
      try {
        SQL(s"DELETE FROM ${C.PRODUCTO_HELP_CONFIG} WHERE ${C.PRHC_ID} = {id}")
        .on('id -> id)
        .executeUpdate
      } catch {
        case NonFatal(e) => {
          Logger.error(s"can't delete a ${C.PRODUCTO_HELP_CONFIG}. ${C.PRHC_ID} id: $id. Error ${e.toString}")
          throw e
        }
      }
    }
  }

  def get(user: CompanyUser, id: Int): ProductoHelpConfig = {
    load(user, id) match {
      case Some(p) => p
      case None => emptyProductoHelpConfig
    }
  }
}

