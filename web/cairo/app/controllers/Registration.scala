package controllers

import play.api.mvc._
import play.api.data._
import play.api.data.Forms._
import actions._
import models.UserData
import services.UserAgent

object Registration extends Controller {

  val form = Form(
    mapping(
      "email" -> email,
      "password" -> nonEmptyText
    )(UserData.apply)(UserData.unapply))

  def save = PostAction { implicit request =>
    form.bindFromRequest.fold(
      formWithErrors => BadRequest(views.html.index(formWithErrors)),
      user => {

        val requestUserAgent = request.headers.get("user-agent").getOrElse("")
        val userAgent = UserAgent.parse(requestUserAgent)

        UserData.save(
          user,
          userAgent.platform,
          request.remoteAddress,
          requestUserAgent,
          request.acceptLanguages.toString(),
          userAgent.isMobile)
        Redirect(routes.Users.list).flashing("success" -> "User successfully created!")
      })
  }
}
