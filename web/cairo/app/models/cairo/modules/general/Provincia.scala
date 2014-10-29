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

case class Provincia(
                      id: Int,
                      name: String,
                      code: String,
                      active: Boolean,
                      createdAt: Date,
                      updatedAt: Date,
                      updatedBy: Int,
                      paId: Int,
                      paName: String) {
  def this(id: Int,
           name: String,
           code: String,
           active: Boolean,
           paId: Int) = {
    this(id, name, code, active, DateUtil.currentTime, DateUtil.currentTime, DBHelper.NoId, paId, "")
  }

  def this(name: String, code: String, active: Boolean, paId: Int) = this(DBHelper.NoId, name, code, active, paId)

}

object Provincia {

  lazy val emptyProvincia = Provincia("", "", false, DBHelper.NoId)

  def apply(id: Int, name: String, code: String, active: Boolean, paId: Int) = new Provincia(id, name, code, active, paId)
  def apply(name: String, code: String, active: Boolean, paId: Int) = new Provincia(name, code, active, paId)

  private val provinciaParser: RowParser[Provincia] = {
    SqlParser.get[Int](C.PRO_ID) ~
      SqlParser.get[String](C.PRO_NAME) ~
      SqlParser.get[String](C.PRO_CODE) ~
      SqlParser.get[Int](DBHelper.ACTIVE) ~
      SqlParser.get[Date](DBHelper.CREATED_AT) ~
      SqlParser.get[Date](DBHelper.UPDATED_AT) ~
      SqlParser.get[Int](DBHelper.UPDATED_BY) ~
      SqlParser.get[Int](C.PA_ID) ~
      SqlParser.get[String](C.PA_NAME) map {
      case id ~ name ~ code ~ active ~ createdAt ~ updatedAt ~ updatedBy ~ paId ~ paName =>
        Provincia(id, name, code, (if(active != 0) true else false), createdAt, updatedAt, updatedBy, paId, paName)
    }
  }

  def create(user: CompanyUser, provincia: Provincia): Provincia = {
    save(user, provincia)
  }

  def update(user: CompanyUser, provincia: Provincia): Provincia = {
    save(user, provincia)
  }

  private def save(user: CompanyUser, provincia: Provincia): Provincia = {
    def getFields = {
      List(
        Field(C.PRO_NAME, provincia.name, FieldType.text),
        Field(C.PRO_CODE, provincia.code, FieldType.text),
        Field(DBHelper.ACTIVE, provincia.active, FieldType.boolean),
        Field(C.PA_ID, provincia.paId, FieldType.id)
      )
    }
    def throwException = {
      throw new RuntimeException(s"Error when saving ${C.PROVINCIA}")
    }

    DBHelper.save(
      user,
      Register(
        C.PROVINCIA,
        C.PRO_ID,
        provincia.id,
        false,
        true,
        true,
        getFields),
      true
    ) match {
      case SaveResult(true, id) => load(user, id).getOrElse(throwException)
      case SaveResult(false, id) => throwException
    }
  }

  def load(user: CompanyUser, id: Int): Option[Provincia] = {
    loadWhere(user, s"${C.PRO_ID} = {id}", 'id -> id)
  }

  def loadWhere(user: CompanyUser, where: String, args : scala.Tuple2[scala.Any, anorm.ParameterValue[_]]*) = {
    DB.withConnection(user.database.database) { implicit connection =>
      SQL(s"SELECT * FROM ${C.PROVINCIA} WHERE $where")
        .on(args: _*)
        .as(provinciaParser.singleOpt)
    }
  }

  def delete(user: CompanyUser, id: Int) = {
  }

  def get(user: CompanyUser, id: Int): Provincia = {
    load(user, id) match {
      case Some(p) => p
      case None => emptyProvincia
    }
  }
}