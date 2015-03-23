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
-- Function: sp_documentohelp()

-- drop function sp_documentohelp(integer, integer, integer, varchar, integer, integer, varchar);

create or replace function sp_documentohelp
/*
          select * from sp_documentohelp(1, 1, 0, '', 0, 0);
          fetch all from rtn;
          select * from sp_documentohelp(2, 1, 0, 'Factura Dolar s/Packing List -cc', 1, 0, 'doct_id = 1 or doct_id = 7');
          fetch all from rtn;
          select * from sp_documentohelp(2, 1, 0, '', 0, 0, 'doct_id = 1 or doct_id = 7');
          fetch all from rtn;
          select * from sp_documentohelp(1, 1, 0, 'factur', 0, 0, 'doct_id = 2 or doct_id = 8 or doct_id = 10');
          fetch all from rtn;
          
          select * from empresa
          
*/
(
  in p_emp_id integer,
  in p_us_id integer,
  in p_bForAbm integer,
  in p_filter varchar default '',
  in p_check integer default 0,
  in p_doc_id integer default 0,
  in p_filter2 varchar default '',
  out rtn refcursor
)
  returns refcursor as
$BODY$
declare
   v_sqlstmt varchar(8000);
   v_bFilterXEmpresa smallint;
   v_strUsId varchar(10);
   v_permisos varchar(1000);
begin

   /*------------------------------------------
	Este codigo es el que se asigna a @permiso.
	Se asigna en una sola linea para que sea mas rapida la sentencia
	and exists( select * from Permiso
                       where pre_id = Documento.pre_id_list
                         and (
                                  us_id = @@us_id
                              or
                                  exists(select * from UsuarioRol where us_id = @@us_id and rol_id = Permiso.rol_id)
                              )
                    )
	*/

   p_filter := lower(f_unaccent(p_filter));

   if instr(p_filter2, '{emp_id=0}') <> 0 then
      p_filter2 := replace(p_filter2, '{emp_id=0}', '');
      v_bFilterXEmpresa := 0;
   else
      v_bFilterXEmpresa := 1;
   end if;

   if instr(p_filter2, 'emp_id = ') <> 0 then
      v_bFilterXEmpresa := 0;
   end if;

   v_strUsId := p_us_id::varchar;

   v_permisos := ' and exists(select * from Permiso	where pre_id = Documento.pre_id_list and (us_id = ' 
                || v_strUsId
                || ' or exists(select * from UsuarioRol where us_id = ' || v_strUsId
                || ' and rol_id = Permiso.rol_id))) ';

   /*-----------------------------------------*/
   if p_check <> 0 then
      v_sqlstmt := 'select doc_id, '
                || 'doc_nombre as Nombre, '
                || 'doc_codigo as Codigo '
                || 'from Documento '
                || 'where (lower(f_unaccent(doc_nombre)) = ''' || p_filter
                || ''' or lower(f_unaccent(doc_codigo)) = ''' || p_filter || ''') ';

      if p_doc_id <> 0 then
         v_sqlstmt := v_sqlstmt || 'and (doc_id = ' || CAST(p_doc_id as varchar(20)) || ') ';
      end if;

      if p_emp_id <> 0 and v_bFilterXEmpresa <> 0 and p_bForAbm = 0 then
         v_sqlstmt := v_sqlstmt || 'and (emp_id = ' || CAST(p_emp_id as varchar(20)) || ') ';
      end if;

      if p_bForAbm = 0 then
         v_sqlstmt := v_sqlstmt || 'and activo <> 0 ';
      end if;

      if p_filter2 <> '' then
         v_sqlstmt := v_sqlstmt || 'and (' || p_filter2 || ') ';
      end if;

   else

      v_sqlstmt := 'select doc_id, '
                || 'doc_nombre   as Nombre, '
                || 'doc_codigo   as Codigo '
                || 'from Documento '
                || 'where (lower(f_unaccent(doc_codigo)) like ''%' || p_filter
                || '%'' or lower(f_unaccent(doc_nombre)) like ''%' || p_filter
                || '%'' or ''' || p_filter || ''' = '''') ';

      if p_emp_id <> 0 and v_bFilterXEmpresa <> 0 and p_bForAbm = 0 then
         v_sqlstmt := v_sqlstmt || 'and (emp_id = ' || CAST(p_emp_id as varchar(20)) || ') ';
      end if;

      if p_bForAbm = 0 then
         v_sqlstmt := v_sqlstmt || 'and activo <> 0 ';
      end if;

      if p_filter2 <> '' then
         v_sqlstmt := v_sqlstmt || 'and (' || p_filter2 || ') ';
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
  COST 100;
alter function sp_documentohelp(integer, integer, integer, varchar, integer, integer, varchar)
  owner to postgres;