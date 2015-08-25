(function() {
  "use strict";

  Cairo.module("FacturaVenta.Edit", function(Edit, Cairo, Backbone, Marionette, $, _) {

  });

  Cairo.module("FacturaVentaListDoc.Edit", function(Edit, Cairo, Backbone, Marionette, $, _) {

    var createObject = function() {

      var self = {};

      var getText = Cairo.Language.getText;
      var P = Cairo.Promises;
      var NO_ID = Cairo.Constants.NO_ID;
      var DB = Cairo.Database;
      var D = Cairo.Documents;
      var M = Cairo.Modal;
      var C = Cairo.General.Constants;
      var CV = Cairo.Ventas.Constants;
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

      var K_FECHAINI = 1;
      var K_FECHAFIN = 2;
      var K_CLI_ID = 4;
      var K_EST_ID = 5;
      var K_CCOS_ID = 6;
      var K_SUC_ID = 7;
      var K_VEN_ID = 8;
      var K_DOC_ID = 9;
      var K_CPG_ID = 10;
      var K_EMP_ID = 100;

      var m_fechaIni = null;
      var m_fechaFin = null;
      var m_cliId = "";
      var m_cliente = "";
      var m_estId = "";
      var m_estado = "";
      var m_ccosId = "";
      var m_centroCosto = "";
      var m_sucId = "";
      var m_sucursal = "";
      var m_venId = "";
      var m_vendedor = "";
      var m_docId = "";
      var m_documento = "";
      var m_cpgId = "";
      var m_condicionPago = "";
      var m_empId = "";
      var m_empresa = "";
      var m_fechaIniV = "";
      var m_fechaFinV = "";

      var m_dialog;
      var m_properties;

      var m_listController;

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
      var SAVE_ERROR = getText(2226, ""); // Error al grabar los párametros de navegación de Factura de Ventas

      self.list = function() {
        initialize();
        return load()
          .success(loadCollection);
      };

      self.edit = function(fvId) {
        m_listController.edit(fvId);
      };

      self.deleteItem = function(fvId) {
        return m_listController.destroy(fvId);
      };

      self.showDocDigital = function() {
        var _rtn = null;

        try {

          var fvId = m_dialog.getId();
          if(fvId === NO_ID) { return _rtn; }

          var doc = new Cairo.DocDigital();

          doc.setClientTable(CV.FACTURA_VENTA);
          doc.setClientTableID(fvId);

          _rtn = doc.showDocs(Cairo.Database);

        }
        catch(ex) {
          Cairo.manageErrorEx(ex.message, ex, "showDocDigital", C_MODULE, "");
        }

        return _rtn;
      };

      self.getEnabledSearchParam = function() {
        return true;
      };

      self.getSearchParamTable = function() {
        return Cairo.Tables.CLIENTE;
      };

      self.getBackgroundColor = function() {
        return "#fff";
      };

      self.setSearchParam = function(id,  name) {

        var property = m_dialog.getProperties().item(C.CLI_ID);
        property.setValue(name);
        property.setSelectId(id);
        property.setSelectIntValue(id);
        m_dialog.showValue(m_dialog.getProperties().item(CV.CLI_ID));
      };

      self.processMenu = function(index) {
        try {

          switch (index) {
            case m_menuShowCobranza:
              showCobranza();
              break;

            case m_menuShowInfoCli:
              D.showInfo(Cairo.Tables.CLIENTE, getCliId());
              break;

            case m_menuShowMensajes:
              showNotes();
              break;

            case m_menuAddNote:
              addNote();
              break;

            case m_menuShowAplic:
              showApply();
              break;

            case m_menuShowAsiento:
              showAsiento();
              break;

            case m_menuShowDocAux:
              showDocAux();
              break;

            case m_menuFirmar:
              signDocument();
              break;

            case m_menuEditCliente:
              editCliente();
              break;

            case m_menuGetCae:
              getCAE();
              break;

            case m_menuUpdateTalonarios:
              updateTalonariosAFIP();
              break;

            case m_sendCAEByEmail:
              sendCAEByEmail();
              break;
          }

        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, "ProcessMenu", C_MODULE, "");
        }
      };

      var loadCollection = function() {
        var c;

        m_properties.clear();

        c = m_properties.add(null, C_FECHAINI);
        c.setType(T.date);
        c.setName(getText(1203, "")); // Fecha desde
        c.setKey(K_FECHAINI);
        c.setValue((m_fechaIniV !== "") ? m_fechaIniV : m_fechaIni);

        c = m_properties.add(null, C_FECHAFIN);
        c.setType(T.date);
        c.setName(getText(1204, "")); // Fecha hasta
        c.setKey(K_FECHAFIN);
        c.setValue((m_fechaFinV !== "") ? m_fechaFinV : m_fechaFin);

        c = m_properties.add(null, C.CLI_ID);
        c.setType(T.select);
        c.setSelectTable(Cairo.Tables.CLIENTE);
        c.setName(getText(1150, "")); // Proveedor
        c.setKey(K_CLI_ID);
        c.setValue(m_cliente);
        c.setSelectId(val(m_cliId));
        c.setSelectIntValue(m_cliId);

        c = m_properties.add(null, C.EST_ID);
        c.setType(T.select);
        c.setSelectTable(Cairo.Tables.ESTADOS);
        c.setName(getText(1568, "")); // Estado
        c.setKey(K_EST_ID);
        c.setValue(m_estado);
        c.setSelectId(val(m_estId));
        c.setSelectIntValue(m_estId);

        c = m_properties.add(null, C.CCOS_ID);
        c.setType(T.select);
        c.setSelectTable(Cairo.Tables.CENTROS_DE_COSTO);
        c.setName(getText(1057, "")); // Centro de Costos
        c.setKey(K_CCOS_ID);
        c.setValue(m_centroCosto);
        c.setSelectId(val(m_ccosId));
        c.setSelectIntValue(m_ccosId);

        c = m_properties.add(null, C.SUC_ID);
        c.setType(T.select);
        c.setSelectTable(Cairo.Tables.SUCURSAL);
        c.setName(getText(1281, "")); // Sucursal
        c.setKey(K_SUC_ID);
        c.setValue(m_sucursal);
        c.setSelectId(val(m_sucId));
        c.setSelectIntValue(m_sucId);

        c = m_properties.add(null, CV.VEN_ID);
        c.setType(T.select);
        c.setSelectTable(Cairo.Tables.VENDEDOR);
        c.setName(getText(1510, "")); // Vendedor
        c.setKey(K_VEN_ID);
        c.setValue(m_vendedor);
        c.setSelectId(val(m_venId));
        c.setSelectIntValue(m_venId);

        c = m_properties.add(null, C.DOC_ID);
        c.setType(T.select);
        c.setSelectTable(Cairo.Tables.DOCUMENTO);
        c.setName(getText(1567, "")); // Documentos
        c.setKey(K_DOC_ID);
        c.setValue(m_documento);
        c.setSelectId(val(m_docId));
        c.setSelectIntValue(m_docId);
        c.setSelectFilter(D.FACTURA_VENTAS_LIST_DOC_FILTER);

        c = m_properties.add(null, C.CPG_ID);
        c.setType(T.select);
        c.setSelectTable(Cairo.Tables.CONDICION_PAGO);
        c.setName(getText(1395, "")); // Condicion de pago
        c.setKey(K_CPG_ID);
        c.setValue(m_condicionPago);
        c.setSelectId(val(m_cpgId));
        c.setSelectIntValue(m_cpgId);

        c = m_properties.add(null, C.EMP_ID);
        c.setType(T.select);
        c.setSelectTable(Cairo.Tables.EMPRESA);
        c.setName(getText(1114, "")); // Empresa
        c.setKey(K_EMP_ID);
        c.setValue(m_empresa);
        c.setSelectId(val(m_empId));
        c.setSelectIntValue(m_empId);

        createMenu();
        if(!m_dialog.showDocumentList(self)) { return false; }

        return true;
      };

      var refreshCollection = function() {
        return m_dialog.showValues(m_properties);
      };

      var load = function() {

        return DB.getData("load[" + m_apiPath + "ventas/facturaventas/parameters]").then(
          function(response) {


            m_empId = Cairo.Company.getId();
            m_empresa = Cairo.Company.getName();

            if(response.success !== true) { return false; }

            if(response.data.id === NO_ID) {

              m_fechaIniV = "";
              m_fechaIni = Cairo.Dates.today();
              m_fechaFinV = "";
              m_fechaFin = Cairo.Dates.DateNames.getDateByName('h-60');

              m_cliId = NO_ID;
              m_cliente = "";
              m_estId = NO_ID;
              m_estado = "";
              m_ccosId = NO_ID;
              m_centroCosto = "";
              m_sucId = NO_ID;
              m_sucursal = "";
              m_venId = NO_ID;
              m_vendedor = "";
              m_docId = NO_ID;
              m_documento = "";
              m_cpgId = NO_ID;
              m_condicionPago = "";

            }
            else {

              m_fechaIniV = valField(response.data, C.FROM);
              m_fechaIni = valField(response.data, C.FROM);
              m_fechaIni = isDate(m_fechaIni) ? getDateValue(m_fechaIni) : today();

              m_fechaFinV = valField(response.data, C.TO);
              m_fechaFin = valField(response.data, C.TO);
              m_fechaFin = isDate(m_fechaFin) ? getDateValue(m_fechaFin) : today();

              m_cliId = valField(response.data, C.CLI_ID);
              m_estId = valField(response.data, C.EST_ID);
              m_ccosId = valField(response.data, C.CCOS_ID);
              m_sucId = valField(response.data, C.SUC_ID);
              m_venId = valField(response.data, C.VEN_ID);
              m_docId = valField(response.data, C.DOC_ID);
              m_cpgId = valField(response.data, C.CPG_ID);
              m_empId = valField(response.data, C.EMP_ID);

              m_cliente = valField(response.data, C.CLI_NAME);
              m_estado = valField(response.data, C.EST_NAME);
              m_centroCosto = valField(response.data, C.CCOS_NAME);
              m_sucursal = valField(response.data, C.SUC_NAME);
              m_vendedor = valField(response.data, C.VEN_NAME);
              m_documento = valField(response.data, C.DOC_NAME);
              m_condicionPago = valField(response.data, C.CPG_NAME);
              m_empresa = valField(response.data, C.EMP_NAME);

            }
            return true;
          }
        );
      };

      self.getProperties = function() {
        return m_properties;
      };

      self.propertyChange = function(key) {

        var property;
        var properties = m_properties;

        switch (key) {

          case K_FECHAINI:

            property = properties.item(C_FECHAINI);

            if(property.getSelectIntValue() != "") {
              m_fechaIniV = property.getSelectIntValue();
              m_fechaIni = Cairo.Dates.DateNames.getDateByName(m_fechaIniV);
            }
            else if(isDate(property.getValue())) {
              m_fechaIniV = "";
              m_fechaIni = property.getValue();
            }
            else {
              m_fechaIniV = "";
              property.setValue(m_fechaIni);
            }
            break;

          case K_FECHAFIN:

            property = properties.item(C_FECHAFIN);

            if(property.getSelectIntValue() != "") {
              m_fechaFinV = property.getSelectIntValue();
              m_fechaFin = Cairo.Dates.DateNames.getDateByName(m_fechaFinV);
            }
            else if(isDate(property.getValue())) {
              m_fechaFinV = "";
              m_fechaFin = property.getValue();
            }
            else {
              m_fechaFinV = "";
              property.setValue(m_fechaFin);
            }
            break;

          case K_EST_ID:
            var property = properties.item(C.EST_ID);
            m_estado = property.getValue();
            m_estId = property.getSelectIntValue();
            break;

          case K_CLI_ID:
            var property = properties.item(CV.CLI_ID);
            m_cliente = property.getValue();
            m_cliId = property.getSelectIntValue();
            break;

          case K_CCOS_ID:
            var property = properties.item(CV.CCOS_ID);
            m_centroCosto = property.getValue();
            m_ccosId = property.getSelectIntValue();
            break;

          case K_SUC_ID:
            var property = properties.item(CV.SUC_ID);
            m_sucursal = property.getValue();
            m_sucId = property.getSelectIntValue();
            break;

          case K_VEN_ID:
            var property = properties.item(CV.VEN_ID);
            m_vendedor = property.getValue();
            m_venId = property.getSelectIntValue();
            break;

          case K_DOC_ID:
            var property = properties.item(CV.DOC_ID);
            m_documento = property.getValue();
            m_docId = property.getSelectIntValue();
            break;

          case K_CPG_ID:
            var property = properties.item(CV.CPG_ID);
            m_condicionPago = property.getValue();
            m_cpgId = property.getSelectIntValue();
            break;

          case K_EMP_ID:
            var property = properties.item(C.EMP_ID);
            m_empresa = property.getValue();
            m_empId = property.getSelectIntValue();
            break;
        }

        return true;
      };

      self.refresh = function() {

        var startDate;
        if(Cairo.Dates.DateNames.getDateNames().contains(m_fechaIniV)) {
          startDate = Cairo.Dates.DateNames.getDateByName(m_fechaIniV);
        }
        else {
          startDate = m_fechaIni
        }

        var endDate;
        if(Cairo.Dates.DateNames.getDateNames().contains(m_fechaFinV)) {
          endDate = Cairo.Dates.DateNames.getDateByName(m_fechaFinV);
        }
        else {
          endDate = m_fechaFin
        }

        endDate = Cairo.Dates.DateNames.addToDate("d", 1, endDate);

        startDate = DB.sqlDate(startDate);
        endDate = DB.sqlDate(endDate);

        var params = {
          from: startDate,
          to: endDate,
          cliId: m_cliId,
          estId: m_estId,
          ccosId: m_ccosId,
          sucId: m_sucId,
          venId: m_venId,
          docId: m_docId,
          cpgId: m_cpgId,
          empId: m_empId
        };

        return DB.getData("load[" + m_apiPath + "ventas/facturaventas]", null, params);
      };

      self.save = function() {

        var register = new DB.Register();
        var fields = register.getFields();

        register.setFieldId(C.LDP_ID);
        register.setTable(C.LISTA_DOCUMENTO_PARAMETRO);

        var apiPath = DB.getAPIVersion();
        register.setPath(apiPath + "ventas/facturaventas");

        register.setId(Cairo.Constants.NEW_ID);

        var _count = m_dialog.getProperties().size();
        for (var _i = 0; _i < _count; _i++) {

          var property = m_dialog.getProperties().item(_i);

          switch (property.getKey()) {

            case K_FECHAINI:
              var value = property.getSelectIntValue();
              if(value === "") { value = property.getValue(); }
              fields.add(C.FROM, value, Types.text);
              break;

            case K_FECHAFIN:
              var value = property.getSelectIntValue();
              if(value === "") { value = property.getValue(); }
              fields.add(C.TO, value, Types.text);
              break;

            case K_CLI_ID:
              fields.add(C.CLI_ID, property.getSelectIntValue(), Types.text);
              break;

            case K_EST_ID:
              fields.add(C.EST_ID, property.getSelectIntValue(), Types.text);
              break;

            case K_CCOS_ID:
              fields.add(C.CCOS_ID, property.getSelectIntValue(), Types.text);
              break;

            case K_SUC_ID:
              fields.add(C.SUC_ID, property.getSelectIntValue(), Types.text);
              break;

            case K_VEN_ID:
              fields.add(C.VEN_ID, property.getSelectIntValue(), Types.text);
              break;

            case K_DOC_ID:
              fields.add(C.DOC_ID, property.getSelectIntValue(), Types.text);
              break;

            case K_CPG_ID:
              fields.add(C.CPG_ID, property.getSelectIntValue(), Types.text);
              break;

            case K_EMP_ID:
              fields.add(C.EMP_ID, property.getSelectIntValue(), Types.text);
              break;

          }
        }

        return DB.saveEx(
            register,
            false,
            "",
            Cairo.Constants.CLIENT_SAVE_FUNCTION,
            C_MODULE,
            SAVE_ERROR).then(

          function(result) {
            if(result.success) {
              return load(result.data.getId()).then(
                function (success) {
                  if(success) {
                    refreshCollection();
                  };
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

      self.getPath = function() {
        return "#venta/facturasdeventa";
      };

      self.getEditorName = function() {
        return "facturaventas";
      };

      self.getTitle = function() {
        return m_title;
      };

      self.validate = function() {
        return P.resolvedPromise(true);
      };

      self.setDialog = function(dialog) {
        m_dialog = dialog;
        m_properties = dialog.getProperties();
      };

      self.setListController = function(controller) {
        m_listController = controller;
      };
      
      var createMenu = function() {

        if(m_menuLoaded) { return; }

        m_menuLoaded = true;

        m_dialog.clearMenu();

        m_menuEditCliente = m_dialog.addMenu(getText(5038, "")); // Editar Cliente
        m_dialog.addMenu("-");

        m_menuShowCobranza = m_dialog.addMenu(getText(1690, "")); // Cobrar
        m_dialog.addMenu("-");

        m_menuFirmar = m_dialog.addMenu(getText(1594, "")); // Firmar
        m_dialog.addMenu("-");

        m_menuShowInfoCli = m_dialog.addMenu(getText(1614, "")); // Ver Info del Cliente

        m_menuAddNote = m_dialog.addMenu(getText(1615, "")); // Agregar Nota

        m_menuShowMensajes = m_dialog.addMenu(getText(1616, "")); // Ver Notas
        m_dialog.addMenu("-");

        m_menuShowAplic = m_dialog.addMenu(getText(1617, "")); // Ver Aplicaciones

        m_menuShowAsiento = m_dialog.addMenu(getText(1692, "")); // Ver Asiento Contable

        m_menuShowDocAux = m_dialog.addMenu(getText(1691, "")); // Ver Documento Asociado
        m_dialog.addMenu("-");

        m_menuGetCae = m_dialog.addMenu(getText(5125, "")); // Obtener CAE

        m_menuUpdateTalonarios = m_dialog.addMenu(getText(5130, "")); // Actualizar Talonarios AFIP

        m_sendCAEByEmail = m_dialog.addMenu(getText(5131, "")); // Enviar Factura Electronica por e-mail
      };

      var showNotes = function() {
        var fcId = m_dialog.getId();
        return DB.getData("load[" + m_apiPath + "ventas/facturaventa/notes]", fcId)
          .successWithResult(D.showNotes);
      };

      var addNote = function() {
        var fvId = m_dialog.getId();
        return D.addNote(D.Types.FACTURA_VENTA, fvId, false);
      };

      var editCliente = function() {
        var cliId = getCliId();
        if(cliId === NO_ID) { return; }
        Cairo.Cliente.Edit.Controller.edit(cliId);
      };

      var signDocument = function() {

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

        vIds = m_dialog.SelectedItems;

        for (i = 0; i <= vIds.Length; i++) {

          fvId = vIds[i];

          if(fvId != NO_ID) {

            if(!DB.getData(CV.FACTURAVENTA, CV.FV_ID, fvId, CV.FV_FIRMADO, firmado)) { return; }
            if(!DB.getData(CV.FACTURAVENTA, CV.FV_ID, fvId, CV.DOC_ID, docId)) { return; }

            if(firmado) {
              if(!Ask(getText(1593, ""), vbYes, getText(1594, ""))) {
                //El documento ya ha sido firmado desea borrar la firma", vbYes, "Firmar
                return;
              }
            }

            bNotShowForm = false;

            if(us_id_firmante != NO_ID) {

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

            m_dialog.sqlstmt = "sp_lsdoc_FacturaVenta";

            m_dialog.RefreshLine(fvId);

            sqlstmt = "select fv_firmado from FacturaVenta where fv_id = "+ fvId.toString();
            if(!Cairo.Database.openRs(sqlstmt, rs)) { return; }
            if(rs.isEOF()) { return; }

            us_id_firmante = Cairo.Database.valField(rs.getFields(), 0);

          }

        }

      };

      var getCAE = function() {

        var i = null;
        var fvId = null;
        var vIds() = null;

        vIds = m_dialog.SelectedItems;

        for (i = 0; i <= vIds.Length; i++) {

          fvId = vIds[i];

          if(fvId != NO_ID) {

            mPublicVentas.self.facturaVentaGetCAE(fvId);
            m_dialog.sqlstmt = "sp_lsdoc_FacturaVenta";
            m_dialog.RefreshLine(fvId);

          }

        }

        updateTalonariosAFIP();

      };

      var updateTalonariosAFIP = function() {

        var sqlstmt = null;
        var rs = null;

        sqlstmt = "sp_FE_UpdateTalonarios";
        if(!Cairo.Database.openRs(sqlstmt, rs)) { return; }
        if(rs.isEOF()) { return; }

        MsgInfo(Cairo.Database.valField(rs.getFields(), "info"));

      };

      var sendCAEByEmail = function() {

        var i = null;
        var fvId = null;
        var vIds() = null;

        vIds = m_dialog.SelectedItems;

        for (i = 0; i <= vIds.Length; i++) {

          fvId = vIds[i];

          if(fvId != NO_ID) {

            mPublicVentas.self.facturaVentaSendCAEByEmail(fvId);

          }

        }

        //  "La solicitud de envio de e-mail se genero con éxito
        MsgInfo(getText(5133, ""));

      };

      var showAsiento = function() {

        var fvId = null;
        fvId = m_dialog.getId();

        if(fvId) {

          var asId = null;
          if(!DB.getData(CV.FACTURAVENTA, CV.FV_ID, fvId, CV.AS_ID, asId)) { return; }

          ShowDocAux(asId, "CSContabilidad2.cAsiento", "CSABMInterface2.cABMGeneric");
        }

      };

      var showDocAux = function() {

        var fvId = null;
        fvId = m_dialog.getId();

        if(fvId) {

          var stId = null;
          if(!DB.getData(CV.FACTURAVENTA, CV.FV_ID, fvId, CV.ST_ID, stId)) { return; }

          if(stId === NO_ID) {

            MsgInfo(getText(1693, ""));
            //Este comprobante no tiene un documento de stock asociado.
          }
          else {

            ShowDocAux(stId, "CSStock2.cStock", "CSABMInterface2.cABMGeneric");
          }
        }

      };
      var showDocAux = function() {
        var fcId = m_dialog.getId();
        if(fcId != NO_ID) {

          D.getStockId(D.Types.TYPE_XXXX, fvId).successWithResult(function(response) {
            D.showDocAux(response.st_id, "Stock");
          });
        }
      };

      var showApply = function() {

        var fvId = null;
        fvId = m_dialog.getId();

        if(fvId === NO_ID) { return; }

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

        total = Cairo.Database.valField(rs.getFields(), CV.FV_TOTAL);
        cotiz = Cairo.Database.valField(rs.getFields(), CV.FV_COTIZACION);
        nroDoc = Cairo.Database.valField(rs.getFields(), CV.FV_NRODOC);
        cliId = Cairo.Database.valField(rs.getFields(), CV.CLI_ID);
        cliente = Cairo.Database.valField(rs.getFields(), CV.CLI_NAME);
        sucId = Cairo.Database.valField(rs.getFields(), CV.SUC_ID);
        docId = Cairo.Database.valField(rs.getFields(), CV.DOC_ID);
        doctId = Cairo.Database.valField(rs.getFields(), CV.DOCT_ID);

        if(!DoCairo.Security.anAccess(csPreVtaModifyAplic, m_docId, csE_DocTypePrestacion.cSEDOCTPREAPLICAR)) { return; }

        if(m_objApply === null) {
          m_objApply = new cFacturaVentaAplic();

          // Edit Apply
          //
        }
        else {
          if(m_objApply.self.getId() != fvId) {
            m_objApply = new cFacturaVentaAplic();
          }
        }

        if(!m_objApply.self.show(fvId, total * (cotiz != 0) ? cotiz : 1), nroDoc, cliId, cliente, sucId, docId, doctId === csEDocumentoTipo.cSEDT_NOTACREDITOVENTA)) {
          m_objApply = null;
        }

      };

      var showCobranza = function() {
        try {

          var o = null;

          o = CSKernelClient2.CreateObject("CSTesoreria2.cCobranza");

          o.ShowCobranza(getCliId(), getFvIds());


        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, "showCobranza", C_MODULE, "");

        }

      };

      var getCliId = function() {


        var fvId = null;
        var cliId = null;

        fvId = m_dialog.getId();
        DB.getData(CV.FACTURAVENTA, CV.FV_ID, fvId, CV.CLI_ID, cliId);

        return cliId;
      };

      var getFvIds = function() {
        return m_dialog.SelectedItems;
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

          // Facturas de Venta
          m_title = getText(1624, "");

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


        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, "Class_Terminate", C_MODULE, "");

        }

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


        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, "Class_Terminate", C_MODULE, "");

        }

      };

      return self;
    };

    Edit.Controller = { getEditor: createObject };

  });

  Cairo.module("FacturaVenta.List", function(List, Cairo, Backbone, Marionette, $, _) {

    var NO_ID = Cairo.Constants.NO_ID;
    var CS = Cairo.Security.Actions.Ventas;
    var DB = Cairo.Database;
    var C_MODULE = "cFacturaVenta";
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

          var editors = Cairo.Editors.facturaVentaEditors || Cairo.Collections.createCollection(null);
          Cairo.Editors.facturaVentaEditors = editors;

          // ListController properties and methods
          //
          self.entityInfo = new Backbone.Model({
            entitiesTitle: "FacturaVenta",
            entityName: "facturaventa",
            entitiesName: "facturaventas"
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
              Cairo.LoadingMessage.show("FacturaVenta", "Loading Factura de Ventas from Crowsoft Cairo server.");

              var editor = Cairo.FacturaVenta.Edit.Controller.getEditor();
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
            if(!Cairo.Security.hasPermissionTo(CS.DELETE_FACTURA)) {
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
              DB.getAPIVersion() + "ventas/facturaventa", id,
              Cairo.Constants.DELETE_FUNCTION, C_MODULE).success(closeDialog, false);
          };

          // progress message
          //
          Cairo.LoadingMessage.show("FacturaVenta", "Loading Factura de Ventas from Crowsoft Cairo server.");

          self.documentList = Cairo.FacturaVentaListDoc.Edit.Controller.getEditor();
          var dialog = Cairo.Dialogs.Views.ListController.newDialogList();

          self.documentList.setListController(self);
          self.documentList.setDialog(dialog);
          self.documentList.list().then(Cairo.LoadingMessage.close);

        };

        createListDialog();
      }
    };
  });

}());