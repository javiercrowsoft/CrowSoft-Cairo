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
-- Function: sp_strreplaceequalswithas()

-- DROP FUNCTION sp_strreplaceequalswithas();

CREATE OR REPLACE FUNCTION sp_strreplaceequalswithas(p_campos character varying)
  RETURNS character varying AS
$BODY$
DECLARE
   v_retval varchar(5000);
   v_campo varchar(5000);
   v_caracter varchar(1);
   v_i integer;
   v_j integer;
   v_z integer;
   v_q integer;
   v_r integer;
   v_t integer;
   v_p integer;
   v_n integer;
   v_work_done boolean;
BEGIN

   v_i := 1;

   v_j := 0;

   v_p := 0;

   v_z := 0;

   v_retval := '';

   v_work_done := false;

   -- si no hay campos tampoco
   IF p_campos IS NULL
     OR p_campos IS NULL THEN
      RETURN '';

   END IF;

   --------------------------------------------
   v_j := coalesce(INSTR(p_campos, ',', v_j + 1), 0);

   v_z := coalesce(INSTR(p_campos, '(', v_z + 1), 0);

   --------------------------------------------
   IF v_j = 0 THEN
   BEGIN
      IF v_i < v_z THEN
      BEGIN
         v_retval := LTRIM(p_campos);

         v_i := INSTR(v_retval, '=', 1);

         IF v_i < v_z AND v_i <> 0 THEN
         BEGIN
                v_retval := SUBSTR(v_retval, v_i +1) || ' AS ' || SUBSTR(v_retval, 1, v_i -1);
         END;
         END IF;

      END;
      ELSE
         v_i := INSTR(v_retval, '=', 1);

         IF v_i <> 0 THEN
         BEGIN
                v_retval := SUBSTR(v_retval, v_i +1) || ' AS ' || SUBSTR(v_retval, 1, v_i -1);
         
         END;
         END IF;

      END IF;

   END;
   ELSE
   BEGIN
      WHILE v_j <> 0
      LOOP
         BEGIN
            -- si hay un parentesis es por que hay un subselect, en cuyo caso no toco nada que este en
            -- el parentesis
            IF v_i < v_z
              AND v_z < v_j THEN
            BEGIN
               --leeo caracter por caracter hasta encontrar el cierre del parentesis
               v_r := LENGTH(p_campos) + 1;

               v_t := v_z;

               WHILE v_t < v_r
               LOOP
                  BEGIN
                     v_caracter := SUBSTR(p_campos, v_t, 1);

                     -- si encuentro un parentesis abierto, incremento un contador para buscar uno cerrado
                     IF v_caracter = '(' THEN
                        v_p := v_p + 1;

                     END IF;

                     IF v_caracter = ')' THEN
                     BEGIN
                        v_p := v_p - 1;
                     
                        -- si encontre el cierre del primer parentesis termine con este campo
                        IF v_p = 0 THEN
                           EXIT;
                           
                        END IF;

                     END;
                     END IF;

                     v_t := v_t + 1;

                  END;
               END LOOP;

               -- ahora busco una coma a partir del ultimo parentesis
               v_j := INSTR(p_campos, ',', v_t);

               -- si la encuentro agrego el campo tal como esta a la sentencia
               IF v_j > 0 THEN
               BEGIN
                  v_campo := LTRIM(SUBSTR(p_campos, v_i, v_j - v_i));

                  v_n := INSTR(v_campo, '=', 1);

                  IF v_n < v_z AND v_n <> 0 THEN
                  BEGIN
                        v_campo := SUBSTR(v_campo, v_n +1) || ' AS ' || SUBSTR(v_campo, 1, v_n -1) || ',';
                  END;
                  END IF;
         
                  v_retval := v_retval || v_campo;

                  -- me preparo para buscar la proxima coma
                  v_i := v_j + 1;

                  v_j := INSTR(p_campos, ',', v_j + 1);

                  v_z := INSTR(p_campos, '(', v_i + 1);

               END;
               -- si no encuentro la coma es porque se terminaron los campos, asi que
               -- agrego el campo a la sentencia y termine
               ELSE
               BEGIN
                  v_campo := LTRIM(SUBSTR(p_campos, v_i, LENGTH(p_campos)));

                  v_n := INSTR(v_campo, '=', 1);

                  IF v_n < v_z AND v_n <> 0 THEN
                  BEGIN
                        v_campo := SUBSTR(v_campo, v_n +1) || ' AS ' || SUBSTR(v_campo, 1, v_n -1);
                  END;
                  END IF;

                  v_retval := v_retval || v_campo;

                  -- con esto voy al final
                  v_work_done:= true;
                  EXIT;

               END;
               END IF;

            END;
            ELSE
            BEGIN
               v_campo := LTRIM(SUBSTR(p_campos, v_i, v_j - v_i));

               v_n := INSTR(v_campo, '=', 1);

               IF v_n <> 0 THEN
               BEGIN
                   v_campo := SUBSTR(v_campo, v_n +1) || ' AS ' || SUBSTR(v_campo, 1, v_n -1) || ',';
               END;
               END IF;

               v_retval := v_retval || v_campo;

               v_i := v_j + 1;

               v_j := INSTR(p_campos, ',', v_j + 1);

               -- busco el proximo parentesis
               v_z := INSTR(p_campos, '(', v_i + 1);

            END;
            END IF;

         END;
      END LOOP;
      IF NOT v_work_done THEN
        BEGIN
              IF v_i < v_z THEN
              BEGIN
                 --leeo caracter por caracter hasta encontrar el cierre del parentesis
                 v_r := LENGTH(p_campos) + 1;

                 v_t := v_z;

                 WHILE v_t < v_r
                 LOOP
                    BEGIN
                       v_caracter := SUBSTR(p_campos, v_t, 1);

                       -- si encuentro un parentesis abierto, incremento un contador para buscar uno cerrado
                       IF v_caracter = '(' THEN
                          v_p := v_p + 1;

                       END IF;

                       IF v_caracter = ')' THEN
                       BEGIN
                          v_p := v_p - 1;
                          
                          -- si encontre el cierre del primer parentesis termine con este campo
                          IF v_p = 0 THEN
                             EXIT;

                          END IF;

                       END;
                       END IF;

                       v_t := v_t + 1;

                    END;
                 END LOOP;

                 v_campo := LTRIM(SUBSTR(p_campos, v_i, LENGTH(p_campos)));

                 v_n := INSTR(v_campo, '=', 1);

                 IF v_n < v_z AND v_n <> 0 THEN
                 BEGIN
                        v_campo := SUBSTR(v_campo, v_n +1) || ' AS ' || SUBSTR(v_campo, 1, v_n -1);
                 END;
                 END IF;                 

                 v_retval := v_retval || v_campo;

              END;
              ELSE
              BEGIN
                 v_campo := LTRIM(SUBSTR(p_campos, v_i, LENGTH(p_campos)));

                 v_n := INSTR(v_campo, '=', 1);

                 IF v_n <> 0 THEN
                 BEGIN
                        v_campo := SUBSTR(v_campo, v_n +1) || ' AS ' || SUBSTR(v_campo, 1, v_n -1);
                 END;
                 END IF;

                 v_retval := v_retval || v_campo;

              END;
              END IF;
        END;
      END IF;
   END;
   END IF;

   return v_retval;
   
END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
ALTER FUNCTION sp_strreplaceequalswithas(character varying)
  OWNER TO postgres;