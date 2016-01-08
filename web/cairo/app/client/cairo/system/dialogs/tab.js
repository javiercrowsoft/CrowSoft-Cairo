(function() {
  "use strict";

  /*
      this module define a tab and a collection of tabs ...
  */

  ///////////////
  // Entities
  ///////////////

  Cairo.module("Dialogs", function(Dialogs, Cairo, Backbone, Marionette, $, _) {

    Dialogs.Layout = {
      horizontal: 0,
      verticalOneColumn: 1,
      verticalTwoColumn: 2
    };

    Dialogs.createTab = function() {

      /*
      * Tabs allow inner tabs (only two levels)
      *
      * the first level is the outher or main tab
      * the sencond level is the inner tab
      *
      * an inner tab has a fatherTab (an outher tab)
      * the fatherTab is the index of the outher tab
      *
      * the index of an inner tab is set with a negative value
      * it is used to associate properties to the tab (using the tabIndex field of a property)
      *
      * the ctrlIndex is the real index of an inner tab
      *
      * */

      var self = {
        keyTab: "",
        name: '',
        index: 0,
        ctrlIndex: 0,
        fatherTab: "",
        layout: Dialogs.Layout.horizontal,

        /* internal */
        _ctl: null
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

      that.getControl = function() {
        return self._ctl;
      };
      that.setControl = function(control) {
        self._ctl = control;
        self._controlLoaded = false;
        return that;
      };

      that.getFatherTab = function() {
        return self.fatherTab;
      };
      that.setFatherTab = function(father) {
        self.fatherTab = father;
        return that;
      };

      that.getKeyTab = function() {
        return self.keyTab;
      };
      that.setKeyTab = function(keyTab) {
        self.keyTab = keyTab;
        return that;
      };

      that.getLayout = function() {
        return self.layout;
      };
      that.setLayout = function(layout) {
        self.layout = layout;
        return that;
      };

      return that;
    };

  });

}());