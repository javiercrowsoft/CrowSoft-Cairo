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
-- Function: sp_doc_asiento_save()

-- drop function sp_doc_asiento_save(integer, integer);

create or replace function sp_doc_asiento_save
(
  in p_us_id integer,
  in p_asTMP_id integer
)
  returns setof row_result as
$BODY$
declare
   rtn row_result;

   v_error_msg varchar(255);
   v_error smallint;
   v_cfg_valor varchar(5000);

   v_is_new integer;
   v_orden smallint;

   v_as_id integer;
   v_as_numero integer;
   v_as_nrodoc varchar(50);
   v_as_descrip varchar(5000);
   v_as_fecha timestamp with time zone;

   v_asi_id integer;
   v_asi_orden smallint;
   v_asi_descrip varchar(5000);
   v_asi_debe decimal(18,6);
   v_asi_haber decimal(18,6);
   v_asi_origen decimal(18,6);

   v_doc_id integer;
   v_doct_id integer;
   v_ta_id integer;
   v_ccos_id integer;
   v_cue_id integer;
   v_mon_id integer;

   v_creado timestamp with time zone;
   v_modificado timestamp with time zone;
   v_modifico integer;
   
   v_cue_nombre varchar(255);
   v_cuentas varchar(5000);
   v_error_msg_aux varchar(5000);

   v_ta_propuesto smallint;
   v_ta_tipo smallint;
   v_ta_nrodoc varchar(100);
   dummyChar varchar;
begin

   -- si no existe chau
   --
   if not exists ( select asTMP_id
                   from AsientoTMP
                   where asTMP_id = p_asTMP_id ) then

      return query select * from result_failed();
      return;

   end if;
   
   select sp_cfg_getValor('Compras-General', 'Exigir Centro Costo') into v_cfg_valor;

   v_cfg_valor := coalesce(v_cfg_valor, '0');

   if to_number(v_cfg_valor) <> 0 then

      if exists ( select asi.ccos_id
                  from AsientoItemTMP asi
                  join Cuenta cue
                    on asi.cue_id = cue.cue_id
                  where asi.ccos_id is null
                    and asi.asTMP_id = p_asTMP_id
                    and cue.cue_llevacentrocosto <> 0 ) then

         v_cuentas := '';

         for v_cue_nombre in 
             select distinct cue.cue_nombre
             from AsientoItemTMP asi
             join Cuenta cue
               on asi.cue_id = cue.cue_id
             where asi.ccos_id is null
               and asi.asTMP_id = p_asTMP_id
               and cue.cue_llevacentrocosto <> 0
         loop

               v_cuentas := v_cuentas || v_cue_nombre || ', ';

         end loop;

         if length(v_cuentas) > 0 then
            
            v_cuentas := substr(v_cuentas, 1, length(v_cuentas) - 1);

         end if;

         v_error_msg_aux := 'Debe indicar un centro de costo en cada las cuentas que exigen centro de costo.'
                            || CHR(10) || CHR(10) || 'Cuentas:' || CHR(10) || v_cuentas;

         raise exception '@@ERROR_SP: %', v_error_msg_aux;

      end if;

   end if;

   select as_id,
          as_nrodoc,
          doc_id
     into v_as_id,
          v_as_nrodoc,
          v_doc_id
   from AsientoTMP
   where asTMP_id = p_asTMP_id;

   v_as_id := coalesce(v_as_id, 0);

   set TRANSACTION READ WRITE;

/*
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
//                                        insert                                                                      //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
*/

   if v_as_id = 0 then

      v_is_new := -1;

      select sp_dbGetNewId('Asiento', 'as_id') into v_as_id;
      select sp_dbGetNewId('Asiento', 'as_numero') into v_as_numero;

      select * from sp_talonario_get_propuesto(v_doc_id) into dummyChar, v_ta_propuesto, v_ta_id, v_ta_tipo;

      if v_ta_propuesto = 0 then
         if v_ta_tipo = 3 then /*Auto Impresor*/

            select sp_talonario_get_next_number(v_ta_id) into v_ta_nrodoc;

            -- con esto evitamos que dos tomen el mismo Numero
            --
            perform sp_talonario_set(v_ta_id, v_ta_nrodoc);

            v_as_nrodoc := v_ta_nrodoc;

         end if;
      end if;

      insert into Asiento
        ( as_id, as_numero, as_nrodoc, as_descrip, as_fecha, doc_id, doct_id, modifico )
        ( select v_as_id,
                 v_as_numero,
                 v_as_nrodoc,
                 as_descrip,
                 as_fecha,
                 doc_id,
                 doct_id,
                 modifico
          from AsientoTMP
          where asTMP_id = p_asTMP_id );

      select doc_id,
             as_nrodoc
        into v_doc_id,
             v_as_nrodoc
      from Asiento
      where as_id = v_as_id;

/*
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
//                                        update                                                                      //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
*/
   else

      v_is_new := 0;

      select as_id,
             as_nrodoc,
             as_descrip,
             as_fecha,
             doc_id,
             doct_id,
             modifico,
             modificado
        into v_as_id,
             v_as_nrodoc,
             v_as_descrip,
             v_as_fecha,
             v_doc_id,
             v_doct_id,
             v_modifico,
             v_modificado
      from AsientoTMP
      where asTMP_id = p_asTMP_id;

      update Asiento
         set as_nrodoc = v_as_nrodoc,
             as_descrip = v_as_descrip,
             as_fecha = v_as_fecha,
             doc_id = v_doc_id,
             doct_id = v_doct_id,
             modifico = v_modifico,
             modificado = v_modificado
      where as_id = v_as_id;

   end if;

/*
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
//                                        items                                                                       //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
*/
   v_orden := 1;

   while exists(select 1 from AsientoItemTMP where asTMP_id = p_asTMP_id and asi_orden = v_orden)
   loop

         select asi_id,
                asi_orden,
                asi_descrip,
                asi_debe,
                asi_haber,
                asi_origen,
                AsientoItemTMP.cue_id,
                ccos_id,
                mon_id
           into v_asi_id,
                v_asi_orden,
                v_asi_descrip,
                v_asi_debe,
                v_asi_haber,
                v_asi_origen,
                v_cue_id,
                v_ccos_id,
                v_mon_id
         from AsientoItemTMP
         join Cuenta
           on AsientoItemTMP.cue_id = Cuenta.cue_id
         where asTMP_id = p_asTMP_id
           and asi_orden = v_orden;

         if v_is_new <> 0 or v_asi_id = 0 then

            select sp_dbGetNewId('AsientoItem', 'asi_id') into v_asi_id;

            insert into AsientoItem
              ( as_id, asi_id, asi_orden, asi_descrip, asi_debe, asi_haber,
                asi_origen, cue_id, ccos_id, mon_id )
            values ( v_as_id, v_asi_id, v_asi_orden, v_asi_descrip, v_asi_debe, v_asi_haber,
                     v_asi_origen, v_cue_id, v_ccos_id, v_mon_id );

         else

               update AsientoItem
                  set as_id = v_as_id,
                      asi_orden = v_asi_orden,
                      asi_descrip = v_asi_descrip,
                      asi_debe = v_asi_debe,
                      asi_haber = v_asi_haber,
                      asi_origen = v_asi_origen,
                      cue_id = v_cue_id,
                      ccos_id = v_ccos_id,
                      mon_id = v_mon_id
               where as_id = v_as_id
                 and asi_id = v_asi_id;

         end if;

         v_orden := v_orden + 1;

   end loop;

   if v_is_new = 0 then

         delete from AsientoItem
         where exists ( select asi_id
                        from AsientoItemBorradoTMP
                        where as_id = v_as_id
                          and asTMP_id = p_asTMP_id
                          and asi_id = AsientoItem.asi_id );

         delete from AsientoItemBorradoTMP where as_id = v_as_id and asTMP_id = p_asTMP_id;

   end if;

/*
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
//                                     borrar temporales                                                              //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
*/

   delete from AsientoItemTMP where asTMP_ID = p_asTMP_id;
   delete from AsientoTMP where asTMP_ID = p_asTMP_id;

/*
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
//                                     valido el asiento                                                              //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
*/

   select * from sp_doc_asiento_validate(v_as_id) into v_error, v_error_msg;

   if v_error <> 0 then
      raise exception '%', v_error_msg;
   end if;

/*
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
//                                     talonario                                                                      //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
*/

   select ta_id
     into v_ta_id
   from Documento
   where doc_id = v_doc_id;

   perform sp_talonario_set(v_ta_id, v_as_nrodoc);


/*
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
//                                     historial de modificaciones                                                    //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
*/

   select modifico into v_modifico from Asiento where as_id = v_as_id;

   if v_is_new <> 0 then
      perform sp_historia_update(19001, v_as_id, v_modifico, 1);
   else
      perform sp_historia_update(19001, v_as_id, v_modifico, 3);
   end if;

/*
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
//                                     fin                                                                            //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
*/

   rtn.type := 'as_id';
   rtn.id := v_as_id;

   return next rtn;

exception
  when others then

   raise exception 'Ha ocurrido un error al grabar el asiento. sp_doc_asiento_save. %. %.',
                   sqlstate, sqlerrm;

end;
$BODY$
  language plpgsql volatile
  cost 100;
alter function sp_doc_asiento_save(integer, integer)
  owner to postgres;