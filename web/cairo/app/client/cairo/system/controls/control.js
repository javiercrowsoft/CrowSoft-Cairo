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

        tabIndex: 0, // this for tab key navigation

        // a dialog can contain many tab groups
        // a tab group contains one or more tabs
        // controls are always contained in a tab
        // the tabGroupIndex starts in zero in every tab-group
        //
        tabGroup: 0, // this is the tab group (a number) which contains this control
        tabGroupIndex: 0, // this is the index of this control in the dialog's tab collection

        visible: true,
        enabled: true,

        element: null,
        selectOnFocus: false,

        cssClass: ""
      };

      var applyVisible = function() {
        if(self.element) {
          if(self.visible) {
            self.element.show();
          }
          else {
            self.element.hide();
          }
        }
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
        element.data('_ID_', self._ID_);
        if(self.selectOnFocus) {
          that.setSelectOnFocus(true);
        }
        element.keyup(that.onKeyUp);
        applyVisible();
        that.setEnabled(self.enabled);
        if(self.cssClass !== "") {
          element.addClass(self.cssClass);
        };
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
            self.element.focus(that.onFocus);
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

      that.setTabIndex = function(tabIndex) {
        self.tabIndex = tabIndex;
      };
      that.getTabIndex = function() {
        return self.tabIndex;
      };

      that.setTabGroup = function(tabGroup) {
        self.tabGroup = tabGroup;
      };
      that.getTabGroup = function() {
        return self.tabGroup;
      };

      that.setTabGroupIndex = function(index) {
        self.tabGroupIndex = index;
      };
      that.getTabGroupIndex = function() {
        return self.tabGroupIndex;
      };

      that.setBackStyle = function(style) { /* TODO = implement this. */ };

      that.getTextAlign = function() { /* TODO = implement this. */ };
      that.setTextAlign = function(align) { /* TODO = implement this. */ };

      that.getEnabled = function() {
        return self.enabled;
      };
      that.setEnabled = function(enabled) {
        self.enabled = enabled;
        if(self.element) {
          self.element.attr('disabled', !enabled);
        }
      };

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

      that.getCSSClass = function() {
        return self.cssClass;
      };
      that.setCSSClass = function(cssClass) {
        self.cssClass = cssClass;
      };

      that.focus = function() {
        self.element.focus();
      };

      that.select = function() {
        self.element.select();
      };

      that.flash = function() {
        if(self.element) {
          self.element.delay(100).fadeOut().fadeIn('slow');
        }
      };

      that.toString = function() {
        return that.getObjectType() + " - " + that.getName() + " - " + that.htmlTag;
      };

      return that;
    };

  });

}());