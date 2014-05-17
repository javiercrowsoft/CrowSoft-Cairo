package models

import play.api.Logger
import anorm._
import anorm.SqlParser._
//import play.api.db.DB
import services.db.DB
import java.util.Date
import play.api.Play.current
import services.{DateUtil, PasswordHash, UserAgent, RequestOrigin}
import collection.immutable.HashMap

case class Token(
                  id: Pk[Int] = NotAssigned,
                  token: String,
                  expires: Date,
                  token_type: String,
                  data: String,
                  used: Boolean,
                  us_id: Int,
                  platform: String,
                  ip_address: String,
                  user_agent: String,
                  accept_language: String,
                  is_mobile: Boolean,
                  created_at: Date,
                  updated_at: Date
                  ) {

  // TODO: language support
  val status: (Boolean, String) = {
    if (token_type == Token.tokenTypes(Token.invalidTokenType)) {
      (false, "Invalid Token")
    }
    else if (used) {
      (false, "This token has already been used")
    }
    else if (isExpired) {
      (false, "Token has expired")
    }
    else
      (true, "")
  }

  val isValid = status._1

  val message = status._2

  val isExpired = expires.compareTo(DateUtil.currentTime) < 0

}

object Token {

  val resetPasswordTokenType = 1
  val invalidTokenType = 2

  val tokenTypes = HashMap(
    invalidTokenType -> "INVALID_TOKEN",
    resetPasswordTokenType -> "RESET_PASSWORD_TOKEN"
  )

  val invalidToken = Token(anorm.NotAssigned, "", DateUtil.currentTime, "INVALID_TOKEN", "", false, 0,
                            "", "0.0.0.0", "", "", false, DateUtil.currentTime, DateUtil.currentTime)

  def newToken(tokenType: String, expires: Date, data: String, usId: Int, requestOrigin: RequestOrigin) = {
    save(Token(
      anorm.NotAssigned,
      PasswordHash.createCode(expires.toString),
      expires,
      tokenType,
      data,
      false,
      usId,
      requestOrigin.userAgent.platform,
      requestOrigin.remoteAddress,
      requestOrigin.userAgent.userAgent,
      requestOrigin.acceptLanguages.toString,
      requestOrigin.userAgent.isMobile,
      null,
      null
    ))
  }


  def save(token: Token): Token = {
    DB.withConnection("master") { implicit connection =>
      SQL("""
          INSERT INTO token(tk_token, tk_expires, tk_type, tk_data, tk_used, us_id, tk_platform, tk_ip_address, tk_user_agent, tk_accept_language, tk_is_mobile)
          VALUES({token}, {expires}, {token_type}, {data}, {used}, {us_id}, {platform}, {ip_address}, {user_agent}, {accept_language}, {is_mobile})
          """).on(
          'token -> token.token,
          'expires -> token.expires,
          'token_type -> token.token_type,
          'data -> token.data,
          'used -> (if (token.used) 1 else 0),
          'us_id -> (if(token.us_id !=0) token.us_id else null),
          'platform -> token.platform,
          'ip_address -> token.ip_address,
          'user_agent -> token.user_agent,
          'accept_language -> token.accept_language,
          'is_mobile -> (if(token.is_mobile) 1 else 0)
        ).executeUpdate
    }
    token
  }

  private val tokenParser: RowParser[Token] = {
    get[Pk[Int]]("tk_id") ~
      get[String]("tk_token") ~
      get[Date]("tk_expires") ~
      get[String]("tk_type") ~
      get[String]("tk_data") ~
      get[Int]("tk_used") ~
      get[Int]("us_id") ~
      get[String]("tk_platform") ~
      get[String]("tk_ip_address") ~
      get[String]("tk_user_agent") ~
      get[String]("tk_accept_language") ~
      get[Int]("tk_is_mobile") ~
      get[Date]("created_at") ~
      get[Date]("updated_at") map {
      case tk_id ~ tk_token ~ tk_expires ~ tk_type ~ tk_data ~ tk_used ~ us_id ~ tk_platform ~ tk_ip_address ~ tk_user_agent ~ tk_accept_language ~ tk_is_mobile ~ created_at ~ updated_at =>
        Token(tk_id, tk_token, tk_expires, tk_type, tk_data, tk_used != 0, us_id, tk_platform, tk_ip_address, tk_user_agent, tk_accept_language, tk_is_mobile != 0, created_at, updated_at)
    }
  }

  def list: List[Token] = {
    DB.withConnection("master") { implicit connection =>
      SQL("SELECT * FROM token").as(tokenParser *)
    }
  }

  def setAsUsed(id: Int) = {
    DB.withConnection("master") { implicit connection =>
      SQL("""
          UPDATE token SET
          tk_used = 1
          WHERE tk_id = {id}
          """).on(
          'id -> id
        ).executeUpdate
    }
  }

  def findByToken(tokenText: String): Token = {
    val token = loadWhere("tk_token = {token}", 'token -> tokenText).getOrElse(null)
    if (token == null)
      invalidToken
    else
      token
  }

  def load(id: Int): Option[Token] = {
    loadWhere("tk_id = {id}", 'id -> id)
  }

  def loadWhere(where: String, args : scala.Tuple2[scala.Any, anorm.ParameterValue[_]]*) = {
    DB.withConnection("master") { implicit connection =>
      SQL(s"SELECT * FROM token WHERE $where")
        .on(args: _*)
        .as(tokenParser.singleOpt)
    }
  }

}

