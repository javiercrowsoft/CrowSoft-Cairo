(function() {
  "use strict";

  Cairo.ProductoSerieRange = {

    createObject: function () {

      var self = {};

      var Dialogs = Cairo.Dialogs;
      var getText = Cairo.Language.getText;
      var valEmpty = Cairo.Util.valEmpty;
      var Types = Cairo.Constants.Types;
      var M = Cairo.Modal;
      var P = Cairo.Promises;

      var C_MODULE = "cProductoSerieRange";

      var C_FIRST = "first";
      var C_LAST = "last";
      var C_BY_CHAR = "bByChar";

      var K_FIRST = 2;
      var K_LAST = 5;

      var m_last = "";
      var m_first = "";
      var m_byChar = 0;

      var m_dialog;

      self.getFirst = function () {
        return m_first;
      };

      self.getByChar = function () {
        return m_byChar;
      };

      self.getLast = function () {
        return m_last;
      };

      self.edit = function () {
        var p = null;

        try {

          m_dialog = Cairo.Dialogs.Views.Controller.newDialog();
          m_dialog.setOkCancelDialog(true);
          m_dialog.setNoAskForSave(true);
          m_dialog.setInModalWindow(true);

          p = loadCollection().then(function () {
            return m_dialog.getOkCancelDialogResult();
          });
        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, ex, "Edit", C_MODULE, "");
        }

        return p || P.resolvedPromise(false);
      };

      self.getApplication = function () {
        return Cairo.Application.getName();
      };

      self.editDocumentsEnabled = function () {
        return false;
      };

      self.copyEnabled = function () {
        return false;
      };

      self.addEnabled = function () {
        return false;
      };

      self.showDocDigital = function () {
      };

      self.messageEx = function (messageId, info) {
        return true;
      };

      self.copy = function () {
        return false;
      };

      self.discardChanges = function () {
        return P.resolvedPromise(refreshCollection());
      };

      self.editNew = function () {
        return false;
      };

      self.propertyChange = function (key) {
        return Cairo.Promises.resolvedPromise(false);
      };

      self.save = function () {

        var properties = m_dialog.getProperties();
        m_byChar = properties.item(C_BY_CHAR).getValue();
        m_first = properties.item(C_FIRST).getValue();
        m_last = properties.item(C_LAST).getValue();

        return true;
      };

      self.getPath = function () {
        return "#general/productoserierange/";
      };

      self.getEditorName = function () {
        var id = "N" + (new Date).getTime().toString();
        return "productoserierange" + id;
      };

      self.getTitle = function () {
        return getText(2905, ""); // Número de Serie Por Rango
      };

      self.validate = function () {

        var properties = m_dialog.getProperties();

        for (var _i = 0, _count = properties.size(); _i < _count; _i++) {

          var property = properties.item(_i);

          switch (property.getKey()) {

            case K_FIRST:
              if (valEmpty(property.getValue(), Types.text)) {
                return M.showInfoWithFalse(getText(2906, "")); // Debe indicar un número inicial
              }
              break;

            case K_LAST:
              if (valEmpty(property.getValue(), Types.text)) {
                return M.showInfoWithFalse(getText(2907, "")); // Debe indicar un número final
              }
              break;
          }
        }

        return P.resolvedPromise(true);
      };

      var loadCollection = function () {

        var properties = m_dialog.getProperties();
        properties.clear();

        properties.add(null)
          .setType(Dialogs.PropertyType.label)
          .setValue(getText(2909, ""));
        // El Número de Serie puede contener números y letras.
        // El(sistema puede generar los Números de Serie dentro del rango que Ud. indica+ de dos maneras 1- Numéricamente 2- Alfabéticamente& Cuando se incrementa alfabéticamente, el sistema utiliza los números del 0 al 9 y+ las letras del alfabeto inglés de a-z en minúsculas.+ Ej. Desde: ab1 Hasta: ba1 Cairo genera: ab1,ab2,..ab9,aba,abb,..,abz,ac0,ac1,..b01,..ba1);

        properties.add(null, C_BY_CHAR)
          .setType(Dialogs.PropertyType.check)
          .setValue(m_byChar)
          .setName(getText(2908, "")); // Incrementar alfabéticamente

        properties.add(null, C_FIRST)
          .setType(Dialogs.PropertyType.text)
          .setName(getText(2532, "")) // Desde
          .setKey(K_FIRST)
          .setValue(m_first);

        properties.add(null, C_LAST)
          .setType(Dialogs.PropertyType.text)
          .setName(getText(2533, "")) // Hasta
          .setKey(K_LAST)
          .setValue(m_last);

        return m_dialog.showModal(self);
      };

      var refreshCollection = function () {

        m_dialog.setTitle(self.getTitle());

        var properties = m_dialog.getProperties();

        properties.item(C_FIRST).setValue(m_first);
        properties.item(C_LAST).setValue(m_last);

        return m_dialog.showValues(properties);
      };

      self.terminate = function () {
        m_dialog = null;
      };

      return self;
    }
  };

}());
