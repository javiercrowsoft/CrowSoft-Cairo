(function() {
  "use strict";

  Cairo.Compras = {

    Constants: {

      PROVEEDOR_DATA_ADD: "ProveedorDataAdd",

      // RemitoCompra
      REMITO_COMPRA: "RemitoCompra",
      RC_ID: "rc_id",
      RC_NUMERO: "rc_numero",
      RC_NRODOC: "rc_nrodoc",
      RC_DESCRIP: "rc_descrip",
      RC_FECHA: "rc_fecha",
      RC_FECHA_ENTREGA: "rc_fechaentrega",
      RC_NETO: "rc_neto",
      RC_IVA_RI: "rc_ivari",
      RC_IVA_RNI: "rc_ivarni",
      RC_TOTAL: "rc_total",
      RC_SUBTOTAL: "rc_subtotal",
      RC_PENDIENTE: "rc_pendiente",
      RC_DESCUENTO1: "rc_descuento1",
      RC_DESCUENTO2: "rc_descuento2",
      RC_IMPORTE_DESC_1: "rc_importedesc1",
      RC_IMPORTE_DESC_2: "rc_importedesc2",
      RC_FIRMADO: "rc_firmado",
      RC_COTIZACION: "rc_cotizacion",

      // RemitoCompraTMP
      REMITO_COMPRA_TMP: "RemitoCompraTMP",
      RC_TMP_ID: "rcTMP_id",

      // RemitoCompraItem
      REMITO_COMPRA_ITEM: "RemitoCompraItem",
      RCI_ID: "rci_id",
      RCI_ORDEN: "rci_orden",
      RCI_CANTIDAD: "rci_cantidad",
      RCI_CANTIDAD_A_REMITIR: "rci_cantidadaremitir",
      RCI_PENDIENTE: "rci_pendiente",
      RCI_PENDIENTEFAC: "rci_pendientefac",
      RCI_DESCRIP: "rci_descrip",
      RCI_PRECIO: "rci_precio",
      RCI_PRECIO_USR: "rci_preciousr",
      RCI_PRECIO_LISTA: "rci_preciolista",
      RCI_DESCUENTO: "rci_descuento",
      RCI_NETO: "rci_neto",
      RCI_IVA_RI: "rci_ivari",
      RCI_IVA_RNI: "rci_ivarni",
      RCI_IVA_RIPORC: "rci_ivariporc",
      RCI_IVA_RNIPORC: "rci_ivarniporc",
      RCI_IMPORTE: "rci_importe",

      // RemitoCompraItemTMP
      REMITO_COMPRA_ITEM_TMP: "RemitoCompraItemTMP",
      RCI_TMP_ID: "rciTMP_id",

      // RemitoCompraItemBorradoTMP
      REMITO_COMPRA_ITEM_BORRADO_TMP: "RemitoCompraItemBorradoTMP",
      RCIB_TMP_ID: "rcibTMP_id",

      // Remito Compra Item Serie
      REMITO_COMPRA_ITEM_SERIE_TMP: "RemitoCompraItemSerieTMP",
      RCIS_TMP_ID: "rcisTMP_id",
      RCIS_ORDEN: "rcis_orden",

      // Remito Compra Item Serie
      REMITO_COMPRA_ITEM_SERIE_B_TMP: "RemitoCompraItemSerieBTMP",
      RCISB_TMP_ID: "rcisbTMP_id",

      // Factura Compra Item Serie
      FACTURA_COMPRA_ITEM_SERIE_TMP: "FacturaCompraItemSerieTMP",
      FCIS_TMP_ID: "fcisTMP_id",
      FCIS_ORDEN: "fcis_orden",

      // Factura Compra Item Serie
      FACTURA_COMPRA_ITEM_SERIE_B_TMP: "FacturaCompraItemSerieBTMP",
      FCISB_TMP_ID: "fcisbTMP_id",


      // PedidoCompra
      PEDIDOCOMPRA: "PedidoCompra",
      PC_ID: "pc_id",
      PC_NUMERO: "pc_numero",
      PC_NRODOC: "pc_nrodoc",
      PC_DESCRIP: "pc_descrip",
      PC_FECHA: "pc_fecha",
      PC_FECHA_ENTREGA: "pc_fechaentrega",
      PC_NETO: "pc_neto",
      PC_IVA_RI: "pc_ivari",
      PC_IVA_RNI: "pc_ivarni",
      PC_TOTAL: "pc_total",
      PC_SUBTOTAL: "pc_subtotal",
      PC_PENDIENTE: "pc_pendiente",
      PC_FIRMADO: "pc_firmado",

      // PedidoCompraTMP
      PEDIDOCOMPRATMP: "PedidoCompraTMP",
      PC_TMP_ID: "pcTMP_id",

      // PedidoCompraItem
      PEDIDOCOMPRAITEM: "PedidoCompraItem",
      PCI_ID: "pci_id",
      PCI_ORDEN: "pci_orden",
      PCI_CANTIDAD: "pci_cantidad",
      PCI_CANTIDAD_A_REMITIR: "pci_cantidadaremitir",
      PCI_DESCRIP: "pci_descrip",
      PCI_PRECIO: "pci_precio",
      PCI_PRECIO_USR: "pci_precioUsr",
      PCI_PRECIO_LISTA: "pci_precioLista",
      PCI_NETO: "pci_neto",
      PCI_IVA_RI: "pci_ivari",
      PCI_IVA_RNI: "pci_ivarni",
      PCI_IMPORTE: "pci_importe",
      PCI_IVA_RI_PORC: "pci_ivariporc",
      PCI_IVA_RNI_PORC: "pci_ivarniporc",
      PCI_PENDIENTE: "pci_pendiente",

      // PedidoCompraItemTMP
      PEDIDOCOMPRAITEM_TMP: "PedidoCompraItemTMP",
      PCI_TMP_ID: "pciTMP_id",

      // PedidoCompraItemBorradoTMP
      PEDIDOCOMPRAITEM_BORRADO_TMP: "PedidoCompraItemBorradoTMP",
      PCIB_TMP_ID: "pcibTMP_id",

      // Pedido Devolucion Compra TMP
      PEDIDODEVOLUCIONCOMPRATMP: "PedidoDevolucionCompraTMP",
      PC_DC_TMP_ID: "pcdcTMP_id",
      PC_DC_ID: "pcdc_id",
      PC_DC_CANTIDAD: "pcdc_cantidad",
      PCI_ID_DEVOLUCION: "pci_id_devolucion",
      PCI_ID_PEDIDO: "pci_id_pedido",

      // FacturaCompra
      FACTURA_COMPRA: "FacturaCompra",
      FC_ID: "fc_id",
      FC_NUMERO: "fc_numero",
      FC_NRODOC: "fc_nrodoc",
      FC_DESCRIP: "fc_descrip",
      FC_FECHA: "fc_fecha",
      FC_FECHA_ENTREGA: "fc_fechaentrega",
      FC_FECHA_VTO: "fc_fechavto",
      FC_FECHA_IVA: "fc_fechaIva",
      FC_NETO: "fc_neto",
      FC_IVA_RI: "fc_ivari",
      FC_IVA_RNI: "fc_ivarni",
      FC_INTERNOS: "fc_internos",
      FC_SUBTOTAL: "fc_subtotal",
      FC_TOTAL: "fc_total",
      FC_TOTAL_ORIGEN: "fc_totalorigen",
      FC_PENDIENTE: "fc_pendiente",
      FC_FIRMADO: "fc_firmado",
      FC_DESCUENTO1: "fc_descuento1",
      FC_DESCUENTO2: "fc_descuento2",
      FC_IMPORTE_DESC_1: "fc_importedesc1",
      FC_IMPORTE_DESC_2: "fc_importedesc2",
      FC_GRABAR_ASIENTO: "fc_grabarasiento",
      FC_COTIZACION: "fc_cotizacion",
      FC_CAI: "fc_cai",
      FC_TOTAL_OTROS: "fc_totalotros",
      FC_TOTAL_PERCEPCIONES: "fc_totalpercepciones",
      FC_TIPO_COMPROBANTE: "fc_tipocomprobante",
      FC_COTIZACION_PROV: "fc_cotizacionprov",

      // FacturaCompraTMP
      FACTURA_COMPRA_TMP: "FacturaCompraTMP",
      FC_TMP_ID: "fcTMP_id",

      // FacturaCompraItem
      FACTURA_COMPRA_ITEM: "FacturaCompraItem",
      FCI_ID: "fci_id",
      FCI_ORDEN: "fci_orden",
      FCI_CANTIDAD: "fci_cantidad",
      FCI_CANTIDAD_A_REMITIR: "fci_cantidadaremitir",
      FCI_PENDIENTE: "fci_pendiente",
      FCI_DESCRIP: "fci_descrip",
      FCI_PRECIO: "fci_precio",
      FCI_PRECIO_USR: "fci_precioUsr",
      FCI_PRECIO_LISTA: "fci_precioLista",
      FCI_DESCUENTO: "fci_descuento",
      FCI_NETO: "fci_neto",
      FCI_IVA_RI: "fci_ivari",
      FCI_IVA_RNI: "fci_ivarni",
      FCI_IVA_RIPORC: "fci_ivariporc",
      FCI_IVA_RNIPORC: "fci_ivarniporc",

      FCI_INTERNOS_PORC: "fci_internosporc",
      FCI_INTERNOS: "fci_internos",

      FCI_IMPORTE_ORIGEN: "fci_importeorigen",
      FCI_IMPORTE: "fci_importe",

      // FacturaCompraItemTMP
      FACTURA_COMPRA_ITEM_TMP: "FacturaCompraItemTMP",
      FCI_TMP_ID: "fciTMP_id",

      // FacturaCompraOtroTMP
      FACTURA_COMPRA_OTRO_TMP: "FacturaCompraOtroTMP",
      FCOT_TMP_ID: "fcotTMP_id",

      // FacturaCompraOtro
      FACTURA_COMPRA_OTRO: "FacturaCompraOtro",
      FCOT_ID: "fcot_id",
      FCOT_ORDEN: "fcot_orden",
      FCOT_DEBE: "fcot_debe",
      FCOT_HABER: "fcot_haber",
      FCOT_DESCRIP: "fcot_descrip",
      FCOT_ORIGEN: "fcot_origen",

      // FacturaCompraOtroBorradoTMP
      FACTURA_COMPRA_OTRO_BORRADO_TMP: "FacturaCompraOtroBorradoTMP",
      FCOTB_TMP_ID: "fcotbTMP_id",

      // FacturaCompraItemBarradoTMP
      FACTURA_COMPRA_ITEM_BORRADO_TMP: "FacturaCompraItemBorradoTMP",
      FCIB_TMP_ID: "fcibTMP_id",

      // FacturaCompraPercepcion
      FACTURA_COMPRA_PERCEPCION: "FacturaCompraPercepcion",
      FCPERC_ID: "fcperc_id",
      FCPERC_ORDEN: "fcperc_orden",
      FCPERC_BASE: "fcperc_base",
      FCPERC_PORCENTAJE: "fcperc_porcentaje",
      FCPERC_IMPORTE: "fcperc_importe",
      FCPERC_ORIGEN: "fcperc_origen",
      FCPERC_DESCRIP: "fcperc_descrip",

      // FacturaCompraLegajo
      FACTURA_COMPRA_LEGAJO: "FacturaCompraLegajo",
      FCLGJ_ID: "fclgj_id",
      FCLGJ_ORDEN: "fclgj_orden",
      FCLGJ_IMPORTE: "fclgj_importe",
      FCLGJ_IMPORTE_ORIGEN: "fclgj_importeorigen",
      FCLGJ_DESCRIP: "fclgj_descrip",

      // FacturaCompraPercepcion TMP
      FACTURA_COMPRA_PERCEPCION_TMP: "FacturaCompraPercepcionTMP",
      FCPERC_TMP_ID: "fcpercTMP_id",

      // FacturaCompraLegajoTMP
      FACTURA_COMPRA_LEGAJO_TMP: "FacturaCompraLegajoTMP",
      FCLGJ_TMP_ID: "fclgjTMP_id",

      // FacturaCompraPercepcion Borrado TMP
      FACTURA_COMPRA_PERCEPCION_BORRADO_TMP: "FacturaCompraPercepcionBorradoTMP",
      FCPERCB_TMP_ID: "fcpercbTMP_id",

      // FacturaCompraPercepcion Borrado TMP
      FACTURA_COMPRA_LEGAJO_BORRADO_TMP: "FacturaCompraLegajoBorradoTMP",
      FCLGJB_TMP_ID: "fclgjbTMP_id",

      // Remito Factura Compra TMP
      REMITO_FACTURA_COMPRA_TMP: "RemitoFacturaCompraTMP",
      RC_FC_TMP_ID: "rcfcTMP_id",

      // Remito Factura Compra
      REMITO_FACTURA_COMPRA: "RemitoFacturaCompra",
      RC_FC_ID: "rcfc_id",
      RC_FC_CANTIDAD: "rcfc_cantidad",

      // Remito Factura Compra TMP
      REMITO_DEVOLUCION_COMPRA_TMP: "RemitoDevolucionCompraTMP",
      RC_DC_TMP_ID: "rcdcTMP_id",
      RC_DC_ID: "rcdc_id",
      RC_DC_CANTIDAD: "rcdc_cantidad",
      RCI_ID_DEVOLUCION: "rci_id_devolucion",
      RCI_ID_REMITO: "rci_id_remito",

      // OrdenCompra
      ORDEN_COMPRA: "OrdenCompra",
      OC_ID: "oc_id",
      OC_NUMERO: "oc_numero",
      OC_NRODOC: "oc_nrodoc",
      OC_DESCRIP: "oc_descrip",
      OC_FECHA: "oc_fecha",
      OC_FECHA_ENTREGA: "oc_fechaentrega",
      OC_NETO: "oc_neto",
      OC_IVA_RI: "oc_ivari",
      OC_IVA_RNI: "oc_ivarni",
      OC_TOTAL: "oc_total",
      OC_SUBTOTAL: "oc_subtotal",
      OC_PENDIENTE: "oc_pendiente",
      OC_DESCUENTO1: "oc_descuento1",
      OC_DESCUENTO2: "oc_descuento2",
      OC_IMPORTE_DESC_1: "oc_importedesc1",
      OC_IMPORTE_DESC_2: "oc_importedesc2",
      OC_FIRMADO: "oc_firmado",
      OC_ORDEN_COMPRA: "oc_ordencompra",
      OC_PRESUPUESTO: "oc_presupuesto",
      OC_MAQUINA: "oc_maquina",
      OC_MAQUINANRO: "oc_maquinanro",
      OC_MAQUINAMODELO: "oc_maquinamodelo",
      OC_FLETEAEREO: "oc_fleteaereo",
      OC_FLETEMARITIMO: "oc_fletemaritimo",
      OC_FLETECORREO: "oc_fletecorreo",
      OC_FLETECAMION: "oc_fletecamion",
      OC_FLETEOTROS: "oc_fleteotros",

      // OrdenCompraTMP
      ORDEN_COMPRA_TMP: "OrdenCompraTMP",
      OC_TMP_ID: "ocTMP_id",

      // OrdenCompraItem
      ORDEN_COMPRA_ITEM: "OrdenCompraItem",
      OCI_ID: "oci_id",
      OCI_ORDEN: "oci_orden",
      OCI_CANTIDAD: "oci_cantidad",
      OCI_CANTIDAD_A_REMITIR: "oci_cantidadaremitir",
      OCI_DESCRIP: "oci_descrip",
      OCI_PRECIO: "oci_precio",
      OCI_PRECIO_USR: "oci_precioUsr",
      OCI_PRECIO_LISTA: "oci_precioLista",
      OCI_DESCUENTO: "oci_descuento",
      OCI_NETO: "oci_neto",
      OCI_IVA_RI: "oci_ivari",
      OCI_IVA_RNI: "oci_ivarni",
      OCI_IMPORTE: "oci_importe",
      OCI_IVA_RI_PORC: "oci_ivariporc",
      OCI_IVA_RNI_PORC: "oci_ivarniporc",
      OCI_PENDIENTE: "oci_pendiente",
      OCI_PENDIENTE_FAC: "oci_pendientefac",

      // OrdenCompraItemTMP
      ORDEN_COMPRA_ITEM_TMP: "OrdenCompraItemTMP",
      OCI_TMP_ID: "ociTMP_id",

      // OrdenCompraItemBorradoTMP
      ORDEN_COMPRA_ITEM_BORRADO_TMP: "OrdenCompraItemBorradoTMP",
      OCIB_TMP_ID: "ocibTMP_id",

      // Orden Factura Compra TMP
      ORDEN_FACTURA_COMPRA_TMP: "OrdenFacturaCompraTMP",
      OC_FC_TMP_ID: "ocfcTMP_id",

      // Orden Factura Compra
      ORDEN_FACTURA_COMPRA: "OrdenFacturaCompra",
      OC_FC_ID: "ocfc_id",
      OC_FC_CANTIDAD: "ocfc_cantidad",

      // Devolucion Orden Compra TMP
      ORDEN_DEVOLUCION_COMPRA_TMP: "OrdenDevolucionCompraTMP",
      OC_DC_TMP_ID: "ocdcTMP_id",
      OC_DC_ID: "ocdc_id",
      OC_DC_CANTIDAD: "ocdc_cantidad",
      OCI_ID_DEVOLUCION: "oci_id_devolucion",
      OCI_ID_ORDEN: "oci_id_Orden",

      // Orden Remito Compra
      ORDEN_REMITO_COMPRA: "OrdenRemitoCompra",
      OC_RC_ID: "ocrc_id",
      OC_RC_CANTIDAD: "ocrc_cantidad",

      // Orden Remito Compra TMP
      ORDEN_REMITO_COMPRA_TMP: "OrdenRemitoCompraTMP",
      OC_RC_TMP_ID: "ocrcTMP_id",

      // Cotizacion
      COTIZACION_COMPRA: "CotizacionCompra",
      COT_ID: "cot_id",
      COT_NUMERO: "cot_numero",
      COT_NRODOC: "cot_nrodoc",
      COT_DESCRIP: "cot_descrip",
      COT_FECHA: "cot_fecha",
      COT_FECHA_ENTREGA: "cot_fechaentrega",
      COT_NETO: "cot_neto",
      COT_IVA_RI: "cot_ivari",
      COT_IVA_RNI: "cot_ivarni",
      COT_SUBTOTAL: "cot_subtotal",
      COT_TOTAL: "cot_total",
      COT_PENDIENTE: "cot_pendiente",
      COT_FIRMADO: "cot_firmado",

      // Cotizacion Item
      COTIZACION_COMPRA_ITEM: "CotizacionCompraItem",
      COTI_ID: "coti_id",
      COTI_ORDEN: "coti_orden",
      COTI_CANTIDAD: "coti_cantidad",
      COTI_PENDIENTE: "coti_pendiente",
      COTI_DESCRIP: "coti_descrip",
      COTI_PRECIO: "coti_precio",
      COTI_PRECIO_USR: "coti_precioUsr",
      COTI_PRECIO_LISTA: "coti_precioLista",
      COTI_DESCUENTO: "coti_descuento",
      COTI_NETO: "coti_neto",
      COTI_IVA_RI: "coti_ivari",
      COTI_IVA_RNI: "coti_ivarni",
      COTI_IVA_RIPORC: "coti_ivariporc",
      COTI_IVA_RNIPORC: "coti_ivarniporc",
      COTI_IMPORTE: "coti_importe",

      // Presupuesto Compra
      PRESUPUESTO_COMPRA: "PresupuestoCompra",
      PRC_ID: "prc_id",
      PRC_NUMERO: "prc_numero",
      PRC_NRODOC: "prc_nrodoc",
      PRC_DESCRIP: "prc_descrip",
      PRC_FECHA: "prc_fecha",
      PRC_FECHA_ENTREGA: "prc_fechaentrega",
      PRC_NETO: "prc_neto",
      PRC_IVA_RI: "prc_ivari",
      PRC_IVA_RNI: "prc_ivarni",
      PRC_SUBTOTAL: "prc_subtotal",
      PRC_TOTAL: "prc_total",
      PRC_PENDIENTE: "prc_pendiente",
      PRC_FIRMADO: "prc_firmado",
      PRC_DESCUENTO1: "prc_descuento1",
      PRC_DESCUENTO2: "prc_descuento2",
      PRC_IMPORTE_DESC_1: "prc_importedesc1",
      PRC_IMPORTE_DESC_2: "prc_importedesc2",

      // Presupuesto Compra Item
      PRESUPUESTO_COMPRA_ITEM: "PresupuestoCompraItem",
      PRCI_ID: "prci_id",
      PRCI_ORDEN: "prci_orden",
      PRCI_CANTIDAD: "prci_cantidad",
      PRCI_CANTIDAD_A_REMITIR: "prci_cantidadaremitir",
      PRCI_PENDIENTE: "prci_pendiente",
      PRCI_PENDIENTEPKLST: "prci_pendientepklst",
      PRCI_DESCRIP: "prci_descrip",
      PRCI_PRECIO: "prci_precio",
      PRCI_PRECIO_USR: "prci_precioUsr",
      PRCI_PRECIO_LISTA: "prci_precioLista",
      PRCI_DESCUENTO: "prci_descuento",
      PRCI_NETO: "prci_neto",
      PRCI_IVA_RI: "prci_ivari",
      PRCI_IVA_RNI: "prci_ivarni",
      PRCI_IVA_RIPORC: "prci_ivariporc",
      PRCI_IVA_RNIPORC: "prci_ivarniporc",
      PRCI_IMPORTE: "prci_importe",

      // Pedido Orden de Compra
      PEDIDO_ORDEN_COMPRA: "PedidoOrdenCompra",
      PC_OC_ID: "pcoc_id",
      PC_OC_CANTIDAD: "pcoc_cantidad",

      // Pedido Orden de Compra TMP
      PEDIDO_ORDEN_COMPRA_TMP: "PedidoOrdenCompraTMP",
      PC_OC_TMP_ID: "pcocTMP_id",

      // Pedido Cotizacion Compra
      PEDIDO_COTIZACION_COMPRA: "PedidoCotizacionCompra",
      PCCOT_ID: "pccot_id",
      PCCOT_CANTIDAD: "pccot_cantidad",

      // Pedido Cotizacion Compra TMP
      PEDIDO_COTIZACION_COMPRA_TMP: "PedidoCotizacionCompraTMP",
      PCCOT_TMP_ID: "pccotTMP_id",

      // Despacho Importacion Calculo
      DESPACHO_IMP_CALCULO: "DespachoImpCalculo",
      DIC_ID: "dic_id",
      DIC_NUMERO: "dic_numero",
      DIC_FECHA: "dic_fecha",
      DIC_TIPO: "dic_tipo",
      DIC_TITULO: "dic_titulo",
      DIC_DESCRIP: "dic_descrip",
      DIC_VIA: "dic_via",
      DIC_VIAEMPRESA: "dic_viaempresa",
      DIC_FACTURA: "dic_factura",
      DIC_CAMBIO1: "dic_cambio1",
      DIC_CAMBIO2: "dic_cambio2",
      DIC_PASE: "dic_pase",
      DIC_TOTALGTOS: "dic_totalgtos",
      DIC_PORCFOB: "dic_porcfob",
      DIC_VAR: "dic_var",
      DIC_PORCFOBFINAL: "dic_porcfobfinal",
      DIC_TOTAL: "dic_total",
      DIC_TOTALORIGEN: "dic_totalorigen",

      MON_ID1: "mon_id1",
      MON_ID2: "mon_id2",

      // Despacho Importacion Calculo Item
      DESPACHOIMPCALCULOITEM: "DespachoImpCalculoItem",
      DICI_ID: "dici_id",
      DICI_CODE: "dici_codigo",
      DICI_VALOR: "dici_valor",
      DICI_IMPORTE: "dici_importe",
      DICI_PORC: "dici_porc",
      DICI_DESCRIP: "dici_descrip",

      // Despacho Importacion Calculo Posicion Arancelaria
      DESPACHOIMPPOSICIONARANCEL: "DespachoImpCalculoPosicionArancel",
      DICP_ID: "dicp_id",
      DICP_DERECHOS: "dicp_derechos",
      DICP_ESTADISTICAS: "dicp_estadisticas",
      DICP_IVA: "dicp_iva",
      DICP_IVA3431: "dicp_iva3431",
      DICP_GANANCIAS: "dicp_ganancias",
      DICP_IGB: "dicp_igb",
      DICP_GASTOENVIO: "dicp_gastoenvio"

    }
  };

  Cairo.Security.Actions.Compras = {

    NEW_FACTURA: 17002,
    EDIT_FACTURA: 17003,
    DELETE_FACTURA: 17004,
    LIST_FACTURA: 17005,
    DES_ANULAR_FACTURA: 17010,
    ANULAR_FACTURA: 17011,

    NEW_REMITO: 17006,
    EDIT_REMITO: 17007,
    DELETE_REMITO: 17008,
    LIST_REMITO: 17009,
    DES_ANULAR_REMITO: 17012,
    ANULAR_REMITO: 17013,

    NEW_PEDIDO: 17014,
    EDIT_PEDIDO: 17015,
    DELETE_PEDIDO: 17016,
    LIST_PEDIDO: 17017,
    DES_ANULAR_PEDIDO: 17018,
    ANULAR_PEDIDO: 17019,

    MODIFY_APLIC: 17020,

    NEW_ORDEN: 17021,
    EDIT_ORDEN: 17022,
    DELETE_ORDEN: 17023,
    LIST_ORDEN: 17024,
    DES_ANULAR_ORDEN: 17025,
    ANULAR_ORDEN: 17026,

    NEW_COTIZACION: 17027,
    EDIT_COTIZACION: 17028,
    DELETE_COTIZACION: 17029,
    LIST_COTIZACION: 17030,
    DES_ANULAR_COTIZACION: 17031,
    ANULAR_COTIZACION: 17032,

    NEW_PRESUPUESTO: 17033,
    EDIT_PRESUPUESTO: 17034,
    DELETE_PRESUPUESTO: 17035,
    LIST_PRESUPUESTO: 17036,
    DES_ANULAR_PRESUPUESTO: 17037,
    ANULAR_PRESUPUESTO: 17038,

    EDIT_PRICE_PED: 17041,
    EDIT_PRICE_ORD: 17042,
    EDIT_PRICE_REM: 17039,
    EDIT_PRICE_FAC: 17040,

    NEW_DESP_IMPO_CALC: 17043,
    EDIT_DESP_IMPO_CALC: 17044,
    DELETE_DESP_IMPO_CALC: 17045,
    LIST_DESP_IMPO_CALC: 17046

  }

}());