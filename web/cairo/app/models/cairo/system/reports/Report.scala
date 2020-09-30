package models.cairo.modules.system.reports

import java.sql.{Connection, CallableStatement, ResultSet, Types, SQLException}
import anorm.SqlParser._
import anorm._
import formatters.json.DateFormatter
import models.cairo.modules.general.C
import services.DateUtil
import services.db.DB
import models.cairo.system.database.{DBHelper, Register, Field, FieldType, SaveResult, Recordset}
import java.math.BigDecimal
import play.api.Play.current
import models.domain.CompanyUser
import java.util.Date
import play.api.Logger
import play.api.libs.json._
import scala.util.control.NonFatal

case class ReportParam(
                      id: Int,
                      name: String,
                      value: String,
                      visible: Boolean,
                      infpId: Int,
                      paramType: Int,
                      tblId: Int,
                      sqlstmt: String,
                      selectValueName: String,
                      order: Int
                      )

object ReportParam {

  def apply(
             id: Int,
             value: String,
             visible: Boolean,
             infpId: Int
           ) = {

    new ReportParam(
      id,
      "",         // from infp_id
      value,
      visible,
      infpId,
      0,          // from infp_id
      0,          // from infp_id
      "",         // from infp_id
      "",         // from infp_id
      0
    )
  }
}

case class Report(
              id: Int,
              name: String,
              code: String,
              active: Boolean,
              infId: Int,
              storedProcedure: String,
              reportFile: String,
              descrip: String,
              params: List[ReportParam],
              createdAt: Date,
              updatedAt: Date,
              updatedBy: Int) {

  def this(
      id: Int,
      name: String,
      code: String,
      active: Boolean,
      infId: Int,
      storedProcedure: String,
      reportFile: String,
      descrip: String,
      params: List[ReportParam]) = {

    this(
      id,
      name,
      code,
      active,
      infId,
      storedProcedure,
      reportFile,
      descrip,
      params,
      DateUtil.currentTime,
      DateUtil.currentTime,
      DBHelper.NoId)
  }

  def this(
      name: String,
      code: String,
      active: Boolean,
      infId: Int,
      storedProcedure: String,
      reportFile: String,
      descrip: String,
      params: List[ReportParam]) = {

    this(
      DBHelper.NoId,
      name,
      code,
      active,
      infId,
      storedProcedure,
      reportFile,
      descrip,
      params)

  }

}

object Report {

  lazy val emptyReport = Report(
    DBHelper.NoId,
    "",
    DBHelper.NoId,
    "",
    List()
  )

  def apply(
      id: Int,
      name: String,
      code: String,
      active: Boolean,
      infId: Int,
      storedProcedure: String,
      reportFile: String,
      descrip: String,
      params: List[ReportParam]) = {

    new Report(
      id,
      name,
      code,
      active,
      infId,
      storedProcedure,
      reportFile,
      descrip,
      params)
  }

  def apply(
      id: Int,
      name: String,
      infId: Int,
      descrip: String,
      params: List[ReportParam]) = {

    new Report(
      id,
      name,
      "",
      true,
      infId,
      "",
      "",
      descrip,
      params)
  }

  private val reportParamParser: RowParser[ReportParam] = {
      SqlParser.get[Option[Int]](C.RPTP_ID) ~
      SqlParser.get[String](C.INFP_NAME) ~
      SqlParser.get[String](C.RPTP_VALUE) ~
      SqlParser.get[Int](C.RPTP_VISIBLE) ~
      SqlParser.get[Int](C.INFP_ID) ~
      SqlParser.get[Int](C.INFP_TYPE) ~
      SqlParser.get[Option[Int]](C.TBL_ID) ~
      SqlParser.get[String](C.INFP_SQLSTMT) ~
      SqlParser.get[String](C.SELECT_VALUE_NAME) ~
      SqlParser.get[Int](C.INFP_ORDER) map {
      case
          id ~
          name ~
          value ~
          visible ~
          infpId ~
          infpTipo ~
          tblId ~
          infpSqlstmt ~
          selectValueName ~
          order =>
        ReportParam(
          id.getOrElse(DBHelper.NoId),
          name,
          value,
          visible != 0,
          infpId,
          infpTipo,
          tblId.getOrElse(DBHelper.NoId),
          infpSqlstmt,
          selectValueName,
          order)
      }
  }

  private val reportParser: RowParser[Report] = {
      SqlParser.get[Int](C.RPT_ID) ~
      SqlParser.get[String](C.RPT_NAME) ~
      SqlParser.get[String](C.INF_CODE) ~
      SqlParser.get[Int](DBHelper.ACTIVE) ~
      SqlParser.get[Int](C.INF_ID) ~
      SqlParser.get[String](C.INF_STORED_PROCEDURE) ~
      SqlParser.get[String](C.INF_REPORT_FILE) ~
      SqlParser.get[String](C.RPT_DESCRIP) ~
      SqlParser.get[Date](DBHelper.CREATED_AT) ~
      SqlParser.get[Date](DBHelper.UPDATED_AT) ~
      SqlParser.get[Int](DBHelper.UPDATED_BY) map {
      case
              id ~
              name ~
              code ~
              active ~
              infId ~
              storedProcedure ~
              reportFile ~
              descrip ~
              createdAt ~
              updatedAt ~
              updatedBy =>
        Report(
              id,
              name,
              code,
              active != 0,
              infId,
              storedProcedure,
              reportFile,
              descrip,
              List(),
              createdAt,
              updatedAt,
              updatedBy)
    }
  }

  def create(user: CompanyUser, report: Report): Report = {
    save(user, report, true)
  }

  def update(user: CompanyUser, report: Report): Report = {
    save(user, report, false)
  }

  private def save(user: CompanyUser, report: Report, isNew: Boolean): Report = {
    def getFields = {
      List(
        Field(C.RPT_NAME, report.name, FieldType.text),
        Field(DBHelper.ACTIVE, Register.boolToInt(report.active), FieldType.boolean),
        Field(C.INF_ID, report.infId, FieldType.id),
        Field(C.RPT_DESCRIP, report.descrip, FieldType.text)
      )
    }
    def throwException = {
      throw new RuntimeException(s"Error when saving ${C.REPORTE}")
    }

    DBHelper.saveEx(
      user,
      Register(
        C.REPORTE,
        C.RPT_ID,
        report.id,
        false,
        true,
        true,
        getFields),
      isNew,
      ""
    ) match {
      case SaveResult(true, id) => load(user, id).getOrElse(throwException)
      case SaveResult(false, _) => throwException
    }
  }

  def load(user: CompanyUser, id: Int): Option[Report] = {
    loadWhere(user, s"${C.RPT_ID} = {id}", 'id -> id)
  }

  def loadWhere(user: CompanyUser, where: String, args : scala.Tuple2[scala.Any, anorm.ParameterValue[_]]*) = {
    DB.withConnection(user.database.database) { implicit connection =>
      SQL(s"""SELECT t1.*, t2.${C.INF_CODE}, t2.${C.INF_STORED_PROCEDURE}, t2.${C.INF_REPORT_FILE}
             | FROM ${C.REPORTE} t1 INNER JOIN ${C.INFORME} t2 ON t1.inf_id = t2.inf_id WHERE $where""".stripMargin)
        .on(args: _*)
        .as(reportParser.singleOpt)
    }
  }

  private def loadReportParams(user: CompanyUser, id: Int) = {

    DB.withTransaction(user.database.database) { implicit connection =>

      val sql = "{call sp_reporte_get_parametros(?, ?)}"
      val cs = connection.prepareCall(sql)

      cs.setInt(1, id)
      cs.registerOutParameter(2, Types.OTHER)

      try {
        cs.execute()

        val rs = cs.getObject(2).asInstanceOf[java.sql.ResultSet]
        Sql.as(reportParamParser.*, rs)

      } catch {
        case NonFatal(e) => {
          Logger.error(s"can't get ${C.REPORTE_PARAMETRO} with id $id for user ${user.toString}. Error ${e.toString}")
          throw e
        }
      } finally {
        cs.close
      }
    }
  }

  def delete(user: CompanyUser, id: Int) = {
    DB.withConnection(user.database.database) { implicit connection =>
      try {
        SQL(s"DELETE FROM ${C.REPORTE} WHERE ${C.RPT_ID} = {id}")
        .on('id -> id)
        .executeUpdate
      } catch {
        case NonFatal(e) => {
          Logger.error(s"can't delete a ${C.REPORTE}. ${C.RPT_ID} id: $id. Error ${e.toString}")
          throw e
        }
      }
    }
  }

  def getAction(id: Int)(user: CompanyUser): Int = {
    DB.withConnection(user.database.database) { implicit connection =>
      SQL(s"SELECT t2.${C.PRE_ID} FROM ${C.REPORTE} t1 INNER JOIN ${C.INFORME} t2 ON t1.inf_id = t2.inf_id WHERE ${C.RPT_ID} = {id}")
        .on('id -> id)
        .as(scalar[Option[Int]].single)
        .getOrElse(DBHelper.NoId)
    }
  }

  def getActionForForm(id: Int)(user: CompanyUser): Int = {
    DB.withConnection(user.database.database) { implicit connection =>
      SQL(s"SELECT t1.${C.PRE_ID_PRINT} FROM ${models.cairo.modules.general.C.DOCUMENTO} t1 INNER JOIN ${C.REPORTE_FORMULARIO} t2 ON t1.doc_id = t2.doc_id WHERE ${C.RPTF_ID} = {id}")
        .on('id -> id)
        .as(scalar[Option[Int]].single)
        .getOrElse(DBHelper.NoId)
    }
  }

  def getActionForCreate(infId: Int)(user: CompanyUser): Int = {
    DB.withConnection(user.database.database) { implicit connection =>
      SQL(s"SELECT t2.${C.PRE_ID} FROM ${C.INFORME} WHERE ${C.INF_ID} = {id}")
        .on('id -> infId)
        .as(scalar[Option[Int]].single)
        .getOrElse(DBHelper.NoId)
    }
  }

  def get(user: CompanyUser, id: Int): Report = {
    load(user, id) match {
      case Some(p) => Report(
                              p.id,
                              p.name,
                              p.code,
                              p.active,
                              p.infId,
                              p.storedProcedure,
                              p.reportFile,
                              p.descrip,
                              loadReportParams(user, id))
      case None => emptyReport
    }
  }

  def getLogoChico(user: CompanyUser): Recordset = {
    getLogo(user, "sp_rpt_get_logos_chico")
  }

  def getLogoGrande(user: CompanyUser): Recordset = {
    getLogo(user, "sp_rpt_get_logos_grande")
  }

  def getLogo(user: CompanyUser, sp: String): Recordset = {
    DB.withTransaction(user.database.database) { implicit connection =>

      val sql = s"{call $sp(?, ?)}"
      val cs = connection.prepareCall(sql)

      cs.setInt(1, user.cairoCompanyId)
      cs.registerOutParameter(2, Types.OTHER)

      try {
        cs.execute()

        val rs = cs.getObject(2).asInstanceOf[java.sql.ResultSet]
        Recordset.load(rs)

      } catch {
        case NonFatal(e) => {
          Logger.error(s"can't get logo for user ${user.toString}. Error ${e.toString}")
          throw e
        }
      } finally {
        cs.close
      }
    }
  }

  lazy val resourcePath = play.Play.application().path().getAbsolutePath()

  private def getFile(user: CompanyUser, id: Int) = {
    DB.withConnection(user.database.database) { implicit connection =>
      SQL(s"SELECT t.${C.RPTF_CSRFILE} FROM ${C.REPORTE_FORMULARIO} t WHERE ${C.RPTF_ID} = {id}")
        .on('id -> id)
        .as(scalar[Option[String]].single)
        .getOrElse("")
    }
  }

  private def loadFormData(user: CompanyUser, paramId: Int, dataSource: String) = DB.withTransaction(user.database.database) { implicit connection =>
    val sql = s"{call ${dataSource} (?, ?)}"
    val cs = connection.prepareCall(sql)

    cs.setInt(1, paramId)
    cs.registerOutParameter(2, Types.OTHER)

    try {
      cs.execute()

      val rs = cs.getObject(2).asInstanceOf[java.sql.ResultSet]
      (dataSource, Recordset.load(rs))

    } catch {
      case NonFatal(e) => {
        Logger.error(s"can't get listing of reportes for user ${user.toString}. Error ${e.toString}")
        throw e
      }
    } finally {
      cs.close
    }
  }

  def showForm(user: CompanyUser, id: Int, paramId: Int): (String, Recordset) = {
    lazy val emptyData = ("", Recordset(Nil, Nil))
    val file = getFile(user, id)
    if(file.isEmpty) {
      Logger.error(s"can't get ${C.RPTF_CSRFILE} for id $id")
      emptyData
    }
    else {
      import scala.xml.XML
      val xml = XML.loadFile(resourcePath + "/app/client/cairo/reports/formularios/" + file)
      val dataSource = (xml \ "RptConnect").head.attribute("DataSource").head.toString
      if(dataSource.isEmpty) {
        Logger.error(s"this csr ${C.RPTF_CSRFILE} doesn't has a data source attribute")
        emptyData
      }
      else
        loadFormData(user, paramId, dataSource)
    }
  }

  def show(user: CompanyUser, id: Int, params: Map[String, String]): Recordset = {

    def throwErrorReportNotFound(id: Int) = {
      throwException(s"Error report $id not found")
    }

    def throwException(message: String) = {
      throw new RuntimeException(message)
    }

    val report = load(user, id).getOrElse(throwErrorReportNotFound(id))
    val reportParams = loadReportParams(user, id)

    DB.withTransaction(user.database.database) { implicit connection =>

      val sql = s"{call ${report.storedProcedure} (${params.map( _ => "?").mkString("?, ", ", ", ", ?")})}"
      val cs = connection.prepareCall(sql)

      def throwErrorParameterNotFound(key: String) = {
        throwException(s"Error parameter $key not found")
      }

      def getParamType(key: String) = {
        val infId = key.substring(1).toInt
        val reportParam = reportParams.find(_.infpId == infId).getOrElse(throwErrorParameterNotFound(key))
        reportParam.paramType
      }

      def getParam(p: (String, String), index: Int) = p match {
        case (key, value) => {
          Logger.debug(s"params: $key, $value")
          getParamType(key) match {
            case ReportParamType.date =>     cs.setDate(index, new java.sql.Date(DateFormatter.parse(value).getTime()))
            case ReportParamType.select =>   cs.setString(index, value)
            case ReportParamType.numeric =>  cs.setBigDecimal(index, new BigDecimal(value.toDouble))
            case ReportParamType.sqlstmt =>  cs.setInt(index, value.toInt)
            case ReportParamType.text =>     cs.setString(index, value)
            case ReportParamType.list =>     cs.setInt(index, value.toInt)
            case ReportParamType.check =>    cs.setInt(index, value.toInt)
          }
        }
      }

      def getParams(params: List[(String, String)], index: Int): Int = params match {
        case Nil => index
        case param :: tail => {
          getParam(param, index)
          getParams(tail, index + 1)
        }
      }

      def getParamOrder(key: String) = {
        val infId = key.substring(1).toInt
        val reportParam = reportParams.find(_.infpId == infId).getOrElse(throwErrorParameterNotFound(key))
        reportParam.order
      }

      def compareParams(a: (String, String), b: (String, String)) = {
        getParamOrder(a._1) < getParamOrder(b._1)
      }

      Logger.debug("params: " + params.toString)
      Logger.debug("params: " + params.map( _ => "?"))
      Logger.debug("params: " + params.map( _ => "?").mkString(", "))

      cs.setInt(1, user.masterUserId)
      val index = getParams(params.toList.sortWith(compareParams), 2)
      cs.registerOutParameter(index, Types.OTHER)

      try {
        cs.execute()

        val rs = cs.getObject(index).asInstanceOf[java.sql.ResultSet]
        Recordset.load(rs)

      } catch {
        case NonFatal(e) => {
          Logger.error(s"can't get listing of reportes for user ${user.toString}. Error ${e.toString}")
          throw e
        }
      } finally {
        cs.close
      }
    }
  }
}