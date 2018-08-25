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
-- Function: sp_cliente_get_informes()

-- drop function sp_cliente_get_informes(integer);
/*
          select * from Departamentocliente;
          select * from sp_cliente_get_informes(3);
          fetch all from rtn;
*/

create or replace function sp_cliente_get_informes
(
  in p_cli_id integer,
  out rtn refcursor
)
  returns refcursor as
$BODY$
declare
   v_us_id integer;
begin

   rtn := 'rtn';

   select us_id
     into v_us_id
   from Cliente
   where cli_id = p_cli_id;

   open rtn for
      select per.per_id,
             inf.inf_id,
             inf.inf_nombre,
             inf.inf_codigo,
             inf.pre_id
      from Informe inf
      join Permiso per
        on inf.pre_id = per.pre_id
      where per.us_id = v_us_id;

end;
$BODY$
  language plpgsql volatile
  cost 100;
alter function sp_cliente_get_informes(integer)
  owner to postgres;