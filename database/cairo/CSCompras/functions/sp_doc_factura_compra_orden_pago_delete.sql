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
-- Function: sp_doc_factura_compra_orden_pago_delete()

-- drop function sp_doc_factura_compra_orden_pago_delete(integer, integer, integer, integer);

create or replace function sp_doc_factura_compra_orden_pago_delete
(
 in p_fc_id integer,
 in p_emp_id integer,
 in p_us_id integer
)
 returns void as
$BODY$
declare
   v_cpg_tipo smallint;
   v_opg_id integer;
   v_emp_id integer;
begin

   select cpg.cpg_tipo, fc.opg_id into v_cpg_tipo, v_opg_id
   from FacturaCompra fc join CondicionPago cpg on fc.cpg_id = cpg.cpg_id
   where fc.fc_id = p_fc_id;

   /* Debito automatico o Fondo fijo */
   if v_cpg_tipo in ( 2,3 ) then

      begin

         delete from FacturaCompraOrdenPago where fc_id = p_fc_id;
         update FacturaCompra set opg_id = null where fc_id = p_fc_id;
         update OrdenPago set fc_id = null where opg_id = v_opg_id;

         select emp_id into v_emp_id from OrdenPago where opg_id = v_opg_id;

         perform sp_doc_orden_pago_delete(v_opg_id, v_emp_id, p_us_id);

      exception
         when others then
            raise exception 'Ha ocurrido un error al borrar la orden de pago asociada a la factura de compra. sp_doc_factura_compra_orden_pago_delete.',
                             sqlstate, sqlerrm;
      end;

   end if;

   return;

end;
$BODY$
 language plpgsql volatile
                  COST 100;
alter function sp_doc_factura_compra_orden_pago_delete(integer, integer, integer)
 owner to postgres;