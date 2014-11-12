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
-- Function: sp_leng_get_text_aux()

-- DROP FUNCTION sp_leng_get_text_aux();

CREATE OR REPLACE FUNCTION sp_leng_get_text_aux
(
  IN p_code varchar DEFAULT NULL ,
  IN p_leng_id integer DEFAULT NULL
) RETURNS varchar AS
$BODY$
DECLARE
   v_leng_id integer;
   v_rtn varchar(5000);
BEGIN

   v_leng_id := p_leng_id;

   SELECT lengi_texto
     INTO v_rtn
     FROM LenguajeItem
      WHERE leng_id = v_leng_id
              AND lengi_codigo = p_code;

   -- if this language doesn't contain a definition for this code
   -- and the language is not the main language ( Spanish )
   -- we use the parent language
   --
   IF coalesce(v_rtn, '') = '' and v_leng_id <> 1 THEN

      SELECT leng_id_padre
        INTO v_leng_id
        FROM Lenguaje
         WHERE leng_id = v_leng_id;

      -- if the language doesn't have a parent
      -- we use 1 which is ( Spanish )
      --
      v_leng_id := coalesce(v_leng_id, 1);

      v_rtn := sp_leng_get_text_aux(p_code, v_leng_id);

   END IF;

   return v_rtn;

END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
ALTER FUNCTION sp_leng_get_text_aux(varchar, integer)
  OWNER TO postgres;