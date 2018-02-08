package models.cairo.modules.tesoreria

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

case class DepositoBancoId(
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

object DepositoBancoId {

  def apply(
             docId: Int,
             numero: Int,
             nroDoc: String) = {

    new DepositoBancoId(
      docId,
      numero,
      nroDoc)
  }
}

case class DepositoBancoReferences(
                                      doctId: Int,
                                      doctName: String,
                                      taMascara: String,
                                      taPropuesto: Boolean,
                                      firmado: Boolean,
                                      asId: Int,
                                      editable: Boolean,
                                      editMsg: String
                                    ) {
  def this(
            doctId: Int,
            taMascara: String,
            taPropuesto: Boolean,
            firmado: Boolean,
            asId: Int,
            editable: Boolean,
            editMsg: String
          ) = {
    this(
      doctId,
      "",
      taMascara,
      taPropuesto,
      firmado,
      asId,
      editable,
      editMsg
    )
  }
}

object DepositoBancoReferences {

  def apply(
             doctId: Int,
             taMascara: String,
             taPropuesto: Boolean,
             firmado: Boolean,
             asId: Int,
             editable: Boolean,
             editMsg: String
           ) = {

    new DepositoBancoReferences(
      doctId,
      taMascara,
      taPropuesto,
      firmado,
      asId,
      editable,
      editMsg
    )
  }
}

case class DepositoBancoBase(
                                bcoId: Int,
                                bcoName: String,
                                estId: Int,
                                estName: String,
                                ccosId: Int,
                                ccosName: String,
                                sucId: Int,
                                sucName: String,
                                lgjId: Int,
                                lgjCode: String,
                                descrip: String,
                                grabarAsiento: Boolean
                              ) {
  def this(
            bcoId: Int,
            estId: Int,
            ccosId: Int,
            sucId: Int,
            lgjId: Int,
            descrip: String,
            grabarAsiento: Boolean
          ) = {
    this(
      bcoId,
      "",
      estId,
      "",
      ccosId,
      "",
      sucId,
      "",
      lgjId,
      "",
      descrip,
      grabarAsiento
    )
  }
}

object DepositoBancoBase {

  def apply(
             bcoId: Int,
             estId: Int,
             ccosId: Int,
             sucId: Int,
             lgjId: Int,
             descrip: String,
             grabarAsiento: Boolean) = {

    new DepositoBancoBase(
      bcoId,
      estId,
      ccosId,
      sucId,
      lgjId,
      descrip,
      grabarAsiento)
  }
}

case class DepositoBancoItemBase(
                                    descrip: String,
                                    cueIdDebe: Int,
                                    cueNameDebe: String,
                                    cueIdHaber: Int,
                                    cueNameHaber: String,
                                    ccosId: Int,
                                    ccosName: String,
                                    orden: Int
                                  )

object DepositoBancoItemBase {

  def apply(descrip: String,
            cueIdDebe: Int,
            cueIdHaber: Int,
            ccosId: Int,
            orden: Int) = {

    new DepositoBancoItemBase(
      descrip,
      cueIdDebe,
      "",
      cueIdHaber,
      "",
      ccosId,
      "",
      orden
    )
  }
}

case class DepositoBancoItemTotals(
                                      importe: Double,
                                      importeOrigen: Double
                                    )

case class DepositoBancoItemMoneda(
                                      monId: Int,
                                      monName: String
                                    )

case class DepositoBancoItemCheque(
                                      id: Int,
                                      base: DepositoBancoItemBase,
                                      moneda: DepositoBancoItemMoneda,
                                      totals: DepositoBancoItemTotals,
                                      bcoId: Int,
                                      bcoName: String,
                                      chqId: Int,
                                      chqName: String,
                                      cheqId: Int,
                                      numero: Int,
                                      numeroDoc: String,
                                      fechaCobro: Date,
                                      fechaVto: Date,
                                      cleId: Int,
                                      cleName: String
                                    )

object DepositoBancoItemCheque {

  def apply(id: Int,
            base: DepositoBancoItemBase,
            monId: Int,
            totals: DepositoBancoItemTotals,
            bcoId: Int,
            chqId: Int,
            cheqId: Int,
            numeroDoc: String,
            fechaCobro: Date,
            fechaVto: Date,
            cleId: Int) = {

    new DepositoBancoItemCheque(
      id,
      base,
      DepositoBancoItemMoneda(monId, ""),
      totals,
      bcoId,
      "",
      chqId,
      "",
      cheqId,
      0,
      numeroDoc,
      fechaCobro,
      fechaVto,
      cleId,
      ""
    )
  }
}

case class DepositoBancoItemChequeT(
                                       id: Int,
                                       base: DepositoBancoItemBase,
                                       moneda: DepositoBancoItemMoneda,
                                       totals: DepositoBancoItemTotals,
                                       bcoId: Int,
                                       bcoName: String,
                                       cheqId: Int,
                                       numero: Int,
                                       numeroDoc: String,
                                       fechaCobro: Date,
                                       fechaVto: Date,
                                       cleId: Int,
                                       cleName: String
                                     )

object DepositoBancoItemChequeT {

  def apply(id: Int,
            base: DepositoBancoItemBase,
            monId: Int,
            totals: DepositoBancoItemTotals,
            bcoId: Int,
            cheqId: Int,
            numeroDoc: String,
            fechaCobro: Date,
            fechaVto: Date,
            cleId: Int) = {

    new DepositoBancoItemChequeT(
      id,
      base,
      DepositoBancoItemMoneda(monId, ""),
      totals,
      bcoId,
      "",
      cheqId,
      0,
      numeroDoc,
      fechaCobro,
      fechaVto,
      cleId,
      ""
    )
  }
}

case class DepositoBancoItemEfectivo(
                                        id: Int,
                                        base: DepositoBancoItemBase,
                                        moneda: DepositoBancoItemMoneda,
                                        totals: DepositoBancoItemTotals
                                      )

object DepositoBancoItemEfectivo {

  def apply(id: Int,
            base: DepositoBancoItemBase,
            monId: Int,
            totals: DepositoBancoItemTotals) = {

    new DepositoBancoItemEfectivo(
      id,
      base,
      DepositoBancoItemMoneda(monId, ""),
      totals
    )
  }
}

case class DepositoBancoItems(
                                 cheques: List[DepositoBancoItemCheque],
                                 chequesT: List[DepositoBancoItemChequeT],
                                 efectivo: List[DepositoBancoItemEfectivo],

                                 /* only used in save */
                                 chequeDeleted: String,
                                 chequeTDeleted: String,
                                 efectivoDeleted: String
                               )

case class DepositoBanco(
                            id: Int,

                            ids: DepositoBancoId,
                            base: DepositoBancoBase,
                            references: DepositoBancoReferences,
                            fecha: Date,
                            cotizacion: Double,
                            total: Double,

                            items: DepositoBancoItems,

                            createdAt: Date,
                            updatedAt: Date,
                            updatedBy: Int
                          ) {

  def this(
            id: Int,

            ids: DepositoBancoId,
            base: DepositoBancoBase,
            references: DepositoBancoReferences,
            fecha: Date,
            cotizacion: Double,
            total: Double,

            items: DepositoBancoItems) = {

    this(
      id,

      ids,
      base,
      references,
      fecha,
      cotizacion,
      total,

      items,

      DateUtil.currentTime,
      DateUtil.currentTime,
      DBHelper.NoId)
  }

  def this(
            ids: DepositoBancoId,
            base: DepositoBancoBase,
            references: DepositoBancoReferences,
            fecha: Date,
            cotizacion: Double,
            total: Double,

            items: DepositoBancoItems) = {

    this(
      DBHelper.NoId,

      ids,
      base,
      references,
      fecha,
      cotizacion,
      total,

      items
    )
  }

}

case class DepositoBancoParams(
                                  from: String,
                                  to: String,
                                  bcoId: String,
                                  bcoName: String,
                                  estId: String,
                                  estName: String,
                                  ccosId: String,
                                  ccosName: String,
                                  sucId: String,
                                  sucName: String,
                                  docId: String,
                                  docName: String,
                                  empId: String,
                                  empName: String
                                ) {
  def this(
            from: String,
            to: String,
            bcoId: String,
            estId: String,
            ccosId: String,
            sucId: String,
            docId: String,
            empId: String
          ) = {
    this(
      from,
      to,
      bcoId,
      "",
      estId,
      "",
      ccosId,
      "",
      sucId,
      "",
      docId,
      "",
      empId,
      ""
    )
  }
}

object DepositoBancoParams {
  def apply(
             from: String,
             to: String,
             bcoId: String,
             estId: String,
             ccosId: String,
             sucId: String,
             docId: String,
             empId: String
           ) = {

    new DepositoBancoParams(
      from,
      to,
      bcoId,
      estId,
      ccosId,
      sucId,
      docId,
      empId
    )
  }
}

object DepositoBanco {

  lazy val GC = models.cairo.modules.general.C

  lazy val emptyDepositoBancoItems = DepositoBancoItems(List(), List(), List(), "", "", "")

  lazy val emptyDepositoBancoReferences = DepositoBancoReferences(DBHelper.NoId, "", false, false, DBHelper.NoId, false, "")

  lazy val emptyDepositoBanco = DepositoBanco(
    DepositoBancoId(DBHelper.NoId, 0, ""),
    DepositoBancoBase(DBHelper.NoId, DBHelper.NoId, DBHelper.NoId, DBHelper.NoId, DBHelper.NoId, "", false),
    emptyDepositoBancoReferences,
    U.NO_DATE,
    0,
    0.0,
    emptyDepositoBancoItems
  )

  lazy val emptyDepositoBancoParams = DepositoBancoParams(
    DateFormatter.format(DateUtil.plusDays(DateUtil.currentTime, -60)),
    DateFormatter.format(DateUtil.currentTime), "0", "", "0", "", "0", "", "0", "", "0", "", "0", "")

  def apply(
             id: Int,

             ids: DepositoBancoId,
             base: DepositoBancoBase,
             references: DepositoBancoReferences,
             fecha: Date,
             cotizacion: Double,
             total: Double,

             items: DepositoBancoItems
           ) = {

    new DepositoBanco(
      id,

      ids,
      base,
      references,
      fecha,
      cotizacion,
      total,

      items
    )
  }

  def apply(
             id: Int,

             ids: DepositoBancoId,
             base: DepositoBancoBase,
             references: DepositoBancoReferences,
             fecha: Date,
             cotizacion: Double,
             total: Double
           ) = {

    new DepositoBanco(
      id,

      ids,
      base,
      references,
      fecha,
      cotizacion,
      total,

      emptyDepositoBancoItems
    )
  }

  def apply(
             ids: DepositoBancoId,
             base: DepositoBancoBase,
             references: DepositoBancoReferences,
             fecha: Date,
             cotizacion: Double,
             total: Double,

             items: DepositoBancoItems
           ) = {

    new DepositoBanco(
      ids,
      base,
      references,
      fecha,
      cotizacion,
      total,

      items
    )
  }

  def apply(
             ids: DepositoBancoId,
             base: DepositoBancoBase,
             references: DepositoBancoReferences,
             fecha: Date,
             cotizacion: Double,
             total: Double
           ) = {

    new DepositoBanco(

      ids,
      base,
      references,
      fecha,
      cotizacion,
      total,

      emptyDepositoBancoItems
    )
  }

  private val depositoBancoItemChequeParser: RowParser[DepositoBancoItemCheque] = {
    SqlParser.get[Int](C.DBCOI_ID) ~
      SqlParser.get[String](C.DBCOI_DESCRIP) ~
      SqlParser.get[Int](C.CUE_ID_DEBE) ~
      SqlParser.get[String](C.CUE_DEBE_NAME) ~
      SqlParser.get[Int](C.CUE_ID_HABER) ~
      SqlParser.get[String](C.CUE_HABER_NAME) ~
      SqlParser.get[Option[Int]](GC.CCOS_ID) ~
      SqlParser.get[Option[String]](GC.CCOS_NAME) ~
      SqlParser.get[Int](GC.MON_ID) ~
      SqlParser.get[String](GC.MON_NAME) ~
      SqlParser.get[BigDecimal](C.DBCOI_IMPORTE) ~
      SqlParser.get[BigDecimal](C.DBCOI_IMPORTE_ORIGEN) ~
      SqlParser.get[Int](GC.BCO_ID) ~
      SqlParser.get[String](GC.BCO_NAME) ~
      SqlParser.get[Int](GC.CHQ_ID) ~
      SqlParser.get[String](GC.CHQ_CODE) ~
      SqlParser.get[Int](C.CHEQ_ID) ~
      SqlParser.get[Int](C.CHEQ_NUMERO) ~
      SqlParser.get[String](C.CHEQ_NUMERO_DOC) ~
      SqlParser.get[Date](C.CHEQ_FECHA_COBRO) ~
      SqlParser.get[Date](C.CHEQ_FECHA_VTO) ~
      SqlParser.get[Int](GC.CLE_ID) ~
      SqlParser.get[String](GC.CLE_NAME) ~
      SqlParser.get[Int](C.DBCOI_ORDEN) map {
      case
        id ~
          descrip ~
          cueIdDebe ~
          cueDebeName ~
          cueIdHaber ~
          cueHaberName ~
          ccosId ~
          ccosName ~
          monId ~
          monName ~
          importe ~
          importeOrigen ~
          bcoId ~
          bcoName ~
          chqId ~
          chqName ~
          cheqId ~
          numero ~
          numeroDoc ~
          fechaCobro ~
          fechaVto ~
          cleId ~
          cleName ~
          orden =>
        DepositoBancoItemCheque(
          id,
          DepositoBancoItemBase(
            descrip,
            cueIdDebe,
            cueDebeName,
            cueIdHaber,
            cueHaberName,
            ccosId.getOrElse(DBHelper.NoId),
            ccosName.getOrElse(""),
            orden
          ),
          DepositoBancoItemMoneda(monId, monName),
          DepositoBancoItemTotals(
            importe.doubleValue(),
            importeOrigen.doubleValue()
          ),
          bcoId,
          bcoName,
          chqId,
          chqName,
          cheqId,
          numero,
          numeroDoc,
          fechaCobro,
          fechaVto,
          cleId,
          cleName
        )
    }
  }

  private val depositoBancoItemChequeTParser: RowParser[DepositoBancoItemChequeT] = {
    SqlParser.get[Int](C.DBCOI_ID) ~
      SqlParser.get[String](C.DBCOI_DESCRIP) ~
      SqlParser.get[Int](C.CUE_ID_DEBE) ~
      SqlParser.get[String](C.CUE_DEBE_NAME) ~
      SqlParser.get[Int](C.CUE_ID_HABER) ~
      SqlParser.get[String](C.CUE_HABER_NAME) ~
      SqlParser.get[Option[Int]](GC.CCOS_ID) ~
      SqlParser.get[Option[String]](GC.CCOS_NAME) ~
      SqlParser.get[Int](GC.MON_ID) ~
      SqlParser.get[String](GC.MON_NAME) ~
      SqlParser.get[BigDecimal](C.DBCOI_IMPORTE) ~
      SqlParser.get[BigDecimal](C.DBCOI_IMPORTE_ORIGEN) ~
      SqlParser.get[Int](GC.BCO_ID) ~
      SqlParser.get[String](GC.BCO_NAME) ~
      SqlParser.get[Int](C.CHEQ_ID) ~
      SqlParser.get[Int](C.CHEQ_NUMERO) ~
      SqlParser.get[String](C.CHEQ_NUMERO_DOC) ~
      SqlParser.get[Date](C.CHEQ_FECHA_COBRO) ~
      SqlParser.get[Date](C.CHEQ_FECHA_VTO) ~
      SqlParser.get[Int](GC.CLE_ID) ~
      SqlParser.get[String](GC.CLE_NAME) ~
      SqlParser.get[Int](C.DBCOI_ORDEN) map {
      case
        id ~
          descrip ~
          cueIdDebe ~
          cueDebeName ~
          cueIdHaber ~
          cueHaberName ~
          ccosId ~
          ccosName ~
          monId ~
          monName ~
          importe ~
          importeOrigen ~
          bcoId ~
          bcoName ~
          cheqId ~
          numero ~
          numeroDoc ~
          fechaCobro ~
          fechaVto ~
          cleId ~
          cleName ~
          orden =>
        DepositoBancoItemChequeT(
          id,
          DepositoBancoItemBase(
            descrip,
            cueIdDebe,
            cueDebeName,
            cueIdHaber,
            cueHaberName,
            ccosId.getOrElse(DBHelper.NoId),
            ccosName.getOrElse(""),
            orden
          ),
          DepositoBancoItemMoneda(monId, monName),
          DepositoBancoItemTotals(
            importe.doubleValue(),
            importeOrigen.doubleValue()
          ),
          bcoId,
          bcoName,
          cheqId,
          numero,
          numeroDoc,
          fechaCobro,
          fechaVto,
          cleId,
          cleName
        )
    }
  }

  private val depositoBancoItemEfectivoParser: RowParser[DepositoBancoItemEfectivo] = {
    SqlParser.get[Int](C.DBCOI_ID) ~
      SqlParser.get[String](C.DBCOI_DESCRIP) ~
      SqlParser.get[Int](C.CUE_ID_DEBE) ~
      SqlParser.get[String](C.CUE_DEBE_NAME) ~
      SqlParser.get[Int](C.CUE_ID_HABER) ~
      SqlParser.get[String](C.CUE_HABER_NAME) ~
      SqlParser.get[Option[Int]](GC.CCOS_ID) ~
      SqlParser.get[Option[String]](GC.CCOS_NAME) ~
      SqlParser.get[Int](GC.MON_ID) ~
      SqlParser.get[String](GC.MON_NAME) ~
      SqlParser.get[BigDecimal](C.DBCOI_IMPORTE) ~
      SqlParser.get[BigDecimal](C.DBCOI_IMPORTE_ORIGEN) ~
      SqlParser.get[Int](C.DBCOI_ORDEN) map {
      case
        id ~
          descrip ~
          cueIdDebe ~
          cueDebeName ~
          cueIdHaber ~
          cueHaberName ~
          ccosId ~
          ccosName ~
          monId ~
          monName ~
          importe ~
          importeOrigen ~
          orden =>
        DepositoBancoItemEfectivo(
          id,
          DepositoBancoItemBase(
            descrip,
            cueIdDebe,
            cueDebeName,
            cueIdHaber,
            cueHaberName,
            ccosId.getOrElse(DBHelper.NoId),
            ccosName.getOrElse(""),
            orden
          ),
          DepositoBancoItemMoneda(monId, monName),
          DepositoBancoItemTotals(
            importe.doubleValue(),
            importeOrigen.doubleValue()
          )
        )
    }
  }

  private val depositoBancoParser: RowParser[DepositoBanco] = {
    SqlParser.get[Int](C.DBCO_ID) ~
      SqlParser.get[Int](GC.DOC_ID) ~
      SqlParser.get[String](GC.DOC_NAME) ~
      SqlParser.get[Int](C.DBCO_NUMERO) ~
      SqlParser.get[String](C.DBCO_NRODOC) ~
      SqlParser.get[Int](GC.BCO_ID) ~
      SqlParser.get[String](GC.BCO_NAME) ~
      SqlParser.get[Int](GC.EST_ID) ~
      SqlParser.get[String](GC.EST_NAME) ~
      SqlParser.get[Option[Int]](GC.CCOS_ID) ~
      SqlParser.get[Option[String]](GC.CCOS_NAME) ~
      SqlParser.get[Int](GC.SUC_ID) ~
      SqlParser.get[String](GC.SUC_NAME) ~
      SqlParser.get[Option[Int]](GC.LGJ_ID) ~
      SqlParser.get[Option[String]](GC.LGJ_CODE) ~
      SqlParser.get[String](C.DBCO_DESCRIP) ~
      SqlParser.get[Int](C.DBCO_GRABAR_ASIENTO) ~
      SqlParser.get[Int](GC.DOCT_ID) ~
      SqlParser.get[String](GC.DOCT_NAME) ~
      SqlParser.get[String](GC.TA_MASCARA) ~
      SqlParser.get[Int](GC.TA_PROPUESTO) ~
      SqlParser.get[Int](C.DBCO_FIRMADO) ~
      SqlParser.get[Option[Int]](C.AS_ID) ~
      SqlParser.get[Int](GC.EDITABLE) ~
      SqlParser.get[String](GC.EDIT_MSG) ~
      SqlParser.get[Date](C.DBCO_FECHA) ~
      SqlParser.get[BigDecimal](C.DBCO_COTIZACION) ~
      SqlParser.get[BigDecimal](C.DBCO_TOTAL) ~
      SqlParser.get[Date](DBHelper.CREATED_AT) ~
      SqlParser.get[Date](DBHelper.UPDATED_AT) ~
      SqlParser.get[Int](DBHelper.UPDATED_BY) map {
      case
        id ~
          docId ~
          docName ~
          numero ~
          nroDoc ~
          bcoId ~
          bcoName ~
          estId ~
          estName ~
          ccosId ~
          ccosName ~
          sucId ~
          sucName ~
          lgjId ~
          lgjCode ~
          descrip ~
          grabarAsiento ~
          doctId ~
          doctName ~
          taMascara ~
          taPropuesto ~
          firmado ~
          asId ~
          editable ~
          editMsg ~
          fecha ~
          cotizacion ~
          total ~
          createdAt ~
          updatedAt ~
          updatedBy =>
        DepositoBanco(
          id,
          DepositoBancoId(
            docId,
            docName,
            numero,
            nroDoc
          ),
          DepositoBancoBase(
            bcoId,
            bcoName,
            estId,
            estName,
            ccosId.getOrElse(DBHelper.NoId),
            ccosName.getOrElse(""),
            sucId,
            sucName,
            lgjId.getOrElse(DBHelper.NoId),
            lgjCode.getOrElse(""),
            descrip,
            grabarAsiento != 0
          ),
          DepositoBancoReferences(
            doctId,
            doctName,
            taMascara,
            taPropuesto != 0,
            firmado != 0,
            asId.getOrElse(DBHelper.NoId),
            editable != 0,
            editMsg
          ),
          fecha,
          cotizacion.doubleValue(),
          total.doubleValue(),
          emptyDepositoBancoItems,
          createdAt,
          updatedAt,
          updatedBy)
    }
  }

  def createDepositoBanco(user: CompanyUser, depositoBanco: DepositoBanco): DepositoBanco = {
    save(user, depositoBanco)
  }

  def create(user: CompanyUser, depositoBanco: DepositoBanco): DepositoBanco = {
    save(user, depositoBanco)
  }

  def update(user: CompanyUser, depositoBanco: DepositoBanco): DepositoBanco = {
    save(user, depositoBanco)
  }

  private def save(user: CompanyUser, depositoBanco: DepositoBanco): DepositoBanco = {
    def getFields = {
      List(
        Field(C.DBCO_ID, depositoBanco.id, FieldType.number),
        Field(GC.DOC_ID, depositoBanco.ids.docId, FieldType.id),
        Field(C.DBCO_NRODOC, depositoBanco.ids.nroDoc, FieldType.text),
        Field(C.DBCO_NUMERO, depositoBanco.ids.numero, FieldType.number),

        Field(GC.BCO_ID, depositoBanco.base.bcoId, FieldType.id),
        Field(GC.EST_ID, depositoBanco.base.estId, FieldType.id),
        Field(GC.CCOS_ID, depositoBanco.base.ccosId, FieldType.id),
        Field(GC.SUC_ID, depositoBanco.base.sucId, FieldType.id),
        Field(GC.LGJ_ID, depositoBanco.base.lgjId, FieldType.id),
        Field(C.DBCO_DESCRIP, depositoBanco.base.descrip, FieldType.text),
        Field(C.DBCO_GRABAR_ASIENTO, Register.boolToInt(depositoBanco.base.grabarAsiento), FieldType.boolean),

        Field(C.DBCO_FECHA, depositoBanco.fecha, FieldType.date),

        Field(C.DBCO_COTIZACION, depositoBanco.cotizacion, FieldType.currency),

        Field(C.DBCO_TOTAL, depositoBanco.total, FieldType.currency)
      )
    }

    def getChequeFields(item: DepositoBancoItemCheque, dbcoTMPId: Int) = {
      List(
        Field(C.DBCO_TMP_ID, dbcoTMPId, FieldType.id),
        Field(C.DBCOI_ID, item.id, FieldType.number),
        Field(C.DBCOI_TIPO, C.MOVIMIENTO_FONDO_ITEM_TIPO_CHEQUES, FieldType.number),
        Field(C.DBCOI_DESCRIP, item.base.descrip, FieldType.text),
        Field(C.CUE_ID_DEBE, item.base.cueIdDebe, FieldType.id),
        Field(C.CUE_ID_HABER, item.base.cueIdHaber, FieldType.id),
        Field(GC.CCOS_ID, item.base.ccosId, FieldType.id),
        Field(GC.BCO_ID, item.bcoId, FieldType.id),
        Field(GC.CLE_ID, item.cleId, FieldType.id),
        Field(GC.MON_ID, item.moneda.monId, FieldType.id),
        Field(C.DBCOI_ORDEN, item.base.orden, FieldType.integer),
        Field(C.DBCOI_IMPORTE, item.totals.importe, FieldType.currency),
        Field(C.DBCOI_IMPORTE_ORIGEN, item.totals.importeOrigen, FieldType.currency)
      )
    }

    def getChequeTFields(item: DepositoBancoItemChequeT, dbcoTMPId: Int) = {
      List(
        Field(C.DBCO_TMP_ID, dbcoTMPId, FieldType.id),
        Field(C.DBCOI_ID, item.id, FieldType.number),
        Field(C.DBCOI_TIPO, C.MOVIMIENTO_FONDO_ITEM_TIPO_CHEQUEST, FieldType.number),
        Field(C.DBCOI_DESCRIP, item.base.descrip, FieldType.text),
        Field(C.CUE_ID_DEBE, item.base.cueIdDebe, FieldType.id),
        Field(C.CUE_ID_HABER, item.base.cueIdHaber, FieldType.id),
        Field(GC.CCOS_ID, item.base.ccosId, FieldType.id),
        Field(C.DBCOI_ORDEN, item.base.orden, FieldType.integer),
        Field(C.DBCOI_IMPORTE, item.totals.importe, FieldType.currency),
        Field(C.DBCOI_IMPORTE_ORIGEN, item.totals.importeOrigen, FieldType.currency)
      )
    }

    def getEfectivoFields(item: DepositoBancoItemEfectivo, dbcoTMPId: Int) = {
      List(
        Field(C.DBCO_TMP_ID, dbcoTMPId, FieldType.id),
        Field(C.DBCOI_ID, item.id, FieldType.number),
        Field(C.DBCOI_TIPO, C.MOVIMIENTO_FONDO_ITEM_TIPO_EFECTIVO, FieldType.number),
        Field(C.DBCOI_DESCRIP, item.base.descrip, FieldType.text),
        Field(C.CUE_ID_DEBE, item.base.cueIdDebe, FieldType.id),
        Field(C.CUE_ID_HABER, item.base.cueIdHaber, FieldType.id),
        Field(GC.CCOS_ID, item.base.ccosId, FieldType.id),
        Field(C.DBCOI_ORDEN, item.base.orden, FieldType.integer),
        Field(C.DBCOI_IMPORTE, item.totals.importe, FieldType.currency),
        Field(C.DBCOI_IMPORTE_ORIGEN, item.totals.importeOrigen, FieldType.currency)
      )
    }

    def getDeletedItemFields(dbcoiId: Int, dbcoTMPId: Int) = {
      List(
        Field(C.DBCO_TMP_ID, dbcoTMPId, FieldType.id),
        Field(C.DBCOI_ID, dbcoiId, FieldType.number),
        Field(C.DBCO_ID, depositoBanco.id, FieldType.id)
      )
    }

    def throwError = {
      throwException(s"Error when saving ${C.MOVIMIENTO_FONDO}")
    }

    def throwException(message: String) = {
      throw new RuntimeException(message)
    }

    case class DepositoBancoChequeInfo(dbcoTMPId: Int, item: DepositoBancoItemCheque)

    def saveCheque(itemInfo: DepositoBancoChequeInfo) = {
      DBHelper.save(
        user,
        Register(
          C.MOVIMIENTO_FONDO_ITEM_TMP,
          C.DBCOI_TMP_ID,
          DBHelper.NoId,
          false,
          false,
          false,
          getChequeFields(itemInfo.item, itemInfo.dbcoTMPId)),
        true
      ) match {
        case SaveResult(false, id) => throwError
        case _ =>
      }
    }

    case class DepositoBancoChequeTInfo(dbcoTMPId: Int, item: DepositoBancoItemChequeT)

    def saveChequeT(itemInfo: DepositoBancoChequeTInfo) = {
      DBHelper.save(
        user,
        Register(
          C.MOVIMIENTO_FONDO_ITEM_TMP,
          C.DBCOI_TMP_ID,
          DBHelper.NoId,
          false,
          false,
          false,
          getChequeTFields(itemInfo.item, itemInfo.dbcoTMPId)),
        true
      ) match {
        case SaveResult(false, id) => throwError
        case _ =>
      }
    }

    case class DepositoBancoEfectivoInfo(dbcoTMPId: Int, item: DepositoBancoItemEfectivo)

    def saveEfectivo(itemInfo: DepositoBancoEfectivoInfo) = {
      DBHelper.save(
        user,
        Register(
          C.MOVIMIENTO_FONDO_ITEM_TMP,
          C.DBCOI_TMP_ID,
          DBHelper.NoId,
          false,
          false,
          false,
          getEfectivoFields(itemInfo.item, itemInfo.dbcoTMPId)),
        true
      ) match {
        case SaveResult(false, id) => throwError
        case _ =>
      }
    }

    def saveDeletedItem(dbcoTMPId: Int)(dbcoiId: String) = {
      val id = G.getIntOrZero(dbcoiId)
      if(id != 0) {
        DBHelper.save(
          user,
          Register(
            C.MOVIMIENTO_FONDO_ITEM_BORRADO_TMP,
            C.OPGIB_TMP_ID,
            DBHelper.NoId,
            false,
            false,
            false,
            getDeletedItemFields(id, dbcoTMPId)),
          true
        ) match {
          case SaveResult(false, id) => throwError
          case _ =>
        }
      }
    }

    def saveCheques(dbcoTMPId: Int) = {
      depositoBanco.items.cheques.map(item => saveCheque(DepositoBancoChequeInfo(dbcoTMPId, item)))
      depositoBanco.items.chequeDeleted.split(",").map(saveDeletedItem(dbcoTMPId))
    }

    def saveChequesT(dbcoTMPId: Int) = {
      depositoBanco.items.chequesT.map(item => saveChequeT(DepositoBancoChequeTInfo(dbcoTMPId, item)))
      depositoBanco.items.chequeTDeleted.split(",").map(saveDeletedItem(dbcoTMPId))
    }

    def saveEfectivos(dbcoTMPId: Int) = {
      depositoBanco.items.efectivo.map(item => saveEfectivo(DepositoBancoEfectivoInfo(dbcoTMPId, item)))
      depositoBanco.items.efectivoDeleted.split(",").map(saveDeletedItem(dbcoTMPId))
    }

    case class RowResult(rowType: String, id: Int, message: String)

    def executeSave(dbcoTMPId: Int): List[RowResult] = {

      DB.withTransaction(user.database.database) { implicit connection =>
        val sql = "select * from sp_doc_deposito_banco_save(?, ?)"
        val cs = connection.prepareStatement(sql)

        cs.setInt(1, user.masterUserId)
        cs.setInt(2, dbcoTMPId)

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
          * ex: CREATE OR REPLACE FUNCTION sp_doc_deposito_banco_save( params )
          *     RETURNS SETOF row_result AS ...
          *
          * the field type is used to identify the value in the row. there are three
          * kind of types: resultset, success, key
          * for first two (resultset and success) the value of type is string with
          * one of these two values ex: 'resultset' or 'success'
          * when type == 'resultset' the field r must be not null and contain a ResultSet
          * when type == 'success' the id field can contain 0 (False) or not 0 (-1,1 or any other number but NO 0) (True)
          * the last kind of type is key. in this case the key must be the name of a column like opg_id, as_id, pr_id, etc
          * it can be any column name. if the type is an integer like in opg_id, as_id or any other id column the field id
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
                case "opg_id" => RowResult("opg_id", rs.getInt(2), "")
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
            Logger.error(s"can't save ${C.MOVIMIENTO_FONDO} with id ${depositoBanco.id} for user ${user.toString}. Error ${e.toString}")
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
            case RowResult("opg_id", id, m) => id
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
        C.MOVIMIENTO_FONDO_TMP,
        C.DBCO_TMP_ID,
        DBHelper.NoId,
        false,
        true,
        true,
        getFields),
      true
    ) match {
      case SaveResult(true, dbcoTMPId) => {
        saveCheques(dbcoTMPId)
        saveChequesT(dbcoTMPId)
        saveEfectivos(dbcoTMPId)
        val messagesAndId = executeSave(dbcoTMPId)
        val id = getIdFromMessages(messagesAndId)
        load(user, id).getOrElse(throwError)
      }
      case SaveResult(false, id) => throwError
    }

  }

  def load(user: CompanyUser, id: Int): Option[DepositoBanco] = {

    DB.withTransaction(user.database.database) { implicit connection =>

      val sql = "{call sp_doc_deposito_banco_get(?, ?, ?, ?)}"
      val cs = connection.prepareCall(sql)

      cs.setInt(1, user.cairoCompanyId)
      cs.setInt(2, id)
      cs.setInt(3, user.masterUserId)
      cs.registerOutParameter(4, Types.OTHER)

      try {
        cs.execute()

        val rs = cs.getObject(4).asInstanceOf[java.sql.ResultSet]
        Sql.as(depositoBancoParser.singleOpt, rs)

      } catch {
        case NonFatal(e) => {
          Logger.error(s"can't get ${C.MOVIMIENTO_FONDO} with id $id for user ${user.toString}. Error ${e.toString}")
          throw e
        }
      } finally {
        cs.close
      }
    }
  }

  private def loadDepositoBancoItems(user: CompanyUser, id: Int) = {
    val cheques = loadItems[DepositoBancoItemCheque](user, id, C.MOVIMIENTO_FONDO_ITEM_TIPO_CHEQUES, depositoBancoItemChequeParser)
    val chequesT = loadItems[DepositoBancoItemChequeT](user, id, C.MOVIMIENTO_FONDO_ITEM_TIPO_CHEQUEST, depositoBancoItemChequeTParser)
    val efectivo = loadItems[DepositoBancoItemEfectivo](user, id, C.MOVIMIENTO_FONDO_ITEM_TIPO_EFECTIVO, depositoBancoItemEfectivoParser)
    DepositoBancoItems(cheques, chequesT, efectivo, "", "", "")
  }

  private def loadItems[T](user: CompanyUser, id: Int, tipo: Int, parser: RowParser[T]) = {

    DB.withTransaction(user.database.database) { implicit connection =>

      val sql = "{call sp_doc_deposito_banco_get_items(?, ?, ?)}"
      val cs = connection.prepareCall(sql)

      cs.setInt(1, id)
      cs.setInt(2, tipo)
      cs.registerOutParameter(3, Types.OTHER)

      try {
        cs.execute()

        val rs = cs.getObject(3).asInstanceOf[java.sql.ResultSet]

        Sql.as(parser.*, rs)

      } catch {
        case NonFatal(e) => {
          Logger.error(s"can't get ${C.MOVIMIENTO_FONDO_ITEM} with id $id for user ${user.toString}. Error ${e.toString}")
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
        SQL("sp_doc_deposito_banco_delete {id}, {empId}, {usId}")
          .on('id -> id, 'empId -> user.cairoCompanyId, 'usId -> user.masterUserId)
          .executeUpdate
      } catch {
        case NonFatal(e) => {
          Logger.error(s"can't delete a ${C.MOVIMIENTO_FONDO}. ${C.DBCO_ID} id: $id. Error ${e.toString}")
          throw e
        }
      }
    }
  }

  def get(user: CompanyUser, id: Int): DepositoBanco = {
    load(user, id) match {
      case Some(p) => {
        DepositoBanco(
          p.id,

          p.ids,
          p.base,
          p.references,
          p.fecha,
          p.cotizacion,
          p.total,

          loadDepositoBancoItems(user, id)
        )
      }
      case None => emptyDepositoBanco
    }
  }

  val K_FECHA_INI = 1
  val K_FECHA_FIN = 2
  val K_BCO_ID    = 4
  val K_EST_ID    = 5
  val K_CCOS_ID   = 6
  val K_SUC_ID    = 7
  val K_DOC_ID    = 9
  val K_CPG_ID    = 10
  val K_EMP_ID    = 100

  def saveParams(user: CompanyUser, depositoBancoParams: DepositoBancoParams): DepositoBancoParams = {
    val baseFields = List(
      Field(GC.EMP_ID, user.cairoCompanyId, FieldType.id),
      Field(GC.US_ID, user.masterUserId, FieldType.id),
      Field(GC.PRE_ID, S.LIST_MOVIMIENTO_FONDO, FieldType.id)
    )

    def throwException = {
      throw new RuntimeException(s"Error when saving ${C.MOVIMIENTO_FONDO}")
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
        Field(GC.LDP_ID, K_FECHA_INI, FieldType.integer),
        Field(GC.LDP_ORDEN, 0, FieldType.integer),
        Field(GC.LDP_VALOR, depositoBancoParams.from, FieldType.text)
      ),
      List(
        Field(GC.LDP_ID, K_FECHA_FIN, FieldType.integer),
        Field(GC.LDP_ORDEN, 10, FieldType.integer),
        Field(GC.LDP_VALOR, depositoBancoParams.to, FieldType.text)
      ),
      List(
        Field(GC.LDP_ID, K_BCO_ID, FieldType.integer),
        Field(GC.LDP_ORDEN, 20, FieldType.integer),
        Field(GC.LDP_VALOR, depositoBancoParams.bcoId, FieldType.text)
      ),
      List(
        Field(GC.LDP_ID, K_EST_ID, FieldType.integer),
        Field(GC.LDP_ORDEN, 30, FieldType.integer),
        Field(GC.LDP_VALOR, depositoBancoParams.estId, FieldType.text)
      ),
      List(
        Field(GC.LDP_ID, K_CCOS_ID, FieldType.integer),
        Field(GC.LDP_ORDEN, 40, FieldType.integer),
        Field(GC.LDP_VALOR, depositoBancoParams.ccosId, FieldType.text)
      ),
      List(
        Field(GC.LDP_ID, K_SUC_ID, FieldType.integer),
        Field(GC.LDP_ORDEN, 50, FieldType.integer),
        Field(GC.LDP_VALOR, depositoBancoParams.sucId, FieldType.text)
      ),
      List(
        Field(GC.LDP_ID, K_DOC_ID, FieldType.integer),
        Field(GC.LDP_ORDEN, 60, FieldType.integer),
        Field(GC.LDP_VALOR, depositoBancoParams.docId, FieldType.text)
      ),
      List(
        Field(GC.LDP_ID, K_EMP_ID, FieldType.integer),
        Field(GC.LDP_ORDEN, 80, FieldType.integer),
        Field(GC.LDP_VALOR, depositoBancoParams.empId, FieldType.text)
      )
    )

    DB.withConnection(user.database.database) { implicit connection =>
      try {
        SQL(s"""DELETE FROM ListaDocumentoParametro
                | WHERE pre_id = {preId}
                | AND (emp_id is null or emp_id = {empId})
                | AND us_id = {usId}""".stripMargin)
          .on(
            'preId -> S.LIST_MOVIMIENTO_FONDO,
            'empId -> user.cairoCompanyId,
            'usId -> user.masterUserId
          )
          .executeUpdate
      } catch {
        case NonFatal(e) => {
          Logger.error(s"can't save parameters for DepositoBanco")
          throw e
        }
      }
    }

    paramList.map(param => saveParam(baseFields ::: param))

    loadParams(user).getOrElse(throwException)
  }

  def loadParams(user: CompanyUser): Option[DepositoBancoParams] = {

    val params = DocumentListParam.load(user, S.LIST_MOVIMIENTO_FONDO)

    if(params.isEmpty) {
      Some(emptyDepositoBancoParams)
    }
    else {
      val bco = DocumentListParam.getParamValue(
        user, K_BCO_ID, params, emptyDepositoBancoParams.bcoId,
        GC.BANCO, GC.BCO_ID, GC.BCO_NAME
      )
      val est = DocumentListParam.getParamValue(
        user, K_EST_ID, params, emptyDepositoBancoParams.estId,
        GC.ESTADO, GC.EST_ID, GC.EST_NAME
      )
      val ccos = DocumentListParam.getParamValue(
        user, K_CCOS_ID, params, emptyDepositoBancoParams.ccosId,
        GC.CENTRO_COSTO, GC.CCOS_ID, GC.CCOS_NAME
      )
      val suc = DocumentListParam.getParamValue(
        user, K_SUC_ID, params, emptyDepositoBancoParams.sucId,
        GC.SUCURSAL, GC.SUC_ID, GC.SUC_NAME
      )
      val doc = DocumentListParam.getParamValue(
        user, K_DOC_ID, params, emptyDepositoBancoParams.docId,
        GC.DOCUMENTO, GC.DOC_ID, GC.DOC_NAME
      )
      val emp = DocumentListParam.getParamValue(
        user, K_EMP_ID, params, emptyDepositoBancoParams.empId,
        GC.EMPRESA, GC.EMP_ID, GC.EMP_NAME
      )

      Some(
        DepositoBancoParams(
          DocumentListParam.getParamValue(K_FECHA_INI, params, emptyDepositoBancoParams.from),
          DocumentListParam.getParamValue(K_FECHA_FIN, params, emptyDepositoBancoParams.to),
          bco.id,
          bco.value,
          est.id,
          est.value,
          ccos.id,
          ccos.value,
          suc.id,
          suc.value,
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
           bcoId: Option[String],
           estId: Option[String],
           ccosId: Option[String],
           sucId: Option[String],
           docId: Option[String],
           empId: Option[String]): Recordset = {

    DB.withTransaction(user.database.database) { implicit connection =>

      val sql = "{call sp_lsdoc_depositos_banco(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)}"
      val cs = connection.prepareCall(sql)

      cs.setInt(1, user.masterUserId)
      cs.setDate(2, new java.sql.Date(from.getTime()))
      cs.setDate(3, new java.sql.Date(to.getTime()))
      cs.setString(4, bcoId.getOrElse("0"))
      cs.setString(5, estId.getOrElse("0"))
      cs.setString(6, ccosId.getOrElse("0"))
      cs.setString(7, sucId.getOrElse("0"))
      cs.setString(8, docId.getOrElse("0"))
      cs.setString(9, empId.getOrElse("0"))
      cs.registerOutParameter(10, Types.OTHER)

      try {
        cs.execute()

        val rs = cs.getObject(10).asInstanceOf[java.sql.ResultSet]
        Recordset.load(rs)

      } catch {
        case NonFatal(e) => {
          Logger.error(s"can't get listing of depositos bancarios for user ${user.toString}. Error ${e.toString}")
          throw e
        }
      } finally {
        cs.close
      }
    }
  }

}