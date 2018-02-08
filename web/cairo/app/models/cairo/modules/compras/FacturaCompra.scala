package models.cairo.modules.compras

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

case class FacturaCompraId(
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

object FacturaCompraId {

  def apply(
             docId: Int,
             numero: Int,
             nroDoc: String) = {

    new FacturaCompraId(
      docId,
      numero,
      nroDoc)
  }
}

case class FacturaCompraReferences(
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

object FacturaCompraReferences {

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

    new FacturaCompraReferences(
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

case class FacturaCompraBase(
                              provId: Int,
                              provName: String,
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
                              cai: String,
                              tipoComprobante: Int,
                              descrip: String,
                              grabarAsiento: Boolean
                            ) {
  def this(
            provId: Int,
            estId: Int,
            ccosId: Int,
            sucId: Int,
            cpgId: Int,
            lgjId: Int,
            cai: String,
            tipoComprobante: Int,
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
      cpgId,
      "",
      lgjId,
      "",
      cai,
      tipoComprobante,
      descrip,
      grabarAsiento
    )
  }
}

object FacturaCompraBase {

  def apply(
             provId: Int,
             estId: Int,
             ccosId: Int,
             sucId: Int,
             cpgId: Int,
             lgjId: Int,
             cai: String,
             tipoComprobante: Int,
             descrip: String,
             grabarAsiento: Boolean) = {

    new FacturaCompraBase(
      provId,
      estId,
      ccosId,
      sucId,
      cpgId,
      lgjId,
      cai,
      tipoComprobante,
      descrip,
      grabarAsiento)
  }
}

case class FacturaCompraCotizacion(
                                    cotizacion: Double,
                                    cotizacionProveedor: Double
                                  )

case class FacturaCompraPrecios(
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

object FacturaCompraPrecios {

  def apply(
             desc1: Double,
             desc2: Double,
             lpId: Int,
             ldId: Int) = {

    new FacturaCompraPrecios(
      desc1,
      desc2,
      lpId,
      ldId)
  }
}

case class FacturaCompraDates(
                               fecha: Date,
                               fechaEntrega: Date,
                               fechaIva: Date,
                               fechaVto: Date
                             )

case class FacturaCompraStock(
                               proIdOrigen: Int,
                               proNameOrigen: String,
                               proIdDestino: Int,
                               proNameDestino: String,
                               deplId: Int,
                               deplName: String
                             ) {
  def this(
            proIdOrigen: Int,
            proIdDestino: Int,
            deplId: Int
            ) = {
    this(
      proIdOrigen,
      "",
      proIdDestino,
      "",
      deplId,
      ""
    )
  }
}

object FacturaCompraStock {

  def apply(
             proIdOrigen: Int,
             proIdDestino: Int,
             deplId: Int) = {

    new FacturaCompraStock(
      proIdOrigen,
      proIdDestino,
      deplId)
  }
}

case class FacturaCompraTotals(
                                neto: Double,
                                ivaRi: Double,
                                ivaRni: Double,
                                internos: Double,
                                subTotal: Double,
                                importeDesc1: Double,
                                importeDesc2: Double,
                                totalOtros: Double,
                                totalPercepciones: Double,
                                total: Double,
                                totalOrigen: Double
                              )

case class FacturaCompraItemBase(
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
                                   unName: String
                                   )

object FacturaCompraItemBase {

  def apply(descrip: String,
            descuento: String,
            prId: Int,
            ccosId: Int,
            toId: Int,
            cueId: Int,
            cueIdIvaRi: Int,
            cueIdIvaRni: Int,
            stlId: Int,
            stlCode: String,
            orden: Int) = {

    new FacturaCompraItemBase(
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
      stlCode,
      orden,
      false,
      false,
      ""
    )
  }
}

case class FacturaCompraItemTotals(
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

object FacturaCompraItemTotals {

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

    new FacturaCompraItemTotals(
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

case class FacturaCompraItemSerie(
                                   id: Int,
                                   code: String,
                                   descrip: String,
                                   fechaVto: Date,
                                   fciId: Int
                                   )

case class FacturaCompraItem(
                              id: Int,
                              base: FacturaCompraItemBase,
                              totals: FacturaCompraItemTotals,
                              series: List[FacturaCompraItemSerie], /* only used in save */
                              serieDeleted: String /* only used in save */
                            )

case class FacturaCompraOtro(
                              id: Int,
                              cueId: Int,
                              cueName: String,
                              debe: Double,
                              haber: Double,
                              ccosId: Int,
                              ccosName: String,
                              descrip: String,
                              origen: Double,
                              orden: Int
                            )

object FacturaCompraOtro {

  def apply(id: Int,
            cueId: Int,
            debe: Double,
            haber: Double,
            ccosId: Int,
            descrip: String,
            origen: Double,
            orden: Int) = {

    new FacturaCompraOtro(
      id,
      cueId,
      "",
      debe,
      haber,
      ccosId,
      "",
      descrip,
      origen,
      orden
    )
  }
}

case class FacturaCompraLegajo(
                                id: Int,
                                lgjId: Int,
                                lgjCode: String,
                                importe: Double,
                                descrip: String,
                                importeOrigen: Double,
                                orden: Int
                              )

object FacturaCompraLegajo {

  def apply(
             id: Int,
             lgjId: Int,
             importe: Double,
             descrip: String,
             importeOrigen: Double,
             orden: Int) = {

    new FacturaCompraLegajo(
      id,
      lgjId,
      "",
      importe,
      descrip,
      importeOrigen,
      orden
    )
  }
}

case class FacturaCompraPercepcion(
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

object FacturaCompraPercepcion {

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

    new FacturaCompraPercepcion(
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

case class FacturaCompraRemito(
                                rciId: Int,
                                cantidad: Double,
                                fciId: Int
                                )

case class FacturaCompraItems(
                                items: List[FacturaCompraItem],
                                series: List[FacturaCompraItemSerie], /* only used when loading an invoice to respond a get FacturaCompra */
                                otros: List[FacturaCompraOtro],
                                legajos: List[FacturaCompraLegajo],
                                percepciones: List[FacturaCompraPercepcion],

                                /* only used in save */
                                itemDeleted: String,
                                otroDeleted: String,
                                legajoDeleted: String,
                                percepcionDeleted: String,

                                remitos: List[FacturaCompraRemito]
                             )

case class FacturaCompra(
                          id: Int,

                          ids: FacturaCompraId,
                          base: FacturaCompraBase,
                          references: FacturaCompraReferences,
                          dates: FacturaCompraDates,
                          precios: FacturaCompraPrecios,
                          cotizacion: FacturaCompraCotizacion,
                          stock: FacturaCompraStock,
                          totals: FacturaCompraTotals,

                          items: FacturaCompraItems,

                          createdAt: Date,
                          updatedAt: Date,
                          updatedBy: Int
                        ) {

  def this(
            id: Int,

            ids: FacturaCompraId,
            base: FacturaCompraBase,
            references: FacturaCompraReferences,
            dates: FacturaCompraDates,
            precios: FacturaCompraPrecios,
            cotizacion: FacturaCompraCotizacion,
            stock: FacturaCompraStock,
            totals: FacturaCompraTotals,

            items: FacturaCompraItems) = {

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
            ids: FacturaCompraId,
            base: FacturaCompraBase,
            references: FacturaCompraReferences,
            dates: FacturaCompraDates,
            precios: FacturaCompraPrecios,
            cotizacion: FacturaCompraCotizacion,
            stock: FacturaCompraStock,
            totals: FacturaCompraTotals,

            items: FacturaCompraItems) = {

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

case class FacturaCompraParams(
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
                                cpgId: String,
                                cpgName: String,
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
            cpgId: String,
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
      cpgId,
      "",
      empId,
      ""
    )
  }
}

object FacturaCompraParams {
  def apply(
             from: String,
             to: String,
             provId: String,
             estId: String,
             ccosId: String,
             sucId: String,
             docId: String,
             cpgId: String,
             empId: String
             ) = {

    new FacturaCompraParams(
      from,
      to,
      provId,
      estId,
      ccosId,
      sucId,
      docId,
      cpgId,
      empId
    )
  }
}

case class FacturaCompraNotaCreditoItem(
                                         fcIdNotaCredito: Int,
                                         fcIdFactura: Int,
                                         fcdIdNotaCredito: Int,
                                         fcdIdFactura: Int,
                                         fcpIdNotaCredito: Int,
                                         fcpIdFactura: Int,
                                         fcncImporte: Double,
                                         fcncId: Int
                                         )

case class PagoItem(
                     opgId: Int,
                     fcId: Int,
                     fcdId: Int,
                     fcpId: Int,
                     fcopgId: Int,
                     fcopgCotizacion: Double,
                     fcopgImporte: Double,
                     fcopgImporteOrigen: Double
                     )

case class PagoCtaCte(
                       cueId: Int,
                       opgiImporteOrigen: Double,
                       opgiImporte: Double,
                       opgiOrden: Int,
                       opgiTipo: Int,
                       opgiOtroTipo: Int
                       )

case class FacturaCompraOrdenPagoItem(
                                       opgId: Int,
                                       items: List[PagoItem],
                                       ctaCte: List[PagoCtaCte]
                                       )

case class FacturaCompraOrdenCompraItem(
                                         ociId: Int,
                                         fciId: Int,
                                         ocfcCantidad: Double,
                                         ocfcId: Int
                                         )

case class FacturaCompraRemitoCompraItem(
                                          rciId: Int,
                                          fciId: Int,
                                          rcfcCantidad: Double,
                                          rcfcId: Int
                                          )

case class FacturaCompraAplic(
                               fcId: Int,
                               docId: Int,
                               notaCredito: List[FacturaCompraNotaCreditoItem],
                               ordenPago: List[FacturaCompraOrdenPagoItem],
                               ordenCompra: List[FacturaCompraOrdenCompraItem],
                               remitoCompra: List[FacturaCompraRemitoCompraItem]
                             )

object FacturaCompra {

  lazy val GC = models.cairo.modules.general.C
  lazy val TC = models.cairo.modules.tesoreria.C

  lazy val emptyFacturaCompraItems = FacturaCompraItems(List(), List(), List(), List(), List(), "", "", "", "", List())

  lazy val emptyFacturaCompraReferences = FacturaCompraReferences(
    DBHelper.NoId, DBHelper.NoId, "", false, false, false, 0, DBHelper.NoId, DBHelper.NoId, false, false, false, "")

  lazy val emptyFacturaCompra = FacturaCompra(
    FacturaCompraId(DBHelper.NoId, 0, ""),
    FacturaCompraBase(DBHelper.NoId, DBHelper.NoId, DBHelper.NoId, DBHelper.NoId, DBHelper.NoId, DBHelper.NoId, "", 0, "", false),
    emptyFacturaCompraReferences,
    FacturaCompraDates(U.NO_DATE, U.NO_DATE, U.NO_DATE, U.NO_DATE),
    FacturaCompraPrecios(0.0, 0.0, DBHelper.NoId, DBHelper.NoId),
    FacturaCompraCotizacion(0,0),
    FacturaCompraStock(DBHelper.NoId, DBHelper.NoId, DBHelper.NoId),
    FacturaCompraTotals(0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0),
    emptyFacturaCompraItems
  )

  lazy val emptyFacturaCompraParams = FacturaCompraParams(
    DateFormatter.format(DateUtil.plusDays(DateUtil.currentTime, -60)),
    DateFormatter.format(DateUtil.currentTime), "0", "", "0", "", "0", "", "0", "", "0", "", "0", "", "0", "")

  def apply(
             id: Int,

             ids: FacturaCompraId,
             base: FacturaCompraBase,
             references: FacturaCompraReferences,
             dates: FacturaCompraDates,
             precios: FacturaCompraPrecios,
             cotizacion: FacturaCompraCotizacion,
             stock: FacturaCompraStock,
             totals: FacturaCompraTotals,

             items: FacturaCompraItems
             ) = {

    new FacturaCompra(
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

             ids: FacturaCompraId,
             base: FacturaCompraBase,
             references: FacturaCompraReferences,
             dates: FacturaCompraDates,
             precios: FacturaCompraPrecios,
             cotizacion: FacturaCompraCotizacion,
             stock: FacturaCompraStock,
             totals: FacturaCompraTotals
             ) = {

    new FacturaCompra(
      id,

      ids,
      base,
      references,
      dates,
      precios,
      cotizacion,
      stock,
      totals,

      emptyFacturaCompraItems
    )
  }

  def apply(
             ids: FacturaCompraId,
             base: FacturaCompraBase,
             references: FacturaCompraReferences,
             dates: FacturaCompraDates,
             precios: FacturaCompraPrecios,
             cotizacion: FacturaCompraCotizacion,
             stock: FacturaCompraStock,
             totals: FacturaCompraTotals,

             items: FacturaCompraItems
             ) = {

    new FacturaCompra(
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
             ids: FacturaCompraId,
             base: FacturaCompraBase,
             references: FacturaCompraReferences,
             dates: FacturaCompraDates,
             precios: FacturaCompraPrecios,
             cotizacion: FacturaCompraCotizacion,
             stock: FacturaCompraStock,
             totals: FacturaCompraTotals
             ) = {

    new FacturaCompra(

      ids,
      base,
      references,
      dates,
      precios,
      cotizacion,
      stock,
      totals,

      emptyFacturaCompraItems
    )
  }

  private val facturaCompraItemParser: RowParser[FacturaCompraItem] = {
    SqlParser.get[Int](C.FCI_ID) ~
    SqlParser.get[BigDecimal](C.FCI_CANTIDAD) ~
    SqlParser.get[String](C.FCI_DESCRIP) ~
    SqlParser.get[String](C.FCI_DESCUENTO) ~
    SqlParser.get[BigDecimal](C.FCI_PRECIO) ~
    SqlParser.get[BigDecimal](C.FCI_PRECIO_LISTA) ~
    SqlParser.get[BigDecimal](C.FCI_PRECIO_USR) ~
    SqlParser.get[BigDecimal](C.FCI_NETO) ~
    SqlParser.get[BigDecimal](C.FCI_IVA_RI) ~
    SqlParser.get[BigDecimal](C.FCI_IVA_RNI) ~
    SqlParser.get[BigDecimal](C.FCI_INTERNOS) ~
    SqlParser.get[BigDecimal](C.FCI_IVA_RIPORC) ~
    SqlParser.get[BigDecimal](C.FCI_IVA_RNIPORC) ~
    SqlParser.get[BigDecimal](C.FCI_INTERNOS_PORC) ~
    SqlParser.get[Float](GC.PR_PORC_INTERNO_C) ~
    SqlParser.get[Int](GC.PR_ID) ~
    SqlParser.get[String](GC.PR_NAME_COMPRA) ~
    SqlParser.get[Option[Int]](GC.CCOS_ID) ~
    SqlParser.get[Option[String]](GC.CCOS_NAME) ~
    SqlParser.get[Int](GC.TO_ID) ~
    SqlParser.get[String](GC.TO_NAME) ~
    SqlParser.get[Int](GC.CUE_ID) ~
    SqlParser.get[Option[Int]](C.CUE_ID_IVA_RI) ~
    SqlParser.get[Option[Int]](C.CUE_ID_IVA_RNI) ~
    SqlParser.get[Option[Int]](C.STL_ID) ~
    SqlParser.get[Option[String]](C.STL_CODE) ~
    SqlParser.get[BigDecimal](C.FCI_IMPORTE) ~
    SqlParser.get[BigDecimal](C.FCI_IMPORTE_ORIGEN) ~
    SqlParser.get[Int](C.FCI_ORDEN) ~
    SqlParser.get[Int](GC.PR_LLEVA_NRO_SERIE) ~
    SqlParser.get[Int](GC.PR_LLEVA_NRO_LOTE) ~
    SqlParser.get[String](GC.UN_NAME) map {
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
        unName =>
      FacturaCompraItem(
        id,
        FacturaCompraItemBase(
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
          (llevaNroSerie != 0),
          (llevaNroLote != 0),
          unName
        ),
        FacturaCompraItemTotals(
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
        List(),
        ""
      )
    }
  }

  private val facturaCompraItemSerieParser: RowParser[FacturaCompraItemSerie] = {
    SqlParser.get[Int](GC.PRNS_ID) ~
    SqlParser.get[String](GC.PRNS_CODE) ~
    SqlParser.get[String](GC.PRNS_DESCRIP) ~
    SqlParser.get[Date](GC.PRNS_FECHA_VTO) ~
    SqlParser.get[Int](C.FCI_ID) map {
    case
        prnsId ~
        prnsCode ~
        prnsDescrip ~
        prnsFechaVto ~
        fcId =>
      FacturaCompraItemSerie(
        prnsId,
        prnsCode,
        prnsDescrip,
        prnsFechaVto,
        fcId
      )
    }
  }

  private val facturaCompraOtroParser: RowParser[FacturaCompraOtro] = {
    SqlParser.get[Int](C.FCOT_ID) ~
    SqlParser.get[Int](GC.CUE_ID) ~
    SqlParser.get[String](GC.CUE_NAME) ~
    SqlParser.get[BigDecimal](C.FCOT_DEBE) ~
    SqlParser.get[BigDecimal](C.FCOT_HABER) ~
    SqlParser.get[Option[Int]](GC.CCOS_ID) ~
    SqlParser.get[Option[String]](GC.CCOS_NAME) ~
    SqlParser.get[String](C.FCOT_DESCRIP) ~
    SqlParser.get[BigDecimal](C.FCOT_ORIGEN) ~
    SqlParser.get[Int](C.FCOT_ORDEN) map {
    case
        id ~
        cueId ~
        cueName ~
        debe ~
        haber ~
        ccosId ~
        ccosName ~
        descrip ~
        origen ~
        orden =>
      FacturaCompraOtro(
        id,
        cueId,
        cueName,
        debe.doubleValue(),
        haber.doubleValue(),
        ccosId.getOrElse(DBHelper.NoId),
        ccosName.getOrElse(""),
        descrip,
        origen.doubleValue(),
        orden
      )
    }
  }

  private val facturaCompraLegajoParser: RowParser[FacturaCompraLegajo] = {
    SqlParser.get[Int](C.FCLGJ_ID) ~
    SqlParser.get[Int](GC.LGJ_ID) ~
    SqlParser.get[String](GC.LGJ_CODE) ~
    SqlParser.get[BigDecimal](C.FCLGJ_IMPORTE) ~
    SqlParser.get[String](C.FCLGJ_DESCRIP) ~
    SqlParser.get[BigDecimal](C.FCLGJ_IMPORTE_ORIGEN) ~
    SqlParser.get[Int](C.FCLGJ_ORDEN) map {
    case
        id ~
        lgjId ~
        lgjCode ~
        importe ~
        descrip ~
        importeOrigen ~
        orden =>
      FacturaCompraLegajo(
        id,
        lgjId,
        lgjCode,
        importe.doubleValue(),
        descrip,
        importeOrigen.doubleValue(),
        orden
      )
    }
  }

  private val facturaCompraPercepcionParser: RowParser[FacturaCompraPercepcion] = {
    SqlParser.get[Int](C.FCPERC_ID) ~
    SqlParser.get[Int](GC.PERC_ID) ~
    SqlParser.get[String](GC.PERC_NAME) ~
    SqlParser.get[BigDecimal](C.FCPERC_BASE) ~
    SqlParser.get[BigDecimal](C.FCPERC_PORCENTAJE) ~
    SqlParser.get[BigDecimal](C.FCPERC_IMPORTE) ~
    SqlParser.get[Option[Int]](GC.CCOS_ID) ~
    SqlParser.get[Option[String]](GC.CCOS_NAME) ~
    SqlParser.get[String](C.FCPERC_DESCRIP) ~
    SqlParser.get[BigDecimal](C.FCPERC_ORIGEN) ~
    SqlParser.get[Int](C.FCPERC_ORDEN) map {
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
      FacturaCompraPercepcion(
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

  private val facturaCompraParser: RowParser[FacturaCompra] = {
    SqlParser.get[Int](C.FC_ID) ~
    SqlParser.get[Int](GC.DOC_ID) ~
    SqlParser.get[String](GC.DOC_NAME) ~
    SqlParser.get[Int](C.FC_NUMERO) ~
    SqlParser.get[String](C.FC_NRODOC) ~
    SqlParser.get[Int](GC.PROV_ID) ~
    SqlParser.get[String](GC.PROV_NAME) ~
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
    SqlParser.get[String](C.FC_CAI) ~
    SqlParser.get[Int](C.FC_TIPO_COMPROBANTE) ~
    SqlParser.get[String](C.FC_DESCRIP) ~
    SqlParser.get[Int](C.FC_GRABAR_ASIENTO) ~
    SqlParser.get[Int](GC.DOCT_ID) ~
    SqlParser.get[String](GC.DOCT_NAME) ~
    SqlParser.get[Int](GC.MON_ID) ~
    SqlParser.get[String](GC.MON_NAME) ~
    SqlParser.get[String](GC.TA_MASCARA) ~
    SqlParser.get[Int](GC.TA_PROPUESTO) ~
    SqlParser.get[Int](C.FC_FIRMADO) ~
    SqlParser.get[Int](GC.DOC_MUEVE_STOCK) ~
    SqlParser.get[Int](GC.DOC_TIPO_FACTURA) ~
    SqlParser.get[Option[Int]](C.ST_ID) ~
    SqlParser.get[Option[Int]](C.AS_ID) ~
    SqlParser.get[Int](GC.HAS_IVA_RI) ~
    SqlParser.get[Int](GC.HAS_IVA_RNI) ~
    SqlParser.get[Int](GC.EDITABLE) ~
    SqlParser.get[String](GC.EDIT_MSG) ~
    SqlParser.get[Date](C.FC_FECHA) ~
    SqlParser.get[Date](C.FC_FECHA_ENTREGA) ~
    SqlParser.get[Date](C.FC_FECHA_IVA) ~
    SqlParser.get[Date](C.FC_FECHA_VTO) ~
    SqlParser.get[BigDecimal](C.FC_DESCUENTO1) ~
    SqlParser.get[BigDecimal](C.FC_DESCUENTO2) ~
    SqlParser.get[Option[Int]](GC.LP_ID) ~
    SqlParser.get[Option[String]](GC.LP_NAME) ~
    SqlParser.get[Option[Int]](GC.LD_ID) ~
    SqlParser.get[Option[String]](GC.LD_NAME) ~
    SqlParser.get[BigDecimal](C.FC_COTIZACION) ~
    SqlParser.get[BigDecimal](C.FC_COTIZACION_PROV) ~
    SqlParser.get[Option[Int]](C.PRO_ID_ORIGEN) ~
    SqlParser.get[Option[String]](C.PRO_ORIGEN_NAME) ~
    SqlParser.get[Option[Int]](C.PRO_ID_DESTINO) ~
    SqlParser.get[Option[String]](C.PRO_DESTINO_NAME) ~
    SqlParser.get[Option[Int]](GC.DEPL_ID) ~
    SqlParser.get[Option[String]](GC.DEPL_NAME) ~
    SqlParser.get[BigDecimal](C.FC_NETO) ~
    SqlParser.get[BigDecimal](C.FC_IVA_RI) ~
    SqlParser.get[BigDecimal](C.FC_IVA_RNI) ~
    SqlParser.get[BigDecimal](C.FC_INTERNOS) ~
    SqlParser.get[BigDecimal](C.FC_SUBTOTAL) ~
    SqlParser.get[BigDecimal](C.FC_IMPORTE_DESC_1) ~
    SqlParser.get[BigDecimal](C.FC_IMPORTE_DESC_2) ~
    SqlParser.get[BigDecimal](C.FC_TOTAL_OTROS) ~
    SqlParser.get[BigDecimal](C.FC_TOTAL_PERCEPCIONES) ~
    SqlParser.get[BigDecimal](C.FC_TOTAL) ~
    SqlParser.get[BigDecimal](C.FC_TOTAL_ORIGEN) ~
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
        cpgId ~
        cpgName ~
        lgjId ~
        lgjCode ~
        cai ~
        tipoComprobante ~
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
        cotizacionProveedor ~
        proIdOrigen ~
        proNameOrigen ~
        proIdDestino ~
        proNameDestino ~
        deplId ~
        deplName ~
        neto ~
        ivaRi ~
        ivaRni ~
        internos ~
        subTotal ~
        importeDesc1 ~
        importeDesc2 ~
        totalOtros ~
        totalPercepciones ~
        total ~
        totalOrigen ~
        createdAt ~
        updatedAt ~
        updatedBy =>
      FacturaCompra(
        id,
        FacturaCompraId(
          docId,
          docName,
          numero,
          nroDoc
        ),
        FacturaCompraBase(
          provId,
          provName,
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
          cai,
          tipoComprobante,
          descrip,
          grabarAsiento != 0
        ),
        FacturaCompraReferences(
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
        FacturaCompraDates(
          fecha,
          fechaEntrega,
          fechaIva,
          fechaVto
        ),
        FacturaCompraPrecios(
          desc1.doubleValue(),
          desc2.doubleValue(),
          lpId.getOrElse(DBHelper.NoId),
          lpName.getOrElse(""),
          ldId.getOrElse(DBHelper.NoId),
          ldName.getOrElse("")
        ),
        FacturaCompraCotizacion(
          cotizacion.doubleValue(),
          cotizacionProveedor.doubleValue()
        ),
        FacturaCompraStock(
          proIdOrigen.getOrElse(DBHelper.NoId),
          proNameOrigen.getOrElse(""),
          proIdDestino.getOrElse(DBHelper.NoId),
          proNameDestino.getOrElse(""),
          deplId.getOrElse(DBHelper.NoId),
          deplName.getOrElse("")
        ),
        FacturaCompraTotals(
          neto.doubleValue(),
          ivaRi.doubleValue(),
          ivaRni.doubleValue(),
          internos.doubleValue(),
          subTotal.doubleValue(),
          importeDesc1.doubleValue(),
          importeDesc2.doubleValue(),
          totalOtros.doubleValue(),
          totalPercepciones.doubleValue(),
          total.doubleValue(),
          totalOrigen.doubleValue()
        ),
        emptyFacturaCompraItems,
        createdAt,
        updatedAt,
        updatedBy)
    }
  }

  def createFromRemito(user: CompanyUser, facturaCompra: FacturaCompra): FacturaCompra = {
    save(user, facturaCompra, true)
  }

  def create(user: CompanyUser, facturaCompra: FacturaCompra): FacturaCompra = {
    save(user, facturaCompra, false)
  }

  def update(user: CompanyUser, facturaCompra: FacturaCompra): FacturaCompra = {
    save(user, facturaCompra, false)
  }

  private def save(user: CompanyUser, facturaCompra: FacturaCompra, isFromWizard: Boolean): FacturaCompra = {
    def getFields = {
      List(
        Field(C.FC_ID, facturaCompra.id, FieldType.number),
        Field(GC.DOC_ID, facturaCompra.ids.docId, FieldType.id),
        Field(C.FC_NRODOC, facturaCompra.ids.nroDoc, FieldType.text),
        Field(C.FC_NUMERO, facturaCompra.ids.numero, FieldType.number),

        Field(GC.PROV_ID, facturaCompra.base.provId, FieldType.id),
        Field(GC.EST_ID, facturaCompra.base.estId, FieldType.id),
        Field(GC.CCOS_ID, facturaCompra.base.ccosId, FieldType.id),
        Field(GC.SUC_ID, facturaCompra.base.sucId, FieldType.id),
        Field(GC.LGJ_ID, facturaCompra.base.lgjId, FieldType.id),
        Field(GC.CPG_ID, facturaCompra.base.cpgId, FieldType.id),
        Field(C.FC_CAI, facturaCompra.base.cai, FieldType.text),
        Field(C.FC_TIPO_COMPROBANTE, facturaCompra.base.tipoComprobante, FieldType.number),
        Field(C.FC_DESCRIP, facturaCompra.base.descrip, FieldType.text),
        Field(C.FC_GRABAR_ASIENTO, Register.boolToInt(facturaCompra.base.grabarAsiento), FieldType.boolean),

        Field(C.FC_FECHA, facturaCompra.dates.fecha, FieldType.date),
        Field(C.FC_FECHA_ENTREGA, facturaCompra.dates.fechaEntrega, FieldType.date),
        Field(C.FC_FECHA_IVA, facturaCompra.dates.fechaIva, FieldType.date),
        Field(C.FC_FECHA_VTO, facturaCompra.dates.fechaVto, FieldType.date),

        Field(C.FC_DESCUENTO1, facturaCompra.precios.desc1, FieldType.currency),
        Field(C.FC_DESCUENTO2, facturaCompra.precios.desc2, FieldType.currency),
        Field(GC.LP_ID, facturaCompra.precios.lpId, FieldType.id),
        Field(GC.LD_ID, facturaCompra.precios.ldId, FieldType.id),

        Field(C.FC_COTIZACION, facturaCompra.cotizacion.cotizacion, FieldType.currency),
        Field(C.FC_COTIZACION_PROV, facturaCompra.cotizacion.cotizacionProveedor, FieldType.currency),

        Field(C.PRO_ID_ORIGEN, facturaCompra.stock.proIdOrigen, FieldType.id),
        Field(C.PRO_ID_DESTINO, facturaCompra.stock.proIdDestino, FieldType.id),
        Field(GC.DEPL_ID, facturaCompra.stock.deplId, FieldType.id),

        Field(C.FC_NETO, facturaCompra.totals.neto, FieldType.currency),
        Field(C.FC_IVA_RI, facturaCompra.totals.ivaRi, FieldType.currency),
        Field(C.FC_IVA_RNI, facturaCompra.totals.ivaRni, FieldType.currency),
        Field(C.FC_INTERNOS, facturaCompra.totals.internos, FieldType.currency),
        Field(C.FC_SUBTOTAL, facturaCompra.totals.subTotal, FieldType.currency),
        Field(C.FC_IMPORTE_DESC_1, facturaCompra.totals.importeDesc1, FieldType.currency),
        Field(C.FC_IMPORTE_DESC_2, facturaCompra.totals.importeDesc2, FieldType.currency),
        Field(C.FC_TOTAL_OTROS, facturaCompra.totals.totalOtros, FieldType.currency),
        Field(C.FC_TOTAL_PERCEPCIONES, facturaCompra.totals.totalPercepciones, FieldType.currency),
        Field(C.FC_TOTAL, facturaCompra.totals.total, FieldType.currency),
        Field(C.FC_TOTAL_ORIGEN, facturaCompra.totals.totalOrigen, FieldType.currency)
      )
    }

    def getItemFields(item: FacturaCompraItem, fcTMPId: Int) = {
      List(
        Field(C.FC_TMP_ID, fcTMPId, FieldType.id),
        Field(C.FCI_ID, item.id, FieldType.number),
        Field(C.FCI_DESCRIP, item.base.descrip, FieldType.text),
        Field(C.FCI_DESCUENTO, item.base.descuento, FieldType.text),
        Field(GC.PR_ID, item.base.prId, FieldType.id),
        Field(GC.CCOS_ID, item.base.ccosId, FieldType.id),
        Field(GC.TO_ID, item.base.toId, FieldType.id),
        Field(GC.CUE_ID, item.base.cueId, FieldType.id),
        Field(C.CUE_ID_IVA_RI, item.base.cueIdIvaRi, FieldType.id),
        Field(C.CUE_ID_IVA_RNI, item.base.cueIdIvaRni, FieldType.id),
        Field(C.STL_ID, item.base.stlId, FieldType.id),
        Field(C.STL_CODE, item.base.stlCode, FieldType.text),
        Field(C.FCI_ORDEN, item.base.orden, FieldType.integer),
        Field(C.FCI_CANTIDAD, item.totals.cantidad, FieldType.currency),
        Field(C.FCI_CANTIDAD_A_REMITIR, item.totals.cantidad, FieldType.currency),
        Field(C.FCI_PRECIO, item.totals.precio, FieldType.currency),
        Field(C.FCI_PRECIO_LISTA, item.totals.precioLista, FieldType.currency),
        Field(C.FCI_PRECIO_USR, item.totals.precioUser, FieldType.currency),
        Field(C.FCI_NETO, item.totals.neto, FieldType.currency),
        Field(C.FCI_IVA_RI, item.totals.ivaRi, FieldType.currency),
        Field(C.FCI_IVA_RNI, item.totals.ivaRni, FieldType.currency),
        Field(C.FCI_INTERNOS, item.totals.internos, FieldType.currency),
        Field(C.FCI_IVA_RIPORC, item.totals.ivaRiPorc, FieldType.double),
        Field(C.FCI_IVA_RNIPORC, item.totals.ivaRniPorc, FieldType.double),
        Field(C.FCI_INTERNOS_PORC, item.totals.internosPorc, FieldType.double),
        Field(C.FCI_IMPORTE, item.totals.importe, FieldType.currency),
        Field(C.FCI_IMPORTE_ORIGEN, item.totals.importeOrigen, FieldType.currency)
      )
    }

    def getDeletedItemFields(fciId: Int, fcTMPId: Int) = {
      List(
        Field(C.FC_TMP_ID, fcTMPId, FieldType.id),
        Field(C.FCI_ID, fciId, FieldType.number),
        Field(C.FC_ID, facturaCompra.id, FieldType.id)
      )
    }

    def getOtroFields(item: FacturaCompraOtro, fcTMPId: Int) = {
      List(
        Field(C.FC_TMP_ID, fcTMPId, FieldType.id),
        Field(C.FCOT_ID, item.id, FieldType.number),
        Field(GC.CUE_ID, item.cueId, FieldType.id),
        Field(C.FCOT_DEBE, item.debe, FieldType.currency),
        Field(C.FCOT_HABER, item.haber, FieldType.currency),
        Field(GC.CCOS_ID, item.ccosId, FieldType.id),
        Field(C.FCOT_DESCRIP, item.descrip, FieldType.text),
        Field(C.FCOT_ORIGEN, item.origen, FieldType.currency),
        Field(C.FCOT_ORDEN, item.orden, FieldType.integer)
      )
    }

    def getDeletedOtroFields(fcotId: Int, fcTMPId: Int) = {
      List(
        Field(C.FC_TMP_ID, fcTMPId, FieldType.id),
        Field(C.FCOT_ID, fcotId, FieldType.number),
        Field(C.FC_ID, facturaCompra.id, FieldType.id)
      )
    }

    def getPercepcionFields(item: FacturaCompraPercepcion, fcTMPId: Int) = {
      List(
        Field(C.FC_TMP_ID, fcTMPId, FieldType.id),
        Field(C.FCPERC_ID, item.id, FieldType.number),
        Field(GC.PERC_ID, item.percId, FieldType.id),
        Field(C.FCPERC_BASE, item.base, FieldType.currency),
        Field(C.FCPERC_PORCENTAJE, item.porcentaje, FieldType.currency),
        Field(C.FCPERC_IMPORTE, item.importe, FieldType.currency),
        Field(GC.CCOS_ID, item.percId, FieldType.id),
        Field(C.FCPERC_DESCRIP, item.descrip, FieldType.text),
        Field(C.FCPERC_ORIGEN, item.origen, FieldType.currency),
        Field(C.FCPERC_ORDEN, item.orden, FieldType.integer)
      )
    }

    def getDeletedPercepcionFields(fcpercId: Int, fcTMPId: Int) = {
      List(
        Field(C.FC_TMP_ID, fcTMPId, FieldType.id),
        Field(C.FCPERC_ID, fcpercId, FieldType.number),
        Field(C.FC_ID, facturaCompra.id, FieldType.id)
      )
    }

    def getLegajoFields(item: FacturaCompraLegajo, fcTMPId: Int) = {
      List(
        Field(C.FC_TMP_ID, fcTMPId, FieldType.id),
        Field(C.FCLGJ_ID, item.id, FieldType.number),
        Field(GC.LGJ_ID, item.lgjId, FieldType.id),
        Field(GC.LGJ_CODE, item.lgjCode, FieldType.text),
        Field(C.FCLGJ_IMPORTE, item.importe, FieldType.currency),
        Field(C.FCLGJ_DESCRIP, item.descrip, FieldType.text),
        Field(C.FCLGJ_IMPORTE_ORIGEN, item.importeOrigen, FieldType.currency),
        Field(C.FCLGJ_ORDEN, item.orden, FieldType.integer)
      )
    }

    def getDeletedLegajoFields(fclgjId: Int, fcTMPId: Int) = {
      List(
        Field(C.FC_TMP_ID, fcTMPId, FieldType.id),
        Field(C.FCLGJ_ID, fclgjId, FieldType.number),
        Field(C.FC_ID, facturaCompra.id, FieldType.id)
      )
    }

    def getRemitoFields(item: FacturaCompraRemito, fcTMPId: Int) = {
      List(
        Field(C.FC_TMP_ID, fcTMPId, FieldType.id),
        Field(C.RC_FC_ID, 0, FieldType.number),
        Field(C.RCI_ID, item.rciId, FieldType.id),
        Field(C.RC_FC_CANTIDAD, item.cantidad, FieldType.currency),
        Field(C.FCI_ID, item.rciId, FieldType.id)
      )
    }

    def getSerieFields(item: FacturaCompraItemSerie, fcTMPId: Int, fciTMPId: Int, prId: Int) = {
      List(
        Field(C.FC_TMP_ID, fcTMPId, FieldType.id),
        Field(C.FCI_TMP_ID, fciTMPId, FieldType.id),
        Field(GC.PR_ID, prId, FieldType.id),
        Field(GC.PRNS_ID, item.id, FieldType.id),
        Field(GC.PRNS_CODE, item.code, FieldType.text),
        Field(GC.PRNS_DESCRIP, item.descrip, FieldType.text),
        Field(GC.PRNS_FECHA_VTO, item.fechaVto, FieldType.date)
      )
    }

    def getSerieDeletedFields(prnsId: Int, fcTMPId: Int) = {
      List(
        Field(C.FC_TMP_ID, fcTMPId, FieldType.id),
        Field(GC.PRNS_ID, prnsId, FieldType.id)
      )
    }

    def throwError = {
      throwException(s"Error when saving ${C.FACTURA_COMPRA}")
    }

    def throwException(message: String) = {
      throw new RuntimeException(message)
    }

    def saveItemSerie(fcTMPId: Int, fciTMPId: Int, prId: Int)(item: FacturaCompraItemSerie) = {
      DBHelper.save(
        user,
        Register(
          C.FACTURA_COMPRA_ITEM_SERIE_TMP,
          C.FCIS_TMP_ID,
          DBHelper.NoId,
          false,
          false,
          false,
          getSerieFields(item, fcTMPId, fciTMPId, prId)),
        true
      ) match {
        case SaveResult(true, id) => true
        case SaveResult(false, id) => throwError
      }
    }

    def saveItemSerieDeleted(fcTMPId: Int)(prnsId: String) = {
      DBHelper.save(
        user,
        Register(
          C.FACTURA_COMPRA_ITEM_SERIE_B_TMP,
          C.FCISB_TMP_ID,
          DBHelper.NoId,
          false,
          false,
          false,
          getSerieDeletedFields(prnsId.toInt, fcTMPId)),
        true
      ) match {
        case SaveResult(true, id) => true
        case SaveResult(false, id) => throwError
      }
    }

    case class FacturaCompraItemSerieInfo(
                                           fcTMPId: Int,
                                           fciTMPId: Int,
                                           prId: Int,
                                           series: List[FacturaCompraItemSerie],
                                           deleted: String)

    def saveItemSeries(serieInfo: FacturaCompraItemSerieInfo) = {
      serieInfo.series.map(saveItemSerie(serieInfo.fcTMPId, serieInfo.fciTMPId, serieInfo.prId))
      if(!serieInfo.deleted.isEmpty) serieInfo.deleted.split(",").map(saveItemSerieDeleted(serieInfo.fcTMPId))
    }

    case class FacturaCompraItemInfo(fcTMPId: Int, item: FacturaCompraItem)

    def saveItem(itemInfo: FacturaCompraItemInfo) = {
      DBHelper.save(
        user,
        Register(
          C.FACTURA_COMPRA_ITEM_TMP,
          C.FCI_TMP_ID,
          DBHelper.NoId,
          false,
          false,
          false,
          getItemFields(itemInfo.item, itemInfo.fcTMPId)),
        true
      ) match {
        case SaveResult(true, id) => {
          FacturaCompraItemSerieInfo(
            itemInfo.fcTMPId, id, itemInfo.item.base.prId, itemInfo.item.series, itemInfo.item.serieDeleted)
        }
        case SaveResult(false, id) => throwError
      }
    }

    def saveDeletedItem(fcTMPId: Int)(fciId: String) = {
      val id = G.getIntOrZero(fciId)
      if(id != 0) {
        DBHelper.save(
          user,
          Register(
            C.FACTURA_COMPRA_ITEM_BORRADO_TMP,
            C.FCIB_TMP_ID,
            DBHelper.NoId,
            false,
            false,
            false,
            getDeletedItemFields(id, fcTMPId)),
          true
        ) match {
          case SaveResult(false, id) => throwError
          case _ =>
        }
      }
    }

    def saveItems(fcTMPId: Int) = {
      facturaCompra.items.items.map(item => saveItem(FacturaCompraItemInfo(fcTMPId, item))).map(saveItemSeries)
      facturaCompra.items.itemDeleted.split(",").map(saveDeletedItem(fcTMPId))
    }

    case class FacturaCompraOtroInfo(fcTMPId: Int, item: FacturaCompraOtro)

    def saveOtro(itemInfo: FacturaCompraOtroInfo) = {
      DBHelper.save(
        user,
        Register(
          C.FACTURA_COMPRA_OTRO_TMP,
          C.FCOT_TMP_ID,
          DBHelper.NoId,
          false,
          false,
          false,
          getOtroFields(itemInfo.item, itemInfo.fcTMPId)),
        true
      ) match {
        case SaveResult(true, id) => true
        case SaveResult(false, id) => throwError
      }
    }

    def saveDeletedOtro(fcTMPId: Int)(fcotId: String) = {
      val id = G.getIntOrZero(fcotId)
      if(id != 0) {
        DBHelper.save(
          user,
          Register(
            C.FACTURA_COMPRA_OTRO_BORRADO_TMP,
            C.FCOTB_TMP_ID,
            DBHelper.NoId,
            false,
            false,
            false,
            getDeletedOtroFields(id, fcTMPId)),
          true
        ) match {
          case SaveResult(false, id) => throwError
          case _ =>
        }
      }
    }

    def saveOtros(fcTMPId: Int) = {
      facturaCompra.items.otros.map(otro => saveOtro(FacturaCompraOtroInfo(fcTMPId, otro)))
      facturaCompra.items.otroDeleted.split(",").map(saveDeletedOtro(fcTMPId))
    }

    case class FacturaCompraPercepcionInfo(fcTMPId: Int, item: FacturaCompraPercepcion)

    def savePercepcion(itemInfo: FacturaCompraPercepcionInfo) = {
      DBHelper.save(
        user,
        Register(
          C.FACTURA_COMPRA_PERCEPCION_TMP,
          C.FCPERC_TMP_ID,
          DBHelper.NoId,
          false,
          false,
          false,
          getPercepcionFields(itemInfo.item, itemInfo.fcTMPId)),
        true
      ) match {
        case SaveResult(true, id) => true
        case SaveResult(false, id) => throwError
      }
    }

    def saveDeletedPercepcion(fcTMPId: Int)(fcpercId: String) = {
      val id = G.getIntOrZero(fcpercId)
      if(id != 0) {
        DBHelper.save(
          user,
          Register(
            C.FACTURA_COMPRA_PERCEPCION_BORRADO_TMP,
            C.FCPERCB_TMP_ID,
            DBHelper.NoId,
            false,
            false,
            false,
            getDeletedPercepcionFields(id, fcTMPId)),
          true
        ) match {
          case SaveResult(false, id) => throwError
          case _ =>
        }
      }
    }

    def savePercepciones(fcTMPId: Int) = {
      facturaCompra.items.percepciones.map(percepcion => savePercepcion(FacturaCompraPercepcionInfo(fcTMPId, percepcion)))
      facturaCompra.items.percepcionDeleted.split(",").map(saveDeletedPercepcion(fcTMPId))
    }

    case class FacturaCompraLegajoInfo(fcTMPId: Int, item: FacturaCompraLegajo)

    def saveLegajo(itemInfo: FacturaCompraLegajoInfo) = {
      DBHelper.save(
        user,
        Register(
          C.FACTURA_COMPRA_LEGAJO_TMP,
          C.FCLGJ_TMP_ID,
          DBHelper.NoId,
          false,
          false,
          false,
          getLegajoFields(itemInfo.item, itemInfo.fcTMPId)),
        true
      ) match {
        case SaveResult(true, id) => true
        case SaveResult(false, id) => throwError
      }
    }

    def saveDeletedLegajo(fcTMPId: Int)(fclgjId: String) = {
      val id = G.getIntOrZero(fclgjId)
      if(id != 0) {
        DBHelper.save(
          user,
          Register(
            C.FACTURA_COMPRA_LEGAJO_BORRADO_TMP,
            C.FCLGJ_TMP_ID,
            DBHelper.NoId,
            false,
            false,
            false,
            getDeletedLegajoFields(id, fcTMPId)),
          true
        ) match {
          case SaveResult(false, id) => throwError
          case _ =>
        }
      }
    }

    def saveLegajos(fcTMPId: Int) = {
      facturaCompra.items.legajos.map(legajo => saveLegajo(FacturaCompraLegajoInfo(fcTMPId, legajo)))
      facturaCompra.items.legajoDeleted.split(",").map(saveDeletedLegajo(fcTMPId))
    }

    case class FacturaCompraRemitoInfo(fcTMPId: Int, item: FacturaCompraRemito)

    def saveRemito(itemInfo: FacturaCompraRemitoInfo) = {
      DBHelper.save(
        user,
        Register(
          C.REMITO_FACTURA_COMPRA_TMP,
          C.RC_FC_TMP_ID,
          DBHelper.NoId,
          false,
          false,
          false,
          getRemitoFields(itemInfo.item, itemInfo.fcTMPId)),
        true
      ) match {
        case SaveResult(true, id) => true
        case SaveResult(false, id) => throwError
      }
    }

    def saveRemitos(fcTMPId: Int) = {
      facturaCompra.items.remitos.map(remito => saveRemito(FacturaCompraRemitoInfo(fcTMPId, remito)))
    }

    case class RowResult(rowType: String, id: Int, message: String)

    def saveFromWizard(fcTMPId: Int) = {

      DB.withTransaction(user.database.database) { implicit connection =>
        val sql = "select * from sp_doc_factura_compra_wizard_save(?)"
        val cs = connection.prepareStatement(sql)

        cs.setInt(1, fcTMPId)

        try {
          cs.executeQuery()
        } catch {
          case NonFatal(e) => {
            Logger.error(s"can't save ${C.FACTURA_COMPRA} with id ${facturaCompra.id} for user ${user.toString}. Error ${e.toString}")
            throw e
          }
        } finally {
          cs.close
        }
      }
    }

    def executeSave(fcTMPId: Int): List[RowResult] = {

      DB.withTransaction(user.database.database) { implicit connection =>
        val sql = "select * from sp_doc_factura_compra_save(?, ?)"
        val cs = connection.prepareStatement(sql)

        cs.setInt(1, user.masterUserId)
        cs.setInt(2, fcTMPId)

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
          * ex: CREATE OR REPLACE FUNCTION sp_doc_factura_compra_save( params )
          *     RETURNS SETOF row_result AS ...
          *
          * the field type is used to identify the value in the row. there are three
          * kind of types: resultset, success, key
          * for first two (resultset and success) the value of type is string with
          * one of these two values ex: 'resultset' or 'success'
          * when type == 'resultset' the field r must be not null and contain a ResultSet
          * when type == 'success' the id field can contain 0 (False) or not 0 (-1,1 or any other number but NO 0) (True)
          * the last kind of type is key. in this case the key must be the name of a column like fc_id, as_id, pr_id, etc
          * it can be any column name. if the type is an integer like in fc_id, as_id or any other id column the field id
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
                case "fc_id" => RowResult("fc_id", rs.getInt(2), "")
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
            Logger.error(s"can't save ${C.FACTURA_COMPRA} with id ${facturaCompra.id} for user ${user.toString}. Error ${e.toString}")
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
            case RowResult("fc_id", id, m) => id
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
        C.FACTURA_COMPRA_TMP,
        C.FC_TMP_ID,
        DBHelper.NoId,
        false,
        true,
        true,
        getFields),
      true
    ) match {
      case SaveResult(true, fcTMPId) => {
        saveItems(fcTMPId)
        saveOtros(fcTMPId)
        savePercepciones(fcTMPId)
        saveLegajos(fcTMPId)
        if(isFromWizard) saveFromWizard(fcTMPId)
        saveRemitos(fcTMPId)
        val messagesAndId = executeSave(fcTMPId)
        val id = getIdFromMessages(messagesAndId)
        load(user, id).getOrElse(throwError)
      }
      case SaveResult(false, id) => throwError
    }

  }

  def load(user: CompanyUser, id: Int): Option[FacturaCompra] = {

    DB.withTransaction(user.database.database) { implicit connection =>

      val sql = "{call sp_doc_factura_compra_get(?, ?, ?, ?)}"
      val cs = connection.prepareCall(sql)

      cs.setInt(1, user.cairoCompanyId)
      cs.setInt(2, id)
      cs.setInt(3, user.masterUserId)
      cs.registerOutParameter(4, Types.OTHER)

      try {
        cs.execute()

        val rs = cs.getObject(4).asInstanceOf[java.sql.ResultSet]
        Sql.as(facturaCompraParser.singleOpt, rs)

      } catch {
        case NonFatal(e) => {
          Logger.error(s"can't get ${C.FACTURA_COMPRA} with id $id for user ${user.toString}. Error ${e.toString}")
          throw e
        }
      } finally {
        cs.close
      }
    }
  }

  private def loadFacturaCompraItems(user: CompanyUser, id: Int) = {
    val items = loadItems(user, id)
    FacturaCompraItems(
      items._1,
      items._2,
      loadOtros(user, id),
      loadLegajos(user, id),
      loadPercepciones(user, id),
      "", "", "", "", List()
    )
  }

  private def loadItems(user: CompanyUser, id: Int) = {

    DB.withTransaction(user.database.database) { implicit connection =>

      val sql = "{call sp_doc_factura_compra_get_items(?, ?, ?)}"
      val cs = connection.prepareCall(sql)

      cs.setInt(1, id)
      cs.registerOutParameter(2, Types.OTHER)
      cs.registerOutParameter(3, Types.OTHER)

      try {
        cs.execute()

        val rs = cs.getObject(2).asInstanceOf[java.sql.ResultSet]
        val rsSerie = cs.getObject(3).asInstanceOf[java.sql.ResultSet]

        (Sql.as(facturaCompraItemParser.*, rs), Sql.as(facturaCompraItemSerieParser.*, rsSerie))

      } catch {
        case NonFatal(e) => {
          Logger.error(s"can't get ${C.FACTURA_COMPRA_ITEM} with id $id for user ${user.toString}. Error ${e.toString}")
          throw e
        }
      } finally {
        cs.close
      }
    }
  }

  private def loadOtros(user: CompanyUser, id: Int) = {

    DB.withTransaction(user.database.database) { implicit connection =>

      val sql = "{call sp_doc_factura_compra_get_otros(?, ?)}"
      val cs = connection.prepareCall(sql)

      cs.setInt(1, id)
      cs.registerOutParameter(2, Types.OTHER)

      try {
        cs.execute()

        val rs = cs.getObject(2).asInstanceOf[java.sql.ResultSet]
        Sql.as(facturaCompraOtroParser.*, rs)

      } catch {
        case NonFatal(e) => {
          Logger.error(s"can't get ${C.FACTURA_COMPRA_OTRO} with id $id for user ${user.toString}. Error ${e.toString}")
          throw e
        }
      } finally {
        cs.close
      }
    }
  }

  private def loadLegajos(user: CompanyUser, id: Int) = {

    DB.withTransaction(user.database.database) { implicit connection =>

      val sql = "{call sp_doc_factura_compra_get_legajos(?, ?)}"
      val cs = connection.prepareCall(sql)

      cs.setInt(1, id)
      cs.registerOutParameter(2, Types.OTHER)

      try {
        cs.execute()

        val rs = cs.getObject(2).asInstanceOf[java.sql.ResultSet]
        Sql.as(facturaCompraLegajoParser.*, rs)

      } catch {
        case NonFatal(e) => {
          Logger.error(s"can't get ${C.FACTURA_COMPRA_LEGAJO} with id $id for user ${user.toString}. Error ${e.toString}")
          throw e
        }
      } finally {
        cs.close
      }
    }
  }

  private def loadPercepciones(user: CompanyUser, id: Int) = {

    DB.withTransaction(user.database.database) { implicit connection =>

      val sql = "{call sp_doc_factura_compra_get_percepciones(?, ?)}"
      val cs = connection.prepareCall(sql)

      cs.setInt(1, id)
      cs.registerOutParameter(2, Types.OTHER)

      try {
        cs.execute()

        val rs = cs.getObject(2).asInstanceOf[java.sql.ResultSet]
        Sql.as(facturaCompraPercepcionParser.*, rs)

      } catch {
        case NonFatal(e) => {
          Logger.error(s"can't get ${C.FACTURA_COMPRA_PERCEPCION} with id $id for user ${user.toString}. Error ${e.toString}")
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
        SQL("sp_doc_factura_compra_delete {id}, {empId}, {usId}")
          .on('id -> id, 'empId -> user.cairoCompanyId, 'usId -> user.masterUserId)
          .executeUpdate
      } catch {
        case NonFatal(e) => {
          Logger.error(s"can't delete a ${C.FACTURA_COMPRA}. ${C.FC_ID} id: $id. Error ${e.toString}")
          throw e
        }
      }
    }
  }

  def get(user: CompanyUser, id: Int): FacturaCompra = {
    load(user, id) match {
      case Some(p) => {
        FacturaCompra(
          p.id,

          p.ids,
          p.base,
          p.references,
          p.dates,
          p.precios,
          p.cotizacion,
          p.stock,
          p.totals,

          loadFacturaCompraItems(user, id)
        )
      }
      case None => emptyFacturaCompra
    }
  }

  val K_FECHA_INI = 1
  val K_FECHA_FIN = 2
  val K_PROV_ID   = 4
  val K_EST_ID    = 5
  val K_CCOS_ID   = 6
  val K_SUC_ID    = 7
  val K_DOC_ID    = 9
  val K_CPG_ID    = 10
  val K_EMP_ID    = 100

  def saveParams(user: CompanyUser, facturaCompraParams: FacturaCompraParams): FacturaCompraParams = {
    val baseFields = List(
      Field(GC.EMP_ID, user.cairoCompanyId, FieldType.id),
      Field(GC.US_ID, user.masterUserId, FieldType.id),
      Field(GC.PRE_ID, S.LIST_FACTURA_COMPRA, FieldType.id)
    )

    def throwException = {
      throw new RuntimeException(s"Error when saving ${C.FACTURA_COMPRA}")
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
        Field(GC.LDP_VALOR, facturaCompraParams.from, FieldType.text)
      ),
      List(
        Field(GC.LDP_ID, K_FECHA_FIN, FieldType.integer),
        Field(GC.LDP_ORDEN, 10, FieldType.integer),
        Field(GC.LDP_VALOR, facturaCompraParams.to, FieldType.text)
      ),
      List(
        Field(GC.LDP_ID, K_PROV_ID, FieldType.integer),
        Field(GC.LDP_ORDEN, 20, FieldType.integer),
        Field(GC.LDP_VALOR, facturaCompraParams.provId, FieldType.text)
      ),
      List(
        Field(GC.LDP_ID, K_EST_ID, FieldType.integer),
        Field(GC.LDP_ORDEN, 30, FieldType.integer),
        Field(GC.LDP_VALOR, facturaCompraParams.estId, FieldType.text)
      ),
      List(
        Field(GC.LDP_ID, K_CCOS_ID, FieldType.integer),
        Field(GC.LDP_ORDEN, 40, FieldType.integer),
        Field(GC.LDP_VALOR, facturaCompraParams.ccosId, FieldType.text)
      ),
      List(
        Field(GC.LDP_ID, K_SUC_ID, FieldType.integer),
        Field(GC.LDP_ORDEN, 50, FieldType.integer),
        Field(GC.LDP_VALOR, facturaCompraParams.sucId, FieldType.text)
      ),
      List(
        Field(GC.LDP_ID, K_DOC_ID, FieldType.integer),
        Field(GC.LDP_ORDEN, 60, FieldType.integer),
        Field(GC.LDP_VALOR, facturaCompraParams.docId, FieldType.text)
      ),
      List(
        Field(GC.LDP_ID, K_CPG_ID, FieldType.integer),
        Field(GC.LDP_ORDEN, 70, FieldType.integer),
        Field(GC.LDP_VALOR, facturaCompraParams.cpgId, FieldType.text)
      ),
      List(
        Field(GC.LDP_ID, K_EMP_ID, FieldType.integer),
        Field(GC.LDP_ORDEN, 80, FieldType.integer),
        Field(GC.LDP_VALOR, facturaCompraParams.empId, FieldType.text)
      )
    )

    DB.withConnection(user.database.database) { implicit connection =>
      try {
        SQL(s"""DELETE FROM ListaDocumentoParametro
              | WHERE pre_id = {preId}
              | AND (emp_id is null or emp_id = {empId})
              | AND us_id = {usId}""".stripMargin)
          .on(
            'preId -> S.LIST_FACTURA_COMPRA,
            'empId -> user.cairoCompanyId,
            'usId -> user.masterUserId
          )
          .executeUpdate
      } catch {
        case NonFatal(e) => {
          Logger.error(s"can't save parameters for FacturaCompra")
          throw e
        }
      }
    }

    paramList.map(param => saveParam(baseFields ::: param))

    loadParams(user).getOrElse(throwException)
  }

  def loadParams(user: CompanyUser): Option[FacturaCompraParams] = {

    val params = DocumentListParam.load(user, S.LIST_FACTURA_COMPRA)

    if(params.isEmpty) {
      Some(emptyFacturaCompraParams)
    }
    else {
      val prov = DocumentListParam.getParamValue(
        user, K_PROV_ID, params, emptyFacturaCompraParams.provId,
        GC.PROVEEDOR, GC.PROV_ID, GC.PROV_NAME
      )
      val est = DocumentListParam.getParamValue(
        user, K_EST_ID, params, emptyFacturaCompraParams.estId,
        GC.ESTADO, GC.EST_ID, GC.EST_NAME
      )
      val ccos = DocumentListParam.getParamValue(
        user, K_CCOS_ID, params, emptyFacturaCompraParams.ccosId,
        GC.CENTRO_COSTO, GC.CCOS_ID, GC.CCOS_NAME
      )
      val suc = DocumentListParam.getParamValue(
        user, K_SUC_ID, params, emptyFacturaCompraParams.sucId,
        GC.SUCURSAL, GC.SUC_ID, GC.SUC_NAME
      )
      val doc = DocumentListParam.getParamValue(
        user, K_DOC_ID, params, emptyFacturaCompraParams.docId,
        GC.DOCUMENTO, GC.DOC_ID, GC.DOC_NAME
      )
      val cpg = DocumentListParam.getParamValue(
        user, K_CPG_ID, params, emptyFacturaCompraParams.cpgId,
        GC.CONDICION_PAGO, GC.CPG_ID, GC.CPG_NAME
      )
      val emp = DocumentListParam.getParamValue(
        user, K_EMP_ID, params, emptyFacturaCompraParams.empId,
        GC.EMPRESA, GC.EMP_ID, GC.EMP_NAME
      )

      Some(
        FacturaCompraParams(
          DocumentListParam.getParamValue(K_FECHA_INI, params, emptyFacturaCompraParams.from),
          DocumentListParam.getParamValue(K_FECHA_FIN, params, emptyFacturaCompraParams.to),
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
           provId: Option[String],
           estId: Option[String],
           ccosId: Option[String],
           sucId: Option[String],
           docId: Option[String],
           cpgId: Option[String],
           empId: Option[String]): Recordset = {

    DB.withTransaction(user.database.database) { implicit connection =>

      val sql = "{call sp_lsdoc_facturas_compra(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)}"
      val cs = connection.prepareCall(sql)

      cs.setInt(1, user.masterUserId)
      cs.setDate(2, new java.sql.Date(from.getTime()))
      cs.setDate(3, new java.sql.Date(to.getTime()))
      cs.setString(4, provId.getOrElse("0"))
      cs.setString(5, estId.getOrElse("0"))
      cs.setString(6, ccosId.getOrElse("0"))
      cs.setString(7, sucId.getOrElse("0"))
      cs.setString(8, docId.getOrElse("0"))
      cs.setString(9, cpgId.getOrElse("0"))
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

  def listRemitos(user: CompanyUser, provId: Int, currencyId: Int): Recordset = {

    DB.withTransaction(user.database.database) { implicit connection =>

      val sql = "{call sp_doc_factura_compra_get_remitos(?, ?, ?, ?)}"
      val cs = connection.prepareCall(sql)

      cs.setInt(1, user.cairoCompanyId)
      cs.setInt(2, provId)
      cs.setInt(3, currencyId)
      cs.registerOutParameter(4, Types.OTHER)

      try {
        cs.execute()

        val rs = cs.getObject(4).asInstanceOf[java.sql.ResultSet]
        Recordset.load(rs)

      } catch {
        case NonFatal(e) => {
          Logger.error(s"can't get listing of remitos de compra for provider [$provId] and currency [$currencyId] and user ${user.toString}. Error ${e.toString}")
          throw e
        }
      } finally {
        cs.close
      }
    }
  }

  def listRemitosItems(user: CompanyUser, ids: String): Recordset = {

    DB.withTransaction(user.database.database) { implicit connection =>

      val sql = "{call sp_doc_factura_compra_get_remitos_items(?, ?)}"
      val cs = connection.prepareCall(sql)

      cs.setString(1, ids)
      cs.registerOutParameter(2, Types.OTHER)

      try {
        cs.execute()

        val rs = cs.getObject(2).asInstanceOf[java.sql.ResultSet]
        Recordset.load(rs)

      } catch {
        case NonFatal(e) => {
          Logger.error(s"can't get listing of remitos de compra's items for list [$ids] and user ${user.toString}. Error ${e.toString}")
          throw e
        }
      } finally {
        cs.close
      }
    }
  }

  def getAplic(user: CompanyUser, id: Int, aplicType: Int): Recordset = {

    DB.withTransaction(user.database.database) { implicit connection =>

      val sql = "{call sp_doc_factura_compra_get_aplic(?, ?, ?, ?)}"
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

  def getCtaCteCuenta(user: CompanyUser, id: Int): (Int, Int, Boolean) = {

    DB.withTransaction(user.database.database) { implicit connection =>

      val sql = "{call sp_doc_factura_compra_get_cuenta_deudor(?, ?, ?, ?)}"
      val cs = connection.prepareCall(sql)

      cs.setInt(1, user.cairoCompanyId)
      cs.registerOutParameter(2, Types.INTEGER)
      cs.registerOutParameter(3, Types.INTEGER)
      cs.registerOutParameter(4, Types.INTEGER)

      try {
        cs.execute()
        (cs.getInt(2), cs.getInt(3), cs.getInt(4) != 0)

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

  def saveAplic(user: CompanyUser, facturaCompraAplic: FacturaCompraAplic): Int = {
    def getFields = {
      List(
        Field(C.FC_ID, facturaCompraAplic.fcId, FieldType.number),
        Field(C.FC_NUMERO, facturaCompraAplic.fcId, FieldType.number),
        Field(GC.DOC_ID, facturaCompraAplic.docId, FieldType.id),
        Field(GC.EST_ID, DocumentEditStatus.PENDING, FieldType.id),
        Field(GC.SUC_ID, DBHelper.NoId, FieldType.number),
        Field(GC.PROV_ID, DBHelper.NoId, FieldType.number),
        Field(GC.CPG_ID, CondicionPago.FECHA_DOCUMENTO, FieldType.id)
      )
    }

    def getNotaCreditoFields(item: FacturaCompraNotaCreditoItem, fcTMPId: Int) = {
      List(
        Field(C.FC_TMP_ID, fcTMPId, FieldType.id),
        Field(TC.FC_ID_NOTA_CREDITO, item.fcIdNotaCredito, FieldType.number),
        Field(TC.FC_ID_FACTURA, item.fcIdFactura, FieldType.number),
        Field(TC.FCD_ID_NOTA_CREDITO, item.fcdIdNotaCredito, FieldType.number),
        Field(TC.FCD_ID_FACTURA, item.fcdIdFactura, FieldType.number),
        Field(TC.FCP_ID_NOTA_CREDITO, item.fcpIdNotaCredito, FieldType.number),
        Field(TC.FCP_ID_FACTURA, item.fcpIdFactura, FieldType.number),
        Field(TC.FC_NC_IMPORTE, item.fcncImporte, FieldType.currency),
        Field(TC.FC_NC_ID, item.fcncId, FieldType.number)
      )
    }

    def getOrdenPagoFields(item: FacturaCompraOrdenPagoItem, fcTMPId: Int) = {
      List(
        Field(C.FC_TMP_ID, fcTMPId, FieldType.id),
        Field(TC.OPG_ID, item.opgId, FieldType.number),
        Field(TC.OPG_NUMERO, 0, FieldType.number),
        Field(GC.PROV_ID, DBHelper.NoId, FieldType.number),
        Field(GC.SUC_ID, DBHelper.NoId, FieldType.number),
        Field(GC.DOC_ID, DBHelper.NoId, FieldType.number),
        Field(GC.EST_ID, DBHelper.NoId, FieldType.number)
      )
    }

    def getOrdenPagoItemFields(item: PagoItem, opgTMPId: Int) = {
      List(
        Field(TC.OPG_TMP_ID, opgTMPId, FieldType.id),
        Field(TC.OPG_ID, item.opgId, FieldType.id),
        Field(TC.FC_ID, item.fcId, FieldType.id),
        Field(TC.FCD_ID, item.fcdId, FieldType.id),
        Field(TC.FCP_ID, item.fcpId, FieldType.id),
        Field(TC.FC_OPG_ID, item.fcopgId, FieldType.id),
        Field(TC.FC_OPG_COTIZACION, item.fcopgCotizacion, FieldType.currency),
        Field(TC.FC_OPG_IMPORTE, item.fcopgImporte, FieldType.currency),
        Field(TC.FC_OPG_IMPORTE_ORIGEN, item.fcopgImporteOrigen, FieldType.currency)
      )
    }

    def getOrdenPagoCtaCteFields(item: PagoCtaCte, opgTMPId: Int) = {
      List(
        Field(TC.OPG_TMP_ID, opgTMPId, FieldType.id),
        Field(GC.CUE_ID, item.cueId, FieldType.number),
        Field(TC.OPGI_IMPORTE_ORIGEN, item.opgiImporteOrigen, FieldType.currency),
        Field(TC.OPGI_IMPORTE, item.opgiImporte, FieldType.currency),
        Field(TC.OPGI_ORDEN, item.opgiOrden, FieldType.number),
        Field(TC.OPGI_TIPO, item.opgiTipo, FieldType.number),
        Field(TC.OPGI_OTRO_TIPO, item.opgiOtroTipo, FieldType.number)
      )
    }

    def getOrdenCompraFields(item: FacturaCompraOrdenCompraItem, fcTMPId: Int) = {
      List(
        Field(C.FC_TMP_ID, fcTMPId, FieldType.id),
        Field(C.OCI_ID, item.ociId, FieldType.id),
        Field(C.FCI_ID, item.fciId, FieldType.id),
        Field(C.OC_FC_CANTIDAD, item.ocfcCantidad, FieldType.currency),
        Field(C.OC_FC_ID, item.ocfcId, FieldType.id)
      )
    }

    def getRemitoCompraFields(item: FacturaCompraRemitoCompraItem, fcTMPId: Int) = {
      List(
        Field(C.FC_TMP_ID, fcTMPId, FieldType.id),
        Field(C.RCI_ID, item.rciId, FieldType.number),
        Field(C.FCI_ID, item.fciId, FieldType.number),
        Field(C.RC_FC_CANTIDAD, item.rcfcCantidad, FieldType.currency),
        Field(C.RC_FC_ID, item.rcfcId, FieldType.number)
      )
    }

    def throwError = {
      throwException(s"Error when saving application of ${C.FACTURA_COMPRA}")
    }

    def throwException(message: String) = {
      throw new RuntimeException(message)
    }

    case class NotaCreditoItemInfo(fcTMPId: Int, item: FacturaCompraNotaCreditoItem)

    def saveNotaCredito(itemInfo: NotaCreditoItemInfo) = {
      DBHelper.save(
        user,
        Register(
          TC.FACTURA_COMPRA_NOTA_CREDITO_TMP,
          TC.FC_NC_TMP_ID,
          DBHelper.NoId,
          false,
          false,
          false,
          getNotaCreditoFields(itemInfo.item, itemInfo.fcTMPId)),
        true
      ) match {
        case SaveResult(true, id) => true
        case SaveResult(false, id) => throwError
      }
    }

    def saveNotasCredito(fcTMPId: Int) = {
      facturaCompraAplic.notaCredito.map(item => saveNotaCredito(NotaCreditoItemInfo(fcTMPId, item)))
    }

    case class OrdenPagoItemInfo(opgTMPId: Int, item: PagoItem)

    def saveOrdenPagoItem(itemInfo: OrdenPagoItemInfo) = {
      DBHelper.save(
        user,
        Register(
          TC.FACTURA_COMPRA_ORDEN_PAGO_TMP,
          TC.FC_OPG_TMP_ID,
          DBHelper.NoId,
          false,
          false,
          false,
          getOrdenPagoItemFields(itemInfo.item, itemInfo.opgTMPId)),
        true
      ) match {
        case SaveResult(true, id) => true
        case SaveResult(false, id) => throwError
      }
    }

    def saveOrdenPagoItems(items: List[PagoItem], opgTMPId: Int) = {
      items.map(item => saveOrdenPagoItem(OrdenPagoItemInfo(opgTMPId, item)))
    }

    case class OrdenPagoCtaCteInfo(opgTMPId: Int, item: PagoCtaCte)

    def saveOrdenPagoCtaCte(itemInfo: OrdenPagoCtaCteInfo) = {
      DBHelper.save(
        user,
        Register(
          TC.ORDEN_PAGO_ITEM_TMP,
          TC.OPGI_TMP_ID,
          DBHelper.NoId,
          false,
          false,
          false,
          getOrdenPagoCtaCteFields(itemInfo.item, itemInfo.opgTMPId)),
        true
      ) match {
        case SaveResult(true, id) => true
        case SaveResult(false, id) => throwError
      }
    }

    def saveOrdenPagoCtasCtes(items: List[PagoCtaCte], opgTMPId: Int) = {
      items.map(item => saveOrdenPagoCtaCte(OrdenPagoCtaCteInfo(opgTMPId, item)))
    }

    case class OrdenPagoInfo(fcTMPId: Int, item: FacturaCompraOrdenPagoItem)

    def saveOrdenPago(itemInfo: OrdenPagoInfo) = {
      DBHelper.save(
        user,
        Register(
          TC.ORDEN_PAGO_TMP,
          TC.OPG_TMP_ID,
          DBHelper.NoId,
          false,
          false,
          true,
          getOrdenPagoFields(itemInfo.item, itemInfo.fcTMPId)),
        true
      ) match {
        case SaveResult(true, id) => {
          Logger.info(s"items ${itemInfo.item.items}")
          Logger.info(s"ctacte ${itemInfo.item.ctaCte}")
          saveOrdenPagoItems(itemInfo.item.items, id)
          saveOrdenPagoCtasCtes(itemInfo.item.ctaCte, id)
        }
        case SaveResult(false, id) => throwError
      }
    }

    def saveOrdenesPago(fcTMPId: Int) = {
      facturaCompraAplic.ordenPago.map(item => saveOrdenPago(OrdenPagoInfo(fcTMPId, item)))
    }

    case class OrdenCompraInfo(fcTMPId: Int, item: FacturaCompraOrdenCompraItem)

    def saveOrdenCompra(itemInfo: OrdenCompraInfo) = {
      DBHelper.save(
        user,
        Register(
          C.ORDEN_FACTURA_COMPRA_TMP,
          C.OC_FC_TMP_ID,
          DBHelper.NoId,
          false,
          false,
          false,
          getOrdenCompraFields(itemInfo.item, itemInfo.fcTMPId)),
        true
      ) match {
        case SaveResult(true, id) => true
        case SaveResult(false, id) => throwError
      }
    }

    def saveOrdenesCompra(fcTMPId: Int) = {
      facturaCompraAplic.ordenCompra.map(item => saveOrdenCompra(OrdenCompraInfo(fcTMPId, item)))
    }

    case class RemitoCompraInfo(fcTMPId: Int, item: FacturaCompraRemitoCompraItem)

    def saveRemitoCompra(itemInfo: RemitoCompraInfo) = {
      DBHelper.save(
        user,
        Register(
          C.REMITO_FACTURA_COMPRA_TMP,
          C.RC_FC_TMP_ID,
          DBHelper.NoId,
          false,
          false,
          false,
          getRemitoCompraFields(itemInfo.item, itemInfo.fcTMPId)),
        true
      ) match {
        case SaveResult(true, id) => true
        case SaveResult(false, id) => throwError
      }
    }

    def saveRemitosCompra(fcTMPId: Int) = {
      facturaCompraAplic.remitoCompra.map(item => saveRemitoCompra(RemitoCompraInfo(fcTMPId, item)))
    }

    case class RowResult(rowType: String, id: Int, message: String)

    def executeSave(fcTMPId: Int): List[RowResult] = {

      DB.withTransaction(user.database.database) { implicit connection =>
        val sql = "select * from sp_doc_factura_compra_save_aplic(?, ?)"
        val cs = connection.prepareStatement(sql)

        cs.setInt(1, user.masterUserId)
        cs.setInt(2, fcTMPId)

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
          * ex: CREATE OR REPLACE FUNCTION sp_doc_factura_compra_save( params )
          *     RETURNS SETOF row_result AS ...
          *
          * the field type is used to identify the value in the row. there are three
          * kind of types: resultset, success, key
          * for first two (resultset and success) the value of type is string with
          * one of these two values ex: 'resultset' or 'success'
          * when type == 'resultset' the field r must be not null and contain a ResultSet
          * when type == 'success' the id field can contain 0 (False) or not 0 (-1,1 or any other number but NO 0) (True)
          * the last kind of type is key. in this case the key must be the name of a column like fc_id, as_id, pr_id, etc
          * it can be any column name. if the type is an integer like in fc_id, as_id or any other id column the field id
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
                case "fc_id" => RowResult("fc_id", rs.getInt(2), "")
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
            Logger.error(s"can't save application of ${C.FACTURA_COMPRA} with id ${facturaCompraAplic.fcId} for user ${user.toString}. Error ${e.toString}")
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
            case RowResult("fc_id", id, m) => id
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
        C.FACTURA_COMPRA_TMP,
        C.FC_TMP_ID,
        DBHelper.NoId,
        false,
        true,
        true,
        getFields),
      true
    ) match {
      case SaveResult(true, fcTMPId) => {
        saveNotasCredito(fcTMPId)
        saveOrdenesPago(fcTMPId)
        saveOrdenesCompra(fcTMPId)
        saveRemitosCompra(fcTMPId)
        val messagesAndId = executeSave(fcTMPId)
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