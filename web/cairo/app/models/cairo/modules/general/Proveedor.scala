package models.cairo.modules.general

import java.sql.{Connection, CallableStatement, ResultSet, Types, SQLException}
import anorm.SqlParser._
import anorm._
import services.DateUtil
import services.db.DB
import models.cairo.system.database.{DBHelper, Register, Field, FieldType, SaveResult}
import models.cairo.system.database.DBHelper.rowToFloat
import java.math.BigDecimal
import play.api.Play.current
import models.domain.CompanyUser
import java.util.Date
import play.api.Logger
import play.api.libs.json._
import scala.util.control.NonFatal

case class ProveedorBase(
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

case class ProveedorAddress(
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
                             horarioMDesde: Date,
                             horarioMHasta: Date,
                             horarioTDesde: Date,
                             horarioTHasta: Date
                             )

case class ProveedorReferences(
                                lpId: Int,
                                lpName: String,
                                ldId: Int,
                                ldName: String,
                                cpgId: Int,
                                cpgName: String,
                                proId: Int,
                                proName: String,
                                zonId: Int,
                                zonName: String
                                ) {
  def this(lpId: Int,
           ldId: Int,
           cpgId: Int,
           proId: Int,
           zonId: Int) = {
    this(
      lpId,
      "",
      ldId,
      "",
      cpgId,
      "",
      proId,
      "",
      zonId,
      ""
    )
  }
}

object ProveedorReferences {

  def apply(lpId: Int,
            ldId: Int,
            cpgId: Int,
            proId: Int,
            zonId: Int) = {

    new ProveedorReferences(
      lpId,
      ldId,
      cpgId,
      proId,
      zonId)
  }
}

case class ProveedorCai(
                         id: Int,
                         numero: String,
                         sucursal: String,
                         fechaVto: Date,
                         descrip: String
                       )

case class ProveedorEmpresa(
                              id: Int,
                              empId: Int,
                              empName: String
                             )

object ProveedorEmpresa {

  def apply(id: Int, empId: Int) = {
    new ProveedorEmpresa(id, empId, "")
  }
}

case class ProveedorCuentaGrupo(
                                  id: Int,
                                  cuegId: Int,
                                  cuegName: String,
                                  cueId: Int,
                                  cueName: String
                                 )

object ProveedorCuentaGrupo {

  def apply(id: Int, cuegId: Int, cueId: Int) = {
    new ProveedorCuentaGrupo(id, cuegId, "", cueId, "")
  }
}


case class ProveedorRetencion(
                               id: Int,
                               retId: Int,
                               retName: String,
                               desde: Date,
                               hasta: Date
                               )

object ProveedorRetencion {

  def apply(id: Int, retId: Int, desde: Date, hasta: Date) = {
    new ProveedorRetencion(id, retId, "", desde, hasta)
  }
}

case class ProveedorDepartamento(
                                  id: Int,
                                  dptoId: Int,
                                  dptoName: String
                                  )

object ProveedorDepartamento {

  def apply(id: Int, dptoId: Int) = {
    new ProveedorDepartamento(id, dptoId, "")
  }
}

case class ProveedorCentroCosto(
                                 id: Int,
                                 ccosId: Int,
                                 ccosName: String,
                                 prId: Int,
                                 prName: String
                                 )

object ProveedorCentroCosto {

  def apply(id: Int, ccosId: Int, prId: Int) = {
    new ProveedorCentroCosto(id, ccosId, "", prId, "")
  }
}

case class ProveedorItems(
                          cais: List[ProveedorCai],
                          empresas: List[ProveedorEmpresa],
                          cuentasGrupo: List[ProveedorCuentaGrupo],
                          retenciones: List[ProveedorRetencion],
                          dptos: List[ProveedorDepartamento],
                          centrosCosto: List[ProveedorCentroCosto],
                          additionalFields: List[AdditionalFields],

                          /* only used in save */
                          caiDeleted: String,
                          cuentaGrupoDeleted: String,
                          retencionDeleted: String,
                          departamentoDeleted: String,
                          centroCostoDeleted: String
                          )

case class Proveedor(
                      id: Int,
                      active: Boolean,
                      code: String,

                      base: ProveedorBase,
                      address: ProveedorAddress,
                      references: ProveedorReferences,

                      items: ProveedorItems,

                      createdAt: Date,
                      updatedAt: Date,
                      updatedBy: Int) {

  def this(
            id: Int,
            active: Boolean,
            code: String,

            base: ProveedorBase,
            address: ProveedorAddress,
            references: ProveedorReferences,

            items: ProveedorItems) = {

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

            base: ProveedorBase,
            address: ProveedorAddress,
            references: ProveedorReferences,

            items: ProveedorItems) = {

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

case class ProveedorInfo(
                          cpgId: Int,
                          cpgName: String,
                          cpgEsLibre: Boolean,
                          lpId: Int,
                          lpName: String,
                          ldId: Int,
                          ldName: String,
                          ivaRi: Boolean,
                          ivaRni: Boolean
                        )

case class ProveedorCuitInfo(
                              provId: Int,
                              code: String,
                              razonSocial: String
                              )

object Proveedor {

  lazy val emptyProveedorItems = ProveedorItems(List(), List(), List(), List(), List(), List(), List(), "", "", "", "", "")

  lazy val emptyProveedor = Proveedor(
    false,
    "",

    ProveedorBase("", "", false, "", 0, "", "", "", "", "", "", "", 0, 0, false, ""),
    ProveedorAddress("", "", "", "", "", "", "", "", "", "", U.NO_DATE, U.NO_DATE, U.NO_DATE, U.NO_DATE),
    ProveedorReferences(DBHelper.NoId, DBHelper.NoId, DBHelper.NoId, DBHelper.NoId, DBHelper.NoId),

    emptyProveedorItems
  )

  def apply(
            id: Int,
            active: Boolean,
            code: String,

            base: ProveedorBase,
            address: ProveedorAddress,
            references: ProveedorReferences,

            items: ProveedorItems
            ) = {

    new Proveedor(
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

             base: ProveedorBase,
             address: ProveedorAddress,
             references: ProveedorReferences
             ) = {

    new Proveedor(
      id,
      active,
      code,

      base,
      address,
      references,

      emptyProveedorItems
    )
  }

  def apply(
             active: Boolean,
             code: String,

             base: ProveedorBase,
             address: ProveedorAddress,
             references: ProveedorReferences,

             items: ProveedorItems
             ) = {

    new Proveedor(
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

             base: ProveedorBase,
             address: ProveedorAddress,
             references: ProveedorReferences
             ) = {

    new Proveedor(
      active,
      code,

      base,
      address,
      references,

      emptyProveedorItems
    )
  }

  private val proveedorCaiParser: RowParser[ProveedorCai] = {
    SqlParser.get[Int](C.PROVC_ID) ~
    SqlParser.get[String](C.PROVC_NUMERO) ~
    SqlParser.get[String](C.PROVC_SUCURSAL) ~
    SqlParser.get[Date](C.PROVC_FECHA_VTO) ~
    SqlParser.get[String](C.PROVC_DESCRIP) map {
    case
        id ~
        numero ~
        sucursal ~
        fechaVto ~
        descrip =>
        ProveedorCai(
          id,
          numero,
          sucursal,
          fechaVto,
          descrip)
    }
  }

  private val proveedorEmpresaParser: RowParser[ProveedorEmpresa] = {
    SqlParser.get[Int](C.EMP_PROV_ID) ~
    SqlParser.get[Int](C.EMP_ID) ~
    SqlParser.get[String](C.EMP_NAME) map {
    case
        id ~
        empId ~
        empName =>
        ProveedorEmpresa(
          id,
          empId,
          empName)
    }
  }

  private val proveedorCuentaGrupoParser: RowParser[ProveedorCuentaGrupo] = {
    SqlParser.get[Int](C.PROV_CUEG_ID) ~
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
        ProveedorCuentaGrupo(
          id,
          cuegId,
          cuegName,
          cueId,
          cueName)
    }
  }

  private val proveedorRetencionParser: RowParser[ProveedorRetencion] = {
    SqlParser.get[Int](C.PROV_RET_ID) ~
    SqlParser.get[Int](C.RET_ID) ~
    SqlParser.get[String](C.RET_NAME) ~
    SqlParser.get[Date](C.PROV_RET_DESDE) ~
    SqlParser.get[Date](C.PROV_RET_HASTA) map {
    case
        id ~
        retId ~
        retName ~
        desde ~
        hasta =>
        ProveedorRetencion(
          id,
          retId,
          retName,
          desde,
          hasta)
    }
  }

  private val proveedorDptoParser: RowParser[ProveedorDepartamento] = {
    SqlParser.get[Int](C.DPTO_PROV_ID) ~
    SqlParser.get[Int](C.DPTO_ID) ~
    SqlParser.get[String](C.DPTO_NAME) map {
    case
        id ~
        dptoId ~
        dptoName =>
        ProveedorDepartamento(
          id,
          dptoId,
          dptoName)
    }
  }

  private val proveedorCentroCostoParser: RowParser[ProveedorCentroCosto] = {
    SqlParser.get[Int](C.PROV_CCOS_ID) ~
    SqlParser.get[Int](C.CCOS_ID) ~
    SqlParser.get[String](C.CCOS_NAME) ~
    SqlParser.get[Option[Int]](C.PR_ID) ~
    SqlParser.get[Option[String]](C.PR_NAME_COMPRA) map {
    case
        id ~
        ccosId ~
        ccosName ~
        prId ~
        prName =>
        ProveedorCentroCosto(
          id,
          ccosId,
          ccosName,
          prId.getOrElse(DBHelper.NoId),
          prName.getOrElse(""))
    }
  }

  private val proveedorParser: RowParser[Proveedor] = {
    SqlParser.get[Int](C.PROV_ID) ~
    SqlParser.get[Int](DBHelper.ACTIVE) ~
    SqlParser.get[String](C.PROV_CODE) ~
    SqlParser.get[String](C.PROV_NAME) ~
    SqlParser.get[String](C.PROV_RAZONSOCIAL) ~
    SqlParser.get[Int](C.PROV_IMPRIME_TICKET) ~
    SqlParser.get[String](C.PROV_CONTACTO) ~
    SqlParser.get[Int](C.PROV_CATFISCAL) ~
    SqlParser.get[String](C.PROV_CUIT) ~
    SqlParser.get[String](C.PROV_INGRESOSBRUTOS) ~
    SqlParser.get[String](C.PROV_CHEQUEORDEN) ~
    SqlParser.get[String](C.PROV_BANCO) ~
    SqlParser.get[String](C.PROV_NRO_CTA_BANCO) ~
    SqlParser.get[String](C.PROV_CBU) ~
    SqlParser.get[String](C.PROV_NRO_CLIENTE) ~
    SqlParser.get[BigDecimal](C.PROV_CREDITOCTACTE) ~
    SqlParser.get[BigDecimal](C.PROV_CREDITOTOTAL) ~
    SqlParser.get[Int](C.PROV_CREDITOACTIVO) ~
    SqlParser.get[String](C.PROV_DESCRIP) ~
    SqlParser.get[String](C.PROV_CALLE) ~
    SqlParser.get[String](C.PROV_CALLENUMERO) ~
    SqlParser.get[String](C.PROV_PISO) ~
    SqlParser.get[String](C.PROV_DEPTO) ~
    SqlParser.get[String](C.PROV_CODPOSTAL) ~
    SqlParser.get[String](C.PROV_LOCALIDAD) ~
    SqlParser.get[String](C.PROV_TEL) ~
    SqlParser.get[String](C.PROV_FAX) ~
    SqlParser.get[String](C.PROV_EMAIL) ~
    SqlParser.get[String](C.PROV_WEB) ~
    SqlParser.get[Date](C.PROV_HORARIO_MDESDE) ~
    SqlParser.get[Date](C.PROV_HORARIO_MHASTA) ~
    SqlParser.get[Date](C.PROV_HORARIO_TDESDE) ~
    SqlParser.get[Date](C.PROV_HORARIO_THASTA) ~
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
    SqlParser.get[Date](DBHelper.CREATED_AT) ~
    SqlParser.get[Date](DBHelper.UPDATED_AT) ~
    SqlParser.get[Int](DBHelper.UPDATED_BY) map {
      case
          id ~
          active ~
          code ~
          name ~
          razonSocial ~
          imprimeTicket ~
          contacto ~
          catFiscal ~
          cuit ~
          ingresosBrutos ~
          chequeOrden ~
          banco ~
          nroCtaBanco ~
          cbu ~
          nroCliente ~
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
          horarioMDesde ~
          horarioMHasta ~
          horarioTDesde ~
          horarioTHasta ~

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

          createdAt ~
          updatedAt ~
          updatedBy =>
        Proveedor(
          id,
          active != 0,
          code,
          ProveedorBase(
            name,
            razonSocial,
            imprimeTicket != 0,
            contacto,
            catFiscal,
            cuit,
            ingresosBrutos,
            chequeOrden,
            banco,
            nroCtaBanco,
            cbu,
            nroCliente,
            creditoCtaCte.doubleValue,
            creditoTotal.doubleValue,
            creditoActivo != 0,
            descrip),
          ProveedorAddress(
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
            horarioMDesde,
            horarioMHasta,
            horarioTDesde,
            horarioTHasta),
          ProveedorReferences(
            lpId.getOrElse(DBHelper.NoId),
            lpName.getOrElse(""),
            ldId.getOrElse(DBHelper.NoId),
            ldName.getOrElse(""),
            cpgId.getOrElse(DBHelper.NoId),
            cpgName.getOrElse(""),
            proId.getOrElse(DBHelper.NoId),
            proName.getOrElse(""),
            zonId.getOrElse(DBHelper.NoId),
            zonName.getOrElse("")),
          emptyProveedorItems,
          createdAt,
          updatedAt,
          updatedBy)
    }
  }

  def create(user: CompanyUser, proveedor: Proveedor): Proveedor = {
    save(user, proveedor, true)
  }

  def update(user: CompanyUser, proveedor: Proveedor): Proveedor = {
    save(user, proveedor, false)
  }

  private def save(user: CompanyUser, proveedor: Proveedor, isNew: Boolean): Proveedor = {
    def getFields = {
      List(
        Field(DBHelper.ACTIVE, Register.boolToInt(proveedor.active), FieldType.boolean),
        Field(C.PROV_CODE, proveedor.code, FieldType.text),

        Field(C.PROV_NAME, proveedor.base.name, FieldType.text),
        Field(C.PROV_RAZONSOCIAL, proveedor.base.razonSocial, FieldType.text),
        Field(C.PROV_IMPRIME_TICKET, Register.boolToInt(proveedor.base.imprimeTicket), FieldType.boolean),
        Field(C.PROV_CONTACTO, proveedor.base.contacto, FieldType.text),
        Field(C.PROV_CUIT, proveedor.base.cuit, FieldType.text),
        Field(C.PROV_INGRESOSBRUTOS, proveedor.base.ingresosBrutos, FieldType.text),
        Field(C.PROV_CHEQUEORDEN, proveedor.base.chequeOrden, FieldType.text),
        Field(C.PROV_BANCO, proveedor.base.banco, FieldType.text),
        Field(C.PROV_NRO_CTA_BANCO, proveedor.base.nroCtaBanco, FieldType.text),
        Field(C.PROV_CBU, proveedor.base.cbu, FieldType.text),
        Field(C.PROV_NRO_CLIENTE, proveedor.base.nroCliente, FieldType.text),
        Field(C.PROV_CREDITOCTACTE, proveedor.base.creditoCtaCte, FieldType.number),
        Field(C.PROV_CREDITOTOTAL, proveedor.base.creditoTotal, FieldType.number),
        Field(C.PROV_CREDITOACTIVO, Register.boolToInt(proveedor.base.creditoActivo), FieldType.boolean),
        Field(C.PROV_DESCRIP, proveedor.base.descrip, FieldType.text),

        Field(C.PROV_CALLE, proveedor.address.calle, FieldType.text),
        Field(C.PROV_CALLENUMERO, proveedor.address.calleNumero, FieldType.text),
        Field(C.PROV_PISO, proveedor.address.piso, FieldType.text),
        Field(C.PROV_DEPTO, proveedor.address.depto, FieldType.text),
        Field(C.PROV_CODPOSTAL, proveedor.address.codPostal, FieldType.text),
        Field(C.PROV_LOCALIDAD, proveedor.address.localidad, FieldType.text),
        Field(C.PROV_HORARIO_MDESDE, proveedor.address.horarioMDesde, FieldType.date),
        Field(C.PROV_HORARIO_MHASTA, proveedor.address.horarioMHasta, FieldType.date),
        Field(C.PROV_HORARIO_TDESDE, proveedor.address.horarioTDesde, FieldType.date),
        Field(C.PROV_HORARIO_THASTA, proveedor.address.horarioTHasta, FieldType.date),
        Field(C.PROV_TEL, proveedor.address.tel, FieldType.text),
        Field(C.PROV_FAX, proveedor.address.fax, FieldType.text),
        Field(C.PROV_EMAIL, proveedor.address.email, FieldType.text),
        Field(C.PROV_WEB, proveedor.address.web, FieldType.text),

        Field(C.LP_ID, proveedor.references.lpId, FieldType.id),
        Field(C.LD_ID, proveedor.references.ldId, FieldType.id),
        Field(C.CPG_ID, proveedor.references.cpgId, FieldType.id),
        Field(C.PRO_ID, proveedor.references.proId, FieldType.id),
        Field(C.ZON_ID, proveedor.references.zonId, FieldType.id)
      )
    }

    def getCaiFields(cai: ProveedorCai, provId: Int) = {
      List(
        Field(C.PROV_ID, provId, FieldType.id),
        Field(C.PROVC_NUMERO, cai.numero, FieldType.text),
        Field(C.PROVC_SUCURSAL, cai.numero, FieldType.text),
        Field(C.PROVC_FECHA_VTO, cai.numero, FieldType.date),
        Field(C.PROVC_DESCRIP, cai.numero, FieldType.text)
      )
    }

    def getEmpresaFields(empresa: ProveedorEmpresa, provId: Int) = {
      List(
        Field(C.PROV_ID, provId, FieldType.id),
        Field(C.EMP_ID, empresa.empId, FieldType.id)
      )
    }

    def getCuentaGrupoFields(cuentaGrupo: ProveedorCuentaGrupo, provId: Int) = {
      List(
        Field(C.PROV_ID, provId, FieldType.id),
        Field(C.CUEG_ID, cuentaGrupo.cuegId, FieldType.id),
        Field(C.CUE_ID, cuentaGrupo.cueId, FieldType.id)
      )
    }

    def getRetencionFields(retencion: ProveedorRetencion, provId: Int) = {
      List(
        Field(C.PROV_ID, provId, FieldType.id),
        Field(C.RET_ID, retencion.retId, FieldType.id),
        Field(C.PROV_RET_DESDE, retencion.desde, FieldType.date),
        Field(C.PROV_RET_HASTA, retencion.hasta, FieldType.date)
      )
    }

    def getDepartamentoFields(departamento: ProveedorDepartamento, provId: Int) = {
      List(
        Field(C.PROV_ID, provId, FieldType.id),
        Field(C.DPTO_ID, departamento.dptoId, FieldType.id)
      )
    }

    def getCentroCostoFields(centroCosto: ProveedorCentroCosto, provId: Int) = {
      List(
        Field(C.PROV_ID, provId, FieldType.id),
        Field(C.CCOS_ID, centroCosto.ccosId, FieldType.id),
        Field(C.PR_ID, centroCosto.prId, FieldType.id)
      )
    }

    def throwException = {
      throw new RuntimeException(s"Error when saving ${C.PROVEEDOR}")
    }

    case class ProveedorCaiInfo(provId: Int, item: ProveedorCai)

    def saveCai(itemInfo: ProveedorCaiInfo) = {
      DBHelper.save(
        user,
        Register(
          C.PROVEEDOR_CAI,
          C.PROVC_ID,
          itemInfo.item.id,
          false,
          true,
          true,
          getCaiFields(itemInfo.item, itemInfo.provId)),
        itemInfo.item.id == DBHelper.NewId
      ) match {
        case SaveResult(true, id) => true
        case SaveResult(false, id) => throwException
      }
    }

    def saveCais(provId: Int) = {
      DBHelper.deleteItems(user, C.PROVEEDOR_CAI, C.PROVC_ID, proveedor.items.caiDeleted, s" AND prov_id = ${provId}")
      proveedor.items.cais.map(cai => saveCai(ProveedorCaiInfo(provId, cai)))
    }

    case class ProveedorEmpresaInfo(provId: Int, item: ProveedorEmpresa)

    def saveEmpresa(itemInfo: ProveedorEmpresaInfo) = {
      DBHelper.save(
        user,
        Register(
          C.EMPRESA_PROVEEDOR,
          C.EMP_PROV_ID,
          DBHelper.NoId,
          false,
          true,
          true,
          getEmpresaFields(itemInfo.item, itemInfo.provId)),
        true
      ) match {
        case SaveResult(true, id) => true
        case SaveResult(false, id) => throwException
      }
    }

    def saveEmpresas(provId: Int) = {
      DBHelper.deleteItems(user, C.EMPRESA_PROVEEDOR, C.PROV_ID, provId.toString, "")
      proveedor.items.empresas.map(empresa => saveEmpresa(ProveedorEmpresaInfo(provId, empresa)))
    }

    case class ProveedorCuentaGrupoInfo(provId: Int, item: ProveedorCuentaGrupo)

    def saveCuentaGrupo(itemInfo: ProveedorCuentaGrupoInfo) = {
      DBHelper.save(
        user,
        Register(
          C.PROVEEDOR_CUENTA_GRUPO,
          C.PROV_CUEG_ID,
          itemInfo.item.id,
          false,
          true,
          true,
          getCuentaGrupoFields(itemInfo.item, itemInfo.provId)),
        itemInfo.item.id == DBHelper.NewId
      ) match {
        case SaveResult(true, id) => true
        case SaveResult(false, id) => throwException
      }
    }

    def saveCuentasGrupo(provId: Int) = {
      proveedor.items.cuentasGrupo.map(cuentaGrupo => saveCuentaGrupo(ProveedorCuentaGrupoInfo(provId, cuentaGrupo)))
      DBHelper.deleteItems(user, C.PROVEEDOR_CUENTA_GRUPO, C.PROV_CUEG_ID, proveedor.items.cuentaGrupoDeleted, s" AND prov_id = ${provId}")
    }

    case class ProveedorRetencionInfo(provId: Int, item: ProveedorRetencion)

    def saveRetencion(itemInfo: ProveedorRetencionInfo) = {
      DBHelper.save(
        user,
        Register(
          C.PROVEEDOR_RETENCION,
          C.PROV_RET_ID,
          itemInfo.item.id,
          false,
          true,
          true,
          getRetencionFields(itemInfo.item, itemInfo.provId)),
        itemInfo.item.id == DBHelper.NewId
      ) match {
        case SaveResult(true, id) => true
        case SaveResult(false, id) => throwException
      }
    }

    def saveRetenciones(provId: Int) = {
      DBHelper.deleteItems(user, C.PROVEEDOR_RETENCION, C.PROV_RET_ID, proveedor.items.retencionDeleted, s" AND prov_id = ${provId}")
      proveedor.items.retenciones.map(retencion => saveRetencion(ProveedorRetencionInfo(provId, retencion)))
    }

    case class ProveedorDepartamentoInfo(provId: Int, item: ProveedorDepartamento)

    def saveDepartamento(itemInfo: ProveedorDepartamentoInfo) = {
      DBHelper.save(
        user,
        Register(
          C.DEPARTAMENTO_PROVEEDOR,
          C.DPTO_PROV_ID,
          itemInfo.item.id,
          false,
          false,
          false,
          getDepartamentoFields(itemInfo.item, itemInfo.provId)),
        itemInfo.item.id == DBHelper.NewId
      ) match {
        case SaveResult(true, id) => true
        case SaveResult(false, id) => throwException
      }
    }

    def saveDepartamentos(provId: Int) = {
      DBHelper.deleteItems(user, C.DEPARTAMENTO_PROVEEDOR, C.DPTO_PROV_ID, proveedor.items.departamentoDeleted, s" AND prov_id = ${provId}")
      proveedor.items.dptos.map(departamento => saveDepartamento(ProveedorDepartamentoInfo(provId, departamento)))
    }

    case class ProveedorCentroCostoInfo(provId: Int, item: ProveedorCentroCosto)

    def saveCentroCosto(itemInfo: ProveedorCentroCostoInfo) = {
      DBHelper.save(
        user,
        Register(
          C.PROVEEDOR_CENTRO_COSTO,
          C.PROV_CCOS_ID,
          itemInfo.item.id,
          false,
          false,
          false,
          getCentroCostoFields(itemInfo.item, itemInfo.provId)),
        itemInfo.item.id == DBHelper.NewId
      ) match {
        case SaveResult(true, id) => true
        case SaveResult(false, id) => throwException
      }
    }

    def saveCentrosCosto(provId: Int) = {
      DBHelper.deleteItems(user, C.PROVEEDOR_CENTRO_COSTO, C.PROV_CCOS_ID, proveedor.items.centroCostoDeleted, s" AND prov_id = ${provId}")
      proveedor.items.centrosCosto.map(centroCosto => saveCentroCosto(ProveedorCentroCostoInfo(provId, centroCosto)))
    }
    
    DBHelper.saveEx(
      user,
      Register(
        C.PROVEEDOR,
        C.PROV_ID,
        proveedor.id,
        false,
        true,
        true,
        getFields),
      isNew,
      C.PROV_CODE
    ) match {
      case SaveResult(true, id) => {
        saveCais(id)
        saveEmpresas(id)
        saveCuentasGrupo(id)
        saveRetenciones(id)
        saveDepartamentos(id)
        saveCentrosCosto(id)
        load(user, id).getOrElse(throwException)
      }
      case SaveResult(false, id) => throwException
    }
  }

  def load(user: CompanyUser, id: Int): Option[Proveedor] = {

    DB.withTransaction(user.database.database) { implicit connection =>

      val sql = "{call sp_proveedor_get(?, ?)}"
      val cs = connection.prepareCall(sql)

      cs.setInt(1, id)
      cs.registerOutParameter(2, Types.OTHER)

      try {
        cs.execute()

        val rs = cs.getObject(2).asInstanceOf[java.sql.ResultSet]
        Sql.as(proveedorParser.singleOpt, rs)

      } catch {
        case NonFatal(e) => {
          Logger.error(s"can't get ${C.PROVEEDOR} with id $id for user ${user.toString}. Error ${e.toString}")
          throw e
        }
      } finally {
        cs.close
      }
    }
  }

  private def loadProveedorItems(user: CompanyUser, id: Int) = {
    ProveedorItems(
      loadCai(user, id),
      loadEmpresas(user, id),
      loadCuentasGrupo(user, id),
      loadRetenciones(user, id),
      loadDptos(user, id),
      loadCentrosCosto(user, id),
      List(), "", "", "", "", "")
  }

  private def loadCai(user: CompanyUser, id: Int) = {

    DB.withTransaction(user.database.database) { implicit connection =>

      val sql = "{call sp_proveedor_get_cai(?, ?)}"
      val cs = connection.prepareCall(sql)

      cs.setInt(1, id)
      cs.registerOutParameter(2, Types.OTHER)

      try {
        cs.execute()

        val rs = cs.getObject(2).asInstanceOf[java.sql.ResultSet]
        Sql.as(proveedorCaiParser.*, rs)

      } catch {
        case NonFatal(e) => {
          Logger.error(s"can't get ${C.PROVEEDOR_CAI} with id $id for user ${user.toString}. Error ${e.toString}")
          throw e
        }
      } finally {
        cs.close
      }
    }
  }

  private def loadEmpresas(user: CompanyUser, id: Int) = {

    DB.withTransaction(user.database.database) { implicit connection =>

      val sql = "{call sp_proveedor_get_empresas(?, ?)}"
      val cs = connection.prepareCall(sql)

      cs.setInt(1, id)
      cs.registerOutParameter(2, Types.OTHER)

      try {
        cs.execute()

        val rs = cs.getObject(2).asInstanceOf[java.sql.ResultSet]
        Sql.as(proveedorEmpresaParser.*, rs)

      } catch {
        case NonFatal(e) => {
          Logger.error(s"can't get ${C.EMPRESA_PROVEEDOR} with id $id for user ${user.toString}. Error ${e.toString}")
          throw e
        }
      } finally {
        cs.close
      }
    }
  }

  private def loadCuentasGrupo(user: CompanyUser, id: Int) = {

    DB.withTransaction(user.database.database) { implicit connection =>

      val sql = "{call sp_proveedor_get_cuentas_grupo(?, ?)}"
      val cs = connection.prepareCall(sql)

      cs.setInt(1, id)
      cs.registerOutParameter(2, Types.OTHER)

      try {
        cs.execute()

        val rs = cs.getObject(2).asInstanceOf[java.sql.ResultSet]
        Sql.as(proveedorCuentaGrupoParser.*, rs)

      } catch {
        case NonFatal(e) => {
          Logger.error(s"can't get ${C.PROVEEDOR_CUENTA_GRUPO} with id $id for user ${user.toString}. Error ${e.toString}")
          throw e
        }
      } finally {
        cs.close
      }
    }
  }

  private def loadRetenciones(user: CompanyUser, id: Int) = {

    DB.withTransaction(user.database.database) { implicit connection =>

      val sql = "{call sp_proveedor_get_retenciones(?, ?)}"
      val cs = connection.prepareCall(sql)

      cs.setInt(1, id)
      cs.registerOutParameter(2, Types.OTHER)

      try {
        cs.execute()

        val rs = cs.getObject(2).asInstanceOf[java.sql.ResultSet]
        Sql.as(proveedorRetencionParser.*, rs)

      } catch {
        case NonFatal(e) => {
          Logger.error(s"can't get ${C.PROVEEDOR_RETENCION} with id $id for user ${user.toString}. Error ${e.toString}")
          throw e
        }
      } finally {
        cs.close
      }
    }
  }

  private def loadDptos(user: CompanyUser, id: Int) = {

    DB.withTransaction(user.database.database) { implicit connection =>

      val sql = "{call sp_proveedor_get_dptos(?, ?)}"
      val cs = connection.prepareCall(sql)

      cs.setInt(1, id)
      cs.registerOutParameter(2, Types.OTHER)

      try {
        cs.execute()

        val rs = cs.getObject(2).asInstanceOf[java.sql.ResultSet]
        Sql.as(proveedorDptoParser.*, rs)

      } catch {
        case NonFatal(e) => {
          Logger.error(s"can't get ${C.DEPARTAMENTO_PROVEEDOR} with id $id for user ${user.toString}. Error ${e.toString}")
          throw e
        }
      } finally {
        cs.close
      }
    }
  }

  private def loadCentrosCosto(user: CompanyUser, id: Int) = {

    DB.withTransaction(user.database.database) { implicit connection =>

      val sql = "{call sp_proveedor_get_centros_costo(?, ?)}"
      val cs = connection.prepareCall(sql)

      cs.setInt(1, id)
      cs.registerOutParameter(2, Types.OTHER)

      try {
        cs.execute()

        val rs = cs.getObject(2).asInstanceOf[java.sql.ResultSet]
        Sql.as(proveedorCentroCostoParser.*, rs)

      } catch {
        case NonFatal(e) => {
          Logger.error(s"can't get ${C.PROVEEDOR_CENTRO_COSTO} with id $id for user ${user.toString}. Error ${e.toString}")
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
        SQL("sp_proveedor_delete {id}")
          .on('id -> id)
          .executeUpdate
      } catch {
        case NonFatal(e) => {
          Logger.error(s"can't delete a ${C.PROVEEDOR}. ${C.PROV_ID} id: $id. Error ${e.toString}")
          throw e
        }
      }
    }
  }

  def get(user: CompanyUser, id: Int): Proveedor = {
    load(user, id) match {
      case Some(p) => {
        Proveedor(
          p.id,
          p.active,
          p.code,

          p.base,

          p.address,
          p.references,

          loadProveedorItems(user, id)
        )
      }
      case None => Proveedor(
        emptyProveedor.id,
        emptyProveedor.active,
        emptyProveedor.code,

        emptyProveedor.base,

        emptyProveedor.address,
        emptyProveedor.references,

        loadProveedorItems(user, id)
      )
    }
  }

  def info(user: CompanyUser, id: Int, docId: Int): ProveedorInfo = {

    DB.withTransaction(user.database.database) { implicit connection =>

      val sql = "{call sp_proveedor_get_info(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)}"
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

      try {
        cs.execute()

        ProveedorInfo(
          cs.getInt(3),
          cs.getString(4),
          cs.getShort(5) != 0,
          cs.getInt(6),
          cs.getString(7),
          cs.getInt(8),
          cs.getString(9),
          cs.getShort(10) != 0,
          cs.getShort(11) != 0
        )

      } catch {
        case NonFatal(e) => {
          Logger.error(s"can't get proveedor info with provId $id and docId $docId for user ${user.toString}. Error ${e.toString}")
          throw e
        }
      } finally {
        cs.close
      }
    }
  }

  def validateCuit(user: CompanyUser, cuit: String): ProveedorCuitInfo = {

    DB.withTransaction(user.database.database) { implicit connection =>

      val sql = "{call sp_proveedor_get_cuit_info(?, ?, ?, ?)}"
      val cs = connection.prepareCall(sql)

      cs.setString(1, cuit)
      cs.registerOutParameter(2, Types.INTEGER)
      cs.registerOutParameter(3, Types.VARCHAR)
      cs.registerOutParameter(4, Types.VARCHAR)

      try {
        cs.execute()

        ProveedorCuitInfo(
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
}

