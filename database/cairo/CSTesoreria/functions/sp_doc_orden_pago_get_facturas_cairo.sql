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
-- Function: sp_doc_orden_pago_get_facturas_cairo()

-- drop function sp_doc_orden_pago_get_facturas_cairo(integer, integer, integer, integer);
/*

  select * from sp_doc_orden_pago_get_facturas_cairo(1,19);
  fetch all from rtn;
  fetch all from rtn_rates;

  select prov_id from facturacompra where fc_pendiente > 0
  select * from proveedor where prov_id = 19

*/
create or replace function sp_doc_orden_pago_get_facturas_cairo
(
  in p_emp_id integer,
  in p_prov_id integer,
  in p_bSoloVencidos integer default 1,
  in p_bAgrupado integer default 0,
  out rtn refcursor,
  out rtnRates refcursor
)
  returns record as
$BODY$
declare
   v_doct_factura integer;
   v_doct_notadebito integer;
   v_mon_id_default integer;
begin

   v_doct_factura := 1;
   v_doct_notadebito := 9;

   rtn := 'rtn';

   if p_bAgrupado = 0 then

      open rtn for
         select f.fc_id,
                fd.fcd_id,
                d.doc_nombre,
                f.fc_numero,
                f.fc_nrodoc,
                f.fc_fecha,
                f.fc_total,

                case f.fc_cotizacion
                   when 0 then 0
                   else fd.fcd_pendiente / f.fc_cotizacion
                end fc_totalorigen,

                f.fc_pendiente,
                f.fc_cotizacion,
                M.mon_nombre,
                f.mon_id,
                f.fc_descrip,
                fd.fcd_fecha,
                fd.fcd_pendiente

         from FacturaCompra f
         join Documento d
          on f.doc_id = d.doc_id
         join FacturaCompraDeuda fd
          on f.fc_id = fd.fc_id
         join Moneda M
          on f.mon_id = M.mon_id

         where f.prov_id = p_prov_id
           and ( fd.fcd_fecha <= CURRENT_TIMESTAMP or p_bSoloVencidos = 0 )
           and f.fc_pendiente > 0
           and f.doct_id <> 8
           and d.emp_id = p_emp_id

         order by f.fc_nrodoc,
                  f.fc_fecha;

   else

      open rtn for
         select f.fc_id,
                0 fcd_id,
                d.doc_nombre,
                f.fc_numero,
                f.fc_nrodoc,
                f.fc_fecha,
                f.fc_total,
                f.fc_totalorigen,
                f.fc_pendiente,
                f.fc_cotizacion,
                M.mon_nombre,
                f.mon_id,
                f.fc_descrip,
                min(fd.fcd_fecha) fcd_fecha,
                0 fcd_pendiente

         from FacturaCompra f
         join Documento d
          on f.doc_id = d.doc_id
         join FacturaCompraDeuda fd
          on f.fc_id = fd.fc_id
         join Moneda M
          on f.mon_id = M.mon_id

         where f.prov_id = p_prov_id
           and ( f.doct_id = v_doct_factura or f.doct_id = v_doct_notadebito )
           and f.fc_pendiente > 0
           and f.doct_id <> 8
           and d.emp_id = p_emp_id

         group by f.fc_id,d.doc_nombre,f.fc_numero,f.fc_nrodoc,f.fc_fecha,f.fc_total,f.fc_totalorigen,f.fc_pendiente,
                  f.fc_cotizacion,M.mon_nombre,f.mon_id,f.fc_descrip

         order by f.fc_nrodoc,
                  f.fc_fecha;

   end if;

   select mon_id into v_mon_id_default from Moneda where mon_legal <> 0;

   rtnRates := 'rtn_rates';

   open rtnRates for
      select f.mon_id,
             m.mon_nombre,
             sp_moneda_get_cotizacion(f.mon_id, CURRENT_TIMESTAMP::date) as mon_precio

      from FacturaCompra f
      join Documento d
        on f.doc_id = d.doc_id
      join FacturaCompraDeuda fd
        on f.fc_id = fd.fc_id
      join Moneda m
        on f.mon_id = m.mon_id

      where f.prov_id = p_prov_id
        and ( fd.fcd_fecha <= CURRENT_TIMESTAMP or p_bSoloVencidos = 0 )
        and fd.fcd_pendiente > 0
        and f.doct_id <> 8
        and d.emp_id = p_emp_id
        and f.mon_id <> v_mon_id_default
      group by f.mon_id, m.mon_nombre
      order by f.mon_id;

end;
$BODY$
  language plpgsql volatile
  cost 100;
alter function sp_doc_orden_pago_get_facturas_cairo(integer, integer, integer, integer)
  owner to postgres;
