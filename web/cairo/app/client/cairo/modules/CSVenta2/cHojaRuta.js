(function() {
  "use strict";

  Cairo.module("Xxxx.Edit", function(Edit, Cairo, Backbone, Marionette, $, _) {

  });

  Cairo.module("XxxxListDoc.Edit", function(Edit, Cairo, Backbone, Marionette, $, _) {

    var createObject = function() {

      var self = {};

      var Dialogs = Cairo.Dialogs;

      // cHojaRutaListDoc
      // 15-12-2007

      var C_MODULE = "cHojaRutaListDoc";

      var C_FECHAINI = "FechaIni";
      var C_FECHAFIN = "FechaFin";

      var C_IMG_TASK = 1;

      var K_FECHADESDE = 1;
      var K_FECHAHASTA = 2;
      var K_NRODOC = 3;
      var K_PER_ID = 4;
      var K_CAM_ID = 5;

      // Seudo - Variables
      var c_strLoad = "";
      var c_ErrorSave = "";

      var m_fechaDesdeV = "";
      var m_fechaHastaV = "";

      var m_fechaDesde = null;
      var m_fechaHasta = null;

      var m_nrodoc = "";
      var m_per_id = "";
      var m_persona = "";
      var m_cam_id = "";
      var m_camion = "";

      var m_menuLoaded;

      var m_menuShowMensajes = 0;
      var m_menuAddMensaje = 0;

      //OJO HASTA ACA
      var m_dialog;
      var m_objList = null;

      var m_us_id = 0;

      var m_properties;
      // Properties publicas
      // Properties privadas
      self.processMenu = function(index) {
        try {

          switch (index) {

            case m_menuShowMensajes:
              pShowMensajes();

              break;

            case m_menuAddMensaje:
              pAddMensaje();

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

      //-------------------------------------------------------------------------------------
      // Interfaz cliente de List de documentos

      var getCIABMListDocClient_Aplication = function() {
        return Cairo.appName;
      };

      var cIABMListDocClient_DiscardChanges = function() {
        loadCollection();
      };

      var cIABMListDocClient_ListAdHock = function(list) {

      };

      var cIABMListDocClient_Load = function() {

      };

      var getCIABMListDocClient_Properties = function() {
        return m_properties;
      };

      var cIABMListDocClient_PropertyChange = function(key) {
        var iProp = null;

        switch (key) {

          case K_FECHADESDE:
            iProp = m_dialog.getProperties().item(C_FECHAINI);

            if(LenB(iProp.getSelectIntValue())) {
              m_fechaDesdeV = iProp.getSelectIntValue();
              m_fechaDesde = VDGetDateByName(m_fechaDesdeV);
            }
            else if(IsDate(iProp.getValue())) {
              m_fechaDesdeV = "";
              m_fechaDesde = iProp.getValue();
            }
            else {
              m_fechaDesdeV = "";
              iProp.setValue(m_fechaDesde);
            }

            break;

          case K_FECHAHASTA:

            iProp = m_dialog.getProperties().item(C_FECHAFIN);

            if(LenB(iProp.getSelectIntValue())) {
              m_fechaHastaV = iProp.getSelectIntValue();
              m_fechaHasta = VDGetDateByName(m_fechaHastaV);
            }
            else if(IsDate(iProp.getValue())) {
              m_fechaHastaV = "";
              m_fechaHasta = iProp.getValue();
            }
            else {
              m_fechaHastaV = "";
              iProp.setValue(m_fechaHasta);
            }

            break;

          case K_NRODOC:
            m_nrodoc = m_dialog.getProperties().item(mVentaConstantes.HR_NRODOC).getValue();

            break;
        }

        return true;
      };

      var cIABMListDocClient_Refresh = function() {
        var sqlstmt = null;

        pValidateFilters();

        sqlstmt = "sp_lsdoc_HojasRuta ";

        sqlstmt = sqlstmt+ Cairo.Database.getUserId().toString()+ ",";

        if(!cDate.getDateNames(m_fechaDesdeV) == null) {
          sqlstmt = sqlstmt+ Cairo.Database.sqlDate(VDGetDateByName(m_fechaDesdeV))+ ",";
        }
        else {
          sqlstmt = sqlstmt+ Cairo.Database.sqlDate(m_fechaDesde)+ ",";
        }

        if(!cDate.getDateNames(m_fechaHastaV) == null) {
          sqlstmt = sqlstmt+ Cairo.Database.sqlDate(VDGetDateByName(m_fechaHastaV))+ ",";
        }
        else {
          sqlstmt = sqlstmt+ Cairo.Database.sqlDate(m_fechaHasta)+ ",";
        }

        sqlstmt = sqlstmt+ Cairo.Database.sqlString(m_nrodoc)+ ",";
        sqlstmt = sqlstmt+ Cairo.Database.sqlString(m_per_id)+ ",";
        sqlstmt = sqlstmt+ Cairo.Database.sqlString(m_cam_id);

        return sqlstmt;
      };

      var pValidateFilters = function() {
        if(LenB(m_nrodoc)) { return; }
        if(LenB(m_per_id) && m_per_id != "0") { return; }
        if(LenB(m_cam_id) && m_cam_id != "0") { return; }

        var fdesde = null;
        var fhasta = null;

        if(!cDate.getDateNames(m_fechaDesdeV) == null) {
          fdesde = VDGetDateByName(m_fechaDesdeV);
        }
        else {
          fdesde = m_fechaDesde;
        }

        if(!cDate.getDateNames(m_fechaHastaV) == null) {
          fhasta = VDGetDateByName(m_fechaHastaV);
        }
        else {
          fhasta = m_fechaHasta;
        }

        if(DateDiff("m", fdesde, fhasta) <= 6) { return; }

        if(!Ask(Cairo.Language.getText(3664, ""), vbNo)) {
          m_per_id = -1;
        }

      };

      var cIABMListDocClient_Save = function() {
        var register = null;
        register = new cRegister();

        var sqlstmt = null;
        sqlstmt = "delete ListaDocumentoParametro  where pre_id = "+ csVentasPrestacion.cSPREVTALISTHOJARUTA.toString()+ " and us_id = "+ m_us_id;

        if(!Cairo.Database.execute(sqlstmt, "cIABMClient_Save", C_MODULE, c_ErrorSave)) { return false; }

        register.setTable(Cairo.Constants.LISTADOCUMENTOPARAMETRO);
        register.setUtilizaIdentity(true);

        var property = null;
        var _count = m_dialog.getProperties().size();
        for (var _i = 0; _i < _count; _i++) {
          property = m_dialog.getProperties().item(_i);

          register.getFields().clear();

          switch (property.getKey()) {

            case K_FECHADESDE:
              if(LenB(property.getSelectIntValue())) {
                register.getFields().add2(Cairo.Constants.LDP_VALOR, property.getSelectIntValue(), Cairo.Constants.Types.text);
              }
              else {
                register.getFields().add2(Cairo.Constants.LDP_VALOR, property.getValue(), Cairo.Constants.Types.text);
              }
              register.getFields().add2(Cairo.Constants.LDP_ORDEN, 10, Cairo.Constants.Types.integer);
              register.getFields().add2(Cairo.Constants.LDP_ID, K_FECHADESDE, Cairo.Constants.Types.integer);
              break;

            case K_FECHAHASTA:
              if(LenB(property.getSelectIntValue())) {
                register.getFields().add2(Cairo.Constants.LDP_VALOR, property.getSelectIntValue(), Cairo.Constants.Types.text);
              }
              else {
                register.getFields().add2(Cairo.Constants.LDP_VALOR, property.getValue(), Cairo.Constants.Types.text);
              }
              register.getFields().add2(Cairo.Constants.LDP_ORDEN, 20, Cairo.Constants.Types.integer);
              register.getFields().add2(Cairo.Constants.LDP_ID, K_FECHAHASTA, Cairo.Constants.Types.integer);

              break;

            case K_NRODOC:
              register.getFields().add2(Cairo.Constants.LDP_VALOR, property.getValue(), Cairo.Constants.Types.text);
              register.getFields().add2(Cairo.Constants.LDP_ORDEN, 30, Cairo.Constants.Types.integer);
              register.getFields().add2(Cairo.Constants.LDP_ID, K_NRODOC, Cairo.Constants.Types.integer);

              break;

            case K_PER_ID:
              register.getFields().add2(Cairo.Constants.LDP_VALOR, property.getSelectIntValue(), Cairo.Constants.Types.text);
              register.getFields().add2(Cairo.Constants.LDP_ORDEN, 40, Cairo.Constants.Types.integer);
              register.getFields().add2(Cairo.Constants.LDP_ID, K_PER_ID, Cairo.Constants.Types.integer);

              break;

            case K_CAM_ID:
              register.getFields().add2(Cairo.Constants.LDP_VALOR, property.getSelectIntValue(), Cairo.Constants.Types.text);
              register.getFields().add2(Cairo.Constants.LDP_ORDEN, 50, Cairo.Constants.Types.integer);
              register.getFields().add2(Cairo.Constants.LDP_ID, K_CAM_ID, Cairo.Constants.Types.integer);

              break;
          }

          register.getFields().add2(Cairo.Constants.US_ID, m_us_id, Cairo.Constants.Types.id);
          register.getFields().add2(Cairo.Constants.PRE_ID, csVentasPrestacion.cSPREVTALISTHOJARUTA, Cairo.Constants.Types.id);

          register.getFields().setHaveLastUpdate(false);
          register.getFields().setHaveLastUpdate(false);
          if(!Cairo.Database.save(register, , "cIABMClient_Save", C_MODULE, c_ErrorSave)) { return false; }
        }
        if(!load(m_us_id)) { return false; }

        return true;
      };

      var cIABMListDocClient_Terminate = function() {
        return true;
      };

      var getCIABMListDocClient_Title = function() {
        //'Hojas de Ruta
        return Cairo.Language.getText(3746, "");
      };

      var cIABMListDocClient_Validate = function() {
        return true;
      };

      // funciones privadas
      var loadCollection = function() {
        var c = null;
        var o = null;
        var value = null;
        var bExists = null;

        m_dialog.getProperties().clear();

        c = m_dialog.getProperties().add(null, C_FECHAINI);
        c.setType(Dialogs.PropertyType.date);
        //'Fecha Desde
        c.setName(Cairo.Language.getText(1203, ""));
        c.setKey(K_FECHADESDE);
        if(LenB(m_fechaDesdeV)) {
          c.setValue(m_fechaDesdeV);
        }
        else {
          c.setValue(m_fechaDesde);
        }

        c = m_dialog.getProperties().add(null, C_FECHAFIN);
        c.setType(Dialogs.PropertyType.date);
        //'Fecha Hasta
        c.setName(Cairo.Language.getText(1204, ""));
        c.setKey(K_FECHAHASTA);
        if(LenB(m_fechaHastaV)) {
          c.setValue(m_fechaHastaV);
        }
        else {
          c.setValue(m_fechaHasta);
        }

        c = m_dialog.getProperties().add(null, mVentaConstantes.HR_NRODOC);
        c.setType(Dialogs.PropertyType.text);
        //'Numero
        c.setName(Cairo.Language.getText(1065, ""));
        c.setSize(255);
        c.setKey(K_NRODOC);
        c.setValue(m_nrodoc);

        c = m_dialog.getProperties().add(null, mVentaConstantes.PRS_ID);
        c.setType(Dialogs.PropertyType.select);
        c.setTable(Cairo.Tables.PERSONA);
        //'Responsable
        c.setName(Cairo.Language.getText(1822, ""));
        c.setKey(K_PER_ID);
        value = m_persona;
        if(m_per_id.Substring(0, 1).toUpperCase() == KEY_NODO) {
          value = GetNombreRama(Cairo.Tables.PERSONA, Cairo.Util.val(m_per_id.Substring(2)), bExists);
          if(!bExists) { m_per_id = "0"; }
        }
        c.setValue(value);
        c.setSelectId(Cairo.Util.val(m_per_id));
        c.setHelpValueProcess(m_per_id);

        c = m_dialog.getProperties().add(null, mVentaConstantes.CAM_ID);
        c.setType(Dialogs.PropertyType.select);
        c.setTable(Cairo.Tables.CAMION);
        //'Camion
        c.setName(Cairo.Language.getText(3489, ""));
        c.setKey(K_CAM_ID);
        value = m_camion;
        if(m_cam_id.Substring(0, 1).toUpperCase() == KEY_NODO) {
          value = GetNombreRama(Cairo.Tables.CAMION, Cairo.Util.val(m_cam_id.Substring(2)), bExists);
          if(!bExists) { m_cam_id = "0"; }
        }
        c.setValue(value);
        c.setSelectId(Cairo.Util.val(m_cam_id));
        c.setHelpValueProcess(m_cam_id);

        pCreateMenu();
        if(!m_dialog.show(self, m_objList)) { return false; }

        return true;
      };

      var refreshCollection = function() {

        m_dialog.setTitle(m_name);

        var properties = m_dialog.getProperties();

        return m_dialog.showValues(properties);
      };

      var load = function(us_id) {

        var apiPath = Cairo.Database.getAPIVersion();
        return Cairo.Database.getData("load[" + apiPath + "general/hojarutalistdoc]", id).then(
          function(response) {

            if(response.success !== true) { return false; }

            if(response.data.id === Cairo.Constants.NO_ID) {

              m_fechaDesde = Date;
              m_fechaHasta = Date;
              m_fechaDesdeV = "";
              m_fechaHastaV = "";
              m_nrodoc = "";
              m_per_id = "";
              m_persona = "";
              m_cam_id = "";
              m_camion = "";

            }
            else {

              rs.MoveLast;
              rs.MoveFirst;

              var i = null;
              while (!rs.isEOF()) {

                switch (Cairo.Database.valField(response.data, Cairo.Constants.LDP_ID)) {

                  case K_FECHADESDE:
                    m_fechaDesdeV = Cairo.Database.valField(response.data, Cairo.Constants.LDP_VALOR);
                    m_fechaDesde = IsDate(Cairo.Database.valField(response.data, Cairo.Constants.LDP_VALOR)) ? Cairo.Database.valField(response.data, Cairo.Constants.LDP_VALOR) : Date);
                    break;

                  case K_FECHAHASTA:
                    m_fechaHastaV = Cairo.Database.valField(response.data, Cairo.Constants.LDP_VALOR);
                    m_fechaHasta = IsDate(Cairo.Database.valField(response.data, Cairo.Constants.LDP_VALOR)) ? Cairo.Database.valField(response.data, Cairo.Constants.LDP_VALOR) : Date);
                    break;

                  case K_NRODOC:
                    m_nrodoc = Cairo.Database.valField(response.data, Cairo.Constants.LDP_VALOR);
                    break;

                  case K_PER_ID:
                    m_per_id = Cairo.Database.valField(response.data, Cairo.Constants.LDP_VALOR);
                    break;

                  case K_CAM_ID:
                    m_cam_id = Cairo.Database.valField(response.data, Cairo.Constants.LDP_VALOR);

                    break;
                }

                rs.MoveNext;
              }

              var data = null;

              if(m_per_id.Substring(0, 1).toUpperCase() != KEY_NODO) {
                if(!Cairo.Database.getData(mVentaConstantes.PERSONA, mVentaConstantes.PRS_ID, Cairo.Util.val(m_per_id), mVentaConstantes.PRS_NAME, data, C_LoadFunction, C_MODULE, c_strLoad)) { return false; }
                m_persona = data;
              }

              if(m_cam_id.Substring(0, 1).toUpperCase() != KEY_NODO) {
                if(!Cairo.Database.getData(mVentaConstantes.CAMION, mVentaConstantes.CAM_ID, Cairo.Util.val(m_cam_id), mVentaConstantes.CAM_PATENTE, data, C_LoadFunction, C_MODULE, c_strLoad)) { return false; }
                m_camion = data;
              }

            }

            return true;
          });

      };

      //-------------------------------------------------------------------------------------
      var cIEditGenericListDoc_GridAdd = function(clavePropiedad) {

      };

      var cIEditGenericListDoc_GridEdit = function(clavePropiedad) {

      };

      var cIEditGenericListDoc_GridRemove = function(clavePropiedad) {

      };

      var setCIEditGenericListDoc_ObjABM = function(rhs) {
        m_dialog = rhs;
      };

      var cIEditGenericListDoc_ShowParams = function(us_id) {
        var _rtn = null;
        try {

          if(us_id == Cairo.Constants.NO_ID) { return _rtn; }

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

      var setCIEditGenericListDoc_ObjList = function(rhs) {
        m_objList = rhs;
      };

      var cIEditGenericListDoc_PropertyChange = function(key) {

      };

      var cIEditGenericListDoc_TabClick = function(index) {

      };

      var pCreateMenu = function() {
        // **TODO:** on error resume next found !!!

        if(m_menuLoaded) { return; }

        m_menuLoaded = true;

        m_objList.ObjClientMenu = self;
        m_objList.ClearMenu;
        //'Agregar Nota
        m_menuAddMensaje = m_objList.AddMenu(Cairo.Language.getText(1615, ""));
        //'Ver Notas
        m_menuShowMensajes = m_objList.AddMenu(Cairo.Language.getText(1616, ""));
      };

      var pShowMensajes = function() {
        var sqlstmt = null;
        var lqdId = null;
        var rs = null;

        lqdId = m_objList.id;

        sqlstmt = "sp_ParteDiarioGetTitleForDoc "+ csETablesVentas.cSHOJARUTA.toString()+ ","+ lqdId.toString();

        if(!Cairo.Database.openRs(sqlstmt, rs)) { return; }

        if(rs.isEOF()) { return; }

        var infodoc = null;
        var doctId = null;

        doctId = csETablesVentas.cSHOJARUTA;
        infodoc = Cairo.Database.valField(rs.getFields(), "info_doc");

        sqlstmt = "sp_PartesDiarioGetForDoc "+ Cairo.Database.getUserId().toString()+ ","+ cUtil.getEmpId().toString()+ ","+ doctId.toString()+ ","+ lqdId.toString();
        ShowNotes(Cairo.Language.getText(3751, "", infodoc), sqlstmt);
        //Notas sobre Hojas de Ruta & infodoc
      };

      var pAddMensaje = function() {
        var parte = null;
        parte = CSKernelClient2.CreateObject("CSEnvio2.cParteDiario");

        parte.AddParteToDoc(csETablesVentas.cSHOJARUTA, m_objList.id, false);
      };

      var pGetLqdIds = function() {
        return m_objList.SelectedItems;
      };

      self.initialize = function() {
        try {

          c_strLoad = Cairo.Language.getText(3754, "");
          //Error al cargar los parámetros de navegación de hojas de ruta
          c_ErrorSave = Cairo.Language.getText(3755, "");
          //Error al grabar los párametros de navegación de hojas de ruta

          m_properties = new cABMDocProperties();
          //Set .ImageList = fIcons.ilList
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
          m_objList = null;
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