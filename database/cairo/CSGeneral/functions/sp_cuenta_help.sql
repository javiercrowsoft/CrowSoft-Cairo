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
-- Function: sp_cuentahelp()

-- DROP FUNCTION sp_cuentahelp(integer, integer, integer, varchar, integer, integer, varchar);

CREATE OR REPLACE FUNCTION sp_cuentahelp
(
  IN p_emp_id integer ,
  IN p_us_id integer ,
  IN p_bForAbm integer ,
  IN p_filter varchar DEFAULT '' ,
  IN p_check integer DEFAULT 0 ,
  IN p_cue_id integer DEFAULT 0 ,
  IN p_filter2 varchar DEFAULT '', 
  out rtn refcursor
)
  RETURNS refcursor AS
$BODY$
BEGIN
   
      rtn := sp_cuentaHelpCliente(p_emp_id,
                       p_us_id,
                       p_bForAbm,
                       p_filter,
                       p_check,
                       p_cue_id,
                       p_filter2);        
END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
ALTER FUNCTION sp_cuentahelp(integer, integer, integer, varchar, integer, integer, varchar)
  OWNER TO postgres;