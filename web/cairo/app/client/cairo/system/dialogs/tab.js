(function() {
  "use strict";

  /*
      this module define a tab and a collection of tabs ...
  */

  ///////////////
  // Entities
  ///////////////

  Cairo.module("Dialogs", function(Dialogs, Cairo, Backbone, Marionette, $, _) {

    Dialogs.createTab = function() {

      var self = {
        key: 0,
        name: '',
        index: 0,
        ctrlIndex: 0,
        fatherTab: "",
        left: 0,
        top: 0
      };

      var that = {};

      that.getName = function() {
        return self.name;
      };
      that.setName = function(name) {
        self.name = name;
        return that;
      };

      that.getIndex = function() {
        return self.index;
      };
      that.setIndex = function(index) {
        self.index = index;
        return that;
      };

      that.getCtrlIndex = function() {
        return self.ctrlIndex;
      };
      that.setCtrlIndex = function(index) {
        self.ctrlIndex = index;
        return that;
      };

      that.getFatherTab = function() {
        return self.fatherTab;
      };
      that.setFatherTab = function(father) {
        self.fatherTab = father;
        return that;
      };

      that.setLeft = function(left) {
        self.left = left;
      };
      that.getLeft = function() {
        return self.left;
        return that;
      };

      that.getTop = function() {
        return self.top;
      };
      that.setTop = function(top) {
        self.top = top;
        return that;
      };

      return that;
    };

  });

}());