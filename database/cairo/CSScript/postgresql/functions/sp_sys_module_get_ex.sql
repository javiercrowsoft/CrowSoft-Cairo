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
-- Function: sp_sys_module_get()

-- drop function sp_sys_module_get_ex();

create or replace function sp_sys_module_get(in p_us_id integer, out rtn refcursor)
  returns refcursor as
$BODY$
declare
begin

create or replace function sp_SysModuloGetEx
/*
	select * from usuario
  sp_SysModuloGetEx 38
*/
(
  in p_us_id integer
)
as
begin

   delete sysModuloUser

      where us_id = p_us_id;

   insert into sysModuloUser
     ( sysm_id, us_id )
     ( select distinct S.sysm_id,
                       p_us_id
       from sysModulo S
              join Permiso p
               on S.pre_id = p.pre_id
          where ( exists ( select per_id
                           from Permiso
                              where per_id = p.per_id
                                      and us_id = p_us_id )
                  or exists ( select per_id
                              from Permiso
                                     join UsuarioRol
                                      on Permiso.rol_id = UsuarioRol.rol_id
                                 where per_id = p.per_id
                                         and UsuarioRol.us_id = p_us_id ) ) );

end;

end;
$BODY$
  language plpgsql volatile
  cost 100;
alter function sp_sys_module_get(integer)
  owner to postgres;
