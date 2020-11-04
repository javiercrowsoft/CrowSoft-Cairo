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
-- Function: sp_lsdoc_remitos_venta()

-- drop function sp_lsdoc_remitos_venta(integer, timestamp with time zone, timestamp with time zone, varchar, varchar, varchar, varchar, varchar, varchar, varchar);

create or replace function sp_lsdoc_remitos_venta
(
  in p_us_id integer,
  in p_Fini timestamp with time zone,
  in p_Ffin timestamp with time zone,
  in p_cli_id varchar,
  in p_est_id varchar,
  in p_ccos_id varchar,
  in p_suc_id varchar,
  in p_ven_id varchar,
  in p_doc_id varchar,
  in p_cpg_id varchar,
  in p_emp_id varchar,
  out rtn refcursor
)
  returns refcursor as
$BODY$
begin

   rtn := 'rtn';

   select sp_lsdoc_remitos_venta_cliente(
                                  p_us_id,
                                  p_Fini,
                                  p_Ffin,
                                  p_cli_id,
                                  p_est_id,
                                  p_ccos_id,
                                  p_suc_id,
                                  p_ven_id,
                                  p_doc_id,
                                  p_cpg_id,
                                  p_emp_id) into rtn;

end;
$BODY$
  language plpgsql volatile
  cost 100;
alter function sp_lsdoc_remitos_venta(integer, timestamp with time zone, timestamp with time zone, varchar, varchar, varchar, varchar, varchar, varchar, varchar, varchar)
  owner to postgres;
