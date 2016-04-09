package models.cairo.modules.ventas

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
import models.cairo.modules.general.VentaModo

case class PedidoVentaId(
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

object PedidoVentaId {

  def apply(
             docId: Int,
             numero: Int,
             nroDoc: String) = {

    new PedidoVentaId(
      docId,
      numero,
      nroDoc)
  }
}

case class PedidoVentaReferences(
                              doctId: Int,
                              doctName: String,
                              monId: Int,
                              monName: String,
                              taMascara: String,
                              taPropuesto: Boolean,
                              firmado: Boolean,
                              docTipoPedido: Int,
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
            docTipoPedido: Int,
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
      docTipoPedido,
      hasIvaRi,
      hasIvaRni,
      editable,
      editMsg
    )
  }
}

object PedidoVentaReferences {

  def apply(
             doctId: Int,
             monId: Int,
             taMascara: String,
             taPropuesto: Boolean,
             firmado: Boolean,
             docTipoPedido: Int,
             hasIvaRi: Boolean,
             hasIvaRni: Boolean,
             editable: Boolean,
             editMsg: String
             ) = {

    new PedidoVentaReferences(
      doctId,
      monId,
      taMascara,
      taPropuesto,
      firmado,
      docTipoPedido,
      hasIvaRi,
      hasIvaRni,
      editable,
      editMsg
    )
  }
}

case class PedidoVentaBase(
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
      "",
      descrip
    )
  }
}

object PedidoVentaBase {

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

    new PedidoVentaBase(
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

case class PedidoVentaPrecios(
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

object PedidoVentaPrecios {

  def apply(
             desc1: Double,
             desc2: Double,
             lpId: Int,
             ldId: Int) = {

    new PedidoVentaPrecios(
      desc1,
      desc2,
      lpId,
      ldId)
  }
}

case class PedidoVentaDates(
                               fecha: Date,
                               fechaEntrega: Date
                             )

case class PedidoVentaStock(
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

object PedidoVentaStock {

  def apply(
             proIdOrigen: Int,
             proIdDestino: Int,
             deplId: Int,
             transId: Int) = {

    new PedidoVentaStock(
      proIdOrigen,
      proIdDestino,
      deplId,
      transId)
  }
}

case class PedidoVentaTotals(
                                neto: Double,
                                ivaRi: Double,
                                ivaRni: Double,
                                subTotal: Double,
                                importeDesc1: Double,
                                importeDesc2: Double,
                                total: Double
                              )

case class PedidoVentaItemBase(
                                   descrip: String,
                                   descuento: String,
                                   prId: Int,
                                   prName: String,
                                   ccosId: Int,
                                   ccosName: String,
                                   orden: Int,
                                   unName: String
                                   )

object PedidoVentaItemBase {

  def apply(descrip: String,
            descuento: String,
            prId: Int,
            ccosId: Int,
            orden: Int) = {

    new PedidoVentaItemBase(
      descrip,
      descuento,
      prId,
      "",
      ccosId,
      "",
      orden,
      ""
    )
  }
}

case class PedidoVentaItemTotals(
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

case class PedidoVentaItem(
                              id: Int,
                              base: PedidoVentaItemBase,
                              totals: PedidoVentaItemTotals
                            )

case class PedidoVentaPresupuesto(
                                   prviId: Int,
                                   cantidad: Double,
                                   pviId: Int
                                  )

case class PedidoVentaItems(
                                items: List[PedidoVentaItem],

                                /* only used in save */
                                itemDeleted: String,

                                presupuestos: List[PedidoVentaPresupuesto]
                             )

case class PedidoVenta(
                          id: Int,

                          ids: PedidoVentaId,
                          base: PedidoVentaBase,
                          references: PedidoVentaReferences,
                          dates: PedidoVentaDates,
                          precios: PedidoVentaPrecios,
                          stock: PedidoVentaStock,
                          totals: PedidoVentaTotals,

                          items: PedidoVentaItems,

                          createdAt: Date,
                          updatedAt: Date,
                          updatedBy: Int
                        ) {

  def this(
            id: Int,

            ids: PedidoVentaId,
            base: PedidoVentaBase,
            references: PedidoVentaReferences,
            dates: PedidoVentaDates,
            precios: PedidoVentaPrecios,
            stock: PedidoVentaStock,
            totals: PedidoVentaTotals,

            items: PedidoVentaItems) = {

    this(
      id,

      ids,
      base,
      references,
      dates,
      precios,
      stock,
      totals,

      items,

      DateUtil.currentTime,
      DateUtil.currentTime,
      DBHelper.NoId)
  }

  def this(
            ids: PedidoVentaId,
            base: PedidoVentaBase,
            references: PedidoVentaReferences,
            dates: PedidoVentaDates,
            precios: PedidoVentaPrecios,
            stock: PedidoVentaStock,
            totals: PedidoVentaTotals,

            items: PedidoVentaItems) = {

    this(
      DBHelper.NoId,

      ids,
      base,
      references,
      dates,
      precios,
      stock,
      totals,

      items
    )
  }

}

case class PedidoVentaParams(
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
                                empName: String,
                                ventaModos: List[VentaModo]
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
      "",
      List()
    )
  }
}

object PedidoVentaParams {
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

    new PedidoVentaParams(
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

object PedidoVenta {

  lazy val GC = models.cairo.modules.general.C

  lazy val emptyPedidoVentaItems = PedidoVentaItems(List(), "", List())

  lazy val emptyPedidoVentaReferences = PedidoVentaReferences(
    DBHelper.NoId, DBHelper.NoId, "", false, false, 0, false, false, false, "")

  lazy val emptyPedidoVenta = PedidoVenta(
    PedidoVentaId(DBHelper.NoId, 0, ""),
    PedidoVentaBase(DBHelper.NoId, DBHelper.NoId, DBHelper.NoId, DBHelper.NoId, DBHelper.NoId, DBHelper.NoId, DBHelper.NoId, DBHelper.NoId, "", ""),
    emptyPedidoVentaReferences,
    PedidoVentaDates(U.NO_DATE, U.NO_DATE),
    PedidoVentaPrecios(0.0, 0.0, DBHelper.NoId, DBHelper.NoId),
    PedidoVentaStock(DBHelper.NoId, DBHelper.NoId, DBHelper.NoId, DBHelper.NoId),
    PedidoVentaTotals(0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0),
    emptyPedidoVentaItems
  )

  lazy val emptyPedidoVentaParams = PedidoVentaParams(
    DateFormatter.format(DateUtil.plusDays(DateUtil.currentTime, -60)),
    DateFormatter.format(DateUtil.currentTime), "0", "", "0", "", "0", "", "0", "", "0", "", "0", "", "0", "", "0", "", List())

  def apply(
             id: Int,

             ids: PedidoVentaId,
             base: PedidoVentaBase,
             references: PedidoVentaReferences,
             dates: PedidoVentaDates,
             precios: PedidoVentaPrecios,
             stock: PedidoVentaStock,
             totals: PedidoVentaTotals,

             items: PedidoVentaItems
             ) = {

    new PedidoVenta(
      id,

      ids,
      base,
      references,
      dates,
      precios,
      stock,
      totals,

      items
    )
  }

  def apply(
             id: Int,

             ids: PedidoVentaId,
             base: PedidoVentaBase,
             references: PedidoVentaReferences,
             dates: PedidoVentaDates,
             precios: PedidoVentaPrecios,
             stock: PedidoVentaStock,
             totals: PedidoVentaTotals
             ) = {

    new PedidoVenta(
      id,

      ids,
      base,
      references,
      dates,
      precios,
      stock,
      totals,

      emptyPedidoVentaItems
    )
  }

  def apply(
             ids: PedidoVentaId,
             base: PedidoVentaBase,
             references: PedidoVentaReferences,
             dates: PedidoVentaDates,
             precios: PedidoVentaPrecios,
             stock: PedidoVentaStock,
             totals: PedidoVentaTotals,

             items: PedidoVentaItems
             ) = {

    new PedidoVenta(
      ids,
      base,
      references,
      dates,
      precios,
      stock,
      totals,

      items
    )
  }

  def apply(
             ids: PedidoVentaId,
             base: PedidoVentaBase,
             references: PedidoVentaReferences,
             dates: PedidoVentaDates,
             precios: PedidoVentaPrecios,
             stock: PedidoVentaStock,
             totals: PedidoVentaTotals
             ) = {

    new PedidoVenta(

      ids,
      base,
      references,
      dates,
      precios,
      stock,
      totals,

      emptyPedidoVentaItems
    )
  }

  private val pedidoVentaItemParser: RowParser[PedidoVentaItem] = {
    SqlParser.get[Int](C.PVI_ID) ~
    SqlParser.get[BigDecimal](C.PVI_CANTIDAD) ~
    SqlParser.get[String](C.PVI_DESCRIP) ~
    SqlParser.get[String](C.PVI_DESCUENTO) ~
    SqlParser.get[BigDecimal](C.PVI_PRECIO) ~
    SqlParser.get[BigDecimal](C.PVI_PRECIO_LISTA) ~
    SqlParser.get[BigDecimal](C.PVI_PRECIO_USR) ~
    SqlParser.get[BigDecimal](C.PVI_NETO) ~
    SqlParser.get[BigDecimal](C.PVI_IVA_RI) ~
    SqlParser.get[BigDecimal](C.PVI_IVA_RNI) ~
    SqlParser.get[BigDecimal](C.PVI_IVA_RIPORC) ~
    SqlParser.get[BigDecimal](C.PVI_IVA_RNIPORC) ~
    SqlParser.get[Int](GC.PR_ID) ~
    SqlParser.get[String](GC.PR_NAME_VENTA) ~
    SqlParser.get[Option[Int]](GC.CCOS_ID) ~
    SqlParser.get[Option[String]](GC.CCOS_NAME) ~
    SqlParser.get[BigDecimal](C.PVI_IMPORTE) ~
    SqlParser.get[Int](C.PVI_ORDEN) ~
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
        importe ~
        orden ~
        unName =>
      PedidoVentaItem(
        id,
        PedidoVentaItemBase(
          descrip,
          descuento,
          prId,
          prName,
          ccosId.getOrElse(DBHelper.NoId),
          ccosName.getOrElse(""),
          orden,
          unName
        ),
        PedidoVentaItemTotals(
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
        )
      )
    }
  }

  private val pedidoVentaParser: RowParser[PedidoVenta] = {
    SqlParser.get[Int](C.PV_ID) ~
    SqlParser.get[Int](GC.DOC_ID) ~
    SqlParser.get[String](GC.DOC_NAME) ~
    SqlParser.get[Int](C.PV_NUMERO) ~
    SqlParser.get[String](C.PV_NRODOC) ~
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
    SqlParser.get[String](C.PV_ORDEN_COMPRA) ~
    SqlParser.get[String](C.PV_DESCRIP) ~
    SqlParser.get[Int](GC.DOCT_ID) ~
    SqlParser.get[String](GC.DOCT_NAME) ~
    SqlParser.get[Int](GC.MON_ID) ~
    SqlParser.get[String](GC.MON_NAME) ~
    SqlParser.get[String](GC.TA_MASCARA) ~
    SqlParser.get[Int](GC.TA_PROPUESTO) ~
    SqlParser.get[Int](C.PV_FIRMADO) ~
    SqlParser.get[Int](GC.DOC_TIPO_PEDIDO) ~
    SqlParser.get[Int](GC.HAS_IVA_RI) ~
    SqlParser.get[Int](GC.HAS_IVA_RNI) ~
    SqlParser.get[Int](GC.EDITABLE) ~
    SqlParser.get[String](GC.EDIT_MSG) ~
    SqlParser.get[Date](C.PV_FECHA) ~
    SqlParser.get[Date](C.PV_FECHA_ENTREGA) ~
    SqlParser.get[BigDecimal](C.PV_DESCUENTO1) ~
    SqlParser.get[BigDecimal](C.PV_DESCUENTO2) ~
    SqlParser.get[Option[Int]](GC.LP_ID) ~
    SqlParser.get[Option[String]](GC.LP_NAME) ~
    SqlParser.get[Option[Int]](GC.LD_ID) ~
    SqlParser.get[Option[String]](GC.LD_NAME) ~
    SqlParser.get[Option[Int]](C.PRO_ID_ORIGEN) ~
    SqlParser.get[Option[String]](C.PRO_ORIGEN_NAME) ~
    SqlParser.get[Option[Int]](C.PRO_ID_DESTINO) ~
    SqlParser.get[Option[String]](C.PRO_DESTINO_NAME) ~
    SqlParser.get[Option[Int]](GC.DEPL_ID) ~
    SqlParser.get[Option[String]](GC.DEPL_NAME) ~
    SqlParser.get[Option[Int]](GC.TRANS_ID) ~
    SqlParser.get[Option[String]](GC.TRANS_NAME) ~
    SqlParser.get[BigDecimal](C.PV_NETO) ~
    SqlParser.get[BigDecimal](C.PV_IVA_RI) ~
    SqlParser.get[BigDecimal](C.PV_IVA_RNI) ~
    SqlParser.get[BigDecimal](C.PV_SUBTOTAL) ~
    SqlParser.get[BigDecimal](C.PV_IMPORTE_DESC_1) ~
    SqlParser.get[BigDecimal](C.PV_IMPORTE_DESC_2) ~
    SqlParser.get[BigDecimal](C.PV_TOTAL) ~
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
        docTipoPedido ~
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
      PedidoVenta(
        id,
        PedidoVentaId(
          docId,
          docName,
          numero,
          nroDoc
        ),
        PedidoVentaBase(
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
        PedidoVentaReferences(
          doctId,
          doctName,
          monId,
          monName,
          taMascara,
          taPropuesto != 0,
          firmado != 0,
          docTipoPedido,
          hasIvaRi != 0,
          hasIvaRni != 0,
          editable != 0,
          editMsg
        ),
        PedidoVentaDates(
          fecha,
          fechaEntrega
        ),
        PedidoVentaPrecios(
          desc1.doubleValue(),
          desc2.doubleValue(),
          lpId.getOrElse(DBHelper.NoId),
          lpName.getOrElse(""),
          ldId.getOrElse(DBHelper.NoId),
          ldName.getOrElse("")
        ),
        PedidoVentaStock(
          proIdOrigen.getOrElse(DBHelper.NoId),
          proNameOrigen.getOrElse(""),
          proIdDestino.getOrElse(DBHelper.NoId),
          proNameDestino.getOrElse(""),
          deplId.getOrElse(DBHelper.NoId),
          deplName.getOrElse(""),
          transId.getOrElse(DBHelper.NoId),
          transName.getOrElse("")
        ),
        PedidoVentaTotals(
          neto.doubleValue(),
          ivaRi.doubleValue(),
          ivaRni.doubleValue(),
          subTotal.doubleValue(),
          importeDesc1.doubleValue(),
          importeDesc2.doubleValue(),
          total.doubleValue()
        ),
        emptyPedidoVentaItems,
        createdAt,
        updatedAt,
        updatedBy)
    }
  }

  def createFromPresupuesto(user: CompanyUser, pedidoVenta: PedidoVenta): PedidoVenta = {
    save(user, pedidoVenta, true)
  }

  def create(user: CompanyUser, pedidoVenta: PedidoVenta): PedidoVenta = {
    save(user, pedidoVenta, false)
  }

  def update(user: CompanyUser, pedidoVenta: PedidoVenta): PedidoVenta = {
    save(user, pedidoVenta, false)
  }

  // TODO: this function must call sp_DocNCPedidoVentaSaveAplic and call showFacturaDuplicada
  //       to return info about this error use the field pedido_duplicada to return the info

  private def save(user: CompanyUser, pedidoVenta: PedidoVenta, isFromWizard: Boolean): PedidoVenta = {
    def getFields = {
      List(
        Field(C.PV_ID, pedidoVenta.id, FieldType.number),
        Field(GC.DOC_ID, pedidoVenta.ids.docId, FieldType.id),
        Field(C.PV_NRODOC, pedidoVenta.ids.nroDoc, FieldType.text),
        Field(C.PV_NUMERO, pedidoVenta.ids.numero, FieldType.number),

        Field(GC.CLI_ID, pedidoVenta.base.cliId, FieldType.id),
        Field(GC.EST_ID, pedidoVenta.base.estId, FieldType.id),
        Field(GC.CCOS_ID, pedidoVenta.base.ccosId, FieldType.id),
        Field(GC.SUC_ID, pedidoVenta.base.sucId, FieldType.id),
        Field(GC.CPG_ID, pedidoVenta.base.cpgId, FieldType.id),
        Field(GC.LGJ_ID, pedidoVenta.base.lgjId, FieldType.id),
        Field(GC.VEN_ID, pedidoVenta.base.venId, FieldType.id),
        Field(GC.CLIS_ID, pedidoVenta.base.clisId, FieldType.id),
        Field(C.PV_ORDEN_COMPRA, pedidoVenta.base.ordenCompra, FieldType.text),
        Field(C.PV_DESCRIP, pedidoVenta.base.descrip, FieldType.text),

        Field(C.PV_FECHA, pedidoVenta.dates.fecha, FieldType.date),
        Field(C.PV_FECHA_ENTREGA, pedidoVenta.dates.fechaEntrega, FieldType.date),

        Field(C.PV_DESCUENTO1, pedidoVenta.precios.desc1, FieldType.currency),
        Field(C.PV_DESCUENTO2, pedidoVenta.precios.desc2, FieldType.currency),
        Field(GC.LP_ID, pedidoVenta.precios.lpId, FieldType.id),
        Field(GC.LD_ID, pedidoVenta.precios.ldId, FieldType.id),

        Field(C.PRO_ID_ORIGEN, pedidoVenta.stock.proIdOrigen, FieldType.id),
        Field(C.PRO_ID_DESTINO, pedidoVenta.stock.proIdDestino, FieldType.id),
        Field(GC.DEPL_ID, pedidoVenta.stock.deplId, FieldType.id),
        Field(GC.TRANS_ID, pedidoVenta.stock.transId, FieldType.id),

        Field(C.PV_NETO, pedidoVenta.totals.neto, FieldType.currency),
        Field(C.PV_IVA_RI, pedidoVenta.totals.ivaRi, FieldType.currency),
        Field(C.PV_IVA_RNI, pedidoVenta.totals.ivaRni, FieldType.currency),
        Field(C.PV_SUBTOTAL, pedidoVenta.totals.subTotal, FieldType.currency),
        Field(C.PV_IMPORTE_DESC_1, pedidoVenta.totals.importeDesc1, FieldType.currency),
        Field(C.PV_IMPORTE_DESC_2, pedidoVenta.totals.importeDesc2, FieldType.currency),
        Field(C.PV_TOTAL, pedidoVenta.totals.total, FieldType.currency)
      )
    }

    def getItemFields(item: PedidoVentaItem, pvTMPId: Int) = {
      List(
        Field(C.PV_TMP_ID, pvTMPId, FieldType.id),
        Field(C.PVI_ID, item.id, FieldType.number),
        Field(C.PVI_DESCRIP, item.base.descrip, FieldType.text),
        Field(C.PVI_DESCUENTO, item.base.descuento, FieldType.text),
        Field(GC.PR_ID, item.base.prId, FieldType.id),
        Field(GC.CCOS_ID, item.base.ccosId, FieldType.id),
        Field(C.PVI_ORDEN, item.base.orden, FieldType.integer),
        Field(C.PVI_CANTIDAD, item.totals.cantidad, FieldType.currency),
        Field(C.PVI_CANTIDAD_A_REMITIR, item.totals.cantidad, FieldType.currency),
        Field(C.PVI_PRECIO, item.totals.precio, FieldType.currency),
        Field(C.PVI_PRECIO_LISTA, item.totals.precioLista, FieldType.currency),
        Field(C.PVI_PRECIO_USR, item.totals.precioUser, FieldType.currency),
        Field(C.PVI_NETO, item.totals.neto, FieldType.currency),
        Field(C.PVI_IVA_RI, item.totals.ivaRi, FieldType.currency),
        Field(C.PVI_IVA_RNI, item.totals.ivaRni, FieldType.currency),
        Field(C.PVI_IVA_RIPORC, item.totals.ivaRiPorc, FieldType.double),
        Field(C.PVI_IVA_RNIPORC, item.totals.ivaRniPorc, FieldType.double),
        Field(C.PVI_IMPORTE, item.totals.importe, FieldType.currency)
      )
    }

    def getDeletedItemFields(pviId: Int, pvTMPId: Int) = {
      List(
        Field(C.PV_TMP_ID, pvTMPId, FieldType.id),
        Field(C.PVI_ID, pviId, FieldType.number),
        Field(C.PV_ID, pedidoVenta.id, FieldType.id)
      )
    }

    def getPresupuestoFields(item: PedidoVentaPresupuesto, pvTMPId: Int) = {
      List(
        Field(C.PV_TMP_ID, pvTMPId, FieldType.id),
        Field(C.PRV_PV_ID, 0, FieldType.number),
        Field(C.PRVI_ID, item.prviId, FieldType.id),
        Field(C.PRV_PV_CANTIDAD, item.cantidad, FieldType.currency),
        Field(C.PVI_ID, item.prviId, FieldType.id)
      )
    }

    def throwError = {
      throwException(s"Error when saving ${C.PEDIDO_VENTA}")
    }

    def throwException(message: String) = {
      throw new RuntimeException(message)
    }

    case class PedidoVentaItemInfo(pvTMPId: Int, item: PedidoVentaItem)

    def saveItem(itemInfo: PedidoVentaItemInfo) = {
      DBHelper.save(
        user,
        Register(
          C.PEDIDO_VENTA_ITEM_TMP,
          C.PVI_TMP_ID,
          DBHelper.NoId,
          false,
          false,
          false,
          getItemFields(itemInfo.item, itemInfo.pvTMPId)),
        true
      ) match {
        case SaveResult(false, id) => throwError
        case _ =>
      }
    }

    def saveDeletedItem(pvTMPId: Int)(pviId: String) = {
      val id = G.getIntOrZero(pviId)
      if(id != 0) {
        DBHelper.save(
          user,
          Register(
            C.PEDIDO_VENTA_ITEM_BORRADO_TMP,
            C.PVIB_TMP_ID,
            DBHelper.NoId,
            false,
            false,
            false,
            getDeletedItemFields(id, pvTMPId)),
          true
        ) match {
          case SaveResult(false, id) => throwError
          case _ =>
        }
      }
    }

    def saveItems(pvTMPId: Int) = {
      pedidoVenta.items.items.map(item => saveItem(PedidoVentaItemInfo(pvTMPId, item)))
      pedidoVenta.items.itemDeleted.split(",").map(saveDeletedItem(pvTMPId))
    }    

    case class PedidoVentaPresupuestoInfo(pvTMPId: Int, item: PedidoVentaPresupuesto)

    def savePresupuesto(itemInfo: PedidoVentaPresupuestoInfo) = {
      DBHelper.save(
        user,
        Register(
          C.PRESUPUESTO_PEDIDO_VENTA_TMP,
          C.PRV_PV_TMP_ID,
          DBHelper.NoId,
          false,
          false,
          false,
          getPresupuestoFields(itemInfo.item, itemInfo.pvTMPId)),
        true
      ) match {
        case SaveResult(true, id) => true
        case SaveResult(false, id) => throwError
      }
    }

    def savePresupuestos(pvTMPId: Int) = {
      pedidoVenta.items.presupuestos.map(presupuesto => savePresupuesto(PedidoVentaPresupuestoInfo(pvTMPId, presupuesto)))
    }

    case class RowResult(rowType: String, id: Int, message: String)

    def saveFromWizard(pvTMPId: Int) = {

      DB.withTransaction(user.database.database) { implicit connection =>
        val sql = "select * from sp_doc_pedido_venta_wizard_save(?)"
        val cs = connection.prepareStatement(sql)

        cs.setInt(1, pvTMPId)

        try {
          cs.executeQuery()
        } catch {
          case NonFatal(e) => {
            Logger.error(s"can't save ${C.PEDIDO_VENTA} with id ${pedidoVenta.id} for user ${user.toString}. Error ${e.toString}")
            throw e
          }
        } finally {
          cs.close
        }
      }
    }

    def executeSave(pvTMPId: Int): List[RowResult] = {

      DB.withTransaction(user.database.database) { implicit connection =>
        val sql = "select * from sp_doc_pedido_venta_save(?, ?)"
        val cs = connection.prepareStatement(sql)

        cs.setInt(1, user.masterUserId)
        cs.setInt(2, pvTMPId)

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
          * ex: CREATE OR REPLACE FUNCTION sp_doc_pedido_venta_save( params )
          *     RETURNS SETOF row_result AS ...
          *
          * the field type is used to identify the value in the row. there are three
          * kind of types: resultset, success, id
          * for first two (resultset and success) the value of type is string with
          * one of these two values ex: 'resultset' or 'success'
          * when type == 'resultset' the field r must be not null and contain a ResultSet
          * when type == 'success' the id field can contain 0 (False) or not 0 (-1,1 or any other number but NO 0) (True)
          * the last kind of type is id. in this case the id must be the name of a column like pv_id, as_id, pr_id, etc
          * it can be any column name. if the type is an integer like in pv_id, as_id or any other id column the field id
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
                case "pv_id" => RowResult("pv_id", rs.getInt(2), "")
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
            Logger.error(s"can't save ${C.PEDIDO_VENTA} with id ${pedidoVenta.id} for user ${user.toString}. Error ${e.toString}")
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
            case RowResult("pv_id", id, m) => id
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
        C.PEDIDO_VENTA_TMP,
        C.PV_TMP_ID,
        DBHelper.NoId,
        false,
        true,
        true,
        getFields),
      true
    ) match {
      case SaveResult(true, pvTMPId) => {
        saveItems(pvTMPId)
        if(isFromWizard) saveFromWizard(pvTMPId)
        savePresupuestos(pvTMPId)
        val messagesAndId = executeSave(pvTMPId)
        val id = getIdFromMessages(messagesAndId)
        load(user, id).getOrElse(throwError)
      }
      case SaveResult(false, id) => throwError
    }

  }

  def load(user: CompanyUser, id: Int): Option[PedidoVenta] = {

    DB.withTransaction(user.database.database) { implicit connection =>

      val sql = "{call sp_doc_pedido_venta_get(?, ?, ?, ?)}"
      val cs = connection.prepareCall(sql)

      cs.setInt(1, user.cairoCompanyId)
      cs.setInt(2, id)
      cs.setInt(3, user.masterUserId)
      cs.registerOutParameter(4, Types.OTHER)

      try {
        cs.execute()

        val rs = cs.getObject(4).asInstanceOf[java.sql.ResultSet]
        Sql.as(pedidoVentaParser.singleOpt, rs)

      } catch {
        case NonFatal(e) => {
          Logger.error(s"can't get ${C.PEDIDO_VENTA} with id $id for user ${user.toString}. Error ${e.toString}")
          throw e
        }
      } finally {
        cs.close
      }
    }
  }

  private def loadPedidoVentaItems(user: CompanyUser, id: Int) = {
    val items = loadItems(user, id)
    PedidoVentaItems(items, "", List())
  }

  private def loadItems(user: CompanyUser, id: Int) = {

    DB.withTransaction(user.database.database) { implicit connection =>

      val sql = "{call sp_doc_pedido_venta_get_items(?, ?)}"
      val cs = connection.prepareCall(sql)

      cs.setInt(1, id)
      cs.registerOutParameter(2, Types.OTHER)

      try {

        cs.execute()
        val rs = cs.getObject(2).asInstanceOf[java.sql.ResultSet]
        Sql.as(pedidoVentaItemParser.*, rs)

      } catch {
        case NonFatal(e) => {
          Logger.error(s"can't get ${C.PEDIDO_VENTA_ITEM} with id $id for user ${user.toString}. Error ${e.toString}")
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
        SQL("sp_doc_pedido_venta_delete {id}, {empId}, {usId}")
          .on('id -> id, 'empId -> user.cairoCompanyId, 'usId -> user.masterUserId)
          .executeUpdate
      } catch {
        case NonFatal(e) => {
          Logger.error(s"can't delete a ${C.PEDIDO_VENTA}. ${C.PV_ID} id: $id. Error ${e.toString}")
          throw e
        }
      }
    }
  }

  def get(user: CompanyUser, id: Int): PedidoVenta = {
    load(user, id) match {
      case Some(p) => {
        PedidoVenta(
          p.id,

          p.ids,
          p.base,
          p.references,
          p.dates,
          p.precios,
          p.stock,
          p.totals,

          loadPedidoVentaItems(user, id)
        )
      }
      case None => emptyPedidoVenta
    }
  }

  val K_FECHAINI  = 1
  val K_FECHAFIN  = 2
  val K_CLI_ID    = 4
  val K_EST_ID    = 5
  val K_CCOS_ID   = 6
  val K_SUC_ID    = 7
  val K_VEN_ID    = 8
  val K_DOC_ID    = 9
  val K_CPG_ID    = 10
  val K_EMP_ID    = 100

  def saveParams(user: CompanyUser, pedidoVentaParams: PedidoVentaParams): PedidoVentaParams = {
    val baseFields = List(
      Field(GC.EMP_ID, user.cairoCompanyId, FieldType.id),
      Field(GC.US_ID, user.masterUserId, FieldType.id),
      Field(GC.PRE_ID, S.LIST_PEDIDO_VENTA, FieldType.id)
    )

    def throwException = {
      throw new RuntimeException(s"Error when saving ${C.PEDIDO_VENTA}")
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
        Field(GC.LDP_VALOR, pedidoVentaParams.from, FieldType.text)
      ),
      List(
        Field(GC.LDP_ID, K_FECHAFIN, FieldType.integer),
        Field(GC.LDP_ORDEN, 10, FieldType.integer),
        Field(GC.LDP_VALOR, pedidoVentaParams.to, FieldType.text)
      ),
      List(
        Field(GC.LDP_ID, K_CLI_ID, FieldType.integer),
        Field(GC.LDP_ORDEN, 20, FieldType.integer),
        Field(GC.LDP_VALOR, pedidoVentaParams.cliId, FieldType.text)
      ),
      List(
        Field(GC.LDP_ID, K_EST_ID, FieldType.integer),
        Field(GC.LDP_ORDEN, 30, FieldType.integer),
        Field(GC.LDP_VALOR, pedidoVentaParams.estId, FieldType.text)
      ),
      List(
        Field(GC.LDP_ID, K_CCOS_ID, FieldType.integer),
        Field(GC.LDP_ORDEN, 40, FieldType.integer),
        Field(GC.LDP_VALOR, pedidoVentaParams.ccosId, FieldType.text)
      ),
      List(
        Field(GC.LDP_ID, K_SUC_ID, FieldType.integer),
        Field(GC.LDP_ORDEN, 50, FieldType.integer),
        Field(GC.LDP_VALOR, pedidoVentaParams.sucId, FieldType.text)
      ),
      List(
        Field(GC.LDP_ID, K_DOC_ID, FieldType.integer),
        Field(GC.LDP_ORDEN, 60, FieldType.integer),
        Field(GC.LDP_VALOR, pedidoVentaParams.docId, FieldType.text)
      ),
      List(
        Field(GC.LDP_ID, K_CPG_ID, FieldType.integer),
        Field(GC.LDP_ORDEN, 70, FieldType.integer),
        Field(GC.LDP_VALOR, pedidoVentaParams.cpgId, FieldType.text)
      ),
      List(
        Field(GC.LDP_ID, K_EMP_ID, FieldType.integer),
        Field(GC.LDP_ORDEN, 80, FieldType.integer),
        Field(GC.LDP_VALOR, pedidoVentaParams.empId, FieldType.text)
      )
    )

    DB.withConnection(user.database.database) { implicit connection =>
      try {
        SQL(s"""DELETE FROM ListaDocumentoParametro
              | WHERE pre_id = {preId}
              | AND (emp_id is null or emp_id = {empId})
              | AND us_id = {usId}""".stripMargin)
          .on(
            'preId -> S.LIST_PEDIDO_VENTA,
            'empId -> user.cairoCompanyId,
            'usId -> user.masterUserId
          )
          .executeUpdate
      } catch {
        case NonFatal(e) => {
          Logger.error(s"can't save parameters for PedidoVenta")
          throw e
        }
      }
    }

    paramList.map(param => saveParam(baseFields ::: param))

    loadParams(user).getOrElse(throwException)
  }

  def loadParams(user: CompanyUser): Option[PedidoVentaParams] = {

    val ventaModos = VentaModo.list(user)
    val params = DocumentListParam.load(user, S.LIST_PEDIDO_VENTA)

    if(params.isEmpty) {
      Some(PedidoVentaParams(
        emptyPedidoVentaParams.from,
        emptyPedidoVentaParams.to,
        emptyPedidoVentaParams.cliId,
        emptyPedidoVentaParams.cliName,
        emptyPedidoVentaParams.estId,
        emptyPedidoVentaParams.estName,
        emptyPedidoVentaParams.ccosId,
        emptyPedidoVentaParams.ccosName,
        emptyPedidoVentaParams.sucId,
        emptyPedidoVentaParams.sucName,
        emptyPedidoVentaParams.venId,
        emptyPedidoVentaParams.venName,
        emptyPedidoVentaParams.docId,
        emptyPedidoVentaParams.docName,
        emptyPedidoVentaParams.cpgId,
        emptyPedidoVentaParams.cpgName,
        emptyPedidoVentaParams.empId,
        emptyPedidoVentaParams.empName,
        ventaModos
      ))
    }
    else {
      val cli = DocumentListParam.getParamValue(
        user, K_CLI_ID, params, emptyPedidoVentaParams.cliId,
        GC.PROVEEDOR, GC.CLI_ID, GC.CLI_NAME
      )
      val est = DocumentListParam.getParamValue(
        user, K_EST_ID, params, emptyPedidoVentaParams.estId,
        GC.ESTADO, GC.EST_ID, GC.EST_NAME
      )
      val ccos = DocumentListParam.getParamValue(
        user, K_CCOS_ID, params, emptyPedidoVentaParams.ccosId,
        GC.CENTRO_COSTO, GC.CCOS_ID, GC.CCOS_NAME
      )
      val suc = DocumentListParam.getParamValue(
        user, K_SUC_ID, params, emptyPedidoVentaParams.sucId,
        GC.SUCURSAL, GC.SUC_ID, GC.SUC_NAME
      )
      val ven = DocumentListParam.getParamValue(
        user, K_VEN_ID, params, emptyPedidoVentaParams.venId,
        GC.VENDEDOR, GC.VEN_ID, GC.VEN_NAME
      )
      val doc = DocumentListParam.getParamValue(
        user, K_DOC_ID, params, emptyPedidoVentaParams.docId,
        GC.DOCUMENTO, GC.DOC_ID, GC.DOC_NAME
      )
      val cpg = DocumentListParam.getParamValue(
        user, K_CPG_ID, params, emptyPedidoVentaParams.cpgId,
        GC.CONDICION_PAGO, GC.CPG_ID, GC.CPG_NAME
      )
      val emp = DocumentListParam.getParamValue(
        user, K_EMP_ID, params, emptyPedidoVentaParams.empId,
        GC.EMPRESA, GC.EMP_ID, GC.EMP_NAME
      )

      Some(
        PedidoVentaParams(
          DocumentListParam.getParamValue(K_FECHAINI, params, emptyPedidoVentaParams.from),
          DocumentListParam.getParamValue(K_FECHAFIN, params, emptyPedidoVentaParams.to),
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
          emp.value,
          ventaModos
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

      val sql = "{call sp_lsdoc_pedidos_venta(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)}"
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
          Logger.error(s"can't get listing of pedidos de venta for user ${user.toString}. Error ${e.toString}")
          throw e
        }
      } finally {
        cs.close
      }
    }
  }

  def listPresupuestos(user: CompanyUser, cliId: Int, currencyId: Int): Recordset = {

    DB.withTransaction(user.database.database) { implicit connection =>

      val sql = "{call sp_doc_pedido_venta_get_presupuestos(?, ?, ?, ?)}"
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
          Logger.error(s"can't get listing of presupuestos de venta for provider [$cliId] and currency [$currencyId] and user ${user.toString}. Error ${e.toString}")
          throw e
        }
      } finally {
        cs.close
      }
    }
  }

  def listPresupuestosItems(user: CompanyUser, ids: String): Recordset = {

    DB.withTransaction(user.database.database) { implicit connection =>

      val sql = "{call sp_doc_pedido_venta_get_presupuestos_items(?, ?)}"
      val cs = connection.prepareCall(sql)

      cs.setString(1, ids)
      cs.registerOutParameter(2, Types.OTHER)

      try {
        cs.execute()

        val rs = cs.getObject(2).asInstanceOf[java.sql.ResultSet]
        Recordset.load(rs)

      } catch {
        case NonFatal(e) => {
          Logger.error(s"can't get listing of presupuestos de venta's items for list [$ids] and user ${user.toString}. Error ${e.toString}")
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