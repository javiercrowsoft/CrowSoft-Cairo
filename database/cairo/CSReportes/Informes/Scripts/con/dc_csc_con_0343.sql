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
-- Function: dc_csc_con_0343()

-- drop function dc_csc_con_0343();

/*
select * from dc_csc_con_0343(1,'2020-01-01','2020-01-31','0','0',0::smallint);
fetch all from rtn;
*/

create or replace function dc_csc_con_0343
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

    v_emp_id   		             int;
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

   if exists(
            select 1
            from facturaCompra fc
            inner join proveedor prov   on fc.prov_id = prov.prov_id
            inner join documento doc    on fc.doc_id = doc.doc_id
            left  join moneda           on moneda.mon_id = fc.mon_id

            where fc.est_id <> 7
            and (fc.fc_fechaiva >= p_Fini and fc.fc_fechaiva < p_Ffin)

            and   (doc.emp_id   = v_emp_id 	 or v_emp_id	 =0)
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
            and length(fc_nrodoc) not in(15,16)
   )
   then
      return;
   end if;

   drop table if exists tt_final_register;
   create temporary table tt_final_register (
        doct_id                  int,
        fc_id                    int,
        tipo_doc                 varchar(3),
        fc_ptovta                varchar(5),
        fc_nrodoc                varchar(20),
        codigodoproveedor        varchar(2),
        proveedor_doc            varchar(20),
        importenetogravado       varchar(15),
        alicuotaiva              varchar(4),
        impuestoliquidado        varchar(15)
    );

   drop table if exists tt_aux_register;
   create temporary table tt_aux_register (
        doct_id                  int,
        fc_id                    int,
        tipo_doc                 varchar(3),
        fc_ptovta                varchar(5),
        fc_nrodoc                varchar(20),
        codigodoproveedor        varchar(2),
        proveedor_doc            varchar(20),
        importenetogravado       decimal(18,2),
        alicuotaiva              numeric(4,2),
        impuestoliquidado        decimal(18,2)
    );

   -- para mostrar en la grilla sumarizable

   insert into tt_aux_register (
        doct_id,
        fc_id,
        tipo_doc,
        fc_ptovta,
        fc_nrodoc,
        codigodoproveedor,
        proveedor_doc,
        importenetogravado,
        alicuotaiva,
        impuestoliquidado
   )

   select
        fc.doct_id,
        fc.fc_id,

        case
          when left(fc.fc_nrodoc, 1) = 'A' and doc.doct_id = 2  then '001'  -- F 'A'
          when left(fc.fc_nrodoc, 1) = 'A' and doc.doct_id = 10 then '002'  -- ND'A'
          when left(fc.fc_nrodoc, 1) = 'A' and doc.doct_id = 8  then '003'  -- NC'A'
          when left(fc.fc_nrodoc, 1) = 'B' and doc.doct_id = 2  then '006'  -- F 'B'
          when left(fc.fc_nrodoc, 1) = 'B' and doc.doct_id = 10 then '007'  -- ND'B'
          when left(fc.fc_nrodoc, 1) = 'B' and doc.doct_id = 8  then '008'  -- NC'B'
          when left(fc.fc_nrodoc, 1) = 'C' and doc.doct_id = 2  then '011'  -- F 'C'
          when left(fc.fc_nrodoc, 1) = 'C' and doc.doct_id = 10 then '012'  -- ND'C'
          when left(fc.fc_nrodoc, 1) = 'C' and doc.doct_id = 8  then '013'  -- NC'C'
          when left(fc.fc_nrodoc, 1) = 'E' and doc.doct_id = 2  then '019'  -- F 'E'
          when left(fc.fc_nrodoc, 1) = 'E' and doc.doct_id = 10 then '020'  -- ND'E'
          when left(fc.fc_nrodoc, 1) = 'E' and doc.doct_id = 8  then '021'  -- NC'E'
          when left(fc.fc_nrodoc, 1) = 'M' and doc.doct_id = 2  then '051'  -- F 'E'
          when left(fc.fc_nrodoc, 1) = 'M' and doc.doct_id = 10 then '052'  -- ND'E'
          when left(fc.fc_nrodoc, 1) = 'M' and doc.doct_id = 8  then '053'  -- NC'E'
        end as tipo_doc,

        case when length(fc_nrodoc) = 15 then to_number(substring(fc.fc_nrodoc, 3, 4)) else to_number(substring(fc.fc_nrodoc, 3, 5)) end as fc_ptovta,
        case when length(fc_nrodoc) = 15 then to_number(substring(fc.fc_nrodoc, 8, 8)) else to_number(substring(fc.fc_nrodoc, 9, 8)) end as fc_nrodoc,

        80 as codigodoproveedor,
        replace(prov.prov_cuit,'-','') as proveedor_doc,

        case when sum(fci_ivari) <> 0 then sum(fci_neto) else 0 end as importenetogravado,
        
        coalesce(fci_ivariporc,0)    as alicuotaiva,
        coalesce(sum(fci_ivari),0)   as impuestoliquidado

   from facturaCompra fc
      left  join facturaCompraItem fci on fc.fc_id = fci.fc_id and fci.fci_ivariporc <> 0 and fci.fci_ivari <> 0
      inner join proveedor prov        on fc.prov_id = prov.prov_id
      inner join documento doc         on fc.doc_id = doc.doc_id
      left  join moneda                on moneda.mon_id = fc.mon_id

   where fc.est_id <> 7
      and (fc.fc_fechaiva >= p_Fini and fc.fc_fechaiva < p_Ffin)

      and left(fc.fc_nrodoc, 1) not in('B','C')

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

   group by fc.doct_id, fc.fc_id, fc.fc_nrodoc, doc.doct_id, prov.prov_cuit, fci_ivariporc;

   insert into tt_final_register
    (
      doct_id,
      fc_id,
      tipo_doc,
      fc_ptovta,
      fc_nrodoc,
      codigodoproveedor,
      proveedor_doc,
      importenetogravado,
      alicuotaiva,
      impuestoliquidado
    )

   select
        doct_id,
        fc_id,

        /*tipo comprobante*/     coalesce(right(repeat('0', 3)  || tipo_doc,  3),    repeat('0', 3)),
        /*punto venta*/          coalesce(right(repeat('0', 5)  || fc_ptovta, 5),    repeat('0', 5)),
        /*numero comprobante*/   coalesce(right(repeat('0', 20) || fc_nrodoc, 20),   repeat('0', 20)),

        codigodoproveedor,

        case
          when codigodoproveedor = '99' then '00000000000000000000'
          else coalesce(right(repeat('0', 20) || proveedor_doc, 20), repeat('0', 20))
        end,

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
      v_pipe := 'v_';
   end if;

   if exists(select 1 from tt_final_register) then

       open rtn for

           select
              tipo_doc
              || v_pipe || fc_ptovta
              || v_pipe || fc_nrodoc
              || v_pipe || codigodoproveedor
              || v_pipe || proveedor_doc
              || v_pipe || importenetogravado
              || v_pipe || alicuotaiva
              || v_pipe || impuestoliquidado

              as registro

           from tt_final_register
           order by codigodoproveedor,fc_ptovta,fc_nrodoc;

   else

       open rtn for select 'no hay datos en el periodo' as registro;

   end if;

end;
$BODY$
  language plpgsql volatile
  cost 100;
alter function dc_csc_con_0343(integer, date, date, varchar, varchar, smallint)
  owner to postgres;