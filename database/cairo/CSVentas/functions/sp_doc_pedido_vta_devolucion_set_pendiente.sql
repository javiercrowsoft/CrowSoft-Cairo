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
-- Function: sp_doc_pedido_vta_devolucion_set_pendiente()

-- drop function sp_doc_pedido_vta_devolucion_set_pendiente(integer, integer, integer);

create or replace function sp_doc_pedido_vta_devolucion_set_pendiente
(
  in p_pv_id integer
)
  returns void as
$BODY$
declare
   v_success integer;
   v_error_msg varchar(5000);
   v_pv_id integer;
   v_doct_id integer;

   c_pendiente refcursor;
begin

   select doct_id
   into v_doct_id
   from PedidoVenta
   where pv_id = p_pv_id;

   if v_doct_id = 5 then

      open c_pendiente for
         select distinct pvi.pv_id
         from PedidoDevolucionVenta pvdv
         join PedidoVentaItem pvi
           on pvdv.pvi_id_devolucion = pvi.pvi_id
         join PedidoVentaItem pvir
           on pvdv.pvi_id_pedido = pvir.pvi_id
         where pvir.pv_id = p_pv_id
         union
         select pv_id
         from tt_PedidoDevolucionVenta;

   else

      open c_pendiente for
         select distinct pvi.pv_id
         from PedidoDevolucionVenta pvdv
         join PedidoVentaItem pvi
           on pvdv.pvi_id_pedido = pvi.pvi_id
         join PedidoVentaItem pvid
           on pvdv.pvi_id_devolucion = pvid.pvi_id
         where pvid.pv_id = p_pv_id
         union
         select pv_id
         from tt_PedidoDevolucionVenta;

   end if;

   loop

      fetch c_pendiente into v_pv_id;
      exit when not found;

      -- actualizo la deuda del pedido
      --
      perform sp_doc_pedido_venta_set_pendiente(v_pv_id);

      -- credito
      --
      perform sp_doc_pedido_venta_set_credito(v_pv_id);

      -- estado
      --
      perform sp_doc_pedido_venta_set_estado(v_pv_id);

      -- validaciones
      --

      -- estado
      --
      select * from sp_auditoria_estado_check_doc_pv(v_pv_id) into v_success, v_error_msg;
      if coalesce(v_success, 0) = 0 then
         raise exception '%', v_error_msg;
      end if;

      -- credito
      --
      select * from sp_auditoria_credito_check_doc_pv(v_pv_id) into v_success, v_error_msg;
      if coalesce(v_success, 0) = 0 then
         raise exception '%', v_error_msg;
      end if;

   end loop;

   close c_pendiente;

exception
   when others then

      raise exception 'Ha ocurrido un error al actualizar el pendiente del pedido de venta. sp_doc_pedido_vta_devolucion_set_pendiente. %. %.',
                      sqlstate, sqlerrm;

end;
$BODY$
  language plpgsql volatile
  cost 100;
alter function sp_doc_pedido_vta_devolucion_set_pendiente(integer)
  owner to postgres;