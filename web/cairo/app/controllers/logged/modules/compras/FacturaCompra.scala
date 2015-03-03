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
import models.cairo.system.database.DBHelper
import java.util.Date
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
                                    fecha: Date,
                                    fechaEntrega: Date,
                                    fechaIva: Date,
                                    fechaVto: Date
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

case class FacturaCompraItemData(
                                    id: Int,
                                    cantidad: Double
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
        C.LGJ_ID -> number,
        C.FC_CAI -> text,
        C.FC_TIPO_COMPROBANTE -> number,
        C.FC_DESCRIP -> text,
        C.FC_GRABAR_ASIENTO -> boolean)
        (FacturaCompraBaseData.apply)(FacturaCompraBaseData.unapply),
      C.FACTURA_DATES -> mapping (
        C.FC_FECHA -> date,
        C.FC_FECHA_ENTREGA -> date,
        C.FC_FECHA_IVA -> date,
        C.FC_FECHA_VTO -> date)
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
      C.FACTURA_ITEMS -> Forms.list[FacturaCompraItemData](
        mapping(
          C.FCI_ID -> number,
          C.FCI_CANTIDAD -> of(Global.doubleFormat))
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
      C.LGJ_ID -> Json.toJson(facturaCompra.base.lgjId),
      C.LGJ_NAME -> Json.toJson(facturaCompra.base.lgjName),
      C.FC_CAI -> Json.toJson(facturaCompra.base.cai),
      C.FC_DESCRIP -> Json.toJson(facturaCompra.base.descrip),
      C.FC_TIPO_COMPROBANTE -> Json.toJson(facturaCompra.base.tipoComprobante),
      C.FC_GRABAR_ASIENTO -> Json.toJson(facturaCompra.base.grabarAsiento),

      C.FC_COTIZACION -> Json.toJson(facturaCompra.cotizacion.cotizacion),
      C.FC_COTIZACION_PROV -> Json.toJson(facturaCompra.cotizacion.cotizacionProveedor),

      C.FC_DESCUENTO1 -> Json.toJson(facturaCompra.precios.desc1),
      C.FC_DESCUENTO2 -> Json.toJson(facturaCompra.precios.desc2),
      GC.LP_ID -> Json.toJson(facturaCompra.precios.lpId),
      GC.LP_NAME -> Json.toJson(facturaCompra.precios.lpName),
      GC.LD_ID -> Json.toJson(facturaCompra.precios.ldId),
      GC.LD_NAME -> Json.toJson(facturaCompra.precios.ldName),

      GC.DEPL_ID -> Json.toJson(facturaCompra.stock.deplId),
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
      C.LLEVA_NRO_SERIE -> Json.toJson(i.base.llevaNroSerie),
      C.LLEVA_NRO_LOTE -> Json.toJson(i.base.llevaNroLote),
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
      C.LGJ_ID -> Json.toJson(l.lgjId),
      C.LGJ_NAME -> Json.toJson(l.lgjName),
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
    def writeFacturaCompraOtros(items: List[FacturaCompraOtro]) = items.map(item => facturaCompraOtroWrites(item))
    def writeFacturaCompraLegajos(items: List[FacturaCompraLegajo]) = items.map(item => facturaCompraLegajoWrites(item))
    def writeFacturaCompraPercepciones(items: List[FacturaCompraPercepcion]) = items.map(item => facturaCompraPercepcionWrites(item))
  }

  def get(id: Int) = GetAction { implicit request =>
    LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.LIST_FACTURA_COMPRA), { user =>
      Ok(Json.toJson(FacturaCompra.get(user, id)))
    })
  }

  def update(id: Int) = PostAction { implicit request =>
    Logger.debug("in FacturaCompras.update")
    facturaCompraForm.bindFromRequest.fold(
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
                  FacturaCompraDates(
                    facturaCompra.dates.fecha,
                    facturaCompra.dates.fechaEntrega,
                    facturaCompra.dates.fechaIva,
                    facturaCompra.dates.fechaVto),
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
    facturaCompraForm.bindFromRequest.fold(
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
                  FacturaCompraDates(
                    facturaCompra.dates.fecha,
                    facturaCompra.dates.fechaEntrega,
                    facturaCompra.dates.fechaIva,
                    facturaCompra.dates.fechaVto),
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
            provId: Option[Int],
            estId: Option[Int],
            ccosId: Option[Int],
            sucId: Option[Int],
            docId: Option[Int],
            cpgId: Option[Int]
    ) = GetAction { implicit request =>
    LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.LIST_FACTURA_COMPRA), { user =>
      Ok(Json.toJson(""))
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