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
-- Function: sp_arbgetarboles(integer)

-- DROP FUNCTION sp_arbgetarboles(integer);

CREATE OR REPLACE FUNCTION sp_arbgetarboles(IN p_tbl_id integer, OUT rtn refcursor)
  RETURNS refcursor AS
$BODY$
DECLARE
BEGIN

        rtn := 'rtn';

        OPEN rtn FOR
        SELECT  Arbol.arb_id,
                arb_Nombre,
                ram_id
        FROM Arbol,
             Rama
         WHERE Rama.ram_id_padre = 0
                 AND Arbol.arb_id = Rama.arb_id
                 AND tbl_id = p_tbl_id
                 AND Rama.ram_id <> 0;

END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
ALTER FUNCTION sp_arbgetarboles(integer)
  OWNER TO postgres;