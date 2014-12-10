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

case class Camion(
              id: Int,
              code: String,
              active: Boolean,
              esSemi: Boolean,
              patente: String,
              patentesemi: String,
              tara: Long,
              transId: Int,
              transName: String,
              chofId: Int,
              chofName: String,
              descrip: String,
              createdAt: Date,
              updatedAt: Date,
              updatedBy: Int) {

  def this(
      id: Int,
      code: String,
      active: Boolean,
      esSemi: Boolean,
      patente: String,
      patentesemi: String,
      tara: Long,
      transId: Int,
      chofId: Int,
      descrip: String) = {

    this(
      id,
      code,
      active,
      esSemi,
      patente,
      patentesemi,
      tara,
      transId,
      "",
      chofId,
      "",
      descrip,
      DateUtil.currentTime,
      DateUtil.currentTime,
      DBHelper.NoId)
  }

  def this(
      code: String,
      active: Boolean,
      esSemi: Boolean,
      patente: String,
      patentesemi: String,
      tara: Long,
      transId: Int,
      chofId: Int,
      descrip: String) = {

    this(
      DBHelper.NoId,
      code,
      active,
      esSemi,
      patente,
      patentesemi,
      tara,
      transId,
      chofId,
      descrip)

  }

}

object Camion {

  lazy val emptyCamion = Camion(
    "",
    false,
    false,
    "",
    "",
    0,
    DBHelper.NoId,
    DBHelper.NoId,
    "")

  def apply(
      id: Int,
      code: String,
      active: Boolean,
      esSemi: Boolean,
      patente: String,
      patentesemi: String,
      tara: Long,
      transId: Int,
      chofId: Int,
      descrip: String) = {

    new Camion(
      id,
      code,
      active,
      esSemi,
      patente,
      patentesemi,
      tara,
      transId,
      chofId,
      descrip)
  }

  def apply(
      code: String,
      active: Boolean,
      esSemi: Boolean,
      patente: String,
      patentesemi: String,
      tara: Long,
      transId: Int,
      chofId: Int,
      descrip: String) = {

    new Camion(
      code,
      active,
      esSemi,
      patente,
      patentesemi,
      tara,
      transId,
      chofId,
      descrip)
  }

  private val camionParser: RowParser[Camion] = {
      SqlParser.get[Int](C.CAM_ID) ~
      SqlParser.get[String](C.CAM_CODE) ~
      SqlParser.get[Int](DBHelper.ACTIVE) ~
      SqlParser.get[Boolean](C.CAM_ES_SEMI) ~
      SqlParser.get[String](C.CAM_PATENTE) ~
      SqlParser.get[String](C.CAM_PATENTESEMI) ~
      SqlParser.get[Long](C.CAM_TARA) ~
      SqlParser.get[Int](C.TRANS_ID) ~
      SqlParser.get[String](C.TRANS_NAME) ~
      SqlParser.get[Int](C.CHOF_ID) ~
      SqlParser.get[String](C.CHOF_NAME) ~
      SqlParser.get[String](C.CAM_DESCRIP) ~
      SqlParser.get[Date](DBHelper.CREATED_AT) ~
      SqlParser.get[Date](DBHelper.UPDATED_AT) ~
      SqlParser.get[Int](DBHelper.UPDATED_BY) map {
      case
              id ~
              code ~
              active ~
              esSemi ~
              patente ~
              patentesemi ~
              tara ~
              transId ~
              transName ~
              chofId ~
              chofName ~
              descrip  ~
              createdAt ~
              updatedAt ~
              updatedBy =>
        Camion(
              id,
              code,
              (if(active != 0) true else false),
              esSemi,
              patente,
              patentesemi,
              tara,
              transId,
              transName,
              chofId,
              chofName,
              descrip,
              createdAt,
              updatedAt,
              updatedBy)
    }
  }

  def create(user: CompanyUser, camion: Camion): Camion = {
    save(user, camion, true)
  }

  def update(user: CompanyUser, camion: Camion): Camion = {
    save(user, camion, false)
  }

  private def save(user: CompanyUser, camion: Camion, isNew: Boolean): Camion = {
    def getFields = {
      List(
        Field(C.CAM_CODE, camion.code, FieldType.text),
        Field(DBHelper.ACTIVE, (if(camion.active) 1 else 0), FieldType.boolean),
        Field(C.CAM_ES_SEMI, camion.esSemi, FieldType.boolean),
        Field(C.CAM_PATENTE, camion.patente, FieldType.text),
        Field(C.CAM_PATENTESEMI, camion.patentesemi, FieldType.text),
        Field(C.CAM_TARA, camion.tara, FieldType.number),
        Field(C.TRANS_ID, camion.transId, FieldType.id),
        Field(C.CHOF_ID, camion.chofId, FieldType.id),
        Field(C.CAM_DESCRIP, camion.descrip, FieldType.text)
      )
    }
    def throwException = {
      throw new RuntimeException(s"Error when saving ${C.CAMION}")
    }

    DBHelper.saveEx(
      user,
      Register(
        C.CAMION,
        C.CAM_ID,
        camion.id,
        false,
        true,
        true,
        getFields),
      isNew,
      C.CAM_CODE
    ) match {
      case SaveResult(true, id) => load(user, id).getOrElse(throwException)
      case SaveResult(false, id) => throwException
    }
  }

  def load(user: CompanyUser, id: Int): Option[Camion] = {
    loadWhere(user, s"${C.CAM_ID} = {id}", 'id -> id)
  }

  def loadWhere(user: CompanyUser, where: String, args : scala.Tuple2[scala.Any, anorm.ParameterValue[_]]*) = {
    DB.withConnection(user.database.database) { implicit connection =>
      SQL(s"SELECT t1.*, t2.${C.FK_NAME} FROM ${C.CAMION} t1 INNER JOIN ${C.???} t2 ON t1.${C.FK_ID} = t2.${C.FK_ID} WHERE $where")
        .on(args: _*)
        .as(camionParser.singleOpt)
    }
  }

  def delete(user: CompanyUser, id: Int) = {
    DB.withConnection(user.database.database) { implicit connection =>
      try {
        SQL(s"DELETE FROM ${C.CAMION} WHERE ${C.CAM_ID} = {id}")
        .on('id -> id)
        .executeUpdate
      } catch {
        case NonFatal(e) => {
          Logger.error(s"can't delete a ${C.CAMION}. ${C.CAM_ID} id: $id. Error ${e.toString}")
          throw e
        }
      }
    }
  }

  def get(user: CompanyUser, id: Int): Camion = {
    load(user, id) match {
      case Some(p) => p
      case None => emptyCamion
    }
  }
}
