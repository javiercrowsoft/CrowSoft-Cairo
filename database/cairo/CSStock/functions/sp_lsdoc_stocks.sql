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
-- Function: sp_lsdoc_stocks()

-- drop function sp_lsdoc_stocks(integer, timestamp with time zone, timestamp with time zone, varchar, varchar, varchar, varchar);

create or replace function sp_lsdoc_stocks
/*
select * from Asiento

select * from sp_lsdoc_stocks(
1,
'20000101'::date,
'20150101'::date,
'0',
'0',
'0',
'0');
fetch all from rtn;
*/
(
  in p_us_id integer,
  in p_Fini timestamp with time zone,
  in p_Ffin timestamp with time zone,
  in p_doc_id varchar,
  in p_suc_id varchar,
  in p_lgj_id varchar,
  in p_emp_id varchar,
  out rtn refcursor
)
  returns refcursor as
$BODY$
declare
   v_doc_id integer;
   v_lgj_id integer;
   v_suc_id integer;
   v_emp_id integer;
   v_ram_id_documento integer;
   v_ram_id_sucursal integer;
   v_ram_id_legajo integer;
   v_ram_id_empresa integer;
   v_clienteID integer;
   v_IsRaiz smallint;
begin

   rtn := 'rtn';

   /*- ///////////////////////////////////////////////////////////////////////
    INICIO PRIMERA PARTE DE ARBOLES
   /////////////////////////////////////////////////////////////////////// */

   select * from sp_ArbConvertId(p_lgj_id) into v_lgj_id, v_ram_id_legajo;

   select * from sp_ArbConvertId(p_suc_id) into v_suc_id, v_ram_id_sucursal;

   select * from sp_ArbConvertId(p_doc_id) into v_doc_id, v_ram_id_documento;

   select * from sp_ArbConvertId(p_emp_id) into v_emp_id, v_ram_id_empresa;

   select * from  sp_GetRptId() into v_clienteID;

   if v_ram_id_legajo <> 0 then
   begin
      --	exec sp_ArbGetGroups @ram_id_Legajo, @clienteID, @@us_id
      select sp_ArbIsRaiz(v_ram_id_legajo) into v_IsRaiz;

      if v_IsRaiz = 0 then
      begin
         perform sp_ArbGetAllHojas(v_ram_id_legajo,
                           v_clienteID);

      end;
      else
         v_ram_id_legajo := 0;

      end if;

   end;
   end if;

   if v_ram_id_sucursal <> 0 then
   begin
      --	exec sp_ArbGetGroups @ram_id_Sucursal, @clienteID, @@us_id
      select sp_ArbIsRaiz(v_ram_id_sucursal) into v_IsRaiz;

      if v_IsRaiz = 0 then
      begin
         perform sp_ArbGetAllHojas(v_ram_id_sucursal,
                           v_clienteID);

      end;
      else
         v_ram_id_sucursal := 0;

      end if;

   end;
   end if;

   if v_ram_id_documento <> 0 then
   begin
      --	exec sp_ArbGetGroups @ram_id_Documento, @clienteID, @@us_id
      select sp_ArbIsRaiz(v_ram_id_documento) into v_IsRaiz;

      if v_IsRaiz = 0 then
      begin
         perform sp_ArbGetAllHojas(v_ram_id_documento,
                           v_clienteID);

      end;
      else
         v_ram_id_documento := 0;

      end if;

   end;
   end if;

   if v_ram_id_empresa <> 0 then
   begin
      --	exec sp_ArbGetGroups @ram_id_empresa, @clienteID, @@us_id
      select sp_ArbIsRaiz(v_ram_id_empresa) into v_IsRaiz;

      if v_IsRaiz = 0 then
      begin
         perform sp_ArbGetAllHojas(v_ram_id_empresa,
                           v_clienteID);

      end;
      else
         v_ram_id_empresa := 0;

      end if;

   end;
   end if;

   /*- ///////////////////////////////////////////////////////////////////////
    FIN PRIMERA PARTE DE ARBOLES
   /////////////////////////////////////////////////////////////////////// */

   open rtn for

      -- sp_columns Stock
      select st_id,
             '' TypeTask,
             st_numero as "Número",
             st_nrodoc Comprobante,
             doc_nombre Documento,
             st_fecha Fecha,
             case
                when lgj_titulo <> '' then lgj_titulo
                else lgj_codigo
             end Legajo,
             suc_nombre Sucursal,
             emp_nombre Empresa,
             doct.doct_nombre Tipo_Doc,
             st_doc_cliente Documento_Aux,
             Stock.creado,
             Stock.modificado,
             us_nombre Modifico,
             st_descrip Observaciones
        from Stock
        join Documento
          on Stock.doc_id = Documento.doc_id
        join Empresa
          on Documento.emp_id = Empresa.emp_id
        join Sucursal
          on Stock.suc_id = Sucursal.suc_id
        join Usuario
          on Stock.modifico = Usuario.us_id
        left join Legajo
          on Stock.lgj_id = Legajo.lgj_id
        left join DocumentoTipo doct
          on Stock.doct_id_cliente = doct.doct_id
        where p_Fini <= st_fecha
          and p_Ffin >= st_fecha

        /* -///////////////////////////////////////////////////////////////////////
        INICIO SEGUNDA PARTE DE ARBOLES
        /////////////////////////////////////////////////////////////////////// */

          and ( Sucursal.suc_id = v_suc_id
          or v_suc_id = 0 )
          and ( Documento.doc_id = v_doc_id
          or v_doc_id = 0 )
          and ( Legajo.lgj_id = v_lgj_id
          or v_lgj_id = 0 )
          and ( Empresa.emp_id = v_emp_id
          or v_emp_id = 0 )
          -- Arboles
          and ( ( exists ( select rptarb_hojaid
                           from rptArbolRamaHoja
                              where rptarb_cliente = v_clienteID
                                      and tbl_id = 21

                                      and rptarb_hojaid = Legajo.lgj_id ) )
          or ( v_ram_id_legajo = 0 ) )
          and ( ( exists ( select rptarb_hojaid
                           from rptArbolRamaHoja
                              where rptarb_cliente = v_clienteID
                                      and tbl_id = 1007

                                      and rptarb_hojaid = Sucursal.suc_id ) )
          or ( v_ram_id_sucursal = 0 ) )
          and ( ( exists ( select rptarb_hojaid
                           from rptArbolRamaHoja
                              where rptarb_cliente = v_clienteID
                                      and tbl_id = 4001

                                      and rptarb_hojaid = Documento.doc_id ) )
          or ( v_ram_id_documento = 0 ) )
          and ( ( exists ( select rptarb_hojaid
                           from rptArbolRamaHoja
                              where rptarb_cliente = v_clienteID
                                      and tbl_id = 1018

                                      and rptarb_hojaid = Empresa.emp_id ) )
          or ( v_ram_id_empresa = 0 ) )

      order by st_fecha;

end;
$BODY$
  language plpgsql volatile
  cost 100;
alter function sp_lsdoc_stocks(integer, timestamp with time zone, timestamp with time zone, varchar, varchar, varchar, varchar)
  owner to postgres;