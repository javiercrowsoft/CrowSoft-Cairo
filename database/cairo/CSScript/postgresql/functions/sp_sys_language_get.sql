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
-- Function: sp_sys_language_get()

-- drop function sp_sys_language_get();

create or replace function sp_sys_language_get
(
  in p_us_id integer,
  out rtn refcursor
)
  returns refcursor as
$BODY$
declare
   v_leng_id integer;
begin

   select cfg_valor::integer
     into v_leng_id
     from Configuracion
      where cfg_grupo = 'Usuario-Config'
        and cfg_aspecto = 'Lenguaje Gral_' || p_us_id::varchar;

   if coalesce(v_leng_id, 0) = 0 then
   begin
      select cfg_valor::integer
        into v_leng_id
        from Configuracion
         where cfg_grupo = 'general'
           and cfg_aspecto = 'lenguaje';

   end;
   end if;

   if coalesce(v_leng_id, 0) = 0 then
      v_leng_id := 1;-- CrowSoft default language (Castellano)
   end if;

   rtn := 'rtn';

   open rtn for select sysl_code, sysl_text from sysLanguage where leng_id = v_leng_id;

end;
$BODY$
  language plpgsql volatile
  cost 100;
alter function sp_sys_language_get(integer)
  owner to postgres;