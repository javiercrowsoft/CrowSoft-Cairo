Cairo.module("Desktop", function(Desktop, Cairo, Backbone, Marionette, $, _) {});

Cairo.module("Desktop.Show", function(Show, Cairo, Backbone, Marionette, $, _) {
  Show.Controller = {
    showDesktop: function() {
      var view = new Show.Message();
      /*
          this function will be called by the tab manager every time the
          view must be created. when the tab is not visible the tab manager
          will not call this function but only make the tab visible
      */
      var createDialog = function(tabId) {

        // create the tree region
        //
        Cairo.addRegions({ desktopRegion: tabId });

      };
      Cairo.mainTab.showTab("Desktop", "desktopRegion", "#desktop", createDialog);
      Cairo.desktopRegion.show(view);
      Cairo.Select.Controller.createSelectControl("#desktop-select", Cairo.Tables.CODIGOS_POSTALES, true, "-");
      Cairo.Select.Controller.createSelectControl("#desktop-select2", Cairo.Tables.PRESTACION, true, "-");
    }
  };
});

Cairo.module("Desktop.Show", function(Show, Cairo, Backbone, Marionette, $, _) {
  Show.Message = Marionette.ItemView.extend({
    template: "#desktop-template"
  });
});
