package models.cairo.modules.general

import java.sql.{Connection, CallableStatement, ResultSet, Types, SQLException}
import anorm.SqlParser._
import anorm._
import services.DateUtil
import services.db.DB
import models.cairo.system.database._
import play.api.Play.current
import models.domain.CompanyUser
import java.util.Date
import play.api.Logger
import play.api.libs.json._
import scala.util.control.NonFatal

case class VentasSetting(userId: Int, settings: List[Setting])

object VentasSetting {

  lazy val emptyVentasSetting = VentasSetting(DBHelper.NoId, List())

  private val ventasSettingParser: RowParser[Setting] = {
    SqlParser.get[String](C.CFG_ASPECTO) ~
    SqlParser.get[String](C.CFG_GRUPO) ~
    SqlParser.get[String](C.CFG_VALOR) ~
    SqlParser.get[Option[Int]](C.EMP_ID) map {
    case
        key ~
        group ~
        value ~
        empId =>
      Setting(
        key,
        group,
        value,
        empId.getOrElse(DBHelper.NoId)
      )
    }
  }

  def create(user: CompanyUser, VentasSetting: VentasSetting): VentasSetting = {
    save(user, VentasSetting, true)
  }

  def update(user: CompanyUser, VentasSetting: VentasSetting): VentasSetting = {
    save(user, VentasSetting, false)
  }

  private def save(user: CompanyUser, VentasSetting: VentasSetting, isNew: Boolean): VentasSetting = {
    def getFields = {
      List(

      )
    }
    def throwException = {
      throw new RuntimeException(s"Error when saving ${C.CONFIGURACION}")
    }

    DBHelper.saveEx(
      user,
      Register(
        C.CONFIGURACION,
        "",
        VentasSetting.userId,
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

  def load(user: CompanyUser, id: Int): Option[VentasSetting] = {

    Logger.debug(s"id: $id")

    val generalSettings = loadWhere(
      user,
      s"emp_id IS NULL AND cfg_grupo = 'Ventas-General'"
    )

    Logger.debug(s"generalSettings: ${generalSettings.toString}")

    val companySettings = loadWhere(
      user,
      s"emp_id = {empId} AND cfg_grupo = 'Ventas-General'",
      'empId -> user.cairoCompanyId
    )

    Logger.debug(s"companySettings: ${companySettings.toString}")

    def getSelect(id: Int, name: String) = {
      s"SELECT ${C.DOC_NAME} AS ${C.CFG_VALOR}, '$name' AS ${C.CFG_ASPECTO}, '' AS ${C.CFG_GRUPO}, NULL AS ${C.EMP_ID}" +
        s" FROM ${C.DOCUMENTO} WHERE ${C.DOC_ID} = $id"
    }
    def getSelectForTable(table: String, idColumn: String, nameColumn: String, id: Int, name: String) = {
      s"SELECT $nameColumn AS ${C.CFG_VALOR}, '$name' AS ${C.CFG_ASPECTO}, '' AS ${C.CFG_GRUPO}, NULL AS ${C.EMP_ID}" +
        s" FROM $table WHERE $idColumn = $id"
    }

    /*
    val KEY_GRUPO_GENERAL = "Ventas-General"
    val KEY_CLAVE_FISCAL = "Clave Fiscal"
    val KEY_FACTURA_ELECTRONICA = "Factura Electronica Asincronica"
    val KEY_PUNTO_VENTA_FE = "Punto Venta FE"
    */
    val KEY_CUE_ID_DESC_GLOBAL = "Cuenta Descuento Global"
    val KEY_DOC_FACTURA_FALTANTE = "Factura x Faltante en Hoja Ruta"
    val KEY_DOC_MOVIMIENTO_SOBRANTE = "Mov. Fondo Sobrante en Hoja Ruta"
    val KEY_DOC_MOVIMIENTO_TICKET = "Mov. Fondo Tickets en Hoja Ruta"
    val KEY_CUE_ID_TICKETS = "Cuenta Comision sobre Tickets"
    val KEY_CUE_ID_SOBRANTE = "Cuenta para Sobrante en Rendicion"
    val KEY_PR_ID_FALTANTE = "Articulo para Faltantes en Rendicion"

    val KEY_PERCEPCION = "Percepcion"
    val KEY_CLIENTES_PV = "ClientesPV"

    val KEY_PV_CPG_ID = KEY_CLIENTES_PV + C.CPG_ID
    val KEY_PV_LP_ID = KEY_CLIENTES_PV + C.LP_ID
    val KEY_PV_PRO_ID = KEY_CLIENTES_PV + C.PRO_ID
    val KEY_PV_ZON_ID = KEY_CLIENTES_PV + C.ZON_ID

    def getId(value: String): Int = {
      try {
        value.toInt
      } catch {
        case NonFatal(e) => {
          0
        }
      }
    }

    def getStringFromAny(anyValue: Any, default: String) = anyValue match {
      case s: String => s
      case _ => default
    }
    def getSelectForKey(key: String, anyValue: Any) = {
      val value = getStringFromAny(anyValue, "0")

      key match {

        case KEY_CUE_ID_DESC_GLOBAL => {
          val cue_id = getId(value)
          getSelectForTable(C.CUENTA, C.CUE_ID, C.CUE_NAME, cue_id, KEY_CUE_ID_DESC_GLOBAL)
        }
        case KEY_DOC_FACTURA_FALTANTE => {
          val doc_id = getId(value)
          getSelectForTable(C.DOCUMENTO, C.DOC_ID, C.DOC_NAME, doc_id, KEY_DOC_FACTURA_FALTANTE)
        }
        case KEY_DOC_MOVIMIENTO_SOBRANTE => {
          val doc_id = getId(value)
          getSelectForTable(C.DOCUMENTO, C.DOC_ID, C.DOC_NAME, doc_id, KEY_DOC_MOVIMIENTO_SOBRANTE)
        }
        case KEY_DOC_MOVIMIENTO_TICKET => {
          val doc_id = getId(value)
          getSelectForTable(C.DOCUMENTO, C.DOC_ID, C.DOC_NAME, doc_id, KEY_DOC_MOVIMIENTO_TICKET)
        }
        case KEY_CUE_ID_TICKETS => {
          val cue_id = getId(value)
          getSelectForTable(C.CUENTA, C.CUE_ID, C.CUE_NAME, cue_id, KEY_CUE_ID_TICKETS)
        }
        case KEY_CUE_ID_SOBRANTE => {
          val cue_id = getId(value)
          getSelectForTable(C.CUENTA, C.CUE_ID, C.CUE_NAME, cue_id, KEY_CUE_ID_SOBRANTE)
        }
        case KEY_PR_ID_FALTANTE => {
          val pr_id = getId(value)
          getSelectForTable(C.PRODUCTO, C.PR_ID, C.PR_NAME_VENTA, pr_id, KEY_PR_ID_FALTANTE)
        }
        case KEY_PV_CPG_ID => {
          val cpg_id = getId(value)
          getSelectForTable(C.CONDICION_PAGO, C.CPG_ID, C.CPG_NAME, cpg_id, KEY_PV_CPG_ID)
        }
        case KEY_PV_LP_ID => {
          val lp_id = getId(value)
          getSelectForTable(C.LISTA_PRECIO, C.LP_ID, C.LP_NAME, lp_id, KEY_PV_LP_ID)
        }
        case KEY_PV_PRO_ID => {
          val pro_id = getId(value)
          getSelectForTable(C.PROVINCIA, C.PRO_ID, C.PRO_NAME, pro_id, KEY_PV_PRO_ID)
        }
        case KEY_PV_ZON_ID => {
          val zon_id = getId(value)
          getSelectForTable(C.ZONA, C.ZON_ID, C.ZON_NAME, zon_id, KEY_PV_ZON_ID)
        }
        case _ => ""
      }
    }
    def getSelectForSetting(setting: Setting) = {
      getSelectForKey(setting.key, setting.value)
    }
    def getSelectForSettings(list: List[Setting]): List[String] = list match {
      case Nil => List()
      case setting :: t => getSelectForSetting(setting) :: getSelectForSettings(t)
    }

    val selectList = getSelectForSettings(companySettings).filter(q => q != "")
    val sqlstmt = selectList.mkString(" UNION ")

    val names: List[Setting] = if(sqlstmt.isEmpty) List() else loadSql(user, sqlstmt)

    def getNameForKey(key: String, names: List[Setting]): Option[String] = names match {
      case Nil => None
      case setting :: t => if(setting.key == key) Some(getStringFromAny(setting.value, "")) else getNameForKey(key, t)
    }
    def getComplexSetting(setting: Setting, names: List[Setting]) = {
      getNameForKey(setting.key, names) match {
        case Some(name) => Setting(
          setting.key,
          setting.group,
          ComplexSetting(getStringFromAny(setting.value, "0"), name),
          setting.empId)
        case None => {
          if(getSelectForKey(setting.key, "") == "") {
            setting
          }
          else {
            Setting(
              setting.key,
              setting.group,
              ComplexSetting("0", ""),
              setting.empId)
          }
        }
      }
    }
    val complexSettings = companySettings.map(setting => getComplexSetting(setting, names))

    Logger.debug(s"generalSettings: ${complexSettings.toString}")

    Some(VentasSetting(id, generalSettings ::: complexSettings))
  }

  def loadWhere(user: CompanyUser, where: String, args : scala.Tuple2[scala.Any, anorm.ParameterValue[_]]*) = {
    val sqlstmt = s"SELECT * FROM ${C.CONFIGURACION} WHERE $where"
    Logger.debug(s"loadWhere: sqlstmt: $sqlstmt")
    DB.withConnection(user.database.database) { implicit connection =>
      SQL(sqlstmt)
        .on(args: _*)
        .as(ventasSettingParser.*)
    }
  }

  def loadSql(user: CompanyUser, sqlstmt: String, args : scala.Tuple2[scala.Any, anorm.ParameterValue[_]]*) = {
    Logger.debug(s"loadSql: sqlstmt: $sqlstmt")
    DB.withConnection(user.database.database) { implicit connection =>
      SQL(sqlstmt)
        .on(args: _*)
        .as(ventasSettingParser.*)
    }
  }

  def get(user: CompanyUser, id: Int): VentasSetting = {
    load(user, id) match {
      case Some(p) => p
      case None => emptyVentasSetting
    }
  }

}