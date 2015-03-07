package models.cairo.system.database

import java.sql.{ResultSet, ResultSetMetaData}
import play.api.Logger
import play.api.libs.json._

case class ColumnDef(name: String, columnType: String)

case class Row(values: List[Any])

case class Recordset(columns: List[ColumnDef], rows: List[Row])

object Recordset {

  def load(rs: java.sql.ResultSet): Recordset = {
    try {
      lazy val metaData = rs.getMetaData()
      lazy val columnIndexes = 1.to(metaData.getColumnCount()).toList

      def createRow(): Row = {
        Row(getValues(rs, metaData, columnIndexes))
      }

      def createColumns(): List[ColumnDef] = {
        val columns = for {
          i <- columnIndexes
        } yield {
          ColumnDef(metaData.getColumnName(i), metaData.getColumnTypeName(i))
        }
        columns
      }

      def fillList(): List[Row] = {
        if(rs.next()) {
          createRow() :: fillList()
        }
        else {
          List()
        }
      }

      if(rs.next) {
        Recordset(createColumns(), createRow() :: fillList())
      }
      else {
        Recordset(List(), List())
      }

    } finally {
      rs.close
    }
  }

  def getValues(rs: ResultSet, metaData: ResultSetMetaData, columnIndex: List[Int]): List[Any] = {
    for {
      i <- columnIndex
    } yield {
      DBHelper.getValue(rs, metaData, i) match {
        case Some(v) => v
        case None => ""
      }
    }
  }

  def getAsJson(recordset: Recordset): JsValue = {

    implicit val recordsetWrites = new Writes[Recordset] {
      //
      // columns
      //
      def columnWrites(column: ColumnDef) = Json.obj(
        "name" -> Json.toJson(column.name),
        "columnType" -> Json.toJson(column.columnType)
      )
      def writesColumns(items: List[ColumnDef]) = items.map(column => columnWrites(column))
      //
      // rows
      //
      def writeValue(value: Any): JsValue = {
        value match {
          case i: Int => Json.toJson(i)
          case l: Long => Json.toJson(l)
          case bg: BigDecimal => Json.toJson(bg)
          case d: java.sql.Date => Json.toJson(d)
          case t: java.sql.Timestamp => Json.toJson(t)
          case s: String => Json.toJson(s)
        }
      }
      def writesValues(items: List[Any]) = items.map(value => Json.toJson(writeValue(value)))
      def rowWrites(row: Row) = Json.obj(
        "values" -> Json.toJson(writesValues(row.values))
      )
      def writesRows(items: List[Row]) = items.map(row => rowWrites(row))
      //
      // Recordset
      //
      def writes(recordset: Recordset) = Json.obj(
        "columns" -> Json.toJson(writesColumns(recordset.columns)),
        "rows" -> Json.toJson(writesRows(recordset.rows))
      )
    }

    Json.toJson(recordset)
  }
}