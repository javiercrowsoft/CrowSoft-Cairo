package models.cairo.modules.contabilidad

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

case class AsientoId(
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

object AsientoId {

  def apply(
             docId: Int,
             numero: Int,
             nroDoc: String) = {

    new AsientoId(
      docId,
      numero,
      nroDoc)
  }
}

case class AsientoReferences(
                              doctId: Int,
                              idCliente: Int,
                              doctIdCliente: Int,
                              docCliente: String,
                              taMascara: String,
                              taPropuesto: Boolean,
                              editable: Boolean,
                              editMsg: String
                            )

case class AsientoBase(
                        fecha: Date,
                        descrip: String
                      )

case class AsientoItem(
                        id: Int,
                        descrip: String,
                        cueId: Int,
                        cueName: String,
                        ccosId: Int,
                        ccosName: String,
                        debe: Double,
                        haber: Double,
                        origen: Double,
                        orden: Int
                      )

object AsientoItem {

  def apply(id: Int,
            descrip: String,
            cueId: Int,
            ccosId: Int,
            debe: Double,
            haber: Double,
            origen: Double,
            orden: Int) = {

    new AsientoItem(
      id,
      descrip,
      cueId,
      "",
      ccosId,
      "",
      debe,
      haber,
      origen,
      orden
    )
  }
}

case class AsientoItems(
                         items: List[AsientoItem],

                         /* only used in save */
                         itemDeleted: String
                       )

case class Asiento(
                    id: Int,

                    ids: AsientoId,
                    base: AsientoBase,
                    references: AsientoReferences,

                    items: AsientoItems,

                    createdAt: Date,
                    updatedAt: Date,
                    updatedBy: Int
                  ) {

  def this(
            id: Int,

            ids: AsientoId,
            base: AsientoBase,
            references: AsientoReferences,

            items: AsientoItems) = {

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
            ids: AsientoId,
            base: AsientoBase,
            references: AsientoReferences,

            items: AsientoItems) = {

    this(
      DBHelper.NoId,

      ids,
      base,
      references,

      items
    )
  }

}

case class AsientoParams(
                          from: String,
                          to: String,
                          docId: String,
                          docName: String,
                          empId: String,
                          empName: String
                         ) {
  def this(
            from: String,
            to: String,
            docId: String,
            empId: String
            ) = {
    this(
      from,
      to,
      docId,
      "",
      empId,
      ""
    )
  }
}

object AsientoParams {
  def apply(
             from: String,
             to: String,
             docId: String,
             empId: String
             ) = {

    new AsientoParams(
      from,
      to,
      docId,
      empId
    )
  }
}

object Asiento {

  lazy val GC = models.cairo.modules.general.C
  lazy val DT = models.cairo.modules.documentos.DT

  lazy val emptyAsientoItems = AsientoItems(List(), "")

  lazy val emptyAsientoReferences = AsientoReferences(0, 0, 0, "", "", false, false, "")

  lazy val emptyAsiento = Asiento(
    AsientoId(DBHelper.NoId, 0, ""),
    AsientoBase(U.NO_DATE, ""),
    emptyAsientoReferences,
    emptyAsientoItems
  )

  lazy val emptyAsientoParams = AsientoParams(
    DateFormatter.format(DateUtil.plusDays(DateUtil.currentTime, -60)),
    DateFormatter.format(DateUtil.currentTime), "0", "0")

  def apply(
             id: Int,

             ids: AsientoId,
             base: AsientoBase,
             references: AsientoReferences,

             items: AsientoItems
             ) = {

    new Asiento(
      id,

      ids,
      base,
      references,

      items
    )
  }

  def apply(
             id: Int,

             ids: AsientoId,
             base: AsientoBase,
             references: AsientoReferences
             ) = {

    new Asiento(
      id,

      ids,
      base,
      references,

      emptyAsientoItems
    )
  }

  def apply(
             ids: AsientoId,
             base: AsientoBase,
             references: AsientoReferences,

             items: AsientoItems
             ) = {

    new Asiento(
      ids,
      base,
      references,

      items
    )
  }

  def apply(
             ids: AsientoId,
             base: AsientoBase,
             references: AsientoReferences
             ) = {

    new Asiento(

      ids,
      base,
      references,

      emptyAsientoItems
    )
  }

  private val asientoItemParser: RowParser[AsientoItem] = {
    SqlParser.get[Int](C.ASI_ID) ~
    SqlParser.get[String](C.ASI_DESCRIP) ~
    SqlParser.get[Int](GC.CUE_ID) ~
    SqlParser.get[String](GC.CUE_NAME) ~
    SqlParser.get[Option[Int]](GC.CCOS_ID) ~
    SqlParser.get[Option[String]](GC.CCOS_NAME) ~
    SqlParser.get[BigDecimal](C.ASI_DEBE) ~
    SqlParser.get[BigDecimal](C.ASI_HABER) ~
    SqlParser.get[BigDecimal](C.ASI_ORIGEN) ~
    SqlParser.get[Int](C.ASI_ORDEN) map {
    case
        id ~
        descrip ~
        cueId ~
        cueName ~
        ccosId ~
        ccosName ~
        debe ~
        haber ~
        origen ~
        orden =>
      AsientoItem(
        id,
        descrip,
        cueId,
        cueName,
        ccosId.getOrElse(DBHelper.NoId),
        ccosName.getOrElse(""),
        debe.doubleValue(),
        haber.doubleValue(),
        origen.doubleValue(),
        orden
      )
    }
  }

  private val asientoParser: RowParser[Asiento] = {
    SqlParser.get[Int](C.AS_ID) ~
    SqlParser.get[Int](GC.DOC_ID) ~
    SqlParser.get[String](GC.DOC_NAME) ~
    SqlParser.get[Int](C.AS_NUMERO) ~
    SqlParser.get[String](C.AS_NRODOC) ~
    SqlParser.get[String](C.AS_DESCRIP) ~
    SqlParser.get[Int](GC.DOCT_ID) ~
    SqlParser.get[Option[Int]](C.DOCT_ID_CLIENTE) ~
    SqlParser.get[Option[Int]](C.ID_CLIENTE) ~
    SqlParser.get[Option[String]](C.DOC_CLIENTE) ~
    SqlParser.get[String](GC.TA_MASCARA) ~
    SqlParser.get[Int](GC.TA_PROPUESTO) ~
    SqlParser.get[Int](GC.EDITABLE) ~
    SqlParser.get[String](GC.EDIT_MSG) ~
    SqlParser.get[Date](C.AS_FECHA) ~
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
        createdAt ~
        updatedAt ~
        updatedBy =>
      Asiento(
        id,
        AsientoId(
          docId,
          docName,
          numero,
          nroDoc
        ),
        AsientoBase(
          fecha,
          descrip
        ),
        AsientoReferences(
          doctId,
          doctIdCliente.getOrElse(0),
          idCliente.getOrElse(0),
          docCliente.getOrElse(""),
          taMascara,
          taPropuesto != 0,
          editable != 0,
          editMsg
        ),
        emptyAsientoItems,
        createdAt,
        updatedAt,
        updatedBy)
    }
  }

  def create(user: CompanyUser, asiento: Asiento): Asiento = {
    save(user, asiento, false)
  }

  def update(user: CompanyUser, asiento: Asiento): Asiento = {
    save(user, asiento, false)
  }

  private def save(user: CompanyUser, asiento: Asiento, isFromWizard: Boolean): Asiento = {
    def getFields = {
      List(
        Field(C.AS_ID, asiento.id, FieldType.number),
        Field(GC.DOC_ID, asiento.ids.docId, FieldType.id),
        Field(GC.DOCT_ID, DT.ASIENTO_CONTABLE, FieldType.id),
        Field(C.AS_NRODOC, asiento.ids.nroDoc, FieldType.text),
        Field(C.AS_NUMERO, asiento.ids.numero, FieldType.number),
        Field(C.AS_DESCRIP, asiento.base.descrip, FieldType.text),
        Field(C.AS_FECHA, asiento.base.fecha, FieldType.date)
      )
    }

    def getItemFields(item: AsientoItem, asTMPId: Int) = {
      List(
        Field(C.AS_TMP_ID, asTMPId, FieldType.id),
        Field(C.ASI_ID, item.id, FieldType.number),
        Field(C.ASI_DESCRIP, item.descrip, FieldType.text),
        Field(GC.CUE_ID, item.cueId, FieldType.id),
        Field(GC.CCOS_ID, item.ccosId, FieldType.id),
        Field(C.ASI_ORDEN, item.orden, FieldType.integer),
        Field(C.ASI_DEBE, item.debe, FieldType.currency),
        Field(C.ASI_HABER, item.haber, FieldType.currency),
        Field(C.ASI_ORIGEN, item.origen, FieldType.currency)
      )
    }

    def getDeletedItemFields(asiId: Int, asTMPId: Int) = {
      List(
        Field(C.AS_TMP_ID, asTMPId, FieldType.id),
        Field(C.ASI_ID, asiId, FieldType.number),
        Field(C.AS_ID, asiento.id, FieldType.id)
      )
    }

    def throwError = {
      throwException(s"Error when saving ${C.ASIENTO}")
    }

    def throwException(message: String) = {
      throw new RuntimeException(message)
    }

    case class AsientoItemInfo(asTMPId: Int, item: AsientoItem)

    def saveItem(itemInfo: AsientoItemInfo) = {
      DBHelper.save(
        user,
        Register(
          C.ASIENTO_ITEM_TMP,
          C.ASI_TMP_ID,
          DBHelper.NoId,
          false,
          false,
          false,
          getItemFields(itemInfo.item, itemInfo.asTMPId)),
        true
      ) match {
        case SaveResult(false, id) => throwError
        case _ =>
      }
    }

    def saveDeletedItem(asTMPId: Int)(asiId: String) = {
      val id = G.getIntOrZero(asiId)
      if(id != 0) {
        DBHelper.save(
          user,
          Register(
            C.ASIENTO_ITEM_BORRADO_TMP,
            C.ASIB_TMP_ID,
            DBHelper.NoId,
            false,
            false,
            false,
            getDeletedItemFields(id, asTMPId)),
          true
        ) match {
          case SaveResult(false, id) => throwError
          case _ =>
        }
      }
    }

    def saveItems(asTMPId: Int) = {
      asiento.items.items.map(item => saveItem(AsientoItemInfo(asTMPId, item)))
      asiento.items.itemDeleted.split(",").map(saveDeletedItem(asTMPId))
    }

    case class RowResult(rowType: String, id: Int, message: String)

    def executeSave(asTMPId: Int): List[RowResult] = {

      DB.withTransaction(user.database.database) { implicit connection =>
        val sql = "select * from sp_doc_asiento_save(?, ?)"
        val cs = connection.prepareStatement(sql)

        cs.setInt(1, user.masterUserId)
        cs.setInt(2, asTMPId)

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
          *    r       reasursor
          * );
          *
          *
          * ex: CREATE OR REPLACE FUNCTION sp_doc_asiento_save( params )
          *     RETURNS SETOF row_result AS ...
          *
          * the field type is used to identify the value in the row. there are three
          * kind of types: resultset, success, id
          * for first two (resultset and success) the value of type is string with
          * one of these two values ex: 'resultset' or 'success'
          * when type == 'resultset' the field r must be not null and contain a ResultSet
          * when type == 'success' the id field can contain 0 (False) or not 0 (-1,1 or any other number but NO 0) (True)
          * the last kind of type is id. in this case the id must be the name of a column like as_id, as_id, pr_id, etc
          * it can be any column name. if the type is an integer like in as_id, as_id or any other id column the field id
          * is used to contain the returned value
          * if the type is any other the column message is used
          *
          * there are two special types for id: 'INFO', 'ERROR'
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
                case "as_id" => RowResult("as_id", rs.getInt(2), "")
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
            Logger.error(s"can't save ${C.ASIENTO} with id ${asiento.id} for user ${user.toString}. Error ${e.toString}")
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
            case RowResult("as_id", id, m) => id
            case _ => 0
          }
          findId(t, _id)
        }
      }
      findId(messages, 0)
    }

    DBHelper.save(
      user,
      Register(
        C.ASIENTO_TMP,
        C.AS_TMP_ID,
        DBHelper.NoId,
        false,
        true,
        true,
        getFields),
      true
    ) match {
      case SaveResult(true, asTMPId) => {
        saveItems(asTMPId)
        val messagesAndId = executeSave(asTMPId)
        val id = getIdFromMessages(messagesAndId)
        load(user, id).getOrElse(throwError)
      }
      case SaveResult(false, id) => throwError
    }

  }

  def load(user: CompanyUser, id: Int): Option[Asiento] = {

    DB.withTransaction(user.database.database) { implicit connection =>

      val sql = "{call sp_doc_asiento_get(?, ?, ?, ?)}"
      val cs = connection.prepareCall(sql)

      cs.setInt(1, user.cairoCompanyId)
      cs.setInt(2, id)
      cs.setInt(3, user.masterUserId)
      cs.registerOutParameter(4, Types.OTHER)

      try {
        cs.execute()

        val rs = cs.getObject(4).asInstanceOf[java.sql.ResultSet]
        Sql.as(asientoParser.singleOpt, rs)

      } catch {
        case NonFatal(e) => {
          Logger.error(s"can't get ${C.ASIENTO} with id $id for user ${user.toString}. Error ${e.toString}")
          throw e
        }
      } finally {
        cs.close
      }
    }
  }

  private def loadAsientoItems(user: CompanyUser, id: Int) = {
    val items = loadItems(user, id)
    AsientoItems(items, "")
  }

  private def loadItems(user: CompanyUser, id: Int) = {

    DB.withTransaction(user.database.database) { implicit connection =>

      val sql = "{call sp_doc_asiento_get_items(?, ?)}"
      val cs = connection.prepareCall(sql)

      cs.setInt(1, id)
      cs.registerOutParameter(2, Types.OTHER)

      try {
        cs.execute()

        val rs = cs.getObject(2).asInstanceOf[java.sql.ResultSet]

        Sql.as(asientoItemParser.*, rs)

      } catch {
        case NonFatal(e) => {
          Logger.error(s"can't get ${C.ASIENTO_ITEM} with id $id for user ${user.toString}. Error ${e.toString}")
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
        SQL("sp_doc_asiento_delete {id}, {empId}, {usId}")
          .on('id -> id, 'empId -> user.cairoCompanyId, 'usId -> user.masterUserId)
          .executeUpdate
      } catch {
        case NonFatal(e) => {
          Logger.error(s"can't delete a ${C.ASIENTO}. ${C.AS_ID} id: $id. Error ${e.toString}")
          throw e
        }
      }
    }
  }

  def get(user: CompanyUser, id: Int): Asiento = {
    load(user, id) match {
      case Some(p) => {
        Asiento(
          p.id,

          p.ids,
          p.base,
          p.references,

          loadAsientoItems(user, id)
        )
      }
      case None => emptyAsiento
    }
  }

  val K_FECHAINI  = 1
  val K_FECHAFIN  = 2
  val K_DOC_ID    = 9
  val K_EMP_ID    = 100

  def saveParams(user: CompanyUser, asientoParams: AsientoParams): AsientoParams = {
    val baseFields = List(
      Field(GC.EMP_ID, user.cairoCompanyId, FieldType.id),
      Field(GC.US_ID, user.masterUserId, FieldType.id),
      Field(GC.PRE_ID, S.LIST_ASIENTO, FieldType.id)
    )

    def throwException = {
      throw new RuntimeException(s"Error when saving ${C.ASIENTO}")
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
        case SaveResult(false, id) => throwException
      }
    }

    val paramList = List(
      List(
        Field(GC.LDP_ID, K_FECHAINI, FieldType.integer),
        Field(GC.LDP_ORDEN, 0, FieldType.integer),
        Field(GC.LDP_VALOR, asientoParams.from, FieldType.text)
      ),
      List(
        Field(GC.LDP_ID, K_FECHAFIN, FieldType.integer),
        Field(GC.LDP_ORDEN, 10, FieldType.integer),
        Field(GC.LDP_VALOR, asientoParams.to, FieldType.text)
      ),
      List(
        Field(GC.LDP_ID, K_DOC_ID, FieldType.integer),
        Field(GC.LDP_ORDEN, 60, FieldType.integer),
        Field(GC.LDP_VALOR, asientoParams.docId, FieldType.text)
      ),
      List(
        Field(GC.LDP_ID, K_EMP_ID, FieldType.integer),
        Field(GC.LDP_ORDEN, 80, FieldType.integer),
        Field(GC.LDP_VALOR, asientoParams.empId, FieldType.text)
      )
    )

    DB.withConnection(user.database.database) { implicit connection =>
      try {
        SQL(s"""DELETE FROM ListaDocumentoParametro
              | WHERE pre_id = {preId}
              | AND (emp_id is null or emp_id = {empId})
              | AND us_id = {usId}""".stripMargin)
          .on(
            'preId -> S.LIST_ASIENTO,
            'empId -> user.cairoCompanyId,
            'usId -> user.masterUserId
          )
          .executeUpdate
      } catch {
        case NonFatal(e) => {
          Logger.error(s"can't save parameters for Asiento")
          throw e
        }
      }
    }

    paramList.map(param => saveParam(baseFields ::: param))

    loadParams(user).getOrElse(throwException)
  }

  def loadParams(user: CompanyUser): Option[AsientoParams] = {

    val params = DocumentListParam.load(user, S.LIST_ASIENTO)

    if(params.isEmpty) {
      Some(emptyAsientoParams)
    }
    else {
      val doc = DocumentListParam.getParamValue(
        user, K_DOC_ID, params, emptyAsientoParams.docId,
        GC.DOCUMENTO, GC.DOC_ID, GC.DOC_NAME
      )
      val emp = DocumentListParam.getParamValue(
        user, K_EMP_ID, params, emptyAsientoParams.empId,
        GC.EMPRESA, GC.EMP_ID, GC.EMP_NAME
      )

      Some(
        AsientoParams(
          DocumentListParam.getParamValue(K_FECHAINI, params, emptyAsientoParams.from),
          DocumentListParam.getParamValue(K_FECHAFIN, params, emptyAsientoParams.to),
          doc.id,
          doc.value,
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
           empId: Option[String]): Recordset = {

    DB.withTransaction(user.database.database) { implicit connection =>

      val sql = "{call sp_lsdoc_asientos(?, ?, ?, ?, ?, ?)}"
      val cs = connection.prepareCall(sql)

      cs.setInt(1, user.masterUserId)
      cs.setDate(2, new java.sql.Date(from.getTime()))
      cs.setDate(3, new java.sql.Date(to.getTime()))
      cs.setString(4, docId.getOrElse("0"))
      cs.setString(5, empId.getOrElse("0"))
      cs.registerOutParameter(6, Types.OTHER)

      try {
        cs.execute()

        val rs = cs.getObject(6).asInstanceOf[java.sql.ResultSet]
        Recordset.load(rs)

      } catch {
        case NonFatal(e) => {
          Logger.error(s"can't get listing of asientos for user ${user.toString}. Error ${e.toString}")
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