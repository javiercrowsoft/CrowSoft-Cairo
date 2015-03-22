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
-- Function: sp_arb_rama_create()

-- drop function sp_arb_rama_create();

create or replace function sp_arb_rama_create(
  in p_us_id integer,
  in p_arb_id integer,
  in p_ram_id_padre integer,
  in p_nombre varchar,
  out rtn refcursor
)
  returns refcursor as
$BODY$
declare
        v_ram_id integer;
        v_is_temp boolean;
        v_max integer;
        v_orden integer;
        v_arb_id integer;
begin

        select SP_DBGetNewId('rama',
                              'ram_id',
                              0::smallint) into v_ram_id;

        v_is_temp := p_ram_id_padre = -1000;
    
        /*
        ' - Si es una rama temporal le asigno como padre
        '   su propio ID para que quede huerfana
        */
        if v_is_temp then
                p_ram_id_padre = v_ram_id;
                v_orden := 0;
        /*
        ' - Si no obtengo el numero de orden que le corresponde
        '   dentro del padre
        '
        */
        else
                select max(ram_orden) into v_max from rama where ram_id_padre = p_ram_id_padre;
                if v_max is null then
                        v_orden := 1;                        
                else
                        v_orden := v_max + 1;                        
                end if;

                select arb_id into p_arb_id from rama where ram_id = p_ram_id_padre;
        end if;

        insert into rama (ram_id, ram_nombre, ram_id_padre, ram_orden, arb_id, modifico)
        values (v_ram_id, p_nombre, p_ram_id_padre, v_orden, p_arb_id, p_us_id);

        rtn := 'rtn';

        open rtn for select * from rama where ram_id = v_ram_id;
   
end;
$BODY$
  language plpgsql volatile
  COST 100;
alter function sp_arb_rama_create(integer, integer, integer, varchar)
  owner to postgres;