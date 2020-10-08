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
-- Function: dc_csc_con_0080()

-- drop function dc_csc_con_0080();

create or replace function dc_csc_con_0080
(
  in p_us_id integer,
  in p_Fini date,
  in p_Ffin date,

  in p_perct_id varchar,
  in p_perc_id varchar,
  in p_rett_id varchar,
  in p_ret_id varchar,
  in p_cue_id varchar,
  in p_prov_id varchar,
  in p_cli_id varchar,
  in p_ccos_id varchar,
  in p_cico_id varchar,
  in p_doc_id varchar,
  in p_emp_id varchar,
  out rtn refcursor
)
  returns refcursor as
$BODY$
declare
   v_us_empresaEx smallint;
   v_cue_id integer;
   v_ccos_id integer;
   v_cico_id integer;
   v_doc_id integer;
   v_perc_id integer;
   v_perct_id integer;
   v_ret_id integer;
   v_rett_id integer;
   v_prov_id integer;
   v_cli_id integer;
   v_emp_id integer;
   v_ram_id_cuenta integer;
   v_ram_id_centrocosto integer;
   v_ram_id_circuitocontable integer;
   v_ram_id_documento integer;
   v_ram_id_percepcion integer;
   v_ram_id_percepciontipo integer;
   v_ram_id_retencion integer;
   v_ram_id_retenciontipo integer;
   v_ram_id_proveedor integer;
   v_ram_id_cliente integer;
   v_ram_id_empresa integer;
   v_clienteID integer;
   v_IsRaiz smallint;
begin

   select us_empresaEx
     into v_us_empresaEx
   from Usuario
   where us_id = p_us_id;

   select * from sp_ArbConvertId(p_cue_id) into v_cue_id, v_ram_id_cuenta;
   select * from sp_ArbConvertId(p_ccos_id) into v_ccos_id, v_ram_id_centrocosto;
   select * from sp_ArbConvertId(p_prov_id) into v_prov_id, v_ram_id_proveedor;
   select * from sp_ArbConvertId(p_cli_id) into v_cli_id, v_ram_id_cliente;
   select * from sp_ArbConvertId(p_cico_id) into v_cico_id, v_ram_id_circuitocontable;
   select * from sp_ArbConvertId(p_doc_id) into v_doc_id, v_ram_id_documento;
   select * from sp_ArbConvertId(p_perc_id) into v_perc_id, v_ram_id_percepcion;
   select * from sp_ArbConvertId(p_perct_id) into v_perct_id, v_ram_id_percepciontipo;
   select * from sp_ArbConvertId(p_ret_id) into v_ret_id, v_ram_id_retencion;
   select * from sp_ArbConvertId(p_rett_id) into v_rett_id, v_ram_id_retenciontipo;
   select * from sp_ArbConvertId(p_emp_id) into v_emp_id, v_ram_id_empresa;
   select * from  sp_GetRptId() into v_clienteID;

   if v_ram_id_cuenta <> 0 then
      --	exec sp_ArbGetGroups @ram_id_cuenta, @clienteID, @@us_id
      select sp_ArbIsRaiz(v_ram_id_cuenta) into v_IsRaiz;
      if v_IsRaiz = 0 then
         perform sp_ArbGetAllHojas(v_ram_id_cuenta, v_clienteID);
      else
         v_ram_id_cuenta := 0;
      end if;
   end if;

   if v_ram_id_centrocosto <> 0 then
      --	exec sp_ArbGetGroups @ram_id_centrocosto, @clienteID, @@us_id
      select sp_ArbIsRaiz(v_ram_id_centrocosto) into v_IsRaiz;
      if v_IsRaiz = 0 then
         perform sp_ArbGetAllHojas(v_ram_id_centrocosto, v_clienteID);
      else
         v_ram_id_centrocosto := 0;
      end if;
   end if;

   if v_ram_id_circuitocontable <> 0 then
      --	exec sp_ArbGetGroups @ram_id_circuitocontable, @clienteID, @@us_id
      select sp_ArbIsRaiz(v_ram_id_circuitocontable) into v_IsRaiz;
      if v_IsRaiz = 0 then
         perform sp_ArbGetAllHojas(v_ram_id_circuitocontable, v_clienteID);
      else
         v_ram_id_circuitocontable := 0;
      end if;
   end if;

   if v_ram_id_documento <> 0 then
      --	exec sp_ArbGetGroups @ram_id_documento, @clienteID, @@us_id
      select sp_ArbIsRaiz(v_ram_id_documento) into v_IsRaiz;
      if v_IsRaiz = 0 then
         perform sp_ArbGetAllHojas(v_ram_id_documento, v_clienteID);
      else
         v_ram_id_documento := 0;
      end if;
   end if;

   if v_ram_id_proveedor <> 0 then
      --	exec sp_ArbGetGroups @ram_id_proveedor, @clienteID, @@us_id
      select sp_ArbIsRaiz(v_ram_id_proveedor) into v_IsRaiz;
      if v_IsRaiz = 0 then
         perform sp_ArbGetAllHojas(v_ram_id_proveedor, v_clienteID);
      else
         v_ram_id_proveedor := 0;
      end if;
   end if;

   if v_ram_id_cliente <> 0 then
      --	exec sp_ArbGetGroups @ram_id_cliente, @clienteID, @@us_id
      select sp_ArbIsRaiz(v_ram_id_cliente) into v_IsRaiz;
      if v_IsRaiz = 0 then
         perform sp_ArbGetAllHojas(v_ram_id_cliente, v_clienteID);
      else
         v_ram_id_cliente := 0;
      end if;
   end if;

   if v_ram_id_percepcion <> 0 then
      --	exec sp_ArbGetGroups @ram_id_percepcion, @clienteID, @@us_id
      select sp_ArbIsRaiz(v_ram_id_percepcion) into v_IsRaiz;
      if v_IsRaiz = 0 then
         perform sp_ArbGetAllHojas(v_ram_id_percepcion, v_clienteID);
      else
         v_ram_id_percepcion := 0;
      end if;
   end if;

   if v_ram_id_percepciontipo <> 0 then
      --	exec sp_ArbGetGroups @ram_id_percepciontipo, @clienteID, @@us_id
      select sp_ArbIsRaiz(v_ram_id_percepciontipo) into v_IsRaiz;
      if v_IsRaiz = 0 then
         perform sp_ArbGetAllHojas(v_ram_id_percepciontipo, v_clienteID);
      else
         v_ram_id_percepciontipo := 0;
      end if;
   end if;

   if v_ram_id_retencion <> 0 then
      --	exec sp_ArbGetGroups @ram_id_retencion, @clienteID, @@us_id
      select sp_ArbIsRaiz(v_ram_id_retencion) into v_IsRaiz;
      if v_IsRaiz = 0 then
         perform sp_ArbGetAllHojas(v_ram_id_retencion, v_clienteID);
      else
         v_ram_id_retencion := 0;
      end if;
   end if;

   if v_ram_id_retenciontipo <> 0 then
      --	exec sp_ArbGetGroups @ram_id_retenciontipo, @clienteID, @@us_id
      select sp_ArbIsRaiz(v_ram_id_retenciontipo) into v_IsRaiz;
      if v_IsRaiz = 0 then
         perform sp_ArbGetAllHojas(v_ram_id_retenciontipo, v_clienteID);
      else
         v_ram_id_retenciontipo := 0;
      end if;
   end if;

   if v_ram_id_empresa <> 0 then
      --	exec sp_ArbGetGroups @ram_id_empresa, @clienteID, @@us_id
      select sp_ArbIsRaiz(v_ram_id_empresa) into v_IsRaiz;
      if v_IsRaiz = 0 then
         perform sp_ArbGetAllHojas(v_ram_id_empresa, v_clienteID);
      else
         v_ram_id_empresa := 0;
      end if;
   end if;

   open rtn for

      --////////////////////////////////////////////////////////////////////////
      -- entre fechas
      --
      select fc.fc_id comp_id,
             fc.doct_id doct_id,
             perc_nombre Impuesto,
             fc_fecha Fecha,
             prov_razonsocial Cliente_Proveedor,
             prov_codigo Codigo,
             prov_cuit CUIT,
             case fc.doct_id
                when 2 then 'FAC'
                when 8 then 'NC'
                when 10 then 'ND'
             end Tipo,
             fc_nrodoc Comprobante,
             '' Comprobante_2,
             '' Comp_Ret,
             null Fecha_Ret,
             case fc.doct_id
                when 2 then fcperc_importe
                when 8 then -fcperc_importe
                when 10 then fcperc_importe
             end Importe,
             case fc.doct_id
                when 2 then fc_neto
                when 8 then -fcperc_importe
                when 10 then fc_neto
             end Neto,
             case fc.doct_id
                when 2 then fc_ivari + fc_ivarni
                when 8 then -fc_ivari + fc_ivarni
                when 10 then fc_ivari + fc_ivarni
             end IVA,
             case fc.doct_id
                when 2 then fc_total
                when 8 then -fc_total
                when 10 then fc_total
             end Total
      from FacturaCompra fc
      join FacturaCompraPercepcion fcperc on fc.fc_id = fcperc.fc_id
      join Percepcion perc on fcperc.perc_id = perc.perc_id
      join PercepcionTipo perct on perc.perct_id = perct.perct_id
      join Documento doc on fc.doc_id = doc.doc_id
      join Empresa emp on doc.emp_id = emp.emp_id
      join CircuitoContable cico on doc.cico_id = cico.cico_id
      join Proveedor prov on fc.prov_id = prov.prov_id
      left join CentroCosto ccos on fc.ccos_id = ccos.ccos_id
      where fc_fecha >= p_Fini
        and fc_fecha <= p_Ffin
        and fc.est_id <> 7
        -- validar usuario - empresa
        and ( exists ( select *
                       from EmpresaUsuario
                       where emp_id = doc.emp_id
                         and us_id = p_us_id )
              or ( p_us_id = 1 ) )
        and ( exists ( select *
                       from UsuarioEmpresa
                       where prov_id = fc.prov_id
                         and us_id = p_us_id )
              or ( v_us_empresaEx = 0 ) )

        and ( perct.cue_id = v_cue_id or v_cue_id = 0 )
        and ( fc.ccos_id = v_ccos_id or v_ccos_id = 0 )
        and ( doc.cico_id = v_cico_id or v_cico_id = 0 )
        and ( fc.prov_id = v_prov_id or v_prov_id = 0 )
        and ( fc.doc_id = v_doc_id or v_doc_id = 0 )
        and ( fcperc.perc_id = v_perc_id or v_perc_id = 0 )
        and ( perc.perct_id = v_perct_id or v_perct_id = 0 )
        and ( emp.emp_id = v_emp_id or v_emp_id = 0 )

        and ( ( exists ( select rptarb_hojaid
                         from rptArbolRamaHoja
                         where rptarb_cliente = v_clienteID
                           and tbl_id = 17
                           and rptarb_hojaid = perct.cue_id ) )
                or ( v_ram_id_cuenta = 0 ) )
        and ( ( exists ( select rptarb_hojaid
                         from rptArbolRamaHoja
                         where rptarb_cliente = v_clienteID
                           and tbl_id = 21
                           and rptarb_hojaid = fc.ccos_id ) )
                or ( v_ram_id_centrocosto = 0 ) )
        and ( ( exists ( select rptarb_hojaid
                         from rptArbolRamaHoja
                         where rptarb_cliente = v_clienteID
                           and tbl_id = 29
                           and rptarb_hojaid = fc.prov_id ) )
                or ( v_ram_id_proveedor = 0 ) )
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
                           and tbl_id = 1012
                           and rptarb_hojaid = fcperc.perc_id ) )
                or ( v_ram_id_percepcion = 0 ) )
        and ( ( exists ( select rptarb_hojaid
                         from rptArbolRamaHoja
                         where rptarb_cliente = v_clienteID
                           and tbl_id = 1011
                           and rptarb_hojaid = perc.perct_id ) )
                or ( v_ram_id_percepciontipo = 0 ) )
        and ( ( exists ( select rptarb_hojaid
                         from rptArbolRamaHoja
                         where rptarb_cliente = v_clienteID
                           and tbl_id = 1018
                           and rptarb_hojaid = doc.emp_id ) )
                or ( v_ram_id_empresa = 0 ) )

      ----------------------------------------------------------------------------------------------------------------------
      union ALL
      ----------------------------------------------------------------------------------------------------------------------

      select opg.opg_id comp_id,
             opg.doct_id doct_id,
             ret_nombre Impuesto,
             opg_fecha Fecha,
             prov_razonsocial Cliente_Proveedor,
             prov_codigo Codigo,
             prov_cuit CUIT,
             'OP' Tipo,
             opg_nrodoc Comprobante,
             ( select max(fc_nrodoc)
               from FacturaCompra fc
               join FacturaCompraOrdenPago fcp on fc.fc_id = fcp.fc_id
               where fcp.opg_id = opg.opg_id ) Comprobante_2,
             opgi_nroRetencion Comp_Ret,
             opgi_fechaRetencion Fecha_Ret,
             opgi_importe Importe,
             opg_neto Neto,
             0 IVA,
             opg_total Total
      from OrdenPago opg
      join OrdenPagoItem opgi on opg.opg_id = opgi.opg_id and opgi_tipo = 4--Otros
      join Retencion ret on opgi.ret_id = ret.ret_id
      join RetencionTipo rett on ret.rett_id = rett.rett_id
      join Documento doc on opg.doc_id = doc.doc_id
      join Empresa emp on doc.emp_id = emp.emp_id
      join CircuitoContable cico on doc.cico_id = cico.cico_id
      join Proveedor prov on opg.prov_id = prov.prov_id
      left join CentroCosto ccos on opg.ccos_id = ccos.ccos_id
      where opg_fecha >= p_Fini
        and opg_fecha <= p_Ffin
        and opg.est_id <> 7
        -- validar usuario - empresa
        and ( exists ( select *
                       from EmpresaUsuario
                       where emp_id = doc.emp_id
                         and us_id = p_us_id )
              or ( p_us_id = 1 ) )
        and ( exists ( select *
                       from UsuarioEmpresa
                       where prov_id = opg.prov_id
                         and us_id = p_us_id )
              or ( v_us_empresaEx = 0 ) )

        and ( opgi.cue_id = v_cue_id or v_cue_id = 0 )
        and ( opg.ccos_id = v_ccos_id or v_ccos_id = 0 )
        and ( doc.cico_id = v_cico_id or v_cico_id = 0 )
        and ( opg.prov_id = v_prov_id or v_prov_id = 0 )
        and ( opg.doc_id = v_doc_id or v_doc_id = 0 )
        and ( opgi.ret_id = v_ret_id or v_ret_id = 0 )
        and ( ret.rett_id = v_rett_id or v_rett_id = 0 )
        and ( emp.emp_id = v_emp_id or v_emp_id = 0 )

        and ( ( exists ( select rptarb_hojaid
                         from rptArbolRamaHoja
                         where rptarb_cliente = v_clienteID
                           and tbl_id = 17
                           and rptarb_hojaid = opgi.cue_id ) )
                or ( v_ram_id_cuenta = 0 ) )
        and ( ( exists ( select rptarb_hojaid
                         from rptArbolRamaHoja
                         where rptarb_cliente = v_clienteID
                           and tbl_id = 21
                           and rptarb_hojaid = opg.ccos_id ) )
                or ( v_ram_id_centrocosto = 0 ) )
        and ( ( exists ( select rptarb_hojaid
                         from rptArbolRamaHoja
                         where rptarb_cliente = v_clienteID
                           and tbl_id = 29
                           and rptarb_hojaid = opg.prov_id ) )
                or ( v_ram_id_proveedor = 0 ) )
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
                           and rptarb_hojaid = opg.doc_id ) )
                or ( v_ram_id_documento = 0 ) )
        and ( ( exists ( select rptarb_hojaid
                         from rptArbolRamaHoja
                         where rptarb_cliente = v_clienteID
                           and tbl_id = 1014
                           and rptarb_hojaid = opgi.ret_id ) )
                or ( v_ram_id_retencion = 0 ) )
        and ( ( exists ( select rptarb_hojaid
                         from rptArbolRamaHoja
                         where rptarb_cliente = v_clienteID
                           and tbl_id = 1013
                           and rptarb_hojaid = ret.rett_id ) )
                or ( v_ram_id_retenciontipo = 0 ) )
        and ( ( exists ( select rptarb_hojaid
                         from rptArbolRamaHoja
                         where rptarb_cliente = v_clienteID
                           and tbl_id = 1018
                           and rptarb_hojaid = doc.emp_id ) )
                or ( v_ram_id_empresa = 0 ) )

      ----------------------------------------------------------------------------------------------------------------------
      union ALL
      ----------------------------------------------------------------------------------------------------------------------

      select fv.fv_id comp_id,
             fv.doct_id doct_id,
             perc_nombre Impuesto,
             fv_fecha Fecha,
             cli_razonsocial Cliente_Cliente,
             cli_codigo Codigo,
             cli_cuit CUIT,
             case fv.doct_id
                when 1 then 'FAC'
                when 7 then 'NC'
                when 9 then 'ND'
             end Tipo,
             fv_nrodoc Comprobante,
             '' Comprobante_2,
             '' Comp_Ret,
             null Fecha_Ret,
             case fv.doct_id
                when 1 then fvperc_importe
                when 7 then -fvperc_importe
                when 9 then fvperc_importe
             end Importe,
             case fv.doct_id
                when 1 then fv_neto
                when 7 then -fvperc_importe
                when 9 then fv_neto
             end Neto,
             case fv.doct_id
                when 1 then fv_ivari + fv_ivarni
                when 7 then -fv_ivari + fv_ivarni
                when 9 then fv_ivari + fv_ivarni
             end IVA,
             case fv.doct_id
                when 1 then fv_total
                when 7 then -fv_total
                when 9 then fv_total
             end Total
      from FacturaVenta fv
      join FacturaVentaPercepcion fvperc on fv.fv_id = fvperc.fv_id
      join Percepcion perc on fvperc.perc_id = perc.perc_id
      join PercepcionTipo perct on perc.perct_id = perct.perct_id
      join Documento doc on fv.doc_id = doc.doc_id
      join Empresa emp on doc.emp_id = emp.emp_id
      join CircuitoContable cico on doc.cico_id = cico.cico_id
      join Cliente cli on fv.cli_id = cli.cli_id
      left join CentroCosto ccos on fv.ccos_id = ccos.ccos_id
      where fv_fecha >= p_Fini
        and fv_fecha <= p_Ffin
        and fv.est_id <> 7
        -- validar usuario - empresa
        and ( exists ( select *
                       from EmpresaUsuario
                       where emp_id = doc.emp_id
                         and us_id = p_us_id )
              or ( p_us_id = 1 ) )
        and ( exists ( select *
                       from UsuarioEmpresa
                       where cli_id = fv.cli_id
                         and us_id = p_us_id )
              or ( v_us_empresaEx = 0 ) )

        and ( perct.cue_id = v_cue_id or v_cue_id = 0 )
        and ( fv.ccos_id = v_ccos_id or v_ccos_id = 0 )
        and ( doc.cico_id = v_cico_id or v_cico_id = 0 )
        and ( fv.cli_id = v_cli_id or v_cli_id = 0 )
        and ( fv.doc_id = v_doc_id or v_doc_id = 0 )
        and ( fvperc.perc_id = v_perc_id or v_perc_id = 0 )
        and ( perc.perct_id = v_perct_id or v_perct_id = 0 )
        and ( emp.emp_id = v_emp_id or v_emp_id = 0 )

        and ( ( exists ( select rptarb_hojaid
                         from rptArbolRamaHoja
                         where rptarb_cliente = v_clienteID
                           and tbl_id = 17
                           and rptarb_hojaid = perct.cue_id ) )
              or ( v_ram_id_cuenta = 0 ) )
        and ( ( exists ( select rptarb_hojaid
                         from rptArbolRamaHoja
                         where rptarb_cliente = v_clienteID
                           and tbl_id = 21
                           and rptarb_hojaid = fv.ccos_id ) )
              or ( v_ram_id_centrocosto = 0 ) )
        and ( ( exists ( select rptarb_hojaid
                         from rptArbolRamaHoja
                         where rptarb_cliente = v_clienteID
                           and tbl_id = 28
                           and rptarb_hojaid = fv.cli_id ) )
              or ( v_ram_id_Cliente = 0 ) )
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
                           and rptarb_hojaid = fv.doc_id ) )
              or ( v_ram_id_documento = 0 ) )
        and ( ( exists ( select rptarb_hojaid
                         from rptArbolRamaHoja
                         where rptarb_cliente = v_clienteID
                           and tbl_id = 1012
                           and rptarb_hojaid = fvperc.perc_id ) )
              or ( v_ram_id_percepcion = 0 ) )
        and ( ( exists ( select rptarb_hojaid
                         from rptArbolRamaHoja
                         where rptarb_cliente = v_clienteID
                           and tbl_id = 1011
                           and rptarb_hojaid = perc.perct_id ) )
              or ( v_ram_id_percepciontipo = 0 ) )
        and ( ( exists ( select rptarb_hojaid
                         from rptArbolRamaHoja
                         where rptarb_cliente = v_clienteID
                           and tbl_id = 1018
                           and rptarb_hojaid = doc.emp_id ) )
              or ( v_ram_id_empresa = 0 ) )

      ----------------------------------------------------------------------------------------------------------------------
      union ALL
      ----------------------------------------------------------------------------------------------------------------------

      select cobz.cobz_id comp_id,
             cobz.doct_id doct_id,
             ret_nombre Impuesto,
             cobz_fecha Fecha,
             cli_razonsocial Cliente_Proveedor,
             cli_codigo Codigo,
             cli_cuit CUIT,
             'COB' Tipo,
             cobz_nrodoc Comprobante,
             ( select max(fv_nrodoc)
               from FacturaVenta fv
               join FacturaVentaCobranza fvp on fv.fv_id = fvp.fv_id
               where cobz_id = cobz.cobz_id ) Comprobante_2,
             cobzi_nroRetencion Comp_Ret,
             cobzi_fechaRetencion Fecha_Ret,
             -cobzi_importe Importe,
             -cobz_neto Neto,
             0 IVA,
             -cobz_total Total
      from Cobranza cobz
      join CobranzaItem cobzi on cobz.cobz_id = cobzi.cobz_id and cobzi_tipo = 4--Otros
      join Retencion ret on cobzi.ret_id = ret.ret_id
      join RetencionTipo rett on ret.rett_id = rett.rett_id
      join Documento doc on cobz.doc_id = doc.doc_id
      join Empresa emp on doc.emp_id = emp.emp_id
      join CircuitoContable cico on doc.cico_id = cico.cico_id
      join Cliente cli on cobz.cli_id = cli.cli_id
      left join CentroCosto ccos on cobz.ccos_id = ccos.ccos_id
      where cobz_fecha >= p_Fini
        and cobz_fecha <= p_Ffin
        and cobz.est_id <> 7
        -- validar usuario - empresa
        and ( exists ( select *
                       from EmpresaUsuario
                       where emp_id = doc.emp_id
                         and us_id = p_us_id )
              or ( p_us_id = 1 ) )
        and ( exists ( select *
                       from UsuarioEmpresa
                       where cli_id = cobz.cli_id
                         and us_id = p_us_id )
              or ( v_us_empresaEx = 0 ) )
        and ( cobzi.cue_id = v_cue_id or v_cue_id = 0 )
        and ( cobz.ccos_id = v_ccos_id or v_ccos_id = 0 )
        and ( doc.cico_id = v_cico_id or v_cico_id = 0 )
        and ( cobz.cli_id = v_cli_id or v_cli_id = 0 )
        and ( cobz.doc_id = v_doc_id or v_doc_id = 0 )
        and ( cobzi.ret_id = v_ret_id or v_ret_id = 0 )
        and ( ret.rett_id = v_rett_id or v_rett_id = 0 )
        and ( emp.emp_id = v_emp_id or v_emp_id = 0 )

        and ( ( exists ( select rptarb_hojaid
                         from rptArbolRamaHoja
                         where rptarb_cliente = v_clienteID
                           and tbl_id = 17
                           and rptarb_hojaid = cobzi.cue_id ) )
                or ( v_ram_id_cuenta = 0 ) )
        and ( ( exists ( select rptarb_hojaid
                         from rptArbolRamaHoja
                         where rptarb_cliente = v_clienteID
                           and tbl_id = 21
                           and rptarb_hojaid = cobz.ccos_id ) )
                or ( v_ram_id_centrocosto = 0 ) )
        and ( ( exists ( select rptarb_hojaid
                         from rptArbolRamaHoja
                         where rptarb_cliente = v_clienteID
                           and tbl_id = 28
                           and rptarb_hojaid = cobz.cli_id ) )
                or ( v_ram_id_Cliente = 0 ) )
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
                           and rptarb_hojaid = cobz.doc_id ) )
                or ( v_ram_id_documento = 0 ) )
        and ( ( exists ( select rptarb_hojaid
                         from rptArbolRamaHoja
                         where rptarb_cliente = v_clienteID
                           and tbl_id = 1014
                           and rptarb_hojaid = cobzi.ret_id ) )
                or ( v_ram_id_retencion = 0 ) )
        and ( ( exists ( select rptarb_hojaid
                         from rptArbolRamaHoja
                         where rptarb_cliente = v_clienteID
                           and tbl_id = 1013
                           and rptarb_hojaid = ret.rett_id ) )
                or ( v_ram_id_retenciontipo = 0 ) )
        and ( ( exists ( select rptarb_hojaid
                         from rptArbolRamaHoja
                         where rptarb_cliente = v_clienteID
                           and tbl_id = 1018
                           and rptarb_hojaid = doc.emp_id ) )
                or ( v_ram_id_empresa = 0 ) )
      order by Impuesto,
               Fecha;

end;
$BODY$
  language plpgsql volatile
  cost 100;
alter function dc_csc_con_0080(
   integer, date, date,
   varchar,
   varchar,
   varchar,
   varchar,
   varchar,
   varchar,
   varchar,
   varchar,
   varchar,
   varchar,
   varchar
)
  owner to postgres;