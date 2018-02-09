/*
CrowSoft-Cairo
==============

ERP application written in Scala Play Framework and Postgresql

Copyright (C) 2012  Javier Mariano Alvarez

This program is free software; you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation; either version 2 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS for A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License along
with this program; if not, write to the Free Software Foundation, Inc.,
51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.

========================================================================

Created by Javier

http://www.crowsoft.com.ar

javier at crowsoft.com.ar
*/
-- Function: sp_lsdoc_pedidos_venta()

-- drop function sp_lsdoc_pedidos_venta(integer, date, date, varchar, varchar, varchar, varchar, varchar, varchar, varchar);

create or replace function sp_lsdoc_pedidos_venta
(
  in p_us_id integer,
  in p_Fini date,
  in p_Ffin date,
  in p_cli_id varchar,
  in p_est_id varchar,
  in p_ccos_id varchar,
  in p_suc_id varchar,
  in p_ven_id varchar,
  in p_doc_id varchar,
  in p_cpg_id varchar,
  in p_emp_id varchar,
  out rtn refcursor
)
  returns refcursor as
$BODY$
declare
   v_cli_id integer;
   v_ccos_id integer;
   v_suc_id integer;
   v_est_id integer;
   v_ven_id integer;
   v_doc_id integer;
   v_cpg_id integer;
   v_emp_id integer;
   v_ram_id_Cliente integer;
   v_ram_id_CentroCosto integer;
   v_ram_id_sucursal integer;
   v_ram_id_estado integer;
   v_ram_id_vendedor integer;
   v_ram_id_documento integer;
   v_ram_id_CondicionPago integer;
   v_ram_id_empresa integer;
   v_clienteID integer;
   v_IsRaiz smallint;
   
  v_pv_id      int;
  v_last_pv_id int;
  v_pregunta   varchar(4000);
  v_respuesta  varchar(4000);
  v_preguntas  varchar(7000);
     
begin

   rtn := 'rtn';

   /*- ///////////////////////////////////////////////////////////////////////
    INICIO PRIMERA PARTE DE ARBOLES
   /////////////////////////////////////////////////////////////////////// */
      
   select * from sp_ArbConvertId(p_cli_id) into v_cli_id, v_ram_id_Cliente;

   select * from sp_ArbConvertId(p_ccos_id) into v_ccos_id, v_ram_id_CentroCosto;

   select * from sp_ArbConvertId(p_suc_id) into v_suc_id, v_ram_id_sucursal;

   select * from sp_ArbConvertId(p_est_id) into v_est_id, v_ram_id_estado;

   select * from sp_ArbConvertId(p_ven_id) into v_ven_id, v_ram_id_vendedor;

   select * from sp_ArbConvertId(p_doc_id) into v_doc_id, v_ram_id_documento;

   select * from sp_ArbConvertId(p_cpg_id) into v_cpg_id, v_ram_id_CondicionPago;

   select * from sp_ArbConvertId(p_emp_id) into v_emp_id, v_ram_id_empresa;

   select * from  sp_GetRptId() into v_clienteID;

   if v_ram_id_Cliente <> 0 then
   begin
      -- exec sp_ArbGetGroups @ram_id_Cliente, @clienteID, @@us_id
      select sp_ArbIsRaiz(v_ram_id_Cliente) into v_IsRaiz;

      if v_IsRaiz = 0 then
      begin
         perform sp_ArbGetAllHojas(v_ram_id_Cliente,
                           v_clienteID);

      end;
      else
         v_ram_id_Cliente := 0;

      end if;

   end;
   end if;

   if v_ram_id_CentroCosto <> 0 then
   begin
      -- exec sp_ArbGetGroups @ram_id_CentroCosto, @clienteID, @@us_id
      select sp_ArbIsRaiz(v_ram_id_CentroCosto) into v_IsRaiz;

      if v_IsRaiz = 0 then
      begin
         perform sp_ArbGetAllHojas(v_ram_id_CentroCosto,
                           v_clienteID);

      end;
      else
         v_ram_id_CentroCosto := 0;

      end if;

   end;
   end if;

   if v_ram_id_estado <> 0 then
   begin
      -- exec sp_ArbGetGroups @ram_id_Estado, @clienteID, @@us_id
      select sp_ArbIsRaiz(v_ram_id_estado) into v_IsRaiz;

      if v_IsRaiz = 0 then
      begin
         perform sp_ArbGetAllHojas(v_ram_id_estado,
                           v_clienteID);

      end;
      else
         v_ram_id_estado := 0;

      end if;

   end;
   end if;

   if v_ram_id_sucursal <> 0 then
   begin
      -- exec sp_ArbGetGroups @ram_id_Sucursal, @clienteID, @@us_id
      select sp_ArbIsRaiz(v_ram_id_sucursal) into v_IsRaiz;

      if v_IsRaiz = 0 then
      begin
         perform sp_ArbGetAllHojas(v_ram_id_sucursal,
                           v_clienteID);

      end;
      else
         v_ram_id_sucursal := 0;

      end if;

   end;
   end if;

   if v_ram_id_vendedor <> 0 then
   begin
      -- exec sp_ArbGetGroups @ram_id_Vendedor, @clienteID, @@us_id
      select sp_ArbIsRaiz(v_ram_id_vendedor) into v_IsRaiz;

      if v_IsRaiz = 0 then
      begin
         perform sp_ArbGetAllHojas(v_ram_id_vendedor,
                           v_clienteID);

      end;
      else
         v_ram_id_vendedor := 0;

      end if;

   end;
   end if;

   if v_ram_id_documento <> 0 then
   begin
      -- exec sp_ArbGetGroups @ram_id_Documento, @clienteID, @@us_id
      select sp_ArbIsRaiz(v_ram_id_documento) into v_IsRaiz;

      if v_IsRaiz = 0 then
      begin
         perform sp_ArbGetAllHojas(v_ram_id_documento,
                           v_clienteID);

      end;
      else
         v_ram_id_documento := 0;

      end if;

   end;
   end if;

   if v_ram_id_CondicionPago <> 0 then
   begin
      -- exec sp_ArbGetGroups @ram_id_CondicionPago, @clienteID, @@us_id
      select sp_ArbIsRaiz(v_ram_id_CondicionPago) into v_IsRaiz;

      if v_IsRaiz = 0 then
      begin
         perform sp_ArbGetAllHojas(v_ram_id_CondicionPago,
                           v_clienteID);

      end;
      else
         v_ram_id_CondicionPago := 0;

      end if;

   end;
   end if;

   if v_ram_id_empresa <> 0 then
   begin
      -- exec sp_ArbGetGroups @ram_id_Empresa, @clienteID, @@us_id
      select sp_ArbIsRaiz(v_ram_id_empresa) into v_IsRaiz;

      if v_IsRaiz = 0 then
      begin
         perform sp_ArbGetAllHojas(v_ram_id_empresa,
                           v_clienteID);

      end;
      else
         v_ram_id_empresa := 0;

      end if;

   end;
   end if;

   /*- ///////////////////////////////////////////////////////////////////////
   FIN PRIMERA PARTE DE ARBOLES
   /////////////////////////////////////////////////////////////////////// */
 
 
   --/////////////////////////////////////////////////////////////////////////
   --
   -- Preguntas de comunidad
   --
   
   create temporary table tt_t_pedidos (pv_id integer not null) on commit drop;
 
   insert into tt_t_pedidos
   select pv.pv_id
   from PedidoVenta pv
   where p_Fini <= pv_fecha
     and p_Ffin >= pv_fecha   
  
        /* -///////////////////////////////////////////////////////////////////////
        INICIO SEGUNDA PARTE DE ARBOLES
        /////////////////////////////////////////////////////////////////////// */

          and ( pv.cli_id = v_cli_id
          or v_cli_id = 0 )
          and ( pv.est_id = v_est_id
          or v_est_id = 0 )
          and ( pv.suc_id = v_suc_id
          or v_suc_id = 0 )
          and ( pv.doc_id = v_doc_id
          or v_doc_id = 0 )
          and ( pv.cpg_id = v_cpg_id
          or v_cpg_id = 0 )
          and ( pv.ccos_id = v_ccos_id
          or v_ccos_id = 0 )
          and ( pv.ven_id = v_ven_id
          or v_ven_id = 0 )
          and ( pv.emp_id = v_emp_id
          or v_emp_id = 0 )
          -- Arboles
          and ( ( exists ( select rptarb_hojaid
                           from rptArbolRamaHoja
                              where rptarb_cliente = v_clienteID
                                      and tbl_id = 28
                                      and rptarb_hojaid = pv.cli_id ) )
          or ( v_ram_id_Cliente = 0 ) )
          and ( ( exists ( select rptarb_hojaid
                           from rptArbolRamaHoja
                              where rptarb_cliente = v_clienteID
                                      and tbl_id = 21
                                      and rptarb_hojaid = pv.ccos_id ) )
          or ( v_ram_id_CentroCosto = 0 ) )
          and ( ( exists ( select rptarb_hojaid
                           from rptArbolRamaHoja
                              where rptarb_cliente = v_clienteID
                                      and tbl_id = 4005
                                      and rptarb_hojaid = pv.est_id ) )
          or ( v_ram_id_estado = 0 ) )
          and ( ( exists ( select rptarb_hojaid
                           from rptArbolRamaHoja
                              where rptarb_cliente = v_clienteID
                                      and tbl_id = 1007
                                      and rptarb_hojaid = pv.suc_id ) )
          or ( v_ram_id_sucursal = 0 ) )
          and ( ( exists ( select rptarb_hojaid
                           from rptArbolRamaHoja
                              where rptarb_cliente = v_clienteID
                                      and tbl_id = 15
                                      and rptarb_hojaid = pv.ven_id ) )
          or ( v_ram_id_vendedor = 0 ) )
          and ( ( exists ( select rptarb_hojaid
                           from rptArbolRamaHoja
                              where rptarb_cliente = v_clienteID
                                      and tbl_id = 4001
                                      and rptarb_hojaid = pv.doc_id ) )
          or ( v_ram_id_documento = 0 ) )
          and ( ( exists ( select rptarb_hojaid
                           from rptArbolRamaHoja
                              where rptarb_cliente = v_clienteID
                                      and tbl_id = 1005
                                      and rptarb_hojaid = pv.cpg_id ) )
          or ( v_ram_id_CondicionPago = 0 ) )
          and ( ( exists ( select rptarb_hojaid
                           from rptArbolRamaHoja
                              where rptarb_cliente = v_clienteID
                                      and tbl_id = 1018
                                      and rptarb_hojaid = pv.emp_id ) )
          or ( v_ram_id_empresa = 0 ) );
  
  
  create temporary table tt_t_preguntas (pv_id int, preguntas varchar(7000) NOT NULL) on commit drop;
  
  v_last_pv_id := 0;

  for v_pv_id, v_pregunta, v_respuesta in

      select pv.pv_id, cmip_pregunta, cmip_respuesta
      from tt_t_pedidos pv
      inner join PedidoVenta pvc on pv.pv_id = pvc.pv_id
      inner join Cliente cli on pvc.cli_id = cli.cli_id
      inner join ComunidadInternetPregunta cmip on replace(cli_codigocomunidad,'(ML)#','') = cmip_nick
      where pvc.creado >= cmip_fecha
      order by pv.pv_id

  loop

     if v_last_pv_id <> v_pv_id then

      if v_last_pv_id <> 0 then

         insert into tt_t_preguntas (pv_id, preguntas) values (v_pv_id, CHR(10) || v_preguntas);

      end if;

      v_preguntas := '';
      v_last_pv_id := v_pv_id;

     end if;

     v_preguntas := v_preguntas || v_pregunta || CHR(10);

     if v_respuesta <> '' then

        v_preguntas := v_preguntas || 'Respuesta: ' || v_respuesta || CHR(10);

     end if;

  end loop;


  if v_last_pv_id <> 0 then

     insert into tt_t_preguntas (pv_id, preguntas) values (v_pv_id, CHR(10) || v_preguntas);

  end if;


 --/////////////////////////////////////////////////////////////////////////

 open rtn for

      select pv.pv_id,
             ''                    TypeTask,
             pv_numero             Numero,
             pv_nrodoc             Comprobante,
             cli_nombre            Cliente,
             cli_codigo            Codigo,
             cli_codigocomunidad   Codigo_Com,
             cli_email             Mail,
             doc_nombre            Documento,
             est_nombre            Estado,

             case pv_cvxi_calificado
                when 0 then 'No'
                else 'Si'
             end                   Calificado,

             pv_fecha              Fecha,
             pv_fechaentrega       Fecha_de_entrega,

             case impreso
                when 0 then 'No'
                else        'Si'
             end                   Impreso,

             pv_neto               Neto,
             pv_ivari              IVA_RI,
             pv_ivarni             IVA_RNI,
             pv_subtotal           Subtotal,
             pv_total              Total,
             pv_pendiente          Pendiente,

             case pv_firmado
                when 0 then 'No'
                else 'Si'
             end                   Firmado,

             case impreso
                when 0 then 'No'
                else 'Si'
             end                   Impreso,

             pv_descuento1         Desc_1,
             pv_descuento2         Desc_2,
             pv_importedesc1       Desc_1,
             pv_importedesc2       Desc_2,
             lp_nombre             Lista_de_Precios,
             ld_nombre             Lista_de_descuentos,
             cpg_nombre            Condicion_de_Pago,
             ccos_nombre           Centro_de_costo,
             suc_nombre            Sucursal,
             emp_nombre            Empresa,
             pv.creado,
             pv.modificado,
             us_nombre             Modifico,

             pv_descrip
             || coalesce(preguntas, '')
                                   Observaciones

        from PedidoVenta pv
        join Documento
          on pv.doc_id = Documento.doc_id
        join Empresa
          on Documento.emp_id = Empresa.emp_id
        join CondicionPago
          on pv.cpg_id = CondicionPago.cpg_id
        join Estado
          on pv.est_id = Estado.est_id
        join Sucursal
          on pv.suc_id = Sucursal.suc_id
        join Cliente
          on pv.cli_id = Cliente.cli_id
        join Usuario
          on pv.modifico = Usuario.us_id
        left join Vendedor
          on pv.ven_id = Vendedor.ven_id
        left join CentroCosto
          on pv.ccos_id = CentroCosto.ccos_id
        left join ListaPrecio
          on pv.lp_id = ListaPrecio.lp_id
        left join ListaDescuento
          on pv.ld_id = ListaDescuento.ld_id
        left join tt_t_preguntas t
          on pv.pv_id = t.pv_id
        where pv.pv_id in (select pv_id from tt_t_pedidos)
        order by pv_fecha;

end;
$BODY$
  language plpgsql volatile
  cost 100;
alter function sp_lsdoc_pedidos_venta(integer, date, date, varchar, varchar, varchar, varchar, varchar, varchar, varchar, varchar)
  owner to postgres;



