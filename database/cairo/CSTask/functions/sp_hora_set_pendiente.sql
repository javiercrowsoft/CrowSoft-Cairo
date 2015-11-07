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
-- Function: sp_hora_set_pendiente()

-- drop function sp_hora_set_pendiente(integer);

create or replace function sp_hora_set_pendiente
(
  in p_hora_id integer
)
  returns void as
$BODY$
declare
   v_hora_pendiente decimal(18,6);
   v_aplicado decimal(18,6);
begin

   select hora_horas + CAST(hora_minutos as decimal(18,6)) / 60
     into v_hora_pendiente
   from Hora
   where hora_id = p_hora_id;

   select sum(horafv_cantidad)
     into v_aplicado
   from HoraFacturaVenta
   where hora_id = p_hora_id;

   update hora
      set hora_pendiente = v_hora_pendiente - coalesce(v_aplicado, 0)
   where hora_id = p_hora_id;

end;
$BODY$
  language plpgsql volatile
  cost 100;
alter function sp_hora_set_pendiente(integer)
  owner to postgres;