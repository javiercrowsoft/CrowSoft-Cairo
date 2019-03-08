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

      var C_MODULE = "cParteDiarioListDoc";

      var C_FECHA_INI = "FechaIni";
      var C_FECHA_FIN = "FechaFin";

      var C_IMG_TASK = 2;

      var K_FECHA_INI = 1;
      var K_FECHA_FIN = 2;
      var K_CUMPLIDA = 5;
      var K_US_ID_RESPONSABLE = 7;
      var K_US_ID_ASIGNADOR = 8;
      var K_CONT_ID = 9;
      var K_LGJ_ID = 10;
      var K_CLI_ID = 11;
      var K_TAREST_ID = 12;
      var K_PRIO_ID = 13;
      var K_TITULO = 14;
      var K_DESCRIP = 15;

      var m_fechaIniV = "";
      var m_fechaFinV = "";

      // ACA VAN LAS m_ GENERADAS POR EL ASISTENTE.
      var m_fechaIni = null;
      var m_fechaFin = null;
      var m_cumplida = 0;
      var m_us_id_responsable = "";
      var m_us_id_asignador = "";
      var m_contId = "";
      var m_lgjId = "";
      var m_cliId = "";
      var m_tarestId = "";
      var m_prioId = "";

      var m_responsable = "";
      var m_asignador = "";
      var m_contacto = "";
      var m_legajo = "";
      var m_cliente = "";
      var m_estado = "";
      var m_prioridad = "";
      var m_titulo = "";
      var m_descrip = "";

      var m_dialog;
      var m_properties;

      var m_listController;

      var m_apiPath = DB.getAPIVersion();
      var SAVE_ERROR = getText(2371, ""); // Error al grabar los párametros de navegación de Xxxx

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
        var _rtn = false;

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

      var loadCollection = function() {
        var c = null;
        var o = null;
        var value = null;
        var bExists = null;

        m_dialog.getProperties().clear();

        c = m_dialog.getProperties().add(null, C_FECHA_INI);
        c.setType(Dialogs.PropertyType.date);
        // Fecha desde
        c.setName(getText(1203, ""));
        c.setKey(K_FECHA_INI);
        if(LenB(m_fechaIniV)) {
          c.setValue(m_fechaIniV);
        }
        else {
          c.setValue(m_fechaIni);
        }

        c = m_dialog.getProperties().add(null, C_FECHA_FIN);
        c.setType(Dialogs.PropertyType.date);
        // Fecha hasta
        c.setName(getText(1204, ""));
        c.setKey(K_FECHA_FIN);
        if(LenB(m_fechaFinV)) {
          c.setValue(m_fechaFinV);
        }
        else {
          c.setValue(m_fechaFin);
        }

        c = m_dialog.getProperties().add(null, mEnvioConstantes.PTD_CUMPLIDA);
        c.setType(Dialogs.PropertyType.list);
        // Cumplido
        c.setName(getText(2340, ""));
        c.setKey(K_CUMPLIDA);
        c.setListWhoSetItem(Dialogs.ListWhoSetItem.itemData);
        c.setListItemData(m_cumplida);

        o = new CSABMInterface2.cABMListItem();
        o.setID(0);
        // Todos
        o.setValue(getText(2372, ""));
        c.getList().add(o, 0);

        o = new CSABMInterface2.cABMListItem();
        o.setID(csECumplida.cSECUMPLIDA_PENDIENTE);
        // Pendientes
        o.setValue(getText(2373, ""));
        c.getList().add(o, csECumplida.cSECUMPLIDA_PENDIENTE);

        o = new CSABMInterface2.cABMListItem();
        o.setID(csECumplida.cSECUMPLIDA_CUMPLIDA);
        // Cumplidos
        o.setValue(getText(2374, ""));
        c.getList().add(o, csECumplida.cSECUMPLIDA_CUMPLIDA);

        o = new CSABMInterface2.cABMListItem();
        o.setID(csECumplida.cSECUMPLIDA_RECHAZADA);
        // Rechazados
        o.setValue(getText(1477, ""));
        c.getList().add(o, csECumplida.cSECUMPLIDA_RECHAZADA);

        c = m_dialog.getProperties().add(null, mEnvioConstantes.USIDRESPONSABLE);
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

        c = m_dialog.getProperties().add(null, mEnvioConstantes.USIDASIGNADOR);
        c.setType(Dialogs.PropertyType.select);
        c.setSelectTable(csUsuario);
        // Generado por
        c.setName(getText(1960, ""));
        c.setKey(K_US_ID_ASIGNADOR);
        value = m_asignador;
        if(m_us_id_asignador.Substring(0, 1).toUpperCase() === KEY_NODO) {
          value = GetNombreRama(csUsuario, Cairo.Util.val(m_us_id_asignador.Substring(2)), bExists);
          if(!bExists) { m_us_id_asignador = "0"; }
        }
        c.setValue(value);
        c.setSelectId(Cairo.Util.val(m_us_id_asignador));
        c.setSelectIntValue(m_us_id_asignador);

        c = m_dialog.getProperties().add(null, mEnvioConstantes.CONT_ID);
        c.setType(Dialogs.PropertyType.select);
        c.setSelectTable(csContacto);
        // Contacto
        c.setName(getText(1035, ""));
        c.setKey(K_CONT_ID);
        value = m_contacto;
        if(m_contId.Substring(0, 1).toUpperCase() === KEY_NODO) {
          value = GetNombreRama(csContacto, Cairo.Util.val(m_contId.Substring(2)), bExists);
          if(!bExists) { m_contId = "0"; }
        }
        c.setValue(value);
        c.setSelectId(Cairo.Util.val(m_contId));
        c.setSelectIntValue(m_contId);

        c = m_dialog.getProperties().add(null, mEnvioConstantes.LGJ_ID);
        c.setType(Dialogs.PropertyType.select);
        c.setSelectTable(csETablesEnvio.cSLEGAJO);
        // Legajo
        c.setName(getText(1575, ""));
        c.setKey(K_LGJ_ID);
        value = m_legajo;
        if(m_lgjId.Substring(0, 1).toUpperCase() === KEY_NODO) {
          value = GetNombreRama(csETablesEnvio.cSLEGAJO, Cairo.Util.val(m_lgjId.Substring(2)), bExists);
          if(!bExists) { m_lgjId = "0"; }
        }
        c.setValue(value);
        c.setSelectId(Cairo.Util.val(m_lgjId));
        c.setSelectIntValue(m_lgjId);

        c = m_dialog.getProperties().add(null, mEnvioConstantes.CLI_ID);
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

        c = m_dialog.getProperties().add(null, mEnvioConstantes.TAREST_ID);
        c.setType(Dialogs.PropertyType.select);
        c.setSelectTable(csTareaEstado);
        // Estado
        c.setName(getText(1568, ""));
        c.setKey(K_TAREST_ID);
        value = m_estado;
        if(m_tarestId.Substring(0, 1).toUpperCase() === KEY_NODO) {
          value = GetNombreRama(csTareaEstado, Cairo.Util.val(m_tarestId.Substring(2)), bExists);
          if(!bExists) { m_tarestId = "0"; }
        }
        c.setValue(value);
        c.setSelectId(Cairo.Util.val(m_tarestId));
        c.setSelectIntValue(m_tarestId);

        c = m_dialog.getProperties().add(null, mEnvioConstantes.PRIO_ID);
        c.setType(Dialogs.PropertyType.select);
        c.setSelectTable(csPrioridad);
        // Prioridad
        c.setName(getText(1825, ""));
        c.setKey(K_PRIO_ID);
        value = m_prioridad;
        if(m_prioId.Substring(0, 1).toUpperCase() === KEY_NODO) {
          value = GetNombreRama(csPrioridad, Cairo.Util.val(m_prioId.Substring(2)), bExists);
          if(!bExists) { m_prioId = "0"; }
        }
        c.setValue(value);
        c.setSelectId(Cairo.Util.val(m_prioId));
        c.setSelectIntValue(m_prioId);

        c = m_dialog.getProperties().add(null, mEnvioConstantes.PTD_TITULO);
        c.setType(Dialogs.PropertyType.text);
        // Título
        c.setName(getText(1864, ""));
        c.setKey(K_TITULO);
        c.setValue(m_titulo);

        c = m_dialog.getProperties().add(null, mEnvioConstantes.PTD_DESCRIP);
        c.setType(Dialogs.PropertyType.text);
        c.setName(Cairo.Constants.DESCRIPTION_LABEL);
        c.setKey(K_DESCRIP);
        c.setValue(m_descrip);

        if(!m_dialog.showDocumentList(self)) { return false; }

        return true;

      };

      var refreshCollection = function() {
        return m_dialog.showValues(m_properties);
      };

      var load = function() {

        return DB.getData("load[" + m_apiPath + "general/partediariolistdoc]", id).then(
          function(response) {

            if(response.success !== true) { return false; }

            if(response.data.id === NO_ID) {

              m_fechaIniV = "";
              m_fechaIni = Cairo.Dates.today();
              m_fechaFinV = "";
              m_fechaFin = Cairo.Dates.DateNames.getDateByName('h-60');

              m_cumplida = -2;
              m_us_id_responsable = NO_ID;
              m_responsable = "";
              m_us_id_asignador = NO_ID;
              m_asignador = "";
              m_contId = NO_ID;
              m_contacto = "";
              m_lgjId = NO_ID;
              m_legajo = "";
              m_cliId = NO_ID;
              m_cliente = "";
              m_tarestId = NO_ID;
              m_estado = "";
              m_prioId = NO_ID;
              m_prioridad = "";
              m_titulo = "";
              m_descrip = "";
            }
            else {

              m_fechaIniV = valField(response.data, C.FROM);
              m_fechaIni = valField(response.data, C.FROM);
              m_fechaIni = isDate(m_fechaIni) ? getDateValue(m_fechaIni) : today();

              m_fechaFinV = valField(response.data, C.TO);
              m_fechaFin = valField(response.data, C.TO);
              m_fechaFin = isDate(m_fechaFin) ? getDateValue(m_fechaFin) : today();

              m_cliId = valField(response.data, C.CLI_ID);
              m_cliente = valField(response.data, C.CLI_NAME);

              m_tarestId = valField(response.data, C.TAREST_ID);
              m_estado = valField(response.data, C.EST_NAME);

              m_lgjId = valField(response.data, C.LGJ_ID);
              m_legajo = valField(response.data, C.LGJ_TITLE);

              m_prioId = valField(response.data, C.PRIO_ID);
              m_prioridad = valField(response.data, C.PRIO_NAME);

              // TODO: complete the missing fields (titulo, descrip, etc.)

            }

            return true;
          });
      };

      self.getApplication = function() {
        return Cairo.Application.getName();
      };

      self.getProperties = function() {
        return m_properties;
      };

      self.propertyChange = function(key) {
        var iProp = null;
        switch (key) {

          case K_FECHA_INI:

            iProp = m_dialog.getProperties().item(C_FECHA_INI);

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

          case K_FECHA_FIN:

            iProp = m_dialog.getProperties().item(C_FECHA_FIN);

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

          case K_CUMPLIDA:
            m_cumplida = m_dialog.getProperties().item(mEnvioConstantes.PTD_CUMPLIDA).getListItemData();

            break;

          case K_US_ID_RESPONSABLE:
            var property = m_dialog.getProperties().item(mEnvioConstantes.USIDRESPONSABLE);
            m_responsable = property.getValue();
            m_us_id_responsable = property.getSelectIntValue();

            break;

          case K_US_ID_ASIGNADOR:
            var property = m_dialog.getProperties().item(mEnvioConstantes.USIDASIGNADOR);
            m_asignador = property.getValue();
            m_us_id_asignador = property.getSelectIntValue();

            break;

          case K_CONT_ID:
            var property = m_dialog.getProperties().item(mEnvioConstantes.CONT_ID);
            m_contacto = property.getValue();
            m_contId = property.getSelectIntValue();

            break;

          case K_TAREST_ID:
            var property = m_dialog.getProperties().item(mEnvioConstantes.TAREST_ID);
            m_estado = property.getValue();
            m_tarestId = property.getSelectIntValue();

            break;

          case K_LGJ_ID:
            var property = m_dialog.getProperties().item(mEnvioConstantes.LGJ_ID);
            m_legajo = property.getValue();
            m_lgjId = property.getSelectIntValue();

            break;

          case K_CLI_ID:
            var property = m_dialog.getProperties().item(mEnvioConstantes.CLI_ID);
            m_cliente = property.getValue();
            m_cliId = property.getSelectIntValue();

            break;

          case K_PRIO_ID:
            var property = m_dialog.getProperties().item(mEnvioConstantes.PRIO_ID);
            m_prioridad = property.getValue();
            m_prioId = property.getSelectIntValue();

            break;

          case K_TITULO:
            m_titulo = m_dialog.getProperties().item(mEnvioConstantes.PTD_TITULO).getValue();

            break;

          case K_DESCRIP:
            m_descrip = m_dialog.getProperties().item(mEnvioConstantes.PTD_DESCRIP).getValue();

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

        sqlstmt = "sp_lsdoc_ParteDiarios ";

        sqlstmt = sqlstmt+ Cairo.Database.getUserId().toString()+ ",";

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

        sqlstmt = sqlstmt+ m_cumplida+ ",";

        sqlstmt = sqlstmt+ Cairo.Database.sqlString(m_us_id_responsable)+ ",";
        sqlstmt = sqlstmt+ Cairo.Database.sqlString(m_us_id_asignador)+ ",";
        sqlstmt = sqlstmt+ Cairo.Database.sqlString(m_contId)+ ",";
        sqlstmt = sqlstmt+ Cairo.Database.sqlString(m_lgjId)+ ",";
        sqlstmt = sqlstmt+ Cairo.Database.sqlString(m_cliId)+ ",";
        sqlstmt = sqlstmt+ Cairo.Database.sqlString(m_tarestId)+ ",";
        sqlstmt = sqlstmt+ Cairo.Database.sqlString(m_prioId)+ ",";
        sqlstmt = sqlstmt+ Cairo.Database.sqlString(m_titulo)+ ",";
        sqlstmt = sqlstmt+ Cairo.Database.sqlString(m_descrip);

        return sqlstmt;
      };

      self.save = function() {

        var register = new DB.Register();
        var fields = register.getFields();

        register.setFieldId(C.LDP_ID);
        register.setTable(C.LISTA_DOCUMENTO_PARAMETRO);

        register.setPath(m_apiPath + "compras/facturacompras");

        register.setId(Cairo.Constants.NEW_ID);

        var _count = m_dialog.getProperties().size();
        for(var _i = 0; _i < _count; _i++) {

          var property = m_dialog.getProperties().item(_i);

          switch (property.getKey()) {

            case K_FECHA_INI:
              var value = property.getSelectIntValue();
              if(value === "") { value = property.getValue(); }
              fields.add(C.FROM, value, Types.text);
              break;

            case K_FECHA_FIN:
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
                  }
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

        strError = getText(2371, "");
        //Error al grabar los párametros de navegación de Parte Diario

        var register = null;
        var fields = null;
        var register = new DB.Register();

        var sqlstmt = null;

        sqlstmt = "delete ListaDocumentoParametro  where pre_id = "+ csEnvioPrestacion.cSPREENVLISTPARTEDIARIO.toString()+ " and us_id = "+ m_us_id;

        if(!Cairo.Database.execute(sqlstmt, "cIABMClient_Save", C_MODULE, strError)) { return false; }

        fields = register.getFields();
        register.setTable(Cairo.Constants.LISTADOCUMENTOPARAMETRO);
        register.setUtilizaIdentity(true);

        var property = null;
        var _count = m_dialog.getProperties().size();
        for(var _i = 0; _i < _count; _i++) {
          property = m_dialog.getProperties().item(_i);

          fields.clear();

          switch (property.getKey()) {

            case K_FECHA_INI:

              if(LenB(property.getSelectIntValue())) {
                fields.add2(Cairo.Constants.LDP_VALOR, property.getSelectIntValue(), Cairo.Constants.Types.text);
              }
              else {
                fields.add2(Cairo.Constants.LDP_VALOR, property.getValue(), Cairo.Constants.Types.text);
              }

              fields.add2(Cairo.Constants.LDP_ORDEN, 10, Cairo.Constants.Types.integer);
              fields.add2(Cairo.Constants.LDP_ID, K_FECHA_INI, Cairo.Constants.Types.integer);

              break;

            case K_FECHA_FIN:

              if(LenB(property.getSelectIntValue())) {
                fields.add2(Cairo.Constants.LDP_VALOR, property.getSelectIntValue(), Cairo.Constants.Types.text);
              }
              else {
                fields.add2(Cairo.Constants.LDP_VALOR, property.getValue(), Cairo.Constants.Types.text);
              }

              fields.add2(Cairo.Constants.LDP_ORDEN, 20, Cairo.Constants.Types.integer);
              fields.add2(Cairo.Constants.LDP_ID, K_FECHA_FIN, Cairo.Constants.Types.integer);

              break;

            case K_CUMPLIDA:
              fields.add2(Cairo.Constants.LDP_VALOR, property.getListItemData(), Cairo.Constants.Types.text);
              fields.add2(Cairo.Constants.LDP_ORDEN, 50, Cairo.Constants.Types.integer);
              fields.add2(Cairo.Constants.LDP_ID, K_CUMPLIDA, Cairo.Constants.Types.integer);

              break;

            case K_US_ID_RESPONSABLE:
              fields.add2(Cairo.Constants.LDP_VALOR, property.getSelectIntValue(), Cairo.Constants.Types.text);
              fields.add2(Cairo.Constants.LDP_ORDEN, 70, Cairo.Constants.Types.integer);
              fields.add2(Cairo.Constants.LDP_ID, K_US_ID_RESPONSABLE, Cairo.Constants.Types.integer);

              break;

            case K_US_ID_ASIGNADOR:
              fields.add2(Cairo.Constants.LDP_VALOR, property.getSelectIntValue(), Cairo.Constants.Types.text);
              fields.add2(Cairo.Constants.LDP_ORDEN, 80, Cairo.Constants.Types.integer);
              fields.add2(Cairo.Constants.LDP_ID, K_US_ID_ASIGNADOR, Cairo.Constants.Types.integer);

              break;

            case K_CONT_ID:
              fields.add2(Cairo.Constants.LDP_VALOR, property.getSelectIntValue(), Cairo.Constants.Types.text);
              fields.add2(Cairo.Constants.LDP_ORDEN, 90, Cairo.Constants.Types.integer);
              fields.add2(Cairo.Constants.LDP_ID, K_CONT_ID, Cairo.Constants.Types.integer);

              break;

            case K_LGJ_ID:
              fields.add2(Cairo.Constants.LDP_VALOR, property.getSelectIntValue(), Cairo.Constants.Types.text);
              fields.add2(Cairo.Constants.LDP_ORDEN, 100, Cairo.Constants.Types.integer);
              fields.add2(Cairo.Constants.LDP_ID, K_LGJ_ID, Cairo.Constants.Types.integer);

              break;

            case K_CLI_ID:
              fields.add2(Cairo.Constants.LDP_VALOR, property.getSelectIntValue(), Cairo.Constants.Types.text);
              fields.add2(Cairo.Constants.LDP_ORDEN, 110, Cairo.Constants.Types.integer);
              fields.add2(Cairo.Constants.LDP_ID, K_CLI_ID, Cairo.Constants.Types.integer);

              break;

            case K_TAREST_ID:
              fields.add2(Cairo.Constants.LDP_VALOR, property.getSelectIntValue(), Cairo.Constants.Types.text);
              fields.add2(Cairo.Constants.LDP_ORDEN, 120, Cairo.Constants.Types.integer);
              fields.add2(Cairo.Constants.LDP_ID, K_TAREST_ID, Cairo.Constants.Types.integer);

              break;

            case K_PRIO_ID:
              fields.add2(Cairo.Constants.LDP_VALOR, property.getSelectIntValue(), Cairo.Constants.Types.text);
              fields.add2(Cairo.Constants.LDP_ORDEN, 130, Cairo.Constants.Types.integer);
              fields.add2(Cairo.Constants.LDP_ID, K_PRIO_ID, Cairo.Constants.Types.integer);

              break;

            case K_TITULO:
              fields.add2(Cairo.Constants.LDP_VALOR, property.getValue(), Cairo.Constants.Types.text);
              fields.add2(Cairo.Constants.LDP_ORDEN, 140, Cairo.Constants.Types.integer);
              fields.add2(Cairo.Constants.LDP_ID, K_TITULO, Cairo.Constants.Types.integer);

              break;

            case K_DESCRIP:
              fields.add2(Cairo.Constants.LDP_VALOR, property.getValue(), Cairo.Constants.Types.text);
              fields.add2(Cairo.Constants.LDP_ORDEN, 150, Cairo.Constants.Types.integer);
              fields.add2(Cairo.Constants.LDP_ID, K_DESCRIP, Cairo.Constants.Types.integer);

              break;
          }

          fields.add2(C.US_ID, m_us_id, Cairo.Constants.Types.id);
          fields.add2(C.PRE_ID, csEnvioPrestacion.cSPREENVLISTPARTEDIARIO, Cairo.Constants.Types.id);

          if(!Cairo.Database.save(register, , "cIABMClient_Save", C_MODULE, strError)) { return false; }
        }

        if(!load(m_us_id)) { return false; }

        return true;
      };

      self.getTitle = function() {
        // Partes Diarios
        return getText(2348, "");
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

          m_properties = new cABMDocProperties();
          //Set .ImageList = fIcons.ilList
          m_properties.setHaveDetail(true);
          m_properties.setStartRowText(4);

          var elem = m_properties.add(null, "TypeTask");
          elem.setName("TypeTask");
          elem.setCaption(" ");
          var elem = row.add(null);
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
          Cairo.manageErrorEx(ex.message, ex, "destroy", C_MODULE, "");

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
          Cairo.manageErrorEx(ex.message, ex, "destroy", C_MODULE, "");

        }

      };

      return self;
    };

    Edit.Controller = { getEditor: createObject };

    Edit.Controller.edit = function(id) {
      var editor = Cairo.Xxxx.Edit.Controller.getEditor();
      var dialog = Cairo.Dialogs.Views.Controller.newDialog();

      editor.setDialog(dialog);
      editor.edit(id);
    };

  });

  Cairo.module("Xxxx.List", function(List, Cairo, Backbone, Marionette, $, _) {

    var NO_ID = Cairo.Constants.NO_ID;
    var DB = Cairo.Database;
    var C_MODULE = "cXxxx";
    var P = Cairo.Promises;

    List.Controller = {
      list: function() {

        var self = this;

        var createListDialog = function() {

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