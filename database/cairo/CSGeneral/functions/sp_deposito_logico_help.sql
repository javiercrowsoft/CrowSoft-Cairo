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
-- Function: sp_cuentahelpcliente()

-- drop function sp_depositologicohelp(integer, integer, integer, varchar, integer, integer, varchar);
/*
select sp_depositologicohelp(1,1,1,'%a%',0,0); fetch all from rtn;
select sp_depositologicohelp(1,1,0,'casa central',1,1,''); fetch all from rtn;
*/

create or replace function sp_depositologicohelp
(
  in p_emp_id integer,
  in p_us_id integer,
  in p_bForAbm integer,
  in p_filter varchar default '',
  in p_check integer default 0,
  in p_depl_id integer default 0,
  in p_filter2 varchar default '',
  out rtn refcursor
)
  returns refcursor as
$BODY$
declare
   v_sqlstmt varchar(5000);
   v_bFilterXEmpresa smallint;
   v_strUsId varchar(10);
   v_permisos varchar(500);
   v_filter varchar(2000);
   v_filter2 varchar(2000);
begin

   p_filter := lower(f_unaccent(p_filter));

   v_filter := p_filter;
   v_filter2 := p_filter2;

   v_filter := replace(v_filter, '''', '''''');

   if instr(v_filter2, '{emp_id=0}') <> 0 then

      v_filter2 := replace(v_filter2, '{emp_id=0}', '');
      v_bFilterXEmpresa := 0;

   else

      v_bFilterXEmpresa := 1;

   end if;

   if instr(v_filter2, 'emp_id = ') <> 0 then

      v_bFilterXEmpresa := 0;

   end if;

   v_strUsId := trim(to_char(p_us_id));

   -- Si el usuario no tiene acceso irestricto sobre los depositos
   --
   if not exists ( select *
                   from Usuario
                   where us_deposito <> 0
                     and us_id = p_us_id ) then

      v_permisos := ' and exists(select * from UsuarioDepositoLogico '
                    || 'where depl_id = depl.depl_id and us_id = '
                    || v_strUsId || ')';

   else

      v_permisos := '';

   end if;

   if p_check <> 0 then

      v_sqlstmt :=              'select depl_id, ';
      v_sqlstmt := v_sqlstmt || '    depl_nombre    as Nombre, ';
      v_sqlstmt := v_sqlstmt || '    depl_codigo    as Codigo ';
      v_sqlstmt := v_sqlstmt || 'from DepositoLogico depl ';
      v_sqlstmt := v_sqlstmt || 'where (depl_id > 0) and (lower(f_unaccent(depl_nombre)) = ''' || v_filter
                             || ''' or lower(f_unaccent(depl_codigo)) = ''' || v_filter || ''') ';

      if p_depl_id <> 0 then

         v_sqlstmt := v_sqlstmt || '  and (depl_id = ' || to_char(p_depl_id) || ') ';

      end if;

      if p_emp_id <> 0 and v_bFilterXEmpresa <> 0 and p_bForAbm = 0 then

         v_sqlstmt := v_sqlstmt || '  and (emp_id = ' || to_char(p_emp_id) || ' or emp_id is null) ';

      end if;

      if p_bForAbm = 0 then

         v_sqlstmt := v_sqlstmt || '  and activo <> 0 ';

      end if;

      if v_filter2 <> '' then

         v_sqlstmt := v_sqlstmt || '  and (' || v_filter2 || ')';

      end if;

   else

      v_sqlstmt :=              'select depl_id, ';
      v_sqlstmt := v_sqlstmt || '       depl_nombre   as Nombre, ';
      v_sqlstmt := v_sqlstmt || '       depl_codigo   as Codigo ';
      v_sqlstmt := v_sqlstmt || 'from DepositoLogico depl ';
      v_sqlstmt := v_sqlstmt || 'where (depl_id > 0 ) and (lower(f_unaccent(depl_codigo)) like ''%' || v_filter
                                || '%'' or lower(f_unaccent(depl_nombre)) like ''%' || v_filter
                                || '%'' or ''' || v_filter || ''' = '''') ';

      if p_emp_id <> 0 and v_bFilterXEmpresa <> 0 and p_bForAbm = 0 then

         v_sqlstmt := v_sqlstmt || '  and (emp_id = ' || to_char(p_emp_id) || ' or emp_id is null) ';

      end if;

      if p_bForAbm = 0 then

         v_sqlstmt := v_sqlstmt || '  and activo <> 0 ';

      end if;

      if v_filter2 <> '' then

         v_sqlstmt := v_sqlstmt || '  and (' || v_filter2 || ')';

      end if;

   end if;

   if p_bForAbm = 0 then

      v_sqlstmt := v_sqlstmt || v_permisos;

   end if;

   rtn := 'rtn';
   open rtn for execute v_sqlstmt;

end;
$BODY$
  language plpgsql volatile
  cost 100;
alter function sp_depositologicohelp(integer, integer, integer, varchar, integer, integer, varchar)
  owner to postgres;