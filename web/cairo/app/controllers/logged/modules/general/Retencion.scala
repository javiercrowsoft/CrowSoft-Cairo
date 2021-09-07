package controllers.logged.modules.general

import controllers._
import play.api.mvc._
import play.api.data._
import play.api.data.Forms._
import actions._
import controllers.Global.doubleFormat
import play.api.Logger
import play.api.libs.json._
import models.cairo.modules.general._
import models.cairo.system.security.CairoSecurity
import models.cairo.system.database.DBHelper

import Global.{getJsValueAsMap, getParamsJsonRequestFor, preprocessFormParams, doubleFormat, getParamsFromJsonRequest}

case class RetencionProvinciaData(
                               id: Int,
                               proId: Int
                             )

case class RetencionCategoriaFiscalData(
                                     id: Int,
                                     catfId: Int,
                                     base: Int
                                   )

case class RetencionItemsData(
                           items: List[RetencionItem],
                           provincias: List[RetencionProvinciaData],
                           categoriasFiscales: List[RetencionCategoriaFiscalData],

                           /* only used in save */
                           itemDeleted: String,
                           provinciaDeleted: String,
                           categoriaFiscalDeleted: String
                         )


case class RetencionData(
                              id: Option[Int],
                              name: String,
                              code: String,
                              active: Boolean,
                              rettId: Int,
                              importeMinimo: Double,
                              esIibb: Boolean,
                              regimenSicore: String,
                              taId: Int,
                              ibcId: Int,
                              acumulaPor: Int,
                              tipoMinimo: Int,
                              descrip: String,
                              items: RetencionItemsData
                            )

object Retenciones extends Controller with ProvidesUser {
  val retencionFields = List("id", C.RET_NAME, C.RET_CODE, DBHelper.ACTIVE, C.RETT_ID, C.RET_IMPORTE_MINIMO,
                                  C.RET_ES_IIBB, C.RET_REGIMEN_SICORE, C.TA_ID, C.IBC_ID, C.RET_ACUMULA_POR,
                                  C.RET_TIPO_MINIMO, C.RET_DESCRIP)

  val retencionItemFields = List(C.RETI_ID, C.RETI_IMPORTE_DESDE, C.RETI_IMPORTE_HASTA, C.RETI_PORCENTAJE, C.RETI_IMPORTE_FIJO)
  val retencionProvinciaFields = List(C.RET_PRO_ID, C.PRO_ID)
  val retencionCatFiscalFields = List(C.RET_CATF_ID, C.CATF_ID, C.RET_CATF_BASE)

  val RetencionForm = Form(
    mapping(
      "id" -> optional(number),
      C.RET_NAME -> nonEmptyText,
      C.RET_CODE -> text,
      DBHelper.ACTIVE -> boolean,
      C.RETT_ID -> number,
      C.RET_IMPORTE_MINIMO -> of(doubleFormat),
      C.RET_ES_IIBB -> boolean,
      C.RET_REGIMEN_SICORE -> text,
      C.TA_ID -> number,
      C.IBC_ID -> number,
      C.RET_ACUMULA_POR -> number,
      C.RET_TIPO_MINIMO -> number,
      C.RET_DESCRIP -> text,
      C.RETENCION_ITEMS -> mapping(
        C.RETENCION_ITEM -> Forms.list[RetencionItem](
          mapping(
            C.RETI_ID -> number,
            C.RETI_IMPORTE_DESDE -> of(doubleFormat),
            C.RETI_IMPORTE_HASTA -> of(doubleFormat),
            C.RETI_PORCENTAJE -> of(doubleFormat),
            C.RETI_IMPORTE_FIJO -> of(doubleFormat)
          )(RetencionItem.apply)(RetencionItem.unapply)
        ),
        C.RETENCION_PROVINCIA -> Forms.list[RetencionProvinciaData](
          mapping(
            C.RET_PRO_ID -> number,
            C.PRO_ID -> number
          )(RetencionProvinciaData.apply)(RetencionProvinciaData.unapply)
        ),
        C.RETENCION_CATEGORIA_FISCAL -> Forms.list[RetencionCategoriaFiscalData](
          mapping(
            C.RET_CATF_ID -> number,
            C.CATF_ID -> number,
            C.RET_CATF_BASE -> number
          )(RetencionCategoriaFiscalData.apply)(RetencionCategoriaFiscalData.unapply)
        ),
        C.RETENCION_ITEM_DELETED -> text,
        C.RETENCION_PROVINCIA_DELETED -> text,
        C.RETENCION_CATEGORIA_FISCAL_DELETED -> text
      )(RetencionItemsData.apply)(RetencionItemsData.unapply)
  )(RetencionData.apply)(RetencionData.unapply))

  implicit val RetencionWrites = new Writes[Retencion] {
    def writes(retencion: Retencion) = Json.obj(
      "id" -> Json.toJson(retencion.id),
      C.RET_ID -> Json.toJson(retencion.id),
      C.RET_NAME -> Json.toJson(retencion.name),
      C.RET_CODE -> Json.toJson(retencion.code),
      DBHelper.ACTIVE -> Json.toJson(retencion.active),
      C.RETT_ID -> Json.toJson(retencion.rettId),
      C.RETT_NAME -> Json.toJson(retencion.rettName),
      C.RET_IMPORTE_MINIMO -> Json.toJson(retencion.importeMinimo),
      C.RET_ES_IIBB -> Json.toJson(retencion.esIibb),
      C.RET_REGIMEN_SICORE -> Json.toJson(retencion.regimenSicore),
      C.TA_ID -> Json.toJson(retencion.taId),
      C.TA_NAME -> Json.toJson(retencion.taName),
      C.IBC_ID -> Json.toJson(retencion.ibcId),
      C.IBC_NAME -> Json.toJson(retencion.ibcName),
      C.RET_ACUMULA_POR -> Json.toJson(retencion.acumulaPor),
      C.RET_TIPO_MINIMO -> Json.toJson(retencion.tipoMinimo),
      C.RET_DESCRIP -> Json.toJson(retencion.descrip),

      // Items
      "items" -> Json.toJson(writeItems(retencion.items.items)),
      "provincias" -> Json.toJson(writeProvincias(retencion.items.provincias)),
      "categoriasFiscales" -> Json.toJson(writeCategoriasFiscales(retencion.items.categoriasFiscales))
    )
    def itemWrites(p: RetencionItem) = Json.obj(
      C.RETI_ID -> Json.toJson(p.id),
      C.RETI_IMPORTE_DESDE -> Json.toJson(p.importeDesde),
      C.RETI_IMPORTE_HASTA -> Json.toJson(p.importeHasta),
      C.RETI_PORCENTAJE -> Json.toJson(p.porcentaje),
      C.RETI_IMPORTE_FIJO -> Json.toJson(p.importeFijo)
    )
    def provinciaWrites(p: RetencionProvincia) = Json.obj(
      C.RET_PRO_ID -> Json.toJson(p.id),
      C.PRO_ID -> Json.toJson(p.proId),
      C.PRO_NAME -> Json.toJson(p.proName)
    )
    def categoriaFiscalWrites(p: RetencionCategoriaFiscal) = Json.obj(
      C.RET_CATF_ID -> Json.toJson(p.id),
      C.CATF_ID -> Json.toJson(p.catfId),
      C.CATF_NAME -> Json.toJson(p.catfName),
      C.RET_CATF_BASE -> Json.toJson(p.base)
    )
    def writeItems(items: List[RetencionItem]) = items.map(item => itemWrites(item))
    def writeProvincias(items: List[RetencionProvincia]) = items.map(item => provinciaWrites(item))
    def writeCategoriasFiscales(items: List[RetencionCategoriaFiscal]) = items.map(item => categoriaFiscalWrites(item))
  }

  def get(id: Int) = GetAction { implicit request =>
    LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.LIST_RETENCION), { user =>
      Ok(Json.toJson(Retencion.get(user, id)))
    })
  }

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //
  // this functions convert the plain JSON received in CREATE and UPDATE into a RetencionData structure
  //
  // because the limitation to 18 fields in case class used for FORM mapping we have grouped the fields
  // in Retencion/Data, RetencionItem/Data, etc
  //
  // the below routines group a flat JSON and in some cases rename the name of the fields or move
  // fields to the parent node in the JSON structure to match the case class
  //

  private def preprocessParams(implicit request:Request[AnyContent]): JsObject = {

    def preprocessItemParam(field: JsValue) = {
      val params = field.as[Map[String, JsValue]]
      JsObject(preprocessFormParams(retencionItemFields, "", params).toSeq)
    }

    def preprocessItemsParam(items: JsValue, group: String): Map[String, JsValue] = items match {
      case JsArray(arr) => Map(group -> JsArray(arr.map(preprocessItemParam(_))))
      case _ => Map.empty
    }

    def preprocessProvinciaParam(field: JsValue) = {
      val params = field.as[Map[String, JsValue]]
      JsObject(preprocessFormParams(retencionProvinciaFields, "", params).toSeq)
    }

    def preprocessProvinciasParam(items: JsValue, group: String): Map[String, JsValue] = items match {
      case JsArray(arr) => Map(group -> JsArray(arr.map(preprocessProvinciaParam(_))))
      case _ => Map.empty
    }

    def preprocessCatFiscalParam(field: JsValue) = {
      val params = field.as[Map[String, JsValue]]
      JsObject(preprocessFormParams(retencionCatFiscalFields, "", params).toSeq)
    }

    def preprocessCatFiscalesParam(items: JsValue, group: String): Map[String, JsValue] = items match {
      case JsArray(arr) => Map(group -> JsArray(arr.map(preprocessCatFiscalParam(_))))
      case _ => Map.empty
    }

    val params = getParamsFromJsonRequest

    // groups for productoData
    //
    val retencion = preprocessFormParams(retencionFields, "", params)

    // items
    //
    val itemsInfo = getJsValueAsMap(getParamsJsonRequestFor(C.RETENCION_ITEM, params))
    val itemRows = getParamsJsonRequestFor(C.ITEMS, itemsInfo)
    val itemDeleted: Map[String, JsValue] = getParamsJsonRequestFor(C.DELETED_LIST, itemsInfo).toList match {
      case Nil => Map(C.RETENCION_ITEM_DELETED -> Json.toJson(""))
      case deletedList :: t => Map(C.RETENCION_ITEM_DELETED -> Json.toJson(deletedList._2))
    }
    val retencionItems = itemRows.toList match {
      case (_: String, item: JsValue) :: _ => preprocessItemsParam(item, C.RETENCION_ITEM)
      case _ => Map(C.RETENCION_ITEM -> JsArray(List()))
    }

    // provincias
    //
    val provinciasInfo = getJsValueAsMap(getParamsJsonRequestFor(C.RETENCION_PROVINCIA, params))
    val provinciaRows = getParamsJsonRequestFor(C.ITEMS, provinciasInfo)
    val provinciaDeleted: Map[String, JsValue] = getParamsJsonRequestFor(C.DELETED_LIST, provinciasInfo).toList match {
      case Nil => Map(C.RETENCION_PROVINCIA_DELETED -> Json.toJson(""))
      case deletedList :: t => Map(C.RETENCION_PROVINCIA_DELETED -> Json.toJson(deletedList._2))
    }
    val retencionProvincias = provinciaRows.toList match {
      case (_: String, item: JsValue) :: _ => preprocessProvinciasParam(item, C.RETENCION_PROVINCIA)
      case _ => Map(C.RETENCION_PROVINCIA -> JsArray(List()))
    }

    // categorias fiscales
    //
    val catFiscalesInfo = getJsValueAsMap(getParamsJsonRequestFor(C.RETENCION_CATEGORIA_FISCAL, params))
    val catFiscalRows = getParamsJsonRequestFor(C.ITEMS, catFiscalesInfo)
    val catFiscalDeleted: Map[String, JsValue] = getParamsJsonRequestFor(C.DELETED_LIST, catFiscalesInfo).toList match {
      case Nil => Map(C.RETENCION_CATEGORIA_FISCAL_DELETED -> Json.toJson(""))
      case deletedList :: t => Map(C.RETENCION_CATEGORIA_FISCAL_DELETED -> Json.toJson(deletedList._2))
    }
    val retencionCatFiscales = catFiscalRows.toList match {
      case (_: String, item: JsValue) :: _ => preprocessCatFiscalesParam(item, C.RETENCION_CATEGORIA_FISCAL)
      case _ => Map(C.RETENCION_CATEGORIA_FISCAL -> JsArray(List()))
    }

    val items = Map(C.RETENCION_ITEMS -> JsObject((
      retencionItems ++ itemDeleted ++ retencionProvincias ++ provinciaDeleted ++ retencionCatFiscales ++ catFiscalDeleted).toSeq
    ))

    JsObject((retencion ++ items).toSeq)
  }

  def getRetencionItems(retencion: RetencionItemsData): RetencionItems = {
    RetencionItems(
      retencion.items,
      retencion.provincias.map(p => RetencionProvincia(p.id, p.proId, "")),
      retencion.categoriasFiscales.map(c => RetencionCategoriaFiscal(c.id, c.catfId, "", c.base)),
      retencion.itemDeleted,
      retencion.provinciaDeleted,
      retencion.categoriaFiscalDeleted
    )
  }

  def update(id: Int) = PostAction { implicit request =>
    Logger.debug("in Retenciones.update")
    RetencionForm.bind(preprocessParams).fold(
      formWithErrors => {
        Logger.debug(s"invalid form: ${formWithErrors.toString}")
        BadRequest
      },
      retencion => {
        Logger.debug(s"form: ${retencion.toString}")
        LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.EDIT_RETENCION), { user =>
          Ok(
            Json.toJson(
              Retencion.update(user,
                Retencion(
                  id,
                  retencion.name,
                  retencion.code,
                  retencion.active,
                  retencion.rettId,
                  retencion.importeMinimo,
                  retencion.esIibb,
                  retencion.regimenSicore,
                  retencion.taId,
                  retencion.ibcId,
                  retencion.acumulaPor,
                  retencion.tipoMinimo,
                  retencion.descrip,
                  getRetencionItems(retencion.items)
                ))))
        })
      }
    )
  }

  def create = PostAction { implicit request =>
    Logger.debug("in Retenciones.create")
    RetencionForm.bind(preprocessParams).fold(
      formWithErrors => {
        Logger.debug(s"invalid form: ${formWithErrors.toString}")
        BadRequest
      },
      retencion => {
        Logger.debug(s"form: ${Retencion.toString}")
        LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.NEW_RETENCION), { user =>
          Ok(
            Json.toJson(
              Retencion.create(user,
                Retencion(
                  retencion.name,
                  retencion.code,
                  retencion.active,
                  retencion.rettId,
                  retencion.importeMinimo,
                  retencion.esIibb,
                  retencion.regimenSicore,
                  retencion.taId,
                  retencion.ibcId,
                  retencion.acumulaPor,
                  retencion.tipoMinimo,
                  retencion.descrip,
                  getRetencionItems(retencion.items)
                ))))
        })
      }
    )
  }

  def delete(id: Int) = PostAction { implicit request =>
    Logger.debug("in Retenciones.delete")
    LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.DELETE_RETENCION), { user =>
      Retencion.delete(user, id)
      // Backbonejs requires at least an empty json object in the response
      // if not it will call errorHandler even when we responded with 200 OK :P
      Ok(JsonUtil.emptyJson)
    })
  }

}

