Cairo.module("TreeSelect", function(TreeSelect, Cairo, Backbone, Marionette, $, _) {
  "use strict";

  var createSelect = function() {

    var createSelectControl = function(selector, tableId, active, internalFilter, entity, label) {
      Cairo.Select.Controller.createSelectControl(selector, tableId, active, internalFilter);
      $($(selector).parent()).find("button").click(function () {
        var treeController = { dialogIsVisible: false };

        Cairo.dialogSelectTreeRegion.handler = treeController;

        treeController.closeDialog = function() {
          treeController.dialogIsVisible = false;
        };

        treeController.showBranch = function(branchId) {
          Cairo.log("Loading nodeId: " + branchId);
          Cairo.Tree.List.Controller.listBranch(branchId, Cairo.Tree.List.Controller.showItems, treeController)
        };

        listTree(tableId, entity, label, treeController);
        return false;
      });
    };

    var listTree = function(tableId, entity, label, treeController) {

      /*
          this function will be called by the tab manager every time the
          view must be created. when the tab is not visible the tab manager
          will not call this function but only make the tab visible
      */
      var showTreeDialog = function() {

        Cairo.dialogSelectTreeRegion.dialogSettings = {
          dialogClass: 'tree-select-dialog',
          title: 'Select a Folder or One ' + entity,
          width: '1000px'
        };

        // ListController properties and methods
        //
        treeController.entityInfo = new Backbone.Model({
          entitiesTitle: entity,
          entityName: entity.toLowerCase(),
          entitiesName: entity,
          hiddenCols: [Cairo.Language.UPDATED_BY_TEXT, Cairo.Language.ACTIVE_TEXT],
          showDeleteButton: false,
          showFilter: false,
          showButtons: false
        });

        // progress message
        //
        Cairo.LoadingMessage.show(entity, label);

        // create the dialog
        //
        Cairo.Tree.List.Controller.list(
          tableId,
          new Cairo.Tree.List.TreeLayout({ model: treeController.entityInfo }),
          Cairo.dialogSelectTreeRegion,
          treeController);

      };

      if(!treeController.dialogIsVisible) {
        treeController.dialogIsVisible = true;
        showTreeDialog();
      }

    }

    return { createSelectControl: createSelectControl	};
  };

  TreeSelect.Controller = createSelect();
});