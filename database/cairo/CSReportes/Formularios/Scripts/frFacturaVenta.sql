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
-- Function: frFacturaVenta(integer)

-- drop function frFacturaVenta(integer);

/*

select * from frFacturaVenta(1);
fetch all from rtn;

*/

create or replace function frFacturaVenta
(
  in p_fv_id integer,
  out rtn refcursor
)
  returns refcursor as
$BODY$
declare
   v_iva_renglones decimal(18,6);
   v_internos_renglones decimal(18,6);
   v_iva_descuentos decimal(18,6);
   v_internos_descuentos decimal(18,6);
   v_descuentos decimal(18,6);
   v_remitos varchar(5000);
   v_remito varchar(5000);
begin

   rtn := 'rtn';

   v_remitos := '';

   for v_remito in
      select distinct rv.rv_nrodoc
      from RemitoVenta rv
      join RemitoVentaItem rvi
        on rv.rv_id = rvi.rv_id
      join RemitoFacturaVenta rvfv
        on rvi.rvi_id = rvfv.rvi_id
      join FacturaVentaItem fvi
        on rvfv.fvi_id = fvi.fvi_id
       and fvi.fv_id = p_fv_id
   loop

      v_remitos := v_remitos || v_remito || ',';

   end loop;

   if length(v_remitos) > 1 then

      v_remitos := substr(v_remitos, 1, length(v_remitos) - 1);

   end if;

   select sum(fvi_ivari + fvi_ivarni),
          sum(fvi_internos)
     into v_iva_renglones,
          v_internos_renglones
   from FacturaVentaItem
   where fv_id = p_fv_id;

   select -v_iva_renglones - fv_ivari - fv_ivarni,
          -v_internos_renglones - fv_internos,
          -fv_importedesc1 + fv_importedesc2
     into v_iva_descuentos,
          v_internos_descuentos,
          v_descuentos
   from FacturaVenta
   where fv_id = p_fv_id;

   open rtn for

      select FacturaVenta.*,
             fvi_orden,
             fvi_cantidad,
             fvi_importe,
             fvi_importeorigen,
             fvi_ivari,
             fvi_ivarni,
             fvi_internos,
             cue_nombre,
             doc_nombre,
             ccos_nombre,
             cli_nombre,
             cli_razonsocial,
             cli_tel,
             cpg_nombre,
             cli_cuit,
             pro_nombre,
             mon_nombre,
             mon_signo,
             mon_codigodgi2,
             ley_texto,
             case cli_catfiscal
                when 1 then 'Inscripto'
                when 2 then 'Exento'
                when 3 then 'No inscripto'
                when 4 then 'Consumidor Final'
                when 5 then 'Extranjero'
                when 6 then 'Mono Tributo'
                when 7 then 'Extranjero Iva'
                when 8 then 'No responsable'
                when 9 then 'No Responsable exento'
                when 10 then 'No categorizado'
                when 11 then 'Inscripto M'
                else 'Sin categorizar'
             end cat_fiscal,
             case cli_catfiscal
                when 1 then 'X'
                else ''
             end inscripto,
             case cli_catfiscal
                when 2 then 'X'
                else ''
             end exento,
             case cli_catfiscal
                when 3 then 'X'
                else ''
             end noinscripto,
             case cli_catfiscal
                when 4 then 'X'
                else ''
             end consumidorfinal,
             case cli_catfiscal
                when 5 then 'X'
                else ''
             end extranjero,
             case cli_catfiscal
                when 6 then 'X'
                else ''
             end monotributo,
             case cli_catfiscal
                when 7 then 'X'
                else ''
             end extranjeroiva,
             case cli_catfiscal
                when 8 then 'X'
                else ''
             end noresponsable,
             case cli_catfiscal
                when 9 then 'X'
                else ''
             end norespexento,
             case cli_catfiscal
                when 10 then 'X'
                else ''
             end nocategorizado,
             case
                when fvi_importe <> 0
                    and fvi_importeorigen <> 0 then fvi_importeorigen / fvi_importe
                else 1
             end coef,
             cli_calle || ' ' || cli_callenumero || ' ' || cli_piso || ' ' || cli_depto calle,
             cli_calle || ' ' || cli_callenumero || ' ' || cli_piso || ' ' || cli_depto direccion,
             cli_localidad || ' - ' || cli_codpostal cli_localidad,
             lgj_codigo,
             pr_codigo,
             pr_nombreventa,
             case cli_catfiscal
                when 1 then fvi_precio-- 'Inscripto'

                when 2 then fvi_precio + (fvi_precio * fvi_ivariporc / 100)-- 'Exento'

                when 3 then fvi_precio-- 'No inscripto'

                when 4 then fvi_precio + (fvi_precio * fvi_ivariporc / 100)-- 'Consumidor Final'

                when 5 then fvi_precio-- 'Extranjero'

                when 6 then fvi_precio + (fvi_precio * fvi_ivariporc / 100)-- 'Mono Tributo'

                when 7 then fvi_precio + (fvi_precio * fvi_ivariporc / 100)-- 'Extranjero Iva'

                when 8 then fvi_precio + (fvi_precio * fvi_ivariporc / 100)-- 'No responsable'

                when 9 then fvi_precio + (fvi_precio * fvi_ivariporc / 100)-- 'No Responsable exento'

                when 10 then fvi_precio + (fvi_precio * fvi_ivariporc / 100)-- 'No categorizado'

                when 11 then fvi_precio-- 'Inscripto M'

                else fvi_precio + (fvi_precio * fvi_ivariporc / 100)-- 'Sin categorizar'

             end precio,
             case cli_catfiscal
                when 1 then fvi_neto-- 'Inscripto'

                when 2 then fvi_importe-- 'Exento'

                when 3 then fvi_neto-- 'No inscripto'

                when 4 then fvi_importe-- 'Consumidor Final'

                when 5 then fvi_neto-- 'Extranjero'

                when 6 then fvi_importe-- 'Mono Tributo'

                when 7 then fvi_importe-- 'Extranjero Iva'

                when 8 then fvi_importe-- 'No responsable'

                when 9 then fvi_importe-- 'No Responsable exento'

                when 10 then fvi_importe-- 'No categorizado'

                when 11 then fvi_neto-- 'Inscripto M'

                else fvi_importe-- 'Sin categorizar'

             end importe,
             case cli_catfiscal
                when 1 then 1-- 'Inscripto'

                when 2 then 0-- 'Exento'

                when 3 then 1-- 'No inscripto'

                when 4 then 0-- 'Consumidor Final'

                when 5 then 0-- 'Extranjero'

                when 6 then 0-- 'Mono Tributo'

                when 7 then 1-- 'Extranjero Iva'

                when 8 then 0-- 'No responsable'

                when 9 then 0-- 'No Responsable exento'

                when 10 then 0-- 'No categorizado'

                when 11 then 1-- 'Inscripto M'

                else 0-- 'Sin categorizar'

             end bShowIva,
             v_remitos remitos,
             fvi_descrip
      from FacturaVenta
      join FacturaVentaItem
        on FacturaVenta.fv_id = FacturaVentaItem.fv_id
      join Cuenta
        on FacturaVentaItem.cue_id = Cuenta.cue_id
      join Documento
        on FacturaVenta.doc_id = Documento.doc_id
      join Cliente
        on FacturaVenta.cli_id = Cliente.cli_id
      join CondicionPago
        on FacturaVenta.cpg_id = CondicionPago.cpg_id
      join Producto
        on FacturaVentaItem.pr_id = Producto.pr_id
      join Moneda
        on FacturaVenta.mon_id = Moneda.mon_id
      left join Legajo
        on FacturaVenta.lgj_id = Legajo.lgj_id
      left join CentroCosto
        on FacturaVentaItem.ccos_id = CentroCosto.ccos_id
      left join Provincia
        on FacturaVenta.pro_id_origen = Provincia.pro_id
      left join Leyenda
        on ley_codigo = 'fv_001'
      where FacturaVenta.fv_id = p_fv_id

      union ALL

      -------------------------------------------------------------------------------------------------------------
      --
      --	renglones de descuento
      --
      -------------------------------------------------------------------------------------------------------------
      select FacturaVenta.*,
             1000000 fvi_orden,
             1 fvi_cantidad,
             v_descuentos + v_iva_descuentos + v_internos_descuentos fvi_importe,
             case
                when fv_total <> 0
                    and fv_totalorigen <> 0 then (v_descuentos + v_iva_descuentos + v_internos_descuentos) * (fv_totalorigen / fv_total)
                else 0
             end fvi_importeorigen,
             v_iva_descuentos fvi_ivari,
             0 fvi_ivarni,
             v_internos_descuentos fvi_interno,
             '' cue_nombre,
             doc_nombre,
             '' ccos_nombre,
             cli_nombre,
             cli_razonsocial,
             cli_tel,
             cpg_nombre,
             cli_cuit,
             pro_nombre,
             mon_nombre,
             mon_signo,
             mon_codigodgi2,
             ley_texto,
             case cli_catfiscal
                when 1 then 'Responsable Inscripto'
                when 2 then 'Exento'
                when 3 then 'No inscripto'
                when 4 then 'Consumidor Final'
                when 5 then 'Exento Operación de Exportación'
                when 6 then 'Mono Tributo'
                when 7 then 'Extranjero Iva'
                when 8 then 'No responsable'
                when 9 then 'No Responsable exento'
                when 10 then 'No categorizado'
                when 11 then 'Inscripto M'
                else 'Sin categorizar'
             end cat_fisctal,
             case cli_catfiscal
                when 1 then 'X'
                when 11 then 'X'
                else ''
             end inscripto,
             case cli_catfiscal
                when 2 then 'X'
                else ''
             end exento,
             case cli_catfiscal
                when 3 then 'X'
                else ''
             end noinscripto,
             case cli_catfiscal
                when 4 then 'X'
                else ''
             end consumidorfinal,
             case cli_catfiscal
                when 5 then 'X'
                else ''
             end extranjero,
             case cli_catfiscal
                when 6 then 'X'
                else ''
             end monotributo,
             case cli_catfiscal
                when 7 then 'X'
                else ''
             end extranjeroiva,
             case cli_catfiscal
                when 8 then 'X'
                else ''
             end noresponsable,
             case cli_catfiscal
                when 9 then 'X'
                else ''
             end norespexento,
             case cli_catfiscal
                when 10 then 'X'
                else ''
             end nocategorizado,
             case
                when fv_total <> 0
                    and fv_totalorigen <> 0 then fv_totalorigen / fv_total
                else 1
             end coef,
             cli_calle || ' ' || cli_callenumero || ' ' || cli_piso || ' ' || cli_depto calle,
             cli_calle || ' ' || cli_callenumero || ' ' || cli_piso || ' ' || cli_depto direccion,
             cli_localidad || ' - ' || cli_codpostal cli_localidad,
             lgj_codigo,
             '' pr_codigo,
             case
                when fv_importedesc1 <> 0
                    and fv_importedesc2 <> 0 then ' Descuento (' || to_char(fv_descuento1,'#,###,###,##0.00') || '% + ' || to_char(fv_descuento2,'#,###,###,##0.00') || '%)'
                when fv_importedesc1 <> 0 then ' Descuento (' || to_char(fv_descuento1,'#,###,###,##0.00') || '%)'
             end pr_nombreventa,
             case cli_catfiscal
                when 1 then v_descuentos-- 'Inscripto'

                when 2 then v_descuentos + v_iva_descuentos + v_internos_descuentos-- 'Exento'

                when 3 then v_descuentos-- 'No inscripto'

                when 4 then v_descuentos + v_iva_descuentos + v_internos_descuentos-- 'Consumidor Final'

                when 5 then v_descuentos-- 'Extranjero'

                when 6 then v_descuentos + v_iva_descuentos + v_internos_descuentos-- 'Mono Tributo'

                when 7 then v_descuentos + v_iva_descuentos + v_internos_descuentos-- 'Extranjero Iva'

                when 8 then v_descuentos + v_iva_descuentos + v_internos_descuentos-- 'No responsable'

                when 9 then v_descuentos + v_iva_descuentos + v_internos_descuentos-- 'No Responsable exento'

                when 10 then v_descuentos + v_iva_descuentos + v_internos_descuentos-- 'No categorizado'

                when 11 then v_descuentos-- 'Inscripto M'

                else v_descuentos + v_iva_descuentos + v_internos_descuentos-- 'Sin categorizar'

             end precio,
             case cli_catfiscal
                when 1 then v_descuentos-- 'Inscripto'

                when 2 then v_descuentos + v_iva_descuentos + v_internos_descuentos-- 'Exento'

                when 3 then v_descuentos-- 'No inscripto'

                when 4 then v_descuentos + v_iva_descuentos + v_internos_descuentos-- 'Consumidor Final'

                when 5 then v_descuentos-- 'Extranjero'

                when 6 then v_descuentos + v_iva_descuentos + v_internos_descuentos-- 'Mono Tributo'

                when 7 then v_descuentos + v_iva_descuentos + v_internos_descuentos-- 'Extranjero Iva'

                when 8 then v_descuentos + v_iva_descuentos + v_internos_descuentos-- 'No responsable'

                when 9 then v_descuentos + v_iva_descuentos + v_internos_descuentos-- 'No Responsable exento'

                when 10 then v_descuentos + v_iva_descuentos + v_internos_descuentos-- 'No categorizado'

                when 11 then v_descuentos-- 'Inscripto M'

                else v_descuentos + v_iva_descuentos + v_internos_descuentos-- 'Sin categorizar'

             end importe,
             case cli_catfiscal
                when 1 then 1-- 'Inscripto'

                when 2 then 0-- 'Exento'

                when 3 then 1-- 'No inscripto'

                when 4 then 0-- 'Consumidor Final'

                when 5 then 0-- 'Extranjero'

                when 6 then 0-- 'Mono Tributo'

                when 7 then 1-- 'Extranjero Iva'

                when 8 then 0-- 'No responsable'

                when 9 then 0-- 'No Responsable exento'

                when 10 then 0-- 'No categorizado'

                when 11 then 1-- 'Inscripto M'

                else 0-- 'Sin categorizar'

             end bShowIva,
             v_remitos remitos,
             '' fvi_descrip
      from FacturaVenta
      join Documento
        on FacturaVenta.doc_id = Documento.doc_id
      join Cliente
        on FacturaVenta.cli_id = Cliente.cli_id
      join CondicionPago
        on FacturaVenta.cpg_id = CondicionPago.cpg_id
      join Moneda
        on FacturaVenta.mon_id = Moneda.mon_id
      left join Legajo
        on FacturaVenta.lgj_id = Legajo.lgj_id
      left join Provincia
        on FacturaVenta.pro_id_origen = Provincia.pro_id
      left join Leyenda
        on ley_codigo = 'fv_001'
      where FacturaVenta.fv_id = p_fv_id
        and fv_importedesc1 <> 0
      order by fvi_orden;

end;
$BODY$
  language plpgsql volatile
  cost 100;
alter function frFacturaVenta(integer)
  owner to postgres;
