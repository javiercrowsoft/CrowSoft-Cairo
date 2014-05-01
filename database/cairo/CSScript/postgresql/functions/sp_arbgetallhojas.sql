/*
CrowSoft-Cairo
==============

ERP application written in Java (Tomcat + GWT) and Postgresql

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
-- Function: sp_arbgetallhojas(integer, integer, integer)

-- DROP FUNCTION sp_arbgetallhojas(integer, integer, integer);

CREATE OR REPLACE FUNCTION sp_arbgetallhojas(p_ram_id integer, p_clienteid integer, p_tblidalias integer)
  RETURNS void AS
$BODY$
DECLARE
   v_tot2 integer;
   v_tot1 integer;
   v_n integer;
BEGIN

   CREATE TEMPORARY TABLE tt_t_rama
   (
     ram_id integer  NOT NULL,
     N integer  NOT NULL
   ) ON COMMIT DROP;

   IF p_ram_id = 0 THEN
      RETURN;
   END IF;

   IF p_clienteId = 0 THEN
      RAISE EXCEPTION '@@ERROR_SP:El procedimiento almacenado sp_ArbGetAllHojas no puede ser llamado para obtener un cursor. Se debe usar sp_ArbGetAllHojasRs.';
      RETURN;
   END IF;
	 
   v_tot1 := -1;

   v_tot2 := 0;

   v_n := 1;

   INSERT INTO tt_t_rama ( ram_id, N )
                  VALUES ( p_ram_id, 0 );

   WHILE v_tot1 < v_tot2
   LOOP
      BEGIN
         v_tot1 := v_tot2;

         INSERT INTO tt_t_rama
           ( ram_id, N )
           ( SELECT r.ram_id,
                    v_n
             FROM Rama r,
                  tt_t_rama t
                WHERE r.ram_id_padre = t.ram_id
                        AND t.N = v_n - 1
                        AND r.ram_id <> t.ram_id );

         SELECT COUNT(*)
         INTO v_tot2
         FROM tt_t_rama;

         v_n := v_n + 1;

      END;
   END LOOP;

   IF p_clienteId <> 0 THEN
   DECLARE
      v_tbl_id integer;
   BEGIN
      SELECT tbl_id
        INTO v_tbl_id
      FROM Arbol INNER JOIN Rama ON Arbol.arb_id = Rama.arb_id
      WHERE Rama.ram_id = p_ram_id;

      IF p_tblIdAlias <> 0 THEN
         v_tbl_id := p_tblIdAlias;
      END IF;

      INSERT INTO rptArbolRamaHoja
        ( rptarb_cliente, rptarb_hojaid, tbl_id, ram_id )
        ( SELECT DISTINCT p_clienteId,
                          h.id,
                          v_tbl_id,
                          t.ram_id
          FROM Hoja h INNER JOIN tt_t_rama t ON h.ram_id = t.ram_id );

   END;
   END IF;

END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
ALTER FUNCTION sp_arbgetallhojas(integer, integer, integer)
  OWNER TO postgres;
