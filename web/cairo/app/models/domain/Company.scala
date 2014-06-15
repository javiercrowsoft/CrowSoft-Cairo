package models.domain

import play.api.Logger
import anorm._
import anorm.SqlParser._
import anorm.~
import services.db.DB
import models.User
import java.util.Date
import play.api.Play.current

case class Company(
                 id: Pk[Int] = NotAssigned,
                 db_id: Int,
                 company_id: Int,
                 company_name: String,
                 created_at: Date,
                 updated_at: Date
                 )

object Company {

  def save(user: User, company: Company): Int = {
    DB.withConnection(user.domainDataSource) { implicit connection =>
      SQL("""
          INSERT INTO companies(db_id, co_company_id, co_company_name)
          VALUES({db_id}, {company_id}, {company_name})
          """).on(
          'db_id -> company.db_id,
          'company_id -> company.company_id,
          'company_name -> company.company_name
        ).executeInsert().map(id => id.toInt).getOrElse(throw new RuntimeException(s"Error when inserting company ${company.company_name} on domain [${user.domainDataSource}]"))
    }
  }

  private val companyParser: RowParser[Company] = {
      get[Pk[Int]]("co_id") ~
      get[Int]("db_id") ~
      get[Int]("co_company_id") ~
      get[String]("co_company_name") ~
      get[Date]("created_at") ~
      get[Date]("updated_at") map {
      case co_id ~ db_id ~ co_company_id ~ co_company_name ~ created_at ~ updated_at =>
        Company(co_id, db_id, co_company_id, co_company_name, created_at, updated_at)
    }
  }

  def list(user: User): List[Company] = {
    Logger.debug(s"user.domainDataSource: ${user.domainDataSource}")
    DB.withConnection(user.domainDataSource) { implicit connection =>
      SQL("SELECT * FROM companies").as(companyParser *)
    }
  }

  def load(user: User, id: Int): Option[Company] = {
    loadWhere(user, "co_id = {id}", 'id -> id)
  }

  def loadWhere(user: User, where: String, args : scala.Tuple2[scala.Any, anorm.ParameterValue[_]]*) = {
    DB.withConnection(user.domainDataSource) { implicit connection =>
      SQL(s"SELECT * FROM companies WHERE $where")
        .on(args: _*)
        .as(companyParser.singleOpt)
    }
  }

  def update(user: User, id: Int, company: Company) = {
    DB.withConnection(user.domainDataSource) { implicit connection =>
      SQL("""
          UPDATE companies SET
          co_company_name = {company_name}
          WHERE co_id = {id}
          """).on(
          'id -> id,
          'company_name -> company.company_name
        ).executeUpdate
    }
  }

  def delete(user: User, id: Int) = {
    DB.withConnection(user.domainDataSource) { implicit connection =>
      SQL("""
          DELETE FROM companies where co_id = {id}
          """).on(
          'id -> id
        ).executeUpdate
    }
  }

}

