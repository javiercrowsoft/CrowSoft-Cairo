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
-- Function: sp_dbgetnewid(character varying, character varying, integer, integer, smallint)

-- drop function sp_dbgetnewid(character varying, character varying, integer, integer, smallint);

create or replace function sp_dbgetnewid(in p_tabla character varying, in p_pk character varying, out p_id integer, in p_bselect smallint)
  returns integer as
$BODY$
declare
        v_sqlstmt varchar(255);
begin

   if p_bselect <> 0 then
      RAISE exception '@@ERROR_SP:El procedimiento almacenado SP_DBGetNewId no puede ser llamado para obtener un cursor. El codigo Java o Scala debe usar parametros out.';
	  RETURN;
   end if;

   if LOWER(p_tabla) = 'stock'
     or LOWER(p_tabla) = 'stockitem' then
   begin
      select max(Id_NextId)
        into p_id
        from IdStock
         where Id_Tabla = p_tabla
                 and Id_CampoId = p_pk
                 and Id_Rango = 0;

      -- si no existe en la tabla
      if p_id is null then
      begin
         v_sqlstmt := 'insert into idStock (Id_Tabla, Id_NextId, Id_CampoId) select ''' || p_tabla || ''',coalesce(max(' || p_pk || '),0)+1, ''' || p_pk || ''' from ' || p_tabla || ' where isnumeric(' || p_pk || ')<>0';

         EXECUTE v_sqlstmt;

         select max(Id_NextId)
           into p_id
           from IdStock
            where Id_Tabla = p_tabla
                    and Id_CampoId = p_pk;

      end;
      end if;

      update idStock
         set Id_NextId = p_id + 1
         where Id_Tabla = p_tabla
        and Id_CampoId = p_pk;

   end;
   else
   begin
      if LOWER(p_tabla) = 'asiento'
        or LOWER(p_tabla) = 'asientoitem' then
      begin
         select max(Id_NextId)
           into p_id
           from IdAsiento
            where Id_Tabla = p_tabla
                    and Id_CampoId = p_pk
                    and Id_Rango = 0;

         -- si no existe en la tabla
         if p_id is null then
         begin
            v_sqlstmt := 'insert into idAsiento (Id_Tabla, Id_NextId, Id_CampoId) select ''' || p_tabla || ''',coalesce(max(' || p_pk || '),0)+1, ''' || p_pk || ''' from ' || p_tabla || ' where isnumeric(' || p_pk || ')<>0';

            EXECUTE v_sqlstmt;

            select max(Id_NextId)
              into p_id
              from IdAsiento
               where Id_Tabla = p_tabla
                       and Id_CampoId = p_pk;

         end;
         end if;

         update idAsiento
            set Id_NextId = p_id + 1
            where Id_Tabla = p_tabla
           and Id_CampoId = p_pk;

      end;
      else
      begin
         select max(Id_NextId)
           into p_id
           from Id
            where Id_Tabla = p_tabla
                    and Id_CampoId = p_pk
                    and Id_Rango = 0;

         -- si no existe en la tabla
         if p_id is null then
         begin
            v_sqlstmt := 'insert into Id (Id_Tabla, Id_NextId, Id_CampoId) select ''' || p_tabla || ''',coalesce(max(' || p_pk || '),0)+1, ''' || p_pk || ''' from ' || p_tabla || ' where isnumeric(' || p_pk || ')<>0';

            EXECUTE v_sqlstmt;

            select max(Id_NextId)
              into p_id
              from Id
               where Id_Tabla = p_tabla
                       and Id_CampoId = p_pk;

         end;
         end if;

         update id
            set Id_NextId = p_id + 1
            where Id_Tabla = p_tabla
           and Id_CampoId = p_pk;

      end;
      end if;

   end;
   end if;
   
end;
$BODY$
  language plpgsql volatile
  COST 100;
alter function sp_dbgetnewid(character varying, character varying, smallint)
  owner to postgres;
