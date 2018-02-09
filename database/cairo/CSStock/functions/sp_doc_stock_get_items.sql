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
-- Function: sp_doc_stock_get_items()

-- drop function sp_doc_stock_get_items(integer);
/*
select * from sp_doc_stock_get_items(1);
fetch all from rtn;
fetch all from rtn_serie;
*/
create or replace function sp_doc_stock_get_items
(
  in p_st_id integer,
  out rtn refcursor,
  out rtn_serie refcursor,
  out rtn_kit refcursor
)
  returns record as
$BODY$
declare
   v_depl_id_origen integer;
   v_pr_id integer;
begin

   rtn := 'rtn';

   select depl_id_origen
     into v_depl_id_origen
   from Stock
   where st_id = p_st_id;

   --///////////////////////////////////////////////////////////////////////////////////////////////////
   --
   --  STOCK ITEMS AGRUPADOS POR GRUPO
   --
   --///////////////////////////////////////////////////////////////////////////////////////////////////

   open rtn for

      select st_id,
             min(sti_orden)    sti_orden,
             min(sti_id)       sti_id,       -- Cuando hay uno por grupo el id es unico

             sum(sti_salida)   sti_salida,
             min(sti_descrip)  sti_descrip,  -- idem

             sti_grupo,
             sti.pr_id,
             v_depl_id_origen  depl_id,
             pr_nombrecompra,
             0 pr_eskit,

             min(pr_llevanroserie) pr_llevanroserie,  -- idem
             min(pr_llevanrolote)  pr_llevanrolote,   -- idem
             min(un_nombre)        un_nombre,         -- idem

             min(sti.stl_id)   stl_id,
             min(stl_codigo)   stl_codigo
        from StockItem sti
        join Producto
          on sti.pr_id = Producto.pr_id and st_id = p_st_id
        join Unidad
          on Producto.un_id_stock = Unidad.un_id
        left join StockLote stl
          on sti.stl_id = stl.stl_id
        where depl_id = v_depl_id_origen
          and stik_id is null -- Solo producos que no pertenecen a un kit

        group by st_id,sti.pr_id,pr_nombrecompra,pr_eskit,sti_grupo,sti.stl_id,stl_codigo

      union

      select k.st_id,
             min(sti_orden)    sti_orden,
             k.stik_id         sti_id,      -- Cuando hay uno por grupo el id es unico

             stik_cantidad     sti_salida,
             min(sti_descrip)  sti_descrip, -- idem

             max(sti_grupo),
             k.pr_id pr_id,
             v_depl_id_origen  depl_id,
             prk.pr_nombrecompra,
             1 pr_eskit,
             min(stik_llevanroserie) pr_llevanroserie, -- idem
             0 pr_llevanrolote,
             min(un_nombre)    un_nombre,-- idem
             min(stl.stl_id)   stl_id,
             min(stl_codigo)   stl_codigo

        from ( StockItemKit k
               join StockItem sti
                 on k.stik_id = sti.stik_id
                and k.st_id = p_st_id
                and sti.st_id = p_st_id
                and depl_id = v_depl_id_origen
             )
               join Producto prk
                 on k.pr_id = prk.pr_id
               join Unidad
                 on prk.un_id_stock = Unidad.un_id
               left join StockLote stl
                 on sti.stl_id = stl.stl_id
        group by k.st_id,k.stik_id,k.pr_id,stik_cantidad,prk.pr_nombrecompra
        order by sti_orden;

 --///////////////////////////////////////////////////////////////////////////////////////////////////
 --
 --  NUMEROS DE SERIE
 --
 --///////////////////////////////////////////////////////////////////////////////////////////////////

   rtn_serie := 'rtn_serie';

   open rtn_serie for

      select sti.pr_id,
             prns.prns_id,
             prns.prns_codigo,
             prns.prns_descrip,
             prns.prns_fechavto,
             sti.sti_grupo,
             pr_nombrecompra
      from ( ProductoNumeroSerie prns
             join StockItem sti
               on prns.prns_id = sti.prns_id
              and sti.st_id = p_st_id
           )
             join Producto p
               on prns.pr_id = p.pr_id
        group by
            sti.pr_id,prns.prns_id,prns.prns_codigo,prns.prns_descrip,
            prns.prns_fechavto,sti.sti_grupo,pr_nombrecompra
        order by sti.sti_grupo;

   create temporary table tt_kit_item_serie
   (
     pr_id_kit       integer ,
     cantidad        decimal(18,6)  not null,
     pr_id           integer  not null,
     prk_id          integer  not null,
     nivel           smallint default (0) not null
   ) on commit drop;

   for v_pr_id in select pr_id from StockItemKit where st_id = p_st_id
   loop

       perform sp_stock_producto_get_kit_info(v_pr_id, 0);

       update tt_kit_item_serie
          set pr_id_kit = v_pr_id
       where pr_id_kit is null;

   end loop;

   open rtn_kit for

      select k.pr_id_kit pr_id,
             k.pr_id pr_id_item,
             p.pr_nombrecompra,
             p.pr_llevanroserie,
             cantidad
      from tt_kit_item_serie k
      join Producto p
        on k.pr_id = p.pr_id;

end;
$BODY$
  language plpgsql volatile
  cost 100;
alter function sp_doc_stock_get_items(integer)
  owner to postgres;