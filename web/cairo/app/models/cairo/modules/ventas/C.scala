package models.cairo.modules.ventas

object C {

  // Asiento
  val AS_ID = "as_id"

  // Stock
  val ST_ID = "st_id"

  val PEDIDO_ID = "ids"
  val PEDIDO_BASE = "base"
  val PEDIDO_DATES = "dates"
  val PEDIDO_PRECIOS = "precios"
  val PEDIDO_STOCK = "stock"
  val PEDIDO_TOTALS = "totals"

  val PEDIDO_ITEM_BASE = "base"
  val PEDIDO_ITEM_TOTALS = "totals"

  val PEDIDO_ITEM_DELETED = "deletedItems"
  
  val FACTURA_ID = "ids"
  val FACTURA_BASE = "base"
  val FACTURA_DATES = "dates"
  val FACTURA_PRECIOS = "precios"
  val FACTURA_COTIZACION = "cotizacion"
  val FACTURA_STOCK = "stock"
  val FACTURA_TOTALS = "totals"

  val FACTURA_ITEM_BASE = "base"
  val FACTURA_ITEM_TOTALS = "totals"

  val FACTURA_ITEM_DELETED = "deletedItems"
  val FACTURA_PERCEPCION_DELETED = "deletedPercepciones"

  val REMITO_ID = "ids"
  val REMITO_BASE = "base"
  val REMITO_DATES = "dates"
  val REMITO_PRECIOS = "precios"
  val REMITO_COTIZACION = "cotizacion"
  val REMITO_STOCK = "stock"
  val REMITO_TOTALS = "totals"

  val REMITO_ITEM_BASE = "base"
  val REMITO_ITEM_TOTALS = "totals"

  val REMITO_ITEM_DELETED = "deletedItems"

  // RemitoVenta
  val REMITO_VENTA = "RemitoVenta"
  val RV_ID = "rv_id"
  val RV_NUMERO = "rv_numero"
  val RV_NRODOC = "rv_nrodoc"
  val RV_DESCRIP = "rv_descrip"
  val RV_FECHA = "rv_fecha"
  val RV_FECHA_ENTREGA = "rv_fechaentrega"
  val RV_NETO = "rv_neto"
  val RV_IVA_RI = "rv_ivari"
  val RV_IVA_RNI = "rv_ivarni"
  val RV_SUBTOTAL = "rv_subtotal"
  val RV_TOTAL = "rv_total"
  val RV_PENDIENTE = "rv_pendiente"
  val RV_FIRMADO = "rv_firmado"
  val RV_DESCUENTO1 = "rv_descuento1"
  val RV_DESCUENTO2 = "rv_descuento2"
  val RV_IMPORTE_DESC_1 = "rv_importedesc1"
  val RV_IMPORTE_DESC_2 = "rv_importedesc2"
  val RV_COTIZACION = "rv_cotizacion"
  val RV_RETIRO = "rv_retiro"
  val RV_GUIA = "rv_guia"
  val RV_DESTINATARIO = "rv_destinatario"
  val RV_ORDEN_COMPRA = "rv_ordencompra"

  // RemitoVentaTMP
  val REMITO_VENTA_TMP = "RemitoVentaTMP"
  val RV_TMP_ID = "rvTMP_id"

  // RemitoVentaItem
  val REMITO_VENTA_ITEM = "RemitoVentaItem"
  val RVI_ID = "rvi_id"
  val RVI_ORDEN = "rvi_orden"
  val RVI_CANTIDAD = "rvi_cantidad"
  val RVI_CANTIDAD_A_REMITIR = "rvi_cantidadaremitir"
  val RVI_PENDIENTE = "rvi_pendiente"
  val RVI_PENDIENTEFAC = "rvi_pendientefac"
  val RVI_DESCRIP = "rvi_descrip"
  val RVI_PRECIO = "rvi_precio"
  val RVI_PRECIO_USR = "rvi_precioUsr"
  val RVI_PRECIO_LISTA = "rvi_precioLista"
  val RVI_DESCUENTO = "rvi_descuento"
  val RVI_NETO = "rvi_neto"
  val RVI_IVA_RI = "rvi_ivari"
  val RVI_IVA_RNI = "rvi_ivarni"
  val RVI_IVA_RI_PORC = "rvi_ivariporc"
  val RVI_IVA_RNI_PORC = "rvi_ivarniporc"
  val RVI_IMPORTE = "rvi_importe"

  // RemitoVentaTMP
  val REMITO_VENTA_ITEM_TMP = "RemitoVentaItemTMP"
  val RVI_TMP_ID = "rviTMP_id"

  // Items Borrados de Remito de venta
  val REMITO_VENTA_ITEM_BORRADO_TMP = "RemitoVentaItemBorradoTMP"
  val RVIB_TMP_ID = "rvibTMP_id"

  // FacturaVenta
  val FACTURA_VENTA = "FacturaVenta"
  val FV_ID = "fv_id"
  val FV_NUMERO = "fv_numero"
  val FV_NRODOC = "fv_nrodoc"
  val FV_DESCRIP = "fv_descrip"
  val FV_FECHA = "fv_fecha"
  val FV_FECHA_ENTREGA = "fv_fechaentrega"
  val FV_FECHA_VTO = "fv_fechaVto"
  val FV_FECHA_IVA = "fv_fechaIva"
  val FV_NETO = "fv_neto"
  val FV_IVA_RI = "fv_ivari"
  val FV_IVA_RNI = "fv_ivarni"
  val FV_INTERNOS = "fv_internos"
  val FV_SUBTOTAL = "fv_subtotal"
  val FV_TOTAL = "fv_total"
  val FV_TOTAL_ORIGEN = "fv_totalorigen"
  val FV_PENDIENTE = "fv_pendiente"
  val FV_FIRMADO = "fv_firmado"
  val FV_DESCUENTO1 = "fv_descuento1"
  val FV_DESCUENTO2 = "fv_descuento2"
  val FV_IMPORTE_DESC_1 = "fv_importedesc1"
  val FV_IMPORTE_DESC_2 = "fv_importedesc2"
  val FV_GRABAR_ASIENTO = "fv_grabarasiento"
  val FV_COTIZACION = "fv_cotizacion"
  val FV_CAI = "fv_cai"
  val FV_TOTAL_PERCEPCIONES = "fv_totalpercepciones"
  val FV_ORDEN_COMPRA = "fv_ordencompra"
  val FV_CAE = "fv_cae"

  // FacturaVentaTMP
  val FACTURA_VENTA_TMP = "FacturaVentaTMP"
  val FV_TMP_ID = "fvTMP_id"

  // FacturaVentaItem
  val FACTURA_VENTA_ITEM = "FacturaVentaItem"
  val FVI_ID = "fvi_id"
  val FVI_ORDEN = "fvi_orden"
  val FVI_CANTIDAD = "fvi_cantidad"
  val FVI_CANTIDAD_A_REMITIR = "fvi_cantidadaremitir"
  val FVI_PENDIENTE = "fvi_pendiente"
  val FVI_DESCRIP = "fvi_descrip"
  val FVI_PRECIO = "fvi_precio"
  val FVI_PRECIO_USR = "fvi_precioUsr"
  val FVI_PRECIO_LISTA = "fvi_precioLista"
  val FVI_DESCUENTO = "fvi_descuento"
  val FVI_NETO = "fvi_neto"
  val FVI_IVA_RI = "fvi_ivari"
  val FVI_IVA_RNI = "fvi_ivarni"
  val FVI_INTERNOS = "fvi_internos"
  val FVI_IVA_RI_PORC = "fvi_ivariporc"
  val FVI_IVA_RNI_PORC = "fvi_ivarniporc"
  val FVI_INTERNOS_PORC = "fvi_internosporc"
  val FVI_IMPORTE_ORIGEN = "fvi_importeorigen"
  val FVI_IMPORTE = "fvi_importe"
  val CUE_ID_IVA_RI = "cue_id_IvaRI"
  val CUE_ID_IVA_RNI = "cue_id_IvaRNI"
  val FVI_NO_STOCK = "fvi_nostock"

  // FacturaVENTA_ITEM_TMP
  val FACTURA_VENTA_ITEM_TMP = "FacturaVentaItemTMP"
  val FVI_TMP_ID = "fviTMP_id"

  // FacturaVentaItemBarradoTMP
  val FACTURA_VENTA_ITEM_BORRADO_TMP = "FacturaVentaItemBorradoTMP"
  val FVIB_TMP_ID = "fvibTMP_id"

  // FacturaVentaPercepcion
  val FACTURA_VENTA_PERCEPCION = "FacturaVentaPercepcion"
  val FVPERC_ID = "fvperc_id"
  val FVPERC_ORDEN = "fvperc_orden"
  val FVPERC_BASE = "fvperc_base"
  val FVPERC_PORCENTAJE = "fvperc_porcentaje"
  val FVPERC_IMPORTE = "fvperc_importe"
  val FVPERC_ORIGEN = "fvperc_origen"
  val FVPERC_DESCRIP = "fvperc_descrip"

  // FacturaVentaPercepcion TMP
  val FACTURA_VENTA_PERCEPCION_TMP = "FacturaVentaPercepcionTMP"
  val FVPERC_TMP_ID = "fvpercTMP_id"

  // FacturaVentaPercepcion Borrado TMP
  val FACTURA_VENTA_PERCEPCION_BORRADO_TMP = "FacturaVentaPercepcionBorradoTMP"
  val FVPERCB_TMP_ID = "fvpercbTMP_id"

  // Provincia
  val PRO_ID_ORIGEN = "pro_id_origen"
  val PRO_ORIGEN_NAME = "ProOrigen"
  val PRO_ID_DESTINO = "pro_id_destino"
  val PRO_DESTINO_NAME = "ProDestino"

  // Pedido Remito Venta TMP
  val PEDIDO_REMITO_VENTA_TMP = "PedidoRemitoVentaTMP"
  val PV_RV_TMP_ID = "pvrvTMP_id"

  // Pedido Remito Venta
  val PEDIDO_REMITO_VENTA = "PedidoRemitoVenta"
  val PV_RV_ID = "pvrv_id"
  val PV_RV_CANTIDAD = "pvrv_cantidad"

  // Pedido Factura Venta TMP
  val PEDIDO_FACTURA_VENTA_TMP = "PedidoFacturaVentaTMP"
  val PV_FV_TMP_ID = "pvfvTMP_id"

  // Pedido Factura Venta
  val PEDIDO_FACTURA_VENTA = "PedidoFacturaVenta"
  val PV_FV_ID = "pvfv_id"
  val PV_FV_CANTIDAD = "pvfv_cantidad"

  // Remito Factura Venta TMP
  val REMITO_FACTURA_VENTA_TMP = "RemitoFacturaVentaTMP"
  val RV_FV_TMP_ID = "rvfvTMP_id"

  // Remito Factura Venta TMP
  val REMITO_DEVOLUCION_VENTA_TMP = "RemitoDevolucionVentaTMP"
  val RV_DV_TMP_ID = "rvdvTMP_id"
  val RV_DV_ID = "rvdv_id"
  val RV_DV_CANTIDAD = "rvdv_cantidad"
  val RVI_ID_DEVOLUCION = "rvi_id_devolucion"
  val RVI_ID_REMITO = "rvi_id_remito"

  // Remito Factura Venta
  val REMITO_FACTURA_VENTA = "RemitoFacturaVenta"
  val RV_FV_ID = "rvfv_id"
  val RV_FV_CANTIDAD = "rvfv_cantidad"

  // Remito Venta Item Serie
  val REMITO_VENTA_ITEM_SERIE_TMP = "RemitoVentaItemSerieTMP"
  val RVIS_TMP_ID = "rvisTMP_id"
  val RVIS_ORDEN = "rvis_orden"

  // Remito Venta Item Insumo
  val REMITO_VENTA_ITEMINSUMOTMP = "RemitoVentaItemInsumoTMP"
  val RVII_TMP_ID = "rviiTMP_id"
  val RVII_TMPCANTIDAD = "rviiTMP_cantidad"
  val RVII_TMPCANTIDAD_AUX = "rviiTMP_cantidadAux"
  val RVII_TMPTEMP = "rviiTMP_temp"

  // Factura Venta Item Serie
  val FACTURA_VENTA_ITEM_SERIE_TMP = "FacturaVentaItemSerieTMP"
  val FVIS_TMP_ID = "fvisTMP_id"
  val FVIS_ORDEN = "fvis_orden"

  // Presupuesto de Venta
  val PRESUPUESTO_VENTA_TMP = "PresupuestoVentaTMP"
  val PRV_TMP_ID = "prvtmp_id"
  val PRESUPUESTOVENTA = "presupuestoVenta"
  val PRV_ID = "prv_id"
  val PRV_NUMERO = "prv_numero"
  val PRV_NRODOC = "prv_nrodoc"
  val PRV_DESCRIP = "prv_descrip"
  val PRV_FECHA = "prv_fecha"
  val PRV_FECHAENTREGA = "prv_fechaentrega"
  val PRV_FIRMADO = "prv_firmado"
  val PRV_NETO = "prv_neto"
  val PRV_IVARI = "prv_ivari"
  val PRV_IVARNI = "prv_ivarni"
  val PRV_TOTAL = "prv_total"
  val PRV_SUB_TOTAL = "prv_subtotal"
  val PRV_DESCUENTO1 = "prv_descuento1"
  val PRV_DESCUENTO2 = "prv_descuento2"
  val PRV_IMPORTE_DESC1 = "prv_importedesc1"
  val PRV_IMPORTE_DESC2 = "prv_importedesc2"

  // PresupuestoVentaItem
  val PRESUPUESTOVENTA_ITEM_TMP = "PresupuestoVentaItemTMP"
  val PRVI_TMP_ID = "prvitmp_id"
  val PRESUPUESTOVENTAITEM = "PresupuestoVentaItem"
  val PRVI_ID = "prvi_id"
  val PRVI_ORDEN = "prvi_orden"
  val PRVI_CANTIDAD = "prvi_cantidad"
  val PRVI_CANTIDADAREMITIR = "prvi_cantidadaremitir"
  val PRVI_DESCRIP = "prvi_descrip"
  val PRVI_PRECIO = "prvi_precio"
  val PRVI_NETO = "prvi_neto"
  val PRVI_IVARI = "prvi_ivari"
  val PRVI_IVARNI = "prvi_ivarni"
  val PRVI_IVARI_PORC = "prvi_ivariporc"
  val PRVI_IVARNI_PORC = "prvi_ivarniporc"
  val PRVI_IMPORTE = "prvi_importe"
  val PRVI_PRECIO_USR = "prvi_precioUsr"
  val PRVI_PRECIO_LISTA = "prvi_precioLista"
  val PRVI_DESCUENTO = "prvi_descuento"
  val PRVI_PENDIENTE = "prvi_pendiente"
  val PRVI_PENDIENTE_PKLST = "prvi_pendientepklst"

  // Items Borrados de Presupuesto de venta
  val PRESUPUESTO_VENTA_ITEM_BORRADO_TMP = "PresupuestoVentaItemBorradoTMP"
  val PRVIB_TMP_ID = "prvibTMP_id"

  // Presupuesto Pedido Venta
  val PRESUPUESTO_PEDIDO_VENTA = "PresupuestoPedidoVenta"
  val PRV_PV_ID = "prvpv_id"
  val PRV_PV_CANTIDAD = "prvpv_cantidad"

  // Presupuesto Pedido Venta TMP
  val PRESUPUESTO_PEDIDO_VENTA_TMP = "PresupuestoPedidoVentaTMP"
  val PRV_PV_TMP_ID = "prvpvTMP_id"

  // Presupuesto Devolucion Venta TMP
  val PRESUPUESTO_DEVOLUCION_VENTA_TMP = "PresupuestoDevolucionVentaTMP"
  val PRV_DV_TMP_ID = "prvdvTMP_id"
  val PRV_DV_ID = "prvdv_id"
  val PRV_DV_CANTIDAD = "prvdv_cantidad"
  val PRVI_ID_DEVOLUCION = "prvi_id_devolucion"
  val PRVI_ID_PRESUPUESTO = "prvi_id_presupuesto"

  val PEDIDO_VENTA_TMP = "PedidoVentaTMP"
  val PV_TMP_ID = "pvtmp_id"

  val PEDIDO_VENTA = "PedidoVenta"
  val PV_ID = "pv_id"
  val PV_NUMERO = "pv_numero"
  val PV_NRODOC = "pv_nrodoc"
  val PV_DESCRIP = "pv_descrip"
  val PV_FECHA = "pv_fecha"
  val PV_FECHA_ENTREGA = "pv_fechaentrega"
  val PV_FIRMADO = "pv_firmado"
  val PV_NETO = "pv_neto"
  val PV_IVA_RI = "pv_ivari"
  val PV_IVA_RNI = "pv_ivarni"
  val PV_TOTAL = "pv_total"
  val PV_SUBTOTAL = "pv_subtotal"
  val PV_DESCUENTO1 = "pv_descuento1"
  val PV_DESCUENTO2 = "pv_descuento2"
  val PV_IMPORTE_DESC_1 = "pv_importedesc1"
  val PV_IMPORTE_DESC_2 = "pv_importedesc2"
  val PV_DESTINATARIO = "pv_destinatario"
  val PV_ORDEN_COMPRA = "pv_ordencompra"

  // Deposito
  val RAM_ID_STOCK = "ram_id_stock"
  val RAMA_STOCK = "RamaStock"

  // Items de Pedidos de Venta
  val PEDIDO_VENTA_ITEM_TMP = "PedidoVentaItemTMP"
  val PVI_TMP_ID = "pvitmp_id"

  val PEDIDO_VENTA_ITEM = "PedidoVentaItem"
  val PVI_ID = "pvi_id"
  val PVI_ORDEN = "pvi_orden"
  val PVI_CANTIDAD = "pvi_cantidad"
  val PVI_CANTIDAD_A_REMITIR = "pvi_cantidadaremitir"
  val PVI_DESCRIP = "pvi_descrip"
  val PVI_PRECIO = "pvi_precio"
  val PVI_NETO = "pvi_neto"
  val PVI_IVA_RI = "pvi_ivari"
  val PVI_IVA_RNI = "pvi_ivarni"
  val PVI_IVA_RIPORC = "pvi_ivariporc"
  val PVI_IVA_RNIPORC = "pvi_ivarniporc"
  val PVI_IMPORTE = "pvi_importe"
  val PVI_PRECIO_USR = "pvi_precioUsr"
  val PVI_PRECIO_LISTA = "pvi_precioLista"
  val PVI_DESCUENTO = "pvi_descuento"
  val PVI_PENDIENTE = "pvi_pendiente"
  val PVI_PENDIENTE_PKLST = "pvi_pendientepklst"
  val PVI_PENDIENTE_PRV = "pvi_pendienteprv"

  // Items Borrados de pedidos de venta
  val PEDIDO_VENTA_ITEM_BORRADO_TMP = "PedidoVentaItemBorradoTMP"
  val PVIB_TMP_ID = "pvibTMP_id"
  
}

object S {

  val NEW_PEDIDO_VENTA = 3000
  val EDIT_PEDIDO_VENTA = 3001
  val DELETE_PEDIDO_VENTA = 3002
  val LIST_PEDIDO_VENTA = 3003
  val DES_ANULAR_PEDIDO_VENTA = 3004
  val ANULAR_PEDIDO_VENTA = 3005
  val EDIT_PRICE_PED_VENTA = 3006
  
  val NEW_FACTURA_VENTA = 16002
  val EDIT_FACTURA_VENTA = 16003
  val DELETE_FACTURA_VENTA = 16004
  val LIST_FACTURA_VENTA = 16005
  val DES_ANULAR_FACTURA_VENTA = 16010
  val ANULAR_FACTURA_VENTA = 16011

  val NEW_REMITO_VENTA = 16006
  val EDIT_REMITO_VENTA = 16007
  val DELETE_REMITO_VENTA = 16008
  val LIST_REMITO_VENTA = 16009
  val DES_ANULAR_REMITO_VENTA = 16012
  val ANULAR_REMITO_VENTA = 16013

  val MODIFY_APLIC_VENTA = 16014

  val EDIT_PRICE_REM = 16015
  val EDIT_PRICE_FAC = 16016
  val EDIT_PRICE_PRESU = 16023

  val NEW_PRESUPUESTO_VENTA = 16017
  val EDIT_PRESUPUESTO_VENTA = 16018
  val DELETE_PRESUPUESTO_VENTA = 16019
  val LIST_PRESUPUESTO_VENTA = 16020
  val DES_ANULAR_PRESUPUESTO_VENTA = 16021
  val ANULAR_PRESUPUESTO_VENTA = 16022

  val COBRANZA_CONTADO = 16024

  val NEW_HOJA_RUTA = 16025
  val EDIT_HOJA_RUTA = 16026
  val DELETE_HOJA_RUTA = 16027
  val LIST_HOJA_RUTA = 16028

  val NEW_CAJA = 16029
  val EDIT_CAJA = 16030
  val DELETE_CAJA = 16031
  val LIST_CAJA = 16032

  val ABRIR_CAJA = 16034
  val ACEPTAR_CIERRE = 16033

  val NEW_PICKING_LIST = 16035
  val EDIT_PICKING_LIST = 16036
  val DELETE_PICKING_LIST = 16037
  val LIST_PICKING_LIST = 16038

  val MODIFICAR_ARTICULO = 16039
  val COBRANZAS_CAJERO = 16040

}