package actions

import play.api.Logger
import play.api.mvc._
import scala.concurrent._
import play.filters.csrf._
import models.master.User

object PostAction extends ActionBuilder[Request] {
  def invokeBlock[A](request: Request[A], block: (Request[A]) => Future[SimpleResult]) = {
    // authentication code here
    Logger.info("in Post ...")
    Logger.info(s"contentType: ${request.contentType.toString}")
    Logger.info(s"request: ${request.body.toString}")
    block(request)
  }
  override def composeAction[A](action: Action[A]) = CSRFCheck(action)
}

object GetAction extends ActionBuilder[Request] {
  def invokeBlock[A](request: Request[A], block: (Request[A]) => Future[SimpleResult]) = {
    Logger.info("in Get ...")
    Logger.info(s"request: ${request.queryString.map { case (k,v) => k -> v.mkString }.mkString("?","&","")}")
    // authentication code here
    block(request)
  }
  override def composeAction[A](action: Action[A]) = CSRFAddToken(action)
}