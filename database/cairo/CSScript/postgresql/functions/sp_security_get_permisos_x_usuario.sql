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

select * from sp_security_get_permisos_x_usuario(1, 0);
fetch all from rtn;

*/

create or replace function sp_security_get_permisos_x_usuario
(
  in p_us_id integer,
  in p_resumido integer,
  out rtn refcursor
)
   returns refcursor as
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
      select per_id, v_rol_id
      from permiso
      where rol_id=v_rol_id;

   end loop;
   
   insert into tt_permisos(per_id) (select per_id from permiso where us_id = p_us_id);

   rtn := 'rtn';

   if p_resumido <> 0 then

      open rtn for

      select tp.per_id, pre_id
      from tt_permisos tp inner join permiso p on tp.per_id = p.per_id;

   else

      open rtn for

      select
             p.per_id,
             p.us_id,
             p.rol_id,
             pr.pre_id,
             rol_nombre,
             p.creado,
             p.modifico,
             pr.pre_nombre,
             pr.pre_grupo,
             p.per_id_padre,
             pr2.pre_nombre as padre
    
      from (tt_permisos tp
                inner join permiso p on tp.per_id = p.per_id
                inner join prestacion pr on p.pre_id = pr.pre_id
                inner join usuario u on p.modifico = u.us_id
                left  join permiso p2 on p.per_id_padre = p2.per_id
                left  join prestacion pr2 on p2.pre_id = pr2.pre_id
           )
           left join rol r on tp.rol_id = r.rol_id;

   end if;

end;
$BODY$
  language plpgsql volatile
  cost 100;
alter function sp_security_get_permisos_x_usuario(integer, integer)
  owner to postgres;