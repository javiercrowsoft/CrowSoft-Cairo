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
-- Function: sp_proveedor_get_cuit_info()

-- drop function sp_proveedor_get_cuit_info(varchar);

create or replace function sp_proveedor_get_cuit_info
/*
    select prov_cuit from proveedor;
    select * from sp_proveedor_get_cuit_info('45-00000017-9');
*/
(
  in p_cuit varchar,

  out p_prov_id integer,
  out p_prov_code varchar,
  out p_prov_razonsocial varchar
)
  returns record as
$BODY$
begin

   select prov_id,
          prov_codigo,
          prov_razonsocial
     into p_prov_id,
          p_prov_code,
          p_prov_razonsocial
   from Proveedor
   where replace(prov_cuit, '-', '') = replace(p_cuit, '-', '');

   p_prov_id := coalesce(p_prov_id, 0);
   p_prov_code := coalesce(p_prov_code, '');
   p_prov_razonsocial := coalesce(p_prov_razonsocial, '');

end;
$BODY$
  language plpgsql volatile
  cost 100;
alter function sp_proveedor_get_cuit_info(varchar)
  owner to postgres;