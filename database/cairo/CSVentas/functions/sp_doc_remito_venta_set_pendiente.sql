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
-- Function: sp_doc_remito_venta_set_pendiente()

-- drop function sp_doc_remito_venta_set_pendiente(integer);

create or replace function sp_doc_remito_venta_set_pendiente
(
  in p_rv_id integer
)
  returns void as
$BODY$
declare
   v_rv_pendiente decimal(18,6);
   v_success integer;
   v_error_msg varchar(5000);
begin

   SET TRANSACTION READ WRITE;

   perform sp_doc_remito_vta_set_item_pendiente(p_rv_id);

   select sum(rvi_pendientefac * (rvi_importe / rvi_cantidad))
     into v_rv_pendiente
   from RemitoVentaItem
   where rv_id = p_rv_id;

   v_rv_pendiente := coalesce(v_rv_pendiente, 0);

   update RemitoVenta
      set rv_pendiente = round(v_rv_pendiente, 2)
   where rv_id = p_rv_id;

   v_success := 0;
   v_error_msg := '';

   select * from sp_doc_remito_vta_set_pendiente_cliente(p_rv_id) into v_success, v_error_msg;

   -- si el documento no es valido
   --
   if coalesce(v_success, 0) = 0 then

      raise exception '%', v_error_msg;

   end if;

exception
   when others then

   raise exception 'Ha ocurrido un error al actualizar el pendiente del remito de venta. sp_doc_remito_venta_set_pendiente. %. %.',
                   sqlstate, sqlerrm;

end;
$BODY$
  language plpgsql volatile
  cost 100;
alter function sp_doc_remito_venta_set_pendiente(integer)
  owner to postgres;