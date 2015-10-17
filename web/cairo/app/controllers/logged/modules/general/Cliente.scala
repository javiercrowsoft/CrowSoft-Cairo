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

case class ClienteData(
                        id: Option[Int],
                        name: String,
                        razonsocial: String,
                        code: String,
                        active: Boolean,
                        esProspecto: Boolean,
                        catfiscal: Int,
                        cuit: String,
                        ingresosbrutos: String,
                        idPadre: Int,
                        contacto: String,
                        chequeorden: String,
                        cpgId: Int,
                        fpId: Int,
                        lpId: Int,
                        ldId: Int,
                        venId: Int,
                        transId: Int,
                        exigeTransporte: Boolean,
                        exigeProvincia: Boolean,
                        pciaTransporte: Boolean,
                        creditoctacte: Double,
                        creditototal: Double,
                        creditoactivo: Boolean,
                        descrip: String,
                        calle: String,
                        callenumero: String,
                        piso: String,
                        depto: String,
                        codpostal: String,
                        cpaId: Int,
                        horarioMdesde: Date,
                        horarioMhasta: Date,
                        horarioTdesde: Date,
                        horarioThasta: Date,
                        localidad: String,
                        proId: Int,
                        zonId: Int,
                        tel: String,
                        fax: String,
                        email: String,
                        web: String,
                        messanger: String,
                        yahoo: String,
                        clictId: Int,
                        idReferido: Int,
                        proyId: Int
                        )


object Clientes extends Controller with ProvidesUser {

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

  def getPercepciones(id: Int, fecha: String) = GetAction { implicit request =>
    LoggedIntoCompanyResponse.getAction(request, { user =>
      Ok(Json.toJson(Recordset.getAsJson(Cliente.getPercepciones(user, id, DateFormatter.parse(fecha)))))
    })
  }

}