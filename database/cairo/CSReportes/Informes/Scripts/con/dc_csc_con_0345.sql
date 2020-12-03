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
-- Function: dc_csc_con_0345()

-- drop function dc_csc_con_0345();

/*
select * from dc_csc_con_0345(1,'2020-09-30','2020-09-30','0','0');
fetch all from rtn;
*/

create or replace function dc_csc_con_0345
(
  in p_us_id        integer,
  in p_Fini         timestamp with time zone,
  in p_Ffin         timestamp with time zone,

  in p_cico_id      varchar(255),
  in p_emp_id       varchar(255),
  in p_debug        integer,
  out rtn refcursor
)
  returns refcursor as
$BODY$
declare

begin

    perform dc_csc_con_0341 (p_us_id, p_Fini, p_Ffin, p_cico_id, p_emp_id, p_debug);

    perform dc_csc_con_0343 (p_us_id, p_Fini, p_Ffin, p_cico_id, p_emp_id, p_debug);

end;
$BODY$
  language plpgsql volatile
  cost 100;
alter function dc_csc_con_0345(integer, timestamp with time zone, timestamp with time zone, varchar, varchar, integer)
  owner to postgres;