///////////////
// Entities
///////////////

Cairo.module("Entities", function(Entities, Cairo, Backbone, Marionette, $, _){
  Entities.Usuario = Backbone.Model.extend({
    urlRoot: "usuarios",

    defaults: {
      firstName: "",
      lastName: "",
      phoneNumber: ""
    },

    validate: function(attrs, options) {
      var errors = {}
      if (! attrs.firstName) {
        errors.firstName = "can't be blank";
      }
      if (! attrs.lastName) {
        errors.lastName = "can't be blank";
      }
      else{
        if (attrs.lastName.length < 2) {
          errors.lastName = "is too short";
        }
      }
      if( ! _.isEmpty(errors)){
        return errors;
      }
    }
  });

  //Entities.configureStorage(Entities.Usuario);

  Entities.UsuarioCollection = Backbone.Collection.extend({
    url: "/system/users",
    model: Entities.Usuario,
    comparator: "firstName"
  });

  //Entities.configureStorage(Entities.UsuarioCollection);

  var initializeUsuarios = function(){
    usuarios = new Entities.UsuarioCollection([
      { id: 1, firstName: "Alice", lastName: "Arten", phoneNumber: "555-0184" },
      { id: 2, firstName: "Bob", lastName: "Brigham", phoneNumber: "555-0163" },
      { id: 3, firstName: "Charlie", lastName: "Campbell", phoneNumber: "555-0129" }
    ]);
    usuarios.forEach(function(usuario){
      usuario.save();
    });
    return usuarios.models;
  };

  var API = {
    getUsuarioEntities: function(){
      var usuarios = new Entities.UsuarioCollection();
      var defer = $.Deferred();
      usuarios.fetch({
        success: function(data){
          defer.resolve(data);
        }
      });
      var promise = defer.promise();
      $.when(promise).done(function(usuarios){
        if(usuarios.length === 0){
          // if we don't have any usuarios yet, create some for convenience
          var models = initializeUsuarios();
          usuarios.reset(models);
        }
      });
      return promise;
    },

    getUsuarioEntity: function(usuarioId){
      var usuario = new Entities.Usuario({id: usuarioId});
      var defer = $.Deferred();
      setTimeout(function(){
        usuario.fetch({
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

  Cairo.reqres.setHandler("usuario:entities", function(){
    return API.getUsuarioEntities();
  });

  Cairo.reqres.setHandler("usuario:entity", function(id){
    return API.getUsuarioEntity(id);
  });
});

///////////////
// Handler
///////////////

Cairo.module("Usuario", function(Usuario, Cairo, Backbone, Marionette, $, _){});

///////////////
// View
///////////////

Cairo.module("Usuario.Common.Views", function(Views, Cairo, Backbone, Marionette, $, _){
  Views.Form = Marionette.ItemView.extend({
    template: "#usuario-form",

    events: {
      "click button.js-submit": "submitClicked"
    },

    submitClicked: function(e){
      e.preventDefault();
      var data = Backbone.Syphon.serialize(this);
      this.trigger("form:submit", data);
    },

    onFormDataInvalid: function(errors){
      var $view = this.$el;

      var clearFormErrors = function(){
        var $form = $view.find("form");
        $form.find(".help-inline.error").each(function(){
          $(this).remove();
        });
        $form.find(".control-group.error").each(function(){
          $(this).removeClass("error");
        });
      }

      var markErrors = function(value, key){
        var $controlGroup = $view.find("#usuario-" + key).parent();
        var $errorEl = $("<span>", { class: "help-inline error", text: value });
        $controlGroup.append($errorEl).addClass("error");
      }

      clearFormErrors();
      _.each(errors, markErrors);
    }
  });
});

Cairo.module("Usuario.Edit", function(Edit, Cairo, Backbone, Marionette, $, _){
  Edit.Message = Marionette.ItemView.extend({
    template: "#usuario-edit"
  });

  Edit.Usuario = Cairo.Usuario.Common.Views.Form.extend({
    initialize: function(){
      this.title = "Edit " + this.model.get("firstName") + " " + this.model.get("lastName");
    },

    onRender: function(){
      if(this.options.generateTitle){
        var $title = $('<h1>', { text: this.title });
        this.$el.prepend($title);
      }

      this.$(".js-submit").text("Update user");
    }
  });
});

Cairo.module("Usuario.List", function(List, Cairo, Backbone, Marionette, $, _){
  List.Message = Marionette.ItemView.extend({
    template: "#usuario-list"
  });

  List.Layout = Marionette.Layout.extend({
    template: "#usuario-list-layout",

    regions: {
      panelRegion: "#panel-region",
      usuariosRegion: "#usuarios-region"
    }
  });

  List.Panel = Marionette.ItemView.extend({
    template: "#usuario-list-panel",

    triggers: {
      "click button.js-new": "usuario:new"
    },

    events: {
      "submit #filter-form": "filterUsuarios"
    },

    ui: {
      criterion: "input.js-filter-criterion"
    },

    filterUsuarios: function(e){
      e.preventDefault();
      var criterion = this.$(".js-filter-criterion").val();
      this.trigger("usuarios:filter", criterion);
    },

    onSetFilterCriterion: function(criterion){
      this.ui.criterion.val(criterion);
    }
  });

  List.Usuario = Marionette.ItemView.extend({
    tagName: "tr",
    template: "#usuario-list-item",

    triggers: {
      "click td a.js-edit": "usuario:edit",
      "click button.js-delete": "usuario:delete"
    },

    events: {
      "click": "highlightName"
    },

    flash: function(cssClass){
      var $view = this.$el;
      $view.hide().toggleClass(cssClass).fadeIn(800, function(){
        setTimeout(function(){
          $view.toggleClass(cssClass)
        }, 500);
      });
    },

    highlightName: function(e){
      this.$el.toggleClass("warning");
    },

    remove: function(){
      var self = this;
      this.$el.fadeOut(function(){
        Marionette.ItemView.prototype.remove.call(self);
      });
    }
  });

  var NoUsuariosView = Marionette.ItemView.extend({
    template: "#usuario-list-none",
    tagName: "tr",
    className: "alert"
  });

  List.Usuarios = Marionette.CompositeView.extend({
    tagName: "table",
    className: "table table-hover",
    template: "#usuario-list",
    emptyView: NoUsuariosView,
    itemView: List.Usuario,
    itemViewContainer: "tbody",

    initialize: function(){
      this.listenTo(this.collection, "reset", function(){
        this.appendHtml = function(collectionView, itemView, index){
          collectionView.$el.append(itemView.el);
        }
      });
    },

    onCompositeCollectionRendered: function(){
      this.appendHtml = function(collectionView, itemView, index){
        collectionView.$el.prepend(itemView.el);
      }
    }
  });

});

///////////////
// Controller
///////////////

Cairo.module("Usuario.List", function(List, Cairo, Backbone, Marionette, $, _){
  List.Controller = {
    listOld: function(){
      var view = new List.Message();
      Cairo.mainRegion.show(view);
    },

    list: function(criterion){
      var loadingView = new Cairo.Common.Views.Loading();
      Cairo.mainRegion.show(loadingView);

      var fetchingUsuarios = Cairo.request("usuario:entities");

      var usuariosListLayout = new List.Layout();
      var usuariosListPanel = new List.Panel();

      $.when(fetchingUsuarios).done(function(usuarios){
        var filteredUsuarios = Cairo.Entities.FilteredCollection({
          collection: usuarios,
          filterFunction: function(filterCriterion){
            var criterion = filterCriterion.toLowerCase();
            return function(usuario){
              if(usuario.get("firstName").toLowerCase().indexOf(criterion) !== -1
                || usuario.get("lastName").toLowerCase().indexOf(criterion) !== -1
                || usuario.get("phoneNumber").toLowerCase().indexOf(criterion) !== -1){
                  return usuario;
              }
            };
          }
        });

        if(criterion){
          filteredUsuarios.filter(criterion);
          usuariosListPanel.once("show", function(){
            usuariosListPanel.triggerMethod("set:filter:criterion", criterion);
          });
        }

        var usuariosListView = new List.Usuarios({
          collection: filteredUsuarios
        });

        usuariosListPanel.on("usuarios:filter", function(filterCriterion){
          filteredUsuarios.filter(filterCriterion);
          Cairo.trigger("usuarios:filter", filterCriterion);
        });

        usuariosListLayout.on("show", function(){
          usuariosListLayout.panelRegion.show(usuariosListPanel);
          usuariosListLayout.usuariosRegion.show(usuariosListView);
        });

        usuariosListPanel.on("usuario:new", function(){
          var newUsuario = new Cairo.Entities.Usuario();

          var view = new Cairo.Usuario.New.Usuario({
            model: newUsuario
          });

          view.on("form:submit", function(data){
            if(usuarios.length > 0){
              var highestId = usuarios.max(function(c){ return c.id; }).get("id");
              data.id = highestId + 1;
            }
            else{
              data.id = 1;
            }
            if(newUsuario.save(data)){
              usuarios.add(newUsuario);
              view.trigger("dialog:close");
              var newUsuarioView = usuariosListView.children.findByModel(newUsuario);
              // check whether the new usuario view is displayed (it could be
              // invisible due to the current filter criterion)
              if(newUsuarioView){
                newUsuarioView.flash("success");
              }
            }
            else{
              view.triggerMethod("form:data:invalid", newUsuario.validationError);
            }
          });

          Cairo.dialogRegion.show(view);
        });

        usuariosListView.on("itemview:usuario:edit", function(childView, args){
          Cairo.trigger("usuario:edit", args.model.get("id"));
          /*
          var model = args.model;
          var view = new Cairo.Usuario.Edit.Usuario({
            model: model
          });

          view.on("form:submit", function(data){
            if(model.save(data)){
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

        usuariosListView.on("itemview:usuario:delete", function(childView, args){
          args.model.destroy();
        });

        Cairo.mainRegion.show(usuariosListLayout);
      });
    }    
  };
});

Cairo.module("Usuario.Edit", function(Edit, Cairo, Backbone, Marionette, $, _){
  Edit.Controller = {
    editOld: function(){
      var view = new Edit.Message();
      Cairo.mainRegion.show(view);
    },

    edit: function(id){
      var loadingView = new Cairo.Common.Views.Loading({
        title: "Artificial Loading Delay",
        message: "Data loading is delayed to demonstrate using a loading view."
      });
      Cairo.mainRegion.show(loadingView);

      var fetchingUsuario = Cairo.request("usuario:entity", id);
      $.when(fetchingUsuario).done(function(usuario){
        var view;
        if(usuario !== undefined){
          view = new Edit.Usuario({
            model: usuario,
            generateTitle: true
          });

          view.on("form:submit", function(data){
            if(usuario.save(data)){
              Cairo.trigger("usuario:edit", usuario.get("id"));
            }
            else{
              view.triggerMethod("form:data:invalid", usuario.validationError);
            }
          });
        }
        else{
          view = new Cairo.Usuario.Show.MissingUsuario();
        }

        Cairo.mainRegion.show(view);
      });
    }
  };
});

