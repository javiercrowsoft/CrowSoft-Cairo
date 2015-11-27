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
-- Function: sp_auditoria_vto_check_doc_fv()

-- drop function sp_auditoria_vto_check_doc_fv(integer);

create or replace function sp_auditoria_vto_check_doc_fv
(
  in p_fv_id integer,
  out p_success integer,
  out p_error_msg varchar
)
  returns record as
$BODY$
declare
   v_error smallint;

   v_fv_nrodoc varchar(50);
   v_fv_numero varchar(50);

   v_fv_pendiente decimal(18,6);
   v_fv_descuento1 decimal(18,6);
   v_fv_descuento2 decimal(18,6);
   v_fv_totalpercepciones decimal(18,6);
   v_fv_totaldeuda decimal(18,6);

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
          fv_nrodoc,
          trim(to_char(fv_numero)),
          est_id
     into v_doct_id,
          v_fv_nrodoc,
          v_fv_numero,
          v_est_id
   from FacturaVenta
   where fv_id = p_fv_id;

   -- 1 si esta anulado no tiene que tener deuda ni pendiente en items
   --
   if v_est_id = 7 then

      if exists ( select *
                  from FacturaVentaDeuda
                  where fv_id = p_fv_id ) then

         v_error := 1;
         p_error_msg := p_error_msg
                        || 'La factura esta anulada y posee deuda'
                        || CHR(10);

      end if;

      if exists ( select *
                  from FacturaVentaPago
                  where fv_id = p_fv_id ) then

         v_error := 1;
         p_error_msg := p_error_msg
                        || 'La factura esta anulada y posee pagos'
                        || CHR(10);

      end if;

      if exists ( select *
                  from FacturaVentaItem
                  where fv_id = p_fv_id
                    and fvi_pendiente <> 0 ) then

         v_error := 1;
         p_error_msg := p_error_msg
                        || 'La factura esta anulada y posee pendiente en sus items'
                        || CHR(10);

      end if;

   else

      select sum(fvd_importe)
        into v_deuda
      from FacturaVentaDeuda
      where fv_id = p_fv_id;

      select sum(fvp_importe)
        into v_pagos
      from FacturaVentaPago
      where fv_id = p_fv_id;

      select fv_descuento1,
             fv_descuento2,
             fv_totalpercepciones,
             fv_pendiente
        into v_fv_descuento1,
             v_fv_descuento2,
             v_fv_totalpercepciones,
             v_fv_pendiente
      from FacturaVenta
      where fv_id = p_fv_id;

      select sum(fvi.fvi_importe)
        into v_fv_totaldeuda
      from FacturaVentaItem fvi
      join TipoOperacion t
        on fvi.to_id = t.to_id
      where fvi.fv_id = p_fv_id
        and t.to_generadeuda <> 0;

      v_fv_totaldeuda := v_fv_totaldeuda - ((v_fv_totaldeuda * v_fv_descuento1) / 100);
      v_fv_totaldeuda := v_fv_totaldeuda - ((v_fv_totaldeuda * v_fv_descuento2) / 100);
      v_fv_totaldeuda := v_fv_totaldeuda + v_fv_totalpercepciones;
      v_total := coalesce(v_fv_totaldeuda, 0);
      v_vto := coalesce(v_deuda, 0) + coalesce(v_pagos, 0);

      if abs(round(v_vto - v_total, 2)) > 0.01 then

         v_error := 1;
         p_error_msg := p_error_msg
                        || 'El total de la factura no coincide con el total de su deuda'
                        || CHR(10);

      end if;

      select sum(fvd_pendiente)
        into v_deuda
      from FacturaVentaDeuda
      where fv_id = p_fv_id;

      if abs(round(v_fv_pendiente - coalesce(v_deuda, 0), 2)) > 0.01 then

         v_error := 1;
         p_error_msg := p_error_msg
                        || 'El pendiente de la factura no coincide con el total de su deuda'
                        || CHR(10);

      end if;

      if exists ( select *
                  from FacturaVentaDeuda fvd
                  where abs(
                            round((fvd.fvd_pendiente
                                   + (coalesce(( select sum(fvcobz_importe)
                                                 from FacturaVentaCobranza
                                                 where fvd_id = fvd.fvd_id ), 0)
                                   + coalesce(( select sum(fvnc_importe)
                                                from FacturaVentaNotaCredito
                                                where ( fvd_id_factura = fvd.fvd_id and v_doct_id in ( 1,9 ) )
                                                   or ( fvd_id_notacredito = fvd.fvd_id and v_doct_id = 7 )
                                              ), 0)
                                     )
                                  ) - fvd.fvd_importe, 2)) > 0.01
                    and fvd.fv_id = p_fv_id ) then

         v_error := 1;
         p_error_msg := p_error_msg
                        || 'El importe de la deuda de esta factura no coincide con la suma de sus aplicaciones'
                        || CHR(10);

      end if;

      if exists ( select *
                  from FacturaVentaPago fvp
                  where abs(round(fvp.fvp_importe, 2)
                          - round((coalesce(( select sum(fvcobz_importe)
                                              from FacturaVentaCobranza
                                              where fvp_id = fvp.fvp_id ), 0)
                                 + coalesce(( select sum(fvnc_importe)
                                              from FacturaVentaNotaCredito
                                              where ( fvp_id_factura = fvp.fvp_id and v_doct_id in ( 1,9 ) )
                                                 or ( fvp_id_notacredito = fvp.fvp_id and v_doct_id = 7 )
                                             ), 0)
                                  ), 2)) > 0.01
                    and fvp.fv_id = p_fv_id ) then

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
alter function sp_auditoria_vto_check_doc_fv(integer)
  owner to postgres;