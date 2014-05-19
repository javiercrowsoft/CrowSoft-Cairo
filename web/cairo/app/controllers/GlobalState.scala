package controllers

import play.api.mvc._
import actions._
import models.{ LoggedUser, User }

trait ProvidesUser {

  implicit def loggedUser[A](implicit request: Request[A]) : LoggedUser = {
    val userId = request.session.get("user").getOrElse("")
    def getUser() : LoggedUser = {
      if(userId.isEmpty)
        LoggedUser(null)
      else
        LoggedUser(User.load(userId.toInt).getOrElse(null))
    }
    getUser
  }
}

object LoggedResponse extends Controller {

  def getAction[A](request: Request[A], f: (User) => play.api.mvc.SimpleResult) : play.api.mvc.SimpleResult = {
    val userId = request.session.get("user").getOrElse("")
    if(userId.isEmpty)
      Unauthorized(views.html.errorpages.unauthorized("CrowSoft Cairo - Unauthorized"))
    else {
      val user = User.load(userId.toInt).getOrElse(null)
      if(user != null) {
        f(user)
      }
      else
        NotFound
    }
  }
}