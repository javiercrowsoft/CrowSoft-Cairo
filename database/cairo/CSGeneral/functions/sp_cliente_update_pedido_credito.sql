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
-- Function: sp_cliente_update_pedido_credito()

-- drop function sp_cliente_update_pedido_credito(integer, integer);

/*
          select sp_cliente_update_pedido_credito(1,1);
*/

create or replace function sp_cliente_update_pedido_credito
(
  in p_cli_id integer,
  in p_emp_id integer
)
  returns void as
$BODY$
declare
   v_doct_PedidoVenta integer;
   v_deudaPedidoAnterior decimal(18,6);
   v_deudaPedido decimal(18,6);
   v_empclid_id integer;
begin

   v_doct_PedidoVenta := 5;

   -- deuda desde el cache
   --

   -- deuda en el cache
   --
   select sum(clicc_importe)
     into v_deudaPedido
   from ClienteCacheCredito
   where doct_id = v_doct_PedidoVenta
     and cli_id = p_cli_id;

   -- deuda en el cliente
   --
   select cli_deudaPedido
     into v_deudaPedidoAnterior
   from Cliente
   where cli_id = p_cli_id;

   update Cliente
      set cli_deudaPedido = coalesce(v_deudaPedido, 0),
          cli_deudaTotal = cli_deudaTotal - coalesce(v_deudaPedidoAnterior, 0) + coalesce(v_deudaPedido, 0)
   where cli_id = p_cli_id;

   -- actualizo la deuda en la tabla empresaclientedeuda
   --
   v_deudaPedido := 0;
   v_deudaPedidoAnterior := 0;

   -- deuda en el cache para la empresa del documento modificado
   --
   select sum(clicc_importe)
     into v_deudaPedido
   from ClienteCacheCredito
   where doct_id = v_doct_PedidoVenta
     and cli_id = p_cli_id
     and emp_id = p_emp_id;

   select empclid_id
     into v_empclid_id
   from EmpresaClienteDeuda
   where cli_id = p_cli_id
     and emp_id = p_emp_id;

   if coalesce(v_empclid_id, 0) <> 0 then

      select empclid_deudaPedido
        into v_deudaPedidoAnterior
      from EmpresaClienteDeuda
      where empclid_id = v_empclid_id;

      update EmpresaClienteDeuda
         set empclid_deudaPedido = coalesce(v_deudaPedido, 0),
             empclid_deudaTotal = empclid_deudaTotal - coalesce(v_deudaPedidoAnterior, 0) + coalesce(v_deudaPedido, 0)
      where empclid_id = v_empclid_id;

   else

      select * from sp_dbGetNewId('EmpresaClienteDeuda', 'empclid_id') into v_empclid_id;

      insert into EmpresaClienteDeuda( empclid_id, cli_id, emp_id, empclid_deudaPedido, empclid_deudaTotal )
                              values ( v_empclid_id, p_cli_id, p_emp_id, coalesce(v_deudaPedido, 0), coalesce(v_deudaPedido, 0) );

   end if;

end;
$BODY$
  language plpgsql volatile
  cost 100;
alter function sp_cliente_update_pedido_credito(integer, integer)
  owner to postgres;