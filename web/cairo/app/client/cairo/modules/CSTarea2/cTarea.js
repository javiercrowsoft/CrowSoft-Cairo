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

      var C_MODULE = "cTareaListDoc";

      var K_FECHAINI = 4;
      var K_FECHAFIN = 5;
      var K_FINALIZADA = 7;
      var K_CUMPLIDA = 8;
      var K_RECHAZADA = 9;
      var K_US_ID_RESPONSABLE = 10;
      var K_US_ID_ASIGNADOR = 11;
      var K_CONT_ID = 12;
      var K_TAREST_ID = 13;
      var K_PRIO_ID = 14;
      var K_ACTIVE = 18;
      var K_PROY_ID = 19;

      // Seudo - Variables
      var c_strLoad = "";
      var c_ErrorSave = "";

      var m_dialog;

      var m_us_id = 0;

      var m_fechaIniV = "";
      var m_fechaFinV = "";

      var m_fechaIni = null;
      var m_fechaFin = null;
      var m_finalizada = 0;
      var m_cumplida = 0;
      var m_rechazada = 0;

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
      var m_active = 0;
      var m_properties;

      var m_bPlantillas;

      var m_menuLoaded;

      var m_menuShowMensajes = 0;
      var m_menuShowInfoCli = 0;
      var m_menuAddNote = 0;

      var m_apiPath = DB.getAPIVersion();

      self.setPlantillas = function(rhs) {
        m_bPlantillas = rhs;
      };
      self.processMenu = function(index) {
        try {

          switch (index) {

            case m_menuShowInfoCli:
              HelpShowInfo(Cairo.Tables.CLIENTE, pGetCliId());

              break;

            case m_menuShowMensajes:
              showNotes();

              break;

            case m_menuAddNote:
              addNote();

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

      //-------------------------------------------------------------------------------------
      // Interfaz cliente de List de documentos

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
            iProp = m_dialog.getProperties().item(mTareaConstantes.TARFECHAINI);

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
            iProp = m_dialog.getProperties().item(mTareaConstantes.TARFECHAFIN);

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

          case K_FINALIZADA:
            m_finalizada = m_dialog.getProperties().item(mTareaConstantes.TAR_FINALIZADA).getListItemData();
            break;

          case K_CUMPLIDA:
            m_cumplida = m_dialog.getProperties().item(mTareaConstantes.TAR_CUMPLIDA).getListItemData();
            break;

          case K_RECHAZADA:
            m_rechazada = m_dialog.getProperties().item(mTareaConstantes.TAR_RECHAZADA).getListItemData();
            break;

          case K_US_ID_RESPONSABLE:
            m_us_id_responsable = m_dialog.getProperties().item(mTareaConstantes.US_ID_RESPONSABLE).getSelectIntValue();
            break;

          case K_US_ID_ASIGNADOR:
            m_us_id_asignador = m_dialog.getProperties().item(mTareaConstantes.US_ID_ASIGNADOR).getSelectIntValue();
            break;

          case K_CONT_ID:
            m_cont_id = m_dialog.getProperties().item(mTareaConstantes.CONT_ID).getSelectIntValue();
            break;

          case K_TAREST_ID:
            m_tarest_id = m_dialog.getProperties().item(mTareaConstantes.TAREST_ID).getSelectIntValue();
            break;

          case K_PRIO_ID:
            m_prio_id = m_dialog.getProperties().item(mTareaConstantes.PRIO_ID).getSelectIntValue();
            break;

          case K_ACTIVE:
            m_active = m_dialog.getProperties().item(Cairo.Constants.ACTIVE).getListItemData();
            break;

          case K_PROY_ID:
            m_proy_id = m_dialog.getProperties().item(mTareaConstantes.PROY_ID).getSelectIntValue();
            break;
        }

        return true;
      };

      var cIABMListDocClient_Refresh = function() {
        var sqlstmt = null;

        sqlstmt = "sp_lsdoc_tareas ";

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

        sqlstmt = sqlstmt+ m_finalizada+ ",";
        sqlstmt = sqlstmt+ m_cumplida+ ",";
        sqlstmt = sqlstmt+ m_rechazada+ ",";
        sqlstmt = sqlstmt+ Cairo.Database.sqlString(m_us_id_responsable)+ ",";
        sqlstmt = sqlstmt+ Cairo.Database.sqlString(m_us_id_asignador)+ ",";
        sqlstmt = sqlstmt+ Cairo.Database.sqlString(m_cont_id)+ ",";
        sqlstmt = sqlstmt+ Cairo.Database.sqlString(m_tarest_id)+ ",";
        sqlstmt = sqlstmt+ Cairo.Database.sqlString(m_prio_id)+ ",";
        sqlstmt = sqlstmt+ Cairo.Database.sqlString(m_proy_id)+ ",";
        sqlstmt = sqlstmt+ m_active+ ",";
        sqlstmt = sqlstmt+ m_bPlantillas ? 1 : 0);

        return sqlstmt;
      };

      var cIABMListDocClient_Save = function() {
        var register = null;
        register = new cRegister();

        var sqlstmt = null;
        sqlstmt = "delete ListaDocumentoParametro  where pre_id = "+ csTareaPrestacion.cSPRETAREALISTTAREA.toString()+ " and us_id = "+ m_us_id;

        if(!Cairo.Database.execute(sqlstmt, "cIABMClient_Save", C_MODULE, c_ErrorSave)) { return false; }

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

            case K_FINALIZADA:
              register.getFields().add2(Cairo.Constants.LDP_VALOR, property.getListItemData(), Cairo.Constants.Types.text);
              register.getFields().add2(Cairo.Constants.LDP_ORDEN, 30, Cairo.Constants.Types.integer);
              register.getFields().add2(Cairo.Constants.LDP_ID, K_FINALIZADA, Cairo.Constants.Types.integer);

              break;

            case K_CUMPLIDA:
              register.getFields().add2(Cairo.Constants.LDP_VALOR, property.getListItemData(), Cairo.Constants.Types.text);
              register.getFields().add2(Cairo.Constants.LDP_ORDEN, 40, Cairo.Constants.Types.integer);
              register.getFields().add2(Cairo.Constants.LDP_ID, K_CUMPLIDA, Cairo.Constants.Types.integer);

              break;

            case K_RECHAZADA:
              register.getFields().add2(Cairo.Constants.LDP_VALOR, property.getListItemData(), Cairo.Constants.Types.text);
              register.getFields().add2(Cairo.Constants.LDP_ORDEN, 50, Cairo.Constants.Types.integer);
              register.getFields().add2(Cairo.Constants.LDP_ID, K_RECHAZADA, Cairo.Constants.Types.integer);

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

            case K_ACTIVE:
              register.getFields().add2(Cairo.Constants.LDP_VALOR, property.getListItemData(), Cairo.Constants.Types.text);
              register.getFields().add2(Cairo.Constants.LDP_ORDEN, 110, Cairo.Constants.Types.integer);
              register.getFields().add2(Cairo.Constants.LDP_ID, K_ACTIVE, Cairo.Constants.Types.integer);

              break;

            case K_PROY_ID:
              register.getFields().add2(Cairo.Constants.LDP_VALOR, property.getSelectIntValue(), Cairo.Constants.Types.text);
              register.getFields().add2(Cairo.Constants.LDP_ORDEN, 110, Cairo.Constants.Types.integer);
              register.getFields().add2(Cairo.Constants.LDP_ID, K_PROY_ID, Cairo.Constants.Types.integer);

              break;
          }

          register.getFields().add2(Cairo.Constants.US_ID, m_us_id, Cairo.Constants.Types.id);
          register.getFields().add2(Cairo.Constants.PRE_ID, csTareaPrestacion.cSPRETAREALISTTAREA, Cairo.Constants.Types.id);

          register.getFields().setHaveLastUpdate(false);
          register.getFields().setHaveWhoModify(false);
          if(!Cairo.Database.save(register, , "cIABMListDocClient_Save", C_MODULE, c_ErrorSave)) { return false; }

        }
        if(!load(m_us_id)) { return false; }

        return true;
      };

      var cIABMListDocClient_Terminate = function() {
        return true;
      };

      self.getTitle = function() {
        var _rtn = "";
        if(m_bPlantillas) {
          _rtn = "Plantillas de Tareas";
        }
        else {
          _rtn = "Tareas";
        }

        return _rtn;
      };

      self.validate = function() {
        return P.resolvedPromise(true);
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

      var cIEditGenericListDoc_ShowParams = function(us_id) {
        var _rtn = null;
        try {

          if(us_id == Cairo.Constants.NO_ID) { return _rtn; }

          m_us_id = us_id;

          if(!load(us_id)) { return _rtn; }

          if(!self.loadCollection()) { return _rtn; }

          _rtn = true;
          return _rtn;
        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, "cIEditGenericListDoc_ShowParams", C_MODULE, "");
        }

        return _rtn;
      };

      var cIEditGenericListDoc_PropertyChange = function(key) {

      };

      var cIEditGenericListDoc_TabClick = function(index) {

      };


      self.loadCollection = function() {
        var c = null;
        var o = null;
        var value = null;
        var bExists = null;

        m_dialog.getProperties().clear();

        c = m_dialog.getProperties().add(null, mTareaConstantes.TARFECHAINI);
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

        c = m_dialog.getProperties().add(null, mTareaConstantes.TARFECHAFIN);
        c.setType(Dialogs.PropertyType.date);
        //'Fecha hasta
        c.setName(Cairo.Language.getText(1203, ""));
        c.setKey(K_FECHAFIN);
        if(LenB(m_fechaFinV)) {
          c.setValue(m_fechaFinV);
        }
        else {
          c.setValue(m_fechaFin);
        }

        c = m_dialog.getProperties().add(null, mTareaConstantes.TAR_FINALIZADA);
        c.setType(Dialogs.PropertyType.list);
        //'Finalizada
        c.setName(Cairo.Language.getText(2680, ""));
        c.setKey(K_FINALIZADA);
        c.setListWhoSetItem(csListItemData);
        c.setListItemData(m_finalizada);

        o = new CSABMInterface2.cABMListItem();
        o.setID(csTriLogicState.cSTLBOTH);
        //'Ambas
        o.setValue(Cairo.Language.getText(2426, ""));
        c.getList().add(o, csTriLogicState.cSTLBOTH);

        o = new CSABMInterface2.cABMListItem();
        o.setID(csTriLogicState.cSTLNO);
        //'Pendientes
        o.setValue(Cairo.Language.getText(2373, ""));
        c.getList().add(o, csTriLogicState.cSTLNO);

        o = new CSABMInterface2.cABMListItem();
        o.setID(csTriLogicState.cSTLYES);
        //'Finalizadas
        o.setValue(Cairo.Language.getText(2692, ""));
        c.getList().add(o, csTriLogicState.cSTLYES);

        c = m_dialog.getProperties().add(null, mTareaConstantes.TAR_CUMPLIDA);
        c.setType(Dialogs.PropertyType.list);
        //'Cumplida
        c.setName(Cairo.Language.getText(2363, ""));
        c.setKey(K_CUMPLIDA);
        c.setListWhoSetItem(csListItemData);
        c.setListItemData(m_cumplida);

        o = new CSABMInterface2.cABMListItem();
        o.setID(csTriLogicState.cSTLBOTH);
        //'Ambas
        o.setValue(Cairo.Language.getText(2426, ""));
        c.getList().add(o, csTriLogicState.cSTLBOTH);

        o = new CSABMInterface2.cABMListItem();
        o.setID(csTriLogicState.cSTLNO);
        //'Pendientes
        o.setValue(Cairo.Language.getText(2373, ""));
        c.getList().add(o, csTriLogicState.cSTLNO);

        o = new CSABMInterface2.cABMListItem();
        o.setID(csTriLogicState.cSTLYES);
        //'Cumplidas
        o.setValue(Cairo.Language.getText(2694, ""));
        c.getList().add(o, csTriLogicState.cSTLYES);

        c = m_dialog.getProperties().add(null, mTareaConstantes.TAR_RECHAZADA);
        c.setType(Dialogs.PropertyType.list);
        //'Rechazada
        c.setName(Cairo.Language.getText(2681, ""));
        c.setKey(K_RECHAZADA);
        c.setListWhoSetItem(csListItemData);
        c.setListItemData(m_rechazada);

        o = new CSABMInterface2.cABMListItem();
        o.setID(csTriLogicState.cSTLBOTH);
        //'Ambas
        o.setValue(Cairo.Language.getText(2426, ""));
        c.getList().add(o, csTriLogicState.cSTLBOTH);

        o = new CSABMInterface2.cABMListItem();
        o.setID(csTriLogicState.cSTLNO);
        //'Pendientes
        o.setValue(Cairo.Language.getText(2373, ""));
        c.getList().add(o, csTriLogicState.cSTLNO);

        o = new CSABMInterface2.cABMListItem();
        o.setID(csTriLogicState.cSTLYES);
        //'Rechazadas
        o.setValue(Cairo.Language.getText(2693, ""));
        c.getList().add(o, csTriLogicState.cSTLYES);

        c = m_dialog.getProperties().add(null, mTareaConstantes.PROY_ID);
        c.setType(Dialogs.PropertyType.select);
        c.setTable(csETablesTask.cSPROYECTO);
        //'Proyecto
        c.setName(Cairo.Language.getText(1658, ""));
        c.setKey(K_PROY_ID);
        value = m_proyecto;
        if(m_proy_id.Substring(0, 1).toUpperCase() == KEY_NODO) {
          value = GetNombreRama(csETablesTask.cSPROYECTO, Cairo.Util.val(m_proy_id.Substring(2)), bExists);
          if(!bExists) { m_proy_id = "0"; }
        }
        c.setValue(value);
        c.setSelectId(Cairo.Util.val(m_proy_id));
        c.setHelpValueProcess(m_proy_id);

        c = m_dialog.getProperties().add(null, mTareaConstantes.US_ID_RESPONSABLE);
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

        c = m_dialog.getProperties().add(null, mTareaConstantes.US_ID_ASIGNADOR);
        c.setType(Dialogs.PropertyType.select);
        c.setTable(csUsuario);
        //'Asignada por
        c.setName(Cairo.Language.getText(1824, ""));
        c.setKey(K_US_ID_ASIGNADOR);
        value = m_asignador;
        if(m_us_id_asignador.Substring(0, 1).toUpperCase() == KEY_NODO) {
          value = GetNombreRama(csUsuario, Cairo.Util.val(m_us_id_asignador.Substring(2)), bExists);
          if(!bExists) { m_us_id_asignador = "0"; }
        }
        c.setValue(value);
        c.setSelectId(Cairo.Util.val(m_us_id_asignador));
        c.setHelpValueProcess(m_us_id_asignador);

        c = m_dialog.getProperties().add(null, mTareaConstantes.CONT_ID);
        c.setType(Dialogs.PropertyType.select);
        c.setTable(csETablesTask.cSCONTACTO);
        //'Contacto
        c.setName(Cairo.Language.getText(1035, ""));
        c.setKey(K_CONT_ID);
        value = m_contacto;
        if(m_cont_id.Substring(0, 1).toUpperCase() == KEY_NODO) {
          value = GetNombreRama(csETablesTask.cSCONTACTO, Cairo.Util.val(m_cont_id.Substring(2)), bExists);
          if(!bExists) { m_cont_id = "0"; }
        }
        c.setValue(value);
        c.setSelectId(Cairo.Util.val(m_cont_id));
        c.setHelpValueProcess(m_cont_id);

        c = m_dialog.getProperties().add(null, mTareaConstantes.TAREST_ID);
        c.setType(Dialogs.PropertyType.select);
        c.setTable(csETablesTask.cSTAREAESTADO);
        //'Estado
        c.setName(Cairo.Language.getText(1568, ""));
        c.setKey(K_TAREST_ID);
        value = m_estado;
        if(m_tarest_id.Substring(0, 1).toUpperCase() == KEY_NODO) {
          value = GetNombreRama(csETablesTask.cSTAREAESTADO, Cairo.Util.val(m_tarest_id.Substring(2)), bExists);
          if(!bExists) { m_tarest_id = "0"; }
        }
        c.setValue(value);
        c.setSelectId(Cairo.Util.val(m_tarest_id));
        c.setHelpValueProcess(m_tarest_id);

        c = m_dialog.getProperties().add(null, mTareaConstantes.PRIO_ID);
        c.setType(Dialogs.PropertyType.select);
        c.setTable(csETablesTask.cSPRIORIDAD);
        //'Prioridad
        c.setName(Cairo.Language.getText(1825, ""));
        c.setKey(K_PRIO_ID);

        value = m_prioridad;
        if(m_prio_id.Substring(0, 1).toUpperCase() == KEY_NODO) {
          value = GetNombreRama(csETablesTask.cSPRIORIDAD, Cairo.Util.val(m_prio_id.Substring(2)), bExists);
          if(!bExists) { m_prio_id = "0"; }
        }
        c.setValue(value);
        c.setSelectId(Cairo.Util.val(m_prio_id));
        c.setHelpValueProcess(m_prio_id);

        c = m_dialog.getProperties().add(null, Cairo.Constants.ACTIVE);
        c.setType(Dialogs.PropertyType.list);
        c.setName(Cairo.Constants.ACTIVE_LABEL);
        c.setKey(K_ACTIVE);
        c.setListWhoSetItem(csListItemData);
        c.setListItemData(m_active);

        o = new CSABMInterface2.cABMListItem();
        o.setID(csTriLogicState.cSTLBOTH);
        //'Ambas
        o.setValue(Cairo.Language.getText(2426, ""));
        c.getList().add(o, csTriLogicState.cSTLBOTH);

        o = new CSABMInterface2.cABMListItem();
        o.setID(csTriLogicState.cSTLNO);
        //'Inactivas
        o.setValue(Cairo.Language.getText(2427, ""));
        c.getList().add(o, csTriLogicState.cSTLNO);

        o = new CSABMInterface2.cABMListItem();
        o.setID(csTriLogicState.cSTLYES);
        //'Activas
        o.setValue(Cairo.Language.getText(2428, ""));
        c.getList().add(o, csTriLogicState.cSTLYES);

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

        return Cairo.Database.getData("load[" + m_apiPath + "general/tarealistdoc]", id).then(
          function(response) {

            if(response.success !== true) { return false; }

            if(response.data.id === Cairo.Constants.NO_ID) {

              m_fechaIni = Date;
              m_fechaFin = Date;
              m_fechaIniV = "";
              m_fechaFinV = "";
              m_finalizada = csTriLogicState.cSTLBOTH;
              m_cumplida = csTriLogicState.cSTLBOTH;
              m_rechazada = csTriLogicState.cSTLBOTH;
              m_us_id_responsable = Cairo.Constants.NO_ID;
              m_us_id_asignador = Cairo.Constants.NO_ID;
              m_cont_id = Cairo.Constants.NO_ID;
              m_tarest_id = Cairo.Constants.NO_ID;
              m_prio_id = Cairo.Constants.NO_ID;
              m_proy_id = Cairo.Constants.NO_ID;
              m_active = csTriLogicState.cSTLBOTH;
              m_estado = "";
              m_responsable = "";
              m_asignador = "";
              m_contacto = "";
              m_prioridad = "";
              m_proyecto = "";

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

                  case K_FINALIZADA:
                    m_finalizada = Cairo.Util.val(Cairo.Database.valField(response.data, Cairo.Constants.LDP_VALOR));
                    break;

                  case K_CUMPLIDA:
                    m_cumplida = Cairo.Util.val(Cairo.Database.valField(response.data, Cairo.Constants.LDP_VALOR));
                    break;

                  case K_RECHAZADA:
                    m_rechazada = Cairo.Util.val(Cairo.Database.valField(response.data, Cairo.Constants.LDP_VALOR));
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

                  case K_TAREST_ID:
                    m_tarest_id = Cairo.Database.valField(response.data, Cairo.Constants.LDP_VALOR);
                    break;

                  case K_PRIO_ID:
                    m_prio_id = Cairo.Database.valField(response.data, Cairo.Constants.LDP_VALOR);
                    break;

                  case K_ACTIVE:
                    m_active = Cairo.Util.val(Cairo.Database.valField(response.data, Cairo.Constants.LDP_VALOR));
                    break;

                  case K_PROY_ID:
                    m_proy_id = Cairo.Database.valField(response.data, Cairo.Constants.LDP_VALOR);

                    break;
                }

                rs.MoveNext;
              }

              var data = null;

              m_fechaFin = (m_fechaFin != Cairo.Constants.cSNODATE) ? m_fechaFin : Date);
              m_fechaIni = (m_fechaIni != Cairo.Constants.cSNODATE) ? m_fechaIni : Date);

              if(m_tarest_id.Substring(0, 1).toUpperCase() != KEY_NODO) {
                if(!Cairo.Database.getData(mTareaConstantes.TAREAESTADO, mTareaConstantes.TAREST_ID, Cairo.Util.val(m_tarest_id), mTareaConstantes.TAREST_NAME, data, C_LoadFunction, C_MODULE, c_strLoad)) { return false; }
                m_estado = data;
              }

              if(m_us_id_responsable.Substring(0, 1).toUpperCase() != KEY_NODO) {
                if(!Cairo.Database.getData(Cairo.Constants.USUARIO, Cairo.Constants.US_ID, Cairo.Util.val(m_us_id_responsable), Cairo.Constants.US_NAME, data, C_LoadFunction, C_MODULE, c_strLoad)) { return false; }
                m_responsable = data;
              }

              if(m_us_id_asignador.Substring(0, 1).toUpperCase() != KEY_NODO) {
                if(!Cairo.Database.getData(Cairo.Constants.USUARIO, Cairo.Constants.US_ID, Cairo.Util.val(m_us_id_asignador), Cairo.Constants.US_NAME, data, C_LoadFunction, C_MODULE, c_strLoad)) { return false; }
                m_asignador = data;
              }

              if(m_cont_id.Substring(0, 1).toUpperCase() != KEY_NODO) {
                if(!Cairo.Database.getData(mTareaConstantes.CONTACTO, mTareaConstantes.CONT_ID, Cairo.Util.val(m_cont_id), mTareaConstantes.CONT_NAME, data, C_LoadFunction, C_MODULE, c_strLoad)) { return false; }
                m_contacto = data;
              }

              if(m_prio_id.Substring(0, 1).toUpperCase() != KEY_NODO) {
                if(!Cairo.Database.getData(mTareaConstantes.PRIORIDAD, mTareaConstantes.PRIO_ID, Cairo.Util.val(m_prio_id), mTareaConstantes.PRIO_NAME, data, C_LoadFunction, C_MODULE, c_strLoad)) { return false; }
                m_prioridad = data;
              }

              if(m_proy_id.Substring(0, 1).toUpperCase() != KEY_NODO) {
                if(!Cairo.Database.getData(mTareaConstantes.PROYECTO, mTareaConstantes.PROY_ID, Cairo.Util.val(m_proy_id), mTareaConstantes.PROY_NAME, data, C_LoadFunction, C_MODULE, c_strLoad)) { return false; }
                m_proyecto = data;
              }
            }

            return true;
          });

      };

      self.initialize = function() {
        try {

          c_strLoad = Cairo.Language.getText(2695, "");
          //Error al cargar los parámetros de navegación de Tarea
          c_ErrorSave = Cairo.Language.getText(2696, "");
          //Error al grabar los parámetros de navegación de Tarea

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

      var createMenu = function() {
        // **TODO:** on error resume next found !!!

        if(m_menuLoaded) { return; }

        m_menuLoaded = true;

        m_objList.ObjClientMenu = self;
        m_objList.ClearMenu;
        //'Ver Info del Cliente
        m_menuShowInfoCli = m_objList.AddMenu(Cairo.Language.getText(1614, ""));
        //'Agregar Nota
        m_menuAddNote = m_objList.AddMenu(Cairo.Language.getText(1615, ""));
        //'Ver Notas
        m_menuShowMensajes = m_objList.AddMenu(Cairo.Language.getText(1616, ""));
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

      var pGetCliId = function() {
        // **TODO:** on error resume next found !!!

        var horaId = null;
        var cliId = null;

        horaId = m_dialog.getId();
        Cairo.Database.getData(mTareaConstantes.HORA, mTareaConstantes.HORA_ID, horaId, mTareaConstantes.CLI_ID, cliId);

        return cliId;
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