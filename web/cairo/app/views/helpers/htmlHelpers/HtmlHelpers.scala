package views.html.helper

import views.html.helpers.htmlHelpers.simpleInputTextFieldConstructor
import views.html.helpers.htmlHelpers.menuItemConstructor

package object htmlHelpers {

  implicit val simpleInputText = FieldConstructor(simpleInputTextFieldConstructor.f)

  def menuItem(menu: models.cairo.MenuItem) = { menuItemConstructor(menu, true, false) }

}
