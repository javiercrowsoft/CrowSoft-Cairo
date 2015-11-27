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
-- Function: sp_auditoria_totales_check_doc_fv()

-- drop function sp_auditoria_totales_check_doc_fv(integer);

create or replace function sp_auditoria_totales_check_doc_fv
(
  in p_fv_id integer,
  out p_success integer,
  out p_error_msg varchar
)
  returns record as
$BODY$
declare
   v_error smallint;

   v_doct_id integer;

   v_fv_nrodoc varchar(50);
   v_fv_numero varchar(50);
   v_fv_pendiente decimal(18,6);
   v_fv_total decimal(18,6);
   v_fv_percepciones decimal(18,6);
   v_fv_neto decimal(18,6);
   v_fv_ivari decimal(18,6);
   v_fv_importedesc1 decimal(18,6);
   v_fv_importedesc2 decimal(18,6);
   v_fv_desc1 decimal(18,6);
   v_fv_desc2 decimal(18,6);
   v_fv_descivari decimal(18,6);

   v_fvi_neto decimal(18,6);
   v_fvi_ivari decimal(18,6);

   v_est_id integer;

   v_percepciones decimal(18,6);
   v_importe decimal(18,6);
begin

   v_error := 0;
   p_success := 0;
   p_error_msg := '@@ERROR_SP:';

   select doct_id,
          fv_nrodoc,
          trim(to_char(fv_numero)),
          est_id,
          fv_pendiente,
          fv_total,
          fv_neto,
          fv_ivari,
          fv_totalpercepciones,
          fv_descuento1,
          fv_descuento2,
          fv_importedesc1,
          fv_importedesc2
     into v_doct_id,
          v_fv_nrodoc,
          v_fv_numero,
          v_est_id,
          v_fv_pendiente,
          v_fv_total,
          v_fv_neto,
          v_fv_ivari,
          v_fv_percepciones,
          v_fv_desc1,
          v_fv_desc2,
          v_fv_importedesc1,
          v_fv_importedesc2
   from FacturaVenta
   where fv_id = p_fv_id;


   if exists ( select fv_id
               from FacturaVentaItem
               where abs(round(fvi_neto, 2) - round(fvi_precio * fvi_cantidad, 2)) > 0.01
                 and fv_id = p_fv_id ) then

      v_error := 1;
      p_error_msg := p_error_msg
                     || 'Esta factura posee items cuyo neto no coincide con el precio por la cantidad'
                     || CHR(10);

   end if;

   if exists ( select fv_id
               from FacturaVentaItem
               where abs(round(fvi_neto * (fvi_ivariporc / 100), 2) - round(fvi_ivari, 2)) > 0.01
                 and fv_id = p_fv_id ) then

      v_error := 1;
      p_error_msg := p_error_msg
                     || 'Esta factura posee items cuyo iva no coincide con el neto por el porcentaje de la tasa'
                     || CHR(10);

   end if;

   select sum(fvi_neto)
     into v_fvi_neto
   from FacturaVentaItem
   where fv_id = p_fv_id
   group by fv_id;

   v_fvi_neto := coalesce(v_fvi_neto, 0) - (v_fvi_neto * v_fv_desc1 / 100);
   v_fvi_neto := coalesce(v_fvi_neto, 0) - (v_fvi_neto * v_fv_desc2 / 100);

   if round(v_fvi_neto, 2) <> round(v_fv_neto, 2) then

      v_error := 1;
      p_error_msg := p_error_msg
                     || 'El neto de esta factura no coincide con la suma de los netos de sus items'
                     || CHR(10);

   end if;

   select sum(fvi_ivari)
     into v_fvi_ivari
   from FacturaVentaItem
   where fv_id = p_fv_id
   group by fv_id;

   v_fvi_ivari := coalesce(v_fvi_ivari, 0);
   v_fv_descivari := (v_fvi_ivari * v_fv_desc1 / 100);
   v_fv_descivari := v_fv_descivari + ((v_fvi_ivari - v_fv_descivari) * v_fv_desc2 / 100);
   v_fv_total := v_fv_total + v_fv_importedesc1 + v_fv_importedesc2 + v_fv_descivari;

   select sum(fvi_importe)
     into v_importe
   from FacturaVentaItem
   where fv_id = p_fv_id;

   select sum(fvperc_importe)
     into v_percepciones
   from FacturaVentaPercepcion
   where fv_id = p_fv_id;

   v_importe := coalesce(v_importe, 0);

   v_percepciones := coalesce(v_percepciones, 0);

   if round(v_importe + v_percepciones, 2) <> round(v_fv_total, 2) then

      v_error := 1;
      p_error_msg := p_error_msg
                     || 'El total de esta factura no coincide con la suma de los totales de sus items'
                     || CHR(10)
                     || 'Importe + Percepciones: '
                     || to_char(round(v_importe + v_percepciones, 2), '#,###,###,##0.00')
                     || CHR(10)
                     || 'Total : '
                     || to_char(round(v_fv_total, 2), '#,###,###,##0.00')
                     || CHR(10)
                     || 'Diferencia: '
                     || to_char(round(round(v_importe + v_percepciones, 2) - round(v_fv_total, 2), 2), '#,###,###,##0.00')
                     || CHR(10);

   end if;

   select sum(fvi_ivari)
     into v_fvi_ivari
   from FacturaVentaItem
   where fv_id = p_fv_id
   group by fv_id;

   v_fvi_ivari := coalesce(v_fvi_ivari, 0);
   v_fvi_ivari := v_fvi_ivari - (v_fvi_ivari * v_fv_desc1 / 100);
   v_fvi_ivari := v_fvi_ivari - (v_fvi_ivari * v_fv_desc2 / 100);

   if round(v_fvi_ivari, 2) <> round(v_fv_ivari, 2) then

      v_error := 1;
      p_error_msg := p_error_msg
                     || 'El IVA de esta factura no coincide con la suma de los IVA de sus items'
                     || CHR(10);

   end if;

   if abs(round(v_percepciones, 2) - round(v_fv_percepciones, 2)) > 0.01 then

      v_error := 1;
      p_error_msg := p_error_msg
                     || 'El total de percepcioens de esta factura no coincide con la suma de los totales de sus items de tipo percepcion'
                     || CHR(10)
                     || 'Suma de Items: ' || to_char(round(v_percepciones, 2), '#,###,###,##0.00')
                     || CHR(10)
                     || 'Total de Percepciones : ' || to_char(round(v_fv_percepciones, 2), '#,###,###,##0.00')
                     || CHR(10)
                     || 'Diferencia: ' || to_char(round(round(v_percepciones, 2) - round(v_fv_percepciones, 2), 2), '#,###,###,##0.00')
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
alter function sp_auditoria_totales_check_doc_fv(integer)
  owner to postgres;