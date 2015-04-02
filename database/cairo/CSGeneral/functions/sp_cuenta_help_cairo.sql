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
-- Function: sp_cuentahelpcairo()

-- drop function sp_cuentahelpcairo(integer, integer, integer, varchar, integer, integer, varchar);

create or replace function sp_cuentahelpcairo
(
  in p_emp_id integer ,
  in p_us_id integer ,
  in p_bForAbm integer ,
  in p_filter varchar default '' ,
  in p_check integer default 0 ,
  in p_cue_id integer default 0 ,
  in p_filter2 varchar default '',
  out rtn refcursor
)
  returns refcursor as
$BODY$
declare
   v_sqlstmt varchar(8000);
begin

   if p_check <> 0 then
   begin
      v_sqlstmt := 'select  cue_id,
                            cue_nombre as Nombre,
                            cue_codigo as Codigo
                    from Cuenta
                    where (     lower(f_unaccent(cue_nombre)) = f_unaccent(''' || p_filter || ''') or lower(f_unaccent(cue_codigo)) = f_unaccent(''' || p_filter || ''')
                            or (lower(f_unaccent(cue_identificacionexterna)) = f_unaccent(''' || p_filter || ''')
                                and cue_identificacionexterna <> '''')
                          )
                      and activo <> 0
                      and (cue_id = ' || to_char(p_cue_id) || ' or ' || to_char(p_cue_id) || '=0)';
   end;
   else
   begin
      v_sqlstmt := 'select
                           cue_id,
      		      cue_nombre as Nombre,
      		      cue_codigo as Codigo,
      		      cue_identificacionexterna as Codigo2,
      		      cue_descrip as Descripcion
                    from Cuenta
                    where (lower(f_unaccent(cue_codigo)) like ''%' || p_filter || '%'' or lower(f_unaccent(cue_nombre)) like ''%' || p_filter || '%''
                           or (lower(f_unaccent(cue_identificacionexterna)) like ''%' || p_filter || '%'' and cue_identificacionexterna <> '''')
                           or (lower(f_unaccent(cue_descrip)) like ''%' || p_filter || '%'' and cue_descrip <> ''''))
                      and (' || to_char(p_bForAbm) || ' <> 0 or activo <> 0)';
   end;
   end if;

   if p_filter2 <> '' then
      v_sqlstmt := v_sqlstmt || ' and (' || p_filter2 || ')';
   end if;

   v_sqlstmt := v_sqlstmt || ' limit 50;';
   
   rtn := 'rtn';        
   open rtn for execute v_sqlstmt;

        
end;
$BODY$
  language plpgsql volatile
  cost 100;
alter function sp_cuentahelpcairo(integer, integer, integer, varchar, integer, integer, varchar)
  owner to postgres;
