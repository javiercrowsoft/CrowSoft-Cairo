package controllers.logged

import controllers._
import models.cairo.system.database.Recordset
import models.cairo.system.security.CairoSecurity
import play.api.libs.json.Json
import play.api.mvc._
import play.api.data._
import play.api.data.Forms._
import play.filters.csrf.CSRF
import actions._
import models.cairo.DesktopDB
import models.cairo.system.{Language, Menu, Router}
import play.api.Logger

object Desktop extends Controller with ProvidesUser {

  def show = GetAction { implicit request =>
    LoggedIntoCompanyResponse.getAction(request, { user =>
      val menuList = Menu.list(user)
      val menu = Menu.createMenu(menuList)
      Logger.debug(s"Menu: ${menu.toString}")
      val router = Router.createRouter(menuList)
      val language = Language.list(user)
      val version = 10008
      Ok(views.html.logged.desktop.index(menu, router, language, CSRF.getToken(request).getOrElse(null).value, version))
    })
  }

  def listReports() = GetAction { implicit request =>
    LoggedIntoCompanyResponse.getAction(request, { user =>
      Ok(
        Json.toJson(
          Recordset.getAsJson(
            DesktopDB.listReports(user))))
    })
  }

}