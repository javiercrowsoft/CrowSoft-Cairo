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
-- Function: sp_movimiento_caja_get_caja_for_user()

-- drop function sp_movimiento_caja_get_caja_for_user(integer, integer);

create or replace function sp_movimiento_caja_get_from_caja
(
  in p_cj_id integer,
  in p_tipo integer,
  out p_mcj_id integer
)
  returns integer as
$BODY$
declare
   v_mcj_id integer;
   v_tipo integer;
begin

   select max(mcj_id)
     into v_mcj_id
   from MovimientoCaja
   where cj_id = p_cj_id;

   if v_mcj_id is not null then

      select mcj_tipo
        into v_tipo
      from MovimientoCaja
      where mcj_id = v_mcj_id;

      if v_tipo <> p_tipo then

         p_mcj_id := null;

      else

         p_mcj_id := v_mcj_id;

      end if;

   else

      p_mcj_id := v_mcj_id;

   end if;

end;
$BODY$
  language plpgsql volatile
  cost 100;
alter function sp_movimiento_caja_get_from_caja(integer, integer)
  owner to postgres;