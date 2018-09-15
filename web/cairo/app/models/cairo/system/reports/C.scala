package models.cairo.modules.system.reports

object C {

  val TBL_ID = "tbl_id"
  val PRE_ID = "pre_id"
  val ITEMS = "items"

  val REPORTE = "Reporte"
  val RPT_ID = "rpt_id"
  val RPT_NAME = "rpt_nombre"
  val RPT_DESCRIP = "rpt_descrip"

  val REPORTE_PARAMETRO = "ReporteParametro"
  val RPTP_ID = "rptp_id"
  val RPTP_VALUE = "rptp_valor"
  val RPTP_VISIBLE = "rptp_visible"
  val SELECT_VALUE_NAME = "select_value_name"

  val INFORME = "Informe"
  val INF_ID = "inf_id"
  val INF_CODE = "inf_codigo"
  val INF_NAME = "inf_nombre"
  val INF_STORED_PROCEDURE = "inf_storedprocedure"
  val INF_REPORT_FILE = "inf_reporte"

  val INFORME_PARAMETRO = "InformeParametro"
  val INFP_ID = "infp_id"
  val INFP_NAME = "infp_nombre"
  val INFP_TYPE = "infp_tipo"
  val INFP_SQLSTMT = "infp_sqlstmt"
  val INFP_ORDER = "infp_orden"

  val REPORTE_FORMULARIO = "ReporteFormulario"
  val RPTF_ID = "RPTF_id"
  val RPTF_NAME = "RPTF_nombre"
  val RPTF_CSRFILE = "RPTF_csrfile"
  val RPTF_TIPO = "RPTF_tipo"
  val RPTF_SUGERIDO = "RPTF_sugerido"
  val RPTF_SUGERIDO_EMAIL = "RPTF_sugeridoemail"
  val RPTF_COPIAS = "RPTF_copias"
  val RPTF_DOC_IMPRIMIR_EN_ALTA = "RPTF_docImprimirEnAlta"
  val RPTF_OBJECT = "RPTF_object"

}

object S {
  val LIST_REPORTS = 7008
}

object ReportParamType {
  val date = 1
  val select = 2
  val numeric = 3
  val sqlstmt = 4
  val text = 5
  val list = 6
  val check = 7
}