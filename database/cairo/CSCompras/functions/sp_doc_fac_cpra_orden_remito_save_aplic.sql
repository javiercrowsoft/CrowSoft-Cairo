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
-- Function: sp_doc_fac_cpra_ord_rto_save_aplic()

-- drop function sp_doc_fac_cpra_ord_rto_save_aplic(integer, integer, integer);

create or replace
function sp_doc_fac_cpra_orden_remito_save_aplic
(
  in p_fc_id integer,
  in p_fcTMP_id integer,
  in p_bIsAplic integer default 0
)
  returns void as
$BODY$
declare
   v_fci_id integer;
   v_orden integer;
   v_ocfc_id integer;
   v_ocfc_cantidad decimal(18,6);
   v_oci_cancelado decimal(18,6);
   v_oci_id integer;
   v_rcfc_id integer;
   v_rcfc_cantidad decimal(18,6);
   v_rci_cancelado decimal(18,6);
   v_rci_id integer;
begin

   v_orden := 0;

   insert into tt_OrdenCompraFac( oc_id )
     ( select distinct oci.oc_id
       from OrdenFacturaCompra ocfc
       join OrdenCompraItem oci
         on ocfc.oci_id = oci.oci_id
       join FacturaCompraItem fci
         on ocfc.fci_id = fci.fci_id
       where not exists ( select *
                          from OrdenFacturaCompraTMP
                          where fcTMP_id = p_fcTMP_id
                            and oci_id = ocfc.oci_id )
         and fci.fc_id = p_fc_id );


   -- borro toda la aplicacion actual de esta factura con ordenes
   --
   delete OrdenFacturaCompra
   where fci_id in ( select fci_id
                     from FacturaCompraItem
                     where fc_id = p_fc_id );

   for v_ocfc_id, v_fci_id, v_oci_id, v_ocfc_cantidad in
        select ocfc_id,
               fci_id,
               oci_id,
               ocfc_cantidad
        from OrdenFacturaCompraTMP
        where fcTMP_id = p_fcTMP_id
   loop

      -- obtengo por el orden el fci que le corresponde a este oci
      --
      if p_bIsAplic = 0 then

         v_orden := v_orden + 1;

         select fci_id
           into v_fci_id
         from FacturaCompraItem
         where fc_id = p_fc_id
           and fci_orden = v_orden;

      end if;

      -- finalmente grabo la vinculacion que puede estar asociada a una deuda o a un pago
      --
      select sp_dbGetNewId('OrdenFacturaCompra', 'ocfc_id') into v_ocfc_id;

      insert into OrdenFacturaCompra( ocfc_id, ocfc_cantidad, fci_id, oci_id )
           values ( v_ocfc_id, v_ocfc_cantidad, v_fci_id, v_oci_id );

   end loop;

/*
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
//                                        update pendiente en ordenes                                                 //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
*/

   perform sp_doc_fac_cpra_orden_set_pendiente(p_fc_id);

   v_orden := 0;

   insert into tt_RemitoCompraFac
     ( rc_id )
     ( select distinct rci.rc_id
       from RemitoFacturaCompra rcfc
       join RemitoCompraItem rci
         on rcfc.rci_id = rci.rci_id
       join FacturaCompraItem fci
         on rcfc.fci_id = fci.fci_id
       where not exists ( select *
                          from RemitoFacturaCompraTMP
                          where fcTMP_id = p_fcTMP_id
                            and rci_id = rcfc.rci_id )
         and fci.fc_id = p_fc_id );


   -- borro toda la aplicacion actual de esta factura con ordenes
   --
   delete RemitoFacturaCompra
   where fci_id in ( select fci_id
                     from FacturaCompraItem
                     where fc_id = p_fc_id );

   for v_rcfc_id, v_fci_id, v_rci_id, v_rcfc_cantidad in
        select rcfc_id,
               fci_id,
               rci_id,
               rcfc_cantidad
        from RemitoFacturaCompraTMP
        where fcTMP_id = p_fcTMP_id
   loop

      -- obtengo por el orden el fci que le corresponde a este rci
      --
      if p_bIsAplic = 0 then

         v_orden := v_orden + 1;

         select fci_id
           into v_fci_id
         from FacturaCompraItem
         where fc_id = p_fc_id
           and fci_orden = v_orden;

      end if;

      -- finalmente grabo la vinculacion que puede estar asociada a una deuda o a un pago
      --
      select sp_dbGetNewId('RemitoFacturaCompra', 'rcfc_id') into v_rcfc_id;

      insert into RemitoFacturaCompra( rcfc_id, rcfc_cantidad, fci_id, rci_id )
      values ( v_rcfc_id, v_rcfc_cantidad, v_fci_id, v_rci_id );

   end loop;

/*
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
//                                        update pendiente en remitos                                                 //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
*/

   perform sp_DocFacCpraRto_set_pendiente(p_fc_id);

/*
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
//                                        update pendiente en items                                                   //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
*/

   -- Actualizo la deuda de la factura
   --
   perform sp_DocFacCpraSetItemPendiente(p_fc_id);

exception
   when others then

      raise exception 'Ha ocurrido un error al grabar la aplicacion de la factura de compra con las ordenes de compra y remitos. sp_doc_fac_cpra_orden_remito_save_aplic. %. %.',
                      sqlstate, sqlerrm;

end;
$BODY$
  language plpgsql volatile
  cost 100;
alter function sp_doc_fac_cpra_orden_remito_save_aplic(integer, integer)
  owner to postgres;