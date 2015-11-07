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
-- Function: sp_doc_fac_vta_pack_set_pendiente()

-- drop function sp_doc_fac_vta_pack_set_pendiente(integer);

/*
          select * from facturaventa;
          select sp_doc_fac_vta_pack_set_pendiente(1);
*/

create or replace function sp_doc_fac_vta_pack_set_pendiente
(
  in p_fv_id integer
)
  returns void as
$BODY$
declare
   v_error_msg varchar(5000);
   v_success integer;
   v_pklst_id integer;
begin

   for v_pklst_id in
        select distinct pklst_id
        from PackingListFacturaVenta pklstfv
        join FacturaVentaItem fvi
          on pklstfv.fvi_id = fvi.fvi_id
        join PackingListItem pklsti
          on pklstfv.pklsti_id = pklsti.pklsti_id
         where fv_id = p_fv_id
        union
        select pklst_id
        from tt_PackingListFac
   loop

      -- actualizo la deuda de la factura
      --
      perform sp_doc_packing_list_set_pendiente(v_pklst_id);

      -- estado
      --
      perform sp_doc_packing_list_set_credito(v_pklst_id);

      perform sp_doc_packing_list_set_estado(v_pklst_id);

   end loop;

exception
   when others then

   raise exception 'Ha ocurrido un error al actualizar el pendiente del packing list. sp_doc_fac_vta_pack_set_pendiente. %. %.',
                   sqlstate, sqlerrm;

end;
$BODY$
  language plpgsql volatile
  cost 100;
alter function sp_doc_fac_vta_pack_set_pendiente(integer)
  owner to postgres;