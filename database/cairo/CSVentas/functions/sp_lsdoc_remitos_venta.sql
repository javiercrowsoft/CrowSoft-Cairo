create or replace function sp_lsdoc_RemitosVentaCliente
/*
select * from Remitoventa
sp_docRemitoventaget 47
sp_lsdoc_RemitosVentaCliente
  7,
	'20030101',
	'20050101',
		'0',
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
  p_cli_id in varchar default null,
  p_est_id in varchar default null,
  p_ccos_id in varchar default null,
  p_suc_id in varchar default null,
  p_ven_id in varchar default null,
  p_doc_id in varchar default null,
  p_cpg_id in varchar default null,
  p_emp_id in varchar default null,
  out rtn refcursor
)
as
/*- ///////////////////////////////////////////////////////////////////////
INICIO PRIMERA PARTE DE ARBOLES
/////////////////////////////////////////////////////////////////////// */
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
         sp_ArbGetAllHojas(v_ram_id_Cliente,
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
         sp_ArbGetAllHojas(v_ram_id_CentroCosto,
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
         sp_ArbGetAllHojas(v_ram_id_Estado,
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
         sp_ArbGetAllHojas(v_ram_id_Sucursal,
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
         sp_ArbGetAllHojas(v_ram_id_Vendedor,
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
         sp_ArbGetAllHojas(v_ram_id_Documento,
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
      -- sp_columns Remitoventa
      select rv_id,
                     '' TypeTask,
                     rv_numero N_mero,
                     rv_nrodoc Comprobante,
                     cli_nombre Cliente,
                     doc_nombre Documento,
                     est_nombre Estado,
                     rv_fecha Fecha,
                     rv_fechaentrega Fecha_de_entrega,
                     rv_neto Neto,
                     rv_ivari IVA_RI,
                     rv_ivarni IVA_RNI,
                     rv_subtotal Subtotal,
                     rv_total Total,
                     rv_pendiente Pendiente,
                     case rv_firmado
                                    when 0 then 'No'
                     else 'Si'
                        end Firmado,
                     rv_descuento1 Desc_1,
                     rv_descuento2 Desc_2,
                     rv_importedesc1 Desc_1,
                     rv_importedesc2 Desc_2,
                     lp_nombre Lista_de_Precios,
                     ld_nombre Lista_de_descuentos,
                     cpg_nombre Condicion_de_Pago,
                     ccos_nombre Centro_de_costo,
                     suc_nombre Sucursal,
                     emp_nombre Empresa,
                     RemitoVenta.creado,
                     RemitoVenta.modificado,
                     us_nombre Modifico,
                     rv_descrip Observaciones
        from RemitoVenta
               join Documento
                on RemitoVenta.doc_id = Documento.doc_id
               join Empresa
                on Documento.emp_id = Empresa.emp_id
               join Estado
                on RemitoVenta.est_id = Estado.est_id
               join Sucursal
                on RemitoVenta.suc_id = Sucursal.suc_id
               join Cliente
                on RemitoVenta.cli_id = Cliente.cli_id
               join Usuario
                on RemitoVenta.modifico = Usuario.us_id
               left join CondicionPago
                on RemitoVenta.cpg_id = CondicionPago.cpg_id
               left join Vendedor
                on RemitoVenta.ven_id = Vendedor.ven_id
               left join CentroCosto
                on RemitoVenta.ccos_id = CentroCosto.ccos_id
               left join ListaPrecio
                on RemitoVenta.lp_id = ListaPrecio.lp_id
               left join ListaDescuento
                on RemitoVenta.ld_id = ListaDescuento.ld_id
         where p_Fini <= rv_fecha
                 and p_Ffin >= rv_fecha
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
        order by rv_fecha;

end;