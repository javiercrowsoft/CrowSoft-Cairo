package controllers.logged.modules.tesoreria

import controllers._
import play.api.mvc._
import play.api.data._
import play.api.data.Forms._
import actions._
import play.api.Logger
import play.api.libs.json._
import models.cairo.modules.tesoreria._
import models.cairo.system.security.CairoSecurity
import models.cairo.system.database.{Recordset, DBHelper}
import formatters.json.DateFormatter
import formatters.json.DateFormatter._
import scala.util.control.NonFatal

import Global.{getJsValueAsMap, getParamsJsonRequestFor, preprocessFormParams, doubleFormat, getParamsFromJsonRequest}

case class DepositoBancoIdData(
                                  docId: Int,
                                  numero: Int,
                                  nroDoc: String
                                )

case class DepositoBancoBaseData(
                                    bcoId: Int,
                                    estId: Int,
                                    ccosId: Int,
                                    sucId: Int,
                                    lgjId: Int,
                                    descrip: String,
                                    grabarAsiento: Boolean
                                  )

case class DepositoBancoItemBaseData(
                                        descrip: Option[String],
                                        cueIdDebe: Int,
                                        cueIdHaber: Int,
                                        ccosId: Option[Int],
                                        orden: Int
                                      )

case class DepositoBancoItemTotalsData(
                                          importe: Double,
                                          importeOrigen: Double
                                        )

case class DepositoBancoItemChequeData(
                                          id: Int,
                                          base: DepositoBancoItemBaseData,
                                          monId: Int,
                                          totals: DepositoBancoItemTotalsData,
                                          bcoId: Int,
                                          chqId: Int,
                                          cheqId: Option[Int],
                                          numeroDoc: String,
                                          fechaCobro: String,
                                          fechaVto: String,
                                          cleId: Int
                                        )

case class DepositoBancoItemChequeTData(
                                           id: Int,
                                           base: DepositoBancoItemBaseData,
                                           monId: Int,
                                           totals: DepositoBancoItemTotalsData,
                                           bcoId: Int,
                                           cheqId: Option[Int],
                                           numeroDoc: String,
                                           fechaCobro: String,
                                           fechaVto: String,
                                           cleId: Int
                                         )

case class DepositoBancoItemEfectivoData(
                                            id: Int,
                                            base: DepositoBancoItemBaseData,
                                            totals: DepositoBancoItemTotalsData
                                          )

case class DepositoBancoData(
                                id: Option[Int],
                                ids: DepositoBancoIdData,
                                base: DepositoBancoBaseData,
                                fecha: String,
                                cotizacion: Double,
                                total: Double,
                                cheques: List[DepositoBancoItemChequeData],
                                chequesT: List[DepositoBancoItemChequeTData],
                                efectivo: List[DepositoBancoItemEfectivoData],

                                chequeDeleted: String,
                                chequeTDeleted: String,
                                efectivoDeleted: String
                              )

case class DepositoBancoParamsData(
                                      from: String,
                                      to: String,
                                      bcoId: String,
                                      estId: String,
                                      ccosId: String,
                                      sucId: String,
                                      docId: String,
                                      empId: String
                                    )

object DepositosBanco extends Controller with ProvidesUser {

  val GC = models.cairo.modules.general.C

  val depositoBancoParamsForm: Form[DepositoBancoParamsData] = Form(
    mapping(
      GC.FROM -> text,
      GC.TO -> text,
      GC.BCO_ID -> text,
      GC.EST_ID -> text,
      GC.CCOS_ID -> text,
      GC.SUC_ID -> text,
      GC.DOC_ID -> text,
      GC.EMP_ID -> text
    )(DepositoBancoParamsData.apply)(DepositoBancoParamsData.unapply)
  )

  val depositoBancoIdFields = List(GC.DOC_ID, C.DBCO_NUMERO, C.DBCO_NRODOC)

  val depositoBancoBaseFields = List(GC.BCO_ID, GC.EST_ID, GC.CCOS_ID, GC.SUC_ID, GC.LGJ_ID, C.DBCO_DESCRIP,
    C.DBCO_GRABAR_ASIENTO)

  val depositoBancoTotalsFields = List(C.DBCO_TOTAL)

  val depositoBancoItemBase = List(C.DBCOI_DESCRIP, GC.PR_ID, GC.CCOS_ID, GC.TO_ID, GC.CUE_ID, C.DBCOI_ORDEN)

  val depositoBancoItemTotals = List(C.DBCOI_IMPORTE, C.DBCOI_IMPORTE_ORIGEN)

  val depositoBancoForm: Form[DepositoBancoData] = Form(
    mapping(
      "id" -> optional(number),
      C.DEPOSITO_BANCO_ID -> mapping(
        GC.DOC_ID -> number,
        C.DBCO_NUMERO -> number,
        C.DBCO_NRODOC -> text)
      (DepositoBancoIdData.apply)(DepositoBancoIdData.unapply),
      C.DEPOSITO_BANCO_BASE -> mapping(
        GC.BCO_ID -> number,
        GC.EST_ID -> number,
        GC.CCOS_ID -> number,
        GC.SUC_ID -> number,
        GC.LGJ_ID -> number,
        C.DBCO_DESCRIP -> text,
        C.DBCO_GRABAR_ASIENTO -> boolean)
      (DepositoBancoBaseData.apply)(DepositoBancoBaseData.unapply),
      C.DBCO_FECHA -> text,
      C.DBCO_COTIZACION -> of(doubleFormat),
      C.DBCO_TOTAL -> of(doubleFormat),
      C.DEPOSITO_BANCO_ITEM_CHEQUE_TMP -> Forms.list[DepositoBancoItemChequeData](
        mapping(
          C.DBCOI_ID -> number,
          C.DEPOSITO_BANCO_ITEM_BASE -> mapping (
            C.DBCOI_DESCRIP -> optional(text),
            C.CUE_ID_DEBE -> number,
            C.CUE_ID_HABER -> number,
            GC.CCOS_ID -> optional(number),
            C.DBCOI_ORDEN -> number)
          (DepositoBancoItemBaseData.apply)(DepositoBancoItemBaseData.unapply),
          GC.MON_ID -> number,
          C.DEPOSITO_BANCO_ITEM_TOTALS -> mapping (
            C.DBCOI_IMPORTE -> of(doubleFormat),
            C.DBCOI_IMPORTE_ORIGEN -> of(doubleFormat))
          (DepositoBancoItemTotalsData.apply)(DepositoBancoItemTotalsData.unapply),
          GC.BCO_ID -> number,
          GC.CHQ_ID -> number,
          C.CHEQ_ID -> optional(number),
          C.DBCOI_TMP_CHEQUE -> text,
          C.DBCOI_TMP_FECHA_COBRO -> text,
          C.DBCOI_TMP_FECHA_VTO -> text,
          GC.CLE_ID -> number
        )(DepositoBancoItemChequeData.apply)(DepositoBancoItemChequeData.unapply)
      ),
      C.DEPOSITO_BANCO_ITEM_CHEQUET_TMP -> Forms.list[DepositoBancoItemChequeTData](
        mapping(
          C.DBCOI_ID -> number,
          C.DEPOSITO_BANCO_ITEM_BASE -> mapping (
            C.DBCOI_DESCRIP -> optional(text),
            C.CUE_ID_DEBE -> number,
            C.CUE_ID_HABER -> number,
            GC.CCOS_ID -> optional(number),
            C.DBCOI_ORDEN -> number)
          (DepositoBancoItemBaseData.apply)(DepositoBancoItemBaseData.unapply),
          GC.MON_ID -> number,
          C.DEPOSITO_BANCO_ITEM_TOTALS -> mapping (
            C.DBCOI_IMPORTE -> of(doubleFormat),
            C.DBCOI_IMPORTE_ORIGEN -> of(doubleFormat))
          (DepositoBancoItemTotalsData.apply)(DepositoBancoItemTotalsData.unapply),
          GC.BCO_ID -> number,
          C.CHEQ_ID -> optional(number),
          C.DBCOI_TMP_CHEQUE -> text,
          C.DBCOI_TMP_FECHA_COBRO -> text,
          C.DBCOI_TMP_FECHA_VTO -> text,
          GC.CLE_ID -> number
        )(DepositoBancoItemChequeTData.apply)(DepositoBancoItemChequeTData.unapply)
      ),
      C.DEPOSITO_BANCO_ITEM_EFECTIVO_TMP -> Forms.list[DepositoBancoItemEfectivoData](
        mapping(
          C.DBCOI_ID -> number,
          C.DEPOSITO_BANCO_ITEM_BASE -> mapping (
            C.DBCOI_DESCRIP -> optional(text),
            C.CUE_ID_DEBE -> number,
            C.CUE_ID_HABER -> number,
            GC.CCOS_ID -> optional(number),
            C.DBCOI_ORDEN -> number)
          (DepositoBancoItemBaseData.apply)(DepositoBancoItemBaseData.unapply),
          C.DEPOSITO_BANCO_ITEM_TOTALS -> mapping (
            C.DBCOI_IMPORTE -> of(doubleFormat),
            C.DBCOI_IMPORTE_ORIGEN -> of(doubleFormat))
          (DepositoBancoItemTotalsData.apply)(DepositoBancoItemTotalsData.unapply)
        )(DepositoBancoItemEfectivoData.apply)(DepositoBancoItemEfectivoData.unapply)
      ),
      C.DEPOSITO_BANCO_ITEM_CHEQUE_DELETED -> text,
      C.DEPOSITO_BANCO_ITEM_CHEQUET_DELETED -> text,
      C.DEPOSITO_BANCO_ITEM_EFECTIVO_DELETED -> text
    )(DepositoBancoData.apply)(DepositoBancoData.unapply)
  )

  implicit val depositoBancoParamsWrites = new Writes[DepositoBancoParams] {
    def writes(depositoBancoParams: DepositoBancoParams) = Json.obj(
      GC.FROM -> Json.toJson(depositoBancoParams.from),
      GC.TO -> Json.toJson(depositoBancoParams.to),
      GC.BCO_ID -> Json.toJson(depositoBancoParams.bcoId),
      GC.CLI_NAME -> Json.toJson(depositoBancoParams.bcoName),
      GC.EST_ID -> Json.toJson(depositoBancoParams.estId),
      GC.EST_NAME -> Json.toJson(depositoBancoParams.estName),
      GC.CCOS_ID -> Json.toJson(depositoBancoParams.ccosId),
      GC.CCOS_NAME -> Json.toJson(depositoBancoParams.ccosName),
      GC.SUC_ID -> Json.toJson(depositoBancoParams.sucId),
      GC.SUC_NAME -> Json.toJson(depositoBancoParams.sucName),
      GC.DOC_ID -> Json.toJson(depositoBancoParams.docId),
      GC.DOC_NAME -> Json.toJson(depositoBancoParams.docName),
      GC.EMP_ID -> Json.toJson(depositoBancoParams.empId),
      GC.EMP_NAME -> Json.toJson(depositoBancoParams.empName)
    )
  }

  implicit val depositoBancoWrites = new Writes[DepositoBanco] {
    def writes(depositoBanco: DepositoBanco) = Json.obj(
      "id" -> Json.toJson(depositoBanco.id),
      C.DBCO_ID -> Json.toJson(depositoBanco.id),

      GC.DOC_ID -> Json.toJson(depositoBanco.ids.docId),
      GC.DOC_NAME -> Json.toJson(depositoBanco.ids.docName),
      C.DBCO_NRODOC -> Json.toJson(depositoBanco.ids.nroDoc),
      C.DBCO_NUMERO -> Json.toJson(depositoBanco.ids.numero),

      C.DBCO_FECHA -> Json.toJson(depositoBanco.fecha),

      GC.BCO_ID -> Json.toJson(depositoBanco.base.bcoId),
      GC.CLI_NAME -> Json.toJson(depositoBanco.base.bcoName),
      GC.EST_ID -> Json.toJson(depositoBanco.base.estId),
      GC.EST_NAME -> Json.toJson(depositoBanco.base.estName),
      GC.SUC_ID -> Json.toJson(depositoBanco.base.sucId),
      GC.SUC_NAME -> Json.toJson(depositoBanco.base.sucName),
      GC.CCOS_ID -> Json.toJson(depositoBanco.base.ccosId),
      GC.CCOS_NAME -> Json.toJson(depositoBanco.base.ccosName),
      GC.LGJ_ID -> Json.toJson(depositoBanco.base.lgjId),
      GC.LGJ_CODE -> Json.toJson(depositoBanco.base.lgjCode),
      C.DBCO_DESCRIP -> Json.toJson(depositoBanco.base.descrip),
      C.DBCO_GRABAR_ASIENTO -> Json.toJson(depositoBanco.base.grabarAsiento),

      GC.DOCT_ID -> Json.toJson(depositoBanco.references.doctId),
      GC.DOCT_NAME -> Json.toJson(depositoBanco.references.doctName),
      GC.TA_MASCARA -> Json.toJson(depositoBanco.references.taMascara),
      GC.TA_PROPUESTO -> Json.toJson(depositoBanco.references.taPropuesto),
      C.DBCO_FIRMADO -> Json.toJson(depositoBanco.references.firmado),
      C.AS_ID -> Json.toJson(depositoBanco.references.asId),
      GC.EDITABLE -> Json.toJson(depositoBanco.references.editable),
      GC.EDIT_MSG -> Json.toJson(depositoBanco.references.editMsg),

      C.DBCO_COTIZACION -> Json.toJson(depositoBanco.cotizacion),
      C.DBCO_TOTAL -> Json.toJson(depositoBanco.total),

      "cheques" -> Json.toJson(writeDepositoBancoCheques(depositoBanco.items.cheques)),
      "chequesT" -> Json.toJson(writeDepositoBancoChequesT(depositoBanco.items.chequesT)),
      "efectivo" -> Json.toJson(writeDepositoBancoEfectivo(depositoBanco.items.efectivo))
    )
    def depositoBancoChequeWrites(i: DepositoBancoItemCheque) = Json.obj(
      C.DBCOI_ID -> Json.toJson(i.id),
      C.DBCOI_DESCRIP -> Json.toJson(i.base.descrip),
      C.CUE_ID_DEBE -> Json.toJson(i.base.cueIdDebe),
      C.CUE_DEBE_NAME -> Json.toJson(i.base.cueNameDebe),
      C.CUE_ID_HABER -> Json.toJson(i.base.cueIdHaber),
      C.CUE_DEBE_NAME -> Json.toJson(i.base.cueNameHaber),
      GC.CCOS_ID -> Json.toJson(i.base.ccosId),
      GC.CCOS_NAME -> Json.toJson(i.base.ccosName),
      GC.MON_ID -> Json.toJson(i.moneda.monId),
      GC.MON_NAME -> Json.toJson(i.moneda.monName),
      C.DBCOI_ORDEN -> Json.toJson(i.base.orden),
      C.DBCOI_IMPORTE -> Json.toJson(i.totals.importe),
      C.DBCOI_IMPORTE_ORIGEN -> Json.toJson(i.totals.importeOrigen),
      GC.BCO_ID -> Json.toJson(i.bcoId),
      GC.BCO_NAME -> Json.toJson(i.bcoName),
      GC.CHQ_ID -> Json.toJson(i.chqId),
      GC.CHQ_CODE -> Json.toJson(i.chqName),
      C.CHEQ_ID -> Json.toJson(i.cheqId),
      C.CHEQ_NUMERO -> Json.toJson(i.numero),
      C.CHEQ_NUMERO_DOC -> Json.toJson(i.numeroDoc),
      C.CHEQ_FECHA_COBRO -> Json.toJson(i.fechaCobro),
      C.CHEQ_FECHA_VTO -> Json.toJson(i.fechaVto),
      GC.CLE_ID -> Json.toJson(i.cleId),
      GC.CLE_NAME -> Json.toJson(i.cleName)
    )
    def depositoBancoChequeTWrites(i: DepositoBancoItemChequeT) = Json.obj(
      C.DBCOI_ID -> Json.toJson(i.id),
      C.DBCOI_DESCRIP -> Json.toJson(i.base.descrip),
      C.CUE_ID_DEBE -> Json.toJson(i.base.cueIdDebe),
      C.CUE_DEBE_NAME -> Json.toJson(i.base.cueNameDebe),
      C.CUE_ID_HABER -> Json.toJson(i.base.cueIdHaber),
      C.CUE_HABER_NAME -> Json.toJson(i.base.cueNameHaber),
      GC.CCOS_ID -> Json.toJson(i.base.ccosId),
      GC.CCOS_NAME -> Json.toJson(i.base.ccosName),
      GC.MON_ID -> Json.toJson(i.moneda.monId),
      GC.MON_NAME -> Json.toJson(i.moneda.monName),
      C.DBCOI_ORDEN -> Json.toJson(i.base.orden),
      C.DBCOI_IMPORTE -> Json.toJson(i.totals.importe),
      C.DBCOI_IMPORTE_ORIGEN -> Json.toJson(i.totals.importeOrigen),
      GC.BCO_ID -> Json.toJson(i.bcoId),
      GC.BCO_NAME -> Json.toJson(i.bcoName),
      C.CHEQ_ID -> Json.toJson(i.cheqId),
      C.CHEQ_NUMERO -> Json.toJson(i.numero),
      C.CHEQ_NUMERO_DOC -> Json.toJson(i.numeroDoc),
      C.CHEQ_FECHA_COBRO -> Json.toJson(i.fechaCobro),
      C.CHEQ_FECHA_VTO -> Json.toJson(i.fechaVto),
      GC.CLE_ID -> Json.toJson(i.cleId),
      GC.CLE_NAME -> Json.toJson(i.cleName)
    )
    def depositoBancoEfectivoWrites(i: DepositoBancoItemEfectivo) = Json.obj(
      C.DBCOI_ID -> Json.toJson(i.id),
      C.DBCOI_DESCRIP -> Json.toJson(i.base.descrip),
      GC.CUE_ID -> Json.toJson(i.base.cueIdDebe),
      GC.CUE_NAME -> Json.toJson(i.base.cueNameDebe),
      GC.MON_ID -> Json.toJson(i.moneda.monId),
      GC.MON_NAME -> Json.toJson(i.moneda.monName),
      GC.CCOS_ID -> Json.toJson(i.base.ccosId),
      GC.CCOS_NAME -> Json.toJson(i.base.ccosName),
      GC.MON_ID -> Json.toJson(i.moneda.monId),
      GC.MON_NAME -> Json.toJson(i.moneda.monName),
      C.DBCOI_ORDEN -> Json.toJson(i.base.orden),
      C.DBCOI_IMPORTE -> Json.toJson(i.totals.importe),
      C.DBCOI_IMPORTE_ORIGEN -> Json.toJson(i.totals.importeOrigen)
    )
    def writeDepositoBancoCheques(items: List[DepositoBancoItemCheque]) = items.map(item => depositoBancoChequeWrites(item))
    def writeDepositoBancoChequesT(items: List[DepositoBancoItemChequeT]) = items.map(item => depositoBancoChequeTWrites(item))
    def writeDepositoBancoEfectivo(items: List[DepositoBancoItemEfectivo]) = items.map(item => depositoBancoEfectivoWrites(item))
  }

  def get(id: Int) = GetAction { implicit request =>
    LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.LIST_DEPOSITO_BANCO), { user =>
      Ok(Json.toJson(DepositoBanco.get(user, id)))
    })
  }

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //
  // this functions convert the plain JSON received in CREATE and UPDATE into a DepositoBancoData structure
  //
  // because the limitation to 18 fields in case class used for FORM mapping we have grouped the fields
  // in DepositoBanco/Data, DepositoBancoItem/Data, etc
  //
  // the below routines group a flat JSON and in some cases rename the name of the fields or move
  // fields to the parent node in the JSON structure to match the case class
  //

  private def preprocessParams(implicit request:Request[AnyContent]): JsObject = {

    def preprocessChequeParam(field: JsValue) = {
      val params = field.as[Map[String, JsValue]]

      // groups for DepositoBancoChequeData
      //
      val depositoBancoCheque = preprocessFormParams(
        List(C.DBCOI_ID, GC.MON_ID, GC.BCO_ID, GC.CHQ_ID, C.CHEQ_ID, C.DBCOI_TMP_CHEQUE, C.DBCOI_TMP_FECHA_COBRO,
          C.DBCOI_TMP_FECHA_VTO, GC.CLE_ID), "", params)
      val depositoBancoChequeBaseGroup = preprocessFormParams(depositoBancoItemBase, C.DEPOSITO_BANCO_ITEM_BASE, params)
      val depositoBancoChequeTotalsGroup = preprocessFormParams(depositoBancoItemTotals, C.DEPOSITO_BANCO_ITEM_TOTALS, params)

      val cheque = JsObject(
        (depositoBancoCheque ++ depositoBancoChequeBaseGroup ++ depositoBancoChequeTotalsGroup).toSeq)
      cheque
    }

    def preprocessChequeTParam(field: JsValue) = {
      val params = field.as[Map[String, JsValue]]

      // groups for DepositoBancoChequeTData
      //
      val depositoBancoChequeT = preprocessFormParams(
        List(C.DBCOI_ID, GC.MON_ID, GC.BCO_ID, GC.BCO_ID, C.CHEQ_ID, C.DBCOI_TMP_CHEQUE, C.DBCOI_TMP_FECHA_COBRO,
          C.DBCOI_TMP_FECHA_VTO, GC.CLE_ID), "", params)
      val depositoBancoChequeTBaseGroup = preprocessFormParams(depositoBancoItemBase, C.DEPOSITO_BANCO_ITEM_BASE, params)
      val depositoBancoChequeTTotalsGroup = preprocessFormParams(depositoBancoItemTotals, C.DEPOSITO_BANCO_ITEM_TOTALS, params)

      val chequeT = JsObject(
        (depositoBancoChequeT ++ depositoBancoChequeTBaseGroup ++ depositoBancoChequeTTotalsGroup).toSeq)
      chequeT
    }

    def preprocessChequeIParam(field: JsValue) = {
      val params = field.as[Map[String, JsValue]]

      // groups for DepositoBancoChequeIData
      //
      val depositoBancoChequeI = preprocessFormParams(
        List(C.DBCOI_ID, GC.MON_ID, GC.BCO_ID, GC.BCO_ID, C.CHEQ_ID, C.DBCOI_TMP_CHEQUE, C.DBCOI_TMP_FECHA_COBRO,
          C.DBCOI_TMP_FECHA_VTO, GC.CLE_ID), "", params)
      val depositoBancoChequeIBaseGroup = preprocessFormParams(depositoBancoItemBase, C.DEPOSITO_BANCO_ITEM_BASE, params)
      val depositoBancoChequeITotalsGroup = preprocessFormParams(depositoBancoItemTotals, C.DEPOSITO_BANCO_ITEM_TOTALS, params)

      val chequeI = JsObject(
        (depositoBancoChequeI ++ depositoBancoChequeIBaseGroup ++ depositoBancoChequeITotalsGroup).toSeq)
      chequeI
    }

    def preprocessEfectivoParam(field: JsValue) = {
      val params = field.as[Map[String, JsValue]]

      // groups for DepositoBancoEfectivoData
      //
      val depositoBancoEfectivo = preprocessFormParams(List(C.DBCOI_ID, GC.MON_ID), "", params)
      val depositoBancoEfectivoBaseGroup = preprocessFormParams(depositoBancoItemBase, C.DEPOSITO_BANCO_ITEM_BASE, params)
      val depositoBancoEfectivoTotalsGroup = preprocessFormParams(depositoBancoItemTotals, C.DEPOSITO_BANCO_ITEM_TOTALS, params)

      val efectivo = JsObject(
        (depositoBancoEfectivo ++ depositoBancoEfectivoBaseGroup ++ depositoBancoEfectivoTotalsGroup).toSeq)
      efectivo
    }

    def preprocessChequesParam(items: JsValue, group: String): Map[String, JsValue] = items match {
      case JsArray(arr) => Map(group -> JsArray(arr.map(preprocessChequeParam(_))))
      case _ => Map.empty
    }

    def preprocessChequesTParam(items: JsValue, group: String): Map[String, JsValue] = items match {
      case JsArray(arr) => Map(group -> JsArray(arr.map(preprocessChequeTParam(_))))
      case _ => Map.empty
    }

    def preprocessEfectivosParam(items: JsValue, group: String): Map[String, JsValue] = items match {
      case JsArray(arr) => Map(group -> JsArray(arr.map(preprocessEfectivoParam(_))))
      case _ => Map.empty
    }

    val params = getParamsFromJsonRequest

    // groups for DepositoBancoData
    //
    val facturaId = preprocessFormParams(List("id", C.DBCO_FECHA, C.DBCO_COTIZACION), "", params)
    val facturaIdGroup = preprocessFormParams(depositoBancoIdFields, C.DEPOSITO_BANCO_ID, params)
    val facturaBaseGroup = preprocessFormParams(depositoBancoBaseFields, C.DEPOSITO_BANCO_BASE, params)
    val facturaTotalGroup = preprocessFormParams(depositoBancoTotalsFields, C.DEPOSITO_BANCO_TOTALS, params)

    // cheques
    //
    val chequesInfo = getJsValueAsMap(getParamsJsonRequestFor(C.DEPOSITO_BANCO_ITEM_CHEQUE_TMP, params))
    val chequeRows = getParamsJsonRequestFor(GC.ITEMS, chequesInfo)
    val chequeDeleted: Map[String, JsValue] = getParamsJsonRequestFor(GC.DELETED_LIST, chequesInfo).toList match {
      case Nil => Map(C.DEPOSITO_BANCO_ITEM_CHEQUE_DELETED -> Json.toJson(""))
      case deletedList :: t => Map(C.DEPOSITO_BANCO_ITEM_CHEQUE_DELETED -> Json.toJson(deletedList._2))
    }
    val depositoBancoCheques = preprocessChequesParam(chequeRows.head._2, C.DEPOSITO_BANCO_ITEM_CHEQUE_TMP)

    // cheques tercero
    //
    val chequesTInfo = getJsValueAsMap(getParamsJsonRequestFor(C.DEPOSITO_BANCO_ITEM_CHEQUET_TMP, params))
    val chequeTRows = getParamsJsonRequestFor(GC.ITEMS, chequesTInfo)
    val chequeTDeleted: Map[String, JsValue] = getParamsJsonRequestFor(GC.DELETED_LIST, chequesTInfo).toList match {
      case Nil => Map(C.DEPOSITO_BANCO_ITEM_CHEQUET_DELETED -> Json.toJson(""))
      case deletedList :: t => Map(C.DEPOSITO_BANCO_ITEM_CHEQUET_DELETED -> Json.toJson(deletedList._2))
    }
    val depositoBancoChequeT = preprocessChequesTParam(chequeTRows.head._2, C.DEPOSITO_BANCO_ITEM_CHEQUET_TMP)

    // efectivos
    //
    val efectivosInfo = getJsValueAsMap(getParamsJsonRequestFor(C.DEPOSITO_BANCO_ITEM_EFECTIVO_TMP, params))
    val efectivoRows = getParamsJsonRequestFor(GC.ITEMS, efectivosInfo)
    val efectivoDeleted: Map[String, JsValue] = getParamsJsonRequestFor(GC.DELETED_LIST, efectivosInfo).toList match {
      case Nil => Map(C.DEPOSITO_BANCO_ITEM_EFECTIVO_DELETED -> Json.toJson(""))
      case deletedList :: t => Map(C.DEPOSITO_BANCO_ITEM_EFECTIVO_DELETED -> Json.toJson(deletedList._2))
    }
    val depositoBancoEfectivos = preprocessEfectivosParam(efectivoRows.head._2, C.DEPOSITO_BANCO_ITEM_EFECTIVO_TMP)

    JsObject(
      (facturaId ++ facturaIdGroup ++ facturaBaseGroup ++ facturaTotalGroup
        ++ depositoBancoCheques ++ chequeDeleted
        ++ depositoBancoChequeT ++ chequeTDeleted
        ++ depositoBancoEfectivos ++ efectivoDeleted).toSeq)
  }
  //
  //
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  def getCheques(items: List[DepositoBancoItemChequeData]): List[DepositoBancoItemCheque] = {
    items.map(cheque => {
      DepositoBancoItemCheque(
        cheque.id,
        DepositoBancoItemBase(
          cheque.base.descrip.getOrElse(""),
          cheque.base.cueIdDebe,
          cheque.base.cueIdHaber,
          cheque.base.ccosId.getOrElse(DBHelper.NoId),
          cheque.base.orden
        ),
        cheque.monId,
        DepositoBancoItemTotals(
          cheque.totals.importe,
          cheque.totals.importeOrigen
        ),
        cheque.bcoId,
        cheque.chqId,
        cheque.cheqId.getOrElse(DBHelper.NoId),
        cheque.numeroDoc,
        DateFormatter.parse(cheque.fechaCobro),
        DateFormatter.parse(cheque.fechaVto),
        cheque.cleId
      )
    })
  }

  def getChequeT(items: List[DepositoBancoItemChequeTData]): List[DepositoBancoItemChequeT] = {
    items.map(cheque => {
      DepositoBancoItemChequeT(
        cheque.id,
        DepositoBancoItemBase(
          cheque.base.descrip.getOrElse(""),
          cheque.base.cueIdDebe,
          cheque.base.cueIdHaber,
          cheque.base.ccosId.getOrElse(DBHelper.NoId),
          cheque.base.orden
        ),
        cheque.monId,
        DepositoBancoItemTotals(
          cheque.totals.importe,
          cheque.totals.importeOrigen
        ),
        cheque.bcoId,
        cheque.cheqId.getOrElse(DBHelper.NoId),
        cheque.numeroDoc,
        DateFormatter.parse(cheque.fechaCobro),
        DateFormatter.parse(cheque.fechaVto),
        cheque.cleId
      )
    })
  }

  def getEfectivo(items: List[DepositoBancoItemEfectivoData]): List[DepositoBancoItemEfectivo] = {
    items.map(efectivo => {
      DepositoBancoItemEfectivo(
        efectivo.id,
        DepositoBancoItemBase(
          efectivo.base.descrip.getOrElse(""),
          efectivo.base.cueIdDebe,
          efectivo.base.cueIdHaber,
          efectivo.base.ccosId.getOrElse(DBHelper.NoId),
          efectivo.base.orden
        ),
        DBHelper.NoId,
        DepositoBancoItemTotals(
          efectivo.totals.importe,
          efectivo.totals.importeOrigen
        )
      )
    })
  }

  def getDepositoBancoItems(depositoBanco: DepositoBancoData): DepositoBancoItems = {
    DepositoBancoItems(
      getCheques(depositoBanco.cheques),
      getChequeT(depositoBanco.chequesT),
      getEfectivo(depositoBanco.efectivo),

      depositoBanco.chequeDeleted,
      depositoBanco.chequeTDeleted,
      depositoBanco.efectivoDeleted
    )
  }

  def getDepositoBanco(depositoBanco: DepositoBancoData, id: Int): DepositoBanco = {
    DepositoBanco(
      id,
      DepositoBancoId(
        depositoBanco.ids.docId,
        depositoBanco.ids.numero,
        depositoBanco.ids.nroDoc),
      DepositoBancoBase(
        depositoBanco.base.bcoId,
        depositoBanco.base.estId,
        depositoBanco.base.ccosId,
        depositoBanco.base.sucId,
        depositoBanco.base.lgjId,
        depositoBanco.base.descrip,
        depositoBanco.base.grabarAsiento),
      DepositoBanco.emptyDepositoBancoReferences,
      DateFormatter.parse(depositoBanco.fecha),
      depositoBanco.cotizacion,
      depositoBanco.total,
      getDepositoBancoItems(depositoBanco)
    )
  }

  def update(id: Int) = PostAction { implicit request =>
    Logger.debug("in DepositosBanco.update")

    depositoBancoForm.bind(preprocessParams).fold(
      formWithErrors => {
        Logger.debug(s"invalid form: ${formWithErrors.toString}")
        BadRequest
      },
      depositoBanco => {
        Logger.debug(s"form: ${depositoBanco.toString}")
        LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.EDIT_DEPOSITO_BANCO), { user =>
          try {
            Ok(
              Json.toJson(
                DepositoBanco.update(user,
                  getDepositoBanco(depositoBanco, id)
                )
              )
            )
          } catch {
            case NonFatal(e) => {
              responseError(e)
            }
          }
        })
      }
    )
  }

  def createFromFactura = PostAction { implicit request =>
    Logger.debug("in DepositosBanco.createFromFactura")
    depositoBancoForm.bind(preprocessParams).fold(
      formWithErrors => {
        Logger.debug(s"invalid form: ${formWithErrors.toString}")
        BadRequest
      },
      depositoBanco => {
        Logger.debug(s"form: ${depositoBanco.toString}")
        LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.NEW_DEPOSITO_BANCO), { user =>
          try {
            Ok(
              Json.toJson(
                DepositoBanco.createDepositoBanco(user,
                  getDepositoBanco(depositoBanco, DBHelper.NoId)
                )
              )
            )
          } catch {
            case NonFatal(e) => {
              responseError(e)
            }
          }
        })
      }
    )
  }

  def create = PostAction { implicit request =>
    Logger.debug("in DepositosBanco.create")
    depositoBancoForm.bind(preprocessParams).fold(
      formWithErrors => {
        Logger.debug(s"invalid form: ${formWithErrors.toString}")
        BadRequest
      },
      depositoBanco => {
        Logger.debug(s"form: ${depositoBanco.toString}")
        LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.NEW_DEPOSITO_BANCO), { user =>
          try {
            Ok(
              Json.toJson(
                DepositoBanco.create(user,
                  getDepositoBanco(depositoBanco, DBHelper.NoId)
                )
              )
            )
          } catch {
            case NonFatal(e) => {
              responseError(e)
            }
          }
        })
      }
    )
  }

  def responseError(e: Throwable): SimpleResult = {
    if (e.getMessage.contains("@@ERROR_SP:"))
      Ok(
        Json.obj(
          "id" -> 0,
          "errors" -> Json.obj("message" -> e.getMessage.split("@@ERROR_SP:")(1))
        )
      )
    else
      throw e
  }

  def delete(id: Int) = PostAction { implicit request =>
    Logger.debug("in DepositosBanco.delete")
    LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.DELETE_DEPOSITO_BANCO), { user =>
      try {
        DepositoBanco.delete(user, id)
        // Backbonejs requires at least an empty json object in the response
        // if not it will call errorHandler even when we responded with 200 OK :P
        Ok(JsonUtil.emptyJson)
      } catch {
        case NonFatal(e) => {
          responseError(e)
        }
      }
    })
  }

  def list(
            from: Option[String],
            to: Option[String],
            bcoId: Option[String],
            estId: Option[String],
            ccosId: Option[String],
            sucId: Option[String],
            docId: Option[String],
            empId: Option[String]
          ) = GetAction { implicit request =>
    LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.LIST_DEPOSITO_BANCO), { user =>
      Ok(
        Json.toJson(
          Recordset.getAsJson(
            DepositoBanco.list(
              user,
              DateFormatter.parse(from.getOrElse("")), DateFormatter.parse(to.getOrElse("")),
              bcoId, estId, ccosId, sucId, docId, empId))))
    })
  }

  def parameters = GetAction { implicit request =>
    LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.LIST_DEPOSITO_BANCO), { user =>
      Ok(Json.toJson(DepositoBanco.loadParams(user)))
    })
  }

  def saveParameters = PostAction { implicit request =>
    Logger.debug("in DepositosBanco.saveParameters")
    depositoBancoParamsForm.bindFromRequest.fold(
      formWithErrors => {
        Logger.debug(s"invalid form: ${formWithErrors.toString}")
        BadRequest
      },
      depositoBancoParams => {
        Logger.debug(s"form: ${depositoBancoParams.toString}")
        LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.LIST_DEPOSITO_BANCO), { user =>
          Ok(
            Json.toJson(
              DepositoBanco.saveParams(user,
                DepositoBancoParams(
                  depositoBancoParams.from,
                  depositoBancoParams.to,
                  depositoBancoParams.bcoId,
                  depositoBancoParams.estId,
                  depositoBancoParams.ccosId,
                  depositoBancoParams.sucId,
                  depositoBancoParams.docId,
                  depositoBancoParams.empId
                )
              )
            )
          )
        })
      }
    )
  }

  def notes(id: Int) = GetAction { implicit request =>
    LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.LIST_DEPOSITO_BANCO), { user =>
      Ok(Json.toJson(""))
    })
  }

  def messages(id: Int) = GetAction { implicit request =>
    LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.LIST_DEPOSITO_BANCO), { user =>
      Ok(Json.toJson(""))
    })
  }
}
