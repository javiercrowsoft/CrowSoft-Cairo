create or replace function sp_lsdoc_EmpleadoPeriodos
(
  in p_us_id integer,
  p_Fini in date default null,
  p_Ffin in date default null,
  p_empe_numero in NUMBER default null,
  p_ccos_id in varchar default null,
  p_em_id in varchar default null,
  out rtn refcursor
)
as
/* -///////////////////////////////////////////////////////////////////////
INICIO PRIMERA PARTE DE ARBOLES
/////////////////////////////////////////////////////////////////////// */
   v_ccos_id integer;
   v_em_id integer;
   v_ram_id_CentroCosto integer;
   v_ram_id_Empleado integer;
   v_clienteID integer;
   v_IsRaiz smallint;
begin

   select * from sp_ArbConvertId(p_ccos_id) into v_ccos_id, v_ram_id_CentroCosto;

   select * from sp_ArbConvertId(p_em_id) into v_em_id, v_ram_id_Empleado;

   select * from  sp_GetRptId() into v_clienteID;

   if v_ram_id_CentroCosto <> 0 then
   begin
      -- exec sp_ArbGetGroups @ram_id_CentroCosto, @clienteID, @@us_id
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

   if v_ram_id_Empleado <> 0 then
   begin
      -- exec sp_ArbGetGroups @ram_id_Empleado, @clienteID, @@us_id
      select sp_ArbIsRaiz(v_ram_id_Empleado) into v_IsRaiz;

      if v_IsRaiz = 0 then
      begin
         sp_ArbGetAllHojas(v_ram_id_Empleado,
                           v_clienteID);

      end;
      else
         v_ram_id_Empleado := 0;

      end if;

   end;
   end if;

/*- ///////////////////////////////////////////////////////////////////////
FIN PRIMERA PARTE DE ARBOLES
/////////////////////////////////////////////////////////////////////// */
   if not ( v_em_id = 0
     and v_ram_id_Empleado = 0 ) then
   begin
      insert into tt_t_empleado_periodo
        ( select empe_id
          from EmpleadoHoras emh
             where ( emh.em_id = v_em_id
                     or v_em_id = 0 )
                     and ( ( exists ( select rptarb_hojaid
                                      from rptArbolRamaHoja
                                         where rptarb_cliente = v_clienteID
                                                 and tbl_id = 35005
                                                 and rptarb_hojaid = emh.em_id ) )
                     or ( v_ram_id_Empleado = 0 ) ) );

   end;
   end if;

   open rtn for
      --////////////////////////////////////////////////////////////////////////
      select empe.empe_id,
                     '' TypeTask,
                     empe.empe_fecha Fecha,
                     empe.empe_numero Numero,
                     ccos.ccos_nombre Centro_de_Costo,
                     empe.creado Creado,
                     empe.modificado Modificado,
                     us.us_nombre Modifico,
                     empe.empe_descrip Descripcion
        from EmpleadoPeriodo empe
               join Usuario us
                on empe.modifico = us.us_id
               left join CentroCosto ccos
                on empe.ccos_id = ccos.ccos_id
         where p_Fini <= empe.empe_fecha
                 and p_Ffin >= empe.empe_fecha
                 and ( empe.empe_numero = p_empe_numero
                 or p_empe_numero = 0 )
                 and ( ( v_em_id = 0
                 and v_ram_id_Empleado = 0 )
                 or exists ( select *
                             from tt_t_empleado_periodo
                                where empe_id = empe.empe_id ) )
/* -///////////////////////////////////////////////////////////////////////
INICIO SEGUNDA PARTE DE ARBOLES
/////////////////////////////////////////////////////////////////////// */
                 and ( empe.ccos_id = v_ccos_id
                 or v_ccos_id = 0 )
                 -- Arboles
                 and ( ( exists ( select rptarb_hojaid
                                  from rptArbolRamaHoja
                                     where rptarb_cliente = v_clienteID
                                             and tbl_id = 1019
                                             and rptarb_hojaid = empe.ccos_id ) )
                 or ( v_ram_id_CentroCosto = 0 ) )
        order by empe.empe_fecha,
                 empe.empe_numero;

end;