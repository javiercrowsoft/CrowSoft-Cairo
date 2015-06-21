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
-- Function: sp_doc_factura_compra_get_remitos()

-- drop function sp_doc_factura_compra_get_remitos(integer, integer, integer);
/*

  select * from sp_doc_factura_compra_get_remitos(1,1,2);
  fetch all from rtn;

*/

create or replace function sp_doc_factura_compra_get_remitos
(
  in p_emp_id integer,
  in p_prov_id integer,
  in p_mon_id integer,
  out rtn refcursor
)
  returns refcursor as
$BODY$
declare
   v_doct_remito integer;
begin

   v_doct_remito := 4;

   rtn := 'rtn';

   open rtn for

      select rc.rc_id,
             d.doc_nombre,
             rc.rc_numero,
             rc.rc_nrodoc,
             rc.rc_fecha,
             rc.rc_total,
             rc.rc_pendiente,
             rc.rc_descrip
      from remitocompra rc
      join documento d
        on rc.doc_id = d.doc_id
      join moneda m
        on d.mon_id = m.mon_id
      where rc.prov_id = p_prov_id
        and rc.est_id <> 7 -- anulado
        and rc.doct_id = v_doct_remito
        and d.mon_id = p_mon_id
        and d.emp_id = p_emp_id
        and exists ( select rci_id
                     from remitocompraitem
                     where rc_id = rc.rc_id
                       and rci_pendientefac > 0 )
      order by rc.rc_nrodoc,
               rc.rc_fecha;

end;
$BODY$
  language plpgsql volatile
  cost 100;
alter function sp_doc_factura_compra_get_remitos(integer, integer, integer)
  owner to postgres;