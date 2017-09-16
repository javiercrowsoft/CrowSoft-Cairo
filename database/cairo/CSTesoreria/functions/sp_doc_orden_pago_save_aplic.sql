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
-- Function: sp_doc_orden_pago_save_aplic()

-- drop function sp_doc_orden_pago_save_aplic(integer, integer, integer);

create or replace function sp_doc_orden_pago_save_aplic
(
  in p_us_id integer,
  in p_opgTMP_id integer,
  in p_delete integer default 1,
  out p_opg_id integer
)
  returns integer as
$BODY$
declare
   v_success integer;
   v_sys_error varchar := '';
   v_error_msg varchar(5000);
   v_fcopg_id integer;
   v_fcopg_importe decimal(18,6);
   v_fcopg_importeOrigen decimal(18,6);
   v_fcopg_cotizacion decimal(18,6);
   v_fcd_pendiente decimal(18,6);
   v_fcd_importe decimal(18,6);
   v_fcd_id integer;
   v_fcp_id integer;
   v_fc_id integer;
   v_pago decimal(18,6);
   v_aplic decimal(18,6);
   v_fcp_fecha date;
   v_fcd_fecha date;
   v_fcd_fecha2 date;
   v_opg_id integer;
   v_modifico integer;
   v_bSuccess smallint;
   v_orden smallint;
   v_opgi_id integer;
   v_opgi_orden smallint;
   v_opgi_importe decimal(18,6);
   v_opgi_importeorigen decimal(18,6);
   v_aplicOrigen decimal(18,6);
   v_total decimal(18,6);
   v_cotiz decimal(18,6);
   v_cue_id integer;
   v_cue_id_anticipo integer;
   v_mon_id integer;
   v_mon_default integer;
   v_opgiTCtaCte smallint;
   v_cue_acreedoresXCpra integer;
   v_error smallint;

   v_c_pagos varchar(4000);
   v_c_aplic varchar(4000);

begin

   select opg_id,
          modifico
     into v_opg_id,
          v_modifico
   from OrdenPagoTMP
   where opgTMP_id = p_opgTMP_id;

   ---------------------------------
   -- si no hay cobranza no hago nada
   --
   if v_opg_id is null then
      return;
   end if;

/*
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
//                                        validaciones a la aplicacion                                                //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
*/

   delete from FacturaCompraOrdenPagoTMP
   where opgTMP_id = p_opgTMP_id
     and fcd_id is null
     and fcp_id is null;

/*
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
//                                        aplicacion-previa                                                           //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
*/

/*
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
//                                        actualizo la deuda                                                          //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
*/

   create temporary table tt_FacturasCpra (fc_id integer not null) on commit drop;

   -- sumo a la deuda pendiente de las facturas aplicadas a esta OrdenPago
   -- los importe cancelados por la misma
   --
   if p_delete = 0 then -- (este if esta varias veces por que se dio prioridad a la legibilidad del codigo)

      -- inserto en #FacturasCpra solo las facturas mencionadas en la TMP
      --
      insert into tt_FacturasCpra
        ( fc_id )
        ( select distinct fc_id
          from FacturaCompraOrdenPagoTMP
          where opg_id = v_opg_id );

   else
      -- inserto en #FacturasCpra todas las facturas vinculadas con esta OrdenPago
      --
      insert into tt_FacturasCpra
        ( fc_id )
        ( select distinct fc_id
          from FacturaCompraOrdenPago
             where opg_id = v_opg_id );

   end if;

   SET TRANSACTION READ WRITE;

   -- tengo que eliminar la aplicacion anterior si es que existe
   --
   if exists ( select fcopg_id
               from FacturaCompraOrdenPago
               where opg_id = v_opg_id ) then
   /*
   ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
   //                                                                                                               //
   //                                        pagos                                                                  //
   //                                                                                                               //
   ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
   */
      -- tengo que convertir los pagos en deuda
      --
      -- el cursor tiene dos formas:
      --                             1- si se trata de una aplicacion desde factura de compra
      --                                solo se cargan las vinculaciones que estan en la tabla
      --                                temporal ya que una factura no modifica toda la aplicacion
      --                                de una orden de pago.
      --
      --               2- si se trata de una aplicacion desde ordenes de pago
      --                                se carga toda la aplicacion de la orden de pago en cuestion
      --
      if p_delete = 0 then

         v_c_pagos := 'select fcp.fc_id,
                              fcp.fcp_id,
                              fcp.fcp_fecha,
                              fcp.fcp_importe,
                              sum(fco.fcopg_importe)
                        from FacturaCompraOrdenPago fco
                        join FacturaCompraPago fcp
                          on fco.fcp_id = fcp.fcp_id
                        join FacturaCompraOrdenPagoTMP fcot
                          on fco.fcopg_id = fcot.fcopg_id
                        where fcot.opgTMP_id = p_opgTMP_id
                        group by fcp.fc_id,fcp.fcp_id,fcp.fcp_fecha,fcp.fcp_importe';

      -- sumo todas las aplicaciones de esta
      -- OrdenPago sobre el pago para obtener
      -- el pendiente de la deuda
      --
      else

         v_c_pagos := 'select fcp.fc_id,
                              fcp.fcp_id,
                              fcp.fcp_fecha,
                              fcp.fcp_importe,
                              sum(fco.fcopg_importe)
                       from FacturaCompraOrdenPago fco
                       join FacturaCompraPago fcp
                         on fco.fcp_id = fcp.fcp_id
                       where fco.opg_id = v_opg_id
                       group by fcp.fc_id,fcp.fcp_id,fcp.fcp_fecha,fcp.fcp_importe';
      end if;

      -- sumo todas las aplicaciones de esta
      -- OrdenPago sobre el pago para obtener
      -- el pendiente de la deuda
      --
      for v_fc_id,v_fcp_id,v_fcp_fecha,v_fcd_importe,v_fcd_pendiente in
         execute v_c_pagos
      loop
         -- creo la deuda
         --
         select sp_dbGetNewId('FacturaCompraDeuda', 'fcd_id') into v_fcd_id;

         select sp_doc_get_fecha2(v_fcp_fecha, 0, null) into v_fcd_fecha2;

         insert into FacturaCompraDeuda
           ( fcd_id, fcd_fecha, fcd_fecha2, fcd_importe, fcd_pendiente, fc_id )
           values ( v_fcd_id, v_fcp_fecha, v_fcd_fecha2, v_fcd_importe, v_fcd_pendiente, v_fc_id );

         -- ahora que converti el pago en deuda borro las
         -- aplicaciones asociadas a este pago
         --
         if p_delete = 0 then
            delete from FacturaCompraOrdenPago
            where fcopg_id in ( select fcopg_id
                                from FacturaCompraOrdenPagoTMP
                                where opgTMP_id = p_opgTMP_id )
              and fcp_id = v_fcp_id;

            -- borro la aplicacion
            --
            delete from FacturaCompraOrdenPago
            where fcp_id is null
              and fcd_id is null
              and fc_id in ( select fc_id
                             from FacturaCompraOrdenPagoTMP
                             where opgTMP_id = p_opgTMP_id );
         else
            -- borro todas las aplicaciones que apuntaban al pago
            --
            delete from FacturaCompraOrdenPago
            where fcp_id = v_fcp_id
              and opg_id = v_opg_id;

         end if;

         -- actualizo todas las aplicaciones que no han sido modificadas por esta
         -- aplicacion y que apuntaban al pago para que apunten a la deuda
         --
         update FacturaCompraOrdenPago
            set fcd_id = v_fcd_id,
                fcp_id = null
         where fcp_id = v_fcp_id;

         -- actualizo las aplicaciones entre facturas y notas de credito
         --
         update FacturaCompraNotaCredito
            set fcd_id_factura = v_fcd_id,
                fcp_id_factura = null
         where fcp_id_factura = v_fcp_id;

         -- actualizo la nueva aplicacion para que pase de la deuda al pago
         --
         update FacturaCompraOrdenPagoTMP
            set fcd_id = v_fcd_id
         where fcp_id = v_fcp_id;

         -- borro el pago que acabo de convertir en deuda
         --
         delete from FacturaCompraPago where fcp_id = v_fcp_id;

      end loop;

   /*
   ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
   //                                                                                                               //
   //                                        actualizo la deuda                                                     //
   //                                                                                                               //
   ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
   */
      -- sumo a la deuda pendiente de las facturas aplicadas a esta OrdenPago
      -- los importe cancelados por la misma
      --
      -- el cursor tiene dos formas:
      --                             1- si se trata de una aplicacion desde factura de compra
      --                                solo se cargan las vinculaciones que estan en la tabla
      --                                temporal ya que una factura no modifica toda la aplicacion
      --                                de una OrdenPago.
      --
      --                             2- si se trata de una aplicacion desde OrdenPagos
      --                                se carga toda la aplicacion de la OrdenPago en cuestion
      --
      if p_delete = 0 then

         v_c_aplic := 'select fco.fcopg_id,
                              fco.fcd_id,
                              fco.fcopg_importe
                       from FacturaCompraOrdenPago fco
                       join FacturaCompraOrdenPagoTMP fcot
                         on fco.fcopg_id = fcot.fcopg_id
                       where fco.fcd_id is not null
                         and fcot.opgTMP_id = p_opgTMP_id';


      else

         v_c_aplic := 'select fcopg_id,
                              fcd_id,
                              fcopg_importe
                       from FacturaCompraOrdenPago
                       where fcd_id is not null
                         and opg_id = v_opg_id';

      end if;


      for v_fcopg_id,v_fcd_id,v_fcopg_importe in
         execute v_c_aplic
      loop

         -- incremento la deuda
         --
         update FacturaCompraDeuda set fcd_pendiente = fcd_pendiente + v_fcopg_importe where fcd_id = v_fcd_id;

         -- borro la aplicacion
         --
         delete from FacturaCompraOrdenPago where fcopg_id = v_fcopg_id;

      end loop;

   end if;

   -- borro la aplicacion de esta OrdenPago
   -- solo si se trata de una aplicacion generada por una OrdenPago
   --
   if p_delete <> 0 then

      delete from FacturaCompraOrdenPago where opg_id = v_opg_id;

   end if;

   for v_fcopg_id,v_fc_id,v_fcd_id,v_fcopg_importe,v_fcopg_importeOrigen,v_fcopg_cotizacion in
      select fcopg_id,
             fc_id,
             fcd_id,
             fcopg_importe,
             fcopg_importeOrigen,
             fcopg_cotizacion
      from FacturaCompraOrdenPagoTMP
      where opgTMP_id = p_opgTMP_id
        and fcopg_importe <> 0
   loop

      -- este es el while de pago agrupado. Abajo esta la explicacion
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

            select *
              into v_fcd_id,
                   v_fcd_pendiente
            from ( select fcd_id,
                          fcd_pendiente
                   from FacturaCompraDeuda
                   where fc_id = v_fc_id
                   order by fcd_fecha DESC ) t
              LIMIT 1;


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

            -- No hay pago
            v_fcp_id := null;

            v_aplic := v_fcopg_importe;


         -- si el pago cancela la deuda cargo un nuevo pago
         -- y luego voy a borrar la deuda
         --
         else

            -- acumulo en el pago toda la deuda para pasar de la tabla FacturaCompraDeuda a FacturaCompraPago
            --
            v_aplic := v_fcd_pendiente;

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

            select sp_dbGetNewId('FacturaCompraPago', 'fcp_id') into v_fcp_id;

            insert into FacturaCompraPago
              ( fcp_id, fcp_fecha, fcp_importe, fc_id )
              values ( v_fcp_id, v_fcd_fecha, v_pago, v_fc_id );

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

            -- actualizo la nueva aplicacion para que pase de la deuda al pago
            --
            update FacturaCompraOrdenPagoTMP
               set fcp_id = v_fcp_id
            where fcd_id = v_fcd_id;

            -- no hay mas deuda
            --
            v_fcd_id := null;

         end if;

         -- finalmente grabo la vinculacion que puede estar asociada a una deuda o a un pago
         --
         select sp_dbGetNewId('FacturaCompraOrdenPago', 'fcopg_id') into v_fcopg_id;

         insert into FacturaCompraOrdenPago
                ( fcopg_id, fcopg_importe, fcopg_importeOrigen, fcopg_cotizacion, fc_id, fcd_id, fcp_id, opg_id )
         values ( v_fcopg_id, v_aplic, v_fcopg_importeOrigen, v_fcopg_cotizacion, v_fc_id,
                  v_fcd_id, --> uno de estos dos es null
                  v_fcp_id, -->  "       "        "
                  v_opg_id );

         -- si no hay un pago actualizo la deuda decrementandola
         --
         if coalesce(v_fcp_id, 0) = 0 then

            update FacturaCompraDeuda
               set fcd_pendiente = fcd_pendiente - v_aplic
            where fcd_id = v_fcd_id;

         end if;

         -- voy restando al pago el importe aplicado
         --
         v_fcopg_importe := v_fcopg_importe - v_aplic;

      end loop;

   end loop;

   -- si es una vinculacion por OrdenPago puede haber nuevas facturas
   --
   if p_delete <> 0 then

      -- completo la tabla de facturas con las nuevas aplicaciones
      --
      insert into tt_FacturasCpra
        ( fc_id )
        ( select distinct fc_id
          from FacturaCompraOrdenPagoTMP
          where opgTMP_id = p_opgTMP_id );

   end if;

   for v_fc_id in
      select distinct fc_id from tt_FacturasCpra
   loop

      -- actualizo la deuda de la factura
      --
      perform sp_doc_factura_compra_set_pendiente(v_fc_id);

      perform sp_doc_factura_compra_set_credito(v_fc_id);

      -- estado
      --
      perform sp_doc_factura_compra_set_estado(v_fc_id);

      --/////////////////////////////////////////////////////////////////////////////////////////////////
      --
      -- validaciones
      --
      --/////////////////////////////////////////////////////////////////////////////////////////////////

      -- estado
      --
      select * from sp_auditoria_estado_check_doc_fc(v_fc_id) into v_success, v_error_msg;
      if coalesce(v_success, 0) = 0 then
         raise exception '%', v_error_msg;
      end if;

      -- vtos
      --
      select * from sp_auditoria_vto_check_doc_fc(v_fc_id) into v_success, v_error_msg;
      if coalesce(v_success, 0) = 0 then
         raise exception '%', v_error_msg;
      end if;

      -- credito
      --
      select * from sp_auditoria_credito_check_doc_fc(v_fc_id) into v_success, v_error_msg;
      if coalesce(v_success, 0) = 0 then
         raise exception '%', v_error_msg;
      end if;

      --
      --/////////////////////////////////////////////////////////////////////////////////////////////////

   end loop;

   -- ahora el pendiente de la OrdenPago
   --
   perform sp_doc_orden_pago_set_pendiente(v_opg_id);

   -- estado
   --
   perform sp_doc_orden_pago_set_credito(v_opg_id);
   perform sp_doc_orden_pago_set_estado(v_opg_id);

   v_opgiTCtaCte := 5;

   -- guardo un id de cuenta para anticipos.
   -- esto funciona asi: si despues de aplicar queda plata pendiente
   --                    la asigno a la cuenta anticipo
   select cue_id
     into v_cue_id_anticipo
   from OrdenPagoItem
   where opg_id = v_opg_id
     and opgi_tipo = v_opgiTCtaCte
     and opgi_orden = ( select min(opgi_orden)
                        from OrdenPagoItem
                        where opg_id = v_opg_id
                          and opgi_tipo = v_opgiTCtaCte );

   -- borro la info de cuenta corriente para esta OrdenPago
   --
   delete from OrdenPagoItem
   where opg_id = v_opg_id
     and opgi_tipo = v_opgiTCtaCte;

   v_cue_acreedoresXCpra := 8;
   v_opgi_orden := 0;
   v_aplic := 0;

   for v_cue_id,v_opgi_importe,v_opgi_importeorigen in
      select c.cue_id,
             sum(fcopg.fcopg_importe),
             sum(fcopg.fcopg_importeOrigen)
      from FacturaCompraOrdenPago fcopg
      join FacturaCompra fc
        on fcopg.fc_id = fc.fc_id
      join AsientoItem asi
        on asi.as_id = fc.as_id
      join Cuenta c
        on asi.cue_id = c.cue_id
      where fcopg.opg_id = v_opg_id
        and asi.asi_haber <> 0
        and c.cuec_id = v_cue_acreedoresXCpra
      group by c.cue_id
   loop

      v_opgi_orden := v_opgi_orden + 1;

      -- creo un nuevo registro de OrdenPagoItem
      --
      select sp_dbGetNewId('OrdenPagoItem', 'opgi_id') into v_opgi_id;

      insert into OrdenPagoItem
             ( opg_id, opgi_id, opgi_orden, opgi_importe, opgi_importeorigen, opgi_tipo, cue_id )
      values ( v_opg_id, v_opgi_id, v_opgi_orden, v_opgi_importe, v_opgi_importeorigen, v_opgiTCtaCte, v_cue_id );

      v_aplic := v_aplic + v_opgi_importe;

   end loop;

   select opg_total,
          opg_cotizacion
     into v_total,
          v_cotiz
   from OrdenPago
   where opg_id = v_opg_id;

   v_total := coalesce(v_total, 0);
   v_aplic := coalesce(v_aplic, 0);
   v_cotiz := coalesce(v_cotiz, 0);

   if v_aplic < v_total then

      v_aplic := v_total - v_aplic;

      select mon_id
        into v_mon_id
      from Cuenta
      where cue_id = v_cue_id_anticipo;

      if exists ( select * from Moneda where mon_id = v_mon_id and mon_legal <> 0 ) then
         v_cotiz := 0;
      end if;

      if v_cotiz > 0 then
         v_aplicOrigen := v_aplic / v_cotiz;
      else
         v_aplicOrigen := 0;
      end if;

      v_opgi_orden := v_opgi_orden + 1;

      -- creo un nuevo registro de OrdenPago item
      --
      select sp_dbGetNewId('OrdenPagoItem', 'opgi_id') into v_opgi_id;

      insert into OrdenPagoItem
             ( opg_id, opgi_id, opgi_orden, opgi_importe, opgi_importeorigen, opgi_tipo, cue_id )
      values ( v_opg_id, v_opgi_id, v_opgi_orden, v_aplic, v_aplicOrigen, v_opgiTCtaCte, v_cue_id_anticipo );

   end if;

   select * from sp_doc_orden_pago_asiento_save(v_opg_id, 0) into v_error, v_error_msg;

/*
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
//                                     historial de modificaciones                                                    //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
*/

   perform sp_historia_update(18005, v_opg_id, v_modifico, 6);

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

   return;

exception
   when others then

     raise exception 'Ha ocurrido un error al grabar la aplicación de la Orden de Pago. sp_doc_orden_pago_save_aplic. %. %.',
                      sqlstate, sqlerrm;

end;
$BODY$
  language plpgsql volatile
  cost 100;
alter function sp_doc_orden_pago_save_aplic(integer, integer, integer)
  owner to postgres;