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
-- Function: sp_reporte_get_parametro_value()

-- drop function sp_reporte_get_parametro_value(varchar, integer, integer);

-- select * from informe where inf_nombre like '%valid%'
-- select * from reporte where inf_id = 34
-- sp_col reporteparametro
/* 

select sp_reporte_get_parametro_value( rptp_valor, infp_tipo, tbl_id ) as test, r.*, i.* 
from reporteparametro r inner join informeparametro i on r.infp_id = i.infp_id 
where infp_tipo = 2 and rptp_valor <> '0' and rptp_valor <> ''

select * from sp_reporte_get_parametro_value( '32', 2, 28 );

select 
  sp_reporte_get_parametro_value( rptp_valor, infp_tipo, tbl_id ) as test, 
  us_nombre 
from reporteparametro 
where rpt_id in ();

*/
create or replace function sp_reporte_get_parametro_value
(
  in p_valor varchar,
  in p_tipo integer,
  in p_tbl_id integer
)
  returns varchar as
$BODY$
declare
   v_real_id integer;
   v_ram_id integer;
   v_tabla varchar;
   v_camponombre varchar;
   v_campoid varchar;
   v_sqlstmt varchar;
begin

   if p_tipo = 2 /* select */ then

      if trim(p_valor) = '' then

         return p_valor;

      end if;

      select * from sp_ArbConvertId(p_valor) into v_real_id, v_ram_id;

      if v_ram_id <> 0 then

         select ram_nombre into p_valor from rama where ram_id = v_ram_id;
         return p_valor;

      else

         select tbl_nombrefisico, tbl_camponombre, tbl_campoid
           into v_tabla, v_camponombre, v_campoid
         from tabla where tbl_id = p_tbl_id;

         v_sqlstmt := 'select ' || v_camponombre || ' from ' || v_tabla || ' where ' || v_campoid || ' = ' || v_real_id::varchar;

         execute v_sqlstmt into p_valor;
         return p_valor;

      end if;

   else

      return p_valor;

   end if;

end;
$BODY$
  language plpgsql volatile
  cost 100;
alter function sp_reporte_get_parametro_value(varchar, integer, integer)
  owner to postgres;