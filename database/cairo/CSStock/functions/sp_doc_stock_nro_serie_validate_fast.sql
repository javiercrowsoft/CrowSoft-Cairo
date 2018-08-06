/
create or replace function sp_DocStockNroSerieValidateFas
(
  in p_pr_id integer default 0,
  in p_prns_id integer default 0
)
as
   CURSOR c_ns
     is select prns_id,
   pr_id_kit
     from ProductoNumeroSerie
      where ( pr_id = p_pr_id
     or pr_id_kit = p_pr_id
     or p_pr_id = 0 )
     and ( prns_id = p_prns_id
     or p_prns_id = 0 );
   v_error_msg varchar(5000);
   -- Actualiza el deposito segun la tabla stock cache
   --
   v_prns_id integer;
   v_depl_id integer;
   v_pr_id_kit integer;
   v_cantidad decimal(18,6);
   v_depositosConStock integer;
begin

   v_error_msg := '';

   open c_ns;

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
         end if;

         fetch c_ns into v_prns_id,v_pr_id_kit;

      end;
   end loop;

   close c_ns;

   return;

   <<CONTROL_ERROR>>

   v_error_msg := 'Ha ocurrido un error al validar los numeros de serie. sp_DocStockNroSerieValidateFast. ' || coalesce(v_error_msg, '');

   raise exception ( -20002, || ':' ||v_error_msg );

   if  v_transcount > 0 then
   begin
      ROLLBACK;
       v_transcount :=  v_transcount - 1;

   end;
   end if;

end;
