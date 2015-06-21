package models.cairo.modules.compras

object C {

  // RemitoCompra
  val REMITO_COMPRA = "RemitoCompra"
  val RC_ID = "rc_id"
  val RC_NUMERO = "rc_numero"
  val RC_NRODOC = "rc_nrodoc"
  val RC_DESCRIP = "rc_descrip"
  val RC_FECHA = "rc_fecha"
  val RC_FECHA_ENTREGA = "rc_fechaentrega"
  val RC_NETO = "rc_neto"
  val RC_IVA_RI = "rc_ivari"
  val RC_IVA_RNI = "rc_ivarni"
  val RC_TOTAL = "rc_total"
  val RC_SUBTOTAL = "rc_subtotal"
  val RC_PENDIENTE = "rc_pendiente"
  val RC_DESCUENTO1 = "rc_descuento1"
  val RC_DESCUENTO2 = "rc_descuento2"
  val RC_IMPORTE_DESC_1 = "rc_importedesc1"
  val RC_IMPORTE_DESC_2 = "rc_importedesc2"
  val RC_FIRMADO = "rc_firmado"
  val RC_COTIZACION = "rc_cotizacion"

  // RemitoCompraTMP
  val REMITO_COMPRA_TMP = "RemitoCompraTMP"
  val RC_TMP_ID = "rcTMP_id"

  // RemitoCompraItem
  val REMITO_COMPRA_ITEM = "RemitoCompraItem"
  val RCI_ID = "rci_id"
  val RCI_ORDEN = "rci_orden"
  val RCI_CANTIDAD = "rci_cantidad"
  val RCI_CANTIDAD_A_REMITIR = "rci_cantidadaremitir"
  val RCI_PENDIENTE = "rci_pendiente"
  val RCI_PENDIENTEFAC = "rci_pendientefac"
  val RCI_DESCRIP = "rci_descrip"
  val RCI_PRECIO = "rci_precio"
  val RCI_PRECIO_USR = "rci_precioUsr"
  val RCI_PRECIO_LISTA = "rci_precioLista"
  val RCI_DESCUENTO = "rci_descuento"
  val RCI_NETO = "rci_neto"
  val RCI_IVA_RI = "rci_ivari"
  val RCI_IVA_RNI = "rci_ivarni"
  val RCI_IVA_RIPORC = "rci_ivariporc"
  val RCI_IVA_RNIPORC = "rci_ivarniporc"
  val RCI_IMPORTE = "rci_importe"

  // RemitoCompraItemTMP
  val REMITO_COMPRA_ITEM_TMP = "RemitoCompraItemTMP"
  val RCI_TMP_ID = "rciTMP_id"

  // RemitoCompraItemBorradoTMP
  val REMITO_COMPRA_ITEM_BORRADO_TMP = "RemitoCompraItemBorradoTMP"
  val RCIB_TMP_ID = "rcibTMP_id"

  // Remito Compra Item Serie
  val REMITO_COMPRA_ITEM_SERIE_TMP = "RemitoCompraItemSerieTMP"
  val RCIS_TMP_ID = "rcisTMP_id"
  val RCIS_ORDEN = "rcis_orden"

  // Remito Compra Item Serie
  val REMITO_COMPRA_ITEM_SERIE_B_TMP = "RemitoCompraItemSerieBTMP"
  val RCISB_TMP_ID = "rcisbTMP_id"

  // Factura Compra Item Serie
  val FACTURA_COMPRA_ITEM_SERIE_TMP = "FacturaCompraItemSerieTMP"
  val FCIS_TMP_ID = "fcisTMP_id"
  val FCIS_ORDEN = "fcis_orden"

  // Factura Compra Item Serie
  val FACTURA_COMPRA_ITEM_SERIE_B_TMP = "FacturaCompraItemSerieBTMP"
  val FCISB_TMP_ID = "fcisbTMP_id"


  // PedidoCompra
  val PEDIDOCOMPRA = "PedidoCompra"
  val PC_ID = "pc_id"
  val PC_NUMERO = "pc_numero"
  val PC_NRODOC = "pc_nrodoc"
  val PC_DESCRIP = "pc_descrip"
  val PC_FECHA = "pc_fecha"
  val PC_FECHA_ENTREGA = "pc_fechaentrega"
  val PC_NETO = "pc_neto"
  val PC_IVA_RI = "pc_ivari"
  val PC_IVA_RNI = "pc_ivarni"
  val PC_TOTAL = "pc_total"
  val PC_SUBTOTAL = "pc_subtotal"
  val PC_PENDIENTE = "pc_pendiente"
  val PC_FIRMADO = "pc_firmado"

  // PedidoCompraTMP
  val PEDIDOCOMPRATMP = "PedidoCompraTMP"
  val PC_TMP_ID = "pcTMP_id"

  // PedidoCompraItem
  val PEDIDOCOMPRAITEM = "PedidoCompraItem"
  val PCI_ID = "pci_id"
  val PCI_ORDEN = "pci_orden"
  val PCI_CANTIDAD = "pci_cantidad"
  val PCI_CANTIDAD_A_REMITIR = "pci_cantidadaremitir"
  val PCI_DESCRIP = "pci_descrip"
  val PCI_PRECIO = "pci_precio"
  val PCI_PRECIO_USR = "pci_precioUsr"
  val PCI_PRECIO_LISTA = "pci_precioLista"
  val PCI_NETO = "pci_neto"
  val PCI_IVA_RI = "pci_ivari"
  val PCI_IVA_RNI = "pci_ivarni"
  val PCI_IMPORTE = "pci_importe"
  val PCI_IVA_RI_PORC = "pci_ivariporc"
  val PCI_IVA_RNI_PORC = "pci_ivarniporc"
  val PCI_PENDIENTE = "pci_pendiente"

  // PedidoCompraItemTMP
  val PEDIDOCOMPRAITEM_TMP = "PedidoCompraItemTMP"
  val PCI_TMP_ID = "pciTMP_id"

  // PedidoCompraItemBorradoTMP
  val PEDIDOCOMPRAITEM_BORRADO_TMP = "PedidoCompraItemBorradoTMP"
  val PCIB_TMP_ID = "pcibTMP_id"

  // Pedido Devolucion Compra TMP
  val PEDIDODEVOLUCIONCOMPRATMP = "PedidoDevolucionCompraTMP"
  val PC_DC_TMP_ID = "pcdcTMP_id"
  val PC_DC_ID = "pcdc_id"
  val PC_DC_CANTIDAD = "pcdc_cantidad"
  val PCI_ID_DEVOLUCION = "pci_id_devolucion"
  val PCI_ID_PEDIDO = "pci_id_pedido"

  val FACTURA_ID = "ids"
  val FACTURA_BASE = "base"
  val FACTURA_DATES = "dates"
  val FACTURA_PRECIOS = "precios"
  val FACTURA_COTIZACION = "cotizacion"
  val FACTURA_STOCK = "stock"
  val FACTURA_TOTALS = "totals"

  val FACTURA_ITEM_BASE = "base"
  val FACTURA_ITEM_TOTALS = "totals"
  val FACTURA_ITEM_SERIE_DELETED = "deletedList"

  val FACTURA_ITEM_DELETED = "deletedItems"
  val FACTURA_OTRO_DELETED = "deletedOtros"
  val FACTURA_LEGAJO_DELETED = "deletedLegajos"
  val FACTURA_PERCEPCION_DELETED = "deletedPercepciones"

  // FacturaCompra
  val FACTURA_COMPRA = "FacturaCompra"
  val FC_ID = "fc_id"
  val FC_NUMERO = "fc_numero"
  val FC_NRODOC = "fc_nrodoc"
  val FC_DESCRIP = "fc_descrip"
  val FC_FECHA = "fc_fecha"
  val FC_FECHA_ENTREGA = "fc_fechaentrega"
  val FC_FECHA_VTO = "fc_fechavto"
  val FC_FECHA_IVA = "fc_fechaIva"
  val FC_NETO = "fc_neto"
  val FC_IVA_RI = "fc_ivari"
  val FC_IVA_RNI = "fc_ivarni"
  val FC_INTERNOS = "fc_internos"
  val FC_SUBTOTAL = "fc_subtotal"
  val FC_TOTAL = "fc_total"
  val FC_TOTAL_ORIGEN = "fc_totalorigen"
  val FC_PENDIENTE = "fc_pendiente"
  val FC_FIRMADO = "fc_firmado"
  val FC_DESCUENTO1 = "fc_descuento1"
  val FC_DESCUENTO2 = "fc_descuento2"
  val FC_IMPORTE_DESC_1 = "fc_importedesc1"
  val FC_IMPORTE_DESC_2 = "fc_importedesc2"
  val FC_GRABAR_ASIENTO = "fc_grabarasiento"
  val FC_COTIZACION = "fc_cotizacion"
  val FC_CAI = "fc_cai"
  val FC_TOTAL_OTROS = "fc_totalotros"
  val FC_TOTAL_PERCEPCIONES = "fc_totalpercepciones"
  val FC_TIPO_COMPROBANTE = "fc_tipocomprobante"
  val FC_COTIZACION_PROV = "fc_cotizacionprov"

  // FacturaCompraTMP
  val FACTURA_COMPRA_TMP = "FacturaCompraTMP"
  val FC_TMP_ID = "fcTMP_id"

  // FacturaCompraItem
  val FACTURA_COMPRA_ITEM = "FacturaCompraItem"
  val FCI_ID = "fci_id"
  val FCI_ORDEN = "fci_orden"
  val FCI_CANTIDAD = "fci_cantidad"
  val FCI_CANTIDAD_A_REMITIR = "fci_cantidadaremitir"
  val FCI_PENDIENTE = "fci_pendiente"
  val FCI_DESCRIP = "fci_descrip"
  val FCI_PRECIO = "fci_precio"
  val FCI_PRECIO_USR = "fci_precioUsr"
  val FCI_PRECIO_LISTA = "fci_precioLista"
  val FCI_DESCUENTO = "fci_descuento"
  val FCI_NETO = "fci_neto"
  val FCI_IVA_RI = "fci_ivari"
  val FCI_IVA_RNI = "fci_ivarni"
  val FCI_IVA_RIPORC = "fci_ivariporc"
  val FCI_IVA_RNIPORC = "fci_ivarniporc"

  val FCI_INTERNOS_PORC = "fci_internosporc"
  val FCI_INTERNOS = "fci_internos"

  val FCI_IMPORTE_ORIGEN = "fci_importeorigen"
  val FCI_IMPORTE = "fci_importe"
  val CUE_ID_IVA_RI = "cue_id_IvaRI"
  val CUE_ID_IVA_RNI = "cue_id_IvaRNI"

  // FacturaCompraItemTMP
  val FACTURA_COMPRA_ITEM_TMP = "FacturaCompraItemTMP"
  val FCI_TMP_ID = "fciTMP_id"

  // FacturaCompraOtroTMP
  val FACTURA_COMPRA_OTRO_TMP = "FacturaCompraOtroTMP"
  val FCOT_TMP_ID = "fcotTMP_id"

  // FacturaCompraOtro
  val FACTURA_COMPRA_OTRO = "FacturaCompraOtro"
  val FCOT_ID = "fcot_id"
  val FCOT_ORDEN = "fcot_orden"
  val FCOT_DEBE = "fcot_debe"
  val FCOT_HABER = "fcot_haber"
  val FCOT_DESCRIP = "fcot_descrip"
  val FCOT_ORIGEN = "fcot_origen"

  // FacturaCompraOtroBorradoTMP
  val FACTURA_COMPRA_OTRO_BORRADO_TMP = "FacturaCompraOtroBorradoTMP"
  val FCOTB_TMP_ID = "fcotbTMP_id"

  // FacturaCompraItemBarradoTMP
  val FACTURA_COMPRA_ITEMBORRADO_TMP = "FacturaCompraItemBorradoTMP"
  val FCIB_TMP_ID = "fcibTMP_id"

  // Provincia
  val PRO_ID_ORIGEN = "pro_id_origen"
  val PRO_ORIGEN_NAME = "ProOrigen"
  val PRO_ID_DESTINO = "pro_id_destino"
  val PRO_DESTINO_NAME = "ProDestino"

  // Iva
  val BIVA_RI = "bIvaRi"
  val BIVA_RNI = "bIvaRni"

  // FacturaCompraPercepcion
  val FACTURA_COMPRA_PERCEPCION = "FacturaCompraPercepcion"
  val FCPERC_ID = "fcperc_id"
  val FCPERC_ORDEN = "fcperc_orden"
  val FCPERC_BASE = "fcperc_base"
  val FCPERC_PORCENTAJE = "fcperc_porcentaje"
  val FCPERC_IMPORTE = "fcperc_importe"
  val FCPERC_ORIGEN = "fcperc_origen"
  val FCPERC_DESCRIP = "fcperc_descrip"

  // FacturaCompraLegajo
  val FACTURA_COMPRA_LEGAJO = "FacturaCompraLegajo"
  val FCLGJ_ID = "fclgj_id"
  val FCLGJ_ORDEN = "fclgj_orden"
  val FCLGJ_IMPORTE = "fclgj_importe"
  val FCLGJ_IMPORTE_ORIGEN = "fclgj_importeorigen"
  val FCLGJ_DESCRIP = "fclgj_descrip"

  // FacturaCompraPercepcion TMP
  val FACTURA_COMPRA_PERCEPCION_TMP = "FacturaCompraPercepcionTMP"
  val FCPERC_TMP_ID = "fcpercTMP_id"

  // FacturaCompraLegajoTMP
  val FACTURA_COMPRA_LEGAJO_TMP = "FacturaCompraLegajoTMP"
  val FCLGJ_TMP_ID = "fclgjTMP_id"

  // FacturaCompraPercepcion Borrado TMP
  val FACTURA_COMPRA_PERCEPCION_BORRADO_TMP = "FacturaCompraPercepcionBorradoTMP"
  val FC_PERCB_TMP_ID = "fcpercbTMP_id"

  // FacturaCompraPercepcion Borrado TMP
  val FACTURA_COMPRA_LEGAJO_BORRADO_TMP = "FacturaCompraLegajoBorradoTMP"
  val FC_LGJB_TMP_ID = "fclgjbTMP_id"

  // Stock
  val DEPL_ID_ORIGEN = "depl_id_origen"
  val DEPL_ID_DESTINO = "depl_id_destino"
  val DEPL_ID = "depl_id"
  val DEPL_NAME = "depl_nombre"

  // StockLote
  val STOCK_LOTE = "StockLote"
  val STL_ID = "stl_id"
  val STL_CODE = "stl_codigo"

  // Remito Factura Compra TMP
  val REMITO_FACTURA_COMPRA_TMP = "RemitoFacturaCompraTMP"
  val RC_FC_TMP_ID = "rcfcTMP_id"

  // Remito Factura Compra
  val REMITO_FACTURA_COMPRA = "RemitoFacturaCompra"
  val RC_FC_ID = "rcfc_id"
  val RC_FC_CANTIDAD = "rcfc_cantidad"

  // Remito Factura Compra TMP
  val REMITO_DEVOLUCION_COMPRA_TMP = "RemitoDevolucionCompraTMP"
  val RC_DC_TMP_ID = "rcdcTMP_id"
  val RC_DC_ID = "rcdc_id"
  val RC_DC_CANTIDAD = "rcdc_cantidad"
  val RCI_ID_DEVOLUCION = "rci_id_devolucion"
  val RCI_ID_REMITO = "rci_id_remito"

  // OrdenCompra
  val ORDEN_COMPRA = "OrdenCompra"
  val OC_ID = "oc_id"
  val OC_NUMERO = "oc_numero"
  val OC_NRODOC = "oc_nrodoc"
  val OC_DESCRIP = "oc_descrip"
  val OC_FECHA = "oc_fecha"
  val OC_FECHA_ENTREGA = "oc_fechaentrega"
  val OC_NETO = "oc_neto"
  val OC_IVA_RI = "oc_ivari"
  val OC_IVA_RNI = "oc_ivarni"
  val OC_TOTAL = "oc_total"
  val OC_SUBTOTAL = "oc_subtotal"
  val OC_PENDIENTE = "oc_pendiente"
  val OC_DESCUENTO1 = "oc_descuento1"
  val OC_DESCUENTO2 = "oc_descuento2"
  val OC_IMPORTE_DESC_1 = "oc_importedesc1"
  val OC_IMPORTE_DESC_2 = "oc_importedesc2"
  val OC_FIRMADO = "oc_firmado"
  val OC_ORDEN_COMPRA = "oc_ordencompra"
  val OC_PRESUPUESTO = "oc_presupuesto"
  val OC_MAQUINA = "oc_maquina"
  val OC_MAQUINANRO = "oc_maquinanro"
  val OC_MAQUINAMODELO = "oc_maquinamodelo"
  val OC_FLETEAEREO = "oc_fleteaereo"
  val OC_FLETEMARITIMO = "oc_fletemaritimo"
  val OC_FLETECORREO = "oc_fletecorreo"
  val OC_FLETECAMION = "oc_fletecamion"
  val OC_FLETEOTROS = "oc_fleteotros"

  // OrdenCompraTMP
  val ORDEN_COMPRA_TMP = "OrdenCompraTMP"
  val OC_TMP_ID = "ocTMP_id"

  // OrdenCompraItem
  val ORDEN_COMPRA_ITEM = "OrdenCompraItem"
  val OCI_ID = "oci_id"
  val OCI_ORDEN = "oci_orden"
  val OCI_CANTIDAD = "oci_cantidad"
  val OCI_CANTIDAD_A_REMITIR = "oci_cantidadaremitir"
  val OCI_DESCRIP = "oci_descrip"
  val OCI_PRECIO = "oci_precio"
  val OCI_PRECIO_USR = "oci_precioUsr"
  val OCI_PRECIO_LISTA = "oci_precioLista"
  val OCI_DESCUENTO = "oci_descuento"
  val OCI_NETO = "oci_neto"
  val OCI_IVA_RI = "oci_ivari"
  val OCI_IVA_RNI = "oci_ivarni"
  val OCI_IMPORTE = "oci_importe"
  val OCI_IVA_RI_PORC = "oci_ivariporc"
  val OCI_IVA_RNI_PORC = "oci_ivarniporc"
  val OCI_PENDIENTE = "oci_pendiente"
  val OCI_PENDIENTE_FAC = "oci_pendientefac"

  // OrdenCompraItemTMP
  val ORDEN_COMPRA_ITEM_TMP = "OrdenCompraItemTMP"
  val OCI_TMP_ID = "ociTMP_id"

  // OrdenCompraItemBorradoTMP
  val ORDEN_COMPRA_ITEM_BORRADO_TMP = "OrdenCompraItemBorradoTMP"
  val OCIB_TMP_ID = "ocibTMP_id"

  // Orden Factura Compra TMP
  val ORDENFACTURA_COMPRA_TMP = "OrdenFacturaCompraTMP"
  val OC_FC_TMP_ID = "ocfcTMP_id"

  // Orden Factura Compra
  val ORDENFACTURA_COMPRA = "OrdenFacturaCompra"
  val OC_FC_ID = "ocfc_id"
  val OC_FC_CANTIDAD = "ocfc_cantidad"

  // Devolucion Orden Compra TMP
  val ORDENDEVOLUCIONCOMPRATMP = "OrdenDevolucionCompraTMP"
  val OC_DC_TMP_ID = "ocdcTMP_id"
  val OC_DC_ID = "ocdc_id"
  val OC_DC_CANTIDAD = "ocdc_cantidad"
  val OCI_ID_DEVOLUCION = "oci_id_devolucion"
  val OCI_ID_ORDEN = "oci_id_Orden"

  // Orden Remito Compra
  val ORDENREMITO_COMPRA = "OrdenRemitoCompra"
  val OC_RC_ID = "ocrc_id"
  val OC_RC_CANTIDAD = "ocrc_cantidad"

  // Orden Remito Compra TMP
  val ORDENREMITO_COMPRA_TMP = "OrdenRemitoCompraTMP"
  val OC_RC_TMP_ID = "ocrcTMP_id"

  // Cotizacion
  val COTIZACIONCOMPRA = "CotizacionCompra"
  val COT_ID = "cot_id"
  val COT_NUMERO = "cot_numero"
  val COT_NRODOC = "cot_nrodoc"
  val COT_DESCRIP = "cot_descrip"
  val COT_FECHA = "cot_fecha"
  val COT_FECHA_ENTREGA = "cot_fechaentrega"
  val COT_NETO = "cot_neto"
  val COT_IVA_RI = "cot_ivari"
  val COT_IVA_RNI = "cot_ivarni"
  val COT_SUBTOTAL = "cot_subtotal"
  val COT_TOTAL = "cot_total"
  val COT_PENDIENTE = "cot_pendiente"
  val COT_FIRMADO = "cot_firmado"

  // Cotizacion Item
  val COTIZACIONCOMPRAITEM = "CotizacionCompraItem"
  val COTI_ID = "coti_id"
  val COTI_ORDEN = "coti_orden"
  val COTI_CANTIDAD = "coti_cantidad"
  val COTI_PENDIENTE = "coti_pendiente"
  val COTI_DESCRIP = "coti_descrip"
  val COTI_PRECIO = "coti_precio"
  val COTI_PRECIO_USR = "coti_precioUsr"
  val COTI_PRECIO_LISTA = "coti_precioLista"
  val COTI_DESCUENTO = "coti_descuento"
  val COTI_NETO = "coti_neto"
  val COTI_IVA_RI = "coti_ivari"
  val COTI_IVA_RNI = "coti_ivarni"
  val COTI_IVA_RIPORC = "coti_ivariporc"
  val COTI_IVA_RNIPORC = "coti_ivarniporc"
  val COTI_IMPORTE = "coti_importe"

  // Presupuesto Compra
  val PRESUPUESTOCOMPRA = "PresupuestoCompra"
  val PRC_ID = "prc_id"
  val PRC_NUMERO = "prc_numero"
  val PRC_NRODOC = "prc_nrodoc"
  val PRC_DESCRIP = "prc_descrip"
  val PRC_FECHA = "prc_fecha"
  val PRC_FECHA_ENTREGA = "prc_fechaentrega"
  val PRC_NETO = "prc_neto"
  val PRC_IVA_RI = "prc_ivari"
  val PRC_IVA_RNI = "prc_ivarni"
  val PRC_SUBTOTAL = "prc_subtotal"
  val PRC_TOTAL = "prc_total"
  val PRC_PENDIENTE = "prc_pendiente"
  val PRC_FIRMADO = "prc_firmado"
  val PRC_DESCUENTO1 = "prc_descuento1"
  val PRC_DESCUENTO2 = "prc_descuento2"
  val PRC_IMPORTE_DESC_1 = "prc_importedesc1"
  val PRC_IMPORTE_DESC_2 = "prc_importedesc2"

  // Presupuesto Compra Item
  val PRESUPUESTOCOMPRAITEM = "PresupuestoCompraItem"
  val PRCI_ID = "prci_id"
  val PRCI_ORDEN = "prci_orden"
  val PRCI_CANTIDAD = "prci_cantidad"
  val PRCI_CANTIDAD_A_REMITIR = "prci_cantidadaremitir"
  val PRCI_PENDIENTE = "prci_pendiente"
  val PRCI_PENDIENTEPKLST = "prci_pendientepklst"
  val PRCI_DESCRIP = "prci_descrip"
  val PRCI_PRECIO = "prci_precio"
  val PRCI_PRECIO_USR = "prci_preciousr"
  val PRCI_PRECIO_LISTA = "prci_preciolista"
  val PRCI_DESCUENTO = "prci_descuento"
  val PRCI_NETO = "prci_neto"
  val PRCI_IVA_RI = "prci_ivari"
  val PRCI_IVA_RNI = "prci_ivarni"
  val PRCI_IVA_RIPORC = "prci_ivariporc"
  val PRCI_IVA_RNIPORC = "prci_ivarniporc"
  val PRCI_IMPORTE = "prci_importe"

  // Pedido Orden de Compra
  val PEDIDOORDEN_COMPRA = "PedidoOrdenCompra"
  val PC_OC_ID = "pcoc_id"
  val PC_OC_CANTIDAD = "pcoc_cantidad"

  // Pedido Orden de Compra TMP
  val PEDIDOORDEN_COMPRA_TMP = "PedidoOrdenCompraTMP"
  val PC_OC_TMP_ID = "pcocTMP_id"

  // Pedido Cotizacion Compra
  val PEDIDOCOTIZACIONCOMPRA = "PedidoCotizacionCompra"
  val PCCOT_ID = "pccot_id"
  val PCCOT_CANTIDAD = "pccot_cantidad"

  // Pedido Cotizacion Compra TMP
  val PEDIDOCOTIZACIONCOMPRATMP = "PedidoCotizacionCompraTMP"
  val PCCOT_TMP_ID = "pccotTMP_id"

  // Asiento
  val AS_ID = "as_id"

  // Stock
  val ST_ID = "st_id"

  // Despacho Importacion Calculo
  val DESPACHOIMPCALCULO = "DespachoImpCalculo"
  val DIC_ID = "dic_id"
  val DIC_NUMERO = "dic_numero"
  val DIC_FECHA = "dic_fecha"
  val DIC_TIPO = "dic_tipo"
  val DIC_TITULO = "dic_titulo"
  val DIC_DESCRIP = "dic_descrip"
  val DIC_VIA = "dic_via"
  val DIC_VIAEMPRESA = "dic_viaempresa"
  val DIC_FACTURA = "dic_factura"
  val DIC_CAMBIO1 = "dic_cambio1"
  val DIC_CAMBIO2 = "dic_cambio2"
  val DIC_PASE = "dic_pase"
  val DIC_TOTALGTOS = "dic_totalgtos"
  val DIC_PORCFOB = "dic_porcfob"
  val DIC_VAR = "dic_var"
  val DIC_PORCFOBFINAL = "dic_porcfobfinal"
  val DIC_TOTAL = "dic_total"
  val DIC_TOTALORIGEN = "dic_totalorigen"

  val MON_ID1 = "mon_id1"
  val MON_ID2 = "mon_id2"

  // Despacho Importacion Calculo Item
  val DESPACHOIMPCALCULOITEM = "DespachoImpCalculoItem"
  val DICI_ID = "dici_id"
  val DICI_CODE = "dici_codigo"
  val DICI_VALOR = "dici_valor"
  val DICI_IMPORTE = "dici_importe"
  val DICI_PORC = "dici_porc"
  val DICI_DESCRIP = "dici_descrip"

  // Despacho Importacion Calculo Posicion Arancelaria
  val DESPACHOIMPPOSICIONARANCEL = "DespachoImpCalculoPosicionArancel"
  val DICP_ID = "dicp_id"
  val DICP_DERECHOS = "dicp_derechos"
  val DICP_ESTADISTICAS = "dicp_estadisticas"
  val DICP_IVA = "dicp_iva"
  val DICP_IVA3431 = "dicp_iva3431"
  val DICP_GANANCIAS = "dicp_ganancias"
  val DICP_IGB = "dicp_igb"
  val DICP_GASTOENVIO = "dicp_gastoenvio"

}

object S {
  val NEW_FACTURA_COMPRA = 17002
  val EDIT_FACTURA_COMPRA = 17003
  val DELETE_FACTURA_COMPRA = 17004
  val LIST_FACTURA_COMPRA = 17005
  val DES_ANULAR_FACTURA_COMPRA = 17010
  val ANULAR_FACTURA_COMPRA = 17011
  val NEW_REMITO_COMPRA = 17006
  val EDIT_REMITO_COMPRA = 17007
  val DELETE_REMITO_COMPRA = 17008
  val LIST_REMITO_COMPRA = 17009
  val DES_ANULAR_REMITO_COMPRA = 17012
  val ANULAR_REMITO_COMPRA = 17013
  val NEW_PEDIDO_COMPRA = 17014
  val EDIT_PEDIDO_COMPRA = 17015
  val DELETE_PEDIDO_COMPRA = 17016
  val LIST_PEDIDO_COMPRA = 17017
  val DES_ANULAR_PEDIDO_COMPRA = 17018
  val ANULAR_PEDIDO_COMPRA = 17019
  val MODIFY_APLIC_COMPRA = 17020
  val NEW_ORDEN_COMPRA = 17021
  val EDIT_ORDEN_COMPRA = 17022
  val DELETE_ORDEN_COMPRA = 17023
  val LIST_ORDEN_COMPRA = 17024
  val DES_ANULAR_ORDEN_COMPRA = 17025
  val ANULAR_ORDEN_COMPRA = 17026
  val NEW_COTIZACION = 17027
  val EDIT_COTIZACION = 17028
  val DELETE_COTIZACION = 17029
  val LIST_COTIZACION = 17030
  val DES_ANULAR_COTIZACION = 17031
  val ANULAR_COTIZACION = 17032
  val NEW_PRESUPUESTO_COMPRA = 17033
  val EDIT_PRESUPUESTO_COMPRA = 17034
  val DELETE_PRESUPUESTO_COMPRA = 17035
  val LIST_PRESUPUESTO_COMPRA = 17036
  val DES_ANULAR_PRESUPUESTO_COMPRA = 17037
  val ANULAR_PRESUPUESTO_COMPRA = 17038
  val EDIT_PRICE_PED = 17041
  val EDIT_PRICE_ORD = 17042
  val EDIT_PRICE_REM = 17039
  val EDIT_PRICE_FAC = 17040
  val NEW_DESP_IMPO_CALC = 17043
  val EDIT_DESP_IMPO_CALC = 17044
  val DELETE_DESP_IMPO_CALC = 17045
  val LIST_DESP_IMPO_CALC = 17046
}