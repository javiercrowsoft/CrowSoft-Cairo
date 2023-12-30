package models.master

import play.api.Logger
import anorm._
import anorm.SqlParser._
import anorm.~
import services.db.DB
import models.master.User
import java.util.Date
import play.api.Play.current

case class ApiDatabase(
                     id: Pk[Int] = NotAssigned,
                     corporation: String,
                     server: String,
                     database: String,
                     username: String,
                     password: String,
                     created_at: Date,
                     updated_at: Date
                   )

object ApiDatabase {

  def save(application: ApiApplication, database: ApiDatabase): Int = {
    DB.withConnection("master") { implicit connection =>
      SQL("""
          INSERT INTO databases(db_server, db_corporation, db_database, db_username, db_password)
          VALUES({corporation}, {server}, {database}, {username}, {password})
          """).on(
        'corporation -> database.corporation,
        'server -> database.server,
        'database -> database.database,
        'username -> database.username,
        'password -> database.password
      ).executeInsert().map(id => id.toInt).getOrElse(throw new RuntimeException(s"Error when inserting database ${database.database} on domain master"))
    }
  }

  private val databaseParser: RowParser[ApiDatabase] = {
    get[Pk[Int]]("db_id") ~
      get[String]("db_corporation") ~
      get[String]("db_server") ~
      get[String]("db_database") ~
      get[String]("db_username") ~
      get[String]("db_password") ~
      get[Date]("created_at") ~
      get[Date]("updated_at") map {
      case db_id ~ db_corporation ~ db_server ~ db_database ~ db_username ~ db_password ~ created_at ~ updated_at =>
        ApiDatabase(db_id, db_corporation, db_server, db_database, db_username, db_password, created_at, updated_at)
    }
  }

  def list(application: ApiApplication): List[ApiDatabase] = {
    Logger.debug(s"application.cairoDataSource: ${application.cairoDataSource}")
    DB.withConnection("master") { implicit connection =>
      SQL("SELECT * FROM databases").as(databaseParser *)
    }
  }

  def load(id: Int): Option[ApiDatabase] = {
    loadWhere("db_id = {id}", 'id -> id)
  }

  def loadWhere(where: String, args : scala.Tuple2[scala.Any, anorm.ParameterValue[_]]*) = {
    DB.withConnection("master") { implicit connection =>
      SQL(s"SELECT * FROM databases WHERE $where")
        .on(args: _*)
        .as(databaseParser.singleOpt)
    }
  }

  def update(id: Int, database: ApiDatabase) = {
    DB.withConnection("master") { implicit connection =>
      SQL("""
          UPDATE databases SET
          db_server = {server},
          db_corporation = {corporation},
          db_database = {database},
          db_username = {username},
          db_password = {password}
          WHERE db_id = {id}
          """).on(
        'id -> id,
        'corporation -> database.corporation,
        'server -> database.server,
        'database -> database.database,
        'username -> database.username,
        'password -> database.password
      ).executeUpdate
    }
  }

  def delete(id: Int) = {
    DB.withConnection("master") { implicit connection =>
      SQL("""
          DELETE FROM databases where db_id = {id}
          """).on(
        'id -> id
      ).executeUpdate
    }
  }

}

