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
import services.PasswordValidation

case class BranchData(id: Option[Int], name: String, fatherId: Int, treeId: Int)

object Branches extends Controller with ProvidesUser {

  val branchForm = Form(
    mapping(
      "id" -> optional(number),
      "name" -> nonEmptyText,
      "fatherId" -> number,
      "treeId" -> number
    )(BranchData.apply)(BranchData.unapply))

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

  implicit val branchWrites = new Writes[Branch] {
    def writes(branch: Branch) = Json.obj(
      "id" -> Json.toJson(branch.id),
      "name" -> Json.toJson(branch.name),
      "fatherId" -> Json.toJson(branch.fatherId)
    )
  }

  def get(id: Int) = GetAction { implicit request =>
    LoggedIntoCompanyResponse.getAction(request, { user =>
      Ok(Json.toJson(Branch.get(user, id)))
    })
  }

  def update(id: Int) = PostAction { implicit request =>
    Logger.debug("in branches.update")
    branchForm.bindFromRequest.fold(
      formWithErrors => {
        Logger.debug(s"invalid form: ${formWithErrors.toString}")
        BadRequest
      },
      branch => {
        Logger.debug(s"form: ${branch.toString}")
        LoggedIntoCompanyResponse.getAction(request, { user =>
          Ok(Json.toJson(Branch.update(user, Branch(id, branch.name, List(), List(), branch.fatherId))))
        })
      })
  }

  def create = PostAction { implicit request =>
    Logger.debug("in branches.save")
    branchForm.bindFromRequest.fold(
      formWithErrors => {
        Logger.debug(s"invalid form: ${formWithErrors.toString}")
        BadRequest
      },
      branch => {
        Logger.debug(s"form: ${branch.toString}")
        LoggedIntoCompanyResponse.getAction(request, { user =>
          Ok(Json.toJson(Branch.save(user, branch.treeId, Branch(0, branch.name, List(), List(), branch.fatherId))))
        })
      })
  }

  def delete(id: Int) = PostAction { implicit request =>
    Logger.debug("in branches.delete")
    LoggedIntoCompanyResponse.getAction(request, { user =>
      Branch.delete(user, id)
      // Backbonejs requires at least an empty json object in the response
      // if not it will call errorHandler even when we responded with 200 OK :P
      Ok(JsonUtil.emptyJson)
    })
  }

}