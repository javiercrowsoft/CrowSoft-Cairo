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
-- Function: sp_doc_cobranza_get_aplic()

-- drop function sp_doc_cobranza_get_aplic(integer, integer);

/*

select * from sp_doc_cobranza_get_aplic(1,3);
fetch all from rtn;

*/

create or replace function sp_doc_cobranza_get_aplic
(
 in p_emp_id integer,
 in p_cobz_id integer,
 out rtn refcursor
)
 returns refcursor as
$BODY$
declare
 v_cli_id integer;
begin

   rtn := 'rtn';

   select cli_id
     into v_cli_id
   from Cobranza
   where cobz_id = p_cobz_id;

   open rtn for

   select fvcobz_id,
          fvcobz_importe,
          fvcobz_importeOrigen,
          fvcobz_cotizacion,
          fvd.fvd_id,
          fvp.fvp_id,
          fv.fv_id,
          fv_nrodoc,
          doc_nombre,
          fvd_fecha,
          fvd_pendiente,
          fvp_fecha,
          0 orden
   from FacturaVentaCobranza fvc
   join FacturaVenta fv on fvc.fv_id = fv.fv_id
   join Documento d on fv.doc_id = d.doc_id
   left join FacturaVentaDeuda fvd on fvc.fvd_id = fvd.fvd_id
   left join FacturaVentaPago fvp on fvc.fvp_id = fvp.fvp_id
   where fvc.cobz_id = p_cobz_id

   union

   select 0 fvcob_id,
          0 fvcob_importe,
          0 fvcobz_importeOrigen,
          fv_cotizacion fvcobz_cotizacion,
          fvd_id,
          0 fvp_id,
          fv.fv_id,
          fv_nrodoc,
          doc_nombre,
          fvd_fecha,
          fvd_pendiente,
          null fvp_fecha,
          1 orden
   from FacturaVenta fv
   join Documento d on fv.doc_id = d.doc_id
   join FacturaVentaDeuda fvd on fv.fv_id = fvd.fv_id
   where not exists ( select fv_id
                      from FacturaVentaCobranza
                      where cobz_id = p_cobz_id
                        and fv_id = fv.fv_id )
     and fv.est_id <> 7
     -- Empresa
     and d.emp_id = p_emp_id
     and fv.cli_id = v_cli_id
     and fv.doct_id <> 7
     and round(fv_pendiente, 2) > 0

   order by orden,
            fv_nrodoc,
            fvd_fecha;

end;
$BODY$
 language plpgsql volatile
                  cost 100;
alter function sp_doc_cobranza_get_aplic(integer, integer)
 owner to postgres;
