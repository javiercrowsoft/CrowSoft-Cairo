(function() {
  "use strict";

  // this file will contain all the code translated from cPublicDoc
  // the functions in cPublicDoc will be grouped by functionality
  // ex:
  //     addMultiRowsPurchase will be put in the object Selection
  //     setDocumentForDoctId will be put in the object Documents
  //     wizAddNewDocProperties will be put in object Wizards (and the wiz prefix will be removed)

  Cairo.Selections = {};

  var getAmountForId = function(prId, arrayInfo) {
    for(var k = 0, count = arrayInfo.length; k < count; k += 1) {
      if(arrayInfo[k][0] === prId) {
        return arrayInfo[k][1];
      }
    }
  };

  var addMultiRows = function(ids, virtualRow, amountKey, columnName) {
    var vArrayInfo = [];
    var arrayInfo = ids.split(",");
    ids = "";

    for(var t = 0, count = arrayInfo.length; t < count; t += 1) {
      vArrayInfo.push(arrayInfo[t].split("|"));
      ids = ids + vArrayInfo[t][0] + ",";
    }

    ids = Cairo.Util.removeLastColon(ids);

    var apiPath = Cairo.Database.getAPIVersion();
    return Cairo.Database.getData("load[" + apiPath + "general/producto/list]", ids).then(
      function(response) {

        if(response.success === true) {

          var vIds2 = ids.split(",");
          var vIds = [];

          for(var i = 0, z = vIds2.length; i < z; i += 1) {
            var bFound = false;
            for(var j = 0, y = vIds.length; j < y; j += 1) {

              if(vIds2[i] = vIds[j]) {
                bFound = true;
                break;
              }

            }
            if(bFound === false) {
              vIds.push(vIds2[i]);
            }
          }

          //
          // we must respect the selection order
          //

          var items = response.data.get('items');
          var C = Cairo.General.Constants;
          var getValue = Cairo.Database.getValue;

          for(var i = 0, z = vIds.length; i < z; i += 1) {

            for(var j = 0, y = items.length; j < y; j += 1) {
              var prId = getValue(items[j], C.PR_ID);
              virtualRow.setColAmountKey(amountKey);
              if(Cairo.Util.val(vIds[i]) === prId) {
                virtualRow.getNewId().push(prId);
                virtualRow.getNewValue().push(getValue(items[j], columnName));
                virtualRow.getNewAmount().push(getAmountForId(prId, vArrayInfo))
                break;
              }
            }
          }

          virtualRow.setRowsToAdd(virtualRow.getNewId().length);
        }
        return virtualRow;
      }
    );
  };
  
  Cairo.Selections.addMultiRowsPurchase = function(ids, virtualRow, amountKey) {
    return addMultiRows(ids, virtualRow, amountKey, C.PR_NAME_COMPRA);
  };

  Cairo.Selections.addMultiRowsSale = function(ids, virtualRow, amountKey) {
    return addMultiRows(ids, virtualRow, amountKey, C.PR_NAME_VENTA);
  };

  var CC = Cairo.Compras.Constants;

  Cairo.Documents = {};

  Cairo.Documents.getDocNumberForProveedor = function(provId, docId, dialog) {
    var apiPath = Cairo.Database.getAPIVersion();
    return Cairo.Database.getData("load[" + apiPath + "documents/" + docId.toString() + "/proveedor]", provId).then(
      function(response) {

        var property = dialog.getProperties().item(CC.FC_NRODOC);
        var number = "";
        var mask = "";
        var enabled = false;

        if(response.success === true) {
          number = Cairo.Database.valField(response.data, 'number');
          mask = Cairo.Database.valField(response.data, 'mask');
          enabled = Cairo.Database.valField(response.data, 'enabled');
        }

        property.setValue(number);
        property.setTextMask(mask);
        property.setEnabled(enabled);

        return enabled;
      }
    );
  };

}());