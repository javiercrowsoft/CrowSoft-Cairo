(function() {
  "use strict";

  // TODO: implement

  Cairo.module("StockConfig.Edit", function(Edit, Cairo, Backbone, Marionette, $, _) {

    var createObject = function() {

      var self = {};

      //
      // property getters
      //

      self.getStockXFisico = function() {

      };

      self.getNoControlaStock = function() {

      };

      self.getControlStock = function() {

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

      // TODO: implement
      self.load =  function(id) {
        return true;
      };

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