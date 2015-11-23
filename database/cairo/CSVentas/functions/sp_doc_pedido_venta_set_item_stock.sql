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
-- Function: sp_doc_pedido_venta_set_item_stock()

-- drop function sp_doc_pedido_venta_set_item_stock(integer);

create or replace function sp_doc_pedido_venta_set_item_stock
(
  in p_pv_id integer,
  out p_success integer
)
  returns integer as
$BODY$
declare
   v_sys_error varchar := '';
   v_est_id integer;

   v_pr_id integer;
   v_pvi_pendiente decimal(18,6);
   v_pr_id_kit integer;
   v_cantidad decimal(18,6);
   v_pvist_id integer;
   v_pr_id_kit_padre integer;

begin

   select est_id
     into v_est_id
   from PedidoVenta
   where pv_id = p_pv_id;

   p_success := 0;

   SET TRANSACTION READ WRITE;

   create temporary table tt_KitItems
   (
      pr_id integer    not null,
      nivel integer    not null
   ) on commit drop;

   create temporary table tt_kit_item_serie
   (
      pr_id_kit_padre     integer,
      pr_id_kit           integer,
      cantidad            decimal(18,6) not null,
      cant_kits           integer default (0) not null,
      faltante            integer default (0) not null,
      pr_id               integer not null,
      prk_id              integer not null,
      costo               decimal(18,6) default (0) not null,
      costo_x_insumos     decimal(18,6) default (0) not null,
      col_order           integer default (3) not null,
      nivel               smallint default (0) not null
   ) on commit drop;

   delete from PedidoVentaItemStock where pv_id = p_pv_id;

   if v_est_id not in ( 5,7,6 ) then

      for v_pvi_pendiente,v_pr_id in
           select i.pvi_pendiente, i.pr_id
           from PedidoVentaItem i
           join Producto p
             on i.pr_id = p.pr_id
           where i.pv_id = p_pv_id
             and i.pvi_pendiente > 0
             and ( p.pr_eskit = 0 or p.pr_kitResumido <> 0 )
      loop

         select sp_dbGetNewId('PedidoVentaItemStock', 'pvist_id') into v_pvist_id;

         insert into PedidoVentaItemStock( pv_id, pvist_id, pvi_pendiente, pr_id )
         values ( p_pv_id, v_pvist_id, v_pvi_pendiente, v_pr_id );

      end loop;

      -- ahora los kits
      --

      -- id del kit solicitado en el PedidoVentaItem

      -- debe ser un kit
      --

      for v_pr_id,v_pvi_pendiente in
           select p.pr_id, sum(i.pvi_pendiente)
           from PedidoVentaItem i
           join Producto p
             on i.pr_id = p.pr_id
           where i.pv_id = p_pv_id
             and ( p.pr_eskit <> 0
             and p.pr_kitResumido = 0 )
             and i.pvi_pendiente > 0
           group by p.pr_id
      loop

         delete from tt_KitItems;

         perform sp_stock_producto_get_kit_info(
                                                  v_pr_id,
                                                  0,
                                                  1 -- solo quiero aquellos productos que llevan el stock por item
                                                );

         -- asocio los items con el kit padre
         --
         update tt_kit_item_serie
            set pr_id_kit_padre = v_pr_id
         where pr_id_kit_padre is null;

      end loop;

      -- actualizo la tabla #KitItemsSerie cargando los items que deben estar asociados a un kit
      --
      update tt_kit_item_serie set pr_id_kit = 0; -- para discriminar las nuevas filas

      -- debe ser un kit
      --
      for v_pr_id,v_pvi_pendiente,v_pr_id_kit_padre in
           select p.pr_id, sum(cantidad), i.pr_id_kit_padre
           from tt_kit_item_serie i
           join Producto p
             on i.pr_id = p.pr_id
           where ( p.pr_eskit <> 0
             and p.pr_kitResumido = 0 )
           group by p.pr_id,i.pr_id_kit_padre
      loop

         delete from tt_KitItems;

         perform sp_stock_producto_get_kit_info(
                                                   v_pr_id,
                                                   0,
                                                   0 -- ahora quiero todos los componentes
                                                );

         -- asocio los items con el kit
         --
         update tt_kit_item_serie
            set pr_id_kit = v_pr_id
         where pr_id_kit is null;

         -- asocio los items con el kit padre
         --
         update tt_kit_item_serie
            set pr_id_kit_padre = v_pr_id_kit_padre
         where pr_id_kit_padre is null;

         if exists ( select *
                     from Producto
                     where pr_id = v_pr_id_kit_padre
                       and pr_eskit <> 0
                       and pr_kitStkItem = 0 ) then

            update tt_kit_item_serie
               set pr_id_kit = v_pr_id_kit_padre
            where pr_id_kit_padre = v_pr_id_kit_padre;

         end if;

         -- borro la fila que mensionaba al kit
         --
         delete from tt_kit_item_serie where pr_id = v_pr_id;

      end loop;

      -- lo mismo para el Pedido de Venta en cuestion
      --
      for v_pr_id,v_pr_id_kit,v_cantidad,v_pr_id_kit_padre in
           select k.pr_id,
                  k.pr_id_kit,
                  i.pvi_pendiente * cantidad,
                  k.pr_id_kit_padre
           from PedidoVentaItem i
                    join Producto p
                          on i.pr_id = p.pr_id
                    join tt_kit_item_serie k
                          on k.pr_id_kit_padre = i.pr_id
           where i.pv_id = p_pv_id
              and ( p.pr_eskit <> 0
              and p.pr_kitResumido = 0 )
      loop

         select sp_dbGetNewId('PedidoVentaItemStock', 'pvist_id') into v_pvist_id;

         if v_pr_id_kit = 0 then

            v_pr_id_kit := null;

         end if;

         -- inserto la demanda de stock desagregada para este kit
         --
         insert into PedidoVentaItemStock( pv_id, pvist_id, pvi_pendiente, pr_id, pr_id_kit, pr_id_kitpadre )
         values ( p_pv_id, v_pvist_id, v_cantidad, v_pr_id, v_pr_id_kit, v_pr_id_kit_padre );

      end loop;

   end if;

   p_success := 1;

exception
   when others then

   raise exception 'Ha ocurrido un error al actualizar el pendiente del pedido de venta. sp_doc_pedido_venta_set_item_stock. %. %.',
                   sqlstate, sqlerrm;

end;
$BODY$
  language plpgsql volatile
  cost 100;
alter function sp_doc_pedido_venta_set_item_stock(integer)
  owner to postgres;