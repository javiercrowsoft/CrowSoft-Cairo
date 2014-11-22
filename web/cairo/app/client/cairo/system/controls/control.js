(function() {
  "use strict";

  Cairo.module("Controls", function(Controls, Cairo, Backbone, Marionette, $, _) {

    Controls.createControl = function() {
      var self = {
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
  
        visible: true,
  
        element: null
      }

      var that = {
      
        setElement: function(element) {
          self.element = element;
        },
        getElement: function() {
          return self.element;
        },
  
        setVisible: function(visible) {
          self.visible = visible;
        },
  
        getIndex: function() {
          return self.index;
        },
        setIndex: function(index) {
          self.index = index;
        },
  
        getLeft: function() {
          return self.left;
        },
        setLeft: function(left) {
          self.left = left;
        },
  
        getTop: function() {
          return self.top;
        },
        setTop: function(top) {
          self.top = top;
        },
  
        getHeight: function() {
          return self.height;
        },
        setHeight: function(height) {
          self.height = height;
        },
  
        getWidth: function() {
          return self.width;
        },
        setWidth: function(width) {
          self.width = width;
        },
  
        selStart: function(start) { /* TODO: implement this. */ },
        bringToFront: function() { /* TODO: implement this. */ },
  
        setForeColor: function(color) { /* TODO: implement this. */ },
        setBorderColor: function(color) { /* TODO: implement this. */ },
  
        setItemData: function(index, data) { /* TODO: implement this. */ },
        getNewIndex: function() { /* TODO: implement this. */ },
  
        getTag: function() {
          return self.tag;
        },
        setTag: function(tag) {
          self.tag = tag.toString();
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
        },

        flash: function() {
          if(self.element) {
            self.element.delay(100).fadeOut().fadeIn('slow');
          }
        }
        
      };

      return that;

    };

  });

}());