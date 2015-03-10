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
-- Function: sp_dbgetnewid(character varying, character varying, integer, integer, smallint)

-- DROP FUNCTION sp_dbgetnewid(character varying, character varying, integer, integer, smallint);

CREATE OR REPLACE FUNCTION sp_dbgetnewid(IN p_tabla character varying, IN p_pk character varying, OUT p_id integer, IN p_bselect smallint)
  RETURNS integer AS
$BODY$
DECLARE
        v_sqlstmt varchar(255);
BEGIN

   IF p_bSelect <> 0 THEN
      RAISE EXCEPTION '@@ERROR_SP:El procedimiento almacenado SP_DBGetNewId no puede ser llamado para obtener un cursor. El codigo Java o Scala debe usar parametros OUT.';
	  RETURN;
   END IF;

   IF LOWER(p_tabla) = 'stock'
     OR LOWER(p_tabla) = 'stockitem' THEN
   BEGIN
      SELECT MAX(Id_NextId)
        INTO p_id
        FROM IdStock
         WHERE Id_Tabla = p_tabla
                 AND Id_CampoId = p_pk
                 AND Id_Rango = 0;

      -- si no existe en la tabla
      IF p_id IS NULL THEN
      BEGIN
         v_sqlstmt := 'insert into idStock (Id_Tabla, Id_NextId, Id_CampoId) select ''' || p_tabla || ''',coalesce(max(' || p_pk || '),0)+1, ''' || p_pk || ''' from ' || p_tabla || ' where isnumeric(' || p_pk || ')<>0';

         EXECUTE v_sqlstmt;

         SELECT MAX(Id_NextId)
           INTO p_id
           FROM IdStock
            WHERE Id_Tabla = p_tabla
                    AND Id_CampoId = p_pk;

      END;
      END IF;

      UPDATE idStock
         SET Id_NextId = p_id + 1
         WHERE Id_Tabla = p_tabla
        AND Id_CampoId = p_pk;

   END;
   ELSE
   BEGIN
      IF LOWER(p_tabla) = 'asiento'
        OR LOWER(p_tabla) = 'asientoitem' THEN
      BEGIN
         SELECT MAX(Id_NextId)
           INTO p_id
           FROM IdAsiento
            WHERE Id_Tabla = p_tabla
                    AND Id_CampoId = p_pk
                    AND Id_Rango = 0;

         -- si no existe en la tabla
         IF p_id IS NULL THEN
         BEGIN
            v_sqlstmt := 'insert into idAsiento (Id_Tabla, Id_NextId, Id_CampoId) select ''' || p_tabla || ''',coalesce(max(' || p_pk || '),0)+1, ''' || p_pk || ''' from ' || p_tabla || ' where isnumeric(' || p_pk || ')<>0';

            EXECUTE v_sqlstmt;

            SELECT MAX(Id_NextId)
              INTO p_id
              FROM IdAsiento
               WHERE Id_Tabla = p_tabla
                       AND Id_CampoId = p_pk;

         END;
         END IF;

         UPDATE idAsiento
            SET Id_NextId = p_id + 1
            WHERE Id_Tabla = p_tabla
           AND Id_CampoId = p_pk;

      END;
      ELSE
      BEGIN
         SELECT MAX(Id_NextId)
           INTO p_id
           FROM Id
            WHERE Id_Tabla = p_tabla
                    AND Id_CampoId = p_pk
                    AND Id_Rango = 0;

         -- si no existe en la tabla
         IF p_id IS NULL THEN
         BEGIN
            v_sqlstmt := 'insert into Id (Id_Tabla, Id_NextId, Id_CampoId) select ''' || p_tabla || ''',coalesce(max(' || p_pk || '),0)+1, ''' || p_pk || ''' from ' || p_tabla || ' where isnumeric(' || p_pk || ')<>0';

            EXECUTE v_sqlstmt;

            SELECT MAX(Id_NextId)
              INTO p_id
              FROM Id
               WHERE Id_Tabla = p_tabla
                       AND Id_CampoId = p_pk;

         END;
         END IF;

         UPDATE id
            SET Id_NextId = p_id + 1
            WHERE Id_Tabla = p_tabla
           AND Id_CampoId = p_pk;

      END;
      END IF;

   END;
   END IF;
   
END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
ALTER FUNCTION sp_dbgetnewid(character varying, character varying, smallint)
  OWNER TO postgres;
