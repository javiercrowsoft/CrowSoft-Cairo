package controllers.logged.system.reports

import controllers._
import formatters.json.DateFormatter
import models.cairo.modules.general.ProductoProveedor
import play.api.mvc._
import play.api.data._
import play.api.data.Forms._
import actions._
import play.api.Logger
import play.api.libs.json._
import models.cairo.modules.system.reports._
import models.cairo.system.security.CairoSecurity
import models.cairo.system.database.{Recordset, DBHelper}

case class ReportParamData(
                          id: Int,
                          value: String,
                          visible: Boolean,
                          infpId: Int
                          )

case class ReportData(
                       id: Option[Int],
                       name: String,
                       infId: Int,
                       descrip: String,
                       params: List[ReportParamData]
              )

object Reports extends Controller with ProvidesUser {

  val reportForm = Form(
    mapping(
      "id" -> optional(number),
      C.RPT_NAME -> nonEmptyText,
      C.INF_ID -> number,
      C.RPT_DESCRIP -> text,
      C.REPORTE_PARAMETRO -> Forms.list[ReportParamData](
      mapping(
        C.RPTP_ID -> number,
        C.RPTP_VALUE -> text,
        C.RPTP_VISIBLE -> boolean,
        C.INFP_ID -> number)(ReportParamData.apply)(ReportParamData.unapply)
    )
  )(ReportData.apply)(ReportData.unapply))

  implicit val reportWrites = new Writes[Report] {
    def writes(report: Report) = Json.obj(
      "id" -> Json.toJson(report.id),
      C.RPT_ID -> Json.toJson(report.id),
      C.RPT_NAME -> Json.toJson(report.name),
      C.INF_CODE -> Json.toJson(report.code),
      C.RPT_DESCRIP -> Json.toJson(report.descrip),
      C.INF_ID -> Json.toJson(report.infId),
      "params" -> Json.toJson(writeReportParams(report.params))
    )
    def reportParamWrites(p: ReportParam) = Json.obj(
      C.RPT_ID -> Json.toJson(p.id),
      C.INFP_NAME -> Json.toJson(p.name),
      C.RPTP_VALUE -> Json.toJson(p.value),
      C.RPTP_VISIBLE -> Json.toJson(p.visible),
      C.INFP_TYPE -> Json.toJson(p.paramType),
      C.INFP_ID -> Json.toJson(p.infpId),
      C.TBL_ID -> Json.toJson(p.tblId),
      C.INFP_SQLSTMT -> Json.toJson(p.sqlstmt),
      C.SELECT_VALUE_NAME -> Json.toJson(p.selectValueName)
    )
    def writeReportParams(items: List[ReportParam]) = items.map(item => reportParamWrites(item))
  }

  def get(id: Int) = GetAction { implicit request =>
    LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(Report.getAction(id) _), { user =>
      Ok(Json.toJson(Report.get(user, id)))
    })
  }

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //
  // this functions convert the plain JSON received in CREATE and UPDATE into a ReportData structure
  //
  // the below routines group a flat JSON and in some cases rename the name of the fields or move
  // fields to the parent node in the JSON structure to match the case class
  //

  private def preprocessParams(implicit request:Request[AnyContent]): JsObject = {

    def getJsValueAsMap(list: Map[String, JsValue]): Map[String, JsValue] = list.toList match {
      case (key: String, jsValue: JsValue) :: t => jsValue.as[Map[String, JsValue]]
      case _ => Map.empty
    }

    def preprocessParameterParam(field: JsValue) = {
      val params = field.as[Map[String, JsValue]]
      JsObject(Global.preprocessFormParams(List(C.RPTP_ID, C.INFP_ID, C.RPTP_VISIBLE, C.RPTP_VALUE), "", params).toSeq)
    }

    def preprocessParametersParam(items: JsValue, group: String): Map[String, JsValue] = items match {
      case JsArray(arr) => Map(group -> JsArray(arr.map(preprocessParameterParam(_))))
      case _ => Map.empty
    }

    val params = Global.getParamsFromJsonRequest

    // groups for productoData
    //
    val reportBaseGroup = Global.preprocessFormParams(List("id", C.RPT_NAME, C.INF_ID, C.RPT_DESCRIP), "", params)

    // proveedores
    //
    val paramsInfo = getJsValueAsMap(Global.getParamsJsonRequestFor(C.REPORTE_PARAMETRO, params))
    val paramRows = Global.getParamsJsonRequestFor(C.ITEMS, paramsInfo)
    val reportParams = paramRows.toList match {
      case (k: String, item: JsValue) :: t => preprocessParametersParam(item, C.REPORTE_PARAMETRO)
      case _ => Map(C.REPORTE_PARAMETRO -> JsArray(List()))
    }

    JsObject(
      (reportBaseGroup ++ reportParams).toSeq)
  }
  //
  //
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  def getParams(params: List[ReportParamData]): List[ReportParam] = {
    params.map(param => {
      ReportParam(
        param.id,
        param.value,
        param.visible,
        param.infpId
      )
    })
  }

  def getReport(id: Int, report: ReportData) = {
    Report(
      id,
      report.name,
      report.infId,
      report.descrip,
      getParams(report.params)
    )
  }

  def update(id: Int) = PostAction { implicit request =>
    Logger.debug("in Reports.update")
    reportForm.bind(preprocessParams).fold(
      formWithErrors => {
        Logger.debug(s"invalid form: ${formWithErrors.toString}")
        BadRequest
      },
      report => {
        Logger.debug(s"form: ${report.toString}")
        LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(Report.getAction(id) _), { user =>
          Ok(
            Json.toJson(
              Report.update(user, getReport(id, report))))
        })
      }
    )
  }

  def create = PostAction { implicit request =>
    Logger.debug("in Reports.create")
    reportForm.bind(preprocessParams).fold(
      formWithErrors => {
        Logger.debug(s"invalid form: ${formWithErrors.toString}")
        BadRequest
      },
      report => {
        Logger.debug(s"form: ${report.toString}")
        LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(Report.getActionForCreate(report.infId) _), { user =>
          Ok(
            Json.toJson(
              Report.create(user, getReport(DBHelper.NoId, report))))
        })
      }
    )
  }

  def delete(id: Int) = PostAction { implicit request =>
    Logger.debug("in Reports.delete")
    LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(Report.getAction(id) _), { user =>
      Report.delete(user, id)
      // Backbonejs requires at least an empty json object in the response
      // if not it will call errorHandler even when we responded with 200 OK :P
      Ok(JsonUtil.emptyJson)
    })
  }

  def getParams[A](request: Request[A]) = {
    request.queryString.map { case (k,v) => k -> v.mkString }
  }

  def show(id: Int/*, params: Option[String]* */) = GetAction { implicit request =>
    LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(Report.getAction(id) _), { user =>
      Ok(
        Json.toJson(
          Recordset.getAsJson(
            Report.show(user, id, getParams(request)))))
    })
  }

}