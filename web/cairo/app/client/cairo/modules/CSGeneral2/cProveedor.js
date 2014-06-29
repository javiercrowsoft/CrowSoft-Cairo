///////////////
// Entities
///////////////

Cairo.module("Entities", function(Entities, Cairo, Backbone, Marionette, $, _) {
  Entities.Proveedor = Backbone.Model.extend({
    urlRoot: "/general/proveedor",

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

  Entities.ProveedorCollection = Backbone.Collection.extend({
    url: "/general/proveedores",
    model: Entities.Proveedor,
    comparator: "name"
  });

  var API = {
    getProveedorEntities: function() {
      var proveedores = new Entities.ProveedorCollection();
      var defer = $.Deferred();
      proveedores.fetch({
        success: function(data) {
          defer.resolve(data);
        }
      });
      var promise = defer.promise();
      $.when(promise).done(function(proveedores) { });
      return promise;
    },

    getProveedorEntity: function(proveedorId) {
      var proveedor = new Entities.Proveedor({id: proveedorId});
      var defer = $.Deferred();
      proveedor.fetch({
        success: function(data) {
          defer.resolve(data);
        },
        error: function(data) {
          defer.resolve(undefined);
        }
      });
      return defer.promise();
    }
  };

  Cairo.reqres.setHandler("proveedor:entities", function() {
    return API.getProveedorEntities();
  });

  Cairo.reqres.setHandler("proveedor:entity", function(id) {
    return API.getProveedorEntity(id);
  });
});

///////////////
// Handler
///////////////

Cairo.module("Proveedor", function(Proveedor, Cairo, Backbone, Marionette, $, _) {});

///////////////
// View
///////////////

Cairo.module("Proveedor.Common.Views", function(Views, Cairo, Backbone, Marionette, $, _) {
  Views.Form = Marionette.ItemView.extend({
    template: "#proveedor-form",

    events: {
      "click button.js-submit": "submitClicked"
    },

    submitClicked: function(e) {
      e.preventDefault();
      var data = Backbone.Syphon.serialize(this);
      this.trigger("form:submit", data);
    },

    onFormDataInvalid: function(errors) {
      var $view = this.$el;

      var clearFormErrors = function() {
        var $form = $view.find("form");
        $form.find(".help-inline.error").each(function() {
          $(this).remove();
        });
        $form.find(".control-group.error").each(function() {
          $(this).removeClass("error");
        });
      }

      var markErrors = function(value, key) {
        var $controlGroup = $view.find("#proveedor-" + key).parent();
        var $errorEl = $("<span>", { class: "help-inline error", text: value });
        $controlGroup.append($errorEl).addClass("error");
      }

      clearFormErrors();
      _.each(errors, markErrors);
    }
  });
});

Cairo.module("Proveedor.Edit", function(Edit, Cairo, Backbone, Marionette, $, _) {
  Edit.Message = Marionette.ItemView.extend({
    template: "#proveedor-edit"
  });

  Edit.Proveedor = Cairo.Proveedor.Common.Views.Form.extend({
    initialize: function() {
      this.title = "Edit " + this.model.get("name");
    },

    onRender: function() {
      if(this.options.generateTitle) {
        var $title = $('<h1>', { text: this.title });
        this.$el.prepend($title);
      }

      this.$(".js-submit").text("Update proveedor");
    }
  });
});

///////////////
// Controller
///////////////

Cairo.module("Proveedor.List", function(List, Cairo, Backbone, Marionette, $, _) {
  List.Controller = {
    list: function(criterion) {

      var self = this;

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
          Cairo.Tree.List.Controller.listBranch(branchId, criterion, Cairo.Tree.List.Controller.showItem, self)
        };

        self.updateTreeListRegion = function(regionId) {
          Cairo.addRegions({ cuentaTreeListRegion: regionId });
          self.Tree.treeListRegion = Cairo.cuentaTreeListRegion;
        };
        // progress message
        //
        Cairo.LoadingMessage.show("Proveedores", "Loading proveedores from Crowsoft Cairo server.");

        // create the tree region
        //
        Cairo.addRegions({ proveedorTreeRegion: tabId });

        // create the dialog
        //
        var proveedoresListLayout = new Cairo.Tree.List.TreeLayout({ model: self.entityInfo });
        Cairo.proveedorTreeRegion.show(proveedoresListLayout);

        // create the list region
        //
        Cairo.addRegions({ proveedorTreeListRegion: "#tree-main-list-region" });

        self.Tree = { treeListRegion : Cairo.proveedorTreeListRegion };

        Cairo.Tree.List.Controller.list(Cairo.Tables.PROVEEDOR, proveedoresListLayout, self);

      };

      // create the tab
      //
      Cairo.mainTab.showTab("Proveedores", "proveedorTreeRegion", "#general/proveedores", createTreeDialog);

    }
  };
});

Cairo.module("Proveedor.Edit", function(Edit, Cairo, Backbone, Marionette, $, _) {
  Edit.Controller = {
    edit: function(id) {
      Cairo.LoadingMessage.show("Proveedor", "Loading proveedor from Crowsoft Cairo server.");

      var fetchingProveedor = Cairo.request("proveedor:entity", id);
      $.when(fetchingProveedor).done(function(proveedor) {
        var view;
        if(proveedor !== undefined) {
          view = new Edit.Proveedor({
            model: proveedor,
            generateTitle: true
          });

          view.on("form:submit", function(data) {
            if(proveedor.save(data)) {
              Cairo.trigger("proveedor:edit", proveedor.get("id"));
            }
            else{
              view.triggerMethod("form:data:invalid", proveedor.validationError);
            }
          });
        }
        else{
          view = new Cairo.Proveedor.Show.MissingProveedor();
        }

        Cairo.mainRegion.show(view);
        Cairo.LoadingMessage.close();
      });
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
