/*
* This file is not part of the code
* It is here to allow IntelliJ or RubyMine found the symbol when it is a Marionette module
* */

Cairo.module = function() {};

Cairo.Language = {};
Cairo.Controls = {};
Cairo.Dialogs = {};
Cairo.Dialogs.Grids = {};
Cairo.Dialogs.Views = {};
Cairo.Dialogs.WizardViews = {};
Cairo.Select = {};
Cairo.Modules = {};
Cairo.Reports = {};
Cairo.Tasks = {};

Cairo.addRegions = function() {};

Cairo.UsuarioConfig = {};
Cairo.StockConfig = {};
Cairo.ContConfig = {};
Cairo.VentaConfig = {};
Cairo.TesoreriaConfig = {};

Cairo.SearchZona = {};

Cairo.Usuario = {};
Cairo.Producto = {};
Cairo.Proveedor = {};
Cairo.Cliente = {};

Cairo.EditDocumento = {};
Cairo.FacturaCompra = {};
Cairo.FacturaCompraListDoc = {};
Cairo.FacturaCompraRemitoWiz = {};
Cairo.FacturaCompraWiz = {};

Cairo.FacturaVenta = {};
Cairo.FacturaVentaListDoc = {};
Cairo.FacturaVentaRemitoWiz = {};
Cairo.FacturaVentaWiz = {};

Cairo.PedidoVenta = {};
Cairo.PedidoVentaListDoc = {};

Cairo.RemitoVenta = {};

Cairo.PackingList = {};

Cairo.Asiento = {};
Cairo.AsientoListDoc = {};

Cairo.Cobranza = {};
Cairo.CobranzaWizard = {};
Cairo.CobranzaListDoc = {};

Cairo.OrdenPago = {};
Cairo.OrdenPagoWizard = {};
Cairo.OrdenPagoListDoc = {};

Cairo.DepositoBanco = {};
Cairo.DepositoBancoListDoc = {};

Cairo.MovimientoFondo = {};
Cairo.MovimientoFondoListDoc = {};

Cairo.Stock = {};

Cairo.Rubro = {};
Cairo.Rubro.Load = {};

Cairo.RubroTabla = {};

Cairo.Common = {};
Cairo.Entities = {};

Cairo.ProductoSerie = {};

PercepcionType = {
  tipoBase: 0,
  minimo: 0,
  desde: 0,
  hasta: 0,
  fijo: 0,
  porc: 0,
  percId: 0
};

Marionette = {};
Backbone = {};
Marionette.Region = {};
Backbone.Model = {};
Backbone.history = {};
Backbone.history.fragment = {};

/*
*
* compilation tools :P
*
* */

/*

 this can be used to check if we have call getColumns(colIndex) instead of getColumns().get(colIndex) or getColumns().item(colindex)

 getColumns\(([^)]+)\)

 the same for getRows

 getRows\(([^)]+)\)

*/