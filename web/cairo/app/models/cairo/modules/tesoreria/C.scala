package models.cairo.modules.tesoreria

object C {

  val COBRANZA_ID = "ids"
  val COBRANZA_BASE = "base"
  val COBRANZA_PRECIOS = "precios"
  val COBRANZA_TOTALS = "totals"

  val COBRANZA_ITEM_BASE = "base"
  val COBRANZA_ITEM_TOTALS = "totals"

  val COBRANZA_ITEM_DELETED = "deletedItems"

  val FVD_ID = "fvd_id"
  val FVP_ID = "fvp_id"

  // DepositoBanco
  val DEPOSITO_BANCO = "DepositoBanco"
  val DBCO_ID = "dbco_id"
  val DBCO_NUMERO = "dbco_numero"
  val DBCO_NRODOC = "dbco_nrodoc"
  val DBCO_DESCRIP = "dbco_descrip"
  val DBCO_FECHA = "dbco_fecha"
  val DBCO_COTIZACION = "dbco_cotizacion"
  val DBCO_TOTAL = "dbco_total"
  val DBCO_TOTAL_ORIGEN = "dbco_totalorigen"
  val DBCO_GRABAR_ASIENTO = "dbco_grabarasiento"
  val DBCO_FIRMADO = "dbco_firmado"

  // DepositoBancoTMP
  val DEPOSITO_BANCO_TMP = "DepositoBancoTMP"
  val DBCO_TMP_ID = "dbcoTMP_id"

  // DepositoBancoItem
  val DEPOSITO_BANCO_ITEM = "DepositoBancoItem"
  val DBCOI_ID = "dbcoi_id"
  val DBCOI_ORDEN = "dbcoi_orden"
  val DBCOI_IMPORTE = "dbcoi_importe"
  val DBCOI_IMPORTE_ORIGEN = "dbcoi_importeorigen"
  val DBCOI_DESCRIP = "dbcoi_descrip"
  val DBCOI_TIPO = "dbcoi_tipo"

  // DepositoBancoItemTMP
  val DEPOSITO_BANCO_ITEM_TMP = "DepositoBancoItemTMP"
  val DBCOI_TMP_ID = "dbcoiTMP_id"
  val DBCOI_TMP_CHEQUE = "dbcoiTMP_cheque"
  val DBCOI_TMP_FECHA_COBRO = "dbcoiTMP_fechacobro"
  val DBCOI_TMP_FECHA_VTO = "dbcoiTMP_fechavto"

  // DepositoBancoItemBorradoTMP
  val DEPOSITO_BANCO_ITEM_BORRADO_TMP = "DepositoBancoItemBorradoTMP"
  val DBCOIB_TMP_ID = "dbcoibTMP_Id"

  // Cobranza
  val COBRANZA = "Cobranza"
  val COBZ_ID = "cobz_id"
  val COBZ_NUMERO = "cobz_numero"
  val COBZ_NRODOC = "cobz_nrodoc"
  val COBZ_DESCRIP = "cobz_descrip"
  val COBZ_FECHA = "cobz_fecha"
  val COBZ_NETO = "cobz_neto"
  val COBZ_OTROS = "cobz_otros"
  val COBZ_TOTAL = "cobz_total"
  val COBZ_PENDIENTE = "cobz_pendiente"
  val COBZ_COTIZACION = "cobz_cotizacion"
  val COBZ_GRABAR_ASIENTO = "cobz_grabarAsiento"
  val COBZ_FIRMADO = "cobz_firmado"
  val COBZ_HOJA_RUTA = "cobz_hojaruta"

  // CobranzaTMP
  val COBRANZA_TMP = "CobranzaTMP"
  val COBZ_TMP_ID = "cobzTMP_id"

  // CobranzaItem
  val COBRANZA_ITEM = "CobranzaItem"
  val COBZI_ID = "cobzi_id"
  val COBZI_ORDEN = "cobzi_orden"
  val COBZI_OTRO_TIPO = "cobzi_otroTipo"
  val COBZI_IMPORTE = "cobzi_importe"
  val COBZI_IMPORTE_ORIGEN = "cobzi_importeOrigen"
  val COBZI_DESCRIP = "cobzi_descrip"
  val COBZI_PORC_RETENCION = "cobzi_porcRetencion"
  val COBZI_FECHA_RETENCION = "cobzi_fechaRetencion"
  val COBZI_NRO_RETENCION = "cobzi_nroRetencion"
  val COBZI_TIPO = "cobzi_tipo"
  val COBZI_TARJETA_TIPO = "cobzi_tarjetaTipo"

  // CobranzaItemTMP
  val COBRANZA_ITEM_TMP = "CobranzaItemTMP"
  val COBZI_TMP_ID = "cobziTMP_id"
  val COBZI_TMP_CHEQUE = "cobziTMP_cheque"
  val COBZI_TMP_CHEQUERA = "cobziTMP_chequera"
  val COBZI_TMP_CUPON = "cobziTMP_cupon"
  val COBZI_TMP_FECHA_COBRO = "cobziTMP_fechaCobro"
  val COBZI_TMP_FECHA_VTO = "cobziTMP_fechaVto"
  val COBZI_TMP_TITULAR = "cobziTMP_titular"
  val COBZI_TMP_AUTORIZACION = "cobziTMP_autorizacion"
  val COBZI_TMP_NRO_TARJETA = "cobziTMP_nroTarjeta"
  val COBZI_TMP_PROPIO = "cobziTMP_propio"

  // CobranzaItemBorradoTMP
  val COBRANZA_ITEM_BORRADO_TMP = "CobranzaItemBorradoTMP"
  val COBZIB_TMP_ID = "cobzibTMP_Id"

  // Cheque
  // Cheque
  val CHEQUE = "Cheque"
  val CHEQ_ID = "cheq_id"
  val CHEQ_NUMERO = "cheq_numero"
  val CHEQ_NUMERO_DOC = "cheq_numerodoc"
  val CHEQ_IMPORTE = "cheq_importe"
  val CHEQ_IMPORTE_ORIGEN = "cheq_importeOrigen"
  val CHEQ_TIPO = "cheq_tipo"
  val CHEQ_FECHA_VTO = "cheq_fechaVto"
  val CHEQ_FECHA_COBRO = "cheq_fechaCobro"
  val CHEQ_DESCRIP = "cheq_descrip"
  val CHEQ_FC_IMPORTE1 = "cheq_fc_importe1"
  val CHEQ_FC_IMPORTE2 = "cheq_fc_importe2"
  val CHEQ_FV_IMPORTE = "cheq_fv_importe"
  val CHEQ_FECHA_RECHAZO = "cheq_fechaRechazo"
  val CHEQ_RECHAZADO = "cheq_rechazado"

  val CHEQ_PROPIO = "cheq_propio"

  val FC_ID_ND1 = "fc_id_nd1"
  val FC_ID_ND2 = "fc_id_nd2"
  val FV_ID_ND = "fv_id_nd"

  // Tarjeta Credito Cupon
  val TARJETA_CREDITO_CUPON = "TarjetaCreditoCupon"
  val TJCC_ID = "tjcc_id"
  val TJCC_NUMERO = "tjcc_numero"
  val TJCC_NUMERO_DOC = "tjcc_numerodoc"
  val TJCC_DESCRIP = "tjcc_descrip"
  val TJCC_FECHA_VTO = "tjcc_fechavto"
  val TJCC_NRO_TARJETA = "tjcc_nroTarjeta"
  val TJCC_NRO_AUTORIZACION = "tjcc_nroAutorizacion"
  val TJCC_TITULAR = "tjcc_titular"
  val TJCC_IMPORTE = "tjcc_importe"
  val TJCC_IMPORTE_ORIGEN = "tjcc_importeOrigen"

  // FacturaVentaCobranza
  val FACTURA_VENTA_COBRANZA_TMP = "FacturaVentaCobranzaTMP"
  val FV_COBZ_IMPORTE = "fvcobz_importe"
  val FV_COBZ_TMP_ID = "fvcobzTMP_id"
  val FV_COBZ_ID = "fvcobz_id"
  val FV_COBZ_IMPORTE_ORIGEN = "fvcobz_importeOrigen"
  val FV_COBZ_COTIZACION = "fvcobz_cotizacion"

  // FacturaVentaNotaCredito
  val FACTURA_VENTA_NOTA_CREDITO = "FacturaVentaNotaCredito"
  val FV_NC_IMPORTE = "fvnc_importe"
  val FV_NC_ID = "fvnc_id"
  val FV_ID_NOTA_CREDITO = "fv_id_notacredito"
  val FV_ID_FACTURA = "fv_id_factura"
  val FVD_ID_NOTA_CREDITO = "fvd_id_notacredito"
  val FVD_ID_FACTURA = "fvd_id_factura"
  val FVP_ID_NOTA_CREDITO = "fvp_id_notacredito"
  val FVP_ID_FACTURA = "fvp_id_factura"

  // FacturaVentaNotaCreditoTMP
  val FACTURA_VENTA_NOTA_CREDITOTMP = "FacturaVentaNotaCreditoTMP"
  val FV_NC_TMP_ID = "fvncTMP_id"

  // OrdenPago
  val ORDEN_PAGO = "OrdenPago"
  val OPG_ID = "opg_id"
  val OPG_NUMERO = "opg_numero"
  val OPG_NRODOC = "opg_nrodoc"
  val OPG_DESCRIP = "opg_descrip"
  val OPG_FECHA = "opg_fecha"
  val OPG_NETO = "opg_neto"
  val OPG_OTROS = "opg_otros"
  val OPG_TOTAL = "opg_total"
  val OPG_PENDIENTE = "opg_pendiente"
  val OPG_COTIZACION = "opg_cotizacion"
  val OPG_GRABAR_ASIENTO = "opg_grabarAsiento"
  val OPG_FIRMADO = "opg_firmado"

  // OrdenPagoTMP
  val ORDEN_PAGO_TMP = "OrdenPagoTMP"
  val OPG_TMP_ID = "opgTMP_id"

  // OrdenPagoItem
  val ORDEN_PAGO_ITEM = "OrdenPagoItem"
  val OPGI_ID = "opgi_id"
  val OPGI_ORDEN = "opgi_orden"
  val OPGI_OTRO_TIPO = "opgi_otroTipo"
  val OPGI_IMPORTE = "opgi_importe"
  val OPGI_IMPORTE_ORIGEN = "opgi_importeOrigen"
  val OPGI_DESCRIP = "opgi_descrip"
  val OPGI_PORC_RETENCION = "opgi_porcRetencion"
  val OPGI_FECHA_RETENCION = "opgi_fechaRetencion"
  val OPGI_NRO_RETENCION = "opgi_nroRetencion"
  val OPGI_TIPO = "opgi_tipo"

  // OrdenPagoItemTMP
  val ORDEN_PAGO_ITEM_TMP = "OrdenPagoItemTMP"
  val OPGI_TMP_ID = "opgiTMP_id"
  val OPGI_TMP_CHEQUE = "opgiTMP_cheque"
  val OPGI_TMP_CUPON = "opgiTMP_cupon"
  val OPGI_TMP_FECHA_COBRO = "opgiTMP_fechaCobro"
  val OPGI_TMP_FECHA_VTO = "opgiTMP_fechaVto"
  val OPGI_TMP_TITULAR = "opgiTMP_titular"
  val OPGI_TMP_AUTORIZACION = "opgiTMP_autorizacion"
  val OPGI_TMP_NRO_TARJETA = "opgiTMP_nroTarjeta"

  // OrdenPagoItemBorradoTMP
  val ORDEN_PAGO_ITEM_BORRADO_TMP = "OrdenPagoItemBorradoTMP"
  val OPGIB_TMP_ID = "OpgibTMP_Id"

  // FacturaCompraCobranza
  val FACTURA_COMPRA_ORDEN_PAGO_TMP = "FacturaCompraOrdenPagoTMP"
  val FC_OPG_IMPORTE = "fcopg_importe"
  val FC_OPG_TMP_ID = "fcopgTMP_id"
  val FC_OPG_ID = "fcopg_id"
  val FC_OPG_IMPORTE_ORIGEN = "fcopg_importeOrigen"
  val FC_OPG_COTIZACION = "fcopg_cotizacion"

  // FacturaCompraNotaCredito
  val FACTURA_COMPRA_NOTA_CREDITO = "FacturaCompraNotaCredito"
  val FC_NC_IMPORTE = "fcnc_importe"
  val FC_NC_ID = "fcnc_id"
  val FC_ID_NOTA_CREDITO = "fc_id_notacredito"
  val FC_ID_FACTURA = "fc_id_factura"
  val FCD_ID_NOTA_CREDITO = "fcd_id_notacredito"
  val FCD_ID_FACTURA = "fcd_id_factura"
  val FCP_ID_NOTA_CREDITO = "fcp_id_notacredito"
  val FCP_ID_FACTURA = "fcp_id_factura"

  // FacturaCompraNotaCreditoTMP
  val FACTURA_COMPRA_NOTA_CREDITO_TMP = "FacturaCompraNotaCreditoTMP"
  val FC_NC_TMP_ID = "fvncTMP_id"

  // Movimiento de Fondos TMP
  val MOVIMIENTO_FONDO_TMP = "MovimientoFondoTMP"
  val MF_TMP_ID = "mfTMP_id"

  // Movimiento de Fondos
  val MOVIMIENTO_FONDO = "MovimientoFondo"
  val MF_ID = "mf_id"
  val MF_NUMERO = "mf_numero"
  val MF_NRODOC = "mf_nrodoc"
  val MF_DESCRIP = "mf_descrip"
  val MF_FECHA = "mf_fecha"
  val MF_TOTAL = "mf_total"
  val MF_TOTAL_ORIGEN = "mf_totalorigen"
  val MF_PENDIENTE = "mf_pendiente"
  val MF_FIRMADO = "mf_firmado"
  val MF_GRABAR_ASIENTO = "mf_grabarasiento"
  val MF_COTIZACION = "mf_cotizacion"

  // Movimiento de Fondos Item MTP
  val MOVIMIENTO_FONDO_ITEM_TMP = "MovimientoFondoItemTMP"
  val MFI_TMP_ID = "mfiTMP_id"
  val MFI_TMP_CHEQUE = "mfiTMP_cheque"
  val MFI_TMP_FECHA_COBRO = "mfiTMP_FechaCobro"
  val MFI_TMP_FECHA_VTO = "mfiTMP_FechaVto"

  // Movimiento de Fondos Item Borrado MTP
  val MOVIMIENTO_FONDO_ITEM_BORRADO_TMP = "MovimientoFondoItemBorradoTMP"
  val MFIB_TMP_ID = "mfibTMP_id"

  // Movimiento de Fondos Item
  val MOVIMIENTO_FONDO_ITEM = "MovimientoFondoItem"
  val MFI_ID = "mfi_id"
  val MFI_ORDEN = "mfi_orden"
  val MFI_DESCRIP = "mfi_descrip"
  val MFI_IMPORTE = "mfi_importe"
  val MFI_IMPORTE_ORIGEN = "mfi_importeorigen"
  val MFI_IMPORTE_ORIGEN_HABER = "mfi_importeorigenHaber"
  val MFI_TIPO = "mfi_tipo"
  val CUE_ID_DEBE = "cue_id_debe"
  val CUE_ID_HABER = "cue_id_haber"

  // DepositoCupon
  val DEPOSITO_CUPON = "DepositoCupon"
  val DCUP_ID = "dcup_id"
  val DCUP_NUMERO = "dcup_numero"
  val DCUP_NRODOC = "dcup_nrodoc"
  val DCUP_DESCRIP = "dcup_descrip"
  val DCUP_FECHA = "dcup_fecha"
  val DCUP_TOTAL = "dcup_total"
  val DCUP_GRABAR_ASIENTO = "dcup_grabarasiento"
  val DCUP_FIRMADO = "dcup_firmado"

  // DepositoCuponTMP
  val DEPOSITO_CUPON_TMP = "DepositoCuponTMP"
  val DCUP_TMP_ID = "dcupTMP_id"

  // DepositoCuponItem
  val DEPOSITO_CUPON_ITEM = "DepositoCuponItem"
  val DCUPI_ID = "dcupi_id"
  val DCUPI_ORDEN = "dcupi_orden"
  val DCUPI_IMPORTE = "dcupi_importe"
  val DCUPI_IMPORTE_ORIGEN = "dcupi_importeorigen"
  val DCUPI_DESCRIP = "dcupi_descrip"

  // DepositoCuponItemTMP
  val DEPOSITO_CUPON_ITEM_TMP = "DepositoCuponItemTMP"
  val DCUPI_TMP_ID = "dcupiTMP_id"

  // DepositoCuponItemBorradoTMP
  val DEPOSITO_CUPON_ITEM_BORRADO_TMP = "DepositoCuponItemBorradoTMP"
  val DCUPIB_TMP_ID = "dcupibTMP_Id"

  ///////////////////////////////////////////////////////////////////////////////////

  // ResolucionCupon
  val RESOLUCION_CUPON = "ResolucionCupon"
  val RCUP_ID = "rcup_id"
  val RCUP_NUMERO = "rcup_numero"
  val RCUP_NRODOC = "rcup_nrodoc"
  val RCUP_DESCRIP = "rcup_descrip"
  val RCUP_FECHA = "rcup_fecha"
  val RCUP_TOTAL = "rcup_total"
  val RCUP_GRABAR_ASIENTO = "rcup_grabarasiento"
  val RCUP_FIRMADO = "rcup_firmado"

  // ResolucionCuponTMP
  val RESOLUCION_CUPON_TMP = "ResolucionCuponTMP"
  val RCUP_TMP_ID = "rcupTMP_id"

  // ResolucionCuponItem
  val RESOLUCION_CUPON_ITEM = "ResolucionCuponItem"
  val RCUPI_ID = "rcupi_id"
  val RCUPI_ORDEN = "rcupi_orden"
  val RCUPI_IMPORTE = "rcupi_importe"
  val RCUPI_IMPORTE_ORIGEN = "rcupi_importeorigen"
  val RCUPI_DESCRIP = "rcupi_descrip"
  val RCUPI_RECHAZADO = "rcupi_rechazado"
  val RCUPI_CUOTA = "rcupi_cuota"
  val RCUPI_COMISION = "rcupi_comision"

  // ResolucionCuponItemTMP
  val RESOLUCION_CUPON_ITEM_TMP = "ResolucionCuponItemTMP"
  val RCUPI_TMP_ID = "rcupiTMP_id"

  // ResolucionCuponItemBorradoTMP
  val RESOLUCION_CUPON_ITEM_BORRADO_TMP = "ResolucionCuponItemBorradoTMP"
  val RCUPIB_TMP_ID = "rcupibTMP_Id"

  // CashFlow
  val CASH_FLOW = "CashFlow"
  val CF_ID = "cf_id"
  val CF_NAME = "cf_nombre"
  val CF_FECHA = "cf_fecha"
  val CF_DESCRIP = "cf_descrip"
  val CF_FECHA_DESDE = "cf_fechadesde"
  val CF_FECHA_HASTA = "cf_fechahasta"
  val CF_FECHA_CHEQUE = "cf_fechacheque"
  val CF_FV = "cf_fv"
  val CF_RV = "cf_rv"
  val CF_PV = "cf_pv"
  val CF_FC = "cf_fc"
  val CF_RC = "cf_rc"
  val CF_OC = "cf_oc"

  // CashFlowItems
  val CASH_FLOW_ITEM = "CashFlowItem"
  val CFI_ID = "cfi_id"
  val CFI_FECHA = "cfi_fecha"
  val CFI_IMPORTE = "cfi_importe"
  val CFI_EXCLUIR = "cfi_excluir"
  val CFI_TIPO = "cfi_tipo"
  val COMP_ID = "comp_id"

  // CashFlowParams
  val CASH_FLOW_PARAM = "CashFlowParam"
  val CFP_ID = "cfp_id"

  // BancoConciliacion
  val BANCO_CONCILIACION = "BancoConciliacion"
  val BCOC_ID = "bcoc_id"
  val BCOC_NUMERO = "bcoc_numero"
  val BCOC_FECHA = "bcoc_fecha"
  val BCOC_FECHA_DESDE = "bcoc_fechaDesde"
  val BCOC_FECHA_HASTA = "bcoc_fechaHasta"
  val BCOC_SALDO_INICIAL_CONT = "bcoc_saldoInicialCont"
  val BCOC_SALDO_CONT = "bcoc_saldoCont"
  val BCOC_SALDO_INICIAL_BCO = "bcoc_saldoInicialBco"
  val BCOC_CONCILIADO_BCO = "bcoc_conciliadoBco"
  val BCOC_SALDO_BCO = "bcoc_saldoBco"
  val BCOC_SALDO_INICIAL_RECH = "bcoc_saldoInicialRech"
  val BCOC_RECHAZADO = "bcoc_rechazado"
  val BCOC_SALDO_RECH = "bcoc_saldoRech"
  val BCOC_SALDO_INICIAL_PENDIENTE = "bcoc_saldoInicialPendiente"
  val BCOC_PENDIENTE = "bcoc_pendiente"
  val BCOC_SALDO_PENDIENTE = "bcoc_saldoPendiente"
  val BCOC_FECHA_CHEQUE = "bcoc_fechacheque"
  val BCOC_VER_PENDIENTES = "bcoc_verpendientes"
  val BCOC_DESCRIP = "bcoc_descrip"

  // BancoConciliacionItem
  val BANCO_CONCILIACION_ITEM = "BancoConciliacionItem"
  val BCOCI_ID = "bcoci_id"
  val BCOCI_DEBE = "bcoci_debe"
  val BCOCI_HABER = "bcoci_haber"
  val BCOCI_FECHA = "bcoci_fecha"
  val BCOCI_ESTADO = "bcoci_estado"
  val BCOCI_DESCRIP = "bcoci_descrip"
  val BCOCI_SALDO_CONT = "bcoci_saldocont"
  val BCOCI_SALDO_BCO = "bcoci_saldobco"

  val FC_ID_RET = "fc_id_ret"
  val FV_ID_RET = "fv_id_ret"
}

object S {

  val NEW_COBRANZA = 18007
  val EDIT_COBRANZA = 18008
  val DELETE_COBRANZA = 18009
  val LIST_COBRANZA = 18010
  val DES_ANULAR_COBRANZA = 18011
  val ANULAR_COBRANZA = 18012

  val MODIFY_APLIC = 18013
  val NEW_ORDEN_PAGO = 18014
  val EDIT_ORDEN_PAGO = 18015
  val DELETE_ORDEN_PAGO = 18016
  val LIST_ORDEN_PAGO = 18017
  val DES_ANULAR_ORDEN_PAGO = 18018
  val ANULAR_ORDEN_PAGO = 18019

  val NEW_MOVIMIENTO_FONDO = 18020
  val EDIT_MOVIMIENTO_FONDO = 18021
  val DELETE_MOVIMIENTO_FONDO = 18022
  val LIST_MOVIMIENTO_FONDO = 18023
  val DES_ANULAR_MOVIMIENTO_FONDO = 18024
  val ANULAR_MOVIMIENTO_FONDO = 18025

  val NEW_DEPOSITO_BANCO = 18032
  val EDIT_DEPOSITO_BANCO = 18033
  val DELETE_DEPOSITO_BANCO = 18034
  val LIST_DEPOSITO_BANCO = 18035
  val DES_ANULAR_DEPOSITO_BANCO = 18036
  val ANULAR_DEPOSITO_BANCO = 18037

  val NEW_DEPOSITO_CUPON = 18038
  val EDIT_DEPOSITO_CUPON = 18039
  val DELETE_DEPOSITO_CUPON = 18040
  val LIST_DEPOSITO_CUPON = 18041
  val DES_ANULAR_DEPOSITO_CUPON = 18042
  val ANULAR_DEPOSITO_CUPON = 18043

  val NEW_RESOLUCION_CUPON = 18044
  val EDIT_RESOLUCION_CUPON = 18045
  val DELETE_RESOLUCION_CUPON = 18046
  val LIST_RESOLUCION_CUPON = 18047
  val DES_ANULAR_RESOLUCION_CUPON = 18048
  val ANULAR_RESOLUCION_CUPON = 18049

  val EDIT_RECHAZO_CHEQUE = 18050

  val EDIT_CONCILIACION_BCO = 18051
  val LIST_CONCILIACION_BCO = 18053
  val DELETE_CONCILIACION_BCO = 18054
  val NEW_CONCILIACION_BCO = 18055

  val EDIT_CASH_FLOW = 18052
}