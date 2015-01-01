package models.cairo.modules.general

import java.sql.{Connection, CallableStatement, ResultSet, Types, SQLException}
import anorm.SqlParser._
import anorm._
import services.DateUtil
import services.db.DB
import models.cairo.system.database.{DBHelper, Register, Field, FieldType, SaveResult}
import models.cairo.system.database.DBHelper.rowToFloat
import java.math.BigDecimal
import play.api.Play.current
import models.domain.CompanyUser
import java.util.Date
import play.api.Logger
import play.api.libs.json._
import scala.util.control.NonFatal

case class ProductoBase (
                            codigoExterno: String,
                            codigoBarra: String,
                            codigoBarraName: String,
                            ibcId: Int,
                            ibcName: String,
                            marcId: Int,
                            marcName: String,
                            expoCairo: Int,
                            esPlantilla: Boolean,
                            curId: Int,
                            curName: String,
                            rubId: Int,
                            rubName: String
                          ) {
  def this(
            codigoExterno: String,
            codigoBarra: String,
            codigoBarraName: String,
            ibcId: Int,
            marcId: Int,
            expoCairo: Int,
            esPlantilla: Boolean,
            curId: Int,
            rubId: Int
            ) = {
    this(
      codigoExterno,
      codigoBarra,
      codigoBarraName,
      ibcId,
      "",
      marcId,
      "",
      expoCairo,
      esPlantilla,
      curId,
      "",
      rubId,
      "")
  }
}

object ProductoBase {

  def apply(
             codigoExterno: String,
             codigoBarra: String,
             codigoBarraName: String,
             ibcId: Int,
             marcId: Int,
             expoCairo: Int,
             esPlantilla: Boolean,
             curId: Int,
             rubId: Int) = {

    new ProductoBase(
      codigoExterno,
      codigoBarra,
      codigoBarraName,
      ibcId,
      marcId,
      expoCairo,
      esPlantilla,
      curId,
      rubId)
  }
}

case class ProductoCompra(
                            seCompra: Boolean,
                            nombreCompra: String,
                            descripCompra: String,
                            unIdCompra: Int,
                            unNameCompra: String,
                            cuegIdCompra: Int,
                            cuegNameCompra: String,
                            tiIdRiCompra: Int,
                            tiNameRiCompra: String,
                            tiIdInternosCompra: Int,
                            tiNameIntCompra: String,
                            porcInternoC: Double,
                            ccosIdCompra: Int,
                            ccosNameCompra: String
                          ) {
  def this(
           seCompra: Boolean,
           nombreCompra: String,
           descripCompra: String,
           unIdCompra: Int,
           cuegIdCompra: Int,
           tiIdRiCompra: Int,
           tiIdInternosCompra: Int,
           porcInternoC: Double,
           ccosIdCompra: Int
          ) = {
    this(
      seCompra,
      nombreCompra,
      descripCompra,
      unIdCompra,
      "",
      cuegIdCompra,
      "",
      tiIdRiCompra,
      "",
      tiIdInternosCompra,
      "",
      porcInternoC,
      ccosIdCompra,
      ""
    )
  }
}

object ProductoCompra {

  def apply(
             seCompra: Boolean,
             nombreCompra: String,
             descripCompra: String,
             unIdCompra: Int,
             cuegIdCompra: Int,
             tiIdRiCompra: Int,
             tiIdInternosCompra: Int,
             porcInternoC: Double,
             ccosIdCompra: Int) = {

    new ProductoCompra(
      seCompra,
      nombreCompra,
      descripCompra,
      unIdCompra,
      cuegIdCompra,
      tiIdRiCompra,
      tiIdInternosCompra,
      porcInternoC,
      ccosIdCompra)
  }
}

case class ProductoStock(
                            llevaStock: Boolean,
                            unIdStock: Int,
                            unNameStock: String,
                            stockCompra: Double,
                            x: Int,
                            y: Int,
                            z: Int,
                            stockMinimo: Double,
                            reposicion: Double,
                            stockMaximo: Double,
                            llevaNroSerie: Boolean,
                            llevaNroLote: Boolean,
                            loteFifo: Boolean,
                            seProduce: Boolean,
                            esRepuesto: Boolean
                          ) {
  def this(
            llevaStock: Boolean,
            unIdStock: Int,
            stockCompra: Double,
            x: Int,
            y: Int,
            z: Int,
            stockMinimo: Double,
            reposicion: Double,
            stockMaximo: Double,
            llevaNroSerie: Boolean,
            llevaNroLote: Boolean,
            loteFifo: Boolean,
            seProduce: Boolean,
            esRepuesto: Boolean
            ) = {
    this(
      llevaStock,
      unIdStock,
      "",
      stockCompra,
      x,
      y,
      z,
      stockMinimo,
      reposicion,
      stockMaximo,
      llevaNroSerie,
      llevaNroLote,
      loteFifo,
      seProduce,
      esRepuesto
    )
  }
}

object ProductoStock {

  def apply(
             llevaStock: Boolean,
             unIdStock: Int,
             stockCompra: Double,
             x: Int,
             y: Int,
             z: Int,
             stockMinimo: Double,
             reposicion: Double,
             stockMaximo: Double,
             llevaNroSerie: Boolean,
             llevaNroLote: Boolean,
             loteFifo: Boolean,
             seProduce: Boolean,
             esRepuesto: Boolean) = {

    new ProductoStock(
      llevaStock,
      unIdStock,
      stockCompra,
      x,
      y,
      z,
      stockMinimo,
      reposicion,
      stockMaximo,
      llevaNroSerie,
      llevaNroLote,
      loteFifo,
      seProduce,
      esRepuesto)
  }
}

case class ProductoVenta(
                            seVende: Boolean,
                            nombreVenta: String,
                            nombreFactura: String,
                            descripVenta: String,
                            unIdVenta: Int,
                            unNameVenta: String,
                            ventaCompra: Double,
                            ventaStock: Double,
                            cuegIdVenta: Int,
                            cuegNameVenta: String,
                            esLista: Boolean,
                            dinerario: Boolean,
                            noRedondeo: Boolean,
                            tiIdRiVenta: Int,
                            tiNameRiVenta: String,
                            tiIdInternosVenta: Int,
                            tiNameIntVenta: String,
                            porcInternoV: Double,
                            ccosIdVenta: Int,
                            ccosNameVenta: String
                          ) {
  def this(
            seVende: Boolean,
            nombreVenta: String,
            nombreFactura: String,
            descripVenta: String,
            unIdVenta: Int,
            ventaCompra: Double,
            ventaStock: Double,
            cuegIdVenta: Int,
            esLista: Boolean,
            dinerario: Boolean,
            noRedondeo: Boolean,
            tiIdRiVenta: Int,
            tiIdInternosVenta: Int,
            porcInternoV: Double,
            ccosIdVenta: Int
            ) = {
    this(
      seVende,
      nombreVenta,
      nombreFactura,
      descripVenta,
      unIdVenta,
      "",
      ventaCompra,
      ventaStock,
      cuegIdVenta,
      "",
      esLista,
      dinerario,
      noRedondeo,
      tiIdRiVenta,
      "",
      tiIdInternosVenta,
      "",
      porcInternoV,
      ccosIdVenta,
      ""
    )
  }
}

object ProductoVenta {

  def apply(
             seVende: Boolean,
             nombreVenta: String,
             nombreFactura: String,
             descripVenta: String,
             unIdVenta: Int,
             ventaCompra: Double,
             ventaStock: Double,
             cuegIdVenta: Int,
             esLista: Boolean,
             dinerario: Boolean,
             noRedondeo: Boolean,
             tiIdRiVenta: Int,
             tiIdInternosVenta: Int,
             porcInternoV: Double,
             ccosIdVenta: Int) = {

    new ProductoVenta(
      seVende,
      nombreVenta,
      nombreFactura,
      descripVenta,
      unIdVenta,
      ventaCompra,
      ventaStock,
      cuegIdVenta,
      esLista,
      dinerario,
      noRedondeo,
      tiIdRiVenta,
      tiIdInternosVenta,
      porcInternoV,
      ccosIdVenta)
  }
}

case class ProductoComex(
                            unIdPeso: Int,
                            unNamePeso: String,
                            pesoNeto: Double,
                            pesoTotal: Double,
                            cantXCajaExpo: Int,
                            emblId: Int,
                            emblName: String,
                            fleteExpo: Boolean,
                            egpId: Int,
                            egpName: String,
                            efmId: Int,
                            efmName: String,
                            poarId: Int,
                            poarName: String,
                            tiIdComexGanancias: Int,
                            tiNameComexGanancias: String,
                            tiIdComexIgb: Int,
                            tiNameComexIgb: String,
                            tiIdComexIva: Int,
                            tiNameComexIva: String
                          ) {
  def this(
            unIdPeso: Int,
            pesoNeto: Double,
            pesoTotal: Double,
            cantXCajaExpo: Int,
            emblId: Int,
            fleteExpo: Boolean,
            egpId: Int,
            efmId: Int,
            poarId: Int,
            tiIdComexGanancias: Int,
            tiIdComexIgb: Int,
            tiIdComexIva: Int
            ) = {
    this(
      unIdPeso,
      "",
      pesoNeto,
      pesoTotal,
      cantXCajaExpo,
      emblId,
      "",
      fleteExpo,
      egpId,
      "",
      efmId,
      "",
      poarId,
      "",
      tiIdComexGanancias,
      "",
      tiIdComexIgb,
      "",
      tiIdComexIva,
      ""
    )
  }
}

object ProductoComex {

  def apply(
             unIdPeso: Int,
             pesoNeto: Double,
             pesoTotal: Double,
             cantXCajaExpo: Int,
             emblId: Int,
             fleteExpo: Boolean,
             egpId: Int,
             efmId: Int,
             poarId: Int,
             tiIdComexGanancias: Int,
             tiIdComexIgb: Int,
             tiIdComexIva: Int) = {

    new ProductoComex(
      unIdPeso,
      pesoNeto,
      pesoTotal,
      cantXCajaExpo,
      emblId,
      fleteExpo,
      egpId,
      efmId,
      poarId,
      tiIdComexGanancias,
      tiIdComexIgb,
      tiIdComexIva)
  }
}

case class ProductoKit(
                            esKit: Boolean,
                            kitStockXItem: Boolean,
                            kitResumido: Boolean,
                            kitIdentidad: Boolean,
                            kitIdentidadXItem: Boolean,
                            taIdKitSerie: Int,
                            taNameKitSerie: String,
                            kitLote: Boolean,
                            kitLoteXItem: Boolean,
                            taIdKitLote: Int,
                            taNameKitLote: String
                          ) {
  def this(
            esKit: Boolean,
            kitStockXItem: Boolean,
            kitResumido: Boolean,
            kitIdentidad: Boolean,
            kitIdentidadXItem: Boolean,
            taIdKitSerie: Int,
            kitLote: Boolean,
            kitLoteXItem: Boolean,
            taIdKitLote: Int
            ) = {
    this(
      esKit,
      kitStockXItem,
      kitResumido,
      kitIdentidad,
      kitIdentidadXItem,
      taIdKitSerie,
      "",
      kitLote,
      kitLoteXItem,
      taIdKitLote,
      ""
    )
  }
}

object ProductoKit {

  def apply(
             esKit: Boolean,
             kitStockXItem: Boolean,
             kitResumido: Boolean,
             kitIdentidad: Boolean,
             kitIdentidadXItem: Boolean,
             taIdKitSerie: Int,
             kitLote: Boolean,
             kitLoteXItem: Boolean,
             taIdKitLote: Int) = {

    new ProductoKit(
      esKit,
      kitStockXItem,
      kitResumido,
      kitIdentidad,
      kitIdentidadXItem,
      taIdKitSerie,
      kitLote,
      kitLoteXItem,
      taIdKitLote)
  }
}

case class ProductoWeb(
                            nombreWeb: String,
                            aliasWeb: String,
                            prIdWebPadre: Int,
                            prNameWebPadre: String,
                            activoWeb: Boolean,
                            webImageUpdate: Boolean,
                            codigoHtml: String,
                            codigoHtmlDetalle: String,
                            expoWeb: Int,
                            ventaWebMaxima: Double,
                            leyId: Int,
                            leyName: String,
                            webImageFolder: String
                          ) {
  def this(
            nombreWeb: String,
            aliasWeb: String,
            prIdWebPadre: Int,
            activoWeb: Boolean,
            webImageUpdate: Boolean,
            codigoHtml: String,
            codigoHtmlDetalle: String,
            expoWeb: Int,
            ventaWebMaxima: Double,
            leyId: Int,
            webImageFolder: String
            ) = {
    this(
      nombreWeb,
      aliasWeb,
      prIdWebPadre,
      "",
      activoWeb,
      webImageUpdate,
      codigoHtml,
      codigoHtmlDetalle,
      expoWeb,
      ventaWebMaxima,
      leyId,
      "",
      webImageFolder
    )
  }
}

object ProductoWeb {

  def apply(
             nombreWeb: String,
             aliasWeb: String,
             prIdWebPadre: Int,
             activoWeb: Boolean,
             webImageUpdate: Boolean,
             codigoHtml: String,
             codigoHtmlDetalle: String,
             expoWeb: Int,
             ventaWebMaxima: Double,
             leyId: Int,
             webImageFolder: String) = {

    new ProductoWeb(
      nombreWeb,
      aliasWeb,
      prIdWebPadre,
      activoWeb,
      webImageUpdate,
      codigoHtml,
      codigoHtmlDetalle,
      expoWeb,
      ventaWebMaxima,
      leyId,
      webImageFolder)
  }
}

case class ProductoNombres(
                            rptIdNombreCompra: Int,
                            rptNameCompra: String,
                            rptIdNombreVenta: Int,
                            rptNameVenta: String,
                            rptIdNombreFactura: Int,
                            rptNameFactura: String,
                            rptIdNombreWeb: Int,
                            rptNameWeb: String,
                            rptIdNombreImg: Int,
                            rptNameImg: String,
                            rptIdNombreImgAlt: Int,
                            rptNameImgAlt: String
                          ) {
  def this(rptIdNombreCompra: Int,
           rptIdNombreVenta: Int,
           rptIdNombreFactura: Int,
           rptIdNombreWeb: Int,
           rptIdNombreImg: Int,
           rptIdNombreImgAlt: Int
           ) = {
    this(
      rptIdNombreCompra,
      "",
      rptIdNombreVenta,
      "",
      rptIdNombreFactura,
      "",
      rptIdNombreWeb,
      "",
      rptIdNombreImg,
      "",
      rptIdNombreImgAlt,
      ""
    )
  }
}

object ProductoNombres {

  def apply(
             rptIdNombreCompra: Int,
             rptIdNombreVenta: Int,
             rptIdNombreFactura: Int,
             rptIdNombreWeb: Int,
             rptIdNombreImg: Int,
             rptIdNombreImgAlt: Int) = {

    new ProductoNombres(
      rptIdNombreCompra,
      rptIdNombreVenta,
      rptIdNombreFactura,
      rptIdNombreWeb,
      rptIdNombreImg,
      rptIdNombreImgAlt)
  }
}

case class Producto(
                     id: Int,
                     active: Boolean,
                     code: String,

                     base: ProductoBase,

                     compra: ProductoCompra,
                     stock: ProductoStock,
                     venta: ProductoVenta,

                     comex: ProductoComex,
                     kit: ProductoKit,
                     web: ProductoWeb,
                     names: ProductoNombres,
                     createdAt: Date,
                     updatedAt: Date,
                     updatedBy: Int) {

  def this(
            id: Int,
            active: Boolean,
            code: String,

            base: ProductoBase,

            compra: ProductoCompra,
            stock: ProductoStock,
            venta: ProductoVenta,

            comex: ProductoComex,
            kit: ProductoKit,
            web: ProductoWeb,
            names: ProductoNombres) = {

    this(
      id,
      active,
      code,

      base,

      compra,
      stock,
      venta,

      comex,
      kit,
      web,
      names,

      DateUtil.currentTime,
      DateUtil.currentTime,
      DBHelper.NoId)
  }

  def this(
            active: Boolean,
            code: String,

            base: ProductoBase,

            compra: ProductoCompra,
            stock: ProductoStock,
            venta: ProductoVenta,

            comex: ProductoComex,
            kit: ProductoKit,
            web: ProductoWeb,
            names: ProductoNombres) = {

    this(
      DBHelper.NoId,
      active,
      code,

      base,

      compra,
      stock,
      venta,

      comex,
      kit,
      web,
      names)
  }

}

object Producto {

  lazy val emptyProducto = Producto(
    false,
    "",

    ProductoBase("", "", "", DBHelper.NoId, DBHelper.NoId, 0,false, DBHelper.NoId, DBHelper.NoId),

    ProductoCompra(false,"", "", DBHelper.NoId, DBHelper.NoId, DBHelper.NoId, DBHelper.NoId, 0.0, DBHelper.NoId),
    ProductoStock(false, DBHelper.NoId, 0.0, 0, 0, 0, 0d, 0.0, 0.0, false, false, false, false, false),
    ProductoVenta(false, "", "", "", DBHelper.NoId, 0.0, 0.0, DBHelper.NoId, false, false, false, DBHelper.NoId, DBHelper.NoId, 0.0, DBHelper.NoId),

    ProductoComex(DBHelper.NoId, 0.0, 0.0, 0, DBHelper.NoId, false, DBHelper.NoId, DBHelper.NoId, DBHelper.NoId, DBHelper.NoId, DBHelper.NoId, DBHelper.NoId),
    ProductoKit(false, false, false, false, false, DBHelper.NoId, false, false, DBHelper.NoId),
    ProductoWeb("", "", DBHelper.NoId, false, false, "", "", 0, 0.0, DBHelper.NoId, ""),
    ProductoNombres(DBHelper.NoId, DBHelper.NoId, DBHelper.NoId, DBHelper.NoId, DBHelper.NoId, DBHelper.NoId)
  )

  def apply(
             id: Int,
             active: Boolean,
             code: String,

             base: ProductoBase,

             compra: ProductoCompra,
             stock: ProductoStock,
             venta: ProductoVenta,

             comex: ProductoComex,
             kit: ProductoKit,
             web: ProductoWeb,
             names: ProductoNombres
             ) = {

    new Producto(
      id,
      active,
      code,

      base,

      compra,
      stock,
      venta,

      comex,
      kit,
      web,
      names
    )
  }

  def apply(
             active: Boolean,
             code: String,

             base: ProductoBase,

             compra: ProductoCompra,
             stock: ProductoStock,
             venta: ProductoVenta,

             comex: ProductoComex,
             kit: ProductoKit,
             web: ProductoWeb,
             names: ProductoNombres
             ) = {

    new Producto(
      active,
      code,

      base,

      compra,
      stock,
      venta,

      comex,
      kit,
      web,
      names
    )
  }

  private val productoParser: RowParser[Producto] = {
      SqlParser.get[Int](C.PR_ID) ~
      SqlParser.get[Int](DBHelper.ACTIVE) ~
      SqlParser.get[String](C.PR_CODE) ~
      SqlParser.get[String](C.PR_CODIGO_EXTERNO) ~
      SqlParser.get[String](C.PR_CODIGO_BARRA) ~
      SqlParser.get[String](C.PR_CODIGO_BARRA_NAME) ~
      SqlParser.get[Option[Int]](C.IBC_ID) ~
      SqlParser.get[Option[String]](C.IBC_NAME) ~
      SqlParser.get[Option[Int]](C.MARC_ID) ~
      SqlParser.get[Option[String]](C.MARC_NAME) ~
      SqlParser.get[Int](C.PR_EXPO_CAIRO) ~
      SqlParser.get[Int](C.PR_ES_PLANTILLA) ~
      SqlParser.get[Option[Int]](C.CUR_ID) ~
      SqlParser.get[Option[String]](C.CUR_NAME) ~
      SqlParser.get[Option[Int]](C.RUB_ID) ~
      SqlParser.get[Option[String]](C.RUB_NAME) ~
      SqlParser.get[Int](C.PR_SE_COMPRA) ~
      SqlParser.get[String](C.PR_NAME_COMPRA) ~
      SqlParser.get[String](C.PR_DESCRIP_COMPRA) ~
      SqlParser.get[Option[Int]](C.UN_ID_COMPRA) ~
      SqlParser.get[Option[String]](C.UN_NAME_COMPRA) ~
      SqlParser.get[Option[Int]](C.CUEG_ID_COMPRA) ~
      SqlParser.get[Option[String]](C.CUEG_NAME_COMPRA) ~
      SqlParser.get[Option[Int]](C.TI_ID_RI_COMPRA) ~
      SqlParser.get[Option[String]](C.TI_NAME_RI_COMPRA) ~
      SqlParser.get[Option[Int]](C.TI_ID_INTERNOS_COMPRA) ~
      SqlParser.get[Option[String]](C.TI_NAME_INT_COMPRA) ~
      SqlParser.get[Float](C.PR_PORC_INTERNO_C) ~
      SqlParser.get[Option[Int]](C.CCOS_ID_COMPRA) ~
      SqlParser.get[Option[String]](C.CCOS_NAME_COMPRA) ~
      SqlParser.get[Int](C.PR_LLEVA_STOCK) ~
      SqlParser.get[Option[Int]](C.UN_ID_STOCK) ~
      SqlParser.get[Option[String]](C.UN_NAME_STOCK) ~
      SqlParser.get[Float](C.PR_STOCK_COMPRA) ~
      SqlParser.get[Int](C.PR_X) ~
      SqlParser.get[Int](C.PR_Y) ~
      SqlParser.get[Int](C.PR_Z) ~
      SqlParser.get[Float](C.PR_STOCK_MINIMO) ~
      SqlParser.get[Float](C.PR_REPOSICION) ~
      SqlParser.get[Float](C.PR_STOCK_MAXIMO) ~
      SqlParser.get[Int](C.PR_LLEVA_NRO_SERIE) ~
      SqlParser.get[Int](C.PR_LLEVA_NRO_LOTE) ~
      SqlParser.get[Int](C.PR_LOTE_FIFO) ~
      SqlParser.get[Int](C.PR_SE_PRODUCE) ~
      SqlParser.get[Int](C.PR_ES_REPUESTO) ~
      SqlParser.get[Int](C.PR_SE_VENDE) ~
      SqlParser.get[String](C.PR_NAME_VENTA) ~
      SqlParser.get[String](C.PR_NAME_FACTURA) ~
      SqlParser.get[String](C.PR_DESCRIP_VENTA) ~
      SqlParser.get[Option[Int]](C.UN_ID_VENTA) ~
      SqlParser.get[Option[String]](C.UN_NAME_VENTA) ~
      SqlParser.get[Float](C.PR_VENTA_COMPRA) ~
      SqlParser.get[Float](C.PR_VENTA_STOCK) ~
      SqlParser.get[Option[Int]](C.CUEG_ID_VENTA) ~
      SqlParser.get[Option[String]](C.CUEG_NAME_VENTA) ~
      SqlParser.get[Int](C.PR_ES_LISTA) ~
      SqlParser.get[Int](C.PR_DINERARIO) ~
      SqlParser.get[Int](C.PR_NO_REDONDEO) ~
      SqlParser.get[Option[Int]](C.TI_ID_RI_VENTA) ~
      SqlParser.get[Option[String]](C.TI_NAME_RI_VENTA) ~
      SqlParser.get[Option[Int]](C.TI_ID_INTERNOS_VENTA) ~
      SqlParser.get[Option[String]](C.TI_NAME_INT_VENTA) ~
      SqlParser.get[Float](C.PR_PORC_INTERNO_V) ~
      SqlParser.get[Option[Int]](C.CCOS_ID_VENTA) ~
      SqlParser.get[Option[String]](C.CCOS_NAME_VENTA) ~
      SqlParser.get[Option[Int]](C.UN_ID_PESO) ~
      SqlParser.get[Option[String]](C.UN_NAME_PESO) ~
      SqlParser.get[BigDecimal](C.PR_PESO_NETO) ~
      SqlParser.get[BigDecimal](C.PR_PESO_TOTAL) ~
      SqlParser.get[Int](C.PR_CANT_X_CAJA_EXPO) ~
      SqlParser.get[Option[Int]](C.EMBL_ID) ~
      SqlParser.get[Option[String]](C.EMBL_NAME) ~
      SqlParser.get[Int](C.PR_FLETE_EXPO) ~
      SqlParser.get[Option[Int]](C.EGP_ID) ~
      SqlParser.get[Option[String]](C.EGP_NAME) ~
      SqlParser.get[Option[Int]](C.EFM_ID) ~
      SqlParser.get[Option[String]](C.EFM_NAME) ~
      SqlParser.get[Option[Int]](C.POAR_ID) ~
      SqlParser.get[Option[String]](C.POAR_NAME) ~
      SqlParser.get[Option[Int]](C.TI_ID_COMEX_GANANCIAS) ~
      SqlParser.get[Option[String]](C.TI_NAME_COMEX_GANANCIAS) ~
      SqlParser.get[Option[Int]](C.TI_ID_COMEX_IGB) ~
      SqlParser.get[Option[String]](C.TI_NAME_COMEX_IGB) ~
      SqlParser.get[Option[Int]](C.TI_ID_COMEX_IVA) ~
      SqlParser.get[Option[String]](C.TI_NAME_COMEX_IVA) ~
      SqlParser.get[Int](C.PR_ES_KIT) ~
      SqlParser.get[Int](C.PR_KIT_STOCK_X_ITEM) ~
      SqlParser.get[Int](C.PR_KIT_RESUMIDO) ~
      SqlParser.get[Int](C.PR_KIT_IDENTIDAD) ~
      SqlParser.get[Int](C.PR_KIT_IDENTIDAD_X_ITEM) ~
      SqlParser.get[Option[Int]](C.TA_ID_KIT_SERIE) ~
      SqlParser.get[Option[String]](C.TA_NAME_KIT_SERIE) ~
      SqlParser.get[Int](C.PR_KIT_LOTE) ~
      SqlParser.get[Int](C.PR_KIT_LOTE_X_ITEM) ~
      SqlParser.get[Option[Int]](C.TA_ID_KIT_LOTE) ~
      SqlParser.get[Option[String]](C.TA_NAME_KIT_LOTE) ~
      SqlParser.get[String](C.PR_NAME_WEB) ~
      SqlParser.get[String](C.PR_ALIAS_WEB) ~
      SqlParser.get[Option[Int]](C.PR_ID_WEB_PADRE) ~
      SqlParser.get[Option[String]](C.PR_NAME_WEB_PADRE) ~
      SqlParser.get[Int](C.PR_ACTIVO_WEB) ~
      SqlParser.get[Int](C.PR_WEB_IMAGE_UPDATE) ~
      SqlParser.get[String](C.PR_CODIGO_HTML) ~
      SqlParser.get[String](C.PR_CODIGO_HTML_DETALLE) ~
      SqlParser.get[Int](C.PR_EXPO_WEB) ~
      SqlParser.get[BigDecimal](C.PR_VENTA_WEB_MAXIMA) ~
      SqlParser.get[Option[Int]](C.LEY_ID) ~
      SqlParser.get[Option[String]](C.LEY_NAME) ~
      SqlParser.get[String](C.PR_WEB_IMAGE_FOLDER) ~
      SqlParser.get[Option[Int]](C.RPT_ID_NOMBRE_COMPRA) ~
      SqlParser.get[Option[String]](C.RPT_NAME_COMPRA) ~
      SqlParser.get[Option[Int]](C.RPT_ID_NOMBRE_VENTA) ~
      SqlParser.get[Option[String]](C.RPT_NAME_VENTA) ~
      SqlParser.get[Option[Int]](C.RPT_ID_NOMBRE_FACTURA) ~
      SqlParser.get[Option[String]](C.RPT_NAME_FACTURA) ~
      SqlParser.get[Option[Int]](C.RPT_ID_NOMBRE_WEB) ~
      SqlParser.get[Option[String]](C.RPT_NAME_WEB) ~
      SqlParser.get[Option[Int]](C.RPT_ID_NOMBRE_IMG) ~
      SqlParser.get[Option[String]](C.RPT_NAME_IMG) ~
      SqlParser.get[Option[Int]](C.RPT_ID_NOMBRE_IMG_ALT) ~
      SqlParser.get[Option[String]](C.RPT_NAME_IMG_ALT) ~
      SqlParser.get[Date](DBHelper.CREATED_AT) ~
      SqlParser.get[Date](DBHelper.UPDATED_AT) ~
      SqlParser.get[Int](DBHelper.UPDATED_BY) map {
      case
          id ~
          active ~
          code ~
          codigoExterno ~
          codigoBarra ~
          codigoBarraName ~
          ibcId ~
          ibcName ~
          marcId ~
          marcName ~
          expoCairo ~
          esPlantilla ~
          curId ~
          curName ~
          rubId ~
          rubName ~

          seCompra ~
          nombreCompra ~
          descripCompra ~
          unIdCompra ~
          unNameCompra ~
          cuegIdCompra ~
          cuegNameCompra ~
          tiIdRiCompra ~
          tiNameRiCompra ~
          tiIdInternosCompra ~
          tiNameIntCompra ~
          porcInternoC ~
          ccosIdCompra ~
          ccosNameCompra ~

          llevaStock ~
          unIdStock ~
          unNameStock ~
          stockCompra ~
          x ~
          y ~
          z ~
          stockMinimo ~
          reposicion ~
          stockMaximo ~
          llevaNroSerie ~
          llevaNroLote ~
          loteFifo ~
          seProduce ~
          esRepuesto ~

          seVende ~
          nombreVenta ~
          nombreFactura ~
          descripVenta ~
          unIdVenta ~
          unNameVenta ~
          ventaCompra ~
          ventaStock ~
          cuegIdVenta ~
          cuegNameVenta ~
          esLista ~
          dinerario ~
          noRedondeo ~
          tiIdRiVenta ~
          tiNameRiVenta ~
          tiIdInternosVenta ~
          tiNameIntVenta ~
          porcInternoV ~
          ccosIdVenta ~
          ccosNameVenta ~

          unIdPeso ~
          unNamePeso ~
          pesoNeto ~
          pesoTotal ~
          cantXCajaExpo ~
          emblId ~
          emblName ~
          fleteExpo ~
          egpId ~
          egpName ~
          efmId ~
          efmName ~
          poarId ~
          poarName ~
          tiIdComexGanancias ~
          tiNameComexGanancias ~
          tiIdComexIgb ~
          tiNameComexIgb ~
          tiIdComexIva ~
          tiNameComexIva ~

          esKit ~
          kitStockXItem ~
          kitResumido ~
          kitIdentidad ~
          kitIdentidadXItem ~
          taIdKitSerie ~
          taNameKitSerie ~
          kitLote ~
          kitLoteXItem ~
          taIdKitLote ~
          taNameKitLote ~

          nombreWeb ~
          aliasWeb ~
          prIdWebPadre ~
          prNameWebPadre ~
          activoWeb ~
          webImageUpdate ~
          codigoHtml ~
          codigoHtmlDetalle ~
          expoWeb ~
          ventaWebMaxima ~
          leyId ~
          leyName ~
          webImageFolder  ~

          rptIdNombreCompra ~
          rptNameCompra ~
          rptIdNombreVenta ~
          rptNameVenta ~
          rptIdNombreFactura ~
          rptNameFactura ~
          rptIdNombreWeb ~
          rptNameWeb ~
          rptIdNombreImg ~
          rptNameImg ~
          rptIdNombreImgAlt ~
          rptNameImgAlt ~

          createdAt ~
          updatedAt ~
          updatedBy =>
        Producto(
          id,
          (if(active != 0) true else false),
          code,
          ProductoBase(
            codigoExterno,
            codigoBarra,
            codigoBarraName,
            ibcId.getOrElse(DBHelper.NoId),
            ibcName.getOrElse(""),
            marcId.getOrElse(DBHelper.NoId),
            marcName.getOrElse(""),
            expoCairo,
            (if(esPlantilla != 0) true else false),
            curId.getOrElse(DBHelper.NoId),
            curName.getOrElse(""),
            rubId.getOrElse(DBHelper.NoId),
            rubName.getOrElse("")
          ),
          ProductoCompra(
            (if(seCompra != 0) true else false),
            nombreCompra,
            descripCompra,
            unIdCompra.getOrElse(DBHelper.NoId),
            unNameCompra.getOrElse(""),
            cuegIdCompra.getOrElse(DBHelper.NoId),
            cuegNameCompra.getOrElse(""),
            tiIdRiCompra.getOrElse(DBHelper.NoId),
            tiNameRiCompra.getOrElse(""),
            tiIdInternosCompra.getOrElse(DBHelper.NoId),
            tiNameIntCompra.getOrElse(""),
            porcInternoC,
            ccosIdCompra.getOrElse(DBHelper.NoId),
            ccosNameCompra.getOrElse("")),
          ProductoStock(
            (if(llevaStock != 0) true else false),
            unIdStock.getOrElse(DBHelper.NoId),
            unNameStock.getOrElse(""),
            stockCompra,
            x,
            y,
            z,
            stockMinimo,
            reposicion,
            stockMaximo,
            (if(llevaNroSerie != 0) true else false),
            (if(llevaNroLote != 0) true else false),
            (if(loteFifo != 0) true else false),
            (if(seProduce != 0) true else false),
            (if(esRepuesto != 0) true else false)),
          ProductoVenta(
            (if(seVende != 0) true else false),
            nombreVenta,
            nombreFactura,
            descripVenta,
            unIdVenta.getOrElse(DBHelper.NoId),
            unNameVenta.getOrElse(""),
            ventaCompra,
            ventaStock,
            cuegIdVenta.getOrElse(DBHelper.NoId),
            cuegNameVenta.getOrElse(""),
            (if(esLista != 0) true else false),
            (if(dinerario != 0) true else false),
            (if(noRedondeo != 0) true else false),
            tiIdRiVenta.getOrElse(DBHelper.NoId),
            tiNameRiVenta.getOrElse(""),
            tiIdInternosVenta.getOrElse(DBHelper.NoId),
            tiNameIntVenta.getOrElse(""),
            porcInternoV,
            ccosIdVenta.getOrElse(DBHelper.NoId),
            ccosNameVenta.getOrElse("")),
          ProductoComex(
            unIdPeso.getOrElse(DBHelper.NoId),
            unNamePeso.getOrElse(""),
            pesoNeto.doubleValue,
            pesoTotal.doubleValue,
            cantXCajaExpo,
            emblId.getOrElse(DBHelper.NoId),
            emblName.getOrElse(""),
            (if(fleteExpo != 0) true else false),
            egpId.getOrElse(DBHelper.NoId),
            egpName.getOrElse(""),
            efmId.getOrElse(DBHelper.NoId),
            efmName.getOrElse(""),
            poarId.getOrElse(DBHelper.NoId),
            poarName.getOrElse(""),
            tiIdComexGanancias.getOrElse(DBHelper.NoId),
            tiNameComexGanancias.getOrElse(""),
            tiIdComexIgb.getOrElse(DBHelper.NoId),
            tiNameComexIgb.getOrElse(""),
            tiIdComexIva.getOrElse(DBHelper.NoId),
            tiNameComexIva.getOrElse("")),
          ProductoKit(
            (if(esKit != 0) true else false),
            (if(kitStockXItem != 0) true else false),
            (if(kitResumido != 0) true else false),
            (if(kitIdentidad != 0) true else false),
            (if(kitIdentidadXItem != 0) true else false),
            taIdKitSerie.getOrElse(DBHelper.NoId),
            taNameKitSerie.getOrElse(""),
            (if(kitLote != 0) true else false),
            (if(kitLoteXItem != 0) true else false),
            taIdKitLote.getOrElse(DBHelper.NoId),
            taNameKitLote.getOrElse("")),
          ProductoWeb(
            nombreWeb,
            aliasWeb,
            prIdWebPadre.getOrElse(DBHelper.NoId),
            prNameWebPadre.getOrElse(""),
            (if(activoWeb != 0) true else false),
            (if(webImageUpdate != 0) true else false),
            codigoHtml,
            codigoHtmlDetalle,
            expoWeb,
            ventaWebMaxima.doubleValue,
            leyId.getOrElse(DBHelper.NoId),
            leyName.getOrElse(""),
            webImageFolder),
          ProductoNombres(
            rptIdNombreCompra.getOrElse(DBHelper.NoId),
            rptNameCompra.getOrElse(""),
            rptIdNombreVenta.getOrElse(DBHelper.NoId),
            rptNameVenta.getOrElse(""),
            rptIdNombreFactura.getOrElse(DBHelper.NoId),
            rptNameFactura.getOrElse(""),
            rptIdNombreWeb.getOrElse(DBHelper.NoId),
            rptNameWeb.getOrElse(""),
            rptIdNombreImg.getOrElse(DBHelper.NoId),
            rptNameImg.getOrElse(""),
            rptIdNombreImgAlt.getOrElse(DBHelper.NoId),
            rptNameImgAlt.getOrElse("")),
          createdAt,
          updatedAt,
          updatedBy)
    }
  }

  def create(user: CompanyUser, producto: Producto): Producto = {
    save(user, producto, true)
  }

  def update(user: CompanyUser, producto: Producto): Producto = {
    save(user, producto, false)
  }

  private def save(user: CompanyUser, producto: Producto, isNew: Boolean): Producto = {
    def getFields = {
      List(
        Field(DBHelper.ACTIVE, (if(producto.active) 1 else 0), FieldType.boolean),
        Field(C.PR_CODE, producto.code, FieldType.text),

        Field(C.PR_CODIGO_EXTERNO, producto.base.codigoExterno, FieldType.text),
        Field(C.PR_CODIGO_BARRA, producto.base.codigoBarra, FieldType.text),
        Field(C.PR_CODIGO_BARRA_NAME, producto.base.codigoBarraName, FieldType.id),
        Field(C.IBC_ID, producto.base.ibcId, FieldType.text),
        Field(C.MARC_ID, producto.base.marcId, FieldType.id),
        Field(C.PR_EXPO_CAIRO, producto.base.expoCairo, FieldType.number),
        Field(C.PR_ES_PLANTILLA, producto.base.esPlantilla, FieldType.boolean),
        Field(C.CUR_ID, producto.base.curId, FieldType.id),
        Field(C.RUB_ID, producto.base.rubId, FieldType.id),

        Field(C.PR_SE_COMPRA, producto.compra.seCompra, FieldType.id),
        Field(C.PR_NAME_COMPRA, producto.compra.nombreCompra, FieldType.text),
        Field(C.PR_DESCRIP_COMPRA, producto.compra.descripCompra, FieldType.text),
        Field(C.UN_ID_COMPRA, producto.compra.unIdCompra, FieldType.id),
        Field(C.CUEG_ID_COMPRA, producto.compra.cuegIdCompra, FieldType.id),
        Field(C.TI_ID_RI_COMPRA, producto.compra.tiIdRiCompra, FieldType.id),
        Field(C.TI_ID_INTERNOS_COMPRA, producto.compra.tiIdInternosCompra, FieldType.text),
        Field(C.PR_PORC_INTERNO_C, producto.compra.porcInternoC, FieldType.number),
        Field(C.CCOS_ID_COMPRA, producto.compra.ccosIdCompra, FieldType.id),

        Field(C.PR_LLEVA_STOCK, producto.stock.llevaStock, FieldType.id),
        Field(C.UN_ID_STOCK, producto.stock.unIdStock, FieldType.text),
        Field(C.PR_STOCK_COMPRA, producto.stock.stockCompra, FieldType.number),
        Field(C.PR_X, producto.stock.x, FieldType.number),
        Field(C.PR_Y, producto.stock.y, FieldType.number),
        Field(C.PR_Z, producto.stock.z, FieldType.number),
        Field(C.PR_STOCK_MINIMO, producto.stock.stockMinimo, FieldType.number),
        Field(C.PR_REPOSICION, producto.stock.reposicion, FieldType.number),
        Field(C.PR_STOCK_MAXIMO, producto.stock.stockMaximo, FieldType.number),
        Field(C.PR_LLEVA_NRO_SERIE, producto.stock.llevaNroSerie, FieldType.boolean),
        Field(C.PR_LLEVA_NRO_LOTE, producto.stock.llevaNroLote, FieldType.boolean),
        Field(C.PR_LOTE_FIFO, producto.stock.loteFifo, FieldType.boolean),
        Field(C.PR_SE_PRODUCE, producto.stock.seProduce, FieldType.boolean),
        Field(C.PR_ES_REPUESTO, producto.stock.esRepuesto, FieldType.boolean),

        Field(C.PR_SE_VENDE, producto.venta.seVende, FieldType.number),
        Field(C.PR_NAME_VENTA, producto.venta.nombreVenta, FieldType.text),
        Field(C.PR_NAME_FACTURA, producto.venta.nombreFactura, FieldType.id),
        Field(C.PR_DESCRIP_VENTA, producto.venta.descripVenta, FieldType.text),
        Field(C.UN_ID_VENTA, producto.venta.unIdVenta, FieldType.text),
        Field(C.PR_VENTA_COMPRA, producto.venta.ventaCompra, FieldType.number),
        Field(C.PR_VENTA_STOCK, producto.venta.ventaStock, FieldType.id),
        Field(C.CUEG_ID_VENTA, producto.venta.cuegIdVenta, FieldType.text),
        Field(C.PR_ES_LISTA, producto.venta.esLista, FieldType.boolean),
        Field(C.PR_DINERARIO, producto.venta.dinerario, FieldType.boolean),
        Field(C.PR_NO_REDONDEO, producto.venta.noRedondeo, FieldType.id),
        Field(C.TI_ID_RI_VENTA, producto.venta.tiIdRiVenta, FieldType.id),
        Field(C.TI_ID_INTERNOS_VENTA, producto.venta.tiIdInternosVenta, FieldType.text),
        Field(C.PR_PORC_INTERNO_V, producto.venta.porcInternoV, FieldType.number),
        Field(C.CCOS_ID_VENTA, producto.venta.ccosIdVenta, FieldType.id),

        Field(C.UN_ID_PESO, producto.comex.unIdPeso, FieldType.id),
        Field(C.PR_PESO_NETO, producto.comex.pesoNeto, FieldType.number),
        Field(C.PR_PESO_TOTAL, producto.comex.pesoTotal, FieldType.number),
        Field(C.PR_CANT_X_CAJA_EXPO, producto.comex.cantXCajaExpo, FieldType.number),
        Field(C.EMBL_ID, producto.comex.emblId, FieldType.id),
        Field(C.PR_FLETE_EXPO, producto.comex.fleteExpo, FieldType.boolean),
        Field(C.EGP_ID, producto.comex.egpId, FieldType.id),
        Field(C.EFM_ID, producto.comex.efmId, FieldType.id),
        Field(C.POAR_ID, producto.comex.poarId, FieldType.id),
        Field(C.TI_ID_COMEX_GANANCIAS, producto.comex.tiIdComexGanancias, FieldType.id),
        Field(C.TI_ID_COMEX_IGB, producto.comex.tiIdComexIgb, FieldType.id),
        Field(C.TI_ID_COMEX_IVA, producto.comex.tiIdComexIva, FieldType.text),
        Field(C.PR_ES_KIT, producto.kit.esKit, FieldType.boolean),
        Field(C.PR_KIT_STOCK_X_ITEM, producto.kit.kitStockXItem, FieldType.boolean),
        Field(C.PR_KIT_RESUMIDO, producto.kit.kitResumido, FieldType.boolean),
        Field(C.PR_KIT_IDENTIDAD, producto.kit.kitIdentidad, FieldType.boolean),
        Field(C.PR_KIT_IDENTIDAD_X_ITEM, producto.kit.kitIdentidadXItem, FieldType.boolean),
        Field(C.TA_ID_KIT_SERIE, producto.kit.taIdKitSerie, FieldType.id),
        Field(C.PR_KIT_LOTE, producto.kit.kitLote, FieldType.boolean),
        Field(C.PR_KIT_LOTE_X_ITEM, producto.kit.kitLoteXItem, FieldType.boolean),
        Field(C.TA_ID_KIT_LOTE, producto.kit.taIdKitLote, FieldType.id),

        Field(C.PR_NAME_WEB, producto.web.nombreWeb, FieldType.text),
        Field(C.PR_ALIAS_WEB, producto.web.aliasWeb, FieldType.text),
        Field(C.PR_ID_WEB_PADRE, producto.web.prIdWebPadre, FieldType.id),
        Field(C.PR_ACTIVO_WEB, producto.web.activoWeb, FieldType.boolean),
        Field(C.PR_WEB_IMAGE_UPDATE, producto.web.webImageUpdate, FieldType.boolean),
        Field(C.PR_CODIGO_HTML, producto.web.codigoHtml, FieldType.text),
        Field(C.PR_CODIGO_HTML_DETALLE, producto.web.codigoHtmlDetalle, FieldType.text),
        Field(C.PR_EXPO_WEB, producto.web.expoWeb, FieldType.number),
        Field(C.PR_VENTA_WEB_MAXIMA, producto.web.ventaWebMaxima, FieldType.id),
        Field(C.LEY_ID, producto.web.leyId, FieldType.text),
        Field(C.PR_WEB_IMAGE_FOLDER, producto.web.webImageFolder, FieldType.text),

        Field(C.RPT_ID_NOMBRE_COMPRA, producto.names.rptIdNombreCompra, FieldType.id),
        Field(C.RPT_ID_NOMBRE_VENTA, producto.names.rptIdNombreVenta, FieldType.id),
        Field(C.RPT_ID_NOMBRE_FACTURA, producto.names.rptIdNombreFactura, FieldType.id),
        Field(C.RPT_ID_NOMBRE_WEB, producto.names.rptIdNombreWeb, FieldType.id),
        Field(C.RPT_ID_NOMBRE_IMG, producto.names.rptIdNombreImg, FieldType.id),
        Field(C.RPT_ID_NOMBRE_IMG_ALT, producto.names.rptIdNombreImgAlt, FieldType.id)
      )
    }
    def throwException = {
      throw new RuntimeException(s"Error when saving ${C.PRODUCTO}")
    }

    DBHelper.saveEx(
      user,
      Register(
        C.PRODUCTO,
        C.PR_ID,
        producto.id,
        false,
        true,
        true,
        getFields),
      isNew,
      C.PR_CODE
    ) match {
      case SaveResult(true, id) => load(user, id).getOrElse(throwException)
      case SaveResult(false, id) => throwException
    }
  }

  /*
  def load(user: CompanyUser, id: Int): Option[Producto] = {
    loadWhere(user, "{id}", 'id -> id)
  }

  def loadWhere(user: CompanyUser, where: String, args : scala.Tuple2[scala.Any, anorm.ParameterValue[_]]*) = {
    DB.withConnection(user.database.database) { implicit connection =>
      SQL("EXEC sp_productoGet {id}")
        .on(args: _*)
        .as(productoParser.singleOpt)
    }
  }
  */

  def load(user: CompanyUser, id: Int): Option[Producto] = {

    DB.withTransaction(user.database.database) { implicit connection =>

      val sql = "{call sp_productoGet(?, ?)}"
      val cs = connection.prepareCall(sql)

      cs.setInt(1, id)
      cs.registerOutParameter(2, Types.OTHER)

      try {
        cs.execute()

        val rs = cs.getObject(2).asInstanceOf[java.sql.ResultSet]
        Sql.as(productoParser.singleOpt, rs)

      } catch {
        case NonFatal(e) => {
          Logger.error(s"can't get ${C.PRODUCTO} with id $id for user ${user.toString}. Error ${e.toString}")
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
        SQL("sp_productoDelete {id}")
          .on('id -> id)
          .executeUpdate
      } catch {
        case NonFatal(e) => {
          Logger.error(s"can't delete a ${C.PRODUCTO}. ${C.PR_ID} id: $id. Error ${e.toString}")
          throw e
        }
      }
    }
  }

  def get(user: CompanyUser, id: Int): Producto = {
    load(user, id) match {
      case Some(p) => p
      case None => emptyProducto
    }
  }
}