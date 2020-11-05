(function() {
  "use strict";

  Cairo.module("Talonario.Edit", function(Edit, Cairo, Backbone, Marionette, $, _) {

    var createObject = function() {

      var self = {};

      var getText = Cairo.Language.getText;

      var Dialogs = Cairo.Dialogs;
      var DB = Cairo.Database;
      var C = Cairo.General.Constants;
      var NO_ID = Cairo.Constants.NO_ID;
      var Types = Cairo.Constants.Types;

      var C_MODULE = "cTalonario";

      var K_NAME = 1;
      var K_CODE = 2;
      var K_DESCRIP = 3;
      var K_ULTIMONRO = 4;
      var K_TIPO = 5;
      var K_MASCARA = 6;
      var K_CAI = 7;
      var K_ACTIVE = 8;
      var K_EMP_ID = 9;
      var K_PTO_VTA = 10;
      var K_TIPO_AFIP = 11;

      var m_id = 0;
      var m_name = "";
      var m_code = "";
      var m_descrip = "";
      var m_ultimonro = 0;
      var m_tipo = 0;
      var m_mascara = "";
      var m_tipoAFIP = 0;
      var m_ptoVta = 0;
      var m_creado = null;
      var m_modificado = null;
      var m_modifico = 0;
      var m_active;
      var m_cai = "";
      var m_emp_id = 0;
      var m_empresa = "";

      var m_editing;

      var m_dialog;
      var m_listController = null;

      var m_isNew;

      var m_branchId = 0;
      var m_treeId = 0;

      var m_copy;

      var m_apiPath = Cairo.Database.getAPIVersion();

      self.getId = function() {
        return m_id;
      };

      self.getName = function() {
        return m_name;
      };

      self.getCode = function() {
        return m_code;
      };

      self.copy = function() {

        updateList();

        m_isNew = true;

        m_listController.updateEditorKey(self, Cairo.Constants.NO_ID);

        var property = m_dialog.getProperties().item(C.TA_CODE);
        property.setValue("C-"+ property.getValue());

        m_dialog.showValue(m_dialog.getProperties().item(C.TA_CODE));
        m_dialog.showValue(m_dialog.getProperties().item(C.TA_NAME));

        m_copy = true;
      };

      self.editNew = function() {

        updateList();

        m_isNew = true;

        m_listController.updateEditorKey(self, Cairo.Constants.NO_ID);

        return load(Cairo.Constants.NO_ID).then(
          function(ignored) {
            return refreshCollection();
          }
        );
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

          var doc = new Cairo.DocDigital();

          doc.setClientTable(C.TALONARIO);
          doc.setClientTableID(m_id);

          _rtn = doc.showDocs(Cairo.Database);

        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, "cIABMClient_ShowDocDigital", C_MODULE, "");
        }

        return _rtn;
      };

      self.messageEx = function(messageID,  info) {
        return true;
      };

      self.discardChanges = function() {
        return Cairo.Promises.resolvedPromise(refreshCollection());
      };

      self.propertyChange = function(key) {

        return Cairo.Promises.resolvedPromise(false);
      };

      self.save = function() {

        var register = new Cairo.Database.Register();
        var fields = register.getFields();
        
        register.setFieldId(C.TA_ID);
        register.setTable(C.TALONARIO);

        register.setPath(m_apiPath + "general/talonario");

        if(m_copy) {
          register.setId(Cairo.Constants.NEW_ID);
        }
        else {
          register.setId(m_id);
        }

        var _count = m_dialog.getProperties().size();
        for (var _i = 0; _i < _count; _i++) {
          var property = m_dialog.getProperties().item(_i);
          switch (property.getKey()) {
            case K_NAME:
              fields.add(C.TA_NAME, property.getValue(), Types.text);
              break;

            case K_CODE:
              fields.add(C.TA_CODE, property.getValue(), Types.text);
              break;

            case K_DESCRIP:
              fields.add(C.TA_DESCRIP, property.getValue(), Types.text);
              break;

            case K_ULTIMONRO:
              fields.add(C.TA_ULTIMO_NRO, property.getValue(), Types.long);
              break;

            case K_TIPO:
              fields.add(C.TA_TIPO, property.getListItemData(), Types.integer);
              break;

            case K_MASCARA:
              fields.add(C.TA_MASCARA, property.getValue(), Types.text);
              break;

            case K_ACTIVE:
              fields.add(Cairo.Constants.ACTIVE, property.getValue(), Types.boolean);
              break;

            case K_CAI:
              fields.add(C.TA_CAI, property.getValue(), Types.text);
              break;

            case K_EMP_ID:
              fields.add(Cairo.Constants.EMP_ID, property.getSelectId(), Types.id);
              break;

            case K_PTO_VTA:
              fields.add(C.TA_PTO_VTA, property.getValue(), Types.integer);
              break;

            case K_TIPO_AFIP:
              fields.add(C.TA_TIPO_AFIP, property.getValue(), Types.integer);
              break;
          }
        }

        if(!Cairo.Database.save(register, , "cIABMClient_Save", C_MODULE, c_ErrorSave)) { return false; }

        m_copy = false;
        return load(result.data.getId()).then(
          function (success) {
            if(success) {
              updateList();
              m_listController.updateEditorKey(self, m_id);
            };
            m_isNew = false;
            return success;
          }
        );
      }
    else {
        return false;
      }
    });
};
