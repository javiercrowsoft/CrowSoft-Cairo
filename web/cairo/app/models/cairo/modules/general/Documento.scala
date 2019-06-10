package models.cairo.modules.general

import java.sql.{CallableStatement, Connection, ResultSet, SQLException, Types}

import anorm.SqlParser._
import anorm._
import services.DateUtil
import services.db.DB
import models.cairo.system.database.{DBHelper, Field, FieldType, Register, SaveResult}
import models.cairo.system.database.DBHelper.rowToFloat
import java.math.BigDecimal

import play.api.Play.current
import models.domain.CompanyUser
import java.util.Date

import controllers.logged.modules.general.{FirmaData, ReporteData}
import play.api.Logger
import play.api.libs.json._

import scala.util.control.NonFatal

case class DocumentoBase (
                           name: String,
                           editarImpresos: Boolean,
                           llevaFirma: Boolean,
                           llevaFirmaCredito: Boolean,
                           llevaFirmaPrint: Boolean,
                           objectEdit: String,

                           tipo: DocumentoTipo,

                           generaRemito: Boolean,
                           mueveStock: Boolean,

                           facturaVenta: DocumentoFacturaVenta,

                           esResumenBco: Boolean,

                           esCobChequeSGR: Boolean,
                           esCobCaidaSGR: Boolean,

                           stConsumo: Boolean,

                           descrip: String
                        )

case class DocumentoFacturaVenta(
                                  esFacturaElectronica: Int,
                                  sinPercepcion: Boolean,
                                  esCreditoBanco: Boolean,
                                  esVentaAccion: Boolean,
                                  esVentaCheque: Boolean
                         )

case class DocumentoTipo(
                          tipoFactura: Int,
                          tipoPackingList: Int,
                          tipoOrdenCompra: Int,
                          rcDesdeOc: Boolean,
                          rcDesdeDespacho: Boolean,
                          pvDesdePrv: Boolean,
                          rvDesdePv: Boolean,
                          rvDesdeOs: Boolean,
                          rvBOM: Boolean
                        )

case class DocumentoTalonario(
                               taId: Int,
                               taName: String,
                               taIdFinal: Int,
                               taNameFinal: String,
                               taIdInscripto: Int,
                               taNameInscripto: String,
                               taIdExterno: Int,
                               taNameExterno: String,
                               taIdInscriptoM: Int,
                               taNameInscriptoM: String,
                               taIdHaberes: Int,
                               taNameHaberes: String
                             ) {
  def this(
            taId: Int,
            taIdFinal: Int,
            taIdInscripto: Int,
            taIdExterno: Int,
            taIdInscriptoM: Int,
            taIdHaberes: Int
          ) = {
    this(
      taId,
      "",
      taIdFinal,
      "",
      taIdInscripto,
      "",
      taIdExterno,
      "",
      taIdInscriptoM,
      "",
      taIdHaberes,
      ""
    )
  }
}

object DocumentoTalonario {

  def apply(
             taId: Int,
             taIdFinal: Int,
             taIdInscripto: Int,
             taIdExterno: Int,
             taIdInscriptoM: Int,
             taIdHaberes: Int) = {

    new DocumentoTalonario(
      taId,
      taIdFinal,
      taIdInscripto,
      taIdExterno,
      taIdInscriptoM,
      taIdHaberes)
  }
}

case class DocumentoAux(
                                docIdAsiento: Int,
                                docNameAsiento: String,
                                docIdRemito: Int,
                                docNameRemito: String,
                                docIdStock: Int,
                                docNameStock: String,
                                docgId: Int,
                                docgName: String
                              ) {
  def this(
            docIdAsiento: Int,
            docIdRemito: Int,
            docIdStock: Int,
            docgId: Int
          ) = {
    this(
      docIdAsiento,
      "",
      docIdRemito,
      "",
      docIdStock,
      "",
      docgId,
      ""
    )
  }
}

object DocumentoAux {

  def apply(
             docIdAsiento: Int,
             docIdRemito: Int,
             docIdStock: Int,
             docgId: Int) = {

    new DocumentoAux(
      docIdAsiento,
      docIdRemito,
      docIdStock,
      docgId)
  }
}

case class DocumentoReferences(
                                cicoId: Int,
                                cicoName: String,
                                empId: Int,
                                empName: String,
                                doctId: Int,
                                doctName: String,
                                fcaId: Int,
                                fcaName: String,
                                monId: Int,
                                monName: String,
                                cuegId: Int,
                                cuegName: String
                        ) {
  def this(
            cicoId: Int,
            empId: Int,
            doctId: Int,
            fcaId: Int,
            monId: Int,
            cuegId: Int
          ) = {
    this(
      cicoId,
      "",
      empId,
      "",
      doctId,
      "",
      fcaId,
      "",
      monId,
      "",
      cuegId
    )
  }
}

object DocumentoReferences {

  def apply(
             cicoId: Int,
             empId: Int,
             doctId: Int,
             fcaId: Int,
             monId: Int,
             cuegId: Int) = {

    new DocumentoReferences(
      cicoId,
      empId,
      doctId,
      fcaId,
      monId,
      cuegId)
  }
}

//
// items
//

case class Reporte(
                    id: Int,
                    name: String,
                    csrFile: String,
                    sugerido: Boolean,
                    sugeridoMail: Boolean,
                    copias: Int,
                    printInNew: Boolean,
                    rptObj: String
                            )

case class Firma(
                  id: Int,
                  usId: Int,
                  usName: String
                          ) {
  def this(
            id: Int,
            usId: Int
          ) = {
    this(
      id,
      usId,
      ""
    )
  }

object Firma {

  def apply(id: Int, usId: Int) = {
    new Firma(id, usId)
  }
}

case class DocumentoItems(
                           reportes: List[Reporte],
                           firmas: List[Firma],

                           /* only used in save */
                           reporteDeleted: String,
                           firmaDeleted: String
                        )

case class Documento(
                     id: Int,
                     active: Boolean,
                     code: String,

                     base: DocumentoBase,
                     talonario: DocumentoTalonario,
                     docAux: DocumentoAux,
                     references: DocumentoReferences,

                     items: DocumentoItems,

                     createdAt: Date,
                     updatedAt: Date,
                     updatedBy: Int) {

  def this(
            id: Int,
            active: Boolean,
            code: String,

            base: DocumentoBase,
            talonario: DocumentoTalonario,
            docAux: DocumentoAux,
            references: DocumentoReferences,

            items: DocumentoItems) = {

    this(
      id,
      active,
      code,

      base,
      talonario,
      docAux,
      references,

      items,

      DateUtil.currentTime,
      DateUtil.currentTime,
      DBHelper.NoId)
  }

  def this(
            active: Boolean,
            code: String,

            base: DocumentoBase,
            talonario: DocumentoTalonario,
            docAux: DocumentoAux,
            references: DocumentoReferences,

            items: DocumentoItems) = {

    this(
      DBHelper.NoId,
      active,
      code,

      base,
      talonario,
      docAux,
      references,

      items
    )
  }

}


object Documento {

  lazy val emptyDocumentoItems = DocumentoItems(
    List(), List(), List(), List(), List(), List(), List(), List(), List(), List(), List(),
    "", "", "", "", "", ""
  )

  lazy val emptyDocumentoRubroTables = DocumentoRubroTables(
    DBHelper.NoId, DBHelper.NoId, DBHelper.NoId, DBHelper.NoId, DBHelper.NoId, DBHelper.NoId,
    DBHelper.NoId, DBHelper.NoId, DBHelper.NoId, DBHelper.NoId
  )

  lazy val emptyDocumento = Documento(
    false,
    "",

    DocumentoBase("", "", "", DBHelper.NoId, DBHelper.NoId, 0,false, DBHelper.NoId),

    DocumentoCompra(false,"", "", DBHelper.NoId, DBHelper.NoId, DBHelper.NoId, DBHelper.NoId, 0.0, DBHelper.NoId),
    DocumentoStock(false, DBHelper.NoId, 0.0, 0, 0, 0, 0d, 0.0, 0.0, false, false, false, false, false),
    DocumentoVenta(false, "", "", "", DBHelper.NoId, 0.0, 0.0, DBHelper.NoId, false, false, false, DBHelper.NoId,
      DBHelper.NoId, 0.0, DBHelper.NoId),

    DocumentoRubro(DBHelper.NoId, DBHelper.NoId, DBHelper.NoId, DBHelper.NoId, DBHelper.NoId, DBHelper.NoId, DBHelper.NoId,
      DBHelper.NoId, DBHelper.NoId, DBHelper.NoId, DBHelper.NoId),

    emptyDocumentoRubroTables,

    DocumentoComex(DBHelper.NoId, 0.0, 0.0, 0, DBHelper.NoId, false, DBHelper.NoId, DBHelper.NoId, DBHelper.NoId,
      DBHelper.NoId, DBHelper.NoId, DBHelper.NoId),

    DocumentoKit(false, false, false, false, false, DBHelper.NoId, false, false, DBHelper.NoId),
    DocumentoWeb("", "", DBHelper.NoId, false, false, "", "", 0, 0.0, DBHelper.NoId, ""),
    DocumentoNombres(DBHelper.NoId, DBHelper.NoId, DBHelper.NoId, DBHelper.NoId, DBHelper.NoId, DBHelper.NoId),

    emptyDocumentoItems
  )

  lazy val emptyDocumentoStockInfo = DocumentoStockInfo("", "", "", false, false, false, false, 0, 0, 0, 0, "", 0, "")
  lazy val emptyDocumentoTaxInfo = DocumentoTaxInfo(0, 0, 0.0, 0, 0, 0.0, 0, 0, 0.0, 0, 0, 0.0, 0, 0.0, 0, 0.0, 0.0, 0.0)

  def apply(
             id: Int,
             active: Boolean,
             code: String,

             base: DocumentoBase,

             compra: DocumentoCompra,
             stock: DocumentoStock,
             venta: DocumentoVenta,

             rubro: DocumentoRubro,
             rubroTables: DocumentoRubroTables,

             comex: DocumentoComex,
             kit: DocumentoKit,
             web: DocumentoWeb,
             names: DocumentoNombres,

             items: DocumentoItems
           ) = {

    new Documento(
      id,
      active,
      code,

      base,

      compra,
      stock,
      venta,

      rubro,
      rubroTables,

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

             base: DocumentoBase,

             compra: DocumentoCompra,
             stock: DocumentoStock,
             venta: DocumentoVenta,

             rubro: DocumentoRubro,
             rubroTables: DocumentoRubroTables,

             comex: DocumentoComex,
             kit: DocumentoKit,
             web: DocumentoWeb,
             names: DocumentoNombres
           ) = {

    new Documento(
      id,
      active,
      code,

      base,

      compra,
      stock,
      venta,

      rubro,
      rubroTables,

      comex,
      kit,
      web,
      names,

      emptyDocumentoItems
    )
  }

  def apply(
             active: Boolean,
             code: String,

             base: DocumentoBase,

             compra: DocumentoCompra,
             stock: DocumentoStock,
             venta: DocumentoVenta,

             rubro: DocumentoRubro,
             rubroTables: DocumentoRubroTables,

             comex: DocumentoComex,
             kit: DocumentoKit,
             web: DocumentoWeb,
             names: DocumentoNombres,

             items: DocumentoItems
           ) = {

    new Documento(
      active,
      code,

      base,

      compra,
      stock,
      venta,

      rubro,
      rubroTables,

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

             base: DocumentoBase,

             compra: DocumentoCompra,
             stock: DocumentoStock,
             venta: DocumentoVenta,

             rubro: DocumentoRubro,
             rubroTables: DocumentoRubroTables,

             comex: DocumentoComex,
             kit: DocumentoKit,
             web: DocumentoWeb,
             names: DocumentoNombres
           ) = {

    new Documento(
      active,
      code,

      base,

      compra,
      stock,
      venta,

      rubro,
      rubroTables,

      comex,
      kit,
      web,
      names,

      emptyDocumentoItems
    )
  }

  private val DocumentoProveedorParser: RowParser[DocumentoProveedor] = {
    SqlParser.get[Int](C.PRPROV_ID) ~
      SqlParser.get[Int](C.PROV_ID) ~
      SqlParser.get[String](C.PROV_NAME) ~
      SqlParser.get[Option[Int]](C.PRPROV_FABRICANTE) ~
      SqlParser.get[Option[String]](C.PRPROV_NAME) ~
      SqlParser.get[Option[String]](C.PRPROV_CODE) ~
      SqlParser.get[Option[String]](C.PRPROV_CODIGO_BARRA) ~
      SqlParser.get[Option[Int]](C.PA_ID) ~
      SqlParser.get[Option[String]](C.PA_NAME) ~
      SqlParser.get[Option[Int]](C.LP_ID) ~
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
          lpId ~
          lpName ~
          price ~
          priceDate ~
          priceDefault =>
        DocumentoProveedor(
          id,
          provId,
          provName,
          maker.getOrElse(0) != 0,
          name.getOrElse(""),
          code.getOrElse(""),
          barCode.getOrElse(""),
          paId.getOrElse(DBHelper.NoId),
          paName.getOrElse(""),
          lpId.getOrElse(DBHelper.NoId),
          lpName.getOrElse(""),
          price match { case Some(p) => p.doubleValue case None => 0.0 },
          priceDate.getOrElse(U.NO_DATE),
          priceDefault != 0)
    }
  }

  private val DocumentoClienteParser: RowParser[DocumentoCliente] = {
    SqlParser.get[Int](C.PRCLI_ID) ~
      SqlParser.get[Int](C.CLI_ID) ~
      SqlParser.get[String](C.CLI_NAME) ~
      SqlParser.get[String](C.PRCLI_CODE) ~
      SqlParser.get[String](C.PRCLI_CODIGO_BARRA) map {
      case
        id ~
          cliId ~
          cliName ~
          code ~
          barCode =>
        DocumentoCliente(
          id,
          cliId,
          cliName,
          code,
          barCode)
    }
  }

  private val DocumentoCMIParser: RowParser[DocumentoCMI] = {
    SqlParser.get[Int](C.PRCMI_ID) ~
      SqlParser.get[Int](C.CMI_ID) ~
      SqlParser.get[String](C.CMI_NAME) ~
      SqlParser.get[String](C.PRCMI_CODE) ~
      SqlParser.get[String](C.PRCMI_DESCRIP) ~
      SqlParser.get[Date](C.PRCMI_FECHA_ALTA) ~
      SqlParser.get[Date](C.PRCMI_FECHA_VTO) ~
      SqlParser.get[BigDecimal](C.PRCMI_PRECIO) map {
      case
        id  ~
          cmiId ~
          cmiName ~
          code ~
          descrip ~
          createdAt ~
          expireDate ~
          price =>
        DocumentoCMI(
          id,
          cmiId,
          cmiName,
          code,
          descrip,
          createdAt,
          expireDate,
          price.doubleValue)
    }
  }

  private val DocumentoLeyendaParser: RowParser[DocumentoLeyenda] = {
    SqlParser.get[Int](C.PRL_ID) ~
      SqlParser.get[String](C.PRL_NAME) ~
      SqlParser.get[String](C.PRL_TEXTO) ~
      SqlParser.get[String](C.PRL_TAG) ~
      SqlParser.get[String](C.PRL_ORDEN) map {
      case
        id ~
          name ~
          text ~
          tag ~
          order =>
        DocumentoLeyenda(
          id,
          name,
          text,
          tag,
          order)
    }
  }

  private val DocumentoTagParser: RowParser[DocumentoTag] = {
    SqlParser.get[Int](C.PRT_ID) ~
      SqlParser.get[String](C.PRT_TEXTO) ~
      SqlParser.get[Option[Int]](C.PR_ID_TAG) ~
      SqlParser.get[Option[String]](C.PR_NAME_COMPRA) ~
      SqlParser.get[Option[Int]](C.PRT_ORDEN) ~
      SqlParser.get[Int](C.PRT_EXPO_WEB) ~
      SqlParser.get[Int](C.PRT_EXPO_CAIRO) map {
      case
        id ~
          text ~
          prIdTag ~
          prName ~
          order ~
          expoWeb ~
          expoCairo =>
        DocumentoTag(
          id,
          text,
          prIdTag.getOrElse(DBHelper.NoId),
          prName.getOrElse(""),
          order.getOrElse(0),
          expoWeb,
          expoCairo)
    }
  }

  private val DocumentoCategoriaWebParser: RowParser[DocumentoCategoriaWeb] = {
    SqlParser.get[Option[Int]](C.CATWCI_ID) ~
      SqlParser.get[Int](C.CATWC_ID) ~
      SqlParser.get[String](C.CATWC_NAME) ~
      SqlParser.get[Option[Int]](C.CATWCI_POSICION) map {
      case
        id ~
          catwcId ~
          catwcName ~
          position =>
        DocumentoCategoriaWeb(
          id.getOrElse(DBHelper.NoId),
          catwcId,
          catwcName,
          position.getOrElse(0))
    }
  }

  private val DocumentoCatalogoWebParser: RowParser[DocumentoCatalogoWeb] = {
    SqlParser.get[Option[Int]](C.CATWI_ID) ~
      SqlParser.get[Int](C.CATW_ID) ~
      SqlParser.get[String](C.CATW_NAME) map {
      case
        id ~
          catwId ~
          catwName =>
        DocumentoCatalogoWeb(
          id.getOrElse(DBHelper.NoId),
          catwId,
          catwName)
    }
  }

  private val DocumentoWebImageParser: RowParser[DocumentoWebImage] = {
    SqlParser.get[Int](C.PRWI_ID) ~
      SqlParser.get[String](C.PRWI_ARCHIVO) ~
      SqlParser.get[Int](C.PRWI_TIPO) ~
      SqlParser.get[String](C.PRWI_ALT) ~
      SqlParser.get[Int](C.PRWI_POSICION) map {
      case
        id ~
          file ~
          imageType ~
          alt ~
          position =>
        DocumentoWebImage(
          id,
          file,
          imageType,
          alt,
          position)
    }
  }

  private val DocumentoKitParser: RowParser[DocumentoKitItem] = {
    SqlParser.get[Int](C.PRFK_ID) ~
      SqlParser.get[String](C.PRFK_NAME) ~
      SqlParser.get[Int](C.PRFK_DEFAULT) map {
      case
        id ~
          name ~
          default =>
        DocumentoKitItem(
          id,
          name,
          default != 0)
    }
  }

  private val DocumentoBOMParser: RowParser[DocumentoBOMItemRow] = {
    SqlParser.get[Int](C.PBM_ID) ~
      SqlParser.get[String](C.PBM_NAME) map {
      case
        id ~
          name =>
        DocumentoBOMItemRow(
          id,
          name)
    }
  }

  private val DocumentoParser: RowParser[Documento] = {
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
      SqlParser.get[Option[Int]](C.RUBT_ID_1) ~
      SqlParser.get[Option[String]](C.RUBT_NAME_1) ~
      SqlParser.get[Option[Int]](C.RUBT_ID_2) ~
      SqlParser.get[Option[String]](C.RUBT_NAME_2) ~
      SqlParser.get[Option[Int]](C.RUBT_ID_3) ~
      SqlParser.get[Option[String]](C.RUBT_NAME_3) ~
      SqlParser.get[Option[Int]](C.RUBT_ID_4) ~
      SqlParser.get[Option[String]](C.RUBT_NAME_4) ~
      SqlParser.get[Option[Int]](C.RUBT_ID_5) ~
      SqlParser.get[Option[String]](C.RUBT_NAME_5) ~
      SqlParser.get[Option[Int]](C.RUBT_ID_6) ~
      SqlParser.get[Option[String]](C.RUBT_NAME_6) ~
      SqlParser.get[Option[Int]](C.RUBT_ID_7) ~
      SqlParser.get[Option[String]](C.RUBT_NAME_7) ~
      SqlParser.get[Option[Int]](C.RUBT_ID_8) ~
      SqlParser.get[Option[String]](C.RUBT_NAME_8) ~
      SqlParser.get[Option[Int]](C.RUBT_ID_9) ~
      SqlParser.get[Option[String]](C.RUBT_NAME_9) ~
      SqlParser.get[Option[Int]](C.RUBT_ID_10) ~
      SqlParser.get[Option[String]](C.RUBT_NAME_10) ~
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

          rubtId1 ~
          rubtName1 ~
          rubtId2 ~
          rubtName2 ~
          rubtId3 ~
          rubtName3 ~
          rubtId4 ~
          rubtName4 ~
          rubtId5 ~
          rubtName5 ~
          rubtId6 ~
          rubtName6 ~
          rubtId7 ~
          rubtName7 ~
          rubtId8 ~
          rubtName8 ~
          rubtId9 ~
          rubtName9 ~
          rubtId10 ~
          rubtName10 ~

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
        Documento(
          id,
          active != 0,
          code,
          DocumentoBase(
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
          DocumentoCompra(
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
          DocumentoStock(
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
          DocumentoVenta(
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
          DocumentoRubro(
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
          DocumentoRubroTables(
            rubtId1.getOrElse(DBHelper.NoId),
            rubtName1.getOrElse(""),
            rubtId2.getOrElse(DBHelper.NoId),
            rubtName2.getOrElse(""),
            rubtId3.getOrElse(DBHelper.NoId),
            rubtName3.getOrElse(""),
            rubtId4.getOrElse(DBHelper.NoId),
            rubtName4.getOrElse(""),
            rubtId5.getOrElse(DBHelper.NoId),
            rubtName5.getOrElse(""),
            rubtId6.getOrElse(DBHelper.NoId),
            rubtName6.getOrElse(""),
            rubtId7.getOrElse(DBHelper.NoId),
            rubtName7.getOrElse(""),
            rubtId8.getOrElse(DBHelper.NoId),
            rubtName8.getOrElse(""),
            rubtId9.getOrElse(DBHelper.NoId),
            rubtName9.getOrElse(""),
            rubtId10.getOrElse(DBHelper.NoId),
            rubtName10.getOrElse("")),
          DocumentoComex(
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
          DocumentoKit(
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
          DocumentoWeb(
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
          DocumentoNombres(
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
          emptyDocumentoItems,
          createdAt,
          updatedAt,
          updatedBy)
    }
  }

  private val DocumentoStockInfoParser: RowParser[DocumentoStockInfo] = {
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
        DocumentoStockInfo(
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

  private val DocumentoTaxInfoParser: RowParser[DocumentoTaxInfo] = {
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
        DocumentoTaxInfo(
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

  def create(user: CompanyUser, Documento: Documento): Documento = {
    save(user, Documento, true)
  }

  def update(user: CompanyUser, Documento: Documento): Documento = {
    save(user, Documento, false)
  }

  private def save(user: CompanyUser, Documento: Documento, isNew: Boolean): Documento = {
    def getFields = {
      List(
        Field(DBHelper.ACTIVE, Register.boolToInt(Documento.active), FieldType.boolean),
        Field(C.PR_CODE, Documento.code, FieldType.text),

        Field(C.PR_CODIGO_EXTERNO, Documento.base.codigoExterno, FieldType.text),
        Field(C.PR_CODIGO_BARRA, Documento.base.codigoBarra, FieldType.text),
        Field(C.PR_CODIGO_BARRA_NAME, Documento.base.codigoBarraName, FieldType.text),
        Field(C.IBC_ID, Documento.base.ibcId, FieldType.id),
        Field(C.MARC_ID, Documento.base.marcId, FieldType.id),
        Field(C.PR_EXPO_CAIRO, Documento.base.expoCairo, FieldType.number),
        Field(C.PR_ES_PLANTILLA, Register.boolToInt(Documento.base.esPlantilla), FieldType.boolean),
        Field(C.CUR_ID, Documento.base.curId, FieldType.id),

        Field(C.PR_SE_COMPRA, Register.boolToInt(Documento.compra.seCompra), FieldType.boolean),
        Field(C.PR_NAME_COMPRA, Documento.compra.nombreCompra, FieldType.text),
        Field(C.PR_DESCRIP_COMPRA, Documento.compra.descripCompra, FieldType.text),
        Field(C.UN_ID_COMPRA, Documento.compra.unIdCompra, FieldType.id),
        Field(C.CUEG_ID_COMPRA, Documento.compra.cuegIdCompra, FieldType.id),
        Field(C.TI_ID_RI_COMPRA, Documento.compra.tiIdRiCompra, FieldType.id),
        Field(C.TI_ID_RNI_COMPRA, C.AUX_TI_ID_RNI_COMPRA, FieldType.id),
        Field(C.TI_ID_INTERNOS_COMPRA, Documento.compra.tiIdInternosCompra, FieldType.id),
        Field(C.PR_PORC_INTERNO_C, Documento.compra.porcInternoC, FieldType.number),
        Field(C.CCOS_ID_COMPRA, Documento.compra.ccosIdCompra, FieldType.id),

        Field(C.PR_LLEVA_STOCK, Register.boolToInt(Documento.stock.llevaStock), FieldType.boolean),
        Field(C.UN_ID_STOCK, Documento.stock.unIdStock, FieldType.id),
        Field(C.PR_STOCK_COMPRA, Documento.stock.stockCompra, FieldType.number),
        Field(C.PR_X, Documento.stock.x, FieldType.number),
        Field(C.PR_Y, Documento.stock.y, FieldType.number),
        Field(C.PR_Z, Documento.stock.z, FieldType.number),
        Field(C.PR_STOCK_MINIMO, Documento.stock.stockMinimo, FieldType.number),
        Field(C.PR_REPOSICION, Documento.stock.reposicion, FieldType.number),
        Field(C.PR_STOCK_MAXIMO, Documento.stock.stockMaximo, FieldType.number),
        Field(C.PR_LLEVA_NRO_SERIE, Register.boolToInt(Documento.stock.llevaNroSerie), FieldType.boolean),
        Field(C.PR_LLEVA_NRO_LOTE, Register.boolToInt(Documento.stock.llevaNroLote), FieldType.boolean),
        Field(C.PR_LOTE_FIFO, Register.boolToInt(Documento.stock.loteFifo), FieldType.boolean),
        Field(C.PR_SE_PRODUCE, Register.boolToInt(Documento.stock.seProduce), FieldType.boolean),
        Field(C.PR_ES_REPUESTO, Register.boolToInt(Documento.stock.esRepuesto), FieldType.boolean),

        Field(C.PR_SE_VENDE, Register.boolToInt(Documento.venta.seVende), FieldType.boolean),
        Field(C.PR_NAME_VENTA, Documento.venta.nombreVenta, FieldType.text),
        Field(C.PR_NAME_FACTURA, Documento.venta.nombreFactura, FieldType.text),
        Field(C.PR_DESCRIP_VENTA, Documento.venta.descripVenta, FieldType.text),
        Field(C.UN_ID_VENTA, Documento.venta.unIdVenta, FieldType.id),
        Field(C.PR_VENTA_COMPRA, Documento.venta.ventaCompra, FieldType.number),
        Field(C.PR_VENTA_STOCK, Documento.venta.ventaStock, FieldType.number),
        Field(C.CUEG_ID_VENTA, Documento.venta.cuegIdVenta, FieldType.id),
        Field(C.PR_ES_LISTA, Register.boolToInt(Documento.venta.esLista), FieldType.boolean),
        Field(C.PR_DINERARIO, Register.boolToInt(Documento.venta.dinerario), FieldType.boolean),
        Field(C.PR_NO_REDONDEO, Register.boolToInt(Documento.venta.noRedondeo), FieldType.boolean),
        Field(C.TI_ID_RI_VENTA, Documento.venta.tiIdRiVenta, FieldType.id),
        Field(C.TI_ID_RNI_VENTA, C.AUX_TI_ID_RNI_VENTA, FieldType.id),
        Field(C.TI_ID_INTERNOS_VENTA, Documento.venta.tiIdInternosVenta, FieldType.id),
        Field(C.PR_PORC_INTERNO_V, Documento.venta.porcInternoV, FieldType.number),
        Field(C.CCOS_ID_VENTA, Documento.venta.ccosIdVenta, FieldType.id),

        Field(C.RUB_ID, Documento.rubro.rubId, FieldType.id),
        Field(C.RUBTI_ID_1, Documento.rubro.rubtiId1, FieldType.id),
        Field(C.RUBTI_ID_2, Documento.rubro.rubtiId2, FieldType.id),
        Field(C.RUBTI_ID_3, Documento.rubro.rubtiId3, FieldType.id),
        Field(C.RUBTI_ID_4, Documento.rubro.rubtiId4, FieldType.id),
        Field(C.RUBTI_ID_5, Documento.rubro.rubtiId5, FieldType.id),
        Field(C.RUBTI_ID_6, Documento.rubro.rubtiId6, FieldType.id),
        Field(C.RUBTI_ID_7, Documento.rubro.rubtiId7, FieldType.id),
        Field(C.RUBTI_ID_8, Documento.rubro.rubtiId8, FieldType.id),
        Field(C.RUBTI_ID_9, Documento.rubro.rubtiId9, FieldType.id),
        Field(C.RUBTI_ID_10, Documento.rubro.rubtiId10, FieldType.id),

        Field(C.UN_ID_PESO, Documento.comex.unIdPeso, FieldType.id),
        Field(C.PR_PESO_NETO, Documento.comex.pesoNeto, FieldType.number),
        Field(C.PR_PESO_TOTAL, Documento.comex.pesoTotal, FieldType.number),
        Field(C.PR_CANT_X_CAJA_EXPO, Documento.comex.cantXCajaExpo, FieldType.number),
        Field(C.EMBL_ID, Documento.comex.emblId, FieldType.id),
        Field(C.PR_FLETE_EXPO, Register.boolToInt(Documento.comex.fleteExpo), FieldType.boolean),
        Field(C.EGP_ID, Documento.comex.egpId, FieldType.id),
        Field(C.EFM_ID, Documento.comex.efmId, FieldType.id),
        Field(C.POAR_ID, Documento.comex.poarId, FieldType.id),
        Field(C.TI_ID_COMEX_GANANCIAS, Documento.comex.tiIdComexGanancias, FieldType.id),
        Field(C.TI_ID_COMEX_IGB, Documento.comex.tiIdComexIgb, FieldType.id),
        Field(C.TI_ID_COMEX_IVA, Documento.comex.tiIdComexIva, FieldType.id),
        Field(C.PR_ES_KIT, Register.boolToInt(Documento.kit.esKit), FieldType.boolean),
        Field(C.PR_KIT_STOCK_X_ITEM, Register.boolToInt(Documento.kit.kitStockXItem), FieldType.boolean),
        Field(C.PR_KIT_RESUMIDO, Register.boolToInt(Documento.kit.kitResumido), FieldType.boolean),
        Field(C.PR_KIT_IDENTIDAD, Register.boolToInt(Documento.kit.kitIdentidad), FieldType.boolean),
        Field(C.PR_KIT_IDENTIDAD_X_ITEM, Register.boolToInt(Documento.kit.kitIdentidadXItem), FieldType.boolean),
        Field(C.TA_ID_KIT_SERIE, Documento.kit.taIdKitSerie, FieldType.id),
        Field(C.PR_KIT_LOTE, Register.boolToInt(Documento.kit.kitLote), FieldType.boolean),
        Field(C.PR_KIT_LOTE_X_ITEM, Register.boolToInt(Documento.kit.kitLoteXItem), FieldType.boolean),
        Field(C.TA_ID_KIT_LOTE, Documento.kit.taIdKitLote, FieldType.id),

        Field(C.PR_NAME_WEB, Documento.web.nombreWeb, FieldType.text),
        Field(C.PR_ALIAS_WEB, Documento.web.aliasWeb, FieldType.text),
        Field(C.PR_ID_WEB_PADRE, Documento.web.prIdWebPadre, FieldType.id),
        Field(C.PR_ACTIVO_WEB, Register.boolToInt(Documento.web.activoWeb), FieldType.boolean),
        Field(C.PR_WEB_IMAGE_UPDATE, Register.boolToInt(Documento.web.webImageUpdate), FieldType.boolean),
        Field(C.PR_CODIGO_HTML, Documento.web.codigoHtml, FieldType.text),
        Field(C.PR_CODIGO_HTML_DETALLE, Documento.web.codigoHtmlDetalle, FieldType.text),
        Field(C.PR_EXPO_WEB, Documento.web.expoWeb, FieldType.number),
        Field(C.PR_VENTA_WEB_MAXIMA, Documento.web.ventaWebMaxima, FieldType.number),
        Field(C.LEY_ID, Documento.web.leyId, FieldType.id),
        Field(C.PR_WEB_IMAGE_FOLDER, Documento.web.webImageFolder, FieldType.text),

        Field(C.RPT_ID_NOMBRE_COMPRA, Documento.names.rptIdNombreCompra, FieldType.id),
        Field(C.RPT_ID_NOMBRE_VENTA, Documento.names.rptIdNombreVenta, FieldType.id),
        Field(C.RPT_ID_NOMBRE_FACTURA, Documento.names.rptIdNombreFactura, FieldType.id),
        Field(C.RPT_ID_NOMBRE_WEB, Documento.names.rptIdNombreWeb, FieldType.id),
        Field(C.RPT_ID_NOMBRE_IMG, Documento.names.rptIdNombreImg, FieldType.id),
        Field(C.RPT_ID_NOMBRE_IMG_ALT, Documento.names.rptIdNombreImgAlt, FieldType.id)
      )
    }

    def getProveedorFields(proveedor: DocumentoProveedor, prId: Int) = {
      List(
        Field(C.PR_ID, prId, FieldType.id),
        Field(C.PROV_ID, proveedor.provId, FieldType.id),
        Field(C.PRPROV_FABRICANTE, Register.boolToInt(proveedor.maker), FieldType.boolean),
        Field(C.PRPROV_NAME, proveedor.name, FieldType.text),
        Field(C.PRPROV_CODE, proveedor.code, FieldType.text),
        Field(C.PRPROV_CODIGO_BARRA, proveedor.barCode, FieldType.text),
        Field(C.PA_ID, proveedor.paId, FieldType.id),
        Field(C.LP_ID, proveedor.lpId, FieldType.id)
      )
    }

    def getClienteFields(cliente: DocumentoCliente, prId: Int) = {
      List(
        Field(C.PR_ID, prId, FieldType.id),
        Field(C.CLI_ID, cliente.cliId, FieldType.id),
        Field(C.PRCLI_CODE, cliente.code, FieldType.text),
        Field(C.PRCLI_CODIGO_BARRA, cliente.barCode, FieldType.text)
      )
    }

    def getCMIFields(cmi: DocumentoCMI, prId: Int) = {
      List(
        Field(C.PR_ID, prId, FieldType.id),
        Field(C.PRCMI_CODE, cmi.code , FieldType.text),
        Field(C.PRCMI_DESCRIP, cmi.descrip , FieldType.text),
        Field(C.PRCMI_FECHA_ALTA, cmi.createdAt , FieldType.text),
        Field(C.PRCMI_FECHA_VTO, cmi.expireDate , FieldType.text),
        Field(C.PRCMI_PRECIO, cmi.price , FieldType.number)
      )
    }

    def getLeyendaFields(leyenda: DocumentoLeyenda, prId: Int) = {
      List(
        Field(C.PR_ID, prId, FieldType.id),
        Field(C.PRL_NAME, leyenda.name, FieldType.text),
        Field(C.PRL_TEXTO, leyenda.text, FieldType.text),
        Field(C.PRL_TAG, leyenda.tag, FieldType.text),
        Field(C.PRL_ORDEN, leyenda.order, FieldType.text)
      )
    }

    def getTagFields(tag: DocumentoTag, prId: Int) = {
      List(
        Field(C.PR_ID, prId, FieldType.id),
        Field(C.PRT_TEXTO, tag.text, FieldType.text),
        Field(C.PR_ID_TAG, tag.prIdTag, FieldType.id),
        Field(C.PRT_ORDEN, tag.order, FieldType.number),
        Field(C.PRT_EXPO_WEB, tag.expoWeb, FieldType.number),
        Field(C.PRT_EXPO_CAIRO, tag.expoCairo, FieldType.number)
      )
    }

    def getCategoriaWebFields(categoriaWeb: DocumentoCategoriaWeb, prId: Int) = {
      List(
        Field(C.PR_ID, prId, FieldType.id),
        Field(C.CATWC_ID, categoriaWeb.catwcId, FieldType.id),
        Field(C.CATWCI_POSICION, categoriaWeb.position, FieldType.number)
      )
    }

    def getCatalogoWebFields(catalogoWeb: DocumentoCatalogoWeb, prId: Int) = {
      List(
        Field(C.PR_ID, prId, FieldType.id),
        Field(C.CATW_ID, catalogoWeb.catwId, FieldType.id)
      )
    }

    def getWebImageFields(webImage: DocumentoWebImage, prId: Int) = {
      List(
        Field(C.PR_ID, prId, FieldType.id),
        Field(C.PRWI_ARCHIVO, webImage.file, FieldType.text),
        Field(C.PRWI_TIPO, webImage.imageType, FieldType.number),
        Field(C.PRWI_ALT, webImage.alt, FieldType.text),
        Field(C.PRWI_POSICION, webImage.position, FieldType.number)
      )
    }

    def throwException = {
      throw new RuntimeException(s"Error when saving ${C.Documento}")
    }

    case class DocumentoProveedorInfo(prId: Int, item: DocumentoProveedor)

    def saveProveedor(itemInfo: DocumentoProveedorInfo) = {
      DBHelper.save(
        user,
        Register(
          C.Documento_PROVEEDOR,
          C.PRPROV_ID,
          itemInfo.item.id,
          false,
          true,
          true,
          getProveedorFields(itemInfo.item, itemInfo.prId)),
        itemInfo.item.id == DBHelper.NewId
      ) match {
        case SaveResult(true, id) => true
        case SaveResult(false, id) => throwException
      }
    }

    def saveProveedores(prId: Int) = {
      DBHelper.deleteItems(user, C.Documento_PROVEEDOR, C.PRPROV_ID, Documento.items.proveedorDeleted, s" AND pr_id = ${prId}")
      Documento.items.proveedores.map(proveedor => saveProveedor(DocumentoProveedorInfo(prId, proveedor)))
    }

    case class DocumentoClienteInfo(prId: Int, item: DocumentoCliente)

    def saveCliente(itemInfo: DocumentoClienteInfo) = {
      DBHelper.save(
        user,
        Register(
          C.Documento_CLIENTE,
          C.PRCLI_ID,
          itemInfo.item.id,
          false,
          true,
          true,
          getClienteFields(itemInfo.item, itemInfo.prId)),
        itemInfo.item.id == DBHelper.NewId
      ) match {
        case SaveResult(true, id) => true
        case SaveResult(false, id) => throwException
      }
    }

    def saveClientes(prId: Int) = {
      DBHelper.deleteItems(user, C.Documento_CLIENTE, C.PRCLI_ID, Documento.items.clienteDeleted, s" AND pr_id = ${prId}")
      Documento.items.clientes.map(cliente => saveCliente(DocumentoClienteInfo(prId, cliente)))
    }

    case class DocumentoCMIInfo(prId: Int, item: DocumentoCMI)

    def saveCMI(itemInfo: DocumentoCMIInfo) = {
      DBHelper.save(
        user,
        Register(
          C.Documento_COMUNIDAD_INTERNET,
          C.PRCMI_ID,
          itemInfo.item.id,
          false,
          true,
          true,
          getCMIFields(itemInfo.item, itemInfo.prId)),
        itemInfo.item.id == DBHelper.NewId
      ) match {
        case SaveResult(true, id) => true
        case SaveResult(false, id) => throwException
      }
    }

    def saveCMIs(prId: Int) = {
      DBHelper.deleteItems(user, C.Documento_COMUNIDAD_INTERNET, C.PRCMI_ID, Documento.items.cmiDeleted, s" AND pr_id = ${prId}")
      Documento.items.cmi.map(cmi => saveCMI(DocumentoCMIInfo(prId, cmi)))
    }

    case class DocumentoLeyendaInfo(prId: Int, item: DocumentoLeyenda)

    def saveLeyenda(itemInfo: DocumentoLeyendaInfo) = {
      DBHelper.save(
        user,
        Register(
          C.Documento_LEYENDA,
          C.PRL_ID,
          itemInfo.item.id,
          false,
          true,
          true,
          getLeyendaFields(itemInfo.item, itemInfo.prId)),
        itemInfo.item.id == DBHelper.NewId
      ) match {
        case SaveResult(true, id) => true
        case SaveResult(false, id) => throwException
      }
    }

    def saveLeyendas(prId: Int) = {
      DBHelper.deleteItems(user, C.Documento_LEYENDA, C.PRL_ID, Documento.items.leyendaDeleted, s" AND pr_id = ${prId}")
      Documento.items.leyendas.map(leyenda => saveLeyenda(DocumentoLeyendaInfo(prId, leyenda)))
    }

    case class DocumentoTagInfo(prId: Int, item: DocumentoTag)

    def saveTag(itemInfo: DocumentoTagInfo) = {
      DBHelper.save(
        user,
        Register(
          C.Documento_TAG,
          C.PRT_ID,
          itemInfo.item.id,
          false,
          true,
          true,
          getTagFields(itemInfo.item, itemInfo.prId)),
        itemInfo.item.id == DBHelper.NewId
      ) match {
        case SaveResult(true, id) => true
        case SaveResult(false, id) => throwException
      }
    }

    def saveTags(prId: Int) = {
      DBHelper.deleteItems(user, C.Documento_TAG, C.PRT_ID, Documento.items.tagDeleted, s" AND pr_id = ${prId}")
      Documento.items.tags.map(tag => saveTag(DocumentoTagInfo(prId, tag)))
    }

    case class DocumentoCategoriaWebInfo(prId: Int, item: DocumentoCategoriaWeb)

    def saveCategoriaWeb(itemInfo: DocumentoCategoriaWebInfo) = {
      DBHelper.save(
        user,
        Register(
          C.CATALOGO_WEB_CATEGORIA_ITEM,
          C.CATWCI_ID,
          itemInfo.item.id,
          false,
          true,
          true,
          getCategoriaWebFields(itemInfo.item, itemInfo.prId)),
        itemInfo.item.id == DBHelper.NewId
      ) match {
        case SaveResult(true, id) => true
        case SaveResult(false, id) => throwException
      }
    }

    def saveCategoriasWeb(prId: Int) = {
      DBHelper.deleteItems(user, C.CATALOGO_WEB_CATEGORIA_ITEM, C.PR_ID, prId.toString, "")
      Documento.items.categoriasWeb.map(categoriaWeb => saveCategoriaWeb(DocumentoCategoriaWebInfo(prId, categoriaWeb)))
    }

    case class DocumentoCatalogoWebInfo(prId: Int, item: DocumentoCatalogoWeb)

    def saveCatalogoWeb(itemInfo: DocumentoCatalogoWebInfo) = {
      DBHelper.save(
        user,
        Register(
          C.CATALOGO_WEB_ITEM,
          C.CATWI_ID,
          itemInfo.item.id,
          false,
          true,
          true,
          getCatalogoWebFields(itemInfo.item, itemInfo.prId)),
        itemInfo.item.id == DBHelper.NewId
      ) match {
        case SaveResult(true, id) => true
        case SaveResult(false, id) => throwException
      }
    }

    def saveCatalogosWeb(prId: Int) = {
      DBHelper.deleteItems(user, C.CATALOGO_WEB_ITEM, C.PR_ID, prId.toString, "")
      Documento.items.catalogosWeb.map(catalogoWeb => saveCatalogoWeb(DocumentoCatalogoWebInfo(prId, catalogoWeb)))
    }

    case class DocumentoWebImageInfo(prId: Int, item: DocumentoWebImage)

    def saveWebImage(itemInfo: DocumentoWebImageInfo) = {
      DBHelper.save(
        user,
        Register(
          C.Documento_WEB_IMAGE,
          C.PRWI_ID,
          itemInfo.item.id,
          false,
          true,
          true,
          getWebImageFields(itemInfo.item, itemInfo.prId)),
        itemInfo.item.id == DBHelper.NewId
      ) match {
        case SaveResult(true, id) => true
        case SaveResult(false, id) => throwException
      }
    }

    def saveWebImages(prId: Int) = {
      DBHelper.deleteItems(user, C.Documento_WEB_IMAGE, C.PRWI_ID, Documento.items.webImageDeleted, s" AND pr_id = ${prId}")
      Documento.items.webImages.map(webImage => saveWebImage(DocumentoWebImageInfo(prId, webImage)))
    }

    DBHelper.saveEx(
      user,
      Register(
        C.Documento,
        C.PR_ID,
        Documento.id,
        false,
        true,
        true,
        getFields),
      isNew,
      C.PR_CODE
    ) match {
      case SaveResult(true, id) => {
        saveProveedores(id)
        saveClientes(id)
        saveCMIs(id)
        saveLeyendas(id)
        saveTags(id)
        saveCategoriasWeb(id)
        saveCatalogosWeb(id)
        saveWebImages(id)
        load(user, id).getOrElse(throwException)
      }
      case SaveResult(false, id) => throwException
    }
  }

  def load(user: CompanyUser, id: Int): Option[Documento] = {

    DB.withTransaction(user.database.database) { implicit connection =>

      val sql = "{call sp_Documento_get(?, ?)}"
      val cs = connection.prepareCall(sql)

      cs.setInt(1, id)
      cs.registerOutParameter(2, Types.OTHER)

      try {
        cs.execute()

        val rs = cs.getObject(2).asInstanceOf[java.sql.ResultSet]
        Sql.as(DocumentoParser.singleOpt, rs)

      } catch {
        case NonFatal(e) => {
          Logger.error(s"can't get ${C.Documento} with id $id for user ${user.toString}. Error ${e.toString}")
          throw e
        }
      } finally {
        cs.close
      }
    }
  }

  private def loadDocumentoItems(user: CompanyUser, id: Int) = {
    DocumentoItems(
      loadProveedores(user, id),
      loadClientes(user, id),
      loadCmi(user, id),
      loadLeyendas(user, id),
      loadTags(user, id),
      loadCategoriasWeb(user, id),
      loadCatalogosWeb(user, id),
      loadWebImages(user, id),
      loadKits(user, id),
      loadBOMs(user, id),
      List(), "", "", "", "", "", "")
  }

  private def loadProveedores(user: CompanyUser, id: Int) = {

    DB.withTransaction(user.database.database) { implicit connection =>

      val sql = "{call sp_Documento_get_proveedores(?, ?)}"
      val cs = connection.prepareCall(sql)

      cs.setInt(1, id)
      cs.registerOutParameter(2, Types.OTHER)

      try {
        cs.execute()

        val rs = cs.getObject(2).asInstanceOf[java.sql.ResultSet]
        Sql.as(DocumentoProveedorParser.*, rs)

      } catch {
        case NonFatal(e) => {
          Logger.error(s"can't get ${C.Documento_PROVEEDOR} with id $id for user ${user.toString}. Error ${e.toString}")
          throw e
        }
      } finally {
        cs.close
      }
    }
  }

  private def loadClientes(user: CompanyUser, id: Int) = {

    DB.withTransaction(user.database.database) { implicit connection =>

      val sql = "{call sp_Documento_get_clientes(?, ?)}"
      val cs = connection.prepareCall(sql)

      cs.setInt(1, id)
      cs.registerOutParameter(2, Types.OTHER)

      try {
        cs.execute()

        val rs = cs.getObject(2).asInstanceOf[java.sql.ResultSet]
        Sql.as(DocumentoClienteParser.*, rs)

      } catch {
        case NonFatal(e) => {
          Logger.error(s"can't get ${C.Documento_CLIENTE} with id $id for user ${user.toString}. Error ${e.toString}")
          throw e
        }
      } finally {
        cs.close
      }
    }
  }

  private def loadCmi(user: CompanyUser, id: Int) = {

    DB.withTransaction(user.database.database) { implicit connection =>

      val sql = "{call sp_Documento_get_cmi(?, ?)}"
      val cs = connection.prepareCall(sql)

      cs.setInt(1, id)
      cs.registerOutParameter(2, Types.OTHER)

      try {
        cs.execute()

        val rs = cs.getObject(2).asInstanceOf[java.sql.ResultSet]
        Sql.as(DocumentoCMIParser.*, rs)

      } catch {
        case NonFatal(e) => {
          Logger.error(s"can't get ${C.Documento_COMUNIDAD_INTERNET} with id $id for user ${user.toString}. Error ${e.toString}")
          throw e
        }
      } finally {
        cs.close
      }
    }
  }

  private def loadLeyendas(user: CompanyUser, id: Int) = {

    DB.withTransaction(user.database.database) { implicit connection =>

      val sql = "{call sp_Documento_get_leyendas(?, ?)}"
      val cs = connection.prepareCall(sql)

      cs.setInt(1, id)
      cs.registerOutParameter(2, Types.OTHER)

      try {
        cs.execute()

        val rs = cs.getObject(2).asInstanceOf[java.sql.ResultSet]
        Sql.as(DocumentoLeyendaParser.*, rs)

      } catch {
        case NonFatal(e) => {
          Logger.error(s"can't get ${C.Documento_LEYENDA} with id $id for user ${user.toString}. Error ${e.toString}")
          throw e
        }
      } finally {
        cs.close
      }
    }
  }

  private def loadTags(user: CompanyUser, id: Int) = {

    DB.withTransaction(user.database.database) { implicit connection =>

      val sql = "{call sp_Documento_get_tags(?, ?)}"
      val cs = connection.prepareCall(sql)

      cs.setInt(1, id)
      cs.registerOutParameter(2, Types.OTHER)

      try {
        cs.execute()

        val rs = cs.getObject(2).asInstanceOf[java.sql.ResultSet]
        Sql.as(DocumentoTagParser.*, rs)

      } catch {
        case NonFatal(e) => {
          Logger.error(s"can't get ${C.Documento_TAG} with id $id for user ${user.toString}. Error ${e.toString}")
          throw e
        }
      } finally {
        cs.close
      }
    }
  }

  private def loadCategoriasWeb(user: CompanyUser, id: Int) = {

    DB.withTransaction(user.database.database) { implicit connection =>

      val sql = "{call sp_Documento_get_categorias(?, ?)}"
      val cs = connection.prepareCall(sql)

      cs.setInt(1, id)
      cs.registerOutParameter(2, Types.OTHER)

      try {
        cs.execute()

        val rs = cs.getObject(2).asInstanceOf[java.sql.ResultSet]
        Sql.as(DocumentoCategoriaWebParser.*, rs)

      } catch {
        case NonFatal(e) => {
          Logger.error(s"can't get ${C.CATALOGO_WEB_CATEGORIA} with id $id for user ${user.toString}. Error ${e.toString}")
          throw e
        }
      } finally {
        cs.close
      }
    }
  }

  private def loadCatalogosWeb(user: CompanyUser, id: Int) = {

    DB.withTransaction(user.database.database) { implicit connection =>

      val sql = "{call sp_Documento_get_catalogos_web(?, ?)}"
      val cs = connection.prepareCall(sql)

      cs.setInt(1, id)
      cs.registerOutParameter(2, Types.OTHER)

      try {
        cs.execute()

        val rs = cs.getObject(2).asInstanceOf[java.sql.ResultSet]
        Sql.as(DocumentoCatalogoWebParser.*, rs)

      } catch {
        case NonFatal(e) => {
          Logger.error(s"can't get ${C.CATALOGO_WEB_ITEM} with id $id for user ${user.toString}. Error ${e.toString}")
          throw e
        }
      } finally {
        cs.close
      }
    }
  }

  private def loadWebImages(user: CompanyUser, id: Int) = {

    DB.withTransaction(user.database.database) { implicit connection =>

      val sql = "{call sp_Documento_get_web_images(?, ?)}"
      val cs = connection.prepareCall(sql)

      cs.setInt(1, id)
      cs.registerOutParameter(2, Types.OTHER)

      try {
        cs.execute()

        val rs = cs.getObject(2).asInstanceOf[java.sql.ResultSet]
        Sql.as(DocumentoWebImageParser.*, rs)

      } catch {
        case NonFatal(e) => {
          Logger.error(s"can't get ${C.Documento_WEB_IMAGE} with id $id for user ${user.toString}. Error ${e.toString}")
          throw e
        }
      } finally {
        cs.close
      }
    }
  }

  private def loadKits(user: CompanyUser, id: Int) = {

    DB.withTransaction(user.database.database) { implicit connection =>

      val sql = "{call sp_Documento_get_kits(?, ?)}"
      val cs = connection.prepareCall(sql)

      cs.setInt(1, id)
      cs.registerOutParameter(2, Types.OTHER)

      try {
        cs.execute()

        val rs = cs.getObject(2).asInstanceOf[java.sql.ResultSet]
        Sql.as(DocumentoKitParser.*, rs)

      } catch {
        case NonFatal(e) => {
          Logger.error(s"can't get ${C.Documento_KIT} with id $id for user ${user.toString}. Error ${e.toString}")
          throw e
        }
      } finally {
        cs.close
      }
    }
  }

  private def loadBOMs(user: CompanyUser, id: Int) = {

    DB.withTransaction(user.database.database) { implicit connection =>

      val sql = "{call sp_Documento_get_boms(?, ?)}"
      val cs = connection.prepareCall(sql)

      cs.setInt(1, id)
      cs.registerOutParameter(2, Types.OTHER)

      try {
        cs.execute()

        val rs = cs.getObject(2).asInstanceOf[java.sql.ResultSet]
        Sql.as(DocumentoBOMParser.*, rs)

      } catch {
        case NonFatal(e) => {
          Logger.error(s"can't get ${C.Documento_BOM} with id $id for user ${user.toString}. Error ${e.toString}")
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
        SQL("sp_Documento_delete {id}")
          .on('id -> id)
          .executeUpdate
      } catch {
        case NonFatal(e) => {
          Logger.error(s"can't delete a ${C.Documento}. ${C.PR_ID} id: $id. Error ${e.toString}")
          throw e
        }
      }
    }
  }

  def get(user: CompanyUser, id: Int): Documento = {
    load(user, id) match {
      case Some(p) => {
        Documento(
          p.id,
          p.active,
          p.code,

          p.base,

          p.compra,
          p.stock,
          p.venta,

          p.rubro,
          p.rubroTables,

          p.comex,
          p.kit,
          p.web,
          p.names,

          loadDocumentoItems(user, id)
        )
      }
      case None => emptyDocumento
    }
  }

  def getStockInfo(user: CompanyUser, id: Int, cliId: Option[Int], provId: Option[Int]): DocumentoStockInfo = {
    val stockInfo = {
      DB.withTransaction(user.database.database) { implicit connection =>

        val sql = "{call sp_Documento_stock_get_data(?, ?, ?, ?)}"
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
          Sql.as(DocumentoStockInfoParser.singleOpt, rs)

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

    stockInfo.getOrElse(emptyDocumentoStockInfo)
  }

  def getPrice(user: CompanyUser, id: Int, lpId: Int): Double = {

    DB.withTransaction(user.database.database) { implicit connection =>

      val sql = "{call sp_lp_get_precio(?, ?, ?)}"
      val cs = connection.prepareCall(sql)

      cs.setInt(1, lpId)
      cs.setInt(2, id)
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

      cs.setInt(1, ldId)
      cs.setInt(2, id)
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

  def getTaxes(user: CompanyUser, id: Int): DocumentoTaxInfo = {
    val taxInfo = {
      DB.withTransaction(user.database.database) { implicit connection =>

        val sql = "{call sp_Documento_get_tasas(?, ?)}"
        val cs = connection.prepareCall(sql)

        cs.setInt(1, id)
        cs.registerOutParameter(2, Types.OTHER)

        try {
          cs.execute()

          val rs = cs.getObject(2).asInstanceOf[java.sql.ResultSet]
          Sql.as(DocumentoTaxInfoParser.singleOpt, rs)

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

    taxInfo.getOrElse(emptyDocumentoTaxInfo)
  }

}