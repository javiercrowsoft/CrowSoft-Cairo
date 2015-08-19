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

      var C_FECHAINI = "FechaIni";
      var C_FECHAFIN = "FechaFin";

      var C_IMG_TASK = 2;

      var K_FECHAINI = 1;
      var K_FECHAFIN = 2;
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
      var m_cont_id = "";
      var m_lgj_id = "";
      var m_cli_id = "";
      var m_tarest_id = "";
      var m_prio_id = "";

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
      var m_us_id = 0;
      var m_properties;

      var m_apiPath = DB.getAPIVersion();

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
        if(LenB(m_fechaIniV)) {
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
        if(LenB(m_fechaFinV)) {
          c.setValue(m_fechaFinV);
        }
        else {
          c.setValue(m_fechaFin);
        }

        c = m_dialog.getProperties().add(null, mEnvioConstantes.PTD_CUMPLIDA);
        c.setType(Dialogs.PropertyType.list);
        //'Cumplido
        c.setName(Cairo.Language.getText(2340, ""));
        c.setKey(K_CUMPLIDA);
        c.setListWhoSetItem(csListItemData);
        c.setListItemData(m_cumplida);

        o = new CSABMInterface2.cABMListItem();
        o.setID(0);
        //'Todos
        o.setValue(Cairo.Language.getText(2372, ""));
        c.getList().add(o, 0);

        o = new CSABMInterface2.cABMListItem();
        o.setID(csECumplida.cSECUMPLIDA_PENDIENTE);
        //'Pendientes
        o.setValue(Cairo.Language.getText(2373, ""));
        c.getList().add(o, csECumplida.cSECUMPLIDA_PENDIENTE);

        o = new CSABMInterface2.cABMListItem();
        o.setID(csECumplida.cSECUMPLIDA_CUMPLIDA);
        //'Cumplidos
        o.setValue(Cairo.Language.getText(2374, ""));
        c.getList().add(o, csECumplida.cSECUMPLIDA_CUMPLIDA);

        o = new CSABMInterface2.cABMListItem();
        o.setID(csECumplida.cSECUMPLIDA_RECHAZADA);
        //'Rechazados
        o.setValue(Cairo.Language.getText(1477, ""));
        c.getList().add(o, csECumplida.cSECUMPLIDA_RECHAZADA);

        c = m_dialog.getProperties().add(null, mEnvioConstantes.USIDRESPONSABLE);
        c.setType(Dialogs.PropertyType.select);
        c.setTable(csUsuario);
        //'Responsable
        c.setName(Cairo.Language.getText(1822, ""));
        c.setKey(K_US_ID_RESPONSABLE);

        value = m_responsable;
        if(m_us_id_responsable.Substring(0, 1).toUpperCase() == KEY_NODO) {
          value = GetNombreRama(csUsuario, Cairo.Util.val(m_us_id_responsable.Substring(2)), bExists);
          if(!bExists) { m_us_id_responsable = "0"; }
        }
        c.setValue(value);
        c.setSelectId(Cairo.Util.val(m_us_id_responsable));
        c.setHelpValueProcess(m_us_id_responsable);

        c = m_dialog.getProperties().add(null, mEnvioConstantes.USIDASIGNADOR);
        c.setType(Dialogs.PropertyType.select);
        c.setTable(csUsuario);
        //'Generado por
        c.setName(Cairo.Language.getText(1960, ""));
        c.setKey(K_US_ID_ASIGNADOR);
        value = m_asignador;
        if(m_us_id_asignador.Substring(0, 1).toUpperCase() == KEY_NODO) {
          value = GetNombreRama(csUsuario, Cairo.Util.val(m_us_id_asignador.Substring(2)), bExists);
          if(!bExists) { m_us_id_asignador = "0"; }
        }
        c.setValue(value);
        c.setSelectId(Cairo.Util.val(m_us_id_asignador));
        c.setHelpValueProcess(m_us_id_asignador);

        c = m_dialog.getProperties().add(null, mEnvioConstantes.CONT_ID);
        c.setType(Dialogs.PropertyType.select);
        c.setTable(csContacto);
        //'Contacto
        c.setName(Cairo.Language.getText(1035, ""));
        c.setKey(K_CONT_ID);
        value = m_contacto;
        if(m_cont_id.Substring(0, 1).toUpperCase() == KEY_NODO) {
          value = GetNombreRama(csContacto, Cairo.Util.val(m_cont_id.Substring(2)), bExists);
          if(!bExists) { m_cont_id = "0"; }
        }
        c.setValue(value);
        c.setSelectId(Cairo.Util.val(m_cont_id));
        c.setHelpValueProcess(m_cont_id);

        c = m_dialog.getProperties().add(null, mEnvioConstantes.LGJ_ID);
        c.setType(Dialogs.PropertyType.select);
        c.setTable(csETablesEnvio.cSLEGAJO);
        //'Legajo
        c.setName(Cairo.Language.getText(1575, ""));
        c.setKey(K_LGJ_ID);
        value = m_legajo;
        if(m_lgj_id.Substring(0, 1).toUpperCase() == KEY_NODO) {
          value = GetNombreRama(csETablesEnvio.cSLEGAJO, Cairo.Util.val(m_lgj_id.Substring(2)), bExists);
          if(!bExists) { m_lgj_id = "0"; }
        }
        c.setValue(value);
        c.setSelectId(Cairo.Util.val(m_lgj_id));
        c.setHelpValueProcess(m_lgj_id);

        c = m_dialog.getProperties().add(null, mEnvioConstantes.CLI_ID);
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

        c = m_dialog.getProperties().add(null, mEnvioConstantes.TAREST_ID);
        c.setType(Dialogs.PropertyType.select);
        c.setTable(csTareaEstado);
        //'Estado
        c.setName(Cairo.Language.getText(1568, ""));
        c.setKey(K_TAREST_ID);
        value = m_estado;
        if(m_tarest_id.Substring(0, 1).toUpperCase() == KEY_NODO) {
          value = GetNombreRama(csTareaEstado, Cairo.Util.val(m_tarest_id.Substring(2)), bExists);
          if(!bExists) { m_tarest_id = "0"; }
        }
        c.setValue(value);
        c.setSelectId(Cairo.Util.val(m_tarest_id));
        c.setHelpValueProcess(m_tarest_id);

        c = m_dialog.getProperties().add(null, mEnvioConstantes.PRIO_ID);
        c.setType(Dialogs.PropertyType.select);
        c.setTable(csPrioridad);
        //'Prioridad
        c.setName(Cairo.Language.getText(1825, ""));
        c.setKey(K_PRIO_ID);
        value = m_prioridad;
        if(m_prio_id.Substring(0, 1).toUpperCase() == KEY_NODO) {
          value = GetNombreRama(csPrioridad, Cairo.Util.val(m_prio_id.Substring(2)), bExists);
          if(!bExists) { m_prio_id = "0"; }
        }
        c.setValue(value);
        c.setSelectId(Cairo.Util.val(m_prio_id));
        c.setHelpValueProcess(m_prio_id);

        c = m_dialog.getProperties().add(null, mEnvioConstantes.PTD_TITULO);
        c.setType(Dialogs.PropertyType.text);
        //'Título
        c.setName(Cairo.Language.getText(1864, ""));
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

        m_dialog.setTitle(m_name);

        var properties = m_dialog.getProperties();

        return m_dialog.showValues(properties);
      };

      var load = function() {

        return Cairo.Database.getData("load[" + m_apiPath + "general/partediariolistdoc]", id).then(
          function(response) {

            if(response.success !== true) { return false; }

            if(response.data.id === Cairo.Constants.NO_ID) {

              m_fechaIniV = "";
              m_fechaFinV = "";
              m_fechaIni = Date;
              m_fechaFin = Date;
              m_cumplida = -2;
              m_us_id_responsable = Cairo.Constants.NO_ID;
              m_responsable = "";
              m_us_id_asignador = Cairo.Constants.NO_ID;
              m_asignador = "";
              m_cont_id = Cairo.Constants.NO_ID;
              m_contacto = "";
              m_lgj_id = Cairo.Constants.NO_ID;
              m_legajo = "";
              m_cli_id = Cairo.Constants.NO_ID;
              m_cliente = "";
              m_tarest_id = Cairo.Constants.NO_ID;
              m_estado = "";
              m_prio_id = Cairo.Constants.NO_ID;
              m_prioridad = "";
              m_titulo = "";
              m_descrip = "";
            }
            else {

              rs.MoveLast;
              rs.MoveFirst;

              var i = null;
              while (!rs.isEOF()) {

                switch (Cairo.Database.valField(response.data, Cairo.Constants.LDP_ID)) {

                  // OJO: EL ASISTENTE GENERA MAL LAS FECHAS Y LOS TEXTOS (A LOS TEXTOS LES PONE VAL)
                  //      CORREGIR ESTOS ERRORES Y EL COD. DE ABAJO LES SIRVE DE EJ.
                  case K_FECHAINI:
                    m_fechaIniV = Cairo.Database.valField(response.data, Cairo.Constants.LDP_VALOR);
                    m_fechaIni = IsDate(Cairo.Database.valField(response.data, Cairo.Constants.LDP_VALOR)) ? Cairo.Database.valField(response.data, Cairo.Constants.LDP_VALOR) : Date);
                    break;

                  case K_FECHAFIN:
                    m_fechaFinV = Cairo.Database.valField(response.data, Cairo.Constants.LDP_VALOR);
                    m_fechaFin = IsDate(Cairo.Database.valField(response.data, Cairo.Constants.LDP_VALOR)) ? Cairo.Database.valField(response.data, Cairo.Constants.LDP_VALOR) : Date);
                    break;

                  case K_CUMPLIDA:
                    m_cumplida = Cairo.Util.val(Cairo.Database.valField(response.data, Cairo.Constants.LDP_VALOR));
                    break;

                  case K_US_ID_RESPONSABLE:
                    m_us_id_responsable = Cairo.Database.valField(response.data, Cairo.Constants.LDP_VALOR);
                    break;

                  case K_US_ID_ASIGNADOR:
                    m_us_id_asignador = Cairo.Database.valField(response.data, Cairo.Constants.LDP_VALOR);
                    break;

                  case K_CONT_ID:
                    m_cont_id = Cairo.Database.valField(response.data, Cairo.Constants.LDP_VALOR);
                    break;

                  case K_LGJ_ID:
                    m_lgj_id = Cairo.Database.valField(response.data, Cairo.Constants.LDP_VALOR);
                    break;

                  case K_CLI_ID:
                    m_cli_id = Cairo.Database.valField(response.data, Cairo.Constants.LDP_VALOR);
                    break;

                  case K_TAREST_ID:
                    m_tarest_id = Cairo.Database.valField(response.data, Cairo.Constants.LDP_VALOR);
                    break;

                  case K_PRIO_ID:
                    m_prio_id = Cairo.Database.valField(response.data, Cairo.Constants.LDP_VALOR);
                    break;

                  case K_TITULO:
                    m_titulo = Cairo.Database.valField(response.data, Cairo.Constants.LDP_VALOR);
                    break;

                  case K_DESCRIP:
                    m_descrip = Cairo.Database.valField(response.data, Cairo.Constants.LDP_VALOR);

                    break;
                }

                rs.MoveNext;
              }

              var data = null;
              var strLoad = null;

              //'Error al cargar Parte Diario
              strLoad = Cairo.Language.getText(2370, "");

              m_fechaIni = (m_fechaIni != Cairo.Constants.cSNODATE) ? m_fechaIni : Date);
              m_fechaFin = (m_fechaFin != Cairo.Constants.cSNODATE) ? m_fechaFin : Date);

              if(m_us_id_responsable.Substring(0, 1).toUpperCase() != KEY_NODO) {
                if(!Cairo.Database.getData(Cairo.Constants.USUARIO, Cairo.Constants.US_ID, Cairo.Util.val(m_us_id_responsable), Cairo.Constants.US_NAME, data, C_LoadFunction, C_MODULE, strLoad)) { return false; }
                m_responsable = data;
              }

              if(m_us_id_asignador.Substring(0, 1).toUpperCase() != KEY_NODO) {
                if(!Cairo.Database.getData(Cairo.Constants.USUARIO, Cairo.Constants.US_ID, Cairo.Util.val(m_us_id_asignador), Cairo.Constants.US_NAME, data, C_LoadFunction, C_MODULE, strLoad)) { return false; }
                m_asignador = data;
              }

              if(m_cont_id.Substring(0, 1).toUpperCase() != KEY_NODO) {
                if(!Cairo.Database.getData(mEnvioConstantes.CONTACTO, mEnvioConstantes.CONT_ID, Cairo.Util.val(m_cont_id), mEnvioConstantes.CONT_NAME, data, C_LoadFunction, C_MODULE, strLoad)) { return false; }
                m_contacto = data;
              }

              if(m_lgj_id.Substring(0, 1).toUpperCase() != KEY_NODO) {
                if(!Cairo.Database.getData(mEnvioConstantes.LEGAJO, mEnvioConstantes.LGJ_ID, Cairo.Util.val(m_lgj_id), mEnvioConstantes.LGJ_CODE, data, C_LoadFunction, C_MODULE, strLoad)) { return false; }
                m_legajo = data;
              }

              if(m_cli_id.Substring(0, 1).toUpperCase() != KEY_NODO) {
                if(!Cairo.Database.getData(mEnvioConstantes.CLIENTE, mEnvioConstantes.CLI_ID, Cairo.Util.val(m_cli_id), mEnvioConstantes.CLI_NAME, data, C_LoadFunction, C_MODULE, strLoad)) { return false; }
                m_cliente = data;
              }

              if(m_tarest_id.Substring(0, 1).toUpperCase() != KEY_NODO) {
                if(!Cairo.Database.getData(mEnvioConstantes.TAREAESTADO, mEnvioConstantes.TAREST_ID, Cairo.Util.val(m_tarest_id), mEnvioConstantes.TAREST_NAME, data, C_LoadFunction, C_MODULE, strLoad)) { return false; }
                m_estado = data;
              }

              if(m_prio_id.Substring(0, 1).toUpperCase() != KEY_NODO) {
                if(!Cairo.Database.getData(mEnvioConstantes.PRIORIDAD, mEnvioConstantes.PRIO_ID, Cairo.Util.val(m_prio_id), mEnvioConstantes.PRIO_NAME, data, C_LoadFunction, C_MODULE, strLoad)) { return false; }
                m_prioridad = data;
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

      self.propertyChange = function(key) {
        var iProp = null;
        switch (key) {

          case K_FECHAINI:

            iProp = m_dialog.getProperties().item(C_FECHAINI);

            if(LenB(iProp.getSelectIntValue())) {
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

            iProp = m_dialog.getProperties().item(C_FECHAFIN);

            if(LenB(iProp.getSelectIntValue())) {
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
            m_cont_id = property.getSelectIntValue();

            break;

          case K_TAREST_ID:
            var property = m_dialog.getProperties().item(mEnvioConstantes.TAREST_ID);
            m_estado = property.getValue();
            m_tarest_id = property.getSelectIntValue();

            break;

          case K_LGJ_ID:
            var property = m_dialog.getProperties().item(mEnvioConstantes.LGJ_ID);
            m_legajo = property.getValue();
            m_lgj_id = property.getSelectIntValue();

            break;

          case K_CLI_ID:
            var property = m_dialog.getProperties().item(mEnvioConstantes.CLI_ID);
            m_cliente = property.getValue();
            m_cli_id = property.getSelectIntValue();

            break;

          case K_PRIO_ID:
            var property = m_dialog.getProperties().item(mEnvioConstantes.PRIO_ID);
            m_prioridad = property.getValue();
            m_prio_id = property.getSelectIntValue();

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

      var cIABMListDocClient_Refresh = function() {
        var sqlstmt = null;

        sqlstmt = "sp_lsdoc_ParteDiarios ";

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

        sqlstmt = sqlstmt+ m_cumplida+ ",";

        sqlstmt = sqlstmt+ Cairo.Database.sqlString(m_us_id_responsable)+ ",";
        sqlstmt = sqlstmt+ Cairo.Database.sqlString(m_us_id_asignador)+ ",";
        sqlstmt = sqlstmt+ Cairo.Database.sqlString(m_cont_id)+ ",";
        sqlstmt = sqlstmt+ Cairo.Database.sqlString(m_lgj_id)+ ",";
        sqlstmt = sqlstmt+ Cairo.Database.sqlString(m_cli_id)+ ",";
        sqlstmt = sqlstmt+ Cairo.Database.sqlString(m_tarest_id)+ ",";
        sqlstmt = sqlstmt+ Cairo.Database.sqlString(m_prio_id)+ ",";
        sqlstmt = sqlstmt+ Cairo.Database.sqlString(m_titulo)+ ",";
        sqlstmt = sqlstmt+ Cairo.Database.sqlString(m_descrip);

        return sqlstmt;
      };

      var cIABMListDocClient_Save = function() {

        var strError = null;

        strError = Cairo.Language.getText(2371, "");
        //Error al grabar los párametros de navegación de Parte Diario

        var register = null;
        var fields = null;
        register = new cRegister();

        var sqlstmt = null;

        sqlstmt = "delete ListaDocumentoParametro  where pre_id = "+ csEnvioPrestacion.cSPREENVLISTPARTEDIARIO.toString()+ " and us_id = "+ m_us_id;

        if(!Cairo.Database.execute(sqlstmt, "cIABMClient_Save", C_MODULE, strError)) { return false; }

        fields = register.getFields();
        register.setTable(Cairo.Constants.LISTADOCUMENTOPARAMETRO);
        register.setUtilizaIdentity(true);

        var property = null;
        var _count = m_dialog.getProperties().size();
        for (var _i = 0; _i < _count; _i++) {
          property = m_dialog.getProperties().item(_i);

          fields.clear();

          switch (property.getKey()) {

            case K_FECHAINI:

              if(LenB(property.getSelectIntValue())) {
                fields.add2(Cairo.Constants.LDP_VALOR, property.getSelectIntValue(), Cairo.Constants.Types.text);
              }
              else {
                fields.add2(Cairo.Constants.LDP_VALOR, property.getValue(), Cairo.Constants.Types.text);
              }

              fields.add2(Cairo.Constants.LDP_ORDEN, 10, Cairo.Constants.Types.integer);
              fields.add2(Cairo.Constants.LDP_ID, K_FECHAINI, Cairo.Constants.Types.integer);

              break;

            case K_FECHAFIN:

              if(LenB(property.getSelectIntValue())) {
                fields.add2(Cairo.Constants.LDP_VALOR, property.getSelectIntValue(), Cairo.Constants.Types.text);
              }
              else {
                fields.add2(Cairo.Constants.LDP_VALOR, property.getValue(), Cairo.Constants.Types.text);
              }

              fields.add2(Cairo.Constants.LDP_ORDEN, 20, Cairo.Constants.Types.integer);
              fields.add2(Cairo.Constants.LDP_ID, K_FECHAFIN, Cairo.Constants.Types.integer);

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

          fields.add2(Cairo.Constants.US_ID, m_us_id, Cairo.Constants.Types.id);
          fields.add2(Cairo.Constants.PRE_ID, csEnvioPrestacion.cSPREENVLISTPARTEDIARIO, Cairo.Constants.Types.id);

          if(!Cairo.Database.save(register, , "cIABMClient_Save", C_MODULE, strError)) { return false; }
        }

        if(!load(m_us_id)) { return false; }

        return true;
      };

      var cIABMListDocClient_Terminate = function() {
        return true;
      };

      self.getTitle = function() {
        //'Partes Diarios
        return Cairo.Language.getText(2348, "");
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

      self.initialize = function() {
        try {

          m_properties = new cABMDocProperties();
          //Set .ImageList = fIcons.ilList
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