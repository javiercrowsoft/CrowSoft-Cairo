package models.domain

import models.master.User
import services.db.DB
import anorm._
import anorm.SqlParser._
import anorm.~
import java.util.Date
import play.api.Play.current

case class BranchOffice(id: Int, name: String)
case class Person(id: Int, name: String)
case class CairoUser(branch: BranchOffice, person: Person, isExternal: Boolean)

case class CompanyUser(
                        masterUser: User,
                        company: Company,
                        database: Database) {
  val isLogged = { masterUser != null }
  val isLoggedIntoCompany = { company != null }
  lazy val masterUserId = { if(masterUser == null) 0 else masterUser.userId }
  lazy val domainCompanyId = { if(company == null) 0 else company.domainId}
  lazy val cairoCompanyId = { if(company == null) 0 else company.company_id}
  lazy val cairoCompanyName = { if(company == null) "" else company.company_name}
  lazy val cairoUser: CairoUser = {
    if(isLogged) CompanyUser.loadCairoUser(this).getOrElse(CompanyUser.emptyCairoUser)
    else CompanyUser.emptyCairoUser
  }
}

object CompanyUser {

  lazy val emptyCairoUser = CairoUser(null, null, false)

  private def throwError: Int = {
    throw new RuntimeException("Error when inserting company_users")
  }

  private def getId(id: Pk[Int]) = id match {
    case Id(id) => id
    case _ => throwError
  }

  def save(companyUser: CompanyUser): Int = {
    val coId = getId(companyUser.company.id)
    val usId = getId(companyUser.masterUser.id)
    save(companyUser.masterUser, coId, usId)
  }

  def save(masterUser: User, coId: Int, usId: Int): Int = {
    DB.withConnection(masterUser.domainDataSource) { implicit connection =>
      SQL("""
          INSERT INTO company_users(co_id, us_id)
          VALUES({co_id}, {us_id})
          """).on(
        'co_id -> coId,
        'us_id -> usId
      ).executeInsert().map(id => id.toInt).getOrElse(throwError)
    }
  }

  def removeUser(user: CompanyUser, usId: Int) = {
    val dbId = getId(user.database.id)
    DB.withConnection(user.masterUser.domainDataSource) { implicit connection =>
      SQL("""
          DELETE FROM company_users where us_id = {id} AND co_id IN (SELECT co_id FROM companies WHERE db_id = {dbId})
          """).on(
        'id -> usId,
        'dbId -> dbId
      ).executeUpdate
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

  private val cairoUserParser: RowParser[CairoUser] = {
    get[Option[Int]]("suc_id") ~
    get[Option[String]]("suc_nombre") ~
    get[Option[Int]]("prs_id") ~
    get[Option[String]]("prs_nombre") ~
    get[Int]("us_externo") map {
      case suc_id ~ suc_name ~ prs_id ~ prs_name ~ isExternal => {
        CairoUser(
          BranchOffice(suc_id.getOrElse(0), suc_name.getOrElse("")),
          Person(prs_id.getOrElse(0), prs_name.getOrElse("")),
          isExternal != 0)
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

  def loadCairoUser(user: CompanyUser) = {
    DB.withConnection(user.database.database) { implicit connection =>
      SQL(
        s"""SELECT u.suc_id, suc_nombre, u.prs_id, prs_nombre, us_externo
           | FROM usuario u
           | LEFT JOIN sucursal s ON u.suc_id = s.suc_id
           | LEFT JOIN persona p ON u.prs_id = p.prs_id
           | WHERE us_id = {id}""".stripMargin)
        .on('id -> user.masterUserId)
        .as(cairoUserParser.singleOpt)
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
