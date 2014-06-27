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
-- Function: sp_arb_hoja_paste_copy()

-- DROP FUNCTION sp_arb_hoja_paste_copy();

CREATE OR REPLACE FUNCTION sp_arb_hoja_paste_copy
(
  IN p_us_id integer,
  IN p_ids varchar ,
  IN p_ram_id_copy_to integer ,
  OUT rtn refcursor
)
  RETURNS refcursor AS
$BODY$
DECLARE
   v_new_hoja_id integer;
   v_arb_id integer;

   c_leaves_to_copy refcursor;
   v_leave_row record;

   v_ids   varchar[];
   v_id    varchar;
   v_index integer;
BEGIN

    IF p_ids = '' THEN RETURN; END IF;

    IF p_ram_id_copy_to = 0 THEN RETURN; END IF;

    IF NOT EXISTS(SELECT 1 FROM rama WHERE ram_id = p_ram_id_copy_to) THEN RETURN; END IF;

    SELECT arb_id INTO v_arb_id FROM rama WHERE ram_id = p_ram_id_copy_to;


    -- Creo un cursor para recorrer cada una de las hojas e insertarlas
    OPEN c_leaves_to_copy FOR EXECUTE 'SELECT hoja_id, id, modifico FROM Hoja WHERE hoja_id in (' || p_ids ||')';

    LOOP
        FETCH c_leaves_to_copy INTO v_leave_row;
        EXIT WHEN NOT FOUND;
        BEGIN

           IF NOT EXISTS(SELECT 1 FROM hoja WHERE ram_id = p_ram_id_copy_to AND id = v_leave_row.id) THEN

               -- Por cada hoja obtengo un id nuevo
               SELECT SP_DBGetNewId('hoja',
                                    'hoja_id',
                                    0::smallint) INTO v_new_hoja_id;

               INSERT INTO hoja ( hoja_id, id, modifico, ram_id, arb_id )
               VALUES ( v_new_hoja_id, v_leave_row.id, v_leave_row.modifico, p_ram_id_copy_to, v_arb_id );

           END IF;
        END;
    END LOOP;

    CLOSE c_leaves_to_copy;

    v_ids := regexp_split_to_array(p_ids, ',');

    FOR v_index IN 1 .. array_upper(v_ids, 1)
    LOOP

        v_id := v_ids[v_index];

        IF v_id::integer < 0 THEN

            -- Por cada hoja obtengo un id nuevo
            SELECT SP_DBGetNewId('hoja',
                                 'hoja_id',
                                 0::smallint) INTO v_new_hoja_id;

            INSERT INTO hoja ( hoja_id, id, modifico, ram_id, arb_id )
            VALUES ( v_new_hoja_id, v_id::integer * -1, p_us_id, p_ram_id_copy_to, v_arb_id );

        END IF;
    END LOOP;

    rtn := 'rtn';

    OPEN rtn FOR SELECT * FROM rama WHERE ram_id = p_ram_id_copy_to;

END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
ALTER FUNCTION sp_arb_hoja_paste_copy(integer, varchar, integer)
  OWNER TO postgres;