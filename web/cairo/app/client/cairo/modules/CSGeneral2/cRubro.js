(function() {
  "use strict";

  Cairo.module("Rubro.Load", function(Load, Cairo, Backbone, Marionette, $, _) {

    Load.createRubro = function() {

      var init = function() {
        return {
          rubId: 0,
          rubName: "",
          rubtId1: 0,
          rubtName1: "",
          rubtId2: 0,
          rubtName2: "",
          rubtId3: 0,
          rubtName3: "",
          rubtId4: 0,
          rubtName4: "",
          rubtId5: 0,
          rubtName5: "",
          rubtId6: 0,
          rubtName6: "",
          rubtId7: 0,
          rubtName7: "",
          rubtId8: 0,
          rubtName8: "",
          rubtId9: 0,
          rubtName9: "",
          rubtId10: 0,
          rubtName10: "",
          rubtiId1: 0,
          rubtiName1: "",
          rubtiId2: 0,
          rubtiName2: "",
          rubtiId3: 0,
          rubtiName3: "",
          rubtiId4: 0,
          rubtiName4: "",
          rubtiId5: 0,
          rubtiName5: "",
          rubtiId6: 0,
          rubtiName6: "",
          rubtiId7: 0,
          rubtiName7: "",
          rubtiId8: 0,
          rubtiName8: "",
          rubtiId9: 0,
          rubtiName9: "",
          rubtiId10: 0,
          rubtiName10: ""
        };
      };

      var self = init();

      var C = Cairo.General.Constants;

      var that = {};

      that.load = function(rubId) {
        // TODO: implement this. Just do the typical request and then call loadFromData
      };

      that.loadFromData = function(data) {

        if(data.id === Cairo.Constants.NO_ID) {
          self = init;
        }
        else {
          self.rubId = Cairo.Database.valField(data, C.RUB_ID);
          self.rubName = Cairo.Database.valField(data, C.RUB_NAME);
          
          self.rubtId1 = Cairo.Database.valField(data, C.RUBT_ID_1);
          self.rubtName1 = Cairo.Database.valField(data, C.RUBT_NAME_1);
          self.rubtId2 = Cairo.Database.valField(data, C.RUBT_ID_2);
          self.rubtName2 = Cairo.Database.valField(data, C.RUBT_NAME_2);
          self.rubtId3 = Cairo.Database.valField(data, C.RUBT_ID_3);
          self.rubtName3 = Cairo.Database.valField(data, C.RUBT_NAME_3);
          self.rubtId4 = Cairo.Database.valField(data, C.RUBT_ID_4);
          self.rubtName4 = Cairo.Database.valField(data, C.RUBT_NAME_4);
          self.rubtId5 = Cairo.Database.valField(data, C.RUBT_ID_5);
          self.rubtName5 = Cairo.Database.valField(data, C.RUBT_NAME_5);
          self.rubtId6 = Cairo.Database.valField(data, C.RUBT_ID_6);
          self.rubtName6 = Cairo.Database.valField(data, C.RUBT_NAME_6);
          self.rubtId7 = Cairo.Database.valField(data, C.RUBT_ID_7);
          self.rubtName7 = Cairo.Database.valField(data, C.RUBT_NAME_7);
          self.rubtId8 = Cairo.Database.valField(data, C.RUBT_ID_8);
          self.rubtName8 = Cairo.Database.valField(data, C.RUBT_NAME_8);
          self.rubtId9 = Cairo.Database.valField(data, C.RUBT_ID_9);
          self.rubtName9 = Cairo.Database.valField(data, C.RUBT_NAME_9);
          self.rubtId10 = Cairo.Database.valField(data, C.RUBT_ID_10);
          self.rubtName10 = Cairo.Database.valField(data, C.RUBT_NAME_10);

          self.rubtiId1 = Cairo.Database.valField(data, C.RUBTI_ID_1);
          self.rubtiName1 = Cairo.Database.valField(data, C.RUBTI_NAME_1);
          self.rubtiId2 = Cairo.Database.valField(data, C.RUBTI_ID_2);
          self.rubtiName2 = Cairo.Database.valField(data, C.RUBTI_NAME_2);
          self.rubtiId3 = Cairo.Database.valField(data, C.RUBTI_ID_3);
          self.rubtiName3 = Cairo.Database.valField(data, C.RUBTI_NAME_3);
          self.rubtiId4 = Cairo.Database.valField(data, C.RUBTI_ID_4);
          self.rubtiName4 = Cairo.Database.valField(data, C.RUBTI_NAME_4);
          self.rubtiId5 = Cairo.Database.valField(data, C.RUBTI_ID_5);
          self.rubtiName5 = Cairo.Database.valField(data, C.RUBTI_NAME_5);
          self.rubtiId6 = Cairo.Database.valField(data, C.RUBTI_ID_6);
          self.rubtiName6 = Cairo.Database.valField(data, C.RUBTI_NAME_6);
          self.rubtiId7 = Cairo.Database.valField(data, C.RUBTI_ID_7);
          self.rubtiName7 = Cairo.Database.valField(data, C.RUBTI_NAME_7);
          self.rubtiId8 = Cairo.Database.valField(data, C.RUBTI_ID_8);
          self.rubtiName8 = Cairo.Database.valField(data, C.RUBTI_NAME_8);
          self.rubtiId9 = Cairo.Database.valField(data, C.RUBTI_ID_9);
          self.rubtiName9 = Cairo.Database.valField(data, C.RUBTI_NAME_9);
          self.rubtiId10 = Cairo.Database.valField(data, C.RUBTI_ID_10);
          self.rubtiName10 = Cairo.Database.valField(data, C.RUBTI_NAME_10);
          
        }

      };

      that.getRubtId1 = function() { return self.rubtId1; };
      that.getRubtId2 = function() { return self.rubtId2; };
      that.getRubtId3 = function() { return self.rubtId3; };
      that.getRubtId4 = function() { return self.rubtId4; };
      that.getRubtId5 = function() { return self.rubtId5; };
      that.getRubtId6 = function() { return self.rubtId6; };
      that.getRubtId7 = function() { return self.rubtId7; };
      that.getRubtId8 = function() { return self.rubtId8; };
      that.getRubtId9 = function() { return self.rubtId9; };
      that.getRubtId10 = function() { return self.rubtId10; };

      that.getRubtName1 = function() { return self.rubtName1; };
      that.getRubtName2 = function() { return self.rubtName2; };
      that.getRubtName3 = function() { return self.rubtName3; };
      that.getRubtName4 = function() { return self.rubtName4; };
      that.getRubtName5 = function() { return self.rubtName5; };
      that.getRubtName6 = function() { return self.rubtName6; };
      that.getRubtName7 = function() { return self.rubtName7; };
      that.getRubtName8 = function() { return self.rubtName8; };
      that.getRubtName9 = function() { return self.rubtName9; };
      that.getRubtName10 = function() { return self.rubtName10; };

      that.getRubtiId1 = function() { return self.rubtiId1; };
      that.getRubtiId2 = function() { return self.rubtiId2; };
      that.getRubtiId3 = function() { return self.rubtiId3; };
      that.getRubtiId4 = function() { return self.rubtiId4; };
      that.getRubtiId5 = function() { return self.rubtiId5; };
      that.getRubtiId6 = function() { return self.rubtiId6; };
      that.getRubtiId7 = function() { return self.rubtiId7; };
      that.getRubtiId8 = function() { return self.rubtiId8; };
      that.getRubtiId9 = function() { return self.rubtiId9; };
      that.getRubtiId10 = function() { return self.rubtiId10; };

      that.getRubtiName1 = function() { return self.rubtiName1; };
      that.getRubtiName2 = function() { return self.rubtiName2; };
      that.getRubtiName3 = function() { return self.rubtiName3; };
      that.getRubtiName4 = function() { return self.rubtiName4; };
      that.getRubtiName5 = function() { return self.rubtiName5; };
      that.getRubtiName6 = function() { return self.rubtiName6; };
      that.getRubtiName7 = function() { return self.rubtiName7; };
      that.getRubtiName8 = function() { return self.rubtiName8; };
      that.getRubtiName9 = function() { return self.rubtiName9; };
      that.getRubtiName10 = function() { return self.rubtiName10; };      
      
      return that;
    };

  });

}());