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
-- Function: sp_doc_movimiento_fondo_save()

-- drop function sp_doc_movimiento_fondo_save(integer, integer);

create or replace function sp_doc_movimiento_fondo_save
(
  in p_us_id integer,
  in p_mfTMP_id integer
)
  returns setof row_result as
$BODY$
declare
   rtn row_result;

   v_success integer;
   v_error smallint;
   v_error_msg varchar(5000);
   v_cfg_valor varchar(5000);

   v_is_new integer;

   v_mf_id integer;
   v_mfi_id integer;

   v_orden smallint;
   v_doct_id integer;
   v_doc_id integer;

   v_emp_id integer;
   v_est_id integer;
   v_suc_id integer;
   v_ta_id integer;
   v_cli_id integer;
   v_ccos_id integer;
   v_lgj_id integer;
   v_us_id integer;
   v_mon_id integer;

   v_mf_fecha date;
   v_mf_nrodoc varchar(50);
   v_mf_numero integer;
   v_mf_descrip varchar(5000);
   v_mf_totalOrigen decimal(18,6);
   v_mf_cotizacion decimal(18,6);
   v_mf_pendiente decimal(18,6);
   v_mf_grabarAsiento smallint;
   v_mf_total decimal(18,6);
   
   v_creado date;
   v_modificado date;
   v_modifico integer;
   
   v_mfi_orden smallint;
   v_mfi_descrip varchar(5000);
   v_mfi_importe decimal(18,6);
   v_mfi_importeOrigen decimal(18,6);
   v_mfi_importeOrigenHaber decimal(18,6);
   v_mfi_tipo smallint;
   
   v_cue_id_debe integer;
   v_cue_id_haber integer;
   v_chq_id integer;
   v_cheq_id integer;
   v_cheq_numerodoc varchar(100);
   v_cheq_fechaCobro date;
   v_cheq_fechaVto date;
   v_cheq_fecha2 date;
   v_cle_id integer;
   v_bco_id integer;

   v_ta_propuesto smallint;
   v_ta_tipo smallint;
   v_ta_nrodoc varchar(100);

   v_as_id integer;

   v_message varchar(8000);
   v_chequeUsado smallint;
   v_canDelete smallint;

   v_MfiTChequesI smallint;
   v_CheqTercero smallint;
   v_cheq_numero integer;

   dummyChar varchar(255);

begin

   -- si no existe chau
   --
   if not exists ( select mfTMP_id
                   from MovimientoFondoTMP
                   where mfTMP_id = p_mfTMP_id ) then
      return query select * from result_failed();
      return;

   end if;

   select sp_cfg_getValor('Tesoreria-General', 'Exigir Centro Costo') into v_cfg_valor;

   v_cfg_valor := coalesce(v_cfg_valor, '0');

   if to_number(v_cfg_valor) <> 0 then

      if exists ( select ccos_id
                  from MovimientoFondoTMP
                  where ccos_id is null
                    and mfTMP_id = p_mfTMP_id ) then

         if exists ( select ccos_id
                     from MovimientoFondoItemTMP
                     where ccos_id is null
                       and mfTMP_id = p_mfTMP_id
                       and mfi_tipo in ( 1,2,3,4 ) ) then

            raise exception '@@ERROR_SP: %',
                'Debe indicar un centro de costo en cada item o un centro de costo en la cabecera del documento.';

         end if;

      end if;

   end if;

   select mf_id
     into v_mf_id
   from MovimientoFondoTMP
   where mfTMP_id = p_mfTMP_id;
         
   v_mf_id := coalesce(v_mf_id, 0);

   select mon_id,
          Documento.ta_id,
          Documento.doct_id,
          Documento.emp_id,
          MovimientoFondoTMP.mf_total,
          MovimientoFondoTMP.mf_fecha,
          mf_nrodoc,
          MovimientoFondoTMP.doc_id
     into v_mon_id,
          v_ta_id,
          v_doct_id,
          v_emp_id,
          v_mf_total,
          v_mf_fecha,
          v_mf_nrodoc,
          v_doc_id
   from MovimientoFondoTMP
   join Documento
     on MovimientoFondoTMP.doc_id = Documento.doc_id
   where mfTMP_id = p_mfTMP_id;

   v_error_msg := '';

   SET TRANSACTION READ WRITE;

/*
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
//                                        insert                                                                      //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
*/
   if v_mf_id = 0 then

      v_is_new := -1;

      select sp_dbGetNewId('MovimientoFondo', 'mf_id') into v_mf_id;
      select sp_dbGetNewId('MovimientoFondo', 'mf_numero') into v_mf_numero;

      select * from sp_talonario_get_propuesto(v_doc_id) into dummyChar, v_ta_propuesto, v_ta_id, v_ta_tipo;

      if v_ta_propuesto = 0 then

         if v_ta_tipo = 3 then /*Auto Impresor*/

            select sp_talonario_get_next_number(v_ta_id) into v_ta_nrodoc;

            -- con esto evitamos que dos tomen el mismo Numero
            --
            perform sp_talonario_set(v_ta_id, v_ta_nrodoc);

            v_mf_nrodoc := v_ta_nrodoc;

         end if;

      end if;

      insert into MovimientoFondo
           ( mf_id, mf_numero, mf_nrodoc, mf_descrip, mf_fecha, mf_total, mf_totalOrigen, mf_grabarAsiento, mf_cotizacion, mon_id, est_id, suc_id, cli_id, doc_id, doct_id, ccos_id, lgj_id, us_id, modifico )
           ( select v_mf_id,
                    v_mf_numero,
                    v_mf_nrodoc,
                    mf_descrip,
                    mf_fecha,
                    mf_total,
                    mf_totalOrigen,
                    mf_grabarAsiento,
                    mf_cotizacion,
                    v_mon_id,
                    est_id,
                    suc_id,
                    cli_id,
                    doc_id,
                    v_doct_id,
                    ccos_id,
                    lgj_id,
                    us_id,
                    modifico
             from MovimientoFondoTMP
             where mfTMP_id = p_mfTMP_id );

      select doc_id,
             mf_nrodoc
        into v_doc_id,
             v_mf_nrodoc
      from MovimientoFondo
      where mf_id = v_mf_id;

/*
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
//                                        update                                                                      //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
*/
   else

      -- controlo que ningun cheque eliminado de
      -- este movimiento de fondos este utilizado
      -- por otro movimiento de fondos o por una
      -- orden de pago ya que si es asi, no puedo
      -- vincular este cheque con la cuenta
      -- mencionada en la cobranza, sino que debo:
      --
      --  1-  dar un error si esta usado en una orden de pago,
      --  2-  dar un error si esta usado en un movimiento
      --      de fondo posterior,
      --  3-  asociarlo al movimiento de fondos inmediato anterior
      --      al movimiento que estoy borrando
      --
      select * from sp_doc_movimiento_fondo_item_can_delete(
                                             v_mf_id,
                                             p_mfTMP_id,
                                             0)-- bIsDelete = False
                                             into
                                             v_message,
                                             v_chequeUsado,
                                             v_canDelete;

      if v_canDelete = 0 then
         raise exception '@@ERROR_SP: %', v_message;
      end if;

      --------------------------------------------------------------------------------------------

      v_is_new := 0;

      select mf_nrodoc,
             mf_descrip,
             mf_totalOrigen,
             mf_cotizacion,
             mf_grabarAsiento,
             est_id,
             suc_id,
             cli_id,
             doc_id,
             ccos_id,
             lgj_id,
             us_id,
             modifico,
             modificado
        into v_mf_nrodoc,
             v_mf_descrip,
             v_mf_totalOrigen,
             v_mf_cotizacion,
             v_mf_grabarAsiento,
             v_est_id,
             v_suc_id,
             v_cli_id,
             v_doc_id,
             v_ccos_id,
             v_lgj_id,
             v_us_id,
             v_modifico,
             v_modificado
      from MovimientoFondoTMP
      where mfTMP_id = p_mfTMP_id;

      update MovimientoFondo
         set mf_nrodoc = v_mf_nrodoc,
             mf_descrip = v_mf_descrip,
             mf_fecha = v_mf_fecha,
             mf_total = v_mf_total,
             mf_totalOrigen = v_mf_totalOrigen,
             mf_cotizacion = v_mf_cotizacion,
             mf_grabarAsiento = v_mf_grabarAsiento,
             mon_id = v_mon_id,
             est_id = v_est_id,
             suc_id = v_suc_id,
             cli_id = v_cli_id,
             doc_id = v_doc_id,
             doct_id = v_doct_id,
             lgj_id = v_lgj_id,
             us_id = v_us_id,
             ccos_id = v_ccos_id,
             modifico = v_modifico,
             modificado = v_modificado
      where mf_id = v_mf_id;

   end if;

/*
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
//                                        items                                                                       //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
*/
   v_orden := 1;

  while exists(select 1 from MovimientoFondoItemTMP where mfTMP_id = p_mfTMP_id and mfi_orden = v_orden)
  loop

     -- cargo todo el registro de movimiento de fondo item en variables
     --
     select mfi_id,
            mfi_orden,
            mfi_descrip,
            mfi_importe,
            mfi_importeOrigen,
            mfi_importeOrigenHaber,
            ccos_id,
            cue_id_debe,
            cue_id_haber,
            mfi_tipo,
            chq_id,
            cheq_id,
            mfiTMP_cheque,
            mfiTMP_fechaCobro,
            mfiTMP_fechaVto,
            cle_id,
            bco_id
       into v_mfi_id,
            v_mfi_orden,
            v_mfi_descrip,
            v_mfi_importe,
            v_mfi_importeOrigen,
            v_mfi_importeOrigenHaber,
            v_ccos_id,
            v_cue_id_debe,
            v_cue_id_haber,
            v_mfi_tipo,
            v_chq_id,
            v_cheq_id,
            v_cheq_numerodoc,
            v_cheq_fechaCobro,
            v_cheq_fechaVto,
            v_cle_id,
            v_bco_id
     from MovimientoFondoItemTMP
     where mfTMP_id = p_mfTMP_id
       and mfi_orden = v_orden;

     v_MfiTChequesI := 7;
     v_CheqTercero := 2;

         -- si este renglon es un ingreso de cheque
         -- de tercero lo doy de alta en la tabla Cheque
         --
         if v_mfi_tipo = v_MfiTChequesI then

            -- si es nuevo insert
            --
            if v_cheq_id is null then

               select sp_dbGetNewId('Cheque', 'cheq_id') into  v_cheq_id;
               select sp_dbGetNewId('Cheque', 'cheq_numero') into v_cheq_numero;

               select sp_doc_get_fecha2(v_cheq_fechaCobro, 1, v_cle_id) into v_cheq_fecha2;

               insert into Cheque
                        ( cheq_id, cheq_numero, cheq_numerodoc, cheq_importe, cheq_importeOrigen, cheq_tipo, cheq_fechaCobro, cheq_fechaVto, cheq_fecha2, cheq_descrip, mf_id, cle_id, bco_id, cli_id, cue_id, mon_id, emp_id )
                 values ( v_cheq_id, v_cheq_numero, v_cheq_numerodoc, v_mfi_importe, v_mfi_importeOrigen, v_CheqTercero, v_cheq_fechaCobro, v_cheq_fechaVto, v_cheq_fecha2, v_mfi_descrip, v_mf_id, v_cle_id, v_bco_id, v_cli_id, v_cue_id_debe, v_mon_id, v_emp_id );

            else

               select sp_doc_get_fecha2(v_cheq_fechaCobro, 1, v_cle_id) into v_cheq_fecha2;

               -- sino update
               --
               update Cheque
                  set cheq_numerodoc = v_cheq_numerodoc,
                      cheq_importe = v_mfi_importe,
                      cheq_importeOrigen = v_mfi_importeOrigen,
                      cheq_tipo = v_CheqTercero,
                      cheq_fechaCobro = v_cheq_fechaCobro,
                      cheq_fechaVto = v_cheq_fechaVto,
                      cheq_fecha2 = v_cheq_fecha2,
                      cheq_descrip = v_mfi_descrip,
                      mf_id = v_mf_id,
                      cle_id = v_cle_id,
                      bco_id = v_bco_id,
                      cli_id = v_cli_id,
                      mon_id = v_mon_id
                  where cheq_id = v_cheq_id;

            end if;

         end if;

         -- cheques
         --
         select sp_doc_op_mf_cheque_save(v_mfi_tipo,
                                         v_cheq_numerodoc,
                                         v_mfi_importe,
                                         v_mfi_importeOrigen,
                                         v_cheq_fechaCobro,
                                         v_cheq_fechaVto,
                                         v_mfi_descrip,
                                         v_chq_id,
                                         null,
                                         v_mf_id,
                                         null,
                                         v_cle_id,
                                         v_mon_id,
                                         null,
                                         v_cue_id_debe)
         into v_cheq_id;

         if v_is_new <> 0 or v_mfi_id = 0 then

            select sp_dbGetNewId('MovimientoFondoItem', 'mfi_id') into v_mfi_id;

            insert into MovimientoFondoItem
                      ( mf_id, mfi_id, mfi_orden, mfi_descrip, mfi_importe, mfi_importeOrigen, mfi_importeOrigenHaber, ccos_id, cue_id_debe, cue_id_haber, mfi_tipo, cheq_id, chq_id )
               values ( v_mf_id, v_mfi_id, v_mfi_orden, v_mfi_descrip, v_mfi_importe, v_mfi_importeOrigen, v_mfi_importeOrigenHaber, v_ccos_id, v_cue_id_debe, v_cue_id_haber, v_mfi_tipo, v_cheq_id, v_chq_id );

         else

            update MovimientoFondoItem
               set mf_id = v_mf_id,
                   mfi_orden = v_mfi_orden,
                   mfi_descrip = v_mfi_descrip,
                   mfi_importe = v_mfi_importe,
                   mfi_importeOrigen = v_mfi_importeOrigen,
                   mfi_importeOrigenHaber = v_mfi_importeOrigenHaber,
                   ccos_id = v_ccos_id,
                   cue_id_debe = v_cue_id_debe,
                   cue_id_haber = v_cue_id_haber,
                   mfi_tipo = v_mfi_tipo,
                   chq_id = v_chq_id,
                   cheq_id = v_cheq_id
            where mf_id = v_mf_id
              and mfi_id = v_mfi_id;

         end if;

         v_orden := v_orden + 1;

   end loop;

/*
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
//                                     items borrados                                                                 //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
*/

   -- hay que borrar los items borrados del movimiento de fondos solo si este no es nuevo
   --
   if v_is_new = 0 then

      perform sp_doc_movimiento_fondo_item_delete(v_mf_id, p_mfTMP_id, 0 /* bIsDelete = False */, v_chequeUsado);

      delete from MovimientoFondoItemBorradoTMP
      where mf_id = v_mf_id
        and mfTMP_id = p_mfTMP_id;

   end if;

/*
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
//                                     borrar temporales                                                              //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
*/

   delete from MovimientoFondoItemTMP
   where mfTMP_id = p_mfTMP_id;

   delete from MovimientoFondoTMP
   where mfTMP_id = p_mfTMP_id;

/*
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
//                                     talonarios                                                                     //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
*/

   perform sp_talonario_set(v_ta_id, v_mf_nrodoc);

/*
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
//                                        estado                                                                      //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
*/

   perform sp_doc_movimiento_fondo_set_estado(v_mf_id);

/*
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
//                                     asiento                                                                        //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
*/
   select sp_cfg_getValor('Tesoreria-General', 'MovimientoFondo-Grabar Asiento') into v_cfg_valor;

   v_cfg_valor := coalesce(v_cfg_valor, '0');

   if to_number(v_cfg_valor) <> 0 then

      select * from sp_doc_movimiento_fondo_asiento_save(v_mf_id,0) into v_error, v_error_msg;

   else

      if not exists ( select mf_id
                      from MovimientoFondoAsiento
                      where mf_id = v_mf_id ) then

         insert into MovimientoFondoAsiento
           ( mf_id, mf_fecha )
           ( select mf_id,
                    mf_fecha
             from MovimientoFondo
             where mf_grabarAsiento <> 0
               and mf_id = v_mf_id );

      end if;

   end if;

/*
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
//                                     historial de modificaciones                                                    //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
*/
   select modifico into v_modifico from MovimientoFondo where mf_id = v_mf_id;

   if v_is_new <> 0 then
      perform sp_historia_update(18006, v_mf_id, v_modifico, 1);
   else
      perform sp_historia_update(18006, v_mf_id, v_modifico, 3);
   end if;

/*
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
//                                     fin                                                                            //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
*/

   rtn.type := 'mf_id';
   rtn.id := v_mf_id;

   return next rtn;

exception
   when others then

     raise exception 'Ha ocurrido un error al grabar el movimiento de fondos. sp_doc_movimiento_fondo_save. %. %.',
                      sqlstate, sqlerrm;

end;
$BODY$
  language plpgsql volatile
  cost 100;
alter function sp_doc_movimiento_fondo_save(integer, integer)
  owner to postgres;
