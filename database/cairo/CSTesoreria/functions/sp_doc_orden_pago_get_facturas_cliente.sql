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
-- Function: sp_doc_orden_pago_get_facturas_cliente()

-- drop function sp_doc_orden_pago_get_facturas_cliente(integer, integer, integer, integer);
/*

  select * from sp_doc_orden_pago_get_facturas_cliente(1,19);
  fetch all from rtn;
  fetch all from rtn_rates;

  select prov_id from facturacompra where fc_pendiente > 0
  select * from proveedor where prov_id = 32

*/
create or replace function sp_doc_orden_pago_get_facturas_cliente
(
  in p_emp_id integer,
  in p_prov_id integer,
  in p_bSoloVencidos integer default 1,
  in p_bAgrupado integer default 0,
  out rtn refcursor,
  out rtnRates refcursor
)
  returns record as
$BODY$
begin

   select * from sp_doc_orden_pago_get_facturas_cairo(
                    p_emp_id,
                    p_prov_id,
                    p_bSoloVencidos,
                    p_bAgrupado)
   into rtn, rtnRates;

end;
$BODY$
  language plpgsql volatile
  cost 100;
alter function sp_doc_orden_pago_get_facturas_cliente(integer, integer, integer, integer)
  owner to postgres;