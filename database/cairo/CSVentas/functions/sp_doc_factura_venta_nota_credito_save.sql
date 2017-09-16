create or replace
function sp_doc_factura_venta_nota_credito_save
(
  in p_fvTMP_id integer,
  out p_success integer, 
  out rtn refcursor
)
as
   v_error_msg varchar(5000);
   v_fvnc_id integer;
   v_fvnc_importe decimal(18,6);
   v_fvd_pendiente decimal(18,6);
   v_fvd_importe decimal(18,6);
   v_pago decimal(18,6);
   v_fvd_id integer;
   v_fvp_id integer;
   v_doct_id integer;
   v_fv_id integer;
   v_fvp_fecha date;
   v_fvd_fecha date;
   v_fvd_fecha2 date;
   v_bBorrarVinculacion smallint;
   v_fvd_id_factura integer;
   v_fvd_id_notacredito integer;
   v_fvp_id_factura integer;
   v_fvp_id_notacredito integer;
   v_fv_id_factura integer;
   v_fv_id_notacredito integer;
   v_fv_id_aplic integer;
   v_bSuccess smallint;
   v_c_fvncaplic varchar(4000);
   v_sys_error varchar := '';
   c_fvncaplic refcursor;

   CURSOR c_aplic
     is select fvnc_id,
               fvd_id_notacredito,
               fvd_id_factura,
               fvp_id_notacredito,
               fvp_id_factura,
               fvnc_importe
     from FacturaVentaNotaCredito
      where ( ( fvd_id_notacredito is not null )
     and ( fv_id_notacredito = v_fv_id
     and v_doct_id = 7 ) )
     or ( ( fvd_id_factura is not null )
     and ( fv_id_factura = v_fv_id
     and v_doct_id <> 7 ) )
     or ( ( fvp_id_notacredito is not null )
     and ( fv_id_notacredito = v_fv_id
     and v_doct_id = 7 ) )
     or ( ( fvp_id_factura is not null )
     and ( fv_id_factura = v_fv_id
     and v_doct_id <> 7 ) );
   CURSOR 
   c_deuda
     is select fvnc_importe,
               fv_id_factura,
               fv_id_notacredito,
               fvd_id_factura,
               fvd_id_notacredito,
               fvp_id_factura,
               fvp_id_notacredito
     from FacturaVentaNotaCreditoTMP
      where fvTMP_id = p_fvTMP_id
     and fvnc_importe <> 0;
     
    v_transcount integer := 0;
    dummyNumber integer := 0;
begin

   v_bBorrarVinculacion := 0;

   p_success := 0;

   select fv_id
     into v_fv_id
     from FacturaVentaTMP
      where fvTMP_id = p_fvTMP_id;

   begin
/*
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                               //
//                                        APLICACION-PREVIA                                                      //
//                                                                                                               //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
*/
      select d.doct_id
        into v_doct_id
        from FacturaVentaTMP tmp
               join Documento d
                on tmp.doc_id = d.doc_id
         where tmp.doc_id = d.doc_id
                 and tmp.fvTMP_id = p_fvTMP_id;
   exception
      when others then
         v_sys_error := sqlstate;
   end;

   if v_doct_id = 7 then
   declare
      v_temp numeric(1,0); := 0;
   /*Nota de credito*/begin
      begin
         select 1 into v_temp
           from DUAL
          where exists ( select fvnc_id
                         from FacturaVentaNotaCredito
                            where fv_id_notacredito = v_fv_id );
      exception
         when others then
            null;
      end;

      if v_temp = 1 then
      begin
         v_bBorrarVinculacion := 1;

         insert into tt_FacturaVentaNotaCredito
           ( fv_id )
           ( select distinct fv_id_factura
             from FacturaVentaNotaCredito fvnc
                where fv_id_notacredito = v_fv_id
                        and not exists ( select *
                                         from FacturaVentaNotaCreditoTMP
                                            where fvTMP_id = p_fvTMP_id
                                                    and fvnc_importe <> 0
                                                    and fv_id_factura = fvnc.fv_id_factura ) );

      end;
      end if;

   end;
   else
   declare
      v_temp numeric(1,0); := 0;
   begin
      begin
         select 1 into v_temp
           from DUAL
          where exists ( select fvnc_id
                         from FacturaVentaNotaCredito
                            where fv_id_factura = v_fv_id );
      exception
         when others then
            null;
      end;

      /*Nota de debito y Factura*/if v_temp = 1 then
      begin
         v_bBorrarVinculacion := 1;

         insert into tt_FacturaVentaNotaCredito
           ( fv_id )
           ( select distinct fv_id_notacredito
             from FacturaVentaNotaCredito fvnc
                where fv_id_factura = v_fv_id
                        and not exists ( select *
                                         from FacturaVentaNotaCreditoTMP
                                            where fvTMP_id = p_fvTMP_id
                                                    and fvnc_importe <> 0
                                                    and fv_id_notacredito = fvnc.fv_id_notacredito ) );

      end;
      end if;

   end;
   end if;

   SET TRANSACTION READ WRITE;
    v_transcount :=  v_transcount + 1;

   -- Tengo que eliminar la aplicacion anterior si es que existe
   --
   if coalesce(v_bBorrarVinculacion, 0) <> 0 then
   begin
      /*Nota de credito*//*Nota de debito y Factura*//*Nota de credito*//*Nota de debito y Factura*/open c_aplic;

      fetch c_aplic into v_fvnc_id,v_fvd_id_notacredito,v_fvd_id_factura,v_fvp_id_notacredito,v_fvp_id_factura,v_fvnc_importe;

      while sqlserver_utilities.fetch_status(c_aplic%found) = 0
      loop
         begin
            -- Actualizo la deuda de la factura
            --
            if v_fvd_id_factura is not null then
            begin
               begin
                  update FacturaVentaDeuda
                     set fvd_pendiente = fvd_pendiente + v_fvnc_importe
                     where fvd_id = v_fvd_id_factura;
               exception
                  when others then
                     v_sys_error := sqlstate;
               end;

               if v_sys_error <> '' then
                  exit CONTROL_ERROR;

               end if;

            end;
            end if;

            -- Actualizo la deuda de la nota de credito
            --
            if v_fvd_id_notacredito is not null then
            begin
               begin
                  update FacturaVentaDeuda
                     set fvd_pendiente = fvd_pendiente + v_fvnc_importe
                     where fvd_id = v_fvd_id_notacredito;
               exception
                  when others then
                     v_sys_error := sqlstate;
               end;

               if v_sys_error <> '' then
                  exit CONTROL_ERROR;

               end if;

            end;
            end if;

            -- Si hay un pago
            --
            if v_fvp_id_factura is not null then
            declare
               v_temp numeric(1,0); := 0;
            begin
               begin
                  select 1 into v_temp
                    from DUAL
                   where exists ( select fvp_id
                                  from FacturaVentaPago
                                     where fvp_id = v_fvp_id_factura );
               exception
                  when others then
                     null;
               end;

               if v_temp = 1 then
               begin
                  select fv_id,
                         fvp_importe,
                         fvp_fecha
                    into v_fv_id_factura,
                         v_fvd_importe,
                         v_fvp_fecha
                    from FacturaVentaPago
                     where fvp_id = v_fvp_id_factura;

                  begin
                     select coalesce(sum(fvnc_importe), 0)
                       into v_fvd_pendiente
                       from FacturaVentaNotaCredito fvnc
                        where fvp_id_factura = v_fvp_id_factura
                                and exists ( select *
                                             from FacturaVentaNotaCreditoTMP fvnctmp
                                                where fvTMP_id = p_fvTMP_id
                                                        and ( fvnctmp.fvd_id_notacredito = fvnc.fvd_id_notacredito
                                                        or fvnctmp.fvp_id_notacredito = fvnc.fvp_id_notacredito ) );
                  exception
                     when others then
                        v_sys_error := sqlstate;
                  end;

                  -- Creo una deuda
                  sp_dbGetNewId('FacturaVentaDeuda',
                                        'fvd_id',
                                        v_fvd_id,
                                        0);

                  if v_sys_error <> '' then
                     exit CONTROL_ERROR;

                  end if;

                  sp_doc_get_fecha2(v_fvp_fecha,
                                  v_fvd_fecha2,
                                  0,
                                  null);

                  if v_sys_error <> '' then
                     exit CONTROL_ERROR;

                  end if;

                  begin
                     insert into FacturaVentaDeuda
                       ( fvd_id, fvd_fecha, fvd_fecha2, fvd_importe, fvd_pendiente, fv_id )
                       values ( v_fvd_id, v_fvp_fecha, v_fvd_fecha2, v_fvd_importe, v_fvd_pendiente, v_fv_id_factura );
                  exception
                     when others then
                        v_sys_error := sqlstate;
                  end;

                  if v_sys_error <> '' then
                     exit CONTROL_ERROR;

                  end if;

                  begin
                     -- Actualizo la tabla de vinculacion para que apunte a la deuda
                     update FacturaVentaCobranza
                        set fvd_id = v_fvd_id,
                            fvp_id = null
                        where fvp_id = v_fvp_id_factura;
                  exception
                     when others then
                        v_sys_error := sqlstate;
                  end;

                  if v_sys_error <> '' then
                     exit CONTROL_ERROR;

                  end if;

                  begin
                     -- Actualizo la tabla de vinculacion para que apunte a la deuda
                     update FacturaVentaNotaCredito
                        set fvd_id_factura = v_fvd_id,
                            fvp_id_factura = null
                        where fvp_id_factura = v_fvp_id_factura;
                  exception
                     when others then
                        v_sys_error := sqlstate;
                  end;

                  if v_sys_error <> '' then
                     exit CONTROL_ERROR;

                  end if;

                  begin
                     -- Actualizo la temporal para que apunte a la deuda
                     update FacturaVentaNotaCreditoTMP
                        set fvd_id_factura = v_fvd_id
                        where fvp_id_factura = v_fvp_id_factura;
                  exception
                     when others then
                        v_sys_error := sqlstate;
                  end;

                  if v_sys_error <> '' then
                     exit CONTROL_ERROR;

                  end if;

                  begin
                     -- Actualizo la temporal para que apunte a la deuda
                     update FacturaVentaCobranzaTMP
                        set fvp_id = null,
                            fvd_id = v_fvd_id
                        where fvp_id = v_fvp_id_factura;
                  exception
                     when others then
                        v_sys_error := sqlstate;
                  end;

                  if v_sys_error <> '' then
                     exit CONTROL_ERROR;

                  end if;

                  begin
                     -- Borro el pago
                     delete FacturaVentaPago

                        where fvp_id = v_fvp_id_factura;
                  exception
                     when others then
                        v_sys_error := sqlstate;
                  end;

                  if v_sys_error <> '' then
                     exit CONTROL_ERROR;

                  end if;

               end;
               end if;

            end;
            end if;

            if v_fvp_id_notacredito is not null then
            declare
               v_temp numeric(1,0); := 0;
            begin
               begin
                  select 1 into v_temp
                    from DUAL
                   where exists ( select fvp_id
                                  from FacturaVentaPago
                                     where fvp_id = v_fvp_id_notacredito );
               exception
                  when others then
                     null;
               end;

               if v_temp = 1 then
               begin
                  select fv_id,
                         fvp_importe,
                         fvp_fecha
                    into v_fv_id_notacredito,
                         v_fvd_importe,
                         v_fvp_fecha
                    from FacturaVentaPago
                     where fvp_id = v_fvp_id_notacredito;

                  begin
                     select coalesce(sum(fvnc_importe), 0)
                       into v_fvd_pendiente
                       from FacturaVentaNotaCredito fvnc
                        where fvp_id_notacredito = v_fvp_id_notacredito
                                and exists ( select *
                                             from FacturaVentaNotaCreditoTMP fvnctmp
                                                where fvTMP_id = p_fvTMP_id
                                                        and ( fvnctmp.fvd_id_factura = fvnc.fvd_id_factura
                                                        or fvnctmp.fvp_id_factura = fvnc.fvp_id_factura ) );
                  exception
                     when others then
                        v_sys_error := sqlstate;
                  end;

                  -- Creo una deuda
                  sp_dbGetNewId('FacturaVentaDeuda',
                                        'fvd_id',
                                        v_fvd_id,
                                        0);

                  if v_sys_error <> '' then
                     exit CONTROL_ERROR;

                  end if;

                  sp_doc_get_fecha2(v_fvp_fecha,
                                  v_fvd_fecha2,
                                  0,
                                  null);

                  if v_sys_error <> '' then
                     exit CONTROL_ERROR;

                  end if;

                  begin
                     insert into FacturaVentaDeuda
                       ( fvd_id, fvd_fecha, fvd_fecha2, fvd_importe, fvd_pendiente, fv_id )
                       values ( v_fvd_id, v_fvp_fecha, v_fvd_fecha2, v_fvd_importe, v_fvd_pendiente, v_fv_id_notacredito );
                  exception
                     when others then
                        v_sys_error := sqlstate;
                  end;

                  if v_sys_error <> '' then
                     exit CONTROL_ERROR;

                  end if;

                  begin
                     -- Actualizo la tabla de vinculacion para que apunte a la deuda
                     update FacturaVentaCobranza
                        set fvd_id = v_fvd_id,
                            fvp_id = null
                        where fvp_id = v_fvp_id_notacredito;
                  exception
                     when others then
                        v_sys_error := sqlstate;
                  end;

                  if v_sys_error <> '' then
                     exit CONTROL_ERROR;

                  end if;

                  begin
                     -- Actualizo la tabla de vinculacion para que apunte a la deuda
                     update FacturaVentaNotaCredito
                        set fvd_id_notacredito = v_fvd_id,
                            fvp_id_notacredito = null
                        where fvp_id_notacredito = v_fvp_id_notacredito;
                  exception
                     when others then
                        v_sys_error := sqlstate;
                  end;

                  if v_sys_error <> '' then
                     exit CONTROL_ERROR;

                  end if;

                  begin
                     -- Actualizo la temporal para que apunte a la deuda
                     update FacturaVentaNotaCreditoTMP
                        set fvd_id_notacredito = v_fvd_id
                        where fvp_id_notacredito = v_fvp_id_notacredito;
                  exception
                     when others then
                        v_sys_error := sqlstate;
                  end;

                  if v_sys_error <> '' then
                     exit CONTROL_ERROR;

                  end if;

                  begin
                     -- Borro el pago
                     delete FacturaVentaPago

                        where fvp_id = v_fvp_id_notacredito;
                  exception
                     when others then
                        v_sys_error := sqlstate;
                  end;

                  if v_sys_error <> '' then
                     exit CONTROL_ERROR;

                  end if;

               end;
               end if;

            end;
            end if;

            begin
               delete FacturaVentaNotaCredito

                  where fvnc_id = v_fvnc_id;
            exception
               when others then
                  v_sys_error := sqlstate;
            end;

            if v_sys_error <> '' then
               exit CONTROL_ERROR;

            end if;

            fetch c_aplic into v_fvnc_id,v_fvd_id_notacredito,v_fvd_id_factura,v_fvp_id_notacredito,v_fvp_id_factura,v_fvnc_importe;

         end;
      end loop;

      close c_aplic;

      begin
         delete FacturaVentaNotaCredito

            where ( fv_id_notacredito = v_fv_id
                    and v_doct_id = 7 )/*Nota de credito*/
                    or ( fv_id_factura = v_fv_id
                    and v_doct_id <> 7 );/*Nota de debito y Factura*/
      exception
         when others then
            v_sys_error := sqlstate;
      end;

      if v_sys_error <> '' then
         exit CONTROL_ERROR;

      end if;

   end;
   end if;

   open c_deuda;

   fetch c_deuda into v_fvnc_importe,v_fv_id_factura,v_fv_id_notacredito,v_fvd_id_factura,v_fvd_id_notacredito,v_fvp_id_factura,v_fvp_id_notacredito;

   while sqlserver_utilities.fetch_status(c_deuda%found) = 0
   loop
      begin
    /*
		///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		//                                                                                                               //
		//                                        FACTURA                                                                //
		//                                                                                                               //
		///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		*/
         -- Si tengo una factura
         if v_fvd_id_factura is not null then
         begin
            -- Obtengo el monto de la deuda
            select fvd_pendiente
              into v_fvd_pendiente
              from FacturaVentaDeuda
               where fvd_id = v_fvd_id_factura;

            -- Si el pago no cancela el pendiente
            if v_fvd_pendiente - v_fvnc_importe > 0.01 then
            begin
               -- No hay pago
               v_fvp_id := null;

            end;
            -- Si el pago cancela la deuda cargo un nuevo pago
            -- y luego voy a borrar la deuda
            else
            begin
               -- Acumulo en el pago toda la deuda para pasar de la tabla FacturaVentaDeuda a FacturaVentaPago
               --
               v_pago := 0;

               begin
                  select fvd_fecha,
                         fvd_importe
                    into v_fvd_fecha,
                         v_pago
                    from FacturaVentaDeuda
                     where fvd_id = v_fvd_id_factura;
               exception
                  when others then
                     v_sys_error := sqlstate;
               end;

               sp_dbGetNewId('FacturaVentaPago',
                             'fvp_id',
                             v_fvp_id,
                             0);

               if v_sys_error <> '' then
                  exit CONTROL_ERROR;

               end if;

               begin
                  insert into FacturaVentaPago
                    ( fvp_id, fvp_fecha, fvp_importe, fv_id )
                    values ( v_fvp_id, v_fvd_fecha, v_pago, v_fv_id_factura );
               exception
                  when others then
                     v_sys_error := sqlstate;
               end;

               if v_sys_error <> '' then
                  exit CONTROL_ERROR;

               end if;

               v_fvp_id_factura := v_fvp_id;

            end;
            end if;

            -- Si hay pago borro la/s deudas
            if coalesce(v_fvp_id, 0) <> 0 then
            begin
               begin
                  -- Actualizo la tabla de vinculacion para que apunte al pago
                  update FacturaVentaCobranza
                     set fvd_id = null,
                         fvp_id = v_fvp_id
                     where fvd_id = v_fvd_id_factura;
               exception
                  when others then
                     v_sys_error := sqlstate;
               end;

               if v_sys_error <> '' then
                  exit CONTROL_ERROR;

               end if;

               begin
                  -- Actualizo la tabla de vinculacion para que apunte a la deuda
                  update FacturaVentaNotaCredito
                     set fvd_id_factura = null,
                         fvp_id_factura = v_fvp_id
                     where fvd_id_factura = v_fvd_id_factura;
               exception
                  when others then
                     v_sys_error := sqlstate;
               end;

               if v_sys_error <> '' then
                  exit CONTROL_ERROR;

               end if;

               begin
                  -- Actualizo la temporal para que apunte a la deuda
                  update FacturaVentaNotaCreditoTMP
                     set fvd_id_factura = null,
                         fvp_id_factura = v_fvp_id
                     where fvd_id_factura = v_fvd_id_factura;
               exception
                  when others then
                     v_sys_error := sqlstate;
               end;

               if v_sys_error <> '' then
                  exit CONTROL_ERROR;

               end if;

               begin
                  -- Actualizo la temporal para que apunte a la deuda
                  update FacturaVentaCobranzaTMP
                     set fvd_id = null,
                         fvp_id = v_fvp_id
                     where fvd_id = v_fvd_id_factura;
               exception
                  when others then
                     v_sys_error := sqlstate;
               end;

               if v_sys_error <> '' then
                  exit CONTROL_ERROR;

               end if;

               begin
                  delete FacturaVentaDeuda

                     where fv_id = v_fv_id_factura
                             and fvd_id = v_fvd_id_factura;
               exception
                  when others then
                     v_sys_error := sqlstate;
               end;

               if v_sys_error <> '' then
                  exit CONTROL_ERROR;

               end if;

               v_fvd_id_factura := null;

            end;
            else
            begin
               v_fvp_id_factura := null;

            end;
            end if;

         end;
         end if;

    /*
		///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		//                                                                                                               //
		//                                        NOTA DE CREDITO                                                        //
		//                                                                                                               //
		///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		*/
         -- Si tengo una factura
         if v_fvd_id_notacredito is not null then
         begin
            -- Obtengo el monto de la deuda
            select fvd_pendiente
              into v_fvd_pendiente
              from FacturaVentaDeuda
               where fvd_id = v_fvd_id_notacredito;

            -- Si el pago no cancela el pendiente
            if v_fvd_pendiente - v_fvnc_importe > 0.01 then
            begin
               -- No hay pago
               v_fvp_id := null;

            end;
            -- Si el pago cancela la deuda cargo un nuevo pago
            -- y luego voy a borrar la deuda
            else
            begin
               v_pago := 0;

               begin
                  select fvd_fecha,
                         fvd_importe
                    into v_fvd_fecha,
                         v_pago
                    from FacturaVentaDeuda
                     where fvd_id = v_fvd_id_notacredito;
               exception
                  when others then
                     v_sys_error := sqlstate;
               end;

               sp_dbGetNewId('FacturaVentaPago',
                             'fvp_id',
                             v_fvp_id,
                             0);

               if v_sys_error <> '' then
                  exit CONTROL_ERROR;

               end if;

               begin
                  insert into FacturaVentaPago
                    ( fvp_id, fvp_fecha, fvp_importe, fv_id )
                    values ( v_fvp_id, v_fvd_fecha, v_pago, v_fv_id_notacredito );
               exception
                  when others then
                     v_sys_error := sqlstate;
               end;

               if v_sys_error <> '' then
                  exit CONTROL_ERROR;

               end if;

               v_fvp_id_notacredito := v_fvp_id;

            end;
            end if;

            -- Si hay pago borro la/s deudas
            if coalesce(v_fvp_id, 0) <> 0 then
            begin
               begin
                  -- Actualizo la tabla de vinculacion para que apunte al pago
                  update FacturaVentaCobranza
                     set fvd_id = null,
                         fvp_id = v_fvp_id
                     where fvd_id = v_fvd_id_notacredito;
               exception
                  when others then
                     v_sys_error := sqlstate;
               end;

               if v_sys_error <> '' then
                  exit CONTROL_ERROR;

               end if;

               begin
                  -- Actualizo la tabla de vinculacion para que apunte a la deuda
                  update FacturaVentaNotaCredito
                     set fvd_id_notacredito = null,
                         fvp_id_notacredito = v_fvp_id
                     where fvd_id_notacredito = v_fvd_id_notacredito;
               exception
                  when others then
                     v_sys_error := sqlstate;
               end;

               if v_sys_error <> '' then
                  exit CONTROL_ERROR;

               end if;

               begin
                  -- Actualizo la temporal para que apunte a la deuda
                  update FacturaVentaNotaCreditoTMP
                     set fvd_id_notacredito = null,
                         fvp_id_notacredito = v_fvp_id
                     where fvd_id_notacredito = v_fvd_id_notacredito;
               exception
                  when others then
                     v_sys_error := sqlstate;
               end;

               if v_sys_error <> '' then
                  exit CONTROL_ERROR;

               end if;

               begin
                  delete FacturaVentaDeuda

                     where fv_id = v_fv_id_notacredito
                             and fvd_id = v_fvd_id_notacredito;
               exception
                  when others then
                     v_sys_error := sqlstate;
               end;

               if v_sys_error <> '' then
                  exit CONTROL_ERROR;

               end if;

               v_fvd_id_notacredito := null;

            end;
            else
            begin
               v_fvp_id_notacredito := null;

            end;
            end if;

         end;
         end if;

    /*
		///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		//                                                                                                               //
		//                                        VINCULACION                                                            //
		//                                                                                                               //
		///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		*/
         sp_dbGetNewId('FacturaVentaNotaCredito',
                               'fvnc_id',
                               v_fvnc_id,
                               0);

         if v_sys_error <> '' then
            exit CONTROL_ERROR;

         end if;

         begin
            insert into FacturaVentaNotaCredito
              ( fvnc_id, fvnc_importe, fvd_id_factura, fvd_id_notacredito, fvp_id_factura, fvp_id_notacredito, fv_id_factura, fv_id_notacredito )
              values ( v_fvnc_id, v_fvnc_importe, v_fvd_id_factura, v_fvd_id_notacredito, v_fvp_id_factura, v_fvp_id_notacredito, v_fv_id_factura, v_fv_id_notacredito );
         exception
            when others then
               v_sys_error := sqlstate;
         end;

         if v_sys_error <> '' then
            exit CONTROL_ERROR;

         end if;

         -- Si no hay un pago actualizo la deuda
         if coalesce(v_fvp_id_factura, 0) = 0 then
         begin
            begin
               update FacturaVentaDeuda
                  set fvd_pendiente = fvd_pendiente - v_fvnc_importe
                  where fvd_id = v_fvd_id_factura;
            exception
               when others then
                  v_sys_error := sqlstate;
            end;

            if v_sys_error <> '' then
               exit CONTROL_ERROR;

            end if;

         end;
         end if;

         -- Si no hay un pago actualizo la deuda
         if coalesce(v_fvp_id_notacredito, 0) = 0 then
         begin
            begin
               update FacturaVentaDeuda
                  set fvd_pendiente = fvd_pendiente - v_fvnc_importe
                  where fvd_id = v_fvd_id_notacredito;
            exception
               when others then
                  v_sys_error := sqlstate;
            end;

            if v_sys_error <> '' then
               exit CONTROL_ERROR;

            end if;

         end;
         end if;

         fetch c_deuda into v_fvnc_importe,v_fv_id_factura,v_fv_id_notacredito,v_fvd_id_factura,v_fvd_id_notacredito,v_fvp_id_factura,v_fvp_id_notacredito;

      end;
   end loop;

   close c_deuda;

   /*Nota de credito*/
   if v_doct_id = 7 then
   begin
      v_c_fvncaplic := 'select fv_id
        from tt_FacturaVentaNotaCredito
      union
      select fv_id_factura
        from FacturaVentaNotaCredito
         where fv_id_notacredito = v_fv_id';

   end;
   else
   begin
      v_c_fvncaplic := 'select fv_id
        from tt_FacturaVentaNotaCredito
      union
      select fv_id_notacredito
        from FacturaVentaNotaCredito
         where fv_id_factura = v_fv_id';

   end;
   end if;

   open c_fvncaplic for
      v_c_fvncaplic;

   fetch c_fvncaplic into v_fv_id_aplic;

   while sqlserver_utilities.fetch_status(c_fvncaplic%found) = 0
   loop
      begin
         -- Actualizo la deuda de la factura
         sp_doc_facturaVenta_set_pendiente(v_fv_id_aplic,
                                                v_bSuccess);

         -- Si fallo al guardar
         if coalesce(v_bSuccess, 0) = 0 then
            exit CONTROL_ERROR;

         end if;

         sp_doc_facturaVentaSetCredito(v_fv_id_aplic);

         if v_sys_error <> '' then
            exit CONTROL_ERROR;

         end if;

         sp_doc_facturaVenta_set_estado(v_fv_id_aplic,
                                     p_est_id => dummyNumber,
                                     rtn => rtn);

         if v_sys_error <> '' then
            exit CONTROL_ERROR;

         end if;

         --/////////////////////////////////////////////////////////////////////////////////////////////////
         -- Validaciones
         --
         -- VTOS
         sp_auditoria_vto_check_doc_FV(v_fv_id_aplic,
                                           v_bSuccess,
                                           v_error_msg);

         -- Si el documento no es valido
         if coalesce(v_bSuccess, 0) = 0 then
            exit CONTROL_ERROR;

         end if;

         -- CREDITO
         sp_auditoria_credito_check_doc_FV(v_fv_id_aplic,
                                               v_bSuccess,
                                               v_error_msg);

         -- Si el documento no es valido
         if coalesce(v_bSuccess, 0) = 0 then
            exit CONTROL_ERROR;

         end if;

         --
         --/////////////////////////////////////////////////////////////////////////////////////////////////
         fetch c_fvncaplic into v_fv_id_aplic;

      end;
   end loop;

   close c_fvncaplic;

   -- Actualizo la deuda de la factura
   sp_doc_facturaVenta_set_pendiente(v_fv_id,
                                          v_bSuccess);

   -- Si fallo al guardar
   if coalesce(v_bSuccess, 0) = 0 then
      exit CONTROL_ERROR;

   end if;

   begin
/*
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                               //
//                                        TEMPORALES                                                             //
//                                                                                                               //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
*/
      delete FacturaVentaNotaCreditoTMP

         where fvTMP_id = p_fvTMP_id;
   exception
      when others then
         v_sys_error := sqlstate;
   end;

   if v_sys_error <> '' then
      exit CONTROL_ERROR;

   end if;

   begin
      delete FacturaVentaTMP

         where fvTMP_id = p_fvTMP_id;
   exception
      when others then
         v_sys_error := sqlstate;
   end;

   if v_sys_error <> '' then
      exit CONTROL_ERROR;

   end if;

   p_success := 1;

   return;

   <<CONTROL_ERROR>>

   v_error_msg := 'Ha ocurrido un error al grabar la aplicación de la factura de venta. sp_doc_facturaVentaSaveAplic. ' || coalesce(v_error_msg, '');

   raise exception ( -20002, v_error_msg );

   if v_transcount > 0 then
   begin
      ROLLBACK;
       v_transcount :=  v_transcount - 1;

   end;
   end if;

end;
--done