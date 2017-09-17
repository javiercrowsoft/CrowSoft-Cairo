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
-- Function: sp_doc_orden_pago_save()

-- drop function sp_doc_orden_pago_save(integer, integer, integer, integer);

create or replace
function sp_doc_orden_pago_save
(
  in p_us_id integer,
  in p_opgTMP_id integer,
  in p_no_raise_error integer default 0,
  in p_fc_id integer default null
)
  returns setof row_result as
$BODY$
declare
  rtn row_result;
  
  v_opg_id integer;
  v_opgi_id integer;
  v_is_new integer;
  v_orden smallint;
  v_opg_fecha date;
  v_prov_id integer;
  v_doc_id integer;
  v_doct_id integer;
  v_opg_nrodoc varchar(50);
  v_emp_id integer;

  v_opg_numero integer;
  v_opg_descrip varchar(5000);
  v_opg_neto decimal(18,6);
  v_opg_total decimal(18,6);
  v_opg_pendiente decimal(18,6);
  v_opg_cotizacion decimal(18,6);
  v_opg_otros decimal(18,6);
  v_opg_grabarAsiento smallint;

  v_est_id integer;
  v_suc_id integer;
  v_ta_id integer;
  v_ccos_id integer;
  v_lgj_id integer;
  v_creado date;
  v_modificado date;
  v_modifico integer;

  v_opgi_orden smallint;
  v_opgi_descrip varchar(5000);
  v_opgi_descuento varchar(100);
  v_opgi_neto decimal(18,6);
  v_opgi_importe decimal(18,6);
  v_opgi_importeorigen decimal(18,6);
  v_opgi_otroTipo smallint;
  v_opgi_porcRetencion decimal(18,6);
  v_opgi_fechaRetencion date;
  v_opgi_nroRetencion varchar(100);
  v_opgi_tipo smallint;

  v_cheq_id integer;
  v_cue_id integer;
  v_cle_id integer;
  v_chq_id integer;
  v_bco_id integer;
  v_mon_id integer;
  v_ret_id integer;
  v_fc_id_ret integer;

  v_cheq_numerodoc varchar(100);
  v_cheq_fechaCobro date;
  v_cheq_fechaVto date;
  v_tjcc_numero integer;
  v_tjcc_numerodoc varchar(100);

  v_opgiTMP_fechaVto date;
  v_opgiTMP_nroTarjeta varchar(50);
  v_opgiTMP_nroAutorizacion varchar(50);
  v_opgiTMP_titular varchar(255);
  v_opgiTCheques smallint;
  v_opgiTEfectivo smallint;
  v_opgiTTarjeta smallint;
  v_opgiTOtros smallint;
  v_opgiTCtaCte smallint;
  v_opgiTChequesT smallint;

  v_cheque_propio smallint;

  v_fc_id integer;
  v_fcd_id integer;
  v_doct_id_ncnd integer;
  v_fcopg_id integer;
  v_fcopg_importe decimal(18,6);
  v_fcd_pendiente decimal(18,6);
  v_fcp_id integer;
  v_fcopg_importeOrigen decimal(18,6);
  v_fcopg_cotizacion decimal(18,6);
  v_fcd_fecha date;

  v_pago decimal(18,6);
  v_pagoOrigen decimal(18,6);

  v_cfg_valor varchar(5000);

  v_success integer;
  v_error smallint;
  v_error_msg varchar;

  v_ta_propuesto smallint;
  v_ta_tipo smallint;
  v_ta_nrodoc varchar(100);
  v_ta_id_ret integer;

  v_as_id integer;

  dummyChar varchar;

begin

   -- si no existe chau
   --
   if not exists ( select opgTMP_id
               from OrdenPagoTMP
               where opgTMP_id = p_opgTMP_id ) then

      return query select * from result_failed();
      return;

   end if;

   select sp_cfg_getValor('Tesoreria-General', 'Exigir Centro Costo OPG') into v_cfg_valor;

   v_cfg_valor := coalesce(v_cfg_valor, '0');

   if to_number(v_cfg_valor) <> 0 then

      if exists ( select ccos_id
                  from OrdenPagoTMP
                  where ccos_id is null
                    and opgTMP_id = p_opgTMP_id ) then

         if exists ( select ccos_id
                     from OrdenPagoItemTMP
                     where ccos_id is null
                       and opgTMP_id = p_opgTMP_id
                       and opgi_tipo in ( 1,2,4,6 ) ) then

            raise exception '@@ERROR_SP:Debe indicar un centro de costo en cada item o un centro de costo en la cabecera del documento.';

         end if;
      end if;
   end if;

   v_error_msg := '';

   select opg_id,
          opg_fecha,
          prov_id,
          Documento.doc_id,
          doct_id,
          opg_nrodoc,
          emp_id
     into v_opg_id,
          v_opg_fecha,
          v_prov_id,
          v_doc_id,
          v_doct_id,
          v_opg_nrodoc,
          v_emp_id
   from OrdenPagoTMP
   join Documento
     on OrdenPagoTMP.doc_id = Documento.doc_id
   where opgTMP_id = p_opgTMP_id;

   v_opg_id := coalesce(v_opg_id, 0);

   v_opgiTCheques := 1;
   v_opgiTEfectivo := 2;
   v_opgiTTarjeta := 3;
   v_opgiTOtros := 4;
   v_opgiTCtaCte := 5;
   v_opgiTChequesT := 6;
   v_cheque_propio := 1;

   SET TRANSACTION READ WRITE;

/*
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
//                                        insert                                                                      //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
*/

   -- si es una nueva OrdenPago
   --
   if v_opg_id = 0 then

      -- este flag es para cuando grabe los items
      --
      v_is_new := -1;

      -- obtengo id y numero para la OrdenPago
      --
      select sp_dbGetNewId('OrdenPago', 'opg_id') into v_opg_id;
      select sp_dbGetNewId('OrdenPago', 'opg_numero') into v_opg_numero;

      select * from sp_talonario_get_propuesto(v_doc_id) into dummyChar, v_ta_propuesto, v_ta_id, v_ta_tipo;

      if v_ta_propuesto = 0 then

         if v_ta_tipo = 3 /* auto impresor */ then

            select sp_talonario_get_next_number(v_ta_id) into v_ta_nrodoc;

            -- con esto evitamos que dos tomen el mismo numero
            --
            perform sp_talonario_set(v_ta_id, v_ta_nrodoc);

            v_opg_nrodoc := v_ta_nrodoc;

         end if;

      end if;

      insert into OrdenPago( opg_id, opg_numero, opg_nrodoc, opg_descrip, opg_fecha, opg_neto, opg_otros, opg_total,
                             opg_cotizacion, opg_grabarAsiento, est_id, suc_id, prov_id, emp_id, doc_id, doct_id,
                             ccos_id, lgj_id, modifico )
           ( select v_opg_id,
                    v_opg_numero,
                    v_opg_nrodoc,
                    opg_descrip,
                    opg_fecha,
                    opg_neto,
                    opg_otros,
                    opg_total,
                    opg_cotizacion,
                    opg_grabarAsiento,
                    est_id,
                    suc_id,
                    prov_id,
                    v_emp_id,
                    doc_id,
                    v_doct_id,
                    ccos_id,
                    lgj_id,
                    modifico
             from OrdenPagoTMP
             where opgTMP_id = p_opgTMP_id );

      select opg_nrodoc
        into v_opg_nrodoc
      from OrdenPago
      where opg_id = v_opg_id;

/*
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
//                                        update                                                                      //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
*/
   else

      v_is_new := 0;

      select opg_id,
             opg_nrodoc,
             opg_descrip,
             opg_fecha,
             opg_neto,
             opg_otros,
             opg_total,
             opg_cotizacion,
             opg_grabarAsiento,
             est_id,
             suc_id,
             prov_id,
             ccos_id,
             lgj_id,
             modifico,
             modificado
        into v_opg_id,
             v_opg_nrodoc,
             v_opg_descrip,
             v_opg_fecha,
             v_opg_neto,
             v_opg_otros,
             v_opg_total,
             v_opg_cotizacion,
             v_opg_grabarAsiento,
             v_est_id,
             v_suc_id,
             v_prov_id,
             v_ccos_id,
             v_lgj_id,
             v_modifico,
             v_modificado
      from OrdenPagoTMP
      where opgTMP_id = p_opgTMP_id;


      update OrdenPago
         set opg_nrodoc = v_opg_nrodoc,
             opg_descrip = v_opg_descrip,
             opg_fecha = v_opg_fecha,
             opg_neto = v_opg_neto,
             opg_otros = v_opg_otros,
             opg_total = v_opg_total,
             opg_cotizacion = v_opg_cotizacion,
             opg_grabarAsiento = v_opg_grabarAsiento,
             est_id = v_est_id,
             suc_id = v_suc_id,
             prov_id = v_prov_id,
             doc_id = v_doc_id,
             doct_id = v_doct_id,
             ccos_id = v_ccos_id,
             lgj_id = v_lgj_id,
             modifico = v_modifico,
             modificado = v_modificado
      where opg_id = v_opg_id;

   end if;

/*
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
//                                        items                                                                       //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
*/

   -- recorro con un while que es mas rapido que un cursor. uso opgi_orden como puntero.
   --
   v_orden := 1;

   while exists(
                select opgi_orden
                from OrdenPagoItemTMP
                where opgTMP_id = p_opgTMP_id
                  and opgi_orden = v_orden
               )
   loop
      -- cargo todo el registro de OrdenPagos en variables
      --
      select opgi_id,
             opgi_orden,
             opgi_descrip,
             opgi_importe,
             opgi_importeorigen,
             ccos_id,
             opgi_otroTipo,
             opgi_porcRetencion,
             opgi_fechaRetencion,
             opgi_nroRetencion,
             opgi_tipo,
             chq_id,
             cheq_id,
             cue_id,
             bco_id,
             cle_id,
             opgiTMP_cheque,
             opgiTMP_fechaCobro,
             opgiTMP_fechaVto,
             opgiTMP_cupon,
             opgiTMP_fechaVto,
             opgiTMP_nroTarjeta,
             opgiTMP_autorizacion,
             opgiTMP_titular,
             mon_id,
             ret_id,
             fc_id_ret
        into v_opgi_id,
             v_opgi_orden,
             v_opgi_descrip,
             v_opgi_importe,
             v_opgi_importeorigen,
             v_ccos_id,
             v_opgi_otroTipo,
             v_opgi_porcRetencion,
             v_opgi_fechaRetencion,
             v_opgi_nroRetencion,
             v_opgi_tipo,
             v_chq_id,
             v_cheq_id,
             v_cue_id,
             v_bco_id,
             v_cle_id,
             v_cheq_numerodoc,
             v_cheq_fechaCobro,
             v_cheq_fechaVto,
             v_tjcc_numerodoc,
             v_opgiTMP_fechaVto,
             v_opgiTMP_nroTarjeta,
             v_opgiTMP_nroAutorizacion,
             v_opgiTMP_titular,
             v_mon_id,
             v_ret_id,
             v_fc_id_ret
      from OrdenPagoItemTMP
      where opgTMP_id = p_opgTMP_id
        and opgi_orden = v_orden;

         -- cheques
         --
      select sp_doc_op_mf_cheque_save(v_opgi_tipo,
                                      v_cheq_numerodoc,
                                      v_opgi_importe,
                                      v_opgi_importeOrigen,
                                      v_cheq_fechaCobro,
                                      v_cheq_fechaVto,
                                      v_opgi_descrip,
                                      v_chq_id,
                                      v_opg_id,
                                      null,
                                      null,
                                      v_cle_id,
                                      v_mon_id,
                                      v_prov_id,
                                      null)
      into v_cheq_id;

/*
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
//                                        insert                                                                      //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
*/

      -- si es un renglon nuevo o una OrdenPago nueva
      --
      if v_is_new <> 0 or v_opgi_id = 0 then

         select sp_dbGetNewId('OrdenPagoItem', 'opgi_id') into v_opgi_id;

         insert into OrdenPagoItem( opg_id, opgi_id, opgi_orden, opgi_descrip, opgi_importe, opgi_importeorigen,
                                    ccos_id, opgi_otroTipo, opgi_porcRetencion, opgi_fechaRetencion, opgi_nroRetencion,
                                    opgi_tipo, cheq_id, chq_id, cue_id, ret_id, fc_id_ret )
         values ( v_opg_id, v_opgi_id, v_opgi_orden, v_opgi_descrip, v_opgi_importe, v_opgi_importeorigen, v_ccos_id,
                  v_opgi_otroTipo, v_opgi_porcRetencion, v_opgi_fechaRetencion, v_opgi_nroRetencion, v_opgi_tipo,
                  v_cheq_id, v_chq_id, v_cue_id, v_ret_id, v_fc_id_ret );

         v_ta_id_ret := null;

         select ta_id
            into v_ta_id_ret
         from Retencion
         where ret_id = v_ret_id;

         if v_ta_id_ret is not null then

            perform sp_talonario_set(v_ta_id_ret, v_opgi_nroRetencion);

         end if;
/*
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
//                                        update                                                                      //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
*/
      else

         update OrdenPagoItem
            set opg_id = v_opg_id,
                opgi_orden = v_opgi_orden,
                opgi_descrip = v_opgi_descrip,
                opgi_importe = v_opgi_importe,
                opgi_importeorigen = v_opgi_importeorigen,
                ccos_id = v_ccos_id,
                opgi_otroTipo = v_opgi_otroTipo,
                opgi_porcRetencion = v_opgi_porcRetencion,
                opgi_fechaRetencion = v_opgi_fechaRetencion,
                opgi_nroRetencion = v_opgi_nroRetencion,
                opgi_tipo = v_opgi_tipo,
                chq_id = v_chq_id,
                cheq_id = v_cheq_id,
                cue_id = v_cue_id,
                ret_id = v_ret_id,
                fc_id_ret = v_fc_id_ret
         where opg_id = v_opg_id
           and opgi_id = v_opgi_id;

      end if;

      v_orden := v_orden + 1;

   end loop;


   -- cuenta en OrdenPagoItem para cheques propios
   --
   update OrdenPagoItem
       set cue_id = (select chq.cue_id
                     from Chequera chq inner join Cheque cheq
                       on chq.chq_id = cheq.chq_id
                     where cheq_id = OrdenPagoItem.cheq_id)

   where opgi_tipo = 1
     and exists (select 1
                 from Chequera chq inner join Cheque cheq
                   on chq.chq_id = cheq.chq_id
                 where cheq_id = OrdenPagoItem.cheq_id);

  for v_fcopg_id,v_fc_id,v_fcd_id,v_fcopg_importe,v_fcopg_importeOrigen,v_fcopg_cotizacion in
     select fcopg_id,
            fc_id,
            fcd_id,
            fcopg_importe,
            fcopg_importeOrigen,
            fcopg_cotizacion
     from FacturaCompraOrdenPagoTMP
     where opgTMP_id = p_opgTMP_id   
  loop

     -- este es el while de pago agrupado. abajo esta la explicacion
     --
     while v_fcopg_importe > 0
     loop
        
        -- obtengo el monto de la deuda
        --
        -- la OrdenPago permite cobrar sobre toda la deuda de la factura o sobre cada uno de sus vencimientos.
        -- esto complica un poco la cosa para el programador. Si en la info de aplicacion (registro de la tabla
        -- FacturaCompraOrdenPagoTMP no tengo un fcd_id (id del vencimiento), es por que se efectuo la OrdenPago
        -- sobre toda la deuda de la factura. Esto se entiende con un ejemplo:
        --        Supongamos una factura con vtos. 30, 60 y 90 dias. Tiene 3 vtos, pero el usuario decide
        --        aplicar sobre los tres agrupados un importe dado, para el ejemplo supongamos que los vtos
        --        son todos de 30 pesos o sea 90 pesos el total, y el usuario aplica 80 pesos. El sistema tiene
        --        que aplicar 30 al primer vto, 30 al segundo y 20 al tercero. Para poder hacer esto es que utiliza
        --        el while que esta arriba (while de pago agrupado).
        --
        -- observen el If, si no hay fcd_id tomo el primero con el select que ordena por fcd_fecha
        --
        if coalesce(v_fcd_id, 0) = 0 then

           select fcd_id,
                  fcd_pendiente
             into v_fcd_id,
                  v_fcd_pendiente
           from ( select fcd_id,
                         fcd_pendiente
                  from FacturaCompraDeuda
                  where fc_id = v_fc_id
                  order by fcd_fecha DESC ) t
                  limit 1;

        -- si hay info de deuda (fcd_id <> 0) todo es mas facil
        --
        else

           select fcd_pendiente
             into v_fcd_pendiente
           from FacturaCompraDeuda
           where fcd_id = v_fcd_id;

        end if;

        -- si el pago no cancela el pendiente
        --
        if v_fcd_pendiente - v_fcopg_importe >= 0.01 then

           -- no hay pago
           --
           v_fcp_id := null;
           v_pago := v_fcopg_importe;
           v_pagoOrigen := v_fcopg_importeOrigen;

        -- si el pago cancela la deuda cargo un nuevo pago
        -- y luego voy a borrar la deuda
        --
        else

           if coalesce(v_fcopg_cotizacion, 0) <> 0 then
              v_pagoOrigen := v_fcd_pendiente / v_fcopg_cotizacion;
           else
              v_pagoOrigen := 0;
           end if;

           -- acumulo en el pago toda la deuda para pasar de la tabla FacturaCompraDeuda a FacturaCompraPago
           -- ojo: uso la variable pago para acumular toda la deuda, pero despues de insertar el pago
           --      le asigno a esta variable solo el monto de deuda pendiente que cancele con este pago
           --
           v_pago := 0;

           select fcd_fecha,
                  fcd_pendiente
             into v_fcd_fecha,
                  v_pago
           from FacturaCompraDeuda
           where fcd_id = v_fcd_id;

           select v_pago + coalesce(sum(fcopg_importe), 0)
             into v_pago
           from FacturaCompraOrdenPago
           where fcd_id = v_fcd_id;

           select v_pago + coalesce(sum(fcnc_importe), 0)
             into v_pago
           from FacturaCompraNotaCredito
           where fcd_id_factura = v_fcd_id;

           select sp_dbGetNewId('FacturaCompraPago', 'fcp_id') into  v_fcp_id;

           insert into FacturaCompraPago( fcp_id, fcp_fecha, fcp_importe, fc_id )
           values ( v_fcp_id, v_fcd_fecha, v_pago, v_fc_id );

           -- como explique mas arriba:
           -- esta variable se usa para vincular el pago con la OrdenPago
           -- asi que la actualizo a la deuda que esta OrdenPago cancela
           --
           v_pago := v_fcd_pendiente;

        end if;

        -- si hay pago borro la/s deudas
        --
        if coalesce(v_fcp_id, 0) <> 0 then

           -- primero actualizo las referencias pasando de deuda a pago
           --
           update FacturaCompraOrdenPago
              set fcd_id = null,
                  fcp_id = v_fcp_id
           where fcd_id = v_fcd_id;

           update FacturaCompraNotaCredito
              set fcd_id_factura = null,
                  fcp_id_factura = v_fcp_id
           where fcd_id_factura = v_fcd_id;

           -- ahora si borro
           --
           delete from FacturaCompraDeuda
           where fc_id = v_fc_id
             and ( fcd_id = v_fcd_id or coalesce(v_fcd_id, 0) = 0 );

           -- no hay mas deuda
           --
           v_fcd_id := null;

        end if;

        -- finalmente grabo la vinculacion que puede estar asociada a una deuda o a un pago
        --
        select sp_dbGetNewId('FacturaCompraOrdenPago', 'fcopg_id') into v_fcopg_id;

        insert into FacturaCompraOrdenPago( fcopg_id, fcopg_importe, fcopg_importeOrigen, fcopg_cotizacion, fc_id,
                                            fcd_id, fcp_id, opg_id )
        values ( v_fcopg_id, v_pago, v_pagoOrigen, v_fcopg_cotizacion,
                 v_fc_id, v_fcd_id,     --> uno de estos dos es null
                 v_fcp_id, v_opg_id );  -->  "       "        "

        -- si no hay un pago actualizo la deuda decrementandola
        --
        if coalesce(v_fcp_id, 0) = 0 then

           update FacturaCompraDeuda
              set fcd_pendiente = fcd_pendiente - v_pago
           where fcd_id = v_fcd_id;

        end if;

        -- voy restando al pago el importe aplicado
        --
        v_fcopg_importe := v_fcopg_importe - v_pago;

     end loop;

  end loop;


/*
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
//                                        item's borrados                                                             //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
*/

   -- hay que borrar los items borrados de la ordenpago solo si esta no es nueva
   --
   if v_is_new = 0 then


      -- antes que nada voy a tener que desvincular los cheques de los
      -- asientoitem vinculados a esta OP
      --

      select as_id
        into v_as_id
      from OrdenPago
      where opg_id = v_opg_id;

      if v_as_id is not null then

         update AsientoItem
            set cheq_id = null
         where as_id = v_as_id;

      end if;

      -- hay tres situaciones a resolver con los cheques
      --
      -- 1- borrar los cheques propios emitidos por esta orden
      --
      -- 2- devolver a la cuenta mencionada en el ultimo
      --    movimiento de fondos que menciono al cheque
      --
      -- 3- devolver a documentos en cartera los cheques
      --    ingresados por una cobranza
      --

      create temporary table tt_cheques_a_borrar(cheq_id integer, opgi_id integer) on commit drop;

      insert into tt_cheques_a_borrar( cheq_id, opgi_id )
        ( select cheq_id,
                 opgi_id
          from OrdenPagoItem
          where opgi_id in ( select opgit.opgi_id
                             from OrdenPagoItemBorradoTMP opgit
                             where opgTMP_id = p_opgTMP_id )
            and cheq_id is not null );

      update OrdenPagoItem
         set cheq_id = null
      where opgi_id in ( select opgit.opgi_id
                         from OrdenPagoItemBorradoTMP opgit
                         where opgTMP_id = p_opgTMP_id );

      -- borro los cheques propios entregados al proveedor
      --
      delete from Cheque
      where opg_id = v_opg_id
        and chq_id is not null-- solo los cheques propios tienen chequera (chq_id)
        and mf_id is null-- no entraron por movimiento de fondos
        and exists ( select opgit.opgi_id
                     from OrdenPagoItemBorradoTMP opgit
                     join OrdenPagoItem opgi
                       on opgit.opgi_id = opgi.opgi_id
                     join tt_cheques_a_borrar b
                       on opgit.opgi_id = b.opgi_id
                     where opgit.opg_id = v_opg_id
                       and opgit.opgTMP_id = p_opgTMP_id
                       and Cheque.cheq_id = b.cheq_id );

      -- devuelvo a documentos en cartera los cheques de tercero y los desvinculo de esta orden de pago
      --
      update Cheque
         set cue_id = (select cue_id_debe
                       from MovimientoFondoItem
                       where cheq_id = Cheque.cheq_id
                         and mf_id = Cheque.mf_id),
             opg_id = null
      where exists(select cue_id_debe
                   from MovimientoFondoItem
                   where cheq_id = Cheque.cheq_id
                     and mf_id = Cheque.mf_id)
        and Cheque.opg_id = v_opg_id
        and exists ( select opgit.opgi_id
                     from OrdenPagoItemBorradoTMP opgit
                     join OrdenPagoItem opgi
                       on opgit.opgi_id = opgi.opgi_id
                     where opgit.opg_id = v_opg_id
                       and opgit.opgTMP_id = p_opgTMP_id
                       and Cheque.cheq_id = opgi.cheq_id );

      -- devuelvo a documentos en cartera los cheques de tercero y los desvinculo de esta orden de pago
      --
      update Cheque
         set cue_id = (select cue_id
                       from CobranzaItem
                       where cheq_id = Cheque.cheq_id),
             opg_id = null
      where exists(select cue_id
                   from CobranzaItem
                   where cheq_id = Cheque.cheq_id)
        and Cheque.opg_id = v_opg_id
        and mf_id is null
        and exists ( select opgit.opgi_id
                     from OrdenPagoItemBorradoTMP opgit
                     join OrdenPagoItem opgi
                       on opgit.opgi_id = opgi.opgi_id
                     where opgit.opg_id = v_opg_id
                       and opgit.opgTMP_id = p_opgTMP_id
                       and Cheque.cheq_id = opgi.cheq_id );

      -- finalmente borro los items
      --
      delete from OrdenPagoItem
      where exists ( select opgi_id
                     from OrdenPagoItemBorradoTMP
                     where opg_id = v_opg_id
                       and opgTMP_id = p_opgTMP_id
                       and opgi_id = OrdenPagoItem.opgi_id );

      -- chau temporal
      --
      delete from OrdenPagoItemBorradoTMP
      where opg_id = v_opg_id
        and opgTMP_id = p_opgTMP_id;

   end if;

/*
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
//                                        cheques                                                                     //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
*/

   -- valido que no use un cheque dos veces en una misma op
   --
   if exists ( select cheq_id
               from OrdenPagoItem
               where opg_id = v_opg_id
                 and cheq_id is not null
               group by cheq_id
               having count(*) > 1 ) then

      raise exception '@@ERROR_SP:Esta orden de pago menciona uno o varios cheques mas de una vez.';

   end if;


/*
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
//                                        temporales                                                                  //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
*/

   delete from FacturaCompraOrdenPagoTMP where opgTMP_id = p_opgTMP_id;
   delete from OrdenPagoItemTMP where opgTMP_id = p_opgTMP_id;
   delete from OrdenPagoTMP where opgTMP_id = p_opgTMP_id;

/*
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
//                                        pendiente                                                                   //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
*/

   select sum(fcopg_importe)
     into v_opg_pendiente
   from FacturaCompraOrdenPago
   where opg_id = v_opg_id;

   update OrdenPago
      set opg_pendiente = opg_total - coalesce(v_opg_pendiente, 0)
   where opg_id = v_opg_id;

   for v_fc_id in
      select distinct fc_id
      from FacturaCompraOrdenPago
      where opg_id = v_opg_id
   loop

      -- actualizo la deuda de la factura
      --
      perform sp_doc_factura_compra_set_pendiente(v_fc_id);

      -- estado
      --
      perform sp_doc_factura_compra_set_credito(v_fc_id);

      perform sp_doc_factura_compra_set_estado(v_fc_id);

      -- validaciones
      --
      -- estado
      --
      select * from sp_auditoria_estado_check_doc_fc(v_fc_id) into v_success, v_error_msg;

      -- si el documento no es valido
      --
      if coalesce(v_success, 0) = 0 then
         raise exception '%', v_error_msg;
      end if;

      -- vtos
      --
      select * from sp_auditoria_vto_check_doc_fc(v_fc_id) into v_success, v_error_msg;

      -- si el documento no es valido
      --
      if coalesce(v_success, 0) = 0 then
         raise exception '%', v_error_msg;
      end if;

      -- credito
      --
      select * from sp_auditoria_credito_check_doc_fc(v_fc_id) into v_success, v_error_msg;

      -- si el documento no es valido
      if coalesce(v_success, 0) = 0 then
         raise exception '%', v_error_msg;
      end if;

   end loop;


/*
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
//                                        talonario                                                                   //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
*/
   select ta_id
     into v_ta_id
   from Documento
   where doc_id = v_doc_id;

   perform sp_talonario_set(v_ta_id, v_opg_nrodoc);

/*
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
//                                        estado                                                                      //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
*/
   perform sp_doc_orden_pago_set_credito(v_opg_id);

   perform sp_doc_orden_pago_set_estado(v_opg_id);

   perform sp_doc_orden_pago_cheque_set_credito(v_opg_id);

   select sp_cfg_getValor('Tesoreria-General', 'OrdenPago-Grabar Asiento') into v_cfg_valor;

   v_cfg_valor := coalesce(v_cfg_valor, '0');

   if to_number(v_cfg_valor) <> 0 then

      select * from sp_doc_orden_pago_asiento_save(v_opg_id, 0, p_fc_id) into v_error, v_error_msg;

      if v_error <> 0 then
         raise exception '%', v_error_msg;
      end if;

   else

      if not exists ( select opg_id
                      from OrdenPagoAsiento
                      where opg_id = v_opg_id ) then

         insert into OrdenPagoAsiento( opg_id, opg_fecha )
           ( select opg_id,
                    opg_fecha
             from OrdenPago
             where opg_grabarAsiento <> 0
               and opg_id = v_opg_id );

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
   select * from sp_auditoria_estado_check_doc_opg(v_opg_id) into v_success, v_error_msg;

   -- si el documento no es valido
   --
   if coalesce(v_success, 0) = 0 then
      raise exception '%', v_error_msg;
   end if;

   -- totales
   --
   select * from sp_auditoria_totales_check_doc_opg(v_opg_id) into v_success, v_error_msg;

   -- si el documento no es valido
   --
   if coalesce(v_success, 0) = 0 then
      raise exception '%', v_error_msg;
   end if;

   -- credito
   --
   select * from sp_auditoria_credito_check_doc_opg(v_opg_id) into v_success, v_error_msg;

   -- si el documento no es valido
   --
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
   select modifico into v_modifico from OrdenPago where opg_id = v_opg_id;

   if v_is_new <> 0 then
      perform sp_historia_update(18005, v_opg_id, v_modifico, 1);
   else
      perform sp_historia_update(18005, v_opg_id, v_modifico, 3);
   end if;

/*
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
//                                     fin                                                                            //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
*/

   rtn.type := 'opg_id';
   rtn.id := v_opg_id;

   return next rtn;

exception
   when others then

      if p_no_raise_error = 0 then

         raise exception 'Ha ocurrido un error al grabar la Orden de Pago. sp_doc_orden_pago_save. %. %.',
                         sqlstate, sqlerrm;
      else

         v_error_msg := sqlerrm || '. sqlstate: ' || sqlstate;
         return query select result_error(v_error_msg);

      end if;

end;
$BODY$
  language plpgsql volatile
  cost 100;
alter function sp_doc_orden_pago_save(integer, integer, integer, integer)
  owner to postgres;