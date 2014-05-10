package controllers

import play.api.mvc._
import play.api.data._
import play.api.data.Forms._
import actions._
import models.{User, LoginData, UserLogin}
import services.UserAgent
import settings._
import play.api.Logger

object Sessions extends Controller with ProvidesUser {

  val form = Form(
    mapping(
      "email" -> email,
      "password" -> nonEmptyText
    )(LoginData.apply)(LoginData.unapply))

  def newSession = GetAction { implicit request =>
    Ok(views.html.sessions.login(form))
  }

  def create = PostAction { implicit request =>

    Logger.debug("on create")

    form.bindFromRequest.fold(
      formWithErrors => {
        Logger.debug("on create-bad request")
        BadRequest(views.html.sessions.login(formWithErrors))
      },
      login => {

        Logger.debug("on create-good request")

        val requestUserAgent = request.headers.get("user-agent").getOrElse("")
        val userAgent = UserAgent.parse(requestUserAgent)

        Logger.debug("on create-calling LoginData.save")

        val success = LoginData.save(
          login,
          userAgent.platform,
          request.remoteAddress,
          requestUserAgent,
          request.acceptLanguages.toString(),
          userAgent.isMobile)

        if (UserLogin.successCodes.contains(success)) {

          Logger.debug("on create-success")

          val user = User.findByUsername(login.email).getOrElse(null)

          Redirect(routes.Application.index).withSession(
            "user" -> user.id.getOrElse(0).toString
          )
        }
        else if (UserLogin.loginErrorCodes.contains(success))
          Redirect(routes.Sessions.newSession).flashing("error" -> "User name or password invalid")
        else if (success == UserLogin.resultCodes(UserLogin.resultLocationBlocked))
          Redirect(routes.Sessions.locationBlocked)
        else if (success == UserLogin.resultCodes(UserLogin.resultLocked))
          Redirect(routes.Sessions.userLocked)
        else
          Redirect(routes.Sessions.newSession).flashing("error" -> "There was an error when trying to sign in you in the system. Please try again.")
      })
  }

  def locationBlocked = GetAction { implicit request =>
    Ok(views.html.sessions.locationBlocked())
  }

  def userLocked = GetAction { implicit request =>
    Ok(views.html.sessions.userLocked())
  }

  def destroy = GetAction { implicit request =>
    Redirect(routes.Sessions.clean).withNewSession
  }

  def clean = GetAction { implicit request =>
    Redirect(routes.Application.index).withNewSession
  }

}
