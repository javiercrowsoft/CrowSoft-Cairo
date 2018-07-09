package controllers.logged.modules.stock

import controllers._
import models.cairo.modules.stock.S
import play.api.mvc._
import play.api.data._
import play.api.data.Forms._
import actions._
import play.api.Logger
import play.api.libs.json._
import models.cairo.modules.stock._
import models.cairo.system.security.CairoSecurity
import models.cairo.system.database.{Recordset, DBHelper}
import java.util.Date
import formatters.json.DateFormatter
import formatters.json.DateFormatter._
import scala.util.control.NonFatal

case class StockIdData(
                          docId: Int,
                          numero: Int,
                          nroDoc: String
                         )

case class StockBaseData(
                            descrip: String,
                            fecha: String,
                            deplIdOrigen: Int,
                            deplIdDestino: Int,
                            lgjId: Int,
                            sucId: Int
                           )

case class StockItemData(
                            id: Int,
                            descrip: String,
                            deplId: Int,
                            prId: Int,
                            stlId: Int,
                            prnsId: Int,
                            prnsDescrip: String,
                            prnsFechaVto: String,
                            ingreso: Double,
                            salida: Double,
                            grupo: Int,
                            orden: Int,
                            prIdKit: Int,
                            stikOrden: Int,
                            stikCantidad: Double
                          )

case class StockData(
                        id: Option[Int],
                        ids: StockIdData,
                        base: StockBaseData,
                        items: List[StockItemData]
                      )

case class StockParamsData(
                                from: String,
                                to: String,
                                docId: String,
                                sucId: String,
                                lgjId: String,
                                empId: String
                                )

object Stocks extends Controller with ProvidesUser {

  val GC = models.cairo.modules.general.C

  val stockParamsForm: Form[StockParamsData] = Form(
    mapping(
      GC.FROM -> text,
      GC.TO -> text,
      GC.DOC_ID -> text,
      GC.SUC_ID -> text,
      GC.LGJ_ID -> text,
      GC.EMP_ID -> text
    )(StockParamsData.apply)(StockParamsData.unapply)
  )

  val stockIdFields = List(GC.DOC_ID, C.ST_NUMERO, C.ST_NRODOC)

  val stockBaseFields = List(C.ST_DESCRIP, C.ST_FECHA)

  val stockItemData = List(C.STI_ID, C.STI_DESCRIP, GC.PR_ID, GC.PRNS_ID, C.STI_INGRESO, C.STI_SALIDA, C.STI_GRUPO, C.STI_ORDEN)

  val stockForm: Form[StockData] = Form(
    mapping(
      "id" -> optional(number),
      C.STOCK_ID -> mapping(
        GC.DOC_ID -> number,
        C.ST_NUMERO -> number,
        C.ST_NRODOC -> text)
        (StockIdData.apply)(StockIdData.unapply),
      C.STOCK_BASE -> mapping(
        C.ST_DESCRIP -> text,
        C.ST_FECHA -> text,
        GC.DEPL_ID_ORIGEN -> number,
        GC.DEPL_ID_DESTINO -> number,
        GC.LGJ_ID -> number,
        GC.SUC_ID -> number
      )
      (StockBaseData.apply)(StockBaseData.unapply),
      C.STOCK_ITEM_TMP -> Forms.list[StockItemData](
        mapping(
          C.STI_ID -> number,
          C.STI_DESCRIP -> text,
          GC.DEPL_ID -> number,
          GC.PR_ID -> number,
          GC.STL_ID -> number,
          GC.PRNS_ID -> number,
          GC.PRNS_DESCRIP -> text,
          GC.PRNS_FECHA_VTO -> text,
          C.STI_INGRESO -> of(Global.doubleFormat),
          C.STI_SALIDA -> of(Global.doubleFormat),
          C.STI_GRUPO -> number,
          C.STI_ORDEN -> number,
          GC.PR_ID_KIT -> number,
          C.STIK_ORDEN -> number,
          C.STIK_CANTIDAD -> of(Global.doubleFormat))
        (StockItemData.apply)(StockItemData.unapply)
      )
    )(StockData.apply)(StockData.unapply)
  )

  implicit val stockParamsWrites = new Writes[StockParams] {
    def writes(stockParams: StockParams) = Json.obj(
      GC.FROM -> Json.toJson(stockParams.from),
      GC.TO -> Json.toJson(stockParams.to),
      GC.DOC_ID -> Json.toJson(stockParams.docId),
      GC.DOC_NAME -> Json.toJson(stockParams.docName),
      GC.SUC_ID -> Json.toJson(stockParams.sucId),
      GC.SUC_NAME -> Json.toJson(stockParams.sucName),
      GC.LGJ_ID -> Json.toJson(stockParams.lgjId),
      GC.LGJ_CODE -> Json.toJson(stockParams.lgjCode),
      GC.EMP_ID -> Json.toJson(stockParams.empId),
      GC.EMP_NAME -> Json.toJson(stockParams.empName)
    )
  }

  implicit val stockWrites = new Writes[Stock] {
    def writes(stock: Stock) = Json.obj(
      "id" -> Json.toJson(stock.id),
      C.ST_ID -> Json.toJson(stock.id),

      GC.DOC_ID -> Json.toJson(stock.ids.docId),
      GC.DOC_NAME -> Json.toJson(stock.ids.docName),
      C.ST_NRODOC -> Json.toJson(stock.ids.nroDoc),
      C.ST_NUMERO -> Json.toJson(stock.ids.numero),
      C.ST_FECHA -> Json.toJson(stock.base.fecha),
      C.ST_DESCRIP -> Json.toJson(stock.base.descrip),
      GC.DEPL_ID_ORIGEN -> Json.toJson(stock.base.deplIdOrigen),
      GC.DEPL_NAME_ORIGEN -> Json.toJson(stock.base.deplNameOrigen),
      GC.DEPL_ID_DESTINO -> Json.toJson(stock.base.deplIdDestino),
      GC.DEPL_NAME_DESTINO -> Json.toJson(stock.base.deplNameDestino),
      GC.SUC_ID -> Json.toJson(stock.base.sucId),
      GC.SUC_NAME -> Json.toJson(stock.base.sucName),
      GC.LGJ_ID -> Json.toJson(stock.base.lgjId),
      GC.LGJ_CODE -> Json.toJson(stock.base.lgjCode),


      GC.DOCT_ID -> Json.toJson(stock.references.doctId),
      C.DOCT_ID_CLIENTE -> Json.toJson(stock.references.doctIdCliente),
      C.ID_CLIENTE -> Json.toJson(stock.references.idCliente),
      C.DOC_CLIENTE -> Json.toJson(stock.references.docCliente),
      GC.TA_MASCARA -> Json.toJson(stock.references.taMascara),
      GC.TA_PROPUESTO -> Json.toJson(stock.references.taPropuesto),

      GC.EDITABLE -> Json.toJson(stock.references.editable),
      GC.EDIT_MSG -> Json.toJson(stock.references.editMsg),

      // Items
      "items" -> Json.toJson(writeStockItems(stock.items.items)),
      "serialNumbers" -> Json.toJson(writeStockItemSeries(stock.items.series)),
      "kitDefinitions" -> Json.toJson(writeStockItemKits(stock.items.kits))
    )
    def stockItemWrites(i: StockItem) = Json.obj(
      C.STI_ID -> Json.toJson(i.id),
      C.STI_DESCRIP -> Json.toJson(i.descrip),
      GC.DEPL_ID -> Json.toJson(i.deplId),
      GC.PR_ID -> Json.toJson(i.prId),
      GC.PR_NAME_COMPRA -> Json.toJson(i.prNameCompra),
      GC.PR_LLEVA_NRO_LOTE -> Json.toJson(i.prHasPartNumber),
      GC.PR_LLEVA_NRO_SERIE -> Json.toJson(i.prHasSerial),
      GC.PR_ES_KIT -> Json.toJson(i.prIsKit),
      GC.UN_NAME -> Json.toJson(i.unName),
      GC.STL_ID -> Json.toJson(i.stlId),
      GC.STL_CODE -> Json.toJson(i.stlCode),

      C.STI_SALIDA -> Json.toJson(i.salida),
      C.STI_GRUPO -> Json.toJson(i.grupo),
      C.STI_ORDEN -> Json.toJson(i.orden)
    )
    def stockItemSerieWrites(i: StockItemSerie) = Json.obj(
      C.STI_GRUPO -> Json.toJson(i.stiGroup),
      GC.PRNS_ID -> Json.toJson(i.id),
      GC.PRNS_CODE -> Json.toJson(i.code),
      GC.PRNS_DESCRIP -> Json.toJson(i.descrip),
      GC.PRNS_FECHA_VTO -> Json.toJson(i.fechaVto),
      GC.PR_ID -> Json.toJson(i.prId),
      GC.PR_NAME_COMPRA -> Json.toJson(i.prNameCompra)
    )
    def stockItemKitWrites(p: StockItemKit) = Json.obj(
      GC.PR_ID -> Json.toJson(p.id),
      GC.PR_NAME_VENTA -> Json.toJson(p.name),
      GC.PRK_CANTIDAD -> Json.toJson(p.amount),
      GC.PR_LLEVA_NRO_SERIE -> Json.toJson(p.hasSerial)
    )
    def writeStockItems(items: List[StockItem]) = items.map(item => stockItemWrites(item))
    def writeStockItemSeries(items: List[StockItemSerie]) = items.map(item => stockItemSerieWrites(item))
    def writeStockItemKits(items: List[StockItemKit]) = items.map(item => stockItemKitWrites(item))
  }

  def get(id: Int) = GetAction { implicit request =>
    LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.LIST_STOCK), { user =>
      Ok(Json.toJson(Stock.get(user, id)))
    })
  }

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //
  // this functions convert the plain JSON received in CREATE and UPDATE into a StockData structure
  //
  // because the limitation to 18 fields in case class used for FORM mapping we have grouped the fields
  // in Stock/Data, StockItem/Data, etc
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

      // groups for StockItemData
      //
      val stockItem = Global.preprocessFormParams(stockItemData, "", params)

      JsObject((stockItem).toSeq)
    }

    def preprocessItemsParam(items: JsValue, group: String): Map[String, JsValue] = items match {
      case JsArray(arr) => Map(group -> JsArray(arr.map(preprocessItemParam(_))))
      case _ => Map.empty
    }

    val params = Global.getParamsFromJsonRequest

    // groups for StockData
    //
    val stockId = Global.preprocessFormParams(List("id"), "", params)
    val stockIdGroup = Global.preprocessFormParams(stockIdFields, C.STOCK_ID, params)
    val stockBaseGroup = Global.preprocessFormParams(stockBaseFields, C.STOCK_BASE, params)

    // items
    //
    val itemsInfo = getJsValueAsMap(Global.getParamsJsonRequestFor(C.STOCK_ITEM_TMP, params))
    val itemRows = Global.getParamsJsonRequestFor(GC.ITEMS, itemsInfo)
    val stockItems = preprocessItemsParam(itemRows.head._2, C.STOCK_ITEM_TMP)

    JsObject((stockId ++ stockIdGroup ++ stockBaseGroup ++ stockItems).toSeq)
  }
  //
  //
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  def getItems(items: List[StockItemData]): List[StockItem] = {
    items.map(item => {
      StockItem(
        item.id,
        item.descrip,
        item.deplId,
        item.prId,
        item.stlId,
        item.prnsId,
        item.prnsDescrip,
        DateFormatter.parse(item.prnsFechaVto),
        item.ingreso,
        item.salida,
        item.grupo,
        item.orden,
        item.prIdKit,
        item.stikOrden,
        item.stikCantidad
      )
    })
  }

  def getStockItems(stock: StockData): StockItems = {
    StockItems(
      getItems(stock.items), List(), List()
    )
  }

  def getStock(stock: StockData, id: Int): Stock = {
    Stock(
      id,
      StockId(
        stock.ids.docId,
        stock.ids.numero,
        stock.ids.nroDoc),
      StockBase(
        DateFormatter.parse(stock.base.fecha),
        stock.base.descrip,
        stock.base.deplIdOrigen,
        stock.base.deplIdDestino,
        stock.base.sucId,
        stock.base.lgjId
      ),
      Stock.emptyStockReferences,
      getStockItems(stock)
    )
  }

  def update(id: Int) = PostAction { implicit request =>
    Logger.debug("in Stocks.update")

    stockForm.bind(preprocessParams).fold(
      formWithErrors => {
        Logger.debug(s"invalid form: ${formWithErrors.toString}")
        BadRequest
      },
      stock => {
        Logger.debug(s"form: ${stock.toString}")
        LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.EDIT_STOCK), { user =>
          try {
            Ok(
              Json.toJson(
                Stock.update(user,
                  getStock(stock, id)
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
    Logger.debug("in Stocks.create")
    stockForm.bind(preprocessParams).fold(
      formWithErrors => {
        Logger.debug(s"invalid form: ${formWithErrors.toString}")
        BadRequest
      },
      stock => {
        Logger.debug(s"form: ${stock.toString}")
        LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.NEW_STOCK), { user =>
          try {
            Ok(
              Json.toJson(
                Stock.create(user,
                  getStock(stock, DBHelper.NoId)
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
    Logger.debug("in Stocks.delete")
    LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.DELETE_STOCK), { user =>
      try {
        Stock.delete(user, id)
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
            docId: Option[String],
            sucId: Option[String],
            lgjId: Option[String],
            empId: Option[String]
    ) = GetAction { implicit request =>
    LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.LIST_STOCK), { user =>
      Ok(
        Json.toJson(
          Recordset.getAsJson(
            Stock.list(
              user,
              DateFormatter.parse(from.getOrElse("")), DateFormatter.parse(to.getOrElse("")),
              docId, sucId, lgjId, empId))))
    })
  }

  def parameters = GetAction { implicit request =>
    LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.LIST_STOCK), { user =>
      Ok(Json.toJson(Stock.loadParams(user)))
    })
  }

  def saveParameters = PostAction { implicit request =>
    Logger.debug("in Stocks.saveParameters")
    stockParamsForm.bindFromRequest.fold(
      formWithErrors => {
        Logger.debug(s"invalid form: ${formWithErrors.toString}")
        BadRequest
      },
      stockParams => {
        Logger.debug(s"form: ${stockParams.toString}")
        LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.LIST_STOCK), { user =>
          Ok(
            Json.toJson(
              Stock.saveParams(user,
                StockParams(
                    stockParams.from,
                    stockParams.to,
                    stockParams.docId,
                    stockParams.sucId,
                    stockParams.lgjId,
                    stockParams.empId
                )
              )
            )
          )
        })
      }
    )
  }

  def notes(id: Int) = GetAction { implicit request =>
    LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.LIST_STOCK), { user =>
      Ok(Json.toJson(""))
    })
  }
}