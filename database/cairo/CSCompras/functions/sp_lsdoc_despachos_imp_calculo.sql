create or replace function sp_lsdoc_DespachoImpCalculos
/*
select * from RemitoCompra
sp_docRemitoCompraget 47
sp_lsdoc_DespachoImpCalculos
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
  p_prov_id in varchar default null,
  p_dic_titulo in varchar default null,
  p_dic_via in varchar default null,
  p_dic_viaempresa in varchar default null,
  p_dic_factura in varchar default null,
  p_dic_descrip in varchar default null,
  out rtn refcursor
)
as
/*- ///////////////////////////////////////////////////////////////////////
INICIO PRIMERA PARTE DE ARBOLES
/////////////////////////////////////////////////////////////////////// */
   v_prov_id integer;
   v_ram_id_Proveedor integer;
   v_clienteID integer;
   v_IsRaiz smallint;
begin

   select * from sp_ArbConvertId(p_prov_id) into v_prov_id, v_ram_id_Proveedor;

   select * from  sp_GetRptId() into v_clienteID;

   if v_ram_id_Proveedor <> 0 then
   begin
      --	exec sp_ArbGetGroups @ram_id_Proveedor, @clienteID, @@us_id
      select sp_ArbIsRaiz(v_ram_id_Proveedor) into v_IsRaiz;

      if v_IsRaiz = 0 then
      begin
         sp_ArbGetAllHojas(v_ram_id_Proveedor,
                           v_clienteID);

      end;
      else
         v_ram_id_Proveedor := 0;

      end if;

   end;
   end if;

/*- ///////////////////////////////////////////////////////////////////////
FIN PRIMERA PARTE DE ARBOLES
/////////////////////////////////////////////////////////////////////// */
   if p_dic_titulo <> '' then
      p_dic_titulo := '%' || p_dic_titulo || '%';

   end if;

   if p_dic_via <> '' then
      p_dic_via := '%' || p_dic_via || '%';

   end if;

   if p_dic_viaempresa <> '' then
      p_dic_viaempresa := '%' || p_dic_viaempresa || '%';

   end if;

   if p_dic_factura <> '' then
      p_dic_factura := '%' || p_dic_factura || '%';

   end if;

   if p_dic_descrip <> '' then
      p_dic_descrip := '%' || p_dic_descrip || '%';

   end if;

   open rtn for
      select dic.dic_id,
             '' TypeTask,
             case dic.dic_tipo
                              when 1 then 'Provisorio'
                              when 2 then 'Definitivo'   end Tipo,
             dic.dic_numero N_mero,
             prov.prov_nombre Proveedor,
             dic.dic_titulo Titulo,
             dic.dic_fecha Fecha,
             dic.dic_total Total,
             dic.dic_via V¡a,
             dic.dic_viaempresa Empresa,
             dic.dic_factura Factura,
             dic.dic_cambio1 Cambio_COMEX,
             dic.dic_cambio2 Cambio_Origen,
             dic.dic_pase Pase,
             dic.dic_totalgtos Total_Gtos,
             dic.dic_porcfob Porc_FOB,
             dic.dic_var Variación,
             dic.dic_porcfobfinal Porc_FOB_Final,
             dic.dic_total Total,
             dic.dic_totalorigen Total_Origen,
             mon1.mon_nombre Moneda_COMEX,
             mon2.mon_nombre Moneda_Origen,
             dic.Creado,
             dic.Modificado,
             us.us_nombre Modifico,
             dic.dic_descrip Observaciones
        from DespachoImpCalculo dic
               join RemitoCompra rc
                on dic.rc_id = rc.rc_id
               join Proveedor prov
                on rc.prov_id = prov.prov_id
               join Usuario us
                on dic.modifico = us.us_id
               join Moneda mon1
                on dic.mon_id1 = mon1.mon_id
               left join Moneda mon2
                on dic.mon_id2 = mon2.mon_id
         where p_Fini <= dic.dic_fecha
                 and p_Ffin >= dic.dic_fecha
                 and ( dic.dic_titulo LIKE p_dic_titulo
                 or p_dic_titulo is null )
                 and ( dic.dic_via LIKE p_dic_via
                 or p_dic_via is null )
                 and ( dic.dic_viaempresa LIKE p_dic_viaempresa
                 or p_dic_viaempresa is null )
                 and ( dic.dic_factura LIKE p_dic_factura
                 or p_dic_factura is null )
                 and ( dic.dic_descrip LIKE p_dic_descrip
                 or p_dic_descrip is null )
/* -///////////////////////////////////////////////////////////////////////
INICIO SEGUNDA PARTE DE ARBOLES
/////////////////////////////////////////////////////////////////////// */
                 and ( rc.prov_id = v_prov_id
                 or v_prov_id = 0 )
                 -- Arboles
                 and ( ( exists ( select rptarb_hojaid
                                  from rptArbolRamaHoja
                                     where rptarb_cliente = v_clienteID
                                             and tbl_id = 29
                                             and rptarb_hojaid = rc.prov_id ) )
                 or ( v_ram_id_Proveedor = 0 ) )
        order by dic.dic_fecha;

end;