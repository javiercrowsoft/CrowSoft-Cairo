package models.domain

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
import models.master.User

case class LoginData(companyId: Int, user: User)

object LoginData {

  def save(company: LoginData,
           platform: String,
           ip_address: String,
           user_agent: String,
           accept_language: String,
           is_mobile: Boolean): String = {

    val companyLogin = CompanyLogin(
      anorm.NotAssigned,
      company.companyId,
      company.user.id.getOrElse(0),
      "",
      platform,
      ip_address,
      user_agent,
      accept_language,
      is_mobile,
      null,
      null)
    CompanyLogin.save(company.user, companyLogin)
  }
}

case class CompanyLogin(
                      id: Pk[Int] = NotAssigned,
                      co_id: Int,
                      us_id: Int,
                      result_code: String,
                      platform: String,
                      ip_address: String,
                      user_agent: String,
                      accept_language: String,
                      is_mobile: Boolean,
                      created_at: Date,
                      updated_at: Date
                      )

object CompanyLogin {

  val resultSuccess = 1
  val resultNoCompany = 2
  val resultAccessDenied = 3
  val resultError = 4

  val resultCodes = HashMap(
    resultSuccess -> "SUCCESS",
    resultNoCompany -> "NO_COMPANY",
    resultAccessDenied -> "ACCESS_DENIED",
    resultError -> "ERROR")

  val successCodes = List(resultCodes(resultSuccess))
  val loginErrorCodes = List(resultCodes(resultNoCompany), resultCodes(resultAccessDenied))

  def save(user: User, companyLogin: CompanyLogin): String = {
    val resultCode = login(user, companyLogin)
    DB.withConnection(user.domainDataSource) { implicit connection =>
      SQL("""
          INSERT INTO company_logins(co_id, us_id, col_result_code, col_platform, col_ip_address, col_user_agent, col_accept_language, col_is_mobile)
          VALUES({companyId}, {userId}, {result_code}, {platform}, {ip_address}, {user_agent}, {accept_language}, {is_mobile})
          """).on(
          'companyId -> companyLogin.co_id,
          'userId -> companyLogin.us_id,
          'result_code -> resultCode,
          'platform -> companyLogin.platform,
          'ip_address -> companyLogin.ip_address,
          'user_agent -> companyLogin.user_agent,
          'accept_language -> companyLogin.accept_language,
          'is_mobile -> (if(companyLogin.is_mobile) 1 else 0)
        ).executeUpdate
    }
    resultCode
  }

  /*
      1 - Company not found
      2 - Access denied
      3 - Error

  * */

  def login(user: User, companyLogin: CompanyLogin) = {
    val company = Company.load(user, companyLogin.co_id).getOrElse(null)
    if(company == null)
      resultCodes(resultNoCompany)
    else if(!CompanyUser.existsWithCompanyAndUser(user, companyLogin.co_id, companyLogin.us_id))
      resultCodes(resultAccessDenied)
    else
      resultCodes(resultSuccess)
  }

  private val userParser: RowParser[CompanyLogin] = {
      get[Pk[Int]]("col_id") ~
      get[Int]("co_id") ~
      get[Int]("us_id") ~
      get[String]("col_result_code") ~
      get[String]("col_platform") ~
      get[String]("col_ip_address") ~
      get[String]("col_user_agent") ~
      get[String]("col_accept_language") ~
      get[Int]("col_is_mobile") ~
      get[Date]("created_at") ~
      get[Date]("updated_at") map {
      case col_id ~ co_id ~ us_id ~ col_result_code ~ col_platform ~ col_ip_address ~ col_user_agent ~ col_accept_language ~ col_is_mobile ~ created_at ~ updated_at =>
        CompanyLogin(col_id, co_id, us_id, col_result_code, col_platform, col_ip_address, col_user_agent, col_accept_language, col_is_mobile != 0, created_at, updated_at)
    }
  }

  def list(user: User): List[CompanyLogin] = {
    DB.withConnection(user.domainDataSource) { implicit connection =>
      SQL("SELECT * FROM company_logins").as(userParser *)
    }
  }

}

