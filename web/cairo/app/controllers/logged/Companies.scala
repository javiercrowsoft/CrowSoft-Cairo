package controllers.logged

import controllers._
import play.api.mvc._
import models.domain.Company

object Companies extends Controller with ProvidesUser {

  def list = Action { implicit request =>
    LoggedResponse.getAction(request, { user =>
      Ok(views.html.logged.companies.list(Company.list(user)))
    })
  }

}

