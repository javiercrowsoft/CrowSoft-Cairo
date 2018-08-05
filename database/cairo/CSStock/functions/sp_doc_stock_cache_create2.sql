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
-- Function: sp_doc_stock_cache_create2()

-- drop function sp_doc_stock_cache_create2(integer, integer);

/*
	select sp_doc_stock_cache_create2();
*/

create or replace function sp_doc_stock_cache_create2
(
  in p_pr_id integer default 0,
  in p_st_id integer default 0
)
  returns void as
$BODY$
declare
   v_error_msg varchar(5000);
begin

   v_error_msg := '';

   if p_st_id = 0 then

      delete from StockCache where pr_id = p_pr_id or p_pr_id = 0;

      insert into StockCache
        ( stc_cantidad, pr_id, depl_id, prns_id, pr_id_kit, stl_id )
        ( select sum(s.sti_ingreso) - sum(s.sti_salida),
                 s.pr_id,
                 s.depl_id,
                 s.prns_id,
                 coalesce(k.pr_id, s.pr_id_kit),
                 s.stl_id
          from StockItem S left join StockItemKit k on s.stik_id = k.stik_id
          where ( s.pr_id = p_pr_id or p_pr_id = 0 )
                  and ( s.depl_id not in ( -2,-3 )-- los depositos internos no importan
                )
          group by s.pr_id,s.depl_id,s.prns_id,coalesce(k.pr_id, s.pr_id_kit),s.stl_id );

   else

      delete from StockCache

      where exists ( select pr_id
                     from StockItem
                     where st_id = p_st_id
                       and pr_id = StockCache.pr_id );

      insert into StockCache
        ( stc_cantidad, pr_id, depl_id, prns_id, pr_id_kit, stl_id )
        ( select sum(s.sti_ingreso) - sum(s.sti_salida),
                 s.pr_id,
                 s.depl_id,
                 s.prns_id,
                 coalesce(k.pr_id, s.pr_id_kit),
                 s.stl_id
          from StockItem s left join StockItemKit k on s.stik_id = k.stik_id
          where exists ( select pr_id
                         from StockItem
                         where st_id = p_st_id
                           and pr_id = s.pr_id )
                           and ( s.depl_id not in ( -2,-3 )-- Los depositos internos no importan
                       )
          group by s.pr_id,s.depl_id,s.prns_id,coalesce(k.pr_id, s.pr_id_kit),s.stl_id );

   end if;

   return;

exception
   when others then

     raise exception 'Ha ocurrido un error al crear el cache de stock. sp_doc_stock_cache_create2. %. %.',
                      sqlstate, sqlerrm;

end;
$BODY$
  language plpgsql volatile
  cost 100;
alter function sp_doc_stock_cache_create2(integer, integer)
  owner to postgres;