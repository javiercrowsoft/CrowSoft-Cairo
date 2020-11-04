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
-- Function: sp_doc_factura_compra_nota_credito_save()

-- drop function sp_doc_factura_compra_nota_credito_save(integer, integer);

create or replace function sp_doc_factura_compra_nota_credito_save
(
  in p_us_id integer,
  in p_fcTMP_id integer
)
  returns void as
$BODY$
declare
   v_success integer;
   v_error_msg varchar(5000);
   v_fcnc_id integer;
   v_fcnc_importe decimal(18,6);
   v_fcd_pendiente decimal(18,6);
   v_fcd_importe decimal(18,6);
   v_pago decimal(18,6);
   v_fcd_id integer;
   v_fcp_id integer;
   v_doct_id integer;
   v_fc_id integer;
   v_fcp_fecha timestamp with time zone;
   v_fcd_fecha timestamp with time zone;
   v_fcd_fecha2 timestamp with time zone;
   v_borrar_vinculacion smallint;
   v_fcd_id_factura integer;
   v_fcd_id_notacredito integer;
   v_fcp_id_factura integer;
   v_fcp_id_notacredito integer;
   v_fc_id_factura integer;
   v_fc_id_notacredito integer;
   v_fc_id_aplic integer;
   v_c_fcncaplic varchar(4000);
begin

   v_borrar_vinculacion := 0;

   select fc_id
     into v_fc_id
   from FacturaCompraTMP
   where fcTMP_id = p_fcTMP_id;

   select d.doct_id
     into v_doct_id
   from FacturaCompraTMP tmp
   join Documento d
     on tmp.doc_id = d.doc_id
   where tmp.doc_id = d.doc_id
     and tmp.fcTMP_id = p_fcTMP_id;

/*
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
//                                        aplicacion-previa                                                           //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
*/

   create temporary table tt_FacturaCompraNotaCredito(fc_id integer) on commit drop;

   /* nota de credito */
   if v_doct_id = 8 then

      if exists ( select fcnc_id
                  from FacturaCompraNotaCredito
                  where fc_id_notacredito = v_fc_id ) then

         v_borrar_vinculacion := 1;

         insert into tt_FacturaCompraNotaCredito
           ( fc_id )
           ( select distinct fc_id_factura
             from FacturaCompraNotaCredito fcnc
             where fc_id_notacredito = v_fc_id
               and not exists ( select *
                                from FacturaCompraNotaCreditoTMP
                                where fcTMP_id = p_fcTMP_id
                                  and fcnc_importe <> 0
                                  and fc_id_factura = fcnc.fc_id_factura ) );
      end if;

   else

      /* nota de debito y factura */
      if exists ( select fcnc_id
                  from FacturaCompraNotaCredito
                  where fc_id_factura = v_fc_id ) then

         v_borrar_vinculacion := 1;

         insert into tt_FacturaCompraNotaCredito
           ( fc_id )
           ( select distinct fc_id_notacredito
             from FacturaCompraNotaCredito fcnc
             where fc_id_factura = v_fc_id
               and not exists ( select *
                                from FacturaCompraNotaCreditoTMP
                                where fcTMP_id = p_fcTMP_id
                                  and fcnc_importe <> 0
                                  and fc_id_notacredito = fcnc.fc_id_notacredito ) );

      end if;

   end if;

   SET TRANSACTION READ WRITE;

   -- tengo que eliminar la aplicacion anterior si es que existe
   --
   if coalesce(v_borrar_vinculacion, 0) <> 0 then

      /* nota de credito *//* nota de debito y factura *//* nota de credito *//* nota de debito y factura */

      for v_fcnc_id,v_fcd_id_notacredito,v_fcd_id_factura,v_fcp_id_notacredito,v_fcp_id_factura,v_fcnc_importe in
         select fcnc_id,
                fcd_id_notacredito,
                fcd_id_factura,
                fcp_id_notacredito,
                fcp_id_factura,
                fcnc_importe
         from FacturaCompraNotaCredito
         where ( ( fcd_id_notacredito is not null ) and ( fc_id_notacredito = v_fc_id and v_doct_id = 8 ) )
            or ( ( fcd_id_factura is not null ) and ( fc_id_factura = v_fc_id and v_doct_id <> 8 ) )
            or ( ( fcp_id_notacredito is not null ) and ( fc_id_notacredito = v_fc_id and v_doct_id = 8 ) )
            or ( ( fcp_id_factura is not null ) and ( fc_id_factura = v_fc_id and v_doct_id <> 8 ) )

      loop

         -- actualizo la deuda de la factura
         --
         if v_fcd_id_factura is not null then

            update FacturaCompraDeuda
               set fcd_pendiente = fcd_pendiente + v_fcnc_importe
            where fcd_id = v_fcd_id_factura;

         end if;

         -- actualizo la deuda de la nota de credito
         --
         if v_fcd_id_notacredito is not null then

            update FacturaCompraDeuda
            set fcd_pendiente = fcd_pendiente + v_fcnc_importe
            where fcd_id = v_fcd_id_notacredito;

         end if;

         -- si hay un pago
         --
         if v_fcp_id_factura is not null then

            if exists ( select fcp_id
                        from FacturaCompraPago
                        where fcp_id = v_fcp_id_factura ) then

               select fc_id,
                      fcp_importe,
                      fcp_fecha
                 into v_fc_id_factura,
                      v_fcd_importe,
                      v_fcp_fecha
               from FacturaCompraPago
               where fcp_id = v_fcp_id_factura;

               select coalesce(sum(fcnc_importe), 0)
                 into v_fcd_pendiente
               from FacturaCompraNotaCredito fcnc
               where fcp_id_factura = v_fcp_id_factura
               and exists ( select *
                            from FacturaCompraNotaCreditoTMP fcnctmp
                            where fcTMP_id = p_fcTMP_id
                              and ( fcnctmp.fcd_id_notacredito = fcnc.fcd_id_notacredito
                                    or fcnctmp.fcp_id_notacredito = fcnc.fcp_id_notacredito ) );

               -- creo una deuda
               --
               select sp_dbGetNewId('FacturaCompraDeuda', 'fcd_id') into v_fcd_id;

               select sp_doc_get_fecha2(v_fcp_fecha, 0, null) into v_fcd_fecha2;

               insert into FacturaCompraDeuda
                      ( fcd_id, fcd_fecha, fcd_fecha2, fcd_importe, fcd_pendiente, fc_id )
               values ( v_fcd_id, v_fcp_fecha, v_fcd_fecha2, v_fcd_importe, v_fcd_pendiente, v_fc_id_factura );

               -- actualizo la tabla de vinculacion para que apunte a la deuda
               --
               update FacturaCompraOrdenPago
                  set fcd_id = v_fcd_id,
                      fcp_id = null
               where fcp_id = v_fcp_id_factura;

               -- actualizo la tabla de vinculacion para que apunte a la deuda
               --
               update FacturaCompraNotaCredito
                  set fcd_id_factura = v_fcd_id,
                      fcp_id_factura = null
               where fcp_id_factura = v_fcp_id_factura;

               -- actualizo la temporal para que apunte a la deuda
               --
               update FacturaCompraNotaCreditoTMP
                  set fcd_id_factura = v_fcd_id
               where fcp_id_factura = v_fcp_id_factura;

               -- actualizo la temporal para que apunte a la deuda
               --
               update FacturaCompraOrdenPagoTMP
                  set fcp_id = null,
                      fcd_id = v_fcd_id
               where fcp_id = v_fcp_id_factura;

               -- borro el pago
               --
               delete from FacturaCompraPago where fcp_id = v_fcp_id_factura;

            end if;

         end if;

         if v_fcp_id_notacredito is not null then

            if exists ( select fcp_id
                        from FacturaCompraPago
                        where fcp_id = v_fcp_id_notacredito ) then

               select fc_id,
                      fcp_importe,
                      fcp_fecha
                 into v_fc_id_notacredito,
                      v_fcd_importe,
                      v_fcp_fecha
               from FacturaCompraPago
               where fcp_id = v_fcp_id_notacredito;


               select coalesce(sum(fcnc_importe), 0)
                 into v_fcd_pendiente
               from FacturaCompraNotaCredito fcnc
               where fcp_id_notacredito = v_fcp_id_notacredito
                 and exists ( select *
                              from FacturaCompraNotaCreditoTMP fcnctmp
                              where fcTMP_id = p_fcTMP_id
                                and ( fcnctmp.fcd_id_factura = fcnc.fcd_id_factura
                                     or fcnctmp.fcp_id_factura = fcnc.fcp_id_factura ) );

               -- creo una deuda
               --
               select sp_dbGetNewId('FacturaCompraDeuda', 'fcd_id') into v_fcd_id;

               select sp_doc_get_fecha2(v_fcp_fecha, 0, null) into v_fcd_fecha2;

               insert into FacturaCompraDeuda
                      ( fcd_id, fcd_fecha, fcd_fecha2, fcd_importe, fcd_pendiente, fc_id )
               values ( v_fcd_id, v_fcp_fecha, v_fcd_fecha2, v_fcd_importe, v_fcd_pendiente, v_fc_id_notacredito );

               -- actualizo la tabla de vinculacion para que apunte a la deuda
               --
               update FacturaCompraOrdenPago
                  set fcd_id = v_fcd_id,
                      fcp_id = null
               where fcp_id = v_fcp_id_notacredito;

               -- a ctualizo la tabla de vinculacion para que apunte a la deuda
               --
               update FacturaCompraNotaCredito
                  set fcd_id_notacredito = v_fcd_id,
                      fcp_id_notacredito = null
               where fcp_id_notacredito = v_fcp_id_notacredito;

               -- actualizo la temporal para que apunte a la deuda
               --
               update FacturaCompraNotaCreditoTMP
                  set fcd_id_notacredito = v_fcd_id
               where fcp_id_notacredito = v_fcp_id_notacredito;

               -- borro el pago
               --
               delete from FacturaCompraPago where fcp_id = v_fcp_id_notacredito;

            end if;

         end if;

         delete from FacturaCompraNotaCredito where fcnc_id = v_fcnc_id;

      end loop;


      delete from FacturaCompraNotaCredito
      where ( fc_id_notacredito = v_fc_id and v_doct_id = 8 )/* nota de credito*/
         or ( fc_id_factura = v_fc_id and v_doct_id <> 8 );/* nota de debito y Factura*/

   end if;

   for v_fcnc_importe,v_fc_id_factura,v_fc_id_notacredito,v_fcd_id_factura,
        v_fcd_id_notacredito,v_fcp_id_factura,v_fcp_id_notacredito in 
      select fcnc_importe,
             fc_id_factura,
             fc_id_notacredito,
             fcd_id_factura,
             fcd_id_notacredito,
             fcp_id_factura,
             fcp_id_notacredito
      from FacturaCompraNotaCreditoTMP
      where fcTMP_id = p_fcTMP_id
        and fcnc_importe <> 0
   loop

   /*
   ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
   //                                                                                                               //
   //                                        factura                                                                //
   //                                                                                                               //
   ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
   */
         -- si tengo una factura
         --
         if v_fcd_id_factura is not null then

            -- obtengo el monto de la deuda
            --
            select fcd_pendiente
              into v_fcd_pendiente
            from FacturaCompraDeuda
            where fcd_id = v_fcd_id_factura;

            -- si el pago no cancela el pendiente
            --
            if v_fcd_pendiente - v_fcnc_importe >= 0.01 then

               -- no hay pago
               v_fcp_id := null;

            -- si el pago cancela la deuda cargo un nuevo pago
            -- y luego voy a borrar la deuda
            --
            else

               -- acumulo en el pago toda la deuda para pasar de la tabla FacturaCompraDeuda a FacturaCompraPago
               --
               v_pago := 0;


               select fcd_fecha,
                      fcd_importe
                 into v_fcd_fecha,
                      v_pago
               from FacturaCompraDeuda
               where fcd_id = v_fcd_id_factura;

               select sp_dbGetNewId('FacturaCompraPago', 'fcp_id') into v_fcp_id;

               insert into FacturaCompraPago
                      ( fcp_id, fcp_fecha, fcp_importe, fc_id )
               values ( v_fcp_id, v_fcd_fecha, v_pago, v_fc_id_factura );

               v_fcp_id_factura := v_fcp_id;

            end if;

            -- si hay pago borro la/s deudas
            --
            if coalesce(v_fcp_id, 0) <> 0 then
               
               -- actualizo la tabla de vinculacion para que apunte al pago
               --
               update FacturaCompraOrdenPago
                  set fcd_id = null,
                      fcp_id = v_fcp_id
               where fcd_id = v_fcd_id_factura;

               -- actualizo la tabla de vinculacion para que apunte a la deuda
               --
               update FacturaCompraNotaCredito
                  set fcd_id_factura = null,
                      fcp_id_factura = v_fcp_id
               where fcd_id_factura = v_fcd_id_factura;

               -- actualizo la temporal para que apunte a la deuda
               --
               update FacturaCompraNotaCreditoTMP
                  set fcd_id_factura = null,
                      fcp_id_factura = v_fcp_id
               where fcd_id_factura = v_fcd_id_factura;

               -- actualizo la temporal para que apunte a la deuda
               --
               update FacturaCompraOrdenPagoTMP
                  set fcd_id = null,
                      fcp_id = v_fcp_id
               where fcd_id = v_fcd_id_factura;

               delete from FacturaCompraDeuda where fc_id = v_fc_id_factura and fcd_id = v_fcd_id_factura;

               v_fcd_id_factura := null;

            else

               v_fcp_id_factura := null;

            end if;

         end if;

   /*
   ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
   //                                                                                                               //
   //                                        nota de credito                                                        //
   //                                                                                                               //
   ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
   */
         -- si tengo una factura
         --
         if v_fcd_id_notacredito is not null then

            -- obtengo el monto de la deuda
            --
            select fcd_pendiente
              into v_fcd_pendiente
            from FacturaCompraDeuda
            where fcd_id = v_fcd_id_notacredito;

            -- si el pago no cancela el pendiente
            --
            if v_fcd_pendiente - v_fcnc_importe >= 0.01 then

               -- no hay pago
               --
               v_fcp_id := null;

            -- si el pago cancela la deuda cargo un nuevo pago
            -- y luego voy a borrar la deuda
            --
            else

               v_pago := 0;

               select fcd_fecha,
                      fcd_importe
                 into v_fcd_fecha,
                      v_pago
               from FacturaCompraDeuda
               where fcd_id = v_fcd_id_notacredito;

               select sp_dbGetNewId('FacturaCompraPago', 'fcp_id') into v_fcp_id;

               insert into FacturaCompraPago
                      ( fcp_id, fcp_fecha, fcp_importe, fc_id )
               values ( v_fcp_id, v_fcd_fecha, v_pago, v_fc_id_notacredito );

               v_fcp_id_notacredito := v_fcp_id;

            end if;

            -- si hay pago borro la/s deudas
            --
            if coalesce(v_fcp_id, 0) <> 0 then

               -- actualizo la tabla de vinculacion para que apunte al pago
               --
               update FacturaCompraOrdenPago
                  set fcd_id = null,
                      fcp_id = v_fcp_id
               where fcd_id = v_fcd_id_notacredito;

               -- actualizo la tabla de vinculacion para que apunte a la deuda
               --
               update FacturaCompraNotaCredito
                  set fcd_id_notacredito = null,
                      fcp_id_notacredito = v_fcp_id
               where fcd_id_notacredito = v_fcd_id_notacredito;

               -- actualizo la temporal para que apunte a la deuda
               --
               update FacturaCompraNotaCreditoTMP
                  set fcd_id_notacredito = null,
                      fcp_id_notacredito = v_fcp_id
               where fcd_id_notacredito = v_fcd_id_notacredito;

               delete from FacturaCompraDeuda where fc_id = v_fc_id_notacredito and fcd_id = v_fcd_id_notacredito;

               v_fcd_id_notacredito := null;

            else

               v_fcp_id_notacredito := null;

            end if;

         end if;

   /*
   ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
   //                                                                                                               //
   //                                        vinculacion                                                            //
   //                                                                                                               //
   ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
   */
         select sp_dbGetNewId('FacturaCompraNotaCredito', 'fcnc_id') into v_fcnc_id;

         insert into FacturaCompraNotaCredito
                ( fcnc_id, fcnc_importe, fcd_id_factura, fcd_id_notacredito, fcp_id_factura, fcp_id_notacredito, fc_id_factura, fc_id_notacredito )
         values ( v_fcnc_id, v_fcnc_importe, v_fcd_id_factura, v_fcd_id_notacredito, v_fcp_id_factura, v_fcp_id_notacredito, v_fc_id_factura, v_fc_id_notacredito );

         -- si no hay un pago actualizo la deuda
         --
         if coalesce(v_fcp_id_factura, 0) = 0 then

            update FacturaCompraDeuda
               set fcd_pendiente = fcd_pendiente - v_fcnc_importe
            where fcd_id = v_fcd_id_factura;

         end if;

         -- si no hay un pago actualizo la deuda
         --
         if coalesce(v_fcp_id_notacredito, 0) = 0 then

            update FacturaCompraDeuda
               set fcd_pendiente = fcd_pendiente - v_fcnc_importe
            where fcd_id = v_fcd_id_notacredito;

         end if;

   end loop;

   /* nota de credito*/
   if v_doct_id = 8 then

      v_c_fcncaplic := 'select fc_id from tt_FacturaCompraNotaCredito
                        union
                        select fc_id_factura from FacturaCompraNotaCredito where fc_id_notacredito = $1';

   else

      v_c_fcncaplic := 'select fc_id from tt_FacturaCompraNotaCredito
                        union
                        select fc_id_notacredito from FacturaCompraNotaCredito where fc_id_factura = $1';

   end if;


   for v_fc_id_aplic in
      execute v_c_fcncaplic using v_fc_id
   loop

      -- actualizo la deuda de la factura
      --
      perform sp_doc_factura_compra_set_pendiente(v_fc_id_aplic);

      perform sp_doc_factura_compra_set_credito(v_fc_id_aplic);

      perform sp_doc_factura_compra_set_estado(v_fc_id_aplic);

      --/////////////////////////////////////////////////////////////////////////////////////////////////
      --
      -- validaciones
      --

      -- vtos
      --
      select * from sp_auditoria_vto_check_doc_fc(v_fc_id_aplic) into v_success, v_error_msg;
      if coalesce(v_success, 0) = 0 then
         raise exception '%', v_error_msg;
      end if;


      -- credito
      --
      select * from sp_auditoria_credito_check_doc_fc(v_fc_id_aplic) into v_success, v_error_msg;
      if coalesce(v_success, 0) = 0 then
         raise exception '%', v_error_msg;
      end if;

      --
      --/////////////////////////////////////////////////////////////////////////////////////////////////

   end loop;

   -- actualizo la deuda de la factura
   --
   perform sp_doc_factura_compra_set_pendiente(v_fc_id);

/*
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
//                                        temporales                                                                  //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
*/
   delete from FacturaCompraNotaCreditoTMP where fcTMP_id = p_fcTMP_id;
   delete from FacturaCompraTMP where fcTMP_id = p_fcTMP_id;

   return;

exception
   when others then

     raise exception 'Ha ocurrido un error al grabar la aplicación de la factura de compra. sp_doc_factura_compra_nota_credito_save_aplic. %. %.',
                      sqlstate, sqlerrm;

end;
$BODY$
  language plpgsql volatile
  cost 100;
alter function sp_doc_factura_compra_nota_credito_save(integer, integer)
  owner to postgres;
