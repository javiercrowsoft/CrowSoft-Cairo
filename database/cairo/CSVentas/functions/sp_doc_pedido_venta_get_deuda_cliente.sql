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
-- Function: sp_doc_pedido_venta_get_deuda_cliente()

-- drop function sp_doc_pedido_venta_get_deuda_cliente(integer);

create or replace function sp_doc_pedido_venta_get_deuda_cliente
(
  in p_cli_id integer,
  out p_deuda decimal(18,6),
  out p_deudadoc decimal(18,6)
)
  returns record as
$BODY$
begin

   select sum(clicc_importe)
     into p_deuda
   from ClienteCacheCredito
   where cli_id = p_cli_id
     and doct_id <> 1013;

   select sum(clicc_importe)
     into p_deudadoc
   from ClienteCacheCredito
   where cli_id = p_cli_id
     and doct_id = 1013;

   p_deuda := coalesce(p_deuda, 0);
   p_deudadoc := coalesce(p_deudadoc, 0);

end;
$BODY$
  language plpgsql volatile
  cost 100;
alter function sp_doc_pedido_venta_get_deuda_cliente(integer)
  owner to postgres;