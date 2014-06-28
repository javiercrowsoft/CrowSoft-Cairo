package models

case class LoggedUser(user: User, isDesktop: Boolean) {
  val isLogged = { user != null }
}