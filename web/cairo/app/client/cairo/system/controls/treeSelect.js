Cairo.module("TreeSelect", function(TreeSelect, Cairo, Backbone, Marionette, $, _) {
  "use strict";

  var createSelect = function() {

    var createSelectControl = function(selector, tableId, active, internalFilter, entity, label) {
      var selectCtrl = Cairo.Select.Controller.createSelectControl(selector, tableId, active, internalFilter);
      $($(selector).parent()).find("button").click(function () {
        var treeController = { dialogIsVisible: false };

        Cairo.dialogSelectTreeRegion.handler = treeController;

        treeController.closeDialog = function() {
          //
          // when the dialog is closed we have to update
          // the input box of the select control
          //
          var data = treeController.Tree.lastSelected;
          if(data) {
            if(data.type === 'node') {
              data.id = 'N' + data.ids;
            }
            else if(data.type === 'items') {
              data.id = data.ids;
            }
          }
          data = data || {};
          //
          // only if the dialog was closed using the select button or double click
          //
          if(data.isValid) {
            selectCtrl.setData(data.id, data.text);
            treeController.dialogIsVisible = false;
          }
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
          hiddenCols: [Cairo.Language.Constants.UPDATED_BY_TEXT, Cairo.Language.Constants.ACTIVE_TEXT],
          showDeleteButton: false,
          showFilter: false,
          showTableButtons: false,
          showSelectButton: true
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

    };

    return { createSelectControl: createSelectControl	};
  };

  TreeSelect.Controller = createSelect();
});