package models.cairo.modules.general

import java.sql.{Connection, CallableStatement, ResultSet, Types, SQLException}
import anorm.SqlParser._
import anorm._
import services.DateUtil
import services.db.DB
import models.cairo.system.database.{DBHelper, Register, Field, FieldType, SaveResult}
import play.api.Play.current
import models.domain.CompanyUser
import java.util.Date
import play.api.Logger
import play.api.libs.json._
import scala.util.control.NonFatal

case class RubroTablaItem(
                           id: Int,
                           code: String,
                           name: String,
                           descrip: String
                         )

case class RubroTabla(
                       id: Int,
                       name: String,
                       code: String,
                       active: Boolean,
                       descrip: String,

                       items: List[RubroTablaItem],

                       /* only used in save */
                       itemDeleted: String,

                       createdAt: Date,
                       updatedAt: Date,
                       updatedBy: Int) {

  def this(
            id: Int,
            name: String,
            code: String,
            active: Boolean,
            descrip: String,
            items: List[RubroTablaItem],
            itemDeleted: String) = {

    this(
      id,
      name,
      code,
      active,
      descrip,
      items,
      itemDeleted,
      DateUtil.currentTime,
      DateUtil.currentTime,
      DBHelper.NoId)
  }

  def this(
            name: String,
            code: String,
            active: Boolean,
            descrip: String,
            items: List[RubroTablaItem]) = {

    this(
      DBHelper.NoId,
      name,
      code,
      active,
      descrip,
      items,
      "")

  }

}

object RubroTabla {

  lazy val emptyRubroTabla = RubroTabla("", "", false, "", List())

  def apply(
             id: Int,
             name: String,
             code: String,
             active: Boolean,
             descrip: String,
             items: List[RubroTablaItem],
             itemDeleted: String) = {

    new RubroTabla(
      id,
      name,
      code,
      active,
      descrip,
      items,
      itemDeleted)
  }

  def apply(
             name: String,
             code: String,
             active: Boolean,
             descrip: String,
             items: List[RubroTablaItem]) = {

    new RubroTabla(
      name,
      code,
      active,
      descrip,
      items)
  }

  private val rubroTablaParser: RowParser[RubroTabla] = {
    SqlParser.get[Int](C.RUBT_ID) ~
    SqlParser.get[String](C.RUBT_NAME) ~
    SqlParser.get[String](C.RUBT_CODE) ~
    SqlParser.get[Int](DBHelper.ACTIVE) ~
    SqlParser.get[String](C.RUBT_DESCRIP) ~
    SqlParser.get[Date](DBHelper.CREATED_AT) ~
    SqlParser.get[Date](DBHelper.UPDATED_AT) ~
    SqlParser.get[Int](DBHelper.UPDATED_BY) map {
    case
        id ~
        name ~
        code ~
        active ~
        descrip  ~
        createdAt ~
        updatedAt ~
        updatedBy =>
      RubroTabla(
        id,
        name,
        code,
        active != 0,
        descrip,
        List(),
        "",
        createdAt,
        updatedAt,
        updatedBy)
    }
  }

  private val rubroTablaItemParser: RowParser[RubroTablaItem] = {
    SqlParser.get[Int](C.RUBTI_ID) ~
    SqlParser.get[String](C.RUBTI_CODE) ~
    SqlParser.get[String](C.RUBTI_NAME) ~
    SqlParser.get[String](C.RUBTI_DESCRIP) map {
    case
        id ~
        code ~
        name ~
        descrip =>
      RubroTablaItem(
        id,
        code,
        name,
        descrip)
    }
  }

  def create(user: CompanyUser, rubroTabla: RubroTabla): RubroTabla = {
    save(user, rubroTabla, true)
  }

  def update(user: CompanyUser, rubroTabla: RubroTabla): RubroTabla = {
    save(user, rubroTabla, false)
  }

  private def save(user: CompanyUser, rubroTabla: RubroTabla, isNew: Boolean): RubroTabla = {
    def getFields = {
      List(
        Field(C.RUBT_NAME, rubroTabla.name, FieldType.text),
        Field(C.RUBT_CODE, rubroTabla.code, FieldType.text),
        Field(DBHelper.ACTIVE, (if(rubroTabla.active) 1 else 0), FieldType.boolean),
        Field(C.RUBT_DESCRIP, rubroTabla.descrip, FieldType.text)
      )
    }

    def getRubroTablaItemFields(rubroTablaItem: RubroTablaItem, rubtId: Int) = {
      List(
        Field(C.RUBT_ID, rubtId, FieldType.id),
        Field(C.RUBTI_CODE, rubroTablaItem.code, FieldType.text),
        Field(C.RUBTI_NAME, rubroTablaItem.name, FieldType.text),
        Field(C.RUBTI_DESCRIP, rubroTablaItem.descrip, FieldType.text)
      )
    }

    def throwException = {
      throw new RuntimeException(s"Error when saving ${C.RUBRO_TABLA}")
    }

    case class RubroTablaItemInfo(rubtId: Int, item: RubroTablaItem)

    def saveRubroTablaItem(itemInfo: RubroTablaItemInfo) = {
      DBHelper.save(
        user,
        Register(
          C.RUBRO_TABLA_ITEM,
          C.RUBTI_ID,
          itemInfo.item.id,
          false,
          true,
          true,
          getRubroTablaItemFields(itemInfo.item, itemInfo.rubtId)),
        itemInfo.item.id == DBHelper.NewId
      ) match {
        case SaveResult(true, id) => true
        case SaveResult(false, id) => throwException
      }
    }

    def saveRubroTablaItems(rubtId: Int) = {
      DBHelper.deleteItems(user, C.RUBRO_TABLA_ITEM, C.RUBTI_ID, rubroTabla.itemDeleted, s" AND rubt_id = ${rubtId}")
      rubroTabla.items.map(item => saveRubroTablaItem(RubroTablaItemInfo(rubtId, item)))
    }

    DBHelper.saveEx(
      user,
      Register(
        C.RUBRO_TABLA,
        C.RUBT_ID,
        rubroTabla.id,
        false,
        true,
        true,
        getFields),
      isNew,
      C.RUBT_CODE
    ) match {
      case SaveResult(true, id) => {
        saveRubroTablaItems(id)
        load(user, id).getOrElse(throwException)
      }
      case SaveResult(false, id) => throwException
    }
  }

  def load(user: CompanyUser, id: Int): Option[RubroTabla] = {
    loadWhere(user, s"${C.RUBT_ID} = {id}", 'id -> id)
  }

  def loadWhere(user: CompanyUser, where: String, args : scala.Tuple2[scala.Any, anorm.ParameterValue[_]]*) = {
    DB.withConnection(user.database.database) { implicit connection =>
      SQL(s"SELECT * FROM ${C.RUBRO_TABLA} WHERE $where")
        .on(args: _*)
        .as(rubroTablaParser.singleOpt)
    }
  }

  def loadRubroTablaItems(user: CompanyUser, id: Int): List[RubroTablaItem] = {
    loadRubroTablaItemsWhere(user, s"${C.RUBT_ID} = {id}", 'id -> id)
  }

  def loadRubroTablaItemsWhere(user: CompanyUser, where: String, args : scala.Tuple2[scala.Any, anorm.ParameterValue[_]]*) = {
    DB.withConnection(user.database.database) { implicit connection =>
      SQL(s"SELECT * FROM ${C.RUBRO_TABLA_ITEM} WHERE $where ORDER BY RUBTI_NOMBRE")
        .on(args: _*)
        .as(rubroTablaItemParser.*)
    }
  }

  def delete(user: CompanyUser, id: Int) = {
    DB.withConnection(user.database.database) { implicit connection =>
      try {
        SQL(s"DELETE FROM ${C.RUBRO_TABLA} WHERE ${C.RUBT_ID} = {id}")
          .on('id -> id)
          .executeUpdate
      } catch {
        case NonFatal(e) => {
          Logger.error(s"can't delete a ${C.RUBRO_TABLA}. ${C.RUBT_ID} id: $id. Error ${e.toString}")
          throw e
        }
      }
    }
  }

  def get(user: CompanyUser, id: Int): RubroTabla = {
    load(user, id) match {
      case Some(p) => {
        RubroTabla(
          p.id,
          p.name,
          p.code,
          p.active,
          p.descrip,
          loadRubroTablaItems(user, id),
          "")
      }
      case None => emptyRubroTabla
    }
  }
}