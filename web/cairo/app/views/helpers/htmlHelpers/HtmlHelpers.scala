package views.html.helper

import views.html.helpers.htmlHelpers.simpleInputTextFieldConstructor

package object htmlHelpers {

  implicit val simpleInputText = FieldConstructor(simpleInputTextFieldConstructor.f)

}
