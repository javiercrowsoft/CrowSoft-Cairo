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
MERCHANTABILITY or FITNESS for A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License along
with this program; if not, write to the Free Software Foundation, Inc.,
51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.

========================================================================

Created by Javier

http://www.crowsoft.com.ar

javier at crowsoft.com.ar
*/
-- Function: sp_strgetrealname()

-- drop function sp_strgetrealname();

create or replace function sp_strgetrealname
(
  in p_prefix varchar,
  in p_campo varchar
)
returns varchar as
$BODY$
declare
   v_j integer;
begin

   v_j := coalesce(strpos(p_campo, '='), 0);

   if v_j = 0 then
      p_campo := p_prefix || '.' || p_campo;

   else
      p_campo := SUBSTR(p_campo, 1, v_j) || p_prefix || '.' || LTRIM(SUBSTR(p_campo, v_j + 1, LENGTH(p_campo)));

   end if;

   return p_campo;

end;
$BODY$
  language plpgsql volatile
  cost 100;
alter function sp_strgetrealname(varchar, varchar)
  owner to postgres;