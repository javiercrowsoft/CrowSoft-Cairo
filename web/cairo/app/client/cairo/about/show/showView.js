Cairo.module("About.Show", function(Show, Cairo, Backbone, Marionette, $, _){
  Show.Message = Marionette.ItemView.extend({
    template: "#about-message"
  });
});
