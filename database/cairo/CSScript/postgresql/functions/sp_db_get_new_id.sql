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
-- Function: sp_dbgetnewid(character varying, character varying, smallint)

-- drop function sp_dbgetnewid(character varying, character varying, smallint);

-- select * from sp_dbgetnewid('asiento','as_id');

create or replace function sp_dbgetnewid
(
 in p_tabla character varying,
 in p_pk character varying,
 out p_id integer
)
  returns integer as
$BODY$
declare
  v_sqlstmt varchar(255);
begin

   if lower(p_tabla) = 'stock' or lower(p_tabla) = 'stockitem' then

      select max(id_nextId)
        into p_id
      from IdStock
      where id_tabla = p_tabla
        and id_campoId = p_pk
        and id_rango = 0;

      -- si no existe en la tabla
      if p_id is null then

         v_sqlstmt := 'insert into IdStock (id_tabla, id_nextId, id_campoId) select ''' || p_tabla
                      || ''',coalesce(max(' || p_pk || '),0)+1, ''' || p_pk
                      || ''' from ' || p_tabla
                      || ' where isnumeric(' || p_pk || ')<>0';

         execute v_sqlstmt;

         select max(id_nextId)
           into p_id
         from IdStock
         where id_tabla = p_tabla
           and id_campoId = p_pk;

      end if;

      update idStock
         set id_nextId = p_id + 1
      where id_tabla = p_tabla
        and id_campoId = p_pk;

   else

      if lower(p_tabla) = 'asiento' or lower(p_tabla) = 'asientoitem' then

         select max(id_nextId)
           into p_id
         from IdAsiento
         where id_tabla = p_tabla
           and id_campoId = p_pk
           and id_rango = 0;

         -- si no existe en la tabla
         if p_id is null then

            v_sqlstmt := 'insert into IdAsiento (id_tabla, id_nextId, id_campoId) select ''' || p_tabla
                         || ''',coalesce(max(' || p_pk || '),0)+1, ''' || p_pk
                         || ''' from ' || p_tabla
                         || ' where isnumeric(' || p_pk || ')<>0';

            execute v_sqlstmt;

            select max(id_nextId)
              into p_id
            from IdAsiento
            where id_tabla = p_tabla
              and id_campoId = p_pk;

         end if;

         update idAsiento
            set id_nextId = p_id + 1
         where id_tabla = p_tabla
           and id_campoId = p_pk;

      else

         select max(id_nextId)
           into p_id
         from Id
         where id_tabla = p_tabla
           and id_campoId = p_pk
           and id_rango = 0;

         -- si no existe en la tabla
         if p_id is null then

            v_sqlstmt := 'insert into Id (id_tabla, id_nextId, id_campoId) select ''' || p_tabla
                         || ''',coalesce(max(' || p_pk || '),0)+1, ''' || p_pk
                         || ''' from ' || p_tabla
                         || ' where isnumeric(' || p_pk || ')<>0';

            execute v_sqlstmt;

            select max(id_nextId)
              into p_id
            from Id
            where id_tabla = p_tabla
              and id_campoId = p_pk;

         end if;

         update id
            set id_nextId = p_id + 1
         where id_tabla = p_tabla
           and id_campoId = p_pk;

      end if;

   end if;
   
end;
$BODY$
  language plpgsql volatile
  cost 100;
alter function sp_dbgetnewid(character varying, character varying)
  owner to postgres;
