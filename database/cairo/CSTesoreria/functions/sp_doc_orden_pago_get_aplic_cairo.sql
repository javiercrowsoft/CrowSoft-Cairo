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
-- Function: sp_doc_orden_pago_get_aplic_cairo()

-- drop function sp_doc_orden_pago_get_aplic_cairo(integer, integer);

/*
delete facturaCompraOrdenPago
delete facturaComprapago
select * from OrdenPago
exec sp_doc_orden_pagoGetAplic 15
sp_columns FacturaCompraOrdenPago
*/

create or replace function sp_doc_orden_pago_get_aplic_cairo
(
  in p_emp_id integer,
  in p_opg_id integer,
  out rtn refcursor
)
  returns refcursor as
$BODY$
declare
   v_prov_id integer;
begin

   rtn := 'rtn';

   select prov_id into v_prov_id from OrdenPago where opg_id = p_opg_id;

   open rtn for
      select fcopg_id,
             fcopg_importe,
             fcopg_importeOrigen,
             fcopg_cotizacion,
             fcd.fcd_id,
             fcp.fcp_id,
             fc.fc_id,
             fc_nrodoc,
             doc_nombre,
             fcd_fecha,
             fcd_pendiente,
             fcp_fecha,
             0 orden
      from FacturaCompraOrdenPago fcc
      join FacturaCompra fc
        on fcc.fc_id = fc.fc_id
      join Documento d
        on fc.doc_id = d.doc_id
      left join FacturaCompraDeuda fcd
        on fcc.fcd_id = fcd.fcd_id
      left join FacturaCompraPago fcp
        on fcc.fcp_id = fcp.fcp_id
      where fcc.opg_id = p_opg_id

      union

      select 0 fccob_id,
             0 fccob_importe,
             0 fcopg_importeOrigen,
             fc_cotizacion fcopg_cotizacion,
             fcd_id,
             0 fcp_id,
             fc.fc_id,
             fc_nrodoc,
             doc_nombre,
             fcd_fecha,
             fcd_pendiente,
             null fcp_fecha,
             1 orden
      from FacturaCompra fc
      join Documento d
        on fc.doc_id = d.doc_id
      join FacturaCompraDeuda fcd
        on fc.fc_id = fcd.fc_id
      where not exists ( select fc_id
                         from FacturaCompraOrdenPago
                         where opg_id = p_opg_id
                           and fc_id = fc.fc_id )
        and fc.prov_id = v_prov_id
        and fc.est_id <> 7
        -- Empresa
        and d.emp_id = p_emp_id
        and fc.doct_id <> 8
        and round(fc_pendiente, 2) > 0

      order by orden,
               fc_nrodoc,
               fcd_fecha;

end;
$BODY$
  language plpgsql volatile
  cost 100;
alter function sp_doc_orden_pago_get_aplic_cairo(integer, integer)
  owner to postgres;
