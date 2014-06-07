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
-- Function: sp_getrptid()

-- DROP FUNCTION sp_getrptid();

CREATE OR REPLACE FUNCTION sp_getrptid(OUT p_clienteid integer)
  RETURNS integer AS
$BODY$
DECLARE
BEGIN

   SELECT id_NextId
     INTO p_ClienteID
     FROM Id
      WHERE Id_Tabla = 'rptArbolRamaHoja'
              AND id_CampoId = 'rptarb_cliente';

   IF coalesce(p_ClienteID, 0) = 0 THEN
   BEGIN
      INSERT INTO id
        ( id_NextId, id_Tabla, id_CampoId )
        VALUES ( 0, 'rptArbolRamaHoja', 'rptarb_cliente' );

      p_ClienteID := 1;

   END;
   END IF;

   UPDATE id
      SET id_NextId = p_ClienteID + 1
      WHERE Id_Tabla = 'rptArbolRamaHoja'
     AND id_CampoId = 'rptarb_cliente';

END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
ALTER FUNCTION sp_getrptid()
  OWNER TO postgres;
