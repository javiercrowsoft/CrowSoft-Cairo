package models.domain

import models.User

case class CompanyUser(user: User, company: Company, database: Database) {
  val isLogged = { user != null }
  val isLoggedIntoCompany = { company != null }
}