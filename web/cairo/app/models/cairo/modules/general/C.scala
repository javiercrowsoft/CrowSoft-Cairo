package models.cairo.modules.general

import java.util.Date
import java.util.Calendar
import java.util.TimeZone

import play.api.Play.current

import anorm._
import models.domain.CompanyUser
import services.db.DB

object U {
  val NO_DATE = {
    val c = Calendar.getInstance(TimeZone.getTimeZone("GMT"))
    c.set(1900, 0, 1, 0,0,0)
    c.getTime
  }
}

object C {

  val FROM = "from"
  val TO = "to"

  val ITEMS = "items"
  val DELETED_LIST = "deletedList"

  val IS_VALID = "is_valid"

  val PROVEEDOR_CAI_DELETED = "deletedCai"
  val PROVEEDOR_CUENTA_GRUPO_DELETED = "deletedCuentaGrupo"
  val PROVEEDOR_RETENCIONES_DELETED = "deletedRetencion"
  val PROVEEDOR_CENTRO_COSTO_DELETED = "deletedCentroCosto"
  val PROVEEDOR_DEPARTAMENTO_DELETED = "deletedDepartamento"

  val CLIENTE_ITEMS = "clienteItems"
  val CLIENTE_SUCURSAL_DELETED = "deletedSucursalCliente"
  val CLIENTE_CUENTA_GRUPO_DELETED = "deletedCuentaGrupo"
  val CLIENTE_PERCEPCIONES_DELETED = "deletedPercepcion"
  val CLIENTE_CONTACTO_DELETED = "deletedContacto"
  val CLIENTE_DEPARTAMENTO_DELETED = "deletedDepartamento"
  val CLIENTE_INFORME_DELETED = "deletedInforme"

  val PRODUCTO_ITEMS = "productoItems"
  val PRODUCTO_PROVEEDOR_DELETED = "deletedProveedor"
  val PRODUCTO_CLIENTE_DELETED = "deletedCliente"
  val PRODUCTO_CMI_DELETED = "deletedCMI"
  val PRODUCTO_LEYENDA_DELETED = "deletedLeyenda"
  val PRODUCTO_TAG_DELETED = "deletedTag"
  val PRODUCTO_WEB_IMAGE_DELETED = "deletedWebImage"

  val RUBRO_TABLA_ITEM_DELETED = "itemDeleted"

  val EDIT_MSG = "editMsg"
  val EDITABLE = "editable"
  val HAS_IVA_RI = "bIvaRi"
  val HAS_IVA_RNI = "bIvaRni"

  val PERMISO = "Permiso"
  val PER_ID = "per_id"

  // Provincia
  val PROVINCIA = "Provincia"
  val PRO_ID = "pro_id"
  val PRO_NAME = "pro_nombre"
  val PRO_CODE = "pro_codigo"
  val PRO_DESCRIP = "pro_descrip"

  // Unidad
  val UNIDAD = "Unidad"
  val UN_ID = "un_id"
  val UN_NAME = "un_nombre"
  val UN_CODE = "un_codigo"

  // DepositoFisico
  val DEPOSITO_FISICO = "DepositoFisico"
  val DEPF_ID = "depf_id"
  val DEPF_NAME = "depf_nombre"
  val DEPF_CODE = "depf_codigo"
  val DEPF_DESCRIP = "depf_descrip"
  val DEPF_TEL = "depf_tel"
  val DEPF_DIR = "depf_dir"

  // DepositoLogico
  val DEPOSITO_LOGICO = "DepositoLogico"
  val DEPL_ID = "depl_id"
  val DEPL_NAME = "depl_nombre"
  val DEPL_CODE = "depl_codigo"
  val DEPL_DESCRIP = "depl_descrip"
  val DEPL_ES_TEMP = "depl_estemp"

  // Zona
  val ZONA = "Zona"
  val ZON_ID = "zon_id"
  val ZON_NAME = "zon_nombre"
  val ZON_CODE = "zon_codigo"
  val ZON_DESCRIP = "zon_descrip"
  val ZON_PRECIO = "zon_precio"

  // TasaImpositiva
  val TASA_IMPOSITIVA = "TasaImpositiva"
  val TI_ID = "ti_id"
  val TI_NAME = "ti_nombre"
  val TI_CODE = "ti_codigo"
  val TI_PORCENTAJE = "ti_porcentaje"
  val TI_CODIGO_DGI1 = "ti_codigoDGI1"
  val TI_CODIGO_DGI2 = "ti_codigoDGI2"
  val TI_TIPO = "ti_tipo"

  // SucursalCliente
  val CLIENTE_SUCURSAL = "ClienteSucursal"
  val CLIS_ID = "clis_id"
  val CLIS_NAME = "clis_nombre"
  val CLIS_CODE = "clis_codigo"
  val CLIS_DESCRIP = "clis_descrip"
  val CLIS_LOCALIDAD = "clis_localidad"
  val CLIS_CALLE = "clis_calle"
  val CLIS_CALLE_NUMERO = "clis_callenumero"
  val CLIS_PISO = "clis_piso"
  val CLIS_DEPTO = "clis_depto"
  val CLIS_TEL = "clis_tel"
  val CLIS_FAX = "clis_fax"
  val CLIS_EMAIL = "clis_email"
  val CLIS_COD_POSTAL = "clis_codpostal"
  val CLIS_CONTACTO = "clis_contacto"

  // Banco
  val BANCO = "Banco"
  val BCO_ID = "bco_id"
  val BCO_NAME = "bco_nombre"
  val BCO_CODE = "bco_codigo"
  val BCO_CONTACTO = "bco_contacto"
  val BCO_TELEFONO = "bco_telefono"
  val BCO_DIRECCION = "bco_direccion"
  val BCO_WEB = "bco_web"
  val BCO_MAIL = "bco_mail"

  // Vendedor
  val VENDEDOR = "Vendedor"
  val VEN_ID = "ven_id"
  val VEN_NAME = "ven_nombre"
  val VEN_DESCRIP = "ven_descrip"
  val VEN_CODE = "ven_codigo"

  // TarjetaCredito
  val TARJETACREDITO = "TarjetaCredito"
  val TJC_ID = "tjc_id"
  val TJC_NAME = "tjc_nombre"
  val TJC_CODE = "tjc_codigo"
  val TJC_DESCRIP = "tjc_descrip"
  val TJC_COMISION = "tjc_comision"
  val CUE_ID_EN_CARTERA = "cue_id_encartera"
  val CUE_ID_BANCO = "cue_id_banco"
  val CUE_ID_PRESENTADO = "cue_id_presentado"
  val CUE_ID_RECHAZO = "cue_id_rechazo"
  val CUE_ID_COMISION = "cue_id_comision"
  val CUE_ID_COMPRA = "cue_id_compra"
  val CUE_NAME_COMPRA = "cue_name_compra"
  val CUE_ID_VENTA = "cue_id_venta"
  val CUE_NAME_VENTA = "cue_name_venta"

  // TarjetaCreditoCuota
  val TARJETA_CREDITO_CUOTA = "TarjetaCreditoCuota"
  val TJCCU_ID = "tjccu_id"
  val TJCCU_CANTIDAD = "tjccu_cantidad"
  val TJCCU_COMISION = "tjccu_comision"

  // Cuenta
  val CUENTA = "Cuenta"
  val CUE_ID = "cue_id"
  val CUE_NAME = "cue_nombre"
  val CUE_CODE = "cue_codigo"
  val CUE_DESCRIP = "cue_descrip"
  val CUE_LLEVA_CENTRO_COSTO = "cue_llevacentrocosto"
  val CUE_IDENTIFICACION_EXTERNA = "cue_identificacionexterna"
  val CUE_PRODUCTO = "cue_producto"
  val CUE_CODIGO_RPT = "cue_codigorpt"
  val CUE_ES_EFECTIVO = "cue_esefectivo"
  val CUE_ES_TICKET = "cue_esticket"

  // Cuenta Grupo
  val CUENTA_GRUPO = "CuentaGrupo"
  val CUEG_ID = "cueg_id"
  val CUEG_NAME = "cueg_nombre"
  val CUEG_CODE = "cueg_codigo"
  val CUEG_DESCRIP = "cueg_descrip"
  val CUEG_TIPO = "cueg_tipo"

  // Cuenta Grupo Cliente
  val CLIENTE_CUENTA_GRUPO = "ClienteCuentaGrupo"
  val CLI_CUEG_ID = "clicueg_id"

  // Cuenta Grupo Proveedor
  val PROVEEDOR_CUENTA_GRUPO = "ProveedorCuentaGrupo"
  val PROV_CUEG_ID = "provcueg_id"

  // Percepcion Cliente
  val CLIENTE_PERCEPCION = "ClientePercepcion"
  val CLI_PERC_ID = "cliperc_id"
  val CLI_PERC_DESDE = "cliperc_desde"
  val CLI_PERC_HASTA = "cliperc_hasta"

  // Retencion Proveedor
  val PROVEEDOR_RETENCION = "ProveedorRetencion"
  val PROV_RET_ID = "provret_id"
  val PROV_RET_DESDE = "provret_desde"
  val PROV_RET_HASTA = "provret_hasta"

  // CuentaCategoria
  val CUENTA_CATEGORIA = "CuentaCategoria"
  val CUEC_ID = "cuec_id"
  val CUEC_NAME = "cuec_nombre"
  val CUEC_CODE = "cuec_codigo"
  val CUEC_DESCRIP = "cuec_descrip"
  val CUEC_TIPO = "cuec_tipo"

  // Leyenda
  val LEYENDA = "Leyenda"
  val LEY_ID = "ley_id"
  val LEY_NAME = "ley_nombre"
  val LEY_CODE = "ley_codigo"
  val LEY_DESCRIP = "ley_descrip"
  val LEYTEXTO = "ley_texto"

  // CentroCosto
  val CENTRO_COSTO = "CentroCosto"
  val CCOS_ID = "ccos_id"
  val CCOS_NAME = "ccos_nombre"
  val CCOS_CODE = "ccos_codigo"
  val CCOS_DESCRIP = "ccos_descrip"
  val CCOS_COMPRA = "ccos_compra"
  val CCOS_VENTA = "ccos_venta"
  val CCOS_ID_PADRE = "ccos_id_padre"
  val CCOS_PADRE_NAME = "padre_nombre"

  // Cobrador
  val COBRADOR = "Cobrador"
  val COB_ID = "cob_id"
  val COB_NAME = "cob_nombre"
  val COB_CODE = "cob_codigo"
  val COB_DESCRIP = "cob_descrip"
  val COB_COMISION = "cob_comision"

  // ReglaLiquidacion
  val REGLALIQUIDACION = "ReglaLiquidacion"
  val REL_ID = "rel_id"
  val REL_NAME = "rel_nombre"
  val REL_CODE = "rel_codigo"
  val REL_DESCRIP = "rel_descrip"

  // Clearing
  val CLEARING = "Clearing"
  val CLE_ID = "cle_id"
  val CLE_NAME = "cle_nombre"
  val CLE_CODE = "cle_codigo"
  val CLE_DESCRIP = "cle_descrip"
  val CLE_DIAS = "cle_dias"

  // Cliente
  val CLIENTE = "Cliente"
  val CLI_ID = "cli_id"
  val CLI_NAME = "cli_nombre"
  val CLI_CODE = "cli_codigo"
  val CLI_DESCRIP = "cli_descrip"
  val CLI_CONTACTO = "cli_contacto"
  val CLI_RAZONSOCIAL = "cli_razonsocial"
  val CLI_CUIT = "cli_cuit"
  val CLI_INGRESOSBRUTOS = "cli_ingresosbrutos"
  val CLI_CATFISCAL = "cli_catfiscal"
  val CLI_CHEQUEORDEN = "cli_chequeorden"
  val CLI_CODPOSTAL = "cli_codpostal"
  val CLI_LOCALIDAD = "cli_localidad"
  val CLI_CALLE = "cli_calle"
  val CLI_CALLENUMERO = "cli_callenumero"
  val CLI_PISO = "cli_piso"
  val CLI_DEPTO = "cli_depto"
  val CLI_TEL = "cli_tel"
  val CLI_FAX = "cli_fax"
  val CLI_EMAIL = "cli_email"
  val CLI_WEB = "cli_web"
  val CLI_YAHOO = "cli_yahoo"
  val CLI_MESSENGER = "cli_messanger"
  val CLI_CREDITOCTACTE = "cli_creditoctacte"
  val CLI_CREDITOTOTAL = "cli_creditototal"
  val CLI_CREDITOACTIVO = "cli_creditoactivo"
  val CLI_EXIGE_TRANSPORTE = "cli_exigeTransporte"
  val CLI_EXIGE_PROVINCIA = "cli_exigeProvincia"
  val CLI_PCIA_TRANSPORTE = "cli_pciaTransporte"
  val CLI_ID_PADRE = "cli_id_padre"
  val CLI_NOMBRE_PADRE = "cli_nombrePadre"
  val CLI_ES_PROSPECTO = "cli_esprospecto"
  val CLI_ID_REFERIDO = "cli_id_referido"
  val CLI_HORARIO_MDESDE = "cli_horario_m_desde"
  val CLI_HORARIO_MHASTA = "cli_horario_m_hasta"
  val CLI_HORARIO_TDESDE = "cli_horario_t_desde"
  val CLI_HORARIO_THASTA = "cli_horario_t_hasta"

  val CLI_INF_US_ID = "cli_inf_us_id"
  val CLI_INF_ACTIVE = "cli_inf_active"

  val REFERIDO = "referido"
  val US_ACTIVO = "us_activo"

  val CLIENTE_BASE = "base"
  val CLIENTE_REFERENCES = "references"
  val CLIENTE_ADDRESS = "address"

  // Proveedor
  val PROVEEDOR = "Proveedor"
  val PROV_ID = "prov_id"
  val PROV_NAME = "prov_nombre"
  val PROV_DESCRIP = "prov_descrip"
  val PROV_CODE = "prov_codigo"
  val PROV_CONTACTO = "prov_contacto"
  val PROV_RAZONSOCIAL = "prov_razonsocial"
  val PROV_CUIT = "prov_cuit"
  val PROV_INGRESOSBRUTOS = "prov_ingresosbrutos"
  val PROV_CATFISCAL = "prov_catfiscal"
  val PROV_CHEQUEORDEN = "prov_chequeorden"
  val PROV_CODPOSTAL = "prov_codpostal"
  val PROV_LOCALIDAD = "prov_localidad"
  val PROV_CALLE = "prov_calle"
  val PROV_CALLENUMERO = "prov_callenumero"
  val PROV_PISO = "prov_piso"
  val PROV_DEPTO = "prov_depto"
  val PROV_TEL = "prov_tel"
  val PROV_FAX = "prov_fax"
  val PROV_EMAIL = "prov_email"
  val PROV_WEB = "prov_web"
  val PROV_IMPRIME_TICKET = "prov_imprimeticket"
  val PROV_CREDITOCTACTE = "prov_creditoctacte"
  val PROV_CREDITOTOTAL = "prov_creditototal"
  val PROV_CREDITOACTIVO = "prov_creditoactivo"

  val PROV_BANCO = "prov_banco"
  val PROV_NRO_CTA_BANCO = "prov_nroctabanco"
  val PROV_CBU = "prov_cbu"
  val PROV_NRO_CLIENTE = "prov_nrocliente"

  val PROV_HORARIO_MDESDE = "prov_horario_m_desde"
  val PROV_HORARIO_MHASTA = "prov_horario_m_hasta"
  val PROV_HORARIO_TDESDE = "prov_horario_t_desde"
  val PROV_HORARIO_THASTA = "prov_horario_t_hasta"

  val PROVEEDOR_BASE = "base"
  val PROVEEDOR_REFERENCES = "references"
  val PROVEEDOR_ADDRESS = "address"

  // Ingresos brutos categoria
  val INGRESOSBRUTOSCATEGORIA = "IngresosBrutosCategoria"
  val IBC_ID = "ibc_id"
  val IBC_NAME = "ibc_nombre"
  val IBC_CODE = "ibc_codigo"
  val IBC_DESCRIP = "ibc_descrip"

  //
  // Rubro
  //
  val RUBRO_TABLES = "tables"
  val RUBRO_ITEMS = "items"

  val RUBRO = "Rubro"
  val RUB_ID = "rub_id"
  val RUB_NAME = "rub_nombre"
  val RUB_CODE = "rub_codigo"
  val RUB_DESCRIP = "rub_descrip"
  val RUB_ES_CRITERIO = "rub_escriterio"

  // Tabla de Rubros
  val RUBRO_TABLA = "RubroTabla"
  val RUBT_ID = "rubt_id"
  val RUBT_NAME = "rubt_nombre"
  val RUBT_CODE = "rubt_codigo"
  val RUBT_DESCRIP = "rubt_descrip"

  // Tabla Rubro Item
  val RUBRO_TABLA_ITEM = "RubroTablaItem"
  val RUBTI_ID = "rubti_id"
  val RUBTI_NAME = "rubti_nombre"
  val RUBTI_CODE = "rubti_codigo"
  val RUBTI_DESCRIP = "rubti_descrip"

  val RUBT_ID_1 = "rubt_id1"
  val RUBT_ID_2 = "rubt_id2"
  val RUBT_ID_3 = "rubt_id3"
  val RUBT_ID_4 = "rubt_id4"
  val RUBT_ID_5 = "rubt_id5"
  val RUBT_ID_6 = "rubt_id6"
  val RUBT_ID_7 = "rubt_id7"
  val RUBT_ID_8 = "rubt_id8"
  val RUBT_ID_9 = "rubt_id9"
  val RUBT_ID_10 = "rubt_id10"

  val RUBT_NAME_1 = "rubt_name1"
  val RUBT_NAME_2 = "rubt_name2"
  val RUBT_NAME_3 = "rubt_name3"
  val RUBT_NAME_4 = "rubt_name4"
  val RUBT_NAME_5 = "rubt_name5"
  val RUBT_NAME_6 = "rubt_name6"
  val RUBT_NAME_7 = "rubt_name7"
  val RUBT_NAME_8 = "rubt_name8"
  val RUBT_NAME_9 = "rubt_name9"
  val RUBT_NAME_10 = "rubt_name10"
  
  // Escala
  val ESCALA = "Escala"
  val ESC_ID = "esc_id"
  val ESC_NAME = "esc_nombre"
  val ESC_CODE = "esc_codigo"

  // Transporte
  val TRANSPORTE = "Transporte"
  val TRANS_ID = "trans_id"
  val TRANS_NAME = "trans_nombre"
  val TRANS_CODE = "trans_codigo"
  val TRANS_DESCRIP = "trans_descrip"
  val TRANS_TELEFONO = "trans_telefono"
  val TRANS_DIRECCION = "trans_direccion"
  val TRANS_MAIL = "trans_mail"
  val TRANS_WEB = "trans_web"

  val TRANS_HORARIO_MDESDE = "trans_horario_m_desde"
  val TRANS_HORARIO_MHASTA = "trans_horario_m_hasta"
  val TRANS_HORARIO_TDESDE = "trans_horario_t_desde"
  val TRANS_HORARIO_THASTA = "trans_horario_t_hasta"

  // Lista de Precios
  val LISTA_PRECIO = "ListaPrecio"
  val LP_ID = "lp_id"
  val LP_NAME = "lp_nombre"

  // Lista de Precios Items
  val LISTA_PRECIO_ITEM = "ListaPrecioItem"
  val LPI_ID = "lpi_id"
  val LPI_PRECIO = "lpi_precio"
  val LPI_PORCENTAJE = "lpi_porcentaje"
  val LPI_FECHA = "lpi_fecha"

  // Lista de Descuentos
  val LISTA_DESCUENTO = "ListaDescuento"
  val LD_ID = "ld_id"
  val LD_NAME = "ld_nombre"

  // Lista de Precios Clientes
  val LISTA_PRECIO_CLIENTE = "ListaPrecioCliente"
  val LP_CLI_ID = "lpcli_id"

  val LISTA_PRECIO_PROVEEDOR = "ListaPrecioProveedor"
  val LP_PROV_ID = "lpprov_id"

  // Lista de Descuentos Clientes
  val LISTA_DESCUENTO_CLIENTE = "ListaDescuentoCliente"
  val LD_CLI_ID = "ldcli_id"

  val LISTA_DESCUENTO_PROVEEDOR = "ListaDescuentoProveedor"
  val LD_PROV_ID = "ldprov_id"

  // Catalogo Web
  val CATALOGO_WEB = "CatalogoWeb"
  val CATW_ID = "catw_id"
  val CATW_NAME = "catw_nombre"
  val CATW_CODE = "catw_codigo"
  val CATW_DESCRIP = "catw_descrip"
  val CATW_UPDATE_ADDRESS = "catw_updateaddress"
  val CATW_UPDATE_USER = "catw_updateuser"
  val CATW_UPDATE_PWD = "catw_updatepwd"
  val CATW_FTP_ADDRESS = "catw_ftpaddress"
  val CATW_FTP_USER = "catw_ftpuser"
  val CATW_FTP_PWD = "catw_ftppwd"
  val CATW_FOLDER_IMAGE = "catw_folderimage"
  val CATW_CSCART = "catw_cscart"

  // Catalogo Web Item
  val CATALOGO_WEB_ITEM = "CatalogoWebItem"
  val CATWI_ID = "catwi_id"
  val CATWI_ACTIVO = "catwi_activo"

  // Catalogo Web Categoria
  val CATALOGO_WEB_CATEGORIA = "CatalogoWebCategoria"
  val CATWC_ID = "catwc_id"
  val CATWC_NAME = "catwc_nombre"
  val CATWC_CODE = "catwc_codigo"
  val CATWC_DESCRIP = "catwc_descrip"

  // Catalogo Web Categoria Item
  val CATALOGO_WEB_CATEGORIA_ITEM = "CatalogoWebCategoriaItem"
  val CATWCI_ID = "catwci_id"
  val CATWCI_POSICION = "catwci_posicion"
  val CATWCI_ACTIVO = "catwci_activo"

  // Pais
  val PAIS = "Pais"
  val PA_ID = "pa_id"
  val PA_NAME = "pa_nombre"
  val PA_CODE = "pa_codigo"
  val PA_DESCRIP = "pa_descrip"

  // CircuitoContable
  val CIRCUITO_CONTABLE = "CircuitoContable"
  val CICO_ID = "cico_id"
  val CICO_NAME = "cico_nombre"
  val CICO_CODE = "cico_codigo"
  val CICO_DESCRIP = "cico_descrip"

  // Calidad
  val CALIDAD = "Calidad"
  val CALID_ID = "calid_id"
  val CALID_NAME = "calid_nombre"
  val CALID_CODE = "calid_codigo"
  val CALID_DESCRIP = "calid_descrip"

  // ClienteContactoTipo
  val CLIENTE_CONTACTO_TIPO = "ClienteContactoTipo"
  val CLICT_ID = "clict_id"
  val CLICT_NAME = "clict_nombre"
  val CLICT_CODE = "clict_codigo"
  val CLICT_DESCRIP = "clict_descrip"

  // Marca
  val MARCA = "Marca"
  val MARC_ID = "marc_id"
  val MARC_NAME = "marc_nombre"
  val MARC_CODE = "marc_codigo"
  val MARC_DESCRIP = "marc_descrip"
  val MARC_TEXTO_WEB = "marc_textoweb"

  // Departamento
  val DEPARTAMENTO = "Departamento"
  val DPTO_ID = "dpto_id"
  val DPTO_NAME = "dpto_nombre"
  val DPTO_CODE = "dpto_codigo"
  val DPTO_DESCRIP = "dpto_descrip"
  val DPTO_ID_PADRE = "dpto_id_padre"

  // DepartamentoProveedor
  val DEPARTAMENTO_PROVEEDOR = "DepartamentoProveedor"
  val DPTO_PROV_ID = "dptoprov_id"

  // ProveedorCentroCosto
  val PROVEEDOR_CENTRO_COSTO = "ProveedorCentroCosto"
  val PROV_CCOS_ID = "provccos_id"

  // DepartamentoCliente
  val DEPARTAMENTO_CLIENTE = "DepartamentoCliente"
  val DPTO_CLI_ID = "dptocli_id"

  // Camion
  val CAMION = "Camion"
  val CAM_ID = "cam_id"
  val CAM_CODE = "cam_codigo"
  val CAM_DESCRIP = "cam_descrip"
  val CAM_PATENTE = "cam_patente"
  val CAM_NAME = CAM_PATENTE
  val CAM_PATENTESEMI = "cam_patentesemi"
  val CAM_TARA = "cam_tara"
  val CAM_ES_SEMI = "cam_essemi"

  // Chofer
  val CHOFER = "Chofer"
  val CHOF_ID = "chof_id"
  val CHOF_NAME = "chof_nombre"
  val CHOF_CODE = "chof_codigo"
  val CHOF_DESCRIP = "chof_descrip"
  val CHOF_TIPODNI = "chof_tipodni"
  val CHOF_DNI = "chof_dni"
  val CHOF_FECHA_NACIMIENTO = "chof_fechadenacimiento"
  val CHOF_DIRECCION = "chof_direccion"
  val CHOF_TELEFONO = "chof_telefono"

  // Ciudad
  val CIUDAD = "Ciudad"
  val CIU_ID = "ciu_id"
  val CIU_NAME = "ciu_nombre"
  val CIU_CODE = "ciu_codigo"
  val CIU_DESCRIP = "ciu_descrip"

  // Calle
  val CALLE = "Calle"
  val CALLE_ID = "calle_id"
  val CALLE_NAME = "calle_nombre"
  val CALLE_CODE = "calle_codigo"
  val CALLE_DESCRIP = "calle_descrip"

  // Calle Altura
  val CALLE_ALTURA = "CalleAltura"
  val CALLEA_ID = "callea_id"
  val CALLEA_DESDE = "callea_desde"
  val CALLEA_HASTA = "callea_hasta"

  // Proveedores CAI
  val PROVEEDOR_CAI = "ProveedorCAI"
  val PROVC_ID = "provc_id"
  val PROVC_NUMERO = "provc_numero"
  val PROVC_DESCRIP = "provc_descrip"
  val PROVC_FECHA_VTO = "provc_fechavto"
  val PROVC_SUCURSAL = "provc_sucursal"

  // Condicion Pago
  val CONDICION_PAGO = "CondicionPago"
  val CPG_ID = "cpg_id"
  val CPG_NAME = "cpg_nombre"
  val CPG_CODE = "cpg_codigo"
  val CPG_DESCRIP = "cpg_descrip"
  val CPG_ESCONTADO = "cpg_escontado"
  val CPG_ES_LIBRE = "cpg_eslibre"
  val CPG_ASIENTO_XVTO = "cpg_asientoXvto"
  val CPG_TIPO = "cpg_tipo"

  // Condicion Pago Item
  val CONDICION_PAGO_ITEM = "CondicionPagoItem"
  val CPGI_ID = "cpgi_id"
  val CPGI_DIAS = "cpgi_dias"
  val CPGI_PORCENTAJE = "cpgi_porcentaje"

  // Sucursal
  val SUCURSAL = "Sucursal"
  val SUC_ID = "suc_id"
  val SUC_NAME = "suc_nombre"
  val SUC_CODE = "suc_codigo"
  val SUC_DESCRIP = "suc_descrip"
  val SUC_NUMERO = "suc_numero"

  // Contacto
  val CONTACTO = "Contacto"
  val CONT_ID = "cont_id"
  val CONT_NAME = "cont_nombre"
  val CONT_CODE = "cont_codigo"
  val CONT_DESCRIP = "cont_descrip"
  val CONT_TEL = "cont_tel"
  val CONT_CELULAR = "cont_celular"
  val CONT_EMAIL = "cont_email"
  val CONT_CARGO = "cont_cargo"
  val CONT_DIRECCION = "cont_direccion"

  // Gasto
  val GASTO = "Gasto"
  val GTO_ID = "gto_id"
  val GTO_NAME = "gto_nombre"
  val GTO_CODE = "gto_codigo"
  val GTO_DESCRIP = "gto_descrip"
  val GTO_TIPO = "gto_tipo"
  val GTO_FIJO = "gto_fijo"
  val GTO_MINIMO = "gto_minimo"
  val GTO_PORCENTAJE = "gto_porcentaje"
  val GTO_IMPORTE = "gto_importe"

  // Documentos
  val DOCUMENTO_TIPO = "DocumentoTipo"
  val DOCT_ID = "doct_id"
  val DOCT_NAME = "doct_nombre"

  // Documentos
  val DOCUMENTO = "Documento"
  val DOC_ID = "doc_id"
  val DOC_NAME = "doc_nombre"
  val DOC_MUEVE_STOCK = "doc_muevestock"
  val DOC_TIPO_FACTURA = "doc_tipofactura"

  val DOC_EDITABLE_STATUS = "doc_editable_status"
  val DOC_EDITABLE_MESSAGE = "doc_editable_message"

  // Talonario
  val TALONARIO = "Talonario"
  val TA_ID = "ta_id"
  val TA_NAME = "ta_nombre"
  val TA_MASCARA = "ta_mascara"
  val TA_PROPUESTO = "ta_propuesto"

  val TA_NUMBER = "ta_number"
  val TA_ENABLED = "ta_enabled"

  // PercepcionTipo
  val PERCEPCION_TIPO = "PercepcionTipo"
  val PERCT_ID = "perct_id"
  val PERCT_NAME = "perct_nombre"
  val PERCT_CODE = "perct_codigo"
  val PERCT_DESCRIP = "perct_descrip"
  val PERCT_GENERA_SICORE = "perct_generasicore"
  val PERCT_CODIGO_SICORE = "perct_codigosicore"

  // Percepcion
  val PERCEPCION = "Percepcion"
  val PERC_ID = "perc_id"
  val PERC_NAME = "perc_nombre"
  val PERC_CODE = "perc_codigo"
  val PERC_IMPORTE_MINIMO = "perc_importeminimo"
  val PERC_REGIMEN_SICORE = "perc_regimensicore"
  val PERC_DESCRIP = "perc_descrip"
  val PERC_ES_IIBB = "perc_esiibb"

  // PercepcionItem
  val PERCEPCION_ITEM = "PercepcionItem"
  val PERCI_ID = "perci_id"
  val PERCI_IMPORTE_DESDE = "perci_importedesde"
  val PERCI_IMPORTE_HASTA = "perci_importehasta"
  val PERCI_PORCENTAJE = "perci_porcentaje"
  val PERCI_IMPORTEFIJO = "perci_importefijo"

  // RetencionTipo
  val RETENCION_TIPO = "RetencionTipo"
  val RETT_ID = "rett_id"
  val RETT_NAME = "rett_nombre"
  val RETT_CODE = "rett_codigo"
  val RETT_DESCRIP = "rett_descrip"
  val RETT_TIPO = "rett_tipo"
  val RETT_GENERA_SICORE = "rett_generasicore"
  val RETT_CODIGO_SICORE = "rett_codigosicore"

  // Retencion
  val RETENCION = "Retencion"
  val RET_ID = "ret_id"
  val RET_NAME = "ret_nombre"
  val RET_CODE = "ret_codigo"
  val RET_IMPORTE_MINIMO = "ret_importeminimo"
  val RET_REGIMEN_SICORE = "ret_regimensicore"
  val RET_DESCRIP = "ret_descrip"
  val RET_ACUMULA_POR = "ret_acumulapor"
  val RET_TIPO_MINIMO = "ret_tipominimo"
  val RET_ES_IIBB = "ret_esiibb"

  // RetencionItem
  val RETENCION_ITEM = "RetencionItem"
  val RETI_ID = "reti_id"
  val RETI_IMPORTE_DESDE = "reti_importedesde"
  val RETI_IMPORTE_HASTA = "reti_importehasta"
  val RETI_PORCENTAJE = "reti_porcentaje"
  val RETI_IMPORTEFIJO = "reti_importefijo"

  // Monedas
  val MONEDA = "moneda"
  val MON_ID = "mon_id"
  val MON_NAME = "mon_nombre"
  val MON_PRECIO = "mon_precio"

  //
  // Producto
  //
  val PRODUCTO_BASE = "base"
  val PRODUCTO_COMPRA = "compra"
  val PRODUCTO_STOCK = "stock"
  val PRODUCTO_VENTA = "venta"
  val PRODUCTO_RUBRO = "rubro"
  val PRODUCTO_COMEX = "comex"
  val PRODUCTO_KIT_GROUP = "kit"
  val PRODUCTO_WEB = "web"
  val PRODUCTO_NOMBRES = "names"

  val PRODUCTO = "Producto"
  val PR_ID = "pr_id"
  val PR_NAME_COMPRA = "pr_nombrecompra"
  val PR_NAME_VENTA = "pr_nombreventa"
  val PR_CODE = "pr_codigo"
  val PR_DESCRIP_VENTA = "pr_descripventa"
  val PR_DESCRIP_COMPRA = "pr_descripcompra"
  val PR_VENTA_COMPRA = "pr_ventacompra"
  val PR_VENTA_STOCK = "pr_ventastock"
  val PR_STOCK_COMPRA = "pr_stockcompra"
  val PR_LLEVA_STOCK = "pr_llevastock"
  val PR_SE_COMPRA = "pr_secompra"
  val PR_SE_VENDE = "pr_sevende"
  val PR_NO_REDONDEO = "pr_noredondeo"
  val PR_ES_KIT = "pr_eskit"
  val PR_KIT_STOCK_X_ITEM = "pr_kitStkItem"
  val PR_KIT_RESUMIDO = "pr_kitResumido"
  val PR_KIT_IDENTIDAD = "pr_kitIdentidad"
  val PR_KIT_IDENTIDAD_X_ITEM = "pr_kitIdentidadXItem"
  val PR_KIT_LOTE = "pr_kitLote"
  val PR_KIT_LOTE_X_ITEM = "pr_kitLoteXItem"
  val PR_ES_LISTA = "pr_eslista"
  val PR_PORC_INTERNO_C = "pr_porcinternoc"
  val PR_PORC_INTERNO_V = "pr_porcinternov"
  val PR_X = "pr_x"
  val PR_Y = "pr_y"
  val PR_Z = "pr_z"
  val PR_TIENE_HIJO = "pr_tienehijo"
  val PR_ID_PADRE = "pr_id_padre"
  val PR_EDITAR_PRECIO_HIJO = "pr_editarpreciohijo"
  val PR_PERMITE_EDICION = "pr_permiteedicion"
  val PR_BORRADO = "pr_borrado"
  val PR_STOCK_MINIMO = "pr_stockminimo"
  val PR_STOCK_MAXIMO = "pr_stockmaximo"
  val PR_CODIGO_EXTERNO = "pr_Codigoexterno"
  val PR_CODIGO_BARRA = "pr_codigobarra"
  val PR_CODIGO_BARRA_NAME = "pr_codigobarranombre"
  val PR_REPOSICION = "pr_reposicion"
  val UN_ID_VENTA = "un_id_venta"
  val UN_ID_COMPRA = "un_id_compra"
  val UN_ID_STOCK = "un_id_stock"

  val TI_ID_RI_COMPRA = "ti_id_ivaricompra"
  val TI_RI_PORC_COMPRA = "ti_ri_porc_compra"
  val CUE_ID_RI_COMPRA = "cue_id_ri_compra"

  val TI_ID_RNI_COMPRA = "ti_id_ivarnicompra"
  val TI_RNI_PORC_COMPRA = "ti_rni_porc_compra"
  val CUE_ID_RNI_COMPRA = "cue_id_rni_compra"

  val TI_ID_RI_VENTA = "ti_id_ivariventa"
  val TI_RI_PORC_VENTA = "ti_ri_porc_venta"
  val CUE_ID_RI_VENTA = "cue_id_ri_venta"

  val TI_ID_RNI_VENTA = "ti_id_ivarniventa"
  val TI_RNI_PORC_VENTA = "ti_rni_porc_venta"
  val CUE_ID_RNI_VENTA = "cue_id_rni_venta"

  val TI_ID_INTERNOS_VENTA = "ti_id_internosv"
  val TI_PORC_INTERNOS_VENTA = "ti_int_porc_venta"

  val TI_ID_INTERNOS_COMPRA = "ti_id_internosc"
  val TI_PORC_INTERNOS_COMPRA = "ti_int_porc_compra"

  val CUEG_ID_COMPRA = "cueg_id_compra"
  val CUEG_ID_VENTA = "cueg_id_venta"
  val PR_PESO_TOTAL = "pr_pesototal"
  val PR_PESO_NETO = "pr_pesoneto"
  val UN_ID_PESO = "un_id_peso"
  val PR_CANT_X_CAJA_EXPO = "pr_cantxcajaexpo"
  val PR_LLEVA_NRO_SERIE = "pr_llevanroserie"
  val PR_LLEVA_NRO_LOTE = "pr_llevanrolote"
  val PR_ES_REPUESTO = "pr_esrepuesto"
  val PR_LOTE_FIFO = "pr_lotefifo"
  val PR_SE_PRODUCE = "pr_seProduce"
  val PR_FLETE_EXPO = "pr_fleteexpo"
  val PR_DINERARIO = "pr_dinerario"
  val PR_NAME_WEB = "pr_nombreweb"
  val PR_NAME_FACTURA = "pr_nombrefactura"
  val PR_CODIGO_HTML = "pr_codigohtml"
  val PR_CODIGO_HTML_DETALLE = "pr_codigohtmldetalle"
  val PR_ALIAS_WEB = "pr_aliasweb"
  val PR_ACTIVO_WEB = "pr_activoweb"

  val PR_EXPO_WEB = "pr_expoweb"
  val PR_EXPO_CAIRO = "pr_expocairo"
  val PR_VENTA_WEB_MAXIMA = "pr_ventaWebMaxima"
  val PR_WEB_IMAGE_FOLDER = "pr_webimagefolder"
  val PR_WEB_IMAGE_UPDATE = "pr_webimageupdate"
  val PR_ID_WEB_PADRE = "pr_id_webpadre"

  val RPT_NAME_COMPRA = "rpt_name_compra"
  val RPT_NAME_VENTA = "rpt_name_venta"
  val RPT_NAME_FACTURA = "rpt_name_factura"
  val RPT_NAME_WEB = "rpt_name_web"
  val RPT_NAME_IMG = "rpt_name_img"
  val RPT_NAME_IMG_ALT = "rpt_name_img_alt"

  val RUBTI_ID_1 = "rubti_id1"
  val RUBTI_ID_2 = "rubti_id2"
  val RUBTI_ID_3 = "rubti_id3"
  val RUBTI_ID_4 = "rubti_id4"
  val RUBTI_ID_5 = "rubti_id5"
  val RUBTI_ID_6 = "rubti_id6"
  val RUBTI_ID_7 = "rubti_id7"
  val RUBTI_ID_8 = "rubti_id8"
  val RUBTI_ID_9 = "rubti_id9"
  val RUBTI_ID_10 = "rubti_id10"
  
  val RUBTI_NAME_1 = "rubti_name1"
  val RUBTI_NAME_2 = "rubti_name2"
  val RUBTI_NAME_3 = "rubti_name3"
  val RUBTI_NAME_4 = "rubti_name4"
  val RUBTI_NAME_5 = "rubti_name5"
  val RUBTI_NAME_6 = "rubti_name6"
  val RUBTI_NAME_7 = "rubti_name7"
  val RUBTI_NAME_8 = "rubti_name8"
  val RUBTI_NAME_9 = "rubti_name9"
  val RUBTI_NAME_10 = "rubti_name10"

  val UN_NAME_STOCK = "un_name_stock"
  val UN_NAME_COMPRA = "un_name_compra"
  val UN_NAME_VENTA = "un_name_venta"

  val CUEG_NAME_COMPRA = "cueg_name_compra"
  val TI_NAME_RI_COMPRA = "ti_name_ri_compra"
  val TI_NAME_INT_COMPRA = "ti_name_int_compra"
  val CCOS_NAME_COMPRA = "ccos_name_compra"

  val CUEG_NAME_VENTA = "cueg_name_venta"
  val TI_NAME_RI_VENTA = "ti_name_ri_venta"
  val TI_NAME_INT_VENTA = "ti_name_int_venta"
  val CCOS_NAME_VENTA = "ccos_name_venta"

  val UN_NAME_PESO = "un_name_peso"

  val TI_NAME_COMEX_GANANCIAS = "ti_name_comex_ganancias"
  val TI_NAME_COMEX_IGB = "ti_name_comex_igb"
  val TI_NAME_COMEX_IVA = "ti_name_comex_iva"

  val TA_NAME_KIT_SERIE = "ta_name_kit_serie"
  val TA_NAME_KIT_LOTE = "ta_name_kit_lote"

  val PR_NAME_WEB_PADRE = "pr_nombre_web_padre"

  val TA_ID_KIT_SERIE = "ta_id_kitSerie"
  val TA_ID_KIT_LOTE = "ta_id_kitLote"

  val CCOS_ID_COMPRA = "ccos_id_compra"
  val CCOS_ID_VENTA = "ccos_id_venta"

  val PR_ES_PLANTILLA = "pr_esplantilla"

  val RPT_ID_NOMBRE_VENTA = "rpt_id_nombreventa"
  val RPT_ID_NOMBRE_COMPRA = "rpt_id_nombrecompra"
  val RPT_ID_NOMBRE_FACTURA = "rpt_id_nombrefactura"
  val RPT_ID_NOMBRE_WEB = "rpt_id_nombreweb"
  val RPT_ID_NOMBRE_IMG = "rpt_id_nombreimg"
  val RPT_ID_NOMBRE_IMG_ALT = "rpt_id_nombreimgalt"

  val TI_ID_COMEX_GANANCIAS = "ti_id_comex_ganancias"
  val TI_ID_COMEX_IGB = "ti_id_comex_igb"
  val TI_ID_COMEX_IVA = "ti_id_comex_iva"

  // Producto Tag
  val PRODUCTO_TAG = "ProductoTag"
  val PRT_ID = "prt_id"
  val PRT_TEXTO = "prt_texto"
  val PRT_EXPO_WEB = "prt_expoweb"
  val PRT_EXPO_CAIRO = "prt_expocairo"
  val PRT_ORDEN = "orden"
  val PR_ID_TAG = "pr_id_tag"

  // Producto Web Image
  val PRODUCTO_WEB_IMAGE = "ProductoWebImage"
  val PRWI_ID = "prwi_id"
  val PRWI_ARCHIVO = "prwi_archivo"
  val PRWI_TIPO = "prwi_tipo"
  val PRWI_ALT = "prwi_alt"
  val PRWI_POSICION = "prwi_posicion"

  // ListaPrecioMarcado
  val LISTA_PRECIO_MARCADO = "ListaPrecioMarcado"
  val LPM_ID = "lpm_id"
  val LPM_NAME = "lpm_nombre"
  val LPM_CODE = "lpm_codigo"
  val LPM_DESCRIP = "lpm_descrip"
  val LPM_BASE = "lpm_base"
  val LPM_PORCENTAJE = "lpm_porcentaje"
  val LPM_SALTO = "lpm_salto"
  val LPM_DECREMENTO = "lpm_decremento"
  val LPM_PORCMINIMO = "lpm_porcminimo"
  val LPM_PORCMAXIMO = "lpm_porcmaximo"
  val LPM_MONTOMINIMO = "lpm_montominimo"

  // Producto Kit
  val PRODUCTO_KIT = "ProductoKit"
  val PRK_ID = "prk_id"
  val PRK_CANTIDAD = "prk_cantidad"
  val PRK_VARIABLE = "prk_variable"
  val PR_ID_ITEM = "pr_id_item"

  // Producto Proveedor
  val PRODUCTO_PROVEEDOR = "ProductoProveedor"
  val PRPROV_ID = "prprov_id"
  val PRPROV_FABRICANTE = "prprov_fabricante"
  val PRPROV_NAME = "prprov_nombre"
  val PRPROV_CODE = "prprov_codigo"
  val PRPROV_CODIGO_BARRA = "prprov_codigoBarra"
  val PRPROV_LPI_TOP = "lpi_top"

  // Producto Cliente
  val PRODUCTO_CLIENTE = "ProductoCliente"
  val PRCLI_ID = "prcli_id"
  val PRCLI_NAME = "prcli_nombre"
  val PRCLI_CODE = "prcli_codigo"
  val PRCLI_CODIGO_BARRA = "prcli_codigoBarra"

  // Producto BOM
  val PRODUCTO_BOM = "ProductoBOM"
  val PBM_ID = "pbm_id"
  val PBM_NAME = "pbm_nombre"
  val PBM_CODE = "pbm_codigo"
  val PBM_FECHA = "pbm_fecha"

  // Usuario
  val USUARIO = "Usuario"
  val US_ID = "us_id"
  val US_NAME = "us_nombre"
  val US_CLAVE = "us_clave"
  val US_DESCRIP = "us_descrip"
  val US_EXTERNO = "us_externo"
  val US_EMP_X_DPTO = "us_empxdpto"
  val US_EMPRESA_EX = "us_empresaex"

  // Rol
  val ROL = "Rol"
  val ROL_ID = "rol_id"
  val ROL_NAME = "rol_nombre"
  val ROL_DESCRIP = "rol_descrip"

  // usuarioRol
  val USUARIO_ROL = "UsuarioRol"

  // Prestacion
  val PRESTACION = "Prestacion"
  val PRE_ID = "pre_id"
  val PRE_NAME = "pre_nombre"
  val PRE_GRUPO = "pre_grupo"
  
  // Empresa
  val EMPRESA = "Empresa"
  val EMP_ID = "emp_id"
  val EMP_DESCRIP = "emp_descrip"
  val EMP_RAZONSOCIAL = "emp_razonsocial"
  val EMP_NAME = "emp_nombre"
  val EMP_CUIT = "emp_cuit"
  val EMP_INGRESOSBRUTOS = "emp_ingresosbrutos"
  val EMP_CATFISCAL = "emp_catfiscal"
  val EMP_CHEQUEORDEN = "emp_chequeorden"
  val EMP_CODPOSTAL = "emp_codpostal"
  val EMP_LOCALIDAD = "emp_localidad"
  val EMP_CALLE = "emp_calle"
  val EMP_CALLENUMERO = "emp_callenumero"
  val EMP_PISO = "emp_piso"
  val EMP_DEPTO = "emp_depto"
  val EMP_TEL = "emp_tel"
  val EMP_FAX = "emp_fax"
  val EMP_EMAIL = "emp_email"
  val EMP_WEB = "emp_web"

  // UsuarioDepartamento
  val USUARIO_DEPARTAMENTO = "UsuarioDepartamento"
  val USDPTO_ID = "usdpto_id"

  // Persona
  val PERSONA = "Persona"
  val PRS_ID = "prs_id"
  val PRS_NAME = "prs_nombre"
  val PRS_APELLIDO = "prs_apellido"
  val PRS_CODE = "prs_codigo"
  val PRS_DESCRIP = "prs_descrip"
  val PRS_INTERNO = "prs_interno"
  val PRS_TEL_TRAB = "prs_telTrab"
  val PRS_TEL_CASA = "prs_telCasa"
  val PRS_CELULAR = "prs_celular"
  val PRS_EMAIL = "prs_email"
  val PRS_CARGO = "prs_cargo"
  val PRS_FECHA_NAC = "prs_fechaNac"
  val PRS_DOCUMENTO = "prs_documento"
  val PRS_WEB = "prs_web"
  val PRS_CODPOSTAL = "prs_codpostal"
  val PRS_LOCALIDAD = "prs_localidad"
  val PRS_CALLE = "prs_calle"
  val PRS_CALLENUMERO = "prs_callenumero"
  val PRS_PISO = "prs_piso"
  val PRS_DEPTO = "prs_depto"
  val PRS_ES_EMPLEADO = "prs_esempleado"

  // Empresa Cliente
  val EMPRESA_CLIENTE = "EmpresaCliente"
  val EMP_CLI_ID = "empcli_id"

  // Empresa Proveedor
  val EMPRESA_PROVEEDOR = "EmpresaProveedor"
  val EMP_PROV_ID = "empprov_id"

  // Idioma
  val IDIOMA = "Idioma"
  val IDM_ID = "idm_id"
  val IDM_NAME = "idm_nombre"
  val IDM_CODE = "idm_codigo"

  // Tipo Operacion
  val TIPO_OPERACION = "TipoOperacion"
  val TO_ID = "to_id"
  val TO_NAME = "to_nombre"
  val TO_CODE = "to_codigo"
  val TO_GENERADEUDA = "to_generadeuda"
  val TO_DESCRIP = "to_descrip"

  // Tipo Operacion Cuenta Grupo
  val TIPO_OPERACION_CUENTA_GRUPO = "TipoOperacionCuentaGrupo"
  val TO_CUEG_ID = "tocueg_id"

  // Embalaje
  val EMBALAJE = "Embalaje"
  val EMBL_ID = "embl_id"
  val EMBL_NAME = "embl_nombre"
  val EMBL_CODE = "embl_codigo"
  val EMBL_DESCRIP = "embl_descrip"
  val EMBL_CAPACIDAD = "embl_capacidad"
  val EMBL_ALTO = "embl_alto"
  val EMBL_ANCHO = "embl_ancho"
  val EMBL_LARGO = "embl_largo"
  val EMBL_TARA = "embl_tara"
  val PR_ID_STOCK = "pr_id_stock"

  // Usuario DepositoLogico
  val USUARIO_DEPOSITO_LOGICO = "UsuarioDepositoLogico"
  val US_DEPL_ID = "usdepl_id"

  // Expo Grupo Precio
  val EGP_ID = "egp_id"
  val EGP_NAME = "egp_nombre"

  // Expo Familia
  val EFM_ID = "efm_id"
  val EFM_NAME = "efm_nombre"

  // Producto Formula Kit
  val PRODUCTO_FORMULA_KIT = "ProductoFormulaKit"
  val PRFK_ID = "prfk_id"
  val PRFK_NAME = "prfk_nombre"
  val PRFK_CODE = "prfk_codigo"
  val PRFK_DEFAULT = "prfk_default"
  val PRFK_DESCRIP = "prfk_descrip"

  val PR_ID_SERIE = "pr_id_serie"
  val PR_ID_LOTE = "pr_id_lote"

  // Producto Kit Item Alternativo
  val PRODUCTO_KIT_ITEM_A = "ProductoKitItemA"
  val PRKA_ID = "prka_id"

  // Feriado
  val FERIADO = "Feriado"
  val FE_ID = "fe_id"
  val FE_NAME = "fe_nombre"
  val FE_CODE = "fe_codigo"
  val FE_DESCRIP = "fe_descrip"
  val FE_DIA = "fe_dia"
  val FE_MES = "fe_mes"
  val FE_ANIO = "fe_anio"
  val FE_BANCO = "fe_banco"
  val FE_LABORAL = "fe_laboral"
  val FE_LOCAL = "fe_local"
  val FE_RECURRENTE = "fe_recurrente"

  // PercepcionCategoriaFiscal
  val PERCEPCIONCATEGORIAFISCAL = "PercepcionCategoriaFiscal"
  val PERC_CATF_ID = "perccatf_id"
  val PERC_CATF_BASE = "perccatf_base"

  // PercepcionProvincia
  val PERCEPCIONPROVINCIA = "PercepcionProvincia"
  val PERC_PRO_ID = "percpro_id"

  // PercepcionEmpresa
  val PERCEPCIONEMPRESA = "PercepcionEmpresa"
  val PERC_EMP_ID = "percemp_id"

  // CategoriaFiscal
  val CATEGORIAFISCAL = "CategoriaFiscal"
  val CATF_ID = "catf_id"
  val CATF_NAME = "catf_nombre"

  // RetencionCategoriaFiscal
  val RETENCIONCATEGORIAFISCAL = "RetencionCategoriaFiscal"
  val RET_CATF_ID = "retcatf_id"
  val RET_CATF_BASE = "retcatf_base"

  // RetencionProvincia
  val RETENCIONPROVINCIA = "RetencionProvincia"
  val RET_PRO_ID = "retpro_id"

  // ProductoDepositoFisico
  val PRODUCTO_DEPOSITO_FISICO = "ProductoDepositoFisico"
  val PRDEPF_ID = "prdepf_id"
  val PRDEPF_X = "prdepf_x"
  val PRDEPF_Y = "prdepf_y"
  val PRDEPF_Z = "prdepf_z"
  val PRDEPF_STOCK_MINIMO = "prdepf_stockminimo"
  val PRDEPF_STOCK_MAXIMO = "prdepf_stockmaximo"
  val PRDEPF_REPOSICION = "prdepf_reposicion"

  // ProductoDepositoLogico
  val PRODUCTO_DEPOSITO_LOGICO = "ProductoDepositoLogico"
  val PRDEPL_ID = "prdepl_id"
  val PRDEPL_X = "prdepl_x"
  val PRDEPL_Y = "prdepl_y"
  val PRDEPL_Z = "prdepl_z"
  val PRDEPL_STOCK_MINIMO = "prdepl_stockminimo"
  val PRDEPL_STOCK_MAXIMO = "prdepl_stockmaximo"
  val PRDEPL_REPOSICION = "prdepl_reposicion"

  // Caja
  val CAJA = "Caja"
  val CJ_ID = "cj_id"
  val CJ_NAME = "cj_nombre"
  val CJ_CODE = "cj_codigo"
  val CJ_DESCRIP = "cj_descrip"
  val CJ_HOJA_RUTA = "cj_hojaruta"

  // Caja-Cuenta
  val CAJACUENTA = "CajaCuenta"
  val CJC_ID = "cjc_id"
  val CUE_ID_TRABAJO = "cue_id_trabajo"
  val CUE_ID_FONDOS = "cue_id_fondos"

  // Caja-Cajero
  val CAJACAJERO = "CajaCajero"
  val CJCJ_ID = "cjcj_id"

  // AjusteInflacion
  val AJUSTEINFLACION = "AjusteInflacion"
  val AJE_ID = "aje_id"
  val AJE_NAME = "aje_nombre"
  val AJE_CODE = "aje_codigo"
  val AJE_DESCRIP = "aje_descrip"
  val AJE_METODO = "aje_metodo"
  val AJE_AGRUPACCOS = "aje_agrupaccos"
  val AJE_INCLUIRSINCCOS = "aje_incluirsinccos"
  val CUE_ID_PATRIMONIAL = "cue_id_patrimonial"
  val CUE_ID_RESULTADOS = "cue_id_resultados"

  // AjusteInflacionItem
  val AJUSTEINFLACIONITEM = "AjusteInflacionItem"
  val AJI_ID = "aji_id"

  // AjusteInflacionItem
  val AJUSTEINFLACIONITEMTIPO = "AjusteInflacionItemTipo"
  val AJIT_ID = "ajit_id"
  val AJIT_NAME = "ajit_nombre"

  // AjusteInflacionIndice
  val AJUSTEINFLACIONINDICE = "AjusteInflacionIndice"
  val AJII_ID = "ajii_id"
  val AJII_FECHA = "ajii_fecha"
  val AJII_INDICE = "ajii_indice"

  // ProductoHelpConfig
  val PRODUCTO_HELP_CONFIG = "ProductoHelpConfig"
  val PRHC_ID = "prhc_id"
  val PRHC_NAME = "prhc_nombre"
  val PRHC_TECLA = "prhc_tecla"
  val PRHC_ATRIBUTO_INDICE = "prhc_atributo_indice"
  val PRHC_VALOR_CODE = "prhc_valor_codigo"
  val PRHC_DESCRIP = "prhc_descrip"
  val PRHC_DEFAULT = "prhc_default"
  val PRHC_DEFAULT_SRV = "prhc_defaultsrv"
  val PRHC_DEFAULT_PRP = "prhc_defaultprp"
  val PRHC_DEFAULT_PRNS = "prhc_defaultprns"

  // ListaPrecioConfig
  val LISTAPRECIOCONFIG = "ListaPrecioConfig"
  val LPC_ID = "lpc_id"
  val LPC_ORDEN = "lpc_orden"

  // Proyecto
  val PROY_ID = "proy_id"
  val PROY_NAME = "proy_nombre"

  // PersonaDocumentoTipo
  val PERSONADOCUMENTOTIPO = "PersonaDocumentoTipo"
  val PRSDT_ID = "prsdt_id"
  val PRSDT_NAME = "prsdt_nombre"
  val PRSDT_CODE = "prsdt_codigo"
  val PRSDT_DESCRIP = "prsdt_descrip"

  // Curso
  val CUR_ID = "cur_id"
  val CUR_NAME = "cur_nombre"

  // Codigos Postales
  val CPA_ID = "cpa_id"
  val CPA_CODE = "cpa_codigo"

  // PosicionArancel
  val POSICION_ARANCEL = "PosicionArancel"
  val POAR_ID = "poar_id"
  val POAR_NAME = "poar_nombre"
  val POAR_CODE = "poar_codigo"
  val POAR_DESCRIP = "poar_descrip"
  val TI_ID_ESTADISTICA = "ti_id_estadistica"
  val TI_ID_DERECHOS = "ti_id_derechos"
  val TI_ESTADISTICA = "estadistica"
  val TI_DERECHOS = "derechos"

  // Producto Comunidad Internet
  val PRODUCTO_COMUNIDAD_INTERNET = "ProductoComunidadInternet"
  val PRCMI_ID = "prcmi_id"
  val PRCMI_CODE = "prcmi_codigo"
  val PRCMI_DESCRIP = "prcmi_descrip"
  val PRCMI_FECHA_ALTA = "prcmi_fechaalta"
  val PRCMI_FECHA_VTO = "prcmi_fechavto"
  val PRCMI_PRECIO = "prcmi_precio"

  // Comunidad Internet
  val COMUNIDADINTERNET = "ComunidadInternet"
  val CMI_ID = "cmi_id"
  val CMI_NAME = "cmi_nombre"
  val CMI_CODE = "cmi_codigo"

  // Producto Leyenda
  val PRODUCTO_LEYENDA = "ProductoLeyenda"
  val PRL_ID = "prl_id"
  val PRL_NAME = "prl_nombre"
  val PRL_TEXTO = "prl_texto"
  val PRL_TAG = "prl_tag"
  val PRL_ORDEN = "prl_orden"

  // Tarifario
  val TARIFARIO = "Tarifario"
  val TF_ID = "tf_id"
  val TF_NAME = "tf_nombre"
  val TF_CODE = "tf_codigo"
  val TF_DESCRIP = "tf_descrip"

  // Tarifario Altura
  val TARIFARIOALTURA = "TarifarioAltura"
  val TFA_ID = "tfa_id"
  val TFA_DESDE = "tfa_desde"
  val TFA_HASTA = "tfa_hasta"

  // Tarifario Calle
  val TARIFARIOCALLE = "TarifarioCalle"
  val TF_CALLE_ID = "tfcalle_id"

  // Tarifario Paralela
  val TARIFARIOPARALELA = "TarifarioParalela"
  val TFP_ID = "tfp_id"
  val TFP_ALTURA_BASE = "tfp_alturabase"
  val TFP_ALTURA_DESDE = "tfp_alturadesde"

  // FormaPago
  val FORMAPAGO = "FormaPago"
  val FP_ID = "fp_id"
  val FP_NAME = "fp_nombre"
  val FP_CODE = "fp_codigo"
  val FP_DESCRIP = "fp_descrip"

  val FP_LUNES = "fp_lunes"
  val FP_MARTES = "fp_martes"
  val FP_MIERCOLES = "fp_miercoles"
  val FP_JUEVES = "fp_jueves"
  val FP_VIERNES = "fp_viernes"
  val FP_SABADO = "fp_sabado"
  val FP_DOMINGO = "fp_domingo"

  // VentaModo
  val VENTAMODO = "VentaModo"
  val VM_ID = "vm_id"
  val VM_NAME = "vm_nombre"
  val VM_CODE = "vm_codigo"
  val VM_DESCRIP = "vm_descrip"
  val VM_CTA_CTE = "vm_ctacte"
  val VM_OS = "vm_os"
  val VM_PV = "vm_pv"
  val VM_CMVXI = "vm_cmvxi"
  val VM_COBZ = "vm_cobz"

  val CONFIGURACION = "Configuracion"
  val CFG_GRUPO = "cfg_grupo"
  val CFG_ASPECTO = "cfg_aspecto"
  val CFG_VALOR = "cfg_valor"

  // Lenguaje
  val LENGUAJE = "Lenguaje"
  val LENG_ID = "leng_id"
  val LENG_NAME = "leng_nombre"

  // Estado
  val ESTADO = "Estado"
  val EST_ID = "est_id"
  val EST_NAME = "est_nombre"
  val EST_CODE = "est_codigo"
  val EST_DESCRIP = "est_descrip"

  val BRANCH = "Rama"
  val BRAN_ID = "ram_id"
  val BRAN_NAME = "ram_nombre"

  val INFORME = "Informe"
  val INF_ID = "inf_id"
  val INF_CODE = "inf_code"
  val INF_NAME = "inf_name"

  val REPORTE = "Reporte"
  val RPT_ID = "rpt_id"
  val RPT_NAME = "rpt_nombre"

  // Producto Numero Serie
  val PRODUCTO_NUMERO_SERIE = "ProductoNumeroSerie"
  val PRNS_ID = "prns_id"
  val PRNS_CODE = "prns_codigo"
  val PRNS_DESCRIP = "prns_descrip"
  val PRNS_FECHA_VTO = "prns_fechavto"

  // Legajo
  val LGJ_ID = "lgj_id"
  val LGJ_NAME = "lgj_name"
  val LGJ_CODE = "lgj_codigo"

  // ListaDocumentoParametro
  val LISTA_DOCUMENTO_PARAMETRO = "ListaDocumentoParametro"
  val LDP_ID = "ldp_id"
  val LDP_VALOR = "ldp_valor"
  val LDP_ORDEN = "ldp_orden"

  // FechaControlAcceso
  val FECHA_CONTROL_ACCESO = "FechaControlAcceso"
  val FCA_ID = "fca_id"
  val FCA_NAME = "fca_nombre"
  val FCA_CODE = "fca_codigo"
  val FCA_FECHA_HASTA = "fca_Fechahasta"
  val FCA_FECHA_DESDE = "fca_Fechadesde"

  // AUXILIARY CONSTANTS
  val AUX_TI_ID_RNI_VENTA = -1
  val AUX_TI_ID_RNI_COMPRA = -2
}

object S {
  val NEW_DEPOSITO_LOGICO = 1016
  val EDIT_DEPOSITO_LOGICO = 1017
  val DELETE_DEPOSITO_LOGICO = 1018
  val LIST_DEPOSITO_LOGICO = 1019

  val NEW_UNIDAD = 1020
  val EDIT_UNIDAD = 1021
  val DELETE_UNIDAD = 1022
  val LIST_UNIDAD = 1023

  val NEW_SUCURSALCLIENTE = 1024
  val EDIT_SUCURSALCLIENTE = 1025
  val DELETE_SUCURSALCLIENTE = 1026
  val LIST_SUCURSALCLIENTE = 1027

  val NEW_BANCO = 1032
  val EDIT_BANCO = 1033
  val DELETE_BANCO = 1034
  val LIST_BANCO = 1035

  val NEW_VENDEDORES = 1036
  val EDIT_VENDEDORES = 1037
  val DELETE_VENDEDORES = 1038
  val LIST_VENDEDORES = 1039

  val NEW_TARJETACREDITO = 1040
  val EDIT_TARJETACREDITO = 1041
  val DELETE_TARJETACREDITO = 1042
  val LIST_TARJETACREDITO = 1043

  val NEW_CUENTA = 1044
  val EDIT_CUENTA = 1045
  val DELETE_CUENTA = 1046
  val LIST_CUENTA = 1047

  val NEW_LEYENDA = 1048
  val EDIT_LEYENDA = 1049
  val DELETE_LEYENDA = 1050
  val LIST_LEYENDA = 1051

  val NEW_CENTRO_COSTO = 1052
  val EDIT_CENTRO_COSTO = 1053
  val DELETE_CENTRO_COSTO = 1054
  val LIST_CENTRO_COSTO = 1055

  val NEW_COBRADOR = 1056
  val EDIT_COBRADOR = 1057
  val DELETE_COBRADOR = 1058
  val LIST_COBRADOR = 1059

  val NEW_REGLALIQUIDACION = 1060
  val EDIT_REGLALIQUIDACION = 1061
  val DELETE_REGLALIQUIDACION = 1062
  val LIST_REGLALIQUIDACION = 1063

  val NEW_CLEARING = 1064
  val EDIT_CLEARING = 1065
  val DELETE_CLEARING = 1066
  val LIST_CLEARING = 1067

  val NEW_CLIENTE = 1068
  val EDIT_CLIENTE = 1069
  val DELETE_CLIENTE = 1070
  val LIST_CLIENTE = 1071

  val NEW_PROVEEDOR = 1072
  val EDIT_PROVEEDOR = 1073
  val DELETE_PROVEEDOR = 1074
  val LIST_PROVEEDOR = 1075

  val NEW_PRODUCTO = 1076
  val EDIT_PRODUCTO = 1077
  val DELETE_PRODUCTO = 1078
  val LIST_PRODUCTO = 1079

  val NEW_RUBRO = 1080
  val EDIT_RUBRO = 1081
  val DELETE_RUBRO = 1082
  val LIST_RUBRO = 1083

  val NEW_ESCALA = 1084
  val EDIT_ESCALA = 1085
  val DELETE_ESCALA = 1086
  val LIST_ESCALA = 1087

  val NEW_TRANSPORTE = 1088
  val EDIT_TRANSPORTE = 1089
  val DELETE_TRANSPORTE = 1090
  val LIST_TRANSPORTE = 1091

  val NEW_PAIS = 1104
  val EDIT_PAIS = 1105
  val DELETE_PAIS = 1106
  val LIST_PAIS = 1107

  val NEW_CIUDAD = 1108
  val EDIT_CIUDAD = 1109
  val DELETE_CIUDAD = 1110
  val LIST_CIUDAD = 1111

  val NEW_PROVINCIA = 1112
  val EDIT_PROVINCIA = 1113
  val DELETE_PROVINCIA = 1114
  val LIST_PROVINCIA = 1115

  val NEW_ZONA = 1116
  val EDIT_ZONA = 1117
  val DELETE_ZONA = 1118
  val LIST_ZONA = 1119

  val NEW_TASA_IMPOSITIVA = 1120
  val EDIT_TASA_IMPOSITIVA = 1121
  val DELETE_TASA_IMPOSITIVA = 1122
  val LIST_TASA_IMPOSITIVA = 1123

  val NEW_DEPOSITO_FISICO = 1124
  val EDIT_DEPOSITO_FISICO = 1125
  val DELETE_DEPOSITO_FISICO = 1126
  val LIST_DEPOSITO_FISICO = 1127

  val NEW_CALIDAD = 1132
  val EDIT_CALIDAD = 1133
  val DELETE_CALIDAD = 1134
  val LIST_CALIDAD = 1135

  val NEW_MARCA = 1136
  val EDIT_MARCA = 1137
  val DELETE_MARCA = 1138
  val LIST_MARCA = 1139

  val NEW_CAMION = 1140
  val EDIT_CAMION = 1141
  val DELETE_CAMION = 1142
  val LIST_CAMION = 1143

  val NEW_CHOFER = 1144
  val EDIT_CHOFER = 1145
  val DELETE_CHOFER = 1146
  val LIST_CHOFER = 1147

  val NEW_CONDICIONPAGO = 1148
  val EDIT_CONDICIONPAGO = 1149
  val DELETE_CONDICIONPAGO = 1150
  val LIST_CONDICIONPAGO = 1151

  val NEW_SUCURSAL = 1157
  val EDIT_SUCURSAL = 1158
  val DELETE_SUCURSAL = 1159
  val LIST_SUCURSAL = 1160

  val NEW_RUBROTABLA = 1161
  val EDIT_RUBROTABLA = 1162
  val DELETE_RUBROTABLA = 1163
  val LIST_RUBROTABLA = 1164

  val NEW_GASTO = 1165
  val EDIT_GASTO = 1166
  val DELETE_GASTO = 1167
  val LIST_GASTO = 1168

  val NEW_CUENTAGRUPO = 1169
  val EDIT_CUENTAGRUPO = 1170
  val DELETE_CUENTAGRUPO = 1171
  val LIST_CUENTAGRUPO = 1172

  val NEW_PERCEPCION = 1176
  val DELETE_PERCEPCION = 1178
  val EDIT_PERCEPCION = 1179
  val LIST_PERCEPCION = 1180

  val NEW_PERCEPCIONTIPO = 1181
  val DELETE_PERCEPCIONTIPO = 1182
  val EDIT_PERCEPCIONTIPO = 1183
  val LIST_PERCEPCIONTIPO = 1184

  val NEW_RETENCION = 1185
  val DELETE_RETENCION = 1186
  val EDIT_RETENCION = 1187
  val LIST_RETENCION = 1188

  val NEW_RETENCIONTIPO = 1189
  val DELETE_RETENCIONTIPO = 1190
  val EDIT_RETENCIONTIPO = 1191
  val LIST_RETENCIONTIPO = 1192

  val NEW_DEPARTAMENTO = 1193
  val DELETE_DEPARTAMENTO = 1194
  val EDIT_DEPARTAMENTO = 1195
  val LIST_DEPARTAMENTO = 1196

  val NEW_CIRCUITO_CONTABLE = 1197
  val EDIT_CIRCUITO_CONTABLE = 1198
  val DELETE_CIRCUITO_CONTABLE = 1199
  val LIST_CIRCUITO_CONTABLE = 1200

  val NEW_EMPRESA = 1201
  val EDIT_EMPRESA = 1202
  val DELETE_EMPRESA = 1203
  val LIST_EMPRESA = 1204

  val NEW_PERSONA = 1205
  val EDIT_PERSONA = 1206
  val DELETE_PERSONA = 1207
  val LIST_PERSONA = 1208

  val NEW_WEBARTICULO = 1209
  val EDIT_WEBARTICULO = 1210
  val DELETE_WEBARTICULO = 1211
  val LIST_WEBARTICULO = 1212

  val NEW_IDIOMA = 1213
  val EDIT_IDIOMA = 1214
  val DELETE_IDIOMA = 1215
  val LIST_IDIOMA = 1216

  val NEW_TIPOOPERACION = 1218
  val EDIT_TIPOOPERACION = 1219
  val DELETE_TIPOOPERACION = 1220
  val LIST_TIPOOPERACION = 1221

  val NEW_EMBALAJE = 1222
  val EDIT_EMBALAJE = 1223
  val DELETE_EMBALAJE = 1224
  val LIST_EMBALAJE = 1225

  val NEW_PRODUCTOFKIT = 1226
  val EDIT_PRODUCTOFKIT = 1227
  val DELETE_PRODUCTOFKIT = 1228
  val LIST_PRODUCTOFKIT = 1229

  val LIST_INDICECORP = 1230

  val NEW_FERIADO = 1235
  val EDIT_FERIADO = 1236
  val DELETE_FERIADO = 1237
  val LIST_FERIADO = 1238

  val NEW_CAJA = 1239
  val EDIT_CAJA = 1240
  val DELETE_CAJA = 1241
  val LIST_CAJA = 1242

  val NEW_LISTA_PRECIO_MARCADO = 1243
  val EDIT_LISTA_PRECIO_MARCADO = 1244
  val DELETE_LISTA_PRECIO_MARCADO = 1245
  val LIST_LISTA_PRECIO_MARCADO = 1246

  val NEW_CATALOGOWEB = 1247
  val EDIT_CATALOGOWEB = 1248
  val DELETE_CATALOGOWEB = 1249
  val LIST_CATALOGOWEB = 1250

  val NEW_AJUSTEINFLACION = 1251
  val EDIT_AJUSTEINFLACION = 1252
  val DELETE_AJUSTEINFLACION = 1253
  val LIST_AJUSTEINFLACION = 1254

  val EDIT_AJUSTEINFLACIONINDICE = 1255

  val NEW_PRODUCTO_HELP_CONFIG = 1256
  val EDIT_PRODUCTO_HELP_CONFIG = 1257
  val DELETE_PRODUCTO_HELP_CONFIG = 1258
  val LIST_PRODUCTO_HELP_CONFIG = 1259

  val NEW_CALLE = 1260
  val EDIT_CALLE = 1261
  val DELETE_CALLE = 1262
  val LIST_CALLE = 1263

  val NEW_CATALOGOWEBCATEGORIA = 1264
  val EDIT_CATALOGOWEBCATEGORIA = 1265
  val DELETE_CATALOGOWEBCATEGORIA = 1266
  val LIST_CATALOGOWEBCATEGORIA = 1267

  val NEW_CLIENTE_CONTACTO_TIPO = 1268
  val EDIT_CLIENTE_CONTACTO_TIPO = 1269
  val DELETE_CLIENTE_CONTACTO_TIPO = 1270
  val LIST_CLIENTE_CONTACTO_TIPO = 1271

  val NEW_PERSONADOCUMENTOTIPO = 1272
  val EDIT_PERSONADOCUMENTOTIPO = 1273
  val DELETE_PERSONADOCUMENTOTIPO = 1274
  val LIST_PERSONADOCUMENTOTIPO = 1275

  val NEW_POSICION_ARANCEL = 1276
  val EDIT_POSICION_ARANCEL = 1277
  val DELETE_POSICION_ARANCEL = 1278
  val LIST_POSICION_ARANCEL = 1279

  val NEW_TARIFARIO = 1280
  val EDIT_TARIFARIO = 1281
  val DELETE_TARIFARIO = 1282
  val LIST_TARIFARIO = 1283

  val NEW_FORMAPAGO = 1284
  val EDIT_FORMAPAGO = 1285
  val DELETE_FORMAPAGO = 1286
  val LIST_FORMAPAGO = 1287

  val NEW_VENTAMODO = 1288
  val EDIT_VENTAMODO = 1289
  val DELETE_VENTAMODO = 1290
  val LIST_VENTAMODO = 1291

  val MODIFY_CONFIG = 1156

  val MODIFY_CONFIG_VENTAS = 1173
  val MODIFY_CONFIG_TESORERIA = 1174
  val MODIFY_CONFIG_COMPRAS = 1175
  val MODIFY_CONFIG_TICKET = 1979
  val MODIFY_CONFIG_USUARIO = 1990
  val MODIFY_CONFIG_STOCK = 1999
  val MODIFY_CONFIG_CONTABILIDAD = 1988
  val MODIFY_CONFIG_PERSONAL = 1985
  
  val MODIFY_USER_SETTINGS = 1990

  val NEW_DOCUMENTO = 4000
  val EDIT_DOCUMENTO = 4001
  val DELETE_DOCUMENTO = 4002
  val LIST_DOCUMENTO = 4003

  val NEW_FECHA_CONTROL_ACCESO = 4004
  val EDIT_FECHA_CONTROL_ACCESO = 4005
  val DELETE_FECHA_CONTROL_ACCESO = 4006
  val LIST_FECHA_CONTROL_ACCESO = 4007

  val NEW_TALONARIO = 4008
  val EDIT_TALONARIO = 4009
  val DELETE_TALONARIO = 4010
  val LIST_TALONARIO = 4011

  val LOAD_DOCUMENTS = 4012

  val EDIT_DOCUMENTO_IMPRESORA = 4013

  val NEW_DOCUMENTO_GRUPO = 4014
  val EDIT_DOCUMENTO_GRUPO = 4015
  val DELETE_DOCUMENTO_GRUPO = 4016
  val LIST_DOCUMENTO_GRUPO = 4017
}

case class DocumentListParam(
                             id: Int,
                             value: String
                              )

case class DocumentListParamValue(
                                  id: String,
                                  value: String
                                   )

object DocumentListParam {

  private val documentListParamParser: RowParser[DocumentListParam] = {
    SqlParser.get[Int](C.LDP_ID) ~
    SqlParser.get[String](C.LDP_VALOR) map {
      case
        ldpId ~
        ldpValue =>
        DocumentListParam(
          ldpId,
          ldpValue
        )
    }
  }

  def getParamValue(key: Int, params: Map[Int, String], default: String): String = {
    params get (key) match {
      case Some(value) => value
      case None => default
    }
  }

  def getParamValue(
                     user: CompanyUser, key: Int, params: Map[Int, String], default: String,
                     tableName: String, fieldId: String, fieldName: String): DocumentListParamValue = {

    val nameParser: RowParser[String] = {
      SqlParser.get[String]("name") map { case name => name }
    }
    def getName(table: String, fieldName: String, fieldId: String, id: Int) = {
      DB.withConnection(user.database.database) { implicit connection =>
        SQL(s"SELECT ${fieldName} AS name FROM ${table} WHERE ${fieldId} = {id}")
          .on('id -> id)
          .as(nameParser.singleOpt)
      }
    }
    def getBranchName(id: Int) = {
      getName(C.BRANCH, C.BRAN_NAME, C.BRAN_ID, id)
    }
    def getValue(id: String): String = {
      if(id == "0") {
        ""
      }
      else {
        if(id.length > 0 && id.substring(0, 1) == "N") {
          getBranchName(id.substring(1).toInt).getOrElse("")
        }
        else {
          getName(tableName, fieldName, fieldId, id.toInt).getOrElse("")
        }
      }
    }
    val id = getParamValue(key, params, default)
    val value = getValue(id)
    DocumentListParamValue(id, value)
  }

  def load(user: CompanyUser, preId: Int): Map[Int, String] = {

    def getMap(list: List[DocumentListParam]): Map[Int, String] = {
      def buildMap(listParams: List[DocumentListParam]): Map[Int, String] = listParams match {
        case Nil => Map()
        case h :: t => Map(h.id -> h.value) ++ buildMap(t)
      }
      buildMap(list)
    }

    val params = loadWhere(
      user,
      s"""pre_id = {preId}
        | AND (emp_id is null or emp_id = {empId})
        | AND us_id = {usId}""".stripMargin
      ,
      'preId -> preId,
      'empId -> user.cairoCompanyId,
      'usId -> user.userId
    )

    getMap(params)
  }

  def loadWhere(user: CompanyUser, where: String, args : scala.Tuple2[scala.Any, anorm.ParameterValue[_]]*) = {
    DB.withConnection(user.database.database) { implicit connection =>
      SQL(s"SELECT t1.* FROM ${C.LISTA_DOCUMENTO_PARAMETRO} t1 WHERE $where")
        .on(args: _*)
        .as(documentListParamParser.*)
    }
  }
}