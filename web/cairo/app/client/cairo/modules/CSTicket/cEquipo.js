(function() {
  "use strict";

  Cairo.module("Xxxx.Edit", function(Edit, Cairo, Backbone, Marionette, $, _) {

  });

  Cairo.module("XxxxListDoc.Edit", function(Edit, Cairo, Backbone, Marionette, $, _) {

    var createObject = function() {

      var self = {};

      var Dialogs = Cairo.Dialogs;

      // cEquipoListDoc
      // 18-11-2006

      var C_MODULE = "cEquipoListDoc";

      var C_FECHAINI = "FechaIni";
      var C_FECHAFIN = "FechaFin";

      var C_FILTRARFECHAS = "FiltrarFechas";
      var C_SINASIGNAR = "SinAsignar";
      var C_SOLOENEMPRESA = "SoloEnEmpresa";

      var C_IMG_TASK = 1;

      // ACA VAN LAS K GENERADAS POR EL ASISTENTE.
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

      // empid
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

      var m_cli_id = "";
      var m_cliente = "";
      var m_suc_id = "";
      var m_sucursal = "";

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

      var m_menuShowFactura = 0;

      var m_menuShowMensajes = 0;
      var m_menuAddMensaje = 0;
      var m_menuChangePr = 0;
      var m_menuUpdateSerie = 0;
      var m_menuEditSerieH = 0;
      var m_menuParteRep = 0;

      // Properties publicas
      // Properties privadas
      self.processMenu = function(index) {
        try {

          switch (index) {

            case m_menuShowMensajes:
              pShowMensajes();

              break;

            case m_menuAddMensaje:
              pAddMensaje();

              break;

            case m_menuChangePr:
              pChangePr(pGetPrnsIds());

              break;

            case m_menuUpdateSerie:
              pUpdateSerie(pGetPrnsIds());

              break;

            case m_menuEditSerieH:
              pEditSerieH(pGetPrnsIds());

              break;

            case m_menuParteRep:
              pShowParteReparacion();

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

        var properties = m_dialog.getProperties();
        properties.clear();

        c = properties.add(null, C_FILTRARFECHAS);
        c.setType(Dialogs.PropertyType.check);
        //'Filtrar por Fechas
        c.setName(Cairo.Language.getText(1819, ""));
        c.setKey(K_FILTRAR_FECHAS);
        c.setValue(Cairo.Util.boolToInt(m_bFiltrarFechas));

        c = properties.add(null, C_FECHAINI);
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

        c = properties.add(null, C_FECHAFIN);
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

        c = properties.add(null, mTicketConstantes.PRNS_ID);
        c.setType(Dialogs.PropertyType.select);
        c.setTable(Cairo.Tables.PRODUCTOSERIE);
        //'Número de Serie
        c.setName(Cairo.Language.getText(1820, ""));
        c.setKey(K_PRNS_ID);
        value = m_series;
        if(m_prns_id.Substring(0, 1).toUpperCase() == KEY_NODO) {
          value = GetNombreRama(Cairo.Tables.PRODUCTOSERIE, Cairo.Util.val(m_prns_id.Substring(2)), bExists);
          if(!bExists) { m_prns_id = "0"; }
        }
        c.setValue(value);
        c.setSelectId(Cairo.Util.val(m_prns_id));
        c.setHelpValueProcess(m_prns_id);

        c = properties.add(null, mTicketConstantes.RUB_ID);
        c.setType(Dialogs.PropertyType.select);
        c.setTable(Cairo.Tables.RUBRO);
        //'Rubro
        c.setName(Cairo.Language.getText(1299, ""));
        c.setKey(K_RUB_ID);
        value = m_rubro;
        if(m_rub_id.Substring(0, 1).toUpperCase() == KEY_NODO) {
          value = GetNombreRama(Cairo.Tables.RUBRO, Cairo.Util.val(m_rub_id.Substring(2)), bExists);
          if(!bExists) { m_rub_id = "0"; }
        }
        c.setValue(value);
        c.setSelectId(Cairo.Util.val(m_rub_id));
        c.setHelpValueProcess(m_rub_id);

        c = properties.add(null, mTicketConstantes.PR_ID);
        c.setType(Dialogs.PropertyType.select);
        c.setTable(Cairo.Tables.PRODUCTO);
        //'Equipo
        c.setName(Cairo.Language.getText(1801, ""));
        c.setKey(K_PR_ID);
        value = m_producto;
        if(m_pr_id.Substring(0, 1).toUpperCase() == KEY_NODO) {
          value = GetNombreRama(Cairo.Tables.PRODUCTO, Cairo.Util.val(m_pr_id.Substring(2)), bExists);
          if(!bExists) { m_pr_id = "0"; }
        }
        c.setValue(value);
        c.setSelectId(Cairo.Util.val(m_pr_id));
        c.setHelpValueProcess(m_pr_id);

        c = properties.add(null, mTicketConstantes.DEPL_ID);
        c.setType(Dialogs.PropertyType.select);
        c.setTable(Cairo.Tables.DEPOSITOLOGICO);
        //'Deposito
        c.setName(Cairo.Language.getText(1574, ""));
        c.setKey(K_DEPL_ID);
        value = m_deposito;
        if(m_depl_id.Substring(0, 1).toUpperCase() == KEY_NODO) {
          value = GetNombreRama(Cairo.Tables.DEPOSITOLOGICO, Cairo.Util.val(m_depl_id.Substring(2)), bExists);
          if(!bExists) { m_depl_id = "0"; }
        }
        c.setValue(value);
        c.setSelectId(Cairo.Util.val(m_depl_id));
        c.setHelpValueProcess(m_depl_id);

        c = properties.add(null, C_SOLOENEMPRESA);
        c.setType(Dialogs.PropertyType.check);
        //'Solo en la Empresa
        c.setName(Cairo.Language.getText(1821, ""));
        c.setKey(K_SOLO_EN_EMPRESA);
        c.setValue(Cairo.Util.boolToInt(m_bSoloEnEmpresa));

        c = m_dialog.getProperties().add(null, mTicketConstantes.PROY_ID);
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

        c = m_dialog.getProperties().add(null, mTicketConstantes.US_ID_RESPONSABLE);
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

        c = properties.add(null, C_SINASIGNAR);
        c.setType(Dialogs.PropertyType.check);
        //'Sin Asignar
        c.setName(Cairo.Language.getText(1823, ""));
        c.setKey(K_SIN_ASIGNAR);
        c.setValue(Cairo.Util.boolToInt(m_bSinAsignar));

        c = m_dialog.getProperties().add(null, mTicketConstantes.US_ID_ASIGNADOR);
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

        c = m_dialog.getProperties().add(null, mTicketConstantes.CONT_ID);
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

        c = m_dialog.getProperties().add(null, mTicketConstantes.TAREST_ID);
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

        c = m_dialog.getProperties().add(null, mTicketConstantes.PRIO_ID);
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

        c = properties.add(null, mTicketConstantes.CLI_ID);
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

        c = properties.add(null, mTicketConstantes.SUC_ID);
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
        return Cairo.Database.getData("load[" + apiPath + "general/equipolistdoc]", id).then(
          function(response) {

            // empid
            m_emp_id = cUtil.getEmpId();
            m_empresa = cUtil.getEmpNombre();

            if(response.success !== true) { return false; }

            if(response.data.id === Cairo.Constants.NO_ID) {

              m_bFiltrarFechas = false;
              m_bSinAsignar = true;
              m_bSoloEnEmpresa = true;
              m_prns_id = Cairo.Constants.NO_ID;
              m_rub_id = Cairo.Constants.NO_ID;
              m_pr_id = Cairo.Constants.NO_ID;
              m_depl_id = Cairo.Constants.NO_ID;
              m_series = "";
              m_rubro = "";
              m_producto = "";
              m_deposito = "";
              m_fechaIni = Date;
              m_fechaFin = Date;
              m_cli_id = Cairo.Constants.NO_ID;
              m_cliente = "";
              m_suc_id = Cairo.Constants.NO_ID;
              m_sucursal = "";
              m_us_id_responsable = Cairo.Constants.NO_ID;
              m_us_id_asignador = Cairo.Constants.NO_ID;
              m_cont_id = Cairo.Constants.NO_ID;
              m_tarest_id = Cairo.Constants.NO_ID;
              m_prio_id = Cairo.Constants.NO_ID;
              m_proy_id = Cairo.Constants.NO_ID;
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

                  case K_FILTRAR_FECHAS:
                    m_bFiltrarFechas = Cairo.Util.val(Cairo.Database.valField(response.data, Cairo.Constants.LDP_VALOR));

                    break;

                  case K_SIN_ASIGNAR:
                    m_bSinAsignar = Cairo.Util.val(Cairo.Database.valField(response.data, Cairo.Constants.LDP_VALOR));

                    break;

                  case K_SOLO_EN_EMPRESA:
                    m_bSoloEnEmpresa = Cairo.Util.val(Cairo.Database.valField(response.data, Cairo.Constants.LDP_VALOR));

                    break;

                  case K_FECHAINI:
                    m_fechaIniV = Cairo.Database.valField(response.data, Cairo.Constants.LDP_VALOR);
                    m_fechaIni = IsDate(Cairo.Database.valField(response.data, Cairo.Constants.LDP_VALOR)) ? Cairo.Database.valField(response.data, Cairo.Constants.LDP_VALOR) : Date);

                    break;

                  case K_FECHAFIN:
                    m_fechaFinV = Cairo.Database.valField(response.data, Cairo.Constants.LDP_VALOR);
                    m_fechaFin = IsDate(Cairo.Database.valField(response.data, Cairo.Constants.LDP_VALOR)) ? Cairo.Database.valField(response.data, Cairo.Constants.LDP_VALOR) : Date);

                    break;

                  case K_PRNS_ID:
                    m_prns_id = Cairo.Database.valField(response.data, Cairo.Constants.LDP_VALOR);

                    break;

                  case K_RUB_ID:
                    m_rub_id = Cairo.Database.valField(response.data, Cairo.Constants.LDP_VALOR);

                    break;

                  case K_PR_ID:
                    m_pr_id = Cairo.Database.valField(response.data, Cairo.Constants.LDP_VALOR);

                    break;

                  case K_DEPL_ID:
                    m_depl_id = Cairo.Database.valField(response.data, Cairo.Constants.LDP_VALOR);

                    break;

                  case K_CLI_ID:
                    m_cli_id = Cairo.Database.valField(response.data, Cairo.Constants.LDP_VALOR);

                    break;

                  case K_SUC_ID:
                    m_suc_id = Cairo.Database.valField(response.data, Cairo.Constants.LDP_VALOR);

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

                  case K_PROY_ID:
                    m_proy_id = Cairo.Database.valField(response.data, Cairo.Constants.LDP_VALOR);

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

              strLoad = Cairo.Language.getText(2280, "");
              //Error al cargar los párametros de navegación de Detalle de Equipo

              m_fechaIni = (m_fechaIni != Cairo.Constants.cSNODATE) ? m_fechaIni : Date);
              m_fechaFin = (m_fechaFin != Cairo.Constants.cSNODATE) ? m_fechaFin : Date);

              if(m_prns_id.Substring(0, 1).toUpperCase() != KEY_NODO) {
                if(!Cairo.Database.getData(mTicketConstantes.PRODUCTONUMEROSERIE, mTicketConstantes.PRNS_ID, Cairo.Util.val(m_prns_id), mTicketConstantes.PRNS_CODE, data, C_LoadFunction, C_MODULE, strLoad)) { return false; }
                m_series = data;
              }
              if(m_rub_id.Substring(0, 1).toUpperCase() != KEY_NODO) {
                if(!Cairo.Database.getData(mTicketConstantes.RUBRO, mTicketConstantes.RUB_ID, Cairo.Util.val(m_rub_id), mTicketConstantes.RUB_NAME, data, C_LoadFunction, C_MODULE, strLoad)) { return false; }
                m_rubro = data;
              }
              if(m_pr_id.Substring(0, 1).toUpperCase() != KEY_NODO) {
                if(!Cairo.Database.getData(mTicketConstantes.PRODUCTO, mTicketConstantes.PR_ID, Cairo.Util.val(m_pr_id), mTicketConstantes.PR_NOMBREVENTA, data, C_LoadFunction, C_MODULE, strLoad)) { return false; }
                m_producto = data;
              }
              if(m_depl_id.Substring(0, 1).toUpperCase() != KEY_NODO) {
                if(!Cairo.Database.getData(mTicketConstantes.DEPOSITOLOGICO, mTicketConstantes.DEPL_ID, Cairo.Util.val(m_depl_id), mTicketConstantes.DEPL_NAME, data, C_LoadFunction, C_MODULE, strLoad)) { return false; }
                m_deposito = data;
              }

              if(m_cli_id.Substring(0, 1).toUpperCase() != KEY_NODO) {
                if(!Cairo.Database.getData(mTicketConstantes.CLIENTE, mTicketConstantes.CLI_ID, Cairo.Util.val(m_cli_id), mTicketConstantes.CLI_NAME, data, C_LoadFunction, C_MODULE, strLoad)) { return false; }
                m_cliente = data;
              }
              if(m_suc_id.Substring(0, 1).toUpperCase() != KEY_NODO) {
                if(!Cairo.Database.getData(mTicketConstantes.SUCURSAL, mTicketConstantes.SUC_ID, Cairo.Util.val(m_suc_id), mTicketConstantes.SUC_NAME, data, C_LoadFunction, C_MODULE, strLoad)) { return false; }
                m_sucursal = data;
              }

              if(m_tarest_id.Substring(0, 1).toUpperCase() != KEY_NODO) {
                if(!Cairo.Database.getData(mTicketConstantes.TAREAESTADO, mTicketConstantes.TAREST_ID, Cairo.Util.val(m_tarest_id), mTicketConstantes.TAREST_NAME, data, C_LoadFunction, C_MODULE, strLoad)) { return false; }
                m_estado = data;
              }

              if(m_us_id_responsable.Substring(0, 1).toUpperCase() != KEY_NODO) {
                if(!Cairo.Database.getData(Cairo.Constants.USUARIO, Cairo.Constants.US_ID, Cairo.Util.val(m_us_id_responsable), Cairo.Constants.US_NAME, data, C_LoadFunction, C_MODULE, strLoad)) { return false; }
                m_responsable = data;
              }

              if(m_us_id_asignador.Substring(0, 1).toUpperCase() != KEY_NODO) {
                if(!Cairo.Database.getData(Cairo.Constants.USUARIO, Cairo.Constants.US_ID, Cairo.Util.val(m_us_id_asignador), Cairo.Constants.US_NAME, data, C_LoadFunction, C_MODULE, strLoad)) { return false; }
                m_asignador = data;
              }

              if(m_cont_id.Substring(0, 1).toUpperCase() != KEY_NODO) {
                if(!Cairo.Database.getData(mTicketConstantes.CONTACTO, mTicketConstantes.CONT_ID, Cairo.Util.val(m_cont_id), mTicketConstantes.CONT_NAME, data, C_LoadFunction, C_MODULE, strLoad)) { return false; }
                m_contacto = data;
              }

              if(m_prio_id.Substring(0, 1).toUpperCase() != KEY_NODO) {
                if(!Cairo.Database.getData(mTicketConstantes.PRIORIDAD, mTicketConstantes.PRIO_ID, Cairo.Util.val(m_prio_id), mTicketConstantes.PRIO_NAME, data, C_LoadFunction, C_MODULE, strLoad)) { return false; }
                m_prioridad = data;
              }

              if(m_proy_id.Substring(0, 1).toUpperCase() != KEY_NODO) {
                if(!Cairo.Database.getData(mTicketConstantes.PROYECTO, mTicketConstantes.PROY_ID, Cairo.Util.val(m_proy_id), mTicketConstantes.PROY_NAME, data, C_LoadFunction, C_MODULE, strLoad)) { return false; }
                m_proyecto = data;
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

            iProp = properties.item(C_FECHAFIN);

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
            m_cli_id = property.getSelectIntValue();

            break;

          case K_SUC_ID:
            var property = properties.item(mTicketConstantes.SUC_ID);
            m_sucursal = property.getValue();
            m_suc_id = property.getSelectIntValue();

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

        sqlstmt = "sp_lsdoc_productoseries ";

        sqlstmt = sqlstmt+ Cairo.Database.getUserId().toString()+ ",";

        sqlstmt = sqlstmt+ Integer.parseInt(m_bFiltrarFechas)+ ",";
        sqlstmt = sqlstmt+ Integer.parseInt(m_bSinAsignar)+ ",";

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

        sqlstmt = sqlstmt+ Cairo.Database.sqlString(m_prns_id)+ ",";
        sqlstmt = sqlstmt+ Cairo.Database.sqlString(m_rub_id)+ ",";
        sqlstmt = sqlstmt+ Cairo.Database.sqlString(m_pr_id)+ ",";
        sqlstmt = sqlstmt+ Cairo.Database.sqlString(m_depl_id)+ ",";

        sqlstmt = sqlstmt+ Cairo.Database.sqlString(m_cli_id)+ ",";
        sqlstmt = sqlstmt+ Cairo.Database.sqlString(m_suc_id)+ ",";

        sqlstmt = sqlstmt+ Cairo.Database.sqlString(m_us_id_responsable)+ ",";
        sqlstmt = sqlstmt+ Cairo.Database.sqlString(m_us_id_asignador)+ ",";
        sqlstmt = sqlstmt+ Cairo.Database.sqlString(m_cont_id)+ ",";
        sqlstmt = sqlstmt+ Cairo.Database.sqlString(m_tarest_id)+ ",";
        sqlstmt = sqlstmt+ Cairo.Database.sqlString(m_prio_id)+ ",";
        sqlstmt = sqlstmt+ Cairo.Database.sqlString(m_proy_id)+ ",";

        sqlstmt = sqlstmt+ Integer.parseInt(m_bSoloEnEmpresa)+ ",";

        sqlstmt = sqlstmt+ Cairo.Database.sqlString(m_emp_id);

        return sqlstmt;
      };

      var cIABMListDocClient_Save = function() {

        var strError = null;

        strError = Cairo.Language.getText(2279, "");
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
          register.getFields().add2(Cairo.Constants.PRE_ID, csPreTicketPrestacion.cSPRETICKLISTORDENSERV, Cairo.Constants.Types.id);

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

      self.initialize = function() {
        try {

          //'Ordenes de Servicio
          m_title = Cairo.Language.getText(1830, "");

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
      //  MngError err, "", C_Module, ""
      //  If Err.Number Then Resume ExitProc
      //ExitProc:
      //  On Error Resume Next

      var pCreateMenu = function() {
        // **TODO:** on error resume next found !!!

        if(m_menuLoaded) { return; }

        m_menuLoaded = true;

        m_objList.ObjClientMenu = self;
        m_objList.ClearMenu;
        //'Cambiar el Articulo Asociado al Nro. de Serie
        m_menuChangePr = m_objList.AddMenu(Cairo.Language.getText(3916, ""));
        //'Editar el número de serie anterior
        m_menuEditSerieH = m_objList.AddMenu(Cairo.Language.getText(3949, ""));
        //'Modificar el número de serie
        m_menuUpdateSerie = m_objList.AddMenu(Cairo.Language.getText(3933, ""));
        //'Editar parte de reparación
        m_menuParteRep = m_objList.AddMenu(Cairo.Language.getText(3963, ""));
        m_objList.AddMenu("-");
        //'Agregar Nota
        m_menuAddMensaje = m_objList.AddMenu(Cairo.Language.getText(1615, ""));
        //'Ver Notas
        m_menuShowMensajes = m_objList.AddMenu(Cairo.Language.getText(1616, ""));
      };

      var pShowMensajes = function() {
        var sqlstmt = null;
        var prnsId = null;
        var rs = null;

        prnsId = m_objList.Id;

        sqlstmt = "sp_ParteDiarioGetTitleForDoc "+ Cairo.Tables.PRODUCTOSERIE.toString()+ ","+ prnsId.toString();

        if(!Cairo.Database.openRs(sqlstmt, rs)) { return; }

        if(rs.isEOF()) { return; }

        var infodoc = null;
        var doctId = null;

        doctId = Cairo.Tables.PRODUCTOSERIE;
        infodoc = Cairo.Database.valField(rs.getFields(), "info_doc");

        sqlstmt = "sp_PartesDiarioGetForDoc "+ Cairo.Database.getUserId().toString()+ ","+ cUtil.getEmpId().toString()+ ","+ doctId.toString()+ ","+ prnsId.toString();
        ShowNotes(Cairo.Language.getText(1615, "", infodoc), sqlstmt);
        //Notas sobre Equipos (1)
      };

      var pChangePr = function(vIds) { // TODO: Use of ByRef founded Private Sub pChangePr(ByRef vIds() As Long)
        var prns_id = null;
        var i = null;

        var mouse = null;
        mouse = new cMouse();
        mouse.mouseDefault();

        if(vIds.Length < 0) {
          //' Debe seleccionar al menos un equipo
          MsgWarning(Cairo.Language.getText(3917, ""));
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

          //' Indica que se deben cambiar los precios
          sqlstmt = "sp_ProductoNumeroSerieChangeProducto "+ vIds(i)+ ","+ hr.getId()+ ",1";

          if(!Cairo.Database.execute(sqlstmt)) { return; }

          m_objList.RefreshLine(vIds(i));

        }

      };

      var pUpdateSerie = function(vIds) { // TODO: Use of ByRef founded Private Sub pUpdateSerie(ByRef vIds() As Long)
        var prns_id = null;
        var i = null;

        var mouse = null;
        mouse = new cMouse();
        mouse.mouseDefault();

        if(vIds.Length < 0) {
          //' Debe seleccionar al menos un equipo
          MsgWarning(Cairo.Language.getText(3917, ""));
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

      var pEditSerieH = function(vIds) { // TODO: Use of ByRef founded Private Sub pEditSerieH(ByRef vIds() As Long)
        var prns_id = null;
        var i = null;

        var mouse = null;
        mouse = new cMouse();
        mouse.mouseDefault();

        if(vIds.Length < 0) {
          //' Debe seleccionar al menos un equipo
          MsgWarning(Cairo.Language.getText(3917, ""));
          return;
        }

        m_objList.sqlstmt = "sp_lsdoc_ProductoSerie";

        var f = null;

        f = new fEditSerieH();

        for (i = 0; i <= vIds.Length; i++) {

          f.self.showForm(pGetPrnsCodigo(vIds(i)));

          if(f.self.getCancel()) { break; }

          // Sino eligio omitir modificamos
          //
          if(f.self.getOk()) {

            pUpdateNroSerie(Cairo.Util.val(f.cHelpSerie.cOrdenServicioAplic.self.getId()));

          }

          pUnload(f);

        }

      };

      var pUnload = function(f) { // TODO: Use of ByRef founded Private Sub pUnload(ByRef F As Form)
        // **TODO:** on error resume next found !!!
        Unload(f);
      };

      var pGetPrnsCodigo = function(prns_id) {
        var sqlstmt = null;
        var rs = null;

        rs = new ADODB.Recordset();
        sqlstmt = "select prns_codigo from ProductoNumeroSerie where prns_id = "+ prns_id.toString();
        if(!Cairo.Database.openRs(sqlstmt, rs)) { return ""; }
        if(rs.isEOF()) { return ""; }
        return Cairo.Database.valField(rs.getFields(), mTicketConstantes.PRNS_CODE);
      };

      var pGetPrnsIds = function() {
        return m_objList.SelectedItems;
      };

      var pAddMensaje = function() {
        var parte = null;
        parte = CSKernelClient2.CreateObject("CSEnvio2.cParteDiario");

        parte.AddParteToDoc(Cairo.Tables.PRODUCTOSERIE, m_objList.Id, false);
      };

      var pUpdateNroSerie = function(prnsId) {
        var sqlstmt = null;
        sqlstmt = "update ProductoNumeroSerie set prns_id_historia = "+ prnsId.toString()+ " where prns_id = "+ prnsId.toString();
        Cairo.Database.execute(sqlstmt);
      };

      var pShowParteReparacion = function() {
        var prnsId = null;

        var objEdit = null;
        objEdit = new cParteReparacion();

        var vIds(0) = null;

        prnsId = m_objList.Id;
        vIds[0] = prnsId;

        objEdit.self.showParteReparacion(pGetClidFromPrnsId(prnsId), vIds[]);
      };

      var pGetClidFromPrnsId = function(prnsId) {
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