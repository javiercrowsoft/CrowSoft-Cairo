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
-- Function: sp_doc_orden_pago_set_pendiente()

-- drop function sp_doc_orden_pago_set_pendiente(integer);

create or replace function sp_doc_orden_pago_set_pendiente
(
  in p_opg_id integer
)
  returns void as
$BODY$
declare
   v_aplicado decimal(18,6);
begin

   SET TRANSACTION READ WRITE;

   select sum(fcopg_importe)
     into v_aplicado
   from FacturaCompraOrdenPago
   where opg_id = p_opg_id;

   v_aplicado := round(coalesce(v_aplicado, 0), 2);

   update OrdenPago set opg_pendiente = round(opg_total - v_aplicado, 2) where opg_id = p_opg_id;

   return;

exception
   when others then

      raise exception 'Ha ocurrido un error al actualizar el pendiente de la Orden de Pago. sp_doc_orden_pago_set_pendiente. %. %.',
                      sqlstate, sqlerrm;

end;
$BODY$
  language plpgsql volatile
  cost 100;
alter function sp_doc_orden_pago_set_pendiente(integer)
  owner to postgres;