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

case class DepositoLogico(
                    id: Int,
                    name: String,
                    code: String,
                    active: Boolean,
                    descrip: String,
                    createdAt: Date,
                    updatedAt: Date,
                    updatedBy: Int) {

  def this(
            id: Int,
            name: String,
            code: String,
            active: Boolean,
            descrip: String) = {

    this(
      id,
      name,
      code,
      active,
      descrip,
      DateUtil.currentTime,
      DateUtil.currentTime,
      DBHelper.NoId)
  }

  def this(
            name: String,
            code: String,
            active: Boolean,
            descrip: String) = {

    this(
      DBHelper.NoId,
      name,
      code,
      active,
      descrip)

  }

}

case class DepositoLogicoInfo(depfId: Int, ctrlStockType: Int)

object DepositoLogico {

  lazy val emptyDepositoLogico = DepositoLogico(
    "",
    "",
    false,
    "")

  def apply(
             id: Int,
             name: String,
             code: String,
             active: Boolean,
             descrip: String) = {

    new DepositoLogico(
      id,
      name,
      code,
      active,
      descrip)
  }

  def apply(
             name: String,
             code: String,
             active: Boolean,
             descrip: String) = {

    new DepositoLogico(
      name,
      code,
      active,
      descrip)
  }

  private val depositoLogicoParser: RowParser[DepositoLogico] = {
    SqlParser.get[Int](C.DEPL_ID) ~
    SqlParser.get[String](C.DEPL_NAME) ~
    SqlParser.get[String](C.DEPL_CODE) ~
    SqlParser.get[Int](DBHelper.ACTIVE) ~
    SqlParser.get[String](C.DEPL_DESCRIP) ~
    SqlParser.get[Date](DBHelper.CREATED_AT) ~
    SqlParser.get[Date](DBHelper.UPDATED_AT) ~
    SqlParser.get[Int](DBHelper.UPDATED_BY) map {
      case
        id ~
          name ~
          code ~
          active ~
          descrip  ~
          createdAt ~
          updatedAt ~
          updatedBy =>
        DepositoLogico(
          id,
          name,
          code,
          active != 0,
          descrip,
          createdAt,
          updatedAt,
          updatedBy)
    }
  }

  def create(user: CompanyUser, depositoLogico: DepositoLogico): DepositoLogico = {
    save(user, depositoLogico, true)
  }

  def update(user: CompanyUser, depositoLogico: DepositoLogico): DepositoLogico = {
    save(user, depositoLogico, false)
  }

  private def save(user: CompanyUser, depositoLogico: DepositoLogico, isNew: Boolean): DepositoLogico = {
    def getFields = {
      List(
        Field(C.DEPL_NAME, depositoLogico.name, FieldType.text),
        Field(C.DEPL_CODE, depositoLogico.code, FieldType.text),
        Field(DBHelper.ACTIVE, Register.boolToInt(depositoLogico.active), FieldType.boolean),
        Field(C.DEPL_DESCRIP, depositoLogico.descrip, FieldType.text)
      )
    }
    def throwException = {
      throw new RuntimeException(s"Error when saving ${C.DEPOSITO_LOGICO}")
    }

    DBHelper.saveEx(
      user,
      Register(
        C.DEPOSITO_LOGICO,
        C.DEPL_ID,
        depositoLogico.id,
        false,
        true,
        true,
        getFields),
      isNew,
      C.DEPL_CODE
    ) match {
      case SaveResult(true, id) => load(user, id).getOrElse(throwException)
      case SaveResult(false, _) => throwException
    }
  }

  def load(user: CompanyUser, id: Int): Option[DepositoLogico] = {
    loadWhere(user, s"${C.DEPL_ID} = {id}", 'id -> id)
  }

  def loadWhere(user: CompanyUser, where: String, args : scala.Tuple2[scala.Any, anorm.ParameterValue[_]]*) = {
    DB.withConnection(user.database.database) { implicit connection =>
      SQL(s"SELECT t1.* FROM ${C.DEPOSITO_LOGICO} t1 WHERE $where")
        .on(args: _*)
        .as(depositoLogicoParser.singleOpt)
    }
  }

  def delete(user: CompanyUser, id: Int) = {
    DB.withConnection(user.database.database) { implicit connection =>
      try {
        SQL(s"DELETE FROM ${C.DEPOSITO_LOGICO} WHERE ${C.DEPL_ID} = {id}")
          .on('id -> id)
          .executeUpdate
      } catch {
        case NonFatal(e) => {
          Logger.error(s"can't delete a ${C.DEPOSITO_LOGICO}. ${C.DEPL_ID} id: $id. Error ${e.toString}")
          throw e
        }
      }
    }
  }

  def get(user: CompanyUser, id: Int): DepositoLogico = {
    load(user, id) match {
      case Some(p) => p
      case None => emptyDepositoLogico
    }
  }

  def info(user: CompanyUser, id: Int): DepositoLogicoInfo = {

    DB.withTransaction(user.database.database) { implicit connection =>

      val sql = "{call sp_deposito_logico_get_info(?, ?, ?)}"
      val cs = connection.prepareCall(sql)

      cs.setInt(1, id)
      cs.registerOutParameter(2, Types.INTEGER)
      cs.registerOutParameter(3, Types.SMALLINT)

      try {
        cs.execute()

        DepositoLogicoInfo(cs.getInt(2), cs.getShort(3))

      } catch {
        case NonFatal(e) => {
          Logger.error(s"can't get deposito logico info with deplId $id for user ${user.toString}. Error ${e.toString}")
          throw e
        }
      } finally {
        cs.close
      }
    }
  }
}
