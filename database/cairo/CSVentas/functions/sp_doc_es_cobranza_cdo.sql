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
-- Function: sp_doc_es_cobranza_cdo()

-- drop function sp_doc_es_cobranza_cdo(integer);

create or replace function sp_doc_es_cobranza_cdo
/*
proposito: devuelve si la factura tiene una condicion de pago contado
select max(fv_id) from facturaventa;
select * from sp_doc_es_cobranza_cdo(2502);
*/
(
  in p_fv_id integer,
  out p_es_contado integer
)
  returns integer as
$BODY$
declare
   v_cpg_id integer;
begin

      select cpg_id
        into v_cpg_id
      from FacturaVenta
      where fv_id = p_fv_id;

     select cpg_escontado
       into p_es_contado
     from CondicionPago
     where cpg_id = v_cpg_id;

end;
$BODY$
  language plpgsql volatile
  cost 100;
alter function sp_doc_es_cobranza_cdo(integer)
  owner to postgres;