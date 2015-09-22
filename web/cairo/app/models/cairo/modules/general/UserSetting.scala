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

case class ComplexSetting(id: String, name: String)
case class Setting(key: String, group: String, value: Any, empId: Int)

case class UserSetting(userId: Int, settings: List[Setting])

object UserSetting {

  lazy val emptyUserSetting = UserSetting(DBHelper.NoId, List())

  private val UserSettingParser: RowParser[Setting] = {
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

  def create(user: CompanyUser, UserSetting: UserSetting): UserSetting = {
    save(user, UserSetting, true)
  }

  def update(user: CompanyUser, UserSetting: UserSetting): UserSetting = {
    save(user, UserSetting, false)
  }

  private def save(user: CompanyUser, UserSetting: UserSetting, isNew: Boolean): UserSetting = {
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
        UserSetting.userId,
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

  def load(user: CompanyUser, id: Int): Option[UserSetting] = {

    Logger.debug(s"id: $id")

    val generalSettings = loadWhere(
      user,
      s"emp_id IS NULL AND cfg_grupo = 'Usuario-Config' and cfg_aspecto like '%_$id'"
    )

    Logger.debug(s"generalSettings: ${generalSettings.toString}")

    val companySettings = loadWhere(
      user,
      s"emp_id = {empId} AND cfg_grupo = 'Usuario-Config' and cfg_aspecto like '%_$id'",
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

    val PURCHASES = " Cpra_"
    val STOCK = "_"
    val SALES = " Vta_"
    val GENERAL = " Gral_"
    val TREASURY = " Tsr_"
    val SERVICES = " Srv_"
    val PREFERENCES = ""

    //
    // sales
    //
    /*
    val GRUPO_USUARIO_CONFIG = "Usuario-Config"
    val INFORMAR_ANTICIPOS = "Informar Anticipos"
    */

    val CLIENTE_X_DEFECTO = "Cliente por Defecto"
    val CUENTA_FVO_X_DEFECTO = "Cuenta Efvo x Defecto"
    /*
    val NUEVO_AL_GRABAR = "Nuevo al Grabar"
    val SHOW_DATA_ADD_IN_VENTAS = "Mostrar Data en Ventas"
    val SHOW_DATA_ADD_IN_COMPRAS = "Mostrar Data en Compras"

    val NUEVO_PTD_AL_GRABAR = "Nuevo PTD al Grabar"
    val PRINT_IN_NEW_FV = "Imprimir en Nueva Factura"
    val PRINT_IN_NEW_COBZ_CDO = "Imprimir en Cobranza Cdo"
    */
    val ESTADO_HOJA_RUTA = "Estado en Hoja de Ruta"
    val ESTADO_PICKING_LIST = "Estado en Picking List"
    /*
    val CLOSE_WIZARD = "Cerrar el Asistente al Finalizar"
    val NO_ASK_IN_PRINT = "No Pedir Confirmar al Imprimir"
    */
    //
    // sale documents
    //
    val DOC_PREV = "Documento de Presupuesto"
    val DOC_PV = "Documento de Pedido"
    val DOC_RV = "Documento de Remito"
    val DOC_FV = "Documento de Factura"
    val DOC_COBZ = "Documento de Cobranza Contado"

    val DOC_RV_C = "Documento Cancelacion de Remito"

    //
    // purchase documents
    //
    val DOC_PC = "Documento de Pedido"
    val DOC_OC = "Documento de Orden de Compra"
    val DOC_COT = "Documento de Cotizacion"
    val DOC_RC = "Documento de Remito"
    val DOC_FC = "Documento de Factura"

    //
    // treasury
    //
    //val DEBE_HABER_MF = "Usar Debe Haber en Movimiento de Fondos"

    //
    // treasury documents
    //
    val DOC_MF = "Documento de Movimiento de Fondos"
    val DOC_DBCO = "Documento de Deposito Bancario"
    val DOC_LIQ = "Documento de Liquidacion"

    //
    // service documents
    //
    val DOC_OS = "Documento de Orden de Servicios"
    val DOC_PRP = "Documento de Parte de Reparacion"
    //val PRP_ESTADO_X_DEF = "Usar Rep. y Aprob. x Defecto en P.Rep."

    //
    // picking list
    //
    val PKL_DOC_FACTURA = "Documento Factura Despachos"
    val PKL_DOC_INTERNO = "Documento Interno Despachos"

    //
    // journal notes
    //
    //val PTD_FECHA = "Cambiar Fecha Fin en Partes Diarios"

    //
    // printing
    //
    //val USE_PRINTER_SIZE = "Usar el Tamaño de Papel que Reporta la Impresora"

    //
    // stock
    //
    val DEPOSITO = "Deposito"
    val DEPOSITO_SRV = "Deposito Servicios"

    //
    // language
    //
    val LENGUAJE = "Lenguaje"

    //
    // desktop
    //
    //val DESKTOP = "Escritorio"

    //
    // grid columns
    //
    //val AUTO_SIZE_COLS = "Autoajustar Columnas"

    //
    // selection
    //
    //val MULTI_SELECT = "Usar Multiple Seleccion"

    //
    // barcode
    //
    //val SHOW_BARCODE_INPUT_CTRLS = "Mostar Controles para Codigos de Barras"

    //
    // toolbar
    //
    //val VIEW_NAMES_IN_TOOLBAR = "Ver Nombre en Toolbar"

    //
    // saving
    //
    //val SHOW_SAVE_AS = "Mostrar Guardar Como"

    //
    // wizards
    //
    //val SHOW_ALL_IN_WIZARD = "Mostrar todos los comprobantes en asistentes"

    //
    // export
    //
    //val FOLDER_TO_EXPORT_PDF = "Carpeta destino de exportación PDF"

    //
    // colors
    //
    /*
    val USAR_COLORES_EN_DOC = "Usar colores en doc"
    val COLOR_EN_EMPRESA = "Color Empresa"

    val CONFIG_KEY = "cfg_aspecto"
    val CONFIG_VALUE = "cfg_valor"
    */

    def ck(key: String, group: String) = {
      s"$key$group$id";
    }

    /*
    val keyInfAnticipos = ck(INFORMAR_ANTICIPOS, SALES)
    val keyNuevoAlGrabar = ck(NUEVO_AL_GRABAR, SALES)
    val keyPrintInNewFv = ck(PRINT_IN_NEW_FV, SALES)
    val keyPrintInNewCobzCdo = ck(PRINT_IN_NEW_COBZ_CDO, SALES)
    val keyNuevoPTDAlGrabar = ck(NUEVO_PTD_AL_GRABAR, SALES)
    val keyUsePrinterSize = ck(USE_PRINTER_SIZE, GENERAL)

    val keyShowDataAddInVentas = ck(SHOW_DATA_ADD_IN_VENTAS, SALES)
    val keyShowDataAddInCompras = ck(SHOW_DATA_ADD_IN_COMPRAS, PURCHASES)

    val keyViewNamesInTb = ck(VIEW_NAMES_IN_TOOLBAR, GENERAL)
    val keyUsarColoresEnDoc = ck(USAR_COLORES_EN_DOC, GENERAL)

    val keyCloseWizard = ck(CLOSE_WIZARD, SALES)
    val keyNoAskInPrint = ck(NO_ASK_IN_PRINT, SALES)
    */
    val KEY_DOC_PC = ck(DOC_PC, PURCHASES)
    val KEY_DOC_COT = ck(DOC_COT, PURCHASES)
    val KEY_DOC_OC = ck(DOC_OC, PURCHASES)
    val KEY_DOC_RC = ck(DOC_RC, PURCHASES)
    val KEY_DOC_FC = ck(DOC_FC, PURCHASES)

    val KEY_DOC_PV = ck(DOC_PV, SALES)
    val KEY_DOC_PREV = ck(DOC_PREV, SALES)
    val KEY_DOC_RV = ck(DOC_RV, SALES)
    val KEY_DOC_RVC = ck(DOC_RV_C, SALES)
    val KEY_DOC_FV = ck(DOC_FV, SALES)
    val KEY_DOC_COBZ = ck(DOC_COBZ, SALES)

    val KEY_PK_DOC_FAC = ck(PKL_DOC_FACTURA, SALES)
    val KEY_PK_DOC_INT = ck(PKL_DOC_INTERNO, SALES)

    val KEY_DOC_OS = ck(DOC_OS, SERVICES)
    val KEY_DOC_PRP = ck(DOC_PRP, SERVICES)

    /*
    val keyPtdFecha = ck(PTD_FECHA, SERVICES)
    val keyPrpEstadoDef = ck(PRP_ESTADO_X_DEF, SERVICES)
    */

    val KEY_DOC_MF = ck(DOC_MF, TREASURY)
    val KEY_DOC_DBCO = ck(DOC_DBCO, TREASURY)
    //val keyDebeHaberMf = ck(DEBE_HABER_MF, TREASURY)

    val KEY_DOC_LIQ = ck(DOC_LIQ, PREFERENCES)
    
    val KEY_DEPL = ck(DEPOSITO, STOCK)
    val KEY_DEPL_SRV = ck(DEPOSITO_SRV, STOCK)
    /*
    val keyDesktop = ck(DESKTOP, GENERAL)
    */
    val KEY_LENGUAJE = ck(LENGUAJE, GENERAL)
    /*
    val keyAutoSizeCols = ck(AUTO_SIZE_COLS, GENERAL)
    val keyMultiSelect = ck(MULTI_SELECT, GENERAL)
    val keyShowSaveAs = ck(SHOW_SAVE_AS, GENERAL)
    val keyShowAllInWizard = ck(SHOW_ALL_IN_WIZARD, GENERAL)
    val keyFolderToExportPDF = ck(FOLDER_TO_EXPORT_PDF, GENERAL)
    */
    val KEY_CUENTA_FVO = ck(CUENTA_FVO_X_DEFECTO, SALES)
    val KEY_CLIENTE = ck(CLIENTE_X_DEFECTO, SALES)

    val KEY_ESTADO_HOJA_RUTA = ck(ESTADO_HOJA_RUTA, SALES)
    val KEY_ESTADO_PICKING_LIST = ck(ESTADO_PICKING_LIST, SALES)

    //val keyColorEmpresa = ck(COLOR_EN_EMPRESA, GENERAL)
    
    def getId(value: String): Int = {
      try {
        value.toInt
      } catch {
        case NonFatal(e) => {
          0
        }
      }
    }
    
    // TODO: Dry this. this constant is already defined in Select.scala
    //
    val NODE_PREFIX = "N"
    
    def isNode(value: String) = {
      value.startsWith(NODE_PREFIX)
    }
    def getNodeId(value: String) = {
      getId(value.substring(1))
    }
    def getStringFromAny(anyValue: Any, default: String) = anyValue match {
      case s: String => s
      case _ => default
    }
    def getSelectForKey(key: String, anyValue: Any) = {
      val value = getStringFromAny(anyValue, "0")

      key match {

        case KEY_DOC_PC => {
          val doc_id_pc = getId(value)
          getSelect(doc_id_pc, KEY_DOC_PC)
        }
        case KEY_DOC_COT => {
          val doc_id_cot = getId(value)
          getSelect(doc_id_cot, KEY_DOC_COT)
        }
        case KEY_DOC_OC => {
          val doc_id_oc = getId(value)
          getSelect(doc_id_oc, KEY_DOC_OC)
        }
        case KEY_DOC_RC => {
          val doc_id_rc = getId(value)
          getSelect(doc_id_rc, KEY_DOC_RC)
        }
        case KEY_DOC_FC => {
          val doc_id_fc = getId(value)
          getSelect(doc_id_fc, KEY_DOC_FC)
        }
        case KEY_DOC_PV => {
          val doc_id_pv = getId(value)
          getSelect(doc_id_pv, KEY_DOC_PV)
        }
        case KEY_DOC_PREV => {
          val doc_id_prev = getId(value)
          getSelect(doc_id_prev, KEY_DOC_PREV)
        }
        case KEY_DOC_RV => {
          val doc_id_rv = getId(value)
          getSelect(doc_id_rv, KEY_DOC_RV)
        }
        case KEY_DOC_RVC => {
          val doc_id_rvC = getId(value)
          getSelect(doc_id_rvC, KEY_DOC_RVC)
        }
        case KEY_DOC_FV => {
          val doc_id_fv = getId(value)
          getSelect(doc_id_fv, KEY_DOC_FV)
        }
        case KEY_PK_DOC_FAC => {
          val doc_id_factura = getId(value)
          getSelect(doc_id_factura, KEY_PK_DOC_FAC)
        }
        case KEY_PK_DOC_INT => {
          val doc_id_interno = getId(value)
          getSelect(doc_id_interno, KEY_PK_DOC_INT)
        }
        case KEY_DOC_COBZ => {
          val doc_id_cobz = getId(value)
          getSelect(doc_id_cobz, KEY_DOC_COBZ)
        }
        case KEY_DOC_OS => {
          val doc_id_os = getId(value)
          getSelect(doc_id_os, KEY_DOC_OS)
        }
        case KEY_DOC_PRP => {
          val doc_id_prp = getId(value)
          getSelect(doc_id_prp, KEY_DOC_PRP)
        }
        case KEY_DOC_MF => {
          val doc_id_mf = getId(value)
          getSelect(doc_id_mf, KEY_DOC_MF)
        }
        case KEY_DOC_DBCO => {
          val doc_id_dbco = getId(value)
          getSelect(doc_id_dbco, KEY_DOC_DBCO)
        }
        case KEY_DOC_LIQ => {
          val doc_id_liq = getId(value)
          getSelect(doc_id_liq, KEY_DOC_LIQ)
        }
        case KEY_DEPL => {
          val depl_id = getId(value)
          getSelectForTable(C.DEPOSITO_LOGICO, C.DEPL_ID, C.DEPL_NAME, depl_id, KEY_DEPL)
        }
        case KEY_DEPL_SRV => {
          val depl_id_srv = getId(value)
          getSelectForTable(C.DEPOSITO_LOGICO, C.DEPL_ID, C.DEPL_NAME, depl_id_srv, KEY_DEPL_SRV)
        }
        case KEY_LENGUAJE => {
          val leng_id = getId(value)
          getSelectForTable(C.LENGUAJE, C.LENG_ID, C.LENG_NAME, leng_id, KEY_LENGUAJE)
        }
        case KEY_CLIENTE => {
          val cliIdXDefecto = getId(value)
          getSelectForTable(C.CLIENTE, C.CLI_ID, C.CLI_NAME, cliIdXDefecto, KEY_CLIENTE)
        }
        case KEY_CUENTA_FVO => {
          val cueIdFvoXDefecto = getId(value)
          getSelectForTable(C.CUENTA, C.CUE_ID, C.CUE_NAME, cueIdFvoXDefecto, KEY_CUENTA_FVO)
        }
        case KEY_ESTADO_HOJA_RUTA => {
          val est_id_hojaRuta = value

          if(isNode(est_id_hojaRuta)) {
            getSelectForTable(C.BRANCH, C.BRAN_ID, C.BRAN_NAME, getNodeId(est_id_hojaRuta), KEY_ESTADO_HOJA_RUTA)
          }
          else {
            getSelectForTable(C.ESTADO, C.EST_ID, C.EST_NAME, getId(est_id_hojaRuta), KEY_ESTADO_HOJA_RUTA)
          }
        }
        case KEY_ESTADO_PICKING_LIST => {
          val estIdPickingList = value

          if(isNode(estIdPickingList)) {
            getSelectForTable(C.BRANCH, C.BRAN_ID, C.BRAN_NAME, getNodeId(estIdPickingList), KEY_ESTADO_PICKING_LIST)
          }
          else {
            getSelectForTable(C.ESTADO, C.EST_ID, C.EST_NAME, getId(estIdPickingList), KEY_ESTADO_PICKING_LIST)
          }
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

    Some(UserSetting(id, generalSettings ::: complexSettings))
  }

  def loadWhere(user: CompanyUser, where: String, args : scala.Tuple2[scala.Any, anorm.ParameterValue[_]]*) = {
    val sqlstmt = s"SELECT * FROM ${C.CONFIGURACION} WHERE $where"
    Logger.debug(s"loadWhere: sqlstmt: $sqlstmt")
    DB.withConnection(user.database.database) { implicit connection =>
      SQL(sqlstmt)
        .on(args: _*)
        .as(UserSettingParser.*)
    }
  }

  def loadSql(user: CompanyUser, sqlstmt: String, args : scala.Tuple2[scala.Any, anorm.ParameterValue[_]]*) = {
    Logger.debug(s"loadSql: sqlstmt: $sqlstmt")
    DB.withConnection(user.database.database) { implicit connection =>
      SQL(sqlstmt)
        .on(args: _*)
        .as(UserSettingParser.*)
    }
  }

  def get(user: CompanyUser, id: Int): UserSetting = {
    load(user, id) match {
      case Some(p) => p
      case None => emptyUserSetting
    }
  }

  def getCajaInfo(user: CompanyUser): Recordset = {

    DB.withTransaction(user.database.database) { implicit connection =>

      val sql = "{call sp_movimiento_caja_get_caja_for_user(?, ?, ?)}"
      val cs = connection.prepareCall(sql)

      cs.setInt(1, user.userId)
      cs.setInt(2, user.cairoCompanyId)
      cs.registerOutParameter(3, Types.OTHER)

      try {
        cs.execute()

        val rs = cs.getObject(3).asInstanceOf[java.sql.ResultSet]
        Recordset.load(rs)

      } catch {
        case NonFatal(e) => {
          Logger.error(s"can't get caja for user with usId $user.userId and empId ${user.cairoCompanyId} for user ${user.toString}. Error ${e.toString}")
          throw e
        }
      } finally {
        cs.close
      }
    }
  }
}