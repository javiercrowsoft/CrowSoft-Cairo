package controllers.logged

import controllers._
import play.api.mvc._
import play.api.data._
import play.api.data.Forms._
import play.filters.csrf.CSRF
import actions._
import models.cairo.system.{ Menu, Router }
import play.api.Logger

object Desktop extends Controller with ProvidesUser {

  def show = GetAction { implicit request =>
    LoggedIntoCompanyResponse.getAction(request, { user =>
      val menuList = Menu.list(user)
      val menu = Menu.createMenu(menuList)
      val router = Router.createRouter(menuList)
      Ok(views.html.logged.desktop.index(menu, router, CSRF.getToken(request).getOrElse(null).value))
    })
  }

}