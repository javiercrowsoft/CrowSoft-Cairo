package controllers

import play.api.mvc._
import play.api.data._
import play.api.data.Forms._
import actions._
import models.master.{ User, UserData , LoggedUser }
import services.{ UserAgent, PasswordValidation }
import settings._
import play.api.Logger

object Registration extends Controller with ProvidesUser {

  val form = Form(
    mapping(
      "email" -> email,
      "password" -> nonEmptyText(minLength = 12).verifying(PasswordValidation.passwordCheckConstraint)
    )(UserData.apply)(UserData.unapply))

  def create = PostAction { implicit request =>
    form.bindFromRequest.fold(
      formWithErrors => BadRequest(views.html.index(formWithErrors, Settings.siteBaseURL)),
      user => {
        val userAgent = UserAgent.parse(request)
        UserData.insert(
          user,
          userAgent.platform,
          request.remoteAddress,
          userAgent.userAgent,
          request.acceptLanguages.toString,
          userAgent.isMobile) match {
          case (success, message, userId) => {
            if(success) {
              Redirect(routes.Registration.activate).withSession(
                "user" -> userId.toString
              )
            }
            else {
              Redirect(routes.Application.index).flashing("error" -> message)
            }
          }
        }
      })
  }

  def validate(code: String) = GetAction { implicit request =>
    val user = User.findByCode(code).getOrElse(null)
    if(user != null) {
      User.activateUser(user.userId)
      Ok(views.html.registration.validate(user.username))
    }
    else
      NotFound
  }

  def sendValidationEmail = GetAction { implicit request =>
    LoggedResponse.getAction(request, { user =>
      User.sendRegistration(user)
      Ok(views.html.registration.validateEmail(Settings.siteBaseURL, user.email))
    })
  }

  def activate = GetAction { implicit request =>
    LoggedResponse.getAction(request, { user =>
      Ok(views.html.registration.activate(Settings.siteBaseURL, user.email))
    })
  }

  def mustActivate = GetAction { implicit request =>
    LoggedResponse.getAction(request, { user =>
      Ok(views.html.registration.mustActivate(Settings.siteBaseURL, user.email))
    })
  }

}
