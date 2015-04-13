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
-- Function: sp_auditoria_estado_check_doc_fc()

-- drop function sp_auditoria_estado_check_doc_fc(integer);

create or replace function sp_auditoria_estado_check_doc_fc
(
  in p_fc_id integer,
  out p_success integer,
  out p_error_msg varchar
)
  returns record as
$BODY$
declare
   v_error smallint;
   v_doct_id integer;
   v_fc_nrodoc varchar(50);
   v_fc_numero varchar(50);
   v_fc_pendiente decimal(18,6);
   v_est_id integer;
begin

   v_error := 0;
   p_success := 0;
   p_error_msg := '@@ERROR_SP:';

   select doct_id,
          fc_nrodoc,
          trim(to_char(fc_numero)),
          est_id
     into v_doct_id,
          v_fc_nrodoc,
          v_fc_numero,
          v_est_id
   from FacturaCompra
   where fc_id = p_fc_id;

   if exists ( select *
               from FacturaCompraItem fci
               where (fci.fci_pendiente
                      + (coalesce(( select sum(rcfc_cantidad)
                                    from RemitoFacturaCompra
                                    where fci_id = fci.fci_id ), 0))
                      + (coalesce(( select sum(ocfc_cantidad)
                                    from OrdenFacturaCompra
                                    where fci_id = fci.fci_id ), 0))
                     ) <> fci.fci_cantidadaremitir
                 and fci.fc_id = p_fc_id ) then

      v_error := 1;
      p_error_msg := p_error_msg
                     || 'El pendiente de los items de esta factura no coincide con la suma de sus aplicaciones'
                     || CHR(10);

   end if;

   if v_est_id <> 7 and v_est_id <> 5 and v_est_id <> 4 then

      select fc_pendiente
        into v_fc_pendiente
      from FacturaCompra
      where fc_id = p_fc_id;

      if v_fc_pendiente = 0 then

         v_error := 1;
         p_error_msg := p_error_msg
                        || 'La factura no tiene vencimientos pendientes y su estado no es finalizado, o anulado, o pendiente de firma'
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
alter function sp_auditoria_estado_check_doc_fc(integer)
  owner to postgres;