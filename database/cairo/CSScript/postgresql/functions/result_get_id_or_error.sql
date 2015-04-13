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
-- Function: result_get_id_or_error()

-- drop function result_get_id_or_error(integer, varchar);

create or replace function result_get_id_or_error (
  in rslt row_result,
  in p_id_name varchar,
  out p_id integer,
  out p_success integer,
  out p_error_msg varchar
)
  returns record as
$BODY$
begin

   if rslt.type = 'ERROR' then
      p_error_msg := '@@ERROR_SP:' || rslt.message;
      p_success := 0
      exit;
   else
      if rslt.type = p_id_name then
         p_id = rslt.id;
         p_success := 1;
         exit;
      end if;
   end if;

end;
$BODY$
  language plpgsql volatile
  cost 100;
alter function result_get_id_or_error(row_result, varchar)
  owner to postgres;