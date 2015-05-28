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
        var m_steps = Cairo.Collections.createCollection(Dialogs.WizardSteps.createObject);
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

        self.getWizardClosed = function() {
          return m_wizardClosed;
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

        self.messageEx = function(messageID,  info) {
          if(m_client === null) {
            return Cairo.Promises.resolvedPromise(true);
          }
          else {
            return m_client.messageEx(messageID, info);
          }
        };

        self.columnAfterEdit = function(key,  lRow,  lCol,  newValue,  newValueID) {
          return m_client().columnAfterEdit(key, lRow, lCol, newValue, newValueID);
        };

        self.columnAfterUpdate = function(key,  lRow,  lCol) {
          return m_client().columnAfterUpdate(key, lRow, lCol);
        };

        self.columnBeforeEdit = function(key,  lRow,  lCol,  iKeyAscii) {
          return m_client().columnBeforeEdit(key, lRow, lCol, iKeyAscii);
        };

        self.columnButtonClick = function(key,  lRow,  lCol,  iKeyAscii) {
          return m_client().columnButtonClick(key, lRow, lCol, iKeyAscii);
        };

        self.columnClick = function(key,  lRow,  lCol) {
          m_client().columnClick(key, lRow, lCol);
        };

        self.dblClick = function(key,  lRow,  lCol) {
          m_client().dblClick(key, lRow, lCol);
        };

        self.deleteRow = function(key,  row,  lRow) {
          return m_client().deleteRow(key, row, lRow);
        };

        self.isEmptyRow = function(key,  row,  rowIndex) {
          return m_client().isEmptyRow(key, row, rowIndex);
        };

        self.newRow = function(key,  rows) {
          m_client().newRow(key, rows);
        };

        self.validateRow = function(key,  row,  rowIndex) {
          return m_client().validateRow(key, row, rowIndex);
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
          m_dialog.showValue(property);
        };

        self.setSteps = function(value) {
          m_steps = value;
        };

        self.getSteps = function() {
          return m_steps;
        };
        
        self.moveNext = function() {
          nextStep(m_currentStep);
        };
        
        self.moveBack = function() {
          previousStep(m_currentStep);
        };

        self.clear = function(stepIndex) {
          if(m_steps.contains(stepIndex)) {
            var properties = m_steps.get(stepIndex).getProperties();
            for (var _i = 0, _count = properties.size(); _i < _count; _i++) {
              var property = properties.item(_i);
              self.remove(_i, stepIndex);
            }
          }
        };

        self.add = function(property,  stepIndex) {
          m_dialog.getProperties().add(property);
          property.setTabIndex(m_steps.get(stepIndex).getTabIndex());
        };

        self.remove = function(kItem,  stepIndex) {
          if(m_steps.contains(stepIndex)) {
            var properties = m_steps.get(stepIndex).getProperties();
            if(properties.contains(kItem)) {
              var propertyRemoved = properties.item(kItem);
              var dialogProperties = m_dialog.getProperties();
              for (var _i = 0, _count = dialogProperties.size(); _i < _count; _i++) {
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

        self.showValue = function(property,  noChangeColumns,  strTag) {
          m_dialog.showValue(property, noChangeColumns, strTag);
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

          return m_client.load().success(function() {

            var properties = m_dialog.getProperties();
            var tabs = m_dialog.getTabs();
            m_dialog.setTabs(Cairo.Collections.createCollection(Cairo.Dialogs.createTab));

            for (var _i = 0, _count = m_steps.size(); _i < _count; _i++) {
              var step = m_steps.item(_i);
              var tab = m_dialog.getTabs().add(null, Cairo.Util.getKey(step.getKey()));

              tab.setIndex(_i);
              tab.setName("Step "+ step.getIndex().toString());

              step.setTabIndex(tab.getIndex());
              tab.setKeyTab(step.getKey());

              var stepProperties = step.getProperties();
              stepProperties.setWizard(self);
              stepProperties.setStepIndex(_i);

              for (var _j = 0, _countj = step.getProperties().size(); _j < _countj; _j++) {
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

            for (var _i = 0, _count = tabs.size(); _i < _count; _i++) {
              tab = tabs.item(_i);
              m_dialog.getTabs().add(tab);
              tab.setControlIndex(m_dialog.getTabs().count()-1);
            }

            //
            // if this wizard uses virtual push next the return is a chain of promises
            // for every step completed automatically by the virtual push
            //
            if(m_pushVirtualNext) {

              //
              // move to the first step
              //
              return nextStep(-1).success(function() {
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
                  return nextStep(m_currentStep).success(doVirtualNext, true);
                };

                //
                // first step
                //
                return nextStep(m_currentStep).success(doVirtualNext, true);
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
          if(m_dialog != null) {
            m_dialog.closeWizard();
          }
          m_wizardClosed = true;
        };

        self.discardChanges = function() {
        };

        self.propertyChange = function(key) {
          return m_client.propertyChange(key);
        };

        self.save = function() {
        };

        var nextStep = function(currentStep) {
          m_restartVirtualPush = false;

          return m_client.nextStep(currentStep).successWithResult(
            function(result) {
              if(m_wizardClosed) {
                return false;
              }
              else {
                return showStep(result.nextStep);
              }
            },
            false
          ).success(function() {
              return m_client.work(m_currentStep, true);
            },
            false
          ).success(function() {
              if(m_restartVirtualPush) {
                restartPushVirtualNext();
              }
              return true;
            },
            false
          );
        };

        var previousStep = function(currentStep) {
          return m_client.previousStep(currentStep).successWithResult(
            function(result) {
              return showStep(result.nextStep);
            },
            false
          ).success(function() {
              return m_client.work(m_currentStep, false);
            },
            false
          );
        };

        var showStep = function(nStep) {
          var p = null;
          var step = m_steps.get(Cairo.Util.getKey(nStep));

          if(m_wizardShowed) {
            m_dialog.tabClick(step.getTabIndex());
          }
          else {
            p = m_dialog.show(self, step.getTabIndex()).success(function() {
                m_wizardShowed = true;
              },
              false
            );
          }

          p = p || P.resolvedPromise(true);

          return p.success(function() {
              m_currentStep = nStep;
              return true;
            },
            false
          );
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
            return nextStep(m_currentStep).success(function() {
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

        var initialize = function() {
          try {
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
            Cairo.manageErrorEx(ex.message, "destroy", Dialogs.WizardViews.Controller.newWizard, "");
          }
        };

        initialize();

        return self;
      }
    };

  });

}());