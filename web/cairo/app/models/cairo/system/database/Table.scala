package models.cairo.system.select

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
      get[Int]("pre_id") ~
      get[Date]("modificado") map {
      case
        id ~ name ~ realName ~ idColumn ~ codeColumn ~ nameColumn ~ hasTree ~ hasActive ~ selectStatement ~ searchStatement ~ whereStatement ~ infoStatement ~ columnsInView ~ selectLimit ~ editObject ~ editManagerObject ~ customerSelectStatement ~ customerColumnsInView ~ preId ~ updatedAt =>
        Table(id, name, realName, idColumn, codeColumn, nameColumn, hasTree != 0, hasActive != 0, selectStatement, searchStatement, whereStatement, infoStatement, columnsInView, selectLimit, editObject, editManagerObject, customerSelectStatement, customerColumnsInView, preId, updatedAt)
    }
  }

  def load(user: CompanyUser, id: Int): Option[Table] = {
    loadWhere("tbl_id = {id}", 'id -> id)
  }

  def loadWhere(user: CompanyUser, where: String, args : scala.Tuple2[scala.Any, anorm.ParameterValue[_]]*) = {
    DB.withConnection(user.database.database) { implicit connection =>
      SQL(s"SELECT * FROM tabla WHERE $where")
        .on(args: _*)
        .as(tableParser.singleOpt)
    }
  }

}