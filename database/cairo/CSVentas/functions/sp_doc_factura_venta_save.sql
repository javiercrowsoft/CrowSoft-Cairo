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
-- Function: sp_doc_factura_venta_save()

-- drop function sp_doc_factura_venta_save(integer, integer);

create or replace function sp_doc_factura_venta_save
(
  in p_us_id integer,
  in p_fvTMP_id integer
)
  returns setof row_result as
$BODY$
declare
   rtn row_result;
   rtnAnticipo row_result;
   
   v_success integer;
   v_error integer;
   v_error_msg varchar(5000);
   v_cfg_valor varchar(5000);
   
   v_is_new integer;
   
   v_fv_id integer;
   v_fvi_id integer;
   
   v_orden smallint;
   v_doct_id integer;
   v_est_id integer;
   v_cpg_id integer;
   v_doc_mueveStock smallint;
   v_doc_generaremito smallint;
   v_depl_id integer;
   v_mon_id integer;
   v_ta_id integer;
   v_doc_id integer;
   v_cli_id integer;
   v_suc_id integer;
   v_lp_id integer;
   v_ld_id integer;
   v_ccos_id integer;
   v_stl_id integer;
   v_lgj_id integer;
   v_ven_id integer;
   v_pro_id_origen integer;
   v_pro_id_destino integer;
   v_trans_id integer;
   v_clis_id integer;
   v_emp_id integer;

   v_fv_total decimal(18,6);
   v_fv_fecha date;
   v_fv_fechaVto date;
   v_fv_descuento1 decimal(18,6);
   v_fv_descuento2 decimal(18,6);
   v_fv_totalpercepciones decimal(18,6);
   v_fv_nrodoc varchar(50);
   v_rv_nrodoc varchar(50);
   v_fv_numero integer;
   v_fv_descrip varchar(5000);
   v_fv_fechaentrega date;
   v_fv_fechaIva date;
   v_fv_neto decimal(18,6);
   v_fv_ivari decimal(18,6);
   v_fv_ivarni decimal(18,6);
   v_fv_internos decimal(18,6);
   v_fv_subtotal decimal(18,6);
   v_fv_totalorigen decimal(18,6);
   v_fv_cotizacion decimal(18,6);
   v_fv_importedesc1 decimal(18,6);
   v_fv_importedesc2 decimal(18,6);
   v_fv_grabarasiento smallint;
   v_fv_cai varchar(100);
   v_fv_ordencompra varchar(255);

   v_creado date;
   v_modificado date;
   v_modifico integer;

   v_fviTMP_id integer;
   v_fvi_orden smallint;
   v_fvi_cantidad decimal(18,6);
   v_fvi_cantidadaremitir decimal(18,6);
   v_fvi_pendiente decimal(18,6);
   v_fvi_pendientepklst decimal(18,6);
   v_fvi_descrip varchar(5000);
   v_fvi_precio decimal(18,6);
   v_fvi_precioUsr decimal(18,6);
   v_fvi_precioLista decimal(18,6);
   v_fvi_descuento varchar(100);
   v_fvi_neto decimal(18,6);
   v_fvi_ivari decimal(18,6);
   v_fvi_ivarni decimal(18,6);
   v_fvi_ivariporc decimal(18,6);
   v_fvi_ivarniporc decimal(18,6);
   v_fvi_internos decimal(18,6);
   v_fvi_internosporc decimal(18,6);
   v_fvi_importe decimal(18,6);
   v_fvi_importeorigen decimal(18,6);
   v_fvi_nostock smallint;

   v_pr_id integer;
   v_to_id integer;

   v_cue_id integer;
   v_cue_id_ivari integer;
   v_cue_id_ivarni integer;

   v_fvperc_id integer;
   v_fvperc_orden smallint;
   v_fvperc_base decimal(18,6);
   v_fvperc_porcentaje decimal(18,6);
   v_fvperc_importe decimal(18,6);
   v_fvperc_origen decimal(18,6);
   v_fvperc_descrip varchar(255);

   v_perc_id integer;

   v_fv_totaldeuda decimal(18,6);
   
   v_cj_id integer;
   v_mcj_id integer;

   v_cfg_clave varchar(255);

   v_ta_propuesto smallint;
   v_ta_tipo smallint;
   v_ta_nrodoc varchar(100);
   dummyChar varchar(255) := '';

   v_cobz_nrodoc varchar(50);
   v_cobz_fecha date;
   v_cobz_pendiente decimal(18,2);
   v_pendiente varchar(8000);

begin

   -- si no existe chau
   --
   if not exists ( select fvTMP_id
                   from FacturaVentaTMP
                   where fvTMP_id = p_fvTMP_id ) then
      return query select * from result_failed();
      return;

   end if;

   perform sp_doc_factura_venta_save_pre_cliente(p_fvTMP_id);

   select sp_cfg_getValor('Ventas-General', 'Exigir Centro Costo') into v_cfg_valor;

   v_cfg_valor := coalesce(v_cfg_valor, '0');

   if to_number(v_cfg_valor) <> 0 then

      if exists ( select ccos_id
                  from FacturaVentaTMP
                  where ccos_id is null
                    and fvTMP_id = p_fvTMP_id ) then

         if exists ( select ccos_id
                     from FacturaVentaItemTMP
                     where ccos_id is null
                       and fvTMP_id = p_fvTMP_id ) then

            raise exception '@@ERROR_SP: %',
                'Debe indicar un centro de costo en cada item o un centro de costo en la cabecera del documento.';

         end if;

         if exists ( select ccos_id
                     from FacturaVentaPercepcionTMP
                     where ccos_id is null
                       and fvTMP_id = p_fvTMP_id ) then

            raise exception '@@ERROR_SP: %',
                'Debe indicar un centro de costo en cada item de percepciones o un centro de costo en la cabecera del documento.';

         end if;

      end if;

   end if;

   v_error_msg := '';

   select fv_id
   into v_fv_id
   from FacturaVentaTMP
   where fvTMP_id = p_fvTMP_id;

   v_fv_id := coalesce(v_fv_id, 0);

   select mon_id,
          case cli_catfiscal
              when 1 then ta_id_inscripto     --'Inscripto'
              when 2 then ta_id_final         --'Exento'
              when 3 then ta_id_inscripto     --'No inscripto'
              when 4 then ta_id_final         --'Consumidor Final'
              when 5 then ta_id_externo       --'Extranjero'
              when 6 then ta_id_final         --'Mono Tributo'
              when 7 then ta_id_externo       --'Extranjero Iva'
              when 8 then ta_id_final         --'No responsable'
              when 9 then ta_id_final         --'No Responsable exento'
              when 10 then ta_id_final        --'No categorizado'
              when 11 then ta_id_inscripto    --'Inscripto M'
              else -1                         --'Sin categorizar'
          end,
          Documento.doct_id,
          FacturaVentaTMP.cpg_id,
          FacturaVentaTMP.fv_total,
          FacturaVentaTMP.fv_fecha,
          FacturaVentaTMP.fv_fechaVto,
          FacturaVentaTMP.depl_id,
          Documento.doc_muevestock,
          Documento.doc_generaremito,
          FacturaVentaTMP.rv_nrodoc,
          FacturaVentaTMP.fv_descuento1,
          FacturaVentaTMP.fv_descuento2,
          FacturaVentaTMP.fv_totalpercepciones,
          FacturaVentaTMP.est_id,
          Documento.emp_id,
          fv_nrodoc,
          FacturaVentaTMP.doc_id,
          FacturaVentaTMP.cli_id
     into v_mon_id,
          v_ta_id,
          v_doct_id,
          v_cpg_id,
          v_fv_total,
          v_fv_fecha,
          v_fv_fechaVto,
          v_depl_id,
          v_doc_mueveStock,
          v_doc_generaremito,
          v_rv_nrodoc,
          v_fv_descuento1,
          v_fv_descuento2,
          v_fv_totalpercepciones,
          v_est_id,
          v_emp_id,
          v_fv_nrodoc,
          v_doc_id,
          v_cli_id
   from FacturaVentaTMP
   join Documento
     on FacturaVentaTMP.doc_id = Documento.doc_id
   join Cliente
     on FacturaVentaTMP.cli_id = Cliente.cli_id
   where fvTMP_id = p_fvTMP_id;

   if v_ta_id = -1 then
      return query select * from result_error('El cliente no esta categorizado. Debe indicar en que categoria fiscal se encuentra el cliente.')
      return;
   end if;

   set TRANSACTION READ WRITE;

/*
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
//                                        insert                                                                      //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
*/
   if v_fv_id = 0 then

      v_is_new := -1;

      select sp_dbGetNewId('FacturaVenta', 'fv_id') into v_fv_id;
      select sp_dbGetNewId('FacturaVenta', 'fv_numero') into v_fv_numero;

      select * from sp_talonario_get_propuesto(v_doc_id, v_cli_id, 0) into dummyChar, v_ta_propuesto, v_ta_id, v_ta_tipo;

      if v_ta_propuesto = 0 then
         if v_ta_tipo = 3 then /*Auto Impresor*/

            select sp_talonario_get_next_number(v_ta_id) into v_ta_nrodoc;

            -- con esto evitamos que dos tomen el mismo numero
            --
            perform sp_talonario_set(v_ta_id, v_ta_nrodoc);

            v_fv_nrodoc := v_ta_nrodoc;

         end if;
      end if;

      insert into FacturaVenta
           ( fv_id, fv_numero, fv_nrodoc, fv_descrip, fv_fecha, fv_fechaentrega, fv_fechaVto, fv_fechaIva, fv_neto,
             fv_ivari, fv_ivarni, fv_internos, fv_total, fv_totalorigen, fv_subtotal, fv_totalpercepciones,
             fv_descuento1, fv_descuento2, fv_importedesc1, fv_importedesc2, fv_grabarasiento, fv_cotizacion,
             fv_cai, fv_ordencompra, mon_id, est_id, suc_id, cli_id, doc_id, doct_id, lp_id, ld_id, cpg_id, ccos_id,
             lgj_id, ven_id, pro_id_origen, pro_id_destino, trans_id, emp_id, clis_id, modifico )
           ( select v_fv_id,
                    v_fv_numero,
                    v_fv_nrodoc,
                    fv_descrip,
                    fv_fecha,
                    fv_fechaentrega,
                    fv_fechaVto,
                    fv_fechaIva,
                    fv_neto,
                    fv_ivari,
                    fv_ivarni,
                    fv_internos,
                    fv_total,
                    fv_totalorigen,
                    fv_subtotal,
                    fv_totalpercepciones,
                    fv_descuento1,
                    fv_descuento2,
                    fv_importedesc1,
                    fv_importedesc2,
                    fv_grabarasiento,
                    fv_cotizacion,
                    fv_cai,
                    fv_ordencompra,
                    v_mon_id,
                    est_id,
                    suc_id,
                    cli_id,
                    doc_id,
                    v_doct_id,
                    lp_id,
                    ld_id,
                    cpg_id,
                    ccos_id,
                    lgj_id,
                    ven_id,
                    pro_id_origen,
                    pro_id_destino,
                    trans_id,
                    v_emp_id,
                    clis_id,
                    modifico
             from FacturaVentaTMP
             where fvTMP_id = p_fvTMP_id );

      select doc_id,
             fv_nrodoc
        into v_doc_id,
             v_fv_nrodoc
      from FacturaVenta
      where fv_id = v_fv_id;

/*
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
//                                        update                                                                      //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
*/
   else

      v_is_new := 0;

      select fv_id,
             fv_nrodoc,
             fv_descrip,
             fv_fechaentrega,
             fv_neto,
             fv_fechaIva,
             fv_ivari,
             fv_ivarni,
             fv_internos,
             fv_totalorigen,
             fv_cotizacion,
             fv_subtotal,
             fv_importedesc1,
             fv_importedesc2,
             fv_grabarasiento,
             fv_cai,
             fv_ordencompra,
             est_id,
             suc_id,
             cli_id,
             doc_id,
             lp_id,
             ld_id,
             ccos_id,
             lgj_id,
             ven_id,
             pro_id_origen,
             pro_id_destino,
             trans_id,
             clis_id,
             modifico,
             modificado
        into v_fv_id,
             v_fv_nrodoc,
             v_fv_descrip,
             v_fv_fechaentrega,
             v_fv_neto,
             v_fv_fechaIva,
             v_fv_ivari,
             v_fv_ivarni,
             v_fv_internos,
             v_fv_totalorigen,
             v_fv_cotizacion,
             v_fv_subtotal,
             v_fv_importedesc1,
             v_fv_importedesc2,
             v_fv_grabarasiento,
             v_fv_cai,
             v_fv_ordencompra,
             v_est_id,
             v_suc_id,
             v_cli_id,
             v_doc_id,
             v_lp_id,
             v_ld_id,
             v_ccos_id,
             v_lgj_id,
             v_ven_id,
             v_pro_id_origen,
             v_pro_id_destino,
             v_trans_id,
             v_clis_id,
             v_modifico,
             v_modificado
      from FacturaVentaTMP
      where fvTMP_id = p_fvTMP_id;

      update FacturaVenta
            set fv_nrodoc = v_fv_nrodoc,
                fv_descrip = v_fv_descrip,
                fv_fecha = v_fv_fecha,
                fv_fechaentrega = v_fv_fechaentrega,
                fv_fechaVto = v_fv_fechaVto,
                fv_fechaIva = v_fv_fechaIva,
                fv_neto = v_fv_neto,
                fv_ivari = v_fv_ivari,
                fv_ivarni = v_fv_ivarni,
                fv_total = v_fv_total,
                fv_totalorigen = v_fv_totalorigen,
                fv_totalpercepciones = v_fv_totalpercepciones,
                fv_cotizacion = v_fv_cotizacion,
                fv_descuento1 = v_fv_descuento1,
                fv_descuento2 = v_fv_descuento2,
                fv_subtotal = v_fv_subtotal,
                fv_internos = v_fv_internos,
                fv_importedesc1 = v_fv_importedesc1,
                fv_importedesc2 = v_fv_importedesc2,
                fv_grabarasiento = v_fv_grabarasiento,
                fv_cai = v_fv_cai,
                fv_ordencompra = v_fv_ordencompra,
                mon_id = v_mon_id,
                est_id = v_est_id,
                suc_id = v_suc_id,
                cli_id = v_cli_id,
                doc_id = v_doc_id,
                doct_id = v_doct_id,
                lp_id = v_lp_id,
                ld_id = v_ld_id,
                cpg_id = v_cpg_id,
                lgj_id = v_lgj_id,
                ven_id = v_ven_id,
                pro_id_origen = v_pro_id_origen,
                pro_id_destino = v_pro_id_destino,
                ccos_id = v_ccos_id,
                trans_id = v_trans_id,
                clis_id = v_clis_id,
                emp_id = v_emp_id,
                modifico = v_modifico,
                modificado = v_modificado,
                --
                -- firma (cuando se modifica se elimina la firma)
                --
                fv_firmado = 0
      where fv_id = v_fv_id;

   end if;

/*
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
//                                        items                                                                       //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
*/

   v_orden := 1;

   while exists(select 1 from FacturaVentaItemTMP where fvTMP_id = p_fvTMP_id and fvi_orden = v_orden)
   loop

      select fviTMP_id,
             fvi_id,
             fvi_orden,
             fvi_cantidad,
             fvi_cantidadaremitir,
             fvi_pendiente,
             fvi_pendientepklst,
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
             fvi_internos,
             fvi_internosporc,
             fvi_importe,
             fvi_importeorigen,
             pr_id,
             to_id,
             ccos_id,
             stl_id,
             fvi_nostock,
             cue_id,
             cue_id_ivari,
             cue_id_ivarni
        into v_fviTMP_id,
             v_fvi_id,
             v_fvi_orden,
             v_fvi_cantidad,
             v_fvi_cantidadaremitir,
             v_fvi_pendiente,
             v_fvi_pendientepklst,
             v_fvi_descrip,
             v_fvi_precio,
             v_fvi_precioUsr,
             v_fvi_precioLista,
             v_fvi_descuento,
             v_fvi_neto,
             v_fvi_ivari,
             v_fvi_ivarni,
             v_fvi_ivariporc,
             v_fvi_ivarniporc,
             v_fvi_internos,
             v_fvi_internosporc,
             v_fvi_importe,
             v_fvi_importeorigen,
             v_pr_id,
             v_to_id,
             v_ccos_id,
             v_stl_id,
             v_fvi_nostock,
             v_cue_id,
             v_cue_id_ivari,
             v_cue_id_ivarni
      from FacturaVentaItemTMP
      where fvTMP_id = p_fvTMP_id
        and fvi_orden = v_orden;

      -- cuando se inserta se indica
      -- como cantidad a remitir la cantidad (por ahora)
      --
      v_fvi_cantidadaremitir := v_fvi_cantidad;

      if v_is_new <> 0 or v_fvi_id = 0 then

         -- cuando se inserta se toma la cantidad a remitir
         -- como el pendiente
         --
         v_fvi_pendiente := v_fvi_cantidadaremitir;

         v_fvi_pendientepklst := v_fvi_cantidadaremitir;

         select sp_dbGetNewId('FacturaVentaItem', 'fvi_id') into v_fvi_id;

         insert into FacturaVentaItem
           ( fv_id, fvi_id, fvi_orden, fvi_cantidad, fvi_cantidadaremitir, fvi_descrip, fvi_pendiente,
             fvi_pendientepklst, fvi_precio, fvi_precioUsr, fvi_precioLista, fvi_descuento, fvi_neto,
             fvi_ivari, fvi_ivarni, fvi_ivariporc, fvi_ivarniporc, fvi_internos, fvi_internosporc,
             fvi_importe, fvi_importeorigen, fvi_nostock, pr_id, to_id, ccos_id, stl_id, cue_id, cue_id_ivari,
             cue_id_ivarni )

         values ( v_fv_id, v_fvi_id, v_fvi_orden, v_fvi_cantidad, v_fvi_cantidadaremitir, v_fvi_descrip,
                  v_fvi_pendiente, v_fvi_pendientepklst, v_fvi_precio, v_fvi_precioUsr, v_fvi_precioLista,
                  v_fvi_descuento, v_fvi_neto, v_fvi_ivari, v_fvi_ivarni, v_fvi_ivariporc, v_fvi_ivarniporc,
                  v_fvi_internos, v_fvi_internosporc, v_fvi_importe, v_fvi_importeorigen, v_fvi_nostock,
                  v_pr_id, v_to_id, v_ccos_id, v_stl_id, v_cue_id, v_cue_id_ivari, v_cue_id_ivarni );

      else

         -- cuando se actualiza se indica
         -- como pendiente la cantidad a remitir menos lo aplicado
         --
         select sum(pvfv_cantidad)
           into v_fvi_pendiente
         from PedidoFacturaVenta
         where fvi_id = v_fvi_id;

         v_fvi_pendiente := v_fvi_cantidadaremitir - coalesce(v_fvi_pendiente, 0);

         select sum(pklstfv_cantidad)
           into v_fvi_pendientepklst
         from PackingListFacturaVenta
         where fvi_id = v_fvi_id;

         v_fvi_pendientepklst := v_fvi_cantidadaremitir - coalesce(v_fvi_pendientepklst, 0);

         update FacturaVentaItem
            set fv_id = v_fv_id,
                fvi_orden = v_fvi_orden,
                fvi_cantidad = v_fvi_cantidad,
                fvi_cantidadaremitir = v_fvi_cantidadaremitir,
                fvi_pendiente = v_fvi_pendiente,
                fvi_pendientepklst = v_fvi_pendientepklst,
                fvi_descrip = v_fvi_descrip,
                fvi_precio = v_fvi_precio,
                fvi_precioUsr = v_fvi_precioUsr,
                fvi_precioLista = v_fvi_precioLista,
                fvi_descuento = v_fvi_descuento,
                fvi_neto = v_fvi_neto,
                fvi_ivari = v_fvi_ivari,
                fvi_ivarni = v_fvi_ivarni,
                fvi_ivariporc = v_fvi_ivariporc,
                fvi_ivarniporc = v_fvi_ivarniporc,
                fvi_internos = v_fvi_internos,
                fvi_internosporc = v_fvi_internosporc,
                fvi_importe = v_fvi_importe,
                fvi_importeorigen = v_fvi_importeorigen,
                fvi_nostock = v_fvi_nostock,
                pr_id = v_pr_id,
                to_id = v_to_id,-- TO

                ccos_id = v_ccos_id,
                stl_id = v_stl_id,
                cue_id = v_cue_id,
                cue_id_ivari = v_cue_id_ivari,
                cue_id_ivarni = v_cue_id_ivarni
         where fv_id = v_fv_id
           and fvi_id = v_fvi_id;

      end if;

      update FacturaVentaItemSerieTMP
         set fvi_id = v_fvi_id
      where fviTMP_id = v_fviTMP_id;

      v_orden := v_orden + 1;

   end loop;

   v_orden := 1;

   while exists(select 1 from FacturaVentaPercepcionTMP where fvTMP_id = p_fvTMP_id and fvperc_orden = v_orden)
   loop

      select fvperc_id,
             fvperc_orden,
             fvperc_base,
             fvperc_porcentaje,
             fvperc_importe,
             fvperc_origen,
             fvperc_descrip,
             perc_id,
             ccos_id
        into v_fvperc_id,
             v_fvperc_orden,
             v_fvperc_base,
             v_fvperc_porcentaje,
             v_fvperc_importe,
             v_fvperc_origen,
             v_fvperc_descrip,
             v_perc_id,
             v_ccos_id
      from FacturaVentaPercepcionTMP
      where fvTMP_id = p_fvTMP_id
        and fvperc_orden = v_orden;

      if v_is_new <> 0 or v_fvperc_id = 0 then

         select sp_dbGetNewId('FacturaVentaPercepcion', 'fvperc_id') into v_fvperc_id;

         insert into FacturaVentaPercepcion
              ( fv_id, fvperc_id, fvperc_orden, fvperc_base, fvperc_porcentaje, fvperc_importe, fvperc_origen,
                fvperc_descrip, perc_id, ccos_id )
         values ( v_fv_id, v_fvperc_id, v_fvperc_orden, v_fvperc_base, v_fvperc_porcentaje, v_fvperc_importe,
                  v_fvperc_origen, v_fvperc_descrip, v_perc_id, v_ccos_id );

      else

         update FacturaVentaPercepcion
            set fv_id = v_fv_id,
                fvperc_orden = v_fvperc_orden,
                fvperc_base = v_fvperc_base,
                fvperc_porcentaje = v_fvperc_porcentaje,
                fvperc_importe = v_fvperc_importe,
                fvperc_origen = v_fvperc_origen,
                fvperc_descrip = v_fvperc_descrip,
                perc_id = v_perc_id,
                ccos_id = v_ccos_id
         where fv_id = v_fv_id
           and fvperc_id = v_fvperc_id;

      end if;

      v_orden := v_orden + 1;

   end loop;

/*
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
//                                     items borrados                                                                 //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
*/

   if v_is_new = 0 then
         
      delete from FacturaVentaItem
      where exists ( select fvi_id
                     from FacturaVentaItemBorradoTMP
                     where fv_id = v_fv_id
                       and fvTMP_id = p_fvTMP_id
                       and fvi_id = FacturaVentaItem.fvi_id );

      delete from FacturaVentaItemBorradoTMP
      where fv_id = v_fv_id
        and fvTMP_id = p_fvTMP_id;

      delete from FacturaVentaPercepcion
      where exists ( select fvperc_id
                     from FacturaVentaPercepcionBorradoTMP
                     where fv_id = v_fv_id
                       and fvperc_id = FacturaVentaPercepcion.fvperc_id
                       and fvTMP_id = p_fvTMP_id );

      delete from FacturaVentaPercepcionBorradoTMP
      where fv_id = v_fv_id
        and fvTMP_id = p_fvTMP_id;

   end if;

   select sum(fvi.fvi_importe)
     into v_fv_totaldeuda
   from FacturaVentaItem fvi
   join TipoOperacion t
     on fvi.to_id = t.to_id
   where fvi.fv_id = v_fv_id
     and t.to_generadeuda <> 0;

   if v_fv_totaldeuda is null then
      v_fv_totaldeuda := 0;
   else
      v_fv_totaldeuda := v_fv_totaldeuda - ((v_fv_totaldeuda * v_fv_descuento1) / 100);
      v_fv_totaldeuda := v_fv_totaldeuda - ((v_fv_totaldeuda * v_fv_descuento2) / 100);
      v_fv_totaldeuda := v_fv_totaldeuda + v_fv_totalpercepciones;
   end if;

   perform sp_doc_factura_venta_save_deuda(v_fv_id,
                                           v_cpg_id,
                                           v_fv_fecha,
                                           v_fv_fechaVto,
                                           v_fv_totaldeuda,
                                           v_est_id
                                           );

/*
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
//                                        aplicacion pedido - remito                                                  //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
*/

   perform sp_doc_fac_vta_pedido_remito_save_aplic(v_fv_id, p_fvTMP_id, 0);

/*
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
//                                     talonarios                                                                     //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
*/
   perform sp_talonario_set(v_ta_id, v_fv_nrodoc);

   if coalesce(v_doc_generaremito, 0) <> 0 and v_is_new <> 0 then
   
      perform sp_doc_factura_venta_remito_save(v_fv_id, v_rv_nrodoc);

   end if;

/*
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
//                                     credito y estado                                                               //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
*/

   perform sp_doc_factura_venta_set_pendiente(v_fv_id);

   perform sp_doc_factura_venta_set_credito(v_fv_id);

   perform sp_doc_factura_venta_set_estado(v_fv_id);

/*
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
//                                     asiento                                                                        //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
*/

   select sp_cfg_getValor('Ventas-General', 'Grabar Asiento') into v_cfg_valor;

   v_cfg_valor := coalesce(v_cfg_valor, '0');

   if to_number(v_cfg_valor) <> 0 then

      -- no genero asiento para facturas anuladas
      --
      if v_est_id <> 7 then
         
         select * from sp_doc_factura_venta_asiento_save(v_fv_id, 0) into v_error, v_error_msg;
         if coalesce(v_error, 0) <> 0 then
            raise exception '%', v_error_msg;
         end if;

      end if;

   else

      if not exists ( select fv_id
                      from FacturaVentaAsiento
                      where fv_id = v_fv_id ) then

         insert into FacturaVentaAsiento
           ( fv_id, fv_fecha )
           ( select fv_id,
                    fv_fecha
             from FacturaVenta
             where fv_grabarAsiento <> 0
               and fv_id = v_fv_id );

      end if;

   end if;

/*
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
//                                     stock                                                                          //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
*/

   if coalesce(v_doc_mueveStock, 0) <> 0 then

      select * from sp_doc_factura_venta_stock_save(p_fvTMP_id, v_fv_id, v_depl_id, 0) into v_error, v_error_msg;
      if coalesce(v_error, 0) <> 0 then
         raise exception '%', v_error_msg;
      end if;

   end if;

/*
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
//                          total comercial - necesario para los reportes de cta cte                                  //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
*/

   update facturaventa set fv_totalcomercial = coalesce(v_fv_totaldeuda, 0) where fv_id = v_fv_id;

   select cj_id into v_cj_id from FacturaVentaTMP where fvTMP_id = p_fvTMP_id;

   select sp_movimiento_caja_get_from_caja(v_cj_id, 1 /* apertura */) into v_mcj_id;

   update FacturaVenta set mcj_id = v_mcj_id where fv_id = v_fv_id;

/*
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
//                                     validaciones al documento                                                      //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
*/
   -- estado
   --
   select * from sp_auditoria_estado_check_doc_fv(v_fv_id) into v_success, v_error_msg;
   if coalesce(v_success, 0) = 0 then
      raise exception '%', v_error_msg;
   end if;

   -- stock
   --
   select * from sp_auditoria_stock_check_doc_fv(v_fv_id) into v_success, v_error_msg;
   if coalesce(v_success, 0) = 0 then
      raise exception '%', v_error_msg;
   end if;

   -- totales
   --
   select * from sp_auditoria_totales_check_doc_fv(v_fv_id) into v_success, v_error_msg;
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
//                                 cursos (debe hacerse antes de eliminar los items borrados)                         //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
*/

   select * from sp_doc_factura_venta_save_curso(v_fv_id, p_fvTMP_id) into v_success, v_error_msg;
   if coalesce(v_success, 0) = 0 then
      raise exception '%', v_error_msg;
   end if;

/*
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
//                                 particularidades de los clientes                                                   //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
*/
   select * from sp_doc_factura_venta_save_cliente(v_fv_id, p_fvTMP_id) into v_success, v_error_msg;
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

   delete from HoraFacturaVentaTMP where fvTMP_ID = p_fvTMP_id;
   delete from PackingListFacturaVentaTMP where fvTMP_ID = p_fvTMP_id;
   delete from RemitoFacturaVentaTMP where fvTMP_ID = p_fvTMP_id;
   delete from PedidoFacturaVentaTMP where fvTMP_ID = p_fvTMP_id;
   delete from FacturaVentaItemSerieTMP where fvTMP_id = p_fvTMP_id;
   delete from FacturaVentaItemTMP where fvTMP_id = p_fvTMP_id;
   delete from FacturaVentaTMP where fvTMP_id = p_fvTMP_id;

/*
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
//                                     historial de modificaciones                                                    //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
*/
   select modifico into v_modifico from FacturaVenta where fv_id = v_fv_id;

   if v_is_new <> 0 then
      perform sp_historia_update(16001, v_fv_id, v_modifico, 1);
   else
      perform sp_historia_update(16001, v_fv_id, v_modifico, 3);
   end if;

/*
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
//                                     fin                                                                            //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
*/

   v_cfg_clave := 'Informar Anticipos Vta_' || trim(to_char(v_modifico));

   select sp_cfg_getValor('Usuario-Config', v_cfg_clave) into v_cfg_valor;

   v_cfg_valor := coalesce(v_cfg_valor, '0');

   if to_number(v_cfg_valor) <> 0 then

      if exists ( select *
                  from Cobranza
                  where round(cobz_pendiente, 2) > 0.02
                    and emp_id = v_emp_id
                    and cli_id = v_cli_id ) then

         v_pendiente := '';

         for v_cobz_nrodoc,v_cobz_fecha,v_cobz_pendiente in
              select cobz_nrodoc,
                     cobz_fecha,
                     cobz_pendiente
              from Cobranza
              where round(cobz_pendiente, 2) > 0
                and emp_id = v_emp_id
                and cli_id = v_cli_id
         loop
         
            v_pendiente := v_pendiente || v_cobz_nrodoc || ' del '
                           || to_char(v_cobz_fecha, 'dd-mm-yyyy')
                           || ' por pesos '
                           || to_char(v_cobz_pendiente, '9,999,999,990.00')
                           || ';';
               
         end loop;

         rtnAnticipo.type := 'resultset';
         open rtnAnticipo.r for select 'INFO', 'Este cliente tiene anticipo/s en la cobranza/s:;;' || v_pendiente;
         return next rtnAnticipo;

      end if;

   end if;

   rtn.type := 'fv_id';
   rtn.id := v_fv_id;

   return next rtn;

exception
   when others then

     raise exception 'Ha ocurrido un error al grabar la factura de venta. sp_doc_factura_venta_save. %. %.',
                      sqlstate, sqlerrm;

end;
$BODY$
  language plpgsql volatile
  cost 100;
alter function sp_doc_factura_venta_save(integer, integer)
  owner to postgres;