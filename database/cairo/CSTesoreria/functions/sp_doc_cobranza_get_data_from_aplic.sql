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
-- Function: sp_doc_cobranza_get_data_from_aplic()

-- drop function sp_doc_cobranza_get_data_from_aplic(integer, varchar);

/*
select * from sp_doc_cobranza_get_data_from_aplic('22,23,24,25,26,27,28');
fetch all from rtn;
*/

create or replace function sp_doc_cobranza_get_data_from_aplic
(
  in p_doct_id integer,
  in p_strIds varchar,
  out rtn refcursor
)
  returns refcursor as
$BODY$
declare
   v_timeCode timestamp with time zone;
begin

   v_timeCode := CURRENT_TIMESTAMP;

   perform sp_str_string_to_table(v_timeCode, p_strIds, ',');

   rtn := 'rtn';

   if p_doct_id = 1 then

      open rtn for

         select distinct fv.suc_id,
                       fv.lgj_id,
                       fv.cpg_id,
                       fv.ccos_id,
                       suc.suc_nombre,
                       lgj.lgj_titulo,
                       cpg.cpg_nombre,
                       ccos.ccos_nombre
         from ( FacturaVenta fv
                join TmpStringToTable
                 on fv.fv_id = cast(TmpStringToTable.tmpstr2tbl_campo as integer)
                and tmpstr2tbl_id = v_timeCode
                 )
         left join Sucursal suc
                on suc.suc_id = fv.suc_id
         left join CondicionPago cpg
                on cpg.cpg_id = fv.cpg_id
         left join CentroCosto ccos
                on ccos.ccos_id = fv.ccos_id
         left join Legajo lgj
                on lgj.lgj_id = fv.lgj_id

         where tmpstr2tbl_id = v_timeCode;

   else

      open rtn for

         -- devolvemos un recordset vacio para que el que llama
         -- no fallse el preguntar por eof
         --
         select 0 dummy from Cobranza where 1 = 2;

   end if;

end;
$BODY$
  language plpgsql volatile
  cost 100;
alter function sp_doc_cobranza_get_data_from_aplic(integer, varchar)
  owner to postgres;