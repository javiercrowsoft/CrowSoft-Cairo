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
-- Function: sp_doc_fac_cpra_orden_set_pendiente()

-- drop function sp_doc_fac_cpra_orden_set_pendiente(integer);

create or replace
function sp_doc_fac_cpra_orden_set_pendiente
(
  in p_fc_id integer
)
  returns void as
$BODY$
declare
   v_error_msg varchar(5000);
   v_success integer;
   v_oc_id integer;
begin

   for v_oc_id in
        select distinct oc_id
        from OrdenFacturaCompra ocfc
        join FacturaCompraItem fci
          on ocfc.fci_id = fci.fci_id
        join OrdenCompraItem oci
          on ocfc.oci_id = oci.oci_id
        where fc_id = p_fc_id
        union
        select oc_id
        from tt_OrdenCompraFac
   loop

      -- actualizo la deuda de la factura
      --
      perform sp_doc_orden_compra_set_pendiente(v_oc_id);

      -- estado
      --
      perform sp_doc_orden_compra_set_credito(v_oc_id);

      perform sp_doc_orden_compra_set_estado(v_oc_id);

      -- validaciones
      --
      v_success := 0;
      v_error_msg := '';

      -- estado
      --

      select * from sp_auditoria_estado_check_doc_oc(v_oc_id) into v_success, v_error_msg;
      if coalesce(v_success, 0) = 0 then
         raise exception '%', v_error_msg;
      end if;

   end loop;

exception
   when others then

   raise exception 'Ha ocurrido un error al actualizar el pendiente de la orden de compra. sp_DocFacCpraOrden_set_pendienteente. %. %.',
                   sqlstate, sqlerrm;

end;
$BODY$
  language plpgsql volatile
  cost 100;
alter function sp_doc_fac_cpra_orden_set_pendiente(integer)
  owner to postgres;