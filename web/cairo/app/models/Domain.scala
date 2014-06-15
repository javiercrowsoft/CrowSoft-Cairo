package models

import anorm._
//import play.api.db.DB
import services.db.DB
import anorm.SqlParser._
import anorm.~
import java.util.Date
import play.api.Play.current
import services.{DateUtil, RequestOrigin, PasswordHash}

case class Domain(
                   id: Pk[Int] = NotAssigned,
                   server: String,
                   database: String,
                   username: String,
                   password: String,
                   locked: Boolean,
                   created_at: Date,
                   updated_at: Date
                   )

object Domain {

  def save(domain: Domain): Int = {
    DB.withConnection("master") { implicit connection =>
      SQL("""
          INSERT INTO domains(dm_server, dm_database, dm_username, dm_password, dm_locked)
          VALUES({server}, {database}, {username}, {password}, {locked})
          """).on(
          'server -> domain.server,
          'database -> domain.database,
          'username -> domain.username,
          'password -> domain.password,
          'locked -> (if(domain.locked) 1 else 0)
        ).executeInsert().map(id => id.toInt).getOrElse(throw new RuntimeException("Error when inserting domain"))
    }
  }

  private val domainParser: RowParser[Domain] = {
      get[Pk[Int]]("dm_id") ~
      get[String]("dm_server") ~
      get[String]("dm_database") ~
      get[String]("dm_username") ~
      get[String]("dm_password") ~
      get[Int]("dm_locked") ~
      get[Date]("created_at") ~
      get[Date]("updated_at") map {
      case dm_id ~ dm_server ~ dm_database ~ dm_username ~ dm_password ~ dm_locked ~ created_at ~ updated_at =>
        Domain(dm_id, dm_server, dm_database, dm_username, dm_password, dm_locked != 0, created_at, updated_at)
    }
  }

  def list: List[Domain] = {
    DB.withConnection("master") { implicit connection =>
      SQL("SELECT * FROM domains").as(domainParser *)
    }
  }

  def findByEmail(email: String): Option[Domain] = {
    loadWhere("dm_database = {database}", 'database -> getDatabaseFromEmail(email))
  }

  def existsWithEmail(email: String): Boolean = {
    countWhere("dm_database = {database}", 'database -> getDatabaseFromEmail(email)) > 0
  }

  def load(id: Int): Option[Domain] = {
    loadWhere("dm_id = {id}", 'id -> id)
  }

  def countWhere(where: String, args : scala.Tuple2[scala.Any, anorm.ParameterValue[_]]*): Long = {
    DB.withConnection("master") { implicit connection =>
      val row = SQL(s"SELECT count(*) as c FROM domains WHERE $where")
        .on(args: _*)
        .apply().head
      row[Long]("c")
    }
  }

  def loadWhere(where: String, args : scala.Tuple2[scala.Any, anorm.ParameterValue[_]]*) = {
    DB.withConnection("master") { implicit connection =>
      SQL(s"SELECT * FROM domains WHERE $where")
        .on(args: _*)
        .as(domainParser.singleOpt)
    }
  }

  def update(id: Int, domain: Domain) = {
    DB.withConnection("master") { implicit connection =>
      SQL("""
          UPDATE domains SET
          dm_server = {server},
          dm_database = {database},
          dm_username = {username},
          dm_password = {password},
          dm_locked = {locked}
          WHERE dm_id = {id}
          """).on(
          'id -> id,
          'server -> domain.server,
          'database -> domain.database,
          'username -> domain.username,
          'password -> domain.password,
          'locked -> (if(domain.locked) 1 else 0)
        ).executeUpdate
    }
  }

  def delete(id: Int) = {
    DB.withConnection("master") { implicit connection =>
      SQL(""" 
          DELETE FROM domains where dm_id = {id}
          """).on(
          'id -> id
        ).executeUpdate
    }
  }

  def getDatabaseFromEmail(email: String) = {
    email.substring(email.indexOf("@")+1).replaceAll("[.]","_") + "_domain"
  }

}