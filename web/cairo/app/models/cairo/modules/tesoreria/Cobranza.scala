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

case class CobranzaId(
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

object CobranzaId {

  def apply(
             docId: Int,
             numero: Int,
             nroDoc: String) = {

    new CobranzaId(
      docId,
      numero,
      nroDoc)
  }
}

case class CobranzaReferences(
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

object CobranzaReferences {

  def apply(
             doctId: Int,
             taMascara: String,
             taPropuesto: Boolean,
             firmado: Boolean,
             asId: Int,
             editable: Boolean,
             editMsg: String
             ) = {

    new CobranzaReferences(
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

case class CobranzaBase(
                         cliId: Int,
                         cliName: String,
                         estId: Int,
                         estName: String,
                         ccosId: Int,
                         ccosName: String,
                         sucId: Int,
                         sucName: String,
                         cobId: Int,
                         cobName: String,
                         lgjId: Int,
                         lgjCode: String,
                         descrip: String,
                         grabarAsiento: Boolean
                         ) {
  def this(
            cliId: Int,
            estId: Int,
            ccosId: Int,
            sucId: Int,
            cobId: Int,
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
      cobId,
      "",
      lgjId,
      "",
      descrip,
      grabarAsiento
    )
  }
}

object CobranzaBase {

  def apply(
             cliId: Int,
             estId: Int,
             ccosId: Int,
             sucId: Int,
             cobId: Int,
             lgjId: Int,
             descrip: String,
             grabarAsiento: Boolean) = {

    new CobranzaBase(
      cliId,
      estId,
      ccosId,
      sucId,
      cobId,
      lgjId,
      descrip,
      grabarAsiento)
  }
}

case class CobranzaTotals(
                           neto: Double,
                           totalOtros: Double,
                           total: Double
                         )

case class CobranzaItemBase(
                             descrip: String,
                             cueId: Int,
                             cueName: String,
                             ccosId: Int,
                             ccosName: String,
                             orden: Int
                           )

object CobranzaItemBase {

  def apply(descrip: String,
            cueId: Int,
            ccosId: Int,
            orden: Int) = {

    new CobranzaItemBase(
      descrip,
      cueId,
      "",
      ccosId,
      "",
      orden
    )
  }
}

case class CobranzaItemTotals(
                               importe: Double,
                               importeOrigen: Double
                               )

case class CobranzaItemMoneda(
                               monId: Int,
                               monName: String
                             )

case class CobranzaItemCheque(
                               id: Int,
                               base: CobranzaItemBase,
                               moneda: CobranzaItemMoneda,
                               totals: CobranzaItemTotals,
                               bcoId: Int,
                               bcoName: String,
                               cheqId: Int,
                               numero: Int,
                               numeroDoc: String,
                               propio: Boolean,
                               fechaCobro: Date,
                               fechaVto: Date,
                               cleId: Int,
                               cleName: String
                             )

object CobranzaItemCheque {

  def apply(id: Int,
            base: CobranzaItemBase,
            monId: Int,
            totals: CobranzaItemTotals,
            bcoId: Int,
            cheqId: Int,
            numeroDoc: String,
            propio: Boolean,
            fechaCobro: Date,
            fechaVto: Date,
            cleId: Int) = {

    new CobranzaItemCheque(
      id,
      base,
      CobranzaItemMoneda(monId, ""),
      totals,
      bcoId,
      "",
      cheqId: Int,
      0,
      numeroDoc,
      propio,
      fechaCobro,
      fechaVto,
      cleId,
      ""
    )
  }
}

case class CobranzaItemTarjeta(
                                id: Int,
                                base: CobranzaItemBase,
                                moneda: CobranzaItemMoneda,
                                totals: CobranzaItemTotals,
                                tjccId: Int,
                                cuponNumero: Int,
                                cuponNumeroDoc: String,
                                tjcId: Int,
                                tjcName: String,
                                tjccuId: Int,
                                cuotas: Int,
                                fechaVto: Date,
                                numero: String,
                                autorizacion: String,
                                tarjetaTipo: Int,
                                titular: String
                              )

object CobranzaItemTarjeta {

  def apply(id: Int,
            base: CobranzaItemBase,
            monId: Int,
            totals: CobranzaItemTotals,
            tjccId: Int,
            cuponNumeroDoc: String,
            tjcId: Int,
            tjccuId: Int,
            fechaVto: Date,
            numero: String,
            autorizacion: String,
            tarjetaTipo: Int,
            titular: String) = {

    new CobranzaItemTarjeta(
      id,
      base,
      CobranzaItemMoneda(monId, ""),
      totals,
      tjccId,
      0,
      cuponNumeroDoc,
      tjcId,
      "",
      tjccuId,
      0,
      fechaVto,
      numero,
      autorizacion,
      tarjetaTipo,
      titular
    )
  }
}

case class CobranzaItemEfectivo(
                                 id: Int,
                                 base: CobranzaItemBase,
                                 moneda: CobranzaItemMoneda,
                                 totals: CobranzaItemTotals
                               )

object CobranzaItemEfectivo {

  def apply(id: Int,
            base: CobranzaItemBase,
            monId: Int,
            totals: CobranzaItemTotals) = {

    new CobranzaItemEfectivo(
      id,
      base,
      CobranzaItemMoneda(monId, ""),
      totals
    )
  }
}

case class CobranzaItemRetencion(
                                  retId: Int,
                                  retName: String,
                                  numero: String,
                                  porcentaje: Double,
                                  fecha: Date,
                                  fvId: Int,
                                  numeroDoc: String
                                )

object CobranzaItemRetencion {

  def apply(retId: Int,
            numero: String,
            porcentaje: Double,
            fecha: Date,
            fvId: Int) = {

    new CobranzaItemRetencion(
      retId,
      "",
      numero,
      porcentaje,
      fecha,
      fvId,
      ""
    )
  }
}

case class CobranzaItemOtro(
                             id: Int,
                             base: CobranzaItemBase,
                             totals: CobranzaItemTotals,
                             tipo: Int,
                             retencion: CobranzaItemRetencion
                           )

case class CobranzaItemCuentaCorriente(
                                        id: Int,
                                        base: CobranzaItemBase,
                                        moneda: CobranzaItemMoneda,
                                        totals: CobranzaItemTotals
                                      )

object CobranzaItemCuentaCorriente {

  def apply(id: Int,
            base: CobranzaItemBase,
            monId: Int,
            totals: CobranzaItemTotals) = {

    new CobranzaItemCuentaCorriente(
      id,
      base,
      CobranzaItemMoneda(monId, ""),
      totals
    )
  }
}

case class FacturaCobranza(
                            fvId: Int,
                            fvdId: Int,
                            importe: Double,
                            importeOrigen: Double,
                            cotizacion: Double
                          )

case class CobranzaItems(
                          cheques: List[CobranzaItemCheque],
                          tarjetas: List[CobranzaItemTarjeta],
                          efectivo: List[CobranzaItemEfectivo],
                          otros: List[CobranzaItemOtro],
                          cuentaCorriente: List[CobranzaItemCuentaCorriente],

                          /* only used in save */
                          chequeDeleted: String,
                          tarjetaDeleted: String,
                          efectivoDeleted: String,
                          otroDeleted: String,
                          cuentaCorrienteDeleted: String,

                          facturas: List[FacturaCobranza]
                        )

case class Cobranza(
                     id: Int,

                     ids: CobranzaId,
                     base: CobranzaBase,
                     references: CobranzaReferences,
                     fecha: Date,
                     cotizacion: Double,
                     totals: CobranzaTotals,

                     items: CobranzaItems,

                     createdAt: Date,
                     updatedAt: Date,
                     updatedBy: Int
                     ) {

  def this(
            id: Int,

            ids: CobranzaId,
            base: CobranzaBase,
            references: CobranzaReferences,
            fecha: Date,
            cotizacion: Double,
            totals: CobranzaTotals,

            items: CobranzaItems) = {

    this(
      id,

      ids,
      base,
      references,
      fecha,
      cotizacion,
      totals,

      items,

      DateUtil.currentTime,
      DateUtil.currentTime,
      DBHelper.NoId)
  }

  def this(
            ids: CobranzaId,
            base: CobranzaBase,
            references: CobranzaReferences,
            fecha: Date,
            cotizacion: Double,
            totals: CobranzaTotals,

            items: CobranzaItems) = {

    this(
      DBHelper.NoId,

      ids,
      base,
      references,
      fecha,
      cotizacion,
      totals,

      items
    )
  }

}

case class CobranzaParams(
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
                           docId: String,
                           docName: String,
                           cobId: String,
                           cobName: String,
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
            docId: String,
            cobId: String,
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
      docId,
      "",
      cobId,
      "",
      empId,
      ""
    )
  }
}

object CobranzaParams {
  def apply(
             from: String,
             to: String,
             cliId: String,
             estId: String,
             ccosId: String,
             sucId: String,
             docId: String,
             cobId: String,
             empId: String
             ) = {

    new CobranzaParams(
      from,
      to,
      cliId,
      estId,
      ccosId,
      sucId,
      docId,
      cobId,
      empId
    )
  }
}

object Cobranza {

  lazy val GC = models.cairo.modules.general.C

  lazy val emptyCobranzaItems = CobranzaItems(List(), List(), List(), List(), List(), "", "", "", "", "", List())

  lazy val emptyCobranzaReferences = CobranzaReferences(DBHelper.NoId, "", false, false, DBHelper.NoId, false, "")

  lazy val emptyCobranza = Cobranza(
    CobranzaId(DBHelper.NoId, 0, ""),
    CobranzaBase(DBHelper.NoId, DBHelper.NoId, DBHelper.NoId, DBHelper.NoId, DBHelper.NoId, DBHelper.NoId, "", false),
    emptyCobranzaReferences,
    U.NO_DATE,
    0,
    CobranzaTotals(0.0, 0.0, 0.0),
    emptyCobranzaItems
  )

  lazy val emptyCobranzaParams = CobranzaParams(
    DateFormatter.format(DateUtil.plusDays(DateUtil.currentTime, -60)),
    DateFormatter.format(DateUtil.currentTime), "0", "", "0", "", "0", "", "0", "", "0", "", "0", "", "0", "")

  def apply(
             id: Int,

             ids: CobranzaId,
             base: CobranzaBase,
             references: CobranzaReferences,
             fecha: Date,
             cotizacion: Double,
             totals: CobranzaTotals,

             items: CobranzaItems
             ) = {

    new Cobranza(
      id,

      ids,
      base,
      references,
      fecha,
      cotizacion,
      totals,

      items
    )
  }

  def apply(
             id: Int,

             ids: CobranzaId,
             base: CobranzaBase,
             references: CobranzaReferences,
             fecha: Date,
             cotizacion: Double,
             totals: CobranzaTotals
             ) = {

    new Cobranza(
      id,

      ids,
      base,
      references,
      fecha,
      cotizacion,
      totals,

      emptyCobranzaItems
    )
  }

  def apply(
             ids: CobranzaId,
             base: CobranzaBase,
             references: CobranzaReferences,
             fecha: Date,
             cotizacion: Double,
             totals: CobranzaTotals,

             items: CobranzaItems
             ) = {

    new Cobranza(
      ids,
      base,
      references,
      fecha,
      cotizacion,
      totals,

      items
    )
  }

  def apply(
             ids: CobranzaId,
             base: CobranzaBase,
             references: CobranzaReferences,
             fecha: Date,
             cotizacion: Double,
             totals: CobranzaTotals
             ) = {

    new Cobranza(

      ids,
      base,
      references,
      fecha,
      cotizacion,
      totals,

      emptyCobranzaItems
    )
  }

  private val cobranzaItemChequeParser: RowParser[CobranzaItemCheque] = {
    SqlParser.get[Int](C.COBZI_ID) ~
    SqlParser.get[String](C.COBZI_DESCRIP) ~
    SqlParser.get[Int](GC.CUE_ID) ~
    SqlParser.get[String](GC.CUE_NAME) ~
    SqlParser.get[Option[Int]](GC.CCOS_ID) ~
    SqlParser.get[Option[String]](GC.CCOS_NAME) ~
    SqlParser.get[Int](GC.MON_ID) ~
    SqlParser.get[String](GC.MON_NAME) ~
    SqlParser.get[BigDecimal](C.COBZI_IMPORTE) ~
    SqlParser.get[BigDecimal](C.COBZI_IMPORTE_ORIGEN) ~
    SqlParser.get[Int](GC.BCO_ID) ~
    SqlParser.get[String](GC.BCO_NAME) ~
    SqlParser.get[Int](C.CHEQ_ID) ~
    SqlParser.get[Int](C.CHEQ_NUMERO) ~
    SqlParser.get[String](C.CHEQ_NUMERO_DOC) ~
    SqlParser.get[Int](C.CHEQ_PROPIO) ~
    SqlParser.get[Date](C.CHEQ_FECHA_COBRO) ~
    SqlParser.get[Date](C.CHEQ_FECHA_VTO) ~
    SqlParser.get[Int](GC.CLE_ID) ~
    SqlParser.get[String](GC.CLE_NAME) ~
    SqlParser.get[Int](C.COBZI_ORDEN) map {
    case
        id ~
        descrip ~
        cueId ~
        cueName ~
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
        propio ~
        fechaCobro ~
        fechaVto ~
        cleId ~
        cleName ~
        orden =>
      CobranzaItemCheque(
        id,
        CobranzaItemBase(
          descrip,
          cueId,
          cueName,
          ccosId.getOrElse(DBHelper.NoId),
          ccosName.getOrElse(""),
          orden
        ),
        CobranzaItemMoneda(monId, monName),
        CobranzaItemTotals(
          importe.doubleValue(),
          importeOrigen.doubleValue()
        ),
        bcoId,
        bcoName,
        cheqId,
        numero,
        numeroDoc,
        propio != 0,
        fechaCobro,
        fechaVto,
        cleId,
        cleName
      )
    }
  }

  private val cobranzaItemTarjetaParser: RowParser[CobranzaItemTarjeta] = {
    SqlParser.get[Int](C.COBZI_ID) ~
    SqlParser.get[String](C.COBZI_DESCRIP) ~
    SqlParser.get[Int](GC.CUE_ID) ~
    SqlParser.get[String](GC.CUE_NAME) ~
    SqlParser.get[Option[Int]](GC.CCOS_ID) ~
    SqlParser.get[Option[String]](GC.CCOS_NAME) ~
    SqlParser.get[Int](GC.MON_ID) ~
    SqlParser.get[String](GC.MON_NAME) ~
    SqlParser.get[BigDecimal](C.COBZI_IMPORTE) ~
    SqlParser.get[BigDecimal](C.COBZI_IMPORTE_ORIGEN) ~
    SqlParser.get[Int](C.TJCC_ID) ~
    SqlParser.get[Int](C.TJCC_NUMERO) ~
    SqlParser.get[String](C.TJCC_NUMERO_DOC) ~
    SqlParser.get[Int](GC.TJC_ID) ~
    SqlParser.get[String](GC.TJC_NAME) ~
    SqlParser.get[Int](GC.TJCCU_ID) ~
    SqlParser.get[Int](GC.TJCCU_CANTIDAD) ~
    SqlParser.get[Date](C.TJCC_FECHA_VTO) ~
    SqlParser.get[String](C.TJCC_NRO_TARJETA) ~
    SqlParser.get[String](C.TJCC_NRO_AUTORIZACION) ~
    SqlParser.get[Int](C.COBZI_TARJETA_TIPO) ~
    SqlParser.get[String](C.TJCC_TITULAR) ~
    SqlParser.get[Int](C.COBZI_ORDEN) map {
    case
        id ~
        descrip ~
        cueId ~
        cueName ~
        ccosId ~
        ccosName ~
        monId ~
        monName ~
        importe ~
        importeOrigen ~
        tjccId ~
        cuponNumero ~
        cuponNumeroDoc ~
        tjcId ~
        tjcName ~
        tjccuId ~
        cuotas ~
        fechaVto ~
        numero ~
        autorizacion ~
        tarjetaTipo ~
        titular ~
        orden =>
      CobranzaItemTarjeta(
        id,
        CobranzaItemBase(
          descrip,
          cueId,
          cueName,
          ccosId.getOrElse(DBHelper.NoId),
          ccosName.getOrElse(""),
          orden
        ),
        CobranzaItemMoneda(monId, monName),
        CobranzaItemTotals(
          importe.doubleValue(),
          importeOrigen.doubleValue()
        ),
        tjccId,
        cuponNumero,
        cuponNumeroDoc,
        tjcId,
        tjcName,
        tjccuId,
        cuotas,
        fechaVto,
        numero,
        autorizacion,
        tarjetaTipo,
        titular
      )
    }
  }

  private val cobranzaItemEfectivoParser: RowParser[CobranzaItemEfectivo] = {
    SqlParser.get[Int](C.COBZI_ID) ~
    SqlParser.get[String](C.COBZI_DESCRIP) ~
    SqlParser.get[Int](GC.CUE_ID) ~
    SqlParser.get[String](GC.CUE_NAME) ~
    SqlParser.get[Option[Int]](GC.CCOS_ID) ~
    SqlParser.get[Option[String]](GC.CCOS_NAME) ~
    SqlParser.get[Int](GC.MON_ID) ~
    SqlParser.get[String](GC.MON_NAME) ~
    SqlParser.get[BigDecimal](C.COBZI_IMPORTE) ~
    SqlParser.get[BigDecimal](C.COBZI_IMPORTE_ORIGEN) ~
    SqlParser.get[Int](C.COBZI_ORDEN) map {
    case
        id ~
        descrip ~
        cueId ~
        cueName ~
        ccosId ~
        ccosName ~
        monId ~
        monName ~
        importe ~
        importeOrigen ~
        orden =>
      CobranzaItemEfectivo(
        id,
        CobranzaItemBase(
          descrip,
          cueId,
          cueName,
          ccosId.getOrElse(DBHelper.NoId),
          ccosName.getOrElse(""),
          orden
        ),
        CobranzaItemMoneda(monId, monName),
        CobranzaItemTotals(
          importe.doubleValue(),
          importeOrigen.doubleValue()
        )
      )
    }
  }

  private val cobranzaItemOtroParser: RowParser[CobranzaItemOtro] = {
    SqlParser.get[Int](C.COBZI_ID) ~
    SqlParser.get[String](C.COBZI_DESCRIP) ~
    SqlParser.get[Int](GC.CUE_ID) ~
    SqlParser.get[String](GC.CUE_NAME) ~
    SqlParser.get[Option[Int]](GC.CCOS_ID) ~
    SqlParser.get[Option[String]](GC.CCOS_NAME) ~
    SqlParser.get[BigDecimal](C.COBZI_IMPORTE) ~
    SqlParser.get[BigDecimal](C.COBZI_IMPORTE_ORIGEN) ~
    SqlParser.get[Int](C.COBZI_OTRO_TIPO) ~
    SqlParser.get[Int](GC.RET_ID) ~
    SqlParser.get[String](GC.RET_NAME) ~
    SqlParser.get[String](C.COBZI_NRO_RETENCION) ~
    SqlParser.get[BigDecimal](C.COBZI_PORC_RETENCION) ~
    SqlParser.get[Date](C.COBZI_FECHA_RETENCION) ~
    SqlParser.get[Option[Int]](C.FV_ID_RET) ~
    SqlParser.get[Option[String]](models.cairo.modules.ventas.C.FV_NRODOC) ~
    SqlParser.get[Int](C.COBZI_ORDEN) map {
    case
        id ~
        descrip ~
        cueId ~
        cueName ~
        ccosId ~
        ccosName ~
        importe ~
        importeOrigen ~
        tipo ~
        retId ~
        retName ~
        numero ~
        porcentaje ~
        fecha ~
        fvId ~
        numeroDoc ~
        orden =>
      CobranzaItemOtro(
        id,
        CobranzaItemBase(
          descrip,
          cueId,
          cueName,
          ccosId.getOrElse(DBHelper.NoId),
          ccosName.getOrElse(""),
          orden
        ),
        CobranzaItemTotals(
          importe.doubleValue(),
          importeOrigen.doubleValue()
        ),
        tipo,
        CobranzaItemRetencion(
          retId,
          retName,
          numero,
          porcentaje.doubleValue(),
          fecha,
          fvId.getOrElse(DBHelper.NoId),
          numeroDoc.getOrElse("")
        )
      )
    }
  }

  private val cobranzaItemCuentaCorrienteParser: RowParser[CobranzaItemCuentaCorriente] = {
    SqlParser.get[Int](C.COBZI_ID) ~
    SqlParser.get[String](C.COBZI_DESCRIP) ~
    SqlParser.get[Int](GC.CUE_ID) ~
    SqlParser.get[String](GC.CUE_NAME) ~
    SqlParser.get[Option[Int]](GC.CCOS_ID) ~
    SqlParser.get[Option[String]](GC.CCOS_NAME) ~
    SqlParser.get[Int](GC.MON_ID) ~
    SqlParser.get[String](GC.MON_NAME) ~
    SqlParser.get[BigDecimal](C.COBZI_IMPORTE) ~
    SqlParser.get[BigDecimal](C.COBZI_IMPORTE_ORIGEN) ~
    SqlParser.get[Int](C.COBZI_ORDEN) map {
    case
        id ~
        descrip ~
        cueId ~
        cueName ~
        ccosId ~
        ccosName ~
        monId ~
        monName ~
        importe ~
        importeOrigen ~
        orden =>
      CobranzaItemCuentaCorriente(
        id,
        CobranzaItemBase(
          descrip,
          cueId,
          cueName,
          ccosId.getOrElse(DBHelper.NoId),
          ccosName.getOrElse(""),
          orden
        ),
        CobranzaItemMoneda(monId, monName),
        CobranzaItemTotals(
          importe.doubleValue(),
          importeOrigen.doubleValue()
        )
      )
    }
  }

  private val cobranzaParser: RowParser[Cobranza] = {
    SqlParser.get[Int](C.COBZ_ID) ~
    SqlParser.get[Int](GC.DOC_ID) ~
    SqlParser.get[String](GC.DOC_NAME) ~
    SqlParser.get[Int](C.COBZ_NUMERO) ~
    SqlParser.get[String](C.COBZ_NRODOC) ~
    SqlParser.get[Int](GC.CLI_ID) ~
    SqlParser.get[String](GC.CLI_NAME) ~
    SqlParser.get[Int](GC.EST_ID) ~
    SqlParser.get[String](GC.EST_NAME) ~
    SqlParser.get[Option[Int]](GC.CCOS_ID) ~
    SqlParser.get[Option[String]](GC.CCOS_NAME) ~
    SqlParser.get[Int](GC.SUC_ID) ~
    SqlParser.get[String](GC.SUC_NAME) ~
    SqlParser.get[Option[Int]](GC.COB_ID) ~
    SqlParser.get[Option[String]](GC.COB_NAME) ~
    SqlParser.get[Option[Int]](GC.LGJ_ID) ~
    SqlParser.get[Option[String]](GC.LGJ_CODE) ~
    SqlParser.get[String](C.COBZ_DESCRIP) ~
    SqlParser.get[Int](C.COBZ_GRABAR_ASIENTO) ~
    SqlParser.get[Int](GC.DOCT_ID) ~
    SqlParser.get[String](GC.DOCT_NAME) ~
    SqlParser.get[String](GC.TA_MASCARA) ~
    SqlParser.get[Int](GC.TA_PROPUESTO) ~
    SqlParser.get[Int](C.COBZ_FIRMADO) ~
    SqlParser.get[Option[Int]](C.AS_ID) ~
    SqlParser.get[Int](GC.EDITABLE) ~
    SqlParser.get[String](GC.EDIT_MSG) ~
    SqlParser.get[Date](C.COBZ_FECHA) ~
    SqlParser.get[BigDecimal](C.COBZ_COTIZACION) ~
    SqlParser.get[BigDecimal](C.COBZ_NETO) ~
    SqlParser.get[BigDecimal](C.COBZ_OTROS) ~
    SqlParser.get[BigDecimal](C.COBZ_TOTAL) ~
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
        cobId ~
        cobName ~
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
        neto ~
        totalOtros ~
        total ~
        createdAt ~
        updatedAt ~
        updatedBy =>
      Cobranza(
        id,
        CobranzaId(
          docId,
          docName,
          numero,
          nroDoc
        ),
        CobranzaBase(
          cliId,
          cliName,
          estId,
          estName,
          ccosId.getOrElse(DBHelper.NoId),
          ccosName.getOrElse(""),
          sucId,
          sucName,
          cobId.getOrElse(DBHelper.NoId),
          cobName.getOrElse(""),
          lgjId.getOrElse(DBHelper.NoId),
          lgjCode.getOrElse(""),
          descrip,
          grabarAsiento != 0
        ),
        CobranzaReferences(
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
        CobranzaTotals(
          neto.doubleValue(),
          totalOtros.doubleValue(),
          total.doubleValue()
        ),
        emptyCobranzaItems,
        createdAt,
        updatedAt,
        updatedBy)
    }
  }

  def createCobranza(user: CompanyUser, cobranza: Cobranza): Cobranza = {
    save(user, cobranza)
  }

  def create(user: CompanyUser, cobranza: Cobranza): Cobranza = {
    save(user, cobranza)
  }

  def update(user: CompanyUser, cobranza: Cobranza): Cobranza = {
    save(user, cobranza)
  }

  private def save(user: CompanyUser, cobranza: Cobranza): Cobranza = {
    def getFields = {
      List(
        Field(C.COBZ_ID, cobranza.id, FieldType.number),
        Field(GC.DOC_ID, cobranza.ids.docId, FieldType.id),
        Field(C.COBZ_NRODOC, cobranza.ids.nroDoc, FieldType.text),
        Field(C.COBZ_NUMERO, cobranza.ids.numero, FieldType.number),

        Field(GC.CLI_ID, cobranza.base.cliId, FieldType.id),
        Field(GC.EST_ID, cobranza.base.estId, FieldType.id),
        Field(GC.CCOS_ID, cobranza.base.ccosId, FieldType.id),
        Field(GC.SUC_ID, cobranza.base.sucId, FieldType.id),
        Field(GC.COB_ID, cobranza.base.cobId, FieldType.id),
        Field(GC.LGJ_ID, cobranza.base.lgjId, FieldType.id),
        Field(C.COBZ_DESCRIP, cobranza.base.descrip, FieldType.text),
        Field(C.COBZ_GRABAR_ASIENTO, Register.boolToInt(cobranza.base.grabarAsiento), FieldType.boolean),

        Field(C.COBZ_FECHA, cobranza.fecha, FieldType.date),

        Field(C.COBZ_COTIZACION, cobranza.cotizacion, FieldType.currency),

        Field(C.COBZ_NETO, cobranza.totals.neto, FieldType.currency),
        Field(C.COBZ_OTROS, cobranza.totals.totalOtros, FieldType.currency),
        Field(C.COBZ_TOTAL, cobranza.totals.total, FieldType.currency)
      )
    }

    def getChequeFields(item: CobranzaItemCheque, cobzTMPId: Int) = {
      List(
        Field(C.COBZ_TMP_ID, cobzTMPId, FieldType.id),
        Field(C.COBZI_ID, item.id, FieldType.number),
        Field(C.COBZI_TIPO, C.COBRANZA_ITEM_TIPO_CHEQUES, FieldType.number),
        Field(C.COBZI_DESCRIP, item.base.descrip, FieldType.text),
        Field(GC.CUE_ID, item.base.cueId, FieldType.id),
        Field(GC.CCOS_ID, item.base.ccosId, FieldType.id),
        Field(GC.BCO_ID, item.bcoId, FieldType.id),
        Field(GC.CLE_ID, item.cleId, FieldType.id),
        Field(GC.MON_ID, item.moneda.monId, FieldType.id),
        Field(C.COBZI_ORDEN, item.base.orden, FieldType.integer),
        Field(C.COBZI_IMPORTE, item.totals.importe, FieldType.currency),
        Field(C.COBZI_IMPORTE_ORIGEN, item.totals.importeOrigen, FieldType.currency)
      )
    }

    def getTarjetaFields(item: CobranzaItemTarjeta, cobzTMPId: Int) = {
      List(
        Field(C.COBZ_TMP_ID, cobzTMPId, FieldType.id),
        Field(C.COBZI_ID, item.id, FieldType.number),
        Field(C.COBZI_TIPO, C.COBRANZA_ITEM_TIPO_TARJETAS, FieldType.number),
        Field(C.COBZI_DESCRIP, item.base.descrip, FieldType.text),
        Field(GC.CUE_ID, item.base.cueId, FieldType.id),
        Field(GC.CCOS_ID, item.base.ccosId, FieldType.id),
        Field(C.COBZI_ORDEN, item.base.orden, FieldType.integer),
        Field(C.COBZI_IMPORTE, item.totals.importe, FieldType.currency),
        Field(C.COBZI_IMPORTE_ORIGEN, item.totals.importeOrigen, FieldType.currency)
      )
    }

    def getEfectivoFields(item: CobranzaItemEfectivo, cobzTMPId: Int) = {
      List(
        Field(C.COBZ_TMP_ID, cobzTMPId, FieldType.id),
        Field(C.COBZI_ID, item.id, FieldType.number),
        Field(C.COBZI_TIPO, C.COBRANZA_ITEM_TIPO_EFECTIVO, FieldType.number),
        Field(C.COBZI_DESCRIP, item.base.descrip, FieldType.text),
        Field(GC.CUE_ID, item.base.cueId, FieldType.id),
        Field(GC.CCOS_ID, item.base.ccosId, FieldType.id),
        Field(C.COBZI_ORDEN, item.base.orden, FieldType.integer),
        Field(C.COBZI_IMPORTE, item.totals.importe, FieldType.currency),
        Field(C.COBZI_IMPORTE_ORIGEN, item.totals.importeOrigen, FieldType.currency)
      )
    }

    def getOtroFields(item: CobranzaItemOtro, cobzTMPId: Int) = {
      List(
        Field(C.COBZ_TMP_ID, cobzTMPId, FieldType.id),
        Field(C.COBZI_ID, item.id, FieldType.number),
        Field(C.COBZI_TIPO, C.COBRANZA_ITEM_TIPO_OTROS, FieldType.number),
        Field(C.COBZI_DESCRIP, item.base.descrip, FieldType.text),
        Field(GC.CUE_ID, item.base.cueId, FieldType.id),
        Field(GC.CCOS_ID, item.base.ccosId, FieldType.id),
        Field(C.COBZI_ORDEN, item.base.orden, FieldType.integer),
        Field(C.COBZI_IMPORTE, item.totals.importe, FieldType.currency),
        Field(C.COBZI_IMPORTE_ORIGEN, item.totals.importeOrigen, FieldType.currency)
      )
    }

    def getCtaCteFields(item: CobranzaItemCuentaCorriente, cobzTMPId: Int) = {
      List(
        Field(C.COBZ_TMP_ID, cobzTMPId, FieldType.id),
        Field(C.COBZI_ID, item.id, FieldType.number),
        Field(C.COBZI_TIPO, C.COBRANZA_ITEM_TIPO_CTA_CTE, FieldType.number),
        Field(C.COBZI_DESCRIP, item.base.descrip, FieldType.text),
        Field(GC.CUE_ID, item.base.cueId, FieldType.id),
        Field(GC.CCOS_ID, item.base.ccosId, FieldType.id),
        Field(C.COBZI_ORDEN, item.base.orden, FieldType.integer),
        Field(C.COBZI_IMPORTE, item.totals.importe, FieldType.currency),
        Field(C.COBZI_IMPORTE_ORIGEN, item.totals.importeOrigen, FieldType.currency)
      )
    }    
    
    def getDeletedItemFields(cobziId: Int, cobzTMPId: Int) = {
      List(
        Field(C.COBZ_TMP_ID, cobzTMPId, FieldType.id),
        Field(C.COBZI_ID, cobziId, FieldType.number),
        Field(C.COBZ_ID, cobranza.id, FieldType.id)
      )
    }
    
    def getFacturaFields(item: FacturaCobranza, cobzTMPId: Int) = {
      List(
        Field(C.COBZ_TMP_ID, cobzTMPId, FieldType.id),
        Field(C.COBZ_ID, 0, FieldType.number),
        Field(C.FV_COBZ_ID, 0, FieldType.number),
        Field(C.FV_ID, item.fvId, FieldType.id),
        Field(C.FVD_ID, item.fvdId, FieldType.id),
        Field(C.FV_COBZ_IMPORTE, item.importe, FieldType.currency),
        Field(C.FV_COBZ_IMPORTE_ORIGEN, item.importeOrigen, FieldType.currency),
        Field(C.FV_COBZ_COTIZACION, item.cotizacion, FieldType.currency)
      )
    }

    def throwError = {
      throwException(s"Error when saving ${C.COBRANZA}")
    }

    def throwException(message: String) = {
      throw new RuntimeException(message)
    }

    case class CobranzaChequeInfo(cobzTMPId: Int, item: CobranzaItemCheque)

    def saveCheque(itemInfo: CobranzaChequeInfo) = {
      DBHelper.save(
        user,
        Register(
          C.COBRANZA_ITEM_TMP,
          C.COBZI_TMP_ID,
          DBHelper.NoId,
          false,
          false,
          false,
          getChequeFields(itemInfo.item, itemInfo.cobzTMPId)),
        true
      ) match {
        case SaveResult(false, id) => throwError
        case _ =>
      }
    }

    case class CobranzaTarjetaInfo(cobzTMPId: Int, item: CobranzaItemTarjeta)

    def saveTarjeta(itemInfo: CobranzaTarjetaInfo) = {
      DBHelper.save(
        user,
        Register(
          C.COBRANZA_ITEM_TMP,
          C.COBZI_TMP_ID,
          DBHelper.NoId,
          false,
          false,
          false,
          getTarjetaFields(itemInfo.item, itemInfo.cobzTMPId)),
        true
      ) match {
        case SaveResult(false, id) => throwError
        case _ =>
      }
    }

    case class CobranzaEfectivoInfo(cobzTMPId: Int, item: CobranzaItemEfectivo)

    def saveEfectivo(itemInfo: CobranzaEfectivoInfo) = {
      DBHelper.save(
        user,
        Register(
          C.COBRANZA_ITEM_TMP,
          C.COBZI_TMP_ID,
          DBHelper.NoId,
          false,
          false,
          false,
          getEfectivoFields(itemInfo.item, itemInfo.cobzTMPId)),
        true
      ) match {
        case SaveResult(false, id) => throwError
        case _ =>
      }
    }

    case class CobranzaOtroInfo(cobzTMPId: Int, item: CobranzaItemOtro)

    def saveOtro(itemInfo: CobranzaOtroInfo) = {
      DBHelper.save(
        user,
        Register(
          C.COBRANZA_ITEM_TMP,
          C.COBZI_TMP_ID,
          DBHelper.NoId,
          false,
          false,
          false,
          getOtroFields(itemInfo.item, itemInfo.cobzTMPId)),
        true
      ) match {
        case SaveResult(false, id) => throwError
        case _ =>
      }
    }

    case class CobranzaCuentaCorrienteInfo(cobzTMPId: Int, item: CobranzaItemCuentaCorriente)

    def saveCtaCte(itemInfo: CobranzaCuentaCorrienteInfo) = {
      DBHelper.save(
        user,
        Register(
          C.COBRANZA_ITEM_TMP,
          C.COBZI_TMP_ID,
          DBHelper.NoId,
          false,
          false,
          false,
          getCtaCteFields(itemInfo.item, itemInfo.cobzTMPId)),
        true
      ) match {
        case SaveResult(false, id) => throwError
        case _ =>
      }
    }

    def saveDeletedItem(cobzTMPId: Int)(cobziId: String) = {
      val id = G.getIntOrZero(cobziId)
      if(id != 0) {
        DBHelper.save(
          user,
          Register(
            C.COBRANZA_ITEM_BORRADO_TMP,
            C.COBZIB_TMP_ID,
            DBHelper.NoId,
            false,
            false,
            false,
            getDeletedItemFields(id, cobzTMPId)),
          true
        ) match {
          case SaveResult(false, id) => throwError
          case _ =>
        }
      }
    }

    def saveCheques(cobzTMPId: Int) = {
      cobranza.items.cheques.map(item => saveCheque(CobranzaChequeInfo(cobzTMPId, item)))
      cobranza.items.chequeDeleted.split(",").map(saveDeletedItem(cobzTMPId))
    }

    def saveTarjetas(cobzTMPId: Int) = {
      cobranza.items.tarjetas.map(item => saveTarjeta(CobranzaTarjetaInfo(cobzTMPId, item)))
      cobranza.items.tarjetaDeleted.split(",").map(saveDeletedItem(cobzTMPId))
    }

    def saveEfectivos(cobzTMPId: Int) = {
      cobranza.items.efectivo.map(item => saveEfectivo(CobranzaEfectivoInfo(cobzTMPId, item)))
      cobranza.items.efectivoDeleted.split(",").map(saveDeletedItem(cobzTMPId))
    }

    def saveOtros(cobzTMPId: Int) = {
      cobranza.items.otros.map(item => saveOtro(CobranzaOtroInfo(cobzTMPId, item)))
      cobranza.items.otroDeleted.split(",").map(saveDeletedItem(cobzTMPId))
    }

    def saveCtaCtes(cobzTMPId: Int) = {
      cobranza.items.cuentaCorriente.map(item => saveCtaCte(CobranzaCuentaCorrienteInfo(cobzTMPId, item)))
      cobranza.items.cuentaCorrienteDeleted.split(",").map(saveDeletedItem(cobzTMPId))
    }
    
    case class FacturaCobranzaInfo(cobzTMPId: Int, item: FacturaCobranza)

    def saveFactura(itemInfo: FacturaCobranzaInfo) = {
      DBHelper.save(
        user,
        Register(
          C.FACTURA_VENTA_COBRANZA_TMP,
          C.FV_COBZ_TMP_ID,
          DBHelper.NoId,
          false,
          false,
          false,
          getFacturaFields(itemInfo.item, itemInfo.cobzTMPId)),
        true
      ) match {
        case SaveResult(true, id) => true
        case SaveResult(false, id) => throwError
      }
    }

    def saveFacturas(cobzTMPId: Int) = {
      cobranza.items.facturas.map(factura => saveFactura(FacturaCobranzaInfo(cobzTMPId, factura)))
    }

    case class RowResult(rowType: String, id: Int, message: String)

    def executeSave(cobzTMPId: Int): List[RowResult] = {

      DB.withTransaction(user.database.database) { implicit connection =>
        val sql = "select * from sp_doc_cobranza_save(?, ?)"
        val cs = connection.prepareStatement(sql)

        cs.setInt(1, user.masterUserId)
        cs.setInt(2, cobzTMPId)

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
          * ex: CREATE OR REPLACE FUNCTION sp_doc_cobranza_save( params )
          *     RETURNS SETOF row_result AS ...
          *
          * the field type is used to identify the value in the row. there are three
          * kind of types: resultset, success, key
          * for first two (resultset and success) the value of type is string with
          * one of these two values ex: 'resultset' or 'success'
          * when type == 'resultset' the field r must be not null and contain a ResultSet
          * when type == 'success' the id field can contain 0 (False) or not 0 (-1,1 or any other number but NO 0) (True)
          * the last kind of type is key. in this case the key must be the name of a column like cobz_id, as_id, pr_id, etc
          * it can be any column name. if the type is an integer like in cobz_id, as_id or any other id column the field id
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
                case "cobz_id" => RowResult("cobz_id", rs.getInt(2), "")
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
            Logger.error(s"can't save ${C.COBRANZA} with id ${cobranza.id} for user ${user.toString}. Error ${e.toString}")
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
            case RowResult("cobz_id", id, m) => id
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
        C.COBRANZA_TMP,
        C.COBZ_TMP_ID,
        DBHelper.NoId,
        false,
        true,
        true,
        getFields),
      true
    ) match {
      case SaveResult(true, cobzTMPId) => {
        saveCheques(cobzTMPId)
        saveTarjetas(cobzTMPId)
        saveEfectivos(cobzTMPId)
        saveOtros(cobzTMPId)
        saveCtaCtes(cobzTMPId)
        saveFacturas(cobzTMPId)
        val messagesAndId = executeSave(cobzTMPId)
        val id = getIdFromMessages(messagesAndId)
        load(user, id).getOrElse(throwError)
      }
      case SaveResult(false, id) => throwError
    }

  }

  def load(user: CompanyUser, id: Int): Option[Cobranza] = {

    DB.withTransaction(user.database.database) { implicit connection =>

      val sql = "{call sp_doc_cobranza_get(?, ?, ?, ?)}"
      val cs = connection.prepareCall(sql)

      cs.setInt(1, user.cairoCompanyId)
      cs.setInt(2, id)
      cs.setInt(3, user.masterUserId)
      cs.registerOutParameter(4, Types.OTHER)

      try {
        cs.execute()

        val rs = cs.getObject(4).asInstanceOf[java.sql.ResultSet]
        Sql.as(cobranzaParser.singleOpt, rs)

      } catch {
        case NonFatal(e) => {
          Logger.error(s"can't get ${C.COBRANZA} with id $id for user ${user.toString}. Error ${e.toString}")
          throw e
        }
      } finally {
        cs.close
      }
    }
  }

  private def loadCobranzaItems(user: CompanyUser, id: Int) = {
    val cheques = loadItems[CobranzaItemCheque](user, id, C.COBRANZA_ITEM_TIPO_CHEQUES, cobranzaItemChequeParser)
    val tarjetas = loadItems(user, id, C.COBRANZA_ITEM_TIPO_TARJETAS, cobranzaItemTarjetaParser)
    val efectivo = loadItems(user, id, C.COBRANZA_ITEM_TIPO_EFECTIVO, cobranzaItemEfectivoParser)
    val otros = loadItems(user, id, C.COBRANZA_ITEM_TIPO_OTROS, cobranzaItemOtroParser)
    val cuentaCorriente = loadItems(user, id, C.COBRANZA_ITEM_TIPO_CTA_CTE, cobranzaItemCuentaCorrienteParser)
    CobranzaItems(cheques, tarjetas, efectivo, otros, cuentaCorriente, "", "", "", "", "", List())
  }

  private def loadItems[T](user: CompanyUser, id: Int, tipo: Int, parser: RowParser[T]) = {

    DB.withTransaction(user.database.database) { implicit connection =>

      val sql = "{call sp_doc_cobranza_get_items(?, ?, ?)}"
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
          Logger.error(s"can't get ${C.COBRANZA_ITEM} with id $id for user ${user.toString}. Error ${e.toString}")
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
        SQL("sp_doc_cobranza_delete {id}, {empId}, {usId}")
          .on('id -> id, 'empId -> user.cairoCompanyId, 'usId -> user.masterUserId)
          .executeUpdate
      } catch {
        case NonFatal(e) => {
          Logger.error(s"can't delete a ${C.COBRANZA}. ${C.COBZ_ID} id: $id. Error ${e.toString}")
          throw e
        }
      }
    }
  }

  def get(user: CompanyUser, id: Int): Cobranza = {
    load(user, id) match {
      case Some(p) => {
        Cobranza(
          p.id,

          p.ids,
          p.base,
          p.references,
          p.fecha,
          p.cotizacion,
          p.totals,

          loadCobranzaItems(user, id)
        )
      }
      case None => emptyCobranza
    }
  }

  val K_FECHAINI  = 1
  val K_FECHAFIN  = 2
  val K_PROV_ID   = 4
  val K_EST_ID    = 5
  val K_CCOS_ID   = 6
  val K_SUC_ID    = 7
  val K_DOC_ID    = 9
  val K_CPG_ID    = 10
  val K_EMP_ID    = 100

  def saveParams(user: CompanyUser, cobranzaParams: CobranzaParams): CobranzaParams = {
    val baseFields = List(
      Field(GC.EMP_ID, user.cairoCompanyId, FieldType.id),
      Field(GC.US_ID, user.masterUserId, FieldType.id),
      Field(GC.PRE_ID, S.LIST_COBRANZA, FieldType.id)
    )

    def throwException = {
      throw new RuntimeException(s"Error when saving ${C.COBRANZA}")
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
        Field(GC.LDP_VALOR, cobranzaParams.from, FieldType.text)
      ),
      List(
        Field(GC.LDP_ID, K_FECHAFIN, FieldType.integer),
        Field(GC.LDP_ORDEN, 10, FieldType.integer),
        Field(GC.LDP_VALOR, cobranzaParams.to, FieldType.text)
      ),
      List(
        Field(GC.LDP_ID, K_PROV_ID, FieldType.integer),
        Field(GC.LDP_ORDEN, 20, FieldType.integer),
        Field(GC.LDP_VALOR, cobranzaParams.cliId, FieldType.text)
      ),
      List(
        Field(GC.LDP_ID, K_EST_ID, FieldType.integer),
        Field(GC.LDP_ORDEN, 30, FieldType.integer),
        Field(GC.LDP_VALOR, cobranzaParams.estId, FieldType.text)
      ),
      List(
        Field(GC.LDP_ID, K_CCOS_ID, FieldType.integer),
        Field(GC.LDP_ORDEN, 40, FieldType.integer),
        Field(GC.LDP_VALOR, cobranzaParams.ccosId, FieldType.text)
      ),
      List(
        Field(GC.LDP_ID, K_SUC_ID, FieldType.integer),
        Field(GC.LDP_ORDEN, 50, FieldType.integer),
        Field(GC.LDP_VALOR, cobranzaParams.sucId, FieldType.text)
      ),
      List(
        Field(GC.LDP_ID, K_DOC_ID, FieldType.integer),
        Field(GC.LDP_ORDEN, 60, FieldType.integer),
        Field(GC.LDP_VALOR, cobranzaParams.docId, FieldType.text)
      ),
      List(
        Field(GC.LDP_ID, K_CPG_ID, FieldType.integer),
        Field(GC.LDP_ORDEN, 70, FieldType.integer),
        Field(GC.LDP_VALOR, cobranzaParams.cobId, FieldType.text)
      ),
      List(
        Field(GC.LDP_ID, K_EMP_ID, FieldType.integer),
        Field(GC.LDP_ORDEN, 80, FieldType.integer),
        Field(GC.LDP_VALOR, cobranzaParams.empId, FieldType.text)
      )
    )

    DB.withConnection(user.database.database) { implicit connection =>
      try {
        SQL(s"""DELETE FROM ListaDocumentoParametro
              | WHERE pre_id = {preId}
              | AND (emp_id is null or emp_id = {empId})
              | AND us_id = {usId}""".stripMargin)
          .on(
            'preId -> S.LIST_COBRANZA,
            'empId -> user.cairoCompanyId,
            'usId -> user.masterUserId
          )
          .executeUpdate
      } catch {
        case NonFatal(e) => {
          Logger.error(s"can't save parameters for Cobranza")
          throw e
        }
      }
    }

    paramList.map(param => saveParam(baseFields ::: param))

    loadParams(user).getOrElse(throwException)
  }

  def loadParams(user: CompanyUser): Option[CobranzaParams] = {

    val params = DocumentListParam.load(user, S.LIST_COBRANZA)

    if(params.isEmpty) {
      Some(emptyCobranzaParams)
    }
    else {
      val prov = DocumentListParam.getParamValue(
        user, K_PROV_ID, params, emptyCobranzaParams.cliId,
        GC.PROVEEDOR, GC.PROV_ID, GC.PROV_NAME
      )
      val est = DocumentListParam.getParamValue(
        user, K_EST_ID, params, emptyCobranzaParams.estId,
        GC.ESTADO, GC.EST_ID, GC.EST_NAME
      )
      val ccos = DocumentListParam.getParamValue(
        user, K_CCOS_ID, params, emptyCobranzaParams.ccosId,
        GC.CENTRO_COSTO, GC.CCOS_ID, GC.CCOS_NAME
      )
      val suc = DocumentListParam.getParamValue(
        user, K_SUC_ID, params, emptyCobranzaParams.sucId,
        GC.SUCURSAL, GC.SUC_ID, GC.SUC_NAME
      )
      val doc = DocumentListParam.getParamValue(
        user, K_DOC_ID, params, emptyCobranzaParams.docId,
        GC.DOCUMENTO, GC.DOC_ID, GC.DOC_NAME
      )
      val cpg = DocumentListParam.getParamValue(
        user, K_CPG_ID, params, emptyCobranzaParams.cobId,
        GC.CONDICION_PAGO, GC.CPG_ID, GC.CPG_NAME
      )
      val emp = DocumentListParam.getParamValue(
        user, K_EMP_ID, params, emptyCobranzaParams.empId,
        GC.EMPRESA, GC.EMP_ID, GC.EMP_NAME
      )

      Some(
        CobranzaParams(
          DocumentListParam.getParamValue(K_FECHAINI, params, emptyCobranzaParams.from),
          DocumentListParam.getParamValue(K_FECHAFIN, params, emptyCobranzaParams.to),
          prov.id,
          prov.value,
          est.id,
          est.value,
          ccos.id,
          ccos.value,
          suc.id,
          suc.value,
          doc.id,
          doc.value,
          cpg.id,
          cpg.value,
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
           cobId: Option[String],
           docId: Option[String],
           empId: Option[String]): Recordset = {

    DB.withTransaction(user.database.database) { implicit connection =>

      val sql = "{call sp_lsdoc_cobranzas(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)}"
      val cs = connection.prepareCall(sql)

      cs.setInt(1, user.masterUserId)
      cs.setDate(2, new java.sql.Date(from.getTime()))
      cs.setDate(3, new java.sql.Date(to.getTime()))
      cs.setString(4, cliId.getOrElse("0"))
      cs.setString(5, estId.getOrElse("0"))
      cs.setString(6, ccosId.getOrElse("0"))
      cs.setString(7, sucId.getOrElse("0"))
      cs.setString(8, cobId.getOrElse("0"))
      cs.setString(9, docId.getOrElse("0"))
      cs.setString(10, empId.getOrElse("0"))
      cs.registerOutParameter(11, Types.OTHER)

      try {
        cs.execute()

        val rs = cs.getObject(11).asInstanceOf[java.sql.ResultSet]
        Recordset.load(rs)

      } catch {
        case NonFatal(e) => {
          Logger.error(s"can't get listing of facturas de compra for user ${user.toString}. Error ${e.toString}")
          throw e
        }
      } finally {
        cs.close
      }
    }
  }

  def listFacturas(user: CompanyUser, cliId: Int): (Recordset, Recordset) = {

    DB.withTransaction(user.database.database) { implicit connection =>

      val sql = "{call sp_doc_cobranza_get_facturas(?, ?, ?, ?)}"
      val cs = connection.prepareCall(sql)

      cs.setInt(1, user.cairoCompanyId)
      cs.setInt(2, cliId)
      cs.registerOutParameter(3, Types.OTHER)
      cs.registerOutParameter(4, Types.OTHER)

      try {
        cs.execute()

        val rsFacturas = cs.getObject(3).asInstanceOf[java.sql.ResultSet]
        val rsRates = cs.getObject(4).asInstanceOf[java.sql.ResultSet]
        (Recordset.load(rsFacturas), Recordset.load(rsRates))

      } catch {
        case NonFatal(e) => {
          Logger.error(s"can't get listing of facturas de venta for customer [$cliId] and user ${user.toString}. Error ${e.toString}")
          throw e
        }
      } finally {
        cs.close
      }
    }
  }

  def cuentas(user: CompanyUser, ids: String): Recordset = {

    DB.withTransaction(user.database.database) { implicit connection =>

      val sql = "{call sp_doc_cobranza_get_cuenta_deudor(?, ?)}"
      val cs = connection.prepareCall(sql)

      cs.setString(1, ids)
      cs.registerOutParameter(2, Types.OTHER)

      try {
        cs.execute()

        val rs = cs.getObject(2).asInstanceOf[java.sql.ResultSet]
        Recordset.load(rs)

      } catch {
        case NonFatal(e) => {
          Logger.error(s"can't get listing of cobranza cuentas deudores for list [$ids] and user ${user.toString}. Error ${e.toString}")
          throw e
        }
      } finally {
        cs.close
      }
    }
  }

  def facturas(user: CompanyUser, ids: String): Recordset = {

    DB.withTransaction(user.database.database) { implicit connection =>

      val sql = "{call sp_doc_cobranza_get_data_from_aplic(?, ?, ?)}"
      val cs = connection.prepareCall(sql)

      cs.setInt(1, 1) // 1 = factura venta/ nota debito venta
      cs.setString(2, ids)
      cs.registerOutParameter(3, Types.OTHER)

      try {
        cs.execute()

        val rs = cs.getObject(3).asInstanceOf[java.sql.ResultSet]
        Recordset.load(rs)

      } catch {
        case NonFatal(e) => {
          Logger.error(s"can't get listing of cobranza facturas for list [$ids] and user ${user.toString}. Error ${e.toString}")
          throw e
        }
      } finally {
        cs.close
      }
    }
  }
}