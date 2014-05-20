package controllers.logged

import controllers._
import play.api.mvc._
import play.api.data._
import play.api.data.Forms._
import actions._

object Desktop extends Controller with ProvidesUser {

  def show = GetAction { implicit request =>
    LoggedIntoCompanyResponse.getAction(request, { user =>
      Ok(views.html.logged.desktop.index())
    })
  }

}