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
-- Function: sp_lsdoc_asientos()

-- drop function sp_lsdoc_asientos(integer, date, date, varchar, varchar);

create or replace function sp_lsdoc_asientos
/*
select * from Asiento

select * from sp_lsdoc_asientos(
1,
'20000101'::date,
'20150101'::date,
'0',
'0');
fetch all from rtn;
*/
(
  in p_us_id integer,
  in p_Fini date,
  in p_Ffin date,
  in p_doc_id varchar,
  in p_emp_id varchar,
  out rtn refcursor
)
  returns refcursor as
$BODY$
declare
   v_doc_id integer;
   v_emp_id integer;
   v_ram_id_Documento integer;
   v_ram_id_empresa integer;
   v_clienteID integer;
   v_IsRaiz smallint;
begin

   rtn := 'rtn';

   /*- ///////////////////////////////////////////////////////////////////////
    INICIO PRIMERA PARTE DE ARBOLES
   /////////////////////////////////////////////////////////////////////// */

   select * from sp_ArbConvertId(p_doc_id) into v_doc_id, v_ram_id_Documento;

   select * from sp_ArbConvertId(p_emp_id) into v_emp_id, v_ram_id_empresa;

   select * from  sp_GetRptId() into v_clienteID;

   if v_ram_id_Documento <> 0 then
   begin
      --	exec sp_ArbGetGroups @ram_id_Documento, @clienteID, @@us_id
      select sp_ArbIsRaiz(v_ram_id_Documento) into v_IsRaiz;

      if v_IsRaiz = 0 then
      begin
         perform sp_ArbGetAllHojas(v_ram_id_Documento,
                           v_clienteID);

      end;
      else
         v_ram_id_Documento := 0;

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

      select as_id,
             '' TypeTask,
             as_numero as "Número",
             as_nrodoc Comprobante,
             doc_nombre Documento,
             as_fecha Fecha,
             case doct_id_cliente
                when 1  then 'Factura de Venta'
                when 2  then 'Factura de Compra'
                when 7  then 'Nota de Credito Venta'
                when 8  then 'Nota de Credito Compra'
                when 9  then 'Nota de Debito Venta'
                when 10 then 'Nota de Debito Compra'
                when 13 then 'Cobranza'
                when 16 then 'Orden de Pago'
                when 17 then 'Deposito Banco'
                when 26 then 'Movimiento de Fondos'
             end Tipo_Doc,
             as_doc_cliente Documento_Aux,
             emp_nombre Empresa,
             ( select sum(asi_debe)
               from AsientoItem
               where as_id = Asiento.as_id
                 and asi_debe <> 0 ) Total,
             Asiento.creado,
             Asiento.modificado,
             us_nombre Modifico,
             as_descrip Observaciones
        from Asiento
        join Documento
          on Asiento.doc_id = Documento.doc_id
        join Usuario
          on Asiento.modifico = Usuario.us_id
        join Empresa
          on Documento.emp_id = Empresa.emp_id
        where p_Fini <= as_fecha
          and p_Ffin >= as_fecha

        /* -///////////////////////////////////////////////////////////////////////
        INICIO SEGUNDA PARTE DE ARBOLES
        /////////////////////////////////////////////////////////////////////// */
        
          and ( Documento.doc_id = v_doc_id
          or v_doc_id = 0 )
          and ( Empresa.emp_id = v_emp_id
          or v_emp_id = 0 )
          -- Arboles
          and ( ( exists ( select rptarb_hojaid
                           from rptArbolRamaHoja
                              where rptarb_cliente = v_clienteID
                                      and tbl_id = 4001
       
                                      and rptarb_hojaid = Documento.doc_id ) )
          or ( v_ram_id_Documento = 0 ) )
          and ( ( exists ( select rptarb_hojaid
                           from rptArbolRamaHoja
                              where rptarb_cliente = v_clienteID
                                      and tbl_id = 1018
       
                                      and rptarb_hojaid = Empresa.emp_id ) )
          or ( v_ram_id_empresa = 0 ) )
          
        order by as_fecha;

end;
$BODY$
  language plpgsql volatile
  cost 100;
alter function sp_lsdoc_asientos(integer, date, date, varchar, varchar)
  owner to postgres;