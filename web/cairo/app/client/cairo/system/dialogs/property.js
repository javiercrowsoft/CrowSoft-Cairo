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
        selectedIndex:          0,

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

        picture:                '',

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
        _keyCol:        ''
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