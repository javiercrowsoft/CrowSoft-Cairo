package controllers

import play.api.mvc._
import play.api.data._
import play.api.data.Forms._
import actions._
import anorm._
import models.UserSignUp

object Users extends Controller {

  val form = Form(
    mapping(
      "id" -> ignored(NotAssigned: Pk[Int]),
      "username" -> text, 
      "email" -> email,
      "password" -> nonEmptyText,
      "code" -> text,
      "active" -> boolean,
      "platform" -> text,
      "ip_address" -> text,
      "user_agent" -> text,
      "accept_language" -> text,
      "is_mobile" -> boolean,
      "created_at" -> date,
      "updated_at" -> date
      )(UserSignUp.apply)(UserSignUp.unapply))

  def add = GetAction { implicit request =>
    Ok(views.html.users.add(form))
  }

  def save = PostAction { implicit request =>
    form.bindFromRequest.fold(
      formWithErrors => BadRequest(views.html.users.add(formWithErrors)),
      user => {
        UserSignUp.save(user)
        Redirect(routes.Users.list).flashing("success" -> "User successfully created!")
      })
  }

  def list = Action { implicit request =>
    Ok(views.html.users.list(UserSignUp.list))
  }

  def edit(id: Int) = GetAction { implicit request =>
    UserSignUp.load(id).map { user =>
      val bindedForm = form.fill(user)
      Ok(views.html.users.edit(id, bindedForm))
    }.getOrElse(NotFound)
  }

  def update(id: Int) = PostAction { implicit request =>
    UserSignUp.load(id).map { user =>
      form.bindFromRequest.fold(
        formWithErrors => BadRequest(views.html.users.edit(id, formWithErrors)),
        userWithNewValues => {
          UserSignUp.update(id, userWithNewValues)
          Redirect(routes.Users.list).flashing("success" -> "User successfully updated!")
        })
    }.getOrElse(NotFound)
  }

  def delete(id: Int) = PostAction {
    UserSignUp.delete(id)
    Redirect(routes.Users.list).flashing("success" -> "User successfully deleted!")
  }
}

