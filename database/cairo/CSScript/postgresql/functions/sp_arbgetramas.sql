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
-- Function: sp_arbgetramas(integer)

-- DROP FUNCTION sp_arbgetramas(integer);

CREATE OR REPLACE FUNCTION sp_arbgetramas(IN p_arb_id integer, OUT rtn refcursor)
  RETURNS refcursor AS
$BODY$
DECLARE
   -- para traer la raiz primero
   --select ram_id, ram_nombre, ram_id_padre from rama where arb_id = @@arb_id and ram_id <> 0 order by ram_id_padre
   v_raiz_id integer;
BEGIN
        SELECT ram_id
        INTO v_raiz_id
        FROM Rama
        WHERE arb_id = p_arb_id
        AND ram_id_padre = 0
        AND ram_id <> 0;

        rtn := 'rtn';

        select INTO rtn t.rtn from SP_ArbGetDecendencia(v_raiz_id,1,1,1,0) t;   

END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
ALTER FUNCTION sp_arbgetramas(integer)
  OWNER TO postgres;