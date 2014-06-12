///////////////
// Entities
///////////////

Cairo.module("Entities", function(Entities, Cairo, Backbone, Marionette, $, _) {
  Entities.Rol = Backbone.Model.extend({
    urlRoot: "/system/role",

    defaults: {
      name: ""
    },

    validate: function(attrs, options) {
      var errors = {}
      if(! attrs.name) {
        errors.name = "can't be blank";
      }
      if( ! _.isEmpty(errors)) {
        return errors;
      }
    }
  });

  Entities.RolCollection = Backbone.Collection.extend({
    url: "/system/roles",
    model: Entities.Rol,
    comparator: "name"
  });

  var API = {
    getRolEntities: function() {
      var roles = new Entities.RolCollection();
      var defer = $.Deferred();
      roles.fetch({
        success: function(data) {
          defer.resolve(data);
        }
      });
      var promise = defer.promise();
      $.when(promise).done(function(roles) { });
      return promise;
    },

    getRolEntity: function(rolId) {
      var rol = new Entities.Rol({id: rolId});
      var defer = $.Deferred();
      rol.fetch({
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

  Cairo.reqres.setHandler("rol:entities", function() {
    return API.getRolEntities();
  });

  Cairo.reqres.setHandler("rol:entity", function(id) {
    return API.getRolEntity(id);
  });
});

///////////////
// Handler
///////////////

Cairo.module("Rol", function(Rol, Cairo, Backbone, Marionette, $, _) {});

///////////////
// View
///////////////

Cairo.module("Rol.Common.Views", function(Views, Cairo, Backbone, Marionette, $, _) {
  Views.Form = Marionette.ItemView.extend({
    template: "#rol-form",

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
        var $controlGroup = $view.find("#rol-" + key).parent();
        var $errorEl = $("<span>", { class: "help-inline error", text: value });
        $controlGroup.append($errorEl).addClass("error");
      }

      clearFormErrors();
      _.each(errors, markErrors);
    }
  });
});

Cairo.module("Rol.Edit", function(Edit, Cairo, Backbone, Marionette, $, _) {
  Edit.Message = Marionette.ItemView.extend({
    template: "#rol-edit"
  });

  Edit.Rol = Cairo.Rol.Common.Views.Form.extend({
    initialize: function() {
      this.title = "Edit " + this.model.get("name");
    },

    onRender: function() {
      if(this.options.generateTitle) {
        var $title = $('<h1>', { text: this.title });
        this.$el.prepend($title);
      }

      this.$(".js-submit").text("Update role");
    }
  });
});

///////////////
// Controller
///////////////

Cairo.module("Rol.List", function(List, Cairo, Backbone, Marionette, $, _) {
  List.Controller = {
    list: function(criterion) {

      var self = this;

      this.entityInfo = new Backbone.Model({
        entitiesTitle: "Roles",
        entityName: "rol",
        entitiesName: "roles"
      });

      this.showBranch = function(branchId) {
        Cairo.log("Loading nodeId: " + branchId);
        Cairo.Tree.List.Controller.listBranch(branchId, criterion, Cairo.Tree.List.Controller.showItem, self)
      };

      Cairo.LoadingMessage.show("Roles", "Loading roles from Crowsoft Cairo server.");

      var rolesListLayout = new Cairo.Tree.List.TreeLayout({ model: this.entityInfo });
      Cairo.mainRegion.show(rolesListLayout);

      Cairo.Tree.List.Controller.list(Cairo.Tables.ROL, rolesListLayout, self);

    }
  };
});

Cairo.module("Rol.Edit", function(Edit, Cairo, Backbone, Marionette, $, _) {
  Edit.Controller = {
    edit: function(id) {
      Cairo.LoadingMessage.show("Rol", "Loading rol from Crowsoft Cairo server.");

      var fetchingRol = Cairo.request("rol:entity", id);
      $.when(fetchingRol).done(function(rol) {
        var view;
        if(rol !== undefined) {
          view = new Edit.Rol({
            model: rol,
            generateTitle: true
          });

          view.on("form:submit", function(data) {
            if(rol.save(data)) {
              Cairo.trigger("rol:edit", rol.get("id"));
            }
            else{
              view.triggerMethod("form:data:invalid", rol.validationError);
            }
          });
        }
        else{
          view = new Cairo.Rol.Show.MissingRol();
        }

        Cairo.mainRegion.show(view);
        Cairo.LoadingMessage.close();
      });
    }
  };
});

