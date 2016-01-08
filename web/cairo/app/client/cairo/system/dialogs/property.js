(function() {
  "use strict";

  /*
   this module define a property and a collection of properties ...
   */

  ///////////////
  // Entities
  ///////////////

  Cairo.module("Dialogs", function(Dialogs, Cairo, Backbone, Marionette, $, _) {

    Dialogs.PropertyType = {
      select: 1,
      text: 2,
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

    var S = {
      money: 1,
      integer: 2,
      double: 3,
      percentage: 4,
      mask: 5,
      taxId: 6,
      memo: 7,
      textButton: 8,
      textButtonEx: 9,
      mainTitle: 10,
      subTitle: 11,
      title: 12
    };

    Dialogs.PropertySubType = S;

    var CT = Cairo.Controls.InputType;

    Dialogs.getCtrlType = function(subType) {
      switch(subType) {
        case S.money:
          return CT.money;
        case S.integer:
          return CT.integer;
        case S.double:
          return CT.double;
        case S.percentage:
          return CT.percentage;
        case S.mask:
          return CT.mask;
        case S.taxId:
          return CT.taxId;
        case S.memo:
          return CT.memo;
        case S.textButton:
        case S.textButtonEx:
          return CT.text;
        default:
          return CT.text;
      }
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

    Dialogs.ListItem = {};

    Dialogs.ListItem.createListItem = function() {

      var self = {
        id: 0,
        value: ""
      };
      
      var that = {};

      that.setId = function(id) {
        self.id = id;
        return that;
      };
      that.getId = function() {
        return self.id;
      };

      that.setValue = function(value) {
        if(value === undefined) {
          Cairo.raiseError("setValue", "undefined can not be used when calling setValue");
        }
        self.value = value;
        return that;
      };
      that.getValue = function() {
        return self.value;
      };

      return that;
    };

    Dialogs.createProperty = function() {

      var self = {
        key: 0,
        name: '',

        type: null,
        subType: null,

        value: '',

        list: null, /* is a Dialogs.ListItem */
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
        gridSelectedRow: 0, /* VB6: was selectedIndex */

        selectId: 0,
        selectFilter: '',
        selectFieldIntValue: '',
        selectIntValue: '',
        selectNoUseActive: false,
        selectType: Cairo.Select.SelectType.normal,
        selectTable: 0,

        hideLabel: false,

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

        noShowLabel: false,

        cssClass: "",

        /* internal */
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
      that.setName = function(name) {
        self.name = name;
        return that;
      };

      that.getControl = function() {
        return self._ctl;
      };
      that.setControl = function(control) {
        self._ctl = control;
        self._controlLoaded = false;
        return that;
      };

      that.getControlLoaded = function() {
        return self._controlLoaded;
      };
      that.setControlLoaded = function(loaded) {
        self._controlLoaded = loaded;
        return that;
      };

      //
      // this function must be renamed to getCtrlIndex
      //
      that.getIndex = function() {
        return self._index;
      };

      //
      // IMPORTANT: this function must never be renamed to getIndex because
      //            that name is used for collection to maintain the index
      //            of any object it contains.
      //
      //            this _index field is not the index in the collection
      //            it is is the index of the control (select, input, combo, etc.)
      //            in the view control[TYPE] collection (selects, combos, etc.)
      //
      that.setCtrlIndex = function(index) {
        self._index = index;
        return that;
      };

      that.getGrid = function() {
        if(self.grid === null) {
          self.grid = Dialogs.Grids.createGrid();
        }
        return self.grid;
      };
      that.getGridRemoveEnable = function() {
        return self.gridRemoveEnabled;
      };
      that.setGridRemoveEnable = function(enabled) {
        self.gridRemoveEnabled = enabled;
        return that;
      };

      that.setSelectedRow = function(row) {
        self.gridSelectedRow = row;
        return that;
      };
      that.getSelectedRow = function() {
        return self.gridSelectedRow;
      };

      that.getForeColor = function() {
        return self.foreColor;
      };
      that.setForeColor = function(color) {
        self.foreColor = color;
        return that;
      };

      that.getBackColor = function() {
        return self.backColor;
      };
      that.setBackColor = function(color) {
        self.backColor = color;
        return that;
      };
      that.setBackColorUnpressed = function(backColor) {
        self._unPressedBackColor = backColor;
        return that;
      };

      that.getType = function() {
        return self.type;
      };
      that.setType = function(type) {
        if(type === undefined) {
          Cairo.raiseError("setType", "undefined can not be used when calling setType");
        }
        self.type = type;
        return that;
      };
      that.getSubType = function() {
        return self.subType;
      };
      that.setSubType = function(subType) {
        if(subType === undefined) {
          Cairo.raiseError("setSubType", "undefined can not be used when calling setSubType");
        }
        self.subType = subType;
        return that;
      };

      // list
      //

      that.getList = function() {
        if(self.list === null) {
          self.list = Cairo.Collections.createCollection(Dialogs.ListItem.createListItem);
        }
        return self.list;
      };

      that.setListWhoSetItem = function(value) {
        self.listWhoSetItem = value;
        return that;
      };
      that.getListWhoSetItem = function() {
        return self.listWhoSetItem;
      };

      that.getListItemData = function() {
        return self.listItemData;
      };
      that.setListItemData = function(index) {
        self.listItemData = index;
        return that;
      };

      that.getListIndex = function() {
        return self.listListIndex;
      };
      that.setListIndex = function(index) {
        self.listListIndex = index;
        return that;
      };

      that.getListText = function() {
        return self.listText;
      };
      that.setListText = function(text) {
        self.listText = text;
        return that;
      };

      // select
      //
      that.getSelectTable = function() {
        return self.selectTable;
      };
      that.setSelectTable = function(table) {
        if(table === undefined) {
          Cairo.raiseError("setSelectTable", "undefined can not be used when calling setSelectTable");
        }
        self.selectTable = table;
        return that;
      };

      that.getSelectId = function() {
        return self.selectId;
      };
      that.setSelectId = function(id) {
        self.selectId = id;
        return that;
      };

      that.getSelectIntValue = function() {
        return self.selectIntValue;
      };
      that.setSelectIntValue = function(value) {
        self.selectIntValue = value;
        return that;
      };

      that.getSelectFieldIntValue = function() {
        return self.selectFieldIntValue;
      };

      that.getSelectFilter = function() {
        return self.selectFilter;
      };
      that.setSelectFilter = function(filter) {
        self.selectFilter = filter;
        return that;
      };

      that.getSelectType = function() {
        return self.selectType;
      };
      that.setSelectType = function(type) {
        self.selectType = type;
        return that;
      };

      that.getSelectNoUseActive = function() {
        return self.selectNoUseActive;
      };
      that.setSelectNoUseActive = function(value) {
        self.selectNoUseActive = value;
        return that;
      };

      //

      that.getValue = function() {
        return self.value;
      };
      that.setValue = function(value) {
        if(value === undefined) {
          Cairo.raiseError("setValue", "undefined can not be used when calling setValue");
        }
        self.value = value;
        return that;
      };

      that.getTextMask = function() {
        return self.textMask;
      };
      that.setTextMask = function(mask) {
        self.textMask = mask;
        return that;
      };

      that.getImage = function() {
        return self.image;
      };
      that.setImage = function(image) {
        self.image = image;
        return that;
      };

      that.getGridAddEnabled = function() {
        return self.gridAddEnabled;
      };
      that.setGridAddEnabled = function(enabled) {
        self.gridAddEnabled = enabled;
        return that;
      };

      that.getGridEditEnabled = function() {
        return self.gridEditEnabled;
      };
      that.setGridEditEnabled = function(enabled) {
        self.gridEditEnabled = enabled;
        return that;
      };

      that.getGridRemoveEnabled = function() {
        return self.gridRemoveEnabled;
      };
      that.setGridRemoveEnabled = function(enabled) {
        self.gridRemoveEnabled = enabled;
        return that;
      };

      that.getLabelIndex = function() {
        return self._labelIndex;
      };
      that.setLabelIndex = function(labelIndex) {
        self._labelIndex = labelIndex;
        return that;
      };

      that.getVisible = function() {
        return self.visible;
      };
      that.setVisible = function(visible) {
        self.visible = visible;
        return that;
      };

      that.getKeyCol = function() {
        return self._keyCol;
      };
      that.setKeyCol = function(key) {
        self._keyCol = key;
        return that;
      };

      that.getKey = function() {
        return self.key;
      };
      that.setKey = function(key) {
        if(key === undefined) {
          Cairo.raiseError("setKey", "undefined can not be used when calling setKey");
        }
        self.key = key;
        return that;
      };

      that.getFormat = function() {
        return self.format;
      };
      that.setFormat = function(format) {
        self.format = format;
        return that;
      };

      that.getOptionGroup = function() {
        return self.optionGroup;
      };

      that.getTextAlign = function() {
        return self.textAlign;
      };
      that.setTextAlign = function(align) {
        self.textAlign = align;
        return that;
      };

      that.getSize = function() {
        return self.size;
      };
      that.setSize = function(size) {
        self.size = size;
        return that;
      };

      that.getInputDisabled = function() {
        return self.inputDisabled;
      };

      that.setToolbar = function(c) {
        return that;
      };

      that.hideLabel = function() {
        self.hideLabel = true;
      };

      that.labelIsHidden = function() {
        return self.hideLabel;
      };

      that.getTabIndex = function() {
        return self.tabIndex;
      };
      that.setTabIndex = function(index) {
        self.tabIndex = index;
        return that;
      };

      that.getTabIndex2 = function() {
        return self.tabIndex2;
      };
      that.setTabIndex2 = function(index) {
        self.tabIndex2 = index;
        return that;
      };

      that.getButtons = function() {
        return self.buttons;
      };

      that.getToolbar = function() {
        return self.toolbar;
      };

      that.getIsEditProperty = function() {
        return self.isEditProperty;
      };
      that.setIsEditProperty = function(isEditProperty) {
        self.isEditProperty = isEditProperty;
        return that;
      };

      that.getNoShowButton = function() {
        return self.hideButton;
      };

      that.getFontName = function() {
        return self.fontName;
      };
      that.setFontName = function(name) {
        self.fontName = name;
        return that;
      };
      that.getFontSize = function() {
        return self.fontSize;
      };
      that.setFontSize = function(size) {
        self.fontSize = size;
        return that;
      };
      that.getFontUnderline = function() {
        return self.fontUnderline;
      };
      that.setFontUnderline = function(underline) {
        self.fontUnderline = underline;
        return that;
      };
      that.getFontBold = function() {
        return self.fontBold;
      };
      that.setFontBold = function(bold) {
        self.fontBold = bold;
        return that;
      };
      that.getFontItalic = function() {
        return self.fontItalic;
      };
      that.setFontItalic = function(italic) {
        self.fontItalic = italic;
        return that;
      };

      that.getEnabled = function() {
        return self.enabled;
      };
      that.setEnabled = function(enabled) {
        self.enabled = enabled;
        return that;
      };

      that.getNoShowLabel = function() {
        return self.noShowLabel;
      };
      that.setNoShowLabel = function(noShowLabel) {
        self.noShowLabel = noShowLabel;
        return that;
      };

      that.getCSSClass = function() {
        return self.cssClass;
      };
      that.setCSSClass = function(cssClass) {
        self.cssClass = cssClass;
        return that;
      };

      return that;
    };

    Dialogs.createProperties = function() {
      return Cairo.Collections.createCollection(Dialogs.createProperty);
    };

  });

}());