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
-- Function: sp_doc_pedido_venta_set_credito()

-- drop function sp_doc_pedido_venta_set_credito(integer, integer);

create or replace function sp_doc_pedido_venta_set_credito
(
  in p_pv_id integer,
  in p_borrar integer default 0
)
  returns void as
$BODY$
declare
   v_pendiente decimal(18,6);
   v_cli_id integer;
   v_doct_id integer;
   v_emp_id integer;
   v_cotizacion decimal(18,6);
   v_mon_id integer;
   v_fecha date;
   v_desc1 decimal(18,6);
   v_desc2 decimal(18,6);

   v_doct_pedidoVenta integer := 5;
   
   v_old_cli_ids integer[];
   i integer;
begin

   -- si no hay documento adios
   --
   if p_pv_id = 0 then
      return;
   end if;

   SET TRANSACTION READ WRITE;

   select pv.cli_id,
          round(pv.pv_pendiente, 2),
          pv.doct_id,
          doc.emp_id,
          doc.mon_id,
          pv.pv_descuento1,
          pv.pv_descuento2
     into v_cli_id,
          v_pendiente,
          v_doct_id,
          v_emp_id,
          v_mon_id,
          v_desc1,
          v_desc2
   from PedidoVenta pv
   join Documento doc
     on pv.doc_id = doc.doc_id
   where pv.pv_id = p_pv_id;

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


   -- borrar referencias a este documento por otro cliente
   --
   -- siempre borro cualquier mencion a este documento en el cache de cualquier
   -- cliente que no sea el indicado por el documento
   --
   if exists ( select cli_id
               from ClienteCacheCredito
               where cli_id <> v_cli_id
                 and doct_id = v_doct_PedidoVenta
                 and id = p_pv_id ) then

      select into v_old_cli_ids cli_id
      from ClienteCacheCredito
      where cli_id <> v_cli_id
        and doct_id = v_doct_PedidoVenta
        and id = p_pv_id;

      delete from ClienteCacheCredito
      where cli_id <> v_cli_id
        and doct_id = v_doct_PedidoVenta
        and id = p_pv_id;

      for i in 1 .. array_upper(v_old_cli_ids, 1)
      loop

         perform sp_cliente_update_pedido_credito(v_old_cli_ids[i], v_emp_id);

      end loop;

   end if;

   -- borrar
   --
   if p_borrar <> 0 then

      delete from ClienteCacheCredito
      where cli_id = v_cli_id
        and doct_id = v_doct_pedidoVenta
        and id = p_pv_id;

   -- insert - update
   --
   else

      if v_doct_id = 22 then /* devolucion */
         v_pendiente := -v_pendiente;
      end if;

      if exists ( select id
                  from ClienteCacheCredito
                  where cli_id = v_cli_id
                    and doct_id = v_doct_pedidoVenta
                    and id = p_pv_id ) then

         if abs(v_pendiente) >= 0.01 then

            update ClienteCacheCredito
               set clicc_importe = v_pendiente
            where cli_id = v_cli_id
              and doct_id = v_doct_pedidoVenta
              and id = p_pv_id;


         -- si no hay nada pendiente lo saco del cache
         --
         else

            delete from ClienteCacheCredito
            where cli_id = v_cli_id
              and doct_id = v_doct_pedidoVenta
              and id = p_pv_id;

         end if;

      else

         -- solo si hay algo pendiente
         --
         if abs(v_pendiente) >= 0.01 then

            insert into ClienteCacheCredito( cli_id, doct_id, id, clicc_importe, emp_id )
            values ( v_cli_id, v_doct_pedidoVenta, p_pv_id, v_pendiente, v_emp_id );

         end if;

      end if;

   end if;

   -- deuda en cache
   --

   -- actualizo la deuda en la tabla cliente
   --
   perform sp_cliente_update_pedido_credito(v_cli_id, v_emp_id);

end;
$BODY$
  language plpgsql volatile
  cost 100;
alter function sp_doc_pedido_venta_set_credito(integer, integer)
  owner to postgres;