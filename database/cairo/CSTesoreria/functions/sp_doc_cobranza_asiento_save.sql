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
-- Function: sp_doc_cobranza_asiento_save()

-- drop function sp_doc_cobranza_asiento_save(integer, integer);

create or replace
function sp_doc_cobranza_asiento_save
(
  in p_cobz_id integer,
  in p_raise_error integer default -1,
  in p_fc_id integer default null,
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
   v_as_fecha date;

   v_asi_orden smallint;
   v_asi_debe decimal(18,6);
   v_asi_haber decimal(18,6);
   v_asi_origen decimal(18,6);

   v_cli_id integer;
   v_doc_id_cobranza integer;

   v_doct_id integer;
   v_doc_id integer;
   v_doct_id_cobranza integer;
   v_doc_id_cliente integer;

   v_cobz_fecha date;

   v_ta_id integer;

   v_ccos_id_cliente integer;
   v_ccos_id integer;

   v_mon_id integer;

   v_cue_id integer;

   v_cobzi_orden smallint;
   v_cobzi_importe decimal(18,6);
   v_cobzi_importeorigen decimal(18,6);

   v_cheq_id integer;

   v_creado date;
   v_modificado date;
   v_modifico integer;

   v_error smallint;

   v_ta_ultimonro integer;
   v_ta_mascara varchar(50);

begin

   p_error := 0;

   -- si no existe chau
   --
   if not exists ( select cobz_id
                   from Cobranza
                   where cobz_id = p_cobz_id
                     and est_id <> 7 ) then
      return;
   end if;

   select   as_id,
            cli_id,
            doc_id
   into     v_as_id,
            v_cli_id,
            v_doc_id_cobranza
   from Cobranza
   where cobz_id = p_cobz_id;

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
          Cobranza.doct_id,
          Documento.doc_id,
          ccos_id,
          cobz_nrodoc || ' ' || cli_nombre
     into v_doc_id,
          v_doct_id_cobranza,
          v_doc_id_cliente,
          v_ccos_id_cliente,
          v_as_doc_cliente
   from Cobranza
   join Documento
     on Cobranza.doc_id = Documento.doc_id
   join Cliente
     on Cobranza.cli_id = Cliente.cli_id
   where cobz_id = p_cobz_id;

   if v_as_id = 0 then

      v_is_new := -1;

      select sp_dbGetNewId('Asiento', 'as_id') into v_as_id;
      select sp_dbGetNewId('Asiento', 'as_numero') into v_as_numero;

      select ta_ultimonro,
             ta_mascara,
             doct_id
        into v_ta_ultimonro,
             v_ta_mascara,
             v_doct_id
      from Documento
      join Talonario
        on Documento.ta_id = Talonario.ta_id
      where doc_id = v_doc_id;

      v_ta_ultimonro := v_ta_ultimonro + 1;
      v_as_nrodoc := trim(to_char(v_ta_ultimonro));
      v_as_nrodoc := substr(v_ta_mascara, 1, length(v_ta_mascara) - length(v_as_nrodoc)) || v_as_nrodoc;

      insert into Asiento ( as_id, as_numero, as_nrodoc, as_descrip, as_fecha, as_doc_cliente, doc_id, doct_id,
                            doct_id_cliente, doc_id_cliente, id_cliente, modifico )
         ( select v_as_id,
                  v_as_numero,
                  v_as_nrodoc,
                  cobz_descrip,
                  cobz_fecha,
                  v_as_doc_cliente,
                  v_doc_id,
                  v_doct_id,
                  v_doct_id_cobranza,
                  v_doc_id_cliente,
                  p_cobz_id,
                  modifico
           from Cobranza
           where cobz_id = p_cobz_id );

/*
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
//                                        update                                                                      //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
*/
   else

      v_is_new := 0;

      select cobz_descrip,
             cobz_fecha,
             modifico,
             modificado
        into v_as_descrip,
             v_as_fecha,
             v_modifico,
             v_modificado
      from Cobranza
      where cobz_id = p_cobz_id;

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
             doct_id_cliente = v_doct_id_cobranza,
             doc_id_cliente = v_doc_id_cliente,
             id_cliente = p_cobz_id,
             modifico = v_modifico,
             modificado = v_modificado
      where as_id = v_as_id;

   end if;

/*
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
//                                        ITEMS                                                                       //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
*/
   -- Borro todos los items y solo hago inserts que se mucho mas simple y rapido
   delete AsientoItem

      where as_id = v_as_id;

   v_asi_orden := 1;

   v_c_CobranzaItemAsiento := '';

   -- Cheques
   -- Efectivo
   -- Tarjeta
   -- Otros
   -- Debe
   open c_CobranzaItemAsiento for
      v_c_CobranzaItemAsiento;

   for v_cobzi_importe,v_cobzi_importeorigen,v_cue_id,v_ccos_id,v_cheq_id,v_asi_descrip in
        select cobzi.cobzi_importe,
               cobzi.cobzi_importeorigen,
               case
                  when cobzi.cobzi_tipo = 3 and cobzi.cobzi_tarjetaTipo = 1 then tc.cue_id_presentado
                  when cobzi.cobzi_tipo = 3 and cobzi.cobzi_tarjetaTipo = 2 then tc.cue_id_encartera
                  else cobzi.cue_id
               end cue_id,
               cobzi.ccos_id,
               cobzi.cheq_id,
               cobzi_descrip
        from CobranzaItem cobzi
        left join TarjetaCreditoCupon tc
               on cobzi.tjcc_id = tc.tjcc_id
        left join TarjetaCredito t
               on tc.tjc_id = t.tjc_id
        where cobzi.cobz_id = p_cobz_id
          and ( cobzi.cobzi_tipo = 1
               or cobzi.cobzi_tipo = 2
               or cobzi.cobzi_tipo = 3
               or ( cobzi.cobzi_tipo = 4 and cobzi.cobzi_otroTipo = 1 ) )
   loop

      select mon_id
        into v_mon_id
      from Cuenta
      where cue_id = v_cue_id;

      v_asi_debe := v_cobzi_importe;

      v_asi_origen := v_cobzi_importeorigen;

      perform sp_doc_asiento_save_item(
                            v_is_new,
                            0,
                            v_as_id,
                            v_asi_orden,
                            v_asi_debe,
                            0,
                            v_asi_origen,
                            0,
                            v_mon_id,
                            v_cue_id,
                            v_ccos_id,
                            v_cheq_id,
                            v_asi_descrip);

      v_asi_orden := v_asi_orden + 1;

   end loop;


/*
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
//                                        hora la cuenta del cliente                                                  //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
*/
   -- CtaCte
   -- Otros
   -- Haber
   open c_CobranzaItemAsiento for
      v_c_CobranzaItemAsiento;

   for v_cobzi_importe,v_cobzi_importeorigen,v_cue_id,v_ccos_id,v_asi_descrip in
        select sum(cobzi_importe),
           sum(cobzi_importeorigen),
           cue_id,
           ccos_id
             from CobranzaItem
              where cobz_id = p_cobz_id
             and ( cobzi_tipo = 5
             or ( cobzi_tipo = 4
             and cobzi_otroTipo = 2 ) )
             group by cue_id,ccos_id

   loop
      begin
         select mon_id
           into v_mon_id
           from Cuenta
            where cue_id = v_cue_id;

         v_asi_haber := v_cobzi_importe;

         v_asi_origen := v_cobzi_importeorigen;

         sp_doc_asiento_save_item(v_is_new,
                               0,
                               v_as_id,
                               v_asi_orden,
                               0,
                               v_asi_haber,
                               v_asi_origen,
                               0,
                               v_mon_id,
                               v_cue_id,
                               v_ccos_id,
                               null,
                               v_error);

         if v_error <> 0 then
            exit CONTROL_ERROR;

         end if;

         v_asi_orden := v_asi_orden + 1;

         fetch c_CobranzaItemAsiento into v_cobzi_importe,v_cobzi_importeorigen,v_cue_id,v_ccos_id;

      end;
   end loop;

   -- While
   close c_CobranzaItemAsiento;

   /*
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                               //
//                                Valido el Asiento                                                              //
//                                                                                                               //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
*/
   sp_doc_asiento_validate(v_as_id,
                                 v_error,
                                 p_error_msg);

   if v_error <> 0 then
      exit CONTROL_ERROR;

   end if;

   /*
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                               //
//                                Talonario                                                                      //
//                                                                                                               //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
*/
   select ta_id
     into v_ta_id
     from Documento
      where doc_id = v_doc_id;

   sp_talonario_set(v_ta_id,
                   v_as_nrodoc);

   /*
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                               //
//                                Vinculo la Cobranza con su asiento                                              //
//                                                                                                               //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
*/
   update Cobranza
      set as_id = v_as_id,
          cobz_grabarasiento = 0
      where cobz_id = p_cobz_id;

   COMMIT;

   p_error := 0;

   begin
      select 1 into v_temp
        from DUAL
       where p_bSelect <> 0;
   exception
      when others then
         null;
   end;

   if v_temp = 1 then
      open rtn for
         select v_as_id
           from DUAL ;

   end if;

   return;

   <<CONTROL_ERROR>>

   p_error := -1;

   if p_error_msg is not null then
      p_error_msg := p_error_msg || ';;';

   end if;

   p_error_msg := coalesce(p_error_msg, '') || 'Ha ocurrido un error al grabar la cobranza. sp_doc_cobranzaAsientoSave.';

   if p_raise_error <> 0 then
   begin
      raise exception ( -20002, p_error_msg );

   end;
   end if;

   ROLLBACK;

end;
--done

exception
   when others then

      if p_raise_error <> 0 then

         raise exception 'Ha ocurrido un error al grabar la Orden de Pago. sp_doc_cobranza_asiento_save. %. %.',
                         sqlstate, sqlerrm;
      else

         p_error := -1;
         p_error_msg := sqlstate || ';' || sqlerrm || ';';

      end if;

end;
$BODY$
  language plpgsql volatile
  cost 100;
alter function sp_doc_cobranza_asiento_save(integer, integer, integer)
  owner to postgres;