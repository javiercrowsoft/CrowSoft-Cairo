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
-- Function: sp_doc_pedido_vta_remito_set_pendiente()

-- drop function sp_doc_pedido_vta_remito_set_pendiente(integer, integer, integer);

create or replace function sp_doc_pedido_vta_remito_set_pendiente
(
  in p_pv_id integer
)
  returns void as
$BODY$
declare
   v_success integer;
   v_error_msg varchar(5000);
   v_rv_id integer;
begin

   for v_rv_id in
        select distinct rv_id
        from PedidoRemitoVenta pvrv
        join PedidoVentaItem pvi
          on pvrv.pvi_id = pvi.pvi_id
        join RemitoVentaItem rvi
          on pvrv.rvi_id = rvi.rvi_id
        where pv_id = p_pv_id
        union
        select rv_id
        from tt_PedidoVentaRemito
   loop

      -- actualizo la deuda del remito
      --
      perform sp_doc_remito_vta_set_item_pendiente(v_rv_id);

      -- validaciones
      --

      -- estado
      --
      select * from sp_auditoria_credito_check_doc_rv(v_rv_id) into v_success, v_error_msg;
      if coalesce(v_success, 0) = 0 then
         raise exception '%', v_error_msg;
      end if;

   end loop;

exception
   when others then

      raise exception 'Ha ocurrido un error al actualizar el pendiente del pedido de venta. sp_doc_pedido_vta_remito_set_pendiente. %. %.',
                      sqlstate, sqlerrm;

end;
$BODY$
  language plpgsql volatile
  cost 100;
alter function sp_doc_pedido_vta_remito_set_pendiente(integer)
  owner to postgres;