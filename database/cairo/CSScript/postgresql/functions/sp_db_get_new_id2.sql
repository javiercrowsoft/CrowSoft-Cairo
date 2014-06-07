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
﻿-- Function: sp_dbgetnewid2(character varying, character varying, integer, integer, smallint)

-- DROP FUNCTION sp_dbgetnewid2(character varying, character varying, integer, integer, smallint);

CREATE OR REPLACE FUNCTION sp_dbgetnewid2(IN p_tabla character varying, IN p_pk character varying, IN p_min integer, IN p_max integer, OUT p_id integer, IN p_bselect smallint)
  RETURNS integer AS
$BODY$
BEGIN

   IF p_bSelect <> 0 THEN
      RAISE EXCEPTION '@@ERROR_SP:El procedimiento almacenado SP_DBGetNewId2 no puede ser llamado para obtener un cursor. Se debe usar SP_DBGetNewId2Rs.';
			RETURN;
   END IF;

   SELECT MAX(Id_NextId)
     INTO p_id
     FROM Id
      WHERE Id_Tabla = p_tabla
              AND Id_CampoId = p_pk
              AND Id_Rango = p_min;

   -- si no existe en la tabla
   IF coalesce(p_id, 0) = 0 THEN
   DECLARE
      v_sqlstmt varchar(5000);
   BEGIN
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

      SELECT MAX(Id_NextId)
        INTO p_id
        FROM Id
         WHERE Id_Tabla = p_tabla
                 AND Id_CampoId = p_pk
                 AND Id_Rango = p_min;

   END;
   END IF;

   p_id := coalesce(p_id, 0);

   IF p_id = 0 THEN
      p_id := p_min;

   END IF;

   IF p_id < p_min THEN
      p_id := p_min;

   END IF;

   IF p_id > p_max THEN
      p_id := p_max;

   END IF;

   UPDATE id
      SET Id_NextId = p_id + 1
      WHERE Id_Tabla = p_tabla
     AND Id_CampoId = p_pk
     AND Id_Rango = p_min;

END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
ALTER FUNCTION sp_dbgetnewid2(character varying, character varying, integer, integer, smallint)
  OWNER TO postgres;
