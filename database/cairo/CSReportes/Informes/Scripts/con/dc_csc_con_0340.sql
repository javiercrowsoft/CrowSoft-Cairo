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
-- Function: dc_csc_con_0340()

-- drop function dc_csc_con_0340();

/*
select * from dc_csc_con_0340(1,'2020-09-01','2020-09-30','0','0',0::smallint);
fetch all from rtn;
*/

create or replace function dc_csc_con_0340
(
  in p_us_id        integer,
  in p_Fini         date,
  in p_Ffin         date,

  in p_cico_id      varchar,
  in p_emp_id       varchar,
  in p_debug        smallint,
  out rtn refcursor
)
  returns refcursor as
$BODY$
declare
    v_clienteID       int;
    v_IsRaiz          smallint;

    v_cico_id                 int;
    v_ram_id_circuitocontable int;

    v_emp_id   		      int;
    v_ram_id_empresa          int;

    v_pipe            varchar(2);
begin
    
   rtn = 'rtn';

   p_Ffin := p_Ffin + '1 day'::interval;

   select * from sp_ArbConvertId(p_cico_id) into v_cico_id, v_ram_id_CircuitoContable;
   select * from sp_ArbConvertId(p_emp_id) into v_emp_id, v_ram_id_Empresa;

   select * from  sp_GetRptId() into v_clienteID;

   if v_ram_id_CircuitoContable <> 0 then
      --	exec sp_ArbGetGroups @ram_id_CircuitoContable, @clienteID, @@us_id
      select sp_ArbIsRaiz(v_ram_id_CircuitoContable) into v_IsRaiz;
      if v_IsRaiz = 0 then
         perform sp_ArbGetAllHojas(v_ram_id_CircuitoContable, v_clienteID);
      else
         v_ram_id_CircuitoContable := 0;
      end if;
   end if;

   if v_ram_id_Empresa <> 0 then
      --	exec sp_ArbGetGroups @ram_id_Empresa, @clienteID, @@us_id
      select sp_ArbIsRaiz(v_ram_id_Empresa) into v_IsRaiz;
      if v_IsRaiz = 0 then
         perform sp_ArbGetAllHojas(v_ram_id_Empresa, v_clienteID);
      else
         v_ram_id_Empresa := 0;
      end if;
   end if;

   drop table if exists tt_final_register;
   create temporary table tt_final_register (
        doct_id                  integer,
        fv_id                    integer,
        fv_fechaiva              varchar(8),
        tipo_doc                 varchar(03),
        fv_ptovta                varchar(5),
        fv_nrodoc                varchar(20),
        fv_nrodochasta           varchar(20),
        cliente_codigo           varchar(2),
        cliente_documento        varchar(20),
        cliente_nombre           varchar(30),
        importe_total            varchar(15),
        importe_neto_no_gravado  varchar(15),
        percep_no_categorizado   varchar(15),
        importe_op_exentas       varchar(15),
        percep_a_cuenta          varchar(15),
        percep_iibb              varchar(15),
        percep_imp_municipales   varchar(15),
        impuestos_internos       varchar(15),
        moneda                   varchar(3),
        tipo_cambio              varchar(10),
        alicuotas_ivas           varchar(1),
        codigo_operacion         varchar(1),
        otros_tributos           varchar(15),
        fecha_vto_pago           varchar(8)
    );

   drop table if exists tt_aux_register;
   create temporary table tt_aux_register (
        doct_id                  integer,
        fv_id                    integer,
        fv_fechaiva              varchar(8),
        tipo_doc                 varchar(03),
        fv_ptovta                varchar(5),
        fv_nrodoc                varchar(20),
        fv_nrodochasta           varchar(20),
        cliente_codigo           varchar(2),
        cliente_documento        varchar(20),
        cliente_nombre           varchar(30),
        importe_total            decimal(18,2),
        importe_neto_no_gravado  decimal(18,2),
        percep_no_categorizado   decimal(18,2),
        importe_op_exentas       decimal(18,2),
        percep_a_cuenta          decimal(18,2),
        percep_iibb              decimal(18,2),
        percep_imp_municipales   decimal(18,2),
        impuestos_internos       decimal(18,2),
        moneda                   varchar(3),
        tipo_cambio              numeric(10,6),
        alicuotas_ivas           numeric(1),
        codigo_operacion         varchar(1),
        otros_tributos           decimal(18,2),
        fecha_vto_pago           varchar(8)
    );

   insert into tt_aux_register (
        doct_id,
        fv_id,
        fv_fechaiva,
        tipo_doc,
        fv_ptovta,
        fv_nrodoc,
        fv_nrodochasta,
        cliente_codigo,
        cliente_documento,
        cliente_nombre,
        importe_total,
        importe_neto_no_gravado,
        percep_no_categorizado,
        importe_op_exentas,
        percep_a_cuenta,
        percep_iibb,
        percep_imp_municipales,
        impuestos_internos,
        moneda,
        tipo_cambio,
        alicuotas_ivas,
        codigo_operacion,
        otros_tributos,
        fecha_vto_pago
    )

   select
        fv.doct_id,
        fv.fv_id,
        coalesce(to_char(fv.fv_fechaiva, 'YYYY'), '0000')
         || right('0' || coalesce(to_char(fv.fv_fechaiva, 'MM'),'00'), 2)
         || right('0' || coalesce(to_char(fv.fv_fechaiva, 'DD'), '00'), 2) as fv_fechaiva,

        case
          when left(fv.fv_nrodoc, 1) = 'A' and doc.doct_id = 1 then '001'  -- F 'A'
          when left(fv.fv_nrodoc, 1) = 'A' and doc.doct_id = 9 then '002'  -- ND'A'
          when left(fv.fv_nrodoc, 1) = 'A' and doc.doct_id = 7 then '003'  -- NC'A'
          when left(fv.fv_nrodoc, 1) = 'B' and doc.doct_id = 1 then '006'  -- F 'B'
          when left(fv.fv_nrodoc, 1) = 'B' and doc.doct_id = 9 then '007'  -- ND'B'
          when left(fv.fv_nrodoc, 1) = 'B' and doc.doct_id = 7 then '008'  -- NC'B'
          when left(fv.fv_nrodoc, 1) = 'E' and doc.doct_id = 1 then '019'  -- F 'E'
          when left(fv.fv_nrodoc, 1) = 'E' and doc.doct_id = 9 then '020'  -- ND'E'
          when left(fv.fv_nrodoc, 1) = 'E' and doc.doct_id = 7 then '021'  -- NC'E'
          when left(fv.fv_nrodoc, 1) = 'M' and doc.doct_id = 1 then '051'  -- F 'E'
          when left(fv.fv_nrodoc, 1) = 'M' and doc.doct_id = 9 then '052'  -- ND'E'
          when left(fv.fv_nrodoc, 1) = 'M' and doc.doct_id = 7 then '053'  -- NC'E'
        end as tipo_doc,

        case when length(fv_nrodoc) = 15 then to_number(substring(fv.fv_nrodoc, 3, 4)) else to_number(substring(fv.fv_nrodoc, 3, 5)) end as fv_ptovta,
        case when length(fv_nrodoc) = 15 then to_number(substring(fv.fv_nrodoc, 8, 8)) else to_number(substring(fv.fv_nrodoc, 9, 8)) end as fv_nrodoc,
        case when length(fv_nrodoc) = 15 then to_number(substring(fv.fv_nrodoc, 8, 8)) else to_number(substring(fv.fv_nrodoc, 9, 8)) end as fv_nrodochasta,

        case
          when cli.cli_catfiscal = 4 and fv.fv_total >= 1000  then 96
          when cli.cli_catfiscal = 4                          then 99
          else                                                     80
        end as cliente_codigo,

        case
          when cli.cli_catfiscal = 4 and fv.fv_total < 1000 then '0'
          else                                                    replace(cli.cli_cuit,'-','')
        end as cliente_documento,

        substring(cli.cli_razonsocial, 1, 30) as cliente_nombre,
        fv.fv_total as importe_total,
        case
           when coalesce(
                  (select sum(fvi_ivari)
                   from facturaVentaItem fvi
                   where fvi.fv_id = fv.fv_id
                     and left(fv.fv_nrodoc, 1) not in('B','C'))
                  ,0) = 0
                and left(fv.fv_nrodoc, 1) not in('B','C')
           then
                 0
           else
                 coalesce(
                        (select sum(fvi_importe)
                        from facturaVentaItem fvi
                        where fvi.fv_id = fv.fv_id
                          and fvi.fvi_ivari = 0)
                        ,0)
        end as importe_neto_no_gravado,
        0 as percep_no_categorizado,

        case
          when coalesce(
                 (select sum(fvi_ivari)
                  from facturaVentaItem fvi
                  where fvi.fv_id = fv.fv_id
                    and left(fv.fv_nrodoc, 1) not in('B','C'))
                 ,0) = 0
               and left(fv.fv_nrodoc, 1) not in('B','C')
          then
            coalesce(
              (select sum(fvi_importe)
               from facturaVentaItem fvi
               where fvi.fvi_ivari = 0
                 and fvi.fv_id = fv.fv_id)
              ,0)
          else 0
        end as importe_op_exentas,
        0 as percep_a_cuenta,

        coalesce(
            (select sum(coalesce(fvperc_importe, 0))
             from facturaVentaPercepcion fvperc
             where fvperc.fv_id = fv.fv_id)
             ,0) as percep_iibb,

        0 as percep_imp_municipales,
        0 as impuestos_internos,

        case
          when mon_codigodgi1 = '01' then 'PES'
          when mon_codigodgi1 = '02' then 'DOL'
          else coalesce(mon_codigodgi1, 'PES')
        end as moneda,

        case
          when coalesce(mon_codigodgi1, 'PES') = 'PES' or mon_codigodgi1 = '01'
               then 1
          else (coalesce(fv.fv_cotizacion, 1))
        end as tipo_cambio,

        case
          when coalesce(
                 (select sum(coalesce(fvi_importe, 0))
                  from facturaVentaItem fvi
                  where coalesce(fvi_ivariporc,0) <> 0
                    and fvi.fv_id = fv.fv_id)
                 ,0) = 0
          then 1
          else
              coalesce(
              (select count(distinct fvi_ivariporc)
               from facturaVentaItem fvi
               where fvi.fv_id = fv.fv_id
                 and fvi.fvi_ivariporc <> 0)
              ,0)
        end as alicuotas_ivas,

        case
          when left(fv.fv_nrodoc, 1) = 'E' then 'X'
          when coalesce(
                 (select sum(fvi_ivari)
                  from facturaVentaItem fvi
                  where fvi.fv_id = fv.fv_id
                    and left(fv.fv_nrodoc, 1) not in('B','C'))
                 ,0) = 0
               and left(fv.fv_nrodoc, 1) not in('B','C')
          then 'E'
          else '0'
        end as codigo_operacion,

        0 as otros_tributos,

        case
         when left(fv.fv_nrodoc, 1) = 'E' then '00000000'
         when not exists (select 1 from facturaVentaDeuda fvd where fvd.fv_id = fv.fv_id) then
              (coalesce(to_char(fv.fv_fechaiva, 'YYYY'), '0000')
               || right('0' || coalesce(to_char(fv.fv_fechaiva, 'MM'),'00'), 2)
               || right('0' || coalesce(to_char(fv.fv_fechaiva, 'DD'), '00'), 2)
               )
         else (select 
               coalesce(to_char(fvd.fvd_fecha, 'YYYY'), '0000')
               || right('0' || coalesce(to_char(fvd.fvd_fecha, 'MM'),'00'), 2)
               || right('0' || coalesce(to_char(fvd.fvd_fecha, 'DD'), '00'), 2)
               from facturaVentaDeuda fvd where fvd.fv_id = fv.fv_id)
        end as fecha_vto_pago

   from facturaVenta fv
      inner join cliente cli      on fv.cli_id = cli.cli_id
      inner join documento doc    on fv.doc_id = doc.doc_id
      left  join moneda           on moneda.mon_id = fv.mon_id

   where fv.est_id <> 7
     and (fv.fv_fechaiva >= p_Fini and fv.fv_fechaiva < p_Ffin)

     and   (doc.emp_id   = v_emp_id 	or v_emp_id	=0)
     and   (doc.cico_id  = v_cico_id 	or v_cico_id	=0)

     and   (
          (exists(select rptarb_hojaid
                       from rptArbolRamaHoja
                       where
                            rptarb_cliente = v_clienteID
                       and  tbl_id = 1018
                       and  rptarb_hojaid = doc.emp_id
               )
                )
             or
           (v_ram_id_empresa = 0)
         )
     and   (
          (exists(select rptarb_hojaid
                       from rptArbolRamaHoja
                       where
                            rptarb_cliente = v_clienteID
                       and  tbl_id = 1016
                       and  rptarb_hojaid = doc.cico_id
               )
                )
             or
           (v_ram_id_circuitocontable = 0)
         );

   insert into tt_final_register
   (
      doct_id,
      fv_id,
      fv_fechaiva,
      tipo_doc,
      fv_ptovta,
      fv_nrodoc,
      fv_nrodochasta,
      cliente_codigo,
      cliente_documento,
      cliente_nombre,
      importe_total,
      importe_neto_no_gravado,
      percep_no_categorizado,
      importe_op_exentas,
      percep_a_cuenta,
      percep_iibb,
      percep_imp_municipales,
      impuestos_internos,
      moneda,
      tipo_cambio,
      alicuotas_ivas,
      codigo_operacion,
      otros_tributos,
      fecha_vto_pago
   )

   select
        doct_id,
        fv_id,
        fv_fechaiva,

        coalesce(right(repeat('0', 3)  || tipo_doc, 3),        repeat('0', 3)),
        coalesce(right(repeat('0', 5)  || fv_ptovta, 5),       repeat('0', 5)),
        coalesce(right(repeat('0', 20) || fv_nrodoc, 20),      repeat('0', 20)),
        coalesce(right(repeat('0', 20) || fv_nrodochasta, 20), repeat('0', 20)),

        cliente_codigo,

        case
          when cliente_codigo = '99' then '00000000000000000000'
          else coalesce(right(repeat('0', 20) || cliente_documento, 20), repeat('0', 20))
        end,

        case
          when cliente_codigo = '99' then 'VENTA GLOBAL DIARIA^^^^^^^^^^^^'
          else left(cliente_nombre || repeat ('^', (30 - length(left(cliente_nombre, 30)))), 30)
        end,

        coalesce(right(repeat('0', 15) || replace(to_char(importe_total),'.','')            , 15), repeat('0', 15)),
        coalesce(right(repeat('0', 15) || replace(to_char(importe_neto_no_gravado),'.','')  , 15), repeat('0', 15)),
        coalesce(right(repeat('0', 15) || replace(to_char(percep_no_categorizado),'.','')   , 15), repeat('0', 15)),
        coalesce(right(repeat('0', 15) || replace(to_char(importe_op_exentas),'.','')       , 15), repeat('0', 15)),
        coalesce(right(repeat('0', 15) || replace(to_char(percep_a_cuenta),'.','')          , 15), repeat('0', 15)),
        coalesce(right(repeat('0', 15) || replace(to_char(percep_iibb),'.','')              , 15), repeat('0', 15)),
        coalesce(right(repeat('0', 15) || replace(to_char(percep_imp_municipales),'.','')   , 15), repeat('0', 15)),
        coalesce(right(repeat('0', 15) || replace(to_char(impuestos_internos),'.','')       , 15), repeat('0', 15)),
        moneda,
        coalesce(right(repeat('0', 10) || replace(trim(to_char(tipo_cambio,'9999999999999.999999')),'.',''), 10), repeat('0', 10)),
        alicuotas_ivas,
        codigo_operacion,
        coalesce(right(repeat('0', 15) || replace(to_char(otros_tributos),'.','')           , 15), repeat('0', 15)),
        fecha_vto_pago

   from tt_aux_register;

   if p_debug = 0 then
      v_pipe := '';
   else
      v_pipe = 'v_';
   end if;

   if exists(select 1 from tt_final_register) then

      open rtn for

          select
             fv_fechaiva
             || v_pipe || tipo_doc
             || v_pipe || fv_ptovta
             || v_pipe || fv_nrodoc
             || v_pipe || fv_nrodochasta
             || v_pipe || cliente_codigo
             || v_pipe || cliente_documento
             || v_pipe || replace(replace(replace(replace(replace(replace(cliente_nombre,'&','-'),'?','-'),'|','-'),'\','-'),'/','-'),'^',' ')
             || v_pipe || importe_total
             || v_pipe || importe_neto_no_gravado
             || v_pipe || percep_no_categorizado
             || v_pipe || importe_op_exentas
             || v_pipe || percep_a_cuenta
             || v_pipe || percep_iibb
             || v_pipe || percep_imp_municipales
             || v_pipe || impuestos_internos
             || v_pipe || moneda
             || v_pipe || tipo_cambio
             || v_pipe || alicuotas_ivas
             || v_pipe || codigo_operacion
             || v_pipe || otros_tributos
             || v_pipe || fecha_vto_pago

             as registro

          from tt_final_register
          order by fv_nrodoc;

   else

      open rtn for select 'no hay datos en el periodo' as registro;

   end if;

end;
$BODY$
  language plpgsql volatile
  cost 100;
alter function dc_csc_con_0340(integer, date, date, varchar, varchar, smallint)
  owner to postgres;