package controllers

import play.api.mvc._
import play.api.data._
import play.api.data.Forms._
import actions._
import anorm._
import models.User
import services.{PasswordValidation, UserAgent, RequestOrigin}
import play.api.Logger

case class ResetPasswordData(username: String)

case class NewPasswordData(password: String, confirm: String, token: String)

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
    )(ResetPasswordData.apply)(ResetPasswordData.unapply))

  val newPasswordForm = Form(
    mapping(
      "password" -> nonEmptyText(minLength = 12).verifying(PasswordValidation.passwordCheckConstraint),
      "confirm" -> nonEmptyText(minLength = 12).verifying(PasswordValidation.passwordCheckConstraint),
      "token" -> text
    )(NewPasswordData.apply)(NewPasswordData.unapply)
      verifying("Password and confirmation doesn't match.",
        fields => fields match { case passwordData => {
          Logger.debug(s"passwordCheckConfirmation: ${(passwordData.password == passwordData.confirm).toString}")
          passwordData.password == passwordData.confirm
        }
        }
      )
  )

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
      resetPassword => {
        val user = User.findByUsername(resetPassword.username).getOrElse(null)
        if(user == null)
          NotFound
        else {
          val token = User.createResetPasswordToken(user.id.getOrElse(0), RequestOrigin.parse(request))
          User.sendResetPassword(user, token.token)
          Ok(views.html.users.resetPasswordSent())
        }
      })
  }

  def newPassword(token: String) = GetAction { implicit request =>
    val user = User.findByResetPasswordToken(token)
    if (user._1 != null) {
      val newPasswordWithTokenForm = newPasswordForm.fill(NewPasswordData("", "", token))
      Ok(views.html.users.newPassword(newPasswordWithTokenForm))
    }
    else
      Ok(views.html.users.resetPasswordInvalidToken(user._2))
  }

  def changePassword = GetAction { implicit request =>
    Ok(views.html.users.newPassword(newPasswordForm))
  }

  def savePassword = PostAction { implicit request =>
    Logger.debug("in savePassword")
    newPasswordForm.bindFromRequest.fold(
      formWithErrors => {
        Logger.debug("unvalid form")
        BadRequest(views.html.users.newPassword(formWithErrors))
      },
      user => {
        // TODO: update password
        Logger.debug("valid form")
        Ok(views.html.users.newPasswordSaved())
      })
  }
}

