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

case class ApplicationData(apiKey: String, secret: String, email: String, dbId: Int)

object ApplicationData {

  def insert(applicationData: ApplicationData,
             platform: String,
             ip_address: String,
             user_agent: String,
             accept_language: String,
             is_mobile: Boolean):(Boolean, String, Int) = {
    if(ApiApplication.existsWithApiKey(applicationData.apiKey)) {
      (false, "This api_key has already been taken", 0)
    }
    else {
      val applicationId = save(applicationData, platform, ip_address, user_agent, accept_language, is_mobile)
      (true, "", applicationId)
    }
  }


  def save(applicationData: ApplicationData) = {
    val application = ApiApplication(
      anorm.NotAssigned,
      applicationData.apiKey,
      applicationData.email,
      PasswordHash.createHash(applicationData.secret),
      PasswordHash.createCode(applicationData.secret),
      false, false, "", "", "", "", false,
      applicationData.dbId,
      null, null)
    ApiApplication.save(application)
  }

  def save(applicationData: ApplicationData,
           platform: String,
           ip_address: String,
           user_agent: String,
           accept_language: String,
           is_mobile: Boolean): Int = {

    val application = ApiApplication(
      anorm.NotAssigned,
      applicationData.apiKey,
      applicationData.apiKey,
      PasswordHash.createHash(applicationData.secret),
      PasswordHash.createCode(applicationData.secret),
      false,
      false,
      platform,
      ip_address,
      user_agent,
      accept_language,
      is_mobile,
      applicationData.dbId,
      null,
      null)
    ApiApplication.saveAndSendRegistrationEmail(application)
  }
}

case class ApiApplication(
                           id: Pk[Int] = NotAssigned,
                           apiKey: String,
                           email: String,
                           secret: String,
                           name: String,
                           active: Boolean,
                           locked: Boolean,
                           platform: String,
                           ip_address: String,
                           user_agent: String,
                           accept_language: String,
                           is_mobile: Boolean,
                           dbId: Int,
                           created_at: Date,
                           updated_at: Date
               ) {

  lazy val cairoDataSource = CairoDB.connectCairoForApp(this)
  lazy val applicationId = id.getOrElse(0)

}

object ApiApplication {

  def saveAndSendRegistrationEmail(application: ApiApplication): Int = {
    val id = save(application)
    CustomerMailer.sendRegistration(application)
    id
  }

  def sendRegistration(application: ApiApplication) = {
    CustomerMailer.sendRegistration(application)
  }

  def sendResetPassword(application: ApiApplication, token: String) = {
    CustomerMailer.sendResetPassword(application, token)
  }

  def save(application: ApiApplication): Int = {
    DB.withConnection("master") { implicit connection =>
      SQL("""
          INSERT INTO applications(app_api_key, app_email, app_secret, app_name, app_active, app_locked, app_platform, app_ip_address, app_user_agent, app_accept_language, app_is_mobile, db_id)
          VALUES({api_key}, {email}, {password}, {code}, {active}, {locked}, {platform}, {ip_address}, {user_agent}, {accept_language}, {is_mobile})
      """).on(
        'api_key -> application.apiKey,
        'email -> application.email,
        'password -> application.secret,
        'code -> application.name,
        'active -> Register.boolToInt(application.active),
        'locked -> Register.boolToInt(application.locked),
        'platform -> application.platform,
        'ip_address -> application.ip_address,
        'user_agent -> application.user_agent,
        'accept_language -> application.accept_language,
        'is_mobile -> Register.boolToInt(application.is_mobile),
        'db_id -> application.dbId
      ).executeInsert().map(id => id.toInt).getOrElse(throw new RuntimeException("Error when inserting application"))
    }
  }

  private val applicationParser: RowParser[ApiApplication] = {
    get[Pk[Int]]("app_id") ~
      get[String]("app_api_key") ~
      get[String]("app_email") ~
      get[String]("app_secret") ~
      get[String]("app_name") ~
      get[Int]("app_active") ~
      get[Int]("app_locked") ~
      get[String]("app_platform") ~
      get[String]("app_ip_address") ~
      get[String]("app_user_agent") ~
      get[String]("app_accept_language") ~
      get[Int]("app_is_mobile") ~
      get[Int]("db_id") ~
      get[Date]("created_at") ~
      get[Date]("updated_at") map {
      case app_id ~ app_api_key ~ app_email ~ app_secret ~ app_name ~ app_active ~ app_locked ~ app_platform ~ app_ip_address ~ app_user_agent ~ app_accept_language ~ app_is_mobile ~ db_id ~ created_at ~ updated_at =>
        ApiApplication(app_id, app_api_key, app_email, app_secret, app_name, app_active != 0, app_locked != 0, app_platform, app_ip_address, app_user_agent, app_accept_language, app_is_mobile != 0, db_id, created_at, updated_at)
    }
  }

  def list: List[ApiApplication] = {
    DB.withConnection("master") { implicit connection =>
      SQL("SELECT * FROM applications").as(applicationParser *)
    }
  }

  def findByName(name: String): Option[ApiApplication] = {
    loadWhere("app_namee = {name}", 'name -> name)
  }

  def findByEmail(email: String): Option[ApiApplication] = {
    loadWhere("app_email = {email}", 'email -> email.toLowerCase())
  }

  def existsWithApiKey(apiKey: String): Boolean = {
    countWhere("app_api_key = {api_key}", 'api_key -> apiKey.toLowerCase()) > 0
  }

  def findByApiKey(apiKey: String): Option[ApiApplication] = {
    loadWhere("app_api_key = {api_key}", 'api_key -> apiKey.toLowerCase())
  }

  def load(id: Int): Option[ApiApplication] = {
    loadWhere("app_id = {id}", 'id -> id)
  }

  def findByResetPasswordToken(tokenText: String): (Option[ApiApplication], Token) = {
    val token = Token.findByToken(tokenText)
    if(token.isValid)
      (loadWhere("app_id = {id}", 'id -> token.app_id), token)
    else
      (None, token)
  }

  def countWhere(where: String, args : scala.Tuple2[scala.Any, anorm.ParameterValue[_]]*): Long = {
    DB.withConnection("master") { implicit connection =>
      val row = SQL(s"SELECT count(*) as c FROM applications WHERE $where")
        .on(args: _*)
        .apply().head
      row[Long]("c")
    }
  }

  def loadWhere(where: String, args : scala.Tuple2[scala.Any, anorm.ParameterValue[_]]*) = {
    DB.withConnection("master") { implicit connection =>
      SQL(s"SELECT * FROM applications WHERE $where")
        .on(args: _*)
        .as(applicationParser.singleOpt)
    }
  }

  def update(id: Int, application: ApiApplication): Int = {
    update(id, application.apiKey, application.email)
  }

  def update(id: Int, apiKey: String, email: String): Int = {
    DB.withConnection("master") { implicit connection =>
      SQL("""
          UPDATE applications SET
          app_api_key = {api_key},
          app_email = {email}
          WHERE app_id = {id}
      """).on(
        'id -> id,
        'api_key -> apiKey,
        'email -> email
      ).executeUpdate
    }
  }

  def updatePassword(id: Int, password: String) = {
    DB.withConnection("master") { implicit connection =>
      SQL("""
          UPDATE applications SET
          app_secret = {password}
          WHERE app_id = {id}
          """).on(
        'id -> id,
        'password -> PasswordHash.createHash(password)
      ).executeUpdate
    }
  }

  def activateApplication(id: Int) = {
    DB.withConnection("master") { implicit connection =>
      SQL("""
          UPDATE applications SET
          app_active = 1
          WHERE app_id = {id}
          """).on(
        'id -> id
      ).executeUpdate
    }
  }

  def delete(id: Int) = {
    DB.withConnection("master") { implicit connection =>
      SQL("""
          DELETE FROM applications where app_id = {id}
      """).on(
        'id -> id
      ).executeUpdate
    }
  }

  def createResetPasswordToken(usId: Int, requestOrigin: RequestOrigin) = {
    Token.newTokenForApp(
      Token.tokenTypes(Token.resetPasswordTokenType),
      DateUtil.plusDays(DateUtil.currentTime, 2),
      "",
      usId,
      requestOrigin
    )
  }

  def updateName(id: Int, name: String) = {
    DB.withConnection("master") { implicit connection =>
      SQL("UPDATE applications SET app_name = {name} WHERE app_id = {id}")
        .on('id -> id, 'name -> name)
        .executeUpdate
    }
  }

}

