///////////////
// Entities
///////////////

Cairo.module("Entities", function(Entities, Cairo, Backbone, Marionette, $, _) {
  Entities.Documento = Backbone.Model.extend({
    urlRoot: "/documento/documento",

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

  Entities.DocumentoCollection = Backbone.Collection.extend({
    url: "/documento/documentos",
    model: Entities.Documento,
    comparator: "name"
  });

  var API = {
    getDocumentoEntities: function() {
      var documentos = new Entities.DocumentoCollection();
      var defer = $.Deferred();
      documentos.fetch({
        success: function(data) {
          defer.resolve(data);
        }
      });
      var promise = defer.promise();
      $.when(promise).done(function(documentos) { });
      return promise;
    },

    getDocumentoEntity: function(documentoId) {
      var documento = new Entities.Documento({id: documentoId});
      var defer = $.Deferred();
      documento.fetch({
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

  Cairo.reqres.setHandler("documento:entities", function() {
    return API.getDocumentoEntities();
  });

  Cairo.reqres.setHandler("documento:entity", function(id) {
    return API.getDocumentoEntity(id);
  });
});

///////////////
// Handler
///////////////

Cairo.module("Documento", function(Documento, Cairo, Backbone, Marionette, $, _) {});

///////////////
// View
///////////////

Cairo.module("Documento.Common.Views", function(Views, Cairo, Backbone, Marionette, $, _) {
  Views.Form = Marionette.ItemView.extend({
    template: "#documento-form",

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
        var $controlGroup = $view.find("#documento-" + key).parent();
        var $errorEl = $("<span>", { class: "help-inline error", text: value });
        $controlGroup.append($errorEl).addClass("error");
      }

      clearFormErrors();
      _.each(errors, markErrors);
    }
  });
});

Cairo.module("Documento.Edit", function(Edit, Cairo, Backbone, Marionette, $, _) {
  Edit.Message = Marionette.ItemView.extend({
    template: "#documento-edit"
  });

  Edit.Documento = Cairo.Documento.Common.Views.Form.extend({
    initialize: function() {
      this.title = "Edit " + this.model.get("name");
    },

    onRender: function() {
      if(this.options.generateTitle) {
        var $title = $('<h1>', { text: this.title });
        this.$el.prepend($title);
      }

      this.$(".js-submit").text("Update documento");
    }
  });
});

///////////////
// Controller
///////////////

Cairo.module("Documento.List", function(List, Cairo, Backbone, Marionette, $, _) {
  List.Controller = {
    list: function(criterion) {

      var self = this;

      var createTreeDialog = function(tabId) {

        // ListController properties and methods
        //
        self.entityInfo = new Backbone.Model({
          entitiesTitle: "Documentos",
          entityName: "documento",
          entitiesName: "documentos"
        });

        self.showBranch = function(branchId) {
          Cairo.log("Loading nodeId: " + branchId);
          Cairo.Tree.List.Controller.listBranch(branchId, criterion, Cairo.Tree.List.Controller.showItem, self)
        };

        // progress message
        //
        Cairo.LoadingMessage.show("Documentos", "Loading documentos from Crowsoft Cairo server.");

        // create the tree region
        //
        Cairo.addRegions({ documentoTreeRegion: tabId });

        // create the dialog
        //
        /*
        var documentosListLayout = new Cairo.Tree.List.TreeLayout({ model: self.entityInfo });
        Cairo.documentoTreeRegion.show(documentosListLayout);

        var regionId = "tree-main-list-region_" + Cairo.Tree.getNextControlId();
        $("#tree-main-list-region").attr("id", regionId);

        // create the list region
        //
        Cairo.addRegions({ documentoTreeListRegion: "#" + regionId });

        self.Tree = { treeListRegion : Cairo.documentoTreeListRegion };

        Cairo.Tree.List.Controller.list(Cairo.Tables.DOCUMENTO, documentosListLayout, self);
        */
        Cairo.Tree.List.Controller.list(
          Cairo.Tables.DOCUMENTO,
          new Cairo.Tree.List.TreeLayout({ model: self.entityInfo }),
          Cairo.documentoTreeRegion,
          self);
      };

      // create the tab
      //
      Cairo.mainTab.showTab("Documentos", "documentoTreeRegion", "#documento/documentos", createTreeDialog);

    }
  };
});

Cairo.module("Documento.Edit", function(Edit, Cairo, Backbone, Marionette, $, _) {
  Edit.Controller = {
    edit: function(id) {
      Cairo.LoadingMessage.show("Documento", "Loading documento from Crowsoft Cairo server.");

      var fetchingDocumento = Cairo.request("documento:entity", id);
      $.when(fetchingDocumento).done(function(documento) {
        var view;
        if(documento !== undefined) {
          view = new Edit.Documento({
            model: documento,
            generateTitle: true
          });

          view.on("form:submit", function(data) {
            if(documento.save(data)) {
              Cairo.trigger("documento:edit", documento.get("id"));
            }
            else{
              view.triggerMethod("form:data:invalid", documento.validationError);
            }
          });
        }
        else{
          view = new Cairo.Documento.Show.MissingDocumento();
        }

        Cairo.mainRegion.show(view);
        Cairo.LoadingMessage.close();
      });
    }
  };
});


/*

Documento
Documentos
documento
documentos
DOCUMENTO

*/
