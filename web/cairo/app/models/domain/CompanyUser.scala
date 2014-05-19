package models.domain

import models.User
import services.db.DB
import anorm._
import anorm.SqlParser._
import anorm.~
import services.{DateUtil, RequestOrigin}

case class CompanyUser(user: User, company: Company, database: Database) {
  val isLogged = { user != null }
  val isLoggedIntoCompany = { company != null }
}

object CompanyUser {

  def save(companyUser: CompanyUser): Int = {
    DB.withConnection(companyUser.user.domainDataSource) { implicit connection =>
      SQL("""
          INSERT INTO company_users(co_id, us_id)
          VALUES({co_id}, {us_id})
          """).on(
          'co_id -> companyUser.company.id,
          'us_id -> companyUser.user.id
        ).executeInsert().map(id => id.toInt).getOrElse(throw new RuntimeException("Error when inserting company_users"))
    }
  }

  private val companyUserParser: RowParser[CompanyUser] = {
    get[Pk[Int]]("cu_id") ~
      get[Int]("co_id") ~
      get[Int]("us_id") ~
      get[Date]("created_at") map {
      case cu_id ~ co_id ~ us_id ~ created_at => {
        val user = User.load(us_id).getOrElse(null)
        val company = if(user != null) Company.load(user, co_id).getOrElse(null) else null
        val database = if(company != null) Database.load(user, company.db_id).getOrElse(null) else null
        CompanyUser(user, company, database)
      }
    }
  }

  def list(user: User): List[CompanyUser] = {
    DB.withConnection(user.domainDataSource) { implicit connection =>
      SQL("SELECT * FROM company_users").as(companyUserParser *)
    }
  }

  def findByCompanyAndUser(user: User, companyId: Int, userId: Int): Option[CompanyUser] = {
    loadWhere(user, "co_id = {co_id} and us_id = {us_id}", 'co_id -> companyId, 'us_id -> userId)
  }

  def existsWithCompanyAndUser(user: User, companyId: Int, userId: Int): Boolean = {
    countWhere(user, "co_id = {co_id} and us_id = {us_id}", 'co_id -> companyId, 'us_id -> userId) > 0
  }

  def load(user: User, id: Int): Option[CompanyUser] = {
    loadWhere(user, "cu_id = {id}", 'id -> id)
  }

  def countWhere(user: User, where: String, args : scala.Tuple2[scala.Any, anorm.ParameterValue[_]]*): Long = {
    DB.withConnection(user.domainDataSource) { implicit connection =>
      val row = SQL(s"SELECT count(*) as c FROM company_users WHERE $where")
        .on(args: _*)
        .apply().head
      row[Long]("c")
    }
  }

  def loadWhere(user: User, where: String, args : scala.Tuple2[scala.Any, anorm.ParameterValue[_]]*) = {
    DB.withConnection(user.domainDataSource) { implicit connection =>
      SQL(s"SELECT * FROM company_users WHERE $where")
        .on(args: _*)
        .as(companyUserParser.singleOpt)
    }
  }

  def delete(user: User, id: Int) = {
    DB.withConnection(user.domainDataSource) { implicit connection =>
      SQL(""" 
          DELETE FROM company_users where cu_id = {id}
          """).on(
          'id -> id
        ).executeUpdate
    }
  }

}
