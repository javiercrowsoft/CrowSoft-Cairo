package models.apps.reports

import anorm.{RowParser, Sql, SqlParser, ~}
import models.master.ApiApplication
import play.api.Play.current
import play.api.Logger
import services.db.DB

import scala.util.control.NonFatal


case class DataSourceRow(
                        name: String,
                        paramTypes: String,
                        paramNames: String
                      )

case class ReportParam(
                        name: String,
                        value: String,
                        paramType: String
                      )

case class DataSource(
                       name: String,
                       params: List[ReportParam]
                     )

object DataSource {

  def apply(row: DataSourceRow) = {
    val paramNames = row.paramNames.substring(1).substring(0, row.paramNames.length-2).split(",")
    val paramTypes = row.paramTypes.substring(row.name.length+1).substring(0,row.paramTypes.length-row.name.length-2).split(",")
    val params = (paramNames zip paramTypes).map(p => ReportParam(p._1, null, p._2)).toList
    new DataSource(row.name, params)
  }
}

object Report {
/*
*
select distinct routine_name as name, t.params, t.proargnames
from information_schema.routines r
left join (select proname, proargnames, oid::regprocedure as params from pg_proc) t on r.routine_name = t.proname
where routine_type = 'FUNCTION'
  and routine_schema = 'public'
  and (lower(routine_name) like 'dc%' or lower(routine_name) like 'fr%' or lower(routine_name) like 'ls%')
order by 1
* */

  private val dataSourceParser: RowParser[DataSourceRow] = {
      SqlParser.get[String]("name") ~
      SqlParser.get[String]("param_types") ~
      SqlParser.get[String]("param_names") map {
      case
          name ~
          paramTypes ~
          paramNames =>
        DataSourceRow(
          name,
          paramTypes,
          paramNames
          )
    }
  }

  def listDataSources(app: ApiApplication): List[DataSource] = {

    DB.withTransaction(app.cairoDataSource) { implicit connection =>

      val sql = """select distinct routine_name as name, t.param_types, t.param_names
                   |from information_schema.routines r
                   |left join (select proname, proargnames::text as param_names, (oid::regprocedure)::text as param_types from pg_proc) t on r.routine_name = t.proname
                   |where routine_type = 'FUNCTION'
                   |  and routine_schema = 'public'
                   |  and (lower(routine_name) like 'dc%' or lower(routine_name) like 'fr%' or lower(routine_name) like 'ls%')
                   |order by 1
                   |""".stripMargin
      val cs = connection.prepareStatement(sql)

      try {
        cs.execute()

        val rs = cs.getResultSet
        val dataSourceRows = Sql.as(dataSourceParser.*, rs)

        dataSourceRows.map(r => DataSource(r))

      } catch {
        case NonFatal(e) => {
          Logger.error(s"can't get list of datasources for app ${app.toString}. Error ${e.toString}")
          throw e
        }
      } finally {
        cs.close
      }
    }
  }
}
