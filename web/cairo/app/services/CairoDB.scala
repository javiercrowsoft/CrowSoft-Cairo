package services.db

import scala.collection.JavaConversions._
import scala.collection.immutable.Map
import play.api.{Configuration, Logger}
import com.typesafe.config._
import play.api.Play.current
import models.master.{ApiDatabase, ApiApplication, Domain, User}
import models.domain.{Company, CompanyUser, Database}

object CairoDB {

  private lazy val cairoDblogStatements = {
    play.Play.application().configuration.getString("cairoDblogStatements")
  }

  var dataBases: List[String] = List()

  def connectDomainForUser(user: User): String = {
    if(user.active) {
      val domain = Domain.findByEmail(user.email).getOrElse(null)
      connectDataSource(
        domain.database,
        "org.postgresql.Driver",
        s"${domain.server}/${domain.database}",
        domain.username,
        domain.password)
      domain.database
    }
    else {
      Logger.error(s"user [${user.username}] isn't activated and CairoDB.connectDomainForUser was called")
      ""
    }
  }

  def connectCairoForUser(user: User, companyId: Int): CompanyUser = {
    if(user.active) {
      val company = Company.load(user, companyId).getOrElse(null)
      if(company != null) {
        val database = Database.load(user, company.db_id).getOrElse(null)
        connectDataSource(
          database.database,
          "org.postgresql.Driver",
          s"${database.server}/${database.database}",
          database.username,
          database.password)
        CompanyUser(user, company, database)
      }
      else {
        Logger.error(s"companyId [$companyId] wasn't found for user [${user.domainDataSource}}]")
        null
      }
    }
    else {
      Logger.error(s"user [${user.username}] isn't activated and CairoDB.connectCairoForUser was called")
      null
    }
  }

  def connectCairoForApp(application: ApiApplication): String = {
    if(application.active) {
      val database = ApiDatabase.load(application.dbId).getOrElse(null)
      connectDataSource(
        database.database,
        "org.postgresql.Driver",
        s"${database.server}/${database.database}",
        database.username,
        database.password)
      database.database
    }
    else {
      Logger.error(s"application [${application.name}] isn't activated and CairoDB.connectDomainForUser was called")
      ""
    }
  }

  def connectDataSource(dbName: String, driver: String, url: String, user: String, password: String) = {

    Logger.debug(s"addDataSource called with $dbName $driver $url $user and password")

    val key = s"$driver|$url|$user"
    if(!dataBases.contains(key)) {
      Logger.debug(s"registering $dbName")
      val config = createConfig(dbName, driver, url, user, password)
      this.synchronized {
        DB.addDataSource(config)
        dataBases = key :: dataBases
      }
    }
    // TODO: remove after some testing
    else {
      Logger.debug(s"database was already registered: $dbName")
    }
  }

  def createConfig(dbName: String, driver: String, url: String, user: String, password: String): Configuration = {
    val map: Map[String, String] = Map(
      "dbName" -> dbName,
      "driver" -> driver,
      "url" -> url,
      "user" -> user,
      "password" -> password,
      "logStatements" -> cairoDblogStatements
    )
    val javaMap = new java.util.HashMap[String, String](map)
    Configuration(ConfigFactory.parseMap(javaMap));
  }

}