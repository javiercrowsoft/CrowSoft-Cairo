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
-- Function: sp_arb_rama_orden_validate()

-- drop function sp_arb_rama_orden_validate(int, int);

create or replace function sp_arb_rama_orden_validate(
  in p_us_id integer
)
  returns void as
$BODY$
declare
   v_orden integer;
   c1 refcursor;
   c2 refcursor;
   v_row record;
   v_row2 record;
begin

   set TRANSACTION READ WRITE;

   open c1 for select ram_id from rama where ram_id <> 0;
   loop
          fetch c1 into v_row;
          exit when not found;

          v_orden := 0;

          open c2 for select ram_id from rama where ram_id_padre = v_row.ram_id order by ram_orden;
          loop

                fetch c2 into v_row2;
                exit when not found;

                update rama set ram_orden = v_orden where ram_id = v_row2.ram_id;
                v_orden := v_orden +1;

          end loop;
          close c2;

   end loop;
   close c1;

end;
$BODY$
  language plpgsql volatile
  cost 100;
alter function sp_arb_rama_orden_validate(integer)
  owner to postgres;
