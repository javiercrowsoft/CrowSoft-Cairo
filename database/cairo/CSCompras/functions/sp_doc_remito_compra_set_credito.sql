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
-- Function: sp_doc_remito_compra_set_credito()

-- drop function sp_doc_remito_compra_set_credito(integer, integer);

create or replace function sp_doc_remito_compra_set_credito
(
  in p_rc_id integer,
  in p_borrar integer default 0
)
  returns void as
$BODY$
declare
   v_pendiente decimal(18,6);
   v_prov_id integer;
   v_doct_id integer;
   v_emp_id integer;
   v_desc1 decimal(18,6);
   v_desc2 decimal(18,6);
   v_doct_remitocompra integer := 4;

   v_old_prov_ids integer[];
   i integer;
begin

   -- si no hay documento adios
   --
   if p_rc_id = 0 then
      return;
   end if;

   select rc.prov_id,
          case
             when rc.rc_cotizacion > 0 then round(rc.rc_pendiente, 2) * rc.rc_cotizacion
             else round(rc.rc_pendiente, 2)
          end,
          rc.doct_id,
          doc.emp_id,
          rc.rc_descuento1,
          rc.rc_descuento2
     into v_prov_id,
          v_pendiente,
          v_doct_id,
          v_emp_id,
          v_desc1,
          v_desc2
   from RemitoCompra rc
   join Documento doc
     on rc.doc_id = doc.doc_id
   where rc.rc_id = p_rc_id;

   v_pendiente := coalesce(v_pendiente, 0) - (coalesce(v_pendiente, 0) * v_desc1 / 100);
   v_pendiente := coalesce(v_pendiente, 0) - (coalesce(v_pendiente, 0) * v_desc2 / 100);

   -- borrar referencias a este documento por otro cliente
   --
   -- siempre borro cualquier mencion a este documento en el cache de cualquier
   -- proveedor que no sea el indicado por el documento
   --
   if exists ( select prov_id
               from ProveedorCacheCredito
               where prov_id <> v_prov_id
                 and doct_id = v_doct_remitocompra
                 and id = p_rc_id ) then

      select into v_old_prov_ids prov_id
      from ProveedorCacheCredito
      where prov_id <> v_prov_id
        and doct_id = v_doct_remitocompra
        and id = p_rc_id;

      delete from ProveedorCacheCredito
      where prov_id <> v_prov_id
        and doct_id = v_doct_remitocompra
        and id = p_rc_id;

      for i in 1 .. array_upper(v_old_prov_ids, 1)
      loop

         perform sp_proveedor_update_remito_credito(v_old_prov_ids[i], v_emp_id);

      end loop;

   end if;

   -- borrar
   --
   if p_borrar <> 0 then

      delete from ProveedorCacheCredito
      where prov_id = v_prov_id
        and doct_id = v_doct_remitocompra
        and id = p_rc_id;

   -- insert - update
   --
   else

      if v_doct_id = 25 then /* devolucion */
         v_pendiente := -v_pendiente;
      end if;

      if exists ( select id
                  from ProveedorCacheCredito
                  where prov_id = v_prov_id
                    and doct_id = v_doct_remitocompra
                    and id = p_rc_id ) then

         if abs(v_pendiente) >= 0.01 then

            update ProveedorCacheCredito
               set provcc_importe = v_pendiente
            where prov_id = v_prov_id
              and doct_id = v_doct_remitocompra
              and id = p_rc_id;

         -- si no hay nada pendiente lo saco del cache
         --
         else

            delete from ProveedorCacheCredito
            where prov_id = v_prov_id
              and doct_id = v_doct_remitocompra
              and id = p_rc_id;

         end if;

      else

         -- solo si hay algo pendiente
         --
         if abs(v_pendiente) >= 0.01 then

            insert into ProveedorCacheCredito( prov_id, doct_id, id, provcc_importe, emp_id )
            values ( v_prov_id, v_doct_remitocompra, p_rc_id, v_pendiente, v_emp_id );

         end if;

      end if;

   end if;

   -- deuda en cache
   --

   -- actualizo la deuda en la tabla cliente
   --
   perform sp_proveedor_update_remito_credito(v_prov_id, v_emp_id);

exception
   when others then

      raise exception 'Ha ocurrido un error al actualizar el estado del remito de compra. sp_doc_remito_compra_set_credito. %. %.',
                      sqlstate, sqlerrm;

end;
$BODY$
  language plpgsql volatile
  cost 100;
alter function sp_doc_remito_compra_set_credito(integer, integer)
  owner to postgres;