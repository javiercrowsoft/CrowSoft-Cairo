package mailers

/**
 * User: javier
 * Date: 5/7/14
 * Time: 1:54 PM
 */

import play.api._
import play.api.Configuration._
import services._
import models.master.User
import models.master.ApiApplication
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

  def sendRegistration(application: ApiApplication) = {
    Mailer.sendEmail(
      Settings.registrationEmailFrom,
      application.email,
      Settings.registrationSubjectForApplication,
      views.txt.mailers.registration(Settings.siteBaseURL, application.name).toString,
      views.html.mailers.registration(Settings.siteBaseURL, application.name).toString
    )
  }

  def sendResetPassword(user: User, token: String) = {
    Mailer.sendEmail(
      Settings.registrationEmailFrom,
      user.email,
      Settings.resetPasswordSubject,
      views.txt.mailers.resetPassword(Settings.siteBaseURL, token).toString,
      views.html.mailers.resetPassword(Settings.siteBaseURL, token).toString
    )
  }

  def sendResetPassword(application: ApiApplication, token: String) = {
    Mailer.sendEmail(
      Settings.registrationEmailFrom,
      application.email,
      Settings.resetPasswordSubject,
      views.txt.mailers.resetPassword(Settings.siteBaseURL, token).toString,
      views.html.mailers.resetPassword(Settings.siteBaseURL, token).toString
    )
  }

}
