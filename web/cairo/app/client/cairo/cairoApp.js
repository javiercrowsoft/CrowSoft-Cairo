var Cairo = new Marionette.Application();

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
        value = parseFloat(value);
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

  /*
  *
  * some times simple things get very complicated
  * so for some reason I can't understand this:
  * new Date("2") => Thu Feb 01 2001 00:00:00 GMT-0300 (ART)     // WAT
  * new Date("2-1") => Thu Feb 01 2001 00:00:00 GMT-0300 (ART)   // WAT
  * new Date("12-1") => Sat Dec 01 2001 00:00:00 GMT-0300 (ART)  // hooo, now I understand. I was confused because
  *                                                                 I live in Argentina. Obviuslly that has to be the
  *                                                                 reason. I am a dd/mm/yy person :D
  *                                                                 BUTTTTT wait ... WHY 2001 !!! I am not in 2001
  *                                                                 it is 2015 (at least when I was writing this)
  * Okay I will make my own function :(
  *
  * */

  var isDate = function(date) {
    if(date.length < 3) {
      return false;
    }
    else {
      return (! isNaN(new Date(date).valueOf()));
    }
  };

  //
  // date formats are YMD - DMY - MDY
  //

  var getLocaleMonthIndex = function() {
    var d = new Date("11/12/10");
    return d.getMonth() === 11 /* January is 0 :P */ ? 1 /* ?M? */ : 0 /* M?? */;
  };
  var localeMonthIndex = getLocaleMonthIndex();

  var getLocaleYearIndex = function() {
    var d = new Date("03/02/01");
    var year = d.getFullYear();
    return (year === 2003 || year === 1903)
              ? /* YMD */ 0
              : (year === 2001 || year === 1901)
                  ? /* DMY or MDY */ 2 : /* WAT ?Y? */ 1;
  };
  var localeYearIndex = getLocaleYearIndex();

  var DATE_FORMAT = localeMonthIndex === 0 ? "mm/dd/yy" : localeYearIndex === 0 ? "yy/mm/dd" : "dd/mm/yy";

  var validateStringDate = function(date) {

    var _date = function(year, month, day) {
      var d;
      switch(localeYearIndex) {
        case 0: /* YMD */
          d = year.toString() + "/" + month.toString() + "/" + day.toString();
          break;

        case 2: /* ??Y */
          if(localeMonthIndex === 0) {
            d = month.toString() + "/" + day.toString() + "/" + year.toString();
          }
          else {
            d = day.toString() + "/" + month.toString() + "/" + year.toString();
          }
          break;

        default:
          d = "";
          break;
      }
      return d;
    }

    date = replaceAll(date, ".", "-");

    if(date.length === 4 && date.indexOf('-') < 0 && date.indexOf('/') < 0 && /^[0-9]+$/.test(date)) {
      date = date.substr(0,2) + "/" + date.substr(2,2);
    }
    else if(date.length === 6 && date.indexOf('-') < 0 && date.indexOf('/') < 0 && /^[0-9]+$/.test(date)) {
      date = date.substr(0,2) + "/" + date.substr(2,2) + "/" + date.substr(4,2);
    }
    else if(date.length === 8 && date.indexOf('-') < 0 && date.indexOf('/') < 0 && /^[0-9]+$/.test(date)) {
      date = date.substr(0,2) + "/" + date.substr(2,2) + "/" + date.substr(4,4);
    }

    //
    // regular expressions are to smart for me
    //
    if(date.indexOf('-') > -1 || date.indexOf('/') > -1) {
      date = replaceAll(date, "-", "/");
      date = date.split("/");
      if(date.length < 2) {
        date = "";
      }
      else if(date.length < 3) {
        if(date[0].length > 2) {
          date = _date(val(date[0]), val(date[1]), 1);
        }
        else if(date[1].length > 2) {
          date = _date(val(date[1]), val(date[0]), 1);
        }
        else {
          var m = localeMonthIndex === 0 ? 0 : 1;
          var d = m === 0 ? 1 : 0;
          var month = val(date[m]);
          var day = val(date[d]);
          if(isNaN(month) || isNaN(day)) {
            return "";
          }
          else if(month > 12) {
            date = _date((new Date()).getFullYear(), day, month /* month is day */);
          }
          else {
            date = _date((new Date()).getFullYear(), month, day);
          }
        }
      }
      else if(date.length > 3) {
        date = "";
      }
      else {
        var year = 0;
        var yearIndex = -1;
        if(date[0].length > 2) {
          year = date[0];
          yearIndex = 0;
        }
        else if(date[1].length > 2) {
          year = date[1];
          yearIndex = 1;
        }
        else if(date[2].length > 2) {
          year = date[2];
          yearIndex = 2;
        }
        else {
          year = date[localeYearIndex];
        }
        var pos = localeMonthIndex;
        var month = yearIndex !== pos ? val(date[pos]) : 0;
        var monthIndex = -1;
        if(month > 0 && month < 13) {
          monthIndex = pos;
        }
        else {
          pos = pos === 0 ? 1 : 0;
          month = yearIndex !== pos ? val(date[pos]) : pos;
          if(month > 0 && month < 13) {
            monthIndex = pos;
          }
          else {
            month = yearIndex !== 2 ? val(date[2]) : 0;
            if(month > 0 && month < 13) {
              monthIndex = 2;
            }
          }
        }
        var day = yearIndex !== 0 && monthIndex !== 0 ? val(date[0]) : 0;
        if(day > 31 || day < 1) {
          day = yearIndex !== 1 && monthIndex !== 1 ? val(date[1]) : 0;
          if(day > 31 || day < 1) {
            day = yearIndex !== 2 && monthIndex !== 2 ? val(date[2]) : 0;
            if(day > 31 || day < 1) {
              day = 0;
            }
          }
        }

        if(isNaN(month) || isNaN(day) || isNaN(year)) {
          return "";
        }
        else {
          if(month === 0) {
            date = "";
          }
          else {
            if(year === 0) {
              year = (new Date()).getFullYear();
            }
            if(day === 0) {
              day = 1;
            }

            date = _date(year, month, day);
          }
        }
      }
    }
    else {
      date = "";
    }
    return date;
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

  var getDateValue = function(value) {
    //
    // we try to handle null and undefined in a way it allows as to continue working
    // following the principle "chisporrotea pero no estalla"
    //
    if(value === undefined || value === null) {
      debugger;
      Cairo.log("getDateValue called with undefined or null", true);
      value = NO_DATE;
    }
    else {
      if(typeof value === "string") {
        value = validateStringDate(value);
      }
      value = new Date(value.toString());
      if(isNaN(value.getTime())) {
        value = NO_DATE;
      }
    }
    return value;
  };

  var getDateFormatted = function(date) {
    if(date === "") {
      return "";
    }
    else {
      date = new Date(date);
      return date.getTime() === NO_DATE.getTime() || !isDate(date) ? "" : $.datepicker.formatDate(DATE_FORMAT, date);
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
    getDateValueFromGrid: getDateValue,
    getDateFormatted: getDateFormatted,
    getDateValue: getDateValue,
    isDate: isDate,
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
            return getDateValue(value).getTime() === Cairo.Constants.NO_DATE.getTime();
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
      return value === true ? 1 : 0;
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
        if(parseFloat(divisor) === 0) {
          return 0;
        }
        else {
          return dividen / divisor;
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

    var showMessage = function() {
      if(!workDone) {
        if(!view) {
          view = new Cairo.Common.Views.Loading({
            title: title,
            message: message
          });
          activeInput = $(document.activeElement);
          Cairo.dialogLoadingRegion.show(view);
        }
      }
    };

    var closeView = function() {
      try {
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

    var show = function(title_, message_) {
      if(!view) {
        workDone = false;
        message = message_ || message;
        title = title_ || title;
        setTimeout(showMessage, 300);
      }
    };

    var showWait = function() {
      show("processing", "please wait");
    };

    return {
      close: close,
      show: show,
      showWait: showWait
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

  Cairo.infoViewShow = function(title, message, closeHandler) {
    var view = Cairo.infoView(title, message, closeHandler);
    Cairo.dialogRegion.show(view);
  };
  
  Cairo.warningViewShow = Cairo.infoViewShow;

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
        p = p || Cairo.Promises.resolvedPromise();
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
      debugger;
    }
  };

}());