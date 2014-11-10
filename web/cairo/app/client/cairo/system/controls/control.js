(function() {
  "use strict";

  Cairo.module("Controls", function(Controls, Cairo, Backbone, Marionette, $, _) {

    Controls.Control = Backbone.Model.extend({
      urlRoot: "",

      defaults: {},

      tag: "",

      fontName: '',
      fontSize: 0,
      fontBold: false,
      fontUnderline: false,
      fontItalic: false,
      foreColor: -1,
      backColor: -1,

      index: -1,
      text: "",

      top: 0,
      left: 0,
      width: 0,
      height: 0,

      setVisible: function(visible) { /* TODO: implement this. */ },

      getIndex: function() {
        return this.index;
      },
      setIndex: function(index) {
        this.index = index;
      },

      getLeft: function() {
        return this.left;
      },
      setLeft: function(left) {
        this.left = left;
      },

      getTop: function() {
        return this.top;
      },
      setTop: function(top) {
        this.top = top;
      },

      getHeight: function() {
        return this.height;
      },
      setHeight: function(height) {
        this.height = height;
      },

      getWidth: function() {
        return this.width;
      },
      setWidth: function(width) {
        this.width = width;
      },

      selStart: function(start) { /* TODO: implement this. */ },
      bringToFront: function() { /* TODO: implement this. */ },

      setForeColor: function(color) { /* TODO: implement this. */ },
      setBorderColor: function(color) { /* TODO: implement this. */ },

      setItemData: function(index, data) { /* TODO: implement this. */ },
      getNewIndex: function() { /* TODO: implement this. */ },

      getTag: function() {
        return this.tag;
      },
      setTag: function(tag) {
        this.tag = tag.toString();
      },

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