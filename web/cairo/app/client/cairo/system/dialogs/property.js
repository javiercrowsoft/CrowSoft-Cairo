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

    Dialogs.createProperty = function() {

      var self = {
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
        gridMultiSelect:        false,

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

        _unPressedBackColor: -1
    };

    self.getName = function() { return  self.name; },

    self.getControl = function() { return  self._ctl; },
    self.setControl = function(control) {  self._ctl = control; },
    self.getControlLoaded = function() { return  self._controlLoaded; },
    self.setControlLoaded = function(loaded) {  self._controlLoaded = loaded; },

    self.getIndex = function() { return  self._index; },

    self.getGrid = function() { return  grid; },
    self.getGridRemoveEnable = function() { return  self.gridRemoveEnabled; },
    self.setGridRemoveEnable = function(enabled) {  self.gridRemoveEnabled = enabled; },

    self.setSelectedRow = function(row) {  self.gridSelectedRow = row; },
    self.getSelectedRow = function() { return  self.gridSelectedRow; },
    self.getForeColor = function() { return  self.foreColor; },
    self.getBackColor = function() { return  self.backColor; },
    self.setBackColor = function(color) {  self.backColor = color; },
    self.setBackColorUnpressed = function(backColor) {  self._unPressedBackColor = backColor; },

    self.getType = function() { return self.type; },
    self.setType = function(type) {  self.type = type; },
    self.getSubType = function() { return  self.subType; },
    self.setSubType = function(subType) {  self.subType = subType; },

    // list
    //

    self.getList = function() { return  self.list; },
    self.getListWhoSetItem = function() { return  self.listWhoSetItem; },

    self.getListItemData = function() { return  self.listItemData; },
    self.setListItemData = function(index) {  self.listItemData = index; },

    self.getListIndex = function() { return self.listListIndex; },
    self.setListIndex = function(index) {  self.listListIndex = index; },

    self.getListText = function() { return  self.listText; },
    self.setListText = function(text) { return  self.listText = text; },

    // select
    //
    self.getSelectTable = function() { return  self.selectTable; },

    self.getSelectId = function() { return  self.selectId; },
    self.setSelectId = function(id) {  self.selectId = id; },

    self.getSelectIntValue = function() { return  self.selectIntValue; },
    self.setSelectIntValue = function(value) {  self.selectIntValue = value; },

    self.getSelectFieldIntValue = function() { return  self.selectFieldIntValue; },

    self.getSelectFilter = function() { return  self.selectFilter; },

    self.getSelectType = function() { return  selectType; },
    self.setSelectType = function(type) {  selectType = type; },

    self.getSelectNoUseActive = function() { return  selectNoUseActive; },
    self.setSelectNoUseActive = function(value) {  selectNoUseActive = value; },

    //

    self.getValue = function() { return  self.value; },

    self.getTextMask = function() { return  self.textMask; },

    self.getImage = function() { return  self.image; },

    self.getMultiSelect = function() { return  self.gridMultiSelect; },

    self.getGridAddEnabled = function() { return  self.gridAddEnabled; },
    self.getGridEditEnabled = function() { return  self.gridEditEnabled; },
    self.getGridRemoveEnabled = function() { return  self.gridRemoveEnabled; },

    self.getLabelIndex = function() { return  self._labelIndex; },

    self.getVisible = function() { return  self.visible; },

    self.getKeyCol = function() { return  self._keyCol; },
    self.setIndex = function(index) {  self._index = index; },

    self.getKey = function() { return  self.key; },

    self.getFormat = function() { return  self.format; },

    self.getOptionGroup = function() { return  self.optionGroup; },

    self.getTextAlign = function() { return  self.textAlign; },
    self.getSize = function() { return  self.size; },

    self.getInputDisabled = function() { return  self.inputDisabled; },

    self.setToolbar = function(c) { /* TODO = implement this */},

    self.getHeight = function() { return  self.height; },
    self.setHeight = function(height) {  self.height = height; },

    self.getWidth = function() { return  self.width; },
    self.setWidth = function(width) {  self.width = width; },

    self.getTopFromProperty = function() { return  self.topFromProperty; },

    self.getTop = function() { return  self.top; },
    self.setTop = function(top) {  self.top = top; },

    self.getTopToPrevious =     function() { return  self.topToPrevious; },
    self.getLeftFromProperty =  function() { return  self.leftFromProperty; },

    self.setLeft = function(left) {  self.left = left; },
    self.getLeft = function() { return  self.left; },

    self.getLeftLabel = function() { return  self.leftLabel; },
    self.setLeftLabel = function(left) {  self.leftLabel = left; },

    self.getLeftToPrevious = function() { return  self.leftToPrevious; },

    self.getTabIndex = function() { return  self.tabIndex; },
    self.setTabIndex = function(index) { self.tabIndex = index; },

    self.getTabIndex2 = function() { return  self.tabIndex2; },
    self.setTabIndex2 = function(index) { self.tabIndex2 = index; },

    self.getTopFrame =  function() { return  self.topFrame; },
    self.getLeftFrame = function() { return  self.leftFrame; },

    self.getButtons = function() { return  self.buttons; },

    self.getLeftNotChange = function()              { return  self.leftNotChange; },
    self.setLeftNotChange = function(leftNotChange)  {  self.leftNotChange = leftNotChange; },
    self.getTopNotChange =  function()              { return  self.topNotChange; },
    self.setTopNotChange =  function(topNotChange)   {  self.topNotChange = topNotChange; },

    self.setLabelIndex = function(labelIndex) {  self._labelIndex = labelIndex; },

    self.getToolbar =         function() { return  self.toolbar; },
    self.getIsEditProperty =  function() { return  self.isEditProperty; },
    self.getNoShowButton =    function() { return  self.hideButton; },

    self.getFontName =      function()          { return  self.fontName; },
    self.setFontName =      function(name)      {  self.fontName = name; },
    self.getFontSize =      function()          { return  self.fontSize; },
    self.setFontSize =      function(size)      {  self.fontSize = size; },
    self.getFontUnderline = function()          { return  self.fontUnderline; },
    self.setFontUnderline = function(underline) {  self.fontUnderline = underline; },
    self.getFontBold =      function()          { return  self.fontBold; },
    self.setFontBold =      function(bold)      {  self.fontBold = bold; },
    self.getFontItalic =    function()          { return  self.fontItalic; },
    self.setFontItalic =    function(italic)    {  self.fontItalic = italic; },

    self.getEnabled = function() { return  self.enabled; }
      

      return self;

    };

    Dialogs.createProperties = function() {
      var items = [];
      var keys = {};
      var count = 0;

      var add = function(value, key) {
        //
        // if a key is present we need to validate it
        //
        if(key !== undefined) {
          //
          // key is alwas string
          //
          key = key.toString();
          if(keys[key] !== undefined) {
            throw new Error("Can't add this item. There is already an object with this key [" + key + "] in the colletion.");
          }
          keys[key] = count;
        }
        value = value || Dialogs.createProperty();
        items[count] = value;
        count += 1;

        return value;
      };

      var item = function(index) {
        if(typeof index === "number") {
          if(index < 0 || index >= count) {
            throw new Error("Index out of bounds. Index: " + index.toString());
          }
        }
        else {
          var key = index.toString();
          index = keys[key];
          if(index === undefined) {
            throw new Error("This key is not present in this collection. Key: " + key);
          }
        }
        return items[index];
      };
    }

  });

}());