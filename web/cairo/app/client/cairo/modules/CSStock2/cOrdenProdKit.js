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

      var C_MODULE = "cOrdenProdKitListDoc";

      var C_FECHAINI = "FechaIni";
      var C_FECHAFIN = "FechaFin";

      var C_IMG_TASK = 1;

      // ACA VAN LAS K GENERADAS POR EL ASISTENTE.
      var K_FECHAINI = 1;
      var K_FECHAFIN = 2;
      var K_LGJ_ID = 7;
      var K_SUC_ID = 8;
      var K_DOC_ID = 9;
      // empid
      var K_EMP_ID = 100;
      var m_fechaIni = null;
      var m_fechaFin = null;
      var m_docId = "";
      var m_documento = "";
      var m_sucId = "";
      var m_sucursal = "";
      var m_lgj_id = "";
      var m_legajo = "";
      // empid
      var m_empId = "";
      var m_empresa = "";
      var m_fechaIniV = "";
      var m_fechaFinV = "";

      // ACA VAN LAS m_ GENERADAS POR EL ASISTENTE.

      //OJO HASTA ACA

      var m_dialog;
      var m_us_id = 0;
      var m_properties;

      var m_title = "";

      var m_menuLoaded;

      var m_menuShowMensajes = 0;
      var m_menuAddNote = 0;
      var m_menuShowDocAux = 0;

      var m_apiPath = DB.getAPIVersion();

      self.processMenu = function(index) {
        try {

          switch (index) {

            case m_menuShowMensajes:
              showNotes();

              break;

            case m_menuAddNote:
              addNote();

              break;
          }

          // **TODO:** goto found: GoTo ExitProc;
        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, "ProcessMenu", C_MODULE, "");
          // **TODO:** label found: ExitProc:;
        }
        // **TODO:** on error resume next found !!!
      };



      var loadCollection = function() {
        var value = null;
        var bExists = null;

        var properties = m_dialog.getProperties();

        properties.clear();

        var elem = properties.add(null, C_FECHAINI);
        elem.setType(Dialogs.PropertyType.date);
        //'Fecha desde
        elem.setName(Cairo.Language.getText(1203, ""));
        elem.setKey(K_FECHAINI);
        if(LenB(m_fechaIniV)) {
          elem.setValue(m_fechaIniV);
        }
        else {
          elem.setValue(m_fechaIni);
        }

        var elem = properties.add(null, C_FECHAFIN);
        elem.setType(Dialogs.PropertyType.date);
        //'Fecha hasta
        elem.setName(Cairo.Language.getText(1204, ""));
        elem.setKey(K_FECHAFIN);
        if(LenB(m_fechaFinV)) {
          elem.setValue(m_fechaFinV);
        }
        else {
          elem.setValue(m_fechaFin);
        }

        var elem = properties.add(null, mStockConstantes.DOC_ID);
        elem.setType(Dialogs.PropertyType.select);
        elem.setTable(csETablasDocumento.CSDocumento);
        //'Documentos
        elem.setName(Cairo.Language.getText(1611, ""));
        elem.setKey(K_DOC_ID);
        value = m_documento;
        if(m_docId.Substring(0, 1).toUpperCase() == KEY_NODO) {
          value = GetNombreRama(csETablasDocumento.CSDocumento, Cairo.Util.val(m_docId.Substring(2)), bExists);
          if(!bExists) { m_docId = "0"; }
        }
        elem.setValue(value);
        elem.setSelectId(Cairo.Util.val(m_docId));
        elem.setHelpValueProcess(m_docId);
        elem.setSelectFilter("'{emp_id=0}doct_id = "+ csEDocumentoTipo.cSEDT_ORDENPRODKIT.toString()+ "'");

        var elem = properties.add(null, mStockConstantes.SUC_ID);
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.SUCURSAL);
        //'Sucursal
        elem.setName(Cairo.Language.getText(1281, ""));
        elem.setKey(K_SUC_ID);
        value = m_sucursal;
        if(m_sucId.Substring(0, 1).toUpperCase() == KEY_NODO) {
          value = GetNombreRama(Cairo.Tables.SUCURSAL, Cairo.Util.val(m_sucId.Substring(2)), bExists);
          if(!bExists) { m_sucId = "0"; }
        }
        elem.setValue(value);
        elem.setSelectId(Cairo.Util.val(m_sucId));
        elem.setHelpValueProcess(m_sucId);

        var elem = properties.add(null, mStockConstantes.LGJ_ID);
        elem.setType(Dialogs.PropertyType.select);
        elem.setTable(mStockConstantes.cSLEGAJO);
        //'Legajo
        elem.setName(Cairo.Language.getText(1575, ""));
        elem.setKey(K_LGJ_ID);
        value = m_legajo;
        if(m_lgj_id.Substring(0, 1).toUpperCase() == KEY_NODO) {
          value = GetNombreRama(mStockConstantes.cSLEGAJO, Cairo.Util.val(m_lgj_id.Substring(2)), bExists);
          if(!bExists) { m_lgj_id = "0"; }
        }
        elem.setValue(value);
        elem.setSelectId(Cairo.Util.val(m_lgj_id));
        elem.setHelpValueProcess(m_lgj_id);

        // empid
        var elem = properties.add(null, Cairo.Constants.EMP_ID);
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.EMPRESA);
        //'Empresa
        elem.setName(Cairo.Language.getText(1114, ""));
        elem.setKey(K_EMP_ID);
        value = m_empresa;
        if(m_empId.Substring(0, 1).toUpperCase() == KEY_NODO) {
          value = GetNombreRama(Cairo.Tables.EMPRESA, Cairo.Util.val(m_empId.Substring(2)), bExists);
          if(!bExists) { m_empId = "0"; }
        }
        elem.setValue(value);
        elem.setSelectId(Cairo.Util.val(m_empId));
        elem.setHelpValueProcess(m_empId);

        createMenu();
        if(!m_dialog.showDocumentList(self)) { return false; }

        return true;
      };

      var refreshCollection = function() {

        m_dialog.setTitle(m_name);

        var properties = m_dialog.getProperties();

        var elem = properties.item(C_FECHAINI);
        elem.setValue(m_fechaIniV);
        elem.setValue(m_fechaIni);

        var elem = properties.item(C_FECHAFIN);
        elem.setValue(m_fechaFinV);
        elem.setValue(m_fechaFin);

        var elem = properties.item(mStockConstantes.DOC_ID);
        elem.setValue(value);
        elem.setSelectId(Cairo.Util.val(m_docId));

        var elem = properties.item(mStockConstantes.SUC_ID);
        elem.setValue(value);
        elem.setSelectId(Cairo.Util.val(m_sucId));

        var elem = properties.item(mStockConstantes.LGJ_ID);
        elem.setValue(value);
        elem.setSelectId(Cairo.Util.val(m_lgj_id));

        var elem = properties.item(Cairo.Constants.EMP_ID);
        elem.setValue(value);
        elem.setSelectId(Cairo.Util.val(m_empId));

        return m_dialog.showValues(properties);
      };

      var load = function() {

        return DB.getData("load[" + m_apiPath + "general/ordenprodkitlistdoc]", id).then(
          function(response) {

            // empid
            m_empId = Cairo.Company.getId();
            m_empresa = Cairo.Company.getName();

            if(response.success !== true) { return false; }

            if(response.data.id === NO_ID) {

              m_fechaIniV = "";
              m_fechaIni = Cairo.Dates.today();
              m_fechaFinV = "";
              m_fechaFin = Cairo.Dates.DateNames.getDateByName('h-60');

              m_docId = NO_ID;
              m_documento = "";
              m_sucursal = "";
              m_legajo = "";

            }
            else {

              m_fechaIniV = valField(response.data, C.FROM);
              m_fechaIni = valField(response.data, C.FROM);
              m_fechaIni = isDate(m_fechaIni) ? getDateValue(m_fechaIni) : today();

              m_fechaFinV = valField(response.data, C.TO);
              m_fechaFin = valField(response.data, C.TO);
              m_fechaFin = isDate(m_fechaFin) ? getDateValue(m_fechaFin) : today();

              m_provId = valField(response.data, C.PROV_ID);
              m_estId = valField(response.data, C.EST_ID);
              m_ccosId = valField(response.data, C.CCOS_ID);
              m_sucId = valField(response.data, C.SUC_ID);
              m_docId = valField(response.data, C.DOC_ID);
              m_cpgId = valField(response.data, C.CPG_ID);
              m_empId = valField(response.data, C.EMP_ID);

              m_proveedor = valField(response.data, C.PROV_NAME);
              m_estado = valField(response.data, C.EST_NAME);
              m_centroCosto = valField(response.data, C.CCOS_NAME);
              m_sucursal = valField(response.data, C.SUC_NAME);
              m_documento = valField(response.data, C.DOC_NAME);
              m_condicionPago = valField(response.data, C.CPG_NAME);
              m_empresa = valField(response.data, C.EMP_NAME);

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

            if(iProp.getSelectIntValue() != "") {
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

            if(iProp.getSelectIntValue() != "") {
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

          case K_DOC_ID:
            var property = m_dialog.getProperties().item(mStockConstantes.DOC_ID);
            m_documento = property.getValue();
            m_docId = property.getSelectIntValue();

            break;

          case K_SUC_ID:
            var property = m_dialog.getProperties().item(mStockConstantes.SUC_ID);
            m_sucursal = property.getValue();
            m_sucId = property.getSelectIntValue();

            break;

          case K_LGJ_ID:
            var property = m_dialog.getProperties().item(mStockConstantes.LGJ_ID);
            m_legajo = property.getValue();
            m_lgj_id = property.getSelectIntValue();

            // empid
            break;

          case K_EMP_ID:
            var property = m_dialog.getProperties().item(Cairo.Constants.EMP_ID);
            m_empresa = property.getValue();
            m_empId = property.getSelectIntValue();
            break;
        }

        return true;
      };

      var cIABMListDocClient_Refresh = function() {
        var sqlstmt = null;

        sqlstmt = "sp_lsdoc_ParteProdKits ";

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

        sqlstmt = sqlstmt+ Cairo.Database.sqlString(m_docId)+ ",";
        sqlstmt = sqlstmt+ Cairo.Database.sqlString(m_sucId)+ ",";
        sqlstmt = sqlstmt+ Cairo.Database.sqlString(m_lgj_id)+ ",";
        sqlstmt = sqlstmt+ Cairo.Database.sqlString(m_empId);

        return sqlstmt;
      };

      var cIABMListDocClient_Save = function() {

        var strError = null;

        //'Error al grabar los parámetros de navegación de las Ordenes de Producción de Kit
        strError = Cairo.Language.getText(3728, "");

        var register = null;
        register = new cRegister();

        var sqlstmt = null;

        sqlstmt = "delete ListaDocumentoParametro  where pre_id = "+ csStockPrestacion.cSPRESTLISTORDENPRODKIT.toString()+ " and us_id = "+ m_us_id+ " and (emp_id is null or emp_id = "+ cUtil.getEmpId().toString()+ ")";

        if(!Cairo.Database.execute(sqlstmt, "cIABMClient_Save", C_MODULE, strError)) { return false; }

        register.setTable(Cairo.Constants.LISTADOCUMENTOPARAMETRO);
        register.setUtilizaIdentity(true);

        var property = null;
        var _count = m_dialog.getProperties().size();
        for (var _i = 0; _i < _count; _i++) {
          property = m_dialog.getProperties().item(_i);

          register.getFields().clear();

          switch (property.getKey()) {

            case K_FECHAINI:
              if(property.getSelectIntValue() != "") {
                register.getFields().add2(Cairo.Constants.LDP_VALOR, property.getSelectIntValue(), Cairo.Constants.Types.text);
              }
              else {
                register.getFields().add2(Cairo.Constants.LDP_VALOR, property.getValue(), Cairo.Constants.Types.text);
              }

              register.getFields().add2(Cairo.Constants.LDP_ORDEN, 10, Cairo.Constants.Types.integer);
              register.getFields().add2(Cairo.Constants.LDP_ID, K_FECHAINI, Cairo.Constants.Types.integer);
              break;

            case K_FECHAFIN:

              if(property.getSelectIntValue() != "") {
                register.getFields().add2(Cairo.Constants.LDP_VALOR, property.getSelectIntValue(), Cairo.Constants.Types.text);
              }
              else {
                register.getFields().add2(Cairo.Constants.LDP_VALOR, property.getValue(), Cairo.Constants.Types.text);
              }

              register.getFields().add2(Cairo.Constants.LDP_ORDEN, 20, Cairo.Constants.Types.integer);
              register.getFields().add2(Cairo.Constants.LDP_ID, K_FECHAFIN, Cairo.Constants.Types.integer);

              break;

            case K_DOC_ID:
              register.getFields().add2(Cairo.Constants.LDP_VALOR, property.getSelectIntValue(), Cairo.Constants.Types.text);
              register.getFields().add2(Cairo.Constants.LDP_ORDEN, 30, Cairo.Constants.Types.integer);
              register.getFields().add2(Cairo.Constants.LDP_ID, K_DOC_ID, Cairo.Constants.Types.integer);

              break;

            case K_SUC_ID:
              register.getFields().add2(Cairo.Constants.LDP_VALOR, property.getSelectIntValue(), Cairo.Constants.Types.text);
              register.getFields().add2(Cairo.Constants.LDP_ORDEN, 40, Cairo.Constants.Types.integer);
              register.getFields().add2(Cairo.Constants.LDP_ID, K_SUC_ID, Cairo.Constants.Types.integer);

              break;

            case K_LGJ_ID:
              register.getFields().add2(Cairo.Constants.LDP_VALOR, property.getSelectIntValue(), Cairo.Constants.Types.text);
              register.getFields().add2(Cairo.Constants.LDP_ORDEN, 50, Cairo.Constants.Types.integer);
              register.getFields().add2(Cairo.Constants.LDP_ID, K_LGJ_ID, Cairo.Constants.Types.integer);

              // empid
              break;

            case K_EMP_ID:
              register.getFields().add2(Cairo.Constants.LDP_VALOR, property.getSelectIntValue(), Cairo.Constants.Types.text);
              register.getFields().add2(Cairo.Constants.LDP_ORDEN, 100, Cairo.Constants.Types.integer);
              register.getFields().add2(Cairo.Constants.LDP_ID, K_EMP_ID, Cairo.Constants.Types.integer);

              break;
          }

          // empid
          register.getFields().add2(Cairo.Constants.EMP_ID, cUtil.getEmpId(), Cairo.Constants.Types.id);

          register.getFields().add2(Cairo.Constants.US_ID, m_us_id, Cairo.Constants.Types.id);
          register.getFields().add2(Cairo.Constants.PRE_ID, csStockPrestacion.cSPRESTLISTORDENPRODKIT, Cairo.Constants.Types.id);

          register.getFields().setHaveLastUpdate(false);
          register.getFields().setHaveWhoModify(false);
          if(!Cairo.Database.save(register, , "cIABMClient_Save", C_MODULE, strError)) { return false; }
        }

        if(!load(m_us_id)) { return false; }

        return true;
      };

      var cIABMListDocClient_Terminate = function() {
        return true;
      };

      self.getTitle = function() {
        return m_title;
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

      var initialize = function() {
        try {
          m_title = getText(1892, ""); // Facturas de Compras
          m_dialog.setHaveDetail(true);
          m_dialog.setStartRowText(4);
        }
        catch(ex) {
          Cairo.manageErrorEx(ex.message, ex, "initialize", C_MODULE, "");
        }
      };

      var initialize = function() {
        try {

          //' Ordenes de Producción de Kit
          m_title = Cairo.Language.getText(3722, "");

          m_properties = new cABMDocProperties();
          //Set .ImageList = fIcons.iList
          m_properties.setHaveDetail(true);
          m_properties.setStartRowText(4);

          var elem = m_properties.add(null, "TypeTask");
          elem.setName("TypeTask");
          elem.setCaption(" ");
          var elem = elem.add(null);
          elem.FormulaType = csConditionType.cSCONDTNONE;
          elem.IconIndex = C_IMG_TASK;
          elem.setWidth(500);
          elem.setSortType(csSortType.cSSRTTICON);

          var elem = m_properties.add(null, "Observaciones");
          elem.setName("Observaciones");
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
          m_listController = null;
        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, "destroy", C_MODULE, "");
        }
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

      var createMenu = function() {
        // **TODO:** on error resume next found !!!

        if(m_menuLoaded) { return; }

        m_menuLoaded = true;

        m_objList.ObjClientMenu = self;
        m_objList.ClearMenu;
        //'Agregar Nota
        m_menuAddNote = m_objList.AddMenu(Cairo.Language.getText(1645, ""));
        //'Ver Notas
        m_menuShowMensajes = m_objList.AddMenu(Cairo.Language.getText(1616, ""));
        //'Ver Documento Asociado
        m_menuShowDocAux = m_objList.AddMenu(Cairo.Language.getText(1691, ""));
      };

      var showNotes = function() {
        var fcId = m_dialog.getId();
        return DB.getData("load[" + m_apiPath + "modulexxxx/xxxx/notes]", fcId)
          .successWithResult(D.showNotes);
      };

      var addNote = function() {
        var xxId = m_dialog.getId();
        return D.addNote(D.Types.TYPEXXXX, xxId, false);
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