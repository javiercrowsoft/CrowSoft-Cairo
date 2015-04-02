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
-- Function: sp_doc_get_info()

-- drop function sp_doc_get_info(integer, integer, integer);

create or replace
function sp_doc_get_info
/*
  select * from sp_doc_get_info(2,61,1)
*/
(
  in p_emp_id integer,
  in p_doc_id integer,
  in p_us_id integer,
  out p_mon_id integer,
  out p_doct_id integer,
  out p_doc_tipofactura integer,
  out p_doc_muevestock integer
)
  returns record as
$BODY$
begin

    select mon_id, doct_id, doc_tipofactura, doc_muevestock
      into p_mon_id, p_doct_id, p_doc_tipofactura, p_doc_muevestock
    from documento
    where doc_id = p_doc_id;

    p_mon_id := coalesce(p_mon_id, 0);
    p_doct_id := coalesce(p_doct_id, 0);
    p_doc_tipofactura := coalesce(p_doc_tipofactura, 0);
    p_doc_muevestock := coalesce(p_doc_muevestock, 0);

end;
$BODY$
  language plpgsql volatile
  cost 100;
alter function sp_doc_get_info(integer, integer, integer)
  owner to postgres;