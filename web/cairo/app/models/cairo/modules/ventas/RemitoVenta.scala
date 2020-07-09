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

case class RemitoVentaId(
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

object RemitoVentaId {

  def apply(
             docId: Int,
             numero: Int,
             nroDoc: String) = {

    new RemitoVentaId(
      docId,
      numero,
      nroDoc)
  }
}

case class RemitoVentaReferences(
                                   doctId: Int,
                                   doctName: String,
                                   monId: Int,
                                   monName: String,
                                   taMascara: String,
                                   taPropuesto: Boolean,
                                   firmado: Boolean,
                                   docMueveStock: Boolean,
                                   stId: Int,
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
            stId: Int,
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
      stId,
      hasIvaRi,
      hasIvaRni,
      editable,
      editMsg
    )
  }
}

object RemitoVentaReferences {

  def apply(
             doctId: Int,
             monId: Int,
             taMascara: String,
             taPropuesto: Boolean,
             firmado: Boolean,
             docMueveStock: Boolean,
             stId: Int,
             hasIvaRi: Boolean,
             hasIvaRni: Boolean,
             editable: Boolean,
             editMsg: String
           ) = {

    new RemitoVentaReferences(
      doctId,
      monId,
      taMascara,
      taPropuesto,
      firmado,
      docMueveStock,
      stId,
      hasIvaRi,
      hasIvaRni,
      editable,
      editMsg
    )
  }
}

case class RemitoVentaBase(
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
                             descrip: String
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
            descrip: String
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
      descrip
    )
  }
}

object RemitoVentaBase {

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
             descrip: String) = {

    new RemitoVentaBase(
      cliId,
      estId,
      ccosId,
      sucId,
      cpgId,
      lgjId,
      venId,
      clisId,
      ordenCompra,
      descrip)
  }
}

case class RemitoVentaCotizacion(
                                   cotizacion: Double
                                 )

case class RemitoVentaPrecios(
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

object RemitoVentaPrecios {

  def apply(
             desc1: Double,
             desc2: Double,
             lpId: Int,
             ldId: Int) = {

    new RemitoVentaPrecios(
      desc1,
      desc2,
      lpId,
      ldId)
  }
}

case class RemitoVentaDates(
                              fecha: Date,
                              fechaEntrega: Date
                            )

case class RemitoVentaStock(
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

object RemitoVentaStock {

  def apply(
             proIdOrigen: Int,
             proIdDestino: Int,
             deplId: Int,
             transId: Int) = {

    new RemitoVentaStock(
      proIdOrigen,
      proIdDestino,
      deplId,
      transId)
  }
}

case class RemitoVentaTotals(
                               neto: Double,
                               ivaRi: Double,
                               ivaRni: Double,
                               subTotal: Double,
                               importeDesc1: Double,
                               importeDesc2: Double,
                               total: Double
                             )

case class RemitoVentaItemBase(
                                 descrip: String,
                                 descuento: String,
                                 prId: Int,
                                 prName: String,
                                 ccosId: Int,
                                 ccosName: String,
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

object RemitoVentaItemBase {

  def apply(descrip: String,
            descuento: String,
            prId: Int,
            ccosId: Int,
            cueId: Int,
            cueIdIvaRi: Int,
            cueIdIvaRni: Int,
            stlId: Int,
            orden: Int) = {

    new RemitoVentaItemBase(
      descrip,
      descuento,
      prId,
      "",
      ccosId,
      "",
      cueId,
      cueIdIvaRi,
      cueIdIvaRni,
      stlId,
      "",
      orden,
      false,
      false,
      ""
    )
  }
}

case class RemitoVentaItemTotals(
                                   cantidad: Double,
                                   precio: Double,
                                   precioLista: Double,
                                   precioUser: Double,
                                   neto: Double,
                                   ivaRi: Double,
                                   ivaRni: Double,
                                   ivaRiPorc: Double,
                                   ivaRniPorc: Double,
                                   importe: Double
                                 )

object RemitoVentaItemTotals {

  def apply(cantidad: Double,
            precio: Double,
            precioLista: Double,
            precioUser: Double,
            neto: Double,
            ivaRi: Double,
            ivaRni: Double,
            ivaRiPorc: Double,
            ivaRniPorc: Double,
            importe: Double) = {

    new RemitoVentaItemTotals(
      cantidad,
      precio,
      precioLista,
      precioUser,
      neto,
      ivaRi,
      ivaRni,
      ivaRiPorc,
      ivaRniPorc,
      importe
    )
  }
}

case class RemitoVentaItemSerie(
                                  id: Int,
                                  code: String,
                                  descrip: String,
                                  fechaVto: Date,
                                  rviId: Int
                                )

case class RemitoVentaItemKit(
                                id: Int,
                                name: String,
                                amount: Double,
                                hasSerial: Boolean
                              )

case class RemitoVentaItem(
                             id: Int,
                             base: RemitoVentaItemBase,
                             totals: RemitoVentaItemTotals,
                             series: List[RemitoVentaItemSerie] /* only used in save */
                           )

case class RemitoVentaItems(
                              items: List[RemitoVentaItem],
                              series: List[RemitoVentaItemSerie], /* only used when loading an invoice to respond a get RemitoVenta */
                              kits: List[RemitoVentaItemKit],  /* only used when loading an invoice to respond a get RemitoVenta */

                              /* only used in save */
                              itemDeleted: String
                            )

case class RemitoVenta(
                         id: Int,

                         ids: RemitoVentaId,
                         base: RemitoVentaBase,
                         references: RemitoVentaReferences,
                         dates: RemitoVentaDates,
                         precios: RemitoVentaPrecios,
                         cotizacion: RemitoVentaCotizacion,
                         stock: RemitoVentaStock,
                         totals: RemitoVentaTotals,

                         items: RemitoVentaItems,

                         createdAt: Date,
                         updatedAt: Date,
                         updatedBy: Int
                       ) {

  def this(
            id: Int,

            ids: RemitoVentaId,
            base: RemitoVentaBase,
            references: RemitoVentaReferences,
            dates: RemitoVentaDates,
            precios: RemitoVentaPrecios,
            cotizacion: RemitoVentaCotizacion,
            stock: RemitoVentaStock,
            totals: RemitoVentaTotals,

            items: RemitoVentaItems) = {

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
            ids: RemitoVentaId,
            base: RemitoVentaBase,
            references: RemitoVentaReferences,
            dates: RemitoVentaDates,
            precios: RemitoVentaPrecios,
            cotizacion: RemitoVentaCotizacion,
            stock: RemitoVentaStock,
            totals: RemitoVentaTotals,

            items: RemitoVentaItems) = {

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

case class RemitoVentaParams(
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

object RemitoVentaParams {
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

    new RemitoVentaParams(
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

case class RemitoVentaPedidoVentaItem(
                                        pviId: Int,
                                        rviId: Int,
                                        pvfvCantidad: Double,
                                        pvrvId: Int
                                      )

case class RemitoVentaAplic(
                              rvId: Int,
                              docId: Int,
                              pedidoVenta: List[RemitoVentaPedidoVentaItem]
                            )

object RemitoVenta {

  lazy val GC = models.cairo.modules.general.C
  lazy val TC = models.cairo.modules.tesoreria.C

  lazy val emptyRemitoVentaItems = RemitoVentaItems(List(), List(), List(), "")

  lazy val emptyRemitoVentaReferences = RemitoVentaReferences(
    DBHelper.NoId, DBHelper.NoId, "", false, false, false, DBHelper.NoId, false, false, false, "")

  lazy val emptyRemitoVenta = RemitoVenta(
    RemitoVentaId(DBHelper.NoId, 0, ""),
    RemitoVentaBase(DBHelper.NoId, DBHelper.NoId, DBHelper.NoId, DBHelper.NoId, DBHelper.NoId, DBHelper.NoId, DBHelper.NoId, DBHelper.NoId, "", ""),
    emptyRemitoVentaReferences,
    RemitoVentaDates(U.NO_DATE, U.NO_DATE),
    RemitoVentaPrecios(0.0, 0.0, DBHelper.NoId, DBHelper.NoId),
    RemitoVentaCotizacion(0),
    RemitoVentaStock(DBHelper.NoId, DBHelper.NoId, DBHelper.NoId, DBHelper.NoId),
    RemitoVentaTotals(0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0),
    emptyRemitoVentaItems
  )

  lazy val emptyRemitoVentaParams = RemitoVentaParams(
    DateFormatter.format(DateUtil.plusDays(DateUtil.currentTime, -60)),
    DateFormatter.format(DateUtil.currentTime), "0", "", "0", "", "0", "", "0", "", "0", "", "0", "", "0", "", "0", "")

  def apply(
             id: Int,

             ids: RemitoVentaId,
             base: RemitoVentaBase,
             references: RemitoVentaReferences,
             dates: RemitoVentaDates,
             precios: RemitoVentaPrecios,
             cotizacion: RemitoVentaCotizacion,
             stock: RemitoVentaStock,
             totals: RemitoVentaTotals,

             items: RemitoVentaItems
           ) = {

    new RemitoVenta(
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

             ids: RemitoVentaId,
             base: RemitoVentaBase,
             references: RemitoVentaReferences,
             dates: RemitoVentaDates,
             precios: RemitoVentaPrecios,
             cotizacion: RemitoVentaCotizacion,
             stock: RemitoVentaStock,
             totals: RemitoVentaTotals
           ) = {

    new RemitoVenta(
      id,

      ids,
      base,
      references,
      dates,
      precios,
      cotizacion,
      stock,
      totals,

      emptyRemitoVentaItems
    )
  }

  def apply(
             ids: RemitoVentaId,
             base: RemitoVentaBase,
             references: RemitoVentaReferences,
             dates: RemitoVentaDates,
             precios: RemitoVentaPrecios,
             cotizacion: RemitoVentaCotizacion,
             stock: RemitoVentaStock,
             totals: RemitoVentaTotals,

             items: RemitoVentaItems
           ) = {

    new RemitoVenta(
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
             ids: RemitoVentaId,
             base: RemitoVentaBase,
             references: RemitoVentaReferences,
             dates: RemitoVentaDates,
             precios: RemitoVentaPrecios,
             cotizacion: RemitoVentaCotizacion,
             stock: RemitoVentaStock,
             totals: RemitoVentaTotals
           ) = {

    new RemitoVenta(

      ids,
      base,
      references,
      dates,
      precios,
      cotizacion,
      stock,
      totals,

      emptyRemitoVentaItems
    )
  }

  private val remitoVentaItemParser: RowParser[RemitoVentaItem] = {
    SqlParser.get[Int](C.RVI_ID) ~
      SqlParser.get[BigDecimal](C.RVI_CANTIDAD) ~
      SqlParser.get[String](C.RVI_DESCRIP) ~
      SqlParser.get[String](C.RVI_DESCUENTO) ~
      SqlParser.get[BigDecimal](C.RVI_PRECIO) ~
      SqlParser.get[BigDecimal](C.RVI_PRECIO_LISTA) ~
      SqlParser.get[BigDecimal](C.RVI_PRECIO_USR) ~
      SqlParser.get[BigDecimal](C.RVI_NETO) ~
      SqlParser.get[BigDecimal](C.RVI_IVA_RI) ~
      SqlParser.get[BigDecimal](C.RVI_IVA_RNI) ~
      SqlParser.get[BigDecimal](C.RVI_IVA_RI_PORC) ~
      SqlParser.get[BigDecimal](C.RVI_IVA_RNI_PORC) ~
      SqlParser.get[Int](GC.PR_ID) ~
      SqlParser.get[String](GC.PR_NAME_VENTA) ~
      SqlParser.get[Option[Int]](GC.CCOS_ID) ~
      SqlParser.get[Option[String]](GC.CCOS_NAME) ~
      SqlParser.get[Int](GC.CUE_ID) ~
      SqlParser.get[Option[Int]](C.CUE_ID_IVA_RI) ~
      SqlParser.get[Option[Int]](C.CUE_ID_IVA_RNI) ~
      SqlParser.get[Option[Int]](GC.STL_ID) ~
      SqlParser.get[Option[String]](GC.STL_CODE) ~
      SqlParser.get[BigDecimal](C.RVI_IMPORTE) ~
      SqlParser.get[Int](C.RVI_ORDEN) ~
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
          ivaRiPorc ~
          ivaRniPorc ~
          prId ~
          prName ~
          ccosId ~
          ccosName ~
          cueId ~
          cueIdIvaRi ~
          cueIdIvaRni ~
          stlId ~
          stlCode ~
          importe ~
          orden ~
          llevaNroSerie ~
          llevaNroLote ~
          unName =>
        RemitoVentaItem(
          id,
          RemitoVentaItemBase(
            descrip,
            descuento,
            prId,
            prName,
            ccosId.getOrElse(DBHelper.NoId),
            ccosName.getOrElse(""),
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
          RemitoVentaItemTotals(
            cantidad.doubleValue(),
            precio.doubleValue(),
            precioLista.doubleValue(),
            precioUser.doubleValue(),
            neto.doubleValue(),
            ivaRi.doubleValue(),
            ivaRni.doubleValue(),
            ivaRiPorc.doubleValue(),
            ivaRniPorc.doubleValue(),
            importe.doubleValue()
          ),
          List()
        )
    }
  }

  private val remitoVentaItemSerieParser: RowParser[RemitoVentaItemSerie] = {
    SqlParser.get[Int](GC.PRNS_ID) ~
      SqlParser.get[String](GC.PRNS_CODE) ~
      SqlParser.get[String](GC.PRNS_DESCRIP) ~
      SqlParser.get[Date](GC.PRNS_FECHA_VTO) ~
      SqlParser.get[Int](C.RVI_ID) map {
      case
        prnsId ~
          prnsCode ~
          prnsDescrip ~
          prnsFechaVto ~
          rviId =>
        RemitoVentaItemSerie(
          prnsId,
          prnsCode,
          prnsDescrip,
          prnsFechaVto,
          rviId
        )
    }
  }

  private val remitoVentaItemKitParser: RowParser[RemitoVentaItemKit] = {
    SqlParser.get[Int](GC.PR_ID) ~
      SqlParser.get[String](GC.PR_NAME_COMPRA) ~
      SqlParser.get[BigDecimal](GC.PRK_CANTIDAD) ~
      SqlParser.get[Int](GC.PR_LLEVA_NRO_SERIE) map {
      case
        prId ~
          name ~
          amount ~
          hasSerial =>
        RemitoVentaItemKit(
          prId,
          name,
          amount.doubleValue(),
          (hasSerial != 0)
        )
    }
  }

  private val remitoVentaParser: RowParser[RemitoVenta] = {
    SqlParser.get[Int](C.RV_ID) ~
      SqlParser.get[Int](GC.DOC_ID) ~
      SqlParser.get[String](GC.DOC_NAME) ~
      SqlParser.get[Int](C.RV_NUMERO) ~
      SqlParser.get[String](C.RV_NRODOC) ~
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
      SqlParser.get[String](C.RV_ORDEN_COMPRA) ~
      SqlParser.get[String](C.RV_DESCRIP) ~
      SqlParser.get[Int](GC.DOCT_ID) ~
      SqlParser.get[String](GC.DOCT_NAME) ~
      SqlParser.get[Int](GC.MON_ID) ~
      SqlParser.get[String](GC.MON_NAME) ~
      SqlParser.get[String](GC.TA_MASCARA) ~
      SqlParser.get[Int](GC.TA_PROPUESTO) ~
      SqlParser.get[Int](C.RV_FIRMADO) ~
      SqlParser.get[Int](GC.DOC_MUEVE_STOCK) ~
      SqlParser.get[Option[Int]](C.ST_ID) ~
      SqlParser.get[Int](GC.HAS_IVA_RI) ~
      SqlParser.get[Int](GC.HAS_IVA_RNI) ~
      SqlParser.get[Int](GC.EDITABLE) ~
      SqlParser.get[String](GC.EDIT_MSG) ~
      SqlParser.get[Date](C.RV_FECHA) ~
      SqlParser.get[Date](C.RV_FECHA_ENTREGA) ~
      SqlParser.get[BigDecimal](C.RV_DESCUENTO1) ~
      SqlParser.get[BigDecimal](C.RV_DESCUENTO2) ~
      SqlParser.get[Option[Int]](GC.LP_ID) ~
      SqlParser.get[Option[String]](GC.LP_NAME) ~
      SqlParser.get[Option[Int]](GC.LD_ID) ~
      SqlParser.get[Option[String]](GC.LD_NAME) ~
      SqlParser.get[BigDecimal](C.RV_COTIZACION) ~
      SqlParser.get[Option[Int]](C.PRO_ID_ORIGEN) ~
      SqlParser.get[Option[String]](C.PRO_ORIGEN_NAME) ~
      SqlParser.get[Option[Int]](C.PRO_ID_DESTINO) ~
      SqlParser.get[Option[String]](C.PRO_DESTINO_NAME) ~
      SqlParser.get[Option[Int]](GC.DEPL_ID) ~
      SqlParser.get[Option[String]](GC.DEPL_NAME) ~
      SqlParser.get[Option[Int]](GC.TRANS_ID) ~
      SqlParser.get[Option[String]](GC.TRANS_NAME) ~
      SqlParser.get[BigDecimal](C.RV_NETO) ~
      SqlParser.get[BigDecimal](C.RV_IVA_RI) ~
      SqlParser.get[BigDecimal](C.RV_IVA_RNI) ~
      SqlParser.get[BigDecimal](C.RV_SUBTOTAL) ~
      SqlParser.get[BigDecimal](C.RV_IMPORTE_DESC_1) ~
      SqlParser.get[BigDecimal](C.RV_IMPORTE_DESC_2) ~
      SqlParser.get[BigDecimal](C.RV_TOTAL) ~
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
          descrip ~
          doctId ~
          doctName ~
          monId ~
          monName ~
          taMascara ~
          taPropuesto ~
          firmado ~
          docMueveStock ~
          stId ~
          hasIvaRi ~
          hasIvaRni ~
          editable ~
          editMsg ~
          fecha ~
          fechaEntrega ~
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
          subTotal ~
          importeDesc1 ~
          importeDesc2 ~
          total ~
          createdAt ~
          updatedAt ~
          updatedBy =>
        RemitoVenta(
          id,
          RemitoVentaId(
            docId,
            docName,
            numero,
            nroDoc
          ),
          RemitoVentaBase(
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
            descrip
          ),
          RemitoVentaReferences(
            doctId,
            doctName,
            monId,
            monName,
            taMascara,
            taPropuesto != 0,
            firmado != 0,
            docMueveStock != 0,
            stId.getOrElse(DBHelper.NoId),
            hasIvaRi != 0,
            hasIvaRni != 0,
            editable != 0,
            editMsg
          ),
          RemitoVentaDates(
            fecha,
            fechaEntrega
          ),
          RemitoVentaPrecios(
            desc1.doubleValue(),
            desc2.doubleValue(),
            lpId.getOrElse(DBHelper.NoId),
            lpName.getOrElse(""),
            ldId.getOrElse(DBHelper.NoId),
            ldName.getOrElse("")
          ),
          RemitoVentaCotizacion(
            cotizacion.doubleValue()
          ),
          RemitoVentaStock(
            proIdOrigen.getOrElse(DBHelper.NoId),
            proNameOrigen.getOrElse(""),
            proIdDestino.getOrElse(DBHelper.NoId),
            proNameDestino.getOrElse(""),
            deplId.getOrElse(DBHelper.NoId),
            deplName.getOrElse(""),
            transId.getOrElse(DBHelper.NoId),
            transName.getOrElse("")
          ),
          RemitoVentaTotals(
            neto.doubleValue(),
            ivaRi.doubleValue(),
            ivaRni.doubleValue(),
            subTotal.doubleValue(),
            importeDesc1.doubleValue(),
            importeDesc2.doubleValue(),
            total.doubleValue()
          ),
          emptyRemitoVentaItems,
          createdAt,
          updatedAt,
          updatedBy)
    }
  }

  def createFromRemito(user: CompanyUser, remitoVenta: RemitoVenta): RemitoVenta = {
    save(user, remitoVenta, true)
  }

  def create(user: CompanyUser, remitoVenta: RemitoVenta): RemitoVenta = {
    save(user, remitoVenta, false)
  }

  def update(user: CompanyUser, remitoVenta: RemitoVenta): RemitoVenta = {
    save(user, remitoVenta, false)
  }

  private def save(user: CompanyUser, remitoVenta: RemitoVenta, isFromWizard: Boolean): RemitoVenta = {
    def getFields = {
      List(
        Field(C.RV_ID, remitoVenta.id, FieldType.number),
        Field(GC.DOC_ID, remitoVenta.ids.docId, FieldType.id),
        Field(C.RV_NRODOC, remitoVenta.ids.nroDoc, FieldType.text),
        Field(C.RV_NUMERO, remitoVenta.ids.numero, FieldType.number),

        Field(GC.CLI_ID, remitoVenta.base.cliId, FieldType.id),
        Field(GC.EST_ID, remitoVenta.base.estId, FieldType.id),
        Field(GC.CCOS_ID, remitoVenta.base.ccosId, FieldType.id),
        Field(GC.SUC_ID, remitoVenta.base.sucId, FieldType.id),
        Field(GC.CPG_ID, remitoVenta.base.cpgId, FieldType.id),
        Field(GC.LGJ_ID, remitoVenta.base.lgjId, FieldType.id),
        Field(GC.VEN_ID, remitoVenta.base.venId, FieldType.id),
        Field(GC.CLIS_ID, remitoVenta.base.clisId, FieldType.id),
        Field(C.RV_ORDEN_COMPRA, remitoVenta.base.ordenCompra, FieldType.text),
        Field(C.RV_DESCRIP, remitoVenta.base.descrip, FieldType.text),

        Field(C.RV_FECHA, remitoVenta.dates.fecha, FieldType.date),
        Field(C.RV_FECHA_ENTREGA, remitoVenta.dates.fechaEntrega, FieldType.date),

        Field(C.RV_DESCUENTO1, remitoVenta.precios.desc1, FieldType.currency),
        Field(C.RV_DESCUENTO2, remitoVenta.precios.desc2, FieldType.currency),
        Field(GC.LP_ID, remitoVenta.precios.lpId, FieldType.id),
        Field(GC.LD_ID, remitoVenta.precios.ldId, FieldType.id),

        Field(C.RV_COTIZACION, remitoVenta.cotizacion.cotizacion, FieldType.currency),

        Field(C.PRO_ID_ORIGEN, remitoVenta.stock.proIdOrigen, FieldType.id),
        Field(C.PRO_ID_DESTINO, remitoVenta.stock.proIdDestino, FieldType.id),
        Field(GC.DEPL_ID, remitoVenta.stock.deplId, FieldType.id),
        Field(GC.TRANS_ID, remitoVenta.stock.transId, FieldType.id),

        Field(C.RV_NETO, remitoVenta.totals.neto, FieldType.currency),
        Field(C.RV_IVA_RI, remitoVenta.totals.ivaRi, FieldType.currency),
        Field(C.RV_IVA_RNI, remitoVenta.totals.ivaRni, FieldType.currency),
        Field(C.RV_SUBTOTAL, remitoVenta.totals.subTotal, FieldType.currency),
        Field(C.RV_IMPORTE_DESC_1, remitoVenta.totals.importeDesc1, FieldType.currency),
        Field(C.RV_IMPORTE_DESC_2, remitoVenta.totals.importeDesc2, FieldType.currency),
        Field(C.RV_TOTAL, remitoVenta.totals.total, FieldType.currency)
      )
    }

    def getItemFields(item: RemitoVentaItem, rvTMPId: Int) = {
      List(
        Field(C.RV_TMP_ID, rvTMPId, FieldType.id),
        Field(C.RVI_ID, item.id, FieldType.number),
        Field(C.RVI_DESCRIP, item.base.descrip, FieldType.text),
        Field(C.RVI_DESCUENTO, item.base.descuento, FieldType.text),
        Field(GC.PR_ID, item.base.prId, FieldType.id),
        Field(GC.CCOS_ID, item.base.ccosId, FieldType.id),
        Field(GC.CUE_ID, item.base.cueId, FieldType.id),
        Field(C.CUE_ID_IVA_RI, item.base.cueIdIvaRi, FieldType.id),
        Field(C.CUE_ID_IVA_RNI, item.base.cueIdIvaRni, FieldType.id),
        Field(GC.STL_ID, item.base.stlId, FieldType.id),
        Field(C.RVI_ORDEN, item.base.orden, FieldType.integer),
        Field(C.RVI_CANTIDAD, item.totals.cantidad, FieldType.currency),
        Field(C.RVI_CANTIDAD_A_REMITIR, item.totals.cantidad, FieldType.currency),
        Field(C.RVI_PRECIO, item.totals.precio, FieldType.currency),
        Field(C.RVI_PRECIO_LISTA, item.totals.precioLista, FieldType.currency),
        Field(C.RVI_PRECIO_USR, item.totals.precioUser, FieldType.currency),
        Field(C.RVI_NETO, item.totals.neto, FieldType.currency),
        Field(C.RVI_IVA_RI, item.totals.ivaRi, FieldType.currency),
        Field(C.RVI_IVA_RNI, item.totals.ivaRni, FieldType.currency),
        Field(C.RVI_IVA_RI_PORC, item.totals.ivaRiPorc, FieldType.double),
        Field(C.RVI_IVA_RNI_PORC, item.totals.ivaRniPorc, FieldType.double),
        Field(C.RVI_IMPORTE, item.totals.importe, FieldType.currency)
      )
    }

    def getDeletedItemFields(rviId: Int, rvTMPId: Int) = {
      List(
        Field(C.RV_TMP_ID, rvTMPId, FieldType.id),
        Field(C.RVI_ID, rviId, FieldType.number),
        Field(C.RV_ID, remitoVenta.id, FieldType.id)
      )
    }

    def getSerieFields(item: RemitoVentaItemSerie, rvTMPId: Int, rviTMPId: Int, prId: Int) = {
      List(
        Field(C.RV_TMP_ID, rvTMPId, FieldType.id),
        Field(C.RVI_TMP_ID, rviTMPId, FieldType.id),
        Field(GC.PR_ID, prId, FieldType.id),
        Field(GC.PRNS_ID, item.id, FieldType.id),
        Field(GC.PRNS_CODE, item.code, FieldType.text),
        Field(GC.PRNS_DESCRIP, item.descrip, FieldType.text),
        Field(GC.PRNS_FECHA_VTO, item.fechaVto, FieldType.date)
      )
    }

    def throwError = {
      throwException(s"Error when saving ${C.REMITO_VENTA}")
    }

    def throwException(message: String) = {
      throw new RuntimeException(message)
    }

    def saveItemSerie(rvTMPId: Int, rviTMPId: Int, prId: Int)(item: RemitoVentaItemSerie) = {
      DBHelper.save(
        user,
        Register(
          C.REMITO_VENTA_ITEM_SERIE_TMP,
          C.RVIS_TMP_ID,
          DBHelper.NoId,
          false,
          false,
          false,
          getSerieFields(item, rvTMPId, rviTMPId, prId)),
        true
      ) match {
        case SaveResult(true, id) => true
        case SaveResult(false, id) => throwError
      }
    }

    case class RemitoVentaItemSerieInfo(
                                          rvTMPId: Int,
                                          rviTMPId: Int,
                                          prId: Int,
                                          series: List[RemitoVentaItemSerie])

    def saveItemSeries(serieInfo: RemitoVentaItemSerieInfo) = {
      serieInfo.series.map(saveItemSerie(serieInfo.rvTMPId, serieInfo.rviTMPId, serieInfo.prId))
    }

    case class RemitoVentaItemInfo(rvTMPId: Int, item: RemitoVentaItem)

    def saveItem(itemInfo: RemitoVentaItemInfo) = {
      DBHelper.save(
        user,
        Register(
          C.REMITO_VENTA_ITEM_TMP,
          C.RVI_TMP_ID,
          DBHelper.NoId,
          false,
          false,
          false,
          getItemFields(itemInfo.item, itemInfo.rvTMPId)),
        true
      ) match {
        case SaveResult(true, id) => {
          RemitoVentaItemSerieInfo(
            itemInfo.rvTMPId, id, itemInfo.item.base.prId, itemInfo.item.series)
        }
        case SaveResult(false, id) => throwError
      }
    }

    def saveDeletedItem(rvTMPId: Int)(rviId: String) = {
      val id = G.getIntOrZero(rviId)
      if(id != 0) {
        DBHelper.save(
          user,
          Register(
            C.REMITO_VENTA_ITEM_BORRADO_TMP,
            C.RVIB_TMP_ID,
            DBHelper.NoId,
            false,
            false,
            false,
            getDeletedItemFields(id, rvTMPId)),
          true
        ) match {
          case SaveResult(false, id) => throwError
          case _ =>
        }
      }
    }

    def saveItems(rvTMPId: Int) = {
      remitoVenta.items.items.map(item => saveItem(RemitoVentaItemInfo(rvTMPId, item))).map(saveItemSeries)
      remitoVenta.items.itemDeleted.split(",").map(saveDeletedItem(rvTMPId))
    }

    case class RowResult(rowType: String, id: Int, message: String)

    def saveFromWizard(rvTMPId: Int) = {

      DB.withTransaction(user.database.database) { implicit connection =>
        val sql = "select * from sp_doc_remito_venta_wizard_save(?)"
        val cs = connection.prepareStatement(sql)

        cs.setInt(1, rvTMPId)

        try {
          cs.executeQuery()
        } catch {
          case NonFatal(e) => {
            Logger.error(s"can't save ${C.REMITO_VENTA} with id ${remitoVenta.id} for user ${user.toString}. Error ${e.toString}")
            throw e
          }
        } finally {
          cs.close
        }
      }
    }

    def executeSave(rvTMPId: Int): List[RowResult] = {

      DB.withTransaction(user.database.database) { implicit connection =>
        val sql = "select * from sp_doc_remito_venta_save(?, ?)"
        val cs = connection.prepareStatement(sql)

        cs.setInt(1, user.masterUserId)
        cs.setInt(2, rvTMPId)

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
          * ex: CREATE OR REPLACE FUNCTION sp_doc_remito_venta_save( params )
          *     RETURNS SETOF row_result AS ...
          *
          * the field type is used to identify the value in the row. there are three
          * kind of types: resultset, success, key
          * for first two (resultset and success) the value of type is string with
          * one of these two values ex: 'resultset' or 'success'
          * when type == 'resultset' the field r must be not null and contain a ResultSet
          * when type == 'success' the id field can contain 0 (False) or not 0 (-1,1 or any other number but NO 0) (True)
          * the last kind of type is key. in this case the key must be the name of a column like rv_id, as_id, pr_id, etc
          * it can be any column name. if the type is an integer like in rv_id, as_id or any other id column the field id
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
                case "rv_id" => RowResult("rv_id", rs.getInt(2), "")
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
            Logger.error(s"can't save ${C.REMITO_VENTA} with id ${remitoVenta.id} for user ${user.toString}. Error ${e.toString}")
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
            case RowResult("rv_id", id, m) => id
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
        C.REMITO_VENTA_TMP,
        C.RV_TMP_ID,
        DBHelper.NoId,
        false,
        true,
        true,
        getFields),
      true
    ) match {
      case SaveResult(true, rvTMPId) => {
        saveItems(rvTMPId)
        if(isFromWizard) saveFromWizard(rvTMPId)
        val messagesAndId = executeSave(rvTMPId)
        val id = getIdFromMessages(messagesAndId)
        load(user, id).getOrElse(throwError)
      }
      case SaveResult(false, id) => throwError
    }

  }

  def load(user: CompanyUser, id: Int): Option[RemitoVenta] = {

    DB.withTransaction(user.database.database) { implicit connection =>

      val sql = "{call sp_doc_remito_venta_get(?, ?, ?, ?)}"
      val cs = connection.prepareCall(sql)

      cs.setInt(1, user.cairoCompanyId)
      cs.setInt(2, id)
      cs.setInt(3, user.masterUserId)
      cs.registerOutParameter(4, Types.OTHER)

      try {
        cs.execute()

        val rs = cs.getObject(4).asInstanceOf[java.sql.ResultSet]
        Sql.as(remitoVentaParser.singleOpt, rs)

      } catch {
        case NonFatal(e) => {
          Logger.error(s"can't get ${C.REMITO_VENTA} with id $id for user ${user.toString}. Error ${e.toString}")
          throw e
        }
      } finally {
        cs.close
      }
    }
  }

  private def loadRemitoVentaItems(user: CompanyUser, id: Int) = {
    val items = loadItems(user, id)
    RemitoVentaItems(
      items._1,
      items._2,
      items._3,
      ""
    )
  }

  private def loadItems(user: CompanyUser, id: Int) = {

    DB.withTransaction(user.database.database) { implicit connection =>

      val sql = "{call sp_doc_remito_venta_get_items(?, ?, ?, ?)}"
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
          Sql.as(remitoVentaItemParser.*, rs),
          Sql.as(remitoVentaItemSerieParser.*, rsSerie),
          Sql.as(remitoVentaItemKitParser.*, rsKit)
        )

      } catch {
        case NonFatal(e) => {
          Logger.error(s"can't get ${C.REMITO_VENTA_ITEM} with id $id for user ${user.toString}. Error ${e.toString}")
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
        SQL("sp_doc_remito_venta_delete {id}, {empId}, {usId}")
          .on('id -> id, 'empId -> user.cairoCompanyId, 'usId -> user.masterUserId)
          .executeUpdate
      } catch {
        case NonFatal(e) => {
          Logger.error(s"can't delete a ${C.REMITO_VENTA}. ${C.RV_ID} id: $id. Error ${e.toString}")
          throw e
        }
      }
    }
  }

  def get(user: CompanyUser, id: Int): RemitoVenta = {
    load(user, id) match {
      case Some(p) => {
        RemitoVenta(
          p.id,

          p.ids,
          p.base,
          p.references,
          p.dates,
          p.precios,
          p.cotizacion,
          p.stock,
          p.totals,

          loadRemitoVentaItems(user, id)
        )
      }
      case None => emptyRemitoVenta
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

  def saveParams(user: CompanyUser, remitoVentaParams: RemitoVentaParams): RemitoVentaParams = {
    val baseFields = List(
      Field(GC.EMP_ID, user.cairoCompanyId, FieldType.id),
      Field(GC.US_ID, user.masterUserId, FieldType.id),
      Field(GC.PRE_ID, S.LIST_REMITO_VENTA, FieldType.id)
    )

    def throwException = {
      throw new RuntimeException(s"Error when saving ${C.REMITO_VENTA}")
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
        Field(GC.LDP_VALOR, remitoVentaParams.from, FieldType.text)
      ),
      List(
        Field(GC.LDP_ID, K_FECHA_FIN, FieldType.integer),
        Field(GC.LDP_ORDEN, 10, FieldType.integer),
        Field(GC.LDP_VALOR, remitoVentaParams.to, FieldType.text)
      ),
      List(
        Field(GC.LDP_ID, K_CLI_ID, FieldType.integer),
        Field(GC.LDP_ORDEN, 20, FieldType.integer),
        Field(GC.LDP_VALOR, remitoVentaParams.cliId, FieldType.text)
      ),
      List(
        Field(GC.LDP_ID, K_EST_ID, FieldType.integer),
        Field(GC.LDP_ORDEN, 30, FieldType.integer),
        Field(GC.LDP_VALOR, remitoVentaParams.estId, FieldType.text)
      ),
      List(
        Field(GC.LDP_ID, K_CCOS_ID, FieldType.integer),
        Field(GC.LDP_ORDEN, 40, FieldType.integer),
        Field(GC.LDP_VALOR, remitoVentaParams.ccosId, FieldType.text)
      ),
      List(
        Field(GC.LDP_ID, K_SUC_ID, FieldType.integer),
        Field(GC.LDP_ORDEN, 50, FieldType.integer),
        Field(GC.LDP_VALOR, remitoVentaParams.sucId, FieldType.text)
      ),
      List(
        Field(GC.LDP_ID, K_DOC_ID, FieldType.integer),
        Field(GC.LDP_ORDEN, 60, FieldType.integer),
        Field(GC.LDP_VALOR, remitoVentaParams.docId, FieldType.text)
      ),
      List(
        Field(GC.LDP_ID, K_CPG_ID, FieldType.integer),
        Field(GC.LDP_ORDEN, 70, FieldType.integer),
        Field(GC.LDP_VALOR, remitoVentaParams.cpgId, FieldType.text)
      ),
      List(
        Field(GC.LDP_ID, K_EMP_ID, FieldType.integer),
        Field(GC.LDP_ORDEN, 80, FieldType.integer),
        Field(GC.LDP_VALOR, remitoVentaParams.empId, FieldType.text)
      )
    )

    DB.withConnection(user.database.database) { implicit connection =>
      try {
        SQL(s"""DELETE FROM ListaDocumentoParametro
               | WHERE pre_id = {preId}
               | AND (emp_id is null or emp_id = {empId})
               | AND us_id = {usId}""".stripMargin)
          .on(
            'preId -> S.LIST_REMITO_VENTA,
            'empId -> user.cairoCompanyId,
            'usId -> user.masterUserId
          )
          .executeUpdate
      } catch {
        case NonFatal(e) => {
          Logger.error(s"can't save parameters for RemitoVenta")
          throw e
        }
      }
    }

    paramList.map(param => saveParam(baseFields ::: param))

    loadParams(user).getOrElse(throwException)
  }

  def loadParams(user: CompanyUser): Option[RemitoVentaParams] = {

    val params = DocumentListParam.load(user, S.LIST_REMITO_VENTA)

    if(params.isEmpty) {
      Some(emptyRemitoVentaParams)
    }
    else {
      val cli = DocumentListParam.getParamValue(
        user, K_CLI_ID, params, emptyRemitoVentaParams.cliId,
        GC.PROVEEDOR, GC.CLI_ID, GC.CLI_NAME
      )
      val est = DocumentListParam.getParamValue(
        user, K_EST_ID, params, emptyRemitoVentaParams.estId,
        GC.ESTADO, GC.EST_ID, GC.EST_NAME
      )
      val ccos = DocumentListParam.getParamValue(
        user, K_CCOS_ID, params, emptyRemitoVentaParams.ccosId,
        GC.CENTRO_COSTO, GC.CCOS_ID, GC.CCOS_NAME
      )
      val suc = DocumentListParam.getParamValue(
        user, K_SUC_ID, params, emptyRemitoVentaParams.sucId,
        GC.SUCURSAL, GC.SUC_ID, GC.SUC_NAME
      )
      val ven = DocumentListParam.getParamValue(
        user, K_VEN_ID, params, emptyRemitoVentaParams.venId,
        GC.VENDEDOR, GC.VEN_ID, GC.VEN_NAME
      )
      val doc = DocumentListParam.getParamValue(
        user, K_DOC_ID, params, emptyRemitoVentaParams.docId,
        GC.DOCUMENTO, GC.DOC_ID, GC.DOC_NAME
      )
      val cpg = DocumentListParam.getParamValue(
        user, K_CPG_ID, params, emptyRemitoVentaParams.cpgId,
        GC.CONDICION_PAGO, GC.CPG_ID, GC.CPG_NAME
      )
      val emp = DocumentListParam.getParamValue(
        user, K_EMP_ID, params, emptyRemitoVentaParams.empId,
        GC.EMPRESA, GC.EMP_ID, GC.EMP_NAME
      )

      Some(
        RemitoVentaParams(
          DocumentListParam.getParamValue(K_FECHA_INI, params, emptyRemitoVentaParams.from),
          DocumentListParam.getParamValue(K_FECHA_FIN, params, emptyRemitoVentaParams.to),
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

      val sql = "{call sp_lsdoc_remitos_venta(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)}"
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
          Logger.error(s"can't get listing of remitos de venta for user ${user.toString}. Error ${e.toString}")
          throw e
        }
      } finally {
        cs.close
      }
    }
  }

  def listRemitos(user: CompanyUser, cliId: Int, currencyId: Int): Recordset = {

    DB.withTransaction(user.database.database) { implicit connection =>

      val sql = "{call sp_doc_remito_venta_get_remitos(?, ?, ?, ?)}"
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

      val sql = "{call sp_doc_remito_venta_get_remitos_items(?, ?)}"
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

      val sql = "{call sp_doc_remito_venta_get_aplic(?, ?, ?, ?)}"
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

  def saveAplic(user: CompanyUser, remitoVentaAplic: RemitoVentaAplic): Int = {
    def getFields = {
      List(
        Field(C.RV_ID, remitoVentaAplic.rvId, FieldType.number),
        Field(C.RV_NUMERO, remitoVentaAplic.rvId, FieldType.number),
        Field(GC.DOC_ID, remitoVentaAplic.docId, FieldType.id),
        Field(GC.EST_ID, DocumentEditStatus.PENDING, FieldType.id),
        Field(GC.SUC_ID, DBHelper.NoId, FieldType.number),
        Field(GC.PROV_ID, DBHelper.NoId, FieldType.number),
        Field(GC.CPG_ID, CondicionPago.FECHA_DOCUMENTO, FieldType.id)
      )
    }

    def getPedidoVentaFields(item: RemitoVentaPedidoVentaItem, rvTMPId: Int) = {
      List(
        Field(C.RV_TMP_ID, rvTMPId, FieldType.id),
        Field(C.PVI_ID, item.pviId, FieldType.id),
        Field(C.RVI_ID, item.rviId, FieldType.id),
        Field(C.PV_RV_CANTIDAD, item.pvfvCantidad, FieldType.currency),
        Field(C.PV_RV_ID, item.pvrvId, FieldType.id)
      )
    }

    def throwError = {
      throwException(s"Error when saving application of ${C.REMITO_VENTA}")
    }

    def throwException(message: String) = {
      throw new RuntimeException(message)
    }

    case class PedidoVentaInfo(rvTMPId: Int, item: RemitoVentaPedidoVentaItem)

    def savePedidoVenta(itemInfo: PedidoVentaInfo) = {
      DBHelper.save(
        user,
        Register(
          C.PEDIDO_REMITO_VENTA_TMP,
          C.PV_RV_TMP_ID,
          DBHelper.NoId,
          false,
          false,
          false,
          getPedidoVentaFields(itemInfo.item, itemInfo.rvTMPId)),
        true
      ) match {
        case SaveResult(true, id) => true
        case SaveResult(false, id) => throwError
      }
    }

    def savePedidosVenta(rvTMPId: Int) = {
      remitoVentaAplic.pedidoVenta.map(item => savePedidoVenta(PedidoVentaInfo(rvTMPId, item)))
    }

    case class RowResult(rowType: String, id: Int, message: String)

    def executeSave(rvTMPId: Int): List[RowResult] = {

      DB.withTransaction(user.database.database) { implicit connection =>
        val sql = "select * from sp_doc_remito_venta_save_aplic(?, ?)"
        val cs = connection.prepareStatement(sql)

        cs.setInt(1, user.masterUserId)
        cs.setInt(2, rvTMPId)

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
          * ex: CREATE OR REPLACE FUNCTION sp_doc_remito_venta_save( params )
          *     RETURNS SETOF row_result AS ...
          *
          * the field type is used to identify the value in the row. there are three
          * kind of types: resultset, success, key
          * for first two (resultset and success) the value of type is string with
          * one of these two values ex: 'resultset' or 'success'
          * when type == 'resultset' the field r must be not null and contain a ResultSet
          * when type == 'success' the id field can contain 0 (False) or not 0 (-1,1 or any other number but NO 0) (True)
          * the last kind of type is key. in this case the key must be the name of a column like rv_id, as_id, pr_id, etc
          * it can be any column name. if the type is an integer like in rv_id, as_id or any other id column the field id
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
                case "rv_id" => RowResult("rv_id", rs.getInt(2), "")
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
            Logger.error(s"can't save application of ${C.REMITO_VENTA} with id ${remitoVentaAplic.rvId} for user ${user.toString}. Error ${e.toString}")
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
            case RowResult("rv_id", id, m) => id
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
        C.REMITO_VENTA_TMP,
        C.RV_TMP_ID,
        DBHelper.NoId,
        false,
        true,
        true,
        getFields),
      true
    ) match {
      case SaveResult(true, rvTMPId) => {
        savePedidosVenta(rvTMPId)
        val messagesAndId = executeSave(rvTMPId)
        getIdFromMessages(messagesAndId)
      }
      case SaveResult(false, id) => throwError
    }

  }
}