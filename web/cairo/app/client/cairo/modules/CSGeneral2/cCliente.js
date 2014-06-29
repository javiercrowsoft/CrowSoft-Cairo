///////////////
// Entities
///////////////

Cairo.module("Entities", function(Entities, Cairo, Backbone, Marionette, $, _) {
  Entities.Cliente = Backbone.Model.extend({
    urlRoot: "/general/cliente",

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

  Entities.ClienteCollection = Backbone.Collection.extend({
    url: "/general/clientes",
    model: Entities.Cliente,
    comparator: "name"
  });

  var API = {
    getClienteEntities: function() {
      var clientes = new Entities.ClienteCollection();
      var defer = $.Deferred();
      clientes.fetch({
        success: function(data) {
          defer.resolve(data);
        }
      });
      var promise = defer.promise();
      $.when(promise).done(function(clientes) { });
      return promise;
    },

    getClienteEntity: function(clienteId) {
      var cliente = new Entities.Cliente({id: clienteId});
      var defer = $.Deferred();
      cliente.fetch({
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

  Cairo.reqres.setHandler("cliente:entities", function() {
    return API.getClienteEntities();
  });

  Cairo.reqres.setHandler("cliente:entity", function(id) {
    return API.getClienteEntity(id);
  });
});

///////////////
// Handler
///////////////

Cairo.module("Cliente", function(Cliente, Cairo, Backbone, Marionette, $, _) {});

///////////////
// View
///////////////

Cairo.module("Cliente.Common.Views", function(Views, Cairo, Backbone, Marionette, $, _) {
  Views.Form = Marionette.ItemView.extend({
    template: "#cliente-form",

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
        var $controlGroup = $view.find("#cliente-" + key).parent();
        var $errorEl = $("<span>", { class: "help-inline error", text: value });
        $controlGroup.append($errorEl).addClass("error");
      }

      clearFormErrors();
      _.each(errors, markErrors);
    }
  });
});

Cairo.module("Cliente.Edit", function(Edit, Cairo, Backbone, Marionette, $, _) {
  Edit.Message = Marionette.ItemView.extend({
    template: "#cliente-edit"
  });

  Edit.Cliente = Cairo.Cliente.Common.Views.Form.extend({
    initialize: function() {
      this.title = "Edit " + this.model.get("name");
    },

    onRender: function() {
      if(this.options.generateTitle) {
        var $title = $('<h1>', { text: this.title });
        this.$el.prepend($title);
      }

      this.$(".js-submit").text("Update cliente");
    }
  });
});

///////////////
// Controller
///////////////

Cairo.module("Cliente.List", function(List, Cairo, Backbone, Marionette, $, _) {
  List.Controller = {
    list: function(criterion) {

      var self = this;

      this.entityInfo = new Backbone.Model({
        entitiesTitle: "Clientes",
        entityName: "cliente",
        entitiesName: "clientes"
      });

      this.showBranch = function(branchId) {
        Cairo.log("Loading nodeId: " + branchId);
        Cairo.Tree.List.Controller.listBranch(branchId, criterion, Cairo.Tree.List.Controller.showItem, self)
      };

      Cairo.LoadingMessage.show("Clientes", "Loading clientes from Crowsoft Cairo server.");

      var clientesListLayout = new Cairo.Tree.List.TreeLayout({ model: this.entityInfo });
      //Cairo.mainRegion.show(clientesListLayout);
      Cairo.mainTab.addOrShowTab("Clientes", "clienteList", "#general/clientes");
      Cairo.clienteList.show(clientesListLayout);
      Cairo.Tree.List.Controller.list(Cairo.Tables.CLIENTE, clientesListLayout, self);

    }
  };
});

Cairo.module("Cliente.Edit", function(Edit, Cairo, Backbone, Marionette, $, _) {
  Edit.Controller = {
    edit: function(id) {
      Cairo.LoadingMessage.show("Cliente", "Loading cliente from Crowsoft Cairo server.");

      var fetchingCliente = Cairo.request("cliente:entity", id);
      $.when(fetchingCliente).done(function(cliente) {
        var view;
        if(cliente !== undefined) {
          view = new Edit.Cliente({
            model: cliente,
            generateTitle: true
          });

          view.on("form:submit", function(data) {
            if(cliente.save(data)) {
              Cairo.trigger("cliente:edit", cliente.get("id"));
            }
            else{
              view.triggerMethod("form:data:invalid", cliente.validationError);
            }
          });
        }
        else{
          view = new Cairo.Cliente.Show.MissingCliente();
        }

        Cairo.mainRegion.show(view);
        Cairo.LoadingMessage.close();
      });
    }
  };
});


/*

Clientes
Cliente
clientes
cliente
CLIENTE

*/
