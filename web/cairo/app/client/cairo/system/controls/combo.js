(function() {
  "use strict";

  Cairo.module("Controls", function(Controls, Cairo, Backbone, Marionette, $, _) {

    var createCombo = function() {
      var self = {
        text: "",
        itemData: 0,
        index: -1,
        list: []
      };

      var that = Controls.createControl();

      that.htmlTag = "<select></select>";

      var superSetElement = that.setElement;

      that.setElement = function(element, view) {
        superSetElement(element);

        loadList();
        that.selectById(self.itemData);

        element.addClass('form-control');

        var onChange = view.comboChange(that);
        element.change(function() {
          setItemData(element.val());
          setText(self.list[element[0].selectedIndex].text);
          setIndex(element[0].selectedIndex);
          onChange();
        });
      };

      var setText = function(text) {
        self.text = text;
      };
      var setItemData = function(itemData) {
        self.itemData = itemData;
      };
      var setIndex = function(index) {
        self.index = index;
      };

      that.getText = function() {
        return self.text;
      };
      that.getItemData = function() {
        return self.itemData;
      };
      that.getListIndex = function() {
        return self.index;
      };

      that.clear = function() {
        var element = that.getElement();
        if(element !== null) {
          element.empty();
        }
        self.text = "";
        self.itemData = 0;
        self.index = -1;
        self.list = [];
      };

      that.add = function(text, id) {
        if(!Cairo.Util.isNumeric(id)) {
          id = self.list.length;
        }
        else {
          id = Cairo.Util.toInt(id);
        }
        self.list.push({text: text, id: id});
        addToElement(text, id);
      };

      that.count = function() {
        return self.list.length;
      };

      that.selectByText = function(text) {
        var index = getIndexForText(text);
        if(index > -1) {
          var element = that.getElement();
          if(element !== null) {
            $('option', element).eq(index).prop('selected', true);
          }
          setItemData(self.list[index].id);
          setText(text);
          setIndex(index);
        }
      };

      that.selectByIndex = function(index) {
        if(Cairo.Util.isNumeric(index)) {
          index = Cairo.Util.toInt(index);
          if(index < self.list.length && index >= 0) {
            var element = that.getElement();
            if(element !== null) {
              $('option', element).eq(index).prop('selected', true);
            }
            setItemData(self.list[index].id);
            setText(self.list[index].text);
            setIndex(index);
          }
        }
      };

      that.selectById = function(id) {
        var index = getIndexForId(id);
        if(index > -1) {
          var element = that.getElement();
          if(element !== null) {
            element.val(id);
          }
          setItemData(id);
          setText(self.list[index].text);
          setIndex(index);
        }
      };

      var getIndexForText = function(text) {
        for(var i = 0, count = self.list.length; i < count; i += 1) {
          if(self.list[i].text === text) {
            return i;
          }
        }
        return -1;
      };

      var getIndexForId = function(id) {
        for(var i = 0, count = self.list.length; i < count; i += 1) {
          if(self.list[i].id === id) {
            return i;
          }
        }
        return -1;
      };

      var loadList = function() {
        for(var i = 0, count = self.list.length; i < count; i += 1) {
          addToElement(self.list[i].text, self.list[i].id);
        }
      };

      var addToElement = function(text, id) {
        var element = that.getElement();
        if(element !== null) {
          element.append($('<option>', {
            value: id,
            text: text
          }));
        }
      };

      return that;
    };

    Controls.createCombo = function() {

      var self = {
        objectType: "cairo.controls.combo"
      };

      var that = createCombo();

      that.getObjectType = function() {
        return self.objectType;
      };

      return that;
    };

  });

}());