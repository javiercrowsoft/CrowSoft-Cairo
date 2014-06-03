package filters

import play.api._
import play.api.mvc._
import scala.concurrent.Future
import play.api.libs.concurrent.Execution.Implicits.defaultContext

object LoggingFilter extends Filter {
  def apply(f: (RequestHeader) => Future[SimpleResult])(rh: RequestHeader): Future[SimpleResult] = {
    Logger.info(s"request: ${rh.method} ${rh.uri}")
    val startTime = System.currentTimeMillis
    f(rh).map { result =>
      val endTime = System.currentTimeMillis
      val requestTime = endTime - startTime
      Logger.info(s"${rh.method} ${rh.uri} " +
        s"took ${requestTime}ms and returned ${result.header.status}")
      result.withHeaders("Request-Time" -> requestTime.toString)
    }
  }
}

