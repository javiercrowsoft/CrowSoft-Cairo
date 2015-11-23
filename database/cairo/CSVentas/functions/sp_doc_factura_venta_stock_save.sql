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
-- Function: sp_doc_factura_venta_stock_save()

-- drop function sp_doc_factura_venta_stock_save(integer, integer, integer);

create or replace function sp_doc_factura_venta_stock_save
(
  in p_fvTMP_id integer,
  in p_fv_id integer,
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

   v_fv_fecha date;
   v_suc_id integer;
   v_ta_id integer;
   v_cli_id integer;

   v_sti_id integer;
   v_sti_orden smallint;
   v_sti_ingreso decimal(18,6);
   v_sti_salida decimal(18,6);

   v_depl_id_origen integer;
   v_depl_id_destino integer;
   v_depl_id_tercero integer;

   v_fvi_orden smallint;
   v_fvi_cantidad decimal(18,6);
   v_fvi_id integer;
   v_fvi_descrip varchar(255);

   v_pr_id integer;
   v_stl_id integer;

   v_creado date;
   v_modificado date;
   v_modifico integer;

   v_error smallint;
   v_success smallint;
   v_message varchar(255);

   v_bEsKit smallint;
   v_bLLevaNroSerie smallint;
   v_bLoteFifo smallint;
   v_cant_lote decimal(18,6);
   v_cant_aux decimal(18,6);

   v_ta_nrodoc varchar(100);

begin

   -- si no existe chau
   --
   if not exists ( select fv_id
                   from FacturaVenta
                   where fv_id = p_fv_id ) then
      return;
   end if;

		select st_id,
         cli_id,
         doc_id
    into v_st_id,
         v_cli_id,
         v_doc_id_factura
		from FacturaVenta
		where fv_id = p_fv_id;
	 
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
          FacturaVenta.doct_id,
          fv_nrodoc || ' ' || cli_nombre
     into v_doc_id,
          v_doct_id_factura,
          v_st_doc_cliente
   from FacturaVenta
   join Documento
     on FacturaVenta.doc_id = Documento.doc_id
   join Cliente
     on FacturaVenta.cli_id = Cliente.cli_id
   where fv_id = p_fv_id;

   if v_doct_id_factura = 1 /* Factura */ or v_doct_id_factura = 9 /* Nota de Debito */ then

      v_depl_id_destino := v_depl_id_tercero;
      v_depl_id_origen := p_depl_id;

   else

      if v_doct_id_factura = 7 /* Nota de Credito */ then

         v_depl_id_destino := p_depl_id;
         v_depl_id_origen := v_depl_id_tercero;

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
                         doct_id_cliente, id_cliente, depl_id_origen, depl_id_destino, modifico )
        ( select v_st_id,
                 v_st_numero,
                 v_st_nrodoc,
                 fv_descrip,
                 fv_fecha,
                 v_st_doc_cliente,
                 suc_id,
                 v_doc_id,
                 v_doct_id,
                 v_doct_id_factura,
                 p_fv_id,
                 v_depl_id_origen,
                 v_depl_id_destino,
                 modifico
          from FacturaVenta
          where fv_id = p_fv_id );

/*
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
//                                        update                                                                      //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
*/
   else

      v_is_new := 0;

      select fv_descrip,
             fv_fecha,
             modifico,
             modificado,
             suc_id
        into v_st_descrip,
             v_st_fecha,
             v_modifico,
             v_modificado,
             v_suc_id
      from FacturaVenta
      where fv_id = p_fv_id;

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
             id_cliente = p_fv_id,
             depl_id_origen = v_depl_id_origen,
             depl_id_destino = v_depl_id_destino,
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

      -- borro todos los items y solo hago inserts que es mucho mas simple y rapido
      --
      delete from StockItem where st_id = v_st_id;

      -- borro todos los Kit de este movimiento
      --
      delete from StockItemKit where st_id = v_st_id;

   end if;

   v_sti_orden := 0;

   perform sp_doc_factura_venta_prepare_kit(p_fv_id);

   for v_fvi_id,v_fvi_cantidad,v_pr_id,v_stl_id,v_fvi_descrip,v_bLlevaNroSerie,v_bEsKit,v_bLoteFifo in
        select fvi.fvi_id,
               fvi.fvi_cantidadaremitir * p.pr_ventastock,
               fvi.pr_id,
               fvi.stl_id,
               fvi.fvi_descrip,
               p.pr_llevanroserie,
               p.pr_eskit,
               p.pr_lotefifo
        from FacturaVentaItem fvi
        join Producto p
          on fvi.pr_id = p.pr_id
        where fvi.fv_id = p_fv_id
          and p.pr_llevastock <> 0
          and fvi.fvi_nostock = 0
   loop

         -- si es un kit hay que descomponerlo
         --
         if v_bEsKit <> 0 then

            select sp_doc_factura_venta_save_item_kit(
                                          p_fvTMP_id,
                                          v_fvi_id,
                                          v_st_id,
                                          v_fvi_cantidad,
                                          v_fvi_descrip,
                                          v_pr_id,
                                          v_depl_id_origen,
                                          v_depl_id_destino,
                                          v_stl_id) into v_sti_orden;
         else

            -- si tiene numero de serie hay que grabar un stockitem por cada uno.
            --
            if v_bLlevaNroSerie <> 0 then

               select sp_doc_factura_venta_save_nro_serie(
                                              p_fvTMP_id,
                                              v_fvi_id,
                                              v_st_id,
                                              v_fvi_cantidad,
                                              v_fvi_descrip,
                                              v_pr_id,
                                              v_depl_id_origen,
                                              v_depl_id_destino,
                                              null) into v_sti_orden;

            else

               -- consumo de lote por fifo
               --
               if v_stl_id is null and v_bLoteFifo <> 0 then
                  while v_fvi_cantidad > 0
                  loop

                        -- obtengo por Fifo el lote a descargar
                        --
                        v_stl_id := null;

                        select stl_id, stc_cantidad
                          into v_stl_id,
                               v_cant_lote
                        from ( select stc.stl_id,
                                      stc.stc_cantidad
                               from StockCache stc
                               join StockLote stl
                                 on stc.stl_id = stl.stl_id
                               where stc.pr_id = v_pr_id
                                 and stc.depl_id = p_depl_id
                                 and stc.stc_cantidad > 0
                                 and not exists ( select stl_id
                                                  from tt_t_fifo_stocklote
                                                  where stl_id = stc.stl_id
                                                  group by stl_id
                                                  having stc_cantidad - sum(stl_cantidad) <= 0 )
                               order by stl.stl_fecha asc ) t
                        limit 1;

                        -- si tengo un lote lo agrego a la lista de lotes usados
                        --
                        if v_stl_id is not null then

                           insert into tt_t_fifo_stocklote( stl_id, stl_cantidad )
                           values ( v_stl_id, v_fvi_cantidad );

                        -- si no hay lote le asigno como cantidad lo pendiente
                        -- esto va a generar stock negativo en el deposito
                        -- de la temporal forzando el mensaje de error.
                        --
                        -- en una version futura vamos a lanzar el error desde aca
                        -- ya que si hay stock sin lote en el deposito temporal para
                        -- este producto, el sistema lo usaria, y no notificaria al usuario
                        -- que no hay lotes de DIT para consumir.
                        --
                        -- hay que tener en cuenta que no deberia haber productos sin
                        -- lote en este deposito, con lo cual el caso que menciono arriba
                        -- no deberia darse.
                        --
                        else

                           v_cant_lote := v_fvi_cantidad;

                        end if;

                        if v_cant_lote < v_fvi_cantidad then

                           v_cant_aux := v_cant_lote;

                        else

                           v_cant_aux := v_fvi_cantidad;

                        end if;

                        v_fvi_cantidad := v_fvi_cantidad - v_cant_aux;

                        select sp_doc_factura_venta_stock_item_save(
                                                       0,
                                                       v_st_id,
                                                       v_cant_aux,
                                                       v_fvi_descrip,
                                                       v_pr_id,
                                                       v_depl_id_origen,
                                                       v_depl_id_destino,
                                                       null,
                                                       null,
                                                       v_stl_id) into v_sti_orden;

                  end loop;

               -- solo son simples stockitems (una pavada)
               --
               else

                  select sp_doc_factura_venta_stock_item_save(
                                                 0,
                                                 v_st_id,
                                                 v_fvi_cantidad,
                                                 v_fvi_descrip,
                                                 v_pr_id,
                                                 v_depl_id_origen,
                                                 v_depl_id_destino,
                                                 null,
                                                 null,
                                                 v_stl_id) into v_sti_orden;

               end if;
            end if;
         end if;
   end loop;

   -- agrego a StockCache lo que se movio con los items de este movimiento
   --
   select * from sp_doc_stock_cache_update(v_st_id, 0 /* sumar */) into v_message, v_success;
                                  
   -- valido que no quede nada en interno por culpa de este movimiento
   --
   if v_doct_id_factura = 7 then

      if exists ( select 1
                  from ProductoNumeroSerie prns
                  join StockItem sti
                    on prns.prns_id = sti.prns_id
                  where sti.st_id = v_st_id
                    and prns.depl_id = -2 ) then

         v_message := 'Esta nota de credito esta enviando numeros de serie al deposito interno. Debe comunicarse con soporte de CrowSoft para solucionar el problema.';
         raise exception '%', v_message;
      end if;

   end if;

/*
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
//                                vinculo la factura con su stock                                                     //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
*/

   update FacturaVenta set st_id = v_st_id where fv_id = p_fv_id;

   p_error := 0;

exception
   when others then

      if p_raise_error <> 0 then

         raise exception 'Ha ocurrido un error al grabar la factura de venta. sp_doc_factura_venta_stock_save.%. %.',
                         sqlstate, sqlerrm;

      else

         p_error_msg := 'Ha ocurrido un error al grabar la factura de venta. sp_doc_factura_venta_stock_save.';
         p_error_msg := '@@ERROR_SP:' || coalesce(p_error_msg, '');
         p_error := -1;

      end if;

end;
$BODY$
  language plpgsql volatile
  cost 100;
alter function sp_doc_factura_venta_stock_save(integer, integer, integer, integer)
  owner to postgres;

