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

      var C_MODULE = "cFacturaVtaListDoc";

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
      var m_us_id = 0;
      var m_properties;

      var m_title = "";

      var m_menuLoaded;

      var m_menuShowCobranza = 0;
      var m_menuShowMensajes = 0;
      var m_menuShowInfoCli = 0;
      var m_menuAddNote = 0;
      var m_menuShowAplic = 0;
      var m_menuShowAsiento = 0;
      var m_menuShowDocAux = 0;
      var m_menuFirmar = 0;
      var m_menuEditCliente = 0;

      var m_menuGetCae = 0;
      var m_menuUpdateTalonarios = 0;
      var m_sendCAEByEmail = 0;

      var m_objApply;

      var m_apiPath = DB.getAPIVersion();

      self.getEnabledSearchParam = function() {
        return true;
      };

      self.getSearchParamTable = function() {
        return Cairo.Tables.CLIENTE;
      };

      self.getBackgroundColor = function() {
        return RGB(&HC1, &HC1, &HF6);
      };

      self.setSearchParam = function(id,  name) {
        // **TODO:** on error resume next found !!!
        var property = m_dialog.getProperties().item(mVentaConstantes.CLI_ID);
        property.setValue(name);
        property.setSelectId(id);
        property.setHelpValueProcess(id);
        var abmGen = null;
        abmGen = m_dialog;
        abmGen.ShowValue(m_dialog.getProperties().item(mVentaConstantes.CLI_ID));
      };

      self.processMenu = function(index) {
        try {

          switch (index) {
            case m_menuShowCobranza:
              pShowCobranza();

              break;

            case m_menuShowInfoCli:
              HelpShowInfo(Cairo.Tables.CLIENTE, pGetCliId());

              break;

            case m_menuShowMensajes:
              showNotes();

              break;

            case m_menuAddNote:
              addNote();

              break;

            case m_menuShowAplic:
              pShowApply();

              break;

            case m_menuShowAsiento:
              pShowAsiento();

              break;

            case m_menuShowDocAux:
              pShowDocAux();

              break;

            case m_menuFirmar:
              pFirmar();

              break;

            case m_menuEditCliente:
              pEditCliente();

              break;

            case m_menuGetCae:
              pGetCAE();

              break;

            case m_menuUpdateTalonarios:
              pUpdateTalonariosAFIP();

              break;

            case m_sendCAEByEmail:
              pSendCAEByEmail();

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
        var c = null;
        var o = null;
        var value = null;
        var bExists = null;

        var properties = m_dialog.getProperties();
        properties.clear();

        c = properties.add(null, C_FECHAINI);
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

        c = properties.add(null, C_FECHAFIN);
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

        c = properties.add(null, mVentaConstantes.CLI_ID);
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

        c = properties.add(null, Cairo.Constants.EST_ID);
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

        c = properties.add(null, mVentaConstantes.CCOS_ID);
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

        c = properties.add(null, mVentaConstantes.SUC_ID);
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

        c = properties.add(null, mVentaConstantes.VEN_ID);
        c.setType(Dialogs.PropertyType.select);
        c.setTable(Cairo.Tables.VENDEDORES);
        //'Vendedor
        c.setName(Cairo.Language.getText(1510, ""));
        c.setKey(K_VEN_ID);
        value = m_vendedor;
        if(m_ven_id.Substring(0, 1).toUpperCase() == KEY_NODO) {
          value = GetNombreRama(Cairo.Tables.VENDEDORES, Cairo.Util.val(m_ven_id.Substring(2)), bExists);
          if(!bExists) { m_ven_id = "0"; }
        }
        c.setValue(value);
        c.setSelectId(Cairo.Util.val(m_ven_id));
        c.setHelpValueProcess(m_ven_id);

        c = properties.add(null, mVentaConstantes.DOC_ID);
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

        c = properties.add(null, mVentaConstantes.CPG_ID);
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
        c = properties.add(null, Cairo.Constants.EMP_ID);
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

        createMenu();
        if(!m_dialog.showDocumentList(self)) { return false; }

        return true;
      };

      var refreshCollection = function() {

        m_dialog.setTitle(m_name);

        var properties = m_dialog.getProperties();

        return m_dialog.showValues(properties);
      };

      var load = function() {

        return Cairo.Database.getData("load[" + m_apiPath + "general/facturavtalistdoc]", id).then(
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

              strLoad = Cairo.Language.getText(2226, "");
              //Error al carga los párametros de navegación de Facturas de Venta

              m_fechaIni = (m_fechaIni != Cairo.Constants.cSNODATE) ? m_fechaIni : Date);
              m_fechaFin = (m_fechaFin != Cairo.Constants.cSNODATE) ? m_fechaFin : Date);

              // OJO: EL ASISTENTE ESTO LO HACE MAL, YA QUE EL CODIGO QUE GENERA NO SOPORTA ARBOLES
              //      USEN ESTE CODIGO COMO EJ. OJO!!! CAMBIEN LOS NOMBRES DE LAS TABLAS Y LOS CAMPOS NOMBRES DE DICHAS TABLAS.
              if(m_cli_id.Substring(0, 1).toUpperCase() != KEY_NODO) {
                if(!Cairo.Database.getData(mVentaConstantes.CLIENTE, mVentaConstantes.CLI_ID, Cairo.Util.val(m_cli_id), mVentaConstantes.CLI_NAME, data, C_LoadFunction, C_MODULE, strLoad)) { return false; }
                m_cliente = data;
              }
              if(m_est_id.Substring(0, 1).toUpperCase() != KEY_NODO) {
                if(!Cairo.Database.getData(Cairo.Constants.ESTADO, Cairo.Constants.EST_ID, Cairo.Util.val(m_est_id), Cairo.Constants.EST_NAME, data, C_LoadFunction, C_MODULE, strLoad)) { return false; }
                m_estado = data;
              }
              if(m_ccos_id.Substring(0, 1).toUpperCase() != KEY_NODO) {
                if(!Cairo.Database.getData(mVentaConstantes.CENTROCOSTO, mVentaConstantes.CCOS_ID, Cairo.Util.val(m_ccos_id), mVentaConstantes.CCOS_NAME, data, C_LoadFunction, C_MODULE, strLoad)) { return false; }
                m_centroCosto = data;
              }
              if(m_suc_id.Substring(0, 1).toUpperCase() != KEY_NODO) {
                if(!Cairo.Database.getData(mVentaConstantes.SUCURSAL, mVentaConstantes.SUC_ID, Cairo.Util.val(m_suc_id), mVentaConstantes.SUC_NAME, data, C_LoadFunction, C_MODULE, strLoad)) { return false; }
                m_sucursal = data;
              }
              if(m_ven_id.Substring(0, 1).toUpperCase() != KEY_NODO) {
                if(!Cairo.Database.getData(mVentaConstantes.VENDEDOR, mVentaConstantes.VEN_ID, Cairo.Util.val(m_ven_id), mVentaConstantes.VEN_NAME, data, C_LoadFunction, C_MODULE, strLoad)) { return false; }
                m_vendedor = data;
              }
              if(m_doc_id.Substring(0, 1).toUpperCase() != KEY_NODO) {
                if(!Cairo.Database.getData(mVentaConstantes.DOCUMENTO, mVentaConstantes.DOC_ID, Cairo.Util.val(m_doc_id), mVentaConstantes.DOC_NAME, data, C_LoadFunction, C_MODULE, strLoad)) { return false; }
                m_documento = data;
              }
              if(m_cpg_id.Substring(0, 1).toUpperCase() != KEY_NODO) {
                if(!Cairo.Database.getData(mVentaConstantes.CONDICIONPAGO, mVentaConstantes.CPG_ID, Cairo.Util.val(m_cpg_id), mVentaConstantes.CPG_NAME, data, C_LoadFunction, C_MODULE, strLoad)) { return false; }
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

      self.getAplication = function() {
        return Cairo.appName;
      };

      self.getProperties = function() {
        return m_properties;
      };

      // OJO: NUEVAMENTE LA EXISTENCIA DE FECHAS VIRTUALES HACE QUE EL CODIGO GENERADO POR EL ASISTENTE ESTE MAL
      //      CORRIJALO UTILIZANDO ESTE CODIGO COMO EJEMPLO.
      self.propertyChange = function(key) {
        var iProp = null;

        var properties = m_dialog.getProperties();
        switch (key) {

          case K_FECHAINI:

            iProp = properties.item(C_FECHAINI);

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

            iProp = properties.item(C_FECHAFIN);

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

          case K_EST_ID:
            var property = properties.item(Cairo.Constants.EST_ID);
            m_estado = property.getValue();
            m_est_id = property.getSelectIntValue();

            break;

          case K_CLI_ID:
            var property = properties.item(mVentaConstantes.CLI_ID);
            m_cliente = property.getValue();
            m_cli_id = property.getSelectIntValue();

            break;

          case K_CCOS_ID:
            var property = properties.item(mVentaConstantes.CCOS_ID);
            m_centroCosto = property.getValue();
            m_ccos_id = property.getSelectIntValue();

            break;

          case K_SUC_ID:
            var property = properties.item(mVentaConstantes.SUC_ID);
            m_sucursal = property.getValue();
            m_suc_id = property.getSelectIntValue();

            break;

          case K_VEN_ID:
            var property = properties.item(mVentaConstantes.VEN_ID);
            m_vendedor = property.getValue();
            m_ven_id = property.getSelectIntValue();

            break;

          case K_DOC_ID:
            var property = properties.item(mVentaConstantes.DOC_ID);
            m_documento = property.getValue();
            m_doc_id = property.getSelectIntValue();

            break;

          case K_CPG_ID:
            var property = properties.item(mVentaConstantes.CPG_ID);
            m_condicionPago = property.getValue();
            m_cpg_id = property.getSelectIntValue();

            // empid
            break;

          case K_EMP_ID:
            var property = properties.item(Cairo.Constants.EMP_ID);
            m_empresa = property.getValue();
            m_emp_id = property.getSelectIntValue();
            break;
        }

        return true;
      };

      var cIABMListDocClient_Refresh = function() {
        var sqlstmt = null;

        sqlstmt = "sp_lsdoc_FacturasVenta ";

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

        sqlstmt = sqlstmt+ Cairo.Database.sqlString(m_cli_id)+ ",";
        sqlstmt = sqlstmt+ Cairo.Database.sqlString(m_est_id)+ ",";
        sqlstmt = sqlstmt+ Cairo.Database.sqlString(m_ccos_id)+ ",";
        sqlstmt = sqlstmt+ Cairo.Database.sqlString(m_suc_id)+ ",";
        sqlstmt = sqlstmt+ Cairo.Database.sqlString(m_ven_id)+ ",";
        sqlstmt = sqlstmt+ Cairo.Database.sqlString(m_doc_id)+ ",";
        // empid
        sqlstmt = sqlstmt+ Cairo.Database.sqlString(m_cpg_id)+ ",";
        sqlstmt = sqlstmt+ Cairo.Database.sqlString(m_emp_id);

        return sqlstmt;
      };

      var cIABMListDocClient_Save = function() {

        var strError = null;

        strError = Cairo.Language.getText(2226, "");
        //Error al grabar los párametros de navegación de Facturas de Venta

        var register = null;
        register = new cRegister();

        var sqlstmt = null;

        sqlstmt = "delete ListaDocumentoParametro where pre_id = "+ csPreVtaListFactura+ " and us_id = "+ m_us_id+ " and (emp_id is null or emp_id = "+ cUtil.getEmpId().toString()+ ")";

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
          register.getFields().add2(Cairo.Constants.PRE_ID, csPreVtaListFactura, Cairo.Constants.Types.id);

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

      var setCIEditGenericListDoc_ObjABM = function(rhs) {
        m_dialog = rhs;
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
        return "'{emp_id=0}doct_id = "+ csEDocumentoTipo.cSEDT_FACTURAVENTA.toString()+ " or doct_id = "+ csEDocumentoTipo.cSEDT_NOTACREDITOVENTA.toString()+ " or doct_id = "+ csEDocumentoTipo.cSEDT_NOTADEBITOVENTA.toString()+ "'";
      };

      var createMenu = function() {
        // **TODO:** on error resume next found !!!

        if(m_menuLoaded) { return; }

        m_menuLoaded = true;

        m_objList.ObjClientMenu = self;
        m_objList.ClearMenu;
        //'Editar Cliente
        m_menuEditCliente = m_objList.AddMenu(Cairo.Language.getText(5038, ""));
        m_objList.AddMenu("-");
        //'Cobrar
        m_menuShowCobranza = m_objList.AddMenu(Cairo.Language.getText(1690, ""));
        m_objList.AddMenu("-");
        //'Firmar
        m_menuFirmar = m_objList.AddMenu(Cairo.Language.getText(1594, ""));
        m_objList.AddMenu("-");
        //'Ver Info del Cliente
        m_menuShowInfoCli = m_objList.AddMenu(Cairo.Language.getText(1614, ""));
        //'Agregar Nota
        m_menuAddNote = m_objList.AddMenu(Cairo.Language.getText(1615, ""));
        //'Ver Notas
        m_menuShowMensajes = m_objList.AddMenu(Cairo.Language.getText(1616, ""));
        m_objList.AddMenu("-");
        //'Ver Aplicaciones
        m_menuShowAplic = m_objList.AddMenu(Cairo.Language.getText(1617, ""));
        //'Ver Asiento Contable
        m_menuShowAsiento = m_objList.AddMenu(Cairo.Language.getText(1692, ""));
        //'Ver Documento Asociado
        m_menuShowDocAux = m_objList.AddMenu(Cairo.Language.getText(1691, ""));
        m_objList.AddMenu("-");
        //'Obtener CAE
        m_menuGetCae = m_objList.AddMenu(Cairo.Language.getText(5125, ""));
        //'Actualizar Talonarios AFIP
        m_menuUpdateTalonarios = m_objList.AddMenu(Cairo.Language.getText(5130, ""));
        //'Enviar Factura Electronica por e-mail
        m_sendCAEByEmail = m_objList.AddMenu(Cairo.Language.getText(5131, ""));
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

        var i = null;
        var fvId = null;
        var firmado = null;
        var docId = null;
        var vIds() = null;
        var us_id_firmante = null;
        var bNotShowForm = null;
        var sqlstmt = null;
        var rs = null;
        var doc = null;
        var us_id = null;

        vIds = m_objList.SelectedItems;

        for (i = 0; i <= vIds.Length; i++) {

          fvId = vIds[i];

          if(fvId != Cairo.Constants.NO_ID) {

            if(!Cairo.Database.getData(mVentaConstantes.FACTURAVENTA, mVentaConstantes.FV_ID, fvId, mVentaConstantes.FV_FIRMADO, firmado)) { return; }
            if(!Cairo.Database.getData(mVentaConstantes.FACTURAVENTA, mVentaConstantes.FV_ID, fvId, mVentaConstantes.DOC_ID, docId)) { return; }

            if(firmado) {
              if(!Ask(Cairo.Language.getText(1593, ""), vbYes, Cairo.Language.getText(1594, ""))) {
                //El documento ya ha sido firmado desea borrar la firma", vbYes, "Firmar
                return;
              }
            }

            bNotShowForm = false;

            if(us_id_firmante != Cairo.Constants.NO_ID) {

              sqlstmt = "select us_id from DocumentoFirma where doc_id = "+ docId.toString()+ " and us_id = "+ us_id_firmante.toString();

              if(!Cairo.Database.openRs(sqlstmt, rs)) { return; }
              if(!rs.isEOF()) {

                bNotShowForm = true;
                us_id = us_id_firmante;

              }
            }

            if(!bNotShowForm) {

              doc = new cDocumento();

              if(!doc.Firmar(docId, us_id)) { return; }

            }

            sqlstmt = "sp_DocFacturaVentaFirmar "+ fvId.toString()+ ","+ us_id.toString();
            if(!Cairo.Database.openRs(sqlstmt, rs)) { return; }

            m_objList.sqlstmt = "sp_lsdoc_FacturaVenta";

            m_objList.RefreshLine(fvId);

            sqlstmt = "select fv_firmado from FacturaVenta where fv_id = "+ fvId.toString();
            if(!Cairo.Database.openRs(sqlstmt, rs)) { return; }
            if(rs.isEOF()) { return; }

            us_id_firmante = Cairo.Database.valField(rs.getFields(), 0);

          }

        }

      };

      var pGetCAE = function() {

        var i = null;
        var fvId = null;
        var vIds() = null;

        vIds = m_objList.SelectedItems;

        for (i = 0; i <= vIds.Length; i++) {

          fvId = vIds[i];

          if(fvId != Cairo.Constants.NO_ID) {

            mPublicVentas.self.facturaVentaGetCAE(fvId);
            m_objList.sqlstmt = "sp_lsdoc_FacturaVenta";
            m_objList.RefreshLine(fvId);

          }

        }

        pUpdateTalonariosAFIP();

      };

      var pUpdateTalonariosAFIP = function() {

        var sqlstmt = null;
        var rs = null;

        sqlstmt = "sp_FE_UpdateTalonarios";
        if(!Cairo.Database.openRs(sqlstmt, rs)) { return; }
        if(rs.isEOF()) { return; }

        MsgInfo(Cairo.Database.valField(rs.getFields(), "info"));

      };

      var pSendCAEByEmail = function() {

        var i = null;
        var fvId = null;
        var vIds() = null;

        vIds = m_objList.SelectedItems;

        for (i = 0; i <= vIds.Length; i++) {

          fvId = vIds[i];

          if(fvId != Cairo.Constants.NO_ID) {

            mPublicVentas.self.facturaVentaSendCAEByEmail(fvId);

          }

        }

        //' "La solicitud de envio de e-mail se genero con éxito
        MsgInfo(Cairo.Language.getText(5133, ""));

      };

      var pShowAsiento = function() {

        var fvId = null;
        fvId = m_dialog.getId();

        if(fvId) {

          var asId = null;
          if(!Cairo.Database.getData(mVentaConstantes.FACTURAVENTA, mVentaConstantes.FV_ID, fvId, mVentaConstantes.AS_ID, asId)) { return; }

          ShowDocAux(asId, "CSContabilidad2.cAsiento", "CSABMInterface2.cABMGeneric");
        }

      };

      var pShowDocAux = function() {

        var fvId = null;
        fvId = m_dialog.getId();

        if(fvId) {

          var stId = null;
          if(!Cairo.Database.getData(mVentaConstantes.FACTURAVENTA, mVentaConstantes.FV_ID, fvId, mVentaConstantes.ST_ID, stId)) { return; }

          if(stId == Cairo.Constants.NO_ID) {

            MsgInfo(Cairo.Language.getText(1693, ""));
            //Este comprobante no tiene un documento de stock asociado.
          }
          else {

            ShowDocAux(stId, "CSStock2.cStock", "CSABMInterface2.cABMGeneric");
          }
        }

      };

      var pShowApply = function() {

        var fvId = null;
        fvId = m_dialog.getId();

        if(fvId == Cairo.Constants.NO_ID) { return; }

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

        sqlstmt = "select fv_total, fv_cotizacion, fv_nrodoc, fv.cli_id, cli_nombre, fv.suc_id, fv.doc_id, fv.doct_id from FacturaVenta fv inner join Cliente cli  on fv.cli_id = cli.cli_id where fv_id = "+ fvId.toString();

        if(!Cairo.Database.openRs(sqlstmt, rs)) { return; }

        if(rs.isEOF()) { return; }

        total = Cairo.Database.valField(rs.getFields(), mVentaConstantes.FV_TOTAL);
        cotiz = Cairo.Database.valField(rs.getFields(), mVentaConstantes.FV_COTIZACION);
        nroDoc = Cairo.Database.valField(rs.getFields(), mVentaConstantes.FV_NRODOC);
        cliId = Cairo.Database.valField(rs.getFields(), mVentaConstantes.CLI_ID);
        cliente = Cairo.Database.valField(rs.getFields(), mVentaConstantes.CLI_NAME);
        sucId = Cairo.Database.valField(rs.getFields(), mVentaConstantes.SUC_ID);
        docId = Cairo.Database.valField(rs.getFields(), mVentaConstantes.DOC_ID);
        doctId = Cairo.Database.valField(rs.getFields(), mVentaConstantes.DOCT_ID);

        if(!DoCairo.Security.anAccess(csPreVtaModifyAplic, m_doc_id, csE_DocTypePrestacion.cSEDOCTPREAPLICAR)) { return; }

        if(m_objApply == null) {
          m_objApply = new cFacturaVentaAplic();

          // Edit Apply
          //
        }
        else {
          if(m_objApply.self.getId() != fvId) {
            m_objApply = new cFacturaVentaAplic();
          }
        }

        if(!m_objApply.self.show(fvId, total * (cotiz != 0) ? cotiz : 1), nroDoc, cliId, cliente, sucId, docId, doctId == csEDocumentoTipo.cSEDT_NOTACREDITOVENTA)) {
          m_objApply = null;
        }

      };

      var pShowCobranza = function() {
        try {

          var o = null;

          o = CSKernelClient2.CreateObject("CSTesoreria2.cCobranza");

          o.ShowCobranza(pGetCliId(), pGetFvIds());

          // **TODO:** goto found: GoTo ExitProc;
        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, "pShowCobranza", C_MODULE, "");
          // **TODO:** label found: ExitProc:;
        }
        // **TODO:** on error resume next found !!!
      };

      var pGetCliId = function() {
        // **TODO:** on error resume next found !!!

        var fvId = null;
        var cliId = null;

        fvId = m_dialog.getId();
        Cairo.Database.getData(mVentaConstantes.FACTURAVENTA, mVentaConstantes.FV_ID, fvId, mVentaConstantes.CLI_ID, cliId);

        return cliId;
      };

      var pGetFvIds = function() {
        return m_objList.SelectedItems;
      };

      self.initialize = function() {
        try {

          //'Facturas de Venta
          m_title = Cairo.Language.getText(1624, "");

          m_properties = new cABMDocProperties();
          //Set .ImageList = fResource.iList
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