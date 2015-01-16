(function() {
  "use strict";

  Cairo.module("Controls", function(Controls, Cairo, Backbone, Marionette, $, _) {

    var nextId = 0;

    var getNextId = function() {
      nextId += 1;
      return nextId;
    };

    Controls.createControl = function() {
      var self = {
        _ID_: getNextId(),

        name: "",

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
  
        element: null,
        selectOnFocus: false
      };

      var applyVisible = function() {
        if(self.element) {
          if(self.visible) {
            self.element.show();
          }
          else {
            self.element.hide();
          }
          // TODO: remove after testing
          // try {console.log(that.getName() + " " + that.getObjectType() + ' visible:' + self.visible.toString());} catch(ignore) {}
        }
        // TODO: remove after testing
        /*
        else {
          console.log('element is not present');
        }
        */
      };

      var that = {};

      that._ID_ = function() {
        return self._ID_;
      };

      that.getName = function() {
        return self.name;
      };
      that.setName = function(name) {
        self.name = name;
      };

      that.setElement = function(element) {
        self.element = element;
        $(element).data('_ID_', self._ID_);
        if(self.selectOnFocus) {
          that.setSelectOnFocus(true);
        }
        $(self.element).keyup(that.onKeyUp);
        applyVisible();
      };
      that.getElement = function() {
        return self.element;
      };

      that.onKeyUp = function(e) {
        if(e.which === 13) {
          $.tabNext();
        }
      };

      that.onFocus = function(e) {
        try {
          if(self.element !== null) {
            self.element.select();
          }
        }
        catch(ingore) {}
      };

      that.setSelectOnFocus = function(select) {
        self.selectOnFocus = select;
        if(self.element !== null) {
          if(select) {
            $(self.element).focus(that.onFocus);
          }
        }
      };

      that.setVisible = function(visible) {
        self.visible = visible;
        applyVisible();
      };
      that.getVisible = function() {
        return self.visible;
      };

      that.getIndex = function() {
        return self.index;
      };
      that.setIndex = function(index) {
        self.index = index;
      };

      that.getLeft = function() {
        return self.left;
      };
      that.setLeft = function(left) {
        self.left = left;
      };

      that.getTop = function() {
        return self.top;
      };
      that.setTop = function(top) {
        self.top = top;
      };

      that.getHeight = function() {
        return self.height;
      };
      that.setHeight = function(height) {
        self.height = height;
      };

      that.getWidth = function() {
        return self.width;
      };
      that.setWidth = function(width) {
        self.width = width;
      };

      that.selStart = function(start) { /* TODO = implement this. */ };
      that.bringToFront = function() { /* TODO = implement this. */ };

      that.setForeColor = function(color) { /* TODO = implement this. */ };
      that.setBorderColor = function(color) { /* TODO = implement this. */ };

      that.setBackColor = function(color) {
        self.backColor = color;
      };
      that.getBackColor = function() {
        return self.backColor;
      };

      that.getTag = function() {
        return self.tag;
      };
      that.setTag = function(tag) {
        self.tag = tag.toString();
      };

      that.setTabIndex = function(tabIndex) { /* TODO = implement this. */ };
      that.setTabIndex2 = function(tabIndex2) { /* TODO = implement this. */ };
      that.setBackStyle = function(style) { /* TODO = implement this. */ };

      that.getTextAlign = function() { /* TODO = implement this. */ };
      that.setTextAlign = function(align) { /* TODO = implement this. */ };

      that.getEnabled = function() { /* TODO = implement this. */ };
      that.setEnabled = function() { /* TODO = implement this. */ };
      that.getEditEnabled = function() { /* TODO = implement this. */ };
      that.setEditEnabled = function(enabled) { /* TODO = implement this. */ };

      that.getFontName = function() {
        return self.fontName;
      };
      that.setFontName = function(name) {
        self.fontName = name;
      };
      that.getFontSize = function() {
        return self.fontSize;
      };
      that.setFontSize = function(size) {
        self.fontSize = size;
      };
      that.getFontUnderline = function() {
        return self.fontUnderline;
      };
      that.setFontUnderline = function(underline) {
        self.fontUnderline = underline;
      };
      that.getFontBold = function() {
        return self.fontBold;
      };
      that.setFontBold = function(bold) {
        self.fontBold = bold;
      };
      that.getFontItalic = function() {
        return self.fontItalic;
      };
      that.setFontItalic = function(italic) {
        self.fontItalic = italic;
      };

      that.focus = function() {
        $(self.element).focus();
      };

      that.select = function() {
        $(self.element).select();
      };

      that.flash = function() {
        if(self.element) {
          self.element.delay(100).fadeOut().fadeIn('slow');
        }
      };

      return that;
    };

  });

}());