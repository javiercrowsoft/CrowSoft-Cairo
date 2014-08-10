Cairo.module("TreeSelect", function(TreeSelect, Cairo, Backbone, Marionette, $, _) {

  var createSelect = function() {

    var self = this;
    var dialogIsVisible = false;

    Cairo.dialogSelectTreeRegion.handler = self;

    self.closeDialog = function() {
      self.dialogIsVisible = false;
    };

    var createSelectControl = function(selector, tableId, active, internalFilter, entity, label) {
      Cairo.Select.Controller.createSelectControl(selector, tableId, active, internalFilter);
      $($(selector).parent).find("button").click(function () {
              listTree(tableId, entity, label);
              return false;
      });
    };

    var listTree = function(tableId, entity, label) {

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
        self.entityInfo = new Backbone.Model({
          entitiesTitle: entity,
          entityName: entity.toLowerCase(),
          entitiesName: entity,
          hiddenCols: [Cairo.Language.UPDATED_BY_TEXT, Cairo.Language.ACTIVE_TEXT],
          showDeleteButton: false
        });

        self.showBranch = function(branchId) {
          Cairo.log("Loading nodeId: " + branchId);
          Cairo.Tree.List.Controller.listBranch(branchId, Cairo.Tree.List.Controller.showItems, self)
        };

        // progress message
        //
        Cairo.LoadingMessage.show(entity, label);

        // create the dialog
        //
        Cairo.Tree.List.Controller.list(
          tableId,
          new Cairo.Tree.List.TreeLayout({ model: self.entityInfo }),
          Cairo.dialogSelectTreeRegion,
          self);

      };

      if(!self.dialogIsVisible) {
        self.dialogIsVisible = true;
        showTreeDialog();
      }

    }

    return { createSelectControl: createSelectControl	};
  };

  TreeSelect.Controller = createSelect();
});