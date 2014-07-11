package models.master

case class LoggedUser(user: User, isDesktop: Boolean) {
  val isLogged = { user != null }
}