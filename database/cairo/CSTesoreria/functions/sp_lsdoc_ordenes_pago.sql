create or replace function sp_lsdoc_OrdenPagos
/*
sp_lsdoc_OrdenPagos
  7,
	'20030101',
	'20050101',
		'0',
		'0',
		'0',
		'0',
		'0',
		'2'
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
  p_emp_id in varchar default null,
  out rtn refcursor
)
as
   /*,
@@TABLA_ID9	varchar(255),
@@TABLA_ID-10 varchar(255),
@@TABLA_ID-11 varchar(255),
@@TABLA_ID-12 varchar(255),
@@TABLA_ID-13 varchar(255),
@@TABLA_ID-14 varchar(255),
@@TABLA_ID-15 varchar(255)*/
/*- ///////////////////////////////////////////////////////////////////////
INICIO PRIMERA PARTE DE ARBOLES
/////////////////////////////////////////////////////////////////////// */
   v_prov_id integer;
   v_ccos_id integer;
   v_suc_id integer;
   v_est_id integer;
   v_cob_id integer;
   v_doc_id integer;
   v_emp_id integer;
   /*declare @TABLA_ID9 int
declare @TABLA_ID-10 int
declare @TABLA_ID-11 int
declare @TABLA_ID-12 int
declare @TABLA_ID-13 int
declare @TABLA_ID-14 int
declare @TABLA_ID-15 int */
   v_ram_id_Proveedor integer;
   v_ram_id_CentroCosto integer;
   v_ram_id_Sucursal integer;
   v_ram_id_Estado integer;
   v_ram_id_Cobrador integer;
   v_ram_id_Documento integer;
   v_ram_id_CondicionPago integer;
   v_ram_id_empresa integer;
   /*
declare @RAM_ID_TABLA9 int
declare @RAM_ID_TABLA-10 int
declare @RAM_ID_TABLA-11 int
declare @RAM_ID_TABLA-12 int
declare @RAM_ID_TABLA-13 int
declare @RAM_ID_TABLA-14 int
declare @RAM_ID_TABLA-15 int */v_ClienteID integer;
   v_IsRaiz smallint;
begin

   select * from sp_ArbConvertId(p_prov_id) into v_prov_id, v_ram_id_Proveedor;

   select * from sp_ArbConvertId(p_ccos_id) into v_ccos_id, v_ram_id_CentroCosto;

   select * from sp_ArbConvertId(p_suc_id) into v_suc_id, v_ram_id_Sucursal;

   select * from sp_ArbConvertId(p_est_id) into v_est_id, v_ram_id_Estado;

   select * from sp_ArbConvertId(p_doc_id) into v_doc_id, v_ram_id_Documento;

   select * from sp_ArbConvertId(p_emp_id) into v_emp_id, v_ram_id_empresa;

   /*
exec sp_ArbConvertId @@TABLA_ID9, @TABLA_ID9 out, @RAM_ID_TABLA9 out
exec sp_ArbConvertId @@TABLA_ID-10, @TABLA_ID-10 out, @RAM_ID_TABLA-10 out
exec sp_ArbConvertId @@TABLA_ID-11, @TABLA_ID-11 out, @RAM_ID_TABLA-11 out
exec sp_ArbConvertId @@TABLA_ID-12, @TABLA_ID-12 out, @RAM_ID_TABLA-12 out
exec sp_ArbConvertId @@TABLA_ID-13, @TABLA_ID-13 out, @RAM_ID_TABLA-13 out
exec sp_ArbConvertId @@TABLA_ID-14, @TABLA_ID-14 out, @RAM_ID_TABLA-14 out
exec sp_ArbConvertId @@TABLA_ID-15, @TABLA_ID-15 out, @RAM_ID_TABLA-15 out */
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

   if v_ram_id_Cobrador <> 0 then
   begin
      --	exec sp_ArbGetGroups @ram_id_Cobrador, @ClienteID, @@us_id
      select sp_ArbIsRaiz(v_ram_id_Cobrador) into v_IsRaiz;

      if v_IsRaiz = 0 then
      begin
         sp_ArbGetAllHojas(v_ram_id_Cobrador,
                           v_ClienteID);

      end;
      else
         v_ram_id_Cobrador := 0;

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
      /*
if @RAM_ID_TABLA9 <> 0 begin
	exec sp_ArbGetGroups @RAM_ID_TABLA9, @ClienteID, @@us_id
	exec sp_ArbIsRaiz @RAM_ID_TABLA9, @IsRaiz out
  if @IsRaiz = 0 begin
		exec sp_ArbGetAllHojas @RAM_ID_TABLA9, @ClienteID
	end else
		set @RAM_ID_TABLA9 = 0
end
if @RAM_ID_TABLA-10 <> 0 begin
	exec sp_ArbGetGroups @RAM_ID_TABLA-10, @ClienteID, @@us_id
	exec sp_ArbIsRaiz @RAM_ID_TABLA-10, @IsRaiz out
  if @IsRaiz = 0 begin
		exec sp_ArbGetAllHojas @RAM_ID_TABLA-10, @ClienteID
	end else
		set @RAM_ID_TABLA-10 = 0
end
if @RAM_ID_TABLA-11 <> 0 begin
	exec sp_ArbGetGroups @RAM_ID_TABLA-11, @ClienteID, @@us_id
	exec sp_ArbIsRaiz @RAM_ID_TABLA-11, @IsRaiz out
  if @IsRaiz = 0 begin
		exec sp_ArbGetAllHojas @RAM_ID_TABLA-11, @ClienteID
	end else
		set @RAM_ID_TABLA-11 = 0
end
if @RAM_ID_TABLA-12 <> 0 begin
	exec sp_ArbGetGroups @RAM_ID_TABLA-12, @ClienteID, @@us_id
	exec sp_ArbIsRaiz @RAM_ID_TABLA-12, @IsRaiz out
  if @IsRaiz = 0 begin
		exec sp_ArbGetAllHojas @RAM_ID_TABLA-12, @ClienteID
	end else
		set @RAM_ID_TABLA-12 = 0
end
if @RAM_ID_TABLA-13 <> 0 begin
	exec sp_ArbGetGroups @RAM_ID_TABLA-13, @ClienteID, @@us_id
	exec sp_ArbIsRaiz @RAM_ID_TABLA-13, @IsRaiz out
  if @IsRaiz = 0 begin
		exec sp_ArbGetAllHojas @RAM_ID_TABLA-13, @ClienteID
	end else
		set @RAM_ID_TABLA-13 = 0
end
if @RAM_ID_TABLA-14 <> 0 begin
	exec sp_ArbGetGroups @RAM_ID_TABLA-14, @ClienteID, @@us_id
	exec sp_ArbIsRaiz @RAM_ID_TABLA-14, @IsRaiz out
  if @IsRaiz = 0 begin
		exec sp_ArbGetAllHojas @RAM_ID_TABLA-14, @ClienteID
	end else
		set @RAM_ID_TABLA-14 = 0
end
if @RAM_ID_TABLA-15 <> 0 begin
	exec sp_ArbGetGroups @RAM_ID_TABLA-15, @ClienteID, @@us_id
	exec sp_ArbIsRaiz @RAM_ID_TABLA-15, @IsRaiz out
  if @IsRaiz = 0 begin
		exec sp_ArbGetAllHojas @RAM_ID_TABLA-15, @ClienteID
	end else
		set @RAM_ID_TABLA-15 = 0
end
 */
/*- ///////////////////////////////////////////////////////////////////////
FIN PRIMERA PARTE DE ARBOLES
/////////////////////////////////////////////////////////////////////// */
      -- sp_columns OrdenPago
      select opg_id,
                     '' TypeTask,
                     opg_numero N_mero,
                     opg_nrodoc Comprobante,
                     prov_nombre Proveedor,
                     doc_nombre Documento,
                     est_nombre Estado,
                     opg_fecha Fecha,
                     opg_neto Neto,
                     opg_total Total,
                     opg_pendiente Pendiente,
                     case opg_firmado
                                     when 0 then 'No'
                     else 'Si'
                        end Firmado,
                     ccos_nombre Centro_de_costo,
                     suc_nombre Sucursal,
                     emp_nombre Empresa,
                     OrdenPago.creado,
                     OrdenPago.modificado,
                     us_nombre Modifico,
                     opg_descrip Observaciones
        from OrdenPago
               join Documento
                on OrdenPago.doc_id = Documento.doc_id
               join Empresa
                on Documento.emp_id = Empresa.emp_id
               join Estado
                on OrdenPago.est_id = Estado.est_id
               join Sucursal
                on OrdenPago.suc_id = Sucursal.suc_id
               join Proveedor
                on OrdenPago.prov_id = Proveedor.prov_id
               join Usuario
                on OrdenPago.modifico = Usuario.us_id
               left join CentroCosto
                on OrdenPago.ccos_id = CentroCosto.ccos_id
         where p_Fini <= opg_fecha
                 and p_Ffin >= opg_fecha
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
                 and ( CentroCosto.ccos_id = v_ccos_id
                 or v_ccos_id = 0 )
                 and ( Empresa.emp_id = v_emp_id
                 or v_emp_id = 0 )
                 /*
and   (TABLA_DEL_LISTADO9.TABLA_ID9 = @TABLA_ID9 or @TABLA_ID9=0)
and   (TABLA_DEL_LISTADO-10.TABLA_ID-10 = @TABLA_ID-10 or @TABLA_ID-10=0)
and   (TABLA_DEL_LISTADO-11.TABLA_ID-11 = @TABLA_ID-11 or @TABLA_ID-11=0)
and   (TABLA_DEL_LISTADO-12.TABLA_ID-12 = @TABLA_ID-12 or @TABLA_ID-12=0)
and   (TABLA_DEL_LISTADO-13.TABLA_ID-13 = @TABLA_ID-13 or @TABLA_ID-13=0)
and   (TABLA_DEL_LISTADO-14.TABLA_ID-14 = @TABLA_ID-14 or @TABLA_ID-14=0)
and   (TABLA_DEL_LISTADO-15.TABLA_ID-15 = @TABLA_ID-15 or @TABLA_ID-15=0)
*/
                 -- Arboles
                 and ( ( exists ( select rptarb_hojaid
                                  from rptArbolRamaHoja
                                     where rptarb_Cliente = v_ClienteID
                                             and tbl_id = 29

                                             and rptarb_hojaid = Proveedor.prov_id ) )
                 or ( v_ram_id_Proveedor = 0 ) )
                 and ( ( exists ( select rptarb_hojaid
                                  from rptArbolRamaHoja
                                     where rptarb_Cliente = v_ClienteID
                                             and tbl_id = 21

                                             and rptarb_hojaid = CentroCosto.ccos_id ) )
                 or ( v_ram_id_CentroCosto = 0 ) )
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
        /*
and   (
					(exists(select rptarb_hojaid
                  from rptArbolRamaHoja
                  where
                       rptarb_Cliente = @ClienteID
                  and  tbl_id = TBL_ID_TABLA9
                  and  rptarb_hojaid = TABLA_DEL_LISTADO9.TABLA_ID9
							   )
           )
        or
					 (@RAM_ID_TABLA9 = 0)
			 )
and   (
					(exists(select rptarb_hojaid
                  from rptArbolRamaHoja
                  where
                       rptarb_Cliente = @ClienteID
                  and  tbl_id = TBL_ID_TABLA-10
                  and  rptarb_hojaid = TABLA_DEL_LISTADO-10.TABLA_ID-10
							   )
           )
        or
					 (@RAM_ID_TABLA-10 = 0)
			 )
and   (
					(exists(select rptarb_hojaid
                  from rptArbolRamaHoja
                  where
                       rptarb_Cliente = @ClienteID
                  and  tbl_id = TBL_ID_TABLA-11
                  and  rptarb_hojaid = TABLA_DEL_LISTADO-11.TABLA_ID-11
							   )
           )
        or
					 (@RAM_ID_TABLA-11 = 0)
			 )
and   (
					(exists(select rptarb_hojaid
                  from rptArbolRamaHoja
                  where
                       rptarb_Cliente = @ClienteID
                  and  tbl_id = TBL_ID_TABLA-12
                  and  rptarb_hojaid = TABLA_DEL_LISTADO-12.TABLA_ID-12
							   )
           )
        or
					 (@RAM_ID_TABLA-12 = 0)
			 )
and   (
					(exists(select rptarb_hojaid
                  from rptArbolRamaHoja
                  where
                       rptarb_Cliente = @ClienteID
                  and  tbl_id = TBL_ID_TABLA-13
                  and  rptarb_hojaid = TABLA_DEL_LISTADO-13.TABLA_ID-13
							   )
           )
        or
					 (@RAM_ID_TABLA-13 = 0)
			 )
and   (
					(exists(select rptarb_hojaid
                  from rptArbolRamaHoja
                  where
                       rptarb_Cliente = @ClienteID
                  and  tbl_id = TBL_ID_TABLA-14
                  and  rptarb_hojaid = TABLA_DEL_LISTADO-14.TABLA_ID-14
							   )
           )
        or
					 (@RAM_ID_TABLA-14 = 0)
			 )
and   (
					(exists(select rptarb_hojaid
                  from rptArbolRamaHoja
                  where
                       rptarb_Cliente = @ClienteID
                  and  tbl_id = TBL_ID_TABLA-15
                  and  rptarb_hojaid = TABLA_DEL_LISTADO-15.TABLA_ID-15
							   )
           )
        or
					 (@RAM_ID_TABLA-15 = 0)
			 ) */
        order by opg_fecha;

end;