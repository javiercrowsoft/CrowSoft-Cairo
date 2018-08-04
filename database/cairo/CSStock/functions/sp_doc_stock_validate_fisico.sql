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
-- Function: sp_doc_stock_validate_fisico()

-- drop function sp_doc_stock_validate_fisico(integer, integer);

create or replace
function sp_doc_stock_validate_fisico
(
  p_Message out varchar,
  out p_success integer,
  in p_stTMP_id integer
)
as
   v_productos varchar(5000);
   v_pr_nombrecompra varchar(255);
   v_cfg_valor varchar(255);
   v_deposito varchar(255);
   v_cantidad decimal(18,6);
   v_prns_codigo varchar(100);
   v_stl_codigo varchar(100);
   v_vbcrlf2 varchar(20);
/*  Tipos de Stock
        csENoControlaStock = 2
        csEStockLogico = 3
        csEStockFisico = 4
        csEStockNegativo = 5
*/
   v_TipoControl integer;
begin

   v_vbcrlf2 := CHR(10) || CHR(13) || CHR(10) || CHR(13);

   -- Tengo que validar segun lo que indique la configuracion de stock
   select sp_cfg_getValor('Stock-General',
                           'Tipo Control Stock',
                           v_cfg_valor,
                           0);

   v_cfg_valor := coalesce(v_cfg_valor, 0);

   v_TipoControl := to_number(v_cfg_valor);

   -- csEStockNegativo
   if v_TipoControl = 5 then
   begin
      -- Tengo que validar segun lo que indique la configuracion de stock
      select sp_cfg_getValor('Stock-General',
                              'SP Stock 2',
                              v_cfg_valor,
                              0);

      v_cfg_valor := coalesce(v_cfg_valor, '') || ' @@Message out, @@bSuccess out, ' || to_char(p_stTMP_id);

      execute immediate v_cfg_valor;

   end;
   else
   begin
      -- csEStockFisico
      if v_TipoControl <> 4 then
      begin
         -- Si el stock no es fisico
         p_success := 1;

      end;
      else
      declare
         CURSOR c_productos
           is select p.pr_nombrecompra,
         p.pr_id,
         f.depf_nombre,
         f.depf_id,
         S.prns_id,
         S.stl_id
           from StockItemTMP S
           join DepositoLogico l
            on S.depl_id = l.depl_id
           join DepositoFisico f
            on l.depf_id = f.depf_id
           join Producto p
            on S.pr_id = p.pr_id
            where S.stTMP_id = p_stTMP_id
           group by p.pr_nombrecompra,p.pr_id,f.depf_nombre,f.depf_id,S.prns_id,S.stl_id

            having sum(S.sti_salida) > ( select sum(S.stc_cantidad)
           from StockCache S
                  join StockItemTMP i
                   on S.pr_id = i.pr_id
                  and coalesce(S.prns_id, 0) = coalesce(i.prns_id, 0)
                  and coalesce(S.pr_id_kit, 0) = coalesce(i.pr_id_kit, 0)
                  and coalesce(S.stl_id, 0) = coalesce(i.stl_id, 0)
                  join DepositoLogico df
                   on i.depl_id = df.depl_id
                  join DepositoLogico D
                   on df.depf_id = d.depf_id
            where i.stTMP_id = p_stTMP_id
                    and S.pr_id = p.pr_id
                    and i.sti_salida > 0
                    and S.depl_id = d.depl_id
                    and ( i.depl_id not in ( -2,-3 ) )
           group by d.depf_id,i.pr_id );
         --/////////////////////////
         --/////////////////////////
         --
         --  Stock Fisico
         --
         --/////////////////////////
         --/////////////////////////
         v_depf_id integer;
         v_prns_id integer;
         v_stl_id integer;
         v_pr_id integer;
         v_temp numeric(1,0); := 0;
      begin
         begin
            select 1 into v_temp
              from DUAL
             where exists ( select pr_id
                            from StockItemTMP
                               where stTMP_id = p_stTMP_id
                              group by pr_id,depl_id

                               having sum(sti_salida) > ( select sum(S.stc_cantidad)
                                                          from StockCache S
                                                                 join StockItemTMP i
                                                                  on S.pr_id = i.pr_id
                                                                 and coalesce(S.prns_id, 0) = coalesce(i.prns_id, 0)
                                                                 and coalesce(S.pr_id_kit, 0) = coalesce(i.pr_id_kit, 0)
                                                                 and coalesce(S.stl_id, 0) = coalesce(i.stl_id, 0)
                                                                 join DepositoLogico df
                                                                  on i.depl_id = df.depl_id
                                                                 join DepositoLogico D
                                                                  on df.depf_id = d.depf_id
                                                             where i.stTMP_id = p_stTMP_id
                                                                     and i.depl_id = StockItemTMP.depl_id
                                                                     and S.pr_id = StockItemTMP.pr_id
                                                                     and S.depl_id = d.depl_id
                                                                     and ( i.depl_id not in ( -2,-3 )-- Los depositos internos no importan
                                                                      )
                                                            group by d.depf_id,i.pr_id ) );
         exception
            when others then
               null;
         end;

         -- Si hay un producto en un deposito con cantidad
         -- en negativo no se puede grabar el movimiento
         --
         if v_temp = 1 then
         begin
            -- Los depositos internos no importan
            open c_productos;

            v_productos := '';

            fetch c_productos into v_pr_nombrecompra,v_pr_id,v_deposito,v_depf_id,v_prns_id,v_stl_id;

            while sqlserver_utilities.fetch_status(c_productos%found) = 0
            loop
               begin
                  select sum(S.stc_cantidad),
                         prns.prns_codigo,
                         stl.stl_codigo
                    into v_cantidad,
                         v_prns_codigo,
                         v_stl_codigo
                    from StockCache S
                           join DepositoLogico D
                            on S.depl_id = d.depl_id
                           left join ProductoNumeroSerie prns
                            on S.prns_id = prns.prns_id
                           left join StockLote stl
                            on S.stl_id = stl.stl_id
                     where d.depf_id = v_depf_id
                             and S.pr_id = v_pr_id
                             and coalesce(S.prns_id, 0) = coalesce(v_prns_id, 0)
                             and coalesce(S.stl_id, 0) = coalesce(v_stl_id, 0)
                    group by d.depf_id,prns.prns_codigo,stl.stl_codigo;

                  if v_prns_codigo is null then
                     v_prns_codigo := '';

                  else
                     v_prns_codigo := ' ' || v_prns_codigo;

                  end if;

                  if v_stl_codigo is null then
                     v_stl_codigo := '';

                  else
                     v_stl_codigo := ' ' || v_stl_codigo;

                  end if;

                  v_productos := v_productos
                              || v_pr_nombrecompra
                              || v_prns_codigo
                              || v_stl_codigo
                              || ' ('
                              || v_deposito
                              || ' '
                              || to_char(coalesce(v_cantidad, 0),'#,###,###,##0.00')
                              || '),';

                  fetch c_productos into v_pr_nombrecompra,v_pr_id,v_deposito,v_depf_id,v_prns_id,v_stl_id;

               end;
            end loop;

            close c_productos;

            v_productos := substr(v_productos, 1, length(v_productos) - 1);

            p_success := 0;

            p_Message := 'No hay stock suficiente para el/los articulo(s):' || v_vbcrlf2 || coalesce(v_productos, '');

         end;
         else
         begin
            p_success := 1;

         end;
         end if;

      end;
      end if;

   end;
   end if;

end;
