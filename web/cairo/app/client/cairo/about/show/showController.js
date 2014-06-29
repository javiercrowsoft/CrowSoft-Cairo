Cairo.module("About.Show", function(Show, Cairo, Backbone, Marionette, $, _) {
  Show.Controller = {
    showAbout: function() {
      var view = new Show.Message();
      Cairo.mainTab.showTab("About", "aboutShow", "#about");
      Cairo.aboutShow.show(view);
    }
  };
});
