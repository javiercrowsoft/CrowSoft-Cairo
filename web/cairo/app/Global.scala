import play.api._
import play.api.mvc._
import filters.LoggingFilter
import play.filters.csrf._
import play.filters.gzip.GzipFilter
import play.api.mvc.Results._
import scala.concurrent.Future

object Global extends GlobalSettings {
  
  override def onStart(app: Application) {
    Logger.info("Application has started")
  }

  override def onStop(app: Application) {
    Logger.info("Application shutdown...")
  }

  override def doFilter(action:EssentialAction): EssentialAction = {
    CSRFFilter().apply(next = Filters(super.doFilter(action), LoggingFilter, new GzipFilter()))
  }

  // 404 - page not found error
  override def onHandlerNotFound(request: RequestHeader): Future[SimpleResult] = {
    Logger.error("*")
    Logger.error(s"404 Not Found - request: ${request.method} ${request.uri}")
    Logger.error("*")
    Future.successful(NotFound(views.html.errorpages.notFound(request)))
  }

}
