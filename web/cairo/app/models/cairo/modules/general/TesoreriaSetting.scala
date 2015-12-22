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

case class TesoreriaSetting(userId: Int, settings: List[Setting])

object TesoreriaSetting {

  lazy val emptyTesoreriaSetting = TesoreriaSetting(DBHelper.NoId, List())

  private val tesoreriaSettingParser: RowParser[Setting] = {
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
        empId.getOrElse(0)
      )
    }
  }

  def create(user: CompanyUser, TesoreriaSetting: TesoreriaSetting): TesoreriaSetting = {
    save(user, TesoreriaSetting, true)
  }

  def update(user: CompanyUser, TesoreriaSetting: TesoreriaSetting): TesoreriaSetting = {
    save(user, TesoreriaSetting, false)
  }

  private def save(user: CompanyUser, TesoreriaSetting: TesoreriaSetting, isNew: Boolean): TesoreriaSetting = {
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
        TesoreriaSetting.userId,
        false,
        true,
        true,
        getFields),
      isNew,
      ""
    ) match {
      case SaveResult(true, id) => load(user, id).getOrElse(throwException)
      case SaveResult(false, id) => throwException
    }
  }

  def load(user: CompanyUser, id: Int): Option[TesoreriaSetting] = {

    Logger.debug(s"id: $id")

    val generalSettings = loadWhere(
      user,
      s"emp_id IS NULL AND cfg_grupo = 'Tesoreria-General'"
    )

    Logger.debug(s"generalSettings: ${generalSettings.toString}")

    val companySettings = loadWhere(
      user,
      s"emp_id = {empId} AND cfg_grupo = 'Tesoreria-General'",
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
    val KEY_GRUPO_GENERAL = "Tesoreria-General"
    */

    val KEY_CUE_ID_DIF_CAMBIO = "Cuenta contable"
    val KEY_NC_DIF_CAMBIO = "Nota de credito"
    val KEY_ND_DIF_CAMBIO = "Nota de debito"
    val KEY_PR_ID_DIF_CAMBIO = "Articulo"

    val KEY_DOC_ID_COBRANZA = "Cobranza"
    val KEY_DOC_ID_ORDEN_PAGO = "Orden Pago"

    val KEY_CUENTA_ANTICIPO_COBRANZA = "Cuenta Anticipo Cobranzas"
    val KEY_CUENTA_ANTICIPO_PAGOS = "Cuenta Anticipo Ordenes de Pago"

    val KEY_RETENCION = "Retencion"

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

        case KEY_CUE_ID_DIF_CAMBIO => {
          val cue_id = getId(value)
          getSelectForTable(C.CUENTA, C.CUE_ID, C.CUE_NAME, cue_id, KEY_CUE_ID_DIF_CAMBIO)
        }
        case KEY_NC_DIF_CAMBIO => {
          val doc_id = getId(value)
          getSelectForTable(C.DOCUMENTO, C.DOC_ID, C.DOC_NAME, doc_id, KEY_NC_DIF_CAMBIO)
        }
        case KEY_ND_DIF_CAMBIO => {
          val doc_id = getId(value)
          getSelectForTable(C.DOCUMENTO, C.DOC_ID, C.DOC_NAME, doc_id, KEY_ND_DIF_CAMBIO)
        }
        case KEY_DOC_ID_COBRANZA => {
          val doc_id = getId(value)
          getSelectForTable(C.DOCUMENTO, C.DOC_ID, C.DOC_NAME, doc_id, KEY_DOC_ID_COBRANZA)
        }
        case KEY_DOC_ID_ORDEN_PAGO => {
          val doc_id = getId(value)
          getSelectForTable(C.DOCUMENTO, C.DOC_ID, C.DOC_NAME, doc_id, KEY_DOC_ID_ORDEN_PAGO)
        }
        case KEY_CUENTA_ANTICIPO_COBRANZA => {
          val cue_id = getId(value)
          getSelectForTable(C.CUENTA, C.CUE_ID, C.CUE_NAME, cue_id, KEY_CUENTA_ANTICIPO_COBRANZA)
        }
        case KEY_CUENTA_ANTICIPO_PAGOS => {
          val cue_id = getId(value)
          getSelectForTable(C.CUENTA, C.CUE_ID, C.CUE_NAME, cue_id, KEY_CUENTA_ANTICIPO_PAGOS)
        }
        case KEY_PR_ID_DIF_CAMBIO => {
          val pr_id = getId(value)
          getSelectForTable(C.PRODUCTO, C.PR_ID, C.PR_NAME_VENTA, pr_id, KEY_PR_ID_DIF_CAMBIO)
        }
        case KEY_RETENCION => {
          val ret_id = getId(value)
          getSelectForTable(C.RETENCION, C.RET_ID, C.RET_NAME, ret_id, KEY_RETENCION + value)
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

    val selectList = (getSelectForSettings(companySettings) ::: getSelectForSettings(generalSettings)).filter(q => q != "")
    val sqlstmt = selectList.mkString(" UNION ")

    val names: List[Setting] = if(sqlstmt.isEmpty) List() else loadSql(user, sqlstmt)

    def getNameForKey(key: String, names: List[Setting]): Option[String] = names match {
      case Nil => None
      case setting :: t => if(setting.key == key) Some(getStringFromAny(setting.value, "")) else getNameForKey(key, t)
    }
    def getComplexSetting(setting: Setting, names: List[Setting]) = {
      def getKey = {
        if(setting.key == KEY_RETENCION) setting.key + getStringFromAny(setting.value, "0") else setting.key
      }
      getNameForKey(getKey, names) match {
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
    val allSettings = (
            companySettings.map(setting => getComplexSetting(setting, names))
        ::: generalSettings.map(setting => getComplexSetting(setting, names))
      )

    Logger.debug(s"generalSettings: ${allSettings.toString}")

    Some(TesoreriaSetting(id, allSettings))
  }

  def loadWhere(user: CompanyUser, where: String, args : scala.Tuple2[scala.Any, anorm.ParameterValue[_]]*) = {
    val sqlstmt = s"SELECT * FROM ${C.CONFIGURACION} WHERE $where"
    Logger.debug(s"loadWhere: sqlstmt: $sqlstmt")
    DB.withConnection(user.database.database) { implicit connection =>
      SQL(sqlstmt)
        .on(args: _*)
        .as(tesoreriaSettingParser.*)
    }
  }

  def loadSql(user: CompanyUser, sqlstmt: String, args : scala.Tuple2[scala.Any, anorm.ParameterValue[_]]*) = {
    Logger.debug(s"loadSql: sqlstmt: $sqlstmt")
    DB.withConnection(user.database.database) { implicit connection =>
      SQL(sqlstmt)
        .on(args: _*)
        .as(tesoreriaSettingParser.*)
    }
  }

  def get(user: CompanyUser, id: Int): TesoreriaSetting = {
    load(user, id) match {
      case Some(p) => p
      case None => emptyTesoreriaSetting
    }
  }

}