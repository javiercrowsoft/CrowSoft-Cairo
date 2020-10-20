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
-- Function: sp_lsdoc_facturas_compra()

-- drop function sp_lsdoc_facturas_compra(integer, date, date, varchar, varchar, varchar, varchar, varchar, varchar, varchar);

create or replace function sp_lsdoc_facturas_compra
/*
select * from FacturaCompra

select * from sp_lsdoc_facturas_compra(
1,
'2020-09-30'::date,
'2020-09-30'::date,
'0',
'0',
'0',
'0',
'0',
'0',
'0');
fetch all from rtn;
*/
(
  in p_us_id integer,
  in p_Fini date,
  in p_Ffin date,
  in p_prov_id varchar,
  in p_est_id varchar,
  in p_ccos_id varchar,
  in p_suc_id varchar,
  in p_doc_id varchar,
  in p_cpg_id varchar,
  in p_emp_id varchar,
  out rtn refcursor
)
  returns refcursor as
$BODY$
declare
   v_prov_id integer;
   v_ccos_id integer;
   v_suc_id integer;
   v_est_id integer;
   v_doc_id integer;
   v_cpg_id integer;
   v_emp_id integer;
   v_ram_id_proveedor integer;
   v_ram_id_CentroCosto integer;
   v_ram_id_sucursal integer;
   v_ram_id_estado integer;
   v_ram_id_vendedor integer;
   v_ram_id_documento integer;
   v_ram_id_CondicionPago integer;
   v_ram_id_empresa integer;
   v_clienteID integer;
   v_IsRaiz smallint;
begin

/*debug
p_us_id := 1;
p_Fini := '20000101'::date;
p_Ffin := '20150101'::date;
p_prov_id := '0';
p_est_id := '0';
p_ccos_id := '0';
p_suc_id := '0';
p_doc_id := '0';
p_cpg_id := '0';
p_emp_id := '0';
end debug*/

   rtn := 'rtn';

   /*- ///////////////////////////////////////////////////////////////////////
    INICIO PRIMERA PARTE DE ARBOLES
   /////////////////////////////////////////////////////////////////////// */

   select * from sp_ArbConvertId(p_prov_id) into v_prov_id, v_ram_id_proveedor;

   select * from sp_ArbConvertId(p_ccos_id) into v_ccos_id, v_ram_id_CentroCosto;

   select * from  sp_ArbConvertId(p_suc_id) into v_suc_id, v_ram_id_sucursal;

   select * from  sp_ArbConvertId(p_est_id) into v_est_id, v_ram_id_estado;

   select * from  sp_ArbConvertId(p_doc_id) into v_doc_id, v_ram_id_documento;

   select * from  sp_ArbConvertId(p_cpg_id) into v_cpg_id, v_ram_id_CondicionPago;

   select * from  sp_ArbConvertId(p_emp_id) into v_emp_id, v_ram_id_empresa;

   select * from  sp_GetRptId() into v_clienteID;

   if v_ram_id_proveedor <> 0 then
   begin
      --	exec sp_ArbGetGroups @ram_id_Proveedor, @clienteID, @@us_id
      select sp_ArbIsRaiz(v_ram_id_proveedor) into v_IsRaiz;

      if v_IsRaiz = 0 then
      begin
         perform sp_ArbGetAllHojas(v_ram_id_proveedor,
                           v_clienteID);

      end;
      else
         v_ram_id_proveedor := 0;

      end if;

   end;
   end if;

   if v_ram_id_CentroCosto <> 0 then
   begin
      --	exec sp_ArbGetGroups @ram_id_CentroCosto, @clienteID, @@us_id
      select sp_ArbIsRaiz(v_ram_id_CentroCosto) into v_IsRaiz;

      if v_IsRaiz = 0 then
      begin
         perform sp_ArbGetAllHojas(v_ram_id_CentroCosto,
                           v_clienteID);

      end;
      else
         v_ram_id_CentroCosto := 0;

      end if;

   end;
   end if;

   if v_ram_id_estado <> 0 then
   begin
      --	exec sp_ArbGetGroups @ram_id_Estado, @clienteID, @@us_id
      select sp_ArbIsRaiz(v_ram_id_estado) into v_IsRaiz;

      if v_IsRaiz = 0 then
      begin
         perform sp_ArbGetAllHojas(v_ram_id_estado,
                           v_clienteID);

      end;
      else
         v_ram_id_estado := 0;

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

   if v_ram_id_vendedor <> 0 then
   begin
      --	exec sp_ArbGetGroups @ram_id_Vendedor, @clienteID, @@us_id
      select sp_ArbIsRaiz(v_ram_id_vendedor) into v_IsRaiz;

      if v_IsRaiz = 0 then
      begin
         perform sp_ArbGetAllHojas(v_ram_id_vendedor,
                           v_clienteID);

      end;
      else
         v_ram_id_vendedor := 0;

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

   if v_ram_id_CondicionPago <> 0 then
   begin
      --	exec sp_ArbGetGroups @ram_id_CondicionPago, @clienteID, @@us_id
      select sp_ArbIsRaiz(v_ram_id_CondicionPago) into v_IsRaiz;

      if v_IsRaiz = 0 then
      begin
         perform sp_ArbGetAllHojas(v_ram_id_CondicionPago,
                           v_clienteID);

      end;
      else
         v_ram_id_CondicionPago := 0;

      end if;

   end;
   end if;

   if v_ram_id_empresa <> 0 then
   begin
      --	exec sp_ArbGetGroups @ram_id_Empresa, @clienteID, @@us_id
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

      select fc_id,
             '' TypeTask,
             fc_numero as "Número",
             fc_nrodoc Comprobante,
             prov_nombre Proveedor,
             doc_nombre Documento,
             est_nombre Estado,
             case fc_tipocomprobante
                when 1 then 'Original'
                when 2 then 'Fax'
                when 3 then 'Fotocopia'
                when 4 then 'Duplicado'
             end Tipo_Comprobante,
             fc_fecha Fecha,
             fc_fechaentrega Fecha_de_entrega,
             fc_fechaiva Fecha_IVA,
             fc_neto Neto,
             fc_ivari IVA_RI,
             fc_ivarni IVA_RNI,
             fc_totalotros Otros,
             fc_subtotal Subtotal,
             fc_total Total,
             fc_pendiente Pendiente,
             case fc_firmado
                when 0 then 'No'
                else 'Si'
             end Firmado,
             fc_descuento1 Desc_1,
             fc_descuento2 Desc_2,
             fc_importedesc1 Desc_1,
             fc_importedesc2 Desc_2,
             lp_nombre Lista_de_Precios,
             ld_nombre Lista_de_descuentos,
             cpg_nombre Condicion_de_Pago,
             ccos_nombre Centro_de_costo,
             suc_nombre Sucursal,
             emp_nombre Empresa,
             FacturaCompra.creado,
             FacturaCompra.modificado,
             us_nombre Modifico,
             fc_descrip Observaciones
        from FacturaCompra
        join Documento
          on FacturaCompra.doc_id = Documento.doc_id
        join Empresa
          on Documento.emp_id = Empresa.emp_id
        join CondicionPago
          on FacturaCompra.cpg_id = CondicionPago.cpg_id
        join Estado
          on FacturaCompra.est_id = Estado.est_id
        join Sucursal
          on FacturaCompra.suc_id = Sucursal.suc_id
        join Proveedor
          on FacturaCompra.prov_id = Proveedor.prov_id
        join Usuario
          on FacturaCompra.modifico = Usuario.us_id
        left join CentroCosto
          on FacturaCompra.ccos_id = CentroCosto.ccos_id
        left join ListaPrecio
          on FacturaCompra.lp_id = ListaPrecio.lp_id
        left join ListaDescuento
          on FacturaCompra.ld_id = ListaDescuento.ld_id
        where p_Fini <= fc_fecha
          and p_Ffin >= fc_fecha

        /* -///////////////////////////////////////////////////////////////////////
        INICIO SEGUNDA PARTE DE ARBOLES
        /////////////////////////////////////////////////////////////////////// */

          and ( Proveedor.prov_id = v_prov_id
          or v_prov_id = 0 )
          and ( Estado.est_id = v_est_id
          or v_est_id = 0 )
          and ( Sucursal.suc_id = v_suc_id
          or v_suc_id = 0 )
          and ( Documento.doc_id = v_doc_id
          or v_doc_id = 0 )
          and ( CondicionPago.cpg_id = v_cpg_id
          or v_cpg_id = 0 )
          and ( FacturaCompra.ccos_id = v_ccos_id
          or v_ccos_id = 0
          or exists ( select *
                      from FacturaCompraItem fci
                         where fci.fc_id = FacturaCompra.fc_id
                                 and fci.ccos_id = v_ccos_id ) )
          and ( Empresa.emp_id = v_emp_id
          or v_emp_id = 0 )
          -- Arboles
          and ( ( exists ( select rptarb_hojaid
                           from rptArbolRamaHoja
                              where rptarb_cliente = v_clienteID
                                      and tbl_id = 29
                                      and rptarb_hojaid = Proveedor.prov_id ) )
          or ( v_ram_id_proveedor = 0 ) )
          and ( ( exists ( select rptarb_hojaid
                           from rptArbolRamaHoja
                              where rptarb_cliente = v_clienteID
                                      and tbl_id = 21
                                      and ( rptarb_hojaid = FacturaCompra.ccos_id
                                      or exists ( select *
                                                  from FacturaCompraItem fci
                                                     where fci.fc_id = FacturaCompra.fc_id
                                                             and fci.ccos_id = rptarb_hojaid ) ) ) )
          or ( v_ram_id_CentroCosto = 0 ) )
          and ( ( exists ( select rptarb_hojaid
                           from rptArbolRamaHoja
                              where rptarb_cliente = v_clienteID
                                      and tbl_id = 4005
                                      and rptarb_hojaid = Estado.est_id ) )
          or ( v_ram_id_estado = 0 ) )
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
                                      and tbl_id = 1005
                                      and rptarb_hojaid = CondicionPago.cpg_id ) )
          or ( v_ram_id_CondicionPago = 0 ) )
          and ( ( exists ( select rptarb_hojaid
                           from rptArbolRamaHoja
                              where rptarb_cliente = v_clienteID
                                      and tbl_id = 1018
                                      and rptarb_hojaid = Empresa.emp_id ) )
          or ( v_ram_id_empresa = 0 ) )

        order by fc_fecha;

end;
$BODY$
  language plpgsql volatile
  cost 100;
alter function sp_lsdoc_facturas_compra(integer, date, date, varchar, varchar, varchar, varchar, varchar, varchar, varchar)
  owner to postgres;