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
-- Function: sp_doc_factura_venta_save_nro_serie()

-- drop function sp_doc_factura_venta_save_nro_serie(integer);

create or replace function sp_doc_factura_venta_save_nro_serie
(
  in p_fvTMP_id integer,
  in p_fvi_id integer,
  in p_st_id integer,
  in p_fvi_cantidad integer,
  in p_fvi_descrip varchar,
  in p_pr_id integer,
  in p_depl_id_origen integer,
  in p_depl_id_destino integer,
  in p_stik_id integer,
  out p_sti_orden integer
)
  returns integer as
$BODY$
declare
   v_prns_descrip varchar(255);
   v_prns_fechavto date;
   v_prns_id integer;
   v_stl_id integer;
   v_n integer;
begin

   v_n := 1;

   while v_n <= p_fvi_cantidad
   loop

      select *
        into v_prns_id,
             v_prns_descrip,
             v_prns_fechavto
      from ( select prns_id,
                    prns_descrip,
                    prns_fechavto
             from FacturaVentaItemSerieTMP
             where fvi_id = p_fvi_id
               and ( ( pr_id_item = p_pr_id ) or ( p_pr_id = pr_id and pr_id_item is null ) )
               and fvTMP_id = p_fvTMP_id
             order by fvis_orden asc )
      limit 1;

      -- actualizo el numero de serie
      --
      update ProductoNumeroSerie
         set prns_descrip = v_prns_descrip,
             prns_fechavto = v_prns_fechavto
      where prns_id = v_prns_id;

      v_stl_id := null;

      select stl_id
        into v_stl_id
      from ProductoNumeroSerie
      where prns_id = v_prns_id;

      select sp_doc_factura_venta_stock_item_save(
                                        p_fvi_id,
                                        p_st_id,
                                        1,
                                        p_fvi_descrip,
                                        p_pr_id,
                                        p_depl_id_origen,
                                        p_depl_id_destino,
                                        v_prns_id,
                                        p_stik_id,
                                        v_stl_id) into p_sti_orden;

      update FacturaVentaItemSerieTMP
         set fvis_orden = fvis_orden + 10000
      where prns_id = v_prns_id
        and fvTMP_id = p_fvTMP_id;

      v_n := v_n + 1;

   end loop;

exception
   when others then

      raise exception 'Ha ocurrido un error al grabar el item de stock del Factura de venta. sp_doc_factura_venta_save_nro_serie.%. %.',
                      sqlstate, sqlerrm;

end;
$BODY$
  language plpgsql volatile
  cost 100;
alter function sp_doc_factura_venta_save_nro_serie(integer)
  owner to postgres;