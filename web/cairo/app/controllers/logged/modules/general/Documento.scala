package controllers.logged.modules.general

import controllers._
import formatters.json.DateFormatter
import play.api.mvc._
import play.api.data._
import play.api.data.Forms._
import actions._
import play.api.Logger
import play.api.libs.json._
import models.cairo.modules.general._
import models.cairo.system.security.CairoSecurity
import models.cairo.system.database.{DBHelper, Recordset}
import formatters.json.DateFormatter._

case class DocumentoBaseData(
                              name: String,
                              editarImpresos: Boolean,
                              llevaFirma: Boolean,
                              llevaFirmaCredito: Boolean,
                              llevaFirmaPrint: Boolean,
                              objectEdit: String,
                              generaRemito: Option[Boolean],
                              mueveStock: Option[Boolean],
                              esResumenBco: Option[Boolean],
                              esCobChequeSGR: Option[Boolean],
                              esCobCaidaSGR: Option[Boolean],
                              stConsumo: Option[Boolean],
                              descrip: String,
                              docIdPermissions: Option[Int]
                            )

case class DocumentoFacturaVentaData(
                                  esFacturaElectronica: Option[Boolean],
                                  sinPercepcion: Option[Boolean],
                                  esCreditoBanco: Option[Boolean],
                                  esVentaAccion: Option[Boolean],
                                  esVentaCheque: Option[Boolean]
                                )

case class DocumentoTipoData(
                          tipoFactura: Option[Int],
                          tipoPackingList: Option[Int],
                          tipoOrdenCompra: Option[Int],
                          rcDesdeOc: Option[Boolean],
                          rcDesdeDespacho: Option[Boolean],
                          pvDesdePrv: Option[Boolean],
                          rvDesdePv: Option[Boolean],
                          rvDesdeOs: Option[Boolean],
                          rvBOM: Option[Boolean]
                        )

case class DocumentoReferencesData(
                                    cicoId: Int,
                                    empId: Int,
                                    doctId: Int,
                                    fcaId: Int,
                                    monId: Int,
                                    taId: Option[Int],
                                    taIdFinal: Option[Int],
                                    taIdInscripto: Option[Int],
                                    taIdExterno: Option[Int],
                                    taIdInscriptoM: Option[Int],
                                    taIdHaberes: Option[Int],
                                    cuegId: Option[Int],
                                    docIdAsiento: Option[Int],
                                    docIdRemito: Option[Int],
                                    docIdStock: Option[Int],
                                    docgId: Option[Int]
                                  )

case class ReporteData(
                        id: Int,
                        name: String,
                        csrFile: String,
                        sugerido: Boolean,
                        sugeridoMail: Boolean,
                        copias: Int,
                        printInNew: Boolean,
                        rptObj: String
                      )

case class FirmaData(
                      id: Int,
                      usId: Int
                    )

case class DocumentoItemsData (
                                reportes: List[ReporteData],
                                firmas: List[FirmaData],

                                reporteDeleted: String,
                                firmaDeleted: String
                            )

case class DocumentoData(
                        id: Option[Int],
                        active: Boolean,
                        code: String,

                        base: DocumentoBaseData,
                        tipo: DocumentoTipoData,
                        facturaVenta: DocumentoFacturaVentaData,

                        references: DocumentoReferencesData,

                        items: DocumentoItemsData
                      )


object Documentos extends Controller with ProvidesUser {

  val documentoBaseFields = List(C.DOC_NAME, C.DOC_CODE, C.DOC_EDITAR_IMPRESOS, C.DOC_LLEVA_FIRMA, C.DOC_LLEVA_FIRMA_CREDITO, C.DOC_LLEVA_FIRMA_PRINT0,
    C.DOC_OBJECT_EDIT, C.DOC_GENERA_REMITO, C.DOC_MUEVE_STOCK, C.DOC_ES_RESUMEN_BANCO, C.DOC_ES_COB_CHEQUE_SGR, C.DOC_ES_COB_CAIDA_SGR,
    C.DOC_ST_CONSUMO, C.DOC_DESCRIP, C.DOC_ID_PERMISSIONS)

  val documentoTipoFields = List(C.DOC_TIPO_FACTURA, C.DOC_TIPO_PACKING_LIST, C.DOC_TIPO_ORDEN_COMPRA,
    C.DOC_RC_DESDE_OC, C.DOC_RC_DESPACHO_IMPO, C.DOC_PV_DESDE_PRV, C.DOC_RV_DESDE_PV, C.DOC_RV_DESDE_OS, C.DOC_RV_BOM)

  val documentoFacturaVentaFields = List(C.DOC_ES_FACTURA_ELECTRONICA, C.DOC_FV_SIN_PERCEPCION, C.DOC_ES_CREDITO_BANCO,
    C.DOC_ES_VENTA_ACCION, C.DOC_ES_VENTA_CHEQUE)

  val documentoReferenceFields = List(C.CICO_ID, C.EMP_ID, C.DOCT_ID, C.FCA_ID, C.MON_ID, C.TA_ID, C.TA_ID_FINAL, C.TA_ID_INSCRIPTO,
    C.TA_ID_EXTERNO, C.TA_ID_INSCRIPTO_M, C.TA_ID_HABERES, C.CUEG_ID, C.DOC_ID_ASIENTO, C.DOC_ID_REMITO, C.DOC_ID_STOCK, C.DOCG_ID)

  val documentoReporte = List(C.RPTF_ID, C.RPTF_NAME, C.RPTF_CSRFILE, C.RPTF_SUGERIDO, C.RPTF_SUGERIDO_EMAIL, C.RPTF_COPIAS,
    C.RPTF_DOC_IMPRIMIR_EN_ALTA, C.RPTF_OBJECT)

  val documentoFirma = List(C.DOCFR_ID, C.US_ID)

  /*
    case K_NAME:
    case K_CODE:
    case K_DESCRIP:
    case K_CICO_ID:
    case K_EMP_ID:
    case K_DOCT_ID:
    case K_FCA_ID:
    case K_ACTIVE:
    case K_EDITAR_IMPRESOS:
    case K_LLEVA_FIRMA:
    case K_LLEVA_FIRMA_CREDITO:
    case K_LLEVA_FIRMA_PRINT_0:
    case K_DOC_EDIT_OBJECT:
  * */

  val documentoForm = Form(
    mapping(
      "id" -> optional(number),
      DBHelper.ACTIVE -> boolean,
      C.DOC_CODE -> text,
      C.DOCUMENTO_BASE -> mapping(
        C.DOC_NAME -> nonEmptyText,
        C.DOC_EDITAR_IMPRESOS -> boolean,
        C.DOC_LLEVA_FIRMA -> boolean,
        C.DOC_LLEVA_FIRMA_CREDITO -> boolean,
        C.DOC_LLEVA_FIRMA_PRINT0 -> boolean,
        C.DOC_OBJECT_EDIT -> text,
        C.DOC_GENERA_REMITO -> optional(boolean),
        C.DOC_MUEVE_STOCK -> optional(boolean),
        C.DOC_ES_RESUMEN_BANCO -> optional(boolean),
        C.DOC_ES_COB_CHEQUE_SGR -> optional(boolean),
        C.DOC_ES_COB_CHEQUE_SGR -> optional(boolean),
        C.DOC_ST_CONSUMO -> optional(boolean),
        C.DOC_DESCRIP -> text,
        C.DOC_ID_PERMISSIONS -> optional(number))(DocumentoBaseData.apply)(DocumentoBaseData.unapply),
      C.DOCUMENTO_TIPO_ASISTENTE -> mapping(
        C.DOC_TIPO_FACTURA -> optional(number),
        C.DOC_TIPO_PACKING_LIST -> optional(number),
        C.DOC_TIPO_ORDEN_COMPRA -> optional(number),
        C.DOC_RC_DESDE_OC -> optional(boolean),
        C.DOC_RC_DESPACHO_IMPO -> optional(boolean),
        C.DOC_PV_DESDE_PRV -> optional(boolean),
        C.DOC_RV_DESDE_PV -> optional(boolean),
        C.DOC_RV_DESDE_OS -> optional(boolean),
        C.DOC_RV_BOM -> optional(boolean)
      )(DocumentoTipoData.apply)(DocumentoTipoData.unapply),
      C.DOCUMENTO_FACTURA_VENTA -> mapping(
        C.DOC_ES_FACTURA_ELECTRONICA -> optional(boolean),
        C.DOC_FV_SIN_PERCEPCION -> optional(boolean),
        C.DOC_ES_CREDITO_BANCO -> optional(boolean),
        C.DOC_ES_VENTA_ACCION -> optional(boolean),
        C.DOC_ES_VENTA_CHEQUE -> optional(boolean)
      )(DocumentoFacturaVentaData.apply)(DocumentoFacturaVentaData.unapply),
      C.DOCUMENTO_REFERENCE -> mapping(
        C.CICO_ID -> number,
        C.EMP_ID -> number,
        C.DOCT_ID -> number,
        C.FCA_ID -> number,
        C.MON_ID -> number,
        C.TA_ID -> optional(number),
        C.TA_ID_FINAL -> optional(number),
        C.TA_ID_INSCRIPTO -> optional(number),
        C.TA_ID_EXTERNO -> optional(number),
        C.TA_ID_INSCRIPTO_M -> optional(number),
        C.TA_ID_HABERES -> optional(number),
        C.CUEG_ID -> optional(number),
        C.DOC_ID_ASIENTO -> optional(number),
        C.DOC_ID_REMITO -> optional(number),
        C.DOC_ID_STOCK -> optional(number),
        C.DOCG_ID -> optional(number))(DocumentoReferencesData.apply)(DocumentoReferencesData.unapply),
      C.DOCUMENTO_ITEMS -> mapping(
        C.DOCUMENTO_REPORTES -> Forms.list[ReporteData](
          mapping (
            C.RPTF_ID -> number,
            C.RPTF_NAME -> text,
            C.RPTF_CSRFILE -> text,
            C.RPTF_SUGERIDO -> boolean,
            C.RPTF_SUGERIDO_EMAIL -> boolean,
            C.RPTF_COPIAS -> number,
            C.RPTF_DOC_IMPRIMIR_EN_ALTA -> boolean,
            C.RPTF_OBJECT -> text)(ReporteData.apply)(ReporteData.unapply)
        ),
        C.DOCUMENTO_FIRMAS -> Forms.list[FirmaData](
          mapping (
            C.DOCFR_ID -> number,
            C.US_ID -> number)(FirmaData.apply)(FirmaData.unapply)
        ),
        C.REPORTES_DELETED -> text,
        C.FIRMAS_DELETED -> text
      )(DocumentoItemsData.apply)(DocumentoItemsData.unapply)
    )(DocumentoData.apply)(DocumentoData.unapply))

  implicit val documentoWrites = new Writes[Documento] {
    def writes(documento: Documento) = Json.obj(
      "id" -> Json.toJson(documento.id),
      C.DOC_ID -> Json.toJson(documento.id),
      DBHelper.ACTIVE -> Json.toJson(documento.active),
      C.DOC_CODE -> Json.toJson(documento.code),

      C.DOC_NAME -> Json.toJson(documento.base.name),

      C.DOC_EDITAR_IMPRESOS -> Json.toJson(documento.base.editarImpresos),
      C.DOC_LLEVA_FIRMA -> Json.toJson(documento.base.llevaFirma),
      C.DOC_LLEVA_FIRMA_CREDITO -> Json.toJson(documento.base.llevaFirmaCredito),
      C.DOC_LLEVA_FIRMA_PRINT0 -> Json.toJson(documento.base.llevaFirmaPrint),
      C.DOC_OBJECT_EDIT -> Json.toJson(documento.base.objectEdit),

      C.DOC_TIPO_FACTURA -> Json.toJson(documento.base.tipo.tipoFactura),
      C.DOC_TIPO_PACKING_LIST -> Json.toJson(documento.base.tipo.tipoPackingList),
      C.DOC_TIPO_ORDEN_COMPRA -> Json.toJson(documento.base.tipo.tipoOrdenCompra),
      C.DOC_RC_DESDE_OC -> Json.toJson(documento.base.tipo.rcDesdeOc),
      C.DOC_RC_DESPACHO_IMPO -> Json.toJson(documento.base.tipo.rcDesdeDespacho),
      C.DOC_PV_DESDE_PRV -> Json.toJson(documento.base.tipo.pvDesdePrv),
      C.DOC_RV_DESDE_PV -> Json.toJson(documento.base.tipo.rvDesdePv),
      C.DOC_RV_DESDE_OS -> Json.toJson(documento.base.tipo.rvDesdeOs),
      C.DOC_RV_BOM -> Json.toJson(documento.base.tipo.rvBOM),

      C.DOC_RV_BOM -> Json.toJson(documento.base.generaRemito),
      C.DOC_RV_BOM -> Json.toJson(documento.base.mueveStock),

      C.DOC_ES_FACTURA_ELECTRONICA -> Json.toJson(documento.base.facturaVenta.esFacturaElectronica),
      C.DOC_FV_SIN_PERCEPCION -> Json.toJson(documento.base.facturaVenta.sinPercepcion),
      C.DOC_ES_CREDITO_BANCO -> Json.toJson(documento.base.facturaVenta.esCreditoBanco),
      C.DOC_ES_VENTA_ACCION -> Json.toJson(documento.base.facturaVenta.esVentaAccion),
      C.DOC_ES_VENTA_CHEQUE -> Json.toJson(documento.base.facturaVenta.esVentaCheque),

      C.DOC_ES_RESUMEN_BANCO -> Json.toJson(documento.base.esResumenBco),
      C.DOC_ES_COB_CHEQUE_SGR -> Json.toJson(documento.base.esCobChequeSGR),
      C.DOC_ES_COB_CAIDA_SGR -> Json.toJson(documento.base.esCobCaidaSGR),
      C.DOC_ST_CONSUMO -> Json.toJson(documento.base.stConsumo),

      C.DOC_DESCRIP -> Json.toJson(documento.base.descrip),

      C.TA_ID -> Json.toJson(documento.talonario.taId),
      C.TA_NAME -> Json.toJson(documento.talonario.taName),
      C.TA_ID_FINAL -> Json.toJson(documento.talonario.taIdFinal),
      C.TA_NAME_FINAL -> Json.toJson(documento.talonario.taNameFinal),
      C.TA_ID_INSCRIPTO -> Json.toJson(documento.talonario.taIdInscripto),
      C.TA_NAME_INSCRIPTO -> Json.toJson(documento.talonario.taNameInscripto),
      C.TA_ID_EXTERNO -> Json.toJson(documento.talonario.taIdExterno),
      C.TA_NAME_EXTERNO -> Json.toJson(documento.talonario.taNameExterno),
      C.TA_ID_INSCRIPTO_M -> Json.toJson(documento.talonario.taIdInscriptoM),
      C.TA_NAME_INSCRIPTO_M -> Json.toJson(documento.talonario.taNameInscriptoM),
      C.TA_ID_HABERES -> Json.toJson(documento.talonario.taIdHaberes),
      C.TA_NAME_HABERES -> Json.toJson(documento.talonario.taNameHaberes),

      C.DOC_ID_ASIENTO -> Json.toJson(documento.docAux.docIdAsiento),
      C.DOC_NAME_ASIENTO -> Json.toJson(documento.docAux.docNameAsiento),
      C.DOC_ID_REMITO -> Json.toJson(documento.docAux.docIdRemito),
      C.DOC_NAME_REMITO -> Json.toJson(documento.docAux.docNameRemito),
      C.DOC_ID_STOCK -> Json.toJson(documento.docAux.docIdStock),
      C.DOC_NAME_STOCK -> Json.toJson(documento.docAux.docNameStock),
      C.DOCG_ID -> Json.toJson(documento.docAux.docgId),
      C.DOCG_NAME -> Json.toJson(documento.docAux.docgName),

      C.CICO_ID -> Json.toJson(documento.references.cicoId),
      C.CICO_NAME -> Json.toJson(documento.references.cicoName),
      C.EMP_ID -> Json.toJson(documento.references.empId),
      C.EMP_NAME -> Json.toJson(documento.references.empName),
      C.DOCT_ID -> Json.toJson(documento.references.doctId),
      C.DOCT_NAME -> Json.toJson(documento.references.doctName),
      C.FCA_ID -> Json.toJson(documento.references.fcaId),
      C.FCA_NAME -> Json.toJson(documento.references.fcaName),
      C.MON_ID -> Json.toJson(documento.references.monId),
      C.MON_NAME -> Json.toJson(documento.references.monName),
      C.CUEG_ID -> Json.toJson(documento.references.cuegId),
      C.CUEG_NAME -> Json.toJson(documento.references.cuegName),

      // Items
      "reportes" -> Json.toJson(writeDocumentoReportes(documento.items.reportes)),
      "firmas" -> Json.toJson(writeDocumentoFirmas(documento.items.firmas))
    )
    def documentoReporteWrite(p: Reporte) = Json.obj(
      C.RPTF_ID -> Json.toJson(p.id),
      C.RPTF_NAME -> Json.toJson(p.name),
      C.RPTF_CSRFILE -> Json.toJson(p.csrFile),
      C.RPTF_SUGERIDO -> Json.toJson(p.sugerido),
      C.RPTF_SUGERIDO_EMAIL -> Json.toJson(p.sugeridoMail),
      C.RPTF_COPIAS -> Json.toJson(p.copias),
      C.RPTF_DOC_IMPRIMIR_EN_ALTA -> Json.toJson(p.printInNew),
      C.RPTF_OBJECT -> Json.toJson(p.rptObj)
    )
    def documentoFirmaWrite(p: Firma) = Json.obj(
      C.DOCFR_ID -> Json.toJson(p.id),
      C.US_ID -> Json.toJson(p.usId),
      C.US_NAME -> Json.toJson(p.usName)
    )
    def writeDocumentoReportes(items: List[Reporte]) = items.map(item => documentoReporteWrite(item))
    def writeDocumentoFirmas(items: List[Firma]) = items.map(item => documentoFirmaWrite(item))
  }

  def get(id: Int) = GetAction { implicit request =>
    LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.LIST_CLIENTE), { user =>
      Ok(Json.toJson(Documento.get(user, id)))
    })
  }

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //
  // this functions convert the plain JSON received in CREATE and UPDATE into a DocumentoData structure
  //
  // because the limitation to 18 fields in case class used for FORM mapping we have grouped the fields
  // in Documento/Data, DocumentoItem/Data, etc
  //
  // the below routines group a flat JSON and in some cases rename the name of the fields or move
  // fields to the parent node in the JSON structure to match the case class
  //

  private def preprocessParams(implicit request:Request[AnyContent]): JsObject = {

    def getJsValueAsMap(list: Map[String, JsValue]): Map[String, JsValue] = list.toList match {
      case (key: String, jsValue: JsValue) :: t => jsValue.as[Map[String, JsValue]]
      case _ => Map.empty
    }

    def preprocessReporteParam(field: JsValue) = {
      val params = field.as[Map[String, JsValue]]
      JsObject(Global.preprocessFormParams(documentoReporte, "", params).toSeq)
    }

    def preprocessFirmaParam(field: JsValue) = {
      val params = field.as[Map[String, JsValue]]
      JsObject(Global.preprocessFormParams(documentoFirma, "", params).toSeq)
    }

    def preprocessReportesParam(items: JsValue, group: String): Map[String, JsValue] = items match {
      case JsArray(arr) => Map(group -> JsArray(arr.map(preprocessReporteParam(_))))
      case _ => Map.empty
    }

    def preprocessFirmasParam(items: JsValue, group: String): Map[String, JsValue] = items match {
      case JsArray(arr) => Map(group -> JsArray(arr.map(preprocessFirmaParam(_))))
      case _ => Map.empty
    }

    val params = Global.getParamsFromJsonRequest

    // groups for DocumentoData
    //
    val documentoId = Global.preprocessFormParams(List("id", DBHelper.ACTIVE, C.DOC_CODE), "", params)
    val documentoBaseGroup = Global.preprocessFormParams(documentoBaseFields, C.DOCUMENTO_BASE, params)
    val documentoTipoAsistenteGroup = Global.preprocessFormParams(documentoTipoFields, C.DOCUMENTO_TIPO_ASISTENTE, params)
    val documentoFacturaVentaGroup = Global.preprocessFormParams(documentoFacturaVentaFields, C.DOCUMENTO_FACTURA_VENTA, params)
    val documentoReferenceGroup = Global.preprocessFormParams(documentoReferenceFields, C.DOCUMENTO_REFERENCE, params)

    // reportes
    //
    val reportesInfo = getJsValueAsMap(Global.getParamsJsonRequestFor(C.REPORTE_FORMULARIO, params))
    val reporteRows = Global.getParamsJsonRequestFor(C.ITEMS, reportesInfo)
    val reporteDeleted: Map[String, JsValue] = Global.getParamsJsonRequestFor(C.DELETED_LIST, reportesInfo).toList match {
      case Nil => Map(C.REPORTES_DELETED -> Json.toJson(""))
      case deletedList :: t => Map(C.REPORTES_DELETED -> Json.toJson(deletedList._2))
    }
    val documentoReportes = reporteRows.toList match {
      case (k: String, item: JsValue) :: t => preprocessReportesParam(item, C.REPORTE_FORMULARIO)
      case _ => Map(C.REPORTE_FORMULARIO -> JsArray(List()))
    }

    // firmas
    //
    val firmasInfo = getJsValueAsMap(Global.getParamsJsonRequestFor(C.DOCUMENTO_FIRMA, params))
    val firmaRows = Global.getParamsJsonRequestFor(C.ITEMS, firmasInfo)
    val firmaDeleted: Map[String, JsValue] = Global.getParamsJsonRequestFor(C.DELETED_LIST, firmasInfo).toList match {
      case Nil => Map(C.FIRMAS_DELETED -> Json.toJson(""))
      case deletedList :: t => Map(C.FIRMAS_DELETED -> Json.toJson(deletedList._2))
    }
    val documentoFirmas = firmaRows.toList match {
      case (k: String, item: JsValue) :: t => preprocessFirmasParam(item, C.DOCUMENTO_FIRMA)
      case _ => Map(C.DOCUMENTO_FIRMA -> JsArray(List()))
    }

    val documentoItems = Map(C.DOCUMENTO_ITEMS -> JsObject((
      documentoReportes ++ reporteDeleted ++ documentoFirmas ++ firmaDeleted).toSeq
    ))

    JsObject(
      (documentoId ++ documentoBaseGroup ++ documentoTipoAsistenteGroup ++ documentoFacturaVentaGroup
        ++ documentoReferenceGroup ++ documentoItems).toSeq)
  }
  //
  //
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  def getReportes(reportes: List[ReporteData]): List[Reporte] = {
    reportes.map(reporte => {
      Reporte(
        reporte.id,
        reporte.name,
        reporte.csrFile,
        reporte.sugerido,
        reporte.sugeridoMail,
        reporte.copias,
        reporte.printInNew,
        reporte.rptObj
      )
    })
  }

  def getFirmas(firmas: List[FirmaData]): List[Firma] = {
    firmas.map(firma => {
      Firma(
        firma.id,
        firma.usId
      )
    })
  }

  def getDocumentoItems(documento: DocumentoData): DocumentoItems = {
    DocumentoItems(
      getReportes(documento.items.reportes),
      getFirmas(documento.items.firmas),
      documento.items.reporteDeleted,
      documento.items.firmaDeleted
    )
  }

  def getDocumento(documento: DocumentoData, id: Int): Documento = {
    Documento(
      id,
      documento.active,
      documento.code,
      DocumentoBase(
        documento.base.name,
        documento.base.editarImpresos,
        documento.base.llevaFirma,
        documento.base.llevaFirmaCredito,
        documento.base.llevaFirmaPrint,
        documento.base.objectEdit,

        DocumentoTipo(
          documento.tipo.tipoFactura.getOrElse(0),
          documento.tipo.tipoPackingList.getOrElse(0),
          documento.tipo.tipoOrdenCompra.getOrElse(0),
          documento.tipo.rcDesdeOc.getOrElse(false),
          documento.tipo.rcDesdeDespacho.getOrElse(false),
          documento.tipo.pvDesdePrv.getOrElse(false),
          documento.tipo.rvDesdePv.getOrElse(false),
          documento.tipo.rvDesdeOs.getOrElse(false),
          documento.tipo.rvBOM.getOrElse(false)),

        documento.base.generaRemito.getOrElse(false),
        documento.base.mueveStock.getOrElse(false),

        DocumentoFacturaVenta(
          documento.facturaVenta.esFacturaElectronica.getOrElse(false),
          documento.facturaVenta.sinPercepcion.getOrElse(false),
          documento.facturaVenta.esCreditoBanco.getOrElse(false),
          documento.facturaVenta.esVentaAccion.getOrElse(false),
          documento.facturaVenta.esVentaCheque.getOrElse(false)),

        documento.base.esResumenBco.getOrElse(false),
        documento.base.esCobChequeSGR.getOrElse(false),
        documento.base.esCobCaidaSGR.getOrElse(false),
        documento.base.stConsumo.getOrElse(false),
        documento.base.descrip),

      DocumentoTalonario(
        documento.references.taId.getOrElse(0),
        documento.references.taIdFinal.getOrElse(0),
        documento.references.taIdInscripto.getOrElse(0),
        documento.references.taIdExterno.getOrElse(0),
        documento.references.taIdInscriptoM.getOrElse(0),
        documento.references.taIdHaberes.getOrElse(0)
      ),
      DocumentoAux(
        documento.references.docIdAsiento.getOrElse(0),
        documento.references.docIdRemito.getOrElse(0),
        documento.references.docIdStock.getOrElse(0),
        documento.references.docgId.getOrElse(0)
      ),
      DocumentoReferences(
        documento.references.cicoId,
        documento.references.empId,
        documento.references.doctId,
        documento.references.fcaId,
        documento.references.monId,
        documento.references.cuegId.getOrElse(0)
      ),

      getDocumentoItems(documento)
    )
  }

  def update(id: Int) = PostAction { implicit request =>
    Logger.debug("in Documentos.update")
    documentoForm.bind(preprocessParams).fold(
      formWithErrors => {
        Logger.debug(s"invalid form: ${formWithErrors.toString}")
        BadRequest
      },
      documento => {
        Logger.debug(s"form: ${documento.toString}")
        LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.EDIT_DOCUMENTO), { user =>
          Ok(
            Json.toJson(
              Documento.update(user,
                getDocumento(documento, id)
              )
            )
          )
        })
      }
    )
  }

  def create = PostAction { implicit request =>
    Logger.debug("in Documentos.create")
    documentoForm.bind(preprocessParams).fold(
      formWithErrors => {
        Logger.debug(s"invalid form: ${formWithErrors.toString}")
        BadRequest
      },
      documento => {
        Logger.debug(s"form: ${documento.toString}")
        LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.NEW_DOCUMENTO), { user =>
          Ok(
            Json.toJson(
              Documento.create(user,
                getDocumento(documento, DBHelper.NoId),
                documento.base.docIdPermissions
              )
            )
          )
        })
      }
    )
  }

  def delete(id: Int) = PostAction { implicit request =>
    Logger.debug("in Documentos.delete")
    LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.DELETE_DOCUMENTO), { user =>
      Documento.delete(user, id)
      // Backbonejs requires at least an empty json object in the response
      // if not it will call errorHandler even when we responded with 200 OK :P
      Ok(JsonUtil.emptyJson)
    })
  }

}