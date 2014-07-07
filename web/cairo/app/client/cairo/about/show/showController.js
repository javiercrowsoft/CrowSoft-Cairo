Cairo.module("About.Show", function(Show, Cairo, Backbone, Marionette, $, _) {
  Show.Controller = {
    showAbout: function() {
      var view = new Show.Message();
      /*
          this function will be called by the tab manager every time the
          view must be created. when the tab is not visible the tab manager
          will not call this function but only make the tab visible
      */
      var createDialog = function(tabId) {

        // create the tree region
        //
        Cairo.addRegions({ aboutRegion: tabId });

      };
      Cairo.mainTab.showTab("About", "aboutRegion", "#about", createDialog);
      Cairo.aboutRegion.show(view);
    }
  };
});
