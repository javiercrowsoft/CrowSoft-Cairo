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
-- Function: sp_doc_cobranza_save_aplic()

-- drop function sp_doc_cobranza_save_aplic(integer, integer, integer);

create or replace function sp_doc_cobranza_save_aplic
(
  in p_us_id integer,
  in p_cobzTMP_id integer,
  in p_delete integer default 1,
  out p_cobz_id integer
)
  returns integer as
$BODY$
declare
   v_success integer;
   v_sys_error varchar := '';
   v_error_msg varchar(5000);

   v_fvcobz_id integer;
   v_fvcobz_importe decimal(18,6);
   v_fvcobz_importeOrigen decimal(18,6);
   v_fvcobz_cotizacion decimal(18,6);
   v_fvd_pendiente decimal(18,6);
   v_fvd_importe decimal(18,6);
   v_fvd_id integer;
   v_fvp_id integer;
   v_fv_id integer;
   v_pago decimal(18,6);
   v_aplic decimal(18,6);
   v_fvp_fecha timestamp with time zone;
   v_fvd_fecha timestamp with time zone;
   v_fvd_fecha2 timestamp with time zone;
   v_cobz_id integer;
   v_modifico integer;
   v_orden smallint;
   v_cobzi_id integer;
   v_cobzi_orden smallint;
   v_cobzi_importe decimal(18,6);
   v_cobzi_importeorigen decimal(18,6);
   v_aplicOrigen decimal(18,6);
   v_total decimal(18,6);
   v_cotiz decimal(18,6);
   v_cue_id integer;
   v_cue_id_anticipo integer;
   v_mon_id integer;
   v_mon_default integer;
   v_CobziTCtaCte smallint;
   v_cue_deudoresXvta integer;
   v_error smallint;

   v_c_pagos varchar(4000);
   v_c_aplic varchar(4000);
   v_id integer;
begin

   select cobz_id,
          modifico
     into v_cobz_id,
          v_modifico
   from CobranzaTMP
   where cobzTMP_id = p_cobzTMP_id;

   ---------------------------------
   -- si no hay cobranza no hago nada
   --
   if v_cobz_id is null then
      return;
   end if;

/*
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
//                                        validaciones a la aplicacion                                                //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
*/

   delete from FacturaVentaCobranzaTMP
   where cobzTMP_id = p_cobzTMP_id
     and fvd_id is null
     and fvp_id is null;

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

   create temporary table tt_FacturasVta (fv_id integer not null) on commit drop;

   -- sumo a la deuda pendiente de las facturas aplicadas a esta cobranza
   -- los importe cancelados por la misma
   --
   if p_delete = 0 then -- (este if esta varias veces por que se dio prioridad a la legibilidad del codigo)

      -- inserto en #FacturasVta solo las facturas mencionadas en la TMP
      --
      insert into tt_FacturasVta
        ( fv_id )
        ( select distinct fv_id
          from FacturaVentaCobranzaTMP
          where cobz_id = v_cobz_id );

   else
      -- inserto en #FacturasVta todas las facturas vinculadas con esta cobranza
      --
      insert into tt_FacturasVta
        ( fv_id )
        ( select distinct fv_id
          from FacturaVentaCobranza
          where cobz_id = v_cobz_id );

   end if;

   SET TRANSACTION READ WRITE;

   -- Tengo que eliminar la aplicacion anterior si es que existe
   --
   if exists ( select fvcobz_id
               from FacturaVentaCobranza
               where cobz_id = v_cobz_id ) then

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
      --                             1- si se trata de una aplicacion desde factura de venta
      --                                solo se cargan las vinculaciones que estan en la tabla
      --                                temporal ya que una factura no modifica toda la aplicacion
      --                                de una cobranza.
      --
      --														               2- si se trata de una aplicacion desde cobranzas
      --                                se carga toda la aplicacion de la cobranza en cuestion
      --
      if p_delete = 0 then

         v_c_pagos := 'select fvp.fv_id,
                              fvp.fvp_id,
                              fvp.fvp_fecha,
                              fvp.fvp_importe,
                              sum(fvc.fvcobz_importe)
                       from FacturaVentaCobranza fvc
                       join FacturaVentaPago fvp
                         on fvc.fvp_id = fvp.fvp_id
                       join FacturaVentaCobranzaTMP fvct
                         on fvc.fvcobz_id = fvct.fvcobz_id
                       where fvct.cobzTMP_id = p_cobzTMP_id
                       group by fvp.fv_id,fvp.fvp_id,fvp.fvp_fecha,fvp.fvp_importe';

      -- sumo todas las aplicaciones de esta
      -- cobranza sobre el pago para obtener
      -- el pendiente de la deuda
      --
      else

         v_c_pagos := 'select fvp.fv_id,
                              fvp.fvp_id,
                              fvp.fvp_fecha,
                              fvp.fvp_importe,
                              sum(fvc.fvcobz_importe)
                       from FacturaVentaCobranza fvc
                       join FacturaVentaPago fvp
                         on fvc.fvp_id = fvp.fvp_id
                       where fvc.cobz_id = v_cobz_id
                       group by fvp.fv_id,fvp.fvp_id,fvp.fvp_fecha,fvp.fvp_importe';
      end if;

      -- sumo todas las aplicaciones de esta
      -- cobranza sobre el pago para obtener
      -- el pendiente de la deuda
      --
      for v_fv_id,v_fvp_id,v_fvp_fecha,v_fvd_importe,v_fvd_pendiente in
         execute v_c_pagos using p_cobzTMP_id
      loop
         -- creo la deuda
         --
         select sp_dbGetNewId('FacturaVentaDeuda', 'fvd_id') into v_fvd_id;

         select sp_doc_get_fecha2(v_fvp_fecha, 0, null) into v_fvd_fecha2;

         insert into FacturaVentaDeuda
           ( fvd_id, fvd_fecha, fvd_fecha2, fvd_importe, fvd_pendiente, fv_id )
           values ( v_fvd_id, v_fvp_fecha, v_fvd_fecha2, v_fvd_importe, v_fvd_pendiente, v_fv_id );

         -- ahora que converti el pago en deuda borro las
         -- aplicaciones asociadas a este pago
         --
         if p_delete = 0 then
            delete from FacturaVentaCobranza
            where fvcobz_id in ( select fvcobz_id
                                 from FacturaVentaCobranzaTMP
                                 where cobzTMP_id = p_cobzTMP_id )
              and fvp_id = v_fvp_id;

            -- borro la aplicacion
            --
            delete from FacturaVentaCobranza
            where fvp_id is null
              and fvd_id is null
              and fv_id in ( select fv_id
                             from FacturaVentaCobranzaTMP
                             where cobzTMP_id = p_cobzTMP_id );
         else
            -- borro todas las aplicaciones que apuntaban al pago
            --
            delete from FacturaVentaCobranza
            where fvp_id = v_fvp_id
              and cobz_id = v_cobz_id;

         end if;

         -- actualizo todas las aplicaciones que no han sido modificadas por esta
         -- aplicacion y que apuntaban al pago para que apunten a la deuda
         --
         update FacturaVentaCobranza
            set fvd_id = v_fvd_id,
                fvp_id = null
         where fvp_id = v_fvp_id;

         -- actualizo las aplicaciones entre facturas y notas de credito
         --
         update FacturaVentaNotaCredito
            set fvd_id_factura = v_fvd_id,
                fvp_id_factura = null
         where fvp_id_factura = v_fvp_id;

         -- actualizo la nueva aplicacion para que pase de la deuda al pago
         --
         update FacturaVentaCobranzaTMP
            set fvd_id = v_fvd_id
         where fvp_id = v_fvp_id;

         -- borro el pago que acabo de convertir en deuda
         --
         delete from FacturaVentaPago where fvp_id = v_fvp_id;

      end loop;


   /*
   ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
   //                                                                                                               //
   //                                        actualizo la deuda                                                     //
   //                                                                                                               //
   ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
   */
      -- sumo a la deuda pendiente de las facturas aplicadas a esta cobranza
      -- los importe cancelados por la misma
      --
      -- el cursor tiene dos formas:
      --                             1- si se trata de una aplicacion desde factura de venta
      --                                solo se cargan las vinculaciones que estan en la tabla
      --                                temporal ya que una factura no modifica toda la aplicacion
      --                                de una cobranza.
      --
      --														 2- si se trata de una aplicacion desde cobranzas
      --                                se carga toda la aplicacion de la cobranza en cuestion
      --
      if p_delete = 0 then

         v_c_aplic := 'select fvc.fvcobz_id,
                              fvc.fvd_id,
                              fvc.fvcobz_importe
                       from FacturaVentaCobranza fvc
                       join FacturaVentaCobranzaTMP fvct
                         on fvc.fvcobz_id = fvct.fvcobz_id
                       where fvc.fvd_id is not null
                         and fvct.cobzTMP_id = $1';

         v_id := p_cobzTMP_id;

      else

         v_c_aplic := 'select fvcobz_id,
                              fvd_id,
                              fvcobz_importe
                       from FacturaVentaCobranza
                       where fvd_id is not null
                         and cobz_id = $1';

         v_id := v_cobz_id;

      end if;

      for v_fvcobz_id,v_fvd_id,v_fvcobz_importe in
         execute v_c_aplic using v_id
      loop
         -- incremento la deuda
         --
         update FacturaVentaDeuda set fvd_pendiente = fvd_pendiente + v_fvcobz_importe where fvd_id = v_fvd_id;

         -- borro la aplicacion
         --
         delete from FacturaVentaCobranza where fvcobz_id = v_fvcobz_id;

      end loop;

   end if;

   -- borro la aplicacion de esta cobranza
   -- solo si se trata de una aplicacion generada por una cobranza
   --
   if p_delete <> 0 then

      delete from FacturaVentaCobranza where cobz_id = v_cobz_id;

   end if;

   for v_fvcobz_id,v_fv_id,v_fvd_id,v_fvcobz_importe,v_fvcobz_importeOrigen,v_fvcobz_cotizacion in
      select fvcobz_id,
             fv_id,
             fvd_id,
             fvcobz_importe,
             fvcobz_importeOrigen,
             fvcobz_cotizacion
      from FacturaVentaCobranzaTMP
      where cobzTMP_id = p_cobzTMP_id
        and fvcobz_importe <> 0
   loop

      -- este es el while de pago agrupado. abajo esta la explicacion
      --
      while v_fvcobz_importe > 0
      loop

         -- obtengo el monto de la deuda
         --
         -- La cobranza permite cobrar sobre toda la deuda de la factura o sobre cada uno de sus vencimientos.
         -- Esto complica un poco la cosa para el programador. Si en la info de aplicacion (registro de la tabla
         -- FacturaVentaCobranzaTMP no tengo un fvd_id (id del vencimiento), es por que se efectuo la cobranza
         -- sobre toda la deuda de la factura. Esto se entiende con un ejemplo:
         --        supongamos una factura con vtos. 30, 60 y 90 dias. Tiene 3 vtos, pero el usuario decide
         --        aplicar sobre los tres agrupados un importe dado, para el ejemplo supongamos que los vtos
         --        son todos de 30 pesos o sea 90 pesos el total, y el usuario aplica 80 pesos. El sistema tiene
         --        que aplicar 30 al primer vto, 30 al segundo y 20 al tercero. Para poder hacer esto es que utiliza
         --        el while que esta arriba (while de pago agrupado).
         --
         -- observen el If, si no hay fvd_id tomo el primero con el select que ordena por fvd_fecha
         --
         if coalesce(v_fvd_id, 0) = 0 then

            select *
              into v_fvd_id,
                   v_fvd_pendiente
            from ( select fvd_id,
                          fvd_pendiente
                   from FacturaVentaDeuda
                   where fv_id = v_fv_id
                   order by fvd_fecha DESC ) t
              LIMIT 1;

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
         if v_fvd_pendiente - v_fvcobz_importe >= 0.01 then

            -- no hay pago
            --
            v_fvp_id := null;

            v_aplic := v_fvcobz_importe;

         -- si el pago cancela la deuda cargo un nuevo pago
         -- y luego voy a borrar la deuda
         --
         else

            -- acumulo en el pago toda la deuda para pasar de la tabla FacturaVentaDeuda a FacturaVentaPago
            --
            v_aplic := v_fvd_pendiente;

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

            -- actualizo la nueva aplicacion para que pase de la deuda al pago
            --
            update FacturaVentaCobranzaTMP
               set fvp_id = v_fvp_id
            where fvd_id = v_fvd_id;

            -- No hay mas deuda
            v_fvd_id := null;

         end if;

         -- finalmente grabo la vinculacion que puede estar asociada a una deuda o a un pago
         --
         select sp_dbGetNewId('FacturaVentaCobranza', 'fvcobz_id') into v_fvcobz_id;

         insert into FacturaVentaCobranza
                ( fvcobz_id, fvcobz_importe, fvcobz_importeOrigen, fvcobz_cotizacion, fv_id, fvd_id, fvp_id, cobz_id )
         values ( v_fvcobz_id, v_aplic, v_fvcobz_importeOrigen, v_fvcobz_cotizacion, v_fv_id,
                  v_fvd_id, --> uno de estos dos es null
                  v_fvp_id, -->  "       "        "
                  v_cobz_id );

         -- si no hay un pago actualizo la deuda decrementandola
         --
         if coalesce(v_fvp_id, 0) = 0 then

            update FacturaVentaDeuda
               set fvd_pendiente = fvd_pendiente - v_aplic
            where fvd_id = v_fvd_id;

         end if;

         -- voy restando al pago el importe aplicado
         --
         v_fvcobz_importe := v_fvcobz_importe - v_aplic;

      end loop;

   end loop;

   -- si es una vinculacion por cobranza puede haber nuevas facturas
   --
   if p_delete <> 0 then

      -- completo la tabla de facturas con las nuevas aplicaciones
      --
      insert into tt_FacturasVta
        ( fv_id )
        ( select distinct fv_id
          from FacturaVentaCobranzaTMP
          where cobzTMP_id = p_cobzTMP_id );

   end if;


   for v_fv_id in
      select disctinct fv_id from tt_FacturasVta
   loop

      -- actualizo la deuda de la factura
      --
      perform sp_doc_factura_venta_set_pendiente(v_fv_id);

      perform sp_doc_factura_venta_set_credito(v_fv_id);

      -- estado
      --
      perform sp_doc_factura_venta_set_estado(v_fv_id);

      --/////////////////////////////////////////////////////////////////////////////////////////////////
      --
      -- validaciones
      --
      --/////////////////////////////////////////////////////////////////////////////////////////////////

      -- estado
      --
      select * from sp_auditoria_credito_check_doc_fv(v_fv_id) into v_success, v_error_msg;
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

   -- ahora el pendiente de la cobranza
   --
   perform sp_doc_cobranza_set_pendiente(v_cobz_id);

   -- estado
   --
   perform sp_doc_cobranza_set_credito(v_cobz_id);
   perform sp_doc_cobranza_set_estado(v_cobz_id);

   v_CobziTCtaCte := 5;

   -- guardo un id de cuenta para anticipos.
   -- esto funciona asi: si despues de aplicar queda plata pendiente
   --                    la asigno a la cuenta anticipo
   --
   select cue_id
     into v_cue_id_anticipo
   from CobranzaItem
   where cobz_id = v_cobz_id
     and cobzi_tipo = v_CobziTCtaCte
     and cobzi_orden = ( select min(cobzi_orden)
                         from CobranzaItem
                         where cobz_id = v_cobz_id
                           and cobzi_tipo = v_CobziTCtaCte );

   -- borro la info de cuenta corriente para esta cobranza
   --
   delete from CobranzaItem
   where cobz_id = v_cobz_id
     and cobzi_tipo = v_CobziTCtaCte;

   v_cue_deudoresXvta := 4;
   v_cobzi_orden := 0;
   v_aplic := 0;

   for v_cue_id,v_cobzi_importe,v_cobzi_importeorigen in
      select c.cue_id,
             sum(fvcobz_importe),
             sum(fvcobz_importeOrigen)
      from FacturaVentaCobranza
      join FacturaVenta
        on FacturaVentaCobranza.fv_id = FacturaVenta.fv_id
      join AsientoItem
        on AsientoItem.as_id = FacturaVenta.as_id
      join Cuenta c
        on AsientoItem.cue_id = c.cue_id
      where cobz_id = v_cobz_id
        and asi_debe <> 0
        and c.cuec_id = v_cue_deudoresXvta
      group by c.cue_id
   loop

      v_cobzi_orden := v_cobzi_orden + 1;

      -- creo un nuevo registro de cobranza item
      --
      select sp_dbGetNewId('CobranzaItem', 'cobzi_id') into v_cobzi_id;

      insert into CobranzaItem
             ( cobz_id, cobzi_id, cobzi_orden, cobzi_importe, cobzi_importeorigen, cobzi_tipo, cue_id )
      values ( v_cobz_id, v_cobzi_id, v_cobzi_orden, v_cobzi_importe, v_cobzi_importeorigen, v_CobziTCtaCte, v_cue_id );

      v_aplic := v_aplic + v_cobzi_importe;

   end loop;

   select cobz_total,
          cobz_cotizacion
     into v_total,
          v_cotiz
   from Cobranza
   where cobz_id = v_cobz_id;

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

      v_cobzi_orden := v_cobzi_orden + 1;

      -- creo un nuevo registro de cobranza item
      --
      select sp_dbGetNewId('CobranzaItem', 'cobzi_id') into v_cobzi_id;

      insert into CobranzaItem
             ( cobz_id, cobzi_id, cobzi_orden, cobzi_importe, cobzi_importeorigen, cobzi_tipo, cue_id )
      values ( v_cobz_id, v_cobzi_id, v_cobzi_orden, v_aplic, v_aplicOrigen, v_CobziTCtaCte, v_cue_id_anticipo );

   end if;

   select * from sp_doc_cobranzaAsientoSave(v_cobz_id, 0) into v_error, v_error_msg;

/*
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
//                                     historial de modificaciones                                                    //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
*/

   perform sp_historia_update(18004, v_cobz_id, v_modifico, 6);

/*
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
//                                        temporales                                                                  //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
*/

   delete from FacturaVentaCobranzaTMP where cobzTMP_id = p_cobzTMP_id;
   delete from CobranzaItemTMP where cobzTMP_id = p_cobzTMP_id;
   delete from CobranzaTMP where cobzTMP_id = p_cobzTMP_id;

   drop table tt_FacturasVta;

   return;

exception
   when others then

     raise exception 'Ha ocurrido un error al grabar la aplicación de la cobranza. sp_doc_cobranza_save_aplic. %. %.',
                      sqlstate, sqlerrm;

end;
$BODY$
  language plpgsql volatile
  cost 100;
alter function sp_doc_cobranza_save_aplic(integer, integer, integer)
  owner to postgres;
