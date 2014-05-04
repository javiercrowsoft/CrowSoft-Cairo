package controllers

import play.api._
import play.api.mvc._
import play.filters.csrf._
import actions._

object Application extends Controller {

  def index = GetAction { implicit req =>
    Ok(views.html.index("CrowSoft Cairo - Salmax"))
  }

}
