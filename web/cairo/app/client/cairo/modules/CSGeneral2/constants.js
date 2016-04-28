(function() {
  "use strict";

  Cairo.General = {

    Constants: {

      ID: "id",

      FROM: "from",
      TO: "to",

      IS_VALID: "is_valid",

      // this two constants are here so we can do C.AS_ID/C.ST_ID
        // Asiento
        AS_ID: "as_id",

        // Stock
        ST_ID: "st_id",
      //---------------------------------------------------------

      ID_CLIENTE: "id_cliente",
      DOCT_ID_CLIENTE: "doct_id_cliente",
      DOC_CLIENTE: "doc_cliente",

      // Usuario
      USUARIO: "Usuario",
      US_ID: "us_id",
      US_NAME: "us_nombre",
      US_CLAVE: "us_clave",
      US_DESCRIP: "us_descrip",
      US_EXTERNO: "us_externo",
      US_EMP_X_DPTO: "us_empxdpto",
      US_EMPRESA_EX: "us_empresaex",
      US_DEPOSITO: "us_deposito",

      US_COPY_PERMISSIONS: "us_copy_permissions",

      EMPRESA_USUARIO: "EmpresaUsuario",
      EMP_US_ID: "empus_id",

      USUARIO_EMPRESA: "UsuarioEmpresa",
      US_EMP_ID: "usemp_id",
      
      // Configuracion
      CONFIGURACION: "Configuracion",
      CFG_GRUPO: "cfg_grupo",
      CFG_ASPECTO: "cfg_aspecto",
      CFG_VALOR: "cfg_valor",

      HAS_IVA_RI: "bIvaRi",
      HAS_IVA_RNI: "bIvaRni",

      // Rol
      ROL: "Rol",
      ROL_ID: "rol_id",
      ROL_NAME: "rol_nombre",
      ROL_DESCRIP: "rol_descrip",
      
      // UsuarioRol
      USUARIO_ROL: "UsuarioRol",
      
      // Prestacion
      PRESTACION: "Prestacion",
      PRE_ID: "pre_id",
      PRE_NAME: "pre_nombre",
      PRE_GRUPO: "pre_grupo",
      
      // ListaDocumentoParametro
      LISTA_DOCUMENTO_PARAMETRO: "ListaDocumentoParametro",
      LDP_ID: "ldp_id",
      LDP_VALOR: "ldp_valor",
      LDP_ORDEN: "ldp_orden",
      
      // Edicion de documentos
      DOC_EDITABLE: "editable",
      DOC_EDIT_MSG: "editMsg",
      TA_PROPUESTO: "ta_propuesto",
      TA_MASCARA: "ta_mascara",

      TA_NUMBER: "ta_number",
      TA_ENABLED: "ta_enabled",

      // Empresa
      EMPRESA: "Empresa",
      EMP_ID: "emp_id",
      EMP_NAME: "emp_nombre",
      EMP_CODE: "emp_codigo",
      EMP_CODIGO_BARRA: "emp_codigobarra",
      EMP_ES_SUCURSAL: "emp_essucursal",

      /* TODO: check if these lines must be removed */

      // Arbol
      ARBOL: "Arbol",
      ARB_ID: "arb_Id",
      ARB_NAME: "arb_nombre",
      
      // Rama
      RAMA: "Rama",
      RAM_ID: "ram_id",
      RAM_NAME: "ram_nombre",
      RAM_PADRE: "ram_id_padre",
      RAM_ORDEN: "ram_orden",
      
      // RamaConfig
      RAMA_CONFIG: "RamaConfig",
      RAMC_ASPECTO: "ramc_aspecto",
      RAMC_VALOR: "ramc_valor",
      
      // Hoja
      HOJA: "Hoja",
      HOJA_ID: "hoja_Id",

      /* TODO: end lines to be removed */
      
      // permiso
      PERMISO: "Permiso",
      PER_ID: "per_id",
      PER_ID_PADRE: "per_id_padre",
      
      // Estado
      ESTADO: "Estado",
      EST_ID: "est_id",
      EST_NAME: "est_nombre",
      EST_CODE: "est_codigo",
      EST_DESCRIP: "est_descrip",
      
      // ReporteFormulario
      REPORTE_FORMULARIO: "ReporteFormulario",
      RPTF_ID: "rptf_id",
      RPTF_NAME: "rptf_nombre",
      RPTF_CSRFILE: "rptf_csrfile",
      RPTF_TIPO: "rptf_tipo",
      RPTF_SUGERIDO: "rptf_sugerido",
      RPTF_SUGERIDO_EMAIL: "rptf_sugeridoemail",
      RPTF_COPIAS: "rptf_copias",
      RPTF_DOC_IMPRIMIR_EN_ALTA: "rptf_docImprimirEnAlta",
      RPTF_OBJECT: "rptf_object",

      // Informe
      INFORME: "Informe",
      INF_ID: "inf_id",
      INF_NAME: "inf_nombre",
      INF_CODE: "inf_codigo",

      // Provincia
      PROVINCIA: "Provincia",
      PRO_ID: "pro_id",
      PRO_NAME: "pro_nombre",
      PRO_CODE: "pro_codigo",
      PRO_DESCRIP: "pro_descrip",

      // Provincia
      PRO_ID_ORIGEN: "pro_id_origen",
      PRO_ORIGEN_NAME: "ProOrigen",
      PRO_ID_DESTINO: "pro_id_destino",
      PRO_DESTINO_NAME: "ProDestino",

      // Unidad
      UNIDAD: "Unidad",
      UN_ID: "un_id",
      UN_NAME: "un_nombre",
      UN_CODE: "un_codigo",

      // DepositoFisico
      DEPOSITO_FISICO: "DepositoFisico",
      DEPF_ID: "depf_id",
      DEPF_NAME: "depf_nombre",
      DEPF_CODE: "depf_codigo",
      DEPF_DESCRIP: "depf_descrip",
      DEPF_TEL: "depf_tel",
      DEPF_DIR: "depf_dir",

      // DepositoLogico
      DEPOSITO_LOGICO: "DepositoLogico",
      DEPL_ID: "depl_id",
      DEPL_NAME: "depl_nombre",
      DEPL_CODE: "depl_codigo",
      DEPL_DESCRIP: "depl_descrip",
      DEPL_ES_TEMP: "depl_estemp",

      // Stock
      DEPL_ID_ORIGEN: "depl_id_origen",
      DEPL_ID_DESTINO: "depl_id_destino",

      // StockLote
      STOCK_LOTE: "StockLote",
      STL_ID: "stl_id",
      STL_CODE: "stl_codigo",

      // Zona
      ZONA: "Zona",
      ZON_ID: "zon_id",
      ZON_NAME: "zon_nombre",
      ZON_CODE: "zon_codigo",
      ZON_DESCRIP: "zon_descrip",
      ZON_PRECIO: "zon_precio",

      // TasaImpositiva
      TASA_IMPOSITIVA: "TasaImpositiva",
      TI_ID: "ti_id",
      TI_NAME: "ti_nombre",
      TI_CODE: "ti_codigo",
      TI_PORCENTAJE: "ti_porcentaje",
      TI_CODIGO_DGI1: "ti_codigoDGI1",
      TI_CODIGO_DGI2: "ti_codigoDGI2",
      TI_TIPO: "ti_tipo",

      // SucursalCliente
      CLIENTE_SUCURSAL: "ClienteSucursal",
      CLIS_ID: "clis_id",
      CLIS_NAME: "clis_nombre",
      CLIS_CODE: "clis_codigo",
      CLIS_DESCRIP: "clis_descrip",
      CLIS_LOCALIDAD: "clis_localidad",
      CLIS_CALLE: "clis_calle",
      CLIS_CALLENUMERO: "clis_callenumero",
      CLIS_PISO: "clis_piso",
      CLIS_DEPTO: "clis_depto",
      CLIS_TEL: "clis_tel",
      CLIS_FAX: "clis_fax",
      CLIS_EMAIL: "clis_email",
      CLIS_COD_POSTAL: "clis_codpostal",
      CLIS_CONTACTO: "clis_contacto",

      // Banco
      BANCO: "Banco",
      BCO_ID: "bco_id",
      BCO_NAME: "bco_nombre",
      BCO_CODE: "bco_codigo",
      BCO_CONTACTO: "bco_contacto",
      BCO_TELEFONO: "bco_telefono",
      BCO_DIRECCION: "bco_direccion",
      BCO_WEB: "bco_web",
      BCO_MAIL: "bco_mail",

      // Vendedor
      VENDEDOR: "Vendedor",
      VEN_ID: "ven_id",
      VEN_NAME: "ven_nombre",
      VEN_DESCRIP: "ven_descrip",
      VEN_CODE: "ven_codigo",

      // TarjetaCredito
      TARJETACREDITO: "TarjetaCredito",
      TJC_ID: "tjc_id",
      TJC_NAME: "tjc_nombre",
      TJC_CODE: "tjc_codigo",
      TJC_DESCRIP: "tjc_descrip",
      TJC_COMISION: "tjc_comision",
      CUE_ID_EN_CARTERA: "cue_id_encartera",
      CUE_ID_BANCO: "cue_id_banco",
      CUE_ID_PRESENTADO: "cue_id_presentado",
      CUE_ID_RECHAZO: "cue_id_rechazo",
      CUE_ID_COMISION: "cue_id_comision",

      // TarjetaCreditoCuota
      TARJETACREDITOCUOTA: "TarjetaCreditoCuota",
      TJCCU_ID: "tjccu_id",
      TJCCU_CANTIDAD: "tjccu_cantidad",
      TJCCU_COMISION: "tjccu_comision",

      // Cuenta
      CUENTA: "Cuenta",
      CUE_ID: "cue_id",
      CUE_NAME: "cue_nombre",
      CUE_CODE: "cue_codigo",
      CUE_DESCRIP: "cue_descrip",
      CUE_LLEVA_CENTRO_COSTO: "cue_llevacentrocosto",
      CUE_IDENTIFICACION_EXTERNA: "cue_identificacionexterna",
      CUE_PRODUCTO: "cue_producto",
      CUE_CODIGO_RPT: "cue_codigorpt",
      CUE_ES_EFECTIVO: "cue_esefectivo",
      CUE_ES_TICKET: "cue_esticket",

      CUE_ID_IVA_RI: "cue_id_IvaRI",
      CUE_ID_IVA_RNI: "cue_id_IvaRNI",

      // Cuenta Grupo
      CUENTAGRUPO: "CuentaGrupo",
      CUEG_ID: "cueg_id",
      CUEG_NAME: "cueg_nombre",
      CUEG_CODE: "cueg_codigo",
      CUEG_DESCRIP: "cueg_descrip",
      CUEG_TIPO: "cueg_tipo",

      // Cuenta Grupo Cliente
      CLIENTE_CUENTA_GRUPO: "ClienteCuentaGrupo",
      CLI_CUEG_ID: "clicueg_id",

      // Cuenta Grupo Proveedor
      PROVEEDOR_CUENTA_GRUPO: "ProveedorCuentaGrupo",
      PROV_CUEG_ID: "provcueg_id",

      // Percepcion Cliente
      CLIENTE_PERCEPCION: "ClientePercepcion",
      CLI_PERC_ID: "cliperc_id",
      CLI_PERC_DESDE: "cliperc_desde",
      CLI_PERC_HASTA: "cliperc_hasta",

      // Retencion Proveedor
      PROVEEDOR_RETENCION: "ProveedorRetencion",
      PROV_RET_ID: "provret_id",
      PROV_RET_DESDE: "provret_desde",
      PROV_RET_HASTA: "provret_hasta",

      // CuentaCategoria
      CUENTACATEGORIA: "CuentaCategoria",
      CUEC_ID: "cuec_id",
      CUEC_NAME: "cuec_nombre",
      CUEC_CODE: "cuec_codigo",
      CUEC_DESCRIP: "cuec_descrip",
      CUEC_TIPO: "cuec_tipo",

      // Leyenda
      LEYENDA: "Leyenda",
      LEY_ID: "ley_id",
      LEY_NAME: "ley_nombre",
      LEY_CODE: "ley_codigo",
      LEY_DESCRIP: "ley_descrip",
      LEYTEXTO: "ley_texto",

      // CentroCosto
      CENTRO_COSTO: "CentroCosto",
      CCOS_ID: "ccos_id",
      CCOS_NAME: "ccos_nombre",
      CCOS_CODE: "ccos_codigo",
      CCOS_DESCRIP: "ccos_descrip",
      CCOS_COMPRA: "ccos_compra",
      CCOS_VENTA: "ccos_venta",
      CCOS_ID_PADRE: "ccos_id_padre",

      // Cobrador
      COBRADOR: "Cobrador",
      COB_ID: "cob_id",
      COB_NAME: "cob_nombre",
      COB_CODE: "cob_codigo",
      COB_DESCRIP: "cob_descrip",
      COB_COMISION: "cob_comision",

      // ReglaLiquidacion
      REGLALIQUIDACION: "ReglaLiquidacion",
      REL_ID: "rel_id",
      REL_NAME: "rel_nombre",
      REL_CODE: "rel_codigo",
      REL_DESCRIP: "rel_descrip",

      // Clearing
      CLEARING: "Clearing",
      CLE_ID: "cle_id",
      CLE_NAME: "cle_nombre",
      CLE_CODE: "cle_codigo",
      CLE_DESCRIP: "cle_descrip",
      CLE_DIAS: "cle_dias",

      // Cliente
      CLIENTE: "Cliente",
      CLI_ID: "cli_id",
      CLI_NAME: "cli_nombre",
      CLI_CODE: "cli_codigo",
      CLI_DESCRIP: "cli_descrip",
      CLI_CONTACTO: "cli_contacto",
      CLI_RAZONSOCIAL: "cli_razonsocial",
      CLI_CUIT: "cli_cuit",
      CLI_INGRESOSBRUTOS: "cli_ingresosbrutos",
      CLI_CAT_FISCAL: "cli_catfiscal",
      CLI_CHEQUEORDEN: "cli_chequeorden",
      CLI_CODPOSTAL: "cli_codpostal",
      CLI_LOCALIDAD: "cli_localidad",
      CLI_CALLE: "cli_calle",
      CLI_CALLENUMERO: "cli_callenumero",
      CLI_PISO: "cli_piso",
      CLI_DEPTO: "cli_depto",
      CLI_TEL: "cli_tel",
      CLI_FAX: "cli_fax",
      CLI_EMAIL: "cli_email",
      CLI_WEB: "cli_web",
      CLI_YAHOO: "cli_yahoo",
      CLI_MESSENGER: "cli_messanger",
      CLI_CREDITOCTA_CTE: "cli_creditoctacte",
      CLI_CREDITOTOTAL: "cli_creditototal",
      CLI_CREDITOACTIVO: "cli_creditoactivo",
      CLI_EXIGE_TRANSPORTE: "cli_exigeTransporte",
      CLI_EXIGE_PROVINCIA: "cli_exigeProvincia",
      CLI_PCIA_TRANSPORTE: "cli_pciaTransporte",
      CLI_ID_PADRE: "cli_id_padre",
      CLI_NOMBRE_PADRE: "cli_nombrePadre",
      CLI_ES_PROSPECTO: "cli_esprospecto",
      CLI_ID_REFERIDO: "cli_id_referido",
      CLI_HORARIO_MDESDE: "cli_horario_m_desde",
      CLI_HORARIO_MHASTA: "cli_horario_m_hasta",
      CLI_HORARIO_TDESDE: "cli_horario_t_desde",
      CLI_HORARIO_THASTA: "cli_horario_t_hasta",

      US_ACTIVO: "us_activo",
      REFERIDO: "referido",

      // Proveedor
      PROVEEDOR: "Proveedor",
      PROV_ID: "prov_id",
      PROV_NAME: "prov_nombre",
      PROV_DESCRIP: "prov_descrip",
      PROV_CODE: "prov_codigo",
      PROV_CONTACTO: "prov_contacto",
      PROV_RAZONSOCIAL: "prov_razonsocial",
      PROV_CUIT: "prov_cuit",
      PROV_INGRESOSBRUTOS: "prov_ingresosbrutos",
      PROV_CAT_FISCAL: "prov_catfiscal",
      PROV_CHEQUEORDEN: "prov_chequeorden",
      PROV_CODPOSTAL: "prov_codpostal",
      PROV_LOCALIDAD: "prov_localidad",
      PROV_CALLE: "prov_calle",
      PROV_CALLENUMERO: "prov_callenumero",
      PROV_PISO: "prov_piso",
      PROV_DEPTO: "prov_depto",
      PROV_TEL: "prov_tel",
      PROV_FAX: "prov_fax",
      PROV_EMAIL: "prov_email",
      PROV_WEB: "prov_web",
      PROV_IMPRIME_TICKET: "prov_imprimeticket",
      PROV_CREDITOCTA_CTE: "prov_creditoctacte",
      PROV_CREDITOTOTAL: "prov_creditototal",
      PROV_CREDITOACTIVO: "prov_creditoactivo",

      PROV_BANCO: "prov_banco",
      PROV_NRO_CTA_BANCO: "prov_nroctabanco",
      PROV_CBU: "prov_cbu",
      PROV_NRO_CLIENTE: "prov_nrocliente",

      PROV_HORARIO_MDESDE: "prov_horario_m_desde",
      PROV_HORARIO_MHASTA: "prov_horario_m_hasta",
      PROV_HORARIO_TDESDE: "prov_horario_t_desde",
      PROV_HORARIO_THASTA: "prov_horario_t_hasta",

      // Ingresos brutos categoria
      INGRESOS_BRUTOS_CATEGORIA: "IngresosBrutosCategoria",
      IBC_ID: "ibc_id",
      IBC_NAME: "ibc_nombre",
      IBC_CODE: "ibc_codigo",
      IBC_DESCRIP: "ibc_descrip",

      // Rubro
      RUBRO: "Rubro",
      RUB_ID: "rub_id",
      RUB_NAME: "rub_nombre",
      RUB_CODE: "rub_codigo",
      RUB_DESCRIP: "rub_descrip",
      RUB_ES_CRITERIO: "rub_escriterio",

      RUBT_ID_1: "rubt_id1",
      RUBT_ID_2: "rubt_id2",
      RUBT_ID_3: "rubt_id3",
      RUBT_ID_4: "rubt_id4",
      RUBT_ID_5: "rubt_id5",
      RUBT_ID_6: "rubt_id6",
      RUBT_ID_7: "rubt_id7",
      RUBT_ID_8: "rubt_id8",
      RUBT_ID_9: "rubt_id9",
      RUBT_ID_10: "rubt_id10",

      RUBT_NAME_1: "rubt_name1",
      RUBT_NAME_2: "rubt_name2",
      RUBT_NAME_3: "rubt_name3",
      RUBT_NAME_4: "rubt_name4",
      RUBT_NAME_5: "rubt_name5",
      RUBT_NAME_6: "rubt_name6",
      RUBT_NAME_7: "rubt_name7",
      RUBT_NAME_8: "rubt_name8",
      RUBT_NAME_9: "rubt_name9",
      RUBT_NAME_10: "rubt_name10",
      
      RUBTI_ID_1: "rubti_id1",
      RUBTI_ID_2: "rubti_id2",
      RUBTI_ID_3: "rubti_id3",
      RUBTI_ID_4: "rubti_id4",
      RUBTI_ID_5: "rubti_id5",
      RUBTI_ID_6: "rubti_id6",
      RUBTI_ID_7: "rubti_id7",
      RUBTI_ID_8: "rubti_id8",
      RUBTI_ID_9: "rubti_id9",
      RUBTI_ID_10: "rubti_id10",

      RUBTI_NAME_1: "rubti_name1",
      RUBTI_NAME_2: "rubti_name2",
      RUBTI_NAME_3: "rubti_name3",
      RUBTI_NAME_4: "rubti_name4",
      RUBTI_NAME_5: "rubti_name5",
      RUBTI_NAME_6: "rubti_name6",
      RUBTI_NAME_7: "rubti_name7",
      RUBTI_NAME_8: "rubti_name8",
      RUBTI_NAME_9: "rubti_name9",
      RUBTI_NAME_10: "rubti_name10",

      UN_NAME_STOCK: "un_name_stock",
      UN_NAME_COMPRA: "un_name_compra",
      UN_NAME_VENTA: "un_name_venta",

      CUEG_NAME_COMPRA: "cueg_name_compra",
      CUEG_NAME_VENTA: "cueg_name_venta",

      TI_NAME_RI_VENTA: "ti_name_ri_venta",
      TI_NAME_INT_VENTA: "ti_name_int_venta",
      TI_NAME_RI_COMPRA: "ti_name_ri_compra",
      TI_NAME_INT_COMPRA: "ti_name_int_compra",

      CCOS_NAME_COMPRA: "ccos_name_compra",
      CCOS_NAME_VENTA: "ccos_name_venta",

      UN_NAME_PESO: "un_name_peso",

      TI_NAME_COMEX_GANANCIAS: "ti_name_comex_ganancias",
      TI_NAME_COMEX_IGB: "ti_name_comex_igb",
      TI_NAME_COMEX_IVA: "ti_name_comex_iva",

      PR_NAME_WEB_PADRE: "pr_nombre_web_padre",

      // Escala
      ESCALA: "Escala",
      ESC_ID: "esc_id",
      ESC_NAME: "esc_nombre",
      ESC_CODE: "esc_codigo",

      // Transporte
      TRANSPORTE: "Transporte",
      TRANS_ID: "trans_id",
      TRANS_NAME: "trans_nombre",
      TRANS_CODE: "trans_codigo",
      TRANS_DESCRIP: "trans_descrip",
      TRANS_TELEFONO: "trans_telefono",
      TRANS_DIRECCION: "trans_direccion",
      TRANS_MAIL: "trans_mail",
      TRANS_WEB: "trans_web",

      TRANS_HORARIO_MDESDE: "trans_horario_m_desde",
      TRANS_HORARIO_MHASTA: "trans_horario_m_hasta",
      TRANS_HORARIO_TDESDE: "trans_horario_t_desde",
      TRANS_HORARIO_THASTA: "trans_horario_t_hasta",

      // Lista de Precios
      LISTA_PRECIO: "ListaPrecio",
      LP_ID: "lp_id",
      LP_NAME: "lp_nombre",

      // Lista de Precios Items
      LISTA_PRECIO_ITEM: "ListaPrecioItem",
      LPI_ID: "lpi_id",
      LPI_PRECIO: "lpi_precio",
      LPI_PORCENTAJE: "lpi_porcentaje",
      LPI_FECHA: "lpi_fecha",

      // Lista de Descuentos
      LISTA_DESCUENTO: "ListaDescuento",
      LD_ID: "ld_id",
      LD_NAME: "ld_nombre",

      // Lista de Precios Clientes
      LISTA_PRECIOCLIENTE: "ListaPrecioCliente",
      LP_CLI_ID: "lpcli_id",

      LISTA_PRECIOPROVEEDOR: "ListaPrecioProveedor",
      LP_PROV_ID: "lpprov_id",

      // Lista de Descuentos Clientes
      LISTA_DESCUENTOCLIENTE: "ListaDescuentoCliente",
      LD_CLI_ID: "ldcli_id",

      LISTA_DESCUENTOPROVEEDOR: "ListaDescuentoProveedor",
      LD_PROV_ID: "ldprov_id",

      // Catalogo Web
      CATALOGOWEB: "CatalogoWeb",
      CATW_ID: "catw_id",
      CATW_NAME: "catw_nombre",
      CATW_CODE: "catw_codigo",
      CATW_DESCRIP: "catw_descrip",
      CATW_UPDATE_ADDRESS: "catw_updateaddress",
      CATW_UPDATE_USER: "catw_updateuser",
      CATW_UPDATE_PWD: "catw_updatepwd",
      CATW_FTP_ADDRESS: "catw_ftpaddress",
      CATW_FTP_USER: "catw_ftpuser",
      CATW_FTP_PWD: "catw_ftppwd",
      CATW_FOLDER_IMAGE: "catw_folderimage",
      CATW_CSCART: "catw_cscart",

      // Catalogo Web Item
      CATALOGO_WEB_ITEM: "CatalogoWebItem",
      CATWI_ID: "catwi_id",
      CATWI_ACTIVO: "catwi_activo",

      // Catalogo Web Categoria
      CATALOGOWEBCATEGORIA: "CatalogoWebCategoria",
      CATWC_ID: "catwc_id",
      CATWC_NAME: "catwc_nombre",
      CATWC_CODE: "catwc_codigo",
      CATWC_DESCRIP: "catwc_descrip",

      // Catalogo Web Categoria Item
      CATALOGO_WEB_CATEGORIA_ITEM: "CatalogoWebCategoriaItem",
      CATWCI_ID: "catwci_id",
      CATWCI_POSICION: "catwci_posicion",
      CATWCI_ACTIVO: "catwci_activo",

      // Pais
      PAIS: "Pais",
      PA_ID: "pa_id",
      PA_NAME: "pa_nombre",
      PA_CODE: "pa_codigo",
      PA_DESCRIP: "pa_descrip",

      // CircuitoContable
      CIRCUITO_CONTABLE: "CircuitoContable",
      CICO_ID: "cico_id",
      CICO_NAME: "cico_nombre",
      CICO_CODE: "cico_codigo",
      CICO_DESCRIP: "cico_descrip",

      // Calidad
      CALIDAD: "Calidad",
      CALID_ID: "calid_id",
      CALID_NAME: "calid_nombre",
      CALID_CODE: "calid_codigo",
      CALID_DESCRIP: "calid_descrip",

      // ClienteContactoTipo
      CLIENTE_CONTACTO_TIPO: "ClienteContactoTipo",
      CLICT_ID: "clict_id",
      CLICT_NAME: "clict_nombre",
      CLICT_CODE: "clict_codigo",
      CLICT_DESCRIP: "clict_descrip",

      // Marca
      MARCA: "Marca",
      MARC_ID: "marc_id",
      MARC_NAME: "marc_nombre",
      MARC_CODE: "marc_codigo",
      MARC_DESCRIP: "marc_descrip",
      MARC_TEXTO_WEB: "marc_textoweb",

      // Departamento
      DEPARTAMENTO: "Departamento",
      DPTO_ID: "dpto_id",
      DPTO_NAME: "dpto_nombre",
      DPTO_CODE: "dpto_codigo",
      DPTO_DESCRIP: "dpto_descrip",
      DPTO_ID_PADRE: "dpto_id_padre",

      // DepartamentoProveedor
      DEPARTAMENTO_PROVEEDOR: "DepartamentoProveedor",
      DPTO_PROV_ID: "dptoprov_id",

      // ProveedorCentroCosto
      PROVEEDOR_CENTRO_COSTO: "ProveedorCentroCosto",
      PROV_CCOS_ID: "provccos_id",

      // DepartamentoCliente
      DEPARTAMENTO_CLIENTE: "DepartamentoCliente",
      DPTO_CLI_ID: "dptocli_id",

      // Camion
      CAMION: "Camion",
      CAM_ID: "cam_id",
      CAM_CODE: "cam_codigo",
      CAM_DESCRIP: "cam_descrip",
      CAM_PATENTE: "cam_patente",
      CAM_PATENTE_SEMI: "cam_patentesemi",
      CAM_TARA: "cam_tara",
      CAM_ES_SEMI: "cam_essemi",
      CAM_ID_SEMI: "cam_id_semi",
      CAM_CODE_SEMI: "cam_codigo_semi",

      // Chofer
      CHOFER: "Chofer",
      CHOF_ID: "chof_id",
      CHOF_NAME: "chof_nombre",
      CHOF_CODE: "chof_codigo",
      CHOF_DESCRIP: "chof_descrip",
      CHOF_TIPODNI: "chof_tipodni",
      CHOF_DNI: "chof_dni",
      CHOF_FECHA_NACIMIENTO: "chof_fechadenacimiento",
      CHOF_DIRECCION: "chof_direccion",
      CHOF_TELEFONO: "chof_telefono",

      // Ciudad
      CIUDAD: "Ciudad",
      CIU_ID: "ciu_id",
      CIU_NAME: "ciu_nombre",
      CIU_CODE: "ciu_codigo",
      CIU_DESCRIP: "ciu_descrip",

      // Calle
      CALLE: "Calle",
      CALLE_ID: "calle_id",
      CALLE_NAME: "calle_nombre",
      CALLE_CODE: "calle_codigo",
      CALLE_DESCRIP: "calle_descrip",

      // Calle Altura
      CALLEALTURA: "CalleAltura",
      CALLEA_ID: "callea_id",
      CALLEA_DESDE: "callea_desde",
      CALLEA_HASTA: "callea_hasta",

      // Proveedores CAI
      PROVEEDOR_CAI: "ProveedorCAI",
      PROVC_ID: "provc_id",
      PROVC_NUMERO: "provc_numero",
      PROVC_DESCRIP: "provc_descrip",
      PROVC_FECHA_VTO: "provc_fechavto",
      PROVC_SUCURSAL: "provc_sucursal",

      // Condicion Pago
      CONDICION_PAGO: "CondicionPago",
      CPG_ID: "cpg_id",
      CPG_NAME: "cpg_nombre",
      CPG_CODE: "cpg_codigo",
      CPG_DESCRIP: "cpg_descrip",
      CPG_ESCONTADO: "cpg_escontado",
      CPG_ES_LIBRE: "cpg_eslibre",
      CPG_ASIENTO_XVTO: "cpg_asientoXvto",
      CPG_TIPO: "cpg_tipo",

      // Condicion Pago Item
      CONDICION_PAGO_ITEM: "CondicionPagoItem",
      CPGI_ID: "cpgi_id",
      CPGI_DIAS: "cpgi_dias",
      CPGI_PORCENTAJE: "cpgi_porcentaje",

      // Sucursal
      SUCURSAL: "Sucursal",
      SUC_ID: "suc_id",
      SUC_NAME: "suc_nombre",
      SUC_CODE: "suc_codigo",
      SUC_DESCRIP: "suc_descrip",
      SUC_NUMERO: "suc_numero",

      // Contacto
      CONTACTO: "Contacto",
      CONT_ID: "cont_id",
      CONT_NAME: "cont_nombre",
      CONT_CODE: "cont_codigo",
      CONT_DESCRIP: "cont_descrip",
      CONT_TEL: "cont_tel",
      CONT_CELULAR: "cont_celular",
      CONT_EMAIL: "cont_email",
      CONT_CARGO: "cont_cargo",
      CONT_DIRECCION: "cont_direccion",

      // Tabla de Rubros
      RUBRO_TABLA: "RubroTabla",
      RUBT_ID: "rubt_id",
      RUBT_NAME: "rubt_nombre",
      RUBT_CODE: "rubt_codigo",
      RUBT_DESCRIP: "rubt_descrip",

      // Tabla Rubro Item
      RUBRO_TABLA_ITEM: "RubroTablaItem",
      RUBTI_ID: "rubti_id",
      RUBTI_NAME: "rubti_nombre",
      RUBTI_CODE: "rubti_codigo",
      RUBTI_DESCRIP: "rubti_descrip",

      // Gasto
      GASTO: "Gasto",
      GTO_ID: "gto_id",
      GTO_NAME: "gto_nombre",
      GTO_CODE: "gto_codigo",
      GTO_DESCRIP: "gto_descrip",
      GTO_TIPO: "gto_tipo",
      GTO_FIJO: "gto_fijo",
      GTO_MINIMO: "gto_minimo",
      GTO_PORCENTAJE: "gto_porcentaje",
      GTO_IMPORTE: "gto_importe",

      // Documentos
      DOCUMENTO_TIPO: "DocumentoTipo",
      DOCT_ID: "doct_id",
      DOCT_NAME: "doct_nombre",

      // Documentos
      DOCUMENTO: "Documento",
      DOC_ID: "doc_id",
      DOC_NAME: "doc_nombre",
      DOC_TIPO_FACTURA: "doc_tipofactura",
      DOC_MUEVE_STOCK: "doc_muevestock",
      DOC_SIN_PERC: "doc_sin_perc",
      DOC_TIPO_PEDIDO: "doc_tipopedido",

      // fecha Control de Acceso
      FECHA_CONTROL_ACCESO: "FechaControlAcceso",
      FCA_ID: "fca_id",
      FCA_NAME: "fca_nombre",
      FCA_CODE: "fca_codigo",
      FCA_FECHA_HASTA: "fca_Fechahasta",
      FCA_FECHA_DESDE: "fca_Fechadesde",

      // Talonario
      TALONARIO: "Talonario",
      TA_ID: "ta_id",
      TA_NAME: "ta_nombre",

      // PercepcionTipo
      PERCEPCIONTIPO: "PercepcionTipo",
      PERCT_ID: "perct_id",
      PERCT_NAME: "perct_nombre",
      PERCT_CODE: "perct_codigo",
      PERCT_DESCRIP: "perct_descrip",
      PERCT_GENERA_SICORE: "perct_generasicore",
      PERCT_CODIGO_SICORE: "perct_codigosicore",

      // Percepcion
      PERCEPCION: "Percepcion",
      PERC_ID: "perc_id",
      PERC_NAME: "perc_nombre",
      PERC_CODE: "perc_codigo",
      PERC_IMPORTE_MINIMO: "perc_importeminimo",
      PERC_REGIMEN_SICORE: "perc_regimensicore",
      PERC_DESCRIP: "perc_descrip",
      PERC_ES_IIBB: "perc_esiibb",

      // PercepcionItem
      PERCEPCIONITEM: "PercepcionItem",
      PERCI_ID: "perci_id",
      PERCI_IMPORTE_DESDE: "perci_importedesde",
      PERCI_IMPORTE_HASTA: "perci_importehasta",
      PERCI_PORCENTAJE: "perci_porcentaje",
      PERCI_IMPORTEFIJO: "perci_importefijo",

      // RetencionTipo
      RETENCIONTIPO: "RetencionTipo",
      RETT_ID: "rett_id",
      RETT_NAME: "rett_nombre",
      RETT_CODE: "rett_codigo",
      RETT_DESCRIP: "rett_descrip",
      RETT_TIPO: "rett_tipo",
      RETT_GENERA_SICORE: "rett_generasicore",
      RETT_CODIGO_SICORE: "rett_codigosicore",

      // Retencion
      RETENCION: "Retencion",
      RET_ID: "ret_id",
      RET_NAME: "ret_nombre",
      RET_CODE: "ret_codigo",
      RET_IMPORTE_MINIMO: "ret_importeminimo",
      RET_REGIMEN_SICORE: "ret_regimensicore",
      RET_DESCRIP: "ret_descrip",
      RET_ACUMULA_POR: "ret_acumulapor",
      RET_TIPO_MINIMO: "ret_tipominimo",
      RET_ES_IIBB: "ret_esiibb",

      // RetencionItem
      RETENCIONITEM: "RetencionItem",
      RETI_ID: "reti_id",
      RETI_IMPORTE_DESDE: "reti_importedesde",
      RETI_IMPORTE_HASTA: "reti_importehasta",
      RETI_PORCENTAJE: "reti_porcentaje",
      RETI_IMPORTEFIJO: "reti_importefijo",

      RETENCION_INFO: "retencionInfo",

      // Monedas
      MON_ID: "mon_id",
      MON_NAME: "mon_nombre",
      MON_PRECIO: "mon_precio",
      MON_COTIZACION: "mon_precio",

      // Producto
      PRODUCTO: "Producto",
      PR_ID: "pr_id",
      PR_NAME_COMPRA: "pr_nombrecompra",
      PR_NAME_VENTA: "pr_nombreventa",
      PR_CODE: "pr_codigo",
      PR_DESCRIP_VENTA: "pr_descripventa",
      PR_DESCRIP_COMPRA: "pr_descripcompra",
      PR_VENTA_COMPRA: "pr_ventacompra",
      PR_VENTA_STOCK: "pr_ventastock",
      PR_STOCK_COMPRA: "pr_stockcompra",
      PR_LLEVA_STOCK: "pr_llevastock",
      PR_SE_COMPRA: "pr_secompra",
      PR_SE_VENDE: "pr_sevende",
      PR_NO_REDONDEO: "pr_noredondeo",
      PR_ES_KIT: "pr_eskit",
      PR_KIT_STOCK_X_ITEM: "pr_kitStkItem",
      PR_KIT_RESUMIDO: "pr_kitResumido",
      PR_KIT_IDENTIDAD: "pr_kitIdentidad",
      PR_KIT_IDENTIDAD_X_ITEM: "pr_kitIdentidadXItem",
      PR_KIT_LOTE: "pr_kitLote",
      PR_KIT_LOTE_X_ITEM: "pr_kitLoteXItem",
      PR_ES_LISTA: "pr_eslista",
      PR_PORC_INTERNO_C: "pr_porcinternoc",
      PR_PORC_INTERNO_V: "pr_porcinternov",
      PR_X: "pr_x",
      PR_Y: "pr_y",
      PR_Z: "pr_z",
      PR_TIENE_HIJO: "pr_tienehijo",
      PR_ID_PADRE: "pr_id_padre",
      PR_EDITAR_PRECIO_HIJO: "pr_editarpreciohijo",
      PR_PERMITE_EDICION: "pr_permiteedicion",
      PR_BORRADO: "pr_borrado",
      PR_STOCK_MINIMO: "pr_stockminimo",
      PR_STOCK_MAXIMO: "pr_stockmaximo",
      PR_CODIGO_EXTERNO: "pr_Codigoexterno",
      PR_CODIGO_BARRA: "pr_codigobarra",
      PR_CODIGO_BARRA_NAME: "pr_codigobarranombre",
      PR_REPOSICION: "pr_reposicion",
      UN_ID_VENTA: "un_id_venta",
      UN_ID_COMPRA: "un_id_compra",
      UN_ID_STOCK: "un_id_stock",
      TI_ID_RI_VENTA: "ti_id_ivariventa",
      TI_ID_RNI_VENTA: "ti_id_ivarniventa",
      TI_ID_RI_COMPRA: "ti_id_ivaricompra",
      TI_ID_RNI_COMPRA: "ti_id_ivarnicompra",
      TI_ID_INTERNOS_VENTA: "ti_id_internosv",
      TI_ID_INTERNOS_COMPRA: "ti_id_internosc",
      CUEG_ID_COMPRA: "cueg_id_compra",
      CUEG_ID_VENTA: "cueg_id_venta",
      CUE_ID_COMPRA: "cue_id_compra",
      CUE_ID_VENTA: "cue_id_venta",
      PR_PESO_TOTAL: "pr_pesototal",
      PR_PESO_NETO: "pr_pesoneto",
      UN_ID_PESO: "un_id_peso",
      PR_CANT_X_CAJA_EXPO: "pr_cantxcajaexpo",
      PR_LLEVA_NRO_SERIE: "pr_llevanroserie",
      PR_LLEVA_NRO_LOTE: "pr_llevanrolote",
      PR_ES_REPUESTO: "pr_esrepuesto",
      PR_LOTE_FIFO: "pr_lotefifo",
      PR_SE_PRODUCE: "pr_seProduce",
      PR_FLETE_EXPO: "pr_fleteexpo",
      PR_DINERARIO: "pr_dinerario",
      PR_NAME_WEB: "pr_nombreweb",
      PR_NAME_FACTURA: "pr_nombrefactura",
      PR_CODIGO_HTML: "pr_codigohtml",
      PR_CODIGO_HTML_DETALLE: "pr_codigohtmldetalle",
      PR_ALIAS_WEB: "pr_aliasweb",
      PR_ACTIVO_WEB: "pr_activoweb",

      PR_EXPO_WEB: "pr_expoweb",
      PR_EXPO_CAIRO: "pr_expocairo",
      PR_VENTA_WEB_MAXIMA: "pr_ventaWebMaxima",
      PR_WEB_IMAGE_FOLDER: "pr_webimagefolder",
      PR_WEB_IMAGE_UPDATE: "pr_webimageupdate",
      PR_ID_WEB_PADRE: "pr_id_webpadre",

      PRT_EXPO_WEB: "prt_expoweb",
      PRT_EXPO_CAIRO: "prt_expocairo",

      PR_ID_TAG: "pr_id_tag",

      TA_NAME_KIT_SERIE: "ta_name_kit_serie",
      TA_NAME_KIT_LOTE: "ta_name_kit_lote",

      TA_ID_KIT_SERIE: "ta_id_kitSerie",
      TA_ID_KIT_LOTE: "ta_id_kitLote",

      CCOS_ID_COMPRA: "ccos_id_compra",
      CCOS_ID_VENTA: "ccos_id_venta",

      PR_ES_PLANTILLA: "pr_esplantilla",

      RPT_ID_NOMBRE_VENTA: "rpt_id_nombreventa",
      RPT_ID_NOMBRE_COMPRA: "rpt_id_nombrecompra",
      RPT_ID_NOMBRE_FACTURA: "rpt_id_nombrefactura",
      RPT_ID_NOMBRE_WEB: "rpt_id_nombreweb",
      RPT_ID_NOMBRE_IMG: "rpt_id_nombreimg",
      RPT_ID_NOMBRE_IMG_ALT: "rpt_id_nombreimgalt",

      RPT_NAME_COMPRA: "rpt_name_compra",
      RPT_NAME_VENTA: "rpt_name_venta",
      RPT_NAME_FACTURA: "rpt_name_factura",
      RPT_NAME_WEB: "rpt_name_web",
      RPT_NAME_IMG: "rpt_name_img",
      RPT_NAME_IMG_ALT: "rpt_name_img_alt",

      TI_ID_COMEX_GANANCIAS: "ti_id_comex_ganancias",
      TI_ID_COMEX_IGB: "ti_id_comex_igb",
      TI_ID_COMEX_IVA: "ti_id_comex_iva",

      // Producto Tag
      PRODUCTO_TAG: "ProductoTag",
      PRT_ID: "prt_id",
      PRT_TEXTO: "prt_texto",

      // Producto Web Image
      PRODUCTO_WEB_IMAGE: "ProductoWebImage",
      PRWI_ID: "prwi_id",
      PRWI_ARCHIVO: "prwi_archivo",
      PRWI_TIPO: "prwi_tipo",
      PRWI_ALT: "prwi_alt",
      PRWI_POSICION: "prwi_posicion",

      // ListaPrecioMarcado
      LISTA_PRECIO_MARCADO: "ListaPrecioMarcado",
      LPM_ID: "lpm_id",
      LPM_NAME: "lpm_nombre",
      LPM_CODE: "lpm_codigo",
      LPM_DESCRIP: "lpm_descrip",
      LPM_BASE: "lpm_base",
      LPM_PORCENTAJE: "lpm_porcentaje",
      LPM_SALTO: "lpm_salto",
      LPM_DECREMENTO: "lpm_decremento",
      LPM_PORCMINIMO: "lpm_porcminimo",
      LPM_PORCMAXIMO: "lpm_porcmaximo",
      LPM_MONTOMINIMO: "lpm_montominimo",

      // Producto Kit
      PRODUCTO_KIT: "ProductoKit",
      PRK_ID: "prk_id",
      PRK_CANTIDAD: "prk_cantidad",
      PRK_VARIABLE: "prk_variable",
      PR_ID_ITEM: "pr_id_item",

      // Producto Proveedor
      PRODUCTO_PROVEEDOR: "ProductoProveedor",
      PRPROV_ID: "prprov_id",
      PRPROV_FABRICANTE: "prprov_fabricante",
      PRPROV_NAME: "prprov_nombre",
      PRPROV_CODE: "prprov_codigo",
      PRPROV_CODIGO_BARRA: "prprov_codigoBarra",

      UPDATED_PRICES: "UPDATED_PRICES",

      // Producto Cliente
      PRODUCTO_CLIENTE: "ProductoCliente",
      PR_CLI_ID: "prcli_id",
      PR_CLI_NAME: "prcli_nombre",
      PR_CLI_CODE: "prcli_codigo",
      PR_CLI_CODIGO_BARRA: "prcli_codigoBarra",

      // Producto BOM
      PBM_ID: "pbm_id",
      PBM_NAME: "pbm_nombre",
      PBM_CODE: "pbm_codigo",
      PBM_FECHA: "pbm_fecha",

      // Empresa
      EMP_DESCRIP: "emp_descrip",
      EMP_RAZONSOCIAL: "emp_razonsocial",
      EMP_CUIT: "emp_cuit",
      EMP_INGRESOSBRUTOS: "emp_ingresosbrutos",
      EMP_CATFISCAL: "emp_catfiscal",
      EMP_CHEQUEORDEN: "emp_chequeorden",
      EMP_CODPOSTAL: "emp_codpostal",
      EMP_LOCALIDAD: "emp_localidad",
      EMP_CALLE: "emp_calle",
      EMP_CALLENUMERO: "emp_callenumero",
      EMP_PISO: "emp_piso",
      EMP_DEPTO: "emp_depto",
      EMP_TEL: "emp_tel",
      EMP_FAX: "emp_fax",
      EMP_EMAIL: "emp_email",
      EMP_WEB: "emp_web",

      // UsuarioDepartamento
      USUARIODEPARTAMENTO: "UsuarioDepartamento",
      USDPTO_ID: "usdpto_id",

      // Persona
      PERSONA: "Persona",
      PRS_ID: "prs_id",
      PRS_NAME: "prs_nombre",
      PRS_APELLIDO: "prs_apellido",
      PRS_CODE: "prs_codigo",
      PRS_DESCRIP: "prs_descrip",
      PRS_INTERNO: "prs_interno",
      PRS_TEL_TRAB: "prs_telTrab",
      PRS_TEL_CASA: "prs_telCasa",
      PRS_CELULAR: "prs_celular",
      PRS_EMAIL: "prs_email",
      PRS_CARGO: "prs_cargo",
      PRS_FECHA_NAC: "prs_fechaNac",
      PRS_DOCUMENTO: "prs_documento",
      PRS_WEB: "prs_web",
      PRS_CODPOSTAL: "prs_codpostal",
      PRS_LOCALIDAD: "prs_localidad",
      PRS_CALLE: "prs_calle",
      PRS_CALLENUMERO: "prs_callenumero",
      PRS_PISO: "prs_piso",
      PRS_DEPTO: "prs_depto",
      PRS_ES_EMPLEADO: "prs_esempleado",

      // Cliente Informe
      CLI_INF_ID: "cli_inf_id",
      CLI_INF_US_ID: "cli_inf_us_id",
      CLI_INF_ACTIVE: "cli_inf_active",

      CLIENTE_INFORME_ITEM: "ClienteInformeItem",
      CLI_INFI_ID: "cli_infi_id",

      // Empresa Cliente
      EMPRESA_CLIENTE: "EmpresaCliente",
      EMP_CLI_ID: "empcli_id",

      // Empresa Proveedor
      EMPRESA_PROVEEDOR: "EmpresaProveedor",
      EMP_PROV_ID: "empprov_id",

      // Idioma
      IDIOMA: "Idioma",
      IDM_ID: "idm_id",
      IDM_NAME: "idm_nombre",
      IDM_CODE: "idm_codigo",

      // Tipo Operacion
      TIPOOPERACION: "TipoOperacion",
      TO_ID: "to_id",
      TO_NAME: "to_nombre",
      TO_CODE: "to_codigo",
      TO_GENERADEUDA: "to_generadeuda",
      TO_DESCRIP: "to_descrip",

      // Tipo Operacion Cuenta Grupo
      TIPOOPERACIONCUENTAGRUPO: "TipoOperacionCuentaGrupo",
      TO_CUEG_ID: "tocueg_id",

      // Embalaje
      EMBALAJE: "Embalaje",
      EMBL_ID: "embl_id",
      EMBL_NAME: "embl_nombre",
      EMBL_CODE: "embl_codigo",
      EMBL_DESCRIP: "embl_descrip",
      EMBL_CAPACIDAD: "embl_capacidad",
      EMBL_ALTO: "embl_alto",
      EMBL_ANCHO: "embl_ancho",
      EMBL_LARGO: "embl_largo",
      EMBL_TARA: "embl_tara",
      PR_ID_STOCK: "pr_id_stock",

      // Usuario DepositoLogico
      USUARIODEPOSITO_LOGICO: "UsuarioDepositoLogico",
      US_DEPL_ID: "usdepl_id",

      // Expo Grupo Precio
      EGP_ID: "egp_id",
      EGP_NAME: "egp_nombre",

      // Expo Familia
      EFM_ID: "efm_id",
      EFM_NAME: "efm_nombre",

      // Producto Formula Kit
      PRODUCTOFORMULAKIT: "ProductoFormulaKit",
      PRFK_ID: "prfk_id",
      PRFK_NAME: "prfk_nombre",
      PRFK_CODE: "prfk_codigo",
      PRFK_DEFAULT: "prfk_default",
      PRFK_DESCRIP: "prfk_descrip",

      PR_ID_SERIE: "pr_id_serie",
      PR_ID_LOTE: "pr_id_lote",

      // Producto Kit Item Alternativo
      PRODUCTO_KIT_ITEM_A: "ProductoKitItemA",
      PRKA_ID: "prka_id",

      // Feriado
      FERIADO: "Feriado",
      FE_ID: "fe_id",
      FE_NAME: "fe_nombre",
      FE_CODE: "fe_codigo",
      FE_DESCRIP: "fe_descrip",
      FE_DIA: "fe_dia",
      FE_MES: "fe_mes",
      FE_ANIO: "fe_anio",
      FE_BANCO: "fe_banco",
      FE_LABORAL: "fe_laboral",
      FE_LOCAL: "fe_local",
      FE_RECURRENTE: "fe_recurrente",

      // PercepcionCategoriaFiscal
      PERCEPCIONCATEGORIAFISCAL: "PercepcionCategoriaFiscal",
      PERC_CATF_ID: "perccatf_id",
      PERC_CATF_BASE: "perccatf_base",

      // PercepcionProvincia
      PERCEPCIONPROVINCIA: "PercepcionProvincia",
      PERC_PRO_ID: "percpro_id",

      // PercepcionEmpresa
      PERCEPCIONEMPRESA: "PercepcionEmpresa",
      PERC_EMP_ID: "percemp_id",

      // CategoriaFiscal
      CATEGORIAFISCAL: "CategoriaFiscal",
      CATF_ID: "catf_id",
      CATF_NAME: "catf_nombre",

      // RetencionCategoriaFiscal
      RETENCIONCATEGORIAFISCAL: "RetencionCategoriaFiscal",
      RET_CATF_ID: "retcatf_id",
      RET_CATF_BASE: "retcatf_base",

      // RetencionProvincia
      RETENCIONPROVINCIA: "RetencionProvincia",
      RET_PRO_ID: "retpro_id",

      // ProductoDepositoFisico
      PRODUCTO_DEPOSITO_FISICO: "ProductoDepositoFisico",
      PRDEPF_ID: "prdepf_id",
      PRDEPF_X: "prdepf_x",
      PRDEPF_Y: "prdepf_y",
      PRDEPF_Z: "prdepf_z",
      PRDEPF_STOCK_MINIMO: "prdepf_stockMinimo",
      PRDEPF_STOCK_MAXIMO: "prdepf_stockmaximo",
      PRDEPF_REPOSICION: "prdepf_reposicion",

      // ProductoDepositoLogico
      PRODUCTO_DEPOSITO_LOGICO: "ProductoDepositoLogico",
      PRDEPL_ID: "prdepl_id",
      PRDEPL_X: "prdepl_x",
      PRDEPL_Y: "prdepl_y",
      PRDEPL_Z: "prdepl_z",
      PRDEPL_STOCK_MINIMO: "prdepl_stockMinimo",
      PRDEPL_STOCK_MAXIMO: "prdepl_stockmaximo",
      PRDEPL_REPOSICION: "prdepl_reposicion",

      // Caja
      CAJA: "Caja",
      CJ_ID: "cj_id",
      CJ_NAME: "cj_nombre",
      CJ_CODE: "cj_codigo",
      CJ_DESCRIP: "cj_descrip",
      CJ_HOJA_RUTA: "cj_hojaruta",

      // Caja-Cuenta
      CAJACUENTA: "CajaCuenta",
      CJC_ID: "cjc_id",
      CUE_ID_TRABAJO: "cue_id_trabajo",
      CUE_ID_FONDOS: "cue_id_fondos",

      // Caja-Cajero
      CAJACAJERO: "CajaCajero",
      CJCJ_ID: "cjcj_id",

      // AjusteInflacion
      AJUSTEINFLACION: "AjusteInflacion",
      AJE_ID: "aje_id",
      AJE_NAME: "aje_nombre",
      AJE_CODE: "aje_codigo",
      AJE_DESCRIP: "aje_descrip",
      AJE_METODO: "aje_metodo",
      AJE_AGRUPACCOS: "aje_agrupaccos",
      AJE_INCLUIRSINCCOS: "aje_incluirsinccos",
      CUE_ID_PATRIMONIAL: "cue_id_patrimonial",
      CUE_ID_RESULTADOS: "cue_id_resultados",

      // AjusteInflacionItem
      AJUSTEINFLACIONITEM: "AjusteInflacionItem",
      AJI_ID: "aji_id",

      // AjusteInflacionItem
      AJUSTEINFLACIONITEMTIPO: "AjusteInflacionItemTipo",
      AJIT_ID: "ajit_id",
      AJIT_NAME: "ajit_nombre",

      // AjusteInflacionIndice
      AJUSTEINFLACIONINDICE: "AjusteInflacionIndice",
      AJII_ID: "ajii_id",
      AJII_FECHA: "ajii_fecha",
      AJII_INDICE: "ajii_indice",

      // ProductoHelpConfig
      PRODUCTO_HELP_CONFIG: "ProductoHelpConfig",
      PRHC_ID: "prhc_id",
      PRHC_NAME: "prhc_nombre",
      PRHC_TECLA: "prhc_tecla",
      PRHC_ATRIBUTO_INDICE: "prhc_atributo_indice",
      PRHC_VALOR_CODE: "prhc_valor_codigo",
      PRHC_DESCRIP: "prhc_descrip",
      PRHC_DEFAULT: "prhc_default",
      PRHC_DEFAULT_SRV: "prhc_defaultsrv",
      PRHC_DEFAULT_PRP: "prhc_defaultprp",
      PRHC_DEFAULT_PRNS: "prhc_defaultprns",

      // ListaPrecioConfig
      LISTA_PRECIOCONFIG: "ListaPrecioConfig",
      LPC_ID: "lpc_id",
      LPC_ORDEN: "lpc_orden",

      // Proyecto
      PROY_ID: "proy_id",
      PROY_NAME: "proy_nombre",

      // PersonaDocumentoTipo
      PERSONADOCUMENTOTIPO: "PersonaDocumentoTipo",
      PRSDT_ID: "prsdt_id",
      PRSDT_NAME: "prsdt_nombre",
      PRSDT_CODE: "prsdt_codigo",
      PRSDT_DESCRIP: "prsdt_descrip",

      // Curso
      CUR_ID: "cur_id",
      CUR_NAME: "cur_nombre",

      // Codigos Postales
      CPA_ID: "cpa_id",
      CPA_CODE: "cpa_codigo",

      // PosicionArancel
      POSICION_ARANCEL: "PosicionArancel",
      POAR_ID: "poar_id",
      POAR_NAME: "poar_nombre",
      POAR_CODE: "poar_codigo",
      POAR_DESCRIP: "poar_descrip",
      TI_ID_ESTADISTICA: "ti_id_estadistica",
      TI_ID_DERECHOS: "ti_id_derechos",

      // Producto Comunidad Internet
      PRODUCTO_COMUNIDAD_INTERNET: "ProductoComunidadInternet",
      PRCMI_ID: "prcmi_id",
      PRCMI_CODE: "prcmi_codigo",
      PRCMI_DESCRIP: "prcmi_descrip",
      PRCMI_FECHA_ALTA: "prcmi_fechaalta",
      PRCMI_FECHA_VTO: "prcmi_fechavto",
      PRCMI_PRECIO: "prcmi_precio",

      // Comunidad Internet
      COMUNIDADINTERNET: "ComunidadInternet",
      CMI_ID: "cmi_id",
      CMI_NAME: "cmi_nombre",
      CMI_CODE: "cmi_codigo",

      // Producto Leyenda
      PRODUCTO_LEYENDA: "ProductoLeyenda",
      PRL_ID: "prl_id",
      PRL_NAME: "prl_nombre",
      PRL_TEXTO: "prl_texto",
      PRL_TAG: "prl_tag",
      PRL_ORDEN: "prl_orden",

      // Tarifario
      TARIFARIO: "Tarifario",
      TF_ID: "tf_id",
      TF_NAME: "tf_nombre",
      TF_CODE: "tf_codigo",
      TF_DESCRIP: "tf_descrip",

      // Tarifario Altura
      TARIFARIOALTURA: "TarifarioAltura",
      TFA_ID: "tfa_id",
      TFA_DESDE: "tfa_desde",
      TFA_HASTA: "tfa_hasta",

      // Tarifario Calle
      TARIFARIOCALLE: "TarifarioCalle",
      TF_CALLE_ID: "tfcalle_id",

      // Tarifario Paralela
      TARIFARIOPARALELA: "TarifarioParalela",
      TFP_ID: "tfp_id",
      TFP_ALTURA_BASE: "tfp_alturabase",
      TFP_ALTURA_DESDE: "tfp_alturadesde",

      // FormaPago
      FORMAPAGO: "FormaPago",
      FP_ID: "fp_id",
      FP_NAME: "fp_nombre",
      FP_CODE: "fp_codigo",
      FP_DESCRIP: "fp_descrip",

      FP_LUNES: "fp_lunes",
      FP_MARTES: "fp_martes",
      FP_MIERCOLES: "fp_miercoles",
      FP_JUEVES: "fp_jueves",
      FP_VIERNES: "fp_viernes",
      FP_SABADO: "fp_sabado",
      FP_DOMINGO: "fp_domingo",

      // VentaModo
      VENTAMODO: "VentaModo",
      VM_ID: "vm_id",
      VM_NAME: "vm_nombre",
      VM_CODE: "vm_codigo",
      VM_DESCRIP: "vm_descrip",
      VM_CTA_CTE: "vm_ctacte",
      VM_OS: "vm_os",
      VM_PV: "vm_pv",
      VM_CMVXI: "vm_cmvxi",
      VM_COBZ: "vm_cobz",

      // Tabla Item
      TABLA_ITEM: "TablaItem",
      TBLI_ID: "tbli_id",
      TBLI_NAME: "tbli_nombre",
      TBLI_NOMBRE_FISICO: "tbli_nombrefisico",
      TBLI_TIPO: "tbli_tipo",
      TBLI_SUB_TIPO: "tbli_subtipo",
      TBLI_ORDEN: "tbli_orden",
      TBLI_HELP_TYPE: "tbli_helptype",
      TBLI_FILTRO: "tbli_filtro",
      TBLI_DEFAULT_VALUE: "tbli_defaultvalue",
      TBLI_MIN_VALUE: "tbli_minvalue",
      TBLI_MAX_VALUE: "tbli_maxvalue",
      TBLI_TEXT_ALIGN: "tbli_textalign",
      TBLI_TEXT_MASK: "tbli_textmask",
      TBLI_FORMAT: "tbli_format",
      TBLI_NO_SHOW_BUTTON: "tbli_noshowbutton",
      TBLI_SQLSTMT: "tbli_sqlstmt",
      TBL_ID_HELP: "tbl_id_help",

      // Tabla
      TABLA: "Tabla",
      TBL_ID: "tbl_id",
      TBL_NAME: "tbl_nombre",
      TBL_NOMBRE_FISICO: "tbl_nombrefisico",
      TBL_CAMPO_NAME: "tbl_camponombre",
      TBL_CAMPO_ID: "tbl_campoid",

      // Producto Numero Serie
      PRODUCTO_NUMERO_SERIE: "ProductoNumeroSerie",
      PRNS_ID: "prns_id",
      PRNS_CODE: "prns_codigo",
      PRNS_DESCRIP: "prns_descrip",
      PRNS_FECHA_VTO: "prns_fechavto",

      // Legajo
      LEGAJO: "legajo",
      LGJ_ID: "lgj_id",
      LGJ_TITLE: "lgj_titulo",
      LGJ_CODE: "lgj_codigo",

      // Settings
      CONFIG_KEY: "cfg_aspecto",
      CONFIG_VALUE: "cfg_valor",
      CONFIG_FILTER: "cfg_filter",

      // Accounting
      filterForSales: "ti_tipo: 1",
      filterForPurchase: "ti_tipo: 2",

      //
      // use when translate to english
      //
      /*
      AccountGroupType: {
        productForSale: 1,
        productForPurchase: 2,
        creditor: 3,
        debtor: 4,
        directDebit: 5,
        pettyCashFund: 6
      },
      */

      CuentaGrupoTipo: {
        productoVenta: 1,
        productoCompra: 2,
        acreedor: 3,
        deudor: 4,
        debitoAutomatico: 5,
        fondoFijo: 6
      },

      ProductoWebImageType: {
        webImageThumbnail: 1,
        webImageMedium: 2,
        webImageBig: 3
      },

      CategoriaFiscal: {
        inscripto: 1,
        exento: 2,
        noInscripto: 3,
        consumidorFinal: 4,
        extranjero: 5,
        monotributo: 6,
        extranjeroIva: 7,
        noResponsable: 8,
        noResponsableExento: 9,
        noCategorizado: 10,
        inscriptoM: 11
      },

      DepositosInternos: {
        deplIdInterno: -2,
        deplIdTercero: -3
      },

      ClaveFiscalTipo: {
        cuit: 1,
        rut: 2
      },

      CuentaCategoria: {
        docEnCartera: 1,
        bancos: 2,
        patrimoniales: 3,
        deudPorVentas: 4,
        bienesDeUso: 5,
        bienesDeCambio: 6,
        cuentasFiscales: 7,
        acreedores: 8,
        ingresos: 9,
        egresos: 10,
        costoMercVend: 12,
        otros: 13,
        caja: 14,
        IVABinesDeUso: 15,
        IVALocaciones: 16,
        IVAServicios: 17,
        IVABienes: 18,
        depositoCupones: 19
      },

      CondicionPagoTipo: {
        fechaDocumento: -2,
        general: 1,
        debitoAuto: 2,
        fondoFijo: 3
      },

      VentaModoCtaCte: {
        hojaRuta: 1,
        mostrador: 2,
        ctacteMostradorFactura: 3
      }

    }

  };

  Cairo.Security.Actions.General = {

    LIST_USUARIO: 10,
    NEW_USUARIO: 11,
    EDIT_USUARIO: 12,
    DELETE_USUARIO: 13,

    NEW_DEPOSITO_LOGICO: 1016,
    EDIT_DEPOSITO_LOGICO: 1017,
    DELETE_DEPOSITO_LOGICO: 1018,
    LIST_DEPOSITO_LOGICO: 1019,

    NEW_UNIDAD: 1020,
    EDIT_UNIDAD: 1021,
    DELETE_UNIDAD: 1022,
    LIST_UNIDAD: 1023,

    NEW_SUCURSALCLIENTE: 1024,
    EDIT_SUCURSALCLIENTE: 1025,
    DELETE_SUCURSALCLIENTE: 1026,
    LIST_SUCURSALCLIENTE: 1027,

    NEW_BANCO: 1032,
    EDIT_BANCO: 1033,
    DELETE_BANCO: 1034,
    LIST_BANCO: 1035,

    NEW_VENDEDORES: 1036,
    EDIT_VENDEDORES: 1037,
    DELETE_VENDEDORES: 1038,
    LIST_VENDEDORES: 1039,

    NEW_TARJETACREDITO: 1040,
    EDIT_TARJETACREDITO: 1041,
    DELETE_TARJETACREDITO: 1042,
    LIST_TARJETACREDITO: 1043,

    NEW_CUENTA: 1044,
    EDIT_CUENTA: 1045,
    DELETE_CUENTA: 1046,
    LIST_CUENTA: 1047,

    NEW_LEYENDA: 1048,
    EDIT_LEYENDA: 1049,
    DELETE_LEYENDA: 1050,
    LIST_LEYENDA: 1051,

    NEW_CENTRO_COSTO: 1052,
    EDIT_CENTRO_COSTO: 1053,
    DELETE_CENTRO_COSTO: 1054,
    LIST_CENTRO_COSTO: 1055,

    NEW_COBRADOR: 1056,
    EDIT_COBRADOR: 1057,
    DELETE_COBRADOR: 1058,
    LIST_COBRADOR: 1059,

    NEW_REGLALIQUIDACION: 1060,
    EDIT_REGLALIQUIDACION: 1061,
    DELETE_REGLALIQUIDACION: 1062,
    LIST_REGLALIQUIDACION: 1063,

    NEW_CLEARING: 1064,
    EDIT_CLEARING: 1065,
    DELETE_CLEARING: 1066,
    LIST_CLEARING: 1067,

    NEW_CLIENTE: 1068,
    EDIT_CLIENTE: 1069,
    DELETE_CLIENTE: 1070,
    LIST_CLIENTE: 1071,

    NEW_PROVEEDOR: 1072,
    EDIT_PROVEEDOR: 1073,
    DELETE_PROVEEDOR: 1074,
    LIST_PROVEEDOR: 1075,

    NEW_PRODUCTO: 1076,
    EDIT_PRODUCTO: 1077,
    DELETE_PRODUCTO: 1078,
    LIST_PRODUCTO: 1079,

    NEW_RUBRO: 1080,
    EDIT_RUBRO: 1081,
    DELETE_RUBRO: 1082,
    LIST_RUBRO: 1083,

    NEW_ESCALA: 1084,
    EDIT_ESCALA: 1085,
    DELETE_ESCALA: 1086,
    LIST_ESCALA: 1087,

    NEW_TRANSPORTE: 1088,
    EDIT_TRANSPORTE: 1089,
    DELETE_TRANSPORTE: 1090,
    LIST_TRANSPORTE: 1091,

    NEW_PAIS: 1104,
    EDIT_PAIS: 1105,
    DELETE_PAIS: 1106,
    LIST_PAIS: 1107,

    NEW_CIUDAD: 1108,
    EDIT_CIUDAD: 1109,
    DELETE_CIUDAD: 1110,
    LIST_CIUDAD: 1111,

    NEW_PROVINCIA: 1112,
    EDIT_PROVINCIA: 1113,
    DELETE_PROVINCIA: 1114,
    LIST_PROVINCIA: 1115,

    NEW_ZONA: 1116,
    EDIT_ZONA: 1117,
    DELETE_ZONA: 1118,
    LIST_ZONA: 1119,

    NEW_TASA_IMPOSITIVA: 1120,
    EDIT_TASA_IMPOSITIVA: 1121,
    DELETE_TASA_IMPOSITIVA: 1122,
    LIST_TASA_IMPOSITIVA: 1123,

    NEW_DEPOSITO_FISICO: 1124,
    EDIT_DEPOSITO_FISICO: 1125,
    DELETE_DEPOSITO_FISICO: 1126,
    LIST_DEPOSITO_FISICO: 1127,

    NEW_CALIDAD: 1132,
    EDIT_CALIDAD: 1133,
    DELETE_CALIDAD: 1134,
    LIST_CALIDAD: 1135,

    NEW_MARCA: 1136,
    EDIT_MARCA: 1137,
    DELETE_MARCA: 1138,
    LIST_MARCA: 1139,

    NEW_CAMION: 1140,
    EDIT_CAMION: 1141,
    DELETE_CAMION: 1142,
    LIST_CAMION: 1143,

    NEW_CHOFER: 1144,
    EDIT_CHOFER: 1145,
    DELETE_CHOFER: 1146,
    LIST_CHOFER: 1147,

    NEW_CONDICION_PAGO: 1148,
    EDIT_CONDICION_PAGO: 1149,
    DELETE_CONDICION_PAGO: 1150,
    LIST_CONDICION_PAGO: 1151,

    NEW_SUCURSAL: 1157,
    EDIT_SUCURSAL: 1158,
    DELETE_SUCURSAL: 1159,
    LIST_SUCURSAL: 1160,

    NEW_RUBRO_TABLA: 1161,
    EDIT_RUBRO_TABLA: 1162,
    DELETE_RUBRO_TABLA: 1163,
    LIST_RUBRO_TABLA: 1164,

    NEW_GASTO: 1165,
    EDIT_GASTO: 1166,
    DELETE_GASTO: 1167,
    LIST_GASTO: 1168,

    NEW_CUENTAGRUPO: 1169,
    EDIT_CUENTAGRUPO: 1170,
    DELETE_CUENTAGRUPO: 1171,
    LIST_CUENTAGRUPO: 1172,

    NEW_PERCEPCION: 1176,
    DELETE_PERCEPCION: 1178,
    EDIT_PERCEPCION: 1179,
    LIST_PERCEPCION: 1180,

    NEW_PERCEPCIONTIPO: 1181,
    DELETE_PERCEPCIONTIPO: 1182,
    EDIT_PERCEPCIONTIPO: 1183,
    LIST_PERCEPCIONTIPO: 1184,

    NEW_RETENCION: 1185,
    DELETE_RETENCION: 1186,
    EDIT_RETENCION: 1187,
    LIST_RETENCION: 1188,

    NEW_RETENCIONTIPO: 1189,
    DELETE_RETENCIONTIPO: 1190,
    EDIT_RETENCIONTIPO: 1191,
    LIST_RETENCIONTIPO: 1192,

    NEW_DEPARTAMENTO: 1193,
    DELETE_DEPARTAMENTO: 1194,
    EDIT_DEPARTAMENTO: 1195,
    LIST_DEPARTAMENTO: 1196,

    NEW_CIRCUITO_CONTABLE: 1197,
    EDIT_CIRCUITO_CONTABLE: 1198,
    DELETE_CIRCUITO_CONTABLE: 1199,
    LIST_CIRCUITO_CONTABLE: 1200,

    NEW_EMPRESA: 1201,
    EDIT_EMPRESA: 1202,
    DELETE_EMPRESA: 1203,
    LIST_EMPRESA: 1204,

    NEW_PERSONA: 1205,
    EDIT_PERSONA: 1206,
    DELETE_PERSONA: 1207,
    LIST_PERSONA: 1208,

    NEW_WEBARTICULO: 1209,
    EDIT_WEBARTICULO: 1210,
    DELETE_WEBARTICULO: 1211,
    LIST_WEBARTICULO: 1212,

    NEW_IDIOMA: 1213,
    EDIT_IDIOMA: 1214,
    DELETE_IDIOMA: 1215,
    LIST_IDIOMA: 1216,

    NEW_TIPOOPERACION: 1218,
    EDIT_TIPOOPERACION: 1219,
    DELETE_TIPOOPERACION: 1220,
    LIST_TIPOOPERACION: 1221,

    NEW_EMBALAJE: 1222,
    EDIT_EMBALAJE: 1223,
    DELETE_EMBALAJE: 1224,
    LIST_EMBALAJE: 1225,

    NEW_PRODUCTOFKIT: 1226,
    EDIT_PRODUCTOFKIT: 1227,
    DELETE_PRODUCTOFKIT: 1228,
    LIST_PRODUCTOFKIT: 1229,

    LIST_INDICECORP: 1230,

    NEW_FERIADO: 1235,
    EDIT_FERIADO: 1236,
    DELETE_FERIADO: 1237,
    LIST_FERIADO: 1238,

    NEW_CAJA: 1239,
    EDIT_CAJA: 1240,
    DELETE_CAJA: 1241,
    LIST_CAJA: 1242,

    NEW_LISTA_PRECIO_MARCADO: 1243,
    EDIT_LISTA_PRECIO_MARCADO: 1244,
    DELETE_LISTA_PRECIO_MARCADO: 1245,
    LIST_LISTA_PRECIO_MARCADO: 1246,

    NEW_CATALOGOWEB: 1247,
    EDIT_CATALOGOWEB: 1248,
    DELETE_CATALOGOWEB: 1249,
    LIST_CATALOGOWEB: 1250,

    NEW_AJUSTEINFLACION: 1251,
    EDIT_AJUSTEINFLACION: 1252,
    DELETE_AJUSTEINFLACION: 1253,
    LIST_AJUSTEINFLACION: 1254,

    EDIT_AJUSTEINFLACIONINDICE: 1255,

    NEW_PRODUCTO_HELP_CONFIG: 1256,
    EDIT_PRODUCTO_HELP_CONFIG: 1257,
    DELETE_PRODUCTO_HELP_CONFIG: 1258,
    LIST_PRODUCTO_HELP_CONFIG: 1259,

    NEW_CALLE: 1260,
    EDIT_CALLE: 1261,
    DELETE_CALLE: 1262,
    LIST_CALLE: 1263,

    NEW_CATALOGOWEBCATEGORIA: 1264,
    EDIT_CATALOGOWEBCATEGORIA: 1265,
    DELETE_CATALOGOWEBCATEGORIA: 1266,
    LIST_CATALOGOWEBCATEGORIA: 1267,

    NEW_CLIENTE_CONTACTO_TIPO: 1268,
    EDIT_CLIENTE_CONTACTO_TIPO: 1269,
    DELETE_CLIENTE_CONTACTO_TIPO: 1270,
    LIST_CLIENTE_CONTACTO_TIPO: 1271,

    NEW_PERSONADOCUMENTOTIPO: 1272,
    EDIT_PERSONADOCUMENTOTIPO: 1273,
    DELETE_PERSONADOCUMENTOTIPO: 1274,
    LIST_PERSONADOCUMENTOTIPO: 1275,

    NEW_POSICION_ARANCEL: 1276,
    EDIT_POSICION_ARANCEL: 1277,
    DELETE_POSICION_ARANCEL: 1278,
    LIST_POSICION_ARANCEL: 1279,

    NEW_TARIFARIO: 1280,
    EDIT_TARIFARIO: 1281,
    DELETE_TARIFARIO: 1282,
    LIST_TARIFARIO: 1283,

    NEW_FORMAPAGO: 1284,
    EDIT_FORMAPAGO: 1285,
    DELETE_FORMAPAGO: 1286,
    LIST_FORMAPAGO: 1287,

    NEW_VENTAMODO: 1288,
    EDIT_VENTAMODO: 1289,
    DELETE_VENTAMODO: 1290,
    LIST_VENTAMODO: 1291,

    NEW_MONEDA: 1028,
    EDIT_MONEDA: 1029,
    DELETE_MONEDA: 1030,
    LIST_MONEDA: 1031,

    NEW_CHEQUERA: 1128,
    EDIT_CHEQUERA: 1129,
    DELETE_CHEQUERA: 1130,
    LIST_CHEQUERA: 1131,

    NEW_LISTA_PRECIO: 1096,
    EDIT_LISTA_PRECIO: 1097,
    DELETE_LISTA_PRECIO: 1098,
    LIST_LISTA_PRECIO: 1099,

    NEW_LISTA_DESCUENTO: 1152,
    EDIT_LISTA_DESCUENTO: 1153,
    DELETE_LISTA_DESCUENTO: 1154,
    LIST_LISTA_DESCUENTO: 1155,

    MODIFY_CONFIG: 1156,

    MODIFY_CONFIG_VENTAS: 1173,
    MODIFY_CONFIG_TESORERIA: 1174,
    MODIFY_CONFIG_COMPRAS: 1175,
    MODIFY_CONFIG_TICKET: 1979,
    MODIFY_CONFIG_USUARIO: 1990,
    MODIFY_CONFIG_STOCK: 1999,
    MODIFY_CONFIG_CONTABILIDAD: 1988,
    MODIFY_CONFIG_PERSONAL: 1985,

    EDIT_PRODUCTO_NRO_SERIE: 1217,

    VENTA_SALDO_INICIAL: 1998,
    COMPRA_SALDO_INICIAL: 1997,

    VENTA_FACTURA_ANULAR: 1996,
    VENTA_IMPORT_REMITO: 1995,

    NEW_STOCK_LOTE: 1994,
    EDIT_STOCK_LOTE: 1993,
    DELETE_STOCK_LOTE: 1992,
    LIST_STOCK_LOTE: 1991,

    SELECT_SERIE_EX: 1989,

    CONT_IMPORT_PERC_RET_IIBB: 1987,

    IMPORTAR_ASIENTOS: 1986,

    LIST_APRECIOCONFIG: 1984,
    LIST_APRECIOCALC: 1983,

    CONT_IMPORT_PADRON_EMBARGO: 1982,
    VENTA_IMPORT_OS: 1981,

    NEW_DOCUMENTO: 4000,
    EDIT_DOCUMENTO: 4001,
    DELETE_DOCUMENTO: 4002,
    LIST_DOCUMENTO: 4003,

    NEW_FECHA_CONTROL_ACCESO: 4004,
    EDIT_FECHA_CONTROL_ACCESO: 4005,
    DELETE_FECHA_CONTROL_ACCESO: 4006,
    LIST_FECHA_CONTROL_ACCESO: 4007,

    NEW_TALONARIO: 4008,
    EDIT_TALONARIO: 4009,
    DELETE_TALONARIO: 4010,
    LIST_TALONARIO: 4011,

    LOAD_DOCUMENTS: 4012,

    EDIT_DOCUMENTO_IMPRESORA: 4013,

    NEW_DOCUMENTO_GRUPO: 4014,
    EDIT_DOCUMENTO_GRUPO: 4015,
    DELETE_DOCUMENTO_GRUPO: 4016,
    LIST_DOCUMENTO_GRUPO: 4017
  }                                                                    
                                                                        
}());