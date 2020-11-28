(function() {
  "use strict";

  /*
      this module manages a wizard view ...
  */

  ///////////////
  // Entities
  ///////////////

  Cairo.module("Dialogs.WizardViews", function(WizardViews, Cairo, Backbone, Marionette, $, _) {

    var P = Cairo.Promises;

    WizardViews.Controller = {

      newWizard: function() {

        var Dialogs = Cairo.Dialogs;

        var m_dialog = null;
        var m_steps = null;
        var m_client = null;

        var m_currentStep;
        var m_wizardShowed = false;

        var m_pushVirtualNext = false;
        var m_closeWizardAfterSave = false;
        var m_wizardClosed = false;
        var m_restartVirtualPush = false;
        
        var self = {};

        self.getDialog = function() {
          return m_dialog;
        };

        self.setClient = function(value) {
          m_client = value;
        };

        self.getClient = function() {
          return m_client;
        };

        self.getPushVirtualNext = function() {
          return m_pushVirtualNext;
        };

        self.setPushVirtualNext = function(value) {
          m_pushVirtualNext = value;
        };

        self.setRestartVirtualPush = function(value) {
          m_restartVirtualPush = value
        };

        self.getCloseWizardAfterSave = function() {
          return m_closeWizardAfterSave;
        };

        self.setCloseWizardAfterSave = function(value) {
          m_closeWizardAfterSave = value;
        };

        self.setCancelVisible = function(value) {
          m_dialog.getCmdCancel().setVisible(value);
        };

        self.setBackVisible = function(value) {
          m_dialog.getCmdBack().setVisible(value);
        };

        self.setNextVisible = function(value) {
          m_dialog.getCmdNext().setVisible(value);
        };

        self.disableBack = function() {
          m_dialog.getCmdBack().setEnabled(false);
        };

        self.enableBack = function() {
          m_dialog.getCmdBack().setEnabled(true);
        };

        self.setNextText = function(text) {
          m_dialog.getCmdNext().setText(text);
        };

        self.getWizardClosed = function() {
          return m_wizardClosed;
        };

        self.getPath = function() {
          return m_client.getPath();
        };

        self.getEditorName = function() {
          return m_client.getEditorName();
        };

        self.copy = function() {
        };

        self.editNew = function() {
        };

        self.getTitle = function() {
          return m_client.getTitle();
        };

        self.validate = function() {
          return Cairo.Promises.resolvedPromise(true);
        };

        self.getApplication = function() {
        };

        self.editDocumentsEnabled = function() {
        };

        self.copyEnabled = function() {
        };

        self.addEnabled = function() {
        };

        self.showDocDigital = function() {
        };

        self.messageEx = function(messageId, info) {
          if(m_client === null || m_client.messageEx === undefined) {
            var p = null;

            switch (messageId) {
              case Dialogs.Message.MSG_GRID_VIRTUAL_ROW:

                p = Cairo.Promises.resolvedPromise(info);
                break;
            }
            return p || Cairo.Promises.resolvedPromise(true);
          }
          else {
            return m_client.messageEx(messageId, info).then(function(response) {
              //
              // if the client doesn't handle the GRID_VIRTUAL_ROW message
              // we just return the info parameter
              //
              if(messageId === Dialogs.Message.MSG_GRID_VIRTUAL_ROW
                  && (
                    response.getObjectType === undefined
                      || response.getObjectType() !== Cairo.Dialogs.Grids.VirtualRowType
                  )
                ) {
                return info;
              }
              else {
                return response;
              }
            });
          }
        };

        self.columnAfterEdit = function(key, lRow, lCol, newValue, newValueId) {
          return m_client.columnAfterEdit(key, lRow, lCol, newValue, newValueId);
        };

        self.columnAfterUpdate = function(key, lRow, lCol) {
          return m_client.columnAfterUpdate(key, lRow, lCol);
        };

        self.columnBeforeEdit = function(key, lRow, lCol, iKeyAscii) {
          return m_client.columnBeforeEdit(key, lRow, lCol, iKeyAscii);
        };

        self.columnButtonClick = function(key, lRow, lCol, iKeyAscii) {
          return m_client.columnButtonClick(key, lRow, lCol, iKeyAscii);
        };

        self.columnClick = function(key, lRow, lCol) {
          return m_client.columnClick(key, lRow, lCol);
        };

        self.dblClick = function(key, lRow, lCol) {
          return m_client.dblClick(key, lRow, lCol);
        };

        self.deleteRow = function(key, row, lRow) {
          return m_client.deleteRow(key, row, lRow);
        };

        self.isEmptyRow = function(key, row, rowIndex) {
          return m_client.isEmptyRow(key, row, rowIndex);
        };

        self.newRow = function(key, rows) {
          return m_client.newRow(key, rows);
        };

        self.validateRow = function(key, row, rowIndex) {
          return m_client.validateRow(key, row, rowIndex);
        };

        self.getCmdBack = function() {
          return m_dialog.getCmdBack();
        };

        self.getCmdCancel = function() {
          return m_dialog.getCmdCancel();
        };

        self.getCmdNext = function() {
          return m_dialog.getCmdNext();
        };

        self.setDialog = function(value) {
          m_dialog = value;
        };

        self.getDialog = function() {
          return m_dialog;
        };

        self.loadControl = function(property) {
          return m_dialog.loadControlEx(property);
        };

        self.showValue = function(property) {
          m_dialog.showValueEx(property);
        };

        self.setSteps = function(value) {
          m_steps = value;
        };

        self.getSteps = function() {
          return m_steps;
        };
        
        self.moveNext = function() {
          return nextStep(m_currentStep);
        };
        
        self.moveBack = function() {
          return previousStep(m_currentStep);
        };

        self.clear = function(stepIndex) {
          if(m_steps.contains(stepIndex)) {
            var properties = m_steps.get(stepIndex).getProperties();
            for(var _i = 0, _count = properties.size(); _i < _count; _i++) {
              self.remove(_i, stepIndex);
            }
          }
        };

        self.add = function(property, stepIndex) {
          m_dialog.getProperties().add(property);
          property.setTabIndex(m_steps.get(stepIndex).getTabIndex());
        };

        self.remove = function(kItem, stepIndex) {
          if(m_steps.contains(stepIndex)) {
            var properties = m_steps.get(stepIndex).getProperties();
            if(properties.contains(kItem)) {
              var propertyRemoved = properties.item(kItem);
              var dialogProperties = m_dialog.getProperties();
              for(var _i = 0, _count = dialogProperties.size(); _i < _count; _i++) {
                var property = dialogProperties.item(_i);
                if(property === propertyRemoved) {
                  m_dialog.unloadControl(property);
                  dialogProperties.remove(_i);
                  break;
                }
              }
            }
          }
        };

        self.showValueEx = function(property, noChangeColumns, strTag) {
          strTag = strTag !== undefined ? strTag : "";
          m_dialog.showValueEx(property, noChangeColumns, strTag);
        };

        self.doNextStep = function(currentStep) {
          return nextStep(currentStep);
        };

        //
        // this function support virtual push next
        // this function returns a promise
        //
        self.show = function(clientConstructor) {
          m_wizardClosed = false;

          if(m_client === null) {
            m_client = clientConstructor();
          }

          m_client.setObjWizard(self);

          return m_client.load().whenSuccess(function() {

            var properties = m_dialog.getProperties();
            //
            // during load steps in the client object the dialog's tab collection is used
            // to define inner tabs like in cobranza pagos
            //
            // we need to get a reference to this collection because we are going to
            // assign a new collection to the dialog object which will contain all
            // the tabs, one for each step plus all the inner tabs
            //
            var tabs = m_dialog.getTabs();

            // create a new tab collection and assign it to the dialog object
            //
            m_dialog.setTabs(Cairo.Collections.createCollection(Cairo.Dialogs.createTab));

            // create a tab for each step
            //
            for(var _i = 0, _count = m_steps.size(); _i < _count; _i++) {
              var step = m_steps.item(_i);
              var tab = m_dialog.getTabs().add(null, Cairo.Util.getKey(step.getKey()));

              tab.setIndex(_i);
              tab.setName("Step "+ step.getIndex().toString());
              tab.setLayout(step.getProperties().getLayout());

              step.setTabIndex(tab.getIndex());
              tab.setKeyTab(step.getKey());

              var stepProperties = step.getProperties();
              stepProperties.setWizard(self);
              stepProperties.setStepIndex(_i);

              for(var _j = 0, _countj = step.getProperties().size(); _j < _countj; _j++) {
                var property = step.getProperties().item(_j);
                property.setTabIndex2(property.getTabIndex());
                property.setTabIndex(tab.getIndex());
                if(property.getKeyCol() === "") {
                  properties.add(property);
                }
                else {
                  properties.add(property, property.getKeyCol());
                }
              }
            }

            // create a tab for each inner tab
            //
            for(var _i = 0, _count = tabs.size(); _i < _count; _i++) {
              var tab = tabs.item(_i);
              var internalTabIndex = tab.getIndex();
              m_dialog.getTabs().add(tab)
                .setIndex(internalTabIndex); // this is very important because the collection object set the index
                                             // of this tab object as the ordinal number in it, but we want to use
                                             // the index property of the tab object to manage internal tabs
                                             // for this reason we need to override this value.
                                             // NOTICE: this is a design error. the index porperty of any object should
                                             // be reserved to be used only for the collection object.
                                             // the tab object should have a property called tabIndex
                                             // TODO: refactor the tab object to use the tabIndex
                                             // NOTICE: this tab object is NOT the control but the tab object defined
                                             // in Cairo.Dialogs

              tab.setCtrlIndex(m_dialog.getTabs().count()-1);
            }

            //
            // if this wizard uses virtual push next the return is a chain of promises
            // for every step completed automatically by the virtual push
            //
            if(m_pushVirtualNext) {

              //
              // move to the first step
              //
              return nextStep(-1).whenSuccess(function() {
                var lastCurrentStep = m_currentStep;

                //
                // this is a while implemented using promises
                //
                var doVirtualNext = function() {
                  if(m_currentStep === lastCurrentStep) {
                    return true;
                  }

                  if(!m_pushVirtualNext) {
                    return true;
                  }

                  lastCurrentStep = m_currentStep;

                  //
                  // we made a recursive call until nextStep returns false
                  //
                  return nextStep(m_currentStep).whenSuccess(doVirtualNext, true);
                };

                //
                // first step
                //
                return nextStep(m_currentStep).whenSuccess(doVirtualNext, true);
              });
            }
            else {
              //
              // move to the first step
              //
              return nextStep(-1);
            }
          });
        };

        self.closeWizard = function() {
          if(m_dialog !== null) {
            m_dialog.closeWizard();
          }
          m_wizardClosed = true;
          return P.resolvedPromise(true);
        };

        self.discardChanges = function() {
        };

        self.propertyChange = function(key) {
          return m_client.propertyChange(key);
        };

        self.save = function() {
        };

        self.wizPrintDocEx = function() { /* TODO: implement this. */ };

        var nextStep = function(currentStep) {
          m_restartVirtualPush = false;

          return m_client.nextStep(currentStep).whenSuccessWithResult(
            function(result) {
              if(m_wizardClosed) {
                return false;
              }
              else {
                return showStep(result.nextStep);
              }
            },
            false
          ).whenSuccess(function() {
              return m_client.work(m_currentStep, true);
            },
            false
          ).whenSuccess(function() {
              if(m_restartVirtualPush) {
                restartPushVirtualNext();
              }
              return true;
            },
            false
          );
        };

        var previousStep = function(currentStep) {
          return m_client.previousStep(currentStep).whenSuccessWithResult(
            function(result) {
              return showStep(result.nextStep);
            },
            false
          ).whenSuccess(function() {
              return m_client.work(m_currentStep, false);
            },
            false
          );
        };

        var showStep = function(nStep) {
          var step = m_steps.get(Cairo.Util.getKey(nStep));

          if(m_wizardShowed) {
            m_dialog.tabClick(step.getTabIndex(), true);
            m_currentStep = nStep;
            return true;
          }
          else {
            if(m_dialog.show(self, step.getTabIndex())){
              m_wizardShowed = true;
              m_currentStep = nStep;
              return true;
            }
            else {
              return false;
            }
          }
        };

        var restartPushVirtualNext = function() {
          m_restartVirtualPush = false;

          var lastCurrentStep = null;

          //
          // this is a while implemented using promises
          //
          var doVirtualNext = function() {
            lastCurrentStep = m_currentStep;

            //
            // returns a promises that will make recursive call
            // if it success
            //
            return nextStep(m_currentStep).whenSuccess(function() {
                if(m_currentStep === lastCurrentStep) {
                  return false;
                }
                else {
                  return doVirtualNext(); // recursive call
                }
              },
              false
            );
          };

          //
          // start the while
          //
          return doVirtualNext();
        };

        var createSteps = function() {
          var that = Cairo.Collections.createCollection(Dialogs.WizardSteps.createObject);
          var superAdd = that.add;
          that.add = function(value, key) {
            var elem = superAdd(value, key);
            elem.setKey(key);
            return elem;
          };
          return that;
        };

        var initialize = function() {
          try {
            m_steps = createSteps();
            m_dialog = Cairo.Dialogs.Views.Controller.newDialog();
            m_dialog.setHideTabButtons(true);
            m_dialog.setIsWizard(true);
          }
          catch (ex) {
            Cairo.manageErrorEx(ex.message, ex, "initialize", "Dialogs.WizardViews.Controller.newWizard", "");
          }
        };

        self.destroy = function() {
          try {
            m_dialog = null;
            m_steps = null;
            m_client = null;
          }
          catch (ex) {
            Cairo.manageErrorEx(ex.message, ex, "destroy", Dialogs.WizardViews.Controller.newWizard, "");
          }
        };

        self.getObjectType = function() {
          return "cairo.dialogs.wizard";
        };

        initialize();

        return self;
      }
    };

  });

}());