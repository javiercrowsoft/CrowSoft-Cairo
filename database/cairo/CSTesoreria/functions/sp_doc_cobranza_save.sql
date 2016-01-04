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
-- Function: sp_doc_cobranza_save()

-- drop function sp_doc_cobranza_save(integer, integer);

create or replace function sp_doc_cobranza_save
(
  in p_us_id integer,
  in p_cobzTMP_id integer
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

   v_cobz_id integer;
   v_cobzi_id integer;
   
   v_orden smallint;
   v_doct_id integer;
   v_doc_id integer;
   
   v_cli_id integer;
   v_emp_id integer;
   v_est_id integer;
   v_suc_id integer;
   v_ta_id integer;
   v_ccos_id integer;
   v_lgj_id integer;
   
   v_cobz_fecha date;
   v_cobz_nrodoc varchar(50);
   v_cobz_numero integer;
   v_cobz_descrip varchar(5000);
   v_cobz_neto decimal(18,6);
   v_cobz_total decimal(18,6);
   v_cobz_otros decimal(18,6);
   v_cobz_pendiente decimal(18,6);
   v_cobz_cotizacion decimal(18,6);
   v_cobz_grabarAsiento smallint;

   v_creado date;
   v_modificado date;
   v_modifico integer;

   v_cobzi_orden smallint;
   v_cobzi_descrip varchar(5000);
   v_cobzi_descuento varchar(100);
   v_cobzi_neto decimal(18,6);
   v_cobzi_importe decimal(18,6);
   v_cobzi_importeorigen decimal(18,6);
   v_cobzi_otroTipo smallint;
   v_cobzi_porcRetencion decimal(18,6);
   v_cobzi_fechaRetencion date;
   v_cobzi_nroRetencion varchar(100);
   v_cobzi_tipo smallint;
   v_cobzi_tarjetaTipo smallint;

   v_cheq_id integer;
   v_cue_id integer;
   v_cue_id_cupon integer;
   v_tjccu_id integer;
   v_tjcc_id integer;
   v_cle_id integer;
   v_bco_id integer;
   v_tjc_id integer;
   v_mon_id integer;
   v_ret_id integer;
   v_fv_id_ret integer;

   v_cheq_numero integer;
   v_cheq_propio smallint;
   v_cheq_sucursal varchar(255);
   v_cheq_numerodoc varchar(100);
   v_cheq_fechaCobro date;
   v_cheq_fechaVto date;
   v_cheq_fecha2 date;

   v_tjcc_numero integer;
   v_tjcc_numerodoc varchar(100);

   v_cobziTMP_fechaVto date;
   v_cobziTMP_nroTarjeta varchar(50);
   v_cobziTMP_nroAutorizacion varchar(50);
   v_cobziTMP_titular varchar(255);

   v_CobziTCheques smallint;
   v_CobziTEfectivo smallint;
   v_CobziTTarjeta smallint;
   v_CobziTOtros smallint;
   v_CobziTCtaCte smallint;
   v_CheqTercero smallint;

   v_fv_id integer;
   v_fvd_id integer;
   v_doct_id_ncnd integer;

   v_fvTMP_id integer;
   v_fvcobz_id integer;
   v_fvcobz_importe decimal(18,6);
   v_fvd_pendiente decimal(18,6);
   v_fvp_id integer;

   v_pago decimal(18,6);
   v_pagoOrigen decimal(18,6);

   v_fvcobz_importeOrigen decimal(18,6);
   v_fvcobz_cotizacion decimal(18,6);
   v_fvd_fecha date;

   v_ta_propuesto smallint;
   v_ta_tipo smallint;
   v_ta_nrodoc varchar(100);

   v_as_id integer;

   dummyChar varchar(255);

   save_factura_result row_result;

begin

   -- si no existe chau
   --
   if not exists ( select cobzTMP_id
                   from CobranzaTMP
                   where cobzTMP_id = p_cobzTMP_id ) then
      return query select * from result_failed;
      return;

   end if;

   select sp_cfg_getValor('Tesoreria-General', 'Exigir Centro Costo COBZ') into v_cfg_valor;

   v_cfg_valor := coalesce(v_cfg_valor, '0');

   if to_number(v_cfg_valor) <> 0 then

      if exists ( select ccos_id
                  from CobranzaTMP
                  where ccos_id is null
                    and cobzTMP_id = p_cobzTMP_id ) then

         if exists ( select ccos_id
                     from CobranzaItemTMP
                     where ccos_id is null
                       and cobzTMP_id = p_cobzTMP_id
                       and cobzi_tipo in ( 1,2,3,4 ) ) then

            raise exception '@@ERROR_SP: %',
                'Debe indicar un centro de costo en cada item o un centro de costo en la cabecera del documento.';

         end if;

      end if;

   end if;

   v_error_msg := '';

   select cobz_id,
          cobz_fecha,
          cli_id,
          Documento.doc_id,
          doct_id,
          cobz_nrodoc,
          emp_id
     into v_cobz_id,
          v_cobz_fecha,
          v_cli_id,
          v_doc_id,
          v_doct_id,
          v_cobz_nrodoc,
          v_emp_id
   from CobranzaTMP
   join Documento
     on CobranzaTMP.doc_id = Documento.doc_id
   where cobzTMP_id = p_cobzTMP_id;

   v_cobz_id := coalesce(v_cobz_id, 0);

   v_CobziTCheques := 1;
   v_CobziTEfectivo := 2;
   v_CobziTTarjeta := 3;
   v_CobziTOtros := 4;
   v_CobziTCtaCte := 5;
   v_CheqTercero := 2;

   select fvTMP_id
   into v_fvTMP_id
   from FacturaVentaTMP
   where cobzTMP_id = p_cobzTMP_id;

   -- si hay una ND o NC
   --
   if coalesce(v_fvTMP_id, 0) <> 0 then

      -- grabo la factura
      --
      for save_factura_result in
           select * from sp_doc_factura_venta_save(p_us_id, v_fvTMP_id)
      loop

        if save_factura_result.type = 'fv_id' then
          v_fv_id := save_factura_result.id;
          exit;
        end if;

      end loop;

      -- obtengo el DocumentoTipo para saver si es una NC o ND
      --
      select doct_id
        into v_doct_id_ncnd
      from FacturaVenta
      where fv_id = v_fv_id;

      -- si es una nota de credito es por que bajo la cotizacion de la moneda
      -- extranjera y por lo tanto tengo que aplicar la NC a las facturas cobradas
      -- que esten en moneda extranjera
      --
      if v_doct_id_ncnd = 7 /* Nota de credito */ then

         -- obtengo el id de la deuda (El max esta por las dudas)
         --
         select max(fvd_id)
           into v_fvd_id
         from FacturaVentaDeuda
         where fv_id = v_fv_id;

            -- actualizo el id fv_id_notacredito de la vinculacion
            --
            update FacturaVentaNotaCreditoTMP
               set fv_id_notacredito = v_fv_id,
                   fvd_id_notacredito = v_fvd_id
               where fv_id_notacredito = (v_fvTMP_id * -1);

         -- este sp se encarga de todo
         --
         perform sp_doc_factura_venta_nota_credito_save(v_fvTMP_id);

         perform sp_doc_factura_venta_set_credito(v_fv_id);

         perform sp_doc_factura_venta_set_estado(v_fv_id);

      else

         -- si es una nota de debito es por que el dolar subio y por ende
         -- cobre mas pesos. En este caso lo unico que hay que hacer es aplicar
         -- la ND con la cobranza y listo
         --
         if v_doct_id_ncnd = 9 /* Nota de debito */ then

            -- obtengo el Id de la deuda generada por el sp_doc_factura_venta_save
            --
            select max(fvd_id)
              into v_fvd_id
            from FacturaVentaDeuda
            where fv_id = v_fv_id;

            -- actualizo la info de cobranza (fv_id y fvd_id) que fueron creados con la
            -- llamda al sp_doc_factura_venta_save que esta arriba
            --
            update FacturaVentaCobranzaTMP
               set fv_id = v_fv_id,
                   fvd_id = v_fvd_id
            where cobzTMP_id = p_cobzTMP_id
              and fv_id = v_fvTMP_id * -1 -- !!! el registro en FacturaVentaCobranzaTMP que
                                          --     se refiere a la ND no tiene el fv_id por que
                                          --     cuando VB llamo a este sp no existia la ND
                                          --     (recuerden que fue creada con la llamada al
                                          --      sp_doc_factura_venta_save que esta mas arriba)
                                          
              and fvd_id = -1;            -- !!! lo mismo paso con la deuda
         end if;
      end if;
   end if;

   set TRANSACTION READ WRITE;

/*
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
//                                        insert                                                                      //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
*/
   if v_cobz_id = 0 then

      v_is_new := -1;

      select sp_dbGetNewId('Cobranza', 'cobz_id') into v_cobz_id;
      select sp_dbGetNewId('Cobranza', 'cobz_numero') into v_cobz_numero;

      select * from sp_talonario_get_propuesto(v_doc_id) into dummyChar, v_ta_propuesto, v_ta_id, v_ta_tipo;

      if v_ta_propuesto = 0 then

         if v_ta_tipo = 3 then /*Auto Impresor*/

            select sp_talonario_get_next_number(v_ta_id) into v_ta_nrodoc;

            -- con esto evitamos que dos tomen el mismo numero
            --
            perform sp_talonario_set(v_ta_id, v_ta_nrodoc);

            v_cobz_nrodoc := v_ta_nrodoc;

         end if;
      end if;

      insert into Cobranza
           ( cobz_id, cobz_numero, cobz_nrodoc, cobz_descrip, cobz_fecha, cobz_neto, cobz_otros, cobz_total,
             cobz_cotizacion, cobz_grabarAsiento, est_id, suc_id, cli_id, emp_id, doc_id, doct_id, ccos_id,
             lgj_id, modifico )
           ( select v_cobz_id,
                    v_cobz_numero,
                    v_cobz_nrodoc,
                    cobz_descrip,
                    cobz_fecha,
                    cobz_neto,
                    cobz_otros,
                    cobz_total,
                    cobz_cotizacion,
                    cobz_grabarAsiento,
                    est_id,
                    suc_id,
                    cli_id,
                    v_emp_id,
                    doc_id,
                    v_doct_id,
                    ccos_id,
                    lgj_id,
                    modifico
             from CobranzaTMP
             where cobzTMP_id = p_cobzTMP_id );

      select doc_id,
             cobz_nrodoc
        into v_doc_id,
             v_cobz_nrodoc
      from Cobranza
      where cobz_id = v_cobz_id;

/*
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
//                                        update                                                                      //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
*/
   else

      v_is_new := 0;

      select cobz_id,
             cobz_nrodoc,
             cobz_descrip,
             cobz_fecha,
             cobz_neto,
             cobz_otros,
             cobz_total,
             cobz_cotizacion,
             cobz_grabarAsiento,
             est_id,
             suc_id,
             cli_id,
             ccos_id,
             lgj_id,
             modifico,
             modificado
        into v_cobz_id,
             v_cobz_nrodoc,
             v_cobz_descrip,
             v_cobz_fecha,
             v_cobz_neto,
             v_cobz_otros,
             v_cobz_total,
             v_cobz_cotizacion,
             v_cobz_grabarAsiento,
             v_est_id,
             v_suc_id,
             v_cli_id,
             v_ccos_id,
             v_lgj_id,
             v_modifico,
             v_modificado
      from CobranzaTMP
      where cobzTMP_id = p_cobzTMP_id;


      update Cobranza
            set cobz_nrodoc = v_cobz_nrodoc,
                cobz_descrip = v_cobz_descrip,
                cobz_fecha = v_cobz_fecha,
                cobz_neto = v_cobz_neto,
                cobz_otros = v_cobz_otros,
                cobz_total = v_cobz_total,
                cobz_cotizacion = v_cobz_cotizacion,
                cobz_grabarAsiento = v_cobz_grabarAsiento,
                est_id = v_est_id,
                suc_id = v_suc_id,
                cli_id = v_cli_id,
                emp_id = v_emp_id,
                doc_id = v_doc_id,
                doct_id = v_doct_id,
                ccos_id = v_ccos_id,
                lgj_id = v_lgj_id,
                modifico = v_modifico,
                modificado = v_modificado
      where cobz_id = v_cobz_id;

   end if;

/*
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
//                                        items                                                                       //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
*/

   v_orden := 1;

   while exists(select 1 from CobranzaItemTMP where cobzTMP_id = p_cobzTMP_id and cobzi_orden = v_orden)
   loop

      select cobzi_id,
             cobzi_orden,
             cobzi_descrip,
             cobzi_importe,
             cobzi_importeorigen,
             ccos_id,
             cobzi_otroTipo,
             cobzi_porcRetencion,
             cobzi_fechaRetencion,
             cobzi_nroRetencion,
             cobzi_tipo,
             cobzi_tarjetaTipo,
             cheq_id,
             cue_id,
             tjcc_id,
             bco_id,
             cle_id,
             tjc_id,
             cobziTMP_propio,
             cobziTMP_cheque,
             cobziTMP_sucursal,
             cobziTMP_fechaCobro,
             cobziTMP_fechaVto,
             cobziTMP_cupon,
             cobziTMP_fechaVto,
             cobziTMP_nroTarjeta,
             cobziTMP_autorizacion,
             cobziTMP_titular,
             mon_id,
             tjccu_id,
             ret_id,
             fv_id_ret
        into v_cobzi_id,
             v_cobzi_orden,
             v_cobzi_descrip,
             v_cobzi_importe,
             v_cobzi_importeorigen,
             v_ccos_id,
             v_cobzi_otroTipo,
             v_cobzi_porcRetencion,
             v_cobzi_fechaRetencion,
             v_cobzi_nroRetencion,
             v_cobzi_tipo,
             v_cobzi_tarjetaTipo,
             v_cheq_id,
             v_cue_id,
             v_tjcc_id,
             v_bco_id,
             v_cle_id,
             v_tjc_id,
             v_cheq_propio,
             v_cheq_numerodoc,
             v_cheq_sucursal,
             v_cheq_fechaCobro,
             v_cheq_fechaVto,
             v_tjcc_numerodoc,
             v_cobziTMP_fechaVto,
             v_cobziTMP_nroTarjeta,
             v_cobziTMP_nroAutorizacion,
             v_cobziTMP_titular,
             v_mon_id,
             v_tjccu_id,
             v_ret_id,
             v_fv_id_ret
      from CobranzaItemTMP
      where cobzTMP_id = p_cobzTMP_id
        and cobzi_orden = v_orden;

      -- si este renglon es un cheque lo doy de alta en la tabla cheque
      --
      if v_cobzi_tipo = v_CobziTCheques then

         -- si es nuevo insert
         --
         if v_cheq_id is null then

            select sp_dbGetNewId('Cheque', 'cheq_id') into v_cheq_id;
            select sp_dbGetNewId('Cheque', 'cheq_numero') into v_cheq_numero;

            select sp_doc_get_fecha2(v_cheq_fechaCobro, 1, v_cle_id) into v_cheq_fecha2;

            insert into Cheque
              ( cheq_id, cheq_numero, cheq_numerodoc, cheq_sucursal, cheq_propio, cheq_importe, cheq_importeOrigen, 
                cheq_tipo, cheq_fechaCobro, cheq_fechaVto, cheq_fecha2, cheq_descrip, cobz_id, cle_id, bco_id, 
                cli_id, cue_id, mon_id, emp_id )
              values ( v_cheq_id, v_cheq_numero, v_cheq_numerodoc, v_cheq_sucursal, v_cheq_propio, v_cobzi_importe, 
                       v_cobzi_importeOrigen, v_CheqTercero, v_cheq_fechaCobro, v_cheq_fechaVto, v_cheq_fecha2, 
                       v_cobzi_descrip, v_cobz_id, v_cle_id, v_bco_id, v_cli_id, v_cue_id, v_mon_id, v_emp_id );

         else

            select sp_doc_get_fecha2(v_cheq_fechaCobro, 1, v_cle_id) into v_cheq_fecha2;

            -- sino update
            --
            update Cheque
               set cheq_numerodoc = v_cheq_numerodoc,
                   cheq_sucursal = v_cheq_sucursal,
                   cheq_propio = v_cheq_propio,
                   cheq_importe = v_cobzi_importe,
                   cheq_importeOrigen = v_cobzi_importeOrigen,
                   cheq_tipo = v_CheqTercero,
                   cheq_fechaCobro = v_cheq_fechaCobro,
                   cheq_fechaVto = v_cheq_fechaVto,
                   cheq_fecha2 = v_cheq_fecha2,
                   cheq_descrip = v_cobzi_descrip,
                   cobz_id = v_cobz_id,
                   cle_id = v_cle_id,
                   bco_id = v_bco_id,
                   cli_id = v_cli_id,
                   mon_id = v_mon_id
               where cheq_id = v_cheq_id;

            if not exists ( select opgi.cheq_id
                            from OrdenPagoItem opgi
                            join OrdenPago opg
                              on opgi.opg_id = opg.opg_id
                             and opg.est_id <> 7
                             and opgi.cheq_id = v_cheq_id ) then

               if not exists ( select mfi.cheq_id
                               from MovimientoFondoItem mfi
                               join MovimientoFondo mf
                                 on mfi.mf_id = mf.mf_id
                                and mf.est_id <> 7
                                and mfi.cheq_id = v_cheq_id ) then

                  if not exists ( select dbcoi.cheq_id
                                  from DepositoBancoItem dbcoi
                                  join DepositoBanco dbco
                                    on dbcoi.dbco_id = dbco.dbco_id
                                   and dbco.est_id <> 7
                                   and dbcoi.cheq_id = v_cheq_id ) then
                  
                     update Cheque set cue_id = v_cue_id where cheq_id = v_cheq_id;

                  end if;
               end if;
            end if;
         end if;
         
      -- sino es un cheque
      else

         -- si paga con tarjeta
         --
         if v_cobzi_tipo = v_CobziTTarjeta then
            select case
                      when v_cobzi_tipo = 3 and v_cobzi_tarjetaTipo = 1 then cue_id_presentado
                      when v_cobzi_tipo = 3 and v_cobzi_tarjetaTipo = 2 then cue_id_encartera   
                   end
              into v_cue_id_cupon
            from TarjetaCredito
            where tjc_id = v_tjc_id;

            v_cue_id := v_cue_id_cupon;

            -- si es nuevo insert
            --
            if v_tjcc_id is null then
            
               select sp_dbGetNewId('TarjetaCreditoCupon', 'tjcc_id') into v_tjcc_id;
               select sp_dbGetNewId('TarjetaCreditoCupon', 'tjcc_numero') into v_tjcc_numero;

               insert into TarjetaCreditoCupon
                 ( tjc_id, tjcc_id, tjcc_numero, tjcc_numerodoc, tjcc_descrip, tjcc_fechavto, tjcc_nroTarjeta, 
                   tjcc_nroAutorizacion, tjcc_titular, tjcc_importe, tjcc_importeOrigen, cobz_id, cli_id, cue_id, 
                   mon_id, tjccu_id )
                 values ( v_tjc_id, v_tjcc_id, v_tjcc_numero, v_tjcc_numerodoc, v_cobzi_descrip, v_cobziTMP_fechaVto, 
                          v_cobziTMP_nroTarjeta, v_cobziTMP_nroAutorizacion, v_cobziTMP_titular, v_cobzi_importe, 
                          v_cobzi_importeOrigen, v_cobz_id, v_cli_id, v_cue_id_cupon, v_mon_id, v_tjccu_id );


            else

               -- sino update
               --
               update TarjetaCreditoCupon
                  set tjc_id = v_tjc_id,
                      tjcc_numerodoc = v_tjcc_numerodoc,
                      tjcc_descrip = v_cobzi_descrip,
                      tjcc_fechavto = v_cobziTMP_fechaVto,
                      tjcc_nroTarjeta = v_cobziTMP_nroTarjeta,
                      tjcc_nroAutorizacion = v_cobziTMP_nroAutorizacion,
                      tjcc_titular = v_cobziTMP_titular,
                      tjcc_importe = v_cobzi_importe,
                      tjcc_importeOrigen = v_cobzi_importeOrigen,
                      cobz_id = v_cobz_id,
                      cli_id = v_cli_id,
                      mon_id = v_mon_id,
                      tjccu_id = v_tjccu_id
               where tjcc_id = v_tjcc_id;


               -- solo le modifico la cuenta si no esta presentado o conciliado
               --
               if  not exists ( select *
                                from DepositoCuponItem
                                where tjcc_id = v_tjcc_id ) then


                  update TarjetaCreditoCupon set cue_id = v_cue_id_cupon where tjcc_id = v_tjcc_id;

               end if;
            end if;
         end if;
      end if;

      -- si es un renglon nuevo o una cobranza nueva
      --
      if v_is_new <> 0 or v_cobzi_id = 0 then

         select sp_dbGetNewId('CobranzaItem', 'cobzi_id') into v_cobzi_id;

         insert into CobranzaItem
              ( cobz_id, cobzi_id, cobzi_orden, cobzi_descrip, cobzi_importe, cobzi_importeorigen, ccos_id, 
                cobzi_otroTipo, cobzi_porcRetencion, cobzi_fechaRetencion, cobzi_nroRetencion, cobzi_tipo, 
                cobzi_tarjetaTipo, cheq_id, cue_id, tjcc_id, ret_id, fv_id_ret )
         values ( v_cobz_id, v_cobzi_id, v_cobzi_orden, v_cobzi_descrip, v_cobzi_importe, v_cobzi_importeorigen, 
                  v_ccos_id, v_cobzi_otroTipo, v_cobzi_porcRetencion, v_cobzi_fechaRetencion, v_cobzi_nroRetencion, 
                  v_cobzi_tipo, v_cobzi_tarjetaTipo, v_cheq_id, v_cue_id, v_tjcc_id, v_ret_id, v_fv_id_ret );

      else

         update CobranzaItem
            set cobz_id = v_cobz_id,
                cobzi_orden = v_cobzi_orden,
                cobzi_descrip = v_cobzi_descrip,
                cobzi_importe = v_cobzi_importe,
                cobzi_importeorigen = v_cobzi_importeorigen,
                ccos_id = v_ccos_id,
                cobzi_otroTipo = v_cobzi_otroTipo,
                cobzi_porcRetencion = v_cobzi_porcRetencion,
                cobzi_fechaRetencion = v_cobzi_fechaRetencion,
                cobzi_nroRetencion = v_cobzi_nroRetencion,
                cobzi_tipo = v_cobzi_tipo,
                cobzi_tarjetaTipo = v_cobzi_tarjetaTipo,
                cheq_id = v_cheq_id,
                cue_id = v_cue_id,
                tjcc_id = v_tjcc_id,
                ret_id = v_ret_id,
                fv_id_ret = v_fv_id_ret
         where cobz_id = v_cobz_id
           and cobzi_id = v_cobzi_id;

      end if;

      v_orden := v_orden + 1;

   end loop;

   for v_fvcobz_id,v_fv_id,v_fvd_id,v_fvcobz_importe,v_fvcobz_importeOrigen,v_fvcobz_cotizacion in
        select fvcobz_id,
               fv_id,
               fvd_id,
               fvcobz_importe,
               fvcobz_importeOrigen,
               fvcobz_cotizacion
        from FacturaVentaCobranzaTMP
        where cobzTMP_id = p_cobzTMP_id
   loop
      -- este es el while de pago agrupado. abajo esta la explicacion
      --
      while v_fvcobz_importe > 0
      loop
         -- obtengo el monto de la deuda
         --
         -- la cobranza permite cobrar sobre toda la deuda de la factura o sobre cada uno de sus vencimientos.
         -- esto complica un poco la cosa para el programador. si en la info de aplicacion (registro de la tabla
         -- facturaventacobranzatmp no tengo un fvd_id (id del vencimiento), es por que se efectuo la cobranza
         -- sobre toda la deuda de la factura. esto se entiende con un ejemplo:
         --        supongamos una factura con vtos. 30, 60 y 90 dias. tiene 3 vtos, pero el usuario decide
         --        aplicar sobre los tres agrupados un importe dado, para el ejemplo supongamos que los vtos
         --        son todos de 30 pesos o sea 90 pesos el total, y el usuario aplica 80 pesos. el sistema tiene
         --        que aplicar 30 al primer vto, 30 al segundo y 20 al tercero. para poder hacer esto es que utiliza
         --        el while que esta arriba (while de pago agrupado).
         --
         -- observen el if, si no hay fvd_id tomo el primero con el select que ordena por fvd_fecha
         --
         if coalesce(v_fvd_id, 0) = 0 then

            select *
              into v_fvd_id,
                   v_fvd_pendiente
            from ( select fvd_id, fvd_pendiente
                   from FacturaVentaDeuda
                   where fv_id = v_fv_id
                   order by fvd_fecha desc ) t
            limit 1;

         -- si hay info de deuda (fvd_id <> 0) todo es mas facil
         --
         else

            select fvd_pendiente
              into v_fvd_pendiente
            from FacturaVentaDeuda
            where fvd_id = v_fvd_id;

         end if;

         -- si el pago no cancela el pendiente
         --
         if v_fvd_pendiente - v_fvcobz_importe > 0.01 then

            -- no hay pago
            --
            v_fvp_id := null;
            v_pago := v_fvcobz_importe;
            v_pagoOrigen := v_fvcobz_importeOrigen;

         -- si el pago cancela la deuda cargo un nuevo pago
         -- y luego voy a borrar la deuda
         else

            if coalesce(v_fvcobz_cotizacion, 0) <> 0 then

               v_pagoOrigen := v_fvd_pendiente / v_fvcobz_cotizacion;

            else

               v_pagoOrigen := 0;

            end if;

            -- acumulo en el pago toda la deuda para pasar de la tabla FacturaVentaDeuda a FacturaVentaPago
            -- ojo: Uso la variable pago para acumular toda la deuda, pero despues de insertar el pago
            --      le asigno a esta variable solo el monto de deuda pendiente que cancele con este pago
            --
            v_pago := 0;

            select fvd_fecha,
                   fvd_pendiente
              into v_fvd_fecha,
                   v_pago
            from FacturaVentaDeuda
            where fvd_id = v_fvd_id;

            select v_pago + coalesce(sum(fvcobz_importe), 0)
              into v_pago
            from FacturaVentaCobranza
            where fvd_id = v_fvd_id;

            select v_pago + coalesce(sum(fvnc_importe), 0)
              into v_pago
            from FacturaVentaNotaCredito
            where fvd_id_factura = v_fvd_id;

            select sp_dbGetNewId('FacturaVentaPago', 'fvp_id') into v_fvp_id;

            insert into FacturaVentaPago
                 ( fvp_id, fvp_fecha, fvp_importe, fv_id )
            values ( v_fvp_id, v_fvd_fecha, v_pago, v_fv_id );

            -- como explique mas arriba:
            -- esta variable se usa para vincular el pago con la cobranza
            -- asi que la actualizo a la deuda que esta cobranza cancela
            --
            v_pago := v_fvd_pendiente;

         end if;

         -- si hay pago borro la/s deudas
         --
         if coalesce(v_fvp_id, 0) <> 0 then

            -- primero actualizo las referencias pasando de deuda a pago
            --
            update FacturaVentaCobranza
               set fvd_id = null,
                   fvp_id = v_fvp_id
            where fvd_id = v_fvd_id;

            update FacturaVentaNotaCredito
               set fvd_id_factura = null,
                   fvp_id_factura = v_fvp_id
            where fvd_id_factura = v_fvd_id;

            -- ahora si borro
            --
            delete from FacturaVentaDeuda
            where fv_id = v_fv_id
              and ( fvd_id = v_fvd_id or coalesce(v_fvd_id, 0) = 0 );

            -- no hay mas deuda
            --
            v_fvd_id := null;

         end if;

         -- finalmente grabo la vinculacion que puede estar asociada a una deuda o a un pago
         --
         select sp_dbGetNewId('FacturaVentaCobranza', 'fvcobz_id') into v_fvcobz_id;

         insert into FacturaVentaCobranza
            ( fvcobz_id, fvcobz_importe, fvcobz_importeOrigen, fvcobz_cotizacion, fv_id, fvd_id, fvp_id, cobz_id )
         values ( v_fvcobz_id, v_pago, v_pagoOrigen, v_fvcobz_cotizacion, v_fv_id,
                  v_fvd_id, --> uno de estos dos es null
                  v_fvp_id, -->  "       "        "
                  v_cobz_id );

         -- si no hay un pago actualizo la deuda decrementandola
         --
         if coalesce(v_fvp_id, 0) = 0 then

            update FacturaVentaDeuda
               set fvd_pendiente = fvd_pendiente - v_pago
            where fvd_id = v_fvd_id;

         end if;

         -- voy restando al pago el importe aplicado
         --
         v_fvcobz_importe := v_fvcobz_importe - v_pago;

      end loop;
   end loop;

/*
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
//                                     items borrados                                                                 //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
*/

   -- hay que borrar los items borrados de la cobranza solo si esta no es nueva
   --
   if v_is_new = 0 then

      -- antes que nada voy a tener que desvincular los cheques de los
      -- asientoitem vinculados a esta cobranza
      --
      select as_id
        into v_as_id
      from Cobranza
      where cobz_id = v_cobz_id;

      if v_as_id is not null then

         update AsientoItem
            set cheq_id = null
         where as_id = v_as_id;

      end if;

      insert into tt_cobzi_cheque
        ( cheq_id )
        ( select cheq_id
          from CobranzaItem
          where exists ( select cobzi_id
                         from CobranzaItemBorradoTMP
                         where cobz_id = v_cobz_id
                           and cobzTMP_id = p_cobzTMP_id
                           and cobzi_id = CobranzaItem.cobzi_id )
            and cobz_id = v_cobz_id
            and cheq_id is not null );

      insert into tt_cobzi_cupon
        ( tjcc_id )
        ( select tjcc_id
          from CobranzaItem
          where exists ( select cobzi_id
                         from CobranzaItemBorradoTMP
                         where cobz_id = v_cobz_id
                           and cobzTMP_id = p_cobzTMP_id
                           and cobzi_id = CobranzaItem.cobzi_id )
            and cobz_id = v_cobz_id
            and tjcc_id is not null );


      delete from CobranzaItem
      where exists ( select cobzi_id
                     from CobranzaItemBorradoTMP
                     where cobz_id = v_cobz_id
                       and cobzTMP_id = p_cobzTMP_id
                       and cobzi_id = CobranzaItem.cobzi_id );

      -- borro los cheques de clientes que entraron por esta cobranza
      --
      delete from Cheque
      where exists ( select cheq_id
                     from tt_cobzi_cheque
                     where cheq_id = Cheque.cheq_id );

      -- borro los cupones de tarjeta que entraron por esta cobranza
      --
      delete from TarjetaCreditoCupon
      where exists ( select tjcc_id
                     from tt_cobzi_cupon
                     where tjcc_id = TarjetaCreditoCupon.tjcc_id );

      delete from CobranzaItemBorradoTMP
      where cobz_id = v_cobz_id
        and cobzTMP_id = p_cobzTMP_id;

   end if;

/*
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
//                                 particularidades de los clientes                                                   //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
*/

   select * from sp_doc_cobranza_save_cliente(v_cobz_id, p_cobzTMP_ID) into v_success, v_error_msg;

   -- si el documento no es valido
   --
   if coalesce(v_success, 0) = 0 then
      raise exception '%', v_error_msg;
   end if;

/*
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
//                                     borrar temporales                                                              //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
*/

   delete from FacturaVentaCobranzaTMP where cobzTMP_id = p_cobzTMP_id;
   delete from CobranzaItemTMP where cobzTMP_id = p_cobzTMP_id;
   delete from CobranzaTMP where cobzTMP_id = p_cobzTMP_id;

/*
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
//                                        pendiente                                                                   //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
*/
   select sum(fvcobz_importe)
     into v_cobz_pendiente
   from FacturaVentaCobranza
   where cobz_id = v_cobz_id;

   update Cobranza
      set cobz_pendiente = cobz_total - coalesce(v_cobz_pendiente, 0)
   where cobz_id = v_cobz_id;

   for v_fv_id in
        select distinct fv_id
        from FacturaVentaCobranza
        where cobz_id = v_cobz_id
   loop

      perform  sp_doc_factura_venta_set_pendiente(v_fv_id);

      perform sp_doc_factura_venta_set_credito(v_fv_id);

      perform sp_doc_factura_venta_set_estado(v_fv_id);


      --/////////////////////////////////////////////////////////////////////////////////////////////////
      --
      -- validaciones
      --
      --/////////////////////////////////////////////////////////////////////////////////////////////////

      -- estado
      --
      select * from sp_auditoria_estado_check_doc_fv(v_fv_id) into v_success, v_error_msg;
      if coalesce(v_success, 0) = 0 then
         raise exception '%', v_error_msg;
      end if;

      -- totales
      --
      select * from sp_auditoria_totales_check_doc_fv(v_fv_id) into v_success, v_error_msg;
      if coalesce(v_success, 0) = 0 then
         raise exception '%', v_error_msg;
      end if;

      -- vtos
      --
      select * from sp_auditoria_vto_check_doc_fv(v_fv_id) into v_success, v_error_msg;
      if coalesce(v_success, 0) = 0 then
         raise exception '%', v_error_msg;
      end if;

      -- credito
      --
      select * from sp_auditoria_credito_check_doc_fv(v_fv_id) into v_success, v_error_msg;
      if coalesce(v_success, 0) = 0 then
         raise exception '%', v_error_msg;
      end if;

      --
      --/////////////////////////////////////////////////////////////////////////////////////////////////

   end loop;

/*
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
//                                        talonario                                                                   //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
*/
   select ta_id into v_ta_id from Documento where doc_id = v_doc_id;

   perform sp_talonario_set(v_ta_id, v_cobz_nrodoc);

/*
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
//                                        estado                                                                      //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
*/
   perform sp_doc_cobranza_set_credito(v_cobz_id);

   perform sp_doc_cobranza_set_estado(v_cobz_id);

   perform sp_doc_cobranza_cheque_set_credito(v_cobz_id);

   v_cfg_valor := null;
   select sp_cfg_getValor('Tesoreria-General', 'Cobranza-Grabar Asiento') into v_cfg_valor;

   v_cfg_valor := coalesce(v_cfg_valor, '0');

   if to_number(v_cfg_valor) <> 0 then

      select * from sp_doc_cobranza_asiento_save(v_cobz_id, 0) into v_error, v_error_msg;
      if coalesce(v_error, 0) <> 0 then
         raise exception '%', v_error_msg;
      end if;

   else

      if not exists ( select cobz_id
                      from CobranzaAsiento
                      where cobz_id = v_cobz_id ) then

         insert into CobranzaAsiento
           ( cobz_id, cobz_fecha )
           ( select cobz_id,
                    cobz_fecha
             from Cobranza
             where cobz_grabarAsiento <> 0
               and cobz_id = v_cobz_id );

      end if;

   end if;

/*
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
//                                     validaciones al documento                                                      //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
*/

   -- estado
   --
   select * from sp_auditoria_credito_check_doc_cobz(v_cobz_id) into v_success, v_error_msg;
   if coalesce(v_success, 0) = 0 then
      raise exception '%', v_error_msg;
   end if;

   -- totales
   --
   select * from sp_adttotalescheckdoccobz(v_cobz_id) into v_success, v_error_msg;
   if coalesce(v_success, 0) = 0 then
      raise exception '%', v_error_msg;
   end if;

   -- credito
   --
   select * from sp_auditoria_credito_check_doc_cob(v_cobz_id) into v_success, v_error_msg;
   if coalesce(v_success, 0) = 0 then
      raise exception '%', v_error_msg;
   end if;

/*
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
//                                     historial de modificaciones                                                    //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
*/
   select modifico into v_modifico from Cobranza where cobz_id = v_cobz_id;

   if v_is_new <> 0 then
      perform sp_historia_update(18004, v_cobz_id, v_modifico, 1);
   else
      perform sp_historia_update(18004, v_cobz_id, v_modifico, 3);
   end if;

/*
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
//                                     fin                                                                            //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
*/

   rtn.type := 'fv_id';
   rtn.id := v_fv_id;

   return next rtn;

exception
   when others then

     raise exception 'Ha ocurrido un error al grabar la cobranza. sp_doc_cobranza_save. %. %.',
                      sqlstate, sqlerrm;

end;
$BODY$
  language plpgsql volatile
  cost 100;
alter function sp_doc_cobranza_save(integer, integer)
  owner to postgres;