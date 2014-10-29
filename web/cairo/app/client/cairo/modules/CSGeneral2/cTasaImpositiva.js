(function() {
  "use strict";

  Cairo.module("TasaImpositiva.Edit", function(Edit, Cairo, Backbone, Marionette, $, _) {

    var createObject = function() {

      var self = {};

      var Dialogs = Cairo.Entities.Dialogs;

      // cTasaImpositiva
      // 31-07-00

      var C_MODULE = "cTasaImpositiva";

      Cairo.Constants.csE_TasaImpositivaTipo = {
        CSTI_VENTAS: 1,
        CSTI_COMPRAS: 2
      };      
      
      var K_NOMBRE = 1;
      var K_CODIGO = 2;
      var K_ACTIVO = 3;
      var K_PORCENTAJE = 4;
      var K_CODIGODGI1 = 5;
      var K_CODIGODGI2 = 6;
      var K_CUE_ID = 7;
      var K_TIPO = 8;

      var m_id = 0;
      var m_nombre = "";
      var m_codigo = "";
      var m_activo;
      var m_porcentaje = 0;
      var m_codigoDGI1 = "";
      var m_codigoDGI2 = "";
      var m_cuenta = "";
      var m_cue_id = 0;
      var m_tipo = 0;

      var m_editing;

      var m_dialog;
      var m_objTree = null;

      var m_isNew;

      var m_branchId = 0;
      var m_treeId = 0;

      var m_host;

      var m_copy;

      self.getId = function() {
        return m_id;
      };
      self.setId = function(rhs) {
        m_id = rhs;
      };
      self.getName = function() {
        return m_nombre;
      };
      self.setNombre = function(rhs) {
        m_nombre = rhs;
      };
      self.getCode = function() {
        return m_codigo;
      };
      self.setCodigo = function(rhs) {
        m_codigo = rhs;
      };

      self.data = function(id,  field) {
        var rtn = null;

        if(!Cairo.Database.getData(Cairo.General.Constants.TASAIMPOSITIVA, Cairo.General.Constants.TIID, id, field, rtn, "Data", C_MODULE)) { return null; }
        return rtn;
      };

      self.copy = function() {

        self.terminate();
        m_isNew = true;

        var property = m_dialog.getProperties().item(Cairo.General.Constants.TICODIGO);
        property.setValue(Cairo.Constants.COPY_OF + property.getValue());

        m_dialog.showValue(m_dialog.getProperties().item(Cairo.General.Constants.TICODIGO));
        m_dialog.showValue(m_dialog.getProperties().item(Cairo.General.Constants.TINOMBRE));

        m_copy = true;
      };

      self.editNew = function() {

        self.terminate();
        m_isNew = true;

        return self.edit(Cairo.Constants.NO_ID);
      };

      self.getApplication = function() {
        return Cairo.appName;
      };

      self.editDocumentsEnabled = function() {
        return m_id != Cairo.Constants.NO_ID;
      };

      self.copyEnabled = function() {
        return true;
      };

      self.addEnabled = function() {
        return true;
      };

      self.showDocDigital = function() {
        var _rtn = null;
        try {

          if(m_id == Cairo.Constants.NO_ID) { return _rtn; }

          var doc = new cDocDigital();

          doc.setClientTable(Cairo.General.Constants.TASAIMPOSITIVA);
          doc.setClientTableID(m_id);

          _rtn = doc.showDocs(Cairo.Database);

        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, Cairo.Constants.SHOW_DOCUMENTS_FUNCTION, C_MODULE, "");
        }

        return _rtn;
      };

      self.messageEx = function(messageID,  info) {
        var _rtn = null;
        switch (messageID) {

          case Dialogs.Message.MSG_DOC_INFO:

            Cairo.Documentation.show("", "", Cairo.Security.Actions.General.NEW_TasaImpositiva);
            _rtn = Dialogs.Message.MSG_DOC_INFO_HANDLED;
            break;

          default:
            _rtn = true;
            break;
        }

        return Cairo.Promises.resolvedPromise(_rtn);
      };

      self.discardChanges = function() {
        return Cairo.Promises.resolvedPromise(loadCollection());
      };

      self.propertyChange = function(key) {

      };

      self.save = function() {

        var register = new Cairo.Database.Register();
        var fields = register.getFields();

        register.setFieldId(Cairo.General.Constants.TIID);
        register.setTable(Cairo.General.Constants.TASAIMPOSITIVA);

        if(m_copy) {
          register.setID(csConstIds.cSNEW);
        }
        else {
          register.setID(m_id);
        }

        var _count = m_dialog.getProperties().size();
        for (var _i = 0; _i < _count; _i++) {
          var property = m_dialog.getProperties().item(_i);
          switch (property.getKey()) {
            case K_NOMBRE:
              fields.add(Cairo.General.Constants.TINOMBRE, property.getValue(), Cairo.Constants.Types.TEXT);
              break;

            case K_CODIGO:
              fields.add(Cairo.General.Constants.TICODIGO, property.getValue(), Cairo.Constants.Types.TEXT);
              break;

            case K_ACTIVO:
              fields.add(Cairo.Constants.ACTIVE, Cairo.Util.val(property.getValue()), Cairo.Constants.Types.BOOLEAN);
              break;

            case K_PORCENTAJE:
              fields.add(Cairo.General.Constants.TIPORCENTAJE, property.getValue(), Cairo.Constants.Types.CURRENCY);
              break;

            case K_CODIGODGI1:
              fields.add(Cairo.General.Constants.TICODIGODGI1, property.getValue(), Cairo.Constants.Types.TEXT);
              break;

            case K_CODIGODGI2:
              fields.add(Cairo.General.Constants.TICODIGODGI2, property.getValue(), Cairo.Constants.Types.TEXT);
              break;

            case K_CUE_ID:
              fields.add(Cairo.General.Constants.CUEID, property.getSelectId(), Cairo.Constants.Types.TEXT);
              break;

            case K_TIPO:
              fields.add(Cairo.General.Constants.TITIPO, property.getListItemData(), Cairo.Constants.Types.INTEGER);
              break;
          }
        }

        fields.setHaveLastUpdate(true);
        fields.setHaveWhoModify(true);

        // Error saving Tasas Impositivas
        return Cairo.Database.saveEx(
            register,
            false,
            Cairo.General.Constants.TICODIGO,
            Cairo.Constants.CLIENT_SAVE_FUNCTION,
            C_MODULE,
            Cairo.Language.getText(1481, "")).then(

          function(result) {
            if(result) {
              m_copy = false;
              return load(register.getID());

            }
            else {
              return false;
            }
          });
      };

      self.terminate = function() {
        var _rtn = null;
        m_editing = false;

        _rtn = true;
        try {
          if(m_id == Cairo.Constants.NO_ID) { return _rtn; }
          if(m_objTree == null) { return _rtn; }

          if(m_isNew) {
            m_objTree.addLeave(m_id, m_branchId, m_treeId);
          }
          else {
            m_objTree.addEditedId(m_id);
            m_objTree.refreshActiveBranch();
          }
        }
        catch (ex) {
        }

        return _rtn;
      };

      self.title = function() {
        //'Tasas Impositivas
        return Cairo.Language.getText(1482, "");
      };

      self.validate = function() {
        var property = null;

        var _count = m_dialog.getProperties().size();
        for (var _i = 0; _i < _count; _i++) {
          property = m_dialog.getProperties().item(_i);
          switch (property.getKey()) {
            case K_NOMBRE:
              if(Cairo.Util.valEmpty(property.getValue(), Cairo.Constants.Types.TEXT)) {
                return Cairo.Modal.showInfo(Cairo.Constants.MUST_SET_A_NAME).then(function() {return false;});
              }
              break;

            case K_CODIGO:
              if(Cairo.Util.valEmpty(property.getValue(), Cairo.Constants.Types.TEXT)) {
                property.setValue(Cairo.Constants.GET_CODE_FROM_ID);
              }
              break;

            case K_CUE_ID:
              if(Cairo.Util.valEmpty(property.getSelectId(), Cairo.Constants.Types.ID)) {
                return Cairo.Modal.showInfo(Cairo.Language.getText(1261, "")).then(function() {return false;});
                //Debe indicar una cuenta
              }

              break;

            case K_PORCENTAJE:
              if(!IsNumeric(property.getValue())) {
                return Cairo.Modal.showInfo(Cairo.Language.getText(1484, "")).then(function() {return false;});
                //El porcentaje debe ser un número de -200.00 a 200.00
              }
              if(property.getValue() < -200 || property.getValue() > 200) {
                return Cairo.Modal.showInfo(Cairo.Language.getText(1483, "")).then(function() {return false;});
                //El porcentaje esta fuera del rango permitido (-200.00 a 200.00)
              }

              break;
          }
        }

        return Cairo.Promises.resolvedPromise(true);
      };

      self.getDialog = function() {
        return m_dialog;
      };

      self.setTreeId = function(rhs) {
        m_treeId = rhs;
      };

      self.getTreeId = function() {
        return m_treeId;
      };

      self.list = function() {
        return Cairo.Security.hasPermissionTo(Cairo.Security.Actions.General.LIST_TasaImpositiva);
      };

      self.setDialog = function(rhs) {
        m_dialog = rhs;
      };

      self.isEditing = function() {
        return m_editing;
      };

      self.delete = function(id) {
        if(!Cairo.Security.hasPermissionTo(Cairo.Security.Actions.General.DELETE_TasaImpositiva)) {
          return Cairo.Promises.resolvedPromise(false);
        }

        return Cairo.Database.execute(Cairo.Constants.DELETE_FUNCTION, C_MODULE);
      };

      self.edit = function(id,  inModalWindow) {
        var p = Cairo.Promises.resolvedPromise(false);
        try {

          if(id == Cairo.Constants.NO_ID) {
            m_isNew = true;
            if(!Cairo.Security.hasPermissionTo(Cairo.Security.Actions.General.NEW_TasaImpositiva)) { return p; }
          }
          else {
            m_isNew = false;
            if(!Cairo.Security.hasPermissionTo(Cairo.Security.Actions.General.EDIT_TasaImpositiva)) { return p; }
          }

          m_dialog.setInModalWindow(inModalWindow);

          p = load(id).then(
            function(success) {
              if(success) {

                if(!loadCollection()) { return false; }

                m_editing = true;
                m_copy = false;

                if(inModalWindow) {
                  success = m_id != Cairo.Constants.NO_ID;
                }
                else {
                  success = true;
                }

              }
              return success;
            });
        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, C_EditGenericEdit, C_MODULE, "");
        }

        return p;
      };

      self.setTree = function(rhs) {
        m_objTree = rhs;
      };

      self.setBranchId = function(rhs) {
        m_branchId = rhs;
      };

      self.getBranchId = function() {
        return m_branchId;
      };

      var loadCollection = function() {

        m_dialog.setTitle(m_nombre);

        var properties = m_dialog.getProperties();

        properties.clear();

        var elem = properties.add(null, Cairo.General.Constants.TINOMBRE);
        elem.setType(Dialogs.PropertyType.text);
        elem.setName(Cairo.Constants.NAME_LABEL);
        elem.setSize(100);
        elem.setWidth(4500);
        elem.setKey(K_NOMBRE);
        elem.setValue(m_nombre);

        var elem = properties.add(null, Cairo.General.Constants.TICODIGO);
        elem.setType(Dialogs.PropertyType.text);
        elem.setName(Cairo.Constants.CODE_LABEL);
        elem.setSize(15);
        elem.setValue(m_codigo);
        elem.setKey(K_CODIGO);

        var elem = properties.add(null, Cairo.Constants.ACTIVE);
        elem.setType(Dialogs.PropertyType.check);
        elem.setName(Cairo.Constants.ACTIVE_LABEL);
        elem.setTopFromProperty(Cairo.General.Constants.TICODIGO);
        elem.setTopNotChange(true);
        elem.setLeft(5200);
        elem.setLeftNotChange(true);
        elem.setLeftLabel(-700);
        elem.setKey(K_ACTIVO);
        elem.setValue(m_activo === true ? 1 : 0);

        var elem = properties.add(null, Cairo.General.Constants.TIPORCENTAJE);
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setSubType(Dialogs.PropertySubType.Percent);
        //'Porcentaje
        elem.setName(Cairo.Language.getText(1105, ""));
        elem.setKey(K_PORCENTAJE);
        elem.setWidth(1000);
        elem.setValue(m_porcentaje);

        var elem = properties.add(null, Cairo.General.Constants.CUECID);
        elem.setType(Dialogs.PropertyType.select);
        elem.setTable(Cairo.Tables.CUENTA);
        //'Cuenta
        elem.setName(Cairo.Language.getText(1267, ""));
        elem.setKey(K_CUE_ID);
        elem.setValue(m_cuenta);
        elem.setSelectId(m_cue_id);

        var elem = properties.add(null, Cairo.General.Constants.TICODIGODGI1);
        elem.setType(Dialogs.PropertyType.text);
        //'Código DGI 1
        elem.setName(Cairo.Language.getText(1486, ""));
        elem.setSize(5);
        elem.setWidth(1500);
        elem.setKey(K_CODIGODGI1);
        elem.setValue(m_codigoDGI1);

        var elem = properties.add(null, Cairo.General.Constants.TICODIGODGI2);
        elem.setType(Dialogs.PropertyType.text);
        //'Código DGI 2
        elem.setName(Cairo.Language.getText(1487, ""));
        elem.setTopFromProperty(Cairo.General.Constants.TICODIGODGI1);
        elem.setTopNotChange(true);
        elem.setLeft(4500);
        elem.setLeftNotChange(true);
        elem.setSize(5);
        elem.setWidth(1500);
        elem.setKey(K_CODIGODGI2);
        elem.setValue(m_codigoDGI2);

        var elem = properties.add(null, Cairo.General.Constants.TITIPO);
        elem.setType(Dialogs.PropertyType.list);
        //'Tipo
        elem.setName(Cairo.Language.getText(1223, ""));
        elem.setSize(5);
        elem.setKey(K_TIPO);
        elem.setListWhoSetItem(csListItemData);
        elem.setListItemData(m_tipo);

        var w_list = elem.getList();
        var elem = w_list.add(null, Cairo.Constants.csE_TasaImpositivaTipo.CSTI_VENTAS);
        elem.Id = Cairo.Constants.csE_TasaImpositivaTipo.CSTI_VENTAS;
        //'Ventas
        elem.setValue(Cairo.Language.getText(1488, ""));

        var elem = w_list.add(null, Cairo.Constants.csE_TasaImpositivaTipo.CSTI_COMPRAS);
        elem.Id = Cairo.Constants.csE_TasaImpositivaTipo.CSTI_COMPRAS;
        //'Compras
        elem.setValue(Cairo.Language.getText(1489, ""));

        if(!m_dialog.show(this)) { return false; }

        return true;
      };

      var load = function(id) {

        return Cairo.Database.getData("load[cTasaImpositiva]", id).then(
          function(response) {

            if(response.success === false) { return false; }

            if(response.data.length === 0) {
              m_activo = true;
              m_nombre = "";
              m_codigo = "";
              m_id = Cairo.Constants.NO_ID;
              m_porcentaje = 0;
              m_codigoDGI1 = "";
              m_codigoDGI2 = "";
              m_cue_id = 0;
              m_cuenta = "";
              m_tipo = Cairo.Constants.csE_TasaImpositivaTipo.cSTI_VENTAS;
            }
            else {
              m_activo = Cairo.Database.valField(response.data, Cairo.Constants.ACTIVE);
              m_nombre = Cairo.Database.valField(response.data, Cairo.General.Constants.TINOMBRE);
              m_codigo = Cairo.Database.valField(response.data, Cairo.General.Constants.TICODIGO);
              m_id = Cairo.Database.valField(response.data, Cairo.General.Constants.TIID);
              m_porcentaje = Cairo.Database.valField(response.data, Cairo.General.Constants.TIPORCENTAJE);
              m_codigoDGI1 = Cairo.Database.valField(response.data, Cairo.General.Constants.TICODIGODGI1);
              m_codigoDGI2 = Cairo.Database.valField(response.data, Cairo.General.Constants.TICODIGODGI2);
              m_cue_id = Cairo.Database.valField(response.data, Cairo.General.Constants.CUEID);
              m_cuenta = Cairo.Database.valField(response.data, Cairo.General.Constants.CUENOMBRE);
              m_tipo = Cairo.Database.valField(response.data, Cairo.General.Constants.TITIPO);
            }
            return true;
          });
      };

      self.destroy = function() {
        m_dialog = null;
        m_objTree = null;
      };

      return self;
    };

    Edit.Controller = createObject();

  });

  Cairo.module("TasaImpositiva.List", function(List, Cairo, Backbone, Marionette, $, _) {
    List.Controller = {
      list: function() {

        var self = this;

        /*
         this function will be called by the tab manager every time the
         view must be created. when the tab is not visible the tab manager
         will not call this function but only make the tab visible
         */
        var createTreeDialog = function(tabId) {

          // ListController properties and methods
          //
          self.entityInfo = new Backbone.Model({
            entitiesTitle: "TasaImpositivas",
            entityName: "tasaimpositiva",
            entitiesName: "tasaimpositivas"
          });

          self.showBranch = function(branchId) {
            Cairo.log("Loading nodeId: " + branchId);
            Cairo.Tree.List.Controller.listBranch(branchId, Cairo.Tree.List.Controller.showItems, self);
          };

          // progress message
          //
          Cairo.LoadingMessage.show("TasaImpositivas", "Loading tasaimpositiva from Crowsoft Cairo server.");

          // create the tree region
          //
          Cairo.addRegions({ tasaimpositivaTreeRegion: tabId });

          // create the dialog
          //
          Cairo.Tree.List.Controller.list(
            Cairo.Tables.TASAIMPOSITIVA,
            new Cairo.Tree.List.TreeLayout({ model: self.entityInfo }),
            Cairo.tasaimpositivaTreeRegion,
            self);

        };

        // create the tab
        //
        Cairo.mainTab.showTab("TasaImpositivas", "tasaimpositivaTreeRegion", "#general/tasaimpositivas", createTreeDialog);

      }
    };
  });


}());
