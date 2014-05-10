package controllers

import play.api.mvc._
import play.api.data._
import play.api.data.Forms._
import actions._
import anorm._
import models.User
import services.UserAgent

case class resetPasswordData(username: String)

case class newPasswordData(password: String, confirm: String)

object Users extends Controller with ProvidesUser {

  val form = Form(
    mapping(
      "id" -> ignored(NotAssigned: Pk[Int]),
      "username" -> text, 
      "email" -> email,
      "password" -> nonEmptyText,
      "code" -> text,
      "active" -> boolean,
      "locked" -> boolean,
      "platform" -> text,
      "ip_address" -> text,
      "user_agent" -> text,
      "accept_language" -> text,
      "is_mobile" -> boolean,
      "created_at" -> date,
      "updated_at" -> date
      )(User.apply)(User.unapply))

  val resetPasswordForm = Form(
    mapping(
      "username" -> text
    )(resetPasswordData.apply)(resetPasswordData.unapply))

  val newPasswordForm = Form(
    mapping(
      "password" -> text,
      "confirm" -> text
    )(newPasswordData.apply)(newPasswordData.unapply))

  def add = GetAction { implicit request =>
    Ok(views.html.users.add(form))
  }

  def save = PostAction { implicit request =>
    form.bindFromRequest.fold(
      formWithErrors => BadRequest(views.html.users.add(formWithErrors)),
      user => {
        User.save(user)
        Redirect(routes.Users.list).flashing("success" -> "User successfully created!")
      })
  }

  def list = Action { implicit request =>
    Ok(views.html.users.list(User.list))
  }

  def edit(id: Int) = GetAction { implicit request =>
    User.load(id).map { user =>
      val bindedForm = form.fill(user)
      Ok(views.html.users.edit(id, bindedForm))
    }.getOrElse(NotFound)
  }

  def update(id: Int) = PostAction { implicit request =>
    User.load(id).map { user =>
      form.bindFromRequest.fold(
        formWithErrors => BadRequest(views.html.users.edit(id, formWithErrors)),
        userWithNewValues => {
          User.update(id, userWithNewValues)
          Redirect(routes.Users.list).flashing("success" -> "User successfully updated!")
        })
    }.getOrElse(NotFound)
  }

  def delete(id: Int) = PostAction {
    User.delete(id)
    Redirect(routes.Users.list).flashing("success" -> "User successfully deleted!")
  }

  def resetPassword = GetAction { implicit request =>
    Ok(views.html.users.resetPassword(resetPasswordForm))
  }

  def sendResetPasswordEmail = PostAction { implicit request =>
    resetPasswordForm.bindFromRequest.fold(
      formWithErrors => BadRequest(views.html.users.resetPassword(formWithErrors)),
      user => {
        val requestUserAgent = request.headers.get("user-agent").getOrElse("")
        val userAgent = UserAgent.parse(requestUserAgent)

        // TODO: create PasswordResetRequest
        Ok(views.html.users.resetPasswordSent())
      })
  }

  def newPassword(code: String) = GetAction { implicit request =>
    val user = User.findByCode(code).getOrElse(null)
    if (user != null) {
      // TODO: update token as used
      Ok(views.html.users.newPassword(newPasswordForm))
    }
    else
      NotFound
  }

  def changePassword = GetAction { implicit request =>
    Ok(views.html.users.newPassword(newPasswordForm))
  }

  def savePassword = PostAction { implicit request =>
    newPasswordForm.bindFromRequest.fold(
      formWithErrors => BadRequest(views.html.users.newPassword(formWithErrors)),
      user => {
        // TODO: update password
        Ok(views.html.users.newPasswordSaved())
      })
  }
}

