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
-- Function: sp_arbgetarboles(integer)

-- drop function sp_arbgetarboles(integer);

create or replace function sp_arbgetarboles(in p_tbl_id integer, out rtn refcursor)
  returns refcursor as
$BODY$
declare
begin

        rtn := 'rtn';

        open rtn for
        select  Arbol.arb_id,
                arb_Nombre,
                ram_id
        from Arbol,
             Rama
         where Rama.ram_id_padre = 0
                 and Arbol.arb_id = Rama.arb_id
                 and tbl_id = p_tbl_id
                 and Rama.ram_id <> 0;

end;
$BODY$
  language plpgsql volatile
  COST 100;
alter function sp_arbgetarboles(integer)
  owner to postgres;