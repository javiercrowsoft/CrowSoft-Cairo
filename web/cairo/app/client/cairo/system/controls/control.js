(function() {
  "use strict";

  /*
   this module manages a view ...
   */

  ///////////////
  // Entities
  ///////////////

  Cairo.module("Entities.Controls", function(Controls, Cairo, Backbone, Marionette, $, _) {

    Controls.Control = Backbone.Model.extend({
      urlRoot: "",

      defaults: {
        tag: null
      },

      setVisible: function(visible) { /* TODO: implement this. */ },
      setIsCancel: function(isCancel) { /* TODO: implement this. */ },
      setText: function(text) { /* TODO: implement this. */ },

      getLeft: function() { /* TODO: implement this. */ },
      setLeft: function(left) { /* TODO: implement this. */ },
      getTop: function() { /* TODO: implement this. */ },
      setTop: function(top) { /* TODO: implement this. */ },
      getFontSize: function() { /* TODO: implement this. */ },
      setFontSize: function(size) { /* TODO: implement this. */ },
      getFontBold: function() { /* TODO: implement this. */ },
      setFontBold: function(bold) { /* TODO: implement this. */ },
      getHeight: function() { /* TODO: implement this. */ },
      setHeight: function(height) { /* TODO: implement this. */ },
      getWidth: function() { /* TODO: implement this. */ },
      setWidth: function(text) { /* TODO: implement this. */ },

      selStart: function(start) { /* TODO: implement this. */ },
      bringToFront: function() { /* TODO: implement this. */ },

      setForeColor: function(color) { /* TODO: implement this. */ },
      setBorderColor: function(color) { /* TODO: implement this. */ },

      setItemData: function(index, data) { /* TODO: implement this. */ },
      getNewIndex: function() { /* TODO: implement this. */ },

      getTag: function() { return this.tag; },
      setTag: function(tag) { this.tag = tag; },

      setTabIndex: function(tabIndex) { /* TODO: implement this. */ },
      setTabIndex2: function(tabIndex2) { /* TODO: implement this. */ },
      setBackStyle: function(style) { /* TODO: implement this. */ },

      getTextAlign: function() { /* TODO: implement this. */ },
      setTextAlign: function(align) { /* TODO: implement this. */ }

    });

  });

}());