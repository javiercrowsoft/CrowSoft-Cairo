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
-- Function: sp_doc_cobranza_get()

-- drop function sp_doc_cobranza_get(integer, integer, integer);
/*
select * from sp_doc_cobranza_get(1,1,1);
fetch all from rtn;
*/
create or replace function sp_doc_cobranza_get
(
  in p_emp_id integer,
  in p_cobz_id integer,
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
   select doc_id
     into v_doc_id
   from Cobranza
   where cobz_id = p_cobz_id;

   select * from sp_talonario_get_propuesto(v_doc_id, 0, 0) into v_ta_mascara, v_ta_propuesto;

   select * from sp_doc_cobranza_editable_get(p_emp_id, p_cobz_id, p_us_id) into v_editable, v_edit_msg;

/*
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
//                             select                                                                                 //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
*/

   open rtn for

      select Cobranza.*,
             doct_nombre,
             cli_nombre,
             est_nombre,
             ccos_nombre,
             suc_nombre,
             doc_nombre,
             cob_nombre,
             case
                when lgj_titulo <> '' then lgj_titulo
                else lgj_codigo
             end lgj_codigo,
             v_editable editable,
             v_edit_msg editMsg,
             v_ta_mascara ta_mascara,
             v_ta_propuesto ta_propuesto
      from Cobranza
      join Documento
        on Cobranza.doc_id = Documento.doc_id
      join DocumentoTipo
        on Cobranza.doct_id = DocumentoTipo.doct_id
      join Estado
        on Cobranza.est_id = Estado.est_id
      join Sucursal
        on Cobranza.suc_id = Sucursal.suc_id
      join Cliente
        on Cobranza.cli_id = Cliente.cli_id
      left join CentroCosto
        on Cobranza.ccos_id = CentroCosto.ccos_id
      left join Cobrador
        on Cobranza.cob_id = Cobrador.cob_id
      left join Legajo
        on Cobranza.lgj_id = Legajo.lgj_id
      where cobz_id = p_cobz_id;

end;
$BODY$
  language plpgsql volatile
  cost 100;
alter function sp_doc_cobranza_get(integer, integer, integer)
  owner to postgres;