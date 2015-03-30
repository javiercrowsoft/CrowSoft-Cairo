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
import java.util.Date
import formatters.json.DateFormatter
import formatters.json.DateFormatter._

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
                                    ivaRni: Double,
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
                                    series: List[FacturaCompraItemDataSerie], /* only used in save */
                                    serieDeleted: String /* only used in save */
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
                              items: List[FacturaCompraItemData]
                            )

case class FacturaCompraParamsData(
                                from: Date,
                                to: Date,
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

  val facturaCompraParamsForm: Form[FacturaCompraParamsData] = Form(
    mapping(
      GC.FROM -> date,
      GC.TO -> date,
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
            C.FCI_IVA_RNI -> of(Global.doubleFormat),
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
      C.AS_ID -> Json.toJson(facturaCompra.references.stId),
      C.ST_ID -> Json.toJson(facturaCompra.references.asId),
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

  private def preprocessParams(implicit request:Request[AnyContent]): JsObject = {

    def preprocessItemParam(field: (String, JsValue)) = {
      val params = field._2.as[Map[String, JsValue]]
      val facturaItem = Global.preprocessFormParams(List(C.FCI_ID, C.FACTURA_COMPRA_ITEM_SERIE_TMP, C.FACTURA_ITEM_SERIE_DELETED), "", params)
      val facturaItemBaseGroup = Global.preprocessFormParams(facturaItemBase, C.FACTURA_ITEM_BASE, params)
      val facturaItemTotalsGroup = Global.preprocessFormParams(facturaItemTotals, C.FACTURA_ITEM_TOTALS, params)

      val item = JsObject(
        (facturaItem ++ facturaItemBaseGroup ++ facturaItemTotalsGroup).toSeq)
      item
    }

    def preprocessItemsParam(items: JsValue, group: String): Map[String, JsValue] = items match {
      case JsArray(arr) => Map(group -> JsArray(arr.flatMap(_.as[Map[String, JsValue]].map(preprocessItemParam))))
      case _ => Map.empty
    }

    val params = Global.getParamsFromJsonRequest

    val facturaId = Global.preprocessFormParams(List("id"), "", params)
    val facturaIdGroup = Global.preprocessFormParams(facturaIdFields, C.FACTURA_ID, params)
    val facturaBaseGroup = Global.preprocessFormParams(facturaBaseFields, C.FACTURA_BASE, params)
    val facturaDatesGroup = Global.preprocessFormParams(facturaDatesFields, C.FACTURA_DATES, params)
    val facturaPreciosGroup = Global.preprocessFormParams(facturaPreciosFields, C.FACTURA_PRECIOS, params)
    val facturaCotizacionGroup = Global.preprocessFormParams(facturaCotizacionFields, C.FACTURA_COTIZACION, params)
    val facturaStockGroup = Global.preprocessFormParams(facturaStockFields, C.FACTURA_STOCK, params)
    val facturaTotalGroup = Global.preprocessFormParams(facturaTotalsFields, C.FACTURA_TOTALS, params)
    val items = Global.getParamsJsonRequestFor(C.FACTURA_COMPRA_ITEM_TMP, C.FACTURA_TOTALS, params)
    val facturaItems = preprocessItemsParam(items.head._2, C.FACTURA_COMPRA_ITEM_TMP)
    val form = JsObject(
                  (facturaId ++ facturaIdGroup ++ facturaBaseGroup ++ facturaDatesGroup ++ facturaPreciosGroup
                    ++ facturaCotizacionGroup ++ facturaStockGroup ++ facturaTotalGroup ++ facturaItems).toSeq)

    //Logger.debug(s"REQUEST-BODY: ${request.body.toString}")

    //Logger.debug(s"FORM-1: ${request.body.asJson.toString}")

    /*val fields = request.body.asJson match {
      case Some(fields) => s"received object: ${fields.as[Map[String, JsValue]].toString}"
      case _ => s"no json"
    }*/

    //Logger.debug(s"JSON TO MAP: ${fields}")

    //Logger.debug(s"FORM-ID-2: ${request.body.asFormUrlEncoded.map( _.filterKeys( facturaIdFields.contains(_) )).toString}")

    Logger.debug(s"FORM: ${form.toString}")

    form
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
          Ok(
            Json.toJson(
              FacturaCompra.update(user,
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
                    facturaCompra.totals.totalOrigen)
                )
              )
            )
          )
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
          Ok(
            Json.toJson(
              FacturaCompra.create(user,
                FacturaCompra(
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
                    facturaCompra.totals.totalOrigen)
                )
              )
            )
          )
        })
      }
    )
  }

  def delete(id: Int) = PostAction { implicit request =>
    Logger.debug("in FacturaCompras.delete")
    LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.DELETE_FACTURA_COMPRA), { user =>
      FacturaCompra.delete(user, id)
      // Backbonejs requires at least an empty json object in the response
      // if not it will call errorHandler even when we responded with 200 OK :P
      Ok(JsonUtil.emptyJson)
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
      Ok(Json.toJson(FacturaCompra.emptyFacturaCompraParams))
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

}