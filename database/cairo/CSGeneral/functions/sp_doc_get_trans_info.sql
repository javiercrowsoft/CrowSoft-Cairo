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
  select * from facturaventa
  select * from sp_doc_get_trans_info(1,1,1,1)
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
  out p_emp_nombre varchar
)
  returns record as
$BODY$
begin

   if p_doct_id in (1,7,9) /* ventas */ then

      select fv_id, fv_cotizacion, fv_total, fv_nrodoc, fv.cli_id, cli_nombre, fv.suc_id, fv.doc_id, fv.doct_id, fv.emp_id, emp_nombre
        into p_id, p_cotizacion, p_total, p_nrodoc, p_cli_id, p_cli_nombre, p_suc_id, p_doc_id, p_doct_id_out, p_emp_id_out, p_emp_nombre 
      from facturaVenta fv
      inner join cliente cli
       on fv.cli_id = cli.cli_id
      inner join empresa emp
       on fv.emp_id = emp.emp_id
      where fv_id = p_id;

      p_prov_id := 0;
      p_prov_nombre := '';

   else

      select fc_id, fc_cotizacion, fc_total, fc_nrodoc, fc.prov_id, prov_nombre, fc.suc_id, fc.doc_id, fc.doct_id, fc.emp_id, emp_nombre
        into p_id, p_cotizacion, p_total, p_nrodoc, p_prov_id, p_prov_nombre, p_suc_id, p_doc_id, p_doct_id_out, p_emp_id_out, p_emp_nombre 
      from facturaCompra fc
      inner join proveedor prov
       on fc.prov_id = prov.prov_id
      inner join empresa emp
       on fc.emp_id = emp.emp_id
      where fc_id = p_id;

      p_cli_id := 0;
      p_cli_nombre := '';

   end if;

end;
$BODY$
  language plpgsql volatile
  cost 100;
alter function sp_doc_get_trans_info(integer, integer, integer, integer)
  owner to postgres;