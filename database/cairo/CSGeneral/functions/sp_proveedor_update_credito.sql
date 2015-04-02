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
-- Function: sp_proveedor_update_credito()

-- drop function sp_proveedor_update_credito(integer, integer);

/*
          select sp_proveedor_update_credito(1,1);
*/

create or replace function sp_proveedor_update_credito
(
  in p_prov_id integer,
  in p_emp_id integer
)
  returns void as
$BODY$
declare
   v_deuda_cta_cte_anterior decimal(18,6);
   v_deuda_cta_cte decimal(18,6);
   v_credito_cta_cte decimal(18,6);
   v_deuda_doc_anterior decimal(18,6);
   v_deuda_doc decimal(18,6);
   v_emp_provd_id integer;
   
   v_doct_factura_cpra integer := 2;
   v_doct_orden_pago integer := 16;
   v_doct_orden_pago_chq integer := 1016;
begin

   -- Deuda en el cache
   --
   select sum(provcc_importe)
     into v_deuda_cta_cte
   from ProveedorCacheCredito
   where doct_id = v_doct_factura_cpra
     and prov_id = p_prov_id;

   -- Credito en el cache
   --
   select sum(provcc_importe)
     into v_credito_cta_cte
   from ProveedorCacheCredito
   where doct_id = v_doct_orden_pago
     and prov_id = p_prov_id;

   -- Deuda en el proveedor
   --
   select prov_DeudaCtaCte
     into v_deuda_cta_cte_anterior
   from Proveedor
   where prov_id = p_prov_id;

   update Proveedor
      set prov_DeudaCtaCte = coalesce(v_deuda_cta_cte, 0) - coalesce(v_credito_cta_cte, 0),
          prov_deudaTotal = prov_deudaTotal - coalesce(v_deuda_cta_cte_anterior, 0)
                            + (coalesce(v_deuda_cta_cte, 0) - coalesce(v_credito_cta_cte, 0))
   where prov_id = p_prov_id;

   -- Actualizo la deuda en la tabla EmpresaProveedorDeuda
   --
   v_deuda_cta_cte := 0;
   v_deuda_cta_cte_anterior := 0;
   v_credito_cta_cte := 0;

   -- Deuda en el cache para la empresa del documento modificado
   --
   select sum(provcc_importe)
     into v_deuda_cta_cte
   from ProveedorCacheCredito
   where doct_id = v_doct_factura_cpra
     and prov_id = p_prov_id
     and emp_id = p_emp_id;

   -- Credito en el cache para la empresa del documento modificado
   --
   select sum(provcc_importe)
     into v_credito_cta_cte
   from ProveedorCacheCredito
   where doct_id = v_doct_orden_pago
     and prov_id = p_prov_id
     and emp_id = p_emp_id;

   select empprovd_id
     into v_emp_provd_id
   from EmpresaProveedorDeuda
   where prov_id = p_prov_id
     and emp_id = p_emp_id;

   if coalesce(v_emp_provd_id, 0) <> 0 then

      select empprovd_DeudaCtaCte
        into v_deuda_cta_cte_anterior
      from EmpresaProveedorDeuda
      where empprovd_id = v_emp_provd_id;

      update EmpresaProveedorDeuda
         set empprovd_DeudaCtaCte = coalesce(v_deuda_cta_cte, 0) - coalesce(v_credito_cta_cte, 0),
             empprovd_deudaTotal = empprovd_deudaTotal - coalesce(v_deuda_cta_cte_anterior, 0) + (coalesce(v_deuda_cta_cte, 0) - coalesce(v_credito_cta_cte, 0))
      where empprovd_id = v_emp_provd_id;

   else

      select sp_dbGetNewId('EmpresaProveedorDeuda', 'empprovd_id') into v_emp_provd_id;

      insert into EmpresaProveedorDeuda
        ( empprovd_id, emp_id, prov_id, empprovd_deudaCtaCte, empprovd_deudaTotal )
        values ( v_emp_provd_id, p_emp_id, p_prov_id, coalesce(v_deuda_cta_cte, 0),
                coalesce(v_deuda_cta_cte, 0) - coalesce(v_credito_cta_cte, 0) );

   end if;

   -- Deuda en el cache
   --
   select sum(provcc_importe)
     into v_deuda_doc
   from ProveedorCacheCredito
   where doct_id = v_doct_orden_pago_chq
     and prov_id = p_prov_id;

   -- Deuda en el Proveedor
   --
   select prov_deudaDoc
     into v_deuda_doc_anterior
   from Proveedor
   where prov_id = p_prov_id;

   update Proveedor
      set prov_deudaDoc = coalesce(v_deuda_doc, 0),
          prov_deudaTotal = prov_deudaTotal - coalesce(v_deuda_doc_anterior, 0) + coalesce(v_deuda_doc, 0)
   where prov_id = p_prov_id;

   -- Actualizo la deuda en la tabla EmpresaProveedorDeuda
   --
   v_deuda_doc := 0;
   v_deuda_doc_anterior := 0;

   -- Deuda en el cache para la empresa del documento modificado
   --
   select sum(provcc_importe)
     into v_deuda_doc
   from ProveedorCacheCredito
   where doct_id = v_doct_orden_pago_chq
     and prov_id = p_prov_id
     and emp_id = p_emp_id;

   v_emp_provd_id := null;

   select empprovd_id
     into v_emp_provd_id
   from EmpresaProveedorDeuda
   where prov_id = p_prov_id
     and emp_id = p_emp_id;

   if coalesce(v_emp_provd_id, 0) <> 0 then

      select empprovd_DeudaDoc
        into v_deuda_doc_anterior
      from EmpresaProveedorDeuda
      where empprovd_id = v_emp_provd_id;

      update EmpresaProveedorDeuda
         set empprovd_DeudaDoc = coalesce(v_deuda_doc, 0),
             empprovd_deudaTotal = empprovd_deudaTotal - coalesce(v_deuda_doc_anterior, 0) + coalesce(v_deuda_doc, 0)
      where empprovd_id = v_emp_provd_id;

   else

      select sp_dbGetNewId('EmpresaProveedorDeuda', 'empprovd_id') into v_emp_provd_id;

      insert into EmpresaProveedorDeuda( empprovd_id, prov_id, emp_id, empprovd_deudaDoc, empprovd_deudaTotal )
      values ( v_emp_provd_id, p_prov_id, p_emp_id, coalesce(v_deuda_doc, 0), coalesce(v_deuda_doc, 0) );

   end if;

end;
$BODY$
  language plpgsql volatile
  cost 100;
alter function sp_proveedor_update_credito(integer, integer)
  owner to postgres;