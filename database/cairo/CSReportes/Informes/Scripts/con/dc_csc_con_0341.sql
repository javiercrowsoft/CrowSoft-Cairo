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
-- Function: dc_csc_con_0341()

-- drop function dc_csc_con_0341(integer, timestamp with time zone, timestamp with time zone, varchar, varchar, varchar, smallint);

/*
select * from dc_csc_con_0341(1,'2020-01-01','2020-01-31','0','0',0::smallint);
fetch all from rtn;
*/

create or replace function dc_csc_con_0341
(
  in p_us_id        integer,
  in p_Fini         timestamp with time zone,
  in p_Ffin         timestamp with time zone,

  in p_cico_id      varchar,
  in p_emp_id       varchar,
  in p_debug        integer,
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

	-- controles sobre el numero

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

      open rtn for

         select fc_id, fc.doct_id, fc_nrodoc, fc_fecha, fc_fechaiva, prov_nombre, '' as dummy_col
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
         and length(fc_nrodoc) <> 15;

      return;

	  end if;

   drop table if exists tt_final_register;
   create temporary table tt_final_register (
       doct_id                  integer,
       fc_id                    integer,
       fc_fechaiva              varchar(8),
       tipo_doc                 varchar(03),
       fc_ptovta                varchar(5),
       fc_nrodoc                varchar(20),
       despachoimportacion      varchar(16),  --*
       codigodoproveedor        varchar(2),
       proveedor_doc            varchar(20),
       proveedor_nombre         varchar(30),
       importe_total            varchar(15),
       importe_neto_no_gravado  varchar(15),
       importe_op_exentas       varchar(15),
       percep_a_cuenta          varchar(15),
       percepcionesotros        varchar(15),  --*
       percep_iibb              varchar(15),
       percep_imp_municipales   varchar(15),
       impuestos_internos       varchar(15),
       moneda                   varchar(3),
       tipo_cambio              varchar(10),
       alicuotas_ivas           varchar(1),
       codigo_operacion         varchar(1),
       creditofiscal            varchar(15),  --*
       otros_tributos           varchar(15),
       cuitemisor               varchar(11),  --*
       nombreemisor             varchar(30),  --*
       ivacomision              varchar(15)   --*
   );

   drop table if exists tt_aux_register;
   create temporary table tt_aux_register (
       doct_id                   integer,
       fc_id                     integer,
       fc_fechaiva               varchar(8),
       tipo_doc                  varchar(03),
       fc_ptovta                 varchar(5),
       fc_nrodoc                 varchar(20),
       despachoimportacion       varchar(16),  --*
       codigodoproveedor         varchar(2),
       proveedor_doc             varchar(20),
       proveedor_nombre          varchar(30),
       importe_total             decimal(18,2),
       importe_neto_no_gravado   decimal(18,2),
       importe_op_exentas        decimal(18,2),
       percep_a_cuenta           decimal(18,2),
       percepcionesotros         decimal(18,2),  --*
       percep_iibb               decimal(18,2),
       percep_imp_municipales    decimal(18,2),
       impuestos_internos        decimal(18,2),
       moneda                    varchar(3),
       tipo_cambio               numeric(10,6),
       alicuotas_ivas            numeric(1),
       codigo_operacion          varchar(1),
       otros_tributos            decimal(18,2),
       creditofiscal             decimal(18,2)
   );

   -- para mostrar en la grilla sumarizable

   insert into tt_aux_register (
       doct_id,
       fc_id,
       fc_fechaiva,
       tipo_doc,
       fc_ptovta,
       fc_nrodoc,
       despachoimportacion,
       codigodoproveedor,
       proveedor_doc,
       proveedor_nombre,
       importe_total,
       importe_neto_no_gravado,
       importe_op_exentas,
       percep_a_cuenta,
       percepcionesotros,
       percep_iibb,
       percep_imp_municipales,
       impuestos_internos,
       moneda,
       tipo_cambio,
       alicuotas_ivas,
       codigo_operacion,
       otros_tributos,
       creditofiscal
   )

   select
       fc.doct_id,
       fc.fc_id,
       coalesce(to_char(fc.fc_fechaiva, 'YYYY'), '0000')
                || right('0' || coalesce(to_char(fc.fc_fechaiva, 'MM'),'00'), 2)
                || right('0' || coalesce(to_char(fc.fc_fechaiva, 'DD'), '00'), 2) as fc_fechaiva,

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

       '' as despachoimportacion,

       case
         when prov.prov_catfiscal = 4 and fc.fc_total >= 1000 then 96
         when prov.prov_catfiscal = 4                         then 99
         else                                                      80
       end as codigodoproveedor,

       case
         when prov.prov_catfiscal = 4 and fc.fc_total < 1000 then ''
         else                                                     replace(prov.prov_cuit,'-','')
       end as proveedor_doc,

       substring(prov.prov_razonsocial, 1, 30) as proveedor_nombre,

       abs(fc.fc_total) as importe_total,
       case
         when coalesce(
                (select sum(coalesce(fci_ivari, 0))
                 from facturaCompraItem fci
                 where coalesce(fci_ivariporc,0) <> 0
                   and fci.fc_id = fc.fc_id
                   and left(fc.fc_nrodoc, 1) not in('B','C'))
                ,0) = 0
              and left(fc.fc_nrodoc, 1) not in('B','C')
         then 0
         else
            coalesce(
               abs((select sum(fci_neto)
                    from facturaCompraItem fci
                    where fc.fc_id = fci.fc_id
                    and (fci.fci_ivariporc = 0 or (fci.fci_ivariporc <> 0 and fci.fci_ivari = 0))
                    and left(fc.fc_nrodoc, 1) not in('B','C')))
            ,0)
            + fc_totalotros
       end as importe_neto_no_gravado,

       case
         when coalesce(
                (select sum(coalesce(fci_ivari, 0))
                 from facturaCompraItem fci
                 where coalesce(fci_ivariporc,0) <> 0
                   and fci.fc_id = fc.fc_id
                   and left(fc.fc_nrodoc, 1) not in('B','C'))
                ,0) = 0
              and left(fc.fc_nrodoc, 1) not in('B','C')
         then coalesce(
                     (select sum(coalesce(fci_neto, 0))
                      from facturaCompraItem fci
                      where coalesce(fci_ivari,0) = 0
                        and fci.fc_id = fc.fc_id
                        and left(fc.fc_nrodoc, 1) not in('B','C'))
                     ,0) + fc_totalotros
         else 0
       end importe_op_exentas,

       0 as percep_a_cuenta,
       0 as percepcionesotros,

       coalesce(
         (select sum(coalesce(fcperc_importe, 0))
          from facturaCompraPercepcion fcperc
          where fcperc.fc_id = fc.fc_id)
          ,0) as percep_iibb,

       0 as percep_imp_municipales,
       0 as impuestos_internos,

       case
         when mon_codigodgi1 = '01' then 'PES'
         when mon_codigodgi1 = '02' then 'DOL'
         else coalesce(mon_codigodgi1, 'PES')
       end moneda,

       case
         when coalesce(mon_codigodgi1, 'PES') = 'PES' or mon_codigodgi1 = '01'
              then 1
         else (coalesce(fc.fc_cotizacion, 1))
       end tipo_cambio,

       case
         when coalesce(
                  (select sum(coalesce(fci_ivari, 0))
                   from facturaCompraItem fci
                   where coalesce(fci_ivariporc,0) <> 0
                     and fci.fc_id = fc.fc_id
                     and left(fc.fc_nrodoc, 1) not in('B','C'))
                  ,0) = 0
                and left(fc.fc_nrodoc, 1) not in('B','C')
           then 1
         else
           (select count(distinct fci_ivariporc)
            from facturaCompraItem fci
            where fci.fc_id = fc.fc_id
              and fci.fci_ivariporc <> 0)
       end as alicuotas_ivas,

       case
         when left(fc.fc_nrodoc,1) = 'E' then 'X'
         when coalesce(
                (select sum(coalesce(fci_ivari, 0))
                 from facturaCompraItem fci
                 where coalesce(fci_ivariporc,0) <> 0
                   and fci.fc_id = fc.fc_id
                   and left(fc.fc_nrodoc, 1) not in('B','C'))
                ,0) = 0
              and left(fc.fc_nrodoc, 1) not in('B','C')
         then 'E'
         else '0'
       end as codigo_operacion,

       0 as otros_tributos,
       fc_ivari as creditofiscal

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
         );

   insert into tt_final_register
   (
     doct_id,
     fc_id,
     fc_fechaiva,
     tipo_doc,
     fc_ptovta,
     fc_nrodoc,
     despachoimportacion,         --*
     codigodoproveedor,
     proveedor_doc,
     proveedor_nombre,
     importe_total,
     importe_neto_no_gravado,
     importe_op_exentas,
     percep_a_cuenta,
     percepcionesotros,           --*
     percep_iibb,
     percep_imp_municipales,
     impuestos_internos,
     moneda,
     tipo_cambio,
     alicuotas_ivas,
     codigo_operacion,
     creditofiscal,               --*
     otros_tributos,
     cuitemisor,                  --*
     nombreemisor,                --*
     ivacomision                  --*
   )

   select
       doct_id,
       fc_id,
       fc_fechaiva,

       /*tipo comprobante*/     coalesce(right(repeat('0', 3)  || tipo_doc, 3),             repeat('0', 3)),
       /*punto venta*/          coalesce(right(repeat('0', 5)  || fc_ptovta, 5),            repeat('0', 5)),
       /*numero comprobante*/   coalesce(right(repeat('0', 20) || fc_nrodoc, 20),           repeat('0', 20)),
       /*despacho importacion*/ coalesce(right(repeat('^', 16) || despachoimportacion, 16), repeat('^', 16)),

       codigodoproveedor,

       case
         when codigodoproveedor = '99' then '00000000000000000000'
         else coalesce(right(repeat('0', 20) || proveedor_doc, 20), repeat('0', 20))
       end,

       case
         when codigodoproveedor = '99' then 'VENTA GLOBAL DIARIA^^^^^^^^^^^^'
         else left(proveedor_nombre || repeat ('^', (30 - length(left(proveedor_nombre, 30)))), 30)
       end,

       /*importe total opera*/
       coalesce(right(repeat('0', 15) || replace(to_char(importe_total),'.','')           , 15), repeat('0', 15)),
       /*importe no neto gravado*/
       coalesce(right(repeat('0', 15) || replace(to_char(importe_neto_no_gravado),'.','') , 15), repeat('0', 15)),
       /*importe oper exentas*/
       coalesce(right(repeat('0', 15) || replace(to_char(importe_op_exentas),'.','')      , 15), repeat('0', 15)),
       /*percepciones a cuenta*/
       coalesce(right(repeat('0', 15) || replace(to_char(percep_a_cuenta),'.','')         , 15), repeat('0', 15)),
       /*percepciones otros*/
       coalesce(right(repeat('0', 15) || replace(to_char(percepcionesotros),'.','')       , 15), repeat('0', 15)),
       /*percepciones iibb*/
       coalesce(right(repeat('0', 15) || replace(to_char(percep_iibb),'.','')             , 15), repeat('0', 15)),
       /*percep imp municipales*/
       coalesce(right(repeat('0', 15) || replace(to_char(percep_imp_municipales),'.','')  , 15), repeat('0', 15)),
       /*impuestos internos*/
       coalesce(right(repeat('0', 15) || replace(to_char(impuestos_internos),'.','')      , 15), repeat('0', 15)),
       moneda,
       /*tipo_cambio*/
       coalesce(right(repeat('0', 10) || replace(trim(to_char(tipo_cambio,'9999999999999.999999')),'.',''), 10), repeat('0', 10)),
       alicuotas_ivas,
       codigo_operacion,
       /*credito fiscal*/
       coalesce(right(repeat('0', 15) || replace(to_char(creditofiscal),'.','')           , 15), repeat('0', 15)),
       /*otros tributos*/
       coalesce(right(repeat('0', 15) || replace(to_char(otros_tributos),'.','')          , 15), repeat('0', 15)),
       /*cuitemisor*/
       repeat('0', 11),
       /*nombreemisor*/
       repeat('^', 30),
       /*ivacomision*/
       repeat('0', 15)

   from tt_aux_register
   order by doct_id, fc_id;

   if p_debug = 0 then
      v_pipe := '';
   else
      v_pipe = ' | ';
   end if;

   if exists(select 1 from tt_final_register) then

      open rtn for

          select
              fc_fechaiva
              || v_pipe ||  tipo_doc
              || v_pipe ||  fc_ptovta
              || v_pipe ||  fc_nrodoc
              || v_pipe ||  replace(despachoimportacion,'^',' ')
              || v_pipe ||  codigodoproveedor
              || v_pipe ||  proveedor_doc
              || v_pipe ||  replace(replace(replace(replace(replace(replace(proveedor_nombre,'&','-'),'?','-'),'|','-'),'\','-'),'/','-'),'^',' ')
              || v_pipe ||  importe_total
              || v_pipe ||  importe_neto_no_gravado
              || v_pipe ||  importe_op_exentas
              || v_pipe ||  percep_a_cuenta
              || v_pipe ||  percepcionesotros
              || v_pipe ||  percep_iibb
              || v_pipe ||  percep_imp_municipales
              || v_pipe ||  impuestos_internos
              || v_pipe ||  moneda
              || v_pipe ||  tipo_cambio
              || v_pipe ||  alicuotas_ivas
              || v_pipe ||  codigo_operacion
              || v_pipe ||  creditofiscal
              || v_pipe ||  otros_tributos
              || v_pipe ||  cuitemisor
              || v_pipe ||  replace(nombreemisor,'^',' ')
              || v_pipe ||  ivacomision

              as registro

          from tt_final_register
          order by doct_id, fc_id;

   else

      open rtn for select 'no hay datos en el periodo' as registro;

   end if;

end;
$BODY$
  language plpgsql volatile
  cost 100;
alter function dc_csc_con_0341(integer, timestamp with time zone, timestamp with time zone, varchar, varchar, integer)
  owner to postgres;