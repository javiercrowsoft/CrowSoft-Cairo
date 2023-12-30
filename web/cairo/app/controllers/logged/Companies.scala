package controllers.logged

import controllers._
import play.api.mvc._
import play.api.data._
import play.api.data.Forms._
import actions._
import models.domain.{ Company, CompanyLogin, LoginData }
import services.RequestOrigin
import models.master.{User, UserLogin}

case class CompanyLoginData(companyId: Int)

object Companies extends Controller with ProvidesUser {

  val form = Form(
    mapping(
      "companyId" -> number
    )(CompanyLoginData.apply)(CompanyLoginData.unapply))

  def list = Action { implicit request =>
    LoggedResponse.getAction(request, { user =>
      Ok(views.html.logged.companies.list(Company.list(user)))
    })
  }

  def login = PostAction { implicit request =>
    LoggedResponse.getAction(request, { user =>
      form.bindFromRequest.fold(
        formWithErrors => {
          Unauthorized(views.html.errorpages.unauthorized("CrowSoft Cairo - Unauthorized"))
        },
        loginForm => {
          companyLogin(request, user, RequestOrigin.parse(request), LoginData(loginForm.companyId, user), routes.Desktop.show)
        })
    })
  }

  def companyLogin[A](request: Request[A], user: User, requestOrigin: RequestOrigin, loginForm: LoginData, call : play.api.mvc.Call) = {
    val userAgent = requestOrigin.userAgent

    val success = LoginData.save(
      LoginData(loginForm.companyId, user),
      userAgent.platform,
      requestOrigin.remoteAddress,
      userAgent.userAgent,
      requestOrigin.acceptLanguages,
      userAgent.isMobile)

    if(CompanyLogin.successCodes.contains(success)) {
      val redirectTo = if(user.active) call else controllers.routes.Application.index
      Redirect(redirectTo).withSession(
        session(request) + ("company" -> loginForm.companyId.toString)
      )
    }
    else if(UserLogin.loginErrorCodes.contains(success))
      Unauthorized(views.html.errorpages.unauthorized("CrowSoft Cairo - Unauthorized"))
    else
      Redirect(controllers.routes.Application.error).flashing(
        "error" -> "There was an error when trying to sign in you into a company. Please try again.")
  }

}

