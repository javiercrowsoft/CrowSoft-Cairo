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
   v_sys_error varchar := '';
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
   v_fcp_fecha date;
   v_fcd_fecha date;
   v_fcd_fecha2 date;
   v_bBorrarVinculacion smallint;
   v_fcd_id_factura integer;
   v_fcd_id_notacredito integer;
   v_fcp_id_factura integer;
   v_fcp_id_notacredito integer;
   v_fc_id_factura integer;
   v_fc_id_notacredito integer;
   v_fc_id_aplic integer;
   v_bSuccess smallint;
   v_c_fcncaplic varchar(4000);
begin

   v_bBorrarVinculacion := 0;

   p_success := 0;

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

   /* nota de credito */
   if v_doct_id = 8 then

      if exists ( select fcnc_id
                  from FacturaCompraNotaCredito
                  where fc_id_notacredito = v_fc_id ) then

         v_bBorrarVinculacion := 1;

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

         v_bBorrarVinculacion := 1;

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
   if coalesce(v_bBorrarVinculacion, 0) <> 0 then

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

                  -- Creo una deuda
                  sp_dbGetNewId('FacturaCompraDeuda',
                                        'fcd_id',
                                        v_fcd_id,
                                        0);

                  if v_sys_error <> '' then
                     exit CONTROL_ERROR;

                  end if;

                  sp_doc_get_fecha2(v_fcp_fecha,
                                  v_fcd_fecha2,
                                  0,
                                  null);

                  if v_sys_error <> '' then
                     exit CONTROL_ERROR;

                  end if;

                  begin
                     insert into FacturaCompraDeuda
                       ( fcd_id, fcd_fecha, fcd_fecha2, fcd_importe, fcd_pendiente, fc_id )
                       values ( v_fcd_id, v_fcp_fecha, v_fcd_fecha2, v_fcd_importe, v_fcd_pendiente, v_fc_id_factura );
                  exception
                     when others then
                        v_sys_error := sqlstate;
                  end;

                  if v_sys_error <> '' then
                     exit CONTROL_ERROR;

                  end if;

                  begin
                     -- Actualizo la tabla de vinculacion para que apunte a la deuda
                     update FacturaCompraOrdenPago
                        set fcd_id = v_fcd_id,
                            fcp_id = null
                        where fcp_id = v_fcp_id_factura;
                  exception
                     when others then
                        v_sys_error := sqlstate;
                  end;

                  if v_sys_error <> '' then
                     exit CONTROL_ERROR;

                  end if;

                  begin
                     -- Actualizo la tabla de vinculacion para que apunte a la deuda
                     update FacturaCompraNotaCredito
                        set fcd_id_factura = v_fcd_id,
                            fcp_id_factura = null
                        where fcp_id_factura = v_fcp_id_factura;
                  exception
                     when others then
                        v_sys_error := sqlstate;
                  end;

                  if v_sys_error <> '' then
                     exit CONTROL_ERROR;

                  end if;

                  begin
                     -- Actualizo la temporal para que apunte a la deuda
                     update FacturaCompraNotaCreditoTMP
                        set fcd_id_factura = v_fcd_id
                        where fcp_id_factura = v_fcp_id_factura;
                  exception
                     when others then
                        v_sys_error := sqlstate;
                  end;

                  if v_sys_error <> '' then
                     exit CONTROL_ERROR;

                  end if;

                  begin
                     -- Actualizo la temporal para que apunte a la deuda
                     update FacturaCompraOrdenPagoTMP
                        set fcp_id = null,
                            fcd_id = v_fcd_id
                        where fcp_id = v_fcp_id_factura;
                  exception
                     when others then
                        v_sys_error := sqlstate;
                  end;

                  if v_sys_error <> '' then
                     exit CONTROL_ERROR;

                  end if;

                  begin
                     -- Borro el pago
                     delete FacturaCompraPago

                        where fcp_id = v_fcp_id_factura;
                  exception
                     when others then
                        v_sys_error := sqlstate;
                  end;

                  if v_sys_error <> '' then
                     exit CONTROL_ERROR;

                  end if;

               end;
               end if;

            end;
            end if;

            if v_fcp_id_notacredito is not null then
            declare
               v_temp numeric(1,0); := 0;
            begin
               begin
                  select 1 into v_temp
                    from DUAL
                   where exists ( select fcp_id
                                  from FacturaCompraPago
                                     where fcp_id = v_fcp_id_notacredito );
               exception
                  when others then
                     null;
               end;

               if v_temp = 1 then
               begin
                  select fc_id,
                         fcp_importe,
                         fcp_fecha
                    into v_fc_id_notacredito,
                         v_fcd_importe,
                         v_fcp_fecha
                    from FacturaCompraPago
                     where fcp_id = v_fcp_id_notacredito;

                  begin
                     select coalesce(sum(fcnc_importe), 0)
                       into v_fcd_pendiente
                     from FacturaCompraNotaCredito fcnc
                     where fcp_id_notacredito = v_fcp_id_notacredito
                      and exists ( select *
                                   from FacturaCompraNotaCreditoTMP fcnctmp
                                   where fcTMP_id = p_fcTMP_id
                                     and ( fcnctmp.fcd_id_factura = fcnc.fcd_id_factura
                                       or fcnctmp.fcp_id_factura = fcnc.fcp_id_factura ) );
                  exception
                     when others then
                        v_sys_error := sqlstate;
                  end;

                  -- Creo una deuda
                  sp_dbGetNewId('FacturaCompraDeuda',
                                        'fcd_id',
                                        v_fcd_id,
                                        0);

                  if v_sys_error <> '' then
                     exit CONTROL_ERROR;

                  end if;

                  sp_doc_get_fecha2(v_fcp_fecha,
                                  v_fcd_fecha2,
                                  0,
                                  null);

                  if v_sys_error <> '' then
                     exit CONTROL_ERROR;

                  end if;

                  begin
                     insert into FacturaCompraDeuda
                       ( fcd_id, fcd_fecha, fcd_fecha2, fcd_importe, fcd_pendiente, fc_id )
                       values ( v_fcd_id, v_fcp_fecha, v_fcd_fecha2, v_fcd_importe, v_fcd_pendiente, v_fc_id_notacredito );
                  exception
                     when others then
                        v_sys_error := sqlstate;
                  end;

                  if v_sys_error <> '' then
                     exit CONTROL_ERROR;

                  end if;

                  begin
                     -- Actualizo la tabla de vinculacion para que apunte a la deuda
                     update FacturaCompraOrdenPago
                        set fcd_id = v_fcd_id,
                            fcp_id = null
                        where fcp_id = v_fcp_id_notacredito;
                  exception
                     when others then
                        v_sys_error := sqlstate;
                  end;

                  if v_sys_error <> '' then
                     exit CONTROL_ERROR;

                  end if;

                  begin
                     -- Actualizo la tabla de vinculacion para que apunte a la deuda
                     update FacturaCompraNotaCredito
                        set fcd_id_notacredito = v_fcd_id,
                            fcp_id_notacredito = null
                        where fcp_id_notacredito = v_fcp_id_notacredito;
                  exception
                     when others then
                        v_sys_error := sqlstate;
                  end;

                  if v_sys_error <> '' then
                     exit CONTROL_ERROR;

                  end if;

                  begin
                     -- Actualizo la temporal para que apunte a la deuda
                     update FacturaCompraNotaCreditoTMP
                        set fcd_id_notacredito = v_fcd_id
                        where fcp_id_notacredito = v_fcp_id_notacredito;
                  exception
                     when others then
                        v_sys_error := sqlstate;
                  end;

                  if v_sys_error <> '' then
                     exit CONTROL_ERROR;

                  end if;

                  begin
                     -- Borro el pago
                     delete FacturaCompraPago

                        where fcp_id = v_fcp_id_notacredito;
                  exception
                     when others then
                        v_sys_error := sqlstate;
                  end;

                  if v_sys_error <> '' then
                     exit CONTROL_ERROR;

                  end if;

               end;
               end if;

            end;
            end if;

            begin
               delete FacturaCompraNotaCredito

                  where fcnc_id = v_fcnc_id;
            exception
               when others then
                  v_sys_error := sqlstate;
            end;

            if v_sys_error <> '' then
               exit CONTROL_ERROR;

            end if;

      end loop;


      begin
         delete FacturaCompraNotaCredito

            where ( fc_id_notacredito = v_fc_id
                    and v_doct_id = 8 )/* nota de credito*/
                    or ( fc_id_factura = v_fc_id
                    and v_doct_id <> 8 );/* nota de debito y Factura*/
      exception
         when others then
            v_sys_error := sqlstate;
      end;

      if v_sys_error <> '' then
         exit CONTROL_ERROR;

      end if;

   end;
   end if;

   open c_deuda;

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
		//                                        FACTURA                                                                //
		//                                                                                                               //
		///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		*/
         -- Si tengo una factura
         if v_fcd_id_factura is not null then
         begin
            -- Obtengo el monto de la deuda
            select fcd_pendiente
              into v_fcd_pendiente
              from FacturaCompraDeuda
               where fcd_id = v_fcd_id_factura;

            -- Si el pago no cancela el pendiente
            if v_fcd_pendiente - v_fcnc_importe >= 0.01 then
            begin
               -- No hay pago
               v_fcp_id := null;

            end;
            -- Si el pago cancela la deuda cargo un nuevo pago
            -- y luego voy a borrar la deuda
            else
            begin
               -- Acumulo en el pago toda la deuda para pasar de la tabla FacturaCompraDeuda a FacturaCompraPago
               --
               v_pago := 0;

               begin
                  select fcd_fecha,
                         fcd_importe
                    into v_fcd_fecha,
                         v_pago
                    from FacturaCompraDeuda
                     where fcd_id = v_fcd_id_factura;
               exception
                  when others then
                     v_sys_error := sqlstate;
               end;

               sp_dbGetNewId('FacturaCompraPago',
                             'fcp_id',
                             v_fcp_id,
                             0);

               if v_sys_error <> '' then
                  exit CONTROL_ERROR;

               end if;

               begin
                  insert into FacturaCompraPago
                    ( fcp_id, fcp_fecha, fcp_importe, fc_id )
                    values ( v_fcp_id, v_fcd_fecha, v_pago, v_fc_id_factura );
               exception
                  when others then
                     v_sys_error := sqlstate;
               end;

               if v_sys_error <> '' then
                  exit CONTROL_ERROR;

               end if;

               v_fcp_id_factura := v_fcp_id;

            end;
            end if;

            -- Si hay pago borro la/s deudas
            if coalesce(v_fcp_id, 0) <> 0 then
            begin
               begin
                  -- Actualizo la tabla de vinculacion para que apunte al pago
                  update FacturaCompraOrdenPago
                     set fcd_id = null,
                         fcp_id = v_fcp_id
                     where fcd_id = v_fcd_id_factura;
               exception
                  when others then
                     v_sys_error := sqlstate;
               end;

               if v_sys_error <> '' then
                  exit CONTROL_ERROR;

               end if;

               begin
                  -- Actualizo la tabla de vinculacion para que apunte a la deuda
                  update FacturaCompraNotaCredito
                     set fcd_id_factura = null,
                         fcp_id_factura = v_fcp_id
                     where fcd_id_factura = v_fcd_id_factura;
               exception
                  when others then
                     v_sys_error := sqlstate;
               end;

               if v_sys_error <> '' then
                  exit CONTROL_ERROR;

               end if;

               begin
                  -- Actualizo la temporal para que apunte a la deuda
                  update FacturaCompraNotaCreditoTMP
                     set fcd_id_factura = null,
                         fcp_id_factura = v_fcp_id
                     where fcd_id_factura = v_fcd_id_factura;
               exception
                  when others then
                     v_sys_error := sqlstate;
               end;

               if v_sys_error <> '' then
                  exit CONTROL_ERROR;

               end if;

               begin
                  -- Actualizo la temporal para que apunte a la deuda
                  update FacturaCompraOrdenPagoTMP
                     set fcd_id = null,
                         fcp_id = v_fcp_id
                     where fcd_id = v_fcd_id_factura;
               exception
                  when others then
                     v_sys_error := sqlstate;
               end;

               if v_sys_error <> '' then
                  exit CONTROL_ERROR;

               end if;

               begin
                  delete FacturaCompraDeuda

                     where fc_id = v_fc_id_factura
                             and fcd_id = v_fcd_id_factura;
               exception
                  when others then
                     v_sys_error := sqlstate;
               end;

               if v_sys_error <> '' then
                  exit CONTROL_ERROR;

               end if;

               v_fcd_id_factura := null;

            end;
            else
            begin
               v_fcp_id_factura := null;

            end;
            end if;

         end;
         end if;

    /*
		///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		//                                                                                                               //
		//                                        NOTA DE CREDITO                                                        //
		//                                                                                                               //
		///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		*/
         -- Si tengo una factura
         if v_fcd_id_notacredito is not null then
         begin
            -- Obtengo el monto de la deuda
            select fcd_pendiente
              into v_fcd_pendiente
              from FacturaCompraDeuda
               where fcd_id = v_fcd_id_notacredito;

            -- Si el pago no cancela el pendiente
            if v_fcd_pendiente - v_fcnc_importe >= 0.01 then
            begin
               -- No hay pago
               v_fcp_id := null;

            end;
            -- Si el pago cancela la deuda cargo un nuevo pago
            -- y luego voy a borrar la deuda
            else
            begin
               v_pago := 0;

               begin
                  select fcd_fecha,
                         fcd_importe
                    into v_fcd_fecha,
                         v_pago
                    from FacturaCompraDeuda
                     where fcd_id = v_fcd_id_notacredito;
               exception
                  when others then
                     v_sys_error := sqlstate;
               end;

               sp_dbGetNewId('FacturaCompraPago',
                             'fcp_id',
                             v_fcp_id,
                             0);

               if v_sys_error <> '' then
                  exit CONTROL_ERROR;

               end if;

               begin
                  insert into FacturaCompraPago
                    ( fcp_id, fcp_fecha, fcp_importe, fc_id )
                    values ( v_fcp_id, v_fcd_fecha, v_pago, v_fc_id_notacredito );
               exception
                  when others then
                     v_sys_error := sqlstate;
               end;

               if v_sys_error <> '' then
                  exit CONTROL_ERROR;

               end if;

               v_fcp_id_notacredito := v_fcp_id;

            end;
            end if;

            -- Si hay pago borro la/s deudas
            if coalesce(v_fcp_id, 0) <> 0 then
            begin
               begin
                  -- Actualizo la tabla de vinculacion para que apunte al pago
                  update FacturaCompraOrdenPago
                     set fcd_id = null,
                         fcp_id = v_fcp_id
                     where fcd_id = v_fcd_id_notacredito;
               exception
                  when others then
                     v_sys_error := sqlstate;
               end;

               if v_sys_error <> '' then
                  exit CONTROL_ERROR;

               end if;

               begin
                  -- Actualizo la tabla de vinculacion para que apunte a la deuda
                  update FacturaCompraNotaCredito
                     set fcd_id_notacredito = null,
                         fcp_id_notacredito = v_fcp_id
                     where fcd_id_notacredito = v_fcd_id_notacredito;
               exception
                  when others then
                     v_sys_error := sqlstate;
               end;

               if v_sys_error <> '' then
                  exit CONTROL_ERROR;

               end if;

               begin
                  -- Actualizo la temporal para que apunte a la deuda
                  update FacturaCompraNotaCreditoTMP
                     set fcd_id_notacredito = null,
                         fcp_id_notacredito = v_fcp_id
                     where fcd_id_notacredito = v_fcd_id_notacredito;
               exception
                  when others then
                     v_sys_error := sqlstate;
               end;

               if v_sys_error <> '' then
                  exit CONTROL_ERROR;

               end if;

               begin
                  delete FacturaCompraDeuda

                     where fc_id = v_fc_id_notacredito
                             and fcd_id = v_fcd_id_notacredito;
               exception
                  when others then
                     v_sys_error := sqlstate;
               end;

               if v_sys_error <> '' then
                  exit CONTROL_ERROR;

               end if;

               v_fcd_id_notacredito := null;

            end;
            else
            begin
               v_fcp_id_notacredito := null;

            end;
            end if;

         end;
         end if;

    /*
		///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		//                                                                                                               //
		//                                        VINCULACION                                                            //
		//                                                                                                               //
		///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		*/
         sp_dbGetNewId('FacturaCompraNotaCredito',
                               'fcnc_id',
                               v_fcnc_id,
                               0);

         if v_sys_error <> '' then
            exit CONTROL_ERROR;

         end if;

         begin
            insert into FacturaCompraNotaCredito
              ( fcnc_id, fcnc_importe, fcd_id_factura, fcd_id_notacredito, fcp_id_factura, fcp_id_notacredito, fc_id_factura, fc_id_notacredito )
              values ( v_fcnc_id, v_fcnc_importe, v_fcd_id_factura, v_fcd_id_notacredito, v_fcp_id_factura, v_fcp_id_notacredito, v_fc_id_factura, v_fc_id_notacredito );
         exception
            when others then
               v_sys_error := sqlstate;
         end;

         if v_sys_error <> '' then
            exit CONTROL_ERROR;

         end if;

         -- Si no hay un pago actualizo la deuda
         if coalesce(v_fcp_id_factura, 0) = 0 then
         begin
            begin
               update FacturaCompraDeuda
                  set fcd_pendiente = fcd_pendiente - v_fcnc_importe
                  where fcd_id = v_fcd_id_factura;
            exception
               when others then
                  v_sys_error := sqlstate;
            end;

            if v_sys_error <> '' then
               exit CONTROL_ERROR;

            end if;

         end;
         end if;

         -- Si no hay un pago actualizo la deuda
         if coalesce(v_fcp_id_notacredito, 0) = 0 then
         begin
            begin
               update FacturaCompraDeuda
                  set fcd_pendiente = fcd_pendiente - v_fcnc_importe
                  where fcd_id = v_fcd_id_notacredito;
            exception
               when others then
                  v_sys_error := sqlstate;
            end;

            if v_sys_error <> '' then
               exit CONTROL_ERROR;

            end if;

         end;
         end if;

   end loop;

   /* nota de credito*/
   if v_doct_id = 8 then
   begin
      v_c_fcncaplic := 'select fc_id
        from tt_FacturaCompraNotaCredito
      union
      select fc_id_factura
        from FacturaCompraNotaCredito
         where fc_id_notacredito = v_fc_id';

   end;
   else
   begin
      v_c_fcncaplic := 'select fc_id
        from tt_FacturaCompraNotaCredito
      union
      select fc_id_notacredito
        from FacturaCompraNotaCredito
         where fc_id_factura = v_fc_id';

   end;
   end if;

   open c_fcncaplic for
      v_c_fcncaplic;

   fetch c_fcncaplic into v_fc_id_aplic;

   while sqlserver_utilities.fetch_status(c_fcncaplic%found) = 0
   loop
      begin
         -- Actualizo la deuda de la factura
         sp_doc_factura_compra_set_pendiente(v_fc_id_aplic,
                                                v_bSuccess);

         -- Si fallo al guardar
         if coalesce(v_bSuccess, 0) = 0 then
            exit CONTROL_ERROR;

         end if;

         sp_doc_factura_compra_set_credito(v_fc_id_aplic);

         if v_sys_error <> '' then
            exit CONTROL_ERROR;

         end if;

         sp_doc_factura_compra_set_estado(v_fc_id_aplic,
                                      p_est_id => dummyNumber,
                                      rtn => dummyCur);

         if v_sys_error <> '' then
            exit CONTROL_ERROR;

         end if;

         --/////////////////////////////////////////////////////////////////////////////////////////////////
         -- Validaciones
         --
         -- VTOS
         sp_auditoria_vto_check_doc_fc(v_fc_id_aplic,
                                           v_bSuccess,
                                           v_error_msg);

         -- Si el documento no es valido
         if coalesce(v_bSuccess, 0) = 0 then
            exit CONTROL_ERROR;

         end if;

         -- CREDITO
         sp_auditoria_credito_check_doc_fc(v_fc_id_aplic,
                                               v_bSuccess,
                                               v_error_msg);

         -- Si el documento no es valido
         if coalesce(v_bSuccess, 0) = 0 then
            exit CONTROL_ERROR;

         end if;

         --
         --/////////////////////////////////////////////////////////////////////////////////////////////////
         fetch c_fcncaplic into v_fc_id_aplic;

      end;
   end loop;

   close c_fcncaplic;

   -- Actualizo la deuda de la factura
   sp_doc_factura_compra_set_pendiente(v_fc_id,
                                          v_bSuccess);

   -- Si fallo al guardar
   if coalesce(v_bSuccess, 0) = 0 then
      exit CONTROL_ERROR;

   end if;

   begin
/*
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                               //
//                                        TEMPORALES                                                             //
//                                                                                                               //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
*/
      delete FacturaCompraNotaCreditoTMP

         where fcTMP_id = p_fcTMP_id;
   exception
      when others then
         v_sys_error := sqlstate;
   end;

   if v_sys_error <> '' then
      exit CONTROL_ERROR;

   end if;

   begin
      delete FacturaCompraTMP

         where fcTMP_id = p_fcTMP_id;
   exception
      when others then
         v_sys_error := sqlstate;
   end;

   if v_sys_error <> '' then
      exit CONTROL_ERROR;

   end if;

   COMMIT;

   p_success := 1;

   return;

   <<CONTROL_ERROR>>

   v_error_msg := 'Ha ocurrido un error al grabar la aplicación de la factura de compra. sp_doc_facturaCompraSaveAplic. ' || coalesce(v_error_msg, '');

   raise exception ( -20002, v_error_msg );

   if v_transcount > 0 then
   begin
      ROLLBACK;
       v_transcount :=  v_transcount - 1;

   end;
   end if;

exception
   when others then

     raise exception 'Ha ocurrido un error al grabar la aplicación de la factura de Compra. sp_doc_factura_compra_nota_credito_save. %. %.',
                      sqlstate, sqlerrm;

end;
$BODY$
  language plpgsql volatile
  cost 100;
alter function sp_doc_factura_compra_nota_credito_save(integer, integer)
  owner to postgres;
