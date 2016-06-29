(function() {
  "use strict";

  Cairo.module("Controls", function(Controls, Cairo, Backbone, Marionette, $, _) {

    Controls.ButtonStyle = {
      single: 1,
      none: 2
    };

    Controls.InputType = {
      text: 1,
      money: 2,
      integer: 3,
      double: 4,
      percentage: 5,
      mask: 6,
      taxId: 7,
      memo: 8,
      file: 9,
      folder: 10,
      password: 11
    };

    var createInput = function() {
      var self = {

        text: "",
        enabledNoChangeBkColor: false,
        maxLength: 0,
        fileFilter: "",
        inputDisabled: false,
        type: Controls.InputType.text,
        clazz: "",
        mask: ""

      };

      var that = Controls.createControl();

      that.htmlTag = "<input/>";

      var superSetElement = that.setElement;

      var isText = function() {
        return (
          self.type === Controls.InputType.text
          || self.type === Controls.InputType.password
          || self.type === Controls.InputType.file
          || self.type === Controls.InputType.folder
          || self.type === Controls.InputType.mask
          || self.type === Controls.InputType.taxId
          || self.type === Controls.InputType.memo
        );
      }

      var keyPressListener = function(e) {
        Cairo.log("keypress: " + String.fromCharCode(e.keyCode));

        var keys = "0123456789.,-+*/";
        var key = String.fromCharCode(e.keyCode);

        var element = that.getElement();
        if(key === "=" || (OPERATORS.test(element.val()) && OPERATORS.test(key))) {

          that.setText(element.val());
          if(key === "=") {
            e.preventDefault();
          }
        }
        else if(keys.indexOf(key) === -1) {
          e.preventDefault();
        }
      };

      that.setElement = function(element, view, onChangeHandler) {
        superSetElement(element);
        if(self.type === Controls.InputType.password) {
          element.attr('type', 'password');
        }
        element.val(self.text);
        element.addClass("dialog-control dialog-input-control");
        var onChange;
        if(onChangeHandler !== undefined) {
          onChange = onChangeHandler;
        }
        else {
          onChange = isText() ? view.onTextChange(that) : view.onMaskEditChange(that);
        }
        element.change(function() {
          that.setText(element.val());
          onChange();
        });
        if(!isText()) {
          element.addClass("dialog-input-control-number");
          element.on("keypress", keyPressListener);
        }
        addRemoveClazz('addClass');
      };

      var val = Cairo.Util.val;
      var OPERATORS = /[\*\/\+\-]/;

      var calculate = function(text) {
        // keep it simple
        // no parentheses
        // first / then * then - then +
        try {
          var multiResult;
          var subsResult;
          var sumResult = 0;

          if(OPERATORS.test(text.slice(-1))) {
            text = text.substr(0, text.length-1);
          }
          if(OPERATORS.test(text.substr(0,1))) {
            text = text.substring(1);
          }

          var sum = text.split("+");
          for(var i = 0, countSum = sum.length; i < countSum; i++) {
            var subs = sum[i].split("-");
            subsResult = 0;
            for(var j = 0, countSubs = subs.length; j < countSubs; j++) {
              var multi = subs[j].split("*");
              multiResult = 1;
              for(var t = 0, countMulti = multi.length; t < countMulti; t++) {
                var divs = multi[t].split("/");
                if(divs.length > 2) {
                  return "";
                }
                else if(divs.length > 1) {
                  multi[t] = parseFloat(divs[0]) / parseFloat(divs[1]);
                }
                else {
                  multi[t] = parseFloat(multi[t]);
                }
                multiResult = multiResult * multi[t];
              }
              if(j > 0) {
                subsResult = subsResult - multiResult;
              }
              else {
                subsResult = subsResult + multiResult;
              }
            }
            sumResult = sumResult + subsResult;
          }
          text = sumResult;
        }
        catch(ignore) {
          text = "";
        }
        return text;
      };

      var getValue = function(text, format) {
        if(!isText()) {
          if(OPERATORS.test(text)) {
            text = calculate(text);
          }
          else {
            text = val(text);
          }
          if(format) {
            var decimals = self.type === Controls.InputType.integer ? 0 : 2;
            text = Cairo.accounting.formatNumber(text, decimals);
          }
        }
        else if(self.mask !== "") {
          text = applyMask(text.toString());
        }
        return text;
      };

      that.setText = function(text) {
        self.text = getValue(text, true);
        var element = that.getElement();
        if(element) {
          element.val(self.text);
        }
      };
      that.getText = function() {
        var element = that.getElement();
        if(element) {
          self.text = element.val();
        }
        return self.text;
      };

      that.setValue = function(text) {
        self.text = getValue(text, false);
        var element = that.getElement();
        if(element) {
          element.val(self.text);
        }
      };
      that.getValue = that.getText;

      var addRemoveClazz = function(f) {
        if(self.clazz !== "") {
          var element = that.getElement();
          if(element !== null) {
            element[f](self.clazz);
          }
        }
      };

      that.setClass = function(clazz) {
        addRemoveClazz('removeClass');
        self.clazz = clazz;
        addRemoveClazz('addClass');
      };

      that.getMask = function() {
        return self.mask;
      };
      that.setMask = function(mask) {
        self.mask = mask;
      };
      that.setButtonStyle = function(style) { /* TODO: implement this. */ };
      that.setPasswordChar = function(char) { /* TODO: implement this. */ };
      that.setFormatNumber = function(format) { /* TODO: implement this. */ };
      that.setMaxLength = function(length) { self.maxLength = length; };
      that.setInputDisabled = function(value) { self.inputDisabled = value; };
      that.setFileFilter = function(filter) { self.fileFilter = filter; };

      that.getType = function() {
        return self.type;
      };
      that.setType = function(type) {
        self.type = type;
        var element = that.getElement();
        if(element !== null) {
          element.off("keypress");
          if(!isText()) {
            element.addClass("dialog-input-control-number");
            element.on("keypress", keyPressListener);
          }
          else {
            element.removeClass("dialog-input-control-number");
          }
        }
      };
      
      var applyMask = function(value) {
        var rtn = "";

        var mask = self.mask.split("-");
        var text = value.split("-");

        if(text.length > mask.length) {
          var last = mask.length - 1;
          for(var i = mask.length, count = text.length; i < count; i += 1) {
            text[last] += text[i];
          }
          text.splice(mask.length, text.length - mask.length);
        }
        else if(text.length < mask.length) {
          var j = text.length -1;
          var aux = "";
          var right = Cairo.Util.right;
          var left = Cairo.Util.left;
          for(var i = mask.length - 1; i > -1; i -= 1) {
            if(j > -1) {
              if(text[j] === undefined) {
                text[j] = "";
              }
              if(mask[i].length < (text[j] + aux).length) {
                var t = text[j] + aux;
                text[i] = right(t, mask[i].length);
                aux = left(t, t.length - mask[i].length);
              }
              else {
                text[i] = text[j] + aux;
                aux = "";
              }
            }
            else {
              if(mask[i].length < aux.length) {
                text[i] = right(aux, mask[i].length);
                aux = left(aux, aux.length - mask[i].length);
              }
              else {
                text[i] = aux;
                aux = "";
              }
            }
            j -= 1;
          }
        }

        var string = Cairo.Util.string;
        for(var j = mask.length -1; j > -1; j -= 1) {

          if(mask[j].length - text[j].length > 0) {
            text[j] = string(mask[j].length - text[j].length, " ") + text[j];
          }

          var isNumeric = Cairo.Util.isNumeric;
          for(var i = mask[j].length -1; i > -1; i -= 1) {

            var s = mask[j].substr(i, 1);
            var s2 = text[j].substr(i, 1);

            switch(s) {
              case "0":
                if(! isNumeric(s2)) {
                  s2 = "0";
                }
                break;

              case "-":
                if(isNumeric(s2)) {
                  text[j] = text[j].substring(1);
                }
                s2 = "-";
                break;

              case "#":
                // anything the user inputs
                // except empty string
                //
                if(s2.trim() === "") {
                  s2 = "#";
                }
                break;

              case "%":
                // anything the user inputs
                // except empty string
                //
                if(s2.trim() === "") {
                  s2 = "%";
                }
                else {
                  s2 = s2.toUpperCase();
                }
                break;

              case "*":
                // anything the user inputs
                // including empty string
                //
              default:
                s2 = s;
            }

            rtn = s2 + rtn;
          }

          if(j > 0) {
            rtn = "-" + rtn;
          }
        }

        return rtn;
      }
      
      return that;
    };

    Controls.createInput = function() {

      var self = {
        objectType: "cairo.controls.input"
      };

      var that = createInput();

      that.getObjectType = function() {
        return self.objectType;
      };

      return that;
    };

  });

}());