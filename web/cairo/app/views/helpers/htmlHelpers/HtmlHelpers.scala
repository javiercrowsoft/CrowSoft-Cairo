package views.html.helper

import views.html.helpers.htmlHelpers.simpleInputTextFieldConstructor
import views.html.helpers.htmlHelpers.menuItemConstructor
import views.html.helpers.htmlHelpers.menuItemMobileConstructor

package object htmlHelpers {

  implicit val simpleInputText = FieldConstructor(simpleInputTextFieldConstructor.f)

  def menuItem(menu: models.cairo.system.MenuItem) = { menuItemConstructor(menu, true, false) }
  def menuItemMobile(menu: models.cairo.system.MenuItem) = { menuItemMobileConstructor(menu, "mainMenu") }

}
