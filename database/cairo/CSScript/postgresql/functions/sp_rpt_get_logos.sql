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
-- Function: sp_rpt_get_logos()

-- drop function sp_rpt_get_logos(varchar);

-- select * from informe where inf_nombre like '%valid%'
-- select * from reporte where inf_id = 34
-- sp_col reporteparametro
/* 
select * from sp_rpt_get_logos( '' );
fetch all from rtn;
*/
create or replace function sp_rpt_get_logos
(
  in p_logo varchar,
  out rtn refcursor
)
  returns refcursor as
$BODY$
begin

   rtn := 'rtn';

   open rtn for
      select dd_file
      from DocumentoDigital
      where dd_codigo = p_logo;

end;
$BODY$
  language plpgsql volatile
  cost 100;
alter function sp_rpt_get_logos(varchar)
  owner to postgres;