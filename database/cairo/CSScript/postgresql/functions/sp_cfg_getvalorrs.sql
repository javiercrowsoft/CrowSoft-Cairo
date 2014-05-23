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
﻿-- Function: sp_cfg_getvalorrs(character varying, character varying, smallint, integer)

-- DROP FUNCTION sp_cfg_getvalorrs(character varying, character varying, smallint, integer);

CREATE OR REPLACE FUNCTION sp_cfg_getvalorrs(IN p_cfg_grupo character varying, IN p_cfg_aspecto character varying, OUT p_cfg_valor character varying, IN p_bshow smallint, IN p_emp_id integer, OUT rtn refcursor)
  RETURNS record AS
$BODY$
BEGIN

   SELECT cfg_valor
     INTO p_cfg_valor
     FROM Configuracion
      WHERE cfg_grupo = p_cfg_grupo
              AND cfg_aspecto = p_cfg_aspecto
              AND ( emp_id = p_emp_id
              OR ( emp_id IS NULL
              AND p_emp_id IS NULL ) );

   IF p_bShow <> 0 THEN
      OPEN rtn FOR
         SELECT p_cfg_valor
           FROM DUAL ;

   END IF;

END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
ALTER FUNCTION sp_cfg_getvalorrs(character varying, character varying, smallint, integer)
  OWNER TO postgres;
