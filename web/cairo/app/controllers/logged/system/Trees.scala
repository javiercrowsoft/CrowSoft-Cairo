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

object Trees extends Controller with ProvidesUser {

  implicit val treeWrites = new Writes[Tree] {
    def writes(tree: Tree) = Json.obj(
      "id" -> tree.id,
      "name" -> tree.name
    )
  }

  implicit val branchWrites = new Writes[Branch] {
    def writes(branch: Branch) = Json.obj(
      "id" -> branch.id,
      "name" -> branch.name,
      "fatherId" -> branch.fatherId,
      "items" -> Json.toJson(writesItems(branch.items))
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
      //Ok(Json.toJson(Branch.listForTree(user, id).reverse))
      Ok(Json.toJson(Branch.createTree(Branch.listForTree(user, id))))
    })
  }
}