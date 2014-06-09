var Cairo = new Marionette.Application();

Cairo.addRegions({
  headerRegion: "#header-region",
  mainRegion: "#main-region",
  loadingRegion: "#loading-region",
  dialogRegion: Marionette.Region.Dialog.extend({
    el: "#dialog-region"
  })
});

Cairo.navigate = function(route,  options) {
  options || (options = {});
  Backbone.history.navigate(route, options);
};

Cairo.getCurrentRoute = function() {
  return Backbone.history.fragment
};

Cairo.on("initialize:after", function() {
  if(Backbone.history) {
    Backbone.history.start();

    if(this.getCurrentRoute() === "") {
      Cairo.trigger("desktop:show");
    }
  }
});

Cairo.Tables = {
    USUARIO: 3,
    CUENTA: 17
};

Cairo.sleep = function(millis, callback) {
    setTimeout(function()
            { callback(); }
    , millis);
};

Cairo.logTreeEvent = function(event, data, msg) {
  msg = msg ? ": " + msg : "";
  if(window.console && window.console.log) {
    window.console.log("Event('" + event.type + "', node=" + data.node + ")" + msg);
  }
};

Cairo.log = function(msg) {
  msg = msg ? ": " + msg : "";
  if(window.console && window.console.log) {
    window.console.log(msg);
  }
};
