package controllers.apps.reports

import actions.GetAction
import controllers.ApiApplicationLoggedResponse
import models.apps.reports.{DataSource, Report, ReportParam}
import models.cairo.system.database.Recordset
import models.cairo.system.security.CairoSecurity
import play.api.libs.json.{Json, Writes}
import play.api.mvc.Controller

object S {
  val LIST_DATA_SOURCES = 1
  val RUN_DATA_SOURCE = 2
}

object Reports extends Controller {

  implicit val dataSourceWrites = new Writes[DataSource] {
    def writes(dataSource: DataSource) = Json.obj(
      "name" -> Json.toJson(dataSource.name),
      "params" -> Json.toJson(writeParams(dataSource.params))
    )

    def paramWrites(param: ReportParam) = Json.obj(
      "name" -> Json.toJson(param.name),
      "type" -> Json.toJson(param.paramType)
    )

    def writeParams(items: List[ReportParam]) = items.map(item => paramWrites(item))
  }

  def list = GetAction { implicit request =>
    ApiApplicationLoggedResponse.getAction(request, CairoSecurity.appHasPermissionTo(S.LIST_DATA_SOURCES), { application =>
      Ok(Json.obj("list" -> ""))
    })
  }

  def listDataSources = GetAction { implicit request =>
    ApiApplicationLoggedResponse.getAction(request, CairoSecurity.appHasPermissionTo(S.LIST_DATA_SOURCES), { application =>
      Ok(Json.toJson(Report.listDataSources(application))).withHeaders("Access-Control-Allow-Origin"-> "*")
    })
  }

  def run(code: String) = GetAction { implicit request =>
    ApiApplicationLoggedResponse.getAction(request, CairoSecurity.appHasPermissionTo(S.RUN_DATA_SOURCE), { application =>
      val (dataSourceName, recordset) = Report.run(application, code, request.queryString)
      Ok(
        Json.obj(
          "name" -> dataSourceName,
          "recordset" -> Recordset.getAsJson(recordset)
        )).withHeaders("Access-Control-Allow-Origin"-> "*")
    })
  }

}
