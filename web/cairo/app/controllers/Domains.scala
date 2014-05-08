package controllers

import play.api.mvc._
import play.api.data._
import play.api.data.Forms._
import actions._

object Domains extends Controller {

  def save = PostAction { implicit request =>
    Ok
  }

  def add = GetAction { implicit request =>
    Ok
  }

}
