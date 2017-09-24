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
-- Function: sp_doc_factura_compra_save_aplic()

-- drop function sp_doc_factura_compra_save_aplic(integer, integer);

create or replace function sp_doc_factura_compra_save_aplic
(
  in p_us_id integer,
  in p_fcTMP_id integer
)
  returns setof row_result as
$BODY$
declare
   rtn row_result;

   v_success smallint;
   v_error_msg varchar(5000);

   v_fc_id integer;
   v_modifico integer;
   v_opgTMP_id integer;   
   v_cpg_tipo smallint;
begin

   select fc_id,
          modifico
     into v_fc_id,
          v_modifico
   from FacturaCompraTMP
   where fcTMP_id = p_fcTMP_id;

   ---------------------------------
   -- si no hay factura no hago nada
   --
   if v_fc_id is null then

      return query select * from result_failed();
      return;

   end if;

/*
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
//                                        validaciones a la aplicacion                                                //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
*/

   delete from FacturaCompraNotaCreditoTMP
   where fcTMP_id = p_fcTMP_id
     and fcd_id_factura is null
     and fcp_id_factura is null
     and fcd_id_notacredito is null
     and fcp_id_notacredito is null;

   delete from FacturaCompraOrdenPagoTMP
   where opgTMP_id in ( select opgTMP_id
                        from OrdenPagoTMP
                        where fcTMP_id = p_fcTMP_id )
     and fcd_id is null
     and fcp_id is null;

/*
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
//                                        transaccion                                                                 //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
*/

   SET TRANSACTION READ WRITE;

/*
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
//                                        ordenes - remitos                                                           //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
*/
   perform sp_doc_fac_cpra_orden_remito_save_aplic(v_fc_id, p_fcTMP_id, 1);

   select cpg.cpg_tipo
     into v_cpg_tipo
   from FacturaCompra fc
   join CondicionPago cpg
     on fc.cpg_id = cpg.cpg_id
   where fc.fc_id = v_fc_id;

/*
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
//                                        orden pago                                                                  //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
*/

   /*
   ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
   //                                                                                                               //
   //                                        nota de credito                                                        //
   //                                                                                                               //
   ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
   */
   if not v_cpg_tipo in ( 2,3 ) then

      -- este sp se encarga de todo
      --
      perform sp_doc_factura_compra_nota_credito_save(p_us_id, p_fcTMP_id);

      for v_opgTMP_id in
         select opgTMP_id
         from OrdenPagoTMP
         where fcTMP_id = p_fcTMP_id
      loop

         -- aplico la orden de pago con la factura
         --
         perform sp_doc_orden_pago_save_aplic(p_us_id, v_opgTMP_id, 0);

      end loop;

   end if;

   -- aplicaciones automaticas
   /*
   ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
   //                                                                                                               //
   //                                        estado                                                                 //
   //                                                                                                               //
   ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
   */

   perform sp_doc_factura_compra_set_credito(v_fc_id);

   perform sp_doc_factura_compra_set_estado(v_fc_id);

   /*
   ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
   //                                                                                                               //
   //                                        validaciones                                                           //
   //                                                                                                               //
   ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
   */

   -- estado
   --
   select * from sp_auditoria_estado_check_doc_fc(v_fc_id) into v_success, v_error_msg;
   if coalesce(v_success, 0) = 0 then
      raise exception '%', v_error_msg;
   end if;

   -- vtos
   --
   select * from sp_auditoria_vto_check_doc_fc(v_fc_id) into v_success, v_error_msg;
   if coalesce(v_success, 0) = 0 then
      raise exception '%', v_error_msg;
   end if;

   -- credito
   --
   select * from sp_auditoria_credito_check_doc_fc(v_fc_id) into v_success, v_error_msg;
   if coalesce(v_success, 0) = 0 then
      raise exception '%', v_error_msg;
   end if;

/*
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
//                                        temporales                                                                  //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
*/
   delete from FacturaCompraNotaCreditoTMP where fcTMP_id = p_fcTMP_id;
   delete from FacturaCompraOrdenPagoTMP where opgTMP_id in (select opgTMP_id from OrdenPagoTMP where fcTMP_id = p_fcTMP_id);
   delete from OrdenPagoTMP where fcTMP_id = p_fcTMP_id;
   delete from OrdenFacturaCompraTMP where fcTMP_id = p_fcTMP_id;
   delete from RemitoFacturaCompraTMP where fcTMP_id = p_fcTMP_id;
   delete from FacturaCompraTMP where fcTMP_id = p_fcTMP_id;

/*
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
//                                     historial de modificaciones                                                    //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
*/

   perform sp_historia_update(17001, v_fc_id, v_modifico, 6);

/*
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
//                                     fin                                                                            //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
*/

   rtn.type := 'fc_id';
   rtn.id := v_fc_id;

   return next rtn;

exception
   when others then

     raise exception 'Ha ocurrido un error al grabar la aplicación de la factura de Compra. sp_doc_factura_compra_save_aplic. %. %.',
                      sqlstate, sqlerrm;

end;
$BODY$
  language plpgsql volatile
  cost 100;
alter function sp_doc_factura_compra_save_aplic(integer, integer)
  owner to postgres;