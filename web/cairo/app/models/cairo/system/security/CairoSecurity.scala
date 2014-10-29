package models.cairo.system.security

import models.domain.CompanyUser

object CairoSecurity {

  def hasPermissionTo(action: Int)(user: CompanyUser): Boolean = {
    hasPermissionTo(user, action)
  }

  def hasPermissionTo(user: CompanyUser, action: Int): Boolean = {
    false
  }

}