package services

/**
 * User: javier
 * Date: 5/7/14
 * Time: 12:17 PM
 */
import com.typesafe.plugin._
import play.api.Play.current

object Mailer {


  //sends html
  // mail.sendHtml("<html>html</html>" )
  //sends text/text
  // mail.send( "text" )
  //sends both text and html

  def sendTest() = {
    val mail = use[MailerPlugin].email
    mail.setSubject("mailer")
    mail.addRecipient("CrowSoft Cairo Mail Service <noreply@crowsoft.com.ar>")
    //or use a list
    mail.addBcc(List("CrowSoft Cairo Mail BCC <bcc@crowsoft.com.ar>"):_*)
    mail.addFrom("CrowSoft Cairo Mail Service <crowsoft.cairo.mail.service@crowsoft.com.ar>")
    mail.send( "text", "<html><body><h1>Html text</h1></body></html>")
  }

  def sendEmail(from: String, to: String, subject: String, text: String, html: String) = {
    val mail = use[MailerPlugin].email
    mail.setSubject(subject)
    mail.addRecipient(to)
    //or use a list
    mail.addBcc(List("CrowSoft Cairo Mail BCC <bcc@crowsoft.com.ar>"):_*)
    mail.addFrom(from)
    mail.send(text, html)
  }
}
