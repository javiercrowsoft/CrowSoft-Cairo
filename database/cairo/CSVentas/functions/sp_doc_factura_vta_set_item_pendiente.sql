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
-- Function: sp_doc_factura_vta_set_item_pendiente()

-- drop function sp_doc_factura_vta_set_item_pendiente(integer);

create or replace function sp_doc_factura_vta_set_item_pendiente
(
  in p_fv_id integer
)
  returns void as
$BODY$
declare
   v_fvi_id integer;
   v_est_id integer;

   v_aplicadopedido decimal(18,6);
   v_aplicadoremito decimal(18,6);
   v_aplicadopacking decimal(18,6);
begin

   select est_id
     into v_est_id
   from FacturaVenta
   where fv_id = p_fv_id;

   SET TRANSACTION READ WRITE;

   if v_est_id <> 7 then

      for v_fvi_id in
           select fvi_id
           from FacturaVentaItem
           where fv_id = p_fv_id
      loop

         select coalesce(sum(pvfv_cantidad), 0)
           into v_aplicadopedido
         from PedidoFacturaVenta
         where fvi_id = v_fvi_id;

         select coalesce(sum(rvfv_cantidad), 0)
           into v_aplicadoremito
         from RemitoFacturaVenta
         where fvi_id = v_fvi_id;

         select coalesce(sum(pklstfv_cantidad), 0)
           into v_aplicadopacking
         from PackingListFacturaVenta
         where fvi_id = v_fvi_id;

         v_aplicadopedido := coalesce(v_aplicadopedido, 0);
         v_aplicadoremito := coalesce(v_aplicadoremito, 0);
         v_aplicadopacking := coalesce(v_aplicadopacking, 0);

         update FacturaVentaItem
            set fvi_pendiente = fvi_cantidadaremitir - v_aplicadopedido - v_aplicadoremito,
                fvi_pendientepklst = fvi_cantidadaremitir - v_aplicadopacking
         where fvi_id = v_fvi_id;

      end loop;

   else

      update FacturaVentaItem
         set fvi_pendiente = 0,
             fvi_pendientepklst = 0
      where fv_id = p_fv_id;

   end if;

exception
   when others then

   raise exception 'Ha ocurrido un error al actualizar el pendiente de la factura de venta. sp_doc_factura_vta_set_item_pendiente. %. %.',
                   sqlstate, sqlerrm;

end;
$BODY$
  language plpgsql volatile
  cost 100;
alter function sp_doc_factura_vta_set_item_pendiente(integer)
  owner to postgres;