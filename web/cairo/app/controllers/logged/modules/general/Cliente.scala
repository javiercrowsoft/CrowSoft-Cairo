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

case class ClienteBaseData(
                            name: String,
                            razonSocial: String,
                            esProspecto: Boolean,
                            catFiscal: Int,
                            cuit: String,
                            ingresosBrutos: String,
                            contacto: String,
                            chequeOrden: String,
                            exigeTransporte: Boolean,
                            exigeProvincia: Boolean,
                            pciaTransporte: Boolean,
                            creditoCtaCte: Double,
                            creditoTotal: Double,
                            creditoActivo: Boolean,
                            descrip: String
                            )

case class ClienteAddressData(
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
                               messenger: String,
                               yahoo: String,
                               horarioMDesde: String,
                               horarioMHasta: String,
                               horarioTDesde: String,
                               horarioTHasta: String
                               )

case class ClienteReferencesData(
                                  cliIdPadre: Int,
                                  cpaId: Int,
                                  lpId: Int,
                                  ldId: Int,
                                  cpgId: Int,
                                  proId: Int,
                                  zonId: Int,
                                  fpId: Int,
                                  venId: Int,
                                  transId: Int,
                                  clictId: Int,
                                  cliIdReferido: Int,
                                  proyId: Int,
                                  webUsName: String,
                                  webUserActive: Boolean
                                  )

case class ClienteContactoData(
                             id: Int,
                             code: String,
                             name: String,
                             descrip: String,
                             tel: String,
                             mobile: String,
                             email: String,
                             cargo: String,
                             address: String,
                             active: Boolean
                             )

case class ClienteEmpresaData(
                               empId: Int
                               )

case class ClienteCuentaGrupoData(
                                     id: Int,
                                     cuegId: Int,
                                     cueId: Int
                                     )

case class ClientePercepcionData(
                                   id: Int,
                                   percId: Int,
                                   desde: String,
                                   hasta: String
                                   )

case class ClienteDepartamentoData(
                                      id: Int,
                                      dptoId: Int
                                      )

case class ClienteSucursalData(
                                   id: Int,
                                   code: String,
                                   name: String,
                                   descrip: String,
                                   contacto: String,
                                   calle: String,
                                   calleNumero: String,
                                   piso: String,
                                   depto: String,
                                   codPostal: String,
                                   localidad: String,
                                   tel: String,
                                   fax: String,
                                   email: String,
                                   paId: Int,
                                   proId: Int,
                                   zonId: Int
                                   )

case class ClienteInformeData(
                              preId: Int
                             )

case class ClienteItemsData (
                              sucursales: List[ClienteSucursalData],
                              empresas: List[ClienteEmpresaData],
                              cuentasGrupo: List[ClienteCuentaGrupoData],
                              percepciones: List[ClientePercepcionData],
                              dptos: List[ClienteDepartamentoData],
                              contactos: List[ClienteContactoData],
                              informes: List[ClienteInformeData],

                              /* only used in save */
                              sucursalDeleted: String,
                              cuentaGrupoDeleted: String,
                              percepcionDeleted: String,
                              departamentoDeleted: String,
                              contactoDeleted: String,
                              informeDeleted: String
                              )

case class ClienteData(
                        id: Option[Int],
                        active: Boolean,
                        code: String,

                        base: ClienteBaseData,
                        address: ClienteAddressData,
                        references: ClienteReferencesData,

                        items: ClienteItemsData
                        )


object Clientes extends Controller with ProvidesUser {

  val clienteBaseFields = List(C.CLI_NAME, C.CLI_RAZONSOCIAL, C.CLI_ES_PROSPECTO, C.CLI_CATFISCAL, C.CLI_CUIT,
    C.CLI_INGRESOSBRUTOS, C.CLI_CONTACTO, C.CLI_CHEQUEORDEN, C.CLI_EXIGE_TRANSPORTE,
    C.CLI_EXIGE_PROVINCIA, C.CLI_PCIA_TRANSPORTE, C.CLI_CREDITOCTACTE, C.CLI_CREDITOTOTAL, C.CLI_CREDITOACTIVO,
    C.CLI_DESCRIP)

  val clienteAddressFields = List(C.CLI_CALLE, C.CLI_CALLENUMERO, C.CLI_PISO, C.CLI_DEPTO, C.CLI_CODPOSTAL,
    C.CLI_LOCALIDAD, C.CLI_TEL, C.CLI_FAX, C.CLI_EMAIL, C.CLI_WEB, C.CLI_MESSENGER, C.CLI_YAHOO,
    C.CLI_HORARIO_MDESDE, C.CLI_HORARIO_MHASTA, C.CLI_HORARIO_TDESDE, C.CLI_HORARIO_THASTA)

  val clienteReferencesFields = List(C.CLI_ID_PADRE, C.CPA_ID, C.LP_ID, C.LD_ID, C.CPG_ID, C.PRO_ID, C.ZON_ID, C.FP_ID, C.VEN_ID,
    C.TRANS_ID, C.CLICT_ID, C.CLI_ID_REFERIDO, C.PROY_ID, C.CLI_INF_US_ID, C.CLI_INF_ACTIVE)

  val clienteContacto = List(C.CONT_ID, C.CONT_NAME, C.CONT_CODE, C.CONT_DESCRIP, C.CONT_DIRECCION, C.CONT_TEL,
    C.CONT_CELULAR, C.CONT_CARGO, C.CONT_EMAIL, DBHelper.ACTIVE)

  val clienteSucursal = List(C.CLIS_ID, C.CLIS_NAME, C.CLIS_CODE, C.CLIS_DESCRIP, C.CLIS_CALLE, C.CLIS_CALLE_NUMERO,
    C.CLIS_PISO, C.CLIS_DEPTO, C.CLIS_COD_POSTAL, C.CLIS_LOCALIDAD, C.CLIS_TEL, C.CLIS_FAX, C.CLIS_EMAIL, C.PA_ID,
    C.PRO_ID, C.ZON_ID)

  val clienteEmpresa = List(C.EMP_CLI_ID, C.EMP_ID)

  val clienteCuentaGrupo = List(C.CLI_CUEG_ID, C.CUEG_ID, C.CUE_ID)

  val clientePercepcion = List(C.CLI_PERC_ID, C.PERC_ID, C.CLI_PERC_DESDE, C.CLI_PERC_HASTA)

  val clienteDepartamento = List(C.DPTO_CLI_ID, C.DPTO_ID)

  val clienteInforme = List(C.PRE_ID)

  val clienteForm = Form(
    mapping(
      "id" -> optional(number),
      DBHelper.ACTIVE -> boolean,
      C.CLI_CODE -> text,
      C.CLIENTE_BASE -> mapping(
        C.CLI_NAME -> nonEmptyText,
        C.CLI_RAZONSOCIAL -> text,
        C.CLI_ES_PROSPECTO -> boolean,
        C.CLI_CATFISCAL -> number,
        C.CLI_CUIT -> text,
        C.CLI_INGRESOSBRUTOS -> text,
        C.CLI_CONTACTO -> text,
        C.CLI_CHEQUEORDEN -> text,
        C.CLI_EXIGE_TRANSPORTE -> boolean,
        C.CLI_EXIGE_PROVINCIA -> boolean,
        C.CLI_PCIA_TRANSPORTE -> boolean,
        C.CLI_CREDITOCTACTE -> of(Global.doubleFormat),
        C.CLI_CREDITOTOTAL -> of(Global.doubleFormat),
        C.CLI_CREDITOACTIVO -> boolean,
        C.CLI_DESCRIP -> text)(ClienteBaseData.apply)(ClienteBaseData.unapply),
      C.CLIENTE_ADDRESS -> mapping(
        C.CLI_CALLE -> text,
        C.CLI_CALLENUMERO -> text,
        C.CLI_PISO -> text,
        C.CLI_DEPTO -> text,
        C.CLI_CODPOSTAL -> text,
        C.CLI_LOCALIDAD -> text,
        C.CLI_TEL -> text,
        C.CLI_FAX -> text,
        C.CLI_EMAIL -> text,
        C.CLI_WEB -> text,
        C.CLI_MESSENGER -> text,
        C.CLI_YAHOO -> text,
        C.CLI_HORARIO_MDESDE -> text,
        C.CLI_HORARIO_MHASTA -> text,
        C.CLI_HORARIO_TDESDE -> text,
        C.CLI_HORARIO_THASTA -> text)(ClienteAddressData.apply)(ClienteAddressData.unapply),
      C.CLIENTE_REFERENCES -> mapping(
        C.CLI_ID_PADRE -> number,
        C.CPA_ID -> number,
        C.LP_ID -> number,
        C.LD_ID -> number,
        C.CPG_ID -> number,
        C.PRO_ID -> number,
        C.ZON_ID -> number,
        C.FP_ID -> number,
        C.VEN_ID -> number,
        C.TRANS_ID -> number,
        C.CLICT_ID -> number,
        C.CLI_ID_REFERIDO -> number,
        C.PROY_ID -> number,
        C.CLI_INF_US_ID -> text,
        C.CLI_INF_ACTIVE -> boolean)(ClienteReferencesData.apply)(ClienteReferencesData.unapply),
      C.CLIENTE_ITEMS -> mapping(
        C.CLIENTE_SUCURSAL -> Forms.list[ClienteSucursalData](
          mapping (
            C.CLIS_ID -> number,
            C.CLIS_CODE -> text,
            C.CLIS_NAME -> text,
            C.CLIS_DESCRIP -> text,
            C.CLIS_CONTACTO -> text,
            C.CLIS_CALLE -> text,
            C.CLIS_CALLE_NUMERO -> text,
            C.CLIS_PISO -> text,
            C.CLIS_DEPTO -> text,
            C.CLIS_COD_POSTAL -> text,
            C.CLIS_LOCALIDAD -> text,
            C.CLIS_TEL -> text,
            C.CLIS_FAX -> text,
            C.CLIS_EMAIL -> text,
            C.PA_ID -> number,
            C.PRO_ID -> number,
            C.ZON_ID -> number)(ClienteSucursalData.apply)(ClienteSucursalData.unapply)
        ),
        C.EMPRESA_CLIENTE -> Forms.list[ClienteEmpresaData](
          mapping (C.EMP_ID -> number)(ClienteEmpresaData.apply)(ClienteEmpresaData.unapply)
        ),
        C.CLIENTE_CUENTA_GRUPO -> Forms.list[ClienteCuentaGrupoData](
          mapping (
            C.CLI_CUEG_ID -> number,
            C.CUEG_ID -> number,
            C.CUE_ID -> number)(ClienteCuentaGrupoData.apply)(ClienteCuentaGrupoData.unapply)
        ),
        C.CLIENTE_PERCEPCION -> Forms.list[ClientePercepcionData](
          mapping (
            C.CLI_PERC_ID -> number,
            C.PERC_ID -> number,
            C.CLI_PERC_DESDE -> text,
            C.CLI_PERC_HASTA -> text)(ClientePercepcionData.apply)(ClientePercepcionData.unapply)
        ),
        C.DEPARTAMENTO_CLIENTE -> Forms.list[ClienteDepartamentoData](
          mapping (
            C.DPTO_CLI_ID -> number,
            C.DPTO_ID -> number)(ClienteDepartamentoData.apply)(ClienteDepartamentoData.unapply)
        ),
        C.CONTACTO -> Forms.list[ClienteContactoData](
          mapping (
            C.CONT_ID -> number,
            C.CONT_CODE -> text,
            C.CONT_NAME -> text,
            C.CONT_DESCRIP -> text,
            C.CONT_TEL -> text,
            C.CONT_CELULAR -> text,
            C.CONT_EMAIL -> text,
            C.CONT_CARGO -> text,
            C.CONT_DIRECCION -> text,
            DBHelper.ACTIVE -> boolean)(ClienteContactoData.apply)(ClienteContactoData.unapply)
        ),
        C.INFORME -> Forms.list[ClienteInformeData](
          mapping (
            C.PRE_ID -> number)(ClienteInformeData.apply)(ClienteInformeData.unapply)
        ),
        C.CLIENTE_SUCURSAL_DELETED -> text,
        C.CLIENTE_CUENTA_GRUPO_DELETED -> text,
        C.CLIENTE_PERCEPCIONES_DELETED -> text,
        C.CLIENTE_DEPARTAMENTO_DELETED -> text,
        C.CLIENTE_CONTACTO_DELETED -> text,
        C.CLIENTE_INFORME_DELETED -> text
      )(ClienteItemsData.apply)(ClienteItemsData.unapply)
    )(ClienteData.apply)(ClienteData.unapply))

  implicit val clienteWrites = new Writes[Cliente] {
    def writes(cliente: Cliente) = Json.obj(
      "id" -> Json.toJson(cliente.id),
      C.CLI_ID -> Json.toJson(cliente.id),
      DBHelper.ACTIVE -> Json.toJson(cliente.active),
      C.CLI_CODE -> Json.toJson(cliente.code),

      C.CLI_NAME -> Json.toJson(cliente.base.name),
      C.CLI_RAZONSOCIAL -> Json.toJson(cliente.base.razonSocial),
      C.CLI_ES_PROSPECTO -> Json.toJson(cliente.base.esProspecto),
      C.CLI_CATFISCAL -> Json.toJson(cliente.base.catFiscal),
      C.CLI_CUIT -> Json.toJson(cliente.base.cuit),
      C.CLI_INGRESOSBRUTOS -> Json.toJson(cliente.base.ingresosBrutos),
      C.CLI_CONTACTO -> Json.toJson(cliente.base.contacto),
      C.CLI_CHEQUEORDEN -> Json.toJson(cliente.base.chequeOrden),
      C.CLI_EXIGE_TRANSPORTE -> Json.toJson(cliente.base.exigeTransporte),
      C.CLI_EXIGE_PROVINCIA -> Json.toJson(cliente.base.exigeProvincia),
      C.CLI_PCIA_TRANSPORTE -> Json.toJson(cliente.base.pciaTransporte),
      C.CLI_CREDITOCTACTE -> Json.toJson(cliente.base.creditoCtaCte),
      C.CLI_CREDITOTOTAL -> Json.toJson(cliente.base.creditoTotal),
      C.CLI_CREDITOACTIVO -> Json.toJson(cliente.base.creditoActivo),
      C.CLI_DESCRIP -> Json.toJson(cliente.base.descrip),

      C.CLI_CALLE -> Json.toJson(cliente.address.calle),
      C.CLI_CALLENUMERO -> Json.toJson(cliente.address.calleNumero),
      C.CLI_PISO -> Json.toJson(cliente.address.piso),
      C.CLI_DEPTO -> Json.toJson(cliente.address.depto),
      C.CLI_CODPOSTAL -> Json.toJson(cliente.address.codPostal),
      C.CLI_LOCALIDAD -> Json.toJson(cliente.address.localidad),
      C.CLI_HORARIO_MDESDE -> Json.toJson(cliente.address.horarioMDesde),
      C.CLI_HORARIO_MHASTA -> Json.toJson(cliente.address.horarioMHasta),
      C.CLI_HORARIO_TDESDE -> Json.toJson(cliente.address.horarioTDesde),
      C.CLI_HORARIO_THASTA -> Json.toJson(cliente.address.horarioTHasta),
      C.CLI_TEL -> Json.toJson(cliente.address.tel),
      C.CLI_FAX -> Json.toJson(cliente.address.fax),
      C.CLI_EMAIL -> Json.toJson(cliente.address.email),
      C.CLI_WEB -> Json.toJson(cliente.address.web),
      C.CLI_MESSENGER -> Json.toJson(cliente.address.messenger),
      C.CLI_YAHOO -> Json.toJson(cliente.address.yahoo),

      C.CLI_ID_PADRE -> Json.toJson(cliente.references.cliIdPadre),
      C.CLI_NOMBRE_PADRE -> Json.toJson(cliente.references.padre),
      C.CPA_ID -> Json.toJson(cliente.references.address.cpaId),
      C.CPA_CODE -> Json.toJson(cliente.references.address.cpaCode),
      C.LP_ID -> Json.toJson(cliente.references.priceLists.lpId),
      C.LP_NAME -> Json.toJson(cliente.references.priceLists.lpName),
      C.LD_ID -> Json.toJson(cliente.references.priceLists.ldId),
      C.LD_NAME -> Json.toJson(cliente.references.priceLists.ldName),
      C.CPG_ID -> Json.toJson(cliente.references.cpgId),
      C.CPG_NAME -> Json.toJson(cliente.references.cpgName),
      C.PRO_ID -> Json.toJson(cliente.references.address.proId),
      C.PRO_NAME -> Json.toJson(cliente.references.address.proName),
      C.ZON_ID -> Json.toJson(cliente.references.address.zonId),
      C.ZON_NAME -> Json.toJson(cliente.references.address.zonName),
      C.FP_ID -> Json.toJson(cliente.references.fpId),
      C.FP_NAME -> Json.toJson(cliente.references.fpName),
      C.VEN_ID -> Json.toJson(cliente.references.venId),
      C.VEN_NAME -> Json.toJson(cliente.references.venName),
      C.TRANS_ID -> Json.toJson(cliente.references.address.transId),
      C.TRANS_NAME -> Json.toJson(cliente.references.address.transName),
      C.CLICT_ID -> Json.toJson(cliente.references.clictId),
      C.CLICT_NAME -> Json.toJson(cliente.references.clictName),
      C.CLI_ID_REFERIDO -> Json.toJson(cliente.references.cliIdReferido),
      C.REFERIDO -> Json.toJson(cliente.references.referido),
      C.PROY_ID -> Json.toJson(cliente.references.proyId),
      C.PROY_NAME -> Json.toJson(cliente.references.proyName),

    // TODO: implement this
      C.CLI_INF_US_ID -> Json.toJson(cliente.references.webUser.usId),
      C.US_NAME -> Json.toJson(cliente.references.webUser.name),
      C.CLI_INF_ACTIVE -> Json.toJson(cliente.references.webUser.active),

      // Items
      "sucursales" -> Json.toJson(writeClienteSucursal(cliente.items.sucursales)),
      "empresas" -> Json.toJson(writeClienteEmpresas(cliente.items.empresas)),
      "cuentasGrupo" -> Json.toJson(writeClienteCuentasGrupo(cliente.items.cuentasGrupo)),
      "percepciones" -> Json.toJson(writeClientePercepciones(cliente.items.percepciones)),
      "dptos" -> Json.toJson(writeClienteDptos(cliente.items.dptos)),
      "contactos" -> Json.toJson(writeClienteContactos(cliente.items.contactos)),
      "informes" -> Json.toJson(writeClienteInformes(cliente.items.informes)),
      "additionalFields" -> Json.toJson(additionalFieldsWrites)
    )
    def additionalFieldsWrites() = Json.obj(
      "fields" -> Json.toJson(writeEmptyCols(List())),
      "values" -> Json.toJson(writeEmptyCols(List()))
    )
    def itemWrites(item: Any) = Json.obj(
      "dummy" -> Json.toJson("")
    )
    def clienteSucursalWrite(p: ClienteSucursal) = Json.obj(
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
    def clienteEmpresaWrite(p: ClienteEmpresa) = Json.obj(
      C.EMP_CLI_ID -> Json.toJson(p.id),
      C.EMP_ID -> Json.toJson(p.empId),
      C.EMP_NAME -> Json.toJson(p.empName)
    )
    def clienteCuentaGrupoWrite(p: ClienteCuentaGrupo) = Json.obj(
      C.CLI_CUEG_ID -> Json.toJson(p.id),
      C.CUEG_ID -> Json.toJson(p.cuegId),
      C.CUEG_NAME -> Json.toJson(p.cuegName),
      C.CUE_ID -> Json.toJson(p.cueId),
      C.CUE_NAME -> Json.toJson(p.cueName)
    )
    def clientePercepcionWrite(p: ClientePercepcion) = Json.obj(
      C.CLI_PERC_ID -> Json.toJson(p.id),
      C.PERC_ID -> Json.toJson(p.percId),
      C.PERC_NAME -> Json.toJson(p.percName),
      C.CLI_PERC_DESDE -> Json.toJson(p.desde),
      C.CLI_PERC_HASTA -> Json.toJson(p.hasta)
    )
    def clienteDptoWrite(p: ClienteDepartamento) = Json.obj(
      C.DPTO_CLI_ID -> Json.toJson(p.id),
      C.DPTO_ID -> Json.toJson(p.dptoId),
      C.DPTO_NAME -> Json.toJson(p.dptoName)
    )
    def clienteContactoWrite(p: ClienteContacto) = Json.obj(
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
    def clienteInformeWrite(p: ClienteInforme) = Json.obj(
      C.PER_ID -> Json.toJson(p.perId),
      C.INF_ID -> Json.toJson(p.infId),
      C.INF_CODE -> Json.toJson(p.infCode),
      C.INF_NAME -> Json.toJson(p.infName),
      C.PRE_ID -> Json.toJson(p.preId)
    )
    def writeEmptyCols(items: List[Any]) = items.map(item => itemWrites(item))
    def writeClienteSucursal(items: List[ClienteSucursal]) = items.map(item => clienteSucursalWrite(item))
    def writeClienteEmpresas(items: List[ClienteEmpresa]) = items.map(item => clienteEmpresaWrite(item))
    def writeClienteCuentasGrupo(items: List[ClienteCuentaGrupo]) = items.map(item => clienteCuentaGrupoWrite(item))
    def writeClientePercepciones(items: List[ClientePercepcion]) = items.map(item => clientePercepcionWrite(item))
    def writeClienteDptos(items: List[ClienteDepartamento]) = items.map(item => clienteDptoWrite(item))
    def writeClienteContactos(items: List[ClienteContacto]) = items.map(item => clienteContactoWrite(item))
    def writeClienteInformes(items: List[ClienteInforme]) = items.map(item => clienteInformeWrite(item))
  }

  def get(id: Int) = GetAction { implicit request =>
    LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.LIST_CLIENTE), { user =>
      Ok(Json.toJson(Cliente.get(user, id)))
    })
  }

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //
  // this functions convert the plain JSON received in CREATE and UPDATE into a ClienteData structure
  //
  // because the limitation to 18 fields in case class used for FORM mapping we have grouped the fields
  // in Cliente/Data, ClienteItem/Data, etc
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
      JsObject(Global.preprocessFormParams(clienteSucursal, "", params).toSeq)
    }

    def preprocessEmpresaParam(field: JsValue) = {
      val params = field.as[Map[String, JsValue]]
      JsObject(Global.preprocessFormParams(clienteEmpresa, "", params).toSeq)
    }

    def preprocessCuentaGrupoParam(field: JsValue) = {
      val params = field.as[Map[String, JsValue]]
      JsObject(Global.preprocessFormParams(clienteCuentaGrupo, "", params).toSeq)
    }

    def preprocessPercepcionParam(field: JsValue) = {
      val params = field.as[Map[String, JsValue]]
      JsObject(Global.preprocessFormParams(clientePercepcion, "", params).toSeq)
    }

    def preprocessDepartamentoParam(field: JsValue) = {
      val params = field.as[Map[String, JsValue]]
      JsObject(Global.preprocessFormParams(clienteDepartamento, "", params).toSeq)
    }

    def preprocessContactoParam(field: JsValue) = {
      val params = field.as[Map[String, JsValue]]
      JsObject(Global.preprocessFormParams(clienteContacto, "", params).toSeq)
    }

    def preprocessInformeParam(field: JsValue) = {
      val params = field.as[Map[String, JsValue]]
      JsObject(Global.preprocessFormParams(clienteInforme, "", params).toSeq)
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

    // groups for ClienteData
    //
    val clienteId = Global.preprocessFormParams(List("id", DBHelper.ACTIVE, C.CLI_CODE), "", params)
    val clienteBaseGroup = Global.preprocessFormParams(clienteBaseFields, C.CLIENTE_BASE, params)
    val clienteAddressGroup = Global.preprocessFormParams(clienteAddressFields, C.CLIENTE_ADDRESS, params)
    val clienteReferencesGroup = Global.preprocessFormParams(clienteReferencesFields, C.CLIENTE_REFERENCES, params)

    // sucursales
    //
    val sucursalesInfo = getJsValueAsMap(Global.getParamsJsonRequestFor(C.CLIENTE_SUCURSAL, params))
    val sucursalRows = Global.getParamsJsonRequestFor(C.ITEMS, sucursalesInfo)
    val sucursalDeleted: Map[String, JsValue] = Global.getParamsJsonRequestFor(C.DELETED_LIST, sucursalesInfo).toList match {
      case Nil => Map(C.CLIENTE_SUCURSAL_DELETED -> Json.toJson(""))
      case deletedList :: t => Map(C.CLIENTE_SUCURSAL_DELETED -> Json.toJson(deletedList._2))
    }
    val clienteSucursals = sucursalRows.toList match {
      case (k: String, item: JsValue) :: t => preprocessSucursalesParam(item, C.CLIENTE_SUCURSAL)
      case _ => Map(C.CLIENTE_SUCURSAL -> JsArray(List()))
    }

    // empresas
    //
    val empresasInfo = getJsValueAsMap(Global.getParamsJsonRequestFor(C.EMPRESA_CLIENTE, params))
    val empresaRows = Global.getParamsJsonRequestFor(C.ITEMS, empresasInfo)
    val clienteEmpresas = empresaRows.toList match {
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
    val clienteCuentasGrupo = cuentaGrupoRows.toList match {
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
    val clientePercepciones = percepcionRows.toList match {
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
    val clienteDepartamentos = departamentoRows.toList match {
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
    val clienteContactos = contactoRows.toList match {
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
    val clienteInformes = informeRows.toList match {
      case (k: String, item: JsValue) :: t => preprocessInformesParam(item, C.INFORME)
      case _ => Map(C.INFORME -> JsArray(List()))
    }

    val clienteItems = Map(C.CLIENTE_ITEMS -> JsObject((
      clienteEmpresas
        ++ clientePercepciones ++ percepcionDeleted ++ clienteDepartamentos ++ departamentoDeleted
        ++ clienteSucursals ++ sucursalDeleted ++ clienteCuentasGrupo ++ cuentaGrupoDeleted
        ++ clienteContactos ++ contactoDeleted ++ clienteInformes ++ informeDeleted).toSeq
    ))

    JsObject(
      (clienteId ++ clienteBaseGroup ++ clienteAddressGroup ++ clienteReferencesGroup
        ++ clienteItems).toSeq)
  }
  //
  //
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  def getSucursales(sucursales: List[ClienteSucursalData]): List[ClienteSucursal] = {
    sucursales.map(sucursal => {
      ClienteSucursal(
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

  def getEmpresas(empresas: List[ClienteEmpresaData]): List[ClienteEmpresa] = {
    empresas.map(empresa => {
      ClienteEmpresa(
        DBHelper.NoId,
        empresa.empId
      )
    })
  }

  def getCuentasGrupo(cuentasGrupo: List[ClienteCuentaGrupoData]): List[ClienteCuentaGrupo] = {
    cuentasGrupo.map(cuentaGrupo => {
      ClienteCuentaGrupo(
        cuentaGrupo.id,
        cuentaGrupo.cuegId,
        cuentaGrupo.cueId
      )
    })
  }

  def getPercepciones(percepciones: List[ClientePercepcionData]): List[ClientePercepcion] = {
    percepciones.map(percepcion => {
      ClientePercepcion(
        percepcion.id,
        percepcion.percId,
        DateFormatter.parse(percepcion.desde),
        DateFormatter.parse(percepcion.hasta)
      )
    })
  }

  def getDepartamentos(departamentos: List[ClienteDepartamentoData]): List[ClienteDepartamento] = {
    departamentos.map(departamento => {
      ClienteDepartamento(
        departamento.id,
        departamento.dptoId
      )
    })
  }

  def getContactos(contactos: List[ClienteContactoData]): List[ClienteContacto] = {
    contactos.map(contacto => {
      ClienteContacto(
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

  def getInformes(informes: List[ClienteInformeData]): List[ClienteInforme] = {
    informes.map(informe => {
      ClienteInforme(
        informe.preId
      )
    })
  }

  def getClienteItems(cliente: ClienteData): ClienteItems = {
    ClienteItems(
      getSucursales(cliente.items.sucursales),
      getEmpresas(cliente.items.empresas),
      getCuentasGrupo(cliente.items.cuentasGrupo),
      getPercepciones(cliente.items.percepciones),
      getDepartamentos(cliente.items.dptos),
      getContactos(cliente.items.contactos),
      getInformes(cliente.items.informes),
      List(),
      cliente.items.sucursalDeleted,
      cliente.items.cuentaGrupoDeleted,
      cliente.items.percepcionDeleted,
      cliente.items.departamentoDeleted,
      cliente.items.contactoDeleted,
      cliente.items.informeDeleted
    )
  }

  def getCliente(cliente: ClienteData, id: Int): Cliente = {
    Cliente(
      id,
      cliente.active,
      cliente.code,
      ClienteBase(
        cliente.base.name,
        cliente.base.razonSocial,
        cliente.base.esProspecto,
        cliente.base.catFiscal,
        cliente.base.cuit,
        cliente.base.ingresosBrutos,
        cliente.base.contacto,
        cliente.base.chequeOrden,
        cliente.base.exigeTransporte,
        cliente.base.exigeProvincia,
        cliente.base.pciaTransporte,
        cliente.base.creditoCtaCte,
        cliente.base.creditoTotal,
        cliente.base.creditoActivo,
        cliente.base.descrip),
      ClienteAddress(
        cliente.address.calle,
        cliente.address.calleNumero,
        cliente.address.piso,
        cliente.address.depto,
        cliente.address.codPostal,
        cliente.address.localidad,
        cliente.address.tel,
        cliente.address.fax,
        cliente.address.email,
        cliente.address.web,
        cliente.address.messenger,
        cliente.address.yahoo,
        DateFormatter.parse(cliente.address.horarioMDesde),
        DateFormatter.parse(cliente.address.horarioMHasta),
        DateFormatter.parse(cliente.address.horarioTDesde),
        DateFormatter.parse(cliente.address.horarioTHasta)),
      ClienteReferences(
        cliente.references.cliIdPadre,
        cliente.references.cpaId,
        cliente.references.lpId,
        cliente.references.ldId,
        cliente.references.cpgId,
        cliente.references.proId,
        cliente.references.zonId,
        cliente.references.fpId,
        cliente.references.venId,
        cliente.references.transId,
        cliente.references.clictId,
        cliente.references.cliIdReferido,
        cliente.references.proyId,
        cliente.references.webUsName,
        cliente.references.webUserActive),
      getClienteItems(cliente)
    )
  }

  def update(id: Int) = PostAction { implicit request =>
    Logger.debug("in Clientes.update")
    clienteForm.bind(preprocessParams).fold(
      formWithErrors => {
        Logger.debug(s"invalid form: ${formWithErrors.toString}")
        BadRequest
      },
      cliente => {
        Logger.debug(s"form: ${cliente.toString}")
        LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.EDIT_CLIENTE), { user =>
          Ok(
            Json.toJson(
              Cliente.update(user,
                getCliente(cliente, id)
              )
            )
          )
        })
      }
    )
  }

  def create = PostAction { implicit request =>
    Logger.debug("in Clientes.create")
    clienteForm.bind(preprocessParams).fold(
      formWithErrors => {
        Logger.debug(s"invalid form: ${formWithErrors.toString}")
        BadRequest
      },
      cliente => {
        Logger.debug(s"form: ${cliente.toString}")
        LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.NEW_CLIENTE), { user =>
          Ok(
            Json.toJson(
              Cliente.create(user,
                getCliente(cliente, DBHelper.NoId)
              )
            )
          )
        })
      }
    )
  }

  def delete(id: Int) = PostAction { implicit request =>
    Logger.debug("in Clientes.delete")
    LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.DELETE_CLIENTE), { user =>
      Cliente.delete(user, id)
      // Backbonejs requires at least an empty json object in the response
      // if not it will call errorHandler even when we responded with 200 OK :P
      Ok(JsonUtil.emptyJson)
    })
  }
  
  def info(id: Int, docId: Int) = GetAction { implicit request =>
    LoggedIntoCompanyResponse.getAction(request, { user =>
      val info = Cliente.info(user, id, docId)
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
      Ok
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

  def getCuitInfo(cuit: String) = GetAction { implicit request =>
    LoggedIntoCompanyResponse.getAction(request, { user =>
      LoggedIntoCompanyResponse.getAction(request, { user =>
        val info = Cliente.getCuitInfo(user, cuit)
        Ok(
          Json.toJson(
            Json.obj(
              C.CLI_ID -> Json.toJson(info.cliId),
              C.CLI_CODE -> Json.toJson(info.code),
              C.CLI_RAZONSOCIAL -> Json.toJson(info.razonSocial)
            )))
      })
    })
  }

  def validateCuit(id: Int) = GetAction { implicit request =>
    LoggedIntoCompanyResponse.getAction(request, { user =>
      LoggedIntoCompanyResponse.getAction(request, { user =>
        val isValid = Cliente.validateCuit(user, id)
        Ok(
          Json.toJson(
            Json.obj(
              C.IS_VALID -> Json.toJson(isValid)
            )))
      })
    })
  }

  def getPercepciones(id: Int, fecha: String) = GetAction { implicit request =>
    LoggedIntoCompanyResponse.getAction(request, { user =>
      Ok(Json.toJson(Recordset.getAsJson(Cliente.getPercepciones(user, id, DateFormatter.parse(fecha)))))
    })
  }

}