(function() {
  "use strict";

  Cairo.module("Desktop", function(Desktop, Cairo, Backbone, Marionette, $, _) {});

  Cairo.module("Desktop.Region", function(Region, Cairo, Backbone, Marionette, $, _) {

    var P = Cairo.Promises;
    var call = P.call;

    Region.Controller = {
      showDesktop: function() {

        /*--------------------------

           desktop elements

         --------------------------*/

        var reports = Cairo.Reports.createReports();
        var modules = Cairo.Modules.createModules();
        var tasks = Cairo.Tasks.createTasks();

        /*--------------------------

           view

         --------------------------*/

        var view = new Region.View();

        var reportsView = Cairo.Views.createReportsView(reports);
        var modulesView = Cairo.Views.createModulesView(modules);
        var tasksView = Cairo.Views.createTasksView(tasks);

        P.resolvedPromise(true)
            .then(call(reports.init))
            .then(call(modules.init))
            .then(call(tasks.init))
            .then(call(reportsView.render, view))
            .then(call(modulesView.render, view))
            .then(call(tasksView.render, view))
          ;

        /*
            this function will be called by the tab manager every time the
            view must be created. when the tab is not visible the tab manager
            will not call this function but only make the tab visible
        */
        var createDialog = function(tabId) {

          // create the desktop region
          //
          Cairo.addRegions({ desktopRegion: tabId });

        };
        Cairo.mainTab.showTab("Desktop", "desktopRegion", "#desktop", createDialog);
        Cairo.desktopRegion.show(view);
      }
    };
  });

  Cairo.module("Desktop.Region", function(Region, Cairo, Backbone, Marionette, $, _) {
    Region.View = Marionette.ItemView.extend({
      template: "#desktop-template"
    });
  });

}());