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
-- Function: is_error(varchar)

-- DROP FUNCTION is_error(varchar);

create or replace function is_error(in p_error_code varchar) 
returns boolean as
$body$
declare
v_error varchar;
begin

          v_error := substring(p_error_code, 1, 2);

          return v_error not in ('00','01','02');

end;
$body$
  LANGUAGE plpgsql VOLATILE
  COST 100;
ALTER FUNCTION is_error(varchar)
  OWNER TO postgres;