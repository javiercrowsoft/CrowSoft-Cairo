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
import models.cairo.system.database.DBHelper
import formatters.json.DateFormatter._

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

case class ProveedorData(
                          id: Option[Int],
                          active: Boolean,
                          code: String,

                          base: ProveedorBaseData,
                          address: ProveedorAddressData,
                          references: ProveedorReferencesData
                          )

object Proveedores extends Controller with ProvidesUser {

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
        C.PROV_CREDITOCTACTE -> of(Global.doubleFormat),
        C.PROV_CREDITOTOTAL -> of(Global.doubleFormat),
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
        C.ZON_ID -> number)(ProveedorReferencesData.apply)(ProveedorReferencesData.unapply)
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
      "cais" -> Json.toJson(writeEmptyCols(List())),
      "empresas" -> Json.toJson(writeProveedorEmpresas(proveedor.items.empresas)),
      "cuentasGrupo" -> Json.toJson(writeEmptyCols(List())),
      "retenciones" -> Json.toJson(writeEmptyCols(List())),
      "dptos" -> Json.toJson(writeEmptyCols(List())),
      "centrosCosto" -> Json.toJson(writeEmptyCols(List())),
      "additionalFields" -> Json.toJson(additionalFieldsWrites)
    )
    def additionalFieldsWrites() = Json.obj(
      "fields" -> Json.toJson(writeEmptyCols(List())),
      "values" -> Json.toJson(writeEmptyCols(List()))
    )
    def itemWrites(item: Any) = Json.obj(
      "dummy" -> Json.toJson("")
    )
    def proveedorEmpresaWrite(p: ProveedorEmpresa) = Json.obj(
      C.EMP_PROV_ID -> Json.toJson(p.id),
      C.EMP_ID -> Json.toJson(p.empId),
      C.EMP_NAME -> Json.toJson(p.empName)
    )
    def writeEmptyCols(items: List[Any]) = items.map(item => itemWrites(item))
    def writeProveedorEmpresas(items: List[ProveedorEmpresa]) = items.map(item => proveedorEmpresaWrite(item))
  }

  def get(id: Int) = GetAction { implicit request =>
    LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.LIST_PROVEEDOR), { user =>
      Ok(Json.toJson(Proveedor.get(user, id)))
    })
  }

  def update(id: Int) = PostAction { implicit request =>
    Logger.debug("in proveedores.update")
    proveedorForm.bindFromRequest.fold(
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
                    proveedor.references.zonId
                  )
                ))))
        })
      }
    )
  }

  def create = PostAction { implicit request =>
    Logger.debug("in proveedores.create")
    proveedorForm.bindFromRequest.fold(
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
                Proveedor(
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
                    proveedor.references.zonId)
              ))))
        })
      }
    )
  }

  def delete(id: Int) = PostAction { implicit request =>
    Logger.debug("in proveedores.delete")
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

}