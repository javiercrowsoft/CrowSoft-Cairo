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
-- Function: sp_lsdoc_facturas_venta()

-- drop function sp_lsdoc_presupuestos_venta(integer, date, date, varchar, varchar, varchar, varchar, varchar, varchar, varchar);

create or replace function sp_lsdoc_presupuestos_venta
(
  in p_us_id integer,
  in p_Fini date,
  in p_Ffin date,
  in p_cli_id varchar,
  in p_est_id varchar,
  in p_ccos_id varchar,
  in p_suc_id varchar,
  in p_ven_id varchar,
  in p_doc_id varchar,
  in p_cpg_id varchar,
  in p_emp_id varchar,
  out rtn refcursor
)
  returns refcursor as
$BODY$
declare
   v_cli_id integer;
   v_ccos_id integer;
   v_suc_id integer;
   v_est_id integer;
   v_ven_id integer;
   v_doc_id integer;
   v_cpg_id integer;
   v_emp_id integer;
   v_ram_id_Cliente integer;
   v_ram_id_CentroCosto integer;
   v_ram_id_Sucursal integer;
   v_ram_id_Estado integer;
   v_ram_id_Vendedor integer;
   v_ram_id_Documento integer;
   v_ram_id_CondicionPago integer;
   v_ram_id_Empresa integer;
   v_clienteID integer;
   v_IsRaiz smallint;
begin

   rtn := 'rtn';
   
   /*- ///////////////////////////////////////////////////////////////////////
    INICIO PRIMERA PARTE DE ARBOLES
   /////////////////////////////////////////////////////////////////////// */
   
   select * from sp_ArbConvertId(p_cli_id) into v_cli_id, v_ram_id_Cliente;

   select * from sp_ArbConvertId(p_ccos_id) into v_ccos_id, v_ram_id_CentroCosto;

   select * from sp_ArbConvertId(p_suc_id) into v_suc_id, v_ram_id_Sucursal;

   select * from sp_ArbConvertId(p_est_id) into v_est_id, v_ram_id_Estado;

   select * from sp_ArbConvertId(p_ven_id) into v_ven_id, v_ram_id_Vendedor;

   select * from sp_ArbConvertId(p_doc_id) into v_doc_id, v_ram_id_Documento;

   select * from sp_ArbConvertId(p_cpg_id) into v_cpg_id, v_ram_id_CondicionPago;

   select * from sp_ArbConvertId(p_emp_id) into v_emp_id, v_ram_id_Empresa;

   select * from  sp_GetRptId() into v_clienteID;

   if v_ram_id_Cliente <> 0 then
   begin
      --	exec sp_ArbGetGroups @ram_id_Cliente, @clienteID, @@us_id
      select sp_ArbIsRaiz(v_ram_id_Cliente) into v_IsRaiz;

      if v_IsRaiz = 0 then
      begin
         perform sp_ArbGetAllHojas(v_ram_id_Cliente,
                           v_clienteID);

      end;
      else
         v_ram_id_Cliente := 0;

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

   if v_ram_id_Estado <> 0 then
   begin
      --	exec sp_ArbGetGroups @ram_id_Estado, @clienteID, @@us_id
      select sp_ArbIsRaiz(v_ram_id_Estado) into v_IsRaiz;

      if v_IsRaiz = 0 then
      begin
         perform sp_ArbGetAllHojas(v_ram_id_Estado,
                           v_clienteID);

      end;
      else
         v_ram_id_Estado := 0;

      end if;

   end;
   end if;

   if v_ram_id_Sucursal <> 0 then
   begin
      --	exec sp_ArbGetGroups @ram_id_Sucursal, @clienteID, @@us_id
      select sp_ArbIsRaiz(v_ram_id_Sucursal) into v_IsRaiz;

      if v_IsRaiz = 0 then
      begin
         perform sp_ArbGetAllHojas(v_ram_id_Sucursal,
                           v_clienteID);

      end;
      else
         v_ram_id_Sucursal := 0;

      end if;

   end;
   end if;

   if v_ram_id_Vendedor <> 0 then
   begin
      --	exec sp_ArbGetGroups @ram_id_Vendedor, @clienteID, @@us_id
      select sp_ArbIsRaiz(v_ram_id_Vendedor) into v_IsRaiz;

      if v_IsRaiz = 0 then
      begin
         perform sp_ArbGetAllHojas(v_ram_id_Vendedor,
                           v_clienteID);

      end;
      else
         v_ram_id_Vendedor := 0;

      end if;

   end;
   end if;

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

   open rtn for

      select prv_id,
             '' TypeTask,
             prv_numero N_mero,
             prv_nrodoc Comprobante,
             cli_nombre Cliente,
             doc_nombre Documento,
             est_nombre Estado,
             prv_fecha Fecha,
             prv_fechaentrega Fecha_de_entrega,
             prv_neto Neto,
             prv_ivari IVA_RI,
             prv_ivarni IVA_RNI,
             prv_subtotal Subtotal,
             prv_total Total,
             prv_pendiente Pendiente,
             case prv_firmado
                when 0 then 'No'
                else 'Si'
             end Firmado,
             prv_descuento1 Desc_1,
             prv_descuento2 Desc_2,
             prv_importedesc1 Desc_1,
             prv_importedesc2 Desc_2,
             lp_nombre Lista_de_Precios,
             ld_nombre Lista_de_descuentos,
             cpg_nombre Condicion_de_Pago,
             ccos_nombre Centro_de_costo,
             suc_nombre Sucursal,
             emp_nombre Empresa,
             PresupuestoVenta.creado,
             PresupuestoVenta.modificado,
             us_nombre Modifico,
             prv_descrip Observaciones
      from PresupuestoVenta
      join Documento
        on PresupuestoVenta.doc_id = Documento.doc_id
      join Empresa
        on Documento.emp_id = Empresa.emp_id
      join CondicionPago
        on PresupuestoVenta.cpg_id = CondicionPago.cpg_id
      join Estado
        on PresupuestoVenta.est_id = Estado.est_id
      join Sucursal
        on PresupuestoVenta.suc_id = Sucursal.suc_id
      join Cliente
        on PresupuestoVenta.cli_id = Cliente.cli_id
      join Usuario
        on PresupuestoVenta.modifico = Usuario.us_id
      left join Vendedor
        on PresupuestoVenta.ven_id = Vendedor.ven_id
      left join CentroCosto
        on PresupuestoVenta.ccos_id = CentroCosto.ccos_id
      left join ListaPrecio
        on PresupuestoVenta.lp_id = ListaPrecio.lp_id
      left join ListaDescuento
        on PresupuestoVenta.ld_id = ListaDescuento.ld_id
      where p_Fini <= prv_fecha
        and p_Ffin >= prv_fecha

      /* -///////////////////////////////////////////////////////////////////////
      INICIO SEGUNDA PARTE DE ARBOLES
      /////////////////////////////////////////////////////////////////////// */
        and ( Cliente.cli_id = v_cli_id
        or v_cli_id = 0 )
        and ( Estado.est_id = v_est_id
        or v_est_id = 0 )
        and ( Sucursal.suc_id = v_suc_id
        or v_suc_id = 0 )
        and ( Documento.doc_id = v_doc_id
        or v_doc_id = 0 )
        and ( CondicionPago.cpg_id = v_cpg_id
        or v_cpg_id = 0 )
        and ( CentroCosto.ccos_id = v_ccos_id
        or v_ccos_id = 0 )
        and ( Vendedor.ven_id = v_ven_id
        or v_ven_id = 0 )
        and ( Empresa.emp_id = v_emp_id
        or v_emp_id = 0 )
        -- Arboles
        and ( ( exists ( select rptarb_hojaid
                         from rptArbolRamaHoja
                            where rptarb_cliente = v_clienteID
                                    and tbl_id = 28
                                    and rptarb_hojaid = Cliente.cli_id ) )
        or ( v_ram_id_Cliente = 0 ) )
        and ( ( exists ( select rptarb_hojaid
                         from rptArbolRamaHoja
                            where rptarb_cliente = v_clienteID
                                    and tbl_id = 21
                                    and rptarb_hojaid = CentroCosto.ccos_id ) )
        or ( v_ram_id_CentroCosto = 0 ) )
        and ( ( exists ( select rptarb_hojaid
                         from rptArbolRamaHoja
                            where rptarb_cliente = v_clienteID
                                    and tbl_id = 4005
                                    and rptarb_hojaid = Estado.est_id ) )
        or ( v_ram_id_Estado = 0 ) )
        and ( ( exists ( select rptarb_hojaid
                         from rptArbolRamaHoja
                            where rptarb_cliente = v_clienteID
                                    and tbl_id = 1007
                                    and rptarb_hojaid = Sucursal.suc_id ) )
        or ( v_ram_id_Sucursal = 0 ) )
        and ( ( exists ( select rptarb_hojaid
                         from rptArbolRamaHoja
                            where rptarb_cliente = v_clienteID
                                    and tbl_id = 15
                                    and rptarb_hojaid = Vendedor.ven_id ) )
        or ( v_ram_id_Vendedor = 0 ) )
        and ( ( exists ( select rptarb_hojaid
                         from rptArbolRamaHoja
                            where rptarb_cliente = v_clienteID
                                    and tbl_id = 4001
                                    and rptarb_hojaid = Documento.doc_id ) )
        or ( v_ram_id_Documento = 0 ) )
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

      order by prv_fecha;

end;
$BODY$
  language plpgsql volatile
  cost 100;
alter function sp_lsdoc_presupuestos_venta(integer, date, date, varchar, varchar, varchar, varchar, varchar, varchar, varchar, varchar)
  owner to postgres;