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
-- Function: sp_leng_get_text()

-- DROP FUNCTION sp_leng_get_text();

CREATE OR REPLACE FUNCTION sp_leng_get_text
(
  IN p_code varchar,
  IN p_us_id integer,
  OUT rtn refcursor
)
  RETURNS refcursor AS
$BODY$
DECLARE
   v_leng_id integer;
   v_rtn varchar(5000);
BEGIN

   v_rtn := '';

   SELECT cfg_valor::integer
     INTO v_leng_id
     FROM Configuracion
      WHERE cfg_grupo = 'Usuario-Config'
        AND cfg_aspecto = 'Lenguaje Gral_' || p_us_id::varchar;

   IF coalesce(v_leng_id, 0) = 0 THEN
   BEGIN
      SELECT cfg_valor::integer
        INTO v_leng_id
        FROM Configuracion
         WHERE cfg_grupo = 'general'
           AND cfg_aspecto = 'lenguaje';

   END;
   END IF;

   IF coalesce(v_leng_id, 0) = 0 THEN
      v_leng_id := 1;-- CrowSoft default language (Castellano)
   END IF;

   IF coalesce(v_leng_id, 0) <> 0 THEN
   BEGIN

      SELECT lengi_texto
        INTO v_rtn
        FROM LenguajeItem
         WHERE leng_id = v_leng_id
           AND lengi_codigo = p_code;

      -- Si no lo encuentro veo si el lenguaje tiene un lenguaje padre
      IF coalesce(v_rtn, '') = '' THEN
      BEGIN
         -- Busco el lenguaje tiene un lenguaje padre
         SELECT leng_id_padre
           INTO v_leng_id
           FROM Lenguaje
            WHERE leng_id = v_leng_id;

         -- Si hay un lenguaje padre le pido que me traiga el texto
         IF coalesce(v_leng_id, 0) <> 0 THEN
         BEGIN
            v_rtn := sp_leng_get_text_aux(p_code, v_leng_id);

         END;
         END IF;

      END;
      END IF;

   END;
   END IF;

   rtn := 'rtn';

   OPEN rtn FOR SELECT v_rtn;

END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
ALTER FUNCTION sp_leng_get_text(varchar, integer)
  OWNER TO postgres;