package controllers.logged

import controllers._
import play.api.mvc._
import play.api.data._
import play.api.data.Forms._
import actions._
import models.domain.Company

case class CompanyLogin(companyId: Int)

object Companies extends Controller with ProvidesUser {

  val form = Form(
    mapping(
      "companyId" -> number
    )(CompanyLogin.apply)(CompanyLogin.unapply))

  def list = Action { implicit request =>
    LoggedResponse.getAction(request, { user =>
      Ok(views.html.logged.companies.list(Company.list(user)))
    })
  }

  def create = PostAction { implicit request =>
    form.bindFromRequest.fold(
      formWithErrors => {
        BadRequest(views.html.sessions.login(formWithErrors))
      },
      loginForm => {

      })
  }

}

