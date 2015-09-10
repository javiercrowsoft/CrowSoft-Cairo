create or replace function sp_lsdoc_Emails
/*
sp_lsdoc_Emails 1,'20090101','20091231','0','0','0','0','0'
*/
(
  in p_us_id integer,
  p_Fini in date default null,
  p_Ffin in date default null,
  p_cli_id in varchar default null,
  p_est_id in varchar default null,
  p_cmi_id in varchar default null,
  p_cmia_id in varchar default null,
  p_cmiea_id in varchar default null,
  out rtn refcursor
)
as
/*- ///////////////////////////////////////////////////////////////////////
INICIO PRIMERA PARTE DE ARBOLES
/////////////////////////////////////////////////////////////////////// */
   v_cli_id integer;
   v_cmi_id integer;
   v_cmia_id integer;
   v_est_id integer;
   v_cmiea_id integer;
   v_ram_id_Cliente integer;
   v_ram_id_ComunidadInternet integer;
   v_ram_id_ComunidadInternetApli integer;
   v_ram_id_Estado integer;
   v_ram_id_ComunidadInternetEmai integer;
   v_clienteID integer;
   v_IsRaiz smallint;
begin

   select * from sp_ArbConvertId(p_cli_id) into v_cli_id, v_ram_id_Cliente;

   select * from sp_ArbConvertId(p_cmi_id) into v_cmi_id, v_ram_id_ComunidadInternet;

   select * from sp_ArbConvertId(p_cmia_id) into v_cmia_id, v_ram_id_ComunidadInternetApli;

   select * from sp_ArbConvertId(p_est_id) into v_est_id, v_ram_id_Estado;

   select * from sp_ArbConvertId(p_cmiea_id) into v_cmiea_id, v_ram_id_ComunidadInternetEmai;

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

   if v_ram_id_ComunidadInternet <> 0 then
   begin
      --	exec sp_ArbGetGroups @ram_id_ComunidadInternet, @clienteID, @@us_id
      select sp_ArbIsRaiz(v_ram_id_ComunidadInternet) into v_IsRaiz;

      if v_IsRaiz = 0 then
      begin
         sp_ArbGetAllHojas(v_ram_id_ComunidadInternet,
                           v_clienteID);

      end;
      else
         v_ram_id_ComunidadInternet := 0;

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

   if v_ram_id_ComunidadInternetApli <> 0 then
   begin
      --	exec sp_ArbGetGroups @ram_id_ComunidadInternetAplicacion, @clienteID, @@us_id
      select sp_ArbIsRaiz(v_ram_id_ComunidadInternetApli) into v_IsRaiz;

      if v_IsRaiz = 0 then
      begin
         sp_ArbGetAllHojas(v_ram_id_ComunidadInternetApli,
                           v_clienteID);

      end;
      else
         v_ram_id_ComunidadInternetApli := 0;

      end if;

   end;
   end if;

   if v_ram_id_ComunidadInternetEmai <> 0 then
   begin
      --	exec sp_ArbGetGroups @ram_id_ComunidadInternetEmailAccount, @clienteID, @@us_id
      select sp_ArbIsRaiz(v_ram_id_ComunidadInternetEmai) into v_IsRaiz;

      if v_IsRaiz = 0 then
      begin
         sp_ArbGetAllHojas(v_ram_id_ComunidadInternetEmai,
                           v_clienteID);

      end;
      else
         v_ram_id_ComunidadInternetEmai := 0;

      end if;

   end;
   end if;

   open rtn for
/*- ///////////////////////////////////////////////////////////////////////
FIN PRIMERA PARTE DE ARBOLES
/////////////////////////////////////////////////////////////////////// */
      -- sp_columns Facturaventa
      select cmie.cmie_id,
                     '' TypeTask,
                     cli.cli_nombre Cliente,
                     est.est_nombre Estado,
                     cmie.cmie_date Fecha,
                     cmir.cmi_nombre Comunidad,
                     cmia.cmia_nombre Aplicacion,
                     cmiea.cmiea_nombre Cuenta_de_Correo,
                     case
                          when cmir.cmir_id is not null then 'Si'
                     else 'No'
                        end Respondido,
                     cmie.Creado,
                     '' Observaciones
        from ComunidadInternetMail cmie
               left join Estado est
                on cmie.est_id = est.est_id
               left join ComunidadInternet cmi
                on cmie.cmi_id = cmi.cmi_id
               left join ComunidadInternetEmailAccount cmiea
                on cmie.cmiea_id = cmiea.cmiea_id
               left join Cliente cli
                on cmie.cli_id = cli.cli_id
               left join ComunidadInternetRespuesta cmir
                on cmie.cmie_id = cmir.cmie_id
               left join ComunidadInternetAplicacion cmia
                on cmir.cmia_id = cmia.cmia_id
         where p_Fini <= cmie.cmie_date
                 and p_Ffin >= cmie.cmie_date
/* -///////////////////////////////////////////////////////////////////////
INICIO SEGUNDA PARTE DE ARBOLES
/////////////////////////////////////////////////////////////////////// */
                 and ( cmie.cli_id = v_cli_id
                 or v_cli_id = 0 )
                 and ( cmie.est_id = v_est_id
                 or v_est_id = 0 )
                 and ( cmir.cmia_id = v_cmia_id
                 or v_cmia_id = 0 )
                 and ( cmie.cmi_id = v_cmi_id
                 or v_cmi_id = 0 )
                 and ( cmie.cmiea_id = v_cmiea_id
                 or v_cmiea_id = 0 )
                 -- Arboles
                 and ( ( exists ( select rptarb_hojaid
                                  from rptArbolRamaHoja
                                     where rptarb_cliente = v_clienteID
                                             and tbl_id = 28
                                             and rptarb_hojaid = cmie.cli_id ) )
                 or ( v_ram_id_Cliente = 0 ) )
                 and ( ( exists ( select rptarb_hojaid
                                  from rptArbolRamaHoja
                                     where rptarb_cliente = v_clienteID
                                             and tbl_id = 21
                                             and rptarb_hojaid = cmie.cmi_id ) )
                 or ( v_ram_id_ComunidadInternet = 0 ) )
                 and ( ( exists ( select rptarb_hojaid
                                  from rptArbolRamaHoja
                                     where rptarb_cliente = v_clienteID
                                             and tbl_id = 4005
                                             and rptarb_hojaid = cmie.est_id ) )
                 or ( v_ram_id_Estado = 0 ) )
                 and ( ( exists ( select rptarb_hojaid
                                  from rptArbolRamaHoja
                                     where rptarb_cliente = v_clienteID
                                             and tbl_id = 1007
                                             and rptarb_hojaid = cmir.cmia_id ) )
                 or ( v_ram_id_ComunidadInternetApli = 0 ) )
                 and ( ( exists ( select rptarb_hojaid
                                  from rptArbolRamaHoja
                                     where rptarb_cliente = v_clienteID
                                             and tbl_id = 15
                                             and rptarb_hojaid = cmie.cmiea_id ) )
                 or ( v_ram_id_ComunidadInternetEmai = 0 ) )
        order by cmie.cmie_date;

end;