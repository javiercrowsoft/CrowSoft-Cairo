Cairo.module("About.Show", function(Show, Cairo, Backbone, Marionette, $, _) {
  "use strict";

  Show.Message = Marionette.ItemView.extend({
    template: "#about-message"
  });
});
