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
-- Function: sp_doc_orden_pago_set_credito()

-- drop function sp_doc_orden_pago_set_credito(integer, integer);

/*
          select * from ordenpago;
          select * from sp_doc_orden_pago_set_credito(3,1);
*/

create or replace function sp_doc_orden_pago_set_credito
(
  in p_opg_id integer,
  in p_borrar integer default 0
)
  returns void as
$BODY$
declare
   v_pendiente decimal(18,6);
   v_prov_id integer;
   v_emp_id integer;

   v_doct_orden_pago integer := 16;

   v_old_prov_ids integer[];
   i integer;
begin

   -- Si no hay documento adios
   --
   if p_opg_id = 0 then
      return;
   end if;

   SET TRANSACTION READ WRITE;

   -- Datos del documento
   --
   select round(opg_pendiente, 2),
          prov_id,
          emp_id
     into v_pendiente,
          v_prov_id,
          v_emp_id
   from OrdenPago opg
   where opg_id = p_opg_id;

   -- Borrar referencias a este documento por otro proveedor
   --
   
   -- Siempre borro cualquier mencion a este documento en el cache de cualquier
   -- proveedor que no sea el indicado por el documento
   --
   if exists ( select prov_id
               from ProveedorCacheCredito
               where prov_id <> v_prov_id
                 and doct_id = v_doct_orden_pago
                 and id = p_opg_id ) then

        select into v_old_prov_ids prov_id
        from ProveedorCacheCredito
        where prov_id <> v_prov_id
         and doct_id = v_doct_orden_pago
         and id = p_opg_id;

        delete from ProveedorCacheCredito
        where prov_id <> v_prov_id
          and doct_id = v_doct_orden_pago
          and id = p_opg_id;

        for i in 1 .. array_upper(v_old_prov_ids, 1)
        loop

            perform sp_proveedor_update_credito(v_old_prov_ids[i], v_emp_id);

        end loop;

   end if;

   -- Borrar
   --
   if p_borrar <> 0 then

      delete from ProveedorCacheCredito
      where prov_id = v_prov_id
        and doct_id = v_doct_orden_pago
        and id = p_opg_id;

   -- Insert - Update
   --
   else

      if exists ( select id
                  from ProveedorCacheCredito
                  where prov_id = v_prov_id
                    and doct_id = v_doct_orden_pago
                    and id = p_opg_id ) then

         if abs(v_pendiente) >= 0.01 then

            update ProveedorCacheCredito
               set provcc_importe = v_pendiente
            where prov_id = v_prov_id
              and doct_id = v_doct_orden_pago
              and id = p_opg_id;

         -- Si no hay nada pendiente lo saco del cache
         else

            delete from ProveedorCacheCredito
            where prov_id = v_prov_id
              and doct_id = v_doct_orden_pago
              and id = p_opg_id;

         end if;

      else
         -- Solo si hay algo pendiente
         if abs(v_pendiente) >= 0.01 then

            insert into ProveedorCacheCredito ( prov_id, doct_id, id, provcc_importe, emp_id )
                                       values ( v_prov_id, v_doct_orden_pago, p_opg_id, v_pendiente, v_emp_id );

         end if;

      end if;

   end if;

   -- Actualizo la deuda en la tabla Proveedor
   --
   perform sp_proveedor_update_credito(v_prov_id, v_emp_id);

   return;

exception
    when others then
        raise exception 'Ha ocurrido un error al actualizar el estado de la orden de pago. sp_doc_orden_pago_set_credito. %. %.',
                            sqlstate, sqlerrm;

end;
$BODY$
  language plpgsql volatile
  cost 100;
alter function sp_doc_orden_pago_set_credito(integer, integer)
  owner to postgres;