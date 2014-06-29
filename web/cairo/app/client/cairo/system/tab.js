Cairo.module("Tab", function(Tab, Cairo, Backbone, Marionette, $, _) {

  Tab.Controller = {

    createTab: function(tabBar, tabBody, tabName) {

      /*

        #pageTabContent -> tabContent
        #pageTab -> tabBar

      */
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
       * Add a Tab
       */
      var addOrShowTab = function(title, id) {
        var tabId = tabs[id];
        if(tabId === undefined) {
          tabIndex++;
          tabId = '#tab_' + tabName + '_' + tabIndex;
          $(tabBar).append(
            $('<li><a href="' + tabId + '">' + title +
              '<button class="close" type="button" title="Remove this tab">×</button></a></li>')
          );

          $(tabBody).append(
            $('<div class="tab-pane" id="tab_' + tabName + '_' + tabIndex +
            '">Content tab_' + tabName + '_' + tabIndex + '</div>'));
        }
        $('#tab_' + tabName + '_' + tabIndex).tab('show');

        tabs[id] = tabId;
      };

      return {
        addOrShowTab: addOrShowTab
      }

      /**
      * Remove a Tab
      */
      $(tabBar).on('click', ' li a .close', function() {
        var tabId = $(this).parents('li').children('a').attr('href');
        $(this).parents('li').remove('li');
        $(tabId).remove();
        $(tabBar + ' a:first').tab('show');
        tabs.remove(tabId);
      });

      /**
       * Click Tab to show its content
       */
      $(tabBar).on("click", "a", function(e) {
        e.preventDefault();
        $(this).tab('show');
      });

    }
  }
});
