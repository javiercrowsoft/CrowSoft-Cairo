/*
CrowSoft-Cairo
==============

ERP application written in Scala Play Framework and Postgresql

Copyright (C) 2012  Javier Mariano Alvarez

This program is free software; you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation; either version 2 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS for A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License along
with this program; if not, write to the Free Software Foundation, Inc.,
51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.

========================================================================

Created by Javier

http://www.crowsoft.com.ar

javier at crowsoft.com.ar
*/
-- Function: select * from sp_tmp_delete()

-- drop function sp_tmp_delete();

create or replace function sp_tmp_delete()
  returns void as
$BODY$
begin

   -- select 'delete from ' + name from sysobjects where xtype='u' and name like '%tmp%' order by name
   delete from AsientoItemBorradoTMP
   ;

   delete from AsientoItemTMP
   ;

   delete from AsientoTMP
   ;

   delete from CobranzaItemBorradoTMP
   ;

   delete from CobranzaItemTMP
   ;

   delete from CotizacionCompraItemBorradoTMP
   ;

   delete from CotizacionCompraItemTMP
   ;

   delete from CotizacionCompraTMP
   ;

   delete from CotizacionOrdenCompraTMP
   ;

   delete from CotizacionPresupuestoCompraTMP
   ;

   delete from DepositoBancoItemBorradoTMP
   ;

   delete from DepositoBancoItemTMP
   ;

   delete from DepositoBancoTMP
   ;

   delete from DepositoCuponItemBorradoTMP
   ;

   delete from DepositoCuponItemTMP
   ;

   delete from DepositoCuponTMP
   ;

   delete from FacturaCompraItemBorradoTMP
   ;

   delete from FacturaCompraItemSerieBTMP
   ;

   delete from FacturaCompraItemSerieTMP
   ;

   delete from FacturaCompraItemTMP
   ;

   delete from FacturaCompraLegajoBorradoTMP
   ;

   delete from FacturaCompraLegajoTMP
   ;

   delete from FacturaCompraNotaCreditoTMP
   ;

   delete from FacturaCompraOrdenPagoTMP
   ;

   delete from FacturaCompraOtroBorradoTMP
   ;

   delete from FacturaCompraOtroTMP
   ;

   delete from FacturaCompraPercepcionBorradoTMP
   ;

   delete from FacturaCompraPercepcionTMP
   ;

   delete from FacturaCompraTMP
   ;

   delete from FacturaVentaCobranzaTMP
   ;

   delete from FacturaVentaItemBorradoTMP
   ;

   delete from FacturaVentaItemSerieTMP
   ;

   delete from FacturaVentaItemTMP
   ;

   delete from FacturaVentaNotaCreditoTMP
   ;

   delete from FacturaVentaPercepcionBorradoTMP
   ;

   delete from FacturaVentaPercepcionTMP
   ;

   delete from FacturaVentaTMP
   ;

   delete from CobranzaTMP
   ;

   delete from HoraFacturaVentaTMP
   ;

   delete from ManifiestoCargaItemBorradoTMP
   ;

   delete from ManifiestoCargaItemTMP
   ;

   delete from ManifiestoCargaTMP
   ;

   delete from ManifiestoPackingListTMP
   ;

   delete from MovimientoFondoItemBorradoTMP
   ;

   delete from MovimientoFondoItemTMP
   ;

   delete from MovimientoFondoTMP
   ;

   delete from OrdenCompraItemBorradoTMP
   ;

   delete from OrdenCompraItemTMP
   ;

   delete from OrdenCompraTMP
   ;

   delete from OrdenDevolucionCompraTMP
   ;

   delete from OrdenFacturaCompraTMP
   ;

   delete from OrdenPagoItemBorradoTMP
   ;

   delete from OrdenPagoItemTMP
   ;

   delete from OrdenPagoTMP
   ;

   delete from OrdenRemitoCompraTMP
   ;

   delete from OrdenRemitoVentaTMP
   ;

   delete from OrdenServicioAlarmaTMP
   ;

   delete from OrdenServicioItemBorradoTMP
   ;

   delete from OrdenServicioItemSerieBTMP
   ;

   delete from OrdenServicioItemSerieTMP
   ;

   delete from OrdenServicioItemTMP
   ;

   delete from OrdenServicioSerieTMP
   ;

   delete from OrdenServicioTMP
   ;

   delete from PackingListDevolucionTMP
   ;

   delete from PackingListFacturaVentaTMP
   ;

   delete from PackingListItemBorradoTMP
   ;

   delete from PackingListItemTMP
   ;

   delete from PackingListTMP
   ;

   delete from ParteProdKitItemATMP
   ;

   delete from ParteProdKitItemBorradoTMP
   ;

   delete from ParteProdKitItemSerieTMP
   ;

   delete from ParteProdKitItemTMP
   ;

   delete from ParteProdKitTMP
   ;

   delete from ParteReparacionItemBorradoTMP
   ;

   delete from ParteReparacionItemSerieTMP
   ;

   delete from ParteReparacionItemTMP
   ;

   delete from ParteReparacionTMP
   ;

   delete from PedidoCompraItemBorradoTMP
   ;

   delete from PedidoCompraItemTMP
   ;

   delete from PedidoCompraTMP
   ;

   delete from PedidoCotizacionCompraTMP
   ;

   delete from PedidoDevolucionCompraTMP
   ;

   delete from PedidoDevolucionVentaTMP
   ;

   delete from PedidoFacturaVentaTMP
   ;

   delete from PedidoOrdenCompraTMP
   ;

   delete from PedidoPackingListTMP
   ;

   delete from PedidoRemitoVentaTMP
   ;

   delete from PedidoVentaItemBorradoTMP
   ;

   delete from PedidoVentaItemTMP
   ;

   delete from PedidoVentaTMP
   ;

   delete from PermisoEmbarqueItemBorradoTMP
   ;

   delete from PermisoEmbarqueItemTMP
   ;

   delete from PermisoEmbarqueTMP
   ;

   delete from PresupuestoCompraItemBorradoTMP
   ;

   delete from PresupuestoCompraItemTMP
   ;

   delete from PresupuestoCompraTMP
   ;

   delete from PresupuestoDevolucionCompraTMP
   ;

   delete from PresupuestoDevolucionVentaTMP
   ;

   delete from PresupuestoEnvioGastoBorradoTMP
   ;

   delete from PresupuestoEnvioGastoTMP
   ;

   delete from PresupuestoEnvioItemBorradoTMP
   ;

   delete from PresupuestoEnvioItemTMP
   ;

   delete from PresupuestoEnvioTMP
   ;

   delete from PresupuestoPedidoVentaTMP
   ;

   delete from PresupuestoVentaItemBorradoTMP
   ;

   delete from PresupuestoVentaItemTMP
   ;

   delete from PresupuestoVentaTMP
   ;

   delete from ProductoSerieKitBorradoTMP
   ;

   delete from ProductoSerieKitItemTMP
   ;

   delete from ProductoSerieKitTMP
   ;

   delete from RecuentoStockItemSerieTMP
   ;

   delete from RecuentoStockItemTMP
   ;

   delete from RecuentoStockTMP
   ;

   delete from RemitoCompraItemBorradoTMP
   ;

   delete from RemitoCompraItemSerieBTMP
   ;

   delete from RemitoCompraItemSerieTMP
   ;

   delete from RemitoCompraItemTMP
   ;

   delete from RemitoCompraTMP
   ;

   delete from RemitoDevolucionCompraTMP
   ;

   delete from RemitoDevolucionVentaTMP
   ;

   delete from RemitoFacturaCompraTMP
   ;

   delete from RemitoFacturaVentaTMP
   ;

   delete from RemitoVentaItemBorradoTMP
   ;

   delete from RemitoVentaItemInsumoTMP
   ;

   delete from RemitoVentaItemSerieTMP
   ;

   delete from RemitoVentaItemTMP
   ;

   delete from RemitoVentaTMP
   ;

   delete from ResolucionCuponItemBorradoTMP
   ;

   delete from ResolucionCuponItemTMP
   ;

   delete from ResolucionCuponTMP
   ;

   delete from StockClienteTMP
   ;

   delete from StockItemTMP
   ;

   delete from StockProveedorTMP
   ;

   delete from StockTMP
   ;

   delete from TmpStringToTable
   ;

   delete from rptArbolRamaHoja
   ;

end;
$BODY$
  language plpgsql volatile
  cost 100;
alter function sp_tmp_delete()
  owner to postgres;