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
-- Function: sp_arbcortarrama()

-- drop function sp_arbcortarrama();

create or replace function sp_arbcortarrama
(
  in p_us_id integer,
  in p_ram_id_cut_from integer ,
  in p_ram_id_to_paste_in integer ,
  in p_solo_los_hijos smallint ,
  out rtn refcursor
)
  returns refcursor as
$BODY$
declare
   v_arb_id integer;
   v_incluir_ram_id_to_copy integer;
   v_orden integer;

   c_branches_to_copy refcursor;
   v_branch_row record;
begin

   if p_ram_id_cut_from = 0 then RETURN; end if;

   if p_ram_id_to_paste_in = 0 then RETURN; end if;

   if not exists(select 1 from rama where ram_id = p_ram_id_cut_from) then RETURN; end if;

   if not exists(select 1 from rama where ram_id = p_ram_id_to_paste_in) then RETURN; end if;

   select arb_id into v_arb_id from rama where ram_id = p_ram_id_to_paste_in;

   if p_solo_los_hijos <> 0 then
      v_incluir_ram_id_to_copy := 0;

      select max(orden) into v_orden from rama where ram_id_padre = p_ram_id_to_paste_in;

      v_orden := coalesce(v_orden+1,0);

      update rama
                  set ram_id_padre = p_ram_id_to_paste_in, modifico = p_us_id, ram_orden = ram_orden + v_orden
                  where ram_id_padre = p_ram_id_cut_from;

   else
      v_incluir_ram_id_to_copy := 1;

      update rama
                  set ram_id_padre = p_ram_id_to_paste_in, modifico = p_us_id, ram_orden = ram_orden + v_orden
                  where ram_id = p_ram_id_cut_from;

   end if;

   if exists(select 1 from rama where ram_id = p_ram_id_cut_from and arb_id <> v_arb_id) then

       select into c_branches_to_copy t.rtn from SP_ArbGetDecendencia(p_ram_id_cut_from,v_incluir_ram_id_to_copy,0,0,0) t;

       loop
          fetch c_branches_to_copy into v_branch_row;
          exit when not found;

          update rama set arb_id = v_arb_id, modifico = p_us_id where rama.ram_id = v_branch_row.ram_id;
          update hoja set arb_id = v_arb_id, modifico = p_us_id where hoja.ram_id = v_branch_row.ram_id;

       end loop;

       close c_branches_to_copy;

   end if;

   rtn := 'rtn';

   open rtn for select * from rama where ram_id = p_ram_id_to_paste_in;

end;
$BODY$
  language plpgsql volatile
  cost 100;
alter function sp_arbcortarrama(integer, integer, integer, smallint)
  owner to postgres;