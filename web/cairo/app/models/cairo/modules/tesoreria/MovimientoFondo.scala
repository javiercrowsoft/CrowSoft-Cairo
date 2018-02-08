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

case class MovimientoFondoId(
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

object MovimientoFondoId {

  def apply(
             docId: Int,
             numero: Int,
             nroDoc: String) = {

    new MovimientoFondoId(
      docId,
      numero,
      nroDoc)
  }
}

case class MovimientoFondoReferences(
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

object MovimientoFondoReferences {

  def apply(
             doctId: Int,
             taMascara: String,
             taPropuesto: Boolean,
             firmado: Boolean,
             asId: Int,
             editable: Boolean,
             editMsg: String
           ) = {

    new MovimientoFondoReferences(
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

case class MovimientoFondoBase(
                          cliId: Int,
                          cliName: String,
                          estId: Int,
                          estName: String,
                          ccosId: Int,
                          ccosName: String,
                          sucId: Int,
                          sucName: String,
                          usId: Int,
                          usName: String,
                          lgjId: Int,
                          lgjCode: String,
                          monId: Int, /* only for select */
                          descrip: String,
                          grabarAsiento: Boolean
                        ) {
  def this(
            cliId: Int,
            estId: Int,
            ccosId: Int,
            sucId: Int,
            usId: Int,
            lgjId: Int,
            descrip: String,
            grabarAsiento: Boolean
          ) = {
    this(
      cliId,
      "",
      estId,
      "",
      ccosId,
      "",
      sucId,
      "",
      usId,
      "",
      lgjId,
      "",
      DBHelper.NoId,
      descrip,
      grabarAsiento
    )
  }
}

object MovimientoFondoBase {

  def apply(
             cliId: Int,
             estId: Int,
             ccosId: Int,
             sucId: Int,
             usId: Int,
             lgjId: Int,
             descrip: String,
             grabarAsiento: Boolean) = {

    new MovimientoFondoBase(
      cliId,
      estId,
      ccosId,
      sucId,
      usId,
      lgjId,
      descrip,
      grabarAsiento)
  }
}

case class MovimientoFondoItemBase(
                                    descrip: String,
                                    cueIdDebe: Int,
                                    cueNameDebe: String,
                                    cueIdHaber: Int,
                                    cueNameHaber: String,
                                    ccosId: Int,
                                    ccosName: String,
                                    orden: Int
                            )

object MovimientoFondoItemBase {

  def apply(descrip: String,
            cueIdDebe: Int,
            cueIdHaber: Int,
            ccosId: Int,
            orden: Int) = {

    new MovimientoFondoItemBase(
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

case class MovimientoFondoItemTotals(
                                importe: Double,
                                importeOrigen: Double,
                                importeOrigenHaber: Double
                              )

case class MovimientoFondoItemMoneda(
                                monId: Int,
                                monName: String
                              )

case class MovimientoFondoItemCheque(
                                id: Int,
                                base: MovimientoFondoItemBase,
                                moneda: MovimientoFondoItemMoneda,
                                totals: MovimientoFondoItemTotals,
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

object MovimientoFondoItemCheque {

  def apply(id: Int,
            base: MovimientoFondoItemBase,
            monId: Int,
            totals: MovimientoFondoItemTotals,
            bcoId: Int,
            chqId: Int,
            cheqId: Int,
            numeroDoc: String,
            fechaCobro: Date,
            fechaVto: Date,
            cleId: Int) = {

    new MovimientoFondoItemCheque(
      id,
      base,
      MovimientoFondoItemMoneda(monId, ""),
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

case class MovimientoFondoItemChequeT(
                                 id: Int,
                                 base: MovimientoFondoItemBase,
                                 moneda: MovimientoFondoItemMoneda,
                                 totals: MovimientoFondoItemTotals,
                                 bcoId: Int,
                                 bcoName: String,
                                 cliId: Int,
                                 cliName: String,
                                 cheqId: Int,
                                 numero: Int,
                                 numeroDoc: String,
                                 fechaCobro: Date,
                                 fechaVto: Date,
                                 cleId: Int,
                                 cleName: String
                               )

object MovimientoFondoItemChequeT {

  def apply(id: Int,
            base: MovimientoFondoItemBase,
            monId: Int,
            totals: MovimientoFondoItemTotals,
            bcoId: Int,
            cliId: Int,
            cheqId: Int,
            numeroDoc: String,
            fechaCobro: Date,
            fechaVto: Date,
            cleId: Int) = {

    new MovimientoFondoItemChequeT(
      id,
      base,
      MovimientoFondoItemMoneda(monId, ""),
      totals,
      bcoId,
      "",
      cliId,
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

case class MovimientoFondoItemChequeI(
                                 id: Int,
                                 base: MovimientoFondoItemBase,
                                 moneda: MovimientoFondoItemMoneda,
                                 totals: MovimientoFondoItemTotals,
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

object MovimientoFondoItemChequeI {

  def apply(id: Int,
            base: MovimientoFondoItemBase,
            monId: Int,
            totals: MovimientoFondoItemTotals,
            bcoId: Int,
            cheqId: Int,
            numeroDoc: String,
            fechaCobro: Date,
            fechaVto: Date,
            cleId: Int) = {

    new MovimientoFondoItemChequeI(
      id,
      base,
      MovimientoFondoItemMoneda(monId, ""),
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

case class MovimientoFondoItemEfectivo(
                                  id: Int,
                                  base: MovimientoFondoItemBase,
                                  moneda: MovimientoFondoItemMoneda,
                                  totals: MovimientoFondoItemTotals
                                )

object MovimientoFondoItemEfectivo {

  def apply(id: Int,
            base: MovimientoFondoItemBase,
            monId: Int,
            totals: MovimientoFondoItemTotals) = {

    new MovimientoFondoItemEfectivo(
      id,
      base,
      MovimientoFondoItemMoneda(monId, ""),
      totals
    )
  }
}

case class MovimientoFondoItems(
                           cheques: List[MovimientoFondoItemCheque],
                           chequesT: List[MovimientoFondoItemChequeT],
                           chequesI: List[MovimientoFondoItemChequeI],
                           efectivo: List[MovimientoFondoItemEfectivo],

                           /* only used in save */
                           chequeDeleted: String,
                           chequeTDeleted: String,
                           chequeIDeleted: String,
                           efectivoDeleted: String
                         )

case class MovimientoFondo(
                      id: Int,

                      ids: MovimientoFondoId,
                      base: MovimientoFondoBase,
                      references: MovimientoFondoReferences,
                      fecha: Date,
                      cotizacion: Double,
                      total: Double,

                      items: MovimientoFondoItems,

                      createdAt: Date,
                      updatedAt: Date,
                      updatedBy: Int
                    ) {

  def this(
            id: Int,

            ids: MovimientoFondoId,
            base: MovimientoFondoBase,
            references: MovimientoFondoReferences,
            fecha: Date,
            cotizacion: Double,
            total: Double,

            items: MovimientoFondoItems) = {

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
            ids: MovimientoFondoId,
            base: MovimientoFondoBase,
            references: MovimientoFondoReferences,
            fecha: Date,
            cotizacion: Double,
            total: Double,

            items: MovimientoFondoItems) = {

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

case class MovimientoFondoParams(
                            from: String,
                            to: String,
                            cliId: String,
                            cliName: String,
                            estId: String,
                            estName: String,
                            ccosId: String,
                            ccosName: String,
                            sucId: String,
                            sucName: String,
                            usId: String,
                            usName: String,
                            docId: String,
                            docName: String,
                            empId: String,
                            empName: String
                          ) {
  def this(
            from: String,
            to: String,
            cliId: String,
            estId: String,
            ccosId: String,
            sucId: String,
            usId: String,
            docId: String,
            empId: String
          ) = {
    this(
      from,
      to,
      cliId,
      "",
      estId,
      "",
      ccosId,
      "",
      sucId,
      "",
      usId,
      "",
      docId,
      "",
      empId,
      ""
    )
  }
}

object MovimientoFondoParams {
  def apply(
             from: String,
             to: String,
             cliId: String,
             estId: String,
             ccosId: String,
             sucId: String,
             usId: String,
             docId: String,
             empId: String
           ) = {

    new MovimientoFondoParams(
      from,
      to,
      cliId,
      estId,
      ccosId,
      sucId,
      usId,
      docId,
      empId
    )
  }
}

object MovimientoFondo {

  lazy val GC = models.cairo.modules.general.C

  lazy val emptyMovimientoFondoItems = MovimientoFondoItems(List(), List(), List(), List(), "", "", "", "")

  lazy val emptyMovimientoFondoReferences = MovimientoFondoReferences(DBHelper.NoId, "", false, false, DBHelper.NoId, false, "")

  lazy val emptyMovimientoFondo = MovimientoFondo(
    MovimientoFondoId(DBHelper.NoId, 0, ""),
    MovimientoFondoBase(DBHelper.NoId, DBHelper.NoId, DBHelper.NoId, DBHelper.NoId, DBHelper.NoId, DBHelper.NoId, "", false),
    emptyMovimientoFondoReferences,
    U.NO_DATE,
    0,
    0.0,
    emptyMovimientoFondoItems
  )

  lazy val emptyMovimientoFondoParams = MovimientoFondoParams(
    DateFormatter.format(DateUtil.plusDays(DateUtil.currentTime, -60)),
    DateFormatter.format(DateUtil.currentTime), "0", "", "0", "", "0", "", "0", "", "0", "", "0", "", "0", "")

  def apply(
             id: Int,

             ids: MovimientoFondoId,
             base: MovimientoFondoBase,
             references: MovimientoFondoReferences,
             fecha: Date,
             cotizacion: Double,
             total: Double,

             items: MovimientoFondoItems
           ) = {

    new MovimientoFondo(
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

             ids: MovimientoFondoId,
             base: MovimientoFondoBase,
             references: MovimientoFondoReferences,
             fecha: Date,
             cotizacion: Double,
             total: Double
           ) = {

    new MovimientoFondo(
      id,

      ids,
      base,
      references,
      fecha,
      cotizacion,
      total,

      emptyMovimientoFondoItems
    )
  }

  def apply(
             ids: MovimientoFondoId,
             base: MovimientoFondoBase,
             references: MovimientoFondoReferences,
             fecha: Date,
             cotizacion: Double,
             total: Double,

             items: MovimientoFondoItems
           ) = {

    new MovimientoFondo(
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
             ids: MovimientoFondoId,
             base: MovimientoFondoBase,
             references: MovimientoFondoReferences,
             fecha: Date,
             cotizacion: Double,
             total: Double
           ) = {

    new MovimientoFondo(

      ids,
      base,
      references,
      fecha,
      cotizacion,
      total,

      emptyMovimientoFondoItems
    )
  }

  private val movimientoFondoItemChequeParser: RowParser[MovimientoFondoItemCheque] = {
    SqlParser.get[Int](C.MFI_ID) ~
      SqlParser.get[String](C.MFI_DESCRIP) ~
      SqlParser.get[Int](C.CUE_ID_DEBE) ~
      SqlParser.get[String](C.CUE_DEBE_NAME) ~
      SqlParser.get[Int](C.CUE_ID_HABER) ~
      SqlParser.get[String](C.CUE_HABER_NAME) ~
      SqlParser.get[Option[Int]](GC.CCOS_ID) ~
      SqlParser.get[Option[String]](GC.CCOS_NAME) ~
      SqlParser.get[Int](GC.MON_ID) ~
      SqlParser.get[String](GC.MON_NAME) ~
      SqlParser.get[BigDecimal](C.MFI_IMPORTE) ~
      SqlParser.get[BigDecimal](C.MFI_IMPORTE_ORIGEN) ~
      SqlParser.get[BigDecimal](C.MFI_IMPORTE_ORIGEN_HABER) ~
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
      SqlParser.get[Int](C.MFI_ORDEN) map {
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
          importeOrigenHaber ~
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
        MovimientoFondoItemCheque(
          id,
          MovimientoFondoItemBase(
            descrip,
            cueIdDebe,
            cueDebeName,
            cueIdHaber,
            cueHaberName,
            ccosId.getOrElse(DBHelper.NoId),
            ccosName.getOrElse(""),
            orden
          ),
          MovimientoFondoItemMoneda(monId, monName),
          MovimientoFondoItemTotals(
            importe.doubleValue(),
            importeOrigen.doubleValue(),
            importeOrigenHaber.doubleValue()
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

  private val movimientoFondoItemChequeTParser: RowParser[MovimientoFondoItemChequeT] = {
    SqlParser.get[Int](C.MFI_ID) ~
      SqlParser.get[String](C.MFI_DESCRIP) ~
      SqlParser.get[Int](C.CUE_ID_DEBE) ~
      SqlParser.get[String](C.CUE_DEBE_NAME) ~
      SqlParser.get[Int](C.CUE_ID_HABER) ~
      SqlParser.get[String](C.CUE_HABER_NAME) ~
      SqlParser.get[Option[Int]](GC.CCOS_ID) ~
      SqlParser.get[Option[String]](GC.CCOS_NAME) ~
      SqlParser.get[Int](GC.MON_ID) ~
      SqlParser.get[String](GC.MON_NAME) ~
      SqlParser.get[BigDecimal](C.MFI_IMPORTE) ~
      SqlParser.get[BigDecimal](C.MFI_IMPORTE_ORIGEN) ~
      SqlParser.get[BigDecimal](C.MFI_IMPORTE_ORIGEN_HABER) ~
      SqlParser.get[Int](GC.BCO_ID) ~
      SqlParser.get[String](GC.BCO_NAME) ~
      SqlParser.get[Option[Int]](GC.CLI_ID) ~
      SqlParser.get[Option[String]](GC.CLI_NAME) ~
      SqlParser.get[Int](C.CHEQ_ID) ~
      SqlParser.get[Int](C.CHEQ_NUMERO) ~
      SqlParser.get[String](C.CHEQ_NUMERO_DOC) ~
      SqlParser.get[Date](C.CHEQ_FECHA_COBRO) ~
      SqlParser.get[Date](C.CHEQ_FECHA_VTO) ~
      SqlParser.get[Option[Int]](GC.CLE_ID) ~
      SqlParser.get[Option[String]](GC.CLE_NAME) ~
      SqlParser.get[Int](C.MFI_ORDEN) map {
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
          importeOrigenHaber ~
          bcoId ~
          bcoName ~
          cliId ~
          cliName ~
          cheqId ~
          numero ~
          numeroDoc ~
          fechaCobro ~
          fechaVto ~
          cleId ~
          cleName ~
          orden =>
        MovimientoFondoItemChequeT(
          id,
          MovimientoFondoItemBase(
            descrip,
            cueIdDebe,
            cueDebeName,
            cueIdHaber,
            cueHaberName,
            ccosId.getOrElse(DBHelper.NoId),
            ccosName.getOrElse(""),
            orden
          ),
          MovimientoFondoItemMoneda(monId, monName),
          MovimientoFondoItemTotals(
            importe.doubleValue(),
            importeOrigen.doubleValue(),
            importeOrigenHaber.doubleValue()
          ),
          bcoId,
          bcoName,
          cliId.getOrElse(DBHelper.NoId),
          cliName.getOrElse(""),
          cheqId,
          numero,
          numeroDoc,
          fechaCobro,
          fechaVto,
          cleId.getOrElse(DBHelper.NoId),
          cleName.getOrElse("")
        )
    }
  }

  private val movimientoFondoItemChequeIParser: RowParser[MovimientoFondoItemChequeI] = {
    SqlParser.get[Int](C.MFI_ID) ~
      SqlParser.get[String](C.MFI_DESCRIP) ~
      SqlParser.get[Int](C.CUE_ID_DEBE) ~
      SqlParser.get[String](C.CUE_DEBE_NAME) ~
      SqlParser.get[Int](C.CUE_ID_HABER) ~
      SqlParser.get[String](C.CUE_HABER_NAME) ~
      SqlParser.get[Option[Int]](GC.CCOS_ID) ~
      SqlParser.get[Option[String]](GC.CCOS_NAME) ~
      SqlParser.get[Int](GC.MON_ID) ~
      SqlParser.get[String](GC.MON_NAME) ~
      SqlParser.get[BigDecimal](C.MFI_IMPORTE) ~
      SqlParser.get[BigDecimal](C.MFI_IMPORTE_ORIGEN) ~
      SqlParser.get[BigDecimal](C.MFI_IMPORTE_ORIGEN_HABER) ~
      SqlParser.get[Int](GC.BCO_ID) ~
      SqlParser.get[String](GC.BCO_NAME) ~
      SqlParser.get[Int](C.CHEQ_ID) ~
      SqlParser.get[Int](C.CHEQ_NUMERO) ~
      SqlParser.get[String](C.CHEQ_NUMERO_DOC) ~
      SqlParser.get[Date](C.CHEQ_FECHA_COBRO) ~
      SqlParser.get[Date](C.CHEQ_FECHA_VTO) ~
      SqlParser.get[Option[Int]](GC.CLE_ID) ~
      SqlParser.get[Option[String]](GC.CLE_NAME) ~
      SqlParser.get[Int](C.MFI_ORDEN) map {
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
          importeOrigenHaber ~
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
        MovimientoFondoItemChequeI(
          id,
          MovimientoFondoItemBase(
            descrip,
            cueIdDebe,
            cueDebeName,
            cueIdHaber,
            cueHaberName,
            ccosId.getOrElse(DBHelper.NoId),
            ccosName.getOrElse(""),
            orden
          ),
          MovimientoFondoItemMoneda(monId, monName),
          MovimientoFondoItemTotals(
            importe.doubleValue(),
            importeOrigen.doubleValue(),
            importeOrigenHaber.doubleValue()
          ),
          bcoId,
          bcoName,
          cheqId,
          numero,
          numeroDoc,
          fechaCobro,
          fechaVto,
          cleId.getOrElse(DBHelper.NoId),
          cleName.getOrElse("")
        )
    }
  }

  private val movimientoFondoItemEfectivoParser: RowParser[MovimientoFondoItemEfectivo] = {
    SqlParser.get[Int](C.MFI_ID) ~
      SqlParser.get[String](C.MFI_DESCRIP) ~
      SqlParser.get[Int](C.CUE_ID_DEBE) ~
      SqlParser.get[String](C.CUE_DEBE_NAME) ~
      SqlParser.get[Int](C.CUE_ID_HABER) ~
      SqlParser.get[String](C.CUE_HABER_NAME) ~
      SqlParser.get[Option[Int]](GC.CCOS_ID) ~
      SqlParser.get[Option[String]](GC.CCOS_NAME) ~
      SqlParser.get[Int](GC.MON_ID) ~
      SqlParser.get[String](GC.MON_NAME) ~
      SqlParser.get[BigDecimal](C.MFI_IMPORTE) ~
      SqlParser.get[BigDecimal](C.MFI_IMPORTE_ORIGEN) ~
      SqlParser.get[BigDecimal](C.MFI_IMPORTE_ORIGEN_HABER) ~
      SqlParser.get[Int](C.MFI_ORDEN) map {
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
          importeOrigenHaber ~
          orden =>
        MovimientoFondoItemEfectivo(
          id,
          MovimientoFondoItemBase(
            descrip,
            cueIdDebe,
            cueDebeName,
            cueIdHaber,
            cueHaberName,
            ccosId.getOrElse(DBHelper.NoId),
            ccosName.getOrElse(""),
            orden
          ),
          MovimientoFondoItemMoneda(monId, monName),
          MovimientoFondoItemTotals(
            importe.doubleValue(),
            importeOrigen.doubleValue(),
            importeOrigenHaber.doubleValue()
          )
        )
    }
  }

  private val movimientoFondoParser: RowParser[MovimientoFondo] = {
    SqlParser.get[Int](C.MF_ID) ~
      SqlParser.get[Int](GC.DOC_ID) ~
      SqlParser.get[String](GC.DOC_NAME) ~
      SqlParser.get[Int](C.MF_NUMERO) ~
      SqlParser.get[String](C.MF_NRODOC) ~
      SqlParser.get[Option[Int]](GC.CLI_ID) ~
      SqlParser.get[Option[String]](GC.CLI_NAME) ~
      SqlParser.get[Int](GC.EST_ID) ~
      SqlParser.get[String](GC.EST_NAME) ~
      SqlParser.get[Option[Int]](GC.CCOS_ID) ~
      SqlParser.get[Option[String]](GC.CCOS_NAME) ~
      SqlParser.get[Int](GC.SUC_ID) ~
      SqlParser.get[String](GC.SUC_NAME) ~
      SqlParser.get[Option[Int]](GC.US_ID) ~
      SqlParser.get[Option[String]](GC.US_NAME) ~
      SqlParser.get[Option[Int]](GC.LGJ_ID) ~
      SqlParser.get[Option[String]](GC.LGJ_CODE) ~
      SqlParser.get[Int](GC.MON_ID) ~
      SqlParser.get[String](C.MF_DESCRIP) ~
      SqlParser.get[Int](C.MF_GRABAR_ASIENTO) ~
      SqlParser.get[Int](GC.DOCT_ID) ~
      SqlParser.get[String](GC.DOCT_NAME) ~
      SqlParser.get[String](GC.TA_MASCARA) ~
      SqlParser.get[Int](GC.TA_PROPUESTO) ~
      SqlParser.get[Int](C.MF_FIRMADO) ~
      SqlParser.get[Option[Int]](C.AS_ID) ~
      SqlParser.get[Int](GC.EDITABLE) ~
      SqlParser.get[String](GC.EDIT_MSG) ~
      SqlParser.get[Date](C.MF_FECHA) ~
      SqlParser.get[BigDecimal](C.MF_COTIZACION) ~
      SqlParser.get[BigDecimal](C.MF_TOTAL) ~
      SqlParser.get[Date](DBHelper.CREATED_AT) ~
      SqlParser.get[Date](DBHelper.UPDATED_AT) ~
      SqlParser.get[Int](DBHelper.UPDATED_BY) map {
      case
        id ~
          docId ~
          docName ~
          numero ~
          nroDoc ~
          cliId ~
          cliName ~
          estId ~
          estName ~
          ccosId ~
          ccosName ~
          sucId ~
          sucName ~
          usId ~
          usName ~
          lgjId ~
          lgjCode ~
          monId ~
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
        MovimientoFondo(
          id,
          MovimientoFondoId(
            docId,
            docName,
            numero,
            nroDoc
          ),
          MovimientoFondoBase(
            cliId.getOrElse(DBHelper.NoId),
            cliName.getOrElse(""),
            estId,
            estName,
            ccosId.getOrElse(DBHelper.NoId),
            ccosName.getOrElse(""),
            sucId,
            sucName,
            usId.getOrElse(DBHelper.NoId),
            usName.getOrElse(""),
            lgjId.getOrElse(DBHelper.NoId),
            lgjCode.getOrElse(""),
            monId,
            descrip,
            grabarAsiento != 0
          ),
          MovimientoFondoReferences(
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
          emptyMovimientoFondoItems,
          createdAt,
          updatedAt,
          updatedBy)
    }
  }

  def createMovimientoFondo(user: CompanyUser, movimientoFondo: MovimientoFondo): MovimientoFondo = {
    save(user, movimientoFondo)
  }

  def create(user: CompanyUser, movimientoFondo: MovimientoFondo): MovimientoFondo = {
    save(user, movimientoFondo)
  }

  def update(user: CompanyUser, movimientoFondo: MovimientoFondo): MovimientoFondo = {
    save(user, movimientoFondo)
  }

  private def save(user: CompanyUser, movimientoFondo: MovimientoFondo): MovimientoFondo = {
    def getFields = {
      List(
        Field(C.MF_ID, movimientoFondo.id, FieldType.number),
        Field(GC.DOC_ID, movimientoFondo.ids.docId, FieldType.id),
        Field(C.MF_NRODOC, movimientoFondo.ids.nroDoc, FieldType.text),
        Field(C.MF_NUMERO, movimientoFondo.ids.numero, FieldType.number),

        Field(GC.CLI_ID, movimientoFondo.base.cliId, FieldType.id),
        Field(GC.EST_ID, movimientoFondo.base.estId, FieldType.id),
        Field(GC.CCOS_ID, movimientoFondo.base.ccosId, FieldType.id),
        Field(GC.SUC_ID, movimientoFondo.base.sucId, FieldType.id),
        Field(GC.US_ID, movimientoFondo.base.usId, FieldType.id),
        Field(GC.LGJ_ID, movimientoFondo.base.lgjId, FieldType.id),
        Field(C.MF_DESCRIP, movimientoFondo.base.descrip, FieldType.text),
        Field(C.MF_GRABAR_ASIENTO, Register.boolToInt(movimientoFondo.base.grabarAsiento), FieldType.boolean),

        Field(C.MF_FECHA, movimientoFondo.fecha, FieldType.date),

        Field(C.MF_COTIZACION, movimientoFondo.cotizacion, FieldType.currency),

        Field(C.MF_TOTAL, movimientoFondo.total, FieldType.currency)
      )
    }

    def getChequeFields(item: MovimientoFondoItemCheque, mfTMPId: Int) = {
      List(
        Field(C.MF_TMP_ID, mfTMPId, FieldType.id),
        Field(C.MFI_ID, item.id, FieldType.number),
        Field(C.MFI_TIPO, C.MOVIMIENTO_FONDO_ITEM_TIPO_CHEQUES, FieldType.number),
        Field(C.MFI_DESCRIP, item.base.descrip, FieldType.text),
        Field(GC.CHQ_ID, item.chqId, FieldType.id),
        Field(C.CHEQ_ID, item.cheqId, FieldType.id),
        Field(C.MFI_TMP_CHEQUE, item.numeroDoc, FieldType.text),
        Field(C.MFI_TMP_FECHA_COBRO, item.fechaCobro, FieldType.date),
        Field(C.MFI_TMP_FECHA_VTO, item.fechaVto, FieldType.date),
        Field(C.MFI_IMPORTE, item.totals.importe, FieldType.currency),
        Field(C.MFI_IMPORTE_ORIGEN, item.totals.importeOrigen, FieldType.currency),
        Field(C.MFI_ORDEN, item.base.orden, FieldType.integer),
        Field(GC.CLE_ID, item.cleId, FieldType.id),
        Field(GC.MON_ID, item.moneda.monId, FieldType.id),
        Field(C.CUE_ID_DEBE, item.base.cueIdDebe, FieldType.id),
        Field(C.CUE_ID_HABER, item.base.cueIdHaber, FieldType.id),
        Field(GC.CCOS_ID, item.base.ccosId, FieldType.id)
      )
    }

    def getChequeTFields(item: MovimientoFondoItemChequeT, mfTMPId: Int) = {
      List(
        Field(C.MF_TMP_ID, mfTMPId, FieldType.id),
        Field(C.MFI_ID, item.id, FieldType.number),
        Field(C.MFI_TIPO, C.MOVIMIENTO_FONDO_ITEM_TIPO_CHEQUEST, FieldType.number),
        Field(C.MFI_DESCRIP, item.base.descrip, FieldType.text),
        Field(C.CHEQ_ID, item.cheqId, FieldType.id),
        Field(C.MFI_TMP_FECHA_COBRO, item.fechaCobro, FieldType.date),
        Field(C.MFI_TMP_FECHA_VTO, item.fechaVto, FieldType.date),
        Field(C.MFI_IMPORTE, item.totals.importe, FieldType.currency),
        Field(C.MFI_IMPORTE_ORIGEN, item.totals.importeOrigen, FieldType.currency),
        Field(C.MFI_ORDEN, item.base.orden, FieldType.integer),
        Field(GC.CLE_ID, item.cleId, FieldType.id),
        Field(GC.MON_ID, item.moneda.monId, FieldType.id),
        Field(C.CUE_ID_DEBE, item.base.cueIdDebe, FieldType.id),
        Field(C.CUE_ID_HABER, item.base.cueIdHaber, FieldType.id),
        Field(GC.CCOS_ID, item.base.ccosId, FieldType.id)
      )
    }

    def getChequeIFields(item: MovimientoFondoItemChequeI, mfTMPId: Int) = {
      List(
        Field(C.MF_TMP_ID, mfTMPId, FieldType.id),
        Field(C.MFI_ID, item.id, FieldType.number),
        Field(C.MFI_TIPO, C.MOVIMIENTO_FONDO_ITEM_TIPO_CHEQUESI, FieldType.number),
        Field(C.MFI_DESCRIP, item.base.descrip, FieldType.text),
        Field(C.CHEQ_ID, item.cheqId, FieldType.id),
        Field(C.MFI_TMP_CHEQUE, item.numeroDoc, FieldType.text),
        Field(C.MFI_TMP_FECHA_COBRO, item.fechaCobro, FieldType.date),
        Field(C.MFI_TMP_FECHA_VTO, item.fechaVto, FieldType.date),
        Field(C.MFI_IMPORTE, item.totals.importe, FieldType.currency),
        Field(C.MFI_IMPORTE_ORIGEN, item.totals.importeOrigen, FieldType.currency),
        Field(C.MFI_IMPORTE_ORIGEN_HABER, item.totals.importeOrigenHaber, FieldType.currency),
        Field(C.MFI_ORDEN, item.base.orden, FieldType.integer),
        Field(GC.CLE_ID, item.cleId, FieldType.id),
        Field(GC.BCO_ID, item.bcoId, FieldType.id),
        Field(GC.MON_ID, item.moneda.monId, FieldType.id),
        Field(C.CUE_ID_DEBE, item.base.cueIdDebe, FieldType.id),
        Field(C.CUE_ID_HABER, item.base.cueIdHaber, FieldType.id),
        Field(GC.CCOS_ID, item.base.ccosId, FieldType.id)
      )
    }

    def getEfectivoFields(item: MovimientoFondoItemEfectivo, mfTMPId: Int) = {
      List(
        Field(C.MF_TMP_ID, mfTMPId, FieldType.id),
        Field(C.MFI_ID, item.id, FieldType.number),
        Field(C.MFI_TIPO, C.MOVIMIENTO_FONDO_ITEM_TIPO_EFECTIVO, FieldType.number),
        Field(C.MFI_DESCRIP, item.base.descrip, FieldType.text),
        Field(C.CUE_ID_DEBE, item.base.cueIdDebe, FieldType.id),
        Field(C.CUE_ID_HABER, item.base.cueIdHaber, FieldType.id),
        Field(GC.CCOS_ID, item.base.ccosId, FieldType.id),
        Field(C.MFI_ORDEN, item.base.orden, FieldType.integer),
        Field(C.MFI_IMPORTE, item.totals.importe, FieldType.currency),
        Field(C.MFI_IMPORTE_ORIGEN, item.totals.importeOrigen, FieldType.currency),
        Field(C.MFI_IMPORTE_ORIGEN_HABER, item.totals.importeOrigenHaber, FieldType.currency)
      )
    }

    def getDeletedItemFields(mfiId: Int, mfTMPId: Int) = {
      List(
        Field(C.MF_TMP_ID, mfTMPId, FieldType.id),
        Field(C.MFI_ID, mfiId, FieldType.number),
        Field(C.MF_ID, movimientoFondo.id, FieldType.id)
      )
    }

    def throwError = {
      throwException(s"Error when saving ${C.MOVIMIENTO_FONDO}")
    }

    def throwException(message: String) = {
      throw new RuntimeException(message)
    }

    case class MovimientoFondoChequeInfo(mfTMPId: Int, item: MovimientoFondoItemCheque)

    def saveCheque(itemInfo: MovimientoFondoChequeInfo) = {
      DBHelper.save(
        user,
        Register(
          C.MOVIMIENTO_FONDO_ITEM_TMP,
          C.MFI_TMP_ID,
          DBHelper.NoId,
          false,
          false,
          false,
          getChequeFields(itemInfo.item, itemInfo.mfTMPId)),
        true
      ) match {
        case SaveResult(false, id) => throwError
        case _ =>
      }
    }

    case class MovimientoFondoChequeTInfo(mfTMPId: Int, item: MovimientoFondoItemChequeT)

    def saveChequeT(itemInfo: MovimientoFondoChequeTInfo) = {
      DBHelper.save(
        user,
        Register(
          C.MOVIMIENTO_FONDO_ITEM_TMP,
          C.MFI_TMP_ID,
          DBHelper.NoId,
          false,
          false,
          false,
          getChequeTFields(itemInfo.item, itemInfo.mfTMPId)),
        true
      ) match {
        case SaveResult(false, id) => throwError
        case _ =>
      }
    }

    case class MovimientoFondoChequeIInfo(mfTMPId: Int, item: MovimientoFondoItemChequeI)

    def saveChequeI(itemInfo: MovimientoFondoChequeIInfo) = {
      DBHelper.save(
        user,
        Register(
          C.MOVIMIENTO_FONDO_ITEM_TMP,
          C.MFI_TMP_ID,
          DBHelper.NoId,
          false,
          false,
          false,
          getChequeIFields(itemInfo.item, itemInfo.mfTMPId)),
        true
      ) match {
        case SaveResult(false, id) => throwError
        case _ =>
      }
    }

    case class MovimientoFondoEfectivoInfo(mfTMPId: Int, item: MovimientoFondoItemEfectivo)

    def saveEfectivo(itemInfo: MovimientoFondoEfectivoInfo) = {
      DBHelper.save(
        user,
        Register(
          C.MOVIMIENTO_FONDO_ITEM_TMP,
          C.MFI_TMP_ID,
          DBHelper.NoId,
          false,
          false,
          false,
          getEfectivoFields(itemInfo.item, itemInfo.mfTMPId)),
        true
      ) match {
        case SaveResult(false, id) => throwError
        case _ =>
      }
    }

    def saveDeletedItem(mfTMPId: Int)(mfiId: String) = {
      val id = G.getIntOrZero(mfiId)
      if(id != 0) {
        DBHelper.save(
          user,
          Register(
            C.MOVIMIENTO_FONDO_ITEM_BORRADO_TMP,
            C.MFIB_TMP_ID,
            DBHelper.NoId,
            false,
            false,
            false,
            getDeletedItemFields(id, mfTMPId)),
          true
        ) match {
          case SaveResult(false, id) => throwError
          case _ =>
        }
      }
    }

    def saveCheques(mfTMPId: Int) = {
      movimientoFondo.items.cheques.map(item => saveCheque(MovimientoFondoChequeInfo(mfTMPId, item)))
      movimientoFondo.items.chequeDeleted.split(",").map(saveDeletedItem(mfTMPId))
    }

    def saveChequesT(mfTMPId: Int) = {
      movimientoFondo.items.chequesT.map(item => saveChequeT(MovimientoFondoChequeTInfo(mfTMPId, item)))
      movimientoFondo.items.chequeTDeleted.split(",").map(saveDeletedItem(mfTMPId))
    }

    def saveChequesI(mfTMPId: Int) = {
      movimientoFondo.items.chequesI.map(item => saveChequeI(MovimientoFondoChequeIInfo(mfTMPId, item)))
      movimientoFondo.items.chequeIDeleted.split(",").map(saveDeletedItem(mfTMPId))
    }

    def saveEfectivos(mfTMPId: Int) = {
      movimientoFondo.items.efectivo.map(item => saveEfectivo(MovimientoFondoEfectivoInfo(mfTMPId, item)))
      movimientoFondo.items.efectivoDeleted.split(",").map(saveDeletedItem(mfTMPId))
    }

    case class RowResult(rowType: String, id: Int, message: String)

    def executeSave(mfTMPId: Int): List[RowResult] = {

      DB.withTransaction(user.database.database) { implicit connection =>
        val sql = "select * from sp_doc_movimiento_fondo_save(?, ?)"
        val cs = connection.prepareStatement(sql)

        cs.setInt(1, user.masterUserId)
        cs.setInt(2, mfTMPId)

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
          * ex: CREATE OR REPLACE FUNCTION sp_doc_movimiento_fondo_save( params )
          *     RETURNS SETOF row_result AS ...
          *
          * the field type is used to identify the value in the row. there are three
          * kind of types: resultset, success, key
          * for first two (resultset and success) the value of type is string with
          * one of these two values ex: 'resultset' or 'success'
          * when type == 'resultset' the field r must be not null and contain a ResultSet
          * when type == 'success' the id field can contain 0 (False) or not 0 (-1,1 or any other number but NO 0) (True)
          * the last kind of type is key. in this case the key must be the name of a column like mf_id, as_id, pr_id, etc
          * it can be any column name. if the type is an integer like in mf_id, as_id or any other id column the field id
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
                case "mf_id" => RowResult("mf_id", rs.getInt(2), "")
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
            Logger.error(s"can't save ${C.MOVIMIENTO_FONDO} with id ${movimientoFondo.id} for user ${user.toString}. Error ${e.toString}")
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
            case RowResult("mf_id", id, m) => id
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
        C.MF_TMP_ID,
        DBHelper.NoId,
        false,
        true,
        true,
        getFields),
      true
    ) match {
      case SaveResult(true, mfTMPId) => {
        saveCheques(mfTMPId)
        saveChequesT(mfTMPId)
        saveChequesI(mfTMPId)
        saveEfectivos(mfTMPId)
        val messagesAndId = executeSave(mfTMPId)
        val id = getIdFromMessages(messagesAndId)
        load(user, id).getOrElse(throwError)
      }
      case SaveResult(false, id) => throwError
    }

  }

  def load(user: CompanyUser, id: Int): Option[MovimientoFondo] = {

    DB.withTransaction(user.database.database) { implicit connection =>

      val sql = "{call sp_doc_movimiento_fondo_get(?, ?, ?, ?)}"
      val cs = connection.prepareCall(sql)

      cs.setInt(1, user.cairoCompanyId)
      cs.setInt(2, id)
      cs.setInt(3, user.masterUserId)
      cs.registerOutParameter(4, Types.OTHER)

      try {
        cs.execute()

        val rs = cs.getObject(4).asInstanceOf[java.sql.ResultSet]
        Sql.as(movimientoFondoParser.singleOpt, rs)

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

  private def loadMovimientoFondoItems(user: CompanyUser, id: Int) = {
    val cheques = loadItems[MovimientoFondoItemCheque](user, id, C.MOVIMIENTO_FONDO_ITEM_TIPO_CHEQUES, movimientoFondoItemChequeParser)
    val chequesT = loadItems[MovimientoFondoItemChequeT](user, id, C.MOVIMIENTO_FONDO_ITEM_TIPO_CHEQUEST, movimientoFondoItemChequeTParser)
    val chequesI = loadItems[MovimientoFondoItemChequeI](user, id, C.MOVIMIENTO_FONDO_ITEM_TIPO_CHEQUESI, movimientoFondoItemChequeIParser)
    val efectivo = loadItems[MovimientoFondoItemEfectivo](user, id, C.MOVIMIENTO_FONDO_ITEM_TIPO_EFECTIVO, movimientoFondoItemEfectivoParser)
    MovimientoFondoItems(cheques, chequesT, chequesI, efectivo, "", "", "", "")
  }

  private def loadItems[T](user: CompanyUser, id: Int, tipo: Int, parser: RowParser[T]) = {

    DB.withTransaction(user.database.database) { implicit connection =>

      val sql = "{call sp_doc_movimiento_fondo_get_items(?, ?, ?)}"
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
        SQL("sp_doc_movimiento_fondo_delete {id}, {empId}, {usId}")
          .on('id -> id, 'empId -> user.cairoCompanyId, 'usId -> user.masterUserId)
          .executeUpdate
      } catch {
        case NonFatal(e) => {
          Logger.error(s"can't delete a ${C.MOVIMIENTO_FONDO}. ${C.MF_ID} id: $id. Error ${e.toString}")
          throw e
        }
      }
    }
  }

  def get(user: CompanyUser, id: Int): MovimientoFondo = {
    load(user, id) match {
      case Some(p) => {
        MovimientoFondo(
          p.id,

          p.ids,
          p.base,
          p.references,
          p.fecha,
          p.cotizacion,
          p.total,

          loadMovimientoFondoItems(user, id)
        )
      }
      case None => emptyMovimientoFondo
    }
  }

  val K_FECHA_INI = 1
  val K_FECHA_FIN = 2
  val K_CLI_ID    = 4
  val K_EST_ID    = 5
  val K_CCOS_ID   = 6
  val K_SUC_ID    = 7
  val K_US_ID     = 8
  val K_DOC_ID    = 9
  val K_CPG_ID    = 10
  val K_EMP_ID    = 100

  def saveParams(user: CompanyUser, movimientoFondoParams: MovimientoFondoParams): MovimientoFondoParams = {
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
        Field(GC.LDP_VALOR, movimientoFondoParams.from, FieldType.text)
      ),
      List(
        Field(GC.LDP_ID, K_FECHA_FIN, FieldType.integer),
        Field(GC.LDP_ORDEN, 10, FieldType.integer),
        Field(GC.LDP_VALOR, movimientoFondoParams.to, FieldType.text)
      ),
      List(
        Field(GC.LDP_ID, K_CLI_ID, FieldType.integer),
        Field(GC.LDP_ORDEN, 20, FieldType.integer),
        Field(GC.LDP_VALOR, movimientoFondoParams.cliId, FieldType.text)
      ),
      List(
        Field(GC.LDP_ID, K_EST_ID, FieldType.integer),
        Field(GC.LDP_ORDEN, 30, FieldType.integer),
        Field(GC.LDP_VALOR, movimientoFondoParams.estId, FieldType.text)
      ),
      List(
        Field(GC.LDP_ID, K_CCOS_ID, FieldType.integer),
        Field(GC.LDP_ORDEN, 40, FieldType.integer),
        Field(GC.LDP_VALOR, movimientoFondoParams.ccosId, FieldType.text)
      ),
      List(
        Field(GC.LDP_ID, K_SUC_ID, FieldType.integer),
        Field(GC.LDP_ORDEN, 50, FieldType.integer),
        Field(GC.LDP_VALOR, movimientoFondoParams.sucId, FieldType.text)
      ),
      List(
        Field(GC.LDP_ID, K_US_ID, FieldType.integer),
        Field(GC.LDP_ORDEN, 50, FieldType.integer),
        Field(GC.LDP_VALOR, movimientoFondoParams.usId, FieldType.text)
      ),
      List(
        Field(GC.LDP_ID, K_DOC_ID, FieldType.integer),
        Field(GC.LDP_ORDEN, 60, FieldType.integer),
        Field(GC.LDP_VALOR, movimientoFondoParams.docId, FieldType.text)
      ),
      List(
        Field(GC.LDP_ID, K_EMP_ID, FieldType.integer),
        Field(GC.LDP_ORDEN, 80, FieldType.integer),
        Field(GC.LDP_VALOR, movimientoFondoParams.empId, FieldType.text)
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
          Logger.error(s"can't save parameters for MovimientoFondo")
          throw e
        }
      }
    }

    paramList.map(param => saveParam(baseFields ::: param))

    loadParams(user).getOrElse(throwException)
  }

  def loadParams(user: CompanyUser): Option[MovimientoFondoParams] = {

    val params = DocumentListParam.load(user, S.LIST_MOVIMIENTO_FONDO)

    if(params.isEmpty) {
      Some(emptyMovimientoFondoParams)
    }
    else {
      val cli = DocumentListParam.getParamValue(
        user, K_CLI_ID, params, emptyMovimientoFondoParams.cliId,
        GC.CLIENTE, GC.CLI_ID, GC.CLI_NAME
      )
      val est = DocumentListParam.getParamValue(
        user, K_EST_ID, params, emptyMovimientoFondoParams.estId,
        GC.ESTADO, GC.EST_ID, GC.EST_NAME
      )
      val ccos = DocumentListParam.getParamValue(
        user, K_CCOS_ID, params, emptyMovimientoFondoParams.ccosId,
        GC.CENTRO_COSTO, GC.CCOS_ID, GC.CCOS_NAME
      )
      val suc = DocumentListParam.getParamValue(
        user, K_SUC_ID, params, emptyMovimientoFondoParams.sucId,
        GC.SUCURSAL, GC.SUC_ID, GC.SUC_NAME
      )
      val us = DocumentListParam.getParamValue(
        user, K_US_ID, params, emptyMovimientoFondoParams.usId,
        GC.USUARIO, GC.US_ID, GC.US_NAME
      )
      val doc = DocumentListParam.getParamValue(
        user, K_DOC_ID, params, emptyMovimientoFondoParams.docId,
        GC.DOCUMENTO, GC.DOC_ID, GC.DOC_NAME
      )
      val emp = DocumentListParam.getParamValue(
        user, K_EMP_ID, params, emptyMovimientoFondoParams.empId,
        GC.EMPRESA, GC.EMP_ID, GC.EMP_NAME
      )

      Some(
        MovimientoFondoParams(
          DocumentListParam.getParamValue(K_FECHA_INI, params, emptyMovimientoFondoParams.from),
          DocumentListParam.getParamValue(K_FECHA_FIN, params, emptyMovimientoFondoParams.to),
          cli.id,
          cli.value,
          est.id,
          est.value,
          ccos.id,
          ccos.value,
          suc.id,
          suc.value,
          us.id,
          us.value,
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
           cliId: Option[String],
           estId: Option[String],
           ccosId: Option[String],
           sucId: Option[String],
           docId: Option[String],
           empId: Option[String]): Recordset = {

    DB.withTransaction(user.database.database) { implicit connection =>

      val sql = "{call sp_lsdoc_movimientos_fondo(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)}"
      val cs = connection.prepareCall(sql)

      cs.setInt(1, user.masterUserId)
      cs.setDate(2, new java.sql.Date(from.getTime()))
      cs.setDate(3, new java.sql.Date(to.getTime()))
      cs.setString(4, cliId.getOrElse("0"))
      cs.setString(5, estId.getOrElse("0"))
      cs.setString(6, ccosId.getOrElse("0"))
      cs.setString(7, sucId.getOrElse("0"))
      cs.setString(8, sucId.getOrElse("0"))
      cs.setString(9, docId.getOrElse("0"))
      cs.setString(10, empId.getOrElse("0"))
      cs.registerOutParameter(11, Types.OTHER)

      try {
        cs.execute()

        val rs = cs.getObject(11).asInstanceOf[java.sql.ResultSet]
        Recordset.load(rs)

      } catch {
        case NonFatal(e) => {
          Logger.error(s"can't get listing of movimientos de fondo for user ${user.toString}. Error ${e.toString}")
          throw e
        }
      } finally {
        cs.close
      }
    }
  }

}
