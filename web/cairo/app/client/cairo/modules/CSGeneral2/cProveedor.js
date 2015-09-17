(function() {
  "use strict";

  Cairo.module("Proveedor.Edit", function(Edit, Cairo, Backbone, Marionette, $, _) {

    var createObject = function() {

      var self = {};

      var getText = Cairo.Language.getText;

      var P = Cairo.Promises;
      var Dialogs = Cairo.Dialogs;
      var DB = Cairo.Database;
      var C = Cairo.General.Constants;
      var NO_ID = Cairo.Constants.NO_ID;
      var Types = Cairo.Constants.Types;
      var bToI = Cairo.Util.boolToInt;
      var valField = Cairo.Database.valField;
      var getValue = Cairo.Database.getValue;
      var getDateValue = Cairo.Database.getDateValue;
      var M = Cairo.Modal;
      var T = Dialogs.PropertyType;      

      var C_MODULE = "cProveedor";

      var C_RETENCION = "retencion";
      var C_CUENTAGRUPO = "CuentaGrupo";
      var C_CAIS = "CAIS";
      var C_EMPRESAS = "Empresas";
      var C_DPTO = "Departamentos";
      var C_CCOS = "Centros de Costo";

      var K_NAME = 1;
      var K_CODE = 2;
      var K_DESCRIP = 3;
      var K_CONTACTO = 4;
      var K_RAZONSOCIAL = 5;
      var K_CUIT = 6;
      var K_INGRESOSBRUTOS = 7;
      var K_CATFISCAL = 8;
      var K_CHEQUEORDEN = 9;
      var K_CODPOSTAL = 10;
      var K_LOCALIDAD = 11;
      var K_CALLE = 12;
      var K_CALLENUMERO = 13;
      var K_PISO = 14;
      var K_DEPTO = 15;
      var K_TEL = 16;
      var K_FAX = 17;
      var K_EMAIL = 18;
      var K_WEB = 19;
      var K_PRO_ID = 20;
      var K_ZON_ID = 21;
      var K_CPG_ID = 22;
      var K_ACTIVE = 23;
      var K_IMPRIMETICKET = 24;
      var K_CAIS = 26;
      var K_LP_ID = 27;
      var K_LD_ID = 28;
      var K_CUENTAGRUPO = 34;
      var K_RETENCION = 35;
      var K_EMPRESAS = 36;
      var K_DEPARTAMENTOS = 37;
      var K_CENTROS_DE_COSTO = 56;

      var K_CREDITOCTACTE = 38;
      var K_CREDITOTOTAL = 39;
      var K_CREDITOACTIVO = 40;

      var K_BANCO = 41;
      var K_NROCTA = 42;
      var K_CBU = 43;
      var K_NROCLIENTE = 44;

      var K_HORARIO_M_DESDE = 52;
      var K_HORARIO_M_HASTA = 53;
      var K_HORARIO_T_DESDE = 54;
      var K_HORARIO_T_HASTA = 55;

      var KI_PROVC_ID = 1;
      var KI_NUMERO = 2;
      var KI_DESCRIP = 3;
      var KI_FECHAVTO = 4;
      var KI_ACTIVO = 6;
      var KI_SUCURSAL = 7;

      var KI_CUEG_ID = 2;
      var KI_PROVCUEG_ID = 3;
      var KI_CUE_ID = 4;

      var KI_PROVRET_ID = 1;
      var KI_RETT_ID = 2;
      var KI_RET_ID = 3;
      var KI_RET_DESDE = 4;
      var KI_RET_HASTA = 5;

      var KI_EMPPROV_ID = 1;
      var KI_EMP_ID = 2;

      var KI_DPTOPROV_ID = 1;
      var KI_DPTO_ID = 2;

      var KI_PROVCCOS_ID = 1;
      var KI_CCOS_ID = 2;
      var KI_PR_ID = 3;

      var m_id = 0;
      var m_name = "";
      var m_code = "";
      var m_contacto = "";
      var m_descrip = "";
      var m_razonsocial = "";
      var m_cuit = "";
      var m_ingresosbrutos = "";
      var m_catFiscal = 0;
      var m_chequeorden = "";
      var m_codpostal = "";
      var m_localidad = "";
      var m_calle = "";
      var m_callenumero = "";
      var m_piso = "";
      var m_depto = "";
      var m_tel = "";
      var m_fax = "";
      var m_email = "";
      var m_web = "";
      var m_pro_id = 0;
      var m_zon_id = 0;
      var m_cpg_id = 0;
      var m_condicionPago = "";
      var m_provincia = "";
      var m_zona = "";
      var m_active;
      var m_imprimeTicket;
      var m_lp_id = 0;
      var m_listaPrecio = "";
      var m_ld_id = 0;
      var m_listaDescuento = "";

      var m_nroctabanco = "";
      var m_banco = "";
      var m_cbu = "";
      var m_nrocliente = "";

      var m_horario_m_desde = null;
      var m_horario_m_hasta = null;
      var m_horario_t_desde = null;
      var m_horario_t_hasta = null;

      var m_creditoctacte = 0;
      var m_creditototal = 0;
      var m_creditoactivo;

      var m_editing;

      var m_dialog;
      var m_listController = null;

      var m_isNew;

      var m_branchId = 0;
      var m_treeId = 0;

      var m_copy;

      var m_itemsDeletedCAIS = "";
      var m_itemsDeletedCuentaGrupo = "";
      var m_itemsDeletedRetenciones = "";
      var m_itemsDeletedDptos = "";
      var m_itemsDeletedCcos = "";

      var m_genericEdit;

      var m_apiPath = Cairo.Database.getAPIVersion();

      var emptyData = {
        cais: [],
        cuentaGrupo: [],
        retenciones: [],
        dptos: [],
        centrosCosto: []
      };

      var m_data = emptyData;

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

        m_listController.updateEditorKey(self, NO_ID);

        var property = m_dialog.getProperties().item(C.PROV_CODE);
        property.setValue(Cairo.Constants.COPY_OF + property.getValue());

        m_dialog.showValue(m_dialog.getProperties().item(C.PROV_CODE));

        m_copy = true;
      };

      self.editNew = function() {

        updateList();

        m_isNew = true;

        if(!validateAccessNewEdit(NO_ID)) { return false; }

        m_listController.updateEditorKey(self, NO_ID);

        return load(NO_ID).then(
          function() {
            return refreshCollection();
          }
        );
      };

      self.getApplication = function() {
        return Cairo.appName;
      };

      self.editDocumentsEnabled = function() {
        return m_id != NO_ID;
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

          if(m_id === NO_ID) { return _rtn; }

          var doc = new Cairo.DocDigital();

          doc.setClientTable(C.PROVEEDOR);
          doc.setClientTableID(m_id);

          _rtn = doc.showDocs(Cairo.Database);

        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, Cairo.Constants.SHOW_DOCUMENTS_FUNCTION, C_MODULE, "");
        }

        return _rtn;
      };

      self.messageEx = function(messageId, info) {
        var _rtn = null;
        var p = null;

        switch (messageId) {

          case Dialogs.Message.MSG_DOC_INFO:

            Cairo.Documentation.show("", "", Cairo.Security.Actions.General.NEW_PROVEEDOR);
            _rtn = Dialogs.Message.MSG_DOC_INFO_HANDLED;
            break;

          case Dialogs.Message.MSG_GRID_VIRTUAL_ROW:

            p = P.resolvedPromise(info);
            break;

          default:

            _rtn = true;
            break;
        }

        return p || Cairo.Promises.resolvedPromise(_rtn);
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

        register.setFieldId(C.PROV_ID);
        register.setTable(C.PROVEEDOR);

        var m_apiPath = Cairo.Database.getAPIVersion();
        register.setPath(m_apiPath + "general/proveedor");

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
              fields.add(C.PROV_NAME, property.getValue(), Types.text);
              break;

            case K_CODE:
              fields.add(C.PROV_CODE, property.getValue(), Types.text);
              break;

            case K_DESCRIP:
              fields.add(C.PROV_DESCRIP, property.getValue(), Types.text);
              break;

            case K_CPG_ID:
              fields.add(C.CPG_ID, property.getSelectId(), Types.id);
              break;

            case K_CONTACTO:
              fields.add(C.PROV_CONTACTO, property.getValue(), Types.text);
              break;

            case K_RAZONSOCIAL:
              fields.add(C.PROV_RAZONSOCIAL, property.getValue(), Types.text);
              break;

            case K_CUIT:
              fields.add(C.PROV_CUIT, property.getValue(), Types.text);
              break;

            case K_INGRESOSBRUTOS:
              fields.add(C.PROV_INGRESOSBRUTOS, property.getValue(), Types.text);
              break;

            case K_CATFISCAL:
              fields.add(C.PROV_CAT_FISCAL, property.getListItemData(), Types.integer);
              break;

            case K_CHEQUEORDEN:
              fields.add(C.PROV_CHEQUEORDEN, property.getValue(), Types.text);
              break;

            case K_CODPOSTAL:
              fields.add(C.PROV_CODPOSTAL, property.getValue(), Types.text);
              break;

            case K_LOCALIDAD:
              fields.add(C.PROV_LOCALIDAD, property.getValue(), Types.text);
              break;

            case K_CALLE:
              fields.add(C.PROV_CALLE, property.getValue(), Types.text);
              break;

            case K_CALLENUMERO:
              fields.add(C.PROV_CALLENUMERO, property.getValue(), Types.text);
              break;

            case K_PISO:
              fields.add(C.PROV_PISO, property.getValue(), Types.text);
              break;

            case K_DEPTO:
              fields.add(C.PROV_DEPTO, property.getValue(), Types.text);
              break;

            case K_TEL:
              fields.add(C.PROV_TEL, property.getValue(), Types.text);
              break;

            case K_FAX:
              fields.add(C.PROV_FAX, property.getValue(), Types.text);
              break;

            case K_EMAIL:
              fields.add(C.PROV_EMAIL, property.getValue(), Types.text);
              break;

            case K_WEB:
              fields.add(C.PROV_WEB, property.getValue(), Types.text);
              break;

            case K_PRO_ID:
              fields.add(C.PRO_ID, property.getSelectId(), Types.id);
              break;

            case K_ZON_ID:
              fields.add(C.ZON_ID, property.getSelectId(), Types.id);
              break;

            case K_ACTIVE:
              fields.add(Cairo.Constants.ACTIVE, property.getValue(), Types.boolean);
              break;

            case K_IMPRIMETICKET:
              fields.add(C.PROV_IMPRIME_TICKET, property.getValue(), Types.boolean);
              break;

            case K_LP_ID:
              fields.add(C.LP_ID, property.getSelectId(), Types.id);
              break;

            case K_LD_ID:
              fields.add(C.LD_ID, property.getSelectId(), Types.id);
              break;

            case K_CREDITOCTACTE:
              fields.add(C.PROV_CREDITOCTACTE, property.getValue(), Types.currency);
              break;

            case K_CREDITOTOTAL:
              fields.add(C.PROV_CREDITOTOTAL, property.getValue(), Types.currency);
              break;

            case K_CREDITOACTIVO:
              fields.add(C.PROV_CREDITOACTIVO, property.getValue(), Types.boolean);
              break;

            case K_BANCO:
              fields.add(C.PROV_BANCO, property.getValue(), Types.text);
              break;

            case K_NROCTA:
              fields.add(C.PROV_NRO_CTA_BANCO, property.getValue(), Types.text);
              break;

            case K_CBU:
              fields.add(C.PROV_CBU, property.getValue(), Types.text);
              break;

            case K_NROCLIENTE:
              fields.add(C.PROV_NRO_CLIENTE, property.getValue(), Types.text);
              break;

            case K_HORARIO_M_DESDE:
              fields.add(C.PROV_HORARIO_MDESDE, property.getValue(), Types.date);
              break;

            case K_HORARIO_M_HASTA:
              fields.add(C.PROV_HORARIO_MHASTA, property.getValue(), Types.date);
              break;

            case K_HORARIO_T_DESDE:
              fields.add(C.PROV_HORARIO_TDESDE, property.getValue(), Types.date);
              break;

            case K_HORARIO_T_HASTA:
              fields.add(C.PROV_HORARIO_THASTA, property.getValue(), Types.date);
              break;
          }
        }

        if(!m_genericEdit.Save(m_dialog, register)) { return _rtn; }

        // save items

        saveItemsCAIS(register);
        saveItemsCuentaGrupo(register);
        saveItemsRetencion(register);
        saveItemsEmpresa(register);
        saveItemsDpto(register);
        saveItemsCcos(register);

        return Cairo.Database.saveTransaction(
            register,
            false,
            C.PROV_CODE,
            Cairo.Constants.CLIENT_SAVE_FUNCTION,
            C_MODULE,
            getText(1377, "") // Error al grabar el proveedor

        ).then(

          function(result) {
            if(result.success) {
              m_copy = false;
              return load(result.data.getId()).then(
                function (success) {
                  if(success) {
                    if(m_listController !== null) {
                      updateList();
                      m_listController.updateEditorKey(self, m_id);
                    }
                  };
                  m_isNew = false;
                  return success;
                }
              );
            }
            else {
              return false;
            }
          }
        );
      };

      var updateList = function() {
        if(m_id === NO_ID) { return; }
        if(m_listController === null) { return; }

        if(m_isNew) {
          m_listController.addLeave(m_id, m_branchId);
        }
        else {
          m_listController.refreshBranch(m_id, m_branchId);
        }
      };

      self.getPath = function() {
        return "#general/proveedor/" + m_id.toString();
      };

      self.getEditorName = function() {
        var id = m_id ? m_id.toString() : "N" + (new Date).getTime().toString();
        return "proveedor" + id;
      };

      self.getTitle = function() {
        return getText(1302, ""); // Proveedores
      };

      self.validate = function() {

        var p = null;
        var property;
        var propertyCBU;
        var creditoCC = 0;
        var creditoTotal = 0;
        var name = "";

        var _count = m_dialog.getProperties().size();
        for (var _i = 0; _i < _count; _i++) {
          
          property = m_dialog.getProperties().item(_i);
          
          switch (property.getKey()) {
            case K_NAME:
              if(Cairo.Util.valEmpty(property.getValue(), Types.text)) {
                return Cairo.Modal.showInfoWithFalse(Cairo.Constants.MUST_SET_A_NAME);
              }
              else {
                name = property.getValue();
              }
              break;

            case K_CODE:
              if(Cairo.Util.valEmpty(property.getValue(), Types.text)) {
                property.setValue(Cairo.Constants.GET_CODE_FROM_ID);
              }
              break;

            case K_RAZONSOCIAL:
              if(Cairo.Util.valEmpty(property.getValue(), Types.text)) {
                property.setValue(name);
              }
              break;

            case K_CATFISCAL:
              if(Cairo.Util.valEmpty(property.getListItemData(), Types.integer)) {
                return Cairo.Modal.showInfoWithFalse(getText(1174, "")); // Debe indicar un categoría fiscal
              }
              break;

            case K_CREDITOCTACTE:
              creditoCC = Cairo.Util.val(property.getValue());
              break;

            case K_CREDITOTOTAL:
              creditoTotal = Cairo.Util.val(property.getValue());
              break;

            case K_CBU:
              propertyCBU = property;
              break;
          }
        }

        if(creditoCC > creditoTotal) {
          return Cairo.Modal.showInfoWithFalse(getText(1380, ""));
          // El crédito en cuenta corriente no puede ser mayor que el crédito total
        }

        if(propertyCBU.getValue() !== "") {
          if(!D.validateCBU(propertyCBU.getValue())) {
            p = M.confirmViewYesDanger("", getText(4714, ""));
          }
        }

        p = p || P.resolvedPromise(true);

        p = p.whenSuccess(function() {
          if(!validateCuitProveedor(m_dialog.getProperties().item(C.PROV_CUIT).getValue().trim())) {
            return false;
          }
        });

        if(!m_genericEdit.Validate(m_dialog)) { return false; }

        return Cairo.Promises.resolvedPromise(true);
      };

      // Implementacion de ciABMClientGrid

      var columnAfterEdit = function(key, lRow, lCol, newValue, newValueID) {
        return true;
      };

      var columnAfterUpdate = function(key, lRow, lCol) {
        return true;
      };

      var columnBeforeEdit = function(key, lRow, lCol, iKeyAscii) {
        var _rtn = null;
        try {

          switch (key) {
            case K_CUENTAGRUPO:
              _rtn = mPublic.self.colAUpdateCtaGrupo(pGetCtaGrupo(), lRow, lCol, m_dialog, KI_CUEG_ID, KI_CUE_ID);
              break;

            default:
              _rtn = true;
              break;
          }

          // **TODO:** goto found: GoTo ExitProc;
        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, "columnBeforeEdit", C_MODULE, "");
          // **TODO:** label found: ExitProc:;
        }
        // **TODO:** on error resume next found !!!

        return _rtn;
      };

      var columnButtonClick = function(key, lRow, lCol, iKeyAscii) {

      };

      var columnClick = function(key, lRow, lCol) {

      };

      var dblClick = function(key, lRow, lCol) {

      };

      var deleteRow = function(key, row, lRow) {
        var _rtn = null;
        var id = null;

        switch (key) {
          case K_CAIS:
            id = Cairo.Util.val(Dialogs.cell(row, KI_PROVC_ID).getValue());
            if(id != NO_ID) { m_itemsDeletedCAIS = m_itemsDeletedCAIS+ id.toString()+ C_StrColon; }
            break;

          case K_CUENTAGRUPO:
            id = Cairo.Util.val(Dialogs.cell(row, KI_PROVCUEG_ID).getValue());
            if(id != NO_ID) { m_itemsDeletedCuentaGrupo = m_itemsDeletedCuentaGrupo+ id.toString()+ C_StrColon; }
            break;

          case K_EMPRESAS:
            _rtn = false;
            return _rtn;
            break;

          case K_DEPARTAMENTOS:
            id = Cairo.Util.val(Dialogs.cell(row, KI_DPTOPROV_ID).getValue());
            if(id != NO_ID) { m_itemsDeletedDptos = m_itemsDeletedDptos+ id.toString()+ C_StrColon; }
            break;

          case K_CENTROS_DE_COSTO:
            id = Cairo.Util.val(Dialogs.cell(row, KI_PROVCCOS_ID).getValue());
            if(id != NO_ID) { m_itemsDeletedCcos = m_itemsDeletedCcos+ id.toString()+ C_StrColon; }
            break;

          case K_RETENCION:
            id = Cairo.Util.val(Dialogs.cell(row, KI_PROVRET_ID).getValue());
            if(id != NO_ID) { m_itemsDeletedRetenciones = m_itemsDeletedRetenciones+ id.toString()+ C_StrColon; }
            break;
        }

        _rtn = true;

        return _rtn;
      };

      var isEmptyRow = function(key, row, rowIndex) {
        var _rtn = null;
        try {

          switch (key) {
            case K_CAIS:
              _rtn = isEmptyRow(row, rowIndex);
              break;

            case K_CUENTAGRUPO:
              _rtn = isEmptyRowCuentaGrupo(row, rowIndex);
              break;

            case K_EMPRESAS:
              _rtn = false;
              break;

            case K_DEPARTAMENTOS:
              _rtn = isEmptyRowDpto(row, rowIndex);
              break;

            case K_CENTROS_DE_COSTO:
              _rtn = isEmptyRowCcos(row, rowIndex);
              break;

            case K_RETENCION:
              _rtn = isEmptyRowRetencion(row, rowIndex);
              break;
          }

          // **TODO:** goto found: GoTo ExitProc;
        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, C_ValidateRow, C_MODULE, "");
          // **TODO:** label found: ExitProc:;
        }
        // **TODO:** on error resume next found !!!

        return _rtn;
      };

      var listAdHock = function(key, row, colIndex, list) {

      };

      var newRow = function(key, rows) {

      };

      var validateRow = function(key, row, rowIndex) {
        var _rtn = null;
        try {

          switch (key) {
            case K_CAIS:
              _rtn = validateRowCAIs(row, rowIndex);
              break;

            case K_CUENTAGRUPO:
              _rtn = validateRowCuentaGrupo(row, rowIndex);
              break;

            case K_EMPRESAS:
              _rtn = true;
              break;

            case K_DEPARTAMENTOS:
              _rtn = validateRowDpto(row, rowIndex);
              break;

            case K_CENTROS_DE_COSTO:
              _rtn = validateRowCcos(row, rowIndex);
              break;

            case K_RETENCION:
              _rtn = validateRowRetencion(row, rowIndex);
              break;
          }

          // **TODO:** goto found: GoTo ExitProc;
        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, C_ValidateRow, C_MODULE, "");
          // **TODO:** label found: ExitProc:;
        }
        // **TODO:** on error resume next found !!!

        return _rtn;
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
        return Cairo.Security.hasPermissionTo(csGeneralPrestacion.Cairo.Security.Actions.General.LIST_PROVEEDOR);
      };

      self.setDialog = function(rhs) {
        m_dialog = rhs;
      };

      self.isEditing = function() {
        return m_editing;
      };

            self.edit = function(id, inModalWindow) {
              var p = Cairo.Promises.resolvedPromise(false);
              try {

                if(!validateAccessNewEdit(NO_ID)) { return p; }

                m_dialog.setInModalWindow(inModalWindow);

                m_genericEdit = new cGenericEdit();
                if(!m_genericEdit.init(Cairo.Tables.PROVEEDOR)) { return p; }

                if(!self.load(id)) { return p; }

                if(!loadCollection()) { return false; }

                m_editing = true;
                m_copy = false;

                if(inModalWindow) {
                  success = m_id != NO_ID;
                }
                else {
                  success = true;
                }

              }
              return success;
            });
          }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, Cairo.Constants.EDIT_FUNCTION, C_MODULE, "");
        }

        return p;
      };

      self.setTree = function(rhs) {
        m_listController = rhs;
      };

      self.setBranchId = function(rhs) {
        m_branchId = rhs;
      };

      self.getBranchId = function() {
        return m_branchId;
      };

      var validateAccessNewEdit = function(id) {
        if(id === NO_ID) {
          m_isNew = true;
          if(!Cairo.Security.hasPermissionTo(csGeneralPrestacion.Cairo.Security.Actions.General.NEW_PROVEEDOR)) { return false; }
        }
        else {
          m_isNew = false;
          if(!Cairo.Security.hasPermissionTo(csGeneralPrestacion.Cairo.Security.Actions.General.EDIT_PROVEEDOR)) { return false; }
        }
        return true;
      };

      var validateRowDpto = function(row, rowIndex) {
        var cell = null;

        var strRow = " (Row: " + rowIndex.toString() + ")";

        var _count = row.size();
        for (var _i = 0; _i < _count; _i++) {
          cell = row.item(_i);
          switch (cell.getKey()) {
            case KI_DPTO_ID:
              if(Cairo.Util.valEmpty(cell.getId(), Types.id)) {
                MsgInfo(getText(1385, "", strRow));
                //Debe indicar un departamento
              }
              break;
          }
        }

        return Cairo.Promises.resolvedPromise(true);
      };

      var validateRowCcos = function(row, rowIndex) {
        var cell = null;

        var strRow = " (Row: " + rowIndex.toString() + ")";

        var _count = row.size();
        for (var _i = 0; _i < _count; _i++) {
          cell = row.item(_i);
          switch (cell.getKey()) {
            case KI_CCOS_ID:
              if(Cairo.Util.valEmpty(cell.getId(), Types.id)) {
                MsgInfo(getText(4603, "", strRow));
                //Debe indicar un centro de costo
              }
              break;
          }
        }

        return Cairo.Promises.resolvedPromise(true);
      };

      var validateRowRetencion = function(row, rowIndex) {
        var cell = null;

        var strRow = " (Row: " + rowIndex.toString() + ")";

        var _count = row.size();
        for (var _i = 0; _i < _count; _i++) {
          cell = row.item(_i);
          switch (cell.getKey()) {
            case KI_RET_ID:
              if(Cairo.Util.valEmpty(cell.getId(), Types.id)) {
                MsgInfo(getText(1386, "", strRow));
                //Debe indicar una retención (1)
              }
              break;
          }
        }

        return Cairo.Promises.resolvedPromise(true);
      };

      var validateRowCuentaGrupo = function(row, rowIndex) {
        var cell = null;

        var strRow = " (Row: " + rowIndex.toString() + ")";

        var _count = row.size();
        for (var _i = 0; _i < _count; _i++) {
          cell = row.item(_i);
          switch (cell.getKey()) {
            case KI_CUEG_ID:
              if(Cairo.Util.valEmpty(cell.getId(), Types.id)) {
                MsgInfo(getText(1387, "", strRow));
                //Debe indicar un Grupo de Cuenta (1)
              }
              break;

            case KI_CUE_ID:
              if(Cairo.Util.valEmpty(cell.getId(), Types.id)) {
                MsgInfo(getText(1388, "", strRow));
                //Debe indicar una Cuenta (1)
              }
              break;
          }
        }

        return Cairo.Promises.resolvedPromise(true);
      };

      var validateRowCAIs = function(row, rowIndex) {
        var cell = null;

        var strRow = " (Row: " + rowIndex.toString() + ")";

        var _count = row.size();
        for (var _i = 0; _i < _count; _i++) {
          cell = row.item(_i);
          switch (cell.getKey()) {
            case KI_NUMERO:
              if(Cairo.Util.valEmpty(cell.getValue(), Types.text)) {
                MsgInfo(getText(1383, "", strRow));
                //Debe indicar un número de CAI (1)
              }
              break;

            case KI_FECHAVTO:
              if(Cairo.Util.valEmpty(cell.getValue(), Types.date) || LenB(cell.getValue()) === 0) {
                MsgInfo(getText(1384, "", strRow));
                //Debe indicar una fecha de vencimiento (1)
              }
              break;
          }
        }

        return Cairo.Promises.resolvedPromise(true);
      };

      var pSaveItemsCAIS = function(mainTransaction) {
        var transaction = new Cairo.Database.Transaction();

        var property = m_dialog.getProperties().item(C_CAIS);
        var row = null;
        var cell = null;

        var _count = property.getGrid().getRows().size();
        for (var _i = 0; _i < _count; _i++) {
          row = property.getGrid().getRows().item(_i);

          var register = new Cairo.Database.Register();

          var fields = register.getFields();
          register.setFieldId(C.PROVC_ID);
          register.setTable(C.PROVEEDORCAI);
          register.setId(Cairo.Constants.NEW_ID);

          var _count = row.size();
          for (var _j = 0; _j < _count; _j++) {
            cell = row.item(_j);
            switch (cell.getKey()) {

              case KI_PROVC_ID:
                if(!m_copy) {
                  register.setId(Cairo.Util.val(cell.getValue()));
                }
                break;

              case KI_NUMERO:
                fields.add(C.PROVC_NUMERO, cell.getValue(), Types.text);
                break;

              case KI_DESCRIP:
                fields.add(C.PROVC_DESCRIP, cell.getValue(), Types.text);
                break;

              case KI_FECHAVTO:
                fields.add(C.PROVC_FECHAVTO, cell.getValue(), Types.date);
                break;

              case KI_ACTIVO:
                fields.add(Cairo.Constants.ACTIVE, cell.getId(), Types.boolean);
                break;

              case KI_SUCURSAL:
                fields.add(C.PROVC_SUCURSAL, cell.getValue(), Types.text);
                break;
            }
          }

          fields.add(C.PROV_ID, m_id, Types.id);

          transaction.addRegister(register);
        }

        if(LenB(m_itemsDeletedCAIS) && !m_copy) {
          m_itemsDeletedCAIS = RemoveLastColon(m_itemsDeletedCAIS);

          if(!Cairo.Database.execute(sqlstmt, "pSaveItemsCAIS", C_MODULE)) { return false; }
        }

        mainTransaction.addTransaction(transaction);

        return true;
      };

      var loadCollection = function() {
        var filter = null;
        var c = null;

        var abmObj = null;
        abmObj = m_dialog;
        abmObj.MinHeight = 6400;
        abmObj.MinWidth = 12000;
        abmObj.bSendRefresh = true;

        var c_tab_general = 0;
        var c_tab_direccion = 1;
        var c_tab_cais = 2;
        var c_tab_cuentagrupo = 3;
        var c_tab_credito = 4;
        var c_tab_retencion = 5;
        var c_tab_empresas = 6;
        var c_tab_dpto = 7;
        var c_tab_ccos = 8;

        var w_tabs = m_dialog.getTabs();

        w_tabs.clear();

        var tab = w_tabs.add(null);
        tab.setName(Cairo.Constants.c_strGeneral);

        var tab = w_tabs.add(null);
        tab.setIndex(c_tab_direccion);
        // Dirección
        tab.setName(getText(1037, ""));

        var tab = w_tabs.add(null);
        tab.setIndex(c_tab_cais);
        // CAIS
        tab.setName(getText(1390, ""));

        var tab = w_tabs.add(null);
        tab.setIndex(c_tab_cuentagrupo);
        // Grupos de Ctas.
        tab.setName(getText(1391, ""));

        var tab = w_tabs.add(null);
        tab.setIndex(c_tab_credito);
        // Crédito
        tab.setName(getText(1392, ""));

        var tab = w_tabs.add(null);
        tab.setIndex(c_tab_retencion);
        // Retenciones
        tab.setName(getText(1393, ""));

        var tab = w_tabs.add(null);
        tab.setIndex(c_tab_empresas);
        // Empresas
        tab.setName(getText(1171, ""));

        var tab = w_tabs.add(null);
        tab.setIndex(c_tab_dpto);
        // Deptos.
        tab.setName(getText(1508, ""));

        var tab = w_tabs.add(null);
        tab.setIndex(c_tab_ccos);
        // Centros de Costo
        tab.setName(getText(4602, ""));

        m_dialog.setTitle(m_name);

        var properties = m_dialog.getProperties();

        properties.clear();

        var elem = properties.add(null, C.PROV_NAME);
        elem.setType(Dialogs.PropertyType.text);
        elem.setName(Cairo.Constants.NAME_LABEL);
        elem.setSize(255);
        elem.setWidth(6100);
        elem.setKey(K_NAME);
        elem.setValue(m_name);

        var elem = properties.add(null, C.PROV_RAZONSOCIAL);
        elem.setType(Dialogs.PropertyType.text);
        // Razon Social
        elem.setName(getText(1178, ""));
        elem.setSize(255);
        elem.setWidth(6100);
        elem.setKey(K_RAZONSOCIAL);
        elem.setValue(m_razonsocial);

        var elem = properties.add(null, C.PROV_CODE);
        elem.setType(Dialogs.PropertyType.text);
        elem.setName(Cairo.Constants.CODE_LABEL);
        elem.setSize(20);
        elem.setKey(K_CODE);
        elem.setValue(m_code);

        var elem = properties.add(null, Cairo.Constants.ACTIVE);
        elem.setType(Dialogs.PropertyType.check);
        elem.setName(Cairo.Constants.ACTIVE_LABEL);
        elem.setKey(K_ACTIVE);
        elem.setValue(m_active === true ? 1 : 0);

        var elem = properties.add(null, C.PROV_IMPRIME_TICKET);
        elem.setType(Dialogs.PropertyType.check);
        // Imprime Ticket
        elem.setName(getText(1394, ""));
        elem.setLeftToPrevious(3000);
        elem.setLeftNotChange(true);
        elem.setTopFromProperty(Cairo.Constants.ACTIVE);
        elem.setKey(K_IMPRIMETICKET);
        elem.setValue(Cairo.Util.boolToInt(m_imprimeTicket));

        var elem = properties.add(null, C.PROV_CONTACTO);
        elem.setType(Dialogs.PropertyType.text);
        // Contacto
        elem.setName(getText(1035, ""));
        elem.setSize(30);
        elem.setKey(K_CONTACTO);
        elem.setValue(m_contacto);

        var elem = properties.add(null, C.LP_ID);
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.LISTAPRECIO);

        filter = "exists(select lp_id from listaprecioproveedor where prov_id ="+ m_id;
        filter = filter+ " and lp_id = listaprecio.lp_id)";

        elem.setSelectFilter(filter);
        // Lista de precios
        elem.setName(getText(1397, ""));
        elem.setKey(K_LP_ID);
        elem.setValue(m_listaPrecio);
        elem.setSelectId(m_lp_id);

        var elem = properties.add(null, C.PROV_CATFISCAL);
        elem.setType(Dialogs.PropertyType.list);
        // Categoria Fiscal
        elem.setName(getText(1181, ""));
        elem.setTopFromProperty(C.PROV_CODE);
        elem.setLeft(5500);
        elem.setKey(K_CATFISCAL);
        elem.setListWhoSetItem(csListItemData);
        elem.setListItemData(m_catFiscal);

        var elem = elem.add(null, csCatFiscal.cSCATFNOINSCRIPTO);
        elem.Id = csCatFiscal.cSCATFNOINSCRIPTO;
        // No Inscripto
        elem.setValue(getText(1183, ""));

        var elem = elem.add(null, csCatFiscal.cSCATFINSCRIPTO);
        elem.Id = csCatFiscal.cSCATFINSCRIPTO;
        // Inscripto
        elem.setValue(getText(1184, ""));

        var elem = elem.add(null, csCatFiscal.cSCATFEXTRANJERO);
        elem.Id = csCatFiscal.cSCATFEXTRANJERO;
        // Extranjero
        elem.setValue(getText(1185, ""));

        var elem = elem.add(null, csCatFiscal.cSCATFEXENTO);
        elem.Id = csCatFiscal.cSCATFEXENTO;
        // Exento
        elem.setValue(getText(1186, ""));

        var elem = elem.add(null, csCatFiscal.cSCATFMONOTRIBUTO);
        elem.Id = csCatFiscal.cSCATFMONOTRIBUTO;
        // Monotributo
        elem.setValue(getText(1187, ""));

        var elem = elem.add(null, csCatFiscal.cSCATFEXTRANJEROIVA);
        elem.Id = csCatFiscal.cSCATFEXTRANJEROIVA;
        // Extranjero con Iva
        elem.setValue(getText(1188, ""));

        var elem = elem.add(null, csCatFiscal.cSCATFNOCATEGORIZADO);
        elem.Id = csCatFiscal.cSCATFNOCATEGORIZADO;
        // No categorizado
        elem.setValue(getText(1189, ""));

        var elem = elem.add(null, csCatFiscal.cSCATFNORESPONSABLE);
        elem.Id = csCatFiscal.cSCATFNORESPONSABLE;
        // No responsable
        elem.setValue(getText(1190, ""));

        var elem = elem.add(null, csCatFiscal.cSCATFNORESPONSABLEEXENTO);
        elem.Id = csCatFiscal.cSCATFNORESPONSABLEEXENTO;
        // No responsable exento
        elem.setValue(getText(1191, ""));

        var elem = elem.add(null, csCatFiscal.cSCATFINSCRIPTOM);
        elem.Id = csCatFiscal.cSCATFINSCRIPTOM;
        // Inscripto M
        elem.setValue(getText(1192, ""));

        var elem = properties.add(null, C.PROV_CUIT);
        elem.setType(Dialogs.PropertyType.text);
        // Cuit
        elem.setName(getText(1179, ""));
        elem.setSize(13);
        elem.setKey(K_CUIT);
        elem.setValue(m_cuit);

        var elem = properties.add(null, C.PROV_INGRESOSBRUTOS);
        elem.setType(Dialogs.PropertyType.text);
        // Ingresos Brutos
        elem.setName(getText(1180, ""));
        elem.setSize(20);
        elem.setKey(K_INGRESOSBRUTOS);
        elem.setValue(m_ingresosbrutos);

        var elem = properties.add(null, C.LD_ID);
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.LISTADESCUENTO);
        // Lista de descuentos
        elem.setName(getText(1398, ""));
        elem.setKey(K_LD_ID);

        filter = "exists(select ld_id from listadescuentoproveedor where prov_id ="+ m_id;
        filter = filter+ " and ld_id = listadescuento.ld_id)";

        elem.setSelectFilter(filter);
        elem.setValue(m_listaDescuento);
        elem.setSelectId(m_ld_id);

        var elem = properties.add(null, C.CPG_ID);
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.CONDICIONPAGO);
        // Condición de pago
        elem.setName(getText(1395, ""));
        elem.setTopFromProperty(C.PROV_NAME);
        elem.setLeft(9500);
        elem.setKey(K_CPG_ID);
        elem.setValue(m_condicionPago);
        elem.setSelectId(m_cpg_id);

        var elem = properties.add(null, C.PROV_CHEQUEORDEN);
        elem.setType(Dialogs.PropertyType.text);
        // Cheque a la orden
        elem.setName(getText(1396, ""));
        elem.setSize(100);
        elem.setKey(K_CHEQUEORDEN);
        elem.setValue(m_chequeorden);

        var elem = properties.add(null, C.PROV_BANCO);
        elem.setType(Dialogs.PropertyType.text);
        // Banco
        elem.setName(getText(1122, ""));
        elem.setSize(100);
        elem.setKey(K_BANCO);
        elem.setValue(m_banco);

        var elem = properties.add(null, C.PROV_NRO_CTA_BANCO);
        elem.setType(Dialogs.PropertyType.text);
        // Cuenta Bancaria
        elem.setName(getText(4710, ""));
        elem.setSize(255);
        elem.setKey(K_NROCTA);
        elem.setValue(m_nroctabanco);

        var elem = properties.add(null, C.PROV_CBU);
        elem.setType(Dialogs.PropertyType.text);
        // CBU
        elem.setName(getText(4711, ""));
        elem.setSize(100);
        elem.setKey(K_CBU);
        elem.setValue(m_cbu);

        var elem = properties.add(null, C.PROV_NRO_CLIENTE);
        elem.setType(Dialogs.PropertyType.text);
        // Nro. de Cliente
        elem.setName(getText(4715, ""));
        elem.setSize(100);
        elem.setKey(K_NROCLIENTE);
        elem.setValue(m_nrocliente);

        var elem = properties.add(null, C.PROV_CREDITOCTACTE);
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setSubType(Dialogs.PropertySubType.money);
        // Crédito en Cta.Cte.
        elem.setName(getText(1399, ""));
        elem.setTabIndex(c_tab_credito);
        elem.setKey(K_CREDITOCTACTE);
        elem.setValue(m_creditoctacte);

        var elem = properties.add(null, C.PROV_CREDITOTOTAL);
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setSubType(Dialogs.PropertySubType.money);
        // Crédito Total
        elem.setName(getText(1400, ""));
        elem.setTabIndex(c_tab_credito);
        elem.setKey(K_CREDITOTOTAL);
        elem.setValue(m_creditototal);

        var elem = properties.add(null, C.PROV_CREDITOACTIVO);
        elem.setType(Dialogs.PropertyType.check);
        // Crédito Activo
        elem.setName(getText(1401, ""));
        elem.setTabIndex(c_tab_credito);
        elem.setKey(K_CREDITOACTIVO);
        elem.setValue(Cairo.Util.boolToInt(m_creditoactivo));

        var elem = properties.add(null, C.PROV_DESCRIP);
        elem.setType(Dialogs.PropertyType.text);
        elem.setSubType(Dialogs.PropertySubType.memo);
        elem.setWidth(10150);
        elem.setHeight(780);
        elem.setName(Cairo.Constants.DESCRIPTION_LABEL);
        elem.setSize(255);

        elem.setTopFromProperty(C.PROV_CONTACTO);
        elem.setTopToPrevious(1040);
        elem.setLeftFromProperty(C.PROV_NAME);
        elem.setKey(K_DESCRIP);
        elem.setValue(m_descrip);

        var elem = properties.add(null, C.PROV_CALLE);
        elem.setType(Dialogs.PropertyType.text);
        // Calle
        elem.setName(getText(1194, ""));
        elem.setTabIndex(c_tab_direccion);
        elem.setKey(K_CALLE);
        elem.setValue(m_calle);
        elem.setWidth(9000);

        var elem = properties.add(null, C.PROV_CALLENUMERO);
        elem.setType(Dialogs.PropertyType.text);
        // Número
        elem.setName(getText(1065, ""));
        elem.setTabIndex(c_tab_direccion);
        elem.setSize(10);
        elem.setKey(K_CALLENUMERO);
        elem.setValue(m_callenumero);
        elem.setWidth(1200);

        var elem = properties.add(null, C.PROV_PISO);
        elem.setType(Dialogs.PropertyType.text);
        // Piso
        elem.setName(getText(1196, ""));
        elem.setTabIndex(c_tab_direccion);
        elem.setSize(4);
        elem.setKey(K_PISO);
        elem.setValue(m_piso);
        elem.setWidth(1200);

        var elem = properties.add(null, C.PROV_DEPTO);
        elem.setType(Dialogs.PropertyType.text);
        // Departamento
        elem.setName(getText(1278, ""));
        elem.setTabIndex(c_tab_direccion);
        elem.setSize(4);
        elem.setKey(K_DEPTO);
        elem.setValue(m_depto);
        elem.setWidth(1200);

        var elem = properties.add(null, C.PROV_CODPOSTAL);
        elem.setType(Dialogs.PropertyType.text);
        // Codigo Postal
        elem.setName(getText(1199, ""));
        elem.setTabIndex(c_tab_direccion);
        elem.setSize(20);
        elem.setKey(K_CODPOSTAL);
        elem.setValue(m_codpostal);
        elem.setWidth(1200);

        var elem = properties.add(null, C.PROV_LOCALIDAD);
        elem.setType(Dialogs.PropertyType.text);
        // Localidad
        elem.setName(getText(1198, ""));
        elem.setTabIndex(c_tab_direccion);
        elem.setSize(100);
        elem.setKey(K_LOCALIDAD);
        elem.setValue(m_localidad);
        elem.setWidth(6500);

        var elem = properties.add(null, C.PRO_ID);
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.PROVINCIA);
        // Provincia
        elem.setName(getText(1080, ""));
        elem.setTabIndex(c_tab_direccion);
        elem.setKey(K_PRO_ID);
        elem.setValue(m_provincia);
        elem.setSelectId(m_pro_id);
        elem.setWidth(6500);

        var elem = properties.add(null, C.ZON_ID);
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.ZONA);
        // Zona
        elem.setName(getText(1402, ""));
        elem.setTabIndex(c_tab_direccion);
        elem.setKey(K_ZON_ID);
        elem.setValue(m_zona);
        elem.setSelectId(m_zon_id);
        elem.setWidth(6500);

        var elem = properties.add(null, C.PROV_HORARIO_MDESDE);
        elem.setType(Dialogs.PropertyType.time);
        //  Horario desde
        elem.setName(getText(4965, ""));
        elem.setTabIndex(c_tab_direccion);
        elem.setValue(m_horario_m_desde);
        elem.setKey(K_HORARIO_M_DESDE);
        elem.setLeftNotChange(true);

        var elem = properties.add(null, C.PROV_HORARIO_MHASTA);
        elem.setType(Dialogs.PropertyType.time);
        //  Hasta
        elem.setName(getText(4966, ""));
        elem.setTabIndex(c_tab_direccion);
        elem.setValue(m_horario_m_hasta);
        elem.setKey(K_HORARIO_M_HASTA);
        elem.setTopFromProperty(C.PROV_HORARIO_MDESDE);
        elem.setLeft(3200);
        elem.setLeftLabel(-500);
        elem.setLeftNotChange(true);
        elem.setTopNotChange(true);

        var elem = properties.add(null, C.PROV_HORARIO_TDESDE);
        elem.setType(Dialogs.PropertyType.time);
        //  Desde
        elem.setName(getText(4967, ""));
        elem.setTabIndex(c_tab_direccion);
        elem.setValue(m_horario_t_desde);
        elem.setKey(K_HORARIO_T_DESDE);
        elem.setTopFromProperty(C.PROV_HORARIO_MDESDE);
        elem.setLeft(4900);
        elem.setLeftLabel(-500);
        elem.setLeftNotChange(true);
        elem.setTopNotChange(true);

        var elem = properties.add(null, C.PROV_HORARIO_THASTA);
        elem.setType(Dialogs.PropertyType.time);
        //  Hasta
        elem.setName(getText(4966, ""));
        elem.setTabIndex(c_tab_direccion);
        elem.setValue(m_horario_t_hasta);
        elem.setKey(K_HORARIO_T_HASTA);
        elem.setTopFromProperty(C.PROV_HORARIO_MDESDE);
        elem.setLeft(6700);
        elem.setLeftLabel(-500);
        elem.setLeftNotChange(true);
        elem.setTopNotChange(true);

        var elem = properties.add(null, C.PROV_TEL);
        elem.setType(Dialogs.PropertyType.text);
        // Teléfono
        elem.setName(getText(1036, ""));
        elem.setTabIndex(c_tab_direccion);
        elem.setSize(100);
        elem.setKey(K_TEL);
        elem.setValue(m_tel);
        elem.setWidth(6000);
        elem.setTopFromProperty(C.PROV_CALLENUMERO);
        elem.setLeft(4200);
        elem.setLeftLabel(-900);

        var elem = properties.add(null, C.PROV_FAX);
        elem.setType(Dialogs.PropertyType.text);
        // Fax
        elem.setName(getText(1200, ""));
        elem.setTabIndex(c_tab_direccion);
        elem.setSize(50);
        elem.setKey(K_FAX);
        elem.setValue(m_fax);

        var elem = properties.add(null, C.PROV_EMAIL);
        elem.setType(Dialogs.PropertyType.text);
        // E-Mail
        elem.setName(getText(1034, ""));
        elem.setTabIndex(c_tab_direccion);
        elem.setSize(100);
        elem.setKey(K_EMAIL);
        elem.setValue(m_email);
        elem.setWidth(4000);

        var elem = properties.add(null, C.PROV_WEB);
        elem.setType(Dialogs.PropertyType.text);
        // Web
        elem.setName(getText(1038, ""));
        elem.setTabIndex(c_tab_direccion);
        elem.setSize(100);
        elem.setKey(K_WEB);
        elem.setValue(m_web);
        elem.setWidth(6000);

        c = properties.add(null, C_CAIS);
        c.setType(Dialogs.PropertyType.grid);
        c.setLeftLabel(-1);
        setGridCAIs(c);
        if(!loadCAI(c)) { return false; }
        c.setName(C_CAIS);
        c.setKey(K_CAIS);
        c.setTabIndex(c_tab_cais);
        c.setGridAddEnabled(true);
        c.setGridEditEnabled(true);
        c.setGridRemoveEnabled(true);

        m_itemsDeletedCAIS = "";

        c = properties.add(null, C_CUENTAGRUPO);
        c.setType(Dialogs.PropertyType.grid);
        c.setLeftLabel(-1);
        setGridCuentaGrupo(c);
        if(!loadCuentaGrupo(c)) { return false; }
        c.setName(C_CUENTAGRUPO);
        c.setKey(K_CUENTAGRUPO);
        c.setTabIndex(c_tab_cuentagrupo);
        c.setGridAddEnabled(true);
        c.setGridEditEnabled(true);
        c.setGridRemoveEnabled(true);

        m_itemsDeletedCuentaGrupo = "";

        c = properties.add(null, C_RETENCION);
        c.setType(Dialogs.PropertyType.grid);
        c.setLeftLabel(-1);
        setGridRetencion(c);
        if(!loadRetencion(c)) { return false; }
        c.setName(C_RETENCION);
        c.setKey(K_RETENCION);
        c.setTabIndex(c_tab_retencion);
        c.setGridAddEnabled(true);
        c.setGridEditEnabled(true);
        c.setGridRemoveEnabled(true);

        m_itemsDeletedRetenciones = "";

        c = properties.add(null, C_EMPRESAS);
        c.setType(Dialogs.PropertyType.grid);
        c.setLeftLabel(-1);
        setGridEmpresas(c);
        if(!loadEmpresas(c)) { return false; }
        c.setName(C_EMPRESAS);
        c.setKey(K_EMPRESAS);
        c.setTabIndex(c_tab_empresas);
        c.setGridAddEnabled(false);
        c.setGridEditEnabled(true);
        c.setGridRemoveEnabled(false);

        c = properties.add(null, C_DPTO);
        c.setType(Dialogs.PropertyType.grid);
        c.setLeftLabel(-1);
        setGridDpto(c);
        if(!loadDpto(c)) { return false; }
        c.setName(C_DPTO);
        c.setKey(K_DEPARTAMENTOS);
        c.setTabIndex(c_tab_dpto);
        c.setGridAddEnabled(true);
        c.setGridEditEnabled(true);
        c.setGridRemoveEnabled(true);

        m_itemsDeletedDptos = "";

        c = properties.add(null, C_CCOS);
        c.setType(Dialogs.PropertyType.grid);
        c.setLeftLabel(-1);
        setGridCcos(c);
        if(!loadCcos(c)) { return false; }
        c.setName(C_CCOS);
        c.setKey(K_CENTROS_DE_COSTO);
        c.setTabIndex(c_tab_ccos);
        c.setGridAddEnabled(true);
        c.setGridEditEnabled(true);
        c.setGridRemoveEnabled(true);

        m_itemsDeletedCcos = "";

        if(!m_genericEdit.LoadCollection(m_dialog)) { return false; }

        if(!m_dialog.show(self)) { return false; }

        return true;
      };

      var refreshCollection = function() {

        m_dialog.setTitle(m_name);

        var properties = m_dialog.getProperties();

        var elem = properties.item(C.PROV_NAME);
        elem.setValue(m_name);

        var elem = properties.item(C.PROV_RAZONSOCIAL);
        elem.setValue(m_razonsocial);

        var elem = properties.item(C.PROV_CODE);
        elem.setValue(m_code);

        var elem = properties.item(Cairo.Constants.ACTIVE);
        elem.setValue(m_active === true ? 1 : 0);

        var elem = properties.item(C.PROV_IMPRIME_TICKET);
        elem.setValue(Cairo.Util.boolToInt(m_imprimeTicket));

        var elem = properties.item(C.PROV_CONTACTO);
        elem.setValue(m_contacto);

        var elem = properties.item(C.LP_ID);
        elem.setValue(m_listaPrecio);
        elem.setSelectId(m_lp_id);

        var elem = properties.item(C.PROV_CATFISCAL);

        var elem = properties.item(C.PROV_CUIT);
        elem.setValue(m_cuit);

        var elem = properties.item(C.PROV_INGRESOSBRUTOS);
        elem.setValue(m_ingresosbrutos);

        var elem = properties.item(C.LD_ID);
        elem.setValue(m_listaDescuento);
        elem.setSelectId(m_ld_id);

        var elem = properties.item(C.CPG_ID);
        elem.setValue(m_condicionPago);
        elem.setSelectId(m_cpg_id);

        var elem = properties.item(C.PROV_CHEQUEORDEN);
        elem.setValue(m_chequeorden);

        var elem = properties.item(C.PROV_BANCO);
        elem.setValue(m_banco);

        var elem = properties.item(C.PROV_NRO_CTA_BANCO);
        elem.setValue(m_nroctabanco);

        var elem = properties.item(C.PROV_CBU);
        elem.setValue(m_cbu);

        var elem = properties.item(C.PROV_NRO_CLIENTE);
        elem.setValue(m_nrocliente);

        var elem = properties.item(C.PROV_CREDITOCTACTE);
        elem.setValue(m_creditoctacte);

        var elem = properties.item(C.PROV_CREDITOTOTAL);
        elem.setValue(m_creditototal);

        var elem = properties.item(C.PROV_CREDITOACTIVO);
        elem.setValue(Cairo.Util.boolToInt(m_creditoactivo));

        var elem = properties.item(C.PROV_DESCRIP);
        elem.setValue(m_descrip);

        var elem = properties.item(C.PROV_CALLE);
        elem.setValue(m_calle);

        var elem = properties.item(C.PROV_CALLENUMERO);
        elem.setValue(m_callenumero);

        var elem = properties.item(C.PROV_PISO);
        elem.setValue(m_piso);

        var elem = properties.item(C.PROV_DEPTO);
        elem.setValue(m_depto);

        var elem = properties.item(C.PROV_CODPOSTAL);
        elem.setValue(m_codpostal);

        var elem = properties.item(C.PROV_LOCALIDAD);
        elem.setValue(m_localidad);

        var elem = properties.item(C.PRO_ID);
        elem.setValue(m_provincia);
        elem.setSelectId(m_pro_id);

        var elem = properties.item(C.ZON_ID);
        elem.setValue(m_zona);
        elem.setSelectId(m_zon_id);

        var elem = properties.item(C.PROV_HORARIO_MDESDE);
        elem.setValue(m_horario_m_desde);

        var elem = properties.item(C.PROV_HORARIO_MHASTA);
        elem.setValue(m_horario_m_hasta);

        var elem = properties.item(C.PROV_HORARIO_TDESDE);
        elem.setValue(m_horario_t_desde);

        var elem = properties.item(C.PROV_HORARIO_THASTA);
        elem.setValue(m_horario_t_hasta);

        var elem = properties.item(C.PROV_TEL);
        elem.setValue(m_tel);

        var elem = properties.item(C.PROV_FAX);
        elem.setValue(m_fax);

        var elem = properties.item(C.PROV_EMAIL);
        elem.setValue(m_email);

        var elem = properties.item(C.PROV_WEB);
        elem.setValue(m_web);

        return m_dialog.showValues(properties);
      };

      self.getData = function(id, strField, typeValue) {
        var data = null;

        switch (typeValue) {
          case Types.boolean:
            data = false;
            break;

          case Types.cuit:
          case Types.text:
            data = "";
            break;

          case Types.date:
          case Types.dateornull:
            data = Cairo.Constants.cSNODATE;
            break;

          case Types.currency:
          case Types.double:
          case Types.integer:
          case Types.long:
          case Types.single:
          case Types.id:
            data = 0;
            break;

          case Types.variant:
            data = Empty;
            break;
        }

        if(!Cairo.Database.getData(C.PROVEEDOR, C.PROV_ID, id, strField, data, "GetData", C_MODULE)) {
          switch (typeValue) {
            case Types.boolean:
              data = false;
              break;

            case Types.cuit:
            case Types.text:
              data = "";
              break;

            case Types.date:
            case Types.dateornull:
              data = Cairo.Constants.cSNODATE;
              break;

            case Types.currency:
            case Types.double:
            case Types.integer:
            case Types.long:
            case Types.single:
            case Types.id:
              data = 0;
              break;

            case Types.variant:
              data = Empty;
              break;
          }
        }

        return data;
      };

      self.load = function(id) {

        var m_apiPath = Cairo.Database.getAPIVersion();
        return Cairo.Database.getData("load[" + m_apiPath + "general/proveedor]", id).then(
          function(response) {

            if(response.success !== true) { return false; }

            if(response.data.id !== NO_ID) {

              m_id = Cairo.Database.valField(response.data, C.PROV_ID);
              m_name = Cairo.Database.valField(response.data, C.PROV_NAME);
              m_code = Cairo.Database.valField(response.data, C.PROV_CODE);
              m_contacto = Cairo.Database.valField(response.data, C.PROV_CONTACTO);
              m_descrip = Cairo.Database.valField(response.data, C.PROV_DESCRIP);
              m_cpg_id = Cairo.Database.valField(response.data, C.CPG_ID);
              m_condicionPago = Cairo.Database.valField(response.data, C.CPG_NAME);
              m_razonsocial = Cairo.Database.valField(response.data, C.PROV_RAZONSOCIAL);
              m_cuit = Cairo.Database.valField(response.data, C.PROV_CUIT);
              m_ingresosbrutos = Cairo.Database.valField(response.data, C.PROV_INGRESOSBRUTOS);
              m_catFiscal = Cairo.Database.valField(response.data, C.PROV_CATFISCAL);
              m_chequeorden = Cairo.Database.valField(response.data, C.PROV_CHEQUEORDEN);
              m_codpostal = Cairo.Database.valField(response.data, C.PROV_CODPOSTAL);
              m_localidad = Cairo.Database.valField(response.data, C.PROV_LOCALIDAD);
              m_calle = Cairo.Database.valField(response.data, C.PROV_CALLE);
              m_callenumero = Cairo.Database.valField(response.data, C.PROV_CALLENUMERO);
              m_piso = Cairo.Database.valField(response.data, C.PROV_PISO);
              m_depto = Cairo.Database.valField(response.data, C.PROV_DEPTO);
              m_tel = Cairo.Database.valField(response.data, C.PROV_TEL);
              m_fax = Cairo.Database.valField(response.data, C.PROV_FAX);
              m_email = Cairo.Database.valField(response.data, C.PROV_EMAIL);
              m_web = Cairo.Database.valField(response.data, C.PROV_WEB);
              m_pro_id = Cairo.Database.valField(response.data, C.PRO_ID);
              m_zon_id = Cairo.Database.valField(response.data, C.ZON_ID);
              m_provincia = Cairo.Database.valField(response.data, C.PRO_NAME);
              m_zona = Cairo.Database.valField(response.data, C.ZON_NAME);
              m_creditoctacte = Cairo.Database.valField(response.data, C.PROV_CREDITOCTACTE);
              m_creditototal = Cairo.Database.valField(response.data, C.PROV_CREDITOTOTAL);
              m_creditoactivo = Cairo.Database.valField(response.data, C.PROV_CREDITOACTIVO);
              m_active = Cairo.Database.valField(response.data, Cairo.Constants.ACTIVE);
              m_imprimeTicket = Cairo.Database.valField(response.data, C.PROV_IMPRIME_TICKET);
              m_lp_id = Cairo.Database.valField(response.data, C.LP_ID);
              m_listaPrecio = Cairo.Database.valField(response.data, C.LP_NAME);
              m_ld_id = Cairo.Database.valField(response.data, C.LD_ID);
              m_listaDescuento = Cairo.Database.valField(response.data, C.LD_NAME);

              m_nroctabanco = Cairo.Database.valField(response.data, C.PROV_NRO_CTA_BANCO);
              m_banco = Cairo.Database.valField(response.data, C.PROV_BANCO);
              m_cbu = Cairo.Database.valField(response.data, C.PROV_CBU);
              m_nrocliente = Cairo.Database.valField(response.data, C.PROV_NRO_CLIENTE);

              m_horario_m_desde = Cairo.Database.valField(response.data, C.PROV_HORARIO_MDESDE);
              m_horario_m_hasta = Cairo.Database.valField(response.data, C.PROV_HORARIO_MHASTA);
              m_horario_t_desde = Cairo.Database.valField(response.data, C.PROV_HORARIO_TDESDE);
              m_horario_t_hasta = Cairo.Database.valField(response.data, C.PROV_HORARIO_THASTA);

            }
            else {

              m_id = NO_ID;
              m_name = "";
              m_code = "";
              m_contacto = "";
              m_razonsocial = "";
              m_cuit = "";
              m_ingresosbrutos = "";
              m_catFiscal = csCatFiscal.cSCATFINSCRIPTO;
              m_chequeorden = "";
              m_codpostal = "";
              m_descrip = "";
              m_localidad = "";
              m_calle = "";
              m_callenumero = "";
              m_piso = "";
              m_depto = "";
              m_tel = "";
              m_fax = "";
              m_email = "";
              m_web = "";
              m_cpg_id = NO_ID;
              m_condicionPago = "";
              m_pro_id = NO_ID;
              m_zon_id = NO_ID;
              m_lp_id = NO_ID;
              m_listaPrecio = "";
              m_ld_id = NO_ID;
              m_listaDescuento = "";
              m_provincia = "";
              m_zona = "";
              m_creditoctacte = 0;
              m_creditototal = 0;
              m_creditoactivo = true;
              m_active = true;
              m_imprimeTicket = false;

              m_horario_m_desde = Cairo.Constants.cSNODATE;
              m_horario_m_hasta = Cairo.Constants.cSNODATE;
              m_horario_t_desde = Cairo.Constants.cSNODATE;
              m_horario_t_hasta = Cairo.Constants.cSNODATE;

              m_nroctabanco = "";
              m_banco = "";
              m_cbu = "";
              m_nrocliente = "";

            }

            if(!m_genericEdit.Load(m_id)) { return false; }

            return true;
          });
      };

      var pRefreshProperties = function() {
        var c = null;
        var abmGen = null;
        var filter = null;

        m_dialog.setTitle(m_name);

        var properties = m_dialog.getProperties();

        var property = properties.item(C.PROV_NAME);
        property.setValue(m_name);

        var property = properties.item(C.PROV_RAZONSOCIAL);
        property.setValue(m_razonsocial);

        var property = properties.item(C.PROV_CODE);
        property.setValue(m_code);

        var property = properties.item(Cairo.Constants.ACTIVE);
        property.setValue(m_active === true ? 1 : 0);

        var property = properties.item(C.PROV_IMPRIME_TICKET);
        property.setValue(Integer.parseInt(m_imprimeTicket));

        var property = properties.item(C.PROV_CONTACTO);
        property.setValue(m_contacto);

        var property = properties.item(C.PROV_CATFISCAL);
        property.setListItemData(m_catFiscal);

        var property = properties.item(C.PROV_CUIT);
        property.setValue(m_cuit);

        var property = properties.item(C.PROV_INGRESOSBRUTOS);
        property.setValue(m_ingresosbrutos);

        var property = properties.item(C.CPG_ID);
        property.setValue(m_condicionPago);
        property.setSelectId(m_cpg_id);

        var property = properties.item(C.PROV_CHEQUEORDEN);
        property.setValue(m_chequeorden);

        var property = properties.item(C.LP_ID);
        filter = "exists(select lp_id from listaprecioproveedor where prov_id ="+ m_id;
        filter = filter+ " and lp_id = listaprecio.lp_id)";
        property.setSelectFilter(filter);
        property.setValue(m_listaPrecio);
        property.setSelectId(m_lp_id);

        var property = properties.item(C.LD_ID);
        filter = "exists(select ld_id from listadescuentoproveedor where prov_id ="+ m_id;
        filter = filter+ " and ld_id = listadescuento.ld_id)";
        property.setSelectFilter(filter);
        property.setValue(m_listaDescuento);
        property.setSelectId(m_ld_id);

        var property = properties.item(C.PROV_CREDITOCTACTE);
        property.setValue(m_creditoctacte);

        var property = properties.item(C.PROV_CREDITOTOTAL);
        property.setValue(m_creditototal);

        var property = properties.item(C.PROV_CREDITOACTIVO);
        property.setValue(Integer.parseInt(m_creditoactivo));

        var property = properties.item(C.PROV_DESCRIP);
        property.setValue(m_descrip);

        var property = properties.item(C.PROV_CALLE);
        property.setValue(m_calle);

        var property = properties.item(C.PROV_CALLENUMERO);
        property.setValue(m_callenumero);

        var property = properties.item(C.PROV_PISO);
        property.setValue(m_piso);

        var property = properties.item(C.PROV_DEPTO);
        property.setValue(m_depto);

        var property = properties.item(C.PROV_TEL);
        property.setValue(m_tel);

        var property = properties.item(C.PROV_FAX);
        property.setValue(m_fax);

        var property = properties.item(C.PROV_EMAIL);
        property.setValue(m_email);

        var property = properties.item(C.PROV_WEB);
        property.setValue(m_web);

        var property = properties.item(C.PROV_CODPOSTAL);
        property.setValue(m_codpostal);

        var property = properties.item(C.PROV_HORARIO_MDESDE);
        property.setValue(m_horario_m_desde);

        var property = properties.item(C.PROV_HORARIO_MHASTA);
        property.setValue(m_horario_m_hasta);

        var property = properties.item(C.PROV_HORARIO_TDESDE);
        property.setValue(m_horario_t_desde);

        var property = properties.item(C.PROV_HORARIO_THASTA);
        property.setValue(m_horario_t_hasta);

        var property = properties.item(C.PROV_LOCALIDAD);
        property.setValue(m_localidad);

        var property = properties.item(C.PRO_ID);
        property.setValue(m_provincia);
        property.setSelectId(m_pro_id);

        var property = properties.item(C.ZON_ID);
        property.setValue(m_zona);
        property.setSelectId(m_zon_id);

        c = properties.item(C_CAIS);
        if(!loadCAI(c)) { return; }
        m_itemsDeletedCAIS = "";

        c = properties.item(C_CUENTAGRUPO);
        if(!loadCuentaGrupo(c)) { return; }
        m_itemsDeletedCuentaGrupo = "";

        c = properties.item(C_RETENCION);
        if(!loadRetencion(c)) { return; }
        m_itemsDeletedRetenciones = "";

        c = properties.item(C_EMPRESAS);
        if(!loadEmpresas(c)) { return; }

        c = properties.item(C_DPTO);
        if(!loadDpto(c)) { return; }
        m_itemsDeletedDptos = "";

        c = properties.item(C_CCOS);
        if(!loadCcos(c)) { return; }
        m_itemsDeletedCcos = "";

        m_genericEdit.RefreshProperties(m_dialog);

        abmGen = m_dialog;
        abmGen.ShowValues(m_dialog.getProperties());

      };

      var setGridDpto = function(property) {

        var w_grid = property.getGrid();

        var w_columns = w_grid.getColumns();

        w_columns.clear();

        var elem = w_columns.add(null);
        elem.setVisible(false);
        elem.setKey(KI_DPTOPROV_ID);

        var elem = w_columns.add(null);
        // Departamento
        elem.setName(getText(1278, ""));
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.DEPARTAMENTO);
        elem.setWidth(3500);
        elem.setKey(KI_DPTO_ID);

        var w_rows = w_grid.getRows();

        w_rows.clear();
        return true;
      };

      var loadDpto = function() {


        for(var _i = 0; _i < m_data.dpto.length; _i += 1) {

          var elem = w_rows.add(null, rs(C.DPTO_PROV_ID).Value);

          var elem = elem.add(null);
          elem.Value = Cairo.Database.valField(m_data.dpto[_i], C.DPTO_PROV_ID);
          elem.setKey(KI_DPTOPROV_ID);

          var elem = elem.add(null);
          elem.Value = Cairo.Database.valField(m_data.dpto[_i], C.DPTO_NAME);
          elem.Id = rs(C.DPTO_ID).Value;
          elem.setKey(KI_DPTO_ID);

        }

        return true;
      };

      var setGridCcos = function(property) {

        var w_grid = property.getGrid();

        var w_columns = w_grid.getColumns();

        w_columns.clear();

        var elem = w_columns.add(null);
        elem.setVisible(false);
        elem.setKey(KI_PROVCCOS_ID);

        var elem = w_columns.add(null);
        // Centro de Costo
        elem.setName(getText(1057, ""));
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.CENTROCOSTO);
        elem.setWidth(3500);
        elem.setKey(KI_CCOS_ID);

        var elem = w_columns.add(null);
        // Articulo
        elem.setName(getText(1367, ""));
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.PRODUCTOCOMPRA);
        elem.setWidth(3500);
        elem.setKey(KI_PR_ID);

        var w_rows = w_grid.getRows();

        w_rows.clear();
        return true;
      };

      var loadCcos = function() {


        for(var _i = 0; _i < m_data.ccos.length; _i += 1) {

          var elem = w_rows.add(null, rs(C.PROV_CCOS_ID).Value);

          var elem = elem.add(null);
          elem.Value = Cairo.Database.valField(m_data.ccos[_i], C.PROV_CCOS_ID);
          elem.setKey(KI_PROVCCOS_ID);

          var elem = elem.add(null);
          elem.Value = Cairo.Database.valField(m_data.ccos[_i], C.CCOS_NAME);
          elem.Id = rs(C.CCOS_ID).Value;
          elem.setKey(KI_CCOS_ID);

          var elem = elem.add(null);
          elem.Value = Cairo.Database.valField(m_data.ccos[_i], C.PR_NOMBRECOMPRA);
          elem.Id = Cairo.Database.valField(m_data.ccos[_i], C.PR_ID);
          elem.setKey(KI_PR_ID);

        }

        return true;
      };

      var setGridEmpresas = function(property) {

        var w_grid = property.getGrid();

        var w_columns = w_grid.getColumns();

        w_columns.clear();

        var elem = w_columns.add(null);
        elem.setVisible(false);

        var elem = w_columns.add(null);
        // Empresa
        elem.setName(getText(1114, ""));
        elem.setType(Dialogs.PropertyType.text);
        elem.setWidth(3500);
        elem.setKey(KI_EMP_ID);

        var elem = w_columns.add(null);
        elem.setWidth(800);
        elem.setType(Dialogs.PropertyType.check);
        elem.setKey(KI_EMPPROV_ID);

        var bSelect = null;

        if(!rs.isEOF()) {
          rs.MoveLast;
          rs.MoveFirst;
          bSelect = rs.RecordCount === 1;
        }

        var w_rows = w_grid.getRows();

        w_rows.clear();
        return true;
      };

      var loadEmpresas = function() {


        for(var _i = 0; _i < m_data.empresas.length; _i += 1) {

          var elem = w_rows.add(null);

          var elem = elem.add(null);
          elem.Value = rs(Cairo.Constants.EMP_ID).Value;

          var elem = elem.add(null);
          elem.Value = Cairo.Database.valField(m_data.empresas[_i], Cairo.Constants.EMP_NAME);
          elem.Id = rs(Cairo.Constants.EMP_ID).Value;
          elem.setKey(KI_EMP_ID);

          var elem = elem.add(null);
          if(bSelect) {
            elem.Id = 1;
          }
          else {
            elem.Id = Cairo.Database.valField(m_data.empresas[_i], C.EMP_PROV_ID);
          }
          elem.Value = elem.Id;
          elem.setKey(KI_EMPPROV_ID);

        }

        return true;
      };

      var setGridRetencion = function(property) {

        var w_grid = property.getGrid();

        var w_columns = w_grid.getColumns();

        w_columns.clear();

        var elem = w_columns.add(null);
        elem.setVisible(false);
        elem.setKey(KI_PROVRET_ID);

        var elem = w_columns.add(null);
        // Tipo
        elem.setName(getText(1223, ""));
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.RETENCIONTIPO);
        elem.setWidth(3500);
        elem.setKey(KI_RETT_ID);

        var elem = w_columns.add(null);
        // Retención
        elem.setName(getText(1403, ""));
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.RETENCION);
        elem.setWidth(3500);
        elem.setKey(KI_RET_ID);

        var elem = w_columns.add(null);
        // Desde
        elem.setName(getText(2532, ""));
        elem.setType(Dialogs.PropertyType.date);
        elem.setWidth(3500);
        elem.setKey(KI_RET_DESDE);

        var elem = w_columns.add(null);
        // Hasta
        elem.setName(getText(2533, ""));
        elem.setType(Dialogs.PropertyType.date);
        elem.setWidth(3500);
        elem.setKey(KI_RET_HASTA);

        var w_rows = w_grid.getRows();

        w_rows.clear();
        return true;
      };

      var loadRetencion = function() {


        for(var _i = 0; _i < m_data.retencion.length; _i += 1) {

          var elem = w_rows.add(null, rs(C.PROV_RET_ID).Value);

          var elem = elem.add(null);
          elem.Value = rs(C.PROV_RET_ID).Value;
          elem.setKey(KI_PROVRET_ID);

          var elem = elem.add(null);
          elem.Value = Cairo.Database.valField(m_data.retencion[_i], C.RETT_NAME);
          elem.Id = Cairo.Database.valField(m_data.retencion[_i], C.RETT_ID);
          elem.setKey(KI_RETT_ID);

          var elem = elem.add(null);
          elem.Value = Cairo.Database.valField(m_data.retencion[_i], C.RET_NAME);
          elem.Id = Cairo.Database.valField(m_data.retencion[_i], C.RET_ID);
          elem.setKey(KI_RET_ID);

          var elem = elem.add(null);
          elem.Value = Cairo.Database.valField(m_data.retencion[_i], C.PROV_RET_DESDE);
          elem.setKey(KI_RET_DESDE);

          var elem = elem.add(null);
          elem.Value = Cairo.Database.valField(m_data.retencion[_i], C.PROV_RET_HASTA);
          elem.setKey(KI_RET_HASTA);

        }

        return true;
      };

      var setGridCuentaGrupo = function(property) {

        var w_grid = property.getGrid();

        var w_columns = w_grid.getColumns();

        w_columns.clear();

        var elem = w_columns.add(null);
        elem.setVisible(false);
        elem.setKey(KI_PROVCUEG_ID);

        var elem = w_columns.add(null);
        // Grupo
        elem.setName(getText(1404, ""));
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.CUENTAGRUPO);
        elem.setWidth(3500);
        elem.setKey(KI_CUEG_ID);
        elem.setSelectFilter("cueg_tipo in (2,3)");

        var elem = w_columns.add(null, C.CUE_ID);
        // Cuenta
        elem.setName(getText(1267, ""));
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.CUENTA);
        elem.setSelectFilter("("+ C.CUEC_ID+ "="+ csECuentaCategoria.cSECUECACREEDORES.toString()+ " Or "+ C.CUEC_ID+ "="+ csECuentaCategoria.cSECUECDEPOSITOCUPONES.toString()+ " Or "+ C.CUEC_ID+ "="+ csECuentaCategoria.cSECUECBANCOS.toString()+ " Or "+ C.CUEC_ID+ "="+ csECuentaCategoria.cSECUECBIENESDECAMBIO.toString()+ " Or "+ C.CUE_PRODUCTO+ " <> 0)");

        elem.setWidth(3500);
        elem.setKey(KI_CUE_ID);

        var w_rows = w_grid.getRows();

        w_rows.clear();
        return true;
      };

      var loadCuentaGrupo = function() {


        for(var _i = 0; _i < m_data.cuentaGrupo.length; _i += 1) {

          var elem = w_rows.add(null, rs(C.PROV_CUEG_ID).Value);

          var elem = elem.add(null);
          elem.Value = rs(C.PROV_CUEG_ID).Value;
          elem.setKey(KI_PROVCUEG_ID);

          var elem = elem.add(null);
          elem.Value = Cairo.Database.valField(m_data.cuentaGrupo[_i], C.CUEG_NAME);
          elem.Id = Cairo.Database.valField(m_data.cuentaGrupo[_i], C.CUEG_ID);
          elem.setKey(KI_CUEG_ID);

          var elem = elem.add(null);
          elem.Value = Cairo.Database.valField(m_data.cuentaGrupo[_i], C.CUE_NAME);
          elem.Id = Cairo.Database.valField(m_data.cuentaGrupo[_i], C.CUE_ID);
          elem.setKey(KI_CUE_ID);

        }

        return true;
      };

      var setGridCAIs = function(property) {

        var w_grid = property.getGrid();

        var w_columns = w_grid.getColumns();

        w_columns.clear();

        var elem = w_columns.add(null);
        elem.setVisible(false);
        elem.setKey(KI_PROVC_ID);

        var elem = w_columns.add(null);
        // N° CAI
        elem.setName(getText(1406, ""));
        elem.setType(Dialogs.PropertyType.text);
        elem.setWidth(1200);
        elem.setKey(KI_NUMERO);

        var elem = w_columns.add(null);
        // sucursal
        elem.setName(getText(1281, ""));
        elem.setType(Dialogs.PropertyType.text);
        elem.setWidth(1200);
        elem.setKey(KI_SUCURSAL);

        var elem = w_columns.add(null);
        // Vencimiento
        elem.setName(getText(1405, ""));
        elem.setType(Dialogs.PropertyType.date);
        elem.setWidth(1200);
        elem.setKey(KI_FECHAVTO);

        var elem = w_columns.add(null);
        elem.setName(Cairo.Constants.DESCRIPTION_LABEL);
        elem.setType(Dialogs.PropertyType.text);
        elem.setWidth(3500);
        elem.setKey(KI_DESCRIP);

        var w_rows = w_grid.getRows();

        w_rows.clear();
        return true;
      };

      var loadCAI = function() {


        for(var _i = 0; _i < m_data.cAIs.length; _i += 1) {

          var elem = w_rows.add(null, rs(C.PROVC_ID).Value);

          var elem = elem.add(null);
          elem.Value = rs(C.PROVC_ID).Value;
          elem.setKey(KI_PROVC_ID);

          var elem = elem.add(null);
          elem.Value = Cairo.Database.valField(m_data.cAIs[_i], C.PROVC_NUMERO);
          elem.setKey(KI_NUMERO);

          var elem = elem.add(null);
          elem.Value = Cairo.Database.valField(m_data.cAIs[_i], C.PROVC_SUCURSAL);
          elem.setKey(KI_SUCURSAL);

          var elem = elem.add(null);
          elem.Value = Cairo.Database.valField(m_data.cAIs[_i], C.PROVC_FECHAVTO);
          elem.setKey(KI_FECHAVTO);

          var elem = elem.add(null);
          elem.Value = Cairo.Database.valField(m_data.cAIs[_i], C.PROVC_DESCRIP);
          elem.setKey(KI_DESCRIP);

        }

        return true;
      };

      var isEmptyRowDpto = function(row, rowIndex) {
        var cell = null;

        var bRowIsEmpty = true;

        var _count = row.size();
        for (var _i = 0; _i < _count; _i++) {
          cell = row.item(_i);
          switch (cell.getKey()) {
            case KI_DPTO_ID:
              if(!Cairo.Util.valEmpty(cell.getValue(), Types.text)) {
                bRowIsEmpty = false;
                break;
              }
              break;
          }
        }

        return bRowIsEmpty;
      };

      var isEmptyRowCcos = function(row, rowIndex) {
        var cell = null;

        var bRowIsEmpty = true;

        var _count = row.size();
        for (var _i = 0; _i < _count; _i++) {
          cell = row.item(_i);
          switch (cell.getKey()) {
            case KI_PR_ID:
              if(!Cairo.Util.valEmpty(cell.getValue(), Types.text)) {
                bRowIsEmpty = false;
                break;
              }
              break;

            case KI_CCOS_ID:
              if(!Cairo.Util.valEmpty(cell.getValue(), Types.text)) {
                bRowIsEmpty = false;
                break;
              }
              break;
          }
        }

        return bRowIsEmpty;
      };

      var isEmptyRowRetencion = function(row, rowIndex) {
        var cell = null;

        var bRowIsEmpty = true;

        var _count = row.size();
        for (var _i = 0; _i < _count; _i++) {
          cell = row.item(_i);
          switch (cell.getKey()) {
            case KI_RET_ID:
              if(!Cairo.Util.valEmpty(cell.getValue(), Types.text)) {
                bRowIsEmpty = false;
                break;
              }
              break;
          }
        }

        return bRowIsEmpty;
      };

      var isEmptyRowCuentaGrupo = function(row, rowIndex) {
        var cell = null;

        var bRowIsEmpty = true;

        var _count = row.size();
        for (var _i = 0; _i < _count; _i++) {
          cell = row.item(_i);
          switch (cell.getKey()) {
            case KI_CUE_ID:
              if(!Cairo.Util.valEmpty(cell.getValue(), Types.text)) {
                bRowIsEmpty = false;
                break;
              }
              break;

            case KI_CUEG_ID:
              if(!Cairo.Util.valEmpty(cell.getValue(), Types.text)) {
                bRowIsEmpty = false;
                break;
              }
              break;
          }
        }

        return bRowIsEmpty;
      };

      var isEmptyRow = function(row, rowIndex) {
        var cell = null;
        var strRow = null;

        strRow = " (Fila "+ rowIndex.toString()+ ")";

        var bRowIsEmpty = true;

        var _count = row.size();
        for (var _i = 0; _i < _count; _i++) {
          cell = row.item(_i);
          switch (cell.getKey()) {
            case KI_NUMERO:
              if(!Cairo.Util.valEmpty(cell.getValue(), Types.text)) {
                bRowIsEmpty = false;
                break;
              }
              break;

            case KI_FECHAVTO:
              if(!Cairo.Util.valEmpty(cell.getValue(), Types.date)) {
                bRowIsEmpty = false;
                break;
              }
              break;
          }
        }

        return bRowIsEmpty;
      };

      var saveItemsRetencion = function(mainTransaction) {
        var transaction = new Cairo.Database.Transaction();

        var property = m_dialog.getProperties().item(C_RETENCION);
        var row = null;
        var cell = null;

        var _count = property.getGrid().getRows().size();
        for (var _i = 0; _i < _count; _i++) {
          row = property.getGrid().getRows().item(_i);

          var register = new Cairo.Database.Register();

          var fields = register.getFields();
          register.setFieldId(C.PROV_RET_ID);
          register.setTable(C.PROVEEDORRETENCION);
          register.setId(Cairo.Constants.NEW_ID);

          var _count = row.size();
          for (var _j = 0; _j < _count; _j++) {
            cell = row.item(_j);
            switch (cell.getKey()) {

              case KI_PROVRET_ID:
                if(!m_copy) {
                  register.setId(Cairo.Util.val(cell.getValue()));
                }
                break;

              case KI_RET_ID:
                fields.add(C.RET_ID, cell.getId(), Types.id);

                break;

              case KI_RET_DESDE:
                fields.add(C.PROV_RET_DESDE, cell.getValue(), Types.date);

                break;

              case KI_RET_HASTA:
                fields.add(C.PROV_RET_HASTA, cell.getValue(), Types.date);
                break;
            }
          }

          fields.add(C.PROV_ID, m_id, Types.id);

          transaction.addRegister(register);
        }

        if(LenB(m_itemsDeletedRetenciones) && !m_copy) {
          m_itemsDeletedRetenciones = RemoveLastColon(m_itemsDeletedRetenciones);

          if(!Cairo.Database.execute(sqlstmt, "saveItemsRetencion", C_MODULE)) { return false; }
        }

        mainTransaction.addTransaction(transaction);

        return true;
      };

      var pSaveItemsDpto = function(mainTransaction) {
        var transaction = new Cairo.Database.Transaction();

        var property = m_dialog.getProperties().item(C_DPTO);
        var row = null;
        var cell = null;

        var _count = property.getGrid().getRows().size();
        for (var _i = 0; _i < _count; _i++) {
          row = property.getGrid().getRows().item(_i);

          var register = new Cairo.Database.Register();

          var fields = register.getFields();
          register.setFieldId(C.DPTO_PROV_ID);
          register.setTable(C.DEPARTAMENTOPROVEEDOR);
          register.setId(Cairo.Constants.NEW_ID);

          var _count = row.size();
          for (var _j = 0; _j < _count; _j++) {
            cell = row.item(_j);
            switch (cell.getKey()) {

              case KI_DPTOPROV_ID:
                if(!m_copy) {
                  register.setId(Cairo.Util.val(cell.getValue()));
                }
                break;

              case KI_DPTO_ID:
                fields.add(C.DPTO_ID, cell.getId(), Types.id);
                break;
            }
          }

          fields.add(C.PROV_ID, m_id, Types.id);

          transaction.addRegister(register);
        }

        if(LenB(m_itemsDeletedDptos) && !m_copy) {
          m_itemsDeletedDptos = RemoveLastColon(m_itemsDeletedDptos);

          if(!Cairo.Database.execute(sqlstmt, "pSaveItemsDpto", C_MODULE)) { return false; }
        }

        mainTransaction.addTransaction(transaction);

        return true;
      };

      var pSaveItemsCcos = function(mainTransaction) {
        var transaction = new Cairo.Database.Transaction();

        var property = m_dialog.getProperties().item(C_CCOS);
        var row = null;
        var cell = null;

        var _count = property.getGrid().getRows().size();
        for (var _i = 0; _i < _count; _i++) {
          row = property.getGrid().getRows().item(_i);

          var register = new Cairo.Database.Register();

          var fields = register.getFields();
          register.setFieldId(C.PROV_CCOS_ID);
          register.setTable(C.PROVEEDORCENTROCOSTO);
          register.setId(Cairo.Constants.NEW_ID);

          var _count = row.size();
          for (var _j = 0; _j < _count; _j++) {
            cell = row.item(_j);
            switch (cell.getKey()) {

              case KI_PROVCCOS_ID:
                if(!m_copy) {
                  register.setId(Cairo.Util.val(cell.getValue()));
                }
                break;

              case KI_CCOS_ID:
                fields.add(C.CCOS_ID, cell.getId(), Types.id);
                break;

              case KI_PR_ID:
                fields.add(C.PR_ID, cell.getId(), Types.id);
                break;
            }
          }

          fields.add(C.PROV_ID, m_id, Types.id);

          transaction.addRegister(register);
        }

        if(LenB(m_itemsDeletedCcos) && !m_copy) {
          m_itemsDeletedCcos = RemoveLastColon(m_itemsDeletedCcos);

          if(!Cairo.Database.execute(sqlstmt, "pSaveItemsCcos", C_MODULE)) { return false; }
        }

        mainTransaction.addTransaction(transaction);

        return true;
      };

      var pSaveItemsEmpresa = function(mainTransaction) {
        var transaction = new Cairo.Database.Transaction();

        if(!Cairo.Database.execute(sqlstmt, "pSaveItemsEmpresa", C_MODULE)) { return false; }

        var property = m_dialog.getProperties().item(C_EMPRESAS);
        var row = null;

        var _count = property.getGrid().getRows().size();
        for (var _i = 0; _i < _count; _i++) {
          row = property.getGrid().getRows().item(_i);

          if(Dialogs.cell(row, KI_EMPPROV_ID).getID()) {
            var register = new Cairo.Database.Register();

            register.setFieldId(C.EMP_PROV_ID);
            register.setTable(C.EMPRESAPROVEEDOR);
            register.setId(Cairo.Constants.NEW_ID);

            register.getFields().add2(Cairo.Constants.EMP_ID, Dialogs.cell(row, KI_EMP_ID).getID(), Types.id);

            register.getFields().add2(C.PROV_ID, m_id, Types.id);

            register.getFields().setHaveLastUpdate(true);
            register.getFields().setHaveWhoModify(true);

            transaction.addRegister(register);
          }
        }

        mainTransaction.addTransaction(transaction);

        return true;
      };

      var pSaveItemsCuentaGrupo = function(mainTransaction) {
        var transaction = new Cairo.Database.Transaction();

        var property = m_dialog.getProperties().item(C_CUENTAGRUPO);

        var row = null;
        var cell = null;

        var _count = property.getGrid().getRows().size();
        for (var _i = 0; _i < _count; _i++) {
          row = property.getGrid().getRows().item(_i);

          var register = new Cairo.Database.Register();

          var fields = register.getFields();
          register.setFieldId(C.PROV_CUEG_ID);
          register.setTable(C.PROVEEDORCUENTAGRUPO);
          register.setId(Cairo.Constants.NEW_ID);

          var _count = row.size();
          for (var _j = 0; _j < _count; _j++) {
            cell = row.item(_j);
            switch (cell.getKey()) {

              case KI_PROVCUEG_ID:
                if(!m_copy) {
                  register.setId(Cairo.Util.val(cell.getValue()));
                }
                break;

              case KI_CUEG_ID:
                register.getFields().add2(C.CUEG_ID, cell.getId(), Types.id);
                break;

              case KI_CUE_ID:
                fields.add(C.CUE_ID, cell.getId(), Types.id);
                break;
            }
          }

          fields.add(C.PROV_ID, m_id, Types.id);

          transaction.addRegister(register);
        }

        if(LenB(m_itemsDeletedCuentaGrupo) && !m_copy) {
          m_itemsDeletedCuentaGrupo = RemoveLastColon(m_itemsDeletedCuentaGrupo);

          if(!Cairo.Database.execute(sqlstmt, "pSaveItemsCuentaGrupo", C_MODULE)) { return false; }
        }

        mainTransaction.addTransaction(transaction);

        return true;
      };

      var validateCuitProveedor = function(cuit) {
        var _rtn = null;
        try {

          var sqlstmt = null;
          var rs = null;

          if(LenB(cuit)) {

            if(!Object.validateNroCuit(cuit, false)) { return _rtn; }

            sqlstmt = "sp_ProveedorValidateCuit "+ Cairo.Database.sqlString(cuit);

            if(!Cairo.Database.openRs(sqlstmt, rs)) { return _rtn; }

            if(!rs.isEOF()) {

              if(m_id != Cairo.Database.valField(rs.getFields(), C.PROV_ID)) {
                MsgWarning(getText(1452, "", Cairo.Database.valField(rs.getFields(), C.PROV_RAZONSOCIAL)), getText(1453, ""));
                //El CUIT ya esta usado por el proveedor (1)
                //C.U.I.T. Proveedor
                return _rtn;
              }
            }
          }

          _rtn = true;

          // **TODO:** goto found: GoTo ExitProc;
        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, "validateCuitProveedor", C_MODULE, "");
          // **TODO:** label found: ExitProc:;
        }
        // **TODO:** on error resume next found !!!

        return _rtn;
      };

      var pGetCtaGrupo = function() {
        return m_dialog.getProperties().item(C_CUENTAGRUPO);
      };

      self.initialize = function() {
        // **TODO:** on error resume next found !!!
        //  Error al grabar el proveedor
        c_ErrorSave = getText(1377, "");
      };

      self.destroy = function() {
        m_dialog = null;
        m_listController = null;
      };

      //---------------------------------------------------------------------------
      // Validar CBU
      //
      self.chrTran = function(source, toSearch, value) {
        var i = null;
        var rtn = null;
        var c = null;

        for (i = 1; i <= source.Length; i++) {
          c = source.Substring(i, 1);
          if(toSearch.indexOf(c, 1)) {
            c = value;
          }
          rtn = rtn+ c;
        }

        return rtn;
      };

      var pValidarCBU = function(tcCBU) {

        var lcCBU = null;
        var lcBloque1 = null;
        var lcBloque2 = null;

        lcCBU = self.chrTran(tcCBU, self.chrTran(tcCBU, "1234567890", ""), "");

        if(lcCBU.Length === 22) {

          lcBloque1 = lcCBU.Substring(1, 8);
          lcBloque2 = lcCBU.Substring(9, 14);

          if(!(pValidarDigito(lcBloque1) && pValidarDigito(lcBloque2))) {

            //  El CBU ingresado no es valido
            MsgWarning(getText(4712, ""));
            return null;
          }

        }
        else {

          // Largo de CBU incorrecto
          MsgWarning(getText(4713, ""));
          return null;

        }

        return true;

      };

      var pValidarDigito = function(tcBloque) {

        Const(Pond === "9713");

        var lnSuma = null;
        var lnLargo = null;
        var ln = null;
        var lcDigito = null;
        var lcBloque = null;

        lnSuma = 0;
        lnLargo = tcBloque.Length;
        lcDigito = tcBloque.Substring(lnLargo, 1);
        lcBloque = tcBloque.Substring(1, lnLargo - 1);
        for (ln = 1; ln <= lnLargo - 1; ln++) {
          lnSuma = lnSuma + Cairo.Util.val(lcBloque.Substring(lnLargo - ln, 1)) * Cairo.Util.val(Pond.Substring(4 - ln Mod 4 + 1, 1));
        }

        return lcDigito === Str(10 - lnSuma Mod 10).Substring(Str(10 - lnSuma Mod 10).Length - 1);
      };

      self.saveExpress = function(reLoad) {
        var _rtn = null;
        var register = null;
        register = new cRegister();

        register.setFieldId(C.PROV_ID);
        register.setTable(C.PROVEEDOR);

        if(m_copy) {
          register.setId(Cairo.Constants.NEW_ID);
        }
        else {
          register.setId(m_id);
        }

        var w_fields = register.getFields();
        w_fields.add2(C.PROV_NAME, m_name, Types.text);
        w_fields.add2(C.PROV_CODE, m_code, Types.text);
        w_fields.add2(C.PROV_CONTACTO, m_contacto, Types.text);
        w_fields.add2(C.PROV_RAZONSOCIAL, m_razonsocial, Types.text);
        w_fields.add2(C.PROV_CUIT, m_cuit, Types.text);
        w_fields.add2(C.PROV_INGRESOSBRUTOS, m_ingresosbrutos, Types.text);
        w_fields.add2(C.PROV_CAT_FISCAL, m_catFiscal, Types.integer);
        w_fields.add2(C.PROV_CHEQUEORDEN, m_chequeorden, Types.text);
        w_fields.add2(C.PROV_CODPOSTAL, m_codpostal, Types.text);
        w_fields.add2(C.PROV_LOCALIDAD, m_localidad, Types.text);
        w_fields.add2(C.PROV_CALLE, m_calle, Types.text);
        w_fields.add2(C.PROV_CALLENUMERO, m_callenumero, Types.text);
        w_fields.add2(C.PROV_PISO, m_piso, Types.text);
        w_fields.add2(C.PROV_DEPTO, m_depto, Types.text);
        w_fields.add2(C.PROV_TEL, m_tel, Types.text);
        w_fields.add2(C.PROV_FAX, m_fax, Types.text);
        w_fields.add2(C.PROV_EMAIL, m_email, Types.text);
        w_fields.add2(C.PROV_WEB, m_web, Types.text);
        w_fields.add2(C.PRO_ID, m_pro_id, Types.id);
        w_fields.add2(C.ZON_ID, m_zon_id, Types.id);
        w_fields.add2(Cairo.Constants.ACTIVE, m_active, Types.boolean);

        w_fields.setHaveLastUpdate(true);
        w_fields.setHaveWhoModify(true);
        //Error al grabar Proveedor
        if(!Cairo.Database.saveEx(register, , C.PROV_CODE, "Save", C_MODULE, getText(1377, ""))) { return _rtn; }

        m_id = register.getID();

        if(reLoad) {
          _rtn = self.load(m_id);
        }
        else {
          _rtn = true;
        }

        return _rtn;
      };

      self.updateCAI = function(properties) {
        var register = null;
        var fields = null;
        var property = null;

        register = new cRegister();
        fields = register.getFields();
        register.setFieldId(C.PROVC_ID);
        register.setTable(C.PROVEEDORCAI);
        register.setId(Cairo.Constants.NEW_ID);

        var _count = properties.size();
        for (var _i = 0; _i < _count; _i++) {
          property = properties.item(_i);
          switch (property.getKey()) {
            case KI_PROVC_ID:
              register.setId(Cairo.Util.val(property.getValue()));
              break;

            case KI_NUMERO:
              fields.add2(C.PROVC_NUMERO, property.getValue(), Types.text);
              break;

            case KI_DESCRIP:
              fields.add2(C.PROVC_DESCRIP, property.getValue(), Types.text);
              break;

            case KI_FECHAVTO:
              fields.add2(C.PROVC_FECHAVTO, property.getValue(), Types.date);
              break;

            case KI_ACTIVO:
              fields.add2(Cairo.Constants.ACTIVE, property.getValue(), Types.boolean);
              break;

            case KI_SUCURSAL:
              fields.add2(C.PROVC_SUCURSAL, property.getValue(), Types.text);
              break;
          }
        }

        fields.add2(C.PROV_ID, m_id, Types.id);

        //Error al grabar CAI
        if(!Cairo.Database.save(register, , "pSaveItemsCAIS", C_MODULE, getText(1377, ""))) { return false; }

        var sqlstmt = null;

        return true;
      };

  self.terminate = function() {

    m_editing = false;

    try {
      if(m_listController != null) {
        updateList();
        m_listController.removeEditor(self);
      }
    }
    catch (ignored) {
      Cairo.logError('Error in terminate', ignored);
    }
  };
  initialize();

      return self;
    };

    Edit.Controller = { getEditor: createObject };

    Edit.Controller.edit = function(id) {
      var editor = Cairo.Proveedor.Edit.Controller.getEditor();
      var dialog = Cairo.Dialogs.Views.Controller.newDialog();

      editor.setDialog(dialog);
      editor.edit(id);
    };

  });

  Cairo.module("Proveedor.List", function(List, Cairo, Backbone, Marionette, $, _) {

    var NO_ID = Cairo.Constants.NO_ID;

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
            entitiesTitle: "Proveedores",
            entityName: "proveedor",
            entitiesName: "proveedores"
          });

          self.showBranch = function(branchId) {
            Cairo.log("Loading nodeId: " + branchId);
            Cairo.Tree.List.Controller.listBranch(branchId, Cairo.Tree.List.Controller.showItems, self);
          };

          // progress message
          //
          Cairo.LoadingMessage.show("Proveedores", "Loading Proveedores from CrowSoft Cairo server.");

          // create the tree region
          //
          Cairo.addRegions({ proveedorTreeRegion: tabId });

          // create the dialog
          //
          Cairo.Tree.List.Controller.list(
            Cairo.Tables.PROVEEDOR,
            new Cairo.Tree.List.TreeLayout({ model: self.entityInfo }),
            Cairo.proveedorTreeRegion,
            self);

        };

        // create the tab
        //
        Cairo.mainTab.showTab("Proveedores", "proveedorTreeRegion", "#general/proveedores", createTreeDialog);

      }
    };
  });

  /*

   Proveedor
   Proveedores
   proveedor
   proveedores
   PROVEEDOR

   */

}());  