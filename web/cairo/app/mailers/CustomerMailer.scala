package mailers

/**
 * User: javier
 * Date: 5/7/14
 * Time: 1:54 PM
 */

import play.api._
import play.api.Configuration._
import services._
import models.User
import settings._

object CustomerMailer {

  def sendRegistration(user: User) = {
    Mailer.sendEmail(
      Settings.registrationEmailFrom,
      user.email,
      Settings.registrationSubject,
      views.txt.mailers.registration(Settings.siteBaseURL, user.code).toString,
      views.html.mailers.registration(Settings.siteBaseURL, user.code).toString
    )
  }
}
