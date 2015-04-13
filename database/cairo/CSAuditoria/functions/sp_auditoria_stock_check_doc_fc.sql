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
-- Function: sp_auditoria_stock_check_doc_fc()

-- drop function sp_auditoria_stock_check_doc_fc(integer);

create or replace
function sp_auditoria_stock_check_doc_fc
(
  in p_fc_id integer,
  out p_success integer,
  out p_error_msg varchar
)
  returns record as
$BODY$
declare
   v_error smallint;

   v_doct_id integer;

   v_fc_nrodoc varchar(50);
   v_fc_numero varchar(50);

   v_st_id integer;
   v_est_id integer;
   v_llevaStock smallint;

   v_fci_id integer;
   v_fci_cantidad decimal(18,6);

   v_pr_id integer;
   v_pr_id_item integer;
   v_pr_item varchar(255);
   v_pr_nombrecompra varchar(255);
   v_pr_llevastock smallint;
   v_pr_llevanroserie smallint;
   v_pr_stockcompra decimal(18,6);

   v_prns_cantidad integer;

   v_stl_id integer;
   v_sti_cantidad decimal(18,6);

   v_cant_kits decimal(18,6);
begin

   v_error := 0;
   p_success := 0;
   p_error_msg := '@@ERROR_SP:';

   select fc.doct_id,
          fc.st_id,
          fc.fc_nrodoc,
          trim(to_char(fc.fc_numero)),
          fc.est_id,
          doc.doc_muevestock
     into v_doct_id,
          v_st_id,
          v_fc_nrodoc,
          v_fc_numero,
          v_est_id,
          v_llevaStock
   from FacturaCompra fc
   join Documento doc
     on fc.doc_id = doc.doc_id
   where fc.fc_id = p_fc_id;

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
         for v_fci_cantidad,v_pr_id,v_pr_nombrecompra,v_pr_llevastock,v_pr_llevanroserie,v_pr_stockcompra,v_stl_id in
            select sum(fci.fci_cantidadaremitir),
                   fci.pr_id,
                   pr.pr_nombrecompra,
                   pr.pr_llevastock,
                   pr.pr_llevanroserie,
                   pr.pr_stockcompra,
                   fci.stl_id
            from FacturaCompraItem fci
            join Producto pr
              on fci.pr_id = pr.pr_id
            where fci.fc_id = p_fc_id
              and ( pr.pr_llevanroserie = 0 or pr.pr_eskit <> 0 )
            group by fci.pr_id,pr.pr_nombrecompra,pr.pr_llevastock,pr.pr_llevanroserie,pr.pr_stockcompra,fci.stl_id
         loop

            v_sti_cantidad := 0;

            if v_pr_llevastock <> 0 then

               v_pr_stockcompra := coalesce(v_pr_stockcompra, 0);

               select sum(sti_ingreso)
                 into v_sti_cantidad
               from StockItem
               where st_id = v_st_id
                 and pr_id = v_pr_id
                 and ( coalesce(stl_id, 0) = coalesce(v_stl_id, 0) or prns_id is not null )
                 and pr_id_kit is null;

               v_sti_cantidad := coalesce(v_sti_cantidad, 0);

               if abs(v_sti_cantidad
                      - (case
                            when v_pr_stockcompra <> 0 then v_fci_cantidad / v_pr_stockcompra
                            else 0
                         end)
                     ) > 0.01 then

                  v_error := 1;
                  p_error_msg := p_error_msg || 'La factura indica '
                                 || number_to_char(v_fci_cantidad)
                                 || ' "' || v_pr_nombrecompra
                                 || '" y el movimiento de stock indica '
                                 || number_to_char(v_sti_cantidad)
                                 || ' y la ralacion stock-compra es '
                                 || number_to_char(v_pr_stockcompra)
                                 || CHR(10);

               end if;

            else

               if exists ( select *
                           from StockItem
                           where st_id = v_st_id
                             and pr_id = v_pr_id ) then

                  v_error := 1;
                  p_error_msg := p_error_msg
                                 || 'La factura indica el producto "'
                                 || v_pr_nombrecompra
                                 || '" que no mueve stock pero esta incluido en el movimiento '
                                 || 'de stock asociado a esta factura '
                                 || CHR(10);

               end if;

            end if;

         end loop;

         -- con numero de serie
         --

         for v_fci_id,v_fci_cantidad,v_pr_id,v_pr_nombrecompra,v_pr_stockcompra,v_stl_id in
            select fci.fci_id,
                   fci.fci_cantidadaremitir,
                   fci.pr_id,
                   pr.pr_nombrecompra,
                   pr.pr_stockcompra,
                   fci.stl_id
            from FacturaCompraItem fci
            join Producto pr
              on fci.pr_id = pr.pr_id
            where fci.fc_id = p_fc_id
              and pr.pr_llevanroserie <> 0
         loop

            v_sti_cantidad := 0;

            v_pr_stockcompra := coalesce(v_pr_stockcompra, 0);

            select sum(sti_ingreso)
              into v_sti_cantidad
              from StockItem
               where st_id = v_st_id
                       and pr_id = v_pr_id
                       and ( coalesce(stl_id, 0) = coalesce(v_stl_id, 0)
                       or prns_id is not null )
                       and sti_grupo = v_fci_id;

            v_sti_cantidad := coalesce(v_sti_cantidad, 0);

            if abs(v_sti_cantidad
                   - (case
                         when v_pr_stockcompra <> 0 then v_fci_cantidad / v_pr_stockcompra
                         else 0
                      end)
                  ) > 0.01 then

               v_error := 1;
               p_error_msg := p_error_msg || 'La factura indica '
                             || number_to_char(v_fci_cantidad)
                             || ' "' || v_pr_nombrecompra
                             || '" y el movimiento de stock indica '
                             || number_to_char(v_sti_cantidad)
                             || ' y la ralacion stock-compra es '
                             || number_to_char(v_pr_stockcompra)
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
alter function sp_auditoria_stock_check_doc_fc(integer)
  owner to postgres;