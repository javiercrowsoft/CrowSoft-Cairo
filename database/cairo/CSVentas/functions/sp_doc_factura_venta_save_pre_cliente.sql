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
-- Function: sp_doc_factura_venta_save_pre_cliente()

-- drop function sp_doc_factura_venta_save_pre_cliente(integer, integer);

create or replace function sp_doc_factura_venta_save_pre_cliente
(
  in p_fvTMP_id integer
)
 returns void as
$BODY$
begin

end;
$BODY$
  language plpgsql volatile
  cost 100;
alter function sp_doc_factura_venta_save_pre_cliente(integer)
  owner to postgres;