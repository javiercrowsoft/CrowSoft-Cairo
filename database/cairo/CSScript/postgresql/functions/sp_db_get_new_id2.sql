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
-- Function: sp_dbgetnewid2(character varying, character varying, integer, integer, smallint)

-- drop function sp_dbgetnewid2(character varying, character varying, integer, integer, smallint);

create or replace function sp_dbgetnewid2(in p_tabla character varying, in p_pk character varying, in p_min integer, in p_max integer, out p_id integer, in p_bselect smallint)
  returns integer as
$BODY$
begin

   if p_bselect <> 0 then
      RAISE exception '@@ERROR_SP:El procedimiento almacenado SP_DBGetNewId2 no puede ser llamado para obtener un cursor. El codigo Java o Scala debe usar parametros out.';
	  RETURN;
   end if;

   select max(Id_NextId)
     into p_id
     from Id
      where Id_Tabla = p_tabla
              and Id_CampoId = p_pk
              and Id_Rango = p_min;

   -- si no existe en la tabla
   if coalesce(p_id, 0) = 0 then
   declare
      v_sqlstmt varchar(5000);
   begin
      v_sqlstmt := 'insert into Id (Id_Tabla, Id_NextId, Id_CampoId, Id_Rango) select '''
                    || p_tabla || 
                    ''',coalesce(max(to_number(' || p_pk || ')),0)+1, ''' 
                    || p_pk || ''',' 
                    || to_char(p_min) || 
                    ' from ' || p_tabla ||
                    ' where isnumeric(' || p_pk || ')<>0 and (to_number(' || p_pk || ') >= '
                    || to_char(p_min) 
                    || ' and ' || ' to_number(' || p_pk || ') <= ' || to_char(p_max) || ')';

      EXECUTE v_sqlstmt;

      select max(Id_NextId)
        into p_id
        from Id
         where Id_Tabla = p_tabla
                 and Id_CampoId = p_pk
                 and Id_Rango = p_min;

   end;
   end if;

   p_id := coalesce(p_id, 0);

   if p_id = 0 then
      p_id := p_min;

   end if;

   if p_id < p_min then
      p_id := p_min;

   end if;

   if p_id > p_max then
      p_id := p_max;

   end if;

   update id
      set Id_NextId = p_id + 1
      where Id_Tabla = p_tabla
     and Id_CampoId = p_pk
     and Id_Rango = p_min;

end;
$BODY$
  language plpgsql volatile
  COST 100;
alter function sp_dbgetnewid2(character varying, character varying, integer, integer, smallint)
  owner to postgres;
