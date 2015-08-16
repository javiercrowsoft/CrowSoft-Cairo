package models.cairo.modules.contabilidad

object C {

  val ASIENTO_ID = "ids"
  val ASIENTO_BASE = "base"

  val ASIENTO_ITEM_DELETED = "deletedItems"

  // Asiento
  val ASIENTO = "Asiento"
  val AS_ID = "as_id"
  val AS_NUMERO = "as_numero"
  val AS_NRODOC = "as_nrodoc"
  val AS_DESCRIP = "as_descrip"
  val AS_FECHA = "as_fecha"
  val AS_DOC_CLIENTE = "as_doc_cliente"
  val ID_CLIENTE = "id_cliente"
  val DOCT_ID_CLIENTE = "doct_id_cliente"
  val DOC_CLIENTE = "doc_cliente"

  // AsientoItem
  val ASIENTO_ITEM = "AsientoItem"
  val ASI_ID = "asi_id"
  val ASI_ORDEN = "asi_orden"
  val ASI_DESCRIP = "asi_descrip"
  val ASI_DEBE = "asi_debe"
  val ASI_HABER = "asi_haber"
  val ASI_ORIGEN = "asi_origen"

  // AsientoTMP
  val ASIENTO_TMP = "AsientoTMP"
  val AS_TMP_ID = "asTMP_id"

  // AsientoItemTMP
  val ASIENTO_ITEM_TMP = "AsientoItemTMP"
  val ASI_TMP_ID = "asiTMP_id"

  // AsientoItemBarradoTMP
  val ASIENTO_ITEM_BORRADO_TMP = "AsientoItemBorradoTMP"
  val ASIB_TMP_ID = "asibTMP_id"

  // Ejercicio
  val EJERCICIO_CONTABLE = "EjercicioContable"
  val EJC_ID = "ejc_id"
  val EJC_NOMBRE = "ejc_nombre"
  val EJC_CODIGO = "ejc_codigo"
  val EJC_FECHA_INI = "ejc_fechaini"
  val EJC_FECHA_FIN = "ejc_fechafin"
  val EJC_DESCRIP = "ejc_descrip"
  val EJC_ABIERTO = "ejc_abierto"
  val AS_ID_APERTURA = "as_id_apertura"
  val AS_ID_CIERRE_PATRIMONIAL = "as_id_cierrepatrimonial"
  val AS_ID_CIERRE_RESULTADOS = "as_id_cierreresultados"
  val CUE_ID_RESULTADO = "cue_id_resultado"

}

object S {

  val NEW_ASIENTO = 19002
  val EDIT_ASIENTO = 19003
  val DELETE_ASIENTO = 19004
  val LIST_ASIENTO = 19005

  val NEW_EJERCICIO = 19002
  val EDIT_EJERCICIO = 19003
  val DELETE_EJERCICIO = 19004
  val LIST_EJERCICIO = 19005

  val RENUMERAR_ASIENTOS = 19009

}