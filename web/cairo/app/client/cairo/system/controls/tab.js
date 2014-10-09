Cairo.module("Tab", function(Tab, Cairo, Backbone, Marionette, $, _) {
  "use strict";

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

      /*
          a collection of the tabs in this tab set
      */
      var tabs = {
        find: function(tabId) {
          for (var property in this) {
            if (this.hasOwnProperty(property)) {
              if(this[property] === tabId) {
                  return property;
              }
            }
          }
          return undefined;
        },

        remove: function(tabId) {
          var tab = this.find(tabId);
          if(tab) { this[tab] = undefined; }
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
      var showTab = function(title, id, route, createDialog) {

        // get the tab from the tabs collection
        //
        var tabId = tabs[id];

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
          tabs[id] = tabId;
        }

        $('#link_' + tabId.substring(1, tabId.length)).tab('show');
      };

      /*
          remove a tab
      */
      $(tabBar).on('click', ' li .close', function(e) {
        e.preventDefault();
        var tabId = $(this).parents('li').children('a').attr('href');
        $(this).parents('li').remove('li');
        $(tabId).remove();
        $(tabBar + ' a:first').tab('show');
        tabs.remove(tabId);

        // we navigate to the desktop
        //
        Cairo.navigate('#');

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
        }
      });

      var virtualPush = function() { /* TODO: implement this. */ };
      var getIndex = function() { /* TODO: implement this. */ };

      // we return a tab manager which can be use to create and show a tab
      //
      return {
        showTab: showTab,
        virtualPush: virtualPush,
        getIndex: getIndex
      };
    }
  };
});

// we create the main tab for Cairo
//
Cairo.mainTab = Cairo.Tab.Controller.createTab("#mainTabBar", "#mainTabBody", "main_tab");
