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
-- Function: sp_doc_orden_cpra_set_item_pendiente()

-- drop function sp_doc_orden_cpra_set_item_pendiente(integer);

create or replace
function sp_doc_orden_cpra_set_item_pendiente
(
  in p_oc_id integer
)
  returns void as
$BODY$
declare

   v_oci_id integer;
   v_doct_id integer;
   v_est_id integer;

   v_aplicadoPedido decimal(18,6);
   v_aplicadoFactura decimal(18,6);
   v_aplicadoRemito decimal(18,6);
   v_aplicadoOrden decimal(18,6);

begin

   select doct_id,
          est_id
     into v_doct_id,
          v_est_id
   from OrdenCompra
   where oc_id = p_oc_id;

   SET TRANSACTION READ WRITE;

   if v_est_id <> 7 then

      for v_oci_id in
         select oci_id
         from OrdenCompraItem
         where oc_id = p_oc_id
      loop

         if v_doct_id = 35 then

            select coalesce(sum(pcoc_cantidad), 0)
              into v_aplicadoPedido
            from PedidoOrdenCompra
            where oci_id = v_oci_id;

            select coalesce(sum(ocrc_cantidad), 0)
              into v_aplicadoRemito
            from OrdenRemitoCompra
            where oci_id = v_oci_id;

            select coalesce(sum(ocfc_cantidad), 0)
              into v_aplicadoFactura
            from OrdenFacturaCompra
            where oci_id = v_oci_id;

            select v_aplicadoOrden + coalesce(sum(ocdc_cantidad), 0)
              into v_aplicadoOrden
            from OrdenDevolucionCompra
            where oci_id_Orden = v_oci_id;

         else

            v_aplicadoPedido := 0;
            v_aplicadoFactura := 0;
            v_aplicadoRemito := 0;

            select v_aplicadoOrden + coalesce(sum(ocdc_cantidad), 0)
              into v_aplicadoOrden
            from OrdenDevolucionCompra
            where oci_id_devolucion = v_oci_id;

         end if;

         v_aplicadoPedido := coalesce(v_aplicadoPedido, 0);
         v_aplicadoFactura := coalesce(v_aplicadoFactura, 0);
         v_aplicadoRemito := coalesce(v_aplicadoRemito, 0);
         v_aplicadoOrden := coalesce(v_aplicadoOrden, 0);

         update OrdenCompraItem
            set oci_pendientefac = oci_cantidadaremitir - v_aplicadoFactura - v_aplicadoRemito - v_aplicadoOrden,
                oci_pendiente = oci_cantidad - v_aplicadoPedido
         where oci_id = v_oci_id;

      end loop;

   else

      update OrdenCompraItem
         set oci_pendiente = 0,
             oci_pendientefac = 0
      where oc_id = p_oc_id;

   end if;

exception
   when others then

   raise exception 'Ha ocurrido un error al actualizar el pendiente de la Orden de compra. sp_doc_orden_cpra_set_item_pendientente. %. %.',
                   sqlstate, sqlerrm;

end;
$BODY$
  language plpgsql volatile
  cost 100;
alter function sp_doc_orden_cpra_set_item_pendiente(integer)
  owner to postgres;