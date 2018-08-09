create or replace function sp_DocStockNroSerieValidateTer
(
  in p_pr_id integer default 0,
  in p_prns_id integer default 0
)
as
   c_ns refcursor;
   v_error_msg varchar(5000);
   -- Actualiza el deposito segun la tabla stock cache
   --
   v_prns_id integer;
   v_depl_id integer;
   v_pr_id_kit integer;
   v_cantidad decimal(18,6);
   v_depositosConStock integer;
   v_c_ns varchar(4000);
begin

   v_error_msg := '';

   v_c_ns := 'select prns_id
     from ProductoNumeroSerie ps
      where ( pr_id = p_pr_id
     or p_pr_id = 0 )
     and ( prns_id = p_prns_id
     or p_prns_id = 0 )
     and ( depl_id not in ( -2,-3 ) )
     and exists ( select *
                  from StockItem
                     where prns_id = ps.prns_id
                    group by prns_id

                     having count(*) > 2 )';

   -- Vincula los numeros de serie con el ultimo kit que los consumio
   --
   open c_ns for
      v_c_ns;

   fetch c_ns into v_prns_id;

   while sqlserver_utilities.fetch_status(c_ns%found) = 0
   loop

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
                 from ( select s.depl_id
                 from StockCache s
                        join StockItem si
                         on s.depl_id = si.depl_id
                        and si.sti_ingreso > 0
                        and s.prns_id = si.prns_id
                  where s.prns_id = v_prns_id
                          and s.stc_cantidad > 0
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

   return;

   <<CONTROL_ERROR>>

   v_error_msg := 'Ha ocurrido un error al validar los numeros de serie. sp_DocStockNroSerieValidateTerceroInterno. ' || coalesce(v_error_msg, '');

   raise exception ( -20002, || ':' ||v_error_msg );

   if  v_transcount > 0 then
   begin
      ROLLBACK;
       v_transcount :=  v_transcount - 1;

   end;
   end if;

end;