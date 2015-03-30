create or replace
function sp_DocFacturaCompraSave
(
  p_fcTMP_id in integer default null ,
  p_bSelect in integer default 1 ,
  p_fc_id out NUMBER ,
  out p_bSuccess integer ,
  out rtn refcursor
)
as
   v_sys_error integer := 0;
   v_cfg_valor varchar(5000);
   v_fc_id integer;
   v_fci_id integer;
   v_IsNew smallint;
   v_orden smallint;
   v_doct_id integer;
   v_cpg_id integer;
   v_fc_total decimal(18,6);
   v_fc_fecha date;
   v_fc_fechaVto date;
   v_fc_fechaiva date;
   v_doc_mueveStock smallint;
   v_depl_id integer;
   -- TO
   v_fc_descuento1 decimal(18,6);
   v_fc_descuento2 decimal(18,6);
   v_fc_totalotros decimal(18,6);
   v_fc_totalpercepciones decimal(18,6);
   v_temp numeric(1,0); := 0;
   v_bSuccess smallint;
   v_MsgError varchar(5000);
   -- La moneda y el talonario siempre salen del documento
   v_mon_id integer;
   v_ta_id integer;
   -- Talonario
   v_doc_id integer;
   v_fc_nrodoc varchar(50);
   v_prov_id integer;
   --
   v_est_id integer;
   -- Campos de las tablas
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
   v_suc_id integer;
   v_lp_id integer;
   v_ld_id integer;
   v_ccos_id integer;
   v_lgj_id integer;
   v_pro_id_origen integer;
   v_pro_id_destino integer;
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
   v_to_id integer;-- TO

   v_cue_id integer;
   v_cue_id_ivari integer;
   v_cue_id_ivarni integer;
   --// Condiciones de Pago que generan op automaticamente
   --   (Debito Automatico y Fondo Fijo)
   --
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
   v_bError smallint;

   dummyChar varchar(255);
   dummyCur refcursor;
   dummyNumber integer;
   v_transcount integer := 0;
   v_exists integer;
begin

   sp_Cfg_GetValor('Compras-General',
                   'Exigir Centro Costo',
                   v_cfg_valor,
                   0);

   v_cfg_valor := coalesce(v_cfg_valor, 0);

   if to_number(v_cfg_valor) <> 0 then
   declare
      v_temp numeric(1,0); := 0;
   begin
      begin
         select 1 into v_temp
           from DUAL
          where exists ( select ccos_id
                         from FacturaCompraTMP
                            where ccos_id is null
                                    and fcTMP_id = p_fcTMP_id );
      exception
         when others then
            null;
      end;

      if v_temp = 1 then
      declare
         v_temp numeric(1,0); := 0;
      begin
         begin
            select 1 into v_temp
              from DUAL
             where exists ( select ccos_id
                            from FacturaCompraItemTMP
                               where ccos_id is null
                                       and fcTMP_id = p_fcTMP_id );
         exception
            when others then
               null;
         end;

         if v_temp = 1 then
         begin
            raise exception '@@ERROR_SP:Debe indicar un centro de costo en cada item o un centro de costo en la cabecera del documento.' );

            return;

         end;
         end if;

         begin
            select 1 into v_temp
              from DUAL
             where exists ( select ccos_id
                            from FacturaCompraOtroTMP
                               where ccos_id is null
                                       and fcTMP_id = p_fcTMP_id );
         exception
            when others then
               null;
         end;

         if v_temp = 1 then
         begin
            raise exception '@@ERROR_SP:Debe indicar un centro de costo en cada item de la solapa "Otros" o un centro de costo en la cabecera del documento.' );

            return;

         end;
         end if;

         begin
            select 1 into v_temp
              from DUAL
             where exists ( select ccos_id
                            from FacturaCompraPercepcionTMP
                               where ccos_id is null
                                       and fcTMP_id = p_fcTMP_id );
         exception
            when others then
               null;
         end;

         if v_temp = 1 then
         begin
            raise exception '@@ERROR_SP:Debe indicar un centro de costo en cada item de percepciones o un centro de costo en la cabecera del documento.' );

            return;

         end;
         end if;

      end;
      end if;

   end;
   end if;

   p_bSuccess := 0;

   begin
      select 1 into v_temp
        from DUAL
       where not exists ( select fcTMP_id
                          from FacturaCompraTMP
                             where fcTMP_id = p_fcTMP_id );
   exception
      when others then
         null;
   end;

   -- Si no existe chau
   if v_temp = 1 then
      return;

   end if;

   v_MsgError := '';

   sp_DocFacCpraValidateDeposito(p_fcTMP_id,
                                  v_bSuccess,
                                  v_MsgError);

   -- Si fallo al guardar
   if coalesce(v_bSuccess, 0) = 0 then
      GOTO ControlError;

   end if;

   --/////////////////////////////////////////////////////////////////////////////////
   select fc_id
     into v_fc_id
     from FacturaCompraTMP
      where fcTMP_id = p_fcTMP_id;

   v_fc_id := coalesce(v_fc_id, 0);

   begin
      select mon_id,
                     case prov_catfiscal
                                        when 1 then ta_id_inscripto--'Inscripto'

                                        when 2 then ta_id_final--'Exento'

                                        when 3 then ta_id_final--'No inscripto'

                                        when 4 then ta_id_final--'Consumidor Final'

                                        when 5 then ta_id_externo--'Extranjero'

                                        when 6 then ta_id_final--'Mono Tributo'

                                        when 7 then ta_id_externo--'Extranjero Iva'

                                        when 8 then ta_id_final--'No responsable'

                                        when 9 then ta_id_final--'No Responsable exento'

                                        when 10 then ta_id_final--'No categorizado'

                                        when 11 then ta_id_inscriptoM--'Inscripto M'

                     else -1--'Sin categorizar'

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
        into v_mon_id,
             v_ta_id,
             v_doct_id,
             v_cpg_id,
             v_fc_total,
             v_fc_fecha,
             v_fc_fechaVto,
             v_fc_fechaiva,
             v_depl_id,
             v_doc_mueveStock,
             -- TO
             v_fc_descuento1,
             v_fc_descuento2,
             v_fc_totalotros,
             v_fc_totalpercepciones,
             -- Talonario
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
   exception
      when others then
         v_sys_error := SQLCODE;
   end;

   if v_ta_id = -1 then
   begin
      open rtn for
         select 'ERROR' col1,
                'El proveedor no esta categorizado. Debe indicar en que categoria fiscal se encuentra el proveedor.' col2
           from DUAL ;

      return;

   end;
   end if;

   SET TRANSACTION READ WRITE;
    v_transcount :=  v_transcount + 1;

   /*
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
//                                        insert                                                                      //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
*/
   if v_fc_id = 0 then
   declare
      -- //////////////////////////////////////////////////////////////////////////////////
      --
      -- Talonario
      --
      v_ta_propuesto smallint;
      v_ta_tipo smallint;
   begin
      v_IsNew := -1;

      SP_DBGetNewId('FacturaCompra',
                    'fc_id',
                    v_fc_id,
                    0);

      if v_sys_error <> 0 then
         GOTO ControlError;

      end if;

      SP_DBGetNewId('FacturaCompra',
                    'fc_numero',
                    v_fc_numero,
                    0);

      if v_sys_error <> 0 then
         GOTO ControlError;

      end if;

      sp_talonario_get_propuesto(v_doc_id,
                               dummyChar,
                               v_ta_propuesto,
                               0,
                               v_prov_id,
                               v_ta_id,
                               v_ta_tipo);

      if v_sys_error <> 0 then
         GOTO ControlError;

      end if;

      if v_ta_propuesto = 0 then
      begin
         if v_ta_tipo = 3 then
         declare
            v_ta_nrodoc varchar(100);
         /*Auto Impresor*/begin
            sp_talonarioGetNextNumber(v_ta_id,
                                      v_ta_nrodoc);

            if v_sys_error <> 0 then
               GOTO ControlError;

            end if;

            -- Con esto evitamos que dos tomen el mismo Numero
            --
            sp_TalonarioSet(v_ta_id,
                                    v_ta_nrodoc);

            if v_sys_error <> 0 then
               GOTO ControlError;

            end if;

            v_fc_nrodoc := v_ta_nrodoc;

         end;
         end if;

      end;
      end if;

      begin
         --
         -- Fin Talonario
         --
         -- //////////////////////////////////////////////////////////////////////////////////
         insert into FacturaCompra
           ( fc_id, fc_numero, fc_nrodoc, fc_descrip, fc_fecha, fc_fechaentrega, fc_fechaVto, fc_fechaiva, fc_neto, fc_ivari, fc_ivarni, fc_internos, fc_total, fc_totalorigen, fc_subtotal, fc_totalotros, fc_totalpercepciones, fc_descuento1, fc_descuento2, fc_importedesc1, fc_importedesc2, fc_grabarasiento, fc_cotizacion, fc_cotizacionprov, fc_cai, fc_tipocomprobante, mon_id, est_id, suc_id, prov_id, doc_id, doct_id, lp_id, ld_id, cpg_id, ccos_id, lgj_id, pro_id_origen, pro_id_destino, modifico )
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
      exception
         when others then
            v_sys_error := SQLCODE;
      end;

      if v_sys_error <> 0 then
         GOTO ControlError;

      end if;

      select doc_id,
             fc_nrodoc
        into v_doc_id,
             v_fc_nrodoc
        from FacturaCompra
         where fc_id = v_fc_id;

   end;
   /*
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
//                                        update                                                                      //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
*/
   else
   begin
      v_IsNew := 0;

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
		//                          GENERACION AUTOMATICA DE ORDEN DE PAGO																										//
		//                                                                                                                    //
		////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		*/
      /*
						Si la condicion de pago de la factura es de tipo [Debito Automatico] o [Fondo Fijo]
		        debo generar una orden de pago automaticamente.
						Para esto tengo que sacar de la condicion de pago el documento y la cuenta contable
		        de los fondos pasando por la cuenta grupo asociada a dicha condicion de pago.
				*/
      -- tengo que desaplicar la orden de pago para poder regenerar la deuda
      select opg_id
        into v_opg_id
        from FacturaCompra
         where fc_id = v_fc_id;

      if v_opg_id is not null then
      declare
         v_emp_id integer;
      begin
         begin
            DELETE FacturaCompraOrdenPago

               where fc_id = v_fc_id;
         exception
            when others then
               v_sys_error := SQLCODE;
         end;

         if v_sys_error <> 0 then
            GOTO ControlError;

         end if;

         begin
            update FacturaCompra
               SET opg_id = null
               where fc_id = v_fc_id;
         exception
            when others then
               v_sys_error := SQLCODE;
         end;

         if v_sys_error <> 0 then
            GOTO ControlError;

         end if;

         begin
            update OrdenPago
               SET fc_id = null
               where fc_id = v_fc_id;
         exception
            when others then
               v_sys_error := SQLCODE;
         end;

         if v_sys_error <> 0 then
            GOTO ControlError;

         end if;

         select emp_id
           into v_emp_id
           from OrdenPago
            where opg_id = v_opg_id;

         sp_DocOrdenPagoDelete(v_opg_id,
                               v_emp_id,
                               v_modifico,
                               p_bSuccess,
                               v_MsgError);

         if p_bSuccess = 0 then
            GOTO ControlError;

         end if;

         begin
            DELETE FacturaCompraDeuda

               where fc_id = v_fc_id;
         exception
            when others then
               v_sys_error := SQLCODE;
         end;

         if v_sys_error <> 0 then
            GOTO ControlError;

         end if;

         begin
            DELETE FacturaCompraPago

               where fc_id = v_fc_id;
         exception
            when others then
               v_sys_error := SQLCODE;
         end;

         if v_sys_error <> 0 then
            GOTO ControlError;

         end if;

      end;
      end if;

      begin
         --///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
         update FacturaCompra
            SET fc_nrodoc = v_fc_nrodoc,
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
      exception
         when others then
            v_sys_error := SQLCODE;
      end;

      if v_sys_error <> 0 then
         GOTO ControlError;

      end if;

   end;
   end if;

   /*
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
//                                        ITEMS                                                                       //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
*/
   v_orden := 1;

    select count(*)
    into v_exists
    from FacturaCompraItemTMP
    where fcTMP_id = p_fcTMP_id
      and fci_orden = v_orden;

   while v_exists > 0
   LOOP
      begin
         begin
            /*
		///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		//                                                                                                               //
		//                                        insert                                                                 //
		//                                                                                                               //
		///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		*/
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
                           to_id,-- TO

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
         exception
            when others then
               v_sys_error := SQLCODE;
         end;

         -- Cuando se inserta se indica
         -- como cantidad a remitir la cantidad (Por ahora)
         v_fci_cantidadaremitir := v_fci_cantidad;

         if v_IsNew <> 0
           or v_fci_id = 0 then
         begin
            -- Cuando se inserta se toma la cantidad a remitir
            -- como el pendiente
            v_fci_pendiente := v_fci_cantidadaremitir;

            SP_DBGetNewId('FacturaCompraItem',
                          'fci_id',
                          v_fci_id,
                          0);

            if v_sys_error <> 0 then
               GOTO ControlError;

            end if;

            begin
               insert into FacturaCompraItem
                 ( fc_id, fci_id, fci_orden, fci_cantidad, fci_cantidadaremitir, fci_descrip, fci_pendiente, fci_precio, fci_precioUsr, fci_precioLista, fci_descuento, fci_neto, fci_ivari, fci_ivarni, fci_ivariporc, fci_ivarniporc, fci_internos, fci_internosporc, fci_importe, fci_importeorigen, pr_id, to_id, ccos_id, cue_id, cue_id_ivari, cue_id_ivarni, stl_id )-- TO

                 values ( v_fc_id, v_fci_id, v_fci_orden, v_fci_cantidad, v_fci_cantidadaremitir, v_fci_descrip, v_fci_pendiente, v_fci_precio, v_fci_precioUsr, v_fci_precioLista, v_fci_descuento, v_fci_neto, v_fci_ivari, v_fci_ivarni, v_fci_ivariporc, v_fci_ivarniporc, v_fci_internos, v_fci_internosporc, v_fci_importe, v_fci_importeorigen, v_pr_id, v_to_id, v_ccos_id, v_cue_id, v_cue_id_ivari, v_cue_id_ivarni, v_stl_id );-- TO

            exception
               when others then
                  v_sys_error := SQLCODE;
            end;

            if v_sys_error <> 0 then
               GOTO ControlError;

            end if;

            begin
               update FacturaCompraItemTMP
                  SET fci_id = v_fci_id
                  where fcTMP_id = p_fcTMP_id
                 and fciTMP_id = v_fciTMP_id
                 and fci_orden = v_orden;
            exception
               when others then
                  v_sys_error := SQLCODE;
            end;

            if v_sys_error <> 0 then
               GOTO ControlError;

            end if;

            begin
               update FacturaCompraItemSerieTMP
                  SET fci_id = v_fci_id
                  where fcTMP_id = p_fcTMP_id
                 and fciTMP_id = v_fciTMP_id;
            exception
               when others then
                  v_sys_error := SQLCODE;
            end;

            if v_sys_error <> 0 then
               GOTO ControlError;

            end if;

         end;
         -- Insert
         /*
		///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		//                                                                                                               //
		//                                        update                                                                 //
		//                                                                                                               //
		///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		*/
         else
         begin
            -- Cuando se actualiza se indica
            -- como pendiente la cantidad a remitir menos lo aplicado
            select SUM(ocfc_cantidad)
              into v_fci_pendiente
              from OrdenFacturaCompra
               where fci_id = v_fci_id;

            v_fci_pendiente := v_fci_cantidadaremitir - coalesce(v_fci_pendiente, 0);

            begin
               update FacturaCompraItem
                  SET fc_id = v_fc_id,
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
                      to_id = v_to_id,-- TO

                      ccos_id = v_ccos_id,
                      cue_id = v_cue_id,
                      cue_id_ivari = v_cue_id_ivari,
                      cue_id_ivarni = v_cue_id_ivarni,
                      stl_id = v_stl_id
                  where fc_id = v_fc_id
                 and fci_id = v_fci_id;
            exception
               when others then
                  v_sys_error := SQLCODE;
            end;

            if v_sys_error <> 0 then
               GOTO ControlError;

            end if;

            begin
               update FacturaCompraItemTMP
                  SET fci_id = v_fci_id
                  where fcTMP_id = p_fcTMP_id
                 and fciTMP_id = v_fciTMP_id
                 and fci_orden = v_orden;
            exception
               when others then
                  v_sys_error := SQLCODE;
            end;

            if v_sys_error <> 0 then
               GOTO ControlError;

            end if;

            begin
               update FacturaCompraItemSerieTMP
                  SET fci_id = v_fci_id
                  where fcTMP_id = p_fcTMP_id
                 and fciTMP_id = v_fciTMP_id;
            exception
               when others then
                  v_sys_error := SQLCODE;
            end;

            if v_sys_error <> 0 then
               GOTO ControlError;

            end if;

         end;
         end if;

         -- Update
         v_orden := v_orden + 1;

      end;

      select count(*)
      into v_exists
      from FacturaCompraItemTMP
      where fcTMP_id = p_fcTMP_id
        and fci_orden = v_orden;

   end LOOP;

   v_orden := 1;

    select count(*)
    into v_exists
    from FacturaCompraOtroTMP
    where fcTMP_id = p_fcTMP_id
      and fcot_orden = v_orden;

   while v_exists > 0
   LOOP
      begin
         begin
            /*
		///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		//                                                                                                               //
		//                                        insert                                                                 //
		//                                                                                                               //
		///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		*/
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
         exception
            when others then
               v_sys_error := SQLCODE;
         end;

         if v_IsNew <> 0
           or v_fcot_id = 0 then
         begin
            SP_DBGetNewId('FacturaCompraOtro',
                          'fcot_id',
                          v_fcot_id,
                          0);

            if v_sys_error <> 0 then
               GOTO ControlError;

            end if;

            begin
               insert into FacturaCompraOtro
                 ( fc_id, fcot_id, fcot_orden, fcot_debe, fcot_haber, fcot_origen, fcot_descrip, cue_id, ccos_id )
                 values ( v_fc_id, v_fcot_id, v_fcot_orden, v_fcot_debe, v_fcot_haber, v_fcot_origen, v_fcot_descrip, v_cue_id, v_ccos_id );
            exception
               when others then
                  v_sys_error := SQLCODE;
            end;

            if v_sys_error <> 0 then
               GOTO ControlError;

            end if;

         end;
         -- Insert
         /*
		///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		//                                                                                                               //
		//                                        update                                                                 //
		//                                                                                                               //
		///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		*/
         else
         begin
            begin
               update FacturaCompraOtro
                  SET fc_id = v_fc_id,
                      fcot_orden = v_fcot_orden,
                      fcot_debe = v_fcot_debe,
                      fcot_haber = v_fcot_haber,
                      fcot_origen = v_fcot_origen,
                      fcot_descrip = v_fcot_descrip,
                      cue_id = v_cue_id,
                      ccos_id = v_ccos_id
                  where fc_id = v_fc_id
                 and fcot_id = v_fcot_id;
            exception
               when others then
                  v_sys_error := SQLCODE;
            end;

            if v_sys_error <> 0 then
               GOTO ControlError;

            end if;

         end;
         end if;

         -- Update
         v_orden := v_orden + 1;

      end;

      select count(*)
      into v_exists
      from FacturaCompraOtroTMP
      where fcTMP_id = p_fcTMP_id
        and fcot_orden = v_orden;

   end LOOP;

   v_orden := 1;

    select count(*)
    into v_exists
    from FacturaCompraPercepcionTMP
    where fcTMP_id = p_fcTMP_id
      and fcperc_orden = v_orden;

   while v_exists > 0
   LOOP
      begin
         begin
            /*
		///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		//                                                                                                               //
		//                                        insert                                                                 //
		//                                                                                                               //
		///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		*/
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
         exception
            when others then
               v_sys_error := SQLCODE;
         end;

         if v_IsNew <> 0
           or v_fcperc_id = 0 then
         begin
            SP_DBGetNewId('FacturaCompraPercepcion',
                          'fcperc_id',
                          v_fcperc_id,
                          0);

            if v_sys_error <> 0 then
               GOTO ControlError;

            end if;

            begin
               insert into FacturaCompraPercepcion
                 ( fc_id, fcperc_id, fcperc_orden, fcperc_base, fcperc_porcentaje, fcperc_importe, fcperc_origen, fcperc_descrip, perc_id, ccos_id )
                 values ( v_fc_id, v_fcperc_id, v_fcperc_orden, v_fcperc_base, v_fcperc_porcentaje, v_fcperc_importe, v_fcperc_origen, v_fcperc_descrip, v_perc_id, v_ccos_id );
            exception
               when others then
                  v_sys_error := SQLCODE;
            end;

            if v_sys_error <> 0 then
               GOTO ControlError;

            end if;

         end;
         -- Insert
         /*
		///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		//                                                                                                               //
		//                                        update                                                                 //
		//                                                                                                               //
		///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		*/
         else
         begin
            begin
               update FacturaCompraPercepcion
                  SET fc_id = v_fc_id,
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
            exception
               when others then
                  v_sys_error := SQLCODE;
            end;

            if v_sys_error <> 0 then
               GOTO ControlError;

            end if;

         end;
         end if;

         -- Update
         v_orden := v_orden + 1;

      end;

      select count(*)
      into v_exists
      from FacturaCompraPercepcionTMP
      where fcTMP_id = p_fcTMP_id
        and fcperc_orden = v_orden;

   end LOOP;

   v_orden := 1;

    select fclgj_orden
    into v_exists
    from FacturaCompraLegajoTMP
    where fcTMP_id = p_fcTMP_id
      and fclgj_orden = v_orden;

   while v_exists > 0
   LOOP
      begin
         begin
    /*
		///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		//                                                                                                               //
		//                                        insert                                                                 //
		//                                                                                                               //
		///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		*/
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
         exception
            when others then
               v_sys_error := SQLCODE;
         end;

         if v_IsNew <> 0
           or v_fclgj_id = 0 then
         begin
            SP_DBGetNewId('FacturaCompraLegajo',
                          'fclgj_id',
                          v_fclgj_id,
                          0);

            if v_sys_error <> 0 then
               GOTO ControlError;

            end if;

            begin
               insert into FacturaCompraLegajo
                 ( fc_id, fclgj_id, fclgj_orden, fclgj_importe, fclgj_importeorigen, fclgj_descrip, lgj_id )
                 values ( v_fc_id, v_fclgj_id, v_fclgj_orden, v_fclgj_importe, v_fclgj_importeorigen, v_fclgj_descrip, v_lgj_id );
            exception
               when others then
                  v_sys_error := SQLCODE;
            end;

            if v_sys_error <> 0 then
               GOTO ControlError;

            end if;

         end;
    -- Insert
    /*
		///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		//                                                                                                               //
		//                                        update                                                                 //
		//                                                                                                               //
		///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		*/
         else
         begin
            begin
               update FacturaCompraLegajo
                  SET fc_id = v_fc_id,
                      fclgj_orden = v_fclgj_orden,
                      fclgj_importe = v_fclgj_importe,
                      fclgj_importeorigen = v_fclgj_importeorigen,
                      fclgj_descrip = v_fclgj_descrip,
                      lgj_id = v_lgj_id
                  where fc_id = v_fc_id
                 and fclgj_id = v_fclgj_id;
            exception
               when others then
                  v_sys_error := SQLCODE;
            end;

            if v_sys_error <> 0 then
               GOTO ControlError;

            end if;

         end;
         end if;

         -- Update
         v_orden := v_orden + 1;

      end;

      select fclgj_orden
      into v_exists
      from FacturaCompraLegajoTMP
      where fcTMP_id = p_fcTMP_id
        and fclgj_orden = v_orden;

   end LOOP;

-- While
/*
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
//                                     ITEMS BORRADOS                                                                 //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
*/
   -- Hay que borrar los items borrados del orden
   if v_IsNew = 0 then
   begin
      begin
         DELETE FacturaCompraItem

            where exists ( select fci_id
                           from FacturaCompraItemBorradoTMP
                              where fc_id = v_fc_id
                                      and fci_id = FacturaCompraItem.fci_id
                                      and fcTMP_id = p_fcTMP_id );
      exception
         when others then
            v_sys_error := SQLCODE;
      end;

      if v_sys_error <> 0 then
         GOTO ControlError;

      end if;

      begin
         -----------------------------------------------------------------------------------------
         DELETE FacturaCompraOtro

            where exists ( select fcot_id
                           from FacturaCompraOtroBorradoTMP
                              where fc_id = v_fc_id
                                      and fcot_id = FacturaCompraOtro.fcot_id
                                      and fcTMP_id = p_fcTMP_id );
      exception
         when others then
            v_sys_error := SQLCODE;
      end;

      if v_sys_error <> 0 then
         GOTO ControlError;

      end if;

      DELETE FacturaCompraOtroBorradoTMP

         where fc_id = v_fc_id
                 and fcTMP_id = p_fcTMP_id;

      begin
         -----------------------------------------------------------------------------------------
         DELETE FacturaCompraPercepcion

            where exists ( select fcperc_id
                           from FacturaCompraPercepcionBorrado
                              where fc_id = v_fc_id
                                      and fcperc_id = FacturaCompraPercepcion.fcperc_id
                                      and fcTMP_id = p_fcTMP_id );
      exception
         when others then
            v_sys_error := SQLCODE;
      end;

      if v_sys_error <> 0 then
         GOTO ControlError;

      end if;

      DELETE FacturaCompraPercepcionBorrado

         where fc_id = v_fc_id
                 and fcTMP_id = p_fcTMP_id;

      begin
         -----------------------------------------------------------------------------------------
         DELETE FacturaCompraLegajo

            where exists ( select fclgj_id
                           from FacturaCompraLegajoBorradoTMP
                              where fc_id = v_fc_id
                                      and fclgj_id = FacturaCompraLegajo.fclgj_id
                                      and fcTMP_id = p_fcTMP_id );
      exception
         when others then
            v_sys_error := SQLCODE;
      end;

      if v_sys_error <> 0 then
         GOTO ControlError;

      end if;

      DELETE FacturaCompraLegajoBorradoTMP

         where fc_id = v_fc_id
                 and fcTMP_id = p_fcTMP_id;

   end;
   end if;

   begin
      select SUM(fci.fci_importe)
        into v_fc_totaldeuda
        from FacturaCompraItem fci
               join TipoOperacion t
                on fci.to_id = t.to_id
         where fci.fc_id = v_fc_id
                 and t.to_generadeuda <> 0;
   exception
      when others then
         v_sys_error := SQLCODE;
   end;

   if v_fc_totaldeuda is null then
   begin
      v_fc_totaldeuda := 0;

   end;
   else
   begin
      v_fc_totaldeuda := v_fc_totaldeuda - ((v_fc_totaldeuda * v_fc_descuento1) / 100);

      v_fc_totaldeuda := v_fc_totaldeuda - ((v_fc_totaldeuda * v_fc_descuento2) / 100);

      v_fc_totaldeuda := v_fc_totaldeuda + v_fc_totalotros + v_fc_totalpercepciones;

   end;
   end if;

   sp_DocFacturaCompraSaveDeuda(v_fc_id,
                                v_cpg_id,
                                v_fc_fecha,
                                v_fc_fechaVto,
                                v_fc_totaldeuda,
                                v_est_id,
                                v_bSuccess);

   -- Si fallo al guardar
   if coalesce(v_bSuccess, 0) = 0 then
      GOTO ControlError;

   end if;

   /*
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                               //
//                                        APLICACION ORDEN - REMITO                                              //
//                                                                                                               //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
*/
   sp_DocFacCpraOrdRtoSaveAplic(v_fc_id,
                                p_fcTMP_id,
                                0,
                                v_bSuccess);

   -- Si fallo al guardar
   if coalesce(v_bSuccess, 0) = 0 then
      GOTO ControlError;

   end if;

   /*
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
//                                     TALONARIOS                                                                     //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
*/
   sp_TalonarioSet(v_ta_id,
                           v_fc_nrodoc);

   if v_sys_error <> 0 then
      GOTO ControlError;

   end if;

   /*
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
//                                     CREDITO Y ESTADO                                                               //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
*/
   sp_DocFacCpraSetPendiente(v_fc_id,
                                          v_bSuccess);

   -- Si fallo al guardar
   if coalesce(v_bSuccess, 0) = 0 then
      GOTO ControlError;

   end if;

   sp_DocFacturaCompraSetCredito(v_fc_id);

   if v_sys_error <> 0 then
      GOTO ControlError;

   end if;

   sp_DocFacturaCompraSetEstado(v_fc_id,
                                p_est_id => dummyNumber,
                                rtn => dummyCur);

   if v_sys_error <> 0 then
      GOTO ControlError;

   end if;

/*
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
//                                     ASIENTO                                                                        //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
*/
   v_cfg_valor := null;

   sp_Cfg_GetValor('Compras-General',
                   'Grabar Asiento',
                   v_cfg_valor,
                   0);

   v_cfg_valor := coalesce(v_cfg_valor, 0);

   if to_number(v_cfg_valor) <> 0 then
   begin
      sp_docFacturaCompraAsientoSave(v_fc_id,
                                     0,
                                     v_bError,
                                     v_MsgError,
                                     p_as_id => dummyNumber);

      if v_bError <> 0 then
         GOTO ControlError;

      end if;

   end;
   else
   declare
      v_temp numeric(1,0); := 0;
   begin
      begin
         select 1 into v_temp
           from DUAL
          where not exists ( select fc_id
                             from FacturaCompraAsiento
                                where fc_id = v_fc_id );
      exception
         when others then
            null;
      end;

      if v_temp = 1 then
      begin
         insert into FacturaCompraAsiento
           ( fc_id, fc_fecha )
           ( select fc_id,
                    fc_fecha
             from FacturaCompra
                where fc_grabarAsiento <> 0
                        and fc_id = v_fc_id );

      end;
      end if;

   end;
   end if;

   /*
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
//                                     STOCK                                                                          //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
*/
   if coalesce(v_doc_mueveStock, 0) <> 0 then
   begin
      sp_DocFacturaCompraStockSave(p_fcTMP_id,
                                   v_fc_id,
                                   v_depl_id,
                                   0,
                                   v_bError,
                                   v_MsgError);

      -- Si fallo al guardar
      if v_bError <> 0 then
         GOTO ControlError;

      end if;

   end;
   end if;

   /*
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
//                          TOTAL COMERCIAL - NECESARIO PARA LOS REPORTES DE CTA CTE                                  //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
*/
   update facturacompra
      SET fc_totalcomercial = coalesce(v_fc_totaldeuda, 0)
      where fc_id = v_fc_id;

   /*
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
//                          GENERACION AUTOMATICA DE ORDEN DE PAGO																										//
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
*/
   sp_DocFacCpraOrdenPagoSave(v_fc_id,
                              p_bSuccess,
                              v_MsgError);

   -- Si fallo al guardar
   if p_bSuccess = 0 then
      GOTO ControlError;

   end if;

   /*
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
//                                     VALIDACIONES AL DOCUMENTO                                                      //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
*/
   -- ESTADO
   sp_AuditoriaEstadoCheckDocFC(v_fc_id,
                                        v_bSuccess,
                                        v_MsgError);

   -- Si el documento no es valido
   if coalesce(v_bSuccess, 0) = 0 then
      GOTO ControlError;

   end if;

   -- FECHAS
   -- STOCK
   sp_AuditoriaStockCheckDocFC(v_fc_id,
                                       v_bSuccess,
                                       v_MsgError);

   -- Si el documento no es valido
   if coalesce(v_bSuccess, 0) = 0 then
      GOTO ControlError;

   end if;

   -- TOTALES
   sp_AuditoriaTotalesCheckDocFC(v_fc_id,
                                         v_bSuccess,
                                         v_MsgError);

   -- Si el documento no es valido
   if coalesce(v_bSuccess, 0) = 0 then
      GOTO ControlError;

   end if;

   -- VTOS
   sp_AuditoriaVtoCheckDocFC(v_fc_id,
                                     v_bSuccess,
                                     v_MsgError);

   -- Si el documento no es valido
   if coalesce(v_bSuccess, 0) = 0 then
      GOTO ControlError;

   end if;

   -- CREDITO
   sp_AuditoriaCreditoCheckDocFC(v_fc_id,
                                         v_bSuccess,
                                         v_MsgError);

   -- Si el documento no es valido
   if coalesce(v_bSuccess, 0) = 0 then
      GOTO ControlError;

   end if;

   /*
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
//                                     BORRAR TEMPORALES                                                              //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
*/
   DELETE RemitoFacturaCompraTMP

      where fcTMP_ID = p_fcTMP_ID;

   DELETE OrdenFacturaCompraTMP

      where fcTMP_ID = p_fcTMP_ID;

   DELETE FacturaCompraItemSerieTMP

      where fcTMP_id = p_fcTMP_id;

   DELETE FacturaCompraPercepcionTMP

      where fcTMP_id = p_fcTMP_id;

   DELETE FacturaCompraLegajoTMP

      where fcTMP_id = p_fcTMP_id;

   DELETE FacturaCompraOtroTMP

      where fcTMP_id = p_fcTMP_id;

   DELETE FacturaCompraItemTMP

      where fcTMP_id = p_fcTMP_id;

   DELETE FacturaCompraItemSerieBTMP

      where fcTMP_id = p_fcTMP_id;

   /*OJO: Esta aca y no en el if (if @IsNew = 0 begin)
				 como estaba antes, por que necesito usar
				 los registros de esta tabla en
				 sp_DocRemitoCompraStockSave para borrar los
	       numeros de serie asociados al r‚nglon
	*/
   DELETE FacturaCompraItemBorradoTMP

      where fc_id = v_fc_id
              and fcTMP_id = p_fcTMP_id;

   DELETE FacturaCompraTMP

      where fcTMP_id = p_fcTMP_id;

   /*
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
//                                     HISTORIAL DE MODIFICACIONES                                                    //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
*/
   select modifico
     into v_modifico
     from FacturaCompra
      where fc_id = v_fc_id;

   if v_IsNew <> 0 then
      sp_HistoriaUpdate(17001,
                        v_fc_id,
                        v_modifico,
                        1);

   else
      sp_HistoriaUpdate(17001,
                        v_fc_id,
                        v_modifico,
                        3);

   end if;

   /*
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
//                                     FIN                                                                            //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
*/
   COMMIT;

   p_fc_id := v_fc_id;

   p_bSuccess := 1;

   begin
      select 1 into v_temp
        from DUAL
       where p_bSelect <> 0;
   exception
      when others then
         null;
   end;

   if v_temp = 1 then
      open rtn for
         select v_fc_id
           from DUAL ;

   end if;

   sp_ListaPrecioSaveAuto(v_fc_id,
                          v_doct_id,
                          v_IsNew,
                          v_fc_fecha);

   return;

   <<ControlError>>

   v_MsgError := 'Ha ocurrido un error al grabar la factura de compra. sp_DocFacturaCompraSave. ' || v_MsgError;

   raise_application_error( -20002, v_MsgError );

   if  v_transcount > 0 then
   begin
      ROLLBACK;
       v_transcount :=  v_transcount - 1;

   end;
   end if;

end;
--done