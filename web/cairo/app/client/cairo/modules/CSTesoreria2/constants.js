(function() {
  "use strict";

  Cairo.Tesoreria = {

    Constants: {

      // DepositoBanco
      DEPOSITO_BANCO: "DepositoBanco",
      DBCO_ID: "dbco_id",
      DBCO_NUMERO: "dbco_numero",
      DBCO_NRODOC: "dbco_nrodoc",
      DBCO_DESCRIP: "dbco_descrip",
      DBCO_FECHA: "dbco_fecha",
      DBCO_COTIZACION: "dbco_cotizacion",
      DBCO_TOTAL: "dbco_total",
      DBCO_TOTALORIGEN: "dbco_totalorigen",
      DBCO_GRABARASIENTO: "dbco_grabarasiento",
      DBCO_FIRMADO: "dbco_firmado",

      // DepositoBancoTMP
      DEPOSITO_BANCO_TMP: "DepositoBancoTMP",
      DBCO_TMP_ID: "dbcoTMP_id",

      // DepositoBancoItem
      DEPOSITO_BANCO_ITEM: "DepositoBancoItem",
      DBCOI_ID: "dbcoi_id",
      DBCOI_ORDEN: "dbcoi_orden",
      DBCOI_IMPORTE: "dbcoi_importe",
      DBCOI_IMPORTEORIGEN: "dbcoi_importeorigen",
      DBCOI_DESCRIP: "dbcoi_descrip",
      DBCOI_TIPO: "dbcoi_tipo",

      // DepositoBancoItemTMP
      DEPOSITO_BANCO_ITEM_TMP: "DepositoBancoItemTMP",
      DBCOI_TMP_ID: "dbcoiTMP_id",
      DBCOI_TMP_CHEQUE: "dbcoiTMP_cheque",
      DBCOI_TMP_FECHA_COBRO: "dbcoiTMP_fechacobro",
      DBCOI_TMP_FECHA_VTO: "dbcoiTMP_fechavto",

      // DepositoBancoItemBorradoTMP
      DEPOSITO_BANCO_ITEM_BORRADO_TMP: "DepositoBancoItemBorradoTMP",
      DBCOIB_TMP_ID: "dbcoibTMP_Id",

      // Cobranza
      COBRANZA: "Cobranza",
      COBZ_ID: "cobz_id",
      COBZ_NUMERO: "cobz_numero",
      COBZ_NRODOC: "cobz_nrodoc",
      COBZ_DESCRIP: "cobz_descrip",
      COBZ_FECHA: "cobz_fecha",
      COBZ_NETO: "cobz_neto",
      COBZ_OTROS: "cobz_otros",
      COBZ_TOTAL: "cobz_total",
      COBZ_PENDIENTE: "cobz_pendiente",
      COBZ_COTIZACION: "cobz_cotizacion",
      COBZ_GRABAR_ASIENTO: "cobz_grabarAsiento",
      COBZ_FIRMADO: "cobz_firmado",
      COBZ_HOJA_RUTA: "cobz_hojaruta",

      // CobranzaTMP
      COBRANZA_TMP: "CobranzaTMP",
      COBZ_TMP_ID: "cobzTMP_id",

      // CobranzaItem
      COBRANZA_ITEM: "CobranzaItem",
      COBZI_ID: "cobzi_id",
      COBZI_ORDEN: "cobzi_orden",
      COBZI_OTRO_TIPO: "cobzi_otroTipo",
      COBZI_IMPORTE: "cobzi_importe",
      COBZI_IMPORTE_ORIGEN: "cobzi_importeOrigen",
      COBZI_DESCRIP: "cobzi_descrip",
      COBZI_PORC_RETENCION: "cobzi_porcRetencion",
      COBZI_FECHA_RETENCION: "cobzi_fechaRetencion",
      COBZI_NRO_RETENCION: "cobzi_nroRetencion",
      COBZI_TIPO: "cobzi_tipo",
      COBZI_TARJETA_TIPO: "cobzi_tarjetaTipo",

      // CobranzaItemTMP
      COBRANZA_ITEM_TMP: "CobranzaItemTMP",
      COBZI_TMP_ID: "cobziTMP_id",
      COBZI_TMP_CHEQUE: "cobziTMP_cheque",
      COBZI_TMP_CHEQUERA: "cobziTMP_chequera",
      COBZI_TMP_CUPON: "cobziTMP_cupon",
      COBZI_TMP_FECHA_COBRO: "cobziTMP_fechaCobro",
      COBZI_TMP_FECHA_VTO: "cobziTMP_fechaVto",
      COBZI_TMP_TITULAR: "cobziTMP_titular",
      COBZI_TMP_AUTORIZACION: "cobziTMP_autorizacion",
      COBZI_TMP_NRO_TARJETA: "cobziTMP_nroTarjeta",
      COBZI_TMP_PROPIO: "cobziTMP_propio",

      // CobranzaItemBorradoTMP
      COBRANZA_ITEM_BORRADO_TMP: "CobranzaItemBorradoTMP",
      COBZIB_TMP_ID: "cobzibTMP_Id",

      // Cheque
      // Cheque
      CHEQUE: "Cheque",
      CHEQ_ID: "cheq_id",
      CHEQ_NUMERO: "cheq_numero",
      CHEQ_NUMERO_DOC: "cheq_numerodoc",
      CHEQ_IMPORTE: "cheq_importe",
      CHEQ_IMPORTE_ORIGEN: "cheq_importeOrigen",
      CHEQ_TIPO: "cheq_tipo",
      CHEQ_FECHA_VTO: "cheq_fechaVto",
      CHEQ_FECHA_COBRO: "cheq_fechaCobro",
      CHEQ_DESCRIP: "cheq_descrip",
      CHEQ_FC_IMPORTE1: "cheq_fc_importe1",
      CHEQ_FC_IMPORTE2: "cheq_fc_importe2",
      CHEQ_FV_IMPORTE: "cheq_fv_importe",
      CHEQ_FECHA_RECHAZO: "cheq_fechaRechazo",
      CHEQ_RECHAZADO: "cheq_rechazado",

      CHEQ_PROPIO: "cheq_propio",

      FC_ID_ND1: "fc_id_nd1",
      FC_ID_ND2: "fc_id_nd2",
      FV_ID_ND: "fv_id_nd",

      // Tarjeta Credito Cupon
      TARJETA_CREDITO_CUPON: "TarjetaCreditoCupon",
      TJCC_ID: "tjcc_id",
      TJCC_NUMERO: "tjcc_numero",
      TJCC_NUMERO_DOC: "tjcc_numerodoc",
      TJCC_DESCRIP: "tjcc_descrip",
      TJCC_FECHA_VTO: "tjcc_fechavto",
      TJCC_NRO_TARJETA: "tjcc_nroTarjeta",
      TJCC_NRO_AUTORIZACION: "tjcc_nroAutorizacion",
      TJCC_TITULAR: "tjcc_titular",
      TJCC_IMPORTE: "tjcc_importe",
      TJCC_IMPORTE_ORIGEN: "tjcc_importeOrigen",

      // FacturaVentaCobranza
      FACTURA_VENTA_COBRANZA_TMP: "FacturaVentaCobranzaTMP",
      FV_COBZ_IMPORTE: "fvcobz_importe",
      FV_COBZ_TMP_ID: "fvcobzTMP_id",
      FV_COBZ_ID: "fvcobz_id",
      FV_COBZ_IMPORTE_ORIGEN: "fvcobz_importeOrigen",
      FV_COBZ_COTIZACION: "fvcobz_cotizacion",

      // FacturaVentaNotaCredito
      FACTURA_VENTA_NOTA_CREDITO: "FacturaVentaNotaCredito",
      FV_NC_IMPORTE: "fvnc_importe",
      FV_NC_ID: "fvnc_id",
      FV_ID_NOTA_CREDITO: "fv_id_notacredito",
      FV_ID_FACTURA: "fv_id_factura",
      FVD_ID_NOTA_CREDITO: "fvd_id_notacredito",
      FVD_ID_FACTURA: "fvd_id_factura",
      FVP_ID_NOTA_CREDITO: "fvp_id_notacredito",
      FVP_ID_FACTURA: "fvp_id_factura",

      // FacturaVentaNotaCreditoTMP
      FACTURA_VENTA_NOTA_CREDITOTMP: "FacturaVentaNotaCreditoTMP",
      FV_NC_TMP_ID: "fvncTMP_id",

      // OrdenPago
      ORDEN_PAGO: "OrdenPago",
      OPG_ID: "opg_id",
      OPG_NUMERO: "opg_numero",
      OPG_NRODOC: "opg_nrodoc",
      OPG_DESCRIP: "opg_descrip",
      OPG_FECHA: "opg_fecha",
      OPG_NETO: "opg_neto",
      OPG_OTROS: "opg_otros",
      OPG_TOTAL: "opg_total",
      OPG_PENDIENTE: "opg_pendiente",
      OPG_COTIZACION: "opg_cotizacion",
      OPG_GRABAR_ASIENTO: "opg_grabarAsiento",
      OPG_FIRMADO: "opg_firmado",

      // OrdenPagoTMP
      ORDEN_PAGO_TMP: "OrdenPagoTMP",
      OPG_TMP_ID: "opgTMP_id",

      // OrdenPagoItem
      ORDEN_PAGO_ITEM: "OrdenPagoItem",
      OPGI_ID: "opgi_id",
      OPGI_ORDEN: "opgi_orden",
      OPGI_OTRO_TIPO: "opgi_otroTipo",
      OPGI_IMPORTE: "opgi_importe",
      OPGI_IMPORTE_ORIGEN: "opgi_importeOrigen",
      OPGI_DESCRIP: "opgi_descrip",
      OPGI_PORC_RETENCION: "opgi_porcRetencion",
      OPGI_FECHA_RETENCION: "opgi_fechaRetencion",
      OPGI_NRO_RETENCION: "opgi_nroRetencion",
      OPGI_TIPO: "opgi_tipo",

      // OrdenPagoItemTMP
      ORDEN_PAGO_ITEM_TMP: "OrdenPagoItemTMP",
      OPGI_TMP_ID: "opgiTMP_id",
      OPGI_TMP_CHEQUE: "opgiTMP_cheque",
      OPGI_TMP_CUPON: "opgiTMP_cupon",
      OPGI_TMP_FECHA_COBRO: "opgiTMP_fechaCobro",
      OPGI_TMP_FECHA_VTO: "opgiTMP_fechaVto",
      OPGI_TMP_TITULAR: "opgiTMP_titular",
      OPGI_TMP_AUTORIZACION: "opgiTMP_autorizacion",
      OPGI_TMP_NRO_TARJETA: "opgiTMP_nroTarjeta",

      // OrdenPagoItemBorradoTMP
      ORDEN_PAGO_ITEM_BORRADO_TMP: "OrdenPagoItemBorradoTMP",
      OPGIB_TMP_ID: "OpgibTMP_Id",

      // FacturaCompraCobranza
      FACTURA_COMPRA_ORDEN_PAGO_TMP: "FacturaCompraOrdenPagoTMP",
      FC_OPG_IMPORTE: "fcopg_importe",
      FC_OPG_TMP_ID: "fcopgTMP_id",
      FC_OPG_ID: "fcopg_id",
      FC_OPG_IMPORTE_ORIGEN: "fcopg_importeOrigen",
      FC_OPG_COTIZACION: "fcopg_cotizacion",

      // FacturaCompraNotaCredito
      FACTURA_COMPRA_NOTA_CREDITO: "FacturaCompraNotaCredito",
      FC_NC_IMPORTE: "fcnc_importe",
      FC_NC_ID: "fcnc_id",
      FC_ID_NOTA_CREDITO: "fc_id_notacredito",
      FC_ID_FACTURA: "fc_id_factura",
      FCD_ID_NOTA_CREDITO: "fcd_id_notacredito",
      FCD_ID_FACTURA: "fcd_id_factura",
      FCP_ID_NOTA_CREDITO: "fcp_id_notacredito",
      FCP_ID_FACTURA: "fcp_id_factura",

      // FacturaCompraNotaCreditoTMP
      FACTURA_COMPRA_NOTA_CREDITO_TMP: "FacturaCompraNotaCreditoTMP",
      FC_NC_TMP_ID: "fvncTMP_id",

      // Movimiento de Fondos TMP
      MOVIMIENTO_FONDO_TMP: "MovimientoFondoTMP",
      MF_TMP_ID: "mfTMP_id",

      // Movimiento de Fondos
      MOVIMIENTO_FONDO: "MovimientoFondo",
      MF_ID: "mf_id",
      MF_NUMERO: "mf_numero",
      MF_NRODOC: "mf_nrodoc",
      MF_DESCRIP: "mf_descrip",
      MF_FECHA: "mf_fecha",
      MF_TOTAL: "mf_total",
      MF_TOTALORIGEN: "mf_totalorigen",
      MF_PENDIENTE: "mf_pendiente",
      MF_FIRMADO: "mf_firmado",
      MF_GRABARASIENTO: "mf_grabarasiento",
      MF_COTIZACION: "mf_cotizacion",

      // Movimiento de Fondos Item MTP
      MOVIMIENTO_FONDO_ITEM_TMP: "MovimientoFondoItemTMP",
      MFI_TMP_ID: "mfiTMP_id",
      MFI_TMP_CHEQUE: "mfiTMP_cheque",
      MFI_TMP_FECHA_COBRO: "mfiTMP_FechaCobro",
      MFI_TMP_FECHA_VTO: "mfiTMP_FechaVto",

      // Movimiento de Fondos Item Borrado MTP
      MOVIMIENTO_FONDO_ITEM_BORRADO_TMP: "MovimientoFondoItemBorradoTMP",
      MFIB_TMP_ID: "mfibTMP_id",

      // Movimiento de Fondos Item
      MOVIMIENTO_FONDO_ITEM: "MovimientoFondoItem",
      MFI_ID: "mfi_id",
      MFI_ORDEN: "mfi_orden",
      MFI_DESCRIP: "mfi_descrip",
      MFI_IMPORTE: "mfi_importe",
      MFI_IMPORTE_ORIGEN: "mfi_importeorigen",
      MFI_IMPORTE_ORIGEN_HABER: "mfi_importeorigenHaber",
      MFI_TIPO: "mfi_tipo",
      CUE_ID_DEBE: "cue_id_debe",
      CUE_ID_HABER: "cue_id_haber",

      // DepositoCupon
      DEPOSITO_CUPON: "DepositoCupon",
      DCUP_ID: "dcup_id",
      DCUP_NUMERO: "dcup_numero",
      DCUP_NRODOC: "dcup_nrodoc",
      DCUP_DESCRIP: "dcup_descrip",
      DCUP_FECHA: "dcup_fecha",
      DCUP_TOTAL: "dcup_total",
      DCUP_GRABARASIENTO: "dcup_grabarasiento",
      DCUP_FIRMADO: "dcup_firmado",

      // DepositoCuponTMP
      DEPOSITO_CUPON_TMP: "DepositoCuponTMP",
      DCUP_TMP_ID: "dcupTMP_id",

      // DepositoCuponItem
      DEPOSITO_CUPON_ITEM: "DepositoCuponItem",
      DCUPI_ID: "dcupi_id",
      DCUPI_ORDEN: "dcupi_orden",
      DCUPI_IMPORTE: "dcupi_importe",
      DCUPI_IMPORTEORIGEN: "dcupi_importeorigen",
      DCUPI_DESCRIP: "dcupi_descrip",

      // DepositoCuponItemTMP
      DEPOSITO_CUPON_ITEM_TMP: "DepositoCuponItemTMP",
      DCUPI_TMP_ID: "dcupiTMP_id",

      // DepositoCuponItemBorradoTMP
      DEPOSITO_CUPON_ITEM_BORRADO_TMP: "DepositoCuponItemBorradoTMP",
      DCUPIB_TMP_ID: "dcupibTMP_Id",

      ///////////////////////////////////////////////////////////////////////////////////

      // ResolucionCupon
      RESOLUCION_CUPON: "ResolucionCupon",
      RCUP_ID: "rcup_id",
      RCUP_NUMERO: "rcup_numero",
      RCUP_NRODOC: "rcup_nrodoc",
      RCUP_DESCRIP: "rcup_descrip",
      RCUP_FECHA: "rcup_fecha",
      RCUP_TOTAL: "rcup_total",
      RCUP_GRABARASIENTO: "rcup_grabarasiento",
      RCUP_FIRMADO: "rcup_firmado",

      // ResolucionCuponTMP
      RESOLUCION_CUPON_TMP: "ResolucionCuponTMP",
      RCUP_TMP_ID: "rcupTMP_id",

      // ResolucionCuponItem
      RESOLUCION_CUPON_ITEM: "ResolucionCuponItem",
      RCUPI_ID: "rcupi_id",
      RCUPI_ORDEN: "rcupi_orden",
      RCUPI_IMPORTE: "rcupi_importe",
      RCUPI_IMPORTE_ORIGEN: "rcupi_importeorigen",
      RCUPI_DESCRIP: "rcupi_descrip",
      RCUPI_RECHAZADO: "rcupi_rechazado",
      RCUPI_CUOTA: "rcupi_cuota",
      RCUPI_COMISION: "rcupi_comision",

      // ResolucionCuponItemTMP
      RESOLUCION_CUPON_ITEM_TMP: "ResolucionCuponItemTMP",
      RCUPI_TMP_ID: "rcupiTMP_id",

      // ResolucionCuponItemBorradoTMP
      RESOLUCION_CUPON_ITEM_BORRADO_TMP: "ResolucionCuponItemBorradoTMP",
      RCUPIB_TMP_ID: "rcupibTMP_Id",

      // CashFlow
      CASH_FLOW: "CashFlow",
      CF_ID: "cf_id",
      CF_NAME: "cf_nombre",
      CF_FECHA: "cf_fecha",
      CF_DESCRIP: "cf_descrip",
      CF_FECHADESDE: "cf_fechadesde",
      CF_FECHAHASTA: "cf_fechahasta",
      CF_FECHACHEQUE: "cf_fechacheque",
      CF_FV: "cf_fv",
      CF_RV: "cf_rv",
      CF_PV: "cf_pv",
      CF_FC: "cf_fc",
      CF_RC: "cf_rc",
      CF_OC: "cf_oc",

      // CashFlowItems
      CASH_FLOW_ITEM: "CashFlowItem",
      CFI_ID: "cfi_id",
      CFI_FECHA: "cfi_fecha",
      CFI_IMPORTE: "cfi_importe",
      CFI_EXCLUIR: "cfi_excluir",
      CFI_TIPO: "cfi_tipo",
      COMP_ID: "comp_id",

      // CashFlowParams
      CASH_FLOW_PARAM: "CashFlowParam",
      CFP_ID: "cfp_id",

      // BancoConciliacion
      BANCO_CONCILIACION: "BancoConciliacion",
      BCOC_ID: "bcoc_id",
      BCOC_NUMERO: "bcoc_numero",
      BCOC_FECHA: "bcoc_fecha",
      BCOC_FECHA_DESDE: "bcoc_fechaDesde",
      BCOC_FECHA_HASTA: "bcoc_fechaHasta",
      BCOC_SALDO_INICIAL_CONT: "bcoc_saldoInicialCont",
      BCOC_SALDO_CONT: "bcoc_saldoCont",
      BCOC_SALDO_INICIAL_BCO: "bcoc_saldoInicialBco",
      BCOC_CONCILIADO_BCO: "bcoc_conciliadoBco",
      BCOC_SALDO_BCO: "bcoc_saldoBco",
      BCOC_SALDO_INICIAL_RECH: "bcoc_saldoInicialRech",
      BCOC_RECHAZADO: "bcoc_rechazado",
      BCOC_SALDO_RECH: "bcoc_saldoRech",
      BCOC_SALDO_INICIAL_PENDIENTE: "bcoc_saldoInicialPendiente",
      BCOC_PENDIENTE: "bcoc_pendiente",
      BCOC_SALDO_PENDIENTE: "bcoc_saldoPendiente",
      BCOC_FECHACHEQUE: "bcoc_fechacheque",
      BCOC_VERPENDIENTES: "bcoc_verpendientes",
      BCOC_DESCRIP: "bcoc_descrip",

      // BancoConciliacionItem
      BANCO_CONCILIACION_ITEM: "BancoConciliacionItem",
      BCOCI_ID: "bcoci_id",
      BCOCI_DEBE: "bcoci_debe",
      BCOCI_HABER: "bcoci_haber",
      BCOCI_FECHA: "bcoci_fecha",
      BCOCI_ESTADO: "bcoci_estado",
      BCOCI_DESCRIP: "bcoci_descrip",
      BCOCI_SALDO_CONT: "bcoci_saldocont",
      BCOCI_SALDO_BCO: "bcoci_saldobco",

      FC_ID_RET: "fc_id_ret",
      FV_ID_RET: "fv_id_ret",

      CobranzaItemTipo: {
        ITEM_CHEQUES: 1,
        ITEM_EFECTIVO: 2,
        ITEM_TARJETA: 3,
        ITEM_OTROS: 4,
        ITEM_CTACTE: 5
      },

      OtroTipo: {
        OTRO_DEBE: 1,
        OTRO_HABER: 2
      },

      CuponTipo: {
        CUPON_POSNET: 1,
        CUPON_MANUAL: 2
      }
    }
  };

  Cairo.Security.Actions.Tesoreria = {

    NEW_COBRANZA: 18007,
    EDIT_COBRANZA: 18008,
    DELETE_COBRANZA: 18009,
    LIST_COBRANZA: 18010,
    DES_ANULAR_COBRANZA: 18011,
    ANULAR_COBRANZA: 18012,

    MODIFY_APLIC: 18013,
    NEW_ORDEN_PAGO: 18014,
    EDIT_ORDEN_PAGO: 18015,
    DELETE_ORDEN_PAGO: 18016,
    LIST_ORDEN_PAGO: 18017,
    DES_ANULAR_ORDEN_PAGO: 18018,
    ANULAR_ORDEN_PAGO: 18019,

    NEW_MOVIMIENTO_FONDO: 18020,
    EDIT_MOVIMIENTO_FONDO: 18021,
    DELETE_MOVIMIENTO_FONDO: 18022,
    LIST_MOVIMIENTO_FONDO: 18023,
    DES_ANULAR_MOVIMIENTO_FONDO: 18024,
    ANULAR_MOVIMIENTO_FONDO: 18025,

    NEW_DEPOSITO_BANCO: 18032,
    EDIT_DEPOSITO_BANCO: 18033,
    DELETE_DEPOSITO_BANCO: 18034,
    LIST_DEPOSITO_BANCO: 18035,
    DES_ANULAR_DEPOSITO_BANCO: 18036,
    ANULAR_DEPOSITO_BANCO: 18037,

    NEW_DEPOSITO_CUPON: 18038,
    EDIT_DEPOSITO_CUPON: 18039,
    DELETE_DEPOSITO_CUPON: 18040,
    LIST_DEPOSITO_CUPON: 18041,
    DES_ANULAR_DEPOSITO_CUPON: 18042,
    ANULAR_DEPOSITO_CUPON: 18043,

    NEW_RESOLUCION_CUPON: 18044,
    EDIT_RESOLUCION_CUPON: 18045,
    DELETE_RESOLUCION_CUPON: 18046,
    LIST_RESOLUCION_CUPON: 18047,
    DES_ANULAR_RESOLUCION_CUPON: 18048,
    ANULAR_RESOLUCION_CUPON: 18049,

    EDIT_RECHAZO_CHEQUE: 18050,

    EDIT_CONCILIACION_BCO: 18051,
    LIST_CONCILIACION_BCO: 18053,
    DELETE_CONCILIACION_BCO: 18054,
    NEW_CONCILIACION_BCO: 18055,

    EDIT_CASHFLOW: 18052
  }

}());