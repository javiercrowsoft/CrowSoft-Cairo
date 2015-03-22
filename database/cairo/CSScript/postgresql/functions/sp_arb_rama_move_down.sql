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
-- Function: sp_arb_rama_move_down()

-- drop function sp_arb_rama_move_down(int, int);

create or replace function sp_arb_rama_move_down(
  in p_us_id integer,
  in p_ram_id integer,
  out rtn refcursor
)
  returns refcursor as
$BODY$
declare
   v_last integer;
   v_ram_orden integer;
begin

   if not exists(select 1 from rama where ram_id = p_ram_id) then RETURN; end if;

   select max(ram_orden) into v_last from rama where ram_id_padre = (select ram_id_padre from rama where ram_id = p_ram_id);

   set TRANSACTION READ WRITE;

   if p_ram_id = 0 then RETURN; end if;

   select ram_orden into v_ram_orden from rama where ram_id = p_ram_id;

   if v_ram_orden = v_last then RETURN; end if;

   update rama
    set ram_orden = ram_orden - 1
   where ram_id_padre = (select ram_id_padre from rama where ram_id = p_ram_id)
    and ram_orden = v_ram_orden + 1;

   update rama set ram_orden = ram_orden +1 where ram_id = p_ram_id;

   rtn := 'rtn';

   open rtn for select * from rama where ram_id = p_ram_id;

end;
$BODY$
  language plpgsql volatile
  COST 100;
alter function sp_arb_rama_move_down(integer, integer)
  owner to postgres;