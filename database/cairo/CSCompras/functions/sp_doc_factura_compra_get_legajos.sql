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
-- Function: sp_doc_factura_compra_get_legajos()

-- drop function sp_doc_factura_compra_get_legajos(integer);
/*
select * from legajo
select * from sp_doc_factura_compra_get_legajos(10);
fetch all from rtn;
*/
create or replace function sp_doc_factura_compra_get_legajos
(
  in p_fc_id integer,
  out rtn refcursor
)
  returns refcursor as
$BODY$
begin

   rtn := 'rtn';

   open rtn for
      select FacturaCompraLegajo.*,
             case
               when lgj_titulo <> '' then lgj_titulo
               else lgj_codigo
             end lgj_codigo
      from FacturaCompraLegajo
       join Legajo on FacturaCompraLegajo.lgj_id = Legajo.lgj_id
      where fc_id = p_fc_id
      order by fclgj_orden;

end;
$BODY$
  language plpgsql volatile
  cost 100;
alter function sp_doc_factura_compra_get_legajos(integer)
  owner to postgres;