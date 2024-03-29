package models.cairo.modules.stock

import java.sql.{Connection, CallableStatement, ResultSet, Types, SQLException}
import anorm.SqlParser._
import anorm._
import services.{G, DateUtil}
import services.db.DB
import models.cairo.system.database.{DBHelper, Register, Field, FieldType, SaveResult, Recordset}
import models.cairo.system.database.DBHelper.rowToFloat
import java.math.BigDecimal
import play.api.Play.current
import models.domain.CompanyUser
import java.util.Date
import play.api.Logger
import play.api.libs.json._
import scala.util.control.NonFatal
import models.cairo.modules.general.U
import formatters.json.DateFormatter
import models.cairo.modules.general.DocumentListParam

case class StockId(
                      docId: Int,
                      docName: String,
                      numero: Int,
                      nroDoc: String
                    ) {
  def this(
            docId: Int,
            numero: Int,
            nroDoc: String
            ) = {
    this(
      docId,
      "",
      numero,
      nroDoc
    )
  }
}

object StockId {

  def apply(
             docId: Int,
             numero: Int,
             nroDoc: String) = {

    new StockId(
      docId,
      numero,
      nroDoc)
  }
}

case class StockReferences(
                              doctId: Int,
                              idCliente: Int,
                              doctIdCliente: Int,
                              docCliente: String,
                              taMascara: String,
                              taPropuesto: Boolean,
                              editable: Boolean,
                              editMsg: String
                            )

case class StockBase(
                        fecha: Date,
                        descrip: String,
                        deplIdOrigen: Int,
                        deplNameOrigen: String,
                        deplIdDestino: Int,
                        deplNameDestino: String,
                        sucId: Int,
                        sucName: String,
                        lgjId: Int,
                        lgjCode: String
                      ) {
  def this(
            fecha: Date,
            descrip: String,
            deplIdOrigen: Int,
            deplIdDestino: Int,
            sucId: Int,
            lgjId: Int
          ) = {
    this(
      fecha,
      descrip,
      deplIdOrigen,
      "",
      deplIdDestino,
      "",
      sucId,
      "",
      lgjId,
      ""
    )
  }
}

object StockBase {

  def apply(
            fecha: Date,
            descrip: String,
            deplIdOrigen: Int,
            deplIdDestino: Int,
            sucId: Int,
            lgjId: Int): StockBase = {
    
    new StockBase(
      fecha,
      descrip,
      deplIdOrigen,
      deplIdDestino,
      sucId,
      lgjId
    )
  }
}

case class StockItemSerie(
                           id: Int,
                           code: String,
                           descrip: String,
                           fechaVto: Date,
                           stiGroup: Int,
                           prId: Int,
                           prNameCompra: String
                           )

case class StockItemKit(
                         id: Int,
                         name: String,
                         amount: Double,
                         hasSerial: Boolean
                         )
case class StockItem(
                        id: Int,
                        descrip: String,
                        deplId: Int,
                        prId: Int,
                        prNameCompra: String,
                        prHasPartNumber: Boolean,
                        prHasSerial: Boolean,
                        prIsKit: Boolean,
                        unName: String,
                        stlId: Int,
                        stlCode: String,
                        prnsId: Int,
                        prnsDescrip: String,
                        prnsFechaVto: Date,

                        ingreso: Double,
                        salida: Double,
                        grupo: Int,
                        orden: Int,
                        prIdKit: Int,
                        stikOrden: Int,
                        stikCantidad: Double
                      )

object StockItem {

  def apply(id: Int,
            descrip: String,
            deplId: Int,
            prId: Int,
            stlId: Int,
            prnsId: Int,
            prnsDescrip: String,
            prnsFechaVto: Date,
            ingreso: Double,
            salida: Double,
            grupo: Int,
            orden: Int,
            prIdKit: Int,
            stikOrden: Int,
            stikCantidad: Double
             ) = {

    new StockItem(
      id,
      descrip,
      deplId,
      prId,
      "",
      false,
      false,
      false,
      "",
      stlId,
      "",
      prnsId,
      prnsDescrip,
      prnsFechaVto,
      ingreso,
      salida,
      grupo,
      orden,
      prIdKit,
      stikOrden,
      stikCantidad
    )
  }


  def apply(id: Int,
            descrip: String,
            deplId: Int,
            prId: Int,
            prNameCompra: String,
            hasPartNumber: Boolean,
            hasSerial: Boolean,
            isKit: Boolean,
            unName: String,
            stlId: Int,
            stlCode: String,
            salida: Double,
            grupo: Int,
            orden: Int) = {

    new StockItem(
      id,
      descrip,
      deplId,
      prId,
      prNameCompra,
      hasPartNumber,
      hasSerial,
      isKit,
      unName,
      stlId,
      stlCode,
      DBHelper.NoId,
      "",
      U.NO_DATE,
      0,
      salida,
      grupo,
      orden,
      DBHelper.NoId,
      0,
      0
    )
  }
}

case class StockItems(
                         items: List[StockItem],
                         series: List[StockItemSerie], /* only used when loading a inventory document to respond a get FacturaVenta */
                         kits: List[StockItemKit]  /* only used when loading an inventory document to respond a get FacturaVenta */
                       )

case class Stock(
                    id: Int,

                    ids: StockId,
                    base: StockBase,
                    references: StockReferences,

                    items: StockItems,

                    createdAt: Date,
                    updatedAt: Date,
                    updatedBy: Int
                  ) {

  def this(
            id: Int,

            ids: StockId,
            base: StockBase,
            references: StockReferences,

            items: StockItems) = {

    this(
      id,

      ids,
      base,
      references,

      items,

      DateUtil.currentTime,
      DateUtil.currentTime,
      DBHelper.NoId)
  }

  def this(
            ids: StockId,
            base: StockBase,
            references: StockReferences,

            items: StockItems) = {

    this(
      DBHelper.NoId,

      ids,
      base,
      references,

      items
    )
  }

}

case class StockParams(
                          from: String,
                          to: String,
                          docId: String,
                          docName: String,
                          sucId: String,
                          sucName: String,
                          lgjId: String,
                          lgjCode: String,
                          empId: String,
                          empName: String
                         ) {
  def this(
            from: String,
            to: String,
            docId: String,
            sucId: String,
            lgjId: String,
            empId: String
            ) = {
    this(
      from,
      to,
      docId,
      "",
      sucId,
      "",
      lgjId,
      "",
      empId,
      ""
    )
  }
}

object StockParams {
  def apply(
             from: String,
             to: String,
             docId: String,
             sucId: String,
             lgjId: String,
             empId: String
             ) = {

    new StockParams(
      from,
      to,
      docId,
      sucId,
      lgjId,
      empId
    )
  }
}

object Stock {

  lazy val GC = models.cairo.modules.general.C
  lazy val DT = models.cairo.modules.documentos.DT

  lazy val emptyStockItems = StockItems(List(), List(), List())

  lazy val emptyStockReferences = StockReferences(0, 0, 0, "", "", false, false, "")

  lazy val emptyStock = Stock(
    StockId(DBHelper.NoId, 0, ""),
    StockBase(U.NO_DATE, "", DBHelper.NoId, DBHelper.NoId, DBHelper.NoId, DBHelper.NoId),
    emptyStockReferences,
    emptyStockItems
  )

  lazy val emptyStockParams = StockParams(
    DateFormatter.format(DateUtil.plusDays(DateUtil.currentTime, -60)),
    DateFormatter.format(DateUtil.currentTime), "0", "0", "0", "0")

  def apply(
             id: Int,

             ids: StockId,
             base: StockBase,
             references: StockReferences,

             items: StockItems
             ) = {

    new Stock(
      id,

      ids,
      base,
      references,

      items
    )
  }

  def apply(
             id: Int,

             ids: StockId,
             base: StockBase,
             references: StockReferences
             ) = {

    new Stock(
      id,

      ids,
      base,
      references,

      emptyStockItems
    )
  }

  def apply(
             ids: StockId,
             base: StockBase,
             references: StockReferences,

             items: StockItems
             ) = {

    new Stock(
      ids,
      base,
      references,

      items
    )
  }

  def apply(
             ids: StockId,
             base: StockBase,
             references: StockReferences
             ) = {

    new Stock(

      ids,
      base,
      references,

      emptyStockItems
    )
  }

  private val stockItemParser: RowParser[StockItem] = {
    SqlParser.get[Int](C.STI_ID) ~
    SqlParser.get[String](C.STI_DESCRIP) ~
    SqlParser.get[Int](GC.DEPL_ID) ~
    SqlParser.get[Int](GC.PR_ID) ~
    SqlParser.get[String](GC.PR_NAME_COMPRA) ~
    SqlParser.get[Int](GC.PR_LLEVA_NRO_LOTE) ~
    SqlParser.get[Int](GC.PR_LLEVA_NRO_SERIE) ~
    SqlParser.get[Int](GC.PR_ES_KIT) ~
    SqlParser.get[String](GC.UN_NAME) ~
    SqlParser.get[Option[Int]](GC.STL_ID) ~
    SqlParser.get[Option[String]](GC.STL_CODE) ~
    SqlParser.get[BigDecimal](C.STI_SALIDA) ~
    SqlParser.get[Int](C.STI_GRUPO) ~
    SqlParser.get[Int](C.STI_ORDEN) map {
    case
        id ~
        descrip ~
        deplId ~
        prId ~
        prNameCompra ~
        hasPartNumber ~
        hasSerial ~
        isKit ~
        unName ~
        stlId ~
        stlCode ~
        salida ~
        grupo ~
        orden =>
      StockItem(
        id,
        descrip,
        deplId,
        prId,
        prNameCompra,
        hasPartNumber != 0,
        hasSerial != 0,
        isKit != 0,
        unName,
        stlId.getOrElse(DBHelper.NoId),
        stlCode.getOrElse(""),
        salida.doubleValue(),
        grupo,
        orden
      )
    }
  }

  private val stockItemSerieParser: RowParser[StockItemSerie] = {
    SqlParser.get[Int](GC.PRNS_ID) ~
    SqlParser.get[String](GC.PRNS_CODE) ~
    SqlParser.get[String](GC.PRNS_DESCRIP) ~
    SqlParser.get[Date](GC.PRNS_FECHA_VTO) ~
    SqlParser.get[Int](C.STI_GRUPO) ~
    SqlParser.get[Int](GC.PR_ID) ~
    SqlParser.get[String](GC.PR_NAME_COMPRA) map {
    case
        prnsId ~
        prnsCode ~
        prnsDescrip ~
        prnsFechaVto ~
        stiGroup ~
        prId ~
        prNameCompra =>
      StockItemSerie(
        prnsId,
        prnsCode,
        prnsDescrip,
        prnsFechaVto,
        stiGroup,
        prId,
        prNameCompra
      )
    }
  }

  private val stockItemKitParser: RowParser[StockItemKit] = {
    SqlParser.get[Int](GC.PR_ID) ~
    SqlParser.get[String](GC.PR_NAME_COMPRA) ~
    SqlParser.get[BigDecimal](GC.PRK_CANTIDAD) ~
    SqlParser.get[Int](GC.PR_LLEVA_NRO_SERIE) map {
    case
        prId ~
        name ~
        amount ~
        hasSerial =>
      StockItemKit(
        prId,
        name,
        amount.doubleValue(),
        (hasSerial != 0)
      )
    }
  }

  private val stockParser: RowParser[Stock] = {
    SqlParser.get[Int](C.ST_ID) ~
    SqlParser.get[Int](GC.DOC_ID) ~
    SqlParser.get[String](GC.DOC_NAME) ~
    SqlParser.get[Int](C.ST_NUMERO) ~
    SqlParser.get[String](C.ST_NRODOC) ~
    SqlParser.get[String](C.ST_DESCRIP) ~
    SqlParser.get[Int](GC.DOCT_ID) ~
    SqlParser.get[Option[Int]](C.DOCT_ID_CLIENTE) ~
    SqlParser.get[Option[Int]](C.ID_CLIENTE) ~
    SqlParser.get[Option[String]](C.DOC_CLIENTE) ~
    SqlParser.get[String](GC.TA_MASCARA) ~
    SqlParser.get[Int](GC.TA_PROPUESTO) ~
    SqlParser.get[Int](GC.EDITABLE) ~
    SqlParser.get[String](GC.EDIT_MSG) ~
    SqlParser.get[Date](C.ST_FECHA) ~
    SqlParser.get[Int](GC.DEPL_ID_ORIGEN) ~
    SqlParser.get[String](GC.DEPL_NAME_ORIGEN) ~
    SqlParser.get[Int](GC.DEPL_ID_DESTINO) ~
    SqlParser.get[String](GC.DEPL_NAME_DESTINO) ~
    SqlParser.get[Int](GC.SUC_ID) ~
    SqlParser.get[String](GC.SUC_NAME) ~
    SqlParser.get[Option[Int]](GC.LGJ_ID) ~
    SqlParser.get[Option[String]](GC.LGJ_CODE) ~
    SqlParser.get[Date](DBHelper.CREATED_AT) ~
    SqlParser.get[Date](DBHelper.UPDATED_AT) ~
    SqlParser.get[Int](DBHelper.UPDATED_BY) map {
    case
        id ~
        docId ~
        docName ~
        numero ~
        nroDoc ~
        descrip ~
        doctId ~
        doctIdCliente ~
        idCliente ~
        docCliente ~
        taMascara ~
        taPropuesto ~
        editable ~
        editMsg ~
        fecha ~
        deplIdOrigen ~
        deplNameOrigen ~
        deplIdDestino ~
        deplNameDestino ~
        sucId ~
        sucName ~
        lgjId ~
        lgjCode ~
        createdAt ~
        updatedAt ~
        updatedBy =>
      Stock(
        id,
        StockId(
          docId,
          docName,
          numero,
          nroDoc
        ),
        StockBase(
          fecha,
          descrip,
          deplIdOrigen,
          deplNameOrigen,
          deplIdDestino,
          deplNameDestino,
          sucId,
          sucName,
          lgjId.getOrElse(0),
          lgjCode.getOrElse("")
        ),
        StockReferences(
          doctId,
          doctIdCliente.getOrElse(0),
          idCliente.getOrElse(0),
          docCliente.getOrElse(""),
          taMascara,
          taPropuesto != 0,
          editable != 0,
          editMsg
        ),
        emptyStockItems,
        createdAt,
        updatedAt,
        updatedBy)
    }
  }

  def create(user: CompanyUser, stock: Stock): Stock = {
    save(user, stock, false)
  }

  def update(user: CompanyUser, stock: Stock): Stock = {
    save(user, stock, false)
  }

  private def save(user: CompanyUser, stock: Stock, isFromWizard: Boolean): Stock = {
    def getFields = {
      List(
        Field(C.ST_ID, stock.id, FieldType.number),
        Field(GC.DOC_ID, stock.ids.docId, FieldType.id),
        Field(GC.DOCT_ID, DT.MOVIMIENTO_STOCK, FieldType.id),
        Field(C.ST_NRODOC, stock.ids.nroDoc, FieldType.text),
        Field(C.ST_NUMERO, stock.ids.numero, FieldType.number),
        Field(C.ST_DESCRIP, stock.base.descrip, FieldType.text),
        Field(C.ST_FECHA, stock.base.fecha, FieldType.date),
        Field(GC.DEPL_ID_ORIGEN, stock.base.deplIdOrigen, FieldType.id),
        Field(GC.DEPL_ID_DESTINO, stock.base.deplIdDestino, FieldType.id),
        Field(GC.SUC_ID, stock.base.sucId, FieldType.id),
        Field(GC.LGJ_ID, stock.base.lgjId, FieldType.id)
      )
    }

    def getItemFields(item: StockItem, stTMPId: Int) = {
      List(
        Field(C.ST_TMP_ID, stTMPId, FieldType.id),
        Field(C.STI_ID, item.id, FieldType.number),
        Field(C.STI_DESCRIP, item.descrip, FieldType.text),
        Field(GC.PR_ID, item.prId, FieldType.id),
        Field(GC.DEPL_ID, item.deplId, FieldType.id),
        Field(GC.STL_ID, item.stlId, FieldType.id),
        Field(GC.PRNS_ID, item.prnsId, FieldType.id),
        Field(GC.PRNS_DESCRIP, item.prnsDescrip, FieldType.text),
        Field(GC.PRNS_FECHA_VTO, item.prnsFechaVto, FieldType.date),
        Field(C.STI_INGRESO, item.ingreso, FieldType.currency),
        Field(C.STI_SALIDA, item.salida, FieldType.currency),
        Field(C.STI_ORDEN, item.orden, FieldType.integer),
        Field(C.STI_GRUPO, item.grupo, FieldType.currency),
        Field(GC.PR_ID_KIT, item.prIdKit, FieldType.id),
        Field(C.STIK_CANTIDAD, item.stikCantidad, FieldType.currency),
        Field(C.STIK_ORDEN, item.stikOrden, FieldType.integer)
      )
    }

    def throwError = {
      throwException(s"Error when saving ${C.STOCK}")
    }

    def throwException(message: String) = {
      throw new RuntimeException(message)
    }

    case class StockItemInfo(stTMPId: Int, item: StockItem)

    def saveItem(itemInfo: StockItemInfo) = {
      DBHelper.save(
        user,
        Register(
          C.STOCK_ITEM_TMP,
          C.STI_TMP_ID,
          DBHelper.NoId,
          false,
          false,
          false,
          getItemFields(itemInfo.item, itemInfo.stTMPId)),
        true
      ) match {
        case SaveResult(false, id) => throwError
        case _ =>
      }
    }

    def saveItems(stTMPId: Int) = {
      stock.items.items.map(item => saveItem(StockItemInfo(stTMPId, item)))
    }

    case class RowResult(rowType: String, id: Int, message: String)

    def executeSave(stTMPId: Int): List[RowResult] = {

      DB.withTransaction(user.database.database) { implicit connection =>
        val sql = "select * from sp_doc_stock_save(?, ?)"
        val cs = connection.prepareStatement(sql)

        cs.setInt(1, user.masterUserId)
        cs.setInt(2, stTMPId)

        try {
          val rs = cs.executeQuery()

          /*
          *
          * all sp_doc_SOME_DOCUMENT_save must return a setof row_result
          *
          * row_result is a composite type in postgresql defined as:
          *
          * CREATE TYPE row_result AS (
          *    type    varchar,
          *    id      integer,
          *    message varchar,
          *    r       refcursor
          * );
          *
          *
          * ex: CREATE OR REPLACE FUNCTION sp_doc_stock_save( params )
          *     RETURNS SETOF row_result AS ...
          *
          * the field type is used to identify the value in the row. there are three
          * kind of types: resultset, success, key
          * for first two (resultset and success) the value of type is string with
          * one of these two values ex: 'resultset' or 'success'
          * when type == 'resultset' the field r must be not null and contain a ResultSet
          * when type == 'success' the id field can contain 0 (False) or not 0 (-1,1 or any other number but NO 0) (True)
          * the last kind of type is key. in this case the key must be the name of a column like st_id, st_id, pr_id, etc
          * it can be any column name. if the type is an integer like in st_id, st_id or any other id column the field id
          * is used to contain the returned value
          * if the type is any other the column message is used
          *
          * there are two special types for key: 'INFO', 'ERROR'
          * when type == 'ERROR' the system will raise an exception
          * when type == 'INFO' the system will show an alert
          * in both cases the field message contains the description
          *
          * this set must contain at least one row
          *
          * the field r (ResultSet) is not normally read in a save document operation.
          *
          * */

          try {
            def getIdOrMessage: RowResult = {
              val rowType = rs.getString(1)

              rowType match {
                case "ERROR" => throwException(rs.getString(3))
                case "INFO" => RowResult("INFO", 0, rs.getString(3))
                case "st_id" => RowResult("st_id", rs.getInt(2), "")
                case _ => RowResult("IGNORED", 0, "")
              }
            }

            def getSaveResult: List[RowResult] = {
              if(rs.next()) {
                getIdOrMessage :: getSaveResult
              }
              else {
                List()
              }
            }
            getSaveResult

          } finally {
            rs.close
          }

        } catch {
          case NonFatal(e) => {
            Logger.error(s"can't save ${C.STOCK} with id ${stock.id} for user ${user.toString}. Error ${e.toString}")
            throw e
          }
        } finally {
          cs.close
        }
      }
    }

    def getIdFromMessages(messages: List[RowResult]) = {
      def findId(messages: List[RowResult], id: Int): Int = messages match {
        case Nil => id
        case h :: t => {
          val _id = h match {
            case RowResult("st_id", id, m) => id
            case _ => id
          }
          findId(t, _id)
        }
      }
      findId(messages, 0)
    }

    DBHelper.save(
      user,
      Register(
        C.STOCK_TMP,
        C.ST_TMP_ID,
        DBHelper.NoId,
        false,
        true,
        true,
        getFields),
      true
    ) match {
      case SaveResult(true, stTMPId) => {
        saveItems(stTMPId)
        val messagesAndId = executeSave(stTMPId)
        val id = getIdFromMessages(messagesAndId)
        load(user, id).getOrElse(throwError)
      }
      case SaveResult(false, id) => throwError
    }

  }

  def load(user: CompanyUser, id: Int): Option[Stock] = {

    DB.withTransaction(user.database.database) { implicit connection =>

      val sql = "{call sp_doc_stock_get(?, ?, ?, ?)}"
      val cs = connection.prepareCall(sql)

      cs.setInt(1, user.cairoCompanyId)
      cs.setInt(2, id)
      cs.setInt(3, user.masterUserId)
      cs.registerOutParameter(4, Types.OTHER)

      try {
        cs.execute()

        val rs = cs.getObject(4).asInstanceOf[java.sql.ResultSet]
        Sql.as(stockParser.singleOpt, rs)

      } catch {
        case NonFatal(e) => {
          Logger.error(s"can't get ${C.STOCK} with id $id for user ${user.toString}. Error ${e.toString}")
          throw e
        }
      } finally {
        cs.close
      }
    }
  }

  private def loadStockItems(user: CompanyUser, id: Int) = {
    val items = loadItems(user, id)
    StockItems(items._1, items._2, items._3)
  }

  private def loadItems(user: CompanyUser, id: Int) = {

    DB.withTransaction(user.database.database) { implicit connection =>

      val sql = "{call sp_doc_stock_get_items(?, ?, ?, ?)}"
      val cs = connection.prepareCall(sql)

      cs.setInt(1, id)
      cs.registerOutParameter(2, Types.OTHER)
      cs.registerOutParameter(3, Types.OTHER)
      cs.registerOutParameter(4, Types.OTHER)

      try {
        cs.execute()

        val rs = cs.getObject(2).asInstanceOf[java.sql.ResultSet]
        val rsSerie = cs.getObject(3).asInstanceOf[java.sql.ResultSet]
        val rsKit = cs.getObject(4).asInstanceOf[java.sql.ResultSet]

        (
          Sql.as(stockItemParser.*, rs),
          Sql.as(stockItemSerieParser.*, rsSerie),
          Sql.as(stockItemKitParser.*, rsKit)
        )
      } catch {
        case NonFatal(e) => {
          Logger.error(s"can't get ${C.STOCK_ITEM} with id $id for user ${user.toString}. Error ${e.toString}")
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
        SQL("select * from sp_doc_stock_delete({id}, {empId}, {usId})")
          .on('id -> id, 'empId -> user.cairoCompanyId, 'usId -> user.masterUserId)
          .execute
      } catch {
        case NonFatal(e) => {
          Logger.error(s"can't delete a ${C.STOCK}. ${C.ST_ID} id: $id. Error ${e.toString}")
          throw e
        }
      }
    }
  }

  def get(user: CompanyUser, id: Int): Stock = {
    load(user, id) match {
      case Some(p) => {
        Stock(
          p.id,

          p.ids,
          p.base,
          p.references,

          loadStockItems(user, id)
        )
      }
      case None => emptyStock
    }
  }

  val K_FECHA_INI = 1
  val K_FECHA_FIN = 2
  val K_DOC_ID    = 9
  val K_SUC_ID    = 10
  val K_LGJ_ID    = 11
  val K_EMP_ID    = 100

  def saveParams(user: CompanyUser, stockParams: StockParams): StockParams = {
    val baseFields = List(
      Field(GC.EMP_ID, user.cairoCompanyId, FieldType.id),
      Field(GC.US_ID, user.masterUserId, FieldType.id),
      Field(GC.PRE_ID, S.LIST_STOCK, FieldType.id)
    )

    def throwException = {
      throw new RuntimeException(s"Error when saving ${C.STOCK}")
    }

    def saveParam(fields: List[Field]) = {
      DBHelper.save(
        user,
        Register(
          GC.LISTA_DOCUMENTO_PARAMETRO,
          "",
          DBHelper.NoId,
          false,
          false,
          false,
          fields),
        true
      ) match {
        case SaveResult(true, id) =>
        case SaveResult(false, _) => throwException
      }
    }

    val paramList = List(
      List(
        Field(GC.LDP_ID, K_FECHA_INI, FieldType.integer),
        Field(GC.LDP_ORDEN, 0, FieldType.integer),
        Field(GC.LDP_VALOR, stockParams.from, FieldType.text)
      ),
      List(
        Field(GC.LDP_ID, K_FECHA_FIN, FieldType.integer),
        Field(GC.LDP_ORDEN, 10, FieldType.integer),
        Field(GC.LDP_VALOR, stockParams.to, FieldType.text)
      ),
      List(
        Field(GC.LDP_ID, K_DOC_ID, FieldType.integer),
        Field(GC.LDP_ORDEN, 60, FieldType.integer),
        Field(GC.LDP_VALOR, stockParams.docId, FieldType.text)
      ),
      List(
        Field(GC.LDP_ID, K_EMP_ID, FieldType.integer),
        Field(GC.LDP_ORDEN, 80, FieldType.integer),
        Field(GC.LDP_VALOR, stockParams.empId, FieldType.text)
      )
    )

    DB.withConnection(user.database.database) { implicit connection =>
      try {
        SQL(s"""DELETE FROM ListaDocumentoParametro
              | WHERE pre_id = {preId}
              | AND (emp_id is null or emp_id = {empId})
              | AND us_id = {usId}""".stripMargin)
          .on(
            'preId -> S.LIST_STOCK,
            'empId -> user.cairoCompanyId,
            'usId -> user.masterUserId
          )
          .executeUpdate
      } catch {
        case NonFatal(e) => {
          Logger.error(s"can't save parameters for Stock")
          throw e
        }
      }
    }

    paramList.map(param => saveParam(baseFields ::: param))

    loadParams(user).getOrElse(throwException)
  }

  def loadParams(user: CompanyUser): Option[StockParams] = {

    val params = DocumentListParam.load(user, S.LIST_STOCK)

    if(params.isEmpty) {
      Some(emptyStockParams)
    }
    else {
      val doc = DocumentListParam.getParamValue(
        user, K_DOC_ID, params, emptyStockParams.docId,
        GC.DOCUMENTO, GC.DOC_ID, GC.DOC_NAME
      )
      val suc = DocumentListParam.getParamValue(
        user, K_SUC_ID, params, emptyStockParams.sucId,
        GC.SUCURSAL, GC.SUC_ID, GC.SUC_NAME
      )
      val lgj = DocumentListParam.getParamValue(
        user, K_LGJ_ID, params, emptyStockParams.lgjId,
        GC.LEGAJO, GC.LGJ_ID, GC.LGJ_CODE
      )
      val emp = DocumentListParam.getParamValue(
        user, K_EMP_ID, params, emptyStockParams.empId,
        GC.EMPRESA, GC.EMP_ID, GC.EMP_NAME
      )

      Some(
        StockParams(
          DocumentListParam.getParamValue(K_FECHA_INI, params, emptyStockParams.from),
          DocumentListParam.getParamValue(K_FECHA_FIN, params, emptyStockParams.to),
          doc.id,
          doc.value,
          suc.id,
          suc.value,
          lgj.id,
          lgj.value,
          emp.id,
          emp.value
        )
      )
    }
  }

  def list(user: CompanyUser,
           from: Date,
           to: Date,
           docId: Option[String],
           sucId: Option[String],
           lgjId: Option[String],
           empId: Option[String]): Recordset = {

    DB.withTransaction(user.database.database) { implicit connection =>

      val sql = "{call sp_lsdoc_stocks(?, ?, ?, ?, ?, ?, ?, ?)}"
      val cs = connection.prepareCall(sql)

      cs.setInt(1, user.masterUserId)
      cs.setDate(2, new java.sql.Date(from.getTime()))
      cs.setDate(3, new java.sql.Date(to.getTime()))
      cs.setString(4, docId.getOrElse("0"))
      cs.setString(5, sucId.getOrElse("0"))
      cs.setString(6, lgjId.getOrElse("0"))
      cs.setString(7, empId.getOrElse("0"))
      cs.registerOutParameter(8, Types.OTHER)

      try {
        cs.execute()

        val rs = cs.getObject(8).asInstanceOf[java.sql.ResultSet]
        Recordset.load(rs)

      } catch {
        case NonFatal(e) => {
          Logger.error(s"can't get listing of stocks for user ${user.toString}. Error ${e.toString}")
          throw e
        }
      } finally {
        cs.close
      }
    }
  }

  /*
  def test(user: CompanyUser) = {
    DB.withTransaction(user.database.database) { implicit connection =>

      val sql = "select * from testd(?)"
      val cs = connection.prepareStatement(sql)
      //val cs = connection.prepareCall(sql)

      cs.setInt(1, user.userId)
      //cs.registerOutParameter(2, Types.OTHER)

      try {
        val rs = cs.executeQuery()

        //val rs = cs.getObject(2).asInstanceOf[java.sql.ResultSet]
        if(rs.next) {
          if(rs.getInt(1) == 2) {
            val rsv = rs.getObject(3).asInstanceOf[java.sql.ResultSet]
            if (rsv.next)
              Logger.debug(s"rs1 has rows ${rsv.getString(1)}")
            if (rsv.next)
              Logger.debug(s"rs1 has rows ${rsv.getString(1)}")
          }
          else {
            Logger.debug(s"ID: ${rs.getInt(2)}")
          }
        }
        if(rs.next) {
          if(rs.getInt(1) == 2) {
            val rsv = rs.getObject(3).asInstanceOf[java.sql.ResultSet]
            if (rsv.next)
              Logger.debug(s"rs2 has rows ${rsv.getString(1)}")
          }
          else {
            Logger.debug(s"ID: ${rs.getInt(2)}")
          }
        }
        if(rs.next) {
          if(rs.getInt(1) == 2) {
            val rsv = rs.getObject(3).asInstanceOf[java.sql.ResultSet]
            if (rsv.next)
              Logger.debug(s"rs3 has rows ${rsv.getString(1)}")
          }
          else {
            Logger.debug(s"ID: ${rs.getInt(2)}")
          }
        }
        if(rs.next) {
          if(rs.getInt(1) == 2) {
            val rsv = rs.getObject(3).asInstanceOf[java.sql.ResultSet]
            if (rsv.next)
              Logger.debug(s"rs4 has rows ${rsv.getString(1)}")
          }
          else {
            Logger.debug(s"ID: ${rs.getInt(2)}")
          }
        }

      } catch {
        case NonFatal(e) => {
          Logger.error(s"can't test ${user.toString}. Error ${e.toString}")
          throw e
        }
      } finally {
        cs.close
      }
    }
  }
  */
}