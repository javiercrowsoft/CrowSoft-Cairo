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

      var C_MODULE = "cDespachoImpCalculoListDoc";

      var K_FECHA_INI = 4;
      var K_FECHA_FIN = 5;
      var K_PROV_ID = 6;
      var K_TITULO = 7;
      var K_VIA = 8;
      var K_VIA_EMPRESA = 9;
      var K_FACTURA = 10;
      var K_DESCRIP = 11;

      var C_FECHA_INI = "FechaIni";
      var C_FECHA_FIN = "FechaFin";

      var C_IMG_TASK = 1;

      var m_dialog;

      var m_fechaIniV = "";
      var m_fechaFinV = "";

      var m_fechaIni = null;
      var m_fechaFin = null;

      var m_provId = "";
      var m_proveedor = "";
      var m_titulo = "";
      var m_via = "";
      var m_viaempresa = "";
      var m_factura = "";
      var m_descrip = "";

      var m_properties;

      var m_listController;

      var m_menuLoaded;

      var m_menuShowNotes = 0;
      var m_menuShowInfoProv = 0;
      var m_menuAddNote = 0;

      var m_apiPath = DB.getAPIVersion();
      var SAVE_ERROR = getText(2175, ""); // Error al grabar los párametros de navegación de Xxxx

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

            case m_menuShowInfoProv:
              D.showInfo(Cairo.Tables.PROVEEDOR, getProvId());
              break;

            case m_menuShowNotes:
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

            if(iProp.getSelectIntValue() !== "") {
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

            if(iProp.getSelectIntValue() !== "") {
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

          case K_PROV_ID:
            m_provId = m_dialog.getProperties().item(mComprasConstantes.PROV_ID).getSelectIntValue();

            break;

          case K_TITULO:
            m_titulo = m_dialog.getProperties().item(mComprasConstantes.DIC_TITULO).getValue();

            break;

          case K_VIA:
            m_via = m_dialog.getProperties().item(mComprasConstantes.DIC_VIA).getValue();

            break;

          case K_VIA_EMPRESA:
            m_viaempresa = m_dialog.getProperties().item(mComprasConstantes.DIC_VIAEMPRESA).getValue();

            break;

          case K_FACTURA:
            m_factura = m_dialog.getProperties().item(mComprasConstantes.DIC_FACTURA).getValue();

            break;

          case K_DESCRIP:
            m_descrip = m_dialog.getProperties().item(mComprasConstantes.DIC_DESCRIP).getValue();

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

        sqlstmt = "sp_lsdoc_despachoimpcalculos ";

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

        sqlstmt = sqlstmt+ Cairo.Database.sqlString(m_provId)+ ",";
        sqlstmt = sqlstmt+ Cairo.Database.sqlString(m_titulo)+ ",";
        sqlstmt = sqlstmt+ Cairo.Database.sqlString(m_via)+ ",";
        sqlstmt = sqlstmt+ Cairo.Database.sqlString(m_viaempresa)+ ",";
        sqlstmt = sqlstmt+ Cairo.Database.sqlString(m_factura)+ ",";
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

        strError = getText(2175, "");
        //Error al grabar los párametros de navegación de Cálculos de Coeficiente para Despachos de Importación

        var register = null;
        var register = new DB.Register();

        var sqlstmt = null;

        sqlstmt = "delete ListaDocumentoParametro where pre_id = "+ csComprasPrestacion.cSPRECPRALISTDESPIMPOCALC.toString()+ " and us_id = "+ m_us_id;

        if(!Cairo.Database.execute(sqlstmt, "cIABMClient_Save", C_MODULE, strError)) { return false; }

        register.setTable(Cairo.Constants.LISTADOCUMENTOPARAMETRO);
        register.setUtilizaIdentity(true);

        var property = null;
        var _count = m_dialog.getProperties().size();
        for(var _i = 0; _i < _count; _i++) {
          property = m_dialog.getProperties().item(_i);

          register.getFields().clear();

          switch (property.getKey()) {
            case K_FECHA_INI:

              if(property.getSelectIntValue() !== "") {
                fields.add(Cairo.Constants.LDP_VALOR, property.getSelectIntValue(), Cairo.Constants.Types.text);
              }
              else {
                fields.add(Cairo.Constants.LDP_VALOR, property.getValue(), Cairo.Constants.Types.text);
              }
              fields.add(Cairo.Constants.LDP_ORDEN, 10, Cairo.Constants.Types.integer);
              fields.add(Cairo.Constants.LDP_ID, K_FECHA_INI, Cairo.Constants.Types.integer);

              break;

            case K_FECHA_FIN:

              if(property.getSelectIntValue() !== "") {
                fields.add(Cairo.Constants.LDP_VALOR, property.getSelectIntValue(), Cairo.Constants.Types.text);
              }
              else {
                fields.add(Cairo.Constants.LDP_VALOR, property.getValue(), Cairo.Constants.Types.text);
              }
              fields.add(Cairo.Constants.LDP_ORDEN, 20, Cairo.Constants.Types.integer);
              fields.add(Cairo.Constants.LDP_ID, K_FECHA_FIN, Cairo.Constants.Types.integer);

              break;

            case K_PROV_ID:
              fields.add(Cairo.Constants.LDP_VALOR, property.getSelectIntValue(), Cairo.Constants.Types.text);
              fields.add(Cairo.Constants.LDP_ORDEN, 30, Cairo.Constants.Types.integer);
              fields.add(Cairo.Constants.LDP_ID, K_PROV_ID, Cairo.Constants.Types.integer);

              break;

            case K_TITULO:
              fields.add(Cairo.Constants.LDP_VALOR, property.getValue(), Cairo.Constants.Types.text);
              fields.add(Cairo.Constants.LDP_ORDEN, 40, Cairo.Constants.Types.integer);
              fields.add(Cairo.Constants.LDP_ID, K_TITULO, Cairo.Constants.Types.integer);

              break;

            case K_VIA:
              fields.add(Cairo.Constants.LDP_VALOR, property.getValue(), Cairo.Constants.Types.text);
              fields.add(Cairo.Constants.LDP_ORDEN, 50, Cairo.Constants.Types.integer);
              fields.add(Cairo.Constants.LDP_ID, K_VIA, Cairo.Constants.Types.integer);

              break;

            case K_VIA_EMPRESA:
              fields.add(Cairo.Constants.LDP_VALOR, property.getValue(), Cairo.Constants.Types.text);
              fields.add(Cairo.Constants.LDP_ORDEN, 60, Cairo.Constants.Types.integer);
              fields.add(Cairo.Constants.LDP_ID, K_VIA_EMPRESA, Cairo.Constants.Types.integer);

              break;

            case K_FACTURA:
              fields.add(Cairo.Constants.LDP_VALOR, property.getValue(), Cairo.Constants.Types.text);
              fields.add(Cairo.Constants.LDP_ORDEN, 70, Cairo.Constants.Types.integer);
              fields.add(Cairo.Constants.LDP_ID, K_FACTURA, Cairo.Constants.Types.integer);

              break;

            case K_DESCRIP:
              fields.add(Cairo.Constants.LDP_VALOR, property.getValue(), Cairo.Constants.Types.text);
              fields.add(Cairo.Constants.LDP_ORDEN, 80, Cairo.Constants.Types.integer);
              fields.add(Cairo.Constants.LDP_ID, K_DESCRIP, Cairo.Constants.Types.integer);

              break;
          }

          fields.add(C.US_ID, m_us_id, Cairo.Constants.Types.id);
          fields.add(C.PRE_ID, csComprasPrestacion.cSPRECPRALISTDESPIMPOCALC, Cairo.Constants.Types.id);

          if(!Cairo.Database.save(register, , "cIABMListDocClient_Save", C_MODULE, strError)) { return false; }

        }

        if(!load(m_us_id)) { return false; }

        return true;
      };

      self.getTitle = function() {
        // Coeficiente de Costo de Importación
        return getText(2176, "");
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

      var loadCollection = function() {
        var c;

        m_properties.clear();

        c = m_properties.add(null, C_FECHA_INI);
        c.setType(T.date);
        c.setName(getText(1203, "")); // Fecha desde
        c.setKey(K_FECHA_INI);
        c.setValue((m_fechaIniV !== "") ? m_fechaIniV : m_fechaIni);

        c = m_properties.add(null, C_FECHA_FIN);
        c.setType(T.date);
        c.setName(getText(1204, "")); // Fecha hasta
        c.setKey(K_FECHA_FIN);
        c.setValue((m_fechaFinV !== "") ? m_fechaFinV : m_fechaFin);

        c = m_properties.add(null, C.PROV_ID);
        c.setType(T.select);
        c.setSelectTable(Cairo.Tables.PROVEEDOR);
        c.setName(getText(1151, "")); // Proveedor
        c.setKey(K_PROV_ID);
        c.setValue(m_proveedor);
        c.setSelectId(val(m_provId));
        c.setSelectIntValue(m_provId);

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
        c.setSelectTable(Cairo.Tables.CONDICIONES_DE_PAGO);
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

        c = m_dialog.getProperties().add(null, mComprasConstantes.PROV_ID);
        c.setType(Dialogs.PropertyType.select);
        c.setSelectTable(Cairo.Tables.PROVEEDOR);
        // Proveedor
        c.setName(getText(1151, ""));
        c.setKey(K_PROV_ID);
        value = m_proveedor;
        if(m_provId.Substring(0, 1).toUpperCase() === KEY_NODO) {
          value = GetNombreRama(Cairo.Tables.PROVEEDOR, Cairo.Util.val(m_provId.Substring(2)), bExists);
          if(!bExists) { m_provId = "0"; }
        }
        c.setValue(value);
        c.setSelectId(Cairo.Util.val(m_provId));
        c.setSelectIntValue(m_provId);

        c = m_dialog.getProperties().add(null, mComprasConstantes.DIC_TITULO);
        c.setType(Dialogs.PropertyType.text);
        // Título
        c.setName(getText(1864, ""));
        c.setSize(255);
        c.setKey(K_TITULO);
        c.setValue(m_titulo);

        c = m_dialog.getProperties().add(null, mComprasConstantes.DIC_VIA);
        c.setType(Dialogs.PropertyType.text);
        // Via
        c.setName(getText(1865, ""));
        c.setSize(255);
        c.setKey(K_VIA);
        c.setValue(m_via);

        c = m_dialog.getProperties().add(null, mComprasConstantes.DIC_VIAEMPRESA);
        c.setType(Dialogs.PropertyType.text);
        // Vía Empresa
        c.setName(getText(1886, ""));
        c.setSize(255);
        c.setKey(K_VIA_EMPRESA);
        c.setValue(m_viaempresa);

        c = m_dialog.getProperties().add(null, mComprasConstantes.DIC_FACTURA);
        c.setType(Dialogs.PropertyType.text);
        // Factura
        c.setName(getText(1866, ""));
        c.setSize(255);
        c.setKey(K_FACTURA);
        c.setValue(m_factura);

        c = m_dialog.getProperties().add(null, mComprasConstantes.DIC_DESCRIP);
        c.setType(Dialogs.PropertyType.text);
        // Observaciones
        c.setName(getText(1861, ""));
        c.setSize(255);
        c.setKey(K_DESCRIP);
        c.setValue(m_descrip);

        createMenu();
        if(!m_dialog.showDocumentList(self)) { return false; }

        return true;
      };

      var refreshCollection = function() {
        return m_dialog.showValues(m_properties);
      };

      var load = function() {

        return DB.getData("load[" + m_apiPath + "compras/despachosimpcalculo/parameters]").then(
          function(response) {

            if(response.success !== true) { return false; }

            if(response.data.id === NO_ID) {

              m_fechaIniV = "";
              m_fechaIni = Cairo.Dates.today();
              m_fechaFinV = "";
              m_fechaFin = Cairo.Dates.DateNames.getDateByName('h-60');

              m_provId = NO_ID;
              m_proveedor = "";
              m_titulo = "";
              m_via = "";
              m_viaempresa = "";
              m_factura = "";
              m_descrip = "";

            }
            else {

              m_fechaIniV = valField(response.data, C.FROM);
              m_fechaIni = valField(response.data, C.FROM);
              m_fechaIni = isDate(m_fechaIni) ? getDateValue(m_fechaIni) : today();

              m_fechaFinV = valField(response.data, C.TO);
              m_fechaFin = valField(response.data, C.TO);
              m_fechaFin = isDate(m_fechaFin) ? getDateValue(m_fechaFin) : today();

              m_provId = valField(response.data, C.PROV_ID);
              m_proveedor = valField(response.data, C.PROV_NAME);

            }

            return true;
          });

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

      var createMenu = function() {


        if(m_menuLoaded) { return; }

        m_menuLoaded = true;

        // Ver Info del Proveedor
        m_menuShowInfoProv = m_objList.addMenu(getText(1887, ""));
        // Agregar Nota
        m_menuAddNote = m_objList.addMenu(getText(1615, ""));
        // Ver Notas
        m_menuShowNotes = m_objList.addMenu(getText(1616, ""));
      };

      var getProvId = function() {


        var dicId = null;
        var provId = null;

        dicId = m_dialog.getId();
        DB.getData(mComprasConstantes.DESPACHOIMPCALCULO, mComprasConstantes.DIC_ID, dicId, mComprasConstantes.PROV_ID, provId);

        return provId;
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