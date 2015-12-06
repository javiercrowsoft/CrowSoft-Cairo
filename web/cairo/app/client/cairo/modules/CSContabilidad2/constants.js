(function() {
  "use strict";

  Cairo.Contabilidad = {

    Constants: {

      // Asiento
      ASIENTO: "Asiento",
      AS_ID: "as_id",
      AS_NUMERO: "as_numero",
      AS_NRODOC: "as_nrodoc",
      AS_DESCRIP: "as_descrip",
      AS_FECHA: "as_fecha",
      AS_DOC_CLIENTE: "as_doc_cliente",

      // AsientoItem
      ASIENTO_ITEM: "AsientoItem",
      ASI_ID: "asi_id",
      ASI_ORDEN: "asi_orden",
      ASI_DESCRIP: "asi_descrip",
      ASI_DEBE: "asi_debe",
      ASI_HABER: "asi_haber",
      ASI_ORIGEN: "asi_origen",

      // AsientoItemTMP
      ASIENTO_ITEM_TMP: "AsientoItemTMP",
      ASI_TMP_ID: "asiTMP_id",

      // Ejercicio
      EJERCICIO_CONTABLE: "EjercicioContable",
      EJC_ID: "ejc_id",
      EJC_NOMBRE: "ejc_nombre",
      EJC_CODIGO: "ejc_codigo",
      EJC_FECHA_INI: "ejc_fechaini",
      EJC_FECHA_FIN: "ejc_fechafin",
      EJC_DESCRIP: "ejc_descrip",
      EJC_ABIERTO: "ejc_abierto",
      AS_ID_APERTURA: "as_id_apertura",
      AS_ID_CIERRE_PATRIMONIAL: "as_id_cierrepatrimonial",
      AS_ID_CIERRE_RESULTADOS: "as_id_cierreresultados",
      CUE_ID_RESULTADO: "cue_id_resultado"

    }
  };

  Cairo.Security.Actions.Contabilidad = {

    NEW_ASIENTO: 19002,
    EDIT_ASIENTO: 19003,
    DELETE_ASIENTO: 19004,
    LIST_ASIENTO: 19005,

    NEW_EJERCICIO: 19002,
    EDIT_EJERCICIO: 19003,
    DELETE_EJERCICIO: 19004,
    LIST_EJERCICIO: 19005,

    RENUMERAR_ASIENTOS: 19009
  }

}());