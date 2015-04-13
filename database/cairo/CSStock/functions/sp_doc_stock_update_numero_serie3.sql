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
-- Function: sp_doc_stock_update_numero_serie2()

-- drop function sp_doc_stock_update_numero_serie2(integer, integer, integer, integer, integer);

create or replace function sp_doc_stock_update_numero_serie3
(
  in v_prns_id integer,
  in p_st_id integer,
  in v_doct_id_cliente integer,
  in v_id_cliente integer,
  in v_depl_id integer
)
  returns void as
$BODY$
declare
   v_cli_id integer;
   v_prov_id integer;
begin

   if p_st_id is null then
      return;
   end if;

   -- ahora definimos a que proveedor y cliente pertenece
   -- TODO aca todavia falta una vuelta de tuerca para estar seguro
   -- que no hay otro movimiento posterior que envie el numero de serie
   -- a un cliente, y este movimiento que ahora estamos borrando no
   -- tiene efecto sobre el numero de serie
   --
   /*
       1	factura de venta
       3	remito de venta
   */
   -- cliente
   --
   if v_doct_id_cliente in ( 1,3 ) then

      select case v_doct_id_cliente
                when 1 then ( select cli_id
                              from FacturaVenta
                              where fv_id = v_id_cliente )
                when 3 then ( select cli_id
                              from RemitoVenta
                              where rv_id = v_id_cliente )
                else null
             end
        into v_cli_id;

      update ProductoNumeroSerie
         set depl_id = v_depl_id,
             cli_id = v_cli_id,
             doc_id_salida = v_id_cliente,
             doct_id_salida = v_doct_id_cliente,
             st_id = p_st_id
      where prns_id = v_prns_id;

   else

      /*
          7	nota de credito venta
         24	devolucion remito venta
      */
      if v_doct_id_cliente in ( 7,24 ) then

         -- si ya no esta en el deposito de terceros entonces lo desvinculo de cualquier cliente
         --
         update ProductoNumeroSerie
            set depl_id = v_depl_id,
                cli_id = null,
                doc_id_salida = null,
                doct_id_salida = null,
                st_id = p_st_id
         where prns_id = v_prns_id;

      -- proveedor
      --
      else

         /*
             2	factura de compra
             4	remito de compra
            42 orden de servicio
         */
         -- nota: si esta anulando el remito o la factura de compra, no me preocupo ya que
         --       en la anulacion y tambien al borrar el documento, se elimina del stock el
         --       numero de serie
         --
         if v_doct_id_cliente in ( 2,4,42 ) then

            if v_doct_id_cliente in ( 2,4 ) then

               select case v_doct_id_cliente
                         when 2 then ( select prov_id
                                       from FacturaCompra
                                       where fc_id = v_id_cliente )
                         when 4 then ( select prov_id
                                       from RemitoCompra
                                       where rc_id = v_id_cliente )
                      end
                 into v_prov_id;

               update ProductoNumeroSerie
                  set depl_id = v_depl_id,
                      prov_id = v_prov_id,
                      doc_id_ingreso = v_id_cliente,
                      doct_id_ingreso = v_doct_id_cliente,
                      st_id = p_st_id
               where prns_id = v_prns_id;

            else

               select cli_id
                 into v_cli_id
               from OrdenServicio
               where os_id = v_id_cliente;

               update ProductoNumeroSerie
                  set depl_id = v_depl_id,
                      cli_id = v_cli_id,
                      doc_id_ingreso = v_id_cliente,
                      doct_id_ingreso = v_doct_id_cliente,
                      st_id = p_st_id
               where prns_id = v_prns_id;

            end if;

         else
            /*
                8	 nota de credito de compra
                25 devolucion de remito de compra
            */
            if v_doct_id_cliente in ( 8,25 ) then

               update ProductoNumeroSerie
                  set depl_id = v_depl_id,
                      doc_id_salida = v_id_cliente,
                      doct_id_salida = v_doct_id_cliente,
                      st_id = p_st_id
               where prns_id = v_prns_id;

            else
               /*
                   28	recuento de stock
                   30	parte de produccion
               */
               if v_doct_id_cliente in ( 28,30 ) then

                  if v_depl_id = -2 then

                     update ProductoNumeroSerie
                        set depl_id = v_depl_id,
                            doc_id_salida = v_id_cliente,
                            doct_id_salida = v_doct_id_cliente,
                            st_id = p_st_id
                     where prns_id = v_prns_id;

                  else

                     update ProductoNumeroSerie
                        set depl_id = v_depl_id,
                            doc_id_ingreso = v_id_cliente,
                            doct_id_ingreso = v_doct_id_cliente,
                            st_id = p_st_id
                     where prns_id = v_prns_id;

                  end if;

               -- cualquier otro documento (por ejemplo transferencia de stock)
               -- solo modifica el deposito
               --
               else

                  update ProductoNumeroSerie
                     set depl_id = v_depl_id,
                         st_id = p_st_id
                  where prns_id = v_prns_id;

               end if;

            end if;

         end if;

      end if;

   end if;

end;
$BODY$
  language plpgsql volatile
  cost 100;
alter function sp_doc_stock_update_numero_serie3(integer, integer, integer, integer, integer)
  owner to postgres;