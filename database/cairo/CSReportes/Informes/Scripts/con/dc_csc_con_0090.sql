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

create or replace function dc_csc_con_0090
(
  in p_us_id integer,
  in p_Fini timestamp with time zone,
  in p_Ffin timestamp with time zone,

  in p_cue_id varchar,
  in p_ccos_id varchar,
  in p_cico_id varchar,
  in p_bMonExt integer,
  in p_emp_id varchar,
  in p_bSaldo integer,
  out rtn refcursor
)
  returns refcursor as
$BODY$
declare
   v_cue_id integer;
   v_ccos_id integer;
   v_cico_id integer;
   v_emp_id integer;
   v_ram_id_cuenta integer;
   v_ram_id_centrocosto integer;
   v_ram_id_circuitocontable integer;
   v_ram_id_Empresa integer;
   v_clienteID integer;
   v_IsRaiz smallint;
begin

   select * from sp_ArbConvertId(p_cue_id) into v_cue_id, v_ram_id_cuenta;
   select * from sp_ArbConvertId(p_ccos_id) into v_ccos_id, v_ram_id_centrocosto;
   select * from sp_ArbConvertId(p_cico_id) into v_cico_id, v_ram_id_circuitocontable;
   select * from sp_ArbConvertId(p_emp_id) into v_emp_id, v_ram_id_Empresa;
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

   if v_ram_id_Empresa <> 0 then
      --	exec sp_ArbGetGroups @ram_id_Empresa, @clienteID, @@us_id
      select sp_ArbIsRaiz(v_ram_id_Empresa) into v_IsRaiz;
      if v_IsRaiz = 0 then
         perform sp_ArbGetAllHojas(v_ram_id_Empresa, v_clienteID);
      else
         v_ram_id_Empresa := 0;
      end if;
   end if;

   rtn := 'rtn';

   open rtn for

      --////////////////////////////////////////////////////////////////////////
      -- saldo inicial
      --
      select 0 Orden,
             0 doct_id,
             0 comp_id,
             0 as_id,
             0 id_cliente,
             0 doct_id_cliente,
             cue_codigo Codigo,
             cue_nombre Cuenta,
             p_Fini Fecha,
             '' Tipo_documento,
             '' Empresa,
             '' Documento_Origen,
             '' Circuito,
             'Saldo inicial' Comprobante,
             '' Comp_Origen,
             '' Asiento,
             '' Cliente,
             '' Proveedor,
             0 Numero,
             '' Descripcion,
             '' Centro_Costo,
             sum(asi_debe) Debe,
             sum(asi_haber) Haber,
             sum(asi_debe - asi_haber) Saldo,
             sum(case
                      when asi_debe > 0 then asi_origen
                 else 0
                    end) Debe_mon_Ext,
             sum(case
                      when asi_haber > 0 then asi_origen
                 else 0
                    end) Haber_mon_Ext,
             0 Saldo_mon_Ext,
             p_bMonExt Ver_mon_Ext
      from AsientoItem asi
      join Cuenta cue on asi.cue_id = cue.cue_id and p_bSaldo <> 0
      join Asiento ast on asi.as_id = ast.as_id
      join Documento doc on ast.doc_id = doc.doc_id
      join Empresa emp on doc.emp_id = emp.emp_id
      join CircuitoContable cico on doc.cico_id = cico.cico_id
      join DocumentoTipo doct on ast.doct_id = doct.doct_id
      left join DocumentoTipo doctcl on ast.doct_id_cliente = doctcl.doct_id
      left join Documento doccl on ast.doc_id_cliente = doccl.doc_id
      where as_fecha < p_Fini
        and p_bSaldo <> 0
        and ( exists ( select *
                       from EmpresaUsuario
                       where emp_id = doc.emp_id
                         and us_id = p_us_id )
               or ( p_us_id = 1 ) )
        and ( cue.cue_id = v_cue_id or v_cue_id = 0 )
        and ( asi.ccos_id = v_ccos_id or v_ccos_id = 0 )
        and ( coalesce(doccl.cico_id, doc.cico_id) = v_cico_id or v_cico_id = 0 )
        and ( emp.emp_id = v_emp_id or v_emp_id = 0 )

        and ( ( exists ( select rptarb_hojaid
                         from rptArbolRamaHoja
                         where rptarb_cliente = v_clienteID
                           and tbl_id = 17
                           and rptarb_hojaid = asi.cue_id ) )
                or ( v_ram_id_cuenta = 0 ) )
        and ( ( exists ( select rptarb_hojaid
                         from rptArbolRamaHoja
                         where rptarb_cliente = v_clienteID
                           and tbl_id = 21
                           and rptarb_hojaid = asi.ccos_id ) )
                or ( v_ram_id_centrocosto = 0 ) )
        and ( ( exists ( select rptarb_hojaid
                         from rptArbolRamaHoja
                         where rptarb_cliente = v_clienteID
                           and tbl_id = 1016
                           and rptarb_hojaid = coalesce(doccl.cico_id, doc.cico_id) ) )
                or ( v_ram_id_circuitocontable = 0 ) )
        and ( ( exists ( select rptarb_hojaid
                         from rptArbolRamaHoja
                         where rptarb_cliente = v_clienteID
                           and tbl_id = 1018
                           and rptarb_hojaid = doc.emp_id ) )
                or ( v_ram_id_Empresa = 0 ) )
        group by cue_codigo, cue_nombre
      union ALL

      --////////////////////////////////////////////////////////////////////////
      -- entre fechas
      --
      select 1 Orden,
               ast.doct_id doct_id,
               ast.as_id comp_id,
               ast.as_id,
               id_cliente,
               doct_id_cliente,
               cue_codigo Codigo,
               cue_nombre Cuenta,
               as_fecha Fecha,
               coalesce(doctcl.doct_nombre, doct.doct_nombre) Tipo_documento,
               emp_nombre Empresa,
               doccl.doc_nombre Documento_Origen,
               cicocl.cico_nombre Circuito,
               as_nrodoc || ' ' || coalesce(doctcli.doct_codigo, '') || ' ' || as_doc_cliente Comprobante,
               as_doc_cliente Comp_Origen,
               as_nrodoc Asiento,
               cli_nombre Cliente,
               prov_nombre Proveedor,
               as_numero Numero,
               LTRIM(rtrim(case
                              when replace(replace(as_descrip, CHR(10), ''), CHR(13), '') is null then ''
                              else as_descrip
                           end || ' ' || case
                                            when replace(replace(asi_descrip, CHR(10), ''), CHR(13), '') is null then ''
                                            else asi_descrip
                                         end)) Descripcion,
               ccos_nombre Centro_Costo,
               asi_debe Debe,
               asi_haber Haber,
               asi_debe - asi_haber Saldo,
               case
                    when asi_debe > 0 then asi_origen
               else 0
                  end Debe_mon_Ext,
               case
                    when asi_haber > 0 then asi_origen
               else 0
                  end Haber_mon_Ext,
               0 Saldo_mon_Ext,
               p_bMonExt Ver_mon_Ext
      from AsientoItem asi
      join Cuenta cue on asi.cue_id = cue.cue_id
      join Asiento ast on asi.as_id = ast.as_id
      join Documento doc on ast.doc_id = doc.doc_id
      join Empresa emp on doc.emp_id = emp.emp_id
      join CircuitoContable cico on doc.cico_id = cico.cico_id
      join DocumentoTipo doct on ast.doct_id = doct.doct_id
      left join CentroCosto ccos on asi.ccos_id = ccos.ccos_id
      left join DocumentoTipo doctcl on ast.doct_id_cliente = doctcl.doct_id
      left join Documento doccl on ast.doc_id_cliente = doccl.doc_id
      left join FacturaVenta fv on doct_id_cliente in ( 1,7,9 ) and fv.as_id = ast.as_id
      left join FacturaCompra fc on doct_id_cliente in ( 2,8,10 ) and fc.as_id = ast.as_id
      left join Cobranza cobz on doct_id_cliente = 13 and cobz.as_id = ast.as_id
      left join OrdenPago opg on doct_id_cliente = 16 and opg.as_id = ast.as_id
      left join MovimientoFondo mf on doct_id_cliente = 26 and mf.as_id = ast.as_id
      left join Cliente cli on fv.cli_id = cli.cli_id or cobz.cli_id = cli.cli_id or mf.cli_id = cli.cli_id
      left join Proveedor prov on fc.prov_id = prov.prov_id or opg.prov_id = prov.prov_id
      left join DocumentoTipo doctcli on ast.doct_id_cliente = doctcli.doct_id
      left join CircuitoContable cicocl on doccl.cico_id = cicocl.cico_id
      where as_fecha >= p_Fini
        and as_fecha <= p_Ffin
        and ( exists ( select *
                       from EmpresaUsuario
                       where emp_id = doc.emp_id and us_id = p_us_id )
              or ( p_us_id = 1 ) )
        and ( cue.cue_id = v_cue_id or v_cue_id = 0 )
        and ( ccos.ccos_id = v_ccos_id or v_ccos_id = 0 )
        and ( coalesce(doccl.cico_id, doc.cico_id) = v_cico_id or v_cico_id = 0 )
        and ( emp.emp_id = v_emp_id or v_emp_id = 0 )

        and ( ( exists ( select rptarb_hojaid
                         from rptArbolRamaHoja
                         where rptarb_cliente = v_clienteID
                           and tbl_id = 17
                           and rptarb_hojaid = asi.cue_id ) )
                or ( v_ram_id_cuenta = 0 ) )
        and ( ( exists ( select rptarb_hojaid
                         from rptArbolRamaHoja
                         where rptarb_cliente = v_clienteID
                           and tbl_id = 21
                           and rptarb_hojaid = asi.ccos_id ) )
                 or ( v_ram_id_centrocosto = 0 ) )
        and ( ( exists ( select rptarb_hojaid
                         from rptArbolRamaHoja
                         where rptarb_cliente = v_clienteID
                           and tbl_id = 1016
                           and rptarb_hojaid = coalesce(doccl.cico_id, doc.cico_id) ) )
                 or ( v_ram_id_circuitocontable = 0 ) )
        and ( ( exists ( select rptarb_hojaid
                         from rptArbolRamaHoja
                         where rptarb_cliente = v_clienteID
                           and tbl_id = 1018
                           and rptarb_hojaid = doc.emp_id ) )
                 or ( v_ram_id_Empresa = 0 ) )
        order by cuenta,
                 codigo,
                 orden,
                 Fecha,
                 Numero,
                 Comp_Origen;
end;
$BODY$
  language plpgsql volatile
  cost 100;
alter function dc_csc_con_0090(
   integer, timestamp with time zone, timestamp with time zone,
   varchar,
   varchar,
   varchar,
   integer,
   varchar,
   integer
)
  owner to postgres;