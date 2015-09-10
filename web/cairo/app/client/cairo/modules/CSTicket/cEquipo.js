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

      var C_MODULE = "cEquipoListDoc";

      var C_FECHAINI = "FechaIni";
      var C_FECHAFIN = "FechaFin";

      var C_FILTRARFECHAS = "FiltrarFechas";
      var C_SINASIGNAR = "SinAsignar";
      var C_SOLOENEMPRESA = "SoloEnEmpresa";

      var C_IMG_TASK = 1;


      var K_FECHAINI = 1;
      var K_FECHAFIN = 2;

      var K_PRNS_ID = 200;
      var K_RUB_ID = 3;
      var K_PR_ID = 4;
      var K_US_ID_ASIGNADOR = 5;
      var K_US_ID_RESPONSABLE = 6;
      var K_SIN_ASIGNAR = 7;
      var K_TAREST_ID = 8;
      var K_DEPL_ID = 9;
      var K_FILTRAR_FECHAS = 10;
      var K_CLI_ID = 11;
      var K_CONT_ID = 12;
      var K_SUC_ID = 13;
      var K_PRIO_ID = 14;
      var K_PROY_ID = 15;
      var K_SOLO_EN_EMPRESA = 16;


      var K_EMP_ID = 100;

      var m_bFiltrarFechas;
      var m_bSinAsignar;
      var m_bSoloEnEmpresa;

      var m_fechaIni = null;
      var m_fechaFin = null;

      var m_prns_id = "";
      var m_series = "";

      var m_rub_id = "";
      var m_rubro = "";

      var m_pr_id = "";
      var m_producto = "";

      var m_depl_id = "";
      var m_deposito = "";

      var m_us_id_responsable = "";
      var m_responsable = "";
      var m_us_id_asignador = "";
      var m_asignador = "";
      var m_cont_id = "";
      var m_contacto = "";
      var m_tarest_id = "";
      var m_estado = "";
      var m_prio_id = "";
      var m_prioridad = "";
      var m_proy_id = "";
      var m_proyecto = "";

      var m_cliId = "";
      var m_cliente = "";
      var m_sucId = "";
      var m_sucursal = "";


      var m_empId = "";
      var m_empresa = "";
      var m_fechaIniV = "";
      var m_fechaFinV = "";


      var m_dialog;
      var m_properties;

      var m_listController;

      var m_title = "";

      var m_menuLoaded;

      var m_menuShowFactura = 0;

      var m_menuShowMensajes = 0;
      var m_menuAddNote = 0;
      var m_menuChangePr = 0;
      var m_menuUpdateSerie = 0;
      var m_menuEditSerieH = 0;
      var m_menuParteRep = 0;

      var m_apiPath = DB.getAPIVersion();
      var SAVE_ERROR = getText(2279, ""); // Error al grabar los párametros de navegación de Xxxx

      self.list = function() {
        initialize();
        return load()
          .success(loadCollection);
      };

      self.edit = function(xxId) {
        m_listController.edit(xxId);
      };

      self.deleteItem = function(xxId) {
        return m_listController.destroy(xxId);
      };

      self.showDocDigital = function() {
        var _rtn = null;

        try {

          var xxId = m_dialog.getId();
          if(xxId === NO_ID) { return _rtn; }

          var doc = new Cairo.DocDigital();

          doc.setClientTable(CX.TABLE_NAME_XXXX);
          doc.setClientTableID(xxId);

          _rtn = doc.showDocs(Cairo.Database);

        }
        catch(ex) {
          Cairo.manageErrorEx(ex.message, ex, "showDocDigital", C_MODULE, "");
        }

        return _rtn;
      };

      self.processMenu = function(index) {
        try {

          switch (index) {

            case m_menuShowMensajes:
              showNotes();

              break;

            case m_menuAddNote:
              addNote();

              break;

            case m_menuChangePr:
              pChangePr(getPrnsIds());

              break;

            case m_menuUpdateSerie:
              updateSerie(getPrnsIds());

              break;

            case m_menuEditSerieH:
              editSerieH(getPrnsIds());

              break;

            case m_menuParteRep:
              showParteReparacion();

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

        c = m_properties.add(null, C.DOC_ID);
        c.setType(T.select);
        c.setSelectTable(Cairo.Tables.DOCUMENTO);
        c.setName(getText(1567, "")); // Documentos
        c.setKey(K_DOC_ID);
        c.setValue(m_documento);
        c.setSelectId(val(m_docId));
        c.setSelectIntValue(m_docId);
        c.setSelectFilter(D.FACTURA_COMPRAS_LIST_DOC_FILTER);

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
      var loadCollection = function() {
        var c = null;
        var o = null;
        var value = null;
        var bExists = null;

        var properties = m_dialog.getProperties();
        properties.clear();

        c = properties.add(null, C_FILTRARFECHAS);
        c.setType(Dialogs.PropertyType.check);
        // Filtrar por Fechas
        c.setName(getText(1819, ""));
        c.setKey(K_FILTRAR_FECHAS);
        c.setValue(Cairo.Util.boolToInt(m_bFiltrarFechas));

        c = properties.add(null, C_FECHAINI);
        c.setType(Dialogs.PropertyType.date);
        // Fecha desde
        c.setName(getText(1203, ""));
        c.setKey(K_FECHAINI);
        if(LenB(m_fechaIniV)) {
          c.setValue(m_fechaIniV);
        }
        else {
          c.setValue(m_fechaIni);
        }

        c = properties.add(null, C_FECHAFIN);
        c.setType(Dialogs.PropertyType.date);
        // Fecha hasta
        c.setName(getText(1204, ""));
        c.setKey(K_FECHAFIN);
        if(LenB(m_fechaFinV)) {
          c.setValue(m_fechaFinV);
        }
        else {
          c.setValue(m_fechaFin);
        }

        c = properties.add(null, mTicketConstantes.PRNS_ID);
        c.setType(Dialogs.PropertyType.select);
        c.setSelectTable(Cairo.Tables.PRODUCTOSERIE);
        // Número de Serie
        c.setName(getText(1820, ""));
        c.setKey(K_PRNS_ID);
        value = m_series;
        if(m_prns_id.Substring(0, 1).toUpperCase() === KEY_NODO) {
          value = GetNombreRama(Cairo.Tables.PRODUCTOSERIE, Cairo.Util.val(m_prns_id.Substring(2)), bExists);
          if(!bExists) { m_prns_id = "0"; }
        }
        c.setValue(value);
        c.setSelectId(Cairo.Util.val(m_prns_id));
        c.setSelectIntValue(m_prns_id);

        c = properties.add(null, mTicketConstantes.RUB_ID);
        c.setType(Dialogs.PropertyType.select);
        c.setSelectTable(Cairo.Tables.RUBRO);
        // Rubro
        c.setName(getText(1299, ""));
        c.setKey(K_RUB_ID);
        value = m_rubro;
        if(m_rub_id.Substring(0, 1).toUpperCase() === KEY_NODO) {
          value = GetNombreRama(Cairo.Tables.RUBRO, Cairo.Util.val(m_rub_id.Substring(2)), bExists);
          if(!bExists) { m_rub_id = "0"; }
        }
        c.setValue(value);
        c.setSelectId(Cairo.Util.val(m_rub_id));
        c.setSelectIntValue(m_rub_id);

        c = properties.add(null, mTicketConstantes.PR_ID);
        c.setType(Dialogs.PropertyType.select);
        c.setSelectTable(Cairo.Tables.PRODUCTO);
        // Equipo
        c.setName(getText(1801, ""));
        c.setKey(K_PR_ID);
        value = m_producto;
        if(m_pr_id.Substring(0, 1).toUpperCase() === KEY_NODO) {
          value = GetNombreRama(Cairo.Tables.PRODUCTO, Cairo.Util.val(m_pr_id.Substring(2)), bExists);
          if(!bExists) { m_pr_id = "0"; }
        }
        c.setValue(value);
        c.setSelectId(Cairo.Util.val(m_pr_id));
        c.setSelectIntValue(m_pr_id);

        c = properties.add(null, mTicketConstantes.DEPL_ID);
        c.setType(Dialogs.PropertyType.select);
        c.setSelectTable(Cairo.Tables.DEPOSITOLOGICO);
        // Deposito
        c.setName(getText(1574, ""));
        c.setKey(K_DEPL_ID);
        value = m_deposito;
        if(m_depl_id.Substring(0, 1).toUpperCase() === KEY_NODO) {
          value = GetNombreRama(Cairo.Tables.DEPOSITOLOGICO, Cairo.Util.val(m_depl_id.Substring(2)), bExists);
          if(!bExists) { m_depl_id = "0"; }
        }
        c.setValue(value);
        c.setSelectId(Cairo.Util.val(m_depl_id));
        c.setSelectIntValue(m_depl_id);

        c = properties.add(null, C_SOLOENEMPRESA);
        c.setType(Dialogs.PropertyType.check);
        // Solo en la Empresa
        c.setName(getText(1821, ""));
        c.setKey(K_SOLO_EN_EMPRESA);
        c.setValue(Cairo.Util.boolToInt(m_bSoloEnEmpresa));

        c = m_dialog.getProperties().add(null, mTicketConstantes.PROY_ID);
        c.setType(Dialogs.PropertyType.select);
        c.setSelectTable(csETablesTask.cSPROYECTO);
        // Proyecto
        c.setName(getText(1658, ""));
        c.setKey(K_PROY_ID);
        value = m_proyecto;
        if(m_proy_id.Substring(0, 1).toUpperCase() === KEY_NODO) {
          value = GetNombreRama(csETablesTask.cSPROYECTO, Cairo.Util.val(m_proy_id.Substring(2)), bExists);
          if(!bExists) { m_proy_id = "0"; }
        }
        c.setValue(value);
        c.setSelectId(Cairo.Util.val(m_proy_id));
        c.setSelectIntValue(m_proy_id);

        c = m_dialog.getProperties().add(null, mTicketConstantes.US_ID_RESPONSABLE);
        c.setType(Dialogs.PropertyType.select);
        c.setSelectTable(csUsuario);
        // Responsable
        c.setName(getText(1822, ""));
        c.setKey(K_US_ID_RESPONSABLE);
        value = m_responsable;
        if(m_us_id_responsable.Substring(0, 1).toUpperCase() === KEY_NODO) {
          value = GetNombreRama(csUsuario, Cairo.Util.val(m_us_id_responsable.Substring(2)), bExists);
          if(!bExists) { m_us_id_responsable = "0"; }
        }
        c.setValue(value);
        c.setSelectId(Cairo.Util.val(m_us_id_responsable));
        c.setSelectIntValue(m_us_id_responsable);

        c = properties.add(null, C_SINASIGNAR);
        c.setType(Dialogs.PropertyType.check);
        // Sin Asignar
        c.setName(getText(1823, ""));
        c.setKey(K_SIN_ASIGNAR);
        c.setValue(Cairo.Util.boolToInt(m_bSinAsignar));

        c = m_dialog.getProperties().add(null, mTicketConstantes.US_ID_ASIGNADOR);
        c.setType(Dialogs.PropertyType.select);
        c.setSelectTable(csUsuario);
        // Asignada por
        c.setName(getText(1824, ""));
        c.setKey(K_US_ID_ASIGNADOR);
        value = m_asignador;
        if(m_us_id_asignador.Substring(0, 1).toUpperCase() === KEY_NODO) {
          value = GetNombreRama(csUsuario, Cairo.Util.val(m_us_id_asignador.Substring(2)), bExists);
          if(!bExists) { m_us_id_asignador = "0"; }
        }
        c.setValue(value);
        c.setSelectId(Cairo.Util.val(m_us_id_asignador));
        c.setSelectIntValue(m_us_id_asignador);

        c = m_dialog.getProperties().add(null, mTicketConstantes.CONT_ID);
        c.setType(Dialogs.PropertyType.select);
        c.setSelectTable(csETablesTask.cSCONTACTO);
        // Contacto
        c.setName(getText(1035, ""));
        c.setKey(K_CONT_ID);
        value = m_contacto;
        if(m_cont_id.Substring(0, 1).toUpperCase() === KEY_NODO) {
          value = GetNombreRama(csETablesTask.cSCONTACTO, Cairo.Util.val(m_cont_id.Substring(2)), bExists);
          if(!bExists) { m_cont_id = "0"; }
        }
        c.setValue(value);
        c.setSelectId(Cairo.Util.val(m_cont_id));
        c.setSelectIntValue(m_cont_id);

        c = m_dialog.getProperties().add(null, mTicketConstantes.TAREST_ID);
        c.setType(Dialogs.PropertyType.select);
        c.setSelectTable(csETablesTask.cSTAREAESTADO);
        // Estado
        c.setName(getText(1568, ""));
        c.setKey(K_TAREST_ID);
        value = m_estado;
        if(m_tarest_id.Substring(0, 1).toUpperCase() === KEY_NODO) {
          value = GetNombreRama(csETablesTask.cSTAREAESTADO, Cairo.Util.val(m_tarest_id.Substring(2)), bExists);
          if(!bExists) { m_tarest_id = "0"; }
        }
        c.setValue(value);
        c.setSelectId(Cairo.Util.val(m_tarest_id));
        c.setSelectIntValue(m_tarest_id);

        c = m_dialog.getProperties().add(null, mTicketConstantes.PRIO_ID);
        c.setType(Dialogs.PropertyType.select);
        c.setSelectTable(csETablesTask.cSPRIORIDAD);
        // Prioridad
        c.setName(getText(1825, ""));
        c.setKey(K_PRIO_ID);

        value = m_prioridad;
        if(m_prio_id.Substring(0, 1).toUpperCase() === KEY_NODO) {
          value = GetNombreRama(csETablesTask.cSPRIORIDAD, Cairo.Util.val(m_prio_id.Substring(2)), bExists);
          if(!bExists) { m_prio_id = "0"; }
        }
        c.setValue(value);
        c.setSelectId(Cairo.Util.val(m_prio_id));
        c.setSelectIntValue(m_prio_id);

        c = properties.add(null, mTicketConstantes.CLI_ID);
        c.setType(Dialogs.PropertyType.select);
        c.setSelectTable(Cairo.Tables.CLIENTE);
        // Cliente
        c.setName(getText(1150, ""));
        c.setKey(K_CLI_ID);
        value = m_cliente;
        if(m_cliId.Substring(0, 1).toUpperCase() === KEY_NODO) {
          value = GetNombreRama(Cairo.Tables.CLIENTE, Cairo.Util.val(m_cliId.Substring(2)), bExists);
          if(!bExists) { m_cliId = "0"; }
        }
        c.setValue(value);
        c.setSelectId(Cairo.Util.val(m_cliId));
        c.setSelectIntValue(m_cliId);

        c = properties.add(null, mTicketConstantes.SUC_ID);
        c.setType(Dialogs.PropertyType.select);
        c.setSelectTable(Cairo.Tables.SUCURSAL);
        // Sucursal
        c.setName(getText(1281, ""));
        c.setKey(K_SUC_ID);
        value = m_sucursal;
        if(m_sucId.Substring(0, 1).toUpperCase() === KEY_NODO) {
          value = GetNombreRama(Cairo.Tables.SUCURSAL, Cairo.Util.val(m_sucId.Substring(2)), bExists);
          if(!bExists) { m_sucId = "0"; }
        }
        c.setValue(value);
        c.setSelectId(Cairo.Util.val(m_sucId));
        c.setSelectIntValue(m_sucId);


        c = properties.add(null, C.EMP_ID);
        c.setType(Dialogs.PropertyType.select);
        c.setSelectTable(Cairo.Tables.EMPRESA);
        // Empresa
        c.setName(getText(1114, ""));
        c.setKey(K_EMP_ID);
        value = m_empresa;
        if(m_empId.Substring(0, 1).toUpperCase() === KEY_NODO) {
          value = GetNombreRama(Cairo.Tables.EMPRESA, Cairo.Util.val(m_empId.Substring(2)), bExists);
          if(!bExists) { m_empId = "0"; }
        }
        c.setValue(value);
        c.setSelectId(Cairo.Util.val(m_empId));
        c.setSelectIntValue(m_empId);

        createMenu();
        if(!m_dialog.showDocumentList(self)) { return false; }

        return true;
      };

      var refreshCollection = function() {
        return m_dialog.showValues(m_properties);
      };

      var load = function() {

        return DB.getData("load[" + m_apiPath + "general/equipolistdoc]", id).then(
          function(response) {


            m_empId = Cairo.Company.getId();
            m_empresa = Cairo.Company.getName();

            if(response.success !== true) { return false; }

            if(response.data.id === NO_ID) {

              m_fechaIniV = "";
              m_fechaIni = Cairo.Dates.today();
              m_fechaFinV = "";
              m_fechaFin = Cairo.Dates.DateNames.getDateByName('h-60');

              m_bFiltrarFechas = false;
              m_bSinAsignar = true;
              m_bSoloEnEmpresa = true;
              m_prns_id = NO_ID;
              m_rub_id = NO_ID;
              m_pr_id = NO_ID;
              m_depl_id = NO_ID;
              m_series = "";
              m_rubro = "";
              m_producto = "";
              m_deposito = "";
              m_cliId = NO_ID;
              m_cliente = "";
              m_sucId = NO_ID;
              m_sucursal = "";
              m_us_id_responsable = NO_ID;
              m_us_id_asignador = NO_ID;
              m_cont_id = NO_ID;
              m_tarest_id = NO_ID;
              m_prio_id = NO_ID;
              m_proy_id = NO_ID;
              m_estado = "";
              m_responsable = "";
              m_asignador = "";
              m_contacto = "";
              m_prioridad = "";
              m_proyecto = "";

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

        var properties = m_dialog.getProperties();

        switch (key) {

          case K_FILTRAR_FECHAS:
            m_bFiltrarFechas = Cairo.Util.val(properties.item(C_FILTRARFECHAS).getValue());

            break;

          case K_SIN_ASIGNAR:
            m_bSinAsignar = Cairo.Util.val(properties.item(C_SINASIGNAR).getValue());

            break;

          case K_SOLO_EN_EMPRESA:
            m_bSoloEnEmpresa = Cairo.Util.val(properties.item(C_SOLOENEMPRESA).getValue());

            break;

          case K_FECHAINI:

            iProp = properties.item(C_FECHAINI);

            if(LenB(iProp.getSelectIntValue())) {
              m_fechaIniV = iProp.getSelectIntValue();
              m_fechaIni = Cairo.Dates.DateNames.getDateByName(m_fechaIniV);
            }
            else if(isDate(iProp.getValue())) {
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

            if(LenB(iProp.getSelectIntValue())) {
              m_fechaFinV = iProp.getSelectIntValue();
              m_fechaFin = Cairo.Dates.DateNames.getDateByName(m_fechaFinV);
            }
            else if(isDate(iProp.getValue())) {
              m_fechaFinV = "";
              m_fechaFin = iProp.getValue();
            }
            else {
              m_fechaFinV = "";
              iProp.setValue(m_fechaFin);
            }

            break;

          case K_PRNS_ID:
            var property = properties.item(mTicketConstantes.PRNS_ID);
            m_series = property.getValue();
            m_prns_id = property.getSelectIntValue();

            break;

          case K_RUB_ID:
            var property = properties.item(mTicketConstantes.RUB_ID);
            m_rubro = property.getValue();
            m_rub_id = property.getSelectIntValue();

            break;

          case K_PR_ID:
            var property = properties.item(mTicketConstantes.PR_ID);
            m_producto = property.getValue();
            m_pr_id = property.getSelectIntValue();

            break;

          case K_DEPL_ID:
            var property = properties.item(mTicketConstantes.DEPL_ID);
            m_deposito = property.getValue();
            m_depl_id = property.getSelectIntValue();

            break;

          case K_CLI_ID:
            var property = properties.item(mTicketConstantes.CLI_ID);
            m_cliente = property.getValue();
            m_cliId = property.getSelectIntValue();

            break;

          case K_SUC_ID:
            var property = properties.item(mTicketConstantes.SUC_ID);
            m_sucursal = property.getValue();
            m_sucId = property.getSelectIntValue();

            break;

          case K_US_ID_RESPONSABLE:
            var property = properties.item(mTicketConstantes.US_ID_RESPONSABLE);
            m_responsable = property.getValue();
            m_us_id_responsable = property.getSelectIntValue();

            break;

          case K_US_ID_ASIGNADOR:
            var property = properties.item(mTicketConstantes.US_ID_ASIGNADOR);
            m_asignador = property.getValue();
            m_us_id_asignador = property.getSelectIntValue();

            break;

          case K_CONT_ID:
            var property = properties.item(mTicketConstantes.CONT_ID);
            m_contacto = property.getValue();
            m_cont_id = property.getSelectIntValue();

            break;

          case K_TAREST_ID:
            var property = properties.item(mTicketConstantes.TAREST_ID);
            m_estado = property.getValue();
            m_tarest_id = property.getSelectIntValue();

            break;

          case K_PRIO_ID:
            var property = properties.item(mTicketConstantes.PRIO_ID);
            m_prioridad = property.getValue();
            m_prio_id = property.getSelectIntValue();

            break;

          case K_PROY_ID:
            var property = properties.item(mTicketConstantes.PROY_ID);
            m_proyecto = property.getValue();
            m_proy_id = property.getSelectIntValue();


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
          provId: m_provId,
          estId: m_estId,
          ccosId: m_ccosId,
          sucId: m_sucId,
          docId: m_docId,
          cpgId: m_cpgId,
          empId: m_empId
        };

        return DB.getData("load[" + m_apiPath + "compras/facturacompras]", null, params);
      };
      var cIABMListDocClient_Refresh = function() {
        var sqlstmt = null;

        sqlstmt = "sp_lsdoc_productoseries ";

        sqlstmt = sqlstmt+ Cairo.Database.getUserId().toString()+ ",";

        sqlstmt = sqlstmt+ Integer.parseInt(m_bFiltrarFechas)+ ",";
        sqlstmt = sqlstmt+ Integer.parseInt(m_bSinAsignar)+ ",";

        if(!cDate.getDateNames(m_fechaIniV) === null) {
          sqlstmt = sqlstmt+ Cairo.Database.sqlDate(Cairo.Dates.DateNames.getDateByName(m_fechaIniV))+ ",";
        }
        else {
          sqlstmt = sqlstmt+ Cairo.Database.sqlDate(m_fechaIni)+ ",";
        }

        if(!cDate.getDateNames(m_fechaFinV) === null) {
          sqlstmt = sqlstmt+ Cairo.Database.sqlDate(Cairo.Dates.DateNames.getDateByName(m_fechaFinV))+ ",";
        }
        else {
          sqlstmt = sqlstmt+ Cairo.Database.sqlDate(m_fechaFin)+ ",";
        }

        sqlstmt = sqlstmt+ Cairo.Database.sqlString(m_prns_id)+ ",";
        sqlstmt = sqlstmt+ Cairo.Database.sqlString(m_rub_id)+ ",";
        sqlstmt = sqlstmt+ Cairo.Database.sqlString(m_pr_id)+ ",";
        sqlstmt = sqlstmt+ Cairo.Database.sqlString(m_depl_id)+ ",";

        sqlstmt = sqlstmt+ Cairo.Database.sqlString(m_cliId)+ ",";
        sqlstmt = sqlstmt+ Cairo.Database.sqlString(m_sucId)+ ",";

        sqlstmt = sqlstmt+ Cairo.Database.sqlString(m_us_id_responsable)+ ",";
        sqlstmt = sqlstmt+ Cairo.Database.sqlString(m_us_id_asignador)+ ",";
        sqlstmt = sqlstmt+ Cairo.Database.sqlString(m_cont_id)+ ",";
        sqlstmt = sqlstmt+ Cairo.Database.sqlString(m_tarest_id)+ ",";
        sqlstmt = sqlstmt+ Cairo.Database.sqlString(m_prio_id)+ ",";
        sqlstmt = sqlstmt+ Cairo.Database.sqlString(m_proy_id)+ ",";

        sqlstmt = sqlstmt+ Integer.parseInt(m_bSoloEnEmpresa)+ ",";

        sqlstmt = sqlstmt+ Cairo.Database.sqlString(m_empId);

        return sqlstmt;
      };

      self.save = function() {

        var register = new DB.Register();
        var fields = register.getFields();

        register.setFieldId(C.LDP_ID);
        register.setTable(C.LISTA_DOCUMENTO_PARAMETRO);

        var apiPath = DB.getAPIVersion();
        register.setPath(apiPath + "compras/facturacompras");

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

            case K_PROV_ID:
              fields.add(C.PROV_ID, property.getSelectIntValue(), Types.text);
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

      var cIABMListDocClient_Save = function() {

        var strError = null;

        strError = getText(2279, "");
        //Error al grabar los párametros de navegación de Listado de Equipos

        var register = null;
        register = new cRegister();

        var sqlstmt = null;

        sqlstmt = "delete ListaDocumentoParametro where pre_id = "+ csPreTicketPrestacion.cSPRETICKLISTORDENSERV.toString()+ " and us_id = "+ m_us_id+ " and (emp_id is null or emp_id = "+ cUtil.getEmpId().toString()+ ")";

        if(!Cairo.Database.execute(sqlstmt, "cIABMClient_Save", C_MODULE, strError)) { return false; }

        register.setTable(Cairo.Constants.LISTADOCUMENTOPARAMETRO);
        register.setUtilizaIdentity(true);

        var property = null;
        var _count = m_dialog.getProperties().size();
        for (var _i = 0; _i < _count; _i++) {
          property = m_dialog.getProperties().item(_i);

          register.getFields().clear();

          switch (property.getKey()) {

            case K_FILTRAR_FECHAS:
              register.getFields().add2(Cairo.Constants.LDP_VALOR, Cairo.Util.val(property.getValue()), Cairo.Constants.Types.text);
              register.getFields().add2(Cairo.Constants.LDP_ORDEN, 10, Cairo.Constants.Types.integer);
              register.getFields().add2(Cairo.Constants.LDP_ID, K_FILTRAR_FECHAS, Cairo.Constants.Types.integer);

              break;

            case K_SIN_ASIGNAR:
              register.getFields().add2(Cairo.Constants.LDP_VALOR, Cairo.Util.val(property.getValue()), Cairo.Constants.Types.text);
              register.getFields().add2(Cairo.Constants.LDP_ORDEN, 10, Cairo.Constants.Types.integer);
              register.getFields().add2(Cairo.Constants.LDP_ID, K_SIN_ASIGNAR, Cairo.Constants.Types.integer);

              break;

            case K_SOLO_EN_EMPRESA:
              register.getFields().add2(Cairo.Constants.LDP_VALOR, Cairo.Util.val(property.getValue()), Cairo.Constants.Types.text);
              register.getFields().add2(Cairo.Constants.LDP_ORDEN, 10, Cairo.Constants.Types.integer);
              register.getFields().add2(Cairo.Constants.LDP_ID, K_SOLO_EN_EMPRESA, Cairo.Constants.Types.integer);

              break;

            case K_FECHAINI:
              if(property.getSelectIntValue() !== "") {
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

            case K_PRNS_ID:
              register.getFields().add2(Cairo.Constants.LDP_VALOR, property.getSelectIntValue(), Cairo.Constants.Types.text);
              register.getFields().add2(Cairo.Constants.LDP_ORDEN, 40, Cairo.Constants.Types.integer);
              register.getFields().add2(Cairo.Constants.LDP_ID, K_PRNS_ID, Cairo.Constants.Types.integer);

              break;

            case K_RUB_ID:
              register.getFields().add2(Cairo.Constants.LDP_VALOR, property.getSelectIntValue(), Cairo.Constants.Types.text);
              register.getFields().add2(Cairo.Constants.LDP_ORDEN, 40, Cairo.Constants.Types.integer);
              register.getFields().add2(Cairo.Constants.LDP_ID, K_RUB_ID, Cairo.Constants.Types.integer);

              break;

            case K_PR_ID:
              register.getFields().add2(Cairo.Constants.LDP_VALOR, property.getSelectIntValue(), Cairo.Constants.Types.text);
              register.getFields().add2(Cairo.Constants.LDP_ORDEN, 40, Cairo.Constants.Types.integer);
              register.getFields().add2(Cairo.Constants.LDP_ID, K_PR_ID, Cairo.Constants.Types.integer);

              break;

            case K_DEPL_ID:
              register.getFields().add2(Cairo.Constants.LDP_VALOR, property.getSelectIntValue(), Cairo.Constants.Types.text);
              register.getFields().add2(Cairo.Constants.LDP_ORDEN, 40, Cairo.Constants.Types.integer);
              register.getFields().add2(Cairo.Constants.LDP_ID, K_DEPL_ID, Cairo.Constants.Types.integer);

              break;

            case K_CLI_ID:
              register.getFields().add2(Cairo.Constants.LDP_VALOR, property.getSelectIntValue(), Cairo.Constants.Types.text);
              register.getFields().add2(Cairo.Constants.LDP_ORDEN, 40, Cairo.Constants.Types.integer);
              register.getFields().add2(Cairo.Constants.LDP_ID, K_CLI_ID, Cairo.Constants.Types.integer);

              break;

            case K_SUC_ID:
              register.getFields().add2(Cairo.Constants.LDP_VALOR, property.getSelectIntValue(), Cairo.Constants.Types.text);
              register.getFields().add2(Cairo.Constants.LDP_ORDEN, 70, Cairo.Constants.Types.integer);
              register.getFields().add2(Cairo.Constants.LDP_ID, K_SUC_ID, Cairo.Constants.Types.integer);

              break;

            case K_US_ID_RESPONSABLE:
              register.getFields().add2(Cairo.Constants.LDP_VALOR, property.getSelectIntValue(), Cairo.Constants.Types.text);
              register.getFields().add2(Cairo.Constants.LDP_ORDEN, 60, Cairo.Constants.Types.integer);
              register.getFields().add2(Cairo.Constants.LDP_ID, K_US_ID_RESPONSABLE, Cairo.Constants.Types.integer);

              break;

            case K_US_ID_ASIGNADOR:
              register.getFields().add2(Cairo.Constants.LDP_VALOR, property.getSelectIntValue(), Cairo.Constants.Types.text);
              register.getFields().add2(Cairo.Constants.LDP_ORDEN, 70, Cairo.Constants.Types.integer);
              register.getFields().add2(Cairo.Constants.LDP_ID, K_US_ID_ASIGNADOR, Cairo.Constants.Types.integer);

              break;

            case K_CONT_ID:
              register.getFields().add2(Cairo.Constants.LDP_VALOR, property.getSelectIntValue(), Cairo.Constants.Types.text);
              register.getFields().add2(Cairo.Constants.LDP_ORDEN, 80, Cairo.Constants.Types.integer);
              register.getFields().add2(Cairo.Constants.LDP_ID, K_CONT_ID, Cairo.Constants.Types.integer);

              break;

            case K_TAREST_ID:
              register.getFields().add2(Cairo.Constants.LDP_VALOR, property.getSelectIntValue(), Cairo.Constants.Types.text);
              register.getFields().add2(Cairo.Constants.LDP_ORDEN, 90, Cairo.Constants.Types.integer);
              register.getFields().add2(Cairo.Constants.LDP_ID, K_TAREST_ID, Cairo.Constants.Types.integer);

              break;

            case K_PRIO_ID:
              register.getFields().add2(Cairo.Constants.LDP_VALOR, property.getSelectIntValue(), Cairo.Constants.Types.text);
              register.getFields().add2(Cairo.Constants.LDP_ORDEN, 100, Cairo.Constants.Types.integer);
              register.getFields().add2(Cairo.Constants.LDP_ID, K_PRIO_ID, Cairo.Constants.Types.integer);

              break;

            case K_PROY_ID:
              register.getFields().add2(Cairo.Constants.LDP_VALOR, property.getSelectIntValue(), Cairo.Constants.Types.text);
              register.getFields().add2(Cairo.Constants.LDP_ORDEN, 110, Cairo.Constants.Types.integer);
              register.getFields().add2(Cairo.Constants.LDP_ID, K_PROY_ID, Cairo.Constants.Types.integer);


              break;

            case K_EMP_ID:
              register.getFields().add2(Cairo.Constants.LDP_VALOR, property.getSelectIntValue(), Cairo.Constants.Types.text);
              register.getFields().add2(Cairo.Constants.LDP_ORDEN, 100, Cairo.Constants.Types.integer);
              register.getFields().add2(Cairo.Constants.LDP_ID, K_EMP_ID, Cairo.Constants.Types.integer);

              break;
          }


          register.getFields().add2(C.EMP_ID, cUtil.getEmpId(), Cairo.Constants.Types.id);

          register.getFields().add2(Cairo.Constants.US_ID, m_us_id, Cairo.Constants.Types.id);
          register.getFields().add2(Cairo.Constants.PRE_ID, csPreTicketPrestacion.cSPRETICKLISTORDENSERV, Cairo.Constants.Types.id);

          register.getFields().setHaveLastUpdate(false);
          register.getFields().setHaveWhoModify(false);
          if(!Cairo.Database.save(register, , "cIABMClient_Save", C_MODULE, strError)) { return false; }
        }

        if(!load(m_us_id)) { return false; }

        return true;
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

          // Ordenes de Servicio
          m_title = getText(1830, "");

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

          var elem = m_properties.add(null, "Observaciones");
          elem.setName("Observaciones");
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

      var createMenu = function() {


        if(m_menuLoaded) { return; }

        m_menuLoaded = true;

        m_objList.ObjClientMenu = self;
        m_objList.ClearMenu;
        // Cambiar el Articulo Asociado al Nro. de Serie
        m_menuChangePr = m_objList.addMenu(getText(3916, ""));
        // Editar el número de serie anterior
        m_menuEditSerieH = m_objList.addMenu(getText(3949, ""));
        // Modificar el número de serie
        m_menuUpdateSerie = m_objList.addMenu(getText(3933, ""));
        // Editar parte de reparación
        m_menuParteRep = m_objList.addMenu(getText(3963, ""));
        m_objList.addMenu("-");
        // Agregar Nota
        m_menuAddNote = m_objList.addMenu(getText(1615, ""));
        // Ver Notas
        m_menuShowMensajes = m_objList.addMenu(getText(1616, ""));
      };

      var pChangePr = function(vIds) { // TODO: Use of ByRef founded Private Sub pChangePr(ByRef vIds() As Long)
        var prns_id = null;
        var i = null;

        var mouse = null;
        mouse = new cMouse();
        mouse.mouseDefault();

        if(vIds.Length < 0) {
          //  Debe seleccionar al menos un equipo
          MsgWarning(getText(3917, ""));
          return;
        }

        var help = null;
        var hr = null;

        help = new CSOAPI2.cHelp();

        help.setIsSearch(true);

        hr = help.show(null, 31, "", "", "", , "pr_llevanroserie <> 0"+ c_filter_is_for_producto_serie, , , false);

        if(hr.getCancel()) { return; }

        var sqlstmt = null;

        m_objList.sqlstmt = "sp_lsdoc_ProductoSerie";

        for (i = 0; i <= vIds.Length; i++) {

          //  Indica que se deben cambiar los precios
          sqlstmt = "sp_ProductoNumeroSerieChangeProducto "+ vIds(i)+ ","+ hr.getId()+ ",1";

          if(!Cairo.Database.execute(sqlstmt)) { return; }

          m_objList.RefreshLine(vIds(i));

        }

      };

      var updateSerie = function(vIds) { // TODO: Use of ByRef founded Private Sub updateSerie(ByRef vIds() As Long)
        var prns_id = null;
        var i = null;

        var mouse = null;
        mouse = new cMouse();
        mouse.mouseDefault();

        if(vIds.Length < 0) {
          //  Debe seleccionar al menos un equipo
          MsgWarning(getText(3917, ""));
          return;
        }

        var help = null;
        var hr = null;

        help = new CSOAPI2.cHelp();

        help.setIsSearch(true);

        hr = help.show(null, 31, "", "", "", , "pr_llevanroserie <> 0"+ c_filter_is_for_producto_serie, , , false);

        if(hr.getCancel()) { return; }

        var sqlstmt = null;

        m_objList.sqlstmt = "sp_lsdoc_ProductoSerie";

        for (i = 0; i <= vIds.Length; i++) {

        }

      };

      var editSerieH = function(vIds) { // TODO: Use of ByRef founded Private Sub editSerieH(ByRef vIds() As Long)
        var prns_id = null;
        var i = null;

        var mouse = null;
        mouse = new cMouse();
        mouse.mouseDefault();

        if(vIds.Length < 0) {
          //  Debe seleccionar al menos un equipo
          MsgWarning(getText(3917, ""));
          return;
        }

        m_objList.sqlstmt = "sp_lsdoc_ProductoSerie";

        var f = null;

        f = new fEditSerieH();

        for (i = 0; i <= vIds.Length; i++) {

          f.self.showForm(getPrnsCodigo(vIds(i)));

          if(f.self.getCancel()) { break; }

          // Sino eligio omitir modificamos
          //
          if(f.self.getOk()) {

            updateNroSerie(Cairo.Util.val(f.cHelpSerie.cOrdenServicioAplic.self.getId()));

          }

          pUnload(f);

        }

      };

      var pUnload = function(f) { // TODO: Use of ByRef founded Private Sub pUnload(ByRef F As Form)

        Unload(f);
      };

      var getPrnsCodigo = function(prns_id) {
        var sqlstmt = null;
        var rs = null;

        rs = new ADODB.Recordset();
        sqlstmt = "select prns_codigo from ProductoNumeroSerie where prns_id = "+ prns_id.toString();
        if(!Cairo.Database.openRs(sqlstmt, rs)) { return ""; }
        if(rs.isEOF()) { return ""; }
        return Cairo.Database.valField(rs.getFields(), mTicketConstantes.PRNS_CODE);
      };

      var getPrnsIds = function() {
        return m_dialog.getIds();
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

      var updateNroSerie = function(prnsId) {
        var sqlstmt = null;
        sqlstmt = "update ProductoNumeroSerie set prns_id_historia = "+ prnsId.toString()+ " where prns_id = "+ prnsId.toString();
        Cairo.Database.execute(sqlstmt);
      };

      var showParteReparacion = function() {
        var prnsId = null;

        var objEdit = null;
        objEdit = new cParteReparacion();

        var vIds(0) = null;

        prnsId = m_dialog.getId();
        vIds[0] = prnsId;

        objEdit.self.showParteReparacion(getClidFromPrnsId(prnsId), vIds[]);
      };

      var getClidFromPrnsId = function(prnsId) {
        var sqlstmt = null;
        sqlstmt = "select cli_id from ProductoNumeroSerie";
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

        createListDialog();
      }
    };
  });

}());