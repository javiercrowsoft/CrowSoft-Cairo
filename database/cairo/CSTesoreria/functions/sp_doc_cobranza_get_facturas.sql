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
-- Function: sp_doc_cobranza_get_facturas()

-- drop function sp_doc_cobranza_get_facturas(integer, integer, integer, integer);
/*

  select * from sp_doc_cobranza_get_facturas(1,32);
  fetch all from rtn;
  fetch all from rtn_rates;

  select cli_id from facturaventa where fv_pendiente > 0
  select * from cliente where cli_id = 32

*/

create or replace function sp_doc_cobranza_get_facturas
(
  in p_emp_id integer,
  in p_cli_id integer,
  in p_bSoloVencidos integer default 1,
  in p_bAgrupado integer default 0,
  out rtn refcursor,
  out rtnRates refcursor
)
  returns record as
$BODY$
declare
   v_doct_factura integer := 1;
   v_doct_notadebito integer := 9;
   v_mon_id_default integer;
begin

   rtn := 'rtn';

   if p_bAgrupado = 0 then

      open rtn for

         select f.fv_id,
                fd.fvd_id,
                d.doc_nombre,
                f.fv_numero,
                f.fv_nrodoc,
                f.fv_fecha,
                f.fv_total,
                case f.fv_cotizacion
                                    when 0 then 0
                else fd.fvd_pendiente / f.fv_cotizacion
                   end fv_totalorigen,
                f.fv_pendiente,
                f.fv_cotizacion,
                M.mon_nombre,
                f.mon_id,
                f.fv_descrip,
                fd.fvd_fecha,
                fd.fvd_pendiente

         from FacturaVenta f
         join Documento d
           on f.doc_id = d.doc_id
         join FacturaVentaDeuda fd
           on f.fv_id = fd.fv_id
         join Moneda M
           on f.mon_id = M.mon_id

         where f.cli_id = p_cli_id
           and ( fd.fvd_fecha <= CURRENT_TIMESTAMP or p_bSoloVencidos = 0 )
           and fd.fvd_pendiente > 0
           and f.doct_id <> 7
           and d.emp_id = p_emp_id

         order by f.fv_nrodoc,
                    f.fv_fecha;


   else

      open rtn for
         select f.fv_id,
                0 fvd_id,
                d.doc_nombre,
                f.fv_numero,
                f.fv_nrodoc,
                f.fv_fecha,
                f.fv_total,
                f.fv_totalorigen,
                f.fv_pendiente,
                f.fv_cotizacion,
                M.mon_nombre,
                f.mon_id,
                f.fv_descrip,
                min(fd.fvd_fecha) fvd_fecha,
                0 fvd_pendiente

         from FacturaVenta f
         join Documento d
           on f.doc_id = d.doc_id
         join FacturaVentaDeuda fd
           on f.fv_id = fd.fv_id
         join Moneda M
           on f.mon_id = M.mon_id

         where f.cli_id = p_cli_id
           and ( f.doct_id = v_doct_factura or f.doct_id = v_doct_notadebito )
           and f.doct_id <> 7
           and f.fv_pendiente > 0
           and d.emp_id = p_emp_id

         group by f.fv_id,d.doc_nombre,f.fv_numero,f.fv_nrodoc,f.fv_fecha,f.fv_total,f.fv_totalorigen,f.fv_pendiente,
                  f.fv_cotizacion,M.mon_nombre,f.mon_id,f.fv_descrip
         order by f.fv_nrodoc,
                  f.fv_fecha;

   end if;

   select mon_id into v_mon_id_default from Moneda where mon_legal <> 0;

   rtnRates := 'rtn_rates';

   open rtnRates for
      select f.mon_id,
             m.mon_nombre,
             sp_moneda_get_cotizacion(f.mon_id, CURRENT_TIMESTAMP::date) as mon_precio

      from FacturaVenta f
      join Documento d
        on f.doc_id = d.doc_id
      join FacturaVentaDeuda fd
        on f.fv_id = fd.fv_id
      join Moneda m
        on f.mon_id = m.mon_id

      where f.cli_id = p_cli_id
        and ( fd.fvd_fecha <= CURRENT_TIMESTAMP or p_bSoloVencidos = 0 )
        and fd.fvd_pendiente > 0
        and f.doct_id <> 7
        and d.emp_id = p_emp_id
        and f.mon_id <> v_mon_id_default
      group by f.mon_id, m.mon_nombre
      order by f.mon_id;

end;
$BODY$
  language plpgsql volatile
  cost 100;
alter function sp_doc_cobranza_get_facturas(integer, integer, integer, integer)
  owner to postgres;