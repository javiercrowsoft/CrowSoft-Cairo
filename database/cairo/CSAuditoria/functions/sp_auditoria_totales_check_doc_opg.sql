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
-- Function: sp_auditoria_totales_check_doc_opg()

-- drop function sp_auditoria_totales_check_doc_opg(integer);

create or replace function sp_auditoria_totales_check_doc_opg
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
   v_opg_total decimal(18,6);
   v_opg_otros decimal(18,6);
   v_importe decimal(18,6);
begin

   v_error := 0;
   p_success := 0;
   p_error_msg := '@@ERROR_SP:';

   select doct_id,
          opg_nrodoc,
          trim(to_char(opg_numero)),
          opg_total,
          opg_otros
     into v_doct_id,
          v_opg_nrodoc,
          v_opg_numero,
          v_opg_total,
          v_opg_otros
   from OrdenPago
   where opg_id = p_opg_id;

   select sum(case opgi_otrotipo
                 when 1 then -opgi_importe
                 else opgi_importe
              end)
     into v_importe
   from OrdenPagoItem
   where opg_id = p_opg_id
     and opgi_tipo <> 5 -- cuenta corriente
   group by opg_id;

   v_importe := coalesce(v_importe, 0);

   if abs(round(v_importe, 2) - round(v_opg_total, 2)) > 0.01 then

      v_error := 1;
      p_error_msg := p_error_msg
                     || 'El total de esta orden de pago no coincide con la suma de los totales de sus items'
                     || CHR(10);

   end if;

   v_importe := 0;

   select sum(case opgi_otrotipo
                 when 1 then -opgi_importe
                 else opgi_importe
              end)
     into v_importe
   from OrdenPagoItem
   where opg_id = p_opg_id and opgi_tipo = 4 -- otros
   group by opg_id;

   v_importe := coalesce(v_importe, 0);

   if abs(round(v_importe, 2) - round(v_opg_otros, 2)) > 0.01 then

      v_error := 1;
      p_error_msg := p_error_msg
                     || 'El total de otros de esta orden de pago no coincide con la suma de los totales de sus items de tipo otros'
                     || CHR(10) || 'Dif: ' || (round(v_importe, 2) - round(v_opg_otros, 2))::varchar
                     || CHR(10) || 'Total: ' || (round(v_opg_otros, 2))::varchar
                     || CHR(10) || 'Deuda: ' || (round(v_importe, 2))::varchar
                     || CHR(10);

   end if;

   if not exists ( select opg_id
                   from OrdenPagoItem
                   where opg_id = p_opg_id ) then

      v_error := 1;
      p_error_msg := p_error_msg
                     || 'Esta orden de pago no contiene items. Todas las ordens de pago deben tener almenos dos items uno de cuenta corriente y otro de un medio de pago.'
                     || CHR(10);

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
alter function sp_auditoria_totales_check_doc_opg(integer)
  owner to postgres;