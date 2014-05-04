package controllers

import play.api._
import play.api.mvc._
import play.filters.csrf._
import actions._

object Registration extends Controller {

  def create = PostAction { implicit request =>
    Ok
  }

}
