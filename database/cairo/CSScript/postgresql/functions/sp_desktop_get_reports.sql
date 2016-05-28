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
-- Function: sp_desktop_get_reportes(integer)

-- drop function sp_desktop_get_reportes(integer, integer);

/*
select * from sp_desktop_get_reportes(1);
fetch all from rtn;
*/

create or replace function sp_desktop_get_reportes
(
  in p_us_id integer,
  in p_inf_tipo integer default 1,
  out rtn refcursor
)
   returns refcursor as
$BODY$
begin

   rtn := 'rtn';

   open rtn for

   select distinct
             r.rpt_id,
             r.rpt_nombre,
             i.inf_modulo,
             r.rpt_descrip

   from Reporte r
   join Informe i
     on r.inf_id = i.inf_id
   join (select * from sp_security_get_permisos_x_usuario(p_us_id)) as i2
     on i.pre_id = i2.pre_id

   where ( r.us_id = p_us_id or p_us_id = 0 )
     and i.activo <> 0
     and i.inf_tipo = p_inf_tipo

   order by i.inf_modulo, r.rpt_nombre;

end;
$BODY$
  language plpgsql volatile
  cost 100;
alter function sp_doc_get_editable(integer, integer, integer, integer)
  owner to postgres;