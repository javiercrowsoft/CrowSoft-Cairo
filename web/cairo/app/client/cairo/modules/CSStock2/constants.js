(function() {
  "use strict";

  Cairo.Stocks = {

    Constants: {
      // Asiento
      STOCK: "Stock",
      ST_ID: "st_id",
      ST_NUMERO: "st_numero",
      ST_NRODOC: "st_nrodoc",
      ST_DESCRIP: "st_descrip",
      ST_FECHA: "st_fecha",
      ST_DOC_CLIENTE: "st_doc_cliente",

      // StockItem
      STOCK_ITEM: "StockItem",
      STI_ID: "sti_id",
      STI_ORDEN: "sti_orden",
      STI_INGRESO: "sti_ingreso",
      STI_SALIDA: "sti_salida",
      STI_DESCRIP: "sti_descrip",
      STI_GRUPO: "sti_grupo",

      // StockItemKit
      STIK_ORDEN: "stik_orden",
      STIK_CANTIDAD: "stik_cantidad",

      // StockItemTMP
      STOCK_ITEM_TMP: "StockItemTMP",
      STI_TMP_ID: "stiTMP_id",

      StockItemTipo: {
        DESTINO: 1,
        ORIGEN: 2
      }
    }
  };

  Cairo.Security.Actions.Stocks = {

    NEW_STOCK: 20001,
    EDIT_STOCK: 20002,
    DELETE_STOCK: 20003,
    LIST_STOCK: 20004

  }

}());