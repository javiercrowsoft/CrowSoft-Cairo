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

      var C_MODULE = "cHoraListDoc";

      var K_FECHADESDE = 1;
      var K_FECHAHASTA = 2;
      var K_PROYECTO = 4;
      var K_PROYECTOITEM = 5;
      var K_OBJETIVO = 6;
      var K_USUARIO = 7;
      var K_TAREA = 8;
      var K_DESCRIP = 9;
      var K_TITULO = 10;
      var K_CLIENTE = 11;

      // Seudo - Variables
      var c_strLoad = "";
      var c_ErrorSave = "";

      var m_fechaDesdeV = "";
      var m_fechaHastaV = "";

      var m_fechaIni = null;
      var m_fechaFin = null;

      var m_proyecto = "";
      var m_proyectoItem = "";
      var m_objetivo = "";
      var m_cliente = "";
      var m_usuario = "";
      var m_tarea = "";

      var m_proy_id = "";
      var m_proyi_id = "";
      var m_obje_id = "";
      var m_cliId = "";
      var m_us_id2 = "";
      var m_tar_id = "";
      var m_descrip = "";
      var m_titulo = "";

      var m_menuLoaded;
      var m_menuShowFactura = 0;

      var m_menuShowMensajes = 0;
      var m_menuShowInfoCli = 0;
      var m_menuAddNote = 0;
      var m_menuFirmar = 0;

      //OJO HASTA ACA
      var m_dialog;
      var m_properties;

      var m_listController;

      var m_apiPath = DB.getAPIVersion();
      var SAVE_ERROR = getText(2179, ""); // Error al grabar los párametros de navegación de Xxxx

      self.list = function() {
        initialize();
        return load()
          .whenSuccess(loadCollection);
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

            case m_menuShowFactura:
              showFactura();

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
          }

        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, ex, "ProcessMenu", C_MODULE, "");

        }

      };

      //-------------------------------------------------------------------------------------
      // Interfaz cliente de List de documentos

      self.getAplication = function() {
        return Cairo.Application.getName();
      };

      self.getProperties = function() {
        return m_properties;
      };

      self.propertyChange = function(key) {
        var iProp = null;

        switch (key) {

          case K_FECHADESDE:
            iProp = m_dialog.getProperties().item(mTareaConstantes.HORA_DESDE);

            if(LenB(iProp.getSelectIntValue())) {
              m_fechaDesdeV = iProp.getSelectIntValue();
              m_fechaIni = Cairo.Dates.DateNames.getDateByName(m_fechaDesdeV);
            }
            else if(isDate(iProp.getValue())) {
              m_fechaDesdeV = "";
              m_fechaIni = iProp.getValue();
            }
            else {
              m_fechaDesdeV = "";
              iProp.setValue(m_fechaIni);
            }

            break;

          case K_FECHAHASTA:

            iProp = m_dialog.getProperties().item(mTareaConstantes.HORA_HASTA);

            if(LenB(iProp.getSelectIntValue())) {
              m_fechaHastaV = iProp.getSelectIntValue();
              m_fechaFin = Cairo.Dates.DateNames.getDateByName(m_fechaHastaV);
            }
            else if(isDate(iProp.getValue())) {
              m_fechaHastaV = "";
              m_fechaFin = iProp.getValue();
            }
            else {
              m_fechaHastaV = "";
              iProp.setValue(m_fechaFin);
            }

            break;

          case K_PROYECTO:
            m_proy_id = m_dialog.getProperties().item(mTareaConstantes.PROY_ID).getSelectIntValue();

            break;

          case K_PROYECTOITEM:
            m_proyi_id = m_dialog.getProperties().item(mTareaConstantes.PROY_IID).getSelectIntValue();

            break;

          case K_OBJETIVO:
            m_obje_id = m_dialog.getProperties().item(mTareaConstantes.OBJE_ID).getSelectIntValue();

            break;

          case K_CLIENTE:
            m_cliId = m_dialog.getProperties().item(mTareaConstantes.CLI_ID).getSelectIntValue();

            break;

          case K_USUARIO:
            m_us_id2 = m_dialog.getProperties().item(Cairo.Constants.US_ID).getSelectIntValue();

            break;

          case K_TAREA:
            m_tar_id = m_dialog.getProperties().item(mTareaConstantes.TAR_ID).getSelectIntValue();

            break;

          case K_DESCRIP:
            m_descrip = m_dialog.getProperties().item(mTareaConstantes.HORA_DESCRIP).getValue();

            break;

          case K_TITULO:
            m_titulo = m_dialog.getProperties().item(mTareaConstantes.HORA_TITULO).getValue();

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

        sqlstmt = "sp_lsdoc_Horas ";

        sqlstmt = sqlstmt+ Cairo.Database.getUserId().toString()+ ",";

        if(!cDate.getDateNames(m_fechaDesdeV) === null) {
          sqlstmt = sqlstmt+ Cairo.Database.sqlDate(Cairo.Dates.DateNames.getDateByName(m_fechaDesdeV))+ ",";
        }
        else {
          sqlstmt = sqlstmt+ Cairo.Database.sqlDate(m_fechaIni)+ ",";
        }

        if(!cDate.getDateNames(m_fechaHastaV) === null) {
          sqlstmt = sqlstmt+ Cairo.Database.sqlDate(Cairo.Dates.DateNames.getDateByName(m_fechaHastaV))+ ",";
        }
        else {
          sqlstmt = sqlstmt+ Cairo.Database.sqlDate(m_fechaFin)+ ",";
        }

        sqlstmt = sqlstmt+ Cairo.Database.sqlString(m_cliId)+ ",";
        sqlstmt = sqlstmt+ Cairo.Database.sqlString(m_proy_id)+ ",";
        sqlstmt = sqlstmt+ Cairo.Database.sqlString(m_proyi_id)+ ",";
        sqlstmt = sqlstmt+ Cairo.Database.sqlString(m_obje_id)+ ",";
        sqlstmt = sqlstmt+ Cairo.Database.sqlString(m_tar_id)+ ",";
        sqlstmt = sqlstmt+ Cairo.Database.sqlString(m_us_id2)+ ",";
        sqlstmt = sqlstmt+ Cairo.Database.sqlString(m_descrip)+ ",";
        sqlstmt = sqlstmt+ Cairo.Database.sqlString(m_titulo);

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
        for(var _i = 0; _i < _count; _i++) {

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
        var register = null;
        register = new cRegister();

        var sqlstmt = null;
        sqlstmt = "delete ListaDocumentoParametro  where pre_id = "+ csTareaPrestacion.cSPRETAREALISTHORA.toString()+ " and us_id = "+ m_us_id;

        if(!Cairo.Database.execute(sqlstmt, "cIABMClient_Save", C_MODULE, c_ErrorSave)) { return false; }

        register.setTable(Cairo.Constants.LISTADOCUMENTOPARAMETRO);
        register.setUtilizaIdentity(true);

        var property = null;
        var _count = m_dialog.getProperties().size();
        for(var _i = 0; _i < _count; _i++) {
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

            case K_PROYECTO:
              register.getFields().add2(Cairo.Constants.LDP_VALOR, property.getSelectIntValue(), Cairo.Constants.Types.text);
              register.getFields().add2(Cairo.Constants.LDP_ORDEN, 30, Cairo.Constants.Types.integer);
              register.getFields().add2(Cairo.Constants.LDP_ID, K_PROYECTO, Cairo.Constants.Types.integer);
              break;

            case K_PROYECTOITEM:
              register.getFields().add2(Cairo.Constants.LDP_VALOR, property.getSelectIntValue(), Cairo.Constants.Types.text);
              register.getFields().add2(Cairo.Constants.LDP_ORDEN, 40, Cairo.Constants.Types.integer);
              register.getFields().add2(Cairo.Constants.LDP_ID, K_PROYECTOITEM, Cairo.Constants.Types.integer);
              break;

            case K_OBJETIVO:
              register.getFields().add2(Cairo.Constants.LDP_VALOR, property.getSelectIntValue(), Cairo.Constants.Types.text);
              register.getFields().add2(Cairo.Constants.LDP_ORDEN, 50, Cairo.Constants.Types.integer);
              register.getFields().add2(Cairo.Constants.LDP_ID, K_OBJETIVO, Cairo.Constants.Types.integer);
              break;

            case K_CLIENTE:
              register.getFields().add2(Cairo.Constants.LDP_VALOR, property.getSelectIntValue(), Cairo.Constants.Types.text);
              register.getFields().add2(Cairo.Constants.LDP_ORDEN, 50, Cairo.Constants.Types.integer);
              register.getFields().add2(Cairo.Constants.LDP_ID, K_CLIENTE, Cairo.Constants.Types.integer);
              break;

            case K_USUARIO:
              register.getFields().add2(Cairo.Constants.LDP_VALOR, property.getSelectIntValue(), Cairo.Constants.Types.text);
              register.getFields().add2(Cairo.Constants.LDP_ORDEN, 60, Cairo.Constants.Types.integer);
              register.getFields().add2(Cairo.Constants.LDP_ID, K_USUARIO, Cairo.Constants.Types.integer);
              break;

            case K_TAREA:
              register.getFields().add2(Cairo.Constants.LDP_VALOR, property.getSelectIntValue(), Cairo.Constants.Types.text);
              register.getFields().add2(Cairo.Constants.LDP_ORDEN, 70, Cairo.Constants.Types.integer);
              register.getFields().add2(Cairo.Constants.LDP_ID, K_TAREA, Cairo.Constants.Types.integer);
              break;

            case K_DESCRIP:
              register.getFields().add2(Cairo.Constants.LDP_VALOR, property.getValue(), Cairo.Constants.Types.text);
              register.getFields().add2(Cairo.Constants.LDP_ORDEN, 80, Cairo.Constants.Types.integer);
              register.getFields().add2(Cairo.Constants.LDP_ID, K_DESCRIP, Cairo.Constants.Types.integer);
              break;

            case K_TITULO:
              register.getFields().add2(Cairo.Constants.LDP_VALOR, property.getValue(), Cairo.Constants.Types.text);
              register.getFields().add2(Cairo.Constants.LDP_ORDEN, 90, Cairo.Constants.Types.integer);
              register.getFields().add2(Cairo.Constants.LDP_ID, K_TITULO, Cairo.Constants.Types.integer);

              break;
          }
          register.getFields().add2(Cairo.Constants.US_ID, m_us_id, Cairo.Constants.Types.id);
          register.getFields().add2(C.PRE_ID, csTareaPrestacion.cSPRETAREALISTHORA, Cairo.Constants.Types.id);

          register.getFields().setHaveLastUpdate(false);
          register.getFields().setHaveLastUpdate(false);
          if(!Cairo.Database.save(register, , "cIABMClient_Save", C_MODULE, c_ErrorSave)) { return false; }
        }
        if(!load(m_us_id)) { return false; }

        return true;
      };

      self.getTitle = function() {
        // Tareas
        return getText(1795, "");
      };

      self.validate = function() {
        return P.resolvedPromise(true);
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

        m_dialog.getProperties().clear();

        c = m_dialog.getProperties().add(null, mTareaConstantes.HORA_DESDE);
        c.setType(Dialogs.PropertyType.date);
        // Fecha Desde
        c.setName(getText(1203, ""));
        c.setKey(K_FECHADESDE);
        if(LenB(m_fechaDesdeV)) {
          c.setValue(m_fechaDesdeV);
        }
        else {
          c.setValue(m_fechaIni);
        }

        c = m_dialog.getProperties().add(null, mTareaConstantes.HORA_HASTA);
        c.setType(Dialogs.PropertyType.date);
        // Fecha Hasta
        c.setName(getText(1204, ""));
        c.setKey(K_FECHAHASTA);
        if(LenB(m_fechaHastaV)) {
          c.setValue(m_fechaHastaV);
        }
        else {
          c.setValue(m_fechaFin);
        }

        c = m_dialog.getProperties().add(null, mTareaConstantes.CLI_ID);
        c.setType(Dialogs.PropertyType.select);
        c.setSelectTable(Cairo.Tables.CLIENTE);
        // Cliente
        c.setName(getText(1150, ""));
        c.setKey(K_CLIENTE);
        value = m_cliente;
        if(m_cliId.Substring(0, 1).toUpperCase() === KEY_NODO) {
          value = GetNombreRama(Cairo.Tables.CLIENTE, Cairo.Util.val(m_cliId.Substring(2)), bExists);
          if(!bExists) { m_cliId = "0"; }
        }
        c.setValue(value);
        c.setSelectId(Cairo.Util.val(m_cliId));
        c.setSelectIntValue(m_cliId);

        c = m_dialog.getProperties().add(null, mTareaConstantes.PROY_ID);
        c.setType(Dialogs.PropertyType.select);
        c.setSelectTable(csETablesTask.cSPROYECTO);
        // Proyecto
        c.setName(getText(1658, ""));
        c.setKey(K_PROYECTO);
        value = m_proyecto;
        if(m_proy_id.Substring(0, 1).toUpperCase() === KEY_NODO) {
          value = GetNombreRama(csETablesTask.cSPROYECTO, Cairo.Util.val(m_proy_id.Substring(2)), bExists);
          if(!bExists) { m_proy_id = "0"; }
        }
        c.setValue(value);
        c.setSelectId(Cairo.Util.val(m_proy_id));
        c.setSelectIntValue(m_proy_id);

        c = m_dialog.getProperties().add(null, mTareaConstantes.PROY_IID);
        c.setType(Dialogs.PropertyType.select);
        c.setSelectTable(csETablesTask.cSPROYECTOITEM);
        // Proyecto Item
        c.setName(getText(2657, ""));
        c.setKey(K_PROYECTOITEM);
        value = m_proyectoItem;
        if(m_proyi_id.Substring(0, 1).toUpperCase() === KEY_NODO) {
          value = GetNombreRama(csETablesTask.cSPROYECTOITEM, Cairo.Util.val(m_proyi_id.Substring(2)), bExists);
          if(!bExists) { m_proyi_id = "0"; }
        }
        c.setValue(value);
        c.setSelectId(Cairo.Util.val(m_proyi_id));
        c.setSelectIntValue(m_proyi_id);

        c = m_dialog.getProperties().add(null, mTareaConstantes.OBJE_ID);
        c.setType(Dialogs.PropertyType.select);
        c.setSelectTable(csETablesTask.cSOBJETIVO);
        // Objetivo
        c.setName(getText(2651, ""));
        c.setKey(K_OBJETIVO);
        value = m_objetivo;
        if(m_obje_id.Substring(0, 1).toUpperCase() === KEY_NODO) {
          value = GetNombreRama(csETablesTask.cSOBJETIVO, Cairo.Util.val(m_obje_id.Substring(2)), bExists);
          if(!bExists) { m_obje_id = "0"; }
        }
        c.setValue(value);
        c.setSelectId(Cairo.Util.val(m_obje_id));
        c.setSelectIntValue(m_obje_id);

        c = m_dialog.getProperties().add(null, mTareaConstantes.TAR_ID);
        c.setType(Dialogs.PropertyType.select);
        c.setSelectTable(csETablesTask.cSTBLTAREA);
        // Tarea
        c.setName(getText(1836, ""));
        c.setKey(K_TAREA);
        value = m_tarea;
        if(m_tar_id.Substring(0, 1).toUpperCase() === KEY_NODO) {
          value = GetNombreRama(csETablesTask.cSTBLTAREA, Cairo.Util.val(m_tar_id.Substring(2)), bExists);
          if(!bExists) { m_tar_id = "0"; }
        }
        c.setValue(value);
        c.setSelectId(Cairo.Util.val(m_tar_id));
        c.setSelectIntValue(m_tar_id);

        c = m_dialog.getProperties().add(null, Cairo.Constants.US_ID);
        c.setType(Dialogs.PropertyType.select);
        c.setSelectTable(csUsuario);
        // Usuario
        c.setName(getText(1137, ""));
        c.setKey(K_USUARIO);

        value = m_usuario;
        if(m_us_id2.Substring(0, 1).toUpperCase() === KEY_NODO) {
          value = GetNombreRama(csUsuario, Cairo.Util.val(m_us_id2.Substring(2)), bExists);
          if(!bExists) { m_us_id2 = "0"; }
        }
        c.setValue(value);
        c.setSelectId(Cairo.Util.val(m_us_id2));
        c.setSelectIntValue(m_us_id2);

        c = m_dialog.getProperties().add(null, mTareaConstantes.HORA_DESCRIP);
        c.setType(Dialogs.PropertyType.text);
        c.setName(Cairo.Constants.DESCRIPTION_LABEL);
        c.setSize(255);
        c.setKey(K_DESCRIP);
        c.setValue(m_descrip);

        c = m_dialog.getProperties().add(null, mTareaConstantes.HORA_TITULO);
        c.setType(Dialogs.PropertyType.text);
        // Título
        c.setName(getText(1864, ""));
        c.setSize(255);
        c.setKey(K_TITULO);
        c.setValue(m_titulo);

        createMenu();
        if(!m_dialog.showDocumentList(self)) { return false; }

        return true;
      };

      var refreshCollection = function() {
        return m_dialog.showValues(m_properties);
      };

      var load = function() {

        return DB.getData("load[" + m_apiPath + "general/horalistdoc]", id).then(
          function(response) {

            if(response.success !== true) { return false; }

            if(response.data.id === NO_ID) {

              m_fechaIni = Date;
              m_fechaFin = Date;
              m_fechaDesdeV = "";
              m_fechaHastaV = "";
              m_cliId = NO_ID;
              m_cliente = "";
              m_proy_id = NO_ID;
              m_proyecto = "";
              m_proyi_id = NO_ID;
              m_proyectoItem = "";
              m_obje_id = NO_ID;
              m_objetivo = "";
              m_us_id2 = cUtil.getUser().getId();
              m_usuario = cUtil.getUser().getName();
              m_tar_id = NO_ID;
              m_tarea = "";
              m_descrip = "";
              m_titulo = "";
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

      //-------------------------------------------------------------------------------------
      var cIEditGenericListDoc_GridAdd = function(clavePropiedad) {

      };

      var cIEditGenericListDoc_GridEdit = function(clavePropiedad) {

      };

      var cIEditGenericListDoc_GridRemove = function(clavePropiedad) {

      };

      var setCIEditGenericListDoc_ObjAbm = function(rhs) {
        m_dialog = rhs;
      };

      var createMenu = function() {


        if(m_menuLoaded) { return; }

        m_menuLoaded = true;

        m_objList.ObjClientMenu = self;
        m_objList.ClearMenu;
        // Facturar
        m_menuShowFactura = m_objList.addMenu(getText(1613, ""));
        m_objList.addMenu("-");
        // Ver Info del Cliente
        m_menuShowInfoCli = m_objList.addMenu(getText(1614, ""));
        // Agregar Nota
        m_menuAddNote = m_objList.addMenu(getText(1615, ""));
        // Ver Notas
        m_menuShowMensajes = m_objList.addMenu(getText(1616, ""));
      };

      var showNotes = function() {
        var fcId = m_dialog.getId();
        return DB.getData("load[" + m_apiPath + "modulexxxx/xxxx/notes]", fcId)
          .whenSuccessWithResult(D.showNotes);
      };

      var addNote = function() {
        var xxId = m_dialog.getId();
        return D.addNote(D.Types.TYPEXXXX, xxId, false);
      };

      var showFactura = function() {
        try {

          var o = null;
          o = CSKernelClient2.CreateObject("CSVenta2.cFacturaVenta");

          o.ShowFacturaProyecto(getCliId(), getHoraIds());


        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, ex, "showFactura", C_MODULE, "");

        }

      };

      var getCliId = function() {


        var horaId = null;
        var cliId = null;

        horaId = m_dialog.getId();
        DB.getData(mTareaConstantes.HORA, mTareaConstantes.HORA_ID, horaId, mTareaConstantes.CLI_ID, cliId);

        return cliId;
      };

      var getHoraIds = function() {
        return m_dialog.getIds();
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

          c_strLoad = getText(2655, "");
          //Error al cargar los parámetros de navegación de Hora
          c_ErrorSave = getText(2656, "");
          //Error al grabar los párametros de navegación de Hora

          m_properties = new cABMDocProperties();
          //Set .ImageList = fIcons.ilList
          m_properties.setHaveDetail(true);
          m_properties.setStartRowText(4);

          var elem = m_properties.add(null, "TypeTask");
          elem.setName("TypeTask");
          elem.setCaption(" ");
          var elem = elem.add(null);
          elem.FormulaType = csConditionType.cSCONDTNONE;
          elem.IconIndex = c_img_task;
          elem.setWidth(500);
          elem.setSortType(csSortType.cSSRTTICON);

          var elem = m_properties.add(null, "Descripción");
          elem.setName("Descripción");
          elem.setFontName("Tahoma");
          elem.setFontSize(8);
          elem.setForeColor(vbBlue);


        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, ex, "Class_Terminate", C_MODULE, "");

        }

      };

      self.destroy = function() {
        try {
          m_dialog = null;
          m_properties = null;
          m_listController = null;
        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, ex, "destroy", C_MODULE, "");
        }
      };

      self.destroy = function() {
        try {

          m_dialog = null;
          m_properties = null;


        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, ex, "Class_Terminate", C_MODULE, "");

        }

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
              Cairo.Constants.DELETE_FUNCTION, C_MODULE).whenSuccess(closeDialog, false);
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