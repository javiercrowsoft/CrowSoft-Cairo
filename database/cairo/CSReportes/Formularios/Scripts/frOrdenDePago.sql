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
-- Function: frOrdendePago(integer)

-- drop function frOrdendePago(integer);

/*

select max(opg_id) from ordenpago;
select * from frOrdendePago(102);
fetch all from rtn;

*/
create or replace function frOrdendePago
(
  in p_opg_id integer,
  out rtn refcursor
)
  returns refcursor as
$BODY$
declare

begin

   rtn := 'rtn';

--//////////////////////////////////////////////////////////////////////////////////////////
--
-- Orden de Pago y medios de pago
--
--//////////////////////////////////////////////////////////////////////////////////////////

   open rtn for

      select 0 orden_id,
             o.opg_id,
             0 fc_id,
             0 nc_id,
             1 tipo,
             prov_nombre Proveedor,
             prov_cuit CUIT,
             opg_fecha Fecha,
             case
                when lgj_titulo <> '' then lgj_titulo
                else lgj_codigo
             end Legajo,
             usFirma.us_nombre Autorizado,
             usModifico.us_nombre Confeccionado,
             ccos.ccos_nombre Centro_Costo,
             ccosi.ccos_nombre Centro_Costo_Item,
             null Fecha_comprobante,
             '' Tipo_comp,
             '' Nro_comp,
             o.opg_numero OPG_Nro,
             o.opg_nroDoc OPG_Comp,
             0 Aplicacion,
             opg_descrip Aclaraciones,
             bco_nombre Banco,
             c.cue_nombre Cuenta,
             cheq_numerodoc Nro_cheque,
             cheq_fechaCobro Cobro,
             cheq_fechaVto Vencimiento,
             opgi_descrip Detalle,
             opgi_importe Importe,
             opg_total Total,
             0 Total_Factura,
             'Recib¡ de ' || emp_razonsocial || ' la cantidad de:' Recibi_de,
             0 orden2
      from OrdenPago o
               join OrdenPagoItem oi
                on o.opg_id = oi.opg_id
               join Proveedor p
                on o.prov_id = p.prov_id
               join Usuario usModifico
                on o.modifico = usModifico.us_id
               join Empresa emp
                on o.emp_id = emp.emp_id
               left join Cheque ch
                on oi.cheq_id = ch.cheq_id
               left join Chequera chq
                on ch.chq_id = chq.chq_id
               left join Cuenta c
                on coalesce(oi.cue_id, chq.cue_id) = c.cue_id
               left join Usuario usFirma
                on o.opg_firmado = usFirma.us_id
               left join Cuenta chqc
                on chq.cue_id = chqc.cue_id
               left join Banco b
                on ( chqc.bco_id = b.bco_id
               or ch.bco_id = b.bco_id )
               left join Legajo l
                on o.lgj_id = l.lgj_id
               left join CentroCosto ccos
                on o.ccos_id = ccos.ccos_id
               left join CentroCosto ccosi
                on oi.ccos_id = ccosi.ccos_id
      where o.opg_id = p_opg_id
        and oi.opgi_tipo <> 5-- cuenta corriente
                 
--//////////////////////////////////////////////////////////////////////////////////////////
--
-- Facturas
--
--//////////////////////////////////////////////////////////////////////////////////////////

      union ALL
      select 1 orden_id,
             o.opg_id,
             fc.fc_id,
             0 nc_id,
             0 tipo,
             prov_nombre Proveedor,
             prov_cuit CUIT,
             opg_fecha Fecha,
             '' Legajo,
             usFirma.us_nombre Autorizado,
             usModifico.us_nombre Confeccionado,
             ccos.ccos_nombre Centro_Costo,
             '' Centro_Costo_Item,
             fc_fecha Fecha_comprobante,
             doc_nombre Tipo_comp,
             fc_nrodoc Nro_comp,
             o.opg_numero OPG_Nro,
             o.opg_nroDoc OPG_Comp,
             fcopg_importe Aplicacion,
             opg_descrip Aclaraciones,
             '' Banco,
             '' Cuenta,
             '' Nro_cheque,
             null Cobro,
             null Vencimiento,
             '' Detalle,
             0 Importe,
             opg_total Total,
             fc_total Total_Factura,
             'Recib¡ de ' || emp_razonsocial || ' la cantidad de:' Recibi_de,
             1 orden2
      from OrdenPago o
               join Proveedor p
                on o.prov_id = p.prov_id
               join Usuario usModifico
                on o.modifico = usModifico.us_id
               join Empresa emp
                on o.emp_id = emp.emp_id
               left join Usuario usFirma
                on o.opg_firmado = usFirma.us_id
               left join FacturaCompraOrdenPago fcop
                on fcop.opg_id = o.opg_id
               left join FacturaCompraDeuda fcd
                on fcop.fcd_id = fcd.fcd_id
               left join FacturaCompraPago fcp
                on fcop.fcp_id = fcp.fcp_id
               left join FacturaCompra fc
                on ( fcd.fc_id = fc.fc_id
               or fcp.fc_id = fc.fc_id )
               left join Documento d
                on fc.doc_id = d.doc_id
               left join CentroCosto ccos
                on o.ccos_id = ccos.ccos_id
      where o.opg_id = p_opg_id

--//////////////////////////////////////////////////////////////////////////////////////////
--
-- Centros de costo de las facturas
--
--//////////////////////////////////////////////////////////////////////////////////////////

      union ALL
      select 0 orden_id,
             o.opg_id,
             fc.fc_id,
             0 nc_id,
             0 tipo,
             prov_nombre Proveedor,
             prov_cuit CUIT,
             opg_fecha Fecha,
             '' Legajo,
             usFirma.us_nombre Autorizado,
             usModifico.us_nombre Confeccionado,
             ccos.ccos_nombre Centro_Costo,
             ccosi.ccos_nombre Centro_Costo_Item,
             fc_fecha Fecha_comprobante,
             doc_nombre Tipo_comp,
             fc_nrodoc Nro_comp,
             o.opg_numero OPG_Nro,
             o.opg_nroDoc OPG_Comp,
             fcopg_importe Aplicacion,
             opg_descrip Aclaraciones,
             '' Banco,
             '' Cuenta,
             '' Nro_cheque,
             null Cobro,
             null Vencimiento,
             '' Detalle,
             case
                when fcop.fcp_id is not null then fci_importe
                else fci_importe * (fcopg_importe / fcd_importe)
             end Importe,
             opg_total Total,
             fc_total Total_Factura,
             'Recib¡ de ' || emp_razonsocial || ' la cantidad de:' Recibi_de,
             3 orden2
      from OrdenPago o
               join Proveedor p
                on o.prov_id = p.prov_id
               join Usuario usModifico
                on o.modifico = usModifico.us_id
               join Empresa emp
                on o.emp_id = emp.emp_id
               left join Usuario usFirma
                on o.opg_firmado = usFirma.us_id
               left join FacturaCompraOrdenPago fcop
                on fcop.opg_id = o.opg_id
               left join FacturaCompraDeuda fcd
                on fcop.fcd_id = fcd.fcd_id
               left join FacturaCompraPago fcp
                on fcop.fcp_id = fcp.fcp_id
               left join FacturaCompra fc
                on ( fcd.fc_id = fc.fc_id
               or fcp.fc_id = fc.fc_id )
               left join FacturaCompraItem fci
                on fc.fc_id = fci.fc_id
               left join Documento d
                on fc.doc_id = d.doc_id
               left join CentroCosto ccos
                on o.ccos_id = ccos.ccos_id
               left join CentroCosto ccosi
                on fci.ccos_id = ccosi.ccos_id
      where o.opg_id = p_opg_id
        and fci.ccos_id is not null

--//////////////////////////////////////////////////////////////////////////////////////////
--
-- Centros de costo de las facturas
--
--//////////////////////////////////////////////////////////////////////////////////////////

      union ALL
      select 0 orden_id,
             o.opg_id,
             fc.fc_id,
             0 nc_id,
             0 tipo,
             prov_nombre Proveedor,
             prov_cuit CUIT,
             opg_fecha Fecha,
             '' Legajo,
             usFirma.us_nombre Autorizado,
             usModifico.us_nombre Confeccionado,
             ccos.ccos_nombre Centro_Costo,
             ccosi.ccos_nombre Centro_Costo_Item,
             fc_fecha Fecha_comprobante,
             doc_nombre Tipo_comp,
             fc_nrodoc Nro_comp,
             o.opg_numero OPG_Nro,
             o.opg_nroDoc OPG_Comp,
             fcopg_importe Aplicacion,
             opg_descrip Aclaraciones,
             '' Banco,
             '' Cuenta,
             '' Nro_cheque,
             null Cobro,
             null Vencimiento,
             '' Detalle,
             case
                when fcop.fcp_id is not null then fcp_importe
                else fcd_importe
             end Importe,
             opg_total Total,
             fc_total Total_Factura,
             'Recib¡ de ' || emp_razonsocial || ' la cantidad de:' Recibi_de,
             3 orden2
      from OrdenPago o
               join Proveedor p
                on o.prov_id = p.prov_id
               join Usuario usModifico
                on o.modifico = usModifico.us_id
               join Empresa emp
                on o.emp_id = emp.emp_id
               left join Usuario usFirma
                on o.opg_firmado = usFirma.us_id
               left join FacturaCompraOrdenPago fcop
                on fcop.opg_id = o.opg_id
               left join FacturaCompraDeuda fcd
                on fcop.fcd_id = fcd.fcd_id
               left join FacturaCompraPago fcp
                on fcop.fcp_id = fcp.fcp_id
               left join FacturaCompra fc
                on ( fcd.fc_id = fc.fc_id
               or fcp.fc_id = fc.fc_id )
               left join Documento d
                on fc.doc_id = d.doc_id
               left join CentroCosto ccos
                on o.ccos_id = ccos.ccos_id
               left join CentroCosto ccosi
                on fc.ccos_id = ccosi.ccos_id
      where o.opg_id = p_opg_id
        and fc.ccos_id is not null

--//////////////////////////////////////////////////////////////////////////////////////////
--
-- Notas de credito aplicadas a facturas
--
--//////////////////////////////////////////////////////////////////////////////////////////

      union ALL
      select 1 orden_id,
             o.opg_id,
             fc.fc_id,
             nc.fc_id nc_id,
             0 tipo,
             prov_nombre Proveedor,
             prov_cuit CUIT,
             opg_fecha Fecha,
             '' Legajo,
             usFirma.us_nombre Autorizado,
             usModifico.us_nombre Confeccionado,
             ccos.ccos_nombre Centro_Costo,
             '' Centro_Costo_Item,
             nc.fc_fecha Fecha_comprobante,
             doc_nombre Tipo_comp,
             nc.fc_nrodoc Nro_comp,
             o.opg_numero OPG_Nro,
             o.opg_nroDoc OPG_Comp,
             fcnc.fcnc_importe Aplicacion,
             opg_descrip Aclaraciones,
             '' Banco,
             '' Cuenta,
             '' Nro_cheque,
             null Cobro,
             null Vencimiento,
             '' Detalle,
             fcnc_importe Importe,
             opg_total Total,
             nc.fc_total Total_Factura,
             'Recib¡ de ' || emp_razonsocial || ' la cantidad de:' Recibi_de,
             4 orden2
      from OrdenPago o
               join Proveedor p
                on o.prov_id = p.prov_id
               join Usuario usModifico
                on o.modifico = usModifico.us_id
               join Empresa emp
                on o.emp_id = emp.emp_id
               left join Usuario usFirma
                on o.opg_firmado = usFirma.us_id
               left join FacturaCompraOrdenPago fcop
                on fcop.opg_id = o.opg_id
               left join FacturaCompraDeuda fcd
                on fcop.fcd_id = fcd.fcd_id
               left join FacturaCompraPago fcp
                on fcop.fcp_id = fcp.fcp_id
               left join FacturaCompra fc
                on ( fcd.fc_id = fc.fc_id
               or fcp.fc_id = fc.fc_id )
               left join CentroCosto ccos
                on o.ccos_id = ccos.ccos_id
               left join FacturaCompraNotaCredito fcnc
                on fc.fc_id = fcnc.fc_id_factura
               left join FacturaCompra nc
                on fcnc.fc_id_notacredito = nc.fc_id
               left join Documento d
                on nc.doc_id = d.doc_id
      where o.opg_id = p_opg_id
        and nc.fc_id is not null
      order by orden_id,
               tipo,
               orden2;
end;
$BODY$
  language plpgsql volatile
  cost 100;
alter function frOrdendePago(integer)
  owner to postgres;
