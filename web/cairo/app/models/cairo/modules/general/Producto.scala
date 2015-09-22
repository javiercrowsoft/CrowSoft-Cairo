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
                            curName: String
                          ) {
  def this(
            codigoExterno: String,
            codigoBarra: String,
            codigoBarraName: String,
            ibcId: Int,
            marcId: Int,
            expoCairo: Int,
            esPlantilla: Boolean,
            curId: Int
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
             curId: Int) = {

    new ProductoBase(
      codigoExterno,
      codigoBarra,
      codigoBarraName,
      ibcId,
      marcId,
      expoCairo,
      esPlantilla,
      curId)
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

case class ProductoRubro(
                          rubId: Int,
                          rubName: String,
                          rubtiId1: Int,
                          rubtiName1: String,
                          rubtiId2: Int,
                          rubtiName2: String,
                          rubtiId3: Int,
                          rubtiName3: String,
                          rubtiId4: Int,
                          rubtiName4: String,
                          rubtiId5: Int,
                          rubtiName5: String,
                          rubtiId6: Int,
                          rubtiName6: String,
                          rubtiId7: Int,
                          rubtiName7: String,
                          rubtiId8: Int,
                          rubtiName8: String,
                          rubtiId9: Int,
                          rubtiName9: String,
                          rubtiId10: Int,
                          rubtiName10: String
                          ) {
  def this(
            rubId: Int,
            rubtiId1: Int,
            rubtiId2: Int,
            rubtiId3: Int,
            rubtiId4: Int,
            rubtiId5: Int,
            rubtiId6: Int,
            rubtiId7: Int,
            rubtiId8: Int,
            rubtiId9: Int,
            rubtiId10: Int
            ) = {
    this(
      rubId,
      "",
      rubtiId1,
      "",
      rubtiId2,
      "",
      rubtiId3,
      "",
      rubtiId4,
      "",
      rubtiId5,
      "",
      rubtiId6,
      "",
      rubtiId7,
      "",
      rubtiId8,
      "",
      rubtiId9,
      "",
      rubtiId10,
      ""
    )
  }
}

object ProductoRubro {

  def apply(
             rubId: Int,
             rubtiId1: Int,
             rubtiId2: Int,
             rubtiId3: Int,
             rubtiId4: Int,
             rubtiId5: Int,
             rubtiId6: Int,
             rubtiId7: Int,
             rubtiId8: Int,
             rubtiId9: Int,
             rubtiId10: Int) = {

    new ProductoRubro(
      rubId,
      rubtiId1,
      rubtiId2,
      rubtiId3,
      rubtiId4,
      rubtiId5,
      rubtiId6,
      rubtiId7,
      rubtiId8,
      rubtiId9,
      rubtiId10)
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

//
// items
//

case class ProductoProveedor(
                              id: Int,
                              provId: Int,
                              provName: String,
                              maker: Boolean,
                              name: String,
                              code: String,
                              barCode: String,
                              paId: Int,
                              paName: String,
                              lpName: String,
                              price: Double,
                              priceDate: Date,
                              priceDefault: Boolean
                              )

case class ProductoCliente(
                            id: Int,
                            name: String,
                            code: String,
                            barCode: String
                             )

case class ProductoCMI(
                        id: Int,
                        code: String,
                        descrip: String,
                        createdAt: Date,
                        expireDate: Date,
                        price: Double
                        )

case class ProductoLeyenda(
                            id: Int,
                            name: String,
                            text: String,
                            tag: String,
                            order: Int
                            )

case class ProductoTag(
                        id: Int,
                        text: String
                        )

case class ProductoCategoriaWeb(
                                 id: Int,
                                 name: String,
                                 selected: Boolean,
                                 position: Int
                                 )

case class ProductoCatalogoWeb(
                                id: Int,
                                name: String,
                                selected: Boolean
                                )

case class ProductoWebImage(
                             id: Int,
                             file: String,
                             imageType: Int,
                             alt: String,
                             position: Int
)

case class ProductoKitItem(
                        id: Int,
                        quantity: Double,
                        variable: Boolean,
                        prIdItem: Int
                        )

case class ProductoBOM(
                        id: Int,
                        name: String,
                        code: String,
                        date: Date
                        )

case class ProductoItems(
                          proveedores: List[ProductoProveedor],
                          clientes: List[ProductoCliente],
                          cmi: List[ProductoCMI],
                          leyendas: List[ProductoLeyenda],
                          tags: List[ProductoTag],
                          categoriasWeb: List[ProductoCategoriaWeb],
                          catalogosWeb: List[ProductoCatalogoWeb],
                          webImages: List[ProductoWebImage],
                          kit: List[ProductoKitItem],
                          bom: List[ProductoBOM],
                          additionalFields: List[AdditionalFields]
                          )

case class Producto(
                     id: Int,
                     active: Boolean,
                     code: String,

                     base: ProductoBase,

                     compra: ProductoCompra,
                     stock: ProductoStock,
                     venta: ProductoVenta,

                     rubro: ProductoRubro,

                     comex: ProductoComex,
                     kit: ProductoKit,
                     web: ProductoWeb,
                     names: ProductoNombres,

                     items: ProductoItems,

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

            rubro: ProductoRubro,

            comex: ProductoComex,
            kit: ProductoKit,
            web: ProductoWeb,
            names: ProductoNombres,

            items: ProductoItems) = {

    this(
      id,
      active,
      code,

      base,

      compra,
      stock,
      venta,

      rubro,

      comex,
      kit,
      web,
      names,

      items,

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

            rubro: ProductoRubro,

            comex: ProductoComex,
            kit: ProductoKit,
            web: ProductoWeb,
            names: ProductoNombres,

            items: ProductoItems) = {

    this(
      DBHelper.NoId,
      active,
      code,

      base,

      compra,
      stock,
      venta,

      rubro,

      comex,
      kit,
      web,
      names,

      items
    )
  }

}

case class ProductoStockInfo(unName: String,
                             unNameCompra: String,
                             unNameVenta: String,
                             llevaNroSerie: Boolean,
                             llevaNroLote: Boolean,
                             loteFifo: Boolean,
                             esKit: Boolean,
                             rubId: Int,
                             cueIdCompra: Int,
                             cueIdVenta: Int,
                             ccosIdCompra: Int,
                             ccosNameCompra: String,
                             ccosIdVenta: Int,
                             ccosNameVenta: String
                           )

case class ProductoTaxInfo(
                            tiIdIvaRiCompra: Int,
                            cueIdIvaRiCompra: Int,
                            tiPorcIvaRiCompra: Double,

                            tiIdIvaRniCompra: Int,
                            cueIdIvaRniCompra: Int,
                            tiPorcIvaRniCompra: Double,

                            tiIdIvaRiVenta: Int,
                            cueIdIvaRiVenta: Int,
                            tiPorcIvaRiVenta: Double,

                            tiIdIvaRniVenta: Int,
                            cueIdIvaRniVenta: Int,
                            tiPorcIvaRniVenta: Double,

                            tiIdInternosC: Int,
                            tiPorcInternosC: Double,
                            tiIdInternosV: Int,
                            tiPorcInternosV: Double,
                            prPorcInternoC: Double,
                            prPorcInternoV: Double
                            )

object Producto {

  lazy val emptyProductoItems = ProductoItems(List(), List(), List(), List(), List(), List(), List(), List(), List(), List(), List())

  lazy val emptyProducto = Producto(
    false,
    "",

    ProductoBase("", "", "", DBHelper.NoId, DBHelper.NoId, 0,false, DBHelper.NoId),

    ProductoCompra(false,"", "", DBHelper.NoId, DBHelper.NoId, DBHelper.NoId, DBHelper.NoId, 0.0, DBHelper.NoId),
    ProductoStock(false, DBHelper.NoId, 0.0, 0, 0, 0, 0d, 0.0, 0.0, false, false, false, false, false),
    ProductoVenta(false, "", "", "", DBHelper.NoId, 0.0, 0.0, DBHelper.NoId, false, false, false, DBHelper.NoId, DBHelper.NoId, 0.0, DBHelper.NoId),

    ProductoRubro(DBHelper.NoId, DBHelper.NoId, DBHelper.NoId, DBHelper.NoId, DBHelper.NoId, DBHelper.NoId, DBHelper.NoId, DBHelper.NoId, DBHelper.NoId, DBHelper.NoId, DBHelper.NoId),

    ProductoComex(DBHelper.NoId, 0.0, 0.0, 0, DBHelper.NoId, false, DBHelper.NoId, DBHelper.NoId, DBHelper.NoId, DBHelper.NoId, DBHelper.NoId, DBHelper.NoId),
    ProductoKit(false, false, false, false, false, DBHelper.NoId, false, false, DBHelper.NoId),
    ProductoWeb("", "", DBHelper.NoId, false, false, "", "", 0, 0.0, DBHelper.NoId, ""),
    ProductoNombres(DBHelper.NoId, DBHelper.NoId, DBHelper.NoId, DBHelper.NoId, DBHelper.NoId, DBHelper.NoId),

    emptyProductoItems
  )

  lazy val emptyProductoStockInfo = ProductoStockInfo("", "", "", false, false, false, false, 0, 0, 0, 0, "", 0, "")
  lazy val emptyProductoTaxInfo = ProductoTaxInfo(0, 0, 0.0, 0, 0, 0.0, 0, 0, 0.0, 0, 0, 0.0, 0, 0.0, 0, 0.0, 0.0, 0.0)

  def apply(
             id: Int,
             active: Boolean,
             code: String,

             base: ProductoBase,

             compra: ProductoCompra,
             stock: ProductoStock,
             venta: ProductoVenta,

             rubro: ProductoRubro,

             comex: ProductoComex,
             kit: ProductoKit,
             web: ProductoWeb,
             names: ProductoNombres,

             items: ProductoItems
             ) = {

    new Producto(
      id,
      active,
      code,

      base,

      compra,
      stock,
      venta,

      rubro,

      comex,
      kit,
      web,
      names,

      items
    )
  }

  def apply(
             id: Int,
             active: Boolean,
             code: String,

             base: ProductoBase,

             compra: ProductoCompra,
             stock: ProductoStock,
             venta: ProductoVenta,

             rubro: ProductoRubro,

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

      rubro,

      comex,
      kit,
      web,
      names,

      emptyProductoItems
    )
  }

  def apply(
             active: Boolean,
             code: String,

             base: ProductoBase,

             compra: ProductoCompra,
             stock: ProductoStock,
             venta: ProductoVenta,

             rubro: ProductoRubro,

             comex: ProductoComex,
             kit: ProductoKit,
             web: ProductoWeb,
             names: ProductoNombres,

             items: ProductoItems
             ) = {

    new Producto(
      active,
      code,

      base,

      compra,
      stock,
      venta,

      rubro,

      comex,
      kit,
      web,
      names,

      items
    )
  }

  def apply(
             active: Boolean,
             code: String,

             base: ProductoBase,

             compra: ProductoCompra,
             stock: ProductoStock,
             venta: ProductoVenta,

             rubro: ProductoRubro,

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

      rubro,

      comex,
      kit,
      web,
      names,

      emptyProductoItems
    )
  }

  private val productoProveedorParser: RowParser[ProductoProveedor] = {
    SqlParser.get[Int](C.PRPROV_ID) ~
    SqlParser.get[Int](C.PROV_ID) ~
    SqlParser.get[String](C.PROV_NAME) ~
    SqlParser.get[Option[Int]](C.PRPROV_FABRICANTE) ~
    SqlParser.get[Option[String]](C.PRPROV_NAME) ~
    SqlParser.get[Option[String]](C.PRPROV_CODE) ~
    SqlParser.get[Option[String]](C.PRPROV_CODIGO_BARRA) ~
    SqlParser.get[Option[Int]](C.PA_ID) ~
    SqlParser.get[Option[String]](C.PA_NAME) ~
    SqlParser.get[Option[String]](C.LP_NAME) ~
    SqlParser.get[Option[BigDecimal]](C.LPI_PRECIO) ~
    SqlParser.get[Option[Date]](C.LPI_FECHA) ~
    SqlParser.get[Option[Int]](C.PRPROV_LPI_TOP) map {
    case
        id ~
        provId ~
        provName ~
        maker ~
        name ~
        code ~
        barCode ~
        paId ~
        paName ~
        lpName ~
        price ~
        priceDate ~
        priceDefault =>
      ProductoProveedor(
        id,
        provId,
        provName,
        maker.getOrElse(0) != 0,
        name.getOrElse(""),
        code.getOrElse(""),
        barCode.getOrElse(""),
        paId.getOrElse(DBHelper.NoId),
        paName.getOrElse(""),
        lpName.getOrElse(""),
        price match { case Some(p) => p.doubleValue case None => 0.0 },
        priceDate.getOrElse(U.NO_DATE),
        priceDefault != 0)
    }
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
    SqlParser.get[Option[Int]](C.RUB_ID) ~
    SqlParser.get[Option[String]](C.RUB_NAME) ~
    SqlParser.get[Option[Int]](C.RUBTI_ID_1) ~
    SqlParser.get[Option[String]](C.RUBTI_NAME_1) ~
    SqlParser.get[Option[Int]](C.RUBTI_ID_2) ~
    SqlParser.get[Option[String]](C.RUBTI_NAME_2) ~
    SqlParser.get[Option[Int]](C.RUBTI_ID_3) ~
    SqlParser.get[Option[String]](C.RUBTI_NAME_3) ~
    SqlParser.get[Option[Int]](C.RUBTI_ID_4) ~
    SqlParser.get[Option[String]](C.RUBTI_NAME_4) ~
    SqlParser.get[Option[Int]](C.RUBTI_ID_5) ~
    SqlParser.get[Option[String]](C.RUBTI_NAME_5) ~
    SqlParser.get[Option[Int]](C.RUBTI_ID_6) ~
    SqlParser.get[Option[String]](C.RUBTI_NAME_6) ~
    SqlParser.get[Option[Int]](C.RUBTI_ID_7) ~
    SqlParser.get[Option[String]](C.RUBTI_NAME_7) ~
    SqlParser.get[Option[Int]](C.RUBTI_ID_8) ~
    SqlParser.get[Option[String]](C.RUBTI_NAME_8) ~
    SqlParser.get[Option[Int]](C.RUBTI_ID_9) ~
    SqlParser.get[Option[String]](C.RUBTI_NAME_9) ~
    SqlParser.get[Option[Int]](C.RUBTI_ID_10) ~
    SqlParser.get[Option[String]](C.RUBTI_NAME_10) ~
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

        rubId ~
        rubName ~
        rubtiId1 ~
        rubtiName1 ~
        rubtiId2 ~
        rubtiName2 ~
        rubtiId3 ~
        rubtiName3 ~
        rubtiId4 ~
        rubtiName4 ~
        rubtiId5 ~
        rubtiName5 ~
        rubtiId6 ~
        rubtiName6 ~
        rubtiId7 ~
        rubtiName7 ~
        rubtiId8 ~
        rubtiName8 ~
        rubtiId9 ~
        rubtiName9 ~
        rubtiId10 ~
        rubtiName10 ~

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
        active != 0,
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
          esPlantilla != 0,
          curId.getOrElse(DBHelper.NoId),
          curName.getOrElse("")
        ),
        ProductoCompra(
          seCompra != 0,
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
          llevaStock != 0,
          unIdStock.getOrElse(DBHelper.NoId),
          unNameStock.getOrElse(""),
          stockCompra,
          x,
          y,
          z,
          stockMinimo,
          reposicion,
          stockMaximo,
          llevaNroSerie != 0,
          llevaNroLote != 0,
          loteFifo != 0,
          seProduce != 0,
          esRepuesto != 0),
        ProductoVenta(
          seVende != 0,
          nombreVenta,
          nombreFactura,
          descripVenta,
          unIdVenta.getOrElse(DBHelper.NoId),
          unNameVenta.getOrElse(""),
          ventaCompra,
          ventaStock,
          cuegIdVenta.getOrElse(DBHelper.NoId),
          cuegNameVenta.getOrElse(""),
          esLista != 0,
          dinerario != 0,
          noRedondeo != 0,
          tiIdRiVenta.getOrElse(DBHelper.NoId),
          tiNameRiVenta.getOrElse(""),
          tiIdInternosVenta.getOrElse(DBHelper.NoId),
          tiNameIntVenta.getOrElse(""),
          porcInternoV,
          ccosIdVenta.getOrElse(DBHelper.NoId),
          ccosNameVenta.getOrElse("")),
        ProductoRubro(
          rubId.getOrElse(DBHelper.NoId),
          rubName.getOrElse(""),
          rubtiId1.getOrElse(DBHelper.NoId),
          rubtiName1.getOrElse(""),
          rubtiId2.getOrElse(DBHelper.NoId),
          rubtiName2.getOrElse(""),
          rubtiId3.getOrElse(DBHelper.NoId),
          rubtiName3.getOrElse(""),
          rubtiId4.getOrElse(DBHelper.NoId),
          rubtiName4.getOrElse(""),
          rubtiId5.getOrElse(DBHelper.NoId),
          rubtiName5.getOrElse(""),
          rubtiId6.getOrElse(DBHelper.NoId),
          rubtiName6.getOrElse(""),
          rubtiId7.getOrElse(DBHelper.NoId),
          rubtiName7.getOrElse(""),
          rubtiId8.getOrElse(DBHelper.NoId),
          rubtiName8.getOrElse(""),
          rubtiId9.getOrElse(DBHelper.NoId),
          rubtiName9.getOrElse(""),
          rubtiId10.getOrElse(DBHelper.NoId),
          rubtiName10.getOrElse("")),
        ProductoComex(
          unIdPeso.getOrElse(DBHelper.NoId),
          unNamePeso.getOrElse(""),
          pesoNeto.doubleValue,
          pesoTotal.doubleValue,
          cantXCajaExpo,
          emblId.getOrElse(DBHelper.NoId),
          emblName.getOrElse(""),
          fleteExpo != 0,
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
          esKit != 0,
          kitStockXItem != 0,
          kitResumido != 0,
          kitIdentidad != 0,
          kitIdentidadXItem != 0,
          taIdKitSerie.getOrElse(DBHelper.NoId),
          taNameKitSerie.getOrElse(""),
          kitLote != 0,
          kitLoteXItem != 0,
          taIdKitLote.getOrElse(DBHelper.NoId),
          taNameKitLote.getOrElse("")),
        ProductoWeb(
          nombreWeb,
          aliasWeb,
          prIdWebPadre.getOrElse(DBHelper.NoId),
          prNameWebPadre.getOrElse(""),
          activoWeb != 0,
          webImageUpdate != 0,
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
        emptyProductoItems,
        createdAt,
        updatedAt,
        updatedBy)
    }
  }

  private val productoStockInfoParser: RowParser[ProductoStockInfo] = {
    SqlParser.get[Option[String]](C.UN_NAME_STOCK) ~
    SqlParser.get[Option[String]](C.UN_NAME_COMPRA) ~
    SqlParser.get[Option[String]](C.UN_NAME_VENTA) ~
    SqlParser.get[Int](C.PR_LLEVA_NRO_SERIE) ~
    SqlParser.get[Int](C.PR_LLEVA_NRO_LOTE) ~
    SqlParser.get[Int](C.PR_LOTE_FIFO) ~
    SqlParser.get[Int](C.PR_ES_KIT) ~
    SqlParser.get[Option[Int]](C.RUB_ID) ~
    SqlParser.get[Option[Int]](C.CUE_ID_COMPRA) ~
    SqlParser.get[Option[Int]](C.CUE_ID_VENTA) ~
    SqlParser.get[Option[Int]](C.CCOS_ID_COMPRA) ~
    SqlParser.get[Option[String]](C.CCOS_NAME_COMPRA) ~
    SqlParser.get[Option[Int]](C.CCOS_ID_VENTA) ~
    SqlParser.get[Option[String]](C.CCOS_NAME_VENTA) map {
    case
      unName ~
      unNameCompra ~
      unNameVenta ~
      llevaNroSerie ~
      llevaNroLote ~
      loteFifo ~
      esKit ~
      rubId ~
      cueIdCompra ~
      cueIdVenta ~
      ccosIdCompra ~
      ccosNameCompra ~
      ccosIdVenta ~
      ccosNameVenta =>
      ProductoStockInfo(
        unName.getOrElse(""),
        unNameCompra.getOrElse(""),
        unNameVenta.getOrElse(""),
        llevaNroSerie != 0,
        llevaNroLote != 0,
        loteFifo != 0,
        esKit != 0,
        rubId.getOrElse(DBHelper.NoId),
        cueIdCompra.getOrElse(DBHelper.NoId),
        cueIdVenta.getOrElse(DBHelper.NoId),
        ccosIdCompra.getOrElse(DBHelper.NoId),
        ccosNameCompra.getOrElse(""),
        ccosIdVenta.getOrElse(DBHelper.NoId),
        ccosNameVenta.getOrElse("")
      )
    }
  }

  private val productoTaxInfoParser: RowParser[ProductoTaxInfo] = {
      SqlParser.get[Option[Int]](C.TI_ID_RI_COMPRA) ~
      SqlParser.get[Option[Int]](C.CUE_ID_RI_COMPRA) ~
      SqlParser.get[Option[BigDecimal]](C.TI_RI_PORC_COMPRA) ~
      SqlParser.get[Option[Int]](C.TI_ID_RNI_COMPRA) ~
      SqlParser.get[Option[Int]](C.CUE_ID_RNI_COMPRA) ~
      SqlParser.get[Option[BigDecimal]](C.TI_RNI_PORC_COMPRA) ~
      SqlParser.get[Option[Int]](C.TI_ID_RI_VENTA) ~
      SqlParser.get[Option[Int]](C.CUE_ID_RI_VENTA) ~
      SqlParser.get[Option[BigDecimal]](C.TI_RI_PORC_VENTA) ~
      SqlParser.get[Option[Int]](C.TI_ID_RNI_VENTA) ~
      SqlParser.get[Option[Int]](C.CUE_ID_RNI_VENTA) ~
      SqlParser.get[Option[BigDecimal]](C.TI_RNI_PORC_VENTA) ~
      SqlParser.get[Option[Int]](C.TI_ID_INTERNOS_COMPRA) ~
      SqlParser.get[Option[BigDecimal]](C.TI_PORC_INTERNOS_COMPRA) ~
      SqlParser.get[Option[Int]](C.TI_ID_INTERNOS_VENTA) ~
      SqlParser.get[Option[BigDecimal]](C.TI_PORC_INTERNOS_VENTA) ~
      SqlParser.get[Option[Float]](C.PR_PORC_INTERNO_C) ~
      SqlParser.get[Option[Float]](C.PR_PORC_INTERNO_V) map {
      case
          tiIdIvaRiCompra ~
          cueIdIvaRiCompra ~
          tiRiPorcCompra ~
          tiIdIvaRniCompra ~
          cueIdIvaRniCompra ~
          tiRniPorcCompra ~
          tiIdIvaRiVenta ~
          cueIdIvaRiVenta ~
          tiRiPorcVenta ~
          tiIdIvaRniVenta ~
          cueIdIvaRniVenta ~
          tiRniPorcVenta ~
          tiIdInternosC ~
          tiPorcInternosC ~
          tiIdInternosV ~
          tiPorcInternosV ~
          prPorcInternoC ~
          prPorcInternoV =>
        ProductoTaxInfo(
          tiIdIvaRiCompra.getOrElse(DBHelper.NoId),
          cueIdIvaRiCompra.getOrElse(DBHelper.NoId),
          tiRiPorcCompra match { case Some(d) => d.doubleValue() case None => 0.0 },
          tiIdIvaRniCompra.getOrElse(DBHelper.NoId),
          cueIdIvaRniCompra.getOrElse(DBHelper.NoId),
          tiRniPorcCompra match { case Some(d) => d.doubleValue() case None => 0.0 },
          tiIdIvaRiVenta.getOrElse(DBHelper.NoId),
          cueIdIvaRiVenta.getOrElse(DBHelper.NoId),
          tiRiPorcVenta match { case Some(d) => d.doubleValue() case None => 0.0 },
          tiIdIvaRniVenta.getOrElse(DBHelper.NoId),
          cueIdIvaRniVenta.getOrElse(DBHelper.NoId),
          tiRniPorcVenta match { case Some(d) => d.doubleValue() case None => 0.0 },
          tiIdInternosC.getOrElse(DBHelper.NoId),
          tiPorcInternosC match { case Some(d) => d.doubleValue() case None => 0.0 },
          tiIdInternosV.getOrElse(DBHelper.NoId),
          tiPorcInternosV match { case Some(d) => d.doubleValue() case None => 0.0 },
          prPorcInternoC match { case Some(d) => d case None => 0.0 },
          prPorcInternoV match { case Some(d) => d case None => 0.0 }
        )
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

        Field(C.RUB_ID, producto.rubro.rubId, FieldType.id),
        Field(C.RUBTI_ID_1, producto.rubro.rubtiId1, FieldType.id),
        Field(C.RUBTI_ID_2, producto.rubro.rubtiId2, FieldType.id),
        Field(C.RUBTI_ID_3, producto.rubro.rubtiId3, FieldType.id),
        Field(C.RUBTI_ID_4, producto.rubro.rubtiId4, FieldType.id),
        Field(C.RUBTI_ID_5, producto.rubro.rubtiId5, FieldType.id),
        Field(C.RUBTI_ID_6, producto.rubro.rubtiId6, FieldType.id),
        Field(C.RUBTI_ID_7, producto.rubro.rubtiId7, FieldType.id),
        Field(C.RUBTI_ID_8, producto.rubro.rubtiId8, FieldType.id),
        Field(C.RUBTI_ID_9, producto.rubro.rubtiId9, FieldType.id),
        Field(C.RUBTI_ID_10, producto.rubro.rubtiId10, FieldType.id),

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

  def load(user: CompanyUser, id: Int): Option[Producto] = {

    DB.withTransaction(user.database.database) { implicit connection =>

      val sql = "{call sp_producto_get(?, ?)}"
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

  private def loadProductoItems(user: CompanyUser, id: Int) = {
    ProductoItems(
      loadProveedores(user, id),
      List(), List(), List(), List(), List(), List(), List(), List(), List(), List())
  }

  private def loadProveedores(user: CompanyUser, id: Int) = {

    DB.withTransaction(user.database.database) { implicit connection =>

      val sql = "{call sp_producto_get_proveedores(?, ?)}"
      val cs = connection.prepareCall(sql)

      cs.setInt(1, id)
      cs.registerOutParameter(2, Types.OTHER)

      try {
        cs.execute()

        val rs = cs.getObject(2).asInstanceOf[java.sql.ResultSet]
        Sql.as(productoProveedorParser.*, rs)

      } catch {
        case NonFatal(e) => {
          Logger.error(s"can't get ${C.PRODUCTO_PROVEEDOR} with id $id for user ${user.toString}. Error ${e.toString}")
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
        SQL("sp_producto_delete {id}")
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
      case Some(p) => {
        Producto(
          p.id,
          p.active,
          p.code,

          p.base,

          p.compra,
          p.stock,
          p.venta,

          p.rubro,

          p.comex,
          p.kit,
          p.web,
          p.names,

          loadProductoItems(user, id)
        )
      }
      case None => emptyProducto
    }
  }

  def getStockInfo(user: CompanyUser, id: Int, cliId: Option[Int], provId: Option[Int]): ProductoStockInfo = {
    val stockInfo = {
      DB.withTransaction(user.database.database) { implicit connection =>

        val sql = "{call sp_producto_stock_get_data(?, ?, ?, ?)}"
        val cs = connection.prepareCall(sql)

        cs.setInt(1, id)
        cliId match {
          case Some(id) => cs.setInt(2, id)
          case None => cs.setNull(2, Types.INTEGER)
        }
        provId match {
          case Some(id) => cs.setInt(3, id)
          case None => cs.setNull(3, Types.INTEGER)
        }
        cs.registerOutParameter(4, Types.OTHER)

        try {
          cs.execute()

          val rs = cs.getObject(4).asInstanceOf[java.sql.ResultSet]
          Sql.as(productoStockInfoParser.singleOpt, rs)

        } catch {
          case NonFatal(e) => {
            Logger.error(s"can't get stock info with prId $id and cliId $cliId and provId $provId for user ${user.toString}. Error ${e.toString}")
            throw e
          }
        } finally {
          cs.close
        }
      }
    }

    stockInfo.getOrElse(emptyProductoStockInfo)
  }

  def getPrice(user: CompanyUser, id: Int, lpId: Int): Double = {

    DB.withTransaction(user.database.database) { implicit connection =>

      val sql = "{call sp_lp_get_precio(?, ?, ?)}"
      val cs = connection.prepareCall(sql)

      cs.setInt(1, id)
      cs.setInt(2, lpId)
      cs.registerOutParameter(3, Types.DECIMAL)

      try {
        cs.execute()

        cs.getBigDecimal(3).doubleValue

      } catch {
        case NonFatal(e) => {
          Logger.error(s"can't get price with prId $id and lpId $lpId for user ${user.toString}. Error ${e.toString}")
          throw e
        }
      } finally {
        cs.close
      }
    }
  }

  def getDiscount(user: CompanyUser, id: Int, ldId: Int, price: Double): Double = {

    DB.withTransaction(user.database.database) { implicit connection =>

      val sql = "{call sp_ld_get_descuento(?, ?, ?)}"
      val cs = connection.prepareCall(sql)

      cs.setInt(1, id)
      cs.setInt(2, ldId)
      cs.registerOutParameter(3, Types.DECIMAL)
      cs.setBigDecimal(3, new BigDecimal(price))

      try {
        cs.execute()

        cs.getBigDecimal(3).doubleValue

      } catch {
        case NonFatal(e) => {
          Logger.error(s"can't get discount with prId $id and ldId $ldId for user ${user.toString}. Error ${e.toString}")
          throw e
        }
      } finally {
        cs.close
      }
    }
  }

  def getDiscountDescription(user: CompanyUser, id: Int, ldId: Int): String = {

    DB.withTransaction(user.database.database) { implicit connection =>

      val sql = "{call sp_ld_get_descuento_str(?, ?, ?)}"
      val cs = connection.prepareCall(sql)

      cs.setInt(1, id)
      cs.setInt(2, ldId)
      cs.registerOutParameter(3, Types.VARCHAR)
      cs.setString(3, "")

      try {
        cs.execute()

        cs.getString(3)

      } catch {
        case NonFatal(e) => {
          Logger.error(s"can't get discount with prId $id and ldId $ldId for user ${user.toString}. Error ${e.toString}")
          throw e
        }
      } finally {
        cs.close
      }
    }
  }

  def getTaxes(user: CompanyUser, id: Int): ProductoTaxInfo = {
    val taxInfo = {
      DB.withTransaction(user.database.database) { implicit connection =>

        val sql = "{call sp_producto_get_tasas(?, ?)}"
        val cs = connection.prepareCall(sql)

        cs.setInt(1, id)
        cs.registerOutParameter(2, Types.OTHER)

        try {
          cs.execute()

          val rs = cs.getObject(2).asInstanceOf[java.sql.ResultSet]
          Sql.as(productoTaxInfoParser.singleOpt, rs)

        } catch {
          case NonFatal(e) => {
            Logger.error(s"can't get tax info with prId $id for user ${user.toString}. Error ${e.toString}")
            throw e
          }
        } finally {
          cs.close
        }
      }
    }

    taxInfo.getOrElse(emptyProductoTaxInfo)
  }

}