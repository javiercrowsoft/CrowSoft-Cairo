package controllers

import play.api.mvc._
import play.api.data._
import play.api.data.Forms._
import actions._
import models.{User, LoginData, UserLogin}
import services.{ UserAgent, RequestOrigin }
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
    form.bindFromRequest.fold(
      formWithErrors => {
        BadRequest(views.html.sessions.login(formWithErrors))
      },
      loginForm => {
        login(RequestOrigin.parse(request), loginForm, routes.Application.index)
        /*
        val userAgent = UserAgent.parse(request)

        val success = LoginData.save(
          login,
          userAgent.platform,
          request.remoteAddress,
          userAgent.userAgent,
          request.acceptLanguages.toString,
          userAgent.isMobile)

        if (UserLogin.successCodes.contains(success)) {
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
          */
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

  def login(requestOrigin: RequestOrigin, loginForm: LoginData, call : play.api.mvc.Call) = {
    val userAgent = requestOrigin.userAgent

    val success = LoginData.save(
      loginForm,
      userAgent.platform,
      requestOrigin.remoteAddress,
      userAgent.userAgent,
      requestOrigin.acceptLanguages.toString,
      userAgent.isMobile)

    if (UserLogin.successCodes.contains(success)) {
      val user = User.findByUsername(loginForm.email).getOrElse(null)
      Redirect(call).withSession(
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
  }

}
