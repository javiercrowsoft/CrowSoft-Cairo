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
-- Function: sp_doc_factura_venta_save_aplic()

-- drop function sp_doc_factura_venta_save_aplic(integer, integer);

create or replace function sp_doc_factura_venta_save_aplic
(
  in p_us_id integer,
  in p_fvTMP_id integer
)
  returns setof row_result as
$BODY$
declare
   rtn row_result;

   v_success smallint;
   v_error_msg varchar(5000);

   v_fv_id integer;
   v_modifico integer;
   v_cobzTMP_id integer;   
   v_cpg_tipo smallint;
begin

   select fv_id,
          modifico
     into v_fv_id,
          v_modifico
   from FacturaVentaTMP
   where fvTMP_id = p_fvTMP_id;

   ---------------------------------
   -- si no hay factura no hago nada
   --
   if v_fv_id is null then

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

   delete from FacturaVentaNotaCreditoTMP
   where fvTMP_id = p_fvTMP_id
     and fvd_id_factura is null
     and fvp_id_factura is null
     and fvd_id_notaCredito is null
     and fvp_id_notaCredito is null;

   delete from FacturaVentaCobranzaTMP
   where cobzTMP_id in ( select cobzTMP_id
                        from CobranzaTMP
                        where fvTMP_id = p_fvTMP_id )
     and fvd_id is null
     and fvp_id is null;

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
//                                        pedidos - remitos                                                           //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
*/
   perform sp_doc_fac_vta_pedido_remito_save_aplic(v_fv_id, p_fvTMP_id, 1);

   select cpg.cpg_tipo
     into v_cpg_tipo
   from FacturaVenta fv
   join CondicionPago cpg
     on fv.cpg_id = cpg.cpg_id
   where fv.fv_id = v_fv_id;

/*
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
//                                        notas de credito                                                            //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
*/

   perform sp_doc_factura_venta_nota_credito_save(p_us_id, p_fvTMP_id);

/*
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
//                                        cobranzas                                                                   //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
*/

   for v_cobzTMP_id in
      select cobzTMP_id
      from CobranzaTMP
      where fvTMP_id = p_fvTMP_id
   loop

      -- aplico la orden de pago con la factura
      --
      perform sp_doc_cobranza_save_aplic(p_us_id, v_cobzTMP_id, 0);

   end loop;

   /*
   ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
   //                                                                                                               //
   //                                        estado                                                                 //
   //                                                                                                               //
   ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
   */

   perform sp_doc_factura_venta_set_credito(v_fv_id);

   perform sp_doc_factura_venta_set_estado(v_fv_id);

   /*
   ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
   //                                                                                                               //
   //                                        validaciones                                                           //
   //                                                                                                               //
   ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
   */

   -- estado
   --
   select * from sp_auditoria_estado_check_doc_fv(v_fv_id) into v_success, v_error_msg;
   if coalesce(v_success, 0) = 0 then
      raise exception '%', v_error_msg;
   end if;

   -- vtos
   --
   select * from sp_auditoria_vto_check_doc_fv(v_fv_id) into v_success, v_error_msg;
   if coalesce(v_success, 0) = 0 then
      raise exception '%', v_error_msg;
   end if;

   -- credito
   --
   select * from sp_auditoria_credito_check_doc_fv(v_fv_id) into v_success, v_error_msg;
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
   delete from FacturaVentaNotaCreditoTMP where fvTMP_id = p_fvTMP_id;
   delete from FacturaVentaCobranzaTMP where cobzTMP_id in (select cobzTMP_id from CobranzaTMP where fvTMP_id = p_fvTMP_id);
   delete from CobranzaTMP where fvTMP_id = p_fvTMP_id;
   delete from PedidoFacturaVentaTMP where fvTMP_id = p_fvTMP_id;
   delete from RemitoFacturaVentaTMP where fvTMP_id = p_fvTMP_id;
   delete from FacturaVentaTMP where fvTMP_id = p_fvTMP_id;

/*
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
//                                     historial de modificaciones                                                    //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
*/

   perform sp_historia_update(17001, v_fv_id, v_modifico, 6);

/*
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
//                                     fin                                                                            //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
*/

   rtn.type := 'fv_id';
   rtn.id := v_fv_id;

   return next rtn;

exception
   when others then

     raise exception 'Ha ocurrido un error al grabar la aplicación de la factura de venta. sp_doc_factura_venta_save_aplic. %. %.',
                      sqlstate, sqlerrm;

end;
$BODY$
  language plpgsql volatile
  cost 100;
alter function sp_doc_factura_venta_save_aplic(integer, integer)
  owner to postgres;