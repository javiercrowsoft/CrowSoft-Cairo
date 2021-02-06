package models.cairo.modules.general

import java.sql.{Connection, CallableStatement, ResultSet, Types, SQLException}
import anorm.SqlParser._
import anorm._
import services.DateUtil
import services.db.DB
import models.cairo.system.database.{DBHelper, Register, Field, FieldType, SaveResult, Recordset}
import models.cairo.system.database.DBHelper.rowToFloat
import java.math.BigDecimal
import play.api.Play.current
import models.domain.CompanyUser
import java.util.Date
import play.api.Logger
import play.api.libs.json._
import scala.util.control.NonFatal

case class ClienteBase(
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

case class ClienteAddress(
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
                             horarioMDesde: Date,
                             horarioMHasta: Date,
                             horarioTDesde: Date,
                             horarioTHasta: Date
                             )

case class ClienteAddressReference(
                                    cpaId: Int,
                                    cpaCode: String,
                                    proId: Int,
                                    proName: String,
                                    zonId: Int,
                                    zonName: String,
                                    transId: Int,
                                    transName: String
                                    )

case class ClientePriceLists(
                             lpId: Int,
                             lpName: String,
                             ldId: Int,
                             ldName: String
                             )

case class ClienteWebUser(
                          usId: Int,
                          name: String,
                          active: Boolean
                           )

case class ClienteReferences(
                                cliIdPadre: Int,
                                padre: String,
                                cpgId: Int,
                                cpgName: String,
                                fpId: Int,
                                fpName: String,
                                venId: Int,
                                venName: String,
                                clictId: Int,
                                clictName: String,
                                cliIdReferido: Int,
                                referido: String,
                                proyId: Int,
                                proyName: String,
                                priceLists: ClientePriceLists,
                                address: ClienteAddressReference,
                                webUser: ClienteWebUser
                                ) {
  def this(cliIdPadre: Int,
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
           usName: String,
           webUserActive: Boolean) = {
    this(
      cliIdPadre,
      "",
      cpgId,
      "",
      fpId,
      "",
      venId,
      "",
      clictId,
      "",
      cliIdReferido,
      "",
      proyId,
      "",
      ClientePriceLists(
        lpId,
        "",
        ldId,
        ""
      ),
      ClienteAddressReference(
        cpaId,
        "",
        proId,
        "",
        zonId,
        "",
        transId,
        ""
      ),
      ClienteWebUser(
        DBHelper.NoId,
        usName,
        webUserActive
      )
    )
  }
}

object ClienteReferences {

  def apply(cliIdPadre: Int,
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
            usName: String,
            webUserActive: Boolean) = {

    new ClienteReferences(
      cliIdPadre,
      cpaId,
      lpId,
      ldId,
      cpgId,
      proId,
      zonId,
      fpId,
      venId,
      transId,
      clictId,
      cliIdReferido,
      proyId,
      usName,
      webUserActive)
  }
}

case class ClienteSucursal(
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
                            paName: String,
                            proId: Int,
                            proName: String,
                            zonId: Int,
                            zonName: String
                         )

object ClienteSucursal {

  def apply(
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
             ) = {
    new ClienteSucursal(
      id,
      code,
      name,
      descrip,
      contacto,
      calle,
      calleNumero,
      piso,
      depto,
      codPostal,
      localidad,
      tel,
      fax,
      email,
      paId,
      "",
      proId,
      "",
      zonId,
      ""
    )
  }
}

case class ClienteEmpresa(
                             id: Int,
                             empId: Int,
                             empName: String
                             )

object ClienteEmpresa {

  def apply(id: Int, empId: Int) = {
    new ClienteEmpresa(id, empId, "")
  }
}

case class ClienteInforme(
                           perId: Int,
                           infId: Int,
                           infCode: String,
                           infName: String,
                           preId: Int
                           )

object ClienteInforme {

  def apply(preId: Int) = {
    new ClienteInforme(DBHelper.NoId, DBHelper.NoId, "", "", preId)
  }
}

case class ClienteCuentaGrupo(
                                 id: Int,
                                 cuegId: Int,
                                 cuegName: String,
                                 cueId: Int,
                                 cueName: String
                                 )

object ClienteCuentaGrupo {

  def apply(id: Int, cuegId: Int, cueId: Int) = {
    new ClienteCuentaGrupo(id, cuegId, "", cueId, "")
  }
}


case class ClientePercepcion(
                               id: Int,
                               percId: Int,
                               percName: String,
                               desde: Date,
                               hasta: Date
                               )

object ClientePercepcion {

  def apply(id: Int, percId: Int, desde: Date, hasta: Date) = {
    new ClientePercepcion(id, percId, "", desde, hasta)
  }
}

case class ClienteDepartamento(
                                  id: Int,
                                  dptoId: Int,
                                  dptoName: String
                                  )

object ClienteDepartamento {

  def apply(id: Int, dptoId: Int) = {
    new ClienteDepartamento(id, dptoId, "")
  }
}

case class ClienteContacto(
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

case class ClienteItems(
                           sucursales: List[ClienteSucursal],
                           empresas: List[ClienteEmpresa],
                           cuentasGrupo: List[ClienteCuentaGrupo],
                           percepciones: List[ClientePercepcion],
                           dptos: List[ClienteDepartamento],
                           contactos: List[ClienteContacto],
                           informes: List[ClienteInforme],
                           additionalFields: List[AdditionalFields],

                           /* only used in save */
                           sucursalDeleted: String,
                           cuentaGrupoDeleted: String,
                           percepcionDeleted: String,
                           departamentoDeleted: String,
                           contactoDeleted: String,
                           informeDeleted: String
                           )

case class Cliente(
                      id: Int,
                      active: Boolean,
                      code: String,

                      base: ClienteBase,
                      address: ClienteAddress,
                      references: ClienteReferences,

                      items: ClienteItems,

                      createdAt: Date,
                      updatedAt: Date,
                      updatedBy: Int) {

  def this(
            id: Int,
            active: Boolean,
            code: String,

            base: ClienteBase,
            address: ClienteAddress,
            references: ClienteReferences,

            items: ClienteItems) = {

    this(
      id,
      active,
      code,

      base,
      address,
      references,

      items,

      DateUtil.currentTime,
      DateUtil.currentTime,
      DBHelper.NoId)
  }

  def this(
            active: Boolean,
            code: String,

            base: ClienteBase,
            address: ClienteAddress,
            references: ClienteReferences,

            items: ClienteItems) = {

    this(
      DBHelper.NoId,
      active,
      code,

      base,
      address,
      references,

      items
    )
  }

}

case class ClienteInfo(
                          cpgId: Int,
                          cpgName: String,
                          cpgEsLibre: Boolean,
                          lpId: Int,
                          lpName: String,
                          ldId: Int,
                          ldName: String,
                          ivaRi: Boolean,
                          ivaRni: Boolean,
                          venId: Int,
                          venName: String,
                          transId: Int,
                          transName: String,
                          proId: Int,
                          proName: String
                          )

case class ClienteCuitInfo(
                            cliId: Int,
                            code: String,
                            razonSocial: String
                            )

object Cliente {

  lazy val emptyClienteItems = ClienteItems(List(), List(), List(), List(), List(), List(), List(), List(), "", "", "", "", "", "")

  lazy val emptyCliente = Cliente(
    false,
    "",

    ClienteBase("", "", false, 0, "", "", "", "", false, false, false, 0, 0, false, ""),
    ClienteAddress("", "", "", "", "", "", "", "", "", "", "", "", U.NO_DATE, U.NO_DATE, U.NO_DATE, U.NO_DATE),
    ClienteReferences(DBHelper.NoId, DBHelper.NoId, DBHelper.NoId, DBHelper.NoId, DBHelper.NoId, DBHelper.NoId,
      DBHelper.NoId, DBHelper.NoId, DBHelper.NoId, DBHelper.NoId, DBHelper.NoId, DBHelper.NoId, DBHelper.NoId, "", false),

    emptyClienteItems
  )

  def apply(
            id: Int,
            active: Boolean,
            code: String,

            base: ClienteBase,
            address: ClienteAddress,
            references: ClienteReferences,

            items: ClienteItems
            ) = {

    new Cliente(
      id,
      active,
      code,

      base,
      address,
      references,

      items
    )
  }

  def apply(
             id: Int,
             active: Boolean,
             code: String,

             base: ClienteBase,
             address: ClienteAddress,
             references: ClienteReferences
             ) = {

    new Cliente(
      id,
      active,
      code,

      base,
      address,
      references,

      emptyClienteItems
    )
  }

  def apply(
             active: Boolean,
             code: String,

             base: ClienteBase,
             address: ClienteAddress,
             references: ClienteReferences,

             items: ClienteItems
             ) = {

    new Cliente(
      active,
      code,

      base,
      address,
      references,

      items
    )
  }

  def apply(
             active: Boolean,
             code: String,

             base: ClienteBase,
             address: ClienteAddress,
             references: ClienteReferences
             ) = {

    new Cliente(
      active,
      code,

      base,
      address,
      references,

      emptyClienteItems
    )
  }

  private val clienteSucursalParser: RowParser[ClienteSucursal] = {
    SqlParser.get[Int](C.CLIS_ID) ~
    SqlParser.get[String](C.CLIS_CODE) ~
    SqlParser.get[String](C.CLIS_NAME) ~
    SqlParser.get[String](C.CLIS_DESCRIP) ~
    SqlParser.get[String](C.CLIS_CONTACTO) ~
    SqlParser.get[String](C.CLIS_CALLE) ~
    SqlParser.get[String](C.CLIS_CALLE_NUMERO) ~
    SqlParser.get[String](C.CLIS_PISO) ~
    SqlParser.get[String](C.CLIS_DEPTO) ~
    SqlParser.get[String](C.CLIS_COD_POSTAL) ~
    SqlParser.get[String](C.CLIS_LOCALIDAD) ~
    SqlParser.get[String](C.CLIS_TEL) ~
    SqlParser.get[String](C.CLIS_FAX) ~
    SqlParser.get[String](C.CLIS_EMAIL) ~
    SqlParser.get[Option[Int]](C.PA_ID) ~
    SqlParser.get[Option[String]](C.PA_NAME) ~
    SqlParser.get[Option[Int]](C.PRO_ID) ~
    SqlParser.get[Option[String]](C.PRO_NAME) ~
    SqlParser.get[Option[Int]](C.ZON_ID) ~
    SqlParser.get[Option[String]](C.ZON_NAME) map {
    case
        id ~
        code ~
        name ~
        descrip ~
        contacto ~
        calle ~
        calleNumero ~
        piso ~
        depto ~
        codPostal ~
        localidad ~
        tel ~
        fax ~
        email ~
        paId ~
        paName ~
        proId ~
        proName ~
        zonId ~
        zonName =>
        ClienteSucursal(
          id,
          code,
          name,
          descrip,
          contacto,
          calle,
          calleNumero,
          piso,
          depto,
          codPostal,
          localidad,
          tel,
          fax,
          email,
          paId.getOrElse(DBHelper.NoId),
          paName.getOrElse(""),
          proId.getOrElse(DBHelper.NoId),
          proName.getOrElse(""),
          zonId.getOrElse(DBHelper.NoId),
          zonName.getOrElse(""))
    }
  }

  private val clienteEmpresaParser: RowParser[ClienteEmpresa] = {
    SqlParser.get[Int](C.EMP_CLI_ID) ~
    SqlParser.get[Int](C.EMP_ID) ~
    SqlParser.get[String](C.EMP_NAME) map {
    case
        id ~
        empId ~
        empName =>
        ClienteEmpresa(
          id,
          empId,
          empName)
    }
  }

  private val clienteCuentaGrupoParser: RowParser[ClienteCuentaGrupo] = {
    SqlParser.get[Int](C.CLI_CUEG_ID) ~
    SqlParser.get[Int](C.CUEG_ID) ~
    SqlParser.get[String](C.CUEG_NAME) ~
    SqlParser.get[Int](C.CUE_ID) ~
    SqlParser.get[String](C.CUE_NAME) map {
    case
        id ~
        cuegId ~
        cuegName ~
        cueId ~
        cueName =>
        ClienteCuentaGrupo(
          id,
          cuegId,
          cuegName,
          cueId,
          cueName)
    }
  }

  private val clientePercepcionParser: RowParser[ClientePercepcion] = {
    SqlParser.get[Int](C.CLI_PERC_ID) ~
    SqlParser.get[Int](C.PERC_ID) ~
    SqlParser.get[String](C.PERC_NAME) ~
    SqlParser.get[Date](C.CLI_PERC_DESDE) ~
    SqlParser.get[Date](C.CLI_PERC_HASTA) map {
    case
        id ~
        percId ~
        percName ~
        desde ~
        hasta =>
        ClientePercepcion(
          id,
          percId,
          percName,
          desde,
          hasta)
    }
  }

  private val clienteDptoParser: RowParser[ClienteDepartamento] = {
    SqlParser.get[Int](C.DPTO_CLI_ID) ~
    SqlParser.get[Int](C.DPTO_ID) ~
    SqlParser.get[String](C.DPTO_NAME) map {
    case
        id ~
        dptoId ~
        dptoName =>
        ClienteDepartamento(
          id,
          dptoId,
          dptoName)
    }
  }

  private val clienteContactoParser: RowParser[ClienteContacto] = {
    SqlParser.get[Int](C.CONT_ID) ~
    SqlParser.get[String](C.CONT_CODE) ~
    SqlParser.get[String](C.CONT_NAME) ~
    SqlParser.get[String](C.CONT_DESCRIP) ~
    SqlParser.get[String](C.CONT_TEL) ~
    SqlParser.get[String](C.CONT_CELULAR) ~
    SqlParser.get[String](C.CONT_EMAIL) ~
    SqlParser.get[String](C.CONT_CARGO) ~
    SqlParser.get[String](C.CONT_DIRECCION) ~
    SqlParser.get[Int](DBHelper.ACTIVE) map {
    case
        id ~
        code ~
        name ~
        descrip ~
        tel ~
        mobile ~
        email ~
        cargo ~
        address ~
        active =>
        ClienteContacto(
          id,
          code,
          name,
          descrip,
          tel,
          mobile,
          email,
          cargo,
          address,
          active != 0)
    }
  }

  private val clienteInformeParser: RowParser[ClienteInforme] = {
    SqlParser.get[Int](C.PER_ID) ~
    SqlParser.get[Int](C.INF_ID) ~
    SqlParser.get[String](C.INF_CODE) ~
    SqlParser.get[String](C.INF_NAME) ~
    SqlParser.get[Int](C.PRE_ID) map {
    case
        perId ~
        infId ~
        code ~
        name ~
        preId =>
      ClienteInforme(
        perId,
        infId,
        code,
        name,
        preId)
    }
  }

  private val clienteParser: RowParser[Cliente] = {
    SqlParser.get[Int](C.CLI_ID) ~
    SqlParser.get[Int](DBHelper.ACTIVE) ~
    SqlParser.get[String](C.CLI_CODE) ~
    SqlParser.get[String](C.CLI_NAME) ~
    SqlParser.get[String](C.CLI_RAZONSOCIAL) ~
    SqlParser.get[Int](C.CLI_ES_PROSPECTO) ~
    SqlParser.get[Int](C.CLI_CAT_FISCAL) ~
    SqlParser.get[String](C.CLI_CUIT) ~
    SqlParser.get[String](C.CLI_INGRESOSBRUTOS) ~
    SqlParser.get[String](C.CLI_CONTACTO) ~
    SqlParser.get[String](C.CLI_CHEQUEORDEN) ~
    SqlParser.get[Int](C.CLI_EXIGE_TRANSPORTE) ~
    SqlParser.get[Int](C.CLI_EXIGE_PROVINCIA) ~
    SqlParser.get[Int](C.CLI_PCIA_TRANSPORTE) ~
    SqlParser.get[BigDecimal](C.CLI_CREDITOCTACTE) ~
    SqlParser.get[BigDecimal](C.CLI_CREDITOTOTAL) ~
    SqlParser.get[Int](C.CLI_CREDITOACTIVO) ~
    SqlParser.get[String](C.CLI_DESCRIP) ~
    SqlParser.get[String](C.CLI_CALLE) ~
    SqlParser.get[String](C.CLI_CALLENUMERO) ~
    SqlParser.get[String](C.CLI_PISO) ~
    SqlParser.get[String](C.CLI_DEPTO) ~
    SqlParser.get[String](C.CLI_CODPOSTAL) ~
    SqlParser.get[String](C.CLI_LOCALIDAD) ~
    SqlParser.get[String](C.CLI_TEL) ~
    SqlParser.get[String](C.CLI_FAX) ~
    SqlParser.get[String](C.CLI_EMAIL) ~
    SqlParser.get[String](C.CLI_WEB) ~
    SqlParser.get[String](C.CLI_MESSENGER) ~
    SqlParser.get[String](C.CLI_YAHOO) ~
    SqlParser.get[Date](C.CLI_HORARIO_MDESDE) ~
    SqlParser.get[Date](C.CLI_HORARIO_MHASTA) ~
    SqlParser.get[Date](C.CLI_HORARIO_TDESDE) ~
    SqlParser.get[Date](C.CLI_HORARIO_THASTA) ~
    SqlParser.get[Option[Int]](C.CLI_ID_PADRE) ~
    SqlParser.get[Option[String]](C.CLI_NOMBRE_PADRE) ~
    SqlParser.get[Option[Int]](C.CPA_ID) ~
    SqlParser.get[Option[String]](C.CPA_CODE) ~
    SqlParser.get[Option[Int]](C.LP_ID) ~
    SqlParser.get[Option[String]](C.LP_NAME) ~
    SqlParser.get[Option[Int]](C.LD_ID) ~
    SqlParser.get[Option[String]](C.LD_NAME) ~
    SqlParser.get[Option[Int]](C.CPG_ID) ~
    SqlParser.get[Option[String]](C.CPG_NAME) ~
    SqlParser.get[Option[Int]](C.PRO_ID) ~
    SqlParser.get[Option[String]](C.PRO_NAME) ~
    SqlParser.get[Option[Int]](C.ZON_ID) ~
    SqlParser.get[Option[String]](C.ZON_NAME) ~
    SqlParser.get[Option[Int]](C.FP_ID) ~
    SqlParser.get[Option[String]](C.FP_NAME) ~
    SqlParser.get[Option[Int]](C.VEN_ID) ~
    SqlParser.get[Option[String]](C.VEN_NAME) ~
    SqlParser.get[Option[Int]](C.TRANS_ID) ~
    SqlParser.get[Option[String]](C.TRANS_NAME) ~
    SqlParser.get[Option[Int]](C.CLICT_ID) ~
    SqlParser.get[Option[String]](C.CLICT_NAME) ~
    SqlParser.get[Option[Int]](C.CLI_ID_REFERIDO) ~
    SqlParser.get[Option[String]](C.REFERIDO) ~
    SqlParser.get[Option[Int]](C.PROY_ID) ~
    SqlParser.get[Option[String]](C.PROY_NAME) ~
    SqlParser.get[Option[Int]](C.US_ID) ~
    SqlParser.get[Option[String]](C.US_NAME) ~
    SqlParser.get[Option[Int]](C.US_ACTIVO) ~
    SqlParser.get[Date](DBHelper.CREATED_AT) ~
    SqlParser.get[Date](DBHelper.UPDATED_AT) ~
    SqlParser.get[Int](DBHelper.UPDATED_BY) map {
      case
          id ~
          active ~
          code ~
          name ~
          razonSocial ~
          esProspecto ~
          catFiscal ~
          cuit ~
          ingresosBrutos ~
          contacto ~
          chequeOrden ~
          exigeTransporte ~
          exigeProvincia ~
          pciaTransporte ~
          creditoCtaCte ~
          creditoTotal ~
          creditoActivo ~
          descrip ~

          calle ~
          calleNumero ~
          piso ~
          depto ~
          codPostal ~
          localidad ~
          tel ~
          fax ~
          email ~
          web  ~
          messenger  ~
          yahoo  ~
          horarioMDesde ~
          horarioMHasta ~
          horarioTDesde ~
          horarioTHasta ~

          cliIdPadre ~
          padre ~
          cpaId ~
          cpaCode ~
          lpId ~
          lpName ~
          ldId ~
          ldName ~
          cpgId ~
          cpgName ~
          proId ~
          proName ~
          zonId ~
          zonName ~
          fpId ~
          fpName ~
          venId ~
          venName ~
          transId ~
          transName ~
          clictId ~
          clictName ~
          cliIdReferido ~
          referido ~
          proyId ~
          proyName ~

          usId ~
          webUsName ~
          webUserActive ~

          createdAt ~
          updatedAt ~
          updatedBy =>
        Cliente(
          id,
          active != 0,
          code,
          ClienteBase(
            name,
            razonSocial,
            esProspecto != 0,
            catFiscal,
            cuit,
            ingresosBrutos,
            contacto,
            chequeOrden,
            exigeTransporte != 0,
            exigeProvincia != 0,
            pciaTransporte != 0,
            creditoCtaCte.doubleValue,
            creditoTotal.doubleValue,
            creditoActivo != 0,
            descrip),
          ClienteAddress(
            calle,
            calleNumero,
            piso,
            depto,
            codPostal,
            localidad,
            tel,
            fax,
            email,
            web,
            messenger,
            yahoo,
            horarioMDesde,
            horarioMHasta,
            horarioTDesde,
            horarioTHasta),
          ClienteReferences(
            cliIdPadre.getOrElse(DBHelper.NoId),
            padre.getOrElse(""),
            cpgId.getOrElse(DBHelper.NoId),
            cpgName.getOrElse(""),
            fpId.getOrElse(DBHelper.NoId),
            fpName.getOrElse(""),
            venId.getOrElse(DBHelper.NoId),
            venName.getOrElse(""),
            clictId.getOrElse(DBHelper.NoId),
            clictName.getOrElse(""),
            cliIdReferido.getOrElse(DBHelper.NoId),
            referido.getOrElse(""),
            proyId.getOrElse(DBHelper.NoId),
            proyName.getOrElse(""),
            ClientePriceLists(
              lpId.getOrElse(DBHelper.NoId),
              lpName.getOrElse(""),
              ldId.getOrElse(DBHelper.NoId),
              ldName.getOrElse("")
            ),
            ClienteAddressReference(
              cpaId.getOrElse(DBHelper.NoId),
              cpaCode.getOrElse(""),
              proId.getOrElse(DBHelper.NoId),
              proName.getOrElse(""),
              zonId.getOrElse(DBHelper.NoId),
              zonName.getOrElse(""),
              transId.getOrElse(DBHelper.NoId),
              transName.getOrElse("")
            ),
            ClienteWebUser(
              usId.getOrElse(DBHelper.NoId),
              webUsName.getOrElse(""),
              webUserActive.getOrElse(0) != 0
            )),
          emptyClienteItems,
          createdAt,
          updatedAt,
          updatedBy)
    }
  }

  def create(user: CompanyUser, cliente: Cliente): Cliente = {
    save(user, cliente, true)
  }

  def update(user: CompanyUser, cliente: Cliente): Cliente = {
    save(user, cliente, false)
  }

  private def save(user: CompanyUser, cliente: Cliente, isNew: Boolean): Cliente = {
    def getFields = {
      List(
        Field(DBHelper.ACTIVE, Register.boolToInt(cliente.active), FieldType.boolean),
        Field(C.CLI_CODE, cliente.code, FieldType.text),

        Field(C.CLI_NAME, cliente.base.name, FieldType.text),
        Field(C.CLI_RAZONSOCIAL, cliente.base.razonSocial, FieldType.text),
        Field(C.CLI_ES_PROSPECTO, Register.boolToInt(cliente.base.esProspecto), FieldType.boolean),
        Field(C.CLI_CUIT, cliente.base.cuit, FieldType.text),
        Field(C.CLI_INGRESOSBRUTOS, cliente.base.ingresosBrutos, FieldType.text),
        Field(C.CLI_CONTACTO, cliente.base.contacto, FieldType.text),
        Field(C.CLI_CHEQUEORDEN, cliente.base.chequeOrden, FieldType.text),
        Field(C.CLI_EXIGE_TRANSPORTE, Register.boolToInt(cliente.base.exigeTransporte), FieldType.text),
        Field(C.CLI_EXIGE_PROVINCIA, Register.boolToInt(cliente.base.exigeProvincia), FieldType.boolean),
        Field(C.CLI_PCIA_TRANSPORTE, Register.boolToInt(cliente.base.pciaTransporte), FieldType.boolean),

        Field(C.CLI_CREDITOCTACTE, cliente.base.creditoCtaCte, FieldType.number),
        Field(C.CLI_CREDITOTOTAL, cliente.base.creditoTotal, FieldType.number),
        Field(C.CLI_CREDITOACTIVO, Register.boolToInt(cliente.base.creditoActivo), FieldType.boolean),
        Field(C.CLI_DESCRIP, cliente.base.descrip, FieldType.text),

        Field(C.CLI_CALLE, cliente.address.calle, FieldType.text),
        Field(C.CLI_CALLENUMERO, cliente.address.calleNumero, FieldType.text),
        Field(C.CLI_PISO, cliente.address.piso, FieldType.text),
        Field(C.CLI_DEPTO, cliente.address.depto, FieldType.text),
        Field(C.CLI_CODPOSTAL, cliente.address.codPostal, FieldType.text),
        Field(C.CLI_LOCALIDAD, cliente.address.localidad, FieldType.text),
        Field(C.CLI_HORARIO_MDESDE, cliente.address.horarioMDesde, FieldType.date),
        Field(C.CLI_HORARIO_MHASTA, cliente.address.horarioMHasta, FieldType.date),
        Field(C.CLI_HORARIO_TDESDE, cliente.address.horarioTDesde, FieldType.date),
        Field(C.CLI_HORARIO_THASTA, cliente.address.horarioTHasta, FieldType.date),
        Field(C.CLI_TEL, cliente.address.tel, FieldType.text),
        Field(C.CLI_FAX, cliente.address.fax, FieldType.text),
        Field(C.CLI_EMAIL, cliente.address.email, FieldType.text),
        Field(C.CLI_WEB, cliente.address.web, FieldType.text),
        Field(C.CLI_MESSENGER, cliente.address.messenger, FieldType.text),
        Field(C.CLI_YAHOO, cliente.address.yahoo, FieldType.text),

        Field(C.CLI_ID_PADRE, cliente.references.cliIdPadre, FieldType.id),
        Field(C.CPA_ID, cliente.references.address.cpaId, FieldType.id),
        Field(C.LP_ID, cliente.references.priceLists.lpId, FieldType.id),
        Field(C.LD_ID, cliente.references.priceLists.ldId, FieldType.id),
        Field(C.CPG_ID, cliente.references.cpgId, FieldType.id),
        Field(C.PRO_ID, cliente.references.address.proId, FieldType.id),
        Field(C.ZON_ID, cliente.references.address.zonId, FieldType.id),
        Field(C.FP_ID, cliente.references.fpId, FieldType.id),
        Field(C.VEN_ID, cliente.references.venId, FieldType.id),
        Field(C.TRANS_ID, cliente.references.address.transId, FieldType.id),
        Field(C.CLICT_ID, cliente.references.clictId, FieldType.id),
        Field(C.CLI_ID_REFERIDO, cliente.references.cliIdReferido, FieldType.id),
        Field(C.PROY_ID, cliente.references.proyId, FieldType.id)
      )
    }

    def getSucursalFields(sucursal: ClienteSucursal, cliId: Int) = {
      List(
        Field(C.CLI_ID, cliId, FieldType.id),
        Field(C.CLIS_CODE, sucursal.code, FieldType.text),
        Field(C.CLIS_NAME, sucursal.name, FieldType.text),
        Field(C.CLIS_DESCRIP, sucursal.descrip, FieldType.text),
        Field(C.CLIS_CONTACTO, sucursal.contacto, FieldType.text),
        Field(C.CLIS_CALLE, sucursal.calle, FieldType.text),
        Field(C.CLIS_CALLE_NUMERO, sucursal.calleNumero, FieldType.text),
        Field(C.CLIS_PISO, sucursal.piso, FieldType.text),
        Field(C.CLIS_DEPTO, sucursal.depto, FieldType.text),
        Field(C.CLIS_COD_POSTAL, sucursal.codPostal, FieldType.text),
        Field(C.CLIS_LOCALIDAD, sucursal.localidad, FieldType.text),
        Field(C.CLIS_TEL, sucursal.tel, FieldType.text),
        Field(C.CLIS_FAX, sucursal.fax, FieldType.text),
        Field(C.CLIS_EMAIL, sucursal.email, FieldType.text),
        Field(C.PA_ID, sucursal.paId, FieldType.id),
        Field(C.PRO_ID, sucursal.proId, FieldType.id),
        Field(C.ZON_ID, sucursal.zonId, FieldType.id)
      )
    }

    def getEmpresaFields(empresa: ClienteEmpresa, cliId: Int) = {
      List(
        Field(C.CLI_ID, cliId, FieldType.id),
        Field(C.EMP_ID, empresa.empId, FieldType.id)
      )
    }

    def getCuentaGrupoFields(cuentaGrupo: ClienteCuentaGrupo, cliId: Int) = {
      List(
        Field(C.CLI_ID, cliId, FieldType.id),
        Field(C.CUEG_ID, cuentaGrupo.cuegId, FieldType.id),
        Field(C.CUE_ID, cuentaGrupo.cueId, FieldType.id)
      )
    }

    def getPercepcionFields(percepcion: ClientePercepcion, cliId: Int) = {
      List(
        Field(C.CLI_ID, cliId, FieldType.id),
        Field(C.PERC_ID, percepcion.percId, FieldType.id),
        Field(C.CLI_PERC_DESDE, percepcion.desde, FieldType.date),
        Field(C.CLI_PERC_HASTA, percepcion.hasta, FieldType.date)
      )
    }

    def getDepartamentoFields(departamento: ClienteDepartamento, cliId: Int) = {
      List(
        Field(C.CLI_ID, cliId, FieldType.id),
        Field(C.DPTO_ID, departamento.dptoId, FieldType.id)
      )
    }

    def getContactoFields(contacto: ClienteContacto, cliId: Int) = {
      List(
        Field(C.CLI_ID, cliId, FieldType.id),
        Field(C.CONT_CODE, contacto.code, FieldType.text),
        Field(C.CONT_NAME, contacto.name, FieldType.text),
        Field(C.CONT_DESCRIP, contacto.descrip, FieldType.text),
        Field(C.CONT_TEL, contacto.tel, FieldType.text),
        Field(C.CONT_CELULAR, contacto.mobile, FieldType.text),
        Field(C.CONT_EMAIL, contacto.email, FieldType.text),
        Field(C.CONT_CARGO, contacto.cargo, FieldType.text),
        Field(C.CONT_DIRECCION, contacto.address, FieldType.text),
        Field(DBHelper.ACTIVE, Register.boolToInt(contacto.active), FieldType.boolean)
      )
    }

    def throwException = {
      throw new RuntimeException(s"Error when saving ${C.CLIENTE}")
    }

    case class ClienteSucursalInfo(cliId: Int, item: ClienteSucursal)

    def saveSucursal(itemInfo: ClienteSucursalInfo) = {
      DBHelper.save(
        user,
        Register(
          C.CLIENTE_SUCURSAL,
          C.CLIS_ID,
          itemInfo.item.id,
          false,
          true,
          true,
          getSucursalFields(itemInfo.item, itemInfo.cliId)),
        itemInfo.item.id == DBHelper.NewId
      ) match {
        case SaveResult(true, id) => true
        case SaveResult(false, _) => throwException
      }
    }

    def saveSucursales(cliId: Int) = {
      DBHelper.deleteItems(user, C.CLIENTE_SUCURSAL, C.CLIS_ID, cliente.items.sucursalDeleted, s" AND prov_id = ${cliId}")
      cliente.items.sucursales.map(sucursal => saveSucursal(ClienteSucursalInfo(cliId, sucursal)))
    }

    case class ClienteEmpresaInfo(cliId: Int, item: ClienteEmpresa)

    def saveEmpresa(itemInfo: ClienteEmpresaInfo) = {
      DBHelper.save(
        user,
        Register(
          C.EMPRESA_CLIENTE,
          C.EMP_CLI_ID,
          DBHelper.NoId,
          false,
          true,
          true,
          getEmpresaFields(itemInfo.item, itemInfo.cliId)),
        true
      ) match {
        case SaveResult(true, id) => true
        case SaveResult(false, _) => throwException
      }
    }

    def saveEmpresas(cliId: Int) = {
      DBHelper.deleteItems(user, C.EMPRESA_CLIENTE, C.CLI_ID, cliId.toString, "")
      cliente.items.empresas.map(empresa => saveEmpresa(ClienteEmpresaInfo(cliId, empresa)))
    }

    case class ClienteCuentaGrupoInfo(cliId: Int, item: ClienteCuentaGrupo)

    def saveCuentaGrupo(itemInfo: ClienteCuentaGrupoInfo) = {
      DBHelper.save(
        user,
        Register(
          C.CLIENTE_CUENTA_GRUPO,
          C.CLI_CUEG_ID,
          itemInfo.item.id,
          false,
          true,
          true,
          getCuentaGrupoFields(itemInfo.item, itemInfo.cliId)),
        itemInfo.item.id == DBHelper.NewId
      ) match {
        case SaveResult(true, id) => true
        case SaveResult(false, _) => throwException
      }
    }

    def saveCuentasGrupo(cliId: Int) = {
      cliente.items.cuentasGrupo.map(cuentaGrupo => saveCuentaGrupo(ClienteCuentaGrupoInfo(cliId, cuentaGrupo)))
      DBHelper.deleteItems(user, C.CLIENTE_CUENTA_GRUPO, C.CLI_CUEG_ID, cliente.items.cuentaGrupoDeleted, s" AND prov_id = ${cliId}")
    }

    case class ClientePercepcionInfo(cliId: Int, item: ClientePercepcion)

    def savePercepcion(itemInfo: ClientePercepcionInfo) = {
      DBHelper.save(
        user,
        Register(
          C.CLIENTE_PERCEPCION,
          C.CLI_PERC_ID,
          itemInfo.item.id,
          false,
          true,
          true,
          getPercepcionFields(itemInfo.item, itemInfo.cliId)),
        itemInfo.item.id == DBHelper.NewId
      ) match {
        case SaveResult(true, id) => true
        case SaveResult(false, _) => throwException
      }
    }

    def savePercepciones(cliId: Int) = {
      DBHelper.deleteItems(user, C.CLIENTE_PERCEPCION, C.CLI_PERC_ID, cliente.items.percepcionDeleted, s" AND prov_id = ${cliId}")
      cliente.items.percepciones.map(percepcion => savePercepcion(ClientePercepcionInfo(cliId, percepcion)))
    }

    case class ClienteDepartamentoInfo(cliId: Int, item: ClienteDepartamento)

    def saveDepartamento(itemInfo: ClienteDepartamentoInfo) = {
      DBHelper.save(
        user,
        Register(
          C.DEPARTAMENTO_CLIENTE,
          C.DPTO_CLI_ID,
          itemInfo.item.id,
          false,
          false,
          false,
          getDepartamentoFields(itemInfo.item, itemInfo.cliId)),
        itemInfo.item.id == DBHelper.NewId
      ) match {
        case SaveResult(true, id) => true
        case SaveResult(false, _) => throwException
      }
    }

    def saveDepartamentos(cliId: Int) = {
      DBHelper.deleteItems(user, C.DEPARTAMENTO_CLIENTE, C.DPTO_CLI_ID, cliente.items.departamentoDeleted, s" AND prov_id = ${cliId}")
      cliente.items.dptos.map(departamento => saveDepartamento(ClienteDepartamentoInfo(cliId, departamento)))
    }

    case class ClienteContactoInfo(cliId: Int, item: ClienteContacto)

    def saveContacto(itemInfo: ClienteContactoInfo) = {
      DBHelper.save(
        user,
        Register(
          C.CONTACTO,
          C.CONT_ID,
          itemInfo.item.id,
          false,
          false,
          false,
          getContactoFields(itemInfo.item, itemInfo.cliId)),
        itemInfo.item.id == DBHelper.NewId
      ) match {
        case SaveResult(true, id) => true
        case SaveResult(false, _) => throwException
      }
    }

    def saveContactos(cliId: Int) = {
      DBHelper.deleteItems(user, C.CONTACTO, C.CONT_ID, cliente.items.contactoDeleted, s" AND prov_id = ${cliId}")
      cliente.items.contactos.map(contacto => saveContacto(ClienteContactoInfo(cliId, contacto)))
    }
    
    DBHelper.saveEx(
      user,
      Register(
        C.CLIENTE,
        C.CLI_ID,
        cliente.id,
        false,
        true,
        true,
        getFields),
      isNew,
      C.CLI_CODE
    ) match {
      case SaveResult(true, id) => {
        saveSucursales(id)
        saveEmpresas(id)
        saveCuentasGrupo(id)
        savePercepciones(id)
        saveDepartamentos(id)
        saveContactos(id)
        load(user, id).getOrElse(throwException)
      }
      case SaveResult(false, _) => throwException
    }
  }

  def load(user: CompanyUser, id: Int): Option[Cliente] = {

    DB.withTransaction(user.database.database) { implicit connection =>

      val sql = "{call sp_cliente_get(?, ?)}"
      val cs = connection.prepareCall(sql)

      cs.setInt(1, id)
      cs.registerOutParameter(2, Types.OTHER)

      try {
        cs.execute()

        val rs = cs.getObject(2).asInstanceOf[java.sql.ResultSet]
        Sql.as(clienteParser.singleOpt, rs)

      } catch {
        case NonFatal(e) => {
          Logger.error(s"can't get ${C.CLIENTE} with id $id for user ${user.toString}. Error ${e.toString}")
          throw e
        }
      } finally {
        cs.close
      }
    }
  }

  private def loadClienteItems(user: CompanyUser, id: Int) = {
    ClienteItems(
      loadSucursal(user, id),
      loadEmpresas(user, id),
      loadCuentasGrupo(user, id),
      loadPercepciones(user, id),
      loadDptos(user, id),
      loadContactos(user, id),
      loadInformes(user, id),
      List(), "", "", "", "", "", "")
  }

  private def loadSucursal(user: CompanyUser, id: Int) = {

    DB.withTransaction(user.database.database) { implicit connection =>

      val sql = "{call sp_cliente_get_sucursales(?, ?)}"
      val cs = connection.prepareCall(sql)

      cs.setInt(1, id)
      cs.registerOutParameter(2, Types.OTHER)

      try {
        cs.execute()

        val rs = cs.getObject(2).asInstanceOf[java.sql.ResultSet]
        Sql.as(clienteSucursalParser.*, rs)

      } catch {
        case NonFatal(e) => {
          Logger.error(s"can't get ${C.CLIENTE_SUCURSAL} with id $id for user ${user.toString}. Error ${e.toString}")
          throw e
        }
      } finally {
        cs.close
      }
    }
  }

  private def loadEmpresas(user: CompanyUser, id: Int) = {

    DB.withTransaction(user.database.database) { implicit connection =>

      val sql = "{call sp_cliente_get_empresas(?, ?)}"
      val cs = connection.prepareCall(sql)

      cs.setInt(1, id)
      cs.registerOutParameter(2, Types.OTHER)

      try {
        cs.execute()

        val rs = cs.getObject(2).asInstanceOf[java.sql.ResultSet]
        Sql.as(clienteEmpresaParser.*, rs)

      } catch {
        case NonFatal(e) => {
          Logger.error(s"can't get ${C.EMPRESA_CLIENTE} with id $id for user ${user.toString}. Error ${e.toString}")
          throw e
        }
      } finally {
        cs.close
      }
    }
  }

  private def loadCuentasGrupo(user: CompanyUser, id: Int) = {

    DB.withTransaction(user.database.database) { implicit connection =>

      val sql = "{call sp_cliente_get_cuentas_grupo(?, ?)}"
      val cs = connection.prepareCall(sql)

      cs.setInt(1, id)
      cs.registerOutParameter(2, Types.OTHER)

      try {
        cs.execute()

        val rs = cs.getObject(2).asInstanceOf[java.sql.ResultSet]
        Sql.as(clienteCuentaGrupoParser.*, rs)

      } catch {
        case NonFatal(e) => {
          Logger.error(s"can't get ${C.CLIENTE_CUENTA_GRUPO} with id $id for user ${user.toString}. Error ${e.toString}")
          throw e
        }
      } finally {
        cs.close
      }
    }
  }

  private def loadPercepciones(user: CompanyUser, id: Int) = {

    DB.withTransaction(user.database.database) { implicit connection =>

      val sql = "{call sp_cliente_get_percepciones(?, ?)}"
      val cs = connection.prepareCall(sql)

      cs.setInt(1, id)
      cs.registerOutParameter(2, Types.OTHER)

      try {
        cs.execute()

        val rs = cs.getObject(2).asInstanceOf[java.sql.ResultSet]
        Sql.as(clientePercepcionParser.*, rs)

      } catch {
        case NonFatal(e) => {
          Logger.error(s"can't get ${C.CLIENTE_PERCEPCION} with id $id for user ${user.toString}. Error ${e.toString}")
          throw e
        }
      } finally {
        cs.close
      }
    }
  }

  private def loadDptos(user: CompanyUser, id: Int) = {

    DB.withTransaction(user.database.database) { implicit connection =>

      val sql = "{call sp_cliente_get_dptos(?, ?)}"
      val cs = connection.prepareCall(sql)

      cs.setInt(1, id)
      cs.registerOutParameter(2, Types.OTHER)

      try {
        cs.execute()

        val rs = cs.getObject(2).asInstanceOf[java.sql.ResultSet]
        Sql.as(clienteDptoParser.*, rs)

      } catch {
        case NonFatal(e) => {
          Logger.error(s"can't get ${C.DEPARTAMENTO_CLIENTE} with id $id for user ${user.toString}. Error ${e.toString}")
          throw e
        }
      } finally {
        cs.close
      }
    }
  }

  private def loadContactos(user: CompanyUser, id: Int) = {

    DB.withTransaction(user.database.database) { implicit connection =>

      val sql = "{call sp_cliente_get_contactos(?, ?)}"
      val cs = connection.prepareCall(sql)

      cs.setInt(1, id)
      cs.registerOutParameter(2, Types.OTHER)

      try {
        cs.execute()

        val rs = cs.getObject(2).asInstanceOf[java.sql.ResultSet]
        Sql.as(clienteContactoParser.*, rs)

      } catch {
        case NonFatal(e) => {
          Logger.error(s"can't get ${C.CONTACTO} with id $id for user ${user.toString}. Error ${e.toString}")
          throw e
        }
      } finally {
        cs.close
      }
    }
  }

  private def loadInformes(user: CompanyUser, id: Int) = {

    DB.withTransaction(user.database.database) { implicit connection =>

      val sql = "{call sp_cliente_get_informes(?, ?)}"
      val cs = connection.prepareCall(sql)

      cs.setInt(1, id)
      cs.registerOutParameter(2, Types.OTHER)

      try {
        cs.execute()

        val rs = cs.getObject(2).asInstanceOf[java.sql.ResultSet]
        Sql.as(clienteInformeParser.*, rs)

      } catch {
        case NonFatal(e) => {
          Logger.error(s"can't get ${C.INFORME} with id $id for user ${user.toString}. Error ${e.toString}")
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
        SQL("select * from sp_cliente_delete({id})")
          .on('id -> id)
          .execute
      } catch {
        case NonFatal(e) => {
          Logger.error(s"can't delete a ${C.CLIENTE}. ${C.CLI_ID} id: $id. Error ${e.toString}")
          throw e
        }
      }
    }
  }

  def get(user: CompanyUser, id: Int): Cliente = {
    load(user, id) match {
      case Some(p) => {
        Cliente(
          p.id,
          p.active,
          p.code,

          p.base,

          p.address,
          p.references,

          loadClienteItems(user, id)
        )
      }
      case None => Cliente(
        emptyCliente.id,
        emptyCliente.active,
        emptyCliente.code,

        emptyCliente.base,

        emptyCliente.address,
        emptyCliente.references,

        loadClienteItems(user, id)
      )
    }
  }
  
  def info(user: CompanyUser, id: Int, docId: Int): ClienteInfo = {

    DB.withTransaction(user.database.database) { implicit connection =>

      val sql = "{call sp_cliente_get_info(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)}"
      val cs = connection.prepareCall(sql)

      cs.setInt(1, id)
      cs.setInt(2, docId)
      cs.registerOutParameter(3, Types.INTEGER)
      cs.registerOutParameter(4, Types.VARCHAR)
      cs.registerOutParameter(5, Types.SMALLINT)
      cs.registerOutParameter(6, Types.INTEGER)
      cs.registerOutParameter(7, Types.VARCHAR)
      cs.registerOutParameter(8, Types.INTEGER)
      cs.registerOutParameter(9, Types.VARCHAR)
      cs.registerOutParameter(10, Types.SMALLINT)
      cs.registerOutParameter(11, Types.SMALLINT)
      cs.registerOutParameter(12, Types.INTEGER)
      cs.registerOutParameter(13, Types.VARCHAR)
      cs.registerOutParameter(14, Types.INTEGER)
      cs.registerOutParameter(15, Types.VARCHAR)
      cs.registerOutParameter(16, Types.INTEGER)
      cs.registerOutParameter(17, Types.VARCHAR)

      try {
        cs.execute()

        ClienteInfo(
          cs.getInt(3),
          cs.getString(4),
          cs.getShort(5) != 0,
          cs.getInt(6),
          cs.getString(7),
          cs.getInt(8),
          cs.getString(9),
          cs.getShort(10) != 0,
          cs.getShort(11) != 0,
          cs.getInt(12),
          cs.getString(13),
          cs.getInt(14),
          cs.getString(15),
          cs.getInt(16),
          cs.getString(17)
        )

      } catch {
        case NonFatal(e) => {
          Logger.error(s"can't get cliente info with cliId $id and docId $docId for user ${user.toString}. Error ${e.toString}")
          throw e
        }
      } finally {
        cs.close
      }
    }
  }

  def getCuitInfo(user: CompanyUser, cuit: String): ClienteCuitInfo = {

    DB.withTransaction(user.database.database) { implicit connection =>

      val sql = "{call sp_cliente_get_cuit_info(?, ?, ?, ?)}"
      val cs = connection.prepareCall(sql)

      cs.setString(1, cuit)
      cs.registerOutParameter(2, Types.INTEGER)
      cs.registerOutParameter(3, Types.VARCHAR)
      cs.registerOutParameter(4, Types.VARCHAR)

      try {
        cs.execute()

        ClienteCuitInfo(
          cs.getInt(2),
          cs.getString(3),
          cs.getString(4)
        )

      } catch {
        case NonFatal(e) => {
          Logger.error(s"can't get cuit info with cuit $cuit for user ${user.toString}. Error ${e.toString}")
          throw e
        }
      } finally {
        cs.close
      }
    }
  }

  def validateCuit(user: CompanyUser, id: Int): Boolean = {

    DB.withTransaction(user.database.database) { implicit connection =>

      val sql = "{call sp_cliente_validate_cuit(?, ?)}"
      val cs = connection.prepareCall(sql)

      cs.setInt(1, id)
      cs.registerOutParameter(2, Types.INTEGER)

      try {
        cs.execute()

        cs.getInt(2) != 0

      } catch {
        case NonFatal(e) => {
          Logger.error(s"can't validate cuit for customer with id $id for user ${user.toString}. Error ${e.toString}")
          throw e
        }
      } finally {
        cs.close
      }
    }
  }

  def getName(user: CompanyUser, cliId: Int): String = getField(user, cliId, C.CLI_NAME)
  def getEmail(user: CompanyUser, cliId: Int): String = getField(user, cliId, C.CLI_EMAIL)

  def getField(user: CompanyUser, cliId: Int, columnName: String): String = DB.withTransaction(user.database.database) { implicit connection =>
    val statement = connection.createStatement
    val sql = s"select $columnName from Cliente where cli_id = $cliId"
    val res = statement.executeQuery(sql)

    connection.setAutoCommit(false)

    try {
      if(res.next) {
        res.getString(columnName)
      }
      else {
        ""
      }
    } catch {
      case NonFatal(e) => {
        Logger.error(s"can't get cliente $columnName with cliId $cliId and empId ${user.cairoCompanyId} for user ${user.toString}. Error ${e.toString}")
        throw e
      }
    } finally res.close
  }
  
  def getPercepciones(user: CompanyUser, id: Int, fecha: Date): Recordset = {

    DB.withTransaction(user.database.database) { implicit connection =>

      val sql = "{call sp_cliente_get_percepciones(?, ?, ?, ?)}"
      val cs = connection.prepareCall(sql)

      cs.setInt(1, id)
      cs.setInt(2, user.cairoCompanyId)
      cs.setDate(3, new java.sql.Date(fecha.getTime()))
      cs.registerOutParameter(4, Types.OTHER)

      try {
        cs.execute()

        val rs = cs.getObject(4).asInstanceOf[java.sql.ResultSet]
        Recordset.load(rs)

      } catch {
        case NonFatal(e) => {
          Logger.error(s"can't get cliente percepciones with cliId $id and empId ${user.cairoCompanyId} for user ${user.toString}. Error ${e.toString}")
          throw e
        }
      } finally {
        cs.close
      }
    }
  }

  // TODO: when save implement copy of price list
  /*
        if(m_copy) {
          if(!copyListaPrecio(lastId, m_id)) {  return false; }
        }

  * */

  // TODO: when save implement send email to client
  /*
  *
  * sendMailToClient(bNewUser, true);
  * */

}

