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
-- Function: sp_cliente_update_credito()

-- drop function sp_cliente_update_credito(integer, integer);

/*
          select sp_cliente_update_credito(1,1);
*/

create or replace function sp_cliente_update_credito
(
  in p_cli_id integer,
  in p_emp_id integer
)
  returns void as
$BODY$
declare
   v_deudaCtaCteAnterior decimal(18,6);
   v_deudaCtaCte decimal(18,6);
   v_creditoCtaCte decimal(18,6);
   v_deudaDocAnterior decimal(18,6);
   v_deudaDoc decimal(18,6);
   v_emp_clid_id integer;

   v_doct_factura_vta integer := 1;
   v_doct_cobranza integer := 13;
   v_doct_cobranza_chq integer := 1013;
begin

   -- Deuda en el cache
   --
   select sum(clicc_importe)
     into v_deudaCtaCte
   from ClienteCacheCredito
   where doct_id = v_doct_factura_vta
     and cli_id = p_cli_id;

   -- Credito en el cache
   --
   select sum(clicc_importe)
     into v_creditoCtaCte
   from ClienteCacheCredito
   where doct_id = v_doct_cobranza
     and cli_id = p_cli_id;

   -- Deuda en el cliente
   --
   select cli_deudaCtaCte
     into v_deudaCtaCteAnterior
   from Cliente
   where cli_id = p_cli_id;

   update Cliente
      set cli_deudaCtaCte = coalesce(v_deudaCtaCte, 0) - coalesce(v_creditoCtaCte, 0),
          cli_deudaTotal = cli_deudaTotal - coalesce(v_deudaCtaCteAnterior, 0) 
                           + (coalesce(v_deudaCtaCte, 0) - coalesce(v_creditoCtaCte, 0))
   where cli_id = p_cli_id;

   -- Actualizo la deuda en la tabla EmpresaClienteDeuda
   --
   v_deudaCtaCte := 0;
   v_deudaCtaCteAnterior := 0;
   v_creditoCtaCte := 0;

   -- Deuda en el cache para la empresa del documento modificado
   --
   select sum(clicc_importe)
     into v_deudaCtaCte
   from ClienteCacheCredito
   where doct_id = v_doct_factura_vta
     and cli_id = p_cli_id
     and emp_id = p_emp_id;

   -- Credito en el cache para la empresa del documento modificado
   --
   select sum(clicc_importe)
     into v_creditoCtaCte
   from ClienteCacheCredito
   where doct_id = v_doct_cobranza
     and cli_id = p_cli_id
     and emp_id = p_emp_id;

   select empclid_id
     into v_emp_clid_id
   from EmpresaClienteDeuda
   where cli_id = p_cli_id
     and emp_id = p_emp_id;

   if coalesce(v_emp_clid_id, 0) <> 0 then

      select empclid_DeudaCtaCte
        into v_deudaCtaCteAnterior
      from EmpresaClienteDeuda
      where empclid_id = v_emp_clid_id;

      update EmpresaClienteDeuda
         set empclid_DeudaCtaCte = coalesce(v_deudaCtaCte, 0) - coalesce(v_creditoCtaCte, 0),
             empclid_deudaTotal = empclid_deudaTotal - coalesce(v_deudaCtaCteAnterior, 0)
                                  + (coalesce(v_deudaCtaCte, 0) - coalesce(v_creditoCtaCte, 0))
      where empclid_id = v_emp_clid_id;

   else

      select sp_dbGetNewId('EmpresaClienteDeuda', 'empclid_id') into v_emp_clid_id;

      insert into EmpresaClienteDeuda( empclid_id, cli_id, emp_id, empclid_deudaCtaCte, empclid_deudaTotal )
        values ( v_emp_clid_id, p_cli_id, p_emp_id, coalesce(v_deudaCtaCte, 0),
                 coalesce(v_deudaCtaCte, 0) - coalesce(v_creditoCtaCte, 0) );

   end if;

   --///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
   -- Deuda Documentada desde el cache
   --///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
   -- Deuda en el cache
   --
   select sum(clicc_importe)
     into v_deudaDoc
   from ClienteCacheCredito
   where doct_id = v_doct_cobranza_chq
     and cli_id = p_cli_id;

   -- Deuda en el cliente
   --
   select cli_deudaDoc
     into v_deudaDocAnterior
   from Cliente
   where cli_id = p_cli_id;

   update Cliente
      set cli_deudaDoc = coalesce(v_deudaDoc, 0),
          cli_deudaTotal = cli_deudaTotal - coalesce(v_deudaDocAnterior, 0) + coalesce(v_deudaDoc, 0)
   where cli_id = p_cli_id;

   -- Actualizo la deuda en la tabla EmpresaClienteDeuda
   --
   v_deudaDoc := 0;
   v_deudaDocAnterior := 0;

   -- Deuda en el cache para la empresa del documento modificado
   --
   select sum(clicc_importe)
     into v_deudaDoc
   from ClienteCacheCredito
   where doct_id = v_doct_cobranza_chq
     and cli_id = p_cli_id
     and emp_id = p_emp_id;

   v_emp_clid_id := null;

   select empclid_id
     into v_emp_clid_id
   from EmpresaClienteDeuda
   where cli_id = p_cli_id
     and emp_id = p_emp_id;

   if coalesce(v_emp_clid_id, 0) <> 0 then

      select empclid_DeudaDoc
        into v_deudaDocAnterior
      from EmpresaClienteDeuda
      where empclid_id = v_emp_clid_id;

      update EmpresaClienteDeuda
         set empclid_DeudaDoc = coalesce(v_deudaDoc, 0),
             empclid_deudaTotal = empclid_deudaTotal - coalesce(v_deudaDocAnterior, 0) + coalesce(v_deudaDoc, 0)
      where empclid_id = v_emp_clid_id;

   else

      select sp_dbGetNewId('EmpresaClienteDeuda', 'empclid_id') into v_emp_clid_id;

      insert into EmpresaClienteDeuda( empclid_id, cli_id, emp_id, empclid_deudaDoc, empclid_deudaTotal )
      values ( v_emp_clid_id, p_cli_id, p_emp_id, coalesce(v_deudaDoc, 0), coalesce(v_deudaDoc, 0) );

   end if;

end;
$BODY$
  language plpgsql volatile
  cost 100;
alter function sp_cliente_update_credito(integer, integer)
  owner to postgres;