(function() {
  "use strict";

  Cairo.module("Controls", function(Controls, Cairo, Backbone, Marionette, $, _) {

    var C_MODULE = "Controls.input";

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
        mask: "",
        buttonStyle: Controls.ButtonStyle.none,

        input: null,
        button: null,
        listeners: {
          onButtonClick: []
        }
      };

      var that = Controls.createControl();

      that.htmlTag = '<div class="input-text-control"></div>';

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
      };

      var keyPressListener = function(e) {
        Cairo.log("keypress: " + String.fromCharCode(that.getKeyCode(e)));

        var keys = "0123456789.,-+*/";
        var key = String.fromCharCode(that.getKeyCode(e));

        var input = that.getElement().children();
        if(key === "=" || (OPERATORS.test(input.val()) && OPERATORS.test(key))) {

          that.setText(input.val());
          if(key === "=") {
            e.preventDefault();
          }
        }
        else if(keys.indexOf(key) === -1) {
          e.preventDefault();
        }
      };

      var addButton = function(element) {
        if(self.button === null) {
          var button = $('<button>!</button>');
          button.attr('tabindex', -1);
          element.append(button);
          button.click(function(e) {
            var listeners = self.listeners.onButtonClick;
            for(var i = 0, count = listeners.length; i < count; i += 1) {
              listeners[i](e);
            }
          });
          self.button = button;
        }
      };
      var removeButton = function() {
        if(self.button !== null) {
          self.button.remove();
          self.button = null;
        }
      };

      that.setElement = function(element, view, onChangeHandler) {
        superSetElement(element);
        var input = $('<input/>');
        element.append(input);
        if(self.type === Controls.InputType.password) {
          input.attr('type', 'password');
        }
        input.val(self.text);
        input.addClass("dialog-control dialog-input-control");
        var onChange;
        if(onChangeHandler !== undefined) {
          onChange = onChangeHandler;
        }
        else {
          onChange = isText() ? view.onTextChange(that) : view.onMaskEditChange(that);
        }
        input.change(function() {
          that.setText(input.val());
          onChange();
        });
        if(!isText()) {
          input.addClass("dialog-input-control-number");
          input.on("keypress", keyPressListener);
        }

        setButtonsStyleAux(element, self.buttonStyle);

        addRemoveClazz('addClass');

        self.input = input;

        self.input.click(function() {
          this.setSelectionRange(0, this.value.length);
        });

        that.setEnabled(that.getEnabled());
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
        Cairo.validateAssignmentIsNotNull(text, C_MODULE, "createInput.setText");
        self.text = getValue(text, true);
        var element = that.getElement();
        if(element) {
          element.children().val(self.text);
        }
      };

      that.getText = function() {
        var element = that.getElement();
        if(element) {
          self.text = getValue(element.children().val(), true);;
        }
        return self.text;
      };

      var superSetEnabled = that.setEnabled;

      that.setEnabled = function(enabled) {
        superSetEnabled(enabled);
        if(self.input !== null) self.input.attr('disabled', !enabled);
        if(self.button !== null) self.button.attr('disabled', !enabled);
      };

      that.setValue = function(text) {
        self.text = getValue(text, false);
        var element = that.getElement();
        if(element) {
          element.children().val(self.text);
        }
      };
      that.getValue = that.getText;

      var addRemoveClazz = function(f) {
        if(self.clazz !== "") {
          var element = that.getElement();
          if(element !== null) {
            element.children()[f](self.clazz);
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

      var setButtonsStyleAux = function(element, style) {
        if (style === Controls.ButtonStyle.single) {
          addButton(element);
        }
        else {
          removeButton();
        }
      };

      that.setButtonStyle = function(style) {
        self.buttonStyle = style;
        var element = that.getElement();
        if(element) setButtonsStyleAux(element, style);
      };

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
          var input = element.children();
          input.off("keypress");
          if(!isText()) {
            input.addClass("dialog-input-control-number");
            input.on("keypress", keyPressListener);
          }
          else {
            input.removeClass("dialog-input-control-number");
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
      };

      that.focus = function() {
        var element = self.input;
        if(element) {
          element.focus();
        }
      };

      that.select = function() {
        var element = self.input;
        if(element) {
          element.select();
        }
      };

      that.addListener = function(eventName, functionHandler) {
        switch(eventName) {
          case "onButtonClick":
            self.listeners[eventName].push(functionHandler);
            break;
          default:
            Cairo.logError(
                'Invalid event listener registration. EventName: '
                + eventName + ' - Handler: ' + functionHandler.toString());
        }
      };

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