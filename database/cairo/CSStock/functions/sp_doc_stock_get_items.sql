create or replace function sp_DocStockGetItems
/*
select * from stockitemkit where st_id = 10514
exec sp_DocStockGetItems 10518
*/
(
  in p_st_id integer,
  out rtn refcursor,
  cv_2 in out refcursor,
  cv_3 in out refcursor,
  cv_4 in out refcursor
)
as
   CURSOR c_KitItem
     is select pr_id
     from StockItemKit
      where st_id = p_st_id;
   v_depl_id_origen integer;
   --///////////////////////////////////////////////////////////////////////////////////////////////////
   --
   --  Info Kit
   --
   --///////////////////////////////////////////////////////////////////////////////////////////////////
   v_pr_id integer;
begin

   select depl_id_origen
     into v_depl_id_origen
     from Stock
      where st_id = p_st_id;

   open rtn for
      --///////////////////////////////////////////////////////////////////////////////////////////////////
      --
      --  STOCK ITEMS AGRUPADOS POR GRUPO
      --
      --///////////////////////////////////////////////////////////////////////////////////////////////////
      select st_id,
                     min(sti_orden) sti_orden,
                     min(sti_id) sti_id,-- Cuando hay uno por grupo el id es unico

                     sum(sti_salida) sti_salida,
                     min(sti_descrip) sti_descrip,-- idem

                     sti_grupo,
                     sti.pr_id,
                     v_depl_id_origen depl_id,
                     pr_nombrecompra,
                     0 pr_eskit,
                     min(pr_llevanroserie) pr_llevanroserie,-- idem

                     min(pr_llevanrolote) pr_llevanrolote,-- idem

                     min(un_nombre) un_nombre,-- idem

                     min(sti.stl_id) stl_id,
                     min(stl_codigo) stl_codigo
        from StockItem sti
               join Producto
                on sti.pr_id = Producto.pr_id
               and st_id = p_st_id
               join Unidad
                on Producto.un_id_stock = Unidad.un_id
               left join StockLote stl
                on sti.stl_id = stl.stl_id
         where depl_id = v_depl_id_origen
                 and stik_id is null-- Solo producos que no pertenecen a un kit

        group by st_id,sti.pr_id,pr_nombrecompra,pr_eskit,sti_grupo,sti.stl_id,stl_codigo
      union
      select k.st_id,
             min(sti_orden) sti_orden,
             k.stik_id sti_id,-- Cuando hay uno por grupo el id es unico

             stik_cantidad sti_salida,
             min(sti_descrip) sti_descrip,-- idem

             max(sti_grupo),
             k.pr_id pr_id,
             v_depl_id_origen depl_id,
             prk.pr_nombrecompra,
             1 pr_eskit,
             min(stik_llevanroserie) pr_llevanroserie,-- idem

             0 pr_llevanrolote,
             min(un_nombre) un_nombre,-- idem

             min(stl.stl_id) stl_id,
             min(stl_codigo) stl_codigo
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

   open cv_2 for
      --///////////////////////////////////////////////////////////////////////////////////////////////////
      --
      --  NUMEROS DE SERIE
      --
      --///////////////////////////////////////////////////////////////////////////////////////////////////
      select sti.pr_id,
                     prns.prns_id,
                     prns.prns_codigo,
                     prns.prns_descrip,
                     prns.prns_fechavto,
                     sti.sti_grupo,
                     prns.pr_nombrecompra
        from ( ProductoNumeroSerie prns
               join StockItem sti
                on prns.prns_id = sti.prns_id
               and sti.st_id = p_st_id
                )
               join Producto p
                on prns.pr_id = p.pr_id
        group by sti.pr_id,prns.prns_id,prns.prns_codigo,prns.prns_descrip,prns.prns_fechavto,sti.sti_grupo,prns.pr_nombrecompra
        order by sti.sti_grupo;

   open c_KitItem;

   fetch c_KitItem into v_pr_id;

   while sqlserver_utilities.fetch_status(c_KitItem%found) = 0
   loop
      begin
         sp_StockProductoGetKitInfo(v_pr_id,
                                    0,
                                    rtn => cv_3);

         update tt_kit_item_serie_41
            set pr_id_kit = v_pr_id
            where pr_id_kit is null;

         fetch c_KitItem into v_pr_id;

      end;
   end loop;

   close c_KitItem;

   open cv_4 for
      select k.pr_id_kit pr_id,
             k.pr_id pr_id_item,
             p.pr_nombrecompra,
             p.pr_llevanroserie,
             cantidad
        from tt_kit_item_serie_41 k
               join Producto p
                on k.pr_id = p.pr_id;

end;
