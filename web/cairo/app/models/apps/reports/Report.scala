package models.apps.reports

import anorm.{RowParser, Sql, SqlParser, ~}
import formatters.json.DateFormatter
import models.cairo.system.database.Recordset
import models.master.ApiApplication
import play.api.Play.current
import play.api.Logger
import services.db.DB

import java.math.BigDecimal
import java.sql.Types
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
                   |  and (lower(routine_name) like 'dc%' or lower(routine_name) like 'fr%' or lower(routine_name) like 'ls%' or lower(routine_name) like '%rpt%logo%')
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
          Logger.error(s"can't get list of datasource for app ${app.toString}. Error ${e.toString}")
          throw e
        }
      } finally {
        cs.close
      }
    }
  }

  def load(app: ApiApplication, code: String): Option[DataSource] = {

    DB.withTransaction(app.cairoDataSource) { implicit connection =>

      val sql = """select distinct routine_name as name, t.param_types, t.param_names
                  |from information_schema.routines r
                  |left join (select proname, proargnames::text as param_names, (oid::regprocedure)::text as param_types from pg_proc) t on r.routine_name = t.proname
                  |where routine_type = 'FUNCTION'
                  |  and routine_schema = 'public'
                  |  and lower(routine_name) = lower(?)
                  |order by 1
                  |""".stripMargin
      val cs = connection.prepareStatement(sql)

      cs.setString(1, code)

      try {
        cs.execute()

        val rs = cs.getResultSet
        val dataSource = Sql.as(dataSourceParser.singleOpt, rs)

        dataSource.map(r => DataSource(r))

      } catch {
        case NonFatal(e) => {
          Logger.error(s"can't get datasource for app ${app.toString}. Error ${e.toString}")
          throw e
        }
      } finally {
        cs.close
      }
    }
  }

  def run(app: ApiApplication, code: String, paramValues: Map[String, Seq[String]]): (String, Recordset) = {

    def throwErrorReportNotFound(code: String) = {
      throwException(s"Error report $code not found")
    }

    def throwException(message: String) = {
      throw new RuntimeException(message)
    }

    val dataSource = load(app, code).getOrElse(throwErrorReportNotFound(code))

    DB.withTransaction(app.cairoDataSource) { implicit connection =>

      val sql = s"{call ${dataSource.name.toUpperCase} (${dataSource.params.map( _ => "?").mkString("", ", ", ", ?")})}"
      val cs = connection.prepareCall(sql)

      def throwErrorParameterNotFound(key: String) = {
        throwException(s"Error parameter $key not found")
      }

      def getParam(p: ReportParam, index: Int) = {
          Logger.debug(s"params: ${p.name}, $p.value")
          p.paramType match {
            case "timestamp with time zone" => cs.setDate(index, new java.sql.Date(DateFormatter.parse(p.value).getTime()))
            case "integer" => cs.setInt(index, p.value.toInt)
            case "character varying" => cs.setString(index, p.value)
            case _ => throwException(s"Error unknown type ${p.paramType} in param ${p.name}")
        }
      }

      def setParamValue(param: ReportParam): ReportParam = {
        paramValues.find(p => p._1 == param.name)
          .map(p => ReportParam(param.name, p._2(0), param.paramType))
          .getOrElse(throwErrorParameterNotFound(param.name))
      }

      def getParams(params: List[ReportParam], index: Int = 1): Int = params match {
        case Nil => index
        case param :: tail => {
          getParam(setParamValue(param), index)
          getParams(tail, index + 1)
        }
      }

      Logger.debug("params: " + paramValues.toString)
      Logger.debug("params: " + paramValues.map( _ => "?"))
      Logger.debug("params: " + paramValues.map( _ => "?").mkString(", "))

      val index = getParams(dataSource.params)
      cs.registerOutParameter(index, Types.OTHER)

      Logger.debug("index: " + index)

      try {
        cs.execute()

        val rs = cs.getObject(index).asInstanceOf[java.sql.ResultSet]
        (dataSource.name, Recordset.load(rs))

      } catch {
        case NonFatal(e) => {
          Logger.error(s"can't run datasource ${dataSource.name} for application ${app.toString}. Error ${e.toString}")
          throw e
        }
      } finally {
        cs.close
      }
    }
  }

}
