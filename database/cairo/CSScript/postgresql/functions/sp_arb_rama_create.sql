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
-- Function: sp_arb_rama_create()

-- DROP FUNCTION sp_arb_rama_create();

CREATE OR REPLACE FUNCTION sp_arb_rama_create(
  IN p_us_id integer,
  IN p_arb_id integer,
  IN p_ram_id_padre integer ,
  IN p_nombre varchar ,
  OUT rtn refcursor
)
  RETURNS refcursor AS
$BODY$
DECLARE
        v_ram_id integer;
        v_is_temp boolean;
        v_max integer;
        v_orden integer;
        v_arb_id integer;
BEGIN

        SELECT SP_DBGetNewId('rama',
                              'ram_id',
                              0::smallint) into v_ram_id;

        v_is_temp := p_ram_id_padre = -1000;
    
        /*
        ' - Si es una rama temporal la agrego como una raiz
        '   y despues le asigno como padre
        '   su propio ID para que quede huerfana
        */
        IF v_is_temp THEN
                p_ram_id_padre = 0;
                v_orden := 0;
        /*
        ' - Si no obtengo el numero de orden que le corresponde
        '   dentro del padre
        '
        */
        ELSE
                SELECT max(ram_orden) INTO v_max FROM rama WHERE ram_id_padre = p_ram_id_padre;
                IF v_max IS NULL THEN
                        v_orden := 1;                        
                ELSE
                        v_orden := v_max + 1;                        
                END IF;

                SELECT arb_id INTO p_arb_id FROM rama where ram_id_padre = p_ram_id_padre;                
        END IF;        

        INSERT INTO rama (ram_id, ram_nombre, ram_id_padre, ram_orden, arb_id, modifico)
        VALUES (v_ram_id, p_nombre, p_ram_id_padre, v_orden, p_arb_id, p_us_id);

        rtn := 'rtn';

        open rtn for SELECT * FROM rama WHERE ram_id = v_ram_id;
   
END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
ALTER FUNCTION sp_arb_rama_create(integer, integer, integer, varchar)
  OWNER TO postgres;