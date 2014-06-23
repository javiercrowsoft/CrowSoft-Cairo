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
-- Function: sp_arb_arbol_create()

-- DROP FUNCTION sp_arb_arbol_create();

CREATE OR REPLACE FUNCTION sp_arb_arbol_create(
  IN p_us_id integer,
  IN p_tbl_id integer,
  IN p_nombre varchar,
  OUT rtn refcursor
)
  RETURNS refcursor AS
$BODY$
DECLARE
        v_arb_id integer;
        v_raiz_id integer;
BEGIN

        SELECT SP_DBGetNewId('arbol',
                              'arb_id',
                              0::smallint) INTO v_arb_id;

        INSERT INTO arbol (arb_id, arb_nombre, tbl_id, modifico)
        VALUES (v_arb_id, p_nombre, p_tbl_id, p_us_id);

        SELECT SP_DBGetNewId('rama',
                             'ram_id',
                             0::smallint) INTO v_raiz_id;

        INSERT INTO rama (ram_id, ram_nombre, ram_id_padre, ram_orden, arb_id, modifico)
        VALUES (v_raiz_id, p_nombre, 0, 0, v_arb_id, p_us_id);

        rtn := 'rtn';

        open rtn for SELECT arb_id, arb_nombre, v_raiz_id AS ram_id FROM arbol WHERE arb_id = v_arb_id;

END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
ALTER FUNCTION sp_arb_arbol_create(integer, integer, varchar)
  OWNER TO postgres;
