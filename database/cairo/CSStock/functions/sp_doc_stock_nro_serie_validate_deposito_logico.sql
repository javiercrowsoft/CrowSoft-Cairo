create or replace function sp_DocStockNroSerieValidateDep
as
   CURSOR c_dep
     is select depl_id
     from DepositoLogico
      where depl_id <> -3;
   v_depl_id integer;
begin

   open c_dep;

   fetch c_dep into v_depl_id;

   while sqlserver_utilities.fetch_status(c_dep%found) = 0
   loop
      begin
         update ProductoNumeroSerie
            set depl_id = v_depl_id
            where prns_id in ( select STOCKITEM.prns_id
                               from StockItem
                                  where STOCKITEM.depl_id = v_depl_id
                                 group by STOCKITEM.prns_id

                                  having sum(STOCKITEM.sti_ingreso - STOCKITEM.sti_salida) > 0 );

         fetch c_dep into v_depl_id;

      end;
   end loop;

   close c_dep;

   -- Tercero
   --
   update ProductoNumeroSerie
      set depl_id = -3
      -- No tiene que haber ningun deposito con stock
      where not exists ( select STOCKITEM.depl_id
                                         from StockItem
                                            where STOCKITEM.prns_id = ProductoNumeroSerie.prns_id
                                                    and STOCKITEM.depl_id <> -3
                                           group by STOCKITEM.depl_id

                                            having sum(STOCKITEM.sti_ingreso - STOCKITEM.sti_salida) > 0 )
     -- Tiene que haber estado en tercero
     and exists ( select STOCKITEM.depl_id
                  from StockItem
                     where STOCKITEM.prns_id = ProductoNumeroSerie.prns_id
                             and STOCKITEM.depl_id = -3 );

   -- Interno
   --
   update ProductoNumeroSerie
      set depl_id = -3
      -- No tiene que haber ningun deposito con stock
      where not exists ( select STOCKITEM.depl_id
                                         from StockItem
                                            where STOCKITEM.prns_id = ProductoNumeroSerie.prns_id
                                                    and STOCKITEM.depl_id <> -3
                                           group by STOCKITEM.depl_id

                                            having sum(STOCKITEM.sti_ingreso - STOCKITEM.sti_salida) > 0 )
     -- No tiene que haber estado en tercero
     and not exists ( select STOCKITEM.depl_id
                      from StockItem
                         where STOCKITEM.prns_id = ProductoNumeroSerie.prns_id
                                 and STOCKITEM.depl_id = -3 );

end;
