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

case class Empresadelete(
              id: Int,
,
              createdAt: Date,
              updatedAt: Date,
              updatedBy: Int) {

  def this(
      id: Int,
) = {

    this(
      id,
,
      DateUtil.currentTime,
      DateUtil.currentTime,
      DBHelper.NoId)
  }

  def this(
) = {

    this(
      DBHelper.NoId,
)

  }

}

object Empresadelete {

  lazy val emptyEmpresadelete = Empresadelete(
)

  def apply(
      id: Int,
) = {

    new Empresadelete(
      id,
)
  }

  def apply(
) = {

    new Empresadelete(
)
  }

  private val empresadeleteParser: RowParser[Empresadelete] = {
      SqlParser.get[Int](C.ID) ~
      SqlParser.get[Date](DBHelper.CREATED_AT) ~
      SqlParser.get[Date](DBHelper.UPDATED_AT) ~
      SqlParser.get[Int](DBHelper.UPDATED_BY) map {
      case
              id ~
 ~
              createdAt ~
              updatedAt ~
              updatedBy =>
        Empresadelete(
              id,
,
              createdAt,
              updatedAt,
              updatedBy)
    }
  }

  def create(user: CompanyUser, empresadelete: Empresadelete): Empresadelete = {
    save(user, empresadelete, true)
  }

  def update(user: CompanyUser, empresadelete: Empresadelete): Empresadelete = {
    save(user, empresadelete, false)
  }

  private def save(user: CompanyUser, empresadelete: Empresadelete, isNew: Boolean): Empresadelete = {
    def getFields = {
      List(

      )
    }
    def throwException = {
      throw new RuntimeException(s"Error when saving ${C.EMPRESADELETE}")
    }

    DBHelper.saveEx(
      user,
      Register(
        C.EMPRESADELETE,
        C.ID,
        empresadelete.id,
        false,
        true,
        true,
        getFields),
      isNew,
      C.CODE
    ) match {
      case SaveResult(true, id) => load(user, id).getOrElse(throwException)
      case SaveResult(false, id) => throwException
    }
  }

  def load(user: CompanyUser, id: Int): Option[Empresadelete] = {
    loadWhere(user, s"${C.ID} = {id}", 'id -> id)
  }

  def loadWhere(user: CompanyUser, where: String, args : scala.Tuple2[scala.Any, anorm.ParameterValue[_]]*) = {
    DB.withConnection(user.database.database) { implicit connection =>
      SQL(s"SELECT t1.*, t2.${C.FK_NAME} FROM ${C.EMPRESADELETE} t1 INNER JOIN ${C.???} t2 ON t1.${C.FK_ID} = t2.${C.FK_ID} WHERE $where")
        .on(args: _*)
        .as(empresadeleteParser.singleOpt)
    }
  }

  def delete(user: CompanyUser, id: Int) = {
    DB.withConnection(user.database.database) { implicit connection =>
      try {
        SQL(s"DELETE FROM ${C.EMPRESADELETE} WHERE ${C.ID} = {id}")
        .on('id -> id)
        .executeUpdate
      } catch {
        case NonFatal(e) => {
          Logger.error(s"can't delete a ${C.EMPRESADELETE}. ${C.ID} id: $id. Error ${e.toString}")
          throw e
        }
      }
    }
  }

  def get(user: CompanyUser, id: Int): Empresadelete = {
    load(user, id) match {
      case Some(p) => p
      case None => emptyEmpresadelete
    }
  }
}
