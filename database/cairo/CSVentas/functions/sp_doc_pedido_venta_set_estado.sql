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
-- Function: sp_doc_pedido_venta_set_estado()

-- drop function sp_doc_pedido_venta_set_estado(integer);

create or replace function sp_doc_pedido_venta_set_estado
(
  in p_pv_id integer,
  out p_est_id integer
)
  returns integer as
$BODY$
declare
   v_est_id integer;
   v_cli_id integer;
   v_pendiente decimal(18,6);
   v_pendientedoc decimal(18,6);
   v_creditoTotal decimal(18,6);
   v_creditoCtaCte decimal(18,6);
   v_llevaFirma smallint;
   v_firmado smallint;
   v_deuda decimal(18,6);
   v_doc_id integer;
   v_doc_llevafirma smallint;
   v_doc_llevafirmaCredito smallint;

   v_estado_pendienteDespacho integer := 2;
   v_estado_pendienteCredito integer := 3;
   v_estado_pendienteFirma integer := 4;
   v_estado_finalizado integer := 5;
   v_estado_anulado integer := 7;
   v_estado_pendienteStock integer := 8;

   v_bStock smallint;
   v_cfg_valor varchar(5000);

begin

   if p_pv_id = 0 then
      return;
   end if;

   select cli_id,
          pv_firmado,
          est_id,
          doc_id
     into v_cli_id,
          v_firmado,
          v_est_id,
          v_doc_id
   from PedidoVenta
   where pv_id = p_pv_id;

   select doc_llevafirma,
          doc_llevafirmaCredito
     into v_doc_llevafirma,
          v_doc_llevafirmaCredito
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
         select round(sum(pvi_pendiente), 2)
           into v_deuda
         from PedidoVentaItem
         where pv_id = p_pv_id;

         -- si el comprobante no tiene deuda se finaliza
         --
         if coalesce(v_deuda, 0) <= 0 then

            v_est_id := v_estado_finalizado;

         else

            -- se obtiene la deuda del cliente
            --
            select * from sp_doc_pedido_venta_get_deuda_clien(v_cli_id) into v_pendiente, v_pendientedoc;

            -- se obtiene el credito del cliente
            --
            select cli_creditototal,
                   cli_creditoctacte
              into v_creditoTotal,
                   v_creditoCtaCte
            from Cliente
            where cli_id = v_cli_id;

            -- si debe mas que el credito concedido al cliente
            --
            if v_pendiente + v_pendientedoc > v_creditoTotal or v_pendiente > v_creditoCtaCte then

               if v_firmado = 0 and v_doc_llevafirmaCredito <> 0 then

                  v_est_id := v_estado_pendienteFirma;

               else

                  if v_firmado <> 0 and v_doc_llevafirmaCredito <> 0 then

                     v_est_id := v_estado_pendienteDespacho;

                  else

                     v_est_id := v_estado_pendienteCredito;

                  end if;

                  -- averiguo si valida stock
                  --
                  select sp_cfg_getValor('Stock-General', 'Stock en Pedido de Venta') into v_cfg_valor;

                  if v_cfg_valor is null then

                     v_bStock := 0;

                  else

                     if isnumeric(v_cfg_valor) = 0 then

                        v_bStock := 0;

                     else

                        v_bStock := to_number(v_cfg_valor);

                     end if;

                  end if;

                  if v_bStock <> 0 then

                     select sp_doc_pedido_venta_stock_validate(p_pv_id) into v_bStock;

                     -- sino hay stock
                     --
                     if v_bStock = 0 then

                        v_est_id := v_estado_pendienteStock;

                     end if;

                  end if;

               end if;

            -- sino solo pendiente
            --
            else

               select sp_cfg_getValor('Stock-General', 'Stock en Pedido de Venta') into v_cfg_valor;

               if v_cfg_valor is null then

                  v_bStock := 0;

               else

                  if isnumeric(v_cfg_valor) = 0 then

                     v_bStock := 0;

                  else

                     v_bStock := to_number(v_cfg_valor);

                  end if;

               end if;

               v_est_id := v_estado_pendienteDespacho;

               if v_bStock <> 0 then

                  select sp_doc_pedido_ventaStockValidate(p_pv_id) into v_bStock;

                  -- sino hay stock
                  --
                  if v_bStock = 0 then

                     v_est_id := v_estado_pendienteStock;

                  end if;

               end if;               

            end if;

         end if;

      end if;

      update PedidoVenta
         set est_id = v_est_id
      where pv_id = p_pv_id;

   end if;

   p_est_id := v_est_id;

exception
   when others then

   raise exception 'Ha ocurrido un error al actualizar el estado del pedido de venta. sp_doc_pedido_venta_set_estado. %. %.',
                   sqlstate, sqlerrm;

end;
$BODY$
  language plpgsql volatile
  cost 100;
alter function sp_doc_pedido_venta_set_estado(integer)
  owner to postgres;