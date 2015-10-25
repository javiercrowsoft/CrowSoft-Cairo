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
-- Function: sp_proveedor_get_centros_costo()

-- drop function sp_proveedor_get_centros_costo(integer);
/*
          select * from ProveedorCentroCosto;
          select * from proveedor where prov_id = 44
          select * from sp_proveedor_get_centros_costo(44);
          fetch all from rtn;
          delete from proveedorcentrocosto where provccos_id > 3 and prov_id = 44;
*/

create or replace function sp_proveedor_get_centros_costo
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
             provccos_id,
             provccos.ccos_id,
             provccos.pr_id,
             ccos_nombre,
             pr_nombrecompra
      from ProveedorCentroCosto provccos
      inner join CentroCosto ccos on provccos.ccos_id = ccos.ccos_id
      left join Producto pr on provccos.pr_id = pr.pr_id
      where provccos.prov_id = p_prov_id
      order by ccos_nombre;

end;
$BODY$
  language plpgsql volatile
  cost 100;
alter function sp_proveedor_get_centros_costo(integer)
  owner to postgres;