package controllers

import play.api.mvc._
import play.api.data._
import play.api.data.Forms._
import actions._
import models.{ User, UserData , LoggedUser }
import services.UserAgent
import settings._
import play.api.Logger

object Registration extends Controller with ProvidesUser {

  val form = Form(
    mapping(
      "email" -> email,
      "password" -> nonEmptyText
    )(UserData.apply)(UserData.unapply))

  def save = PostAction { implicit request =>
    form.bindFromRequest.fold(
      formWithErrors => BadRequest(views.html.index(formWithErrors)),
      user => {
        val requestUserAgent = request.headers.get("user-agent").getOrElse("")
        val userAgent = UserAgent.parse(requestUserAgent)

        val userId = UserData.save(
          user,
          userAgent.platform,
          request.remoteAddress,
          requestUserAgent,
          request.acceptLanguages.toString(),
          userAgent.isMobile)
        Redirect(routes.Registration.activate).withSession(
          "user" -> userId.toString
        )
      })
  }

  def validate(code: String) = GetAction { implicit request =>
    val user = User.findByCode(code).getOrElse(null)
    if (user != null) {
      User.activateUser(user.id.getOrElse(0))
      Ok(views.html.registration.validate(user.username))
    }
    else
      NotFound
  }

  def sendValidationEmail = GetAction { implicit request =>
    /*
    val userId = request.session.get("user").getOrElse("")
    if (userId.isEmpty)
      Unauthorized("Oops, you are not connected")
    else {
      val user = UserSignUp.load(userId.toInt).getOrElse(null)
      if (user != null) {
        UserSignUp.sendRegistration(user)
        Ok(views.html.registration.validateEmail(Settings.siteBaseURL, user.email))
      }
      else
        NotFound
    }

    UserSignUp.sendRegistration(user)
    Ok(views.html.registration.validateEmail(Settings.siteBaseURL, user.email))

    */
    LoggedResponse.getAction(request, { user =>
      User.sendRegistration(user)
      Ok(views.html.registration.validateEmail(Settings.siteBaseURL, user.email))
    })
  }

  def activate = GetAction { implicit request =>
    /*
    val userId = request.session.get("user").getOrElse("")
    if (userId.isEmpty)
      Unauthorized("Oops, you are not connected")
    else {
      val user = UserSignUp.load(userId.toInt).getOrElse(null)
      if (user != null)
        Ok(views.html.registration.activate(Settings.siteBaseURL, user.email))
      else
        NotFound
    }
    */
    LoggedResponse.getAction(request, { user =>
      Ok(views.html.registration.activate(Settings.siteBaseURL, user.email))
    })
  }

}
