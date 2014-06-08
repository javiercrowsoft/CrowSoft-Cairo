package controllers.logged.system

import controllers._
import play.api.mvc._
import play.api.data._
import play.api.data.Forms._
import actions._
import models.cairo.{ Menu, Router }
import play.api.Logger
import play.api.libs.json._
import models.cairo.trees._

object Branches extends Controller with ProvidesUser {

  implicit val loadedBranchWrites = new Writes[LoadedBranch] {
    def writes(branch: LoadedBranch) = Json.obj(
      "leaves" -> Json.toJson(writeLeaves(branch.leaves)),
      "columns" -> Json.toJson(writeColumns(branch.columns))
    )
    def leaveWrites(leave: Leave) = Json.obj(
      "id" -> Json.toJson(leave.id),
      "clientId" -> Json.toJson(leave.clientId),
      "values" -> Json.toJson(leave.values)
    )
    def columnWrites(column: BranchColumn) = Json.obj(
      "name" -> Json.toJson(column.name),
      "columnType" -> Json.toJson(column.columnType)
    )
    def writeLeaves(items: List[Leave]) = items.map(leave => leaveWrites(leave))
    def writeColumns(columns: List[BranchColumn]) = columns.map(column => columnWrites(column))
  }

  def get(id: Int) = GetAction { implicit request =>
    LoggedIntoCompanyResponse.getAction(request, { user =>
      Ok(Json.toJson(Branch.get(user, id)))
    })
  }
}