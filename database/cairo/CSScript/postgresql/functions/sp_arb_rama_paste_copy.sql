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
-- Function: sp_arbcopiarrama()

-- DROP FUNCTION sp_arbcopiarrama();

CREATE OR REPLACE FUNCTION sp_arbcopiarrama
(
  IN p_us_id integer,
  IN p_ram_id_copy_from integer ,
  IN p_ram_id_copy_to integer ,
  IN p_solo_los_hijos smallint ,
  OUT rtn refcursor
)
  RETURNS refcursor AS
$BODY$
DECLARE
   v_ram_id integer;
   v_new_ram_id integer;
   v_new_hoja_id integer;
   v_ram_id_padre integer;
   v_arb_id integer;
   v_incluir_ram_id_to_copy integer;

   c_branches_to_copy refcursor;
   c_leaves_to_copy refcursor;
   v_branch_row record;
   v_leave_row record;
   v_tran_id integer;
BEGIN

   IF p_ram_id_copy_from = 0 THEN RETURN; END IF;

   IF p_ram_id_copy_to = 0 THEN RETURN; END IF;

   IF NOT EXISTS(SELECT 1 FROM rama WHERE ram_id = p_ram_id_copy_from) THEN RETURN; END IF;

   IF NOT EXISTS(SELECT 1 FROM rama WHERE ram_id = p_ram_id_copy_to) THEN RETURN; END IF;

   --------------------------------------------------------------------

        CREATE TEMP TABLE t_rama_new
        (
          ram_id integer  NOT NULL,
          ram_id_new integer  NOT NULL,
          tran_id integer  NOT NULL
        ) on commit drop;

        v_tran_id := nextval('t_rama_new_seq');

   --------------------------------------------------------------------

   SELECT arb_id INTO v_arb_id FROM rama WHERE ram_id = p_ram_id_copy_to;

   IF p_solo_los_hijos <> 0 THEN
      v_incluir_ram_id_to_copy := 0;

   ELSE
      v_incluir_ram_id_to_copy := 1;

   END IF;

   SELECT INTO c_branches_to_copy t.rtn FROM SP_ArbGetDecendencia(p_ram_id_copy_from,v_incluir_ram_id_to_copy,0,0,0) t;

   LOOP
      FETCH c_branches_to_copy INTO v_branch_row;
      EXIT WHEN NOT FOUND;
      
      BEGIN

         v_ram_id := v_branch_row.ram_id;

         -- si esta es la rama principal de la copia, su padre tiene que ser la rama en la que estoy pegando
         IF v_ram_id = p_ram_id_copy_from THEN
            v_ram_id_padre := p_ram_id_copy_to;

         ELSE
         BEGIN
            -- Obtengo el padre de la rama que estoy copiando
            SELECT ram_id_padre INTO v_ram_id_padre FROM rama WHERE ram_id = v_ram_id;

            -- Si pedi copiar solo los hijos y la rama que estoy copiando es hija directa, 
            -- entonces su padre es la rama en la que estoy pegando
            IF p_solo_los_hijos <> 0 AND v_ram_id_padre = p_ram_id_copy_from THEN
            BEGIN
               v_ram_id_padre := p_ram_id_copy_to;

            END;
            ELSE
            BEGIN
               -- Obtengo el nuevo padre
               SELECT ram_id_new INTO v_ram_id_padre
               FROM rama 
               INNER JOIN t_rama_new
                    ON rama.ram_id = t_rama_new.ram_id
                        AND rama.ram_id = v_ram_id_padre
               WHERE tran_id = v_tran_id;
            END;
            END IF;

         END;
         END IF;

         SELECT SP_DBGetNewId('rama',
                              'ram_id',
                              0::smallint) INTO v_new_ram_id;

         INSERT INTO rama
           ( ram_id, ram_nombre, arb_id, modifico, ram_id_padre )
           ( SELECT v_new_ram_id,
                    ram_nombre,
                    v_arb_id,
                    p_us_id,
                    v_ram_id_padre
             FROM rama
                WHERE ram_id = v_ram_id );

         INSERT INTO t_rama_new ( ram_id, ram_id_new, tran_id ) VALUES ( v_ram_id, v_new_ram_id, v_tran_id );

         -- Creo un cursor para recorrer cada una de las hojas e insertarlas
         OPEN c_leaves_to_copy FOR SELECT hoja_id FROM Hoja WHERE ram_id = v_ram_id;

         LOOP
            FETCH c_leaves_to_copy INTO v_leave_row;
            EXIT WHEN NOT FOUND;
            BEGIN
               -- Por cada hoja obtengo un id nuevo
               SELECT SP_DBGetNewId('hoja',
                                    'hoja_id',
                                    0::smallint) INTO v_new_hoja_id;

               INSERT INTO hoja
                 ( hoja_id, id, modifico, ram_id, arb_id )
                 ( SELECT v_new_hoja_id,
                          id,
                          modifico,
                          v_new_ram_id,
                          v_arb_id
                   FROM Hoja
                      WHERE hoja_id = v_leave_row.hoja_id );

            END;
         END LOOP;

         CLOSE c_leaves_to_copy;

      END;
   END LOOP;

   CLOSE c_branches_to_copy;

   rtn := 'rtn';

   OPEN rtn FOR SELECT * FROM rama WHERE ram_id = p_ram_id_copy_to;

END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
ALTER FUNCTION sp_arbcopiarrama(integer, integer, integer, smallint)
  OWNER TO postgres;