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
-- Function: sp_role_get_permissions()

-- drop function sp_role_get_permissions(integer, integer, integer, integer, varchar);

/*
select * from sp_role_get_permissions(1,1,1,'');
fetch all from rtn;
*/

create or replace function sp_role_get_permissions
(
 in p_us_id integer,
 in p_rol_id integer,
 in p_only_granted integer,
 in p_filter varchar(5000),
 out rtn refcursor
)
 returns refcursor as
$BODY$
declare
begin

   if p_filter != '' then
      p_filter := '%' || lower(f_unaccent(replace(p_filter, ' ','%'))) || '%';
   end if;

   rtn := 'rtn';

   open rtn for
    select
           Permiso.per_id,
           Permiso.pre_id,
           pre_nombre,
           pre_grupo,
           pre_grupo1,
           pre_grupo2,
           pre_grupo3,
           pre_grupo4,
           pre_grupo5
    from Permiso
    join Prestacion on Permiso.pre_id = Prestacion.pre_id
    where Permiso.rol_id = p_rol_id
      and (p_filter = '' or lower(f_unaccent(pre_grupo || ' ' || pre_grupo1 || ' ' || pre_grupo2 || ' ' || pre_grupo3 || ' ' || pre_grupo4 || ' ' || pre_grupo5 || ' ' || pre_nombre)) like p_filter)

    union ALL

    select
           null per_id,
           pre_id,
           pre_nombre,
           pre_grupo,
           pre_grupo1,
           pre_grupo2,
           pre_grupo3,
           pre_grupo4,
           pre_grupo5
    from Prestacion
    where p_only_granted = 0
      and exists(select 1 from Rol where rol_id = p_rol_id)
      and Prestacion.pre_id not in (select Permiso.pre_id from Permiso where Permiso.rol_id = p_rol_id)
      and (p_filter = '' or lower(f_unaccent(pre_grupo || ' ' || pre_grupo1 || ' ' || pre_grupo2 || ' ' || pre_grupo3 || ' ' || pre_grupo4 || ' ' || pre_grupo5 || ' ' || pre_nombre)) like p_filter)

    order by
           pre_grupo,
           pre_grupo1,
           pre_grupo2,
           pre_grupo3,
           pre_grupo4,
           pre_grupo5;

end;
$BODY$
 language plpgsql volatile
                  cost 100;
alter function sp_role_get_permissions(integer, integer, integer, varchar)
 owner to postgres;