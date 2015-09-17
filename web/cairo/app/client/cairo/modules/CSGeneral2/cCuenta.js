(function() {
  "use strict";

  Cairo.module("Cuenta.Edit", function(Edit, Cairo, Backbone, Marionette, $, _) {

    var createObject = function() {

      var self = {};

      var getText = Cairo.Language.getText;

      var Dialogs = Cairo.Dialogs;
      var DB = Cairo.Database;
      var C = Cairo.General.Constants;
      var NO_ID = Cairo.Constants.NO_ID;

      var C_MODULE = "cCuenta";

      var K_NAME = 1;
      var K_CODE = 2;
      var K_ACTIVE = 3;
      var K_DESCRIPCION = 5;
      var K_LLEVA_CENTRO_COSTO = 6;
      var K_IDENTIFICACIONEXTERNA = 8;
      var K_CATEGORIA = 9;
      var K_PATRIMONIAL = 11;
      var K_RESULTADO = 12;
      var K_OTRO = 13;
      var K_MON_ID = 14;
      var K_BCO_ID = 15;
      var K_PRODUCTO = 16;
      var K_EMP_ID = 18;
      var K_CODIGO_RPT = 19;
      var K_ES_EFECTIVO = 20;
      var K_ES_TICKET = 21;

      var m_id = 0;
      var m_name = "";
      var m_code = "";
      var m_active;
      var m_categoriaId = 0;
      var m_categoria = "";
      var m_descripcion = "";
      var m_costoTipo = 0;
      var m_validaPago = 0;
      var m_saldoCashFlow;
      var m_cashFlow = 0;
      var m_llevaCentroCosto;
      var m_producto;
      var m_identificacionExterna = "";
      var m_monId = 0;
      var m_moneda = "";
      var m_bco_id = 0;
      var m_banco = "";
      var m_empId = 0;
      var m_empresa = "";
      var m_codigoRPT = "";
      var m_esEfectivo;
      var m_esTicket;

      var m_categoriaTipo;

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

        m_listController.updateEditorKey(self, NO_ID);

        var property = m_dialog.getProperties().item(C.CUE_CODE);
        property.setValue(Cairo.Constants.COPY_OF + property.getValue());

        m_dialog.showValue(m_dialog.getProperties().item(C.CUE_CODE));
        m_dialog.showValue(m_dialog.getProperties().item(C.CUE_NAME));

        m_copy = true;
      };

      self.editNew = function() {

        updateList();

        m_isNew = true;

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
        return m_id !== NO_ID;
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

          doc.setClientTable(C.CUENTA);
          doc.setClientTableID(m_id);

          _rtn = doc.showDocs(Cairo.Database);

        }
        catch(ex) {
          Cairo.manageErrorEx(ex.message, ex, Cairo.Constants.SHOW_DOCUMENTS_FUNCTION, C_MODULE, "");
        }
              
        return _rtn;
      };

      self.messageEx = function(messageId, info) {
        var _rtn = null;
        switch (messageId) {

          case Dialogs.Message.MSG_DOC_INFO:

            Cairo.Documentation.show("", "", Cairo.Security.Actions.General.NEW_CUENTA);
            _rtn = Dialogs.Message.MSG_DOC_INFO_HANDLED;
            break;

          default:
            _rtn = true;
            break;
        }
      
        return Cairo.Promises.resolvedPromise(_rtn);
      };

      self.discardChanges = function() {
        return Cairo.Promises.resolvedPromise(refreshCollection());
      };

      self.propertyChange = function(key) {
        var _rtn = null;
        _rtn = true;

        var properties = m_dialog.getProperties();

        switch (key) {

          case K_OTRO:

            if(Cairo.Util.val(properties.item("OTROS").getValue())) {

              properties.item(C.CUEC_ID).setSelectFilter("cuec_tipo = "+ csECuentaCategoriaTipo.cSETCUECOTRO.toString());

              switch (properties.item(C.CUEC_ID).getSelectId()) {
                case csECuentaCategoria.cSECUECOTROS:
                  // Todo bien
                  break;

                default:
                  limpiarCategorias();
                  break;
              }
            }

            break;

          case K_PATRIMONIAL:

            if(Cairo.Util.val(properties.item("PATRIMONIAL").getValue())) {

              properties.item(C.CUEC_ID).setSelectFilter("cuec_tipo = "+ csECuentaCategoriaTipo.cSETCUECPATRIMONIAL.toString());

              switch (properties.item(C.CUEC_ID).getSelectId()) {
                case csECuentaCategoria.cSECUECDOCENCARTERA:
                case csECuentaCategoria.cSECUECBANCOS:
                case csECuentaCategoria.cSECUECPATRIMONIALES:
                case csECuentaCategoria.cSECUECDEUDPORVENTAS:
                case csECuentaCategoria.cSECUECBIENESDEUSO:
                case csECuentaCategoria.cSECUECBIENESDECAMBIO:
                case csECuentaCategoria.cSECUECCUENTASFISCALES:
                case csECuentaCategoria.cSECUECACREEDORES:
                case csECuentaCategoria.cSECUECCAJA:
                case csECuentaCategoria.cSECUECDEPOSITOCUPONES:
                  // Todo bien
                  break;

                default:
                  limpiarCategorias();
                  break;
              }
            }

            break;

          case K_RESULTADO:

            if(Cairo.Util.val(properties.item("RESULTADO").getValue())) {

              properties.item(C.CUEC_ID).setSelectFilter("cuec_tipo = "+ csECuentaCategoriaTipo.cSETCUECRESULTADO.toString());

              switch (properties.item(C.CUEC_ID).getSelectId()) {
                case csECuentaCategoria.cSECUECCOSTOMERCVEND:
                case csECuentaCategoria.cSECUECEGRESOS:
                case csECuentaCategoria.cSECUECINGRESOS:
                  // Todo bien
                  break;

                default:
                  limpiarCategorias();
                  break;
              }
            }
            break;
        }

        properties.item(C.BCO_ID).setEnabled(properties.item(C.CUEC_ID).getSelectId() === csECuentaCategoria.cSECUECBANCOS);

      
        return _rtn;
      };

      var limpiarCategorias = function() {

        var properties = m_dialog.getProperties();
        properties.item(C.CUEC_ID).setSelectId(NO_ID);
        properties.item(C.CUEC_ID).setSelectIntValue("");
        properties.item(C.CUEC_ID).setValue("");

        m_dialog.refreshControls();
      };

      self.save = function() {

        var register = new Cairo.Database.Register();
        var fields = register.getFields();

        register.setFieldId(C.CUE_ID);
        register.setTable(C.CUENTA);

        register.setPath(m_apiPath + "general/cuenta");

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
              fields.add(C.CUE_NAME, property.getValue(), Cairo.Constants.Types.text);
              break;

            case K_CODE:
              fields.add(C.CUE_CODE, property.getValue(), Cairo.Constants.Types.text);
              break;

            case K_ACTIVE:
              fields.add(Cairo.Constants.ACTIVE, Cairo.Util.val(property.getValue()), Cairo.Constants.Types.boolean);
              break;

            case K_DESCRIPCION:
              fields.add(C.CUE_DESCRIP, property.getValue(), Cairo.Constants.Types.text);
              break;

            case K_MON_ID:
              fields.add(C.MON_ID, property.getSelectId(), Cairo.Constants.Types.id);
              break;

            case K_EMP_ID:
              fields.add(C.EMP_ID, property.getSelectId(), Cairo.Constants.Types.id);
              break;

            case K_BCO_ID:
              fields.add(C.BCO_ID, property.getSelectId(), Cairo.Constants.Types.id);
              break;

            case K_PRODUCTO:
              fields.add(C.CUE_PRODUCTO, Cairo.Util.val(property.getValue()), Cairo.Constants.Types.boolean);
              break;

            case K_LLEVA_CENTRO_COSTO:
              fields.add(C.CUE_LLEVA_CENTRO_COSTO, Cairo.Util.val(property.getValue()), Cairo.Constants.Types.boolean);
              break;

            case K_IDENTIFICACIONEXTERNA:
              fields.add(C.CUE_IDENTIFICACION_EXTERNA, property.getValue(), Cairo.Constants.Types.text);
              break;

            case K_CATEGORIA:
              fields.add(C.CUEC_ID, Cairo.Util.val(property.getSelectId()), Cairo.Constants.Types.id);
              break;

            case K_CODIGO_RPT:
              fields.add(C.CUE_CODIGO_RPT, property.getValue(), Cairo.Constants.Types.text);
              break;

            case K_ES_EFECTIVO:
              fields.add(C.CUE_ES_EFECTIVO, property.getValue(), Cairo.Constants.Types.boolean);
              break;

            case K_ES_TICKET:
              fields.add(C.CUE_ES_TICKET, property.getValue(), Cairo.Constants.Types.boolean);
              break;
          }
        }

        return Cairo.Database.saveEx(
            register,
            false,
            C.CUE_CODE,
            Cairo.Constants.CLIENT_SAVE_FUNCTION,
            C_MODULE,
            getText(1106, "")).then(

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
        });
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
        return "#general/cuenta/" + m_id.toString();
      };

      self.getEditorName = function() {
        var id = m_id ? m_id.toString() : "N" + (new Date).getTime().toString();
        return "cuenta" + id;
      };

      self.getTitle = function() {
        // Cuentas
        return getText(1107, "");
      };

      self.validate = function() {
        var property = null;
        var bBcoEmpty = null;
        var bHaveBco = null;

        var _count = m_dialog.getProperties().size();
        for (var _i = 0; _i < _count; _i++) {
          property = m_dialog.getProperties().item(_i);
          switch (property.getKey()) {
            case K_NAME:
              if(Cairo.Util.valEmpty(property.getValue(), Cairo.Constants.Types.text)) {
                return Cairo.Modal.showInfoWithFalse(Cairo.Constants.MUST_SET_A_NAME);
              }
              break;

            case K_CODE:
              if(Cairo.Util.valEmpty(property.getValue(), Cairo.Constants.Types.text)) {
                property.setValue(Cairo.Constants.GET_CODE_FROM_ID);
              }
              break;

            case K_MON_ID:
              if(Cairo.Util.valEmpty(property.getSelectId(), Cairo.Constants.Types.id)) {
                // Debe indicar una moneda
                Cairo.Modal.showInfo(getText(1108, ""));
              }
              break;

            case K_BCO_ID:
              if(Cairo.Util.valEmpty(property.getSelectId(), Cairo.Constants.Types.id)) {
                bBcoEmpty = true;
              }
              break;

            case K_CATEGORIA:
              if(Cairo.Util.valEmpty(property.getSelectId(), Cairo.Constants.Types.id)) {
                // Debe indicar una categoría
                Cairo.Modal.showInfo(getText(1109, ""));
              }
              bHaveBco = property.getSelectId() === csECuentaCategoria.cSECUECBANCOS;
              break;
          }
        }

        if(bBcoEmpty && bHaveBco) {
          // Debe indicar un banco
          Cairo.Modal.showInfo(getText(1110, ""));
        }

        return Cairo.Promises.resolvedPromise(true);
      };

      self.getDialog = function() {
        return m_dialog;
      };

      self.setTreeId = function(value) {
        m_treeId = value;
      };

      self.getTreeId = function() {
        return m_treeId;
      };

      self.list = function() {
        return Cairo.Security.hasPermissionTo(Cairo.Security.Actions.General.LIST_CUENTA);
      };

      self.setDialog = function(value) {
        m_dialog = value;
      };

      self.isEditing = function() {
        return m_editing;
      };

      self.edit = function(id, inModalWindow) {
        var p = Cairo.Promises.resolvedPromise(false);
        try {

          if(id === NO_ID) {
            m_isNew = true;
            if(!Cairo.Security.hasPermissionTo(Cairo.Security.Actions.General.NEW_CUENTA)) { return p; }
          } 
          else {
            m_isNew = false;
            if(!Cairo.Security.hasPermissionTo(Cairo.Security.Actions.General.EDIT_CUENTA)) { return p; }
          }

          m_dialog.setInModalWindow(inModalWindow);

          p = load(id).then(
           function(success) {
              if(success) {

                if(!loadCollection()) { return false; }

                m_editing = true;
                m_copy = false;

                if(inModalWindow) {
                  success = m_id !== NO_ID;
                } 
                else {
                  success = true;
                }

              }
              return success;
          });
        }
        catch(ex) {
          Cairo.manageErrorEx(ex.message, ex, Cairo.Constants.EDIT_FUNCTION, C_MODULE, "");
      }
      
        return p;
      };

      self.setTree = function(value) {
        m_listController = value;
      };

      self.setBranchId = function(value) {
        m_branchId = value;
      };

      self.getBranchId = function() {
        return m_branchId;
      };

      var loadCollection = function() {

        m_dialog.setTitle(m_name);

        var properties = m_dialog.getProperties();

        properties.clear();

        var elem = properties.add(null, C.CUE_NAME);
        elem.setType(Dialogs.PropertyType.text);
        elem.setName(Cairo.Constants.NAME_LABEL);
        elem.setSize(100);
        elem.setKey(K_NAME);
        elem.setValue(m_name);

        var elem = properties.add(null, C.CUE_CODE);
        elem.setType(Dialogs.PropertyType.text);
        elem.setName(Cairo.Constants.CODE_LABEL);
        elem.setSize(15);
        elem.setValue(m_code);
        elem.setKey(K_CODE);

        var elem = properties.add(null, C.CUE_IDENTIFICACION_EXTERNA);
        elem.setType(Dialogs.PropertyType.text);
        // Identificación Externa
        elem.setName(getText(1112, ""));
        elem.setKey(K_IDENTIFICACIONEXTERNA);
        elem.setValue(m_identificacionExterna);

        var elem = properties.add(null, Cairo.Constants.ACTIVE);
        elem.setType(Dialogs.PropertyType.check);
        elem.setName(Cairo.Constants.ACTIVE_LABEL);
        elem.setKey(K_ACTIVE);
        elem.setValue(m_active === true ? 1 : 0);

        var elem = properties.add(null, C.MON_ID);
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.MONEDA);
        // Moneda
        elem.setName(getText(1113, ""));
        elem.setKey(K_MON_ID);
        elem.setSelectId(m_monId);
        elem.setValue(m_moneda);

        var elem = properties.add(null, C.EMP_ID);
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.EMPRESA);
        // Empresa
        elem.setName(getText(1114, ""));
        elem.setKey(K_EMP_ID);
        elem.setSelectId(m_empId);
        elem.setValue(m_empresa);

        var elem = properties.add(null, C.CUE_LLEVA_CENTRO_COSTO);
        elem.setType(Dialogs.PropertyType.check);
        // Exije centro de costo
        elem.setName(getText(1115, ""));
        elem.setKey(K_LLEVA_CENTRO_COSTO);
        elem.setValue(Cairo.Util.boolToInt(m_llevaCentroCosto));

        var elem = properties.add(null, C.CUE_PRODUCTO);
        elem.setType(Dialogs.PropertyType.check);
        // Elegible para producto
        elem.setName(getText(1116, ""));
        elem.setKey(K_PRODUCTO);
        elem.setValue(Cairo.Util.boolToInt(m_producto));

        var elem = properties.add(null, C.CUE_ES_EFECTIVO);
        elem.setType(Dialogs.PropertyType.check);
        // Es Efectivo
        elem.setName(getText(4918, ""));
        elem.setSize(15);
        elem.setValue(Cairo.Util.boolToInt(m_esEfectivo));
        elem.setKey(K_ES_EFECTIVO);


        var elem = properties.add(null, C.CUE_ES_TICKET);
        elem.setType(Dialogs.PropertyType.check);
        // Es Ticket
        elem.setName(getText(4919, ""));
        elem.setSize(15);
        elem.setValue(Cairo.Util.boolToInt(m_esTicket));
        elem.setKey(K_ES_TICKET);


        var elem = properties.add(null, "PATRIMONIAL");
        elem.setType(Dialogs.PropertyType.option);
        elem.setOptionGroup(0);
        // Patrimonial
        elem.setName(getText(1117, ""));
        elem.setKey(K_PATRIMONIAL);
        elem.setValue(0);

        var elem = properties.add(null, "RESULTADO");
        elem.setType(Dialogs.PropertyType.option);
        elem.setOptionGroup(0);
        // Resultado
        elem.setName(getText(1118, ""));
        elem.setKey(K_RESULTADO);
        elem.setValue(0);

        var elem = properties.add(null, "OTROS");
        elem.setType(Dialogs.PropertyType.option);
        elem.setOptionGroup(0);
        // Otros
        elem.setName(getText(1119, ""));
        elem.setKey(K_OTRO);
        elem.setValue(0);

        var elem = properties.add(null, C.CUEC_ID);
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.CUENTACATEGORIA);
        // Categoría
        elem.setName(getText(1120, ""));
        elem.setKey(K_CATEGORIA);
        elem.setValue(m_categoria);
        elem.setSelectId(m_categoriaId);

        switch (m_categoriaTipo) {

          case csECuentaCategoriaTipo.cSETCUECOTRO:
            properties.item("OTROS").setValue(1);
            properties.item(C.CUEC_ID).setSelectFilter("cuec_tipo = "+ csECuentaCategoriaTipo.cSETCUECOTRO.toString());

            break;

          case csECuentaCategoriaTipo.cSETCUECPATRIMONIAL:
            properties.item("PATRIMONIAL").setValue(1);
            properties.item(C.CUEC_ID).setSelectFilter("cuec_tipo = "+ csECuentaCategoriaTipo.cSETCUECPATRIMONIAL.toString());

            break;

          case csECuentaCategoriaTipo.cSETCUECRESULTADO:
            properties.item("RESULTADO").setValue(1);
            properties.item(C.CUEC_ID).setSelectFilter("cuec_tipo = "+ csECuentaCategoriaTipo.cSETCUECRESULTADO.toString());

            break;

          default:
            properties.item("PATRIMONIAL").setValue(1);
            properties.item(C.CUEC_ID).setSelectFilter("cuec_tipo = "+ csECuentaCategoriaTipo.cSETCUECPATRIMONIAL.toString());

            break;
        }

        var elem = properties.add(null, C.BCO_ID);
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.BANCO);
        // Banco
        elem.setName(getText(1122, ""));
        elem.setKey(K_BCO_ID);
        elem.setSelectId(m_bco_id);
        elem.setValue(m_banco);
        elem.setEnabled(m_categoriaId === csECuentaCategoria.cSECUECBANCOS);

        var elem = properties.add(null, C.CUE_CODIGO_RPT);
        elem.setType(Dialogs.PropertyType.text);
        // Codigo RPT
        elem.setName(getText(4839, ""));
        elem.setSize(15);
        elem.setValue(m_codigoRPT);
        elem.setKey(K_CODIGO_RPT);

        var elem = properties.add(null, C.CUEC_DESCRIP);
        elem.setType(Dialogs.PropertyType.text);
        elem.setSubType(Dialogs.PropertySubType.memo);
        elem.setName(Cairo.Constants.DESCRIPTION_LABEL);
        elem.setKey(K_DESCRIPCION);
        elem.setValue(m_descripcion);

        if(!m_dialog.show(self)) { return false; }

        return true;
      };

      var refreshCollection = function() {

        m_dialog.setTitle(m_name);

        var properties = m_dialog.getProperties();

        var elem = properties.item(C.CUE_NAME);
        elem.setValue(m_name);

        var elem = properties.item(C.CUE_CODE);
        elem.setValue(m_code);

        var elem = properties.item(C.CUE_IDENTIFICACION_EXTERNA);
        elem.setValue(m_identificacionExterna);

        var elem = properties.item(Cairo.Constants.ACTIVE);
        elem.setValue(m_active === true ? 1 : 0);

        var elem = properties.item(C.MON_ID);
        elem.setSelectId(m_monId);
        elem.setValue(m_moneda);

        var elem = properties.item(C.EMP_ID);
        elem.setSelectId(m_empId);
        elem.setValue(m_empresa);

        var elem = properties.item(C.CUE_LLEVA_CENTRO_COSTO);
        elem.setValue(Cairo.Util.boolToInt(m_llevaCentroCosto));

        var elem = properties.item(C.CUE_PRODUCTO);
        elem.setValue(Cairo.Util.boolToInt(m_producto));

        var elem = properties.item(C.CUE_ES_EFECTIVO);
        elem.setValue(Cairo.Util.boolToInt(m_esEfectivo));

        var elem = properties.item(C.CUE_ES_TICKET);
        elem.setValue(Cairo.Util.boolToInt(m_esTicket));

        var elem = properties.item("PATRIMONIAL");
        elem.setValue(0);

        var elem = properties.item("RESULTADO");
        elem.setValue(0);

        var elem = properties.item("OTROS");
        elem.setValue(0);

        var elem = properties.item(C.CUEC_ID);
        elem.setValue(m_categoria);
        elem.setSelectId(m_categoriaId);

        var elem = properties.item(C.BCO_ID);
        elem.setSelectId(m_bco_id);
        elem.setValue(m_banco);

        var elem = properties.item(C.CUE_CODIGO_RPT);
        elem.setValue(m_codigoRPT);

        var elem = properties.item(C.CUEC_DESCRIP);
        elem.setValue(m_descripcion);

        return m_dialog.showValues(properties);
      };

      var load = function(id) {

        return DB.getData("load[" + m_apiPath + "general/cuenta]", id).then(
          function(response) {

            if(response.success !== true) { return false; }

            if(response.data.id === NO_ID) {
              m_active = true;
              m_name = "";
              m_code = "";
              m_id = NO_ID;
              m_descripcion = "";
              m_identificacionExterna = "";
              m_categoria = "";
              m_categoriaId = NO_ID;
              m_monId = NO_ID;
              m_moneda = "";
              m_bco_id = NO_ID;
              m_banco = "";
              m_empId = NO_ID;
              m_empresa = "";
              m_categoriaTipo = csECuentaCategoriaTipo.cSETCUECPATRIMONIAL;
              m_llevaCentroCosto = false;
              m_producto = false;
              m_codigoRPT = "";
              m_esEfectivo = false;
              m_esTicket = false;

            } 
            else {

              m_active = Cairo.Database.valField(response.data, Cairo.Constants.ACTIVE);
              m_name = Cairo.Database.valField(response.data, C.CUE_NAME);
              m_code = Cairo.Database.valField(response.data, C.CUE_CODE);
              m_id = Cairo.Database.valField(response.data, C.CUE_ID);
              m_descripcion = Cairo.Database.valField(response.data, C.CUE_DESCRIP);
              m_identificacionExterna = Cairo.Database.valField(response.data, C.CUE_IDENTIFICACION_EXTERNA);
              m_categoria = Cairo.Database.valField(response.data, C.CUEC_NAME);
              m_categoriaId = Cairo.Database.valField(response.data, C.CUEC_ID);
              m_monId = Cairo.Database.valField(response.data, C.MON_ID);
              m_moneda = Cairo.Database.valField(response.data, C.MON_NAME);
              m_bco_id = Cairo.Database.valField(response.data, C.BCO_ID);
              m_banco = Cairo.Database.valField(response.data, C.BCO_NAME);
              m_categoriaTipo = Cairo.Database.valField(response.data, C.CUEC_TIPO);
              m_llevaCentroCosto = Cairo.Database.valField(response.data, C.CUE_LLEVA_CENTRO_COSTO);
              m_producto = Cairo.Database.valField(response.data, C.CUE_PRODUCTO);
              m_empId = Cairo.Database.valField(response.data, C.EMP_ID);
              m_empresa = Cairo.Database.valField(response.data, Cairo.Constants.EMP_NAME);
              m_codigoRPT = Cairo.Database.valField(response.data, C.CUE_CODIGO_RPT);
              m_esEfectivo = Cairo.Database.valField(response.data, C.CUE_ES_EFECTIVO);
              m_esTicket = Cairo.Database.valField(response.data, C.CUE_ES_TICKET);
            }

          return true;
        });
      };

      var bancoEnabled = function() {
        return csECuentaCategoria.cSECUECDOCENCARTERA === m_categoriaId || csECuentaCategoria.cSECUECDEPOSITOCUPONES === m_categoriaId;
      };
      var libroIvaEnabled = function() {
        return (csECuentaCategoria.cSECUECBIENESDECAMBIO === m_categoriaId) || (csECuentaCategoria.cSECUECBIENESDEUSO === m_categoriaId) || (csECuentaCategoria.cSECUECINGRESOS === m_categoriaId) || (csECuentaCategoria.cSECUECEGRESOS === m_categoriaId);
      };
      var proveedorEnabled = function() {
        return csECuentaCategoria.cSECUECBANCOS === m_categoriaId;
      };

      var destroy = function() {
        m_dialog = null;
        m_listController = null;
      };

      self.terminate = function() {

        m_editing = false;

        try {
          if(m_listController !== null) {
            updateList();
            m_listController.removeEditor(self);
          }
        }
        catch(ex) {
          Cairo.manageErrorEx(ex.message, "terminate", C_MODULE, "");
        }

        try {
          destroy();
        }
        catch(ex) {
          Cairo.manageErrorEx(ex.message, "terminate", C_MODULE, "");
        }
      };

      return self;
    };

    Edit.Controller = { getEditor: createObject };

    Edit.Controller.edit = function(id) {
      var editor = Cairo.Cuenta.Edit.Controller.getEditor();
      var dialog = Cairo.Dialogs.Views.Controller.newDialog();

      editor.setDialog(dialog);
      editor.edit(id);
    };

  });

  Cairo.module("Cuenta.List", function(List, Cairo, Backbone, Marionette, $, _) {

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

          var editors = Cairo.Editors.cuentaEditors || Cairo.Collections.createCollection(null);
          Cairo.Editors.cuentaEditors = editors;

          // ListController properties and methods
          //
          self.entityInfo = new Backbone.Model({
            entitiesTitle: "Cuentas",
            entityName: "cuenta",
            entitiesName: "cuentas"
          });

          self.showBranch = function(branchId) {
            Cairo.log("Loading nodeId: " + branchId);
            Cairo.Tree.List.Controller.listBranch(branchId, Cairo.Tree.List.Controller.showItems, self);
          };

          self.addLeave = function(id, branchId) {
            try {
              Cairo.Tree.List.Controller.addLeave(branchId, id, self);
            }
            catch(ignore) {
              Cairo.log("Error when adding this item to the branch\n\n" + ignore.message);
            }
          };

          self.refreshBranch = function(id, branchId) {
            try {
              Cairo.Tree.List.Controller.refreshBranchIfActive(branchId, id, self);
            }
            catch(ignore) {
              Cairo.log("Error when refreshing a branch\n\n" + ignore.message);
            }
          };

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

          self.edit = function(id, treeId, branchId) {
            var key = getKey(id);
            if(editors.contains(key)) {
              editors.item(key).dialog.showDialog();
            }
            else {
              var editor = Cairo.Cuenta.Edit.Controller.getEditor();
              var dialog = Cairo.Dialogs.Views.Controller.newDialog();

              editor.setTree(self);
              editor.setDialog(dialog);
              editor.setTreeId(treeId);
              editor.setBranchId(branchId);
              editor.edit(id);

              editors.add({editor: editor, dialog: dialog}, key);
            }
          };

          self.destroy = function(id, treeId, branchId) {
            if(!Cairo.Security.hasPermissionTo(Cairo.Security.Actions.General.DELETE_CUENTA)) {
              return Cairo.Promises.resolvedPromise(false);
            }
            return Cairo.Database.destroy(m_apiPath + "general/cuenta", id, Cairo.Constants.DELETE_FUNCTION, "Cuenta").whenSuccess(
              function() {
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
              }
            );
          };

          // progress message
          //
          Cairo.LoadingMessage.show("Cuentas", "Loading Cuentas from CrowSoft Cairo server.");

          // create the tree region
          //
          Cairo.addRegions({ cuentaTreeRegion: tabId });

          // create the dialog
          //
          Cairo.Tree.List.Controller.list(
            Cairo.Tables.CUENTA,
            new Cairo.Tree.List.TreeLayout({ model: self.entityInfo }),
            Cairo.cuentaTreeRegion,
            self);

        };

        var showTreeDialog = function() {
          Cairo.Tree.List.Controller.showTreeDialog(self);
        };

        var closeTreeDialog = function() {

        }

        // create the tab
        //
        Cairo.mainTab.showTab("Cuentas", "cuentaTreeRegion", "#general/cuentas", createTreeDialog, closeTreeDialog, showTreeDialog);

      }
    };
  });


}());