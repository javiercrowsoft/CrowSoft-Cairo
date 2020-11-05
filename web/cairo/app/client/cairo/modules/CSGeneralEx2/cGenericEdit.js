(function() {
  "use strict";

  var T = Cairo.Dialogs.PropertyType;

  var FieldType = {
    select: T.select,
    text: T.text,
    numeric: T.numeric,
    option: T.option,
    list: T.list,
    check: T.check,
    password: T.password,
    date: T.date,
    time: T.time,
    file: T.file,
    folder: T.folder,
    image: T.image,
    listSql: 127
  };

  var FieldSubType = Cairo.Dialogs.PropertySubType;

  var createField = function() {

    var self = {};

    var C_NO_VALUE = "##_no_value_##";

    var m_tblId = 0;
    var m_tabla = "";
    var m_id = 0;
    var m_name = "";
    var m_realName = "";
    var m_type = 0;
    var m_subType;
    var m_order = 0;
    var m_selectType = Cairo.Select.SelectType.normal;
    var m_filter = "";
    var m_defaultValue = "";
    var m_minValue = "";
    var m_maxValue = "";
    var m_textAlign;
    var m_textMask = "";
    var m_format = "";
    var m_noShowButton = false;
    var m_listSql = "";

    var m_selectIntValue = "";

    var m_value = C_NO_VALUE;

    self.getTblId = function() {
      return m_tblId;
    };

    self.setTblId = function(value) {
      m_tblId = value;
    };

    self.getTabla = function() {
      return m_tabla;
    };

    self.setTabla = function(value) {
      m_tabla = value;
    };

    self.getId = function() {
      return m_id;
    };

    self.setId = function(value) {
      m_id = value;
    };

    self.getName = function() {
      return m_name;
    };

    self.setName = function(value) {
      m_name = value;
    };

    self.getRealName = function() {
      return m_realName;
    };

    self.setRealName = function(value) {
      m_realName = value;
    };

    self.getType = function() {
      return m_type;
    };

    self.setType = function(value) {
      m_type = value;
    };

    self.getSubType = function() {
      if(m_type === FieldType.numeric) {
        if(m_subType !== 0) {
          return m_subType;
        }
        else {
          return FieldSubType.integer;
        }
      }
      else {
        return m_subType;
      }
    };

    self.setSubType = function(value) {
      m_subType = value;
    };

    self.getOrder = function() {
      return m_order;
    };

    self.setOrder = function(value) {
      m_order = value;
    };

    self.getSelectType = function() {
      return m_selectType;
    };

    self.setSelectType = function(value) {
      m_selectType = value;
    };

    self.getFilter = function() {
      return m_filter;
    };

    self.setFilter = function(value) {
      m_filter = replaceMacro(value);
    };

    self.getDefaultValue = function() {
      return m_defaultValue;
    };

    self.setDefaultValue = function(value) {
      m_defaultValue = value;
    };

    self.getMinValue = function() {
      return m_minValue;
    };

    self.setMinValue = function(value) {
      m_minValue = value;
    };

    self.getMaxValue = function() {
      return m_maxValue;
    };

    self.setMaxValue = function(value) {
      m_maxValue = value;
    };

    self.getTextAlign = function() {
      return m_textAlign;
    };

    self.setTextAlign = function(value) {
      m_textAlign = value;
    };

    self.getTextMask = function() {
      return m_textMask;
    };

    self.setTextMask = function(value) {
      m_textMask = value;
    };

    self.getFormat = function() {
      return m_format;
    };

    self.setFormat = function(value) {
      m_format = value;
    };

    self.getNoShowButton = function() {
      return m_noShowButton;
    };

    self.setNoShowButton = function(value) {
      m_noShowButton = value;
    };

    self.getListSql = function() {
      return m_listSql;
    };

    self.setListSql = function(value) {
      m_listSql = value;
    };

    self.getValue = function() {
      if(m_value === C_NO_VALUE) {
        return m_defaultValue;
      }
      else {
        return m_value;
      }
    };

    self.setValue = function(value) {
      m_value = value;
    };

    self.getSelectIntValue = function() {
      return m_selectIntValue;
    };

    self.setSelectIntValue = function(value) {
      m_selectIntValue = value;
    };

    var replaceMacro = function(value) {
      return ( value
        .replace("@@emp_id", Cairo.Company.getId())
        .replace("@@us_id", Cairo.User.getId())
      );
    };

    return self;
  };
  
  Cairo.module("GenericEdit.Edit", function(Edit, Cairo, Backbone, Marionette, $, _) {

    var createObject = function() {

      var self = {};

      var getText = Cairo.Language.getText;
      var Dialogs = Cairo.Dialogs;
      var Types = Cairo.Constants.Types;

      var C_MODULE = "cGenericEdit";

      var C = Cairo.General.Constants;
      var valField = Cairo.Database.valField;

      var m_fields = Cairo.Collections.createCollection(createField);

      self.init = function(fields) {

        m_fields.clear();

        for(var _i = 0; _i < fields.length; _i += 1) {

          var field = m_fields.add(null, valField(fields[_i], C.TBLI_ID));

          field.setId(valField(fields[_i], C.TBLI_ID));
          field.setName(valField(fields[_i], C.TBLI_NAME));
          field.setRealName(valField(fields[_i], C.TBLI_NOMBRE_FISICO));
          field.setType(valField(fields[_i], C.TBLI_TIPO));
          field.setSubType(valField(fields[_i], C.TBLI_SUB_TIPO));
          field.setOrder(valField(fields[_i], C.TBLI_ORDEN));
          field.setTabla(valField(fields[_i], C.TBL_NOMBRE_FISICO));
          field.setTblId(valField(fields[_i], C.TBL_ID_HELP));
          field.setSelectType(valField(fields[_i], C.TBLI_HELP_TYPE));
          field.setFilter(valField(fields[_i], C.TBLI_FILTRO));
          field.setDefaultValue(valField(fields[_i], C.TBLI_DEFAULT_VALUE));
          field.setMinValue(valField(fields[_i], C.TBLI_MIN_VALUE));
          field.setMaxValue(valField(fields[_i], C.TBLI_MAX_VALUE));
          field.setTextAlign(valField(fields[_i], C.TBLI_TEXT_ALIGN));
          field.setTextMask(valField(fields[_i], C.TBLI_TEXT_MASK));
          field.setFormat(valField(fields[_i], C.TBLI_FORMAT));
          field.setNoShowButton(valField(fields[_i], C.TBLI_NO_SHOW_BUTTON));
          field.setListSql(valField(fields[_i], C.TBLI_SQLSTMT));
        }

        return true;
      };

      self.load = function(values) {

        var i = 0;

        var _count = m_fields.size();
        for(var _i = 0; _i < _count; _i++) {

          var field = m_fields.item(_i);
          if(field.getType() === FieldType.select) {

            field.setSelectIntValue(valField(values, i));
            i += 1;

            field.setValue(valField(values, i));
            i += 1;
          }
          else {
            field.setValue(valField(values, i));
            i += 1;
          }
        }

        return true;
      };

      self.loadCollection = function(dialog) {

        if(m_fields.count() === 0) {
          return true;
        }

        var i = 0;

        var tab = dialog.getTabs().add(null);
        var tabIndex = dialog.getTabs().count() - 1;

        tab.setName(getText(4786, "")); // Campos Adicionales
        tab.setIndex(tabIndex);

        var _count = m_fields.size();
        for(var _i = 0; _i < _count; _i++) {
          var field = m_fields.item(_i);

          i += 1;

          var property = dialog.getProperties().add(null, getKey(i));
          property.setType(field.getType() === FieldType.listSql ? FieldType.list : field.getType());
          property.setSubType(field.getSubType());
          property.setTabIndex(tabIndex);
          property.setName(getLabelName(field.getName()));

          switch (field.getType()) {

            case FieldType.check:

              property.setValue(Cairo.Util.val(field.getValue()));
              break;

            case FieldType.date:

              if(Cairo.Util.isDate(field.getValue())) {
                property.setValue(Cairo.Util.getDateValue(field.getValue()));
              }
              else {
                property.setValue(Cairo.Constants.NO_DATE);
              }
              break;

            case FieldType.select:

              property.setValue(field.getValue());
              property.setSelectId(Cairo.Util.val(field.getSelectIntValue()));
              property.setSelectIntValue(field.getSelectIntValue());
              property.setSelectFilter(field.getFilter());
              property.setTable(field.getTblId());
              break;

            case FieldType.list:

              property.setListWhoSetItem(Dialogs.ListWhoSetItem.itemData);
              property.setListItemData(Cairo.Util.val(field.getValue()));
              var list = field.getListSql().split("|");

              for(var k = 0; k <= list.length; k += 2) {

                var elem = property.getList().add(null);
                elem.setId(Cairo.Util.val(list(k + 1)));
                elem.setValue(list(k));

              }
              break;

            case FieldType.numeric:

              property.setValue(Cairo.Util.val(field.getValue()));
              break;

            case FieldType.text:

              property.setValue(field.getValue());
              break;

            case FieldType.listSql:

              property.setListWhoSetItem(Dialogs.ListWhoSetItem.itemData);
              property.setListItemData(Cairo.Util.val(field.getValue()));

              var _count = field.getListSql();
              for(var _i = 0; _i < _count; _i++) {

                var item = field.getListSql().get(_i);
                var elem = property.getList().add(null);
                elem.setId(valField(item, 0));
                elem.setValue(valField(item, 1));
              }
              break;

            case FieldType.file:

              property.setSelectFilter(field.getFilter());
              property.setValue(field.getValue());
              break;

            case FieldType.folder:

              property.setSelectFilter(field.getFilter());
              property.setValue(field.getValue());
              break;

            case FieldType.image:
              break;

            case FieldType.label:

              property.setValue(field.getValue());
              break;
          }
        }

        return true;
      };

      self.validate = function(dialog) {
        return true;
      };

      self.save = function(dialog, register) {

        var field = null;
        var property = null;

        var _count = m_fields.size();
        for(var _i = 0; _i < _count; _i++) {

          field = m_fields.item(_i);
          property = dialog.getProperties().item(getKey(_i));

          switch (field.getType()) {

            case FieldType.check:
              register.getFields().add(field.getRealName(), property.getValue(), Types.boolean);
              break;

            case FieldType.date:
              register.getFields().add(field.getRealName(), property.getValue(), Types.date);
              break;

            case FieldType.select:
              register.getFields().add(field.getRealName(), property.getSelectId(), Types.id);
              break;

            case FieldType.list:
              register.getFields().add(field.getRealName(), property.getListItemData(), Types.integer);
              break;

            case FieldType.numeric:
              register.getFields().add(field.getRealName(), property.getValue(), Types.double);
              break;

            case FieldType.text:
              register.getFields().add(field.getRealName(), property.getValue(), Types.text);
              break;

            case FieldType.listSql:
              register.getFields().add(field.getRealName(), property.getListItemData(), Types.integer);
              break;

            case FieldType.file:
              register.getFields().add(field.getRealName(), property.getValue(), Types.text);
              break;

            case FieldType.folder:
              register.getFields().add(field.getRealName(), property.getValue(), Types.text);
              break;
          }
        }

        return true;
      };

      self.refreshProperties = function(dialog) {

        var _count = m_fields.size();
        for(var _i = 0; _i < _count; _i++) {

          var field = m_fields.item(_i);
          var property = dialog.getProperties().item(getKey(_i));

          switch (field.getType()) {

            case FieldType.check:
              property.setValue(Cairo.Util.val(field.getValue()));
              break;

            case FieldType.date:
              property.setValue(field.getValue());
              break;

            case FieldType.select:
              property.setSelectId(Cairo.Util.val(field.getSelectIntValue()));
              property.setSelectIntValue(field.getSelectIntValue());
              break;

            case FieldType.list:
              property.setListItemData(Cairo.Util.val(field.getValue()));
              break;

            case FieldType.numeric:
              property.setValue(Cairo.Util.val(field.getValue()));
              break;

            case FieldType.text:
              property.setValue(field.getValue());
              break;

            case FieldType.listSql:
              property.setListItemData(Cairo.Util.val(field.getValue()));
              break;

            case FieldType.file:
              property.setValue(field.getValue());
              break;

            case FieldType.folder:
              property.setValue(field.getValue());
              break;
          }
        }
      };

      self.propertyChange = function(key) {
        return true;
      };

      var getKey = function(idx) {
        return "add_field_"+ idx.toString();
      };

      var getLabelName = function(name) {
        if(name.substr(0, 6) === "@@lng:") {
          var code = name.substring(7);
          return getText(code, name);
        }
        else {
          return name;
        }
      };

      self.destroy = function() {
        try {

          m_fields.clear();
          m_fields = null;

        }
        catch(ex) {
          Cairo.manageErrorEx(ex.message, ex, "terminate", C_MODULE, "");
        }
      };

      return self;
    };

    Edit.Controller = { getEditor: createObject };

  });

}());