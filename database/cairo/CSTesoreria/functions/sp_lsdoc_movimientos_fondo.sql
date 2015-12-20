create or replace function sp_lsdoc_MovimientoFondos
/*
select * from MovimientoFondo
sp_docMovimientoFondoget 47
sp_lsdoc_MovimientoFondos
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
  p_cli_id in varchar default null,
  p_est_id in varchar default null,
  p_ccos_id in varchar default null,
  p_suc_id in varchar default null,
  p_us_id_responsable in varchar default null,
  p_doc_id in varchar default null,
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
   v_us_id integer;
   v_doc_id integer;
   v_emp_id integer;
   v_ram_id_Cliente integer;
   v_ram_id_CentroCosto integer;
   v_ram_id_Sucursal integer;
   v_ram_id_Estado integer;
   v_ram_id_Usuario integer;
   v_ram_id_Documento integer;
   v_ram_id_empresa integer;
   v_clienteID integer;
   v_IsRaiz smallint;
begin

   select * from sp_ArbConvertId(p_cli_id) into v_cli_id, v_ram_id_Cliente;

   select * from sp_ArbConvertId(p_ccos_id) into v_ccos_id, v_ram_id_CentroCosto;

   select * from sp_ArbConvertId(p_suc_id) into v_suc_id, v_ram_id_Sucursal;

   select * from sp_ArbConvertId(p_est_id) into v_est_id, v_ram_id_Estado;

   select * from sp_ArbConvertId(p_us_id_responsable) into v_us_id, v_ram_id_Usuario;

   select * from sp_ArbConvertId(p_doc_id) into v_doc_id, v_ram_id_Documento;

   select * from sp_ArbConvertId(p_emp_id) into v_emp_id, v_ram_id_empresa;

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

   if v_ram_id_Usuario <> 0 then
   begin
      --	exec sp_ArbGetGroups @ram_id_Usuario, @clienteID, @@us_id
      select sp_ArbIsRaiz(v_ram_id_Usuario) into v_IsRaiz;

      if v_IsRaiz = 0 then
      begin
         sp_ArbGetAllHojas(v_ram_id_Usuario,
                           v_clienteID);

      end;
      else
         v_ram_id_Usuario := 0;

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
      -- sp_columns MovimientoFondo
      select mf_id,
                     '' TypeTask,
                     mf_numero as "Número",
                     mf_nrodoc Comprobante,
                     cli_nombre Cliente,
                     doc_nombre Documento,
                     est_nombre Estado,
                     mf_fecha Fecha,
                     mf_total Total,
                     mf_pendiente Pendiente,
                     case mf_firmado
                                    when 0 then 'No'
                     else 'Si'
                        end Firmado,
                     ccos_nombre Centro_de_costo,
                     suc_nombre Sucursal,
                     emp_nombre Empresa,
                     resp.us_nombre Responsable,
                     MovimientoFondo.creado,
                     MovimientoFondo.modificado,
                     Usuario.us_nombre Modifico,
                     mf_descrip Observaciones
        from MovimientoFondo
               join Documento
                on MovimientoFondo.doc_id = Documento.doc_id
               join Empresa
                on Documento.emp_id = Empresa.emp_id
               join Estado
                on MovimientoFondo.est_id = Estado.est_id
               join Sucursal
                on MovimientoFondo.suc_id = Sucursal.suc_id
               left join Cliente
                on MovimientoFondo.cli_id = Cliente.cli_id
               left join Usuario
                on MovimientoFondo.modifico = Usuario.us_id
               left join Usuario resp
                on MovimientoFondo.us_id = resp.us_id
               left join CentroCosto
                on MovimientoFondo.ccos_id = CentroCosto.ccos_id
         where p_Fini <= mf_fecha
                 and p_Ffin >= mf_fecha
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
                 and ( CentroCosto.ccos_id = v_ccos_id
                 or v_ccos_id = 0 )
                 and ( ( resp.us_id = v_us_id
                 or v_us_id = 0 )
                 or ( MovimientoFondo.modifico = v_us_id
                 or v_us_id = 0 ) )
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
                                             and tbl_id = 3
                                             and ( rptarb_hojaid = resp.us_id
                                             or rptarb_hojaid = MovimientoFondo.modifico ) ) )
                 or ( v_ram_id_Usuario = 0 ) )
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
        order by mf_fecha;

end;