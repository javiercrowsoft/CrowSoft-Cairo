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
-- Function: dc_csc_com_0010(integer, date, date, character varying, character varying, character varying, character varying, smallint, character varying, smallint, smallint, smallint)

-- drop function dc_csc_com_0010(integer, date, date, character varying, character varying, character varying, character varying, smallint, character varying, smallint, smallint, smallint);

create or replace function dc_csc_com_0010(in p_us_id integer, in p_fini date, in p_ffin date, in p_prov_id character varying, in p_suc_id character varying, in p_cue_id character varying, in p_cico_id character varying, in p_solodeudores smallint, in p_emp_id character varying, in p_ntipo smallint, in p_conremito smallint, in p_saldominimo smallint, out rtn refcursor)
  returns refcursor as
$BODY$
declare
   v_prov_id integer;
   v_suc_id integer;
   v_cue_id integer;
   v_cico_id integer;
   v_emp_id integer;
   v_ram_id_Proveedor integer;
   v_ram_id_Sucursal integer;
   v_ram_id_Cuenta integer;
   v_ram_id_circuitocontable integer;
   v_ram_id_Empresa integer;
   v_clienteID integer;
   v_IsRaiz smallint;
   v_cta_acreedor numeric(3,0);
   v_cta_acreedoropg numeric(3,0);
begin

   rtn = 'rtn';
   
        create temporary table tt_dc_csc_com_0010
        (
          prov_id integer  not null,
          cue_id integer  ,
          emp_id integer  not null,
          suc_id integer  not null,
          neto decimal(18,6) 
           default (0) not null ,
          descuento decimal(18,6) 
           default (0) not null ,
          subtotal decimal(18,6) 
           default (0) not null ,
          iva decimal(18,6) 
           default (0) not null ,
          total decimal(18,6) 
           default (0) not null ,
          pago decimal(18,6) 
           default (0) not null ,
          pendiente decimal(18,6)  not null
        ) on commit drop;

   select sp_ArbConvertId(p_prov_id) into v_prov_id, v_ram_id_Proveedor;
/*
   select sp_ArbConvertId(p_suc_id) into v_suc_id, v_ram_id_Sucursal;

   select sp_ArbConvertId(p_cue_id) into v_cue_id, v_ram_id_Cuenta;

   select sp_ArbConvertId(p_cico_id) into v_cico_id, v_ram_id_circuitocontable;

   select sp_ArbConvertId(p_emp_id) into v_emp_id, v_ram_id_Empresa;

   select sp_GetRptId(v_clienteID);

   if v_ram_id_Proveedor <> 0 then
   begin
      --	exec sp_ArbGetGroups @ram_id_Proveedor, @clienteID, @@us_id
      select sp_ArbIsRaiz(v_ram_id_Proveedor) into v_IsRaiz;

      if v_IsRaiz = 0 then
      begin
         select sp_ArbGetAllHojas(v_ram_id_Proveedor,
                           v_clienteID);

      end;
      else
         v_ram_id_Proveedor := 0;

      end if;

   end;
   end if;

   if v_ram_id_Sucursal <> 0 then
   begin
      --	exec sp_ArbGetGroups @ram_id_Sucursal, @clienteID, @@us_id
      select sp_ArbIsRaiz(v_ram_id_Sucursal) into v_IsRaiz;

      if v_IsRaiz = 0 then
      begin
         select sp_ArbGetAllHojas(v_ram_id_Sucursal,
                           v_clienteID);

      end;
      else
         v_ram_id_Sucursal := 0;

      end if;

   end;
   end if;

   if v_ram_id_Cuenta <> 0 then
   begin
      --	exec sp_ArbGetGroups @ram_id_Cuenta, @clienteID, @@us_id
      select sp_ArbIsRaiz(v_ram_id_Cuenta) into v_IsRaiz;

      if v_IsRaiz = 0 then
      begin
         select sp_ArbGetAllHojas(v_ram_id_Cuenta,
                           v_clienteID);

      end;
      else
         v_ram_id_Cuenta := 0;

      end if;

   end;
   end if;

   if v_ram_id_circuitocontable <> 0 then
   begin
      --	exec sp_ArbGetGroups @ram_id_circuitocontable, @clienteID, @@us_id
      select sp_ArbIsRaiz(v_ram_id_circuitocontable) into v_IsRaiz;

      if v_IsRaiz = 0 then
      begin
         select sp_ArbGetAllHojas(v_ram_id_circuitocontable,
                           v_clienteID);

      end;
      else
         v_ram_id_circuitocontable := 0;

      end if;

   end;
   end if;

   if v_ram_id_Empresa <> 0 then
   begin
      --	exec sp_ArbGetGroups @ram_id_Empresa, @clienteID, @@us_id
      select sp_ArbIsRaiz(v_ram_id_Empresa) into v_IsRaiz;

      if v_IsRaiz = 0 then
      begin
         select sp_ArbGetAllHojas(v_ram_id_Empresa,
                           v_clienteID);

      end;
      else
         v_ram_id_Empresa := 0;

      end if;

   end;
   end if;

   v_cta_acreedor := 2;

   v_cta_acreedoropg := 5;

   --/////////////////////////////////////////////////////////////////////////
   --
   --	Saldos Iniciales
   --
   --/////////////////////////////////////////////////////////////////////////
   

   --//////////////////////////////////////////
   -- Ordenes de Pago
   --//////////////////////////////////////////
   insert into tt_dc_csc_com_0010
     ( prov_id, cue_id, emp_id, suc_id, pago, pendiente )
     ( select opg.prov_id,
              ( select min(cue_id)
                from OrdenPagoItem
                   where opg_id = opg.opg_id
                           and opgi_tipo = 5 ),
              doc.emp_id,
              opg.suc_id,
              opg.opg_total,
              case
                   when p_nTipo = 0 then -opg.opg_pendiente
              else -opg.opg_total - coalesce(( select SUM(fcopg.fcopg_importe)
                                          from FacturaCompraOrdenPago fcopg
                                                 join FacturaCompra fc
                                                  on fcopg.fc_id = fc.fc_id
                                                 join Documento doc
                                                  on fc.doc_id = doc.doc_id
                                             where fcopg.opg_id = opg.opg_id
                                                     and fc.est_id <> 7
                                                     and ( doc.cico_id = v_cico_id
                                                     or v_cico_id = 0 )
                                                     and ( doc.emp_id = v_emp_id
                                                     or v_emp_id = 0 )
                                                     and ( ( fc.fc_fecha <= p_Fini
                                                     and p_nTipo <> 3 )
                                                     or ( fc.fc_fecha <= p_Ffin
                                                     and p_nTipo = 3 ) ) ), 0)
                 end col
       from OrdenPago opg
              join Documento doc
               on opg.doc_id = doc.doc_id
          where ( ( opg.opg_fecha < p_Fini
                  and p_nTipo = 0 )
                  or ( opg.opg_fecha <= p_Fini
                  and p_nTipo in ( 1,2 ) )
                  or ( opg.opg_fecha >= p_Fini
                  and opg.opg_fecha <= p_Ffin
                  and p_nTipo = 3 ) )
                  and opg.est_id <> 7
                  and ( exists ( select *
                                      from EmpresaUsuario
                                         where emp_id = doc.emp_id
                                                 and us_id = p_us_id )
                  or ( p_us_id = 1 ) )
/ * -///////////////////////////////////////////////////////////////////////
		
		INICIO SEGUNDA PARTE DE ARBOLES
		
/////////////////////////////////////////////////////////////////////// * /
                  and ( opg.prov_id = v_prov_id
                  or v_prov_id = 0 )
                  and ( opg.suc_id = v_suc_id
                  or v_suc_id = 0 )
                  and ( doc.cico_id = v_cico_id
                  or v_cico_id = 0 )
                  and ( exists ( select *
                                 from OrdenPagoItem
                                    where opg_id = opg.opg_id
                                            and opgi_tipo = v_cta_acreedoropg
                                            and cue_id = v_cue_id )
                  or v_cue_id = 0 )
                  and ( doc.emp_id = v_emp_id
                  or v_emp_id = 0 )
                  -- Arboles
                  and ( ( exists ( select rptarb_hojaid
                                   from rptArbolRamaHoja
                                      where rptarb_cliente = v_clienteID
                                              and tbl_id = 29
                                              and rptarb_hojaid = opg.prov_id ) )
                  or ( v_ram_id_Proveedor = 0 ) )
                  and ( ( exists ( select rptarb_hojaid
                                   from rptArbolRamaHoja
                                      where rptarb_cliente = v_clienteID
                                              and tbl_id = 1007
                                              and rptarb_hojaid = opg.suc_id ) )
                  or ( v_ram_id_Sucursal = 0 ) )
                  and ( ( exists ( select rptarb_hojaid
                                   from rptArbolRamaHoja
                                      where rptarb_cliente = v_clienteID
                                              and tbl_id = 17
                                              and ( exists ( select *
                                                             from OrdenPagoItem
                                                                where opg_id = opg.opg_id
                                                                        and opgi_tipo = v_cta_acreedoropg
                                                                        and cue_id = rptarb_hojaid ) ) ) )
                  or ( v_ram_id_Cuenta = 0 ) )
                  and ( ( exists ( select rptarb_hojaid
                                   from rptArbolRamaHoja
                                      where rptarb_cliente = v_clienteID
                                              and tbl_id = 1016
                                              and rptarb_hojaid = doc.cico_id ) )
                  or ( v_ram_id_circuitocontable = 0 ) )
                  and ( ( exists ( select rptarb_hojaid
                                   from rptArbolRamaHoja
                                      where rptarb_cliente = v_clienteID
                                              and tbl_id = 1018
                                              and rptarb_hojaid = doc.emp_id ) )
                  or ( v_ram_id_Empresa = 0 ) ) );

   --//////////////////////////////////////////
   -- Facturas y Notas de Credito
   --//////////////////////////////////////////
   insert into tt_dc_csc_com_0010
     ( prov_id, cue_id, emp_id, suc_id, neto, descuento, subtotal, iva, total, pago, pendiente )
     ( select fc.prov_id,
              ai.cue_id,
              doc.emp_id,
              fc.suc_id,
              case fc.doct_id
                             when 8 then -fc.fc_neto
              else fc.fc_neto
                 end Neto,
              case fc.doct_id
                             when 8 then -coalesce(fc.fc_importedesc1, 0) + coalesce(fc.fc_importedesc2, 0)
              else coalesce(fc.fc_importedesc1, 0) + coalesce(fc.fc_importedesc2, 0)
                 end Descuento,
              case fc.doct_id
                             when 8 then -fc.fc_subtotal
              else fc.fc_subtotal
                 end Sub_Total,
              case fc.doct_id
                             when 8 then -coalesce(fc.fc_ivari, 0) + coalesce(fc.fc_ivarni, 0)
              else coalesce(fc.fc_ivari, 0) + coalesce(fc.fc_ivarni, 0)
                 end Iva,
              case fc.doct_id
                             when 8 then -fc.fc_total
              else fc.fc_total
                 end Total,
              case
                   when fc.fc_totalcomercial = 0
                     and fc.fc_fechavto < CURRENT_TIMESTAMP
                     and fc.fc_fechavto < p_Ffin
                     and fc.doct_id = 8 then -fc.fc_total
                   when fc.fc_totalcomercial = 0
                     and fc.fc_fechavto < CURRENT_TIMESTAMP
                     and fc.fc_fechavto < p_Ffin
                     and fc.doct_id <> 8 then fc.fc_total
              else 0
                 end Pagos,
              case
                   when p_nTipo = 0
                     and fc.doct_id = 8 then -fc.fc_pendiente
                   when p_nTipo = 0 then fc.fc_pendiente
                   when fc.doct_id = 8 then -fc.fc_total - coalesce(( select SUM(fcnc.fcnc_importe)
                                                                 from FacturaCompraNotaCredito fcnc
                                                                        join FacturaCompra fc2
                                                                         on fcnc.fc_id_factura = fc2.fc_id
                                                                        join Documento doc
                                                                         on fc2.doc_id = doc.doc_id
                                                                    where fcnc.fc_id_notacredito = fc.fc_id
                                                                            and fc2.est_id <> 7
                                                                            and ( doc.cico_id = v_cico_id
                                                                            or v_cico_id = 0 )
                                                                            and ( doc.emp_id = v_emp_id
                                                                            or v_emp_id = 0 )
                                                                            and ( ( fc2.fc_fecha <= p_Fini
                                                                            and p_nTipo <> 3 )
                                                                            or ( fc2.fc_fecha <= p_Ffin
                                                                            and p_nTipo = 3 ) ) ), 0)
              else (fc.fc_total - coalesce(( select SUM(fcnc.fcnc_importe)
                                        from FacturaCompraNotaCredito fcnc
                                               join FacturaCompra nc
                                                on fcnc.fc_id_notacredito = nc.fc_id
                                               join Documento doc
                                                on nc.doc_id = doc.doc_id
                                           where fcnc.fc_id_factura = fc.fc_id
                                                   and nc.est_id <> 7
                                                   and ( doc.cico_id = v_cico_id
                                                   or v_cico_id = 0 )
                                                   and ( doc.emp_id = v_emp_id
                                                   or v_emp_id = 0 )
                                                   and ( ( nc.fc_fecha <= p_Fini
                                                   and p_nTipo <> 3 )
                                                   or ( nc.fc_fecha <= p_Ffin
                                                   and p_nTipo = 3 ) ) ), 0) - coalesce(( select SUM(fcopg.fcopg_importe)
                                                                                      from FacturaCompraOrdenPago fcopg
                                                                                             join OrdenPago opg
                                                                                              on fcopg.opg_id = opg.opg_id
                                                                                             join Documento doc
                                                                                              on opg.doc_id = doc.doc_id
                                                                                         where fcopg.fc_id = fc.fc_id
                                                                                                 and opg.est_id <> 7
                                                                                                 and ( doc.cico_id = v_cico_id
                                                                                                 or v_cico_id = 0 )
                                                                                                 and ( opg.emp_id = v_emp_id
                                                                                                 or v_emp_id = 0 )
                                                                                                 and ( ( opg.opg_fecha <= p_Fini
                                                                                                 and p_nTipo <> 3 )
                                                                                                 or ( opg.opg_fecha <= p_Ffin
                                                                                                 and p_nTipo = 3 ) ) ), 0))
                 end Pendiente
       from FacturaCompra fc
              join Documento doc
               on fc.doc_id = doc.doc_id
              left join AsientoItem ai
               on fc.as_id = ai.as_id
              and ai.asi_tipo = v_cta_acreedor
          where ( ( fc.fc_fecha < p_Fini
                  and p_nTipo = 0 )
                  or ( fc.fc_fecha <= p_Fini
                  and p_nTipo in ( 1,2 ) )
                  or ( fc.fc_fecha >= p_Fini
                  and fc.fc_fecha <= p_Ffin
                  and p_nTipo = 3 ) )
                  and fc.est_id <> 7
                  and fc.fc_totalcomercial <> 0
                  and ( exists ( select *
                                      from EmpresaUsuario
                                         where emp_id = doc.emp_id
                                                 and us_id = p_us_id )
                  or ( p_us_id = 1 ) )
/ * -///////////////////////////////////////////////////////////////////////
		
		INICIO SEGUNDA PARTE DE ARBOLES
		
/////////////////////////////////////////////////////////////////////// * /
                  and ( fc.prov_id = v_prov_id
                  or v_prov_id = 0 )
                  and ( fc.suc_id = v_suc_id
                  or v_suc_id = 0 )
                  and ( ai.cue_id = v_cue_id
                  or v_cue_id = 0 )
                  and ( doc.cico_id = v_cico_id
                  or v_cico_id = 0 )
                  and ( doc.emp_id = v_emp_id
                  or v_emp_id = 0 )
                  -- Arboles
                  and ( ( exists ( select rptarb_hojaid
                                   from rptArbolRamaHoja
                                      where rptarb_cliente = v_clienteID
                                              and tbl_id = 29
                                              and rptarb_hojaid = fc.prov_id ) )
                  or ( v_ram_id_Proveedor = 0 ) )
                  and ( ( exists ( select rptarb_hojaid
                                   from rptArbolRamaHoja
                                      where rptarb_cliente = v_clienteID
                                              and tbl_id = 1007
                                              and rptarb_hojaid = fc.suc_id ) )
                  or ( v_ram_id_Sucursal = 0 ) )
                  and ( ( exists ( select rptarb_hojaid
                                   from rptArbolRamaHoja
                                      where rptarb_cliente = v_clienteID
                                              and tbl_id = 17
                                              and rptarb_hojaid = ai.cue_id ) )
                  or ( v_ram_id_Cuenta = 0 ) )
                  and ( ( exists ( select rptarb_hojaid
                                   from rptArbolRamaHoja
                                      where rptarb_cliente = v_clienteID
                                              and tbl_id = 1016
                                              and rptarb_hojaid = doc.cico_id ) )
                  or ( v_ram_id_circuitocontable = 0 ) )
                  and ( ( exists ( select rptarb_hojaid
                                   from rptArbolRamaHoja
                                      where rptarb_cliente = v_clienteID
                                              and tbl_id = 1018
                                              and rptarb_hojaid = doc.emp_id ) )
                  or ( v_ram_id_Empresa = 0 ) ) );

   insert into tt_dc_csc_com_0010
     ( prov_id, cue_id, emp_id, suc_id, neto, descuento, subtotal, iva, total, pago, pendiente )
     ( select fc.prov_id,
              ai.cue_id,
              doc.emp_id,
              fc.suc_id,
              case fc.doct_id
                             when 8 then -fc.fc_neto
              else fc.fc_neto
                 end Neto,
              case fc.doct_id
                             when 8 then -coalesce(fc.fc_importedesc1, 0) + coalesce(fc.fc_importedesc2, 0)
              else coalesce(fc.fc_importedesc1, 0) + coalesce(fc.fc_importedesc2, 0)
                 end Descuento,
              case fc.doct_id
                             when 8 then -fc.fc_subtotal
              else fc.fc_subtotal
                 end Sub_Total,
              case fc.doct_id
                             when 8 then -coalesce(fc.fc_ivari, 0) + coalesce(fc.fc_ivarni, 0)
              else coalesce(fc.fc_ivari, 0) + coalesce(fc.fc_ivarni, 0)
                 end Iva,
              case fc.doct_id
                             when 8 then -fc.fc_total
              else fc.fc_total
                 end Total,
              case
                   when fc.fc_totalcomercial = 0
                     and fc.fc_fechavto < CURRENT_TIMESTAMP
                     and fc.fc_fechavto < p_Ffin
                     and fc.doct_id = 8 then -fc.fc_total
                   when fc.fc_totalcomercial = 0
                     and fc.fc_fechavto < CURRENT_TIMESTAMP
                     and fc.fc_fechavto < p_Ffin
                     and fc.doct_id <> 8 then fc.fc_total
              else 0
                 end Pagos,
              case
                   when fc.fc_totalcomercial = 0
                     and fc.fc_fechavto < CURRENT_TIMESTAMP
                     and fc.fc_fechavto < p_Ffin then 0
                   when fc.fc_totalcomercial = 0
                     and ( fc.fc_fechavto >= CURRENT_TIMESTAMP
                     or fc.fc_fechavto >= p_Ffin )
                     and fc.doct_id = 8 then -fc.fc_total
                   when fc.fc_totalcomercial = 0
                     and ( fc.fc_fechavto >= CURRENT_TIMESTAMP
                     or fc.fc_fechavto >= p_Ffin )
                     and fc.doct_id <> 8 then fc.fc_total   end Pendiente
       from FacturaCompra fc
              join Documento doc
               on fc.doc_id = doc.doc_id
              left join AsientoItem ai
               on fc.as_id = ai.as_id
              and ai.asi_tipo = v_cta_acreedor
          where ( ( fc.fc_fecha < p_Fini
                  and p_nTipo = 0 )
                  or ( fc.fc_fecha <= p_Fini
                  and p_nTipo in ( 1,2 ) )
                  or ( fc.fc_fecha >= p_Fini
                  and fc.fc_fecha <= p_Ffin
                  and p_nTipo = 3 ) )
                  and fc.est_id <> 7
                  and fc.fc_totalcomercial = 0
                  and (CASE
                                 when fc.fc_totalcomercial = 0
                                   and fc.fc_fechavto < CURRENT_TIMESTAMP
                                   and fc.fc_fechavto < p_Ffin then 0
                                 / * aca no importa si es fc o nc, sino que sea <> 0 * /
                                 when fc.fc_totalcomercial = 0
                                   and ( fc.fc_fechavto >= CURRENT_TIMESTAMP
                                   or fc.fc_fechavto >= p_Ffin ) then -fc.fc_total   end) <> 0
                  and ( exists ( select *
                                      from EmpresaUsuario
                                         where emp_id = doc.emp_id
                                                 and us_id = p_us_id )
                  or ( p_us_id = 1 ) )
/ * -///////////////////////////////////////////////////////////////////////
		
		INICIO SEGUNDA PARTE DE ARBOLES
		
/////////////////////////////////////////////////////////////////////// * /
                  and ( fc.prov_id = v_prov_id
                  or v_prov_id = 0 )
                  and ( fc.suc_id = v_suc_id
                  or v_suc_id = 0 )
                  and ( ai.cue_id = v_cue_id
                  or v_cue_id = 0 )
                  and ( doc.cico_id = v_cico_id
                  or v_cico_id = 0 )
                  and ( doc.emp_id = v_emp_id
                  or v_emp_id = 0 )
                  -- Arboles
                  and ( ( exists ( select rptarb_hojaid
                                   from rptArbolRamaHoja
                                      where rptarb_cliente = v_clienteID
                                              and tbl_id = 29
                                              and rptarb_hojaid = fc.prov_id ) )
                  or ( v_ram_id_Proveedor = 0 ) )
                  and ( ( exists ( select rptarb_hojaid
                                   from rptArbolRamaHoja
                                      where rptarb_cliente = v_clienteID
                                              and tbl_id = 1007
                                              and rptarb_hojaid = fc.suc_id ) )
                  or ( v_ram_id_Sucursal = 0 ) )
                  and ( ( exists ( select rptarb_hojaid
                                   from rptArbolRamaHoja
                                      where rptarb_cliente = v_clienteID
                                              and tbl_id = 17
                                              and rptarb_hojaid = ai.cue_id ) )
                  or ( v_ram_id_Cuenta = 0 ) )
                  and ( ( exists ( select rptarb_hojaid
                                   from rptArbolRamaHoja
                                      where rptarb_cliente = v_clienteID
                                              and tbl_id = 1016
                                              and rptarb_hojaid = doc.cico_id ) )
                  or ( v_ram_id_circuitocontable = 0 ) )
                  and ( ( exists ( select rptarb_hojaid
                                   from rptArbolRamaHoja
                                      where rptarb_cliente = v_clienteID
                                              and tbl_id = 1018
                                              and rptarb_hojaid = doc.emp_id ) )
                  or ( v_ram_id_Empresa = 0 ) ) );

   if p_conRemito <> 0 then
   begin
      -- Remitos
      --
      insert into tt_dc_csc_com_0010
        ( prov_id, cue_id, emp_id, suc_id, neto, descuento, subtotal, iva, total, pago, pendiente )
        ( select rc.prov_id,
                 null,
                 doc.emp_id,
                 rc.suc_id,
                 case rc.doct_id
                                when 25 then -rc.rc_neto
                 else rc.rc_neto
                    end Neto,
                 case rc.doct_id
                                when 25 then -coalesce(rc.rc_importedesc1, 0) + coalesce(rc.rc_importedesc2, 0)
                 else coalesce(rc.rc_importedesc1, 0) + coalesce(rc.rc_importedesc2, 0)
                    end Descuento,
                 case rc.doct_id
                                when 25 then -rc.rc_subtotal
                 else rc.rc_subtotal
                    end Sub_Total,
                 case rc.doct_id
                                when 25 then -coalesce(rc.rc_ivari, 0) + coalesce(rc.rc_ivarni, 0)
                 else coalesce(rc.rc_ivari, 0) + coalesce(rc.rc_ivarni, 0)
                    end Iva,
                 case rc.doct_id
                                when 25 then -rc.rc_total
                 else rc.rc_total
                    end Total,
                 0 Pagos,
                 case rc.doct_id
                                when 25 then -rc.rc_pendiente
                 else rc.rc_pendiente
                    end Pendiente
          from RemitoCompra rc
                 join Documento doc
                  on rc.doc_id = doc.doc_id
                 and p_conRemito <> 0
             where ( ( rc.rc_fecha < p_Fini
                     and p_nTipo = 0 )
                     or ( rc.rc_fecha <= p_Fini
                     and p_nTipo in ( 1,2 ) )
                     or ( rc.rc_fecha >= p_Fini
                     and rc.rc_fecha <= p_Ffin
                     and p_nTipo = 3 ) )
                     and rc.est_id <> 7
                     and p_conRemito <> 0
                     and ( exists ( select *
                                         from EmpresaUsuario
                                            where emp_id = doc.emp_id
                                                    and us_id = p_us_id )
                     or ( p_us_id = 1 ) )
/ * -///////////////////////////////////////////////////////////////////////
			
			INICIO SEGUNDA PARTE DE ARBOLES
			
/////////////////////////////////////////////////////////////////////// * /
                     and ( rc.prov_id = v_prov_id
                     or v_prov_id = 0 )
                     and ( rc.suc_id = v_suc_id
                     or v_suc_id = 0 )
                     and ( doc.cico_id = v_cico_id
                     or v_cico_id = 0 )
                     and ( doc.emp_id = v_emp_id
                     or v_emp_id = 0 )
                     -- Arboles
                     and ( ( exists ( select rptarb_hojaid
                                      from rptArbolRamaHoja
                                         where rptarb_cliente = v_clienteID
                                                 and tbl_id = 29
                                                 and rptarb_hojaid = rc.prov_id ) )
                     or ( v_ram_id_Proveedor = 0 ) )
                     and ( ( exists ( select rptarb_hojaid
                                      from rptArbolRamaHoja
                                         where rptarb_cliente = v_clienteID
                                                 and tbl_id = 1007
                                                 and rptarb_hojaid = rc.suc_id ) )
                     or ( v_ram_id_Sucursal = 0 ) )
                     and ( ( exists ( select rptarb_hojaid
                                      from rptArbolRamaHoja
                                         where rptarb_cliente = v_clienteID
                                                 and tbl_id = 1016
                                                 and rptarb_hojaid = doc.cico_id ) )
                     or ( v_ram_id_circuitocontable = 0 ) )
                     and ( ( exists ( select rptarb_hojaid
                                      from rptArbolRamaHoja
                                         where rptarb_cliente = v_clienteID
                                                 and tbl_id = 1018
                                                 and rptarb_hojaid = doc.emp_id ) )
                     or ( v_ram_id_Empresa = 0 ) ) );

   end;
   end if;

   --/////////////////////////////////////////////////////////////////////////
   -- Solo Saldos
   --/////////////////////////////////////////////////////////////////////////
   if p_nTipo <> 0 then
   begin
      if p_nTipo = 1 then
      begin
         open rtn for
            --/////////////////////////////////////
            -- Saldos iniciales
            --/////////////////////////////////////
            select 1 grp_total,
                         p_Fini Fecha,
                         emp.emp_nombre Empresa,
                         prov.prov_nombre || ' -RZ: ' || prov.prov_razonsocial || ' -CUIT: ' || prov.prov_cuit || ' -TE: ' || prov.prov_tel Proveedor,
                         cue.cue_nombre Cuenta,
                         suc.suc_nombre Sucursal,
                         SUM(neto) Neto,
                         SUM(descuento) Descuento,
                         SUM(subtotal) Sub_Total,
                         SUM(iva) Iva,
                         SUM(total) Total,
                         SUM(pago) Pagos,
                         SUM(pendiente) Pendiente,
                         SUM(pendiente) Vto_Pendiente
              from tt_dc_csc_com_0010 fc
                     join Proveedor prov
                      on fc.prov_id = prov.prov_id
                     join Empresa emp
                      on fc.emp_id = emp.emp_id
                     join Sucursal suc
                      on fc.suc_id = suc.suc_id
                     left join Cuenta cue
                      on fc.cue_id = cue.cue_id
              GROUP by fc.prov_id,prov.prov_nombre || ' -RZ: ' || prov.prov_razonsocial || ' -CUIT: ' || prov.prov_cuit || ' -TE: ' || prov.prov_tel,emp.emp_nombre,cue.cue_nombre,suc.suc_nombre

               HAVING ( ABS(SUM(sqlserver_utilities.round_(pendiente, 2))) >= p_saldominimo
              or p_soloDeudores = 0 )
              order by Proveedor,
                       emp.emp_nombre,
                       cue.cue_nombre,
                       suc.suc_nombre;

      end;
      else
      begin
         open rtn for
            --/////////////////////////////////////
            -- Saldos iniciales
            --/////////////////////////////////////
            select 1 grp_total,
                         p_Fini Fecha,
                         prov.prov_nombre || ' -RZ: ' || prov.prov_razonsocial || ' -CUIT: ' || prov.prov_cuit || ' -TE: ' || prov.prov_tel Proveedor,
                         SUM(neto) Neto,
                         SUM(descuento) Descuento,
                         SUM(subtotal) Sub_Total,
                         SUM(iva) Iva,
                         SUM(total) Total,
                         SUM(pago) Pagos,
                         SUM(pendiente) Pendiente,
                         SUM(pendiente) Vto_Pendiente
              from tt_dc_csc_com_0010 fc
                     join Proveedor prov
                      on fc.prov_id = prov.prov_id
              GROUP by fc.prov_id,prov.prov_nombre || ' -RZ: ' || prov.prov_razonsocial || ' -CUIT: ' || prov.prov_cuit || ' -TE: ' || prov.prov_tel

               HAVING ( ABS(SUM(sqlserver_utilities.round_(pendiente, 2))) >= p_saldominimo
              or p_soloDeudores = 0 )
              order by Proveedor;

      end;
      end if;

   end;
   --/////////////////////////////////////////////////////////////////////////
   -- Saldo y Periodo
   --/////////////////////////////////////////////////////////////////////////
   else
   begin
      open rtn for
         --/////////////////////////////////////////////////////////////////////////
         --
         --	Facturas, Notas de Credio/Debito y Ordenes de Pago en el Periodo
         --
         --/////////////////////////////////////////////////////////////////////////
         
         --/////////////////////////////////////
         -- Saldos iniciales
         --/////////////////////////////////////
         select 1 grp_total,
                      0 doct_id,
                      0 comp_id,
                      0 nOrden_id,
                      'Saldo Inicial' Documento,
                      p_Fini Fecha,
                      0 Numero,
                      'Saldo inicial' Comprobante,
                      prov_nombre || ' -RZ: ' || prov_razonsocial || ' -CUIT: ' || prov_cuit || ' -TE: ' || prov_tel Proveedor,
                      SUM(neto) Neto,
                      SUM(descuento) Descuento,
                      SUM(subtotal) Sub_Total,
                      SUM(iva) Iva,
                      SUM(total) Total,
                      SUM(pago) Pagos,
                      SUM(pendiente) Pendiente,
                      '' Moneda,
                      '' Estado,
                      cue_nombre Cuenta,
                      '' Documento,
                      emp_nombre Empresa,
                      suc_nombre Sucursal,
                      '' Cond_Pago,
                      '' Legajo,
                      '' Centro_de_Costo,
                      null Vto,
                      0 Vto_Importe,
                      SUM(pendiente) Vto_Pendiente,
                      null Observaciones
           from tt_dc_csc_com_0010 fc
                  join Proveedor prov
                   on fc.prov_id = prov.prov_id
                  join Empresa emp
                   on fc.emp_id = emp.emp_id
                  join Sucursal suc
                   on fc.suc_id = suc.suc_id
                  left join Cuenta cue
                   on fc.cue_id = cue.cue_id
           GROUP by fc.prov_id,prov_nombre || ' -RZ: ' || prov_razonsocial || ' -CUIT: ' || prov_cuit || ' -TE: ' || prov_tel,cue_nombre,suc_nombre,emp_nombre

            HAVING ( ABS(SUM(sqlserver_utilities.round_(pendiente, 2))) >= p_saldominimo
           or p_soloDeudores = 0 )
         union all
         --/////////////////////////////////////
         --	Facturas, Notas de Credio/Debito
         --/////////////////////////////////////
         select 1 grp_total,
                      fc.doct_id doct_id,
                      fc.fc_id comp_id,
                      1 nOrden_id,
                      doc_nombre Documento,
                      fc_fecha Fecha,
                      fc_numero Numero,
                      fc_nrodoc Comprobante,
                      prov_nombre || ' -RZ: ' || prov_razonsocial || ' -CUIT: ' || prov_cuit || ' -TE: ' || prov_tel Proveedor,
                      case fc.doct_id
                                     when 8 then -fc_neto
                      else fc_neto
                         end Neto,
                      case fc.doct_id
                                     when 8 then -fc_importedesc1 + fc_importedesc2
                      else fc_importedesc1 + fc_importedesc2
                         end Descuento,
                      case fc.doct_id
                                     when 8 then -fc_subtotal
                      else fc_subtotal
                         end Sub_Total,
                      case fc.doct_id
                                     when 8 then -fc_ivari + fc_ivarni
                      else fc_ivari + fc_ivarni
                         end Iva,
                      case fc.doct_id
                                     when 8 then -fc_total
                      else fc_total
                         end Total,
                      case
                           when fc_totalcomercial = 0
                             and fc_fechavto < CURRENT_TIMESTAMP
                             and fc_fechavto < p_Ffin
                             and fc.doct_id = 8 then -fc_total
                           when fc_totalcomercial = 0
                             and fc_fechavto < CURRENT_TIMESTAMP
                             and fc_fechavto < p_Ffin
                             and fc.doct_id <> 8 then fc_total
                      else 0
                         end Pagos,
                      case fc.doct_id
                                     when 8 then -fc_pendiente
                      else fc_pendiente
                         end Pendiente,
                      mon_nombre Moneda,
                      est_nombre Estado,
                      cue_nombre Cuenta,
                      doc_nombre Documento,
                      emp_nombre Empresa,
                      suc_nombre Sucursal,
                      cpg_nombre Cond_Pago,
                      case
                           when lgj_titulo <> '' then lgj_titulo
                      else lgj_codigo
                         end Legajo,
                      ccos_nombre Centro_de_Costo,
                      case
                           when fcd_fecha is not null then fcd_fecha
                      else fcp_fecha
                         end Vto,
                      case fc.doct_id
                                     when 8 then -coalesce(fcd_importe, fcp_importe)
                      else coalesce(fcd_importe, fcp_importe)
                         end Vto_Importe,
                      case
                           when fc_totalcomercial = 0
                             and fc_fechavto < CURRENT_TIMESTAMP
                             and fc_fechavto < p_Ffin then 0
                           when fc_totalcomercial = 0
                             and ( fc_fechavto >= CURRENT_TIMESTAMP
                             or fc_fechavto >= p_Ffin )
                             and fc.doct_id = 8 then -fc_total
                           when fc_totalcomercial = 0
                             and ( fc_fechavto >= CURRENT_TIMESTAMP
                             or fc_fechavto >= p_Ffin )
                             and fc.doct_id <> 8 then fc_total
                           when fc.doct_id = 8 then -coalesce(fcd_pendiente, 0)
                      else coalesce(fcd_pendiente, 0)
                         end Vto_Pendiente,
                      fc_descrip Observaciones
           from FacturaCompra fc
                  join Proveedor prov
                   on fc.prov_id = prov.prov_id
                  left join FacturaCompraDeuda fcd
                   on fc.fc_id = fcd.fc_id
                  left join FacturaCompraPago fcp
                   on fc.fc_id = fcp.fc_id
                  left join AsientoItem ai
                   on fc.as_id = ai.as_id
                  and asi_tipo = v_cta_acreedor
                  left join Cuenta cue
                   on ai.cue_id = cue.cue_id
                  join Moneda mon
                   on fc.mon_id = mon.mon_id
                  join Estado est
                   on fc.est_id = est.est_id
                  join Documento doc
                   on fc.doc_id = doc.doc_id
                  join Empresa emp
                   on doc.emp_id = emp.emp_id
                  join Sucursal suc
                   on fc.suc_id = suc.suc_id
                  left join Legajo lgj
                   on fc.lgj_id = lgj.lgj_id
                  join CondicionPago cpg
                   on fc.cpg_id = cpg.cpg_id
                  left join CentroCosto ccos
                   on fc.ccos_id = ccos.ccos_id
            where fc_fecha >= p_Fini
                    and fc_fecha <= p_Ffin
                    and fc.est_id <> 7
                    and ( ABS(sqlserver_utilities.round_(fc_pendiente, 2)) >= p_saldominimo
                    or p_soloDeudores = 0 )
                    and ( exists ( select *
                                         from EmpresaUsuario
                                            where emp_id = doc.emp_id
                                                    and us_id = p_us_id )
                    or ( p_us_id = 1 ) )
/ * -///////////////////////////////////////////////////////////////////////
		
		INICIO SEGUNDA PARTE DE ARBOLES
		
/////////////////////////////////////////////////////////////////////// * /
                    and ( fc.prov_id = v_prov_id
                    or v_prov_id = 0 )
                    and ( fc.suc_id = v_suc_id
                    or v_suc_id = 0 )
                    and ( ai.cue_id = v_cue_id
                    or v_cue_id = 0 )
                    and ( doc.cico_id = v_cico_id
                    or v_cico_id = 0 )
                    and ( doc.emp_id = v_emp_id
                    or v_emp_id = 0 )
                    -- Arboles
                    and ( ( exists ( select rptarb_hojaid
                                     from rptArbolRamaHoja
                                        where rptarb_cliente = v_clienteID
                                                and tbl_id = 29
                                                and rptarb_hojaid = fc.prov_id ) )
                    or ( v_ram_id_Proveedor = 0 ) )
                    and ( ( exists ( select rptarb_hojaid
                                     from rptArbolRamaHoja
                                        where rptarb_cliente = v_clienteID
                                                and tbl_id = 1007
                                                and rptarb_hojaid = fc.suc_id ) )
                    or ( v_ram_id_Sucursal = 0 ) )
                    and ( ( exists ( select rptarb_hojaid
                                     from rptArbolRamaHoja
                                        where rptarb_cliente = v_clienteID
                                                and tbl_id = 17
                                                and rptarb_hojaid = ai.cue_id ) )
                    or ( v_ram_id_Cuenta = 0 ) )
                    and ( ( exists ( select rptarb_hojaid
                                     from rptArbolRamaHoja
                                        where rptarb_cliente = v_clienteID
                                                and tbl_id = 1016
                                                and rptarb_hojaid = doc.cico_id ) )
                    or ( v_ram_id_circuitocontable = 0 ) )
                    and ( ( exists ( select rptarb_hojaid
                                     from rptArbolRamaHoja
                                        where rptarb_cliente = v_clienteID
                                                and tbl_id = 1018
                                                and rptarb_hojaid = doc.emp_id ) )
                    or ( v_ram_id_Empresa = 0 ) )
         union all
         --/////////////////////////////////////
         --	Remitos, Notas de Credio/Debito
         --/////////////////////////////////////
         select 1 grp_total,
                            rc.doct_id doct_id,
                            rc.rc_id comp_id,
                            1 nOrden_id,
                            doc_nombre Documento,
                            rc_fecha Fecha,
                            rc_numero Numero,
                            rc_nrodoc Comprobante,
                            prov_nombre || ' -RZ: ' || prov_razonsocial || ' -CUIT: ' || prov_cuit || ' -TE: ' || prov_tel Proveedor,
                            case rc.doct_id
                                           when 25 then -rc_neto
                            else rc_neto
                               end Neto,
                            case rc.doct_id
                                           when 25 then -rc_importedesc1 + rc_importedesc2
                            else rc_importedesc1 + rc_importedesc2
                               end Descuento,
                            case rc.doct_id
                                           when 25 then -rc_subtotal
                            else rc_subtotal
                               end Sub_Total,
                            case rc.doct_id
                                           when 25 then -rc_ivari + rc_ivarni
                            else rc_ivari + rc_ivarni
                               end Iva,
                            case rc.doct_id
                                           when 25 then -rc_total
                            else rc_total
                               end Total,
                            0 Pagos,
                            case rc.doct_id
                                           when 25 then -rc_pendiente
                            else rc_pendiente
                               end Pendiente,
                            mon_nombre Moneda,
                            est_nombre Estado,
                            '' Cuenta,
                            doc_nombre Documento,
                            emp_nombre Empresa,
                            suc_nombre Sucursal,
                            cpg_nombre Cond_Pago,
                            case
                                 when lgj_titulo <> '' then lgj_titulo
                            else lgj_codigo
                               end Legajo,
                            ccos_nombre Centro_de_Costo,
                            rc_fecha Vto,
                            case rc.doct_id
                                           when 25 then -rc_pendiente
                            else rc_pendiente
                               end Vto_Importe,
                            case rc.doct_id
                                           when 25 then -rc_pendiente
                            else rc_pendiente
                               end Vto_Pendiente,
                            rc_descrip Observaciones
           from RemitoCompra rc
                  join Proveedor prov
                   on rc.prov_id = prov.prov_id
                  and p_conRemito <> 0
                  left join Documento doc
                   on rc.doc_id = doc.doc_id
                  left join Moneda mon
                   on doc.mon_id = mon.mon_id
                  left join Estado est
                   on rc.est_id = est.est_id
                  left join Empresa emp
                   on doc.emp_id = emp.emp_id
                  left join Sucursal suc
                   on rc.suc_id = suc.suc_id
                  left join Legajo lgj
                   on rc.lgj_id = lgj.lgj_id
                  left join CondicionPago cpg
                   on rc.cpg_id = cpg.cpg_id
                  left join CentroCosto ccos
                   on rc.ccos_id = ccos.ccos_id
            where rc_fecha >= p_Fini
                    and rc_fecha <= p_Ffin
                    and rc.est_id <> 7
                    and p_conRemito <> 0
                    and ( ABS(sqlserver_utilities.round_(rc_pendiente, 2)) >= p_saldominimo
                    or p_soloDeudores = 0 )
                    and ( exists ( select *
                                         from EmpresaUsuario
                                            where emp_id = doc.emp_id
                                                    and us_id = p_us_id )
                    or ( p_us_id = 1 ) )
/ * -///////////////////////////////////////////////////////////////////////
		
		INICIO SEGUNDA PARTE DE ARBOLES
		
/////////////////////////////////////////////////////////////////////// * /
                    and ( rc.prov_id = v_prov_id
                    or v_prov_id = 0 )
                    and ( rc.suc_id = v_suc_id
                    or v_suc_id = 0 )
                    and ( doc.cico_id = v_cico_id
                    or v_cico_id = 0 )
                    and ( doc.emp_id = v_emp_id
                    or v_emp_id = 0 )
                    -- Arboles
                    and ( ( exists ( select rptarb_hojaid
                                     from rptArbolRamaHoja
                                        where rptarb_cliente = v_clienteID
                                                and tbl_id = 29
                                                and rptarb_hojaid = rc.prov_id ) )
                    or ( v_ram_id_Proveedor = 0 ) )
                    and ( ( exists ( select rptarb_hojaid
                                     from rptArbolRamaHoja
                                        where rptarb_cliente = v_clienteID
                                                and tbl_id = 1007
                                                and rptarb_hojaid = rc.suc_id ) )
                    or ( v_ram_id_Sucursal = 0 ) )
                    and ( ( exists ( select rptarb_hojaid
                                     from rptArbolRamaHoja
                                        where rptarb_cliente = v_clienteID
                                                and tbl_id = 1016
                                                and rptarb_hojaid = doc.cico_id ) )
                    or ( v_ram_id_circuitocontable = 0 ) )
                    and ( ( exists ( select rptarb_hojaid
                                     from rptArbolRamaHoja
                                        where rptarb_cliente = v_clienteID
                                                and tbl_id = 1018
                                                and rptarb_hojaid = doc.emp_id ) )
                    or ( v_ram_id_Empresa = 0 ) )
         --/////////////////////////////////////
         --	Ordenes de Pago
         --/////////////////////////////////////
         union all
         select 1 grp_total,
                opg.doct_id doct_id,
                opg.opg_id comp_id,
                1 nOrden_id,
                doc_nombre Documento,
                opg_fecha Fecha,
                opg_numero Numero,
                opg_nrodoc Comprobante,
                prov_nombre || ' -RZ: ' || prov_razonsocial || ' -CUIT: ' || prov_cuit || ' -TE: ' || prov_tel Proveedor,
                0 Neto,
                0 Descuento,
                0 Sub_Total,
                0 Iva,
                0 Total,
                opg_total Pagos,
                -opg_pendiente Pendiente,
                '' Moneda,
                est_nombre Estado,
                ( select min(cue_nombre)
                  from OrdenPagoItem opgi
                         join Cuenta cue
                          on opgi.cue_id = cue.cue_id
                     where opg_id = opg.opg_id
                             and opgi_tipo = 5 ) Cuenta,
                doc_nombre Documento,
                emp_nombre Empresa,
                suc_nombre Sucursal,
                '' Cond_Pago,
                case
                     when lgj_titulo <> '' then lgj_titulo
                else lgj_codigo
                   end Legajo,
                ccos_nombre Centro_de_Costo,
                opg_fecha Vto,
                0 Vto,
                -opg_pendiente Vto_Pendiente,
                opg_descrip Observaciones
           from OrdenPago opg
                  join Proveedor prov
                   on opg.prov_id = prov.prov_id
                  join Estado est
                   on opg.est_id = est.est_id
                  join Documento doc
                   on opg.doc_id = doc.doc_id
                  join Empresa emp
                   on doc.emp_id = emp.emp_id
                  join Sucursal suc
                   on opg.suc_id = suc.suc_id
                  left join Legajo lgj
                   on opg.lgj_id = lgj.lgj_id
                  left join CentroCosto ccos
                   on opg.ccos_id = ccos.ccos_id
            where opg_fecha >= p_Fini
                    and opg_fecha <= p_Ffin
                    and opg.est_id <> 7
                    and ( ABS(sqlserver_utilities.round_(opg_pendiente, 2)) >= p_saldominimo
                    or p_soloDeudores = 0 )
                    and ( exists ( select *
                                         from EmpresaUsuario
                                            where emp_id = doc.emp_id
                                                    and us_id = p_us_id )
                    or ( p_us_id = 1 ) )
/ * -///////////////////////////////////////////////////////////////////////
		
		INICIO SEGUNDA PARTE DE ARBOLES
		
/////////////////////////////////////////////////////////////////////// * /
                    and ( opg.prov_id = v_prov_id
                    or v_prov_id = 0 )
                    and ( opg.suc_id = v_suc_id
                    or v_suc_id = 0 )
                    and ( exists ( select *
                                   from OrdenPagoItem
                                      where opg_id = opg.opg_id
                                              and opgi_tipo = v_cta_acreedoropg
                                              and cue_id = v_cue_id )
                    or v_cue_id = 0 )
                    and ( doc.cico_id = v_cico_id
                    or v_cico_id = 0 )
                    and ( doc.emp_id = v_emp_id
                    or v_emp_id = 0 )
                    -- Arboles
                    and ( ( exists ( select rptarb_hojaid
                                     from rptArbolRamaHoja
                                        where rptarb_cliente = v_clienteID
                                                and tbl_id = 29
                                                and rptarb_hojaid = opg.prov_id ) )
                    or ( v_ram_id_Proveedor = 0 ) )
                    and ( ( exists ( select rptarb_hojaid
                                     from rptArbolRamaHoja
                                        where rptarb_cliente = v_clienteID
                                                and tbl_id = 1007
                                                and rptarb_hojaid = opg.suc_id ) )
                    or ( v_ram_id_Sucursal = 0 ) )
                    and ( ( exists ( select rptarb_hojaid
                                     from rptArbolRamaHoja
                                        where rptarb_cliente = v_clienteID
                                                and tbl_id = 17
                                                and ( exists ( select *
                                                               from OrdenPagoItem
                                                                  where opg_id = opg.opg_id
                                                                          and opgi_tipo = v_cta_acreedoropg
                                                                          and cue_id = rptarb_hojaid ) ) ) )
                    or ( v_ram_id_Cuenta = 0 ) )
                    and ( ( exists ( select rptarb_hojaid
                                     from rptArbolRamaHoja
                                        where rptarb_cliente = v_clienteID
                                                and tbl_id = 1016
                                                and rptarb_hojaid = doc.cico_id ) )
                    or ( v_ram_id_circuitocontable = 0 ) )
                    and ( ( exists ( select rptarb_hojaid
                                     from rptArbolRamaHoja
                                        where rptarb_cliente = v_clienteID
                                                and tbl_id = 1018
                                                and rptarb_hojaid = doc.emp_id ) )
                    or ( v_ram_id_Empresa = 0 ) )
           order by Proveedor,
                    Cuenta,
                    Fecha,
                    nOrden_id;

   end;
   end if;
*/

end;
$BODY$
  language plpgsql volatile
  cost 100;
alter function dc_csc_com_0010(integer, date, date, character varying, character varying, character varying, character varying, smallint, character varying, smallint, smallint, smallint)
  owner to postgres;
