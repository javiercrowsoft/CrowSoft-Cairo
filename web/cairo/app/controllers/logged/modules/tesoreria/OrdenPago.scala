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

case class OrdenPagoIdData(
                            docId: Int,
                            numero: Int,
                            nroDoc: String
                          )

case class OrdenPagoBaseData(
                              provId: Int,
                              estId: Int,
                              ccosId: Int,
                              sucId: Int,
                              lgjId: Int,
                              descrip: String,
                              grabarAsiento: Boolean
                            )

case class OrdenPagoTotalsData(
                                neto: Double,
                                totalOtros: Double,
                                total: Double
                              )

case class OrdenPagoItemBaseData(
                                  descrip: Option[String],
                                  cueId: Int,
                                  ccosId: Option[Int],
                                  orden: Int
                                )

case class OrdenPagoItemTotalsData(
                                    importe: Double,
                                    importeOrigen: Double
                                  )

case class OrdenPagoItemChequeData(
                                    id: Int,
                                    base: OrdenPagoItemBaseData,
                                    monId: Int,
                                    totals: OrdenPagoItemTotalsData,
                                    bcoId: Int,
                                    cheqId: Option[Int],
                                    numeroDoc: String,
                                    propio: Boolean,
                                    fechaCobro: String,
                                    fechaVto: String,
                                    cleId: Int
                                  )

case class OrdenPagoItemTarjetaData(
                                     id: Int,
                                     base: OrdenPagoItemBaseData,
                                     monId: Int,
                                     totals: OrdenPagoItemTotalsData,
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

case class OrdenPagoItemEfectivoData(
                                      id: Int,
                                      base: OrdenPagoItemBaseData,
                                      totals: OrdenPagoItemTotalsData
                                    )

case class OrdenPagoItemRetencionData(
                                       retId: Int,
                                       numero: String,
                                       porcentaje: Double,
                                       fecha: String,
                                       fvId: Int
                                     )

case class OrdenPagoItemOtroData(
                                  id: Int,
                                  base: OrdenPagoItemBaseData,
                                  totals: OrdenPagoItemTotalsData,
                                  tipo: Int,
                                  retencion: OrdenPagoItemRetencionData
                                )

case class OrdenPagoItemCuentaCorrienteData(
                                             id: Int,
                                             base: OrdenPagoItemBaseData,
                                             totals: OrdenPagoItemTotalsData
                                           )

case class OrdenPagoData(
                          id: Option[Int],
                          ids: OrdenPagoIdData,
                          base: OrdenPagoBaseData,
                          fecha: String,
                          cotizacion: Double,
                          totals: OrdenPagoTotalsData,
                          cheques: List[OrdenPagoItemChequeData],
                          tarjetas: List[OrdenPagoItemTarjetaData],
                          efectivo: List[OrdenPagoItemEfectivoData],
                          otros: List[OrdenPagoItemOtroData],
                          cuentaCorriente: List[OrdenPagoItemCuentaCorrienteData],

                          chequeDeleted: String,
                          tarjetaDeleted: String,
                          efectivoDeleted: String,
                          otroDeleted: String,
                          cuentaCorrienteDeleted: String,

                          /* applications */
                          facturas: List[FacturaOrdenPagoData]
                        )

case class FacturaOrdenPagoData(
                                 fvId: Int,
                                 fvdId: Int,
                                 importe: Double,
                                 importeOrigen: Double,
                                 cotizacion: Double
                               )

case class OrdenPagoParamsData(
                                from: String,
                                to: String,
                                provId: String,
                                estId: String,
                                ccosId: String,
                                sucId: String,
                                docId: String,
                                empId: String
                              )

object OrdenesPago extends Controller with ProvidesUser {

  val GC = models.cairo.modules.general.C

  val ordenPagoParamsForm: Form[OrdenPagoParamsData] = Form(
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
    )(OrdenPagoParamsData.apply)(OrdenPagoParamsData.unapply)
  )

  val ordenPagoIdFields = List(GC.DOC_ID, C.OPG_NUMERO, C.OPG_NRODOC)

  val ordenPagoBaseFields = List(GC.CLI_ID, GC.EST_ID, GC.CCOS_ID, GC.SUC_ID, GC.COB_ID, GC.LGJ_ID, C.OPG_DESCRIP,
    C.OPG_GRABAR_ASIENTO)

  val ordenPagoTotalsFields = List(C.OPG_NETO, C.OPG_OTROS, C.OPG_TOTAL)

  val ordenPagoItemBase = List(C.OPGI_DESCRIP, GC.PR_ID, GC.CCOS_ID, GC.TO_ID, GC.CUE_ID, C.OPGI_ORDEN)

  val ordenPagoItemTotals = List(C.OPGI_IMPORTE, C.OPGI_IMPORTE_ORIGEN)

  val ordenPagoItemOtroRetencion = List(GC.RET_ID, C.OPGI_NRO_RETENCION, C.OPGI_PORC_RETENCION,
    C.OPGI_FECHA_RETENCION, C.FC_ID_RET)

  val facturaOrdenPago = List(C.FC_ID, C.FCD_ID, C.FC_OPG_IMPORTE, C.FC_OPG_IMPORTE_ORIGEN, C.FC_OPG_COTIZACION)

  val ordenPagoForm: Form[OrdenPagoData] = Form(
    mapping(
      "id" -> optional(number),
      C.COBRANZA_ID -> mapping(
        GC.DOC_ID -> number,
        C.OPG_NUMERO -> number,
        C.OPG_NRODOC -> text)
      (OrdenPagoIdData.apply)(OrdenPagoIdData.unapply),
      C.COBRANZA_BASE -> mapping(
        GC.CLI_ID -> number,
        GC.EST_ID -> number,
        GC.CCOS_ID -> number,
        GC.SUC_ID -> number,
        GC.COB_ID -> number,
        GC.LGJ_ID -> number,
        C.OPG_DESCRIP -> text,
        C.OPG_GRABAR_ASIENTO -> boolean)
      (OrdenPagoBaseData.apply)(OrdenPagoBaseData.unapply),
      C.OPG_FECHA -> text,
      C.OPG_COTIZACION -> of(Global.doubleFormat),
      C.COBRANZA_TOTALS -> mapping (
        C.OPG_NETO -> of(Global.doubleFormat),
        C.OPG_OTROS -> of(Global.doubleFormat),
        C.OPG_TOTAL -> of(Global.doubleFormat)
      )(OrdenPagoTotalsData.apply)(OrdenPagoTotalsData.unapply),
      C.COBRANZA_ITEM_CHEQUE_TMP -> Forms.list[OrdenPagoItemChequeData](
        mapping(
          C.OPGI_ID -> number,
          C.COBRANZA_ITEM_BASE -> mapping (
            C.OPGI_DESCRIP -> optional(text),
            GC.CUE_ID -> number,
            GC.CCOS_ID -> optional(number),
            C.OPGI_ORDEN -> number)
          (OrdenPagoItemBaseData.apply)(OrdenPagoItemBaseData.unapply),
          GC.MON_ID -> number,
          C.COBRANZA_ITEM_TOTALS -> mapping (
            C.OPGI_IMPORTE -> of(Global.doubleFormat),
            C.OPGI_IMPORTE_ORIGEN -> of(Global.doubleFormat))
          (OrdenPagoItemTotalsData.apply)(OrdenPagoItemTotalsData.unapply),
          GC.BCO_ID -> number,
          C.CHEQ_ID -> optional(number),
          C.OPGI_TMP_CHEQUE -> text,
          C.OPGI_TMP_PROPIO -> boolean,
          C.OPGI_TMP_FECHA_COBRO -> text,
          C.OPGI_TMP_FECHA_VTO -> text,
          GC.CLE_ID -> number
        )(OrdenPagoItemChequeData.apply)(OrdenPagoItemChequeData.unapply)
      ),
      C.COBRANZA_ITEM_TARJETA_TMP -> Forms.list[OrdenPagoItemTarjetaData](
        mapping(
          C.OPGI_ID -> number,
          C.COBRANZA_ITEM_BASE -> mapping (
            C.OPGI_DESCRIP -> optional(text),
            GC.CUE_ID -> number,
            GC.CCOS_ID -> optional(number),
            C.OPGI_ORDEN -> number)
          (OrdenPagoItemBaseData.apply)(OrdenPagoItemBaseData.unapply),
          GC.MON_ID -> number,
          C.COBRANZA_ITEM_TOTALS -> mapping (
            C.OPGI_IMPORTE -> of(Global.doubleFormat),
            C.OPGI_IMPORTE_ORIGEN -> of(Global.doubleFormat))
          (OrdenPagoItemTotalsData.apply)(OrdenPagoItemTotalsData.unapply),
          C.TJCC_ID -> number,
          C.OPGI_TMP_CUPON -> text,
          GC.TJC_ID -> number,
          GC.TJCCU_ID -> number,
          C.OPGI_TMP_FECHA_VTO -> text,
          C.OPGI_TMP_NRO_TARJETA -> text,
          C.OPGI_TMP_AUTORIZACION -> text,
          C.OPGI_TARJETA_TIPO -> number,
          C.OPGI_TMP_TITULAR -> text
        )(OrdenPagoItemTarjetaData.apply)(OrdenPagoItemTarjetaData.unapply)
      ),
      C.COBRANZA_ITEM_EFECTIVO_TMP -> Forms.list[OrdenPagoItemEfectivoData](
        mapping(
          C.OPGI_ID -> number,
          C.COBRANZA_ITEM_BASE -> mapping (
            C.OPGI_DESCRIP -> optional(text),
            GC.CUE_ID -> number,
            GC.CCOS_ID -> optional(number),
            C.OPGI_ORDEN -> number)
          (OrdenPagoItemBaseData.apply)(OrdenPagoItemBaseData.unapply),
          C.COBRANZA_ITEM_TOTALS -> mapping (
            C.OPGI_IMPORTE -> of(Global.doubleFormat),
            C.OPGI_IMPORTE_ORIGEN -> of(Global.doubleFormat))
          (OrdenPagoItemTotalsData.apply)(OrdenPagoItemTotalsData.unapply)
        )(OrdenPagoItemEfectivoData.apply)(OrdenPagoItemEfectivoData.unapply)
      ),
      C.COBRANZA_ITEM_OTRO_TMP -> Forms.list[OrdenPagoItemOtroData](
        mapping(
          C.OPGI_ID -> number,
          C.COBRANZA_ITEM_BASE -> mapping (
            C.OPGI_DESCRIP -> optional(text),
            GC.CUE_ID -> number,
            GC.CCOS_ID -> optional(number),
            C.OPGI_ORDEN -> number)
          (OrdenPagoItemBaseData.apply)(OrdenPagoItemBaseData.unapply),
          C.COBRANZA_ITEM_TOTALS -> mapping (
            C.OPGI_IMPORTE -> of(Global.doubleFormat),
            C.OPGI_IMPORTE_ORIGEN -> of(Global.doubleFormat))
          (OrdenPagoItemTotalsData.apply)(OrdenPagoItemTotalsData.unapply),
          C.OPGI_TIPO -> number,
          C.COBRANZA_ITEM_OTRO_RETENCION -> mapping (
            GC.RET_ID -> number,
            C.OPGI_NRO_RETENCION -> text,
            C.OPGI_PORC_RETENCION -> of(Global.doubleFormat),
            C.OPGI_FECHA_RETENCION -> text,
            C.FC_ID_RET -> number)
          (OrdenPagoItemRetencionData.apply)(OrdenPagoItemRetencionData.unapply)
        )(OrdenPagoItemOtroData.apply)(OrdenPagoItemOtroData.unapply)
      ),
      C.COBRANZA_ITEM_CUENTA_CORRIENTE_TMP -> Forms.list[OrdenPagoItemCuentaCorrienteData](
        mapping(
          C.OPGI_ID -> number,
          C.COBRANZA_ITEM_BASE -> mapping (
            C.OPGI_DESCRIP -> optional(text),
            GC.CUE_ID -> number,
            GC.CCOS_ID -> optional(number),
            C.OPGI_ORDEN -> number)
          (OrdenPagoItemBaseData.apply)(OrdenPagoItemBaseData.unapply),
          C.COBRANZA_ITEM_TOTALS -> mapping (
            C.OPGI_IMPORTE -> of(Global.doubleFormat),
            C.OPGI_IMPORTE_ORIGEN -> of(Global.doubleFormat))
          (OrdenPagoItemTotalsData.apply)(OrdenPagoItemTotalsData.unapply)
        )(OrdenPagoItemCuentaCorrienteData.apply)(OrdenPagoItemCuentaCorrienteData.unapply)
      ),
      C.COBRANZA_ITEM_CHEQUE_DELETED -> text,
      C.COBRANZA_ITEM_TARJETA_DELETED -> text,
      C.COBRANZA_ITEM_EFECTIVO_DELETED -> text,
      C.COBRANZA_ITEM_OTRO_DELETED -> text,
      C.COBRANZA_ITEM_CUENTA_CORRIENTE_DELETED -> text,
      C.FACTURA_VENTA_COBRANZA_TMP -> Forms.list[FacturaOrdenPagoData](
        mapping (
          C.FC_ID -> number,
          C.FCD_ID -> number,
          C.FC_OPG_IMPORTE -> of(Global.doubleFormat),
          C.FC_OPG_IMPORTE_ORIGEN -> of(Global.doubleFormat),
          C.FC_OPG_COTIZACION -> of(Global.doubleFormat)
        )(FacturaOrdenPagoData.apply)(FacturaOrdenPagoData.unapply)
      )
    )(OrdenPagoData.apply)(OrdenPagoData.unapply)
  )

  implicit val ordenPagoParamsWrites = new Writes[OrdenPagoParams] {
    def writes(ordenPagoParams: OrdenPagoParams) = Json.obj(
      GC.FROM -> Json.toJson(ordenPagoParams.from),
      GC.TO -> Json.toJson(ordenPagoParams.to),
      GC.CLI_ID -> Json.toJson(ordenPagoParams.provId),
      GC.CLI_NAME -> Json.toJson(ordenPagoParams.provName),
      GC.EST_ID -> Json.toJson(ordenPagoParams.estId),
      GC.EST_NAME -> Json.toJson(ordenPagoParams.estName),
      GC.CCOS_ID -> Json.toJson(ordenPagoParams.ccosId),
      GC.CCOS_NAME -> Json.toJson(ordenPagoParams.ccosName),
      GC.SUC_ID -> Json.toJson(ordenPagoParams.sucId),
      GC.SUC_NAME -> Json.toJson(ordenPagoParams.sucName),
      GC.DOC_ID -> Json.toJson(ordenPagoParams.docId),
      GC.DOC_NAME -> Json.toJson(ordenPagoParams.docName),
      GC.EMP_ID -> Json.toJson(ordenPagoParams.empId),
      GC.EMP_NAME -> Json.toJson(ordenPagoParams.empName)
    )
  }

  implicit val ordenPagoWrites = new Writes[OrdenPago] {
    def writes(ordenPago: OrdenPago) = Json.obj(
      "id" -> Json.toJson(ordenPago.id),
      C.OPG_ID -> Json.toJson(ordenPago.id),

      GC.DOC_ID -> Json.toJson(ordenPago.ids.docId),
      GC.DOC_NAME -> Json.toJson(ordenPago.ids.docName),
      C.OPG_NRODOC -> Json.toJson(ordenPago.ids.nroDoc),
      C.OPG_NUMERO -> Json.toJson(ordenPago.ids.numero),

      C.OPG_FECHA -> Json.toJson(ordenPago.fecha),

      GC.CLI_ID -> Json.toJson(ordenPago.base.provId),
      GC.CLI_NAME -> Json.toJson(ordenPago.base.provName),
      GC.EST_ID -> Json.toJson(ordenPago.base.estId),
      GC.EST_NAME -> Json.toJson(ordenPago.base.estName),
      GC.SUC_ID -> Json.toJson(ordenPago.base.sucId),
      GC.SUC_NAME -> Json.toJson(ordenPago.base.sucName),
      GC.CCOS_ID -> Json.toJson(ordenPago.base.ccosId),
      GC.CCOS_NAME -> Json.toJson(ordenPago.base.ccosName),
      GC.LGJ_ID -> Json.toJson(ordenPago.base.lgjId),
      GC.LGJ_CODE -> Json.toJson(ordenPago.base.lgjCode),
      C.OPG_DESCRIP -> Json.toJson(ordenPago.base.descrip),
      C.OPG_GRABAR_ASIENTO -> Json.toJson(ordenPago.base.grabarAsiento),

      GC.DOCT_ID -> Json.toJson(ordenPago.references.doctId),
      GC.DOCT_NAME -> Json.toJson(ordenPago.references.doctName),
      GC.TA_MASCARA -> Json.toJson(ordenPago.references.taMascara),
      GC.TA_PROPUESTO -> Json.toJson(ordenPago.references.taPropuesto),
      C.OPG_FIRMADO -> Json.toJson(ordenPago.references.firmado),
      C.AS_ID -> Json.toJson(ordenPago.references.asId),
      GC.EDITABLE -> Json.toJson(ordenPago.references.editable),
      GC.EDIT_MSG -> Json.toJson(ordenPago.references.editMsg),

      C.OPG_COTIZACION -> Json.toJson(ordenPago.cotizacion),

      C.OPG_NETO -> Json.toJson(ordenPago.totals.neto),
      C.OPG_OTROS -> Json.toJson(ordenPago.totals.totalOtros),
      C.OPG_TOTAL -> Json.toJson(ordenPago.totals.total),

      "cheques" -> Json.toJson(writeOrdenPagoCheques(ordenPago.items.cheques)),
      "tarjetas" -> Json.toJson(writeOrdenPagoTarjetas(ordenPago.items.tarjetas)),
      "efectivo" -> Json.toJson(writeOrdenPagoEfectivo(ordenPago.items.efectivo)),
      "otros" -> Json.toJson(writeOrdenPagoOtros(ordenPago.items.otros)),
      "cuenta_corriente" -> Json.toJson(writeOrdenPagoCtaCte(ordenPago.items.cuentaCorriente))
    )
    def ordenPagoChequeWrites(i: OrdenPagoItemCheque) = Json.obj(
      C.OPGI_ID -> Json.toJson(i.id),
      C.OPGI_DESCRIP -> Json.toJson(i.base.descrip),
      GC.CUE_ID -> Json.toJson(i.base.cueId),
      GC.CUE_NAME -> Json.toJson(i.base.cueName),
      GC.CCOS_ID -> Json.toJson(i.base.ccosId),
      GC.CCOS_NAME -> Json.toJson(i.base.ccosName),
      GC.MON_ID -> Json.toJson(i.moneda.monId),
      GC.MON_NAME -> Json.toJson(i.moneda.monName),
      C.OPGI_ORDEN -> Json.toJson(i.base.orden),
      C.OPGI_IMPORTE -> Json.toJson(i.totals.importe),
      C.OPGI_IMPORTE_ORIGEN -> Json.toJson(i.totals.importeOrigen),
      GC.BCO_ID -> Json.toJson(i.bcoId),
      GC.BCO_NAME -> Json.toJson(i.bcoName),
      C.CHEQ_ID -> Json.toJson(i.cheqId),
      C.CHEQ_NUMERO -> Json.toJson(i.numero),
      C.CHEQ_NUMERO_DOC -> Json.toJson(i.numeroDoc),
      C.CHEQ_PROPIO -> Json.toJson(i.propio),
      C.CHEQ_FECHA_COBRO -> Json.toJson(i.fechaCobro),
      C.CHEQ_FECHA_VTO -> Json.toJson(i.fechaVto),
      GC.CLE_ID -> Json.toJson(i.cleId),
      GC.CLE_NAME -> Json.toJson(i.cleName)
    )
    def ordenPagoTarjetaWrites(i: OrdenPagoItemTarjeta) = Json.obj(
      C.OPGI_ID -> Json.toJson(i.id),
      C.OPGI_DESCRIP -> Json.toJson(i.base.descrip),
      GC.CUE_ID -> Json.toJson(i.base.cueId),
      GC.CUE_NAME -> Json.toJson(i.base.cueName),
      GC.CCOS_ID -> Json.toJson(i.base.ccosId),
      GC.CCOS_NAME -> Json.toJson(i.base.ccosName),
      GC.MON_ID -> Json.toJson(i.moneda.monId),
      GC.MON_NAME -> Json.toJson(i.moneda.monName),
      C.OPGI_ORDEN -> Json.toJson(i.base.orden),
      C.OPGI_IMPORTE -> Json.toJson(i.totals.importe),
      C.OPGI_IMPORTE_ORIGEN -> Json.toJson(i.totals.importeOrigen),
      C.TJCC_ID -> Json.toJson(i.tjccId),
      C.TJCC_NUMERO -> Json.toJson(i.cuponNumero),
      C.TJCC_NUMERO_DOC -> Json.toJson(i.cuponNumeroDoc),
      GC.TJC_ID -> Json.toJson(i.tjcId),
      GC.TJC_NAME -> Json.toJson(i.tjcName),
      GC.TJCCU_ID -> Json.toJson(i.tjccuId),
      GC.TJCCU_CANTIDAD -> Json.toJson(i.cuotas),
      C.TJCC_FECHA_VTO -> Json.toJson(i.fechaVto),
      C.TJCC_NRO_TARJETA -> Json.toJson(i.numero),
      C.TJCC_NRO_AUTORIZACION -> Json.toJson(i.autorizacion),
      C.OPGI_TARJETA_TIPO -> Json.toJson(i.tarjetaTipo),
      C.TJCC_TITULAR -> Json.toJson(i.titular)
    )
    def ordenPagoEfectivoWrites(i: OrdenPagoItemEfectivo) = Json.obj(
      C.OPGI_ID -> Json.toJson(i.id),
      C.OPGI_DESCRIP -> Json.toJson(i.base.descrip),
      GC.CUE_ID -> Json.toJson(i.base.cueId),
      GC.CUE_NAME -> Json.toJson(i.base.cueName),
      GC.MON_ID -> Json.toJson(i.moneda.monId),
      GC.MON_NAME -> Json.toJson(i.moneda.monName),
      GC.CCOS_ID -> Json.toJson(i.base.ccosId),
      GC.CCOS_NAME -> Json.toJson(i.base.ccosName),
      GC.MON_ID -> Json.toJson(i.moneda.monId),
      GC.MON_NAME -> Json.toJson(i.moneda.monName),
      C.OPGI_ORDEN -> Json.toJson(i.base.orden),
      C.OPGI_IMPORTE -> Json.toJson(i.totals.importe),
      C.OPGI_IMPORTE_ORIGEN -> Json.toJson(i.totals.importeOrigen)
    )
    def ordenPagoOtroWrites(i: OrdenPagoItemOtro) = Json.obj(
      C.OPGI_ID -> Json.toJson(i.id),
      C.OPGI_DESCRIP -> Json.toJson(i.base.descrip),
      GC.CUE_ID -> Json.toJson(i.base.cueId),
      GC.CUE_NAME -> Json.toJson(i.base.cueName),
      GC.CCOS_ID -> Json.toJson(i.base.ccosId),
      GC.CCOS_NAME -> Json.toJson(i.base.ccosName),
      C.OPGI_ORDEN -> Json.toJson(i.base.orden),
      C.OPGI_IMPORTE -> Json.toJson(i.totals.importe),
      C.OPGI_IMPORTE_ORIGEN -> Json.toJson(i.totals.importeOrigen),
      C.OPGI_OTRO_TIPO -> Json.toJson(i.tipo),
      GC.RET_ID -> Json.toJson(i.retencion.retId),
      GC.RET_NAME -> Json.toJson(i.retencion.retName),
      C.OPGI_NRO_RETENCION -> Json.toJson(i.retencion.numero),
      C.OPGI_PORC_RETENCION -> Json.toJson(i.retencion.porcentaje),
      C.OPGI_FECHA_RETENCION -> Json.toJson(i.retencion.fecha),
      C.FC_ID_RET -> Json.toJson(i.retencion.fvId),
      models.cairo.modules.compras.C.FC_NRODOC -> Json.toJson(i.retencion.numeroDoc)
    )
    def ordenPagoCtaCteWrites(i: OrdenPagoItemCuentaCorriente) = Json.obj(
      C.OPGI_ID -> Json.toJson(i.id),
      C.OPGI_DESCRIP -> Json.toJson(i.base.descrip),
      GC.CUE_ID -> Json.toJson(i.base.cueId),
      GC.CUE_NAME -> Json.toJson(i.base.cueName),
      GC.CCOS_ID -> Json.toJson(i.base.ccosId),
      GC.CCOS_NAME -> Json.toJson(i.base.ccosName),
      GC.MON_ID -> Json.toJson(i.moneda.monId),
      GC.MON_NAME -> Json.toJson(i.moneda.monName),
      C.OPGI_ORDEN -> Json.toJson(i.base.orden),
      C.OPGI_IMPORTE -> Json.toJson(i.totals.importe),
      C.OPGI_IMPORTE_ORIGEN -> Json.toJson(i.totals.importeOrigen)
    )
    def writeOrdenPagoCheques(items: List[OrdenPagoItemCheque]) = items.map(item => ordenPagoChequeWrites(item))
    def writeOrdenPagoTarjetas(items: List[OrdenPagoItemTarjeta]) = items.map(item => ordenPagoTarjetaWrites(item))
    def writeOrdenPagoEfectivo(items: List[OrdenPagoItemEfectivo]) = items.map(item => ordenPagoEfectivoWrites(item))
    def writeOrdenPagoOtros(items: List[OrdenPagoItemOtro]) = items.map(item => ordenPagoOtroWrites(item))
    def writeOrdenPagoCtaCte(items: List[OrdenPagoItemCuentaCorriente]) = items.map(item => ordenPagoCtaCteWrites(item))
  }

  def get(id: Int) = GetAction { implicit request =>
    LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.LIST_COBRANZA), { user =>
      Ok(Json.toJson(OrdenPago.get(user, id)))
    })
  }

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //
  // this functions convert the plain JSON received in CREATE and UPDATE into a OrdenPagoData structure
  //
  // because the limitation to 18 fields in case class used for FORM mapping we have grouped the fields
  // in OrdenPago/Data, OrdenPagoItem/Data, etc
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

      // groups for OrdenPagoChequeData
      //
      val ordenPagoCheque = Global.preprocessFormParams(
        List(C.OPGI_ID, GC.MON_ID, GC.BCO_ID, C.CHEQ_ID, C.OPGI_TMP_CHEQUE, C.OPGI_TMP_PROPIO, C.OPGI_TMP_FECHA_COBRO,
          C.OPGI_TMP_FECHA_VTO, GC.CLE_ID), "", params)
      val ordenPagoChequeBaseGroup = Global.preprocessFormParams(ordenPagoItemBase, C.COBRANZA_ITEM_BASE, params)
      val ordenPagoChequeTotalsGroup = Global.preprocessFormParams(ordenPagoItemTotals, C.COBRANZA_ITEM_TOTALS, params)

      val cheque = JsObject(
        (ordenPagoCheque ++ ordenPagoChequeBaseGroup ++ ordenPagoChequeTotalsGroup).toSeq)
      cheque
    }

    def preprocessTarjetaParam(field: JsValue) = {
      val params = field.as[Map[String, JsValue]]

      // groups for OrdenPagoTarjetaData
      //
      val ordenPagoTarjeta = Global.preprocessFormParams(
        List(C.OPGI_ID, GC.MON_ID, C.TJCC_ID, C.OPGI_TMP_CUPON, GC.TJC_ID, GC.TJCCU_ID, C.OPGI_TMP_FECHA_VTO,
          C.OPGI_TMP_NRO_TARJETA, C.OPGI_TMP_AUTORIZACION, C.OPGI_TARJETA_TIPO, C.OPGI_TMP_TITULAR), "", params)
      val ordenPagoTarjetaBaseGroup = Global.preprocessFormParams(ordenPagoItemBase, C.COBRANZA_ITEM_BASE, params)
      val ordenPagoTarjetaTotalsGroup = Global.preprocessFormParams(ordenPagoItemTotals, C.COBRANZA_ITEM_TOTALS, params)

      val tarjeta = JsObject(
        (ordenPagoTarjeta ++ ordenPagoTarjetaBaseGroup ++ ordenPagoTarjetaTotalsGroup).toSeq)
      tarjeta
    }

    def preprocessEfectivoParam(field: JsValue) = {
      val params = field.as[Map[String, JsValue]]

      // groups for OrdenPagoEfectivoData
      //
      val ordenPagoEfectivo = Global.preprocessFormParams(List(C.OPGI_ID, GC.MON_ID), "", params)
      val ordenPagoEfectivoBaseGroup = Global.preprocessFormParams(ordenPagoItemBase, C.COBRANZA_ITEM_BASE, params)
      val ordenPagoEfectivoTotalsGroup = Global.preprocessFormParams(ordenPagoItemTotals, C.COBRANZA_ITEM_TOTALS, params)

      val efectivo = JsObject(
        (ordenPagoEfectivo ++ ordenPagoEfectivoBaseGroup ++ ordenPagoEfectivoTotalsGroup).toSeq)
      efectivo
    }

    def preprocessOtroParam(field: JsValue) = {
      val params = field.as[Map[String, JsValue]]

      // groups for OrdenPagoOtroData
      //
      val ordenPagoOtro = Global.preprocessFormParams(List(C.OPGI_ID, C.OPGI_TIPO), "", params)
      val ordenPagoOtroBaseGroup = Global.preprocessFormParams(ordenPagoItemBase, C.COBRANZA_ITEM_BASE, params)
      val ordenPagoOtroTotalsGroup = Global.preprocessFormParams(ordenPagoItemTotals, C.COBRANZA_ITEM_TOTALS, params)
      val ordenPagoOtroRetencionGroup = Global.preprocessFormParams(ordenPagoItemOtroRetencion, C.COBRANZA_ITEM_OTRO_RETENCION, params)

      val otro = JsObject(
        (ordenPagoOtro ++ ordenPagoOtroBaseGroup ++ ordenPagoOtroTotalsGroup ++ ordenPagoOtroRetencionGroup).toSeq)
      otro
    }

    def preprocessCuentaCorrienteParam(field: JsValue) = {
      val params = field.as[Map[String, JsValue]]

      // groups for OrdenPagoCuentaCorrienteData
      //
      val ordenPagoCuentaCorriente = Global.preprocessFormParams(List(C.OPGI_ID, GC.MON_ID), "", params)
      val ordenPagoCuentaCorrienteBaseGroup = Global.preprocessFormParams(ordenPagoItemBase, C.COBRANZA_ITEM_BASE, params)
      val ordenPagoCuentaCorrienteTotalsGroup = Global.preprocessFormParams(ordenPagoItemTotals, C.COBRANZA_ITEM_TOTALS, params)

      val cuentaCorriente = JsObject(
        (ordenPagoCuentaCorriente ++ ordenPagoCuentaCorrienteBaseGroup ++ ordenPagoCuentaCorrienteTotalsGroup).toSeq)
      cuentaCorriente
    }

    def preprocessFacturaParam(field: JsValue) = {
      val params = field.as[Map[String, JsValue]]
      JsObject(Global.preprocessFormParams(facturaOrdenPago, "", params).toSeq)
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

    // groups for OrdenPagoData
    //
    val facturaId = Global.preprocessFormParams(List("id", C.OPG_FECHA, C.OPG_COTIZACION), "", params)
    val facturaIdGroup = Global.preprocessFormParams(ordenPagoIdFields, C.COBRANZA_ID, params)
    val facturaBaseGroup = Global.preprocessFormParams(ordenPagoBaseFields, C.COBRANZA_BASE, params)
    val facturaTotalGroup = Global.preprocessFormParams(ordenPagoTotalsFields, C.COBRANZA_TOTALS, params)

    // cheques
    //
    val chequesInfo = getJsValueAsMap(Global.getParamsJsonRequestFor(C.COBRANZA_ITEM_CHEQUE_TMP, params))
    val chequeRows = Global.getParamsJsonRequestFor(GC.ITEMS, chequesInfo)
    val chequeDeleted: Map[String, JsValue] = Global.getParamsJsonRequestFor(GC.DELETED_LIST, chequesInfo).toList match {
      case Nil => Map(C.COBRANZA_ITEM_CHEQUE_DELETED -> Json.toJson(""))
      case deletedList :: t => Map(C.COBRANZA_ITEM_CHEQUE_DELETED -> Json.toJson(deletedList._2))
    }
    val ordenPagoCheques = preprocessChequesParam(chequeRows.head._2, C.COBRANZA_ITEM_CHEQUE_TMP)

    // items
    //
    val tarjetasInfo = getJsValueAsMap(Global.getParamsJsonRequestFor(C.COBRANZA_ITEM_TARJETA_TMP, params))
    val tarjetaRows = Global.getParamsJsonRequestFor(GC.ITEMS, tarjetasInfo)
    val tarjetaDeleted: Map[String, JsValue] = Global.getParamsJsonRequestFor(GC.DELETED_LIST, tarjetasInfo).toList match {
      case Nil => Map(C.COBRANZA_ITEM_TARJETA_DELETED -> Json.toJson(""))
      case deletedList :: t => Map(C.COBRANZA_ITEM_TARJETA_DELETED -> Json.toJson(deletedList._2))
    }
    val ordenPagoTarjetas = preprocessTarjetasParam(tarjetaRows.head._2, C.COBRANZA_ITEM_TARJETA_TMP)

    // efectivos
    //
    val efectivosInfo = getJsValueAsMap(Global.getParamsJsonRequestFor(C.COBRANZA_ITEM_EFECTIVO_TMP, params))
    val efectivoRows = Global.getParamsJsonRequestFor(GC.ITEMS, efectivosInfo)
    val efectivoDeleted: Map[String, JsValue] = Global.getParamsJsonRequestFor(GC.DELETED_LIST, efectivosInfo).toList match {
      case Nil => Map(C.COBRANZA_ITEM_EFECTIVO_DELETED -> Json.toJson(""))
      case deletedList :: t => Map(C.COBRANZA_ITEM_EFECTIVO_DELETED -> Json.toJson(deletedList._2))
    }
    val ordenPagoEfectivos = preprocessEfectivosParam(efectivoRows.head._2, C.COBRANZA_ITEM_EFECTIVO_TMP)

    // otros
    //
    val otrosInfo = getJsValueAsMap(Global.getParamsJsonRequestFor(C.COBRANZA_ITEM_OTRO_TMP, params))
    val otroRows = Global.getParamsJsonRequestFor(GC.ITEMS, otrosInfo)
    val otroDeleted: Map[String, JsValue] = Global.getParamsJsonRequestFor(GC.DELETED_LIST, otrosInfo).toList match {
      case Nil => Map(C.COBRANZA_ITEM_OTRO_DELETED -> Json.toJson(""))
      case deletedList :: t => Map(C.COBRANZA_ITEM_OTRO_DELETED -> Json.toJson(deletedList._2))
    }
    val ordenPagoOtros = preprocessOtrosParam(otroRows.head._2, C.COBRANZA_ITEM_OTRO_TMP)

    // ctaCtes
    //
    val ctaCtesInfo = getJsValueAsMap(Global.getParamsJsonRequestFor(C.COBRANZA_ITEM_CUENTA_CORRIENTE_TMP, params))
    val cuentaCorrienteRows = Global.getParamsJsonRequestFor(GC.ITEMS, ctaCtesInfo)
    val cuentaCorrienteDeleted: Map[String, JsValue] = Global.getParamsJsonRequestFor(GC.DELETED_LIST, ctaCtesInfo).toList match {
      case Nil => Map(C.COBRANZA_ITEM_CUENTA_CORRIENTE_DELETED -> Json.toJson(""))
      case deletedList :: t => Map(C.COBRANZA_ITEM_CUENTA_CORRIENTE_DELETED -> Json.toJson(deletedList._2))
    }
    val ordenPagoCtaCtes = preprocessCtaCtesParam(cuentaCorrienteRows.head._2, C.COBRANZA_ITEM_CUENTA_CORRIENTE_TMP)


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
        ++ ordenPagoCheques ++ chequeDeleted
        ++ ordenPagoTarjetas ++ tarjetaDeleted
        ++ ordenPagoEfectivos ++ efectivoDeleted
        ++ ordenPagoOtros ++ otroDeleted
        ++ ordenPagoCtaCtes ++ cuentaCorrienteDeleted
        ++ facturaFacturas).toSeq)
  }
  //
  //
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  def getCheques(items: List[OrdenPagoItemChequeData]): List[OrdenPagoItemCheque] = {
    items.map(cheque => {
      OrdenPagoItemCheque(
        cheque.id,
        OrdenPagoItemBase(
          cheque.base.descrip.getOrElse(""),
          cheque.base.cueId,
          cheque.base.ccosId.getOrElse(DBHelper.NoId),
          cheque.base.orden
        ),
        cheque.monId,
        OrdenPagoItemTotals(
          cheque.totals.importe,
          cheque.totals.importeOrigen
        ),
        cheque.bcoId,
        cheque.cheqId.getOrElse(DBHelper.NoId),
        cheque.numeroDoc,
        cheque.propio,
        DateFormatter.parse(cheque.fechaCobro),
        DateFormatter.parse(cheque.fechaVto),
        cheque.cleId
      )
    })
  }

  def getTarjetas(items: List[OrdenPagoItemTarjetaData]): List[OrdenPagoItemTarjeta] = {
    items.map(tarjeta => {
      OrdenPagoItemTarjeta(
        tarjeta.id,
        OrdenPagoItemBase(
          tarjeta.base.descrip.getOrElse(""),
          tarjeta.base.cueId,
          tarjeta.base.ccosId.getOrElse(DBHelper.NoId),
          tarjeta.base.orden
        ),
        tarjeta.monId,
        OrdenPagoItemTotals(
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

  def getEfectivo(items: List[OrdenPagoItemEfectivoData]): List[OrdenPagoItemEfectivo] = {
    items.map(efectivo => {
      OrdenPagoItemEfectivo(
        efectivo.id,
        OrdenPagoItemBase(
          efectivo.base.descrip.getOrElse(""),
          efectivo.base.cueId,
          efectivo.base.ccosId.getOrElse(DBHelper.NoId),
          efectivo.base.orden
        ),
        DBHelper.NoId,
        OrdenPagoItemTotals(
          efectivo.totals.importe,
          efectivo.totals.importeOrigen
        )
      )
    })
  }

  def getOtros(items: List[OrdenPagoItemOtroData]): List[OrdenPagoItemOtro] = {
    items.map(otro => {
      OrdenPagoItemOtro(
        otro.id,
        OrdenPagoItemBase(
          otro.base.descrip.getOrElse(""),
          otro.base.cueId,
          otro.base.ccosId.getOrElse(DBHelper.NoId),
          otro.base.orden
        ),
        OrdenPagoItemTotals(
          otro.totals.importe,
          otro.totals.importeOrigen
        ),
        otro.tipo,
        OrdenPagoItemRetencion(
          otro.retencion.retId,
          otro.retencion.numero,
          otro.retencion.porcentaje,
          DateFormatter.parse(otro.retencion.fecha),
          otro.retencion.fvId
        )
      )
    })
  }

  def getCtaCte(items: List[OrdenPagoItemCuentaCorrienteData]): List[OrdenPagoItemCuentaCorriente] = {
    items.map(ctaCte => {
      OrdenPagoItemCuentaCorriente(
        ctaCte.id,
        OrdenPagoItemBase(
          ctaCte.base.descrip.getOrElse(""),
          ctaCte.base.cueId,
          ctaCte.base.ccosId.getOrElse(DBHelper.NoId),
          ctaCte.base.orden
        ),
        DBHelper.NoId,
        OrdenPagoItemTotals(
          ctaCte.totals.importe,
          ctaCte.totals.importeOrigen
        )
      )
    })
  }

  def getFacturas(facturas: List[FacturaOrdenPagoData]): List[FacturaOrdenPago] = {
    facturas.map(factura => {
      FacturaOrdenPago(
        factura.fvId,
        factura.fvdId,
        factura.importe,
        factura.importeOrigen,
        factura.cotizacion
      )
    })
  }

  def getOrdenPagoItems(ordenPago: OrdenPagoData): OrdenPagoItems = {
    OrdenPagoItems(
      getCheques(ordenPago.cheques),
      getTarjetas(ordenPago.tarjetas),
      getEfectivo(ordenPago.efectivo),
      getOtros(ordenPago.otros),
      getCtaCte(ordenPago.cuentaCorriente),

      ordenPago.chequeDeleted,
      ordenPago.tarjetaDeleted,
      ordenPago.efectivoDeleted,
      ordenPago.otroDeleted,
      ordenPago.cuentaCorrienteDeleted,

      getFacturas(ordenPago.facturas)
    )
  }

  def getOrdenPago(ordenPago: OrdenPagoData, id: Int): OrdenPago = {
    OrdenPago(
      id,
      OrdenPagoId(
        ordenPago.ids.docId,
        ordenPago.ids.numero,
        ordenPago.ids.nroDoc),
      OrdenPagoBase(
        ordenPago.base.provId,
        ordenPago.base.estId,
        ordenPago.base.ccosId,
        ordenPago.base.sucId,
        ordenPago.base.lgjId,
        ordenPago.base.descrip,
        ordenPago.base.grabarAsiento),
      OrdenPago.emptyOrdenPagoReferences,
      DateFormatter.parse(ordenPago.fecha),
      ordenPago.cotizacion,
      OrdenPagoTotals(
        ordenPago.totals.neto,
        ordenPago.totals.totalOtros,
        ordenPago.totals.total),
      getOrdenPagoItems(ordenPago)
    )
  }

  def update(id: Int) = PostAction { implicit request =>
    Logger.debug("in OrdenesPago.update")

    ordenPagoForm.bind(preprocessParams).fold(
      formWithErrors => {
        Logger.debug(s"invalid form: ${formWithErrors.toString}")
        BadRequest
      },
      ordenPago => {
        Logger.debug(s"form: ${ordenPago.toString}")
        LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.EDIT_COBRANZA), { user =>
          try {
            Ok(
              Json.toJson(
                OrdenPago.update(user,
                  getOrdenPago(ordenPago, id)
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
    Logger.debug("in OrdenesPago.createFromFactura")
    ordenPagoForm.bind(preprocessParams).fold(
      formWithErrors => {
        Logger.debug(s"invalid form: ${formWithErrors.toString}")
        BadRequest
      },
      ordenPago => {
        Logger.debug(s"form: ${ordenPago.toString}")
        LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.NEW_COBRANZA), { user =>
          try {
            Ok(
              Json.toJson(
                OrdenPago.createOrdenPago(user,
                  getOrdenPago(ordenPago, DBHelper.NoId)
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
    Logger.debug("in OrdenesPago.create")
    ordenPagoForm.bind(preprocessParams).fold(
      formWithErrors => {
        Logger.debug(s"invalid form: ${formWithErrors.toString}")
        BadRequest
      },
      ordenPago => {
        Logger.debug(s"form: ${ordenPago.toString}")
        LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.NEW_COBRANZA), { user =>
          try {
            Ok(
              Json.toJson(
                OrdenPago.create(user,
                  getOrdenPago(ordenPago, DBHelper.NoId)
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
    Logger.debug("in OrdenesPago.delete")
    LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.DELETE_COBRANZA), { user =>
      try {
        OrdenPago.delete(user, id)
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
            provId: Option[String],
            estId: Option[String],
            ccosId: Option[String],
            sucId: Option[String],
            docId: Option[String],
            empId: Option[String]
          ) = GetAction { implicit request =>
    LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.LIST_COBRANZA), { user =>
      Ok(
        Json.toJson(
          Recordset.getAsJson(
            OrdenPago.list(
              user,
              DateFormatter.parse(from.getOrElse("")), DateFormatter.parse(to.getOrElse("")),
              provId, estId, ccosId, sucId, docId, empId))))
    })
  }

  def parameters = GetAction { implicit request =>
    LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.LIST_COBRANZA), { user =>
      Ok(Json.toJson(OrdenPago.loadParams(user)))
    })
  }

  def saveParameters = PostAction { implicit request =>
    Logger.debug("in OrdenesPago.saveParameters")
    ordenPagoParamsForm.bindFromRequest.fold(
      formWithErrors => {
        Logger.debug(s"invalid form: ${formWithErrors.toString}")
        BadRequest
      },
      ordenPagoParams => {
        Logger.debug(s"form: ${ordenPagoParams.toString}")
        LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.LIST_COBRANZA), { user =>
          Ok(
            Json.toJson(
              OrdenPago.saveParams(user,
                OrdenPagoParams(
                  ordenPagoParams.from,
                  ordenPagoParams.to,
                  ordenPagoParams.provId,
                  ordenPagoParams.estId,
                  ordenPagoParams.ccosId,
                  ordenPagoParams.sucId,
                  ordenPagoParams.docId,
                  ordenPagoParams.empId
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

  def listFacturas(provId: Int) = GetAction { implicit request =>
    LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.NEW_COBRANZA), { user =>
      val response = OrdenPago.listFacturas(user, provId) match {
        case (facturas, rates) =>
          Json.toJson(
            Json.obj(
              "facturas" -> Json.toJson(Recordset.getAsJson(facturas)),
              "rates" -> Json.toJson(Recordset.getAsJson(rates))
            )
          )
        case _ => Json.toJson("")
      }
      Ok(response)
    })
  }

  def cuentas(ids: Option[String]) = GetAction { implicit request =>
    LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.NEW_COBRANZA), { user =>
      Ok(Json.toJson(Recordset.getAsJson(OrdenPago.cuentas(user, ids.getOrElse("")))))
    })
  }

  def facturas(ids: Option[String]) = GetAction { implicit request =>
    LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.NEW_COBRANZA), { user =>
      Ok(Json.toJson(Recordset.getAsJson(OrdenPago.facturas(user, ids.getOrElse("")))))
    })
  }
}
