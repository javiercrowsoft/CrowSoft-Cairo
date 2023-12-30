package settings

import play.api.Play

object Settings {

  val config = Play.current.configuration

  val siteBaseURL = {
    config.getString("siteBaseURL").getOrElse(throw new RuntimeException("siteBaseURL needs to be set in application.conf in order to send registration emails"))
  }

  val registrationEmailFrom = {
    config.getString("registrationEmailFrom").getOrElse("registration@crowsoft.com.ar")
  }

  val registrationSubject = {
    config.getString("registrationSubject").getOrElse("Thank you for registering into CrowSoft Cairo")
  }

  val registrationSubjectForApplication = {
    config.getString("registrationSubject").getOrElse("Thank you for registering an application into CrowSoft Cairo")
  }

  val resetPasswordSubject = {
    config.getString("resetPasswordSubject").getOrElse("You have requested to reset your CrowSoft Cairo password")
  }

  val resetPasswordSubjectForApplication = {
    config.getString("resetPasswordSubject").getOrElse("You have requested to reset your application CrowSoft Cairo password")
  }

}