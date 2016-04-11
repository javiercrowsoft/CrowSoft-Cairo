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
-- Function: table_exists()

-- drop function table_exists(varchar);

create or replace function table_exists
(
  in table_name varchar
)
returns pg_catalog.bool as
$BODY$
declare

begin

   -- check the table exist in database and is visible
   --
   perform n.nspname , c.relname
   from pg_catalog.pg_class c
   left join pg_catalog.pg_namespace n
     on n.oid = c.relnamespace
   where n.nspname like 'pg_temp_%' and pg_catalog.pg_table_is_visible(c.oid)
     and upper(relname) = upper(table_name);

   if found then
      return true;
   else
      return false;
   end if;

end;
$BODY$
  language plpgsql volatile
  cost 100;
alter function table_exists(varchar)
  owner to postgres;