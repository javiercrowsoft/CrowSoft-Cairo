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
-- Function: sp_doc_factura_venta_stock_item_save()

-- drop function sp_doc_factura_venta_stock_item_save(integer, integer, integer, varchar, integer, integer, integer, integer, integer, integer);

create or replace function sp_doc_factura_venta_stock_item_save
(
  in p_sti_grupo integer,
  in p_st_id integer,
  in p_fvi_cantidad integer,
  in p_fvi_descrip varchar,
  in p_pr_id integer,
  in p_depl_id_origen integer,
  in p_depl_id_destino integer,
  in p_prns_id integer,
  in p_stik_id integer,
  in p_stl_id integer,
  out p_sti_orden integer
)
  returns integer as
$BODY$
declare
   v_sti_id integer;
   v_pr_id_kit integer;
begin

   select sp_dbGetNewId('StockItem', 'sti_id') into v_sti_id;

   if p_stik_id is not null then

      select pr_id
        into v_pr_id_kit
      from StockItemKit
      where stik_id = p_stik_id;

   end if;

   insert into StockItem( st_id, sti_id, sti_orden, sti_ingreso, sti_salida, sti_descrip, sti_grupo, pr_id, depl_id,
                          prns_id, stik_id, pr_id_kit, stl_id )
   values ( p_st_id, v_sti_id, p_sti_orden, 0, p_fvi_cantidad, p_fvi_descrip, p_sti_grupo, p_pr_id, p_depl_id_origen,
            p_prns_id, p_stik_id, v_pr_id_kit, p_stl_id );

   p_sti_orden := p_sti_orden + 1;

   select sp_dbGetNewId('StockItem', 'sti_id') into v_sti_id;

   insert into StockItem( st_id, sti_id, sti_orden, sti_ingreso, sti_salida, sti_descrip, sti_grupo, pr_id, depl_id,
                          prns_id, stik_id, pr_id_kit, stl_id )
   values ( p_st_id, v_sti_id, p_sti_orden, p_fvi_cantidad, 0, p_fvi_descrip, p_sti_grupo, p_pr_id, p_depl_id_destino,
            p_prns_id, p_stik_id, v_pr_id_kit, p_stl_id );

   p_sti_orden := p_sti_orden + 1;

exception
   when others then

      raise exception 'Ha ocurrido un error al grabar el item de stock de la factura de venta. sp_doc_factura_venta_stock_item_save.%. %.',
                      sqlstate, sqlerrm;

end;
$BODY$
  language plpgsql volatile
  cost 100;
alter function sp_doc_factura_venta_stock_item_save(integer, integer, integer, varchar, integer, integer, integer, integer, integer, integer)
  owner to postgres;