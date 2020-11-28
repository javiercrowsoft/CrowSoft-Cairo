(function() {
  "use strict";

  Cairo.module("Controls", function(Controls, Cairo, Backbone, Marionette, $, _) {

    var C_MODULE = "Controls.menu";

    var createMenu = function() {
      var self = {
        text: "",
        callback: null,
        items: []
      };

      var that = Controls.createControl();
      
      that.htmlTag = "<div><div/>";
      
      that.setText = function(text) {
        Cairo.validateAssignmentIsNotNull(text, C_MODULE, "createMenu.setText");
        self.text = text;
      };
      
      that.getText = function() {
        return self.text;
      };

      var onClick = function(id) {
        if(self.callback !== null) {
          self.callback(id);
        }
        var menuDiv = $('.context-menu.context-menu-theme-osx');
        menuDiv.hide();
      };

      var createMenuItem = function(menu) {
        var item = {};
        item[menu.text] = {
            onclick: function() { onClick(menu.id)},
          };
        return item;
      };

      var createMenuItems = function() {
        return self.items.map(createMenuItem);
      };

      that.showPopupMenu = function() {
        var element = that.getElement();
        element.contextMenu(createMenuItems(), {theme:'osx'});
        simulateRightClick(element[0]);
      };

      var simulateRightClick = function(element) {
        var e = element.ownerDocument.createEvent('MouseEvents');
        var o = offset(element);
        e.initMouseEvent('contextmenu', true, true,
          element.ownerDocument.defaultView, 1, o.left, o.top, o.left, o.top+35, false,
          false, false, false,2, null);
        element.dispatchEvent(e);
      };

      var offset = function offset(el) {
        var rect = el.getBoundingClientRect(),
          scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
          scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        return { top: rect.top + scrollTop, left: rect.left + scrollLeft }
      };

      that.clear = function() { self.items = []; };
      that.setListener = function(callback) { self.callback = callback; };
      that.add = function(text, id) { self.items.push({text: text, id: id});  };

      return that;
    };

    Controls.createMenu = function() {

      var self = {
        objectType: "cairo.controls.menu"
      };

      var that = createMenu();

      that.getObjectType = function() {
        return self.objectType;
      };

      return that;
    };

  });

}());