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
-- Function: sp_doc_factura_compra_set_estado()

-- drop function sp_doc_factura_compra_set_estado(integer, integer);

create or replace
function sp_doc_factura_compra_set_estado
(
  in p_fc_id integer,
  out p_est_id integer
)
  returns integer as
$BODY$
declare
   v_est_id integer;
   v_prov_id integer;
   v_pendiente decimal(18,6);
   v_creditoTotal decimal(18,6);
   v_llevaFirma smallint;
   v_firmado smallint;
   v_deuda decimal(18,6);
   v_doc_id integer;
   v_doc_llevaFirma smallint;

   v_estado_pendiente integer := 1;
   v_estado_pendienteCredito integer := 3;
   v_estado_pendienteFirma integer := 4;
   v_estado_finalizado integer := 5;
   v_estado_anulado integer := 7;
begin

   if p_fc_id = 0 then
      return;
   end if;

   select prov_id,
          fc_firmado,
          est_id,
          doc_id
     into v_prov_id,
          v_firmado,
          v_est_id,
          v_doc_id
   from FacturaCompra
   where fc_id = p_fc_id;

   select doc_llevafirma
     into v_doc_llevaFirma
   from Documento
   where doc_id = v_doc_id;

   if v_est_id <> v_estado_anulado then

      -- si el documento requiere firma y el comprobante no esta firmado
      -- y no esta finalizado (puede ser que se finalizo y luego se modifico el documento
      -- para que requiera firma en cuyo caso no se exige firma para documentos finalizados)
      --
      if v_firmado = 0 and v_doc_llevaFirma <> 0 and v_est_id <> v_estado_finalizado then

         v_est_id := v_estado_pendienteFirma;

      else

         -- se obtiene la deuda del comprobante
         --
         select round(sum(fcd_pendiente), 2)
           into v_deuda
         from FacturaCompraDeuda
         where fc_id = p_fc_id;

         -- si el comprobante no tiene deuda se finaliza
         --
         if coalesce(v_deuda, 0) <= 0.01 then

            v_est_id := v_estado_finalizado;

         else

            -- se obtiene la deuda del proveedor
            --
            select sum(provcc_importe)
              into v_pendiente
            from ProveedorCacheCredito
            where prov_id = v_prov_id;

            -- se obtiene el credito del proveedor
            --
            select prov_creditototal
              into v_creditoTotal
            from Proveedor
            where prov_id = v_prov_id;

            -- si debe mas que el credito concedido al proveedor
            --
            if v_pendiente > v_creditoTotal then

               v_est_id := v_estado_pendienteCredito;

            -- sino solo pendiente
            --
            else

               v_est_id := v_estado_pendiente;

            end if;

         end if;

      end if;

      update FacturaCompra
         set est_id = v_est_id
      where fc_id = p_fc_id;

   end if;

   p_est_id := v_est_id;

exception
   when others then

   raise exception 'Ha ocurrido un error al actualizar el estado de la factura de compra. sp_doc_factura_compra_set_estado. %. %.',
                   sqlstate, sqlerrm;

end;
$BODY$
  language plpgsql volatile
  cost 100;
alter function sp_doc_factura_compra_set_estado(integer)
  owner to postgres;