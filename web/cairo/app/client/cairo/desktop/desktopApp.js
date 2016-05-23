(function() {
  "use strict";

  Cairo.module("Desktop", function(Desktop, Cairo, Backbone, Marionette, $, _) {});

  Cairo.module("Desktop.Region", function(Region, Cairo, Backbone, Marionette, $, _) {
    Region.Controller = {
      showDesktop: function() {

        var view = new Region.View();
        /*
            this function will be called by the tab manager every time the
            view must be created. when the tab is not visible the tab manager
            will not call this function but only make the tab visible
        */
        var createDialog = function(tabId) {

          // create the desktop region
          //
          Cairo.addRegions({ desktopRegion: tabId });

        };
        Cairo.mainTab.showTab("Desktop", "desktopRegion", "#desktop", createDialog);
        Cairo.desktopRegion.show(view);
      }
    };
  });

  Cairo.module("Desktop.Region", function(Region, Cairo, Backbone, Marionette, $, _) {
    Region.View = Marionette.ItemView.extend({
      template: "#desktop-template"
    });
  });

}());