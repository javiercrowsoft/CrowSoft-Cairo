(function() {
  "use strict";

  /*
   this module define a property and a collection of properties ...
   */

  ///////////////
  // Entities
  ///////////////

  Cairo.module("Entities.Dialogs", function(Dialogs, Cairo, Backbone, Marionette, $, _) {

    Dialogs.PropertyType = {
      select: 1,
      text: 2,
      adHock: 3,
      /* TODO: remove. no code must use this. */
      numeric: 4,
      option: 5,
      list: 6,
      check: 7,
      password: 8,
      grid: 9,
      date: 10,
      button: 11,
      toolbar: 12,
      image: 13,
      time: 14,
      progressBar: 15,
      label: 16,
      title: 17,
      description: 18,
      file: 19,
      folder: 20,
      controlLabel: 21
    };

    Dialogs.PropertySubType = {
      money: 1,
      integer: 2,
      double: 3,
      percentage: 4,
      mask: 5,
      taxId: 6,
      memo: 7,
      textButton: 8,
      textButtonEx: 9
    };

    Dialogs.TextAlign = {
      left: 'left',
      right: 'right',
      center: 'center'
    };

    Dialogs.ListWhoSetItem = {
      itemData: 1,
      index: 2,
      text: 3
    };

    Dialogs.createProperty = function() {

      var self = {
        key: 0,
        name: '',

        type: null,
        subType: null,

        value: '',

        list: null,
        listText: '',
        listListIndex: 0,
        listItemData: 0,
        listWhoSetItem: Dialogs.ListWhoSetItem.itemData,

        optionGroup: 0,
        size: 0,

        tabIndex: 0,
        tabIndex2: 0,

        enabled: true,

        isEditProperty: true,

        inputDisabled: false,

        visible: true,

        grid: null,
        gridAddEnabled: false,
        gridRemoveEnabled: false,
        gridEditEnabled: false,
        gridSelectedRow: 0,
        /* VB6: was selectedIndex */
        gridMultiSelect: false,

        selectId: 0,
        selectFilter: '',
        selectFieldIntValue: '',
        selectIntValue: '',
        selectNoUseActive: false,
        selectType: Cairo.Entities.Select.SelectType.normal,
        selectTable: 0,

        top: -1,
        topToPrevious: 0,
        topFrame: 0,
        topFromProperty: '',
        topNotChange: false,

        left: -1,
        leftToPrevious: 0,
        leftLabel: 0,
        leftFrame: 0,
        leftNotChange: false,
        leftFromProperty: '',

        width: 0,
        height: 0,

        toolbar: null,
        buttons: '',

        fontName: '',
        fontSize: 0,
        fontBold: false,
        fontUnderline: false,
        fontItalic: false,
        foreColor: -1,
        backColor: -1,

        textAlign: Dialogs.TextAlign.left,
        textMask: '',
        format: '',

        image: '',

        hideButton: false,

        /* internal */
        _top: 0,
        _left: 0,
        _width: 0,
        _height: 0,
        _ctl: null,
        _controlLoaded: false,
        _index: 0,
        _labelIndex: 0,
        _keyCol: '',

        _unPressedBackColor: -1
      };

      var that = {};
      
      that.getName = function() {
        return self.name;
      };

      that.getControl = function() {
        return self._ctl;
      };
      that.setControl = function(control) {
        self._ctl = control;
      };
      that.getControlLoaded = function() {
        return self._controlLoaded;
      };
      that.setControlLoaded = function(loaded) {
        self._controlLoaded = loaded;
      };

      that.getIndex = function() {
        return self._index;
      };

      that.getGrid = function() {
        return self.grid;
      };
      that.getGridRemoveEnable = function() {
        return self.gridRemoveEnabled;
      };
      that.setGridRemoveEnable = function(enabled) {
        self.gridRemoveEnabled = enabled;
      };

      that.setSelectedRow = function(row) {
        self.gridSelectedRow = row;
      };
      that.getSelectedRow = function() {
        return self.gridSelectedRow;
      };
      that.getForeColor = function() {
        return self.foreColor;
      };
      that.getBackColor = function() {
        return self.backColor;
      };
      that.setBackColor = function(color) {
        self.backColor = color;
      };
      that.setBackColorUnpressed = function(backColor) {
        self._unPressedBackColor = backColor;
      };

      that.getType = function() {
        return self.type;
      };
      that.setType = function(type) {
        self.type = type;
      };
      that.getSubType = function() {
        return self.subType;
      };
      that.setSubType = function(subType) {
        self.subType = subType;
      };

      // list
      //

      that.getList = function() {
        return self.list;
      };
      that.getListWhoSetItem = function() {
        return self.listWhoSetItem;
      };

      that.getListItemData = function() {
        return self.listItemData;
      };
      that.setListItemData = function(index) {
        self.listItemData = index;
      };

      that.getListIndex = function() {
        return self.listListIndex;
      };
      that.setListIndex = function(index) {
        self.listListIndex = index;
      };

      that.getListText = function() {
        return self.listText;
      };
      that.setListText = function(text) {
        return self.listText = text;
      };

      // select
      //
      that.getSelectTable = function() {
        return self.selectTable;
      };

      that.getSelectId = function() {
        return self.selectId;
      };
      that.setSelectId = function(id) {
        self.selectId = id;
      };

      that.getSelectIntValue = function() {
        return self.selectIntValue;
      };
      that.setSelectIntValue = function(value) {
        self.selectIntValue = value;
      };

      that.getSelectFieldIntValue = function() {
        return self.selectFieldIntValue;
      };

      that.getSelectFilter = function() {
        return self.selectFilter;
      };

      that.getSelectType = function() {
        return selectType;
      };
      that.setSelectType = function(type) {
        selectType = type;
      };

      that.getSelectNoUseActive = function() {
        return selectNoUseActive;
      };
      that.setSelectNoUseActive = function(value) {
        selectNoUseActive = value;
      };

      //

      that.getValue = function() {
        return self.value;
      };

      that.getTextMask = function() {
        return self.textMask;
      };

      that.getImage = function() {
        return self.image;
      };

      that.getMultiSelect = function() {
        return self.gridMultiSelect;
      };

      that.getGridAddEnabled = function() {
        return self.gridAddEnabled;
      };
      that.getGridEditEnabled = function() {
        return self.gridEditEnabled;
      };
      that.getGridRemoveEnabled = function() {
        return self.gridRemoveEnabled;
      };

      that.getLabelIndex = function() {
        return self._labelIndex;
      };

      that.getVisible = function() {
        return self.visible;
      };

      that.getKeyCol = function() {
        return self._keyCol;
      };
      that.setIndex = function(index) {
        self._index = index;
      };

      that.getKey = function() {
        return self.key;
      };

      that.getFormat = function() {
        return self.format;
      };

      that.getOptionGroup = function() {
        return self.optionGroup;
      };

      that.getTextAlign = function() {
        return self.textAlign;
      };
      that.getSize = function() {
        return self.size;
      };

      that.getInputDisabled = function() {
        return self.inputDisabled;
      };

      that.setToolbar = function(c) { /* TODO = implement this */ };

      that.getHeight = function() {
        return self.height;
      };
      that.setHeight = function(height) {
        self.height = height;
      };

      that.getWidth = function() {
        return self.width;
      };
      that.setWidth = function(width) {
        self.width = width;
      };

      that.getTopFromProperty = function() {
        return self.topFromProperty;
      };

      that.getTop = function() {
        return self.top;
      };
      that.setTop = function(top) {
        self.top = top;
      };

      that.getTopToPrevious = function() {
        return self.topToPrevious;
      };
      that.getLeftFromProperty = function() {
        return self.leftFromProperty;
      };

      that.setLeft = function(left) {
        self.left = left;
      };
      that.getLeft = function() {
        return self.left;
      };

      that.getLeftLabel = function() {
        return self.leftLabel;
      };
      that.setLeftLabel = function(left) {
        self.leftLabel = left;
      };

      that.getLeftToPrevious = function() {
        return self.leftToPrevious;
      };

      that.getTabIndex = function() {
        return self.tabIndex;
      };
      that.setTabIndex = function(index) {
        self.tabIndex = index;
      };

      that.getTabIndex2 = function() {
        return self.tabIndex2;
      };
      that.setTabIndex2 = function(index) {
        self.tabIndex2 = index;
      };

      that.getTopFrame = function() {
        return self.topFrame;
      };
      that.getLeftFrame = function() {
        return self.leftFrame;
      };

      that.getButtons = function() {
        return self.buttons;
      };

      that.getLeftNotChange = function() {
        return self.leftNotChange;
      };
      that.setLeftNotChange = function(leftNotChange) {
        self.leftNotChange = leftNotChange;
      };
      that.getTopNotChange = function() {
        return self.topNotChange;
      };
      that.setTopNotChange = function(topNotChange) {
        self.topNotChange = topNotChange;
      };

      that.setLabelIndex = function(labelIndex) {
        self._labelIndex = labelIndex;
      };

      that.getToolbar = function() {
        return self.toolbar;
      };
      that.getIsEditProperty = function() {
        return self.isEditProperty;
      };
      that.getNoShowButton = function() {
        return self.hideButton;
      };

      that.getFontName = function() {
        return self.fontName;
      };
      that.setFontName = function(name) {
        self.fontName = name;
      };
      that.getFontSize = function() {
        return self.fontSize;
      };
      that.setFontSize = function(size) {
        self.fontSize = size;
      };
      that.getFontUnderline = function() {
        return self.fontUnderline;
      };
      that.setFontUnderline = function(underline) {
        self.fontUnderline = underline;
      };
      that.getFontBold = function() {
        return self.fontBold;
      };
      that.setFontBold = function(bold) {
        self.fontBold = bold;
      };
      that.getFontItalic = function() {
        return self.fontItalic;
      };
      that.setFontItalic = function(italic) {
        self.fontItalic = italic;
      };

      that.getEnabled = function() {
        return self.enabled;
      };

      return that;

    };

    Dialogs.createProperties = function(itemConstructor) {

      var newCollection = function() {
        return {
          items: [],
          keys: {},
          count: 0
        };
      };

      var self = newCollection();

      var that = {};

      that.add = function(value, key) {
        //
        // if a key is present we need to validate it
        //
        if (key !== undefined) {
          //
          // key is alwas string
          //
          key = key.toString();
          if (self.keys[key] !== undefined) {
            throw new Error("Can't add this item. There is already an object with this key [" + key + "] in the colletion.");
          }
          self.keys[key] = self.count;
        }
        value = value || itemConstructor();
        self.items[self.count] = value;
        self.count += 1;

        return value;
      };

      var checkIndex = function(index) {
        if (typeof index === "number") {
          if (index < 0 || index >= self.count) {
            throw new Error("Index out of bounds. Index: " + index.toString());
          }
        } else {
          var key = index.toString();
          index = self.keys[key];
          if (index === undefined) {
            throw new Error("This key is not present in this collection. Key: " + key);
          }
        }
        return index;
      };

      that.item = function(indexOrKey) {
        var index = checkIndex(indexOrKey);
        return self.items[index];
      };
      
      that.remove = function(indexOrKey) {
        var index = checkIndex(indexOrKey);
        var count = self.count - 1;
        //
        // move all elements from index to the beginning of the array
        //
        for(var i = index; i < count; i += 1) {
          self.items[i] = self.items[i + 1];
        }
        //
        // remove the last reference to allow the object be garbage collected
        //
        delete self.items[self.count-1];
        //
        // update size of items array
        //
        self.count -=1;
        //
        // update keys array
        //
        var keys = Object.keys(self.keys);
        for(var i = 0; i < keys.length; i += 1) {
          if(self.keys[keys[i]]) {
            //
            // delete the key for this object
            //
            if(self.keys[keys[i]] === index) {
              delete self.keys[keys[i]];
            }
            //
            // update index for every key which references an element
            // moved in this remove operation
            //
            else if(self.keys[keys[i]] > index) {
              self.keys[keys[i]] -= 1;
            }
          }
        }
      };

      that.clear = newCollection();

      that.count = function() {
        return self.count;
      };

      return that;
    }

  });

}());