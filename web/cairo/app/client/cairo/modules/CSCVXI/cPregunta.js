(function() {
  "use strict";

  Cairo.module("Xxxx.Edit", function(Edit, Cairo, Backbone, Marionette, $, _) {

  });

  Cairo.module("XxxxListDoc.Edit", function(Edit, Cairo, Backbone, Marionette, $, _) {

    var createObject = function() {

      var self = {};

      var getText = Cairo.Language.getText;
      var P = Cairo.Promises;
      var NO_ID = Cairo.Constants.NO_ID;
      var DB = Cairo.Database;
      var D = Cairo.Documents;
      var M = Cairo.Modal;
      var C = Cairo.General.Constants;
      var Types = Cairo.Constants.Types;
      var Dialogs = Cairo.Dialogs;
      var T = Dialogs.PropertyType;
      var val = Cairo.Util.val;
      var isDate = Cairo.Util.isDate;
      var getDateValue = Cairo.Util.getDateValue;
      var today = Cairo.Dates.today;
      var valField = DB.valField;
      var CS = Cairo.Security.Actions.Compras;

      var C_MODULE = "cPreguntaListDoc";

      var C_FECHAINI = "FechaIni";
      var C_FECHAFIN = "FechaFin";

      var C_OBSERVADAS = "observadas";

      var C_IMG_TASK = 2;

      var K_FECHAINI = 1;
      var K_FECHAFIN = 2;
      var K_RESPONDIO = 3;
      var K_CLI_ID = 4;
      var K_PREGUNTA = 5;
      var K_NICK = 6;
      var K_OBSERVADAS = 7;

      var m_fechaIniV = "";
      var m_fechaFinV = "";

      // ACA VAN LAS m_ GENERADAS POR EL ASISTENTE.
      var m_fechaIni = null;
      var m_fechaFin = null;
      var m_us_id_respondio = "";
      var m_cliId = "";

      var m_modifico = "";
      var m_contacto = "";
      var m_cliente = "";
      var m_pregunta = "";
      var m_nick = "";
      var m_observadas;

      var m_dialog;
      var m_us_id = 0;
      var m_properties;

      var m_apiPath = DB.getAPIVersion();

      var loadCollection = function() {
        var c = null;
        var o = null;
        var value = null;
        var bExists = null;

        m_dialog.getProperties().clear();

        c = m_dialog.getProperties().add(null, C_FECHAINI);
        c.setType(Dialogs.PropertyType.date);
        //'Fecha desde
        c.setName(Cairo.Language.getText(1203, ""));
        c.setKey(K_FECHAINI);
        if(LenB(m_fechaIniV)) {
          c.setValue(m_fechaIniV);
        }
        else {
          c.setValue(m_fechaIni);
        }

        c = m_dialog.getProperties().add(null, C_FECHAFIN);
        c.setType(Dialogs.PropertyType.date);
        //'Fecha hasta
        c.setName(Cairo.Language.getText(1204, ""));
        c.setKey(K_FECHAFIN);
        if(LenB(m_fechaFinV)) {
          c.setValue(m_fechaFinV);
        }
        else {
          c.setValue(m_fechaFin);
        }

        c = m_dialog.getProperties().add(null, Cairo.Constants.MODIFICO);
        c.setType(Dialogs.PropertyType.select);
        c.setTable(csUsuario);
        //'Respondido por
        c.setName(Cairo.Language.getText(5098, ""));
        c.setKey(K_RESPONDIO);
        value = m_modifico;
        if(m_us_id_respondio.Substring(0, 1).toUpperCase() == KEY_NODO) {
          value = GetNombreRama(csUsuario, Cairo.Util.val(m_us_id_respondio.Substring(2)), bExists);
          if(!bExists) { m_us_id_respondio = "0"; }
        }
        c.setValue(value);
        c.setSelectId(Cairo.Util.val(m_us_id_respondio));
        c.setHelpValueProcess(m_us_id_respondio);

        c = m_dialog.getProperties().add(null, mCVXIConstantes.CLI_ID);
        c.setType(Dialogs.PropertyType.select);
        c.setTable(Cairo.Tables.CLIENTE);
        //'Cliente
        c.setName(Cairo.Language.getText(1150, ""));
        c.setKey(K_CLI_ID);
        value = m_cliente;
        if(m_cliId.Substring(0, 1).toUpperCase() == KEY_NODO) {
          value = GetNombreRama(Cairo.Tables.CLIENTE, Cairo.Util.val(m_cliId.Substring(2)), bExists);
          if(!bExists) { m_cliId = "0"; }
        }
        c.setValue(value);
        c.setSelectId(Cairo.Util.val(m_cliId));
        c.setHelpValueProcess(m_cliId);

        c = m_dialog.getProperties().add(null, mCVXIConstantes.CMIP_NICK);
        c.setType(Dialogs.PropertyType.text);
        //'Nick
        c.setName(Cairo.Language.getText(5099, ""));
        c.setKey(K_NICK);
        c.setValue(m_nick);

        c = m_dialog.getProperties().add(null, mCVXIConstantes.CMIP_PREGUNTA);
        c.setType(Dialogs.PropertyType.text);
        //'Pregunta
        c.setName(Cairo.Language.getText(5093, ""));
        c.setKey(K_PREGUNTA);
        c.setValue(m_pregunta);

        c = m_dialog.getProperties().add(null, C_OBSERVADAS);
        c.setType(Dialogs.PropertyType.check);
        //'Observadas
        c.setName(Cairo.Language.getText(5102, ""));
        c.setKey(K_OBSERVADAS);
        c.setValue(Cairo.Util.boolToInt(m_observadas));

        if(!m_dialog.showDocumentList(self)) { return false; }

        return true;

      };

      var refreshCollection = function() {

        m_dialog.setTitle(m_name);

        var properties = m_dialog.getProperties();

        return m_dialog.showValues(properties);
      };

      var load = function() {

        return DB.getData("load[" + m_apiPath + "general/preguntalistdoc]", id).then(
          function(response) {

            if(response.success !== true) { return false; }

            if(response.data.id === NO_ID) {

              m_fechaIniV = "";
              m_fechaIni = Cairo.Dates.today();
              m_fechaFinV = "";
              m_fechaFin = Cairo.Dates.DateNames.getDateByName('h-60');

              m_us_id_respondio = NO_ID;
              m_modifico = "";
              m_cliId = NO_ID;
              m_cliente = "";
              m_pregunta = "";
              m_nick = "";
              m_observadas = false;

            }
            else {

              m_fechaIniV = valField(response.data, C.FROM);
              m_fechaIni = valField(response.data, C.FROM);
              m_fechaIni = isDate(m_fechaIni) ? getDateValue(m_fechaIni) : today();

              m_fechaFinV = valField(response.data, C.TO);
              m_fechaFin = valField(response.data, C.TO);
              m_fechaFin = isDate(m_fechaFin) ? getDateValue(m_fechaFin) : today();

              m_cliId = valField(response.data, C.CLI_ID);
              m_cliente = valField(response.data, C.CLI_NAME);

            }

            return true;
          });
      };

      self.getAplication = function() {
        return Cairo.appName;
      };

      self.getProperties = function() {
        return m_properties;
      };

      self.propertyChange = function(key) {
        var iProp = null;
        switch (key) {

          case K_FECHAINI:

            iProp = m_dialog.getProperties().item(C_FECHAINI);

            if(LenB(iProp.getSelectIntValue())) {
              m_fechaIniV = iProp.getSelectIntValue();
              m_fechaIni = Cairo.Dates.DateNames.getDateByName(m_fechaIniV);
            }
            else if(IsDate(iProp.getValue())) {
              m_fechaIniV = "";
              m_fechaIni = iProp.getValue();
            }
            else {
              m_fechaIniV = "";
              iProp.setValue(m_fechaIni);
            }

            break;

          case K_FECHAFIN:

            iProp = m_dialog.getProperties().item(C_FECHAFIN);

            if(LenB(iProp.getSelectIntValue())) {
              m_fechaFinV = iProp.getSelectIntValue();
              m_fechaFin = Cairo.Dates.DateNames.getDateByName(m_fechaFinV);
            }
            else if(IsDate(iProp.getValue())) {
              m_fechaFinV = "";
              m_fechaFin = iProp.getValue();
            }
            else {
              m_fechaFinV = "";
              iProp.setValue(m_fechaFin);
            }

            break;

          case K_RESPONDIO:
            var property = m_dialog.getProperties().item(Cairo.Constants.MODIFICO);
            m_modifico = property.getValue();
            m_us_id_respondio = property.getSelectIntValue();

            break;

          case K_CLI_ID:
            var property = m_dialog.getProperties().item(mCVXIConstantes.CLI_ID);
            m_cliente = property.getValue();
            m_cliId = property.getSelectIntValue();

            break;

          case K_NICK:
            m_nick = m_dialog.getProperties().item(mCVXIConstantes.CMIP_NICK).getValue();

            break;

          case K_PREGUNTA:
            m_pregunta = m_dialog.getProperties().item(mCVXIConstantes.CMIP_PREGUNTA).getValue();

            break;

          case K_OBSERVADAS:
            m_observadas = m_dialog.getProperties().item(C_OBSERVADAS).getValue();

            break;
        }

        return true;
      };

      var cIABMListDocClient_Refresh = function() {
        var sqlstmt = null;

        sqlstmt = "sp_lsdoc_Preguntas ";

        sqlstmt = sqlstmt+ Cairo.Database.getUserId().toString()+ ",";

        if(!cDate.getDateNames(m_fechaIniV) == null) {
          sqlstmt = sqlstmt+ Cairo.Database.sqlDate(Cairo.Dates.DateNames.getDateByName(m_fechaIniV))+ ",";
        }
        else {
          sqlstmt = sqlstmt+ Cairo.Database.sqlDate(m_fechaIni)+ ",";
        }

        if(!cDate.getDateNames(m_fechaFinV) == null) {
          sqlstmt = sqlstmt+ Cairo.Database.sqlDate(Cairo.Dates.DateNames.getDateByName(m_fechaFinV))+ ",";
        }
        else {
          sqlstmt = sqlstmt+ Cairo.Database.sqlDate(m_fechaFin)+ ",";
        }

        sqlstmt = sqlstmt+ Cairo.Database.sqlString(m_us_id_respondio)+ ",";
        sqlstmt = sqlstmt+ Cairo.Database.sqlString(m_cliId)+ ",";
        sqlstmt = sqlstmt+ Cairo.Database.sqlString(m_nick)+ ",";
        sqlstmt = sqlstmt+ Cairo.Database.sqlString(m_pregunta)+ ",";
        sqlstmt = sqlstmt+ m_observadas ? 1 : 0);

        return sqlstmt;
      };

      var cIABMListDocClient_Save = function() {

        var strError = null;

        strError = Cairo.Language.getText(5101, "");
        //Error al grabar los párametros de navegación de preguntas

        var register = null;
        var fields = null;
        register = new cRegister();

        var sqlstmt = null;

        sqlstmt = "delete ListaDocumentoParametro  where pre_id = "+ csCVXIPrestacion.cSPRECVXILISTPREGUNTA.toString()+ " and us_id = "+ m_us_id;

        if(!Cairo.Database.execute(sqlstmt, "cIABMClient_Save", C_MODULE, strError)) { return false; }

        fields = register.getFields();
        register.setTable(Cairo.Constants.LISTADOCUMENTOPARAMETRO);
        register.setUtilizaIdentity(true);

        var property = null;
        var _count = m_dialog.getProperties().size();
        for (var _i = 0; _i < _count; _i++) {
          property = m_dialog.getProperties().item(_i);

          fields.clear();

          switch (property.getKey()) {

            case K_FECHAINI:

              if(LenB(property.getSelectIntValue())) {
                fields.add2(Cairo.Constants.LDP_VALOR, property.getSelectIntValue(), Cairo.Constants.Types.text);
              }
              else {
                fields.add2(Cairo.Constants.LDP_VALOR, property.getValue(), Cairo.Constants.Types.text);
              }

              fields.add2(Cairo.Constants.LDP_ORDEN, 10, Cairo.Constants.Types.integer);
              fields.add2(Cairo.Constants.LDP_ID, K_FECHAINI, Cairo.Constants.Types.integer);

              break;

            case K_FECHAFIN:

              if(LenB(property.getSelectIntValue())) {
                fields.add2(Cairo.Constants.LDP_VALOR, property.getSelectIntValue(), Cairo.Constants.Types.text);
              }
              else {
                fields.add2(Cairo.Constants.LDP_VALOR, property.getValue(), Cairo.Constants.Types.text);
              }

              fields.add2(Cairo.Constants.LDP_ORDEN, 20, Cairo.Constants.Types.integer);
              fields.add2(Cairo.Constants.LDP_ID, K_FECHAFIN, Cairo.Constants.Types.integer);

              break;

            case K_RESPONDIO:
              fields.add2(Cairo.Constants.LDP_VALOR, property.getSelectIntValue(), Cairo.Constants.Types.text);
              fields.add2(Cairo.Constants.LDP_ORDEN, 80, Cairo.Constants.Types.integer);
              fields.add2(Cairo.Constants.LDP_ID, K_RESPONDIO, Cairo.Constants.Types.integer);

              break;

            case K_CLI_ID:
              fields.add2(Cairo.Constants.LDP_VALOR, property.getSelectIntValue(), Cairo.Constants.Types.text);
              fields.add2(Cairo.Constants.LDP_ORDEN, 110, Cairo.Constants.Types.integer);
              fields.add2(Cairo.Constants.LDP_ID, K_CLI_ID, Cairo.Constants.Types.integer);

              break;

            case K_NICK:
              fields.add2(Cairo.Constants.LDP_VALOR, property.getValue(), Cairo.Constants.Types.text);
              fields.add2(Cairo.Constants.LDP_ORDEN, 130, Cairo.Constants.Types.integer);
              fields.add2(Cairo.Constants.LDP_ID, K_NICK, Cairo.Constants.Types.integer);

              break;

            case K_PREGUNTA:
              fields.add2(Cairo.Constants.LDP_VALOR, property.getValue(), Cairo.Constants.Types.text);
              fields.add2(Cairo.Constants.LDP_ORDEN, 140, Cairo.Constants.Types.integer);
              fields.add2(Cairo.Constants.LDP_ID, K_PREGUNTA, Cairo.Constants.Types.integer);

              break;

            case K_OBSERVADAS:
              fields.add2(Cairo.Constants.LDP_VALOR, property.getValue(), Cairo.Constants.Types.text);
              fields.add2(Cairo.Constants.LDP_ORDEN, 150, Cairo.Constants.Types.integer);
              fields.add2(Cairo.Constants.LDP_ID, K_OBSERVADAS, Cairo.Constants.Types.integer);

              break;
          }

          fields.add2(Cairo.Constants.US_ID, m_us_id, Cairo.Constants.Types.id);
          fields.add2(Cairo.Constants.PRE_ID, csCVXIPrestacion.cSPRECVXILISTPREGUNTA, Cairo.Constants.Types.id);

          if(!Cairo.Database.save(register, , "cIABMClient_Save", C_MODULE, strError)) { return false; }
        }

        if(!load(m_us_id)) { return false; }

        return true;
      };

      var cIABMListDocClient_Terminate = function() {
        return true;
      };

      self.getTitle = function() {
        //'Preguntas
        return Cairo.Language.getText(5090, "");
      };

      self.validate = function() {
        return P.resolvedPromise(true);
      };

      var cIEditGenericListDoc_GridAdd = function(keyProperty) {

      };

      var cIEditGenericListDoc_GridEdit = function(keyProperty) {

      };

      var cIEditGenericListDoc_GridRemove = function(keyProperty) {

      };

      self.setDialog = function(dialog) {
        m_dialog = dialog;
        m_properties = dialog.getProperties();
      };

      var cIEditGenericListDoc_PropertyChange = function(key) {
      };

      var cIEditGenericListDoc_ShowParams = function(us_id) {
        var _rtn = null;
        try {

          if(us_id == NO_ID) { return _rtn; }

          m_us_id = us_id;

          if(!load(us_id)) { return _rtn; }

          if(!loadCollection()) { return _rtn; }

          _rtn = true;
          return _rtn;
        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, "cIEditGenericListDoc_ShowParams", C_MODULE, "");
        }

        return _rtn;
      };

      var cIEditGenericListDoc_TabClick = function(index) {

      };

      self.initialize = function() {
        try {

          m_properties = new cABMDocProperties();
          //Set .ImageList = fIcons.ilList
          m_properties.setHaveDetail(true);
          m_properties.setStartRowText(2);

          var elem = m_properties.add(null, "TypeTask");
          elem.setName("TypeTask");
          elem.setCaption(" ");
          var elem = elem.add(null);
          elem.FormulaType = csConditionType.cSCONDTNONE;
          elem.IconIndex = C_IMG_TASK;
          elem.setWidth(500);
          elem.setSortType(csSortType.cSSRTTICON);

          var elem = m_properties.add(null, "Descripción");
          elem.setName("Descripción");
          elem.setFontName("Tahoma");
          elem.setFontSize(8);
          elem.setForeColor(vbBlue);

          // **TODO:** goto found: GoTo ExitProc;
        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, "Class_Terminate", C_MODULE, "");
          // **TODO:** label found: ExitProc:;
        }
        // **TODO:** on error resume next found !!!
      };

      self.destroy = function() {
        try {

          m_dialog = null;
          m_properties = null;

          // **TODO:** goto found: GoTo ExitProc;
        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, "Class_Terminate", C_MODULE, "");
          // **TODO:** label found: ExitProc:;
        }
        // **TODO:** on error resume next found !!!
      };

      return self;
    };

    Edit.Controller = { getEditor: createObject };

  });

  Cairo.module("Xxxx.List", function(List, Cairo, Backbone, Marionette, $, _) {

    var NO_ID = Cairo.Constants.NO_ID;
    var DB = Cairo.Database;
    var C_MODULE = "cXxxx";
    var P = Cairo.Promises;

    List.Controller = {
      list: function() {

        var self = this;

        /*
         this function will be called by the tab manager every time the
         view must be created. when the tab is not visible the tab manager
         will not call this function but only make the tab visible
         */
        var createListDialog = function(tabId) {

          var editors = Cairo.Editors.xxxxEditors || Cairo.Collections.createCollection(null);
          Cairo.Editors.xxxxEditors = editors;

          // ListController properties and methods
          //
          self.entityInfo = new Backbone.Model({
            entitiesTitle: "Xxxx",
            entityName: "xxxx",
            entitiesName: "xxxxs"
          });

          var getIndexFromEditor = function(editor) {
            var count = editors.count();
            for(var i = 0; i < count; i += 1) {
              if(editors.item(i).editor === editor) {
                return i;
              }
            }
            return -1;
          };

          self.removeEditor = function(editor) {
            var index = getIndexFromEditor(editor);
            if(index >= 0) {
              editors.remove(index);
            }
          };

          var getKey = function(id) {
            if(id === NO_ID) {
              return "new-id:" + (new Date).getTime().toString()
            }
            else {
              return "k:" + id.toString();
            }
          };

          self.updateEditorKey = function(editor, newId) {
            var index = getIndexFromEditor(editor);
            if(index >= 0) {
              var editor = editors.item(index);
              editors.remove(index);
              var key = getKey(newId);
              editors.add(editor, key);
            }
          };

          self.edit = function(id) {
            var key = getKey(id);
            if(editors.contains(key)) {
              editors.item(key).dialog.showDialog();
            }
            else {
              Cairo.LoadingMessage.show("Xxxx", "Loading Xxxxs from Crowsoft Cairo server.");

              var editor = Cairo.Xxxx.Edit.Controller.getEditor();
              var dialog = Cairo.Dialogs.Views.Controller.newDialog();
              var dialogItems = Cairo.Dialogs.Views.Controller.newDialog();
              var dialogFooter = Cairo.Dialogs.Views.Controller.newDialog();

              editor.setListController(self);
              editor.setDialog(dialog);
              editor.setItems(dialogItems);
              editor.setFooter(dialogFooter);
              editor.edit(id).then(Cairo.LoadingMessage.close);

              editors.add({editor: editor, dialog: dialog}, key);
            }
          };

          self.destroy = function(id) {
            if(!Cairo.Security.hasPermissionTo(Cairo.Security.Actions.Modulexxxx.DELETE_XXXX)) {
              return P.resolvedPromise(false);
            }

            var closeDialog = function() {
              try {
                var key = getKey(id);
                if(editors.contains(key)) {
                  editors.item(key).dialog.closeDialog();
                }
              }
              catch(ignore) {
                Cairo.log('Error closing dialog after delete');
              }
              return true;
            };

            return DB.destroy(
              DB.getAPIVersion() + "modulexxxx/xxxx", id,
              Cairo.Constants.DELETE_FUNCTION, C_MODULE).success(closeDialog, false);
          };

          // progress message
          //
          Cairo.LoadingMessage.show("Xxxx", "Loading Xxxxs from Crowsoft Cairo server.");

          self.documentList = Cairo.XxxxListDoc.Edit.Controller.getEditor();
          var dialog = Cairo.Dialogs.Views.ListController.newDialogList();

          self.documentList.setListController(self);
          self.documentList.setDialog(dialog);
          self.documentList.list().then(Cairo.LoadingMessage.close);

        };

        var showListDialog = function() {
          self.documentList.show();
        };

        var closeListDialog = function() {

        }

        createListDialog();
      }
    };
  });

}());