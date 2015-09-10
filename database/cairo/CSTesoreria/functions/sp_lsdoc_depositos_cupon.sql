create or replace function sp_lsdoc_DepositoCupones
/*
select * from DepositoCupon
sp_docDepositoCuponget 47
sp_lsdoc_DepositoCupones
  7,
	'20030101',
	'20050101',
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
  p_tjc_id in varchar default null,
  p_bco_id in varchar default null,
  p_cue_id in varchar default null,
  p_est_id in varchar default null,
  p_suc_id in varchar default null,
  p_doc_id in varchar default null,
  p_emp_id in varchar default null,
  out rtn refcursor
)
as
/*- ///////////////////////////////////////////////////////////////////////
INICIO PRIMERA PARTE DE ARBOLES
/////////////////////////////////////////////////////////////////////// */
   v_tjc_id integer;
   v_bco_id integer;
   v_cue_id integer;
   v_ccos_id integer;
   v_suc_id integer;
   v_est_id integer;
   v_doc_id integer;
   v_emp_id integer;
   v_ram_id_Tarjeta integer;
   v_ram_id_Banco integer;
   v_ram_id_Cuenta integer;
   v_ram_id_CentroCosto integer;
   v_ram_id_Sucursal integer;
   v_ram_id_Estado integer;
   v_ram_id_Documento integer;
   v_ram_id_empresa integer;
   v_ClienteID integer;
   v_IsRaiz smallint;
begin

   select * from sp_ArbConvertId(p_tjc_id) into v_tjc_id, v_ram_id_Tarjeta;

   select * from sp_ArbConvertId(p_bco_id) into v_bco_id, v_ram_id_Banco;

   select * from sp_ArbConvertId(p_cue_id) into v_cue_id, v_ram_id_Cuenta;

   select * from sp_ArbConvertId(p_suc_id) into v_suc_id, v_ram_id_Sucursal;

   select * from sp_ArbConvertId(p_est_id) into v_est_id, v_ram_id_Estado;

   select * from sp_ArbConvertId(p_doc_id) into v_doc_id, v_ram_id_Documento;

   select * from sp_ArbConvertId(p_emp_id) into v_emp_id, v_ram_id_empresa;

   select * from  sp_GetRptId() into v_clienteID;

   if v_ram_id_Tarjeta <> 0 then
   begin
      --	exec sp_ArbGetGroups @ram_id_Tarjeta, @ClienteID, @@us_id
      select sp_ArbIsRaiz(v_ram_id_Tarjeta) into v_IsRaiz;

      if v_IsRaiz = 0 then
      begin
         sp_ArbGetAllHojas(v_ram_id_Tarjeta,
                           v_ClienteID);

      end;
      else
         v_ram_id_Tarjeta := 0;

      end if;

   end;
   end if;

   if v_ram_id_Banco <> 0 then
   begin
      --	exec sp_ArbGetGroups @ram_id_Banco, @ClienteID, @@us_id
      select sp_ArbIsRaiz(v_ram_id_Banco) into v_IsRaiz;

      if v_IsRaiz = 0 then
      begin
         sp_ArbGetAllHojas(v_ram_id_Banco,
                           v_ClienteID);

      end;
      else
         v_ram_id_Banco := 0;

      end if;

   end;
   end if;

   if v_ram_id_Cuenta <> 0 then
   begin
      --	exec sp_ArbGetGroups @ram_id_Cuenta, @ClienteID, @@us_id
      select sp_ArbIsRaiz(v_ram_id_Cuenta) into v_IsRaiz;

      if v_IsRaiz = 0 then
      begin
         sp_ArbGetAllHojas(v_ram_id_Cuenta,
                           v_ClienteID);

      end;
      else
         v_ram_id_Cuenta := 0;

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
      --	exec sp_ArbGetGroups @ram_id_Estado, @ClienteID, @@us_id
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
      --	exec sp_ArbGetGroups @ram_id_Documento, @ClienteID, @@us_id
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
      -- sp_columns DepositoCupon
      select distinct DepositoCupon.dcup_id,
                              '' TypeTask,
                              dcup_numero N_mero,
                              dcup_nrodoc Comprobante,
                              tjc_nombre Tarjeta,
                              bco_nombre Banco,
                              cue_nombre Cuenta,
                              doc_nombre Documento,
                              est_nombre Estado,
                              dcup_fecha Fecha,
                              dcup_total Total,
                              case dcup_firmado
                                               when 0 then 'No'
                              else 'Si'
                                 end Firmado,
                              suc_nombre Sucursal,
                              emp_nombre Empresa,
                              DepositoCupon.creado,
                              DepositoCupon.modificado,
                              Usuario.us_nombre Modifico,
                              dcup_descrip Observaciones
        from DepositoCupon
               join Documento
                on DepositoCupon.doc_id = Documento.doc_id
               join Empresa
                on Documento.emp_id = Empresa.emp_id
               join Estado
                on DepositoCupon.est_id = Estado.est_id
               join Sucursal
                on DepositoCupon.suc_id = Sucursal.suc_id
               join DepositoCuponItem
                on DepositoCupon.dcup_id = DepositoCuponItem.dcup_id
               join Cuenta
                on DepositoCuponItem.cue_id = Cuenta.cue_id
               join Banco
                on Cuenta.bco_id = Banco.bco_id
               join TarjetaCreditoCupon
                on DepositoCuponItem.tjcc_id = TarjetaCreditoCupon.tjcc_id
               join TarjetaCredito
                on TarjetaCreditoCupon.tjc_id = TarjetaCredito.tjc_id
               left join Usuario
                on DepositoCupon.modifico = Usuario.us_id
         where p_Fini <= dcup_fecha
                 and p_Ffin >= dcup_fecha
/* -///////////////////////////////////////////////////////////////////////
INICIO SEGUNDA PARTE DE ARBOLES
/////////////////////////////////////////////////////////////////////// */
                 and ( TarjetaCredito.tjc_id = v_tjc_id
                 or v_tjc_id = 0 )
                 and ( Banco.bco_id = v_bco_id
                 or v_bco_id = 0 )
                 and ( Cuenta.cue_id = v_cue_id
                 or v_cue_id = 0 )
                 and ( Estado.est_id = v_est_id
                 or v_est_id = 0 )
                 and ( Sucursal.suc_id = v_suc_id
                 or v_suc_id = 0 )
                 and ( Documento.doc_id = v_doc_id
                 or v_doc_id = 0 )
                 and ( Empresa.emp_id = v_emp_id
                 or v_emp_id = 0 )
                 -- Arboles
                 and ( ( exists ( select rptarb_hojaid
                                  from rptArbolRamaHoja
                                     where rptarb_Cliente = v_ClienteID
                                             and tbl_id = 28

                                             and rptarb_hojaid = TarjetaCredito.tjc_id ) )
                 or ( v_ram_id_Tarjeta = 0 ) )
                 and ( ( exists ( select rptarb_hojaid
                                  from rptArbolRamaHoja
                                     where rptarb_Cliente = v_ClienteID
                                             and tbl_id = 28

                                             and rptarb_hojaid = Banco.bco_id ) )
                 or ( v_ram_id_Banco = 0 ) )
                 and ( ( exists ( select rptarb_hojaid
                                  from rptArbolRamaHoja
                                     where rptarb_Cliente = v_ClienteID
                                             and tbl_id = 17-- select tbl_id,tbl_nombrefisico from tabla

                                             and rptarb_hojaid = Cuenta.cue_id ) )
                 or ( v_ram_id_Cuenta = 0 ) )
                 and ( ( exists ( select rptarb_hojaid
                                  from rptArbolRamaHoja
                                     where rptarb_Cliente = v_ClienteID
                                             and tbl_id = 4005

                                             and rptarb_hojaid = Estado.est_id ) )
                 or ( v_ram_id_Estado = 0 ) )
                 and ( ( exists ( select rptarb_hojaid
                                  from rptArbolRamaHoja
                                     where rptarb_Cliente = v_ClienteID
                                             and tbl_id = 1007

                                             and rptarb_hojaid = Sucursal.suc_id ) )
                 or ( v_ram_id_Sucursal = 0 ) )
                 and ( ( exists ( select rptarb_hojaid
                                  from rptArbolRamaHoja
                                     where rptarb_Cliente = v_ClienteID
                                             and tbl_id = 4001

                                             and rptarb_hojaid = Documento.doc_id ) )
                 or ( v_ram_id_Documento = 0 ) )
                 and ( ( exists ( select rptarb_hojaid
                                  from rptArbolRamaHoja
                                     where rptarb_cliente = v_clienteID
                                             and tbl_id = 1018

                                             and rptarb_hojaid = Empresa.emp_id ) )
                 or ( v_ram_id_empresa = 0 ) )
        order by dcup_fecha;

end;