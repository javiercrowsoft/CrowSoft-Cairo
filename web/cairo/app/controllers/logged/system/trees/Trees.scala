package controllers.logged.system.trees

import controllers._
import play.api.mvc._
import play.api.data._
import play.api.data.Forms._
import actions._
import play.api.Logger
import play.api.libs.json._
import models.cairo.system.trees._

case class TreeData(id: Option[Int], name: String, tableId: Int)
case class SortInfo(id: Int, direction: String)

object Trees extends Controller with ProvidesUser {

  val treeForm = Form(
    mapping(
      "id" -> optional(number),
      "name" -> nonEmptyText,
      "tableId" -> number
    )(TreeData.apply)(TreeData.unapply))

  val sortForm = Form(
    mapping(
      "treeId" -> number,
      "direction" -> nonEmptyText
    )(SortInfo.apply)(SortInfo.unapply))

  implicit val treeWrites = new Writes[Tree] {
    def writes(tree: Tree) = Json.obj(
      "id" -> tree.id,
      "name" -> tree.name
    )
  }

  def list(tableId: Int) = GetAction { implicit request =>
    LoggedIntoCompanyResponse.getAction(request, { user =>
      Ok(Json.toJson(Tree.loadForTable(user, tableId)))
    })
  }

  def get(id: Int) = GetAction { implicit request =>
    LoggedIntoCompanyResponse.getAction(request, { user =>
      Ok(Branch.getAsJsonForFancyTree(Branch.createTree(Branch.listForTree(user, id))))
    })
  }

  def create = PostAction { implicit request =>
    Logger.debug("in tree.create")
    treeForm.bindFromRequest.fold(
      formWithErrors => {
        Logger.debug(s"invalid form: ${formWithErrors.toString}")
        BadRequest
      },
      tree => {
        Logger.debug(s"form: ${tree.toString}")
        LoggedIntoCompanyResponse.getAction(request, { user =>
          Ok(Json.toJson(Tree.save(user, tree.tableId, tree.name)))
        })
      })
  }

  def sort = PostAction { implicit request =>
    Logger.debug("in tree.sort")
    sortForm.bindFromRequest.fold(
      formWithErrors => {
        Logger.debug(s"invalid form: ${formWithErrors.toString}")
        BadRequest
      },
      sortInfo => {
        Logger.debug(s"form: ${sortInfo.toString}")
        LoggedIntoCompanyResponse.getAction(request, { user =>
          val branch = Tree.sort(
            user,
            sortInfo.id,
            sortInfo.direction)
          Ok(Branch.getAsJsonForFancyTree(Branch.createTree(Branch.listForBranch(user, branch.id))))
        })
      }
    )
  }
}