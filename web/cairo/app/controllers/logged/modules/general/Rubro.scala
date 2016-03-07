package controllers.logged.modules.general

import controllers._
import play.api.mvc._
import play.api.data._
import play.api.data.Forms._
import actions._
import play.api.Logger
import play.api.libs.json._
import models.cairo.modules.general._
import models.cairo.system.security.CairoSecurity
import models.cairo.system.database.DBHelper


case class RubroTableData (
                            rubtId1: Int,
                            rubtId2: Int,
                            rubtId3: Int,
                            rubtId4: Int,
                            rubtId5: Int,
                            rubtId6: Int,
                            rubtId7: Int,
                            rubtId8: Int,
                            rubtId9: Int,
                            rubtId10: Int
                            )

case class RubroItemData(
                          rubtiId1: Int,
                          rubtiId2: Int,
                          rubtiId3: Int,
                          rubtiId4: Int,
                          rubtiId5: Int,
                          rubtiId6: Int,
                          rubtiId7: Int,
                          rubtiId8: Int,
                          rubtiId9: Int,
                          rubtiId10: Int
                          )

case class RubroData(
                      id: Option[Int],
                      name: String,
                      code: String,
                      active: Boolean,
                      esCriterio: Boolean,
                      descrip: String,
                      tables: RubroTableData,
                      items: RubroItemData
                      )

object Rubros extends Controller with ProvidesUser {

  val rubroIdFields = List("id", C.RUB_NAME, C.RUB_CODE, DBHelper.ACTIVE, C.RUB_ES_CRITERIO, C.RUB_DESCRIP)

  val rubroTableFields = List(C.RUBT_ID_1, C.RUBT_ID_2, C.RUBT_ID_3, C.RUBT_ID_4, C.RUBT_ID_5, C.RUBT_ID_6,
    C.RUBT_ID_7, C.RUBT_ID_8, C.RUBT_ID_9, C.RUBT_ID_10)

  val rubroItemFields = List(C.RUBTI_ID_1, C.RUBTI_ID_2, C.RUBTI_ID_3, C.RUBTI_ID_4, C.RUBTI_ID_5, C.RUBTI_ID_6,
    C.RUBTI_ID_7, C.RUBTI_ID_8, C.RUBTI_ID_9, C.RUBTI_ID_10)
  
  val rubroForm = Form(
    mapping(
      "id" -> optional(number),
      C.RUB_NAME -> nonEmptyText,
      C.RUB_CODE -> text,
      DBHelper.ACTIVE -> boolean,
      C.RUB_ES_CRITERIO -> boolean,
      C.RUB_DESCRIP -> text,
      C.RUBRO_TABLES -> mapping(
        C.RUBT_ID_1 -> number,
        C.RUBT_ID_2 -> number,
        C.RUBT_ID_3 -> number,
        C.RUBT_ID_4 -> number,
        C.RUBT_ID_5 -> number,
        C.RUBT_ID_6 -> number,
        C.RUBT_ID_7 -> number,
        C.RUBT_ID_8 -> number,
        C.RUBT_ID_9 -> number,
        C.RUBT_ID_10 -> number)(RubroTableData.apply)(RubroTableData.unapply),
      C.RUBRO_ITEMS -> mapping(
        C.RUBTI_ID_1 -> number,
        C.RUBTI_ID_2 -> number,
        C.RUBTI_ID_3 -> number,
        C.RUBTI_ID_4 -> number,
        C.RUBTI_ID_5 -> number,
        C.RUBTI_ID_6 -> number,
        C.RUBTI_ID_7 -> number,
        C.RUBTI_ID_8 -> number,
        C.RUBTI_ID_9 -> number,
        C.RUBTI_ID_10 -> number)(RubroItemData.apply)(RubroItemData.unapply)
    )(RubroData.apply)(RubroData.unapply))

  implicit val rubroWrites = new Writes[Rubro] {
    def writes(rubro: Rubro) = Json.obj(
      "id" -> Json.toJson(rubro.id),
      C.RUB_ID -> Json.toJson(rubro.id),
      C.RUB_NAME -> Json.toJson(rubro.name),
      C.RUB_CODE -> Json.toJson(rubro.code),
      DBHelper.ACTIVE -> Json.toJson(rubro.active),
      C.RUB_ES_CRITERIO -> Json.toJson(rubro.esCriterio),
      C.RUB_DESCRIP -> Json.toJson(rubro.descrip),

      C.RUBT_ID_1 -> Json.toJson(rubro.tables.rubtId1),
      C.RUBT_NAME_1 -> Json.toJson(rubro.tables.rubtName1),
      C.RUBTI_ID_1 -> Json.toJson(rubro.items.rubtiId1),
      C.RUBTI_NAME_1 -> Json.toJson(rubro.items.rubtiName1),

      C.RUBT_ID_2 -> Json.toJson(rubro.tables.rubtId2),
      C.RUBT_NAME_2 -> Json.toJson(rubro.tables.rubtName2),
      C.RUBTI_ID_2 -> Json.toJson(rubro.items.rubtiId2),
      C.RUBTI_NAME_2 -> Json.toJson(rubro.items.rubtiName2),

      C.RUBT_ID_3 -> Json.toJson(rubro.tables.rubtId3),
      C.RUBT_NAME_3 -> Json.toJson(rubro.tables.rubtName3),
      C.RUBTI_ID_3 -> Json.toJson(rubro.items.rubtiId3),
      C.RUBTI_NAME_3 -> Json.toJson(rubro.items.rubtiName3),

      C.RUBT_ID_4 -> Json.toJson(rubro.tables.rubtId4),
      C.RUBT_NAME_4 -> Json.toJson(rubro.tables.rubtName4),
      C.RUBTI_ID_4 -> Json.toJson(rubro.items.rubtiId4),
      C.RUBTI_NAME_4 -> Json.toJson(rubro.items.rubtiName4),

      C.RUBT_ID_5 -> Json.toJson(rubro.tables.rubtId5),
      C.RUBT_NAME_5 -> Json.toJson(rubro.tables.rubtName5),
      C.RUBTI_ID_5 -> Json.toJson(rubro.items.rubtiId5),
      C.RUBTI_NAME_5 -> Json.toJson(rubro.items.rubtiName5),

      C.RUBT_ID_6 -> Json.toJson(rubro.tables.rubtId6),
      C.RUBT_NAME_6 -> Json.toJson(rubro.tables.rubtName6),
      C.RUBTI_ID_6 -> Json.toJson(rubro.items.rubtiId6),
      C.RUBTI_NAME_6 -> Json.toJson(rubro.items.rubtiName6),

      C.RUBT_ID_7 -> Json.toJson(rubro.tables.rubtId7),
      C.RUBT_NAME_7 -> Json.toJson(rubro.tables.rubtName7),
      C.RUBTI_ID_7 -> Json.toJson(rubro.items.rubtiId7),
      C.RUBTI_NAME_7 -> Json.toJson(rubro.items.rubtiName7),

      C.RUBT_ID_8 -> Json.toJson(rubro.tables.rubtId8),
      C.RUBT_NAME_8 -> Json.toJson(rubro.tables.rubtName8),
      C.RUBTI_ID_8 -> Json.toJson(rubro.items.rubtiId8),
      C.RUBTI_NAME_8 -> Json.toJson(rubro.items.rubtiName8),

      C.RUBT_ID_9 -> Json.toJson(rubro.tables.rubtId9),
      C.RUBT_NAME_9 -> Json.toJson(rubro.tables.rubtName9),
      C.RUBTI_ID_9 -> Json.toJson(rubro.items.rubtiId9),
      C.RUBTI_NAME_9 -> Json.toJson(rubro.items.rubtiName9),

      C.RUBT_ID_10 -> Json.toJson(rubro.tables.rubtId10),
      C.RUBT_NAME_10 -> Json.toJson(rubro.tables.rubtName10),
      C.RUBTI_ID_10 -> Json.toJson(rubro.items.rubtiId10),
      C.RUBTI_NAME_10 -> Json.toJson(rubro.items.rubtiName10)
    )
  }

  def get(id: Int) = GetAction { implicit request =>
    LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.LIST_RUBRO), { user =>
      Ok(Json.toJson(Rubro.get(user, id)))
    })
  }

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //
  // this functions convert the plain JSON received in CREATE and UPDATE into a RubroData structure
  //
  // because the limitation to 18 fields in case class used for FORM mapping we have grouped the fields
  // in Rubro/Table and Rubro/Item, etc
  //
  // the below routines group a flat JSON and in some cases rename the name of the fields or move
  // fields to the parent node in the JSON structure to match the case class
  //
  private def preprocessParams(implicit request:Request[AnyContent]): JsObject = {

    val params = Global.getParamsFromJsonRequest

    // groups for rubroData
    //
    val rubroId = Global.preprocessFormParams(rubroIdFields, "", params)
    val rubroTableGroup = Global.preprocessFormParams(rubroTableFields, C.RUBRO_TABLES, params)
    val rubroItemGroup = Global.preprocessFormParams(rubroItemFields, C.RUBRO_ITEMS, params)

    JsObject((rubroId ++ rubroTableGroup ++ rubroItemGroup).toSeq)
  }
  //
  //
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  def getRubro(rubro: RubroData, id: Int): Rubro = {
    Rubro(
      id,
      rubro.name,
      rubro.code,
      rubro.active,
      rubro.esCriterio,
      rubro.descrip,
      RubroTables(
        rubro.tables.rubtId1,
        rubro.tables.rubtId2,
        rubro.tables.rubtId3,
        rubro.tables.rubtId4,
        rubro.tables.rubtId5,
        rubro.tables.rubtId6,
        rubro.tables.rubtId7,
        rubro.tables.rubtId8,
        rubro.tables.rubtId9,
        rubro.tables.rubtId10
      ),
      RubroItems(
        rubro.items.rubtiId1,
        rubro.items.rubtiId2,
        rubro.items.rubtiId3,
        rubro.items.rubtiId4,
        rubro.items.rubtiId5,
        rubro.items.rubtiId6,
        rubro.items.rubtiId7,
        rubro.items.rubtiId8,
        rubro.items.rubtiId9,
        rubro.items.rubtiId10
      )
    )
  }

  def update(id: Int) = PostAction { implicit request =>
    Logger.debug("in Rubros.update")
    rubroForm.bind(preprocessParams).fold(
      formWithErrors => {
        Logger.debug(s"invalid form: ${formWithErrors.toString}")
        BadRequest
      },
      rubro => {
        Logger.debug(s"form: ${rubro.toString}")
        LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.EDIT_RUBRO), { user =>
          Ok(
            Json.toJson(
              Rubro.update(user,
                getRubro(rubro, id)
              )
            )
          )
        })
      }
    )
  }

  def create = PostAction { implicit request =>
    Logger.debug("in Rubros.create")
    rubroForm.bind(preprocessParams).fold(
      formWithErrors => {
        Logger.debug(s"invalid form: ${formWithErrors.toString}")
        BadRequest
      },
      rubro => {
        Logger.debug(s"form: ${rubro.toString}")
        LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.NEW_RUBRO), { user =>
          Ok(
            Json.toJson(
              Rubro.create(user,
                getRubro(rubro, DBHelper.NoId)
              )
            )
          )
        })
      }
    )
  }

  def delete(id: Int) = PostAction { implicit request =>
    Logger.debug("in Rubros.delete")
    LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.DELETE_RUBRO), { user =>
      Rubro.delete(user, id)
      // Backbonejs requires at least an empty json object in the response
      // if not it will call errorHandler even when we responded with 200 OK :P
      Ok(JsonUtil.emptyJson)
    })
  }

}