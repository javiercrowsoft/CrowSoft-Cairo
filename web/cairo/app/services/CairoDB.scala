package services.db

import scala.collection.JavaConversions._
import scala.collection.immutable.Map
import play.api.{Logger, Configuration}
import com.typesafe.config._
import play.api.Play.current
import models.{ User, Domain }

object CairoDB {

  var dataBases: List[String] = List()

  def connectDomainForUser(user: User) = {
    if(user.active) {
      val domain = Domain.findByEmail(user.email).getOrElse(null)
      connectDataSource(
        domain.database,
        "org.postgresql.Driver",
        s"${domain.server}/${domain.database}",
        domain.username,
        domain.password)
      user.setDomainDataSource(domain.database)
    }
    else {
      Logger.error(s"user [${user.username}] isn't activated and CairoDB.connectDomainForUser was called")
    }
  }

  def connectDataSource(dbName: String, driver: String, url: String, user: String, password: String) = {

    Logger.debug(s"addDataSource called with $dbName $driver $url $user and password")

    val key = s"$driver|$url|$user"
    if (!dataBases.contains(key)) {
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
      "password" -> password
    )
    val javaMap = new java.util.HashMap[String, String](map)
    Configuration(ConfigFactory.parseMap(javaMap));
  }

}