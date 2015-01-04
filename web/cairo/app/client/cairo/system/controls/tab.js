(function() {
  "use strict";

  Cairo.module("Tab", function(Tab, Cairo, Backbone, Marionette, $, _) {

    Tab.Controller = {

      /*
          a tab is compose by two components a tab header and a tab body

          there is two main concepts:

          a tab manager which is implemented in this module and have the
          responsibility of create and destroy the tab and show / hide
          the tab body

          a tab client which is the object which will create a new tab
          and is responsible for instantiate a view to show in the tab body
      */

      /*
          instantiate a tab manager

          returns an object which allow to create and show a tab

          @tabBar:  id of a div which will hold the tab navigation bar
          @tabBody: id of a div which will hold a div for every tab
          @tabName: a unique name for this tab set
      */
      createTab: function(tabBar, tabBody, tabName) {
        var tabIndex = 1;

        var activeTab = null;

        /*
            a collection of the tabs in this tab set
        */
        var tabs = {
          find: function(tabId) {
            for (var property in this) {
              if (this.hasOwnProperty(property)) {
                if(this[property] !== undefined && this[property].tabId === tabId) {
                    return property;
                }
              }
            }
            return undefined;
          },

          remove: function(tabId) {
            var tab = this.find(tabId);
            if(tab) {
              if (this[tab].closeHandler !== undefined) {
                this[tab].closeHandler();
              }
              this[tab] = undefined;
            }
          },

          show: function(tabId) {
            var tab = this.find(tabId);
            if(tab) {
              if (this[tab].showHandler !== undefined) {
                this[tab].showHandler();
              }
            }
          }

        };

        /*
            show a tab. if the tab doesn't exists it is added

            @title:         title of the tab
            @id:            unique identifier for this tab. if the id is in the
                            tabs collection no tab will be added
            @route:         url fragment to update url when activate a tab as
                            response to the user click over the tab
            @createDialog:  a callback function to be called when a new tab need
                            is added
        */
        var showTab = function(title, id, route, createDialog, closeTabHandler, showTabHandler) {

          // get the tab from the tabs collection
          //
          var tabId = tabs[id] !== undefined ? tabs[id].tabId : undefined;

          // only create a tab if it is not in the collection
          //
          if(tabId === undefined) {

            /*
                the desktop tab is especial
            */
            if("desktopRegion" === id) {
              tabId = '#desktop-region';
            }
            else {
              tabIndex++;
              tabId = '#tab_' + tabName + '_' + tabIndex;

              // add a tab header
              //
              $(tabBar).append(
                $('<li><a href="' + tabId +
                  '" id="link_' + tabId.substring(1, tabId.length) +
                  '" data-route="' + route + '">' +
                  title +
                  '<button class="close tab-button-close" type="button" title="Remove this tab">×</button></a></li>')
              );

              // add a tab body
              //
              $(tabBody).append(
                $('<div class="tab-pane" id="tab_' + tabName + '_' + tabIndex +
                '">Content tab_' + tabName + '_' + tabIndex + '</div>'));
            }

            // this callback let the tab client to instantiate the view
            // and display it in the body of this tab
            //
            createDialog(tabId);

            // add this tab to the tabs collection
            //
            tabs[id] = { tabId: tabId };
            activeTab = tabId;
            if(closeTabHandler !== undefined) {
              tabs[id].closeHandler = closeTabHandler;
              tabs[id].showHandler = showTabHandler;
            }
          }

          $('#link_' + tabId.substring(1, tabId.length)).tab('show');

          if(showTabHandler) {
            showTabHandler();
          }

        };

        var closeTab = function(id) {
          var tabId = tabs[id] !== undefined ? tabs[id].tabId : undefined;
          if(tabId !== undefined) {
            var btnClose = $('.close', $('#link_' + tabId.substring(1, tabId.length)));
            btnClose.click();
          }
        };

        /*
            remove a tab
        */
        $(tabBar).on('click', ' li .close', function(e) {
          e.preventDefault();
          var tabId = $(this).parents('li').children('a').attr('href');
          $(this).parents('li').remove('li');
          $(tabId).remove();
          tabs.remove(tabId);

          // we navigate to the desktop
          //
          if(tabId === activeTab) {
            activeTab = null;
            $(tabBar + ' a:first').tab('show');
            Cairo.navigate('#');
          }

          // we use this property to prevent a click event that
          // will navigate to this tab after it has been removed
          //
          $(this).parents('li').children('a').data("removed", "true");
        });

        /*
            click tab to show its content
        */
        $(tabBar).on("click", "a", function(e) {
          e.preventDefault();

          // only if this tab hasn't been removed in this click
          //
          if(! $(this).data("removed")) {
            $(this).tab('show');

            var route = $(this).data("route");
            Cairo.navigate(route);

            var tabId = $(this).parents('li').children('a').attr('href');
            activeTab = tabId;
            tabs.show(tabId);
          }
        });

        var virtualPush = function() { /* TODO: implement this. */ };
        var getIndex = function() { /* TODO: implement this. */ };
        var setIndex = function(index) { /* TODO: implement this. */ };
        var getControlIndex = function() { /* TODO: implement this. */ };
        var setControlIndex = function(index) { /* TODO: implement this. */ };
        var setTabSelected = function(selected) { /* TODO: implement this. */ };
        var getFatherTab = function() { /* TODO: implement this. */ };
        var setTabGroup = function(group) { /* TODO: implement this. */ };
        var setTabStop = function(stop) { /* TODO: implement this. */ };
        var setBackColorPressed = function(color) { /* TODO: implement this. */ };
        var getWidth = function() { /* TODO: implement this. */ };

        // we return a tab manager which can be use to create and show a tab
        //
        return {
          showTab: showTab,
          closeTab: closeTab,
          virtualPush: virtualPush,
          getIndex: getIndex,
          setIndex: setIndex,
          getControlIndex: getControlIndex,
          setControlIndex: setControlIndex,
          setTabSelected: setTabSelected,
          getFatherTab: getFatherTab,
          setTabGroup: setTabGroup,
          setTabStop: setTabStop,
          setBackColorPressed: setBackColorPressed,
          getWidth: getWidth
        };
      }
    };
  });

  // we create the main tab for Cairo
  //
  Cairo.mainTab = Cairo.Tab.Controller.createTab("#mainTabBar", "#mainTabBody", "main_tab");

  Cairo.module("Controls", function(Controls, Cairo, Backbone, Marionette, $, _) {

    var createTab = function() {
      var self = {
        text: "",
        index: 0,
        selected: false,
        father: "",
        group: 0,
        tabStop: false,
        backColorPressed: 0,
        width: 0,
        controlIndex: 0
      };

      var that = Controls.createControl();

      that.htmlTag = "<button/>";

      var superSetElement = that.setElement;

      that.setElement = function(element, view) {
        superSetElement(element);
        element.html(self.text);
        element.addClass("btn btn-default");
        var onClick = view.onTabClick(that);
        element.click(function() {
          onClick();
        });
      };

      that.setText = function(text) {
        //
        // for now we remove the index in the text
        //
        var i = text.indexOf("-");
        if(i >= 0) {
          text = text.substring(i+1);
        }
        self.text = text;
      };
      that.getText = function() {
        return self.text;
      };

      that.virtualPush = function() { /* TODO: implement this. */ };

      that.getIndex = function() {
        return self.index;
      };
      that.setIndex = function(index) {
        self.index = index;
      };

      that.getControlIndex = function() {
        return self.controlIndex;
      };
      that.setControlIndex = function(index) {
        self.controlIndex = index;
      };

      that.setTabSelected = function(selected) {
        self.selected = selected;
      };

      that.getFatherTab = function() {
        return self.father;
      };

      that.setTabGroup = function(group) {
        self.group = group;
      };

      that.setTabStop = function(stop) {
        self.stop = stop;
      };

      that.setBackColorPressed = function(color) {
        self.color = color;
      };

      that.getWidth = function() {
        return self.width;
      }
      
      return that;
    };

    Controls.createTab = function() {

      var self = {
        objectType: "cairo.controls.tab"
      };

      var that = createTab();

      that.getObjectType = function() {
        return self.objectType;
      };

      return that;
    };

    Controls.isTab = function(control) {
      return control.getObjectType() === "cairo.controls.tab";
    };

  });

}());