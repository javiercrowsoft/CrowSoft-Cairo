///////////////
// Entities        underscore.js 1270 your new 2501 :P
///////////////

Cairo.module("Entities", function(Entities, Cairo, Backbone, Marionette, $, _) {
  Entities.Tree = Backbone.Model.extend({
    urlRoot: "/system/tree",

    defaults: {
      name: ""
    },

    validate: function(attrs, options) {
      var errors = {};
      if(! attrs.name) {
        errors.name = "can't be blank";
      }
      if( ! _.isEmpty(errors)) {
        return errors;
      }
    }
  });

  Entities.Branch = Backbone.Model.extend({
    urlRoot: "/system/branch",

    defaults: {
      name: "",
      treeId: 0
    },

    validate: function(attrs, options) {
      var errors = {};
      if(attrs.treeId === 0) {
        errors.treeId = "can't be blank";
      }
      if(attrs.name === "") {
        errors.name = "can't be blank";
      }
      if( ! _.isEmpty(errors)) {
        return errors;
      }
    }
  });

  Entities.Leave = Backbone.Model.extend({
    urlRoot: "/system/leave",

    defaults: {
      id: 0,
      clientId: 0
    },

    validate: function(attrs, options) {
      var errors = {};
      if(attrs.clientId === 0) {
        errors.clientId = "can't be blank";
      }
      if( ! _.isEmpty(errors)) {
        return errors;
      }
    }
  });

  Entities.TreeCollection = Backbone.Collection.extend({
    url: function () {
            return '/system/trees/' + this.tableId;
         },
    model: Entities.Tree,
    comparator: "id",
    tableId: 0
  });

  Entities.LeaveCollection = Backbone.Collection.extend({
    url: function () {
            return '/system/branch/' + this.branchId;
         },
    model: Entities.Leave,
    comparator: "id",
    branchId: 0
  });

  Entities.PasteInfo = Backbone.Model.extend({
    urlRoot: "/system/branch/paste",

    validate: function(attrs, options) {
      var errors = {};
      if(attrs.idFrom === 0) {
        errors.idFrom = "can't be blank";
      }
      if(attrs.idTo === 0) {
        errors.idTo = "can't be blank";
      }
      if(attrs.onlyChildren === undefined) {
        errors.onlyChildren = "can't be undefined";
      }
      if(attrs.isCut === undefined) {
        errors.isCut = "can't be undefined";
      }
      if( ! _.isEmpty(errors)) {
        return errors;
      }
    }
  });

  Entities.MoveInfo = Backbone.Model.extend({
    urlRoot: "/system/branch/move",

    validate: function(attrs, options) {
      var errors = {};
      if(attrs.branchId === 0) {
        errors.branchId = "can't be blank";
      }
      if(attrs.direction !== 'UP' &&
         attrs.direction !== 'DOWN' &&
         attrs.direction !== 'TOP' &&
         attrs.direction !== 'BOTTOM') {
        errors.direction = "must be UP, DOWN, TOP or BOTTOM";
      }
      if( ! _.isEmpty(errors)) {
        return errors;
      }
    }
  });

  Entities.SortInfo = Backbone.Model.extend({
    urlRoot: "/system/tree/sort",

    validate: function(attrs, options) {
      var errors = {};
      if(attrs.treeId === 0) {
        errors.treeId = "can't be blank";
      }
      if(attrs.direction !== 'ASC' &&
         attrs.direction !== 'DESC') {
        errors.direction = "must be ASC or DESC";
      }
      if( ! _.isEmpty(errors)) {
        return errors;
      }
    }
  });

  var API = {
    getTreeEntities: function(tableId) {
      var trees = new Entities.TreeCollection();
      trees.tableId = tableId;
      var defer = $.Deferred();
      trees.fetch({
        success: function(data) {
          defer.resolve(data);
        }
      });
      var promise = defer.promise();
      $.when(promise).done(function(trees) { });
      return promise;
    },

    getTreeEntity: function(treeId) {
      var tree = new Entities.Tree({id: treeId});
      var defer = $.Deferred();
      tree.fetch({
        success: function(data) {
          defer.resolve(data);
        },
        error: function(data) {
          defer.resolve(undefined);
        }
      });
      return defer.promise();
    },

    getBranchEntity: function(branchId) {
      var leaves = new Entities.LeaveCollection();
      leaves.branchId = branchId;
      var defer = $.Deferred();
      leaves.fetch({
        success: function(data) {
          defer.resolve(data);
        }
      });
      var promise = defer.promise();
      $.when(promise).done(function(leaves) { });
      return promise;
    }
  };

  Cairo.reqres.setHandler("tree:entities", function(tableId) {
    return API.getTreeEntities(tableId);
  });

  Cairo.reqres.setHandler("tree:entity", function(treeId) {
    return API.getTreeEntity(treeId);
  });

  Cairo.reqres.setHandler("branch:entity", function(branchId) {
    return API.getBranchEntity(branchId);
  });

});

///////////////
// Handler
///////////////

Cairo.module("Tree", function(Tree, Cairo, Backbone, Marionette, $, _) {
  var nextControlId = 1000;

  Tree.SELECT_ID_TAG_NAME = "data-select-ctrl-id";

  Tree.getNextControlId = function() {
    nextControlId += 1;
    return "C" + nextControlId;
  };

});

///////////////
// Views
///////////////

Cairo.module("Tree.List", function(List, Cairo, Backbone, Marionette, $, _) {
  List.Tree = Backbone.View.extend({
    tagName: "select",
    className: "form-control tree-select",
    events: {
        "change": "clicked"
    },

    clicked: function(e) {
        e.preventDefault();
        var treeId = $(e.currentTarget).val();
        Cairo.Tree.List.Controller.listTree(treeId, this.listController);
    },

    render: function() {
        var self = this;
        var getSelectedTree = function() {
          try {
            return self.listController.Tree.selectedTreeId || self.collection.first().get("id");
          }
          catch (e) {
            return 0;
          }
        };
        var clearSelectedTree = function() {
          self.listController.Tree.selectedTreeId = 0;
        };
        var template = _.template($("#tree-item-template").html());
        var el = $(this.el);
        this.collection.each(function(model) {
            var html = template(model.toJSON());
            el.append(html);
        });
        this.listController.Tree.SelectControlId = Cairo.Tree.getNextControlId();
        $(el).attr(Cairo.Tree.SELECT_ID_TAG_NAME, this.listController.Tree.SelectControlId);
        try {
            var treeId = getSelectedTree();
            clearSelectedTree();
            if(treeId) { $(el).val(treeId); }
            Cairo.Tree.List.Controller.listTree(treeId, this.listController);
        }
        catch (e) {
        }
    }
  });

  List.NewTree = Marionette.ItemView.extend({
    template: "#tree-create-first-tree-template",
    id: "new-tree-view",

    events: {
      "click button.js-new-tree": "clicked"
    },

    clicked: function(e) {
      e.preventDefault();
      Cairo.Tree.Actions.Tree.newTree(this.listController);
    }
  });

  // new list
  List.TreeLayout = Marionette.Layout.extend({
    template: "#tree-layout-template",

    /*regions: {
      panelRegion: "#tree-panel-region",
      itemsRegion: "#tree-items-region"
    }*/
  });

  List.Layout = Marionette.Layout.extend({
    template: "#tree-list-layout-template",

    regions: {
      panelRegion: "#tree-panel-region",
      itemsRegion: "#tree-items-region"
    }
  });

  List.Panel = Marionette.ItemView.extend({
    template: "#tree-list-panel-template",

    triggers: {
      "click button.js-new": "tree:new"
    },

    events: {
      "submit #filter-form": "filterTrees"
    },

    ui: {
      criterion: "input.js-filter-criterion"
    },

    filterTrees: function(e) {
      e.preventDefault();
      var criterion = this.$(".js-filter-criterion").val();
      this.trigger("trees:filter", criterion);
    },

    onSetFilterCriterion: function(criterion) {
      this.ui.criterion.val(criterion);
    }
  });

  List.Item = Marionette.ItemView.extend({
    tagName: "span",
    template: "#tree-list-item-template",

    triggers: {
      "click td a.js-edit": "item:edit",
      "click button.js-delete": "item:delete"
    },

    events: {
      "click": "highlightName"
    },

    flash: function(cssClass) {
      var $view = this.$el;
      $view.hide().toggleClass(cssClass).fadeIn(800, function() {
        setTimeout(function() {
          $view.toggleClass(cssClass)
        }, 500);
      });
    },

    highlightName: function(e) {
      this.$el.toggleClass("warning");
    },

    remove: function() {
      var self = this;
      this.$el.fadeOut(function() {
        Marionette.ItemView.prototype.remove.call(self);
      });
    }

  });

  var NoItemsView = Marionette.ItemView.extend({
    template: "#tree-list-none-template",
    tagName: "tr",
    className: "alert"
  });

  List.Items = Marionette.CompositeView.extend({
    tagName: "table",
    className: "table table-hover",
    template: "#tree-list-template",
    emptyView: NoItemsView,
    itemView: List.Item,
    itemViewContainer: "tbody",

    initialize: function() {
      this.listenTo(this.collection, "reset", function() {
        this.appendHtml = function(collectionView, itemView, index) {
          collectionView.$el.append(itemView.el);
        }
      });
    },

    onCompositeCollectionRendered: function() {
      this.appendHtml = function(collectionView, itemView, index) {
        collectionView.$el.prepend(itemView.el);
      }
    },

    serializeData: function() {
      var data = {};
      if (this.collection) {
        data = this.collection.models[0].toJSON();
      }
      return data;
    },

    appendBuffer: function(compositeView, buffer) {
      var $container = this.getItemViewContainer(compositeView);
      $container.append(buffer.firstChild.children);
    }

  });
  // end new list

});

///////////////
// Controller
///////////////

Cairo.module("Tree.Actions", function(Actions, Cairo, Backbone, Marionette, $, _) {

  Actions.clipboardActions = {
    ACTION_CUT: "cut",
    ACTION_COPY: "copy",
    ACTION_COPY_CHILDREN: "copyChildren"
  },

  Actions.Tree = {
    newTree: function(listController) {
      var view = Cairo.inputFormView("New tree", "Tree name", "(New tree)", function(text) {
        var tree = new Cairo.Entities.Tree();
        tree.save({ name: text, tableId: listController.Tree.tableId }, {
          wait: true,
          success: function(model, response) {
            Cairo.log("Successfully saved!");
            listController.Tree.selectedTreeId = model.get("id")
            Cairo.Tree.List.Controller.list(listController.Tree.tableId, listController.Tree.mainView, listController);
          },
          error: function(model, error) {
            Cairo.log("Failed in save new tree.");
            Cairo.log(error.responseText);
            Cairo.manageError(
              "New Tree",
              "Can't create a new tree named '" + text + "'. An error has occurred in the server.",
              error.responseText);
          }
        });
      });
      Cairo.dialogRegion.show(view);
    }
  }

  Actions.Branch = {

    // branch operations
    cut: function(branchId, text, listController) {
        Cairo.log("cut called (branchId: " + branchId + " listController: " + listController + ")");
        listController.Tree.clipboard = {
            action: Actions.clipboardActions.ACTION_CUT,
            branchId: branchId,
            text: text
        };
    },

    copy: function(branchId, text, listController) {
        Cairo.log("copy called (branchId: " + branchId + " listController: " + listController + ")");
        listController.Tree.clipboard = {
            action: Actions.clipboardActions.ACTION_COPY,
            branchId: branchId,
            text: text
        };
    },

    copyChildren: function(branchId, text, listController) {
        Cairo.log("copyChildren called (branchId: " + branchId + " listController: " + listController + ")");
        listController.Tree.clipboard = {
            action: Actions.clipboardActions.ACTION_COPY_CHILDREN,
            branchId: branchId,
            text: text
        };
    },

    paste: function(node, branchId, text, listController) {
      Cairo.log(
          "paste called (branchId: " + branchId
          + " listController: " + listController + " clipboard: {"
              + " action: " + listController.Tree.clipboard.action
              + " branchId: " + listController.Tree.clipboard.branchId
              + " text: " + listController.Tree.clipboard.text
          + "} )");
      // we need a reference to the cut node because if this is pasted
      // in the same tree we need to remove it
      var fromNode = node.tree.getNodeByKey(listController.Tree.clipboard.branchId);
      var pasteInfo = new Cairo.Entities.PasteInfo();
      pasteInfo.save({
          idFrom: listController.Tree.clipboard.branchId,
          idTo: branchId,
          onlyChildren: (listController.Tree.clipboard.action === Actions.clipboardActions.ACTION_COPY_CHILDREN),
          isCut: (listController.Tree.clipboard.action === Actions.clipboardActions.ACTION_CUT)
        }, {
        wait: true,
        success: function(model, response) {
          Cairo.log("Successfully pasted!");
          node.fromDict(response[0]);
          if(fromNode !== null && listController.Tree.clipboard.action === Actions.clipboardActions.ACTION_CUT) {
            fromNode.remove();
          }
        },
        error: function(model, error) {
          Cairo.log("Failed in paste branch.");
          Cairo.log(error.responseText);
          Cairo.manageError(
            "Paste Folder",
            "Can't paste this folder '" + listController.Tree.clipboard.text + "'. An error has occurred in the server.",
            error.responseText);
        }
      });
    },

    newBranch: function(node, branchId, text, listController) {
      var view = Cairo.inputFormView("New folder", "Folder name", "(New folder)", function(text) {
        var branch = new Cairo.Entities.Branch();
        branch.save({ name: text, fatherId: branchId, treeId: listController.Tree.treeId }, {
          wait: true,
          success: function(model, response) {
            Cairo.log("Successfully saved!");
            var childNode = node.addChildren({
                    title: model.get("name"),
                    key: model.get("id"),
                    folder: true
                  });
            node.setExpanded(true);
          },
          error: function(model, error) {
            Cairo.log("Failed in save new branch.");
            Cairo.log(error.responseText);
            Cairo.manageError(
              "New Folder",
              "Can't create a new folder named '" + text + "'. An error has occurred in the server.",
              error.responseText);
          }
        });
      });
      Cairo.dialogRegion.show(view);
    },

    rename: function(node, branchId, text, listController) {
      var view = Cairo.inputFormView("Rename", "New name", text, function(text) {
        var branch = new Cairo.Entities.Branch();
        branch.id = branchId;
        branch.save(
          {
            id: branchId,
            name: text,
            fatherId: Cairo.Tree.Actions.Branch.getFatherId(node),
            treeId: listController.Tree.treeId
          },
          {
            wait: true,
            success: function(model, response) {
              Cairo.log("Successfully updated!");
              node.setTitle(model.get("name"));
              if(model.get("fatherId") === 0) {
                var selector = '*[' + Cairo.Tree.SELECT_ID_TAG_NAME + '="' +
                               listController.Tree.SelectControlId + '"]';
                $(selector).find('option[value="' + listController.Tree.treeId + '"]').text(model.get("name"));
              }
            },
            error: function(model, error) {
              Cairo.log("Failed in save new branch.");
              Cairo.log(error.responseText);
              Cairo.manageError(
              "Rename Folder",
              "Can't rename this folder '" + node.title + "' to '" + text + "'. An error has occurred in the server.",
              error.responseText);
            }
          }
        );
      });
      Cairo.dialogRegion.show(view);
    },

    deleteBranch: function(node, branchId, text, listController) {
      var view = Cairo.confirmViewYesDanger(
        "Delete",
        "Are you sure you want to delete this folder: " + text,
        function(answer) {
          if(answer == "yes") {
            var branch = new Cairo.Entities.Branch({
              id: branchId
            });
            branch.destroy({
              wait: true,
              success: function () {
                if(Cairo.Tree.Actions.Branch.getFatherId(node) === 0) {
                  Cairo.Tree.List.Controller.list(listController.Tree.tableId, listController.Tree.mainView, listController);
                }
                else {
                  node.remove();
                }
              },
              error: function(model, error) {
                Cairo.log("Failed in delete branch.");
                Cairo.log(error.responseText);
                Cairo.manageError(
                  "Delete Folder",
                  "Can't delete this folder '" + text + "'. An error has occurred in the server.",
                  error.responseText);
              }
            });
          }
      });
      Cairo.dialogRegion.show(view);
    },

    moveUp: function(node, branchId, text, listController) {
      Cairo.Tree.Actions.Branch.move(node, branchId, text, listController, 'UP');
    },

    moveDown: function(node, branchId, text, listController) {
      Cairo.Tree.Actions.Branch.move(node, branchId, text, listController, 'DOWN');
    },

    moveTop: function(node, branchId, text, listController) {
      Cairo.Tree.Actions.Branch.move(node, branchId, text, listController, 'TOP');
    },

    moveBottom: function(node, branchId, text, listController) {
      Cairo.Tree.Actions.Branch.move(node, branchId, text, listController, 'BOTTOM');
    },

    move: function(node, branchId, text, listController, direction) {
      Cairo.log("move" + direction + " called (branchId: " + branchId + ")");
      var moveInfo = new Cairo.Entities.MoveInfo();
      moveInfo.save({
          branchId: branchId,
          direction: direction
        }, {
        wait: true,
        success: function(model, response) {
          Cairo.log("Successfully moved " + direction + "!");
          switch(direction) {
            case "UP":
              node.moveTo(node.getPrevSibling(), "before");
              node.setActive();
              break;
            case "DOWN":
              node.moveTo(node.getNextSibling(), "after");
              node.setActive();
              break;
            case "TOP":
              node.moveTo(node.getParent().getFirstChild(), "before");
              node.setActive();
              break;
            case "BOTTOM":
              node.moveTo(node.getParent().getLastChild(), "after");
              node.setActive();
              break;
          }
        },
        error: function(model, error) {
          Cairo.log("Failed in move branch.");
          Cairo.log(error.responseText);
          Cairo.manageError(
            "Move " + direction,
            "Can't move " + direction.toLowerCase() + " this folder '" + text + "'. An error has occurred in the server.",
            error.responseText);
        }
      });
    },

    sortAZ: function(node, branchId, text, listController) {
      Cairo.Tree.Actions.Branch.sort(node, branchId, text, listController, 'ASC');
    },

    sortZA: function(node, branchId, text, listController) {
      Cairo.Tree.Actions.Branch.sort(node, branchId, text, listController, 'DESC');
    },

    sort: function(node, branchId, text, listController, direction) {
      Cairo.log("sort" + direction + " called (branchId: " + branchId + ")");
      // we need a reference to the cut node because if this is pasted
      // in the same tree we need to remove it
      var sortInfo = new Cairo.Entities.SortInfo();
      sortInfo.save({
          treeId: listController.Tree.treeId,
          direction: direction
        }, {
        wait: true,
        success: function(model, response) {
          Cairo.log("Successfully sorted!");
          node.fromDict(response[0]);
        },
        error: function(model, error) {
          Cairo.log("Failed in sort tree.");
          Cairo.log(error.responseText);
          Cairo.manageError(
            "Paste Folder",
            "Can't sort this tree '" + text + "'. An error has occurred in the server.",
            error.responseText);
        }
      });
    },

    getFatherId: function(node) {
      var key = node.parent.key;
      return key.toString().substr(0, 5) === "root_" ? 0 : key;
    }

  }
});

Cairo.module("Tree.List", function(List, Cairo, Backbone, Marionette, $, _) {
  List.Controller = {
    list: function(tableId, mainView, listController) {
      Cairo.LoadingMessage.show();

      Cairo.Tree.List.Controller.addTreeToController(listController);
      listController.Tree.tableId = tableId;
      listController.Tree.mainView = mainView;

      var fetchingTrees = Cairo.request("tree:entities", tableId);

      $.when(fetchingTrees).done(function(trees) {
        var view = new List.Tree({collection: trees});
        view.listController = listController;
        view.render();
        $("#trees", mainView.$el).html(view.el);
      });
    },

    listTree: function(treeId, listController) {
      Cairo.LoadingMessage.show();

      Cairo.Tree.List.Controller.addTreeToController(listController);
      listController.Tree.treeId = treeId;

      var removeNewTreeView = function() {
        $("#new-tree-view", listController.Tree.mainView.$el).remove();
      };

      if(treeId) {

        removeNewTreeView();

        var fetchingTree = Cairo.request("tree:entity", treeId);

        $.when(fetchingTree).done(function(tree) {
          try {
              $("#tree").fancytree("destroy");
          }
          catch (e) {}
          $("#tree").fancytree({
              source: [tree.attributes[0]],
              activate: function(event, data) {
                          Cairo.logTreeEvent(event, data);
                          listController.showBranch(data.node.key)
                        }
          });

          $("#tree").contextmenu({
            delegate: "span.fancytree-title",
            preventContextMenuForPopup: true,
            preventSelect: true,
            taphold: true,
            menu: [
              {title: "New Tree", cmd: "newTree", uiIcon: "ui-icon-folder-collapsed"},
              {title: "New Folder", cmd: "newBranch", uiIcon: "ui-icon-folder-open"},
              {title: "----"},
              {title: "Cut", cmd: "cut", uiIcon: "ui-icon-scissors"},
              {title: "Copy", cmd: "copy", uiIcon: "ui-icon-copy"},
              {title: "Copy (only children)", cmd: "copyChildren", uiIcon: "ui-icon-copy"},
              {title: "Paste", cmd: "paste", uiIcon: "ui-icon-clipboard", disabled: true },
              {title: "----"},
              {title: "Rename", cmd: "rename", uiIcon: "ui-icon-pencil"},
              {title: "Delete", cmd: "delete", uiIcon: "ui-icon-trash"},
              {title: "----"},
              {title: "Move Up", cmd: "moveUp", uiIcon: "ui-icon-circle-arrow-n"},
              {title: "Move Down", cmd: "moveDown", uiIcon: "ui-icon-circle-arrow-s"},
              {title: "----"},
              {title: "Move Top", cmd: "moveTop", uiIcon: "ui-icon-circle-arrow-n"},
              {title: "Move Bottom", cmd: "moveBottom", uiIcon: "ui-icon-circle-arrow-s"},
              {title: "----"},
              {title: "Sort A-Z", cmd: "sortAZ", uiIcon: "ui-icon-circle-triangle-n"},
              {title: "Sort Z-A", cmd: "sortZA", uiIcon: "ui-icon-circle-triangle-s"},
              {title: "----"},
              {title: "Export to Spreed Sheet", cmd: "export", uiIcon: "ui-icon-calculator"}
            ],
            beforeOpen: function(event, ui) {
              var node = $.ui.fancytree.getNode(ui.target);
              var clipboardContent = "";
              var branchId = 0;
              if(listController.Tree.clipboard && listController.Tree.clipboard.action) {
                clipboardContent = listController.Tree.clipboard.text;
                branchId = listController.Tree.clipboard.branchId;
              }
              var isRoot = (node === node.tree.getFirstChild());
              $("#tree")
                  .contextmenu("setEntry", "paste", {
                      title: "Paste" + (clipboardContent ? " : " + clipboardContent : ""),
                      uiIcon: "ui-icon-clipboard"
                      })
                  .contextmenu("enableEntry", "paste", (clipboardContent !== "" && branchId !== node.key))
                  .contextmenu("enableEntry", "moveUp", (node !== node.getParent().getFirstChild()))
                  .contextmenu("enableEntry", "moveTop", (node !== node.getParent().getFirstChild()))
                  .contextmenu("enableEntry", "moveDown", (node !== node.getParent().getLastChild()))
                  .contextmenu("enableEntry", "sortAZ", isRoot)
                  .contextmenu("enableEntry", "sortZA", isRoot);
              node.setActive();
            },
            select: function(event, ui) {
              var node = $.ui.fancytree.getNode(ui.target);
              Cairo.log("select " + ui.cmd + " on " + node.key);
              switch(ui.cmd) {
                case "newTree":
                  Cairo.Tree.Actions.Tree.newTree(listController);
                  break;
                case "newBranch":
                  Cairo.Tree.Actions.Branch.newBranch(node, node.key, node.title, listController);
                  break;
                case "cut":
                  Cairo.Tree.Actions.Branch.cut(node.key, node.title, listController);
                  break;
                case "copy":
                  Cairo.Tree.Actions.Branch.copy(node.key, node.title, listController);
                  break;
                case "copyChildren":
                  Cairo.Tree.Actions.Branch.copyChildren(node.key, node.title, listController);
                  break;
                case "paste":
                  Cairo.Tree.Actions.Branch.paste(node, node.key, node.title, listController);
                  break;
                case "rename":
                  Cairo.Tree.Actions.Branch.rename(node, node.key, node.title, listController);
                  break;
                case "delete":
                  Cairo.Tree.Actions.Branch.deleteBranch(node, node.key, node.title, listController);
                  break;
                case "moveUp":
                  Cairo.Tree.Actions.Branch.moveUp(node, node.key, node.title, listController);
                  break;
                case "moveDown":
                  Cairo.Tree.Actions.Branch.moveDown(node, node.key, node.title, listController);
                  break;
                case "moveTop":
                  Cairo.Tree.Actions.Branch.moveTop(node, node.key, node.title, listController);
                  break;
                case "moveBottom":
                  Cairo.Tree.Actions.Branch.moveBottom(node, node.key, node.title, listController);
                  break;
                case "sortAZ":
                  Cairo.Tree.Actions.Branch.sortAZ(node, node.key, node.title, listController);
                  break;
                case "sortZA":
                  Cairo.Tree.Actions.Branch.sortZA(node, node.key, node.title, listController);
                  break;
              }
            }
          });

          Cairo.LoadingMessage.close();
        });
      }
      else {
        var view = new List.NewTree({model: listController.entityInfo});
        view.listController = listController;
        view.render();
        $("#tree", listController.Tree.mainView.$el).html(view.el);
        Cairo.LoadingMessage.close();
      }
    },

    listBranch: function(branchId, criterion, showItem, listController) {
      Cairo.LoadingMessage.show();

      var fetchingBranch = Cairo.request("branch:entity", branchId);

      var itemsListLayout = new List.Layout({ model: listController.entityInfo });
      var itemsListPanel = new List.Panel({ model: listController.entityInfo });

      $.when(fetchingBranch).done(function(branch) {
        showItem(branch, criterion, itemsListPanel, itemsListLayout, listController);
      });
    },

    showItem: function(branch, criterion, itemsListPanel, itemsListLayout, listController) {
      branch.entityInfo = listController.entityInfo;

      var filteredItems = Cairo.Entities.FilteredCollection({
        collection: branch,
        filterFunction: function(filterCriterion) {
          var criterion = filterCriterion.toLowerCase();
          return function(leave) {
            var matches = false;
            leave.values.forEach(function(value) {
              if(value.toLowerCase().indexOf(criterion) !== -1) matches = true;
            });
            if(matches) {
              return leave;
            }
          };
        }
      });

      if(criterion) {
        filteredItems.filter(criterion);
        itemsListPanel.once("show", function() {
          itemsListPanel.triggerMethod("set:filter:criterion", criterion);
        });
      }

      var itemsListView = new List.Items({
        collection: filteredItems
      });

      itemsListPanel.on("items:filter", function(filterCriterion) {
        filteredItems.filter(filterCriterion);
        Cairo.trigger("items:filter", filterCriterion);
      });

      itemsListLayout.on("show", function() {
        itemsListLayout.panelRegion.show(itemsListPanel);
        itemsListLayout.itemsRegion.show(itemsListView);
      });

      itemsListPanel.on("item:new", function() {

        // TODO: call to controller listController.newItem

        /*
        var newUsuario = new Cairo.Entities.Usuario();

        var view = new Cairo.Usuario.New.Usuario({
          model: newUsuario
        });

        view.on("form:submit", function(data) {
          if(usuarios.length > 0) {
            var highestId = usuarios.max(function(c) { return c.id; }).get("id");
            data.id = highestId + 1;
          }
          else{
            data.id = 1;
          }
          if(newUsuario.save(data)) {
            usuarios.add(newUsuario);
            view.trigger("dialog:close");
            var newUsuarioView = usuariosListView.children.findByModel(newUsuario);
            // check whether the new usuario view is displayed (it could be
            // invisible due to the current filter criterion)
            if(newUsuarioView) {
              newUsuarioView.flash("success");
            }
          }
          else{
            view.triggerMethod("form:data:invalid", newUsuario.validationError);
          }
        });

        Cairo.dialogRegion.show(view);
        */
      });

      itemsListView.on("itemview:item:edit", function(childView, args) {

        // TODO: call to controller listController.editItem

        //Cairo.trigger("usuario:edit", args.model.get("id"));
        /*
        var model = args.model;
        var view = new Cairo.Usuario.Edit.Usuario({
          model: model
        });

        view.on("form:submit", function(data) {
          if(model.save(data)) {
            childView.render();
            view.trigger("dialog:close");
            childView.flash("success");
          }
          else{
            view.triggerMethod("form:data:invalid", model.validationError);
          }
        });

        Cairo.dialogRegion.show(view);
        */
      });

      itemsListView.on("itemview:item:delete", function(childView, args) {
        // TODO: test how it works
        args.model.destroy();
      });

      Cairo.treeListRegion.reset();
      Cairo.treeListRegion.show(itemsListLayout);

      Cairo.LoadingMessage.close();
    },

    addTreeToController: function(listController) {
      if(listController.Tree == undefined) {
        listController.Tree = { };
      };
    }

  };
});