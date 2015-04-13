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
-- Function: sp_doc_stock_validate()

-- drop function sp_doc_stock_validate(integer);

create or replace
function sp_doc_stock_validate
(
  in p_st_id integer,
  out p_message varchar,
  out p_success integer
)
  returns record as
$BODY$
declare
   v_productos varchar(5000);
   v_pr_nombrecompra varchar(255);
   v_cfg_valor varchar(255);
   v_deposito varchar(255);
   v_cantidad decimal(18,6);
   v_prns_codigo varchar(100);
   v_stl_codigo varchar(100);
   v_2crlf varchar(20);

   c_productos refcursor;
   v_depf_id_origen integer;
   v_depf_id_destino integer;
begin

   v_2crlf := CHR(10) || CHR(13) || CHR(10) || CHR(13);

   create temporary table tt_tmpStock
   (
     pr_id integer,
     depl_id integer,
     prns_id integer,
     pr_id_kit integer,
     stl_id integer
   ) on commit drop;

   /*  Tipos de Stock

											  csENoControlaStock = 2
											  csEStockLogico = 3
											  csEStockFisico = 4
											  csEStockNegativo = 5
   */

   -- agrego al Cache de Stock a todos los productos que no esten
   -- aun cacheados para los depositos y numeros de serie mencionados por
   -- el StockItem
   --
   if exists ( select *
               from StockItem i
               where i.st_id = p_st_id
                 and not exists ( select *
                                  from StockCache
                                  where pr_id = i.pr_id
                                    and depl_id = i.depl_id
                                    and coalesce(prns_id, 0) = coalesce(i.prns_id, 0)
                                    and coalesce(pr_id_kit, 0) = coalesce(i.pr_id_kit, 0)
                                    and coalesce(stl_id, 0) = coalesce(i.stl_id, 0)
                                    and ( depl_id <> -2 and depl_id <> -3 /* los depositos internos no importan */ ) ) )
   then

      insert into tt_tmpStock( pr_id, depl_id, prns_id, pr_id_kit, stl_id )
        ( select distinct i.pr_id,
                          depl_id,
                          prns_id,
                          i.pr_id_kit,
                          i.stl_id
          from StockItem i
          where i.st_id = p_st_id
            and not exists ( select *
                             from StockCache
                             where pr_id = i.pr_id
                               and depl_id = i.depl_id
                               and coalesce(prns_id, 0) = coalesce(i.prns_id, 0)
                               and coalesce(pr_id_kit, 0) = coalesce(i.pr_id_kit, 0)
                               and coalesce(stl_id, 0) = coalesce(i.stl_id, 0)
                               and ( depl_id <> -2 and depl_id <> -3 /* los depositos internos no importan */ ) ) );

      insert into StockCache( stc_cantidad, pr_id, depl_id, prns_id, pr_id_kit, stl_id )
        ( select sum(i.sti_ingreso) - sum(i.sti_salida),
                 i.pr_id,
                 i.depl_id,
                 i.prns_id,
                 i.pr_id_kit,
                 i.stl_id
          from StockItem i
          join tt_tmpStock t
            on i.pr_id = t.pr_id
            and i.depl_id = t.depl_id
            and coalesce(i.prns_id, 0) = coalesce(t.prns_id, 0)
            and coalesce(i.pr_id_kit, 0) = coalesce(t.pr_id_kit, 0)
            and coalesce(i.stl_id, 0) = coalesce(t.stl_id, 0)
          where ( i.depl_id <> -2 and i.depl_id <> -3 /* los depositos internos no importan */ )
            and i.st_id = p_st_id
          group by i.pr_id,i.depl_id,i.prns_id,i.pr_id_kit,i.stl_id );

   end if;


   -- tengo que validar segun lo que indique la configuracion de stock
   --
   select sp_cfg_getValor('Stock-General', 'Tipo Control Stock') into v_cfg_valor;

   v_cfg_valor := coalesce(v_cfg_valor, 0);

   if to_number(v_cfg_valor) = 2 /* csENoControlaStock */ then

      -- no se controla stock asi que todo bien
      --
      p_success := 1;

   else

      if to_number(v_cfg_valor) = 3 /* csEStockLogico */ then

         -- si hay un producto en un deposito con cantidad
         -- en negativo no se puede grabar el movimiento
         --
         if exists ( select *
                     from StockCache s
                     join StockItem i
                       on s.depl_id = i.depl_id
                       and i.st_id = p_st_id
                       and s.pr_id = i.pr_id
                       and coalesce(s.prns_id, 0) = coalesce(i.prns_id, 0)
                       and coalesce(s.pr_id_kit, 0) = coalesce(i.pr_id_kit, 0)
                       and coalesce(s.stl_id, 0) = coalesce(i.stl_id, 0)
                     where i.st_id = p_st_id
                       and ( i.depl_id <> -2 and i.depl_id <> -3 /* los depositos internos no importan */ )
                       and s.stc_cantidad < 0 ) then

            open c_productos for
               select p.pr_nombrecompra,
                     d.depl_nombre,
                     sum(s.stc_cantidad) + ( select sum(i.sti_salida)
                                             from StockItem i
                                             where i.st_id = p_st_id
                                               and s.pr_id = i.pr_id
                                               and coalesce(s.prns_id, 0) = coalesce(i.prns_id, 0)
                                               and coalesce(s.pr_id_kit, 0) = coalesce(i.pr_id_kit, 0)
                                               and coalesce(s.stl_id, 0) = coalesce(i.stl_id, 0)
                                               and ( i.depl_id <> -2 and i.depl_id <> -3 /* los depositos internos no importan */ )
                                               and s.depl_id = i.depl_id ),
                     prns.prns_codigo,
                     stl.stl_codigo
               from ( StockCache s
               join Producto p
                 on s.pr_id = p.pr_id
                 and exists (select *
                             from StockItem i
                             where i.st_id = p_st_id
                               and s.pr_id = i.pr_id
                               and coalesce(s.prns_id, 0) = coalesce(i.prns_id, 0)
                               and coalesce(s.pr_id_kit, 0) = coalesce(i.pr_id_kit, 0)
                               and coalesce(s.stl_id, 0) = coalesce(i.stl_id, 0)
                               and ( i.depl_id <> -2 and i.depl_id <> -3 /* los depositos internos no importan */ )
                               and s.depl_id = i.depl_id )
                            )
               join DepositoLogico d
                 on s.depl_id = d.depl_id
               left join ProductoNumeroSerie prns
                 on s.prns_id = prns.prns_id
               left join StockLote stl
                 on s.stl_id = stl.stl_id
               where ( s.depl_id <> -2
                 and s.depl_id <> -3 )
                 and s.stc_cantidad < 0
               group by p.pr_nombrecompra, s.depl_id, s.pr_id, s.prns_id, s.pr_id_kit, s.stl_id, d.depl_nombre,
                        prns.prns_codigo, stl.stl_codigo;

            v_productos := '';

            loop

               fetch c_productos into v_pr_nombrecompra,v_deposito,v_cantidad,v_prns_codigo,v_stl_codigo;
               exit when c_productos%notfound;

               if v_prns_codigo is null then
                  v_prns_codigo := '';
               else
                  v_prns_codigo := ' (ns: ' || v_prns_codigo || ')';
               end if;

               if v_stl_codigo is null then
                  v_stl_codigo := '';
               else
                  v_stl_codigo := ' (lote: ' || v_stl_codigo || ')';
               end if;

               v_productos := v_productos || v_pr_nombrecompra || v_prns_codigo
                              || v_stl_codigo || ' (' || v_deposito || ' '
                              || to_char(v_cantidad, '9,999,990.00') || '),';

            end loop;

            close c_productos;

            v_productos := substr(v_productos, 1, length(v_productos) - 1);
            p_success := 0;
            p_message := 'No hay stock suficiente para el/los articulo(s):' || v_2crlf || coalesce(v_productos, '');

         else

            p_success := 1;

         end if;

      else

         if to_number(v_cfg_valor) = 4 /* csEStockFisico */ then

            select dl.depf_id,
                   dd.depf_id
              into v_depf_id_origen,
                   v_depf_id_destino
            from Stock st
            join DepositoLogico dl
              on st.depl_id_origen = dl.depl_id
            join DepositoLogico dd
              on st.depl_id_destino = dd.depl_id
            where st.st_id = p_st_id;

            -- si hay un producto en un deposito con cantidad
            -- en negativo no se puede grabar el movimiento
            --
            if exists ( select d.depf_id
                        from ( StockCache s
                               join StockItem i
                                on s.pr_id = i.pr_id
                                 and i.st_id = p_st_id
                                 and coalesce(s.prns_id, 0) = coalesce(i.prns_id, 0)
                                 and coalesce(s.pr_id_kit, 0) = coalesce(i.pr_id_kit, 0)
                                 and coalesce(s.stl_id, 0) = coalesce(i.stl_id, 0)
                         )
                        join DepositoLogico df
                          on i.depl_id = df.depl_id
                        join DepositoLogico d
                          on df.depf_id = d.depf_id
                        where i.st_id = p_st_id
                          and s.depl_id = d.depl_id
                          and ( i.depl_id <> -2 and i.depl_id <> -3 /* los depositos internos no importan */ )
                        group by d.depf_id,i.pr_id
                        having sum(s.stc_cantidad) < 0 ) then

               open c_productos for
                  select p.pr_nombrecompra,
                         f.depf_nombre,
                         sum(s.stc_cantidad) + ( select sum(i.sti_salida)
                                                 from StockItem i
                                                 where i.st_id = p_st_id
                                                   and s.pr_id = i.pr_id
                                                   and coalesce(s.prns_id, 0) = coalesce(i.prns_id, 0)
                                                   and coalesce(s.pr_id_kit, 0) = coalesce(i.pr_id_kit, 0)
                                                   and coalesce(s.stl_id, 0) = coalesce(i.stl_id, 0)
                                                   and ( i.depl_id <> -2 and i.depl_id <> -3
                                                        /* los depositos internos no importan */ ) ),
                         prns.prns_codigo,
                         stl.stl_codigo
                  from ( StockCache s
                  join DepositoLogico d
                    on s.depl_id = d.depl_id
                    and ( d.depf_id = v_depf_id_origen or d.depf_id = v_depf_id_destino )
                    and exists ( select *
                                 from StockItem i
                                 where i.st_id = p_st_id
                                   and s.pr_id = i.pr_id
                                   and coalesce(s.prns_id, 0) = coalesce(i.prns_id, 0)
                                   and coalesce(s.pr_id_kit, 0) = coalesce(i.pr_id_kit, 0)
                                   and coalesce(s.stl_id, 0) = coalesce(i.stl_id, 0)
                                   and ( i.depl_id <> -2 and i.depl_id <> -3 /* los depositos internos no importan */ ) )
                               )
                  join Producto p
                    on s.pr_id = p.pr_id
                  join DepositoFisico f
                    on d.depf_id = f.depf_id
                  left join ProductoNumeroSerie prns
                    on s.prns_id = prns.prns_id
                  left join StockLote stl
                    on s.stl_id = stl.stl_id
                  where ( s.depl_id <> -2 and s.depl_id <> -3 /* los depositos internos no importan */ )
                  group by p.pr_nombrecompra, f.depf_nombre, d.depf_id, s.pr_id, s.prns_id, s.stl_id, s.pr_id_kit,
                           prns.prns_codigo, stl.stl_codigo
                  having sum(s.stc_cantidad) < 0;

               v_productos := '';

               loop

                  fetch c_productos into v_pr_nombrecompra,v_deposito,v_cantidad,v_prns_codigo,v_stl_codigo;
                  exit when c_productos%notfound;

                  if v_prns_codigo is null then
                     v_prns_codigo := '';
                  else
                     v_prns_codigo := ' (ns: ' || v_prns_codigo || ')';
                  end if;

                  if v_stl_codigo is null then
                     v_stl_codigo := '';
                  else
                     v_stl_codigo := ' (lote: ' || v_stl_codigo || ')';
                  end if;

                  v_productos := v_productos || v_pr_nombrecompra || v_prns_codigo || v_stl_codigo
                                 || ' (' || v_deposito || ' ' || to_char(v_cantidad, '9,999,990.00') || '),';

               end loop;

               close c_productos;

               v_productos := substr(v_productos, 1, length(v_productos) - 1);

               p_success := 0;
               p_message := 'No hay stock suficiente para el/los articulo(s):' || v_2crlf || coalesce(v_productos, '');

            else

               p_success := 1;

            end if;

         else

            if to_number(v_cfg_valor) = 5 /* csEStockNegativo */ then

               -- tengo que validar segun lo que indique la configuracion de stock
               --
               select sp_cfg_getValor('Stock-General', 'SP Stock') into v_cfg_valor;

               v_cfg_valor := coalesce(v_cfg_valor, '') || ', ' || to_char(p_st_id);

               execute v_cfg_valor into p_message, p_success;

            end if;

         end if;

      end if;

   end if;

end;
$BODY$
  language plpgsql volatile
  cost 100;
alter function sp_doc_stock_validate(integer)
  owner to postgres;