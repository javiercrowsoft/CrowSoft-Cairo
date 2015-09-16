(function() {
  "use strict";

  Cairo.module("Proveedor.Edit", function(Edit, Cairo, Backbone, Marionette, $, _) {

    var createObject = function() {

      var self = {};

      var getText = Cairo.Language.getText;

      var Dialogs = Cairo.Dialogs;
      var DB = Cairo.Database;
      var C = Cairo.General.Constants;
      var NO_ID = Cairo.Constants.NO_ID;

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

      self.getId = function() {
        return m_id;
      };
      //
      self.setId = function(rhs) {
        m_id = rhs;
      };
      //
      self.getName = function() {
        return m_name;
      };

      self.setNombre = function(rhs) {
        m_name = rhs;
      };
      //
      self.getCode = function() {
        return m_code;
      };

      self.setCodigo = function(rhs) {
        m_code = rhs;
      };

      self.setRazonsocial = function(rhs) {
        m_razonsocial = rhs;
      };

      self.getCuit = function() {
        return m_cuit;
      };

      self.setCuit = function(rhs) {
        m_cuit = rhs;
      };

      self.setCatfiscal = function(rhs) {
        m_catFiscal = rhs;
      };

      self.setActivo = function(rhs) {
        m_active = rhs;
      };

      self.save = function(reLoad) {
        var _rtn = null;
        var register = null;
        register = new cRegister();

        register.setFieldId(Cairo.General.Constants.PROV_ID);
        register.setTable(Cairo.General.Constants.PROVEEDOR);

        if(m_copy) {
          register.setId(Cairo.Constants.NEW_ID);
        }
        else {
          register.setId(m_id);
        }

        var w_fields = register.getFields();
        w_fields.add2(Cairo.General.Constants.PROV_NAME, m_name, Cairo.Constants.Types.text);
        w_fields.add2(Cairo.General.Constants.PROV_CODE, m_code, Cairo.Constants.Types.text);
        w_fields.add2(Cairo.General.Constants.PROV_CONTACTO, m_contacto, Cairo.Constants.Types.text);
        w_fields.add2(Cairo.General.Constants.PROV_RAZONSOCIAL, m_razonsocial, Cairo.Constants.Types.text);
        w_fields.add2(Cairo.General.Constants.PROV_CUIT, m_cuit, Cairo.Constants.Types.text);
        w_fields.add2(Cairo.General.Constants.PROV_INGRESOSBRUTOS, m_ingresosbrutos, Cairo.Constants.Types.text);
        w_fields.add2(Cairo.General.Constants.PROV_CATFISCAL, m_catFiscal, Cairo.Constants.Types.integer);
        w_fields.add2(Cairo.General.Constants.PROV_CHEQUEORDEN, m_chequeorden, Cairo.Constants.Types.text);
        w_fields.add2(Cairo.General.Constants.PROV_CODPOSTAL, m_codpostal, Cairo.Constants.Types.text);
        w_fields.add2(Cairo.General.Constants.PROV_LOCALIDAD, m_localidad, Cairo.Constants.Types.text);
        w_fields.add2(Cairo.General.Constants.PROV_CALLE, m_calle, Cairo.Constants.Types.text);
        w_fields.add2(Cairo.General.Constants.PROV_CALLENUMERO, m_callenumero, Cairo.Constants.Types.text);
        w_fields.add2(Cairo.General.Constants.PROV_PISO, m_piso, Cairo.Constants.Types.text);
        w_fields.add2(Cairo.General.Constants.PROV_DEPTO, m_depto, Cairo.Constants.Types.text);
        w_fields.add2(Cairo.General.Constants.PROV_TEL, m_tel, Cairo.Constants.Types.text);
        w_fields.add2(Cairo.General.Constants.PROV_FAX, m_fax, Cairo.Constants.Types.text);
        w_fields.add2(Cairo.General.Constants.PROV_EMAIL, m_email, Cairo.Constants.Types.text);
        w_fields.add2(Cairo.General.Constants.PROV_WEB, m_web, Cairo.Constants.Types.text);
        w_fields.add2(Cairo.General.Constants.PRO_ID, m_pro_id, Cairo.Constants.Types.id);
        w_fields.add2(Cairo.General.Constants.ZON_ID, m_zon_id, Cairo.Constants.Types.id);
        w_fields.add2(Cairo.Constants.ACTIVE, m_active, Cairo.Constants.Types.boolean);

        w_fields.setHaveLastUpdate(true);
        w_fields.setHaveWhoModify(true);
        //Error al grabar Proveedor
        if(!Cairo.Database.saveEx(register, , Cairo.General.Constants.PROV_CODE, "Save", C_MODULE, Cairo.Language.getText(1377, ""))) { return _rtn; }

        m_id = register.getID();

        if(reLoad) {
          _rtn = self.load(m_id);
        }
        else {
          _rtn = true;
        }

        return _rtn;
      };

      self.updateCAI = function(properties) { // TODO: Use of ByRef founded Public Function UpdateCAI(ByRef Properties As cIABMProperties) As Boolean
        var register = null;
        var fields = null;
        var property = null;

        register = new cRegister();
        fields = register.getFields();
        register.setFieldId(Cairo.General.Constants.PROVC_ID);
        register.setTable(Cairo.General.Constants.PROVEEDORCAI);
        register.setId(Cairo.Constants.NEW_ID);

        var _count = properties.size();
        for (var _i = 0; _i < _count; _i++) {
          property = properties.item(_i);
          switch (property.getKey()) {
            case KI_PROVC_ID:
              register.setId(Cairo.Util.val(property.getValue()));
              break;

            case KI_NUMERO:
              fields.add2(Cairo.General.Constants.PROVC_NUMERO, property.getValue(), Cairo.Constants.Types.text);
              break;

            case KI_DESCRIP:
              fields.add2(Cairo.General.Constants.PROVC_DESCRIP, property.getValue(), Cairo.Constants.Types.text);
              break;

            case KI_FECHAVTO:
              fields.add2(Cairo.General.Constants.PROVC_FECHAVTO, property.getValue(), Cairo.Constants.Types.date);
              break;

            case KI_ACTIVO:
              fields.add2(Cairo.Constants.ACTIVE, property.getValue(), Cairo.Constants.Types.boolean);
              break;

            case KI_SUCURSAL:
              fields.add2(Cairo.General.Constants.PROVC_SUCURSAL, property.getValue(), Cairo.Constants.Types.text);
              break;
          }
        }

        fields.add2(Cairo.General.Constants.PROV_ID, m_id, Cairo.Constants.Types.id);

        //Error al grabar CAI
        if(!Cairo.Database.save(register, , "pSaveItemsCAIS", C_MODULE, Cairo.Language.getText(1377, ""))) { return false; }

        var sqlstmt = null;

        return true;
      };

      self.copy = function() {

        updateList();

        m_isNew = true;

        m_listController.updateEditorKey(self, Cairo.Constants.NO_ID);

        var property = m_dialog.getProperties().item(Cairo.General.Constants.PROV_CODE);
        property.setValue(Cairo.Constants.COPY_OF + property.getValue());

        m_dialog.showValue(m_dialog.getProperties().item(Cairo.General.Constants.PROV_CODE));
        m_dialog.showValue(m_dialog.getProperties().item(Cairo.General.Constants.PROV_NAME));

        m_copy = true;
      };

      self.editNew = function() {

        updateList();

        m_isNew = true;

        if(!pValidateAccessNewEdit(Cairo.Constants.NO_ID)) { return false; }

        self.load(Cairo.Constants.NO_ID);
        pRefreshProperties();
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

          doc.setClientTable(Cairo.General.Constants.PROVEEDOR);
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

            CSKernelClient2.ShowHelp(m_dialog.hWnd, "", "", csGeneralPrestacion.Cairo.Security.Actions.General.NEW_PROVEEDOR);
            _rtn = Dialogs.Message.MSG_DOC_INFO_HANDLED;

            break;

          case Dialogs.Message.MSG_DOC_REFRESH:
            pRefreshProperties();

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

        return Cairo.Promises.resolvedPromise(false);
      };

      self.save = function() {
        var _rtn = null;
        var lastId = null;

        var register = new Cairo.Database.Register();
        var fields = register.getFields();

        register.setFieldId(Cairo.General.Constants.PROV_ID);
        register.setTable(Cairo.General.Constants.PROVEEDOR);

        var apiPath = Cairo.Database.getAPIVersion();
        register.setPath(apiPath + "general/proveedor");

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
              fields.add(Cairo.General.Constants.PROV_NAME, property.getValue(), Cairo.Constants.Types.text);
              break;

            case K_CODE:
              fields.add(Cairo.General.Constants.PROV_CODE, property.getValue(), Cairo.Constants.Types.text);
              break;

            case K_DESCRIP:
              fields.add(Cairo.General.Constants.PROV_DESCRIP, property.getValue(), Cairo.Constants.Types.text);
              break;

            case K_CPG_ID:
              fields.add(Cairo.General.Constants.CPG_ID, property.getSelectId(), Cairo.Constants.Types.id);
              break;

            case K_CONTACTO:
              fields.add(Cairo.General.Constants.PROV_CONTACTO, property.getValue(), Cairo.Constants.Types.text);
              break;

            case K_RAZONSOCIAL:
              fields.add(Cairo.General.Constants.PROV_RAZONSOCIAL, property.getValue(), Cairo.Constants.Types.text);
              break;

            case K_CUIT:
              fields.add(Cairo.General.Constants.PROV_CUIT, property.getValue(), Cairo.Constants.Types.text);
              break;

            case K_INGRESOSBRUTOS:
              fields.add(Cairo.General.Constants.PROV_INGRESOSBRUTOS, property.getValue(), Cairo.Constants.Types.text);
              break;

            case K_CATFISCAL:
              fields.add(Cairo.General.Constants.PROV_CATFISCAL, property.getListItemData(), Cairo.Constants.Types.integer);
              break;

            case K_CHEQUEORDEN:
              fields.add(Cairo.General.Constants.PROV_CHEQUEORDEN, property.getValue(), Cairo.Constants.Types.text);
              break;

            case K_CODPOSTAL:
              fields.add(Cairo.General.Constants.PROV_CODPOSTAL, property.getValue(), Cairo.Constants.Types.text);
              break;

            case K_LOCALIDAD:
              fields.add(Cairo.General.Constants.PROV_LOCALIDAD, property.getValue(), Cairo.Constants.Types.text);
              break;

            case K_CALLE:
              fields.add(Cairo.General.Constants.PROV_CALLE, property.getValue(), Cairo.Constants.Types.text);
              break;

            case K_CALLENUMERO:
              fields.add(Cairo.General.Constants.PROV_CALLENUMERO, property.getValue(), Cairo.Constants.Types.text);
              break;

            case K_PISO:
              fields.add(Cairo.General.Constants.PROV_PISO, property.getValue(), Cairo.Constants.Types.text);
              break;

            case K_DEPTO:
              fields.add(Cairo.General.Constants.PROV_DEPTO, property.getValue(), Cairo.Constants.Types.text);
              break;

            case K_TEL:
              fields.add(Cairo.General.Constants.PROV_TEL, property.getValue(), Cairo.Constants.Types.text);
              break;

            case K_FAX:
              fields.add(Cairo.General.Constants.PROV_FAX, property.getValue(), Cairo.Constants.Types.text);
              break;

            case K_EMAIL:
              fields.add(Cairo.General.Constants.PROV_EMAIL, property.getValue(), Cairo.Constants.Types.text);
              break;

            case K_WEB:
              fields.add(Cairo.General.Constants.PROV_WEB, property.getValue(), Cairo.Constants.Types.text);
              break;

            case K_PRO_ID:
              fields.add(Cairo.General.Constants.PRO_ID, property.getSelectId(), Cairo.Constants.Types.id);
              break;

            case K_ZON_ID:
              fields.add(Cairo.General.Constants.ZON_ID, property.getSelectId(), Cairo.Constants.Types.id);
              break;

            case K_ACTIVE:
              fields.add(Cairo.Constants.ACTIVE, property.getValue(), Cairo.Constants.Types.boolean);
              break;

            case K_IMPRIMETICKET:
              fields.add(Cairo.General.Constants.PROV_IMPRIME_TICKET, property.getValue(), Cairo.Constants.Types.boolean);
              break;

            case K_LP_ID:
              fields.add(Cairo.General.Constants.LP_ID, property.getSelectId(), Cairo.Constants.Types.id);
              break;

            case K_LD_ID:
              fields.add(Cairo.General.Constants.LD_ID, property.getSelectId(), Cairo.Constants.Types.id);
              break;

            case K_CREDITOCTACTE:
              fields.add(Cairo.General.Constants.PROV_CREDITOCTACTE, property.getValue(), Cairo.Constants.Types.currency);
              break;

            case K_CREDITOTOTAL:
              fields.add(Cairo.General.Constants.PROV_CREDITOTOTAL, property.getValue(), Cairo.Constants.Types.currency);
              break;

            case K_CREDITOACTIVO:
              fields.add(Cairo.General.Constants.PROV_CREDITOACTIVO, property.getValue(), Cairo.Constants.Types.boolean);
              break;

            case K_BANCO:
              fields.add(Cairo.General.Constants.PROV_BANCO, property.getValue(), Cairo.Constants.Types.text);
              break;

            case K_NROCTA:
              fields.add(Cairo.General.Constants.PROV_NRO_CTA_BANCO, property.getValue(), Cairo.Constants.Types.text);
              break;

            case K_CBU:
              fields.add(Cairo.General.Constants.PROV_CBU, property.getValue(), Cairo.Constants.Types.text);
              break;

            case K_NROCLIENTE:
              fields.add(Cairo.General.Constants.PROV_NRO_CLIENTE, property.getValue(), Cairo.Constants.Types.text);

              break;

            case K_HORARIO_M_DESDE:
              fields.add(Cairo.General.Constants.PROV_HORARIO_MDESDE, property.getValue(), Cairo.Constants.Types.date);
              break;

            case K_HORARIO_M_HASTA:
              fields.add(Cairo.General.Constants.PROV_HORARIO_MHASTA, property.getValue(), Cairo.Constants.Types.date);
              break;

            case K_HORARIO_T_DESDE:
              fields.add(Cairo.General.Constants.PROV_HORARIO_TDESDE, property.getValue(), Cairo.Constants.Types.date);
              break;

            case K_HORARIO_T_HASTA:
              fields.add(Cairo.General.Constants.PROV_HORARIO_THASTA, property.getValue(), Cairo.Constants.Types.date);

              break;
          }
        }

        if(!m_genericEdit.Save(m_dialog, register)) { return _rtn; }

        register.prepareTransaction();
        // save items
        lastId = m_id;
        m_id = register.getID();

        if(!pSaveItemsCAIS(register)) {  return false; }
        if(!pSaveItemsCuentaGrupo(register)) {  return false; }
        if(!pSaveItemsRetencion(register)) {  return false; }
        if(!pSaveItemsEmpresa(register)) {  return false; }
        if(!pSaveItemsDpto(register)) {  return false; }
        if(!pSaveItemsCcos(register)) {  return false; }

        return Cairo.Database.saveTransaction(
            register,
            false,
            Cairo.General.Constants.PROV_CODE,
            Cairo.Constants.CLIENT_SAVE_FUNCTION,
            C_MODULE,
            c_ErrorSave).then(

          function(result) {
            if(result.success) {
              m_copy = false;
              _rtn = self.load(register.getID());

              return _rtn;
              // **TODO:** label found: SaveError:;
              m_id = lastId;

              return _rtn;
            };

            var updateList = function() {
              if(m_id == Cairo.Constants.NO_ID) { return; }
              if(m_listController == null) { return; }

              if(m_isNew) {
                m_listController.addLeave(m_id, m_branchId);
              }
              else {
                m_listController.refreshBranch(m_id, m_branchId);
              }
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

            self.getPath = function() {
              return "#general/proveedor/" + m_id.toString();
            };

            self.getEditorName = function() {
              var id = m_id ? m_id.toString() : "N" + (new Date).getTime().toString();
              return "proveedor" + id;
            };

            self.getTitle = function() {
              //'Proveedores
              return Cairo.Language.getText(1302, "");
            };

            self.validate = function() {

              var property = null;
              var creditoCC = null;
              var creditoTotal = null;
              var nombre = null;

              var _count = m_dialog.getProperties().size();
              for (var _i = 0; _i < _count; _i++) {
                property = m_dialog.getProperties().item(_i);
                switch (property.getKey()) {
                  case K_NAME:
                    if(ValEmpty(property.getValue(), Cairo.Constants.Types.text)) {
                      MsgInfo(Cairo.Constants.MUST_SET_A_NAME);
                    }
                    else {
                      nombre = property.getValue();
                    }
                    break;

                  case K_CODE:
                    if(ValEmpty(property.getValue(), Cairo.Constants.Types.text)) {
                      property.setValue(Cairo.Constants.GET_CODE_FROM_ID);
                    }
                    break;

                  case K_RAZONSOCIAL:
                    if(ValEmpty(property.getValue(), Cairo.Constants.Types.text)) {
                      property.setValue(nombre);
                    }
                    break;

                  case K_CATFISCAL:
                    if(ValEmpty(property.getListItemData(), Cairo.Constants.Types.integer)) {
                      MsgInfo(Cairo.Language.getText(1174, ""));
                      //Debe indicar un categoría fiscal
                    }
                    break;

                  case K_CREDITOCTACTE:
                    creditoCC = Cairo.Util.val(property.getValue());
                    break;

                  case K_CREDITOTOTAL:
                    creditoTotal = Cairo.Util.val(property.getValue());

                    break;

                  case K_CBU:
                    if(property.getValue().Length) {
                      if(!pValidarCBU(property.getValue())) {
                        //' Desea guardar el proveedor de todas formas?
                        if(!Ask(Cairo.Language.getText(4714, ""), vbYes)) {
                        }
                      }
                    }
                    break;
                }
              }

              if(creditoCC > creditoTotal) {
                MsgInfo(Cairo.Language.getText(1380, ""));
                //El crédito en cuenta corriente no puede ser mayor que el crédito total
              }

              if(!pValidateCuitProveedor(m_dialog.getProperties().item(Cairo.General.Constants.PROV_CUIT).getValue().$.trim())) { return false; }

              if(!m_genericEdit.Validate(m_dialog)) { return false; }

              return Cairo.Promises.resolvedPromise(true);
            };

            // Implementacion de ciABMClientGrid

            var columnAfterEdit = function(key,  lRow,  lCol,  newValue,  newValueID) {
              return true;
            };

            var columnAfterUpdate = function(key,  lRow,  lCol) {
              return true;
            };

            var columnBeforeEdit = function(key,  lRow,  lCol,  iKeyAscii) {
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

            var columnButtonClick = function(key,  lRow,  lCol,  iKeyAscii) {

            };

            var columnClick = function(key,  lRow,  lCol) {

            };

            var dblClick = function(key,  lRow,  lCol) {

            };

            var deleteRow = function(key,  row,  lRow) {
              var _rtn = null;
              var id = null;

              switch (key) {
                case K_CAIS:
                  id = Cairo.Util.val(Dialogs.cell(row, KI_PROVC_ID).getValue());
                  if(id != Cairo.Constants.NO_ID) { m_itemsDeletedCAIS = m_itemsDeletedCAIS+ id.toString()+ C_StrColon; }
                  break;

                case K_CUENTAGRUPO:
                  id = Cairo.Util.val(Dialogs.cell(row, KI_PROVCUEG_ID).getValue());
                  if(id != Cairo.Constants.NO_ID) { m_itemsDeletedCuentaGrupo = m_itemsDeletedCuentaGrupo+ id.toString()+ C_StrColon; }
                  break;

                case K_EMPRESAS:
                  _rtn = false;
                  return _rtn;
                  break;

                case K_DEPARTAMENTOS:
                  id = Cairo.Util.val(Dialogs.cell(row, KI_DPTOPROV_ID).getValue());
                  if(id != Cairo.Constants.NO_ID) { m_itemsDeletedDptos = m_itemsDeletedDptos+ id.toString()+ C_StrColon; }
                  break;

                case K_CENTROS_DE_COSTO:
                  id = Cairo.Util.val(Dialogs.cell(row, KI_PROVCCOS_ID).getValue());
                  if(id != Cairo.Constants.NO_ID) { m_itemsDeletedCcos = m_itemsDeletedCcos+ id.toString()+ C_StrColon; }
                  break;

                case K_RETENCION:
                  id = Cairo.Util.val(Dialogs.cell(row, KI_PROVRET_ID).getValue());
                  if(id != Cairo.Constants.NO_ID) { m_itemsDeletedRetenciones = m_itemsDeletedRetenciones+ id.toString()+ C_StrColon; }
                  break;
              }

              _rtn = true;

              return _rtn;
            };

            var isEmptyRow = function(key,  row,  rowIndex) {
              var _rtn = null;
              try {

                switch (key) {
                  case K_CAIS:
                    _rtn = pIsEmptyRow(row, rowIndex);
                    break;

                  case K_CUENTAGRUPO:
                    _rtn = pIsEmptyRowCuentaGrupo(row, rowIndex);
                    break;

                  case K_EMPRESAS:
                    _rtn = false;
                    break;

                  case K_DEPARTAMENTOS:
                    _rtn = pIsEmptyRowDpto(row, rowIndex);
                    break;

                  case K_CENTROS_DE_COSTO:
                    _rtn = pIsEmptyRowCcos(row, rowIndex);
                    break;

                  case K_RETENCION:
                    _rtn = pIsEmptyRowRetencion(row, rowIndex);
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

            var listAdHock = function(key,  row,  colIndex,  list) {

            };

            var newRow = function(key,  rows) {

            };

            var validateRow = function(key,  row,  rowIndex) {
              var _rtn = null;
              try {

                switch (key) {
                  case K_CAIS:
                    _rtn = pValidateRowCAIs(row, rowIndex);
                    break;

                  case K_CUENTAGRUPO:
                    _rtn = pValidateRowCuentaGrupo(row, rowIndex);
                    break;

                  case K_EMPRESAS:
                    _rtn = true;
                    break;

                  case K_DEPARTAMENTOS:
                    _rtn = pValidateRowDpto(row, rowIndex);
                    break;

                  case K_CENTROS_DE_COSTO:
                    _rtn = pValidateRowCcos(row, rowIndex);
                    break;

                  case K_RETENCION:
                    _rtn = pValidateRowRetencion(row, rowIndex);
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

            self.edit = function(id,  inModalWindow) {
              var p = Cairo.Promises.resolvedPromise(false);
              try {

                if(!pValidateAccessNewEdit(Cairo.Constants.NO_ID)) { return p; }

                m_dialog.setInModalWindow(inModalWindow);

                m_genericEdit = new cGenericEdit();
                if(!m_genericEdit.init(Cairo.Tables.PROVEEDOR)) { return p; }

                if(!self.load(id)) { return p; }

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

      var pValidateAccessNewEdit = function(id) {
        if(id == Cairo.Constants.NO_ID) {
          m_isNew = true;
          if(!Cairo.Security.hasPermissionTo(csGeneralPrestacion.Cairo.Security.Actions.General.NEW_PROVEEDOR)) { return false; }
        }
        else {
          m_isNew = false;
          if(!Cairo.Security.hasPermissionTo(csGeneralPrestacion.Cairo.Security.Actions.General.EDIT_PROVEEDOR)) { return false; }
        }
        return true;
      };

      var pValidateRowDpto = function(row,  rowIndex) {
        var cell = null;

        var strRow = " (Row: " + rowIndex.toString() + ")";

        var _count = row.size();
        for (var _i = 0; _i < _count; _i++) {
          cell = row.item(_i);
          switch (cell.getKey()) {
            case KI_DPTO_ID:
              if(ValEmpty(cell.getId(), Cairo.Constants.Types.id)) {
                MsgInfo(Cairo.Language.getText(1385, "", strRow));
                //Debe indicar un departamento
              }
              break;
          }
        }

        return Cairo.Promises.resolvedPromise(true);
      };

      var pValidateRowCcos = function(row,  rowIndex) {
        var cell = null;

        var strRow = " (Row: " + rowIndex.toString() + ")";

        var _count = row.size();
        for (var _i = 0; _i < _count; _i++) {
          cell = row.item(_i);
          switch (cell.getKey()) {
            case KI_CCOS_ID:
              if(ValEmpty(cell.getId(), Cairo.Constants.Types.id)) {
                MsgInfo(Cairo.Language.getText(4603, "", strRow));
                //Debe indicar un centro de costo
              }
              break;
          }
        }

        return Cairo.Promises.resolvedPromise(true);
      };

      var pValidateRowRetencion = function(row,  rowIndex) {
        var cell = null;

        var strRow = " (Row: " + rowIndex.toString() + ")";

        var _count = row.size();
        for (var _i = 0; _i < _count; _i++) {
          cell = row.item(_i);
          switch (cell.getKey()) {
            case KI_RET_ID:
              if(ValEmpty(cell.getId(), Cairo.Constants.Types.id)) {
                MsgInfo(Cairo.Language.getText(1386, "", strRow));
                //Debe indicar una retención (1)
              }
              break;
          }
        }

        return Cairo.Promises.resolvedPromise(true);
      };

      var pValidateRowCuentaGrupo = function(row,  rowIndex) {
        var cell = null;

        var strRow = " (Row: " + rowIndex.toString() + ")";

        var _count = row.size();
        for (var _i = 0; _i < _count; _i++) {
          cell = row.item(_i);
          switch (cell.getKey()) {
            case KI_CUEG_ID:
              if(ValEmpty(cell.getId(), Cairo.Constants.Types.id)) {
                MsgInfo(Cairo.Language.getText(1387, "", strRow));
                //Debe indicar un Grupo de Cuenta (1)
              }
              break;

            case KI_CUE_ID:
              if(ValEmpty(cell.getId(), Cairo.Constants.Types.id)) {
                MsgInfo(Cairo.Language.getText(1388, "", strRow));
                //Debe indicar una Cuenta (1)
              }
              break;
          }
        }

        return Cairo.Promises.resolvedPromise(true);
      };

      var pValidateRowCAIs = function(row,  rowIndex) {
        var cell = null;

        var strRow = " (Row: " + rowIndex.toString() + ")";

        var _count = row.size();
        for (var _i = 0; _i < _count; _i++) {
          cell = row.item(_i);
          switch (cell.getKey()) {
            case KI_NUMERO:
              if(ValEmpty(cell.getValue(), Cairo.Constants.Types.text)) {
                MsgInfo(Cairo.Language.getText(1383, "", strRow));
                //Debe indicar un número de CAI (1)
              }
              break;

            case KI_FECHAVTO:
              if(ValEmpty(cell.getValue(), Cairo.Constants.Types.date) || LenB(cell.getValue()) == 0) {
                MsgInfo(Cairo.Language.getText(1384, "", strRow));
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
          register.setFieldId(Cairo.General.Constants.PROVC_ID);
          register.setTable(Cairo.General.Constants.PROVEEDORCAI);
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
                fields.add(Cairo.General.Constants.PROVC_NUMERO, cell.getValue(), Cairo.Constants.Types.text);
                break;

              case KI_DESCRIP:
                fields.add(Cairo.General.Constants.PROVC_DESCRIP, cell.getValue(), Cairo.Constants.Types.text);
                break;

              case KI_FECHAVTO:
                fields.add(Cairo.General.Constants.PROVC_FECHAVTO, cell.getValue(), Cairo.Constants.Types.date);
                break;

              case KI_ACTIVO:
                fields.add(Cairo.Constants.ACTIVE, cell.getId(), Cairo.Constants.Types.boolean);
                break;

              case KI_SUCURSAL:
                fields.add(Cairo.General.Constants.PROVC_SUCURSAL, cell.getValue(), Cairo.Constants.Types.text);
                break;
            }
          }

          fields.add(Cairo.General.Constants.PROV_ID, m_id, Cairo.Constants.Types.id);

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
        //'Dirección
        tab.setName(Cairo.Language.getText(1037, ""));

        var tab = w_tabs.add(null);
        tab.setIndex(c_tab_cais);
        //'CAIS
        tab.setName(Cairo.Language.getText(1390, ""));

        var tab = w_tabs.add(null);
        tab.setIndex(c_tab_cuentagrupo);
        //'Grupos de Ctas.
        tab.setName(Cairo.Language.getText(1391, ""));

        var tab = w_tabs.add(null);
        tab.setIndex(c_tab_credito);
        //'Crédito
        tab.setName(Cairo.Language.getText(1392, ""));

        var tab = w_tabs.add(null);
        tab.setIndex(c_tab_retencion);
        //'Retenciones
        tab.setName(Cairo.Language.getText(1393, ""));

        var tab = w_tabs.add(null);
        tab.setIndex(c_tab_empresas);
        //'Empresas
        tab.setName(Cairo.Language.getText(1171, ""));

        var tab = w_tabs.add(null);
        tab.setIndex(c_tab_dpto);
        //'Deptos.
        tab.setName(Cairo.Language.getText(1508, ""));

        var tab = w_tabs.add(null);
        tab.setIndex(c_tab_ccos);
        //'Centros de Costo
        tab.setName(Cairo.Language.getText(4602, ""));

        m_dialog.setTitle(m_name);

        var properties = m_dialog.getProperties();

        properties.clear();

        var elem = properties.add(null, Cairo.General.Constants.PROV_NAME);
        elem.setType(Dialogs.PropertyType.text);
        elem.setName(Cairo.Constants.NAME_LABEL);
        elem.setSize(255);
        elem.setWidth(6100);
        elem.setKey(K_NAME);
        elem.setValue(m_name);

        var elem = properties.add(null, Cairo.General.Constants.PROV_RAZONSOCIAL);
        elem.setType(Dialogs.PropertyType.text);
        //'Razon Social
        elem.setName(Cairo.Language.getText(1178, ""));
        elem.setSize(255);
        elem.setWidth(6100);
        elem.setKey(K_RAZONSOCIAL);
        elem.setValue(m_razonsocial);

        var elem = properties.add(null, Cairo.General.Constants.PROV_CODE);
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

        var elem = properties.add(null, Cairo.General.Constants.PROV_IMPRIME_TICKET);
        elem.setType(Dialogs.PropertyType.check);
        //'Imprime Ticket
        elem.setName(Cairo.Language.getText(1394, ""));
        elem.setLeftToPrevious(3000);
        elem.setLeftNotChange(true);
        elem.setTopFromProperty(Cairo.Constants.ACTIVE);
        elem.setKey(K_IMPRIMETICKET);
        elem.setValue(Cairo.Util.boolToInt(m_imprimeTicket));

        var elem = properties.add(null, Cairo.General.Constants.PROV_CONTACTO);
        elem.setType(Dialogs.PropertyType.text);
        //'Contacto
        elem.setName(Cairo.Language.getText(1035, ""));
        elem.setSize(30);
        elem.setKey(K_CONTACTO);
        elem.setValue(m_contacto);

        var elem = properties.add(null, Cairo.General.Constants.LP_ID);
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.LISTAPRECIO);

        filter = "exists(select lp_id from listaprecioproveedor where prov_id ="+ m_id;
        filter = filter+ " and lp_id = listaprecio.lp_id)";

        elem.setSelectFilter(filter);
        //'Lista de precios
        elem.setName(Cairo.Language.getText(1397, ""));
        elem.setKey(K_LP_ID);
        elem.setValue(m_listaPrecio);
        elem.setSelectId(m_lp_id);

        var elem = properties.add(null, Cairo.General.Constants.PROV_CATFISCAL);
        elem.setType(Dialogs.PropertyType.list);
        //'Categoria Fiscal
        elem.setName(Cairo.Language.getText(1181, ""));
        elem.setTopFromProperty(Cairo.General.Constants.PROV_CODE);
        elem.setLeft(5500);
        elem.setKey(K_CATFISCAL);
        elem.setListWhoSetItem(csListItemData);
        elem.setListItemData(m_catFiscal);

        var elem = elem.add(null, csCatFiscal.cSCATFNOINSCRIPTO);
        elem.Id = csCatFiscal.cSCATFNOINSCRIPTO;
        //'No Inscripto
        elem.setValue(Cairo.Language.getText(1183, ""));

        var elem = elem.add(null, csCatFiscal.cSCATFINSCRIPTO);
        elem.Id = csCatFiscal.cSCATFINSCRIPTO;
        //'Inscripto
        elem.setValue(Cairo.Language.getText(1184, ""));

        var elem = elem.add(null, csCatFiscal.cSCATFEXTRANJERO);
        elem.Id = csCatFiscal.cSCATFEXTRANJERO;
        //'Extranjero
        elem.setValue(Cairo.Language.getText(1185, ""));

        var elem = elem.add(null, csCatFiscal.cSCATFEXENTO);
        elem.Id = csCatFiscal.cSCATFEXENTO;
        //'Exento
        elem.setValue(Cairo.Language.getText(1186, ""));

        var elem = elem.add(null, csCatFiscal.cSCATFMONOTRIBUTO);
        elem.Id = csCatFiscal.cSCATFMONOTRIBUTO;
        //'Monotributo
        elem.setValue(Cairo.Language.getText(1187, ""));

        var elem = elem.add(null, csCatFiscal.cSCATFEXTRANJEROIVA);
        elem.Id = csCatFiscal.cSCATFEXTRANJEROIVA;
        //'Extranjero con Iva
        elem.setValue(Cairo.Language.getText(1188, ""));

        var elem = elem.add(null, csCatFiscal.cSCATFNOCATEGORIZADO);
        elem.Id = csCatFiscal.cSCATFNOCATEGORIZADO;
        //'No categorizado
        elem.setValue(Cairo.Language.getText(1189, ""));

        var elem = elem.add(null, csCatFiscal.cSCATFNORESPONSABLE);
        elem.Id = csCatFiscal.cSCATFNORESPONSABLE;
        //'No responsable
        elem.setValue(Cairo.Language.getText(1190, ""));

        var elem = elem.add(null, csCatFiscal.cSCATFNORESPONSABLEEXENTO);
        elem.Id = csCatFiscal.cSCATFNORESPONSABLEEXENTO;
        //'No responsable exento
        elem.setValue(Cairo.Language.getText(1191, ""));

        var elem = elem.add(null, csCatFiscal.cSCATFINSCRIPTOM);
        elem.Id = csCatFiscal.cSCATFINSCRIPTOM;
        //'Inscripto M
        elem.setValue(Cairo.Language.getText(1192, ""));

        var elem = properties.add(null, Cairo.General.Constants.PROV_CUIT);
        elem.setType(Dialogs.PropertyType.text);
        //'Cuit
        elem.setName(Cairo.Language.getText(1179, ""));
        elem.setSize(13);
        elem.setKey(K_CUIT);
        elem.setValue(m_cuit);

        var elem = properties.add(null, Cairo.General.Constants.PROV_INGRESOSBRUTOS);
        elem.setType(Dialogs.PropertyType.text);
        //'Ingresos Brutos
        elem.setName(Cairo.Language.getText(1180, ""));
        elem.setSize(20);
        elem.setKey(K_INGRESOSBRUTOS);
        elem.setValue(m_ingresosbrutos);

        var elem = properties.add(null, Cairo.General.Constants.LD_ID);
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.LISTADESCUENTO);
        //'Lista de descuentos
        elem.setName(Cairo.Language.getText(1398, ""));
        elem.setKey(K_LD_ID);

        filter = "exists(select ld_id from listadescuentoproveedor where prov_id ="+ m_id;
        filter = filter+ " and ld_id = listadescuento.ld_id)";

        elem.setSelectFilter(filter);
        elem.setValue(m_listaDescuento);
        elem.setSelectId(m_ld_id);

        var elem = properties.add(null, Cairo.General.Constants.CPG_ID);
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.CONDICIONPAGO);
        //'Condición de pago
        elem.setName(Cairo.Language.getText(1395, ""));
        elem.setTopFromProperty(Cairo.General.Constants.PROV_NAME);
        elem.setLeft(9500);
        elem.setKey(K_CPG_ID);
        elem.setValue(m_condicionPago);
        elem.setSelectId(m_cpg_id);

        var elem = properties.add(null, Cairo.General.Constants.PROV_CHEQUEORDEN);
        elem.setType(Dialogs.PropertyType.text);
        //'Cheque a la orden
        elem.setName(Cairo.Language.getText(1396, ""));
        elem.setSize(100);
        elem.setKey(K_CHEQUEORDEN);
        elem.setValue(m_chequeorden);

        var elem = properties.add(null, Cairo.General.Constants.PROV_BANCO);
        elem.setType(Dialogs.PropertyType.text);
        //'Banco
        elem.setName(Cairo.Language.getText(1122, ""));
        elem.setSize(100);
        elem.setKey(K_BANCO);
        elem.setValue(m_banco);

        var elem = properties.add(null, Cairo.General.Constants.PROV_NRO_CTA_BANCO);
        elem.setType(Dialogs.PropertyType.text);
        //'Cuenta Bancaria
        elem.setName(Cairo.Language.getText(4710, ""));
        elem.setSize(255);
        elem.setKey(K_NROCTA);
        elem.setValue(m_nroctabanco);

        var elem = properties.add(null, Cairo.General.Constants.PROV_CBU);
        elem.setType(Dialogs.PropertyType.text);
        //'CBU
        elem.setName(Cairo.Language.getText(4711, ""));
        elem.setSize(100);
        elem.setKey(K_CBU);
        elem.setValue(m_cbu);

        var elem = properties.add(null, Cairo.General.Constants.PROV_NRO_CLIENTE);
        elem.setType(Dialogs.PropertyType.text);
        //'Nro. de Cliente
        elem.setName(Cairo.Language.getText(4715, ""));
        elem.setSize(100);
        elem.setKey(K_NROCLIENTE);
        elem.setValue(m_nrocliente);

        var elem = properties.add(null, Cairo.General.Constants.PROV_CREDITOCTACTE);
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setSubType(Dialogs.PropertySubType.money);
        //'Crédito en Cta.Cte.
        elem.setName(Cairo.Language.getText(1399, ""));
        elem.setTabIndex(c_tab_credito);
        elem.setKey(K_CREDITOCTACTE);
        elem.setValue(m_creditoctacte);

        var elem = properties.add(null, Cairo.General.Constants.PROV_CREDITOTOTAL);
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setSubType(Dialogs.PropertySubType.money);
        //'Crédito Total
        elem.setName(Cairo.Language.getText(1400, ""));
        elem.setTabIndex(c_tab_credito);
        elem.setKey(K_CREDITOTOTAL);
        elem.setValue(m_creditototal);

        var elem = properties.add(null, Cairo.General.Constants.PROV_CREDITOACTIVO);
        elem.setType(Dialogs.PropertyType.check);
        //'Crédito Activo
        elem.setName(Cairo.Language.getText(1401, ""));
        elem.setTabIndex(c_tab_credito);
        elem.setKey(K_CREDITOACTIVO);
        elem.setValue(Cairo.Util.boolToInt(m_creditoactivo));

        var elem = properties.add(null, Cairo.General.Constants.PROV_DESCRIP);
        elem.setType(Dialogs.PropertyType.text);
        elem.setSubType(Dialogs.PropertySubType.memo);
        elem.setWidth(10150);
        elem.setHeight(780);
        elem.setName(Cairo.Constants.DESCRIPTION_LABEL);
        elem.setSize(255);

        elem.setTopFromProperty(Cairo.General.Constants.PROV_CONTACTO);
        elem.setTopToPrevious(1040);
        elem.setLeftFromProperty(Cairo.General.Constants.PROV_NAME);
        elem.setKey(K_DESCRIP);
        elem.setValue(m_descrip);

        var elem = properties.add(null, Cairo.General.Constants.PROV_CALLE);
        elem.setType(Dialogs.PropertyType.text);
        //'Calle
        elem.setName(Cairo.Language.getText(1194, ""));
        elem.setTabIndex(c_tab_direccion);
        elem.setKey(K_CALLE);
        elem.setValue(m_calle);
        elem.setWidth(9000);

        var elem = properties.add(null, Cairo.General.Constants.PROV_CALLENUMERO);
        elem.setType(Dialogs.PropertyType.text);
        //'Número
        elem.setName(Cairo.Language.getText(1065, ""));
        elem.setTabIndex(c_tab_direccion);
        elem.setSize(10);
        elem.setKey(K_CALLENUMERO);
        elem.setValue(m_callenumero);
        elem.setWidth(1200);

        var elem = properties.add(null, Cairo.General.Constants.PROV_PISO);
        elem.setType(Dialogs.PropertyType.text);
        //'Piso
        elem.setName(Cairo.Language.getText(1196, ""));
        elem.setTabIndex(c_tab_direccion);
        elem.setSize(4);
        elem.setKey(K_PISO);
        elem.setValue(m_piso);
        elem.setWidth(1200);

        var elem = properties.add(null, Cairo.General.Constants.PROV_DEPTO);
        elem.setType(Dialogs.PropertyType.text);
        //'Departamento
        elem.setName(Cairo.Language.getText(1278, ""));
        elem.setTabIndex(c_tab_direccion);
        elem.setSize(4);
        elem.setKey(K_DEPTO);
        elem.setValue(m_depto);
        elem.setWidth(1200);

        var elem = properties.add(null, Cairo.General.Constants.PROV_CODPOSTAL);
        elem.setType(Dialogs.PropertyType.text);
        //'Codigo Postal
        elem.setName(Cairo.Language.getText(1199, ""));
        elem.setTabIndex(c_tab_direccion);
        elem.setSize(20);
        elem.setKey(K_CODPOSTAL);
        elem.setValue(m_codpostal);
        elem.setWidth(1200);

        var elem = properties.add(null, Cairo.General.Constants.PROV_LOCALIDAD);
        elem.setType(Dialogs.PropertyType.text);
        //'Localidad
        elem.setName(Cairo.Language.getText(1198, ""));
        elem.setTabIndex(c_tab_direccion);
        elem.setSize(100);
        elem.setKey(K_LOCALIDAD);
        elem.setValue(m_localidad);
        elem.setWidth(6500);

        var elem = properties.add(null, Cairo.General.Constants.PRO_ID);
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.PROVINCIA);
        //'Provincia
        elem.setName(Cairo.Language.getText(1080, ""));
        elem.setTabIndex(c_tab_direccion);
        elem.setKey(K_PRO_ID);
        elem.setValue(m_provincia);
        elem.setSelectId(m_pro_id);
        elem.setWidth(6500);

        var elem = properties.add(null, Cairo.General.Constants.ZON_ID);
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.ZONA);
        //'Zona
        elem.setName(Cairo.Language.getText(1402, ""));
        elem.setTabIndex(c_tab_direccion);
        elem.setKey(K_ZON_ID);
        elem.setValue(m_zona);
        elem.setSelectId(m_zon_id);
        elem.setWidth(6500);

        var elem = properties.add(null, Cairo.General.Constants.PROV_HORARIO_MDESDE);
        elem.setType(Dialogs.PropertyType.time);
        //' Horario desde
        elem.setName(Cairo.Language.getText(4965, ""));
        elem.setTabIndex(c_tab_direccion);
        elem.setValue(m_horario_m_desde);
        elem.setKey(K_HORARIO_M_DESDE);
        elem.setLeftNotChange(true);

        var elem = properties.add(null, Cairo.General.Constants.PROV_HORARIO_MHASTA);
        elem.setType(Dialogs.PropertyType.time);
        //' Hasta
        elem.setName(Cairo.Language.getText(4966, ""));
        elem.setTabIndex(c_tab_direccion);
        elem.setValue(m_horario_m_hasta);
        elem.setKey(K_HORARIO_M_HASTA);
        elem.setTopFromProperty(Cairo.General.Constants.PROV_HORARIO_MDESDE);
        elem.setLeft(3200);
        elem.setLeftLabel(-500);
        elem.setLeftNotChange(true);
        elem.setTopNotChange(true);

        var elem = properties.add(null, Cairo.General.Constants.PROV_HORARIO_TDESDE);
        elem.setType(Dialogs.PropertyType.time);
        //' Desde
        elem.setName(Cairo.Language.getText(4967, ""));
        elem.setTabIndex(c_tab_direccion);
        elem.setValue(m_horario_t_desde);
        elem.setKey(K_HORARIO_T_DESDE);
        elem.setTopFromProperty(Cairo.General.Constants.PROV_HORARIO_MDESDE);
        elem.setLeft(4900);
        elem.setLeftLabel(-500);
        elem.setLeftNotChange(true);
        elem.setTopNotChange(true);

        var elem = properties.add(null, Cairo.General.Constants.PROV_HORARIO_THASTA);
        elem.setType(Dialogs.PropertyType.time);
        //' Hasta
        elem.setName(Cairo.Language.getText(4966, ""));
        elem.setTabIndex(c_tab_direccion);
        elem.setValue(m_horario_t_hasta);
        elem.setKey(K_HORARIO_T_HASTA);
        elem.setTopFromProperty(Cairo.General.Constants.PROV_HORARIO_MDESDE);
        elem.setLeft(6700);
        elem.setLeftLabel(-500);
        elem.setLeftNotChange(true);
        elem.setTopNotChange(true);

        var elem = properties.add(null, Cairo.General.Constants.PROV_TEL);
        elem.setType(Dialogs.PropertyType.text);
        //'Teléfono
        elem.setName(Cairo.Language.getText(1036, ""));
        elem.setTabIndex(c_tab_direccion);
        elem.setSize(100);
        elem.setKey(K_TEL);
        elem.setValue(m_tel);
        elem.setWidth(6000);
        elem.setTopFromProperty(Cairo.General.Constants.PROV_CALLENUMERO);
        elem.setLeft(4200);
        elem.setLeftLabel(-900);

        var elem = properties.add(null, Cairo.General.Constants.PROV_FAX);
        elem.setType(Dialogs.PropertyType.text);
        //'Fax
        elem.setName(Cairo.Language.getText(1200, ""));
        elem.setTabIndex(c_tab_direccion);
        elem.setSize(50);
        elem.setKey(K_FAX);
        elem.setValue(m_fax);

        var elem = properties.add(null, Cairo.General.Constants.PROV_EMAIL);
        elem.setType(Dialogs.PropertyType.text);
        //'E-Mail
        elem.setName(Cairo.Language.getText(1034, ""));
        elem.setTabIndex(c_tab_direccion);
        elem.setSize(100);
        elem.setKey(K_EMAIL);
        elem.setValue(m_email);
        elem.setWidth(4000);

        var elem = properties.add(null, Cairo.General.Constants.PROV_WEB);
        elem.setType(Dialogs.PropertyType.text);
        //'Web
        elem.setName(Cairo.Language.getText(1038, ""));
        elem.setTabIndex(c_tab_direccion);
        elem.setSize(100);
        elem.setKey(K_WEB);
        elem.setValue(m_web);
        elem.setWidth(6000);

        c = properties.add(null, C_CAIS);
        c.setType(Dialogs.PropertyType.grid);
        c.setLeftLabel(-1);
        setGridCAIs(c);
        if(!pLoadCAIs(c)) { return false; }
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
        if(!pLoadCuentaGrupo(c)) { return false; }
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
        if(!pLoadRetencion(c)) { return false; }
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
        if(!pLoadEmpresas(c)) { return false; }
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
        if(!pLoadDpto(c)) { return false; }
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
        if(!pLoadCcos(c)) { return false; }
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

        var elem = properties.item(Cairo.General.Constants.PROV_NAME);
        elem.setValue(m_name);

        var elem = properties.item(Cairo.General.Constants.PROV_RAZONSOCIAL);
        elem.setValue(m_razonsocial);

        var elem = properties.item(Cairo.General.Constants.PROV_CODE);
        elem.setValue(m_code);

        var elem = properties.item(Cairo.Constants.ACTIVE);
        elem.setValue(m_active === true ? 1 : 0);

        var elem = properties.item(Cairo.General.Constants.PROV_IMPRIME_TICKET);
        elem.setValue(Cairo.Util.boolToInt(m_imprimeTicket));

        var elem = properties.item(Cairo.General.Constants.PROV_CONTACTO);
        elem.setValue(m_contacto);

        var elem = properties.item(Cairo.General.Constants.LP_ID);
        elem.setValue(m_listaPrecio);
        elem.setSelectId(m_lp_id);

        var elem = properties.item(Cairo.General.Constants.PROV_CATFISCAL);

        var elem = properties.item(Cairo.General.Constants.PROV_CUIT);
        elem.setValue(m_cuit);

        var elem = properties.item(Cairo.General.Constants.PROV_INGRESOSBRUTOS);
        elem.setValue(m_ingresosbrutos);

        var elem = properties.item(Cairo.General.Constants.LD_ID);
        elem.setValue(m_listaDescuento);
        elem.setSelectId(m_ld_id);

        var elem = properties.item(Cairo.General.Constants.CPG_ID);
        elem.setValue(m_condicionPago);
        elem.setSelectId(m_cpg_id);

        var elem = properties.item(Cairo.General.Constants.PROV_CHEQUEORDEN);
        elem.setValue(m_chequeorden);

        var elem = properties.item(Cairo.General.Constants.PROV_BANCO);
        elem.setValue(m_banco);

        var elem = properties.item(Cairo.General.Constants.PROV_NRO_CTA_BANCO);
        elem.setValue(m_nroctabanco);

        var elem = properties.item(Cairo.General.Constants.PROV_CBU);
        elem.setValue(m_cbu);

        var elem = properties.item(Cairo.General.Constants.PROV_NRO_CLIENTE);
        elem.setValue(m_nrocliente);

        var elem = properties.item(Cairo.General.Constants.PROV_CREDITOCTACTE);
        elem.setValue(m_creditoctacte);

        var elem = properties.item(Cairo.General.Constants.PROV_CREDITOTOTAL);
        elem.setValue(m_creditototal);

        var elem = properties.item(Cairo.General.Constants.PROV_CREDITOACTIVO);
        elem.setValue(Cairo.Util.boolToInt(m_creditoactivo));

        var elem = properties.item(Cairo.General.Constants.PROV_DESCRIP);
        elem.setValue(m_descrip);

        var elem = properties.item(Cairo.General.Constants.PROV_CALLE);
        elem.setValue(m_calle);

        var elem = properties.item(Cairo.General.Constants.PROV_CALLENUMERO);
        elem.setValue(m_callenumero);

        var elem = properties.item(Cairo.General.Constants.PROV_PISO);
        elem.setValue(m_piso);

        var elem = properties.item(Cairo.General.Constants.PROV_DEPTO);
        elem.setValue(m_depto);

        var elem = properties.item(Cairo.General.Constants.PROV_CODPOSTAL);
        elem.setValue(m_codpostal);

        var elem = properties.item(Cairo.General.Constants.PROV_LOCALIDAD);
        elem.setValue(m_localidad);

        var elem = properties.item(Cairo.General.Constants.PRO_ID);
        elem.setValue(m_provincia);
        elem.setSelectId(m_pro_id);

        var elem = properties.item(Cairo.General.Constants.ZON_ID);
        elem.setValue(m_zona);
        elem.setSelectId(m_zon_id);

        var elem = properties.item(Cairo.General.Constants.PROV_HORARIO_MDESDE);
        elem.setValue(m_horario_m_desde);

        var elem = properties.item(Cairo.General.Constants.PROV_HORARIO_MHASTA);
        elem.setValue(m_horario_m_hasta);

        var elem = properties.item(Cairo.General.Constants.PROV_HORARIO_TDESDE);
        elem.setValue(m_horario_t_desde);

        var elem = properties.item(Cairo.General.Constants.PROV_HORARIO_THASTA);
        elem.setValue(m_horario_t_hasta);

        var elem = properties.item(Cairo.General.Constants.PROV_TEL);
        elem.setValue(m_tel);

        var elem = properties.item(Cairo.General.Constants.PROV_FAX);
        elem.setValue(m_fax);

        var elem = properties.item(Cairo.General.Constants.PROV_EMAIL);
        elem.setValue(m_email);

        var elem = properties.item(Cairo.General.Constants.PROV_WEB);
        elem.setValue(m_web);

        return m_dialog.showValues(properties);
      };

      self.getData = function(id,  strField,  typeValue) {
        var data = null;

        switch (typeValue) {
          case Cairo.Constants.Types.boolean:
            data = false;
            break;

          case Cairo.Constants.Types.cuit:
          case Cairo.Constants.Types.text:
            data = "";
            break;

          case Cairo.Constants.Types.date:
          case Cairo.Constants.Types.dateornull:
            data = Cairo.Constants.cSNODATE;
            break;

          case Cairo.Constants.Types.currency:
          case Cairo.Constants.Types.double:
          case Cairo.Constants.Types.integer:
          case Cairo.Constants.Types.long:
          case Cairo.Constants.Types.single:
          case Cairo.Constants.Types.id:
            data = 0;
            break;

          case Cairo.Constants.Types.variant:
            data = Empty;
            break;
        }

        if(!Cairo.Database.getData(Cairo.General.Constants.PROVEEDOR, Cairo.General.Constants.PROV_ID, id, strField, data, "GetData", C_MODULE)) {
          switch (typeValue) {
            case Cairo.Constants.Types.boolean:
              data = false;
              break;

            case Cairo.Constants.Types.cuit:
            case Cairo.Constants.Types.text:
              data = "";
              break;

            case Cairo.Constants.Types.date:
            case Cairo.Constants.Types.dateornull:
              data = Cairo.Constants.cSNODATE;
              break;

            case Cairo.Constants.Types.currency:
            case Cairo.Constants.Types.double:
            case Cairo.Constants.Types.integer:
            case Cairo.Constants.Types.long:
            case Cairo.Constants.Types.single:
            case Cairo.Constants.Types.id:
              data = 0;
              break;

            case Cairo.Constants.Types.variant:
              data = Empty;
              break;
          }
        }

        return data;
      };

      self.load = function(id) {

        var apiPath = Cairo.Database.getAPIVersion();
        return Cairo.Database.getData("load[" + apiPath + "general/proveedor]", id).then(
          function(response) {

            if(response.success !== true) { return false; }

            if(response.data.id !== Cairo.Constants.NO_ID) {

              m_id = Cairo.Database.valField(response.data, Cairo.General.Constants.PROV_ID);
              m_name = Cairo.Database.valField(response.data, Cairo.General.Constants.PROV_NAME);
              m_code = Cairo.Database.valField(response.data, Cairo.General.Constants.PROV_CODE);
              m_contacto = Cairo.Database.valField(response.data, Cairo.General.Constants.PROV_CONTACTO);
              m_descrip = Cairo.Database.valField(response.data, Cairo.General.Constants.PROV_DESCRIP);
              m_cpg_id = Cairo.Database.valField(response.data, Cairo.General.Constants.CPG_ID);
              m_condicionPago = Cairo.Database.valField(response.data, Cairo.General.Constants.CPG_NAME);
              m_razonsocial = Cairo.Database.valField(response.data, Cairo.General.Constants.PROV_RAZONSOCIAL);
              m_cuit = Cairo.Database.valField(response.data, Cairo.General.Constants.PROV_CUIT);
              m_ingresosbrutos = Cairo.Database.valField(response.data, Cairo.General.Constants.PROV_INGRESOSBRUTOS);
              m_catFiscal = Cairo.Database.valField(response.data, Cairo.General.Constants.PROV_CATFISCAL);
              m_chequeorden = Cairo.Database.valField(response.data, Cairo.General.Constants.PROV_CHEQUEORDEN);
              m_codpostal = Cairo.Database.valField(response.data, Cairo.General.Constants.PROV_CODPOSTAL);
              m_localidad = Cairo.Database.valField(response.data, Cairo.General.Constants.PROV_LOCALIDAD);
              m_calle = Cairo.Database.valField(response.data, Cairo.General.Constants.PROV_CALLE);
              m_callenumero = Cairo.Database.valField(response.data, Cairo.General.Constants.PROV_CALLENUMERO);
              m_piso = Cairo.Database.valField(response.data, Cairo.General.Constants.PROV_PISO);
              m_depto = Cairo.Database.valField(response.data, Cairo.General.Constants.PROV_DEPTO);
              m_tel = Cairo.Database.valField(response.data, Cairo.General.Constants.PROV_TEL);
              m_fax = Cairo.Database.valField(response.data, Cairo.General.Constants.PROV_FAX);
              m_email = Cairo.Database.valField(response.data, Cairo.General.Constants.PROV_EMAIL);
              m_web = Cairo.Database.valField(response.data, Cairo.General.Constants.PROV_WEB);
              m_pro_id = Cairo.Database.valField(response.data, Cairo.General.Constants.PRO_ID);
              m_zon_id = Cairo.Database.valField(response.data, Cairo.General.Constants.ZON_ID);
              m_provincia = Cairo.Database.valField(response.data, Cairo.General.Constants.PRO_NAME);
              m_zona = Cairo.Database.valField(response.data, Cairo.General.Constants.ZON_NAME);
              m_creditoctacte = Cairo.Database.valField(response.data, Cairo.General.Constants.PROV_CREDITOCTACTE);
              m_creditototal = Cairo.Database.valField(response.data, Cairo.General.Constants.PROV_CREDITOTOTAL);
              m_creditoactivo = Cairo.Database.valField(response.data, Cairo.General.Constants.PROV_CREDITOACTIVO);
              m_active = Cairo.Database.valField(response.data, Cairo.Constants.ACTIVE);
              m_imprimeTicket = Cairo.Database.valField(response.data, Cairo.General.Constants.PROV_IMPRIME_TICKET);
              m_lp_id = Cairo.Database.valField(response.data, Cairo.General.Constants.LP_ID);
              m_listaPrecio = Cairo.Database.valField(response.data, Cairo.General.Constants.LP_NAME);
              m_ld_id = Cairo.Database.valField(response.data, Cairo.General.Constants.LD_ID);
              m_listaDescuento = Cairo.Database.valField(response.data, Cairo.General.Constants.LD_NAME);

              m_nroctabanco = Cairo.Database.valField(response.data, Cairo.General.Constants.PROV_NRO_CTA_BANCO);
              m_banco = Cairo.Database.valField(response.data, Cairo.General.Constants.PROV_BANCO);
              m_cbu = Cairo.Database.valField(response.data, Cairo.General.Constants.PROV_CBU);
              m_nrocliente = Cairo.Database.valField(response.data, Cairo.General.Constants.PROV_NRO_CLIENTE);

              m_horario_m_desde = Cairo.Database.valField(response.data, Cairo.General.Constants.PROV_HORARIO_MDESDE);
              m_horario_m_hasta = Cairo.Database.valField(response.data, Cairo.General.Constants.PROV_HORARIO_MHASTA);
              m_horario_t_desde = Cairo.Database.valField(response.data, Cairo.General.Constants.PROV_HORARIO_TDESDE);
              m_horario_t_hasta = Cairo.Database.valField(response.data, Cairo.General.Constants.PROV_HORARIO_THASTA);

            }
            else {

              m_id = Cairo.Constants.NO_ID;
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
              m_cpg_id = Cairo.Constants.NO_ID;
              m_condicionPago = "";
              m_pro_id = Cairo.Constants.NO_ID;
              m_zon_id = Cairo.Constants.NO_ID;
              m_lp_id = Cairo.Constants.NO_ID;
              m_listaPrecio = "";
              m_ld_id = Cairo.Constants.NO_ID;
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

        var property = properties.item(Cairo.General.Constants.PROV_NAME);
        property.setValue(m_name);

        var property = properties.item(Cairo.General.Constants.PROV_RAZONSOCIAL);
        property.setValue(m_razonsocial);

        var property = properties.item(Cairo.General.Constants.PROV_CODE);
        property.setValue(m_code);

        var property = properties.item(Cairo.Constants.ACTIVE);
        property.setValue(m_active === true ? 1 : 0);

        var property = properties.item(Cairo.General.Constants.PROV_IMPRIME_TICKET);
        property.setValue(Integer.parseInt(m_imprimeTicket));

        var property = properties.item(Cairo.General.Constants.PROV_CONTACTO);
        property.setValue(m_contacto);

        var property = properties.item(Cairo.General.Constants.PROV_CATFISCAL);
        property.setListItemData(m_catFiscal);

        var property = properties.item(Cairo.General.Constants.PROV_CUIT);
        property.setValue(m_cuit);

        var property = properties.item(Cairo.General.Constants.PROV_INGRESOSBRUTOS);
        property.setValue(m_ingresosbrutos);

        var property = properties.item(Cairo.General.Constants.CPG_ID);
        property.setValue(m_condicionPago);
        property.setSelectId(m_cpg_id);

        var property = properties.item(Cairo.General.Constants.PROV_CHEQUEORDEN);
        property.setValue(m_chequeorden);

        var property = properties.item(Cairo.General.Constants.LP_ID);
        filter = "exists(select lp_id from listaprecioproveedor where prov_id ="+ m_id;
        filter = filter+ " and lp_id = listaprecio.lp_id)";
        property.setSelectFilter(filter);
        property.setValue(m_listaPrecio);
        property.setSelectId(m_lp_id);

        var property = properties.item(Cairo.General.Constants.LD_ID);
        filter = "exists(select ld_id from listadescuentoproveedor where prov_id ="+ m_id;
        filter = filter+ " and ld_id = listadescuento.ld_id)";
        property.setSelectFilter(filter);
        property.setValue(m_listaDescuento);
        property.setSelectId(m_ld_id);

        var property = properties.item(Cairo.General.Constants.PROV_CREDITOCTACTE);
        property.setValue(m_creditoctacte);

        var property = properties.item(Cairo.General.Constants.PROV_CREDITOTOTAL);
        property.setValue(m_creditototal);

        var property = properties.item(Cairo.General.Constants.PROV_CREDITOACTIVO);
        property.setValue(Integer.parseInt(m_creditoactivo));

        var property = properties.item(Cairo.General.Constants.PROV_DESCRIP);
        property.setValue(m_descrip);

        var property = properties.item(Cairo.General.Constants.PROV_CALLE);
        property.setValue(m_calle);

        var property = properties.item(Cairo.General.Constants.PROV_CALLENUMERO);
        property.setValue(m_callenumero);

        var property = properties.item(Cairo.General.Constants.PROV_PISO);
        property.setValue(m_piso);

        var property = properties.item(Cairo.General.Constants.PROV_DEPTO);
        property.setValue(m_depto);

        var property = properties.item(Cairo.General.Constants.PROV_TEL);
        property.setValue(m_tel);

        var property = properties.item(Cairo.General.Constants.PROV_FAX);
        property.setValue(m_fax);

        var property = properties.item(Cairo.General.Constants.PROV_EMAIL);
        property.setValue(m_email);

        var property = properties.item(Cairo.General.Constants.PROV_WEB);
        property.setValue(m_web);

        var property = properties.item(Cairo.General.Constants.PROV_CODPOSTAL);
        property.setValue(m_codpostal);

        var property = properties.item(Cairo.General.Constants.PROV_HORARIO_MDESDE);
        property.setValue(m_horario_m_desde);

        var property = properties.item(Cairo.General.Constants.PROV_HORARIO_MHASTA);
        property.setValue(m_horario_m_hasta);

        var property = properties.item(Cairo.General.Constants.PROV_HORARIO_TDESDE);
        property.setValue(m_horario_t_desde);

        var property = properties.item(Cairo.General.Constants.PROV_HORARIO_THASTA);
        property.setValue(m_horario_t_hasta);

        var property = properties.item(Cairo.General.Constants.PROV_LOCALIDAD);
        property.setValue(m_localidad);

        var property = properties.item(Cairo.General.Constants.PRO_ID);
        property.setValue(m_provincia);
        property.setSelectId(m_pro_id);

        var property = properties.item(Cairo.General.Constants.ZON_ID);
        property.setValue(m_zona);
        property.setSelectId(m_zon_id);

        c = properties.item(C_CAIS);
        if(!pLoadCAIs(c)) { return; }
        m_itemsDeletedCAIS = "";

        c = properties.item(C_CUENTAGRUPO);
        if(!pLoadCuentaGrupo(c)) { return; }
        m_itemsDeletedCuentaGrupo = "";

        c = properties.item(C_RETENCION);
        if(!pLoadRetencion(c)) { return; }
        m_itemsDeletedRetenciones = "";

        c = properties.item(C_EMPRESAS);
        if(!pLoadEmpresas(c)) { return; }

        c = properties.item(C_DPTO);
        if(!pLoadDpto(c)) { return; }
        m_itemsDeletedDptos = "";

        c = properties.item(C_CCOS);
        if(!pLoadCcos(c)) { return; }
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
        //'Departamento
        elem.setName(Cairo.Language.getText(1278, ""));
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.DEPARTAMENTO);
        elem.setWidth(3500);
        elem.setKey(KI_DPTO_ID);

        var w_rows = w_grid.getRows();

        w_rows.clear();
        return true;
      };

      var pLoadDpto = function() {


        for(var _i = 0; _i < m_data.dpto.length; _i += 1) {

          var elem = w_rows.add(null, rs(Cairo.General.Constants.DPTO_PROV_ID).Value);

          var elem = elem.add(null);
          elem.Value = Cairo.Database.valField(m_data.dpto[_i], Cairo.General.Constants.DPTO_PROV_ID);
          elem.setKey(KI_DPTOPROV_ID);

          var elem = elem.add(null);
          elem.Value = Cairo.Database.valField(m_data.dpto[_i], Cairo.General.Constants.DPTO_NAME);
          elem.Id = rs(Cairo.General.Constants.DPTO_ID).Value;
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
        //'Centro de Costo
        elem.setName(Cairo.Language.getText(1057, ""));
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.CENTROCOSTO);
        elem.setWidth(3500);
        elem.setKey(KI_CCOS_ID);

        var elem = w_columns.add(null);
        //'Articulo
        elem.setName(Cairo.Language.getText(1367, ""));
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.PRODUCTOCOMPRA);
        elem.setWidth(3500);
        elem.setKey(KI_PR_ID);

        var w_rows = w_grid.getRows();

        w_rows.clear();
        return true;
      };

      var pLoadCcos = function() {


        for(var _i = 0; _i < m_data.ccos.length; _i += 1) {

          var elem = w_rows.add(null, rs(Cairo.General.Constants.PROV_CCOS_ID).Value);

          var elem = elem.add(null);
          elem.Value = Cairo.Database.valField(m_data.ccos[_i], Cairo.General.Constants.PROV_CCOS_ID);
          elem.setKey(KI_PROVCCOS_ID);

          var elem = elem.add(null);
          elem.Value = Cairo.Database.valField(m_data.ccos[_i], Cairo.General.Constants.CCOS_NAME);
          elem.Id = rs(Cairo.General.Constants.CCOS_ID).Value;
          elem.setKey(KI_CCOS_ID);

          var elem = elem.add(null);
          elem.Value = Cairo.Database.valField(m_data.ccos[_i], Cairo.General.Constants.PR_NOMBRECOMPRA);
          elem.Id = Cairo.Database.valField(m_data.ccos[_i], Cairo.General.Constants.PR_ID);
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
        //'Empresa
        elem.setName(Cairo.Language.getText(1114, ""));
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
          bSelect = rs.RecordCount == 1;
        }

        var w_rows = w_grid.getRows();

        w_rows.clear();
        return true;
      };

      var pLoadEmpresas = function() {


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
            elem.Id = Cairo.Database.valField(m_data.empresas[_i], Cairo.General.Constants.EMP_PROV_ID);
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
        //'Tipo
        elem.setName(Cairo.Language.getText(1223, ""));
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.RETENCIONTIPO);
        elem.setWidth(3500);
        elem.setKey(KI_RETT_ID);

        var elem = w_columns.add(null);
        //'Retención
        elem.setName(Cairo.Language.getText(1403, ""));
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.RETENCION);
        elem.setWidth(3500);
        elem.setKey(KI_RET_ID);

        var elem = w_columns.add(null);
        //'Desde
        elem.setName(Cairo.Language.getText(2532, ""));
        elem.setType(Dialogs.PropertyType.date);
        elem.setWidth(3500);
        elem.setKey(KI_RET_DESDE);

        var elem = w_columns.add(null);
        //'Hasta
        elem.setName(Cairo.Language.getText(2533, ""));
        elem.setType(Dialogs.PropertyType.date);
        elem.setWidth(3500);
        elem.setKey(KI_RET_HASTA);

        var w_rows = w_grid.getRows();

        w_rows.clear();
        return true;
      };

      var pLoadRetencion = function() {


        for(var _i = 0; _i < m_data.retencion.length; _i += 1) {

          var elem = w_rows.add(null, rs(Cairo.General.Constants.PROV_RET_ID).Value);

          var elem = elem.add(null);
          elem.Value = rs(Cairo.General.Constants.PROV_RET_ID).Value;
          elem.setKey(KI_PROVRET_ID);

          var elem = elem.add(null);
          elem.Value = Cairo.Database.valField(m_data.retencion[_i], Cairo.General.Constants.RETT_NAME);
          elem.Id = Cairo.Database.valField(m_data.retencion[_i], Cairo.General.Constants.RETT_ID);
          elem.setKey(KI_RETT_ID);

          var elem = elem.add(null);
          elem.Value = Cairo.Database.valField(m_data.retencion[_i], Cairo.General.Constants.RET_NAME);
          elem.Id = Cairo.Database.valField(m_data.retencion[_i], Cairo.General.Constants.RET_ID);
          elem.setKey(KI_RET_ID);

          var elem = elem.add(null);
          elem.Value = Cairo.Database.valField(m_data.retencion[_i], Cairo.General.Constants.PROV_RET_DESDE);
          elem.setKey(KI_RET_DESDE);

          var elem = elem.add(null);
          elem.Value = Cairo.Database.valField(m_data.retencion[_i], Cairo.General.Constants.PROV_RET_HASTA);
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
        //'Grupo
        elem.setName(Cairo.Language.getText(1404, ""));
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.CUENTAGRUPO);
        elem.setWidth(3500);
        elem.setKey(KI_CUEG_ID);
        elem.setSelectFilter("cueg_tipo in (2,3)");

        var elem = w_columns.add(null, Cairo.General.Constants.CUE_ID);
        //'Cuenta
        elem.setName(Cairo.Language.getText(1267, ""));
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.CUENTA);
        elem.setSelectFilter("("+ Cairo.General.Constants.CUEC_ID+ "="+ csECuentaCategoria.cSECUECACREEDORES.toString()+ " Or "+ Cairo.General.Constants.CUEC_ID+ "="+ csECuentaCategoria.cSECUECDEPOSITOCUPONES.toString()+ " Or "+ Cairo.General.Constants.CUEC_ID+ "="+ csECuentaCategoria.cSECUECBANCOS.toString()+ " Or "+ Cairo.General.Constants.CUEC_ID+ "="+ csECuentaCategoria.cSECUECBIENESDECAMBIO.toString()+ " Or "+ Cairo.General.Constants.CUE_PRODUCTO+ " <> 0)");

        elem.setWidth(3500);
        elem.setKey(KI_CUE_ID);

        var w_rows = w_grid.getRows();

        w_rows.clear();
        return true;
      };

      var pLoadCuentaGrupo = function() {


        for(var _i = 0; _i < m_data.cuentaGrupo.length; _i += 1) {

          var elem = w_rows.add(null, rs(Cairo.General.Constants.PROV_CUEG_ID).Value);

          var elem = elem.add(null);
          elem.Value = rs(Cairo.General.Constants.PROV_CUEG_ID).Value;
          elem.setKey(KI_PROVCUEG_ID);

          var elem = elem.add(null);
          elem.Value = Cairo.Database.valField(m_data.cuentaGrupo[_i], Cairo.General.Constants.CUEG_NAME);
          elem.Id = Cairo.Database.valField(m_data.cuentaGrupo[_i], Cairo.General.Constants.CUEG_ID);
          elem.setKey(KI_CUEG_ID);

          var elem = elem.add(null);
          elem.Value = Cairo.Database.valField(m_data.cuentaGrupo[_i], Cairo.General.Constants.CUE_NAME);
          elem.Id = Cairo.Database.valField(m_data.cuentaGrupo[_i], Cairo.General.Constants.CUE_ID);
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
        //'N° CAI
        elem.setName(Cairo.Language.getText(1406, ""));
        elem.setType(Dialogs.PropertyType.text);
        elem.setWidth(1200);
        elem.setKey(KI_NUMERO);

        var elem = w_columns.add(null);
        //'sucursal
        elem.setName(Cairo.Language.getText(1281, ""));
        elem.setType(Dialogs.PropertyType.text);
        elem.setWidth(1200);
        elem.setKey(KI_SUCURSAL);

        var elem = w_columns.add(null);
        //'Vencimiento
        elem.setName(Cairo.Language.getText(1405, ""));
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

      var pLoadCAIs = function() {


        for(var _i = 0; _i < m_data.cAIs.length; _i += 1) {

          var elem = w_rows.add(null, rs(Cairo.General.Constants.PROVC_ID).Value);

          var elem = elem.add(null);
          elem.Value = rs(Cairo.General.Constants.PROVC_ID).Value;
          elem.setKey(KI_PROVC_ID);

          var elem = elem.add(null);
          elem.Value = Cairo.Database.valField(m_data.cAIs[_i], Cairo.General.Constants.PROVC_NUMERO);
          elem.setKey(KI_NUMERO);

          var elem = elem.add(null);
          elem.Value = Cairo.Database.valField(m_data.cAIs[_i], Cairo.General.Constants.PROVC_SUCURSAL);
          elem.setKey(KI_SUCURSAL);

          var elem = elem.add(null);
          elem.Value = Cairo.Database.valField(m_data.cAIs[_i], Cairo.General.Constants.PROVC_FECHAVTO);
          elem.setKey(KI_FECHAVTO);

          var elem = elem.add(null);
          elem.Value = Cairo.Database.valField(m_data.cAIs[_i], Cairo.General.Constants.PROVC_DESCRIP);
          elem.setKey(KI_DESCRIP);

        }

        return true;
      };

      var pIsEmptyRowDpto = function(row,  rowIndex) {
        var cell = null;

        var bRowIsEmpty = true;

        var _count = row.size();
        for (var _i = 0; _i < _count; _i++) {
          cell = row.item(_i);
          switch (cell.getKey()) {
            case KI_DPTO_ID:
              if(!ValEmpty(cell.getValue(), Cairo.Constants.Types.text)) {
                bRowIsEmpty = false;
                break;
              }
              break;
          }
        }

        return bRowIsEmpty;
      };

      var pIsEmptyRowCcos = function(row,  rowIndex) {
        var cell = null;

        var bRowIsEmpty = true;

        var _count = row.size();
        for (var _i = 0; _i < _count; _i++) {
          cell = row.item(_i);
          switch (cell.getKey()) {
            case KI_PR_ID:
              if(!ValEmpty(cell.getValue(), Cairo.Constants.Types.text)) {
                bRowIsEmpty = false;
                break;
              }
              break;

            case KI_CCOS_ID:
              if(!ValEmpty(cell.getValue(), Cairo.Constants.Types.text)) {
                bRowIsEmpty = false;
                break;
              }
              break;
          }
        }

        return bRowIsEmpty;
      };

      var pIsEmptyRowRetencion = function(row,  rowIndex) {
        var cell = null;

        var bRowIsEmpty = true;

        var _count = row.size();
        for (var _i = 0; _i < _count; _i++) {
          cell = row.item(_i);
          switch (cell.getKey()) {
            case KI_RET_ID:
              if(!ValEmpty(cell.getValue(), Cairo.Constants.Types.text)) {
                bRowIsEmpty = false;
                break;
              }
              break;
          }
        }

        return bRowIsEmpty;
      };

      var pIsEmptyRowCuentaGrupo = function(row,  rowIndex) {
        var cell = null;

        var bRowIsEmpty = true;

        var _count = row.size();
        for (var _i = 0; _i < _count; _i++) {
          cell = row.item(_i);
          switch (cell.getKey()) {
            case KI_CUE_ID:
              if(!ValEmpty(cell.getValue(), Cairo.Constants.Types.text)) {
                bRowIsEmpty = false;
                break;
              }
              break;

            case KI_CUEG_ID:
              if(!ValEmpty(cell.getValue(), Cairo.Constants.Types.text)) {
                bRowIsEmpty = false;
                break;
              }
              break;
          }
        }

        return bRowIsEmpty;
      };

      var pIsEmptyRow = function(row,  rowIndex) {
        var cell = null;
        var strRow = null;

        strRow = " (Fila "+ rowIndex.toString()+ ")";

        var bRowIsEmpty = true;

        var _count = row.size();
        for (var _i = 0; _i < _count; _i++) {
          cell = row.item(_i);
          switch (cell.getKey()) {
            case KI_NUMERO:
              if(!ValEmpty(cell.getValue(), Cairo.Constants.Types.text)) {
                bRowIsEmpty = false;
                break;
              }
              break;

            case KI_FECHAVTO:
              if(!ValEmpty(cell.getValue(), Cairo.Constants.Types.date)) {
                bRowIsEmpty = false;
                break;
              }
              break;
          }
        }

        return bRowIsEmpty;
      };

      var pSaveItemsRetencion = function(mainTransaction) {
        var transaction = new Cairo.Database.Transaction();

        var property = m_dialog.getProperties().item(C_RETENCION);
        var row = null;
        var cell = null;

        var _count = property.getGrid().getRows().size();
        for (var _i = 0; _i < _count; _i++) {
          row = property.getGrid().getRows().item(_i);

          var register = new Cairo.Database.Register();

          var fields = register.getFields();
          register.setFieldId(Cairo.General.Constants.PROV_RET_ID);
          register.setTable(Cairo.General.Constants.PROVEEDORRETENCION);
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
                fields.add(Cairo.General.Constants.RET_ID, cell.getId(), Cairo.Constants.Types.id);

                break;

              case KI_RET_DESDE:
                fields.add(Cairo.General.Constants.PROV_RET_DESDE, cell.getValue(), Cairo.Constants.Types.date);

                break;

              case KI_RET_HASTA:
                fields.add(Cairo.General.Constants.PROV_RET_HASTA, cell.getValue(), Cairo.Constants.Types.date);
                break;
            }
          }

          fields.add(Cairo.General.Constants.PROV_ID, m_id, Cairo.Constants.Types.id);

          transaction.addRegister(register);
        }

        if(LenB(m_itemsDeletedRetenciones) && !m_copy) {
          m_itemsDeletedRetenciones = RemoveLastColon(m_itemsDeletedRetenciones);

          if(!Cairo.Database.execute(sqlstmt, "pSaveItemsRetencion", C_MODULE)) { return false; }
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
          register.setFieldId(Cairo.General.Constants.DPTO_PROV_ID);
          register.setTable(Cairo.General.Constants.DEPARTAMENTOPROVEEDOR);
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
                fields.add(Cairo.General.Constants.DPTO_ID, cell.getId(), Cairo.Constants.Types.id);
                break;
            }
          }

          fields.add(Cairo.General.Constants.PROV_ID, m_id, Cairo.Constants.Types.id);

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
          register.setFieldId(Cairo.General.Constants.PROV_CCOS_ID);
          register.setTable(Cairo.General.Constants.PROVEEDORCENTROCOSTO);
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
                fields.add(Cairo.General.Constants.CCOS_ID, cell.getId(), Cairo.Constants.Types.id);
                break;

              case KI_PR_ID:
                fields.add(Cairo.General.Constants.PR_ID, cell.getId(), Cairo.Constants.Types.id);
                break;
            }
          }

          fields.add(Cairo.General.Constants.PROV_ID, m_id, Cairo.Constants.Types.id);

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

            register.setFieldId(Cairo.General.Constants.EMP_PROV_ID);
            register.setTable(Cairo.General.Constants.EMPRESAPROVEEDOR);
            register.setId(Cairo.Constants.NEW_ID);

            register.getFields().add2(Cairo.Constants.EMP_ID, Dialogs.cell(row, KI_EMP_ID).getID(), Cairo.Constants.Types.id);

            register.getFields().add2(Cairo.General.Constants.PROV_ID, m_id, Cairo.Constants.Types.id);

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
          register.setFieldId(Cairo.General.Constants.PROV_CUEG_ID);
          register.setTable(Cairo.General.Constants.PROVEEDORCUENTAGRUPO);
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
                register.getFields().add2(Cairo.General.Constants.CUEG_ID, cell.getId(), Cairo.Constants.Types.id);
                break;

              case KI_CUE_ID:
                fields.add(Cairo.General.Constants.CUE_ID, cell.getId(), Cairo.Constants.Types.id);
                break;
            }
          }

          fields.add(Cairo.General.Constants.PROV_ID, m_id, Cairo.Constants.Types.id);

          transaction.addRegister(register);
        }

        if(LenB(m_itemsDeletedCuentaGrupo) && !m_copy) {
          m_itemsDeletedCuentaGrupo = RemoveLastColon(m_itemsDeletedCuentaGrupo);

          if(!Cairo.Database.execute(sqlstmt, "pSaveItemsCuentaGrupo", C_MODULE)) { return false; }
        }

        mainTransaction.addTransaction(transaction);

        return true;
      };

      var pValidateCuitProveedor = function(cuit) {
        var _rtn = null;
        try {

          var sqlstmt = null;
          var rs = null;

          if(LenB(cuit)) {

            if(!Object.validateNroCuit(cuit, false)) { return _rtn; }

            sqlstmt = "sp_ProveedorValidateCuit "+ Cairo.Database.sqlString(cuit);

            if(!Cairo.Database.openRs(sqlstmt, rs)) { return _rtn; }

            if(!rs.isEOF()) {

              if(m_id != Cairo.Database.valField(rs.getFields(), Cairo.General.Constants.PROV_ID)) {
                MsgWarning(Cairo.Language.getText(1452, "", Cairo.Database.valField(rs.getFields(), Cairo.General.Constants.PROV_RAZONSOCIAL)), Cairo.Language.getText(1453, ""));
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
          Cairo.manageErrorEx(ex.message, "pValidateCuitProveedor", C_MODULE, "");
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
        //' Error al grabar el proveedor
        c_ErrorSave = Cairo.Language.getText(1377, "");
      };

      self.destroy = function() {
        m_dialog = null;
        m_listController = null;
      };

      //---------------------------------------------------------------------------
      // Validar CBU
      //
      self.chrTran = function(source,  toSearch,  value) {
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

        if(lcCBU.Length == 22) {

          lcBloque1 = lcCBU.Substring(1, 8);
          lcBloque2 = lcCBU.Substring(9, 14);

          if(!(pValidarDigito(lcBloque1) && pValidarDigito(lcBloque2))) {

            //' El CBU ingresado no es valido
            MsgWarning(Cairo.Language.getText(4712, ""));
            return null;
          }

        }
        else {

          //'Largo de CBU incorrecto
          MsgWarning(Cairo.Language.getText(4713, ""));
          return null;

        }

        return true;

      };

      var pValidarDigito = function(tcBloque) {

        Const(Pond == "9713");

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

        return lcDigito == Str(10 - lnSuma Mod 10).Substring(Str(10 - lnSuma Mod 10).Length - 1);
      };


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