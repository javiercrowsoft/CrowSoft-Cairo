package services

/**
 * Created by javier on 5/11/14.
 */

import play.api.data.validation._
import play.api.Logger

object PasswordValidation {

  val allNumbers = """\d*""".r
  val allLetters = """[A-Za-z]*""".r

  val passwordCheckConstraint: Constraint[String] = Constraint("constraints.passwordcheck")({
    plainText =>
      val errors = plainText match {
        case allNumbers() => Seq(ValidationError("Password is all numbers"))
        case allLetters() => Seq(ValidationError("Password is all letters"))
        case _ => Nil
      }
      if (errors.isEmpty) {
        Logger.debug("passwordCheckConstraint.valid")
        Valid
      } else {
        Logger.debug(s"passwordCheckConstraint.invalid ${errors.toString}")
        Invalid(errors)
      }
  })
}
