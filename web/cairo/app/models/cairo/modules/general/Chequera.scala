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

case class Chequera(
                     id: Int,
                     code: String,
                     active: Boolean,
                     minNumber: Int,
                     maxNumber: Int,
                     lastNumber: Int,
                     default: Boolean,
                     cueId: Int,
                     cueName: String,
                     createdAt: Date,
                     updatedAt: Date,
                     updatedBy: Int) {

  def this(
      id: Int,
      code: String,
      active: Boolean,
      minNumber: Int,
      maxNumber: Int,
      lastNumber: Int,
      default: Boolean,
      cueId: Int) = {

    this(
      id,
      code,
      active,
      minNumber,
      maxNumber,
      lastNumber,
      default,
      cueId,
      "",
      DateUtil.currentTime,
      DateUtil.currentTime,
      DBHelper.NoId)
  }

  def this(
      code: String,
      active: Boolean,
      minNumber: Int,
      maxNumber: Int,
      lastNumber: Int,
      default: Boolean,
      cueId: Int) = {

    this(
      DBHelper.NoId,
      code,
      active,
      minNumber,
      maxNumber,
      lastNumber,
      default,
      cueId)

  }

}

object Chequera {

  lazy val emptyChequera = Chequera("", false, 0, 0, 0, false, DBHelper.NoId)

  def apply(
      id: Int,
      code: String,
      active: Boolean,
      minNumber: Int,
      maxNumber: Int,
      lastNumber: Int,
      default: Boolean,
      cueId: Int) = {

    new Chequera(
      id,
      code,
      active,
      minNumber,
      maxNumber,
      lastNumber,
      default,
      cueId)
  }

  def apply(
      code: String,
      active: Boolean,
      minNumber: Int,
      maxNumber: Int,
      lastNumber: Int,
      default: Boolean,
      cueId: Int) = {

    new Chequera(
      code,
      active,
      minNumber,
      maxNumber,
      lastNumber,
      default,
      cueId)
  }

  private val chequeraParser: RowParser[Chequera] = {
      SqlParser.get[Int](C.CHQ_ID) ~
      SqlParser.get[String](C.CHQ_CODE) ~
      SqlParser.get[Int](DBHelper.ACTIVE) ~
      SqlParser.get[Int](C.CHQ_NUMERO_DESDE) ~
      SqlParser.get[Int](C.CHQ_NUMERO_HASTA) ~
      SqlParser.get[Int](C.CHQ_ULTIMO_NUMERO) ~
      SqlParser.get[Int](C.CHQ_DEFAULT) ~
      SqlParser.get[Int](C.CUE_ID) ~
      SqlParser.get[String](C.CUE_NAME) ~
      SqlParser.get[Date](DBHelper.CREATED_AT) ~
      SqlParser.get[Date](DBHelper.UPDATED_AT) ~
      SqlParser.get[Int](DBHelper.UPDATED_BY) map {
      case
              id ~
              code ~
              active  ~
              minNumber ~
              maxNumber ~
              lastNumber ~
              default ~
              cueId ~
              cueName ~
              createdAt ~
              updatedAt ~
              updatedBy =>
        Chequera(
              id,
              code,
              active != 0,
              minNumber,
              maxNumber,
              lastNumber,
              default != 0,
              cueId,
              cueName,
              createdAt,
              updatedAt,
              updatedBy)
    }
  }

  def create(user: CompanyUser, chequera: Chequera): Chequera = {
    save(user, chequera, true)
  }

  def update(user: CompanyUser, chequera: Chequera): Chequera = {
    save(user, chequera, false)
  }

  private def save(user: CompanyUser, chequera: Chequera, isNew: Boolean): Chequera = {
    def getFields = {
      List(
        Field(C.CHQ_CODE, chequera.code, FieldType.text),
        Field(C.CHQ_NUMERO_DESDE, chequera.minNumber, FieldType.number),
        Field(C.CHQ_NUMERO_HASTA, chequera.maxNumber, FieldType.number),
        Field(C.CHQ_ULTIMO_NUMERO, chequera.lastNumber, FieldType.number),
        Field(C.CHQ_DEFAULT, Register.boolToInt(chequera.default), FieldType.boolean),
        Field(C.CUE_ID, chequera.cueId, FieldType.id),
        Field(DBHelper.ACTIVE, Register.boolToInt(chequera.active), FieldType.boolean)
      )
    }
    def throwException = {
      throw new RuntimeException(s"Error when saving ${C.CHEQUERA}")
    }

    def saveDefault() = {
      if(chequera.default) {
        DB.withTransaction(user.database.database) { implicit connection =>
          SQL("UPDATE Chequera SET chq_default = 0 where chq_id <> {id} and cue_id = {cueId}")
            .on('id -> chequera.id, 'cueId -> chequera.cueId)
            .executeUpdate
        }
      }
    }

    DBHelper.saveEx(
      user,
      Register(
        C.CHEQUERA,
        C.CHQ_ID,
        chequera.id,
        false,
        true,
        true,
        getFields),
      isNew,
      C.CHQ_CODE
    ) match {
      case SaveResult(true, id) => {
        saveDefault
        load(user, id).getOrElse(throwException)
      }
      case SaveResult(false, _) => throwException
    }
  }

  def load(user: CompanyUser, id: Int): Option[Chequera] = {
    loadWhere(user, s"${C.CHQ_ID} = {id}", 'id -> id)
  }

  def loadWhere(user: CompanyUser, where: String, args : scala.Tuple2[scala.Any, anorm.ParameterValue[_]]*) = {
    DB.withConnection(user.database.database) { implicit connection =>
      SQL(s"SELECT t1.*,t2.${C.CUE_NAME} FROM ${C.CHEQUERA} t1 INNER JOIN ${C.CUENTA} t2" +
        s" ON t1.${C.CUE_ID} = t2.${C.CUE_ID} WHERE $where")
        .on(args: _*)
        .as(chequeraParser.singleOpt)
    }
  }

  def delete(user: CompanyUser, id: Int) = {
    DB.withConnection(user.database.database) { implicit connection =>
      try {
        SQL(s"DELETE FROM ${C.CHEQUERA} WHERE ${C.CHQ_ID} = {id}")
        .on('id -> id)
        .executeUpdate
      } catch {
        case NonFatal(e) => {
          Logger.error(s"can't delete a ${C.CHEQUERA}. ${C.CHQ_ID} id: $id. Error ${e.toString}")
          throw e
        }
      }
    }
  }

  def get(user: CompanyUser, id: Int): Chequera = {
    load(user, id) match {
      case Some(p) => p
      case None => emptyChequera
    }
  }

  def nextNumber(user: CompanyUser, id: Int): Int = {

    load(user, id)  match {
      case Some(chequera) => {
        val nextNumber = chequera.lastNumber + 1
        if(chequera.minNumber > nextNumber)
          chequera.minNumber
        else if(chequera.maxNumber < nextNumber)
          chequera.maxNumber
        else
          nextNumber
      }
      case None => 0
    }
  }
}
