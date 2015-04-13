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
-- Function: sp_doc_factura_compra_asiento_save()

-- drop function sp_doc_factura_compra_stock_save(integer, integer);

create or replace
function sp_doc_factura_compra_stock_save
(
  in p_fcTMP_id integer,
  in p_fc_id integer,
  in p_depl_id integer,
  in p_raise_error integer default -1,
  out p_error integer,
  out p_error_msg varchar
)
  returns record as
$BODY$
declare
   v_is_new integer;

   v_st_id integer;
   v_st_numero integer;
   v_st_nrodoc varchar(50);
   v_st_descrip varchar(5000);
   v_st_fecha date;
   v_st_doc_cliente varchar(5000);

   v_doct_id integer;
   v_doc_id integer;
   v_doct_id_factura integer;
   v_doc_id_factura integer;

   v_fc_fecha date;
   v_suc_id integer;
   v_ta_id integer;
   v_prov_id integer;

   v_sti_id integer;
   v_sti_orden smallint;
   v_sti_ingreso decimal(18,6);
   v_sti_salida decimal(18,6);

   v_depl_id_destino integer;
   v_depl_id_origen integer;
   v_depl_id_tercero integer;

   v_fci_orden smallint;
   v_fci_cantidad decimal(18,6);
   v_fci_id integer;
   v_fci_descrip varchar(255);


   v_pr_id integer;

   v_pr_llevanroserie smallint;
   v_prns_id integer;
   v_prns_codigo varchar(100);
   v_prns_descrip varchar(255);
   v_prns_fechavto date;

   v_pr_llevanrolote smallint;
   v_stl_id integer;
   v_stl_codigo varchar(50);
   v_stl_fecha date;

   v_creado date;
   v_modificado date;
   v_modifico integer;

   v_error smallint;
   v_success smallint;
   v_message varchar(255);

   v_ta_nrodoc varchar(100);

begin

   -- si no existe chau
   --
   if not exists ( select fc_id
                   from FacturaCompra
                   where fc_id = p_fc_id ) then
      return; 
   end if;

   select st_id,
          prov_id,
          doc_id,
          modifico,
          modificado,
          fc_fecha
     into v_st_id,
          v_prov_id,
          v_doc_id_factura,
          v_modifico,
          v_modificado,
          v_stl_fecha
   from FacturaCompra
   where fc_id = p_fc_id;

   v_st_id := coalesce(v_st_id, 0);
   v_depl_id_tercero := -3; /* select * from depositologico */

   SET TRANSACTION READ WRITE;

/*
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
//                                        insert                                                                      //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
*/

   -- obtengo el documento @doc_id
   --
   select doc_id_Stock,
          FacturaCompra.doct_id,
          fc_nrodoc || ' ' || prov_nombre
     into v_doc_id,
          v_doct_id_factura,
          v_st_doc_cliente
   from FacturaCompra
   join Documento
     on FacturaCompra.doc_id = Documento.doc_id
   join Proveedor
     on FacturaCompra.prov_id = Proveedor.prov_id
   where fc_id = p_fc_id;

   if v_doct_id_factura = 2 /* Factura */ or v_doct_id_factura = 10 /* Nota de Debito */ then

      v_depl_id_origen := v_depl_id_tercero;
      v_depl_id_destino := p_depl_id;

   else

      if v_doct_id_factura = 8 /* Nota de Credito */ then

         v_depl_id_origen := p_depl_id;
         v_depl_id_destino := v_depl_id_tercero;

      end if;

   end if;

   if v_st_id = 0 then

      v_is_new := -1;

      select sp_dbGetNewId('Stock', 'st_id') into v_st_id;
      select sp_dbGetNewId('Stock', 'st_numero') into v_st_numero;

      select doct_id,
             ta_id
        into v_doct_id,
             v_ta_id
      from Documento
      where doc_id = v_doc_id;

      select sp_talonario_get_next_number(v_ta_id) into v_ta_nrodoc;

      v_st_nrodoc := v_ta_nrodoc;

      -- con esto evitamos que dos tomen el mismo Numero
      --
      perform sp_talonario_set(v_ta_id, v_ta_nrodoc);

      insert into Stock( st_id, st_numero, st_nrodoc, st_descrip, st_fecha, st_doc_cliente, suc_id, doc_id, doct_id,
                         doct_id_cliente, id_cliente, depl_id_destino, depl_id_origen, modifico )
        ( select v_st_id,
                 v_st_numero,
                 v_st_nrodoc,
                 fc_descrip,
                 fc_fecha,
                 v_st_doc_cliente,
                 suc_id,
                 v_doc_id,
                 v_doct_id,
                 v_doct_id_factura,
                 p_fc_id,
                 v_depl_id_destino,
                 v_depl_id_origen,
                 v_modifico
          from FacturaCompra
          where fc_id = p_fc_id );

/*
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
//                                        update                                                                      //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
*/
   else

      /*
       si es una modificacion, lo primero que hago es borrar
       los numeros de serie asociados a los renglones borrados
      */
      insert into tt_productoNroSerieDel
        ( select sti.prns_id
          from StockItem sti
          join FacturaCompraItemBorradoTMP fci
            on sti.st_id = v_st_id
            and fci.fc_id = p_fc_id
            and fci.fcTMP_id = p_fcTMP_id
            and sti.sti_grupo = fci.fci_id );

      /* ahora si el update */

      v_is_new := 0;

      select fc_descrip,
             fc_fecha,
             suc_id
        into v_st_descrip,
             v_st_fecha,
             v_suc_id
      from FacturaCompra
      where fc_id = p_fc_id;

      select doc_id,
             doct_id
        into v_doc_id,
             v_doct_id
      from Stock
      where st_id = v_st_id;

      update Stock
         set st_descrip = v_st_descrip,
             st_fecha = v_st_fecha,
             st_doc_cliente = v_st_doc_cliente,
             doc_id = v_doc_id,
             doct_id = v_doct_id,
             doct_id_cliente = v_doct_id_factura,
             id_cliente = p_fc_id,
             depl_id_destino = v_depl_id_destino,
             depl_id_origen = v_depl_id_origen,
             modifico = v_modifico,
             modificado = v_modificado
      where st_id = v_st_id;

   end if;

/*
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
//                                        items                                                                       //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
*/

   if v_is_new = 0 then

      -- quito de stockcache lo que se movio con los items de este movimiento
      --
      select * from sp_doc_stock_cache_update(v_st_id, 1 /* restar */, 1 /* no update prns */) into v_message, v_success;

      if coalesce(v_success, 0) = 0 then
         raise exception '%', v_message;
      end if;

      -- borro todos los items y solo hago inserts que se mucho mas simple y rapido
      --
      delete from StockItem where st_id = v_st_id;
      delete from StockCache where prns_id in ( select prns_id from tt_productoNroSerieDel );
      delete from ProductoNumeroSerie where prns_id in ( select prns_id from tt_productoNroSerieDel );

   end if;

   v_sti_orden := 0;

   for v_fci_id,v_fci_cantidad,v_pr_id,v_fci_descrip,v_pr_llevanroserie,v_pr_llevanrolote,v_stl_id,v_stl_codigo in
      select fci.fci_id,
              case
                 when p.pr_stockcompra <> 0 then fci.fci_cantidadaremitir / p.pr_stockcompra
                 else 0
              end col,
              fci.pr_id,
              fci.fci_descrip,
              p.pr_llevanroserie,
              p.pr_llevanrolote,
              fci.stl_id,
              fcit.stl_codigo
      from FacturaCompraItem fci
      join FacturaCompraItemTMP fcit
        on fci.fci_id = fcit.fci_id
       and fcit.fcTMP_id = p_fcTMP_id
      join Producto p
        on fci.pr_id = p.pr_id
      where fci.fc_id = p_fc_id
        and p.pr_llevastock <> 0
   loop

      --  lleva nro de lote
      --
      if v_pr_llevanrolote <> 0 then
         if v_stl_id is null then

            select stl_id
              into v_stl_id
            from StockLote
            where stl_codigo = v_stl_codigo
              and pr_id = v_pr_id;

            if v_stl_id is null then
            
               select sp_dbGetNewId('StockLote', 'stl_id') into v_stl_id;

               insert into StockLote( stl_id, stl_codigo, stl_nrolote, pr_id, stl_fecha, modifico )
               values ( v_stl_id, v_stl_codigo, v_stl_codigo, v_pr_id, v_stl_fecha, v_modifico );

            end if;

            update FacturaCompraItem set stl_id = v_stl_id where fci_id = v_fci_id;

         else

            -- si ya existe un lote para este articulo con este codigo
            -- cambio el stl_id, La tarea de validacion de lotes se encargara de
            -- eliminar lotes que no figuran en StockItem
            --
            if exists ( select *
                        from StockLote
                        where stl_id <> v_stl_id
                          and stl_codigo = v_stl_codigo
                          and pr_id = v_pr_id ) then

               select min(stl_id)
                 into v_stl_id
               from StockLote
               where stl_id <> v_stl_id
                 and stl_codigo = v_stl_codigo
                 and pr_id = v_pr_id;

               update FacturaCompraItem
                     set stl_id = v_stl_id
               where fci_id = v_fci_id;

            -- actualizo el codigo del lote
            --
            else

               update StockLote
                  set stl_codigo = v_stl_codigo
               where stl_id = v_stl_id;

            end if;

         end if;

      end if;

      --  no lleva nro de serie
      --
      if v_pr_llevanroserie = 0 then

         select sp_dbGetNewId('StockItem', 'sti_id') into v_sti_id;

         insert into StockItem( st_id, sti_id, sti_orden, sti_ingreso, sti_salida, sti_descrip, pr_id, depl_id, stl_id )
         values ( v_st_id, v_sti_id, v_sti_orden, 0, v_fci_cantidad, v_fci_descrip, v_pr_id, v_depl_id_origen, v_stl_id );

         v_sti_orden := v_sti_orden + 1;

         select sp_dbGetNewId('StockItem', 'sti_id') into v_sti_id;

         insert into StockItem( st_id, sti_id, sti_orden, sti_ingreso, sti_salida, sti_descrip, pr_id, depl_id, stl_id )
         values ( v_st_id, v_sti_id, v_sti_orden, v_fci_cantidad, 0, v_fci_descrip, v_pr_id, v_depl_id_destino, v_stl_id );

         v_sti_orden := v_sti_orden + 1;

      --  lleva nro de serie
      --
      else

         for v_prns_id,v_prns_codigo,v_prns_descrip,v_prns_fechavto in
            select prns_id,
                   prns_codigo,
                   prns_descrip,
                   prns_fechavto
            from FacturaCompraItemSerieTMP
            where fci_id = v_fci_id
              and fcTMP_id = p_fcTMP_id
         loop

            --  numero de serie
            --
            if v_prns_id <= 0 then
            
               select sp_dbGetNewId('ProductoNumeroSerie', 'prns_id') into v_prns_id;

               insert into ProductoNumeroSerie( prns_id, prns_codigo, prns_descrip, prns_fechavto, pr_id,
                                                depl_id, stl_id, modifico )
               values ( v_prns_id, v_prns_codigo, v_prns_descrip, v_prns_fechavto, v_pr_id, v_depl_id_destino,
                        v_stl_id, v_modifico );

            else

               update ProductoNumeroSerie
                     set prns_codigo = v_prns_codigo,
                         prns_descrip = v_prns_descrip,
                         prns_fechavto = v_prns_fechavto,
                         pr_id = v_pr_id,
                         modificado = v_modificado,
                         modifico = v_modifico
               where prns_id = v_prns_id;

            end if;

            -- movimiento de stock
            --
            select sp_dbGetNewId('StockItem','sti_id') into v_sti_id;

            insert into StockItem( st_id, sti_id, sti_orden, sti_ingreso, sti_salida, sti_descrip, sti_grupo,
                                   pr_id, depl_id, prns_id, stl_id )
            values ( v_st_id, v_sti_id, v_sti_orden, 0, 1, v_fci_descrip, v_fci_id, v_pr_id, v_depl_id_origen,
                     v_prns_id, v_stl_id );

            v_sti_orden := v_sti_orden + 1;

            select sp_dbGetNewId('StockItem', 'sti_id') into v_sti_id;

            insert into StockItem( st_id, sti_id, sti_orden, sti_ingreso, sti_salida, sti_descrip, sti_grupo,
                                   pr_id, depl_id, prns_id, stl_id )
            values ( v_st_id, v_sti_id, v_sti_orden, 1, 0, v_fci_descrip, v_fci_id, v_pr_id, v_depl_id_destino,
                     v_prns_id, v_stl_id );

            v_sti_orden := v_sti_orden + 1;

         end loop;

      end if;

   end loop;

   -- agrego a stockcache lo que se movio con los items de este movimiento
   --
   select * from sp_doc_stock_cache_update(v_st_id, 0 /* sumar */) into v_message, v_success;

   if coalesce(v_success, 0) = 0 then
      raise exception '%', v_message;
   end if;

/*
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
//                                vinculo la factura con su stock                                                     //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
*/

   update FacturaCompra set st_id = v_st_id where fc_id = p_fc_id;

/*
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
//                                borro los numeros de serie                                                          //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
*/
   delete from StockCache
   where prns_id in ( select prns_id
                      from FacturaCompraItemSerieBTMP
                      where fcTMP_id = p_fcTMP_id );

   delete from ProductoNumeroSerie
   where prns_id in ( select prns_id
                      from FacturaCompraItemSerieBTMP
                      where fcTMP_id = p_fcTMP_id );

   p_error := 0;

exception
   when others then

      if p_raise_error <> 0 then

         raise exception 'Ha ocurrido un error al grabar la factura de compra. sp_doc_factura_compra_stock_save.%. %.',
                         sqlstate, sqlerrm;

      else

         p_error_msg := 'Ha ocurrido un error al grabar la factura de compra. sp_doc_factura_compra_stock_save.';

      end if;

      p_error := -1;
      v_message := '@@ERROR_SP:' || coalesce(v_message, '');

end;
$BODY$
  language plpgsql volatile
  cost 100;
alter function sp_doc_factura_compra_stock_save(integer, integer, integer, integer)
  owner to postgres;