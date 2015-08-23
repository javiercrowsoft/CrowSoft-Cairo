create or replace function sp_lsdoc_RecuentoStocks
/*
select * from RecuentoStock
sp_docRecuentoStockget 47
sp_lsdoc_RecuentoStocks
  7,
	'20030101',
	'20050101',
		'0',
		'0',
		'0',
		'0'
*/
(
  in p_us_id integer,
  p_Fini in date default null ,
  p_Ffin in date default null ,
  p_doc_id in varchar default null ,
  p_suc_id in varchar default null ,
  p_lgj_id in varchar default null ,
  p_emp_id in varchar default null ,
  out rtn refcursor
)
as
/*- ///////////////////////////////////////////////////////////////////////
INICIO PRIMERA PARTE DE ARBOLES
/////////////////////////////////////////////////////////////////////// */
   v_lgj_id integer;
   v_suc_id integer;
   v_doc_id integer;
   v_emp_id integer;
   v_ram_id_Legajo integer;
   v_ram_id_Sucursal integer;
   v_ram_id_Documento integer;
   v_ram_id_empresa integer;
   v_clienteID integer;
   v_IsRaiz smallint;
begin

   select * from sp_ArbConvertId(p_lgj_id) into v_lgj_id, v_ram_id_Legajo;

   select * from sp_ArbConvertId(p_suc_id) into v_suc_id, v_ram_id_Sucursal;

   select * from sp_ArbConvertId(p_doc_id) into v_doc_id, v_ram_id_Documento;

   select * from sp_ArbConvertId(p_emp_id) into v_emp_id, v_ram_id_empresa;

   select * from  sp_GetRptId() into v_clienteID;

   if v_ram_id_Legajo <> 0 then
   begin
      --	exec sp_ArbGetGroups @ram_id_Legajo, @clienteID, @@us_id
      select sp_ArbIsRaiz(v_ram_id_Legajo) into v_IsRaiz;

      if v_IsRaiz = 0 then
      begin
         sp_ArbGetAllHojas(v_ram_id_Legajo,
                           v_clienteID);

      end;
      else
         v_ram_id_Legajo := 0;

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
      -- sp_columns RecuentoStock
      select rs_id,
                     '' TypeTask,
                     rs_numero N_mero,
                     rs_nrodoc Comprobante,
                     doc_nombre Documento,
                     rs_fecha Fecha,
                     case
                          when lgj_titulo <> '' then lgj_titulo
                     else lgj_codigo
                        end Legajo,
                     suc_nombre Sucursal,
                     emp_nombre Empresa,
                     RecuentoStock.creado,
                     RecuentoStock.modificado,
                     us_nombre Modifico,
                     rs_descrip Observaciones
        from RecuentoStock
               join Documento
                on RecuentoStock.doc_id = Documento.doc_id
               join Empresa
                on Documento.emp_id = Empresa.emp_id
               join Sucursal
                on RecuentoStock.suc_id = Sucursal.suc_id
               join Usuario
                on RecuentoStock.modifico = Usuario.us_id
               left join Legajo
                on RecuentoStock.lgj_id = Legajo.lgj_id
         where p_Fini <= rs_fecha
                 and p_Ffin >= rs_fecha
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
                 or ( v_ram_id_Legajo = 0 ) )
                 and ( ( exists ( select rptarb_hojaid
                                  from rptArbolRamaHoja
                                     where rptarb_cliente = v_clienteID
                                             and tbl_id = 1007

                                             and rptarb_hojaid = Sucursal.suc_id ) )
                 or ( v_ram_id_Sucursal = 0 ) )
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
        order by rs_fecha;

end;