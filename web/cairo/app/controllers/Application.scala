package controllers

import play.api.mvc._
import actions._
import play.api.data._
import play.api.data.Forms._
import models.UserData

object Application extends Controller {

  val form = Form(
    mapping(
      "email" -> email,
      "password" -> nonEmptyText
    )(UserData.apply)(UserData.unapply))

  def index = GetAction { implicit request =>
    Ok(views.html.index(form))
  }

}
