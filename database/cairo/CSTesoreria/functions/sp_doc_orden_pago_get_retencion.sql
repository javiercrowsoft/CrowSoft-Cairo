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
-- Function: sp_doc_orden_pago_get_retencion()

/*
drop function sp_doc_orden_pago_get_retencion(
  integer,
  date,
  date,
  varchar,
  varchar,
  varchar,
  decimal,
  varchar,
  integer);
*/
/*
          select * from ProveedorRetencion;
          select * from sp_doc_orden_pago_get_retencion(6);
          fetch all from rtn;
*/

create or replace function sp_doc_orden_pago_get_retencion
(
  in p_us_id integer,
  in p_fdesde date,
  in p_fhasta date,
  in p_prov_id varchar,
  in p_emp_id varchar,
  in p_ret_id varchar,
  in p_pago decimal(18,6),
  in p_facturas varchar,
  in p_IsForOPG integer default 0,
  out rtn refcursor
)
  returns refcursor as
$BODY$
declare
   v_sys_error varchar := '';
   v_error_msg_aux varchar(5000);

   v_prov_id integer;
   v_emp_id integer;
   v_ret_id integer;
   v_ram_id_Proveedor integer;
   v_ram_id_Empresa integer;
   v_ram_id_Retencion integer;
   v_noAplica integer;
   v_pro_id integer;
   v_tipoMinimo smallint;
   v_minimoImponible decimal(18,6);
   v_baseNoImponible decimal(18,6);
   v_minimoRet decimal(18,6);
   v_tasa decimal(18,6);
   v_ret decimal(18,6);
   v_totalPago decimal(18,6);
   v_opg_total decimal(18,6);
   v_base decimal(18,6);
   v_percepcion decimal(18,6);
   v_acumulaPor smallint;
   v_ibc_id smallint;
   v_catf_id integer;
   v_tipoBase smallint;

   v_codigo timestamp with time zone;
   v_pagoParcial decimal(18,6);
   v_txt varchar(5000);
   v_fc_numero integer;
   v_fc_id integer;
   v_pago_ibc decimal(18,6);
   v_desc1 decimal(18,6);
   v_desc2 decimal(18,6);
   v_ya_pagado decimal(18,6);

   v_aplicado decimal(18,6);
   v_anticipo decimal(18,6);

   -- el pago segun la categoria de ingresos brutos
   --
   v_nuevoPago decimal(18,6);

   -- el iva del pago segun la categoria de ingresos brutos
   --
   v_nuevoPagoIva decimal(18,6);

   v_minimoDesde decimal(18,6);

   -- finalmente solo nos falta la tasa que esta en relacion con el monto a pagar
   --
   v_minimoTasa decimal(18,6);

   v_montoFijo decimal(18,6);

   v_yaRetenido decimal(18,6);

   v_descrip varchar(5000);
   v_fc_base decimal(18,6);

   v_ta_id integer;
   v_ta_nrodoc varchar(100);

begin

   rtn := 'rtn';

   create temporary table tt_nuevoPago
   (
     fc_numero integer  not null,
     pago decimal(18,6)  not null,
     esparcial integer default (0) not null,
     pago_base decimal(18,6) default (0) not null,
     iva decimal(18,6) default (0) not null,
     percepcion decimal(18,6) default (0) not null,
     base decimal(18,6) default (0) not null
   ) on commit drop;

   -- solo convierto los ids
   --
   select * from sp_ArbConvertId(p_prov_id) into v_prov_id, v_ram_id_Proveedor;
   select * from sp_ArbConvertId(p_emp_id)  into v_emp_id,  v_ram_id_Empresa;
   select * from sp_ArbConvertId(p_ret_id)  into v_ret_id,  v_ram_id_Retencion;

   select ret_acumulapor,
          ibc_id,
          ret_tipominimo
     into v_acumulaPor,
          v_ibc_id,
          v_tipoMinimo
   from Retencion
   where ret_id = v_ret_id;

   --/////////////////////////////////////////////////////////////////////////////////////////////////////
   --
   --	definimos si esta retencion es aplicable a este proveedor
   --
   --/////////////////////////////////////////////////////////////////////////////////////////////////////

   -- si la retencion indica explicitamente al menos una categoria fiscal
   -- comprobamos que la categoria del proveedor este asociada a la retencion
   --
   if exists ( select * from RetencionCategoriaFiscal where ret_id = v_ret_id ) then

      select prov_catFiscal
        into v_catf_id
      from Proveedor
      where prov_id = v_prov_id;

      select retcatf_base
        into v_tipoBase
      from RetencionCategoriaFiscal
      where ret_id = v_ret_id
        and catf_id = v_catf_id;

      -- si tipoBase es null es por que esta retencion
      -- no incluye la categoria fiscal del proveedor
      --
      if v_tipoBase is null then
         v_noAplica := 1;
      else
         v_noAplica := 0;
      end if;

   else

      -- si no hay categorias explicitas para esta retencion
      -- se calcula para todos los proveedores
      --
      v_noAplica := 0;
      v_tipoBase := 1;-- Neto


   end if;

   -- validamos la provincia
   --
   if v_noAplica = 0 then

      -- si la retencion indica explicitamente al menos una provincia
      -- comprobamos que la provincia del proveedor este asociada a la retencion
      --
      if exists ( select * from RetencionProvincia where ret_id = v_ret_id ) then

         select pro_id
           into v_pro_id
         from Proveedor
         where prov_id = v_prov_id;

         if not exists ( select *
                         from RetencionProvincia
                         where ret_id = v_ret_id
                           and pro_id = v_pro_id ) then

            v_noAplica := 1;

         else

            v_noAplica := 0;

         end if;

         -- si la retencion tiene una provincia diferente, pero esta
         -- indicada explicitamente la traemos igual
         --
         if v_noAplica <> 0 then

            if exists ( select *
                        from ProveedorRetencion
                        where prov_id = v_prov_id
                          and ret_id = v_ret_id ) then

               v_noAplica := 0;

            end if;

         end if;

      else

         -- si no hay provincias explicitas para esta retencion
         -- se calcula para todos los proveedores
         --
         v_noAplica := 0;

      end if;

   end if;

   --/////////////////////////////////////////////////////////////////////////////////////////////////////
   --
   --	calculo de la retencion
   --
   --/////////////////////////////////////////////////////////////////////////////////////////////////////

   if v_noAplica = 0 then

      --/////////////////////////////////////////////////////////////////////////////////////////////////////
      --
      --	obtengo el pago de esta op sin impuestos (ni iva ni percepciones)
      --
      --/////////////////////////////////////////////////////////////////////////////////////////////////////

      -- ok ahora obtengo el iva de lo que estoy por pagar
      --
      -- paso a una temporal las facturas indicadas
      --

      --/////////////////////////////////////////////////////////////////////////////////////////////////////
      --
      --	pagos en el periodo (si correponde)
      --
      --/////////////////////////////////////////////////////////////////////////////////////////////////////

      if v_acumulaPor = 2 then-- Mensual

         -- NOTA: como la unica percepcion que incluye montos en el periodo es la de ganancias
         --       y por lo que hasta ahora sabemos, se aplica sobre el neto y para todas las
         --       categorias, no vamos a complicarnos discriminando si el producto es una cosa mueble
         --       o es un servicio, ya que no afecta a esta retencion
         --
         --       :( si cambian las reglas (y seguro lo haran) nos encargaremos
         --
         -- obtengo cuanto le pague en este periodo sin el iva
         --
         -- los anticipos no tienen iva
         --

         select sum(fcopg.fcopg_importe
                    - (fc.fc_ivari * (fcopg.fcopg_importe / fc.fc_total))
                    - (fc.fc_ivarni * (fcopg.fcopg_importe / fc.fc_total))
                    )
           into v_aplicado

         from FacturaCompraOrdenPago fcopg
         join FacturaCompra fc
          on fcopg.fc_id = fc.fc_id
         join OrdenPago opg
          on fcopg.opg_id = opg.opg_id
         join Documento d
          on fc.doc_id = d.doc_id

         where opg.opg_fecha between p_fdesde and p_fhasta
           and opg.prov_id = v_prov_id
           and d.emp_id = v_emp_id

           -- esto no me gusta, pero no lo vamos a tocar por ahora.
           --
           -- supuestamente es para notas de debito por cheque rechazado
           -- pero no estoy muy conforme con esta solucion,
           -- ya que si la factura contiene varios items y uno solo es
           -- exento de retenciones, no la tomo en cuenta en su totalidad
           -- y eso no esta bien.
           --
           -- ademas, ibc es ingresos brutos categoria, y lo estamos usando
           -- para las retenciones de ganancias, asi que no esta para nada
           -- prolijo, ya veremos si lo cambiamos
           --
           and not exists ( select *
                            from FacturaCompraItem fci
                            join Producto pr
                              on fci.pr_id = pr.pr_id
                            where pr.ibc_id = 1-- Exento
                              and fci.fc_id = fc.fc_id );

         v_aplicado := coalesce(v_aplicado, 0);

         -- obtengo cuanto hay de percepciones en estas facturas
         --
         select
                sum(fcp.fcperc_importe * (fcopg.fcopg_importe / fc.fc_total))
           into v_percepcion

         from FacturaCompraOrdenPago fcopg
         join FacturaCompra fc
           on fcopg.fc_id = fc.fc_id
         join OrdenPago opg
           on fcopg.opg_id = opg.opg_id
         join Documento d
           on fc.doc_id = d.doc_id
         join FacturaCompraPercepcion fcp
           on fc.fc_id = fcp.fc_id

         where opg.opg_fecha between p_fdesde and p_fhasta
           and opg.prov_id = v_prov_id
           and d.emp_id = v_emp_id

           -- esto no me gusta, pero no lo vamos a tocar por ahora.
           --
           -- supuestamente es para notas de debito por cheque rechazado
           -- pero no estoy muy conforme con esta solucion,
           -- ya que si la factura contiene varios items y uno solo es
           -- exento de retenciones, no la tomo en cuenta en su totalidad
           -- y eso no esta bien.
           --
           -- ademas, ibc es ingresos brutos categoria, y lo estamos usando
           -- para las retenciones de ganancias, asi que no esta para nada
           -- prolijo, ya veremos si lo cambiamos
           --
           and not exists ( select *
                            from FacturaCompraItem fci
                            join Producto pr
                              on fci.pr_id = pr.pr_id
                            where pr.ibc_id = 1-- Exento
                              and fci.fc_id = fc.fc_id );

         v_percepcion := coalesce(v_percepcion, 0);

         select
                sum(c.opg_pendiente)
           into v_anticipo

         from OrdenPago c
         join Documento d
           on c.doc_id = d.doc_id

         where c.opg_fecha between p_fdesde and p_fhasta
           and c.prov_id = v_prov_id
           and d.emp_id = v_emp_id
           and c.est_id <> 7;

         v_anticipo := coalesce(v_anticipo, 0);
         v_opg_total := v_aplicado + v_anticipo - v_percepcion;
         v_opg_total := coalesce(v_opg_total, 0);

      end if;

      v_percepcion := coalesce(v_percepcion, 0);
      v_opg_total := coalesce(v_opg_total, 0);

      -- pasamos las facturas de string a temporal
      --
      v_codigo := CURRENT_TIMESTAMP;

      perform sp_str_string_to_table(v_codigo, p_facturas, '*');

      for v_txt in

          select tmpstr2tbl_campo from TmpStringToTable where tmpstr2tbl_id = v_codigo

      loop

            if isnumeric(v_txt) <> 0 then

               select fc_id
                 into v_fc_id
               from FacturaCompra
               where fc_numero = to_number(v_txt);

               -- esto no me gusta, pero no lo vamos a tocar por ahora.
               --
               -- supuestamente es para notas de debito por cheque rechazado
               -- pero no estoy muy conforme con esta solucion,
               -- ya que si la factura contiene varios items y uno solo es
               -- exento de retenciones, no la tomo en cuenta en su totalidad
               -- y eso no esta bien.
               --
               -- ademas, ibc es ingresos brutos categoria, y lo estamos usando
               -- para las retenciones de ganancias, asi que no esta para nada
               -- prolijo, ya veremos si lo cambiamos
               --
               if not exists ( select *
                               from FacturaCompraItem fci
                               join Producto pr
                                 on fci.pr_id = pr.pr_id
                               where pr.ibc_id = 1-- Exento
                                 and fci.fc_id = v_fc_id ) then

                  -- si la retencion no tiene definido un ibc_id aplicamos todo el pago
                  --
                  if v_ibc_id is null then

                     insert into tt_nuevoPago ( fc_numero, pago ) values ( to_number(v_txt), 0 );

                  else

                     -- para descontar anticipos sobre esta factura
                     --
                     v_ya_pagado := 0;

                     -- tenemos que obtener el monto de la suma de los productos cuyo
                     -- ibc_id = al de la retencion
                     --
                     select sum(fci.fci_importe)
                       into v_pago_ibc
                     from FacturaCompraItem fci
                     join Producto pr
                       on fci.pr_id = pr.pr_id
                     where fci.fc_id = v_fc_id
                       and pr.ibc_id = v_ibc_id;

                     v_pago_ibc := coalesce(v_pago_ibc, 0);

                     select fc_descuento1,
                            fc_descuento2
                       into v_desc1,
                            v_desc2
                     from FacturaCompra
                     where fc_id = v_fc_id;

                     v_pago_ibc := v_pago_ibc - (v_pago_ibc * v_desc1 / 100) - ((v_pago_ibc * v_desc1 / 100) * v_desc2 / 100);

                     select coalesce(sum(fcopg_importe), 0)
                       into v_ya_pagado
                     from FacturaCompraOrdenPago
                     where fc_id = v_fc_id;

                     select coalesce(v_ya_pagado, 0) + coalesce(sum(fcnc_importe), 0)
                       into v_ya_pagado
                     from FacturaCompraNotaCredito
                     where fc_id_factura = v_fc_id;

                     -- le tengo que sacar a ya_pagado el % de las retenciones ya pagadas
                     --
                     select v_ya_pagado - v_ya_pagado * (fc_totalpercepciones / fc_total)
                       into v_ya_pagado
                     from FacturaCompra
                     where fc_id = v_fc_id;

                     v_pago_ibc := v_pago_ibc - coalesce(v_ya_pagado, 0);

                     if v_pago_ibc > 0 then

                        insert into tt_nuevoPago ( fc_numero, pago ) values ( to_number(v_txt), v_pago_ibc );

                     end if;

                  end if;

               end if;

            else

               if instr(v_txt, '-') <> 0 then

                  v_fc_numero := to_number(substr(v_txt, 1, instr(v_txt, '-') - 1));
                  v_pagoParcial := cast(substr(v_txt, instr(v_txt, '-') || 1, length(v_txt)) as decimal(18,6));

                  select fc_id
                    into v_fc_id
                  from FacturaCompra
                  where fc_numero = v_fc_numero;

                  -- esto no me gusta, pero no lo vamos a tocar por ahora.
                  --
                  -- supuestamente es para notas de debito por cheque rechazado
                  -- pero no estoy muy conforme con esta solucion,
                  -- ya que si la factura contiene varios items y uno solo es
                  -- exento de retenciones, no la tomo en cuenta en su totalidad
                  -- y eso no esta bien.
                  --
                  -- ademas, ibc es ingresos brutos categoria, y lo estamos usando
                  -- para las retenciones de ganancias, asi que no esta para nada
                  -- prolijo, ya veremos si lo cambiamos
                  --
                  if not exists ( select *
                                  from FacturaCompraItem fci
                                  join Producto pr
                                    on fci.pr_id = pr.pr_id
                                  where pr.ibc_id = 1-- Exento
                                    and fci.fc_id = v_fc_id ) then

                     -- si ibc_id es null no hay problema
                     --
                     if v_ibc_id is null then

                        insert into tt_nuevoPago ( fc_numero, pago, esparcial )
                                          values ( v_fc_numero, v_pagoParcial, 1 );

                     else

                        -- si la factura tiene items con ibc_id = @ibc_id y
                        -- tengo que asegurarme que no tenga otros items
                        -- con ibc_id <> @ibc_id
                        --
                        if exists ( select *
                                    from FacturaCompraItem fci
                                    join Producto pr
                                      on fci.pr_id = pr.pr_id
                                    where fci.fc_id = v_fc_id
                                      and pr.ibc_id = v_ibc_id ) then

                           -- como dije antes, verifico que no exista mezcla de
                           -- categorias de ingresos brutos en la factura
                           --
                           if exists ( select *
                                       from FacturaCompraItem fci
                                       join Producto pr
                                         on fci.pr_id = pr.pr_id
                                       where fci.fc_id = v_fc_id
                                         and pr.ibc_id <> v_ibc_id ) then

                              -- se pudrio todo, yo no se como resolver esto asi que se lo dejo al usuario
                              --
                              /*+'(sepa disculpar la ignorancia de nuestros programadores :)'*/
                              v_error_msg_aux := '@@ERROR_SP:Esta orden de pago esta cancelando '
                                                 || 'una factura que incluye productos con diferentes '
                                                 || 'categorias de ingresos brutos (Gravado Cosas Muebles, '
                                                 || 'Gravado Servicios, etc.), con un pago parcial, y esta '
                                                 || 'combinanción no esta soportada por el algoritmo de '
                                                 || 'calculo de retenciones.'
                                                 || CHR(13) || CHR(13)
                                                 || 'Ud. debera realizar el calculo manualmente.';

                              raise exception '@@ERROR_SP: %', v_error_msg_aux;-- :) sefini

                              return;

                           else

                              -- tomo el pago parcial ya que aqui no ha pasado nada :)
                              --
                              insert into tt_nuevoPago ( fc_numero, pago, esparcial )
                                                values ( v_fc_numero, v_pagoParcial, 1 );

                           end if;

                        end if;

                     end if;

                  end if;

               end if;

            end if;

            -- por si no lo notaron, si la factura no tiene
            -- items con ibc_id = @ibc_id, no me interesa el pago
            -- que se le halla aplicado

      end loop;

      -- obtengo lo pagado sobre cada factura
      --
      update tt_nuevoPago
      set pago_base = case when pago <> 0 then pago else fc_pendiente end
      from FacturaCompra fc inner join Documento d on fc.doc_id = d.doc_id
      where prov_id = v_prov_id
        and d.emp_id = v_emp_id
        and tt_nuevoPago.fc_numero = fc.fc_numero;

      -- el pago segun la categoria de ingresos brutos
      --
      select sum(case when pago <> 0 then pago else fc.fc_pendiente end)
             into v_nuevoPago
      from FacturaCompra fc
      join Documento d
        on fc.doc_id = d.doc_id
      join tt_nuevoPago t
        on fc.fc_numero = t.fc_numero
      where fc.prov_id = v_prov_id
        and d.emp_id = v_emp_id;

      -- obtengo el iva de lo pagado sobre cada factura
      --
      update tt_nuevoPago
         set iva = case
                      when esparcial <> 0 then
                                          (fc_ivari  * (pago / fc_total))
                                        + (fc_ivarni * (pago / fc_total))
                      when pago <> 0 then
                                          (fc_ivari  * (pago / (fc_total-fc_totalpercepciones)))
                                        + (fc_ivarni * (pago / (fc_total-fc_totalpercepciones)))
                      else
                                          (fc_ivari  * (fc_pendiente / fc_total))
                                        + (fc_ivarni * (fc_pendiente / fc_total))
                      end
      from FacturaCompra fc inner join Documento d  on fc.doc_id    = d.doc_id
      where prov_id  = v_prov_id
        and d.emp_id = v_emp_id
      and tt_nuevoPago.fc_numero = fc.fc_numero;

      if v_tipoBase <> 3 then

         select sum(case
                       when esparcial <> 0 then (fc.fc_ivari * (pago / fc.fc_total))
                                              + (fc.fc_ivarni * (pago / fc.fc_total))

                       when pago <> 0      then (fc.fc_ivari * (pago / (fc.fc_total - fc.fc_totalpercepciones)))
                                              + (fc.fc_ivarni * (pago / (fc.fc_total - fc.fc_totalpercepciones)))

                       else                     (fc.fc_ivari * (fc.fc_pendiente / fc.fc_total))
                                              + (fc.fc_ivarni * (fc.fc_pendiente / fc.fc_total))
                    end)
         into v_nuevoPagoIva
         from FacturaCompra fc
         join Documento d
           on fc.doc_id = d.doc_id
         join tt_nuevoPago t
           on fc.fc_numero = t.fc_numero
         where fc.prov_id = v_prov_id
           and d.emp_id = v_emp_id;

      -- si la percepcion es sobre el total
      -- no le descuento el IVA
      --
      else

         v_nuevoPagoIva := 0;

      end if;

      -- obtengo las percepciones de lo pagado sobre cada factura
      --
      update tt_nuevoPago
         set percepcion = case
                            when esparcial <> 0 then (fcperc_importe  * (pago / fc_total))
                            when pago <> 0      then 0
                            else                     (fcperc_importe  * (fc_pendiente / fc_total))
                          end
      from FacturaCompra fc
      inner join Documento d
              on fc.doc_id = d.doc_id
      inner join FacturaCompraPercepcion fcp
              on fc.fc_id = fcp.fc_id
      where prov_id  = v_prov_id
        and d.emp_id = v_emp_id
      and tt_nuevoPago.fc_numero = fc.fc_numero;

      -- ahora la percepcion de lo que estoy pagando
      --
      v_percepcion := 0;

      select sum(case
                    when esparcial <> 0 then (fcp.fcperc_importe * (pago / fc.fc_total))
                    when pago <> 0      then 0
                    else                     (fcp.fcperc_importe * (fc.fc_pendiente / fc.fc_total))
                 end)
        into v_percepcion
      from FacturaCompra fc
      join Documento d
        on fc.doc_id = d.doc_id
      join tt_nuevoPago t
        on fc.fc_numero = t.fc_numero
      join FacturaCompraPercepcion fcp
        on fc.fc_id = fcp.fc_id
      where fc.prov_id = v_prov_id
        and d.emp_id = v_emp_id;

      v_percepcion := coalesce(v_percepcion, 0);

      if v_tipoBase <> 3 then

         update tt_nuevoPago set base = pago_base - iva - percepcion;

      else

         update tt_nuevoPago set base = pago_base - percepcion;

      end if;

      -- ahora obtengo el pago sin el iva ni las percepciones
      -- de lo que estoy por pagar
      --
      v_nuevoPago := coalesce(v_nuevoPago, 0) - coalesce(v_nuevoPagoIva, 0) - v_percepcion;

      --/////////////////////////////////////////////////////////////////////////////////////////////////////
      --
      --	otros datos de la retencion (base no imponible, minimo a retener, etc.)
      --
      --/////////////////////////////////////////////////////////////////////////////////////////////////////

      -- vamos por la base no imponible
      --
      -- si no tiene minimos
      --
      select min(reti_importedesde)
        into v_minimoImponible
      from RetencionItem
      where ret_id = v_ret_id;

      v_minimoImponible := coalesce(v_minimoImponible, 0);

      -- vamos por el minimo a retener
      --
      select ret_importeminimo
        into v_minimoRet
      from Retencion
      where ret_id = v_ret_id;

      select min(reti_importeDesde)
        into v_minimoDesde
      from RetencionItem
      where ret_id = v_ret_id;

      v_minimoDesde := coalesce(v_minimoDesde, 0);

      if not exists ( select *
                      from RetencionItem
                      where ret_id = v_ret_id
                        and reti_importefijo <> 0 ) then

         select reti_porcentaje / 100,
                reti_importeDesde,
                reti_importefijo
           into v_tasa,
                v_minimoTasa,
                v_montoFijo
         from RetencionItem
         where ret_id = v_ret_id
           and (v_opg_total + v_nuevoPago) between reti_importeDesde and reti_importeHasta;

      else

         select reti_porcentaje / 100,
                reti_importeDesde,
                reti_importefijo
           into v_tasa,
                v_minimoTasa,
                v_montoFijo
         from RetencionItem
         where ret_id = v_ret_id
           and (v_opg_total + v_nuevoPago - v_minimoDesde) between reti_importeDesde and reti_importeHasta;

      end if;

      --/////////////////////////////////////////////////////////////////////////////////////////////////////
      --
      --	otros datos de la retencion (base no imponible, minimo a retener, etc.)
      --
      --/////////////////////////////////////////////////////////////////////////////////////////////////////


      -- ahora vemos si tiene que pagar y cuanto
      --
      if v_tipoMinimo = 1 then /* NoImponible */

         v_baseNoImponible := v_minimoImponible;

      else /* Imponible */

         v_baseNoImponible := 0;

      end if;

      -- si lo que se pago hasta ahora es mayor a la base (ej. > 12000)
      --
      if v_opg_total > v_baseNoImponible then

         -- si lo que se pago hasta ahora por la tasa no supera el minimo a retener (ej < 20)
         --
         if (v_opg_total - v_baseNoImponible) * v_tasa < v_minimoRet then

            -- la base imponible es el nuevo pago mas lo pagado anteriormente
            -- y que no sufrio retencion
            --
            v_base := v_opg_total + v_nuevoPago - v_baseNoImponible;

         -- la base es unicamente el nuevo pago
         --
         else

            v_base := v_nuevoPago;

         end if;

      else

         -- si lo que pague hasta ahora es menor a la base no imponible
         -- entonces la base imponible es lo que pague hasta ahora mas
         -- el nuevo pago
         --
         if v_opg_total + v_nuevoPago - v_baseNoImponible > 0 then

            v_base := v_opg_total + v_nuevoPago - v_baseNoImponible;

         end if;

      end if;

      v_base := coalesce(v_base, 0);

      if v_montoFijo <> 0 then

         v_ret := ((v_opg_total + v_nuevoPago - v_minimoTasa - v_minimoDesde) * v_tasa) + v_montoFijo;

         select sum(opgi.opgi_importe)
           into v_yaRetenido
         from OrdenPago opg
         join OrdenPagoItem opgi
           on opg.opg_id = opgi.opg_id
         where opg.prov_id = v_prov_id
           and opg.opg_fecha between p_fdesde and p_fhasta
           and opgi.ret_id = v_ret_id;

         v_yaRetenido := coalesce(v_yaRetenido, 0);

         v_ret := v_ret - v_yaRetenido;

      else

         v_ret := v_base * v_tasa;

      end if;

      --/////////////////////////////////////////////////////////////////////////////////////////////////////
      --
      --	validamos que la retencion pase el minimo
      --
      --/////////////////////////////////////////////////////////////////////////////////////////////////////

      v_ret := coalesce(v_ret, 0);

      if v_ret < 0 then

         v_ret := 0;

      end if;

      if v_ret < v_minimoRet and ( (v_opg_total - v_baseNoImponible) * v_tasa < v_minimoRet ) then

         v_ret := 0;

      end if;

   end if;

   --/////////////////////////////////////////////////////////////////////////////////////////////////////
   --
   --	fin calculo
   --
   --/////////////////////////////////////////////////////////////////////////////////////////////////////

   --/////////////////////////////////////////////////////////////////////////////////////////////////////
   --
   --	select de retorno
   --
   --/////////////////////////////////////////////////////////////////////////////////////////////////////

   -- si me llamo cairo desde el asistente de op para que calcule el monto
   --
   --
   if p_IsForOPG <> 0 then

      v_ret := coalesce(v_ret, 0);

      if v_ret > 0 then

         select ta_id
           into v_ta_id
         from Retencion
         where ret_id = v_ret_id;

         select sp_talonario_get_next_number(v_ta_id) into v_ta_nrodoc;

      end if;

      v_descrip := '';

      for v_fc_numero,v_fc_base in

          select fc_numero, base from tt_nuevoPago

      loop

            v_descrip := v_descrip
                         || 'FV:' || CAST(v_fc_numero as varchar)
                         || ' - ' || CAST(v_fc_base as varchar) || ',';

      end loop;

      open rtn for

         select v_ret retencion,
                v_tasa * 100 porcentaje,
                v_ta_nrodoc comprobante,
                v_base base;

   -- si me llamo un reporte para imprimir el comprobante de retencion
   --
   else

      select sp_doc_orden_pago_get_retencion_rpt(
                p_fdesde,
                p_fhasta,
                p_prov_id,
                p_emp_id,
                v_nuevoPago,
                v_opg_total,
                v_nuevoPago,
                v_base,
                v_tasa,
                v_ret)
      into rtn;

   end if;

   --/////////////////////////////////////////////////////////////////////////////////////////////////////
   --
   --
   --	se termino :)
   --
   --
   --/////////////////////////////////////////////////////////////////////////////////////////////////////

end;
$BODY$
  language plpgsql volatile
  cost 100;
alter function sp_doc_orden_pago_get_retencion(
  integer,
  date,
  date,
  varchar,
  varchar,
  varchar,
  decimal,
  varchar,
  integer)
  owner to postgres;