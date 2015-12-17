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

case class CobranzaIdData(
                           docId: Int,
                           numero: Int,
                           nroDoc: String
                           )

case class CobranzaBaseData(
                             cliId: Int,
                             estId: Int,
                             ccosId: Int,
                             sucId: Int,
                             cobId: Int,
                             lgjId: Int,
                             descrip: String,
                             grabarAsiento: Boolean
                             )

case class CobranzaTotalsData(
                               neto: Double,
                               totalOtros: Double,
                               total: Double
                               )

case class CobranzaItemBaseData(
                                 descrip: String,
                                 cueId: Int,
                                 ccosId: Int,
                                 orden: Int
                                 )

case class CobranzaItemTotalsData(
                                   importe: Double,
                                   importeOrigen: Double
                                   )

case class CobranzaItemChequeData(
                                   id: Int,
                                   base: CobranzaItemBaseData,
                                   monId: Int,
                                   totals: CobranzaItemTotalsData,
                                   bcoId: Int,
                                   cheqId: Int,
                                   numeroDoc: String,
                                   propio: Boolean,
                                   fechaCobro: String,
                                   fechaVto: String,
                                   cleId: Int
                                   )

case class CobranzaItemTarjetaData(
                                    id: Int,
                                    base: CobranzaItemBaseData,
                                    monId: Int,
                                    totals: CobranzaItemTotalsData,
                                    tjccId: Int,
                                    cuponNumeroDoc: String,
                                    tjcId: Int,
                                    tjccuId: Int,
                                    fechaVto: String,
                                    numero: String,
                                    autorizacion: String,
                                    tarjetaTipo: Int,
                                    titular: String
                                    )

case class CobranzaItemEfectivoData(
                                     id: Int,
                                     base: CobranzaItemBaseData,
                                     monId: Int,
                                     totals: CobranzaItemTotalsData
                                     )

case class CobranzaItemRetencionData(
                                      retId: Int,
                                      numero: String,
                                      porcentaje: Double,
                                      fecha: String,
                                      fvId: Int
                                      )

case class CobranzaItemOtroData(
                                 id: Int,
                                 base: CobranzaItemBaseData,
                                 totals: CobranzaItemTotalsData,
                                 tipo: Int,
                                 retencion: CobranzaItemRetencionData
                                 )

case class CobranzaItemCuentaCorrienteData(
                                            id: Int,
                                            base: CobranzaItemBaseData,
                                            monId: Int,
                                            totals: CobranzaItemTotalsData
                                            )

case class CobranzaData(
                         id: Option[Int],
                         ids: CobranzaIdData,
                         base: CobranzaBaseData,
                         fecha: String,
                         cotizacion: Double,
                         totals: CobranzaTotalsData,
                         cheques: List[CobranzaItemChequeData],
                         tarjetas: List[CobranzaItemTarjetaData],
                         efectivo: List[CobranzaItemEfectivoData],
                         otros: List[CobranzaItemOtroData],
                         cuentaCorriente: List[CobranzaItemCuentaCorrienteData],

                         /* only used in save */
                         chequeDeleted: String,
                         tarjetaDeleted: String,
                         efectivoDeleted: String,
                         otroDeleted: String,
                         cuentaCorrienteDeleted: String,

                         /* applications */
                         facturas: List[FacturaCobranzaData]
                         )

case class FacturaCobranzaData(
                               fvId: Int,
                               fvdId: Int,
                               importe: Double,
                               importeOrigen: Double,
                               cotizacion: Double
                               )

case class CobranzaParamsData(
                               from: String,
                               to: String,
                               cliId: String,
                               estId: String,
                               ccosId: String,
                               sucId: String,
                               cobId: String,
                               docId: String,
                               empId: String
                               )

object Cobranzas extends Controller with ProvidesUser {

  val GC = models.cairo.modules.general.C

  val cobranzaParamsForm: Form[CobranzaParamsData] = Form(
    mapping(
      GC.FROM -> text,
      GC.TO -> text,
      GC.CLI_ID -> text,
      GC.EST_ID -> text,
      GC.CCOS_ID -> text,
      GC.SUC_ID -> text,
      GC.COB_ID -> text,
      GC.DOC_ID -> text,
      GC.EMP_ID -> text
    )(CobranzaParamsData.apply)(CobranzaParamsData.unapply)
  )

  val cobranzaIdFields = List(GC.DOC_ID, C.COBZ_NUMERO, C.COBZ_NRODOC)

  val cobranzaBaseFields = List(GC.CLI_ID, GC.EST_ID, GC.CCOS_ID, GC.SUC_ID, GC.LGJ_ID, C.COBZ_DESCRIP, C.COBZ_GRABAR_ASIENTO)

  val cobranzaTotalsFields = List(C.COBZ_NETO, C.COBZ_TOTAL)

  val cobranzaItemBase = List(C.COBZI_DESCRIP, GC.PR_ID, GC.CCOS_ID, GC.TO_ID, GC.CUE_ID, C.COBZI_ORDEN)

  val cobranzaItemTotals = List(C.COBZI_IMPORTE, C.COBZI_IMPORTE_ORIGEN)

  val cobranzaItemOtroRetencion = List(GC.RET_ID, C.COBZI_NRO_RETENCION, C.COBZI_PORC_RETENCION,
    C.COBZI_FECHA_RETENCION, C.FV_ID_RET)

  val facturaCobranza = List(C.FV_ID, C.FVD_ID, C.FV_COBZ_IMPORTE, C.FV_COBZ_IMPORTE_ORIGEN, C.FV_COBZ_COTIZACION)

  val cobranzaForm: Form[CobranzaData] = Form(
    mapping(
      "id" -> optional(number),
      C.COBRANZA_ID -> mapping(
        GC.DOC_ID -> number,
        C.COBZ_NUMERO -> number,
        C.COBZ_NRODOC -> text)
        (CobranzaIdData.apply)(CobranzaIdData.unapply),
      C.COBRANZA_BASE -> mapping(
        GC.CLI_ID -> number,
        GC.EST_ID -> number,
        GC.CCOS_ID -> number,
        GC.SUC_ID -> number,
        GC.COB_ID -> number,
        GC.LGJ_ID -> number,
        C.COBZ_DESCRIP -> text,
        C.COBZ_GRABAR_ASIENTO -> boolean)
        (CobranzaBaseData.apply)(CobranzaBaseData.unapply),
      C.COBZ_FECHA -> text,
      C.COBZ_COTIZACION -> of(Global.doubleFormat),
      C.COBRANZA_TOTALS -> mapping (
        C.COBZ_NETO -> of(Global.doubleFormat),
        C.COBZ_OTROS -> of(Global.doubleFormat),
        C.COBZ_TOTAL -> of(Global.doubleFormat)
      )(CobranzaTotalsData.apply)(CobranzaTotalsData.unapply),
      C.COBRANZA_ITEM_CHEQUE_TMP -> Forms.list[CobranzaItemChequeData](
        mapping(
          C.COBZI_ID -> number,
          C.COBRANZA_ITEM_BASE -> mapping (
            C.COBZI_DESCRIP -> text,
            GC.CUE_ID -> number,
            GC.CCOS_ID -> number,
            C.COBZI_ORDEN -> number)
            (CobranzaItemBaseData.apply)(CobranzaItemBaseData.unapply),
          GC.MON_ID -> number,
          C.COBRANZA_ITEM_TOTALS -> mapping (
            C.COBZI_IMPORTE -> of(Global.doubleFormat),
            C.COBZI_IMPORTE_ORIGEN -> of(Global.doubleFormat))
            (CobranzaItemTotalsData.apply)(CobranzaItemTotalsData.unapply),
          GC.BCO_ID -> number,
          C.CHEQ_ID -> number,
          C.COBZI_TMP_CHEQUE -> text,
          C.COBZI_TMP_PROPIO -> boolean,
          C.COBZI_TMP_FECHA_COBRO -> text,
          C.COBZI_TMP_FECHA_VTO -> text,
          GC.CLE_ID -> number
        )(CobranzaItemChequeData.apply)(CobranzaItemChequeData.unapply)
      ),
      C.COBRANZA_ITEM_TARJETA_TMP -> Forms.list[CobranzaItemTarjetaData](
        mapping(
          C.COBZI_ID -> number,
          C.COBRANZA_ITEM_BASE -> mapping (
            C.COBZI_DESCRIP -> text,
            GC.CUE_ID -> number,
            GC.CCOS_ID -> number,
            C.COBZI_ORDEN -> number)
            (CobranzaItemBaseData.apply)(CobranzaItemBaseData.unapply),
          GC.MON_ID -> number,
          C.COBRANZA_ITEM_TOTALS -> mapping (
            C.COBZI_IMPORTE -> of(Global.doubleFormat),
            C.COBZI_IMPORTE_ORIGEN -> of(Global.doubleFormat))
            (CobranzaItemTotalsData.apply)(CobranzaItemTotalsData.unapply),
          C.TJCC_ID -> number,
          C.COBZI_TMP_CUPON -> text,
          GC.TJC_ID -> number,
          GC.TJCCU_ID -> number,
          C.COBZI_TMP_FECHA_VTO -> text,
          C.COBZI_TMP_NRO_TARJETA -> text,
          C.COBZI_TMP_AUTORIZACION -> text,
          C.COBZI_TARJETA_TIPO -> number,
          C.COBZI_TMP_TITULAR -> text
        )(CobranzaItemTarjetaData.apply)(CobranzaItemTarjetaData.unapply)
      ),
      C.COBRANZA_ITEM_EFECTIVO_TMP -> Forms.list[CobranzaItemEfectivoData](
        mapping(
          C.COBZI_ID -> number,
          C.COBRANZA_ITEM_BASE -> mapping (
            C.COBZI_DESCRIP -> text,
            GC.CUE_ID -> number,
            GC.CCOS_ID -> number,
            C.COBZI_ORDEN -> number)
            (CobranzaItemBaseData.apply)(CobranzaItemBaseData.unapply),
          GC.MON_ID -> number,
          C.COBRANZA_ITEM_TOTALS -> mapping (
            C.COBZI_IMPORTE -> of(Global.doubleFormat),
            C.COBZI_IMPORTE_ORIGEN -> of(Global.doubleFormat))
            (CobranzaItemTotalsData.apply)(CobranzaItemTotalsData.unapply)
        )(CobranzaItemEfectivoData.apply)(CobranzaItemEfectivoData.unapply)
      ),
      C.COBRANZA_ITEM_OTRO_TMP -> Forms.list[CobranzaItemOtroData](
        mapping(
          C.COBZI_ID -> number,
          C.COBRANZA_ITEM_BASE -> mapping (
            C.COBZI_DESCRIP -> text,
            GC.CUE_ID -> number,
            GC.CCOS_ID -> number,
            C.COBZI_ORDEN -> number)
            (CobranzaItemBaseData.apply)(CobranzaItemBaseData.unapply),
          C.COBRANZA_ITEM_TOTALS -> mapping (
            C.COBZI_IMPORTE -> of(Global.doubleFormat),
            C.COBZI_IMPORTE_ORIGEN -> of(Global.doubleFormat))
            (CobranzaItemTotalsData.apply)(CobranzaItemTotalsData.unapply),
          C.COBZI_TIPO -> number,
          C.COBRANZA_ITEM_OTRO_RETENCION -> mapping (
            GC.RET_ID -> number,
            C.COBZI_NRO_RETENCION -> text,
            C.COBZI_PORC_RETENCION -> of(Global.doubleFormat),
            C.COBZI_FECHA_RETENCION -> text,
            C.FV_ID_RET -> number)
          (CobranzaItemRetencionData.apply)(CobranzaItemRetencionData.unapply)
        )(CobranzaItemOtroData.apply)(CobranzaItemOtroData.unapply)
      ),
      C.COBRANZA_ITEM_CUENTA_CORRIENTE_TMP -> Forms.list[CobranzaItemCuentaCorrienteData](
        mapping(
          C.COBZI_ID -> number,
          C.COBRANZA_ITEM_BASE -> mapping (
            C.COBZI_DESCRIP -> text,
            GC.CUE_ID -> number,
            GC.CCOS_ID -> number,
            C.COBZI_ORDEN -> number)
            (CobranzaItemBaseData.apply)(CobranzaItemBaseData.unapply),
          GC.MON_ID -> number,
          C.COBRANZA_ITEM_TOTALS -> mapping (
            C.COBZI_IMPORTE -> of(Global.doubleFormat),
            C.COBZI_IMPORTE_ORIGEN -> of(Global.doubleFormat))
            (CobranzaItemTotalsData.apply)(CobranzaItemTotalsData.unapply)
        )(CobranzaItemCuentaCorrienteData.apply)(CobranzaItemCuentaCorrienteData.unapply)
      ),
      C.COBRANZA_ITEM_CHEQUE_DELETED -> text,
      C.COBRANZA_ITEM_TARJETA_DELETED -> text,
      C.COBRANZA_ITEM_EFECTIVO_DELETED -> text,
      C.COBRANZA_ITEM_OTRO_DELETED -> text,
      C.COBRANZA_ITEM_CUENTA_CORRIENTE_DELETED -> text,
      C.FACTURA_VENTA_COBRANZA_TMP -> Forms.list[FacturaCobranzaData](
        mapping (
          C.FV_ID -> number,
          C.FVD_ID -> number,
          C.FV_COBZ_IMPORTE -> of(Global.doubleFormat),
          C.FV_COBZ_IMPORTE_ORIGEN -> of(Global.doubleFormat),
          C.FV_COBZ_COTIZACION -> of(Global.doubleFormat)
        )(FacturaCobranzaData.apply)(FacturaCobranzaData.unapply)
      )
    )(CobranzaData.apply)(CobranzaData.unapply)
  )

  implicit val cobranzaParamsWrites = new Writes[CobranzaParams] {
    def writes(cobranzaParams: CobranzaParams) = Json.obj(
      GC.FROM -> Json.toJson(cobranzaParams.from),
      GC.TO -> Json.toJson(cobranzaParams.to),
      GC.CLI_ID -> Json.toJson(cobranzaParams.cliId),
      GC.CLI_NAME -> Json.toJson(cobranzaParams.cliName),
      GC.EST_ID -> Json.toJson(cobranzaParams.estId),
      GC.EST_NAME -> Json.toJson(cobranzaParams.estName),
      GC.CCOS_ID -> Json.toJson(cobranzaParams.ccosId),
      GC.CCOS_NAME -> Json.toJson(cobranzaParams.ccosName),
      GC.SUC_ID -> Json.toJson(cobranzaParams.sucId),
      GC.SUC_NAME -> Json.toJson(cobranzaParams.sucName),
      GC.COB_ID -> Json.toJson(cobranzaParams.cobId),
      GC.COB_NAME -> Json.toJson(cobranzaParams.cobName),
      GC.DOC_ID -> Json.toJson(cobranzaParams.docId),
      GC.DOC_NAME -> Json.toJson(cobranzaParams.docName),
      GC.EMP_ID -> Json.toJson(cobranzaParams.empId),
      GC.EMP_NAME -> Json.toJson(cobranzaParams.empName)
    )
  }

  implicit val cobranzaWrites = new Writes[Cobranza] {
    def writes(cobranza: Cobranza) = Json.obj(
      "id" -> Json.toJson(cobranza.id),
      C.COBZ_ID -> Json.toJson(cobranza.id),

      GC.DOC_ID -> Json.toJson(cobranza.ids.docId),
      GC.DOC_NAME -> Json.toJson(cobranza.ids.docName),
      C.COBZ_NRODOC -> Json.toJson(cobranza.ids.nroDoc),
      C.COBZ_NUMERO -> Json.toJson(cobranza.ids.numero),

      C.COBZ_FECHA -> Json.toJson(cobranza.fecha),

      GC.CLI_ID -> Json.toJson(cobranza.base.cliId),
      GC.CLI_NAME -> Json.toJson(cobranza.base.cliName),
      GC.EST_ID -> Json.toJson(cobranza.base.estId),
      GC.EST_NAME -> Json.toJson(cobranza.base.estName),
      GC.SUC_ID -> Json.toJson(cobranza.base.sucId),
      GC.SUC_NAME -> Json.toJson(cobranza.base.sucName),
      GC.CCOS_ID -> Json.toJson(cobranza.base.ccosId),
      GC.CCOS_NAME -> Json.toJson(cobranza.base.ccosName),
      GC.COB_ID -> Json.toJson(cobranza.base.cobId),
      GC.COB_NAME -> Json.toJson(cobranza.base.cobName),
      GC.LGJ_ID -> Json.toJson(cobranza.base.lgjId),
      GC.LGJ_CODE -> Json.toJson(cobranza.base.lgjCode),
      C.COBZ_DESCRIP -> Json.toJson(cobranza.base.descrip),
      C.COBZ_GRABAR_ASIENTO -> Json.toJson(cobranza.base.grabarAsiento),

      GC.DOCT_ID -> Json.toJson(cobranza.references.doctId),
      GC.DOCT_NAME -> Json.toJson(cobranza.references.doctName),
      GC.TA_MASCARA -> Json.toJson(cobranza.references.taMascara),
      GC.TA_PROPUESTO -> Json.toJson(cobranza.references.taPropuesto),
      C.COBZ_FIRMADO -> Json.toJson(cobranza.references.firmado),
      C.AS_ID -> Json.toJson(cobranza.references.asId),
      GC.EDITABLE -> Json.toJson(cobranza.references.editable),
      GC.EDIT_MSG -> Json.toJson(cobranza.references.editMsg),

      C.COBZ_COTIZACION -> Json.toJson(cobranza.cotizacion),

      C.COBZ_NETO -> Json.toJson(cobranza.totals.neto),
      C.COBZ_OTROS -> Json.toJson(cobranza.totals.totalOtros),
      C.COBZ_TOTAL -> Json.toJson(cobranza.totals.total),

      "cheques" -> Json.toJson(writeCobranzaItems(cobranza.items.cheques))
    )
    def cobranzaItemWrites(i: CobranzaItemCheque) = Json.obj(
      C.COBZI_ID -> Json.toJson(i.id),
      C.COBZI_DESCRIP -> Json.toJson(i.base.descrip),
      GC.CUE_ID -> Json.toJson(i.base.cueId),
      GC.CUE_NAME -> Json.toJson(i.base.cueName),
      GC.CCOS_ID -> Json.toJson(i.base.ccosId),
      GC.CCOS_NAME -> Json.toJson(i.base.ccosName),
      C.COBZI_ORDEN -> Json.toJson(i.base.orden),
      C.COBZI_IMPORTE -> Json.toJson(i.totals.importe),
      C.COBZI_IMPORTE_ORIGEN -> Json.toJson(i.totals.importeOrigen)
    )
    def writeCobranzaItems(items: List[CobranzaItemCheque]) = items.map(item => cobranzaItemWrites(item))
  }

  def get(id: Int) = GetAction { implicit request =>
    LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.LIST_COBRANZA), { user =>
      Ok(Json.toJson(Cobranza.get(user, id)))
    })
  }

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //
  // this functions convert the plain JSON received in CREATE and UPDATE into a CobranzaData structure
  //
  // because the limitation to 18 fields in case class used for FORM mapping we have grouped the fields
  // in Cobranza/Data, CobranzaItem/Data, etc
  //
  // the below routines group a flat JSON and in some cases rename the name of the fields or move
  // fields to the parent node in the JSON structure to match the case class
  //

  private def preprocessParams(implicit request:Request[AnyContent]): JsObject = {

    def getJsValueAsMap(list: Map[String, JsValue]): Map[String, JsValue] = list.toList match {
      case (key: String, jsValue: JsValue) :: t => jsValue.as[Map[String, JsValue]]
      case _ => Map.empty
    }

    def preprocessChequeParam(field: JsValue) = {
      val params = field.as[Map[String, JsValue]]

      // groups for CobranzaChequeData
      //
      val cobranzaCheque = Global.preprocessFormParams(
        List(C.COBZI_ID, GC.MON_ID, GC.BCO_ID, C.CHEQ_ID, C.COBZI_TMP_CHEQUE, C.COBZI_TMP_PROPIO, C.COBZI_TMP_FECHA_COBRO,
          C.COBZI_TMP_FECHA_VTO, GC.CLE_ID), "", params)
      val cobranzaChequeBaseGroup = Global.preprocessFormParams(cobranzaItemBase, C.COBRANZA_ITEM_BASE, params)
      val cobranzaChequeTotalsGroup = Global.preprocessFormParams(cobranzaItemTotals, C.COBRANZA_ITEM_TOTALS, params)

      val cheque = JsObject(
        (cobranzaCheque ++ cobranzaChequeBaseGroup ++ cobranzaChequeTotalsGroup).toSeq)
      cheque
    }

    def preprocessTarjetaParam(field: JsValue) = {
      val params = field.as[Map[String, JsValue]]

      // groups for CobranzaTarjetaData
      //
      val cobranzaTarjeta = Global.preprocessFormParams(
        List(C.COBZI_ID, GC.MON_ID, C.TJCC_ID, C.COBZI_TMP_CUPON, GC.TJC_ID, GC.TJCCU_ID, C.COBZI_TMP_FECHA_VTO,
          C.COBZI_TMP_NRO_TARJETA, C.COBZI_TMP_AUTORIZACION, C.COBZI_TARJETA_TIPO, C.COBZI_TMP_TITULAR), "", params)
      val cobranzaTarjetaBaseGroup = Global.preprocessFormParams(cobranzaItemBase, C.COBRANZA_ITEM_BASE, params)
      val cobranzaTarjetaTotalsGroup = Global.preprocessFormParams(cobranzaItemTotals, C.COBRANZA_ITEM_TOTALS, params)

      val tarjeta = JsObject(
        (cobranzaTarjeta ++ cobranzaTarjetaBaseGroup ++ cobranzaTarjetaTotalsGroup).toSeq)
      tarjeta
    }

    def preprocessEfectivoParam(field: JsValue) = {
      val params = field.as[Map[String, JsValue]]

      // groups for CobranzaEfectivoData
      //
      val cobranzaEfectivo = Global.preprocessFormParams(List(C.COBZI_ID, GC.MON_ID), "", params)
      val cobranzaEfectivoBaseGroup = Global.preprocessFormParams(cobranzaItemBase, C.COBRANZA_ITEM_BASE, params)
      val cobranzaEfectivoTotalsGroup = Global.preprocessFormParams(cobranzaItemTotals, C.COBRANZA_ITEM_TOTALS, params)

      val efectivo = JsObject(
        (cobranzaEfectivo ++ cobranzaEfectivoBaseGroup ++ cobranzaEfectivoTotalsGroup).toSeq)
      efectivo
    }

    def preprocessOtroParam(field: JsValue) = {
      val params = field.as[Map[String, JsValue]]

      // groups for CobranzaOtroData
      //
      val cobranzaOtro = Global.preprocessFormParams(List(C.COBZI_ID, C.COBZI_TIPO), "", params)
      val cobranzaOtroBaseGroup = Global.preprocessFormParams(cobranzaItemBase, C.COBRANZA_ITEM_BASE, params)
      val cobranzaOtroTotalsGroup = Global.preprocessFormParams(cobranzaItemTotals, C.COBRANZA_ITEM_TOTALS, params)
      val cobranzaOtroRetencionGroup = Global.preprocessFormParams(cobranzaItemOtroRetencion, C.COBRANZA_ITEM_OTRO_RETENCION, params)

      val otro = JsObject(
        (cobranzaOtro ++ cobranzaOtroBaseGroup ++ cobranzaOtroTotalsGroup ++ cobranzaOtroRetencionGroup).toSeq)
      otro
    }

    def preprocessCuentaCorrienteParam(field: JsValue) = {
      val params = field.as[Map[String, JsValue]]

      // groups for CobranzaCuentaCorrienteData
      //
      val cobranzaCuentaCorriente = Global.preprocessFormParams(List(C.COBZI_ID, GC.MON_ID), "", params)
      val cobranzaCuentaCorrienteBaseGroup = Global.preprocessFormParams(cobranzaItemBase, C.COBRANZA_ITEM_BASE, params)
      val cobranzaCuentaCorrienteTotalsGroup = Global.preprocessFormParams(cobranzaItemTotals, C.COBRANZA_ITEM_TOTALS, params)

      val cuentaCorriente = JsObject(
        (cobranzaCuentaCorriente ++ cobranzaCuentaCorrienteBaseGroup ++ cobranzaCuentaCorrienteTotalsGroup).toSeq)
      cuentaCorriente
    }
    
    def preprocessFacturaParam(field: JsValue) = {
      val params = field.as[Map[String, JsValue]]
      JsObject(Global.preprocessFormParams(facturaCobranza, "", params).toSeq)
    }

    def preprocessChequesParam(items: JsValue, group: String): Map[String, JsValue] = items match {
      case JsArray(arr) => Map(group -> JsArray(arr.map(preprocessChequeParam(_))))
      case _ => Map.empty
    }

    def preprocessTarjetasParam(items: JsValue, group: String): Map[String, JsValue] = items match {
      case JsArray(arr) => Map(group -> JsArray(arr.map(preprocessTarjetaParam(_))))
      case _ => Map.empty
    }

    def preprocessEfectivosParam(items: JsValue, group: String): Map[String, JsValue] = items match {
      case JsArray(arr) => Map(group -> JsArray(arr.map(preprocessEfectivoParam(_))))
      case _ => Map.empty
    }

    def preprocessOtrosParam(items: JsValue, group: String): Map[String, JsValue] = items match {
      case JsArray(arr) => Map(group -> JsArray(arr.map(preprocessOtroParam(_))))
      case _ => Map.empty
    }

    def preprocessCtaCtesParam(items: JsValue, group: String): Map[String, JsValue] = items match {
      case JsArray(arr) => Map(group -> JsArray(arr.map(preprocessCuentaCorrienteParam(_))))
      case _ => Map.empty
    }

    def preprocessFacturasParam(items: JsValue, group: String): Map[String, JsValue] = items match {
      case JsArray(arr) => Map(group -> JsArray(arr.map(preprocessFacturaParam(_))))
      case _ => Map.empty
    }

    val params = Global.getParamsFromJsonRequest

    // groups for CobranzaData
    //
    val facturaId = Global.preprocessFormParams(List("id"), "", params)
    val facturaIdGroup = Global.preprocessFormParams(cobranzaIdFields, C.COBRANZA_ID, params)
    val facturaBaseGroup = Global.preprocessFormParams(cobranzaBaseFields, C.COBRANZA_BASE, params)
    val facturaTotalGroup = Global.preprocessFormParams(cobranzaTotalsFields, C.COBRANZA_TOTALS, params)

    // cheques
    //
    val chequesInfo = getJsValueAsMap(Global.getParamsJsonRequestFor(C.COBRANZA_ITEM_CHEQUE_TMP, params))
    val chequeRows = Global.getParamsJsonRequestFor(GC.ITEMS, chequesInfo)
    val chequeDeleted: Map[String, JsValue] = Global.getParamsJsonRequestFor(GC.DELETED_LIST, chequesInfo).toList match {
      case Nil => Map(C.COBRANZA_ITEM_CHEQUE_DELETED -> Json.toJson(""))
      case deletedList :: t => Map(C.COBRANZA_ITEM_CHEQUE_DELETED -> Json.toJson(deletedList._2))
    }
    val cobranzaCheques = preprocessChequesParam(chequeRows.head._2, C.COBRANZA_ITEM_CHEQUE_TMP)

    // items
    //
    val tarjetasInfo = getJsValueAsMap(Global.getParamsJsonRequestFor(C.COBRANZA_ITEM_TARJETA_TMP, params))
    val tarjetaRows = Global.getParamsJsonRequestFor(GC.ITEMS, tarjetasInfo)
    val tarjetaDeleted: Map[String, JsValue] = Global.getParamsJsonRequestFor(GC.DELETED_LIST, tarjetasInfo).toList match {
      case Nil => Map(C.COBRANZA_ITEM_TARJETA_DELETED -> Json.toJson(""))
      case deletedList :: t => Map(C.COBRANZA_ITEM_TARJETA_DELETED -> Json.toJson(deletedList._2))
    }
    val cobranzaTarjetas = preprocessTarjetasParam(tarjetaRows.head._2, C.COBRANZA_ITEM_TARJETA_TMP)

    // efectivos
    //
    val efectivosInfo = getJsValueAsMap(Global.getParamsJsonRequestFor(C.COBRANZA_ITEM_EFECTIVO_TMP, params))
    val efectivoRows = Global.getParamsJsonRequestFor(GC.ITEMS, efectivosInfo)
    val efectivoDeleted: Map[String, JsValue] = Global.getParamsJsonRequestFor(GC.DELETED_LIST, efectivosInfo).toList match {
      case Nil => Map(C.COBRANZA_ITEM_EFECTIVO_DELETED -> Json.toJson(""))
      case deletedList :: t => Map(C.COBRANZA_ITEM_EFECTIVO_DELETED -> Json.toJson(deletedList._2))
    }
    val cobranzaEfectivos = preprocessEfectivosParam(efectivoRows.head._2, C.COBRANZA_ITEM_EFECTIVO_TMP)

    // otros
    //
    val otrosInfo = getJsValueAsMap(Global.getParamsJsonRequestFor(C.COBRANZA_ITEM_OTRO_TMP, params))
    val otroRows = Global.getParamsJsonRequestFor(GC.ITEMS, otrosInfo)
    val otroDeleted: Map[String, JsValue] = Global.getParamsJsonRequestFor(GC.DELETED_LIST, otrosInfo).toList match {
      case Nil => Map(C.COBRANZA_ITEM_OTRO_DELETED -> Json.toJson(""))
      case deletedList :: t => Map(C.COBRANZA_ITEM_OTRO_DELETED -> Json.toJson(deletedList._2))
    }
    val cobranzaOtros = preprocessOtrosParam(otroRows.head._2, C.COBRANZA_ITEM_OTRO_TMP)

    // ctaCtes
    //
    val ctaCtesInfo = getJsValueAsMap(Global.getParamsJsonRequestFor(C.COBRANZA_ITEM_CUENTA_CORRIENTE_TMP, params))
    val cuentaCorrienteRows = Global.getParamsJsonRequestFor(GC.ITEMS, ctaCtesInfo)
    val cuentaCorrienteDeleted: Map[String, JsValue] = Global.getParamsJsonRequestFor(GC.DELETED_LIST, ctaCtesInfo).toList match {
      case Nil => Map(C.COBRANZA_ITEM_CUENTA_CORRIENTE_DELETED -> Json.toJson(""))
      case deletedList :: t => Map(C.COBRANZA_ITEM_CUENTA_CORRIENTE_DELETED -> Json.toJson(deletedList._2))
    }
    val cobranzaCtaCtes = preprocessCtaCtesParam(cuentaCorrienteRows.head._2, C.COBRANZA_ITEM_CUENTA_CORRIENTE_TMP)
    
    
    // facturas
    //
    val facturasInfo = getJsValueAsMap(Global.getParamsJsonRequestFor(C.FACTURA_VENTA_COBRANZA_TMP, params))
    val facturaRows = Global.getParamsJsonRequestFor(GC.ITEMS, facturasInfo)
    val facturaFacturas = facturaRows.toList match {
      case (k: String, item: JsValue) :: t => preprocessFacturasParam(item, C.FACTURA_VENTA_COBRANZA_TMP)
      case _ => Map(C.FACTURA_VENTA_COBRANZA_TMP -> JsArray(List()))
    }

    JsObject(
      (facturaId ++ facturaIdGroup ++ facturaBaseGroup ++ facturaTotalGroup
        ++ cobranzaCheques ++ chequeDeleted
        ++ cobranzaTarjetas ++ tarjetaDeleted
        ++ cobranzaEfectivos ++ efectivoDeleted
        ++ cobranzaOtros ++ otroDeleted
        ++ cobranzaCtaCtes ++ cuentaCorrienteDeleted
        ++ facturaFacturas).toSeq)
  }
  //
  //
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  def getCheques(items: List[CobranzaItemChequeData]): List[CobranzaItemCheque] = {
    items.map(cheque => {
      CobranzaItemCheque(
        cheque.id,
        CobranzaItemBase(
          cheque.base.descrip,
          cheque.base.cueId,
          cheque.base.ccosId,
          cheque.base.orden
        ),
        cheque.monId,
        CobranzaItemTotals(
          cheque.totals.importe,
          cheque.totals.importeOrigen
        ),
        cheque.bcoId,
        cheque.cheqId,
        cheque.numeroDoc,
        cheque.propio,
        DateFormatter.parse(cheque.fechaCobro),
        DateFormatter.parse(cheque.fechaVto),
        cheque.cleId
      )
    })
  }

  def getTarjetas(items: List[CobranzaItemTarjetaData]): List[CobranzaItemTarjeta] = {
    items.map(tarjeta => {
      CobranzaItemTarjeta(
        tarjeta.id,
        CobranzaItemBase(
          tarjeta.base.descrip,
          tarjeta.base.cueId,
          tarjeta.base.ccosId,
          tarjeta.base.orden
        ),
        tarjeta.monId,
        CobranzaItemTotals(
          tarjeta.totals.importe,
          tarjeta.totals.importeOrigen
        ),
        tarjeta.tjccId,
        tarjeta.cuponNumeroDoc,
        tarjeta.tjcId,
        tarjeta.tjccuId,
        DateFormatter.parse(tarjeta.fechaVto),
        tarjeta.numero,
        tarjeta.autorizacion,
        tarjeta.tarjetaTipo,
        tarjeta.titular
      )
    })
  }

  def getEfectivo(items: List[CobranzaItemEfectivoData]): List[CobranzaItemEfectivo] = {
    items.map(efectivo => {
      CobranzaItemEfectivo(
        efectivo.id,
        CobranzaItemBase(
          efectivo.base.descrip,
          efectivo.base.cueId,
          efectivo.base.ccosId,
          efectivo.base.orden
        ),
        efectivo.monId,
        CobranzaItemTotals(
          efectivo.totals.importe,
          efectivo.totals.importeOrigen
        )
      )
    })
  }

  def getOtros(items: List[CobranzaItemOtroData]): List[CobranzaItemOtro] = {
    items.map(otro => {
      CobranzaItemOtro(
        otro.id,
        CobranzaItemBase(
          otro.base.descrip,
          otro.base.cueId,
          otro.base.ccosId,
          otro.base.orden
        ),
        CobranzaItemTotals(
          otro.totals.importe,
          otro.totals.importeOrigen
        ),
        otro.tipo,
        CobranzaItemRetencion(
          otro.retencion.retId,
          otro.retencion.numero,
          otro.retencion.porcentaje,
          DateFormatter.parse(otro.retencion.fecha),
          otro.retencion.fvId
        )
      )
    })
  }

  def getCtaCte(items: List[CobranzaItemCuentaCorrienteData]): List[CobranzaItemCuentaCorriente] = {
    items.map(ctaCte => {
      CobranzaItemCuentaCorriente(
        ctaCte.id,
        CobranzaItemBase(
          ctaCte.base.descrip,
          ctaCte.base.cueId,
          ctaCte.base.ccosId,
          ctaCte.base.orden
        ),
        ctaCte.monId,
        CobranzaItemTotals(
          ctaCte.totals.importe,
          ctaCte.totals.importeOrigen
        )
      )
    })
  }

  def getFacturas(facturas: List[FacturaCobranzaData]): List[FacturaCobranza] = {
    facturas.map(factura => {
      FacturaCobranza(
        factura.fvId,
        factura.fvdId,
        factura.importe,
        factura.importeOrigen,
        factura.cotizacion
      )
    })
  }

  def getCobranzaItems(cobranza: CobranzaData): CobranzaItems = {
    CobranzaItems(
      getCheques(cobranza.cheques),
      getTarjetas(cobranza.tarjetas),
      getEfectivo(cobranza.efectivo),
      getOtros(cobranza.otros),
      getCtaCte(cobranza.cuentaCorriente),

      /* only used in save */
      cobranza.chequeDeleted,
      cobranza.tarjetaDeleted,
      cobranza.efectivoDeleted,
      cobranza.otroDeleted,
      cobranza.cuentaCorrienteDeleted,

      getFacturas(cobranza.facturas)
    )
  }

  def getCobranza(cobranza: CobranzaData, id: Int): Cobranza = {
    Cobranza(
      id,
      CobranzaId(
        cobranza.ids.docId,
        cobranza.ids.numero,
        cobranza.ids.nroDoc),
      CobranzaBase(
        cobranza.base.cliId,
        cobranza.base.estId,
        cobranza.base.ccosId,
        cobranza.base.sucId,
        cobranza.base.cobId,
        cobranza.base.lgjId,
        cobranza.base.descrip,
        cobranza.base.grabarAsiento),
      Cobranza.emptyCobranzaReferences,
      DateFormatter.parse(cobranza.fecha),
      cobranza.cotizacion,
      CobranzaTotals(
        cobranza.totals.neto,
        cobranza.totals.totalOtros,
        cobranza.totals.total),
      getCobranzaItems(cobranza)
    )
  }

  def update(id: Int) = PostAction { implicit request =>
    Logger.debug("in Cobranzas.update")

    cobranzaForm.bind(preprocessParams).fold(
      formWithErrors => {
        Logger.debug(s"invalid form: ${formWithErrors.toString}")
        BadRequest
      },
      cobranza => {
        Logger.debug(s"form: ${cobranza.toString}")
        LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.EDIT_COBRANZA), { user =>
          try {
            Ok(
              Json.toJson(
                Cobranza.update(user,
                  getCobranza(cobranza, id)
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
    Logger.debug("in Cobranzas.create")
    cobranzaForm.bind(preprocessParams).fold(
      formWithErrors => {
        Logger.debug(s"invalid form: ${formWithErrors.toString}")
        BadRequest
      },
      cobranza => {
        Logger.debug(s"form: ${cobranza.toString}")
        LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.NEW_COBRANZA), { user =>
          try {
            Ok(
              Json.toJson(
                Cobranza.create(user,
                  getCobranza(cobranza, DBHelper.NoId)
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
    Logger.debug("in Cobranzas.delete")
    LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.DELETE_COBRANZA), { user =>
      try {
        Cobranza.delete(user, id)
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
            cliId: Option[String],
            estId: Option[String],
            ccosId: Option[String],
            sucId: Option[String],
            cobId: Option[String],
            docId: Option[String],
            empId: Option[String]
            ) = GetAction { implicit request =>
    LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.LIST_COBRANZA), { user =>
      Ok(
        Json.toJson(
          Recordset.getAsJson(
            Cobranza.list(
              user,
              DateFormatter.parse(from.getOrElse("")), DateFormatter.parse(to.getOrElse("")),
              cliId, estId, ccosId, sucId, cobId, docId, empId))))
    })
  }

  def parameters = GetAction { implicit request =>
    LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.LIST_COBRANZA), { user =>
      Ok(Json.toJson(Cobranza.loadParams(user)))
    })
  }

  def saveParameters = PostAction { implicit request =>
    Logger.debug("in Cobranzas.saveParameters")
    cobranzaParamsForm.bindFromRequest.fold(
      formWithErrors => {
        Logger.debug(s"invalid form: ${formWithErrors.toString}")
        BadRequest
      },
      cobranzaParams => {
        Logger.debug(s"form: ${cobranzaParams.toString}")
        LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.LIST_COBRANZA), { user =>
          Ok(
            Json.toJson(
              Cobranza.saveParams(user,
                CobranzaParams(
                  cobranzaParams.from,
                  cobranzaParams.to,
                  cobranzaParams.cliId,
                  cobranzaParams.estId,
                  cobranzaParams.ccosId,
                  cobranzaParams.sucId,
                  cobranzaParams.cobId,
                  cobranzaParams.docId,
                  cobranzaParams.empId
                )
              )
            )
          )
        })
      }
    )
  }

  def notes(id: Int) = GetAction { implicit request =>
    LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.LIST_COBRANZA), { user =>
      Ok(Json.toJson(""))
    })
  }

  def listFacturas(cliId: Int) = GetAction { implicit request =>
    LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.NEW_COBRANZA), { user =>
      Ok(Json.toJson(Recordset.getAsJson(Cobranza.listFacturas(user, cliId))))
    })
  }
}
