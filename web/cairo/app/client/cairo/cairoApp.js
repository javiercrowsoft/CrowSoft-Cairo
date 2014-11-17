var Cairo = new Marionette.Application();

(function() {
  "use strict";

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

  Cairo.navigate = function(route,  options) {
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
      CIUDADES: 40,
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
      PROCESOS_PRIME: -7002,
      PROCESOS_DE_IMPORTACION: 23002,
      PRODUCTO: 30,
      PRODUCTOKIT: 10000000,
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
      SEMI: 1032,
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

  Cairo.Constants = {
    NO_ID: 0,
    NEW_ID: 0,
    NO_DATE: Date.parse("1900-01-01"),
    NUMBER_ID: '_number_id_',
    STATUS_ID: '_status_id_',
    COPY_OF: 'copy of ',
    DELETE_FUNCTION: 'delete',
    SHOW_DOCUMENTS_FUNCTION: "showDocDigital",
    CLIENT_SAVE_FUNCTION: "save",
    GET_CODE_FROM_ID: "'(@@get_code_from_id@@)'",

    ACTIVE: "activo",
    ACTIVE_LABEL: "Active",
    NAME_LABEL: "Name",
    CODE_LABEL: "Code",
    DESCRIPTION_LABEL: "Description",
    EDIT_FUNCTION: "edit",
    MUST_SET_A_NAME: "You must provide a name"
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

  Cairo.Util = {
    sendKeys: function(key) { /* TODO: implement this. */ },
    getDateValueForGrid: function(value) { /* TODO: implement this. */ },
    getDateValueFromGrid: function(value) { /* TODO: implement this. */ },
    getDateValue: function(value) {
      return Date.parse(value.toString());
    },
    val: function(value) {
      try {
        return parseFloat(value);
      }
      catch(ignore) {
        return 0;
      }
    },
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
            return this.val(value) === 0;

          case Cairo.Constants.Types.date:
          case Cairo.Constants.Types.dateOrNull:
            return this.getDateValue(value) === Cairo.Constants.NO_DATE;
        }
        return false;
      }
    },

    sendEmailToCrowSoft: function(subject, section) { /* TODO: implement this. */ },
    newArray: function(length, val) {
      var array = [];
      for (var i = 0; i < length; i++) {
        array[i] = val;
      }
      return array;
    }
  };

  Cairo.Company = {
    name: ''
  };

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

  Cairo.Font = Backbone.Model.extend({
    urlRoot: "",

    defaults: {
      name:           '',
      italic:         false,
      bold:           false,
      size:           0,
      strikeThrough:  false,
      underline:      false
    },

    setName: function(value) { /* TODO: implement this. */ },
    setItalic: function(value) { /* TODO: implement this. */ },
    setBold: function(value) { /* TODO: implement this. */ },
    setSize: function(value) { /* TODO: implement this. */ },
    setStrikeThrough: function(value) { /* TODO: implement this. */ },
    setUnderline: function(value) { /* TODO: implement this. */ }

  });

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
    setListIndexForId: function(c, id) { /* TODO: implement this. */ },
    setListIndex: function(c, index) { /* TODO: implement this. */ },
    setListIndexForText: function(c, text) { /* TODO: implement this. */ },
    getListId: function(c) { /* TODO: implement this. */ }
  };

  Cairo.Util.File = {
    getValidPath: function(path) { /* TODO: implement this. */ },
    editFile: function(file) { /* TODO: implement this. */ }
  };

  Cairo.Configuration = {
    get: function(section, key, defaultValue) { /* TODO: implement this. */},
    appPath: function() { /* TODO: implement this. */ }
  };

  Cairo.Configuration.Reports = {
    reportSection: 'REPORTS',
    reportPath: 'REPORT_PATH',
    commandTimeOut: 'COMMAND_TIME_OUT',
    connectionTimeOut: 'CONNECT_TIME_OUT'
  };

  Cairo.raiseError = function(title, message) {
    throw new Error(title + " - " + message);
  };

  Cairo.LoadingMessage = (function() {
      var workDone = false;
      var view = null;
      var message = null;
      var title = null;

      var showMessage = function() {
          if(!workDone) {
              if(!view) {
                  view = new Cairo.Common.Views.Loading({
                      title: title,
                      message: message
                  });

                  Cairo.loadingRegion.show(view);
              }
          }
      };
      
      var closeView = function() {
          Cairo.loadingRegion.close();
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

  Cairo.logError = function(msg) {
    Cairo.log('CAIRO_INTERNAL_ERROR: ' + msg);
  };

  Cairo.log = function(msg) {
    msg = msg ? ": " + msg : "";
    if(window.console && window.console.log) {
      window.console.log(msg);
    }
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
        "click button.js-submit-no": "noClicked"
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
    Views.InputText = Cairo.Common.Views.InputTextForm.extend({
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

    Views.Confirm = Cairo.Common.Views.ConfirmForm.extend({
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

    Views.ErrorMessage = Cairo.Common.Views.ErrorMessageView.extend({
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

    Views.InfoMessage = Cairo.Common.Views.InfoMessageView.extend({
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
    var model = new Model({ title: title, message: message, yesClass: yesClass, noClass: noClass });
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

  Cairo.confirmViewYesDanger = function(title, message, confirmHandler) {
    return Cairo.confirmViewWithClasses(title, message, "btn-danger", "btn-info", confirmHandler);
  };

  Cairo.confirmView = function(title, message, confirmHandler) {
    return Cairo.confirmViewWithClasses(title, message, "btn-info", "", confirmHandler);
  };

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
    var errorDetails = errorResponse;
    if(exception) {
      errorDetails += "\n\n" + exception.stack.toString();
      errorDetails = errorDetails.replace(/\n/g, "<br>");
    }
    var view = Cairo.manageErrorView(title, message, errorDetails, closeHandler);
    Cairo.dialogRegion.show(view);
  };

  Cairo.manageErrorEx = function(errorResponse, functionName, className, infoAdd) {
    Cairo.manageError(
      "Error",
      "An error has occurred when calling this function: " + className + "." + functionName + "<br>" + infoAdd,
      errorResponse);
  };

  Cairo.manageErrorHandler = function(title, message, closeHandler) {
    message = message || "";
    return function(errorResponse) {
      Cairo.manageError(title, message, errorResponse, null, closeHandler);
    };
  };

  Cairo.showErrorDetails = function(html) {
    $('#errorDetailIFrame')[0].src = "data:text/html;charset=utf-8," + escape(html);
    $('#errorDetailIFrame').show();
  };

}());