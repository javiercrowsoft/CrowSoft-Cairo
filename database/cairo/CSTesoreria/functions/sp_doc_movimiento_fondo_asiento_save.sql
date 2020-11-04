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
-- Function: sp_doc_movimiento_fondo_asiento_save()

-- drop function sp_doc_movimiento_fondo_asiento_save(integer, integer);

create or replace
function sp_doc_movimiento_fondo_asiento_save
(
  in p_mf_id integer,
  in p_raise_error integer default -1,
  out p_error integer,
  out p_error_msg varchar
)
  returns record as
$BODY$
declare
   v_is_new integer;
   
   v_as_id integer;
   v_as_numero integer;
   v_as_nrodoc varchar(50);
   v_as_descrip varchar(5000);
   v_as_doc_cliente varchar(5000);
   v_as_fecha timestamp with time zone;

   v_asi_orden smallint;
   v_asi_debe decimal(18,6);
   v_asi_haber decimal(18,6);
   v_asi_origen decimal(18,6);
   
   v_cli_id integer;
   v_doc_id_movimientoFondo integer;

   v_doc_id integer;
   v_doct_id integer;
   v_doct_id_movimientoFondo integer;
   v_doc_id_cliente integer;

   v_mf_fecha timestamp with time zone;

   v_ta_id integer;
   
   v_ccos_id_cliente integer;
   v_ccos_id integer;
   
   v_mon_id integer;
   
   v_cue_id integer;

   v_mfi_id integer;   
   v_mfi_orden smallint;
   
   v_cheq_id integer;
      
   v_creado timestamp with time zone;
   v_modificado timestamp with time zone;
   v_modifico integer;

   v_error smallint;

   v_ta_ultimoNro integer;
   v_ta_mascara varchar(50);

begin

   p_error := 0;

   -- si no existe chau
   --
   if not exists ( select mf_id
                   from MovimientoFondo
                   where mf_id = p_mf_id
                     and est_id <> 7 ) then
      return; 
   end if;
   
   select as_id,
          cli_id,
          doc_id
   into   v_as_id,
          v_cli_id,
          v_doc_id_movimientoFondo
   from MovimientoFondo
   where mf_id = p_mf_id;

   v_as_id := coalesce(v_as_id, 0);

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
   select doc_id_asiento,
          MovimientoFondo.doct_id,
          Documento.doc_id,
          Documento.mon_id,
          ccos_id,
          mf_nrodoc || ' ' || coalesce(cli_nombre, '')
     into v_doc_id,
          v_doct_id_movimientoFondo,
          v_doc_id_cliente,
          v_mon_id,
          v_ccos_id_cliente,
          v_as_doc_cliente
   from MovimientoFondo
   join Documento
     on MovimientoFondo.doc_id = Documento.doc_id
   left join Cliente
          on MovimientoFondo.cli_id = Cliente.cli_id
   where mf_id = p_mf_id;

   if v_as_id = 0 then

      v_is_new := -1;

      select sp_dbGetNewId('Asiento', 'as_id') into v_as_id;
      select sp_dbGetNewId('Asiento', 'as_numero') into v_as_numero;

      select ta_ultimonro,
             ta_mascara,
             doct_id
        into v_ta_ultimoNro,
             v_ta_mascara,
             v_doct_id
      from Documento
      join Talonario
        on Documento.ta_id = Talonario.ta_id
      where doc_id = v_doc_id;

      v_ta_ultimoNro := v_ta_ultimoNro + 1;
      v_as_nrodoc := trim(to_char(v_ta_ultimoNro));
      v_as_nrodoc := substr(v_ta_mascara, 1, length(v_ta_mascara) - length(v_as_nrodoc)) || v_as_nrodoc;

      insert into Asiento ( as_id, as_numero, as_nrodoc, as_descrip, as_fecha, as_doc_cliente, doc_id, doct_id,
                            doct_id_cliente, doc_id_cliente, id_cliente, modifico )
           ( select v_as_id,
                    v_as_numero,
                    v_as_nrodoc,
                    mf_descrip,
                    mf_fecha,
                    v_as_doc_cliente,
                    v_doc_id,
                    v_doct_id,
                    v_doct_id_movimientoFondo,
                    v_doc_id_cliente,
                    p_mf_id,
                    modifico
             from MovimientoFondo
             where mf_id = p_mf_id );

/*
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
//                                        update                                                                      //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
*/
   else

      v_is_new := 0;

      select mf_descrip,
             mf_fecha,
             modifico,
             modificado
        into v_as_descrip,
             v_as_fecha,
             v_modifico,
             v_modificado
      from MovimientoFondo
      where mf_id = p_mf_id;

      select doc_id,
             doct_id
        into v_doc_id,
             v_doct_id
      from Asiento
      where as_id = v_as_id;


      update Asiento
         set as_descrip = v_as_descrip,
             as_fecha = v_as_fecha,
             as_doc_cliente = v_as_doc_cliente,
             doc_id = v_doc_id,
             doct_id = v_doct_id,
             doct_id_cliente = v_doct_id_movimientoFondo,
             doc_id_cliente = v_doc_id_cliente,
             id_cliente = p_mf_id,
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
   -- borro todos los items y solo hago inserts que se mucho mas simple y rapido
   --
   delete from AsientoItem where as_id = v_as_id;

   v_asi_orden := 2;

   for v_asi_debe,v_asi_origen,v_cue_id,v_ccos_id,v_cheq_id in
      select mfi_importe,
             mfi_importeorigen,
             cue_id_debe,
             ccos_id,
             cheq_id
      from MovimientoFondoItem
      where mf_id = p_mf_id
   loop

      v_asi_haber := 0;

      perform sp_doc_asiento_save_item(
                               v_is_new,
                               0,
                               v_as_id,
                               v_asi_orden,
                               v_asi_debe,
                               v_asi_haber,
                               v_asi_origen,
                               0,
                               v_mon_id,
                               v_cue_id,
                               v_ccos_id,
                               v_cheq_id,
                               '');

      v_asi_orden := v_asi_orden + 1;

   end loop;

   for v_asi_haber,v_asi_origen,v_cue_id,v_ccos_id,v_cheq_id in
      select mfi_importe,
             case
                when mfi_tipo = 2 then mfi_importeorigenhaber
                else mfi_importeorigen
             end col,
             cue_id_haber,
             ccos_id,
             cheq_id
      from MovimientoFondoItem
      where mf_id = p_mf_id
   loop

      v_asi_debe := 0;

      perform sp_doc_asiento_save_item(
                            v_is_new,
                            0,
                            v_as_id,
                            v_asi_orden,
                            v_asi_debe,
                            v_asi_haber,
                            v_asi_origen,
                            0,
                            v_mon_id,
                            v_cue_id,
                            v_ccos_id,
                            v_cheq_id,
                            '');

      v_asi_orden := v_asi_orden + 1;

   end loop;

/*
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                               //
//                                valido el asiento                                                              //
//                                                                                                               //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
*/
   select * from sp_doc_asiento_validate(v_as_id) into v_error, p_error_msg;

   if v_error <> 0 then
      raise exception '%', p_error_msg;
   end if;

/*
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                               //
//                                talonario                                                                      //
//                                                                                                               //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
*/
   select ta_id
     into v_ta_id
   from Documento
   where doc_id = v_doc_id;

   perform sp_talonario_set(v_ta_id, v_as_nrodoc);

/*
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                               //
//                                vinculo el movimiento fondos con su asiento                                    //
//                                                                                                               //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
*/
   update MovimientoFondo
      set as_id = v_as_id,
          mf_grabarasiento = 0
   where mf_id = p_mf_id;

   p_error := 0;

exception
   when others then

      if p_raise_error <> 0 then

         raise exception 'Ha ocurrido un error al grabar el movimiento de fondos. sp_doc_movimiento_fondo_asiento_save. %. %.',
                         sqlstate, sqlerrm;
      else

         p_error := -1;
         p_error_msg := sqlstate || ';' || sqlerrm || ';';

      end if;

end;
$BODY$
  language plpgsql volatile
  cost 100;
alter function sp_doc_movimiento_fondo_asiento_save(integer, integer)
  owner to postgres;