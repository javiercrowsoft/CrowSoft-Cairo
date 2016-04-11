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
-- Function: sp_doc_pedido_vta_save_aplic()

-- drop function sp_doc_pedido_vta_save_aplic(integer, integer, integer);

create or replace function sp_doc_pedido_vta_save_aplic
(
  in p_pv_id integer,
  in p_pvTMP_id integer,
  in p_bIsAplic integer default 0
)
  returns void as
$BODY$
declare
   v_error_msg varchar(5000);
   v_pvi_id integer;
   v_orden integer;
   v_doct_id integer;

   v_prvpv_id integer;
   v_prvpv_cantidad decimal(18,6);
   v_prvi_id integer;

   v_pvpk_id integer;
   v_pvpk_cantidad decimal(18,6);
   v_pklsti_id integer;

   v_pvfv_id integer;
   v_pvfv_cantidad decimal(18,6);
   v_fvi_id integer;

   v_pvrv_id integer;
   v_pvrv_cantidad decimal(18,6);
   v_rvi_id integer;

   v_pvdv_id integer;
   v_pvdv_cantidad decimal(18,6);
   v_pvi_id_pedido integer;
   v_pvi_id_devolucion integer;
   v_c_aplicPedido varchar(4000);
begin

   v_error_msg := '';

   select doct_id
     into v_doct_id
   from PedidoVenta
   where pv_id = p_pv_id;

/*
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                               //
//                                        aplicacion presupuesto                                                 //
//                                                                                                               //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
*/

   v_orden := 0;

   create temporary table tt_PresupuestoVtaPedido (prv_id integer) on commit drop;

   insert into tt_PresupuestoVtaPedido
     ( prv_id )
     ( select distinct prvi.prv_id
       from PresupuestoPedidoVenta pvrpv
       join PresupuestoVentaItem prvi
         on pvrpv.prvi_id = prvi.prvi_id
       join PedidoVentaItem pvi
         on pvrpv.pvi_id = pvi.pvi_id
       where not exists ( select *
                          from PresupuestoPedidoVentaTMP
                          where pvTMP_id = p_pvTMP_id
                            and prvi_id = pvrpv.prvi_id )
                            and pvi.pv_id = p_pv_id );

   -- borro toda la aplicacion actual de este pedido con presupuestos
   --
   delete from PresupuestoPedidoVenta
   where pvi_id in ( select pvi_id
                     from PedidoVentaItem
                     where pv_id = p_pv_id );

   for v_prvpv_id, v_pvi_id, v_prvi_id, v_prvpv_cantidad in
        select prvpv_id,
               pvi_id,
               prvi_id,
               prvpv_cantidad
        from PresupuestoPedidoVentaTMP
        where pvTMP_id = p_pvTMP_id
   loop

      -- obtengo por el orden el pvi que le corresponde a este prvi
      --
      if p_bIsAplic = 0 then

         v_orden := v_orden + 1;

         select pvi_id
           into v_pvi_id
         from PedidoVentaItem
         where pv_id = p_pv_id
           and pvi_orden = v_orden;

      end if;

      -- finalmente grabo la vinculacion
      --
      select sp_dbGetNewId('PresupuestoPedidoVenta', 'prvpv_id') into v_prvpv_id;

      insert into PresupuestoPedidoVenta( prvpv_id, prvpv_cantidad, pvi_id, prvi_id )
                                 values ( v_prvpv_id, v_prvpv_cantidad, v_pvi_id, v_prvi_id );
   end loop;

/*
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                               //
//                                        update pendiente en presupuesto                                        //
//                                                                                                               //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
*/

   perform sp_doc_pedido_vta_presupuesto_set_pendiente(p_pv_id);


/*
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                               //
//                                        aplicacion packinglist                                                 //
//                                                                                                               //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
*/

   v_orden := 0;

   create temporary table tt_PedidoPackingList(pklst_id integer) on commit drop;

   insert into tt_PedidoPackingList
     ( pklst_id )
     ( select distinct pvi.pv_id
       from PedidoPackingList pvpk
       join PackingListItem pklsti
         on pvpk.pklsti_id = pklsti.pklsti_id
       join PedidoVentaItem pvi
         on pvpk.pvi_id = pvi.pvi_id
       where not exists ( select *
                          from PedidoPackingListTMP
                          where pvTMP_id = p_pvTMP_id
                            and pklsti_id = pvpk.pklsti_id )
                            and pvi.pv_id = p_pv_id );

   -- borro toda la aplicacion actual de este pedido con packinglist
   --
   delete from PedidoPackingList
   where pvi_id in ( select pvi_id
                     from PedidoVentaItem
                     where pv_id = p_pv_id );

   for v_pvpk_id, v_pvi_id, v_pklsti_id, v_pvpk_cantidad in
        select pvpklst_id,
               pvi_id,
               pklsti_id,
               pvpklst_cantidad
        from PedidoPackingListTMP
        where pvTMP_id = p_pvTMP_id
   loop

      -- obtengo por el orden el pvi que le corresponde a este pklsti
      --
      if p_bIsAplic = 0 then

         v_orden := v_orden + 1;

         select pvi_id
           into v_pvi_id
         from PedidoVentaItem
         where pv_id = p_pv_id
           and pvi_orden = v_orden;

      end if;

      -- finalmente grabo la vinculacion
      --
      select sp_dbGetNewId('PedidoPackingList', 'pvpklst_id') into v_pvpk_id;

      insert into PedidoPackingList( pvpklst_id, pvpklst_cantidad, pvi_id, pklsti_id )
                            values ( v_pvpk_id, v_pvpk_cantidad, v_pvi_id, v_pklsti_id );
   end loop;

/*
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                               //
//                                        update pendiente en packinglist                                        //
//                                                                                                               //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
*/

   perform sp_doc_pedido_vta_packing_set_pendiente(p_pv_id);

/*
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                               //
//                                        aplicacion factura                                                     //
//                                                                                                               //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
*/

   v_orden := 0;

   create temporary table tt_PedidoVentaFactura(fv_id integer) on commit drop;

   insert into tt_PedidoVentaFactura
     ( fv_id )
     ( select distinct fvi.fv_id
       from PedidoFacturaVenta pvfv
       join FacturaVentaItem fvi
         on pvfv.fvi_id = fvi.fvi_id
       join PedidoVentaItem pvi
         on pvfv.pvi_id = pvi.pvi_id
       where not exists ( select *
                          from PedidoFacturaVentaTMP
                          where pvTMP_id = p_pvTMP_id
                            and fvi_id = pvfv.fvi_id )
                            and pvi.pv_id = p_pv_id );

   -- borro toda la aplicacion actual de esta factura con pedidos
   --
   delete from PedidoFacturaVenta
   where pvi_id in ( select pvi_id
                     from PedidoVentaItem
                     where pv_id = p_pv_id );

   for v_pvfv_id, v_pvi_id, v_fvi_id, v_pvfv_cantidad in
        select pvfv_id,
               pvi_id,
               fvi_id,
               pvfv_cantidad
        from PedidoFacturaVentaTMP
        where pvTMP_id = p_pvTMP_id
   loop

      -- obtengo por el orden el pvi que le corresponde a este fvi
      --
      if p_bIsAplic = 0 then

         v_orden := v_orden + 1;

         select pvi_id
           into v_pvi_id
         from PedidoVentaItem
         where pv_id = p_pv_id
           and pvi_orden = v_orden;

      end if;

      -- finalmente grabo la vinculacion que puede estar asociada a una deuda o a un pago
      --
      select sp_dbGetNewId('PedidoFacturaVenta', 'pvfv_id') into v_pvfv_id;

      insert into PedidoFacturaVenta( pvfv_id, pvfv_cantidad, pvi_id, fvi_id )
                             values ( v_pvfv_id, v_pvfv_cantidad, v_pvi_id, v_fvi_id );
   end loop;

/*
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                               //
//                                        update pendiente en facturas                                           //
//                                                                                                               //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
*/

   perform sp_doc_pedido_vta_factura_set_pendiente(p_pv_id);

/*
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                               //
//                                        aplicacion remito                                                      //
//                                                                                                               //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
*/

   v_orden := 0;

   create temporary table tt_PedidoVentaRemito(rv_id integer) on commit drop;

   insert into tt_PedidoVentaRemito
     ( rv_id )
     ( select distinct rvi.rv_id
       from PedidoRemitoVenta pvrv
       join RemitoVentaItem rvi
         on pvrv.rvi_id = rvi.rvi_id
       join PedidoVentaItem pvi
         on pvrv.pvi_id = pvi.pvi_id
       where not exists ( select *
                          from PedidoRemitoVentaTMP
                          where pvTMP_id = p_pvTMP_id
                            and rvi_id = pvrv.rvi_id )
                            and pvi.pv_id = p_pv_id );

   -- borro toda la aplicacion actual de esta remito con pedidos
   --
   delete from PedidoRemitoVenta
   where pvi_id in ( select pvi_id
                     from PedidoVentaItem
                     where pv_id = p_pv_id );

   for v_pvrv_id, v_pvi_id, v_rvi_id, v_pvrv_cantidad in
       select pvrv_id,
              pvi_id,
              rvi_id,
              pvrv_cantidad
       from PedidoRemitoVentaTMP
       where pvTMP_id = p_pvTMP_id
   loop

         -- obtengo por el orden el pvi que le corresponde a este rvi
         --
         if p_bIsAplic = 0 then

            v_orden := v_orden + 1;

            select pvi_id
              into v_pvi_id
            from PedidoVentaItem
            where pv_id = p_pv_id
              and pvi_orden = v_orden;

         end if;

         -- finalmente grabo la vinculacion que puede estar asociada a una deuda o a un pago
         --
         select sp_dbGetNewId('PedidoRemitoVenta', 'pvrv_id') into v_pvrv_id;

         insert into PedidoRemitoVenta( pvrv_id, pvrv_cantidad, pvi_id, rvi_id )
                               values ( v_pvrv_id, v_pvrv_cantidad, v_pvi_id, v_rvi_id );
   end loop;

/*
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                               //
//                                        update pendiente en remitos                                            //
//                                                                                                               //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
*/

   perform sp_doc_pedido_vta_remito_set_pendiente(p_pv_id);

/*
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                               //
//                                        aplicacion devolucion                                                  //
//                                                                                                               //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
*/

   v_orden := 0;

   create temporary table tt_PedidoDevolucionVenta(pv_id integer) on commit drop;

   if v_doct_id = 5 then

      insert into tt_PedidoDevolucionVenta
        ( pv_id )
        ( select distinct pvi.pv_id
          from PedidoDevolucionVenta pvdv
          join PedidoVentaItem pvi
            on pvdv.pvi_id_devolucion = pvi.pvi_id
          join PedidoVentaItem pvir
            on pvdv.pvi_id_pedido = pvir.pvi_id
          where not exists ( select *
                             from PedidoDevolucionVentaTMP
                             where pvTMP_id = p_pvTMP_id
                               and pvi_id_devolucion = pvdv.pvi_id_devolucion )
                               and pvir.pv_id = p_pv_id );

      -- borro toda la aplicacion actual de este pedido con devoluciones
      --
      delete from PedidoDevolucionVenta
      where pvi_id_pedido in ( select pvi_id
                               from PedidoVentaItem
                               where pv_id = p_pv_id );

      for v_pvdv_id, v_pvi_id_pedido, v_pvi_id_devolucion, v_pvdv_cantidad in
           select pvdv_id,
                  pvi_id_pedido,
                  pvi_id_devolucion,
                  pvdv_cantidad
           from PedidoDevolucionVentaTMP
           where pvTMP_id = p_pvTMP_id
      loop

          -- obtengo por el orden el pvi_pedido que le corresponde a este pvi_devolucion
          --
          if p_bIsAplic = 0 then

             v_orden := v_orden + 1;

             select pvi_id
               into v_pvi_id_pedido
             from PedidoVentaItem
             where pv_id = p_pv_id
               and pvi_orden = v_orden;

          end if;

          -- finalmente grabo la vinculacion
          --
          select sp_dbGetNewId('PedidoDevolucionVenta', 'pvdv_id') into v_pvdv_id;

          insert into PedidoDevolucionVenta( pvdv_id, pvdv_cantidad, pvi_id_pedido, pvi_id_devolucion )
                                    values ( v_pvdv_id, v_pvdv_cantidad, v_pvi_id_pedido, v_pvi_id_devolucion );
      end loop;

/*
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                               //
//                                        update pendiente en pedidos                                            //
//                                                                                                               //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
*/

      perform sp_doc_pedido_vta_devolucion_set_pendiente(p_pv_id);

   else

      insert into tt_PedidoDevolucionVenta
        ( pv_id )
        ( select distinct pvi.pv_id
          from PedidoDevolucionVenta pvdv
          join PedidoVentaItem pvi
            on pvdv.pvi_id_pedido = pvi.pvi_id
          join PedidoVentaItem pvid
            on pvdv.pvi_id_devolucion = pvid.pvi_id
          where not exists ( select *
                             from PedidoDevolucionVentaTMP
                             where pvTMP_id = p_pvTMP_id
                               and pvi_id_pedido = pvdv.pvi_id_pedido )
                               and pvid.pv_id = p_pv_id );

      -- borro toda la aplicacion actual de esta devolucion con pedidos
      --
      delete from PedidoDevolucionVenta
      where pvi_id_devolucion in ( select pvi_id
                                   from PedidoVentaItem
                                   where pv_id = p_pv_id );

      for v_pvdv_id, v_pvi_id_devolucion, v_pvi_id_pedido, v_pvdv_cantidad in
          select pvdv_id,
                 pvi_id_devolucion,
                 pvi_id_pedido,
                 pvdv_cantidad
          from PedidoDevolucionVentaTMP
          where pvTMP_id = p_pvTMP_id
      loop

         -- obtengo por el orden el pvi_devolucion que le corresponde a este pvi_pedido
         --
         if p_bIsAplic = 0 then

            v_orden := v_orden + 1;

            select pvi_id
              into v_pvi_id_devolucion
            from PedidoVentaItem
            where pv_id = p_pv_id
              and pvi_orden = v_orden;

         end if;

         -- finalmente grabo la vinculacion
         --
         select sp_dbGetNewId('PedidoDevolucionVenta', 'pvdv_id') into v_pvdv_id;

         insert into PedidoDevolucionVenta( pvdv_id, pvdv_cantidad, pvi_id_devolucion, pvi_id_pedido )
                                   values ( v_pvdv_id, v_pvdv_cantidad, v_pvi_id_devolucion, v_pvi_id_pedido );
      end loop;

/*
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                               //
//                                        update pendiente en pedidos                                            //
//                                                                                                               //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
*/
      perform sp_doc_pedido_vta_devolucion_set_pendiente(p_pv_id);

   end if;

/*
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                               //
//                                        update pendiente en items                                              //
//                                                                                                               //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
*/
   perform sp_doc_pedido_venta_set_pendiente(p_pv_id);

exception
   when others then

      raise exception 'Ha ocurrido un error al grabar la vinculación del pedido de venta con los remitos, facturas, devoluciones y packing list. sp_doc_pedido_vta_save_aplic. %. %.',
                      sqlstate, sqlerrm;

end;
$BODY$
  language plpgsql volatile
  cost 100;
alter function sp_doc_pedido_vta_save_aplic(integer, integer, integer)
  owner to postgres;