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
  
        selStart: function(start) { /* TODO: implement self. */ },
        bringToFront: function() { /* TODO: implement self. */ },
  
        setForeColor: function(color) { /* TODO: implement self. */ },
        setBorderColor: function(color) { /* TODO: implement self. */ },
  
        setItemData: function(index, data) { /* TODO: implement self. */ },
        getNewIndex: function() { /* TODO: implement self. */ },
  
        getTag: function() {
          return self.tag;
        },
        setTag: function(tag) {
          self.tag = tag.toString();
        },
  
        setTabIndex: function(tabIndex) { /* TODO: implement self. */ },
        setTabIndex2: function(tabIndex2) { /* TODO: implement self. */ },
        setBackStyle: function(style) { /* TODO: implement self. */ },
  
        getTextAlign: function() { /* TODO: implement self. */ },
        setTextAlign: function(align) { /* TODO: implement self. */ },
  
        getEnabled: function() { /* TODO: implement self. */ },
        setEnabled: function() { /* TODO: implement self. */ },
        getEditEnabled: function() { /* TODO: implement self. */ },
        setEditEnabled: function(enabled) { /* TODO: implement self. */ },
  
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