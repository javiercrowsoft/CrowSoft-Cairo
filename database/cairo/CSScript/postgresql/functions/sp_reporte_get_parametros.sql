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
-- Function: sp_reporte_get_parametros()

-- drop function sp_reporte_get_parametros(integer);

-- select * from informe where inf_nombre like '%valid%'
-- select * from reporte where inf_id = 34
-- sp_col reporteparametro
/* 
select * from sp_reporte_get_parametros( 113 );
fetch all from rtn;
*/
create or replace function sp_reporte_get_parametros
(
  in p_rpt_id integer,
  out rtn refcursor
)
  returns refcursor as
$BODY$
begin

   rtn := 'rtn';

   open rtn for

      select i.infp_id,
             i.infp_nombre,
             i.infp_orden,
             i.infp_tipo,
             i.infp_default,
             i.infp_visible,
             i.infp_sqlstmt,
             i.inf_id,
             i.tbl_id,
             r.rptp_id,
             r.rptp_valor,
             coalesce(r.rptp_visible,i.infp_visible) as rptp_visible,
             r.rpt_id

      from Reporte rpt
      inner join InformeParametro i on rpt.inf_id = i.inf_id
      left join ReporteParametro r  on i.infp_id = r.infp_id and r.rpt_id = rpt.rpt_id

      where rpt.rpt_id = p_rpt_id
      order by i.infp_orden;

end;
$BODY$
  language plpgsql volatile
  cost 100;
alter function sp_reporte_get_parametros(integer)
  owner to postgres;