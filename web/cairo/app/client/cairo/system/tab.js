Cairo.module("Tab", function(Tab, Cairo, Backbone, Marionette, $, _) {

  Tab.Controller = {

    createTab: function(tabBar, tabBody, tabName) {
      var tabIndex = 1;
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

      /**
       * Add or show a Tab
       */
      var showTab = function(title, id, route, createDialog) {
        var tabId = tabs[id];

        if(tabId === undefined) {
          tabIndex++;
          tabId = '#tab_' + tabName + '_' + tabIndex;
          $(tabBar).append(
            $('<li><a href="' + tabId +
              '" id="link_' + tabId.substring(1, tabId.length) +
              '" data-route="' + route + '">' +
              title +
              '<button class="close tab-button-close" type="button" title="Remove this tab">×</button></a></li>')
          );

          $(tabBody).append(
            $('<div class="tab-pane" id="tab_' + tabName + '_' + tabIndex +
            '">Content tab_' + tabName + '_' + tabIndex + '</div>'));

          createDialog(tabId);

          tabs[id] = tabId;
        }

        $('#link_' + tabId.substring(1, tabId.length)).tab('show');
      };

      /**
      * Remove a Tab
      */
      $(tabBar).on('click', ' li .close', function(e) {
        e.preventDefault();
        var tabId = $(this).parents('li').children('a').attr('href');
        $(this).parents('li').remove('li');
        $(tabId).remove();
        $(tabBar + ' a:first').tab('show');
        $(this).parents('li').children('a').data("removed", "true");
        tabs.remove(tabId);
        Cairo.navigate('#');
      });

      /**
       * Click Tab to show its content
       */
      $(tabBar).on("click", "a", function(e) {
        e.preventDefault();
        if(! $(this).data("removed")) {
          $(this).tab('show');
          var route = $(this).data("route");
          Cairo.navigate(route);
        }
      });

      return { showTab: showTab };
    }
  }
});

Cairo.mainTab = Cairo.Tab.Controller.createTab("#mainTabBar", "#mainTabBody", "main_tab");
