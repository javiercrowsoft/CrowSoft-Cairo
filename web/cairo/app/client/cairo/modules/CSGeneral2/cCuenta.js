///////////////
// Entities
///////////////

Cairo.module("Entities", function(Entities, Cairo, Backbone, Marionette, $, _) {
  Entities.Cuenta = Backbone.Model.extend({
    urlRoot: "/general/cuenta",

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

  Entities.CuentaCollection = Backbone.Collection.extend({
    url: "/general/cuentas",
    model: Entities.Cuenta,
    comparator: "name"
  });

  var API = {
    getCuentaEntities: function() {
      var cuentas = new Entities.CuentaCollection();
      var defer = $.Deferred();
      cuentas.fetch({
        success: function(data) {
          defer.resolve(data);
        }
      });
      var promise = defer.promise();
      $.when(promise).done(function(cuentas) { });
      return promise;
    },

    getCuentaEntity: function(cuentaId) {
      var cuenta = new Entities.Cuenta({id: cuentaId});
      var defer = $.Deferred();
      cuenta.fetch({
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

  Cairo.reqres.setHandler("cuenta:entities", function() {
    return API.getCuentaEntities();
  });

  Cairo.reqres.setHandler("cuenta:entity", function(id) {
    return API.getCuentaEntity(id);
  });
});

///////////////
// Handler
///////////////

Cairo.module("Cuenta", function(Cuenta, Cairo, Backbone, Marionette, $, _) {});

///////////////
// View
///////////////

Cairo.module("Cuenta.Common.Views", function(Views, Cairo, Backbone, Marionette, $, _) {
  Views.Form = Marionette.ItemView.extend({
    template: "#cuenta-form",

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
        var $controlGroup = $view.find("#cuenta-" + key).parent();
        var $errorEl = $("<span>", { class: "help-inline error", text: value });
        $controlGroup.append($errorEl).addClass("error");
      }

      clearFormErrors();
      _.each(errors, markErrors);
    }
  });
});

Cairo.module("Cuenta.Edit", function(Edit, Cairo, Backbone, Marionette, $, _) {
  Edit.Message = Marionette.ItemView.extend({
    template: "#cuenta-edit"
  });

  Edit.Cuenta = Cairo.Cuenta.Common.Views.Form.extend({
    initialize: function() {
      this.title = "Edit " + this.model.get("name");
    },

    onRender: function() {
      if(this.options.generateTitle) {
        var $title = $('<h1>', { text: this.title });
        this.$el.prepend($title);
      }

      this.$(".js-submit").text("Update cuenta");
    }
  });
});

///////////////
// Controller
///////////////

Cairo.module("Cuenta.List", function(List, Cairo, Backbone, Marionette, $, _) {
  List.Controller = {
    list: function() {

      var self = this;

      /*
          this function will be called by the tab manager every time the
          view must be created. when the tab is not visible the tab manager
          will not call this function but only make the tab visible
      */
      var createTreeDialog = function(tabId) {

        // ListController properties and methods
        //
        self.entityInfo = new Backbone.Model({
          entitiesTitle: "Cuentas",
          entityName: "cuenta",
          entitiesName: "cuentas"
        });

        self.showBranch = function(branchId) {
          Cairo.log("Loading nodeId: " + branchId);
          Cairo.Tree.List.Controller.listBranch(branchId, Cairo.Tree.List.Controller.showItems, self)
        };

        // progress message
        //
        Cairo.LoadingMessage.show("Cuentas", "Loading cuentas from Crowsoft Cairo server.");

        // create the tree region
        //
        Cairo.addRegions({ cuentaTreeRegion: tabId });

        // create the dialog
        //
        Cairo.Tree.List.Controller.list(
          Cairo.Tables.CUENTA,
          new Cairo.Tree.List.TreeLayout({ model: self.entityInfo }),
          Cairo.cuentaTreeRegion,
          self);

      };

      // create the tab
      //
      Cairo.mainTab.showTab("Cuentas", "cuentaTreeRegion", "#general/cuentas", createTreeDialog);

    }
  };
});

Cairo.module("Cuenta.Edit", function(Edit, Cairo, Backbone, Marionette, $, _) {
  Edit.Controller = {
    edit: function(id) {
      Cairo.LoadingMessage.show("Cuenta", "Loading cuenta from Crowsoft Cairo server.");

      var fetchingCuenta = Cairo.request("cuenta:entity", id);
      $.when(fetchingCuenta).done(function(cuenta) {
        var view;
        if(cuenta !== undefined) {
          view = new Edit.Cuenta({
            model: cuenta,
            generateTitle: true
          });

          view.on("form:submit", function(data) {
            if(cuenta.save(data)) {
              Cairo.trigger("cuenta:edit", cuenta.get("id"));
            }
            else{
              view.triggerMethod("form:data:invalid", cuenta.validationError);
            }
          });
        }
        else{
          view = new Cairo.Cuenta.Show.MissingCuenta();
        }

        Cairo.mainRegion.show(view);
        Cairo.LoadingMessage.close();
      });
    }
  };
});


/*

Cuenta
Cuentas
cuenta
cuentas
CUENTA

*/
