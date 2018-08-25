(function() {
  "use strict";

  // TODO: implement

  Cairo.module("StockConfig.Edit", function(Edit, Cairo, Backbone, Marionette, $, _) {

    var createObject = function() {

      var self = {};

      var DB = Cairo.Database;
      var C = Cairo.General.Constants;
      var NO_ID = Cairo.Constants.NO_ID;

      var C_MODULE = "cStockConfigEdit";

      var m_apiPath = DB.getAPIVersion();

      var getValue = DB.getValue;
      var val = Cairo.Util.val;

      var C_GRUPOGENERAL = "Stock-General";
      var C_TIPOCONTROLSTOCK = "Tipo Control Stock";
      var C_NOCONTROLASTOCK = "No Controla Stock";
      var C_STOCKLOGICO = "Stock Por Deposito Logico";
      var C_STOCKFISICO = "Stock Por Deposito Fisico";
      var C_STOCKNEGATIVO = "Stock Negativo";
      var C_SPSTOCK = "SP Stock";
      var C_STOCKPEDIDOVTA = "Stock en Pedido de Venta";

      var C_STOCKCODBARRASUBIR = "Código de barra para subir";
      var C_STOCKCODBARRABAJAR = "Código de barra para bajar";
      var C_STOCKCODBARRATIPO = "Tipo de prefijo del código de barra";
      var C_STOCKCODBARRALONGITUD = "Longitud del prefijo del código de barra";
      var C_STOCKCODBARRACARACTER = "Caracter separador del código de barra";

      var m_stockXLogico = false;
      var m_noControlaStock = false;
      var m_stockXFisico = false;
      var m_permiteStockNegativo = false;
      var m_sPStock = "";
      var m_stockPedidoVta = false;
      var m_controlStock = Cairo.Stocks.Constants.ControlStock.StockLogico;

      var m_stockCodigoBarraSubir = "**SUBIRRENGLON";
      var m_stockCodigoBarraBajar = "**BAJARRENGLON";
      var m_stockCodigoBarraTipo = C.StockCodigoBarraTipo.fijo;
      var m_stockCodigoBarraLongitud = 5;
      var m_stockCodigoBarraCaracter = "";

      //
      // property getters
      //

      self.getStockXFisico = function() {
        return m_stockXFisico;
      };

      self.getNoControlaStock = function() {
        return m_noControlaStock;
      };

      self.getControlStock = function() {
        return m_controlStock;
      };

      //
      // editor code
      //

      self.setDialog = function(value) {
        // TODO: implement
      };

      self.edit = function(id, inModalWindow) {
        // TODO: implement
      };

      // TODO: implement
      self.getStockPedidoVta = function() {
        return false;
      };

      var load = function() {

        return DB.getData("load[" + m_apiPath + "general/stockconfig]", NO_ID).then(
          function(response) {

            if(response.success === true) {

              var settings = response.data.get('settings')

              for(var _i = 0; _i < settings.length; _i += 1) {

                switch (getValue(settings[_i], C.CONFIG_KEY)) {

                  case C_TIPOCONTROLSTOCK:

                    m_controlStock = val(getValue(settings[_i], C.CONFIG_VALUE));

                    switch (m_controlStock) {
                      case Cairo.Stocks.Constants.ControlStock.NoControlaStock:
                        m_noControlaStock = true;
                        break;

                      case Cairo.Stocks.Constants.ControlStock.StockFisico:
                        m_stockXFisico = true;
                        break;

                      case Cairo.Stocks.Constants.ControlStock.StockLogico:
                        m_stockXLogico = true;
                        break;

                      case Cairo.Stocks.Constants.ControlStock.StockNegativo:
                        m_permiteStockNegativo = true;
                        break;
                    }
                    break;

                  case C_SPSTOCK:
                    m_sPStock = getValue(settings[_i], C.CONFIG_VALUE);
                    break;

                  case C_STOCKPEDIDOVTA:
                    m_stockPedidoVta = val(getValue(settings[_i], C.CONFIG_VALUE));
                    break;

                  case C_STOCKCODBARRASUBIR:
                    m_stockCodigoBarraSubir = getValue(settings[_i], C.CONFIG_VALUE);
                    break;

                  case C_STOCKCODBARRABAJAR:
                    m_stockCodigoBarraBajar = getValue(settings[_i], C.CONFIG_VALUE);
                    break;

                  case C_STOCKCODBARRATIPO:
                    m_stockCodigoBarraTipo = val(getValue(settings[_i], C.CONFIG_VALUE));
                    break;

                  case C_STOCKCODBARRALONGITUD:
                    m_stockCodigoBarraLongitud = val(getValue(settings[_i], C.CONFIG_VALUE));
                    break;

                  case C_STOCKCODBARRACARACTER:
                    m_stockCodigoBarraCaracter = getValue(settings[_i], C.CONFIG_VALUE);
                    break;
                }
              }
              return true;
            }
            else {
              return false;
            }
          }
        );
      };

      self.load =  load;

      return self;
    };

    var showEditor = function() {
      var editor = Cairo.StockConfig.Edit.Controller.getEditor();
      var dialog = Cairo.Dialogs.Views.Controller.newDialog();

      editor.setDialog(dialog);
      editor.edit();
    };

    Edit.Controller = { getEditor: createObject, edit: showEditor };

  });

}());