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
-- Function: sp_auditoria_credito_check_doc_pv_cliente()

-- drop function sp_auditoria_credito_check_doc_pv_cliente(integer);

create or replace function sp_auditoria_credito_check_doc_pv_cliente
(
  in p_pv_id integer,
  out p_success integer,
  out p_error_msg varchar
)
  returns record as
$BODY$
declare
   v_error smallint;
   v_doct_id integer;
   v_pv_nrodoc varchar(50);
   v_pv_numero varchar(50);
   v_est_id integer;
   v_pv_pendiente decimal(18,6);
   v_pv_total decimal(18,6);
   v_aplicado decimal(18,6);
   v_cli_id integer;
   v_doct_pedidoVta integer;
   v_emp_id integer;
   v_desc1 decimal(18,6);
   v_desc2 decimal(18,6);
   v_pendiente decimal(18,6);
   v_cache decimal(18,6);
   v_cotizacion decimal(18,6);
   v_mon_id integer;
   v_fecha date;
begin

   v_error := 0;
   p_success := 0;
   p_error_msg := '@@ERROR_SP:';

   v_doct_pedidoVta := 5;

   select doct_id,
          pv_nrodoc,
          trim(to_char(pv_numero)),
          est_id,
          pv_pendiente,
          pv_total,
          cli_id,
          emp_id
     into v_doct_id,
          v_pv_nrodoc,
          v_pv_numero,
          v_est_id,
          v_pv_pendiente,
          v_pv_total,
          v_cli_id,
          v_emp_id
   from PedidoVenta
   where pv_id = p_pv_id;

   if exists ( select cli_id
               from ClienteCacheCredito
               where cli_id <> v_cli_id
                 and doct_id = v_doct_pedidoVta
                 and id = p_pv_id ) then

      v_error := 1;
      p_error_msg := p_error_msg || 'Este pedido esta afectando el cache de credito de otro cliente' || CHR(10);

   end if;

   select pv.pv_descuento1,
          pv.pv_descuento2,
          doc.mon_id
     into v_desc1,
          v_desc2,
          v_mon_id
   from PedidoVenta pv
   join Documento doc
     on pv.doc_id = doc.doc_id
   where pv.pv_id = p_pv_id;

   select sum(pvi_pendiente * (pvi_importe / pvi_cantidad))
     into v_pendiente
   from PedidoVentaItem
   where pv_id = p_pv_id;

   v_pendiente := coalesce(v_pendiente, 0) - (coalesce(v_pendiente, 0) * v_desc1 / 100);
   v_pendiente := coalesce(v_pendiente, 0) - (coalesce(v_pendiente, 0) * v_desc2 / 100);
   v_fecha := CURRENT_TIMESTAMP;

   select sp_moneda_get_cotizacion(v_mon_id, v_fecha) into v_cotizacion;

   if not exists ( select *
                   from Moneda
                   where mon_id = v_mon_id
                     and mon_legal <> 0 ) then

      if v_cotizacion > 0 then
         v_pendiente := v_pendiente * v_cotizacion;
      end if;

   end if;

   if v_doct_id = 22 then /* devolucion */
      v_pendiente := -v_pendiente;
   end if;

   if abs(v_pendiente) >= 0.01 then

      if not exists ( select id
                      from ClienteCacheCredito
                      where cli_id = v_cli_id
                        and doct_id = v_doct_pedidoVta
                        and id = p_pv_id ) then

         v_error := 1;
         p_error_msg := p_error_msg || 'Este pedido tiene pendiente y no hay registro en el cache de credito' || CHR(10);

      else

         select sum(clicc_importe)
           into v_cache
         from ClienteCacheCredito
         where cli_id = v_cli_id
           and doct_id = v_doct_pedidoVta
           and id = p_pv_id
           and emp_id = v_emp_id;

         v_cache := coalesce(v_cache, 0);

         if abs(v_pendiente - v_cache) >= 0.015 then

            v_error := 1;
            p_error_msg := p_error_msg || 'Este pedido tiene un pendiente distinto al que figura en el cache de credito' || CHR(10) || 'Pendiente: ' || CAST(v_pendiente as varchar) || CHR(10) || 'Cache: ' || CAST(v_cache as varchar) || CHR(10) || 'Dif: ' || CAST(abs(v_pendiente - v_cache) as varchar);

         end if;

      end if;

   else

      if exists ( select id
                  from ClienteCacheCredito
                  where cli_id = v_cli_id
                    and doct_id = v_doct_pedidoVta
                    and id = p_pv_id ) then

         v_error := 1;
         p_error_msg := p_error_msg || 'Este pedido no tiene pendiente y tiene registro en el cache de credito' || CHR(10);

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
alter function sp_auditoria_credito_check_doc_pv_cliente(integer)
  owner to postgres;