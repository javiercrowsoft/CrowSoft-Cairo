package controllers.logged.modules.tesoreria

import controllers._
import play.api.mvc._
import play.api.data._
import play.api.data.Forms._
import actions._
import play.api.Logger
import play.api.libs.json._
import models.cairo.modules.tesoreria._
import models.cairo.system.security.CairoSecurity
import models.cairo.system.database.{Recordset, DBHelper}
import formatters.json.DateFormatter
import formatters.json.DateFormatter._
import scala.util.control.NonFatal

case class MovimientoFondoIdData(
                                  docId: Int,
                                  numero: Int,
                                  nroDoc: String
                                )

case class MovimientoFondoBaseData(
                                    cliId: Int,
                                    estId: Int,
                                    ccosId: Int,
                                    sucId: Int,
                                    usId: Int,
                                    lgjId: Int,
                                    descrip: String,
                                    grabarAsiento: Boolean
                                  )

case class MovimientoFondoItemBaseData(
                                        descrip: Option[String],
                                        cueIdDebe: Int,
                                        cueIdHaber: Int,
                                        ccosId: Option[Int],
                                        orden: Int
                                      )

case class MovimientoFondoItemTotalsData(
                                          importe: Double,
                                          importeOrigen: Double,
                                          importeOrigenHaber: Option[Double]
                                        )

case class MovimientoFondoItemChequeData(
                                          id: Int,
                                          base: MovimientoFondoItemBaseData,
                                          monId: Int,
                                          totals: MovimientoFondoItemTotalsData,
                                          chqId: Int,
                                          cheqId: Option[Int],
                                          numeroDoc: String,
                                          fechaCobro: String,
                                          fechaVto: String,
                                          cleId: Int
                                        )

case class MovimientoFondoItemChequeTData(
                                           id: Int,
                                           base: MovimientoFondoItemBaseData,
                                           monId: Int,
                                           totals: MovimientoFondoItemTotalsData,
                                           cliId: Int,
                                           cheqId: Option[Int],
                                           numeroDoc: String,
                                           fechaCobro: String,
                                           fechaVto: String,
                                           cleId: Int
                                         )

case class MovimientoFondoItemChequeIData(
                                           id: Int,
                                           base: MovimientoFondoItemBaseData,
                                           monId: Int,
                                           totals: MovimientoFondoItemTotalsData,
                                           bcoId: Int,
                                           cheqId: Option[Int],
                                           numeroDoc: String,
                                           fechaCobro: String,
                                           fechaVto: String,
                                           cleId: Int
                                         )

case class MovimientoFondoItemEfectivoData(
                                            id: Int,
                                            base: MovimientoFondoItemBaseData,
                                            totals: MovimientoFondoItemTotalsData
                                          )

case class MovimientoFondoData(
                                id: Option[Int],
                                ids: MovimientoFondoIdData,
                                base: MovimientoFondoBaseData,
                                fecha: String,
                                cotizacion: Double,
                                total: Double,
                                cheques: List[MovimientoFondoItemChequeData],
                                chequesT: List[MovimientoFondoItemChequeTData],
                                chequesI: List[MovimientoFondoItemChequeIData],
                                efectivo: List[MovimientoFondoItemEfectivoData],

                                chequeDeleted: String,
                                chequeTDeleted: String,
                                chequeIDeleted: String,
                                efectivoDeleted: String
                              )

case class MovimientoFondoParamsData(
                                      from: String,
                                      to: String,
                                      cliId: String,
                                      estId: String,
                                      ccosId: String,
                                      sucId: String,
                                      usId: String,
                                      docId: String,
                                      empId: String
                                    )

object MovimientosFondo extends Controller with ProvidesUser {

  val GC = models.cairo.modules.general.C

  val movimientoFondoParamsForm: Form[MovimientoFondoParamsData] = Form(
    mapping(
      GC.FROM -> text,
      GC.TO -> text,
      GC.CLI_ID -> text,
      GC.EST_ID -> text,
      GC.CCOS_ID -> text,
      GC.SUC_ID -> text,
      GC.US_ID -> text,
      GC.DOC_ID -> text,
      GC.EMP_ID -> text
    )(MovimientoFondoParamsData.apply)(MovimientoFondoParamsData.unapply)
  )

  val movimientoFondoIdFields = List(GC.DOC_ID, C.MF_NUMERO, C.MF_NRODOC)

  val movimientoFondoBaseFields = List(GC.CLI_ID, GC.EST_ID, GC.CCOS_ID, GC.SUC_ID, GC.LGJ_ID, C.MF_DESCRIP, GC.US_ID,
    C.MF_GRABAR_ASIENTO)

  val movimientoFondoItemBase = List(C.MFI_DESCRIP, GC.PR_ID, GC.CCOS_ID, GC.TO_ID, C.CUE_ID_DEBE, C.CUE_ID_HABER, C.MFI_ORDEN)

  val movimientoFondoItemTotals = List(C.MFI_IMPORTE, C.MFI_IMPORTE_ORIGEN, C.MFI_IMPORTE_ORIGEN_HABER)

  val movimientoFondoForm: Form[MovimientoFondoData] = Form(
    mapping(
      "id" -> optional(number),
      C.MOVIMIENTO_FONDO_ID -> mapping(
        GC.DOC_ID -> number,
        C.MF_NUMERO -> number,
        C.MF_NRODOC -> text)
      (MovimientoFondoIdData.apply)(MovimientoFondoIdData.unapply),
      C.MOVIMIENTO_FONDO_BASE -> mapping(
        GC.CLI_ID -> number,
        GC.EST_ID -> number,
        GC.CCOS_ID -> number,
        GC.SUC_ID -> number,
        GC.US_ID -> number,
        GC.LGJ_ID -> number,
        C.MF_DESCRIP -> text,
        C.MF_GRABAR_ASIENTO -> boolean)
      (MovimientoFondoBaseData.apply)(MovimientoFondoBaseData.unapply),
      C.MF_FECHA -> text,
      C.MF_COTIZACION -> of(Global.doubleFormat),
      C.MF_TOTAL -> of(Global.doubleFormat),
      C.MOVIMIENTO_FONDO_ITEM_CHEQUE_TMP -> Forms.list[MovimientoFondoItemChequeData](
        mapping(
          C.MFI_ID -> number,
          C.MOVIMIENTO_FONDO_ITEM_BASE -> mapping (
            C.MFI_DESCRIP -> optional(text),
            C.CUE_ID_DEBE -> number,
            C.CUE_ID_HABER -> number,
            GC.CCOS_ID -> optional(number),
            C.MFI_ORDEN -> number)
          (MovimientoFondoItemBaseData.apply)(MovimientoFondoItemBaseData.unapply),
          GC.MON_ID -> number,
          C.MOVIMIENTO_FONDO_ITEM_TOTALS -> mapping (
            C.MFI_IMPORTE -> of(Global.doubleFormat),
            C.MFI_IMPORTE_ORIGEN -> of(Global.doubleFormat),
            C.MFI_IMPORTE_ORIGEN_HABER -> optional(of(Global.doubleFormat)))
          (MovimientoFondoItemTotalsData.apply)(MovimientoFondoItemTotalsData.unapply),
          GC.CHQ_ID -> number,
          C.CHEQ_ID -> optional(number),
          C.MFI_TMP_CHEQUE -> text,
          C.MFI_TMP_FECHA_COBRO -> text,
          C.MFI_TMP_FECHA_VTO -> text,
          GC.CLE_ID -> number
        )(MovimientoFondoItemChequeData.apply)(MovimientoFondoItemChequeData.unapply)
      ),
      C.MOVIMIENTO_FONDO_ITEM_CHEQUET_TMP -> Forms.list[MovimientoFondoItemChequeTData](
        mapping(
          C.MFI_ID -> number,
          C.MOVIMIENTO_FONDO_ITEM_BASE -> mapping (
            C.MFI_DESCRIP -> optional(text),
            C.CUE_ID_DEBE -> number,
            C.CUE_ID_HABER -> number,
            GC.CCOS_ID -> optional(number),
            C.MFI_ORDEN -> number)
          (MovimientoFondoItemBaseData.apply)(MovimientoFondoItemBaseData.unapply),
          GC.MON_ID -> number,
          C.MOVIMIENTO_FONDO_ITEM_TOTALS -> mapping (
            C.MFI_IMPORTE -> of(Global.doubleFormat),
            C.MFI_IMPORTE_ORIGEN -> of(Global.doubleFormat),
            C.MFI_IMPORTE_ORIGEN_HABER -> optional(of(Global.doubleFormat)))
          (MovimientoFondoItemTotalsData.apply)(MovimientoFondoItemTotalsData.unapply),
          GC.CLI_ID -> number,
          C.CHEQ_ID -> optional(number),
          C.MFI_TMP_CHEQUE -> text,
          C.MFI_TMP_FECHA_COBRO -> text,
          C.MFI_TMP_FECHA_VTO -> text,
          GC.CLE_ID -> number
        )(MovimientoFondoItemChequeTData.apply)(MovimientoFondoItemChequeTData.unapply)
      ),
      C.MOVIMIENTO_FONDO_ITEM_CHEQUEI_TMP -> Forms.list[MovimientoFondoItemChequeIData](
        mapping(
          C.MFI_ID -> number,
          C.MOVIMIENTO_FONDO_ITEM_BASE -> mapping (
            C.MFI_DESCRIP -> optional(text),
            C.CUE_ID_DEBE -> number,
            C.CUE_ID_HABER -> number,
            GC.CCOS_ID -> optional(number),
            C.MFI_ORDEN -> number)
          (MovimientoFondoItemBaseData.apply)(MovimientoFondoItemBaseData.unapply),
          GC.MON_ID -> number,
          C.MOVIMIENTO_FONDO_ITEM_TOTALS -> mapping (
            C.MFI_IMPORTE -> of(Global.doubleFormat),
            C.MFI_IMPORTE_ORIGEN -> of(Global.doubleFormat),
            C.MFI_IMPORTE_ORIGEN_HABER -> optional(of(Global.doubleFormat)))
          (MovimientoFondoItemTotalsData.apply)(MovimientoFondoItemTotalsData.unapply),
          GC.BCO_ID -> number,
          C.CHEQ_ID -> optional(number),
          C.MFI_TMP_CHEQUE -> text,
          C.MFI_TMP_FECHA_COBRO -> text,
          C.MFI_TMP_FECHA_VTO -> text,
          GC.CLE_ID -> number
        )(MovimientoFondoItemChequeIData.apply)(MovimientoFondoItemChequeIData.unapply)
      ),
      C.MOVIMIENTO_FONDO_ITEM_EFECTIVO_TMP -> Forms.list[MovimientoFondoItemEfectivoData](
        mapping(
          C.MFI_ID -> number,
          C.MOVIMIENTO_FONDO_ITEM_BASE -> mapping (
            C.MFI_DESCRIP -> optional(text),
            C.CUE_ID_DEBE -> number,
            C.CUE_ID_HABER -> number,
            GC.CCOS_ID -> optional(number),
            C.MFI_ORDEN -> number)
          (MovimientoFondoItemBaseData.apply)(MovimientoFondoItemBaseData.unapply),
          C.MOVIMIENTO_FONDO_ITEM_TOTALS -> mapping (
            C.MFI_IMPORTE -> of(Global.doubleFormat),
            C.MFI_IMPORTE_ORIGEN -> of(Global.doubleFormat),
            C.MFI_IMPORTE_ORIGEN_HABER -> optional(of(Global.doubleFormat)))
          (MovimientoFondoItemTotalsData.apply)(MovimientoFondoItemTotalsData.unapply)
        )(MovimientoFondoItemEfectivoData.apply)(MovimientoFondoItemEfectivoData.unapply)
      ),
      C.MOVIMIENTO_FONDO_ITEM_CHEQUE_DELETED -> text,
      C.MOVIMIENTO_FONDO_ITEM_CHEQUET_DELETED -> text,
      C.MOVIMIENTO_FONDO_ITEM_CHEQUEI_DELETED -> text,
      C.MOVIMIENTO_FONDO_ITEM_EFECTIVO_DELETED -> text
    )(MovimientoFondoData.apply)(MovimientoFondoData.unapply)
  )

  implicit val movimientoFondoParamsWrites = new Writes[MovimientoFondoParams] {
    def writes(movimientoFondoParams: MovimientoFondoParams) = Json.obj(
      GC.FROM -> Json.toJson(movimientoFondoParams.from),
      GC.TO -> Json.toJson(movimientoFondoParams.to),
      GC.CLI_ID -> Json.toJson(movimientoFondoParams.cliId),
      GC.CLI_NAME -> Json.toJson(movimientoFondoParams.cliName),
      GC.EST_ID -> Json.toJson(movimientoFondoParams.estId),
      GC.EST_NAME -> Json.toJson(movimientoFondoParams.estName),
      GC.CCOS_ID -> Json.toJson(movimientoFondoParams.ccosId),
      GC.CCOS_NAME -> Json.toJson(movimientoFondoParams.ccosName),
      GC.SUC_ID -> Json.toJson(movimientoFondoParams.sucId),
      GC.SUC_NAME -> Json.toJson(movimientoFondoParams.sucName),
      GC.US_ID -> Json.toJson(movimientoFondoParams.usId),
      GC.US_NAME -> Json.toJson(movimientoFondoParams.usName),
      GC.DOC_ID -> Json.toJson(movimientoFondoParams.docId),
      GC.DOC_NAME -> Json.toJson(movimientoFondoParams.docName),
      GC.EMP_ID -> Json.toJson(movimientoFondoParams.empId),
      GC.EMP_NAME -> Json.toJson(movimientoFondoParams.empName)
    )
  }

  implicit val movimientoFondoWrites = new Writes[MovimientoFondo] {
    def writes(movimientoFondo: MovimientoFondo) = Json.obj(
      "id" -> Json.toJson(movimientoFondo.id),
      C.MF_ID -> Json.toJson(movimientoFondo.id),

      GC.DOC_ID -> Json.toJson(movimientoFondo.ids.docId),
      GC.DOC_NAME -> Json.toJson(movimientoFondo.ids.docName),
      C.MF_NRODOC -> Json.toJson(movimientoFondo.ids.nroDoc),
      C.MF_NUMERO -> Json.toJson(movimientoFondo.ids.numero),

      C.MF_FECHA -> Json.toJson(movimientoFondo.fecha),

      GC.CLI_ID -> Json.toJson(movimientoFondo.base.cliId),
      GC.CLI_NAME -> Json.toJson(movimientoFondo.base.cliName),
      GC.EST_ID -> Json.toJson(movimientoFondo.base.estId),
      GC.EST_NAME -> Json.toJson(movimientoFondo.base.estName),
      GC.SUC_ID -> Json.toJson(movimientoFondo.base.sucId),
      GC.SUC_NAME -> Json.toJson(movimientoFondo.base.sucName),
      GC.US_ID -> Json.toJson(movimientoFondo.base.usId),
      GC.US_NAME -> Json.toJson(movimientoFondo.base.usName),
      GC.CCOS_ID -> Json.toJson(movimientoFondo.base.ccosId),
      GC.CCOS_NAME -> Json.toJson(movimientoFondo.base.ccosName),
      GC.LGJ_ID -> Json.toJson(movimientoFondo.base.lgjId),
      GC.LGJ_CODE -> Json.toJson(movimientoFondo.base.lgjCode),
      GC.MON_ID -> Json.toJson(movimientoFondo.base.monId),
      C.MF_DESCRIP -> Json.toJson(movimientoFondo.base.descrip),
      C.MF_GRABAR_ASIENTO -> Json.toJson(movimientoFondo.base.grabarAsiento),

      GC.DOCT_ID -> Json.toJson(movimientoFondo.references.doctId),
      GC.DOCT_NAME -> Json.toJson(movimientoFondo.references.doctName),
      GC.TA_MASCARA -> Json.toJson(movimientoFondo.references.taMascara),
      GC.TA_PROPUESTO -> Json.toJson(movimientoFondo.references.taPropuesto),
      C.MF_FIRMADO -> Json.toJson(movimientoFondo.references.firmado),
      C.AS_ID -> Json.toJson(movimientoFondo.references.asId),
      GC.EDITABLE -> Json.toJson(movimientoFondo.references.editable),
      GC.EDIT_MSG -> Json.toJson(movimientoFondo.references.editMsg),

      C.MF_COTIZACION -> Json.toJson(movimientoFondo.cotizacion),
      C.MF_TOTAL -> Json.toJson(movimientoFondo.total),

      "cheques" -> Json.toJson(writeMovimientoFondoCheques(movimientoFondo.items.cheques)),
      "chequesT" -> Json.toJson(writeMovimientoFondoChequesT(movimientoFondo.items.chequesT)),
      "chequesI" -> Json.toJson(writeMovimientoFondoChequesI(movimientoFondo.items.chequesI)),
      "efectivo" -> Json.toJson(writeMovimientoFondoEfectivo(movimientoFondo.items.efectivo))
    )
    def movimientoFondoChequeWrites(i: MovimientoFondoItemCheque) = Json.obj(
      C.MFI_ID -> Json.toJson(i.id),
      C.MFI_DESCRIP -> Json.toJson(i.base.descrip),
      C.CUE_ID_DEBE -> Json.toJson(i.base.cueIdDebe),
      C.CUE_DEBE_NAME -> Json.toJson(i.base.cueNameDebe),
      C.CUE_ID_HABER -> Json.toJson(i.base.cueIdHaber),
      C.CUE_HABER_NAME -> Json.toJson(i.base.cueNameHaber),
      GC.CCOS_ID -> Json.toJson(i.base.ccosId),
      GC.CCOS_NAME -> Json.toJson(i.base.ccosName),
      GC.MON_ID -> Json.toJson(i.moneda.monId),
      GC.MON_NAME -> Json.toJson(i.moneda.monName),
      C.MFI_ORDEN -> Json.toJson(i.base.orden),
      C.MFI_IMPORTE -> Json.toJson(i.totals.importe),
      C.MFI_IMPORTE_ORIGEN -> Json.toJson(i.totals.importeOrigen),
      C.MFI_IMPORTE_ORIGEN_HABER -> Json.toJson(i.totals.importeOrigenHaber),
      GC.BCO_ID -> Json.toJson(i.bcoId),
      GC.BCO_NAME -> Json.toJson(i.bcoName),
      GC.CHQ_ID -> Json.toJson(i.chqId),
      GC.CHQ_CODE -> Json.toJson(i.chqName),
      C.CHEQ_ID -> Json.toJson(i.cheqId),
      C.CHEQ_NUMERO -> Json.toJson(i.numero),
      C.CHEQ_NUMERO_DOC -> Json.toJson(i.numeroDoc),
      C.CHEQ_FECHA_COBRO -> Json.toJson(i.fechaCobro),
      C.CHEQ_FECHA_VTO -> Json.toJson(i.fechaVto),
      GC.CLE_ID -> Json.toJson(i.cleId),
      GC.CLE_NAME -> Json.toJson(i.cleName)
    )
    def movimientoFondoChequeTWrites(i: MovimientoFondoItemChequeT) = Json.obj(
      C.MFI_ID -> Json.toJson(i.id),
      C.MFI_DESCRIP -> Json.toJson(i.base.descrip),
      C.CUE_ID_DEBE -> Json.toJson(i.base.cueIdDebe),
      C.CUE_DEBE_NAME -> Json.toJson(i.base.cueNameDebe),
      C.CUE_ID_HABER -> Json.toJson(i.base.cueIdHaber),
      C.CUE_HABER_NAME -> Json.toJson(i.base.cueNameHaber),
      GC.CCOS_ID -> Json.toJson(i.base.ccosId),
      GC.CCOS_NAME -> Json.toJson(i.base.ccosName),
      GC.MON_ID -> Json.toJson(i.moneda.monId),
      GC.MON_NAME -> Json.toJson(i.moneda.monName),
      C.MFI_ORDEN -> Json.toJson(i.base.orden),
      C.MFI_IMPORTE -> Json.toJson(i.totals.importe),
      C.MFI_IMPORTE_ORIGEN -> Json.toJson(i.totals.importeOrigen),
      C.MFI_IMPORTE_ORIGEN_HABER -> Json.toJson(i.totals.importeOrigenHaber),
      GC.BCO_ID -> Json.toJson(i.bcoId),
      GC.BCO_NAME -> Json.toJson(i.bcoName),
      GC.CLI_ID -> Json.toJson(i.cliId),
      GC.CLI_NAME -> Json.toJson(i.cliName),
      C.CHEQ_ID -> Json.toJson(i.cheqId),
      C.CHEQ_NUMERO -> Json.toJson(i.numero),
      C.CHEQ_NUMERO_DOC -> Json.toJson(i.numeroDoc),
      C.CHEQ_FECHA_COBRO -> Json.toJson(i.fechaCobro),
      C.CHEQ_FECHA_VTO -> Json.toJson(i.fechaVto),
      GC.CLE_ID -> Json.toJson(i.cleId),
      GC.CLE_NAME -> Json.toJson(i.cleName)
    )
    def movimientoFondoChequeIWrites(i: MovimientoFondoItemChequeI) = Json.obj(
      C.MFI_ID -> Json.toJson(i.id),
      C.MFI_DESCRIP -> Json.toJson(i.base.descrip),
      C.CUE_ID_DEBE -> Json.toJson(i.base.cueIdDebe),
      C.CUE_DEBE_NAME -> Json.toJson(i.base.cueNameDebe),
      C.CUE_ID_HABER -> Json.toJson(i.base.cueIdHaber),
      C.CUE_HABER_NAME -> Json.toJson(i.base.cueNameHaber),
      GC.CCOS_ID -> Json.toJson(i.base.ccosId),
      GC.CCOS_NAME -> Json.toJson(i.base.ccosName),
      GC.MON_ID -> Json.toJson(i.moneda.monId),
      GC.MON_NAME -> Json.toJson(i.moneda.monName),
      C.MFI_ORDEN -> Json.toJson(i.base.orden),
      C.MFI_IMPORTE -> Json.toJson(i.totals.importe),
      C.MFI_IMPORTE_ORIGEN -> Json.toJson(i.totals.importeOrigen),
      C.MFI_IMPORTE_ORIGEN_HABER -> Json.toJson(i.totals.importeOrigenHaber),
      GC.BCO_ID -> Json.toJson(i.bcoId),
      GC.BCO_NAME -> Json.toJson(i.bcoName),
      C.CHEQ_ID -> Json.toJson(i.cheqId),
      C.CHEQ_NUMERO -> Json.toJson(i.numero),
      C.CHEQ_NUMERO_DOC -> Json.toJson(i.numeroDoc),
      C.CHEQ_FECHA_COBRO -> Json.toJson(i.fechaCobro),
      C.CHEQ_FECHA_VTO -> Json.toJson(i.fechaVto),
      GC.CLE_ID -> Json.toJson(i.cleId),
      GC.CLE_NAME -> Json.toJson(i.cleName)
    )
    def movimientoFondoEfectivoWrites(i: MovimientoFondoItemEfectivo) = Json.obj(
      C.MFI_ID -> Json.toJson(i.id),
      C.MFI_DESCRIP -> Json.toJson(i.base.descrip),
      C.CUE_ID_DEBE -> Json.toJson(i.base.cueIdDebe),
      C.CUE_DEBE_NAME -> Json.toJson(i.base.cueNameDebe),
      C.CUE_ID_HABER -> Json.toJson(i.base.cueIdHaber),
      C.CUE_HABER_NAME -> Json.toJson(i.base.cueNameHaber),
      GC.MON_ID -> Json.toJson(i.moneda.monId),
      GC.MON_NAME -> Json.toJson(i.moneda.monName),
      GC.CCOS_ID -> Json.toJson(i.base.ccosId),
      GC.CCOS_NAME -> Json.toJson(i.base.ccosName),
      GC.MON_ID -> Json.toJson(i.moneda.monId),
      GC.MON_NAME -> Json.toJson(i.moneda.monName),
      C.MFI_ORDEN -> Json.toJson(i.base.orden),
      C.MFI_IMPORTE -> Json.toJson(i.totals.importe),
      C.MFI_IMPORTE_ORIGEN -> Json.toJson(i.totals.importeOrigen),
      C.MFI_IMPORTE_ORIGEN_HABER -> Json.toJson(i.totals.importeOrigenHaber)
    )
    def writeMovimientoFondoCheques(items: List[MovimientoFondoItemCheque]) = items.map(item => movimientoFondoChequeWrites(item))
    def writeMovimientoFondoChequesT(items: List[MovimientoFondoItemChequeT]) = items.map(item => movimientoFondoChequeTWrites(item))
    def writeMovimientoFondoChequesI(items: List[MovimientoFondoItemChequeI]) = items.map(item => movimientoFondoChequeIWrites(item))
    def writeMovimientoFondoEfectivo(items: List[MovimientoFondoItemEfectivo]) = items.map(item => movimientoFondoEfectivoWrites(item))
  }

  def get(id: Int) = GetAction { implicit request =>
    LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.LIST_MOVIMIENTO_FONDO), { user =>
      Ok(Json.toJson(MovimientoFondo.get(user, id)))
    })
  }

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //
  // this functions convert the plain JSON received in CREATE and UPDATE into a MovimientoFondoData structure
  //
  // because the limitation to 18 fields in case class used for FORM mapping we have grouped the fields
  // in MovimientoFondo/Data, MovimientoFondoItem/Data, etc
  //
  // the below routines group a flat JSON and in some cases rename the name of the fields or move
  // fields to the parent node in the JSON structure to match the case class
  //

  private def preprocessParams(implicit request:Request[AnyContent]): JsObject = {

    def getJsValueAsMap(list: Map[String, JsValue]): Map[String, JsValue] = list.toList match {
      case (key: String, jsValue: JsValue) :: t => jsValue.as[Map[String, JsValue]]
      case _ => Map.empty
    }

    def preprocessChequeParam(field: JsValue) = {
      val params = field.as[Map[String, JsValue]]

      // groups for MovimientoFondoChequeData
      //
      val movimientoFondoCheque = Global.preprocessFormParams(
        List(C.MFI_ID, GC.MON_ID, GC.CHQ_ID, C.CHEQ_ID, C.MFI_TMP_CHEQUE, C.MFI_TMP_FECHA_COBRO,
          C.MFI_TMP_FECHA_VTO, GC.CLE_ID), "", params)
      val movimientoFondoChequeBaseGroup = Global.preprocessFormParams(movimientoFondoItemBase, C.MOVIMIENTO_FONDO_ITEM_BASE, params)
      val movimientoFondoChequeTotalsGroup = Global.preprocessFormParams(movimientoFondoItemTotals, C.MOVIMIENTO_FONDO_ITEM_TOTALS, params)

      val cheque = JsObject(
        (movimientoFondoCheque ++ movimientoFondoChequeBaseGroup ++ movimientoFondoChequeTotalsGroup).toSeq)
      cheque
    }

    def preprocessChequeTParam(field: JsValue) = {
      val params = field.as[Map[String, JsValue]]

      // groups for MovimientoFondoChequeTData
      //
      val movimientoFondoChequeT = Global.preprocessFormParams(
        List(C.MFI_ID, GC.MON_ID, GC.CLI_ID, C.CHEQ_ID, C.MFI_TMP_CHEQUE, C.MFI_TMP_FECHA_COBRO,
          C.MFI_TMP_FECHA_VTO, GC.CLE_ID), "", params)
      val movimientoFondoChequeTBaseGroup = Global.preprocessFormParams(movimientoFondoItemBase, C.MOVIMIENTO_FONDO_ITEM_BASE, params)
      val movimientoFondoChequeTTotalsGroup = Global.preprocessFormParams(movimientoFondoItemTotals, C.MOVIMIENTO_FONDO_ITEM_TOTALS, params)

      val chequeT = JsObject(
        (movimientoFondoChequeT ++ movimientoFondoChequeTBaseGroup ++ movimientoFondoChequeTTotalsGroup).toSeq)
      chequeT
    }

    def preprocessChequeIParam(field: JsValue) = {
      val params = field.as[Map[String, JsValue]]

      // groups for MovimientoFondoChequeIData
      //
      val movimientoFondoChequeI = Global.preprocessFormParams(
        List(C.MFI_ID, GC.MON_ID, GC.BCO_ID, GC.CLI_ID, C.CHEQ_ID, C.MFI_TMP_CHEQUE, C.MFI_TMP_FECHA_COBRO,
          C.MFI_TMP_FECHA_VTO, GC.CLE_ID), "", params)
      val movimientoFondoChequeIBaseGroup = Global.preprocessFormParams(movimientoFondoItemBase, C.MOVIMIENTO_FONDO_ITEM_BASE, params)
      val movimientoFondoChequeITotalsGroup = Global.preprocessFormParams(movimientoFondoItemTotals, C.MOVIMIENTO_FONDO_ITEM_TOTALS, params)

      val chequeI = JsObject(
        (movimientoFondoChequeI ++ movimientoFondoChequeIBaseGroup ++ movimientoFondoChequeITotalsGroup).toSeq)
      chequeI
    }

    def preprocessEfectivoParam(field: JsValue) = {
      val params = field.as[Map[String, JsValue]]

      // groups for MovimientoFondoEfectivoData
      //
      val movimientoFondoEfectivo = Global.preprocessFormParams(List(C.MFI_ID, GC.MON_ID), "", params)
      val movimientoFondoEfectivoBaseGroup = Global.preprocessFormParams(movimientoFondoItemBase, C.MOVIMIENTO_FONDO_ITEM_BASE, params)
      val movimientoFondoEfectivoTotalsGroup = Global.preprocessFormParams(movimientoFondoItemTotals, C.MOVIMIENTO_FONDO_ITEM_TOTALS, params)

      val efectivo = JsObject(
        (movimientoFondoEfectivo ++ movimientoFondoEfectivoBaseGroup ++ movimientoFondoEfectivoTotalsGroup).toSeq)
      efectivo
    }

    def preprocessChequesParam(items: JsValue, group: String): Map[String, JsValue] = items match {
      case JsArray(arr) => Map(group -> JsArray(arr.map(preprocessChequeParam(_))))
      case _ => Map.empty
    }

    def preprocessChequesTParam(items: JsValue, group: String): Map[String, JsValue] = items match {
      case JsArray(arr) => Map(group -> JsArray(arr.map(preprocessChequeTParam(_))))
      case _ => Map.empty
    }

    def preprocessChequesIParam(items: JsValue, group: String): Map[String, JsValue] = items match {
      case JsArray(arr) => Map(group -> JsArray(arr.map(preprocessChequeIParam(_))))
      case _ => Map.empty
    }

    def preprocessEfectivosParam(items: JsValue, group: String): Map[String, JsValue] = items match {
      case JsArray(arr) => Map(group -> JsArray(arr.map(preprocessEfectivoParam(_))))
      case _ => Map.empty
    }

    val params = Global.getParamsFromJsonRequest

    // groups for MovimientoFondoData
    //
    val facturaId = Global.preprocessFormParams(List("id", C.MF_FECHA, C.MF_COTIZACION, C.MF_TOTAL), "", params)
    val facturaIdGroup = Global.preprocessFormParams(movimientoFondoIdFields, C.MOVIMIENTO_FONDO_ID, params)
    val facturaBaseGroup = Global.preprocessFormParams(movimientoFondoBaseFields, C.MOVIMIENTO_FONDO_BASE, params)

    // cheques
    //
    val chequesInfo = getJsValueAsMap(Global.getParamsJsonRequestFor(C.MOVIMIENTO_FONDO_ITEM_CHEQUE_TMP, params))
    val chequeRows = Global.getParamsJsonRequestFor(GC.ITEMS, chequesInfo)
    val chequeDeleted: Map[String, JsValue] = Global.getParamsJsonRequestFor(GC.DELETED_LIST, chequesInfo).toList match {
      case Nil => Map(C.MOVIMIENTO_FONDO_ITEM_CHEQUE_DELETED -> Json.toJson(""))
      case deletedList :: t => Map(C.MOVIMIENTO_FONDO_ITEM_CHEQUE_DELETED -> Json.toJson(deletedList._2))
    }
    val movimientoFondoCheques = preprocessChequesParam(chequeRows.head._2, C.MOVIMIENTO_FONDO_ITEM_CHEQUE_TMP)

    // cheques tercero
    //
    val chequesTInfo = getJsValueAsMap(Global.getParamsJsonRequestFor(C.MOVIMIENTO_FONDO_ITEM_CHEQUET_TMP, params))
    val chequeTRows = Global.getParamsJsonRequestFor(GC.ITEMS, chequesTInfo)
    val chequeTDeleted: Map[String, JsValue] = Global.getParamsJsonRequestFor(GC.DELETED_LIST, chequesTInfo).toList match {
      case Nil => Map(C.MOVIMIENTO_FONDO_ITEM_CHEQUET_DELETED -> Json.toJson(""))
      case deletedList :: t => Map(C.MOVIMIENTO_FONDO_ITEM_CHEQUET_DELETED -> Json.toJson(deletedList._2))
    }
    val movimientoFondoChequeT = preprocessChequesTParam(chequeTRows.head._2, C.MOVIMIENTO_FONDO_ITEM_CHEQUET_TMP)

    // cheques ingreso
    //
    val chequesIInfo = getJsValueAsMap(Global.getParamsJsonRequestFor(C.MOVIMIENTO_FONDO_ITEM_CHEQUET_TMP, params))
    val chequeIRows = Global.getParamsJsonRequestFor(GC.ITEMS, chequesIInfo)
    val chequeIDeleted: Map[String, JsValue] = Global.getParamsJsonRequestFor(GC.DELETED_LIST, chequesIInfo).toList match {
      case Nil => Map(C.MOVIMIENTO_FONDO_ITEM_CHEQUEI_DELETED -> Json.toJson(""))
      case deletedList :: t => Map(C.MOVIMIENTO_FONDO_ITEM_CHEQUEI_DELETED -> Json.toJson(deletedList._2))
    }
    val movimientoFondoChequeI = preprocessChequesIParam(chequeIRows.head._2, C.MOVIMIENTO_FONDO_ITEM_CHEQUEI_TMP)

    // efectivos
    //
    val efectivosInfo = getJsValueAsMap(Global.getParamsJsonRequestFor(C.MOVIMIENTO_FONDO_ITEM_EFECTIVO_TMP, params))
    val efectivoRows = Global.getParamsJsonRequestFor(GC.ITEMS, efectivosInfo)
    val efectivoDeleted: Map[String, JsValue] = Global.getParamsJsonRequestFor(GC.DELETED_LIST, efectivosInfo).toList match {
      case Nil => Map(C.MOVIMIENTO_FONDO_ITEM_EFECTIVO_DELETED -> Json.toJson(""))
      case deletedList :: t => Map(C.MOVIMIENTO_FONDO_ITEM_EFECTIVO_DELETED -> Json.toJson(deletedList._2))
    }
    val movimientoFondoEfectivos = preprocessEfectivosParam(efectivoRows.head._2, C.MOVIMIENTO_FONDO_ITEM_EFECTIVO_TMP)

    JsObject(
      (facturaId ++ facturaIdGroup ++ facturaBaseGroup
        ++ movimientoFondoCheques ++ chequeDeleted
        ++ movimientoFondoChequeT ++ chequeTDeleted
        ++ movimientoFondoChequeI ++ chequeIDeleted
        ++ movimientoFondoEfectivos ++ efectivoDeleted).toSeq)
  }
  //
  //
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  def getCheques(items: List[MovimientoFondoItemChequeData]): List[MovimientoFondoItemCheque] = {
    items.map(cheque => {
      MovimientoFondoItemCheque(
        cheque.id,
        MovimientoFondoItemBase(
          cheque.base.descrip.getOrElse(""),
          cheque.base.cueIdDebe,
          cheque.base.cueIdHaber,
          cheque.base.ccosId.getOrElse(DBHelper.NoId),
          cheque.base.orden
        ),
        cheque.monId,
        MovimientoFondoItemTotals(
          cheque.totals.importe,
          cheque.totals.importeOrigen,
          cheque.totals.importeOrigenHaber.getOrElse(0)
        ),
        DBHelper.NoId,
        cheque.chqId,
        cheque.cheqId.getOrElse(DBHelper.NoId),
        cheque.numeroDoc,
        DateFormatter.parse(cheque.fechaCobro),
        DateFormatter.parse(cheque.fechaVto),
        cheque.cleId
      )
    })
  }

  def getChequeT(items: List[MovimientoFondoItemChequeTData]): List[MovimientoFondoItemChequeT] = {
    items.map(cheque => {
      MovimientoFondoItemChequeT(
        cheque.id,
        MovimientoFondoItemBase(
          cheque.base.descrip.getOrElse(""),
          cheque.base.cueIdDebe,
          cheque.base.cueIdHaber,
          cheque.base.ccosId.getOrElse(DBHelper.NoId),
          cheque.base.orden
        ),
        cheque.monId,
        MovimientoFondoItemTotals(
          cheque.totals.importe,
          cheque.totals.importeOrigen,
          cheque.totals.importeOrigenHaber.getOrElse(0)
        ),
        DBHelper.NoId,
        cheque.cliId,
        cheque.cheqId.getOrElse(DBHelper.NoId),
        cheque.numeroDoc,
        DateFormatter.parse(cheque.fechaCobro),
        DateFormatter.parse(cheque.fechaVto),
        cheque.cleId
      )
    })
  }

  def getChequeI(items: List[MovimientoFondoItemChequeIData]): List[MovimientoFondoItemChequeI] = {
    items.map(cheque => {
      MovimientoFondoItemChequeI(
        cheque.id,
        MovimientoFondoItemBase(
          cheque.base.descrip.getOrElse(""),
          cheque.base.cueIdDebe,
          cheque.base.cueIdHaber,
          cheque.base.ccosId.getOrElse(DBHelper.NoId),
          cheque.base.orden
        ),
        cheque.monId,
        MovimientoFondoItemTotals(
          cheque.totals.importe,
          cheque.totals.importeOrigen,
          cheque.totals.importeOrigenHaber.getOrElse(0)
        ),
        cheque.bcoId,
        cheque.cheqId.getOrElse(DBHelper.NoId),
        cheque.numeroDoc,
        DateFormatter.parse(cheque.fechaCobro),
        DateFormatter.parse(cheque.fechaVto),
        cheque.cleId
      )
    })
  }

  def getEfectivo(items: List[MovimientoFondoItemEfectivoData]): List[MovimientoFondoItemEfectivo] = {
    items.map(efectivo => {
      MovimientoFondoItemEfectivo(
        efectivo.id,
        MovimientoFondoItemBase(
          efectivo.base.descrip.getOrElse(""),
          efectivo.base.cueIdDebe,
          efectivo.base.cueIdHaber,
          efectivo.base.ccosId.getOrElse(DBHelper.NoId),
          efectivo.base.orden
        ),
        DBHelper.NoId,
        MovimientoFondoItemTotals(
          efectivo.totals.importe,
          efectivo.totals.importeOrigen,
          efectivo.totals.importeOrigenHaber.getOrElse(0)
        )
      )
    })
  }

  def getMovimientoFondoItems(movimientoFondo: MovimientoFondoData): MovimientoFondoItems = {
    MovimientoFondoItems(
      getCheques(movimientoFondo.cheques),
      getChequeT(movimientoFondo.chequesT),
      getChequeI(movimientoFondo.chequesI),
      getEfectivo(movimientoFondo.efectivo),

      movimientoFondo.chequeDeleted,
      movimientoFondo.chequeTDeleted,
      movimientoFondo.chequeIDeleted,
      movimientoFondo.efectivoDeleted
    )
  }

  def getMovimientoFondo(movimientoFondo: MovimientoFondoData, id: Int): MovimientoFondo = {
    MovimientoFondo(
      id,
      MovimientoFondoId(
        movimientoFondo.ids.docId,
        movimientoFondo.ids.numero,
        movimientoFondo.ids.nroDoc),
      MovimientoFondoBase(
        movimientoFondo.base.cliId,
        movimientoFondo.base.estId,
        movimientoFondo.base.ccosId,
        movimientoFondo.base.sucId,
        movimientoFondo.base.usId,
        movimientoFondo.base.lgjId,
        movimientoFondo.base.descrip,
        movimientoFondo.base.grabarAsiento),
      MovimientoFondo.emptyMovimientoFondoReferences,
      DateFormatter.parse(movimientoFondo.fecha),
      movimientoFondo.cotizacion,
      movimientoFondo.total,
      getMovimientoFondoItems(movimientoFondo)
    )
  }

  def update(id: Int) = PostAction { implicit request =>
    Logger.debug("in MovimientosFondo.update")

    movimientoFondoForm.bind(preprocessParams).fold(
      formWithErrors => {
        Logger.debug(s"invalid form: ${formWithErrors.toString}")
        BadRequest
      },
      movimientoFondo => {
        Logger.debug(s"form: ${movimientoFondo.toString}")
        LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.EDIT_MOVIMIENTO_FONDO), { user =>
          try {
            Ok(
              Json.toJson(
                MovimientoFondo.update(user,
                  getMovimientoFondo(movimientoFondo, id)
                )
              )
            )
          } catch {
            case NonFatal(e) => {
              responseError(e)
            }
          }
        })
      }
    )
  }

  def createFromFactura = PostAction { implicit request =>
    Logger.debug("in MovimientosFondo.createFromFactura")
    movimientoFondoForm.bind(preprocessParams).fold(
      formWithErrors => {
        Logger.debug(s"invalid form: ${formWithErrors.toString}")
        BadRequest
      },
      movimientoFondo => {
        Logger.debug(s"form: ${movimientoFondo.toString}")
        LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.NEW_MOVIMIENTO_FONDO), { user =>
          try {
            Ok(
              Json.toJson(
                MovimientoFondo.createMovimientoFondo(user,
                  getMovimientoFondo(movimientoFondo, DBHelper.NoId)
                )
              )
            )
          } catch {
            case NonFatal(e) => {
              responseError(e)
            }
          }
        })
      }
    )
  }

  def create = PostAction { implicit request =>
    Logger.debug("in MovimientosFondo.create")
    movimientoFondoForm.bind(preprocessParams).fold(
      formWithErrors => {
        Logger.debug(s"invalid form: ${formWithErrors.toString}")
        BadRequest
      },
      movimientoFondo => {
        Logger.debug(s"form: ${movimientoFondo.toString}")
        LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.NEW_MOVIMIENTO_FONDO), { user =>
          try {
            Ok(
              Json.toJson(
                MovimientoFondo.create(user,
                  getMovimientoFondo(movimientoFondo, DBHelper.NoId)
                )
              )
            )
          } catch {
            case NonFatal(e) => {
              responseError(e)
            }
          }
        })
      }
    )
  }

  def responseError(e: Throwable): SimpleResult = {
    if (e.getMessage.contains("@@ERROR_SP:"))
      Ok(
        Json.obj(
          "id" -> 0,
          "errors" -> Json.obj("message" -> e.getMessage.split("@@ERROR_SP:")(1))
        )
      )
    else
      throw e
  }

  def delete(id: Int) = PostAction { implicit request =>
    Logger.debug("in MovimientosFondo.delete")
    LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.DELETE_MOVIMIENTO_FONDO), { user =>
      try {
        MovimientoFondo.delete(user, id)
        // Backbonejs requires at least an empty json object in the response
        // if not it will call errorHandler even when we responded with 200 OK :P
        Ok(JsonUtil.emptyJson)
      } catch {
        case NonFatal(e) => {
          responseError(e)
        }
      }
    })
  }

  def list(
            from: Option[String],
            to: Option[String],
            cliId: Option[String],
            estId: Option[String],
            ccosId: Option[String],
            sucId: Option[String],
            docId: Option[String],
            empId: Option[String]
          ) = GetAction { implicit request =>
    LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.LIST_MOVIMIENTO_FONDO), { user =>
      Ok(
        Json.toJson(
          Recordset.getAsJson(
            MovimientoFondo.list(
              user,
              DateFormatter.parse(from.getOrElse("")), DateFormatter.parse(to.getOrElse("")),
              cliId, estId, ccosId, sucId, docId, empId))))
    })
  }

  def parameters = GetAction { implicit request =>
    LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.LIST_MOVIMIENTO_FONDO), { user =>
      Ok(Json.toJson(MovimientoFondo.loadParams(user)))
    })
  }

  def saveParameters = PostAction { implicit request =>
    Logger.debug("in MovimientosFondo.saveParameters")
    movimientoFondoParamsForm.bindFromRequest.fold(
      formWithErrors => {
        Logger.debug(s"invalid form: ${formWithErrors.toString}")
        BadRequest
      },
      movimientoFondoParams => {
        Logger.debug(s"form: ${movimientoFondoParams.toString}")
        LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.LIST_MOVIMIENTO_FONDO), { user =>
          Ok(
            Json.toJson(
              MovimientoFondo.saveParams(user,
                MovimientoFondoParams(
                  movimientoFondoParams.from,
                  movimientoFondoParams.to,
                  movimientoFondoParams.cliId,
                  movimientoFondoParams.estId,
                  movimientoFondoParams.ccosId,
                  movimientoFondoParams.sucId,
                  movimientoFondoParams.usId,
                  movimientoFondoParams.docId,
                  movimientoFondoParams.empId
                )
              )
            )
          )
        })
      }
    )
  }

  def notes(id: Int) = GetAction { implicit request =>
    LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.LIST_MOVIMIENTO_FONDO), { user =>
      Ok(Json.toJson(""))
    })
  }

  def messages(id: Int) = GetAction { implicit request =>
    LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.LIST_MOVIMIENTO_FONDO), { user =>
      Ok(Json.toJson(""))
    })
  }
}
