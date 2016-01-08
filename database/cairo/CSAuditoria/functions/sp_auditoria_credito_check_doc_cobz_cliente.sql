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
-- Function: sp_auditoria_credito_check_doc_cobz_cliente()

-- drop function sp_auditoria_credito_check_doc_cobz_cliente(integer);

create or replace function sp_auditoria_credito_check_doc_cobz_cliente
(
  in p_cobz_id integer,
  out p_success integer,
  out p_error_msg varchar
)
  returns record as
$BODY$
declare
   v_error smallint;
   v_doct_id integer;
   v_cobz_nrodoc varchar(50);
   v_cobz_numero varchar(50);
   v_est_id integer;
   v_cobz_pendiente decimal(18,6);
   v_cobz_total decimal(18,6);
   v_aplicado decimal(18,6);
   v_cli_id integer;
   v_doct_cobranza integer := 13;
   v_emp_id integer;
   v_pendiente decimal(18,6);
   v_cache decimal(18,6);
begin

   v_error := 0;
   p_success := 0;
   p_error_msg := '@@ERROR_SP:';

   select doct_id,
          cobz_nrodoc,
          trim(to_char(cobz_numero)),
          est_id,
          cobz_pendiente,
          cobz_total,
          cli_id,
          emp_id
     into v_doct_id,
          v_cobz_nrodoc,
          v_cobz_numero,
          v_est_id,
          v_cobz_pendiente,
          v_cobz_total,
          v_cli_id,
          v_emp_id
   from Cobranza
   where cobz_id = p_cobz_id;

   if exists ( select cli_id
               from ClienteCacheCredito
               where cli_id <> v_cli_id
                 and doct_id = v_doct_cobranza
                 and id = p_cobz_id ) then
   
      v_error := 1;
      p_error_msg := p_error_msg 
                     || 'Esta cobranza esta afectando el cache de credito de otro cliente ' 
                     || CHR(10);

   end if;

   v_pendiente := round(v_cobz_pendiente, 2);

   if abs(v_pendiente) >= 0.01 then

      if not exists ( select id
                      from ClienteCacheCredito
                      where cli_id = v_cli_id
                        and doct_id = v_doct_cobranza
                        and id = p_cobz_id ) then
      
         v_error := 1;
         p_error_msg := p_error_msg 
                        || 'Esta cobranza tiene pendiente y no hay registro en el cache de credito' 
                        || CHR(10);

      else
         
         select sum(clicc_importe)
           into v_cache
         from ClienteCacheCredito
         where cli_id = v_cli_id
           and doct_id = v_doct_cobranza
           and id = p_cobz_id
           and emp_id = v_emp_id;

         v_cache := coalesce(v_cache, 0);

         if abs(v_pendiente - v_cache) > 0.01 then
         
            v_error := 1;
            p_error_msg := p_error_msg 
                           || 'Esta cobranza tiene un pendiente distinto al que figura en el cache de credito' 
                           || CHR(10);

         end if;

      end if;

   else

      if exists ( select id
                  from ClienteCacheCredito
                  where cli_id = v_cli_id
                    and doct_id = v_doct_cobranza
                    and id = p_cobz_id ) then

         v_error := 1;
         p_error_msg := p_error_msg 
                        || 'Esta cobranza no tiene pendiente y tiene registro en el cache de credito' 
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
alter function sp_auditoria_credito_check_doc_cobz_cliente(integer)
  owner to postgres;