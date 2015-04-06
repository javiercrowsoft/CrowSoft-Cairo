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
-- Function: sp_doc_orden_compra_set_credito()

-- drop function sp_doc_orden_compra_set_credito(integer, integer);

create or replace
function sp_doc_orden_compra_set_credito
(
  in p_oc_id integer,
  in p_borrar integer default 0
)
  returns void as
$BODY$
declare
   v_pendiente decimal(18,6);
   v_prov_id integer;
   v_doct_id integer;
   v_emp_id integer;
   v_cotizacion decimal(18,6);
   v_mon_id integer;
   v_fecha date;
   v_desc1 decimal(18,6);
   v_desc2 decimal(18,6);

   v_doct_OrdenCompra integer := 35;

   v_deudaOrdenAnterior decimal(18,6);
   v_deudaOrden decimal(18,6);

   v_old_prov_ids integer[];
   i integer;
begin

   -- si no hay documento adios
   --
   if p_oc_id = 0 then
      return;
   end if;

   SET TRANSACTION READ WRITE;

   select oc.prov_id,
          round(oc.oc_pendiente, 2),
          oc.doct_id,
          doc.emp_id,
          doc.mon_id,
          oc.oc_descuento1,
          oc.oc_descuento2
     into v_prov_id,
          v_pendiente,
          v_doct_id,
          v_emp_id,
          v_mon_id,
          v_desc1,
          v_desc2
   from OrdenCompra oc
   join Documento doc
     on oc.doc_id = doc.doc_id
   where oc.oc_id = p_oc_id;

   v_fecha := CURRENT_TIMESTAMP;

   select sp_moneda_get_cotizacion(v_mon_id, v_fecha) into v_cotizacion;

   if not exists ( select *
                   from Moneda
                   where mon_id = v_mon_id
                     and mon_legal <> 0 ) then

      if v_cotizacion > 0 then
         v_pendiente := v_pendiente * v_cotizacion;
      end if;

   end if;

   v_pendiente := coalesce(v_pendiente, 0) - (coalesce(v_pendiente, 0) * v_desc1 / 100);
   v_pendiente := coalesce(v_pendiente, 0) - (coalesce(v_pendiente, 0) * v_desc2 / 100);


   -- borrar referencias a este documento por otro proveedor
   --

   -- siempre borro cualquier mencion a este documento en el cache de cualquier
   -- proveedor que no sea el indicado por el documento
   --
   if exists ( select prov_id
               from ProveedorCacheCredito
               where prov_id <> v_prov_id
                 and doct_id = v_doct_OrdenCompra
                 and id = p_oc_id ) then

      select into v_old_prov_ids prov_id
      from ProveedorCacheCredito
      where prov_id <> v_prov_id
        and doct_id = v_doct_OrdenCompra
        and id = p_oc_id;

      delete from ProveedorCacheCredito
      where prov_id <> v_prov_id
        and doct_id = v_doct_OrdenCompra
        and id = p_oc_id;

      for i in 1 .. array_upper(v_old_prov_ids, 1)
      loop

         perform sp_proveedor_update_orden_cpra_credito(v_old_prov_ids[i], v_emp_id);

      end loop;

   end if;

   -- borrar
   --
   if p_borrar <> 0 then

      delete from ProveedorCacheCredito
      where prov_id = v_prov_id
        and doct_id = v_doct_OrdenCompra
        and id = p_oc_id;

   -- insert - update
   --
   else

      if v_doct_id = 36 then /* cancelacion */
         v_pendiente := -v_pendiente;
      end if;

      if exists ( select id
                  from ProveedorCacheCredito
                  where prov_id = v_prov_id
                    and doct_id = v_doct_OrdenCompra
                    and id = p_oc_id ) then

         if abs(v_pendiente) >= 0.01 then

            update ProveedorCacheCredito
               set provcc_importe = v_pendiente
            where prov_id = v_prov_id
              and doct_id = v_doct_OrdenCompra
              and id = p_oc_id;

         -- si no hay nada pendiente lo saco del cache
         --
         else

            delete from ProveedorCacheCredito
            where prov_id = v_prov_id
              and doct_id = v_doct_OrdenCompra
              and id = p_oc_id;

         end if;

      else

         -- solo si hay algo pendiente
         --
         if abs(v_pendiente) >= 0.01 then

            insert into ProveedorCacheCredito( prov_id, doct_id, id, provcc_importe, emp_id )
            values ( v_prov_id, v_doct_OrdenCompra, p_oc_id, v_pendiente, v_emp_id );

         end if;

      end if;

   end if;

   -- deuda en cache
   --

   -- actualizo la deuda en la tabla proveedor
   --
   perform sp_proveedor_update_orden_cpra_credito(v_prov_id, v_emp_id);

   select sum(provcc_importe)
     into v_deudaOrden
   from ProveedorCacheCredito
   where doct_id = v_doct_OrdenCompra
     and prov_id = v_prov_id;

   select prov_deudaOrden
     into v_deudaOrdenAnterior
   from Proveedor
   where prov_id = v_prov_id;

   update Proveedor
      set prov_deudaOrden = coalesce(v_deudaOrden, 0),
          prov_deudaTotal = prov_deudaTotal - coalesce(v_deudaOrdenAnterior, 0) + coalesce(v_deudaOrden, 0)
   where prov_id = v_prov_id;

exception
   when others then

   raise exception 'Ha ocurrido un error al actualizar el estado de la orden de compra. sp_doc_orden_compra_set_credito. %. %.',
                   sqlstate, sqlerrm;

end;
$BODY$
  language plpgsql volatile
  cost 100;
alter function sp_doc_orden_compra_set_credito(integer, integer)
  owner to postgres;