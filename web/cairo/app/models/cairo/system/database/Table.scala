package models.cairo.system.database

import java.sql.{Connection, CallableStatement, ResultSet, Types, SQLException}
import anorm.SqlParser._
import anorm._
import services.db.DB
import java.util.Date
import play.api.Play.current
import models.domain.CompanyUser

case class Table(
                  id: Pk[Int] = NotAssigned,
                  name: String,
                  realName: String,
                  idColumn: String,
                  codeColumn: String,
                  nameColumn: String,
                  hasTree: Boolean,
                  hasActive: Boolean,
                  selectStatement: String,
                  searchStatement: String,
                  whereStatement: String,
                  infoStatement: String,
                  columnsInView: String,
                  selectLimit: Int,
                  editObject: String,
                  editManagerObject: String,
                  customerSelectStatement: String,
                  customerColumnsInView: String,
                  preId: Int,
                  updatedAt: Date
                )

case class ParsedTable(usId: Int, cairoCompanyId: Int, table: Table) {

  lazy val selectStatement = {
    val query = if(table.customerSelectStatement.isEmpty) table.selectStatement else table.customerSelectStatement
    getSelect(processMacros(query))
  }
  lazy val searchStatement = processMacros(table.searchStatement)


  private def processMacros(statement: String): String = {
    statement
      .replaceAll("[@][@]us_id", usId.toString())
      .replaceAll("[@][@]emp_id", cairoCompanyId.toString())
  }

  /*

   if there isn't a selectStatement in table, we generate a simple
   select using the definition of the table like:

     select un_id, un_nombre, un_codigo from unidad|un_nombre:string,un_codigo:string

   */
  private def getSelect(statement: String): String = {
    if(statement.isEmpty) {
      val limit = if(table.selectLimit > 0) table.selectLimit else 300 // TODO: should be in databse config
      val codeColumn = if(table.codeColumn.isEmpty) "" else s", ${table.codeColumn} as Codigo" // TODO: language
      val codeColumnDefinition = if(table.codeColumn.isEmpty) "" else s",${table.codeColumn}:string"
      val nameColumnName = if(table.nameColumn.toLowerCase().contains("codigo")) "Codigo" else "Nombre" // TODO: language
      val select = s"select top ${limit} ${table.idColumn}, ${table.nameColumn} as ${nameColumnName} ${codeColumn}"
      val from = s" from ${table.realName}"
      val columnDefinition = s"|${table.nameColumn}:string${codeColumnDefinition}"
      select + from + table.whereStatement + columnDefinition
    }
    else statement
  }
}

object Table {

  private val tableParser: RowParser[Table] = {
      get[Pk[Int]]("tbl_id") ~
      get[String]("tbl_nombre") ~
      get[String]("tbl_nombrefisico") ~
      get[String]("tbl_campoid") ~
      get[String]("tbl_campocodigo") ~
      get[String]("tbl_camponombre") ~
      get[Int]("tbl_tienearbol") ~
      get[Int]("tbl_tieneactivo") ~
      get[String]("tbl_sqlhelp") ~
      get[String]("tbl_sqlsearch") ~
      get[String]("tbl_where") ~
      get[String]("tbl_spinfo") ~
      get[String]("tbl_camposinview") ~
      get[Int]("tbl_helptop") ~
      get[String]("tbl_objectedit") ~
      get[String]("tbl_objectabm") ~
      get[String]("tbl_sqlhelpcliente") ~
      get[String]("tbl_camposinviewcliente") ~
      get[Option[Int]]("pre_id") ~
      get[Date]("modificado") map {
      case
        id ~ name ~ realName ~ idColumn ~ codeColumn ~ nameColumn ~ hasTree ~ hasActive ~ selectStatement ~ searchStatement ~ whereStatement ~ infoStatement ~ columnsInView ~ selectLimit ~ editObject ~ editManagerObject ~ customerSelectStatement ~ customerColumnsInView ~ preId ~ updatedAt =>
        Table(id, name, realName, idColumn, codeColumn, nameColumn, hasTree != 0, hasActive != 0, selectStatement, searchStatement, whereStatement, infoStatement, columnsInView, selectLimit, editObject, editManagerObject, customerSelectStatement, customerColumnsInView, preId.getOrElse(0), updatedAt)
    }
  }

  def load(user: CompanyUser, id: Int): Option[Table] = {
    loadWhere(user, "tbl_id = {id}", 'id -> id)
  }

  def loadWhere(user: CompanyUser, where: String, args : scala.Tuple2[scala.Any, anorm.ParameterValue[_]]*) = {
    DB.withConnection(user.database.database) { implicit connection =>
      SQL(s"SELECT * FROM tabla WHERE $where")
        .on(args: _*)
        .as(tableParser.singleOpt)
    }
  }

}