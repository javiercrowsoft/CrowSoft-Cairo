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
-- Function: sp_arb_arbol_sort()

-- drop function sp_arb_arbol_sort(int, int);

create or replace function sp_arb_arbol_sort(
  in p_us_id integer,
  in p_arb_id integer,
  in p_desc integer,
  out rtn refcursor
)
  returns refcursor as
$BODY$
declare
   c_arbol refcursor;
   v_row record;
   v_ram_id integer;
   v_ram_id_padre integer;
   v_last_ram_id_padre integer;
   v_orden integer;
   v_sqlstmt varchar(1000);
begin

   v_last_ram_id_padre := -1;

   v_sqlstmt := 'select ram_id, ram_id_padre from Rama where arb_id = ' || p_arb_id::varchar || ' order by ram_id_padre, ram_nombre';

   if p_desc <> 0 then
     v_sqlstmt := v_sqlstmt || ' desc';
   end if;

   open c_arbol for EXECUTE v_sqlstmt;

   loop
      fetch c_arbol into v_row;
      exit when not found;

      v_ram_id := v_row.ram_id;
      v_ram_id_padre := v_row.ram_id_padre;

      if v_ram_id_padre <> v_last_ram_id_padre then
        v_last_ram_id_padre := v_ram_id_padre;

        v_orden := 0;

      end if;

      v_orden := v_orden + 1;

      update rama set ram_orden = v_orden where ram_id = v_ram_id;

   end loop;

   close c_arbol;

   rtn := 'rtn';

   open rtn for select * from rama where ram_id = (select ram_id from rama where arb_id = p_arb_id and ram_id_padre = 0);

end;
$BODY$
  language plpgsql volatile
  COST 100;
alter function sp_arb_arbol_sort(integer, integer, integer)
  owner to postgres;