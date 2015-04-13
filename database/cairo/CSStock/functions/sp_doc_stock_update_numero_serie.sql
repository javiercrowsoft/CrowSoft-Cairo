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
-- Function: sp_doc_stock_update_numero_serie()

-- drop function sp_doc_stock_update_numero_serie(integer, integer);

create or replace function sp_doc_stock_update_numero_serie
(
  in p_st_id integer,
  in p_restar integer
)
  returns void as
$BODY$  
declare
   v_prns_id integer;
   v_depl_id integer;
   v_doct_id_cliente integer;
   v_id_cliente integer;

   v_modificado date;
   v_creado date;

   v_st_id_prns integer;
   v_depl_id_prns integer;
   v_doct_id_cliente_prns integer;
   v_id_cliente_prns integer;
begin

   -- cargamos el deposito destino
   -- desde el movimiento de stock
   -- ya que el 99% de las veces
   -- es un insert
   --
   select doct_id_cliente,
          id_cliente,
          modificado,
          creado,
          depl_id_destino
     into v_doct_id_cliente,
          v_id_cliente,
          v_modificado,
          v_creado,
          v_depl_id
   from Stock
   where st_id = p_st_id;

   /*-------------------------------------------------------------------
     insert
   ---------------------------------------------------------------------*/

   -- solo puedo usarlo si no estoy borrando o anulando
   --
   if v_modificado = v_creado and p_restar = 0 then

      -- actualizamos el deposito siempre y el cliente, el proveedor
      -- y el documento de salida y de ingreso solo si corresponde
      --
      perform sp_doc_stock_update_numero_serie2(
                                        p_st_id,
                                        v_doct_id_cliente,
                                        v_id_cliente,
                                        null,
                                        null,
                                        v_depl_id);

   end;

   /*-------------------------------------------------------------------
     update
   ---------------------------------------------------------------------*/

   else

      -- si estoy anulando o borrando
      --
      if p_restar <> 0 then

         for v_prns_id in
            select prns_id
            from StockItem
            where st_id = p_st_id
              and prns_id is not null
              and sti_ingreso > 0
         loop

            v_st_id_prns := null;

            select st_id
              into v_st_id_prns
            from ProductoNumeroSerie
            where prns_id = v_prns_id;

            -- si soy el ultimo movimiento de este numero de serie
            --
            if p_st_id = v_st_id_prns then

               -- obtengo el movimiento anterior a mi
               --
               select max(st_id)
                 into v_st_id_prns
               from StockItem
               where prns_id = v_prns_id
                 and st_id <> v_st_id_prns;

               -- obtengo el deposito del ultimo movimiento
               --
               select doct_id_cliente,
                      id_cliente,
                      depl_id_destino
                 into v_doct_id_cliente_prns,
                      v_id_cliente_prns,
                      v_depl_id_prns
               from Stock
               where st_id = v_st_id_prns;

               perform sp_doc_stock_update_numero_serie3(
                                                 v_prns_id,
                                                 v_st_id_prns,
                                                 v_doct_id_cliente_prns,
                                                 v_id_cliente_prns,
                                                 v_depl_id_prns);

            end if;

         end loop;

      -- sino esta borrando modificamos todos los numeros de serie
      -- cuyo st_id = @@st_id
      --
      else
         perform sp_doc_stock_update_numero_serie4(
                                       p_st_id,
                                       v_doct_id_cliente,
                                       v_id_cliente,
                                       v_depl_id);

      end if;

   end if;

end;
$BODY$
  language plpgsql volatile
  cost 100;
alter function sp_doc_stock_update_numero_serie(integer, integer)
  owner to postgres;