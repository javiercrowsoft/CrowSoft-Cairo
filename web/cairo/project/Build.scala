import sbt._
import Keys._
import play.Project._

object ApplicationBuild extends Build {

  val appName = "myApp"
  val appVersion = "0.1"

  val appDependencies = Seq(
    "postgresql" % "postgresql" % "9.1-901-1.jdbc4")

  val main = play.Project(appName, appVersion, appDependencies)
}
