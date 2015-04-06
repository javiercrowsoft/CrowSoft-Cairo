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
-- Function: sp_doc_factura_compra_save()

-- drop function sp_doc_factura_compra_save(integer, integer);

create or replace
function sp_doc_factura_compra_save
(
  in p_us_id integer,
  in p_fcTMP_id integer
)
  returns setof row_result as
$BODY$
as

   rtn row_result;

   v_success smallint;
   v_error smallint;
   v_error_msg varchar(5000);   
   v_cfg_valor varchar(5000);
   
   v_is_new smallint;
   
   v_fc_id integer;
   v_fci_id integer;
   
   v_orden smallint;
   v_doct_id integer;
   v_cpg_id integer;
   v_doc_mueveStock smallint;
   v_depl_id integer;
   v_mon_id integer;
   v_ta_id integer;
   v_doc_id integer;
   v_prov_id integer;
   v_est_id integer;
   v_suc_id integer;
   v_lp_id integer;
   v_ld_id integer;
   v_ccos_id integer;
   v_lgj_id integer;
   v_pro_id_origen integer;
   v_pro_id_destino integer;
   
   v_fc_total decimal(18,6);
   v_fc_fecha date;
   v_fc_fechaVto date;
   v_fc_fechaiva date;
   v_fc_descuento1 decimal(18,6);
   v_fc_descuento2 decimal(18,6);
   v_fc_totalotros decimal(18,6);
   v_fc_totalpercepciones decimal(18,6);
   v_fc_nrodoc varchar(50);
   v_fc_numero integer;
   v_fc_descrip varchar(5000);
   v_fc_fechaentrega date;
   v_fc_neto decimal(18,6);
   v_fc_ivari decimal(18,6);
   v_fc_ivarni decimal(18,6);
   v_fc_internos decimal(18,6);
   v_fc_subtotal decimal(18,6);
   v_fc_totalorigen decimal(18,6);
   v_fc_cotizacion decimal(18,6);
   v_fc_cotizacionProv decimal(18,6);
   v_fc_pendiente decimal(18,6);
   v_fc_importedesc1 decimal(18,6);
   v_fc_importedesc2 decimal(18,6);
   v_fc_grabarasiento smallint;
   v_fc_cai varchar(100);
   v_fc_tipoComprobante smallint;

   v_creado date;
   v_modificado date;
   v_modifico integer;

   v_fciTMP_id integer;
   v_fci_orden smallint;
   v_fci_cantidad decimal(18,6);
   v_fci_cantidadaremitir decimal(18,6);
   v_fci_pendiente decimal(18,6);
   v_fci_descrip varchar(5000);
   v_fci_precio decimal(18,6);
   v_fci_precioUsr decimal(18,6);
   v_fci_precioLista decimal(18,6);
   v_fci_descuento varchar(100);
   v_fci_neto decimal(18,6);
   v_fci_ivari decimal(18,6);
   v_fci_ivarni decimal(18,6);
   v_fci_ivariporc decimal(18,6);
   v_fci_ivarniporc decimal(18,6);
   v_fci_internos decimal(18,6);
   v_fci_internosporc decimal(18,6);
   v_fci_importe decimal(18,6);
   v_fci_importeorigen decimal(18,6);

   v_pr_id integer;
   v_stl_id integer;
   v_to_id integer;

   v_cue_id integer;
   v_cue_id_ivari integer;
   v_cue_id_ivarni integer;

   v_opg_id integer;

   v_fcot_id integer;
   v_fcot_orden smallint;
   v_fcot_debe decimal(18,6);
   v_fcot_haber decimal(18,6);
   v_fcot_origen decimal(18,6);
   v_fcot_descrip varchar(255);

   v_fcperc_id integer;
   v_fcperc_orden smallint;
   v_fcperc_base decimal(18,6);
   v_fcperc_porcentaje decimal(18,6);
   v_fcperc_importe decimal(18,6);
   v_fcperc_origen decimal(18,6);
   v_fcperc_descrip varchar(255);

   v_perc_id integer;

   v_fclgj_id integer;
   v_fclgj_orden smallint;
   v_fclgj_importe decimal(18,6);
   v_fclgj_importeorigen decimal(18,6);
   v_fclgj_descrip varchar(255);
   v_fc_totaldeuda decimal(18,6);

   v_ta_propuesto smallint;
   v_ta_tipo smallint;
   v_ta_nrodoc varchar(100);

   v_emp_id integer;
begin

  p_success := 0;

  -- si no existe chau
  --
  if not exists ( select fcTMP_id
                  from FacturaCompraTMP
                  where fcTMP_id = p_fcTMP_id ) then

     return query select * from result_failed;
     return;

  end if;

  select sp_cfg_getValor('Compras-General', 'Exigir Centro Costo') into v_cfg_valor;

  v_cfg_valor := coalesce(v_cfg_valor, 0);

  if to_number(v_cfg_valor) <> 0 then

     if exists ( select ccos_id
                 from FacturaCompraTMP
                 where ccos_id is null
                  and fcTMP_id = p_fcTMP_id ) then


        if exists ( select ccos_id
                    from FacturaCompraItemTMP
                    where ccos_id is null
                      and fcTMP_id = p_fcTMP_id ) then

           raise exception '@@ERROR_SP: %',
              'Debe indicar un centro de costo en cada item o un centro de costo en la cabecera del documento.';

        end if;

        if exists ( select ccos_id
                    from FacturaCompraOtroTMP
                    where ccos_id is null
                      and fcTMP_id = p_fcTMP_id ) then

           raise exception '@@ERROR_SP: %',
              'Debe indicar un centro de costo en cada item de la solapa "Otros" o un centro de costo en la cabecera del documento.';

        end if;

        if exists ( select ccos_id
                    from FacturaCompraPercepcionTMP
                    where ccos_id is null
                      and fcTMP_id = p_fcTMP_id ) then

           raise exception '@@ERROR_SP: %'
              'Debe indicar un centro de costo en cada item de percepciones o un centro de costo en la cabecera del documento.';

        end if;

     end if;

  end if;

  v_error_msg := '';

  select sp_doc_fac_cpra_validate_deposito(p_fcTMP_id) into v_success, v_error_msg;
  if coalesce(v_success, 0) = 0 then
     raise exception '%', v_error_msg;
  end if;

  select fc_id
    into v_fc_id
  from FacturaCompraTMP
  where fcTMP_id = p_fcTMP_id;

  v_fc_id := coalesce(v_fc_id, 0);

  select mon_id,
         case prov_catfiscal
             when 1  then ta_id_inscripto    --'Inscripto'
             when 2  then ta_id_final        --'Exento'
             when 3  then ta_id_final        --'No inscripto'
             when 4  then ta_id_final        --'Consumidor Final'
             when 5  then ta_id_externo      --'Extranjero'
             when 6  then ta_id_final        --'Mono Tributo'
             when 7  then ta_id_externo      --'Extranjero Iva'
             when 8  then ta_id_final        --'No responsable'
             when 9  then ta_id_final        --'No Responsable exento'
             when 10 then ta_id_final        --'No categorizado'
             when 11 then ta_id_inscriptoM   --'Inscripto M'
             else -1                         --'Sin categorizar'
         end,
         Documento.doct_id,
         FacturaCompraTMP.cpg_id,
         FacturaCompraTMP.fc_total,
         FacturaCompraTMP.fc_fecha,
         FacturaCompraTMP.fc_fechaVto,
         FacturaCompraTMP.fc_fechaIva,
         FacturaCompraTMP.depl_id,
         Documento.doc_muevestock,
         FacturaCompraTMP.fc_descuento1,
         FacturaCompraTMP.fc_descuento2,
         fc_totalotros,
         fc_totalpercepciones,
         fc_nrodoc,
         FacturaCompraTMP.doc_id,
         FacturaCompraTMP.prov_id,
         FacturaCompraTMP.est_id
         into    v_mon_id,
                 v_ta_id,
                 v_doct_id,
                 v_cpg_id,
                 v_fc_total,
                 v_fc_fecha,
                 v_fc_fechaVto,
                 v_fc_fechaiva,
                 v_depl_id,
                 v_doc_mueveStock,
                 v_fc_descuento1,
                 v_fc_descuento2,
                 v_fc_totalotros,
                 v_fc_totalpercepciones,
                 v_fc_nrodoc,
                 v_doc_id,
                 v_prov_id,
                 v_est_id

  from FacturaCompraTMP
  join Documento
    on FacturaCompraTMP.doc_id = Documento.doc_id
  join Proveedor
    on FacturaCompraTMP.prov_id = Proveedor.prov_id
  where fcTMP_id = p_fcTMP_id;

  if v_ta_id = -1 then
     return query result_error('El proveedor no esta categorizado. Debe indicar en que categoria fiscal se encuentra el proveedor.')
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
  if v_fc_id = 0 then

     v_is_new := -1;

     select sp_dbGetNewId('FacturaCompra', 'fc_id') into v_fc_id;
     select sp_dbGetNewId('FacturaCompra', 'fc_numero') into v_fc_numero;
     select sp_talonario_get_propuesto(v_doc_id, 0, v_prov_id) into dummyChar, v_ta_propuesto, v_ta_id, v_ta_tipo;

     if v_ta_propuesto = 0 then
        if v_ta_tipo = 3 then /*Auto Impresor*/

           select sp_talonario_get_next_number(v_ta_id) into v_ta_nrodoc;

           -- con esto evitamos que dos tomen el mismo Numero
           --
           perform sp_talonario_set(v_ta_id, v_ta_nrodoc);

           v_fc_nrodoc := v_ta_nrodoc;

        end if;
     end if;

     insert into FacturaCompra
       ( fc_id, fc_numero, fc_nrodoc, fc_descrip, fc_fecha, fc_fechaentrega, fc_fechaVto, fc_fechaiva, fc_neto,
         fc_ivari, fc_ivarni, fc_internos, fc_total, fc_totalorigen, fc_subtotal, fc_totalotros,
         fc_totalpercepciones, fc_descuento1, fc_descuento2, fc_importedesc1, fc_importedesc2, fc_grabarasiento,
         fc_cotizacion, fc_cotizacionprov, fc_cai, fc_tipocomprobante, mon_id, est_id, suc_id, prov_id, doc_id,
         doct_id, lp_id, ld_id, cpg_id, ccos_id, lgj_id, pro_id_origen, pro_id_destino, modifico )
       ( select v_fc_id,
                v_fc_numero,
                v_fc_nrodoc,
                fc_descrip,
                fc_fecha,
                fc_fechaentrega,
                fc_fechaVto,
                fc_fechaiva,
                fc_neto,
                fc_ivari,
                fc_ivarni,
                fc_internos,
                fc_total,
                fc_totalorigen,
                fc_subtotal,
                fc_totalotros,
                fc_totalpercepciones,
                fc_descuento1,
                fc_descuento2,
                fc_importedesc1,
                fc_importedesc2,
                fc_grabarasiento,
                fc_cotizacion,
                fc_cotizacionProv,
                fc_cai,
                fc_tipocomprobante,
                v_mon_id,
                est_id,
                suc_id,
                prov_id,
                doc_id,
                v_doct_id,
                lp_id,
                ld_id,
                cpg_id,
                ccos_id,
                lgj_id,
                pro_id_origen,
                pro_id_destino,
                modifico
         from FacturaCompraTMP
         where fcTMP_id = p_fcTMP_id );

     select doc_id,
            fc_nrodoc
       into v_doc_id,
            v_fc_nrodoc
     from FacturaCompra
     where fc_id = v_fc_id;
/*
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
//                                        update                                                                      //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
*/
  else

     v_is_new := 0;

     select fc_id,
            fc_nrodoc,
            fc_descrip,
            fc_fechaentrega,
            fc_neto,
            fc_ivari,
            fc_ivarni,
            fc_internos,
            fc_totalorigen,
            fc_cotizacion,
            fc_cotizacionProv,
            fc_descuento1,
            fc_descuento2,
            fc_subtotal,
            fc_importedesc1,
            fc_importedesc2,
            fc_grabarasiento,
            fc_cai,
            fc_tipocomprobante,
            est_id,
            suc_id,
            prov_id,
            doc_id,
            lp_id,
            ld_id,
            ccos_id,
            lgj_id,
            pro_id_origen,
            pro_id_destino,
            modifico,
            modificado
       into v_fc_id,
            v_fc_nrodoc,
            v_fc_descrip,
            v_fc_fechaentrega,
            v_fc_neto,
            v_fc_ivari,
            v_fc_ivarni,
            v_fc_internos,
            v_fc_totalorigen,
            v_fc_cotizacion,
            v_fc_cotizacionProv,
            v_fc_descuento1,
            v_fc_descuento2,
            v_fc_subtotal,
            v_fc_importedesc1,
            v_fc_importedesc2,
            v_fc_grabarasiento,
            v_fc_cai,
            v_fc_tipocomprobante,
            v_est_id,
            v_suc_id,
            v_prov_id,
            v_doc_id,
            v_lp_id,
            v_ld_id,
            v_ccos_id,
            v_lgj_id,
            v_pro_id_origen,
            v_pro_id_destino,
            v_modifico,
            v_modificado
     from FacturaCompraTMP
     where fcTMP_id = p_fcTMP_id;

/*
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
//                          generacion automatica de orden de pago                                                    //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
*/
     /*
           si la condicion de pago de la factura es de tipo [Debito Automatico] o [Fondo Fijo]
           debo generar una orden de pago automaticamente.

           para esto tengo que sacar de la condicion de pago el documento y la cuenta contable
           de los fondos pasando por la cuenta grupo asociada a dicha condicion de pago.
     */

     -- tengo que desaplicar la orden de pago para poder regenerar la deuda
     --
     select opg_id
       into v_opg_id
     from FacturaCompra
     where fc_id = v_fc_id;

     if v_opg_id is not null then

        delete from FacturaCompraOrdenPago where fc_id = v_fc_id;

        update FacturaCompra set opg_id = null where fc_id = v_fc_id;

        update OrdenPago set fc_id = null where fc_id = v_fc_id;

        select emp_id into v_emp_id from OrdenPago where opg_id = v_opg_id;

        perform sp_doc_orden_pago_delete(v_opg_id, v_emp_id, v_modifico);

        delete from FacturaCompraDeuda where fc_id = v_fc_id;

        delete from FacturaCompraPago where fc_id = v_fc_id;

     end if;

     update FacturaCompra
        set fc_nrodoc = v_fc_nrodoc,
            fc_descrip = v_fc_descrip,
            fc_fecha = v_fc_fecha,
            fc_fechaentrega = v_fc_fechaentrega,
            fc_fechaVto = v_fc_fechaVto,
            fc_fechaiva = v_fc_fechaiva,
            fc_neto = v_fc_neto,
            fc_ivari = v_fc_ivari,
            fc_ivarni = v_fc_ivarni,
            fc_internos = v_fc_internos,
            fc_total = v_fc_total,
            fc_totalorigen = v_fc_totalorigen,
            fc_totalotros = v_fc_totalotros,
            fc_totalpercepciones = v_fc_totalpercepciones,
            fc_cotizacion = v_fc_cotizacion,
            fc_cotizacionprov = v_fc_cotizacionprov,
            fc_descuento1 = v_fc_descuento1,
            fc_descuento2 = v_fc_descuento2,
            fc_subtotal = v_fc_subtotal,
            fc_importedesc1 = v_fc_importedesc1,
            fc_importedesc2 = v_fc_importedesc2,
            fc_grabarasiento = v_fc_grabarasiento,
            fc_cai = v_fc_cai,
            fc_tipocomprobante = v_fc_tipocomprobante,
            mon_id = v_mon_id,
            est_id = v_est_id,
            suc_id = v_suc_id,
            prov_id = v_prov_id,
            doc_id = v_doc_id,
            doct_id = v_doct_id,
            lp_id = v_lp_id,
            ld_id = v_ld_id,
            cpg_id = v_cpg_id,
            lgj_id = v_lgj_id,
            pro_id_origen = v_pro_id_origen,
            pro_id_destino = v_pro_id_destino,
            ccos_id = v_ccos_id,
            modifico = v_modifico,
            modificado = v_modificado
     where fc_id = v_fc_id;

  end if;

/*
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
//                                        ITEMS                                                                       //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
*/

  v_orden := 1;

  while exists(select 1 from FacturaCompraItemTMP where fcTMP_id = p_fcTMP_id and fci_orden = v_orden)
  loop

     select fciTMP_id,
            fci_id,
            fci_orden,
            fci_cantidad,
            fci_cantidadaremitir,
            fci_pendiente,
            fci_descrip,
            fci_precio,
            fci_precioUsr,
            fci_precioLista,
            fci_descuento,
            fci_neto,
            fci_ivari,
            fci_ivarni,
            fci_ivariporc,
            fci_ivarniporc,
            fci_internos,
            fci_internosporc,
            fci_importe,
            fci_importeorigen,
            pr_id,
            to_id,
            ccos_id,
            cue_id,
            cue_id_ivari,
            cue_id_ivarni,
            stl_id
       into v_fciTMP_id,
            v_fci_id,
            v_fci_orden,
            v_fci_cantidad,
            v_fci_cantidadaremitir,
            v_fci_pendiente,
            v_fci_descrip,
            v_fci_precio,
            v_fci_precioUsr,
            v_fci_precioLista,
            v_fci_descuento,
            v_fci_neto,
            v_fci_ivari,
            v_fci_ivarni,
            v_fci_ivariporc,
            v_fci_ivarniporc,
            v_fci_internos,
            v_fci_internosporc,
            v_fci_importe,
            v_fci_importeorigen,
            v_pr_id,
            v_to_id,
            v_ccos_id,
            v_cue_id,
            v_cue_id_ivari,
            v_cue_id_ivarni,
            v_stl_id
     from FacturaCompraItemTMP
     where fcTMP_id = p_fcTMP_id
       and fci_orden = v_orden;

     -- cuando se inserta se indica
     -- como cantidad a remitir la cantidad (por ahora)
     --
     v_fci_cantidadaremitir := v_fci_cantidad;

     if v_is_new <> 0 or v_fci_id = 0 then

        -- cuando se inserta se toma la cantidad a remitir
        -- como el pendiente
        --
        v_fci_pendiente := v_fci_cantidadaremitir;

        select sp_dbGetNewId('FacturaCompraItem', 'fci_id') into v_fci_id;

        insert into FacturaCompraItem
          ( fc_id, fci_id, fci_orden, fci_cantidad, fci_cantidadaremitir, fci_descrip, fci_pendiente,
            fci_precio, fci_precioUsr, fci_precioLista, fci_descuento, fci_neto, fci_ivari, fci_ivarni,
            fci_ivariporc, fci_ivarniporc, fci_internos, fci_internosporc, fci_importe, fci_importeorigen,
            pr_id, to_id, ccos_id, cue_id, cue_id_ivari, cue_id_ivarni, stl_id )

        values ( v_fc_id, v_fci_id, v_fci_orden, v_fci_cantidad, v_fci_cantidadaremitir, v_fci_descrip,
                 v_fci_pendiente, v_fci_precio, v_fci_precioUsr, v_fci_precioLista, v_fci_descuento,
                 v_fci_neto, v_fci_ivari, v_fci_ivarni, v_fci_ivariporc, v_fci_ivarniporc, v_fci_internos,
                 v_fci_internosporc, v_fci_importe, v_fci_importeorigen, v_pr_id, v_to_id, v_ccos_id,
                 v_cue_id, v_cue_id_ivari, v_cue_id_ivarni, v_stl_id );

        update FacturaCompraItemTMP
           set fci_id = v_fci_id
        where fcTMP_id = p_fcTMP_id
          and fciTMP_id = v_fciTMP_id
          and fci_orden = v_orden;

        update FacturaCompraItemSerieTMP
           set fci_id = v_fci_id
        where fcTMP_id = p_fcTMP_id
          and fciTMP_id = v_fciTMP_id;

     else

        -- cuando se actualiza se indica
        -- como pendiente la cantidad a remitir menos lo aplicado
        --
        select sum(ocfc_cantidad)
          into v_fci_pendiente
        from OrdenFacturaCompra
        where fci_id = v_fci_id;

        v_fci_pendiente := v_fci_cantidadaremitir - coalesce(v_fci_pendiente, 0);

        update FacturaCompraItem
           set fc_id = v_fc_id,
               fci_orden = v_fci_orden,
               fci_cantidad = v_fci_cantidad,
               fci_cantidadaremitir = v_fci_cantidadaremitir,
               fci_pendiente = v_fci_pendiente,
               fci_descrip = v_fci_descrip,
               fci_precio = v_fci_precio,
               fci_precioUsr = v_fci_precioUsr,
               fci_precioLista = v_fci_precioLista,
               fci_descuento = v_fci_descuento,
               fci_neto = v_fci_neto,
               fci_ivari = v_fci_ivari,
               fci_ivarni = v_fci_ivarni,
               fci_ivariporc = v_fci_ivariporc,
               fci_ivarniporc = v_fci_ivarniporc,
               fci_internos = v_fci_internos,
               fci_internosporc = v_fci_internosporc,
               fci_importe = v_fci_importe,
               fci_importeorigen = v_fci_importeorigen,
               pr_id = v_pr_id,
               to_id = v_to_id,
               ccos_id = v_ccos_id,
               cue_id = v_cue_id,
               cue_id_ivari = v_cue_id_ivari,
               cue_id_ivarni = v_cue_id_ivarni,
               stl_id = v_stl_id
        where fc_id = v_fc_id
          and fci_id = v_fci_id;

        update FacturaCompraItemTMP
           set fci_id = v_fci_id
        where fcTMP_id = p_fcTMP_id
          and fciTMP_id = v_fciTMP_id
          and fci_orden = v_orden;


        update FacturaCompraItemSerieTMP
           set fci_id = v_fci_id
        where fcTMP_id = p_fcTMP_id
          and fciTMP_id = v_fciTMP_id;

     end if;

     v_orden := v_orden + 1;

  end loop;

  v_orden := 1;

  while exists(select 1 from FacturaCompraOtroTMP where fcTMP_id = p_fcTMP_id and fcot_orden = v_orden)
  loop

     select fcot_id,
            fcot_orden,
            fcot_debe,
            fcot_haber,
            fcot_origen,
            fcot_descrip,
            cue_id,
            ccos_id
       into v_fcot_id,
            v_fcot_orden,
            v_fcot_debe,
            v_fcot_haber,
            v_fcot_origen,
            v_fcot_descrip,
            v_cue_id,
            v_ccos_id
     from FacturaCompraOtroTMP
     where fcTMP_id = p_fcTMP_id
       and fcot_orden = v_orden;

     if v_is_new <> 0 or v_fcot_id = 0 then

        select sp_dbGetNewId('FacturaCompraOtro', 'fcot_id') into v_fcot_id;

        insert into FacturaCompraOtro( fc_id, fcot_id, fcot_orden, fcot_debe, fcot_haber, fcot_origen,
                                 fcot_descrip, cue_id, ccos_id )
        values ( v_fc_id, v_fcot_id, v_fcot_orden, v_fcot_debe, v_fcot_haber, v_fcot_origen,
              v_fcot_descrip, v_cue_id, v_ccos_id );

     else

        update FacturaCompraOtro
           set fc_id = v_fc_id,
               fcot_orden = v_fcot_orden,
               fcot_debe = v_fcot_debe,
               fcot_haber = v_fcot_haber,
               fcot_origen = v_fcot_origen,
               fcot_descrip = v_fcot_descrip,
               cue_id = v_cue_id,
               ccos_id = v_ccos_id
        where fc_id = v_fc_id
          and fcot_id = v_fcot_id;

     end if;

     v_orden := v_orden + 1;

  end loop;

  v_orden := 1;

  while exists(select 1 from FacturaCompraPercepcionTMP where fcTMP_id = p_fcTMP_id and fcperc_orden = v_orden)
  loop

     select fcperc_id,
            fcperc_orden,
            fcperc_base,
            fcperc_porcentaje,
            fcperc_importe,
            fcperc_origen,
            fcperc_descrip,
            perc_id,
            ccos_id
       into v_fcperc_id,
            v_fcperc_orden,
            v_fcperc_base,
            v_fcperc_porcentaje,
            v_fcperc_importe,
            v_fcperc_origen,
            v_fcperc_descrip,
            v_perc_id,
            v_ccos_id
     from FacturaCompraPercepcionTMP
     where fcTMP_id = p_fcTMP_id
     and fcperc_orden = v_orden;

     if v_is_new <> 0 or v_fcperc_id = 0 then

        select sp_dbGetNewId('FacturaCompraPercepcion', 'fcperc_id') into v_fcperc_id;

        insert into FacturaCompraPercepcion( fc_id, fcperc_id, fcperc_orden, fcperc_base, fcperc_porcentaje,
                                             fcperc_importe, fcperc_origen, fcperc_descrip, perc_id, ccos_id )
        values ( v_fc_id, v_fcperc_id, v_fcperc_orden, v_fcperc_base, v_fcperc_porcentaje, v_fcperc_importe,
                 v_fcperc_origen, v_fcperc_descrip, v_perc_id, v_ccos_id );

     else
        update FacturaCompraPercepcion
           set fc_id = v_fc_id,
               fcperc_orden = v_fcperc_orden,
               fcperc_base = v_fcperc_base,
               fcperc_porcentaje = v_fcperc_porcentaje,
               fcperc_importe = v_fcperc_importe,
               fcperc_origen = v_fcperc_origen,
               fcperc_descrip = v_fcperc_descrip,
               perc_id = v_perc_id,
               ccos_id = v_ccos_id
        where fc_id = v_fc_id
          and fcperc_id = v_fcperc_id;

     end if;

     v_orden := v_orden + 1;

  end loop;

  v_orden := 1;



  while exists(select 1 from FacturaCompraLegajoTMP where fcTMP_id = p_fcTMP_id and fclgj_orden = v_orden)
  loop
     select fclgj_id,
            fclgj_orden,
            fclgj_importe,
            fclgj_importeorigen,
            fclgj_descrip,
            lgj_id
       into v_fclgj_id,
            v_fclgj_orden,
            v_fclgj_importe,
            v_fclgj_importeorigen,
            v_fclgj_descrip,
            v_lgj_id
     from FacturaCompraLegajoTMP
     where fcTMP_id = p_fcTMP_id
     and fclgj_orden = v_orden;

     if v_is_new <> 0 or v_fclgj_id = 0 then

        select sp_dbGetNewId('FacturaCompraLegajo', 'fclgj_id') into v_fclgj_id;

        insert into FacturaCompraLegajo ( fc_id, fclgj_id, fclgj_orden, fclgj_importe, fclgj_importeorigen,
                                          fclgj_descrip, lgj_id )
        values ( v_fc_id, v_fclgj_id, v_fclgj_orden, v_fclgj_importe, v_fclgj_importeorigen,
                 v_fclgj_descrip, v_lgj_id );
     else

        update FacturaCompraLegajo
           set fc_id = v_fc_id,
               fclgj_orden = v_fclgj_orden,
               fclgj_importe = v_fclgj_importe,
               fclgj_importeorigen = v_fclgj_importeorigen,
               fclgj_descrip = v_fclgj_descrip,
               lgj_id = v_lgj_id
        where fc_id = v_fc_id
          and fclgj_id = v_fclgj_id;

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

  -- hay que borrar los items borrados del orden
  --
  if v_is_new = 0 then

     delete from FacturaCompraItem
     where exists ( select fci_id
                    from FacturaCompraItemBorradoTMP
                    where fc_id = v_fc_id
                      and fci_id = FacturaCompraItem.fci_id
                      and fcTMP_id = p_fcTMP_id );

     delete from FacturaCompraOtro
     where exists ( select fcot_id
                    from FacturaCompraOtroBorradoTMP
                    where fc_id = v_fc_id
                      and fcot_id = FacturaCompraOtro.fcot_id
                      and fcTMP_id = p_fcTMP_id );

     delete from FacturaCompraOtroBorradoTMP where fc_id = v_fc_id and fcTMP_id = p_fcTMP_id;

     delete from FacturaCompraPercepcion
     where exists ( select fcperc_id
                    from FacturaCompraPercepcionBorradoTMP
                    where fc_id = v_fc_id
                      and fcperc_id = FacturaCompraPercepcion.fcperc_id
                      and fcTMP_id = p_fcTMP_id );

     delete from FacturaCompraPercepcionBorradoTMP where fc_id = v_fc_id and fcTMP_id = p_fcTMP_id;

     delete from FacturaCompraLegajo
     where exists ( select fclgj_id
                    from FacturaCompraLegajoBorradoTMP
                    where fc_id = v_fc_id
                      and fclgj_id = FacturaCompraLegajo.fclgj_id
                      and fcTMP_id = p_fcTMP_id );

     delete from FacturaCompraLegajoBorradoTMP where fc_id = v_fc_id and fcTMP_id = p_fcTMP_id;

  end if;

  select sum(fci.fci_importe)
    into v_fc_totaldeuda
  from FacturaCompraItem fci
  join TipoOperacion t
    on fci.to_id = t.to_id
  where fci.fc_id = v_fc_id
    and t.to_generadeuda <> 0;

  if v_fc_totaldeuda is null then

     v_fc_totaldeuda := 0;

  else

     v_fc_totaldeuda := v_fc_totaldeuda - ((v_fc_totaldeuda * v_fc_descuento1) / 100);
     v_fc_totaldeuda := v_fc_totaldeuda - ((v_fc_totaldeuda * v_fc_descuento2) / 100);
     v_fc_totaldeuda := v_fc_totaldeuda + v_fc_totalotros + v_fc_totalpercepciones;

  end if;

  perform sp_doc_factura_compra_save_deuda(
                         v_fc_id,
                         v_cpg_id,
                         v_fc_fecha,
                         v_fc_fechaVto,
                         v_fc_totaldeuda,
                         v_est_id
                         );

/*
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
//                                     aplicacion orden - remito                                                      //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
*/

  perform sp_doc_fac_cpra_orden_remito_save_aplic(v_fc_id, p_fcTMP_id, 0);

/*
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
//                                     talonarios                                                                     //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
*/

  sp_talonario_set(v_ta_id, v_fc_nrodoc);

/*
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
//                                     credito y estado                                                               //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
*/

  perform sp_doc_factura_compra_set_pendiente(v_fc_id);

  perform sp_doc_factura_compra_set_credito(v_fc_id);

  perform sp_doc_factura_compra_set_estado(v_fc_id);

/*
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
//                                     asiento                                                                        //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
*/

  v_cfg_valor := null;
  select sp_cfg_getValor('Compras-General', 'Grabar Asiento') into v_cfg_valor;

  v_cfg_valor := coalesce(v_cfg_valor, 0);

  if to_number(v_cfg_valor) <> 0 then

     select * from sp_docFacturaCompraAsientoSave(v_fc_id, 0) into v_error, v_error_msg;
     if coalesce(v_error, 0) <> 0 then
        raise exception '%', v_error_msg;
     end if;

  else

     if not exists ( select fc_id
                     from FacturaCompraAsiento
                     where fc_id = v_fc_id ) then

        insert into FacturaCompraAsiento
          ( fc_id, fc_fecha )
          ( select fc_id,
                   fc_fecha
            from FacturaCompra
            where fc_grabarAsiento <> 0
              and fc_id = v_fc_id );

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

     select * from sp_DocFacturaCompraStockSave(p_fcTMP_id, v_fc_id, v_depl_id, 0) into v_error, v_error_msg;
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

  update facturacompra set fc_totalcomercial = coalesce(v_fc_totaldeuda, 0) where fc_id = v_fc_id;

/*
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
//                                     generacion automatica de orden de pago																										               //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
*/

  select * from sp_DocFacCpraOrdenPagoSave(v_fc_id) into v_success, v_error_msg;
  if coalesce(v_success, 0) = 0 then
     raise exception '%', v_error_msg;
  end if;

/*
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
//                                     validaciones al documento                                                      //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
*/

  -- estado
  select * from sp_AuditoriaEstadoCheckDocFC(v_fc_id) into v_success, v_error_msg;
  if coalesce(v_success, 0) = 0 then
     raise exception '%', v_error_msg;
  end if;

  -- stock
  select * from sp_AuditoriaStockCheckDocFC(v_fc_id) v_success, v_error_msg;
  if coalesce(v_success, 0) = 0 then
     raise exception '%', v_error_msg;
  end if;

  -- totales
  select * from sp_AuditoriaTotalesCheckDocFC(v_fc_id) into v_success, v_error_msg;
  if coalesce(v_success, 0) = 0 then
     raise exception '%', v_error_msg;
  end if;

  -- vtos
  select * from sp_AuditoriaVtoCheckDocFC(v_fc_id) into v_success, v_error_msg;
  if coalesce(v_success, 0) = 0 then
     raise exception '%', v_error_msg;
  end if;

  -- credito
  select * from sp_AuditoriaCreditoCheckDocFC(v_fc_id) into v_success, v_error_msg;
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

  delete RemitoFacturaCompraTMP where fcTMP_ID = p_fcTMP_ID;
  delete OrdenFacturaCompraTMP where fcTMP_ID = p_fcTMP_ID;
  delete FacturaCompraItemSerieTMP where fcTMP_id = p_fcTMP_id;
  delete FacturaCompraPercepcionTMP where fcTMP_id = p_fcTMP_id;
  delete FacturaCompraLegajoTMP where fcTMP_id = p_fcTMP_id;
  delete FacturaCompraOtroTMP where fcTMP_id = p_fcTMP_id;
  delete FacturaCompraItemTMP where fcTMP_id = p_fcTMP_id;
  delete FacturaCompraItemSerieBTMP where fcTMP_id = p_fcTMP_id;

  /*OJO: esta aca y no en el if (if @IsNew = 0 begin)
         como estaba antes, por que necesito usar
         los registros de esta tabla en
         sp_DocRemitoCompraStockSave para borrar los
         numeros de serie asociados al r‚nglon
  */
  delete FacturaCompraItemBorradoTMP where fc_id = v_fc_id and fcTMP_id = p_fcTMP_id;

  delete FacturaCompraTMP where fcTMP_id = p_fcTMP_id;

/*
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
//                                     historial de modificaciones                                                    //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
*/

  select modifico into v_modifico from FacturaCompra where fc_id = v_fc_id;

  if v_is_new <> 0 then
     perform sp_HistoriaUpdate(17001, v_fc_id, v_modifico, 1);
  else
     perform sp_HistoriaUpdate(17001, v_fc_id, v_modifico, 3);
  end if;

/*
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
//                                     fin                                                                            //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
*/

  rtn.type = 'fc_id'
  rtn.id = v_fc_id;

  return next rtn;

  perform sp_ListaPrecioSaveAuto(v_fc_id, v_doct_id, v_is_new, v_fc_fecha);

exception
   when others then

     raise exception 'Ha ocurrido un error al grabar la factura de compra. sp_doc_factura_compra_save. %. %.',
                      sqlstate, sqlerrm;

end;
$BODY$
  language plpgsql volatile
  cost 100;
alter function sp_doc_factura_compra_save(integer, integer)
  owner to postgres;