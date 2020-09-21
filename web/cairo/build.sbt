name := "cairo"

version := "1.0-SNAPSHOT"

libraryDependencies ++= Seq(
  jdbc,
  anorm,
  cache,
  filters
)

play.Project.playScalaSettings

play.Keys.lessEntryPoints <<= baseDirectory(_ / "app" / "assets" / "stylesheets" ** "main.less")

javacOptions ++= Seq("-source", "1.7", "-target", "1.7")

resolvers += "Typesafe Server" at "https://repo.typesafe.com/typesafe/releases"
