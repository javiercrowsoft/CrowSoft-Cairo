package controllers.logged.modules.compras

import controllers._
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
                                    fechaVto: FacturaCompraDatesData
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

case class FacturaCompraData(
                              id: Option[Int],
                              ids: FacturaCompraIdData,
                              base: FacturaCompraBaseData,
                              dates: FacturaCompraDatesData,
                              precios: FacturaCompraPreciosData,
                              cotizacion: FacturaCompraCotizacionData,
                              stock: FacturaCompraStockData,
                              totals: FacturaCompraTotalsData,
                            )

object FacturaCompras extends Controller with ProvidesUser {

  val GC = models.cairo.modules.general.C

  val facturaCompraForm = Form(
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
        C.FC_FECHA_ENTREGA: date,
        C.FC_FECHA_IVA: date,
        C.FC_FECHA_VTO: date)
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
        (FacturaCompraPreciosData.apply)(FacturaCompraPreciosData.unapply),
      C.FACTURA_STOCK -> mapping (
        C.PRO_ID_ORIGEN -> number,
        C.PRO_ID_DESTINO -> number,
        GC.DEPL_ID -> number)
        (FacturaCompraStockData.apply)(FacturaCompraStockData.unapply),
      C.FACTURA_TOTALS -> mapping (
        C.FC_NETO -> number,
        C.FC_IVA_RI -> number,
        C.FC_IVA_RNI -> number,
        C.FC_INTERNOS -> number,
        C.FC_SUBTOTAL -> number,
        C.FC_IMPORTE_DESC_1 -> number,
        C.FC_IMPORTE_DESC_2 -> number,
        C.FC_TOTAL_OTROS -> number,
        C.FC_TOTAL_PERCEPCIONES -> number,
        C.FC_TOTAL -> number,
        C.FC_TOTAL_ORIGEN -> number
        )(FacturaCompraTotalsData.apply)(FacturaCompraTotalsData.unapply)
    )(FacturaCompraData.apply)(FacturaCompraData.unapply))

  implicit val facturaCompraWrites = new Writes[FacturaCompra] {
    def writes(facturaCompra: FacturaCompra) = Json.obj(
      "id" -> Json.toJson(facturaCompra.id),
      C.ID -> Json.toJson(facturaCompra.id),

    )
  }

  def get(id: Int) = GetAction { implicit request =>
    LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.LIST_FACTURA_COMPRA), { user =>
      Ok(Json.toJson(Facturacompra.get(user, id)))
    })
  }

  def update(id: Int) = PostAction { implicit request =>
    Logger.debug("in facturaCompras.update")
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
              Facturacompra.update(user,
                Facturacompra(
                  id,

                ))))
        })
      }
    )
  }

  def create = PostAction { implicit request =>
    Logger.debug("in facturaCompras.create")
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
              Facturacompra.create(user,
                Facturacompra(

                ))))
        })
      }
    )
  }

  def delete(id: Int) = PostAction { implicit request =>
    Logger.debug("in facturaCompras.delete")
    LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.DELETE_FACTURA_COMPRA), { user =>
      Facturacompra.delete(user, id)
      // Backbonejs requires at least an empty json object in the response
      // if not it will call errorHandler even when we responded with 200 OK :P
      Ok(JsonUtil.emptyJson)
    })
  }

}