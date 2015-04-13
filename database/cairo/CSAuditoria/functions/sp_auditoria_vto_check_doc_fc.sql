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
-- Function: sp_auditoria_vto_check_doc_fc()

-- drop function sp_auditoria_vto_check_doc_fc(integer);

create or replace function sp_auditoria_vto_check_doc_fc
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
   v_fc_descuento1 decimal(18,6);
   v_fc_descuento2 decimal(18,6);
   v_fc_totalotros decimal(18,6);
   v_fc_totalpercepciones decimal(18,6);
   v_fc_totaldeuda decimal(18,6);

   v_doct_id integer;
   v_est_id integer;

   v_vto decimal(18,6);
   v_deuda decimal(18,6);
   v_pagos decimal(18,6);
   v_total decimal(18,6);
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

   -- 1 si esta anulado no tiene que tener deuda ni pendiente en items
   --
   if v_est_id = 7 then

      if exists ( select *
                  from FacturaCompraDeuda
                  where fc_id = p_fc_id ) then

         v_error := 1;
         p_error_msg := p_error_msg || 'La factura esta anulada y posee deuda' || CHR(10);

      end if;

      if exists ( select *
                  from FacturaCompraPago
                  where fc_id = p_fc_id ) then

         v_error := 1;
         p_error_msg := p_error_msg || 'La factura esta anulada y posee pagos' || CHR(10);

      end if;

      if exists ( select *
                  from FacturaCompraItem
                  where fc_id = p_fc_id
                    and fci_pendiente <> 0 ) then

         v_error := 1;
         p_error_msg := p_error_msg || 'La factura esta anulada y posee pendiente en sus items' || CHR(10);

      end if;

   else

      select sum(fcd_importe)
        into v_deuda
      from FacturaCompraDeuda
      where fc_id = p_fc_id;

      select sum(fcp_importe)
        into v_pagos
      from FacturaCompraPago
      where fc_id = p_fc_id;

      select fc_descuento1,
             fc_descuento2,
             fc_totalotros,
             fc_totalpercepciones,
             fc_pendiente
        into v_fc_descuento1,
             v_fc_descuento2,
             v_fc_totalotros,
             v_fc_totalpercepciones,
             v_fc_pendiente
      from FacturaCompra
      where fc_id = p_fc_id;

      select sum(fci.fci_importe)
        into v_fc_totaldeuda
      from FacturaCompraItem fci
      join TipoOperacion t
        on fci.to_id = t.to_id
      where fci.fc_id = p_fc_id
        and t.to_generadeuda <> 0;

      v_fc_totaldeuda := v_fc_totaldeuda - ((v_fc_totaldeuda * v_fc_descuento1) / 100);
      v_fc_totaldeuda := v_fc_totaldeuda - ((v_fc_totaldeuda * v_fc_descuento2) / 100);
      v_fc_totaldeuda := v_fc_totaldeuda + v_fc_totalotros + v_fc_totalpercepciones;
      v_total := coalesce(v_fc_totaldeuda, 0);
      v_vto := coalesce(v_deuda, 0) + coalesce(v_pagos, 0);

      if abs(round(v_vto - v_total, 2)) > 0.10 then

         v_error := 1;
         p_error_msg := p_error_msg
                        || 'El total de la factura no coincide con el total de su deuda' || CHR(10)
                        || 'Dif: ' || (round(v_vto - v_total, 2))::varchar || CHR(10)
                        || 'Total: ' || (round(v_total, 2))::varchar || CHR(10)
                        || 'Deuda: ' || (round(v_vto, 2))::varchar || CHR(10);

      end if;

      select sum(fcd_pendiente)
        into v_deuda
      from FacturaCompraDeuda
      where fc_id = p_fc_id;

      if abs(round(v_fc_pendiente - coalesce(v_deuda, 0), 2)) > 0.10 then

         v_error := 1;
         p_error_msg := p_error_msg || 'El pendiente de la factura no coincide con el total de su deuda' || CHR(10);

      end if;

      if exists ( select *
                  from FacturaCompraDeuda fcd
                  where abs(
                            round((fcd.fcd_pendiente
                                   + (coalesce(( select sum(fcopg_importe)
                                                 from FacturaCompraOrdenPago
                                                 where fcd_id = fcd.fcd_id ), 0)
                                   + coalesce(( select sum(fcnc_importe)
                                                from FacturaCompraNotaCredito
                                                where ( fcd_id_factura = fcd.fcd_id and v_doct_id in ( 2,10 ) )
                                                  or ( fcd_id_notacredito = fcd.fcd_id and v_doct_id = 8 ) ), 0)
                                     )
                                  ) - fcd.fcd_importe, 2)) > 0.10
                    and fc_id = p_fc_id ) then

         v_error := 1;
         p_error_msg := p_error_msg
                        || 'El importe de la deuda de esta factura no coincide con la suma de sus aplicaciones'
                        || CHR(10);

      end if;

      if exists ( select *
                  from FacturaCompraPago fcp
                  where abs(
                            round(fcp.fcp_importe
                                  - (coalesce(( select sum(fcopg_importe)
                                                from FacturaCompraOrdenPago
                                                where fcp_id = fcp.fcp_id ), 0)
                                  + coalesce(( select sum(fcnc_importe)
                                               from FacturaCompraNotaCredito
                                               where ( fcp_id_factura = fcp.fcp_id and v_doct_id in ( 2,10 ) )
                                                  or ( fcp_id_notacredito = fcp.fcp_id
                                                 and v_doct_id = 8 ) ), 0)), 2)
                           ) > 0.10
                    and fc_id = p_fc_id ) then

         v_error := 1;
         p_error_msg := p_error_msg
                        || 'El importe del pago de esta factura no coincide con la suma de sus aplicaciones'
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
alter function sp_auditoria_vto_check_doc_fc(integer)
  owner to postgres;