package controllers

import play.api.mvc._
import actions._
import play.api.data._
import play.api.data.Forms._
import models.{ UserData }
import settings.Settings
import services.PasswordValidation

object Application extends Controller with ProvidesUser {

  val form = Form(
    mapping(
      "email" -> email,
      "password" -> nonEmptyText(minLength = 12).verifying(PasswordValidation.passwordCheckConstraint)
    )(UserData.apply)(UserData.unapply))

  def index = GetAction { implicit request =>
    Ok(views.html.index(form, Settings.siteBaseURL))
  }

}
