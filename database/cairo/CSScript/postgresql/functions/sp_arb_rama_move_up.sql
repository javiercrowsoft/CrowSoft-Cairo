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
-- Function: sp_arb_rama_move_up()

-- DROP FUNCTION sp_arb_rama_move_up(int, int);

CREATE OR REPLACE FUNCTION sp_arb_rama_move_up(
  IN p_us_id integer,
  IN p_ram_id integer,
  OUT rtn refcursor
)
  RETURNS refcursor AS
$BODY$
DECLARE
   v_ram_orden integer;
BEGIN

   IF NOT EXISTS(SELECT 1 FROM rama WHERE ram_id = p_ram_id) THEN RETURN; END IF;

   SET TRANSACTION READ WRITE;

   IF p_ram_id = 0 THEN RETURN; END IF;

   SELECT v_ram_orden = ram_orden FROM rama WHERE ram_id = p_ram_id;

   IF v_ram_orden = 0 THEN RETURN; END IF;

   UPDATE rama
    SET ram_orden = ram_orden + 1
   WHERE ram_id_padre = (SELECT ram_id_padre FROM rama WHERE ram_id = p_ram_id)
    AND ram_orden = v_ram_orden - 1;

   UPDATE rama SET ram_orden = ram_orden -1 WHERE ram_id = p_ram_id;

   rtn := 'rtn';

   OPEN rtn FOR SELECT * FROM rama WHERE ram_id = p_ram_id;

END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
ALTER FUNCTION sp_arb_rama_move_up(integer, integer)
  OWNER TO postgres;