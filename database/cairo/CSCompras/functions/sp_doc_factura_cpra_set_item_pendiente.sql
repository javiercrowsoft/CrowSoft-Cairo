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
-- Function: sp_doc_factura_cpra_set_item_pendiente()

-- drop function sp_doc_factura_cpra_set_item_pendiente(integer);

create or replace function sp_doc_factura_cpra_set_item_pendiente
(
  in p_fc_id integer
)
  returns void as
$BODY$
declare
   v_fci_id integer;
   v_est_id integer;

   v_aplicadoorden decimal(18,6);
   v_aplicadoremito decimal(18,6);
begin

   select est_id
     into v_est_id
   from FacturaCompra
   where fc_id = p_fc_id;

   SET TRANSACTION READ WRITE;

   if v_est_id <> 7 then

      for v_fci_id in
         select fci_id
         from FacturaCompraItem
         where fc_id = p_fc_id
      loop

         select coalesce(sum(ocfc_cantidad), 0)
           into v_aplicadoorden
         from OrdenFacturaCompra
         where fci_id = v_fci_id;

         select coalesce(sum(rcfc_cantidad), 0)
           into v_aplicadoremito
         from RemitoFacturaCompra
         where fci_id = v_fci_id;

         v_aplicadoorden := coalesce(v_aplicadoorden, 0);
         v_aplicadoremito := coalesce(v_aplicadoremito, 0);

         update FacturaCompraItem
            set fci_pendiente = fci_cantidadaremitir - v_aplicadoorden - v_aplicadoremito
         where fci_id = v_fci_id;

      end loop;

   else

      update FacturaCompraItem
         set fci_pendiente = 0
      where fc_id = p_fc_id;

   end if;

exception
   when others then

   raise exception 'Ha ocurrido un error al actualizar el pendiente de la factura de compra. sp_doc_factura_cpra_set_item_pendiente. %. %.',
                   sqlstate, sqlerrm;

end;
$BODY$
  language plpgsql volatile
  cost 100;
alter function sp_doc_factura_cpra_set_item_pendiente(integer)
  owner to postgres;