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
-- Function: sp_doc_remito_venta_set_estado()

-- drop function sp_doc_remito_venta_set_estado(integer, integer);

create or replace function sp_doc_remito_venta_set_estado
(
  in p_rv_id integer,
  out p_est_id integer
)
  returns integer as
$BODY$
declare
   v_est_id integer;
   v_cli_id integer;
   v_pendiente decimal(18,6);
   v_creditoTotal decimal(18,6);
   v_llevaFirma smallint;
   v_firmado smallint;
   v_deuda decimal(18,6);
   v_doc_id integer;
   v_doc_llevafirma smallint;

   v_estado_pendiente integer := 1;
   v_estado_pendienteCredito integer := 3;
   v_estado_pendienteFirma integer := 4;
   v_estado_finalizado integer := 5;
   v_estado_anulado integer := 7;
begin

   if p_rv_id = 0 then
      return;
   end if;

   select cli_id,
          rv_firmado,
          est_id,
          doc_id
     into v_cli_id,
          v_firmado,
          v_est_id,
          v_doc_id
   from RemitoVenta
   where rv_id = p_rv_id;

   select doc_llevafirma
     into v_doc_llevafirma
   from Documento
   where doc_id = v_doc_id;

   if v_est_id <> v_estado_anulado then

      -- si el documento requiere firma y el comprobante no esta firmado
      -- y no esta finalizado (puede ser que se finalizo y luego se modifico el documento
      -- para que requiera firma en cuyo caso no se exige firma para documentos finalizados)
      --
      if v_firmado = 0 and v_doc_llevafirma <> 0 and v_est_id <> v_estado_finalizado then

         v_est_id := v_estado_pendienteFirma;

      else

         -- se obtiene la deuda del comprobante
         --
         select round(sum(rvi_pendientefac), 2)
           into v_deuda
           from RemitoVentaItem
            where rv_id = p_rv_id;

         -- si el comprobante no tiene deuda se finaliza
         --
         if coalesce(v_deuda, 0) <= 0 then

            v_est_id := v_estado_finalizado;

         else

            -- se obtiene la deuda del cliente
            --
            select sum(clicc_importe)
              into v_pendiente
            from ClienteCacheCredito
            where cli_id = v_cli_id;

            -- se obtiene el credito del cliente
            --
            select cli_creditototal
              into v_creditoTotal
            from Cliente
            where cli_id = v_cli_id;

            -- si debe mas que el credito concedido al cliente
            --
            if v_pendiente > v_creditoTotal then

               v_est_id := v_estado_pendienteCredito;

            -- sino solo pendiente
            --
            else

               v_est_id := v_estado_pendiente;

            end if;

         end;
         end if;

      end if;

      update RemitoVenta
         set est_id = v_est_id
      where rv_id = p_rv_id;

   end if;

   p_est_id := v_est_id;

end;

exception
   when others then

   raise exception 'Ha ocurrido un error al actualizar el estado del Remito de venta. sp_doc_remito_venta_set_estado. %. %.',
                   sqlstate, sqlerrm;

end;
$BODY$
  language plpgsql volatile
  cost 100;
alter function sp_doc_remito_venta_set_estado(integer)
  owner to postgres;