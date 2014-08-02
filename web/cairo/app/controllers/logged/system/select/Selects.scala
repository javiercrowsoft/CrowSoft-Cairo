package controllers.logged.system.select

import controllers._
import play.api.mvc._
import play.api.data._
import play.api.data.Forms._
import actions._
import play.api.Logger
import play.api.libs.json._
import models.cairo.system.select._

object Selects extends Controller with ProvidesUser {

  implicit val tableWrites = new Writes[RecordSet] {
    def writes(table: RecordSet) = Json.obj(
      "rows" -> Json.toJson(writeRows(table.rows)),
      "columns" -> Json.toJson(writeColumns(table.columns))
    )
    def rowWrites(row: Row) = Json.obj(
      "id" -> Json.toJson(row.id),
      "values" -> Json.toJson(row.values)
    )
    def columnWrites(column: Column) = Json.obj(
      "name" -> Json.toJson(column.name),
      "columnType" -> Json.toJson(column.columnType)
    )
    def writeRows(items: List[Row]) = items.map(leave => rowWrites(leave))
    def writeColumns(columns: List[Column]) = columns.map(column => columnWrites(column))
  }

  def get(tableId: Int, filter: String, active: Boolean, useSearch: Boolean, internalFilter: String, like: Int) = GetAction { implicit request =>
    LoggedIntoCompanyResponse.getAction(request, { user =>
      Ok(Json.toJson(Select.get(user, tableId, filter, active, useSearch, internalFilter, like)))
    })
  }

  def validate(tableId: Int, text: String, textId: String, active: Boolean, internalFilter: String) = GetAction { implicit request =>
    LoggedIntoCompanyResponse.getAction(request, { user =>
      Ok(Json.toJson(Select.validate(user, tableId, text, textId, active, internalFilter)))
    })
  }
}