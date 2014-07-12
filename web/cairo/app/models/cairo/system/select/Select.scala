package models.cairo.system.select

import java.sql.{Connection, CallableStatement, ResultSet, Types, SQLException}
import anorm.SqlParser._
import anorm._
import services.db.DB
import play.api.Play.current
import models.domain.CompanyUser
import play.api.Logger
import play.api.libs.json._
import scala.util.control.{NonFatal, ControlThrowable}

case class Column(name: String, columnType: String)
case class Row(id: Int, values: List[String])

case class Table(rows: List[Row], columns: List[Column])

object Select {

  def get(
           user: CompanyUser,
           tableId: Int,
           filter: String,
           active: Boolean,
           useSearch: Boolean,
           internalFilter: String): Table = {
    Table(List(Row(1,List("Virginia","Diaz")),Row(1,List("Javier","Alvarez"))), List(Column("Nombre", "String"), Column("Apellido", "String")))
  }

}