package services

import play.api.mvc.Request

case class RequestOrigin(
                          remoteAddress: String,
                          acceptLanguages: String,
                          userAgent: UserAgent
                          )

object RequestOrigin {

  def parse[A](request: Request[A]): RequestOrigin = {
    RequestOrigin(
      request.remoteAddress,
      request.acceptLanguages.toString,
      UserAgent.parse(request)
    )
  }
}