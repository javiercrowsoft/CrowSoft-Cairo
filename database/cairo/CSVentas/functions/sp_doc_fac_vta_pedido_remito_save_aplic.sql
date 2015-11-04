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
-- Function: sp_doc_fac_vta_pedido_remito_save_aplic()

-- drop function sp_doc_fac_vta_pedido_remito_save_aplic(integer, integer, integer);

create or replace function sp_doc_fac_vta_pedido_remito_save_aplic
(
  in p_fv_id integer,
  in p_fvTMP_id integer,
  in p_bIsAplic integer default 0
)
  returns void as
$BODY$
declare
   v_fvi_id integer;
   v_orden integer;
   v_pvfv_id integer;
   v_pvfv_cantidad decimal(18,6);
   v_pvi_id integer;
   v_rvfv_id integer;
   v_rvfv_cantidad decimal(18,6);
   v_rvi_id integer;
   v_pklstfv_id integer;
   v_pklstfv_cantidad decimal(18,6);
   v_pklsti_cancelado decimal(18,6);
   v_pklsti_id integer;
   v_horafv_id integer;
   v_horafv_cantidad decimal(18,6);
   v_hora_id integer;
begin

/*
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
//                                        update pendiente en pedidos                                                 //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
*/

   v_orden := 0;

   create temporary table tt_PedidoVentaFac
   (
     pv_id integer
   ) on commit drop;

   insert into tt_PedidoVentaFac
     ( pv_id )
     ( select distinct pvi.pv_id
       from PedidoFacturaVenta pvfv
       join PedidoVentaItem pvi
         on pvfv.pvi_id = pvi.pvi_id
       join FacturaVentaItem fvi
         on pvfv.fvi_id = fvi.fvi_id
       where not exists ( select *
                          from PedidoFacturaVentaTMP
                          where fvTMP_id = p_fvTMP_id
                            and pvi_id = pvfv.pvi_id )
         and fvi.fv_id = p_fv_id );

   -- borro toda la aplicacion actual de esta factura con pedidos
   --
   delete PedidoFacturaVenta
   where fvi_id in ( select fvi_id
                     from FacturaVentaItem
                     where fv_id = p_fv_id );

   open c_aplicPedido;

   for v_pvfv_id,v_fvi_id,v_pvi_id,v_pvfv_cantidad in
        select pvfv_id,
                  fvi_id,
                  pvi_id,
                  pvfv_cantidad
        from PedidoFacturaVentaTMP
        where fvTMP_id = p_fvTMP_id
   loop

      -- obtengo por el orden el fvi que le corresponde a este pvi
      --
      if p_bIsAplic = 0 then

         v_orden := v_orden + 1;

         select fvi_id
           into v_fvi_id
         from FacturaVentaItem
         where fv_id = p_fv_id
           and fvi_orden = v_orden;

      end if;

      -- finalmente grabo la vinculacion
      --
      select sp_dbGetNewId('PedidoFacturaVenta', 'pvfv_id') into v_pvfv_id;

      insert into PedidoFacturaVenta( pvfv_id, pvfv_cantidad, fvi_id, pvi_id )
      values ( v_pvfv_id, v_pvfv_cantidad, v_fvi_id, v_pvi_id );

   end loop;

   perform sp_doc_fac_vta_pedido_set_pendiente(p_fv_id);

/*
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
//                                        update pendiente en remitos                                                 //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
*/

   v_orden := 0;
   
   create temporary table tt_RemitoVentaFac
   (
     rv_id integer
   ) on commit drop;

   insert into tt_RemitoVentaFac
     ( rv_id )
     ( select distinct rvi.rv_id
       from RemitoFacturaVenta rvfv
       join RemitoVentaItem rvi
         on rvfv.rvi_id = rvi.rvi_id
       join FacturaVentaItem fvi
         on rvfv.fvi_id = fvi.fvi_id
       where not exists ( select *
                          from RemitoFacturaVentaTMP
                          where fvTMP_id = p_fvTMP_id
                            and rvi_id = rvfv.rvi_id )
         and fvi.fv_id = p_fv_id );

   -- borro toda la aplicacion actual de esta factura con pedidos
   --
   delete RemitoFacturaVenta
   where fvi_id in ( select fvi_id
                     from FacturaVentaItem
                     where fv_id = p_fv_id );

   for v_rvfv_id,v_fvi_id,v_rvi_id,v_rvfv_cantidad in
        select rvfv_id,
               fvi_id,
               rvi_id,
               rvfv_cantidad
        from RemitoFacturaVentaTMP
        where fvTMP_id = p_fvTMP_id
   loop

      -- obtengo por el orden el fvi que le corresponde a este rvi
      --
      if p_bIsAplic = 0 then

         v_orden := v_orden + 1;

         select fvi_id
           into v_fvi_id
         from FacturaVentaItem
         where fv_id = p_fv_id
           and fvi_orden = v_orden;

      end if;

      -- finalmente grabo la vinculacion que puede estar asociada a una deuda o a un pago
      --
      select sp_dbGetNewId('RemitoFacturaVenta', 'rvfv_id') into v_rvfv_id;

      insert into RemitoFacturaVenta( rvfv_id, rvfv_cantidad, fvi_id, rvi_id )
      values ( v_rvfv_id, v_rvfv_cantidad, v_fvi_id, v_rvi_id );

   end loop;

   perform sp_doc_fac_vta_remito_set_pendiente(p_fv_id);

/*
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
//                                        update pendiente en packing list                                            //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
*/
   
   v_orden := 0;

   create temporary table tt_PackingListFac
   (
     pklst_id integer
   ) on commit drop;

   insert into tt_PackingListFac
     ( pklst_id )
     ( select distinct pklsti.pklst_id
       from PackingListFacturaVenta pklstfv
       join PackingListItem pklsti
         on pklstfv.pklsti_id = pklsti.pklsti_id
       join FacturaVentaItem fvi
         on pklstfv.fvi_id = fvi.fvi_id
       where not exists ( select *
                          from PackingListFacturaVentaTMP
                          where fvTMP_id = p_fvTMP_id
                            and pklsti_id = pklstfv.pklsti_id )
         and fvi.fv_id = p_fv_id );

   for v_pklstfv_id,v_pklsti_id,v_pklstfv_cantidad in
        select pklstfv_id,
               pklsti_id,
               pklstfv_cantidad
        from PackingListFacturaVentaTMP
        where fvTMP_id = p_fvTMP_id
   loop

      -- obtengo por el orden el fvi que le corresponde a este pklsti
      --
      v_orden := v_orden + 1;

      select fvi_id
        into v_fvi_id
      from FacturaVentaItem
      where fv_id = p_fv_id
        and fvi_orden = v_orden;

      -- finalmente grabo la vinculacion que puede estar asociada a una deuda o a un pago
      --
      select sp_dbGetNewId('PackingListFacturaVenta', 'pklstfv_id') into v_pklstfv_id;

      insert into PackingListFacturaVenta( pklstfv_id, pklstfv_cantidad, fvi_id, pklsti_id )
      values ( v_pklstfv_id, v_pklstfv_cantidad, v_fvi_id, v_pklsti_id );

      update FacturaVentaItem
         set fvi_pendientepklst = fvi_cantidadaremitir - v_pklstfv_cantidad
      where fvi_id = v_fvi_id;

   end loop;

   close c_aplicPacking;

   perform sp_doc_fac_vta_pack_set_pendiente(p_fv_id);

/*
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
//                                        update pendiente en horas                                                   //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
*/
   
   v_orden := 0;

   create temporary table tt_HoraFac
   (
     hora_id integer
   ) on commit drop;
   
   insert into tt_HoraFac
     ( hora_id )
     ( select distinct horafv.hora_id
       from HoraFacturaVenta horafv
       join Hora hora
         on horafv.hora_id = Hora.hora_id
       join FacturaVentaItem fvi
         on horafv.fvi_id = fvi.fvi_id
       where not exists ( select *
                          from HoraFacturaVentaTMP
                          where fvTMP_id = p_fvTMP_id
                            and hora_id = horafv.hora_id )
         and fvi.fv_id = p_fv_id );

   -- borro toda la aplicacion actual de esta factura con pedidos
   --
   delete HoraFacturaVenta
   where fvi_id in ( select fvi_id
                     from FacturaVentaItem
                     where fv_id = p_fv_id );

   for v_horafv_id,v_fvi_id,v_hora_id,v_horafv_cantidad in
        select horafv_id,
               fvi_id,
               hora_id,
               horafv_cantidad
        from HoraFacturaVentaTMP
        where fvTMP_id = p_fvTMP_id
   loop

      -- obtengo por el orden el fvi que le corresponde a este hora
      --
      if p_bIsAplic = 0 then

         v_orden := v_orden + 1;

         select fvi_id
           into v_fvi_id
         from FacturaVentaItem
         where fv_id = p_fv_id
         and fvi_orden = v_orden;

      end if;

      -- finalmente grabo la vinculacion que puede estar asociada a una deuda o a un pago
      --
      select sp_dbGetNewId('HoraFacturaVenta', 'horafv_id') into v_horafv_id;

      insert into HoraFacturaVenta( horafv_id, horafv_cantidad, fvi_id, hora_id )
      values ( v_horafv_id, v_horafv_cantidad, v_fvi_id, v_hora_id );

   end loop;

   perform sp_doc_fac_vta_hora_set_pendiente(p_fv_id);

/*
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
//                                        update pendiente en items                                                   //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
*/
   perform sp_doc_factura_vta_set_item_pendiente(p_fv_id);

exception
   when others then

      raise exception 'Ha ocurrido un error al grabar la aplicacion de la factura de compra con las ordenes de compra y remitos. sp_doc_fac_vta_pedido_remito_save_aplic. %. %.',
                      sqlstate, sqlerrm;

end;
$BODY$
  language plpgsql volatile
  cost 100;
alter function sp_doc_fac_vta_pedido_remito_save_aplic(integer, integer, integer)
  owner to postgres;