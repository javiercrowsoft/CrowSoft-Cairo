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
-- Function: instr()

-- drop function instr();

-- thanks to http://www.xzilla.net/blog/2006/Dec/sql-servers-instr-function-in-postgresql.html

create or replace function instr(
        text, 
        text, 
        integer default 0
) 
returns integer
as
$BODY$ 
        select case when strpos(substr($1, $3+1), $2) = 0 then 0 else strpos(substr($1, $3+1), $2) + $3
end;
$BODY$
  language SQL IMMUTABLE returns null on null INPUT;
alter function instr(text, text, integer)
  owner to postgres;