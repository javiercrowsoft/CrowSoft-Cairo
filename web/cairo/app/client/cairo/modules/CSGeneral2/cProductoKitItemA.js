(function() {
  "use strict";

  Cairo.module("ProductoKitItemA.Edit", function(Edit, Cairo, Backbone, Marionette, $, _) {

    var createObject = function() {

      var self = {};

      var Dialogs = Cairo.Dialogs;

      var m_id = 0;
      var m_pr_id = 0;
      var m_name = "";
      var m_active;

      self.getId = function() {
        return m_id;
      };

      self.setId = function(rhs) {
        m_id = rhs;
      };

      self.getPr_id = function() {
        return m_pr_id;
      };

      self.setPr_id = function(rhs) {
        m_pr_id = rhs;
      };

      self.getName = function() {
        return m_name;
      };

      self.setNombre = function(rhs) {
        m_name = rhs;
      };

      self.getActivo = function() {
        return m_active;
      };

      self.setActivo = function(rhs) {
        m_active = rhs;
      };


      return self;
    };

    Edit.Controller = { getEditor: createObject };

  });

  Cairo.module("ProductoKitItemA.List", function(List, Cairo, Backbone, Marionette, $, _) {
    List.Controller = {
      list: function() {

        var self = this;

        /*
         this function will be called by the tab manager every time the
         view must be created. when the tab is not visible the tab manager
         will not call this function but only make the tab visible
         */
        var createTreeDialog = function(tabId) {

          var editors = Cairo.Editors.productokititemaEditors || Cairo.Collections.createCollection(null);
          Cairo.Editors.productokititemaEditors = editors;

          // ListController properties and methods
          //
          self.entityInfo = new Backbone.Model({
            entitiesTitle: "ProductoKitItemAs",
            entityName: "productokititema",
            entitiesName: "productokititemas"
          });

          self.showBranch = function(branchId) {
            Cairo.log("Loading nodeId: " + branchId);
            Cairo.Tree.List.Controller.listBranch(branchId, Cairo.Tree.List.Controller.showItems, self);
          };

          self.addLeave = function(id, branchId) {
            try {
              Cairo.Tree.List.Controller.addLeave(branchId, id, self);
            }
            catch(ignore) {
              Cairo.log("Error when adding this item to the branch\n\n" + ignore.message);
            }
          };

          self.refreshBranch = function(id, branchId) {
            try {
              Cairo.Tree.List.Controller.refreshBranchIfActive(branchId, id, self);
            }
            catch(ignore) {
              Cairo.log("Error when refreshing a branch\n\n" + ignore.message);
            }
          };

          var getIndexFromEditor = function(editor) {
            var count = editors.count();
            for(var i = 0; i < count; i += 1) {
              if(editors.item(i).editor === editor) {
                return i;
              }
            }
            return -1;
          };

          self.removeEditor = function(editor) {
            var index = getIndexFromEditor(editor);
            if(index >= 0) {
              editors.remove(index);
            }
          };

          var getKey = function(id) {
            if(id === Cairo.Constants.NO_ID) {
              return "new-id:" + (new Date).getTime().toString()
            }
            else {
              return "k:" + id.toString();
            }
          };

          self.updateEditorKey = function(editor, newId) {
            var index = getIndexFromEditor(editor);
            if(index >= 0) {
              var editor = editors.item(index);
              editors.remove(index);
              var key = getKey(newId);
              editors.add(editor, key);
            }
          };

          self.edit = function(id, treeId, branchId) {
            var key = getKey(id);
            if(editors.contains(key)) {
              editors.item(key).dialog.showDialog();
            }
            else {
              var editor = Cairo.ProductoKitItemA.Edit.Controller.getEditor();
              var dialog = Cairo.Dialogs.Views.Controller.newDialog();

              editor.setTree(self);
              editor.setDialog(dialog);
              editor.setTreeId(treeId);
              editor.setBranchId(branchId);
              editor.edit(id);

              editors.add({editor: editor, dialog: dialog}, key);
            }
          };

          self.destroy = function(id, treeId, branchId) {
            if(!Cairo.Security.hasPermissionTo(Cairo.Security.Actions.General.DELETE_PRODUCTOKITITEMA)) {
              return Cairo.Promises.resolvedPromise(false);
            }
            var apiPath = Cairo.Database.getAPIVersion();
            return Cairo.Database.destroy(apiPath + "general/productokititema", id, Cairo.Constants.DELETE_FUNCTION, "ProductoKitItemA").success(
              function() {
                try {
                  var key = getKey(id);
                  if(editors.contains(key)) {
                    editors.item(key).dialog.closeDialog();
                  }
                }
                catch(ignore) {
                  Cairo.log('Error closing dialog after delete');
                }
                return true;
              }
            );
          };

          // progress message
          //
          Cairo.LoadingMessage.show("ProductoKitItemAs", "Loading productokititema from Crowsoft Cairo server.");

          // create the tree region
          //
          Cairo.addRegions({ productokititemaTreeRegion: tabId });

          // create the dialog
          //
          Cairo.Tree.List.Controller.list(
            Cairo.Tables.PRODUCTOKITITEMA,
            new Cairo.Tree.List.TreeLayout({ model: self.entityInfo }),
            Cairo.productokititemaTreeRegion,
            self);

        };

        var showTreeDialog = function() {
          Cairo.Tree.List.Controller.showTreeDialog(self);
        };

        var closeTreeDialog = function() {

        }

        // create the tab
        //
        Cairo.mainTab.showTab("ProductoKitItemAs", "productokititemaTreeRegion", "#general/productokititemas", createTreeDialog, closeTreeDialog, showTreeDialog);

      }
    };
  });


}());