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
-- Function: sp_arb_arbol_create()

-- drop function sp_arb_arbol_create();

create or replace function sp_arb_arbol_create(
  in p_us_id integer,
  in p_tbl_id integer,
  in p_nombre varchar,
  out rtn refcursor
)
  returns refcursor as
$BODY$
declare
        v_arb_id integer;
        v_raiz_id integer;
begin

        select sp_dbGetNewId('arbol',
                              'arb_id') into v_arb_id;

        insert into arbol (arb_id, arb_nombre, tbl_id, modifico)
        values (v_arb_id, p_nombre, p_tbl_id, p_us_id);

        select sp_dbGetNewId('rama',
                             'ram_id') into v_raiz_id;

        insert into rama (ram_id, ram_nombre, ram_id_padre, ram_orden, arb_id, modifico)
        values (v_raiz_id, p_nombre, 0, 0, v_arb_id, p_us_id);

        rtn := 'rtn';

        open rtn for select arb_id, arb_nombre, v_raiz_id as ram_id from arbol where arb_id = v_arb_id;

end;
$BODY$
  language plpgsql volatile
  cost 100;
alter function sp_arb_arbol_create(integer, integer, varchar)
  owner to postgres;
