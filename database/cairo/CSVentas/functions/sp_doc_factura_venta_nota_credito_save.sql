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
-- Function: sp_doc_factura_venta_nota_credito_save()

-- drop function sp_doc_factura_venta_nota_credito_save(integer, integer);

-- to debug: raise notice 'fvd_id %, %', v_fvd_id_factura::varchar, v_fvd_fecha;

create or replace function sp_doc_factura_venta_nota_credito_save
(
  in p_us_id integer,
  in p_fvTMP_id integer
)
  returns void as
$BODY$
declare
   v_success integer;
   v_error_msg varchar(5000);
   v_fvnc_id integer;
   v_fvnc_importe decimal(18,6);
   v_fvd_pendiente decimal(18,6);
   v_fvd_importe decimal(18,6);
   v_pago decimal(18,6);
   v_fvd_id integer;
   v_fvp_id integer;
   v_doct_id integer;
   v_fv_id integer;
   v_fvp_fecha date;
   v_fvd_fecha date;
   v_fvd_fecha2 date;
   v_borrar_vinculacion smallint;
   v_fvd_id_factura integer;
   v_fvd_id_notacredito integer;
   v_fvp_id_factura integer;
   v_fvp_id_notacredito integer;
   v_fv_id_factura integer;
   v_fv_id_notacredito integer;
   v_fv_id_aplic integer;
   v_c_fvncaplic varchar(4000);
begin

   v_borrar_vinculacion := 0;

   select fv_id
     into v_fv_id
   from FacturaVentaTMP
   where fvTMP_id = p_fvTMP_id;

   select d.doct_id
     into v_doct_id
   from FacturaVentaTMP tmp
   join Documento d
     on tmp.doc_id = d.doc_id
   where tmp.doc_id = d.doc_id
     and tmp.fvTMP_id = p_fvTMP_id;

/*
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
//                                        aplicacion-previa                                                           //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
*/

    create temporary table tt_FacturaVentaNotaCredito(fv_id integer) on commit drop;

   /* nota de credito */
   if v_doct_id = 7 then

      if exists ( select fvnc_id
                  from FacturaVentaNotaCredito
                  where fv_id_notacredito = v_fv_id ) then

         v_borrar_vinculacion := 1;

         insert into tt_FacturaVentaNotaCredito
           ( fv_id )
           ( select distinct fv_id_factura
             from FacturaVentaNotaCredito fvnc
                where fv_id_notacredito = v_fv_id
                  and not exists ( select *
                                   from FacturaVentaNotaCreditoTMP
                                   where fvTMP_id = p_fvTMP_id
                                     and fvnc_importe <> 0
                                     and fv_id_factura = fvnc.fv_id_factura ) );

      end if;

   else

      /*Nota de debito y Factura*/
      if exists ( select fvnc_id
                  from FacturaVentaNotaCredito
                  where fv_id_factura = v_fv_id ) then

         v_borrar_vinculacion := 1;

         insert into tt_FacturaVentaNotaCredito
           ( fv_id )
           ( select distinct fv_id_notacredito
             from FacturaVentaNotaCredito fvnc
             where fv_id_factura = v_fv_id
               and not exists ( select *
                                from FacturaVentaNotaCreditoTMP
                                where fvTMP_id = p_fvTMP_id
                                  and fvnc_importe <> 0
                                  and fv_id_notacredito = fvnc.fv_id_notacredito ) );
      end if;

   end if;

   SET TRANSACTION READ WRITE;

   -- tengo que eliminar la aplicacion anterior si es que existe
   --
   if coalesce(v_borrar_vinculacion, 0) <> 0 then

      /* nota de credito *//* nota de debito y factura *//* nota de credito *//* nota de debito y factura */

      for v_fvnc_id,v_fvd_id_notacredito,v_fvd_id_factura,v_fvp_id_notacredito,v_fvp_id_factura,v_fvnc_importe in
          select fvnc_id,
                 fvd_id_notacredito,
                 fvd_id_factura,
                 fvp_id_notacredito,
                 fvp_id_factura,
                 fvnc_importe
          from FacturaVentaNotaCredito
          where ( ( fvd_id_notacredito is not null ) and ( fv_id_notacredito = v_fv_id and v_doct_id = 7 ) )
            or ( ( fvd_id_factura is not null ) and ( fv_id_factura = v_fv_id and v_doct_id <> 7 ) )
            or ( ( fvp_id_notacredito is not null ) and ( fv_id_notacredito = v_fv_id and v_doct_id = 7 ) )
            or ( ( fvp_id_factura is not null ) and ( fv_id_factura = v_fv_id and v_doct_id <> 7 ) )
      loop

         -- actualizo la deuda de la factura
         --
         if v_fvd_id_factura is not null then

            update FacturaVentaDeuda
               set fvd_pendiente = fvd_pendiente + v_fvnc_importe
            where fvd_id = v_fvd_id_factura;

         end if;

         -- actualizo la deuda de la nota de credito
         --
         if v_fvd_id_notacredito is not null then

               update FacturaVentaDeuda
                  set fvd_pendiente = fvd_pendiente + v_fvnc_importe
               where fvd_id = v_fvd_id_notacredito;

         end if;

         -- si hay un pago
         --
         if v_fvp_id_factura is not null then

            if exists ( select fvp_id
                        from FacturaVentaPago
                        where fvp_id = v_fvp_id_factura ) then

               select fv_id,
                      fvp_importe,
                      fvp_fecha
                 into v_fv_id_factura,
                      v_fvd_importe,
                      v_fvp_fecha
               from FacturaVentaPago
               where fvp_id = v_fvp_id_factura;

               select coalesce(sum(fvnc_importe), 0)
                 into v_fvd_pendiente
               from FacturaVentaNotaCredito fvnc
               where fvp_id_factura = v_fvp_id_factura
                 and exists ( select *
                              from FacturaVentaNotaCreditoTMP fvnctmp
                              where fvTMP_id = p_fvTMP_id
                                and ( fvnctmp.fvd_id_notacredito = fvnc.fvd_id_notacredito
                                      or fvnctmp.fvp_id_notacredito = fvnc.fvp_id_notacredito ) );

               -- creo una deuda
               --
               select sp_dbGetNewId('FacturaVentaDeuda', 'fvd_id') into v_fvd_id;

               select sp_doc_get_fecha2(v_fvp_fecha, 0, null) into v_fvd_fecha2;

               insert into FacturaVentaDeuda
                      ( fvd_id, fvd_fecha, fvd_fecha2, fvd_importe, fvd_pendiente, fv_id )
               values ( v_fvd_id, v_fvp_fecha, v_fvd_fecha2, v_fvd_importe, v_fvd_pendiente, v_fv_id_factura );

               -- actualizo la tabla de vinculacion para que apunte a la deuda
               --
               update FacturaVentaCobranza
                  set fvd_id = v_fvd_id,
                      fvp_id = null
               where fvp_id = v_fvp_id_factura;

               -- actualizo la tabla de vinculacion para que apunte a la deuda
               --
               update FacturaVentaNotaCredito
                  set fvd_id_factura = v_fvd_id,
                      fvp_id_factura = null
               where fvp_id_factura = v_fvp_id_factura;

               -- actualizo la temporal para que apunte a la deuda
               --
               update FacturaVentaNotaCreditoTMP
                  set fvd_id_factura = v_fvd_id
               where fvp_id_factura = v_fvp_id_factura;

               -- actualizo la temporal para que apunte a la deuda
               --
               update FacturaVentaCobranzaTMP
                  set fvp_id = null,
                      fvd_id = v_fvd_id
               where fvp_id = v_fvp_id_factura;

               -- borro el pago
               --
               delete from FacturaVentaPago where fvp_id = v_fvp_id_factura;

            end if;

         end if;

         if v_fvp_id_notacredito is not null then

            if exists ( select fvp_id
                        from FacturaVentaPago
                        where fvp_id = v_fvp_id_notacredito ) then

               select fv_id,
                      fvp_importe,
                      fvp_fecha
                 into v_fv_id_notacredito,
                      v_fvd_importe,
                      v_fvp_fecha
               from FacturaVentaPago
               where fvp_id = v_fvp_id_notacredito;

               select coalesce(sum(fvnc_importe), 0)
                 into v_fvd_pendiente
               from FacturaVentaNotaCredito fvnc
               where fvp_id_notacredito = v_fvp_id_notacredito
                 and exists ( select *
                              from FacturaVentaNotaCreditoTMP fvnctmp
                              where fvTMP_id = p_fvTMP_id
                                and ( fvnctmp.fvd_id_factura = fvnc.fvd_id_factura
                                      or fvnctmp.fvp_id_factura = fvnc.fvp_id_factura ) );

               -- creo una deuda
               --
               select sp_dbGetNewId('FacturaVentaDeuda', 'fvd_id') into v_fvd_id;

               select sp_doc_get_fecha2(v_fvp_fecha, 0, null) into v_fvd_fecha2;

               insert into FacturaVentaDeuda
                      ( fvd_id, fvd_fecha, fvd_fecha2, fvd_importe, fvd_pendiente, fv_id )
               values ( v_fvd_id, v_fvp_fecha, v_fvd_fecha2, v_fvd_importe, v_fvd_pendiente, v_fv_id_notacredito );

               -- actualizo la tabla de vinculacion para que apunte a la deuda
               --
               update FacturaVentaCobranza
                  set fvd_id = v_fvd_id,
                      fvp_id = null
               where fvp_id = v_fvp_id_notacredito;

               -- actualizo la tabla de vinculacion para que apunte a la deuda
               --
               update FacturaVentaNotaCredito
                  set fvd_id_notacredito = v_fvd_id,
                      fvp_id_notacredito = null
               where fvp_id_notacredito = v_fvp_id_notacredito;

               -- actualizo la temporal para que apunte a la deuda
               --
               update FacturaVentaNotaCreditoTMP
                  set fvd_id_notacredito = v_fvd_id
               where fvp_id_notacredito = v_fvp_id_notacredito;

               -- borro el pago
               --
               delete from FacturaVentaPago where fvp_id = v_fvp_id_notacredito;

            end if;

         end if;

         delete from FacturaVentaNotaCredito where fvnc_id = v_fvnc_id;

      end loop;

      delete from FacturaVentaNotaCredito
      where ( fv_id_notacredito = v_fv_id and v_doct_id = 7 ) /* nota de credito*/
         or ( fv_id_factura = v_fv_id and v_doct_id <> 7 );   /* nota de debito y factura*/

   end if;

   for v_fvnc_importe,v_fv_id_factura,v_fv_id_notacredito,v_fvd_id_factura,
        v_fvd_id_notacredito,v_fvp_id_factura,v_fvp_id_notacredito in
       select fvnc_importe,
              fv_id_factura,
              fv_id_notacredito,
              fvd_id_factura,
              fvd_id_notacredito,
              fvp_id_factura,
              fvp_id_notacredito
       from FacturaVentaNotaCreditoTMP
       where fvTMP_id = p_fvTMP_id
         and fvnc_importe <> 0
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
         if v_fvd_id_factura is not null then

            -- obtengo el monto de la deuda
            --
            select fvd_pendiente
              into v_fvd_pendiente
            from FacturaVentaDeuda
            where fvd_id = v_fvd_id_factura;

            -- si el pago no cancela el pendiente
            --
            if v_fvd_pendiente - v_fvnc_importe > 0.01 then

               -- no hay pago
               v_fvp_id := null;

            -- si el pago cancela la deuda cargo un nuevo pago
            -- y luego voy a borrar la deuda
            else

               -- acumulo en el pago toda la deuda para pasar de la tabla FacturaVentaDeuda a FacturaVentaPago
               --
               v_pago := 0;


               select fvd_fecha,
                      fvd_importe
                 into v_fvd_fecha,
                      v_pago
               from FacturaVentaDeuda
               where fvd_id = v_fvd_id_factura;

               select sp_dbGetNewId('FacturaVentaPago', 'fvp_id') into  v_fvp_id;




               insert into FacturaVentaPago
                      ( fvp_id, fvp_fecha, fvp_importe, fv_id )
               values ( v_fvp_id, v_fvd_fecha, v_pago, v_fv_id_factura );

               v_fvp_id_factura := v_fvp_id;

            end if;

            -- si hay pago borro la/s deudas
            --
            if coalesce(v_fvp_id, 0) <> 0 then

               -- actualizo la tabla de vinculacion para que apunte al pago
               --
               update FacturaVentaCobranza
                  set fvd_id = null,
                      fvp_id = v_fvp_id
               where fvd_id = v_fvd_id_factura;

               -- actualizo la tabla de vinculacion para que apunte a la deuda
               --
               update FacturaVentaNotaCredito
                  set fvd_id_factura = null,
                      fvp_id_factura = v_fvp_id
               where fvd_id_factura = v_fvd_id_factura;

               -- actualizo la temporal para que apunte a la deuda
               --
               update FacturaVentaNotaCreditoTMP
                  set fvd_id_factura = null,
                      fvp_id_factura = v_fvp_id
               where fvd_id_factura = v_fvd_id_factura;

               -- actualizo la temporal para que apunte a la deuda
               --
               update FacturaVentaCobranzaTMP
                  set fvd_id = null,
                      fvp_id = v_fvp_id
               where fvd_id = v_fvd_id_factura;

               delete from FacturaVentaDeuda where fv_id = v_fv_id_factura and fvd_id = v_fvd_id_factura;

               v_fvd_id_factura := null;

            else

               v_fvp_id_factura := null;

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
         if v_fvd_id_notacredito is not null then

            -- obtengo el monto de la deuda
            --
            select fvd_pendiente
              into v_fvd_pendiente
            from FacturaVentaDeuda
            where fvd_id = v_fvd_id_notacredito;

            -- si el pago no cancela el pendiente
            --
            if v_fvd_pendiente - v_fvnc_importe > 0.01 then

               -- no hay pago
               --
               v_fvp_id := null;


            -- si el pago cancela la deuda cargo un nuevo pago
            -- y luego voy a borrar la deuda
            --
            else

               v_pago := 0;

               select fvd_fecha,
                      fvd_importe
                 into v_fvd_fecha,
                      v_pago
               from FacturaVentaDeuda
               where fvd_id = v_fvd_id_notacredito;

               select sp_dbGetNewId('FacturaVentaPago', 'fvp_id') into  v_fvp_id;

               insert into FacturaVentaPago
                      ( fvp_id, fvp_fecha, fvp_importe, fv_id )
               values ( v_fvp_id, v_fvd_fecha, v_pago, v_fv_id_notacredito );

               v_fvp_id_notacredito := v_fvp_id;

            end if;

            -- si hay pago borro la/s deudas
            --
            if coalesce(v_fvp_id, 0) <> 0 then

               -- actualizo la tabla de vinculacion para que apunte al pago
               --
               update FacturaVentaCobranza
                  set fvd_id = null,
                      fvp_id = v_fvp_id
               where fvd_id = v_fvd_id_notacredito;

               -- actualizo la tabla de vinculacion para que apunte a la deuda
               --
               update FacturaVentaNotaCredito
                  set fvd_id_notacredito = null,
                      fvp_id_notacredito = v_fvp_id
               where fvd_id_notacredito = v_fvd_id_notacredito;

               -- actualizo la temporal para que apunte a la deuda
               --
               update FacturaVentaNotaCreditoTMP
                  set fvd_id_notacredito = null,
                      fvp_id_notacredito = v_fvp_id
               where fvd_id_notacredito = v_fvd_id_notacredito;

               delete from FacturaVentaDeuda where fv_id = v_fv_id_notacredito and fvd_id = v_fvd_id_notacredito;

               v_fvd_id_notacredito := null;

            else

               v_fvp_id_notacredito := null;

            end if;

         end if;

   /*
   ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
   //                                                                                                               //
   //                                        vinculacion                                                            //
   //                                                                                                               //
   ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
   */

         select sp_dbGetNewId('FacturaVentaNotaCredito', 'fvnc_id') into v_fvnc_id;

         insert into FacturaVentaNotaCredito
                ( fvnc_id, fvnc_importe, fvd_id_factura, fvd_id_notacredito, fvp_id_factura, fvp_id_notacredito, fv_id_factura, fv_id_notacredito )
         values ( v_fvnc_id, v_fvnc_importe, v_fvd_id_factura, v_fvd_id_notacredito, v_fvp_id_factura, v_fvp_id_notacredito, v_fv_id_factura, v_fv_id_notacredito );

         -- si no hay un pago actualizo la deuda
         --
         if coalesce(v_fvp_id_factura, 0) = 0 then

            update FacturaVentaDeuda
               set fvd_pendiente = fvd_pendiente - v_fvnc_importe
            where fvd_id = v_fvd_id_factura;

         end if;

         -- si no hay un pago actualizo la deuda
         --
         if coalesce(v_fvp_id_notacredito, 0) = 0 then

            update FacturaVentaDeuda
               set fvd_pendiente = fvd_pendiente - v_fvnc_importe
            where fvd_id = v_fvd_id_notacredito;

         end if;

   end loop;

   /* nota de credito */
   if v_doct_id = 7 then

      v_c_fvncaplic := 'select fv_id from tt_FacturaVentaNotaCredito
                        union
                        select fv_id_factura from FacturaVentaNotaCredito where fv_id_notacredito = $1';

   else

      v_c_fvncaplic := 'select fv_id from tt_FacturaVentaNotaCredito
                        union
                        select fv_id_notacredito from FacturaVentaNotaCredito where fv_id_factura = $1';

   end if;

   for v_fv_id_aplic in
      execute v_c_fvncaplic using v_fv_id
   loop

         -- actualizo la deuda de la factura
         --
         perform sp_doc_factura_venta_set_pendiente(v_fv_id_aplic);

         perform sp_doc_factura_venta_set_credito(v_fv_id_aplic);

         perform sp_doc_factura_venta_set_estado(v_fv_id_aplic);

         --/////////////////////////////////////////////////////////////////////////////////////////////////
         --
         -- validaciones
         --
         
         -- vtos
         --
         select * from sp_auditoria_vto_check_doc_FV(v_fv_id_aplic) into v_success, v_error_msg;
         if coalesce(v_success, 0) = 0 then
            raise exception '%', v_error_msg;
         end if;

         -- credito
         --
         select * from sp_auditoria_credito_check_doc_FV(v_fv_id_aplic) into v_success, v_error_msg;
         if coalesce(v_success, 0) = 0 then
            raise exception '%', v_error_msg;
         end if;

         --
         --/////////////////////////////////////////////////////////////////////////////////////////////////

   end loop;

   -- actualizo la deuda de la factura
   --
   perform sp_doc_factura_venta_set_pendiente(v_fv_id);

/*
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
//                                        temporales                                                                  //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
*/
   delete from FacturaVentaNotaCreditoTMP where fvTMP_id = p_fvTMP_id;
   delete from FacturaVentaTMP where fvTMP_id = p_fvTMP_id;

   return;

exception
   when others then

     raise exception 'Ha ocurrido un error al grabar la aplicación de la factura de venta. sp_doc_factura_venta_nota_credito_save_aplic. %. %.',
                      sqlstate, sqlerrm;

end;
$BODY$
  language plpgsql volatile
  cost 100;
alter function sp_doc_factura_compra_nota_credito_save(integer, integer)
  owner to postgres;
