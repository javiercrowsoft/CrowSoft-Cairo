package controllers

import play.api._
import play.api.mvc._

object FileService extends Controller {

  lazy val resourcePath = {
    val repo = System.getenv("OPENSHIFT_REPO_DIR")
    Logger.info(repo)
    if(repo == null || repo.isEmpty) play.Play.application().path().getAbsolutePath() else repo
  }

  def getFile(path: String, file: String) = Action {
    Logger.info(resourcePath + path + "/" + file)
    Ok.sendFile(
      content = new java.io.File(resourcePath + path + "/" + file),
      inline = true
    )
  }

}