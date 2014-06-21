package controllers.logged.system

import controllers._
import controllers.logged.system.Branches._
import play.api.mvc._
import play.api.data._
import play.api.data.Forms._
import actions._
import models.cairo.{ Menu, Router }
import play.api.Logger
import play.api.libs.json._
import models.cairo.trees._

case class TreeData(id: Option[Int], name: String, tableId: Int)

object Trees extends Controller with ProvidesUser {

  val treeForm = Form(
    mapping(
      "id" -> optional(number),
      "name" -> nonEmptyText,
      "tableId" -> number
    )(TreeData.apply)(TreeData.unapply))

  implicit val treeWrites = new Writes[Tree] {
    def writes(tree: Tree) = Json.obj(
      "id" -> tree.id,
      "name" -> tree.name
    )
  }

  implicit val branchWrites = new Writes[Branch] {
    def writes(branch: Branch) = Json.obj(
      "key" -> branch.id,
      "title" -> branch.name,
      "folder" -> true,
      "children" -> Json.toJson(writesItems(branch.items))
    )
    def writesItems(items: List[Branch]) = items.map(branch => writes(branch))
  }

  def list(tableId: Int) = GetAction { implicit request =>
    LoggedIntoCompanyResponse.getAction(request, { user =>
      Ok(Json.toJson(Tree.loadForTable(user, tableId)))
    })
  }

  def get(id: Int) = GetAction { implicit request =>
    LoggedIntoCompanyResponse.getAction(request, { user =>
      Ok(Json.toJson(Branch.createTree(Branch.listForTree(user, id))))
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
}