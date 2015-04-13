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
-- Function: sp_auditoria_credito_check_doc_fc()

-- drop function sp_auditoria_credito_check_doc_fc(integer);

create or replace function sp_auditoria_credito_check_doc_fc
(
  in p_fc_id integer,
  out p_success integer,
  out p_error_msg varchar
)
  returns record as
$BODY$
declare
   v_error smallint;

   v_fc_nrodoc varchar(50);
   v_fc_numero varchar(50);
   v_fc_pendiente decimal(18,6);
   v_fc_total decimal(18,6);

   v_doct_id integer;
   v_doct_facturaCpra integer := 2;
   v_emp_id integer;
   v_est_id integer;
   v_prov_id integer;

   v_aplicado decimal(18,6);
   v_pendiente decimal(18,6);
   v_cache decimal(18,6);
begin

   v_error := 0;
   p_success := 0;
   p_error_msg := '@@ERROR_SP:';

   select fc.doct_id,
          fc.fc_nrodoc,
          trim(to_char(fc.fc_numero)),
          fc.est_id,
          fc.fc_pendiente,
          fc.fc_total,
          fc.prov_id,
          doc.emp_id
     into v_doct_id,
          v_fc_nrodoc,
          v_fc_numero,
          v_est_id,
          v_fc_pendiente,
          v_fc_total,
          v_prov_id,
          v_emp_id
   from FacturaCompra fc
   join Documento doc
     on fc.doc_id = doc.doc_id
   where fc.fc_id = p_fc_id;

   if exists ( select prov_id
               from ProveedorCacheCredito
               where prov_id <> v_prov_id
                 and doct_id = v_doct_facturaCpra
                 and id = p_fc_id ) then

      v_error := 1;
      p_error_msg := p_error_msg || 'Esta factura esta afectando el cache de credito de otro Proveedor' || CHR(10);

   end if;

   select sum(fcd_pendiente)
     into v_pendiente
   from FacturaCompraDeuda
   where fc_id = p_fc_id;

   v_pendiente := coalesce(v_pendiente, 0);

   if v_doct_id = 8 /* nota de credito */ then
      v_pendiente := -v_pendiente;
   end if;

   if v_pendiente <> 0 then

      if not exists ( select id
                      from ProveedorCacheCredito
                      where prov_id = v_prov_id
                        and doct_id = v_doct_facturaCpra
                        and id = p_fc_id ) then

         v_error := 1;
         p_error_msg := p_error_msg
                        || 'Esta factura tiene pendiente y no hay registro en el cache de credito'
                        || CHR(10);

      else

         select sum(provcc_importe)
           into v_cache
         from ProveedorCacheCredito
         where prov_id = v_prov_id
           and doct_id = v_doct_facturaCpra
           and id = p_fc_id
           and emp_id = v_emp_id;

         v_cache := coalesce(v_cache, 0);

         if abs(v_pendiente - v_cache) >= 0.01 then

            v_error := 1;
            p_error_msg := p_error_msg
                           || 'Esta factura tiene un pendiente distinto al que figura en el cache de credito'
                           || CHR(10);

         end if;

      end if;

   else

      if exists ( select id
                  from ProveedorCacheCredito
                  where prov_id = v_prov_id
                    and doct_id = v_doct_facturaCpra
                    and id = p_fc_id ) then

         v_error := 1;
         p_error_msg := p_error_msg
                        || 'Esta factura no tiene pendiente y tiene registro en el cache de credito'
                        || CHR(10);

      end if;

   end if;

   -- no hubo errores asi que todo bien
   --
   if v_error = 0 then
      p_success := 1;
   end if;

end;
$BODY$
  language plpgsql volatile
  cost 100;
alter function sp_auditoria_credito_check_doc_fc(integer)
  owner to postgres;