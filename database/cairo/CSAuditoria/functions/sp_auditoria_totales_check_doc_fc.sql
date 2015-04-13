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
-- Function: sp_auditoria_totales_check_doc_fc()

-- drop function sp_auditoria_totales_check_doc_fc(integer);

create or replace
function sp_auditoria_totales_check_doc_fc
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
   v_fc_total decimal(18,6);
   v_fc_otros decimal(18,6);
   v_fc_percepciones decimal(18,6);
   v_fc_neto decimal(18,6);
   v_fc_ivari decimal(18,6);
   v_fc_importedesc1 decimal(18,6);
   v_fc_importedesc2 decimal(18,6);
   v_fc_desc1 decimal(18,6);
   v_fc_desc2 decimal(18,6);
   v_fc_descivari decimal(18,6);

   v_fci_neto decimal(18,6);
   v_fci_ivari decimal(18,6);

   v_est_id integer;

   v_percepciones decimal(18,6);
   v_importe decimal(18,6);
   v_otros decimal(18,6);
begin

   v_error := 0;
   p_success := 0;
   p_error_msg := '@@ERROR_SP:';

   select doct_id,
          fc_nrodoc,
          trim(to_char(fc_numero)),
          est_id,
          fc_pendiente,
          fc_total,
          fc_neto,
          fc_ivari,
          fc_totalotros,
          fc_totalpercepciones,
          fc_descuento1,
          fc_descuento2,
          fc_importedesc1,
          fc_importedesc2
     into v_doct_id,
          v_fc_nrodoc,
          v_fc_numero,
          v_est_id,
          v_fc_pendiente,
          v_fc_total,
          v_fc_neto,
          v_fc_ivari,
          v_fc_otros,
          v_fc_percepciones,
          v_fc_desc1,
          v_fc_desc2,
          v_fc_importedesc1,
          v_fc_importedesc2
   from FacturaCompra
   where fc_id = p_fc_id;

   if exists ( select fc_id
               from FacturaCompraItem
               where abs(round(fci_neto, 2) - round(fci_precio * fci_cantidad, 2)) > 0.01
                 and fc_id = p_fc_id ) then

      v_error := 1;
      p_error_msg := p_error_msg
                     || 'Esta factura posee items cuyo neto no coincide con el precio por la cantidad'
                     || CHR(10);

   end if;

   -- como puede haber facturas que se cargan
   -- con diferencias entre la tasa y lo impreso
   -- en la factura, y hay que respetar el impreso,
   -- no puedo realizar este control, al grabar,
   -- aunque si lo dejamos activo en los procesos de auditoria
   -- que graban en el log para que el supervisor este
   -- alertado de que hay casos donde ocurre esta diferencia
   --
   -- 	if exists(select fc_id
   -- 						from FacturaCompraItem
   --          		where abs(round(fci_neto * (fci_ivariporc / 100),2) - round(fci_ivari,2))>0.01
   -- 							and fc_id = @@fc_id
   -- 						) begin
   --
   -- 			set @bError = 1
   -- 			set @@bErrorMsg = @@bErrorMsg + 'Esta factura posee items cuyo iva no coincide con el neto por el porcentaje de la tasa' + char(10)
   --
   -- 	end
   -------------------------------------------------------------------------------

   select sum(fci_neto)
     into v_fci_neto
   from FacturaCompraItem
   where fc_id = p_fc_id
   group by fc_id;

   v_fci_neto := coalesce(v_fci_neto, 0) - (v_fci_neto * v_fc_desc1 / 100);
   v_fci_neto := coalesce(v_fci_neto, 0) - (v_fci_neto * v_fc_desc2 / 100);

   if abs(round(v_fci_neto, 2) - round(v_fc_neto, 2)) > 0.01 then

      v_error := 1;
      p_error_msg := p_error_msg
                     || 'El neto de esta factura no coincide con la suma de los netos de sus items'
                     || CHR(10);

   end if;

   select sum(fci_ivari)
     into v_fci_ivari
   from FacturaCompraItem
   where fc_id = p_fc_id
   group by fc_id;

   v_fci_ivari := coalesce(v_fci_ivari, 0);
   v_fc_descivari := (v_fci_ivari * v_fc_desc1 / 100);
   v_fc_descivari := v_fc_descivari + ((v_fci_ivari - v_fc_descivari) * v_fc_desc2 / 100);
   v_fc_total := v_fc_total + v_fc_importedesc1 + v_fc_importedesc2 + v_fc_descivari;

   select sum(fci_importe)
     into v_importe
   from FacturaCompraItem
   where fc_id = p_fc_id;

   select sum(fcot_debe - fcot_haber)
     into v_otros
   from FacturaCompraOtro
   where fc_id = p_fc_id;

   select sum(fcperc_importe)
     into v_percepciones
   from FacturaCompraPercepcion
   where fc_id = p_fc_id;

   v_importe := coalesce(v_importe, 0);
   v_otros := coalesce(v_otros, 0);
   v_percepciones := coalesce(v_percepciones, 0);

   if abs(round(v_importe + v_otros + v_percepciones, 2) - round(v_fc_total, 2)) > 0.01 then

      v_error := 1;
      p_error_msg := p_error_msg
                     || 'El total de esta factura no coincide con la suma de los totales de sus items'
                     || CHR(10);

   end if;

   select sum(fci_ivari)
     into v_fci_ivari
   from FacturaCompraItem
   where fc_id = p_fc_id
   group by fc_id;

   v_fci_ivari := coalesce(v_fci_ivari, 0);
   v_fci_ivari := v_fci_ivari - (v_fci_ivari * v_fc_desc1 / 100);
   v_fci_ivari := v_fci_ivari - (v_fci_ivari * v_fc_desc2 / 100);

   if abs(round(v_fci_ivari, 2) - round(v_fc_ivari, 2)) > 0.01 then

      v_error := 1;
      p_error_msg := p_error_msg
                     || 'El IVA de esta factura no coincide con la suma de los IVA de sus items'
                     || CHR(10);

   end if;

   if abs(round(v_otros, 2) - round(v_fc_otros, 2)) > 0.01 then

      v_error := 1;
      p_error_msg := p_error_msg
                     || 'El total de otros de esta factura no coincide con la suma de los totales de sus items de tipo otro' || CHR(10)
                     || 'Dif: ' || (round(v_otros, 2) - round(v_fc_otros, 2))::varchar || CHR(10)
                     || 'Total: ' || (round(v_fc_otros, 2))::varchar || CHR(10)
                     || 'Deuda: ' || (round(v_otros, 2))::varchar || CHR(10);

   end if;

   if abs(round(v_percepciones, 2) - round(v_fc_percepciones, 2)) > 0.01 then

      v_error := 1;
      p_error_msg := p_error_msg
                     || 'El total de percepcioens de esta factura no coincide con la suma de los totales de sus items de tipo percepcion'
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
alter function sp_auditoria_totales_check_doc_fc(integer)
  owner to postgres;