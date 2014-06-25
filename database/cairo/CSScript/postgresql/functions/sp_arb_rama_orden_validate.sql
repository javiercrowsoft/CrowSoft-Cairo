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
-- Function: sp_arb_rama_orden_validate()

-- DROP FUNCTION sp_arb_rama_orden_validate(int, int);

CREATE OR REPLACE FUNCTION sp_arb_rama_orden_validate(
  IN p_us_id integer
)
  RETURNS void AS
$BODY$
DECLARE
   v_orden integer;
   c1 refcursor;
   c2 refcursor;
   v_row record;
   v_row2 record;
BEGIN

   SET TRANSACTION READ WRITE;

   OPEN c1 FOR SELECT ram_id FROM rama WHERE ram_id <> 0;
   LOOP
          FETCH c1 INTO v_row;
          EXIT WHEN NOT FOUND;

          v_orden := 0;

          OPEN c2 FOR SELECT ram_id FROM rama WHERE ram_id_padre = v_row.ram_id ORDER BY ram_orden;
          LOOP

                FETCH c2 INTO v_row2;
                EXIT WHEN NOT FOUND;

                UPDATE rama SET ram_orden = v_orden WHERE ram_id = v_row2.ram_id;
                v_orden := v_orden +1;

          END LOOP;
          CLOSE c2;

   END LOOP;
   CLOSE c1;

END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
ALTER FUNCTION sp_arb_rama_orden_validate(integer)
  OWNER TO postgres;
