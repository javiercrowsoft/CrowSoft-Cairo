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
      select:       1,
      text:         2,
      adHock:       3, /* TODO: remove. no code must use this. */
      numeric:      4,
      option:       5,
      list:         6,
      check:        7,
      password:     8,
      grid:         9,
      date:         10,
      button:       11,
      toolbar:      12,
      image:        13,
      time:         14,
      progressBar:  15,
      label:        16,
      title:        17,
      description:  18,
      file:         19,
      folder:       20,
      controlLabel: 21
    };

    Dialogs.PropertySubType = {
      money:        1,
      integer:      2,
      double:       3,
      percentage:   4,
      mask:         5,
      taxId:        6,
      memo:         7,
      textButton:   8,
      textButtonEx: 9
    };

    Dialogs.TextAlign = {
      left: 'left',
      right: 'right',
      center: 'center'
    };

    Dialogs.ListWhoSetItem = {
      itemData: 1,
      index:    2,
      text:     3
    };

    Dialogs.Property = Backbone.Model.extend({
      urlRoot: "",

      defaults: {
        key:                    0,
        name:                   '',

        type:                   null,
        subType:                null,

        value:                  '',

        list:                   null,
        listText:               '',
        listListIndex:          0,
        listItemData:           0,
        listWhoSetItem:         Dialogs.ListWhoSetItem.itemData,

        optionGroup:            0,
        size:                   0,

        tabIndex:               0,
        tabIndex2:              0,

        enabled:                true,

        isEditProperty:         true,

        inputDisabled:          false,

        visible:                true,

        grid:                   null,
        gridAddEnabled:         false,
        gridRemoveEnabled:      false,
        gridEditEnabled:        false,
        gridSelectedRow:        0,      /* VB6: was selectedIndex */

        selectId:               0,
        selectFilter:           '',
        selectFieldIntValue:    '',
        selectIntValue:         '',
        selectNoUseActive:      false,
        selectType:             Cairo.Entities.Select.SelectType.normal,
        selectTable:            0,

        top:                    -1,
        topToPrevious:          0,
        topFrame:               0,
        topFromProperty:        '',
        topNotChange:           false,

        left:                   -1,
        leftToPrevious:         0,
        leftLabel:              0,
        leftFrame:              0,
        leftNotChange:          false,
        leftFromProperty:       '',

        width:                  0,
        height:                 0,

        toolbar:                null,
        buttons:                '',

        fontName:               '',
        fontSize:               0,
        fontBold:               false,
        fontUnderline:          false,
        fontItalic:             false,
        foreColor:              -1,
        backColor:              -1,

        textAlign:              Dialogs.TextAlign.left,
        textMask:               '',
        format:                 '',

        image:                  '',

        hideButton:             false,

        /* internal */
        _top:           0,
        _left:          0,
        _width:         0,
        _height:        0,
        _ctl:           null,
        _controlLoaded: false,
        _index:         0,
        _labelIndex:    0,
        _keyCol:        '',

        _unPressedBackColor: -1,

        getName: function() { return this.name; },

        getControl: function() { return this._ctl; },
        setControl: function(control) { this._ctl = control; },
        getControlLoaded: function() { return this._controlLoaded; },
        setControlLoaded: function(loaded) { this._controlLoaded = loaded; },

        getIndex: function() { return this._index; },

        getGrid: function() { return this.grid; },
        getGridRemoveEnable: function() { return this.gridRemoveEnabled; },
        setGridRemoveEnable: function(enabled) { this.gridRemoveEnabled = enabled; },

        setSelectedRow: function(row) { this.gridSelectedRow = row; },
        getSelectedRow: function() { return this.gridSelectedRow; },
        getForeColor: function() { return this.foreColor; },
        getBackColor: function() { return this.backColor; },
        setBackColor: function(backColor) { this.backColor = backColor; },
        setBackColorUnpressed: function(backColor) { this._unPressedBackColor = backColor; },

        getType: function() { return this.type; },
        getSubType: function() { return this.subType; },

        // list
        //

        getList: function() { return this.list; },
        getListWhoSetItem: function() { return this.listWhoSetItem; },

        getListItemData: function() { return this.listItemData; },
        setListItemData: function(index) { this.listItemData = index; },

        getListIndex: function() { /* TODO: implement this */ },
        setListIndex: function(index) { this.listListIndex = index; },

        getListText: function() { return this.listText; },
        setListText: function(text) { return this.listText = text; },

        // select
        //
        getSelectTable: function() { return this.selectTable; },

        getSelectId: function() { return this.selectId; },
        setSelectId: function(id) { this.selectId = id; },

        getSelectIntValue: function() { return this.selectIntValue; },
        setSelectIntValue: function(value) { this.selectIntValue = value; },

        getSelectFieldIntValue: function() { return this.selectFieldIntValue; },

        getSelectFilter: function() { return this.selectFilter; },

        getSelectType: function() { return this.selectType; },
        setSelectType: function(type) { this.selectType = type; },

        getSelectNoUseActive: function() { return this.selectNoUseActive; },
        setSelectNoUseActive: function(value) { this.selectNoUseActive = value; },

        //

        getValue: function() { return this.value; },

        getTextMask: function() { return this.textMask; },

        getImage: function() { return this.image; },

        getMultiSelect: function() { return this.getMultiSelect(); },

        getGridAddEnabled: function() { return this.gridAddEnabled; },
        getGridEditEnabled: function() { return this.gridEditEnabled; },
        getGridRemoveEnabled: function() { return this.gridRemoveEnabled; },

        getLabelIndex: function() { return this._labelIndex; },

        getVisible: function() { return this.visible; },

        getKeyCol: function() { return this._keyCol; },
        setIndex: function(index) { this._index = index; },

        getKey: function() { return this.key; },

        getFormat: function() { return this.format; },

        getOptionGroup: function() { return this.optionGroup; },

        getTextAlign: function() { return this.textAlign; },
        getSize: function() { return this.size; },

        getInputDisabled: function() { return this.inputDisabled; },
        setToolbar: function(c) { /* TODO: implement this */},

        getHeight: function() { return this.height; },
        setHeight: function(height) { this.height = height; },
        getWidth: function() { return this.width; },
        setWidth: function(width) { this.width = width; },
        getTopFromProperty: function() { return this.topFromProperty; },
        getTop: function() { return this.top; },
        setTop: function(top) { this.top = top; },
        getTopToPrevious: function() { return this.topToPrevious; },
        getLeftFromProperty: function() { return this.leftFromProperty; },

        setLeft: function(left) { this.left = left; },
        getLeft: function() { return this.left; },

        getLeftLabel: function() { return this.leftLabel; },
        setLeftLabel: function(leftLabel) { this.leftLabel = leftLabel; },

        getLeftToPrevious: function() { return this.leftToPrevious; },

        getTabIndex: function() { return this.tabIndex; },
        getTopFrame: function() { return this.topFrame; },

        getLeftFrame: function() { return this.leftFrame; },
        getButtons: function() { return this.buttons; },

        getLeftNotChange: function() { return this.leftNotChange; },
        setLeftNotChange: function(leftNoChange) { this.leftNotChange = leftNoChange; },
        getTopNotChange: function() { return this.topNotChange; },
        setTopNotChange: function(topNoChange) { this.topNotChange = topNoChange; },

        setLabelIndex: function(labelIndex) { this._labelIndex = labelIndex; },

        getToolbar: function() { return this.toolbar; },
        getIsEditProperty: function() { return this.isEditProperty; },
        getNoShowButton: function() { return this.hideButton; },

        getFontName:      function()          { return this.fontName; },
        setFontName:      function(name)      { this.fontName = name; },
        getFontSize:      function()          { return this.fontSize; },
        setFontSize:      function(size)      { this.fontSize = size; },
        getFontUnderline: function()          { return this.fontUnderline; },
        setFontUnderline: function(underline) { this.fontUnderline = underline; },
        getFontBold:      function()          { return this.fontBold; },
        setFontBold:      function(bold)      { this.fontBold = bold; },
        getFontItalic:    function()          { return this.fontItalic; },
        setFontItalic:    function(italic)    { this.fontItalic = italic; },

        getEnabled: function() { return this.enabled; }

      },

      validate: function(attrs, options) {
        var errors = {};
        if(! attrs.type) {
          errors.type = "can't be blank";
        }
        if( ! _.isEmpty(errors)) {
          return errors;
        }
      }
    });

    Dialogs.Properties = Backbone.Collection.extend({
      url: "",

      model: Dialogs.Property,
      comparator: "key"
    });

  });

}());