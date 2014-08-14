(function() {
  "use strict";

  Marionette.Region.Dialog = Marionette.Region.extend({
    onShow: function(view) {
      this.listenTo(view, "dialog:close", this.closeDialog);

      var self = this;
      var options = {
                      modal: true,
                      title: view.title,
                      width: "auto",

                      close: function(e, ui) {
                        self.closeDialog();
                      }
                    };
      if(this.dialogSettings) {
        $.extend(options, this.dialogSettings);
      }
      this.$el.dialog(options);
    },

    closeDialog: function() {
      this.stopListening();
      this.close();
      this.$el.dialog("destroy");
      if(this.handlerClose) this.handlerClose();
    }
  });

}());