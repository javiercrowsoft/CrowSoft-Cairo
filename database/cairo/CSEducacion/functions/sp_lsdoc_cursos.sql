create or replace function sp_lsdoc_Cursos
(
  in p_us_id integer,
  p_Fini in date default null ,
  p_Ffin in date default null ,
  p_prof_id in varchar default null ,
  p_mat_id in varchar default null ,
  p_alum_id in varchar default null ,
  out rtn refcursor
)
as
/*- ///////////////////////////////////////////////////////////////////////
INICIO PRIMERA PARTE DE ARBOLES
/////////////////////////////////////////////////////////////////////// */
   v_prof_id integer;
   v_mat_id integer;
   v_alum_id integer;
   v_ram_id_profesor integer;
   v_ram_id_materia integer;
   v_ram_id_alumno integer;
   v_clienteID integer;
   v_IsRaiz smallint;
begin

   select * from sp_ArbConvertId(p_prof_id) into v_prof_id, v_ram_id_profesor;

   select * from sp_ArbConvertId(p_mat_id) into v_mat_id, v_ram_id_materia;

   select * from sp_ArbConvertId(p_alum_id) into v_alum_id, v_ram_id_alumno;

   select * from  sp_GetRptId() into v_clienteID;

   if v_ram_id_profesor <> 0 then
   begin
      --	exec sp_ArbGetGroups @ram_id_profesor, @clienteID, @@us_id
      select sp_ArbIsRaiz(v_ram_id_profesor) into v_IsRaiz;

      if v_IsRaiz = 0 then
      begin
         sp_ArbGetAllHojas(v_ram_id_profesor,
                           v_clienteID);

      end;
      else
         v_ram_id_profesor := 0;

      end if;

   end;
   end if;

   if v_ram_id_materia <> 0 then
   begin
      --	exec sp_ArbGetGroups @ram_id_materia, @clienteID, @@us_id
      select sp_ArbIsRaiz(v_ram_id_materia) into v_IsRaiz;

      if v_IsRaiz = 0 then
      begin
         sp_ArbGetAllHojas(v_ram_id_materia,
                           v_clienteID);

      end;
      else
         v_ram_id_materia := 0;

      end if;

   end;
   end if;

   if v_ram_id_alumno <> 0 then
   begin
      --	exec sp_ArbGetGroups @ram_id_alumno, @clienteID, @@us_id
      select sp_ArbIsRaiz(v_ram_id_alumno) into v_IsRaiz;

      if v_IsRaiz = 0 then
      begin
         sp_ArbGetAllHojas(v_ram_id_alumno,
                           v_clienteID);

      end;
      else
         v_ram_id_alumno := 0;

      end if;

   end;
   end if;

   open rtn for
/*- ///////////////////////////////////////////////////////////////////////
FIN PRIMERA PARTE DE ARBOLES
/////////////////////////////////////////////////////////////////////// */
      select cur.cur_id,
                     '' TypeTask,
                     cur.cur_nombre Nombre,
                     cur.cur_codigo Codigo,
                     mat.mat_nombre Materia,
                     prsp.prs_apellido || ', ' || prsp.prs_nombre Profesor,
                     cur.cur_desde Desde,
                     cur.cur_hasta Hasta,
                     us_nombre Modifico,
                     cur.creado Creado,
                     cur.modificado Modificado,
                     cur.cur_descrip Observaciones
        from Curso cur
               join Usuario
                on cur.modifico = Usuario.us_id
               left join Profesor prof
                on cur.prof_id = prof.prof_id
               left join Persona prsp
                on prof.prs_id = prsp.prs_id
               left join Materia mat
                on cur.mat_id = mat.mat_id
         where cur.cur_desde >= p_Fini
                 and cur.cur_desde <= p_Ffin
/* -///////////////////////////////////////////////////////////////////////
INICIO SEGUNDA PARTE DE ARBOLES
/////////////////////////////////////////////////////////////////////// */
                 and ( cur.prof_id = v_prof_id
                 or v_prof_id = 0 )
                 and ( cur.mat_id = v_mat_id
                 or v_mat_id = 0 )
                 -- Arboles
                 and ( ( exists ( select rptarb_hojaid
                                  from rptArbolRamaHoja
                                     where rptarb_cliente = v_clienteID
                                             and tbl_id = 37003
                                             and rptarb_hojaid = cur.prof_id ) )
                 or ( v_ram_id_profesor = 0 ) )
                 and ( ( exists ( select rptarb_hojaid
                                  from rptArbolRamaHoja
                                     where rptarb_cliente = v_clienteID
                                             and tbl_id = 37001
                                             and rptarb_hojaid = cur.mat_id ) )
                 or ( v_ram_id_materia = 0 ) )
                 and ( ( v_alum_id = 0
                 and v_ram_id_alumno = 0 )
                 or ( exists ( select *
                               from CursoItem curi
                                  where curi.cur_id = cur.cur_id
                                          and ( curi.alum_id = v_alum_id
                                          or v_alum_id = 0 )
                                          and ( ( exists ( select rptarb_hojaid
                                                           from rptArbolRamaHoja
                                                              where rptarb_cliente = v_clienteID
                                                                      and tbl_id = 37004
                                                                      and rptarb_hojaid = curi.alum_id ) )
                                          or ( v_ram_id_alumno = 0 ) ) ) ) );

end;