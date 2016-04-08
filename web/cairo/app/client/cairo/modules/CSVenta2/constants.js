(function() {
  "use strict";

  Cairo.Ventas = {

    Constants: {

      CLIENTE_DATA_ADD: "ClienteDataAdd",

      RV_TA_PROPUESTO: "rv_ta_propuesto",

      // RemitoVenta
      REMITO_VENTA: "RemitoVenta",
      RV_ID: "rv_id",
      RV_NUMERO: "rv_numero",
      RV_NRODOC: "rv_nrodoc",
      RV_DESCRIP: "rv_descrip",
      RV_FECHA: "rv_fecha",
      RV_FECHAENTREGA: "rv_fechaentrega",
      RV_NETO: "rv_neto",
      RV_IVARI: "rv_ivari",
      RV_IVARNI: "rv_ivarni",
      RV_SUBTOTAL: "rv_subtotal",
      RV_TOTAL: "rv_total",
      RV_PENDIENTE: "rv_pendiente",
      RV_FIRMADO: "rv_firmado",
      RV_DESCUENTO1: "rv_descuento1",
      RV_DESCUENTO2: "rv_descuento2",
      RV_IMPORTEDESC1: "rv_importedesc1",
      RV_IMPORTEDESC2: "rv_importedesc2",
      RV_COTIZACION: "rv_cotizacion",
      RV_RETIRO: "rv_retiro",
      RV_GUIA: "rv_guia",
      RV_DESTINATARIO: "rv_destinatario",
      RV_ORDEN_COMPRA: "rv_ordencompra",

      // RemitoVentaTMP
      REMITO_VENTA_TMP: "RemitoVentaTMP",
      RV_TMP_ID: "rvTMP_id",

      // RemitoVentaItem
      REMITO_VENTA_ITEM: "RemitoVentaItem",
      RVI_ID: "rvi_id",
      RVI_ORDEN: "rvi_orden",
      RVI_CANTIDAD: "rvi_cantidad",
      RVI_CANTIDADAREMITIR: "rvi_cantidadaremitir",
      RVI_PENDIENTE: "rvi_pendiente",
      RVI_PENDIENTEFAC: "rvi_pendientefac",
      RVI_DESCRIP: "rvi_descrip",
      RVI_PRECIO: "rvi_precio",
      RVI_PRECIO_USR: "rvi_precioUsr",
      RVI_PRECIO_LISTA: "rvi_precioLista",
      RVI_DESCUENTO: "rvi_descuento",
      RVI_NETO: "rvi_neto",
      RVI_IVARI: "rvi_ivari",
      RVI_IVARNI: "rvi_ivarni",
      RVI_IVARIPORC: "rvi_ivariporc",
      RVI_IVARNIPORC: "rvi_ivarniporc",
      RVI_IMPORTE: "rvi_importe",

      // RemitoVentaTMP
      REMITO_VENTA_ITEM_TMP: "RemitoVentaItemTMP",
      RVI_TMP_ID: "rviTMP_id",

      // Items Borrados de Remito de venta
      REMITO_VENTA_ITEM_BORRADO_TMP: "RemitoVentaItemBorradoTMP",
      RVIB_TMP_ID: "rvibTMP_id",

      // FacturaVenta
      FACTURA_VENTA: "FacturaVenta",
      FV_ID: "fv_id",
      FV_NUMERO: "fv_numero",
      FV_NRODOC: "fv_nrodoc",
      FV_DESCRIP: "fv_descrip",
      FV_FECHA: "fv_fecha",
      FV_FECHA_ENTREGA: "fv_fechaentrega",
      FV_FECHA_VTO: "fv_fechaVto",
      FV_FECHA_IVA: "fv_fechaIva",
      FV_NETO: "fv_neto",
      FV_IVA_RI: "fv_ivari",
      FV_IVA_RNI: "fv_ivarni",
      FV_INTERNOS: "fv_internos",
      FV_SUBTOTAL: "fv_subtotal",
      FV_TOTAL: "fv_total",
      FV_TOTAL_ORIGEN: "fv_totalorigen",
      FV_PENDIENTE: "fv_pendiente",
      FV_FIRMADO: "fv_firmado",
      FV_DESCUENTO1: "fv_descuento1",
      FV_DESCUENTO2: "fv_descuento2",
      FV_IMPORTE_DESC_1: "fv_importedesc1",
      FV_IMPORTE_DESC_2: "fv_importedesc2",
      FV_GRABAR_ASIENTO: "fv_grabarasiento",
      FV_COTIZACION: "fv_cotizacion",
      FV_CAI: "fv_cai",
      FV_TOTAL_PERCEPCIONES: "fv_totalpercepciones",
      FV_ORDEN_COMPRA: "fv_ordencompra",
      FV_CAE: "fv_cae",

      // FacturaVentaTMP
      FACTURA_VENTA_TMP: "FacturaVentaTMP",
      FV_TMP_ID: "fvTMP_id",

      // FacturaVentaItem
      FACTURA_VENTA_ITEM: "FacturaVentaItem",
      FVI_ID: "fvi_id",
      FVI_ORDEN: "fvi_orden",
      FVI_CANTIDAD: "fvi_cantidad",
      FVI_CANTIDADAREMITIR: "fvi_cantidadaremitir",
      FVI_PENDIENTE: "fvi_pendiente",
      FVI_DESCRIP: "fvi_descrip",
      FVI_PRECIO: "fvi_precio",
      FVI_PRECIO_USR: "fvi_precioUsr",
      FVI_PRECIO_LISTA: "fvi_precioLista",
      FVI_DESCUENTO: "fvi_descuento",
      FVI_NETO: "fvi_neto",
      FVI_IVARI: "fvi_ivari",
      FVI_IVARNI: "fvi_ivarni",
      FVI_INTERNOS: "fvi_internos",
      FVI_IVA_RIPORC: "fvi_ivariporc",
      FVI_IVA_RNIPORC: "fvi_ivarniporc",
      FVI_INTERNOS_PORC: "fvi_internosporc",
      FVI_IMPORTE_ORIGEN: "fvi_importeorigen",
      FVI_IMPORTE: "fvi_importe",
      FVI_NO_STOCK: "fvi_nostock",

      // FacturaVentaItemTMP
      FACTURA_VENTA_ITEM_TMP: "FacturaVentaItemTMP",
      FVI_TMP_ID: "fviTMP_id",

      // FacturaVentaItemBarradoTMP
      FACTURA_VENTA_ITEM_BORRADO_TMP: "FacturaVentaItemBorradoTMP",
      FVIB_TMP_ID: "fvibTMP_id",

      // FacturaVentaPercepcion
      FACTURA_VENTA_PERCEPCION: "FacturaVentaPercepcion",
      FVPERC_ID: "fvperc_id",
      FVPERC_ORDEN: "fvperc_orden",
      FVPERC_BASE: "fvperc_base",
      FVPERC_PORCENTAJE: "fvperc_porcentaje",
      FVPERC_IMPORTE: "fvperc_importe",
      FVPERC_ORIGEN: "fvperc_origen",
      FVPERC_DESCRIP: "fvperc_descrip",

      // FacturaVentaPercepcion TMP
      FACTURA_VENTA_PERCEPCION_TMP: "FacturaVentaPercepcionTMP",
      FVPERC_TMP_ID: "fvpercTMP_id",

      // FacturaVentaPercepcion Borrado TMP
      FACTURA_VENTA_PERCEPCION_BORRADO_TMP: "FacturaVentaPercepcionBorradoTMP",
      FV_PERCB_TMP_ID: "fvpercbTMP_id",


      // Pedido Remito Venta TMP
      PEDIDOREMITO_VENTA_TMP: "PedidoRemitoVentaTMP",
      PV_RV_TMP_ID: "pvrvTMP_id",

      // Pedido Remito Venta
      PEDIDOREMITO_VENTA: "PedidoRemitoVenta",
      PV_RV_ID: "pvrv_id",
      PV_RV_CANTIDAD: "pvrv_cantidad",

      // Pedido Factura Venta TMP
      PEDIDOFACTURA_VENTA_TMP: "PedidoFacturaVentaTMP",
      PV_FV_TMP_ID: "pvfvTMP_id",

      // Pedido Factura Venta
      PEDIDOFACTURA_VENTA: "PedidoFacturaVenta",
      PV_FV_ID: "pvfv_id",
      PV_FV_CANTIDAD: "pvfv_cantidad",

      // Remito Factura Venta TMP
      REMITOFACTURA_VENTA_TMP: "RemitoFacturaVentaTMP",
      RV_FV_TMP_ID: "rvfvTMP_id",

      // Remito Factura Venta TMP
      REMITODEVOLUCION_VENTA_TMP: "RemitoDevolucionVentaTMP",
      RV_DV_TMP_ID: "rvdvTMP_id",
      RV_DV_ID: "rvdv_id",
      RV_DV_CANTIDAD: "rvdv_cantidad",
      RVI_ID_DEVOLUCION: "rvi_id_devolucion",
      RVI_ID_REMITO: "rvi_id_remito",

      // Remito Factura Venta
      REMITOFACTURA_VENTA: "RemitoFacturaVenta",
      RV_FV_ID: "rvfv_id",
      RV_FV_CANTIDAD: "rvfv_cantidad",

      // Remito Venta Item Serie
      REMITO_VENTA_ITEM_SERIE_TMP: "RemitoVentaItemSerieTMP",
      RVIS_TMP_ID: "rvisTMP_id",
      RVIS_ORDEN: "rvis_orden",

      // Remito Venta Item Insumo
      REMITO_VENTA_ITEM_INSUMO_TMP: "RemitoVentaItemInsumoTMP",
      RVII_TMP_ID: "rviiTMP_id",
      RVII_TMPCANTIDAD: "rviiTMP_cantidad",
      RVII_TMPCANTIDAD_AUX: "rviiTMP_cantidadAux",
      RVII_TMPTEMP: "rviiTMP_temp",

      // Factura Venta Item Serie
      FACTURA_VENTA_ITEM_SERIE_TMP: "FacturaVentaItemSerieTMP",
      FVIS_TMP_ID: "fvisTMP_id",
      FVIS_ORDEN: "fvis_orden",

      // Presupuesto de Venta
      PRESUPUESTO_VENTA_TMP: "PresupuestoVentaTMP",
      PRV_TMP_ID: "prvtmp_id",

      PRESUPUESTO_VENTA: "presupuestoVenta",
      PRV_ID: "prv_id",
      PRV_NUMERO: "prv_numero",
      PRV_NRODOC: "prv_nrodoc",
      PRV_DESCRIP: "prv_descrip",
      PRV_FECHA: "prv_fecha",
      PRV_FECHAENTREGA: "prv_fechaentrega",
      PRV_FIRMADO: "prv_firmado",
      PRV_NETO: "prv_neto",
      PRV_IVARI: "prv_ivari",
      PRV_IVARNI: "prv_ivarni",
      PRV_TOTAL: "prv_total",
      PRV_SUBTOTAL: "prv_subtotal",
      PRV_DESCUENTO1: "prv_descuento1",
      PRV_DESCUENTO2: "prv_descuento2",
      PRV_IMPORTE_DESC1: "prv_importedesc1",
      PRV_IMPORTE_DESC2: "prv_importedesc2",

      // PresupuestoVentaItem
      PRESUPUESTO_VENTA_ITEM_TMP: "PresupuestoVentaItemTMP",
      PRVI_TMP_ID: "prvitmp_id",

      PRESUPUESTO_VENTA_ITEM: "PresupuestoVentaItem",
      PRVI_ID: "prvi_id",
      PRVI_ORDEN: "prvi_orden",
      PRVI_CANTIDAD: "prvi_cantidad",
      PRVI_CANTIDADAREMITIR: "prvi_cantidadaremitir",
      PRVI_DESCRIP: "prvi_descrip",
      PRVI_PRECIO: "prvi_precio",
      PRVI_NETO: "prvi_neto",
      PRVI_IVARI: "prvi_ivari",
      PRVI_IVARNI: "prvi_ivarni",
      PRVI_IVARI_PORC: "prvi_ivariporc",
      PRVI_IVARNI_PORC: "prvi_ivarniporc",
      PRVI_IMPORTE: "prvi_importe",
      PRVI_PRECIO_USR: "prvi_precioUsr",
      PRVI_PRECIO_LISTA: "prvi_precioLista",
      PRVI_DESCUENTO: "prvi_descuento",
      PRVI_PENDIENTE: "prvi_pendiente",
      PRVI_PENDIENTE_PKLST: "prvi_pendientepklst",

      // Items Borrados de Presupuesto de venta
      PRESUPUESTO_VENTA_ITEM_BORRADO_TMP: "PresupuestoVentaItemBorradoTMP",
      PRVIB_TMP_ID: "prvibTMP_id",

      // Presupuesto Pedido Venta
      PRESUPUESTO_PEDIDO_VENTA: "PresupuestoPedidoVenta",
      PRV_PV_ID: "prvpv_id",
      PRV_PV_CANTIDAD: "prvpv_cantidad",

      // Presupuesto Pedido Venta TMP
      PRESUPUESTO_PEDIDO_VENTA_TMP: "PresupuestoPedidoVentaTMP",
      PRV_PV_TMP_ID: "prvpvTMP_id",

      // Presupuesto Devolucion Venta TMP
      PRESUPUESTO_DEVOLUCION_VENTA_TMP: "PresupuestoDevolucionVentaTMP",
      PRV_DV_TMP_ID: "prvdvTMP_id",
      PRV_DV_ID: "prvdv_id",
      PRV_DV_CANTIDAD: "prvdv_cantidad",
      PRVI_ID_DEVOLUCION: "prvi_id_devolucion",
      PRVI_ID_PRESUPUESTO: "prvi_id_presupuesto",

      PEDIDO_VENTA_TMP: "PedidoVentaTMP",
      PV_TMPID: "pvtmp_id",

      PEDIDO_VENTA: "PedidoVenta",
      PV_ID: "pv_id",
      PV_NUMERO: "pv_numero",
      PV_NRODOC: "pv_nrodoc",
      PV_DESCRIP: "pv_descrip",
      PV_FECHA: "pv_fecha",
      PV_FECHA_ENTREGA: "pv_fechaentrega",
      PV_FIRMADO: "pv_firmado",
      PV_NETO: "pv_neto",
      PV_IVARI: "pv_ivari",
      PV_IVARNI: "pv_ivarni",
      PV_TOTAL: "pv_total",
      PV_SUBTOTAL: "pv_subtotal",
      PV_DESCUENTO1: "pv_descuento1",
      PV_DESCUENTO2: "pv_descuento2",
      PV_IMPORTE_DESC1: "pv_importedesc1",
      PV_IMPORTE_DESC2: "pv_importedesc2",
      PV_DESTINATARIO: "pv_destinatario",
      PV_ORDEN_COMPRA: "pv_ordencompra",

      // Deposito
      RAM_ID_STOCK: "ram_id_stock",
      RAMA_STOCK: "ramastock",

      // Items de Pedidos de Venta
      PEDIDO_VENTA_ITEM_TMP: "PedidoVentaItemTMP",
      PVI_TMP_ID: "pvitmp_id",

      PEDIDO_VENTA_ITEM: "PedidoVentaItem",
      PVI_ID: "pvi_id",
      PVI_ORDEN: "pvi_orden",
      PVI_CANTIDAD: "pvi_cantidad",
      PVI_CANTIDAD_A_REMITIR: "pvi_cantidadaremitir",
      PVI_DESCRIP: "pvi_descrip",
      PVI_PRECIO: "pvi_precio",
      PVI_NETO: "pvi_neto",
      PVI_IVARI: "pvi_ivari",
      PVI_IVARNI: "pvi_ivarni",
      PVI_IVARI_PORC: "pvi_ivariporc",
      PVI_IVARNI_PORC: "pvi_ivarniporc",
      PVI_IMPORTE: "pvi_importe",
      PVI_PRECIO_USR: "pvi_precioUsr",
      PVI_PRECIO_LISTA: "pvi_precioLista",
      PVI_DESCUENTO: "pvi_descuento",
      PVI_PENDIENTE: "pvi_pendiente",
      PVI_PENDIENTE_PKLST: "pvi_pendientepklst",
      PVI_PENDIENTE_PRV: "pvi_pendienteprv",

      // Items Borrados de pedidos de venta
      PEDIDO_VENTA_ITEM_BORRADO_TMP: "PedidoVentaItemBorradoTMP",
      PVIB_TMP_ID: "pvibTMP_id",
    }
  };

  Cairo.Security.Actions.Ventas = {

    NEW_PEDIDO: 3000,
    EDIT_PEDIDO: 3001,
    DELETE_PEDIDO: 3002,
    LIST_PEDIDO: 3003,
    DES_ANULAR_PEDIDO: 3004,
    ANULAR_PEDIDO: 3005,
    EDIT_PRICE_PED: 3006,

    NEW_FACTURA: 16002,
    EDIT_FACTURA: 16003,
    DELETE_FACTURA: 16004,
    LIST_FACTURA: 16005,
    DES_ANULAR_FACTURA: 16010,
    ANULAR_FACTURA: 16011,

    NEW_REMITO: 16006,
    EDIT_REMITO: 16007,
    DELETE_REMITO: 16008,
    LIST_REMITO: 16009,
    DES_ANULAR_REMITO: 16012,
    ANULAR_REMITO: 16013,

    MODIFY_APLIC: 16014,

    EDIT_PRICE_REM: 16015,
    EDIT_PRICE_FAC: 16016,
    EDIT_PRICE_PRESU: 16023,

    NEW_PRESUPUESTO: 16017,
    EDIT_PRESUPUESTO: 16018,
    DELETE_PRESUPUESTO: 16019,
    LIST_PRESUPUESTO: 16020,
    DES_ANULAR_PRESUPUESTO: 16021,
    ANULAR_PRESUPUESTO: 16022,

    COBRANZA_CONTADO: 16024,

    NEW_HOJA_RUTA: 16025,
    EDIT_HOJA_RUTA: 16026,
    DELETE_HOJA_RUTA: 16027,
    LIST_HOJA_RUTA: 16028,

    NEW_CAJA: 16029,
    EDIT_CAJA: 16030,
    DELETE_CAJA: 16031,
    LIST_CAJA: 16032,

    ABRIR_CAJA: 16034,
    ACEPTAR_CIERRE: 16033,

    NEW_PICKING_LIST: 16035,
    EDIT_PICKING_LIST: 16036,
    DELETE_PICKING_LIST: 16037,
    LIST_PICKING_LIST: 16038,

    MODIFICAR_ARTICULO: 16039,
    COBRANZAS_CAJERO: 16040

  }

}());