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
-- Function: sp_sys_language_update()

-- DROP FUNCTION sp_sys_language_update();

CREATE OR REPLACE FUNCTION sp_sys_language_update()
  RETURNS void AS
$BODY$
DECLARE
   cur refcursor;
   v_row record;
BEGIN

   SET TRANSACTION READ WRITE;

   delete from sysLanguage;

   OPEN cur FOR SELECT leng_id FROM lenguaje;
   LOOP
          FETCH cur INTO v_row;
          EXIT WHEN NOT FOUND;

          perform sp_sys_language_update(v_row.leng_id);
          
   END LOOP;
   CLOSE cur;

END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
ALTER FUNCTION sp_sys_language_update()
  OWNER TO postgres;


-- Function: sp_sys_language_update(int)

-- DROP FUNCTION sp_sys_language_update(int);

CREATE OR REPLACE FUNCTION sp_sys_language_update(IN p_leng_id integer)
  RETURNS void AS
$BODY$
DECLARE
   cur refcursor;
   v_row record;
   v_text varchar(5000);
BEGIN

   SET TRANSACTION READ WRITE;

   OPEN cur FOR SELECT distinct(lengi_codigo) FROM lenguajeItem;
   LOOP
          FETCH cur INTO v_row;
          EXIT WHEN NOT FOUND;

          v_text := sp_leng_get_text_aux(v_row.lengi_codigo, p_leng_id);

          if v_text <> '' then

            INSERT INTO sysLanguage (leng_id, sysl_code, sysl_text) values(p_leng_id, v_row.lengi_codigo, v_text);
          else
            RAISE NOTICE 'CODE NOT FOUND: %', v_row.lengi_codigo;
          end if;

   END LOOP;
   CLOSE cur;

END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
ALTER FUNCTION sp_sys_language_update()
  OWNER TO postgres;
