///////////////
// Entities
///////////////

Cairo.module("Entities", function(Entities, Cairo, Backbone, Marionette, $, _) {
  Entities.Producto = Backbone.Model.extend({
    urlRoot: "/general/producto",

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

  Entities.ProductoCollection = Backbone.Collection.extend({
    url: "/general/productos",
    model: Entities.Producto,
    comparator: "name"
  });

  var API = {
    getProductoEntities: function() {
      var productos = new Entities.ProductoCollection();
      var defer = $.Deferred();
      productos.fetch({
        success: function(data) {
          defer.resolve(data);
        }
      });
      var promise = defer.promise();
      $.when(promise).done(function(productos) { });
      return promise;
    },

    getProductoEntity: function(productoId) {
      var producto = new Entities.Producto({id: productoId});
      var defer = $.Deferred();
      producto.fetch({
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

  Cairo.reqres.setHandler("producto:entities", function() {
    return API.getProductoEntities();
  });

  Cairo.reqres.setHandler("producto:entity", function(id) {
    return API.getProductoEntity(id);
  });
});

///////////////
// Handler
///////////////

Cairo.module("Producto", function(Producto, Cairo, Backbone, Marionette, $, _) {});

///////////////
// View
///////////////

Cairo.module("Producto.Common.Views", function(Views, Cairo, Backbone, Marionette, $, _) {
  Views.Form = Marionette.ItemView.extend({
    template: "#producto-form",

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
        var $controlGroup = $view.find("#producto-" + key).parent();
        var $errorEl = $("<span>", { class: "help-inline error", text: value });
        $controlGroup.append($errorEl).addClass("error");
      }

      clearFormErrors();
      _.each(errors, markErrors);
    }
  });
});

Cairo.module("Producto.Edit", function(Edit, Cairo, Backbone, Marionette, $, _) {
  Edit.Message = Marionette.ItemView.extend({
    template: "#producto-edit"
  });

  Edit.Producto = Cairo.Producto.Common.Views.Form.extend({
    initialize: function() {
      this.title = "Edit " + this.model.get("name");
    },

    onRender: function() {
      if(this.options.generateTitle) {
        var $title = $('<h1>', { text: this.title });
        this.$el.prepend($title);
      }

      this.$(".js-submit").text("Update producto");
    }
  });
});

///////////////
// Controller
///////////////

Cairo.module("Producto.List", function(List, Cairo, Backbone, Marionette, $, _) {
  List.Controller = {
    list: function(criterion) {

      var self = this;

      this.entityInfo = new Backbone.Model({
        entitiesTitle: "Productos",
        entityName: "producto",
        entitiesName: "productos"
      });

      this.showBranch = function(branchId) {
        Cairo.log("Loading nodeId: " + branchId);
        Cairo.Tree.List.Controller.listBranch(branchId, criterion, Cairo.Tree.List.Controller.showItem, self)
      };

      Cairo.LoadingMessage.show("Productos", "Loading productos from Crowsoft Cairo server.");

      var productosListLayout = new Cairo.Tree.List.TreeLayout({ model: this.entityInfo });
      //Cairo.mainRegion.show(productosListLayout);
      Cairo.mainTab.addOrShowTab("Productos", "productoList", "#general/productos");
      Cairo.productoList.show(productosListLayout);
      Cairo.Tree.List.Controller.list(Cairo.Tables.PRODUCTO, productosListLayout, self);

    }
  };
});

Cairo.module("Producto.Edit", function(Edit, Cairo, Backbone, Marionette, $, _) {
  Edit.Controller = {
    edit: function(id) {
      Cairo.LoadingMessage.show("Producto", "Loading producto from Crowsoft Cairo server.");

      var fetchingProducto = Cairo.request("producto:entity", id);
      $.when(fetchingProducto).done(function(producto) {
        var view;
        if(producto !== undefined) {
          view = new Edit.Producto({
            model: producto,
            generateTitle: true
          });

          view.on("form:submit", function(data) {
            if(producto.save(data)) {
              Cairo.trigger("producto:edit", producto.get("id"));
            }
            else{
              view.triggerMethod("form:data:invalid", producto.validationError);
            }
          });
        }
        else{
          view = new Cairo.Producto.Show.MissingProducto();
        }

        Cairo.mainRegion.show(view);
        Cairo.LoadingMessage.close();
      });
    }
  };
});
