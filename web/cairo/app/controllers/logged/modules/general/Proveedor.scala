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
import models.cairo.system.database.{Recordset, DBHelper}
import formatters.json.DateFormatter._

import Global.{getJsValueAsMap, getParamsJsonRequestFor, preprocessFormParams, doubleFormat, getParamsFromJsonRequest}

case class ProveedorBaseData(
                          name: String,
                          razonSocial: String,
                          imprimeTicket: Boolean,
                          contacto: String,
                          catFiscal: Int,
                          cuit: String,
                          ingresosBrutos: String,
                          chequeOrden: String,
                          banco: String,
                          nroCtaBanco: String,
                          cbu: String,
                          nroCliente: String,
                          creditoCtaCte: Double,
                          creditoTotal: Double,
                          creditoActivo: Boolean,
                          descrip: String
                        )

case class ProveedorAddressData(
                                 calle: String,
                                 calleNumero: String,
                                 piso: String,
                                 depto: String,
                                 codPostal: String,
                                 localidad: String,
                                 tel: String,
                                 fax: String,
                                 email: String,
                                 web: String,
                                 horarioMDesde: String,
                                 horarioMHasta: String,
                                 horarioTDesde: String,
                                 horarioTHasta: String
                                 )

case class ProveedorReferencesData(
                                    lpId: Int,
                                    ldId: Int,
                                    cpgId: Int,
                                    proId: Int,
                                    zonId: Int
                                    )

case class ProveedorCaiData(
                         id: Int,
                         numero: String,
                         sucursal: String,
                         fechaVto: String,
                         descrip: String
                         )

case class ProveedorEmpresaData(
                             empId: Int
                             )

case class ProveedorCuentaGrupoData(
                                 id: Int,
                                 cuegId: Int,
                                 cueId: Int
                                 )

case class ProveedorRetencionData(
                               id: Int,
                               retId: Int,
                               desde: String,
                               hasta: String
                               )

case class ProveedorDepartamentoData(
                                  id: Int,
                                  dptoId: Int
                                  )

case class ProveedorCentroCostoData(
                                 id: Int,
                                 ccosId: Int,
                                 prId: Int
                                 )

case class ProveedorData(
                          id: Option[Int],
                          active: Boolean,
                          code: String,

                          base: ProveedorBaseData,
                          address: ProveedorAddressData,
                          references: ProveedorReferencesData,

                          cais: List[ProveedorCaiData],
                          empresas: List[ProveedorEmpresaData],
                          cuentasGrupo: List[ProveedorCuentaGrupoData],
                          retenciones: List[ProveedorRetencionData],
                          dptos: List[ProveedorDepartamentoData],
                          centrosCosto: List[ProveedorCentroCostoData],

                          caiDeleted: String,
                          cuentaGrupoDeleted: String,
                          retencionDeleted: String,
                          departamentoDeleted: String,
                          centroCostoDeleted: String
                          )

object Proveedores extends Controller with ProvidesUser {

  val proveedorBaseFields = List(C.PROV_NAME, C.PROV_RAZONSOCIAL, C.PROV_IMPRIME_TICKET, C.PROV_CONTACTO, 
                                  C.PROV_CATFISCAL, C.PROV_CUIT, C.PROV_INGRESOSBRUTOS, C.PROV_CHEQUEORDEN, 
                                  C.PROV_BANCO, C.PROV_NRO_CTA_BANCO, C.PROV_CBU, C.PROV_NRO_CLIENTE, 
                                  C.PROV_CREDITOCTACTE, C.PROV_CREDITOTOTAL, C.PROV_CREDITOACTIVO, C.PROV_DESCRIP)
  
  val proveedorAddressFields = List(C.PROV_CALLE, C.PROV_CALLENUMERO, C.PROV_PISO, C.PROV_DEPTO, C.PROV_CODPOSTAL,
                                    C.PROV_LOCALIDAD, C.PROV_TEL, C.PROV_FAX, C.PROV_EMAIL, C.PROV_WEB,
                                    C.PROV_HORARIO_MDESDE, C.PROV_HORARIO_MHASTA, C.PROV_HORARIO_TDESDE,
                                    C.PROV_HORARIO_THASTA)
  
  val proveedorReferencesFields = List(C.LP_ID, C.LD_ID, C.CPG_ID, C.PRO_ID, C.ZON_ID)
  
  val proveedorCai = List(C.PROVC_ID, C.PROVC_NUMERO, C.PROVC_SUCURSAL, C.PROVC_FECHA_VTO, C.PROVC_DESCRIP)
  
  val proveedorEmpresa = List(C.EMP_PROV_ID, C.EMP_ID)
  
  val proveedorCuentaGrupo = List(C.PROV_CUEG_ID, C.CUEG_ID, C.CUE_ID)
  
  val proveedorRetencion = List(C.PROV_RET_ID, C.RET_ID, C.PROV_RET_DESDE, C.PROV_RET_HASTA)
  
  val proveedorDepartamento = List(C.DPTO_PROV_ID, C.DPTO_ID)
  
  val proveedorCentroCosto = List(C.PROV_CCOS_ID, C.CCOS_ID, C.PR_ID)
  
  val proveedorForm = Form(
    mapping(
      "id" -> optional(number),
      DBHelper.ACTIVE -> boolean,
      C.PROV_CODE -> text,
      C.PROVEEDOR_BASE -> mapping(
        C.PROV_NAME -> nonEmptyText,
        C.PROV_RAZONSOCIAL -> text,
        C.PROV_IMPRIME_TICKET -> boolean,
        C.PROV_CONTACTO -> text,
        C.PROV_CATFISCAL -> number,
        C.PROV_CUIT -> text,
        C.PROV_INGRESOSBRUTOS -> text,
        C.PROV_CHEQUEORDEN -> text,
        C.PROV_BANCO -> text,
        C.PROV_NRO_CTA_BANCO -> text,
        C.PROV_CBU -> text,
        C.PROV_NRO_CLIENTE -> text,
        C.PROV_CREDITOCTACTE -> of(doubleFormat),
        C.PROV_CREDITOTOTAL -> of(doubleFormat),
        C.PROV_CREDITOACTIVO -> boolean,
        C.PROV_DESCRIP -> text)(ProveedorBaseData.apply)(ProveedorBaseData.unapply),
      C.PROVEEDOR_ADDRESS -> mapping(
        C.PROV_CALLE -> text,
        C.PROV_CALLENUMERO -> text,
        C.PROV_PISO -> text,
        C.PROV_DEPTO -> text,
        C.PROV_CODPOSTAL -> text,
        C.PROV_LOCALIDAD -> text,
        C.PROV_HORARIO_MDESDE -> text,
        C.PROV_HORARIO_MHASTA -> text,
        C.PROV_HORARIO_TDESDE -> text,
        C.PROV_HORARIO_THASTA -> text,
        C.PROV_TEL -> text,
        C.PROV_FAX -> text,
        C.PROV_EMAIL -> text,
        C.PROV_WEB -> text)(ProveedorAddressData.apply)(ProveedorAddressData.unapply),
      C.PROVEEDOR_REFERENCES -> mapping(
        C.LP_ID -> number,
        C.LD_ID -> number,
        C.CPG_ID -> number,
        C.PRO_ID -> number,
        C.ZON_ID -> number)(ProveedorReferencesData.apply)(ProveedorReferencesData.unapply),
      C.PROVEEDOR_CAI -> Forms.list[ProveedorCaiData](
        mapping (
          C.PROVC_ID -> number,
          C.PROVC_NUMERO -> text,
          C.PROVC_SUCURSAL -> text,
          C.PROVC_FECHA_VTO -> text,
          C.PROVC_DESCRIP -> text)(ProveedorCaiData.apply)(ProveedorCaiData.unapply)
      ),
      C.EMPRESA_PROVEEDOR -> Forms.list[ProveedorEmpresaData](
        mapping (C.EMP_ID -> number)(ProveedorEmpresaData.apply)(ProveedorEmpresaData.unapply)
      ),
      C.PROVEEDOR_CUENTA_GRUPO -> Forms.list[ProveedorCuentaGrupoData](
        mapping (
          C.PROV_CUEG_ID -> number,
          C.CUEG_ID -> number,
          C.CUE_ID -> number)(ProveedorCuentaGrupoData.apply)(ProveedorCuentaGrupoData.unapply)
      ),
      C.PROVEEDOR_RETENCION -> Forms.list[ProveedorRetencionData](
        mapping (
          C.PROV_RET_ID -> number,
          C.RET_ID -> number,
          C.PROV_RET_DESDE -> text,
          C.PROV_RET_HASTA -> text)(ProveedorRetencionData.apply)(ProveedorRetencionData.unapply)
      ),
      C.DEPARTAMENTO_PROVEEDOR -> Forms.list[ProveedorDepartamentoData](
        mapping (
          C.DPTO_PROV_ID -> number,
          C.DPTO_ID -> number)(ProveedorDepartamentoData.apply)(ProveedorDepartamentoData.unapply)
      ),
      C.PROVEEDOR_CENTRO_COSTO -> Forms.list[ProveedorCentroCostoData](
        mapping (
          C.PROV_CCOS_ID -> number,
          C.CCOS_ID -> number,
          C.PR_ID -> number)(ProveedorCentroCostoData.apply)(ProveedorCentroCostoData.unapply)
      ),
      C.PROVEEDOR_CAI_DELETED -> text,
      C.PROVEEDOR_CUENTA_GRUPO_DELETED -> text,
      C.PROVEEDOR_RETENCIONES_DELETED -> text,
      C.PROVEEDOR_DEPARTAMENTO_DELETED -> text,
      C.PROVEEDOR_CENTRO_COSTO_DELETED -> text
    )(ProveedorData.apply)(ProveedorData.unapply))

  implicit val proveedorWrites = new Writes[Proveedor] {
    def writes(proveedor: Proveedor) = Json.obj(
      "id" -> Json.toJson(proveedor.id),
      C.PROV_ID -> Json.toJson(proveedor.id),
      DBHelper.ACTIVE -> Json.toJson(proveedor.active),
      C.PROV_CODE -> Json.toJson(proveedor.code),

      C.PROV_NAME -> Json.toJson(proveedor.base.name),
      C.PROV_RAZONSOCIAL -> Json.toJson(proveedor.base.razonSocial),
      C.PROV_IMPRIME_TICKET -> Json.toJson(proveedor.base.imprimeTicket),
      C.PROV_CONTACTO -> Json.toJson(proveedor.base.contacto),
      C.PROV_CATFISCAL -> Json.toJson(proveedor.base.catFiscal),
      C.PROV_CUIT -> Json.toJson(proveedor.base.cuit),
      C.PROV_INGRESOSBRUTOS -> Json.toJson(proveedor.base.ingresosBrutos),
      C.PROV_CHEQUEORDEN -> Json.toJson(proveedor.base.chequeOrden),
      C.PROV_BANCO -> Json.toJson(proveedor.base.banco),
      C.PROV_NRO_CTA_BANCO -> Json.toJson(proveedor.base.nroCtaBanco),
      C.PROV_CBU -> Json.toJson(proveedor.base.cbu),
      C.PROV_NRO_CLIENTE -> Json.toJson(proveedor.base.nroCliente),
      C.PROV_CREDITOCTACTE -> Json.toJson(proveedor.base.creditoCtaCte),
      C.PROV_CREDITOTOTAL -> Json.toJson(proveedor.base.creditoTotal),
      C.PROV_CREDITOACTIVO -> Json.toJson(proveedor.base.creditoActivo),
      C.PROV_DESCRIP -> Json.toJson(proveedor.base.descrip),

      C.PROV_CALLE -> Json.toJson(proveedor.address.calle),
      C.PROV_CALLENUMERO -> Json.toJson(proveedor.address.calleNumero),
      C.PROV_PISO -> Json.toJson(proveedor.address.piso),
      C.PROV_DEPTO -> Json.toJson(proveedor.address.depto),
      C.PROV_CODPOSTAL -> Json.toJson(proveedor.address.codPostal),
      C.PROV_LOCALIDAD -> Json.toJson(proveedor.address.localidad),
      C.PROV_HORARIO_MDESDE -> Json.toJson(proveedor.address.horarioMDesde),
      C.PROV_HORARIO_MHASTA -> Json.toJson(proveedor.address.horarioMHasta),
      C.PROV_HORARIO_TDESDE -> Json.toJson(proveedor.address.horarioTDesde),
      C.PROV_HORARIO_THASTA -> Json.toJson(proveedor.address.horarioTHasta),
      C.PROV_TEL -> Json.toJson(proveedor.address.tel),
      C.PROV_FAX -> Json.toJson(proveedor.address.fax),
      C.PROV_EMAIL -> Json.toJson(proveedor.address.email),
      C.PROV_WEB -> Json.toJson(proveedor.address.web),

      C.LP_ID -> Json.toJson(proveedor.references.lpId),
      C.LP_NAME -> Json.toJson(proveedor.references.lpName),
      C.LD_ID -> Json.toJson(proveedor.references.ldId),
      C.LD_NAME -> Json.toJson(proveedor.references.ldName),
      C.CPG_ID -> Json.toJson(proveedor.references.cpgId),
      C.CPG_NAME -> Json.toJson(proveedor.references.cpgName),
      C.PRO_ID -> Json.toJson(proveedor.references.proId),
      C.PRO_NAME -> Json.toJson(proveedor.references.proName),
      C.ZON_ID -> Json.toJson(proveedor.references.zonId),
      C.ZON_NAME -> Json.toJson(proveedor.references.zonName),

      // Items
      "cais" -> Json.toJson(writeProveedorCai(proveedor.items.cais)),
      "empresas" -> Json.toJson(writeProveedorEmpresas(proveedor.items.empresas)),
      "cuentasGrupo" -> Json.toJson(writeProveedorCuentasGrupo(proveedor.items.cuentasGrupo)),
      "retenciones" -> Json.toJson(writeProveedorRetenciones(proveedor.items.retenciones)),
      "dptos" -> Json.toJson(writeProveedorDptos(proveedor.items.dptos)),
      "centrosCosto" -> Json.toJson(writeProveedorCentrosCosto(proveedor.items.centrosCosto)),
      "additionalFields" -> Json.toJson(additionalFieldsWrites)
    )
    def additionalFieldsWrites() = Json.obj(
      "fields" -> Json.toJson(writeEmptyCols(List())),
      "values" -> Json.toJson(writeEmptyCols(List()))
    )
    def itemWrites(item: Any) = Json.obj(
      "dummy" -> Json.toJson("")
    )
    def proveedorCaiWrite(p: ProveedorCai) = Json.obj(
      C.PROVC_ID -> Json.toJson(p.id),
      C.PROVC_NUMERO -> Json.toJson(p.numero),
      C.PROVC_SUCURSAL -> Json.toJson(p.sucursal),
      C.PROVC_FECHA_VTO -> Json.toJson(p.fechaVto),
      C.PROVC_DESCRIP -> Json.toJson(p.descrip)
    )
    def proveedorEmpresaWrite(p: ProveedorEmpresa) = Json.obj(
      C.EMP_PROV_ID -> Json.toJson(p.id),
      C.EMP_ID -> Json.toJson(p.empId),
      C.EMP_NAME -> Json.toJson(p.empName)
    )
    def proveedorCuentaGrupoWrite(p: ProveedorCuentaGrupo) = Json.obj(
      C.PROV_CUEG_ID -> Json.toJson(p.id),
      C.CUEG_ID -> Json.toJson(p.cuegId),
      C.CUEG_NAME -> Json.toJson(p.cuegName),
      C.CUE_ID -> Json.toJson(p.cueId),
      C.CUE_NAME -> Json.toJson(p.cueName)
    )
    def proveedorRetencionWrite(p: ProveedorRetencion) = Json.obj(
      C.PROV_RET_ID -> Json.toJson(p.id),
      C.RET_ID -> Json.toJson(p.retId),
      C.RET_NAME -> Json.toJson(p.retName),
      C.PROV_RET_DESDE -> Json.toJson(p.desde),
      C.PROV_RET_HASTA -> Json.toJson(p.hasta)
    )
    def proveedorDptoWrite(p: ProveedorDepartamento) = Json.obj(
      C.DPTO_PROV_ID -> Json.toJson(p.id),
      C.DPTO_ID -> Json.toJson(p.dptoId),
      C.DPTO_NAME -> Json.toJson(p.dptoName)
    )
    def proveedorCentroCostoWrite(p: ProveedorCentroCosto) = Json.obj(
      C.PROV_CCOS_ID -> Json.toJson(p.id),
      C.CCOS_ID -> Json.toJson(p.ccosId),
      C.CCOS_NAME -> Json.toJson(p.ccosName),
      C.PR_ID -> Json.toJson(p.prId),
      C.PR_NAME_COMPRA -> Json.toJson(p.prName)
    )
    def writeEmptyCols(items: List[Any]) = items.map(item => itemWrites(item))
    def writeProveedorCai(items: List[ProveedorCai]) = items.map(item => proveedorCaiWrite(item))
    def writeProveedorEmpresas(items: List[ProveedorEmpresa]) = items.map(item => proveedorEmpresaWrite(item))
    def writeProveedorCuentasGrupo(items: List[ProveedorCuentaGrupo]) = items.map(item => proveedorCuentaGrupoWrite(item))
    def writeProveedorRetenciones(items: List[ProveedorRetencion]) = items.map(item => proveedorRetencionWrite(item))
    def writeProveedorDptos(items: List[ProveedorDepartamento]) = items.map(item => proveedorDptoWrite(item))
    def writeProveedorCentrosCosto(items: List[ProveedorCentroCosto]) = items.map(item => proveedorCentroCostoWrite(item))
  }

  def get(id: Int) = GetAction { implicit request =>
    LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.LIST_PROVEEDOR), { user =>
      Ok(Json.toJson(Proveedor.get(user, id)))
    })
  }
  
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //
  // this functions convert the plain JSON received in CREATE and UPDATE into a ProveedorData structure
  //
  // because the limitation to 18 fields in case class used for FORM mapping we have grouped the fields
  // in Proveedor/Data, ProveedorItem/Data, etc
  //
  // the below routines group a flat JSON and in some cases rename the name of the fields or move
  // fields to the parent node in the JSON structure to match the case class
  //

  private def preprocessParams(implicit request:Request[AnyContent]): JsObject = {

    def preprocessCaiParam(field: JsValue) = {
      val params = field.as[Map[String, JsValue]]
      JsObject(preprocessFormParams(proveedorCai, "", params).toSeq)
    }

    def preprocessEmpresaParam(field: JsValue) = {
      val params = field.as[Map[String, JsValue]]
      JsObject(preprocessFormParams(proveedorEmpresa, "", params).toSeq)
    }

    def preprocessCuentaGrupoParam(field: JsValue) = {
      val params = field.as[Map[String, JsValue]]
      JsObject(preprocessFormParams(proveedorCuentaGrupo, "", params).toSeq)
    }

    def preprocessRetencionParam(field: JsValue) = {
      val params = field.as[Map[String, JsValue]]
      JsObject(preprocessFormParams(proveedorRetencion, "", params).toSeq)
    }

    def preprocessDepartamentoParam(field: JsValue) = {
      val params = field.as[Map[String, JsValue]]
      JsObject(preprocessFormParams(proveedorDepartamento, "", params).toSeq)
    }

    def preprocessCentroCostoParam(field: JsValue) = {
      val params = field.as[Map[String, JsValue]]
      JsObject(preprocessFormParams(proveedorCentroCosto, "", params).toSeq)
    }

    def preprocessCaisParam(items: JsValue, group: String): Map[String, JsValue] = items match {
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

    def preprocessRetencionesParam(items: JsValue, group: String): Map[String, JsValue] = items match {
      case JsArray(arr) => Map(group -> JsArray(arr.map(preprocessRetencionParam(_))))
      case _ => Map.empty
    }

    def preprocessDepartamentosParam(items: JsValue, group: String): Map[String, JsValue] = items match {
      case JsArray(arr) => Map(group -> JsArray(arr.map(preprocessDepartamentoParam(_))))
      case _ => Map.empty
    }

    def preprocessCentrosCostoParam(items: JsValue, group: String): Map[String, JsValue] = items match {
      case JsArray(arr) => Map(group -> JsArray(arr.map(preprocessCentroCostoParam(_))))
      case _ => Map.empty
    }
    
    val params = getParamsFromJsonRequest

    // groups for ProveedorData
    //
    val proveedorId = preprocessFormParams(List("id", DBHelper.ACTIVE, C.PROV_CODE), "", params)
    val proveedorBaseGroup = preprocessFormParams(proveedorBaseFields, C.PROVEEDOR_BASE, params)
    val proveedorAddressGroup = preprocessFormParams(proveedorAddressFields, C.PROVEEDOR_ADDRESS, params)
    val proveedorReferencesGroup = preprocessFormParams(proveedorReferencesFields, C.PROVEEDOR_REFERENCES, params)

    // cais
    //
    val caisInfo = getJsValueAsMap(getParamsJsonRequestFor(C.PROVEEDOR_CAI, params))
    val caiRows = getParamsJsonRequestFor(C.ITEMS, caisInfo)
    val caiDeleted: Map[String, JsValue] = getParamsJsonRequestFor(C.DELETED_LIST, caisInfo).toList match {
      case Nil => Map(C.PROVEEDOR_CAI_DELETED -> Json.toJson(""))
      case deletedList :: t => Map(C.PROVEEDOR_CAI_DELETED -> Json.toJson(deletedList._2))
    }
    val proveedorCais = caiRows.toList match {
      case (_: String, item: JsValue) :: _ => preprocessCaisParam(item, C.PROVEEDOR_CAI)
      case _ => Map(C.PROVEEDOR_CAI -> JsArray(List()))
    }

    // empresas
    //
    val empresasInfo = getJsValueAsMap(getParamsJsonRequestFor(C.EMPRESA_PROVEEDOR, params))
    val empresaRows = getParamsJsonRequestFor(C.ITEMS, empresasInfo)
    val proveedorEmpresas = empresaRows.toList match {
      case (_: String, item: JsValue) :: _ => preprocessEmpresasParam(item, C.EMPRESA_PROVEEDOR)
      case _ => Map(C.EMPRESA_PROVEEDOR -> JsArray(List()))
    }
    
    // cuenta grupo
    //
    val cuentasGrupoInfo = getJsValueAsMap(getParamsJsonRequestFor(C.PROVEEDOR_CUENTA_GRUPO, params))
    val cuentaGrupoRows = getParamsJsonRequestFor(C.ITEMS, cuentasGrupoInfo)
    val cuentaGrupoDeleted: Map[String, JsValue] = getParamsJsonRequestFor(C.DELETED_LIST, cuentasGrupoInfo).toList match {
      case Nil => Map(C.PROVEEDOR_CUENTA_GRUPO_DELETED -> Json.toJson(""))
      case deletedList :: t => Map(C.PROVEEDOR_CUENTA_GRUPO_DELETED -> Json.toJson(deletedList._2))
    }
    val proveedorCuentasGrupo = cuentaGrupoRows.toList match {
      case (_: String, item: JsValue) :: _ => preprocessCuentasGrupoParam(item, C.PROVEEDOR_CUENTA_GRUPO)
      case _ => Map(C.PROVEEDOR_CUENTA_GRUPO -> JsArray(List()))
    }

    // retenciones
    //
    val retencionesInfo = getJsValueAsMap(getParamsJsonRequestFor(C.PROVEEDOR_RETENCION, params))
    val retencionRows = getParamsJsonRequestFor(C.ITEMS, retencionesInfo)
    val retencionDeleted: Map[String, JsValue] = getParamsJsonRequestFor(C.DELETED_LIST, retencionesInfo).toList match {
      case Nil => Map(C.PROVEEDOR_RETENCIONES_DELETED -> Json.toJson(""))
      case deletedList :: t => Map(C.PROVEEDOR_RETENCIONES_DELETED -> Json.toJson(deletedList._2))
    }
    val proveedorRetenciones = retencionRows.toList match {
      case (_: String, item: JsValue) :: _ => preprocessRetencionesParam(item, C.PROVEEDOR_RETENCION)
      case _ => Map(C.PROVEEDOR_RETENCION -> JsArray(List()))
    }

    // departamentos
    //
    val departamentosInfo = getJsValueAsMap(getParamsJsonRequestFor(C.DEPARTAMENTO_PROVEEDOR, params))
    val departamentoRows = getParamsJsonRequestFor(C.ITEMS, departamentosInfo)
    val departamentoDeleted: Map[String, JsValue] = getParamsJsonRequestFor(C.DELETED_LIST, departamentosInfo).toList match {
      case Nil => Map(C.PROVEEDOR_DEPARTAMENTO_DELETED -> Json.toJson(""))
      case deletedList :: t => Map(C.PROVEEDOR_DEPARTAMENTO_DELETED -> Json.toJson(deletedList._2))
    }
    val proveedorDepartamentos = departamentoRows.toList match {
      case (_: String, item: JsValue) :: _ => preprocessDepartamentosParam(item, C.DEPARTAMENTO_PROVEEDOR)
      case _ => Map(C.DEPARTAMENTO_PROVEEDOR -> JsArray(List()))
    }

    // centros de costo
    //
    val centrosCostoInfo = getJsValueAsMap(getParamsJsonRequestFor(C.PROVEEDOR_CENTRO_COSTO, params))
    val centroCostoRows = getParamsJsonRequestFor(C.ITEMS, centrosCostoInfo)
    val centroCostoDeleted: Map[String, JsValue] = getParamsJsonRequestFor(C.DELETED_LIST, centrosCostoInfo).toList match {
      case Nil => Map(C.PROVEEDOR_CENTRO_COSTO_DELETED -> Json.toJson(""))
      case deletedList :: t => Map(C.PROVEEDOR_CENTRO_COSTO_DELETED -> Json.toJson(deletedList._2))
    }
    val proveedorCentrosCosto = centroCostoRows.toList match {
      case (_: String, item: JsValue) :: _ => preprocessCentrosCostoParam(item, C.PROVEEDOR_CENTRO_COSTO)
      case _ => Map(C.PROVEEDOR_CENTRO_COSTO -> JsArray(List()))
    }    
    
    JsObject(
      (proveedorId ++ proveedorBaseGroup ++ proveedorAddressGroup ++ proveedorReferencesGroup
        ++ proveedorCais ++ caiDeleted ++ proveedorCuentasGrupo ++ cuentaGrupoDeleted ++ proveedorEmpresas 
        ++ proveedorRetenciones ++ retencionDeleted ++ proveedorDepartamentos ++ departamentoDeleted
        ++ proveedorCentrosCosto ++ centroCostoDeleted).toSeq)
  }
  //
  //
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  def getCais(cais: List[ProveedorCaiData]): List[ProveedorCai] = {
    cais.map(cai => {
      ProveedorCai(
        cai.id,
        cai.numero,
        cai.sucursal,
        DateFormatter.parse(cai.fechaVto),
        cai.descrip
      )
    })
  }

  def getEmpresas(empresas: List[ProveedorEmpresaData]): List[ProveedorEmpresa] = {
    empresas.map(empresa => {
      ProveedorEmpresa(
        DBHelper.NoId,
        empresa.empId
      )
    })
  }

  def getCuentasGrupo(cuentasGrupo: List[ProveedorCuentaGrupoData]): List[ProveedorCuentaGrupo] = {
    cuentasGrupo.map(cuentaGrupo => {
      ProveedorCuentaGrupo(
        cuentaGrupo.id,
        cuentaGrupo.cuegId,
        cuentaGrupo.cueId
      )
    })
  }

  def getRetenciones(retenciones: List[ProveedorRetencionData]): List[ProveedorRetencion] = {
    retenciones.map(retencion => {
      ProveedorRetencion(
        retencion.id,
        retencion.retId,
        DateFormatter.parse(retencion.desde),
        DateFormatter.parse(retencion.hasta)
      )
    })
  }

  def getDepartamentos(departamentos: List[ProveedorDepartamentoData]): List[ProveedorDepartamento] = {
    departamentos.map(departamento => {
      ProveedorDepartamento(
        departamento.id,
        departamento.dptoId
      )
    })
  }

  def getCentrosCosto(centrosCosto: List[ProveedorCentroCostoData]): List[ProveedorCentroCosto] = {
    centrosCosto.map(centroCosto => {
      ProveedorCentroCosto(
        centroCosto.id,
        centroCosto.ccosId,
        centroCosto.prId
      )
    })
  }

  def getProveedorItems(proveedor: ProveedorData): ProveedorItems = {
    ProveedorItems(
      getCais(proveedor.cais),
      getEmpresas(proveedor.empresas),
      getCuentasGrupo(proveedor.cuentasGrupo),
      getRetenciones(proveedor.retenciones),
      getDepartamentos(proveedor.dptos),
      getCentrosCosto(proveedor.centrosCosto),
      List(),
      proveedor.caiDeleted,
      proveedor.cuentaGrupoDeleted,
      proveedor.retencionDeleted,
      proveedor.departamentoDeleted,
      proveedor.centroCostoDeleted
    )
  }

  def getProveedor(proveedor: ProveedorData, id: Int): Proveedor = {
    Proveedor(
      id,
      proveedor.active,
      proveedor.code,
      ProveedorBase(
        proveedor.base.name,
        proveedor.base.razonSocial,
        proveedor.base.imprimeTicket,
        proveedor.base.contacto,
        proveedor.base.catFiscal,
        proveedor.base.cuit,
        proveedor.base.ingresosBrutos,
        proveedor.base.chequeOrden,
        proveedor.base.banco,
        proveedor.base.nroCtaBanco,
        proveedor.base.cbu,
        proveedor.base.nroCliente,
        proveedor.base.creditoCtaCte,
        proveedor.base.creditoTotal,
        proveedor.base.creditoActivo,
        proveedor.base.descrip),
      ProveedorAddress(
        proveedor.address.calle,
        proveedor.address.calleNumero,
        proveedor.address.piso,
        proveedor.address.depto,
        proveedor.address.codPostal,
        proveedor.address.localidad,
        proveedor.address.tel,
        proveedor.address.fax,
        proveedor.address.email,
        proveedor.address.web,
        DateFormatter.parse(proveedor.address.horarioMDesde),
        DateFormatter.parse(proveedor.address.horarioMHasta),
        DateFormatter.parse(proveedor.address.horarioTDesde),
        DateFormatter.parse(proveedor.address.horarioTHasta)),
      ProveedorReferences(
        proveedor.references.lpId,
        proveedor.references.ldId,
        proveedor.references.cpgId,
        proveedor.references.proId,
        proveedor.references.zonId),
      getProveedorItems(proveedor)
    )
  }

  def update(id: Int) = PostAction { implicit request =>
    Logger.debug("in Proveedores.update")
    proveedorForm.bind(preprocessParams).fold(
      formWithErrors => {
        Logger.debug(s"invalid form: ${formWithErrors.toString}")
        BadRequest
      },
      proveedor => {
        Logger.debug(s"form: ${proveedor.toString}")
        LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.EDIT_PROVEEDOR), { user =>
          Ok(
            Json.toJson(
              Proveedor.update(user,
                getProveedor(proveedor, id)
              )
            )
          )
        })
      }
    )
  }

  def create = PostAction { implicit request =>
    Logger.debug("in Proveedores.create")
    proveedorForm.bind(preprocessParams).fold(
      formWithErrors => {
        Logger.debug(s"invalid form: ${formWithErrors.toString}")
        BadRequest
      },
      proveedor => {
        Logger.debug(s"form: ${proveedor.toString}")
        LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.NEW_PROVEEDOR), { user =>
          Ok(
            Json.toJson(
              Proveedor.create(user,
              getProveedor(proveedor, DBHelper.NoId)
              )
            )
          )
        })
      }
    )
  }

  def delete(id: Int) = PostAction { implicit request =>
    Logger.debug("in Proveedores.delete")
    LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.DELETE_PROVEEDOR), { user =>
      Proveedor.delete(user, id)
      // Backbonejs requires at least an empty json object in the response
      // if not it will call errorHandler even when we responded with 200 OK :P
      Ok(JsonUtil.emptyJson)
    })
  }

  def info(id: Int, docId: Int) = GetAction { implicit request =>
    LoggedIntoCompanyResponse.getAction(request, { user =>
      val info = Proveedor.info(user, id, docId)
      Ok(
        Json.toJson(
          Json.obj(
            C.LP_ID -> Json.toJson(info.lpId),
            C.LP_NAME -> Json.toJson(info.lpName),
            C.LD_ID -> Json.toJson(info.ldId),
            C.LD_NAME -> Json.toJson(info.ldName),
            C.CPG_ID -> Json.toJson(info.cpgId),
            C.CPG_NAME -> Json.toJson(info.cpgName),
            C.CPG_ES_LIBRE -> Json.toJson(info.cpgEsLibre),
            C.HAS_IVA_RI -> Json.toJson(info.ivaRi),
            C.HAS_IVA_RNI -> Json.toJson(info.ivaRni)
          )))
    })
  }

  def name(id: Int) = GetAction { implicit request =>
    LoggedIntoCompanyResponse.getAction(request, { user =>
      Ok(
        Json.toJson(
          Json.obj(
            C.PROV_NAME -> Json.toJson(Proveedor.getName(user, id))
          )))
    })
  }

  def email(id: Int) = GetAction { implicit request =>
    LoggedIntoCompanyResponse.getAction(request, { user =>
      Ok(
        Json.toJson(
          Json.obj(
            C.PROV_EMAIL -> Json.toJson(Proveedor.getEmail(user, id))
          )))
    })
  }

  def dataAdd(id: Int) = GetAction { implicit request =>
    LoggedIntoCompanyResponse.getAction(request, { user =>
      Ok
    })
  }

  def catFiscal(id: Int) = GetAction { implicit request =>
    LoggedIntoCompanyResponse.getAction(request, { user =>
      Ok
    })
  }

  def validateCuit(cuit: String) = GetAction { implicit request =>
    LoggedIntoCompanyResponse.getAction(request, { user =>
      LoggedIntoCompanyResponse.getAction(request, { user =>
        val info = Proveedor.validateCuit(user, cuit)
        Ok(
          Json.toJson(
            Json.obj(
              C.PROV_ID -> Json.toJson(info.provId),
              C.PROV_CODE -> Json.toJson(info.code),
              C.PROV_RAZONSOCIAL -> Json.toJson(info.razonSocial)
            )))
      })
    })
  }

  def getRetenciones(provId: Int, fecha: Option[String], pago: Option[Double], facturas: Option[String]) = GetAction { implicit request =>
    LoggedIntoCompanyResponse.getAction(request, { user =>
      Ok(
        Json.toJson(
          Recordset.getAsJson(
            Proveedor.getRetenciones(
              user,
              provId,
              DateFormatter.parse(fecha.getOrElse("")),
              pago.getOrElse(0),
              facturas.getOrElse("")
            ))))
    })
  }
}