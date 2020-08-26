package controllers.logged.modules.ventas

import controllers._
import play.api.mvc._
import play.api.data._
import play.api.data.Forms._
import actions._
import play.api.Logger
import play.api.libs.json._
import models.cairo.modules.ventas._
import models.cairo.system.security.CairoSecurity
import models.cairo.system.database.{Recordset, DBHelper}
import formatters.json.DateFormatter
import formatters.json.DateFormatter._
import scala.util.control.NonFatal

import Global.{getJsValueAsMap, getParamsJsonRequestFor, preprocessFormParams, doubleFormat, getParamsFromJsonRequest}

case class FacturaVentaIdData(
                                docId: Int,
                                numero: Int,
                                nroDoc: String
                                )

case class FacturaVentaBaseData(
                                  cliId: Int,
                                  estId: Int,
                                  ccosId: Int,
                                  sucId: Int,
                                  cpgId: Int,
                                  lgjId: Int,
                                  venId: Int,
                                  clisId: Int,
                                  ordenCompra: String,
                                  cai: String,
                                  descrip: String,
                                  grabarAsiento: Boolean
                                  )

case class FacturaVentaCotizacionData(
                                        cotizacion: Double
                                        )

case class FacturaVentaPreciosData(
                                     desc1: Double,
                                     desc2: Double,
                                     lpId: Int,
                                     ldId: Int
                                     )

case class FacturaVentaDatesData(
                                   fecha: String,
                                   fechaEntrega: String,
                                   fechaIva: String,
                                   fechaVto: String
                                   )

case class FacturaVentaStockData(
                                   proIdOrigen: Int,
                                   proIdDestino: Int,
                                   deplId: Int,
                                   transId: Int
                                   )

case class FacturaVentaTotalsData(
                                    neto: Double,
                                    ivaRi: Double,
                                    ivaRni: Double,
                                    internos: Double,
                                    subTotal: Double,
                                    importeDesc1: Double,
                                    importeDesc2: Double,
                                    totalPercepciones: Double,
                                    total: Double,
                                    totalOrigen: Double
                                    )

case class FacturaVentaItemDataBase(
                                      descrip: String,
                                      prId: Int,
                                      ccosId: Int,
                                      toId: Int,
                                      cueId: Int,
                                      cueIdIvaRi: Int,
                                      cueIdIvaRni: Int,
                                      stlId: Int,
                                      orden: Int
                                      )

case class FacturaVentaItemDataTotals(
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

case class FacturaVentaItemDataSerie(
                                       id: Int,
                                       code: String,
                                       descrip: String,
                                       fechaVto: String
                                       )

case class FacturaVentaItemData(
                                  id: Int,
                                  base: FacturaVentaItemDataBase,
                                  totals: FacturaVentaItemDataTotals,
                                  series: List[FacturaVentaItemDataSerie]
                                  )

case class FacturaVentaPercepcionData(
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
case class FacturaVentaData(
                              id: Option[Int],
                              ids: FacturaVentaIdData,
                              base: FacturaVentaBaseData,
                              dates: FacturaVentaDatesData,
                              precios: FacturaVentaPreciosData,
                              cotizacion: FacturaVentaCotizacionData,
                              stock: FacturaVentaStockData,
                              totals: FacturaVentaTotalsData,
                              items: List[FacturaVentaItemData],
                              percepciones: List[FacturaVentaPercepcionData],

                              itemDeleted: String,
                              percepcionDeleted: String,

                              /* applications */
                              remitos: List[FacturaVentaRemitoData]
                              )

case class FacturaVentaRemitoData(
                                   rviId: Int,
                                   cantidad: Double,
                                   fviId: Int
                                    )

case class FacturaVentaParamsData(
                                    from: String,
                                    to: String,
                                    cliId: String,
                                    estId: String,
                                    ccosId: String,
                                    sucId: String,
                                    venId: String,
                                    docId: String,
                                    cpgId: String,
                                    empId: String
                                    )

object FacturaVentas extends Controller with ProvidesUser {

  val GC = models.cairo.modules.general.C
  val TC = models.cairo.modules.tesoreria.C

  val facturaVentaParamsForm: Form[FacturaVentaParamsData] = Form(
    mapping(
      GC.FROM -> text,
      GC.TO -> text,
      GC.CLI_ID -> text,
      GC.EST_ID -> text,
      GC.CCOS_ID -> text,
      GC.SUC_ID -> text,
      GC.VEN_ID -> text,
      GC.DOC_ID -> text,
      GC.CPG_ID -> text,
      GC.EMP_ID -> text
    )(FacturaVentaParamsData.apply)(FacturaVentaParamsData.unapply)
  )

  val facturaIdFields = List(GC.DOC_ID, C.FV_NUMERO, C.FV_NRODOC)

  val facturaBaseFields = List(GC.CLI_ID, GC.EST_ID, GC.CCOS_ID, GC.SUC_ID, GC.CPG_ID, GC.LGJ_ID,
    GC.VEN_ID, GC.CLIS_ID, C.FV_ORDEN_COMPRA, C.FV_CAI, C.FV_DESCRIP, C.FV_GRABAR_ASIENTO)

  val facturaDatesFields = List(C.FV_FECHA, C.FV_FECHA_ENTREGA, C.FV_FECHA_IVA, C.FV_FECHA_VTO)

  val facturaPreciosFields = List(C.FV_DESCUENTO1, C.FV_DESCUENTO2, GC.LP_ID, GC.LD_ID)

  val facturaCotizacionFields = List(C.FV_COTIZACION)

  val facturaStockFields = List(C.PRO_ID_ORIGEN, C.PRO_ID_DESTINO, GC.DEPL_ID, GC.TRANS_ID)

  val facturaTotalsFields = List(C.FV_NETO, C.FV_IVA_RI, C.FV_IVA_RNI, C.FV_INTERNOS, C.FV_SUBTOTAL,
    C.FV_IMPORTE_DESC_1, C.FV_IMPORTE_DESC_2,
    C.FV_TOTAL_PERCEPCIONES, C.FV_TOTAL, C.FV_TOTAL_ORIGEN)

  val facturaItemBase = List(C.FVI_DESCRIP, GC.PR_ID, GC.CCOS_ID, GC.TO_ID,
    GC.CUE_ID, C.CUE_ID_IVA_RI, C.CUE_ID_IVA_RNI, GC.STL_ID, C.FVI_ORDEN)

  val facturaItemTotals = List(C.FVI_CANTIDAD, C.FVI_PRECIO, C.FVI_PRECIO_LISTA, C.FVI_PRECIO_USR, C.FVI_NETO,
    C.FVI_IVA_RI, C.FVI_IVA_RNI, C.FVI_INTERNOS, C.FVI_IVA_RI_PORC, C.FVI_IVA_RNI_PORC,
    C.FVI_INTERNOS_PORC, C.FVI_IMPORTE, C.FVI_IMPORTE_ORIGEN)

  val facturaPercepcion = List(C.FVPERC_ID, GC.PERC_ID, C.FVPERC_BASE, C.FVPERC_PORCENTAJE, C.FVPERC_IMPORTE,
    GC.CCOS_ID, C.FVPERC_DESCRIP, C.FVPERC_ORIGEN, C.FVPERC_ORDEN)

  val facturaRemito = List(C.RVI_ID, C.RV_FV_CANTIDAD, C.FVI_ID)

  val notaCredito = List(TC.FV_ID_NOTA_CREDITO, TC.FV_ID_FACTURA, TC.FVD_ID_NOTA_CREDITO, TC.FVD_ID_FACTURA,
    TC.FVP_ID_NOTA_CREDITO, TC.FVP_ID_FACTURA, TC.FV_NC_IMPORTE, TC.FV_NC_ID)
  val cobranza = List(TC.COBZ_ID, C.FV_ID, TC.FVD_ID, TC.FVP_ID, TC.FV_COBZ_ID, TC.FV_COBZ_COTIZACION, TC.FV_COBZ_IMPORTE, TC.FV_COBZ_IMPORTE_ORIGEN)
  val ctaCte = List(GC.CUE_ID, TC.COBZI_IMPORTE_ORIGEN, TC.COBZI_IMPORTE, TC.COBZI_ORDEN, TC.COBZI_TIPO, TC.COBZI_OTRO_TIPO)
  val pedidoVenta = List(C.PVI_ID, C.FVI_ID, C.PV_FV_CANTIDAD, C.PV_FV_ID)
  val remitoVenta = List(C.RVI_ID, C.FVI_ID, C.RV_FV_CANTIDAD, C.RV_FV_ID)

  val facturaVentaAplicForm: Form[FacturaVentaAplic] = Form(
    mapping(
      C.FV_ID -> number,
      GC.DOC_ID -> number,
      TC.FACTURA_VENTA_NOTA_CREDITO_TMP -> Forms.list[FacturaVentaNotaCreditoItem](
        mapping(
          TC.FV_ID_NOTA_CREDITO -> number,
          TC.FV_ID_FACTURA -> number,
          TC.FVD_ID_NOTA_CREDITO -> number,
          TC.FVD_ID_FACTURA -> number,
          TC.FVP_ID_NOTA_CREDITO -> number,
          TC.FVP_ID_FACTURA -> number,
          TC.FV_NC_IMPORTE -> of(doubleFormat),
          TC.FV_NC_ID-> number
        )(FacturaVentaNotaCreditoItem.apply)(FacturaVentaNotaCreditoItem.unapply)
      ),
      TC.COBRANZA_TMP -> Forms.list[FacturaVentaCobranzaItem](
        mapping(
          TC.COBZ_ID -> number,
          TC.FACTURA_VENTA_COBRANZA_TMP -> Forms.list[CobranzaItem](
            mapping(
              TC.COBZ_ID -> number,
              C.FV_ID -> number,
              TC.FVD_ID -> number,
              TC.FVP_ID -> number,
              TC.FV_COBZ_ID -> number,
              TC.FV_COBZ_COTIZACION -> of(doubleFormat),
              TC.FV_COBZ_IMPORTE -> of(doubleFormat),
              TC.FV_COBZ_IMPORTE_ORIGEN -> of(doubleFormat)
            )(CobranzaItem.apply)(CobranzaItem.unapply)
          ),
          TC.COBRANZA_ITEM_CUENTA_CORRIENTE_TMP -> Forms.list[CobranzaCtaCte](
            mapping(
              GC.CUE_ID -> number,
              TC.COBZI_IMPORTE_ORIGEN -> of(doubleFormat),
              TC.COBZI_IMPORTE -> of(doubleFormat),
              TC.COBZI_ORDEN -> number,
              TC.COBZI_TIPO -> number,
              TC.COBZI_OTRO_TIPO -> number
            )(CobranzaCtaCte.apply)(CobranzaCtaCte.unapply)
          )
        )(FacturaVentaCobranzaItem.apply)(FacturaVentaCobranzaItem.unapply)
      ),
      C.PEDIDO_FACTURA_VENTA_TMP -> Forms.list[FacturaVentaPedidoVentaItem](
        mapping(
          C.PVI_ID -> number,
          C.FVI_ID -> number,
          C.PV_FV_CANTIDAD -> of(doubleFormat),
          C.PV_FV_ID -> number
        )(FacturaVentaPedidoVentaItem.apply)(FacturaVentaPedidoVentaItem.unapply)
      ),
      C.REMITO_FACTURA_VENTA_TMP -> Forms.list[FacturaVentaRemitoVentaItem](
        mapping(
          C.RVI_ID -> number,
          C.FVI_ID -> number,
          C.RV_FV_CANTIDAD -> of(doubleFormat),
          C.RV_FV_ID -> number
        )(FacturaVentaRemitoVentaItem.apply)(FacturaVentaRemitoVentaItem.unapply)
      )
    )(FacturaVentaAplic.apply)(FacturaVentaAplic.unapply)
  )

  val facturaVentaForm: Form[FacturaVentaData] = Form(
    mapping(
      "id" -> optional(number),
      C.FACTURA_ID -> mapping(
        GC.DOC_ID -> number,
        C.FV_NUMERO -> number,
        C.FV_NRODOC -> text)
        (FacturaVentaIdData.apply)(FacturaVentaIdData.unapply),
      C.FACTURA_BASE -> mapping(
        GC.CLI_ID -> number,
        GC.EST_ID -> number,
        GC.CCOS_ID -> number,
        GC.SUC_ID -> number,
        GC.CPG_ID -> number,
        GC.LGJ_ID -> number,
        GC.VEN_ID -> number,
        GC.CLIS_ID -> number,
        C.FV_ORDEN_COMPRA -> text,
        C.FV_CAI -> text,
        C.FV_DESCRIP -> text,
        C.FV_GRABAR_ASIENTO -> boolean)
        (FacturaVentaBaseData.apply)(FacturaVentaBaseData.unapply),
      C.FACTURA_DATES -> mapping (
        C.FV_FECHA -> text,
        C.FV_FECHA_ENTREGA -> text,
        C.FV_FECHA_IVA -> text,
        C.FV_FECHA_VTO -> text)
        (FacturaVentaDatesData.apply)(FacturaVentaDatesData.unapply),
      C.FACTURA_PRECIOS -> mapping (
        C.FV_DESCUENTO1 -> of(doubleFormat),
        C.FV_DESCUENTO2 -> of(doubleFormat),
        GC.LP_ID -> number,
        GC.LD_ID -> number)
        (FacturaVentaPreciosData.apply)(FacturaVentaPreciosData.unapply),
      C.FACTURA_COTIZACION -> mapping (
        C.FV_COTIZACION -> of(doubleFormat))
        (FacturaVentaCotizacionData.apply)(FacturaVentaCotizacionData.unapply),
      C.FACTURA_STOCK -> mapping (
        C.PRO_ID_ORIGEN -> number,
        C.PRO_ID_DESTINO -> number,
        GC.DEPL_ID -> number,
        GC.TRANS_ID -> number)
        (FacturaVentaStockData.apply)(FacturaVentaStockData.unapply),
      C.FACTURA_TOTALS -> mapping (
        C.FV_NETO -> of(doubleFormat),
        C.FV_IVA_RI -> of(doubleFormat),
        C.FV_IVA_RNI -> of(doubleFormat),
        C.FV_INTERNOS -> of(doubleFormat),
        C.FV_SUBTOTAL -> of(doubleFormat),
        C.FV_IMPORTE_DESC_1 -> of(doubleFormat),
        C.FV_IMPORTE_DESC_2 -> of(doubleFormat),
        C.FV_TOTAL_PERCEPCIONES -> of(doubleFormat),
        C.FV_TOTAL -> of(doubleFormat),
        C.FV_TOTAL_ORIGEN -> of(doubleFormat)
      )(FacturaVentaTotalsData.apply)(FacturaVentaTotalsData.unapply),
      C.FACTURA_VENTA_ITEM_TMP -> Forms.list[FacturaVentaItemData](
        mapping(
          C.FVI_ID -> number,
          C.FACTURA_ITEM_BASE -> mapping (
            C.FVI_DESCRIP -> text,
            GC.PR_ID -> number,
            GC.CCOS_ID -> number,
            GC.TO_ID -> number,
            GC.CUE_ID -> number,
            C.CUE_ID_IVA_RI -> number,
            C.CUE_ID_IVA_RNI -> number,
            GC.STL_ID -> number,
            C.FVI_ORDEN -> number)
            (FacturaVentaItemDataBase.apply)(FacturaVentaItemDataBase.unapply),
          C.FACTURA_ITEM_TOTALS -> mapping (
            C.FVI_CANTIDAD -> of(doubleFormat),
            C.FVI_PRECIO -> of(doubleFormat),
            C.FVI_PRECIO_LISTA -> of(doubleFormat),
            C.FVI_PRECIO_USR -> of(doubleFormat),
            C.FVI_NETO -> of(doubleFormat),
            C.FVI_IVA_RI -> of(doubleFormat),
            C.FVI_IVA_RNI -> optional(of(doubleFormat)),
            C.FVI_INTERNOS -> of(doubleFormat),
            C.FVI_IVA_RI_PORC -> of(doubleFormat),
            C.FVI_IVA_RNI_PORC -> of(doubleFormat),
            C.FVI_INTERNOS_PORC -> of(doubleFormat),
            C.FVI_IMPORTE -> of(doubleFormat),
            C.FVI_IMPORTE_ORIGEN -> of(doubleFormat))
            (FacturaVentaItemDataTotals.apply)(FacturaVentaItemDataTotals.unapply),
          C.FACTURA_VENTA_ITEM_SERIE_TMP -> Forms.list[FacturaVentaItemDataSerie](
            mapping (
              GC.PRNS_ID -> number,
              GC.PRNS_CODE -> text,
              GC.PRNS_DESCRIP -> text,
              GC.PRNS_FECHA_VTO -> text)
              (FacturaVentaItemDataSerie.apply)(FacturaVentaItemDataSerie.unapply)
          ))
          (FacturaVentaItemData.apply)(FacturaVentaItemData.unapply)
      ),
      C.FACTURA_VENTA_PERCEPCION_TMP -> Forms.list[FacturaVentaPercepcionData](
        mapping (
          C.FVPERC_ID -> number,
          GC.PERC_ID -> number,
          C.FVPERC_BASE -> of(doubleFormat),
          C.FVPERC_PORCENTAJE -> of(doubleFormat),
          C.FVPERC_IMPORTE -> of(doubleFormat),
          GC.CCOS_ID -> number,
          C.FVPERC_DESCRIP -> text,
          C.FVPERC_ORIGEN -> of(doubleFormat),
          C.FVPERC_ORDEN -> number)
          (FacturaVentaPercepcionData.apply)(FacturaVentaPercepcionData.unapply)
      ),
      C.FACTURA_ITEM_DELETED -> text,
      C.FACTURA_PERCEPCION_DELETED -> text,
      C.REMITO_FACTURA_VENTA_TMP -> Forms.list[FacturaVentaRemitoData](
        mapping (
          C.RVI_ID -> number,
          C.RV_FV_CANTIDAD -> of(doubleFormat),
          C.FVI_ID -> number)
          (FacturaVentaRemitoData.apply)(FacturaVentaRemitoData.unapply)
      )
    )(FacturaVentaData.apply)(FacturaVentaData.unapply)
  )

  implicit val facturaVentaParamsWrites = new Writes[FacturaVentaParams] {
    def writes(facturaVentaParams: FacturaVentaParams) = Json.obj(
      GC.FROM -> Json.toJson(facturaVentaParams.from),
      GC.TO -> Json.toJson(facturaVentaParams.to),
      GC.CLI_ID -> Json.toJson(facturaVentaParams.cliId),
      GC.CLI_NAME -> Json.toJson(facturaVentaParams.cliName),
      GC.EST_ID -> Json.toJson(facturaVentaParams.estId),
      GC.EST_NAME -> Json.toJson(facturaVentaParams.estName),
      GC.CCOS_ID -> Json.toJson(facturaVentaParams.ccosId),
      GC.CCOS_NAME -> Json.toJson(facturaVentaParams.ccosName),
      GC.SUC_ID -> Json.toJson(facturaVentaParams.sucId),
      GC.SUC_NAME -> Json.toJson(facturaVentaParams.sucName),
      GC.VEN_ID -> Json.toJson(facturaVentaParams.venId),
      GC.VEN_NAME -> Json.toJson(facturaVentaParams.venName),
      GC.DOC_ID -> Json.toJson(facturaVentaParams.docId),
      GC.DOC_NAME -> Json.toJson(facturaVentaParams.docName),
      GC.CPG_ID -> Json.toJson(facturaVentaParams.cpgId),
      GC.CPG_NAME -> Json.toJson(facturaVentaParams.cpgName),
      GC.EMP_ID -> Json.toJson(facturaVentaParams.empId),
      GC.EMP_NAME -> Json.toJson(facturaVentaParams.empName)
    )
  }

  implicit val facturaVentaWrites = new Writes[FacturaVenta] {
    def writes(facturaVenta: FacturaVenta) = Json.obj(
      "id" -> Json.toJson(facturaVenta.id),
      C.FV_ID -> Json.toJson(facturaVenta.id),

      GC.DOC_ID -> Json.toJson(facturaVenta.ids.docId),
      GC.DOC_NAME -> Json.toJson(facturaVenta.ids.docName),
      C.FV_NRODOC -> Json.toJson(facturaVenta.ids.nroDoc),
      C.FV_NUMERO -> Json.toJson(facturaVenta.ids.numero),

      C.FV_FECHA -> Json.toJson(facturaVenta.dates.fecha),
      C.FV_FECHA_ENTREGA -> Json.toJson(facturaVenta.dates.fechaEntrega),
      C.FV_FECHA_IVA -> Json.toJson(facturaVenta.dates.fechaIva),
      C.FV_FECHA_VTO -> Json.toJson(facturaVenta.dates.fechaVto),

      GC.CLI_ID -> Json.toJson(facturaVenta.base.cliId),
      GC.CLI_NAME -> Json.toJson(facturaVenta.base.cliName),
      GC.EST_ID -> Json.toJson(facturaVenta.base.estId),
      GC.EST_NAME -> Json.toJson(facturaVenta.base.estName),
      GC.SUC_ID -> Json.toJson(facturaVenta.base.sucId),
      GC.SUC_NAME -> Json.toJson(facturaVenta.base.sucName),
      GC.CPG_ID -> Json.toJson(facturaVenta.base.cpgId),
      GC.CPG_NAME -> Json.toJson(facturaVenta.base.cpgName),
      GC.CCOS_ID -> Json.toJson(facturaVenta.base.ccosId),
      GC.CCOS_NAME -> Json.toJson(facturaVenta.base.ccosName),
      GC.LGJ_ID -> Json.toJson(facturaVenta.base.lgjId),
      GC.LGJ_CODE -> Json.toJson(facturaVenta.base.lgjCode),
      GC.VEN_ID -> Json.toJson(facturaVenta.base.venId),
      GC.VEN_NAME -> Json.toJson(facturaVenta.base.venName),
      GC.CLIS_ID -> Json.toJson(facturaVenta.base.clisId),
      GC.CLIS_NAME -> Json.toJson(facturaVenta.base.clisName),
      C.FV_ORDEN_COMPRA -> Json.toJson(facturaVenta.base.ordenCompra),
      C.FV_CAI -> Json.toJson(facturaVenta.base.cai),
      C.FV_DESCRIP -> Json.toJson(facturaVenta.base.descrip),
      C.FV_GRABAR_ASIENTO -> Json.toJson(facturaVenta.base.grabarAsiento),

      GC.DOCT_ID -> Json.toJson(facturaVenta.references.doctId),
      GC.DOCT_NAME -> Json.toJson(facturaVenta.references.doctName),
      GC.MON_ID -> Json.toJson(facturaVenta.references.monId),
      GC.MON_NAME -> Json.toJson(facturaVenta.references.monName),
      GC.TA_MASCARA -> Json.toJson(facturaVenta.references.taMascara),
      GC.TA_PROPUESTO -> Json.toJson(facturaVenta.references.taPropuesto),
      C.FV_FIRMADO -> Json.toJson(facturaVenta.references.firmado),
      GC.DOC_MUEVE_STOCK -> Json.toJson(facturaVenta.references.docMueveStock),
      GC.DOC_TIPO_FACTURA -> Json.toJson(facturaVenta.references.docTipoFactura),
      C.ST_ID -> Json.toJson(facturaVenta.references.stId),
      C.AS_ID -> Json.toJson(facturaVenta.references.asId),
      GC.HAS_IVA_RI -> Json.toJson(facturaVenta.references.hasIvaRi),
      GC.HAS_IVA_RNI -> Json.toJson(facturaVenta.references.hasIvaRni),
      GC.EDITABLE -> Json.toJson(facturaVenta.references.editable),
      GC.EDIT_MSG -> Json.toJson(facturaVenta.references.editMsg),

      C.FV_COTIZACION -> Json.toJson(facturaVenta.cotizacion.cotizacion),

      C.FV_DESCUENTO1 -> Json.toJson(facturaVenta.precios.desc1),
      C.FV_DESCUENTO2 -> Json.toJson(facturaVenta.precios.desc2),
      GC.LP_ID -> Json.toJson(facturaVenta.precios.lpId),
      GC.LP_NAME -> Json.toJson(facturaVenta.precios.lpName),
      GC.LD_ID -> Json.toJson(facturaVenta.precios.ldId),
      GC.LD_NAME -> Json.toJson(facturaVenta.precios.ldName),

      GC.DEPL_ID -> Json.toJson(facturaVenta.stock.deplId),
      GC.DEPL_NAME -> Json.toJson(facturaVenta.stock.deplName),
      GC.TRANS_ID -> Json.toJson(facturaVenta.stock.transId),
      GC.TRANS_NAME -> Json.toJson(facturaVenta.stock.transName),
      C.PRO_ID_ORIGEN -> Json.toJson(facturaVenta.stock.proIdOrigen),
      C.PRO_ORIGEN_NAME -> Json.toJson(facturaVenta.stock.proNameOrigen),
      C.PRO_ID_DESTINO -> Json.toJson(facturaVenta.stock.proIdOrigen),
      C.PRO_DESTINO_NAME -> Json.toJson(facturaVenta.stock.proNameOrigen),

      C.FV_NETO -> Json.toJson(facturaVenta.totals.neto),
      C.FV_IVA_RI -> Json.toJson(facturaVenta.totals.ivaRi),
      C.FV_IVA_RNI -> Json.toJson(facturaVenta.totals.ivaRni),
      C.FV_INTERNOS -> Json.toJson(facturaVenta.totals.internos),
      C.FV_SUBTOTAL -> Json.toJson(facturaVenta.totals.subTotal),
      C.FV_IMPORTE_DESC_1 -> Json.toJson(facturaVenta.totals.importeDesc1),
      C.FV_IMPORTE_DESC_2 -> Json.toJson(facturaVenta.totals.importeDesc2),
      C.FV_TOTAL_PERCEPCIONES -> Json.toJson(facturaVenta.totals.totalPercepciones),
      C.FV_TOTAL -> Json.toJson(facturaVenta.totals.total),
      C.FV_TOTAL_ORIGEN -> Json.toJson(facturaVenta.totals.totalOrigen),

      // Items
      "items" -> Json.toJson(writeFacturaVentaItems(facturaVenta.items.items)),
      "serialNumbers" -> Json.toJson(writeFacturaVentaItemSeries(facturaVenta.items.series)),
      "percepciones" -> Json.toJson(writeFacturaVentaPercepciones(facturaVenta.items.percepciones)),
      "kitDefinitions" -> Json.toJson(writeFacturaVentaItemKits(facturaVenta.items.kits))
    )
    def facturaVentaItemWrites(i: FacturaVentaItem) = Json.obj(
      C.FVI_ID -> Json.toJson(i.id),
      C.FVI_DESCRIP -> Json.toJson(i.base.descrip),
      C.FVI_DESCUENTO -> Json.toJson(i.base.descuento),
      GC.PR_ID -> Json.toJson(i.base.prId),
      GC.PR_NAME_VENTA -> Json.toJson(i.base.prName),
      GC.CCOS_ID -> Json.toJson(i.base.ccosId),
      GC.CCOS_NAME -> Json.toJson(i.base.ccosName),
      GC.TO_ID -> Json.toJson(i.base.toId),
      GC.TO_NAME -> Json.toJson(i.base.toName),
      GC.CUE_ID -> Json.toJson(i.base.cueId),
      C.CUE_ID_IVA_RI -> Json.toJson(i.base.cueIdIvaRi),
      C.CUE_ID_IVA_RNI -> Json.toJson(i.base.cueIdIvaRni),
      GC.STL_ID -> Json.toJson(i.base.stlId),
      GC.STL_CODE -> Json.toJson(i.base.stlCode),
      C.FVI_ORDEN -> Json.toJson(i.base.orden),
      GC.PR_LLEVA_NRO_SERIE -> Json.toJson(i.base.llevaNroSerie),
      GC.PR_LLEVA_NRO_LOTE -> Json.toJson(i.base.llevaNroLote),
      GC.UN_NAME -> Json.toJson(i.base.unName),
      C.FVI_CANTIDAD -> Json.toJson(i.totals.cantidad),
      C.FVI_PRECIO -> Json.toJson(i.totals.precio),
      C.FVI_PRECIO_LISTA -> Json.toJson(i.totals.precioLista),
      C.FVI_PRECIO_USR -> Json.toJson(i.totals.precioUser),
      C.FVI_NETO -> Json.toJson(i.totals.neto),
      C.FVI_IVA_RI -> Json.toJson(i.totals.ivaRi),
      C.FVI_IVA_RNI -> Json.toJson(i.totals.ivaRni),
      C.FVI_INTERNOS -> Json.toJson(i.totals.internos),
      C.FVI_IVA_RI_PORC -> Json.toJson(i.totals.ivaRiPorc),
      C.FVI_IVA_RNI_PORC -> Json.toJson(i.totals.ivaRniPorc),
      C.FVI_INTERNOS_PORC -> Json.toJson(i.totals.internosPorc),
      GC.PR_PORC_INTERNO_V -> Json.toJson(i.totals.prInternosPorc),
      C.FVI_IMPORTE -> Json.toJson(i.totals.importe),
      C.FVI_IMPORTE_ORIGEN -> Json.toJson(i.totals.importeOrigen)
    )
    def facturaVentaItemSerieWrites(i: FacturaVentaItemSerie) = Json.obj(
      C.FVI_ID -> Json.toJson(i.fviId),
      GC.PRNS_ID -> Json.toJson(i.id),
      GC.PRNS_CODE -> Json.toJson(i.code),
      GC.PRNS_DESCRIP -> Json.toJson(i.descrip),
      GC.PRNS_FECHA_VTO -> Json.toJson(i.fechaVto)
    )
    def facturaVentaPercepcionWrites(p: FacturaVentaPercepcion) = Json.obj(
      C.FVPERC_ID -> Json.toJson(p.id),
      GC.PERC_ID -> Json.toJson(p.percId),
      GC.PERC_NAME -> Json.toJson(p.percName),
      C.FVPERC_BASE -> Json.toJson(p.base),
      C.FVPERC_PORCENTAJE -> Json.toJson(p.porcentaje),
      C.FVPERC_IMPORTE -> Json.toJson(p.importe),
      GC.CCOS_ID -> Json.toJson(p.ccosId),
      GC.CCOS_NAME -> Json.toJson(p.ccosName),
      C.FVPERC_DESCRIP -> Json.toJson(p.descrip),
      C.FVPERC_ORIGEN -> Json.toJson(p.origen),
      C.FVPERC_ORDEN -> Json.toJson(p.orden)
    )
    def facturaVentaItemKitWrites(p: FacturaVentaItemKit) = Json.obj(
      GC.PR_ID -> Json.toJson(p.id),
      GC.PR_NAME_VENTA -> Json.toJson(p.name),
      GC.PRK_CANTIDAD -> Json.toJson(p.amount),
      GC.PR_LLEVA_NRO_SERIE -> Json.toJson(p.hasSerial)
    )
    def writeFacturaVentaItems(items: List[FacturaVentaItem]) = items.map(item => facturaVentaItemWrites(item))
    def writeFacturaVentaItemSeries(items: List[FacturaVentaItemSerie]) = items.map(item => facturaVentaItemSerieWrites(item))
    def writeFacturaVentaPercepciones(items: List[FacturaVentaPercepcion]) = items.map(item => facturaVentaPercepcionWrites(item))
    def writeFacturaVentaItemKits(items: List[FacturaVentaItemKit]) = items.map(item => facturaVentaItemKitWrites(item))
  }

  def get(id: Int) = GetAction { implicit request =>
    LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.LIST_FACTURA_VENTA), { user =>
      Ok(Json.toJson(FacturaVenta.get(user, id)))
    })
  }

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //
  // this functions convert the plain JSON received in CREATE and UPDATE into a FacturaData structure
  //
  // because the limitation to 18 fields in case class used for FORM mapping we have grouped the fields
  // in FacturaVenta/Data, FacturaVentaItem/Data, etc
  //
  // the below routines group a flat JSON and in some cases rename the name of the fields or move
  // fields to the parent node in the JSON structure to match the case class
  //

  private def preprocessParams(implicit request:Request[AnyContent]): JsObject = {

    def preprocessSeriesParam(items: JsValue, group: String): Map[String, JsValue] = items match {
      case jsArray: JsArray => Map(group -> jsArray)
      case _ => Map(group -> JsArray(List()))
    }

    def preprocessItemParam(field: JsValue) = {
      val params = field.as[Map[String, JsValue]]

      // groups for FacturaVentaItemData
      //
      val facturaItem = preprocessFormParams(List(C.FVI_ID), "", params)
      val facturaItemBaseGroup = preprocessFormParams(facturaItemBase, C.FACTURA_ITEM_BASE, params)
      val facturaItemTotalsGroup = preprocessFormParams(facturaItemTotals, C.FACTURA_ITEM_TOTALS, params)

      // in the POSTED JSON we have this structure:
      //
      //     FacturaVentaItemSerieTMP: {
      //          items: [],
      //          deletedList: ""
      //      }
      //
      // we need to convert it into
      //
      //      deletedList: "",
      //      FacturaVentaItemSerieTMP: []
      //
      // NOTICE that deletedList is a field of FacturaVentaItemSerieTMP but in the converted structure
      // it is move up to the parent node ( the FacturaVentaItem )
      //
      // this is done because in database.js we have one Transaction object to manage items in a Master-Detail
      // relation like FacturaVentaItem -> FacturaVentaItemSerie or FacturaVenta -> FacturaVentaItem
      //
      // this Transaction object is an intermediary object which doesn't exists here
      //
      // so FacturaVentaItemData has deletedList field called serieDeleted and FacturaVentaData has four deletedList
      // fields: itemDeleted and percepcionDeleted
      //

      val serieInfo = getJsValueAsMap(getParamsJsonRequestFor(C.FACTURA_VENTA_ITEM_SERIE_TMP, params))
      val serieRows = getParamsJsonRequestFor(GC.ITEMS, serieInfo)
      val deletedList: Map[String, JsValue] = getParamsJsonRequestFor(GC.DELETED_LIST, serieInfo).toList match {
        case Nil => Map(GC.DELETED_LIST -> Json.toJson(""))
        case deletedList :: t => Map(deletedList)
      }
      val serieItems = serieRows.toList match {
        case (k: String, item: JsValue) :: t => preprocessSeriesParam(item, C.FACTURA_VENTA_ITEM_SERIE_TMP)
        case _ => Map(C.FACTURA_VENTA_ITEM_SERIE_TMP -> JsArray(List()))
      }

      val item = JsObject(
        (facturaItem ++ facturaItemBaseGroup ++ facturaItemTotalsGroup ++ serieItems ++ deletedList).toSeq)
      item
    }

    def preprocessPercepcionParam(field: JsValue) = {
      val params = field.as[Map[String, JsValue]]
      JsObject(preprocessFormParams(facturaPercepcion, "", params).toSeq)
    }

    def preprocessRemitoParam(field: JsValue) = {
      val params = field.as[Map[String, JsValue]]
      JsObject(preprocessFormParams(facturaRemito, "", params).toSeq)
    }

    def preprocessItemsParam(items: JsValue, group: String): Map[String, JsValue] = items match {
      case JsArray(arr) => Map(group -> JsArray(arr.map(preprocessItemParam(_))))
      case _ => Map.empty
    }

    def preprocessPercepcionesParam(items: JsValue, group: String): Map[String, JsValue] = items match {
      case JsArray(arr) => Map(group -> JsArray(arr.map(preprocessPercepcionParam(_))))
      case _ => Map.empty
    }

    def preprocessRemitosParam(items: JsValue, group: String): Map[String, JsValue] = items match {
      case JsArray(arr) => Map(group -> JsArray(arr.map(preprocessRemitoParam(_))))
      case _ => Map.empty
    }

    val params = getParamsFromJsonRequest

    // groups for FacturaVentaData
    //
    val facturaId = preprocessFormParams(List("id"), "", params)
    val facturaIdGroup = preprocessFormParams(facturaIdFields, C.FACTURA_ID, params)
    val facturaBaseGroup = preprocessFormParams(facturaBaseFields, C.FACTURA_BASE, params)
    val facturaDatesGroup = preprocessFormParams(facturaDatesFields, C.FACTURA_DATES, params)
    val facturaPreciosGroup = preprocessFormParams(facturaPreciosFields, C.FACTURA_PRECIOS, params)
    val facturaCotizacionGroup = preprocessFormParams(facturaCotizacionFields, C.FACTURA_COTIZACION, params)
    val facturaStockGroup = preprocessFormParams(facturaStockFields, C.FACTURA_STOCK, params)
    val facturaTotalGroup = preprocessFormParams(facturaTotalsFields, C.FACTURA_TOTALS, params)

    // items
    //
    val itemsInfo = getJsValueAsMap(getParamsJsonRequestFor(C.FACTURA_VENTA_ITEM_TMP, params))
    val itemRows = getParamsJsonRequestFor(GC.ITEMS, itemsInfo)
    val itemDeleted: Map[String, JsValue] = getParamsJsonRequestFor(GC.DELETED_LIST, itemsInfo).toList match {
      case Nil => Map(C.FACTURA_ITEM_DELETED -> Json.toJson(""))
      case deletedList :: t => Map(C.FACTURA_ITEM_DELETED -> Json.toJson(deletedList._2))
    }
    val facturaItems = preprocessItemsParam(itemRows.head._2, C.FACTURA_VENTA_ITEM_TMP)

    // percepciones
    //
    val percepcionesInfo = getJsValueAsMap(getParamsJsonRequestFor(C.FACTURA_VENTA_PERCEPCION_TMP, params))
    val percepcionRows = getParamsJsonRequestFor(GC.ITEMS, percepcionesInfo)
    val percepcionDeleted: Map[String, JsValue] = getParamsJsonRequestFor(GC.DELETED_LIST, percepcionesInfo).toList match {
      case Nil => Map(C.FACTURA_PERCEPCION_DELETED -> Json.toJson(""))
      case deletedList :: t => Map(C.FACTURA_PERCEPCION_DELETED -> Json.toJson(deletedList._2))
    }
    val facturaPercepciones = percepcionRows.toList match {
      case (k: String, item: JsValue) :: t => preprocessPercepcionesParam(item, C.FACTURA_VENTA_PERCEPCION_TMP)
      case _ => Map(C.FACTURA_VENTA_PERCEPCION_TMP -> JsArray(List()))
    }

    // remitos
    //
    val remitosInfo = getJsValueAsMap(getParamsJsonRequestFor(C.REMITO_FACTURA_VENTA_TMP, params))
    val remitoRows = getParamsJsonRequestFor(GC.ITEMS, remitosInfo)
    val facturaRemitos = remitoRows.toList match {
      case (k: String, item: JsValue) :: t => preprocessRemitosParam(item, C.REMITO_FACTURA_VENTA_TMP)
      case _ => Map(C.REMITO_FACTURA_VENTA_TMP -> JsArray(List()))
    }

    JsObject(
      (facturaId ++ facturaIdGroup ++ facturaBaseGroup ++ facturaDatesGroup ++ facturaPreciosGroup
        ++ facturaCotizacionGroup ++ facturaStockGroup ++ facturaTotalGroup
        ++ facturaItems ++ itemDeleted ++ facturaPercepciones ++ percepcionDeleted ++ facturaRemitos).toSeq)
  }
  //
  //
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //
  // this functions convert the plain JSON received in SAVE_APLIC into a FacturaVentaAplic structure
  //
  // because the limitation to 18 fields in case class used for FORM mapping we have grouped the fields
  // in FacturaVenta/Aplic, FacturaVenta/NotaCredito/Cobranza, etc
  //
  // the below routines group a flat JSON and in some cases rename the name of the fields or move
  // fields to the parent node in the JSON structure to match the case class
  //

  private def preprocessAplicParams(implicit request:Request[AnyContent]): JsObject = {

    def preprocessNotaCreditoParam(field: JsValue) = {
      val params = field.as[Map[String, JsValue]]
      JsObject(preprocessFormParams(notaCredito, "", params).toSeq)
    }

    def preprocessPedidoVentaParam(field: JsValue) = {
      val params = field.as[Map[String, JsValue]]
      JsObject(preprocessFormParams(pedidoVenta, "", params).toSeq)
    }

    def preprocessRemitoVentaParam(field: JsValue) = {
      val params = field.as[Map[String, JsValue]]
      JsObject(preprocessFormParams(remitoVenta, "", params).toSeq)
    }

    def preprocessNotasCreditoParam(items: JsValue, group: String): Map[String, JsValue] = items match {
      case JsArray(arr) => Map(group -> JsArray(arr.map(preprocessNotaCreditoParam(_))))
      case _ => Map.empty
    }

    def preprocessPedidosVentaParam(items: JsValue, group: String): Map[String, JsValue] = items match {
      case JsArray(arr) => Map(group -> JsArray(arr.map(preprocessPedidoVentaParam(_))))
      case _ => Map.empty
    }

    def preprocessRemitosVentaParam(items: JsValue, group: String): Map[String, JsValue] = items match {
      case JsArray(arr) => Map(group -> JsArray(arr.map(preprocessRemitoVentaParam(_))))
      case _ => Map.empty
    }

    val params = getParamsFromJsonRequest

    // groups for FacturaVentaData
    //
    val facturaId = preprocessFormParams(List(C.FV_ID, GC.DOC_ID), "", params)

    // notas credito
    //
    val notasCreditoInfo = getJsValueAsMap(getParamsJsonRequestFor(TC.FACTURA_VENTA_NOTA_CREDITO_TMP, params))
    val notaCreditoRows = getParamsJsonRequestFor(GC.ITEMS, notasCreditoInfo)
    val notasCredito = notaCreditoRows.toList match {
      case (k: String, item: JsValue) :: t => preprocessNotasCreditoParam(item, TC.FACTURA_VENTA_NOTA_CREDITO_TMP)
      case _ => Map(TC.FACTURA_VENTA_NOTA_CREDITO_TMP -> JsArray(List()))
    }

    // pedidos de venta
    //
    val pedidosVentaInfo = getJsValueAsMap(getParamsJsonRequestFor(C.PEDIDO_FACTURA_VENTA_TMP, params))
    val pedidosVentaRows = getParamsJsonRequestFor(GC.ITEMS, pedidosVentaInfo)
    val pedidosVenta = pedidosVentaRows.toList match {
      case (k: String, item: JsValue) :: t => preprocessPedidosVentaParam(item, C.PEDIDO_FACTURA_VENTA_TMP)
      case _ => Map(C.PEDIDO_FACTURA_VENTA_TMP -> JsArray(List()))
    }

    // remitos
    //
    val remitosInfo = getJsValueAsMap(getParamsJsonRequestFor(C.REMITO_FACTURA_VENTA_TMP, params))
    val remitoRows = getParamsJsonRequestFor(GC.ITEMS, remitosInfo)
    val remitosVenta = remitoRows.toList match {
      case (k: String, item: JsValue) :: t => preprocessRemitosVentaParam(item, C.REMITO_FACTURA_VENTA_TMP)
      case _ => Map(C.REMITO_FACTURA_VENTA_TMP -> JsArray(List()))
    }

    def preprocessCobranzaItemParam(field: JsValue) = {
      val params = field.as[Map[String, JsValue]]
      Logger.debug(s"preprocessCobranzaItemParam -> params: ${params}")

      def preprocessCobranzaParam(field: JsValue) = {
        val params = field.as[Map[String, JsValue]]
        JsObject(preprocessFormParams(cobranza, "", params).toSeq)
      }

      def preprocessCtaCteParam(field: JsValue) = {
        val params = field.as[Map[String, JsValue]]
        JsObject(preprocessFormParams(ctaCte, "", params).toSeq)
      }

      def preprocessCobranzasParam(items: JsValue, group: String): Map[String, JsValue] = items match {
        case JsArray(arr) => Map(group -> JsArray(arr.map(preprocessCobranzaParam(_))))
        case _ => Map.empty
      }

      def preprocessCtasCteParam(items: JsValue, group: String): Map[String, JsValue] = items match {
        case JsArray(arr) => Map(group -> JsArray(arr.map(preprocessCtaCteParam(_))))
        case _ => Map.empty
      }

      val cobranzaId = preprocessFormParams(List(TC.COBZ_ID), "", params)

      // cobranza item
      //
      val cobranzasInfo = getJsValueAsMap(getParamsJsonRequestFor(TC.FACTURA_VENTA_COBRANZA_TMP, params))
      Logger.debug(s"cobranzasInfo: ${cobranzasInfo}")
      val cobranzaRows = getParamsJsonRequestFor(GC.ITEMS, cobranzasInfo)
      Logger.debug(s"cobranzaRows: ${cobranzaRows}")
      val cobranzas = cobranzaRows.toList match {
        case (k: String, item: JsValue) :: t => preprocessCobranzasParam(item, TC.FACTURA_VENTA_COBRANZA_TMP)
        case _ => Map(TC.FACTURA_VENTA_COBRANZA_TMP -> JsArray(List()))
      }

      // cobranza cta cte
      //
      val ctasCteInfo = getJsValueAsMap(getParamsJsonRequestFor(TC.COBRANZA_ITEM_CUENTA_CORRIENTE_TMP, params))
      Logger.debug(s"ctasCteInfo: ${ctasCteInfo}")
      val ctaCteRows = getParamsJsonRequestFor(GC.ITEMS, ctasCteInfo)
      Logger.debug(s"ctaCteRows: ${ctaCteRows}")
      val ctaCteCobranza = ctaCteRows.toList match {
        case (k: String, item: JsValue) :: t => preprocessCobranzasParam(item, TC.COBRANZA_ITEM_CUENTA_CORRIENTE_TMP)
        case _ => Map(TC.COBRANZA_ITEM_CUENTA_CORRIENTE_TMP -> JsArray(List()))
      }

      Logger.debug(s"cobranzas: ${cobranzas}")
      Logger.debug(s"ctaCteCobranza: ${ctaCteCobranza}")
      JsObject((cobranzaId ++ cobranzas ++ ctaCteCobranza).toSeq)
    }

    def preprocessCobranzasItemParam(items: JsValue, group: String): Map[String, JsValue] = items match {
      case JsArray(arr) => Map(group -> JsArray(arr.map(preprocessCobranzaItemParam(_))))
      case _ => Map.empty
    }

    // cobranza item
    //
    val cobranzasItemInfo = getJsValueAsMap(getParamsJsonRequestFor(TC.COBRANZA_TMP, params))
    val cobranzaItemRows = getParamsJsonRequestFor(GC.ITEMS, cobranzasItemInfo)
    val cobranzasItem = cobranzaItemRows.toList match {
      case (k: String, item: JsValue) :: t => preprocessCobranzasItemParam(item, TC.COBRANZA_TMP)
      case _ => Map(TC.COBRANZA_TMP -> JsArray(List()))
    }

    JsObject((facturaId ++ notasCredito ++ cobranzasItem ++ pedidosVenta ++ remitosVenta).toSeq)
  }
  //
  //
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  def getItems(items: List[FacturaVentaItemData]): List[FacturaVentaItem] = {
    items.map(item => {
      FacturaVentaItem(
        item.id,
        FacturaVentaItemBase(
          item.base.descrip,
          "",
          item.base.prId,
          item.base.ccosId,
          item.base.toId,
          item.base.cueId,
          item.base.cueIdIvaRi,
          item.base.cueIdIvaRni,
          item.base.stlId,
          item.base.orden
        ),
        FacturaVentaItemTotals(
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
          FacturaVentaItemSerie(
            serie.id,
            serie.code,
            serie.descrip,
            DateFormatter.parse(serie.fechaVto),
            DBHelper.NoId
          )
        })
      )
    })
  }

  def getPercepciones(percepciones: List[FacturaVentaPercepcionData]): List[FacturaVentaPercepcion] = {
    percepciones.map(percepcion => {
      FacturaVentaPercepcion(
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

  def getRemitos(remitos: List[FacturaVentaRemitoData]): List[FacturaVentaRemito] = {
    remitos.map(remito => {
      FacturaVentaRemito(
        remito.rviId,
        remito.cantidad,
        remito.fviId
      )
    })
  }

  def getFacturaVentaItems(facturaVenta: FacturaVentaData): FacturaVentaItems = {
    FacturaVentaItems(
      getItems(facturaVenta.items),

      List(), /* only used when loading an invoice to respond a get FacturaVenta */

      List(), /* only used when loading an invoice to respond a get FacturaVenta */

      getPercepciones(facturaVenta.percepciones),

      facturaVenta.itemDeleted,
      facturaVenta.percepcionDeleted,

      getRemitos(facturaVenta.remitos)
    )
  }

  def getFacturaVenta(facturaVenta: FacturaVentaData, id: Int): FacturaVenta = {
    FacturaVenta(
      id,
      FacturaVentaId(
        facturaVenta.ids.docId,
        facturaVenta.ids.numero,
        facturaVenta.ids.nroDoc),
      FacturaVentaBase(
        facturaVenta.base.cliId,
        facturaVenta.base.estId,
        facturaVenta.base.ccosId,
        facturaVenta.base.sucId,
        facturaVenta.base.cpgId,
        facturaVenta.base.lgjId,
        facturaVenta.base.venId,
        facturaVenta.base.clisId,
        facturaVenta.base.ordenCompra,
        facturaVenta.base.cai,
        facturaVenta.base.descrip,
        facturaVenta.base.grabarAsiento),
      FacturaVenta.emptyFacturaVentaReferences,
      FacturaVentaDates(
        DateFormatter.parse(facturaVenta.dates.fecha),
        DateFormatter.parse(facturaVenta.dates.fechaEntrega),
        DateFormatter.parse(facturaVenta.dates.fechaIva),
        DateFormatter.parse(facturaVenta.dates.fechaVto)),
      FacturaVentaPrecios(
        facturaVenta.precios.desc1,
        facturaVenta.precios.desc2,
        facturaVenta.precios.lpId,
        facturaVenta.precios.ldId),
      FacturaVentaCotizacion(
        facturaVenta.cotizacion.cotizacion),
      FacturaVentaStock(
        facturaVenta.stock.proIdOrigen,
        facturaVenta.stock.proIdDestino,
        facturaVenta.stock.deplId,
        facturaVenta.stock.transId),
      FacturaVentaTotals(
        facturaVenta.totals.neto,
        facturaVenta.totals.ivaRi,
        facturaVenta.totals.ivaRni,
        facturaVenta.totals.internos,
        facturaVenta.totals.subTotal,
        facturaVenta.totals.importeDesc1,
        facturaVenta.totals.importeDesc2,
        facturaVenta.totals.totalPercepciones,
        facturaVenta.totals.total,
        facturaVenta.totals.totalOrigen),
      getFacturaVentaItems(facturaVenta)
    )
  }

  def update(id: Int) = PostAction { implicit request =>
    Logger.debug("in FacturaVentas.update")

    facturaVentaForm.bind(preprocessParams).fold(
      formWithErrors => {
        Logger.debug(s"invalid form: ${formWithErrors.toString}")
        BadRequest
      },
      facturaVenta => {
        Logger.debug(s"form: ${facturaVenta.toString}")
        LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.EDIT_FACTURA_VENTA), { user =>
          try {
            Ok(
              Json.toJson(
                FacturaVenta.update(user,
                  getFacturaVenta(facturaVenta, id)
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
    Logger.debug("in FacturaVentas.create")
    facturaVentaForm.bind(preprocessParams).fold(
      formWithErrors => {
        Logger.debug(s"invalid form: ${formWithErrors.toString}")
        BadRequest
      },
      facturaVenta => {
        Logger.debug(s"form: ${facturaVenta.toString}")
        LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.NEW_FACTURA_VENTA), { user =>
          try {
            Ok(
              Json.toJson(
                FacturaVenta.createFromRemito(user,
                  getFacturaVenta(facturaVenta, DBHelper.NoId)
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
    Logger.debug("in FacturaVentas.create")
    facturaVentaForm.bind(preprocessParams).fold(
      formWithErrors => {
        Logger.debug(s"invalid form: ${formWithErrors.toString}")
        BadRequest
      },
      facturaVenta => {
        Logger.debug(s"form: ${facturaVenta.toString}")
        LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.NEW_FACTURA_VENTA), { user =>
          try {
            Ok(
              Json.toJson(
                FacturaVenta.create(user,
                  getFacturaVenta(facturaVenta, DBHelper.NoId)
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
    Logger.debug("in FacturaVentas.delete")
    LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.DELETE_FACTURA_VENTA), { user =>
      try {
        FacturaVenta.delete(user, id)
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
            venId: Option[String],
            docId: Option[String],
            cpgId: Option[String],
            empId: Option[String]
            ) = GetAction { implicit request =>
    LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.LIST_FACTURA_VENTA), { user =>
      Ok(
        Json.toJson(
          Recordset.getAsJson(
            FacturaVenta.list(
              user,
              DateFormatter.parse(from.getOrElse("")), DateFormatter.parse(to.getOrElse("")),
              cliId, estId, ccosId, sucId, venId, docId, cpgId, empId))))
    })
  }

  def parameters = GetAction { implicit request =>
    LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.LIST_FACTURA_VENTA), { user =>
      Ok(Json.toJson(FacturaVenta.loadParams(user)))
    })
  }

  def saveParameters = PostAction { implicit request =>
    Logger.debug("in FacturaVentas.saveParameters")
    facturaVentaParamsForm.bindFromRequest.fold(
      formWithErrors => {
        Logger.debug(s"invalid form: ${formWithErrors.toString}")
        BadRequest
      },
      facturaVentaParams => {
        Logger.debug(s"form: ${facturaVentaParams.toString}")
        LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.LIST_FACTURA_VENTA), { user =>
          Ok(
            Json.toJson(
              FacturaVenta.saveParams(user,
                FacturaVentaParams(
                  facturaVentaParams.from,
                  facturaVentaParams.to,
                  facturaVentaParams.cliId,
                  facturaVentaParams.estId,
                  facturaVentaParams.ccosId,
                  facturaVentaParams.sucId,
                  facturaVentaParams.venId,
                  facturaVentaParams.docId,
                  facturaVentaParams.cpgId,
                  facturaVentaParams.empId
                )
              )
            )
          )
        })
      }
    )
  }

  def notes(id: Int) = GetAction { implicit request =>
    LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.LIST_FACTURA_VENTA), { user =>
      Ok(Json.toJson(""))
    })
  }

  def listRemitos(cliId: Int, currencyId: Int) = GetAction { implicit request =>
    LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.NEW_FACTURA_VENTA), { user =>
      Ok(Recordset.getAsJson(FacturaVenta.listRemitos(user, cliId, currencyId)))
    })
  }

  def listRemitosItems(ids: Option[String]) = GetAction { implicit request =>
    LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.NEW_FACTURA_VENTA), { user =>
      Ok(Json.toJson(Recordset.getAsJson(FacturaVenta.listRemitosItems(user, ids.getOrElse("")))))
    })
  }

  def getAplic(id: Int) = GetAction { implicit request =>
    LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.MODIFY_APLIC_VENTA), { user =>
      val (cueId, monId) = FacturaVenta.getCtaCteCuenta(user, id)
      Ok(Json.obj(
        "ctacte_cue_id" -> Json.toJson(cueId),
        "mon_id_x_cuenta" -> Json.toJson(monId),
        "vencimientos" -> Recordset.getAsJson(FacturaVenta.getAplic(user, id, 1)),
        "cobrosAplicados" -> Recordset.getAsJson(FacturaVenta.getAplic(user, id, 2)),
        "cobrosParaAplicar" -> Recordset.getAsJson(FacturaVenta.getAplic(user, id, 3)),
        "items" -> Recordset.getAsJson(FacturaVenta.getAplic(user, id, 4)),
        "itemsAplicados" -> Recordset.getAsJson(FacturaVenta.getAplic(user, id, 5)),
        "itemsParaAplicar" -> Recordset.getAsJson(FacturaVenta.getAplic(user, id, 6))
      ))
    })
  }

  def saveAplic(id: Int) = GetAction { implicit request =>
    facturaVentaAplicForm.bind(preprocessAplicParams).fold(
      formWithErrors => {
        Logger.debug(s"invalid form: ${formWithErrors.toString}")
        BadRequest
      },
      facturaVentaAplic => {
        Logger.debug(s"form: ${facturaVentaAplic.toString}")
        LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.MODIFY_APLIC_VENTA), { user =>
          try {
            Ok(
              Json.toJson(
                FacturaVenta.saveAplic(user, facturaVentaAplic)
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