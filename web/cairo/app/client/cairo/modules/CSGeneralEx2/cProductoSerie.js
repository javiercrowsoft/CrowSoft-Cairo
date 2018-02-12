(function() {
  "use strict";

  Cairo.module("ProductoSerie.Edit", function(Edit, Cairo, Backbone, Marionette, $, _) {

    var createObject = function() {

      var self = {};

      var Dialogs = Cairo.Dialogs;
      var P = Cairo.Promises;

      var C_MODULE = "cProductoSerie";

      var C_ITEMS = "Items";
      var C_NRO_SERIE = "NroS";
      var C_LOAD_EX = "LoadEx";
      var C_PASTE_XLS = "PasteXls";
      var C_NO_FILTER_DEPL = "NoFilterDepl";

      var K_ITEMS = 1;
      var K_CMD_EDIT_EX = 2;
      var K_PASTE_FROM_XLS = 3;
      var K_NO_FILTER_DEPL = 4;

      var KI_PRNS_ID = 1;
      var KI_NUMERO = 2;
      var KI_NUMERO2 = 10;
      var KI_NUMERO3 = 11;
      var KI_DESCRIP = 3;
      var KI_FECHA_VTO = 4;
      var KI_KIT_ITEM = 5;
      var KI_DELETE = 6;

      var m_coll;

      var m_dialog;
      var m_isInput;
      var m_prId = 0;
      var m_deplId = 0;
      var m_depf_id = 0;
      var m_ctrlStock;
      var m_bEditKit;
      var m_bParteProdKit;
      var m_provId = 0;
      var m_cliId = 0;
      var m_bDelete;
      var m_deleteCount = 0;

      self.getColl = function() {
        return m_coll;
      };

      self.setColl = function(rhs) {
        m_coll = rhs;
      };

      self.setIsInput = function(rhs) {
        m_isInput = rhs;
      };

      self.setPrId = function(rhs) {
        m_prId = rhs;
      };

      self.setDeplId = function(rhs) {
        m_deplId = rhs;
        pGetDepfId();
      };

      self.setBEditKit = function(rhs) {
        m_bEditKit = rhs;
      };

      self.setBParteProdKit = function(rhs) {
        m_bParteProdKit = rhs;
      };

      self.setProvId = function(rhs) {
        m_provId = rhs;
      };

      self.setCliId = function(rhs) {
        m_cliId = rhs;
      };

      self.setDelete = function(rhs) {
        m_bDelete = rhs;
      };

      self.setDeleteCount = function(rhs) {
        m_deleteCount = rhs;
      };

      self.addProductoSerie = function(pt) {
        try {

          var pt2 = Cairo.ProductoSerieType.createObject();

          pt2.setCodigo(pt.getCode());
          pt2.setCode2(pt.getCode2());
          pt2.setCode3(pt.getCode3());
          pt2.setDescrip(pt.getDescrip());
          pt2.setFechaVto(pt.getFechaVto());
          pt2.setPrnsId(pt.getPrnsId());
          pt2.setPrIdItem(pt.getPrIdItem());
          pt2.setPrIdKit(pt.getPrIdKit());
          pt2.setKitItem(pt.getKitItem());

          m_coll.add(pt2);

        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, ex, "addProductoSerie", C_MODULE, "");
        }
      };

      self.edit = function() {
        var rtn = false;
        
        try {

          m_dialog = Cairo.Dialogs.Views.Controller.newDialog();
          m_dialog.setOkCancelDialog(true);
          m_dialog.setNoAskForSave(true);
          m_dialog.setInModalWindow(true);

          loadCollection();

          rtn = m_dialog.getOkCancelDialogResult();
        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, ex, "Edit", C_MODULE, "");
        }
        
        return rtn;
      };

      self.copy = function() {

      };

      self.editNew = function() {

      };

      self.getApplication = function() {
        return Cairo.Application.getName();
      };

      self.editDocumentsEnabled = function() {
        return false;
      };

      self.copyEnabled = function() {
        return false;
      };

      self.addEnabled = function() {
        return false;
      };

      self.showDocDigital = function() {

      };

      self.messageEx = function(messageId, info) {
        return P.resolvedPromise();
      };

      self.discardChanges = function() {
        return Cairo.Promises.resolvedPromise(refreshCollection());
      };

      self.propertyChange = function(key) {
        switch (key) {
          case K_CMD_EDIT_EX:
            pEditByRange();
            break;

          case K_PASTE_FROM_XLS:
            pPasteFromXLS();
            break;
        }
      };

      self.save = function() {
        return pSaveItems(register);
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
        return "#general/productoserie/" + m_id.toString();
      };

      self.getEditorName = function() {
        var id = m_id ? m_id.toString() : "N" + (new Date).getTime().toString();
        return "productoserie" + id;
      };

      self.getTitle = function() {
        //'Números de Serie
        return Cairo.Language.getText(2890, "");
      };

      self.validate = function() {
        var deleteCount = null;
        var row = null;
        var iProp = null;

        iProp = m_dialog.getProperties().item(C_ITEMS);

        var _count = iProp.getGrid().getRows().size();
        for (var _i = 0; _i < _count; _i++) {
          row = iProp.getGrid().getRows().item(_i);

          if(Dialogs.cell(row, KI_DELETE).getId()) {
            deleteCount = deleteCount + 1;
          }
        }

        if(m_deleteCount != deleteCount) {

          if(m_deleteCount > 1) {
            MsgInfo(Cairo.Language.getText(2891, "", m_deleteCount));
            //Ud. ha maracado más números de serie que los requeridos.  & _
            Sólo(se eliminarán los primeros+ m_deleteCount+ marcados+ empezando a contar desde la fila 1.);
          }
          else {
            MsgInfo(Cairo.Language.getText(2892, ""));
            //Ud. ha maracado más números de serie que los requeridos.  & _
            Solo(se eliminará el primer número marcado+ empezando a contar desde la fila 1.);
          }

          deleteCount = 0;
          var _count = iProp.getGrid().getRows().size();
          for (var _i = 0; _i < _count; _i++) {
            row = iProp.getGrid().getRows().item(_i);

            if(deleteCount >= m_deleteCount) {
              Dialogs.cell(row, KI_DELETE).setId(0);
            }
            else {
              if(Dialogs.cell(row, KI_DELETE).getId()) {
                deleteCount = deleteCount + 1;
              }
            }
          }

          m_dialog.showValue(iProp);

        }
        else if(m_deleteCount > deleteCount) {

          //'Debe marcar los números a eliminar.
          MsgInfo(Cairo.Language.getText(2893, ""));

        }

        return Cairo.Promises.resolvedPromise(true);

      };

      // Implementacion de cIABMClientGrid

      var columnAfterEdit = function(key, lRow, lCol, newValue, newValueID) {
        var row = null;

        // Si no es un remito de compra o una factura de compra que mueve stock
        // el numero de serie tiene que salir de la tabla ProductoNumeroSerie
        // y como en la primera columna guardo el prns_id voy a actualizarlo
        // para que todo el codigo trabaje bien
        //
        if(!m_isInput) {
          switch (key) {
            case K_ITEMS:
              var property = m_dialog.getProperties().item(C_ITEMS).getGrid();
              if(property.Columns(lCol).key == KI_NUMERO) {
                row = property.Rows(lRow);
                Dialogs.cell(row, KI_PRNS_ID).setValue(newValueID);
              }
              break;
          }
        }
        return true;
      };

      var columnBeforeEdit = function(key, lRow, lCol, iKeyAscii) {
        var _rtn = null;
        try {

          var o = null;
          var iProp = null;
          var row = null;

          iProp = m_dialog.getProperties().item(C_ITEMS);
          o = iProp.getGrid().getColumns(lCol);
          if(o.getKey() == KI_NUMERO) {

            row = iProp.getGrid().getRows(lRow);

            o.setSelectFilter(Cairo.Database.sqlString(pGetFilter(row, lRow)));

            var abmObj = null;
            abmObj = m_dialog;
            abmObj.RefreshColumnProperties(iProp, C_NRO_SERIE);

          }
          else if(o.getKey() == KI_KIT_ITEM) {
            return _rtn;
          }

          _rtn = true;

          // **TODO:** goto found: GoTo ExitProc;
        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, ex, "columnBeforeEdit ", C_MODULE, "");
          // **TODO:** label found: ExitProc:;
        }
        // **TODO:** on error resume next found !!!

        return _rtn;
      };

      var columnButtonClick = function(key, lRow, lCol, iKeyAscii) {

      };

      var deleteRow = function(key, row, lRow) {

      };

      var listAdHock = function(key, row, colIndex, list) {

      };

      var newRow = function(key, rows) {

      };

      var columnClick = function(key, lRow, lCol) {

      };

      var dblClick = function(key, lRow, lCol) {

      };

      var validateRow = function(key, row, rowIndex) {
        var _rtn = null;
        try {

          switch (key) {
            case K_ITEMS:
              _rtn = pValidateRowItems(row, rowIndex);
              break;
          }

          // **TODO:** goto found: GoTo ExitProc;
        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, C_ValidateRow, C_MODULE, "");
          // **TODO:** label found: ExitProc:;
        }
        // **TODO:** on error resume next found !!!

        return _rtn;
      };

      var columnAfterUpdate = function(key, lRow, lCol) {

      };

      var isEmptyRow = function(key, row, rowIndex) {
        // Ninguna fila puede estar vacia
        // ya que el usuario debe completar
        // todos los numeros de serie
        return false;
      };

      var pValidateRowItems = function(row, rowIndex) {
        var cell = null;

        var strRow = " (Row: " + rowIndex.toString() + ")";

        var _count = row.size();
        for (var _i = 0; _i < _count; _i++) {
          cell = row.item(_i);
          switch (cell.getKey()) {
            case KI_NUMERO:
              if(m_isInput) {
                if(ValEmpty(cell.getValue(), Cairo.Constants.Types.text)) {
                  //'Debe indicar un número de serie (1)
                  MsgInfo(Cairo.Language.getText(1630, "", strRow));
                }
              }
              else {
                if(ValEmpty(cell.getId(), Cairo.Constants.Types.id) || cell.getId() < 0) {
                  //'Debe indicar un Número de Serie existente (1)
                  MsgInfo(Cairo.Language.getText(2894, "", strRow));
                }
              }
              break;
          }
        }

        return Cairo.Promises.resolvedPromise(true);
      };

      // funciones privadas
      var loadCollection = function() {
        var c = null;

        var properties = m_dialog.getProperties();
        properties.clear();

        c = properties.add(null, C_ITEMS);
        c.setType(Dialogs.PropertyType.grid);
        c.hideLabel();;
        setGridItems(c);
        if(!pLoadItems(c)) { return false; }
        c.setName(C_ITEMS);
        c.setKey(K_ITEMS);
        c.setGridEditEnabled(true);
        c.setTop(1600);

        if(!m_bDelete) {
          var elem = properties.add(null, C_LOAD_EX);
          elem.setType(Dialogs.PropertyType.button);
          //'Cargar números por rango
          elem.setName(Cairo.Language.getText(2895, ""));
          elem.hideLabel();;
          elem.setKey(K_CMD_EDIT_EX);
          elem.setTop(1100);
          elem.setLeft(380);

          var elem = properties.add(null, C_PASTE_XLS);
          elem.setType(Dialogs.PropertyType.button);
          //'Pegar desde Excel
          elem.setName(Cairo.Language.getText(1982, ""));
          elem.hideLabel();;
          elem.setKey(K_PASTE_FROM_XLS);
          elem.setTop(1100);
          elem.setLeft(3000);

          var elem = properties.add(null, C_NO_FILTER_DEPL);
          elem.setType(Dialogs.PropertyType.check);
          //'No Filtrar por Depósitos
          elem.setName(Cairo.Language.getText(2896, ""));
          elem.setKey(K_NO_FILTER_DEPL);
          elem.setTop(1100);
          elem.setLeft(7500);
          elem.setLeftLabel(-1800);
          elem.setVisible(SecurityCanAccessSilent(csGeneralPrestacion.cSPREGSELECTSERIEEX));

        }

        if(m_bDelete) {
          if(m_deleteCount > 1) {
            m_dialog.setTitle(Cairo.Language.getText(2897, "", m_deleteCount));
            //Indique los  & m_DeleteCount &  números de serie a eliminar
          }
          else {
            m_dialog.setTitle(Cairo.Language.getText(2898, ""));
            //Indique el número a eliminar
          }
        }

        if(!m_dialog.show(self)) { return false; }

        return true;
      };

      var refreshCollection = function() {

        m_dialog.setTitle(m_name);

        var properties = m_dialog.getProperties();

        var elem = properties.item(C_LOAD_EX);

        var elem = properties.item(C_PASTE_XLS);

        var elem = properties.item(C_NO_FILTER_DEPL);

        return m_dialog.showValues(properties);
      };

      var setGridItems = function(property) {
        var pt = null;

        var w_columns = property.getGrid().getColumns();

        var elem = w_columns.add(null);
        elem.setVisible(false);
        elem.setKey(KI_PRNS_ID);

        var elem = w_columns.add(null);
        elem.setType(Dialogs.PropertyType.text);
        //'Item
        elem.setName(Cairo.Language.getText(2899, ""));
        elem.setWidth(2500);
        elem.setVisible(m_bEditKit);
        elem.setKey(KI_KIT_ITEM);

        var elem = w_columns.add(null, C_NRO_SERIE);
        //'Numero
        elem.setName(Cairo.Language.getText(1065, ""));

        if(m_isInput) {
          elem.setType(Dialogs.PropertyType.text);
        }
        else {
          elem.setType(Dialogs.PropertyType.select);
          elem.setSelectTable(Cairo.Tables.PRODUCTOSERIE);
        }

        elem.setEnabled(Not m_bDelete);

        elem.setWidth(2500);
        elem.setKey(KI_NUMERO);

        var elem = w_columns.add(null);
        //'Borrar
        elem.setName(Cairo.Language.getText(1983, ""));
        elem.setType(Dialogs.PropertyType.check);
        elem.setKey(KI_DELETE);
        elem.setVisible(m_bDelete);

        var elem = w_columns.add(null);
        //'Número 2
        elem.setName(Cairo.Language.getText(2900, ""));
        elem.setType(Dialogs.PropertyType.text);
        elem.setEnabled(Not m_bDelete);
        elem.setWidth(2500);
        elem.setKey(KI_NUMERO2);

        var elem = w_columns.add(null);
        //'Número 3
        elem.setName(Cairo.Language.getText(2901, ""));
        elem.setType(Dialogs.PropertyType.text);
        elem.setEnabled(Not m_bDelete);
        elem.setWidth(2500);
        elem.setKey(KI_NUMERO3);

        var elem = w_columns.add(null);
        elem.setName(Cairo.Constants.DESCRIPTION_LABEL);
        elem.setType(Dialogs.PropertyType.text);
        elem.setEnabled(Not m_bDelete);
        elem.setWidth(3000);
        elem.setKey(KI_DESCRIP);

        var elem = w_columns.add(null);
        //'Fecha Vto.
        elem.setName(Cairo.Language.getText(2902, ""));
        elem.setType(Dialogs.PropertyType.date);
        elem.setEnabled(Not m_bDelete);
        elem.setWidth(1200);
        elem.setKey(KI_FECHA_VTO);

        var w_rows = property.getGrid().getRows();

        var _count = m_coll.size();
        for (var _i = 0; _i < _count; _i++) {
          pt = m_coll.item(_i);

          var elem = w_rows.add(null, pt.getPrnsId());

          var elem = elem.add(null);
          elem.Value = pt.getPrnsId();
          elem.setKey(KI_PRNS_ID);

          var elem = elem.add(null);
          elem.Value = pt.getKitItem();
          elem.Id = pt.getPrIdItem();
          elem.setKey(KI_KIT_ITEM);

          var elem = elem.add(null);
          elem.Value = pt.getCode();
          elem.Id = pt.getPrnsId();
          elem.setKey(KI_NUMERO);

          var elem = elem.add(null);
          elem.Id = pt.getDeleted();
          elem.setKey(KI_DELETE);

          var elem = elem.add(null);
          elem.Value = pt.getCode2();
          elem.setKey(KI_NUMERO2);

          var elem = elem.add(null);
          elem.Value = pt.getCode3();
          elem.setKey(KI_NUMERO3);

          var elem = elem.add(null);
          elem.Value = pt.getDescrip();
          elem.setKey(KI_DESCRIP);

          var elem = elem.add(null);
          elem.Value = pt.getFechaVto();
          elem.setKey(KI_FECHA_VTO);
        }

        return true;
      };

      var pSaveItems = function(mainTransaction) {
        var row = null;
        var cell = null;
        var i = null;
        var pt = null;

        var _count = m_dialog.getProperties().item(C_ITEMS).getGrid().getRows().size();
        for (var _i = 0; _i < _count; _i++) {
          row = m_dialog.getProperties().item(C_ITEMS).getGrid().getRows().item(_i);
          i = i + 1;
          pt = m_coll(i);
          var _count = row.size();
          for (var _j = 0; _j < _count; _j++) {
            cell = row.item(_j);
            switch (cell.getKey()) {
              case KI_DESCRIP:
                pt.setDescrip(cell.getValue());
                break;

              case KI_NUMERO:
                pt.setCodigo(cell.getValue());
                break;

              case KI_NUMERO2:
                pt.setCode2(cell.getValue());
                break;

              case KI_NUMERO3:
                pt.setCode3(cell.getValue());
                break;

              case KI_FECHA_VTO:
                pt.setFechaVto(cell.getValue());
                break;

              case KI_PRNS_ID:
                pt.setPrnsId(Cairo.Util.val(cell.getValue()));
                break;

              case KI_DELETE:
                pt.setDeleted(cell.getId());
                break;
            }
          }
        }

        return pValidateUnique();
      };

      var pValidateUnique = function() {
        var collAux = null;
        var pt = null;
        var series = null;
        var bNotUnique = null;
        var q = null;

        // **TODO:** on error resume next found !!!

        collAux = new Collection();
        VBA.ex.clear();
        var _count = m_coll.size();
        for (var _i = 0; _i < _count; _i++) {
          pt = m_coll.item(_i);

          collAux.add(pt, "K"+ pt.getPrnsId().toString());
          if(VBA.ex.Number) {
            series = series+ pt.getCode()+ ", ";
            VBA.ex.clear();
            q = q + 1;
            bNotUnique = true;
          }
        }

        if(bNotUnique) {
          series = RemoveLastColon(Cairo.String.rtrim(series));
          if(q > 1) {
            MsgWarning(Cairo.Language.getText(2903, "", series));
            //Los Números de Serie & series & están indicados más de una vez
          }
          else {
            MsgWarning(Cairo.Language.getText(2904, "", series));
            //El Número de Serie  & series &  está indicado más de una vez
          }
          return null;
        }

        return true;
      };

      var pPasteFromXLS = function() {

        var data = null;
        var vData = null;

        data = Clipboard.GetText;
        vData = Split(data, Chr(13)+ Chr(10));

        if(vData.Length < 0) { return; }

        var row = null;
        var firstRow = null;
        var iProp = null;
        var q = null;
        var i = null;

        iProp = m_dialog.getProperties().item(C_ITEMS);

        firstRow = iProp.getSelectedIndex();
        if(firstRow < 1) { firstRow = 1; }

        for (i = firstRow; i <= m_coll.size(); i++) {

          if(vData.Length < q) { break; }

          row = iProp.getGrid().getRows(i);

          var cell = Dialogs.cell(row, KI_NUMERO);
          cell.setValue(vData(q));
          if(!m_isInput) {
            cell.setId(pSetPrnsId(row, i, cell.getValue()));
            Dialogs.cell(row, KI_PRNS_ID).setValue(cell.getId());
          }
          q = q + 1;
        }

        var abmObj = null;
        abmObj = m_dialog;
        abmObj.ShowValue(iProp, true);
      };

      var pEditByRange = function() {
        var prnsRange = null;

        prnsRange = new cProductoSerieRange();
        if(!prnsRange.self.edit()) { return; }

        var iProp = null;
        iProp = m_dialog.getProperties().item(C_ITEMS);

        var first = null;
        var last = null;
        var current = null;
        var bByChar = null;
        var i = null;
        var valueAux = null;
        var firstRow = null;

        bByChar = prnsRange.self.getBByChar();
        first = prnsRange.self.getFirst();
        last = prnsRange.self.getLast();

        //-----------------
        // TODO: por ahora no soportamos incrementacion alfabetica
        if(bByChar) {
          //'Esta opción aún no esta implementada
          MsgInfo(Cairo.Language.getText(1986, ""));
          return;
        }

        if(G.isNumeric(first)) {
          current = pGetFirstSerie(first);
        }
        else {
          current = first;
        }
        valueAux = pGetFirstSerie(first);

        firstRow = iProp.getSelectedIndex();
        if(firstRow < 1) { firstRow = 1; }

        var row = null;

        for (i = firstRow; i <= m_coll.size(); i++) {
          current = pIncrement(current, bByChar, valueAux);

          row = iProp.getGrid().getRows(i);

          if(pFinish(current, last)) { break; }

          var cell = Dialogs.cell(row, KI_NUMERO);
          cell.setValue(current);
          if(!m_isInput) {
            cell.setId(pSetPrnsId(row, i, cell.getValue()));
            Dialogs.cell(row, KI_PRNS_ID).setValue(cell.getId());
          }
        }

        var abmObj = null;
        abmObj = m_dialog;
        abmObj.ShowValue(iProp, true);
      };

      var pFinish = function(current, last) {
        var _rtn = null;
        if(G.isNumeric(last) && G.isNumeric(current)) {
          _rtn = Cairo.Util.val(last) < Cairo.Util.val(current);
        }
        else {
          _rtn = last < current;
        }

        return _rtn;
      };

      var pGetFirstSerie = function(first) {
        var rtn = null;
        var aux = null;
        var n = null;
        var strZeroLeft = null;

        if(G.isNumeric(first)) {

          if(Cairo.Util.val(first).$.trim().Length < first.Length) {
            strZeroLeft = first.Substring(1, first.Length - $.trim(Cairo.Util.val(first)).Length);
          }

          rtn = strZeroLeft+ (Abs(Cairo.Util.val(first) - 1)).toString();

        }
        else {
          do          n = n + 1;
            aux = first.Substring(first.Length - n);
        } while (!IsNumeric(aux)) {
          aux = aux.Substring(2);
          if(G.isNumeric(aux)) {
            rtn = Cairo.Util.val(aux) - 1;
          }
          else {
            rtn = 0;
          }
        }
        return rtn;
      };

      var pIncrement = function(value, bByChar, valueAux) { // TODO: Use of ByRef founded Private Function pIncrement(ByVal Value As String, ByVal bByChar As Boolean, ByRef valueAux As Long) As String
        var length = null;
        var strNumber = null;
        var strZeroLeft = null;

        if(bByChar) {
        }
        else {
          if(G.isNumeric(value)) {

            if(Cairo.Util.val(value).$.trim().Length < value.Length) {
              strZeroLeft = value.Substring(1, value.Length - $.trim(Cairo.Util.val(value) + 1).Length);
            }

            value = strZeroLeft+ Cairo.Util.val(value) + 1;

          }
          else {
            valueAux = valueAux + 1;
            strNumber = valueAux;
            length = value.Length - strNumber.Length;
            if(length < 0) { length = 0; }
            value = value.Substring(1, length);
            value = value+ strNumber;
          }
        }

        return value;
      };

      var pGetDepfId = function() {
        if(m_deplId == Cairo.Constants.NO_ID) {
          m_depf_id = Cairo.Constants.NO_ID;
          m_ctrlStock = csENoControlaStock;
        }
        else {
          Cairo.Database.getData(Cairo.General.Constants.DEPOSITOLOGICO, Cairo.General.Constants.DEPL_ID, m_deplId, Cairo.General.Constants.DEPF_ID, m_depf_id);
          pGetTypeStockControl();
        }
      };

      var pGetTypeStockControl = function() {
        var rs = null;
        var sqlstmt = null;
        sqlstmt = "select cfg_valor from configuracion where cfg_grupo = "+ Cairo.Database.sqlString(c_GrupoGeneral)+ " and cfg_aspecto = "+ Cairo.Database.sqlString(c_TipoControlStock);
        if(!Cairo.Database.openRs(sqlstmt, rs)) { return; }
        if(rs.isEOF()) { return; }
        m_ctrlStock = Cairo.Util.val(Cairo.Database.valField(rs.getFields(), Cairo.Constants.CFG_VALOR));
      };

      self.initialize = function() {
        try {

          m_coll = new Collection();

          // **TODO:** goto found: GoTo ExitProc;
        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, ex, "Class_Initialize", C_MODULE, "");
          // **TODO:** label found: ExitProc:;
        }
        // **TODO:** on error resume next found !!!
      };

      self.destroy = function() {
        m_coll = null;
        m_dialog = null;
      };

      var pSetPrnsId = function(row, lRow, prnsCodigo) {
        var sqlstmt = null;
        var rs = null;

        sqlstmt = "select prns_id from ProductoNumeroSerie where prns_codigo = "+ Cairo.Database.sqlString(prnsCodigo)+ " and "+ pGetFilter(row, lRow);

        if(!Cairo.Database.openRs(sqlstmt, rs)) { return 0; }

        if(rs.isEOF()) { return 0; }

        return Cairo.Database.valField(rs.getFields(), Cairo.General.Constants.PRNS_ID);
      };

      var pGetFilter = function(row, lRow) {
        var filter = "";
        var pt = m_coll.get(lRow);

        if(m_bEditKit && !m_bParteProdKit) {
          // Tiene que ser un numero de serie asociado a un kit de este tipo de pr_id
          //
          filter = Cairo.General.Constants.PR_ID+ " = "+ Dialogs.cell(row, KI_KIT_ITEM).getId().toString()+ " and pr_id_kit = "+ m_prId;

        }
        else if(m_bParteProdKit) {
          // Tiene que ser un numero de serie que no este asociado a ningun kit o
          // asociado a un kit que componga al kit que estamos editando
          //
          filter = Cairo.General.Constants.PR_ID+ " = "+ Dialogs.cell(row, KI_KIT_ITEM).getId();
          if(pt.getPrIdKit() != 0) {
            filter = filter+ " and pr_id_kit = "+ pt.getPrIdKit().toString();
          }
          else {
            filter = filter+ " and pr_id_kit is null";
          }

        }
        else {
          // Tiene que ser un numero de serie que no este asociado a ningun kit
          //
          filter = Cairo.General.Constants.PR_ID+ " = "+ m_prId+ " and pr_id_kit is null";
        }

        var bNoFilterDepl = pGetNoFilterDepl();

        if(!bNoFilterDepl) {

          // Los contra-documentos (devoluciones y notas de credito) envian
          // el deposito del tercero y el cliente o proveedor segun corresponda
          //
          if(m_deplId == csE_DepositosInternos.cSEDEPLIDTERCERO) {

            filter = filter+ " and depl_id = "+ csE_DepositosInternos.cSEDEPLIDTERCERO.toString();

            if(m_cliId != Cairo.Constants.NO_ID) {
              filter = filter+ " and cli_id = "+ m_cliId;

            }
            else if(m_provId != Cairo.Constants.NO_ID) {

              filter = filter+ " and (prov_id = "+ m_provId+ " or prov_id is null)";
            }

          }
          else {
            // No puede estar en depositos internos del sistema
            //
            filter = filter+ " and depl_id not in (-2,-3)";
          }

          if(m_deplId != Cairo.Constants.NO_ID) {
            // Este 'OR' es momentaneo hasta
            // que el control de stock este estable
            //
            if(m_ctrlStock == csEStockFisico || m_ctrlStock == csENoControlaStock) {
              // Si me indico un deposito y el stock es por deposito fisico
              // exijo que el numero de serie este en algun deposito logico
              // del deposito fisico al que pertenece el deposito logico
              // que me pasaron.
              //
              filter = filter+ " and "+ Cairo.General.Constants.DEPL_ID+ " in (select depl_id from depositoLogico where depf_id = "+ m_depf_id+ ")";

              // Sino es por deposito fisico exijo que este
              // en el deposito logico que me pasaron
              //
            }
            else if(m_ctrlStock == csEStockLogico) {
              filter = filter+ " and "+ Cairo.General.Constants.DEPL_ID+ " = "+ m_deplId;
            }

          }
          else {
            filter = filter+ " and (1=2)";
          }

        }

        if(pt.getPrnsId()) {
          filter = "("+ filter+ ") or (prns_id = "+ pt.getPrnsId().toString()+ ")";
        }

        return filter;
      };

      var pGetNoFilterDepl = function() {
        return Cairo.Util.val(m_dialog.getProperties().item(C_NO_FILTER_DEPL).getValue());
      };

      return self;
    };

    Edit.Controller = { getEditor: createObject };

  });

  Cairo.module("ProductoSerie.List", function(List, Cairo, Backbone, Marionette, $, _) {
    List.Controller = {
      list: function() {

        var self = this;

        /*
         this function will be called by the tab manager every time the
         view must be created. when the tab is not visible the tab manager
         will not call this function but only make the tab visible
         */
        var createTreeDialog = function(tabId) {

          var editors = Cairo.Editors.productoserieEditors || Cairo.Collections.createCollection(null);
          Cairo.Editors.productoserieEditors = editors;

          // ListController properties and methods
          //
          self.entityInfo = new Backbone.Model({
            entitiesTitle: "ProductoSeries",
            entityName: "productoserie",
            entitiesName: "productoseries"
          });

          self.showBranch = function(branchId) {
            Cairo.log("Loading nodeId: " + branchId);
            Cairo.Tree.List.Controller.listBranch(branchId, Cairo.Tree.List.Controller.showItems, self);
          };

          self.addLeave = function(id, branchId) {
            try {
              Cairo.Tree.List.Controller.addLeave(branchId, id, self);
            }
            catch(ignore) {
              Cairo.log("Error when adding this item to the branch\n\n" + ignore.message);
            }
          };

          self.refreshBranch = function(id, branchId) {
            try {
              Cairo.Tree.List.Controller.refreshBranchIfActive(branchId, id, self);
            }
            catch(ignore) {
              Cairo.log("Error when refreshing a branch\n\n" + ignore.message);
            }
          };

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
            if(id === Cairo.Constants.NO_ID) {
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

          self.edit = function(id, treeId, branchId) {
            var key = getKey(id);
            if(editors.contains(key)) {
              editors.item(key).dialog.showDialog();
            }
            else {
              var editor = Cairo.ProductoSerie.Edit.Controller.getEditor();
              var dialog = Cairo.Dialogs.Views.Controller.newDialog();

              editor.setTree(self);
              editor.setDialog(dialog);
              editor.setTreeId(treeId);
              editor.setBranchId(branchId);
              editor.edit(id);

              editors.add({editor: editor, dialog: dialog}, key);
            }
          };

          self.destroy = function(id, treeId, branchId) {
            if(!Cairo.Security.hasPermissionTo(Cairo.Security.Actions.General.DELETE_PRODUCTOSERIE)) {
              return Cairo.Promises.resolvedPromise(false);
            }
            var apiPath = Cairo.Database.getAPIVersion();
            return Cairo.Database.destroy(apiPath + "general/productoserie", id, Cairo.Constants.DELETE_FUNCTION, "ProductoSerie").success(
              function() {
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
              }
            );
          };

          // progress message
          //
          Cairo.LoadingMessage.show("ProductoSeries", "Loading productoserie from Crowsoft Cairo server.");

          // create the tree region
          //
          Cairo.addRegions({ productoserieTreeRegion: tabId });

          // create the dialog
          //
          Cairo.Tree.List.Controller.list(
            Cairo.Tables.PRODUCTOSERIE,
            new Cairo.Tree.List.TreeLayout({ model: self.entityInfo }),
            Cairo.productoserieTreeRegion,
            self);

        };

        var showTreeDialog = function() {
          Cairo.Tree.List.Controller.showTreeDialog(self);
        };

        var closeTreeDialog = function() {

        }

        // create the tab
        //
        Cairo.mainTab.showTab("ProductoSeries", "productoserieTreeRegion", "#general/productoseries", createTreeDialog, closeTreeDialog, showTreeDialog);

      }
    };
  });


}());
