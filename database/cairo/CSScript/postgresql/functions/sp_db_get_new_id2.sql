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
-- Function: sp_dbGetNewId2

-- drop function sp_dbGetNewId2(character varying, character varying, integer, integer);

-- select * from sp_dbGetNewId2('alarma','al_id', 1000000, 10000000);

create or replace function sp_dbGetNewId2
(
  in p_tabla character varying, 
  in p_pk character varying, 
  in p_min integer, 
  in p_max integer, 
  out p_id integer
)
  returns integer as
$BODY$
declare
  v_sqlstmt varchar(5000);
begin

   select max(id_nextId)
     into p_id
   from id
   where id_tabla = p_tabla
     and id_campoId = p_pk
     and id_rango = p_min;

   -- si no existe en la tabla
   if coalesce(p_id, 0) = 0 then
      v_sqlstmt := 'insert into id (id_tabla, id_nextId, id_campoId, id_rango) select '''
                    || p_tabla || 
                    ''',coalesce(max(to_number(' || p_pk || ')),0)+1, ''' 
                    || p_pk || ''',' 
                    || to_char(p_min) || 
                    ' from ' || p_tabla ||
                    ' where isnumeric(' || p_pk || ')<>0 and (to_number(' || p_pk || ') >= '
                    || to_char(p_min) 
                    || ' and ' || ' to_number(' || p_pk || ') <= ' || to_char(p_max) || ')';

      execute v_sqlstmt;

      select max(id_nextId)
        into p_id
      from id
      where id_tabla = p_tabla
        and id_campoId = p_pk
        and id_rango = p_min;

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
      set id_nextId = p_id + 1
   where id_tabla = p_tabla
     and id_campoId = p_pk
     and id_rango = p_min;

end;
$BODY$
  language plpgsql volatile
  cost 100;
alter function sp_dbGetNewId2(character varying, character varying, integer, integer)
  owner to postgres;
