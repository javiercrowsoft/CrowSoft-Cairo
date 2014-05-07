package models

import anorm._
import anorm.SqlParser._
import play.api.db.DB
import services._
import mailers._
import java.util.Date
import play.api.Play.current

case class UserData(email: String, password: String)

object UserData {

  def save(user: UserData) {
    val userSignUp = UserSignUp(
      anorm.NotAssigned,
      user.email,
      user.email,
      PasswordHash.createHash(user.password),
      PasswordHash.createCode(user.password),
      false, "", "", "", "", false, null, null)
    UserSignUp.save(userSignUp)
  }

  def save(user: UserData,
           platform: String,
           ip_address: String,
           user_agent: String,
           accept_language: String,
           is_mobile: Boolean) {

    val userSignUp = UserSignUp(
      anorm.NotAssigned,
      user.email,
      user.email,
      PasswordHash.createHash(user.password),
      PasswordHash.createCode(user.password),
      false,
      platform,
      ip_address,
      user_agent,
      accept_language,
      is_mobile,
      null,
      null)
    UserSignUp.save(userSignUp)
  }
}

case class UserSignUp(
  id: Pk[Int] = NotAssigned,
  username: String,
  email: String,
  password: String,
  code: String,
  active: Boolean,
  platform: String,
  ip_address: String,
  user_agent: String,
  accept_language: String,
  is_mobile: Boolean,
  created_at: Date,
  updated_at: Date
  )

object UserSignUp {

  def save(user: UserSignUp) {
    DB.withConnection("master") { implicit connection =>
      SQL("""
          INSERT INTO user_sign_up(ussu_username, ussu_email, ussu_password, ussu_code, ussu_active, ussu_platform, ussu_ip_address, ussu_user_agent, ussu_accept_language, ussu_is_mobile)
          VALUES({username}, {email}, {password}, {code}, {active}, {platform}, {ip_address}, {user_agent}, {accept_language}, {is_mobile})
      """).on(
          'username -> user.username,
          'email -> user.email,
          'password -> user.password,
          'code -> user.code,
          'active -> (if(user.active) 1 else 0),
          'platform -> user.platform,
          'ip_address -> user.ip_address,
          'user_agent -> user.user_agent,
          'accept_language -> user.accept_language,
          'is_mobile -> (if(user.is_mobile) 1 else 0)
      ).executeUpdate
    }
    CustomerMailer.sendRegistration(user)
  }

  private val userParser: RowParser[UserSignUp] = {
    get[Pk[Int]]("ussu_id") ~
      get[String]("ussu_username") ~
      get[String]("ussu_email") ~
      get[String]("ussu_password") ~
      get[String]("ussu_code") ~
      get[Int]("ussu_active") ~
      get[String]("ussu_platform") ~
      get[String]("ussu_ip_address") ~
      get[String]("ussu_user_agent") ~
      get[String]("ussu_accept_language") ~
      get[Int]("ussu_is_mobile") ~
      get[Date]("created_at") ~
      get[Date]("updated_at") map {
      case ussu_id ~ ussu_username ~ ussu_email ~ ussu_password ~ ussu_code ~ ussu_active ~ ussu_platform ~ ussu_ip_address ~ ussu_user_agent ~ ussu_accept_language ~ ussu_is_mobile ~ created_at ~ updated_at =>
      UserSignUp(ussu_id, ussu_username, ussu_email, ussu_password, ussu_code, ussu_active != 0, ussu_platform, ussu_ip_address, ussu_user_agent, ussu_accept_language, ussu_is_mobile != 0, created_at, updated_at)
    }
  }

  def list: List[UserSignUp] = {
    DB.withConnection("master") { implicit connection =>
      SQL("SELECT * from user_sign_up").as(userParser *)
    }
  }

  def load(id: Int): Option[UserSignUp] = {
    DB.withConnection("master") { implicit connection =>
      SQL("SELECT * from user_sign_up WHERE ussu_id = {id}")
        .on('id -> id)
        .as(userParser.singleOpt)
    }
  }

  def update(id: Int, user: UserSignUp) {
    DB.withConnection("master") { implicit connection =>
      SQL("""
          UPDATE user_sign_up SET
          ussu_username = {username},
          ussu_email = {email}
          WHERE ussu_id = {id}
      """).on(
          'id -> id,
          'username -> user.username,
          'email -> user.email
      ).executeUpdate
    }
  }

  def delete(id: Int) {
    DB.withConnection("master") { implicit connection =>
      SQL(""" 
          DELETE FROM user_sign_up where ussu_id = {id}
      """).on(
          'id -> id
      ).executeUpdate
    }
  }
}

