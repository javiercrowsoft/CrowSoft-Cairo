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
-- Function: sp_doc_get_trans_info()

-- drop function sp_doc_get_trans_info(integer, integer, integer, integer);

create or replace
function sp_doc_get_trans_info
/*
  select fc_id from facturacompra
  select opg_id from ordenpago
  select * from sp_doc_get_trans_info(1,1,1,1)
  select * from sp_doc_get_trans_info(2,1,1,1)
  select * from sp_doc_get_trans_info(1,16,3,1)
*/
(
  in p_emp_id integer,
  in p_doct_id integer,
  in p_id integer,
  in p_us_id integer,

  out p_cotizacion decimal(18,6),
  out p_total decimal(18,6),
  out p_nrodoc varchar,
  out p_prov_id integer,
  out p_prov_nombre varchar,
  out p_cli_id integer,
  out p_cli_nombre varchar,
  out p_suc_id integer,
  out p_doc_id integer,
  out p_doct_id_out integer,
  out p_emp_id_out integer,
  out p_emp_nombre varchar,
  out p_id_client integer,
  out p_doct_id_client integer,
  out p_is_auto integer
)
  returns record as
$BODY$
begin

   p_cotizacion := 0;
   p_total := 0;
   p_nrodoc := '';
   p_prov_id := 0;
   p_prov_nombre := '';
   p_cli_id := 0;
   p_cli_nombre := '';
   p_suc_id := 0;
   p_doc_id := 0;
   p_doct_id_out := 0;
   p_emp_id_out := 0;
   p_emp_nombre := '';
   p_id_client := 0;
   p_doct_id_client := 0;
   p_is_auto := 0;

   if p_doct_id in (1,7,9) /* ventas */ then

      select fv_id, fv_cotizacion, fv_total, fv_nrodoc, fv.cli_id, cli_nombre, fv.suc_id, fv.doc_id, fv.doct_id, fv.emp_id, emp_nombre
        into p_id, p_cotizacion, p_total, p_nrodoc, p_cli_id, p_cli_nombre, p_suc_id, p_doc_id, p_doct_id_out, p_emp_id_out, p_emp_nombre
      from facturaVenta fv
      inner join cliente cli
       on fv.cli_id = cli.cli_id
      inner join empresa emp
       on fv.emp_id = emp.emp_id
      where fv_id = p_id;

   elsif p_doct_id = 16 /* orden de pago */ then

      select opg_id, opg_cotizacion, opg_total, opg_nrodoc, opg.prov_id, prov_nombre, opg.suc_id, opg.doc_id, opg.doct_id, opg.emp_id, emp_nombre, case when fc_id is not null then 1 else 0 end
        into p_id, p_cotizacion, p_total, p_nrodoc, p_prov_id, p_prov_nombre, p_suc_id, p_doc_id, p_doct_id_out, p_emp_id_out, p_emp_nombre, p_is_auto
      from ordenPago opg
      left join proveedor prov
       on opg.prov_id = prov.prov_id
      inner join empresa emp
       on opg.emp_id = emp.emp_id
      where opg_id = p_id;

   elsif p_doct_id = 13 /* cobranza */ then

      select cobz_id, cobz_cotizacion, cobz_total, cobz_nrodoc, cobz.cli_id, cli_nombre, cobz.suc_id, cobz.doc_id, cobz.doct_id, cobz.emp_id, emp_nombre
        into p_id, p_cotizacion, p_total, p_nrodoc, p_cli_id, p_cli_nombre, p_suc_id, p_doc_id, p_doct_id_out, p_emp_id_out, p_emp_nombre
      from cobranza cobz
      left join cliente cli
       on cobz.cli_id = cli.cli_id
      inner join empresa emp
       on cobz.emp_id = emp.emp_id
      where cobz_id = p_id;

   elseif p_doct_id in (2,8,10) /* compras */ then

      select fc_id, fc_cotizacion, fc_total, fc_nrodoc, fc.prov_id, prov_nombre, fc.suc_id, fc.doc_id, fc.doct_id, doc.emp_id, emp_nombre
        into p_id, p_cotizacion, p_total, p_nrodoc, p_prov_id, p_prov_nombre, p_suc_id, p_doc_id, p_doct_id_out, p_emp_id_out, p_emp_nombre
      from facturaCompra fc
      inner join proveedor prov
       on fc.prov_id = prov.prov_id
      inner join documento doc
       on fc.doc_id = doc.doc_id
      inner join empresa emp
       on doc.emp_id = emp.emp_id
      where fc_id = p_id;

   elseif p_doct_id = 15 /* asientos */ then

      select as_id, 0, 0, as_nrodoc, ast.doc_id, ast.doct_id, doc.emp_id, emp_nombre, doct_id_cliente, id_cliente
        into p_id, p_cotizacion, p_total, p_nrodoc, p_doc_id, p_doct_id_out, p_emp_id_out, p_emp_nombre, p_doct_id_client, p_id_client
      from asiento ast
      inner join documento doc
       on ast.doc_id = doc.doc_id
      inner join empresa emp
       on doc.emp_id = emp.emp_id
      where as_id = p_id;

   elseif p_doct_id = 14 /* transferencia de stock */ then

      select st_id, 0, 0, st_nrodoc, st.suc_id, st.doc_id, st.doct_id, doc.emp_id, emp_nombre, doct_id_cliente, id_cliente
        into p_id, p_cotizacion, p_total, p_nrodoc, p_suc_id, p_doc_id, p_doct_id_out, p_emp_id_out, p_emp_nombre, p_doct_id_client, p_id_client
      from stock st
      inner join documento doc
       on st.doc_id = doc.doc_id
      inner join empresa emp
       on doc.emp_id = emp.emp_id
      where st_id = p_id;

   end if;

end;
$BODY$
  language plpgsql volatile
  cost 100;
alter function sp_doc_get_trans_info(integer, integer, integer, integer)
  owner to postgres;