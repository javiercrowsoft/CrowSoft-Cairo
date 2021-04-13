# Client Code

## Grid Functions

### list of functions to implement for grids

      //
      // grid
      //

      self.columnAfterEdit = function(key, lRow, lCol, newValue, newValueId) {
        var p = null;

        switch (key) {

          case K_INFORMES:
            // some code that could assign a promise to p or not
            break;
        }
        return p || P.resolvedPromise(true);
      };

      self.columnBeforeEdit = function(key, lRow, lCol, iKeyAscii) {
        var rtn = false;

        switch (key) {
          case K_CUENTA_GRUPO:
            // some code that returns a promise or not
            break;

          default:
            rtn = true;
            break;
        }

        return P.resolvedPromise(rtn);
      };

      self.columnButtonClick = function(key, lRow, lCol, iKeyAscii) {

      };

      self.deleteRow = function(key, row, lRow) {

        switch (key) {
          case K_SUCURSALES:
            // code to get id and add to a string containing the list of deleted
            var id = val(Dialogs.cell(row, KI_S_CLIS_ID).getValue());
            if(id !== NO_ID) { m_itemsDeletedSucursales = m_itemsDeletedSucursales + id.toString() + ","; }
            break;
        }

        return P.resolvedPromise(true);
      };

      self.newRow = function(key, rows) {
        return P.resolvedPromise(true);
      };

      self.validateRow = function(key, row, rowIndex) {
        var p = null;

        try {

          switch (key) {
            case K_SUCURSALES:
              p = validateRowSucursales(row, rowIndex);
              break;
          }
        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, ex, Cairo.Constants.VALIDATE_ROW_FUNCTION, C_MODULE, "");
        }

        return p || P.resolvedPromise(false);
      };

      self.columnAfterUpdate = function(key, lRow, lCol) {
        return P.resolvedPromise(true);
      };

      self.columnClick = function(key, lRow, lCol) {

      };

      self.gridDblClick = function(key, lRow, lCol) {
        return P.resolvedPromise(false);
      };

      self.isEmptyRow = function(key, row, rowIndex) {
        var isEmpty = true;

        try {

          switch (key) {
            case K_SUCURSALES:
              isEmpty = isEmptyRowSuc(row, rowIndex);
              break;
          }
        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, Cairo.Constants.IS_EMPTY_ROW_FUNCTION, C_MODULE, "");
        }

        return P.resolvedPromise(isEmpty);
      };

      ////////////////////////////////////////////////////

### bellow the complete code of FacturaVenta.js

      //
      // grid
      //

      self.columnAfterEdit = function(key, lRow, lCol, newValue, newValueId) {
        var p = null;

        switch (key) {

          case K_INFORMES:
            var property = m_dialog.getProperties().item(C_INFORMES).getGrid().getRows();

            var preId = 0;
            var code = "";

            p = DB.getData(
              "load[" + m_apiPath + "general/informe/" + newValueId.toString() + "/info]");

            p = p.whenSuccessWithResult(function(response) {
              preId = valField(response.data, 'pre_id');
              code = valField(response.data, 'code');
              return true;
            }).then(function() {
              Dialogs.cell(property.Item(lRow), KI_PRE_ID).setId(preId);
              Dialogs.cell(property.Item(lRow), KI_INF_CODIGO).setValue(code);
              return true;
            });
            break;
        }
        return p || P.resolvedPromise(true);
      };

      self.columnBeforeEdit = function(key, lRow, lCol, iKeyAscii) {
        var rtn = false;

        switch (key) {
          case K_CUENTA_GRUPO:
            return D.colUpdateCuentaFilterForCuentaGrupo(getCtaGrupo(), lRow, lCol, m_dialog, KI_CUEG_ID, KI_CUE_ID);
            break;

          default:
            rtn = true;
            break;
        }

        return P.resolvedPromise(rtn);
      };

      self.columnButtonClick = function(key, lRow, lCol, iKeyAscii) {

      };

      self.deleteRow = function(key, row, lRow) {

        switch (key) {
          case K_SUCURSALES:
            
            var id = val(Dialogs.cell(row, KI_S_CLIS_ID).getValue());
            if(id !== NO_ID) { m_itemsDeletedSucursales = m_itemsDeletedSucursales + id.toString() + ","; }
            break;

          case K_CONTACTOS:
            
            var id = val(Dialogs.cell(row, KI_CONT_ID).getValue());
            if(id !== NO_ID) { m_itemsDeletedContacto = m_itemsDeletedContacto + id.toString() + ","; }
            break;

          case K_CUENTA_GRUPO:
            
            var id = val(Dialogs.cell(row, KI_CLICUEG_ID).getValue());
            if(id !== NO_ID) { m_itemsDeletedCuentaGrupo = m_itemsDeletedCuentaGrupo + id.toString() + ","; }
            break;

          case K_EMPRESAS:
            
            return P.resolvedPromise(false);
            break;

          case K_DEPARTAMENTOS:

            var id = val(Dialogs.cell(row, KI_DPTOCLI_ID).getValue());
            if(id !== NO_ID) { m_itemsDeletedDptos = m_itemsDeletedDptos + id.toString() + ","; }
            break;

          case K_INFORMES:

            var id = val(Dialogs.cell(row, KI_PER_ID).getValue());
            if(id !== NO_ID) { m_itemsDeletedInf = m_itemsDeletedInf + id.toString() + ","; }
            break;

          case K_PERCEPCION:

            var id = val(Dialogs.cell(row, KI_CLIPERC_ID).getValue());
            if(id !== NO_ID) { m_itemsDeletedPercepciones = m_itemsDeletedPercepciones + id.toString() + ","; }
            break;
        }

        return P.resolvedPromise(true);
      };

      self.newRow = function(key, rows) {
        return P.resolvedPromise(true);
      };

      self.validateRow = function(key, row, rowIndex) {
        var p = null;

        try {

          switch (key) {
            case K_SUCURSALES:
              p = validateRowSucursales(row, rowIndex);
              break;

            case K_CONTACTOS:
              p = validateRowContacto(row, rowIndex);
              break;

            case K_CUENTA_GRUPO:
              p = validateRowCuentaGrupo(row, rowIndex);
              break;

            case K_EMPRESAS:
              p = P.resolvedPromise(true);
              break;

            case K_DEPARTAMENTOS:
              p = validateRowDpto(row, rowIndex);
              break;

            case K_PERCEPCION:
              p = validateRowPercepcion(row, rowIndex);
              break;

            case K_INFORMES:
              p = validateRowInformes(row, rowIndex);
              break;
          }
        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, ex, Cairo.Constants.VALIDATE_ROW_FUNCTION, C_MODULE, "");
        }

        return p || P.resolvedPromise(false);
      };

      self.columnAfterUpdate = function(key, lRow, lCol) {
        return P.resolvedPromise(true);
      };

      self.columnClick = function(key, lRow, lCol) {

      };

      self.gridDblClick = function(key, lRow, lCol) {
        return P.resolvedPromise(false);
      };

      self.isEmptyRow = function(key, row, rowIndex) {
        var isEmpty = true;

        try {

          switch (key) {
            case K_SUCURSALES:
              isEmpty = isEmptyRowSuc(row, rowIndex);
              break;

            case K_CONTACTOS:
              isEmpty = isEmptyRowCont(row, rowIndex);
              break;

            case K_CUENTA_GRUPO:
              isEmpty = isEmptyRowCuentaGrupo(row, rowIndex);
              break;

            case K_EMPRESAS:
              isEmpty = false;
              break;

            case K_DEPARTAMENTOS:
              isEmpty = isEmptyRowDpto(row, rowIndex);
              break;

            case K_PERCEPCION:
              isEmpty = isEmptyRowPercepcion(row, rowIndex);
              break;

            case K_INFORMES:
              isEmpty = isEmptyRowInforme(row, rowIndex);
              break;
          }
        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, Cairo.Constants.IS_EMPTY_ROW_FUNCTION, C_MODULE, "");
        }

        return P.resolvedPromise(isEmpty);
      };
