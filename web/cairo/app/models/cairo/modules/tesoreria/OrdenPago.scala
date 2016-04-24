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

case class OrdenPagoId(
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

object OrdenPagoId {

  def apply(
             docId: Int,
             numero: Int,
             nroDoc: String) = {

    new OrdenPagoId(
      docId,
      numero,
      nroDoc)
  }
}

case class OrdenPagoReferences(
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

object OrdenPagoReferences {

  def apply(
             doctId: Int,
             taMascara: String,
             taPropuesto: Boolean,
             firmado: Boolean,
             asId: Int,
             editable: Boolean,
             editMsg: String
           ) = {

    new OrdenPagoReferences(
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

case class OrdenPagoBase(
                          provId: Int,
                          provName: String,
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
            provId: Int,
            estId: Int,
            ccosId: Int,
            sucId: Int,
            lgjId: Int,
            descrip: String,
            grabarAsiento: Boolean
          ) = {
    this(
      provId,
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

object OrdenPagoBase {

  def apply(
             provId: Int,
             estId: Int,
             ccosId: Int,
             sucId: Int,
             lgjId: Int,
             descrip: String,
             grabarAsiento: Boolean) = {

    new OrdenPagoBase(
      provId,
      estId,
      ccosId,
      sucId,
      lgjId,
      descrip,
      grabarAsiento)
  }
}

case class OrdenPagoTotals(
                            neto: Double,
                            totalOtros: Double,
                            total: Double
                          )

case class OrdenPagoItemBase(
                              descrip: String,
                              cueId: Int,
                              cueName: String,
                              ccosId: Int,
                              ccosName: String,
                              orden: Int
                            )

object OrdenPagoItemBase {

  def apply(descrip: String,
            cueId: Int,
            ccosId: Int,
            orden: Int) = {

    new OrdenPagoItemBase(
      descrip,
      cueId,
      "",
      ccosId,
      "",
      orden
    )
  }
}

case class OrdenPagoItemTotals(
                                importe: Double,
                                importeOrigen: Double
                              )

case class OrdenPagoItemMoneda(
                                monId: Int,
                                monName: String
                              )

case class OrdenPagoItemCheque(
                                id: Int,
                                base: OrdenPagoItemBase,
                                moneda: OrdenPagoItemMoneda,
                                totals: OrdenPagoItemTotals,
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

object OrdenPagoItemCheque {

  def apply(id: Int,
            base: OrdenPagoItemBase,
            monId: Int,
            totals: OrdenPagoItemTotals,
            bcoId: Int,
            cheqId: Int,
            numeroDoc: String,
            propio: Boolean,
            fechaCobro: Date,
            fechaVto: Date,
            cleId: Int) = {

    new OrdenPagoItemCheque(
      id,
      base,
      OrdenPagoItemMoneda(monId, ""),
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

case class OrdenPagoItemTarjeta(
                                 id: Int,
                                 base: OrdenPagoItemBase,
                                 moneda: OrdenPagoItemMoneda,
                                 totals: OrdenPagoItemTotals,
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

object OrdenPagoItemTarjeta {

  def apply(id: Int,
            base: OrdenPagoItemBase,
            monId: Int,
            totals: OrdenPagoItemTotals,
            tjccId: Int,
            cuponNumeroDoc: String,
            tjcId: Int,
            tjccuId: Int,
            fechaVto: Date,
            numero: String,
            autorizacion: String,
            tarjetaTipo: Int,
            titular: String) = {

    new OrdenPagoItemTarjeta(
      id,
      base,
      OrdenPagoItemMoneda(monId, ""),
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

case class OrdenPagoItemEfectivo(
                                  id: Int,
                                  base: OrdenPagoItemBase,
                                  moneda: OrdenPagoItemMoneda,
                                  totals: OrdenPagoItemTotals
                                )

object OrdenPagoItemEfectivo {

  def apply(id: Int,
            base: OrdenPagoItemBase,
            monId: Int,
            totals: OrdenPagoItemTotals) = {

    new OrdenPagoItemEfectivo(
      id,
      base,
      OrdenPagoItemMoneda(monId, ""),
      totals
    )
  }
}

case class OrdenPagoItemRetencion(
                                   retId: Int,
                                   retName: String,
                                   numero: String,
                                   porcentaje: Double,
                                   fecha: Date,
                                   fvId: Int,
                                   numeroDoc: String
                                 )

object OrdenPagoItemRetencion {

  def apply(retId: Int,
            numero: String,
            porcentaje: Double,
            fecha: Date,
            fvId: Int) = {

    new OrdenPagoItemRetencion(
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

case class OrdenPagoItemOtro(
                              id: Int,
                              base: OrdenPagoItemBase,
                              totals: OrdenPagoItemTotals,
                              tipo: Int,
                              retencion: OrdenPagoItemRetencion
                            )

case class OrdenPagoItemCuentaCorriente(
                                         id: Int,
                                         base: OrdenPagoItemBase,
                                         moneda: OrdenPagoItemMoneda,
                                         totals: OrdenPagoItemTotals
                                       )

object OrdenPagoItemCuentaCorriente {

  def apply(id: Int,
            base: OrdenPagoItemBase,
            monId: Int,
            totals: OrdenPagoItemTotals) = {

    new OrdenPagoItemCuentaCorriente(
      id,
      base,
      OrdenPagoItemMoneda(monId, ""),
      totals
    )
  }
}

case class FacturaOrdenPago(
                             fvId: Int,
                             fvdId: Int,
                             importe: Double,
                             importeOrigen: Double,
                             cotizacion: Double
                           )

case class OrdenPagoItems(
                           cheques: List[OrdenPagoItemCheque],
                           tarjetas: List[OrdenPagoItemTarjeta],
                           efectivo: List[OrdenPagoItemEfectivo],
                           otros: List[OrdenPagoItemOtro],
                           cuentaCorriente: List[OrdenPagoItemCuentaCorriente],

                           /* only used in save */
                           chequeDeleted: String,
                           tarjetaDeleted: String,
                           efectivoDeleted: String,
                           otroDeleted: String,
                           cuentaCorrienteDeleted: String,

                           facturas: List[FacturaOrdenPago]
                         )

case class OrdenPago(
                      id: Int,

                      ids: OrdenPagoId,
                      base: OrdenPagoBase,
                      references: OrdenPagoReferences,
                      fecha: Date,
                      cotizacion: Double,
                      totals: OrdenPagoTotals,

                      items: OrdenPagoItems,

                      createdAt: Date,
                      updatedAt: Date,
                      updatedBy: Int
                    ) {

  def this(
            id: Int,

            ids: OrdenPagoId,
            base: OrdenPagoBase,
            references: OrdenPagoReferences,
            fecha: Date,
            cotizacion: Double,
            totals: OrdenPagoTotals,

            items: OrdenPagoItems) = {

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
            ids: OrdenPagoId,
            base: OrdenPagoBase,
            references: OrdenPagoReferences,
            fecha: Date,
            cotizacion: Double,
            totals: OrdenPagoTotals,

            items: OrdenPagoItems) = {

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

case class OrdenPagoParams(
                            from: String,
                            to: String,
                            provId: String,
                            provName: String,
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
            provId: String,
            estId: String,
            ccosId: String,
            sucId: String,
            docId: String,
            empId: String
          ) = {
    this(
      from,
      to,
      provId,
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

object OrdenPagoParams {
  def apply(
             from: String,
             to: String,
             provId: String,
             estId: String,
             ccosId: String,
             sucId: String,
             docId: String,
             empId: String
           ) = {

    new OrdenPagoParams(
      from,
      to,
      provId,
      estId,
      ccosId,
      sucId,
      docId,
      empId
    )
  }
}

object OrdenPago {

  lazy val GC = models.cairo.modules.general.C

  lazy val emptyOrdenPagoItems = OrdenPagoItems(List(), List(), List(), List(), List(), "", "", "", "", "", List())

  lazy val emptyOrdenPagoReferences = OrdenPagoReferences(DBHelper.NoId, "", false, false, DBHelper.NoId, false, "")

  lazy val emptyOrdenPago = OrdenPago(
    OrdenPagoId(DBHelper.NoId, 0, ""),
    OrdenPagoBase(DBHelper.NoId, DBHelper.NoId, DBHelper.NoId, DBHelper.NoId, DBHelper.NoId, "", false),
    emptyOrdenPagoReferences,
    U.NO_DATE,
    0,
    OrdenPagoTotals(0.0, 0.0, 0.0),
    emptyOrdenPagoItems
  )

  lazy val emptyOrdenPagoParams = OrdenPagoParams(
    DateFormatter.format(DateUtil.plusDays(DateUtil.currentTime, -60)),
    DateFormatter.format(DateUtil.currentTime), "0", "", "0", "", "0", "", "0", "", "0", "", "0", "", "0", "")

  def apply(
             id: Int,

             ids: OrdenPagoId,
             base: OrdenPagoBase,
             references: OrdenPagoReferences,
             fecha: Date,
             cotizacion: Double,
             totals: OrdenPagoTotals,

             items: OrdenPagoItems
           ) = {

    new OrdenPago(
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

             ids: OrdenPagoId,
             base: OrdenPagoBase,
             references: OrdenPagoReferences,
             fecha: Date,
             cotizacion: Double,
             totals: OrdenPagoTotals
           ) = {

    new OrdenPago(
      id,

      ids,
      base,
      references,
      fecha,
      cotizacion,
      totals,

      emptyOrdenPagoItems
    )
  }

  def apply(
             ids: OrdenPagoId,
             base: OrdenPagoBase,
             references: OrdenPagoReferences,
             fecha: Date,
             cotizacion: Double,
             totals: OrdenPagoTotals,

             items: OrdenPagoItems
           ) = {

    new OrdenPago(
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
             ids: OrdenPagoId,
             base: OrdenPagoBase,
             references: OrdenPagoReferences,
             fecha: Date,
             cotizacion: Double,
             totals: OrdenPagoTotals
           ) = {

    new OrdenPago(

      ids,
      base,
      references,
      fecha,
      cotizacion,
      totals,

      emptyOrdenPagoItems
    )
  }

  private val ordenPagoItemChequeParser: RowParser[OrdenPagoItemCheque] = {
    SqlParser.get[Int](C.OPGI_ID) ~
      SqlParser.get[String](C.OPGI_DESCRIP) ~
      SqlParser.get[Int](GC.CUE_ID) ~
      SqlParser.get[String](GC.CUE_NAME) ~
      SqlParser.get[Option[Int]](GC.CCOS_ID) ~
      SqlParser.get[Option[String]](GC.CCOS_NAME) ~
      SqlParser.get[Int](GC.MON_ID) ~
      SqlParser.get[String](GC.MON_NAME) ~
      SqlParser.get[BigDecimal](C.OPGI_IMPORTE) ~
      SqlParser.get[BigDecimal](C.OPGI_IMPORTE_ORIGEN) ~
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
      SqlParser.get[Int](C.OPGI_ORDEN) map {
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
        OrdenPagoItemCheque(
          id,
          OrdenPagoItemBase(
            descrip,
            cueId,
            cueName,
            ccosId.getOrElse(DBHelper.NoId),
            ccosName.getOrElse(""),
            orden
          ),
          OrdenPagoItemMoneda(monId, monName),
          OrdenPagoItemTotals(
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

  private val ordenPagoItemTarjetaParser: RowParser[OrdenPagoItemTarjeta] = {
    SqlParser.get[Int](C.OPGI_ID) ~
      SqlParser.get[String](C.OPGI_DESCRIP) ~
      SqlParser.get[Int](GC.CUE_ID) ~
      SqlParser.get[String](GC.CUE_NAME) ~
      SqlParser.get[Option[Int]](GC.CCOS_ID) ~
      SqlParser.get[Option[String]](GC.CCOS_NAME) ~
      SqlParser.get[Int](GC.MON_ID) ~
      SqlParser.get[String](GC.MON_NAME) ~
      SqlParser.get[BigDecimal](C.OPGI_IMPORTE) ~
      SqlParser.get[BigDecimal](C.OPGI_IMPORTE_ORIGEN) ~
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
      SqlParser.get[Int](C.OPGI_TARJETA_TIPO) ~
      SqlParser.get[String](C.TJCC_TITULAR) ~
      SqlParser.get[Int](C.OPGI_ORDEN) map {
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
        OrdenPagoItemTarjeta(
          id,
          OrdenPagoItemBase(
            descrip,
            cueId,
            cueName,
            ccosId.getOrElse(DBHelper.NoId),
            ccosName.getOrElse(""),
            orden
          ),
          OrdenPagoItemMoneda(monId, monName),
          OrdenPagoItemTotals(
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

  private val ordenPagoItemEfectivoParser: RowParser[OrdenPagoItemEfectivo] = {
    SqlParser.get[Int](C.OPGI_ID) ~
      SqlParser.get[String](C.OPGI_DESCRIP) ~
      SqlParser.get[Int](GC.CUE_ID) ~
      SqlParser.get[String](GC.CUE_NAME) ~
      SqlParser.get[Option[Int]](GC.CCOS_ID) ~
      SqlParser.get[Option[String]](GC.CCOS_NAME) ~
      SqlParser.get[Int](GC.MON_ID) ~
      SqlParser.get[String](GC.MON_NAME) ~
      SqlParser.get[BigDecimal](C.OPGI_IMPORTE) ~
      SqlParser.get[BigDecimal](C.OPGI_IMPORTE_ORIGEN) ~
      SqlParser.get[Int](C.OPGI_ORDEN) map {
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
        OrdenPagoItemEfectivo(
          id,
          OrdenPagoItemBase(
            descrip,
            cueId,
            cueName,
            ccosId.getOrElse(DBHelper.NoId),
            ccosName.getOrElse(""),
            orden
          ),
          OrdenPagoItemMoneda(monId, monName),
          OrdenPagoItemTotals(
            importe.doubleValue(),
            importeOrigen.doubleValue()
          )
        )
    }
  }

  private val ordenPagoItemOtroParser: RowParser[OrdenPagoItemOtro] = {
    SqlParser.get[Int](C.OPGI_ID) ~
      SqlParser.get[String](C.OPGI_DESCRIP) ~
      SqlParser.get[Int](GC.CUE_ID) ~
      SqlParser.get[String](GC.CUE_NAME) ~
      SqlParser.get[Option[Int]](GC.CCOS_ID) ~
      SqlParser.get[Option[String]](GC.CCOS_NAME) ~
      SqlParser.get[BigDecimal](C.OPGI_IMPORTE) ~
      SqlParser.get[BigDecimal](C.OPGI_IMPORTE_ORIGEN) ~
      SqlParser.get[Int](C.OPGI_OTRO_TIPO) ~
      SqlParser.get[Int](GC.RET_ID) ~
      SqlParser.get[String](GC.RET_NAME) ~
      SqlParser.get[String](C.OPGI_NRO_RETENCION) ~
      SqlParser.get[BigDecimal](C.OPGI_PORC_RETENCION) ~
      SqlParser.get[Date](C.OPGI_FECHA_RETENCION) ~
      SqlParser.get[Option[Int]](C.FC_ID_RET) ~
      SqlParser.get[Option[String]](models.cairo.modules.compras.C.FC_NRODOC) ~
      SqlParser.get[Int](C.OPGI_ORDEN) map {
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
        OrdenPagoItemOtro(
          id,
          OrdenPagoItemBase(
            descrip,
            cueId,
            cueName,
            ccosId.getOrElse(DBHelper.NoId),
            ccosName.getOrElse(""),
            orden
          ),
          OrdenPagoItemTotals(
            importe.doubleValue(),
            importeOrigen.doubleValue()
          ),
          tipo,
          OrdenPagoItemRetencion(
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

  private val ordenPagoItemCuentaCorrienteParser: RowParser[OrdenPagoItemCuentaCorriente] = {
    SqlParser.get[Int](C.OPGI_ID) ~
      SqlParser.get[String](C.OPGI_DESCRIP) ~
      SqlParser.get[Int](GC.CUE_ID) ~
      SqlParser.get[String](GC.CUE_NAME) ~
      SqlParser.get[Option[Int]](GC.CCOS_ID) ~
      SqlParser.get[Option[String]](GC.CCOS_NAME) ~
      SqlParser.get[Int](GC.MON_ID) ~
      SqlParser.get[String](GC.MON_NAME) ~
      SqlParser.get[BigDecimal](C.OPGI_IMPORTE) ~
      SqlParser.get[BigDecimal](C.OPGI_IMPORTE_ORIGEN) ~
      SqlParser.get[Int](C.OPGI_ORDEN) map {
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
        OrdenPagoItemCuentaCorriente(
          id,
          OrdenPagoItemBase(
            descrip,
            cueId,
            cueName,
            ccosId.getOrElse(DBHelper.NoId),
            ccosName.getOrElse(""),
            orden
          ),
          OrdenPagoItemMoneda(monId, monName),
          OrdenPagoItemTotals(
            importe.doubleValue(),
            importeOrigen.doubleValue()
          )
        )
    }
  }

  private val ordenPagoParser: RowParser[OrdenPago] = {
    SqlParser.get[Int](C.OPG_ID) ~
      SqlParser.get[Int](GC.DOC_ID) ~
      SqlParser.get[String](GC.DOC_NAME) ~
      SqlParser.get[Int](C.OPG_NUMERO) ~
      SqlParser.get[String](C.OPG_NRODOC) ~
      SqlParser.get[Int](GC.CLI_ID) ~
      SqlParser.get[String](GC.CLI_NAME) ~
      SqlParser.get[Int](GC.EST_ID) ~
      SqlParser.get[String](GC.EST_NAME) ~
      SqlParser.get[Option[Int]](GC.CCOS_ID) ~
      SqlParser.get[Option[String]](GC.CCOS_NAME) ~
      SqlParser.get[Int](GC.SUC_ID) ~
      SqlParser.get[String](GC.SUC_NAME) ~
      SqlParser.get[Option[Int]](GC.LGJ_ID) ~
      SqlParser.get[Option[String]](GC.LGJ_CODE) ~
      SqlParser.get[String](C.OPG_DESCRIP) ~
      SqlParser.get[Int](C.OPG_GRABAR_ASIENTO) ~
      SqlParser.get[Int](GC.DOCT_ID) ~
      SqlParser.get[String](GC.DOCT_NAME) ~
      SqlParser.get[String](GC.TA_MASCARA) ~
      SqlParser.get[Int](GC.TA_PROPUESTO) ~
      SqlParser.get[Int](C.OPG_FIRMADO) ~
      SqlParser.get[Option[Int]](C.AS_ID) ~
      SqlParser.get[Int](GC.EDITABLE) ~
      SqlParser.get[String](GC.EDIT_MSG) ~
      SqlParser.get[Date](C.OPG_FECHA) ~
      SqlParser.get[BigDecimal](C.OPG_COTIZACION) ~
      SqlParser.get[BigDecimal](C.OPG_NETO) ~
      SqlParser.get[BigDecimal](C.OPG_OTROS) ~
      SqlParser.get[BigDecimal](C.OPG_TOTAL) ~
      SqlParser.get[Date](DBHelper.CREATED_AT) ~
      SqlParser.get[Date](DBHelper.UPDATED_AT) ~
      SqlParser.get[Int](DBHelper.UPDATED_BY) map {
      case
        id ~
          docId ~
          docName ~
          numero ~
          nroDoc ~
          provId ~
          provName ~
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
          neto ~
          totalOtros ~
          total ~
          createdAt ~
          updatedAt ~
          updatedBy =>
        OrdenPago(
          id,
          OrdenPagoId(
            docId,
            docName,
            numero,
            nroDoc
          ),
          OrdenPagoBase(
            provId,
            provName,
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
          OrdenPagoReferences(
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
          OrdenPagoTotals(
            neto.doubleValue(),
            totalOtros.doubleValue(),
            total.doubleValue()
          ),
          emptyOrdenPagoItems,
          createdAt,
          updatedAt,
          updatedBy)
    }
  }

  def createOrdenPago(user: CompanyUser, ordenPago: OrdenPago): OrdenPago = {
    save(user, ordenPago)
  }

  def create(user: CompanyUser, ordenPago: OrdenPago): OrdenPago = {
    save(user, ordenPago)
  }

  def update(user: CompanyUser, ordenPago: OrdenPago): OrdenPago = {
    save(user, ordenPago)
  }

  private def save(user: CompanyUser, ordenPago: OrdenPago): OrdenPago = {
    def getFields = {
      List(
        Field(C.OPG_ID, ordenPago.id, FieldType.number),
        Field(GC.DOC_ID, ordenPago.ids.docId, FieldType.id),
        Field(C.OPG_NRODOC, ordenPago.ids.nroDoc, FieldType.text),
        Field(C.OPG_NUMERO, ordenPago.ids.numero, FieldType.number),

        Field(GC.CLI_ID, ordenPago.base.provId, FieldType.id),
        Field(GC.EST_ID, ordenPago.base.estId, FieldType.id),
        Field(GC.CCOS_ID, ordenPago.base.ccosId, FieldType.id),
        Field(GC.SUC_ID, ordenPago.base.sucId, FieldType.id),
        Field(GC.LGJ_ID, ordenPago.base.lgjId, FieldType.id),
        Field(C.OPG_DESCRIP, ordenPago.base.descrip, FieldType.text),
        Field(C.OPG_GRABAR_ASIENTO, Register.boolToInt(ordenPago.base.grabarAsiento), FieldType.boolean),

        Field(C.OPG_FECHA, ordenPago.fecha, FieldType.date),

        Field(C.OPG_COTIZACION, ordenPago.cotizacion, FieldType.currency),

        Field(C.OPG_NETO, ordenPago.totals.neto, FieldType.currency),
        Field(C.OPG_OTROS, ordenPago.totals.totalOtros, FieldType.currency),
        Field(C.OPG_TOTAL, ordenPago.totals.total, FieldType.currency)
      )
    }

    def getChequeFields(item: OrdenPagoItemCheque, opgTMPId: Int) = {
      List(
        Field(C.OPG_TMP_ID, opgTMPId, FieldType.id),
        Field(C.OPGI_ID, item.id, FieldType.number),
        Field(C.OPGI_TIPO, C.ORDEN_PAGO_ITEM_TIPO_CHEQUES, FieldType.number),
        Field(C.OPGI_DESCRIP, item.base.descrip, FieldType.text),
        Field(GC.CUE_ID, item.base.cueId, FieldType.id),
        Field(GC.CCOS_ID, item.base.ccosId, FieldType.id),
        Field(GC.BCO_ID, item.bcoId, FieldType.id),
        Field(GC.CLE_ID, item.cleId, FieldType.id),
        Field(GC.MON_ID, item.moneda.monId, FieldType.id),
        Field(C.OPGI_ORDEN, item.base.orden, FieldType.integer),
        Field(C.OPGI_IMPORTE, item.totals.importe, FieldType.currency),
        Field(C.OPGI_IMPORTE_ORIGEN, item.totals.importeOrigen, FieldType.currency)
      )
    }

    def getTarjetaFields(item: OrdenPagoItemTarjeta, opgTMPId: Int) = {
      List(
        Field(C.OPG_TMP_ID, opgTMPId, FieldType.id),
        Field(C.OPGI_ID, item.id, FieldType.number),
        Field(C.OPGI_TIPO, C.ORDEN_PAGO_ITEM_TIPO_TARJETAS, FieldType.number),
        Field(C.OPGI_DESCRIP, item.base.descrip, FieldType.text),
        Field(GC.CUE_ID, item.base.cueId, FieldType.id),
        Field(GC.CCOS_ID, item.base.ccosId, FieldType.id),
        Field(C.OPGI_ORDEN, item.base.orden, FieldType.integer),
        Field(C.OPGI_IMPORTE, item.totals.importe, FieldType.currency),
        Field(C.OPGI_IMPORTE_ORIGEN, item.totals.importeOrigen, FieldType.currency)
      )
    }

    def getEfectivoFields(item: OrdenPagoItemEfectivo, opgTMPId: Int) = {
      List(
        Field(C.OPG_TMP_ID, opgTMPId, FieldType.id),
        Field(C.OPGI_ID, item.id, FieldType.number),
        Field(C.OPGI_TIPO, C.ORDEN_PAGO_ITEM_TIPO_EFECTIVO, FieldType.number),
        Field(C.OPGI_DESCRIP, item.base.descrip, FieldType.text),
        Field(GC.CUE_ID, item.base.cueId, FieldType.id),
        Field(GC.CCOS_ID, item.base.ccosId, FieldType.id),
        Field(C.OPGI_ORDEN, item.base.orden, FieldType.integer),
        Field(C.OPGI_IMPORTE, item.totals.importe, FieldType.currency),
        Field(C.OPGI_IMPORTE_ORIGEN, item.totals.importeOrigen, FieldType.currency)
      )
    }

    def getOtroFields(item: OrdenPagoItemOtro, opgTMPId: Int) = {
      List(
        Field(C.OPG_TMP_ID, opgTMPId, FieldType.id),
        Field(C.OPGI_ID, item.id, FieldType.number),
        Field(C.OPGI_TIPO, C.ORDEN_PAGO_ITEM_TIPO_OTROS, FieldType.number),
        Field(C.OPGI_DESCRIP, item.base.descrip, FieldType.text),
        Field(GC.CUE_ID, item.base.cueId, FieldType.id),
        Field(GC.CCOS_ID, item.base.ccosId, FieldType.id),
        Field(C.OPGI_ORDEN, item.base.orden, FieldType.integer),
        Field(C.OPGI_IMPORTE, item.totals.importe, FieldType.currency),
        Field(C.OPGI_IMPORTE_ORIGEN, item.totals.importeOrigen, FieldType.currency)
      )
    }

    def getCtaCteFields(item: OrdenPagoItemCuentaCorriente, opgTMPId: Int) = {
      List(
        Field(C.OPG_TMP_ID, opgTMPId, FieldType.id),
        Field(C.OPGI_ID, item.id, FieldType.number),
        Field(C.OPGI_TIPO, C.ORDEN_PAGO_ITEM_TIPO_CTA_CTE, FieldType.number),
        Field(C.OPGI_DESCRIP, item.base.descrip, FieldType.text),
        Field(GC.CUE_ID, item.base.cueId, FieldType.id),
        Field(GC.CCOS_ID, item.base.ccosId, FieldType.id),
        Field(C.OPGI_ORDEN, item.base.orden, FieldType.integer),
        Field(C.OPGI_IMPORTE, item.totals.importe, FieldType.currency),
        Field(C.OPGI_IMPORTE_ORIGEN, item.totals.importeOrigen, FieldType.currency)
      )
    }

    def getDeletedItemFields(opgiId: Int, opgTMPId: Int) = {
      List(
        Field(C.OPG_TMP_ID, opgTMPId, FieldType.id),
        Field(C.OPGI_ID, opgiId, FieldType.number),
        Field(C.OPG_ID, ordenPago.id, FieldType.id)
      )
    }

    def getFacturaFields(item: FacturaOrdenPago, opgTMPId: Int) = {
      List(
        Field(C.OPG_TMP_ID, opgTMPId, FieldType.id),
        Field(C.OPG_ID, 0, FieldType.number),
        Field(C.FC_OPG_ID, 0, FieldType.number),
        Field(C.FC_ID, item.fvId, FieldType.id),
        Field(C.FCD_ID, item.fvdId, FieldType.id),
        Field(C.FC_OPG_IMPORTE, item.importe, FieldType.currency),
        Field(C.FC_OPG_IMPORTE_ORIGEN, item.importeOrigen, FieldType.currency),
        Field(C.FC_OPG_COTIZACION, item.cotizacion, FieldType.currency)
      )
    }

    def throwError = {
      throwException(s"Error when saving ${C.ORDEN_PAGO}")
    }

    def throwException(message: String) = {
      throw new RuntimeException(message)
    }

    case class OrdenPagoChequeInfo(opgTMPId: Int, item: OrdenPagoItemCheque)

    def saveCheque(itemInfo: OrdenPagoChequeInfo) = {
      DBHelper.save(
        user,
        Register(
          C.ORDEN_PAGO_ITEM_TMP,
          C.OPGI_TMP_ID,
          DBHelper.NoId,
          false,
          false,
          false,
          getChequeFields(itemInfo.item, itemInfo.opgTMPId)),
        true
      ) match {
        case SaveResult(false, id) => throwError
        case _ =>
      }
    }

    case class OrdenPagoTarjetaInfo(opgTMPId: Int, item: OrdenPagoItemTarjeta)

    def saveTarjeta(itemInfo: OrdenPagoTarjetaInfo) = {
      DBHelper.save(
        user,
        Register(
          C.ORDEN_PAGO_ITEM_TMP,
          C.OPGI_TMP_ID,
          DBHelper.NoId,
          false,
          false,
          false,
          getTarjetaFields(itemInfo.item, itemInfo.opgTMPId)),
        true
      ) match {
        case SaveResult(false, id) => throwError
        case _ =>
      }
    }

    case class OrdenPagoEfectivoInfo(opgTMPId: Int, item: OrdenPagoItemEfectivo)

    def saveEfectivo(itemInfo: OrdenPagoEfectivoInfo) = {
      DBHelper.save(
        user,
        Register(
          C.ORDEN_PAGO_ITEM_TMP,
          C.OPGI_TMP_ID,
          DBHelper.NoId,
          false,
          false,
          false,
          getEfectivoFields(itemInfo.item, itemInfo.opgTMPId)),
        true
      ) match {
        case SaveResult(false, id) => throwError
        case _ =>
      }
    }

    case class OrdenPagoOtroInfo(opgTMPId: Int, item: OrdenPagoItemOtro)

    def saveOtro(itemInfo: OrdenPagoOtroInfo) = {
      DBHelper.save(
        user,
        Register(
          C.ORDEN_PAGO_ITEM_TMP,
          C.OPGI_TMP_ID,
          DBHelper.NoId,
          false,
          false,
          false,
          getOtroFields(itemInfo.item, itemInfo.opgTMPId)),
        true
      ) match {
        case SaveResult(false, id) => throwError
        case _ =>
      }
    }

    case class OrdenPagoCuentaCorrienteInfo(opgTMPId: Int, item: OrdenPagoItemCuentaCorriente)

    def saveCtaCte(itemInfo: OrdenPagoCuentaCorrienteInfo) = {
      DBHelper.save(
        user,
        Register(
          C.ORDEN_PAGO_ITEM_TMP,
          C.OPGI_TMP_ID,
          DBHelper.NoId,
          false,
          false,
          false,
          getCtaCteFields(itemInfo.item, itemInfo.opgTMPId)),
        true
      ) match {
        case SaveResult(false, id) => throwError
        case _ =>
      }
    }

    def saveDeletedItem(opgTMPId: Int)(opgiId: String) = {
      val id = G.getIntOrZero(opgiId)
      if(id != 0) {
        DBHelper.save(
          user,
          Register(
            C.ORDEN_PAGO_ITEM_BORRADO_TMP,
            C.OPGIB_TMP_ID,
            DBHelper.NoId,
            false,
            false,
            false,
            getDeletedItemFields(id, opgTMPId)),
          true
        ) match {
          case SaveResult(false, id) => throwError
          case _ =>
        }
      }
    }

    def saveCheques(opgTMPId: Int) = {
      ordenPago.items.cheques.map(item => saveCheque(OrdenPagoChequeInfo(opgTMPId, item)))
      ordenPago.items.chequeDeleted.split(",").map(saveDeletedItem(opgTMPId))
    }

    def saveTarjetas(opgTMPId: Int) = {
      ordenPago.items.tarjetas.map(item => saveTarjeta(OrdenPagoTarjetaInfo(opgTMPId, item)))
      ordenPago.items.tarjetaDeleted.split(",").map(saveDeletedItem(opgTMPId))
    }

    def saveEfectivos(opgTMPId: Int) = {
      ordenPago.items.efectivo.map(item => saveEfectivo(OrdenPagoEfectivoInfo(opgTMPId, item)))
      ordenPago.items.efectivoDeleted.split(",").map(saveDeletedItem(opgTMPId))
    }

    def saveOtros(opgTMPId: Int) = {
      ordenPago.items.otros.map(item => saveOtro(OrdenPagoOtroInfo(opgTMPId, item)))
      ordenPago.items.otroDeleted.split(",").map(saveDeletedItem(opgTMPId))
    }

    def saveCtaCtes(opgTMPId: Int) = {
      ordenPago.items.cuentaCorriente.map(item => saveCtaCte(OrdenPagoCuentaCorrienteInfo(opgTMPId, item)))
      ordenPago.items.cuentaCorrienteDeleted.split(",").map(saveDeletedItem(opgTMPId))
    }

    case class FacturaOrdenPagoInfo(opgTMPId: Int, item: FacturaOrdenPago)

    def saveFactura(itemInfo: FacturaOrdenPagoInfo) = {
      DBHelper.save(
        user,
        Register(
          C.FACTURA_COMPRA_ORDEN_PAGO_TMP,
          C.FC_OPG_TMP_ID,
          DBHelper.NoId,
          false,
          false,
          false,
          getFacturaFields(itemInfo.item, itemInfo.opgTMPId)),
        true
      ) match {
        case SaveResult(true, id) => true
        case SaveResult(false, id) => throwError
      }
    }

    def saveFacturas(opgTMPId: Int) = {
      ordenPago.items.facturas.map(factura => saveFactura(FacturaOrdenPagoInfo(opgTMPId, factura)))
    }

    case class RowResult(rowType: String, id: Int, message: String)

    def executeSave(opgTMPId: Int): List[RowResult] = {

      DB.withTransaction(user.database.database) { implicit connection =>
        val sql = "select * from sp_doc_ordenPago_save(?, ?)"
        val cs = connection.prepareStatement(sql)

        cs.setInt(1, user.masterUserId)
        cs.setInt(2, opgTMPId)

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
          * ex: CREATE OR REPLACE FUNCTION sp_doc_ordenPago_save( params )
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
            Logger.error(s"can't save ${C.ORDEN_PAGO} with id ${ordenPago.id} for user ${user.toString}. Error ${e.toString}")
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
        C.ORDEN_PAGO_TMP,
        C.OPG_TMP_ID,
        DBHelper.NoId,
        false,
        true,
        true,
        getFields),
      true
    ) match {
      case SaveResult(true, opgTMPId) => {
        saveCheques(opgTMPId)
        saveTarjetas(opgTMPId)
        saveEfectivos(opgTMPId)
        saveOtros(opgTMPId)
        saveCtaCtes(opgTMPId)
        saveFacturas(opgTMPId)
        val messagesAndId = executeSave(opgTMPId)
        val id = getIdFromMessages(messagesAndId)
        load(user, id).getOrElse(throwError)
      }
      case SaveResult(false, id) => throwError
    }

  }

  def load(user: CompanyUser, id: Int): Option[OrdenPago] = {

    DB.withTransaction(user.database.database) { implicit connection =>

      val sql = "{call sp_doc_ordenPago_get(?, ?, ?, ?)}"
      val cs = connection.prepareCall(sql)

      cs.setInt(1, user.cairoCompanyId)
      cs.setInt(2, id)
      cs.setInt(3, user.masterUserId)
      cs.registerOutParameter(4, Types.OTHER)

      try {
        cs.execute()

        val rs = cs.getObject(4).asInstanceOf[java.sql.ResultSet]
        Sql.as(ordenPagoParser.singleOpt, rs)

      } catch {
        case NonFatal(e) => {
          Logger.error(s"can't get ${C.ORDEN_PAGO} with id $id for user ${user.toString}. Error ${e.toString}")
          throw e
        }
      } finally {
        cs.close
      }
    }
  }

  private def loadOrdenPagoItems(user: CompanyUser, id: Int) = {
    val cheques = loadItems[OrdenPagoItemCheque](user, id, C.ORDEN_PAGO_ITEM_TIPO_CHEQUES, ordenPagoItemChequeParser)
    val tarjetas = loadItems(user, id, C.ORDEN_PAGO_ITEM_TIPO_TARJETAS, ordenPagoItemTarjetaParser)
    val efectivo = loadItems(user, id, C.ORDEN_PAGO_ITEM_TIPO_EFECTIVO, ordenPagoItemEfectivoParser)
    val otros = loadItems(user, id, C.ORDEN_PAGO_ITEM_TIPO_OTROS, ordenPagoItemOtroParser)
    val cuentaCorriente = loadItems(user, id, C.ORDEN_PAGO_ITEM_TIPO_CTA_CTE, ordenPagoItemCuentaCorrienteParser)
    OrdenPagoItems(cheques, tarjetas, efectivo, otros, cuentaCorriente, "", "", "", "", "", List())
  }

  private def loadItems[T](user: CompanyUser, id: Int, tipo: Int, parser: RowParser[T]) = {

    DB.withTransaction(user.database.database) { implicit connection =>

      val sql = "{call sp_doc_ordenPago_get_items(?, ?, ?)}"
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
          Logger.error(s"can't get ${C.ORDEN_PAGO_ITEM} with id $id for user ${user.toString}. Error ${e.toString}")
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
        SQL("sp_doc_ordenPago_delete {id}, {empId}, {usId}")
          .on('id -> id, 'empId -> user.cairoCompanyId, 'usId -> user.masterUserId)
          .executeUpdate
      } catch {
        case NonFatal(e) => {
          Logger.error(s"can't delete a ${C.ORDEN_PAGO}. ${C.OPG_ID} id: $id. Error ${e.toString}")
          throw e
        }
      }
    }
  }

  def get(user: CompanyUser, id: Int): OrdenPago = {
    load(user, id) match {
      case Some(p) => {
        OrdenPago(
          p.id,

          p.ids,
          p.base,
          p.references,
          p.fecha,
          p.cotizacion,
          p.totals,

          loadOrdenPagoItems(user, id)
        )
      }
      case None => emptyOrdenPago
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

  def saveParams(user: CompanyUser, ordenPagoParams: OrdenPagoParams): OrdenPagoParams = {
    val baseFields = List(
      Field(GC.EMP_ID, user.cairoCompanyId, FieldType.id),
      Field(GC.US_ID, user.masterUserId, FieldType.id),
      Field(GC.PRE_ID, S.LIST_ORDEN_PAGO, FieldType.id)
    )

    def throwException = {
      throw new RuntimeException(s"Error when saving ${C.ORDEN_PAGO}")
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
        Field(GC.LDP_VALOR, ordenPagoParams.from, FieldType.text)
      ),
      List(
        Field(GC.LDP_ID, K_FECHAFIN, FieldType.integer),
        Field(GC.LDP_ORDEN, 10, FieldType.integer),
        Field(GC.LDP_VALOR, ordenPagoParams.to, FieldType.text)
      ),
      List(
        Field(GC.LDP_ID, K_PROV_ID, FieldType.integer),
        Field(GC.LDP_ORDEN, 20, FieldType.integer),
        Field(GC.LDP_VALOR, ordenPagoParams.provId, FieldType.text)
      ),
      List(
        Field(GC.LDP_ID, K_EST_ID, FieldType.integer),
        Field(GC.LDP_ORDEN, 30, FieldType.integer),
        Field(GC.LDP_VALOR, ordenPagoParams.estId, FieldType.text)
      ),
      List(
        Field(GC.LDP_ID, K_CCOS_ID, FieldType.integer),
        Field(GC.LDP_ORDEN, 40, FieldType.integer),
        Field(GC.LDP_VALOR, ordenPagoParams.ccosId, FieldType.text)
      ),
      List(
        Field(GC.LDP_ID, K_SUC_ID, FieldType.integer),
        Field(GC.LDP_ORDEN, 50, FieldType.integer),
        Field(GC.LDP_VALOR, ordenPagoParams.sucId, FieldType.text)
      ),
      List(
        Field(GC.LDP_ID, K_DOC_ID, FieldType.integer),
        Field(GC.LDP_ORDEN, 60, FieldType.integer),
        Field(GC.LDP_VALOR, ordenPagoParams.docId, FieldType.text)
      ),
      List(
        Field(GC.LDP_ID, K_EMP_ID, FieldType.integer),
        Field(GC.LDP_ORDEN, 80, FieldType.integer),
        Field(GC.LDP_VALOR, ordenPagoParams.empId, FieldType.text)
      )
    )

    DB.withConnection(user.database.database) { implicit connection =>
      try {
        SQL(s"""DELETE FROM ListaDocumentoParametro
                | WHERE pre_id = {preId}
                | AND (emp_id is null or emp_id = {empId})
                | AND us_id = {usId}""".stripMargin)
          .on(
            'preId -> S.LIST_ORDEN_PAGO,
            'empId -> user.cairoCompanyId,
            'usId -> user.masterUserId
          )
          .executeUpdate
      } catch {
        case NonFatal(e) => {
          Logger.error(s"can't save parameters for OrdenPago")
          throw e
        }
      }
    }

    paramList.map(param => saveParam(baseFields ::: param))

    loadParams(user).getOrElse(throwException)
  }

  def loadParams(user: CompanyUser): Option[OrdenPagoParams] = {

    val params = DocumentListParam.load(user, S.LIST_ORDEN_PAGO)

    if(params.isEmpty) {
      Some(emptyOrdenPagoParams)
    }
    else {
      val prov = DocumentListParam.getParamValue(
        user, K_PROV_ID, params, emptyOrdenPagoParams.provId,
        GC.PROVEEDOR, GC.PROV_ID, GC.PROV_NAME
      )
      val est = DocumentListParam.getParamValue(
        user, K_EST_ID, params, emptyOrdenPagoParams.estId,
        GC.ESTADO, GC.EST_ID, GC.EST_NAME
      )
      val ccos = DocumentListParam.getParamValue(
        user, K_CCOS_ID, params, emptyOrdenPagoParams.ccosId,
        GC.CENTRO_COSTO, GC.CCOS_ID, GC.CCOS_NAME
      )
      val suc = DocumentListParam.getParamValue(
        user, K_SUC_ID, params, emptyOrdenPagoParams.sucId,
        GC.SUCURSAL, GC.SUC_ID, GC.SUC_NAME
      )
      val doc = DocumentListParam.getParamValue(
        user, K_DOC_ID, params, emptyOrdenPagoParams.docId,
        GC.DOCUMENTO, GC.DOC_ID, GC.DOC_NAME
      )
      val emp = DocumentListParam.getParamValue(
        user, K_EMP_ID, params, emptyOrdenPagoParams.empId,
        GC.EMPRESA, GC.EMP_ID, GC.EMP_NAME
      )

      Some(
        OrdenPagoParams(
          DocumentListParam.getParamValue(K_FECHAINI, params, emptyOrdenPagoParams.from),
          DocumentListParam.getParamValue(K_FECHAFIN, params, emptyOrdenPagoParams.to),
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
          emp.id,
          emp.value
        )
      )
    }
  }

  def list(user: CompanyUser,
           from: Date,
           to: Date,
           provId: Option[String],
           estId: Option[String],
           ccosId: Option[String],
           sucId: Option[String],
           docId: Option[String],
           empId: Option[String]): Recordset = {

    DB.withTransaction(user.database.database) { implicit connection =>

      val sql = "{call sp_lsdoc_ordenPagos(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)}"
      val cs = connection.prepareCall(sql)

      cs.setInt(1, user.masterUserId)
      cs.setDate(2, new java.sql.Date(from.getTime()))
      cs.setDate(3, new java.sql.Date(to.getTime()))
      cs.setString(4, provId.getOrElse("0"))
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
          Logger.error(s"can't get listing of facturas de compra for user ${user.toString}. Error ${e.toString}")
          throw e
        }
      } finally {
        cs.close
      }
    }
  }

  def listFacturas(user: CompanyUser, provId: Int): (Recordset, Recordset) = {

    DB.withTransaction(user.database.database) { implicit connection =>

      val sql = "{call sp_doc_ordenPago_get_facturas(?, ?, ?, ?)}"
      val cs = connection.prepareCall(sql)

      cs.setInt(1, user.cairoCompanyId)
      cs.setInt(2, provId)
      cs.registerOutParameter(3, Types.OTHER)
      cs.registerOutParameter(4, Types.OTHER)

      try {
        cs.execute()

        val rsFacturas = cs.getObject(3).asInstanceOf[java.sql.ResultSet]
        val rsRates = cs.getObject(4).asInstanceOf[java.sql.ResultSet]
        (Recordset.load(rsFacturas), Recordset.load(rsRates))

      } catch {
        case NonFatal(e) => {
          Logger.error(s"can't get listing of facturas de compra for customer [$provId] and user ${user.toString}. Error ${e.toString}")
          throw e
        }
      } finally {
        cs.close
      }
    }
  }

  def cuentas(user: CompanyUser, ids: String): Recordset = {

    DB.withTransaction(user.database.database) { implicit connection =>

      val sql = "{call sp_doc_ordenPago_get_cuenta_deudor(?, ?)}"
      val cs = connection.prepareCall(sql)

      cs.setString(1, ids)
      cs.registerOutParameter(2, Types.OTHER)

      try {
        cs.execute()

        val rs = cs.getObject(2).asInstanceOf[java.sql.ResultSet]
        Recordset.load(rs)

      } catch {
        case NonFatal(e) => {
          Logger.error(s"can't get listing of ordenPago cuentas deudores for list [$ids] and user ${user.toString}. Error ${e.toString}")
          throw e
        }
      } finally {
        cs.close
      }
    }
  }

  def facturas(user: CompanyUser, ids: String): Recordset = {

    DB.withTransaction(user.database.database) { implicit connection =>

      val sql = "{call sp_doc_ordenPago_get_data_from_aplic(?, ?, ?)}"
      val cs = connection.prepareCall(sql)

      cs.setInt(1, 1) // 1 = factura compra/ nota debito compra
      cs.setString(2, ids)
      cs.registerOutParameter(3, Types.OTHER)

      try {
        cs.execute()

        val rs = cs.getObject(3).asInstanceOf[java.sql.ResultSet]
        Recordset.load(rs)

      } catch {
        case NonFatal(e) => {
          Logger.error(s"can't get listing of ordenPago facturas for list [$ids] and user ${user.toString}. Error ${e.toString}")
          throw e
        }
      } finally {
        cs.close
      }
    }
  }
}