(function() {
  "use strict";

  /*
      this module manages a tree view. all master tables are navigated using a tree view
      a table needs to have at least one tree associated to it. a table can have many
      trees. a tree allows the user to classify all rows in a hierarchy

      trees are compose for three tables: (for now the database is in spanish :)
        Arbol   ( Tree )
        Rama    ( Branch )
        Hoja    ( Leave )

        a tree is associated to a table through the field tbl_id which is a FK to table Tabla
        the table Tabla is a dictionary which contains a definition for ever master table in
        the system
        every leave is associated with one row in the table associated to its tree
        every row which doesn't have a leave is in the root branch of the tree
        branches are used to set parameters in reports and process. branches allow the users
        to define arbitrary sets of rows and the hierarchy is not only used to filter but
        to grouping and summarizing
        in accounting trees are used to define the trial balance. the user can create
        as many trial balance as he need

      this tree module works with a table entity manager. All operations over the tree are
      handled by this module and all operations to the rows of the table associated to a tree
      are managed by the entity manager object.

      every master table has an entity manager object which handles the CRUD operations over
      that table

      the table entity manager is responsible for creating the tab which will contain the tree
      view and the main view ( List.TreeLayout ) of the tree

      the table entity manager is referred as the listController

      the listController must implement the following methods:

        entityInfo:
          an object of type:

                entityInfo = {
                  entitiesTitle:  "",
                  entityName:     "",
                  entitiesName:   ""
                }

          the entityInfo has more properties which are only used by the TreeSelect object
          these attributes allow us to hide some controls like the new entity button, search button,
          select all button, etc. when showing the tree dialog for select

        showBranch:
          a function which will call listBranch and pass it a function to draw the leaves:

                showBranch = function (branchId) {
                  Cairo.log("Loading nodeId: " + branchId);
                  Cairo.Tree.List.Controller.listBranch(branchId, Cairo.Tree.List.Controller.showItems, self)
                };

          most of the case will pass Cairo.Tree.List.Controller.showItems which is the default
          implementation

  */

  ///////////////
  // Entities
  ///////////////

  Cairo.module("Entities", function(Entities, Cairo, Backbone, Marionette, $, _) {

    /*
        used ONLY to create a tree
        the UPDATE and DELETE in a tree are handled by the root branch
        to rename a tree the user renames the root branch
        to delete a tree the user deletes the root branch
    */
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

    /*
        used to CREATE, RENAME and DELETE a branch or a tree if the branch is the root
    */
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

    /*
        used in tree API
    */
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

    /*
        used in tree API
    */
    Entities.TreeCollection = Backbone.Collection.extend({
      url: function () {
              return '/system/trees/' + this.tableId;
           },
      model: Entities.Tree,
      comparator: "id",
      tableId: 0
    });

    /*
        used in tree API
    */
    Entities.LeaveCollection = Backbone.Collection.extend({
      url: function () {
              return '/system/branch/' + this.branchId;
           },
      model: Entities.Leave,
      comparator: "id",
      branchId: 0
    });

    /*
        used in tree API
    */
    Entities.BranchCollection = Backbone.Collection.extend({
      url: function () {
              return '/system/branch/' + this.treeId + '/leave/item/' + this.clientId;
           },
      model: Entities.Branch,
      comparator: "id",
      treeId: 0,
      clientId: 0
    });

    /*
        used for BRANCH paste operations: paste copy and paste cut
    */
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

    /*
        used for move operations over branches
    */
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

    /*
        used for sort operations over trees
    */
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

    /*
        used for LEAVE paste operations: paste copy and paste cut
    */
    Entities.PasteLeaveInfo = Backbone.Model.extend({
      urlRoot: "/system/leave/paste",

      validate: function(attrs, options) {
        var errors = {};
        if(attrs.ids === "") {
          errors.ids = "can't be blank";
        }
        if(attrs.idTo === 0) {
          errors.idTo = "can't be blank";
        }
        if(attrs.isCut === undefined) {
          errors.isCut = "can't be undefined";
        }
        if( ! _.isEmpty(errors)) {
          return errors;
        }
      }
    });

    /*
        tree API

        this API is not used yet and maybe will be removed in the future
    */

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
        //$.when(promise).done(function(trees) { });
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
        return defer.promise();
      },

      getBranchEntityByClientId: function(treeId, clientId) {
        var branches = new Entities.BranchCollection();
        branches.treeId = treeId;
        branches.clientId = clientId;
        var defer = $.Deferred();
        branches.fetch({
          success: function(data) {
            defer.resolve(data);
          }
        });
        return defer.promise();
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

    Cairo.reqres.setHandler("branch:entity_by_client_id", function(treeId, clientId) {
      return API.getBranchEntityByClientId(treeId, clientId);
    });

    /*
        end of tree API
    */

  });

  ///////////////
  // Handler
  ///////////////

  Cairo.module("Tree", function(Tree, Cairo, Backbone, Marionette, $, _) {
    var nextControlId = 1000;

    /*
        the system shows many trees at the same time
        so the ids in the templates has to be updated
        to make them unique
    */

    /*
        the select which contains the list of trees has a data attribute set to
        the tbl_id of the table been shown. this data attribute is set in the render
        function of the view List.Tree and used to update the select when the root
        branch is renamed
    */
    Tree.SELECT_ID_TAG_NAME = "data-select-ctrl-id";

    /*
        every id in the templates need to be updated keep them unique
    */
    Tree.getNextControlId = function() {
      nextControlId += 1;
      return "CTL_" + nextControlId;
    };

    /*

      column formatting

    */

    Tree.getColumnValue = function(column, value) {
      // TODO: find a generic way to identify boolean columns
      //
      if(column.name === "activo") {
        value = "<i class='glyphicon glyphicon-check'></i>";
      }
      else {
        /* TODO: add other formats
        switch(column.columnType) {
          case "boolean":
            value = "";
            break;
        }
        */
        value = _.escape(value);
      }
      return value;
    };

  });

  ///////////////
  // Views
  ///////////////

  Cairo.module("Tree.List", function(List, Cairo, Backbone, Marionette, $, _) {

    /*
        this view is used to show the select which contains the list of trees
    */
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
          catch(ignore) {}
      }
    });

    /*
        used to present an alert dialog to explain the user he needs to create at least a tree to
        navigate the table
    */
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

    /*
        the main view which contains all other views in the tree dialog
        this view is created by the tree client object
    */
    List.TreeLayout = Marionette.Layout.extend({
      template: "#tree-layout-template"
    });

    /*
        this view contain the list of items/rows in a branch
        every time a branch is selected this view is destroyed and created
        this is done in List.Controller.listBranch
    */
    List.Layout = Marionette.Layout.extend({
      template: "#tree-list-layout-template",

      regions: {
        panelRegion: "#tree-panel-region",
        itemsRegion: "#tree-items-region"
      }
    });

    /*
        this view contains the create and the search buttons
        every time a branch is selected this view is destroyed and created
    */
    List.Panel = Marionette.ItemView.extend({
      template: "#tree-list-panel-template",

      triggers: {
        "click button.js-new": "tree:new"
      }
    });

    /*
        this view is a subview of List.Items
        it draws a row
    */
    List.Item = Marionette.ItemView.extend({
      tagName: "span",
      template: Cairo.isMobile() ? "#tree-list-item-template-mobile" : "#tree-list-item-template",

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
          setTimeout(function() { $view.toggleClass(cssClass); }, 500);
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

    /*
        this view is a subview of List.Items
        it shows a message when a branch is empty
    */
    var NoItemsView = Marionette.ItemView.extend({
      template: "#tree-list-none-template",
      tagName: "tr",
      className: "alert"
    });

    /*
        it draws a table with all the leave/rows in a branch or
        a message alerting the user that there is no data to list
        when the branch is empty
        it is used by List.Controller.showItems
    */
    List.Items = Marionette.CompositeView.extend({
      tagName: "table",
      id: "tree-item-table",
      className: "table table-hover",
      template: Cairo.isMobile() ? "#tree-list-template-mobile" : "#tree-list-template",
      emptyView: NoItemsView,
      itemView: List.Item,
      itemViewContainer: "tbody",

      initialize: function() {
        this.listenTo(this.collection, "reset", function() {
          this.appendHtml = function(collectionView, itemView, index) {
            collectionView.$el.append(itemView.el);
          };
        });
      },

      onCompositeCollectionRendered: function() {
        this.appendHtml = function(collectionView, itemView, index) {
          collectionView.$el.prepend(itemView.el);
        };
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
    };

    Actions.Tree = {
      newTree: function(listController) {
        var view = Cairo.inputFormView("New tree", "Tree name", "(New tree)", function(text) {
          var tree = new Cairo.Entities.Tree();
          tree.save({ name: text, tableId: listController.Tree.tableId }, {
            wait: true,
            success: function(model, response) {
              Cairo.log("Successfully saved!");
              listController.Tree.selectedTreeId = model.get("id");
              Cairo.Tree.List.Controller.list(
                listController.Tree.tableId,
                listController.Tree.mainView,
                listController.Tree.mainRegion,
                listController);
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
    };

    Actions.Branch = {

      // branch operations
      cut: function(branchId, text, listController) {
          Cairo.log("cut called (branchId: " + branchId + " listController: " + listController + ")");
          listController.Tree.clipboard = {
              action: Actions.clipboardActions.ACTION_CUT,
              branchId: branchId,
              text: text,
              isBranch: true
          };
      },

      copy: function(branchId, text, listController) {
          Cairo.log("copy called (branchId: " + branchId + " listController: " + listController + ")");
          listController.Tree.clipboard = {
              action: Actions.clipboardActions.ACTION_COPY,
              branchId: branchId,
              text: text,
              isBranch: true
          };
      },

      copyChildren: function(branchId, text, listController) {
          Cairo.log("copyChildren called (branchId: " + branchId + " listController: " + listController + ")");
          listController.Tree.clipboard = {
              action: Actions.clipboardActions.ACTION_COPY_CHILDREN,
              branchId: branchId,
              text: text,
              isBranch: true
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

        var pasteLeave = function() {
          var pasteInfo = new Cairo.Entities.PasteLeaveInfo();
          pasteInfo.save({
              ids: listController.Tree.clipboard.leaveIds,
              idTo: branchId,
              isCut: (listController.Tree.clipboard.action === Actions.clipboardActions.ACTION_CUT)
            }, {
            wait: true,
            success: function(model, response) {
              Cairo.log("Successfully pasted!");
              listController.showBranch(node.key);
            },
            error: function(model, error) {
              Cairo.log("Failed in pate leaves.");
              Cairo.log(error.responseText);
              Cairo.manageError(
                "Paste Leaves",
                "Can't paste these leaves '" + listController.Tree.clipboard.leaveIds + "'. An error has occurred in the server.",
                error.responseText);
            }
          });
        };

        var pasteBranch = function() {
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
        };

        if(listController.Tree.clipboard.isBranch) {
          pasteBranch();
        }
        else {
          pasteLeave();
        }
      },

      newBranch: function(node, branchId, text, listController) {
        var view = Cairo.inputFormView("New folder", "Folder name", "(New folder)", function(text) {
          var branch = new Cairo.Entities.Branch();
          branch.save({ name: text, fatherId: branchId, treeId: listController.Tree.treeId }, {
            wait: true,
            success: function(model, response) {
              Cairo.log("Successfully saved!");
              node.addChildren({
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
        Cairo.Modal.confirmViewYesDanger(
          "Delete",
          "Are you sure you want to delete this folder: " + text
        ).then(
          function(answer) {
            if(answer === "yes") {
              var branch = new Cairo.Entities.Branch({
                id: branchId
              });
              branch.destroy({
                wait: true,
                success: function () {
                  if(Cairo.Tree.Actions.Branch.getFatherId(node) === 0) {
                    Cairo.Tree.List.Controller.list(
                      listController.Tree.tableId,
                      listController.Tree.mainView,
                      listController.Tree.mainRegion,
                      listController);
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
          }
        );
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
              "Sort Folder",
              "Can't sort this tree '" + text + "'. An error has occurred in the server.",
              error.responseText);
          }
        });
      },

      getFatherId: function(node) {
        var key = node.parent.key;
        return key.toString().substr(0, 5) === "root_" ? 0 : key;
      }

    };

  });

  Cairo.module("Tree.List", function(List, Cairo, Backbone, Marionette, $, _) {
    List.Controller = {

      /*
          this controller has four basic functions:

            list:       fills a select with all the trees associated to a table
            listTree:   fills a FancyTree with all the branches of the selected tree
            listBranch: fills a table with all the leaves of the selected branch
            showItems:  draw the table with all the leaves

            IMPORTANT: listBranch will call a showItems function which is responsible
                       of draw the table. this controller implement a showItems function
                       but is the table entity manager ( listController ) who decide
                       which function to use to draw the leaves. the listBranch function
                       must be called by the showBranch function of the listController

                       all the state associated with the tree is persisted in the
                       listController's Tree object. this object is created when the
                       list function is called by the listController
      */

      /*
          @tableId:         the tbl_id of the table to navigate
          @mainView:        an instance of List.TreeLayout
          @mainRegion:      is a region that the listController must have added to Cairo
          @listController:  a reference to the table entity manager
      */
      list: function(tableId, mainView, mainRegion, listController) {
        Cairo.LoadingMessage.show();

        Cairo.Tree.List.Controller.setTreeIntoController(listController);

        //////////////
        mainRegion.show(mainView);

        var regionId = "tree-main-list-region_" + Cairo.Tree.getNextControlId();
        $("#tree-main-list-region").attr("id", regionId);

        // create the list region
        //
        var treeListRegion = listController.entityInfo.entityName;
        var regions = {};
        regions[treeListRegion] = "#" + regionId;
        Cairo.addRegions(regions);

        listController.Tree.treeListRegion = Cairo[treeListRegion];
        //////////////

        listController.Tree.tableId = tableId;
        listController.Tree.mainView = mainView;
        listController.Tree.mainRegion = mainRegion;
        listController.Tree.treeControlId = Cairo.Tree.getNextControlId();
        listController.Tree.newTreeMessageId = Cairo.Tree.getNextControlId();
        listController.Tree.treeSearchControlId = Cairo.Tree.getNextControlId();

        // create the select control to search entities
        //
        $("#tree-search-control", mainView.$el).attr("id", listController.Tree.treeSearchControlId);
        listController.Tree.treeSearchControlId = "#" + listController.Tree.treeSearchControlId;
        var searchCtrl = Cairo.Select.Controller.createSelectControl(listController.Tree.treeSearchControlId, tableId, false, "-");

        // this handler will request the branch id which contains the clientId
        // returned by the search control and then activate the correspondent
        // node in the tree control
        //
        var searchUpdateHandler = function(e) {
          Cairo.log("search-update: " + e.data.id + " - " + e.data.values[0] + " - " + e.data.values[1]);
          var fetchingBranch = Cairo.request("branch:entity_by_client_id", listController.Tree.treeId, e.data.id);
          $.when(fetchingBranch).done(function(branches) {
            if(branches.models.length > 0) {
              try {
                var branchId = branches.models[0].id;
                var root = $(listController.Tree.treeControlId).fancytree("getRootNode").tree.getFirstChild();
                var node = branchId != 0 ? root.tree.getNodeByKey(branchId) : root;
                listController.Tree.lastItemIdSearched = e.data.id;
                node.setActive();
              }
              catch (e) {
                Cairo.log("Failed in find branch which contains item.");
                Cairo.log(e.message);
                Cairo.manageError(
                  "Search in Tree",
                  "An error has occurred when trying to find and item in the tree.",
                  e.message);
              }
            }
          });
        };

        searchCtrl.addListener('onUpdate', searchUpdateHandler);

        if(listController.Tree.getValue('showSelectButton')) {
          //
          // handle select button which close dialog and create a multi selection branch if needed
          //
          var selectBtn = $('#tree-select-select-button', mainView.$el);
          selectBtn.attr("id", listController.Tree.treeSearchControlId); /* update id to avoid any id duplication */
          selectBtn.click(function() {

            // if the user has selected more than one item we need to create a new branch
            // and paste the items into it
            //
            var createMultiSelectionBranch = function(ids) {

              // special paste function which only paste the items into the folder but
              // didn't try to add show them in the tree dialog
              //
              var pasteLeave = function(branchId, text) {
                var pasteInfo = new Cairo.Entities.PasteLeaveInfo();
                pasteInfo.save({
                    ids: ids.toString(),
                    idTo: branchId,
                    isCut: false
                  }, {
                  wait: true,
                  success: function(model, response) {
                    Cairo.log("Successfully pasted!");
                    listController.Tree.lastSelected = {
                      type: 'node',
                      text: text,
                      ids: branchId,
                      isValid: true
                    };
                    mainView.trigger("dialog:close");
                  },
                  error: function(model, error) {
                    Cairo.log("Failed in pate leaves.");
                    Cairo.log(error.responseText);
                    Cairo.manageError(
                      "Paste Leaves",
                      "Can't paste these leaves '" + ids + "'. An error has occurred in the server.",
                      error.responseText);
                  }
                });
              };

              // first we create the multi selection branch
              //
              var TEMP_BRANCH = -1000;
              var branch = new Cairo.Entities.Branch();
              branch.save({ name: "Multi Selection", fatherId: TEMP_BRANCH, treeId: listController.Tree.treeId }, {
                wait: true,
                success: function(model, response) {
                  Cairo.log("Successfully saved!");
                  pasteLeave(model.get("id"), model.get("name"));
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
            };

            //
            // when the select button is clicked we check if there was a selection
            // we need to manage the special case when there was a multi selection
            // of items
            //
            Cairo.log('tree-select-button clicked');
            Cairo.log(JSON.stringify(listController.Tree.lastSelected))
            var data = listController.Tree.lastSelected;
            var closeDialog = true;
            if(data) {
              if(data.type === 'items') {
                var ids = data.ids.toString().split(",");
                if(ids.length > 1) {
                  //
                  // this is a complex operation which can result in errors
                  // we only close the dialog if the operation success
                  //
                  createMultiSelectionBranch(ids);
                  closeDialog = false;
                }
              }
            }
            // the selection contains only one item or a branch
            // it is a simple selection so we only need to close
            // the dialog
            //
            if(closeDialog) {
              listController.Tree.lastSelected.isValid = true;
              mainView.trigger("dialog:close");
            }
          });
        }

        var fetchingTrees = Cairo.request("tree:entities", tableId);

        $.when(fetchingTrees).done(function(trees) {
          var view = new List.Tree({collection: trees});
          view.listController = listController;
          view.render();
          $("#trees", mainView.$el).html(view.el);

          // rename all generic ids from this template
          //
          $("#tree", mainView.$el).attr("id", listController.Tree.treeControlId);
          listController.Tree.treeControlId = "#" + listController.Tree.treeControlId;

          $("#new-tree-view", mainView.$el).attr("id", listController.Tree.newTreeMessageId);
          listController.Tree.newTreeMessageId = "#" + listController.Tree.newTreeMessageId;
        });
      },

      listTree: function(treeId, listController) {
        Cairo.LoadingMessage.show();

        Cairo.Tree.List.Controller.setTreeIntoController(listController);
        listController.Tree.treeId = treeId;

        var removeNewTreeView = function() {
          $(listController.Tree.newTreeMessageId, listController.Tree.mainView.$el).remove();
        };

        if(treeId) {

          removeNewTreeView();

          var fetchingTree = Cairo.request("tree:entity", treeId);

          $.when(fetchingTree).done(function(tree) {
            try {
                $(listController.Tree.treeControlId).fancytree("destroy");
            }
            catch(ignore) {}
            $(listController.Tree.treeControlId).fancytree({
                source: [tree.attributes[0]],
                activate: function(event, data) {
                            Cairo.logTreeEvent(event, data);
                            listController.showBranch(data.node.key);
                          }
            });

            $(listController.Tree.treeControlId).contextmenu({
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
                $(listController.Tree.treeControlId)
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

                // to prevent the menu to be behind the dialog when showing a tree select
                //
                ui.menu.zIndex(1000);
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
          $(listController.Tree.treeControlId, listController.Tree.mainView.$el).html(view.el);
          Cairo.LoadingMessage.close();
        }
      },

      listBranch: function(branchId, showItems, listController) {
        Cairo.LoadingMessage.show();

        var fetchingBranch = Cairo.request("branch:entity", branchId);

        var itemsListLayout = new List.Layout({ model: listController.entityInfo });
        var itemsListPanel = new List.Panel({ model: listController.entityInfo });

        var hideColumns = function(branch) {

          if(listController.entityInfo.attributes.hiddenCols) {

            var columns = branch.models[0].attributes.columns;
            var k = -1;
            var colsToHide = [];
            var i, j;

            for(i = columns.length -1; i >= 0; i -= 1) {
              for(j = 0; j < listController.entityInfo.attributes.hiddenCols.length; j += 1) {
                if(columns[i].name === listController.entityInfo.attributes.hiddenCols[j]) {
                  k += 1;
                  colsToHide[k] = i;
                  columns.splice(colsToHide[k],1);
                  break;
                }
              }
            }

            var leaves = branch.models[0].attributes.leaves;
            for(i = 0; i < leaves.length; i += 1) {
              for(j = 0; j < colsToHide.length; j += 1) {
                leaves[i].values.splice(colsToHide[j], 1);
              }
            }
          }
        };

        var setEditControls = function(branch) {
          branch.models[0].attributes.showEditButton = listController.Tree.getValue('showEditButton');
          branch.models[0].attributes.showDeleteButton = listController.Tree.getValue('showDeleteButton');
        };

        var setLastSelected = function() {
          var node = $(listController.Tree.treeControlId).fancytree("getActiveNode");
          Cairo.log('listBranch { title: ' + node.title + ' - key: ' + node.key + ' }');
          listController.Tree.lastSelected = {
            type: 'node',
            text: node.title,
            ids: node.key
          };
        };

        var selectLastSearchedRow = function() {
          Cairo.log('selectLastSearchedRow');
          if(listController.Tree.lastItemIdSearched) {
            var search = listController.Tree.lastItemIdSearched;
            listController.Tree.lastItemIdSearched = null;
            var rows = listController.Tree.dataTable.fnFindDataRow(search);
            if(rows.length) {
              listController.Tree.tableTools.fnSelect(rows[0]);
              var ids = Cairo.Tree.List.Controller.getSelectedIds(listController.Tree.tableTools.fnGetSelected());
              var text = Cairo.Tree.List.Controller.getSelectedText(
                listController.Tree.tableTools.fnGetSelected(),
                listController.Tree.dataTable
              );
              Cairo.log("selected: " + ids);
              listController.Tree.lastSelected = {
                type: 'items',
                text: text,
                ids: ids
              };
            }
          }
        };

        $.when(fetchingBranch).done(function(branch) {

          hideColumns(branch);
          setEditControls(branch);
          showItems(branch, itemsListPanel, itemsListLayout, listController);
          setLastSelected();
          selectLastSearchedRow();

        });
      },

      /*
          @branch:            an object that contains the columns definition and the
                              all the leaves in a branch
          @itemsListPanel:    an instance of List.Layout passed by listBranch
          @itemsListLayout:   an instance of List.Panel passed by listBranch
          @listController:    a reference to the table entity manager
      */
      showItems: function(branch, itemsListPanel, itemsListLayout, listController) {
        branch.entityInfo = listController.entityInfo;

        var itemsListView = new List.Items({
          collection: branch
        });

        itemsListLayout.on("show", function() {
          itemsListLayout.panelRegion.reset();
          itemsListLayout.panelRegion.show(itemsListPanel);
          itemsListLayout.itemsRegion.reset();
          itemsListLayout.itemsRegion.show(itemsListView);
        });

        itemsListPanel.on("item:new", function() {
          // TODO: call to controller listController.newItem
        });

        itemsListView.on("itemview:item:edit", function(childView, args) {
          // TODO: call to controller listController.editItem
        });

        itemsListView.on("itemview:item:delete", function(childView, args) {
          // TODO: test how it works
          args.model.destroy();
        });

        listController.Tree.treeListRegion.reset();
        listController.Tree.treeListRegion.show(itemsListLayout);

        var cutOrCopyClicked = function(menuItem, menu, action) {
          Cairo.log("You clicked " + action + "!");
          listController.Tree.tableTools.fnSelect(menu.target);
          var ids = Cairo.Tree.List.Controller.getSelectedIds(listController.Tree.tableTools.fnGetSelected());
          Cairo.log("selected: " + ids);
          Cairo.log("selected length: " + ids.split(",").length);
          listController.Tree.clipboard = {
              action: action,
              leaveIds: ids,
              text: "(items)",
              isBranch: false
          };
        };

        var cutClicked = function(menuItem, menu) {
          cutOrCopyClicked(menuItem, menu, Cairo.Tree.Actions.clipboardActions.ACTION_CUT);
        };

        var copyClicked = function(menuItem, menu) {
          cutOrCopyClicked(menuItem, menu, Cairo.Tree.Actions.clipboardActions.ACTION_COPY);
        };

        var menu = [
          {'Cut': {
              onclick: cutClicked,
              icon:'assets/stylesheets/images/cut.png'
            }
          },
          {'Copy': {
              onclick: copyClicked,
              icon:'assets/stylesheets/images/copy.png'
            }
          },
          $.contextMenu.separator,
          {'Edit': {
              onclick: function(menuItem, menu) { Cairo.log("You clicked edit!"); },
              icon:'assets/stylesheets/images/edit.png'
            }
          },
          {'Delete': {
              onclick: function(menuItem, menu) { Cairo.log("You clicked delete!"); },
              icon:'assets/stylesheets/images/delete.png'
            }
          },
          $.contextMenu.separator,
          {'Export to Spreed Sheet': {
              onclick: function(menuItem, menu) { Cairo.log("You clicked export!"); },
              icon:'assets/stylesheets/images/calculator.png'
            }
          }
        ];

        listController.Tree.dataTableId = Cairo.Tree.getNextControlId();
        listController.Tree.dataTableId$ = "#" + listController.Tree.dataTableId;

        itemsListView.$el.attr("id", listController.Tree.dataTableId);

        var buttons = [];
        var scrollX = false;
        var scrollY = 0;
        var rowSelect = "multi";

        if(!Cairo.isMobile()) {
          buttons = listController.Tree.getValue('showTableButtons') ? [ "select_all", "select_none", "print"] : [];
          scrollX = true;
          scrollY = 350;
          rowSelect = "os";
        }

        var getDataTableDomAttribute = function() {
          var f = listController.Tree.getValue('showFilter') ? 'f' : '';
          return 'T<"clear">l' + f + 'rtip';
        };

        var dom = getDataTableDomAttribute();

        listController.Tree.dataTable = $(listController.Tree.dataTableId$, itemsListLayout.$el).dataTable({
          scrollY: scrollY,
          paging: false,
          scrollX: scrollX,
          "language": {
              "search": "Search in this folder: "
          },
          dom: dom,
          tableTools: {
              "sRowSelect": rowSelect,
              "aButtons": buttons
          },
          fnDrawCallback: function( oSettings ) {
            $(listController.Tree.dataTableId$ + " tbody tr").contextMenu(menu, {theme:'osx'});
          }
        });

        var handleClickOrDoubleClickEvent = function(scope, type) {
          var mustHandleEvent = function() {
            if(type === 'dblclick' && listController.Tree.dblClick) {
              return true;
            }
            else if(type === 'click' && !listController.Tree.dblClick) {
              return true;
            }
            else {
              return false;
            }
          };

          var setSelectedInfo = function(ids, text) {
            Cairo.log("selected: " + ids);
            listController.Tree.lastSelected = {
              type: 'items',
              text: text,
              ids: ids
            };
          };

          if(mustHandleEvent()) {

            // when it is a double click the row is selected and the dialog is closed
            //
            if(listController.Tree.dblClick) {
              listController.Tree.dblClick = false;
              var data = listController.Tree.dataTable.fnGetData(scope);
              Cairo.log('dblclick ' + JSON.stringify(data));
              var ids = $(scope.parentElement).data("id");
              var text = listController.Tree.dataTable.fnGetData(scope.parentElement)[0];
              setSelectedInfo(ids, text);
              listController.Tree.lastSelected.isValid = true;
              listController.Tree.mainView.trigger("dialog:close");
            }
            // for single click we only update the selectInfo
            //
            else {
              var data = listController.Tree.dataTable.fnGetData(scope);
              Cairo.log('click ' + JSON.stringify(data));
              var ids = Cairo.Tree.List.Controller.getSelectedIds(listController.Tree.tableTools.fnGetSelected());
              var text = Cairo.Tree.List.Controller.getSelectedText(
                listController.Tree.tableTools.fnGetSelected(),
                listController.Tree.dataTable
              );
              setSelectedInfo(ids, text);
            }
          }
        }

        listController.Tree.dataTable.on('click', 'tr', function(event) {
          var scope = this;
          setTimeout(function() { handleClickOrDoubleClickEvent(scope, 'click'); }, 300);

        }).on('dblclick', 'td', function(event) {
          listController.Tree.dblClick = true;
          var scope = this;
          setTimeout(function() { handleClickOrDoubleClickEvent(scope, 'dblclick'); }, 300);
        });

        listController.Tree.tableTools = TableTools.fnGetInstance(listController.Tree.dataTableId);

        Cairo.LoadingMessage.close();
      },

      setTreeIntoController: function(listController) {
        if(listController.Tree === undefined) {

          var getValue = function(attribute) {
            // default is true
            attribute = listController.entityInfo.attributes[attribute];
            return attribute === undefined ? true : attribute;
          };

          listController.Tree = { getValue: getValue };

        };

        // this attribute is used in templates so it should be present
        // in entityInfo
        //
        if(listController.entityInfo.attributes.showTableButtons === undefined) {
          listController.entityInfo.attributes.showTableButtons = true;
        }
        if(listController.entityInfo.attributes.showSelectButton === undefined) {
          listController.entityInfo.attributes.showSelectButton = false;
        }
      },

      getSelectedIds: function(selectedItems) {
        var ids = "";
        for(var i=0; i<selectedItems.length; i+=1) {
          if(selectedItems[i]) {
            ids += "," + $(selectedItems[i]).data("id");
          }
        }
        if(ids.length) { ids = ids.substring(1, ids.length); }
        return ids;
      },

      getSelectedText: function(selectedItems, dataTable) {
        var text = "";
        for(var i=0; i<selectedItems.length; i+=1) {
          if(selectedItems[i]) {
            if(text === "") {
              text = dataTable.fnGetData(selectedItems[i])[0];
            }
            else {
              text = "Multi Selection";
              break;
            }
          }
        }
        return text;
      }

    };

  });

}());
