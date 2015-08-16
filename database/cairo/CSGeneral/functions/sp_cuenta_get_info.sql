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
-- Function: sp_cuenta_get_info()

-- drop function sp_cuenta_get_info(integer);

create or replace function sp_cuenta_get_info
/*
    select * from cuenta
    select * from sp_cuenta_get_info(129);
*/
(
  in p_cue_id integer,

  out p_mon_id integer,
  out p_emp_id integer
)
  returns record as
$BODY$
declare
      v_mon_id integer;
      v_emp_id integer;
begin


      select mon_id,
             emp_id
        into v_mon_id,
             v_emp_id
      from Cuenta
      where cue_id = p_cue_id;

      p_mon_id := coalesce(v_mon_id, 0);
      p_emp_id := coalesce(v_emp_id, 0);

end;
$BODY$
  language plpgsql volatile
  cost 100;
alter function sp_cuenta_get_info(integer)
  owner to postgres;