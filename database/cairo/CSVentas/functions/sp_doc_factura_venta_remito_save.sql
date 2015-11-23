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
-- Function: sp_doc_factura_venta_remito_save()

-- drop function sp_doc_factura_venta_remito_save(integer, varchar);

create or replace function sp_doc_factura_venta_remito_save
(
  in p_fv_id integer,
  in p_rv_nrodoc varchar
)
  returns void as
$BODY$
declare
   v_rvTMP_id integer;
   v_rviTMP_id integer;
   v_rvi_orden smallint;
   v_rvi_cantidad decimal(18,6);
   v_rvi_cantidadaremitir decimal(18,6);
   v_rvi_pendiente decimal(18,6);
   v_rvi_pendientefac decimal(18,6);
   v_rvi_descrip varchar(255);
   v_rvi_precio decimal(18,6);
   v_rvi_precioUsr decimal(18,6);
   v_rvi_precioLista decimal(18,6);
   v_rvi_descuento varchar(100);
   v_rvi_neto decimal(18,6);
   v_rvi_ivari decimal(18,6);
   v_rvi_ivarni decimal(18,6);
   v_rvi_ivariporc decimal(18,6);
   v_rvi_ivarniporc decimal(18,6);
   v_rvi_importe decimal(18,6);
   v_pr_id integer;
   v_ccos_id integer;
   v_rv_id integer;
   v_rvfv_id integer;
   v_fvi_id integer;
   v_pvi_id integer;
   v_pvfv_cantidad decimal(18,6);
   v_fvi_cantidad decimal(18,6);
   v_fvi_orden integer;
   v_rvi_id integer;
   v_pvrv_id integer;
begin

   select sp_dbGetNewId('RemitoVentaTMP', 'rvTMP_id') into v_rvTMP_id;

   insert into RemitoVentaTMP
        ( rvTMP_id, rv_id, rv_numero, rv_nrodoc, rv_descrip, rv_fecha, rv_fechaentrega, rv_neto, rv_ivari, rv_ivarni,
          rv_subtotal, rv_total, rv_descuento1, rv_descuento2, rv_importedesc1, rv_importedesc2, rv_cotizacion, est_id,
          suc_id, cli_id, doc_id, lp_id, ld_id, lgj_id, cpg_id, ccos_id, ven_id, st_id, depl_id, depl_id_temp,
          pro_id_origen, pro_id_destino, trans_id, clis_id, creado, modificado, modifico )
        ( select v_rvTMP_id,
                 0,
                 0,
                 p_rv_nrodoc,
                 fv.fv_descrip,
                 fv.fv_fecha,
                 fv.fv_fechaentrega,
                 fv.fv_neto,
                 fv.fv_ivari,
                 fv.fv_ivarni,
                 fv.fv_subtotal,
                 fv.fv_total - fv.fv_totalpercepciones,
                 fv.fv_descuento1,
                 fv.fv_descuento2,
                 fv.fv_importedesc1,
                 fv.fv_importedesc2,
                 fv.fv_cotizacion,
                 fv.est_id,
                 fv.suc_id,
                 fv.cli_id,
                 doc.doc_id_remito,
                 fv.lp_id,
                 fv.ld_id,
                 fv.lgj_id,
                 fv.cpg_id,
                 fv.ccos_id,
                 fv.ven_id,
                 null,
                 null,
                 null,
                 fv.pro_id_origen,
                 fv.pro_id_destino,
                 fv.trans_id,
                 fv.clis_id,
                 fv.creado,
                 fv.modificado,
                 fv.modifico
          from FacturaVenta fv
          join Documento doc
            on fv.doc_id = doc.doc_id
          where fv.fv_id = p_fv_id );

   for v_rvi_orden,v_rvi_cantidad,v_rvi_cantidadaremitir,v_rvi_pendiente,v_rvi_pendientefac,v_rvi_descrip,v_rvi_precio,
       v_rvi_precioUsr,v_rvi_precioLista,v_rvi_descuento,v_rvi_neto,v_rvi_ivari,v_rvi_ivarni,v_rvi_ivariporc,
       v_rvi_ivarniporc,v_rvi_importe,v_pr_id,v_ccos_id
   in
      select fvi_orden,
             fvi_cantidad,
             fvi_cantidadaremitir,
             fvi_pendiente,
             fvi_pendiente,
             fvi_descrip,
             fvi_precio,
             fvi_precioUsr,
             fvi_precioLista,
             fvi_descuento,
             fvi_neto,
             fvi_ivari,
             fvi_ivarni,
             fvi_ivariporc,
             fvi_ivarniporc,
             fvi_importe,
             pr_id,
             ccos_id
      from FacturaVentaItem
      where fv_id = p_fv_id
      order by fvi_orden
   loop

      select sp_dbGetNewId('RemitoVentaItemTMP', 'rviTMP_id') into v_rviTMP_id;

      insert into RemitoVentaItemTMP
         ( rvTMP_id, rviTMP_id, rvi_id, rvi_orden, rvi_cantidad, rvi_cantidadaremitir, rvi_pendiente, rvi_pendientefac,
           rvi_descrip, rvi_precio, rvi_precioUsr, rvi_precioLista, rvi_descuento, rvi_neto, rvi_ivari, rvi_ivarni,
           rvi_ivariporc, rvi_ivarniporc, rvi_importe, rvi_importCodigo, pr_id, ccos_id )
      values ( v_rvTMP_id, v_rviTMP_id, 0, v_rvi_orden, v_rvi_cantidad, v_rvi_cantidadaremitir, v_rvi_pendiente,
               v_rvi_pendientefac, v_rvi_descrip, v_rvi_precio, v_rvi_precioUsr, v_rvi_precioLista, v_rvi_descuento,
               v_rvi_neto, v_rvi_ivari, v_rvi_ivarni, v_rvi_ivariporc, v_rvi_ivarniporc, v_rvi_importe, '', v_pr_id,
               v_ccos_id );

   end loop;

   perform sp_doc_remito_venta_save(v_rvTMP_id, v_rv_id);

   -- si existe una aplicacion entre la factura y pedidos de venta
   -- traspaso dicha aplicacion al remito que acabo de generar
   --
   if exists ( select *
               from FacturaVentaItem fvi
               join PedidoFacturaVenta pvfv
                 on fvi.fv_id = p_fv_id and fvi.fvi_id = pvfv.fvi_id ) then


      for v_pvfv_cantidad,v_pvi_id,v_fvi_orden in
           select pvfv.pvfv_cantidad,
                  pvfv.pvi_id,
                  fvi.fvi_orden
           from FacturaVentaItem fvi
           join PedidoFacturaVenta pvfv
            on fvi.fv_id = p_fv_id
           and fvi.fvi_id = pvfv.fvi_id
      loop

         select sp_dbGetNewId('PedidoRemitoVenta', 'pvrv_id') into v_pvrv_id;

         select rvi_id
           into v_rvi_id
         from RemitoVentaItem
         where rv_id = v_rv_id
           and rvi_orden = v_fvi_orden;

         insert into PedidoRemitoVenta( pvrv_id, pvrv_cantidad, pvi_id, rvi_id )
         values ( v_pvrv_id, v_pvfv_cantidad, v_pvi_id, v_rvi_id );

      end loop;

      delete from PedidoFacturaVenta
      where pvfv_id in ( select pvfv.pvfv_id
                         from FacturaVentaItem fvi
                         join PedidoFacturaVenta pvfv
                           on fvi.fv_id = p_fv_id
                          and fvi.fvi_id = pvfv.fvi_id );

   end if;


   for v_fvi_id,v_fvi_cantidad,v_fvi_orden in
        select fvi_id,
               fvi_cantidad,
               fvi_orden
        from FacturaVentaItem
        where fv_id = p_fv_id
        order by fvi_orden
   loop

      select sp_dbGetNewId('RemitoFacturaVenta', 'rvfv_id') into v_rvfv_id;

      select rvi_id
        into v_rvi_id
      from RemitoVentaItem
      where rv_id = v_rv_id
        and rvi_orden = v_fvi_orden;

      insert into RemitoFacturaVenta( rvfv_id, rvfv_cantidad, rvi_id, fvi_id )
      values ( v_rvfv_id, v_fvi_cantidad, v_rvi_id, v_fvi_id );

   end loop;

   perform sp_doc_remito_vta_set_item_pendiente(p_fv_id);

   -- actualizo la deuda de la Pedido
   --
   perform sp_doc_remito_venta_set_pendiente(v_rv_id);

   perform sp_doc_remito_venta_set_credito(v_rv_id);

   perform sp_doc_remito_venta_set_estado(v_rv_id);

exception
   when others then

      raise exception 'Ha ocurrido un error al grabar la factura de venta. sp_doc_factura_venta_remito_save. %. %.',
                      sqlstate, sqlerrm;

end;
$BODY$
  language plpgsql volatile
  cost 100;
alter function sp_doc_factura_venta_remito_save(integer, varchar)
  owner to postgres;