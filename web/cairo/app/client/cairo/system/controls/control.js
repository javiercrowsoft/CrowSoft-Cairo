(function() {
  "use strict";

  /*
   this module manages a view ...
   */

  ///////////////
  // Entities
  ///////////////

  Cairo.module("Controls", function(Controls, Cairo, Backbone, Marionette, $, _) {

    Controls.Control = Backbone.Model.extend({
      urlRoot: "",

      defaults: {
        tag: null,

        fontName: '',
        fontSize: 0,
        fontBold: false,
        fontUnderline: false,
        fontItalic: false,
        foreColor: -1,
        backColor: -1
      },

      index: -1,
      text: "",

      setVisible: function(visible) { /* TODO: implement this. */ },
      setIsCancel: function(isCancel) { /* TODO: implement this. */ },

      getIndex: function() {
        return this.index;
      },
      setIndex: function(index) {
        this.index = index;
      },

      getLeft: function() { /* TODO: implement this. */ },
      setLeft: function(left) { /* TODO: implement this. */ },
      getTop: function() { /* TODO: implement this. */ },
      setTop: function(top) { /* TODO: implement this. */ },
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
      setTextAlign: function(align) { /* TODO: implement this. */ },

      getEnabled: function() { /* TODO: implement this. */ },
      setEnabled: function() { /* TODO: implement this. */ },
      getEditEnabled: function() { /* TODO: implement this. */ },
      setEditEnabled: function(enabled) { /* TODO: implement this. */ },

      getFontName: function() {
        return self.fontName;
      },
      setFontName: function(name) {
        self.fontName = name;
      },
      getFontSize: function() {
        return self.fontSize;
      },
      setFontSize: function(size) {
        self.fontSize = size;
      },
      getFontUnderline: function() {
        return self.fontUnderline;
      },
      setFontUnderline: function(underline) {
        self.fontUnderline = underline;
      },
      getFontBold: function() {
        return self.fontBold;
      },
      setFontBold: function(bold) {
        self.fontBold = bold;
      },
      getFontItalic: function() {
        return self.fontItalic;
      },
      setFontItalic: function(italic) {
        self.fontItalic = italic;
      }

    });

  });

}());