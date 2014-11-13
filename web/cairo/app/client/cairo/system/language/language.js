(function() {
  "use strict";

  Cairo.module("Language", function(Language, Cairo, Backbone, Marionette, $, _){

    Language.getText = function(code, defaultValue) {
      code = "code" + code.toString();
      return this.texts[code] || defaultValue;
    };

    // TODO: implement this. read this values from the user's language
    Language.Constants = {
      ACTIVE_TEXT: 'activo',
      UPDATED_BY_TEXT: 'modifico'
    };


  });

}());