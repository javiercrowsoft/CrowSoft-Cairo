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
-- Function: sp_auditoria_stock_check_doc_fv()

-- drop function sp_auditoria_stock_check_doc_fv(integer);

create or replace function sp_auditoria_stock_check_doc_fv
(
  in p_fv_id integer,
  out p_success integer,
  out p_error_msg varchar
)
  returns record as
$BODY$
declare
   v_error smallint;
   
   v_doct_id integer;
   
   v_fv_nrodoc varchar(50);
   v_fv_numero varchar(50);
   
   v_st_id integer;
   v_est_id integer;
   v_llevaStock smallint;

   v_fvi_id integer;
   v_fvi_cantidad decimal(18,6);

   v_pr_id integer;
   v_pr_id_item integer;
   v_pr_item varchar(255);
   v_pr_nombreventa varchar(255);
   v_pr_llevastock smallint;
   v_pr_llevanroserie smallint;
   v_pr_ventastock decimal(18,6);

   v_prns_cantidad integer;

   v_pr_eskit smallint;
   v_pr_kitItems decimal(18,6);
   v_pr_lotefifo smallint;

   v_stl_id integer;
   v_sti_cantidad decimal(18,6);

   v_cant_kits decimal(18,6);
begin

   v_error := 0;
   p_success := 0;
   p_error_msg := '@@ERROR_SP:';

   select fv.doct_id,
          fv.st_id,
          fv.fv_nrodoc,
          trim(to_char(fv.fv_numero)),
          fv.est_id,
          doc.doc_muevestock
     into v_doct_id,
          v_st_id,
          v_fv_nrodoc,
          v_fv_numero,
          v_est_id,
          v_llevaStock
   from FacturaVenta fv
   join Documento doc
     on fv.doc_id = doc.doc_id
   where fv.fv_id = p_fv_id;

   if v_llevaStock <> 0 then

      -- 1 si esta anulado no tiene que tener stock
      --
      if v_est_id = 7 then

         if v_st_id is not null then

            if exists ( select *
                        from Stock
                        where st_id = v_st_id ) then

               v_error := 1;
               p_error_msg := p_error_msg
                              || 'La factura esta anulada y posee un movimiento de stock'
                              || CHR(10);

            else

               v_error := 1;
               p_error_msg := p_error_msg
                              || 'La factura esta anulada y posee st_id distinto de null pero este st_id no existe en la tabla stock'
                              || CHR(10);

            end if;

         end if;

      -- 2 si no esta anulado tiene que tener stock
      --
      else

         -- sin numero de serie
         --

         for v_fvi_cantidad,v_pr_id,v_pr_nombreventa,v_pr_llevastock,v_pr_eskit,
             v_pr_kitItems,v_pr_llevanroserie,v_pr_lotefifo,v_pr_ventastock,v_stl_id in

            select sum(fvi.fvi_cantidadaremitir),
                   fvi.pr_id,
                   pr.pr_nombreventa,
                   pr.pr_llevastock,
                   pr.pr_eskit,
                   pr.pr_kitItems,
                   pr.pr_llevanroserie,
                   pr.pr_lotefifo,
                   pr.pr_ventastock,
                   fvi.stl_id
            from FacturaVentaItem fvi
            join Producto pr
              on fvi.pr_id = pr.pr_id
            where fvi.fv_id = p_fv_id
              and ( pr.pr_llevanroserie = 0 or pr.pr_eskit <> 0 )
            and fvi.fvi_nostock = 0
            group by fvi.pr_id,pr.pr_nombreventa,pr.pr_llevastock,pr.pr_eskit,pr.pr_kitItems,pr.pr_llevanroserie,
                     pr.pr_lotefifo,pr.pr_ventastock,fvi.stl_id
         loop

            v_sti_cantidad := 0;

            if v_pr_llevastock <> 0 then

               if v_pr_eskit <> 0 then

                  v_cant_kits := v_fvi_cantidad;

                  v_fvi_cantidad := v_fvi_cantidad * v_pr_kitItems;

                  select sum(sti_ingreso)
                    into v_sti_cantidad
                  from StockItem
                  where st_id = v_st_id
                    and pr_id_kit = v_pr_id
                    and ( coalesce(stl_id, 0) = coalesce(v_stl_id, 0) or prns_id is not null );

               else

                  v_fvi_cantidad := v_fvi_cantidad * v_pr_ventastock;

                  select sum(sti_ingreso)
                    into v_sti_cantidad
                  from StockItem
                  where st_id = v_st_id
                    and pr_id = v_pr_id
                    and ( coalesce(stl_id, 0) = coalesce(v_stl_id, 0) or prns_id is not null or v_pr_lotefifo <> 0 )
                    and pr_id_kit is null
                    and pr_id_kit is null;

               end if;

               v_sti_cantidad := coalesce(v_sti_cantidad, 0);

               if abs(v_sti_cantidad - v_fvi_cantidad) > 0.01 then

                  if v_pr_eskit <> 0 then

                     v_error := 1;
                     p_error_msg := p_error_msg || 'La factura indica '
                                   || to_char(v_cant_kits, '#,###,###,##0.00')
                                   || ' Kit "' || v_pr_nombreventa || '" compuesto(s) en total por '
                                   || to_char(v_fvi_cantidad, '#,###,###,##0.00')
                                   || ' items' || ' y el movimiento de stock indica '
                                   || to_char(v_sti_cantidad, '#,###,###,##0.00')
                                   || CHR(10);

                  else

                     v_error := 1;
                     p_error_msg := p_error_msg || 'La factura indica '
                                   || to_char(v_fvi_cantidad, '#,###,###,##0.00')
                                   || ' "' || v_pr_nombreventa || '" y el movimiento de stock indica '
                                   || to_char(v_sti_cantidad, '#,###,###,##0.00')
                                   || CHR(10);

                  end if;

               end if;

               -- ahora los numeros de serie de los que son kit
               --
               if v_pr_llevanroserie <> 0 and v_pr_eskit <> 0 then

                  delete from tt_KitItems;

                  delete from tt_kit_item_serie;

                  perform sp_stock_producto_get_kit_info(v_pr_id, 0);

                  for v_pr_id_item,v_pr_item,v_prns_cantidad in
                       select k.pr_id,
                              p.pr_nombrecompra,
                              cantidad
                       from tt_kit_item_serie k
                       join Producto p
                         on k.pr_id = p.pr_id
                       where p.pr_llevanroserie <> 0
                  loop

                     v_prns_cantidad := v_prns_cantidad * v_cant_kits;
                     v_sti_cantidad := 0;

                     select sum(sti_ingreso)
                       into v_sti_cantidad
                     from StockItem
                     where st_id = v_st_id
                       and pr_id = v_pr_id_item
                       and ( coalesce(stl_id, 0) = coalesce(v_stl_id, 0) or prns_id is not null )
                       and pr_id_kit = v_pr_id;

                     v_sti_cantidad := coalesce(v_sti_cantidad, 0);

                     if v_sti_cantidad <> v_prns_cantidad then

                        v_error := 1;
                        p_error_msg := p_error_msg || 'La factura indica que el Kit "'
                                      || v_pr_nombreventa || +'" lleva '
                                      || to_char(v_prns_cantidad, '#,###,###,##0.00')
                                      || ' "' || v_pr_item || '" y el movimiento de stock indica '
                                      || to_char(v_sti_cantidad, '#,###,###,##0.00')
                                      || CHR(10);

                     end if;

                  end loop;

               end if;

            else

               if exists ( select *
                           from StockItem
                           where st_id = v_st_id
                             and pr_id = v_pr_id ) then

                  v_error := 1;
                  p_error_msg := p_error_msg
                                 || 'La factura indica el producto "' || v_pr_nombreventa
                                 || '" que no mueve stock pero esta incluido en el movimiento '
                                 || 'de stock asociado a esta factura '
                                 || CHR(10);

               end if;

            end if;

         end loop;

         -- con numero de serie
         --

         for v_fvi_id,v_fvi_cantidad,v_pr_id,v_pr_nombreventa,v_pr_eskit,v_pr_kitItems,v_pr_ventastock,v_stl_id in
              select fvi.fvi_id,
                     fvi.fvi_cantidadaremitir,
                     fvi.pr_id,
                     pr.pr_nombreventa,
                     pr.pr_eskit,
                     pr.pr_kitItems,
                     pr.pr_ventastock,
                     fvi.stl_id
              from FacturaVentaItem fvi
              join Producto pr
                on fvi.pr_id = pr.pr_id
              where fvi.fv_id = p_fv_id
                and pr.pr_llevanroserie <> 0
                and pr.pr_eskit = 0
                and fvi.fvi_nostock = 0
         loop

            v_sti_cantidad := 0;

            select sum(sti_ingreso)
              into v_sti_cantidad
            from StockItem
            where st_id = v_st_id
                       and pr_id = v_pr_id
                       and ( coalesce(stl_id, 0) = coalesce(v_stl_id, 0)
                       or prns_id is not null )
                       and sti_grupo = v_fvi_id
                       and pr_id_kit is null;

            v_sti_cantidad := coalesce(v_sti_cantidad, 0);

            if abs(v_sti_cantidad - (v_fvi_cantidad * v_pr_ventastock)) > 0.01 then

               v_error := 1;
               p_error_msg := p_error_msg || 'La factura indica '
                              || to_char(v_fvi_cantidad, '#,###,###,##0.00')
                              || ' "' || v_pr_nombreventa || '" y el movimiento de stock indica '
                              || to_char(v_sti_cantidad, '#,###,###,##0.00')
                              || ' y la ralacion venta-stock es '
                              || to_char(coalesce(v_pr_ventastock, 1), '#,###,###,##0.00')
                              || CHR(10);

            end if;

         end loop;

      end if;

   end if;

   -- no hubo errores asi que todo bien
   --
   if v_error = 0 then
      p_success := 1;
   end if;

end;
$BODY$
  language plpgsql volatile
  cost 100;
alter function sp_auditoria_stock_check_doc_fv(integer)
  owner to postgres;