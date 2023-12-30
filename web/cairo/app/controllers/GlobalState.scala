package controllers

import play.api.libs.json.{JsObject, JsValue, Json}
import play.api.mvc._
import actions._
import models.master.{ApiApplication, ApiLoginData, ApiApplicationLogin, LoggedApplication, LoggedUser, User}
import models.domain.{Company, CompanyUser}
import services.db.CairoDB
import services.RequestOrigin
import play.api.Logger
import play.api.data.format.Formatter
import play.api.data.FormError

trait ProvidesUser {

  implicit def loggedUser[A](implicit request: Request[A]): LoggedUser = {
    Logger.debug("loggedUser called")
    val userId = request.session.get("user").getOrElse("")
    def getUser() : LoggedUser = {
      if(userId.isEmpty)
        LoggedUser(null, false)
      else
        LoggedUser(User.load(userId.toInt).getOrElse(null), request.path.startsWith("/desktop"))
    }
    getUser
  }

  implicit def companyUser[A](implicit request: Request[A]): CompanyUser = {
    Logger.debug("companyUser called")
    val user = loggedUser(request)
    if(user.user != null) {
      val companyId = request.session.get("company").getOrElse("")
      def getCompanyUser(): CompanyUser = {
        if(companyId.isEmpty)
          CompanyUser(null, null, null)
        else
          CairoDB.connectCairoForUser(user.user, companyId.toInt)
      }
      getCompanyUser
    }
    else
      CompanyUser(null, null, null)
  }

  implicit def requestOrigin[A](implicit request: Request[A]): RequestOrigin = {
    Logger.debug("requestOrigin called")
    RequestOrigin.parse(request)
  }

}

object Global {

  /**
   * Default formatter for the `Double` type.
   */
  implicit def doubleFormat: Formatter[Double] = new Formatter[Double] {

    override val format = Some("format.real", Nil)

    def bind(key: String, data: Map[String, String]) =
      parsing(_.toDouble, "error.real", Nil)(key, data)

    def unbind(key: String, value: Double) = Map(key -> value.toString)
  }

  /**
   * Default formatter for the `String` type.
   */
  implicit def stringFormat: Formatter[String] = new Formatter[String] {
    def bind(key: String, data: Map[String, String]) = data.get(key).toRight(Seq(FormError(key, "error.required", Nil)))
    def unbind(key: String, value: String) = Map(key -> value)
  }

  /**
   * Helper for formatters binders
   * @param parse Function parsing a String value into a T value, throwing an exception in case of failure
   * @param error Error to set in case of parsing failure
   * @param key Key name of the field to parse
   * @param data Field data
   */
  private def parsing[T](parse: String => T, errMsg: String, errArgs: Seq[Any])(key: String, data: Map[String, String]): Either[Seq[FormError], T] = {
    stringFormat.bind(key, data).right.flatMap { s =>
      util.control.Exception.allCatch[T]
        .either(parse(s))
        .left.map(e => Seq(FormError(key, errMsg, errArgs)))
    }
  }

  implicit def getParamsFromJsonRequest(implicit request:Request[AnyContent]): Map[String, JsValue]  = request.body.asJson match {
    case Some(fields) => fields.as[Map[String, JsValue]]
    case _ => Map.empty
  }

  implicit def getParamsJsonRequestFor(
     key: String, params: Map[String, JsValue]): Map[String, JsValue] = params.filterKeys(_.equals(key))

  implicit def preprocessFormParams(fields: List[String], group: String, params: Map[String, JsValue]): Map[String, JsValue] = {
    val filteredParams = params.filterKeys(fields.contains(_))
    if(group.isEmpty)
      filteredParams
    else
      Map(group -> JsObject(filteredParams.toSeq))
  }

  def getJsValueAsMap(list: Map[String, JsValue]): Map[String, JsValue] = list.toList match {
    case (key: String, jsValue: JsValue) :: t => jsValue.as[Map[String, JsValue]]
    case _ => Map.empty
  }
}

object LoggedResponse extends Controller {

  def getAction[A](request: Request[A], f: (User) => play.api.mvc.SimpleResult): play.api.mvc.SimpleResult = {
    val userId = request.session.get("user").getOrElse("")
    if(userId.isEmpty)
      Unauthorized(views.html.errorpages.unauthorized("CrowSoft Cairo - Unauthorized"))
    else {
      val user = User.load(userId.toInt).getOrElse(null)
      if(user != null) {
        val userMustBeActivated = !request.uri.toString.startsWith("/registration")
        Logger.debug(s"userMustBeActivated: $userMustBeActivated")
        if(!user.active && userMustBeActivated) {
          Redirect(routes.Registration.mustActivate)
        }
        else {
          f(user)
        }
      }
      else
        NotFound
    }
  }
}

object LoggedIntoCompanyResponse extends Controller {

  def getAction[A](request: Request[A], f: (CompanyUser) => play.api.mvc.SimpleResult): play.api.mvc.SimpleResult = {
    LoggedResponse.getAction(request, { user =>
      val companyId = request.session.get("company").getOrElse("")
      if(companyId.isEmpty)
        Unauthorized(views.html.errorpages.unauthorized("CrowSoft Cairo - Unauthorized"))
      else {
        val companyUser = CairoDB.connectCairoForUser(user, companyId.toInt)
        if(companyUser != null) {
          f(companyUser)
        }
        else
          NotFound
      }
    })
  }

  def getAction[A](request: Request[A], hasPermission: (CompanyUser) => Boolean, f: (CompanyUser) => play.api.mvc.SimpleResult): play.api.mvc.SimpleResult = {
    LoggedIntoCompanyResponse.getAction(request, { user =>
      if(hasPermission(user))
        f(user)
      else
        Unauthorized(views.html.errorpages.unauthorized("CrowSoft Cairo - Unauthorized"))
    })
  }
}

object ApiApplicationLoggedResponse extends Controller {

  def getAction[A](request: Request[A], hasPermission: (ApiApplication) => Boolean, f: (ApiApplication) => play.api.mvc.SimpleResult): play.api.mvc.SimpleResult = {
    loggedApplication(request, { application =>
      if(hasPermission(application))
        f(application)
      else
        Unauthorized(views.html.errorpages.unauthorized("CrowSoft Cairo - Unauthorized"))
    })
  }

  def loggedApplication[A](implicit request: Request[A], f: (ApiApplication) => play.api.mvc.SimpleResult): play.api.mvc.SimpleResult = {
    Logger.debug("loggedApplication called")
    val apiKey = request.headers.get("Api-Key").getOrElse("")
    val secret = request.headers.get("Secret").getOrElse("")
    login(RequestOrigin.parse(request), ApiLoginData(apiKey, secret),
      { application =>
        CairoDB.connectCairoForApp(application)
        f(application)
      })
  }

  def login(requestOrigin: RequestOrigin, loginForm: ApiLoginData, f: (ApiApplication) => play.api.mvc.SimpleResult) = {
    val userAgent = requestOrigin.userAgent

    val success = ApiLoginData.save(
      loginForm,
      userAgent.platform,
      requestOrigin.remoteAddress,
      userAgent.userAgent,
      requestOrigin.acceptLanguages,
      userAgent.isMobile)

    if(ApiApplicationLogin.successCodes.contains(success)) {
      f(ApiApplication.findByApiKey(loginForm.apiKey).get)
    }
    else if(ApiApplicationLogin.loginErrorCodes.contains(success))
      Unauthorized(Json.obj("error" -> "Api key or secret invalid"))
    else if(success == ApiApplicationLogin.resultCodes(ApiApplicationLogin.resultLocationBlocked))
      Unauthorized(Json.obj("error" -> "Location is locked"))
    else if(success == ApiApplicationLogin.resultCodes(ApiApplicationLogin.resultLocked))
      Unauthorized(Json.obj("error" -> "Application is locked"))
    else
      Unauthorized(Json.obj("error" -> "There was an error when trying to sign in you into the system. Please try again."))
  }
}

object SessionStatus {

  def isLoggedUser[A](request: Request[A]) = {
    Logger.debug(s"user in session is empty: ${request.session.get("user").getOrElse("").isEmpty}")
    !request.session.get("user").getOrElse("").isEmpty
  }
  def isLoggedCompanyUser[A](request: Request[A]) = {
    Logger.debug(s"company in session is empty: ${request.session.get("company").getOrElse("").isEmpty}")
    !request.session.get("company").getOrElse("").isEmpty
  }

  def isDesktop[A](request: Request[A]) = {
    Logger.debug(s"user in session is empty: ${request.path}")
    request.path.startsWith("/desktop")
  }

}

object JsonUtil {
  val emptyJson = Json.toJson("")
}