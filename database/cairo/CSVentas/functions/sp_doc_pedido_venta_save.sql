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
-- Function: sp_doc_pedido_venta_save()

-- drop function sp_doc_pedido_venta_save(integer, integer);

create or replace function sp_doc_pedido_venta_save
(
  in p_us_id integer,
  in p_pvTMP_id integer
)
  returns setof row_result as
$BODY$
declare
   rtn row_result;

   v_success integer;
   v_error integer;
   v_error_msg varchar(5000);
   v_cfg_valor varchar(5000);
   v_doc_llevaFirmacredito smallint;
   
   v_is_new integer;

   v_pv_id integer;
   v_pvi_id integer;
   
   v_orden smallint;
   v_doct_id integer;
   
   v_emp_id integer;
   v_doc_id integer;
   v_est_id integer;
   v_suc_id integer;
   v_cli_id integer;
   v_ta_id integer;
   v_lp_id integer;
   v_ld_id integer;
   v_cpg_id integer;
   v_ccos_id integer;
   v_lgj_id integer;
   v_ven_id integer;
   v_pro_id_origen integer;
   v_pro_id_destino integer;
   v_trans_id integer;
   v_chof_id integer;
   v_cam_id integer;
   v_cam_id_semi integer;
   v_clis_id integer;

   v_pv_nrodoc varchar(50);
   v_pv_numero integer;
   v_pv_descrip varchar(5000);
   v_pv_fecha timestamp with time zone;
   v_pv_fechaentrega timestamp with time zone;
   v_pv_neto decimal(18,6);
   v_pv_ivari decimal(18,6);
   v_pv_ivarni decimal(18,6);
   v_pv_total decimal(18,6);
   v_pv_subtotal decimal(18,6);
   v_pv_descuento1 decimal(18,6);
   v_pv_descuento2 decimal(18,6);
   v_pv_importedesc1 decimal(18,6);
   v_pv_importedesc2 decimal(18,6);
   v_pv_destinatario varchar(1000);
   v_pv_ordencompra varchar(255);
   v_ram_id_stock varchar(50);
   
   v_creado timestamp with time zone;
   v_modificado timestamp with time zone;
   v_modifico integer;
      
   v_pvi_orden smallint;
   v_pvi_cantidad decimal(18,6);
   v_pvi_cantidadaremitir decimal(18,6);
   v_pvi_pendiente decimal(18,6);
   v_pvi_pendientepklst decimal(18,6);
   v_pvi_descrip varchar(5000);
   v_pvi_precio decimal(18,6);
   v_pvi_precioUsr decimal(18,6);
   v_pvi_precioLista decimal(18,6);
   v_pvi_descuento varchar(100);
   v_pvi_neto decimal(18,6);
   v_pvi_ivari decimal(18,6);
   v_pvi_ivarni decimal(18,6);
   v_pvi_ivariporc decimal(18,6);
   v_pvi_ivarniporc decimal(18,6);
   v_pvi_importe decimal(18,6);

   v_pr_id integer;

   v_ta_propuesto smallint;
   v_ta_tipo smallint;
   v_ta_nrodoc varchar(100);
   dummyChar varchar(255) := '';

begin

   -- si no existe chau
   --
   if not exists ( select pvTMP_id
                   from PedidoVentaTMP
                   where pvTMP_id = p_pvTMP_id ) then
      return query select * from result_failed();
      return;

   end if;

   v_error_msg := '';

   select pv_id,
          doct_id,
          Documento.doc_id,
          pv_nrodoc,
          emp_id
     into v_pv_id,
          v_doct_id,
          v_doc_id,
          v_pv_nrodoc,
          v_emp_id
   from PedidoVentaTMP
   join Documento
     on PedidoVentaTMP.doc_id = Documento.doc_id
   where pvTMP_id = p_pvTMP_id;

   v_pv_id := coalesce(v_pv_id, 0);   

   SET TRANSACTION READ WRITE;

/*
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
//                                        insert                                                                      //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
*/
   if v_pv_id = 0 then

      v_is_new := -1;

      select sp_dbGetNewId('PedidoVenta', 'pv_id') into v_pv_id;
      select sp_dbGetNewId('PedidoVenta', 'pv_numero') into v_pv_numero;

      select * from sp_talonario_get_propuesto(v_doc_id, v_cli_id, 0) into dummyChar, v_ta_propuesto, v_ta_id, v_ta_tipo;

      if v_ta_propuesto = 0 then
         if v_ta_tipo = 3 then /*Auto Impresor*/

            select sp_talonario_get_next_number(v_ta_id) into v_ta_nrodoc;

            -- con esto evitamos que dos tomen el mismo numero
            --
            perform sp_talonario_set(v_ta_id, v_ta_nrodoc);

            v_pv_nrodoc := v_ta_nrodoc;

         end if;
      end if;

      insert into pedidoventa
           ( pv_id, pv_numero, pv_nrodoc, pv_descrip, pv_fecha, pv_fechaentrega, pv_neto, pv_ivari, pv_ivarni,
             pv_total, pv_subtotal, pv_descuento1, pv_descuento2, pv_importedesc1, pv_importedesc2, pv_destinatario,
             pv_ordencompra, est_id, suc_id, cli_id, emp_id, doc_id, doct_id, ram_id_stock, lp_id, ld_id, cpg_id,
             ccos_id, lgj_id, ven_id, pro_id_origen, pro_id_destino, trans_id, chof_id, cam_id, cam_id_semi,
             clis_id, modifico )
           ( select v_pv_id,
                    v_pv_numero,
                    v_pv_nrodoc,
                    pv_descrip,
                    pv_fecha,
                    pv_fechaentrega,
                    pv_neto,
                    pv_ivari,
                    pv_ivarni,
                    pv_total,
                    pv_subtotal,
                    pv_descuento1,
                    pv_descuento2,
                    pv_importedesc1,
                    pv_importedesc2,
                    pv_destinatario,
                    pv_ordencompra,
                    est_id,
                    suc_id,
                    cli_id,
                    v_emp_id,
                    doc_id,
                    v_doct_id,
                    ram_id_stock,
                    lp_id,
                    ld_id,
                    cpg_id,
                    ccos_id,
                    lgj_id,
                    ven_id,
                    pro_id_origen,
                    pro_id_destino,
                    trans_id,
                    chof_id,
                    cam_id,
                    cam_id_semi,
                    clis_id,
                    modifico
             from PedidoVentaTMP
             where pvTMP_id = p_pvTMP_id );

/*
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
//                                        update                                                                      //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
*/
   else

      v_is_new := 0;

      select pv_id,
             pv_nrodoc,
             pv_descrip,
             pv_fecha,
             pv_fechaentrega,
             pv_neto,
             pv_ivari,
             pv_ivarni,
             pv_total,
             pv_descuento1,
             pv_descuento2,
             pv_subtotal,
             pv_importedesc1,
             pv_importedesc2,
             pv_destinatario,
             pv_ordencompra,
             est_id,
             suc_id,
             cli_id,
             doc_id,
             ram_id_stock,
             lp_id,
             ld_id,
             cpg_id,
             ccos_id,
             lgj_id,
             ven_id,
             pro_id_origen,
             pro_id_destino,
             trans_id,
             chof_id,
             cam_id,
             cam_id_semi,
             clis_id,
             modifico,
             modificado
        into v_pv_id,
             v_pv_nrodoc,
             v_pv_descrip,
             v_pv_fecha,
             v_pv_fechaentrega,
             v_pv_neto,
             v_pv_ivari,
             v_pv_ivarni,
             v_pv_total,
             v_pv_descuento1,
             v_pv_descuento2,
             v_pv_subtotal,
             v_pv_importedesc1,
             v_pv_importedesc2,
             v_pv_destinatario,
             v_pv_ordencompra,
             v_est_id,
             v_suc_id,
             v_cli_id,
             v_doc_id,
             v_ram_id_stock,
             v_lp_id,
             v_ld_id,
             v_cpg_id,
             v_ccos_id,
             v_lgj_id,
             v_ven_id,
             v_pro_id_origen,
             v_pro_id_destino,
             v_trans_id,
             v_chof_id,
             v_cam_id,
             v_cam_id_semi,
             v_clis_id,
             v_modifico,
             v_modificado
      from PedidoVentaTMP
      where pvTMP_id = p_pvTMP_id;

      update PedidoVenta
            set pv_nrodoc = v_pv_nrodoc,
                pv_descrip = v_pv_descrip,
                pv_fecha = v_pv_fecha,
                pv_fechaentrega = v_pv_fechaentrega,
                pv_neto = v_pv_neto,
                pv_ivari = v_pv_ivari,
                pv_ivarni = v_pv_ivarni,
                pv_total = v_pv_total,
                pv_descuento1 = v_pv_descuento1,
                pv_descuento2 = v_pv_descuento2,
                pv_subtotal = v_pv_subtotal,
                pv_importedesc1 = v_pv_importedesc1,
                pv_importedesc2 = v_pv_importedesc2,
                pv_destinatario = v_pv_destinatario,
                pv_ordencompra = v_pv_ordencompra,
                est_id = v_est_id,
                suc_id = v_suc_id,
                cli_id = v_cli_id,
                emp_id = v_emp_id,
                doc_id = v_doc_id,
                doct_id = v_doct_id,
                ram_id_stock = v_ram_id_stock,
                lp_id = v_lp_id,
                ld_id = v_ld_id,
                cpg_id = v_cpg_id,
                ccos_id = v_ccos_id,
                lgj_id = v_lgj_id,
                ven_id = v_ven_id,
                pro_id_origen = v_pro_id_origen,
                pro_id_destino = v_pro_id_destino,
                trans_id = v_trans_id,
                chof_id = v_chof_id,
                cam_id = v_cam_id,
                cam_id_semi = v_cam_id_semi,
                clis_id = v_clis_id,
                modifico = v_modifico,
                modificado = v_modificado,
                --
                -- firma (cuando se modifica se elimina la firma)
                --
                pv_firmado = 0
      where pv_id = v_pv_id;

   end if;

/*
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
//                                        items                                                                       //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
*/
   v_orden := 1;

   while exists(select 1 from PedidoVentaItemTMP where pvTMP_id = p_pvTMP_id and pvi_orden = v_orden)
   loop

      select pvi_id,
             pvi_orden,
             pvi_cantidad,
             pvi_cantidadaremitir,
             pvi_descrip,
             pvi_precio,
             pvi_precioUsr,
             pvi_precioLista,
             pvi_descuento,
             pvi_neto,
             pvi_ivari,
             pvi_ivarni,
             pvi_ivariporc,
             pvi_ivarniporc,
             pvi_importe,
             pr_id,
             ccos_id
        into v_pvi_id,
             v_pvi_orden,
             v_pvi_cantidad,
             v_pvi_cantidadaremitir,
             v_pvi_descrip,
             v_pvi_precio,
             v_pvi_precioUsr,
             v_pvi_precioLista,
             v_pvi_descuento,
             v_pvi_neto,
             v_pvi_ivari,
             v_pvi_ivarni,
             v_pvi_ivariporc,
             v_pvi_ivarniporc,
             v_pvi_importe,
             v_pr_id,
             v_ccos_id
        from PedidoVentaItemTMP
        where pvTMP_id = p_pvTMP_id
          and pvi_orden = v_orden;

         -- cuando se inserta se indica
         -- como cantidad a remitir la cantidad (por ahora)
         --
         v_pvi_cantidadaremitir := v_pvi_cantidad;

      if v_is_new <> 0 or v_pvi_id = 0 then

          -- cuando se inserta se toma la cantidad a remitir
          -- como el pendiente
          --
          v_pvi_pendiente := v_pvi_cantidadaremitir;

          v_pvi_pendientepklst := v_pvi_cantidadaremitir;

          select sp_dbGetNewId('PedidoVentaItem', 'pvi_id') into v_pvi_id;

          insert into pedidoventaItem
            ( pv_id, pvi_id, pvi_orden, pvi_cantidad, pvi_cantidadaremitir, pvi_pendiente, pvi_pendientepklst,
              pvi_descrip, pvi_precio, pvi_precioUsr, pvi_precioLista, pvi_descuento, pvi_neto, pvi_ivari, pvi_ivarni,
              pvi_ivariporc, pvi_ivarniporc, pvi_importe, pr_id, ccos_id )
          values ( v_pv_id, v_pvi_id, v_pvi_orden, v_pvi_cantidad, v_pvi_cantidadaremitir, v_pvi_pendiente,
                   v_pvi_pendientepklst, v_pvi_descrip, v_pvi_precio, v_pvi_precioUsr, v_pvi_precioLista,
                   v_pvi_descuento, v_pvi_neto, v_pvi_ivari, v_pvi_ivarni, v_pvi_ivariporc, v_pvi_ivarniporc,
                   v_pvi_importe, v_pr_id, v_ccos_id );

      else

          -- cuando se modifica se encarga el sp sp_doc_pedido_venta_set_pendiente de actualizar
          -- pvi_pendiente, pvi_pendientepklst, y pv_pendiente
          --
          update PedidoVentaItem
             set pv_id = v_pv_id,
                 pvi_orden = v_pvi_orden,
                 pvi_cantidad = v_pvi_cantidad,
                 pvi_cantidadaremitir = v_pvi_cantidadaremitir,
                 pvi_descrip = v_pvi_descrip,
                 pvi_precio = v_pvi_precio,
                 pvi_precioUsr = v_pvi_precioUsr,
                 pvi_precioLista = v_pvi_precioLista,
                 pvi_descuento = v_pvi_descuento,
                 pvi_neto = v_pvi_neto,
                 pvi_ivari = v_pvi_ivari,
                 pvi_ivarni = v_pvi_ivarni,
                 pvi_ivariporc = v_pvi_ivariporc,
                 pvi_ivarniporc = v_pvi_ivarniporc,
                 pvi_importe = v_pvi_importe,
                 pr_id = v_pr_id,
                 ccos_id = v_ccos_id
          where pv_id = v_pv_id
            and pvi_id = v_pvi_id;

      end if;

      v_orden := v_orden + 1;

   end loop;


/*
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
//                                        items borrados                                                              //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
*/

   if v_is_new = 0 then

      delete from PedidoVentaItem
      where exists ( select pvi_id
                     from PedidoVentaItemBorradoTMP
                     where pv_id = v_pv_id
                       and pvTMP_id = p_pvTMP_id
                       and pvi_id = PedidoVentaItem.pvi_id );

      delete from PedidoVentaItemBorradoTMP
      where pv_id = v_pv_id
        and pvTMP_id = p_pvTMP_id;

   end if;

/*
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
//                             aplicacion presupuesto - pedido                                                        //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
*/
   perform sp_doc_pedido_vta_save_aplic(v_pv_id, p_pvTMP_id, 0);

/*
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
//                                     talonarios                                                                     //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
*/
   select ta_id into v_ta_id from Documento where doc_id = v_doc_id;

   perform sp_talonario_set(v_ta_id, v_pv_nrodoc);

/*
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
//                                     firma                                                                          //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
*/

   select sp_cfg_getValor('Ventas-Config', 'Borrar firma al modificar el pedido') into v_cfg_valor;

   v_cfg_valor := coalesce(v_cfg_valor, '0');

   if to_number(v_cfg_valor) <> 0 then

      update PedidoVenta
         set pv_firmado = 0
      where pv_id = v_pv_id;

   end if;

   -- actualizo la deuda del pedido
   --
   perform sp_doc_pedido_venta_set_pendiente(v_pv_id);

   perform sp_doc_pedido_venta_set_credito(v_pv_id);

   perform sp_doc_pedido_venta_set_estado(v_pv_id);

/*
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
//                                     validaciones al documento                                                      //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
*/
   -- estado
   --
   select * from sp_auditoria_estado_check_doc_pv(v_pv_id) into v_success, v_error_msg;
   if coalesce(v_success, 0) = 0 then
      raise exception '%', v_error_msg;
   end if;

   -- totales
   --
   select * from sp_auditoria_totales_check_doc_pv(v_pv_id) into v_success, v_error_msg;
   if coalesce(v_success, 0) = 0 then
      raise exception '%', v_error_msg;
   end if;

   -- credito
   --
   select * from sp_auditoria_credito_check_doc_pv(v_pv_id) into v_success, v_error_msg;
   if coalesce(v_success, 0) = 0 then
      raise exception '%', v_error_msg;
   end if;

/*
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
//                                     borrar temporales                                                              //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
*/
   delete from PedidoVentaItemTMP where pvTMP_ID = p_pvTMP_id;
   delete from PedidoVentaTMP where pvTMP_ID = p_pvTMP_id;

/*
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
//                                     historial de modificaciones                                                    //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
*/

   select modifico into v_modifico from PedidoVenta where pv_id = v_pv_id;

   if v_is_new <> 0 then
      perform sp_historia_update(16003, v_pv_id, v_modifico, 1);
   else
      perform sp_historia_update(16003, v_pv_id, v_modifico, 3);
   end if;

/*
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
//                                     fin                                                                            //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
*/

   select sp_cfg_getValor('Ventas-Config', 'Informar Pedido sin Precio Vta') into v_cfg_valor;

   v_cfg_valor := coalesce(v_cfg_valor, '0');

   if to_number(v_cfg_valor) <> 0 then

      if exists ( select 1
                  from PedidoVentaItem
                  where round(pvi_importe, 2) = 0
                    and pv_id = v_pv_id ) then

         return query select * from result_info('Este pedido posee items sin precio.');

      end if;

   end if;

   select sp_cfg_getValor('Ventas-Config', 'Informar Pedido sin Firma') into v_cfg_valor;

   v_cfg_valor := coalesce(v_cfg_valor, '0');

   select doc_llevafirmacredito
     into v_doc_llevaFirmacredito
   from Documento
   where doc_id = v_doc_id;

   if to_number(v_cfg_valor) <> 0 and v_doc_llevaFirmacredito <> 0 then

      select est_id
        into v_est_id
      from PedidoVenta
      where pv_id = v_pv_id;

      if v_est_id = 4 /*Pendiente de Firma*/ then

         return query select * from result_info('Este pedido esta pendiente de firma y no puede ser despachado hasta que no lo apruebe un supervisor.');

      end if;

   end if;

/*
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
//                                     fin                                                                            //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
*/

   rtn.type := 'pv_id';
   rtn.id := v_pv_id;

   return next rtn;

exception
   when others then

     raise exception 'Ha ocurrido un error al grabar el pedido de venta. sp_doc_pedido_venta_save. %. %.',
                      sqlstate, sqlerrm;

end;
$BODY$
  language plpgsql volatile
  cost 100;
alter function sp_doc_pedido_venta_save(integer, integer)
  owner to postgres;