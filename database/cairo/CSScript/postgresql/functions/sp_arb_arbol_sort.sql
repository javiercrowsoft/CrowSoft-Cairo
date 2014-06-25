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
-- Function: sp_arb_arbol_sort()

-- DROP FUNCTION sp_arb_arbol_sort(int, int);

CREATE OR REPLACE FUNCTION sp_arb_arbol_sort(
  IN p_us_id integer,
  IN p_arb_id integer,
  IN p_desc integer,
  OUT rtn refcursor
)
  RETURNS refcursor AS
$BODY$
DECLARE
   c_arbol refcursor;
   v_row record;
   v_ram_id integer;
   v_ram_id_padre integer;
   v_last_ram_id_padre integer;
   v_orden integer;
   v_sqlstmt varchar(1000);
BEGIN

   v_last_ram_id_padre := -1;

   v_sqlstmt := 'SELECT ram_id, ram_id_padre FROM Rama WHERE arb_id = ' || p_arb_id::varchar || ' ORDER BY ram_id_padre, ram_nombre';

   IF p_desc <> 0 THEN
     v_sqlstmt := v_sqlstmt || ' desc';
   END IF;

   OPEN c_arbol FOR EXECUTE v_sqlstmt;

   LOOP
      FETCH c_arbol INTO v_row;
      EXIT WHEN NOT FOUND;

      v_ram_id := v_row.ram_id;
      v_ram_id_padre := v_row.ram_id_padre;

      IF v_ram_id_padre <> v_last_ram_id_padre THEN
        v_last_ram_id_padre := v_ram_id_padre;

        v_orden := 0;

      END IF;

      v_orden := v_orden + 1;

      UPDATE rama SET ram_orden = v_orden WHERE ram_id = v_ram_id;

   END LOOP;

   CLOSE c_arbol;

   rtn := 'rtn';

   OPEN rtn FOR SELECT * FROM rama WHERE ram_id = (SELECT ram_id FROM rama WHERE arb_id = p_arb_id AND ram_id_padre = 0);

END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
ALTER FUNCTION sp_arb_arbol_sort(integer, integer, integer)
  OWNER TO postgres;