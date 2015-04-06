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
-- Function: sp_proveedor_update_remito_credito()

-- drop function sp_proveedor_update_remito_credito(integer, integer);

create or replace function sp_proveedor_update_remito_credito
(
  in p_prov_id integer,
  in p_emp_id integer
)
  returns void as
$BODY$
declare
   v_deudaRemitoAnterior decimal(18,6);
   v_deudaRemito decimal(18,6);
   v_empprovd_id integer;
   v_doct_remitocompra integer := 4;
begin

   -- deuda en el cache
   --
   select sum(provcc_importe)
     into v_deudaRemito
   from ProveedorCacheCredito
   where doct_id = v_doct_remitocompra
     and prov_id = p_prov_id;

   -- deuda en el proveedor
   --
   select prov_deudaRemito
     into v_deudaRemitoAnterior
   from Proveedor
   where prov_id = p_prov_id;

   update Proveedor
      set prov_deudaRemito = coalesce(v_deudaRemito, 0),
          prov_deudaTotal = prov_deudaTotal - coalesce(v_deudaRemitoAnterior, 0) + coalesce(v_deudaRemito, 0)
   where prov_id = p_prov_id;

   -- actualizo la deuda en la tabla empresaproveedordeuda
   --
   v_deudaRemito := 0;
   v_deudaRemitoAnterior := 0;

   -- deuda en el cache para la empresa del documento modificado
   --
   select sum(provcc_importe)
     into v_deudaRemito
   from ProveedorCacheCredito
   where doct_id = v_doct_remitocompra
     and prov_id = p_prov_id
     and emp_id = p_emp_id;

   select empprovd_id
     into v_empprovd_id
   from EmpresaProveedorDeuda
   where prov_id = p_prov_id
     and emp_id = p_emp_id;

   if coalesce(v_empprovd_id, 0) <> 0 then

      select empprovd_deudaRemito
        into v_deudaRemitoAnterior
      from EmpresaProveedorDeuda
      where empprovd_id = v_empprovd_id;

      update EmpresaProveedorDeuda
         set empprovd_deudaRemito = coalesce(v_deudaRemito, 0),
             empprovd_deudaTotal = empprovd_deudaTotal - coalesce(v_deudaRemitoAnterior, 0) + coalesce(v_deudaRemito, 0)
      where empprovd_id = v_empprovd_id;

   else
      select sp_dbGetNewId('EmpresaProveedorDeuda', 'empprovd_id') into v_empprovd_id;

      insert into EmpresaProveedorDeuda( empprovd_id, emp_id, prov_id, empprovd_deudaRemito, empprovd_deudaTotal )
      values ( v_empprovd_id, p_emp_id, p_prov_id, coalesce(v_deudaRemito, 0), coalesce(v_deudaRemito, 0) );

   end if;

end;
$BODY$
  language plpgsql volatile
  cost 100;
alter function sp_proveedor_update_remito_credito(integer, integer)
  owner to postgres;
