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
-- Function: sp_codigopostalhelp()

-- DROP FUNCTION sp_codigopostalhelp();

CREATE OR REPLACE FUNCTION sp_codigopostalhelp(
  IN p_emp_id integer ,
  IN p_us_id integer ,
  IN p_bForAbm integer ,
  IN p_bFilterType integer ,
  IN p_filter varchar DEFAULT '' ,
  IN p_check integer DEFAULT 0 ,
  IN ip_cpa_id integer DEFAULT 0 ,
  IN v_p_filter2 varchar DEFAULT '', 
  out rtn refcursor)
  RETURNS refcursor AS
$BODY$
DECLARE
   p_cpa_id integer := ip_cpa_id;
   v_altura integer;
   v_n integer;
   v_s varchar(50);
   v_filter varchar(255);
   v_p_filter varchar(2000);
BEGIN

   v_p_filter := p_filter;
   v_altura := 0;

   v_n := LENGTH(v_p_filter);

   WHILE v_n > 0
   LOOP
      BEGIN
         IF SUBSTR(v_p_filter, v_n, 1) = ' ' THEN
         BEGIN
            v_s := SUBSTR(v_p_filter, v_n, 50);

            IF isnumeric(v_s) <> 0 THEN
            BEGIN
               v_altura := to_number(v_s);

               v_p_filter := SUBSTR(v_p_filter, 1, v_n - 1);

            END;
            END IF;

            v_n := 0;

         END;
         END IF;

         v_n := v_n - 1;

      END;
   END LOOP;

   v_filter := LOWER(v_p_filter);

   v_filter := sp_HelpGetFilter(p_bFilterType, v_filter);

   --/////////////////////////////////////////////////////////////////////////////////////
   IF p_check <> 0 THEN
   BEGIN
      IF p_cpa_id < 0 THEN
      BEGIN
         SELECT cpa_id
           INTO p_cpa_id
           FROM CodigoPostalItem
            WHERE cpai_id = p_cpa_id * -1;

      END;
      END IF;

      OPEN rtn FOR
         SELECT cpa_id,
                cpa_codigo Nombre,
                cpa_codigo Codigo
           FROM CodigoPostal cpa
            WHERE ( cpa_codigo = v_p_filter )
                    AND ( cpa_id = p_cpa_id
                    OR p_cpa_id = 0 )
                    AND ( p_bForAbm <> 0
                    OR cpa.activo <> 0 );

   END;
   ELSE
   BEGIN
   
      rtn := 'rtn';        
      open rtn for  

         SELECT -cpai.cpai_id cpa_id,
                cpa.cpa_codigo Codigo_Postal,
                CASE cpai.cpai_tipo
                    WHEN 1 THEN cpai.cpai_calle
                    ELSE cpai.cpai_localidad
                END Calle_Localidad,
                cpai.cpai_desde Desde,
                cpai.cpai_hasta Hasta,
                pro.pro_nombre Provincia
           FROM CodigoPostal cpa
                  JOIN CodigoPostalItem cpai
                   ON cpa.cpa_id = cpai.cpa_id
                  JOIN Provincia pro
                   ON cpa.pro_id = pro.pro_id
            WHERE ( cpa.cpa_codigo LIKE v_filter
                    OR ( lower(f_unaccent(cpai.cpai_calle)) LIKE v_filter
                    AND cpai.cpai_tipo = 1 )
                    OR ( lower(f_unaccent(cpai.cpai_localidad)) LIKE v_filter
                    AND cpai.cpai_tipo = 2 )
                    OR v_p_filter IS NULL )
                    AND ( ( cpai.cpai_desde <= v_altura
                    AND cpai.cpai_hasta >= v_altura )
                    OR v_altura = 0 )
                    AND ( p_bForAbm <> 0
                    OR cpa.activo <> 0 ) 
           LIMIT 50;

   END;
   END IF;
        
END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
ALTER FUNCTION sp_codigopostalhelp(integer, integer, integer, integer, varchar, integer, integer, varchar)
  OWNER TO postgres;