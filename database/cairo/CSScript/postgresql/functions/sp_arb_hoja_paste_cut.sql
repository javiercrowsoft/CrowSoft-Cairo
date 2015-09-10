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
-- Function: sp_arb_hoja_paste_cut()

-- drop function sp_arb_hoja_paste_cut();

create or replace function sp_arb_hoja_paste_cut
(
  in p_us_id integer,
  in p_ids varchar,
  in p_ram_id_to_paste_in integer,
  out rtn refcursor
)
  returns refcursor as
$BODY$
declare
   v_new_hoja_id integer;
   v_arb_id integer;

   c_leaves_to_copy refcursor;
   v_leave_row record;

   v_ids   varchar[];
   v_id    varchar;
   v_index integer;
begin

    if p_ids = '' then RETURN; end if;

    if p_ram_id_to_paste_in = 0 then RETURN; end if;

    if not exists(select 1 from rama where ram_id = p_ram_id_to_paste_in) then RETURN; end if;

    select arb_id into v_arb_id from rama where ram_id = p_ram_id_to_paste_in;


    -- Creo un cursor para recorrer cada una de las hojas e insertarlas
    open c_leaves_to_copy for EXECUTE 'select hoja_id, id, modifico from Hoja where hoja_id in (' || p_ids ||')';

    loop
        fetch c_leaves_to_copy into v_leave_row;
        exit when not found;
        begin

           if not exists(select 1 from hoja where ram_id = p_ram_id_to_paste_in and id = v_leave_row.id) then

               update hoja set ram_id = p_ram_id_to_paste_in, arb_id = v_arb_id where hoja_id = v_leave_row.hoja_id;

           else

               delete from hoja where hoja_id = v_leave_row.hoja_id;

           end if;
        end;
    end loop;

    close c_leaves_to_copy;

    v_ids := regexp_split_to_array(p_ids, ',');

    for v_index in 1 .. array_upper(v_ids, 1)
    loop

        v_id := v_ids[v_index];

        if v_id::integer < 0 then

            -- Por cada hoja obtengo un id nuevo
            select SP_DBGetNewId('hoja',
                                 'hoja_id') into v_new_hoja_id;

            insert into hoja ( hoja_id, id, modifico, ram_id, arb_id )
            values ( v_new_hoja_id, v_id::integer * -1, p_us_id, p_ram_id_to_paste_in, v_arb_id );

        end if;
    end loop;

    rtn := 'rtn';

    open rtn for select * from rama where ram_id = p_ram_id_to_paste_in;

end;
$BODY$
  language plpgsql volatile
  cost 100;
alter function sp_arb_hoja_paste_cut(integer, varchar, integer)
  owner to postgres;