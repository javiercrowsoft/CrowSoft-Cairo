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

case class Chofer(
              id: Int,
              name: String,
              code: String,
              active: Boolean,
              transId: Int,
              transName: String,
              camId: Int,
              camName: String,
              direccion: String,
              dni: Int,
              fechadenacimiento: Date,
              telefono: String,
              descrip: String,
              createdAt: Date,
              updatedAt: Date,
              updatedBy: Int) {

  def this(
      id: Int,
      name: String,
      code: String,
      active: Boolean,
      transId: Int,
      camId: Int,
      direccion: String,
      dni: Int,
      fechadenacimiento: Date,
      telefono: String,
      descrip: String) = {

    this(
      id,
      name,
      code,
      active,
      transId,
      "",
      camId,
      "",
      direccion,
      dni,
      fechadenacimiento,
      telefono,
      descrip,
      DateUtil.currentTime,
      DateUtil.currentTime,
      DBHelper.NoId)
  }

  def this(
      name: String,
      code: String,
      active: Boolean,
      transId: Int,
      camId: Int,
      direccion: String,
      dni: Int,
      fechadenacimiento: Date,
      telefono: String,
      descrip: String) = {

    this(
      DBHelper.NoId,
      name,
      code,
      active,
      transId,
      camId,
      direccion,
      dni,
      fechadenacimiento,
      telefono,
      descrip)

  }

}

object Chofer {

  lazy val emptyChofer = Chofer(
    "",
    "",
    false,
    DBHelper.NoId,
    DBHelper.NoId,
    "",
    0,
    null,
    "",
    "")

  def apply(
      id: Int,
      name: String,
      code: String,
      active: Boolean,
      transId: Int,
      camId: Int,
      direccion: String,
      dni: Int,
      fechadenacimiento: Date,
      telefono: String,
      descrip: String) = {

    new Chofer(
      id,
      name,
      code,
      active,
      transId,
      camId,
      direccion,
      dni,
      fechadenacimiento,
      telefono,
      descrip)
  }

  def apply(
      name: String,
      code: String,
      active: Boolean,
      transId: Int,
      camId: Int,
      direccion: String,
      dni: Int,
      fechadenacimiento: Date,
      telefono: String,
      descrip: String) = {

    new Chofer(
      name,
      code,
      active,
      transId,
      camId,
      direccion,
      dni,
      fechadenacimiento,
      telefono,
      descrip)
  }

  private val choferParser: RowParser[Chofer] = {
      SqlParser.get[Int](C.CHOF_ID) ~
      SqlParser.get[String](C.CHOF_NAME) ~
      SqlParser.get[String](C.CHOF_CODE) ~
      SqlParser.get[Int](DBHelper.ACTIVE) ~
      SqlParser.get[Int](C.TRANS_ID) ~
      SqlParser.get[String](C.TRANS_NAME) ~
      SqlParser.get[Int](C.CAM_ID) ~
      SqlParser.get[String](C.CAM_NAME) ~
      SqlParser.get[String](C.CHOF_DIRECCION) ~
      SqlParser.get[Int](C.CHOF_DNI) ~
      SqlParser.get[Date](C.CHOF_FECHADENACIMIENTO) ~
      SqlParser.get[String](C.CHOF_TELEFONO) ~
      SqlParser.get[String](C.CHOF_DESCRIP) ~
      SqlParser.get[Date](DBHelper.CREATED_AT) ~
      SqlParser.get[Date](DBHelper.UPDATED_AT) ~
      SqlParser.get[Int](DBHelper.UPDATED_BY) map {
      case
              id ~
              name ~
              code ~
              active ~
              transId ~
              transName ~
              camId ~
              camName ~
              direccion ~
              dni ~
              fechadenacimiento ~
              telefono ~
              descrip  ~
              createdAt ~
              updatedAt ~
              updatedBy =>
        Chofer(
              id,
              name,
              code,
              (if(active != 0) true else false),
              transId,
              transName,
              camId,
              camName,
              direccion,
              dni,
              fechadenacimiento,
              telefono,
              descrip,
              createdAt,
              updatedAt,
              updatedBy)
    }
  }

  def create(user: CompanyUser, chofer: Chofer): Chofer = {
    save(user, chofer, true)
  }

  def update(user: CompanyUser, chofer: Chofer): Chofer = {
    save(user, chofer, false)
  }

  private def save(user: CompanyUser, chofer: Chofer, isNew: Boolean): Chofer = {
    def getFields = {
      List(
        Field(C.CHOF_NAME, chofer.name, FieldType.text),
        Field(C.CHOF_CODE, chofer.code, FieldType.text),
        Field(DBHelper.ACTIVE, (if(chofer.active) 1 else 0), FieldType.boolean),
        Field(C.TRANS_ID, chofer.transId, FieldType.id),
        Field(C.CAM_ID, chofer.camId, FieldType.id),
        Field(C.CHOF_DIRECCION, chofer.direccion, FieldType.text),
        Field(C.CHOF_DNI, chofer.dni, FieldType.number),
        Field(C.CHOF_FECHADENACIMIENTO, chofer.fechadenacimiento, FieldType.number),
        Field(C.CHOF_TELEFONO, chofer.telefono, FieldType.text),
        Field(C.CHOF_DESCRIP, chofer.descrip, FieldType.text)
      )
    }
    def throwException = {
      throw new RuntimeException(s"Error when saving ${C.CHOFER}")
    }

    DBHelper.saveEx(
      user,
      Register(
        C.CHOFER,
        C.CHOF_ID,
        chofer.id,
        false,
        true,
        true,
        getFields),
      isNew,
      C.CHOF_CODE
    ) match {
      case SaveResult(true, id) => load(user, id).getOrElse(throwException)
      case SaveResult(false, id) => throwException
    }
  }

  def load(user: CompanyUser, id: Int): Option[Chofer] = {
    loadWhere(user, s"${C.CHOF_ID} = {id}", 'id -> id)
  }

  def loadWhere(user: CompanyUser, where: String, args : scala.Tuple2[scala.Any, anorm.ParameterValue[_]]*) = {
    DB.withConnection(user.database.database) { implicit connection =>
      SQL(s"SELECT t1.*, t2.${C.TRANS_NAME}, t3.${C.CAM_NAME}" +
        s" FROM ${C.CHOFER} t1" +
        s" LEFT JOIN ${C.TRANSPORTE} t2 ON t1.${C.TRANS_ID} = t2.${C.TRANS_ID}" +
        s" LEFT JOIN ${C.CAMION} t3 ON t1.${C.CAM_ID} = t3.${C.CAM_ID}" +
        s" WHERE $where")
        .on(args: _*)
        .as(choferParser.singleOpt)
    }
  }

  def delete(user: CompanyUser, id: Int) = {
    DB.withConnection(user.database.database) { implicit connection =>
      try {
        SQL(s"DELETE FROM ${C.CHOFER} WHERE ${C.CHOF_ID} = {id}")
        .on('id -> id)
        .executeUpdate
      } catch {
        case NonFatal(e) => {
          Logger.error(s"can't delete a ${C.CHOFER}. ${C.CHOF_ID} id: $id. Error ${e.toString}")
          throw e
        }
      }
    }
  }

  def get(user: CompanyUser, id: Int): Chofer = {
    load(user, id) match {
      case Some(p) => p
      case None => emptyChofer
    }
  }
}