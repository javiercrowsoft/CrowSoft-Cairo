package controllers

import play.api._
import play.api.mvc._

object FileService extends Controller {

  lazy val resourcePath =  play.Play.application().path().getAbsolutePath()

  def getFile(path: String, file: String) = Action {
    Logger.info(resourcePath + path + "/" + file)
    Ok.sendFile(
      content = new java.io.File(resourcePath + path + "/" + file),
      inline = true
    )
  }

}