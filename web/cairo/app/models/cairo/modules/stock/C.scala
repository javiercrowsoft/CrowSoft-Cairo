package models.cairo.modules.stock

object C {

  val STOCK_ID = "ids"
  val STOCK_BASE = "base"

  // Stock
  val STOCK = "Stock"
  val ST_ID = "st_id"
  val ST_NUMERO = "st_numero"
  val ST_NRODOC = "st_nrodoc"
  val ST_DESCRIP = "st_descrip"
  val ST_FECHA = "st_fecha"
  val ST_DOC_CLIENTE = "st_doc_cliente"
  val ID_CLIENTE = "id_cliente"
  val DOCT_ID_CLIENTE = "doct_id_cliente"
  val DOC_CLIENTE = "doc_cliente"

  // StockItem
  val STOCK_ITEM = "StockItem"
  val STI_ID = "sti_id"
  val STI_ORDEN = "sti_orden"
  val STI_DESCRIP = "sti_descrip"
  val STI_INGRESO = "sti_ingreso"
  val STI_SALIDA = "sti_salida"
  val STI_GRUPO = "sti_grupo"

  // StockItemKit
  val STIK_ORDEN = "sti_orden"
  val STIK_CANTIDAD = "sti_cantidad"

  // StockTMP
  val STOCK_TMP = "StockTMP"
  val ST_TMP_ID = "stTMP_id"

  // StockItemTMP
  val STOCK_ITEM_TMP = "StockItemTMP"
  val STI_TMP_ID = "stiTMP_id"

  val DEPL_ID_INTERNO = -2
  val DEPL_ID_TERCERO = -3

  val NO_CONTROLA_STOCK = 2
  val STOCK_LOGICO = 3
  val STOCK_FISICO = 4
  val STOCK_NEGATIVO = 5

}

object S {

  val NEW_STOCK = 20001
  val EDIT_STOCK = 20002
  val DELETE_STOCK = 20003
  val LIST_STOCK = 20004
}