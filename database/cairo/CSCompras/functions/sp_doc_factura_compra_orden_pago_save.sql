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
-- Function: sp_doc_factura_compra_orden_pago_save()

-- drop function sp_doc_factura_compra_orden_pago_save(integer, integer);

create or replace
function sp_doc_factura_compra_orden_pago_save
(
  in p_us_id integer,
  in p_fc_id integer,
  out p_success integer,
  out p_error_msg varchar
)
  returns record as
$BODY$
declare
   v_prov_id integer;
   v_opg_id integer;
   v_as_id integer;
   v_suc_id integer;
   v_cpg_id integer;
   v_ccos_id integer;
   v_lgj_id integer;
   v_fc_fechaVto timestamp with time zone;
   v_fc_fechaiva timestamp with time zone;
   v_fc_nrodoc varchar(50);
   v_cpg_tipo smallint;
   v_cueg_id_cpg integer;
   v_doc_id_opg integer;
   v_cpg_asientoXVto smallint;
   v_cue_id_cpg integer;
   v_modifico integer;
   v_min_ccos_id integer;
   v_max_ccos_id integer;

   -- la cuenta del acreedor puede ser mas de una cuando
   -- se utilizan tipos de operaciones distintas en los renglones
   -- de una factura. Como esto es casi imposible que suceda
   -- no nos vamos a complicar programando este tipo de casos
   -- sino que controlamos que no se use mas de un tipo de operacion
   -- y si hay mas de una descartamos la factura informandole que
   -- no podra grabarla con la condicion este tipo de condicion de pago
   -- debera usar una condicion de pago normal y generar la op manualmente
   --
   v_to_count integer;

   v_opgTMP_id integer;
   v_opg_fecha timestamp with time zone;
   v_opg_total decimal(18,6);
   v_opgiTMP_id integer;
   v_cue_id_acreedor integer;
   v_fcopgTMP_id integer;
   v_fcd_id integer;
   v_fcd_importe decimal(18,6);

   rslt row_result;

begin

   /*
				si la condicion de pago de la factura es de tipo [Debito Automatico] o [Fondo Fijo]
    debo generar una orden de pago automaticamente.

				para esto tengo que sacar de la condicion de pago el documento y la cuenta contable
    de los fondos pasando por la cuenta grupo asociada a dicha condicion de pago.
	 */

   select fc_fechaVto,
          fc_fechaiva,
          fc_nrodoc,
          prov_id,
          cpg_id,
          as_id,
          suc_id,
          ccos_id,
          lgj_id,
          modifico
     into v_fc_fechaVto,
          v_fc_fechaiva,
          v_fc_nrodoc,
          v_prov_id,
          v_cpg_id,
          v_as_id,
          v_suc_id,
          v_ccos_id,
          v_lgj_id,
          v_modifico
   from FacturaCompra
   where fc_id = p_fc_id;

   if v_ccos_id is null then

      select min(ccos_id),
             max(ccos_id)
        into v_min_ccos_id,
             v_max_ccos_id
      from FacturaCompraItem
      where fc_id = p_fc_id
        and ccos_id is not null;

      if v_min_ccos_id = v_max_ccos_id then

         select ccos_id
           into v_ccos_id
         from FacturaCompraItem
         where fc_id = p_fc_id
           and ccos_id is not null;

      end if;

   end if;

   select cpg_tipo,
          cueg_id,
          doc_id,
          cpg_asientoXVto
     into v_cpg_tipo,
          v_cueg_id_cpg,
          v_doc_id_opg,
          v_cpg_asientoXVto
   from CondicionPago
   where cpg_id = v_cpg_id;

   select case
             when provcueg.cue_id is not null then provcueg.cue_id
             else cueg.cue_id
          end
     into v_cue_id_cpg
   from CuentaGrupo cueg
   left join ProveedorCuentaGrupo provcueg
          on cueg.cueg_id = provcueg.cueg_id
   where cueg.cueg_id = v_cueg_id_cpg;

   if v_cpg_tipo in ( 2 /* debito automatico */, 3 /* fondo fijo */ ) then

      select count(distinct to_id)
        into v_to_count
      from FacturaCompraItem
      where fc_id = p_fc_id;

      if v_to_count = 1 then

         select sp_dbGetNewId('OrdenPagoTMP', 'opgTMP_id') into v_opgTMP_id;

         if v_cpg_asientoXVto <> 0 then

            v_opg_fecha := v_fc_fechaVto;

         else

            v_opg_fecha := v_fc_fechaiva;

         end if;

         select sum(fcd_importe)
           into v_opg_total
         from FacturaCompraDeuda
         where fc_id = p_fc_id;


         insert into OrdenPagoTMP( opgTMP_id, opg_id, opg_numero, opg_nrodoc, opg_descrip, opg_fecha, opg_neto,
                                   opg_otros, opg_total, opg_pendiente, opg_cotizacion, opg_grabarAsiento, opg_firmado,
                                   est_id, suc_id, prov_id, doc_id, ccos_id, lgj_id, modifico )
         values ( v_opgTMP_id, 0, 0, '', 'Generada autom ticamente por factura ' || v_fc_nrodoc, v_opg_fecha, v_opg_total,
                  0, v_opg_total, v_opg_total, 0, 1, 0, 1, v_suc_id, v_prov_id, v_doc_id_opg, v_ccos_id, v_lgj_id,
                  v_modifico );

         select sp_dbGetNewId('OrdenPagoItemTMP', 'opgiTMP_id') into v_opgiTMP_id;

         insert into OrdenPagoItemTMP( opgTMP_id, opgiTMP_id, opgi_id, opgi_orden, opgi_otroTipo, opgi_importe,
                                       opgi_importeOrigen, opgi_tipo, ccos_id, cue_id )
         values (
                v_opgTMP_id
              , v_opgiTMP_id
              , 0  --opgi_id
              , 1  --opgi_orden
              , 2  --opgi_otroTipo
              , v_opg_total  --opgi_importe
              , 0  --opgi_importeOrigen
              , 2 --opgi_tipo
              , v_ccos_id
              , v_cue_id_cpg );

         -- si ya genere el asiento obtengo la cuenta
         -- desde el asientoitem de tipo 2 (acreedor)
         --
         if v_as_id is not null then

            select min(cue_id)
              into v_cue_id_acreedor
            from AsientoItem
            where as_id = v_as_id
              and asi_tipo = 2;

         -- si aun no se grabo el asiento lo obtengo del
         -- grupo de cuentas
         --
         else

            select case
                      when provcueg.cue_id is not null then provcueg.cue_id
                      else cueg.cue_id
                   end
              into v_cue_id_acreedor
            from Documento doc
            join CuentaGrupo cueg
              on doc.cueg_id = cueg.cueg_id
            left join ProveedorCuentaGrupo provcueg
                   on cueg.cueg_id = provcueg.cueg_id
            where doc.doc_id = v_doc_id_opg;

         end if;

         select sp_dbGetNewId('OrdenPagoItemTMP', 'opgiTMP_id') into v_opgiTMP_id;

         insert into OrdenPagoItemTMP( opgTMP_id, opgiTMP_id, opgi_id, opgi_orden, opgi_otroTipo, opgi_importe,
                                       opgi_importeOrigen, opgi_tipo, ccos_id, cue_id )
         values (
                v_opgTMP_id
              , v_opgiTMP_id
              , 0  --opgi_id
              , 2  --opgi_orden
              , 1  --opgi_otroTipo
              , v_opg_total  --opgi_importe
              , 0  --opgi_importeOrigen
              , 5  --opgi_tipo
              , v_ccos_id
              , v_cue_id_acreedor );

         for v_fcd_id,v_fcd_importe in
            select fcd_id,
                   fcd_importe
            from FacturaCompraDeuda
            where fc_id = p_fc_id
         loop

               select sp_dbGetNewId('FacturaCompraOrdenPagoTMP', 'fcopgTMP_id') into v_fcopgTMP_id;

               insert into FacturaCompraOrdenPagoTMP( opgTMP_id, fcopgTMP_id, fcopg_id, fcopg_importe, fcopg_importeOrigen,
                                                      fcopg_cotizacion, fc_id, fcd_id, fcp_id, opg_id )
               values ( v_opgTMP_id, v_fcopgTMP_id, 0, v_fcd_importe, 0, 0, p_fc_id, v_fcd_id, null, 0 );

         end loop;

         p_success := 0;

         for rslt in
            select * from sp_doc_orden_pago_save(p_us_id, v_opgTMP_id, 1 /* no error */, p_fc_id)
         loop
            if rslt.type = 'ERROR' then
               p_error_msg := '@@ERROR_SP:' || rslt.message;
               exit;
            else
               if rslt.type = 'opg_id' then
                  v_opg_id = rslt.id;
                  p_success := 1;
                  exit;
               end if;
            end if;
         end loop;

         if p_success <> 0 then

            update OrdenPago set fc_id = p_fc_id where opg_id = v_opg_id;
            update FacturaCompra set opg_id = v_opg_id where fc_id = p_fc_id;

         end if;

      else

         p_error_msg := '@@ERROR_SP:Las facturas con mas de un tipo de operación comercial no pueden utilizar esta condicion de pago. Seleccione una condicion de pago de tipo general y genere la Orden de Pago manualmente.';
         p_success := 0;

      end if;

   else

      p_success := 1;

   end if;

exception
   when others then

   raise exception 'Ha ocurrido un error al guardar la orden de pago asociada a la factura de compra. sp_doc_factura_compra_orden_pago_save. %. %.',
                   sqlstate, sqlerrm;

end;
$BODY$
  language plpgsql volatile
  cost 100;
alter function sp_doc_factura_compra_orden_pago_save(integer, integer)
  owner to postgres;
