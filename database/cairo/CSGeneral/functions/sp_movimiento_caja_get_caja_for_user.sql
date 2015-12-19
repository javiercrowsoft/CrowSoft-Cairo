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

/*
          select * from sp_movimiento_caja_get_caja_for_user(1,2);
          fetch all from rtn;

*/

create or replace function sp_movimiento_caja_get_caja_for_user
(
  in p_us_id integer,
  in p_emp_id integer,
  out rtn refcursor
)
  returns refcursor as
$BODY$
declare
   v_cj_id integer;
begin

   rtn := 'rtn';

   if exists ( select cj.cj_id
                from CajaCajero cjc
                join Caja cj
                  on cjc.cj_id = cj.cj_id
                where cjc.us_id = p_us_id
                  and cj.emp_id = p_emp_id
                  and cj.activo <> 0 ) then

      select min(cj_id)
        into v_cj_id
      from MovimientoCaja mcj
      where mcj_tipo = 1
        and cj_id in ( select cc.cj_id
                       from CajaCajero cc
                       inner join Caja cj on cc.cj_id = cj.cj_id
                       where cc.us_id = p_us_id
                         and cj.emp_id = p_emp_id
                     )
        and not exists ( select *
                         from MovimientoCaja
                         where cj_id = mcj.cj_id
                           and mcj_id > mcj.mcj_id
                           and mcj_tipo = 2 );

      if v_cj_id is null then
         open rtn for
            select 0 success,
                   '' info,
                   'El usuario esta configurado como cajero, pero no existe ninguna caja en estado "Abierta" asociada a este cajero. Debe abrir la caja para poder operar.' warning,
                   v_cj_id cj_id,
                   '' cj_nombre,
                   '' cj_codigo;

      else
         open rtn for
            select 0 success,
                   'Estas operaciones de venta trabajarán con la caja: ' || cj_nombre || ' [' || cj_codigo || '].' info,
                   '' warning,
                   v_cj_id cj_id,
                   cj_nombre,
                   cj_codigo
            from Caja
            where cj_id = v_cj_id;

      end if;

   else

      open rtn for
         select 1 success,
                '' info,
                '' warning,
                null cj_id,
                '' cj_nombre,
                '' cj_codigo;

   end if;

end;
$BODY$
  language plpgsql volatile
  cost 100;
alter function sp_movimiento_caja_get_caja_for_user(integer, integer)
  owner to postgres;