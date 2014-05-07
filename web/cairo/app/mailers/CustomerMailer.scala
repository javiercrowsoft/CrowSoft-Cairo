package mailers

/**
 * User: javier
 * Date: 5/7/14
 * Time: 1:54 PM
 */

import play.api._
import play.api.Configuration._
import services._
import models.UserSignUp

object CustomerMailer {

  def sendRegistration(user: UserSignUp) = {
    val config = Play.current.configuration
    val siteBaseURL = config.getString("siteBaseURL").getOrElse(throw new RuntimeException("siteBaseURL needs to be set in application.conf in order to send registration emails"))
    Mailer.sendEmail(
      config.getString("registrationEmailFrom").getOrElse("Thank you for registering to CrowSoft Cairo"),
      user.email,
      config.getString("registrationSubject").getOrElse("registration@crowsoft.com.ar"),
      views.txt.mailers.registration(siteBaseURL, user.code).toString,
      views.html.mailers.registration(siteBaseURL, user.code).toString
    )
  }
}
