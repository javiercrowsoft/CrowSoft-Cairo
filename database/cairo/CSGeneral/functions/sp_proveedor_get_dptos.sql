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
-- Function: sp_proveedor_get_dptos()

-- drop function sp_proveedor_get_dptos(integer);
/*
          select * from DepartamentoProveedor;
          select * from sp_proveedor_get_dptos(3);
          fetch all from rtn;
*/

create or replace function sp_proveedor_get_dptos
(
  in p_prov_id integer,
  out rtn refcursor
)
  returns refcursor as
$BODY$

begin   

   rtn := 'rtn';

   open rtn for

      select
             dptoprov_id,
             dptoprov.dpto_id,
             dpto_nombre
      from DepartamentoProveedor dptoprov
      inner join Departamento dpto on dptoprov.dpto_id = dpto.dpto_id
      where dptoprov.prov_id = p_prov_id;

end;
$BODY$
  language plpgsql volatile
  cost 100;
alter function sp_proveedor_get_dptos(integer)
  owner to postgres;