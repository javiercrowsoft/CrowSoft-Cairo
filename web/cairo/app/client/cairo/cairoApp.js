var Cairo = new Marionette.Application();

Cairo.addRegions({
  headerRegion: "#header-region",
  mainRegion: "#main-region",
  dialogRegion: Marionette.Region.Dialog.extend({
    el: "#dialog-region"
  })
});

Cairo.navigate = function(route,  options){
  options || (options = {});
  Backbone.history.navigate(route, options);
};

Cairo.getCurrentRoute = function(){
  return Backbone.history.fragment
};

Cairo.on("initialize:after", function(){
  if(Backbone.history){
    Backbone.history.start();

    if(this.getCurrentRoute() === ""){
      Cairo.trigger("desktop:show");
    }
  }
});