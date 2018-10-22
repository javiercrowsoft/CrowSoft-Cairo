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
-- Function: frFacturaVentaFE(integer)

-- drop function frFacturaVentaFE(integer);

/*

select * from frFacturaVentaFE(1);
fetch all from rtn;

*/


create or replace function frFacturaVentaFE
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

   v_perc_ibb decimal(18,6);
   v_perc_ibb_porc decimal(18,2);

   v_perc_iva decimal(18,6);
   v_perc_iva_porc decimal(18,2);

   v_iva21 decimal(18,6);
   v_iva105 decimal(18,6);
   
   v_cod_barra varchar(255);

   v_error_msg_aux varchar(5000);
begin

   rtn := 'rtn';

   -------------------------------------------------------------------------------------------------------------
   --
   -- validaciones factura electronica
   --
   -------------------------------------------------------------------------------------------------------------
   if exists(
        select 1
        from facturaVenta fv
        join documento doc
          on fv.doc_id = doc.doc_id
        where fv_id = p_fv_id
         and fv_cae = ''
         and doc_esfacturaelectronica <> 0
        )
   then

         v_error_msg_aux := '@@ERROR_SP:Esta factura no posee CAE. No sera posible imprimir la factura hasta que no se obtenga el CAE.';
         raise exception '@@ERROR_SP: %', v_error_msg_aux;

   end if;

   -------------------------------------------------------------------------------------------------------------
   --
   -- percepciones
   --
   -------------------------------------------------------------------------------------------------------------

   select fvperc_importe,
          fvperc_porcentaje
     into v_perc_ibb,
          v_perc_ibb_porc
   from FacturaVentaPercepcion
   where fv_id = p_fv_id
      and perc_id in (select perc_id from Percepcion where perct_id = 6);

   select fvperc_importe,
          fvperc_porcentaje
     into v_perc_iva,
          v_perc_iva_porc
   from FacturaVentaPercepcion
   where fv_id = p_fv_id
      and perc_id in (select perc_id from Percepcion where perct_id = 1);

   -------------------------------------------------------------------------------------------------------------
   --
   -- codigo de barras
   --
   -------------------------------------------------------------------------------------------------------------

   select replace(emp_cuit,'-','')
          || case
              when fv.doct_id = 1 and substring(fv_nrodoc,1,1) = 'A' then '01'
              when fv.doct_id = 1 and substring(fv_nrodoc,1,1) = 'B' then '06'
              when fv.doct_id = 1 and substring(fv_nrodoc,1,1) = 'E' then '19'
              when fv.doct_id = 7 and substring(fv_nrodoc,1,1) = 'A' then '03'
              when fv.doct_id = 7 and substring(fv_nrodoc,1,1) = 'B' then '08'
              when fv.doct_id = 7 and substring(fv_nrodoc,1,1) = 'E' then '21'
              when fv.doct_id = 9 and substring(fv_nrodoc,1,1) = 'A' then '02'
              when fv.doct_id = 9 and substring(fv_nrodoc,1,1) = 'B' then '07'
              when fv.doct_id = 9 and substring(fv_nrodoc,1,1) = 'E' then '20'
          end
          || right('0000' || FEGetPuntoVta(fv.fv_id)::varchar, 4)
          || fv_cae
          || fv_cae_vto
     into v_cod_barra
   from facturaVenta fv 
   join empresa emp 
     on fv.emp_id = emp.emp_id
   where fv.fv_id = p_fv_id;

   v_cod_barra := v_cod_barra || FEGetDigitoVerificador(v_cod_barra)::varchar;

   select sum(fvi_ivari) into v_iva21 
   from facturaventaitem 
   where fv_id = p_fv_id 
     and fvi_ivariporc = 21;
     
   select sum(fvi_ivari) into v_iva105 
   from facturaventaitem 
   where fv_id = p_fv_id 
     and fvi_ivariporc = 10.5;

   open rtn for

   select
          fv.doct_id,
          fv.fv_id,
          -fv.fv_importedesc1 as fv_importedesc1,
          -fv.fv_importedesc2 as fv_importedesc2,
          fv.fv_ivari,
          fv.fv_neto,
          fv.fv_total,
          fv.fv_nrodoc,
          fv_cotizacion,
          fv_descrip,
          fv_fecha,
          fvi_importeorigen,
          fvi_cantidad,
          fvi_ivari,
          fvi_ivarni,
          fvi_importe,
          fvi_precio,
          fvi_neto,
          fvi_importeorigen,

          mon_signo,

          cue_nombre,
          doc_nombre,
          ccos_nombre,
          cli_nombre,
          cli_razonsocial,
          cpg_nombre,
          cli_cuit,

          case cli_catfiscal
              when 1  then 'Inscripto'
              when 2  then 'Exento'
              when 3  then 'No inscripto'
              when 4  then 'Consumidor Final'
              when 5  then 'Extranjero'
              when 6  then 'Mono Tributo'
              when 7  then 'Extranjero Iva'
              when 8  then 'No responsable'
              when 9  then 'No Responsable exento'
              when 10 then 'No categorizado'
              when 11 then 'Inscripto M'
              else         'Sin categorizar'
          end as cat_fisctal,

          case cli_catfiscal
              when 1 then 'X'
              else ''
          end as inscripto,

          case cli_catfiscal
              when 2 then 'X'
              else ''
          end as exento,

          case cli_catfiscal
              when 3 then 'X'
              else ''
          end as noinscripto,

          case cli_catfiscal
              when 4 then 'X'
              else ''
          end as consumidorfinal,

          case cli_catfiscal
              when 5 then 'X'
              else ''
          end as extranjero,

          case cli_catfiscal
              when 6 then 'X'
              else ''
          end as monotributo,

          case cli_catfiscal
              when 7 then 'X'
              else ''
          end as extranjeroiva,

          case cli_catfiscal
              when 8 then 'X'
              else ''
          end as noresponsable,

          case cli_catfiscal
              when 9 then 'X'
              else ''
          end as norespexento,

          case cli_catfiscal
              when 10 then 'X'
              else ''
          end as nocategorizado,

          case
              when fvi_importe <> 0 and fvi_importeorigen <> 0 then fvi_importeorigen / fvi_importe
              else  1
          end as coef,

          cli_calle as calle,
          cli_callenumero || ' '
                          || case
                                 when cli_piso <> '' then '- piso ' || cli_piso
                                 else ''
                             end
                          || ' '
                          || cli_depto  as direccion,

          cli_localidad   || ' '
                          || case
                                 when cli_codpostal <> '' then '-(' || cli_codpostal || ')'
                                 else ''
                             end
              as cli_localidad,
          lgj_codigo,
          pr_nombreventa,

          case cli_catfiscal
              when 1 then       fvi_precio -- 'Inscripto'
              when 2 then       fvi_precio + (fvi_precio * fvi_ivariporc/100) -- 'Exento'
              when 3 then       fvi_precio -- 'No inscripto'
              when 4 then       fvi_precio + (fvi_precio * fvi_ivariporc/100) -- 'Consumidor Final' sp_col facturaventaitem
              when 5 then       fvi_precio -- 'Extranjero'
              when 6 then       fvi_precio + (fvi_precio * fvi_ivariporc/100) -- 'Mono Tributo'
              when 7 then       fvi_precio + (fvi_precio * fvi_ivariporc/100) -- 'Extranjero Iva'
              when 8 then       fvi_precio + (fvi_precio * fvi_ivariporc/100) -- 'No responsable'
              when 9 then       fvi_precio + (fvi_precio * fvi_ivariporc/100) -- 'No Responsable exento'
              when 10 then      fvi_precio + (fvi_precio * fvi_ivariporc/100) -- 'No categorizado'
              else              fvi_precio + (fvi_precio * fvi_ivariporc/100) -- 'Sin categorizar'
          end as precio,

          case cli_catfiscal
              when 1 then       fvi_neto     -- 'Inscripto'
              when 2 then       fvi_importe  -- 'Exento'
              when 3 then       fvi_neto     -- 'No inscripto'
              when 4 then       fvi_importe  -- 'Consumidor Final' sp_col facturaventaitem
              when 5 then       fvi_neto     -- 'Extranjero'
              when 6 then       fvi_importe  -- 'Mono Tributo'
              when 7 then       fvi_importe  -- 'Extranjero Iva'
              when 8 then       fvi_importe  -- 'No responsable'
              when 9 then       fvi_importe  -- 'No Responsable exento'
              when 10 then      fvi_importe  -- 'No categorizado'
              else              fvi_importe  -- 'Sin categorizar'
          end as importe,

          case cli_catfiscal
              when 1 then       1 -- 'Inscripto'
              when 2 then       0 -- 'Exento'
              when 3 then       1 -- 'No inscripto'
              when 4 then       0 -- 'Consumidor Final' sp_col facturaventaitem
              when 5 then       1 -- 'Extranjero'
              when 6 then       0 -- 'Mono Tributo'
              when 7 then       0 -- 'Extranjero Iva'
              when 8 then       0 -- 'No responsable'
              when 9 then       0 -- 'No Responsable exento'
              when 10 then      0 -- 'No categorizado'
              else              0 -- 'Sin categorizar'
          end as bShowIva,

          fv_cae as cae,
          fv_cae_vto as cae_vto,

          substring(fv_nrodoc,3,100) as cae_nrodoc,
          substring(fv_nrodoc,1,1) as cae_letra,

          /*
          FACTURA A:   Cod 01
          FACTURA B:   Cod 06
          NOTA DEB A:  Cod 02
          NOTA DEB B:  Cod 07
          NOTA CRED A: Cod 03
          NOTA CRED B: Cod 08
          */
          
          case
              when fv.doct_id = 1 and substring(fv_nrodoc,1,1) = 'A' then 'Cod 01'
              when fv.doct_id = 1 and substring(fv_nrodoc,1,1) = 'B' then 'Cod 06'
              when fv.doct_id = 7 and substring(fv_nrodoc,1,1) = 'A' then 'Cod 03'
              when fv.doct_id = 7 and substring(fv_nrodoc,1,1) = 'B' then 'Cod 08'
              when fv.doct_id = 9 and substring(fv_nrodoc,1,1) = 'A' then 'Cod 02'
              when fv.doct_id = 9 and substring(fv_nrodoc,1,1) = 'B' then 'Cod 07'
          end as codigo_letra,

          v_cod_barra as cod_barra,
          
          coalesce(v_iva21,0)  as iva21,
          coalesce(v_iva105,0) as iva105,
          
          coalesce(v_perc_ibb,0) as perc_ibb,
          
          case 
              when coalesce(v_perc_ibb_porc,0) <> 0 then 
                   'P.IIBB CF ' || v_perc_ibb_porc::varchar || '%'
              else ''
          end as perc_ibb_porc,
          
          coalesce(v_perc_iva,0) as perc_iva,
          
          case 
              when coalesce(v_perc_iva_porc,0) <> 0 then 
                   'P. IVA RG 2126 ' || v_perc_iva_porc::varchar || '%'
              else ''
          end as perc_iva_porc

   from facturaVenta fv
   join facturaVentaItem fvi
     on fv.fv_id = fvi.fv_id
   join cuenta cue
     on fvi.cue_id = cue.cue_id
   join documento doc
     on fv.doc_id = doc.doc_id
   join cliente cli
     on fv.cli_id = cli.cli_id
   join condicionPago cpg
     on fv.cpg_id = cpg.cpg_id
   join producto pr
     on fvi.pr_id = pr.pr_id
   join moneda mon
     on fv.mon_id = mon.mon_id
   left join legajo lgj
     on fv.lgj_id = lgj.lgj_id
   left join centroCosto ccos
     on fvi.ccos_id = ccos.ccos_id
 
   where fv.fv_id = p_fv_id
  
   order by fvi_orden;

end;
$BODY$
  language plpgsql volatile
  cost 100;
alter function frFacturaVentaFE(integer)
  owner to postgres;
