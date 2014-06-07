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
-- Function: sp_arbgetdecendencia()

-- DROP FUNCTION sp_arbgetdecendencia();

CREATE OR REPLACE FUNCTION sp_arbgetdecendencia(
        IN p_ram_id integer DEFAULT NULL ,
        IN p_incluir_ram_id integer DEFAULT 1 ,
        IN p_incluir_ram_id_padre integer DEFAULT 0 , -- este default es necesario para: SP_ArbCopiarRama, SP_ArbBorrarRama
        IN p_incluir_nombre integer DEFAULT 0 ,       -- este default es necesario para: SP_ArbCopiarRama, SP_ArbBorrarRama
        IN p_incluir_arb_id integer DEFAULT 0,
        OUT rtn refcursor)
  RETURNS refcursor AS
$BODY$
DECLARE
   v_tot2 integer;
   v_tot1 integer;
   v_n integer;
   v_arb_id integer;
   v_sqlstmt varchar(255);
   v_where varchar(50);
   v_sqlArbId varchar(50);
   v_tran_id integer;
BEGIN

        IF p_ram_id = 0 THEN
                RETURN;
        END IF;

        CREATE TEMP TABLE tt_t_rama2
        (
          tran_id integer NOT NULL,
          ram_id integer  NOT NULL,
          N integer  NOT NULL,
          ram_id_padre integer  NOT NULL,
          arb_id integer  NOT NULL,
          orden integer  NOT NULL
        ) on commit drop;

        v_tran_id := nextval('t_rama2_seq');

        v_tot1 := -1;

        v_tot2 := 0;

        v_n := 1;

        IF p_incluir_arb_id <> 0 THEN
                SELECT arb_id
                INTO v_arb_id
                FROM Rama
                WHERE ram_id = p_ram_id;
        ELSE
                v_arb_id := 0;
        END IF;

        INSERT INTO tt_t_rama2
        (tran_id, ram_id, N, ram_id_padre, arb_id, orden)
        (SELECT v_tran_id,
                p_ram_id,
                0,
                ram_id_padre,
                v_arb_id,
                ram_orden
        FROM Rama
        WHERE ram_id = p_ram_id );

   WHILE v_tot1 < v_tot2
   LOOP
      BEGIN
         v_tot1 := v_tot2;

         INSERT INTO tt_t_rama2
           ( tran_id, ram_id, N, ram_id_padre, arb_id, orden )
           SELECT v_tran_id,
                  r.ram_id,
                  v_n,
                  r.ram_id_padre,
                  v_arb_id,
                  r.ram_orden
             FROM Rama r,
                  tt_t_rama2 t
              WHERE r.ram_id_padre = t.ram_id
                      AND t.tran_id = v_tran_id
                      AND t.N = v_n - 1
                      -- esto chequea que no existan referencias circulares
                      AND NOT EXISTS ( SELECT *
                                       FROM tt_t_rama2
                                          WHERE tt_t_rama2.ram_id = r.ram_id and tt_t_rama2.tran_id = v_tran_id )
             ORDER BY r.ram_orden;

         SELECT COUNT(*) INTO v_tot2
         FROM tt_t_rama2 t WHERE t.tran_id = v_tran_id;

         v_n := v_n + 1;

      END;
   END LOOP;

   v_where := ' where t.tran_id = ' || v_tran_id::varchar;

   IF p_incluir_ram_id = 0 THEN
      v_where := ' and t.ram_id <> ' || to_char(p_ram_id);
   END IF;

   IF p_incluir_arb_id <> 0 THEN
      v_sqlArbId := ',t.arb_id';

   ELSE
      v_sqlArbId := '';

   END IF;

   IF p_incluir_ram_id_padre <> 0 THEN
   BEGIN
      IF p_incluir_nombre <> 0 THEN
         v_sqlstmt := 'select t.ram_id,t.ram_id_padre,r.ram_nombre' || v_sqlArbId || ' from tt_t_rama2 t inner join rama r on t.ram_id = r.ram_id';

      ELSE
         v_sqlstmt := 'select ram_id,ram_id_padre' || v_sqlArbId || ' from tt_t_rama2 t';

      END IF;

   END;
   ELSE
   BEGIN
      IF p_incluir_nombre <> 0 THEN
         v_sqlstmt := 'select t.ram_id,r.ram_nombre' || v_sqlArbId || ' from tt_t_rama2 t inner join rama r on t.ram_id = r.ram_id';

      ELSE
         v_sqlstmt := 'select ram_id' || v_sqlArbId || ' from tt_t_rama2 t';

      END IF;

   END;
   END IF;

   v_sqlstmt := v_sqlstmt || v_where || ' order by n,orden';

   rtn := 'rtn';

   open rtn for execute v_sqlstmt;        

END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
ALTER FUNCTION sp_arbgetdecendencia(integer, integer, integer, integer, integer)
  OWNER TO postgres;