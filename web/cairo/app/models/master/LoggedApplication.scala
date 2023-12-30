package models.master

case class LoggedApplication(application: ApiApplication) {
  val isLogged = { application != null }
}