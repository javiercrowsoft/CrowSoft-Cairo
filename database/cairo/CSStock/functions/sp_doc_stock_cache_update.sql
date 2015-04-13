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
-- Function: sp_doc_stock_cache_update()

-- drop function sp_doc_stock_cache_update(integer, integer, integer);

create or replace
function sp_doc_stock_cache_update
(
  in p_st_id integer,
  in p_restar integer,
  in p_not_update_prns integer default 0,
  out p_message varchar,
  out p_success integer
)
  returns record as
$BODY$
begin

   if p_restar <> 0 then

      -- quito de stockcache lo que se movio con los items de este movimiento
      --
      update StockCache
         set stc_cantidad = stc_cantidad
                            - ( select sti_ingreso + sti_salida
                                from StockItem i
                                where i.st_id = p_st_id
                                  and StockCache.pr_id = i.pr_id
                                  and StockCache.depl_id = i.depl_id
                                  and coalesce(StockCache.prns_id, 0) = coalesce(i.prns_id, 0)
                                  and coalesce(StockCache.pr_id_kit, 0) = coalesce(i.pr_id_kit, 0)
                                  and coalesce(StockCache.stl_id, 0) = coalesce(i.stl_id, 0)
                              );

   else

      -- agrego a stockcache lo que se movio con los items de este movimiento
      --
      update StockCache
         set stc_cantidad = stc_cantidad
                            + ( select sti_ingreso - sti_salida
                                from StockItem i
                                where i.st_id = p_st_id
                                  and StockCache.pr_id = i.pr_id
                                  and StockCache.depl_id = i.depl_id
                                  and coalesce(StockCache.prns_id, 0) = coalesce(i.prns_id, 0)
                                  and coalesce(StockCache.pr_id_kit, 0) = coalesce(i.pr_id_kit, 0)
                                  and coalesce(StockCache.stl_id, 0) = coalesce(i.stl_id, 0)
                              );

   end if;

   if p_restar = 0 then

      select * from sp_doc_stock_validate(p_message) into p_success, p_st_id;

   else

      p_success := 1;

   end if;

   if p_not_update_prns = 0 then

      select sp_doc_stock_update_numero_serie(p_st_id) into p_restar;

   end if;

end;
$BODY$
  language plpgsql volatile
  cost 100;
alter function sp_doc_stock_cache_update(integer, integer, integer)
  owner to postgres;