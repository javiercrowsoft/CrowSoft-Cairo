create or replace function sp_lsdoc_RemitosCompra
/*
select * from RemitoCompra
sp_docRemitoCompraget 47
sp_lsdoc_RemitosCompra
  7,
	'20030101',
	'20050101',
		'0',
		'0',
		'0',
		'0',
		'0',
		'0',
		'0'
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
   v_ram_id_proveedor integer;
   v_ram_id_CentroCosto integer;
   v_ram_id_sucursal integer;
   v_ram_id_estado integer;
   v_ram_id_documento integer;
   v_ram_id_CondicionPago integer;
   v_ram_id_empresa integer;
   v_clienteID integer;
   v_IsRaiz smallint;
begin

   select * from sp_ArbConvertId(p_prov_id) into v_prov_id, v_ram_id_proveedor;

   select * from sp_ArbConvertId(p_ccos_id) into v_ccos_id, v_ram_id_CentroCosto;

   select * from sp_ArbConvertId(p_suc_id) into v_suc_id, v_ram_id_sucursal;

   select * from sp_ArbConvertId(p_est_id) into v_est_id, v_ram_id_estado;

   select * from sp_ArbConvertId(p_doc_id) into v_doc_id, v_ram_id_documento;

   select * from sp_ArbConvertId(p_cpg_id) into v_cpg_id, v_ram_id_CondicionPago;

   select * from sp_ArbConvertId(p_emp_id) into v_emp_id, v_ram_id_empresa;

   select * from  sp_GetRptId() into v_clienteID;

   if v_ram_id_proveedor <> 0 then
   begin
      --	exec sp_ArbGetGroups @ram_id_Proveedor, @clienteID, @@us_id
      select sp_ArbIsRaiz(v_ram_id_proveedor) into v_IsRaiz;

      if v_IsRaiz = 0 then
      begin
         sp_ArbGetAllHojas(v_ram_id_proveedor,
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
         sp_ArbGetAllHojas(v_ram_id_CentroCosto,
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
         sp_ArbGetAllHojas(v_ram_id_estado,
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
         sp_ArbGetAllHojas(v_ram_id_sucursal,
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
         sp_ArbGetAllHojas(v_ram_id_documento,
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
         sp_ArbGetAllHojas(v_ram_id_CondicionPago,
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
      -- sp_columns RemitoCompra
      select rc_id,
                     '' TypeTask,
                     rc_numero as "Número",
                     rc_nrodoc Comprobante,
                     prov_nombre Proveedor,
                     doc_nombre Documento,
                     est_nombre Estado,
                     rc_fecha Fecha,
                     rc_fechaentrega Fecha_de_entrega,
                     rc_neto Neto,
                     rc_ivari IVA_RI,
                     rc_ivarni IVA_RNI,
                     rc_subtotal Subtotal,
                     rc_total Total,
                     rc_pendiente Pendiente,
                     case rc_firmado
                                    when 0 then 'No'
                     else 'Si'
                        end Firmado,
                     rc_descuento1 Desc_1,
                     rc_descuento2 Desc_2,
                     rc_importedesc1 Desc_1,
                     rc_importedesc2 Desc_2,
                     lp_nombre Lista_de_Precios,
                     ld_nombre Lista_de_descuentos,
                     cpg_nombre Condicion_de_Pago,
                     ccos_nombre Centro_de_costo,
                     suc_nombre Sucursal,
                     emp_nombre Empresa,
                     RemitoCompra.creado,
                     RemitoCompra.modificado,
                     us_nombre Modifico,
                     rc_descrip Observaciones
        from RemitoCompra
               join Documento
                on RemitoCompra.doc_id = Documento.doc_id
               join Empresa
                on Documento.emp_id = Empresa.emp_id
               join Estado
                on RemitoCompra.est_id = Estado.est_id
               join Sucursal
                on RemitoCompra.suc_id = Sucursal.suc_id
               join Proveedor
                on RemitoCompra.prov_id = Proveedor.prov_id
               join Usuario
                on RemitoCompra.modifico = Usuario.us_id
               left join CondicionPago
                on RemitoCompra.cpg_id = CondicionPago.cpg_id
               left join CentroCosto
                on RemitoCompra.ccos_id = CentroCosto.ccos_id
               left join ListaPrecio
                on RemitoCompra.lp_id = ListaPrecio.lp_id
               left join ListaDescuento
                on RemitoCompra.ld_id = ListaDescuento.ld_id
         where p_Fini <= rc_fecha
                 and p_Ffin >= rc_fecha
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
                                     where rptarb_cliente = v_clienteID
                                             and tbl_id = 29
                                             and rptarb_hojaid = Proveedor.prov_id ) )
                 or ( v_ram_id_proveedor = 0 ) )
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
        order by rc_fecha;

end;