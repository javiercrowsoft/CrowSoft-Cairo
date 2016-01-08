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
-- Function: sp_auditoria_estado_check_doc_cobz()

-- drop function sp_auditoria_estado_check_doc_cobz(integer);

create or replace function sp_auditoria_estado_check_doc_cobz
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
begin

   v_error := 0;
   p_success := 0;
   p_error_msg := '@@ERROR_SP:';

   select doct_id,
          cobz_nrodoc,
          trim(to_char(cobz_numero)),
          est_id,
          cobz_pendiente,
          cobz_total
     into v_doct_id,
          v_cobz_nrodoc,
          v_cobz_numero,
          v_est_id,
          v_cobz_pendiente,
          v_cobz_total
   from Cobranza
   where cobz_id = p_cobz_id;

   select (coalesce(t.aplicado, 0)) into v_aplicado
   from ( select sum(fvcobz_importe) aplicado
          from FacturaVentaCobranza
          where cobz_id = p_cobz_id ) t;

   if abs(round(v_cobz_total, 2) - round(v_cobz_pendiente + v_aplicado, 2)) > 0.01 then

      v_error := 1;
      p_error_msg := p_error_msg
                     || 'El pendiente de la cobranza no coincide con la suma de sus aplicaciones'
                     || CHR(10);

   end if;

   if v_est_id <> 7 and v_est_id <> 5 and v_est_id <> 4 then

      if round(v_cobz_pendiente, 2) = 0 then

         v_error := 1;
         p_error_msg := p_error_msg
                        || 'La cobranza no tiene pendiente y su estado no es finalizado, o anulado, o pendiente de firma'
                        || CHR(10);
      end if;

   end if;

   if exists ( select 1
               from CobranzaItem
               where cue_id in ( select cue_id
                                 from RetencionTipo  )
                 and ret_id is null
                 and cobz_id = p_cobz_id
                 and cobzi_tipo = 4 ) then

      v_error := 1;
      p_error_msg := p_error_msg
                     || 'Debe indicar la retencion para los items de tipo otro de cuentas de retenciones'
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
alter function sp_auditoria_estado_check_doc_cobz(integer)
  owner to postgres;