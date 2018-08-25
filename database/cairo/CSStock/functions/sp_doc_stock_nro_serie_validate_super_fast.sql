/
/* Translation Extracted DDL For Required Objects */
create global temporary table tt_t_numero_en_la_empresa
(
  prns_id integer
);


create or replace function sp_DocStockNroSerieValidateSup
(
  out rtn refcursor
)
as
   CURSOR c_a_validar
     is select prns_id,
   pr_id
     from ProductoNumeroSerie prns
      where not exists ( select prns_id
                         from tt_t_numero_en_la_empresa
                            where prns_id = prns.prns_id )
     and depl_id <> -2
     and depl_id <> -3
   union
   select prns_id,
   pr_id
     from ProductoNumeroSerie prns
      where exists ( select prns_id
                     from tt_t_numero_en_la_empresa
                        where prns_id = prns.prns_id )
     and ( depl_id = -2
     or depl_id = -3 );
   v_prns_id integer;
   v_pr_id integer;
begin

   insert into tt_t_numero_en_la_empresa
     ( prns_id )
     ( select prns_id
       from StockItem
          where depl_id not in ( -2,-3 )
         group by prns_id

          having sum(sti_ingreso - sti_salida) <> 0 );

   open c_a_validar;

   fetch c_a_validar into v_prns_id,v_pr_id;

   while sqlserver_utilities.fetch_status(c_a_validar%found) = 0
   loop
      begin
         sp_DocStockNroSerieValidate(v_pr_id,
                                     v_prns_id);

         fetch c_a_validar into v_prns_id,v_pr_id;

      end;
   end loop;

   close c_a_validar;

   open rtn for
      select prns_id,
             pr_id,
             depl_id
        from ProductoNumeroSerie prns
         where not exists ( select prns_id
                            from tt_t_numero_en_la_empresa
                               where prns_id = prns.prns_id )
                 and depl_id <> -2
                 and depl_id <> -3
      union
      select prns_id,
             pr_id,
             depl_id
        from ProductoNumeroSerie prns
         where exists ( select prns_id
                        from tt_t_numero_en_la_empresa
                           where prns_id = prns.prns_id )
                 and ( depl_id = -2
                 or depl_id = -3 );

end;
/

