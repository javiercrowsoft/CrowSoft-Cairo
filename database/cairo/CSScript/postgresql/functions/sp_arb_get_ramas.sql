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
-- Function: sp_arbgetramas(integer)

-- drop function sp_arbgetramas(integer);

create or replace function sp_arbgetramas(in p_arb_id integer, out rtn refcursor)
  returns refcursor as
$BODY$
declare
   -- para traer la raiz primero
   --select ram_id, ram_nombre, ram_id_padre from rama where arb_id = @@arb_id and ram_id <> 0 order by ram_id_padre
   v_raiz_id integer;
begin
        select ram_id
        into v_raiz_id
        from Rama
        where arb_id = p_arb_id
        and ram_id_padre = 0
        and ram_id <> 0;

        rtn := 'rtn';

        select into rtn t.rtn from SP_ArbGetDecendencia(v_raiz_id,1,1,1,0) t;

end;
$BODY$
  language plpgsql volatile
  cost 100;
alter function sp_arbgetramas(integer)
  owner to postgres;