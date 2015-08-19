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

      // cOrdenCompra
      // 27-01-2004

      // pc                  reemplazar por el prefijo de la tabla (ej pro)
      // OrdenCompra         reemplazar por el nombre de la tabla (ej Provincia)
      // cOrdenCompra        reemplazar por el nombre de la clase (ej cProvincia)
      // Ordenes de Compra   reemplazar por el nombre logico del abm (ej Provincias)
      // PreCpra             reemplazar por el nombre logico del abm (ej PreG)

      var C_MODULE = "cOrdenCompra";

      var C_ITEMS = "ITEMS";

      // HIDECOLS
      var C_HIDECOLSOC = "HideColsOc";

      var K_NUMERO = 1;
      var K_NRODOC = 2;
      var K_DESCRIP = 3;
      var K_FECHA = 4;
      var K_FECHAENTREGA = 5;
      var K_NETO = 6;
      var K_IVARI = 7;
      var K_IVARNI = 8;
      var K_TOTAL = 9;
      var K_PROV_ID = 10;
      var K_DOC_ID = 11;
      var K_LP_ID = 13;
      var K_LD_ID = 14;
      var K_ITEMS = 15;
      var K_CPG_ID = 16;
      var K_EST_ID = 17;
      var K_CCOS_ID = 18;
      var K_SUC_ID = 19;
      var K_DESCUENTO1 = 20;
      var K_DESCUENTO2 = 21;
      var K_IMPORTEDESC1 = 22;
      var K_IMPORTEDESC2 = 23;
      var K_SUBTOTAL = 24;
      var K_LGJ_ID = 27;

      var K_ORDENCOMPRA = 117;
      var K_PRESUPUESTO = 118;
      var K_MAQUINA = 119;
      var K_MAQUINANRO = 120;
      var K_MAQUINAMODELO = 121;
      var K_FLETEAEREO = 122;
      var K_FLETEMARITIMO = 123;
      var K_FLETECORREO = 124;
      var K_FLETECAMION = 125;
      var K_FLETEOTROS = 126;

      var K_CLI_ID = 131;

      // HIDECOLS
      var K_HIDECOLS = 41;

      var KI_OC_ID = 1;
      var KI_OCI_ID = 2;
      var KI_ORDEN = 3;
      var KI_CANTIDAD = 4;
      var KI_DESCRIP = 6;
      var KI_PRECIO = 7;
      var KI_IMPORTE = 8;
      var KI_NETO = 9;
      var KI_IVARI = 10;
      var KI_IVARNI = 11;
      var KI_PR_ID = 13;
      var KI_LPI_ID = 14;
      var KI_LDI_ID = 15;
      var KI_IVARIPERCENT = 16;
      var KI_IVARNIPERCENT = 17;
      var KI_DESCUENTO = 18;
      var KI_UNIDAD = 19;
      var KI_PRECIO_LP = 20;
      var KI_PRECIO_USR = 21;
      var KI_CCOS_ID = 22;

      // pseudo-constantes
      var c_ErrorSave = "";
      var c_strTitle = "";

      var m_id = 0;
      var m_numero = 0;
      var m_estado = "";
      var m_est_id = 0;
      var m_nrodoc = "";
      var m_descrip = "";
      var m_fecha = null;
      var m_fechaentrega = null;
      var m_neto = 0;
      var m_ivari = 0;
      var m_ivarni = 0;
      var m_total = 0;
      var m_subTotal = 0;
      var m_descuento1 = 0;
      var m_descuento2 = 0;
      var m_importeDesc1 = 0;
      var m_importeDesc2 = 0;
      var m_cpg_id = 0;
      var m_condicionPago = "";
      var m_ccos_id = 0;
      var m_centroCosto = "";
      var m_suc_id = 0;
      var m_sucursal = "";
      var m_prov_id = 0;
      var m_proveedor = "";
      var m_doc_id = 0;
      var m_documento = "";
      var m_doct_id = 0;
      var m_lp_id = 0;
      var m_listaPrecio = "";
      var m_ld_id = 0;
      var m_listaDescuento = "";
      var m_creado = null;
      var m_modificado = null;
      var m_modifico = 0;
      var m_firmado;
      var m_lgj_id = 0;
      var m_legajo = "";

      var m_ordencompra = "";
      var m_presupuesto = "";
      var m_maquina = "";
      var m_maquinanro = "";
      var m_maquinamodelo = "";
      var m_fleteaereo;
      var m_fletemaritimo;
      var m_fletecorreo;
      var m_fletecamion;
      var m_fleteotros;

      var m_cli_id = 0;
      var m_cliente = "";

      var m_taPropuesto;
      var m_taMascara = "";

      var m_editing;

      var m_footer;
      var m_items;
      var m_dialog;
      var m_listController = null;

      var m_lastDoc = 0;
      var m_lastProv = 0;
      var m_lastDocName = "";
      var m_lastProvName = "";

      var m_isNew;

      var m_branchId = 0;
      var m_treeId = 0;

      var m_itemsDeleted = "";

      var m_copy;

      var m_generalConfig;

      var m_bIva;
      var m_bIvaRni;

      var m_docEditable;
      var m_docEditMsg = "";

      var m_pcIds = 0;

      var m_objApply;

      var m_apiPath = DB.getAPIVersion();

      // Preferencias del Usuario
      //
      var m_userCfg;

      // Edit Apply
      //
      self.refresh = function() {
        load(m_id);
        pRefreshProperties();
      };

      self.terminateWizard = function(id) {
        // **TODO:** on error resume next found !!!
        if(id != Cairo.Constants.NO_ID) {
          self.edit(id);
        }
      };

      self.showOrdenPedido = function(vPcIds) { // TODO: Use of ByRef founded Public Sub ShowOrdenPedido(ByRef vPcIds() As Long)
        try {

          m_prov_id = Cairo.Constants.NO_ID;
          m_proveedor = "";

          var i = null;
          G.redim(m_pcIds, vPcIds.Length + 1);
          for (i = 1; i <= vPcIds.Length + 1; i++) {
            m_pcIds[i] = vPcIds(i - 1);
          }

          if(!pInitMembers()) {
            return;
          }

          pShowStartWizard();

          // **TODO:** goto found: GoTo ExitProc;
        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, "ShowOrdenPedido", C_MODULE, "");
          // **TODO:** label found: ExitProc:;
        }
        // **TODO:** on error resume next found !!!
      };

      var pInitMembers = function() {
        self.setDialog(new cABMGeneric());
        setCIEditGenericDoc_Footer(new cABMGeneric());
        setCIEditGenericDoc_Items(new cABMGeneric());

        if(!DoCairo.Security.anAccess(csComprasPrestacion.cSPRECPRANEWORDEN, Cairo.Constants.NO_ID, csE_DocTypePrestacion.cSEDOCTPRENEW)) {
          return null;
        }
        return true;
      };

      self.copy = function() {

        if(!DoCairo.Security.anAccessEx(csComprasPrestacion.cSPRECPRANEWORDEN, m_doc_id, csE_DocTypePrestacion.cSEDOCTPRENEW, true)) { return false; }

        updateList();

        m_isNew = true;

        m_listController.updateEditorKey(self, Cairo.Constants.NO_ID);
        m_copy = true;
        m_docEditable = true;
        m_docEditMsg = "";

        // Obtengo el numero para este comprobante
        //
        GetDocNumber(m_lastDoc, m_dialog, m_taPropuesto, mComprasConstantes.OC_NRODOC);
        pSetEnabled();
      };

      self.editNew = function() {

        updateList();

        m_isNew = true;

        m_listController.updateEditorKey(self, Cairo.Constants.NO_ID);

        return load(Cairo.Constants.NO_ID).then(
          function(ignored) {
            return refreshCollection();
          }
        );
        m_lastProv = Cairo.Constants.NO_ID;

        if(!m_docEditable) {
          if(LenB(m_docEditMsg)) {
            MsgWarning(m_docEditMsg);
          }
        }

        if(m_dialog.getProperties().item(mComprasConstantes.DOC_ID).getSelectId() == Cairo.Constants.NO_ID) {
          //'Debe indicar un documento
          MsgInfo(Cairo.Language.getText(1562, ""));
        }

        // Obtengo los datos por defecto del proveedor
        //
        pSetDatosProveedor();

        // Obtengo el numero para este comprobante
        //
        GetDocNumber(m_lastDoc, m_dialog, m_taPropuesto, mComprasConstantes.OC_NRODOC);
      };

      self.getApplication = function() {
        return Cairo.appName;
      };

      self.editDocumentsEnabled = function() {
        return m_id != Cairo.Constants.NO_ID;
      };

      self.copyEnabled = function() {
        return true;
      };

      self.addEnabled = function() {
        return true;
      };

      self.showDocDigital = function() {
        var _rtn = null;
        try {

          if(m_id == Cairo.Constants.NO_ID) { return _rtn; }

          var doc = new Cairo.DocDigital();

          doc.setClientTable(mComprasConstantes.ORDENCOMPRA);
          doc.setClientTableID(m_id);

          _rtn = doc.showDocs(Cairo.Database);

        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, "cIABMClient_ShowDocDigital", C_MODULE, "");
        }

        return _rtn;
      };

      self.messageEx = function(messageID,  info) {
        var _rtn = null;

        switch (messageID) {
          case Dialogs.Message.MSG_DOC_FIRST:
          case Dialogs.Message.MSG_DOC_PREVIOUS:
          case Dialogs.Message.MSG_DOC_NEXT:
          case Dialogs.Message.MSG_DOC_LAST:
            _rtn = pMove(messageID);
            break;

          case Dialogs.Message.MSG_DOC_SIGNATURE:
            _rtn = pFirmar();
            break;

          case Dialogs.Message.MSG_GRID_ROW_DELETED:
            _rtn = true;
            pShowTotales(cIABMGridCellValue.getItems(m_items, C_ITEMS).Grid.cIABMGrid.getRows());

            break;

          case Dialogs.Message.MSG_DOC_EDIT_STATE:
            //'Orden de compra
            ShowEditState(m_docEditMsg, Cairo.Language.getText(1924, ""));

            break;

          case Dialogs.Message.MSG_DOC_DELETE:
            if(self.delete(m_id)) {
              _rtn = true;
              pMove(Dialogs.Message.MSG_DOC_NEXT);
            }

            break;

          case Dialogs.Message.MSG_DOC_APPLY:
            pShowApply();

            break;

          case Dialogs.Message.MSG_DOC_ANULAR:
            DocAnular(m_id, m_est_id, m_estado, csComprasPrestacion.cSPRECPRAANULARORDEN, csComprasPrestacion.cSPRECPRADESANULARORDEN, m_dialog, m_docEditable, m_docEditMsg, "sp_DocOrdenCompraAnular", "sp_DocOrdenCompraEditableGet");
            pSetEnabled();

            break;

          case Dialogs.Message.MSG_DOC_REFRESH:
            load(m_id);
            pRefreshProperties();

            break;

          case Dialogs.Message.MSG_DOC_NEW_WITH_WIZARD:
            _rtn = true;

            break;

          case Dialogs.Message.MSG_DOC_EX_GET_ITEMS:
            _rtn = m_items;

            break;

          case Dialogs.Message.MSG_DOC_EX_GET_FOOTERS:
            _rtn = m_footer;

            //' En info cABMInteface nos
            break;

          case Dialogs.Message.MSG_DOC_SEARCH                    :
            // indica si hay cambios sin
            // guardar
            cPublicDoc.documentSearch(csEDocumentoTipo.cSEDT_ORDENCOMPRA, self, !CBool(info));

            break;

          case Dialogs.Message.MSG_DOC_DOC_EDIT:

            if(m_id) {

              if(m_docEditable) {

                //'Este documento puede editarse normalmente
                MsgInfo(Cairo.Language.getText(1555, ""));
              }
              else {

                if(DocCanSave(m_dialog, mComprasConstantes.OC_FECHA)) {

                  var editDoc = null;
                  editDoc = new cEditDocEx();

                  editDoc.setObjectClient(self);
                  editDoc.edit(m_id, m_doct_id, mComprasConstantes.ORDENCOMPRA, mComprasConstantes.OC_ID, mComprasConstantes.ORDENCOMPRAITEM, mComprasConstantes.OCI_ID, csComprasPrestacion.cSPRECPRANEWORDEN, csComprasPrestacion.cSPRECPRAEDITORDEN, Cairo.Constants.NO_ID, m_prov_id, true);
                }

              }

            }
            else {
              MsgInfo(Cairo.Language.getText(1556, ""));
              //Esta opción solo sirve para modificar documentos guardados y aplicados
            }

            break;

          case Dialogs.Message.MSG_DOC_DOC_ACTION:

            if(m_id) {
              pShowRemito();
            }
            else {
              MsgInfo(Cairo.Language.getText(1556, ""));
              //Esta opción solo sirve para modificar documentos guardados y aplicados
            }

            break;

          case Dialogs.Message.MSG_DOC_HISTORY:

            if(m_id != Cairo.Constants.NO_ID) {

              ShowHistory(csETablesCompras.cSORDENCOMPRA, m_id, m_documento+ " "+ m_nrodoc);
            }
            else {

              //' "El documento aun no ha sido guardado
              MsgInfo(Cairo.Language.getText(1552, ""));
            }

            break;

          case Dialogs.Message.MSG_EXPORT_GET_EMAIL:

            var property = m_dialog.getProperties().item(mComprasConstantes.PROV_ID);
            _rtn = GetEmailFromProveedor(property.getSelectId());

            break;

          case Dialogs.Message.MSG_GRID_VIRTUAL_ROW:

            _rtn = pProcessMultiRow(info);

            break;

          case Dialogs.Message.MSG_EXPORT_GET_FILE_NAME_POSTFIX:

            _rtn = pGetFileNamePostFix();

            break;
        }


        return Cairo.Promises.resolvedPromise(_rtn);
      };

      self.discardChanges = function() {
        return Cairo.Promises.resolvedPromise(refreshCollection());
      };

      self.propertyChange = function(key) {

        switch (key) {

          case K_DOC_ID:
            // Si cambio de documento
            //
            if(cIABMProperty.docChange(m_dialog, m_lastDoc, m_lastDocName)) {

              // Si cambie de documento y estaba en un comprobante ya guardado
              // tengo que mostrar el formulario sin datos, para evitar
              // que presione guardar y le cambie el doc_id al comprobante por error
              //
              if(m_id != Cairo.Constants.NO_ID && m_doc_id != m_lastDoc) { self.edit(csDocChanged); }

              // Obtengo el numero para este comprobante
              //
              GetDocNumber(m_lastDoc, m_dialog, m_taPropuesto, mComprasConstantes.OC_NRODOC);

            }

            // Defino el estado de edicion del comprobante
            //
            pSetEnabled();

            break;

          case K_PROV_ID:

            // Obtengo los datos del proveedor
            //
            pSetDatosProveedor();

            // DATADD
            mPublic.self.showDataAddProveedor(m_userCfg.getShowDataAddInCompras(), m_dialog);

            break;

          case K_DESCUENTO1:
          case K_DESCUENTO2:
            pShowTotales(cIABMGridCellValue.getItems(m_items, C_ITEMS).Grid.cIABMGrid.getRows());

            // HIDECOLS
            //
            break;

          case K_HIDECOLS:

            pShowHideCols(false);

            break;
        }
      };

      self.save = function() {
        var _rtn = null;

        // Save and State
        //
        if(!DocCanEdit(m_docEditable, m_docEditMsg)) {
          _rtn = true;
          return _rtn;
        }
        if(!DocCanSave(m_dialog, mComprasConstantes.OC_FECHA)) {
          _rtn = false;
          return _rtn;
        }

        if(pGetItems().getGrid().getRows().count() == 0) {
          //'El documento debe contener al menos un item
          MsgWarning(Cairo.Language.getText(3903, ""));
          _rtn = false;
          return _rtn;
        }

        var mouse = null;
        mouse = new cMouseWait();

        DoEvents:(DoEvents: DoEvents: DoEvents);

        var register = new Cairo.Database.Register();
        register.setFieldId(mComprasConstantes.OC_TMPID);
        register.setTable(mComprasConstantes.ORDENCOMPRATMP);

        register.setId(Cairo.Constants.NEW_ID);

        register.setPath(m_apiPath + "general/ordencompra");

        if(m_copy) {
          register.getFields().add2(mComprasConstantes.OC_ID, Cairo.Constants.NEW_ID, Cairo.Constants.Types.long);
        }
        else {
          register.getFields().add2(mComprasConstantes.OC_ID, m_id, Cairo.Constants.Types.long);
        }

        if(register.getID() == Cairo.Constants.NEW_ID) {
          m_est_id = CSGeneralEx2.csEEstado.cSEEST_PENDIENTE;
        }

        var _count = m_dialog.getProperties().size();
        for (var _i = 0; _i < _count; _i++) {
          var property = m_dialog.getProperties().item(_i);
          switch (property.getKey()) {
            case K_NUMERO:
              register.getFields().add2(mComprasConstantes.OC_NUMERO, property.getValue(), Cairo.Constants.Types.long);
              break;

            case K_NRODOC:
              register.getFields().add2(mComprasConstantes.OC_NRODOC, property.getValue(), Cairo.Constants.Types.text);
              break;

            case K_DESCRIP:
              register.getFields().add2(mComprasConstantes.OC_DESCRIP, property.getValue(), Cairo.Constants.Types.text);
              break;

            case K_FECHA:
              register.getFields().add2(mComprasConstantes.OC_FECHA, property.getValue(), Cairo.Constants.Types.date);
              break;

            case K_FECHAENTREGA:
              register.getFields().add2(mComprasConstantes.OC_FECHAENTREGA, property.getValue(), Cairo.Constants.Types.date);
              break;

            case K_PROV_ID:
              register.getFields().add2(mComprasConstantes.PROV_ID, property.getSelectId(), Cairo.Constants.Types.id);
              break;

            case K_CCOS_ID:
              register.getFields().add2(mComprasConstantes.CCOS_ID, property.getSelectId(), Cairo.Constants.Types.id);
              break;

            case K_SUC_ID:
              register.getFields().add2(mComprasConstantes.SUC_ID, property.getSelectId(), Cairo.Constants.Types.id);
              break;

            case K_DESCUENTO1:
              register.getFields().add2(mComprasConstantes.OC_DESCUENTO1, property.getValue(), Cairo.Constants.Types.currency);
              break;

            case K_DESCUENTO2:
              register.getFields().add2(mComprasConstantes.OC_DESCUENTO2, property.getValue(), Cairo.Constants.Types.currency);
              break;

            case K_DOC_ID:
              register.getFields().add2(mComprasConstantes.DOC_ID, property.getSelectId(), Cairo.Constants.Types.id);
              break;

            case K_LP_ID:
              register.getFields().add2(mComprasConstantes.LP_ID, property.getSelectId(), Cairo.Constants.Types.id);
              break;

            case K_LD_ID:
              register.getFields().add2(mComprasConstantes.LD_ID, property.getSelectId(), Cairo.Constants.Types.id);
              break;

            case K_CPG_ID:
              register.getFields().add2(mComprasConstantes.CPG_ID, property.getSelectId(), Cairo.Constants.Types.id);
              break;

            case K_LGJ_ID:
              register.getFields().add2(mComprasConstantes.LGJ_ID, property.getSelectId(), Cairo.Constants.Types.id);

              break;

            case K_ORDENCOMPRA:
              register.getFields().add2(mComprasConstantes.OC_ORDENCOMPRA, property.getValue(), Cairo.Constants.Types.text);
              break;

            case K_PRESUPUESTO:
              register.getFields().add2(mComprasConstantes.OC_PRESUPUESTO, property.getValue(), Cairo.Constants.Types.text);
              break;

            case K_MAQUINA:
              register.getFields().add2(mComprasConstantes.OC_MAQUINA, property.getValue(), Cairo.Constants.Types.text);
              break;

            case K_MAQUINANRO:
              register.getFields().add2(mComprasConstantes.OC_MAQUINANRO, property.getValue(), Cairo.Constants.Types.text);
              break;

            case K_MAQUINAMODELO:
              register.getFields().add2(mComprasConstantes.OC_MAQUINAMODELO, property.getValue(), Cairo.Constants.Types.text);
              break;

            case K_FLETEAEREO:
              register.getFields().add2(mComprasConstantes.OC_FLETEAEREO, property.getValue(), Cairo.Constants.Types.boolean);
              break;

            case K_FLETEMARITIMO:
              register.getFields().add2(mComprasConstantes.OC_FLETEMARITIMO, property.getValue(), Cairo.Constants.Types.boolean);
              break;

            case K_FLETECORREO:
              register.getFields().add2(mComprasConstantes.OC_FLETECORREO, property.getValue(), Cairo.Constants.Types.boolean);
              break;

            case K_FLETECAMION:
              register.getFields().add2(mComprasConstantes.OC_FLETECAMION, property.getValue(), Cairo.Constants.Types.boolean);
              break;

            case K_FLETEOTROS:
              register.getFields().add2(mComprasConstantes.OC_FLETEOTROS, property.getValue(), Cairo.Constants.Types.boolean);

              break;

            case K_CLI_ID:
              register.getFields().add2(mComprasConstantes.CLI_ID, property.getSelectId(), Cairo.Constants.Types.id);

              break;
          }
        }

        var _count = m_footer.getProperties().size();
        for (var _i = 0; _i < _count; _i++) {
          property = m_footer.getProperties().item(_i);
          switch (property.getKey()) {
            case K_TOTAL:
              register.getFields().add2(mComprasConstantes.OC_TOTAL, property.getValue(), Cairo.Constants.Types.currency);
              break;

            case K_NETO:
              register.getFields().add2(mComprasConstantes.OC_NETO, property.getValue(), Cairo.Constants.Types.currency);
              break;

            case K_IVARI:
              if(m_bIva) {
                register.getFields().add2(mComprasConstantes.OC_IVARI, property.getValue(), Cairo.Constants.Types.currency);
              }
              break;

            case K_IVARNI:
              if(m_bIvaRni) {
                register.getFields().add2(mComprasConstantes.OC_IVARNI, property.getValue(), Cairo.Constants.Types.currency);
              }
              break;

            case K_SUBTOTAL:
              register.getFields().add2(mComprasConstantes.OC_SUBTOTAL, property.getValue(), Cairo.Constants.Types.currency);
              break;

            case K_IMPORTEDESC1:
              register.getFields().add2(mComprasConstantes.OC_IMPORTEDESC1, property.getValue(), Cairo.Constants.Types.currency);
              break;

            case K_IMPORTEDESC2:
              register.getFields().add2(mComprasConstantes.OC_IMPORTEDESC2, property.getValue(), Cairo.Constants.Types.currency);
              break;
          }
        }

        register.getFields().add2(Cairo.Constants.EST_ID, m_est_id, Cairo.Constants.Types.id);
        //register.Fields.Add2 cscDoctId, CSDocumento2.csEDT_OrdenCompra, csId

        register.getFields().setHaveLastUpdate(true);
        register.getFields().setHaveWhoModify(true);

        register.prepareTransaction();
        if(!Cairo.Database.save(register, , "cIABMClient_Save", C_MODULE, c_ErrorSave)) { return _rtn; }

        if(!pSaveItems(register.getID(register))) { return _rtn; }

        var sqlstmt = null;
        var rs = null;
        sqlstmt = "sp_DocOrdenCompraSave "+ register.getID().toString();

        if(!Cairo.Database.openRs(sqlstmt, rs, , , , "cIABMClient_Save", C_MODULE, c_ErrorSave)) { return _rtn; }

        if(rs.isEOF()) { return _rtn; }

        var id = null;
        if(!GetDocIDFromRecordset(rs, id)) { return _rtn; }

        m_copy = false;

        _rtn = load(id);

        return _rtn;
      };

      var updateList = function() {
        if(m_id == Cairo.Constants.NO_ID) { return; }
        if(m_listController == null) { return; }

        if(m_isNew) {
          m_listController.addLeave(m_id, m_branchId);
        }
        else {
          m_listController.refreshBranch(m_id, m_branchId);
        }
      };

      self.terminate = function() {

        m_editing = false;

        try {
          if(m_listController != null) {
            updateList();
            m_listController.removeEditor(self);
          }
        }
        catch (ignored) {
          Cairo.logError('Error in terminate', ignored);
        }
      };

      self.getPath = function() {
        return "#general/ordencompra/" + m_id.toString();
      };

      self.getEditorName = function() {
        var id = m_id ? m_id.toString() : "N" + (new Date).getTime().toString();
        return "ordencompra" + id;
      };

      self.getTitle = function() {

        return c_strTitle;
      };

      self.validate = function() {

        var property = null;

        var _count = m_dialog.getProperties().size();
        for (var _i = 0; _i < _count; _i++) {
          property = m_dialog.getProperties().item(_i);
          switch (property.getKey()) {
            case K_FECHA:
              if(ValEmpty(property.getValue(), Cairo.Constants.Types.date)) {
                //'Debe indicar una fecha
                MsgInfo(Cairo.Language.getText(1558, ""));
              }
              break;

            case K_FECHAENTREGA:
              if(ValEmpty(property.getValue(), Cairo.Constants.Types.date)) {
                //'Debe indicar una fecha de entrega
                MsgInfo(Cairo.Language.getText(1564, ""));
              }
              break;

            case K_PROV_ID:
              if(ValEmpty(property.getSelectId(), Cairo.Constants.Types.id)) {
                //'Debe indicar un proveedor
                MsgInfo(Cairo.Language.getText(1860, ""));
              }
              break;

            case K_DOC_ID:
              if(ValEmpty(property.getSelectId(), Cairo.Constants.Types.id)) {
                //'Debe indicar un documento
                MsgInfo(Cairo.Language.getText(1562, ""));
              }
              break;

            case K_CPG_ID:
              if(ValEmpty(property.getSelectId(), Cairo.Constants.Types.id)) {
                //'Debe indicar una condición de pago
                MsgInfo(Cairo.Language.getText(1561, ""));
              }
              break;

            case K_SUC_ID:
              if(ValEmpty(property.getSelectId(), Cairo.Constants.Types.id)) {
                //'Debe indicar una sucursal
                MsgInfo(Cairo.Language.getText(1560, ""));
              }
              break;
          }
        }

        return Cairo.Promises.resolvedPromise(true);
      };

      var isEmptyRow = function(key,  row,  rowIndex) {
        var _rtn = null;
        try {

          switch (key) {
            case K_ITEMS:
              _rtn = pIsEmptyRow(row, rowIndex);
              break;
          }

          // **TODO:** goto found: GoTo ExitProc;
        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, "validateRow", C_MODULE, "");
          // **TODO:** label found: ExitProc:;
        }
        // **TODO:** on error resume next found !!!

        return _rtn;
      };

      //-------------------------------------------------------------------------------------
      // Documento
      var getCIDocumento_DocId = function() {
        return m_doc_id;
      };

      var getCIDocumento_DocTId = function() {
        return m_doct_id;
      };

      var getCIDocumento_Id = function() {
        return m_id;
      };

      var cIDocumento_LoadForPrint = function(id) {
        var _rtn = null;
        try {

          var sqlstmt = null;
          var rs = null;

          sqlstmt = "select doct_id, doc_id from OrdenCompra where oc_id = "+ id.toString();
          if(!Cairo.Database.openRs(sqlstmt, rs)) { return _rtn; }

          m_id = id;
          m_doc_id = Cairo.Database.valField(rs.getFields(), mComprasConstantes.DOC_ID);
          m_doct_id = Cairo.Database.valField(rs.getFields(), mComprasConstantes.DOCT_ID);

          _rtn = true;

          // **TODO:** goto found: GoTo ExitProc;
        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, "cIDocumento_LoadForPrint", C_MODULE, "");
          // **TODO:** label found: ExitProc:;
        }
        // **TODO:** on error resume next found !!!

        return _rtn;
      };

      //-------------------------------------------------------------------------------------
      self.getDialog = function() {
        return m_dialog;
      };

      self.setTreeId = function(rhs) {
        m_treeId = rhs;
      };

      self.getTreeId = function() {
        return m_treeId;
      };

      self.list = function() {
        return Cairo.Security.hasPermissionTo(csComprasPrestacion.cSPRECPRALISTORDEN);
      };

      self.setDialog = function(rhs) {
        m_dialog = rhs;
        m_dialog.setIsDocument(true);

                #If !PREPROC_SFS Then;
        var abmGen = null;

        abmGen = m_dialog;
        abmGen.FactoryObject = "CSABMInterface2.cFactory";
        abmGen.ObjForm = "CSABMInterface2.fOrdenCompra";
                #End If;
      };

      self.isEditing = function() {
        return m_editing;
      };

      self.edit = function(id,  inModalWindow) {
        var p = Cairo.Promises.resolvedPromise(false);
        try {

          if(!DoCairo.Security.anAccess(csComprasPrestacion.cSPRECPRALISTORDEN, GetdocIdFromObjAbm(m_dialog), csE_DocTypePrestacion.cSEDOCTPRELIST)) { return p; }

          // Id = csDocChanged esto significa que se cambio
          //                   el documento estando en un
          //                   comprobante ya guardado
          //
          m_isNew = id == Cairo.Constants.NO_ID || id == csDocChanged;

          p = load(id).then(
            function(success) {
              if(success) {

                if(m_dialog.getProperties().count() == 0) {
                  if(!loadCollection()) { return false; }
                }
                else {
                  pRefreshProperties();
                }

                var abmGen = null;
                abmGen = m_dialog;
                abmGen.NewKeyPropFocus = "";

                // Solo muestro asistentes si el nuevo no se esta dando por
                // un cambio de documento
                //
                if(id != csDocChanged && m_isNew && pDocDesdePedido()) {
                  pShowStartWizard();
                }
                else {
                  abmGen.NewKeyPropFocus = mComprasConstantes.PROV_ID;
                }

                m_editing = true;
                m_copy = false;

                success = true;
              }
              return success;
            });
        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, "cIEditGeneric_Edit", C_MODULE, "");
        }

        return p;
      };

      self.setTree = function(rhs) {
        m_listController = rhs;
      };

      self.setBranchId = function(rhs) {
        m_branchId = rhs;
      };

      self.getBranchId = function() {
        return m_branchId;
      };

      var columnAfterUpdate = function(key,  lRow,  lCol) {
        var _rtn = null;
        try {

          switch (key) {
            case K_ITEMS:
              var w_getItems = cIABMGridCellValue.getItems(m_items, C_ITEMS);
              pShowImporteAndIva(w_getItems.Grid.cIABMGrid.getRows(lRow));
              pShowTotales(w_getItems.Grid.cIABMGrid.getRows());
              _rtn = true;
              break;
          }

          // **TODO:** goto found: GoTo ExitProc;
        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, "columnAfterUpdate", C_MODULE, "");
          // **TODO:** label found: ExitProc:;
        }
        // **TODO:** on error resume next found !!!

        return _rtn;
      };

      var columnAfterEdit = function(key,  lRow,  lCol,  newValue,  newValueID) {
        var _rtn = null;
        try {

          switch (key) {
            case K_ITEMS:
              _rtn = pColumnAfterEdit(cIABMGridCellValue.getItems(m_items, C_ITEMS), lRow, lCol, newValue, newValueID);
              break;
          }

          // **TODO:** goto found: GoTo ExitProc;
        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, "columnAfterEdit", C_MODULE, "");
          // **TODO:** label found: ExitProc:;
        }
        // **TODO:** on error resume next found !!!

        return _rtn;
      };

      var columnBeforeEdit = function(key,  lRow,  lCol,  iKeyAscii) {
        var _rtn = null;
        try {

          switch (key) {
            case K_ITEMS:
              _rtn = pColumnBeforeEdit(cIABMGridCellValue.getItems(m_items, C_ITEMS), lRow, lCol, iKeyAscii);
              break;
          }

          // **TODO:** goto found: GoTo ExitProc;
        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, "columnBeforeEdit", C_MODULE, "");
          // **TODO:** label found: ExitProc:;
        }
        // **TODO:** on error resume next found !!!

        return _rtn;
      };

      var pColumnBeforeEdit = function(property,  lRow,  lCol,  iKeyAscii) { // TODO: Use of ByRef founded Private Function pColumnBeforeEdit(ByRef IProperty As cIABMProperty, ByVal lRow As Long, ByVal lCol As Long, ByVal iKeyAscii As Integer)
        return true;
      };

      var pGetPrecioFromRow = function(row) {
        var precio = null;

        var w_pCell = Dialogs.cell(row, KI_PRECIO_USR);
        if(G.isNumeric(w_pCell.getValue())) {
          precio = Double.parseDouble(w_pCell.getValue());
        }
        else {
          precio = 0;
        }

        return precio;
      };

      var pColumnAfterEdit = function(property,  lRow,  lCol,  newValue,  newValueID) { // TODO: Use of ByRef founded Private Function pColumnAfterEdit(ByRef IProperty As cIABMProperty, ByVal lRow As Long, ByVal lCol As Long, ByVal NewValue As Variant, ByVal NewValueID As Long)
        var row = null;

        switch (property.getGrid().getColumns(lCol).Key) {
          case KI_PR_ID:
            row = property.getGrid().getRows(lRow);
            pSetDataProducto(row, newValueID);
            pSetPrecios(row, newValueID);
            pSetDescuentos(row, newValueID, pGetPrecioFromRow(row));
            pSetTasasImpositivas(row, newValueID, newValue);

            break;

          case KI_PRECIO_USR:
            row = property.getGrid().getRows(lRow);
            pSetDescuentos(row, Dialogs.cell(row, KI_PR_ID).getID(), newValue);

            break;
        }

        return true;
      };

      var columnButtonClick = function(key,  lRow,  lCol,  iKeyAscii) {

      };

      var columnClick = function(key,  lRow,  lCol) {

      };

      var dblClick = function(key,  lRow,  lCol) {

      };

      var deleteRow = function(key,  row,  lRow) {
        var id = null;

        id = Cairo.Util.val(Dialogs.cell(row, KI_OCI_ID).getValue());

        if(id != Cairo.Constants.NO_ID) { m_itemsDeleted = m_itemsDeleted+ id.toString()+ ","; }

        return true;
      };

      var listAdHock = function(key,  row,  colIndex,  list) {

      };

      var newRow = function(key,  rows) {

      };

      var validateRow = function(key,  row,  rowIndex) {
        var _rtn = null;
        try {

          switch (key) {
            case K_ITEMS:
              _rtn = pValidateRow(row, rowIndex);
              break;
          }

          // **TODO:** goto found: GoTo ExitProc;
        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, "validateRow", C_MODULE, "");
          // **TODO:** label found: ExitProc:;
        }
        // **TODO:** on error resume next found !!!

        return _rtn;
      };

      var pIsEmptyRow = function(row,  rowIndex) {
        var cell = null;

        var bRowIsEmpty = true;

        var _count = row.size();
        for (var _i = 0; _i < _count; _i++) {
          cell = row.item(_i);
          switch (cell.getKey()) {
            case KI_CANTIDAD:
              if(!ValEmpty(cell.getValue(), Cairo.Constants.Types.currency)) {
                if(Cairo.Util.val(cell.getValue()) != 1) {
                  bRowIsEmpty = false;
                  break;
                }
              }
              break;

            case KI_PRECIO:
              if(!ValEmpty(cell.getValue(), Cairo.Constants.Types.currency)) {
                bRowIsEmpty = false;
                break;
              }
              break;

            case KI_PR_ID:
              if(!ValEmpty(cell.getId(), Cairo.Constants.Types.id)) {
                bRowIsEmpty = false;
                break;
              }
              break;
          }
        }

        return bRowIsEmpty;
      };

      var pValidateRow = function(row,  rowIndex) { // TODO: Use of ByRef founded Private Function pValidateRow(ByRef Row As CSInterfacesABM.cIABMGridRow, ByVal RowIndex As Long) As Boolean
        var cell = null;

        var strRow = " (Row: " + rowIndex.toString() + ")";

        var _count = row.size();
        for (var _i = 0; _i < _count; _i++) {
          cell = row.item(_i);
          switch (cell.getKey()) {
            case KI_CANTIDAD:
              if(ValEmpty(cell.getValue(), Cairo.Constants.Types.currency)) {
                //'Debe indicar una cantidad (1)
                MsgInfo(Cairo.Language.getText(1365, "", strRow));
              }

              // Por ahora no lo exijo
              //
              //      Case KI_PRECIO
              //        If ValEmpty(Cell.Value, csCurrency) Then
              //          MsgInfo "Debe indicar un precio" & strRow
              //          Exit Function
              //        End If

              break;

            case KI_PR_ID:
              if(ValEmpty(cell.getId(), Cairo.Constants.Types.id)) {
                //'Debe indicar un producto de compra (1)
                MsgInfo(Cairo.Language.getText(1899, "", strRow));
              }
              break;
          }
        }

        return Cairo.Promises.resolvedPromise(true);
      };


      var loadCollection = function() {
        var filter = null;
        var c = null;

                #If PREPROC_SFS Then;
        var abmGen = null;
                #Else;
        var abmGen = null;
                #End If;

        // Preferencias del usuario
        //
        var bValidateDocDefault = null;

        abmGen = m_dialog;
        abmGen.ResetLayoutMembers;

        // DATADD
        if(m_userCfg.getShowDataAddInCompras()) {
          abmGen.SetHeightToDocWithDescrip;
        }

        var w_tabs = m_dialog.getTabs();
        w_tabs.clear();

        var tab = w_tabs.add(null);
        tab.setName(Cairo.Constants.c_strGeneral);

        var tab = w_tabs.add(null);
        tab.setIndex(1);
        //'Adicionales
        tab.setName(Cairo.Language.getText(1566, ""));

        var properties = m_dialog.getProperties();

        properties.clear();

        var elem = properties.add(null, mComprasConstantes.DOC_ID);
        elem.setType(Dialogs.PropertyType.select);
        elem.setTable(CSDocumento2.CSDocumento);
        //'Documento
        elem.setName(Cairo.Language.getText(1567, ""));
        elem.setKey(K_DOC_ID);

        if(m_doc_id != Cairo.Constants.NO_ID) {
          elem.setSelectId(m_doc_id);
          elem.setValue(m_documento);
        }
        else {
          // Preferencias del usuario
          //
          elem.setSelectId(m_userCfg.getDocOcId());
          elem.setValue(m_userCfg.getDocOcNombre());

          bValidateDocDefault = elem.getSelectId() != Cairo.Constants.NO_ID;
        }

        elem.setSelectFilter(pGetDocFilter());

        var elem = properties.add(null, cDeclarations.getCsDocNumberID());
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setSubType(Dialogs.PropertySubType.Integer);
        //'Número
        elem.setName(Cairo.Language.getText(1065, ""));
        elem.setKey(K_NUMERO);
        elem.setValue(m_numero);
        elem.setEnabled(false);

        var elem = properties.add(null, cDeclarations.getCsDocEstateID());
        elem.setType(Dialogs.PropertyType.text);
        //'Estado
        elem.setName(Cairo.Language.getText(1568, ""));
        elem.setKey(K_EST_ID);
        elem.setValue(m_estado);
        elem.setEnabled(false);

        var elem = properties.add(null, mComprasConstantes.OC_FECHA);
        elem.setType(Dialogs.PropertyType.date);
        //'Fecha
        elem.setName(Cairo.Language.getText(1569, ""));
        elem.setLeftLabel(-580);
        elem.setLeft(700);
        elem.setKey(K_FECHA);
        elem.setValue(m_fecha);

        var elem = properties.add(null, mComprasConstantes.OC_FECHAENTREGA);
        elem.setType(Dialogs.PropertyType.date);
        //'Entrega
        elem.setName(Cairo.Language.getText(1570, ""));
        elem.setKey(K_FECHAENTREGA);
        elem.setValue(m_fechaentrega);

        var elem = properties.add(null, mComprasConstantes.PROV_ID);
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.PROVEEDOR);
        elem.setTopFromProperty(mComprasConstantes.OC_FECHA);
        elem.setLeft(2900);
        elem.setLeftLabel(-800);
        //'Proveedor
        elem.setName(Cairo.Language.getText(1151, ""));
        elem.setKey(K_PROV_ID);
        elem.setSelectId(m_prov_id);
        elem.setValue(m_proveedor);
        abmGen.NewKeyPropFocus = mComprasConstantes.PROV_ID;

        var elem = properties.add(null, mComprasConstantes.OC_NRODOC);
        elem.setType(Dialogs.PropertyType.text);
        //'Número"
        elem.setName(Cairo.Language.getText(1065, ""));
        elem.setSize(50);
        elem.setKey(K_NRODOC);
        elem.setValue(m_nrodoc);
        elem.setTextAlign(vbRightJustify);

        var elem = properties.add(null, mComprasConstantes.CPG_ID);
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.CONDICIONPAGO);
        //'C. pago
        elem.setName(Cairo.Language.getText(1835, ""));
        elem.setTopFromProperty(mComprasConstantes.OC_FECHA);
        elem.setLeft(5900);
        elem.setLeftLabel(-620);
        elem.setKey(K_CPG_ID);
        elem.setSelectId(m_cpg_id);
        elem.setValue(m_condicionPago);

        var elem = properties.add(null, mComprasConstantes.OC_DESCUENTO1);
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setSubType(Dialogs.PropertySubType.percentage);
        elem.setLeftLabel(-600);
        //'Desc. 1
        elem.setName(Cairo.Language.getText(1573, ""));
        elem.setKey(K_DESCUENTO1);
        elem.setValue(m_descuento1);
        elem.setWidth(1000);

        var elem = properties.add(null, mComprasConstantes.OC_DESCUENTO2);
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setSubType(Dialogs.PropertySubType.percentage);
        elem.setTopFromProperty(mComprasConstantes.OC_DESCUENTO1);
        elem.setLeft(7150);
        elem.setLeftLabel(-150);
        elem.setLeftNotChange(true);
        elem.setName("2");
        elem.setKey(K_DESCUENTO2);
        elem.setValue(m_descuento2);
        elem.setWidth(1000);

        var elem = properties.add(null, mComprasConstantes.LGJ_ID);
        elem.setType(Dialogs.PropertyType.select);
        elem.setTable(csLegajo);
        //'Legajo
        elem.setName(Cairo.Language.getText(1575, ""));
        elem.setKey(K_LGJ_ID);
        elem.setSelectId(m_lgj_id);
        elem.setValue(m_legajo);

        var elem = properties.add(null, mComprasConstantes.LP_ID);
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.LISTAPRECIO);
        //'Lista de Precios
        elem.setName(Cairo.Language.getText(1397, ""));
        elem.setSelectFilter(GetListaPrecioGetXProveedor(m_doc_id, m_prov_id));
        elem.setTopFromProperty(mComprasConstantes.OC_FECHA);
        elem.setLeft(9400);
        elem.setKey(K_LP_ID);
        elem.setSelectId(m_lp_id);
        elem.setValue(m_listaPrecio);

        var elem = properties.add(null, mComprasConstantes.LD_ID);
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.LISTADESCUENTO);
        //'Lista de Descuentos
        elem.setName(Cairo.Language.getText(1398, ""));
        elem.setSelectFilter(GetListaDescGetXProveedor(m_doc_id, m_prov_id));
        elem.setKey(K_LD_ID);
        elem.setSelectId(m_ld_id);
        elem.setValue(m_listaDescuento);

        var elem = properties.add(null, mComprasConstantes.CCOS_ID);
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.CENTROCOSTO);
        //'Centro de Costo
        elem.setName(Cairo.Language.getText(1057, ""));
        elem.setKey(K_CCOS_ID);
        elem.setSelectId(m_ccos_id);
        elem.setValue(m_centroCosto);

        var elem = properties.add(null, mComprasConstantes.SUC_ID);
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.SUCURSAL);
        //'Sucursal
        elem.setName(Cairo.Language.getText(1281, ""));
        elem.setKey(K_SUC_ID);
        elem.setSelectId(m_suc_id);
        elem.setValue(m_sucursal);

        var elem = properties.add(null, mComprasConstantes.OC_DESCRIP);
        elem.setType(Dialogs.PropertyType.text);
        elem.setSubType(Dialogs.PropertySubType.memo);
        //'Observ.
        elem.setName(Cairo.Language.getText(1211, ""));
        elem.setLeftLabel(-600);
        elem.setSize(5000);
        elem.setKey(K_DESCRIP);
        elem.setValue(m_descrip);
        elem.setLeftFromProperty(mComprasConstantes.OC_FECHA);
        elem.setTopFromProperty(mComprasConstantes.OC_NRODOC);
        elem.setWidth(4450);
        elem.setHeight(800);
        elem.setTopToPrevious(440);

        //--------------------------------------------------------------
        var elem = properties.add(null, mComprasConstantes.OC_ORDENCOMPRA);
        elem.setType(Dialogs.PropertyType.text);
        //'Orden de Compra
        elem.setName(Cairo.Language.getText(4923, ""));
        elem.setSize(50);
        elem.setKey(K_ORDENCOMPRA);
        elem.setValue(m_ordencompra);
        elem.setTabIndex(1);
        elem.setLeft(1700);
        elem.setLeftLabel(-1500);

        var elem = properties.add(null, mComprasConstantes.OC_PRESUPUESTO);
        elem.setType(Dialogs.PropertyType.text);
        //'Presupuesto
        elem.setName(Cairo.Language.getText(4924, ""));
        elem.setSize(50);
        elem.setKey(K_PRESUPUESTO);
        elem.setValue(m_presupuesto);
        elem.setTabIndex(1);

        var elem = properties.add(null, mComprasConstantes.CLI_ID);
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.CLIENTE);
        //'Cliente
        elem.setName(Cairo.Language.getText(4925, ""));
        elem.setSize(255);
        elem.setKey(K_CLI_ID);
        elem.setValue(m_cliente);
        elem.setSelectId(m_cli_id);
        elem.setTabIndex(1);

        var elem = properties.add(null, mComprasConstantes.OC_MAQUINA);
        elem.setType(Dialogs.PropertyType.text);
        //'Maquina
        elem.setName(Cairo.Language.getText(4926, ""));
        elem.setSize(255);
        elem.setKey(K_MAQUINA);
        elem.setValue(m_maquina);
        elem.setTabIndex(1);

        var elem = properties.add(null, mComprasConstantes.OC_MAQUINANRO);
        elem.setType(Dialogs.PropertyType.text);
        //'Nro. Serie
        elem.setName(Cairo.Language.getText(4927, ""));
        elem.setSize(50);
        elem.setKey(K_MAQUINANRO);
        elem.setValue(m_maquinanro);
        elem.setTabIndex(1);
        elem.setLeftLabel(-900);

        var elem = properties.add(null, mComprasConstantes.OC_MAQUINAMODELO);
        elem.setType(Dialogs.PropertyType.text);
        //'Modelo
        elem.setName(Cairo.Language.getText(4928, ""));
        elem.setSize(50);
        elem.setKey(K_MAQUINAMODELO);
        elem.setValue(m_maquinamodelo);
        elem.setTabIndex(1);
        elem.setLeftLabel(-900);

        var elem = properties.add(null, mComprasConstantes.OC_FLETEAEREO);
        elem.setType(Dialogs.PropertyType.check);
        //'Flete Aereo
        elem.setName(Cairo.Language.getText(4929, ""));
        elem.setKey(K_FLETEAEREO);
        elem.setValue(Cairo.Util.boolToInt(m_fleteaereo));
        elem.setTabIndex(1);
        elem.setTopFromProperty(mComprasConstantes.OC_ORDENCOMPRA);
        elem.setLeft(9500);

        var elem = properties.add(null, mComprasConstantes.OC_FLETEMARITIMO);
        elem.setType(Dialogs.PropertyType.check);
        //'Flete Maritimo
        elem.setName(Cairo.Language.getText(4930, ""));
        elem.setKey(K_FLETEMARITIMO);
        elem.setValue(Cairo.Util.boolToInt(m_fletemaritimo));
        elem.setTabIndex(1);
        elem.setTopToPrevious(360);

        var elem = properties.add(null, mComprasConstantes.OC_FLETECORREO);
        elem.setType(Dialogs.PropertyType.check);
        //'Flete Correo
        elem.setName(Cairo.Language.getText(4931, ""));
        elem.setKey(K_FLETECORREO);
        elem.setValue(Cairo.Util.boolToInt(m_fletecorreo));
        elem.setTabIndex(1);
        elem.setTopToPrevious(360);

        var elem = properties.add(null, mComprasConstantes.OC_FLETECAMION);
        elem.setType(Dialogs.PropertyType.check);
        //'Flete Camion
        elem.setName(Cairo.Language.getText(4932, ""));
        elem.setKey(K_FLETECAMION);
        elem.setValue(Cairo.Util.boolToInt(m_fletecamion));
        elem.setTabIndex(1);
        elem.setTopToPrevious(360);

        var elem = properties.add(null, mComprasConstantes.OC_FLETEOTROS);
        elem.setType(Dialogs.PropertyType.check);
        //'Flete Otros
        elem.setName(Cairo.Language.getText(4933, ""));
        elem.setKey(K_FLETEOTROS);
        elem.setValue(Cairo.Util.boolToInt(m_fleteotros));
        elem.setTabIndex(1);
        elem.setLeft(9500);
        elem.setTopToPrevious(360);
        //--------------------------------------------------------------

        // DATADD
        if(m_userCfg.getShowDataAddInCompras()) {

          var elem = properties.add(null, c_ProveedorDataAdd);
          elem.setType(Dialogs.PropertyType.text);
          elem.setSubType(Dialogs.PropertySubType.memo);
          elem.setWidth(10970);
          elem.setTopFromProperty(mComprasConstantes.OC_DESCRIP);
          elem.setTopToPrevious(860);
          elem.setLeftFromProperty(mComprasConstantes.OC_DESCRIP);
          elem.setHeight(600);

        }

        // HIDECOLS
        //
        var elem = properties.add(null);
        elem.setType(Dialogs.PropertyType.label);
        elem.setBackColor(vbButtonShadow);
        elem.setWidth(2540);
        elem.setTopNotChange(true);
        elem.setLeftNotChange(true);

        // DATADD
        // Aca van las preferencias del usuario
        //
        if(m_userCfg.getShowDataAddInCompras()) {
          elem.setTop(4000);
        }
        else {
          elem.setTop(3460);
        }

        elem.setLeft(9210);
        elem.setHeight(330);

        var elem = properties.add(null);
        elem.setType(Dialogs.PropertyType.label);
        elem.setBackColor(vbWindowBackground);
        elem.setWidth(2500);
        elem.setTopNotChange(true);
        elem.setLeftNotChange(true);

        // DATADD
        // Aca van las preferencias del usuario
        //
        if(m_userCfg.getShowDataAddInCompras()) {
          elem.setTop(4020);
        }
        else {
          elem.setTop(3480);
        }

        elem.setLeft(9220);
        elem.setHeight(300);

        var iProp = null;
        var oProp = null;
        iProp = properties.add(null, c_HideCols);
        oProp = iProp;
        iProp.setType(Dialogs.PropertyType.check);
        //'Ocultar Columnas
        iProp.setName(Cairo.Language.getText(3901, ""));
        iProp.setKey(K_HIDECOLS);
        iProp.setValue(Cairo.Util.boolToInt(CSKernelClient2.GetRegistry(csSeccionSetting.cSINTERFACE, C_HIDECOLSOC, 1)));
        iProp.setTopNotChange(true);
        iProp.setLeftNotChange(true);

        // DATADD
        // Aca van las preferencias del usuario
        //
        if(m_userCfg.getShowDataAddInCompras()) {
          iProp.setTop(4040);
        }
        else {
          iProp.setTop(3500);
        }

        iProp.setLeft(11120);
        iProp.setLeftLabel(-1500);
        oProp.setIsEditProperty(false);
        //
        // HIDECOLS - fin

        if(!m_dialog.show(self)) { return false; }

        var w_tabs = m_items.getTabs();

        w_tabs.clear();

        var tab = w_tabs.add(null);
        //'Items
        tab.setName(Cairo.Language.getText(1371, ""));

        abmGen = m_items;
        abmGen.ResetLayoutMembers;

        // DATADD
        if(m_userCfg.getShowDataAddInCompras()) {
          abmGen.SetHeightToDocWithDescrip;
        }

        var properties = m_items.getProperties();

        properties.clear();

        c = properties.add(null, C_ITEMS);
        c.setType(Dialogs.PropertyType.grid);
        c.setLeftLabel(-1);
        setGridItems(c);
        if(!pLoadItems(c)) { return false; }
        c.setName(C_ITEMS);
        c.setKey(K_ITEMS);
        c.setTabIndex(0);
        c.setGridAddEnabled(true);
        c.setGridEditEnabled(true);
        c.setGridRemoveEnabled(true);

        m_itemsDeleted = "";

        if(!m_items.show(self)) { return false; }

        abmGen = m_footer;
        abmGen.ResetLayoutMembers;

        var properties = m_footer.getProperties();

        properties.clear();

        var elem = properties.add(null, mComprasConstantes.OC_SUBTOTAL);
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setSubType(Dialogs.PropertySubType.money);
        //'Sub Total
        elem.setName(Cairo.Language.getText(1579, ""));
        elem.setKey(K_SUBTOTAL);
        elem.setValue(m_subTotal);
        elem.setFormat(m_generalConfig.getFormatDecImporte());
        elem.setEnabled(false);

        var elem = properties.add(null, mComprasConstantes.OC_IMPORTEDESC1);
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setSubType(Dialogs.PropertySubType.money);
        //'Desc. 1
        elem.setName(Cairo.Language.getText(1573, ""));
        elem.setKey(K_IMPORTEDESC1);
        elem.setValue(m_importeDesc1);
        elem.setFormat(m_generalConfig.getFormatDecImporte());
        elem.setEnabled(false);

        var elem = properties.add(null, mComprasConstantes.OC_IMPORTEDESC2);
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setSubType(Dialogs.PropertySubType.money);
        //'Desc. 2
        elem.setName(Cairo.Language.getText(1580, ""));
        elem.setKey(K_IMPORTEDESC2);
        elem.setValue(m_importeDesc2);
        elem.setFormat(m_generalConfig.getFormatDecImporte());
        elem.setEnabled(false);

        var elem = properties.add(null, mComprasConstantes.OC_NETO);
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setSubType(Dialogs.PropertySubType.money);
        //'Neto
        elem.setName(Cairo.Language.getText(1581, ""));
        elem.setKey(K_NETO);
        elem.setValue(m_neto);
        elem.setFormat(m_generalConfig.getFormatDecImporte());
        elem.setEnabled(false);

        var elem = properties.add(null, mComprasConstantes.OC_IVARI);
        elem.setType(Dialogs.PropertyType.numeric);
        //'IVA RI
        elem.setName(Cairo.Language.getText(1582, ""));
        elem.setSubType(Dialogs.PropertySubType.money);
        elem.setKey(K_IVARI);
        elem.setValue(m_ivari);
        elem.setFormat(m_generalConfig.getFormatDecImporte());
        elem.setEnabled(false);

        var elem = properties.add(null, mComprasConstantes.OC_IVARNI);
        elem.setType(Dialogs.PropertyType.numeric);
        //'IVA RNI
        elem.setName(Cairo.Language.getText(1583, ""));
        elem.setSubType(Dialogs.PropertySubType.money);
        elem.setKey(K_IVARNI);
        elem.setValue(m_ivarni);
        elem.setFormat(m_generalConfig.getFormatDecImporte());
        elem.setEnabled(false);

        var elem = properties.add(null, mComprasConstantes.OC_TOTAL);
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setFormat(m_generalConfig.getFormatDecImporte());
        //'Total
        elem.setName(Cairo.Language.getText(1584, ""));
        elem.setSubType(Dialogs.PropertySubType.money);
        elem.setKey(K_TOTAL);
        elem.setValue(m_total);
        elem.setEnabled(false);

        pSetEnabled();

        if(!m_footer.show(self)) { return false; }

        // Preferencias del Usuario
        //
        if(bValidateDocDefault) {
          self.propertyChange(K_DOC_ID);
        }

        // DATADD
        mPublic.self.showDataAddProveedor(m_userCfg.getShowDataAddInCompras(), m_dialog);

        return true;
      };

      var refreshCollection = function() {

        m_dialog.setTitle(m_name);

        var properties = m_dialog.getProperties();

        var elem = properties.item(mComprasConstantes.DOC_ID);
        elem.setSelectId(m_doc_id);
        elem.setValue(m_documento);
        elem.setSelectId(m_userCfg.getDocOcId());
        elem.setValue(m_userCfg.getDocOcNombre());

        var elem = properties.item(cDeclarations.getCsDocNumberID());
        elem.setValue(m_numero);

        var elem = properties.item(cDeclarations.getCsDocEstateID());
        elem.setValue(m_estado);

        var elem = properties.item(mComprasConstantes.OC_FECHA);
        elem.setValue(m_fecha);

        var elem = properties.item(mComprasConstantes.OC_FECHAENTREGA);
        elem.setValue(m_fechaentrega);

        var elem = properties.item(mComprasConstantes.PROV_ID);
        elem.setSelectId(m_prov_id);
        elem.setValue(m_proveedor);

        var elem = properties.item(mComprasConstantes.OC_NRODOC);
        elem.setValue(m_nrodoc);

        var elem = properties.item(mComprasConstantes.CPG_ID);
        elem.setSelectId(m_cpg_id);
        elem.setValue(m_condicionPago);

        var elem = properties.item(mComprasConstantes.OC_DESCUENTO1);
        elem.setValue(m_descuento1);

        var elem = properties.item(mComprasConstantes.OC_DESCUENTO2);
        elem.setValue(m_descuento2);

        var elem = properties.item(mComprasConstantes.LGJ_ID);
        elem.setSelectId(m_lgj_id);
        elem.setValue(m_legajo);

        var elem = properties.item(mComprasConstantes.LP_ID);
        elem.setSelectId(m_lp_id);
        elem.setValue(m_listaPrecio);

        var elem = properties.item(mComprasConstantes.LD_ID);
        elem.setSelectId(m_ld_id);
        elem.setValue(m_listaDescuento);

        var elem = properties.item(mComprasConstantes.CCOS_ID);
        elem.setSelectId(m_ccos_id);
        elem.setValue(m_centroCosto);

        var elem = properties.item(mComprasConstantes.SUC_ID);
        elem.setSelectId(m_suc_id);
        elem.setValue(m_sucursal);

        var elem = properties.item(mComprasConstantes.OC_DESCRIP);
        elem.setValue(m_descrip);

        var elem = properties.item(mComprasConstantes.OC_ORDENCOMPRA);
        elem.setValue(m_ordencompra);

        var elem = properties.item(mComprasConstantes.OC_PRESUPUESTO);
        elem.setValue(m_presupuesto);

        var elem = properties.item(mComprasConstantes.CLI_ID);
        elem.setValue(m_cliente);
        elem.setSelectId(m_cli_id);

        var elem = properties.item(mComprasConstantes.OC_MAQUINA);
        elem.setValue(m_maquina);

        var elem = properties.item(mComprasConstantes.OC_MAQUINANRO);
        elem.setValue(m_maquinanro);

        var elem = properties.item(mComprasConstantes.OC_MAQUINAMODELO);
        elem.setValue(m_maquinamodelo);

        var elem = properties.item(mComprasConstantes.OC_FLETEAEREO);
        elem.setValue(Cairo.Util.boolToInt(m_fleteaereo));

        var elem = properties.item(mComprasConstantes.OC_FLETEMARITIMO);
        elem.setValue(Cairo.Util.boolToInt(m_fletemaritimo));

        var elem = properties.item(mComprasConstantes.OC_FLETECORREO);
        elem.setValue(Cairo.Util.boolToInt(m_fletecorreo));

        var elem = properties.item(mComprasConstantes.OC_FLETECAMION);
        elem.setValue(Cairo.Util.boolToInt(m_fletecamion));

        var elem = properties.item(mComprasConstantes.OC_FLETEOTROS);
        elem.setValue(Cairo.Util.boolToInt(m_fleteotros));

        var elem = properties.item(c_ProveedorDataAdd);

        var elem = properties.add(null);

        var elem = properties.add(null);

        var elem = properties.item(mComprasConstantes.OC_SUBTOTAL);
        elem.setValue(m_subTotal);

        var elem = properties.item(mComprasConstantes.OC_IMPORTEDESC1);
        elem.setValue(m_importeDesc1);

        var elem = properties.item(mComprasConstantes.OC_IMPORTEDESC2);
        elem.setValue(m_importeDesc2);

        var elem = properties.item(mComprasConstantes.OC_NETO);
        elem.setValue(m_neto);

        var elem = properties.item(mComprasConstantes.OC_IVARI);
        elem.setValue(m_ivari);

        var elem = properties.item(mComprasConstantes.OC_IVARNI);
        elem.setValue(m_ivarni);

        var elem = properties.item(mComprasConstantes.OC_TOTAL);
        elem.setValue(m_total);

        return m_dialog.showValues(properties);
      };

      var pGetDocFilter = function() {
        return "'doct_id = "+ csEDocumentoTipo.cSEDT_ORDENCOMPRA.toString()+ " or doct_id = "+ csEDocumentoTipo.cSEDT_DEVOLUCIONORDENCPRA.toString()+ "'";
      };

      var setGridItems = function(property) {
        var oCol = null;
        var iCol = null;

        // HIDECOLS
        //
        var bColVisible = null;
        bColVisible = Cairo.Util.val(m_dialog.getProperties().item(c_HideCols).getValue()) == 0;

        var w_grid = property.getGrid();

        var w_columns = w_grid.getColumns();

        w_columns.clear();

        var elem = w_columns.add(null);
        elem.setVisible(false);
        elem.setKey(KI_OCI_ID);

        iCol = w_columns.add(null);
        oCol = iCol;
        //'Producto
        iCol.setName(Cairo.Language.getText(1619, ""));
        iCol.setType(Dialogs.PropertyType.select);
        iCol.setTable(Cairo.Tables.PRODUCTOCOMPRA);
        iCol.setWidth(1800);
        iCol.setKey(KI_PR_ID);
        if(m_userCfg.getMultiSelect()) {
          oCol.setHelpType(csHelpType.cSMULTISELECT);
        }
        iCol = null;
        oCol = null;

        var elem = w_columns.add(null);
        elem.setName(Cairo.Constants.DESCRIPTION_LABEL);
        elem.setType(Dialogs.PropertyType.text);
        elem.setSubType(Dialogs.PropertySubType.textButtonEx);
        elem.setWidth(1200);
        elem.setKey(KI_DESCRIP);

        var elem = w_columns.add(null);
        //'Cantidad
        elem.setName(Cairo.Language.getText(1374, ""));
        elem.setFormat(m_generalConfig.getFormatDecCantidad());
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setSubType(Dialogs.PropertySubType.double);
        elem.setWidth(1200);
        elem.setKey(KI_CANTIDAD);

        elem.setDefaultValue(new cABMGridRowValue());
        elem.getDefaultValue().setValue(1);

        var elem = w_columns.add(null);
        //'Descuento
        elem.setName(Cairo.Language.getText(1585, ""));
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setFormat(m_generalConfig.getFormatDecImporte());
        elem.setSubType(Dialogs.PropertySubType.money);
        elem.setWidth(1200);
        elem.setKey(KI_DESCUENTO);
        elem.setEnabled(false);
        //' HIDECOLS
        elem.setVisible(bColVisible);

        var elem = w_columns.add(null);
        //'Unidad
        elem.setName(Cairo.Language.getText(1165, ""));
        elem.setType(Dialogs.PropertyType.text);
        elem.setWidth(1200);
        elem.setKey(KI_UNIDAD);
        elem.setEnabled(false);
        //' HIDECOLS
        elem.setVisible(bColVisible);

        var elem = w_columns.add(null);
        //'Precio (LP)
        elem.setName(Cairo.Language.getText(1587, ""));
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setSubType(Dialogs.PropertySubType.money);
        elem.setFormat(m_generalConfig.getFormatDecImporte());
        elem.setWidth(1200);
        elem.setKey(KI_PRECIO_LP);
        elem.setEnabled(false);
        //' HIDECOLS
        elem.setVisible(bColVisible);

        var elem = w_columns.add(null);
        //'Precio
        elem.setName(Cairo.Language.getText(1586, ""));
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setSubType(Dialogs.PropertySubType.money);
        elem.setWidth(1200);
        elem.setFormat(m_generalConfig.getFormatDecImporte());
        elem.setKey(KI_PRECIO_USR);
        elem.setEnabled(SecurityCanAccessSilent(csComprasPrestacion.cSPRECPRAEDITPRICEORD));

        var elem = w_columns.add(null);
        //'Precio c/desc.
        elem.setName(Cairo.Language.getText(1588, ""));
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setSubType(Dialogs.PropertySubType.money);
        elem.setWidth(1200);
        elem.setFormat(m_generalConfig.getFormatDecImporte());
        elem.setKey(KI_PRECIO);
        elem.setEnabled(false);

        var elem = w_columns.add(null);
        //'Neto
        elem.setName(Cairo.Language.getText(1581, ""));
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setSubType(Dialogs.PropertySubType.money);
        elem.setFormat(m_generalConfig.getFormatDecImporte());
        elem.setWidth(1200);
        elem.setKey(KI_NETO);
        elem.setEnabled(false);

        var elem = w_columns.add(null);
        //'IVA RI
        elem.setName(Cairo.Language.getText(1582, ""));
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setSubType(Dialogs.PropertySubType.money);
        elem.setFormat(m_generalConfig.getFormatDecImporte());
        elem.setWidth(1200);
        elem.setKey(KI_IVARI);
        elem.setEnabled(false);

        var elem = w_columns.add(null);
        //'IVA RNI
        elem.setName(Cairo.Language.getText(1583, ""));
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setFormat(m_generalConfig.getFormatDecImporte());
        elem.setSubType(Dialogs.PropertySubType.money);
        elem.setWidth(1200);
        elem.setKey(KI_IVARNI);
        elem.setEnabled(false);
        //' HIDECOLS
        elem.setVisible(bColVisible);

        var elem = w_columns.add(null);
        //'Importe
        elem.setName(Cairo.Language.getText(1228, ""));
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setFormat(m_generalConfig.getFormatDecImporte());
        elem.setSubType(Dialogs.PropertySubType.money);
        elem.setWidth(1200);
        elem.setKey(KI_IMPORTE);
        elem.setEnabled(false);

        var elem = w_columns.add(null);
        elem.setVisible(false);
        elem.setKey(KI_IVARIPERCENT);

        var elem = w_columns.add(null);
        elem.setVisible(false);
        elem.setKey(KI_IVARNIPERCENT);

        var elem = w_columns.add(null);
        //'Centro de Costo
        elem.setName(Cairo.Language.getText(1057, ""));
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.CENTROCOSTO);
        elem.setWidth(1800);
        elem.setKey(KI_CCOS_ID);
        //' HIDECOLS
        elem.setVisible(bColVisible);

        var w_rows = w_grid.getRows();

        w_rows.clear();
        return true;
      };

      var pLoadItems = function() {


        for(var _i = 0; _i < m_data.items.length; _i += 1) {

          var elem = w_rows.add(null, rs(mComprasConstantes.OCI_ID).Value);

          var elem = elem.add(null);
          elem.Value = Cairo.Database.valField(m_data.items[_i], mComprasConstantes.OCI_ID);
          elem.setKey(KI_OCI_ID);

          var elem = elem.add(null);
          elem.Value = Cairo.Database.valField(m_data.items[_i], mComprasConstantes.PR_NOMBRECOMPRA);
          elem.Id = Cairo.Database.valField(m_data.items[_i], mComprasConstantes.PR_ID);
          elem.setKey(KI_PR_ID);

          var elem = elem.add(null);
          elem.Value = Cairo.Database.valField(m_data.items[_i], mComprasConstantes.OCI_DESCRIP);
          elem.setKey(KI_DESCRIP);

          var elem = elem.add(null);
          elem.Value = Cairo.Database.valField(m_data.items[_i], mComprasConstantes.OCI_CANTIDAD);
          elem.setKey(KI_CANTIDAD);

          var elem = elem.add(null);
          elem.Value = Cairo.Database.valField(m_data.items[_i], mComprasConstantes.OCI_DESCUENTO);
          elem.setKey(KI_DESCUENTO);

          var elem = elem.add(null);
          elem.Value = Cairo.Database.valField(m_data.items[_i], mComprasConstantes.UN_NAME);
          elem.setKey(KI_UNIDAD);

          var elem = elem.add(null);
          elem.Value = Cairo.Database.valField(m_data.items[_i], mComprasConstantes.OCI_PRECIO_LISTA);
          elem.setKey(KI_PRECIO_LP);

          var elem = elem.add(null);
          elem.Value = Cairo.Database.valField(m_data.items[_i], mComprasConstantes.OCI_PRECIO_USR);
          elem.setKey(KI_PRECIO_USR);

          var elem = elem.add(null);
          elem.Value = Cairo.Database.valField(m_data.items[_i], mComprasConstantes.OCI_PRECIO);
          elem.setKey(KI_PRECIO);

          var elem = elem.add(null);
          elem.Value = Cairo.Database.valField(m_data.items[_i], mComprasConstantes.OCI_NETO);
          elem.setKey(KI_NETO);

          var elem = elem.add(null);
          elem.Value = Cairo.Database.valField(m_data.items[_i], mComprasConstantes.OCI_IVARI);
          elem.setKey(KI_IVARI);

          var elem = elem.add(null);
          elem.Value = Cairo.Database.valField(m_data.items[_i], mComprasConstantes.OCI_IVARNI);
          elem.setKey(KI_IVARNI);

          var elem = elem.add(null);
          elem.Value = Cairo.Database.valField(m_data.items[_i], mComprasConstantes.OCI_IMPORTE);
          elem.setKey(KI_IMPORTE);

          var elem = elem.add(null);
          if(m_bIva) {
            elem.Value = Cairo.Database.valField(m_data.items[_i], "iva_ri_porcentaje");
          }
          else {
            elem.Value = 0;
          }
          elem.setKey(KI_IVARIPERCENT);

          var elem = elem.add(null);
          if(m_bIvaRni) {
            elem.Value = Cairo.Database.valField(m_data.items[_i], "iva_rni_porcentaje");
          }
          else {
            elem.Value = 0;
          }
          elem.setKey(KI_IVARNIPERCENT);

          var elem = elem.add(null);
          elem.Value = Cairo.Database.valField(m_data.items[_i], mComprasConstantes.CCOS_NAME);
          elem.Id = Cairo.Database.valField(m_data.items[_i], mComprasConstantes.CCOS_ID);
          elem.setKey(KI_CCOS_ID);

        }

        return true;
      };

      var load = function(id) {

        return Cairo.Database.getData("load[" + m_apiPath + "general/ordencompra]", id).then(
          function(response) {

            if(response.success !== true) { return false; }

            if(response.data.id !== Cairo.Constants.NO_ID) {

              m_id = Cairo.Database.valField(response.data, mComprasConstantes.OC_ID);
              m_numero = Cairo.Database.valField(response.data, mComprasConstantes.OC_NUMERO);
              m_nrodoc = Cairo.Database.valField(response.data, mComprasConstantes.OC_NRODOC);
              m_descrip = Cairo.Database.valField(response.data, mComprasConstantes.OC_DESCRIP);
              m_fecha = Cairo.Database.valField(response.data, mComprasConstantes.OC_FECHA);
              m_fechaentrega = Cairo.Database.valField(response.data, mComprasConstantes.OC_FECHAENTREGA);
              m_neto = Cairo.Database.valField(response.data, mComprasConstantes.OC_NETO);
              m_ivari = Cairo.Database.valField(response.data, mComprasConstantes.OC_IVARI);
              m_ivarni = Cairo.Database.valField(response.data, mComprasConstantes.OC_IVARNI);
              m_total = Cairo.Database.valField(response.data, mComprasConstantes.OC_TOTAL);
              m_subTotal = Cairo.Database.valField(response.data, mComprasConstantes.OC_SUBTOTAL);
              m_descuento1 = Cairo.Database.valField(response.data, mComprasConstantes.OC_DESCUENTO1);
              m_descuento2 = Cairo.Database.valField(response.data, mComprasConstantes.OC_DESCUENTO2);
              m_importeDesc1 = Cairo.Database.valField(response.data, mComprasConstantes.OC_IMPORTEDESC1);
              m_importeDesc2 = Cairo.Database.valField(response.data, mComprasConstantes.OC_IMPORTEDESC2);
              m_prov_id = Cairo.Database.valField(response.data, mComprasConstantes.PROV_ID);
              m_proveedor = Cairo.Database.valField(response.data, mComprasConstantes.PROV_NAME);
              m_ccos_id = Cairo.Database.valField(response.data, mComprasConstantes.CCOS_ID);
              m_centroCosto = Cairo.Database.valField(response.data, mComprasConstantes.CCOS_NAME);
              m_suc_id = Cairo.Database.valField(response.data, mComprasConstantes.SUC_ID);
              m_sucursal = Cairo.Database.valField(response.data, mComprasConstantes.SUC_NAME);
              m_doc_id = Cairo.Database.valField(response.data, mComprasConstantes.DOC_ID);
              m_documento = Cairo.Database.valField(response.data, mComprasConstantes.DOC_NAME);
              m_doct_id = Cairo.Database.valField(response.data, mComprasConstantes.DOCT_ID);
              m_lp_id = Cairo.Database.valField(response.data, mComprasConstantes.LP_ID);
              m_listaPrecio = Cairo.Database.valField(response.data, mComprasConstantes.LP_NAME);
              m_cpg_id = Cairo.Database.valField(response.data, mComprasConstantes.CPG_ID);
              m_condicionPago = Cairo.Database.valField(response.data, mComprasConstantes.CPG_NAME);
              m_ld_id = Cairo.Database.valField(response.data, mComprasConstantes.LD_ID);
              m_listaDescuento = Cairo.Database.valField(response.data, mComprasConstantes.LD_NAME);
              m_creado = Cairo.Database.valField(response.data, Cairo.Constants.CREADO);
              m_modificado = Cairo.Database.valField(response.data, Cairo.Constants.MODIFICADO);
              m_modifico = Cairo.Database.valField(response.data, Cairo.Constants.MODIFICO);
              m_est_id = Cairo.Database.valField(response.data, Cairo.Constants.EST_ID);
              m_estado = Cairo.Database.valField(response.data, Cairo.Constants.EST_NAME);
              m_firmado = Cairo.Database.valField(response.data, mComprasConstantes.OC_FIRMADO);

              m_lgj_id = Cairo.Database.valField(response.data, mComprasConstantes.LGJ_ID);
              m_legajo = Cairo.Database.valField(response.data, mComprasConstantes.LGJ_CODE);

              m_docEditable = Cairo.Database.valField(response.data, Cairo.Constants.DOC_EDITABLE);
              m_docEditMsg = Cairo.Database.valField(response.data, Cairo.Constants.DOCEDIT_MSG);

              m_taPropuesto = Cairo.Database.valField(response.data, Cairo.Constants.TA__PROPUESTO);
              m_taMascara = Cairo.Database.valField(response.data, Cairo.Constants.TA__MASCARA);

              m_bIva = Cairo.Database.valField(response.data, mComprasConstantes.BIVA_RI);
              m_bIvaRni = Cairo.Database.valField(response.data, mComprasConstantes.BIVA_RNI);

              m_ordencompra = Cairo.Database.valField(response.data, mComprasConstantes.OC_ORDENCOMPRA);
              m_presupuesto = Cairo.Database.valField(response.data, mComprasConstantes.OC_PRESUPUESTO);
              m_maquina = Cairo.Database.valField(response.data, mComprasConstantes.OC_MAQUINA);
              m_maquinanro = Cairo.Database.valField(response.data, mComprasConstantes.OC_MAQUINANRO);
              m_maquinamodelo = Cairo.Database.valField(response.data, mComprasConstantes.OC_MAQUINAMODELO);
              m_fleteaereo = Cairo.Database.valField(response.data, mComprasConstantes.OC_FLETEAEREO);
              m_fletemaritimo = Cairo.Database.valField(response.data, mComprasConstantes.OC_FLETEMARITIMO);
              m_fletecorreo = Cairo.Database.valField(response.data, mComprasConstantes.OC_FLETECORREO);
              m_fletecamion = Cairo.Database.valField(response.data, mComprasConstantes.OC_FLETECAMION);
              m_fleteotros = Cairo.Database.valField(response.data, mComprasConstantes.OC_FLETEOTROS);

              m_cli_id = Cairo.Database.valField(response.data, mComprasConstantes.CLI_ID);
              m_cliente = Cairo.Database.valField(response.data, mComprasConstantes.CLI_NAME);

              m_lastDoc = m_doc_id;
              m_lastProv = m_prov_id;
              m_lastDocName = m_documento;
              m_lastProvName = m_proveedor;

            }
            else {

              m_id = Cairo.Constants.NO_ID;
              m_numero = 0;
              m_nrodoc = "";
              m_descrip = "";
              m_fecha = VDGetDateById(csDateEnum.cSTODAY);
              m_fechaentrega = VDGetDateById(csDateEnum.cSTOMORROW);
              m_neto = 0;
              m_ivari = 0;
              m_ivarni = 0;
              m_total = 0;
              m_subTotal = 0;
              m_descuento1 = 0;
              m_descuento2 = 0;
              m_importeDesc1 = 0;
              m_importeDesc2 = 0;
              m_prov_id = Cairo.Constants.NO_ID;
              m_proveedor = "";
              m_ccos_id = Cairo.Constants.NO_ID;
              m_centroCosto = "";
              m_doc_id = Cairo.Constants.NO_ID;
              m_documento = "";
              m_doct_id = Cairo.Constants.NO_ID;
              m_lp_id = Cairo.Constants.NO_ID;
              m_ld_id = Cairo.Constants.NO_ID;
              m_cpg_id = Cairo.Constants.NO_ID;
              m_condicionPago = "";
              m_listaPrecio = "";
              m_listaDescuento = "";
              m_creado = Cairo.Constants.cSNODATE;
              m_modificado = Cairo.Constants.cSNODATE;
              m_modifico = 0;
              m_est_id = Cairo.Constants.NO_ID;
              m_estado = "";
              m_lgj_id = Cairo.Constants.NO_ID;
              m_legajo = "";
              m_suc_id = cUtil.getUser().getSuc_id();
              m_sucursal = cUtil.getUser().getSucursal();
              m_firmado = false;

              m_ordencompra = "";
              m_presupuesto = "";
              m_maquina = "";
              m_maquinanro = "";
              m_maquinamodelo = "";
              m_fleteaereo = false;
              m_fletemaritimo = false;
              m_fletecorreo = false;
              m_fletecamion = false;
              m_fleteotros = false;

              m_cli_id = Cairo.Constants.NO_ID;
              m_cliente = "";

              m_doc_id = m_lastDoc;
              m_prov_id = m_lastProv;
              m_proveedor = m_lastProvName;
              m_documento = m_lastDocName;

              m_bIvaRni = false;
              m_bIva = false;

              m_taPropuesto = false;
              m_taMascara = "";

              DocEditableGet(m_doc_id, m_docEditable, m_docEditMsg, csComprasPrestacion.cSPRECPRANEWORDEN);

            }

            return true;
          });
      };

      var setCIEditGenericDoc_Footer = function(rhs) {
        m_footer = rhs;

        if(rhs == null) { Exit Property; }

        m_footer.setIsDocument(true);
        m_footer.setIsFooter(true);
        m_footer.setObjForm(m_dialog.getObjForm());
      };

      var setCIEditGenericDoc_Items = function(rhs) {
        m_items = rhs;

        if(rhs == null) { Exit Property; }

        m_items.setIsDocument(true);
        m_items.setIsItems(true);
        m_items.setObjForm(m_dialog.getObjForm());
      };

      var pSaveItems = function(id) {
        var transaction = new Cairo.Database.Transaction();
        var iOrden = null;
        var row = null;
        var cell = null;

        var _count = cIABMGridCellValue.getItems(m_items, C_ITEMS).Grid.cIABMGrid.getRows().size();
        for (var _i = 0; _i < _count; _i++) {
          row = cIABMGridCellValue.getItems(m_items, C_ITEMS).Grid.cIABMGrid.getRows().item(_i);
          var register = new Cairo.Database.Register();
          register.setFieldId(mComprasConstantes.OCI_TMPID);
          register.setTable(mComprasConstantes.ORDENCOMPRAITEMTMP);
          register.setId(Cairo.Constants.NEW_ID);

          var _count = row.size();
          for (var _j = 0; _j < _count; _j++) {
            cell = row.item(_j);
            switch (cell.getKey()) {

              case KI_OCI_ID:
                register.setPath(m_apiPath + "general/ordencompra");

                if(m_copy) {
                  register.getFields().add2(mComprasConstantes.OCI_ID, Cairo.Constants.NEW_ID, Cairo.Constants.Types.integer);
                }
                else {
                  register.getFields().add2(mComprasConstantes.OCI_ID, Cairo.Util.val(cell.getValue()), Cairo.Constants.Types.integer);
                }
                break;

              case KI_CANTIDAD:
                register.getFields().add2(mComprasConstantes.OCI_CANTIDAD, cell.getValue(), Cairo.Constants.Types.double);
                break;

              case KI_DESCRIP:
                register.getFields().add2(mComprasConstantes.OCI_DESCRIP, cell.getValue(), Cairo.Constants.Types.text);
                break;

              case KI_PRECIO:
                register.getFields().add2(mComprasConstantes.OCI_PRECIO, cell.getValue(), Cairo.Constants.Types.currency);
                break;

              case KI_PRECIO_LP:
                register.getFields().add2(mComprasConstantes.OCI_PRECIO_LISTA, cell.getValue(), Cairo.Constants.Types.currency);
                break;

              case KI_PRECIO_USR:
                register.getFields().add2(mComprasConstantes.OCI_PRECIO_USR, cell.getValue(), Cairo.Constants.Types.currency);
                break;

              case KI_IMPORTE:
                register.getFields().add2(mComprasConstantes.OCI_IMPORTE, cell.getValue(), Cairo.Constants.Types.currency);
                break;

              case KI_NETO:
                register.getFields().add2(mComprasConstantes.OCI_NETO, cell.getValue(), Cairo.Constants.Types.currency);
                break;

              case KI_IVARI:
                register.getFields().add2(mComprasConstantes.OCI_IVARI, cell.getValue(), Cairo.Constants.Types.currency);
                break;

              case KI_IVARNI:
                register.getFields().add2(mComprasConstantes.OCI_IVARNI, cell.getValue(), Cairo.Constants.Types.currency);
                break;

              case KI_IVARIPERCENT:
                register.getFields().add2(mComprasConstantes.OCI_IVARI_PORC, cell.getValue(), Cairo.Constants.Types.double);
                break;

              case KI_IVARNIPERCENT:
                register.getFields().add2(mComprasConstantes.OCI_IVARNI_PORC, cell.getValue(), Cairo.Constants.Types.double);
                break;

              case KI_PR_ID:
                register.getFields().add2(mComprasConstantes.PR_ID, cell.getId(), Cairo.Constants.Types.id);
                break;

              case KI_CCOS_ID:
                register.getFields().add2(mComprasConstantes.CCOS_ID, cell.getId(), Cairo.Constants.Types.id);
                break;
            }
          }

          iOrden = iOrden + 1;
          register.getFields().add2(mComprasConstantes.OCI_ORDEN, iOrden, Cairo.Constants.Types.integer);
          register.getFields().add2(mComprasConstantes.OC_TMPID, id, Cairo.Constants.Types.id);

          register.getFields().setHaveLastUpdate(false);
          register.getFields().setHaveWhoModify(false);

          transaction.addRegister(register);
        }

        if(LenB(m_itemsDeleted) && m_id != Cairo.Constants.NO_ID && !m_copy) {

          var vDeletes = null;
          var i = null;

          m_itemsDeleted = RemoveLastColon(m_itemsDeleted);
          vDeletes = Split(m_itemsDeleted, ",");

          for (i = 0; i <= vDeletes.Length; i++) {

            var register = new Cairo.Database.Register();
            register.setFieldId(mComprasConstantes.OCIB_TMPID);
            register.setTable(mComprasConstantes.ORDENCOMPRAITEMBORRADOTMP);
            register.setId(Cairo.Constants.NEW_ID);

            register.getFields().add2(mComprasConstantes.OCI_ID, Cairo.Util.val(vDeletes(i)), Cairo.Constants.Types.integer);
            register.getFields().add2(mComprasConstantes.OC_ID, m_id, Cairo.Constants.Types.id);
            register.getFields().add2(mComprasConstantes.OC_TMPID, id, Cairo.Constants.Types.id);

            register.getFields().setHaveLastUpdate(false);
            register.getFields().setHaveWhoModify(false);

            transaction.addRegister(register);
          }

        }

        mainTransaction.addTransaction(transaction);

        return true;
      };

      // Reglas del Objeto de Negocios
      var pDocDesdePedido = function() {
        var doc = null;
        var rtn = null;
        var docId = null;

        // Si todavia no se cargo el form no se que
        // documento es, asi que no puede ser sobre pedido
        if(m_dialog.getProperties().item(mComprasConstantes.DOC_ID) == null) { return false; }

        docId = m_dialog.getProperties().item(mComprasConstantes.DOC_ID).getSelectId();

        // Si no hay un documento activo no se hace nada
        if(docId == Cairo.Constants.NO_ID) { return false; }

        doc = new cDocumento();

        return doc.GetData(docId, mComprasConstantes.DOC_TIPO_ORDEN_COMPRA, Cairo.Constants.Types.long) == csETOrdenPedido;
      };

      // Reglas del Objeto de Negocios
      var pShowImporteAndIva = function(row) { // TODO: Use of ByRef founded Private Sub pShowImporteAndIva(ByRef Row As CSInterfacesABM.cIABMGridRow)
        var importe = null;
        var neto = null;
        var ivaRi = null;
        var ivaRni = null;

        neto = Cairo.Util.val(Dialogs.cell(row, KI_CANTIDAD).getValue()) * Cairo.Util.val(Dialogs.cell(row, KI_PRECIO).getValue());
        if(m_bIva) {
          ivaRi = (neto * Cairo.Util.val(Dialogs.cell(row, KI_IVARIPERCENT).getValue())) / 100;
        }
        if(m_bIvaRni) {
          ivaRni = (neto * Cairo.Util.val(Dialogs.cell(row, KI_IVARNIPERCENT).getValue())) / 100;
        }
        importe = neto + ivaRi + ivaRni;

        Dialogs.cell(row, KI_NETO).getValue() == neto;
        Dialogs.cell(row, KI_IVARI).getValue() == ivaRi;
        Dialogs.cell(row, KI_IVARNI).getValue() == ivaRni;
        Dialogs.cell(row, KI_IMPORTE).getValue() == importe;
      };

      var pShowTotales = function(rows) { // TODO: Use of ByRef founded Private Sub pShowTotales(ByRef Rows As CSInterfacesABM.cIABMGridRows)
        var neto = null;
        var ivaRi = null;
        var ivaRni = null;
        var desc1 = null;
        var desc2 = null;

        var row = null;

        var _count = rows.size();
        for (var _i = 0; _i < _count; _i++) {
          row = rows.item(_i);
          neto = neto + Cairo.Util.val(Dialogs.cell(row, KI_NETO).getValue());
          ivaRi = ivaRi + Cairo.Util.val(Dialogs.cell(row, KI_IVARI).getValue());
          ivaRni = ivaRni + Cairo.Util.val(Dialogs.cell(row, KI_IVARNI).getValue());
        }

        var properties = m_footer.getProperties();
        properties.item(mComprasConstantes.OC_SUBTOTAL).setValue(neto);

        desc1 = m_dialog.getProperties().item(mComprasConstantes.OC_DESCUENTO1).getValue();
        desc2 = m_dialog.getProperties().item(mComprasConstantes.OC_DESCUENTO2).getValue();

        ivaRi = ivaRi - (ivaRi * desc1 / 100);
        ivaRni = ivaRni - (ivaRni * desc1 / 100);

        ivaRi = ivaRi - (ivaRi * desc2 / 100);
        ivaRni = ivaRni - (ivaRni * desc2 / 100);

        desc1 = neto * desc1 / 100;
        properties.item(mComprasConstantes.OC_IMPORTEDESC1).setValue(desc1);

        neto = neto - desc1;

        desc2 = neto * desc2 / 100;
        properties.item(mComprasConstantes.OC_IMPORTEDESC2).setValue(desc2);

        neto = neto - desc2;

        properties.item(mComprasConstantes.OC_NETO).setValue(neto);
        properties.item(mComprasConstantes.OC_IVARI).setValue(ivaRi);
        properties.item(mComprasConstantes.OC_IVARNI).setValue(ivaRni);
        properties.item(mComprasConstantes.OC_TOTAL).setValue(neto + ivaRni + ivaRi);

        m_footer.refreshControls();
      };

      var pSetTasasImpositivas = function(row,  pR_ID,  pr_nombre) { // TODO: Use of ByRef founded Private Sub pSetTasasImpositivas(ByRef Row As CSInterfacesABM.cIABMGridRow, ByVal PR_ID As Long, ByVal pr_nombre As String)
        var ti_ri = null;
        var ti_rni = null;

        if(pR_ID == 0) { return; }

        if(!GetTasaFromProducto(pR_ID, ti_ri, ti_rni, true)) { return; }

        if(ti_ri == 0) {
          MsgWarning(Cairo.Language.getText(1597, "", pr_nombre));
          //El producto [" & pr_nombre & "] no tiene definida su tasa impositiva de compras para el iva responsable inscripto
          return;
        }

        if(ti_rni == 0) {
          MsgWarning(Cairo.Language.getText(1598, "", pr_nombre));
          //El producto [" & pr_nombre & "] no tiene definida su tasa impositiva de compras para el iva responsable no inscripto
          return;
        }

        var sqlstmt = null;
        var rs = null;

        if(m_bIva) {
          sqlstmt = "select ti_porcentaje,cue_id from tasaimpositiva where ti_id = "+ ti_ri.toString();
          if(!Cairo.Database.openRs(sqlstmt, rs)) { return; }

          if(!rs.isEOF()) {
            Dialogs.cell(row, KI_IVARIPERCENT).getValue() == Cairo.Database.valField(rs.getFields(), mComprasConstantes.TI_PORCENTAJE);
          }
        }
        else {
          Dialogs.cell(row, KI_IVARIPERCENT).getValue() == 0;
        }

        if(m_bIvaRni) {
          sqlstmt = "select ti_porcentaje,cue_id from tasaimpositiva where ti_id = "+ ti_rni.toString();
          if(!Cairo.Database.openRs(sqlstmt, rs)) { return; }

          if(!rs.isEOF()) {
            Dialogs.cell(row, KI_IVARNIPERCENT).getValue() == Cairo.Database.valField(rs.getFields(), mComprasConstantes.TI_PORCENTAJE);
          }
        }
        else {
          Dialogs.cell(row, KI_IVARNIPERCENT).getValue() == 0;
        }
      };

      var pSetDataProducto = function(row,  pR_ID) { // TODO: Use of ByRef founded Private Sub pSetDataProducto(ByRef Row As CSInterfacesABM.cIABMGridRow, ByVal PR_ID As Long)
        var sqlstmt = null;
        var rs = null;

        sqlstmt = "select un_nombre, ccos_id_compra, ccos_nombre from producto, unidad, centrocosto where un_id_compra = un_id and ccos_id_compra *= ccos_id and pr_id = "+ pR_ID.toString();

        if(!Cairo.Database.openRs(sqlstmt, rs)) { return; }

        if(!rs.isEOF()) {
          Dialogs.cell(row, KI_UNIDAD).getValue() == Cairo.Database.valField(rs.getFields(), mComprasConstantes.UN_NAME);

          var w_pCell = Dialogs.cell(row, KI_CCOS_ID);
          w_pCell.setValue(Cairo.Database.valField(rs.getFields(), mComprasConstantes.CCOS_NAME));
          w_pCell.setID(Cairo.Database.valField(rs.getFields(), mComprasConstantes.CCOS_ID_COMPRA));
        }
      };

      var pSetPrecios = function(row,  pR_ID) { // TODO: Use of ByRef founded Private Sub pSetPrecios(ByRef Row As CSInterfacesABM.cIABMGridRow, ByVal PR_ID As Long)
        var lP = null;
        var lp_id = null;
        var precio = null;

        lp_id = m_dialog.getProperties().item(mComprasConstantes.LP_ID).getSelectId();

        if(lp_id != 0) {
          lP = new cListaPrecio();
          precio = lP.getPrecio(lp_id, pR_ID);
        }

        Dialogs.cell(row, KI_PRECIO_LP).getValue() == precio;
        Dialogs.cell(row, KI_PRECIO_USR).getValue() == precio;
      };

      var pSetDescuentos = function(row,  pR_ID,  precio) { // TODO: Use of ByRef founded Private Sub pSetDescuentos(ByRef Row As CSInterfacesABM.cIABMGridRow, ByVal PR_ID As Long, ByVal Precio As Double)
        var lD = null;
        var ld_id = null;
        var descuento = null;

        ld_id = m_dialog.getProperties().item(mComprasConstantes.LD_ID).getSelectId();

        if(ld_id != 0) {
          lD = new cListaDescuento();
          precio = lD.GetPrecio(ld_id, pR_ID, precio);
          descuento = lD.getDescuentoStr(ld_id, pR_ID);
        }

        Dialogs.cell(row, KI_PRECIO).getValue() == precio;
        Dialogs.cell(row, KI_DESCUENTO).getValue() == descuento;
      };

      var pSetEnabled = function() {
        var bState = null;
        var prop = null;

        if(m_docEditable) {
          bState = m_dialog.getProperties().item(mComprasConstantes.DOC_ID).getSelectId() != Cairo.Constants.NO_ID;
        }
        else {
          bState = false;
        }

        var _count = m_dialog.getProperties().size();
        for (var _i = 0; _i < _count; _i++) {
          prop = m_dialog.getProperties().item(_i);
          // HIDECOLS
          if(prop.getKey() != K_DOC_ID && prop.getKey() != K_NUMERO && prop.getKey() != K_EST_ID && prop.getKey() != K_HIDECOLS) {

            if(bState) {
              if(prop.getKey() != K_NRODOC) {
                prop.setEnabled(bState);
              }
              else {
                prop.setEnabled(m_taPropuesto);
              }
            }
            else {
              prop.setEnabled(false);
            }
          }
        }

        var _count = m_items.getProperties().size();
        for (var _i = 0; _i < _count; _i++) {
          prop = m_items.getProperties().item(_i);
          prop.setEnabled(bState);
        }

                #If PREPROC_SFS Then;
        var abmGen = null;
                #Else;
        var abmGen = null;
                #End If;

        abmGen = m_items;
        abmGen.RefreshEnabledState(m_items.getProperties());

        abmGen = m_dialog;
        abmGen.RefreshEnabledState(m_dialog.getProperties());

      };

      var pSetDatosProveedor = function() {
        var lp_id = null;
        var ld_id = null;
        var cpg_id = null;
        var cpg_nombre = null;
        var lP = null;
        var lD = null;
        var iProp = null;
        var filter = null;

        var property = m_dialog.getProperties().item(mComprasConstantes.PROV_ID);
        if(m_lastProv == property.getSelectId()) {
          return;
        }
        m_lastProv = property.getSelectId();

        if(!GetProveedorDataEx(m_lastProv, lp_id, ld_id, cpg_id, m_lastDoc)) { return; }

        // Condicion de pago
        if(cpg_id != Cairo.Constants.NO_ID) {

          if(!Cairo.Database.getData(mComprasConstantes.CONDICIONPAGO, mComprasConstantes.CPG_ID, cpg_id, mComprasConstantes.CPG_NAME, cpg_nombre)) { return; }

          iProp = m_dialog.getProperties().item(mComprasConstantes.CPG_ID);
          iProp.setValue(cpg_nombre);
          iProp.setSelectId(cpg_id);
          m_dialog.showValue(iProp);
        }

        // Lista de precios
        iProp = m_dialog.getProperties().item(mComprasConstantes.LP_ID);
        iProp.setSelectFilter(GetListaPrecioGetXProveedor(m_lastDoc, m_lastProv));

        if(lp_id != Cairo.Constants.NO_ID) {
          lP = new cListaPrecio();
          iProp.setValue(lP.GetData(lp_id, mComprasConstantes.LP_NAME, Cairo.Constants.Types.text));
          iProp.setSelectId(lp_id);
        }

        m_dialog.showValue(iProp);

        // Lista de descuentos
        iProp = m_dialog.getProperties().item(mComprasConstantes.LD_ID);
        iProp.setSelectFilter(GetListaDescGetXProveedor(m_lastDoc, m_lastProv));

        if(ld_id != Cairo.Constants.NO_ID) {
          lD = new cListaDescuento();
          iProp.setValue(lD.GetData(ld_id, mComprasConstantes.LD_NAME, Cairo.Constants.Types.text));
          iProp.setSelectId(ld_id);
        }

        // Talonario y Categoria fiscal
        pGetIvaFromProveedor(m_lastProv);

        m_dialog.showValue(iProp);
      };

      var pGetIvaFromProveedor = function(prov_id) {
        var sqlstmt = null;
        var rs = null;
        var bIvaChanged = null;
        var bLastIva = null;

        sqlstmt = "sp_proveedorGetIva "+ prov_id.toString();
        if(!Cairo.Database.openRs(sqlstmt, rs)) { return; }

        if(rs.isEOF()) { return; }

        bLastIva = m_bIva;
        m_bIva = Cairo.Database.valField(rs.getFields(), "bIva");
        if(bLastIva != m_bIva) { bIvaChanged = true; }

        bLastIva = m_bIvaRni;
        m_bIvaRni = Cairo.Database.valField(rs.getFields(), "bIvaRni");
        if(bLastIva != m_bIvaRni) { bIvaChanged = true; }

        if(bIvaChanged) {
          pShowTotales(cIABMGridCellValue.getItems(m_items, C_ITEMS).Grid.cIABMGrid.getRows());
        }
      };

      var pFirmar = function() {
        var doc = null;
        var us_id = null;

        doc = new cDocumento();

        if(m_id == Cairo.Constants.NO_ID) {
          //'Antes de poder firmar el documento debe guardarlo.
          MsgWarning(Cairo.Language.getText(1592, ""));
          return null;
        }

        if(m_firmado) {
          if(!Ask(Cairo.Language.getText(1593, ""), vbYes, Cairo.Language.getText(1594, ""))) {
            //El documento ya ha sido firmado desea borrar la firma,Firmar
            return null;
          }
        }

        if(!doc.Firmar(m_doc_id, us_id)) { return false; }

        var sqlstmt = null;
        var rs = null;

        sqlstmt = "sp_DocOrdenCompraFirmar "+ m_id+ ","+ us_id.toString();
        if(!Cairo.Database.openRs(sqlstmt, rs)) { return false; }

        m_est_id = Cairo.Database.valField(rs.getFields(), Cairo.Constants.EST_ID);
        m_estado = Cairo.Database.valField(rs.getFields(), Cairo.Constants.EST_NAME);

        var iProp = null;
        iProp = m_dialog.getProperties().item(cDeclarations.getCsDocEstateID());

        iProp.setSelectId(m_est_id);
        iProp.setValue(m_estado);

        Cairo.Database.getData(mComprasConstantes.ORDENCOMPRA, mComprasConstantes.OC_ID, m_id, mComprasConstantes.OC_FIRMADO, m_firmado);

        m_dialog.showValue(iProp);

        return true;
      };

      var pMove = function(moveTo) {
        var sqlstmt = null;
        var rs = null;
        var doc_id = null;

        doc_id = m_dialog.getProperties().item(mComprasConstantes.DOC_ID).getSelectId();

        //'Debe seleccionar un documento
        if(doc_id == Cairo.Constants.NO_ID) { MsgInfo(Cairo.Language.getText(1595, "")); }

        sqlstmt = "sp_DocOrdenCompraMover "+ moveTo+ ","+ m_numero+ ","+ doc_id.toString();

        if(!Cairo.Database.openRs(sqlstmt, rs)) { return false; }

        // Si no obtuve ningun id al moverme
        //
        if(rs.isEOF()) {

          switch (moveTo) {

            // Si era siguiente ahora busco el ultimo
            //
            case Dialogs.Message.MSG_DOC_NEXT:
              pMove(Dialogs.Message.MSG_DOC_LAST);

              // Si era anterior ahora busco el primero
              //
              break;

            case Dialogs.Message.MSG_DOC_PREVIOUS:
              pMove(Dialogs.Message.MSG_DOC_FIRST);

              // Si no encontre ni ultimo ni primero
              // es por que no hay ningun comprobante para
              // este documento
              //
              break;

            case Dialogs.Message.MSG_DOC_FIRST:
            case Dialogs.Message.MSG_DOC_LAST:

              // Limpio incluso el ultimo proveedor
              //
              m_lastProv = Cairo.Constants.NO_ID;
              m_lastProvName = "";

              // Cargo un registro vacio
              //
              load(Cairo.Constants.NO_ID);

              // Refresco el formulario
              //
              pRefreshProperties();

              // Obtengo un nuevo numero de comprobante
              //
              GetDocNumber(m_lastDoc, m_dialog, m_taPropuesto, mComprasConstantes.OC_NRODOC);

              break;
          }

        }
        else {
          if(!load(Cairo.Database.valField(rs.getFields(), 0))) { return false; }

          pRefreshProperties();
        }

        return true;
      };

      var pRefreshProperties = function() {
        var c = null;
                #If PREPROC_SFS Then;
        var abmGen = null;
                #Else;
        var abmGen = null;
                #End If;
        var filter = null;

        var properties = m_dialog.getProperties();

        c = properties.item(mComprasConstantes.DOC_ID);
        c.setSelectId(m_doc_id);
        c.setValue(m_documento);

        c = properties.item(mComprasConstantes.OC_FECHA);
        c.setValue(m_fecha);

        c = properties.item(mComprasConstantes.OC_FECHAENTREGA);
        c.setValue(m_fechaentrega);

        c = properties.item(mComprasConstantes.PROV_ID);
        c.setSelectId(m_prov_id);
        c.setValue(m_proveedor);

        c = properties.item(cDeclarations.getCsDocNumberID());
        c.setValue(m_numero);

        c = properties.item(cDeclarations.getCsDocEstateID());
        c.setValue(m_estado);

        c = properties.item(mComprasConstantes.OC_NRODOC);
        c.setValue(m_nrodoc);
        c.setTextAlign(vbRightJustify);

        c = properties.item(mComprasConstantes.OC_DESCUENTO1);
        c.setValue(m_descuento1);

        c = properties.item(mComprasConstantes.OC_DESCUENTO2);
        c.setValue(m_descuento2);

        c = properties.item(mComprasConstantes.CPG_ID);
        c.setSelectId(m_cpg_id);
        c.setValue(m_condicionPago);

        c = properties.item(mComprasConstantes.LP_ID);
        c.setSelectFilter(GetListaPrecioGetXProveedor(m_doc_id, m_prov_id));
        c.setSelectId(m_lp_id);
        c.setValue(m_listaPrecio);

        c = properties.item(mComprasConstantes.LD_ID);
        c.setSelectFilter(GetListaDescGetXProveedor(m_doc_id, m_prov_id));
        c.setSelectId(m_ld_id);
        c.setValue(m_listaDescuento);

        c = properties.item(mComprasConstantes.CCOS_ID);
        c.setSelectId(m_ccos_id);
        c.setValue(m_centroCosto);

        c = properties.item(mComprasConstantes.SUC_ID);
        c.setSelectId(m_suc_id);
        c.setValue(m_sucursal);

        c = properties.item(mComprasConstantes.LGJ_ID);
        c.setSelectId(m_lgj_id);
        c.setValue(m_legajo);

        c = properties.item(mComprasConstantes.OC_DESCRIP);
        c.setValue(m_descrip);

        c = properties.item(mComprasConstantes.OC_ORDENCOMPRA);
        c.setValue(m_ordencompra);

        c = properties.item(mComprasConstantes.OC_PRESUPUESTO);
        c.setValue(m_presupuesto);

        c = properties.item(mComprasConstantes.OC_MAQUINA);
        c.setValue(m_maquina);

        c = properties.item(mComprasConstantes.OC_MAQUINAMODELO);
        c.setValue(m_maquinamodelo);

        c = properties.item(mComprasConstantes.OC_MAQUINANRO);
        c.setValue(m_maquinanro);

        c = properties.item(mComprasConstantes.OC_FLETEAEREO);
        c.setValue(m_fleteaereo);

        c = properties.item(mComprasConstantes.OC_FLETEMARITIMO);
        c.setValue(m_fletemaritimo);

        c = properties.item(mComprasConstantes.OC_FLETECAMION);
        c.setValue(m_fletecamion);

        c = properties.item(mComprasConstantes.OC_FLETECORREO);
        c.setValue(m_fletecorreo);

        c = properties.item(mComprasConstantes.OC_FLETEOTROS);
        c.setValue(m_fleteotros);

        c = properties.item(mComprasConstantes.CLI_ID);
        c.setValue(m_cliente);
        c.setSelectId(m_cli_id);

        abmGen = m_dialog;
        abmGen.ShowValues(m_dialog.getProperties());

        abmGen.ResetChanged;

        c = cIABMGridCellValue.getItems(m_items, C_ITEMS);
        if(!pLoadItems(c)) { return; }

        m_itemsDeleted = "";

        abmGen = m_items;
        abmGen.ShowValues(m_items.getProperties());

        var properties = m_footer.getProperties();

        c = properties.item(mComprasConstantes.OC_SUBTOTAL);
        c.setValue(m_subTotal);

        c = properties.item(mComprasConstantes.OC_IMPORTEDESC1);
        c.setValue(m_importeDesc1);

        c = properties.item(mComprasConstantes.OC_IMPORTEDESC2);
        c.setValue(m_importeDesc2);

        c = properties.item(mComprasConstantes.OC_NETO);
        c.setValue(m_neto);

        c = properties.item(mComprasConstantes.OC_IVARI);
        c.setValue(m_ivari);

        c = properties.item(mComprasConstantes.OC_IVARNI);
        c.setValue(m_ivarni);

        c = properties.item(mComprasConstantes.OC_TOTAL);
        c.setValue(m_total);

        abmGen = m_footer;
        abmGen.ShowValues(m_footer.getProperties());

        pSetEnabled();

        // DATADD
        mPublic.self.showDataAddProveedor(m_userCfg.getShowDataAddInCompras(), m_dialog);

      };

      var pShowStartWizard = function() {
        try {

          var oWizard = null;
          oWizard = new cOrdenCompraWizard();

          var mouse = null;
          mouse = new cMouseWait();

          if(!oWizard.self.load()) { return; }

          oWizard.self.setProv_id(m_prov_id);
          oWizard.self.setProveedor(m_proveedor);
          oWizard.self.setPcIds() = m_pcIds;
          oWizard.self.setDoc_id(m_lastDoc);
          oWizard.self.setDocumento(m_lastDocName);
          oWizard.self.setObjClient(self);

          //Dim iEditGeneric As cIEditGeneric
          //Set iEditGeneric = oWizard
          //Set iEditGeneric.ObjTree = m_ObjTree

          var iObjWizard = null;
          var oObjWizard = null;

          iObjWizard = CSKernelClient2.CreateObject("CSABMInterface2.cWizardGeneric");
          oObjWizard = iObjWizard;
          oObjWizard.ObjClient = oWizard;

          iObjWizard.show("CSCompra2.cOrdenCompraWizard");

          oObjWizard.ObjAbm.cIABMGeneric.getObjForm().ZOrder;

          // **TODO:** goto found: GoTo ExitProc;
        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, "pShowStartWizard", C_MODULE, "");
          // **TODO:** label found: ExitProc:;
        }
        // **TODO:** on error resume next found !!!
      };

      // Construccion - Destruccion
      self.initialize = function() {
        try {

          //'Error al grabar la Orden de Compra
          c_ErrorSave = Cairo.Language.getText(1925, "");
          //'Ordenes de Compra
          c_strTitle = Cairo.Language.getText(2169, "");

          m_generalConfig = new cGeneralConfig();
          m_generalConfig.Load;
          G.redim(m_pcIds, 0);

          // Preferencias del Usuario
          //
          m_userCfg = new cUsuarioConfig();
          m_userCfg.Load;
          m_userCfg.ValidateOC;

          // **TODO:** goto found: GoTo ExitProc;
        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, "Class_Initialize", C_MODULE, "");
          // **TODO:** label found: ExitProc:;
        }
        // **TODO:** on error resume next found !!!
      };

      self.destroy = function() {
        try {

          m_dialog = null;
          m_listController = null;
          m_footer = null;
          m_items = null;
          G.redim(m_pcIds, 0);

          // Preferencias del Usuario
          //
          m_userCfg = null;

          // **TODO:** goto found: GoTo ExitProc;
        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, "Class_Terminate", C_MODULE, "");
          // **TODO:** label found: ExitProc:;
        }
        // **TODO:** on error resume next found !!!
      };

      var pShowApply = function() {

        if(!DoCairo.Security.anAccess(csComprasPrestacion.cSPRECPRAMODIFYAPLIC, m_doc_id, csE_DocTypePrestacion.cSEDOCTPREAPLICAR)) { return; }

        if(m_objApply == null) {
          m_objApply = new cOrdenCompraAplic();

          // Edit Apply
          //
        }
        else {
          if(m_objApply.self.getId() != m_id) {
            m_objApply.self.setObjectClient(null);
            m_objApply = new cOrdenCompraAplic();
          }
        }

        // Edit Apply
        //
        m_objApply.self.setObjectClient(self);

        if(!m_objApply.self.show(m_id, m_total, m_nrodoc, m_prov_id, m_proveedor, m_suc_id, m_doc_id, m_doct_id == csEDocumentoTipo.cSEDT_DEVOLUCIONORDENCPRA)) {
          m_objApply = null;
        }
      };

      var pShowRemito = function() {
        try {

          var o = null;
          o = new CSCompra2.cRemitoCompra();

          o.ShowRemito(pGetProvId(), pGetOcIds());

          // **TODO:** goto found: GoTo ExitProc;
        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, "pShowRemito", C_MODULE, "");
          // **TODO:** label found: ExitProc:;
        }
        // **TODO:** on error resume next found !!!
      };

      var pGetProvId = function() {
        return m_dialog.getProperties().item(mComprasConstantes.PROV_ID).getSelectId();
      };

      var pGetOcIds = function() {
        var rtn() = null;
        G.redim(rtn, 1);
        rtn[1] = m_id;
        return rtn;
      };

      var pProcessMultiRow = function(info) {
        var _rtn = null;

        info.bAddRows = false;

        switch (info.Key) {
          case K_ITEMS:
            var w_pGetItems = pGetItems();

            var row = null;
            row = w_pGetItems.getGrid().getRows(info.lRow);

            if(row.item(info.lCol).getKey() == KI_PR_ID) {

              var oCell = null;

              oCell = Dialogs.cell(row, KI_PR_ID);

              if(LenB(oCell.getSelectIntValue())) {
                if(oCell.getSelectIntValue().indexOf(",", 1)) {
                  AddMultiRowsCompras(oCell.getSelectIntValue(), info, KI_CANTIDAD);
                  _rtn = true;
                }
              }
            }
            break;
        }


        return _rtn;
      };

      //Private Sub pAddMultiRows(ByVal Ids As String, _
      //                          ByRef Info As Variant)
      //  Dim sqlstmt As String
      //  Dim rs      As ADODB.Recordset
      //
      //  sqlstmt = "select pr_nombrecompra, pr_id from Producto where pr_id in (" & Ids & ")"
      //  If Not gDB.OpenRs(sqlstmt, rs) Then Exit Sub
      //  If rs.EOF Then Exit Sub
      //
      //  Dim i As Long
      //  Dim j As Long
      //  Dim k As Long
      //  Dim PR_ID As Long
      //  Dim vIds  As Variant
      //  Dim vIds2 As Variant
      //  Dim bFound As Boolean
      //
      //  vIds2 = Split(Ids, ",")
      //
      //  ReDim vIds(UBound(vIds2))
      //
      //  For i = 0 To UBound(vIds2)
      //    bFound = False
      //    For j = 0 To UBound(vIds)
      //
      //      If vIds2(i) = vIds(j) Then
      //        bFound = True
      //        Exit For
      //      End If
      //
      //    Next
      //    If Not bFound Then
      //      vIds(k) = vIds2(i)
      //      k = k + 1
      //    End If
      //  Next
      //
      //  ReDim Preserve vIds(k - 1)
      //
      //  ' Ahora respeto el orden de seleccion
      //  '
      //  For i = 0 To UBound(vIds)
      //
      //    rs.MoveFirst
      //
      //    Do While Not rs.EOF
      //
      //      PR_ID = gDB.ValField(rs.fields, cscPrId)
      //
      //      If Val(vIds(i)) = PR_ID Then
      //        Info.NewId.Add PR_ID
      //        Info.NewValue.Add gDB.ValField(rs.fields, cscPrNombrecompra)
      //        Exit Do
      //      End If
      //
      //      rs.MoveNext
      //    Loop
      //
      //  Next
      //
      //  ' No lo toquen, es mas 1 :( o explota todooo :P
      //  ' ups al final no era jeje
      //  '
      //  Info.iAddRows = Info.NewId.Count '+ 1
      //
      //  Info.bAddRows = Info.iAddRows
      //
      //End Sub

      var pGetItems = function() {
        return m_items.getProperties().item(C_ITEMS);
      };

      // HIDECOLS
      //
      var pShowHideCols = function(bOnlyStock) {
        var columns = null;
        var bVisible = null;
        var abmObj = null;
        abmObj = m_dialog;

        if(abmObj.getInSave()) { return; }

        bVisible = Cairo.Util.val(m_dialog.getProperties().item(c_HideCols).getValue()) == 0;

        var iProp = null;
        iProp = pGetItems();

        abmObj.DrawGrid(iProp, false);

        var i = null;

        columns = iProp.getGrid().getColumns();
        for (i = 1; i <= columns.count(); i++) {
          switch (columns(i).Key) {

            case KI_DESCUENTO:
            case KI_UNIDAD:
            case KI_PRECIO_LP:
            case KI_IVARNI:
            case KI_CCOS_ID:

              // Solo si la llamada fue para todas las columnas
              // y no unicamente para las columnas de stock
              //
              if(!bOnlyStock) {
                columns(i).Visible = bVisible;
                abmObj.RefreshColumnPropertiesByIndex(iProp, i);
              }

              break;
          }
        }

        abmObj.DrawGrid(iProp, true);
      };
      //
      // HIDECOLS - fin

      var pGetFileNamePostFix = function() {
        var rtn = null;

        rtn = m_dialog.getProperties().item(mComprasConstantes.PROV_ID).getValue().Substring(0, 50)+ "-"+ m_dialog.getProperties().item(mComprasConstantes.OC_NRODOC).getValue();

        return rtn;
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