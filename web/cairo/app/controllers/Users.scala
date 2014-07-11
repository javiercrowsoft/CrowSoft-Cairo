package controllers

import play.api.mvc._
import play.api.data._
import play.api.data.Forms._
import actions._
import anorm._
import models.master.{ LoginData, User, Token }
import services.{ PasswordValidation, UserAgent, RequestOrigin }
import play.api.Logger
import settings.Settings

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

  def create = PostAction { implicit request =>
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
          Redirect(routes.Users.resetPassword).flashing("error" -> s"No user is registered in our system for email ${resetPassword.username}")
        else {
          val token = User.createResetPasswordToken(user.id.getOrElse(0), RequestOrigin.parse(request))
          User.sendResetPassword(user, token.token)
          Ok(views.html.users.resetPasswordSent())
        }
      })
  }

  def newPassword(tokenText: String) = GetAction { implicit request =>
    val t = User.findByResetPasswordToken(tokenText)
    val user = t._1.getOrElse(null)
    if(user != null) {
      val newPasswordWithTokenForm = newPasswordForm.fill(NewPasswordData("", "", tokenText))
      Ok(views.html.users.newPassword(newPasswordWithTokenForm))
    }
    else {
      val token = t._2
      Ok(views.html.users.resetPasswordInvalidToken(token.message))
    }
  }

  def changePassword = GetAction { implicit request =>
    LoggedResponse.getAction(request, { user =>
      Ok(views.html.users.newPassword(newPasswordForm))
    })
  }

  def savePassword = PostAction { implicit request =>
    Logger.debug("in savePassword")
    newPasswordForm.bindFromRequest.fold(
      formWithErrors => {
        Logger.debug("invalid form")
        BadRequest(views.html.users.newPassword(formWithErrors))
      },
      newPassword => {
        if(newPassword.token.isEmpty) {
          LoggedResponse.getAction(request, { user =>
            User.updatePassword(user.id.getOrElse(0), newPassword.password)
            Ok(views.html.users.newPasswordSaved())
          })
        }
        else {
          val t = User.findByResetPasswordToken(newPassword.token)
          val user = t._1.getOrElse(null)
          if(user != null) {
            User.updatePassword(user.id.getOrElse(0), newPassword.password)

            // this token has been used
            val token = t._2
            Token.setAsUsed(token.id.getOrElse(0))

            // we login this user and then redirect to passwordSaved
            val loginData = LoginData(user.username, newPassword.password)
            Sessions.login(RequestOrigin.parse(request), loginData, routes.Users.passwordSaved)
          }
          else {
            val token = t._2
            Ok(views.html.users.resetPasswordInvalidToken(token.message))
          }
        }
      })
  }

  def passwordSaved = GetAction { implicit request =>
    Ok(views.html.users.newPasswordSaved())
  }
}

