package settings

import play.api.Play

object Settings {

  val config = Play.current.configuration

  val siteBaseURL = {
    config.getString("siteBaseURL").getOrElse(throw new RuntimeException("siteBaseURL needs to be set in application.conf in order to send registration emails"))
  }

  val registrationEmailFrom = {
    config.getString("registrationEmailFrom").getOrElse("Thank you for registering to CrowSoft Cairo")
  }

  val registrationSubject = {
    config.getString("registrationSubject").getOrElse("registration@crowsoft.com.ar")
  }

}