create or replace function sp_lsdoc_Ejercicios
(
  in p_us_id integer,
  p_emp_id in varchar default null ,
  out rtn refcursor
)
as
   v_emp_id integer;
   v_ram_id_empresa integer;
   v_clienteID integer;
   v_IsRaiz smallint;
begin

   select * from sp_ArbConvertId(p_emp_id) into v_emp_id, v_ram_id_empresa;

   select * from  sp_GetRptId() into v_clienteID;

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
      select ejc.ejc_id,
                     '' TypeTask,
                     ejc.ejc_codigo Codigo,
                     ejc.ejc_nombre Nombre,
                     emp_nombre Empresa,
                     case
                          when ejc.as_id_cierrepatrimonial is null
                            and ejc.as_id_cierreresultados is null then 'Abierto'
                     else 'Cierre'
                        end Estado,
                     ap.as_nrodoc Apertura,
                     ap.as_fecha Fecha_Apertura,
                     ACP.as_nrodoc Cierre_Patrimonial,
                     ACP.as_fecha Fecha_Cierre_Patrimonial,
                     acr.as_nrodoc Cierre_Resultados,
                     acr.as_fecha Fecha_Cierre_Resultados,
                     ejc.Creado,
                     ejc.Modificado,
                     us_nombre Modifico,
                     ejc.ejc_descrip Observaciones
        from EjercicioContable ejc
               join Usuario
                on ejc.modifico = Usuario.us_id
               left join Empresa
                on isnumeric(ejc.emp_id) <> 0
               and ejc.emp_id = CAST(Empresa.emp_id as varchar)
               left join Asiento ap
                on ejc.as_id_apertura = ap.as_id
               left join Asiento ACP
                on ejc.as_id_cierrepatrimonial = ACP.as_id
               left join Asiento acr
                on ejc.as_id_cierreresultados = acr.as_id
/* -///////////////////////////////////////////////////////////////////////
INICIO SEGUNDA PARTE DE ARBOLES
/////////////////////////////////////////////////////////////////////// */
         where ( Empresa.emp_id = v_emp_id
                 or v_emp_id = 0 )
                 -- Arboles
                 and ( ( exists ( select rptarb_hojaid
                                  from rptArbolRamaHoja
                                     where rptarb_cliente = v_clienteID
                                             and tbl_id = 1018
                                             and rptarb_hojaid = Empresa.emp_id ) )
                 or ( v_ram_id_empresa = 0 ) )
        order by ejc.ejc_codigo;

end;