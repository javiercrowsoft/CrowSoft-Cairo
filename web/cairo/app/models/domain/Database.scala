package models.domain

import play.api.Logger
import anorm._
import anorm.SqlParser._
import anorm.~
import services.db.DB
import models.master.User
import java.util.Date
import play.api.Play.current

case class Database(
                     id: Pk[Int] = NotAssigned,
                     corporation: String,
                     server: String,
                     database: String,
                     username: String,
                     password: String,
                     created_at: Date,
                     updated_at: Date
                    )

object Database {

  def save(user: User, database: Database): Int = {
    DB.withConnection(user.domainDataSource) { implicit connection =>
      SQL("""
          INSERT INTO databases(db_server, db_corporation, db_database, db_username, db_password)
          VALUES({corporation}, {server}, {database}, {username}, {password})
          """).on(
          'corporation -> database.corporation,
          'server -> database.server,
          'database -> database.database,
          'username -> database.username,
          'password -> database.password
        ).executeInsert().map(id => id.toInt).getOrElse(throw new RuntimeException(s"Error when inserting database ${database.database} on domain [${user.domainDataSource}]"))
    }
  }

  private val databaseParser: RowParser[Database] = {
      get[Pk[Int]]("db_id") ~
      get[String]("db_corporation") ~
      get[String]("db_server") ~
      get[String]("db_database") ~
      get[String]("db_username") ~
      get[String]("db_password") ~
      get[Date]("created_at") ~
      get[Date]("updated_at") map {
      case db_id ~ db_corporation ~ db_server ~ db_database ~ db_username ~ db_password ~ created_at ~ updated_at =>
        Database(db_id, db_corporation, db_server, db_database, db_username, db_password, created_at, updated_at)
    }
  }

  def list(user: User): List[Database] = {
    Logger.debug(s"user.domainDataSource: ${user.domainDataSource}")
    DB.withConnection(user.domainDataSource) { implicit connection =>
      SQL("SELECT * FROM databases").as(databaseParser *)
    }
  }

  def load(user: User, id: Int): Option[Database] = {
    loadWhere(user, "db_id = {id}", 'id -> id)
  }

  def loadWhere(user: User, where: String, args : scala.Tuple2[scala.Any, anorm.ParameterValue[_]]*) = {
    DB.withConnection(user.domainDataSource) { implicit connection =>
      SQL(s"SELECT * FROM databases WHERE $where")
        .on(args: _*)
        .as(databaseParser.singleOpt)
    }
  }

  def update(user: User, id: Int, database: Database) = {
    DB.withConnection(user.domainDataSource) { implicit connection =>
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

  def delete(user: User, id: Int) = {
    DB.withConnection(user.domainDataSource) { implicit connection =>
      SQL("""
          DELETE FROM databases where db_id = {id}
          """).on(
          'id -> id
        ).executeUpdate
    }
  }

}

