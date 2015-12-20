create or replace function sp_lsdoc_BancosConciliacion
/*
*/
(
  in p_us_id integer,
  p_Fini in date default null,
  p_Ffin in date default null,
  p_cue_id in varchar default null,
  p_bco_id in varchar default null,
  p_emp_id in varchar default null,
  out rtn refcursor
)
as
/*- ///////////////////////////////////////////////////////////////////////

	INICIO PRIMERA PARTE DE ARBOLES

/////////////////////////////////////////////////////////////////////// */
   v_cue_id integer;
   v_bco_id integer;
   v_emp_id integer;
   v_ram_id_Cuenta integer;
   v_ram_id_Banco integer;
   v_ram_id_Empresa integer;
   v_clienteID integer;
   v_IsRaiz smallint;
begin

   select * from sp_ArbConvertId(p_cue_id) into v_cue_id, v_ram_id_Cuenta;

   select * from sp_ArbConvertId(p_bco_id) into v_bco_id, v_ram_id_Banco;

   select * from sp_ArbConvertId(p_emp_id) into v_emp_id, v_ram_id_empresa;

   select * from  sp_GetRptId() into v_clienteID;

   if v_ram_id_Cuenta <> 0 then
   begin
      --	exec sp_ArbGetGroups @ram_id_Cuenta, @clienteID, @@us_id
      select sp_ArbIsRaiz(v_ram_id_Cuenta) into v_IsRaiz;

      if v_IsRaiz = 0 then
      begin
         sp_ArbGetAllHojas(v_ram_id_Cuenta,
                           v_clienteID);

      end;
      else
         v_ram_id_Cuenta := 0;

      end if;

   end;
   end if;

   if v_ram_id_Banco <> 0 then
   begin
      --	exec sp_ArbGetGroups @ram_id_Banco, @clienteID, @@us_id
      select sp_ArbIsRaiz(v_ram_id_Banco) into v_IsRaiz;

      if v_IsRaiz = 0 then
      begin
         sp_ArbGetAllHojas(v_ram_id_Banco,
                           v_clienteID);

      end;
      else
         v_ram_id_Banco := 0;

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
      select bcoc.bcoc_id,
                     '' TypeTask,
                     bcoc.bcoc_numero as "Número",
                     emp.emp_nombre Empresa,
                     cue.cue_nombre Cuenta,
                     bcoc.bco_nombre Banco,
                     bcoc.bcoc_fecha Fecha,
                     bcoc.bcoc_fechadesde Desde,
                     bcoc.bcoc_fechahasta Hasta,
                     bcoc.bcoc_saldoBco Saldo,
                     bcoc.Creado,
                     bcoc.Modificado,
                     us.us_nombre Modifico,
                     bcoc.bcoc_descrip Observaciones
        from BancoConciliacion bcoc
               join Cuenta cue
                on bcoc.cue_id = cue.cue_id
               join Banco bco
                on cue.bco_id = bco.bco_id
               join Usuario us
                on bcoc.modifico = us.us_id
               left join Empresa emp
                on cue.emp_id = emp.emp_id
         where p_Fini <= bcoc.bcoc_fecha
                 and p_Ffin >= bcoc.bcoc_fecha
/* -///////////////////////////////////////////////////////////////////////

	INICIO SEGUNDA PARTE DE ARBOLES

/////////////////////////////////////////////////////////////////////// */
                 and ( bcoc.cue_id = v_cue_id
                 or v_cue_id = 0 )
                 and ( cue.bco_id = v_bco_id
                 or v_bco_id = 0 )
                 and ( emp.emp_id = v_emp_id
                 or v_emp_id = 0 )
                 -- Arboles
                 and ( ( exists ( select rptarb_hojaid
                                  from rptArbolRamaHoja
                                     where rptarb_cliente = v_clienteID
                                             and tbl_id = 17
                                             and rptarb_hojaid = bcoc.cue_id ) )
                 or ( v_ram_id_Cuenta = 0 ) )
                 and ( ( exists ( select rptarb_hojaid
                                  from rptArbolRamaHoja
                                     where rptarb_cliente = v_clienteID
                                             and tbl_id = 13
                                             and rptarb_hojaid = cue.bco_id ) )
                 or ( v_ram_id_Banco = 0 ) )
                 and ( ( exists ( select rptarb_hojaid
                                  from rptArbolRamaHoja
                                     where rptarb_cliente = v_clienteID
                                             and tbl_id = 1018
                                             and rptarb_hojaid = cue.emp_id ) )
                 or ( v_ram_id_empresa = 0 ) )
        order by bcoc.bcoc_fecha,
                 bcoc.bcoc_numero;

end;