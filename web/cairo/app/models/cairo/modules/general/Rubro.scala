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

case class RubroTables(
                        rubtId1: Int,
                        rubtName1: String,
                        rubtId2: Int,
                        rubtName2: String,
                        rubtId3: Int,
                        rubtName3: String,
                        rubtId4: Int,
                        rubtName4: String,
                        rubtId5: Int,
                        rubtName5: String,
                        rubtId6: Int,
                        rubtName6: String,
                        rubtId7: Int,
                        rubtName7: String,
                        rubtId8: Int,
                        rubtName8: String,
                        rubtId9: Int,
                        rubtName9: String,
                        rubtId10: Int,
                        rubtName10: String
                        ) {
  def this(
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
            ) = {
    this(
      rubtId1,
      "",
      rubtId2,
      "",
      rubtId3,
      "",
      rubtId4,
      "",
      rubtId5,
      "",
      rubtId6,
      "",
      rubtId7,
      "",
      rubtId8,
      "",
      rubtId9,
      "",
      rubtId10,
      ""
    )
  }
}

object RubroTables {
  
  def apply(
             rubtId1: Int,
             rubtId2: Int,
             rubtId3: Int,
             rubtId4: Int,
             rubtId5: Int,
             rubtId6: Int,
             rubtId7: Int,
             rubtId8: Int,
             rubtId9: Int,
             rubtId10: Int) = {

    new RubroTables(
      rubtId1,
      rubtId2,
      rubtId3,
      rubtId4,
      rubtId5,
      rubtId6,
      rubtId7,
      rubtId8,
      rubtId9,
      rubtId10)
  }
}

case class RubroItems(
                       rubtiId1: Int,
                       rubtiName1: String,
                       rubtiId2: Int,
                       rubtiName2: String,
                       rubtiId3: Int,
                       rubtiName3: String,
                       rubtiId4: Int,
                       rubtiName4: String,
                       rubtiId5: Int,
                       rubtiName5: String,
                       rubtiId6: Int,
                       rubtiName6: String,
                       rubtiId7: Int,
                       rubtiName7: String,
                       rubtiId8: Int,
                       rubtiName8: String,
                       rubtiId9: Int,
                       rubtiName9: String,
                       rubtiId10: Int,
                       rubtiName10: String
                       ) {
  def this(
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
            ) = {
    this(
      rubtiId1,
      "",
      rubtiId2,
      "",
      rubtiId3,
      "",
      rubtiId4,
      "",
      rubtiId5,
      "",
      rubtiId6,
      "",
      rubtiId7,
      "",
      rubtiId8,
      "",
      rubtiId9,
      "",
      rubtiId10,
      ""
    )
  }
}

object RubroItems  {

  def apply(
             rubtiId1: Int,
             rubtiId2: Int,
             rubtiId3: Int,
             rubtiId4: Int,
             rubtiId5: Int,
             rubtiId6: Int,
             rubtiId7: Int,
             rubtiId8: Int,
             rubtiId9: Int,
             rubtiId10: Int) = {

    new RubroItems(
      rubtiId1,
      rubtiId2,
      rubtiId3,
      rubtiId4,
      rubtiId5,
      rubtiId6,
      rubtiId7,
      rubtiId8,
      rubtiId9,
      rubtiId10)
  }
}

case class Rubro(
                  id: Int,
                  name: String,
                  code: String,
                  active: Boolean,
                  esCriterio: Boolean,
                  descrip: String,

                  tables: RubroTables,
                  items: RubroItems,

                  createdAt: Date,
                  updatedAt: Date,
                  updatedBy: Int) {

  def this(
            id: Int,
            name: String,
            code: String,
            active: Boolean,
            esCriterio: Boolean,
            descrip: String,
            tables: RubroTables,
            items: RubroItems) = {

    this(
      id,
      name,
      code,
      active,
      esCriterio,
      descrip,
      tables,
      items,
      DateUtil.currentTime,
      DateUtil.currentTime,
      DBHelper.NoId)
  }

  def this(
            name: String,
            code: String,
            active: Boolean,
            esCriterio: Boolean,
            descrip: String,
            tables: RubroTables,
            items: RubroItems) = {

    this(
      DBHelper.NoId,
      name,
      code,
      active,
      esCriterio,
      descrip,
      tables,
      items)

  }

}

object Rubro {

  lazy val emptyRubroTables = RubroTables(DBHelper.NoId, DBHelper.NoId, DBHelper.NoId, DBHelper.NoId, DBHelper.NoId, DBHelper.NoId,
    DBHelper.NoId, DBHelper.NoId, DBHelper.NoId, DBHelper.NoId)
  
  lazy val emptyRubroItems = RubroItems(DBHelper.NoId, DBHelper.NoId, DBHelper.NoId, DBHelper.NoId, DBHelper.NoId, DBHelper.NoId,
    DBHelper.NoId, DBHelper.NoId, DBHelper.NoId, DBHelper.NoId)

  lazy val emptyRubro = Rubro("", "", false, false, "", emptyRubroTables, emptyRubroItems)

  def apply(
             id: Int,
             name: String,
             code: String,
             active: Boolean,
             esCriterio: Boolean,
             descrip: String,
             tables: RubroTables,
             items: RubroItems) = {

    new Rubro(
      id,
      name,
      code,
      active,
      esCriterio,
      descrip,
      tables,
      items)
  }

  def apply(
             name: String,
             code: String,
             active: Boolean,
             esCriterio: Boolean,
             descrip: String,
             tables: RubroTables,
             items: RubroItems) = {

    new Rubro(
      name,
      code,
      active,
      esCriterio,
      descrip,
      tables,
      items)
  }

  private val rubroParser: RowParser[Rubro] = {
    SqlParser.get[Int](C.RUB_ID) ~
    SqlParser.get[String](C.RUB_NAME) ~
    SqlParser.get[String](C.RUB_CODE) ~
    SqlParser.get[Int](DBHelper.ACTIVE) ~
    SqlParser.get[Int](C.RUB_ES_CRITERIO) ~
    SqlParser.get[String](C.RUB_DESCRIP) ~
    SqlParser.get[Option[Int]](C.RUBT_ID_1) ~
    SqlParser.get[Option[String]](C.RUBT_NAME_1) ~
    SqlParser.get[Option[Int]](C.RUBT_ID_2) ~
    SqlParser.get[Option[String]](C.RUBT_NAME_2) ~
    SqlParser.get[Option[Int]](C.RUBT_ID_3) ~
    SqlParser.get[Option[String]](C.RUBT_NAME_3) ~
    SqlParser.get[Option[Int]](C.RUBT_ID_4) ~
    SqlParser.get[Option[String]](C.RUBT_NAME_4) ~
    SqlParser.get[Option[Int]](C.RUBT_ID_5) ~
    SqlParser.get[Option[String]](C.RUBT_NAME_5) ~
    SqlParser.get[Option[Int]](C.RUBT_ID_6) ~
    SqlParser.get[Option[String]](C.RUBT_NAME_6) ~
    SqlParser.get[Option[Int]](C.RUBT_ID_7) ~
    SqlParser.get[Option[String]](C.RUBT_NAME_7) ~
    SqlParser.get[Option[Int]](C.RUBT_ID_8) ~
    SqlParser.get[Option[String]](C.RUBT_NAME_8) ~
    SqlParser.get[Option[Int]](C.RUBT_ID_9) ~
    SqlParser.get[Option[String]](C.RUBT_NAME_9) ~
    SqlParser.get[Option[Int]](C.RUBT_ID_10) ~
    SqlParser.get[Option[String]](C.RUBT_NAME_10) ~
    SqlParser.get[Option[Int]](C.RUBTI_ID_1) ~
    SqlParser.get[Option[String]](C.RUBTI_NAME_1) ~
    SqlParser.get[Option[Int]](C.RUBTI_ID_2) ~
    SqlParser.get[Option[String]](C.RUBTI_NAME_2) ~
    SqlParser.get[Option[Int]](C.RUBTI_ID_3) ~
    SqlParser.get[Option[String]](C.RUBTI_NAME_3) ~
    SqlParser.get[Option[Int]](C.RUBTI_ID_4) ~
    SqlParser.get[Option[String]](C.RUBTI_NAME_4) ~
    SqlParser.get[Option[Int]](C.RUBTI_ID_5) ~
    SqlParser.get[Option[String]](C.RUBTI_NAME_5) ~
    SqlParser.get[Option[Int]](C.RUBTI_ID_6) ~
    SqlParser.get[Option[String]](C.RUBTI_NAME_6) ~
    SqlParser.get[Option[Int]](C.RUBTI_ID_7) ~
    SqlParser.get[Option[String]](C.RUBTI_NAME_7) ~
    SqlParser.get[Option[Int]](C.RUBTI_ID_8) ~
    SqlParser.get[Option[String]](C.RUBTI_NAME_8) ~
    SqlParser.get[Option[Int]](C.RUBTI_ID_9) ~
    SqlParser.get[Option[String]](C.RUBTI_NAME_9) ~
    SqlParser.get[Option[Int]](C.RUBTI_ID_10) ~
    SqlParser.get[Option[String]](C.RUBTI_NAME_10) ~
    SqlParser.get[Date](DBHelper.CREATED_AT) ~
    SqlParser.get[Date](DBHelper.UPDATED_AT) ~
    SqlParser.get[Int](DBHelper.UPDATED_BY) map {
    case
        id ~
        name ~
        code ~
        active ~
        esCriterio ~
        descrip ~

        rubtId1 ~
        rubtName1 ~
        rubtId2 ~
        rubtName2 ~
        rubtId3 ~
        rubtName3 ~
        rubtId4 ~
        rubtName4 ~
        rubtId5 ~
        rubtName5 ~
        rubtId6 ~
        rubtName6 ~
        rubtId7 ~
        rubtName7 ~
        rubtId8 ~
        rubtName8 ~
        rubtId9 ~
        rubtName9 ~
        rubtId10 ~
        rubtName10  ~

        rubtiId1 ~
        rubtiName1 ~
        rubtiId2 ~
        rubtiName2 ~
        rubtiId3 ~
        rubtiName3 ~
        rubtiId4 ~
        rubtiName4 ~
        rubtiId5 ~
        rubtiName5 ~
        rubtiId6 ~
        rubtiName6 ~
        rubtiId7 ~
        rubtiName7 ~
        rubtiId8 ~
        rubtiName8 ~
        rubtiId9 ~
        rubtiName9 ~
        rubtiId10 ~
        rubtiName10 ~

        createdAt ~
        updatedAt ~
        updatedBy =>
      Rubro(
        id,
        name,
        code,
        active != 0,
        esCriterio != 0,
        descrip,
        RubroTables(
          rubtId1.getOrElse(DBHelper.NoId),
          rubtName1.getOrElse(""),
          rubtId2.getOrElse(DBHelper.NoId),
          rubtName2.getOrElse(""),
          rubtId3.getOrElse(DBHelper.NoId),
          rubtName3.getOrElse(""),
          rubtId4.getOrElse(DBHelper.NoId),
          rubtName4.getOrElse(""),
          rubtId5.getOrElse(DBHelper.NoId),
          rubtName5.getOrElse(""),
          rubtId6.getOrElse(DBHelper.NoId),
          rubtName6.getOrElse(""),
          rubtId7.getOrElse(DBHelper.NoId),
          rubtName7.getOrElse(""),
          rubtId8.getOrElse(DBHelper.NoId),
          rubtName8.getOrElse(""),
          rubtId9.getOrElse(DBHelper.NoId),
          rubtName9.getOrElse(""),
          rubtId10.getOrElse(DBHelper.NoId),
          rubtName10.getOrElse("")
        ),
        RubroItems(
          rubtiId1.getOrElse(DBHelper.NoId),
          rubtiName1.getOrElse(""),
          rubtiId2.getOrElse(DBHelper.NoId),
          rubtiName2.getOrElse(""),
          rubtiId3.getOrElse(DBHelper.NoId),
          rubtiName3.getOrElse(""),
          rubtiId4.getOrElse(DBHelper.NoId),
          rubtiName4.getOrElse(""),
          rubtiId5.getOrElse(DBHelper.NoId),
          rubtiName5.getOrElse(""),
          rubtiId6.getOrElse(DBHelper.NoId),
          rubtiName6.getOrElse(""),
          rubtiId7.getOrElse(DBHelper.NoId),
          rubtiName7.getOrElse(""),
          rubtiId8.getOrElse(DBHelper.NoId),
          rubtiName8.getOrElse(""),
          rubtiId9.getOrElse(DBHelper.NoId),
          rubtiName9.getOrElse(""),
          rubtiId10.getOrElse(DBHelper.NoId),
          rubtiName10.getOrElse("")
        ),
        createdAt,
        updatedAt,
        updatedBy)
    }
  }

  def create(user: CompanyUser, rubro: Rubro): Rubro = {
    save(user, rubro, true)
  }

  def update(user: CompanyUser, rubro: Rubro): Rubro = {
    save(user, rubro, false)
  }

  private def save(user: CompanyUser, rubro: Rubro, isNew: Boolean): Rubro = {
    def getFields = {
      List(
        Field(C.RUB_NAME, rubro.name, FieldType.text),
        Field(C.RUB_CODE, rubro.code, FieldType.text),
        Field(DBHelper.ACTIVE, Register.boolToInt(rubro.active), FieldType.boolean),
        Field(C.RUB_ES_CRITERIO, Register.boolToInt(rubro.esCriterio), FieldType.boolean),
        Field(C.RUB_DESCRIP, rubro.descrip, FieldType.id),
        Field(C.RUBT_ID_1, rubro.tables.rubtId1, FieldType.id),
        Field(C.RUBTI_ID_1, rubro.items.rubtiId1, FieldType.id),
        Field(C.RUBT_ID_2, rubro.tables.rubtId2, FieldType.id),
        Field(C.RUBTI_ID_2, rubro.items.rubtiId2, FieldType.id),
        Field(C.RUBT_ID_3, rubro.tables.rubtId3, FieldType.id),
        Field(C.RUBTI_ID_3, rubro.items.rubtiId3, FieldType.id),
        Field(C.RUBT_ID_4, rubro.tables.rubtId4, FieldType.id),
        Field(C.RUBTI_ID_4, rubro.items.rubtiId4, FieldType.id),
        Field(C.RUBT_ID_5, rubro.tables.rubtId5, FieldType.id),
        Field(C.RUBTI_ID_5, rubro.items.rubtiId5, FieldType.id),
        Field(C.RUBT_ID_6, rubro.tables.rubtId6, FieldType.id),
        Field(C.RUBTI_ID_6, rubro.items.rubtiId6, FieldType.id),
        Field(C.RUBT_ID_7, rubro.tables.rubtId7, FieldType.id),
        Field(C.RUBTI_ID_7, rubro.items.rubtiId7, FieldType.id),
        Field(C.RUBT_ID_8, rubro.tables.rubtId8, FieldType.id),
        Field(C.RUBTI_ID_8, rubro.items.rubtiId8, FieldType.id),
        Field(C.RUBT_ID_9, rubro.tables.rubtId9, FieldType.id),
        Field(C.RUBTI_ID_9, rubro.items.rubtiId9, FieldType.id),
        Field(C.RUBT_ID_10, rubro.tables.rubtId10, FieldType.id),
        Field(C.RUBTI_ID_10, rubro.items.rubtiId10, FieldType.id)
      )
    }
    def throwException = {
      throw new RuntimeException(s"Error when saving ${C.RUBRO}")
    }

    DBHelper.saveEx(
      user,
      Register(
        C.RUBRO,
        C.RUB_ID,
        rubro.id,
        false,
        true,
        true,
        getFields),
      isNew,
      C.RUB_CODE
    ) match {
      case SaveResult(true, id) => load(user, id).getOrElse(throwException)
      case SaveResult(false, _) => throwException
    }
  }

  def load(user: CompanyUser, id: Int): Option[Rubro] = {

    DB.withTransaction(user.database.database) { implicit connection =>

      val sql = "{call sp_rubro_get(?, ?)}"
      val cs = connection.prepareCall(sql)

      cs.setInt(1, id)
      cs.registerOutParameter(2, Types.OTHER)

      try {
        cs.execute()

        val rs = cs.getObject(2).asInstanceOf[java.sql.ResultSet]
        Sql.as(rubroParser.singleOpt, rs)

      } catch {
        case NonFatal(e) => {
          Logger.error(s"can't get ${C.RUBRO} with id $id for user ${user.toString}. Error ${e.toString}")
          throw e
        }
      } finally {
        cs.close
      }
    }
  }

  def delete(user: CompanyUser, id: Int) = {
    DB.withConnection(user.database.database) { implicit connection =>
      try {
        SQL(s"DELETE FROM ${C.RUBRO} WHERE ${C.RUB_ID} = {id}")
          .on('id -> id)
          .executeUpdate
      } catch {
        case NonFatal(e) => {
          Logger.error(s"can't delete a ${C.RUBRO}. ${C.RUB_ID} id: $id. Error ${e.toString}")
          throw e
        }
      }
    }
  }

  def get(user: CompanyUser, id: Int): Rubro = {
    load(user, id) match {
      case Some(p) => p
      case None => emptyRubro
    }
  }
}