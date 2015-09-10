create or replace function sp_lsdoc_HojasRuta
(
  in p_us_id integer,
  p_Fini in date default null,
  p_Ffin in date default null,
  p_hr_nrodoc in varchar default null,
  p_cam_id in varchar default null,
  p_prs_id in varchar default null,
  out rtn refcursor
)
as
/* -///////////////////////////////////////////////////////////////////////
INICIO PRIMERA PARTE DE ARBOLES
/////////////////////////////////////////////////////////////////////// */
   v_cam_id integer;
   v_prs_id integer;
   v_ram_id_Camion integer;
   v_ram_id_Persona integer;
   v_clienteID integer;
   v_IsRaiz smallint;
begin

   select * from sp_ArbConvertId(p_cam_id) into v_cam_id, v_ram_id_Camion;

   select * from sp_ArbConvertId(p_prs_id) into v_prs_id, v_ram_id_Persona;

   select * from  sp_GetRptId() into v_clienteID;

   if v_ram_id_Camion <> 0 then
   begin
      -- exec sp_ArbGetGroups @ram_id_Camion, @clienteID, @@us_id
      select sp_ArbIsRaiz(v_ram_id_Camion) into v_IsRaiz;

      if v_IsRaiz = 0 then
      begin
         sp_ArbGetAllHojas(v_ram_id_Camion,
                           v_clienteID);

      end;
      else
         v_ram_id_Camion := 0;

      end if;

   end;
   end if;

   if v_ram_id_Persona <> 0 then
   begin
      -- exec sp_ArbGetGroups @ram_id_Persona, @clienteID, @@us_id
      select sp_ArbIsRaiz(v_ram_id_Persona) into v_IsRaiz;

      if v_IsRaiz = 0 then
      begin
         sp_ArbGetAllHojas(v_ram_id_Persona,
                           v_clienteID);

      end;
      else
         v_ram_id_Persona := 0;

      end if;

   end;
   end if;

   if isnumeric(p_hr_nrodoc) <> 0 then
      p_hr_nrodoc := substr('00000000' || p_hr_nrodoc, -1, 8);

   end if;

   open rtn for
/*- ///////////////////////////////////////////////////////////////////////
FIN PRIMERA PARTE DE ARBOLES
/////////////////////////////////////////////////////////////////////// */
      select hr.hr_id,
                     '' TypeTask,
                     hr.hr_fecha Fecha,
                     hr.hr_nrodoc Numero,
                     prs.prs_nombre Salida_de,
                     cam.cam_patente Camion,
                     hr.creado Creado,
                     hr.modificado Modificado,
                     us.us_nombre Modifico,
                     case
                          when hr.hr_cumplida <> 0 then 'Si'
                     else 'No'
                        end Cumplida,
                     hr.hr_descrip Descripcion
        from HojaRuta hr
               join Usuario us
                on hr.modifico = us.us_id
               left join Camion cam
                on hr.cam_id = cam.cam_id
               left join Persona prs
                on hr.prs_id = prs.prs_id
         where p_Fini <= hr.hr_fecha
                 and p_Ffin >= hr.hr_fecha
                 and ( hr.hr_nrodoc = p_hr_nrodoc
                 or p_hr_nrodoc is null )
/* -///////////////////////////////////////////////////////////////////////
INICIO SEGUNDA PARTE DE ARBOLES
/////////////////////////////////////////////////////////////////////// */
                 and ( hr.cam_id = v_cam_id
                 or v_cam_id = 0 )
                 and ( hr.prs_id = v_prs_id
                 or v_prs_id = 0 )
                 -- Arboles
                 and ( ( exists ( select rptarb_hojaid
                                  from rptArbolRamaHoja
                                     where rptarb_cliente = v_clienteID
                                             and tbl_id = 1019
                                             and rptarb_hojaid = hr.cam_id ) )
                 or ( v_ram_id_Camion = 0 ) )
                 and ( ( exists ( select rptarb_hojaid
                                  from rptArbolRamaHoja
                                     where rptarb_cliente = v_clienteID
                                             and tbl_id = 1004
                                             and rptarb_hojaid = hr.prs_id ) )
                 or ( v_ram_id_Persona = 0 ) )
        order by hr.hr_fecha,
                 hr.hr_nrodoc;

end;