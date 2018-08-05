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
-- Function: sp_doc_stock_save()

-- drop function sp_doc_stock_save(integer, integer);

create or replace function sp_doc_stock_save
(
  in p_us_id integer,
  in p_stTMP_id integer
)
  returns setof row_result as
$BODY$
declare
   rtn row_result;

   v_success smallint;
   v_error smallint;
   v_message varchar(255);
   v_cfg_valor varchar(5000);

   v_is_new integer;

   v_st_id integer;
   v_sti_id integer;

   v_orden smallint;
   v_doct_id integer;
   v_doc_id integer;
   v_suc_id integer;
   v_ta_id integer;
   v_lgj_id integer;
   v_depl_id_origen integer;
   v_depl_id_destino integer;

   v_st_nrodoc varchar(50);
   v_st_numero integer;
   v_st_descrip varchar(5000);
   v_st_fecha date;

   v_creado date;
   v_modificado date;
   v_modifico integer;

   v_sti_orden smallint;
   v_sti_ingreso decimal(18,6);
   v_sti_salida decimal(18,6);
   v_sti_descrip varchar(5000);
   v_sti_grupo integer;

   v_depl_id integer;
   v_pr_id integer;
   v_prns_id integer;
   v_pr_id_kit integer;
   v_prns_descrip varchar(255);
   v_prns_fechavto date;
   v_stl_id integer;

   -- Kits
   --
   v_stik_orden smallint;
   v_stik_llevanroserie integer;
   v_stik_id integer;
   v_stik_cantidad integer;
   v_lastStik_orden smallint;

   v_ta_propuesto smallint;
   v_ta_tipo smallint;
   v_ta_nrodoc varchar(100);
   dummyChar varchar;

begin

   -- si no existe chau
   --
   if not exists ( select stTMP_id
                   from StockTMP
                   where stTMP_id = p_stTMP_id ) then

      return query select * from result_failed();
      return;

   end if;

   select st_id,
          doc_id,
          st_nrodoc
     into v_st_id,
          v_doc_id,
          v_st_nrodoc
   from StockTMP
   where stTMP_id = p_stTMP_id;

   v_st_id := coalesce(v_st_id, 0);

   set TRANSACTION READ WRITE;

/*
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
//                                        insert                                                                      //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
*/

   if v_st_id = 0 then

      v_is_new := -1;

      select sp_dbGetNewId('Stock', 'st_id') into v_st_id;
      select sp_dbGetNewId('Stock', 'st_numero') into v_st_numero;

      select * from sp_talonario_get_propuesto(v_doc_id, 0, 0) into dummyChar, v_ta_propuesto, v_ta_id, v_ta_tipo;

      if v_ta_propuesto = 0 then
         if v_ta_tipo = 3 then /*Auto Impresor*/

            select sp_talonario_get_next_number(v_ta_id) into v_ta_nrodoc;

            -- con esto evitamos que dos tomen el mismo numero
            --
            perform sp_talonario_set(v_ta_id, v_ta_nrodoc);

            v_st_nrodoc := v_ta_nrodoc;

         end if;
      end if;

      insert into Stock
        ( st_id, st_numero, st_nrodoc, st_descrip, st_fecha, suc_id, doc_id, doct_id, lgj_id,
          depl_id_origen, depl_id_destino, modifico )
        ( select v_st_id,
                 v_st_numero,
                 v_st_nrodoc,
                 st_descrip,
                 st_fecha,
                 suc_id,
                 doc_id,
                 doct_id,
                 lgj_id,
                 depl_id_origen,
                 depl_id_destino,
                 modifico
          from StockTMP
          where stTMP_id = p_stTMP_id );

      select st_nrodoc
        into v_st_nrodoc
      from Stock
      where st_id = v_st_id;
/*
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
//                                        update                                                                      //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
*/
   else

      v_is_new := 0;

      select st_id,
             st_descrip,
             st_fecha,
             suc_id,
             doct_id,
             lgj_id,
             depl_id_origen,
             depl_id_destino,
             modifico,
             modificado
        into v_st_id,
             v_st_descrip,
             v_st_fecha,
             v_suc_id,
             v_doct_id,
             v_lgj_id,
             v_depl_id_origen,
             v_depl_id_destino,
             v_modifico,
             v_modificado
      from StockTMP
      where stTMP_id = p_stTMP_id;

      update Stock
         set st_nrodoc = v_st_nrodoc,
             st_descrip = v_st_descrip,
             st_fecha = v_st_fecha,
             suc_id = v_suc_id,
             doc_id = v_doc_id,
             doct_id = v_doct_id,
             lgj_id = v_lgj_id,
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

   select * from sp_doc_stock_validate_fisico(p_stTMP_id) into v_message, v_success;

   if coalesce(v_success, 0) = 0 then
      raise exception '%', v_message;
   end if;

   v_lastStik_orden := 0;

/*
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
//                                        items                                                                       //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
*/

   v_orden := 1;

   while exists(select 1 from StockItemTMP where stTMP_id = p_stTMP_id and sti_orden = v_orden)
   loop

      select sti_id,
              sti_orden,
              sti_ingreso,
              sti_salida,
              sti_grupo,
              pr_id,
              pr_id_kit,
              depl_id,
              prns_id,
              prns_descrip,
              prns_fechavto,
              stik_orden,
              stik_cantidad,
              stl_id
         into v_sti_id,
              v_sti_orden,
              v_sti_ingreso,
              v_sti_salida,
              v_sti_grupo,
              v_pr_id,
              v_pr_id_kit,
              v_depl_id,
              v_prns_id,
              v_prns_descrip,
              v_prns_fechavto,
              v_stik_orden,
              v_stik_cantidad,
              v_stl_id
         from StockItemTMP
         where stTMP_id = p_stTMP_id
           and sti_orden = v_orden;

         -- kits
         --
         if v_stik_orden <> 0 then
            if v_stik_orden <> v_lastStik_orden then

               select sp_dbGetNewId('StockItemKit', 'stik_id') into v_stik_id;

               if exists ( select *
                           from StockItemTMP
                           where stTMP_id = p_stTMP_id
                             and stik_orden = v_stik_orden
                             and prns_id is not null )
               then
                  v_stik_llevanroserie := 1;
               else
                  v_stik_llevanroserie := 0;
               end if;

               insert into StockItemKit ( stik_id, stik_cantidad, pr_id, st_id, stik_llevanroserie )
                                 values ( v_stik_id, v_stik_cantidad, v_pr_id_kit, v_st_id, v_stik_llevanroserie );

               v_lastStik_orden := v_Stik_orden;

            end if;

         else

            v_stik_id := null;

         end if;

         if v_prns_id is not null then

            select stl_id into v_stl_id from ProductoNumeroSerie where prns_id = v_prns_id;

         end if;

         select sp_dbGetNewId('StockItem', 'sti_id') into v_sti_id;

         insert into StockItem
                ( st_id, sti_id, sti_orden, sti_ingreso, sti_salida, sti_grupo, pr_id, stik_id, depl_id,
                  prns_id, pr_id_kit, stl_id )
         values ( v_st_id, v_sti_id, v_sti_orden, v_sti_ingreso, v_sti_salida, v_sti_grupo, v_pr_id, v_stik_id, v_depl_id,
                  v_prns_id, v_pr_id_kit, v_stl_id );

         if coalesce(v_prns_id, 0) <> 0 then

            update ProductoNumeroSerie
               set prns_descrip = v_prns_descrip,
                   prns_fechavto = v_prns_fechavto
               where prns_id = v_prns_id;

         end if;

         v_orden := v_orden + 1;

   end loop;

   -- agrego a StockCache lo que se movio con los items de este movimiento
   --
   select * from sp_doc_stock_cache_update(v_st_id, 0 /* sumar */) into v_message, v_success;

   if coalesce(v_success, 0) = 0 then
      raise exception '%', v_message;
   end if;

/*
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
//                                     borrar temporales                                                              //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
*/

/*
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
//                                     talonarios                                                                     //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
*/

   select v_ta_id = ta_id from documento where doc_id = v_doc_id;

   perform sp_talonario_set(v_ta_id, v_st_nrodoc);


/*
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
//                                     historial de modificaciones                                                    //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
*/

   select modifico into v_modifico from Stock where st_id = v_st_id;

   if v_is_new <> 0 then
      perform sp_historia_update(20001, v_st_id, v_modifico, 1);
   else
      perform sp_historia_update(20001, v_st_id, v_modifico, 3);
   end if;

/*
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
//                                     fin                                                                            //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
*/

   rtn.type := 'st_id';
   rtn.id := v_st_id;

   return next rtn;

exception
   when others then

     raise exception 'Ha ocurrido un error al grabar el movimiento de stock. sp_doc_stock_save. %. %.',
                      sqlstate, sqlerrm;

end;
$BODY$
  language plpgsql volatile
  cost 100;
alter function sp_doc_stock_save(integer, integer)
  owner to postgres;