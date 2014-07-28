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
-- Function: sp_helpgetfilter()

-- DROP FUNCTION sp_helpgetfilter();

CREATE OR REPLACE FUNCTION sp_helpgetfilter(
  IN p_bFilterType integer ,
  IN p_filter varchar)
  RETURNS varchar AS
$BODY$
DECLARE
   
BEGIN

  --/////////////////////////////////////////////////////////////////////////////////////
  /*
  Public Const c_HelpFilterBeginLike = 1
  Public Const c_HelpFilterHaveTo = 2
  Public Const c_HelpFilterWildcard = 3
  Public Const c_HelpFilterEndLike = 4
  Public Const c_HelpFilterIsLike = 5
  */
  return CASE p_bFilterType
                 WHEN 1 THEN p_filter || '%'
                 WHEN 3 THEN REPLACE(p_filter, '*', '%')
                 WHEN 4 THEN '%' || p_filter
                 WHEN 5 THEN p_filter
                 -- Default
                 -- case 2 then '%' + @@filter + '%'
                 ELSE '%' || p_filter || '%'
         END;
   --/////////////////////////////////////////////////////////////////////////////////////
           
END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
ALTER FUNCTION sp_helpgetfilter(integer, varchar)
  OWNER TO postgres;