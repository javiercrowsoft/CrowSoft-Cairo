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
-- Function: sp_doc_stock_get()

-- drop function sp_doc_stock_get(integer, integer, integer);
/*
select * from sp_doc_stock_get(1,1,1);
fetch all from rtn;
*/
create or replace function sp_doc_stock_get
(
  in p_emp_id integer,
  in p_st_id integer,
  in p_us_id integer,
  out rtn refcursor
)
  returns refcursor as
$BODY$
declare
   v_editable integer;
   v_edit_msg varchar(255);
   v_doc_id integer;
   v_ta_mascara varchar(100);
   v_ta_propuesto smallint;
begin

   rtn := 'rtn';

/*
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
//                             TALONARIO Y ESTADO DE EDICION                                                          //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
*/
   select doc_id into v_doc_id from Stock where st_id = p_st_id;

   select * from sp_talonario_get_propuesto(v_doc_id) into v_ta_mascara, v_ta_propuesto;

   select * from sp_doc_stock_editable_get(p_emp_id, p_st_id, p_us_id) into v_editable, v_edit_msg;

/*
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
//                             select                                                                                 //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
*/

   open rtn for

      select st.*,
             doct_nombre || ' ' || st.st_doc_cliente doc_cliente,
             origen.depl_nombre Origen,
             destino.depl_nombre Destino,
             origen.depf_id,
             case
                when lgj.lgj_titulo <> '' then lgj.lgj_titulo
                else lgj.lgj_codigo
             end lgj_codigo,
             suc.suc_nombre,
             doc_nombre,
             v_editable editable,
             v_edit_msg editMsg,
             v_ta_mascara ta_mascara,
             v_ta_propuesto ta_propuesto
      from Stock st
      join Documento doc
        on st.doc_id = doc.doc_id
      join Sucursal suc
        on st.suc_id = suc.suc_id
      join DepositoLogico origen
        on st.depl_id_origen = origen.depl_id
      join DepositoLogico destino
        on st.depl_id_destino = destino.depl_id
      left join Legajo lgj
        on st.lgj_id = lgj.lgj_id
      left join DocumentoTipo doct
        on st.doct_id_cliente = doct.doct_id
      where st.st_id = p_st_id;

end;
$BODY$
  language plpgsql volatile
  cost 100;
alter function sp_doc_stock_get(integer, integer, integer)
  owner to postgres;