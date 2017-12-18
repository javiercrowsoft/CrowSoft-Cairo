package controllers.logged.modules.compras

import controllers._
import models.cairo.modules.general.ProductoProveedor
import play.api.mvc._
import play.api.data._
import play.api.data.Forms._
import actions._
import play.api.Logger
import play.api.libs.json._
import models.cairo.modules.compras._
import models.cairo.system.security.CairoSecurity
import models.cairo.system.database.{Recordset, DBHelper}
import formatters.json.DateFormatter
import formatters.json.DateFormatter._
import scala.util.control.NonFatal

case class FacturaCompraIdData(
                                docId: Int,
                                numero: Int,
                                nroDoc: String
                                )

case class FacturaCompraBaseData(
                              provId: Int,
                              estId: Int,
                              ccosId: Int,
                              sucId: Int,
                              cpgId: Int,
                              lgjId: Int,
                              cai: String,
                              tipoComprobante: Int,
                              descrip: String,
                              grabarAsiento: Boolean
                            )

case class FacturaCompraCotizacionData(
                                        cotizacion: Double,
                                        cotizacionProveedor: Double
                                      )

case class FacturaCompraPreciosData(
                                    desc1: Double,
                                    desc2: Double,
                                    lpId: Int,
                                    ldId: Int
                                   )

case class FacturaCompraDatesData(
                                    fecha: String,
                                    fechaEntrega: String,
                                    fechaIva: String,
                                    fechaVto: String
                                 )

case class FacturaCompraStockData(
                                    proIdOrigen: Int,
                                    proIdDestino: Int,
                                    deplId: Int
                                 )

case class FacturaCompraTotalsData(
                                    neto: Double,
                                    ivaRi: Double,
                                    ivaRni: Double,
                                    internos: Double,
                                    subTotal: Double,
                                    importeDesc1: Double,
                                    importeDesc2: Double,
                                    totalOtros: Double,
                                    totalPercepciones: Double,
                                    total: Double,
                                    totalOrigen: Double
                                  )

case class FacturaCompraItemDataBase(
                                  descrip: String,
                                  descuento: String,
                                  prId: Int,
                                  ccosId: Int,
                                  toId: Int,
                                  cueId: Int,
                                  cueIdIvaRi: Int,
                                  cueIdIvaRni: Int,
                                  stlId: Int,
                                  stlCode: String,
                                  orden: Int
                                  )

case class FacturaCompraItemDataTotals(
                                    cantidad: Double,
                                    precio: Double,
                                    precioLista: Double,
                                    precioUser: Double,
                                    neto: Double,
                                    ivaRi: Double,
                                    ivaRni: Option[Double],
                                    internos: Double,
                                    ivaRiPorc: Double,
                                    ivaRniPorc: Double,
                                    internosPorc: Double,
                                    importe: Double,
                                    importeOrigen: Double
                                    )

case class FacturaCompraItemDataSerie(
                                   id: Int,
                                   code: String,
                                   descrip: String,
                                   fechaVto: String
                                   )

case class FacturaCompraItemData(
                                    id: Int,
                                    base: FacturaCompraItemDataBase,
                                    totals: FacturaCompraItemDataTotals,

                                    series: List[FacturaCompraItemDataSerie],
                                    serieDeleted: String
                                  )

case class FacturaCompraOtroData(
                              id: Int,
                              cueId: Int,
                              debe: Double,
                              haber: Double,
                              ccosId: Int,
                              descrip: String,
                              origen: Double,
                              orden: Int
                              )

case class FacturaCompraLegajoData(
                                id: Int,
                                lgjId: Int,
                                importe: Double,
                                descrip: String,
                                importeOrigen: Double,
                                orden: Int
                                )

case class FacturaCompraPercepcionData(
                                    id: Int,
                                    percId: Int,
                                    base: Double,
                                    porcentaje: Double,
                                    importe: Double,
                                    ccosId: Int,
                                    descrip: String,
                                    origen: Double,
                                    orden: Int
                                    )
case class FacturaCompraData(
                              id: Option[Int],
                              ids: FacturaCompraIdData,
                              base: FacturaCompraBaseData,
                              dates: FacturaCompraDatesData,
                              precios: FacturaCompraPreciosData,
                              cotizacion: FacturaCompraCotizacionData,
                              stock: FacturaCompraStockData,
                              totals: FacturaCompraTotalsData,
                              items: List[FacturaCompraItemData],
                              otros: List[FacturaCompraOtroData],
                              legajos: List[FacturaCompraLegajoData],
                              percepciones: List[FacturaCompraPercepcionData],

                              itemDeleted: String,
                              otroDeleted: String,
                              legajoDeleted: String,
                              percepcionDeleted: String,

                              /* applications */
                              remitos: List[FacturaCompraRemitoData]
                            )

case class FacturaCompraRemitoData(
                                    rciId: Int,
                                    cantidad: Double,
                                    fciId: Int
                                    )

case class FacturaCompraParamsData(
                                from: String,
                                to: String,
                                provId: String,
                                estId: String,
                                ccosId: String,
                                sucId: String,
                                docId: String,
                                cpgId: String,
                                empId: String
                                )

object FacturaCompras extends Controller with ProvidesUser {

  val GC = models.cairo.modules.general.C
  val TC = models.cairo.modules.tesoreria.C

  val facturaCompraParamsForm: Form[FacturaCompraParamsData] = Form(
    mapping(
      GC.FROM -> text,
      GC.TO -> text,
      GC.PROV_ID -> text,
      GC.EST_ID -> text,
      GC.CCOS_ID -> text,
      GC.SUC_ID -> text,
      GC.DOC_ID -> text,
      GC.CPG_ID -> text,
      GC.EMP_ID -> text
    )(FacturaCompraParamsData.apply)(FacturaCompraParamsData.unapply)
  )

  val facturaIdFields = List(GC.DOC_ID, C.FC_NUMERO, C.FC_NRODOC)

  val facturaBaseFields = List(GC.PROV_ID, GC.EST_ID, GC.CCOS_ID, GC.SUC_ID, GC.CPG_ID, GC.LGJ_ID,
                               C.FC_CAI, C.FC_TIPO_COMPROBANTE, C.FC_DESCRIP, C.FC_GRABAR_ASIENTO)

  val facturaDatesFields = List(C.FC_FECHA, C.FC_FECHA_ENTREGA, C.FC_FECHA_IVA, C.FC_FECHA_VTO)

  val facturaPreciosFields = List(C.FC_DESCUENTO1, C.FC_DESCUENTO2, GC.LP_ID, GC.LD_ID)

  val facturaCotizacionFields = List(C.FC_COTIZACION, C.FC_COTIZACION_PROV)

  val facturaStockFields = List(C.PRO_ID_ORIGEN, C.PRO_ID_DESTINO, GC.DEPL_ID)

  val facturaTotalsFields = List(C.FC_NETO, C.FC_IVA_RI, C.FC_IVA_RNI, C.FC_INTERNOS, C.FC_SUBTOTAL,
                                 C.FC_IMPORTE_DESC_1, C.FC_IMPORTE_DESC_2, C.FC_TOTAL_OTROS,
                                 C.FC_TOTAL_PERCEPCIONES, C.FC_TOTAL, C.FC_TOTAL_ORIGEN)

  val facturaItemBase = List(C.FCI_DESCRIP, C.FCI_DESCUENTO, GC.PR_ID, GC.CCOS_ID, GC.TO_ID,
                             GC.CUE_ID, C.CUE_ID_IVA_RI, C.CUE_ID_IVA_RNI, C.STL_ID, C.STL_CODE, C.FCI_ORDEN)

  val facturaItemTotals = List(C.FCI_CANTIDAD, C.FCI_PRECIO, C.FCI_PRECIO_LISTA, C.FCI_PRECIO_USR, C.FCI_NETO,
                               C.FCI_IVA_RI, C.FCI_IVA_RNI, C.FCI_INTERNOS, C.FCI_IVA_RIPORC, C.FCI_IVA_RNIPORC,
                               C.FCI_INTERNOS_PORC, C.FCI_IMPORTE, C.FCI_IMPORTE_ORIGEN)

  val facturaOtro = List(C.FCOT_ID, GC.CUE_ID, C.FCOT_DEBE, C.FCOT_HABER, GC.CCOS_ID, C.FCOT_DESCRIP,
                         C.FCOT_ORIGEN, C.FCOT_ORDEN)

  val facturaLegajo = List(C.FCLGJ_ID, GC.LGJ_ID, C.FCLGJ_IMPORTE, C.FCLGJ_DESCRIP, C.FCLGJ_IMPORTE_ORIGEN,
                           C.FCLGJ_ORDEN)

  val facturaPercepcion = List(C.FCPERC_ID, GC.PERC_ID, C.FCPERC_BASE, C.FCPERC_PORCENTAJE, C.FCPERC_IMPORTE,
                               GC.CCOS_ID, C.FCPERC_DESCRIP, C.FCPERC_ORIGEN, C.FCPERC_ORDEN)

  val facturaRemito = List(C.RCI_ID, C.RC_FC_CANTIDAD, C.FCI_ID)

  val notaCredito = List(TC.FC_ID_NOTA_CREDITO, TC.FC_ID_FACTURA, TC.FCD_ID_NOTA_CREDITO, TC.FCD_ID_FACTURA,
    TC.FCP_ID_NOTA_CREDITO, TC.FCP_ID_FACTURA, TC.FC_NC_IMPORTE, TC.FC_NC_ID)
  val ordenPago = List(TC.OPG_ID, C.FC_ID, TC.FCD_ID, TC.FCP_ID, TC.FC_OPG_ID, TC.FC_OPG_COTIZACION, TC.FC_OPG_IMPORTE, TC.FC_OPG_IMPORTE_ORIGEN)
  val ctaCte = List(GC.CUE_ID, TC.OPGI_IMPORTE_ORIGEN, TC.OPGI_IMPORTE, TC.OPGI_ORDEN, TC.OPGI_TIPO, TC.OPGI_OTRO_TIPO)
  val ordenCompra = List(C.OCI_ID, C.FCI_ID, C.OC_FC_CANTIDAD, C.OC_FC_ID)
  val remitoCompra = List(C.RCI_ID, C.FCI_ID, C.RC_FC_CANTIDAD, C.RC_FC_ID)

  val facturaCompraAplicForm: Form[FacturaCompraAplic] = Form(
    mapping(
      C.FC_ID -> number,
      GC.DOC_ID -> number,
      TC.FACTURA_COMPRA_NOTA_CREDITO_TMP -> Forms.list[FacturaCompraNotaCreditoItem](
          mapping(
            TC.FC_ID_NOTA_CREDITO -> number,
            TC.FC_ID_FACTURA -> number,
            TC.FCD_ID_NOTA_CREDITO -> number,
            TC.FCD_ID_FACTURA -> number,
            TC.FCP_ID_NOTA_CREDITO -> number,
            TC.FCP_ID_FACTURA -> number,
            TC.FC_NC_IMPORTE -> of(Global.doubleFormat),
            TC.FC_NC_ID-> number
          )(FacturaCompraNotaCreditoItem.apply)(FacturaCompraNotaCreditoItem.unapply)
      ),
      TC.ORDEN_PAGO_TMP -> Forms.list[FacturaCompraOrdenPagoItem](
          mapping(
            TC.OPG_ID -> number,
            TC.FACTURA_COMPRA_ORDEN_PAGO_TMP -> Forms.list[PagoItem](
              mapping(
                TC.OPG_ID -> number,
                C.FC_ID -> number,
                TC.FCD_ID -> number,
                TC.FCP_ID -> number,
                TC.FC_OPG_ID -> number,
                TC.FC_OPG_COTIZACION -> of(Global.doubleFormat),
                TC.FC_OPG_IMPORTE -> of(Global.doubleFormat),
                TC.FC_OPG_IMPORTE_ORIGEN -> of(Global.doubleFormat)
              )(PagoItem.apply)(PagoItem.unapply)
            ),
            TC.ORDEN_PAGO_ITEM_CUENTA_CORRIENTE_TMP -> Forms.list[PagoCtaCte](
              mapping(
                GC.CUE_ID -> number,
                TC.OPGI_IMPORTE_ORIGEN -> of(Global.doubleFormat),
                TC.OPGI_IMPORTE -> of(Global.doubleFormat),
                TC.OPGI_ORDEN -> number,
                TC.OPGI_TIPO -> number,
                TC.OPGI_OTRO_TIPO -> number
              )(PagoCtaCte.apply)(PagoCtaCte.unapply)
            )
          )(FacturaCompraOrdenPagoItem.apply)(FacturaCompraOrdenPagoItem.unapply)
      ),
      C.ORDEN_FACTURA_COMPRA_TMP -> Forms.list[FacturaCompraOrdenCompraItem](
          mapping(
            C.OCI_ID -> number,
            C.FCI_ID -> number,
            C.OC_FC_CANTIDAD -> of(Global.doubleFormat),
            C.OC_FC_ID -> number
          )(FacturaCompraOrdenCompraItem.apply)(FacturaCompraOrdenCompraItem.unapply)
      ),
      C.REMITO_FACTURA_COMPRA_TMP -> Forms.list[FacturaCompraRemitoCompraItem](
          mapping(
            C.RCI_ID -> number,
            C.FCI_ID -> number,
            C.RC_FC_CANTIDAD -> of(Global.doubleFormat),
            C.RC_FC_ID -> number
          )(FacturaCompraRemitoCompraItem.apply)(FacturaCompraRemitoCompraItem.unapply)
      )
    )(FacturaCompraAplic.apply)(FacturaCompraAplic.unapply)
  )

  val facturaCompraForm: Form[FacturaCompraData] = Form(
    mapping(
      "id" -> optional(number),
      C.FACTURA_ID -> mapping(
        GC.DOC_ID -> number,
        C.FC_NUMERO -> number,
        C.FC_NRODOC -> text)
        (FacturaCompraIdData.apply)(FacturaCompraIdData.unapply),
      C.FACTURA_BASE -> mapping(
        GC.PROV_ID -> number,
        GC.EST_ID -> number,
        GC.CCOS_ID -> number,
        GC.SUC_ID -> number,
        GC.CPG_ID -> number,
        GC.LGJ_ID -> number,
        C.FC_CAI -> text,
        C.FC_TIPO_COMPROBANTE -> number,
        C.FC_DESCRIP -> text,
        C.FC_GRABAR_ASIENTO -> boolean)
        (FacturaCompraBaseData.apply)(FacturaCompraBaseData.unapply),
      C.FACTURA_DATES -> mapping (
        C.FC_FECHA -> text,
        C.FC_FECHA_ENTREGA -> text,
        C.FC_FECHA_IVA -> text,
        C.FC_FECHA_VTO -> text)
        (FacturaCompraDatesData.apply)(FacturaCompraDatesData.unapply),
      C.FACTURA_PRECIOS -> mapping (
        C.FC_DESCUENTO1 -> of(Global.doubleFormat),
        C.FC_DESCUENTO2 -> of(Global.doubleFormat),
        GC.LP_ID -> number,
        GC.LD_ID -> number)
        (FacturaCompraPreciosData.apply)(FacturaCompraPreciosData.unapply),
      C.FACTURA_COTIZACION -> mapping (
        C.FC_COTIZACION -> of(Global.doubleFormat),
        C.FC_COTIZACION_PROV -> of(Global.doubleFormat))
        (FacturaCompraCotizacionData.apply)(FacturaCompraCotizacionData.unapply),
      C.FACTURA_STOCK -> mapping (
        C.PRO_ID_ORIGEN -> number,
        C.PRO_ID_DESTINO -> number,
        GC.DEPL_ID -> number)
        (FacturaCompraStockData.apply)(FacturaCompraStockData.unapply),
      C.FACTURA_TOTALS -> mapping (
        C.FC_NETO -> of(Global.doubleFormat),
        C.FC_IVA_RI -> of(Global.doubleFormat),
        C.FC_IVA_RNI -> of(Global.doubleFormat),
        C.FC_INTERNOS -> of(Global.doubleFormat),
        C.FC_SUBTOTAL -> of(Global.doubleFormat),
        C.FC_IMPORTE_DESC_1 -> of(Global.doubleFormat),
        C.FC_IMPORTE_DESC_2 -> of(Global.doubleFormat),
        C.FC_TOTAL_OTROS -> of(Global.doubleFormat),
        C.FC_TOTAL_PERCEPCIONES -> of(Global.doubleFormat),
        C.FC_TOTAL -> of(Global.doubleFormat),
        C.FC_TOTAL_ORIGEN -> of(Global.doubleFormat)
        )(FacturaCompraTotalsData.apply)(FacturaCompraTotalsData.unapply),
      C.FACTURA_COMPRA_ITEM_TMP -> Forms.list[FacturaCompraItemData](
        mapping(
          C.FCI_ID -> number,
          C.FACTURA_ITEM_BASE -> mapping (
            C.FCI_DESCRIP -> text,
            C.FCI_DESCUENTO -> text,
            GC.PR_ID -> number,
            GC.CCOS_ID -> number,
            GC.TO_ID -> number,
            GC.CUE_ID -> number,
            C.CUE_ID_IVA_RI -> number,
            C.CUE_ID_IVA_RNI -> number,
            C.STL_ID -> number,
            C.STL_CODE -> text,
            C.FCI_ORDEN -> number)
            (FacturaCompraItemDataBase.apply)(FacturaCompraItemDataBase.unapply),
          C.FACTURA_ITEM_TOTALS -> mapping (
            C.FCI_CANTIDAD -> of(Global.doubleFormat),
            C.FCI_PRECIO -> of(Global.doubleFormat),
            C.FCI_PRECIO_LISTA -> of(Global.doubleFormat),
            C.FCI_PRECIO_USR -> of(Global.doubleFormat),
            C.FCI_NETO -> of(Global.doubleFormat),
            C.FCI_IVA_RI -> of(Global.doubleFormat),
            C.FCI_IVA_RNI -> optional(of(Global.doubleFormat)),
            C.FCI_INTERNOS -> of(Global.doubleFormat),
            C.FCI_IVA_RIPORC -> of(Global.doubleFormat),
            C.FCI_IVA_RNIPORC -> of(Global.doubleFormat),
            C.FCI_INTERNOS_PORC -> of(Global.doubleFormat),
            C.FCI_IMPORTE -> of(Global.doubleFormat),
            C.FCI_IMPORTE_ORIGEN -> of(Global.doubleFormat))
            (FacturaCompraItemDataTotals.apply)(FacturaCompraItemDataTotals.unapply),
          C.FACTURA_COMPRA_ITEM_SERIE_TMP -> Forms.list[FacturaCompraItemDataSerie](
            mapping (
              GC.PRNS_ID -> number,
              GC.PRNS_CODE -> text,
              GC.PRNS_DESCRIP -> text,
              GC.PRNS_FECHA_VTO -> text)
              (FacturaCompraItemDataSerie.apply)(FacturaCompraItemDataSerie.unapply)
            ),
          C.FACTURA_ITEM_SERIE_DELETED -> text)
        (FacturaCompraItemData.apply)(FacturaCompraItemData.unapply)
      ),
      C.FACTURA_COMPRA_OTRO_TMP -> Forms.list[FacturaCompraOtroData](
        mapping (
          C.FCOT_ID -> number,
          GC.CUE_ID -> number,
          C.FCOT_DEBE -> of(Global.doubleFormat),
          C.FCOT_HABER -> of(Global.doubleFormat),
          GC.CCOS_ID -> number,
          C.FCOT_DESCRIP -> text,
          C.FCOT_ORIGEN -> of(Global.doubleFormat),
          C.FCOT_ORDEN -> number)
          (FacturaCompraOtroData.apply)(FacturaCompraOtroData.unapply)
      ),
      C.FACTURA_COMPRA_LEGAJO_TMP -> Forms.list[FacturaCompraLegajoData](
        mapping (
          C.FCLGJ_ID -> number,
          GC.LGJ_ID -> number,
          C.FCLGJ_IMPORTE -> of(Global.doubleFormat),
          C.FCLGJ_DESCRIP -> text,
          C.FCLGJ_IMPORTE_ORIGEN -> of(Global.doubleFormat),
          C.FCLGJ_ORDEN -> number)
          (FacturaCompraLegajoData.apply)(FacturaCompraLegajoData.unapply)
      ),
      C.FACTURA_COMPRA_PERCEPCION_TMP -> Forms.list[FacturaCompraPercepcionData](
        mapping (
          C.FCPERC_ID -> number,
          GC.PERC_ID -> number,
          C.FCPERC_BASE -> of(Global.doubleFormat),
          C.FCPERC_PORCENTAJE -> of(Global.doubleFormat),
          C.FCPERC_IMPORTE -> of(Global.doubleFormat),
          GC.CCOS_ID -> number,
          C.FCPERC_DESCRIP -> text,
          C.FCPERC_ORIGEN -> of(Global.doubleFormat),
          C.FCPERC_ORDEN -> number)
          (FacturaCompraPercepcionData.apply)(FacturaCompraPercepcionData.unapply)
      ),
      C.FACTURA_ITEM_DELETED -> text,
      C.FACTURA_OTRO_DELETED -> text,
      C.FACTURA_LEGAJO_DELETED -> text,
      C.FACTURA_PERCEPCION_DELETED -> text,
      C.REMITO_FACTURA_COMPRA_TMP -> Forms.list[FacturaCompraRemitoData](
        mapping (
          C.RCI_ID -> number,
          C.RC_FC_CANTIDAD -> of(Global.doubleFormat),
          C.FCI_ID -> number)
          (FacturaCompraRemitoData.apply)(FacturaCompraRemitoData.unapply)
      )
    )(FacturaCompraData.apply)(FacturaCompraData.unapply)
  )

  implicit val facturaCompraParamsWrites = new Writes[FacturaCompraParams] {
    def writes(facturaCompraParams: FacturaCompraParams) = Json.obj(
      GC.FROM -> Json.toJson(facturaCompraParams.from),
      GC.TO -> Json.toJson(facturaCompraParams.to),
      GC.PROV_ID -> Json.toJson(facturaCompraParams.provId),
      GC.PROV_NAME -> Json.toJson(facturaCompraParams.provName),
      GC.EST_ID -> Json.toJson(facturaCompraParams.estId),
      GC.EST_NAME -> Json.toJson(facturaCompraParams.estName),
      GC.CCOS_ID -> Json.toJson(facturaCompraParams.ccosId),
      GC.CCOS_NAME -> Json.toJson(facturaCompraParams.ccosName),
      GC.SUC_ID -> Json.toJson(facturaCompraParams.sucId),
      GC.SUC_NAME -> Json.toJson(facturaCompraParams.sucName),
      GC.DOC_ID -> Json.toJson(facturaCompraParams.docId),
      GC.DOC_NAME -> Json.toJson(facturaCompraParams.docName),
      GC.CPG_ID -> Json.toJson(facturaCompraParams.cpgId),
      GC.CPG_NAME -> Json.toJson(facturaCompraParams.cpgName),
      GC.EMP_ID -> Json.toJson(facturaCompraParams.empId),
      GC.EMP_NAME -> Json.toJson(facturaCompraParams.empName)
    )
  }

  implicit val facturaCompraWrites = new Writes[FacturaCompra] {
    def writes(facturaCompra: FacturaCompra) = Json.obj(
      "id" -> Json.toJson(facturaCompra.id),
      C.FC_ID -> Json.toJson(facturaCompra.id),

      GC.DOC_ID -> Json.toJson(facturaCompra.ids.docId),
      GC.DOC_NAME -> Json.toJson(facturaCompra.ids.docName),
      C.FC_NRODOC -> Json.toJson(facturaCompra.ids.nroDoc),
      C.FC_NUMERO -> Json.toJson(facturaCompra.ids.numero),

      C.FC_FECHA -> Json.toJson(facturaCompra.dates.fecha),
      C.FC_FECHA_ENTREGA -> Json.toJson(facturaCompra.dates.fechaEntrega),
      C.FC_FECHA_IVA -> Json.toJson(facturaCompra.dates.fechaIva),
      C.FC_FECHA_VTO -> Json.toJson(facturaCompra.dates.fechaVto),

      GC.PROV_ID -> Json.toJson(facturaCompra.base.provId),
      GC.PROV_NAME -> Json.toJson(facturaCompra.base.provName),
      GC.EST_ID -> Json.toJson(facturaCompra.base.estId),
      GC.EST_NAME -> Json.toJson(facturaCompra.base.estName),
      GC.SUC_ID -> Json.toJson(facturaCompra.base.sucId),
      GC.SUC_NAME -> Json.toJson(facturaCompra.base.sucName),
      GC.CPG_ID -> Json.toJson(facturaCompra.base.cpgId),
      GC.CPG_NAME -> Json.toJson(facturaCompra.base.cpgName),
      GC.CCOS_ID -> Json.toJson(facturaCompra.base.ccosId),
      GC.CCOS_NAME -> Json.toJson(facturaCompra.base.ccosName),
      GC.LGJ_ID -> Json.toJson(facturaCompra.base.lgjId),
      GC.LGJ_CODE -> Json.toJson(facturaCompra.base.lgjCode),
      C.FC_CAI -> Json.toJson(facturaCompra.base.cai),
      C.FC_DESCRIP -> Json.toJson(facturaCompra.base.descrip),
      C.FC_TIPO_COMPROBANTE -> Json.toJson(facturaCompra.base.tipoComprobante),
      C.FC_GRABAR_ASIENTO -> Json.toJson(facturaCompra.base.grabarAsiento),

      GC.DOCT_ID -> Json.toJson(facturaCompra.references.doctId),
      GC.DOCT_NAME -> Json.toJson(facturaCompra.references.doctName),
      GC.MON_ID -> Json.toJson(facturaCompra.references.monId),
      GC.MON_NAME -> Json.toJson(facturaCompra.references.monName),
      GC.TA_MASCARA -> Json.toJson(facturaCompra.references.taMascara),
      GC.TA_PROPUESTO -> Json.toJson(facturaCompra.references.taPropuesto),
      C.FC_FIRMADO -> Json.toJson(facturaCompra.references.firmado),
      GC.DOC_MUEVE_STOCK -> Json.toJson(facturaCompra.references.docMueveStock),
      GC.DOC_TIPO_FACTURA -> Json.toJson(facturaCompra.references.docTipoFactura),
      C.ST_ID -> Json.toJson(facturaCompra.references.stId),
      C.AS_ID -> Json.toJson(facturaCompra.references.asId),
      GC.HAS_IVA_RI -> Json.toJson(facturaCompra.references.hasIvaRi),
      GC.HAS_IVA_RNI -> Json.toJson(facturaCompra.references.hasIvaRni),
      GC.EDITABLE -> Json.toJson(facturaCompra.references.editable),
      GC.EDIT_MSG -> Json.toJson(facturaCompra.references.editMsg),

      C.FC_COTIZACION -> Json.toJson(facturaCompra.cotizacion.cotizacion),
      C.FC_COTIZACION_PROV -> Json.toJson(facturaCompra.cotizacion.cotizacionProveedor),

      C.FC_DESCUENTO1 -> Json.toJson(facturaCompra.precios.desc1),
      C.FC_DESCUENTO2 -> Json.toJson(facturaCompra.precios.desc2),
      GC.LP_ID -> Json.toJson(facturaCompra.precios.lpId),
      GC.LP_NAME -> Json.toJson(facturaCompra.precios.lpName),
      GC.LD_ID -> Json.toJson(facturaCompra.precios.ldId),
      GC.LD_NAME -> Json.toJson(facturaCompra.precios.ldName),

      GC.DEPL_ID -> Json.toJson(facturaCompra.stock.deplId),
      GC.DEPL_NAME -> Json.toJson(facturaCompra.stock.deplName),
      C.PRO_ID_ORIGEN -> Json.toJson(facturaCompra.stock.proIdOrigen),
      C.PRO_ORIGEN_NAME -> Json.toJson(facturaCompra.stock.proNameOrigen),
      C.PRO_ID_DESTINO -> Json.toJson(facturaCompra.stock.proIdOrigen),
      C.PRO_DESTINO_NAME -> Json.toJson(facturaCompra.stock.proNameOrigen),

      C.FC_NETO -> Json.toJson(facturaCompra.totals.neto),
      C.FC_IVA_RI -> Json.toJson(facturaCompra.totals.ivaRi),
      C.FC_IVA_RNI -> Json.toJson(facturaCompra.totals.ivaRni),
      C.FC_INTERNOS -> Json.toJson(facturaCompra.totals.internos),
      C.FC_SUBTOTAL -> Json.toJson(facturaCompra.totals.subTotal),
      C.FC_IMPORTE_DESC_1 -> Json.toJson(facturaCompra.totals.importeDesc1),
      C.FC_IMPORTE_DESC_2 -> Json.toJson(facturaCompra.totals.importeDesc2),
      C.FC_TOTAL_OTROS -> Json.toJson(facturaCompra.totals.totalOtros),
      C.FC_TOTAL_PERCEPCIONES -> Json.toJson(facturaCompra.totals.totalPercepciones),
      C.FC_TOTAL -> Json.toJson(facturaCompra.totals.total),
      C.FC_TOTAL_ORIGEN -> Json.toJson(facturaCompra.totals.totalOrigen),

      // Items
      "items" -> Json.toJson(writeFacturaCompraItems(facturaCompra.items.items)),
      "serialNumbers" -> Json.toJson(writeFacturaCompraItemSeries(facturaCompra.items.series)),
      "otros" -> Json.toJson(writeFacturaCompraOtros(facturaCompra.items.otros)),
      "legajos" -> Json.toJson(writeFacturaCompraLegajos(facturaCompra.items.legajos)),
      "percepciones" -> Json.toJson(writeFacturaCompraPercepciones(facturaCompra.items.percepciones))
    )
    def facturaCompraItemWrites(i: FacturaCompraItem) = Json.obj(
      C.FCI_ID -> Json.toJson(i.id),
      C.FCI_DESCRIP -> Json.toJson(i.base.descrip),
      C.FCI_DESCUENTO -> Json.toJson(i.base.descuento),
      GC.PR_ID -> Json.toJson(i.base.prId),
      GC.PR_NAME_COMPRA -> Json.toJson(i.base.prName),
      GC.CCOS_ID -> Json.toJson(i.base.ccosId),
      GC.CCOS_NAME -> Json.toJson(i.base.ccosName),
      GC.TO_ID -> Json.toJson(i.base.toId),
      GC.TO_NAME -> Json.toJson(i.base.toName),
      GC.CUE_ID -> Json.toJson(i.base.cueId),
      C.CUE_ID_IVA_RI -> Json.toJson(i.base.cueIdIvaRi),
      C.CUE_ID_IVA_RNI -> Json.toJson(i.base.cueIdIvaRni),
      C.STL_ID -> Json.toJson(i.base.stlId),
      C.STL_CODE -> Json.toJson(i.base.stlCode),
      C.FCI_ORDEN -> Json.toJson(i.base.orden),
      GC.PR_LLEVA_NRO_SERIE -> Json.toJson(i.base.llevaNroSerie),
      GC.PR_LLEVA_NRO_LOTE -> Json.toJson(i.base.llevaNroLote),
      GC.UN_NAME -> Json.toJson(i.base.unName),
      C.FCI_CANTIDAD -> Json.toJson(i.totals.cantidad),
      C.FCI_PRECIO -> Json.toJson(i.totals.precio),
      C.FCI_PRECIO_LISTA -> Json.toJson(i.totals.precioLista),
      C.FCI_PRECIO_USR -> Json.toJson(i.totals.precioUser),
      C.FCI_NETO -> Json.toJson(i.totals.neto),
      C.FCI_IVA_RI -> Json.toJson(i.totals.ivaRi),
      C.FCI_IVA_RNI -> Json.toJson(i.totals.ivaRni),
      C.FCI_INTERNOS -> Json.toJson(i.totals.internos),
      C.FCI_IVA_RIPORC -> Json.toJson(i.totals.ivaRiPorc),
      C.FCI_IVA_RNIPORC -> Json.toJson(i.totals.ivaRniPorc),
      C.FCI_INTERNOS_PORC -> Json.toJson(i.totals.internosPorc),
      GC.PR_PORC_INTERNO_C -> Json.toJson(i.totals.prInternosPorc),
      C.FCI_IMPORTE -> Json.toJson(i.totals.importe),
      C.FCI_IMPORTE_ORIGEN -> Json.toJson(i.totals.importeOrigen)
    )
    def facturaCompraItemSerieWrites(i: FacturaCompraItemSerie) = Json.obj(
      C.FCI_ID -> Json.toJson(i.fciId),
      GC.PRNS_ID -> Json.toJson(i.id),
      GC.PRNS_CODE -> Json.toJson(i.code),
      GC.PRNS_DESCRIP -> Json.toJson(i.descrip),
      GC.PRNS_FECHA_VTO -> Json.toJson(i.fechaVto)
    )
    def facturaCompraOtroWrites(o: FacturaCompraOtro) = Json.obj(
      C.FCOT_ID -> Json.toJson(o.id),
      GC.CUE_ID -> Json.toJson(o.cueId),
      GC.CUE_NAME -> Json.toJson(o.cueName),
      C.FCOT_DEBE -> Json.toJson(o.debe),
      C.FCOT_HABER -> Json.toJson(o.haber),
      GC.CCOS_ID -> Json.toJson(o.ccosId),
      GC.CCOS_NAME -> Json.toJson(o.ccosName),
      C.FCOT_DESCRIP -> Json.toJson(o.descrip),
      C.FCOT_ORIGEN -> Json.toJson(o.origen),
      C.FCOT_ORDEN -> Json.toJson(o.orden)
    )
    def facturaCompraLegajoWrites(l: FacturaCompraLegajo) = Json.obj(
      C.FCLGJ_ID -> Json.toJson(l.id),
      GC.LGJ_ID -> Json.toJson(l.lgjId),
      GC.LGJ_CODE -> Json.toJson(l.lgjCode),
      C.FCLGJ_IMPORTE -> Json.toJson(l.importe),
      C.FCLGJ_DESCRIP -> Json.toJson(l.descrip),
      C.FCLGJ_IMPORTE_ORIGEN -> Json.toJson(l.importeOrigen),
      C.FCLGJ_ORDEN -> Json.toJson(l.orden)
    )
    def facturaCompraPercepcionWrites(p: FacturaCompraPercepcion) = Json.obj(
      C.FCPERC_ID -> Json.toJson(p.id),
      GC.PERC_ID -> Json.toJson(p.percId),
      GC.PERC_NAME -> Json.toJson(p.percName),
      C.FCPERC_BASE -> Json.toJson(p.base),
      C.FCPERC_PORCENTAJE -> Json.toJson(p.porcentaje),
      C.FCPERC_IMPORTE -> Json.toJson(p.importe),
      GC.CCOS_ID -> Json.toJson(p.ccosId),
      GC.CCOS_NAME -> Json.toJson(p.ccosName),
      C.FCPERC_DESCRIP -> Json.toJson(p.descrip),
      C.FCPERC_ORIGEN -> Json.toJson(p.origen),
      C.FCPERC_ORDEN -> Json.toJson(p.orden)
    )
    def writeFacturaCompraItems(items: List[FacturaCompraItem]) = items.map(item => facturaCompraItemWrites(item))
    def writeFacturaCompraItemSeries(items: List[FacturaCompraItemSerie]) = items.map(item => facturaCompraItemSerieWrites(item))
    def writeFacturaCompraOtros(items: List[FacturaCompraOtro]) = items.map(item => facturaCompraOtroWrites(item))
    def writeFacturaCompraLegajos(items: List[FacturaCompraLegajo]) = items.map(item => facturaCompraLegajoWrites(item))
    def writeFacturaCompraPercepciones(items: List[FacturaCompraPercepcion]) = items.map(item => facturaCompraPercepcionWrites(item))
  }

  def get(id: Int) = GetAction { implicit request =>
    LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.LIST_FACTURA_COMPRA), { user =>
      Ok(Json.toJson(FacturaCompra.get(user, id)))
    })
  }

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //
  // this functions convert the plain JSON received in CREATE and UPDATE into a FacturaData structure
  //
  // because the limitation to 18 fields in case class used for FORM mapping we have grouped the fields
  // in FacturaCompra/Data, FacturaCompraItem/Data, etc
  //
  // the below routines group a flat JSON and in some cases rename the name of the fields or move
  // fields to the parent node in the JSON structure to match the case class
  //

  private def preprocessParams(implicit request:Request[AnyContent]): JsObject = {

    def getJsValueAsMap(list: Map[String, JsValue]): Map[String, JsValue] = list.toList match {
      case (key: String, jsValue: JsValue) :: t => jsValue.as[Map[String, JsValue]]
      case _ => Map.empty
    }

    def preprocessSeriesParam(items: JsValue, group: String): Map[String, JsValue] = items match {
      case jsArray: JsArray => Map(group -> jsArray)
      case _ => Map(group -> JsArray(List()))
    }

    def preprocessItemParam(field: JsValue) = {
      val params = field.as[Map[String, JsValue]]

      // groups for FacturaCompraItemData
      //
      val facturaItem = Global.preprocessFormParams(List(C.FCI_ID), "", params)
      val facturaItemBaseGroup = Global.preprocessFormParams(facturaItemBase, C.FACTURA_ITEM_BASE, params)
      val facturaItemTotalsGroup = Global.preprocessFormParams(facturaItemTotals, C.FACTURA_ITEM_TOTALS, params)

      // in the POSTED JSON we have this structure:
      //
      //     FacturaCompraItemSerieTMP: {
      //          items: [],
      //          deletedList: ""
      //      }
      //
      // we need to convert it into
      //
      //      deletedList: "",
      //      FacturaCompraItemSerieTMP: []
      //
      // NOTICE that deletedList is a field of FacturaCompraItemSerieTMP but in the converted structure
      // it is move up to the parent node ( the FacturaCompraItem )
      //
      // this is done because in database.js we have one Transaction object to manage items in a Master-Detail
      // relation like FacturaCompraItem -> FacturaCompraItemSerie or FacturaCompra -> FacturaCompraItem
      //
      // this Transaction object is an intermediary object which doesn't exists here
      //
      // so FacturaCompraItemData has deletedList field called serieDeleted and FacturaCompraData has four deletedList
      // fields: itemDeleted, otroDeleted, percepcionDeleted and legajoDeleted
      //

      val serieInfo = getJsValueAsMap(Global.getParamsJsonRequestFor(C.FACTURA_COMPRA_ITEM_SERIE_TMP, params))
      val serieRows = Global.getParamsJsonRequestFor(GC.ITEMS, serieInfo)
      val deletedList: Map[String, JsValue] = Global.getParamsJsonRequestFor(GC.DELETED_LIST, serieInfo).toList match {
        case Nil => Map(GC.DELETED_LIST -> Json.toJson(""))
        case deletedList :: t => Map(deletedList)
      }
      val serieItems = serieRows.toList match {
        case (k: String, item: JsValue) :: t => preprocessSeriesParam(item, C.FACTURA_COMPRA_ITEM_SERIE_TMP)
        case _ => Map(C.FACTURA_COMPRA_ITEM_SERIE_TMP -> JsArray(List()))
      }

      val item = JsObject(
        (facturaItem ++ facturaItemBaseGroup ++ facturaItemTotalsGroup ++ serieItems ++ deletedList).toSeq)
      item
    }

    def preprocessOtroParam(field: JsValue) = {
      val params = field.as[Map[String, JsValue]]
      JsObject(Global.preprocessFormParams(facturaOtro, "", params).toSeq)
    }

    def preprocessPercepcionParam(field: JsValue) = {
      val params = field.as[Map[String, JsValue]]
      JsObject(Global.preprocessFormParams(facturaPercepcion, "", params).toSeq)
    }

    def preprocessLegajoParam(field: JsValue) = {
      val params = field.as[Map[String, JsValue]]
      JsObject(Global.preprocessFormParams(facturaLegajo, "", params).toSeq)
    }

    def preprocessRemitoParam(field: JsValue) = {
      val params = field.as[Map[String, JsValue]]
      JsObject(Global.preprocessFormParams(facturaRemito, "", params).toSeq)
    }

    def preprocessItemsParam(items: JsValue, group: String): Map[String, JsValue] = items match {
      case JsArray(arr) => Map(group -> JsArray(arr.map(preprocessItemParam(_))))
      case _ => Map.empty
    }

    def preprocessOtrosParam(items: JsValue, group: String): Map[String, JsValue] = items match {
      case JsArray(arr) => Map(group -> JsArray(arr.map(preprocessOtroParam(_))))
      case _ => Map.empty
    }

    def preprocessPercepcionesParam(items: JsValue, group: String): Map[String, JsValue] = items match {
      case JsArray(arr) => Map(group -> JsArray(arr.map(preprocessPercepcionParam(_))))
      case _ => Map.empty
    }

    def preprocessLegajosParam(items: JsValue, group: String): Map[String, JsValue] = items match {
      case JsArray(arr) => Map(group -> JsArray(arr.map(preprocessLegajoParam(_))))
      case _ => Map.empty
    }

    def preprocessRemitosParam(items: JsValue, group: String): Map[String, JsValue] = items match {
      case JsArray(arr) => Map(group -> JsArray(arr.map(preprocessRemitoParam(_))))
      case _ => Map.empty
    }

    val params = Global.getParamsFromJsonRequest

    // groups for FacturaCompraData
    //
    val facturaId = Global.preprocessFormParams(List("id"), "", params)
    val facturaIdGroup = Global.preprocessFormParams(facturaIdFields, C.FACTURA_ID, params)
    val facturaBaseGroup = Global.preprocessFormParams(facturaBaseFields, C.FACTURA_BASE, params)
    val facturaDatesGroup = Global.preprocessFormParams(facturaDatesFields, C.FACTURA_DATES, params)
    val facturaPreciosGroup = Global.preprocessFormParams(facturaPreciosFields, C.FACTURA_PRECIOS, params)
    val facturaCotizacionGroup = Global.preprocessFormParams(facturaCotizacionFields, C.FACTURA_COTIZACION, params)
    val facturaStockGroup = Global.preprocessFormParams(facturaStockFields, C.FACTURA_STOCK, params)
    val facturaTotalGroup = Global.preprocessFormParams(facturaTotalsFields, C.FACTURA_TOTALS, params)

    // items
    //
    val itemsInfo = getJsValueAsMap(Global.getParamsJsonRequestFor(C.FACTURA_COMPRA_ITEM_TMP, params))
    val itemRows = Global.getParamsJsonRequestFor(GC.ITEMS, itemsInfo)
    val itemDeleted: Map[String, JsValue] = Global.getParamsJsonRequestFor(GC.DELETED_LIST, itemsInfo).toList match {
      case Nil => Map(C.FACTURA_ITEM_DELETED -> Json.toJson(""))
      case deletedList :: t => Map(C.FACTURA_ITEM_DELETED -> Json.toJson(deletedList._2))
    }
    val facturaItems = preprocessItemsParam(itemRows.head._2, C.FACTURA_COMPRA_ITEM_TMP)

    // otros
    //
    val otrosInfo = getJsValueAsMap(Global.getParamsJsonRequestFor(C.FACTURA_COMPRA_OTRO_TMP, params))
    val otroRows = Global.getParamsJsonRequestFor(GC.ITEMS, otrosInfo)
    val otroDeleted: Map[String, JsValue] = Global.getParamsJsonRequestFor(GC.DELETED_LIST, otrosInfo).toList match {
      case Nil => Map(C.FACTURA_OTRO_DELETED -> Json.toJson(""))
      case deletedList :: t => Map(C.FACTURA_OTRO_DELETED -> Json.toJson(deletedList._2))
    }
    val facturaOtros = otroRows.toList match {
      case (k: String, item: JsValue) :: t => preprocessOtrosParam(item, C.FACTURA_COMPRA_OTRO_TMP)
      case _ => Map(C.FACTURA_COMPRA_OTRO_TMP -> JsArray(List()))
    }

    // percepciones
    //
    val percepcionesInfo = getJsValueAsMap(Global.getParamsJsonRequestFor(C.FACTURA_COMPRA_PERCEPCION_TMP, params))
    val percepcionRows = Global.getParamsJsonRequestFor(GC.ITEMS, percepcionesInfo)
    val percepcionDeleted: Map[String, JsValue] = Global.getParamsJsonRequestFor(GC.DELETED_LIST, percepcionesInfo).toList match {
      case Nil => Map(C.FACTURA_PERCEPCION_DELETED -> Json.toJson(""))
      case deletedList :: t => Map(C.FACTURA_PERCEPCION_DELETED -> Json.toJson(deletedList._2))
    }
    val facturaPercepciones = percepcionRows.toList match {
      case (k: String, item: JsValue) :: t => preprocessPercepcionesParam(item, C.FACTURA_COMPRA_PERCEPCION_TMP)
      case _ => Map(C.FACTURA_COMPRA_PERCEPCION_TMP -> JsArray(List()))
    }

    // legajos
    //
    val legajosInfo = getJsValueAsMap(Global.getParamsJsonRequestFor(C.FACTURA_COMPRA_LEGAJO_TMP, params))
    val legajoRows = Global.getParamsJsonRequestFor(GC.ITEMS, legajosInfo)
    val legajoDeleted: Map[String, JsValue] = Global.getParamsJsonRequestFor(GC.DELETED_LIST, legajosInfo).toList match {
      case Nil => Map(C.FACTURA_LEGAJO_DELETED -> Json.toJson(""))
      case deletedList :: t => Map(C.FACTURA_LEGAJO_DELETED -> Json.toJson(deletedList._2))
    }
    val facturaLegajos = legajoRows.toList match {
      case (k: String, item: JsValue) :: t => preprocessLegajosParam(item, C.FACTURA_COMPRA_LEGAJO_TMP)
      case _ => Map(C.FACTURA_COMPRA_LEGAJO_TMP -> JsArray(List()))
    }

    // remitos
    //
    val remitosInfo = getJsValueAsMap(Global.getParamsJsonRequestFor(C.REMITO_FACTURA_COMPRA_TMP, params))
    val remitoRows = Global.getParamsJsonRequestFor(GC.ITEMS, remitosInfo)
    val facturaRemitos = remitoRows.toList match {
      case (k: String, item: JsValue) :: t => preprocessRemitosParam(item, C.REMITO_FACTURA_COMPRA_TMP)
      case _ => Map(C.REMITO_FACTURA_COMPRA_TMP -> JsArray(List()))
    }
    
    JsObject(
      (facturaId ++ facturaIdGroup ++ facturaBaseGroup ++ facturaDatesGroup ++ facturaPreciosGroup
      ++ facturaCotizacionGroup ++ facturaStockGroup ++ facturaTotalGroup 
      ++ facturaItems ++ itemDeleted ++ facturaOtros ++ otroDeleted
      ++ facturaLegajos ++ legajoDeleted ++ facturaPercepciones ++ percepcionDeleted ++ facturaRemitos).toSeq)
  }
  //
  //
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //
  // this functions convert the plain JSON received in SAVE_APLIC into a FacturaCompraAplic structure
  //
  // because the limitation to 18 fields in case class used for FORM mapping we have grouped the fields
  // in FacturaCompra/Aplic, FacturaCompra/NotaCredito/OrdenPago, etc
  //
  // the below routines group a flat JSON and in some cases rename the name of the fields or move
  // fields to the parent node in the JSON structure to match the case class
  //

  private def preprocessAplicParams(implicit request:Request[AnyContent]): JsObject = {

    def getJsValueAsMap(list: Map[String, JsValue]): Map[String, JsValue] = list.toList match {
      case (key: String, jsValue: JsValue) :: t => jsValue.as[Map[String, JsValue]]
      case _ => Map.empty
    }

    def preprocessNotaCreditoParam(field: JsValue) = {
      val params = field.as[Map[String, JsValue]]
      JsObject(Global.preprocessFormParams(notaCredito, "", params).toSeq)
    }

    def preprocessOrdenCompraParam(field: JsValue) = {
      val params = field.as[Map[String, JsValue]]
      JsObject(Global.preprocessFormParams(ordenCompra, "", params).toSeq)
    }

    def preprocessRemitoCompraParam(field: JsValue) = {
      val params = field.as[Map[String, JsValue]]
      JsObject(Global.preprocessFormParams(remitoCompra, "", params).toSeq)
    }

    def preprocessNotasCreditoParam(items: JsValue, group: String): Map[String, JsValue] = items match {
      case JsArray(arr) => Map(group -> JsArray(arr.map(preprocessNotaCreditoParam(_))))
      case _ => Map.empty
    }

    def preprocessOrdenesCompraParam(items: JsValue, group: String): Map[String, JsValue] = items match {
      case JsArray(arr) => Map(group -> JsArray(arr.map(preprocessOrdenCompraParam(_))))
      case _ => Map.empty
    }

    def preprocessRemitosCompraParam(items: JsValue, group: String): Map[String, JsValue] = items match {
      case JsArray(arr) => Map(group -> JsArray(arr.map(preprocessRemitoCompraParam(_))))
      case _ => Map.empty
    }

    val params = Global.getParamsFromJsonRequest

    // groups for FacturaCompraData
    //
    val facturaId = Global.preprocessFormParams(List(C.FC_ID, GC.DOC_ID), "", params)

    // notas credito
    //
    val notasCreditoInfo = getJsValueAsMap(Global.getParamsJsonRequestFor(TC.FACTURA_COMPRA_NOTA_CREDITO_TMP, params))
    val notaCreditoRows = Global.getParamsJsonRequestFor(GC.ITEMS, notasCreditoInfo)
    val notasCredito = notaCreditoRows.toList match {
      case (k: String, item: JsValue) :: t => preprocessNotasCreditoParam(item, TC.FACTURA_COMPRA_NOTA_CREDITO_TMP)
      case _ => Map(TC.FACTURA_COMPRA_NOTA_CREDITO_TMP -> JsArray(List()))
    }

    // ordenes de compra
    //
    val ordenesCompraInfo = getJsValueAsMap(Global.getParamsJsonRequestFor(C.ORDEN_FACTURA_COMPRA_TMP, params))
    val ordenCompraRows = Global.getParamsJsonRequestFor(GC.ITEMS, ordenesCompraInfo)
    val ordenesCompra = ordenCompraRows.toList match {
      case (k: String, item: JsValue) :: t => preprocessOrdenesCompraParam(item, C.ORDEN_FACTURA_COMPRA_TMP)
      case _ => Map(C.ORDEN_FACTURA_COMPRA_TMP -> JsArray(List()))
    }

    // remitos
    //
    val remitosInfo = getJsValueAsMap(Global.getParamsJsonRequestFor(C.REMITO_FACTURA_COMPRA_TMP, params))
    val remitoRows = Global.getParamsJsonRequestFor(GC.ITEMS, remitosInfo)
    val remitosCompra = remitoRows.toList match {
      case (k: String, item: JsValue) :: t => preprocessRemitosCompraParam(item, C.REMITO_FACTURA_COMPRA_TMP)
      case _ => Map(C.REMITO_FACTURA_COMPRA_TMP -> JsArray(List()))
    }

    def preprocessOrdenPagoItemParam(field: JsValue) = {
      val params = field.as[Map[String, JsValue]]
      Logger.debug(s"preprocessOrdenPagoItemParam -> params: ${params}")

      def preprocessOrdenPagoParam(field: JsValue) = {
        val params = field.as[Map[String, JsValue]]
        JsObject(Global.preprocessFormParams(ordenPago, "", params).toSeq)
      }

      def preprocessCtaCteParam(field: JsValue) = {
        val params = field.as[Map[String, JsValue]]
        JsObject(Global.preprocessFormParams(ctaCte, "", params).toSeq)
      }

      def preprocessOrdenesPagoParam(items: JsValue, group: String): Map[String, JsValue] = items match {
        case JsArray(arr) => Map(group -> JsArray(arr.map(preprocessOrdenPagoParam(_))))
        case _ => Map.empty
      }

      def preprocessCtasCteParam(items: JsValue, group: String): Map[String, JsValue] = items match {
        case JsArray(arr) => Map(group -> JsArray(arr.map(preprocessCtaCteParam(_))))
        case _ => Map.empty
      }

      val ordenPagoId = Global.preprocessFormParams(List(TC.OPG_ID), "", params)

      // ordenes de pago item
      //
      val ordenesPagoInfo = getJsValueAsMap(Global.getParamsJsonRequestFor(TC.FACTURA_COMPRA_ORDEN_PAGO_TMP, params))
      Logger.debug(s"ordenesPagoInfo: ${ordenesPagoInfo}")
      val ordenPagoRows = Global.getParamsJsonRequestFor(GC.ITEMS, ordenesPagoInfo)
      Logger.debug(s"ordenPagoRows: ${ordenPagoRows}")
      val ordenesPago = ordenPagoRows.toList match {
        case (k: String, item: JsValue) :: t => preprocessOrdenesPagoParam(item, TC.FACTURA_COMPRA_ORDEN_PAGO_TMP)
        case _ => Map(TC.FACTURA_COMPRA_ORDEN_PAGO_TMP -> JsArray(List()))
      }

      // ordenes de pago cta cte
      //
      val ctasCteInfo = getJsValueAsMap(Global.getParamsJsonRequestFor(TC.ORDEN_PAGO_ITEM_CUENTA_CORRIENTE_TMP, params))
      Logger.debug(s"ctasCteInfo: ${ctasCteInfo}")
      val ctaCteRows = Global.getParamsJsonRequestFor(GC.ITEMS, ctasCteInfo)
      Logger.debug(s"ctaCteRows: ${ctaCteRows}")
      val ctasCtePago = ctaCteRows.toList match {
        case (k: String, item: JsValue) :: t => preprocessOrdenesPagoParam(item, TC.ORDEN_PAGO_ITEM_CUENTA_CORRIENTE_TMP)
        case _ => Map(TC.ORDEN_PAGO_ITEM_CUENTA_CORRIENTE_TMP -> JsArray(List()))
      }

      Logger.debug(s"ordenesPago: ${ordenesPago}")
      Logger.debug(s"ctasCtePago: ${ctasCtePago}")
      JsObject((ordenPagoId ++ ordenesPago ++ ctasCtePago).toSeq)
    }

    def preprocessOrdenesPagoItemParam(items: JsValue, group: String): Map[String, JsValue] = items match {
      case JsArray(arr) => Map(group -> JsArray(arr.map(preprocessOrdenPagoItemParam(_))))
      case _ => Map.empty
    }

    // ordenes de pago item
    //
    val ordenesPagoItemInfo = getJsValueAsMap(Global.getParamsJsonRequestFor(TC.ORDEN_PAGO_TMP, params))
    val ordenPagoItemRows = Global.getParamsJsonRequestFor(GC.ITEMS, ordenesPagoItemInfo)
    val ordenesPagoItem = ordenPagoItemRows.toList match {
      case (k: String, item: JsValue) :: t => preprocessOrdenesPagoItemParam(item, TC.ORDEN_PAGO_TMP)
      case _ => Map(TC.ORDEN_PAGO_TMP -> JsArray(List()))
    }

    JsObject((facturaId ++ notasCredito ++ ordenesPagoItem ++ ordenesCompra ++ remitosCompra).toSeq)
  }
  //
  //
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  def getItems(items: List[FacturaCompraItemData]): List[FacturaCompraItem] = {
    items.map(item => {
      FacturaCompraItem(
        item.id,
        FacturaCompraItemBase(
          item.base.descrip,
          item.base.descuento,
          item.base.prId,
          item.base.ccosId,
          item.base.toId,
          item.base.cueId,
          item.base.cueIdIvaRi,
          item.base.cueIdIvaRni,
          item.base.stlId,
          item.base.stlCode,
          item.base.orden
        ),
        FacturaCompraItemTotals(
          item.totals.cantidad,
          item.totals.precio,
          item.totals.precioLista,
          item.totals.precioUser,
          item.totals.neto,
          item.totals.ivaRi,
          item.totals.ivaRni.getOrElse(0.0),
          item.totals.internos,
          item.totals.ivaRiPorc,
          item.totals.ivaRniPorc,
          item.totals.internosPorc,
          item.totals.importe,
          item.totals.importeOrigen
        ),
        item.series.map(serie => {
          FacturaCompraItemSerie(
            serie.id,
            serie.code,
            serie.descrip,
            DateFormatter.parse(serie.fechaVto),
            DBHelper.NoId
          )
        }),
        item.serieDeleted
      )
    })
  }

  def getOtros(otros: List[FacturaCompraOtroData]): List[FacturaCompraOtro] = {
    otros.map(otro => {
      FacturaCompraOtro(
        otro.id,
        otro.cueId,
        otro.debe,
        otro.haber,
        otro.ccosId,
        otro.descrip,
        otro.origen,
        otro.orden
      )
    })
  }

  def getLegajos(legajos: List[FacturaCompraLegajoData]): List[FacturaCompraLegajo] = {
    legajos.map(legajo => {
      FacturaCompraLegajo(
        legajo.id,
        legajo.lgjId,
        legajo.importe,
        legajo.descrip,
        legajo.importeOrigen,
        legajo.orden
      )
    })
  }

  def getPercepciones(percepciones: List[FacturaCompraPercepcionData]): List[FacturaCompraPercepcion] = {
    percepciones.map(percepcion => {
      FacturaCompraPercepcion(
        percepcion.id,
        percepcion.percId,
        percepcion.base,
        percepcion.porcentaje,
        percepcion.importe,
        percepcion.ccosId,
        percepcion.descrip,
        percepcion.origen,
        percepcion.orden
      )
    })
  }

  def getRemitos(remitos: List[FacturaCompraRemitoData]): List[FacturaCompraRemito] = {
    remitos.map(remito => {
      FacturaCompraRemito(
        remito.rciId,
        remito.cantidad,
        remito.fciId
      )
    })
  }

  def getFacturaCompraItems(facturaCompra: FacturaCompraData): FacturaCompraItems = {
    FacturaCompraItems(
      getItems(facturaCompra.items),

      List(), /* only used when loading an invoice to respond a get FacturaCompra */

      getOtros(facturaCompra.otros),
      getLegajos(facturaCompra.legajos),
      getPercepciones(facturaCompra.percepciones),

      facturaCompra.itemDeleted,
      facturaCompra.otroDeleted,
      facturaCompra.legajoDeleted,
      facturaCompra.percepcionDeleted,

      getRemitos(facturaCompra.remitos)
    )
  }

  def getFacturaCompra(facturaCompra: FacturaCompraData, id: Int): FacturaCompra = {
    FacturaCompra(
      id,
      FacturaCompraId(
        facturaCompra.ids.docId,
        facturaCompra.ids.numero,
        facturaCompra.ids.nroDoc),
      FacturaCompraBase(
        facturaCompra.base.provId,
        facturaCompra.base.estId,
        facturaCompra.base.ccosId,
        facturaCompra.base.sucId,
        facturaCompra.base.cpgId,
        facturaCompra.base.lgjId,
        facturaCompra.base.cai,
        facturaCompra.base.tipoComprobante,
        facturaCompra.base.descrip,
        facturaCompra.base.grabarAsiento),
      FacturaCompra.emptyFacturaCompraReferences,
      FacturaCompraDates(
        DateFormatter.parse(facturaCompra.dates.fecha),
        DateFormatter.parse(facturaCompra.dates.fechaEntrega),
        DateFormatter.parse(facturaCompra.dates.fechaIva),
        DateFormatter.parse(facturaCompra.dates.fechaVto)),
      FacturaCompraPrecios(
        facturaCompra.precios.desc1,
        facturaCompra.precios.desc2,
        facturaCompra.precios.lpId,
        facturaCompra.precios.ldId),
      FacturaCompraCotizacion(
        facturaCompra.cotizacion.cotizacion,
        facturaCompra.cotizacion.cotizacionProveedor),
      FacturaCompraStock(
        facturaCompra.stock.proIdOrigen,
        facturaCompra.stock.proIdDestino,
        facturaCompra.stock.deplId),
      FacturaCompraTotals(
        facturaCompra.totals.neto,
        facturaCompra.totals.ivaRi,
        facturaCompra.totals.ivaRni,
        facturaCompra.totals.internos,
        facturaCompra.totals.subTotal,
        facturaCompra.totals.importeDesc1,
        facturaCompra.totals.importeDesc2,
        facturaCompra.totals.totalOtros,
        facturaCompra.totals.totalPercepciones,
        facturaCompra.totals.total,
        facturaCompra.totals.totalOrigen),
      getFacturaCompraItems(facturaCompra)
    )
  }

  def update(id: Int) = PostAction { implicit request =>
    Logger.debug("in FacturaCompras.update")

    facturaCompraForm.bind(preprocessParams).fold(
      formWithErrors => {
        Logger.debug(s"invalid form: ${formWithErrors.toString}")
        BadRequest
      },
      facturaCompra => {
        Logger.debug(s"form: ${facturaCompra.toString}")
        LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.EDIT_FACTURA_COMPRA), { user =>
          try {
            Ok(
              Json.toJson(
                FacturaCompra.update(user,
                  getFacturaCompra(facturaCompra, id)
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

  def createFromRemito = PostAction { implicit request =>
    Logger.debug("in FacturaCompras.createFromRemito")
    facturaCompraForm.bind(preprocessParams).fold(
      formWithErrors => {
        Logger.debug(s"invalid form: ${formWithErrors.toString}")
        BadRequest
      },
      facturaCompra => {
        Logger.debug(s"form: ${facturaCompra.toString}")
        LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.NEW_FACTURA_COMPRA), { user =>
          try {
            Ok(
              Json.toJson(
                FacturaCompra.createFromRemito(user,
                  getFacturaCompra(facturaCompra, DBHelper.NoId)
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
    Logger.debug("in FacturaCompras.create")
    facturaCompraForm.bind(preprocessParams).fold(
      formWithErrors => {
        Logger.debug(s"invalid form: ${formWithErrors.toString}")
        BadRequest
      },
      facturaCompra => {
        Logger.debug(s"form: ${facturaCompra.toString}")
        LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.NEW_FACTURA_COMPRA), { user =>
          try {
            Ok(
              Json.toJson(
                FacturaCompra.create(user,
                  getFacturaCompra(facturaCompra, DBHelper.NoId)
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
    Logger.debug("in FacturaCompras.delete")
    LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.DELETE_FACTURA_COMPRA), { user =>
      try {
        FacturaCompra.delete(user, id)
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
            cpgId: Option[String],
            empId: Option[String]
    ) = GetAction { implicit request =>
    LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.LIST_FACTURA_COMPRA), { user =>
      Ok(
        Json.toJson(
          Recordset.getAsJson(
            FacturaCompra.list(
              user,
              DateFormatter.parse(from.getOrElse("")), DateFormatter.parse(to.getOrElse("")),
              provId, estId, ccosId, sucId, docId, cpgId, empId))))
    })
  }

  def parameters = GetAction { implicit request =>
    LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.LIST_FACTURA_COMPRA), { user =>
      Ok(Json.toJson(FacturaCompra.loadParams(user)))
    })
  }

  def saveParameters = PostAction { implicit request =>
    Logger.debug("in FacturaCompras.saveParameters")
    facturaCompraParamsForm.bindFromRequest.fold(
      formWithErrors => {
        Logger.debug(s"invalid form: ${formWithErrors.toString}")
        BadRequest
      },
      facturaCompraParams => {
        Logger.debug(s"form: ${facturaCompraParams.toString}")
        LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.LIST_FACTURA_COMPRA), { user =>
          Ok(
            Json.toJson(
              FacturaCompra.saveParams(user,
                FacturaCompraParams(
                    facturaCompraParams.from,
                    facturaCompraParams.to,
                    facturaCompraParams.provId,
                    facturaCompraParams.estId,
                    facturaCompraParams.ccosId,
                    facturaCompraParams.sucId,
                    facturaCompraParams.docId,
                    facturaCompraParams.cpgId,
                    facturaCompraParams.empId
                )
              )
            )
          )
        })
      }
    )
  }

  def notes(id: Int) = GetAction { implicit request =>
    LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.LIST_FACTURA_COMPRA), { user =>
      Ok(Json.toJson(""))
    })
  }

  def listRemitos(provId: Int, currencyId: Int) = GetAction { implicit request =>
    LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.NEW_FACTURA_COMPRA), { user =>
      Ok(Recordset.getAsJson(FacturaCompra.listRemitos(user, provId, currencyId)))
    })
  }

  def listRemitosItems(ids: Option[String]) = GetAction { implicit request =>
    LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.NEW_FACTURA_COMPRA), { user =>
      Ok(Recordset.getAsJson(FacturaCompra.listRemitosItems(user, ids.getOrElse(""))))
    })
  }

  def getAplic(id: Int) = GetAction { implicit request =>
    LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.MODIFY_APLIC_COMPRA), { user =>
      val (cueId, monId, fcPagoAutomatico) = FacturaCompra.getCtaCteCuenta(user, id)
      Ok(Json.obj(
        "ctacte_cue_id" -> Json.toJson(cueId),
        "mon_id_x_cuenta" -> Json.toJson(monId),
        "fc_pago_automatico" -> Json.toJson(fcPagoAutomatico),
        "vencimientos" -> Recordset.getAsJson(FacturaCompra.getAplic(user, id, 1)),
        "pagosAplicados" -> Recordset.getAsJson(FacturaCompra.getAplic(user, id, 2)),
        "pagosParaAplicar" -> Recordset.getAsJson(FacturaCompra.getAplic(user, id, 3)),
        "items" -> Recordset.getAsJson(FacturaCompra.getAplic(user, id, 4)),
        "itemsAplicados" -> Recordset.getAsJson(FacturaCompra.getAplic(user, id, 5)),
        "itemsParaAplicar" -> Recordset.getAsJson(FacturaCompra.getAplic(user, id, 6))
      ))
    })
  }

  def saveAplic(id: Int) = GetAction { implicit request =>
    facturaCompraAplicForm.bind(preprocessAplicParams).fold(
      formWithErrors => {
        Logger.debug(s"invalid form: ${formWithErrors.toString}")
        BadRequest
      },
      facturaCompraAplic => {
        Logger.debug(s"form: ${facturaCompraAplic.toString}")
        LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.MODIFY_APLIC_COMPRA), { user =>
          try {
            Ok(
              Json.toJson(
                FacturaCompra.saveAplic(user, facturaCompraAplic)
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

}