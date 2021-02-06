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

create or replace function dc_csc_con_0330
(
   in p_us_id        integer,
   in p_Fini         timestamp with time zone,
   in p_Ffin         timestamp with time zone,

   in p_ccos_id      varchar,
   in p_cue_id       varchar,
   in p_cico_id      varchar,
   in p_doc_id       varchar,
   in p_mon_id       varchar,
   in p_emp_id       varchar,

   out rtn refcursor
)
 returns refcursor as
$BODY$
declare
   v_clienteID       integer;
   v_IsRaiz          smallint;

   v_cico_id                 integer;
   v_ram_id_circuitocontable integer;

   v_emp_id                  integer;
   v_ram_id_empresa          integer;

   v_cue_id_param            integer;
   v_ram_id_cuenta           integer;

   v_mon_id                  integer;
   v_ram_id_moneda           integer;

   v_doc_id                  integer;
   v_ram_id_documento        integer;

   v_ccos_id                 integer;
   v_ram_id_centrocosto      integer;
   v_clienteIDccosi          integer;

   v_fc_id                   integer;
   v_last_fc_id              integer;
   v_opg_fecha               timestamp with time zone;
   v_opg_nrodoc              varchar(100);
   v_opg_importe             decimal(18,2);
   v_pago                    varchar(5000);
   v_last_fecha              timestamp with time zone;
   v_last_total              decimal(18,6);
   v_last_nrodoc             varchar(255);
   v_n                       integer;

   v_no_date date := to_date('19000101','yyyymmdd');

begin

   drop table if exists tt_t_pagos;
   create temporary table tt_t_pagos (
      fc_id int,
      pago varchar(5000),
      opg_fecha timestamp with time zone,
      opg_total decimal(18,6),
      opg_nrodoc varchar(255),
      varios_pagos smallint
   ) on commit drop;

   rtn = 'rtn';

   select * from sp_ArbConvertId(p_mon_id) into v_mon_id, v_ram_id_moneda;
   select * from sp_ArbConvertId(p_emp_id) into v_emp_id, v_ram_id_empresa;
   select * from sp_ArbConvertId(p_cue_id) into v_cue_id_param, v_ram_id_cuenta;
   select * from sp_ArbConvertId(p_cico_id) into v_cico_id, v_ram_id_circuitocontable;
   select * from sp_ArbConvertId(p_doc_id) into v_doc_id, v_ram_id_Documento;
   select * from sp_ArbConvertId(p_ccos_id) into v_ccos_id, v_ram_id_centrocosto;

   select * from sp_GetRptId() into v_clienteID;
   select * from sp_GetRptId() into v_clienteIDccosi;

   if v_ram_id_cuenta <> 0 then

     -- exec sp_ArbGetGroups @ram_id_cuenta, @clienteID, @@us_id
     select sp_ArbIsRaiz(v_ram_id_cuenta) into v_IsRaiz;

     if v_IsRaiz = 0 then
       perform sp_ArbGetAllHojas(v_ram_id_cuenta, v_clienteID);
     else
       v_ram_id_cuenta := 0;
     end if;
   end if;

   if v_ram_id_moneda <> 0 then

     -- exec sp_ArbGetGroups @ram_id_moneda, @clienteID, @@us_id
     select sp_ArbIsRaiz(v_ram_id_moneda) into v_IsRaiz;

     if v_IsRaiz = 0 then
       perform sp_ArbGetAllHojas(v_ram_id_moneda, v_clienteID);
     else
       v_ram_id_moneda := 0;
     end if;
   end if;

   if v_ram_id_empresa <> 0 then

     -- exec sp_ArbGetGroups @ram_id_empresa, @clienteID, @@us_id
     select sp_ArbIsRaiz(v_ram_id_empresa) into v_IsRaiz;

     if v_IsRaiz = 0 then
       perform sp_ArbGetAllHojas(v_ram_id_empresa, v_clienteID);
     else
       v_ram_id_empresa := 0;
     end if;
   end if;

   if v_ram_id_circuitocontable <> 0 then

     -- exec sp_ArbGetGroups @ram_id_circuitocontable, @clienteID, @@us_id
     select sp_ArbIsRaiz(v_ram_id_circuitocontable) into v_IsRaiz;

     if v_IsRaiz = 0 then
       perform sp_ArbGetAllHojas(v_ram_id_circuitocontable, v_clienteID);
     else
       v_ram_id_circuitocontable := 0;
     end if;
   end if;

   if v_ram_id_documento <> 0 then

     -- exec sp_ArbGetGroups @ram_id_circuitocontable, @clienteID, @@us_id
     select sp_ArbIsRaiz(v_ram_id_documento) into v_IsRaiz;

     if v_IsRaiz = 0 then
       perform sp_ArbGetAllHojas(v_ram_id_documento, v_clienteID);
     else
       v_ram_id_documento := 0;
     end if;
   end if;

   if v_ram_id_centrocosto <> 0 then

     -- exec sp_ArbGetGroups @ram_id_centrocosto, @clienteID, @@us_id
     select sp_ArbIsRaiz(v_ram_id_centrocosto) into v_IsRaiz;

     if v_IsRaiz = 0 then
       perform sp_ArbGetAllHojas(v_ram_id_centrocosto, v_clienteID);
     else
       v_ram_id_centrocosto := 0;
     end if;
   end if;

   v_last_fc_id := 0;
   v_n := 0;

   for v_fc_id,v_opg_fecha,v_opg_nrodoc,v_opg_importe in

       select fcopg.fc_id,
              opg.opg_fecha,
              opg.opg_nrodoc,
              sum(fcopg.fcopg_importe)
       from FacturaCompraOrdenPago fcopg
             join OrdenPago opg on fcopg.opg_id = opg.opg_id
       group by fcopg.fc_id,opg.opg_fecha,opg.opg_nrodoc

   loop

     if v_last_fc_id <> v_fc_id then

       if v_last_fc_id <> 0 then

         if v_n > 1 then

           v_last_fecha := v_no_date;
           v_last_total := 0;
           v_last_nrodoc := '';
           v_n := 1;

         else

          v_n := 0;

         end if;

         v_pago := substr(v_pago, 1, length(v_pago) - 2);

         insert into tt_t_pagos ( fc_id, pago, opg_fecha, opg_total, opg_nrodoc, varios_pagos )
         values ( v_last_fc_id, v_pago, v_last_fecha, v_last_total, v_last_nrodoc, v_n );

       end if;

       v_pago := '';
       v_last_fc_id := v_fc_id;
       v_last_fecha := v_opg_fecha;
       v_last_total := v_opg_importe;
       v_last_nrodoc := v_opg_nrodoc;
       v_n := 0;

     end if;

     v_n := v_n + 1;
     v_pago := v_pago || v_opg_fecha::varchar || ' ' || v_opg_nrodoc || ' ' || v_opg_importe::varchar || ', ';

   end loop;

   if v_n > 1 then

     v_last_fecha := v_no_date;
     v_last_total := 0;
     v_last_nrodoc := '';
     v_n := 1;

   else

     v_n := 0;

   end if;

   v_pago := substr(v_pago, 1, length(v_pago) - 2);

   insert into tt_t_pagos (fc_id, pago, opg_fecha, opg_total, opg_nrodoc, varios_pagos)
   values (v_last_fc_id, v_pago, v_last_fecha, v_last_total, v_last_nrodoc, v_n);

   open rtn for

      select fc.fc_id comp_id,
             fc.doct_id doct_id,
             0 orden_aux_id,
             'Factura' Tipo,
             prov_nombre Proveedor,
             fc_fecha Fecha,
             fc_fechaentrega Fecha_Enrega,
             fc_nrodoc Comprobante,
             '#' || cue_codigo Codigo,
             '#' || cueg_codigo Grupo_Cuenta,
             '#' || pr_codigo Codigo_Producto,
             pr_nombrecompra Producto,
             coalesce(ccosfci.ccos_codigo, ccosfc.ccos_codigo) Codigo_Costo,
             coalesce(ccosfci.ccos_nombre, ccosfc.ccos_nombre) Centro_Costo,
             case
                when fc.doct_id = 8 then -fci_neto
                else fci_neto
             end Neto,
             case
                when fc.doct_id = 8 then -fci_ivari
                else fci_ivari
             end IVA,
             case
                when fc.doct_id = 8 then -fci_importe
                else fci_importe
             end Total,
             t.pago Pagos,
             t.opg_fecha Pago_Fecha,
             t.opg_nrodoc Orden_de_Pago,
             t.opg_total Pago_Total,
             t.varios_pagos Varios_Pagos

      from FacturaCompra fc
      join FacturaCompraItem fci on fc.fc_id = fci.fc_id
      left join CentroCosto ccosfc on fc.ccos_id = ccosfc.ccos_id
      left join CentroCosto ccosfci on fci.ccos_id = ccosfci.ccos_id
      left join Proveedor prov on fc.prov_id = prov.prov_id
      left join Producto pr on fci.pr_id = pr.pr_id
      left join tt_t_pagos t on fc.fc_id = t.fc_id
      left join Documento doc on fc.doc_id = doc.doc_id
      left join CuentaGrupo cueg on pr.cueg_id_compra = cueg.cueg_id
      left join Cuenta cue on cueg.cue_id = cue.cue_id

      where fc.est_id <> 7
        and fc_fechaentrega >= p_Fini
        and fc_fechaentrega <= p_Ffin

        and ( exists ( select * from EmpresaUsuario where emp_id = doc.emp_id and us_id = p_us_id ) or ( p_us_id = 1 ) )
        and ( fc.mon_id = v_mon_id or v_mon_id = 0 )
        and ( doc.emp_id = v_emp_id or v_emp_id = 0 )
        and ( doc.cico_id = v_cico_id or v_cico_id = 0 )
        and ( fc.doc_id = v_doc_id or v_doc_id = 0 )
        and ( coalesce(fci.ccos_id, fc.ccos_id) = v_ccos_id or v_ccos_id = 0 )

        and ( ( exists ( select rptarb_hojaid
                         from rptArbolRamaHoja
                         where rptarb_cliente = v_clienteID
                           and tbl_id = 17
                           and rptarb_hojaid = cueg.cue_id ) )
                or ( v_ram_id_cuenta = 0 ) )
        and ( ( exists ( select rptarb_hojaid
                         from rptArbolRamaHoja
                         where rptarb_cliente = v_clienteID
                           and tbl_id = 12
                           and rptarb_hojaid = fc.mon_id ) )
                or ( v_ram_id_moneda = 0 ) )
        and ( ( exists ( select rptarb_hojaid
                         from rptArbolRamaHoja
                         where rptarb_cliente = v_clienteID
                           and tbl_id = 1018
                           and rptarb_hojaid = doc.emp_id ) )
                or ( v_ram_id_empresa = 0 ) )
        and ( ( exists ( select rptarb_hojaid
                         from rptArbolRamaHoja
                         where rptarb_cliente = v_clienteID
                           and tbl_id = 1016
                           and rptarb_hojaid = doc.cico_id ) )
                or ( v_ram_id_circuitocontable = 0 ) )
        and ( ( exists ( select rptarb_hojaid
                         from rptArbolRamaHoja
                         where rptarb_cliente = v_clienteID
                           and tbl_id = 4001
                           and rptarb_hojaid = fc.doc_id ) )
                or ( v_ram_id_documento = 0 ) )
        and ( ( exists ( select rptarb_hojaid
                         from rptArbolRamaHoja
                         where rptarb_cliente = v_clienteID
                           and tbl_id = 21
                           and rptarb_hojaid = coalesce(fci.ccos_id, fc.ccos_id) ) )
                or ( v_ram_id_centrocosto = 0 ) )

      union ALL

      select mf.mf_id comp_id,
             mf.doct_id doct_id,
             mfi.mfi_id orden_aux_id,
             'Movimiento de Fondos' Tipo,
             '' Proveedor,
             mf_fecha Fecha,
             mf_fecha Fecha_Enrega,
             mf_nrodoc Comprobante,
             '#' || cue_codigo Codigo,
             '#' || cue_codigo Grupo_Cuenta,
             '#' || cue_codigo Codigo_Producto,
             cue_nombre Producto,
             coalesce(ccosmfi.ccos_codigo, ccosmf.ccos_codigo) Codigo_Costo,
             coalesce(ccosmfi.ccos_nombre, ccosmf.ccos_nombre) Centro_Costo,
             mfi_importe Neto,
             0 IVA,
             mfi_importe Total,
             '' Pagos,
             v_no_date Pago_Fecha,
             '' Orden_de_Pago,
             0 Pago_Total,
             0 Varios_Pagos
      from MovimientoFondo mf
      join MovimientoFondoItem mfi on mf.mf_id = mfi.mf_id
      left join CentroCosto ccosmf on mf.ccos_id = ccosmf.ccos_id
      left join CentroCosto ccosmfi on mfi.ccos_id = ccosmfi.ccos_id
      left join Cuenta cue on mfi.cue_id_debe = cue.cue_id
      left join Documento doc on mf.doc_id = doc.doc_id

      where mf.est_id <> 7
        and mf_fecha >= p_Fini
        and mf_fecha <= p_Ffin

        and ( exists ( select * from EmpresaUsuario where emp_id = doc.emp_id and us_id = p_us_id ) or ( p_us_id = 1 ) )
        and ( doc.emp_id = v_emp_id or v_emp_id = 0 )
        and ( doc.cico_id = v_cico_id or v_cico_id = 0 )
        and ( mf.doc_id = v_doc_id or v_doc_id = 0 )
        and ( coalesce(mfi.ccos_id, mf.ccos_id) = v_ccos_id or v_ccos_id = 0 )

        and ( ( exists ( select rptarb_hojaid
                         from rptArbolRamaHoja
                         where rptarb_cliente = v_clienteID
                           and tbl_id = 17
                           and rptarb_hojaid = cue.cue_id ) )
                or ( v_ram_id_cuenta = 0 ) )
        and ( ( exists ( select rptarb_hojaid
                         from rptArbolRamaHoja
                         where rptarb_cliente = v_clienteID
                           and tbl_id = 1018
                           and rptarb_hojaid = doc.emp_id ) )
                or ( v_ram_id_empresa = 0 ) )
        and ( ( exists ( select rptarb_hojaid
                         from rptArbolRamaHoja
                         where rptarb_cliente = v_clienteID
                           and tbl_id = 1016
                           and rptarb_hojaid = doc.cico_id ) )
                or ( v_ram_id_circuitocontable = 0 ) )
        and ( ( exists ( select rptarb_hojaid
                         from rptArbolRamaHoja
                         where rptarb_cliente = v_clienteID
                           and tbl_id = 4001
                           and rptarb_hojaid = mf.doc_id ) )
                or ( v_ram_id_documento = 0 ) )
        and ( ( exists ( select rptarb_hojaid
                         from rptArbolRamaHoja
                         where rptarb_cliente = v_clienteID
                           and tbl_id = 21
                           and rptarb_hojaid = coalesce(mf.ccos_id, mf.ccos_id) ) )
                or ( v_ram_id_centrocosto = 0 ) )

      union ALL

      select mf.mf_id comp_id,
             mf.doct_id doct_id,
             mfi.mfi_id orden_aux_id,
             'Movimiento de Fondos' Tipo,
             '' Proveedor,
             mf_fecha Fecha,
             mf_fecha Fecha_Enrega,
             mf_nrodoc Comprobante,
             '#' || cue_codigo Codigo,
             '#' || cue_codigo Grupo_Cuenta,
             '#' || cue_codigo Codigo_Producto,
             cue_nombre Producto,
             coalesce(ccosmfi.ccos_codigo, ccosmf.ccos_codigo) Codigo_Costo,
             coalesce(ccosmfi.ccos_nombre, ccosmf.ccos_nombre) Centro_Costo,
             -mfi_importe Neto,
             0 IVA,
             -mfi_importe Total,
             '' Pagos,
             v_no_date Pago_Fecha,
             '' Orden_de_Pago,
             0 Pago_Total,
             0 Varios_Pagos
      from MovimientoFondo mf
      join MovimientoFondoItem mfi on mf.mf_id = mfi.mf_id
      left join CentroCosto ccosmf on mf.ccos_id = ccosmf.ccos_id
      left join CentroCosto ccosmfi on mfi.ccos_id = ccosmfi.ccos_id
      left join Cuenta cue on mfi.cue_id_haber = cue.cue_id
      left join Documento doc on mf.doc_id = doc.doc_id

      where mf.est_id <> 7
        and mf_fecha >= p_Fini
        and mf_fecha <= p_Ffin

        and ( exists ( select * from EmpresaUsuario where emp_id = doc.emp_id and us_id = p_us_id ) or ( p_us_id = 1 ) )

        and ( doc.emp_id = v_emp_id or v_emp_id = 0 )
        and ( doc.cico_id = v_cico_id or v_cico_id = 0 )
        and ( mf.doc_id = v_doc_id or v_doc_id = 0 )
        and ( coalesce(mfi.ccos_id, mf.ccos_id) = v_ccos_id or v_ccos_id = 0 )

        and ( ( exists ( select rptarb_hojaid
                         from rptArbolRamaHoja
                         where rptarb_cliente = v_clienteID
                           and tbl_id = 17
                           and rptarb_hojaid = cue.cue_id ) )
                or ( v_ram_id_cuenta = 0 ) )
        and ( ( exists ( select rptarb_hojaid
                         from rptArbolRamaHoja
                         where rptarb_cliente = v_clienteID
                           and tbl_id = 1018
                           and rptarb_hojaid = doc.emp_id ) )
                or ( v_ram_id_empresa = 0 ) )
        and ( ( exists ( select rptarb_hojaid
                         from rptArbolRamaHoja
                         where rptarb_cliente = v_clienteID
                           and tbl_id = 1016
                           and rptarb_hojaid = doc.cico_id ) )
                or ( v_ram_id_circuitocontable = 0 ) )
        and ( ( exists ( select rptarb_hojaid
                         from rptArbolRamaHoja
                         where rptarb_cliente = v_clienteID
                           and tbl_id = 4001
                           and rptarb_hojaid = mf.doc_id ) )
                or ( v_ram_id_documento = 0 ) )
        and ( ( exists ( select rptarb_hojaid
                         from rptArbolRamaHoja
                         where rptarb_cliente = v_clienteID
                           and tbl_id = 21
                           and rptarb_hojaid = coalesce(mf.ccos_id, mf.ccos_id) ) )
                or ( v_ram_id_centrocosto = 0 ) )

      order by Tipo,
               Comprobante,
               orden_aux_id;

end;
$BODY$
  language plpgsql volatile
  cost 100;
alter function dc_csc_con_0330(integer, timestamp with time zone, timestamp with time zone, varchar, varchar, varchar, varchar, varchar, varchar)
  owner to postgres;