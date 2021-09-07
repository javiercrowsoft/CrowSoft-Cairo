(function() {
  "use strict";

  var createApplication = function() {

    var self = {
      name: "Cairo"
    };

    var that = {};

    that.getName = function() {
      return self.name;
    };

    return that;
  };

  Cairo.Application = createApplication();

  Cairo.isFunction = function(object) {
    return !!(object && object.constructor && object.call && object.apply);
  };

  Cairo.isPresent = function(value) {
    return value !== null && value !== undefined;
  }

  Cairo.execLater = function(f, milliseconds) {
    milliseconds = milliseconds || 500;
    setTimeout(function() { f(); }, milliseconds);
  };

  Cairo.addRegions({
    headerRegion: "#header-region",
    mainRegion: "#main-region",
    loadingRegion: "#loading-region",

    dialogRegion: Marionette.Region.Dialog.extend({
      el: "#dialog-region",
      onCloseDialog: function() {
        if(this.handler) {
          this.handler.closeDialog();
          this.handler = null;
        }
      }
    }),

    dialogLoadingRegion: Marionette.Region.Dialog.extend({
      el: "#dialog-loading-region",
      onCloseDialog: function() {
        if(this.handler) {
          this.handler.closeDialog();
          this.handler = null;
        }
      },
      dialogSettings: {
        dialogClass: "no-close"
      }
    }),

    dialogSelectTreeRegion: Marionette.Region.Dialog.extend({
      el: "#dialog-select-tree-region",
      onCloseDialog: function() {
        if(this.handler) {
          this.handler.closeDialog();
          this.handler = null;
        }
      }
    })
  });

  Cairo.navigate = function(route, options) {
    options = options || {};
    Backbone.history.navigate(route, options);
  };

  Cairo.getCurrentRoute = function() {
    return Backbone.history.fragment;
  };

  Cairo.on("initialize:after", function() {
    if(Backbone.history) {
      Backbone.history.start();

      if(this.getCurrentRoute() === "") {
        Cairo.trigger("desktop:show");
      }
    }
  });

  Cairo.Tables = {

      AFIP_ARCHIVO: 6002,
      AFIP_ESQUEMA: 6001,
      AFIP_PARAMETRO: 6003,
      AFIP_REGISTRO: 6004,
      ADUANA: 22001,
      AGENDA: 2010,
      AGENDA_TELEFONICA_W_PRIME: -2010,
      ALARMAS_POR_MAIL: 30001,
      ALSA: 11000,
      ALUMNOS: 37004,
      APERTURA_Y_CIERRE_DE_CAJA: 16006,
      APLICACION_DE_INTERNET: 39002,
      ARBOLES_DE_CUENTAS: 999,
      ARBOLES_DE_PRODUCTOS: 998,
      ASEGURADORAS_ART: 35006,
      ASIENTOS_CONTABLES: 19001,
      AULAS: 37002,
      BOM: 13002,
      BANCO: 13,
      BARCOS: 12004,
      CDROM: 5001,
      CAJA: 1033,
      CALCULO_DE_DESPACHO_DE_IMP: 17002,
      CALIBRADORA: 12002,
      CALIDAD: 1003,
      CALLES: 1039,
      CAMIONES: 1004,
      CAMIONES_SEMI: 1032,
      CATALOGOS_WEB: 1035,
      CATEGORIA_CONTABLE: 19,
      CATEGORIA_DE_CATALOGOS_WEB: 1040,
      CATEGORIAS_FISCALES: 1031,
      CATEGORIAS_SINDICALES: 35003,
      CATEGORIAS_DE_INGRESOS_BRUTOS: 26,
      CENTRO_DE_COSTO_PRIME: -21,
      CENTROS_DE_COSTO: 21,
      CHEQUE: 18001,
      CHEQUE_ENTREGADOS_O_DEPOSITADOS: 18010,
      CHEQUE_ENTREGADOS_O_DEPOSITADOS_2: 18003,
      CHEQUERA: 22,
      CHOFER: 1001,
      CIRCUITO_CONTABLE: 1016,
      CIUDAD: 40,
      CLEARING: 23,
      CLIENTE: 28,
      CLIENTE_W_PRIME: -28,
      COBRADOR: 25,
      COBRANZAS: 18004,
      CODIGOS_POSTALES: 1043,
      CODIGOS_DE_LIQUIDACION_DE_HABERES: 35013,
      COLMENA: 11003,
      COMUNIDAD_DE_INTERNET: 39001,
      CONCILIACION_BANCARIA: 18011,
      CONDICIONES_DE_PAGO: 1005,
      CONFIGURACION_DE_LA_CALIBRADORA: 12001,
      CONFIGURACION_DEL_HELP_DE_ARTICULOS: 1038,
      CONTACTO: 2001,
      CONTRA_MARCA: 12006,
      CONVENIOS_SINDICALES: 35002,
      CUENTA: 17,
      CUENTAS_CONTABLES_PRIME: -2017,
      CUENTAS_DE_CORREO: 39006,
      CUENTAS_DE_DOCUMENTOS_EN_CARTERA_PRIME: -1017,
      CUOTAS_DE_TARJETA_DE_CREDITO: 1022,
      CUPON_DE_TARJETA: 18002,
      CURSOS: 37005,
      DEPARTAMENTO: 1015,
      DEPARTAMENTO_W_PRIME: -1015,
      DEPOSITO_FISICO: 10,
      DEPOSITO_LOGICO: 11,
      DEPOSITOS_BANCARIOS: 18007,
      DEPOSITOS_DE_CUPONES: 18008,
      DETALLE_DE_EQUIPO: 28006,
      DICCIONARIO_DE_DATOS: 42,
      DOCUMENTO: 4001,
      EJERCICIOS_CONTABLES: 19002,
      EMBALAJE: 1023,
      EMBARQUE: 22002,
      EMPLEADOS: 35005,
      EMPRESA: 1018,
      ENCUESTA: 1028,
      ESCALA: 33,
      ESPECIES: 12003,
      ESQUEMAS_DE_AJUSTE_POR_INFLACION: 1036,
      ESTADO_CIVIL: 35007,
      ESTADO_DE_TAREA: 2004,
      ESTADOS: 4005,
      FACTURAS_DE_COMPRA: 17001,
      FACTURAS_DE_VENTA: 16001,
      FALLA_DE_EQUIPO: 28005,
      FAMILIA_DE_EXPORTACION: 22501,
      FECHAS_DE_CONTROL_DE_ACCESO: 4002,
      FERIADO: 1030,
      FORMA_DE_PAGO: 1046,
      FORMULAS_DE_KIT: 1027,
      FORMULAS_DE_LIQUIDACION: 35009,
      GARANTIA: 22003,
      GRUPO_DE_CUENTA: 18,
      GRUPOS_DE_DOCUMENTOS: 4006,
      GRUPOS_DE_PRECIOS_DE_EXPORTACION: 22502,
      HOJA_DE_RUTA: 16005,
      HORA: 2006,
      IDIOMA: 1020,
      IMPORTACION: 21001,
      IMPORTACIONES_TEMPORALES: 22007,
      INFORMES: 7001,
      INFORMES_PARA_REPORTES_PRIME: -7001,
      INGRESOS_BRUTOS_CATEGORIA: 26,
      ITEMS_DE_TABLAS_DE_RUBROS: 1009,
      ITEMS_DE_TEXTO: 39004,
      LEGAJOS: 15001,
      LENGUAJE: 14000,
      LEYENDA: 20,
      LIQUIDACION_DE_HABERES: 35012,
      LISTAS_DE_DESPACHO: 16007,
      LISTAS_DE_DESCUENTOS: 1006,
      LISTAS_DE_PRECIOS: 27,
      LOTES_DE_STOCK: 1026,
      MAIL: 28009,
      MANIFIESTOS_DE_CARGA: 22006,
      MAQUINA: 13001,
      MARCA: 1002,
      MATERIAS: 37001,
      MODOS_VENTA: 1047,
      MONEDA: 12,
      MOVIMIENTOS_DE_FONDO: 18006,
      NIVEL_DE_ESTUDIOS: 37007,
      NOTICIAS_DE_LA_WEB: 25000,
      NUMEROS_DE_SERIE: 1017,
      OBJETIVO: 2009,
      ORDENES_DE_COMPRA: 17004,
      ORDENES_DE_PAGO: 18005,
      ORDENES_DE_SERVICIO: 28008,
      PACKING_LIST: 22005,
      PAIS: 39,
      PARTE_DIARIO: 15002,
      PARTES_DE_PRODUCCION_DE_KIT: 20003,
      PARTES_DE_REPARACION: 28007,
      PASOS_DE_REPARACION: 28001,
      PEDIDOS_DE_COMPRA: 17005,
      PEDIDOS_DE_VENTA: 16003,
      PERCEPCION: 1012,
      PERMISO: 4,
      PERMISOS_DE_EMBARQUE: 22004,
      PERSONA: 1019,
      PLANTILLAS_DE_LIQUIDACION: 35008,
      PLANTILLAS_DE_RESPUESTA: 39000,
      POSICION_ARANCELARIA: 1044,
      PRESTACION: 1,
      PRESUPUESTO_DE_VENTA: 16004,
      PRESUPUESTOS_DE_ENVIO: 15009,
      PRIORIDAD: 2003,
      PROCESOS: -7002,
      PROCESOS_DE_IMPORTACION: 23002,
      PRODUCTO: 30,
      PRODUCTO_KIT: 10000000,
      PRODUCTOS_DE_COMPRA: 32,
      PRODUCTOS_DE_STOCK: 44,
      PRODUCTOS_DE_VENTA: 31,
      PROFESIONES: 37008,
      PROFESIONES_ESPECILADADES: 35004,
      PROFESORES: 37003,
      PROVEEDOR: 29,
      PROVEEDOR_W_PRIME: -29,
      PROVINCIA: 6,
      PROYECTO: 2005,
      PUERTOS: 12005,
      RECUENTOS_DE_STOCK: 20002,
      REGLA_LIQUIDACION: 24,
      REINA: 11002,
      RELACION_FAMILIAR: 35014,
      REMITOS_DE_COMPRA: 17003,
      REMITOS_DE_VENTA: 16002,
      RESOLUCION_DE_CUPONES: 18009,
      RETENCION_TIPO: 1013,
      RETENCION: 1014,
      ROL: 2,
      RUBRO_PRIME: -5,
      RUBROS: 5,
      SINDICATOS: 35001,
      SUB_PROYECTO: 2008,
      SUCURSAL: 1007,
      SUCURSALES_DE_CLIENTES: 14,
      SYSMODULO: 41,
      SYSMODULOTCP: 43,
      TABLA_DE_MARCADO_DE_PRECIOS: 1034,
      TABLAS_DE_RUBROS: 1008,
      TALONARIOS: 4004,
      TAREA: 2007,
      TARIFA: 15004,
      TARIFA_ITEM: 15007,
      TARIFARIOS: 1045,
      TARJETA_DE_CREDITO: 16,
      TASA_IMPOSITIVA: 9,
      TEXTOS: 39003,
      TIPO_DE_APERTURA: 28002,
      TIPO_DE_INCIDENTE: 28003,
      TIPO_DE_INSUMO: 13003,
      TIPO_DE_OPERACION: 1021,
      TIPO_DE_PASO_DE_REPARACION: 28004,
      TIPOS_DE_AJUSTE_POR_INFLACION: 1037,
      TIPOS_DE_ASISTENCIA: 35011,
      TIPOS_DE_COBRANZA_EN_HOJA_DE_RUTA: 16008,
      TIPOS_DE_CONTACTO: 1041,
      TIPOS_DE_CODIGO_DE_LIQUIDACION: 35015,
      TIPOS_DE_DOCUMENTO: 1042,
      TIPOS_DE_PARTE_DIARIO: 15008,
      TIPOS_DE_PERCEPCION: 1011,
      TIPOS_DE_RETENCION: 1013,
      TIPOS_DE_DOCUMENTOS: 4003,
      TIPOS_DE_LEGAJO: 15005,
      TIPOS_DE_TRANSPORTE: 15003,
      TODOS_LOS_ARBOLES_MENOS_CUENTAS: 997,
      TRANSFERENCIAS_DE_STOCK: 20001,
      TRANSFERENCIAS_DE_STOCK_A_CLIENTE: 20005,
      TRANSFERENCIAS_DE_STOCK_A_PROVEEDOR: 20004,
      TRANSPORTE: 34,
      UNIDAD: 7,
      USUARIO_PRIME: -3,
      USUARIO: 3,
      VENDEDOR: 15,
      VISTAS: 996,
      VUELOS: 15006,
      ZONA: 8

  };

  var NO_DATE = new Date("1900-01-01T00:00:00Z");

  Cairo.Constants = {
    NO_ID: 0,
    NEW_ID: 0,
    UPDATE_ID: -100,  // it is used to force backbone to send a put instead of a post
    NO_DATE: NO_DATE,
    NUMBER_ID: "_number_id_",
    STATUS_ID: "_status_id_",

    HIDE_COLUMNS: "HideCols",

    DELETE_FUNCTION: "delete",
    EDIT_FUNCTION: "edit",
    VALIDATE_ROW_FUNCTION: "validateRow",
    IS_EMPTY_ROW_FUNCTION: "isEmptyRow",

    SHOW_DOCUMENTS_FUNCTION: "showDocDigital",
    CLIENT_SAVE_FUNCTION: "save",
    GET_CODE_FROM_ID: "'(@@get_code_from_id@@)'",
    ACTIVE: "activo",

    // TODO: must be set from Language - translation of c_Wiz_Key
    COPY_OF: "copy of ",
    ACTIVE_LABEL: "Active",
    NAME_LABEL: "Name",
    CODE_LABEL: "Code",
    DESCRIPTION_LABEL: "Description",
    MUST_SET_A_NAME: "You must provide a name",
    MUST_SET_A_CODE: "You must provide a code",
    GENERAL: "General",
    TAB_GENERAL: "General",

    SELECT_ALL_TEXT: "Select All",
    UN_SELECT_ALL_TEXT: "Unselect All",
    SELECT_ALL2_TEXT: "Select All",
    UN_SELECT_ALL2_TEXT: "Unselect All",

    NEXT_TEXT: "Next",
    BACK_TEXT: "Back",
    FINISH_TEXT: "Finish",
    CLOSE_WIZARD_TEXT: "Close this assistant",
    CANCEL_TEXT: "Cancel",

    NEW_DOC_DESCRIP: "This document has been saved, You can create a new one or close this assistant.",
    NEW_DOC_TEXT: "Create a new document",
    PRINT_DOC_TEXT: "Print document [%1]",

    NEW_DOC_CLASS: "new-doc-button",
    PRINT_DOC_CLASS: "print-doc-button",
    CLOSE_WIZARD_CLASS: "close-wizard-button",

    APPLY_PRICE_TEXT: "Apply prices to all items",
    APPLY_PRICE_ZERO_TEXT: "Apply prices only to items in zero"
  };

  Cairo.Constants.Types = {
    integer:    2,
    double:     5,
    currency:   6,
    text:       200,
    id:         -1,
    taxId:      -100,
    boolean:    -200,
    single:     -300,
    variant:    -400,
    long:       -500,
    date:       -600,
    dateOrNull: -700
  };

  Cairo.Constants.ShellSortOrder = {
    none: 0,
    ascending: 1,
    descending: 2
  };

  Cairo.Constants.DocumentSections = {
    header: 'Header',
    items: 'Items',
    footer: 'Footer'
  };

  Cairo.Constants.WizardSteps = {
    WELCOME: 100,
    SELECT_PROVEEDOR: 300,
    SELECT_PEDIDO: 400,
    SELECT_ORDEN_REMITO: 450,
    SELECT_ITEMS: 600,
    DATOS_GENERALES: 700,
    PERCEPCIONES: 800,

    SELECT_CLIENTE: 900,
    SELECT_FACTURA: 1000,
    ANTICIPO: 1100,
    DIF_CAMBIO: 1200,
    SELECT_COBROS: 1300,
    SELECT_PAGOS: 1300
  };

  Cairo.Constants.WizardConstants = {
    KW_CANCEL: -10,
    KW_PRINT_DOC: -20,
    KW_NEW_DOC: -21,
    KW_CLOSE_WIZARD: -22,
    KW_ACTION_BUTTON_DOC: -23,
    KW_ACTION_BUTTON_DOC_AUTO: -24,
    KW_ACTION_BUTTON_DOC_CANCEL_AUTO: -25,

    KW_DOC_ID: 320,
    KW_PROV_ID: 340,
    KW_CPG_ID: 360,

    KW_REMITOS: 1010,
    KW_TODOS: 1110,

    KW_ITEMS: 1120,
    KW_TODOS_ITEMS: 1130,

    KW_PERCEPCIONES: 1150,
    KW_TOTAPERCEPCIONES: 160,

    KW_FACTURAS: 10,
    KW_COTIZACION: 20,
    KW_AGRUPADOS: 30,
    KW_VENCIDOS: 40,
    KW_CUE_ID_DIF_CAMBIO: 50,
    KW_DOC_ID_NC_DIF_CAMBIO: 60,
    KW_DOC_ID_ND_DIF_CAMBIO: 70,
    KW_PR_ID_DIF_CAMBIO: 80,
    KW_DEFALUT_DIF_CAMBIO: 90,
    KW_MODO_IVA_DIF_CAMBIO: 100,
    KW_APLICACION_DIF_CAMBIO: 101,
    KW_CHEQUES: 120,
    KW_CHEQUEST: 125,
    KW_CTA_CTE: 130,
    KW_EFECTIVO: 140,
    KW_OTROS: 150,
    KW_TARJETAS: 160,
    KW_ANTICIPO: 170,
    KW_IMPORTE_OTROS: 180,
    KW_IMPORTE_TOTAL: 190,
    KW_IMPORTE_NETO: 200,
    KW_IMPORTE_INDICADO: 210,
    KW_CLIENTE2: 220,
    KW_PROVEEDOR2: 220,
    KW_FECHA: 230,
    KW_FECHA_NDNC: 235,
    KW_SUCURSAL: 240,
    KW_DESCRIP: 250,
    KW_COMPROBANTE: 260,
    KW_COBRADOR: 270,
    KW_LEGAJO: 280,
    KW_CENTRO_COSTO: 290,

    KW_CUENTA_ANTICIPO: 300,
    KW_MONEDA_ANTICIPO: 310,
    KW_COTIZACION_ANTICIPO: 320,
    KW_IMPORTE_ANTICIPO: 330
  };
  
  Cairo.Constants.WizardKeys = {

    CENTRO_COSTO: "CENTRO DE COSTO",
    CLIENTE: "CLIENT",
    CLIENTE2: "CLIENTE",
    CONDICION_PAGO: "CONDICION DE PAGO",
    COMPROBANTE: "COMPROBANTE",
    COTIZACION: "COTIZACION",
    COTIZACION_PROV: "COTIZACION_PROV",

    DESCRIP: "D",
    DEPOSITO: "DEP",
    DESC1: "DESC. 1",
    DESC2: "DESC. 2",
    DOC: "DOC",

    FECHA: "FECHA",
    FECHA_IVA: "FECHA_IVA",
    FECHA_VTO: "FECHA_VTO",

    ITEMS: "ITEMS",

    LEGAJO: "LEGAJO",
    LISTA_PRECIO: "LP",
    LISTA_PRECIO2: "LISTA DE PRECIO",
    LISTA_DESCUENTO: "LISTA DE DESCUENTO",

    MAIN_TITLE: "WIZ_MAIN_TITLE",

    PRINT_DOC: "WIZ_PRINTDOC",
    CLOSE_WIZARD: "WIZ_CLOSE",
    NEW_DOC: "WIZ_NEWDOC",
    ACTION_BUTTON: "WIZ_BUTTON_ACTION",
    ACTION_BUTTON_AUTO: "WIZ_BUTTON_ACTION_AUTO",
    ACTION_CANCEL_AUTO: "WIZ_BUTTON_CANCEL_AUTO",

    OBSERVACIONES: "OBSERVACIONES",
    ORDENES: "ORDENES",
    ONLY_SELECTED: "ONLYSEL", // edit from listdoc

    PROVEEDOR: "PROV",
    PROVEEDOR2: "PROVEEDOR",
    PEDIDOS: "PEDIDOS",
    PERCEPCIONES: "PERCEP",
    PENDIENTE: "PENDIENTE",

    REMITOS: "REMITOS",
    RESULTTITLE: "RESULTT",
    RESULT: "RESULT",
    READYTOSTART: "RDTS",
    RV_COMPROBANTE: "REMITO",

    SUCURSAL: "SUCURSAL",

    TIPO_COMPROBANTE: "TIPOCOMP",
    TITLE: "T",
    TODOS: "TODOS",
    TODOS_ITEMS: "TODOS-ITEMS",
    TOTAL: "TOTAL",
    TOTAL_ITEMS: "TOTALITEMS",
    TOTAL_PERCEPCIONES: "TOTALPERCEP",

    USUARIO: "US",

    VENCIDOS: "VENCIDOS",
    AGRUPADOS: "AGRUPADOS",
    FACTUAS: "FACTURAS",
    COTIZACION2: "COTIZACION2",
    TOTAL_PAGO: "TOTAL-PAGO",
    TOTAL_PAGO_ORIGEN: "TOTAL-PAGO-ORIGEN",
    ANTICIPO: "ANTICIPO",
    IMPORTE: "IMPORTE",
    MONEDA: "MONEDA",

    MONEDA_ANTICIPO: "ANT-MONEDA",
    CUENTA_ANTICIPO: "ANT-CUENTA",
    COTIZACION_ANTICIPO: "ANT-COTIZACION",
    ANTICIPO_IMPORTE: "ANT-IMPORTE",

    COBRO_OTROS: "COBRO-OTROS",
    COBRO_TOTAL: "COBRO-TOTAL",
    COBRO_NETO: "COBRO-NETO",
    COBRO_INDICADO: "COBRO-INDICADO",

    PAGO_OTROS: "PAGO-OTROS",
    PAGO_TOTAL: "PAGO-TOTAL",
    PAGO_NETO: "PAGO-NETO",
    PAGO_INDICADO: "PAGO-INDICADO",

    CHEQUES: "CHEQUES",
    CHEQUES_TERCERO: "CHEQUES_TERCERO",
    COPY_CHEQUES: "COPY_CHEQUES",
    OTROS: "OTROS",
    CTA_CTE: "CTA_CTE",
    EFECTIVO: "EFVO",
    TARJETAS: "TARJETA",

    CUE_ID_DIF_CAMBIO: "Cuenta contable",
    NC_DIF_CAMBIO: "Nota de credito",
    ND_DIF_CAMBIO: "Nota de debito",
    DEFAULT_DIF_CAMBIO: "Utilizar",
    MODO_IVA_DIF_CAMBIO: "Tratamiento del Iva",
    PR_ID_DIF_CAMBIO: "Articulo",
    FECHA_ND_NC: "FechaNDNC",
    APLICACION_ND: "AplicND",

    COBRADOR: "Cobrador"
  };

  //
  // util
  //
  var val = function(value) {
    try {
      if(value === true) {
        return -1;
      }
      else {
        if(typeof value === "string") {
          value = parseFloat(Cairo.accounting.unformat(value));
        }
        else {
          value = parseFloat(value);
        }
        return isNaN(value) ? 0 : value;
      }
    }
    catch(ignore) {
      return 0;
    }
  };

  var isNumeric = function(value) {
    try {
      value = parseFloat(value);
      return isNaN(value) ? false : true;
    }
    catch(ignore) {
      return false;
    }
  };

  var getKey = function(key) {
    if(isNumeric(key)) {
      return "k" + key.toString();
    }
    else {
      return key;
    }
  };

  var escapeRegExp =function(string) {
    return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
  };

  var replaceAll = function(string, find, replace) {
    return string.replace(new RegExp(escapeRegExp(find), 'g'), replace);
  };


  var getLocaleDateString = function() {

    var formats = {
      "ar-sa" : "dd/MM/yy",
      "bg-bg" : "dd.M.yyyy",
      "ca-es" : "DD/MM/YYYY",
      "zh-tw" : "yyyy/M/d",
      "cs-cz" : "d.M.yyyy",
      "da-dk" : "dd-MM-yyyy",
      "de-de" : "dd.MM.yyyy",
      "el-gr" : "d/M/yyyy",
      "en-us" : "M/d/yyyy",
      "fi-fi" : "d.M.yyyy",
      "fr-fr" : "DD/MM/YYYY",
      "he-il" : "DD/MM/YYYY",
      "hu-hu" : "yyyy. MM. dd.",
      "is-is" : "d.M.yyyy",
      "it-it" : "DD/MM/YYYY",
      "ja-jp" : "yyyy/MM/dd",
      "ko-kr" : "yyyy-MM-dd",
      "nl-nl" : "d-M-yyyy",
      "nb-no" : "dd.MM.yyyy",
      "pl-pl" : "yyyy-MM-dd",
      "pt-br" : "d/M/yyyy",
      "ro-ro" : "dd.MM.yyyy",
      "ru-ru" : "dd.MM.yyyy",
      "hr-hr" : "d.M.yyyy",
      "sk-sk" : "d. M. yyyy",
      "sq-al" : "yyyy-MM-dd",
      "sv-se" : "yyyy-MM-dd",
      "th-th" : "d/M/yyyy",
      "tr-tr" : "dd.MM.yyyy",
      "ur-pk" : "DD/MM/YYYY",
      "id-id" : "DD/MM/YYYY",
      "uk-ua" : "dd.MM.yyyy",
      "be-by" : "dd.MM.yyyy",
      "sl-si" : "d.M.yyyy",
      "et-ee" : "d.MM.yyyy",
      "lv-lv" : "yyyy.MM.dd.",
      "lt-lt" : "yyyy.MM.dd",
      "fa-ir" : "MM/dd/yyyy",
      "vi-vn" : "DD/MM/YYYY",
      "hy-am" : "dd.MM.yyyy",
      "az-latn-az" : "dd.MM.yyyy",
      "eu-es" : "yyyy/MM/dd",
      "mk-mk" : "dd.MM.yyyy",
      "af-za" : "yyyy/MM/dd",
      "ka-ge" : "dd.MM.yyyy",
      "fo-fo" : "dd-MM-yyyy",
      "hi-in" : "dd-MM-yyyy",
      "ms-my" : "DD/MM/YYYY",
      "kk-kz" : "dd.MM.yyyy",
      "ky-kg" : "dd.MM.yy",
      "sw-ke" : "M/d/yyyy",
      "uz-latn-uz" : "dd/MM yyyy",
      "tt-ru" : "dd.MM.yyyy",
      "pa-in" : "dd-MM-yy",
      "gu-in" : "dd-MM-yy",
      "ta-in" : "dd-MM-yyyy",
      "te-in" : "dd-MM-yy",
      "kn-in" : "dd-MM-yy",
      "mr-in" : "dd-MM-yyyy",
      "sa-in" : "dd-MM-yyyy",
      "mn-mn" : "yy.MM.dd",
      "gl-es" : "dd/MM/yy",
      "kok-in" : "dd-MM-yyyy",
      "syr-sy" : "DD/MM/YYYY",
      "dv-mv" : "dd/MM/yy",
      "ar-iq" : "DD/MM/YYYY",
      "zh-cn" : "yyyy/M/d",
      "de-ch" : "dd.MM.yyyy",
      "en-gb" : "DD/MM/YYYY",
      "es-mx" : "DD/MM/YYYY",
      "fr-be" : "d/MM/yyyy",
      "it-ch" : "dd.MM.yyyy",
      "nl-be" : "d/MM/yyyy",
      "nn-no" : "dd.MM.yyyy",
      "pt-pt" : "dd-MM-yyyy",
      "sr-latn-cs" : "d.M.yyyy",
      "sv-fi" : "d.M.yyyy",
      "az-cyrl-az" : "dd.MM.yyyy",
      "ms-bn" : "DD/MM/YYYY",
      "uz-cyrl-uz" : "dd.MM.yyyy",
      "ar-eg" : "DD/MM/YYYY",
      "zh-hk" : "d/M/yyyy",
      "de-at" : "dd.MM.yyyy",
      "en-au" : "d/MM/yyyy",
      "es-es" : "DD/MM/YYYY",
      "fr-ca" : "yyyy-MM-dd",
      "sr-cyrl-cs" : "d.M.yyyy",
      "ar-ly" : "DD/MM/YYYY",
      "zh-sg" : "d/M/yyyy",
      "de-lu" : "dd.MM.yyyy",
      "en-ca" : "DD/MM/YYYY",
      "es-gt" : "DD/MM/YYYY",
      "fr-ch" : "dd.MM.yyyy",
      "ar-dz" : "dd-MM-yyyy",
      "zh-mo" : "d/M/yyyy",
      "de-li" : "dd.MM.yyyy",
      "en-nz" : "d/MM/yyyy",
      "es-cr" : "DD/MM/YYYY",
      "fr-lu" : "DD/MM/YYYY",
      "ar-ma" : "dd-MM-yyyy",
      "en-ie" : "DD/MM/YYYY",
      "es-pa" : "MM/dd/yyyy",
      "fr-mc" : "DD/MM/YYYY",
      "ar-tn" : "dd-MM-yyyy",
      "en-za" : "yyyy/MM/dd",
      "es-do" : "DD/MM/YYYY",
      "ar-om" : "DD/MM/YYYY",
      "en-jm" : "DD/MM/YYYY",
      "es-ve" : "DD/MM/YYYY",
      "ar-ye" : "DD/MM/YYYY",
      "en-029" : "MM/dd/yyyy",
      "es-co" : "DD/MM/YYYY",
      "ar-sy" : "DD/MM/YYYY",
      "en-bz" : "DD/MM/YYYY",
      "es-pe" : "DD/MM/YYYY",
      "ar-jo" : "DD/MM/YYYY",
      "en-tt" : "DD/MM/YYYY",
      "es-ar" : "DD/MM/YYYY",
      "ar-lb" : "DD/MM/YYYY",
      "en-zw" : "M/d/yyyy",
      "es-ec" : "DD/MM/YYYY",
      "ar-kw" : "DD/MM/YYYY",
      "en-ph" : "M/d/yyyy",
      "es-cl" : "dd-MM-yyyy",
      "ar-ae" : "DD/MM/YYYY",
      "es-uy" : "DD/MM/YYYY",
      "ar-bh" : "DD/MM/YYYY",
      "es-py" : "DD/MM/YYYY",
      "ar-qa" : "DD/MM/YYYY",
      "es-bo" : "DD/MM/YYYY",
      "es-sv" : "DD/MM/YYYY",
      "es-hn" : "DD/MM/YYYY",
      "es-ni" : "DD/MM/YYYY",
      "es-pr" : "DD/MM/YYYY",
      "am-et" : "d/M/yyyy",
      "tzm-latn-dz" : "dd-MM-yyyy",
      "iu-latn-ca" : "d/MM/yyyy",
      "sma-no" : "dd.MM.yyyy",
      "mn-mong-cn" : "yyyy/M/d",
      "gd-gb" : "DD/MM/YYYY",
      "en-my" : "d/M/yyyy",
      "prs-af" : "dd/MM/yy",
      "bn-bd" : "dd-MM-yy",
      "wo-sn" : "DD/MM/YYYY",
      "rw-rw" : "M/d/yyyy",
      "qut-gt" : "DD/MM/YYYY",
      "sah-ru" : "MM.dd.yyyy",
      "gsw-fr" : "DD/MM/YYYY",
      "co-fr" : "DD/MM/YYYY",
      "oc-fr" : "DD/MM/YYYY",
      "mi-nz" : "DD/MM/YYYY",
      "ga-ie" : "DD/MM/YYYY",
      "se-se" : "yyyy-MM-dd",
      "br-fr" : "DD/MM/YYYY",
      "smn-fi" : "d.M.yyyy",
      "moh-ca" : "M/d/yyyy",
      "arn-cl" : "dd-MM-yyyy",
      "ii-cn" : "yyyy/M/d",
      "dsb-de" : "d. M. yyyy",
      "ig-ng" : "d/M/yyyy",
      "kl-gl" : "dd-MM-yyyy",
      "lb-lu" : "DD/MM/YYYY",
      "ba-ru" : "dd.MM.yy",
      "nso-za" : "yyyy/MM/dd",
      "quz-bo" : "DD/MM/YYYY",
      "yo-ng" : "d/M/yyyy",
      "ha-latn-ng" : "d/M/yyyy",
      "fil-ph" : "M/d/yyyy",
      "ps-af" : "dd/MM/yy",
      "fy-nl" : "d-M-yyyy",
      "ne-np" : "M/d/yyyy",
      "se-no" : "dd.MM.yyyy",
      "iu-cans-ca" : "d/M/yyyy",
      "sr-latn-rs" : "d.M.yyyy",
      "si-lk" : "yyyy-MM-dd",
      "sr-cyrl-rs" : "d.M.yyyy",
      "lo-la" : "DD/MM/YYYY",
      "km-kh" : "yyyy-MM-dd",
      "cy-gb" : "DD/MM/YYYY",
      "bo-cn" : "yyyy/M/d",
      "sms-fi" : "d.M.yyyy",
      "as-in" : "dd-MM-yyyy",
      "ml-in" : "dd-MM-yy",
      "en-in" : "dd-MM-yyyy",
      "or-in" : "dd-MM-yy",
      "bn-in" : "dd-MM-yy",
      "tk-tm" : "dd.MM.yy",
      "bs-latn-ba" : "d.M.yyyy",
      "mt-mt" : "DD/MM/YYYY",
      "sr-cyrl-me" : "d.M.yyyy",
      "se-fi" : "d.M.yyyy",
      "zu-za" : "yyyy/MM/dd",
      "xh-za" : "yyyy/MM/dd",
      "tn-za" : "yyyy/MM/dd",
      "hsb-de" : "d. M. yyyy",
      "bs-cyrl-ba" : "d.M.yyyy",
      "tg-cyrl-tj" : "dd.MM.yy",
      "sr-latn-ba" : "d.M.yyyy",
      "smj-no" : "dd.MM.yyyy",
      "rm-ch" : "DD/MM/YYYY",
      "smj-se" : "yyyy-MM-dd",
      "quz-ec" : "DD/MM/YYYY",
      "quz-pe" : "DD/MM/YYYY",
      "hr-ba" : "d.M.yyyy.",
      "sr-latnme" : "d.M.yyyy",
      "sma-se" : "yyyy-MM-dd",
      "en-sg" : "d/M/yyyy",
      "ug-cn" : "yyyy-M-d",
      "sr-cyrl-ba" : "d.M.yyyy",
      "es-us" : "M/d/yyyy"
    };

    return formats[navigator.language.toLowerCase()] || 'DD/MM/YYYY';
  };

  var localeLongDateFormat = getLocaleDateString();

  var parseDate = function(maybeDate) {
    if(typeof maybeDate === "string") {
      return moment(maybeDate, localeLongDateFormat.toUpperCase()).toDate();
    }
    else {
      return new Date(maybeDate);
    }
  };

  /*
  *
  * some times simple things get very complicated
  * so for some reason I can't understand this:
  * new Date("2") => Thu Feb 01 2001 00:00:00 GMT-0300 (ART)     // WAT
  * new Date("2-1") => Thu Feb 01 2001 00:00:00 GMT-0300 (ART)   // WAT
  * new Date("12-1") => Sat Dec 01 2001 00:00:00 GMT-0300 (ART)  // hooo, now I understand. I was confused because
  *                                                                 I live in Argentina. Obviously that has to be the
  *                                                                 reason. I am a dd/mm/yy person :D
  *                                                                 BUTTTTT wait ... WHY 2001 !!! I am not in 2001
  *                                                                 it is 2015 (at least when I was writing this)
  * Okay I will make my own function :(
  *
  * */

  var isDate = function(date) {
    try {
      if(typeof date === "string") {
        return (! isNaN(parseDate(date).valueOf()));
      }
      else {
        return (! isNaN((new Date(date)).valueOf()));
      }
    }
    catch(ignore) {
      return false;
    }
  };

  //
  // date formats are YMD - DMY - MDY
  //

  var getLocaleMonthIndex = function() {
    // month starts in zero
    var d = new Date(2012,11 /* December */,31,0,0,0,0);
    return d.toLocaleDateString(navigator.language).split("/")[1] === "12" ? 1 /* ?M? */ : 0 /* M?? */;
  };
  var localeMonthIndex = getLocaleMonthIndex();

  var getLocaleYearIndex = function() {
    var d = new Date(2012,11 /* December */,31,0,0,0,0);
    var arrayDate = d.toLocaleDateString(navigator.language).split("/");
    return (arrayDate[0] === "2012")
              ? /* YMD */ 0
              : (arrayDate[2] === "2012")
                  ? /* DMY or MDY */ 2 : /* WAT ?Y? */ 1;
  };
  var localeYearIndex = getLocaleYearIndex();

  var DATE_FORMAT = localeMonthIndex === 0 ? "mm/dd/yy" : localeYearIndex === 0 ? "yy/mm/dd" : "dd/mm/yy";

  var leapYear = function(year) {
    return ((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0);
  };

  var newDate = function (year, month, day) {
    var d;
    switch (localeYearIndex) {
      case 0: /* YMD */
        d = year.toString() + "/" + month.toString() + "/" + day.toString();
        break;

      case 2: /* ??Y */
        if (localeMonthIndex === 0) {
          d = month.toString() + "/" + day.toString() + "/" + year.toString();
        } else {
          d = day.toString() + "/" + month.toString() + "/" + year.toString();
        }
        break;

      default:
        d = "";
        break;
    }
    return d;
  };

  var validateStringDate = function(maybeDate) {

    if(typeof maybeDate === "string" && maybeDate.length > 8 && maybeDate.slice(-1) === 'Z') {

      maybeDate = new Date(maybeDate)

    } else if(typeof maybeDate === "string" && "-+".indexOf(maybeDate.trim().charAt(0)) > -1) {

      var days = val(maybeDate);
      var date = new Date();
      maybeDate = new Date(date.setDate(date.getDate() + days));

    } else {

      maybeDate = replaceAll(maybeDate, ".", "-");

      if (maybeDate.length === 4 && maybeDate.indexOf('-') < 0 && maybeDate.indexOf('/') < 0 && /^[0-9]+$/.test(maybeDate)) {
        maybeDate = maybeDate.substr(0, 2) + "/" + maybeDate.substr(2, 2);
      } else if (maybeDate.length === 6 && maybeDate.indexOf('-') < 0 && maybeDate.indexOf('/') < 0 && /^[0-9]+$/.test(maybeDate)) {
        maybeDate = maybeDate.substr(0, 2) + "/" + maybeDate.substr(2, 2) + "/" + maybeDate.substr(4, 2);
      } else if (maybeDate.length === 8 && maybeDate.indexOf('-') < 0 && maybeDate.indexOf('/') < 0 && /^[0-9]+$/.test(maybeDate)) {
        maybeDate = maybeDate.substr(0, 2) + "/" + maybeDate.substr(2, 2) + "/" + maybeDate.substr(4, 4);
      }

      //
      // regular expressions are to smart for me
      //
      if (maybeDate.indexOf('-') > -1 || maybeDate.indexOf('/') > -1) {
        maybeDate = replaceAll(maybeDate, "-", "/");
        maybeDate = maybeDate.split("/");
        if (maybeDate.length < 2) {
          maybeDate = "";
        } else if (maybeDate.length < 3) {
          if (maybeDate[0].length > 2) {
            maybeDate = newDate(val(maybeDate[0]), val(maybeDate[1]), 1);
          } else if (maybeDate[1].length > 2) {
            maybeDate = newDate(val(maybeDate[1]), val(maybeDate[0]), 1);
          } else {
            var m = localeMonthIndex === 0 ? 0 : 1;
            var d = m === 0 ? 1 : 0;
            var month = val(maybeDate[m]);
            var day = val(maybeDate[d]);
            if (isNaN(month) || isNaN(day)) {
              return "";
            } else if (month > 12) {
              maybeDate = newDate((new Date()).getFullYear(), day, month /* month is day */);
            } else {
              maybeDate = newDate((new Date()).getFullYear(), month, day);
            }
          }
        } else if (maybeDate.length > 3) {
          maybeDate = "";
        } else {
          var year = 0;
          var yearIndex = -1;
          if (maybeDate[0].length > 2) {
            year = maybeDate[0];
            yearIndex = 0;
          } else if (maybeDate[1].length > 2) {
            year = maybeDate[1];
            yearIndex = 1;
          } else if (maybeDate[2].length > 2) {
            year = maybeDate[2];
            yearIndex = 2;
          } else {
            year = maybeDate[localeYearIndex];
          }
          var pos = localeMonthIndex;
          var month = yearIndex !== pos ? val(maybeDate[pos]) : 0;
          var monthIndex = -1;
          if (month > 0 && month < 13) {
            monthIndex = pos;
          } else {
            pos = pos === 0 ? 1 : 0;
            month = yearIndex !== pos ? val(maybeDate[pos]) : pos;
            if (month > 0 && month < 13) {
              monthIndex = pos;
            } else {
              month = yearIndex !== 2 ? val(maybeDate[2]) : 0;
              if (month > 0 && month < 13) {
                monthIndex = 2;
              }
            }
          }
          var day = yearIndex !== 0 && monthIndex !== 0 ? val(maybeDate[0]) : 0;
          if (day > 31 || day < 1) {
            day = yearIndex !== 1 && monthIndex !== 1 ? val(maybeDate[1]) : 0;
            if (day > 31 || day < 1) {
              day = yearIndex !== 2 && monthIndex !== 2 ? val(maybeDate[2]) : 0;
              if (day > 31 || day < 1) {
                day = 0;
              }
            }
          }

          if (isNaN(month) || isNaN(day) || isNaN(year)) {
            return "";
          } else {
            if (month === 0) {
              maybeDate = "";
            } else {
              if (year === 0) {
                year = (new Date()).getFullYear();
              }
              if (day === 0) {
                day = 1;
              }
              maybeDate = newDate(year, month, day);
            }
          }
        }
      } else {
        if (isNaN(maybeDate)) {
          maybeDate = Cairo.Dates.getVirtualDateOrElse(maybeDate, "");
        } else {
          var today = new Date();
          var month = today.getMonth() + 1;
          var year = today.getFullYear();
          var day = val(maybeDate);
          if (day > 0
            && (day < 29
              || (day === 29 && leapYear(year))
              || (day === 30 && month !== 2)
              || (day === 31 && (month !== 2 || month !== 4 || month !== 6 || month !== 9 || month !== 11))
            )
          ) {
            maybeDate = newDate(year, month, day)
          } else {
            maybeDate = "";
          }
        }
      }
    }
    return maybeDate;
  };

  /* TODO: use a test suit

  var testDate = function(date) {
    console.log("d: " + date);
    date = validateStringDate(date);
    console.log("v: " + date);
    date = new Date(date);
    console.log(date);
    console.log("----------------");
  };

  var testDates = function() {
    testDate("");
    testDate("1");
    testDate("2");
    testDate("12");
    testDate("33");
    testDate("333");
    testDate("123");
    testDate("7/12/2001");
    testDate("7/1/1/1/1");
    testDate("7-1");
    testDate("//145");
    testDate("/7/7/1");
    testDate("1/7/7");
    testDate("12/12/12");
    testDate("12/13/12");
    testDate("1/1/1");
    testDate("1-1/3");
    testDate("1/1/8");
    testDate("14/8/25");
    testDate("17/9/7");
    testDate("26/10/75");
    testDate("3/3/336");
    testDate("1/9/25");
    testDate("7/1/1987");
    testDate("7//2015");
    testDate("11");
    testDate("12/5");
    testDate("13/9");
    testDate("9/13");
    testDate("209/13");
    testDate("209/12");
    testDate("20/128");
    testDate("2/128");
    testDate("17/17/1");
    testDate("173/17/1");
    testDate("17/173/1");
    testDate("9999");
    testDate("1111");
    testDate("0408");
    testDate("1408");
    testDate("2508");
    testDate("0814");
    testDate("081408");
    testDate("08142018");
    testDate("1.1");
    testDate("4.1");
    testDate("3.1.1580");
    testDate("3.15.1580");
    testDate("31.15.1580");
    testDate(".");
    testDate("..");
    testDate("....");
    testDate("1.1.1..");
    testDate("1.1.1");
    testDate("1.1.1.");
    testDate(".1.1.1");
    testDate(".1.1.1.");
  };
  
  testDates();
  */

  var removeTime = function(date) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  };

  var getDateValue = function(maybeDate) {
    //
    // we try to handle null and undefined in a way it allows as to continue working
    // following the principle "chisporrotea pero no estalla"
    //
    if(maybeDate === undefined || maybeDate === null) {
      Cairo.log("getDateValue called with undefined or null", true);
      maybeDate = NO_DATE;
    }
    else {
      if(typeof maybeDate === "string") {
        maybeDate = validateStringDate(maybeDate);
      }
      maybeDate = parseDate(maybeDate);
      if(isNaN(maybeDate.getTime())) {
        maybeDate = NO_DATE;
      }
    }
    return maybeDate;
  };

  var getDateFormatted = function(maybeDate) {
    if(maybeDate === "") {
      return "";
    }
    else {
      if(typeof maybeDate === "string") {
        maybeDate = validateStringDate(maybeDate);
      }
      maybeDate = parseDate(maybeDate);
      return maybeDate.getTime() === NO_DATE.getTime() || !isDate(maybeDate) ? "" : $.datepicker.formatDate(DATE_FORMAT, maybeDate);
    }
  };

  var left = function left(str, n){
    if (n <= 0)
      return "";
    else if (n > String(str).length)
      return str;
    else
      return String(str).substring(0,n);
  };

  var right = function right(str, n){
    if (n <= 0)
      return "";
    else if (n > String(str).length)
      return str;
    else {
      var iLen = String(str).length;
      return String(str).substring(iLen, iLen - n);
    }
  };

  var string = function string(length, character) {
    return new Array(length + 1).join( character );
  };

  var isObject = function(variable) {
    return variable !== null && typeof variable === 'object';
  };

  var getNextRandomId = function() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
      return v.toString(16);
    });
  };

  Cairo.Util = {
    sendKeys: function(key) { /* TODO: implement this. */ },
    getDateValueForGrid: getDateFormatted,
    getDateValueFromGrid: function(maybeDate) {
      if(maybeDate === "") {
        return "";
      }
      else {
        return getDateValue(maybeDate);
      }
    },
    getDateFormatted: getDateFormatted,
    getDateValue: getDateValue,
    removeTime: removeTime,
    isDate: isDate,
    parseDate: parseDate,
    localeLongDateFormat: localeLongDateFormat,
    val: val,
    valEmpty: function(value, type) {
      if(value === null || value === undefined) {
        return true;
      }
      else {
        switch(type) {
          case Cairo.Constants.Types.text:
          case Cairo.Constants.Types.taxId:
            return value.toString() === "";

          case Cairo.Constants.Types.integer:
          case Cairo.Constants.Types.double:
          case Cairo.Constants.Types.currency:
          case Cairo.Constants.Types.single:
          case Cairo.Constants.Types.long:
          case Cairo.Constants.Types.id:
            return val(value) === 0;

          case Cairo.Constants.Types.date:
          case Cairo.Constants.Types.dateOrNull:
            return value === "" || getDateValue(value).getTime() === Cairo.Constants.NO_DATE.getTime();
        }
        return false;
      }
    },
    sendEmailToCrowSoft: function(subject, section) { /* TODO: implement this. */ },
    newArray: function(length, val) {
      var array = [];
      for(var i = 0; i < length; i++) {
        array[i] = val;
      }
      return array;
    },
    toInt: function(value) { return ~~value; },
    boolToInt: function(value) {
      return value === true ? 1 : ( val(value) !== 0 ? 1 : 0 );
    },
    removeLastColon: function(str) {
      if(str.length > 0 && str.slice(-1) === ",") {
        str = str.substr(0, str.length-1);
      }
      return str;
    },
    bool: function(value) {
      return (typeof value === 'boolean') ? value : val(value) !== 0;
    },
    isNumeric: isNumeric,
    zeroDiv: function(dividen, divisor) {
      try {
        var v = parseFloat(divisor);
        if(v === 0 || isNaN( v )) {
          return 0;
        }
        else {
          return dividen / v;
        }
      }
      catch(ignore) {
        return 0;
      }
    },
    getKey: getKey,
    right: right,
    left: left,
    string: string,
    isObject: isObject,
    replaceAll: replaceAll,
    getNextRandomId: getNextRandomId
  };

  var createCompany = function() {
    var self = {
      name: '',
      id: 0,
      defaultCurrency: {
        id: 0,
        symbol: "",
        name: ""
      }
    }

    var that = {};

    that.setName = function(name) {
      self.name = name;
    };
    that.getName = function() {
      return self.name;
    };

    that.setId = function(id) {
      self.id = id;
    };
    that.getId = function() {
      return self.id;
    };

    that.getDefaultCurrency = function() {
      return self.defaultCurrency;
    };
    that.setDefaultCurrency = function(currencyId, currencySymbol, currencyName) {
      self.defaultCurrency.id = currencyId;
      self.defaultCurrency.symbol = currencySymbol;
      self.defaultCurrency.name = currencyName;
    };

    return that;
  };

  Cairo.Company = createCompany();

  var createUser = function() {
    var self = {
      name: '',
      id: 0,
      sucId: 0,
      sucName: '',
      prsId: 0,
      prsName: ''
    }

    var that = {};

    that.setName = function(name) {
      self.name = name;
    };
    that.getName = function() {
      return self.name;
    };

    that.setId = function(id) {
      self.id = id;
    };
    that.getId = function() {
      return self.id;
    };

    that.getSucId = function() {
      return self.sucId;
    };
    that.setSucId = function(id) {
      self.sucId = id;
    };

    that.getSucName = function() {
      return self.sucName;
    };
    that.setSucName = function(name) {
      self.sucName = name;
    };

    that.getPrsId = function() {
      return self.prsId;
    };
    that.setPrsId = function(id) {
      self.prsId = id;
    };

    that.getPrsName = function() {
      return self.prsName;
    };
    that.setPrsName = function(name) {
      self.prsName = name;
    };

    return that;
  };

  Cairo.User = createUser();

  Cairo.Math = {
    truncate: function(value) {
      if (value<0) {
        return Math.ceil(value);
      }
      else {
        return Math.floor(value);
      }
    }
  };

  Cairo.createFont = function() {

    var self = {
      name:           '',
      italic:         false,
      bold:           false,
      size:           0,
      strikeThrough:  false,
      underline:      false
    };

    var that = {};

    that.setName = function(value) {
      self.name = value;
    };
    that.setItalic = function(value) {
      self.italic = value;
    };
    that.setBold = function(value) {
      self.bold = value;
    };
    that.setSize = function(value) {
      self.size = value;
    };
    that.setStrikeThrough = function(value) {
      self.strikeThrough = value;
    };
    that.setUnderline = function(value) {
      self.underline = value;
    };

    return that;

  };

  /*
    returns the execution of function f or errorValue if an error occurs
    the error is ignored
  */
  Cairo.safeExecute = function(f, errorValue) {
    try {
      return f();
    }
    catch(ignore) {
      return errorValue;
    }
  };

  Cairo.Util.List = {
    setListIndexForId: function(c, id) {
      c.selectById(id);
    },
    setListIndex: function(c, index) {
      c.selectByIndex(index);
    },
    setListIndexForText: function(c, text) {
      c.selectByText(text);
    },
    getListId: function(c) {
      return c.getItemData();
    }
  };

  Cairo.Util.File = {
    getValidPath: function(path) { /* TODO: implement this. */ },
    editFile: function(file) { /* TODO: implement this. */ }
  };

  Cairo.String = {
    rtrim: function(str){
      return str.replace(/\s+$/, "");
    },
    ltrim: function(str){
      return str.replace(/^\s+/, "");
    }
  };

  Cairo.Settings = {
    get: function(section, key, defaultValue) { /* TODO: implement this. */},
    appPath: function() { /* TODO: implement this. */ }
  };

  Cairo.Settings.Reports = {
    reportSection: 'REPORTS',
    reportPath: 'REPORT_PATH',
    commandTimeOut: 'COMMAND_TIME_OUT',
    connectionTimeOut: 'CONNECT_TIME_OUT'
  };

  /* TODO: this must to be read from Database */
  var loadSettings = function() {
    var quantityDecimals = 2;
    var amountDecimals = 2;
    var currencyRateDecimals = 3;
    return {
      quantityDecimals: quantityDecimals,
      amountDecimals: amountDecimals,
      currencyRateDecimals: currencyRateDecimals,
      quantityDecimalsFormat: "#,###,###,##0." + Array(quantityDecimals+1).join("0"),
      amountDecimalsFormat: "#,###,###,##0." + Array(amountDecimals+1).join("0"),
      currencyRateDecimalsFormat: "#,###,###,##0." + Array(currencyRateDecimals+1).join("0")
    }
  };

  var getConfiguration = function() {
    var settings = loadSettings();

    Cairo.Settings.getQuantityDecimalsFormat = function() {
      return settings.quantityDecimalsFormat;
    };

    Cairo.Settings.getAmountDecimalsFormat = function() {
      return settings.amountDecimalsFormat;
    };

    Cairo.Settings.getAmountDecimals = function() {
      return settings.amountDecimals;
    };

    Cairo.Settings.getCurrencyRateDecimalsFormat = function() {
      return settings.currencyRateDecimalsFormat;
    };

    Cairo.Settings.getCurrencyRateDecimals = function() {
      return settings.currencyRateDecimals;
    };

  };

  getConfiguration();

  Cairo.raiseError = function(title, message) {
    throw new Error(title + " - " + message);
  };

  Cairo.LoadingMessage = (function() {
    var workDone = false;
    var view = null;
    var message = null;
    var title = null;
    var activeInput = null;
    var messageLabel = null;

    var showMessage = function() {
      if(!workDone) {
        if(!view) {
          view = new Cairo.Common.Views.Loading({
            title: title,
            message: message
          });
          activeInput = $(document.activeElement);
          Cairo.dialogLoadingRegion.show(view);
          messageLabel = $("#loading-view-message");
        }
      }
    };

    var closeView = function() {
      try {
        messageLabel = null;
        Cairo.dialogLoadingRegion.closeDialog();
      }
      catch(ignore) {}
      try {
        activeInput.focus();
      }
      catch(ignore) {}
      view = null;
    };

    var close = function() {
      workDone = true;
      if(view) {
        setTimeout(closeView, 300);
      }
    };

    var show = function(title_, message_, timeout) {
      timeout = timeout !== undefined ? timeout : 300;
      if(!view) {
        workDone = false;
        message = message_ || message;
        title = title_ || title;
        if(timeout === 0) {
          showMessage();
        }
        else {
          setTimeout(showMessage, 300);
        }
      }
    };

    var showWait = function() {
      show("processing", "please wait");
    };

    var showNow = function(title, message) {
      show(title, message, 0);
    }

    var setMessage = function(message_) {
      if(messageLabel !== null) {
        message = message_;
        messageLabel.text(message);
      }
    };

    return {
      close: close,
      show: show,
      showWait: showWait,
      showNow: showNow,
      setMessage: setMessage
    };

  }());

  Cairo.sleep = function(millis, callback) {
    setTimeout(function() { callback(); }, millis);
  };

  Cairo.logTreeEvent = function(event, data, msg) {
    msg = msg ? ": " + msg : "";
    if(window.console && window.console.log) {
      window.console.log("Event('" + event.type + "', node=" + data.node + ")" + msg);
    }
  };

  Cairo.logError = function(msg, exception) {
    Cairo.log('CAIRO_INTERNAL_ERROR: ' + msg);
    if(exception) {
      Cairo.log(exception.message);
      Cairo.log(exception.stack.toString());
    }
  };

  Cairo.log = function(msg, printStackTrace) {
    try {
      msg = msg ? ": " + msg : "";
      if(window.console && window.console.log) {
        window.console.log(msg);
        if(printStackTrace && window.console.trace) {
          window.console.trace();
        }
      }
    }
    catch(ignore) {}
  };

  ///////////////
  // Views
  ///////////////

  Cairo.module("Common.Views", function(Views, Cairo, Backbone, Marionette, $, _) {
    Views.InputTextForm = Marionette.ItemView.extend({
      template: "#input-text-form",

      events: {
        "click button.js-submit": "submitClicked"
      },

      submitClicked: function(e) {
        e.preventDefault();
        var data = Backbone.Syphon.serialize(this);
        this.trigger("form:submit", data);
      },

      onFormDataInvalid: function(errors) {
        var $view = this.$el;

        var clearFormErrors = function() {
          var $form = $view.find("form");
          $form.find(".help-inline.error").each(function() {
            $(this).remove();
          });
          $form.find(".control-group.error").each(function() {
            $(this).removeClass("error");
          });
        };

        var markErrors = function(value, key) {
          var $controlGroup = $view.find("#input-text-" + key).parent();
          var $errorEl = $("<span>", { "class": "help-inline error", text: value });
          $controlGroup.append($errorEl).addClass("error");
        };

        clearFormErrors();
        _.each(errors, markErrors);
      }
    });

    Views.ConfirmForm = Marionette.ItemView.extend({
      template: "#confirm-form",

      events: {
        "click button.js-submit-yes": "yesClicked",
        "click button.js-submit-no": "noClicked",
        "click button.js-submit-cancel": "cancelClicked"
      },

      yesClicked: function(e) {
        e.preventDefault();
        var data = { answer: 'yes' };
        this.trigger("form:submit", data);
      },

      noClicked: function(e) {
        e.preventDefault();
        var data = { answer: 'no' };
        this.trigger("form:submit", data);
      },

      cancelClicked: function(e) {
        e.preventDefault();
        var data = { answer: 'cancel' };
        this.trigger("form:submit", data);
      }

    });

    Views.ErrorMessageView = Marionette.ItemView.extend({
      template: "#error-message-view",

      events: {
        "click button.js-submit": "submitClicked",
        "click button.js-showErrorDetails": "showErrorDetails"
      },

      submitClicked: function(e) {
        e.preventDefault();
        this.trigger("form:submit");
      },

      showErrorDetails: function(e) {
        e.preventDefault();
        this.trigger("form:showDetails");
      }

    });

    Views.InfoMessageView = Marionette.ItemView.extend({
      template: "#info-message-view",

      events: {
        "click button.js-submit": "submitClicked"
      },

      submitClicked: function(e) {
        e.preventDefault();
        this.trigger("form:submit");
      }

    });

    Views.PrintView = Marionette.ItemView.extend({
      template: "#print-view",

      events: {
        "click button.js-submit-preview": "previewClicked",
        "click button.js-submit-print": "printClicked",
        "click button.js-submit-email": "emailClicked",
        "click button.js-submit-pdf": "pdfClicked",
        "click button.js-submit-folder": "folderClicked",
        "click button.js-submit-cancel": "cancelClicked"
      },

      previewClicked: function(e) {
        e.preventDefault();
        this.trigger("form:preview");
      },
      printClicked: function(e) {
        e.preventDefault();
        this.trigger("form:print");
      },
      emailClicked: function(e) {
        e.preventDefault();
        this.trigger("form:email");
      },
      pdfClicked: function(e) {
        e.preventDefault();
        this.trigger("form:pdf");
      },
      folderClicked: function(e) {
        e.preventDefault();
        this.trigger("form:folder");
      },
      cancelClicked: function(e) {
        e.preventDefault();
        this.trigger("form:cancel");
      }

    });

  });

  Cairo.module("Common.Views", function(Views, Cairo, Backbone, Marionette, $, _) {
    Views.InputText = Views.InputTextForm.extend({
      initialize: function() {
        this.title = this.model.get("title");
      },

      onRender: function() {
        if(this.options.generateTitle) {
          var $title = $('<h1>', { text: this.title });
          this.$el.prepend($title);
        }

        this.$(".js-submit").text("Submit");
      }
    });

    Views.Confirm = Views.ConfirmForm.extend({
      initialize: function() {
        this.title = this.model.get("title");
      },

      onRender: function() {
        if(this.options.generateTitle) {
          var $title = $('<h1>', { text: this.title });
          this.$el.prepend($title);
        }
      }
    });

    Views.ErrorMessage = Views.ErrorMessageView.extend({
      initialize: function() {
        this.title = this.model.get("title");
      },

      onRender: function() {
        if(this.options.generateTitle) {
          var $title = $('<h1>', { text: this.title });
          this.$el.prepend($title);
        }
      }
    });

    Views.InfoMessage = Views.InfoMessageView.extend({
      initialize: function() {
        this.title = this.model.get("title");
      },

      onRender: function() {
        if(this.options.generateTitle) {
          var $title = $('<h1>', { text: this.title });
          this.$el.prepend($title);
        }
      }
    });

    Views.Print = Views.PrintView.extend({
      initialize: function() {
        this.title = this.model.get("title");
      },

      onRender: function() {
        var reports = this.model.get("reports");
        var grid = Cairo.Dialogs.Grids.createGrid();

        var KI_RPT_ID = 1;
        var KI_SELECT = 2;
        var KI_NAME = 3;
        var KI_COPIES = 4;
        var KI_FILE = 5;
        var KI_OBJECT = 6;

        var getText = Cairo.Language.getText;
        var T = Cairo.Dialogs.PropertyType;
        var C = Cairo.General.Constants;
        var DB = Cairo.Database;
        var valField = DB.valField;
        var P = Cairo.Promises;

        var columns = grid.getColumns();
        columns.clear();

        var col = columns.add(null);
        col.setVisible(false);
        col.setKey(KI_RPT_ID);

        col = columns.add(null);
        col.setName("");
        col.setType(T.check);
        col.setKey(KI_SELECT);

        col = columns.add(null);
        col.setName(getText(2708, "")); // Reporte
        col.setKey(KI_NAME);

        col = columns.add(null);
        col.setName(getText(2574, "")); // Copias
        col.setType(T.numeric);
        col.setSubType(Cairo.Dialogs.PropertySubType.integer);
        col.setKey(KI_COPIES);

        col = columns.add(null);
        col.setVisible(false);
        col.setKey(KI_FILE);

        col = columns.add(null);
        col.setVisible(false);
        col.setKey(KI_OBJECT);

        var control = Cairo.Controls.createGrid();
        var element = $(control.htmlTag);
        var alwaysTrue = function() {
          return function() { return P.resolvedPromise(true); };
        };
        control.setElement(element, {
          onGridColumnBeforeEdit: alwaysTrue,
          onGridColumnAfterEdit: alwaysTrue
        });

        var rows = grid.getRows();
        rows.clear();

        for(var i = 0, count = reports.length; i < count; i += 1) {
          var row = rows.add(null,  valField(reports[i], C.RPTF_ID));

          var elem = row.add(null);
          elem.setValue(valField(reports[i], C.RPTF_ID));
          elem.setKey(KI_RPT_ID);

          elem = row.add(null);
          elem.setId(parseInt(valField(reports[i], C.RPTF_SUGERIDO)));
          elem.setKey(KI_SELECT);

          elem = row.add(null);
          elem.setValue(valField(reports[i], C.RPTF_NAME));
          elem.setKey(KI_NAME);

          elem = row.add(null);
          elem.setValue(valField(reports[i], C.RPTF_COPIAS));
          elem.setKey(KI_COPIES);

          elem = row.add(null);
          elem.setValue(valField(reports[i], C.RPTF_CSRFILE));
          elem.setKey(KI_FILE);

          elem = row.add(null);
          elem.setValue(valField(reports[i], C.RPTF_OBJECT));
          elem.setKey(KI_OBJECT);
        }
        control.setEditEnabled(true);

        Cairo.Dialogs.Grids.Manager.loadFromRows(control, grid, false, "Reports");

        this.model.set("gridCtrl", control);

        this.$("#reportGrid").append(element);
      }
    });

  });

  Cairo.inputFormView = function(title, label, defaultValue, inputHandler) {
    var Model = Backbone.Model.extend({ urlRoot: "inputForm" });
    if(title === "") title = Cairo.Application.getName();
    var model = new Model({ title: title, label: label, text: defaultValue });
    var view = new Cairo.Common.Views.InputText({
        model: model
      });

    view.on("form:submit", function(data) {
      Cairo.log("submit handled - Data: " + data);
      view.trigger("dialog:close");
      inputHandler(data["input-text-text"]);
    });

    return view;
  };

  Cairo.confirmViewWithClasses = function(title, message, yesClass, noClass, confirmHandler) {
    var Model = Backbone.Model.extend({ urlRoot: "inputForm" });
    if(title === "") title = Cairo.Application.getName();
    var model = new Model({ title: title, message: message, yesClass: yesClass, noClass: noClass, cancelClass: 'hide' });
    var view = new Cairo.Common.Views.Confirm({
        model: model
      });

    view.on("form:submit", function(data) {
      Cairo.log("submit handled - Data: " + data);
      view.trigger("dialog:close");
      confirmHandler(data.answer);
    });

    return view;
  };

  Cairo.confirmViewWithCancelAndClasses = function(title, message, yesClass, noClass, confirmHandler) {
    var Model = Backbone.Model.extend({ urlRoot: "inputForm" });
    if(title === "") title = Cairo.Application.getName();
    var model = new Model({ title: title, message: message, yesClass: yesClass, noClass: noClass, cancelClass: '' });
    var view = new Cairo.Common.Views.Confirm({
      model: model
    });

    view.on("form:submit", function(data) {
      Cairo.log("submit handled - Data: " + data);
      view.trigger("dialog:close");
      confirmHandler(data.answer);
    });

    return view;
  };

  Cairo.confirmViewWithCancelNoDanger = function(title, message, confirmHandler) {
    return Cairo.confirmViewWithCancelAndClasses(title, message, "btn-info", "btn-danger", confirmHandler);
  };

  Cairo.confirmViewWithCancelYesDanger = function(title, message, confirmHandler) {
    return Cairo.confirmViewWithCancelAndClasses(title, message, "btn-danger", "btn-info", confirmHandler);
  };

  Cairo.confirmViewYesDanger = function(title, message, confirmHandler) {
    return Cairo.confirmViewWithClasses(title, message, "btn-danger", "btn-info", confirmHandler);
  };

  Cairo.confirmView = function(title, message, confirmHandler) {
    return Cairo.confirmViewWithClasses(title, message, "btn-info", "", confirmHandler);
  };

  Cairo.confirmViewYesDefault = Cairo.confirmView;
  Cairo.confirmViewNoDefault = Cairo.confirmView;

  Cairo.infoView = function(title, message, closeHandler) {
    var Model = Backbone.Model.extend({ urlRoot: "infoMessage" });
    var model = new Model({ title: title, message: message });
    var view = new Cairo.Common.Views.InfoMessage({
      model: model
    });

    view.on("form:submit", function(data) {
      Cairo.log("submit handled - Data: " + data);
      view.trigger("dialog:close");
      if(closeHandler) { closeHandler(); }
    });

    return view;
  };

  Cairo.printView = function(title, message, reports, actionHandler) {
    var Model = Backbone.Model.extend({ urlRoot: "printMessage" });
    var model = new Model({ title: title, message: message, reports: reports });
    var view = new Cairo.Common.Views.Print({
      model: model
    });

    var handler = function(action, data) {
      Cairo.log("print handled - Data: " + data);
      view.trigger("dialog:close");
      var gridCtrl = model.get("gridCtrl");
      var rows = gridCtrl.getRows();
      var selectedReports = [];
      for(var i = 0, count = rows.size(); i < count; i += 1) {
        var row = rows.item(i);
        if(Cairo.Util.val(row.getCells().item(2).getItemData()) !== 0) {
          selectedReports.push(reports[i]);
        }
      }
      actionHandler(action, selectedReports);
    };

    view.on("form:print",   function(data) { handler("print",   data); });
    view.on("form:preview", function(data) { handler("preview", data); });
    view.on("form:pdf",     function(data) { handler("pdf",     data); });
    view.on("form:email",   function(data) { handler("email",   data); });
    view.on("form:folder",  function(data) { handler("folder",  data); });
    view.on("form:cancel",  function(data) { handler("cancel",  data); });

    return view;
  };

  Cairo.infoViewShow = function(title, message, closeHandler) {
    var view = Cairo.infoView(title, message, closeHandler);
    Cairo.dialogRegion.show(view);
  };
  
  Cairo.warningViewShow = Cairo.infoViewShow;

  Cairo.printViewShow = function(title, message, reports, actionHandler) {
    var view = Cairo.printView(title, message, reports, actionHandler);
    Cairo.dialogRegion.show(view);
  };

  Cairo.manageErrorView = function(title, message, errorResponse, closeHandler) {
    var Model = Backbone.Model.extend({ urlRoot: "errorMessage" });
    var model = new Model({ title: title, message: message });
    var view = new Cairo.Common.Views.ErrorMessage({
        model: model
      });

    view.on("form:submit", function(data) {
      Cairo.log("submit handled - Data: " + data);
      view.trigger("dialog:close");
      if(closeHandler) { closeHandler(); }
    });

    view.on("form:showDetails", function(data) {
      Cairo.log("showDetails handled");
      Cairo.showErrorDetails(errorResponse);
    });

    return view;
  };

  Cairo.manageError = function(title, message, errorResponse, exception, closeHandler) {
    var defer = new Cairo.Promises.Defer();
    var errorDetails = errorResponse;
    if(exception) {
      errorDetails += "\n\n" + exception.stack.toString();
      errorDetails = errorDetails.replace(/\n/g, "<br>");
    }
    var getCloseHandler = function() {
      return function(args) {
        var p = null;
        if(closeHandler) {
          p = closeHandler(args);
        }
        p = p || Cairo.Promises.resolvedPromise(true);
        p.then(function() {
          defer.resolve(false);
        })
      };
    };
    var view = Cairo.manageErrorView(title, message, errorDetails, getCloseHandler());
    //
    // close the loading message is it is open
    //
    Cairo.LoadingMessage.close();
    //
    // finally show the message
    //
    Cairo.dialogRegion.show(view);
    Cairo.logError(message, exception);
    return defer.promise;
  };

  Cairo.manageErrorEx = function(errorResponse, exception, functionName, className, infoAdd) {
    return Cairo.manageError(
      "Error",
      "An error has occurred when calling this function: " + className + "." + functionName + "<br>" + infoAdd,
      errorResponse,
      exception
    );
  };

  Cairo.manageErrorHandler = function(title, message, closeHandler) {
    message = message || "";
    return function(errorResponse) {
      return Cairo.manageError(title, message, errorResponse, null, closeHandler);
    };
  };

  Cairo.showErrorDetails = function(html) {
    $('#errorDetailIFrame')[0].src = "data:text/html;charset=utf-8," + escape(html);
    $('#errorDetailIFrame').show();
  };

  Cairo.Editors = {};

  Cairo.LoadingMessage.show(Cairo.Application.getName(), "Loading General Settings");

  var resizeComponents = function() {
    try {
      var win = $(window);
      var f = $("#footer");

      var rc = $(".dialog-report-container");
      if(rc.length > 0) {
        rc.height(win.height() - rc.offset().top - f.height() - 20);
      }
    }
    catch(ignore) {}
  };

  Cairo.resizeComponents = resizeComponents;

  $(window).on('resize', function(){
    resizeComponents();
  });

  Cairo.validateAssignmentIsNotNull = function(value, module, functionName) {
    if(value === undefined || value === null) {
      Cairo.raiseError("Invalid null or undefined assignment", module + "." + functionName);
    }
  };

  var createFileEx = function() {
    var that = {};

    that.fileGetName = function(fullFileName) {
      return fullFileName.replace(/^.*[\\\/]/, '');
    };

    return that;
  };

  Cairo.FileEx = createFileEx();

}());