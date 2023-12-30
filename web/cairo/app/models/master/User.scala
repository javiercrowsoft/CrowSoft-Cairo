package models.master

import play.api.Logger
import anorm._
import anorm.SqlParser._
import models.cairo.system.database.Register
//import play.api.db.DB
import services.db.{CairoDB, DB}
import services._
import mailers._
import java.util.Date
import play.api.Play.current

case class UserData(email: String, password: String)

object UserData {

  def insert(userData: UserData,
             platform: String,
             ip_address: String,
             user_agent: String,
             accept_language: String,
             is_mobile: Boolean):(Boolean, String, Int) = {
    if(User.existsWithEmail(userData.email)) {
      (false, "This email address has already been taken", 0)
    }
    else {
      val userId = save(userData, platform, ip_address, user_agent, accept_language, is_mobile)
      (true, "", userId)
    }
  }


  def save(userData: UserData) = {
    val user = User(
      anorm.NotAssigned,
      userData.email,
      userData.email,
      PasswordHash.createHash(userData.password),
      PasswordHash.createCode(userData.password),
      false, false, "", "", "", "", false, null, null)
    User.save(user)
  }

  def save(userData: UserData,
           platform: String,
           ip_address: String,
           user_agent: String,
           accept_language: String,
           is_mobile: Boolean): Int = {

    val user = User(
      anorm.NotAssigned,
      userData.email,
      userData.email,
      PasswordHash.createHash(userData.password),
      PasswordHash.createCode(userData.password),
      false,
      false,
      platform,
      ip_address,
      user_agent,
      accept_language,
      is_mobile,
      null,
      null)
    User.saveAndSendRegistrationEmail(user)
  }
}

case class User(
                 id: Pk[Int] = NotAssigned,
                 username: String,
                 email: String,
                 password: String,
                 code: String,
                 active: Boolean,
                 locked: Boolean,
                 platform: String,
                 ip_address: String,
                 user_agent: String,
                 accept_language: String,
                 is_mobile: Boolean,
                 created_at: Date,
                 updated_at: Date
                 ) {

  lazy val domainDataSource = CairoDB.connectDomainForUser(this)
  lazy val userId = id.getOrElse(0)

}

object User {

  def saveAndSendRegistrationEmail(user: User): Int = {
    val id = save(user)
    CustomerMailer.sendRegistration(user)
    id
  }

  def sendRegistration(user: User) = {
    CustomerMailer.sendRegistration(user)
  }

  def sendResetPassword(user: User, token: String) = {
    CustomerMailer.sendResetPassword(user, token)
  }

  def save(user: User): Int = {
    DB.withConnection("master") { implicit connection =>
      SQL("""
          INSERT INTO users(us_username, us_email, us_password, us_code, us_active, us_locked, us_platform, us_ip_address, us_user_agent, us_accept_language, us_is_mobile)
          VALUES({username}, {email}, {password}, {code}, {active}, {locked}, {platform}, {ip_address}, {user_agent}, {accept_language}, {is_mobile})
      """).on(
          'username -> user.username,
          'email -> user.email,
          'password -> user.password,
          'code -> user.code,
          'active -> Register.boolToInt(user.active),
          'locked -> Register.boolToInt(user.locked),
          'platform -> user.platform,
          'ip_address -> user.ip_address,
          'user_agent -> user.user_agent,
          'accept_language -> user.accept_language,
          'is_mobile -> Register.boolToInt(user.is_mobile)
      ).executeInsert().map(id => id.toInt).getOrElse(throw new RuntimeException("Error when inserting user"))
    }
  }

  private val userParser: RowParser[User] = {
      get[Pk[Int]]("us_id") ~
      get[String]("us_username") ~
      get[String]("us_email") ~
      get[String]("us_password") ~
      get[String]("us_code") ~
      get[Int]("us_active") ~
      get[Int]("us_locked") ~
      get[String]("us_platform") ~
      get[String]("us_ip_address") ~
      get[String]("us_user_agent") ~
      get[String]("us_accept_language") ~
      get[Int]("us_is_mobile") ~
      get[Date]("created_at") ~
      get[Date]("updated_at") map {
      case us_id ~ us_username ~ us_email ~ us_password ~ us_code ~ us_active ~ us_locked ~ us_platform ~ us_ip_address ~ us_user_agent ~ us_accept_language ~ us_is_mobile ~ created_at ~ updated_at =>
      User(us_id, us_username, us_email, us_password, us_code, us_active != 0, us_locked != 0, us_platform, us_ip_address, us_user_agent, us_accept_language, us_is_mobile != 0, created_at, updated_at)
    }
  }

  def list: List[User] = {
    DB.withConnection("master") { implicit connection =>
      SQL("SELECT * FROM users").as(userParser *)
    }
  }

  def findByCode(code: String): Option[User] = {
    loadWhere("us_code = {code}", 'code -> code)
  }

  def findByEmail(email: String): Option[User] = {
    loadWhere("us_email = {email}", 'email -> email.toLowerCase())
  }

  def existsWithEmail(email: String): Boolean = {
    countWhere("us_email = {email}", 'email -> email.toLowerCase()) > 0
  }

  def findByUsername(username: String): Option[User] = {
    loadWhere("us_username = {username}", 'username -> username.toLowerCase())
  }

  def load(id: Int): Option[User] = {
    loadWhere("us_id = {id}", 'id -> id)
  }

  def findByResetPasswordToken(tokenText: String): (Option[User], Token) = {
    val token = Token.findByToken(tokenText)
    if(token.isValid)
      (loadWhere("us_id = {id}", 'id -> token.us_id), token)
    else
      (None, token)
  }

  def countWhere(where: String, args : scala.Tuple2[scala.Any, anorm.ParameterValue[_]]*): Long = {
    DB.withConnection("master") { implicit connection =>
      val row = SQL(s"SELECT count(*) as c FROM users WHERE $where")
        .on(args: _*)
        .apply().head
      row[Long]("c")
    }
  }

  def loadWhere(where: String, args : scala.Tuple2[scala.Any, anorm.ParameterValue[_]]*) = {
    DB.withConnection("master") { implicit connection =>
      SQL(s"SELECT * FROM users WHERE $where")
        .on(args: _*)
        .as(userParser.singleOpt)
    }
  }

  def update(id: Int, user: User): Int = {
    update(id, user.username, user.email)
  }

  def update(id: Int, username: String, email: String): Int = {
    DB.withConnection("master") { implicit connection =>
      SQL("""
          UPDATE users SET
          us_username = {username},
          us_email = {email}
          WHERE us_id = {id}
      """).on(
          'id -> id,
          'username -> username,
          'email -> email
      ).executeUpdate
    }
  }

  def updatePassword(id: Int, password: String) = {
    DB.withConnection("master") { implicit connection =>
      SQL("""
          UPDATE users SET
          us_password = {password}
          WHERE us_id = {id}
          """).on(
          'id -> id,
          'password -> PasswordHash.createHash(password)
        ).executeUpdate
    }
  }

  def activateUser(id: Int) = {
    DB.withConnection("master") { implicit connection =>
      SQL("""
          UPDATE users SET
          us_active = 1
          WHERE us_id = {id}
          """).on(
        'id -> id
      ).executeUpdate
    }
  }

  def delete(id: Int) = {
    DB.withConnection("master") { implicit connection =>
      SQL(""" 
          DELETE FROM users where us_id = {id}
      """).on(
          'id -> id
      ).executeUpdate
    }
  }

  def createResetPasswordToken(usId: Int, requestOrigin: RequestOrigin) = {
    Token.newTokenForUser(
      Token.tokenTypes(Token.resetPasswordTokenType),
      DateUtil.plusDays(DateUtil.currentTime, 2),
      "",
      usId,
      requestOrigin
    )
  }

  def updateCode(id: Int, code: String) = {
    DB.withConnection("master") { implicit connection =>
      SQL("UPDATE users SET us_code = {code} WHERE us_id = {id}")
        .on('id -> id, 'code -> code)
        .executeUpdate
    }
  }

}

