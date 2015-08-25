(function() {
  "use strict";

  Cairo.module("Proveedor.List", function(List, Cairo, Backbone, Marionette, $, _) {

    var NO_ID = Cairo.Constants.NO_ID;

    List.Controller = {
      list: function() {

        var self = this;

        /*
         this function will be called by the tab manager every time the
         view must be created. when the tab is not visible the tab manager
         will not call this function but only make the tab visible
         */
        var createTreeDialog = function(tabId) {

          // ListController properties and methods
          //
          self.entityInfo = new Backbone.Model({
            entitiesTitle: "Proveedores",
            entityName: "proveedor",
            entitiesName: "proveedores"
          });

          self.showBranch = function(branchId) {
            Cairo.log("Loading nodeId: " + branchId);
            Cairo.Tree.List.Controller.listBranch(branchId, Cairo.Tree.List.Controller.showItems, self);
          };

          // progress message
          //
          Cairo.LoadingMessage.show("Proveedores", "Loading Proveedores from CrowSoft Cairo server.");

          // create the tree region
          //
          Cairo.addRegions({ proveedorTreeRegion: tabId });

          // create the dialog
          //
          Cairo.Tree.List.Controller.list(
            Cairo.Tables.PROVEEDOR,
            new Cairo.Tree.List.TreeLayout({ model: self.entityInfo }),
            Cairo.proveedorTreeRegion,
            self);

        };

        // create the tab
        //
        Cairo.mainTab.showTab("Proveedores", "proveedorTreeRegion", "#general/proveedores", createTreeDialog);

      }
    };
  });

  /*

   Proveedor
   Proveedores
   proveedor
   proveedores
   PROVEEDOR

   */

}());  