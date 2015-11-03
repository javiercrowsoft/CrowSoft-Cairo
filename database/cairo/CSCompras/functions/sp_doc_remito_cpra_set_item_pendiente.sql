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
-- Function: sp_doc_remito_cpra_set_item_pendiente()

-- drop function sp_doc_remito_cpra_set_item_pendiente(integer);

create or replace function sp_doc_remito_cpra_set_item_pendiente
(
  in p_rc_id integer
)
  returns void as
$BODY$
declare
   v_rci_id integer;
   v_doct_id integer;
   v_est_id integer;
   v_aplicadoOrden decimal(18,6);
   v_aplicadoRemito decimal(18,6);
begin

   select doct_id,
          est_id
     into v_doct_id,
          v_est_id
   from RemitoCompra
   where rc_id = p_rc_id;

   SET TRANSACTION READ WRITE;

   if v_est_id <> 7 then

      for v_rci_id in
         select rci_id
         from RemitoCompraItem
         where rc_id = p_rc_id
      loop

         select coalesce(sum(ocrc_cantidad), 0)
           into v_aplicadoOrden
         from OrdenRemitoCompra
         where rci_id = v_rci_id;

         select coalesce(sum(rcfc_cantidad), 0)
           into v_aplicadoRemito
         from RemitoFacturaCompra
         where rci_id = v_rci_id;

         if v_doct_id = 4 then

            select coalesce(v_aplicadoRemito, 0) + coalesce(sum(rcdc_cantidad), 0)
              into v_aplicadoRemito
            from RemitoDevolucionCompra
            where rci_id_remito = v_rci_id;

         else

            select coalesce(v_aplicadoRemito, 0) + coalesce(sum(rcdc_cantidad), 0)
              into v_aplicadoRemito
            from RemitoDevolucionCompra
            where rci_id_devolucion = v_rci_id;

         end if;

         v_aplicadoOrden := coalesce(v_aplicadoOrden, 0);
         v_aplicadoRemito := coalesce(v_aplicadoRemito, 0);

         update RemitoCompraItem
            set rci_pendiente = rci_cantidad - v_aplicadoOrden,
                rci_pendientefac = rci_cantidadaremitir - v_aplicadoRemito
         where rci_id = v_rci_id;

      end loop;

   else

      update RemitoCompraItem
         set rci_pendiente = 0,
             rci_pendientefac = 0
      where rc_id = p_rc_id;

   end if;

exception
   when others then

      raise exception 'Ha ocurrido un error al actualizar el pendiente del remito de compra. sp_doc_remito_cpra_set_item_pendiente.%. %.',
                      sqlstate, sqlerrm;

end;
$BODY$
  language plpgsql volatile
  cost 100;
alter function sp_doc_remito_cpra_set_item_pendiente(integer)
  owner to postgres;