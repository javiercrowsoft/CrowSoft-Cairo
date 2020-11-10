package models.cairo.modules.general

import java.sql.{Connection, CallableStatement, ResultSet, Types, SQLException}
import anorm.SqlParser._
import anorm._
import services.{G, DateUtil}
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
        empId.getOrElse(DBHelper.NoId)
      )
    }
  }

  val KEY_GRUPO_GENERAL = "Tesoreria-General"

  val KEY_CUE_ID_DIF_CAMBIO = "Cuenta contable"
  val KEY_NC_DIF_CAMBIO = "Nota de credito"
  val KEY_ND_DIF_CAMBIO = "Nota de debito"
  val KEY_PR_ID_DIF_CAMBIO = "Articulo"

  val KEY_DOC_ID_COBRANZA = "Cobranza"
  val KEY_DOC_ID_ORDEN_PAGO = "Orden Pago"

  val KEY_CUENTA_ANTICIPO_COBRANZA = "Cuenta Anticipo Cobranzas"
  val KEY_CUENTA_ANTICIPO_PAGOS = "Cuenta Anticipo Ordenes de Pago"

  val KEY_RETENCION = "Retencion"

  def create(user: CompanyUser, tesoreriaSetting: TesoreriaSetting): TesoreriaSetting = {
    save(user, tesoreriaSetting, true)
  }

  def update(user: CompanyUser, tesoreriaSetting: TesoreriaSetting): TesoreriaSetting = {
    save(user, tesoreriaSetting, false)
  }

  private def save(user: CompanyUser, tesoreriaSetting: TesoreriaSetting, isNew: Boolean): TesoreriaSetting = {
    DB.withTransaction(user.database.database) { implicit connection =>
      saveEx(user, tesoreriaSetting, isNew)
    }
  }
  private def saveEx(user: CompanyUser, tesoreriaSetting: TesoreriaSetting, isNew: Boolean)(implicit connection: Connection): TesoreriaSetting = {

    def throwExceptionWithMessage(message: String) = {
      throw new RuntimeException(s"Error when saving ${C.CONFIGURACION} ($message)")
    }

    def getSettingValue(value: Any) = value match {
      case value: String => value
      case _ => ""
    }

    def getFilters(filter: String) = {
      filter.split("[,]").toList
    }

    def parseParameters(parameters: List[String]): Map[String, String] = {
      def parseParam(param: String) = {
        val v = param.split("[:]")
        (v(0).trim -> v(1).trim.replaceAll("[']", ""))
      }
      parameters.map(parseParam).toMap
    }

    def getFilter(filter: String) = {
      val params = parseParameters(getFilters(filter))
      val key = params.getOrElse(C.CFG_ASPECTO, "")
      val group = params.getOrElse(C.CFG_GRUPO, "")
      val empId = G.getIntOrZero(params.getOrElse(C.EMP_ID, ""))
      if (empId != 0)
        SettingFilter(key, group, s"${C.EMP_ID} = $empId")
      else
        SettingFilter(key, group, s"${C.EMP_ID} IS NULL")
    }

    def saveSetting(setting: Setting) = {
      val filter = getFilter(setting.filter)

      //
      // this validation is here to check the filter and the register key, group and empId match
      // if you are asking why is the filter needed ? why don't create the filter here in the server
      // using key, group and empId from the register ?
      //
      // the answer is I am asking myself the same :P
      //
      // the only reason for this to exists is I have filter set in all setting classes and
      // instead of removing that line I decided to do a check to see if they match
      //
      // probably some day I will remove this duplication
      //
      // first I want to see if there are any cases when the filter and the register doesn't match
      // and it is correct
      //
      if (filter.key != setting.key) throwExceptionWithMessage(s"The key in settings doesn't match the key in filter [ ${filter.key} - ${setting.key} | ${filter.group} - ${setting.group} ]")
      if (filter.group != setting.group) throwExceptionWithMessage(s"The group in settings doesn't match the group in filter [ ${filter.key} - ${setting.key} | ${filter.group} - ${setting.group} ]")
      if (
        (filter.empId != s"${C.EMP_ID} IS NULL" && setting.empId == 0)
          || (filter.empId == s"${C.EMP_ID} IS NULL" && setting.empId != 0)
      ) throwExceptionWithMessage(s"The empId in settings doesn't match the empId in filter [ ${filter.key} - ${setting.key} | ${filter.group} - ${setting.group} | ${filter.empId} - ${setting.empId} ]")

      val empId = if (setting.empId != 0) setting.empId.toString() else "null"
      if (exists(filter))
        update(setting.key, setting.group, getSettingValue(setting.value), empId, filter)
      else
        insert(setting.key, setting.group, getSettingValue(setting.value), empId)
    }

    def exists(filter: SettingFilter) = {
      //DB.withConnection(user.database.database) { implicit connection =>
      try {
        SQL(s"SELECT COUNT(*) AS c FROM ${C.CONFIGURACION} WHERE ${C.CFG_ASPECTO} = {key} AND ${C.CFG_GRUPO} = {group} AND ${filter.empId}")
          .on('key -> filter.key, 'group -> filter.group)
          .apply().head[Long]("c") > 0
      } catch {
        case NonFatal(e) => {
          Logger.error(s"can't check if record exists with filter $filter in ${C.CONFIGURACION}. Error ${e.toString}")
          throw e
        }
      }
      //}
    }

    def update(key: String, group: String, value: String, empId: String, filter: SettingFilter) = {
      //DB.withConnection(user.database.database) { implicit connection =>
        try {
          SQL( s"""
        UPDATE ${C.CONFIGURACION} SET ${C.CFG_VALOR} = {value}
        | WHERE ${C.CFG_ASPECTO} = {key} AND ${C.CFG_GRUPO} = {group} AND ${filter.empId}
        """.stripMargin)
            .on('key -> filter.key, 'group -> filter.group, 'value -> value)
            .executeUpdate
        } catch {
          case NonFatal(e) => {
            Logger.error(s"can't update a ${C.CONFIGURACION}. Error ${e.toString}")
            throw e
          }
        }
      //}
    }

    def insert(key: String, group: String, value: String, empId: String) = {
      //DB.withConnection(user.database.database) { implicit connection =>
        try {
          SQL(s"INSERT INTO ${C.CONFIGURACION} (${C.CFG_ASPECTO}, ${C.CFG_GRUPO}, ${C.CFG_VALOR}, ${C.EMP_ID}, ${DBHelper.UPDATED_BY}) VALUES({key}, {group}, {value}, $empId, {userId})")
            .on('key -> key, 'group -> group, 'value -> value, 'userId -> user.masterUserId)
            .executeUpdate
        } catch {
          case NonFatal(e) => {
            Logger.error(s"can't insert a ${C.CONFIGURACION}. Error ${e.toString}")
            throw e
          }
        }
      //}
    }

    // remove all configuration for retenciones
    def deleteRetenciones() = {
      //DB.withConnection(user.database.database) { implicit connection =>
        try {
          SQL(s"DELETE FROM ${C.CONFIGURACION} WHERE ${C.CFG_ASPECTO} = {key} AND ${C.CFG_GRUPO} = {group} AND ${C.EMP_ID} = {empId}")
            .on('key -> KEY_RETENCION, 'group -> KEY_GRUPO_GENERAL, 'empId -> user.cairoCompanyId)
            .executeUpdate
        } catch {
          case NonFatal(e) => {
            Logger.error(s"can't delete ${C.CONFIGURACION} with group $KEY_GRUPO_GENERAL and key $KEY_RETENCION. Error ${e.toString}")
            throw e
          }
        }
      //}
    }

    // save settings
    //
    tesoreriaSetting.settings.filter(s => s.key != KEY_RETENCION).map(s => saveSetting(s))
    deleteRetenciones()
    tesoreriaSetting.settings.filter(s => s.key == KEY_RETENCION).map(s => saveSetting(s))

    def throwException = {
      throw new RuntimeException(s"Error when saving ${C.CONFIGURACION}")
    }

    // always return what we have saved
    //
    load(user, tesoreriaSetting.userId).getOrElse(throwException)

  }

  def load(user: CompanyUser, id: Int): Option[TesoreriaSetting] = {

    Logger.debug(s"id: $id")

    val generalSettings = loadWhere(
      user,
      s"emp_id IS NULL AND cfg_grupo = '$KEY_GRUPO_GENERAL'"
    )

    Logger.debug(s"generalSettings: ${generalSettings.toString}")

    val companySettings = loadWhere(
      user,
      s"emp_id = {empId} AND cfg_grupo = '$KEY_GRUPO_GENERAL'",
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