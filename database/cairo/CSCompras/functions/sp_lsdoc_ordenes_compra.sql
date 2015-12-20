create or replace function sp_lsdoc_OrdenesCompra
/*
select * from OrdenCompra
sp_docOrdenCompraget 47
sp_lsdoc_OrdenesCompra  1,	'20030101',	'20051001',		'0',		'0',		'0',		'0',		'0',		'0',		'0'
*/
(
  in p_us_id integer,
  p_Fini in date default null,
  p_Ffin in date default null,
  p_prov_id in varchar default null,
  p_est_id in varchar default null,
  p_ccos_id in varchar default null,
  p_suc_id in varchar default null,
  p_doc_id in varchar default null,
  p_cpg_id in varchar default null,
  p_emp_id in varchar default null,
  out rtn refcursor
)
as
/*- ///////////////////////////////////////////////////////////////////////
INICIO PRIMERA PARTE DE ARBOLES
/////////////////////////////////////////////////////////////////////// */
   v_prov_id integer;
   v_ccos_id integer;
   v_suc_id integer;
   v_est_id integer;
   v_doc_id integer;
   v_cpg_id integer;
   v_emp_id integer;
   v_ram_id_Proveedor integer;
   v_ram_id_CentroCosto integer;
   v_ram_id_Sucursal integer;
   v_ram_id_Estado integer;
   v_ram_id_Documento integer;
   v_ram_id_CondicionPago integer;
   v_ram_id_Empresa integer;
   v_ClienteID integer;
   v_IsRaiz smallint;
begin

   select * from sp_ArbConvertId(p_prov_id) into v_prov_id, v_ram_id_Proveedor;

   select * from sp_ArbConvertId(p_ccos_id) into v_ccos_id, v_ram_id_CentroCosto;

   select * from sp_ArbConvertId(p_suc_id) into v_suc_id, v_ram_id_Sucursal;

   select * from sp_ArbConvertId(p_est_id) into v_est_id, v_ram_id_Estado;

   select * from sp_ArbConvertId(p_doc_id) into v_doc_id, v_ram_id_Documento;

   select * from sp_ArbConvertId(p_cpg_id) into v_cpg_id, v_ram_id_CondicionPago;

   select * from sp_ArbConvertId(p_emp_id) into v_emp_id, v_ram_id_Empresa;

   select * from  sp_GetRptId() into v_clienteID;

   if v_ram_id_Proveedor <> 0 then
   begin
      --	exec sp_ArbGetGroups @ram_id_Proveedor, @ClienteID, @@us_id
      select sp_ArbIsRaiz(v_ram_id_Proveedor) into v_IsRaiz;

      if v_IsRaiz = 0 then
      begin
         sp_ArbGetAllHojas(v_ram_id_Proveedor,
                           v_ClienteID);

      end;
      else
         v_ram_id_Proveedor := 0;

      end if;

   end;
   end if;

   if v_ram_id_CentroCosto <> 0 then
   begin
      --	exec sp_ArbGetGroups @ram_id_CentroCosto, @ClienteID, @@us_id
      select sp_ArbIsRaiz(v_ram_id_CentroCosto) into v_IsRaiz;

      if v_IsRaiz = 0 then
      begin
         sp_ArbGetAllHojas(v_ram_id_CentroCosto,
                           v_ClienteID);

      end;
      else
         v_ram_id_CentroCosto := 0;

      end if;

   end;
   end if;

   if v_ram_id_Estado <> 0 then
   begin
      select sp_ArbIsRaiz(v_ram_id_Estado) into v_IsRaiz;

      if v_IsRaiz = 0 then
      begin
         sp_ArbGetAllHojas(v_ram_id_Estado,
                           v_ClienteID);

      end;
      else
         v_ram_id_Estado := 0;

      end if;

   end;
   end if;

   if v_ram_id_Sucursal <> 0 then
   begin
      --	exec sp_ArbGetGroups @ram_id_Sucursal, @ClienteID, @@us_id
      select sp_ArbIsRaiz(v_ram_id_Sucursal) into v_IsRaiz;

      if v_IsRaiz = 0 then
      begin
         sp_ArbGetAllHojas(v_ram_id_Sucursal,
                           v_ClienteID);

      end;
      else
         v_ram_id_Sucursal := 0;

      end if;

   end;
   end if;

   if v_ram_id_Documento <> 0 then
   begin
      select sp_ArbIsRaiz(v_ram_id_Documento) into v_IsRaiz;

      if v_IsRaiz = 0 then
      begin
         sp_ArbGetAllHojas(v_ram_id_Documento,
                           v_ClienteID);

      end;
      else
         v_ram_id_Documento := 0;

      end if;

   end;
   end if;

   if v_ram_id_CondicionPago <> 0 then
   begin
      --	exec sp_ArbGetGroups @ram_id_CondicionPago, @ClienteID, @@us_id
      select sp_ArbIsRaiz(v_ram_id_CondicionPago) into v_IsRaiz;

      if v_IsRaiz = 0 then
      begin
         sp_ArbGetAllHojas(v_ram_id_CondicionPago,
                           v_ClienteID);

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
         sp_ArbGetAllHojas(v_ram_id_empresa,
                           v_clienteID);

      end;
      else
         v_ram_id_empresa := 0;

      end if;

   end;
   end if;

   open rtn for
/*- ///////////////////////////////////////////////////////////////////////
FIN PRIMERA PARTE DE ARBOLES
/////////////////////////////////////////////////////////////////////// */
      -- sp_columns OrdenCompra
      select oc_id,
                     '' TypeTask,
                     oc_numero as "Número",
                     oc_nrodoc Comprobante,
                     prov_nombre Proveedor,
                     doc_nombre Documento,
                     est_nombre Estado,
                     oc_fecha Fecha,
                     oc_fechaentrega Fecha_de_entrega,
                     case impreso
                                 when 0 then 'No'
                     else 'Si'
                        end Impreso,
                     oc_neto Neto,
                     oc_ivari IVA_RI,
                     oc_ivarni IVA_RNI,
                     oc_subtotal Subtotal,
                     oc_total Total,
                     oc_pendiente Pendiente,
                     case oc_firmado
                                    when 0 then 'No'
                     else 'Si'
                        end Firmado,
                     oc_descuento1 Desc_1,
                     oc_descuento2 Desc_2,
                     oc_importedesc1 Desc_1,
                     oc_importedesc2 Desc_2,
                     lp_nombre Lista_de_Precios,
                     ld_nombre Lista_de_descuentos,
                     cpg_nombre Condicion_de_Pago,
                     ccos_nombre Centro_de_costo,
                     suc_nombre Sucursal,
                     emp_nombre Empresa,
                     OrdenCompra.creado,
                     OrdenCompra.modificado,
                     us_nombre Modifico,
                     oc_descrip Observaciones
        from OrdenCompra
               join Documento
                on OrdenCompra.doc_id = Documento.doc_id
               join Empresa
                on Documento.emp_id = Empresa.emp_id
               join CondicionPago
                on OrdenCompra.cpg_id = CondicionPago.cpg_id
               join Estado
                on OrdenCompra.est_id = Estado.est_id
               join Sucursal
                on OrdenCompra.suc_id = Sucursal.suc_id
               join Proveedor
                on OrdenCompra.prov_id = Proveedor.prov_id
               join Usuario
                on OrdenCompra.modifico = Usuario.us_id
               left join CentroCosto
                on OrdenCompra.ccos_id = CentroCosto.ccos_id
               left join ListaPrecio
                on OrdenCompra.lp_id = ListaPrecio.lp_id
               left join ListaDescuento
                on OrdenCompra.ld_id = ListaDescuento.ld_id
         where p_Fini <= oc_fecha
                 and p_Ffin >= oc_fecha
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
                 and ( CentroCosto.ccos_id = v_ccos_id
                 or v_ccos_id = 0 )
                 and ( Empresa.emp_id = v_emp_id
                 or v_emp_id = 0 )
                 -- Arboles
                 and ( ( exists ( select rptarb_hojaid
                                  from rptArbolRamaHoja
                                     where rptarb_cliente = v_ClienteID
                                             and tbl_id = 29
                                             and rptarb_hojaid = Proveedor.prov_id ) )
                 or ( v_ram_id_Proveedor = 0 ) )
                 and ( ( exists ( select rptarb_hojaid
                                  from rptArbolRamaHoja
                                     where rptarb_cliente = v_ClienteID
                                             and tbl_id = 21
                                             and rptarb_hojaid = CentroCosto.ccos_id ) )
                 or ( v_ram_id_CentroCosto = 0 ) )
                 and ( ( exists ( select rptarb_hojaid
                                  from rptArbolRamaHoja
                                     where rptarb_cliente = v_ClienteID
                                             and tbl_id = 4005
                                             and rptarb_hojaid = Estado.est_id ) )
                 or ( v_ram_id_Estado = 0 ) )
                 and ( ( exists ( select rptarb_hojaid
                                  from rptArbolRamaHoja
                                     where rptarb_cliente = v_ClienteID
                                             and tbl_id = 1007
                                             and rptarb_hojaid = Sucursal.suc_id ) )
                 or ( v_ram_id_Sucursal = 0 ) )
                 and ( ( exists ( select rptarb_hojaid
                                  from rptArbolRamaHoja
                                     where rptarb_cliente = v_ClienteID
                                             and tbl_id = 4001
                                             and rptarb_hojaid = Documento.doc_id ) )
                 or ( v_ram_id_Documento = 0 ) )
                 and ( ( exists ( select rptarb_hojaid
                                  from rptArbolRamaHoja
                                     where rptarb_cliente = v_ClienteID
                                             and tbl_id = 1005
                                             and rptarb_hojaid = CondicionPago.cpg_id ) )
                 or ( v_ram_id_CondicionPago = 0 ) )
                 and ( ( exists ( select rptarb_hojaid
                                  from rptArbolRamaHoja
                                     where rptarb_cliente = v_clienteID
                                             and tbl_id = 1018
                                             and rptarb_hojaid = Empresa.emp_id ) )
                 or ( v_ram_id_empresa = 0 ) )
        order by oc_fecha;

end;