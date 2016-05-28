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
-- Function: sp_security_get_permisos_x_usuario(integer, integer)

-- drop function sp_security_get_permisos_x_usuario(integer, integer);

/*

select * from sp_security_get_permisos_x_usuario(1);

*/

create or replace function sp_security_get_permisos_x_usuario
(
  in p_us_id integer
)
   returns table (per_id int, pre_id int) as
$BODY$
declare
   v_rol_id int;
begin

   create temporary table tt_roles (rol_id int) on commit drop;
   create temporary table tt_permisos (per_id int, rol_id int null) on commit drop;

   insert into tt_roles(rol_id) (select rol_id from usuariorol where us_id = p_us_id);

   for v_rol_id in
       select rol_id from tt_roles
   loop

      insert into tt_permisos(per_id,rol_id)
      select permiso.per_id, v_rol_id
      from permiso
      where rol_id=v_rol_id;

   end loop;

   insert into tt_permisos(per_id) (select permiso.per_id from permiso where us_id = p_us_id);

   return query
   select tp.per_id, p.pre_id
   from tt_permisos tp inner join permiso p on tp.per_id = p.per_id;

end;
$BODY$
  language plpgsql volatile
  cost 100;
alter function sp_security_get_permisos_x_usuario(integer)
  owner to postgres;