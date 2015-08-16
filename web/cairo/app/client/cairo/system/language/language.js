(function() {
  "use strict";

  Cairo.module("Language", function(Language, Cairo, Backbone, Marionette, $, _){

    Language.getText = function(code, defaultValue) {
      code = "code" + code.toString();
      var message = Language.texts[code] || defaultValue;
      var args = Array.prototype.slice.call(arguments, 2);

      for(var i = 0, count = args.length; i < count; i += 1) {
        message = message.replace("#" + (i+1) + "#", args[i]);
      }
      return message;
    };

    // TODO: implement this. read this values from the user's language
    Language.Constants = {
      ACTIVE_TEXT: 'activo',
      UPDATED_BY_TEXT: 'modifico'
    };


  });

}());