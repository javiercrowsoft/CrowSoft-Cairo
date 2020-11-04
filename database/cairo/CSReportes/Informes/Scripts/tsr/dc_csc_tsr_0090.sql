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
-- Function: dc_csc_tsr_0090(integer, timestamp with time zone, timestamp with time zone, character varying, character varying, character varying, character varying, smallint, character varying, smallint, smallint, smallint)

-- drop function dc_csc_tsr_0090(integer, timestamp with time zone, timestamp with time zone, character varying, character varying, character varying, character varying, smallint, character varying, smallint, smallint, smallint);

create or replace function dc_csc_tsr_0090(

  in p_us_id integer,
  in p_Fini timestamp with time zone,
  in p_Ffin timestamp with time zone,

  in p_cue_id varchar,
  in p_bco_id varchar,
  in p_cli_id varchar,
  in p_emp_id varchar,
  out rtn refcursor
)
  returns refcursor as
$BODY$
declare

   v_us_empresaEx smallint;

   v_cue_id integer;
   v_bco_id integer;
   v_cli_id integer;
   v_emp_id integer;

   v_ram_id_cuenta  integer;
   v_ram_id_banco   integer;
   v_ram_id_cliente integer;
   v_ram_id_empresa integer;

   v_clienteID integer;
   v_isRaiz    smallint;

   v_arb_id      integer;
   v_arb_nombre  varchar;  
   v_n           integer := 2;
   v_raiz        integer;

begin

   select us_empresaEx into v_us_empresaEx from Usuario where us_id = p_us_id;

   select * from sp_ArbConvertId(p_cue_id) into v_cue_id, v_ram_id_cuenta;
   select * from sp_ArbConvertId(p_bco_id) into v_bco_id, v_ram_id_banco;
   select * from sp_ArbConvertId(p_cli_id) into v_cli_id, v_ram_id_cliente;
   select * from sp_ArbConvertId(p_emp_id) into v_emp_id, v_ram_id_empresa;

   select * from  sp_GetRptId() into v_clienteID;

   if v_ram_id_cuenta <> 0 then
      --	exec sp_ArbGetGroups @ram_id_cuenta, @clienteID, @@us_id
      select sp_ArbIsRaiz(v_ram_id_cuenta) into v_isRaiz;
      if v_isRaiz = 0 then
         perform sp_ArbGetAllHojas(v_ram_id_cuenta, v_clienteID);
      else
         v_ram_id_cuenta := 0;
      end if;
   end if;

   if v_ram_id_banco <> 0 then
      --	exec sp_ArbGetGroups @ram_id_banco, @clienteID, @@us_id
      select sp_ArbIsRaiz(v_ram_id_banco) into v_isRaiz;
      if v_isRaiz = 0 then
         perform sp_ArbGetAllHojas(v_ram_id_banco, v_clienteID);
      else
         v_ram_id_banco := 0;
      end if;
   end if;

   if v_ram_id_cliente <> 0 then
      --	exec sp_ArbGetGroups @ram_id_cliente, @clienteID, @@us_id
      select sp_ArbIsRaiz(v_ram_id_cliente) into v_isRaiz;
      if v_isRaiz = 0 then
         perform sp_ArbGetAllHojas(v_ram_id_cliente, v_clienteID);
      else
         v_ram_id_cliente := 0;
      end if;
   end if;

   if v_ram_id_empresa <> 0 then
      --	exec sp_ArbGetGroups @ram_id_Empresa, @clienteID, @@us_id
      select sp_ArbIsRaiz(v_ram_id_empresa) into v_isRaiz;
      if v_isRaiz = 0 then
         perform sp_ArbGetAllHojas(v_ram_id_empresa, v_clienteID);
      else
         v_ram_id_empresa := 0;
      end if;
   end if;

   rtn := 'rtn';

   open rtn for

      select 1 orden_id,
               cheq.cheq_id,
               cheq.cheq_propio cheq_propio_id,-- Es para que la grilla oculte la columna
               emp.emp_nombre Empresa,
               docCobz.doc_nombre Doc_Cobranza,
               cobz.cobz_nrodoc Cobranza,
               cobz.cobz_numero Cobranza_Numero,
               docMf.doc_nombre Doc_Fondos,
               mf.mf_nrodoc Mov_Fondos,
               mf.mf_numero Mov_Fondos_Numero,
               cli.cli_codigo Codigo,
               cli.cli_nombre Cliente,
               b.bco_nombre Banco,
               c.cue_nombre Cuenta,
               M.mon_nombre Moneda,
               cheq.cheq_numero Numero,
               coalesce(cobz.cobz_id, mf.mf_id) comp_id,
               coalesce(cobz.doct_id, mf.mf_id) doct_id,
               emp.emp_nombre Empresa,
               coalesce(docCobz.doc_nombre, docMf.doc_nombre) Documento,
               coalesce('COB ' || cobz.cobz_nrodoc, 'MF ' || mf.mf_nrodoc) Doc_Comprobante,
               coalesce(cobz.cobz_numero, mf.mf_numero) Doc_Numero,
               cheq.cheq_numerodoc Comprobante,
               cle.cle_nombre Clearing,
               cheq.cheq_fechacobro Fecha_Cobro,
               dateadd('D', cle.cle_dias, cheq.cheq_fechacobro) Fecha_Acreditacion,
               cheq.cheq_fechaVto Fecha_Vto,
               case cheq.cheq_rechazado
                  when 0 then 'No'
                  else 'Si'
               end Rechazado,
               cheq.cheq_fechaRechazo Fecha_Rechazo,
               coalesce(l1.lgj_codigo, l2.lgj_codigo) Legajo,
               case cheq.cheq_propio
                  when 0 then 'No'
                  else 'Si'
               end Propio,
               cheq.cheq_importe Importe,
               ltrim(coalesce(cheq.cheq_descrip, '') || ' ' || coalesce(cobz.cobz_descrip, '') || ' ' || coalesce(mf.mf_descrip, '')) Observaciones

      from Cheque cheq
      join Banco b
        on cheq.bco_id = b.bco_id
      join Moneda M
        on cheq.mon_id = M.mon_id
      join Empresa emp
        on cheq.emp_id = emp.emp_id
      left join Cliente cli
        on cheq.cli_id = cli.cli_id
      join Clearing cle
        on cheq.cle_id = cle.cle_id
      left join Cobranza cobz
        on cheq.cobz_id = cobz.cobz_id
      left join Documento docCobz
        on cobz.doc_id = docCobz.doc_id
      left join Legajo l1
        on cobz.lgj_id = l1.lgj_id
      left join MovimientoFondo mf
        on cheq.mf_id = mf.mf_id
      left join Documento docMf
        on mf.doc_id = docMf.doc_id
      left join Legajo l2
        on mf.lgj_id = l2.lgj_id
      left join Cuenta c
        on cheq.cue_id = c.cue_id

      where (   ( p_Fini <= cobz.cobz_fecha and p_Ffin >= cobz.cobz_fecha )
             or ( p_Fini <= mf.mf_fecha and p_Ffin >= mf.mf_fecha )
            )
        and c.cuec_id = 1-- Documentos en Cartera
        and cheq.cheq_rechazado = 0

        and ( exists ( select *
                       from EmpresaUsuario
                       where emp_id = cheq.emp_id and us_id = p_us_id )
              or ( p_us_id = 1 ) )

        and ( exists ( select *
                       from UsuarioEmpresa
                       where cli_id = cheq.cli_id and us_id = p_us_id )
              or ( v_us_empresaEx = 0 ) )

        and ( c.cue_id = v_cue_id or v_cue_id = 0 )
        and ( b.bco_id = v_bco_id or v_bco_id = 0 )
        and ( cheq.cli_id = v_cli_id or v_cli_id = 0 )
        and ( cheq.emp_id = v_emp_id or v_emp_id = 0 )

        and ( ( exists ( select rptarb_hojaid
                         from rptArbolRamaHoja
                         where rptarb_cliente = v_clienteID
                           and tbl_id = -1017
                           and rptarb_hojaid = c.cue_id ) )
                or ( v_ram_id_cuenta = 0 ) )

        and ( ( exists ( select rptarb_hojaid
                         from rptArbolRamaHoja
                         where rptarb_cliente = v_clienteID
                           and tbl_id = 13
                           and rptarb_hojaid = b.bco_id ) )
               or ( v_ram_id_banco = 0 ) )

        and ( ( exists ( select rptarb_hojaid
                         from rptArbolRamaHoja
                         where rptarb_cliente = v_clienteID
                           and tbl_id = 28
                           and rptarb_hojaid = cheq.cli_id ) )
                or ( v_ram_id_cliente = 0 ) )

        and ( ( exists ( select rptarb_hojaid
                         from rptArbolRamaHoja
                         where rptarb_cliente = v_clienteID
                           and tbl_id = 1018
                           and rptarb_hojaid = cheq.emp_id ) )
                or ( v_ram_id_empresa = 0 ) );

end;
$BODY$
  language plpgsql volatile
  cost 100;
alter function dc_csc_tsr_0090(integer, timestamp with time zone, timestamp with time zone, character varying, character varying, character varying, character varying)
  owner to postgres;
