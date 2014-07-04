package controllers.logged.system

import controllers._
import play.api.mvc._
import play.api.data._
import play.api.data.Forms._
import actions._
import play.api.Logger
import play.api.libs.json._


case class User(id: Int, firstName: String, lastName: String, phoneNumber: String)

object Users extends Controller with ProvidesUser {

  implicit val userWrites = new Writes[User] {
    def writes(user: User) = Json.obj(
      "id" -> user.id,
      "firstName" -> user.firstName,
      "lastName" -> user.lastName,
      "phoneNumber" -> user.phoneNumber
    )
  }

  def listOld = GetAction(parse.json) { implicit request =>
    LoggedIntoCompanyResponse.getAction(request, { user =>
      (request.body \ "name").asOpt[String].map { name =>
        Ok(Json.toJson(
          Map("status" -> "OK", "message" -> ("Hello " + name))
        ))
      }.getOrElse {
        BadRequest(Json.toJson(
          Map("status" -> "KO", "message" -> "Missing parameter [name]")
        ))
      }
    })
  }

  def list = GetAction { implicit request =>
    LoggedIntoCompanyResponse.getAction(request, { user =>
      Ok(Json.toJson(
        List(
          User(1, "Jose", "Burgues", "555-0011"),
          User(2, "Josa", "Aurgues", "555-0011"),
          User(3, "Josb", "BBurgues", "555-0011"),
          User(4, "Josc", "Curgues", "555-0011"))
      ))
    })
  }

}