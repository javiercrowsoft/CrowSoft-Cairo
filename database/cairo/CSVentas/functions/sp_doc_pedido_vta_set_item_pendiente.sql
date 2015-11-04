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
-- Function: sp_doc_pedido_vta_set_item_pendiente()

-- drop function sp_doc_pedido_vta_set_item_pendiente(integer);

create or replace
function sp_doc_pedido_vta_set_item_pendiente
(
  in p_pv_id integer
)
  returns void as
$BODY$
declare
   v_pvi_id integer;
   v_doct_id integer;
   v_est_id integer;

   v_aplicadoPresupuesto decimal(18,6);
   v_aplicadoPacking decimal(18,6);
   v_aplicadoFactura decimal(18,6);
   v_aplicadoRemito decimal(18,6);
   v_aplicadoPedido decimal(18,6);
begin

   select doct_id,
          est_id
     into v_doct_id,
          v_est_id
   from PedidoVenta
   where pv_id = p_pv_id;

   SET TRANSACTION READ WRITE;

   if v_est_id <> 7 then

      for v_pvi_id in
           select pvi_id
           from PedidoVentaItem
           where pv_id = p_pv_id
      loop

         if v_doct_id = 5 then

            select coalesce(sum(prvpv_cantidad), 0)
              into v_aplicadoPresupuesto
            from PresupuestoPedidoVenta
            where pvi_id = v_pvi_id;

            select coalesce(sum(pvrv_cantidad), 0)
              into v_aplicadoRemito
            from PedidoRemitoVenta
            where pvi_id = v_pvi_id;

            select coalesce(sum(pvfv_cantidad), 0)
              into v_aplicadoFactura
            from PedidoFacturaVenta
            where pvi_id = v_pvi_id;

            select v_aplicadoPedido + coalesce(sum(pvdv_cantidad), 0)
              into v_aplicadoPedido
            from PedidoDevolucionVenta
            where pvi_id_pedido = v_pvi_id;

            select coalesce(sum(pvpklst_cantidad), 0)
              into v_aplicadoPacking
            from PedidoPackingList
            where pvi_id = v_pvi_id;

         else

            v_aplicadoPresupuesto := 0;
            v_aplicadoFactura := 0;
            v_aplicadoRemito := 0;
            v_aplicadoPacking := 0;

            select v_aplicadoPedido + coalesce(sum(pvdv_cantidad), 0)
              into v_aplicadoPedido
            from PedidoDevolucionVenta
            where pvi_id_devolucion = v_pvi_id;

         end if;

         v_aplicadoPresupuesto := coalesce(v_aplicadoPresupuesto, 0);
         v_aplicadoFactura := coalesce(v_aplicadoFactura, 0);
         v_aplicadoRemito := coalesce(v_aplicadoRemito, 0);
         v_aplicadoPedido := coalesce(v_aplicadoPedido, 0);
         v_aplicadoPacking := coalesce(v_aplicadoPacking, 0);

         update PedidoVentaItem
            set pvi_pendiente = pvi_cantidadaremitir - v_aplicadoFactura - v_aplicadoRemito - v_aplicadoPedido,
                pvi_pendientepklst = pvi_cantidad - v_aplicadoPacking,
                pvi_pendienteprv = pvi_cantidad - v_aplicadoPresupuesto
         where pvi_id = v_pvi_id;

      end loop;

   else

      update PedidoVentaItem
         set pvi_pendiente = 0,
             pvi_pendientepklst = 0,
             pvi_pendienteprv = 0
      where pv_id = p_pv_id;

   end if;

exception
   when others then

   raise exception 'Ha ocurrido un error al actualizar el pendiente del pedido de venta. sp_doc_pedido_vta_set_item_pendientente. %. %.',
                   sqlstate, sqlerrm;

end;
$BODY$
  language plpgsql volatile
  cost 100;
alter function sp_doc_pedido_vta_set_item_pendiente(integer)
  owner to postgres;