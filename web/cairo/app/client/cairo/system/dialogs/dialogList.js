(function() {
  "use strict";

  Cairo.module("Dialogs.Views", function(Views, Cairo, Backbone, Marionette, $, _) {

    Views.ListController = {

      newDialogList: function() {

        var self = {};

        var Dialogs = Cairo.Dialogs;

        var C_MODULE = "DialogList";

        var m_client = null;
        var m_properties = null;
        var m_view;

        var m_bIsParam;
        var m_showingForm;
        var m_refreshing = false;

        var getView = function() {
          return m_view;
        };

        var init = function(view) {
          try {
            m_view = view;
            m_bIsParam = view.getType() === "ListDoc";

            m_view.addListener({
              newClick:                   newClick,
              deleteClick:                deleteClick,
              printClick:                 printClick,

              saveParamsClick:            saveParams,
              discardChangesClick:        discardChanges,

              viewDestroy:                viewDestroy,

              comboChange:                comboChange,
              checkBoxClick:              checkBoxClick,
              selectChange:               selectChange,
              maskEditChange:             maskEditChange,
              dateChange:                 dateChange,
              optionButtonClick:          optionButtonClick,
              textChange:                 textChange,
              textPasswordChange:         textPasswordChange,
              textButtonClick:            textButtonClick
            });
          }
          catch (ex) {
            Cairo.manageErrorEx(ex.message, ex, "init", C_MODULE, "");
          }
        };

        self.getProperties = function() {
          return m_properties;
        };

        self.refresh = function() {
          refreshAux();
          return m_client.refresh();
        };

        self.show = function(client,  view) {
          if(client !== null) {

            m_client = client;

            init(view);

            if(showForm()) {
              getView().setTitle(m_client.getTitle());
              return true;
            }
            else {
              return false;
            }
          }
          else {
            return false;
          }
        };

        self.showValue = function(property) {
          var item = null;
          var view = getView();

          switch (property.getType()) {

            case Dialogs.PropertyType.list:
              var c = view.getList().item(property.getIndex());
              c.clear();
              for(var _i = 0, _count = property.getList().size(); _i < _count; _i++) {
                item = property.getList().item(_i);
                c.add(item.getValue());
                c.setItemData(c.getNewIndex(), item.getId());
              }
              switch(property.getListWhoSetItem()) {

                case Dialogs.ListWhoSetItem.itemData:
                  Cairo.Util.List.setListIndexForId(c, property.getListItemData());
                  break;

                case Dialogs.ListWhoSetItem.index:
                  Cairo.Util.List.setListIndex(c, property.getListIndex());
                  break;

                case Dialogs.ListWhoSetItem.text:
                  Cairo.Util.List.setListIndexForText(c, property.getListText());
                  break;
              }

              if(c.getListIndex() === -1 && c.count() > 0) { c.setListIndex(0); }
              c.setEnabled(property.getEnabled());

              break;

            case Dialogs.PropertyType.select:

              var c = view.getSelects().get(property.getIndex());

              c.setId(
                (property.getSelectIntValue() !== "")
                  ? property.getSelectIntValue()
                  : property.getSelectId());

              c.setValue(property.getValue());
              c.setIntValue(property.getSelectIntValue());
              c.setFieldIntValue(property.getSelectFieldIntValue());
              c.setFilter(property.getSelectFilter());
              c.setTable(property.getSelectTable());
              c.setEnabled(property.getEnabled());

              break;

            case Dialogs.PropertyType.numeric:

              var c = view.getMaskEdits().get(property.getIndex());
              c.setValue(property.getValue());
              c.setEnabled(property.getEnabled());

              break;

            case Dialogs.PropertyType.date:
            case Dialogs.PropertyType.time:

              var c = view.getDatePickers().get(property.getIndex());
              c.setValue(property.getValue());
              c.setEnabled(property.getEnabled());

              break;

            case Dialogs.PropertyType.option:

              var c = view.getOptionButtons().get(property.getIndex());
              c.setValue(property.getValue());
              c.setEnabled(property.getEnabled());

              break;

            case Dialogs.PropertyType.text:
            case Dialogs.PropertyType.file:
            case Dialogs.PropertyType.folder:

              var c = null;
              if(property.getSubType() === Dialogs.PropertySubType.memo) {
                c = view.getTextAreas().get(property.getIndex());
              }
              else {
                c = view.getTextInputs().get(property.getIndex());
                if(c.setMask !== undefined) {
                  c.setMask(property.getTextMask());
                }
              }

              c.setText(property.getValue());
              c.setEnabled(property.getEnabled());

              // if there is a mask we need to update the value applying this mask
              //
              if(c.getMask !== undefined) {
                if(c.getMask() !== "") {
                  property.setValue(c.getText());
                }
              }

              break;

            case Dialogs.PropertyType.password:

              var c = view.getPasswordInputs().get(property.getIndex());
              c.setText(property.getValue());
              c.setEnabled(property.getEnabled());

              break;

            case Dialogs.PropertyType.check:

              var c = view.getCheckBoxes().get(property.getIndex());
              c.setValue(Cairo.Util.val(property.getValue()) !== 0);
              c.setEnabled(property.getEnabled());

              break;
          }

          return true;
        };

        var comboChange = function(index) {
          changeProperty(Dialogs.PropertyType.list, index, getView().getCombos().item(index));
        };

        var checkBoxClick = function(index) {
          changeProperty(Dialogs.PropertyType.check, index, getView().getCheckBoxes().item(index));
        };

        var discardChanges = function(dontCallClient) {
          var p = null;

          try {

            if(!dontCallClient) {
              p = m_client.discardChanges();
            }
          }
          catch(e) {
            Cairo.manageError(
              "Discard Changes",
              "An error has occurred when discarding changes.",
              e.message,
              e);
          }

          return (p || Cairo.Promises.resolvedPromise(true));
        };

        var refreshList = function() {
          try {
            refreshAux();
            m_client.refresh();
            return;
          }
          catch (ex) {
            Cairo.manageErrorEx(ex.message, ex, "refreshList", C_MODULE, "");
          }
        };

        var clientSaveParams = function() {
          return m_client.save();
        };

        var validateParams = function() {
          return m_client.validate();
        };

        var saveParams = function() {
          try {
            validateParams().success(clientSaveParams);
          }
          catch (ignore) {}
        };

        var newClick = function() { /* TODO: implement this */ };

        var deleteClick = function() { /* TODO: implement this */ };

        var printClick = function() { /* TODO: implement this */ };

        var selectChange = function(index) {
          changeProperty(Dialogs.PropertyType.select, index, getView().getSelects().item(index));
        };

        var maskEditChange = function(index) {
          changeProperty(Dialogs.PropertyType.numeric, index, getView().getMaskEdits().item(index));
        };

        var dateChange = function(index) {
          changeProperty(Dialogs.PropertyType.date, index, getView().getDatePickers().item(index));
        };

        var optionButtonClick = function(index) {
          changeProperty(Dialogs.PropertyType.option, index, getView().getOptionButtons().item(index));
        };

        var textButtonClick = function(index) {
          var input = getView().getTextInputs().item(index);
          Cairo.inputFormView("", "Text", input.getText(), function(text) {
            input.setText(text);
          });
        };

        var textChange = function(index) {
          changeProperty(Dialogs.PropertyType.text, index, getView().getTextInputs().item(index));
        };

        var textPasswordChange = function(index) {
          changeProperty(Dialogs.PropertyType.password, index, getView().getPasswordInputs().item(index));
        };

        var showForm = function() {

          m_showingForm = true;

          for(var _i = 0, _count = m_properties.size(); _i < _count; _i++) {
            var property = m_properties.item(_i);
            if(property.getControlLoaded() === false) {
              if(loadControl(property) === false) { 
                return false; 
              }
              property.setControlLoaded(true);
            }

            self.showValue(property);
          }

          getView().setFocusFirstControl();
          getView().setNoUseActive();

          m_showingForm = false;

          return true;
        };
        
        var loadControl = function(property) {

          var controlType = property.getType();
          var label = null;

          if(property.getType() !== Dialogs.PropertyType.option
            && property.getType() !== Dialogs.PropertyType.toolbar
            && property.getType() !== Dialogs.PropertyType.label
            && property.getType() !== Dialogs.PropertyType.title) {

            label = addControl(view, Dialogs.PropertyType.controlLabel);
          }

          var c = addControl(view, controlType, subType);

          switch (controlType) {

            case Dialogs.PropertyType.list:
              property.setIndex(getView().getCombos().count() - 1);
              break;

            case Dialogs.PropertyType.select:
              property.setIndex(getView().getSelects().count() - 1);
              c.HelpType = getView().HelpType;
              c.Table = property.getSelectTable();
              break;

            case Dialogs.PropertyType.numeric:
              property.setIndex(getView().getMaskEdits().count() - 1);
              c.csType = property.getSubType();
              if(property.getSubType() === 0) {
                Cairo.raiseError("DialogList.loadControl", "subType wasn't set for property: " + property.getName());
              }
              break;

            case Dialogs.PropertyType.date:
              property.setIndex(getView().getDatePickers().count() - 1);
              break;

            case Dialogs.PropertyType.option:
              property.setIndex(getView().getOptionButtons().count() - 1);
              break;

            case Dialogs.PropertyType.text:
              property.setIndex(getView().getTextInputs().count() - 1);
              c.setMaxLength(property.getSize());
              c.setButtonStyle((property.getSubType() === Dialogs.PropertyType.textButton 
                              || property.getSubType() === Dialogs.PropertyType.textButtonEx) 
                              ? Dialogs.ButtonStyle.single : Dialogs.ButtonStyle.none);
              break;

            case Dialogs.PropertyType.file:
              property.setIndex(getView().getTextInputs().count() - 1);
              c.setMaxLength(property.getSize());
              c.setType(Dialogs.PropertyType.file);
              break;

            case Dialogs.PropertyType.folder:
              property.setIndex(getView().getTextInputs().count() - 1);
              c.setMaxLength(property.getSize());
              c.setType(Dialogs.PropertyType.folder);
              break;

            case Dialogs.PropertyType.password:
              property.setIndex(getView().getPasswordInputs().count() - 1);
              break;

            case Dialogs.PropertyType.check:
              property.setIndex(getView().getCheckBoxes().count() - 1);
              break;
          }

          c.setVisible(true);
          c.setEnabled(property.getEnabled());

          setButton(c);

          property.setLabelIndex(label.getIndex());
          label.setText(property.getName());

          return true;
        };

        var setButton = function(control, property) {

          if(control.getType !== undefined) {
            if(!(
              control.getObjectType() === "Controls.input"
                && control.getType() !== Controls.InputType.text
              )
              && !(
              control.getObjectType() === "Controls.datePicker"
                && control.getType() !== Controls.DatePickerType.time
              )
              ) {

              if(control.getEnabled()) {

                if(property.getNoShowButton()) {
                  control.ButtonStyle = Dialogs.ButtonStyle.none;
                }
                else {
                  control.ButtonStyle = Dialogs.ButtonStyle.single;
                }
              }
              else {
                control.ButtonStyle = Dialogs.ButtonStyle.none;
              }
            }
          }
        };

        var changeProperty = function(nType,  index,  c) {

          if(m_refreshing || m_showingForm) {
            m_refreshing = false;
            return false;
          }

          for(var _i = 0, _count = m_properties.size(); _i < _count; _i++) {
            var property = m_properties.item(_i);
            var found = false;

            if(nType === Dialogs.PropertyType.text) {
              if(property.getType() === Dialogs.PropertyType.text
                || property.getType() === Dialogs.PropertyType.file
                || property.getType() === Dialogs.PropertyType.folder) {
                found = true;
              }

            }
            else {
              if(property.getType() === nType) {
                found = true;
              }
            }

            if(found) {

              if(property.getIndex() === index) {

                switch (nType) {
                  case Dialogs.PropertyType.list:
                    property.setListIndex(c.getListIndex());
                    property.setListText(c.getText());
                    if(c.getListIndex() >= 0) {
                      property.setListItemData(c.getItemData(c.getListIndex()));
                    }
                    else {
                      property.setListItemData(0);
                    }
                    break;

                  case Dialogs.PropertyType.text:
                  case Dialogs.PropertyType.password:
                  case Dialogs.PropertyType.file:
                  case Dialogs.PropertyType.folder:
                    property.setValue(c.Text);
                    break;

                  case Dialogs.PropertyType.numeric:
                    property.setValue(c.csValue);
                    break;

                  case Dialogs.PropertyType.date:
                    property.setValue(c.getValue());
                    property.setSelectIntValue(c.getDateName());
                    break;

                  case Dialogs.PropertyType.option:

                    for(var _j = 0, _count = m_properties.size(); _j < _count; _j++) {
                      var p = m_properties.item(_j);
                      if(p !== property) {
                        if(p.getType() === Dialogs.PropertyType.option
                          && p.getOptionGroup() === property.getOptionGroup()) {
                          p.setValue(0);
                        }
                      }
                    }

                    property.setValue(c.getValue());
                    break;

                  case Dialogs.PropertyType.select:
                    c.validate();
                    property.setValue(c.getValue());
                    property.setSelectId(Cairo.Util.val(c.getId()));
                    property.setSelectIntValue(c.getId);
                    break;

                  case Dialogs.PropertyType.check:
                    property.setValue(c.getValue());
                    break;
                }

                m_client.propertyChange(property.getKey());
                c.Enabled = property.getEnabled();

                self.showValue(property);
                break;
              }
            }
          }

          m_refreshing = false;
          return true;
        };

        var refreshAux = function() {
          var index = null;
          var property = null;
          var m_properties = null;
          var i = null;

          m_properties = m_properties;

          for(i = 1; i <= m_properties.count(); i++) {

            property = m_properties(i);
            index = property.getIndex();

            switch (m_properties(i).PropertyType) {

              case Dialogs.PropertyType.check:
                changeProperty(Dialogs.PropertyType.check, index, getView().getCheckBoxes().item(index));
                break;

              case Dialogs.PropertyType.date:
                changeProperty(Dialogs.PropertyType.date, index, getView().getDatePickers().item(index));
                break;

              case Dialogs.PropertyType.select:
                changeProperty(Dialogs.PropertyType.select, index, getView().getSelects().item(index));
                break;

              case Dialogs.PropertyType.list:
                changeProperty(Dialogs.PropertyType.list, index, getView().getCombos().item(index));
                break;

              case Dialogs.PropertyType.numeric:
                changeProperty(Dialogs.PropertyType.numeric, index, getView().getMaskEdits().item(index));
                break;

              case Dialogs.PropertyType.option:
                changeProperty(Dialogs.PropertyType.option, index, getView().getOptionButtons().item(index));
                break;

              case Dialogs.PropertyType.password:
                changeProperty(Dialogs.PropertyType.password, index, getView().getPasswordInputs().item(index));
                break;

              case Dialogs.PropertyType.text:
                changeProperty(Dialogs.PropertyType.text, index, getView().getTextInputs().item(index));
                break;
            }
          }
        };

        var addControl = function(view, type, subType) {
          var ctrl = null;

          switch(type) {
            case Dialogs.PropertyType.select:
              ctrl = view.getSelects().add();
              break;

            case Dialogs.PropertyType.text:
            case Dialogs.PropertyType.file:
            case Dialogs.PropertyType.folder:

              if(subType === Dialogs.PropertySubType.memo) {
                ctrl = view.getTextAreas().add();
              }
              else {
                ctrl = view.getTextInputs().add();
              }
              break;

            case Dialogs.PropertyType.numeric:
              ctrl = view.getMaskEdits().add();
              break;

            case Dialogs.PropertyType.option:
              ctrl = view.getOptionButtons().add();
              break;

            case Dialogs.PropertyType.list:
              ctrl = view.getCombos().add();
              break;

            case Dialogs.PropertyType.check:
              ctrl = view.getCheckBoxes().add();
              break;

            case Dialogs.PropertyType.password:
              ctrl = view.getPasswordInputs().add();
              break;

            case Dialogs.PropertyType.date:
            case Dialogs.PropertyType.time:
              ctrl = view.getDatePickers().add();
              break;

            case Dialogs.PropertyType.button:
              ctrl = view.getButtons().add();
              break;

            case Dialogs.PropertyType.progressBar:
              ctrl = view.getProgressBars().add();
              break;

            case Dialogs.PropertyType.label:
              ctrl = view.getLabels().add();
              break;

            case Dialogs.PropertyType.title:
              ctrl = view.getTitleLabels().add();
              break;

            case Dialogs.PropertyType.controlLabel:
              ctrl = view.getCtrlLabels().add();
              break;
          }

          return ctrl;
        };

        var initialize = function() {
          m_properties = new Dialogs.createProperties();
        };

        var destroy = function() {
          m_properties = null;
          m_client = null;
        };

        var viewDestroy = function(cancel) {
          try {
            if(m_client !== null) {
              m_client.terminate();
              m_client = null;
            }
            m_view = null;
          }
          catch(ignore) {
            Cairo.logError("Error in viewDestroy", ignore);
          }

          try {
            destroy();
          }
          catch(ignore) {
            Cairo.logError("Error in viewDestroy", ignore);
          }
        };

        initialize();

        return self;
      }
    }

  });

}());