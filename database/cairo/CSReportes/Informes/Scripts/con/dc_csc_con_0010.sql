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
-- Function: dc_csc_con_0010()

-- drop function dc_csc_con_0010();

create or replace function dc_csc_con_0010
(
  in p_us_id integer,
  in p_Fini date,
  in p_Ffin date,

  in p_cico_id varchar,
  in p_emp_id varchar,
  out rtn refcursor
)
  returns refcursor as
$BODY$
declare
   v_cico_id integer;
   v_emp_id integer;
   v_ram_id_CircuitoContable integer;
   v_ram_id_Empresa integer;
   v_clienteID integer;
   v_IsRaiz smallint;

   v_no_date date := to_date('19900101','yyyymmdd');
begin

   drop table if exists tt_t_DC_CSC_CON_0010;
   create global temporary table tt_t_DC_CSC_CON_0010
   (
     col_dummy integer
   );

   select * from sp_ArbConvertId(p_cico_id) into v_cico_id, v_ram_id_CircuitoContable;
   select * from sp_ArbConvertId(p_emp_id) into v_emp_id, v_ram_id_Empresa;

   select * from  sp_GetRptId() into v_clienteID;

   if v_ram_id_CircuitoContable <> 0 then
      --	exec sp_ArbGetGroups @ram_id_CircuitoContable, @clienteID, @@us_id
      select sp_ArbIsRaiz(v_ram_id_CircuitoContable) into v_IsRaiz;
      if v_IsRaiz = 0 then
         perform sp_ArbGetAllHojas(v_ram_id_CircuitoContable, v_clienteID);
      else
         v_ram_id_CircuitoContable := 0;
      end if;
   end if;

   if v_ram_id_Empresa <> 0 then
      --	exec sp_ArbGetGroups @ram_id_Empresa, @clienteID, @@us_id
      select sp_ArbIsRaiz(v_ram_id_Empresa) into v_IsRaiz;
      if v_IsRaiz = 0 then
         perform sp_ArbGetAllHojas(v_ram_id_Empresa, v_clienteID);
      else
         v_ram_id_Empresa := 0;
      end if;
   end if;

   /*
     -- Manejo de compras sin IVA
     --
     -- Para que el sistema resuma las compras
     -- con iva no gravado en una tasa impositiva
     -- se debe crear una tasa impositiva con porcentaje 0
     -- puede llamarce por ejemplo IVA Compras No Gravado
     --
     -- Esta tasa debe ser la primera tasa creada con porcentaje 0
     -- ya que el sistema la obtiene por min(ti_id) where ti_porcentaje = 0
     --
     -- Si quieren separa el iva exento (el de proveedores que no cobran iva)
     -- del iva no gravado deben crear otra tasa con porcentaje 0 y llamarla
     -- por ejemplo IVA Compras Exento
     declare @ti_id_iva_exento int
     create table #t_producto_tasa (pr_id int, ti_id int, ti_porcentaje decimal(18,6))
     insert into #t_producto_tasa
     select pr_id, ti_id_ivaricompra, ti_porcentaje
     from Producto inner join TasaImpositiva on ti_id_ivaricompra = ti_id
     select @ti_id_iva_exento = min (ti_id) from TasaImpositiva where ti_porcentaje = 0 and ti_tipo = 2 and ti_id > 0
     -- Fin manejo compras sin IVA
   */

   --------------------------------------------------------------------------------------------------
   -- TRATAMIENTO DE PERIODOS SIN MOVIMIENTOS
   --------------------------------------------------------------------------------------------------
   if not exists ( select fc.fc_id
                   from FacturaCompra fc
                   join Documento d
                     on fc.doc_id = d.doc_id
                   where fc.fc_fechaiva >= p_Fini
                     and fc.fc_fechaiva <= p_Ffin
                     and ( exists ( select *
                                    from EmpresaUsuario
                                    where emp_id = d.emp_id
                                      and us_id = p_us_id )
                              or ( p_us_id = 1 ) )

                     and ( d.cico_id = v_cico_id or v_cico_id = 0 )
                     and ( d.emp_id = v_emp_id or v_emp_id = 0 )
                     and ( ( exists ( select rptarb_hojaid
                                      from rptArbolRamaHoja
                                      where rptarb_cliente = v_clienteID
                                        and tbl_id = 1016
                                        and rptarb_hojaid = d.cico_id ) )
                              or ( v_ram_id_CircuitoContable = 0 ) )
                              and ( ( exists ( select rptarb_hojaid
                                               from rptArbolRamaHoja
                                               where rptarb_cliente = v_clienteID
                                                 and tbl_id = 1018
                                                 and rptarb_hojaid = d.emp_id ) )
                              or ( v_ram_id_Empresa = 0 ) ) ) then

      insert into tt_t_DC_CSC_CON_0010( col_dummy ) values ( 1 );

   end if;

   rtn := 'rtn';

   open rtn for
      select 0 comp_id,
             p_Fini Fecha,
             p_Fini Fecha_IVA,
             '' Documento,
             '' Empresa,
             '' Comprobante,
             'Mes sin movimientos' Proveedor,
             '' CUIT,
             '' Condicion_IVA,
             '' Condicion_IVA2,
             0 Neto,
             0 Base,
             0 Base_Iva,
             0 Tasa_Iva,
             0 Importe_Iva,
             0 Importe_interno,
             '' Concepto,
             0 Importe_concepto,
             0 Total,
             0 Orden,
             1 Orden2
      from tt_t_DC_CSC_CON_0010

      union ALL

      --------------------------------------------------------------------------------------------------
      -- FACTURAS DEL PERIODO
      --------------------------------------------------------------------------------------------------
      select fc.fc_id comp_id,
             fc_fecha Fecha,
             fc_fechaiva Fecha_IVA,
             case d.doct_id
                when 2 then 'FAC'
                when 8 then 'NC'
                when 10 then 'ND'
             end Documento,
             emp_nombre Empresa,
             fc_nrodoc Comprobante,
             prov_razonsocial Proveedor,
             prov_cuit CUIT,
             case prov_catfiscal
                when 1 then 'Inscripto'
                when 2 then 'Exento'
                when 3 then 'No inscripto'
                when 4 then 'Consumidor Final'
                when 5 then 'Extranjero'
                when 6 then 'Mono Tributo'
                when 7 then 'Extranjero Iva'
                when 8 then 'No responsable'
                when 9 then 'No Responsable exento'
                when 10 then 'No categorizado'
                when 11 then 'Inscripto M'
                else 'Sin categorizar'
             end Condicion_IVA,
             case prov_catfiscal
                when 1 then 'in'
                when 2 then 'EX'
                when 3 then 'NI'
                when 4 then 'CF'
                when 5 then 'EJ'
                when 6 then 'M'
                when 7 then 'EJI'
                when 8 then 'NR'
                when 9 then 'NRE'
                when 10 then 'NC'
                when 11 then 'IM'
                else 'SC'
             end Condicion_IVA2,
             case d.doct_id
                when 8 then -fc_neto
                else fc_neto
             end Neto,
             case sum(fci_ivari)
                when 0 then 0
                else
                   case d.doct_id
                      when 8 then -sum(fci_neto - (fci_neto * fc_descuento1 / 100) - ((fci_neto - (fci_neto * fc_descuento1 / 100)) * fc_descuento2 / 100))
                      else sum(fci_neto - (fci_neto * fc_descuento1 / 100) - ((fci_neto - (fci_neto * fc_descuento1 / 100)) * fc_descuento2 / 100))
                   end
             end Base,
             case sum(fci_ivari)
                when 0 then 0
                else
                   case d.doct_id
                      when 8 then -sum(fci_neto - (fci_neto * fc_descuento1 / 100) - ((fci_neto - (fci_neto * fc_descuento1 / 100)) * fc_descuento2 / 100))
                      else sum(fci_neto - (fci_neto * fc_descuento1 / 100) - ((fci_neto - (fci_neto * fc_descuento1 / 100)) * fc_descuento2 / 100))
                   end
             end Base_Iva,
             fci_ivariporc Tasa_Iva,
             case sum(fci_ivari)
                when 0 then 0
                else
                   case d.doct_id
                      when 8 then -sum(fci_ivari - (fci_ivari * fc_descuento1 / 100) - ((fci_ivari - (fci_ivari * fc_descuento1 / 100)) * fc_descuento2 / 100))
                      else sum(fci_ivari - (fci_ivari * fc_descuento1 / 100) - ((fci_ivari - (fci_ivari * fc_descuento1 / 100)) * fc_descuento2 / 100))
                   end
             end Importe_Iva,
             0 Importe_interno,
             '' Concepto,
             case sum(fci_ivari)
                when 0 then
                   case d.doct_id
                      when 8 then -sum(fci_neto - (fci_neto * fc_descuento1 / 100) - ((fci_neto - (fci_neto * fc_descuento1 / 100)) * fc_descuento2 / 100))
                      else sum(fci_neto - (fci_neto * fc_descuento1 / 100) - ((fci_neto - (fci_neto * fc_descuento1 / 100)) * fc_descuento2 / 100))
                   end
                else 0
             end Importe_concepto,
             case d.doct_id
                when 8 then -fc_total
                else fc_total
             end Total,
             0 Orden,
             1 Orden2
      from FacturaCompra fc
      join Documento d
        on fc.doc_id = d.doc_id
      join Empresa
        on d.emp_id = Empresa.emp_id
      join Proveedor p
        on fc.prov_id = p.prov_id
      join FacturaCompraItem fci
        on fc.fc_id = fci.fc_id
      where fc_fechaiva >= p_Fini
        and fc_fechaiva <= p_Ffin
        and fc.est_id <> 7-- Anuladas
        and ( exists ( select *
                       from EmpresaUsuario
                       where emp_id = d.emp_id
                         and us_id = p_us_id )
              or ( p_us_id = 1 ) )
        and ( d.cico_id = v_cico_id or v_cico_id = 0 )
        and ( Empresa.emp_id = v_emp_id or v_emp_id = 0 )

        and ( ( exists ( select rptarb_hojaid
                         from rptArbolRamaHoja
                         where rptarb_cliente = v_clienteID
                           and tbl_id = 1016
                           and rptarb_hojaid = d.cico_id ) )
                 or ( v_ram_id_CircuitoContable = 0 ) )

        and ( ( exists ( select rptarb_hojaid
                         from rptArbolRamaHoja
                         where rptarb_cliente = v_clienteID
                           and tbl_id = 1018
                           and rptarb_hojaid = d.emp_id ) )
                 or ( v_ram_id_Empresa = 0 ) )
        group by fc.fc_id,fc_fecha,fc_fechaiva,doc_codigo,d.doct_id,emp_nombre,fc_nrodoc,prov_razonsocial,
                 prov_cuit,prov_catfiscal,fci_ivariporc,fc_neto,fc_total

      union ALL

      --------------------------------------------------------------------------------------------------
      -- PERCEPCIONES
      --------------------------------------------------------------------------------------------------
      select fc.fc_id comp_id,
             fc_fecha Fecha,
             fc_fechaiva Fecha_IVA,
             case d.doct_id
                when 2 then 'FAC'
                when 8 then 'NC'
                when 10 then 'ND'
             end Documento,
             emp_nombre Empresa,
             fc_nrodoc Comprobante,
             prov_razonsocial Proveedor,
             prov_cuit CUIT,
             case prov_catfiscal
                when 1 then 'Inscripto'
                when 2 then 'Exento'
                when 3 then 'No inscripto'
                when 4 then 'Consumidor Final'
                when 5 then 'Extranjero'
                when 6 then 'Mono Tributo'
                when 7 then 'Extranjero Iva'
                when 8 then 'No responsable'
                when 9 then 'No Responsable exento'
                when 10 then 'No categorizado'
                when 11 then 'Inscripto M'
                else 'Sin categorizar'
             end Condicion_IVA,
             case prov_catfiscal
                when 1 then 'in'
                when 2 then 'EX'
                when 3 then 'NI'
                when 4 then 'CF'
                when 5 then 'EJ'
                when 6 then 'M'
                when 7 then 'EJI'
                when 8 then 'NR'
                when 9 then 'NRE'
                when 10 then 'NC'
                when 11 then 'IM'
                else 'SC'
             end Condicion_IVA2,
             0 Neto,
             case d.doct_id
                when 8 then -fcperc_base
                else fcperc_base
             end Base,
             0 Base_Iva,
             fcperc_porcentaje Tasa_Iva,
             0 Importe_Iva,
             case d.doct_id
                when 8 then -fcperc_importe
                else fcperc_importe
             end Importe_interno,
             perc_nombre Concepto,
             0 Importe_concepto,
             0 Total,
             0 Orden,
             2 Orden2
      from FacturaCompra fc
      join Documento d
        on fc.doc_id = d.doc_id
      join Empresa
        on d.emp_id = Empresa.emp_id
      join Proveedor p
        on fc.prov_id = p.prov_id
      join FacturaCompraPercepcion fcp
        on fc.fc_id = fcp.fc_id
      join Percepcion perc
        on fcp.perc_id = perc.perc_id
      where fc_fechaiva >= p_Fini
        and fc_fechaiva <= p_Ffin
        and fc.est_id <> 7-- Anuladas
        and ( exists ( select *
                       from EmpresaUsuario
                       where emp_id = d.emp_id
                         and us_id = p_us_id )
              or ( p_us_id = 1 ) )
        and ( d.cico_id = v_cico_id or v_cico_id = 0 )
        and ( Empresa.emp_id = v_emp_id or v_emp_id = 0 )
        and ( ( exists ( select rptarb_hojaid
                         from rptArbolRamaHoja
                         where rptarb_cliente = v_clienteID
                           and tbl_id = 1016
                           and rptarb_hojaid = d.cico_id ) )
                or ( v_ram_id_CircuitoContable = 0 ) )
        and ( ( exists ( select rptarb_hojaid
                         from rptArbolRamaHoja
                         where rptarb_cliente = v_clienteID
                           and tbl_id = 1018
                           and rptarb_hojaid = d.emp_id ) )
                or ( v_ram_id_Empresa = 0 ) )

      union ALL

      --------------------------------------------------------------------------------------------------
      -- OTROS
      --------------------------------------------------------------------------------------------------
      select fc.fc_id comp_id,
             fc_fecha Fecha,
             fc_fechaiva Fecha_IVA,
             case d.doct_id
                when 2 then 'FAC'
                when 8 then 'NC'
                when 10 then 'ND'
             end Documento,
             emp_nombre Empresa,
             fc_nrodoc Comprobante,
             prov_razonsocial Proveedor,
             prov_cuit CUIT,
             case prov_catfiscal
                when 1 then 'Inscripto'
                when 2 then 'Exento'
                when 3 then 'No inscripto'
                when 4 then 'Consumidor Final'
                when 5 then 'Extranjero'
                when 6 then 'Mono Tributo'
                when 7 then 'Extranjero Iva'
                when 8 then 'No responsable'
                when 9 then 'No Responsable exento'
                when 10 then 'No categorizado'
                when 11 then 'Inscripto M'
                else 'Sin categorizar'
             end Condicion_IVA,
             case prov_catfiscal
                when 1 then 'in'
                when 2 then 'EX'
                when 3 then 'NI'
                when 4 then 'CF'
                when 5 then 'EJ'
                when 6 then 'M'
                when 7 then 'EJI'
                when 8 then 'NR'
                when 9 then 'NRE'
                when 10 then 'NC'
                when 11 then 'IM'
                else 'SC'
             end Condicion_IVA2,
             0 Neto,
             0 Base,
             0 Base_Iva,
             0 Tasa_Iva,
             0 Importe_Iva,
             0 Importe_interno,
             cue_nombre Concepto,
             case d.doct_id
                when 8 then -fcot_debe + fcot_haber
                else +fcot_debe - fcot_haber
             end Importe_concepto,
             0 Total,
             0 Orden,
             2 Orden2
      from FacturaCompra fc
      join Documento d
        on fc.doc_id = d.doc_id
      join Empresa
        on d.emp_id = Empresa.emp_id
      join Proveedor p
        on fc.prov_id = p.prov_id
      join FacturaCompraOtro fcot
        on fc.fc_id = fcot.fc_id
      join Cuenta cue
        on fcot.cue_id = cue.cue_id
      where fc_fechaiva >= p_Fini
        and fc_fechaiva <= p_Ffin
        and fc.est_id <> 7-- Anuladas
        and ( exists ( select *
                       from EmpresaUsuario
                       where emp_id = d.emp_id
                         and us_id = p_us_id )
              or ( p_us_id = 1 ) )
        and ( d.cico_id = v_cico_id or v_cico_id = 0 )
        and ( Empresa.emp_id = v_emp_id or v_emp_id = 0 )
        and ( ( exists ( select rptarb_hojaid
                         from rptArbolRamaHoja
                         where rptarb_cliente = v_clienteID
                           and tbl_id = 1016
                           and rptarb_hojaid = d.cico_id ) )
                or ( v_ram_id_CircuitoContable = 0 ) )
        and ( ( exists ( select rptarb_hojaid
                         from rptArbolRamaHoja
                         where rptarb_cliente = v_clienteID
                           and tbl_id = 1018
                           and rptarb_hojaid = d.emp_id ) )
                or ( v_ram_id_Empresa = 0 ) )

      union ALL

      --------------------------------------------------------------------------------------------------
      -- ANULADAS
      --------------------------------------------------------------------------------------------------
      select fc.fc_id comp_id,
             fc_fecha Fecha,
             fc_fechaiva Fecha_IVA,
             case d.doct_id
                when 2 then 'FAC'
                when 8 then 'NC'
                when 10 then 'ND'
             end Documento,
             emp_nombre Empresa,
             fc_nrodoc Comprobante,
             'ANULADA' Cliente,
             '' CUIT,
             '' Condicion_IVA,
             '' Condicion_IVA2,
             0 Neto,
             0 Base,
             0 Base_Iva,
             0 Tasa_Iva,
             0 Importe_Iva,
             0 Importe_interno,
             '' Concepto,
             0 Importe_concepto,
             0 Total,
             0 Orden,
             0 Orden2
      from FacturaCompra fc
      join Documento d
        on fc.doc_id = d.doc_id
      join Empresa
        on d.emp_id = Empresa.emp_id
      where fc_fechaiva >= p_Fini
        and fc_fechaiva <= p_Ffin
        and fc.est_id = 7-- Anuladas
        and ( exists ( select *
                       from EmpresaUsuario
                       where emp_id = d.emp_id
                         and us_id = p_us_id )
              or ( p_us_id = 1 ) )
        and ( d.cico_id = v_cico_id or v_cico_id = 0 )
        and ( Empresa.emp_id = v_emp_id or v_emp_id = 0 )
        and ( ( exists ( select rptarb_hojaid
                         from rptArbolRamaHoja
                         where rptarb_cliente = v_clienteID
                           and tbl_id = 1016
                           and rptarb_hojaid = d.cico_id ) )
                or ( v_ram_id_CircuitoContable = 0 ) )
        and ( ( exists ( select rptarb_hojaid
                         from rptArbolRamaHoja
                         where rptarb_cliente = v_clienteID
                           and tbl_id = 1018
                           and rptarb_hojaid = d.emp_id ) )
                or ( v_ram_id_Empresa = 0 ) )

      union ALL

      --------------------------------------------------------------------------------------------------
      -- TOTAL TASAS IVA
      --------------------------------------------------------------------------------------------------
      select 0 comp_id,
             v_no_date Fecha,
             v_no_date Fecha_IVA,
             '' Documento,
             '' Empresa,
             '' Comprobante,
             '' Proveedor,
             '' CUIT,
             '' Condicion_IVA,
             '' Condicion_IVA2,
             0 Neto,
             sum(case d.doct_id
                    when 8 then -fci_neto - (fci_neto * fc_descuento1 / 100) - ((fci_neto - (fci_neto * fc_descuento1 / 100)) * fc_descuento2 / 100)
                    else fci_neto - (fci_neto * fc_descuento1 / 100) - ((fci_neto - (fci_neto * fc_descuento1 / 100)) * fc_descuento2 / 100)
                 end) Base,
             0 Base_Iva,
             case
                when fci_ivari <> 0 then fci_ivariporc
                else 0
             end Tasa_Iva,
             sum(case d.doct_id
                    when 8 then -fci_ivari - (fci_ivari * fc_descuento1 / 100) - ((fci_ivari - (fci_ivari * fc_descuento1 / 100)) * fc_descuento2 / 100)
                    else fci_ivari - (fci_ivari * fc_descuento1 / 100) - ((fci_ivari - (fci_ivari * fc_descuento1 / 100)) * fc_descuento2 / 100)
                 end) Importe_Iva,
             0 Importe_interno,
             case
                when ti_codigodgi1 <> '' then ti_codigodgi1
                else ti_nombre
             end Concepto,
             0 Importe_concepto,
             0 Total,
             1 Orden,
             0 Orden2
      from FacturaCompra fc
      join Documento d
        on fc.doc_id = d.doc_id
      join Empresa
        on d.emp_id = Empresa.emp_id
      join Proveedor p
        on fc.prov_id = p.prov_id
      join FacturaCompraItem fci
        on fc.fc_id = fci.fc_id
      join Producto pr
        on fci.pr_id = pr.pr_id
               /*
                 inner join #t_producto_tasa prt     on pr.pr_id 	 = prt.pr_id
		               inner join TasaImpositiva ti        on
																	(pr.ti_id_ivaricompra = ti.ti_id and (fci_ivari <> 0 or ti.ti_porcentaje = 0))
																	or  (ti.ti_id = @ti_id_iva_exento and fci_ivari = 0 and prt.ti_porcentaje <> 0)
               */
      join TasaImpositiva ti
        on pr.ti_id_ivaricompra = ti.ti_id
      where fc_fechaiva >= p_Fini
        and fc_fechaiva <= p_Ffin
        and fc.est_id <> 7-- Anuladas
        and ( exists ( select *
                       from EmpresaUsuario
                       where emp_id = d.emp_id
                         and us_id = p_us_id )
              or ( p_us_id = 1 ) )
        and ( d.cico_id = v_cico_id or v_cico_id = 0 )
        and ( Empresa.emp_id = v_emp_id or v_emp_id = 0 )
        and ( ( exists ( select rptarb_hojaid
                         from rptArbolRamaHoja
                         where rptarb_cliente = v_clienteID
                           and tbl_id = 1016
                           and rptarb_hojaid = d.cico_id ) )
                or ( v_ram_id_CircuitoContable = 0 ) )
        and ( ( exists ( select rptarb_hojaid
                         from rptArbolRamaHoja
                         where rptarb_cliente = v_clienteID
                           and tbl_id = 1018
                           and rptarb_hojaid = d.emp_id ) )
                or ( v_ram_id_Empresa = 0 ) )
      group by case
                  when ti_codigodgi1 <> '' then ti_codigodgi1
                  else ti_nombre
               end,
               case
                  when fci_ivari <> 0 then fci_ivariporc
                  else 0
               end

      union ALL

      --------------------------------------------------------------------------------------------------
      -- TOTAL TASAS PERCEPCIONES
      --------------------------------------------------------------------------------------------------
      select 0 comp_id,
             v_no_date Fecha,
             v_no_date Fecha_IVA,
             '' Documento,
             '' Empresa,
             '' Comprobante,
             '' Proveedor,
             '' CUIT,
             '' Condicion_IVA,
             '' Condicion_IVA2,
             0 Neto,
             sum(case d.doct_id
                    when 8 then -fcperc_base
                    else fcperc_base
                 end) Base,
             0 Base_Iva,
             fcperc_porcentaje Tasa_Iva,
             0 Importe_Iva,
             sum(case d.doct_id
                    when 8 then -fcperc_importe
                    else fcperc_importe
                 end) Importe_interno,
             perc_nombre Concepto,
             0 Importe_concepto,
             0 Total,
             1 Orden,
             0 Orden2
      from FacturaCompra fc
      join Documento d
        on fc.doc_id = d.doc_id
      join Empresa
        on d.emp_id = Empresa.emp_id
      join Proveedor p
        on fc.prov_id = p.prov_id
      join FacturaCompraPercepcion fcp
        on fc.fc_id = fcp.fc_id
      join Percepcion perc
        on fcp.perc_id = perc.perc_id
      where fc_fechaiva >= p_Fini
        and fc_fechaiva <= p_Ffin
        and fc.est_id <> 7-- Anuladas
        and ( exists ( select *
                       from EmpresaUsuario
                       where emp_id = d.emp_id
                         and us_id = p_us_id )
              or ( p_us_id = 1 ) )
        and ( d.cico_id = v_cico_id or v_cico_id = 0 )
        and ( Empresa.emp_id = v_emp_id or v_emp_id = 0 )
        and ( ( exists ( select rptarb_hojaid
                         from rptArbolRamaHoja
                         where rptarb_cliente = v_clienteID
                           and tbl_id = 1016
                           and rptarb_hojaid = d.cico_id ) )
                 or ( v_ram_id_CircuitoContable = 0 ) )
        and ( ( exists ( select rptarb_hojaid
                         from rptArbolRamaHoja
                         where rptarb_cliente = v_clienteID
                           and tbl_id = 1018
                           and rptarb_hojaid = d.emp_id ) )
                 or ( v_ram_id_Empresa = 0 ) )
      group by perc_nombre,fcperc_porcentaje

      union ALL

      --------------------------------------------------------------------------------------------------
      -- TOTAL OTROS
      --------------------------------------------------------------------------------------------------
      select 0 comp_id,
             v_no_date Fecha,
             v_no_date Fecha_IVA,
             '' Documento,
             '' Empresa,
             '' Comprobante,
             '' Proveedor,
             '' CUIT,
             '' Condicion_IVA,
             '' Condicion_IVA2,
             0 Neto,
             0 Base,
             0 Base_Iva,
             0 Tasa_Iva,
             0 Importe_Iva,
             sum(case d.doct_id
                    when 8 then -fcot_debe + fcot_haber
                    else +fcot_debe - fcot_haber
                 end) Importe_interno,
             cue_nombre Concepto,
             0 Importe_concepto,
             0 Total,
             1 Orden,
             0 Orden2
      from FacturaCompra fc
      join Documento d
        on fc.doc_id = d.doc_id
      join Empresa
        on d.emp_id = Empresa.emp_id
      join Proveedor p
        on fc.prov_id = p.prov_id
      join FacturaCompraOtro fcot
        on fc.fc_id = fcot.fc_id
      join Cuenta cue
        on fcot.cue_id = cue.cue_id
      where fc_fechaiva >= p_Fini
        and fc_fechaiva <= p_Ffin
        and fc.est_id <> 7-- Anuladas
        and ( exists ( select *
                       from EmpresaUsuario
                       where emp_id = d.emp_id
                         and us_id = p_us_id )
              or ( p_us_id = 1 ) )
        and ( d.cico_id = v_cico_id or v_cico_id = 0 )
        and ( Empresa.emp_id = v_emp_id or v_emp_id = 0 )
        and ( ( exists ( select rptarb_hojaid
                         from rptArbolRamaHoja
                         where rptarb_cliente = v_clienteID
                           and tbl_id = 1016
                           and rptarb_hojaid = d.cico_id ) )
                or ( v_ram_id_CircuitoContable = 0 ) )
        and ( ( exists ( select rptarb_hojaid
                         from rptArbolRamaHoja
                         where rptarb_cliente = v_clienteID
                           and tbl_id = 1018
                           and rptarb_hojaid = d.emp_id ) )
                or ( v_ram_id_Empresa = 0 ) )
      group by fcot.cue_id,cue_nombre
      order by orden,
               Fecha,
               Comprobante,
               Proveedor,
               orden2;

end;
$BODY$
  language plpgsql volatile
  cost 100;
alter function dc_csc_con_0010(integer, date, date, varchar, varchar)
  owner to postgres;