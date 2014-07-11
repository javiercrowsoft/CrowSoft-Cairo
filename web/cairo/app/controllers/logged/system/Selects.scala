package controllers.logged.system

import controllers._
import play.api.mvc._
import play.api.data._
import play.api.data.Forms._
import actions._
import play.api.Logger
import play.api.libs.json._

case class SelectInfo(tableId: Int, filter: String, active: Boolean, useSearch: Boolean, internalFilter: String)

object Selects extends Controller with ProvidesUser {

  def get(tableId: Int, filter: String, active: Boolean, useSearch: Boolean, internalFilter: String) = GetAction { implicit request =>
    LoggedIntoCompanyResponse.getAction(request, { user =>
      Ok
    })
  }
}