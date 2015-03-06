package models.cairo.modules.compras

import java.sql.{Connection, CallableStatement, ResultSet, Types, SQLException}
import anorm.SqlParser._
import anorm._
import services.DateUtil
import services.db.DB
import models.cairo.system.database.{DBHelper, Register, Field, FieldType, SaveResult}
import java.math.BigDecimal
import play.api.Play.current
import models.domain.CompanyUser
import java.util.Date
import play.api.Logger
import play.api.libs.json._
import scala.util.control.NonFatal
import models.cairo.modules.general.U

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
                              lgjName: String,
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
                                   llevaNroLote: Boolean
                                   )
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
                                    importe: Double,
                                    importeOrigen: Double
                                    )

case class FacturaCompraItem(
                              id: Int,
                              base: FacturaCompraItemBase,
                              totals: FacturaCompraItemTotals
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

case class FacturaCompraLegajo(
                                id: Int,
                                lgjId: Int,
                                lgjName: String,
                                importe: Double,
                                descrip: String,
                                importeOrigen: Double,
                                orden: Double
                              )

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

case class FacturaCompraItems(
                                items: List[FacturaCompraItem],
                                otros: List[FacturaCompraOtro],
                                legajos: List[FacturaCompraLegajo],
                                percepciones: List[FacturaCompraPercepcion]
                             )

case class FacturaCompra(
                          id: Int,

                          ids: FacturaCompraId,
                          base: FacturaCompraBase,
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
                                from: Date,
                                to: Date,
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
            from: Date,
            to: Date,
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
             from: Date,
             to: Date,
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

object FacturaCompra {

  lazy val GC = models.cairo.modules.general.C

  lazy val emptyFacturaCompraItems = FacturaCompraItems(List(), List(), List(), List())

  lazy val emptyFacturaCompra = FacturaCompra(
    FacturaCompraId(DBHelper.NoId, 0, ""),
    FacturaCompraBase(DBHelper.NoId, DBHelper.NoId, DBHelper.NoId, DBHelper.NoId, DBHelper.NoId, DBHelper.NoId, "", 0, "", false),
    FacturaCompraDates(U.NO_DATE, U.NO_DATE, U.NO_DATE, U.NO_DATE),
    FacturaCompraPrecios(0.0, 0.0, DBHelper.NoId, DBHelper.NoId),
    FacturaCompraCotizacion(0,0),
    FacturaCompraStock(DBHelper.NoId, DBHelper.NoId, DBHelper.NoId),
    FacturaCompraTotals(0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0),
    emptyFacturaCompraItems
  )

  lazy val emptyFacturaCompraParams = FacturaCompraParams(
    DateUtil.currentTime, DateUtil.currentTime, "0", "", "0", "", "0", "", "0", "", "0", "", "0", "", "0", "")

  def apply(
             id: Int,

             ids: FacturaCompraId,
             base: FacturaCompraBase,
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
             dates: FacturaCompraDates,
             precios: FacturaCompraPrecios,
             cotizacion: FacturaCompraCotizacion,
             stock: FacturaCompraStock,
             totals: FacturaCompraTotals
             ) = {

    new FacturaCompra(

      ids,
      base,
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
    SqlParser.get[Int](C.LLEVA_NRO_SERIE) ~
    SqlParser.get[Int](C.LLEVA_NRO_LOTE) map {
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
        llevaNroLote =>
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
          (llevaNroLote != 0)
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
          importe.doubleValue(),
          importeOrigen.doubleValue()
        )
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
    SqlParser.get[Int](C.LGJ_ID) ~
    SqlParser.get[String](C.LGJ_NAME) ~
    SqlParser.get[BigDecimal](C.FCLGJ_IMPORTE) ~
    SqlParser.get[String](C.FCLGJ_DESCRIP) ~
    SqlParser.get[BigDecimal](C.FCLGJ_IMPORTE_ORIGEN) ~
    SqlParser.get[Int](C.FCOT_ORDEN) map {
    case
        id ~
        lgjId ~
        lgjName ~
        importe ~
        descrip ~
        importeOrigen ~
        orden =>
      FacturaCompraLegajo(
        id,
        lgjId,
        lgjName,
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
    SqlParser.get[Option[Int]](C.LGJ_ID) ~
    SqlParser.get[Option[String]](C.LGJ_NAME) ~
    SqlParser.get[String](C.FC_CAI) ~
    SqlParser.get[Int](C.FC_TIPO_COMPROBANTE) ~
    SqlParser.get[String](C.FC_DESCRIP) ~
    SqlParser.get[Int](C.FC_GRABAR_ASIENTO) ~
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
        lgjName ~
        cai ~
        tipoComprobante ~
        descrip ~
        grabarAsiento ~
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
          lgjName.getOrElse(""),
          cai,
          tipoComprobante,
          descrip,
          (if(grabarAsiento != 0) true else false)
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

  def create(user: CompanyUser, facturaCompra: FacturaCompra): FacturaCompra = {
    save(user, facturaCompra, true)
  }

  def update(user: CompanyUser, facturaCompra: FacturaCompra): FacturaCompra = {
    save(user, facturaCompra, false)
  }

  private def save(user: CompanyUser, facturaCompra: FacturaCompra, isNew: Boolean): FacturaCompra = {
    def getFields = {
      List(
        Field(C.FC_ID, facturaCompra.id, FieldType.id),
        Field(GC.DOC_ID, facturaCompra.ids.docId, FieldType.id),
        Field(C.FC_NRODOC, facturaCompra.ids.nroDoc, FieldType.text),
        Field(C.FC_NUMERO, facturaCompra.ids.numero, FieldType.number),

        Field(GC.PROV_ID, facturaCompra.base.provId, FieldType.id),
        Field(GC.EST_ID, facturaCompra.base.estId, FieldType.id),
        Field(GC.CCOS_ID, facturaCompra.base.ccosId, FieldType.id),
        Field(GC.SUC_ID, facturaCompra.base.sucId, FieldType.id),
        Field(C.LGJ_ID, facturaCompra.base.lgjId, FieldType.id),
        Field(GC.CPG_ID, facturaCompra.base.cpgId, FieldType.id),
        Field(C.FC_CAI, facturaCompra.base.cai, FieldType.text),
        Field(C.FC_TIPO_COMPROBANTE, facturaCompra.base.tipoComprobante, FieldType.number),
        Field(C.FC_DESCRIP, facturaCompra.base.descrip, FieldType.text),
        Field(C.FC_GRABAR_ASIENTO, (if(facturaCompra.base.grabarAsiento) 1 else 0), FieldType.boolean),

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
    def throwException = {
      throw new RuntimeException(s"Error when saving ${C.FACTURA_COMPRA}")
    }

    DBHelper.save(
      user,
      Register(
        C.FACTURA_COMPRA_TMP,
        C.FC_TMPID,
        DBHelper.NoId,
        false,
        true,
        true,
        getFields),
      isNew
    ) match {
      case SaveResult(true, id) => load(user, id).getOrElse(throwException)
      case SaveResult(false, id) => throwException
    }
  }

  def load(user: CompanyUser, id: Int): Option[FacturaCompra] = {

    DB.withTransaction(user.database.database) { implicit connection =>

      val sql = "{call sp_doc_factura_compra_get(?, ?, ?, ?)}"
      val cs = connection.prepareCall(sql)

      cs.setInt(1, user.cairoCompanyId)
      cs.setInt(2, id)
      cs.setInt(3, user.userId)
      cs.registerOutParameter(4, Types.OTHER)

      try {
        cs.execute()

        val rs = cs.getObject(2).asInstanceOf[java.sql.ResultSet]
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
    FacturaCompraItems(
      loadItems(user, id),
      loadOtros(user, id),
      loadLegajos(user, id),
      loadPercepciones(user, id))
  }

  private def loadItems(user: CompanyUser, id: Int) = {

    DB.withTransaction(user.database.database) { implicit connection =>

      val sql = "{call sp_factura_compra_get_items(?, ?)}"
      val cs = connection.prepareCall(sql)

      cs.setInt(1, id)
      cs.registerOutParameter(2, Types.OTHER)

      try {
        cs.execute()

        val rs = cs.getObject(2).asInstanceOf[java.sql.ResultSet]
        Sql.as(facturaCompraItemParser.*, rs)

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

      val sql = "{call sp_factura_compra_get_otros(?, ?)}"
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

      val sql = "{call sp_factura_compra_get_legajos(?, ?)}"
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

      val sql = "{call sp_factura_compra_get_percepciones(?, ?)}"
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
          .on('id -> id, 'empId -> user.cairoCompanyId, 'usId -> user.userId)
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

  def saveParams(user: CompanyUser, facturaCompraParams: FacturaCompraParams): FacturaCompraParams = {
    def getFields = {
      List(
        Field(GC.FROM, facturaCompraParams.from, FieldType.text),
        Field(GC.TO, facturaCompraParams.to, FieldType.text),
        Field(GC.PROV_ID, facturaCompraParams.provId, FieldType.text),
        Field(GC.EST_ID, facturaCompraParams.estId, FieldType.text),
        Field(GC.CCOS_ID, facturaCompraParams.ccosId, FieldType.text),
        Field(GC.SUC_ID, facturaCompraParams.sucId, FieldType.text),
        Field(GC.DOC_ID, facturaCompraParams.docId, FieldType.text),
        Field(GC.CPG_ID, facturaCompraParams.cpgId, FieldType.text),
        Field(GC.EMP_ID, facturaCompraParams.empId, FieldType.text)
      )
    }
    def throwException = {
      throw new RuntimeException(s"Error when saving ${C.FACTURA_COMPRA}")
    }

    DBHelper.save(
      user,
      Register(
        C.FACTURA_COMPRA_TMP,
        C.FC_TMPID,
        DBHelper.NoId,
        false,
        true,
        true,
        getFields),
      true
    ) match {
      case SaveResult(true, id) => loadParams(user).getOrElse(throwException)
      case SaveResult(false, id) => throwException
    }
  }

  def loadParams(user: CompanyUser): Option[FacturaCompraParams] = {
    Some(emptyFacturaCompraParams)
  }

  def list(user: CompanyUser,
           from: Option[String],
           to: Option[String],
           provId: Option[Int],
           estId: Option[Int],
           ccosId: Option[Int],
           sucId: Option[Int],
           docId: Option[Int],
           cpgId: Option[Int]):
}