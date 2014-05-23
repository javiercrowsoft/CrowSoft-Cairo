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
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License along
with this program; if not, write to the Free Software Foundation, Inc.,
51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.

========================================================================

Created by Javier

http://www.crowsoft.com.ar

javier at crowsoft.com.ar
*/
-- Function: sp_sys_menu_get()

-- DROP FUNCTION sp_sys_menu_get();

CREATE OR REPLACE FUNCTION sp_sys_menu_get(IN p_us_id integer, IN p_emp_id integer, out rtn refcursor)
  RETURNS refcursor AS
$BODY$
DECLARE
v_leng_id integer;
BEGIN
        select cfg_valor::int into v_leng_id
        from configuracion
        where cfg_grupo = 'Usuario-Config'
        and cfg_aspecto = 'Lenguaje Gral_' || p_us_id::varchar
        and emp_id = p_emp_id;

        v_leng_id := coalesce(v_leng_id, 1);                            

        rtn := 'rtn';
        
        open rtn for
        select distinct 

                        s.sysm_id,
                        s.sysm_orden,
                        s.sysm_objetoinicializacion,
                        s.sysm_objetoedicion,
                        s.pre_id,
                        m.me_id,
                        m.me_text,
                        m.me_key,
                        m.me_father,
                        m.me_position,
                        m.me_is_last,
                        m.me_is_separator,
                        m.me_have_separator,
                        m.me_is_main_menu,
                        m.me_is_popup_menu,
                        m.me_object_handler,
                        m.me_package,
                        m.me_file_path,
                        l.lengi_texto as text,
                        lfather.lengi_texto as father

 	from sysModulo s 
                inner join sysModuloUser u on s.sysm_id = u.sysm_id and u.us_id = p_us_id
                inner join sysMenu m on s.pre_id = m.pre_id
                left join lenguajeItem l on l.lengi_codigo = m.me_text and l.leng_id = v_leng_id
                left join lenguajeItem lfather on lfather.lengi_codigo = m.me_father and lfather.leng_id = v_leng_id

	order by s.sysm_orden;

END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
ALTER FUNCTION sp_sys_menu_get(integer, integer)
  OWNER TO postgres;
