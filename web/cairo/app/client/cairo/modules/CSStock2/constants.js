(function() {
  "use strict";

  Cairo.Stock = {

    Constants: {
      // Asiento
      STOCK: "Stock",
      ST_ID: "st_id",
      ST_NUMERO: "st_numero",
      ST_NRODOC: "st_nrodoc",
      ST_DESCRIP: "st_descrip",
      ST_FECHA: "st_fecha",
      ST_DOC_CLIENTE: "st_doc_cliente"
    }
  };

  Cairo.Security.Actions.Stock = {

    NEW_STOCK: 20001,
    EDIT_STOCK: 20002,
    DELETE_STOCK: 20003,
    LIST_STOCK: 20004

  }

}());