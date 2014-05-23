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
-- Function: sp_arbisraiz(integer)

-- DROP FUNCTION sp_arbisraiz(integer);

CREATE OR REPLACE FUNCTION sp_arbisraiz(IN p_ram_id integer, OUT p_israiz smallint)
  RETURNS smallint AS
$BODY$
DECLARE
   v_temp integer := 0;
BEGIN

   BEGIN
      SELECT count(*) INTO v_temp
      FROM Rama
         WHERE ram_id = p_ram_id
                 AND ram_id_padre = 0;
   EXCEPTION
      WHEN OTHERS THEN
         NULL;
         raise info 'puto';
   END;

   -- Verifico que se trate de una raiz
   IF v_temp = 1 THEN
      p_IsRaiz := 1::smallint;

   ELSE
      p_IsRaiz := 0::smallint;

   END IF;

END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
ALTER FUNCTION sp_arbisraiz(integer)
  OWNER TO postgres;
