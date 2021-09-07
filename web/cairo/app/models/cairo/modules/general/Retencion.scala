package models.cairo.modules.general

import java.sql.{CallableStatement, Connection, ResultSet, SQLException, Types}
import anorm.SqlParser._
import anorm._
import services.DateUtil
import services.db.DB
import models.cairo.system.database.{DBHelper, Field, FieldType, Register, SaveResult}
import play.api.Play.current
import models.domain.CompanyUser

import java.util.Date
import play.api.Logger
import play.api.libs.json._

import java.math.BigDecimal
import scala.util.control.NonFatal

case class RetencionItems(
                           items: List[RetencionItem],
                           provincias: List[RetencionProvincia],
                           categoriasFiscales: List[RetencionCategoriaFiscal],

                           /* only used in save */
                           itemDeleted: String,
                           provinciaDeleted: String,
                           categoriaFiscalDeleted: String
                         )

case class Retencion(
                          id: Int,
                          name: String,
                          code: String,
                          active: Boolean,
                          rettId: Int,
                          rettName: String,
                          importeMinimo: Double,
                          esIibb: Boolean,
                          regimenSicore: String,
                          taId: Int,
                          taName: String,
                          ibcId: Int,
                          ibcName: String,
                          acumulaPor: Int,
                          tipoMinimo: Int,
                          descrip: String,

                          items: RetencionItems,

                          createdAt: Date,
                          updatedAt: Date,
                          updatedBy: Int) {

  def this(
            id: Int,
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
            items: RetencionItems) = {

    this(
      id,
      name,
      code,
      active,
      rettId,
      "",
      importeMinimo,
      esIibb,
      regimenSicore,
      taId,
      "",
      ibcId,
      "",
      acumulaPor,
      tipoMinimo,
      descrip,
      items,
      DateUtil.currentTime,
      DateUtil.currentTime,
      DBHelper.NoId)
  }

  def this(
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
            items: RetencionItems) = {

    this(
      DBHelper.NoId,
      name,
      code,
      active,
      rettId,
      importeMinimo,
      esIibb,
      regimenSicore,
      taId,
      ibcId,
      acumulaPor,
      tipoMinimo,
      descrip,
      items)

  }

}

case class RetencionItem(
                          id: Int,
                          importeDesde: Double,
                          importeHasta: Double,
                          porcentaje: Double,
                          importeFijo: Double
                        )

case class RetencionProvincia(
                               id: Int,
                               proId: Int,
                               proName: String
                             )

case class RetencionCategoriaFiscal(
                               id: Int,
                               catfId: Int,
                               catfName: String,
                               base: Int
                             )
object Retencion {

  lazy val emptyRetencionItems = RetencionItems(List(), List(), List(), "", "", "")

  lazy val emptyRetencion = Retencion(
    "",
    "",
    false,
    DBHelper.NoId,
    0,
    false,
    "",
    DBHelper.NoId,
    DBHelper.NoId,
    0,
    0,
    "")

  def apply(
             id: Int,
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
             descrip: String) = {

    new Retencion(
      id,
      name,
      code,
      active,
      rettId,
      importeMinimo,
      esIibb,
      regimenSicore,
      taId,
      ibcId,
      acumulaPor,
      tipoMinimo,
      descrip,
      emptyRetencionItems
    )
  }

  def apply(
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
             descrip: String) = {

    new Retencion(
      name,
      code,
      active,
      rettId,
      importeMinimo,
      esIibb,
      regimenSicore,
      taId,
      ibcId,
      acumulaPor,
      tipoMinimo,
      descrip,
      emptyRetencionItems)
  }

  def apply(
             id: Int,
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
             items: RetencionItems) = {

    new Retencion(
      id,
      name,
      code,
      active,
      rettId,
      importeMinimo,
      esIibb,
      regimenSicore,
      taId,
      ibcId,
      acumulaPor,
      tipoMinimo,
      descrip,
      items
    )
  }

  def apply(
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
             items: RetencionItems) = {

    new Retencion(
      name,
      code,
      active,
      rettId,
      importeMinimo,
      esIibb,
      regimenSicore,
      taId,
      ibcId,
      acumulaPor,
      tipoMinimo,
      descrip,
      items)
  }

  private val RetencionParser: RowParser[Retencion] = {
    SqlParser.get[Int](C.RET_ID) ~
    SqlParser.get[String](C.RET_NAME) ~
    SqlParser.get[String](C.RET_CODE) ~
    SqlParser.get[Int](DBHelper.ACTIVE) ~
    SqlParser.get[Int](C.RETT_ID) ~
    SqlParser.get[String](C.RETT_NAME) ~
    SqlParser.get[BigDecimal](C.RET_IMPORTE_MINIMO) ~
    SqlParser.get[Int](C.RET_ES_IIBB) ~
    SqlParser.get[String](C.RET_REGIMEN_SICORE) ~
    SqlParser.get[Option[Int]](C.TA_ID) ~
    SqlParser.get[Option[String]](C.TA_NAME) ~
    SqlParser.get[Option[Int]](C.IBC_ID) ~
    SqlParser.get[Option[String]](C.IBC_NAME) ~
    SqlParser.get[Int](C.RET_ACUMULA_POR) ~
    SqlParser.get[Int](C.RET_TIPO_MINIMO) ~
    SqlParser.get[String](C.RET_DESCRIP) ~
    SqlParser.get[Date](DBHelper.CREATED_AT) ~
    SqlParser.get[Date](DBHelper.UPDATED_AT) ~
    SqlParser.get[Int](DBHelper.UPDATED_BY) map {
      case
        id ~
        name ~
        code ~
        active ~
        rettId ~
        rettName ~
        importeMinimo ~
        esIibb ~
        regimenSicore ~
        taId ~
        taName ~
        ibcId ~
        ibcName ~
        acumulaPor ~
        tipoMinimo ~
        descrip  ~
        createdAt ~
        updatedAt ~
        updatedBy =>
        Retencion(
          id,
          name,
          code,
          active != 0,
          rettId,
          rettName,
          importeMinimo.doubleValue(),
          esIibb != 0,
          regimenSicore,
          taId.getOrElse(DBHelper.NoId),
          taName.getOrElse(""),
          ibcId.getOrElse(DBHelper.NoId),
          ibcName.getOrElse(""),
          acumulaPor,
          tipoMinimo,
          descrip,
          emptyRetencionItems,
          createdAt,
          updatedAt,
          updatedBy)
    }
  }

  def create(user: CompanyUser, Retencion: Retencion): Retencion = {
    save(user, Retencion, true)
  }

  def update(user: CompanyUser, Retencion: Retencion): Retencion = {
    save(user, Retencion, false)
  }

  private def save(user: CompanyUser, retencion: Retencion, isNew: Boolean): Retencion = {
    def getFields = {
      List(
        Field(C.RET_NAME, retencion.name, FieldType.text),
        Field(C.RET_CODE, retencion.code, FieldType.text),
        Field(DBHelper.ACTIVE, Register.boolToInt(retencion.active), FieldType.boolean),
        Field(C.RETT_ID, retencion.rettId, FieldType.id),
        Field(C.RET_IMPORTE_MINIMO, retencion.importeMinimo, FieldType.number),
        Field(C.RET_ES_IIBB, Register.boolToInt(retencion.esIibb), FieldType.boolean),
        Field(C.RET_REGIMEN_SICORE, retencion.regimenSicore, FieldType.text),
        Field(C.TA_ID, retencion.taId, FieldType.id),
        Field(C.IBC_ID, retencion.ibcId, FieldType.id),
        Field(C.RET_ACUMULA_POR, retencion.acumulaPor, FieldType.number),
        Field(C.RET_TIPO_MINIMO, retencion.tipoMinimo, FieldType.number),
        Field(C.RET_DESCRIP, retencion.descrip, FieldType.text)
      )
    }

    def getItemFields(item: RetencionItem, retId: Int) = {
      List(
        Field(C.RET_ID, retId, FieldType.id),
        Field(C.RETI_IMPORTE_DESDE, item.importeDesde, FieldType.currency),
        Field(C.RETI_IMPORTE_HASTA, item.importeHasta, FieldType.currency),
        Field(C.RETI_PORCENTAJE, item.porcentaje, FieldType.double),
        Field(C.RETI_IMPORTE_FIJO, item.importeFijo, FieldType.currency)
      )
    }

    def getProvinciaFields(provincia: RetencionProvincia, retId: Int) = {
      List(
        Field(C.RET_ID, retId, FieldType.id),
        Field(C.PRO_ID, provincia.proId, FieldType.id)
      )
    }

    def getCatFiscalFields(catFiscal: RetencionCategoriaFiscal, retId: Int) = {
      List(
        Field(C.RET_ID, retId, FieldType.id),
        Field(C.CATF_ID, catFiscal.catfId, FieldType.id),
        Field(C.RET_CATF_BASE, catFiscal.base, FieldType.number)
      )
    }

    case class RetencionItemInfo(retId: Int, item: RetencionItem)

    def saveItem(itemInfo: RetencionItemInfo) = {
      DBHelper.save(
        user,
        Register(
          C.RETENCION_ITEM,
          C.RETI_ID,
          itemInfo.item.id,
          false,
          true,
          true,
          getItemFields(itemInfo.item, itemInfo.retId)),
        itemInfo.item.id == DBHelper.NewId
      ) match {
        case SaveResult(true, id) => true
        case SaveResult(false, _) => throwException
      }
    }

    def saveItems(retId: Int) = {
      DBHelper.deleteItems(user, C.RETENCION_ITEM, C.RETI_ID, retencion.items.itemDeleted, s" AND ret_id = ${retId}")
      retencion.items.items.map(item => saveItem(RetencionItemInfo(retId, item)))
    }

    case class RetencionProvinciaInfo(retId: Int, provincia: RetencionProvincia)

    def saveProvincia(itemInfo: RetencionProvinciaInfo) = {
      DBHelper.save(
        user,
        Register(
          C.RETENCION_PROVINCIA,
          C.RET_PRO_ID,
          itemInfo.provincia.id,
          false,
          false,
          false,
          getProvinciaFields(itemInfo.provincia, itemInfo.retId)),
        itemInfo.provincia.id == DBHelper.NewId
      ) match {
        case SaveResult(true, id) => true
        case SaveResult(false, _) => throwException
      }
    }

    def saveProvincias(retId: Int) = {
      DBHelper.deleteItems(user, C.RETENCION_PROVINCIA, C.RETI_ID, retencion.items.provinciaDeleted, s" AND ret_id = ${retId}")
      retencion.items.provincias.map(provincia => saveProvincia(RetencionProvinciaInfo(retId, provincia)))
    }

    case class RetencionCatFiscalInfo(retId: Int, catFiscal: RetencionCategoriaFiscal)

    def saveCatFiscal(itemInfo: RetencionCatFiscalInfo) = {
      DBHelper.save(
        user,
        Register(
          C.RETENCION_CATEGORIA_FISCAL,
          C.RET_CATF_ID,
          itemInfo.catFiscal.id,
          false,
          false,
          false,
          getCatFiscalFields(itemInfo.catFiscal, itemInfo.retId)),
        itemInfo.catFiscal.id == DBHelper.NewId
      ) match {
        case SaveResult(true, id) => true
        case SaveResult(false, _) => throwException
      }
    }

    def saveCatFiscales(retId: Int) = {
      DBHelper.deleteItems(user, C.RETENCION_CATEGORIA_FISCAL, C.RET_CATF_ID, retencion.items.categoriaFiscalDeleted, s" AND ret_id = ${retId}")
      retencion.items.categoriasFiscales.map(catFiscal => saveCatFiscal(RetencionCatFiscalInfo(retId, catFiscal)))
    }

    def throwException = {
      throw new RuntimeException(s"Error when saving ${C.RETENCION}")
    }

    DBHelper.saveEx(
      user,
      Register(
        C.RETENCION,
        C.RET_ID,
        retencion.id,
        false,
        true,
        true,
        getFields),
      isNew,
      C.RET_CODE
    ) match {
      case SaveResult(true, id) => {
        saveItems(id)
        saveProvincias(id)
        saveCatFiscales(id)
        load(user, id).getOrElse(throwException)
      }
      case SaveResult(false, _) => throwException
    }
  }

  def load(user: CompanyUser, id: Int): Option[Retencion] = {
    loadWhere(user, s"${C.RET_ID} = {id}", 'id -> id)
  }

  def loadWhere(user: CompanyUser, where: String, args : scala.Tuple2[scala.Any, anorm.ParameterValue[_]]*) = {
    DB.withConnection(user.database.database) { implicit connection =>
      SQL(s"select ret.*, rett.rett_nombre, ta.ta_nombre, ibc.ibc_nombre" +
        s" from Retencion ret left join RetencionTipo rett on ret.rett_id = rett.rett_id" +
        s" left join Talonario ta on ret.ta_id = ta.ta_id" +
        s" left join IngresosBrutosCategoria ibc on ret.ibc_id = ibc.ibc_id" +
        s" where $where")
        .on(args: _*)
        .as(RetencionParser.singleOpt)
    }
  }

  private def loadRetencionItems(user: CompanyUser, id: Int) = {
    RetencionItems(
      loadItems(user, id),
      loadProvincias(user, id),
      loadCategoriasFiscales(user, id),
      "", "", "")
  }

  private val retencionItemParser: RowParser[RetencionItem] = {
    SqlParser.get[Int](C.RETI_ID) ~
    SqlParser.get[BigDecimal](C.RETI_IMPORTE_DESDE) ~
    SqlParser.get[BigDecimal](C.RETI_IMPORTE_HASTA) ~
    SqlParser.get[BigDecimal](C.RETI_PORCENTAJE) ~
    SqlParser.get[BigDecimal](C.RETI_IMPORTE_FIJO) map {
      case
        id ~
        importeDesde ~
        importeHasta ~
        porcentaje ~
        importeFijo =>
        RetencionItem(
          id,
          importeDesde.doubleValue(),
          importeHasta.doubleValue(),
          porcentaje.doubleValue(),
          importeFijo.doubleValue()
        )
    }
  }

  private val retencionProvinciaParser: RowParser[RetencionProvincia] = {
    SqlParser.get[Int](C.RET_PRO_ID) ~
      SqlParser.get[Int](C.PRO_ID) ~
      SqlParser.get[String](C.PRO_NAME) map {
      case
        id ~
        proId ~
        proName =>
        RetencionProvincia(
          id,
          proId,
          proName
        )
    }
  }

  private val retencionCategoriaFiscalParser: RowParser[RetencionCategoriaFiscal] = {
    SqlParser.get[Int](C.RET_CATF_ID) ~
      SqlParser.get[Int](C.CATF_ID) ~
      SqlParser.get[String](C.CATF_NAME) ~
      SqlParser.get[Int](C.RET_CATF_BASE) map {
      case
        id ~
        catfId ~
        catfName ~
        base =>
        RetencionCategoriaFiscal(
          id,
          catfId,
          catfName,
          base
        )
    }
  }

  private def loadItems(user: CompanyUser, id: Int) = {
    DB.withConnection(user.database.database) { implicit connection =>
      SQL(s"SELECT t1.* FROM ${C.RETENCION_ITEM} t1 WHERE t1.${C.RET_ID} = {id}")
        .on('id -> id)
        .as(retencionItemParser.*)
    }
  }

  private def loadProvincias(user: CompanyUser, id: Int) = {
    DB.withConnection(user.database.database) { implicit connection =>
      SQL(s"SELECT t1.*, t2.${C.PRO_NAME} FROM ${C.RETENCION_PROVINCIA} t1 " +
        s"LEFT JOIN ${C.PROVINCIA} t2 ON t1.${C.PRO_ID} = t2.${C.PRO_ID} WHERE t1.${C.RET_ID} = {id}")
        .on('id -> id)
        .as(retencionProvinciaParser.*)
    }
  }

  private def loadCategoriasFiscales(user: CompanyUser, id: Int) = {
    DB.withConnection(user.database.database) { implicit connection =>
      SQL(s"SELECT t1.*, t2.${C.CATF_NAME} FROM ${C.RETENCION_CATEGORIA_FISCAL} t1 " +
        s"LEFT JOIN ${C.CATEGORIA_FISCAL} t2 ON t1.${C.CATF_ID} = t2.${C.CATF_ID} WHERE t1.${C.RET_ID} = {id}")
        .on('id -> id)
        .as(retencionCategoriaFiscalParser.*)
    }
  }

  def delete(user: CompanyUser, id: Int) = {
    DB.withConnection(user.database.database) { implicit connection =>
      try {
        SQL(s"DELETE FROM ${C.RETENCION} WHERE ${C.RET_ID} = {id}")
          .on('id -> id)
          .executeUpdate
      } catch {
        case NonFatal(e) => {
          Logger.error(s"can't delete a ${C.RETENCION}. ${C.RET_ID} id: $id. Error ${e.toString}")
          throw e
        }
      }
    }
  }

  def get(user: CompanyUser, id: Int): Retencion = {
    load(user, id) match {
      case Some(p) => {
        Retencion(
          p.id,
          p.name,
          p.code,
          p.active,
          p.rettId,
          p.rettName,
          p.importeMinimo,
          p.esIibb,
          p.regimenSicore,
          p.taId,
          p.taName,
          p.ibcId,
          p.ibcName,
          p.acumulaPor,
          p.tipoMinimo,
          p.descrip,
          loadRetencionItems(user, id),
          DateUtil.currentTime,
          DateUtil.currentTime,
          DBHelper.NoId
        )
      }
      case None => emptyRetencion
    }
  }
}

