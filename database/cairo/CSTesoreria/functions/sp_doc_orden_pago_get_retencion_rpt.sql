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
-- Function: sp_doc_orden_pago_get_retencion_rpt()

/*
drop function sp_doc_orden_pago_get_retencion_rpt(
  timestamp with time zone,
  timestamp with time zone,
  integer,
  varchar,
  decimal,
  decimal,
  decimal,
  decimal,
  decimal,
  decimal
);
*/
/*
          select * from ProveedorRetencion;
          select * from sp_doc_orden_pago_get_retencion_rpt(6);
          fetch all from rtn;
*/

create or replace function sp_doc_orden_pago_get_retencion_rpt
/*

*/
(
  in p_fdesde timestamp with time zone,
  in p_fhasta timestamp with time zone,
  in p_prov_id integer,
  in p_emp_id varchar,
  in p_pago decimal(18,6),
  in p_opg_total decimal(18,6),
  in p_nuevoPago decimal(18,6),
  in p_base decimal(18,6),
  in p_tasa decimal(18,6),
  in p_ret decimal(18,6),
  out rtn refcursor
)
  returns refcursor as
$BODY$
begin

   rtn := 'rtn';

   open rtn for
      select 0 orden,
             p_opg_total Pagado_sin_IVA,
             p_nuevoPago Nuevo_pago_sin_IVA,
             p_base Base_Imponible,
             p_tasa Tasa,
             p_ret Importe_a_retener,
             p_pago - p_ret Total_a_pagar,
             null fc_fecha,
             null fc_numero,
             null fc_nrodoc,
             null fc_total,
             null Pagado,
             null fc_pendiente,
             null fc_ivari,
             null fc_ivarni,
             null IVA_pagado,
             null IVA_pendiente,
             null opg_fecha,
             null opg_numero,
             null opg_nrodoc,
             null opg_total,
             null opg_pendiente

      union

      select 1 orden,
             null Pagado_sin_IVA,
             null Nuevo_pago_sin_IVA,
             null Base_Imponible,
             null Tasa,
             null Importe_a_retener,
             null Total_a_pagar,
             fc_fecha,
             fc.fc_numero,
             fc_nrodoc,
             fc_total,
             fc_total - fc_pendiente Pagado,
             null fc_pendiente,
             fc_ivari,
             fc_ivarni,
             fc_ivari - (fc_ivari * (fc_pendiente / fc_total)) + fc_ivarni - (fc_ivarni * (fc_pendiente / fc_total)) IVA_pagado,
             null IVA_pendiente,
             null opg_fecha,
             null opg_numero,
             null opg_nrodoc,
             null opg_total,
             null opg_pendiente

      from FacturaCompraOrdenPago fcopg
      join FacturaCompra fc
        on fcopg.fc_id = fc.fc_id
      join OrdenPago opg
        on fcopg.opg_id = opg.opg_id
      join Documento d
        on fc.doc_id = d.doc_id

      where opg_fecha between p_fdesde and p_fhasta
        and opg.prov_id = p_prov_id
        and d.emp_id = p_emp_id
        and not exists ( select *
                         from FacturaCompraItem fci
                         join Producto pr
                           on fci.pr_id = pr.pr_id
                         where pr.ibc_id = 1-- Exento
                           and fci.fc_id = fc.fc_id )
      union

      select 2 orden,
             null Pagado_sin_IVA,
             null Nuevo_pago_sin_IVA,
             null Base_Imponible,
             null Tasa,
             null Importe_a_retener,
             null Total_a_pagar,
             null fc_fecha,
             null fc_numero,
             null fc_nrodoc,
             null fc_total,
             null Pagado,
             null fc_pendiente,
             null fc_ivari,
             null fc_ivarni,
             null IVA_pagado,
             null IVA_pendiente,
             opg_fecha,
             opg_numero,
             opg_nrodoc,
             opg_total,
             opg_pendiente

      from OrdenPago c
      join Documento d
        on c.doc_id = d.doc_id

      where opg_fecha between p_fdesde and p_fhasta
        and prov_id = p_prov_id
        and d.emp_id = p_emp_id
        and opg_pendiente > 0-- Solo anticipos

      union

      select 3 orden,
             null Pagado_sin_IVA,
             null Nuevo_pago_sin_IVA,
             null Base_Imponible,
             null Tasa,
             null Importe_a_retener,
             null Total_a_pagar,
             fc_fecha,
             fc.fc_numero,
             fc_nrodoc,
             fc_total,
             fc_total - fc_pendiente Pagado,
             fc_pendiente,
             fc_ivari,
             fc_ivarni,
             null IVA_pagado,
             (fc_ivari * (fc_pendiente / fc_total)) + (fc_ivarni * (fc_pendiente / fc_total)) IVA_pendiente,
             null opg_fecha,
             null opg_numero,
             null opg_nrodoc,
             null opg_total,
             null opg_pendiente

      from FacturaCompra fc
      join Documento d
        on fc.doc_id = d.doc_id
      join tt_nuevoPago t
        on fc.fc_numero = t.fc_numero

      where prov_id = p_prov_id
        and d.emp_id = p_emp_id;

end;
$BODY$
  language plpgsql volatile
  cost 100;
alter function sp_doc_orden_pago_get_retencion_rpt(
  timestamp with time zone,
  timestamp with time zone,
  integer,
  varchar,
  decimal,
  decimal,
  decimal,
  decimal,
  decimal,
  decimal)
  owner to postgres;