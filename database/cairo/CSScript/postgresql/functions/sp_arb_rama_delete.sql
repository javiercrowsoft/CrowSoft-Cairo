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
-- Function: sp_arbborrarrama()

-- DROP FUNCTION sp_arbborrarrama();

CREATE OR REPLACE FUNCTION sp_arbborrarrama(
  IN p_us_id integer, 
  IN p_ram_id integer DEFAULT NULL
)
  RETURNS void AS
$BODY$
DECLARE
   v_error_code varchar := '00';
   -- si la rama es raiz tengo que borrar el arbol
   v_arb_id integer;
   -- para actulizar el orden
   v_ram_orden integer;
   v_ram_id_padre integer;
   rtn refcursor;
   v_row record;
   v_tran_id integer;
BEGIN

          IF NOT EXISTS(SELECT 1 FROM rama WHERE ram_id = p_ram_id) THEN RETURN; END IF;

   --------------------------------------------------------------------

        CREATE TEMP TABLE tt_t_ramas_a_borrar
        (
          ram_id integer  NOT NULL,
          tran_id integer  NOT NULL
        ) on commit drop;
        
        v_tran_id := nextval('t_ramas_a_borrar_seq');
        
   --------------------------------------------------------------------
   
   SET TRANSACTION READ WRITE;

   IF p_ram_id = 0 THEN
      RETURN;

   END IF;

   SELECT arb_id,
          ram_orden,
          ram_id_padre
     INTO v_arb_id,
          v_ram_orden,
          v_ram_id_padre
     FROM Rama
     WHERE ram_id = p_ram_id
       AND ram_id_padre = 0;

   SELECT INTO rtn t.rtn FROM SP_ArbGetDecendencia(p_ram_id,1,0,0,0) t;

   LOOP
          FETCH rtn INTO v_row;
          EXIT WHEN NOT FOUND;
          INSERT INTO tt_t_ramas_a_borrar(ram_id, tran_id) VALUES (v_row.ram_id, v_tran_id);
   END LOOP;
   CLOSE rtn;

   BEGIN
      -- primero las hojas
      DELETE FROM Hoja WHERE EXISTS(SELECT 1 FROM tt_t_ramas_a_borrar WHERE Hoja.ram_id = tt_t_ramas_a_borrar.ram_id);

   EXCEPTION
      WHEN OTHERS THEN
         v_error_code := SQLSTATE;
   END;

   IF NOT is_error(v_error_code) THEN

             BEGIN
                -- ahora las ramas
                DELETE FROM Rama WHERE EXISTS (SELECT 1 FROM tt_t_ramas_a_borrar WHERE Rama.ram_id = tt_t_ramas_a_borrar.ram_id);
             EXCEPTION
                WHEN OTHERS THEN
                   v_error_code := SQLSTATE;
             END;

             IF NOT is_error(v_error_code) THEN
             BEGIN      
                       -- si era una raiz borro el arbol
                       IF v_arb_id IS NOT NULL THEN

                          DELETE FROM Arbol WHERE arb_id = v_arb_id;

                       ELSE
                          -- sino, tengo que actualizar el orden de los que estaban bajo esta rama
                          UPDATE rama
                             SET ram_orden = ram_orden - 1
                          WHERE ram_id_padre = v_ram_id_padre
                            AND ram_orden < v_ram_orden;

                       END IF;

                       RETURN;

             EXCEPTION
                WHEN OTHERS THEN
                   v_error_code := SQLSTATE;
             END;
             END IF;
   END IF;
   
   IF is_error(v_error_code) THEN

          RAISE EXCEPTION 'No se pude borrar la rama. % %', SQLSTATE, SQLERRM;   
          
   END IF;

END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
ALTER FUNCTION sp_arbborrarrama(integer, integer)
  OWNER TO postgres;