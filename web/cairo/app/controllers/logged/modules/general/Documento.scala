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

                              tipo: DocumentoTipoData,

                              generaRemito: Boolean,
                              mueveStock: Boolean,

                              facturaVenta: DocumentoFacturaVentaData,

                              esResumenBco: Boolean,

                              esCobChequeSGR: Boolean,
                              esCobCaidaSGR: Boolean,

                              stConsumo: Boolean,

                              descrip: String
                            )

case class DocumentoFacturaVentaData(
                                  esFacturaElectronica: Int,
                                  sinPercepcion: Boolean,
                                  esCreditoBanco: Boolean,
                                  esVentaAccion: Boolean,
                                  esVentaCheque: Boolean
                                )

case class DocumentoTipoData(
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

case class DocumentoReferencesData(
                                    cicoId: Int,
                                    empId: Int,
                                    doctId: Int,
                                    fcaId: Int,
                                    monId: Int,
                                    taId: Int,
                                    taIdFinal: Int,
                                    taIdInscripto: Int,
                                    taIdExterno: Int,
                                    taIdInscriptoM: Int,
                                    taIdHaberes: Int,
                                    cuegId: Int,
                                    docIdAsiento: Int,
                                    docIdRemito: Int,
                                    docIdStock: Int,
                                    docgId: Int
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
                        references: DocumentoReferencesData,

                        items: DocumentoItemsData
                      )


object Documentos extends Controller with ProvidesUser {

  val documentoBaseFields = List(C.DOC_NAME, C.DOC_CODE, C.DOC_EDITAR_IMPRESOS, C.DOC_LLEVA_FIRMA, C.DOC_LLEVA_FIRMA_CREDITO, C.DOC_LLEVA_FIRMA_PRINT0,
    C.DOC_OBJECT_EDIT, C.DOC_GENERA_REMITO, C.DOC_MUEVE_STOCK, C.DOC_ES_RESUMEN_BANCO, C.DOC_ES_COB_CHEQUE_SGR, C.DOC_ES_COB_CAIDA_SGR,
    C.DOC_ST_CONSUMO, C.DOC_DESCRIP)

  val documentoTipoFields = List(C.DOC_TIPO_FACTURA, C.DOC_TIPO_PACKING_LIST, C.DOC_TIPO_ORDEN_COMPRA,
    C.DOC_RC_DESDE_OC, C.DOC_RC_DESPACHO_IMPO, C.DOC_PV_DESDE_PRV, C.DOC_RV_DESDE_PV, C.DOC_RV_DESDE_OS, C.DOC_RV_BOM)

  val documentoFacturaVentaFields = List(C.DOC_ES_FACTURA_ELECTRONICA, C.DOC_FV_SIN_PERCEPCION, C.DOC_ES_CREDITO_BANCO,
    C.DOC_ES_VENTA_ACCION, C.DOC_ES_VENTA_CHEQUE)

  val documentoReporte = List(C.RPTF_ID, C.RPTF_NAME, C.RPTF_CSRFILE, C.RPTF_SUGERIDO, C.RPTF_SUGERIDO_EMAIL, C.RPTF_COPIAS,
    C.RPTF_DOC_IMPRIMIR_EN_ALTA, C.RPTF_OBJECT)

  val documentoFirma = List(C.DOCFR_ID, C.US_ID)

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
        C.DOCUMENTO_TIPO_ASISTENTE -> mapping(
          C.DOC_TIPO_FACTURA -> number,
          C.DOC_TIPO_PACKING_LIST -> number,
          C.DOC_TIPO_ORDEN_COMPRA -> number,
          C.DOC_RC_DESDE_OC -> boolean,
          C.DOC_RC_DESPACHO_IMPO -> boolean,
          C.DOC_PV_DESDE_PRV -> boolean,
          C.DOC_RV_DESDE_PV -> boolean,
          C.DOC_RV_DESDE_OS -> boolean,
          C.DOC_RV_BOM -> boolean
        )(DocumentoTipoData.apply)(DocumentoTipoData.unapply),
        C.DOC_GENERA_REMITO -> boolean,
        C.DOC_MUEVE_STOCK -> boolean,
        C.DOCUMENTO_FACTURA_VENTA -> mapping(
          C.DOC_ES_FACTURA_ELECTRONICA -> number,
          C.DOC_FV_SIN_PERCEPCION -> boolean,
          C.DOC_ES_CREDITO_BANCO -> boolean,
          C.DOC_ES_VENTA_ACCION -> boolean,
          C.DOC_ES_VENTA_CHEQUE -> boolean
        )(DocumentoFacturaVentaData.apply)(DocumentoFacturaVentaData.unapply),
        C.DOC_ES_RESUMEN_BANCO -> boolean,
        C.DOC_ES_COB_CHEQUE_SGR -> boolean,
        C.DOC_ES_COB_CHEQUE_SGR -> boolean,
        C.DOC_ST_CONSUMO -> boolean,
        C.DOC_DESCRIP -> text)(DocumentoBaseData.apply)(DocumentoBaseData.unapply),
      C.DOCUMENTO_REFERENCE -> mapping(
        C.CICO_ID -> number,
        C.EMP_ID -> number,
        C.DOCT_ID -> number,
        C.FCA_ID -> number,
        C.MON_ID -> number,
        C.TA_ID -> number,
        C.TA_ID_FINAL -> number,
        C.TA_ID_INSCRIPTO -> number,
        C.TA_ID_EXTERNO -> number,
        C.TA_ID_INSCRIPTO_M -> number,
        C.TA_ID_HABERES -> number,
        C.CUEG_ID -> number,
        C.DOC_ID_ASIENTO -> number,
        C.DOC_ID_REMITO -> number,
        C.DOC_ID_STOCK -> number,
        C.DOCG_ID -> number)(DocumentoReferencesData.apply)(DocumentoReferencesData.unapply),
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
        C.FIRMA_DELETED -> text
      )(DocumentoItemsData.apply)(DocumentoItemsData.unapply)
    )(DocumentoData.apply)(DocumentoData.unapply))

  implicit val documentoWrites = new Writes[Documento] {
    def writes(documento: Documento) = Json.obj(
      "id" -> Json.toJson(documento.id),
      C.DOC_ID -> Json.toJson(documento.id),
      DBHelper.ACTIVE -> Json.toJson(documento.active),
      C.DOC_CODE -> Json.toJson(documento.code),

      C.DOC_NAME -> Json.toJson(documento.base.name),
      C.DOC_RAZONSOCIAL -> Json.toJson(documento.base.razonSocial),
      C.DOC_ES_PROSPECTO -> Json.toJson(documento.base.esProspecto),
      C.DOC_CAT_FISCAL -> Json.toJson(documento.base.catFiscal),
      C.DOC_CUIT -> Json.toJson(documento.base.cuit),
      C.DOC_INGRESOSBRUTOS -> Json.toJson(documento.base.ingresosBrutos),
      C.DOC_CONTACTO -> Json.toJson(documento.base.contacto),
      C.DOC_CHEQUEORDEN -> Json.toJson(documento.base.chequeOrden),
      C.DOC_EXIGE_TRANSPORTE -> Json.toJson(documento.base.exigeTransporte),
      C.DOC_EXIGE_PROVINCIA -> Json.toJson(documento.base.exigeProvincia),
      C.DOC_PCIA_TRANSPORTE -> Json.toJson(documento.base.pciaTransporte),
      C.DOC_CREDITOCTACTE -> Json.toJson(documento.base.creditoCtaCte),
      C.DOC_CREDITOTOTAL -> Json.toJson(documento.base.creditoTotal),
      C.DOC_CREDITOACTIVO -> Json.toJson(documento.base.creditoActivo),
      C.DOC_DESCRIP -> Json.toJson(documento.base.descrip),

      C.DOC_CALLE -> Json.toJson(documento.address.calle),
      C.DOC_CALLENUMERO -> Json.toJson(documento.address.calleNumero),
      C.DOC_PISO -> Json.toJson(documento.address.piso),
      C.DOC_DEPTO -> Json.toJson(documento.address.depto),
      C.DOC_CODPOSTAL -> Json.toJson(documento.address.codPostal),
      C.DOC_LOCALIDAD -> Json.toJson(documento.address.localidad),
      C.DOC_HORARIO_MDESDE -> Json.toJson(documento.address.horarioMDesde),
      C.DOC_HORARIO_MHASTA -> Json.toJson(documento.address.horarioMHasta),
      C.DOC_HORARIO_TDESDE -> Json.toJson(documento.address.horarioTDesde),
      C.DOC_HORARIO_THASTA -> Json.toJson(documento.address.horarioTHasta),
      C.DOC_TEL -> Json.toJson(documento.address.tel),
      C.DOC_FAX -> Json.toJson(documento.address.fax),
      C.DOC_EMAIL -> Json.toJson(documento.address.email),
      C.DOC_WEB -> Json.toJson(documento.address.web),
      C.DOC_MESSENGER -> Json.toJson(documento.address.messenger),
      C.DOC_YAHOO -> Json.toJson(documento.address.yahoo),

      C.DOC_ID_PADRE -> Json.toJson(documento.references.cliIdPadre),
      C.DOC_NOMBRE_PADRE -> Json.toJson(documento.references.padre),
      C.CPA_ID -> Json.toJson(documento.references.address.cpaId),
      C.CPA_CODE -> Json.toJson(documento.references.address.cpaCode),
      C.LP_ID -> Json.toJson(documento.references.priceLists.lpId),
      C.LP_NAME -> Json.toJson(documento.references.priceLists.lpName),
      C.LD_ID -> Json.toJson(documento.references.priceLists.ldId),
      C.LD_NAME -> Json.toJson(documento.references.priceLists.ldName),
      C.CPG_ID -> Json.toJson(documento.references.cpgId),
      C.CPG_NAME -> Json.toJson(documento.references.cpgName),
      C.PRO_ID -> Json.toJson(documento.references.address.proId),
      C.PRO_NAME -> Json.toJson(documento.references.address.proName),
      C.ZON_ID -> Json.toJson(documento.references.address.zonId),
      C.ZON_NAME -> Json.toJson(documento.references.address.zonName),
      C.FP_ID -> Json.toJson(documento.references.fpId),
      C.FP_NAME -> Json.toJson(documento.references.fpName),
      C.VEN_ID -> Json.toJson(documento.references.venId),
      C.VEN_NAME -> Json.toJson(documento.references.venName),
      C.TRANS_ID -> Json.toJson(documento.references.address.transId),
      C.TRANS_NAME -> Json.toJson(documento.references.address.transName),
      C.CLICT_ID -> Json.toJson(documento.references.clictId),
      C.CLICT_NAME -> Json.toJson(documento.references.clictName),
      C.DOC_ID_REFERIDO -> Json.toJson(documento.references.cliIdReferido),
      C.REFERIDO -> Json.toJson(documento.references.referido),
      C.PROY_ID -> Json.toJson(documento.references.proyId),
      C.PROY_NAME -> Json.toJson(documento.references.proyName),

      // TODO: implement this
      C.DOC_INF_US_ID -> Json.toJson(documento.references.webUser.usId),
      C.US_NAME -> Json.toJson(documento.references.webUser.name),
      C.DOC_INF_ACTIVE -> Json.toJson(documento.references.webUser.active),

      // Items
      "sucursales" -> Json.toJson(writeDocumentoSucursal(documento.items.sucursales)),
      "empresas" -> Json.toJson(writeDocumentoEmpresas(documento.items.empresas)),
      "cuentasGrupo" -> Json.toJson(writeDocumentoCuentasGrupo(documento.items.cuentasGrupo)),
      "percepciones" -> Json.toJson(writeDocumentoPercepciones(documento.items.percepciones)),
      "dptos" -> Json.toJson(writeDocumentoDptos(documento.items.dptos)),
      "contactos" -> Json.toJson(writeDocumentoContactos(documento.items.contactos)),
      "informes" -> Json.toJson(writeDocumentoInformes(documento.items.informes)),
      "additionalFields" -> Json.toJson(additionalFieldsWrites)
    )
    def additionalFieldsWrites() = Json.obj(
      "fields" -> Json.toJson(writeEmptyCols(List())),
      "values" -> Json.toJson(writeEmptyCols(List()))
    )
    def itemWrites(item: Any) = Json.obj(
      "dummy" -> Json.toJson("")
    )
    def documentoSucursalWrite(p: DocumentoSucursal) = Json.obj(
      C.CLIS_CODE -> Json.toJson(p.code),
      C.CLIS_NAME -> Json.toJson(p.name),
      C.CLIS_DESCRIP -> Json.toJson(p.descrip),
      C.CLIS_CONTACTO -> Json.toJson(p.contacto),
      C.CLIS_CALLE -> Json.toJson(p.calle),
      C.CLIS_CALLE_NUMERO -> Json.toJson(p.calleNumero),
      C.CLIS_PISO -> Json.toJson(p.piso),
      C.CLIS_DEPTO -> Json.toJson(p.depto),
      C.CLIS_COD_POSTAL -> Json.toJson(p.codPostal),
      C.CLIS_LOCALIDAD -> Json.toJson(p.localidad),
      C.CLIS_TEL -> Json.toJson(p.tel),
      C.CLIS_FAX -> Json.toJson(p.fax),
      C.CLIS_EMAIL -> Json.toJson(p.email),
      C.PA_ID -> Json.toJson(p.paId),
      C.PRO_ID -> Json.toJson(p.proId),
      C.ZON_ID -> Json.toJson(p.zonId)
    )
    def documentoEmpresaWrite(p: DocumentoEmpresa) = Json.obj(
      C.EMP_DOC_ID -> Json.toJson(p.id),
      C.EMP_ID -> Json.toJson(p.empId),
      C.EMP_NAME -> Json.toJson(p.empName)
    )
    def documentoCuentaGrupoWrite(p: DocumentoCuentaGrupo) = Json.obj(
      C.DOC_CUEG_ID -> Json.toJson(p.id),
      C.CUEG_ID -> Json.toJson(p.cuegId),
      C.CUEG_NAME -> Json.toJson(p.cuegName),
      C.CUE_ID -> Json.toJson(p.cueId),
      C.CUE_NAME -> Json.toJson(p.cueName)
    )
    def documentoPercepcionWrite(p: DocumentoPercepcion) = Json.obj(
      C.DOC_PERC_ID -> Json.toJson(p.id),
      C.PERC_ID -> Json.toJson(p.percId),
      C.PERC_NAME -> Json.toJson(p.percName),
      C.DOC_PERC_DESDE -> Json.toJson(p.desde),
      C.DOC_PERC_HASTA -> Json.toJson(p.hasta)
    )
    def documentoDptoWrite(p: DocumentoDepartamento) = Json.obj(
      C.DPTO_DOC_ID -> Json.toJson(p.id),
      C.DPTO_ID -> Json.toJson(p.dptoId),
      C.DPTO_NAME -> Json.toJson(p.dptoName)
    )
    def documentoContactoWrite(p: DocumentoContacto) = Json.obj(
      C.CONT_ID -> Json.toJson(p.id),
      C.CONT_CODE -> Json.toJson(p.code),
      C.CONT_NAME -> Json.toJson(p.name),
      C.CONT_DESCRIP -> Json.toJson(p.descrip),
      C.CONT_TEL -> Json.toJson(p.tel),
      C.CONT_CELULAR -> Json.toJson(p.mobile),
      C.CONT_EMAIL -> Json.toJson(p.email),
      C.CONT_CARGO -> Json.toJson(p.cargo),
      C.CONT_DIRECCION -> Json.toJson(p.address),
      DBHelper.ACTIVE -> Json.toJson(p.active)
    )
    def documentoInformeWrite(p: DocumentoInforme) = Json.obj(
      C.PER_ID -> Json.toJson(p.perId),
      C.INF_ID -> Json.toJson(p.infId),
      C.INF_CODE -> Json.toJson(p.infCode),
      C.INF_NAME -> Json.toJson(p.infName),
      C.PRE_ID -> Json.toJson(p.preId)
    )
    def writeEmptyCols(items: List[Any]) = items.map(item => itemWrites(item))
    def writeDocumentoSucursal(items: List[DocumentoSucursal]) = items.map(item => documentoSucursalWrite(item))
    def writeDocumentoEmpresas(items: List[DocumentoEmpresa]) = items.map(item => documentoEmpresaWrite(item))
    def writeDocumentoCuentasGrupo(items: List[DocumentoCuentaGrupo]) = items.map(item => documentoCuentaGrupoWrite(item))
    def writeDocumentoPercepciones(items: List[DocumentoPercepcion]) = items.map(item => documentoPercepcionWrite(item))
    def writeDocumentoDptos(items: List[DocumentoDepartamento]) = items.map(item => documentoDptoWrite(item))
    def writeDocumentoContactos(items: List[DocumentoContacto]) = items.map(item => documentoContactoWrite(item))
    def writeDocumentoInformes(items: List[DocumentoInforme]) = items.map(item => documentoInformeWrite(item))
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

    def preprocessCaiParam(field: JsValue) = {
      val params = field.as[Map[String, JsValue]]
      JsObject(Global.preprocessFormParams(documentoSucursal, "", params).toSeq)
    }

    def preprocessEmpresaParam(field: JsValue) = {
      val params = field.as[Map[String, JsValue]]
      JsObject(Global.preprocessFormParams(documentoEmpresa, "", params).toSeq)
    }

    def preprocessCuentaGrupoParam(field: JsValue) = {
      val params = field.as[Map[String, JsValue]]
      JsObject(Global.preprocessFormParams(documentoCuentaGrupo, "", params).toSeq)
    }

    def preprocessPercepcionParam(field: JsValue) = {
      val params = field.as[Map[String, JsValue]]
      JsObject(Global.preprocessFormParams(documentoPercepcion, "", params).toSeq)
    }

    def preprocessDepartamentoParam(field: JsValue) = {
      val params = field.as[Map[String, JsValue]]
      JsObject(Global.preprocessFormParams(documentoDepartamento, "", params).toSeq)
    }

    def preprocessContactoParam(field: JsValue) = {
      val params = field.as[Map[String, JsValue]]
      JsObject(Global.preprocessFormParams(documentoContacto, "", params).toSeq)
    }

    def preprocessInformeParam(field: JsValue) = {
      val params = field.as[Map[String, JsValue]]
      JsObject(Global.preprocessFormParams(documentoInforme, "", params).toSeq)
    }

    def preprocessSucursalesParam(items: JsValue, group: String): Map[String, JsValue] = items match {
      case JsArray(arr) => Map(group -> JsArray(arr.map(preprocessCaiParam(_))))
      case _ => Map.empty
    }

    def preprocessEmpresasParam(items: JsValue, group: String): Map[String, JsValue] = items match {
      case JsArray(arr) => Map(group -> JsArray(arr.map(preprocessEmpresaParam(_))))
      case _ => Map.empty
    }

    def preprocessCuentasGrupoParam(items: JsValue, group: String): Map[String, JsValue] = items match {
      case JsArray(arr) => Map(group -> JsArray(arr.map(preprocessCuentaGrupoParam(_))))
      case _ => Map.empty
    }

    def preprocessPercepcionesParam(items: JsValue, group: String): Map[String, JsValue] = items match {
      case JsArray(arr) => Map(group -> JsArray(arr.map(preprocessPercepcionParam(_))))
      case _ => Map.empty
    }

    def preprocessDepartamentosParam(items: JsValue, group: String): Map[String, JsValue] = items match {
      case JsArray(arr) => Map(group -> JsArray(arr.map(preprocessDepartamentoParam(_))))
      case _ => Map.empty
    }

    def preprocessContactosParam(items: JsValue, group: String): Map[String, JsValue] = items match {
      case JsArray(arr) => Map(group -> JsArray(arr.map(preprocessContactoParam(_))))
      case _ => Map.empty
    }

    def preprocessInformesParam(items: JsValue, group: String): Map[String, JsValue] = items match {
      case JsArray(arr) => Map(group -> JsArray(arr.map(preprocessInformeParam(_))))
      case _ => Map.empty
    }

    val params = Global.getParamsFromJsonRequest

    // groups for DocumentoData
    //
    val documentoId = Global.preprocessFormParams(List("id", DBHelper.ACTIVE, C.DOC_CODE), "", params)
    val documentoBaseGroup = Global.preprocessFormParams(documentoBaseFields, C.CLIENTE_BASE, params)
    val documentoAddressGroup = Global.preprocessFormParams(documentoAddressFields, C.CLIENTE_ADDRESS, params)
    val documentoReferencesGroup = Global.preprocessFormParams(documentoReferencesFields, C.CLIENTE_REFERENCES, params)

    // sucursales
    //
    val sucursalesInfo = getJsValueAsMap(Global.getParamsJsonRequestFor(C.CLIENTE_SUCURSAL, params))
    val sucursalRows = Global.getParamsJsonRequestFor(C.ITEMS, sucursalesInfo)
    val sucursalDeleted: Map[String, JsValue] = Global.getParamsJsonRequestFor(C.DELETED_LIST, sucursalesInfo).toList match {
      case Nil => Map(C.CLIENTE_SUCURSAL_DELETED -> Json.toJson(""))
      case deletedList :: t => Map(C.CLIENTE_SUCURSAL_DELETED -> Json.toJson(deletedList._2))
    }
    val documentoSucursals = sucursalRows.toList match {
      case (k: String, item: JsValue) :: t => preprocessSucursalesParam(item, C.CLIENTE_SUCURSAL)
      case _ => Map(C.CLIENTE_SUCURSAL -> JsArray(List()))
    }

    // empresas
    //
    val empresasInfo = getJsValueAsMap(Global.getParamsJsonRequestFor(C.EMPRESA_CLIENTE, params))
    val empresaRows = Global.getParamsJsonRequestFor(C.ITEMS, empresasInfo)
    val documentoEmpresas = empresaRows.toList match {
      case (k: String, item: JsValue) :: t => preprocessEmpresasParam(item, C.EMPRESA_CLIENTE)
      case _ => Map(C.EMPRESA_CLIENTE -> JsArray(List()))
    }

    // cuentas grupo
    //
    val cuentasGrupoInfo = getJsValueAsMap(Global.getParamsJsonRequestFor(C.CLIENTE_CUENTA_GRUPO, params))
    val cuentaGrupoRows = Global.getParamsJsonRequestFor(C.ITEMS, cuentasGrupoInfo)
    val cuentaGrupoDeleted: Map[String, JsValue] = Global.getParamsJsonRequestFor(C.DELETED_LIST, cuentasGrupoInfo).toList match {
      case Nil => Map(C.CLIENTE_CUENTA_GRUPO_DELETED -> Json.toJson(""))
      case deletedList :: t => Map(C.CLIENTE_CUENTA_GRUPO_DELETED -> Json.toJson(deletedList._2))
    }
    val documentoCuentasGrupo = cuentaGrupoRows.toList match {
      case (k: String, item: JsValue) :: t => preprocessCuentasGrupoParam(item, C.CLIENTE_CUENTA_GRUPO)
      case _ => Map(C.CLIENTE_CUENTA_GRUPO -> JsArray(List()))
    }

    // percepciones
    //
    val percepcionesInfo = getJsValueAsMap(Global.getParamsJsonRequestFor(C.CLIENTE_PERCEPCION, params))
    val percepcionRows = Global.getParamsJsonRequestFor(C.ITEMS, percepcionesInfo)
    val percepcionDeleted: Map[String, JsValue] = Global.getParamsJsonRequestFor(C.DELETED_LIST, percepcionesInfo).toList match {
      case Nil => Map(C.CLIENTE_PERCEPCIONES_DELETED -> Json.toJson(""))
      case deletedList :: t => Map(C.CLIENTE_PERCEPCIONES_DELETED -> Json.toJson(deletedList._2))
    }
    val documentoPercepciones = percepcionRows.toList match {
      case (k: String, item: JsValue) :: t => preprocessPercepcionesParam(item, C.CLIENTE_PERCEPCION)
      case _ => Map(C.CLIENTE_PERCEPCION -> JsArray(List()))
    }

    // departamentos
    //
    val departamentosInfo = getJsValueAsMap(Global.getParamsJsonRequestFor(C.DEPARTAMENTO_CLIENTE, params))
    val departamentoRows = Global.getParamsJsonRequestFor(C.ITEMS, departamentosInfo)
    val departamentoDeleted: Map[String, JsValue] = Global.getParamsJsonRequestFor(C.DELETED_LIST, departamentosInfo).toList match {
      case Nil => Map(C.CLIENTE_DEPARTAMENTO_DELETED -> Json.toJson(""))
      case deletedList :: t => Map(C.CLIENTE_DEPARTAMENTO_DELETED -> Json.toJson(deletedList._2))
    }
    val documentoDepartamentos = departamentoRows.toList match {
      case (k: String, item: JsValue) :: t => preprocessDepartamentosParam(item, C.DEPARTAMENTO_CLIENTE)
      case _ => Map(C.DEPARTAMENTO_CLIENTE -> JsArray(List()))
    }

    // contactos
    //
    val contactosInfo = getJsValueAsMap(Global.getParamsJsonRequestFor(C.CONTACTO, params))
    val contactoRows = Global.getParamsJsonRequestFor(C.ITEMS, contactosInfo)
    val contactoDeleted: Map[String, JsValue] = Global.getParamsJsonRequestFor(C.DELETED_LIST, contactosInfo).toList match {
      case Nil => Map(C.CLIENTE_CONTACTO_DELETED -> Json.toJson(""))
      case deletedList :: t => Map(C.CLIENTE_CONTACTO_DELETED -> Json.toJson(deletedList._2))
    }
    val documentoContactos = contactoRows.toList match {
      case (k: String, item: JsValue) :: t => preprocessContactosParam(item, C.CONTACTO)
      case _ => Map(C.CONTACTO -> JsArray(List()))
    }

    // informes
    //
    val informesInfo = getJsValueAsMap(Global.getParamsJsonRequestFor(C.INFORME, params))
    val informeRows = Global.getParamsJsonRequestFor(C.ITEMS, informesInfo)
    val informeDeleted: Map[String, JsValue] = Global.getParamsJsonRequestFor(C.DELETED_LIST, informesInfo).toList match {
      case Nil => Map(C.CLIENTE_INFORME_DELETED -> Json.toJson(""))
      case deletedList :: t => Map(C.CLIENTE_INFORME_DELETED -> Json.toJson(deletedList._2))
    }
    val documentoInformes = informeRows.toList match {
      case (k: String, item: JsValue) :: t => preprocessInformesParam(item, C.INFORME)
      case _ => Map(C.INFORME -> JsArray(List()))
    }

    val documentoItems = Map(C.CLIENTE_ITEMS -> JsObject((
      documentoEmpresas
        ++ documentoPercepciones ++ percepcionDeleted ++ documentoDepartamentos ++ departamentoDeleted
        ++ documentoSucursals ++ sucursalDeleted ++ documentoCuentasGrupo ++ cuentaGrupoDeleted
        ++ documentoContactos ++ contactoDeleted ++ documentoInformes ++ informeDeleted).toSeq
    ))

    JsObject(
      (documentoId ++ documentoBaseGroup ++ documentoAddressGroup ++ documentoReferencesGroup
        ++ documentoItems).toSeq)
  }
  //
  //
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  def getSucursales(sucursales: List[DocumentoSucursalData]): List[DocumentoSucursal] = {
    sucursales.map(sucursal => {
      DocumentoSucursal(
        sucursal.id,
        sucursal.code,
        sucursal.name,
        sucursal.descrip,
        sucursal.contacto,
        sucursal.calle,
        sucursal.calleNumero,
        sucursal.piso,
        sucursal.depto,
        sucursal.codPostal,
        sucursal.localidad,
        sucursal.tel,
        sucursal.fax,
        sucursal.email,
        sucursal.paId,
        sucursal.proId,
        sucursal.zonId
      )
    })
  }

  def getEmpresas(empresas: List[DocumentoEmpresaData]): List[DocumentoEmpresa] = {
    empresas.map(empresa => {
      DocumentoEmpresa(
        DBHelper.NoId,
        empresa.empId
      )
    })
  }

  def getCuentasGrupo(cuentasGrupo: List[DocumentoCuentaGrupoData]): List[DocumentoCuentaGrupo] = {
    cuentasGrupo.map(cuentaGrupo => {
      DocumentoCuentaGrupo(
        cuentaGrupo.id,
        cuentaGrupo.cuegId,
        cuentaGrupo.cueId
      )
    })
  }

  def getPercepciones(percepciones: List[DocumentoPercepcionData]): List[DocumentoPercepcion] = {
    percepciones.map(percepcion => {
      DocumentoPercepcion(
        percepcion.id,
        percepcion.percId,
        DateFormatter.parse(percepcion.desde),
        DateFormatter.parse(percepcion.hasta)
      )
    })
  }

  def getDepartamentos(departamentos: List[DocumentoDepartamentoData]): List[DocumentoDepartamento] = {
    departamentos.map(departamento => {
      DocumentoDepartamento(
        departamento.id,
        departamento.dptoId
      )
    })
  }

  def getContactos(contactos: List[DocumentoContactoData]): List[DocumentoContacto] = {
    contactos.map(contacto => {
      DocumentoContacto(
        contacto.id,
        contacto.code,
        contacto.name,
        contacto.descrip,
        contacto.tel,
        contacto.mobile,
        contacto.email,
        contacto.cargo,
        contacto.address,
        contacto.active
      )
    })
  }

  def getInformes(informes: List[DocumentoInformeData]): List[DocumentoInforme] = {
    informes.map(informe => {
      DocumentoInforme(
        informe.preId
      )
    })
  }

  def getDocumentoItems(documento: DocumentoData): DocumentoItems = {
    DocumentoItems(
      getSucursales(documento.items.sucursales),
      getEmpresas(documento.items.empresas),
      getCuentasGrupo(documento.items.cuentasGrupo),
      getPercepciones(documento.items.percepciones),
      getDepartamentos(documento.items.firmas),
      getContactos(documento.items.contactos),
      getInformes(documento.items.informes),
      List(),
      documento.items.sucursalDeleted,
      documento.items.cuentaGrupoDeleted,
      documento.items.percepcionDeleted,
      documento.items.departamentoDeleted,
      documento.items.contactoDeleted,
      documento.items.informeDeleted
    )
  }

  def getDocumento(documento: DocumentoData, id: Int): Documento = {
    Documento(
      id,
      documento.active,
      documento.code,
      DocumentoBase(
        documento.base.name,
        documento.base.razonSocial,
        documento.base.esProspecto,
        documento.base.catFiscal,
        documento.base.cuit,
        documento.base.ingresosBrutos,
        documento.base.contacto,
        documento.base.chequeOrden,
        documento.base.exigeTransporte,
        documento.base.exigeProvincia,
        documento.base.pciaTransporte,
        documento.base.creditoCtaCte,
        documento.base.creditoTotal,
        documento.base.creditoActivo,
        documento.base.descrip),
      DocumentoAddress(
        documento.address.calle,
        documento.address.calleNumero,
        documento.address.piso,
        documento.address.depto,
        documento.address.codPostal,
        documento.address.localidad,
        documento.address.tel,
        documento.address.fax,
        documento.address.email,
        documento.address.web,
        documento.address.messenger,
        documento.address.yahoo,
        DateFormatter.parse(documento.address.horarioMDesde),
        DateFormatter.parse(documento.address.horarioMHasta),
        DateFormatter.parse(documento.address.horarioTDesde),
        DateFormatter.parse(documento.address.horarioTHasta)),
      DocumentoReferences(
        documento.references.cliIdPadre,
        documento.references.cpaId,
        documento.references.lpId,
        documento.references.ldId,
        documento.references.cpgId,
        documento.references.proId,
        documento.references.zonId,
        documento.references.fpId,
        documento.references.venId,
        documento.references.transId,
        documento.references.clictId,
        documento.references.cliIdReferido,
        documento.references.proyId,
        documento.references.webUsName,
        documento.references.webUserActive),
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
        LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.EDIT_CLIENTE), { user =>
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
        LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.NEW_CLIENTE), { user =>
          Ok(
            Json.toJson(
              Documento.create(user,
                getDocumento(documento, DBHelper.NoId)
              )
            )
          )
        })
      }
    )
  }

  def delete(id: Int) = PostAction { implicit request =>
    Logger.debug("in Documentos.delete")
    LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.DELETE_CLIENTE), { user =>
      Documento.delete(user, id)
      // Backbonejs requires at least an empty json object in the response
      // if not it will call errorHandler even when we responded with 200 OK :P
      Ok(JsonUtil.emptyJson)
    })
  }

}