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
-- Function: sp_doc_remito_vta_set_item_pendiente()

-- drop function sp_doc_remito_vta_set_item_pendiente(integer);

create or replace function sp_doc_remito_vta_set_item_pendiente
(
  in p_rv_id integer
)
  returns void as
$BODY$
declare
   v_rvi_id integer;
   v_est_id integer;
   v_doct_id integer;
   v_rv_desde_os smallint;
   v_pr_esrepuesto smallint;

   v_aplicadoPedido decimal(18,6);
   v_aplicadoRemito decimal(18,6);
begin

   select rv.doct_id,
          rv.est_id,
          doc.doc_rv_desde_os
     into v_doct_id,
          v_est_id,
          v_rv_desde_os
   from RemitoVenta rv
   join Documento doc
     on rv.doc_id = doc.doc_id
   where rv.rv_id = p_rv_id;

   SET TRANSACTION READ WRITE;

   if v_est_id <> 7 then

      if v_rv_desde_os <> 0 then

         update RemitoVentaItem
            set rvi_pendiente = 0
         where rv_id = p_rv_id
           and exists( select 1
                       from Producto
                       where pr_id = RemitoVentaItem.pr_id
                         and pr_esrepuesto <> 0
                     );

      end if;

      for v_rvi_id,v_pr_esrepuesto in
           select rvi.rvi_id,
                  pr.pr_esrepuesto
           from RemitoVentaItem rvi
           join Producto pr
             on rvi.pr_id = pr.pr_id
           where rvi.rv_id = p_rv_id
      loop

            if ( v_pr_esrepuesto = 0 or v_rv_desde_os = 0 ) then

               select coalesce(sum(pvrv_cantidad), 0)
                 into v_aplicadoPedido
               from PedidoRemitoVenta
               where rvi_id = v_rvi_id;

               select coalesce(v_aplicadoPedido, 0) + coalesce(sum(osrv_cantidad), 0)
                 into v_aplicadoPedido
               from OrdenRemitoVenta
               where rvi_id = v_rvi_id;

            end if;

            select coalesce(sum(rvfv_cantidad), 0)
              into v_aplicadoRemito
            from RemitoFacturaVenta
            where rvi_id = v_rvi_id;

            if v_doct_id = 3 then

               select coalesce(v_aplicadoRemito, 0) + coalesce(sum(rvdv_cantidad), 0)
                 into v_aplicadoRemito
               from RemitoDevolucionVenta
               where rvi_id_remito = v_rvi_id;

            else

               select coalesce(v_aplicadoRemito, 0) + coalesce(sum(rvdv_cantidad), 0)
                 into v_aplicadoRemito
               from RemitoDevolucionVenta
               where rvi_id_devolucion = v_rvi_id;

            end if;

            v_aplicadoPedido := coalesce(v_aplicadoPedido, 0);
            v_aplicadoRemito := coalesce(v_aplicadoRemito, 0);

            if ( v_pr_esrepuesto = 0 or v_rv_desde_os = 0 ) then

               update RemitoVentaItem
                  set rvi_pendiente = rvi_cantidad - v_aplicadoPedido,
                      rvi_pendientefac = rvi_cantidadaremitir - v_aplicadoRemito
               where rvi_id = v_rvi_id;

            else

               update RemitoVentaItem
                  set rvi_pendientefac = rvi_cantidadaremitir - v_aplicadoRemito
               where rvi_id = v_rvi_id;

            end if;

      end loop;

   else

         update RemitoVentaItem
            set rvi_pendiente = 0,
                rvi_pendientefac = 0
         where rv_id = p_rv_id;

   end if;

exception
   when others then

   raise exception 'Ha ocurrido un error al actualizar el pendiente del remito de venta. sp_doc_remito_vta_set_item_pendiente. %. %.',
                   sqlstate, sqlerrm;

end;
$BODY$
  language plpgsql volatile
  cost 100;
alter function sp_doc_remito_vta_set_item_pendiente(integer)
  owner to postgres;