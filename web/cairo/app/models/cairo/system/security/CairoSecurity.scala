package models.cairo.system.security

import models.domain.CompanyUser
import models.master.ApiApplication

object CairoSecurity {

  def hasPermissionTo(getAction: (CompanyUser) => Int)(user: CompanyUser): Boolean = {
    hasPermissionTo(user, getAction(user))
  }

  def hasPermissionTo(action: Int)(user: CompanyUser): Boolean = {
    hasPermissionTo(user, action)
  }

  def hasPermissionTo(user: CompanyUser, action: Int): Boolean = {
    true
  }

  def appHasPermissionTo(action: Int)(application: ApiApplication): Boolean = {
    true
  }

}