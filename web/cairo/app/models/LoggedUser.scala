package models

case class LoggedUser(user: User) {
  val isLogged = { user != null }
}