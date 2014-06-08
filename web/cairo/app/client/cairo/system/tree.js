///////////////
// Entities
///////////////

Cairo.module("Entities", function(Entities, Cairo, Backbone, Marionette, $, _) {
  Entities.Tree = Backbone.Model.extend({
    urlRoot: "/system/tree",

    defaults: {
      name: ""
    },

    validate: function(attrs, options) {
      var errors = {}
      if (! attrs.name) {
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
      var errors = {}
      if (attrs.clientId === 0) {
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
      setTimeout(function() {
        tree.fetch({
          success: function(data) {
            defer.resolve(data);
          },
          error: function(data) {
            defer.resolve(undefined);
          }
        });
      }, 2000);
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

Cairo.module("Tree", function(Tree, Cairo, Backbone, Marionette, $, _) {});

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
        var template = _.template($("#tree-item-template").html());
        var el = $(this.el);
        this.collection.each(function(model) {
            var html = template(model.toJSON());
            el.append(html);
        });
        try {
            var treeId = this.collection.first().get("id");
            Cairo.Tree.List.Controller.listTree(treeId, this.listController);
        }
        catch (e) {
        }
    }
  });

  List.Items = Backbone.View.extend({
    tagName: "select",
    className: "form-control tree-select",
    events: {
        "change": "clicked"
    },

    clicked: function(e) {
        e.preventDefault();
        var treeId = $(e.currentTarget).val();
        Cairo.Tree.List.Controller.listTree(treeId);
    },

    render: function() {
        var template = _.template($("#tree-list-template").html());
        var el = $(this.el);
        this.collection.each(function(model) {
            var html = template(model.toJSON());
            el.append(html);
        });
        try {
            var treeId = this.collection.first().get("id");
            Cairo.Tree.List.Controller.listTree(treeId, this.listController);
        }
        catch (e) {
        }
    }
  });

});

///////////////
// Controller
///////////////

Cairo.module("Tree.List", function(List, Cairo, Backbone, Marionette, $, _) {
  List.Controller = {
    listTree: function(treeId, listController) {
      var loadingView = new Cairo.Common.Views.Loading();
      Cairo.loadingRegion.show(loadingView);

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
        Cairo.loadingRegion.close();
      });
    },

    list: function(tableId, mainView, listController) {
      var loadingView = new Cairo.Common.Views.Loading();
      Cairo.loadingRegion.show(loadingView);

      var fetchingTrees = Cairo.request("tree:entities", tableId);

      $.when(fetchingTrees).done(function(trees) {
        var view = new List.Tree({collection: trees});
        view.listController = listController;
        view.render();
        $("#trees", mainView.$el).html(view.el);
      });
    },

    listBranch: function(branchId, showItem, listController) {
      var loadingView = new Cairo.Common.Views.Loading();
      Cairo.loadingRegion.show(loadingView);

      var fetchingBranch = Cairo.request("branch:entity", branchId);

      $.when(fetchingBranch).done(function(branch) {
        showItem(branch, new List.Items({collection: branch}), listController);
      });
    },
    
    showItem: function(branch, view, listController) {
      view.listController = listController;
      view.render();
      $("#items").html(view.el);
    }

  };
});