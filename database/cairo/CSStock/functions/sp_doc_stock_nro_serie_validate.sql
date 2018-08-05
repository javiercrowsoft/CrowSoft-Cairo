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
-- Function: sp_doc_stock_nro_serie_validate()

-- drop function sp_doc_stock_nro_serie_validate(integer, integer, integer);

/*
	select sp_doc_stock_cache_create();
*/

create or replace function sp_doc_stock_nro_serie_validate
(
  in p_pr_id integer default 0,
  in p_prns_id integer default 0,
  in p_bDeleteSinMovimientos integer default 0
)
  returns void as
$BODY$
declare
   c_ns refcursor;
   v_error_msg varchar(5000);
   v_prns_id integer;
   v_depl_id integer;
   v_pr_id_kit integer;
   v_cantidad decimal(18,6);
   v_depositosConStock integer;
   v_c_ns varchar(4000);
   v_transcount integer;
begin

   v_error_msg := '';

   v_c_ns := 'select prns_id
     from ProductoNumeroSerie
      where ( pr_id = p_pr_id
     or p_pr_id = 0 )
     and ( prns_id = p_prns_id
     or p_prns_id = 0 )';

   -- Vincula los numeros de serie con el ultimo kit que los consumio
   --
   open c_ns for
      v_c_ns;

   fetch c_ns into v_prns_id;

   while sqlserver_utilities.fetch_status(c_ns%found) = 0
   loop
      begin
         v_pr_id_kit := null;

         select *
           into v_pr_id_kit
           from ( select pr_id_kit
           from StockItem
            where prns_id = v_prns_id
                    and pr_id_kit is not null
           order by st_id DESC )
           LIMIT 1;

         update ProductoNumeroSerie
            set pr_id_kit = v_pr_id_kit
            where prns_id = v_prns_id;

         fetch c_ns into v_prns_id;

      end;
   end loop;

   close c_ns;

   v_c_ns := 'select prns_id,
   pr_id_kit
     from ProductoNumeroSerie
      where ( pr_id = p_pr_id
     or pr_id_kit = p_pr_id
     or p_pr_id = 0 )
     and ( prns_id = p_prns_id
     or p_prns_id = 0 )';

   open c_ns for
      v_c_ns;

   fetch c_ns into v_prns_id,v_pr_id_kit;

   while sqlserver_utilities.fetch_status(c_ns%found) = 0
   loop
      begin
         v_depl_id := null;

         v_pr_id_kit := coalesce(v_pr_id_kit, 0);

         select sum(stc_cantidad)
           into v_cantidad
           from StockCache
            where prns_id = v_prns_id
                    and depl_id not in ( -2,-3 )
                    and coalesce(pr_id_kit, 0) = v_pr_id_kit;

         if coalesce(v_cantidad, 0) > 0 then
         begin
            select count(*)
              into v_depositosConStock
              from StockCache
               where prns_id = v_prns_id
                       and stc_cantidad > 0;

            if v_depositosConStock = 1 then
               select depl_id
                 into v_depl_id
                 from StockCache
                  where prns_id = v_prns_id
                          and stc_cantidad > 0 and rownum <= 1;

            else
            begin
               select *
                 into v_depl_id
                 from ( select S.depl_id
                 from StockCache S
                        join StockItem si
                         on S.depl_id = si.depl_id
                        and si.sti_ingreso > 0
                        and S.prns_id = si.prns_id
                  where S.prns_id = v_prns_id
                          and S.stc_cantidad > 0
                 order by si.st_id DESC )
                 LIMIT 1;

            end;
            end if;

            if v_depl_id is not null then
            begin
               update ProductoNumeroSerie
                  set depl_id = v_depl_id
                  where prns_id = v_prns_id;

            end;
            end if;

         end;
         else
         begin
            select sum(sti_ingreso) - sum(sti_salida)
              into v_cantidad
              from StockItem
               where prns_id = v_prns_id
                       and depl_id = -3;

            if coalesce(v_cantidad, 0) > 0 then
               update ProductoNumeroSerie
                  set depl_id = -3
                  where prns_id = v_prns_id;

            else
            declare
               v_temp numeric(1,0); := 0;
            begin
               begin
                  select 1 into v_temp
                    from DUAL
                   where not exists ( select *
                                      from StockItem
                                         where prns_id = v_prns_id
                                                 and depl_id = -2
                                                 and coalesce(pr_id_kit, 0) = v_pr_id_kit
                                        group by prns_id,depl_id

                                         having sum(sti_ingreso) - sum(sti_salida) > 0 )
                 and exists ( select *
                              from StockItem
                                 where prns_id = v_prns_id
                                         and depl_id = -3 );
               exception
                  when others then
                     null;
               end;

               -- Si el numero de serie no existe en produccion y si existen en tercero, es por que lo
               -- compre y lo vendi y como al comprarlo entra por -3 y al venderlo sale por -3
               -- en -3 tengo cero, pero esta bien, asi que lo dejo en el deposito de terceros
               -- Excepto cuando es un kit ya que en este caso estoy produciendolo y por ende
               -- sale de -2 cuando lo armo y vuelve a -2 cuando lo desarmo y queda -2 en cero
               -- (-2 es produccion :)
               -- es decir que si lo tengo en produccion y en tercero y en ambos en cero
               -- lo dejo en el ultimo deposito que lo movio
               --
               if v_temp = 1 then
               begin
                  select *
                    into v_depl_id
                    from ( select depl_id
                    from StockItem
                     where prns_id = v_prns_id
                             and sti_ingreso > 0
                             and depl_id in ( -2,-3 )
                    order by sti_id DESC )
                    LIMIT 1;

                  if v_depl_id is not null then
                  begin
                     update ProductoNumeroSerie
                        set depl_id = v_depl_id
                        where prns_id = v_prns_id;

                  end;
                  end if;

               end;
               else
                  if v_depl_id is not null then
                  begin
                     update ProductoNumeroSerie
                        set depl_id = v_depl_id
                        where prns_id = v_prns_id;

                  end;
                  else
                  begin
                     select *
                       into v_depl_id
                       from ( select depl_id
                       from StockItem
                        where prns_id = v_prns_id
                                and sti_ingreso > 0
                                and depl_id in ( -2,-3 )
                       order by sti_id DESC )
                       LIMIT 1;

                     if v_depl_id is not null then
                     begin
                        update ProductoNumeroSerie
                           set depl_id = v_depl_id
                           where prns_id = v_prns_id;

                     end;
                     end if;

                  end;
                  end if;

               end if;

            end;
            end if;

         end;
         end if;

         fetch c_ns into v_prns_id,v_pr_id_kit;

      end;
   end loop;

   close c_ns;

   SET TRANSACTION READ WRITE;
    v_transcount :=  v_transcount + 1;

   -- Desvincula los numeros de serie que estan con kits
   -- que no existen
   --
   update ProductoNumeroSerie
      set pr_id_kit = null
      where prns_id in ( select prns_id
                         from ProductoNumeroSerie ps
                            where not exists ( select *
                                               from StockItem si
                                                      join StockItemKit sk
                                                       on si.stik_id = sk.stik_id
                                                  where si.pr_id = ps.pr_id
                                                          and sk.pr_id = ps.pr_id_kit
                                                          and si.prns_id = ps.prns_id )
                                    and pr_id_kit is not null )
     and pr_id_kit is not null
     and ( prns_id = p_prns_id
     or p_prns_id = 0 )
     and ( pr_id = p_pr_id
     or pr_id_kit = p_pr_id
     or p_pr_id = 0 );

   -- Desvincula los numeros de serie que estan con partes que no los mencionan
   --
   update ProductoNumeroSerie
      set ppk_id = null
      where not exists ( select si.prns_id
                         from StockItem si
                                join ParteProdKit ppk
                                 on si.st_id = ppk.st_id1
                            where si.prns_id = ProductoNumeroSerie.prns_id )
     and ppk_id is not null
     and ( prns_id = p_prns_id
     or p_prns_id = 0 )
     and ( pr_id = p_pr_id
     or pr_id_kit = p_pr_id
     or p_pr_id = 0 );

   if p_bDeleteSinMovimientos <> 0 then
   begin
      delete ProductoNumeroSerie

         where not exists ( select prns_id
                            from StockItem
                               where prns_id = ProductoNumeroSerie.prns_id )
                 and ( prns_id = p_prns_id
                 or p_prns_id = 0 )
                 and ( pr_id = p_pr_id
                 or pr_id_kit = p_pr_id
                 or p_pr_id = 0 );

   end;
   end if;

   COMMIT;

   return;

   <<CONTROL_ERROR>>

   v_error_msg := 'Ha ocurrido un error al validar los numeros de serie. sp_DocStockNroSerieValidate. ' || coalesce(v_error_msg, '');

   raise exception ( -20002, v_error_msg );

   if  v_transcount > 0 then
   begin
      ROLLBACK;
       v_transcount :=  v_transcount - 1;

   end;
   end if;

   return;

exception
   when others then

     raise exception 'Ha ocurrido un error al validar los numeros de serie. sp_doc_stock_nro_serie_validate. %. %.',
                      sqlstate, sqlerrm;

end;
$BODY$
  language plpgsql volatile
  cost 100;
alter function sp_doc_stock_nro_serie_validate(integer, integer, integer)
  owner to postgres;