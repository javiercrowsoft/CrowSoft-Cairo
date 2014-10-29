package controllers

import play.api.libs.json.Json
import play.api.mvc._
import actions._
import models.master.{ LoggedUser, User }
import models.domain.{ CompanyUser, Company }
import services.db.CairoDB
import services.RequestOrigin
import play.api.Logger

trait ProvidesUser {

  implicit def loggedUser[A](implicit request: Request[A]): LoggedUser = {
    Logger.debug("loggedUser called")
    val userId = request.session.get("user").getOrElse("")
    def getUser() : LoggedUser = {
      if(userId.isEmpty)
        LoggedUser(null, false)
      else
        LoggedUser(User.load(userId.toInt).getOrElse(null), request.path.startsWith("/desktop"))
    }
    getUser
  }

  implicit def companyUser[A](implicit request: Request[A]): CompanyUser = {
    Logger.debug("companyUser called")
    val user = loggedUser(request)
    if(user.user != null) {
      val companyId = request.session.get("company").getOrElse("")
      def getCompanyUser(): CompanyUser = {
        if (companyId.isEmpty)
          CompanyUser(null, null, null)
        else
          CairoDB.connectCairoForUser(user.user, companyId.toInt)
      }
      getCompanyUser
    }
    else
      CompanyUser(null, null, null)
  }

  implicit def requestOrigin[A](implicit request: Request[A]): RequestOrigin = {
    Logger.debug("requestOrigin called")
    RequestOrigin.parse(request)
  }

}

object LoggedResponse extends Controller {

  def getAction[A](request: Request[A], f: (User) => play.api.mvc.SimpleResult): play.api.mvc.SimpleResult = {
    val userId = request.session.get("user").getOrElse("")
    if(userId.isEmpty)
      Unauthorized(views.html.errorpages.unauthorized("CrowSoft Cairo - Unauthorized"))
    else {
      val user = User.load(userId.toInt).getOrElse(null)
      if(user != null) {
        val userMustBeActivated = !request.uri.toString.startsWith("/registration")
        Logger.debug(s"userMustBeActivated: $userMustBeActivated")
        if(!user.active && userMustBeActivated) {
          Redirect(routes.Registration.mustActivate)
        }
        else {
          f(user)
        }
      }
      else
        NotFound
    }
  }
}

object LoggedIntoCompanyResponse extends Controller {

  def getAction[A](request: Request[A], f: (CompanyUser) => play.api.mvc.SimpleResult): play.api.mvc.SimpleResult = {
    LoggedResponse.getAction(request, { user =>
      val companyId = request.session.get("company").getOrElse("")
      if(companyId.isEmpty)
        Unauthorized(views.html.errorpages.unauthorized("CrowSoft Cairo - Unauthorized"))
      else {
        val companyUser = CairoDB.connectCairoForUser(user, companyId.toInt)
        if(companyUser != null) {
          f(companyUser)
        }
        else
          NotFound
      }
    })
  }

  def getAction[A](request: Request[A], hasPermission: (CompanyUser) => Boolean, f: (CompanyUser) => play.api.mvc.SimpleResult): play.api.mvc.SimpleResult = {
    LoggedIntoCompanyResponse.getAction(request, { user =>
      if(hasPermission(user))
        f(user)
      else
        Unauthorized(views.html.errorpages.unauthorized("CrowSoft Cairo - Unauthorized"))
    })
  }
}

object SessionStatus {

  def isLoggedUser[A](request: Request[A]) = {
    Logger.debug(s"user in session is empty: ${request.session.get("user").getOrElse("").isEmpty}")
    !request.session.get("user").getOrElse("").isEmpty
  }
  def isLoggedCompanyUser[A](request: Request[A]) = {
    Logger.debug(s"company in session is empty: ${request.session.get("company").getOrElse("").isEmpty}")
    !request.session.get("company").getOrElse("").isEmpty
  }

  def isDesktop[A](request: Request[A]) = {
    Logger.debug(s"user in session is empty: ${request.path}")
    request.path.startsWith("/desktop")
  }

}

object JsonUtil {
  val emptyJson = Json.toJson("")
}