package controllers

import play.api.mvc._

object FileService extends Controller {

  def getFile(path: String, file: String) = Action {
    Ok.sendFile(
      content = new java.io.File(play.Play.application().path().getAbsolutePath() + path + "/" + file),
      inline = true
    )
  }

}