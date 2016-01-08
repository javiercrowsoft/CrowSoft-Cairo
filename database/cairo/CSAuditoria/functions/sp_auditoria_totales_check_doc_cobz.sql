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
-- Function: sp_auditoria_totales_check_doc_cobz()

-- drop function sp_auditoria_totales_check_doc_cobz(integer);
                           
create or replace function sp_auditoria_totales_check_doc_cobz
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
   v_cobz_total decimal(18,6);
   v_cobz_otros decimal(18,6);
   v_importe decimal(18,6);
begin

   v_error := 0;
   p_success := 0;
   p_error_msg := '@@ERROR_SP:';

   select doct_id,
          cobz_nrodoc,
          trim(to_char(cobz_numero)),
          cobz_total,
          cobz_otros
     into v_doct_id,
          v_cobz_nrodoc,
          v_cobz_numero,
          v_cobz_total,
          v_cobz_otros
   from Cobranza
   where cobz_id = p_cobz_id;

   select sum(case cobzi_otrotipo
                when 2 then -cobzi_importe
                else cobzi_importe
              end)
     into v_importe
   from CobranzaItem
   where cobz_id = p_cobz_id
     and cobzi_tipo <> 5 -- Cuenta corriente
   group by cobz_id;

   v_importe := coalesce(v_importe, 0);

   if abs(round(v_importe, 2) - round(v_cobz_total, 2)) > 0.01 then

      v_error := 1;
      p_error_msg := p_error_msg
                     || 'El total de esta cobranza no coincide con la suma de los totales de sus items'
                     || CHR(10);

   end if;

   v_importe := 0;

   select sum(case cobzi_otrotipo
                when 2 then -cobzi_importe
                else cobzi_importe
              end)
     into v_importe
   from CobranzaItem
   where cobz_id = p_cobz_id
     and cobzi_tipo = 4 -- Otros
   group by cobz_id;

   v_importe := coalesce(v_importe, 0);

   if abs(round(v_importe, 2) - round(v_cobz_otros, 2)) > 0.01 then

      v_error := 1;
      p_error_msg := p_error_msg
                     || 'El total de otros de esta cobranza no coincide con la suma de los totales de sus items de tipo otros'
                     || CHR(10);

   end if;

   if not exists ( select cobz_id
                   from CobranzaItem
                   where cobz_id = p_cobz_id ) then

      v_error := 1;
      p_error_msg := p_error_msg
                     || 'Esta cobranza no contiene items. Todas las cobranzas deben tener almenos dos items uno de cuenta corriente y otro de un medio de pago.'
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
alter function sp_auditoria_totales_check_doc_cobz(integer)
  owner to postgres;