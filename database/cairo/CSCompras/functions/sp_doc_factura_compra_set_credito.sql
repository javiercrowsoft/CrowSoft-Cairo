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
-- Function: sp_doc_factura_compra_set_credito()

-- drop function sp_doc_factura_compra_set_credito(integer, integer);

create or replace
function sp_doc_factura_compra_set_credito
(
  in p_fc_id integer,
  in p_borrar integer default 0
)
  returns void as
$BODY$
declare
   v_pendiente decimal(18,6);
   v_prov_id integer;
   v_doct_id integer;
   v_emp_id integer;

   v_doct_facturaCpra integer := 2;

   v_old_prov_ids integer[];
   i integer;
begin

   -- si no hay documento adios
   --
   if p_fc_id = 0 then
      return;
   end if;

   SET TRANSACTION READ WRITE;

   select fc.prov_id,
          fc.doct_id,
          doc.emp_id
     into v_prov_id,
          v_doct_id,
          v_emp_id
   from FacturaCompra fc
   join Documento doc
     on fc.doc_id = doc.doc_id
   where fc.fc_id = p_fc_id;

   -- borrar referencias a este documento por otro proveedor
   --

   -- siempre borro cualquier mencion a este documento en el cache de cualquier
   -- proveedor que no sea el indicado por el documento
   --
   if exists ( select prov_id
               from ProveedorCacheCredito
               where prov_id <> v_prov_id
                 and doct_id = v_doct_facturaCpra
                 and id = p_fc_id ) then

      select into v_old_prov_ids prov_id
      from ProveedorCacheCredito
      where prov_id <> v_prov_id
        and doct_id = v_doct_facturaCpra
        and id = p_fc_id;

      delete from ProveedorCacheCredito
      where prov_id <> v_prov_id
        and doct_id = v_doct_facturaCpra
        and id = p_fc_id;

      for i in 1 .. array_upper(v_old_prov_ids, 1)
      loop

         perform sp_proveedor_update_credito(v_old_prov_ids[i], v_emp_id);

      end loop;

   end if;

   -- borrar
   --
   if p_borrar <> 0 then

      delete from ProveedorCacheCredito
      where prov_id = v_prov_id
        and doct_id = v_doct_facturaCpra
        and id = p_fc_id;

   -- insert - update
   --
   else

      select sum(fcd_pendiente)
        into v_pendiente
      from FacturaCompraDeuda
      where fc_id = p_fc_id;

      v_pendiente := round(coalesce(v_pendiente, 0), 2);

      update FacturaCompra
         set fc_pendiente = v_pendiente
      where fc_id = p_fc_id;

      if v_doct_id = 8 then /* nota de credito */
         v_pendiente := -v_pendiente;
      end if;

      if exists ( select id
                  from ProveedorCacheCredito
                  where prov_id = v_prov_id
                    and doct_id = v_doct_facturaCpra
                    and id = p_fc_id ) then

         if abs(v_pendiente) >= 0.01 then

            update ProveedorCacheCredito
               set provcc_importe = v_pendiente
            where prov_id = v_prov_id
              and doct_id = v_doct_facturaCpra
              and id = p_fc_id;

         -- si no hay nada pendiente lo saco del cache
         --
         else

            delete from ProveedorCacheCredito
            where prov_id = v_prov_id
              and doct_id = v_doct_facturaCpra
              and id = p_fc_id;

         end if;

      else

         -- solo si hay algo pendiente
         --
         if abs(v_pendiente) >= 0.01 then

            insert into ProveedorCacheCredito( prov_id, doct_id, id, provcc_importe, emp_id )
              values ( v_prov_id, v_doct_facturaCpra, p_fc_id, v_pendiente, v_emp_id );

         end if;

      end if;

   end if;

   -- deuda en cache
   --

   -- actualizo la deuda en la tabla proveedor
   --
   perform sp_proveedor_update_credito(v_prov_id, v_emp_id);

exception
   when others then

   raise exception 'Ha ocurrido un error al actualizar el estado de la factura de Compra. sp_doc_factura_compra_set_credito. %. %.',
                   sqlstate, sqlerrm;

end;
$BODY$
  language plpgsql volatile
  cost 100;
alter function sp_doc_orden_compra_set_credito(integer, integer)
  owner to postgres;
