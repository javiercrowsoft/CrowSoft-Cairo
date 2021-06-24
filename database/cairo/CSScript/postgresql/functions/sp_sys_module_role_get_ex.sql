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
-- Function: sp_sys_module_role_get_ex()

-- drop function sp_sys_module_role_get_ex();

/*
  sp_sys_module_role_get_ex 1
*/
create or replace function sp_sys_module_role_get_ex(in p_rol_id integer)
 returns void as
$BODY$
declare
 v_us_id integer;
begin

   for v_us_id in
      select us_id
      from UsuarioRol
      where rol_id = p_rol_id
   loop

      perform sp_sys_module_get_ex(v_us_id);

   end loop;

end;
$BODY$
 language plpgsql volatile
                  cost 100;
alter function sp_sys_module_role_get_ex(integer)
 owner to postgres;
