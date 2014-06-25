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
-- Function: sp_arbcortarrama()

-- DROP FUNCTION sp_arbcortarrama();

CREATE OR REPLACE FUNCTION sp_arbcortarrama
(
  IN p_us_id integer,
  IN p_ram_id_cut_from integer ,
  IN p_ram_id_to_paste_in integer ,
  IN p_solo_los_hijos smallint ,
  OUT rtn refcursor
)
  RETURNS refcursor AS
$BODY$
DECLARE
   v_arb_id integer;
   v_incluir_ram_id_to_copy integer;
   v_orden integer;

   c_branches_to_copy refcursor;
   v_branch_row record;
BEGIN

   IF p_ram_id_cut_from = 0 THEN RETURN; END IF;

   IF p_ram_id_to_paste_in = 0 THEN RETURN; END IF;

   IF NOT EXISTS(SELECT 1 FROM rama WHERE ram_id = p_ram_id_cut_from) THEN RETURN; END IF;

   IF NOT EXISTS(SELECT 1 FROM rama WHERE ram_id = p_ram_id_to_paste_in) THEN RETURN; END IF;

   SELECT arb_id INTO v_arb_id FROM rama WHERE ram_id = p_ram_id_to_paste_in;

   IF p_solo_los_hijos <> 0 THEN
      v_incluir_ram_id_to_copy := 0;

      SELECT max(orden) INTO v_orden FROM rama WHERE ram_id_padre = p_ram_id_to_paste_in;

      v_orden := coalesce(v_orden+1,0);

      UPDATE rama
                  SET ram_id_padre = p_ram_id_to_paste_in, modifico = p_us_id, ram_orden = ram_orden + v_orden
                  WHERE ram_id_padre = p_ram_id_cut_from;

   ELSE
      v_incluir_ram_id_to_copy := 1;

      UPDATE rama
                  SET ram_id_padre = p_ram_id_to_paste_in, modifico = p_us_id, ram_orden = ram_orden + v_orden
                  WHERE ram_id = p_ram_id_cut_from;

   END IF;

   IF EXISTS(SELECT 1 FROM rama WHERE ram_id = p_ram_id_cut_from AND arb_id <> v_arb_id) THEN

       SELECT INTO c_branches_to_copy t.rtn FROM SP_ArbGetDecendencia(p_ram_id_cut_from,v_incluir_ram_id_to_copy,0,0,0) t;

       LOOP
          FETCH c_branches_to_copy INTO v_branch_row;
          EXIT WHEN NOT FOUND;

          UPDATE rama SET arb_id = v_arb_id, modifico = p_us_id WHERE rama.ram_id = v_branch_row.ram_id;
          UPDATE hoja SET arb_id = v_arb_id, modifico = p_us_id WHERE hoja.ram_id = v_branch_row.ram_id;

       END LOOP;

       CLOSE c_branches_to_copy;

   END IF;

   rtn := 'rtn';

   OPEN rtn FOR SELECT * FROM rama WHERE ram_id = p_ram_id_to_paste_in;

END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
ALTER FUNCTION sp_arbcortarrama(integer, integer, integer, smallint)
  OWNER TO postgres;