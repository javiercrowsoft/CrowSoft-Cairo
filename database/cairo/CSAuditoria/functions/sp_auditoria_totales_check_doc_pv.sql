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
-- Function: sp_auditoria_totales_check_doc_pv()

-- drop function sp_auditoria_totales_check_doc_pv(integer);

create or replace function sp_auditoria_totales_check_doc_pv
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
   v_pv_neto decimal(18,6);
   v_pv_ivari decimal(18,6);
   v_pv_importedesc1 decimal(18,6);
   v_pv_importedesc2 decimal(18,6);
   v_pv_desc1 decimal(18,6);
   v_pv_desc2 decimal(18,6);

   v_pv_descivari decimal(18,6);

   v_cli_catFiscal smallint;

   v_pvi_neto decimal(18,6);
   v_pvi_ivari decimal(18,6);

   v_importe decimal(18,6);
begin

   v_error := 0;
   p_success := 0;
   p_error_msg := '@@ERROR_SP:';

   select pv.doct_id,
          pv.pv_nrodoc,
          trim(to_char(pv.pv_numero)),
          pv.est_id,
          pv.pv_pendiente,
          pv.pv_total,
          pv.pv_neto,
          pv.pv_ivari,
          pv.pv_descuento1,
          pv.pv_descuento2,
          pv.pv_importedesc1,
          pv.pv_importedesc2,
          cli.cli_catfiscal
     into v_doct_id,
          v_pv_nrodoc,
          v_pv_numero,
          v_est_id,
          v_pv_pendiente,
          v_pv_total,
          v_pv_neto,
          v_pv_ivari,
          v_pv_desc1,
          v_pv_desc2,
          v_pv_importedesc1,
          v_pv_importedesc2,
          v_cli_catFiscal
   from PedidoVenta pv
   join Cliente cli
     on pv.cli_id = cli.cli_id
   where pv.pv_id = p_pv_id;

   if exists ( select pv_id
               from PedidoVentaItem
               where abs(round(pvi_neto, 2) - round(pvi_precio * pvi_cantidad, 2)) >= 0.01
                 and pv_id = p_pv_id ) then

      v_error := 1;
      p_error_msg := p_error_msg
                     || 'Este pedido posee items cuyo neto no coincide con el precio por la cantidad'
                     || CHR(10);

   end if;

   if exists ( select pv_id
               from PedidoVentaItem
               where abs(round(pvi_neto * (pvi_ivariporc / 100), 2) - round(pvi_ivari, 2)) >= 0.01
                 and pv_id = p_pv_id
                 and v_cli_catFiscal <> 5 ) then

      v_error := 1;
      p_error_msg := p_error_msg
                     || 'Este pedido posee items cuyo iva no coincide con el neto por el porcentaje de la tasa'
                     || CHR(10);

   end if;

   select sum(pvi_neto)
     into v_pvi_neto
   from PedidoVentaItem
   where pv_id = p_pv_id
   group by pv_id;

   v_pvi_neto := coalesce(v_pvi_neto, 0) - (v_pvi_neto * v_pv_desc1 / 100);
   v_pvi_neto := coalesce(v_pvi_neto, 0) - (v_pvi_neto * v_pv_desc2 / 100);

   if abs(round(v_pvi_neto, 2) - round(v_pv_neto, 2)) >= 0.01 then

      v_error := 1;
      p_error_msg := p_error_msg
                     || 'El neto de este pedido no coincide con la suma de los netos de sus items'
                     || CHR(10);

   end if;

   select sum(pvi_ivari)
     into v_pvi_ivari
   from PedidoVentaItem
   where pv_id = p_pv_id
   group by pv_id;

   v_pvi_ivari := coalesce(v_pvi_ivari, 0);
   v_pv_descivari := (v_pvi_ivari * v_pv_desc1 / 100);
   v_pv_descivari := v_pv_descivari + ((v_pvi_ivari - v_pv_descivari) * v_pv_desc2 / 100);

   v_pv_total := v_pv_total + v_pv_importedesc1 + v_pv_importedesc2 + v_pv_descivari;

   select sum(pvi_importe)
     into v_importe
   from PedidoVentaItem
   where pv_id = p_pv_id;

   v_importe := coalesce(v_importe, 0);

   if abs(round(v_importe, 2) - round(v_pv_total, 2)) >= 0.01 then

      v_error := 1;
      p_error_msg := p_error_msg
                     || 'El total de este pedido no coincide con la suma de los totales de sus items'
                     || CHR(10);

   end if;

   select sum(pvi_ivari)
     into v_pvi_ivari
   from PedidoVentaItem
   where pv_id = p_pv_id
   group by pv_id;

   v_pvi_ivari := coalesce(v_pvi_ivari, 0);
   v_pvi_ivari := v_pvi_ivari - (v_pvi_ivari * v_pv_desc1 / 100);
   v_pvi_ivari := v_pvi_ivari - (v_pvi_ivari * v_pv_desc2 / 100);

   if abs(round(v_pvi_ivari, 2) - round(v_pv_ivari, 2)) >= 0.01 then

      v_error := 1;
      p_error_msg := p_error_msg
                     || 'El IVA de este pedido no coincide con la suma de los IVA de sus items'
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
alter function sp_auditoria_totales_check_doc_pv(integer)
  owner to postgres;