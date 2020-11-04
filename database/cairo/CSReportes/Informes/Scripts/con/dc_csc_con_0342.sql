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
-- Function: dc_csc_con_0342()

-- drop function dc_csc_con_0342();

/*
select * from dc_csc_con_0342(1,'2020-01-01','2020-01-31','0','0',0::smallint);
fetch all from rtn;
*/

create or replace function dc_csc_con_0342
(
  in p_us_id        integer,
  in p_Fini         timestamp with time zone,
  in p_Ffin         timestamp with time zone,

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
    v_ram_id_empresa   int;

    v_pipe             varchar(2);
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
        tipo_doc                 varchar(3),
        fv_ptovta                varchar(5),
        fv_nrodoc                varchar(20),
        importenetogravado       varchar(15),
        alicuotaiva              varchar(4),
        impuestoliquidado        varchar(15)
    );

   drop table if exists tt_aux_register;
   create temporary table tt_aux_register (
        doct_id                  int,
        fv_id                    int,
        tipo_doc                 varchar(3),
        fv_ptovta                varchar(5),
        fv_nrodoc                varchar(20),
        importenetogravado       decimal(18,6),
        alicuotaiva              numeric(4,2),
        impuestoliquidado        decimal(18,6)
    );

   insert into tt_aux_register (
       doct_id,
       fv_id,
       tipo_doc,
       fv_ptovta,
       fv_nrodoc,
       importenetogravado,
       alicuotaiva,
       impuestoliquidado
   )

   select
       fv.doct_id,
       fv.fv_id,

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

       case
           when sum(fvi_ivari) <> 0
           then sum(fvi_neto)
           else 0
       end                        as importenetogravado,
       coalesce(fvi_ivariporc,0)  as alicuotaiva,
       coalesce(sum(fvi_ivari),0) as impuestoliquidado

   from facturaVenta fv
     left  join facturaVentaItem fvi on fv.fv_id = fvi.fv_id and fvi.fvi_ivari <> 0
     inner join cliente cli          on fv.cli_id = cli.cli_id
     inner join documento doc        on fv.doc_id = doc.doc_id
     left  join moneda               on moneda.mon_id = fv.mon_id

   where fv.est_id <> 7
     and (fv.fv_fechaiva >= p_Fini and fv.fv_fechaiva < p_Ffin)

     and   (doc.emp_id   = v_emp_id 	 or v_emp_id	=0)
     and   (doc.cico_id 	= v_cico_id 	or v_cico_id	=0)

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
         )

   group by fv.doct_id, fv.fv_id, fv.fv_nrodoc, doc.doct_id, fvi.fvi_ivariporc;

   insert into tt_final_register
   (
     doct_id,
     fv_id,
     tipo_doc,
     fv_ptovta,
     fv_nrodoc,
     importenetogravado,
     alicuotaiva,
     impuestoliquidado
   )

   select
       doct_id,
       fv_id,

       /*tipo comprobante*/
       coalesce(right(repeat('0', 3)  || tipo_doc, 3),     repeat('0', 3)),

       /*punto venta*/
       coalesce(right(repeat('0', 5)  || fv_ptovta, 5),    repeat('0', 5)),

       /*numero comprobante*/
       coalesce(right(repeat('0', 20) || fv_nrodoc, 20),   repeat('0', 20)),

       /*importenetogravado*/
       coalesce(right(repeat('0', 15) || replace(to_char(importenetogravado),'.',''), 15), repeat('0', 15)),

       /*alicuota iva*/
       case
         when alicuotaiva = 0 or impuestoliquidado = 0 then '0003'
         when alicuotaiva = 10.5 then '0004'
         when alicuotaiva = 21   then '0005'
         when alicuotaiva = 27   then '0006'
         else 'ERROR'
       end,

       /*impuesto liquidado*/
       coalesce(right(repeat('0', 15) || replace(to_char(impuestoliquidado),'.',''), 15), repeat('0', 15))

   from tt_aux_register;

   if p_debug = 0 then
      v_pipe := '';
   else
      v_pipe = 'v_';
   end if;
   
   if exists(select 1 from tt_final_register) then

      open rtn for

          select
             tipo_doc
             || v_pipe || fv_ptovta
             || v_pipe || fv_nrodoc
             || v_pipe || importenetogravado
             || v_pipe || alicuotaiva
             || v_pipe || impuestoliquidado

             as registro

          from tt_final_register
          order by fv_ptovta,fv_nrodoc;

   else

      open rtn for select 'no hay datos en el periodo' as registro;

   end if;

end;
$BODY$
  language plpgsql volatile
  cost 100;
alter function dc_csc_con_0342(integer, timestamp with time zone, timestamp with time zone, varchar, varchar, smallint)
  owner to postgres;