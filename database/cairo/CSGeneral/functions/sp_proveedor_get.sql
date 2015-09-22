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
-- Function: sp_producto_get()

-- drop function sp_proveedor_get(integer);

create or replace function sp_proveedor_get
(
  in p_prov_id integer,
  out rtn refcursor
)
  returns refcursor as
$BODY$
begin

   rtn := 'rtn';

   open rtn for
      select Proveedor.*,
             pro_nombre,
             zon_nombre,
             cpg_nombre,
             lp_nombre,
             ld_nombre,
             us.us_nombre
      from Proveedor
      left join Provincia
       on Proveedor.pro_id = Provincia.pro_id
      left join Zona
       on Proveedor.zon_id = Zona.zon_id
      left join CondicionPago
       on Proveedor.cpg_id = CondicionPago.cpg_id
      left join ListaPrecio
       on Proveedor.lp_id = ListaPrecio.lp_id
      left join ListaDescuento
       on Proveedor.ld_id = ListaDescuento.ld_id
      left join Usuario us
       on Proveedor.us_id = us.us_id
      where prov_id = p_prov_id;

end;

$BODY$
  language plpgsql volatile
  cost 100;
alter function sp_proveedor_get(integer)
  owner to postgres;