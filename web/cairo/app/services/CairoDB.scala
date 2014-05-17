package services.db

import scala.collection.JavaConversions._
import scala.collection.immutable.Map
import play.api.Configuration
import com.typesafe.config._
import play.api.Play.current
import models.{ User, Domain }

object CairoDB {

  var dataBases: List[String] = List()

  def connectDomainForUser(user: User) = {
    val domain = Domain.findByEmail(user.email).getOrElse(null)
    connectDataSource(
      domain.database,
      "org.postgresql.Driver",
      s"${domain.server}/${domain.database}",
      domain.username,
      domain.password)
  }

  def connectDataSource(dbName: String, driver: String, url: String, user: String, password: String) = {
    val key = s"$driver|$url|$user"
    if (!dataBases.contains(key)) {
      val config = createConfig(dbName, driver, url, user, password)
      DB.addDataSource(config)
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