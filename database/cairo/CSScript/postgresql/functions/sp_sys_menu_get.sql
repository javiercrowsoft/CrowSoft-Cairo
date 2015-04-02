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
-- Function: sp_sys_menu_get()

-- drop function sp_sys_menu_get();

create or replace function sp_sys_menu_get(in p_us_id integer, in p_emp_id integer, out rtn refcursor)
  returns refcursor as
$BODY$
declare
v_leng_id integer;
begin
        select cfg_valor::int into v_leng_id
        from configuracion
        where cfg_grupo = 'Usuario-Config'
        and cfg_aspecto = 'Lenguaje Gral_' || p_us_id::varchar
        and emp_id = p_emp_id;

        v_leng_id := coalesce(v_leng_id, 1);                            

        rtn := 'rtn';
        
        open rtn for
        select

                        s.sysm_id,
                        s.sysm_orden,
                        s.sysm_objetoinicializacion,
                        s.sysm_objetoedicion,
                        m.me_path,
                        m.me_path2, 
                        replace(s.sysm_objetoedicion,'.','/') as handler,
                        s.pre_id,
                        m.me_action,
                        m.me_action2,
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
                        coalesce(lfather1.lengi_texto,'') as father1,
                        coalesce(lfather2.lengi_texto,'') as father2,
                        coalesce(lfather3.lengi_texto,'') as father3,
                        coalesce(lfather4.lengi_texto,'') as father4,
                        coalesce(lfather5.lengi_texto,'') as father5,

                        father1.me_id as father1_id,
                        father2.me_id as father2_id,
                        father3.me_id as father3_id,
                        father4.me_id as father4_id,
                        father5.me_id as father5_id

                        /*
                        ,'mkdir ' || substring(s.sysm_objetoedicion from 1 for position('.' in s.sysm_objetoedicion)-1) as make_dir
                        ,'touch ' || replace(s.sysm_objetoedicion,'.','/') || '.js' as js_file
                        */
                        
 	from sysModulo s 
                inner join sysModuloUser u on s.sysm_id = u.sysm_id and u.us_id = p_us_id
                inner join sysMenu m on s.pre_id = m.pre_id
                left join lenguajeItem l on l.lengi_codigo = m.me_text and l.leng_id = v_leng_id

                left join sysMenu father1 on m.me_id_father = father1.me_id
                left join sysMenu father2 on father1.me_id_father = father2.me_id
                left join sysMenu father3 on father2.me_id_father = father3.me_id
                left join sysMenu father4 on father3.me_id_father = father4.me_id
                left join sysMenu father5 on father4.me_id_father = father5.me_id
                
                left join lenguajeItem lfather1 on father1.me_text = lfather1.lengi_codigo and lfather1.leng_id = v_leng_id
                left join lenguajeItem lfather2 on father2.me_text = lfather2.lengi_codigo and lfather2.leng_id = v_leng_id
                left join lenguajeItem lfather3 on father3.me_text = lfather3.lengi_codigo and lfather3.leng_id = v_leng_id
                left join lenguajeItem lfather4 on father4.me_text = lfather4.lengi_codigo and lfather4.leng_id = v_leng_id
                left join lenguajeItem lfather5 on father5.me_text = lfather5.lengi_codigo and lfather5.leng_id = v_leng_id

	order by 
	coalesce(replace(lfather5.lengi_texto, '&',''),'zzz'), 
	coalesce(replace(lfather4.lengi_texto, '&',''),'zzz'), 
	coalesce(replace(lfather3.lengi_texto, '&',''),'zzz'), 
	coalesce(replace(lfather2.lengi_texto, '&',''),'zzz'), 
	coalesce(replace(lfather1.lengi_texto, '&',''),'zzz'), 
	coalesce(replace(l.lengi_texto, '&',''),'zzz') desc;

end;
$BODY$
  language plpgsql volatile
  cost 100;
alter function sp_sys_menu_get(integer, integer)
  owner to postgres;
