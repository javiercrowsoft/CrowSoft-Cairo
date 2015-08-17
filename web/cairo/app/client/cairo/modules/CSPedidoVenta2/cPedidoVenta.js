(function() {
  "use strict";

  Cairo.module("Xxxx.Edit", function(Edit, Cairo, Backbone, Marionette, $, _) {

  });

  Cairo.module("XxxxListDoc.Edit", function(Edit, Cairo, Backbone, Marionette, $, _) {

    var createObject = function() {

      var self = {};

      var Dialogs = Cairo.Dialogs;

      // cPedidoVtaListDoc
      // 03-01-04

      var C_MODULE = "cPedidoVtaListDoc";

      var C_VM_ID = 0;
      var C_VM_MENU_ID = 1;
      var C_VM_IS_CONTADO = 2;
      var C_VM_CUE_ID = 3;

      var C_FECHAINI = "FechaIni";
      var C_FECHAFIN = "FechaFin";

      var C_IMG_TASK = 1;

      // ACA VAN LAS K GENERADAS POR EL ASISTENTE.
      var K_FECHAINI = 1;
      var K_FECHAFIN = 2;
      var K_CLI_ID = 4;
      var K_EST_ID = 5;
      var K_CCOS_ID = 6;
      var K_SUC_ID = 7;
      var K_VEN_ID = 8;
      var K_DOC_ID = 9;
      var K_CPG_ID = 10;
      // empid
      var K_EMP_ID = 100;
      var m_fechaIni = null;
      var m_fechaFin = null;
      var m_cli_id = "";
      var m_cliente = "";
      var m_est_id = "";
      var m_estado = "";
      var m_ccos_id = "";
      var m_centroCosto = "";
      var m_suc_id = "";
      var m_sucursal = "";
      var m_ven_id = "";
      var m_vendedor = "";
      var m_doc_id = "";
      var m_documento = "";
      var m_cpg_id = "";
      var m_condicionPago = "";
      // empid
      var m_emp_id = "";
      var m_empresa = "";
      var m_fechaIniV = "";
      var m_fechaFinV = "";

      // ACA VAN LAS m_ GENERADAS POR EL ASISTENTE.

      //OJO HASTA ACA

      var m_dialog;
      var m_objList = null;
      var m_us_id = 0;
      var m_properties;

      var m_title = "";

      var m_menuLoaded;

      var m_menuShowRemito = 0;
      var m_menuShowPacking = 0;
      var m_menuShowFactura = 0;

      var m_menuShowMensajes = 0;
      var m_menuShowInfoCli = 0;
      var m_menuAddMensaje = 0;
      var m_menuShowAplic = 0;
      var m_menuFirmar = 0;
      var m_menuShowFacturaAuto = 0;
      var m_menuEditCliente = 0;

      var m_vMenuModoPago = 0;

      var m_objApply;

      // Properties publicas
      self.getEnabledSearchParam = function() {
        return true;
      };

      self.getSearchParamTable = function() {
        return Cairo.Tables.CLIENTE;
      };

      self.getBackgroundColor = function() {
        return RGB(&HFF, &HAA, &H0);
      };

      // Properties privadas
      self.setSearchParam = function(id,  name) {
        // **TODO:** on error resume next found !!!
        var property = m_dialog.getProperties().item(mPedidoConstantes.CLI_ID);
        property.setValue(name);
        property.setSelectId(id);
        property.setHelpValueProcess(id);
        var abmGen = null;
        abmGen = m_dialog;
        abmGen.ShowValue(m_dialog.getProperties().item(mPedidoConstantes.CLI_ID));
      };

      self.processMenu = function(index) {
        try {

          switch (index) {

            case m_menuShowFactura:
              pShowFactura(false, false, Cairo.Constants.NO_ID, false);

              break;

            case m_menuShowFacturaAuto:
              pShowFactura(true, false, Cairo.Constants.NO_ID, false);

              break;

            case m_menuShowPacking:
              pShowPacking();

              break;

            case m_menuShowRemito:
              pShowRemito();

              break;

            case m_menuShowInfoCli:
              HelpShowInfo(Cairo.Tables.CLIENTE, pGetCliId());

              break;

            case m_menuShowMensajes:
              pShowMensajes();

              break;

            case m_menuAddMensaje:
              pAddMensaje();

              break;

            case m_menuShowAplic:
              pShowApply();

              break;

            case m_menuFirmar:
              pFirmar();

              break;

            case m_menuEditCliente:
              pEditCliente();

              break;

            default:
              pProcessModoPago(index);

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

      // funciones privadas

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
        if(m_fechaIniV != "") {
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
        if(m_fechaFinV != "") {
          c.setValue(m_fechaFinV);
        }
        else {
          c.setValue(m_fechaFin);
        }

        c = m_dialog.getProperties().add(null, mPedidoConstantes.CLI_ID);
        c.setType(Dialogs.PropertyType.select);
        c.setTable(Cairo.Tables.CLIENTE);
        //'Cliente
        c.setName(Cairo.Language.getText(1150, ""));
        c.setKey(K_CLI_ID);
        value = m_cliente;
        if(m_cli_id.Substring(0, 1).toUpperCase() == KEY_NODO) {
          value = GetNombreRama(Cairo.Tables.CLIENTE, Cairo.Util.val(m_cli_id.Substring(2)), bExists);
          if(!bExists) { m_cli_id = "0"; }
        }
        c.setValue(value);
        c.setSelectId(Cairo.Util.val(m_cli_id));
        c.setHelpValueProcess(m_cli_id);

        c = m_dialog.getProperties().add(null, Cairo.Constants.EST_ID);
        c.setType(Dialogs.PropertyType.select);
        c.setTable(csEstado);
        //'Estado
        c.setName(Cairo.Language.getText(1568, ""));
        c.setKey(K_EST_ID);
        value = m_estado;
        if(m_est_id.Substring(0, 1).toUpperCase() == KEY_NODO) {
          value = GetNombreRama(csEstado, Cairo.Util.val(m_est_id.Substring(2)), bExists);
          if(!bExists) { m_est_id = "0"; }
        }
        c.setValue(value);
        c.setSelectId(Cairo.Util.val(m_est_id));
        c.setHelpValueProcess(m_est_id);

        c = m_dialog.getProperties().add(null, mPedidoConstantes.CCOS_ID);
        c.setType(Dialogs.PropertyType.select);
        c.setTable(Cairo.Tables.CENTROCOSTO);
        //'Centro de Costos
        c.setName(Cairo.Language.getText(1057, ""));
        c.setKey(K_CCOS_ID);
        value = m_centroCosto;
        if(m_ccos_id.Substring(0, 1).toUpperCase() == KEY_NODO) {
          value = GetNombreRama(Cairo.Tables.CENTROCOSTO, Cairo.Util.val(m_ccos_id.Substring(2)), bExists);
          if(!bExists) { m_ccos_id = "0"; }
        }
        c.setValue(value);
        c.setSelectId(Cairo.Util.val(m_ccos_id));
        c.setHelpValueProcess(m_ccos_id);

        c = m_dialog.getProperties().add(null, mPedidoConstantes.SUC_ID);
        c.setType(Dialogs.PropertyType.select);
        c.setTable(Cairo.Tables.SUCURSAL);
        //'Sucursal
        c.setName(Cairo.Language.getText(1281, ""));
        c.setKey(K_SUC_ID);
        value = m_sucursal;
        if(m_suc_id.Substring(0, 1).toUpperCase() == KEY_NODO) {
          value = GetNombreRama(Cairo.Tables.SUCURSAL, Cairo.Util.val(m_suc_id.Substring(2)), bExists);
          if(!bExists) { m_suc_id = "0"; }
        }
        c.setValue(value);
        c.setSelectId(Cairo.Util.val(m_suc_id));
        c.setHelpValueProcess(m_suc_id);

        c = m_dialog.getProperties().add(null, mPedidoConstantes.VEN_ID);
        c.setType(Dialogs.PropertyType.select);
        c.setTable(Cairo.Tables.VENDEDORES);
        //'Vendedores
        c.setName(Cairo.Language.getText(1502, ""));
        c.setKey(K_VEN_ID);
        value = m_vendedor;
        if(m_ven_id.Substring(0, 1).toUpperCase() == KEY_NODO) {
          value = GetNombreRama(Cairo.Tables.VENDEDORES, Cairo.Util.val(m_ven_id.Substring(2)), bExists);
          if(!bExists) { m_ven_id = "0"; }
        }
        c.setValue(value);
        c.setSelectId(Cairo.Util.val(m_ven_id));
        c.setHelpValueProcess(m_ven_id);

        c = m_dialog.getProperties().add(null, mPedidoConstantes.DOC_ID);
        c.setType(Dialogs.PropertyType.select);
        c.setTable(csETablasDocumento.CSDocumento);
        //'Documentos
        c.setName(Cairo.Language.getText(1611, ""));
        c.setKey(K_DOC_ID);
        value = m_documento;
        if(m_doc_id.Substring(0, 1).toUpperCase() == KEY_NODO) {
          value = GetNombreRama(csETablasDocumento.CSDocumento, Cairo.Util.val(m_doc_id.Substring(2)), bExists);
          if(!bExists) { m_doc_id = "0"; }
        }
        c.setValue(value);
        c.setSelectId(Cairo.Util.val(m_doc_id));
        c.setHelpValueProcess(m_doc_id);
        c.setSelectFilter(pGetDocFilter());

        c = m_dialog.getProperties().add(null, mPedidoConstantes.CPG_ID);
        c.setType(Dialogs.PropertyType.select);
        c.setTable(Cairo.Tables.CONDICIONPAGO);
        //'Condicion de pago
        c.setName(Cairo.Language.getText(1395, ""));
        c.setKey(K_CPG_ID);
        value = m_condicionPago;
        if(m_cpg_id.Substring(0, 1).toUpperCase() == KEY_NODO) {
          value = GetNombreRama(Cairo.Tables.CONDICIONPAGO, Cairo.Util.val(m_cpg_id.Substring(2)), bExists);
          if(!bExists) { m_cpg_id = "0"; }
        }
        c.setValue(value);
        c.setSelectId(Cairo.Util.val(m_cpg_id));
        c.setHelpValueProcess(m_cpg_id);

        // empid
        c = m_dialog.getProperties().add(null, Cairo.Constants.EMP_ID);
        c.setType(Dialogs.PropertyType.select);
        c.setTable(Cairo.Tables.EMPRESA);
        //'Empresa
        c.setName(Cairo.Language.getText(1114, ""));
        c.setKey(K_EMP_ID);
        value = m_empresa;
        if(m_emp_id.Substring(0, 1).toUpperCase() == KEY_NODO) {
          value = GetNombreRama(Cairo.Tables.EMPRESA, Cairo.Util.val(m_emp_id.Substring(2)), bExists);
          if(!bExists) { m_emp_id = "0"; }
        }
        c.setValue(value);
        c.setSelectId(Cairo.Util.val(m_emp_id));
        c.setHelpValueProcess(m_emp_id);

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
        return Cairo.Database.getData("load[" + apiPath + "general/pedidoventalistdoc]", id).then(
          function(response) {

            // empid
            m_emp_id = cUtil.getEmpId();
            m_empresa = cUtil.getEmpNombre();

            if(response.success !== true) { return false; }

            if(response.data.id === Cairo.Constants.NO_ID) {

              m_fechaIni = Date;
              m_fechaFin = Date;
              m_cli_id = Cairo.Constants.NO_ID;
              m_cliente = "";
              m_est_id = Cairo.Constants.NO_ID;
              m_estado = "";
              m_ccos_id = Cairo.Constants.NO_ID;
              m_centroCosto = "";
              m_suc_id = Cairo.Constants.NO_ID;
              m_sucursal = "";
              m_ven_id = Cairo.Constants.NO_ID;
              m_vendedor = "";
              m_doc_id = Cairo.Constants.NO_ID;
              m_documento = "";
              m_cpg_id = Cairo.Constants.NO_ID;
              m_condicionPago = "";

            }
            else {

              rs.MoveLast;
              rs.MoveFirst;

              var i = null;
              while (!rs.isEOF()) {

                switch (Cairo.Database.valField(response.data, Cairo.Constants.LDP_ID)) {

                  case K_FECHAINI:
                    m_fechaIniV = Cairo.Database.valField(response.data, Cairo.Constants.LDP_VALOR);
                    m_fechaIni = IsDate(Cairo.Database.valField(response.data, Cairo.Constants.LDP_VALOR)) ? Cairo.Database.valField(response.data, Cairo.Constants.LDP_VALOR) : Date);

                    break;

                  case K_FECHAFIN:
                    m_fechaFinV = Cairo.Database.valField(response.data, Cairo.Constants.LDP_VALOR);
                    m_fechaFin = IsDate(Cairo.Database.valField(response.data, Cairo.Constants.LDP_VALOR)) ? Cairo.Database.valField(response.data, Cairo.Constants.LDP_VALOR) : Date);

                    break;

                  case K_CLI_ID:
                    m_cli_id = Cairo.Database.valField(response.data, Cairo.Constants.LDP_VALOR);

                    break;

                  case K_EST_ID:
                    m_est_id = Cairo.Database.valField(response.data, Cairo.Constants.LDP_VALOR);

                    break;

                  case K_CCOS_ID:
                    m_ccos_id = Cairo.Database.valField(response.data, Cairo.Constants.LDP_VALOR);

                    break;

                  case K_SUC_ID:
                    m_suc_id = Cairo.Database.valField(response.data, Cairo.Constants.LDP_VALOR);

                    break;

                  case K_VEN_ID:
                    m_ven_id = Cairo.Database.valField(response.data, Cairo.Constants.LDP_VALOR);

                    break;

                  case K_DOC_ID:
                    m_doc_id = Cairo.Database.valField(response.data, Cairo.Constants.LDP_VALOR);

                    break;

                  case K_CPG_ID:
                    m_cpg_id = Cairo.Database.valField(response.data, Cairo.Constants.LDP_VALOR);

                    // empid
                    break;

                  case K_EMP_ID:
                    m_emp_id = Cairo.Database.valField(response.data, Cairo.Constants.LDP_VALOR);

                    break;
                }

                rs.MoveNext;
              }

              var data = null;
              var strLoad = null;

              strLoad = "Error al carga los párametros de navegación de Pedidos de Venta";

              m_fechaIni = (m_fechaIni != Cairo.Constants.cSNODATE) ? m_fechaIni : Date);
              m_fechaFin = (m_fechaFin != Cairo.Constants.cSNODATE) ? m_fechaFin : Date);

              // OJO: EL ASISTENTE ESTO LO HACE MAL, YA QUE EL CODIGO QUE GENERA NO SOPORTA ARBOLES
              //      USEN ESTE CODIGO COMO EJ. OJO!!! CAMBIEN LOS NOMBRES DE LAS TABLAS Y LOS CAMPOS NOMBRES DE DICHAS TABLAS.
              if(m_cli_id.Substring(0, 1).toUpperCase() != KEY_NODO) {
                if(!Cairo.Database.getData(mPedidoConstantes.CLIENTE, mPedidoConstantes.CLI_ID, Cairo.Util.val(m_cli_id), mPedidoConstantes.CLI_NAME, data, C_LoadFunction, C_MODULE, strLoad)) { return false; }
                m_cliente = data;
              }
              if(m_est_id.Substring(0, 1).toUpperCase() != KEY_NODO) {
                if(!Cairo.Database.getData(Cairo.Constants.ESTADO, Cairo.Constants.EST_ID, Cairo.Util.val(m_est_id), Cairo.Constants.EST_NAME, data, C_LoadFunction, C_MODULE, strLoad)) { return false; }
                m_estado = data;
              }
              if(m_ccos_id.Substring(0, 1).toUpperCase() != KEY_NODO) {
                if(!Cairo.Database.getData(mPedidoConstantes.CENTROCOSTO, mPedidoConstantes.CCOS_ID, Cairo.Util.val(m_ccos_id), mPedidoConstantes.CCOS_NAME, data, C_LoadFunction, C_MODULE, strLoad)) { return false; }
                m_centroCosto = data;
              }
              if(m_suc_id.Substring(0, 1).toUpperCase() != KEY_NODO) {
                if(!Cairo.Database.getData(mPedidoConstantes.SUCURSAL, mPedidoConstantes.SUC_ID, Cairo.Util.val(m_suc_id), mPedidoConstantes.SUC_NAME, data, C_LoadFunction, C_MODULE, strLoad)) { return false; }
                m_sucursal = data;
              }
              if(m_ven_id.Substring(0, 1).toUpperCase() != KEY_NODO) {
                if(!Cairo.Database.getData(mPedidoConstantes.VENDEDOR, mPedidoConstantes.VEN_ID, Cairo.Util.val(m_ven_id), mPedidoConstantes.VEN_NAME, data, C_LoadFunction, C_MODULE, strLoad)) { return false; }
                m_vendedor = data;
              }
              if(m_doc_id.Substring(0, 1).toUpperCase() != KEY_NODO) {
                if(!Cairo.Database.getData(mPedidoConstantes.DOCUMENTO, mPedidoConstantes.DOC_ID, Cairo.Util.val(m_doc_id), mPedidoConstantes.DOC_NAME, data, C_LoadFunction, C_MODULE, strLoad)) { return false; }
                m_documento = data;
              }
              if(m_cpg_id.Substring(0, 1).toUpperCase() != KEY_NODO) {
                if(!Cairo.Database.getData(mPedidoConstantes.CONDICIONPAGO, mPedidoConstantes.CPG_ID, Cairo.Util.val(m_cpg_id), mPedidoConstantes.CPG_NAME, data, C_LoadFunction, C_MODULE, strLoad)) { return false; }
                m_condicionPago = data;
              }
              // empid
              if(m_emp_id.Substring(0, 1).toUpperCase() != KEY_NODO) {
                if(!Cairo.Database.getData(Cairo.Constants.EMPRESA, Cairo.Constants.EMP_ID, Cairo.Util.val(m_emp_id), Cairo.Constants.EMP_NAME, data, C_LoadFunction, C_MODULE, strLoad)) { return false; }
                m_empresa = data;
              }

            }

            return true;
          });
      };

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

      // OJO: NUEVAMENTE LA EXISTENCIA DE FECHAS VIRTUALES HACE QUE EL CODIGO GENERADO POR EL ASISTENTE ESTE MAL
      //      CORRIJALO UTILIZANDO ESTE CODIGO COMO EJEMPLO.
      var cIABMListDocClient_PropertyChange = function(key) {
        var iProp = null;

        switch (key) {

          case K_FECHAINI:

            iProp = m_dialog.getProperties().item(C_FECHAINI);

            if(LenB(iProp.getSelectIntValue())) {
              m_fechaIniV = iProp.getSelectIntValue();
              m_fechaIni = VDGetDateByName(m_fechaIniV);
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
              m_fechaFin = VDGetDateByName(m_fechaFinV);
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

          case K_EST_ID:
            var property = m_dialog.getProperties().item(Cairo.Constants.EST_ID);
            m_estado = property.getValue();
            m_est_id = property.getSelectIntValue();

            break;

          case K_CLI_ID:
            var property = m_dialog.getProperties().item(mPedidoConstantes.CLI_ID);
            m_cliente = property.getValue();
            m_cli_id = property.getSelectIntValue();

            break;

          case K_CCOS_ID:
            var property = m_dialog.getProperties().item(mPedidoConstantes.CCOS_ID);
            m_centroCosto = property.getValue();
            m_ccos_id = property.getSelectIntValue();

            break;

          case K_SUC_ID:
            var property = m_dialog.getProperties().item(mPedidoConstantes.SUC_ID);
            m_sucursal = property.getValue();
            m_suc_id = property.getSelectIntValue();

            break;

          case K_VEN_ID:
            var property = m_dialog.getProperties().item(mPedidoConstantes.VEN_ID);
            m_vendedor = property.getValue();
            m_ven_id = property.getSelectIntValue();

            break;

          case K_DOC_ID:
            var property = m_dialog.getProperties().item(mPedidoConstantes.DOC_ID);
            m_documento = property.getValue();
            m_doc_id = property.getSelectIntValue();

            break;

          case K_CPG_ID:
            var property = m_dialog.getProperties().item(mPedidoConstantes.CPG_ID);
            m_condicionPago = property.getValue();
            m_cpg_id = property.getSelectIntValue();

            // empid
            break;

          case K_EMP_ID:
            var property = m_dialog.getProperties().item(Cairo.Constants.EMP_ID);
            m_empresa = property.getValue();
            m_emp_id = property.getSelectIntValue();
            break;
        }

        return true;
      };

      var cIABMListDocClient_Refresh = function() {
        var sqlstmt = null;

        sqlstmt = "sp_lsdoc_PedidosVenta ";

        sqlstmt = sqlstmt+ Cairo.Database.getUserId().toString()+ ",";

        if(!cDate.getDateNames(m_fechaIniV) == null) {
          sqlstmt = sqlstmt+ Cairo.Database.sqlDate(VDGetDateByName(m_fechaIniV))+ ",";
        }
        else {
          sqlstmt = sqlstmt+ Cairo.Database.sqlDate(m_fechaIni)+ ",";
        }

        if(!cDate.getDateNames(m_fechaFinV) == null) {
          sqlstmt = sqlstmt+ Cairo.Database.sqlDate(VDGetDateByName(m_fechaFinV))+ ",";
        }
        else {
          sqlstmt = sqlstmt+ Cairo.Database.sqlDate(m_fechaFin)+ ",";
        }

        sqlstmt = sqlstmt+ Cairo.Database.sqlString(m_cli_id)+ ",";
        sqlstmt = sqlstmt+ Cairo.Database.sqlString(m_est_id)+ ",";
        sqlstmt = sqlstmt+ Cairo.Database.sqlString(m_ccos_id)+ ",";
        sqlstmt = sqlstmt+ Cairo.Database.sqlString(m_suc_id)+ ",";
        sqlstmt = sqlstmt+ Cairo.Database.sqlString(m_ven_id)+ ",";
        sqlstmt = sqlstmt+ Cairo.Database.sqlString(m_doc_id)+ ",";
        sqlstmt = sqlstmt+ Cairo.Database.sqlString(m_cpg_id)+ ",";
        sqlstmt = sqlstmt+ Cairo.Database.sqlString(m_emp_id);

        return sqlstmt;
      };

      var cIABMListDocClient_Save = function() {

        var strError = null;

        strError = "Error al grabar los párametros de navegación de Pedidos de Venta";

        var register = null;
        register = new cRegister();

        var sqlstmt = null;

        sqlstmt = "delete ListaDocumentoParametro  where pre_id = "+ csPedidoVtaPrestacion.cSPREPVLISTPEDIDOVTA.toString()+ " and us_id = "+ m_us_id+ " and (emp_id is null or emp_id = "+ cUtil.getEmpId().toString()+ ")";

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
              if(LenB(property.getSelectIntValue())) {
                register.getFields().add2(Cairo.Constants.LDP_VALOR, property.getSelectIntValue(), Cairo.Constants.Types.text);
              }
              else {
                register.getFields().add2(Cairo.Constants.LDP_VALOR, property.getValue(), Cairo.Constants.Types.text);
              }

              register.getFields().add2(Cairo.Constants.LDP_ORDEN, 10, Cairo.Constants.Types.integer);
              register.getFields().add2(Cairo.Constants.LDP_ID, K_FECHAINI, Cairo.Constants.Types.integer);

              break;

            case K_FECHAFIN:
              if(LenB(property.getSelectIntValue())) {
                register.getFields().add2(Cairo.Constants.LDP_VALOR, property.getSelectIntValue(), Cairo.Constants.Types.text);
              }
              else {
                register.getFields().add2(Cairo.Constants.LDP_VALOR, property.getValue(), Cairo.Constants.Types.text);
              }

              register.getFields().add2(Cairo.Constants.LDP_ORDEN, 20, Cairo.Constants.Types.integer);
              register.getFields().add2(Cairo.Constants.LDP_ID, K_FECHAFIN, Cairo.Constants.Types.integer);

              break;

            case K_CLI_ID:
              register.getFields().add2(Cairo.Constants.LDP_VALOR, property.getSelectIntValue(), Cairo.Constants.Types.text);
              register.getFields().add2(Cairo.Constants.LDP_ORDEN, 40, Cairo.Constants.Types.integer);
              register.getFields().add2(Cairo.Constants.LDP_ID, K_CLI_ID, Cairo.Constants.Types.integer);
              break;

            case K_EST_ID:
              register.getFields().add2(Cairo.Constants.LDP_VALOR, property.getSelectIntValue(), Cairo.Constants.Types.text);
              register.getFields().add2(Cairo.Constants.LDP_ORDEN, 50, Cairo.Constants.Types.integer);
              register.getFields().add2(Cairo.Constants.LDP_ID, K_EST_ID, Cairo.Constants.Types.integer);
              break;

            case K_CCOS_ID:
              register.getFields().add2(Cairo.Constants.LDP_VALOR, property.getSelectIntValue(), Cairo.Constants.Types.text);
              register.getFields().add2(Cairo.Constants.LDP_ORDEN, 60, Cairo.Constants.Types.integer);
              register.getFields().add2(Cairo.Constants.LDP_ID, K_CCOS_ID, Cairo.Constants.Types.integer);
              break;

            case K_SUC_ID:
              register.getFields().add2(Cairo.Constants.LDP_VALOR, property.getSelectIntValue(), Cairo.Constants.Types.text);
              register.getFields().add2(Cairo.Constants.LDP_ORDEN, 70, Cairo.Constants.Types.integer);
              register.getFields().add2(Cairo.Constants.LDP_ID, K_SUC_ID, Cairo.Constants.Types.integer);
              break;

            case K_VEN_ID:
              register.getFields().add2(Cairo.Constants.LDP_VALOR, property.getSelectIntValue(), Cairo.Constants.Types.text);
              register.getFields().add2(Cairo.Constants.LDP_ORDEN, 80, Cairo.Constants.Types.integer);
              register.getFields().add2(Cairo.Constants.LDP_ID, K_VEN_ID, Cairo.Constants.Types.integer);
              break;

            case K_DOC_ID:
              register.getFields().add2(Cairo.Constants.LDP_VALOR, property.getSelectIntValue(), Cairo.Constants.Types.text);
              register.getFields().add2(Cairo.Constants.LDP_ORDEN, 90, Cairo.Constants.Types.integer);
              register.getFields().add2(Cairo.Constants.LDP_ID, K_DOC_ID, Cairo.Constants.Types.integer);
              break;

            case K_CPG_ID:
              register.getFields().add2(Cairo.Constants.LDP_VALOR, property.getSelectIntValue(), Cairo.Constants.Types.text);
              register.getFields().add2(Cairo.Constants.LDP_ORDEN, 100, Cairo.Constants.Types.integer);
              register.getFields().add2(Cairo.Constants.LDP_ID, K_CPG_ID, Cairo.Constants.Types.integer);

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
          register.getFields().add2(Cairo.Constants.PRE_ID, csPedidoVtaPrestacion.cSPREPVLISTPEDIDOVTA, Cairo.Constants.Types.id);

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

      var getCIABMListDocClient_Title = function() {
        return m_title;
      };

      var cIABMListDocClient_Validate = function() {
        return true;
      };

      var cIEditGenericListDoc_GridAdd = function(keyProperty) {

      };

      var cIEditGenericListDoc_GridEdit = function(keyProperty) {

      };

      var cIEditGenericListDoc_GridRemove = function(keyProperty) {

      };

      var setCIEditGenericListDoc_ObjABM = function(rhs) {
        m_dialog = rhs;
      };

      var setCIEditGenericListDoc_ObjList = function(rhs) {
        m_objList = rhs;
      };

      var cIEditGenericListDoc_PropertyChange = function(key) {

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

      var cIEditGenericListDoc_TabClick = function(index) {

      };

      var pGetDocFilter = function() {
        return "'{emp_id=0}doct_id = "+ csEDocumentoTipo.cSEDT_PEDIDOVENTA.toString()+ " or doct_id = "+ csEDocumentoTipo.cSEDT_DEVOLUCIONPEDIDOVTA.toString()+ "'";
      };

      var pCreateMenu = function() {
        // **TODO:** on error resume next found !!!

        if(m_menuLoaded) { return; }

        m_menuLoaded = true;

        m_objList.ObjClientMenu = self;
        m_objList.ClearMenu;
        //'Editar Cliente
        m_menuEditCliente = m_objList.AddMenu(Cairo.Language.getText(5038, ""));

        pAddMenuModoPago();

        //'Remitir
        m_menuShowRemito = m_objList.AddMenu(Cairo.Language.getText(1612, ""));
        //'Packing List
        m_menuShowPacking = m_objList.AddMenu(Cairo.Language.getText(1602, ""));
        //'Facturar
        m_menuShowFactura = m_objList.AddMenu(Cairo.Language.getText(1613, ""));
        //'Facturar Automático
        m_menuShowFacturaAuto = m_objList.AddMenu(Cairo.Language.getText(5039, ""));
        m_objList.AddMenu("-");
        //'Firmar
        m_menuFirmar = m_objList.AddMenu(Cairo.Language.getText(1594, ""));
        m_objList.AddMenu("-");
        //'Ver Info del Cliente
        m_menuShowInfoCli = m_objList.AddMenu(Cairo.Language.getText(1614, ""));
        //'Agregar Nota
        m_menuAddMensaje = m_objList.AddMenu(Cairo.Language.getText(1615, ""));
        //'Ver Notas
        m_menuShowMensajes = m_objList.AddMenu(Cairo.Language.getText(1616, ""));
        m_objList.AddMenu("-");
        //'Ver Aplicaciones
        m_menuShowAplic = m_objList.AddMenu(Cairo.Language.getText(1617, ""));
      };

      // Presenta opciones de menu que generan una
      // factura automatica desde uno o mas pedidos
      // sin preguntar por los medios de pago
      // ya que la cuenta esta definida en
      // el modo de venta
      //
      var pAddMenuModoPago = function() {
        var i = null;
        var sqlstmt = null;
        var rs = null;

        G.redimPreserve(m_vMenuModoPago, 3, 0);

        sqlstmt = "select * from VentaModo where vm_pv <> 0 order by vm_codigo";
        if(!Cairo.Database.openRs(sqlstmt, rs)) { return; }

        if(rs.isEOF()) { return; }

        m_objList.AddMenu("-");
        m_objList.AddMenu("-");

        while (!rs.isEOF()) {

          G.redimPreserve(m_vMenuModoPago, 3, (m_vMenuModoPago, 1).Length + 1);
          i = i + 1;
          m_vMenuModoPago[C_VM_ID, i] == Cairo.Database.valField(rs.getFields(), "vm_id");
          m_vMenuModoPago[C_VM_MENU_ID, i] == m_objList.AddMenu(Cairo.Database.valField(rs.getFields(), "vm_nombre"));
          m_vMenuModoPago[C_VM_IS_CONTADO, i] == Cairo.Database.valField(rs.getFields(), "vm_ctacte") != csE_VentaModoCtaCte.cSVM_CTACTEHOJARUTA;
          m_vMenuModoPago[C_VM_CUE_ID, i] == Cairo.Database.valField(rs.getFields(), "cue_id");

          m_objList.AddMenu("-");
          m_objList.AddMenu("-");

          rs.MoveNext;
        }
      };

      var pProcessModoPago = function(idMenu) {
        var i = null;
        for (i = 1; i <= (m_vMenuModoPago, 2).Length; i++) {
          if(m_vMenuModoPago[C_VM_MENU_ID, i] == idMenu) {

            if(m_vMenuModoPago[C_VM_IS_CONTADO, i]) {
              pShowFactura(true, true, m_vMenuModoPago[C_VM_CUE_ID, i], false);
            }
            else {
              pShowFactura(true, false, Cairo.Constants.NO_ID, true);
            }
          }
        }
      };

      var pShowMensajes = function() {
        var sqlstmt = null;
        var pvId = null;
        var rs = null;

        pvId = m_objList.Id;

        sqlstmt = "sp_ParteDiarioGetTitleForDoc "+ csEDocumentoTipo.cSEDT_PEDIDOVENTA.toString()+ ","+ pvId.toString();

        if(!Cairo.Database.openRs(sqlstmt, rs)) { return; }

        if(rs.isEOF()) { return; }

        var infodoc = null;
        var doctId = null;

        doctId = Cairo.Database.valField(rs.getFields(), mPedidoConstantes.DOCT_ID);
        infodoc = Cairo.Database.valField(rs.getFields(), "info_doc");

        sqlstmt = "sp_PartesDiarioGetForDoc "+ Cairo.Database.getUserId().toString()+ ","+ cUtil.getEmpId().toString()+ ","+ doctId.toString()+ ","+ pvId.toString();
        ShowNotes("Notas sobre Pedidos de Venta "+ infodoc, sqlstmt);
      };

      var pAddMensaje = function() {
        var parte = null;
        parte = CSKernelClient2.CreateObject("CSEnvio2.cParteDiario");

        parte.AddParteToDoc(csEDocumentoTipo.cSEDT_PEDIDOVENTA, m_objList.Id, false);
      };

      var pEditCliente = function() {
        var cli_id = null;
        cli_id = pGetCliId();
        if(cli_id == Cairo.Constants.NO_ID) { return; }
        var abmObj = null;
        var o = null;
        abmObj = new CSABMInterface2.cABMGeneric();
        o = CSKernelClient2.CreateObject("CSGeneral2.cCliente");
        o.setObjABM(abmObj);
        o.edit(cli_id, true);
      };

      var pFirmar = function() {

        var pvId = null;
        pvId = m_objList.Id;

        if(pvId == Cairo.Constants.NO_ID) { return; }

        var firmado = null;
        var docId = null;

        if(!Cairo.Database.getData(mPedidoConstantes.PEDIDOVENTA, mPedidoConstantes.PV_ID, pvId, mPedidoConstantes.PV_FIRMADO, firmado)) { return; }
        if(!Cairo.Database.getData(mPedidoConstantes.PEDIDOVENTA, mPedidoConstantes.PV_ID, pvId, mPedidoConstantes.DOC_ID, docId)) { return; }

        if(firmado) {
          if(!Ask(Cairo.Language.getText(1593, ""), vbYes, Cairo.Language.getText(1594, ""))) {
            //If Not Ask("El documento ya ha sido firmado desea borrar la firma", vbYes, "Firmar") Then
            return;
          }
        }

        var doc = null;
        var us_id = null;

        doc = new cDocumento();

        if(!doc.Firmar(docId, us_id)) { return; }

        var sqlstmt = null;
        var rs = null;

        sqlstmt = "sp_DocPedidoVentaFirmar "+ pvId.toString()+ ","+ us_id.toString();
        if(!Cairo.Database.openRs(sqlstmt, rs)) { return; }

        m_objList.sqlstmt = "sp_lsdoc_PedidoVenta";

        m_objList.RefreshLine(pvId);

      };

      var pShowApply = function() {

        var pvId = null;
        pvId = m_objList.Id;

        if(pvId == Cairo.Constants.NO_ID) { return; }

        var total = null;
        var cotiz = null;
        var nroDoc = null;
        var cliId = null;
        var cliente = null;
        var sucId = null;
        var docId = null;
        var doctId = null;

        var sqlstmt = null;
        var rs = null;

        sqlstmt = "select pv_total, pv_nrodoc, pv.cli_id, cli_nombre,pv.suc_id, pv.doc_id, pv.doct_id from pedidoVenta pv inner join cliente cli on pv.cli_id = cli.cli_id where pv_id = "+ pvId.toString();

        if(!Cairo.Database.openRs(sqlstmt, rs)) { return; }

        if(rs.isEOF()) { return; }

        total = Cairo.Database.valField(rs.getFields(), mPedidoConstantes.PV_TOTAL);
        nroDoc = Cairo.Database.valField(rs.getFields(), mPedidoConstantes.PV_NRODOC);
        cliId = Cairo.Database.valField(rs.getFields(), mPedidoConstantes.CLI_ID);
        cliente = Cairo.Database.valField(rs.getFields(), mPedidoConstantes.CLI_NAME);
        sucId = Cairo.Database.valField(rs.getFields(), mPedidoConstantes.SUC_ID);
        docId = Cairo.Database.valField(rs.getFields(), mPedidoConstantes.DOC_ID);
        doctId = Cairo.Database.valField(rs.getFields(), mPedidoConstantes.DOCT_ID);

        if(!DoCairo.Security.anAccess(csPreVtaModifyAplic, m_doc_id, csE_DocTypePrestacion.cSEDOCTPREAPLICAR)) { return; }

        if(m_objApply == null) {
          m_objApply = new cPedidoVentaAplic();

          // Edit Apply
          //
        }
        else {
          if(m_objApply.self.getId() != pvId) {
            m_objApply = new cPedidoVentaAplic();
          }
        }

        if(!m_objApply.self.show(pvId, total, nroDoc, cliId, cliente, sucId, docId, doctId == csEDocumentoTipo.cSEDT_DEVOLUCIONPEDIDOVTA)) {
          m_objApply = null;
        }

      };

      var pShowFactura = function(bPushVirtualNext,  bAutoPago,  cue_id,  bModoVentaCtaCte) {
        try {

          var o = null;
          o = CSKernelClient2.CreateObject("CSVenta2.cFacturaVenta");

          o.PushVirtualNext = bPushVirtualNext;
          o.AutoSelectEasy = bPushVirtualNext;
          o.AutoPago = bAutoPago;
          o.ModoVentaCtaCte = bModoVentaCtaCte;
          o.cue_id_autoPago = cue_id;
          o.ShowFacturaPedido(pGetCliId(), pGetPvIds());

          // **TODO:** goto found: GoTo ExitProc;
        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, "pShowFactura", C_MODULE, "");
          // **TODO:** label found: ExitProc:;
        }
        // **TODO:** on error resume next found !!!
      };

      var pShowRemito = function() {
        try {

          var o = null;
          o = CSKernelClient2.CreateObject("CSVenta2.cRemitoVenta");

          o.ShowRemito(pGetCliId(), pGetPvIds());

          // **TODO:** goto found: GoTo ExitProc;
        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, "pShowRemito", C_MODULE, "");
          // **TODO:** label found: ExitProc:;
        }
        // **TODO:** on error resume next found !!!
      };

      var pShowPacking = function() {
        try {

          var o = null;
          o = CSKernelClient2.CreateObject("CSExport2.cPackingList");

          o.ShowPackingPedido(pGetCliId(), pGetPvIds());

          // **TODO:** goto found: GoTo ExitProc;
        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, "pShowPacking", C_MODULE, "");
          // **TODO:** label found: ExitProc:;
        }
        // **TODO:** on error resume next found !!!
      };

      var pGetCliId = function() {
        // **TODO:** on error resume next found !!!

        var pvId = null;
        var cliId = null;

        pvId = m_objList.Id;
        Cairo.Database.getData(mPedidoConstantes.PEDIDOVENTA, mPedidoConstantes.PV_ID, pvId, mPedidoConstantes.CLI_ID, cliId);

        return cliId;
      };

      var pGetPvIds = function() {
        return m_objList.SelectedItems;
      };

      self.initialize = function() {
        try {

          //'Pedidos de Venta
          m_title = Cairo.Language.getText(1557, "");

          m_properties = new cABMDocProperties();
          //Set .ImageList = fIcons.IList
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

      ////////////////////////////////
      //  Codigo estandar de errores
      //  On Error GoTo ControlError
      //
      //  GoTo ExitProc
      //ControlError:
      //  MngError err,"", C_Module, ""
      //  If Err.Number Then Resume ExitProc
      //ExitProc:
      //  On Error Resume Next


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