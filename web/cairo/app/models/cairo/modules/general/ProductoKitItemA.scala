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

case class Productokititema(
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

object Productokititema {

  lazy val emptyProductokititema = Productokititema(
)

  def apply(
      id: Int,
) = {

    new Productokititema(
      id,
)
  }

  def apply(
) = {

    new Productokititema(
)
  }

  private val productokititemaParser: RowParser[Productokititema] = {
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
        Productokititema(
              id,
,
              createdAt,
              updatedAt,
              updatedBy)
    }
  }

  def create(user: CompanyUser, productokititema: Productokititema): Productokititema = {
    save(user, productokititema, true)
  }

  def update(user: CompanyUser, productokititema: Productokititema): Productokititema = {
    save(user, productokititema, false)
  }

  private def save(user: CompanyUser, productokititema: Productokititema, isNew: Boolean): Productokititema = {
    def getFields = {
      List(

      )
    }
    def throwException = {
      throw new RuntimeException(s"Error when saving ${C.PRODUCTOKITITEMA}")
    }

    DBHelper.saveEx(
      user,
      Register(
        C.PRODUCTOKITITEMA,
        C.ID,
        productokititema.id,
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

  def load(user: CompanyUser, id: Int): Option[Productokititema] = {
    loadWhere(user, s"${C.ID} = {id}", 'id -> id)
  }

  def loadWhere(user: CompanyUser, where: String, args : scala.Tuple2[scala.Any, anorm.ParameterValue[_]]*) = {
    DB.withConnection(user.database.database) { implicit connection =>
      SQL(s"SELECT t1.*, t2.${C.FK_NAME} FROM ${C.PRODUCTOKITITEMA} t1 INNER JOIN ${C.???} t2 ON t1.${C.FK_ID} = t2.${C.FK_ID} WHERE $where")
        .on(args: _*)
        .as(productokititemaParser.singleOpt)
    }
  }

  def delete(user: CompanyUser, id: Int) = {
    DB.withConnection(user.database.database) { implicit connection =>
      try {
        SQL(s"DELETE FROM ${C.PRODUCTOKITITEMA} WHERE ${C.ID} = {id}")
        .on('id -> id)
        .executeUpdate
      } catch {
        case NonFatal(e) => {
          Logger.error(s"can't delete a ${C.PRODUCTOKITITEMA}. ${C.ID} id: $id. Error ${e.toString}")
          throw e
        }
      }
    }
  }

  def get(user: CompanyUser, id: Int): Productokititema = {
    load(user, id) match {
      case Some(p) => p
      case None => emptyProductokititema
    }
  }
}

