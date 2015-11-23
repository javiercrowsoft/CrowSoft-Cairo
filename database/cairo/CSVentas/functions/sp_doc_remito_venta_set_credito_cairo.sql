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
-- Function: sp_doc_remito_venta_set_credito()

-- drop function sp_doc_remito_venta_set_credito(integer, integer);

create or replace function sp_doc_remito_venta_set_credito_cairo
(
  in p_rv_id integer,
  in p_borrar integer default 0
)
  returns void as
$BODY$
declare
   v_pendiente decimal(18,6);
   v_doct_remitoventa integer := 3;
   v_cli_id integer;
   v_doct_id integer;
   v_emp_id integer;
   v_desc1 decimal(18,6);
   v_desc2 decimal(18,6);

   v_old_cli_ids integer[];
   i integer;
begin

   -- si no hay documento adios
   --
   if p_rv_id = 0 then
      return;
   end if;

   SET TRANSACTION READ WRITE;

   select rv.cli_id,
          case
             when rv.rv_cotizacion > 0 then round(rv.rv_pendiente, 2) * rv.rv_cotizacion
             else round(rv.rv_pendiente, 2)
          end,
          rv.doct_id,
          doc.emp_id,
          rv.rv_descuento1,
          rv.rv_descuento2
     into v_cli_id,
          v_pendiente,
          v_doct_id,
          v_emp_id,
          v_desc1,
          v_desc2
   from RemitoVenta rv
   join Documento doc
     on rv.doc_id = doc.doc_id
   where rv.rv_id = p_rv_id;

   v_pendiente := coalesce(v_pendiente, 0) - (coalesce(v_pendiente, 0) * v_desc1 / 100);
   v_pendiente := coalesce(v_pendiente, 0) - (coalesce(v_pendiente, 0) * v_desc2 / 100);

   -- borrar referencias a este documento por otro cliente
   --
   -- siempre borro cualquier mencion a este documento en el cache de cualquier
   -- cliente que no sea el indicado por el documento
   --
   if exists ( select cli_id
               from ClienteCacheCredito
               where cli_id <> v_cli_id
                 and doct_id = v_doct_remitoVenta
                 and id = p_rv_id ) then

      select into v_old_cli_ids cli_id
      from ClienteCacheCredito
      where cli_id <> v_cli_id
        and doct_id = v_doct_remitoVenta
        and id = p_rv_id;

      delete from ClienteCacheCredito
      where cli_id <> v_cli_id
        and doct_id = v_doct_remitoVenta
        and id = p_rv_id;

      for i in 1 .. array_upper(v_old_cli_ids, 1)
      loop

         perform sp_cliente_update_remito_credito(v_old_cli_ids[i], v_emp_id);

      end loop;

   end if;

   -- borrar
   --
   if p_borrar <> 0 then

      delete from ClienteCacheCredito
      where cli_id = v_cli_id
        and doct_id = v_doct_remitoventa
        and id = p_rv_id;

   -- insert - update
   --
   else

      if v_doct_id = 24 then /* devolucion */
         v_pendiente := -v_pendiente;
      end if;

      if exists ( select id
                  from ClienteCacheCredito
                  where cli_id = v_cli_id
                    and doct_id = v_doct_remitoventa
                    and id = p_rv_id ) then

         if abs(v_pendiente) >= 0.01 then

            update ClienteCacheCredito
               set clicc_importe = v_pendiente
            where cli_id = v_cli_id
              and doct_id = v_doct_remitoventa
              and id = p_rv_id;


         -- si no hay nada pendiente lo saco del cache
         --
         else

            delete from ClienteCacheCredito
            where cli_id = v_cli_id
              and doct_id = v_doct_remitoventa
              and id = p_rv_id;

         end if;

      else

         -- solo si hay algo pendiente
         --
         if abs(v_pendiente) >= 0.01 then

            insert into ClienteCacheCredito( cli_id, doct_id, id, clicc_importe, emp_id )
            values ( v_cli_id, v_doct_remitoventa, p_rv_id, v_pendiente, v_emp_id );

         end if;

      end if;

   end if;

   -- deuda en cache
   --

   -- actualizo la deuda en la tabla Cliente
   --
   perform sp_cliente_update_remito_credito(v_cli_id, v_emp_id);

exception
   when others then

      raise exception 'Ha ocurrido un error al actualizar el estado del remito de venta. sp_doc_remito_venta_set_credito_cairo. %. %.',
                      sqlstate, sqlerrm;

end;
$BODY$
  language plpgsql volatile
  cost 100;
alter function sp_doc_remito_venta_set_credito_cairo(integer, integer)
  owner to postgres;