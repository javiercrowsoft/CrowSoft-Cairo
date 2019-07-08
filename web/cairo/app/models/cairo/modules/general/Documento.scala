package models.cairo.modules.general

import java.sql.{Connection, CallableStatement, ResultSet, Types, SQLException}
import anorm.SqlParser._
import anorm._
import models.cairo.system.database._
import play.api.Play.current
import models.domain.CompanyUser
import java.util.Date
import play.api.Logger
import services.DateUtil
import services.db.DB
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
                                  esFacturaElectronica: Boolean,
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
      cuegId,
      ""
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
    List(), List(), "", ""
  )


  lazy val emptyDocumento = Documento(
    false,
    "",

    DocumentoBase("", false, false, false, false, "",
      DocumentoTipo(0, 0, 0, false, false, false, false, false, false),
      false, false,
      DocumentoFacturaVenta(false, false, false, false, false),
      false, false, false, false, ""),
    DocumentoTalonario(DBHelper.NoId, DBHelper.NoId, DBHelper.NoId,
      DBHelper.NoId, DBHelper.NoId, DBHelper.NoId),
    DocumentoAux(DBHelper.NoId, DBHelper.NoId, DBHelper.NoId, DBHelper.NoId),
    DocumentoReferences(DBHelper.NoId, DBHelper.NoId, DBHelper.NoId, DBHelper.NoId, DBHelper.NoId, DBHelper.NoId),
    emptyDocumentoItems
  )

  def apply(
             id: Int,
             active: Boolean,
             code: String,

             base: DocumentoBase,
             talonario: DocumentoTalonario,
             docAux: DocumentoAux,
             references: DocumentoReferences,

             items: DocumentoItems
           ) = {

    new Documento(
      id,
      active,
      code,

      base,
      talonario,
      docAux,
      references,

      items
    )
  }

  def apply(
             id: Int,
             active: Boolean,
             code: String,

             base: DocumentoBase,
             talonario: DocumentoTalonario,
             docAux: DocumentoAux,
             references: DocumentoReferences
           ) = {

    new Documento(
      id,
      active,
      code,

      base,
      talonario,
      docAux,
      references,

      emptyDocumentoItems
    )
  }

  def apply(
             active: Boolean,
             code: String,

             base: DocumentoBase,
             talonario: DocumentoTalonario,
             docAux: DocumentoAux,
             references: DocumentoReferences,

             items: DocumentoItems
           ) = {

    new Documento(
      active,
      code,

      base,
      talonario,
      docAux,
      references,

      items
    )
  }

  def apply(
             active: Boolean,
             code: String,

             base: DocumentoBase,
             talonario: DocumentoTalonario,
             docAux: DocumentoAux,
             references: DocumentoReferences
           ) = {

    new Documento(
      active,
      code,

      base,
      talonario,
      docAux,
      references,

      emptyDocumentoItems
    )
  }

  private val DocumentoParser: RowParser[Documento] = {
    SqlParser.get[Int](C.DOC_ID) ~
      SqlParser.get[Int](DBHelper.ACTIVE) ~
      SqlParser.get[String](C.DOC_CODE) ~
      SqlParser.get[String](C.DOC_NAME) ~
      SqlParser.get[Int](C.DOC_EDITAR_IMPRESOS) ~
      SqlParser.get[Int](C.DOC_LLEVA_FIRMA) ~
      SqlParser.get[Int](C.DOC_LLEVA_FIRMA_CREDITO) ~
      SqlParser.get[Int](C.DOC_LLEVA_FIRMA_PRINT0) ~
      SqlParser.get[String](C.DOC_OBJECT_EDIT) ~
      SqlParser.get[Int](C.DOC_TIPO_FACTURA) ~
      SqlParser.get[Int](C.DOC_TIPO_PACKING_LIST) ~
      SqlParser.get[Int](C.DOC_TIPO_ORDEN_COMPRA) ~
      SqlParser.get[Int](C.DOC_RC_DESDE_OC) ~
      SqlParser.get[Int](C.DOC_RC_DESPACHO_IMPO) ~
      SqlParser.get[Int](C.DOC_PV_DESDE_PRV) ~
      SqlParser.get[Int](C.DOC_RV_DESDE_PV) ~
      SqlParser.get[Int](C.DOC_RV_DESDE_OS) ~
      SqlParser.get[Int](C.DOC_RV_BOM) ~
      SqlParser.get[Int](C.DOC_GENERA_REMITO) ~
      SqlParser.get[Int](C.DOC_MUEVE_STOCK) ~
      SqlParser.get[Int](C.DOC_ES_FACTURA_ELECTRONICA) ~
      SqlParser.get[Int](C.DOC_FV_SIN_PERCEPCION) ~
      SqlParser.get[Int](C.DOC_ES_CREDITO_BANCO) ~
      SqlParser.get[Int](C.DOC_ES_VENTA_ACCION) ~
      SqlParser.get[Int](C.DOC_ES_VENTA_CHEQUE) ~
      SqlParser.get[Int](C.DOC_ES_RESUMEN_BANCO) ~
      SqlParser.get[Int](C.DOC_ES_COB_CHEQUE_SGR) ~
      SqlParser.get[Int](C.DOC_ES_COB_CAIDA_SGR) ~
      SqlParser.get[Int](C.DOC_ST_CONSUMO) ~
      SqlParser.get[String](C.DOC_DESCRIP) ~
      SqlParser.get[Option[Int]](C.TA_ID) ~
      SqlParser.get[Option[String]](C.TA_NAME) ~
      SqlParser.get[Option[Int]](C.TA_ID_FINAL) ~
      SqlParser.get[Option[String]](C.TA_NAME_FINAL) ~
      SqlParser.get[Option[Int]](C.TA_ID_INSCRIPTO) ~
      SqlParser.get[Option[String]](C.TA_NAME_INSCRIPTO) ~
      SqlParser.get[Option[Int]](C.TA_ID_EXTERNO) ~
      SqlParser.get[Option[String]](C.TA_NAME_EXTERNO) ~
      SqlParser.get[Option[Int]](C.TA_ID_INSCRIPTO_M) ~
      SqlParser.get[Option[String]](C.TA_NAME_INSCRIPTO_M) ~
      SqlParser.get[Option[Int]](C.TA_ID_HABERES) ~
      SqlParser.get[Option[String]](C.TA_NAME_HABERES) ~
      SqlParser.get[Option[Int]](C.DOC_ID_ASIENTO) ~
      SqlParser.get[Option[String]](C.DOC_NAME_ASIENTO) ~
      SqlParser.get[Option[Int]](C.DOC_ID_REMITO) ~
      SqlParser.get[Option[String]](C.DOC_NAME_REMITO) ~
      SqlParser.get[Option[Int]](C.DOC_ID_STOCK) ~
      SqlParser.get[Option[String]](C.DOC_NAME_STOCK) ~
      SqlParser.get[Option[Int]](C.DOCG_ID) ~
      SqlParser.get[Option[String]](C.DOCG_NAME) ~
      SqlParser.get[Option[Int]](C.CICO_ID) ~
      SqlParser.get[Option[String]](C.CICO_NAME) ~
      SqlParser.get[Option[Int]](C.EMP_ID) ~
      SqlParser.get[Option[String]](C.EMP_NAME) ~
      SqlParser.get[Option[Int]](C.DOCT_ID) ~
      SqlParser.get[Option[String]](C.DOCT_NAME) ~
      SqlParser.get[Option[Int]](C.FCA_ID) ~
      SqlParser.get[Option[String]](C.FCA_NAME) ~
      SqlParser.get[Option[Int]](C.MON_ID) ~
      SqlParser.get[Option[String]](C.MON_NAME) ~
      SqlParser.get[Option[Int]](C.CUEG_ID) ~
      SqlParser.get[Option[String]](C.CUEG_NAME) ~
      SqlParser.get[Date](DBHelper.CREATED_AT) ~
      SqlParser.get[Date](DBHelper.UPDATED_AT) ~
      SqlParser.get[Int](DBHelper.UPDATED_BY) map {
      case
        id ~
          active ~
          code ~
          name ~
          editarImpresos ~
          llevaFirma ~
          llevaFirmaCredito ~
          llevaFirmaPrint ~
          objectEdit ~
          tipoFactura ~ // tipo,
          tipoPackingList ~
          tipoOrdenCompra ~
          rcDesdeOc ~
          rcDesdeDespacho ~
          pvDesdePrv ~
          rvDesdePv ~
          rvDesdeOs ~
          rvBOM ~
          generaRemito ~
          mueveStock ~
          esFacturaElectronica ~ // facturaVenta,
          sinPercepcion ~
          esCreditoBanco ~
          esVentaAccion ~
          esVentaCheque ~
          esResumenBco ~
          esCobChequeSGR ~
          esCobCaidaSGR ~
          stConsumo ~
          descrip ~
          taId ~ // talonario
          taName ~
          taIdFinal ~
          taNameFinal ~
          taIdInscripto ~
          taNameInscripto ~
          taIdExterno ~
          taNameExterno ~
          taIdInscriptoM ~
          taNameInscriptoM ~
          taIdHaberes ~
          taNameHaberes ~
          docIdAsiento ~ // docAux
          docNameAsiento ~
          docIdRemito ~
          docNameRemito ~
          docIdStock ~
          docNameStock ~
          docgId ~
          docgName ~
          cicoId ~ // reference
          cicoName ~
          empId ~
          empName ~
          doctId ~
          doctName ~
          fcaId ~
          fcaName ~
          monId ~
          monName ~
          cuegId ~
          cuegName ~
          createdAt ~
          updatedAt ~
          updatedBy =>
        Documento(
          id,
          active != 0,
          code,
          DocumentoBase(
            name,
            editarImpresos != 0,
            llevaFirma != 0,
            llevaFirmaCredito != 0,
            llevaFirmaPrint != 0,
            objectEdit,
            DocumentoTipo(
              tipoFactura,
              tipoPackingList,
              tipoOrdenCompra,
              rcDesdeOc != 0,
              rcDesdeDespacho != 0,
              pvDesdePrv != 0,
              rvDesdePv != 0,
              rvDesdeOs != 0,
              rvBOM != 0
            ),
            generaRemito != 0,
            mueveStock != 0,
            DocumentoFacturaVenta(
              esFacturaElectronica != 0,
              sinPercepcion != 0,
              esCreditoBanco != 0,
              esVentaAccion != 0,
              esVentaCheque != 0
            ),
            esResumenBco != 0,
            esCobChequeSGR != 0,
            esCobCaidaSGR != 0,
            stConsumo  != 0,
            descrip
          ),
          DocumentoTalonario(
            taId.getOrElse(DBHelper.NoId),
            taName.getOrElse(""),
            taIdFinal.getOrElse(DBHelper.NoId),
            taNameFinal.getOrElse(""),
            taIdInscripto.getOrElse(DBHelper.NoId),
            taNameInscripto.getOrElse(""),
            taIdExterno.getOrElse(DBHelper.NoId),
            taNameExterno.getOrElse(""),
            taIdInscriptoM.getOrElse(DBHelper.NoId),
            taNameInscriptoM.getOrElse(""),
            taIdHaberes.getOrElse(DBHelper.NoId),
            taNameHaberes.getOrElse("")
          ),
          DocumentoAux(
            docIdAsiento.getOrElse(DBHelper.NoId),
            docNameAsiento.getOrElse(""),
            docIdRemito.getOrElse(DBHelper.NoId),
            docNameRemito.getOrElse(""),
            docIdStock.getOrElse(DBHelper.NoId),
            docNameStock.getOrElse(""),
            docgId.getOrElse(DBHelper.NoId),
            docgName.getOrElse("")),
          DocumentoReferences(
            cicoId.getOrElse(DBHelper.NoId),
            cicoName.getOrElse(""),
            empId.getOrElse(DBHelper.NoId),
            empName.getOrElse(""),
            doctId.getOrElse(DBHelper.NoId),
            doctName.getOrElse(""),
            fcaId.getOrElse(DBHelper.NoId),
            fcaName.getOrElse(""),
            monId.getOrElse(DBHelper.NoId),
            monName.getOrElse(""),
            cuegId.getOrElse(DBHelper.NoId),
            cuegName.getOrElse("")
          ),
          emptyDocumentoItems,
          createdAt,
          updatedAt,
          updatedBy)
    }
  }

  private val reporteParser: RowParser[Reporte] = {
    SqlParser.get[Int](C.RPTF_ID) ~
      SqlParser.get[String](C.RPTF_NAME) ~
      SqlParser.get[String](C.RPTF_CSRFILE) ~
      SqlParser.get[Int](C.RPTF_SUGERIDO) ~
      SqlParser.get[Int](C.RPTF_SUGERIDO_EMAIL) ~
      SqlParser.get[Int](C.RPTF_COPIAS) ~
      SqlParser.get[Int](C.RPTF_DOC_IMPRIMIR_EN_ALTA) ~
      SqlParser.get[String](C.RPTF_OBJECT) map {
      case
        id ~
          name ~
          csrFile ~
          sugerido ~
          sugeridoEmail ~
          copias ~
          printInNew ~
          rptObj =>
        Reporte(
          id,
          name,
          csrFile,
          sugerido != 0,
          sugeridoEmail != 0,
          copias,
          printInNew != 0,
          rptObj)
    }
  }

  private val firmaParser: RowParser[Firma] = {
    SqlParser.get[Int](C.DOCFR_ID) ~
      SqlParser.get[Int](C.US_ID) ~
      SqlParser.get[String](C.US_NAME) map {
      case
        id ~
          usId ~
          name =>
        Firma(
          id,
          usId,
          name)
    }
  }

  def create(user: CompanyUser, documento: Documento): Documento = {
    save(user, documento, true)
  }

  def update(user: CompanyUser, documento: Documento): Documento = {
    save(user, documento, false)
  }

  private def save(user: CompanyUser, documento: Documento, isNew: Boolean): Documento = {
    def getFields = {
      List(
        Field(DBHelper.ACTIVE, Register.boolToInt(documento.active), FieldType.boolean),
        Field(C.DOC_CODE, documento.code, FieldType.text),

        Field(C.DOC_NAME, documento.base.name, FieldType.text),
        Field(C.DOC_EDITAR_IMPRESOS, Register.boolToInt(documento.base.editarImpresos), FieldType.boolean),
        Field(C.DOC_LLEVA_FIRMA, Register.boolToInt(documento.base.llevaFirma), FieldType.boolean),
        Field(C.DOC_LLEVA_FIRMA_CREDITO, Register.boolToInt(documento.base.llevaFirmaCredito), FieldType.boolean),
        Field(C.DOC_LLEVA_FIRMA_PRINT0, Register.boolToInt(documento.base.llevaFirmaPrint), FieldType.boolean),
        Field(C.DOC_OBJECT_EDIT, documento.base.objectEdit, FieldType.text),

        Field(C.DOC_TIPO_FACTURA, documento.base.tipo.tipoFactura, FieldType.integer),
        Field(C.DOC_TIPO_PACKING_LIST, documento.base.tipo.tipoPackingList, FieldType.integer),
        Field(C.DOC_TIPO_ORDEN_COMPRA, documento.base.tipo.tipoOrdenCompra, FieldType.integer),
        Field(C.DOC_RC_DESDE_OC, Register.boolToInt(documento.base.tipo.rcDesdeOc), FieldType.boolean),
        Field(C.DOC_RC_DESPACHO_IMPO, Register.boolToInt(documento.base.tipo.rcDesdeDespacho), FieldType.boolean),
        Field(C.DOC_PV_DESDE_PRV, Register.boolToInt(documento.base.tipo.pvDesdePrv), FieldType.boolean),
        Field(C.DOC_RV_DESDE_PV, Register.boolToInt(documento.base.tipo.rvDesdePv), FieldType.boolean),
        Field(C.DOC_RV_DESDE_OS, Register.boolToInt(documento.base.tipo.rvDesdeOs), FieldType.boolean),
        Field(C.DOC_RV_BOM, Register.boolToInt(documento.base.tipo.rvBOM), FieldType.boolean),

        Field(C.DOC_GENERA_REMITO, Register.boolToInt(documento.base.generaRemito), FieldType.boolean),
        Field(C.DOC_MUEVE_STOCK, Register.boolToInt(documento.base.mueveStock), FieldType.boolean),

        Field(C.DOC_ES_FACTURA_ELECTRONICA, Register.boolToInt(documento.base.facturaVenta.esFacturaElectronica), FieldType.boolean),
        Field(C.DOC_FV_SIN_PERCEPCION, Register.boolToInt(documento.base.facturaVenta.sinPercepcion), FieldType.boolean),
        Field(C.DOC_ES_CREDITO_BANCO, Register.boolToInt(documento.base.facturaVenta.esCreditoBanco), FieldType.boolean),
        Field(C.DOC_ES_VENTA_ACCION, Register.boolToInt(documento.base.facturaVenta.esVentaAccion), FieldType.boolean),
        Field(C.DOC_ES_VENTA_CHEQUE, Register.boolToInt(documento.base.facturaVenta.esVentaCheque), FieldType.boolean),

        Field(C.DOC_ES_RESUMEN_BANCO, Register.boolToInt(documento.base.esResumenBco), FieldType.boolean),
        Field(C.DOC_ES_COB_CHEQUE_SGR, Register.boolToInt(documento.base.esCobChequeSGR), FieldType.boolean),
        Field(C.DOC_ES_COB_CAIDA_SGR, Register.boolToInt(documento.base.esCobCaidaSGR), FieldType.boolean),
        Field(C.DOC_ST_CONSUMO, Register.boolToInt(documento.base.stConsumo), FieldType.boolean),

        Field(C.DOC_DESCRIP, documento.base.descrip, FieldType.text),


        Field(C.TA_ID, documento.talonario.taId, FieldType.id),
        Field(C.TA_ID_FINAL, documento.talonario.taIdFinal, FieldType.id),
        Field(C.TA_ID_INSCRIPTO, documento.talonario.taIdInscripto, FieldType.id),
        Field(C.TA_ID_EXTERNO, documento.talonario.taIdExterno, FieldType.id),
        Field(C.TA_ID_INSCRIPTO_M, documento.talonario.taIdInscriptoM, FieldType.id),
        Field(C.TA_ID_HABERES, documento.talonario.taIdHaberes, FieldType.id),

        Field(C.DOC_ID_ASIENTO, documento.docAux.docIdAsiento, FieldType.id),
        Field(C.DOC_ID_REMITO, documento.docAux.docIdRemito, FieldType.id),
        Field(C.DOC_ID_STOCK, documento.docAux.docIdStock, FieldType.id),
        Field(C.DOCG_ID, documento.docAux.docgId, FieldType.id),

        Field(C.CICO_ID, documento.references.cicoId, FieldType.id),
        Field(C.EMP_ID, documento.references.empId, FieldType.id),
        Field(C.DOCT_ID, documento.references.doctId, FieldType.id),
        Field(C.FCA_ID, documento.references.fcaId, FieldType.id),
        Field(C.MON_ID, documento.references.monId, FieldType.id),
        Field(C.CUEG_ID, documento.references.cuegId, FieldType.id)
      )
    }

    def getReporteFields(reporte: Reporte, docId: Int) = {
      List(
        Field(C.DOC_ID, docId, FieldType.id),
        Field(C.RPTF_NAME, reporte.name, FieldType.text),
        Field(C.RPTF_CSRFILE, reporte.csrFile, FieldType.text),
        Field(C.RPTF_SUGERIDO, Register.boolToInt(reporte.sugerido), FieldType.boolean),
        Field(C.RPTF_SUGERIDO_EMAIL, Register.boolToInt(reporte.sugeridoMail), FieldType.boolean),
        Field(C.RPTF_COPIAS, reporte.copias, FieldType.number),
        Field(C.RPTF_DOC_IMPRIMIR_EN_ALTA, Register.boolToInt(reporte.printInNew), FieldType.boolean),
        Field(C.RPTF_OBJECT, reporte.rptObj, FieldType.text)
      )
    }

    def getFirmaFields(firma: Firma, docId: Int) = {
      List(
        Field(C.DOC_ID, docId, FieldType.id),
        Field(C.US_ID, firma.usId, FieldType.id)
      )
    }

    def throwException = {
      throw new RuntimeException(s"Error when saving ${C.DOCUMENTO}")
    }

    case class DocumentoReporteInfo(docId: Int, item: Reporte)

    def saveReporte(itemInfo: DocumentoReporteInfo) = {
      DBHelper.save(
        user,
        Register(
          C.REPORTE_FORMULARIO,
          C.RPTF_ID,
          itemInfo.item.id,
          false,
          true,
          true,
          getReporteFields(itemInfo.item, itemInfo.docId)),
        itemInfo.item.id == DBHelper.NewId
      ) match {
        case SaveResult(true, id) => true
        case SaveResult(false, id) => throwException
      }
    }

    def saveReportes(docId: Int) = {
      DBHelper.deleteItems(user, C.REPORTE_FORMULARIO, C.RPTF_ID, documento.items.reporteDeleted, s" AND doc_id = ${docId}")
      documento.items.reportes.map(reporte => saveReporte(DocumentoReporteInfo(docId, reporte)))
    }

    case class DocumentoFirmaInfo(docId: Int, item: Firma)

    def saveFirma(itemInfo: DocumentoFirmaInfo) = {
      DBHelper.save(
        user,
        Register(
          C.DOCUMENTO_FIRMA,
          C.DOCFR_ID,
          itemInfo.item.id,
          false,
          true,
          true,
          getFirmaFields(itemInfo.item, itemInfo.docId)),
        itemInfo.item.id == DBHelper.NewId
      ) match {
        case SaveResult(true, id) => true
        case SaveResult(false, id) => throwException
      }
    }

    def saveFirmas(docId: Int) = {
      DBHelper.deleteItems(user, C.DOCUMENTO_FIRMA, C.DOCFR_ID, documento.items.firmaDeleted, s" AND doc_id = ${docId}")
      documento.items.firmas.map(firma => saveFirma(DocumentoFirmaInfo(docId, firma)))
    }

    DBHelper.saveEx(
      user,
      Register(
        C.DOCUMENTO,
        C.DOC_ID,
        documento.id,
        false,
        true,
        true,
        getFields),
      isNew,
      C.DOC_CODE
    ) match {
      case SaveResult(true, id) => {
        saveReportes(id)
        saveFirmas(id)
        load(user, id).getOrElse(throwException)
      }
      case SaveResult(false, id) => throwException
    }
  }

  def load(user: CompanyUser, id: Int): Option[Documento] = {

    DB.withTransaction(user.database.database) { implicit connection =>

      val sql = "{call sp_documento_get(?, ?)}"
      val cs = connection.prepareCall(sql)

      cs.setInt(1, id)
      cs.registerOutParameter(2, Types.OTHER)

      try {
        cs.execute()

        val rs = cs.getObject(2).asInstanceOf[java.sql.ResultSet]
        Sql.as(DocumentoParser.singleOpt, rs)

      } catch {
        case NonFatal(e) => {
          Logger.error(s"can't get ${C.DOCUMENTO} with id $id for user ${user.toString}. Error ${e.toString}")
          throw e
        }
      } finally {
        cs.close
      }
    }
  }

  private def loadDocumentoItems(user: CompanyUser, id: Int) = {
    DocumentoItems(
      loadReportes(user, id),
      loadFirmas(user, id),
      "", "")
  }

  private def loadReportes(user: CompanyUser, id: Int) = {

    DB.withTransaction(user.database.database) { implicit connection =>

      val sql = "{call sp_documento_get_reportes(?, ?)}"
      val cs = connection.prepareCall(sql)

      cs.setInt(1, id)
      cs.registerOutParameter(2, Types.OTHER)

      try {
        cs.execute()

        val rs = cs.getObject(2).asInstanceOf[java.sql.ResultSet]
        Sql.as(reporteParser.*, rs)

      } catch {
        case NonFatal(e) => {
          Logger.error(s"can't get ${C.REPORTE_FORMULARIO} with id $id for user ${user.toString}. Error ${e.toString}")
          throw e
        }
      } finally {
        cs.close
      }
    }
  }

  private def loadFirmas(user: CompanyUser, id: Int) = {

    DB.withTransaction(user.database.database) { implicit connection =>

      val sql = "{call sp_documento_get_firmas(?, ?)}"
      val cs = connection.prepareCall(sql)

      cs.setInt(1, id)
      cs.registerOutParameter(2, Types.OTHER)

      try {
        cs.execute()

        val rs = cs.getObject(2).asInstanceOf[java.sql.ResultSet]
        Sql.as(firmaParser.*, rs)

      } catch {
        case NonFatal(e) => {
          Logger.error(s"can't get ${C.DOCUMENTO_FIRMA} with id $id for user ${user.toString}. Error ${e.toString}")
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
        SQL("sp_documento_delete {id}")
          .on('id -> id)
          .executeUpdate
      } catch {
        case NonFatal(e) => {
          Logger.error(s"can't delete a ${C.DOCUMENTO}. ${C.DOC_ID} id: $id. Error ${e.toString}")
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

          p.talonario,
          p.docAux,
          p.references,

          loadDocumentoItems(user, id)
        )
      }
      case None => emptyDocumento
    }
  }

}