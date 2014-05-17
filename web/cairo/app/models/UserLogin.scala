package models

import play.api.Logger
import anorm._
import anorm.SqlParser._
//import play.api.db.DB
import services.db.DB
import services._
import mailers._
import java.util.Date
import play.api.Play.current
import collection.immutable.HashMap

case class LoginData(email: String, password: String)

object LoginData {

  def save(user: LoginData,
           platform: String,
           ip_address: String,
           user_agent: String,
           accept_language: String,
           is_mobile: Boolean): String = {

    val userLogin = UserLogin(
      anorm.NotAssigned,
      user.email,
      user.password,
      platform,
      ip_address,
      user_agent,
      accept_language,
      is_mobile,
      null,
      null)
    UserLogin.save(userLogin)
  }
}

case class UserLogin(
                      id: Pk[Int] = NotAssigned,
                      username: String,
                      password: String,
                      platform: String,
                      ip_address: String,
                      user_agent: String,
                      accept_language: String,
                      is_mobile: Boolean,
                      created_at: Date,
                      updated_at: Date
                      )

object UserLogin {

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

  def save(user: UserLogin): String = {
    val resultCode = login(user)
    DB.withConnection("master") { implicit connection =>
      SQL("""
          INSERT INTO user_login(usl_username, usl_result_code, usl_platform, usl_ip_address, usl_user_agent, usl_accept_language, usl_is_mobile)
          VALUES({username}, {result_code}, {platform}, {ip_address}, {user_agent}, {accept_language}, {is_mobile})
          """).on(
        'username -> user.username,
        'result_code -> resultCode,
        'platform -> user.platform,
        'ip_address -> user.ip_address,
        'user_agent -> user.user_agent,
        'accept_language -> user.accept_language,
        'is_mobile -> (if(user.is_mobile) 1 else 0)
      ).executeUpdate
    }
    resultCode
  }

  def locationIsBlocked(user: User) = false

/*
    1 - User not found
    2 - Bad password
    3 - Not validated
    4 - Locked
    5 - Error
    6 - Location Blocked

* */

  def login(userLogin: UserLogin) = {
    val user = User.findByUsername(userLogin.username).getOrElse(null)
    if (user == null)
      resultCodes(resultNoUser)
    else if (!PasswordHash.validatePassword(userLogin.password, user.password))
      resultCodes(resultBadPassword)
    else if (user.locked)
      resultCodes(resultLocked)
    else if (locationIsBlocked(user))
      resultCodes(resultLocationBlocked)
    else
      resultCodes(resultSuccess)
  }

  private val userParser: RowParser[UserLogin] = {
    get[Pk[Int]]("usl_id") ~
      get[String]("usl_username") ~
      get[String]("usl_result_code") ~
      get[String]("usl_platform") ~
      get[String]("usl_ip_address") ~
      get[String]("usl_user_agent") ~
      get[String]("usl_accept_language") ~
      get[Int]("usl_is_mobile") ~
      get[Date]("created_at") ~
      get[Date]("updated_at") map {
      case usl_id ~ usl_username ~ usl_result_code ~ usl_platform ~ usl_ip_address ~ usl_user_agent ~ usl_accept_language ~ usl_is_mobile ~ created_at ~ updated_at =>
        UserLogin(usl_id, usl_username, usl_result_code, usl_platform, usl_ip_address, usl_user_agent, usl_accept_language, usl_is_mobile != 0, created_at, updated_at)
    }
  }

  def list: List[UserLogin] = {
    DB.withConnection("master") { implicit connection =>
      SQL("SELECT * FROM user_login").as(userParser *)
    }
  }

}

