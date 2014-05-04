import play.api._
import play.api.mvc._
import filters.LoggingFilter
import play.filters.csrf._
import play.filters.gzip.GzipFilter

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
}
