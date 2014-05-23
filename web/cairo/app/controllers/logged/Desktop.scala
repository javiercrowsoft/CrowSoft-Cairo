package controllers.logged

import controllers._
import play.api.mvc._
import play.api.data._
import play.api.data.Forms._
import actions._
import models.cairo.Menu
import play.api.Logger

object Desktop extends Controller with ProvidesUser {

  def show = GetAction { implicit request =>
    LoggedIntoCompanyResponse.getAction(request, { user =>
      val menu = Menu.list(user)
      Logger.debug(s"Menu: ${menu.toString}")
      Ok(views.html.logged.desktop.index(menu))
    })
  }

}