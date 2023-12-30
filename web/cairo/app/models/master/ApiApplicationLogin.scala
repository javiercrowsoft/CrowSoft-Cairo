package models.master

import play.api.Logger
import anorm._
import anorm.SqlParser._
import models.cairo.system.database.Register
//import play.api.db.DB
import services.db.DB
import services._
import mailers._
import java.util.Date
import play.api.Play.current
import collection.immutable.HashMap

case class ApiLoginData(apiKey: String, secret: String)

object ApiLoginData {

  def save(application: ApiLoginData,
           platform: String,
           ip_address: String,
           user_agent: String,
           accept_language: String,
           is_mobile: Boolean): String = {

    val apiApplicationLogin = ApiApplicationLogin(
      anorm.NotAssigned,
      application.apiKey,
      application.secret,
      "",
      platform,
      ip_address,
      user_agent,
      accept_language,
      is_mobile,
      null,
      null)
    ApiApplicationLogin.save(apiApplicationLogin)
  }
}

case class ApiApplicationLogin(
                                id: Pk[Int] = NotAssigned,
                                apiKey: String,
                                secret: String,
                                result_code: String,
                                platform: String,
                                ip_address: String,
                                user_agent: String,
                                accept_language: String,
                                is_mobile: Boolean,
                                created_at: Date,
                                updated_at: Date
                    )

object ApiApplicationLogin {

  val resultSuccess = 1
  val resultNoUser = 2
  val resultBadPassword = 3
  val resultNotValidated = 4
  val resultLocked = 5
  val resultError = 6
  val resultLocationBlocked = 7

  val resultCodes = HashMap(
    resultSuccess -> "SUCCESS",
    resultNoUser -> "NO_USER",
    resultBadPassword -> "BAD_PASSWORD",
    resultNotValidated -> "NOT_VALIDATED",
    resultLocked -> "LOCKED",
    resultError -> "ERROR",
    resultLocationBlocked -> "LOCATION_BLOCKED")

  val successCodes = List(resultCodes(resultSuccess), resultCodes(resultNotValidated))
  val loginErrorCodes = List(resultCodes(resultNoUser), resultCodes(resultBadPassword))

  def save(application: ApiApplicationLogin): String = {
    val resultCode = login(application)
    DB.withConnection("master") { implicit connection =>
      SQL("""
          INSERT INTO application_logins(appl_api_key, appl_result_code, appl_platform, appl_ip_address, appl_user_agent, appl_accept_language, appl_is_mobile)
          VALUES({username}, {result_code}, {platform}, {ip_address}, {user_agent}, {accept_language}, {is_mobile})
          """).on(
        'username -> application.apiKey,
        'result_code -> resultCode,
        'platform -> application.platform,
        'ip_address -> application.ip_address,
        'user_agent -> application.user_agent,
        'accept_language -> application.accept_language,
        'is_mobile -> Register.boolToInt(application.is_mobile)
      ).executeUpdate
    }
    resultCode
  }

  def locationIsBlocked(user: User) = false
  def locationIsBlocked(application: ApiApplication) = false

  /*
      1 - User not found
      2 - Bad password
      3 - Not validated
      4 - Locked
      5 - Error
      6 - Location Blocked
  
  * */

  def login(apiApplicationLogin: ApiApplicationLogin) = {
    val application = ApiApplication.findByApiKey(apiApplicationLogin.apiKey).getOrElse(null)
    if(application == null)
      resultCodes(resultNoUser)
    else if(!PasswordHash.validatePassword(apiApplicationLogin.secret, application.secret))
      resultCodes(resultBadPassword)
    else if(application.locked)
      resultCodes(resultLocked)
    else if(locationIsBlocked(application))
      resultCodes(resultLocationBlocked)
    else
      resultCodes(resultSuccess)
  }

  private val userParser: RowParser[ApiApplicationLogin] = {
    get[Pk[Int]]("appl_id") ~
      get[String]("appl_api_key") ~
      get[String]("appl_result_code") ~
      get[String]("appl_platform") ~
      get[String]("appl_ip_address") ~
      get[String]("appl_user_agent") ~
      get[String]("appl_accept_language") ~
      get[Int]("appl_is_mobile") ~
      get[Date]("created_at") ~
      get[Date]("updated_at") map {
      case appl_id ~ appl_api_key ~ appl_result_code ~ appl_platform ~ appl_ip_address ~ appl_user_agent ~ appl_accept_language ~ appl_is_mobile ~ created_at ~ updated_at =>
        ApiApplicationLogin(appl_id, appl_api_key, "", appl_result_code, appl_platform, appl_ip_address, appl_user_agent, appl_accept_language, appl_is_mobile != 0, created_at, updated_at)
    }
  }

  def list: List[ApiApplicationLogin] = {
    DB.withConnection("master") { implicit connection =>
      SQL("SELECT * FROM application_logins").as(userParser *)
    }
  }

}

