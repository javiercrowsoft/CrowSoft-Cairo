/*
CrowSoft-Cairo
==============

ERP application written in Java (Tomcat + GWT) and Postgresql

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
-- Function: isnumeric(character varying)

-- DROP FUNCTION isnumeric(character varying);

CREATE OR REPLACE FUNCTION isnumeric(param character varying)
  RETURNS smallint AS
$BODY$
begin
	if (param ~ E'^[-+]?\\d*\\.?\\d+(?:[eE][-+]?\\d+)?$') then
		return -1;
	else
		return 0;
	end if;
end;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
ALTER FUNCTION isnumeric(character varying)
  OWNER TO postgres;
