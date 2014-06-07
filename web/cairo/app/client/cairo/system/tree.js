///////////////
// Entities
///////////////

Cairo.module("Entities", function(Entities, Cairo, Backbone, Marionette, $, _){
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
      if( ! _.isEmpty(errors)){
        return errors;
      }
    }
  });

  Entities.TreeCollection = Backbone.Collection.extend({
    url: function () {
            return '/system/trees/' + this.tableId;
         },
    model: Entities.Tree,
    comparator: "name",
    tableId: 0
  });

  var API = {
    getTreeEntities: function(tableId){
      var trees = new Entities.TreeCollection();
      trees.tableId = tableId;
      var defer = $.Deferred();
      trees.fetch({
        success: function(data){
          defer.resolve(data);
        }
      });
      var promise = defer.promise();
      $.when(promise).done(function(trees){ });
      return promise;
    },

    getTreeEntity: function(treeId){
      var tree = new Entities.Tree({id: treeId});
      var defer = $.Deferred();
      setTimeout(function(){
        tree.fetch({
          success: function(data){
            defer.resolve(data);
          },
          error: function(data){
            defer.resolve(undefined);
          }
        });
      }, 2000);
      return defer.promise();
    }
  };

  Cairo.reqres.setHandler("tree:entities", function(tableId){
    return API.getTreeEntities(tableId);
  });

  Cairo.reqres.setHandler("tree:entity", function(treeId){
    return API.getTreeEntity(treeId);
  });
});

///////////////
// Handler
///////////////

Cairo.module("Tree", function(Tree, Cairo, Backbone, Marionette, $, _){});

///////////////
// Views
///////////////

Cairo.module("Tree.List", function(List, Cairo, Backbone, Marionette, $, _){
  List.View = Backbone.View.extend({
    tagName: "select",
    className: "form-control tree-select",
    events: {
        "change": "clicked"
    },

    clicked: function(e){
        e.preventDefault();
        var treeId = $(e.currentTarget).val();
        Cairo.Tree.List.Controller.listTree(treeId);
    },

    render: function(){
        var template = _.template($("#tree-item-template").html());
        var el = $(this.el);
        this.collection.each(function(model){
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

Cairo.module("Tree.List", function(List, Cairo, Backbone, Marionette, $, _){
  List.Controller = {
    listTree: function(treeId, listController){
      var loadingView = new Cairo.Common.Views.Loading();
      Cairo.loadingRegion.show(loadingView);

      var fetchingTrees = Cairo.request("tree:entity", treeId);

      $.when(fetchingTrees).done(function(trees){
        try {
            $("#tree").fancytree("destroy");
        }
        catch (e) {}
        $("#tree").fancytree({
            source: [trees.attributes[0]],
            activate: function(event, data) {
                        Cairo.logTreeEvent(event, data);
                        listController.showNode(data.node.key)
                      }
        });
        Cairo.loadingRegion.close();
      });
    },

    list: function(tableId, mainView, listController){
      var loadingView = new Cairo.Common.Views.Loading();
      Cairo.loadingRegion.show(loadingView);

      var fetchingTrees = Cairo.request("tree:entities", tableId);

      $.when(fetchingTrees).done(function(trees){
        var view = new List.View({collection: trees});
        view.listController = listController
        view.render();
        $("#trees", mainView.$el).html(view.el);
      });
    }

  };
});