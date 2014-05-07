package filters

import play.api._
import play.api.mvc._
import scala.concurrent.Future

object LoggingFilter extends Filter {
  def apply(f: (RequestHeader) => Future[SimpleResult])(rh: RequestHeader): Future[SimpleResult] = {
    Logger.info(s"request: ${rh.method} ${rh.uri}")
    f(rh)
  }
}

