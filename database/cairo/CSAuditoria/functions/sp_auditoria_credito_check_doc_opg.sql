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
-- Function: sp_auditoria_credito_check_doc_opg()

-- drop function sp_auditoria_credito_check_doc_opg(integer);

create or replace
function sp_auditoria_credito_check_doc_opg
(
  in p_opg_id integer,
  out p_success integer,
  out p_error_msg varchar
)
  returns record as
$BODY$
declare
   v_error smallint;
   v_doct_id integer;
   v_opg_nrodoc varchar(50);
   v_opg_numero varchar(50);
   v_est_id integer;
   v_opg_pendiente decimal(18,6);
   v_opg_total decimal(18,6);
   v_aplicado decimal(18,6);
   v_prov_id integer;
   v_doct_OrdenPago integer;
   v_emp_id integer;
   v_pendiente decimal(18,6);
   v_cache decimal(18,6);
begin

   v_error := 0;
   p_success := 0;
   p_error_msg := '@@ERROR_SP:';

   v_doct_OrdenPago := 16;

   select doct_id,
          opg_nrodoc,
          trim(to_char(opg_numero)),
          est_id,
          opg_pendiente,
          opg_total,
          prov_id,
          emp_id
     into v_doct_id,
          v_opg_nrodoc,
          v_opg_numero,
          v_est_id,
          v_opg_pendiente,
          v_opg_total,
          v_prov_id,
          v_emp_id
   from OrdenPago
   where opg_id = p_opg_id;

   if exists ( select prov_id
               from ProveedorCacheCredito
               where prov_id <> v_prov_id
                 and doct_id = v_doct_OrdenPago
                 and id = p_opg_id ) then

      v_error := 1;
      p_error_msg := p_error_msg
                     || 'Esta orden de pago esta afectando el cache de credito de otro proveedor'
                     || CHR(10);

   end if;

   v_pendiente := round(v_opg_pendiente, 2);

   if abs(v_pendiente) >= 0.01 then

      if not exists ( select id
                      from ProveedorCacheCredito
                      where prov_id = v_prov_id
                        and doct_id = v_doct_OrdenPago
                        and id = p_opg_id ) then

         v_error := 1;
         p_error_msg := p_error_msg
                        || 'Esta orden de pago tiene pendiente y no hay registro en el cache de credito'
                        || CHR(10);


      else

         select sum(provcc_importe)
           into v_cache
         from ProveedorCacheCredito
         where prov_id = v_prov_id
           and doct_id = v_doct_OrdenPago
           and id = p_opg_id
           and emp_id = v_emp_id;

         v_cache := coalesce(v_cache, 0);

         if abs(v_pendiente - v_cache) > 0.01 then

            v_error := 1;
            p_error_msg := p_error_msg
                           || 'Esta orden de pago tiene un pendiente distinto al que figura en el cache de credito'
                           || CHR(10);

         end if;

      end if;

   else

      if exists ( select id
                  from ProveedorCacheCredito
                  where prov_id = v_prov_id
                    and doct_id = v_doct_OrdenPago
                    and id = p_opg_id ) then

         v_error := 1;
         p_error_msg := p_error_msg
                        || 'Esta orden de pago no tiene pendiente y tiene registro en el cache de credito'
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
alter function sp_auditoria_estado_check_doc_oc(integer)
  owner to postgres;