package models.cairo.modules.ventas

import java.sql.{Connection, CallableStatement, ResultSet, Types, SQLException}
import anorm.SqlParser._
import anorm._
import models.cairo.modules.documentos.DocumentEditStatus
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
import models.cairo.modules.general.{CondicionPago, U, DocumentListParam}
import formatters.json.DateFormatter

case class FacturaVentaId(
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

object FacturaVentaId {

  def apply(
             docId: Int,
             numero: Int,
             nroDoc: String) = {

    new FacturaVentaId(
      docId,
      numero,
      nroDoc)
  }
}

case class FacturaVentaReferences(
                              doctId: Int,
                              doctName: String,
                              monId: Int,
                              monName: String,
                              taMascara: String,
                              taPropuesto: Boolean,
                              firmado: Boolean,
                              docMueveStock: Boolean,
                              docTipoFactura: Int,
                              stId: Int,
                              asId: Int,
                              hasIvaRi: Boolean,
                              hasIvaRni: Boolean,
                              editable: Boolean,
                              editMsg: String
                            ) {
  def this(
            doctId: Int,
            monId: Int,
            taMascara: String,
            taPropuesto: Boolean,
            firmado: Boolean,
            docMueveStock: Boolean,
            docTipoFactura: Int,
            stId: Int,
            asId: Int,
            hasIvaRi: Boolean,
            hasIvaRni: Boolean,
            editable: Boolean,
            editMsg: String
            ) = {
    this(
      doctId,
      "",
      monId,
      "",
      taMascara,
      taPropuesto,
      firmado,
      docMueveStock,
      docTipoFactura,
      stId,
      asId,
      hasIvaRi,
      hasIvaRni,
      editable,
      editMsg
    )
  }
}

object FacturaVentaReferences {

  def apply(
             doctId: Int,
             monId: Int,
             taMascara: String,
             taPropuesto: Boolean,
             firmado: Boolean,
             docMueveStock: Boolean,
             docTipoFactura: Int,
             stId: Int,
             asId: Int,
             hasIvaRi: Boolean,
             hasIvaRni: Boolean,
             editable: Boolean,
             editMsg: String
             ) = {

    new FacturaVentaReferences(
      doctId,
      monId,
      taMascara,
      taPropuesto,
      firmado,
      docMueveStock,
      docTipoFactura,
      stId,
      asId,
      hasIvaRi,
      hasIvaRni,
      editable,
      editMsg
    )
  }
}

case class FacturaVentaBase(
                              cliId: Int,
                              cliName: String,
                              estId: Int,
                              estName: String,
                              ccosId: Int,
                              ccosName: String,
                              sucId: Int,
                              sucName: String,
                              cpgId: Int,
                              cpgName: String,
                              lgjId: Int,
                              lgjCode: String,
                              venId: Int,
                              venName: String,
                              clisId: Int,
                              clisName: String,
                              ordenCompra: String,
                              cai: String,
                              descrip: String,
                              grabarAsiento: Boolean
                            ) {
  def this(
            cliId: Int,
            estId: Int,
            ccosId: Int,
            sucId: Int,
            cpgId: Int,
            lgjId: Int,
            venId: Int,
            clisId: Int,
            ordenCompra: String,
            cai: String,
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
      cpgId,
      "",
      lgjId,
      "",
      venId,
      "",
      clisId,
      "",
      ordenCompra,
      cai,
      descrip,
      grabarAsiento
    )
  }
}

object FacturaVentaBase {

  def apply(
             cliId: Int,
             estId: Int,
             ccosId: Int,
             sucId: Int,
             cpgId: Int,
             lgjId: Int,
             venId: Int,
             clisId: Int,
             ordenCompra: String,
             cai: String,
             descrip: String,
             grabarAsiento: Boolean) = {

    new FacturaVentaBase(
      cliId,
      estId,
      ccosId,
      sucId,
      cpgId,
      lgjId,
      venId,
      clisId,
      ordenCompra,
      cai,
      descrip,
      grabarAsiento)
  }
}

case class FacturaVentaCotizacion(
                                    cotizacion: Double
                                  )

case class FacturaVentaPrecios(
                                 desc1: Double,
                                 desc2: Double,
                                 lpId: Int,
                                 lpName: String,
                                 ldId: Int,
                                 ldName: String
                               ) {
  def this(
            desc1: Double,
            desc2: Double,
            lpId: Int,
            ldId: Int
            ) = {
    this(
      desc1,
      desc2,
      lpId,
      "",
      ldId,
      ""
    )
  }
}

object FacturaVentaPrecios {

  def apply(
             desc1: Double,
             desc2: Double,
             lpId: Int,
             ldId: Int) = {

    new FacturaVentaPrecios(
      desc1,
      desc2,
      lpId,
      ldId)
  }
}

case class FacturaVentaDates(
                               fecha: Date,
                               fechaEntrega: Date,
                               fechaIva: Date,
                               fechaVto: Date
                             )

case class FacturaVentaStock(
                               proIdOrigen: Int,
                               proNameOrigen: String,
                               proIdDestino: Int,
                               proNameDestino: String,
                               deplId: Int,
                               deplName: String,
                               transId: Int,
                               transName: String
                             ) {
  def this(
            proIdOrigen: Int,
            proIdDestino: Int,
            deplId: Int,
            transId: Int
            ) = {
    this(
      proIdOrigen,
      "",
      proIdDestino,
      "",
      deplId,
      "",
      transId,
      ""
    )
  }
}

object FacturaVentaStock {

  def apply(
             proIdOrigen: Int,
             proIdDestino: Int,
             deplId: Int,
             transId: Int) = {

    new FacturaVentaStock(
      proIdOrigen,
      proIdDestino,
      deplId,
      transId)
  }
}

case class FacturaVentaTotals(
                                neto: Double,
                                ivaRi: Double,
                                ivaRni: Double,
                                internos: Double,
                                subTotal: Double,
                                importeDesc1: Double,
                                importeDesc2: Double,
                                totalPercepciones: Double,
                                total: Double,
                                totalOrigen: Double
                              )

case class FacturaVentaItemBase(
                                   descrip: String,
                                   descuento: String,
                                   prId: Int,
                                   prName: String,
                                   ccosId: Int,
                                   ccosName: String,
                                   toId: Int,
                                   toName: String,
                                   cueId: Int,
                                   cueIdIvaRi: Int,
                                   cueIdIvaRni: Int,
                                   stlId: Int,
                                   stlCode: String,
                                   orden: Int,
                                   llevaNroSerie: Boolean,
                                   llevaNroLote: Boolean,
                                   unName: String,
                                   noStock: Boolean
                                   )

object FacturaVentaItemBase {

  def apply(descrip: String,
            descuento: String,
            prId: Int,
            ccosId: Int,
            toId: Int,
            cueId: Int,
            cueIdIvaRi: Int,
            cueIdIvaRni: Int,
            stlId: Int,
            orden: Int,
            noStock: Boolean
           ) = {

    new FacturaVentaItemBase(
      descrip,
      descuento,
      prId,
      "",
      ccosId,
      "",
      toId,
      "",
      cueId,
      cueIdIvaRi,
      cueIdIvaRni,
      stlId,
      "",
      orden,
      false,
      false,
      "",
      noStock
    )
  }
}

case class FacturaVentaItemTotals(
                                    cantidad: Double,
                                    precio: Double,
                                    precioLista: Double,
                                    precioUser: Double,
                                    neto: Double,
                                    ivaRi: Double,
                                    ivaRni: Double,
                                    internos: Double,
                                    ivaRiPorc: Double,
                                    ivaRniPorc: Double,
                                    internosPorc: Double,
                                    prInternosPorc: Double,
                                    importe: Double,
                                    importeOrigen: Double
                                    )

object FacturaVentaItemTotals {

  def apply(cantidad: Double,
            precio: Double,
            precioLista: Double,
            precioUser: Double,
            neto: Double,
            ivaRi: Double,
            ivaRni: Double,
            internos: Double,
            ivaRiPorc: Double,
            ivaRniPorc: Double,
            internosPorc: Double,
            importe: Double,
            importeOrigen: Double) = {

    new FacturaVentaItemTotals(
      cantidad,
      precio,
      precioLista,
      precioUser,
      neto,
      ivaRi,
      ivaRni,
      internos,
      ivaRiPorc,
      ivaRniPorc,
      internosPorc,
      0,
      importe,
      importeOrigen
    )
  }
}

case class FacturaVentaItemSerie(
                                   id: Int,
                                   code: String,
                                   descrip: String,
                                   fechaVto: Date,
                                   fviId: Int
                                   )

case class FacturaVentaItemKit(
                                  id: Int,
                                  name: String,
                                  amount: Double,
                                  hasSerial: Boolean
                                  )

case class FacturaVentaItem(
                              id: Int,
                              base: FacturaVentaItemBase,
                              totals: FacturaVentaItemTotals,
                              series: List[FacturaVentaItemSerie] /* only used in save */
                            )

case class FacturaVentaPercepcion(
                                    id: Int,
                                    percId: Int,
                                    percName: String,
                                    base: Double,
                                    porcentaje: Double,
                                    importe: Double,
                                    ccosId: Int,
                                    ccosName: String,
                                    descrip: String,
                                    origen: Double,
                                    orden: Int
                                  )

object FacturaVentaPercepcion {

  def apply(
             id: Int,
             percId: Int,
             base: Double,
             porcentaje: Double,
             importe: Double,
             ccosId: Int,
             descrip: String,
             origen: Double,
             orden: Int) = {

    new FacturaVentaPercepcion(
      id,
      percId,
      "",
      base,
      porcentaje,
      importe,
      ccosId,
      "",
      descrip,
      origen,
      orden
    )
  }
}

case class FacturaVentaRemito(
                               rviId: Int,
                               cantidad: Double,
                               fviId: Int
                             )

case class FacturaVentaItems(
                                items: List[FacturaVentaItem],
                                series: List[FacturaVentaItemSerie], /* only used when loading an invoice to respond a get FacturaVenta */
                                kits: List[FacturaVentaItemKit],  /* only used when loading an invoice to respond a get FacturaVenta */
                                percepciones: List[FacturaVentaPercepcion],

                                /* only used in save */
                                itemDeleted: String,
                                percepcionDeleted: String,

                                remitos: List[FacturaVentaRemito]
                             )

case class FacturaVenta(
                          id: Int,

                          ids: FacturaVentaId,
                          base: FacturaVentaBase,
                          references: FacturaVentaReferences,
                          dates: FacturaVentaDates,
                          precios: FacturaVentaPrecios,
                          cotizacion: FacturaVentaCotizacion,
                          stock: FacturaVentaStock,
                          totals: FacturaVentaTotals,

                          items: FacturaVentaItems,

                          createdAt: Date,
                          updatedAt: Date,
                          updatedBy: Int
                        ) {

  def this(
            id: Int,

            ids: FacturaVentaId,
            base: FacturaVentaBase,
            references: FacturaVentaReferences,
            dates: FacturaVentaDates,
            precios: FacturaVentaPrecios,
            cotizacion: FacturaVentaCotizacion,
            stock: FacturaVentaStock,
            totals: FacturaVentaTotals,

            items: FacturaVentaItems) = {

    this(
      id,

      ids,
      base,
      references,
      dates,
      precios,
      cotizacion,
      stock,
      totals,

      items,

      DateUtil.currentTime,
      DateUtil.currentTime,
      DBHelper.NoId)
  }

  def this(
            ids: FacturaVentaId,
            base: FacturaVentaBase,
            references: FacturaVentaReferences,
            dates: FacturaVentaDates,
            precios: FacturaVentaPrecios,
            cotizacion: FacturaVentaCotizacion,
            stock: FacturaVentaStock,
            totals: FacturaVentaTotals,

            items: FacturaVentaItems) = {

    this(
      DBHelper.NoId,

      ids,
      base,
      references,
      dates,
      precios,
      cotizacion,
      stock,
      totals,

      items
    )
  }

}

case class FacturaVentaParams(
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
                                venId: String,
                                venName: String,
                                docId: String,
                                docName: String,
                                cpgId: String,
                                cpgName: String,
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
            venId: String,
            docId: String,
            cpgId: String,
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
      venId,
      "",
      docId,
      "",
      cpgId,
      "",
      empId,
      ""
    )
  }
}

object FacturaVentaParams {
  def apply(
             from: String,
             to: String,
             cliId: String,
             estId: String,
             ccosId: String,
             sucId: String,
             venId: String,
             docId: String,
             cpgId: String,
             empId: String
             ) = {

    new FacturaVentaParams(
      from,
      to,
      cliId,
      estId,
      ccosId,
      sucId,
      venId,
      docId,
      cpgId,
      empId
    )
  }
}

case class FacturaVentaNotaCreditoItem(
                                         fvIdNotaCredito: Int,
                                         fvIdFactura: Int,
                                         fvdIdNotaCredito: Int,
                                         fvdIdFactura: Int,
                                         fvpIdNotaCredito: Int,
                                         fvpIdFactura: Int,
                                         fvncImporte: Double,
                                         fvncId: Int
                                         )

case class CobranzaItem(
                     cobzId: Int,
                     fvId: Int,
                     fvdId: Int,
                     fvpId: Int,
                     fvcobzId: Int,
                     fvcobzCotizacion: Double,
                     fvcobzImporte: Double,
                     fvcobzImporteOrigen: Double
                     )

case class CobranzaCtaCte(
                       cueId: Int,
                       cobziImporteOrigen: Double,
                       cobziImporte: Double,
                       cobziOrden: Int,
                       cobziTipo: Int,
                       cobziOtroTipo: Int
                       )

case class FacturaVentaCobranzaItem(
                                       cobzId: Int,
                                       items: List[CobranzaItem],
                                       ctaCte: List[CobranzaCtaCte]
                                       )

case class FacturaVentaPedidoVentaItem(
                                         pviId: Int,
                                         fviId: Int,
                                         pvfvCantidad: Double,
                                         pvfvId: Int
                                         )

case class FacturaVentaRemitoVentaItem(
                                          rviId: Int,
                                          fviId: Int,
                                          rvfvCantidad: Double,
                                          rvfvId: Int
                                          )

case class FacturaVentaAplic(
                               fvId: Int,
                               docId: Int,
                               notaCredito: List[FacturaVentaNotaCreditoItem],
                               cobranza: List[FacturaVentaCobranzaItem],
                               pedidoVenta: List[FacturaVentaPedidoVentaItem],
                               remitoVenta: List[FacturaVentaRemitoVentaItem]
                               )

object FacturaVenta {

  lazy val GC = models.cairo.modules.general.C
  lazy val TC = models.cairo.modules.tesoreria.C

  lazy val emptyFacturaVentaItems = FacturaVentaItems(List(), List(), List(), List(), "", "", List())

  lazy val emptyFacturaVentaReferences = FacturaVentaReferences(
    DBHelper.NoId, DBHelper.NoId, "", false, false, false, 0, DBHelper.NoId, DBHelper.NoId, false, false, false, "")

  lazy val emptyFacturaVenta = FacturaVenta(
    FacturaVentaId(DBHelper.NoId, 0, ""),
    FacturaVentaBase(DBHelper.NoId, DBHelper.NoId, DBHelper.NoId, DBHelper.NoId, DBHelper.NoId, DBHelper.NoId, DBHelper.NoId, DBHelper.NoId, "", "", "", false),
    emptyFacturaVentaReferences,
    FacturaVentaDates(U.NO_DATE, U.NO_DATE, U.NO_DATE, U.NO_DATE),
    FacturaVentaPrecios(0.0, 0.0, DBHelper.NoId, DBHelper.NoId),
    FacturaVentaCotizacion(0),
    FacturaVentaStock(DBHelper.NoId, DBHelper.NoId, DBHelper.NoId, DBHelper.NoId),
    FacturaVentaTotals(0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0),
    emptyFacturaVentaItems
  )

  lazy val emptyFacturaVentaParams = FacturaVentaParams(
    DateFormatter.format(DateUtil.plusDays(DateUtil.currentTime, -60)),
    DateFormatter.format(DateUtil.currentTime), "0", "", "0", "", "0", "", "0", "", "0", "", "0", "", "0", "", "0", "")

  def apply(
             id: Int,

             ids: FacturaVentaId,
             base: FacturaVentaBase,
             references: FacturaVentaReferences,
             dates: FacturaVentaDates,
             precios: FacturaVentaPrecios,
             cotizacion: FacturaVentaCotizacion,
             stock: FacturaVentaStock,
             totals: FacturaVentaTotals,

             items: FacturaVentaItems
             ) = {

    new FacturaVenta(
      id,

      ids,
      base,
      references,
      dates,
      precios,
      cotizacion,
      stock,
      totals,

      items
    )
  }

  def apply(
             id: Int,

             ids: FacturaVentaId,
             base: FacturaVentaBase,
             references: FacturaVentaReferences,
             dates: FacturaVentaDates,
             precios: FacturaVentaPrecios,
             cotizacion: FacturaVentaCotizacion,
             stock: FacturaVentaStock,
             totals: FacturaVentaTotals
             ) = {

    new FacturaVenta(
      id,

      ids,
      base,
      references,
      dates,
      precios,
      cotizacion,
      stock,
      totals,

      emptyFacturaVentaItems
    )
  }

  def apply(
             ids: FacturaVentaId,
             base: FacturaVentaBase,
             references: FacturaVentaReferences,
             dates: FacturaVentaDates,
             precios: FacturaVentaPrecios,
             cotizacion: FacturaVentaCotizacion,
             stock: FacturaVentaStock,
             totals: FacturaVentaTotals,

             items: FacturaVentaItems
             ) = {

    new FacturaVenta(
      ids,
      base,
      references,
      dates,
      precios,
      cotizacion,
      stock,
      totals,

      items
    )
  }

  def apply(
             ids: FacturaVentaId,
             base: FacturaVentaBase,
             references: FacturaVentaReferences,
             dates: FacturaVentaDates,
             precios: FacturaVentaPrecios,
             cotizacion: FacturaVentaCotizacion,
             stock: FacturaVentaStock,
             totals: FacturaVentaTotals
             ) = {

    new FacturaVenta(

      ids,
      base,
      references,
      dates,
      precios,
      cotizacion,
      stock,
      totals,

      emptyFacturaVentaItems
    )
  }

  private val facturaVentaItemParser: RowParser[FacturaVentaItem] = {
    SqlParser.get[Int](C.FVI_ID) ~
    SqlParser.get[BigDecimal](C.FVI_CANTIDAD) ~
    SqlParser.get[String](C.FVI_DESCRIP) ~
    SqlParser.get[String](C.FVI_DESCUENTO) ~
    SqlParser.get[BigDecimal](C.FVI_PRECIO) ~
    SqlParser.get[BigDecimal](C.FVI_PRECIO_LISTA) ~
    SqlParser.get[BigDecimal](C.FVI_PRECIO_USR) ~
    SqlParser.get[BigDecimal](C.FVI_NETO) ~
    SqlParser.get[BigDecimal](C.FVI_IVA_RI) ~
    SqlParser.get[BigDecimal](C.FVI_IVA_RNI) ~
    SqlParser.get[BigDecimal](C.FVI_INTERNOS) ~
    SqlParser.get[BigDecimal](C.FVI_IVA_RI_PORC) ~
    SqlParser.get[BigDecimal](C.FVI_IVA_RNI_PORC) ~
    SqlParser.get[BigDecimal](C.FVI_INTERNOS_PORC) ~
    SqlParser.get[Float](GC.PR_PORC_INTERNO_V) ~
    SqlParser.get[Int](GC.PR_ID) ~
    SqlParser.get[String](GC.PR_NAME_VENTA) ~
    SqlParser.get[Option[Int]](GC.CCOS_ID) ~
    SqlParser.get[Option[String]](GC.CCOS_NAME) ~
    SqlParser.get[Int](GC.TO_ID) ~
    SqlParser.get[String](GC.TO_NAME) ~
    SqlParser.get[Int](GC.CUE_ID) ~
    SqlParser.get[Option[Int]](C.CUE_ID_IVA_RI) ~
    SqlParser.get[Option[Int]](C.CUE_ID_IVA_RNI) ~
    SqlParser.get[Option[Int]](GC.STL_ID) ~
    SqlParser.get[Option[String]](GC.STL_CODE) ~
    SqlParser.get[BigDecimal](C.FVI_IMPORTE) ~
    SqlParser.get[BigDecimal](C.FVI_IMPORTE_ORIGEN) ~
    SqlParser.get[Int](C.FVI_ORDEN) ~
    SqlParser.get[Int](GC.PR_LLEVA_NRO_SERIE) ~
    SqlParser.get[Int](GC.PR_LLEVA_NRO_LOTE) ~
    SqlParser.get[String](GC.UN_NAME) ~
    SqlParser.get[Int](C.FVI_NO_STOCK) map {
    case
        id ~
        cantidad ~
        descrip ~
        descuento ~
        precio ~
        precioLista ~
        precioUser ~
        neto ~
        ivaRi ~
        ivaRni ~
        internos ~
        ivaRiPorc ~
        ivaRniPorc ~
        internosPorc ~
        prInternosPorc ~
        prId ~
        prName ~
        ccosId ~
        ccosName ~
        toId ~
        toName ~
        cueId ~
        cueIdIvaRi ~
        cueIdIvaRni ~
        stlId ~
        stlCode ~
        importe ~
        importeOrigen ~
        orden ~
        llevaNroSerie ~
        llevaNroLote ~
        unName ~
        noStock =>
      FacturaVentaItem(
        id,
        FacturaVentaItemBase(
          descrip,
          descuento,
          prId,
          prName,
          ccosId.getOrElse(DBHelper.NoId),
          ccosName.getOrElse(""),
          toId,
          toName,
          cueId,
          cueIdIvaRi.getOrElse(DBHelper.NoId),
          cueIdIvaRni.getOrElse(DBHelper.NoId),
          stlId.getOrElse(DBHelper.NoId),
          stlCode.getOrElse(""),
          orden,
          llevaNroSerie != 0,
          llevaNroLote != 0,
          unName,
          noStock != 0
        ),
        FacturaVentaItemTotals(
          cantidad.doubleValue(),
          precio.doubleValue(),
          precioLista.doubleValue(),
          precioUser.doubleValue(),
          neto.doubleValue(),
          ivaRi.doubleValue(),
          ivaRni.doubleValue(),
          internos.doubleValue(),
          ivaRiPorc.doubleValue(),
          ivaRniPorc.doubleValue(),
          internosPorc.doubleValue(),
          prInternosPorc,
          importe.doubleValue(),
          importeOrigen.doubleValue()
        ),
        List()
      )
    }
  }

  private val facturaVentaItemSerieParser: RowParser[FacturaVentaItemSerie] = {
    SqlParser.get[Int](GC.PRNS_ID) ~
    SqlParser.get[String](GC.PRNS_CODE) ~
    SqlParser.get[String](GC.PRNS_DESCRIP) ~
    SqlParser.get[Date](GC.PRNS_FECHA_VTO) ~
    SqlParser.get[Int](C.FVI_ID) map {
    case
        prnsId ~
        prnsCode ~
        prnsDescrip ~
        prnsFechaVto ~
        fviId =>
      FacturaVentaItemSerie(
        prnsId,
        prnsCode,
        prnsDescrip,
        prnsFechaVto,
        fviId
      )
    }
  }

  private val facturaVentaItemKitParser: RowParser[FacturaVentaItemKit] = {
    SqlParser.get[Int](GC.PR_ID) ~
    SqlParser.get[String](GC.PR_NAME_COMPRA) ~
    SqlParser.get[BigDecimal](GC.PRK_CANTIDAD) ~
    SqlParser.get[Int](GC.PR_LLEVA_NRO_SERIE) map {
    case
        prId ~
        name ~
        amount ~
        hasSerial =>
      FacturaVentaItemKit(
        prId,
        name,
        amount.doubleValue(),
        (hasSerial != 0)
      )
    }
  }

  private val facturaVentaPercepcionParser: RowParser[FacturaVentaPercepcion] = {
    SqlParser.get[Int](C.FVPERC_ID) ~
    SqlParser.get[Int](GC.PERC_ID) ~
    SqlParser.get[String](GC.PERC_NAME) ~
    SqlParser.get[BigDecimal](C.FVPERC_BASE) ~
    SqlParser.get[BigDecimal](C.FVPERC_PORCENTAJE) ~
    SqlParser.get[BigDecimal](C.FVPERC_IMPORTE) ~
    SqlParser.get[Option[Int]](GC.CCOS_ID) ~
    SqlParser.get[Option[String]](GC.CCOS_NAME) ~
    SqlParser.get[String](C.FVPERC_DESCRIP) ~
    SqlParser.get[BigDecimal](C.FVPERC_ORIGEN) ~
    SqlParser.get[Int](C.FVPERC_ORDEN) map {
    case
        id ~
        percId ~
        percName ~
        base ~
        porcentaje ~
        importe ~
        ccosId ~
        ccosName ~
        descrip ~
        origen ~
        orden =>
      FacturaVentaPercepcion(
        id,
        percId,
        percName,
        base.doubleValue(),
        porcentaje.doubleValue(),
        importe.doubleValue(),
        ccosId.getOrElse(DBHelper.NoId),
        ccosName.getOrElse(""),
        descrip,
        origen.doubleValue(),
        orden
      )
    }
  }

  private val facturaVentaParser: RowParser[FacturaVenta] = {
    SqlParser.get[Int](C.FV_ID) ~
    SqlParser.get[Int](GC.DOC_ID) ~
    SqlParser.get[String](GC.DOC_NAME) ~
    SqlParser.get[Int](C.FV_NUMERO) ~
    SqlParser.get[String](C.FV_NRODOC) ~
    SqlParser.get[Int](GC.CLI_ID) ~
    SqlParser.get[String](GC.CLI_NAME) ~
    SqlParser.get[Int](GC.EST_ID) ~
    SqlParser.get[String](GC.EST_NAME) ~
    SqlParser.get[Option[Int]](GC.CCOS_ID) ~
    SqlParser.get[Option[String]](GC.CCOS_NAME) ~
    SqlParser.get[Int](GC.SUC_ID) ~
    SqlParser.get[String](GC.SUC_NAME) ~
    SqlParser.get[Int](GC.CPG_ID) ~
    SqlParser.get[String](GC.CPG_NAME) ~
    SqlParser.get[Option[Int]](GC.LGJ_ID) ~
    SqlParser.get[Option[String]](GC.LGJ_CODE) ~
    SqlParser.get[Option[Int]](GC.VEN_ID) ~
    SqlParser.get[Option[String]](GC.VEN_NAME) ~
    SqlParser.get[Option[Int]](GC.CLIS_ID) ~
    SqlParser.get[Option[String]](GC.CLIS_NAME) ~
    SqlParser.get[String](C.FV_ORDEN_COMPRA) ~
    SqlParser.get[String](C.FV_CAI) ~
    SqlParser.get[String](C.FV_DESCRIP) ~
    SqlParser.get[Int](C.FV_GRABAR_ASIENTO) ~
    SqlParser.get[Int](GC.DOCT_ID) ~
    SqlParser.get[String](GC.DOCT_NAME) ~
    SqlParser.get[Int](GC.MON_ID) ~
    SqlParser.get[String](GC.MON_NAME) ~
    SqlParser.get[String](GC.TA_MASCARA) ~
    SqlParser.get[Int](GC.TA_PROPUESTO) ~
    SqlParser.get[Int](C.FV_FIRMADO) ~
    SqlParser.get[Int](GC.DOC_MUEVE_STOCK) ~
    SqlParser.get[Int](GC.DOC_TIPO_FACTURA) ~
    SqlParser.get[Option[Int]](C.ST_ID) ~
    SqlParser.get[Option[Int]](C.AS_ID) ~
    SqlParser.get[Int](GC.HAS_IVA_RI) ~
    SqlParser.get[Int](GC.HAS_IVA_RNI) ~
    SqlParser.get[Int](GC.EDITABLE) ~
    SqlParser.get[String](GC.EDIT_MSG) ~
    SqlParser.get[Date](C.FV_FECHA) ~
    SqlParser.get[Date](C.FV_FECHA_ENTREGA) ~
    SqlParser.get[Date](C.FV_FECHA_IVA) ~
    SqlParser.get[Date](C.FV_FECHA_VTO) ~
    SqlParser.get[BigDecimal](C.FV_DESCUENTO1) ~
    SqlParser.get[BigDecimal](C.FV_DESCUENTO2) ~
    SqlParser.get[Option[Int]](GC.LP_ID) ~
    SqlParser.get[Option[String]](GC.LP_NAME) ~
    SqlParser.get[Option[Int]](GC.LD_ID) ~
    SqlParser.get[Option[String]](GC.LD_NAME) ~
    SqlParser.get[BigDecimal](C.FV_COTIZACION) ~
    SqlParser.get[Option[Int]](C.PRO_ID_ORIGEN) ~
    SqlParser.get[Option[String]](C.PRO_ORIGEN_NAME) ~
    SqlParser.get[Option[Int]](C.PRO_ID_DESTINO) ~
    SqlParser.get[Option[String]](C.PRO_DESTINO_NAME) ~
    SqlParser.get[Option[Int]](GC.DEPL_ID) ~
    SqlParser.get[Option[String]](GC.DEPL_NAME) ~
    SqlParser.get[Option[Int]](GC.TRANS_ID) ~
    SqlParser.get[Option[String]](GC.TRANS_NAME) ~
    SqlParser.get[BigDecimal](C.FV_NETO) ~
    SqlParser.get[BigDecimal](C.FV_IVA_RI) ~
    SqlParser.get[BigDecimal](C.FV_IVA_RNI) ~
    SqlParser.get[BigDecimal](C.FV_INTERNOS) ~
    SqlParser.get[BigDecimal](C.FV_SUBTOTAL) ~
    SqlParser.get[BigDecimal](C.FV_IMPORTE_DESC_1) ~
    SqlParser.get[BigDecimal](C.FV_IMPORTE_DESC_2) ~
    SqlParser.get[BigDecimal](C.FV_TOTAL_PERCEPCIONES) ~
    SqlParser.get[BigDecimal](C.FV_TOTAL) ~
    SqlParser.get[BigDecimal](C.FV_TOTAL_ORIGEN) ~
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
        cpgId ~
        cpgName ~
        lgjId ~
        lgjCode ~
        venId ~
        venName ~
        clisId ~
        clisName ~
        ordenCompra ~
        cai ~
        descrip ~
        grabarAsiento ~
        doctId ~
        doctName ~
        monId ~
        monName ~
        taMascara ~
        taPropuesto ~
        firmado ~
        docMueveStock ~
        docTipoFactura ~
        stId ~
        asId ~
        hasIvaRi ~
        hasIvaRni ~
        editable ~
        editMsg ~
        fecha ~
        fechaEntrega ~
        fechaIva ~
        fechaVto ~
        desc1 ~
        desc2 ~
        lpId ~
        lpName ~
        ldId ~
        ldName ~
        cotizacion ~
        proIdOrigen ~
        proNameOrigen ~
        proIdDestino ~
        proNameDestino ~
        deplId ~
        deplName ~
        transId ~
        transName ~
        neto ~
        ivaRi ~
        ivaRni ~
        internos ~
        subTotal ~
        importeDesc1 ~
        importeDesc2 ~
        totalPercepciones ~
        total ~
        totalOrigen ~
        createdAt ~
        updatedAt ~
        updatedBy =>
      FacturaVenta(
        id,
        FacturaVentaId(
          docId,
          docName,
          numero,
          nroDoc
        ),
        FacturaVentaBase(
          cliId,
          cliName,
          estId,
          estName,
          ccosId.getOrElse(DBHelper.NoId),
          ccosName.getOrElse(""),
          sucId,
          sucName,
          cpgId,
          cpgName,
          lgjId.getOrElse(DBHelper.NoId),
          lgjCode.getOrElse(""),
          venId.getOrElse(DBHelper.NoId),
          venName.getOrElse(""),
          clisId.getOrElse(DBHelper.NoId),
          clisName.getOrElse(""),
          ordenCompra,
          cai,
          descrip,
          grabarAsiento != 0
        ),
        FacturaVentaReferences(
          doctId,
          doctName,
          monId,
          monName,
          taMascara,
          taPropuesto != 0,
          firmado != 0,
          docMueveStock != 0,
          docTipoFactura,
          stId.getOrElse(DBHelper.NoId),
          asId.getOrElse(DBHelper.NoId),
          hasIvaRi != 0,
          hasIvaRni != 0,
          editable != 0,
          editMsg
        ),
        FacturaVentaDates(
          fecha,
          fechaEntrega,
          fechaIva,
          fechaVto
        ),
        FacturaVentaPrecios(
          desc1.doubleValue(),
          desc2.doubleValue(),
          lpId.getOrElse(DBHelper.NoId),
          lpName.getOrElse(""),
          ldId.getOrElse(DBHelper.NoId),
          ldName.getOrElse("")
        ),
        FacturaVentaCotizacion(
          cotizacion.doubleValue()
        ),
        FacturaVentaStock(
          proIdOrigen.getOrElse(DBHelper.NoId),
          proNameOrigen.getOrElse(""),
          proIdDestino.getOrElse(DBHelper.NoId),
          proNameDestino.getOrElse(""),
          deplId.getOrElse(DBHelper.NoId),
          deplName.getOrElse(""),
          transId.getOrElse(DBHelper.NoId),
          transName.getOrElse("")
        ),
        FacturaVentaTotals(
          neto.doubleValue(),
          ivaRi.doubleValue(),
          ivaRni.doubleValue(),
          internos.doubleValue(),
          subTotal.doubleValue(),
          importeDesc1.doubleValue(),
          importeDesc2.doubleValue(),
          totalPercepciones.doubleValue(),
          total.doubleValue(),
          totalOrigen.doubleValue()
        ),
        emptyFacturaVentaItems,
        createdAt,
        updatedAt,
        updatedBy)
    }
  }

  def createFromRemito(user: CompanyUser, facturaVenta: FacturaVenta): FacturaVenta = {
    save(user, facturaVenta, true)
  }

  def create(user: CompanyUser, facturaVenta: FacturaVenta): FacturaVenta = {
    save(user, facturaVenta, false)
  }

  def update(user: CompanyUser, facturaVenta: FacturaVenta): FacturaVenta = {
    save(user, facturaVenta, false)
  }

  // TODO: this function must call sp_DocNCFacturaVentaSaveAplic and call showFacturaDuplicada
  //       to return info about this error use the field factura_duplicada to return the info

  private def save(user: CompanyUser, facturaVenta: FacturaVenta, isFromWizard: Boolean): FacturaVenta = {
    def getFields = {
      List(
        Field(C.FV_ID, facturaVenta.id, FieldType.number),
        Field(GC.DOC_ID, facturaVenta.ids.docId, FieldType.id),
        Field(C.FV_NRODOC, facturaVenta.ids.nroDoc, FieldType.text),
        Field(C.FV_NUMERO, facturaVenta.ids.numero, FieldType.number),

        Field(GC.CLI_ID, facturaVenta.base.cliId, FieldType.id),
        Field(GC.EST_ID, facturaVenta.base.estId, FieldType.id),
        Field(GC.CCOS_ID, facturaVenta.base.ccosId, FieldType.id),
        Field(GC.SUC_ID, facturaVenta.base.sucId, FieldType.id),
        Field(GC.CPG_ID, facturaVenta.base.cpgId, FieldType.id),
        Field(GC.LGJ_ID, facturaVenta.base.lgjId, FieldType.id),
        Field(GC.VEN_ID, facturaVenta.base.venId, FieldType.id),
        Field(GC.CLIS_ID, facturaVenta.base.clisId, FieldType.id),
        Field(C.FV_ORDEN_COMPRA, facturaVenta.base.ordenCompra, FieldType.text),
        Field(C.FV_CAI, facturaVenta.base.cai, FieldType.text),
        Field(C.FV_DESCRIP, facturaVenta.base.descrip, FieldType.text),
        Field(C.FV_GRABAR_ASIENTO, Register.boolToInt(facturaVenta.base.grabarAsiento), FieldType.boolean),

        Field(C.FV_FECHA, facturaVenta.dates.fecha, FieldType.date),
        Field(C.FV_FECHA_ENTREGA, facturaVenta.dates.fechaEntrega, FieldType.date),
        Field(C.FV_FECHA_IVA, facturaVenta.dates.fechaIva, FieldType.date),
        Field(C.FV_FECHA_VTO, facturaVenta.dates.fechaVto, FieldType.date),

        Field(C.FV_DESCUENTO1, facturaVenta.precios.desc1, FieldType.currency),
        Field(C.FV_DESCUENTO2, facturaVenta.precios.desc2, FieldType.currency),
        Field(GC.LP_ID, facturaVenta.precios.lpId, FieldType.id),
        Field(GC.LD_ID, facturaVenta.precios.ldId, FieldType.id),

        Field(C.FV_COTIZACION, facturaVenta.cotizacion.cotizacion, FieldType.currency),

        Field(C.PRO_ID_ORIGEN, facturaVenta.stock.proIdOrigen, FieldType.id),
        Field(C.PRO_ID_DESTINO, facturaVenta.stock.proIdDestino, FieldType.id),
        Field(GC.DEPL_ID, facturaVenta.stock.deplId, FieldType.id),
        Field(GC.TRANS_ID, facturaVenta.stock.transId, FieldType.id),

        Field(C.FV_NETO, facturaVenta.totals.neto, FieldType.currency),
        Field(C.FV_IVA_RI, facturaVenta.totals.ivaRi, FieldType.currency),
        Field(C.FV_IVA_RNI, facturaVenta.totals.ivaRni, FieldType.currency),
        Field(C.FV_INTERNOS, facturaVenta.totals.internos, FieldType.currency),
        Field(C.FV_SUBTOTAL, facturaVenta.totals.subTotal, FieldType.currency),
        Field(C.FV_IMPORTE_DESC_1, facturaVenta.totals.importeDesc1, FieldType.currency),
        Field(C.FV_IMPORTE_DESC_2, facturaVenta.totals.importeDesc2, FieldType.currency),
        Field(C.FV_TOTAL_PERCEPCIONES, facturaVenta.totals.totalPercepciones, FieldType.currency),
        Field(C.FV_TOTAL, facturaVenta.totals.total, FieldType.currency),
        Field(C.FV_TOTAL_ORIGEN, facturaVenta.totals.totalOrigen, FieldType.currency)
      )
    }

    def getItemFields(item: FacturaVentaItem, fvTMPId: Int) = {
      List(
        Field(C.FV_TMP_ID, fvTMPId, FieldType.id),
        Field(C.FVI_ID, item.id, FieldType.number),
        Field(C.FVI_DESCRIP, item.base.descrip, FieldType.text),
        Field(C.FVI_DESCUENTO, item.base.descuento, FieldType.text),
        Field(GC.PR_ID, item.base.prId, FieldType.id),
        Field(GC.CCOS_ID, item.base.ccosId, FieldType.id),
        Field(GC.TO_ID, item.base.toId, FieldType.id),
        Field(GC.CUE_ID, item.base.cueId, FieldType.id),
        Field(C.CUE_ID_IVA_RI, item.base.cueIdIvaRi, FieldType.id),
        Field(C.CUE_ID_IVA_RNI, item.base.cueIdIvaRni, FieldType.id),
        Field(GC.STL_ID, item.base.stlId, FieldType.id),
        Field(C.FVI_ORDEN, item.base.orden, FieldType.integer),
        Field(C.FVI_CANTIDAD, item.totals.cantidad, FieldType.currency),
        Field(C.FVI_CANTIDAD_A_REMITIR, item.totals.cantidad, FieldType.currency),
        Field(C.FVI_PRECIO, item.totals.precio, FieldType.currency),
        Field(C.FVI_PRECIO_LISTA, item.totals.precioLista, FieldType.currency),
        Field(C.FVI_PRECIO_USR, item.totals.precioUser, FieldType.currency),
        Field(C.FVI_NETO, item.totals.neto, FieldType.currency),
        Field(C.FVI_IVA_RI, item.totals.ivaRi, FieldType.currency),
        Field(C.FVI_IVA_RNI, item.totals.ivaRni, FieldType.currency),
        Field(C.FVI_INTERNOS, item.totals.internos, FieldType.currency),
        Field(C.FVI_IVA_RI_PORC, item.totals.ivaRiPorc, FieldType.double),
        Field(C.FVI_IVA_RNI_PORC, item.totals.ivaRniPorc, FieldType.double),
        Field(C.FVI_INTERNOS_PORC, item.totals.internosPorc, FieldType.double),
        Field(C.FVI_IMPORTE, item.totals.importe, FieldType.currency),
        Field(C.FVI_IMPORTE_ORIGEN, item.totals.importeOrigen, FieldType.currency)
      )
    }

    def getDeletedItemFields(fviId: Int, fvTMPId: Int) = {
      List(
        Field(C.FV_TMP_ID, fvTMPId, FieldType.id),
        Field(C.FVI_ID, fviId, FieldType.number),
        Field(C.FV_ID, facturaVenta.id, FieldType.id)
      )
    }

    def getPercepcionFields(item: FacturaVentaPercepcion, fvTMPId: Int) = {
      List(
        Field(C.FV_TMP_ID, fvTMPId, FieldType.id),
        Field(C.FVPERC_ID, item.id, FieldType.number),
        Field(GC.PERC_ID, item.percId, FieldType.id),
        Field(C.FVPERC_BASE, item.base, FieldType.currency),
        Field(C.FVPERC_PORCENTAJE, item.porcentaje, FieldType.currency),
        Field(C.FVPERC_IMPORTE, item.importe, FieldType.currency),
        Field(GC.CCOS_ID, item.percId, FieldType.id),
        Field(C.FVPERC_DESCRIP, item.descrip, FieldType.text),
        Field(C.FVPERC_ORIGEN, item.origen, FieldType.currency),
        Field(C.FVPERC_ORDEN, item.orden, FieldType.integer)
      )
    }

    def getDeletedPercepcionFields(fvpercId: Int, fvTMPId: Int) = {
      List(
        Field(C.FV_TMP_ID, fvTMPId, FieldType.id),
        Field(C.FVPERC_ID, fvpercId, FieldType.number),
        Field(C.FV_ID, facturaVenta.id, FieldType.id)
      )
    }

    def getRemitoFields(item: FacturaVentaRemito, fvTMPId: Int) = {
      List(
        Field(C.FV_TMP_ID, fvTMPId, FieldType.id),
        Field(C.RV_FV_ID, 0, FieldType.number),
        Field(C.RVI_ID, item.rviId, FieldType.id),
        Field(C.RV_FV_CANTIDAD, item.cantidad, FieldType.currency),
        Field(C.FVI_ID, item.rviId, FieldType.id)
      )
    }

    def getSerieFields(item: FacturaVentaItemSerie, fvTMPId: Int, fviTMPId: Int, prId: Int) = {
      List(
        Field(C.FV_TMP_ID, fvTMPId, FieldType.id),
        Field(C.FVI_TMP_ID, fviTMPId, FieldType.id),
        Field(GC.PR_ID, prId, FieldType.id),
        Field(GC.PRNS_ID, item.id, FieldType.id),
        Field(GC.PRNS_CODE, item.code, FieldType.text),
        Field(GC.PRNS_DESCRIP, item.descrip, FieldType.text),
        Field(GC.PRNS_FECHA_VTO, item.fechaVto, FieldType.date)
      )
    }

    def throwError = {
      throwException(s"Error when saving ${C.FACTURA_VENTA}")
    }

    def throwException(message: String) = {
      throw new RuntimeException(message)
    }

    def saveItemSerie(fvTMPId: Int, fviTMPId: Int, prId: Int)(item: FacturaVentaItemSerie) = {
      DBHelper.save(
        user,
        Register(
          C.FACTURA_VENTA_ITEM_SERIE_TMP,
          C.FVIS_TMP_ID,
          DBHelper.NoId,
          false,
          false,
          false,
          getSerieFields(item, fvTMPId, fviTMPId, prId)),
        true
      ) match {
        case SaveResult(true, id) => true
        case SaveResult(false, id) => throwError
      }
    }

    case class FacturaVentaItemSerieInfo(
                                           fvTMPId: Int,
                                           fviTMPId: Int,
                                           prId: Int,
                                           series: List[FacturaVentaItemSerie])

    def saveItemSeries(serieInfo: FacturaVentaItemSerieInfo) = {
      serieInfo.series.map(saveItemSerie(serieInfo.fvTMPId, serieInfo.fviTMPId, serieInfo.prId))
    }

    case class FacturaVentaItemInfo(fvTMPId: Int, item: FacturaVentaItem)

    def saveItem(itemInfo: FacturaVentaItemInfo) = {
      DBHelper.save(
        user,
        Register(
          C.FACTURA_VENTA_ITEM_TMP,
          C.FVI_TMP_ID,
          DBHelper.NoId,
          false,
          false,
          false,
          getItemFields(itemInfo.item, itemInfo.fvTMPId)),
        true
      ) match {
        case SaveResult(true, id) => {
          FacturaVentaItemSerieInfo(
            itemInfo.fvTMPId, id, itemInfo.item.base.prId, itemInfo.item.series)
        }
        case SaveResult(false, id) => throwError
      }
    }

    def saveDeletedItem(fvTMPId: Int)(fviId: String) = {
      val id = G.getIntOrZero(fviId)
      if(id != 0) {
        DBHelper.save(
          user,
          Register(
            C.FACTURA_VENTA_ITEM_BORRADO_TMP,
            C.FVIB_TMP_ID,
            DBHelper.NoId,
            false,
            false,
            false,
            getDeletedItemFields(id, fvTMPId)),
          true
        ) match {
          case SaveResult(false, id) => throwError
          case _ =>
        }
      }
    }

    def saveItems(fvTMPId: Int) = {
      facturaVenta.items.items.map(item => saveItem(FacturaVentaItemInfo(fvTMPId, item))).map(saveItemSeries)
      facturaVenta.items.itemDeleted.split(",").map(saveDeletedItem(fvTMPId))
    }

    case class FacturaVentaPercepcionInfo(fvTMPId: Int, item: FacturaVentaPercepcion)

    def savePercepcion(itemInfo: FacturaVentaPercepcionInfo) = {
      DBHelper.save(
        user,
        Register(
          C.FACTURA_VENTA_PERCEPCION_TMP,
          C.FVPERC_TMP_ID,
          DBHelper.NoId,
          false,
          false,
          false,
          getPercepcionFields(itemInfo.item, itemInfo.fvTMPId)),
        true
      ) match {
        case SaveResult(true, id) => true
        case SaveResult(false, id) => throwError
      }
    }

    def saveDeletedPercepcion(fvTMPId: Int)(fvpercId: String) = {
      val id = G.getIntOrZero(fvpercId)
      if(id != 0) {
        DBHelper.save(
          user,
          Register(
            C.FACTURA_VENTA_PERCEPCION_BORRADO_TMP,
            C.FVPERCB_TMP_ID,
            DBHelper.NoId,
            false,
            false,
            false,
            getDeletedPercepcionFields(id, fvTMPId)),
          true
        ) match {
          case SaveResult(false, id) => throwError
          case _ =>
        }
      }
    }

    def savePercepciones(fvTMPId: Int) = {
      facturaVenta.items.percepciones.map(percepcion => savePercepcion(FacturaVentaPercepcionInfo(fvTMPId, percepcion)))
      facturaVenta.items.percepcionDeleted.split(",").map(saveDeletedPercepcion(fvTMPId))
    }

    case class FacturaVentaRemitoInfo(fvTMPId: Int, item: FacturaVentaRemito)

    def saveRemito(itemInfo: FacturaVentaRemitoInfo) = {
      DBHelper.save(
        user,
        Register(
          C.REMITO_FACTURA_VENTA_TMP,
          C.RV_FV_TMP_ID,
          DBHelper.NoId,
          false,
          false,
          false,
          getRemitoFields(itemInfo.item, itemInfo.fvTMPId)),
        true
      ) match {
        case SaveResult(true, id) => true
        case SaveResult(false, id) => throwError
      }
    }

    def saveRemitos(fvTMPId: Int) = {
      facturaVenta.items.remitos.map(remito => saveRemito(FacturaVentaRemitoInfo(fvTMPId, remito)))
    }

    case class RowResult(rowType: String, id: Int, message: String)

    def saveFromWizard(fvTMPId: Int) = {

      DB.withTransaction(user.database.database) { implicit connection =>
        val sql = "select * from sp_doc_factura_venta_wizard_save(?)"
        val cs = connection.prepareStatement(sql)

        cs.setInt(1, fvTMPId)

        try {
          cs.executeQuery()
        } catch {
          case NonFatal(e) => {
            Logger.error(s"can't save ${C.FACTURA_VENTA} with id ${facturaVenta.id} for user ${user.toString}. Error ${e.toString}")
            throw e
          }
        } finally {
          cs.close
        }
      }
    }

    def executeSave(fvTMPId: Int): List[RowResult] = {

      DB.withTransaction(user.database.database) { implicit connection =>
        val sql = "select * from sp_doc_factura_venta_save(?, ?)"
        val cs = connection.prepareStatement(sql)

        cs.setInt(1, user.masterUserId)
        cs.setInt(2, fvTMPId)

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
          * ex: CREATE OR REPLACE FUNCTION sp_doc_factura_venta_save( params )
          *     RETURNS SETOF row_result AS ...
          *
          * the field type is used to identify the value in the row. there are three
          * kind of types: resultset, success, key
          * for first two (resultset and success) the value of type is string with
          * one of these two values ex: 'resultset' or 'success'
          * when type == 'resultset' the field r must be not null and contain a ResultSet
          * when type == 'success' the id field can contain 0 (False) or not 0 (-1,1 or any other number but NO 0) (True)
          * the last kind of type is key. in this case the key must be the name of a column like fv_id, as_id, pr_id, etc
          * it can be any column name. if the type is an integer like in fv_id, as_id or any other id column the field id
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
                case "fv_id" => RowResult("fv_id", rs.getInt(2), "")
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
            Logger.error(s"can't save ${C.FACTURA_VENTA} with id ${facturaVenta.id} for user ${user.toString}. Error ${e.toString}")
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
            case RowResult("fv_id", id, m) => id
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
        C.FACTURA_VENTA_TMP,
        C.FV_TMP_ID,
        DBHelper.NoId,
        false,
        true,
        true,
        getFields),
      true
    ) match {
      case SaveResult(true, fvTMPId) => {
        saveItems(fvTMPId)
        savePercepciones(fvTMPId)
        if(isFromWizard) saveFromWizard(fvTMPId)
        saveRemitos(fvTMPId)
        val messagesAndId = executeSave(fvTMPId)
        val id = getIdFromMessages(messagesAndId)
        load(user, id).getOrElse(throwError)
      }
      case SaveResult(false, id) => throwError
    }

  }

  def load(user: CompanyUser, id: Int): Option[FacturaVenta] = {

    DB.withTransaction(user.database.database) { implicit connection =>

      val sql = "{call sp_doc_factura_venta_get(?, ?, ?, ?)}"
      val cs = connection.prepareCall(sql)

      cs.setInt(1, user.cairoCompanyId)
      cs.setInt(2, id)
      cs.setInt(3, user.masterUserId)
      cs.registerOutParameter(4, Types.OTHER)

      try {
        cs.execute()

        val rs = cs.getObject(4).asInstanceOf[java.sql.ResultSet]
        Sql.as(facturaVentaParser.singleOpt, rs)

      } catch {
        case NonFatal(e) => {
          Logger.error(s"can't get ${C.FACTURA_VENTA} with id $id for user ${user.toString}. Error ${e.toString}")
          throw e
        }
      } finally {
        cs.close
      }
    }
  }

  private def loadFacturaVentaItems(user: CompanyUser, id: Int) = {
    val items = loadItems(user, id)
    FacturaVentaItems(
      items._1,
      items._2,
      items._3,
      loadPercepciones(user, id),
      "", "", List()
    )
  }

  private def loadItems(user: CompanyUser, id: Int) = {

    DB.withTransaction(user.database.database) { implicit connection =>

      val sql = "{call sp_doc_factura_venta_get_items(?, ?, ?, ?)}"
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
          Sql.as(facturaVentaItemParser.*, rs),
          Sql.as(facturaVentaItemSerieParser.*, rsSerie),
          Sql.as(facturaVentaItemKitParser.*, rsKit)
        )

      } catch {
        case NonFatal(e) => {
          Logger.error(s"can't get ${C.FACTURA_VENTA_ITEM} with id $id for user ${user.toString}. Error ${e.toString}")
          throw e
        }
      } finally {
        cs.close
      }
    }
  }

  private def loadPercepciones(user: CompanyUser, id: Int) = {

    DB.withTransaction(user.database.database) { implicit connection =>

      val sql = "{call sp_doc_factura_venta_get_percepciones(?, ?)}"
      val cs = connection.prepareCall(sql)

      cs.setInt(1, id)
      cs.registerOutParameter(2, Types.OTHER)

      try {
        cs.execute()

        val rs = cs.getObject(2).asInstanceOf[java.sql.ResultSet]
        Sql.as(facturaVentaPercepcionParser.*, rs)

      } catch {
        case NonFatal(e) => {
          Logger.error(s"can't get ${C.FACTURA_VENTA_PERCEPCION} with id $id for user ${user.toString}. Error ${e.toString}")
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
        SQL("sp_doc_factura_venta_delete {id}, {empId}, {usId}")
          .on('id -> id, 'empId -> user.cairoCompanyId, 'usId -> user.masterUserId)
          .executeUpdate
      } catch {
        case NonFatal(e) => {
          Logger.error(s"can't delete a ${C.FACTURA_VENTA}. ${C.FV_ID} id: $id. Error ${e.toString}")
          throw e
        }
      }
    }
  }

  def get(user: CompanyUser, id: Int): FacturaVenta = {
    load(user, id) match {
      case Some(p) => {
        FacturaVenta(
          p.id,

          p.ids,
          p.base,
          p.references,
          p.dates,
          p.precios,
          p.cotizacion,
          p.stock,
          p.totals,

          loadFacturaVentaItems(user, id)
        )
      }
      case None => emptyFacturaVenta
    }
  }

  val K_FECHA_INI = 1
  val K_FECHA_FIN = 2
  val K_CLI_ID    = 4
  val K_EST_ID    = 5
  val K_CCOS_ID   = 6
  val K_SUC_ID    = 7
  val K_VEN_ID    = 8
  val K_DOC_ID    = 9
  val K_CPG_ID    = 10
  val K_EMP_ID    = 100

  def saveParams(user: CompanyUser, facturaVentaParams: FacturaVentaParams): FacturaVentaParams = {
    val baseFields = List(
      Field(GC.EMP_ID, user.cairoCompanyId, FieldType.id),
      Field(GC.US_ID, user.masterUserId, FieldType.id),
      Field(GC.PRE_ID, S.LIST_FACTURA_VENTA, FieldType.id)
    )

    def throwException = {
      throw new RuntimeException(s"Error when saving ${C.FACTURA_VENTA}")
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
        Field(GC.LDP_VALOR, facturaVentaParams.from, FieldType.text)
      ),
      List(
        Field(GC.LDP_ID, K_FECHA_FIN, FieldType.integer),
        Field(GC.LDP_ORDEN, 10, FieldType.integer),
        Field(GC.LDP_VALOR, facturaVentaParams.to, FieldType.text)
      ),
      List(
        Field(GC.LDP_ID, K_CLI_ID, FieldType.integer),
        Field(GC.LDP_ORDEN, 20, FieldType.integer),
        Field(GC.LDP_VALOR, facturaVentaParams.cliId, FieldType.text)
      ),
      List(
        Field(GC.LDP_ID, K_EST_ID, FieldType.integer),
        Field(GC.LDP_ORDEN, 30, FieldType.integer),
        Field(GC.LDP_VALOR, facturaVentaParams.estId, FieldType.text)
      ),
      List(
        Field(GC.LDP_ID, K_CCOS_ID, FieldType.integer),
        Field(GC.LDP_ORDEN, 40, FieldType.integer),
        Field(GC.LDP_VALOR, facturaVentaParams.ccosId, FieldType.text)
      ),
      List(
        Field(GC.LDP_ID, K_SUC_ID, FieldType.integer),
        Field(GC.LDP_ORDEN, 50, FieldType.integer),
        Field(GC.LDP_VALOR, facturaVentaParams.sucId, FieldType.text)
      ),
      List(
        Field(GC.LDP_ID, K_DOC_ID, FieldType.integer),
        Field(GC.LDP_ORDEN, 60, FieldType.integer),
        Field(GC.LDP_VALOR, facturaVentaParams.docId, FieldType.text)
      ),
      List(
        Field(GC.LDP_ID, K_CPG_ID, FieldType.integer),
        Field(GC.LDP_ORDEN, 70, FieldType.integer),
        Field(GC.LDP_VALOR, facturaVentaParams.cpgId, FieldType.text)
      ),
      List(
        Field(GC.LDP_ID, K_EMP_ID, FieldType.integer),
        Field(GC.LDP_ORDEN, 80, FieldType.integer),
        Field(GC.LDP_VALOR, facturaVentaParams.empId, FieldType.text)
      )
    )

    DB.withConnection(user.database.database) { implicit connection =>
      try {
        SQL(s"""DELETE FROM ListaDocumentoParametro
              | WHERE pre_id = {preId}
              | AND (emp_id is null or emp_id = {empId})
              | AND us_id = {usId}""".stripMargin)
          .on(
            'preId -> S.LIST_FACTURA_VENTA,
            'empId -> user.cairoCompanyId,
            'usId -> user.masterUserId
          )
          .executeUpdate
      } catch {
        case NonFatal(e) => {
          Logger.error(s"can't save parameters for FacturaVenta")
          throw e
        }
      }
    }

    paramList.map(param => saveParam(baseFields ::: param))

    loadParams(user).getOrElse(throwException)
  }

  def loadParams(user: CompanyUser): Option[FacturaVentaParams] = {

    val params = DocumentListParam.load(user, S.LIST_FACTURA_VENTA)

    if(params.isEmpty) {
      Some(emptyFacturaVentaParams)
    }
    else {
      val cli = DocumentListParam.getParamValue(
        user, K_CLI_ID, params, emptyFacturaVentaParams.cliId,
        GC.CLIENTE, GC.CLI_ID, GC.CLI_NAME
      )
      val est = DocumentListParam.getParamValue(
        user, K_EST_ID, params, emptyFacturaVentaParams.estId,
        GC.ESTADO, GC.EST_ID, GC.EST_NAME
      )
      val ccos = DocumentListParam.getParamValue(
        user, K_CCOS_ID, params, emptyFacturaVentaParams.ccosId,
        GC.CENTRO_COSTO, GC.CCOS_ID, GC.CCOS_NAME
      )
      val suc = DocumentListParam.getParamValue(
        user, K_SUC_ID, params, emptyFacturaVentaParams.sucId,
        GC.SUCURSAL, GC.SUC_ID, GC.SUC_NAME
      )
      val ven = DocumentListParam.getParamValue(
        user, K_VEN_ID, params, emptyFacturaVentaParams.venId,
        GC.VENDEDOR, GC.VEN_ID, GC.VEN_NAME
      )
      val doc = DocumentListParam.getParamValue(
        user, K_DOC_ID, params, emptyFacturaVentaParams.docId,
        GC.DOCUMENTO, GC.DOC_ID, GC.DOC_NAME
      )
      val cpg = DocumentListParam.getParamValue(
        user, K_CPG_ID, params, emptyFacturaVentaParams.cpgId,
        GC.CONDICION_PAGO, GC.CPG_ID, GC.CPG_NAME
      )
      val emp = DocumentListParam.getParamValue(
        user, K_EMP_ID, params, emptyFacturaVentaParams.empId,
        GC.EMPRESA, GC.EMP_ID, GC.EMP_NAME
      )

      Some(
        FacturaVentaParams(
          DocumentListParam.getParamValue(K_FECHA_INI, params, emptyFacturaVentaParams.from),
          DocumentListParam.getParamValue(K_FECHA_FIN, params, emptyFacturaVentaParams.to),
          cli.id,
          cli.value,
          est.id,
          est.value,
          ccos.id,
          ccos.value,
          suc.id,
          suc.value,
          ven.id,
          ven.value,
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
           venId: Option[String],
           docId: Option[String],
           cpgId: Option[String],
           empId: Option[String]): Recordset = {

    DB.withTransaction(user.database.database) { implicit connection =>

      val sql = "{call sp_lsdoc_facturas_venta(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)}"
      val cs = connection.prepareCall(sql)

      cs.setInt(1, user.masterUserId)
      cs.setDate(2, new java.sql.Date(from.getTime()))
      cs.setDate(3, new java.sql.Date(to.getTime()))
      cs.setString(4, cliId.getOrElse("0"))
      cs.setString(5, estId.getOrElse("0"))
      cs.setString(6, ccosId.getOrElse("0"))
      cs.setString(7, sucId.getOrElse("0"))
      cs.setString(8, venId.getOrElse("0"))
      cs.setString(9, docId.getOrElse("0"))
      cs.setString(10, cpgId.getOrElse("0"))
      cs.setString(11, empId.getOrElse("0"))
      cs.registerOutParameter(12, Types.OTHER)

      try {
        cs.execute()

        val rs = cs.getObject(12).asInstanceOf[java.sql.ResultSet]
        Recordset.load(rs)

      } catch {
        case NonFatal(e) => {
          Logger.error(s"can't get listing of facturas de venta for user ${user.toString}. Error ${e.toString}")
          throw e
        }
      } finally {
        cs.close
      }
    }
  }

  def listRemitos(user: CompanyUser, cliId: Int, currencyId: Int): Recordset = {

    DB.withTransaction(user.database.database) { implicit connection =>

      val sql = "{call sp_doc_factura_venta_get_remitos(?, ?, ?, ?)}"
      val cs = connection.prepareCall(sql)

      cs.setInt(1, user.cairoCompanyId)
      cs.setInt(2, cliId)
      cs.setInt(3, currencyId)
      cs.registerOutParameter(4, Types.OTHER)

      try {
        cs.execute()

        val rs = cs.getObject(4).asInstanceOf[java.sql.ResultSet]
        Recordset.load(rs)

      } catch {
        case NonFatal(e) => {
          Logger.error(s"can't get listing of remitos de venta for provider [$cliId] and currency [$currencyId] and user ${user.toString}. Error ${e.toString}")
          throw e
        }
      } finally {
        cs.close
      }
    }
  }

  def listRemitosItems(user: CompanyUser, ids: String): Recordset = {

    DB.withTransaction(user.database.database) { implicit connection =>

      val sql = "{call sp_doc_factura_venta_get_remitos_items(?, ?)}"
      val cs = connection.prepareCall(sql)

      cs.setString(1, ids)
      cs.registerOutParameter(2, Types.OTHER)

      try {
        cs.execute()

        val rs = cs.getObject(2).asInstanceOf[java.sql.ResultSet]
        Recordset.load(rs)

      } catch {
        case NonFatal(e) => {
          Logger.error(s"can't get listing of remitos de venta's items for list [$ids] and user ${user.toString}. Error ${e.toString}")
          throw e
        }
      } finally {
        cs.close
      }
    }
  }

  def getAplic(user: CompanyUser, id: Int, aplicType: Int): Recordset = {

    DB.withTransaction(user.database.database) { implicit connection =>

      val sql = "{call sp_doc_factura_venta_get_aplic(?, ?, ?, ?)}"
      val cs = connection.prepareCall(sql)

      cs.setInt(1, user.cairoCompanyId)
      cs.setInt(2, id)
      cs.setInt(3, aplicType)
      cs.registerOutParameter(4, Types.OTHER)

      try {
        cs.execute()

        val rs = cs.getObject(4).asInstanceOf[java.sql.ResultSet]
        Recordset.load(rs)

      } catch {
        case NonFatal(e) => {
          Logger.error(s"can't get aplic list for id [$id] and user ${user.toString}. Error ${e.toString}")
          throw e
        }
      } finally {
        cs.close
      }
    }
  }

  def isPaymentInCash(user: CompanyUser, id: Int): Boolean = {
    DB.withTransaction(user.database.database) { implicit connection =>

      val sql = "{call sp_doc_es_cobranza_cdo(?, ?)}"
      val cs = connection.prepareCall(sql)

      cs.setInt(1, id)
      cs.registerOutParameter(2, Types.INTEGER)

      try {
        cs.execute()
        cs.getInt(2) != 0

      } catch {
        case NonFatal(e) => {
          Logger.error(s"can't get if payment is in cash for id [$id] and user ${user.toString}. Error ${e.toString}")
          throw e
        }
      } finally {
        cs.close
      }
    }
  }

  def getCtaCteCuenta(user: CompanyUser, id: Int): (Int, Int) = {

    DB.withTransaction(user.database.database) { implicit connection =>

      val sql = "{call sp_doc_factura_venta_get_cuenta_deudor(?, ?, ?)}"
      val cs = connection.prepareCall(sql)

      cs.setInt(1, id)
      cs.registerOutParameter(2, Types.INTEGER)
      cs.registerOutParameter(3, Types.INTEGER)

      try {
        cs.execute()
        (cs.getInt(2), cs.getInt(3))

      } catch {
        case NonFatal(e) => {
          Logger.error(s"can't get cuenta of Cta.Cte. for id [$id] and user ${user.toString}. Error ${e.toString}")
          throw e
        }
      } finally {
        cs.close
      }
    }
  }

  def saveAplic(user: CompanyUser, facturaVentaAplic: FacturaVentaAplic): Int = {
    def getFields = {
      List(
        Field(C.FV_ID, facturaVentaAplic.fvId, FieldType.number),
        Field(C.FV_NUMERO, facturaVentaAplic.fvId, FieldType.number),
        Field(GC.DOC_ID, facturaVentaAplic.docId, FieldType.id),
        Field(GC.EST_ID, DocumentEditStatus.PENDING, FieldType.id),
        Field(GC.SUC_ID, DBHelper.NoId, FieldType.number),
        Field(GC.CLI_ID, DBHelper.NoId, FieldType.number),
        Field(GC.CPG_ID, CondicionPago.FECHA_DOCUMENTO, FieldType.id)
      )
    }

    def getNotaCreditoFields(item: FacturaVentaNotaCreditoItem, fvTMPId: Int) = {
      List(
        Field(C.FV_TMP_ID, fvTMPId, FieldType.id),
        Field(TC.FV_ID_NOTA_CREDITO, item.fvIdNotaCredito, FieldType.number),
        Field(TC.FV_ID_FACTURA, item.fvIdFactura, FieldType.number),
        Field(TC.FVD_ID_NOTA_CREDITO, item.fvdIdNotaCredito, FieldType.number),
        Field(TC.FVD_ID_FACTURA, item.fvdIdFactura, FieldType.number),
        Field(TC.FVP_ID_NOTA_CREDITO, item.fvpIdNotaCredito, FieldType.number),
        Field(TC.FVP_ID_FACTURA, item.fvpIdFactura, FieldType.number),
        Field(TC.FV_NC_IMPORTE, item.fvncImporte, FieldType.currency),
        Field(TC.FV_NC_ID, item.fvncId, FieldType.number)
      )
    }

    def getCobranzaFields(item: FacturaVentaCobranzaItem, fvTMPId: Int) = {
      List(
        Field(C.FV_TMP_ID, fvTMPId, FieldType.id),
        Field(TC.COBZ_ID, item.cobzId, FieldType.number),
        Field(TC.COBZ_NUMERO, 0, FieldType.number),
        Field(GC.CLI_ID, DBHelper.NoId, FieldType.number),
        Field(GC.SUC_ID, DBHelper.NoId, FieldType.number),
        Field(GC.DOC_ID, DBHelper.NoId, FieldType.number),
        Field(GC.EST_ID, DBHelper.NoId, FieldType.number)
      )
    }

    def getCobranzaItemFields(item: CobranzaItem, cobzTMPId: Int) = {
      List(
        Field(TC.COBZ_TMP_ID, cobzTMPId, FieldType.id),
        Field(TC.COBZ_ID, item.cobzId, FieldType.id),
        Field(TC.FV_ID, item.fvId, FieldType.id),
        Field(TC.FVD_ID, item.fvdId, FieldType.id),
        Field(TC.FVP_ID, item.fvpId, FieldType.id),
        Field(TC.FV_COBZ_ID, item.fvcobzId, FieldType.long),
        Field(TC.FV_COBZ_COTIZACION, item.fvcobzCotizacion, FieldType.currency),
        Field(TC.FV_COBZ_IMPORTE, item.fvcobzImporte, FieldType.currency),
        Field(TC.FV_COBZ_IMPORTE_ORIGEN, item.fvcobzImporteOrigen, FieldType.currency)
      )
    }

    def getCobranzaCtaCteFields(item: CobranzaCtaCte, cobzTMPId: Int) = {
      List(
        Field(TC.COBZ_TMP_ID, cobzTMPId, FieldType.id),
        Field(GC.CUE_ID, item.cueId, FieldType.number),
        Field(TC.COBZI_IMPORTE_ORIGEN, item.cobziImporteOrigen, FieldType.currency),
        Field(TC.COBZI_IMPORTE, item.cobziImporte, FieldType.currency),
        Field(TC.COBZI_ORDEN, item.cobziOrden, FieldType.number),
        Field(TC.COBZI_TIPO, item.cobziTipo, FieldType.number),
        Field(TC.COBZI_OTRO_TIPO, item.cobziOtroTipo, FieldType.number)
      )
    }

    def getPedidoVentaFields(item: FacturaVentaPedidoVentaItem, fvTMPId: Int) = {
      List(
        Field(C.FV_TMP_ID, fvTMPId, FieldType.id),
        Field(C.PVI_ID, item.pviId, FieldType.id),
        Field(C.FVI_ID, item.fviId, FieldType.id),
        Field(C.PV_FV_CANTIDAD, item.pvfvCantidad, FieldType.currency),
        Field(C.PV_FV_ID, item.pvfvId, FieldType.id)
      )
    }

    def getRemitoVentaFields(item: FacturaVentaRemitoVentaItem, fvTMPId: Int) = {
      List(
        Field(C.FV_TMP_ID, fvTMPId, FieldType.id),
        Field(C.RVI_ID, item.rviId, FieldType.number),
        Field(C.FVI_ID, item.fviId, FieldType.number),
        Field(C.RV_FV_CANTIDAD, item.rvfvCantidad, FieldType.currency),
        Field(C.RV_FV_ID, item.rvfvId, FieldType.number)
      )
    }

    def throwError = {
      throwException(s"Error when saving application of ${C.FACTURA_VENTA}")
    }

    def throwException(message: String) = {
      throw new RuntimeException(message)
    }

    case class NotaCreditoItemInfo(fvTMPId: Int, item: FacturaVentaNotaCreditoItem)

    def saveNotaCredito(itemInfo: NotaCreditoItemInfo) = {
      DBHelper.save(
        user,
        Register(
          TC.FACTURA_VENTA_NOTA_CREDITO_TMP,
          TC.FV_NC_TMP_ID,
          DBHelper.NoId,
          false,
          false,
          false,
          getNotaCreditoFields(itemInfo.item, itemInfo.fvTMPId)),
        true
      ) match {
        case SaveResult(true, id) => true
        case SaveResult(false, id) => throwError
      }
    }

    def saveNotasCredito(fvTMPId: Int) = {
      facturaVentaAplic.notaCredito.map(item => saveNotaCredito(NotaCreditoItemInfo(fvTMPId, item)))
    }

    case class CobranzaItemInfo(cobzTMPId: Int, item: CobranzaItem)

    def saveCobranzaItem(itemInfo: CobranzaItemInfo) = {
      DBHelper.save(
        user,
        Register(
          TC.FACTURA_VENTA_COBRANZA_TMP,
          TC.FV_COBZ_TMP_ID,
          DBHelper.NoId,
          false,
          false,
          false,
          getCobranzaItemFields(itemInfo.item, itemInfo.cobzTMPId)),
        true
      ) match {
        case SaveResult(true, id) => true
        case SaveResult(false, id) => throwError
      }
    }

    def saveCobranzaItems(items: List[CobranzaItem], cobzTMPId: Int) = {
      items.map(item => saveCobranzaItem(CobranzaItemInfo(cobzTMPId, item)))
    }

    case class CobranzaCtaCteInfo(cobzTMPId: Int, item: CobranzaCtaCte)

    def saveCobranzaCtaCte(itemInfo: CobranzaCtaCteInfo) = {
      DBHelper.save(
        user,
        Register(
          TC.COBRANZA_ITEM_TMP,
          TC.COBZI_TMP_ID,
          DBHelper.NoId,
          false,
          false,
          false,
          getCobranzaCtaCteFields(itemInfo.item, itemInfo.cobzTMPId)),
        true
      ) match {
        case SaveResult(true, id) => true
        case SaveResult(false, id) => throwError
      }
    }

    def saveCobranzaCtasCtes(items: List[CobranzaCtaCte], cobzTMPId: Int) = {
      items.map(item => saveCobranzaCtaCte(CobranzaCtaCteInfo(cobzTMPId, item)))
    }

    case class CobranzaInfo(fvTMPId: Int, item: FacturaVentaCobranzaItem)

    def saveCobranza(itemInfo: CobranzaInfo) = {
      DBHelper.save(
        user,
        Register(
          TC.COBRANZA_TMP,
          TC.COBZ_TMP_ID,
          DBHelper.NoId,
          false,
          false,
          true,
          getCobranzaFields(itemInfo.item, itemInfo.fvTMPId)),
        true
      ) match {
        case SaveResult(true, id) => {
          Logger.info(s"items ${itemInfo.item.items}")
          Logger.info(s"ctacte ${itemInfo.item.ctaCte}")
          saveCobranzaItems(itemInfo.item.items, id)
          saveCobranzaCtasCtes(itemInfo.item.ctaCte, id)
        }
        case SaveResult(false, id) => throwError
      }
    }

    def saveCobranzasPago(fvTMPId: Int) = {
      facturaVentaAplic.cobranza.map(item => saveCobranza(CobranzaInfo(fvTMPId, item)))
    }

    case class PedidoVentaInfo(fvTMPId: Int, item: FacturaVentaPedidoVentaItem)

    def savePedidoVenta(itemInfo: PedidoVentaInfo) = {
      DBHelper.save(
        user,
        Register(
          C.PEDIDO_FACTURA_VENTA_TMP,
          C.PV_FV_TMP_ID,
          DBHelper.NoId,
          false,
          false,
          false,
          getPedidoVentaFields(itemInfo.item, itemInfo.fvTMPId)),
        true
      ) match {
        case SaveResult(true, id) => true
        case SaveResult(false, id) => throwError
      }
    }

    def savePedidosVenta(fvTMPId: Int) = {
      facturaVentaAplic.pedidoVenta.map(item => savePedidoVenta(PedidoVentaInfo(fvTMPId, item)))
    }

    case class RemitoVentaInfo(fvTMPId: Int, item: FacturaVentaRemitoVentaItem)

    def saveRemitoVenta(itemInfo: RemitoVentaInfo) = {
      DBHelper.save(
        user,
        Register(
          C.REMITO_FACTURA_VENTA_TMP,
          C.RV_FV_TMP_ID,
          DBHelper.NoId,
          false,
          false,
          false,
          getRemitoVentaFields(itemInfo.item, itemInfo.fvTMPId)),
        true
      ) match {
        case SaveResult(true, id) => true
        case SaveResult(false, id) => throwError
      }
    }

    def saveRemitosVenta(fvTMPId: Int) = {
      facturaVentaAplic.remitoVenta.map(item => saveRemitoVenta(RemitoVentaInfo(fvTMPId, item)))
    }

    case class RowResult(rowType: String, id: Int, message: String)

    def executeSave(fvTMPId: Int): List[RowResult] = {

      DB.withTransaction(user.database.database) { implicit connection =>
        val sql = "select * from sp_doc_factura_venta_save_aplic(?, ?)"
        val cs = connection.prepareStatement(sql)

        cs.setInt(1, user.masterUserId)
        cs.setInt(2, fvTMPId)

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
          * ex: CREATE OR REPLACE FUNCTION sp_doc_factura_venta_save( params )
          *     RETURNS SETOF row_result AS ...
          *
          * the field type is used to identify the value in the row. there are three
          * kind of types: resultset, success, key
          * for first two (resultset and success) the value of type is string with
          * one of these two values ex: 'resultset' or 'success'
          * when type == 'resultset' the field r must be not null and contain a ResultSet
          * when type == 'success' the id field can contain 0 (False) or not 0 (-1,1 or any other number but NO 0) (True)
          * the last kind of type is key. in this case the key must be the name of a column like fv_id, as_id, pr_id, etc
          * it can be any column name. if the type is an integer like in fv_id, as_id or any other id column the field id
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
                case "fv_id" => RowResult("fv_id", rs.getInt(2), "")
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
            Logger.error(s"can't save application of ${C.FACTURA_VENTA} with id ${facturaVentaAplic.fvId} for user ${user.toString}. Error ${e.toString}")
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
            case RowResult("fv_id", id, m) => id
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
        C.FACTURA_VENTA_TMP,
        C.FV_TMP_ID,
        DBHelper.NoId,
        false,
        true,
        true,
        getFields),
      true
    ) match {
      case SaveResult(true, fvTMPId) => {
        saveNotasCredito(fvTMPId)
        saveCobranzasPago(fvTMPId)
        savePedidosVenta(fvTMPId)
        saveRemitosVenta(fvTMPId)
        val messagesAndId = executeSave(fvTMPId)
        getIdFromMessages(messagesAndId)
      }
      case SaveResult(false, id) => throwError
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