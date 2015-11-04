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
-- Function: sp_doc_factura_venta_save_item_kit()

-- drop function sp_doc_factura_venta_save_item_kit(integer, integer, integer);

create or replace function sp_doc_factura_venta_save_item_kit
(
  in p_fvTMP_id integer,
  in p_fvi_id integer,
  in p_st_id integer,
  in p_fvi_cantidad integer,
  in p_fvi_descrip varchar,
  in p_pr_id integer,
  in p_depl_id_origen integer,
  in p_depl_id_destino integer,
  in p_stl_id integer,
  out p_sti_orden integer
)
  returns integer as
$BODY$
declare
   v_stik_orden smallint;
   v_stik_llevanroserie integer;
   v_stik_id integer;
   v_pr_id integer;
   v_cantidad decimal(18,6);
   v_bLlevaNroSerie smallint;
begin

   delete from tt_kit_item_serie;

   -- obtengo los componentes del
   --
   perform sp_stock_producto_get_kit_info(p_pr_id, 0);

   select sp_dbGetNewId('StockItemKit', 'stik_id') into v_stik_id;

   if exists ( select *
               from tt_kit_item_serie s
               join producto p
                 on s.pr_id = p.pr_id
               where p.pr_llevanroserie <> 0 ) then

      v_stik_llevanroserie := 1;

   else

      v_stik_llevanroserie := 0;

   end if;

   insert into StockItemKit( stik_id, stik_cantidad, pr_id, st_id, stik_llevanroserie )
   values ( v_stik_id, p_fvi_cantidad, p_pr_id, p_st_id, v_stik_llevanroserie );

   for v_pr_id,v_cantidad in
        select pr_id,
               cantidad
        from tt_kit_item_serie
   loop

      v_cantidad := v_cantidad * p_fvi_cantidad;

      select pr_llevanroserie
        into v_bLlevaNroSerie
      from Producto
      where pr_id = v_pr_id;

      if v_bLlevaNroSerie <> 0 then

         select sp_doc_factura_venta_save_nro_serie(
                                           p_fvTMP_id,
                                           p_fvi_id,
                                           p_st_id,
                                           v_cantidad,
                                           p_fvi_descrip,
                                           v_pr_id,
                                           p_depl_id_origen,
                                           p_depl_id_destino,
                                           v_stik_id) into p_sti_orden;
      else

         select sp_doc_factura_venta_stock_item_save(
                                       0,
                                       p_st_id,
                                       v_cantidad,
                                       p_fvi_descrip,
                                       v_pr_id,
                                       p_depl_id_origen,
                                       p_depl_id_destino,
                                       null,
                                       v_stik_id,
                                       p_stl_id) into p_sti_orden;

      end if;

   end loop;

exception
   when others then

      raise exception 'Ha ocurrido un error al grabar el item de stock de la factura de venta. sp_doc_factura_venta_save_item_kit.%. %.',
                      sqlstate, sqlerrm;

end;
$BODY$
  language plpgsql volatile
  cost 100;
alter function sp_doc_factura_venta_stock_item_save(integer, integer, integer, varchar, integer, integer, integer, integer, integer, integer)
  owner to postgres;;