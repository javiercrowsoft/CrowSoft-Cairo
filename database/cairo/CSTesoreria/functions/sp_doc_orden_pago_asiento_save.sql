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
-- Function: sp_doc_orden_pago_asiento_save()

-- drop function sp_doc_orden_pago_asiento_save(integer, integer);

create or replace
function sp_doc_orden_pago_asiento_save
(
  in p_opg_id integer,
  in p_raise_error integer default -1,
  in p_fc_id integer default null,
  out p_error integer,
  out p_error_msg varchar
)
  returns record as
$BODY$
declare
   v_is_new integer;
   
   v_as_id integer;
   v_as_numero integer;
   v_as_nrodoc varchar(50);
   v_as_fecha timestamp with time zone;
   v_as_descrip varchar(5000);
   v_as_doc_cliente varchar(5000);
   v_as_id_factura integer;
   v_as_total decimal(18,6);

   v_asi_id integer;
   v_asi_orden smallint;
   v_asi_debe decimal(18,6);
   v_asi_haber decimal(18,6);
   v_asi_origen decimal(18,6);
   v_asi_descrip varchar(5000);
   
   v_prov_id integer;
   v_doc_id_OrdenPago integer;

   v_doct_id integer;
   v_doc_id integer;
   v_doct_id_OrdenPago integer;
   v_doc_id_cliente integer;
   
   v_opg_fecha timestamp with time zone;

   v_ta_id integer;

   v_ccos_id_cliente integer;
   v_ccos_id integer;

   v_mon_id integer;

   v_cue_id integer;

   v_opgi_orden smallint;
   v_opgi_importe decimal(18,6);
   v_opgi_importeorigen decimal(18,6);

   v_cheq_id integer;

   v_creado timestamp with time zone;
   v_modificado timestamp with time zone;
   v_modifico integer;
   
   v_fc_id integer;
   v_doct_id_factura integer;

   v_agrupar_asiento smallint;

   v_error smallint;
   v_cfg_valor varchar(5000);

   v_ta_ultimoNro integer;
   v_ta_mascara varchar(50);

   v_cuec_id integer;

   c_items refcursor;
begin

   p_error := 0;

   -- si no existe chau
   --
   if not exists ( select opg_id
                   from OrdenPago
                   where opg_id = p_opg_id
                     and est_id <> 7 ) then
      return;
   end if;

   select  as_id,
           prov_id,
           doc_id
   into  v_as_id,
         v_prov_id,
         v_doc_id_OrdenPago
   from OrdenPago
   where opg_id = p_opg_id;

   v_as_id := coalesce(v_as_id, 0);

   select sp_cfg_getValor('Tesoreria-General', 'Asiento Agrupado') into v_cfg_valor;

   v_cfg_valor := coalesce(v_cfg_valor, '0');
   v_agrupar_asiento := to_number(v_cfg_valor);

   SET TRANSACTION READ WRITE;

/*
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
//                                        insert                                                                      //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
*/

   -- obtengo el documento @doc_id
   --
   select doc_id_asiento,
          OrdenPago.doct_id,
          Documento.doc_id,
          ccos_id,
          opg_nrodoc || ' ' || prov_nombre
     into v_doc_id,
          v_doct_id_OrdenPago,
          v_doc_id_cliente,
          v_ccos_id_cliente,
          v_as_doc_cliente
   from OrdenPago
   join Documento
     on OrdenPago.doc_id = Documento.doc_id
   join Proveedor
     on OrdenPago.prov_id = Proveedor.prov_id
   where opg_id = p_opg_id;

   if v_as_id = 0 then

      v_is_new := -1;

      select sp_dbGetNewId('Asiento', 'as_id') into v_as_id;
      select sp_dbGetNewId('Asiento', 'as_numero') into v_as_numero;

      select ta_ultimonro,
             ta_mascara,
             doct_id
        into v_ta_ultimoNro,
             v_ta_mascara,
             v_doct_id
      from Documento
      join Talonario
        on Documento.ta_id = Talonario.ta_id
      where doc_id = v_doc_id;

      v_ta_ultimoNro := v_ta_ultimoNro + 1;
      v_as_nrodoc := trim(to_char(v_ta_ultimoNro));
      v_as_nrodoc := substr(v_ta_mascara, 1, length(v_ta_mascara) - length(v_as_nrodoc)) || v_as_nrodoc;

      insert into Asiento( as_id, as_numero, as_nrodoc, as_descrip, as_fecha, as_doc_cliente, doc_id, doct_id,
                           doct_id_cliente, doc_id_cliente, id_cliente, modifico )
         ( select v_as_id,
                  v_as_numero,
                  v_as_nrodoc,
                  opg_descrip,
                  opg_fecha,
                  v_as_doc_cliente,
                  v_doc_id,
                  v_doct_id,
                  v_doct_id_OrdenPago,
                  v_doc_id_cliente,
                  p_opg_id,
                  modifico
           from OrdenPago
           where opg_id = p_opg_id );

/*
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
//                                        update                                                                      //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
*/
   else

      v_is_new := 0;

      select opg_descrip,
             opg_fecha,
             modifico,
             modificado
        into v_as_descrip,
             v_as_fecha,
             v_modifico,
             v_modificado
      from OrdenPago
      where opg_id = p_opg_id;

      select doc_id,
             doct_id
        into v_doc_id,
             v_doct_id
      from Asiento
      where as_id = v_as_id;

      update Asiento
         set as_descrip = v_as_descrip,
             as_fecha = v_as_fecha,
             as_doc_cliente = v_as_doc_cliente,
             doc_id = v_doc_id,
             doct_id = v_doct_id,
             doct_id_cliente = v_doct_id_OrdenPago,
             doc_id_cliente = v_doc_id_cliente,
             id_cliente = p_opg_id,
             modifico = v_modifico,
             modificado = v_modificado
      where as_id = v_as_id;

   end if;

/*
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
//                                        items                                                                       //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
*/

   -- borro todos los items y solo hago inserts que se mucho mas simple y rapido
   --
   delete from AsientoItem where as_id = v_as_id;

   v_asi_orden := 1;

   /*
		  si me llaman sobre una OP que se esta generando, el parametro @@fc_id contiene la
    factura de compra para OPs automaticas, y me lo pasa sp_doc_orden_pagoSave.
		  cuando el que llama es sp_doc_orden_pagoAsiento[s]Save, no recibo el fc_id, asi que
    lo leo de la OP.
	  */
   if p_fc_id is not null then

      v_fc_id := p_fc_id;

   else

      select fc_id
        into v_fc_id
      from OrdenPago
      where opg_id = p_opg_id;

   end if;

   if v_fc_id is not null then

      /*
         cuando es un resumen bancario genero un item por cada concepto de la factura
         contra la cuenta de fondos para que la conciliacion bancaria sea mas facil,
			      ya que el resumen del banco viene con los importes discriminados.
			      por ejemplo cuando el banco cobra un gasto, y este lleva iva, en el resumen
         figuran dos renglones uno por el gasto y otro por el iva sobre dicho gasto.
		    */

      -- solo puede haber una cuenta
      -- pero por las dudas uso el min
      --
      select min(cue.cuec_id)
        into v_cuec_id
      from OrdenPagoItem opgi
      join Cuenta cue
        on opgi.cue_id = cue.cue_id
      where opgi.opg_id = p_opg_id
        and opgi.opgi_tipo = 2; -- efectivo

      -- necesito saber si es una nota de credito
      --
      select doct_id
        into v_doct_id_factura
      from FacturaCompra
      where fc_id = v_fc_id;

      -- solo necesito el detalle de los pagos
      -- si la cuenta es de tipo banco
      --
      if v_cuec_id = 2 /* bancos */ then

         select as_id
           into v_as_id_factura
         from FacturaCompra
         where fc_id = v_fc_id;

      end if;

      /* las ordenes de pago automaticas solo tienen efectivo */
      if v_as_id_factura is null then

         if v_agrupar_asiento = 0 then

            open c_items for
               select opgi_importe,
                      opgi_importeorigen,
                      cue_id,
                      ccos_id,
                      opgi.cheq_id,
                      opgi.opgi_descrip
               from OrdenPagoItem opgi
               where opgi.opg_id = p_opg_id
                 and opgi_tipo = 2; -- efectivo

         else

            open c_items for
               select sum(opgi_importe),
                      sum(opgi_importeorigen),
                      cue_id,
                      ccos_id,
                      opgi.cheq_id,
                      '''' opgi_descrip
               from OrdenPagoItem opgi
               where opgi.opg_id = p_opg_id
                 and opgi_tipo = 2 -- efectivo
               group by cue_id,ccos_id,opgi.cheq_id;

         end if;

      else

         select sum(asi_debe)
           into v_as_total
         from AsientoItem
         where as_id = v_as_id_factura;

         if v_agrupar_asiento = 0 then

            open c_items for
               select opgi.opgi_importe * ((asi.asi_debe + asi.asi_haber) / v_as_total),
                      opgi.opgi_importeorigen * ((asi.asi_debe + asi.asi_haber) / v_as_total),
                      opgi.cue_id,
                      opgi.ccos_id,
                      opgi.cheq_id,
                      cue.cue_nombre
               from OrdenPagoItem opgi,
                    AsientoItem asi
               join Cuenta cue
                 on asi.cue_id = cue.cue_id
               where opgi.opg_id = p_opg_id
                 and opgi.opgi_tipo = 2 -- efectivo
                 and asi.as_id = v_as_id_factura
                 and asi.asi_tipo <> 2 -- cuenta del acreedor
                 and ( ( asi.asi_debe <> 0 and v_doct_id_factura in ( 2,10 ) ) -- facturas y notas de debito
                       or ( asi.asi_haber <> 0 and v_doct_id_factura = 8 ) ); -- nota de credito

         /*
            cuando es un resumen bancario genero un item por cada concepto de la factura
	           contra la cuenta de fondos para que la conciliacion bancaria sea mas facil,
						      ya que el resumen del banco viene con los importes discriminados.

						      por ejemplo cuando el banco cobra un gasto, y este lleva iva, en el resumen
	           figuran dos renglones uno por el gasto y otro por el iva sobre dicho gasto.
					    */

         else

            open c_items for
               select sum(opgi.opgi_importe),
                      sum(opgi.opgi_importeorigen),
                      opgi.cue_id,
                      opgi.ccos_id,
                      opgi.cheq_id,
                      '''' cue_nombre
               from OrdenPagoItem opgi
               where opgi.opg_id = p_opg_id
                 and opgi_tipo = 2 -- efectivo
               group by opgi.cue_id,opgi.ccos_id,opgi.cheq_id;

         end if;

      end if;

   else

      open c_items for
         select opgi_importe,
                opgi_importeorigen,
                cue_id,
                ccos_id,
                opgi.cheq_id,
                opgi.opgi_descrip
         from OrdenPagoItem opgi
         where opgi.opg_id = p_opg_id
           and ( opgi_tipo = 2 or ( opgi_tipo = 4 and opgi_otroTipo = 2 ) ) -- efectivo y otros
      union all
         select opgi_importe,
                opgi_importeorigen,
                Chequera.cue_id,
                ccos_id,
                opgi.cheq_id,
                opgi.opgi_descrip
         from OrdenPagoItem opgi
         join Cheque
           on opgi.cheq_id = Cheque.cheq_id
         join Chequera
           on Cheque.chq_id = Chequera.chq_id
         where opgi.opg_id = p_opg_id
           and opgi_tipo = 1 -- cheques
      union all
         select opgi_importe,
                opgi_importeorigen,
                cobzi.cue_id,
                opgi.ccos_id,
                opgi.cheq_id,
                opgi.opgi_descrip
         from OrdenPagoItem opgi
         join Cheque cheq
           on opgi.cheq_id = cheq.cheq_id
         join CobranzaItem cobzi
           on opgi.cheq_id = cobzi.cheq_id
         where opgi.opg_id = p_opg_id
           and opgi_tipo = 6 -- cheques de terceros
           and cheq.mf_id is null
      union all
         select opgi_importe,
                opgi_importeorigen,
                mfi.cue_id_debe,
                opgi.ccos_id,
                opgi.cheq_id,
                opgi.opgi_descrip
         from OrdenPagoItem opgi
         join Cheque cheq
           on opgi.cheq_id = cheq.cheq_id
         join MovimientoFondoItem mfi
           on opgi.cheq_id = mfi.cheq_id
           and cheq.mf_id = mfi.mf_id
         where opgi.opg_id = p_opg_id
           and opgi_tipo = 6; -- cheques de terceros

   end if;

   loop

      fetch c_items into v_opgi_importe,v_opgi_importeorigen,v_cue_id,v_ccos_id,v_cheq_id,v_asi_descrip;
      exit when not found;

      select mon_id
        into v_mon_id
      from Cuenta
      where cue_id = v_cue_id;

      v_asi_haber := v_opgi_importe;
      v_asi_origen := v_opgi_importeorigen;

      perform sp_doc_asiento_save_item(
                            v_is_new,
                            0,
                            v_as_id,
                            v_asi_orden,
                            0,
                            v_asi_haber,
                            v_asi_origen,
                            0,
                            v_mon_id,
                            v_cue_id,
                            v_ccos_id,
                            v_cheq_id,
                            v_asi_descrip);

      v_asi_orden := v_asi_orden + 1;

   end loop;

   close c_items;

   open c_items for
      select sum(opgi_importe),
             sum(opgi_importeorigen),
             cue_id,
             ccos_id
      from OrdenPagoItem
      where opg_id = p_opg_id
        and ( opgi_tipo = 5 or ( opgi_tipo = 4 and opgi_otroTipo = 1 ) ) /* ctacte, otros, debe */
      group by cue_id, ccos_id;

/*
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
//                                        hora la cuenta del proveedor                                                //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
*/
   loop

      fetch c_items into v_opgi_importe,v_opgi_importeorigen,v_cue_id,v_ccos_id;
      exit when not found;

      select mon_id
        into v_mon_id
      from Cuenta
      where cue_id = v_cue_id;

      v_asi_debe := v_opgi_importe;
      v_asi_origen := v_opgi_importeorigen;

      perform sp_doc_asiento_save_item(
                               v_is_new,
                               0,
                               v_as_id,
                               v_asi_orden,
                               v_asi_debe,
                               0,
                               v_asi_origen,
                               0,
                               v_mon_id,
                               v_cue_id,
                               v_ccos_id,
                               null);

      v_asi_orden := v_asi_orden + 1;

   end loop;

   close c_items;

   -- Si fue una nota de credito invierto el asiento
   --
   if v_fc_id is not null then

      if v_doct_id_factura = 8 then

         for v_asi_id,v_asi_debe,v_asi_haber in
            select asi_id,
                   asi_debe,
                   asi_haber
            from AsientoItem
            where as_id = v_as_id
         loop

            if v_asi_debe <> 0 then

               update AsientoItem
                  set asi_haber = v_asi_debe,
                      asi_debe = 0
               where asi_id = v_asi_id;

            else

               update AsientoItem
                  set asi_debe = v_asi_haber,
                      asi_haber = 0
               where asi_id = v_asi_id;

            end if;

         end loop;

      end if;

   end if;

/*
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
//                                valido el asiento                                                                   //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
*/
   select * from sp_doc_asiento_validate(v_as_id) into v_error, p_error_msg;

   if v_error <> 0 then
      raise exception '%', p_error_msg;
   end if;

/*
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
//                                talonario                                                                           //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
*/

   select ta_id
     into v_ta_id
   from Documento
   where doc_id = v_doc_id;

   perform sp_talonario_set(v_ta_id, v_as_nrodoc);

/*
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
//                                vinculo la ordenpago con su asiento                                                 //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
*/
   update OrdenPago
      set as_id = v_as_id,
          opg_grabarasiento = 0
   where opg_id = p_opg_id;

   p_error := 0;

exception
   when others then

      if p_raise_error <> 0 then

         raise exception 'Ha ocurrido un error al grabar la orden de pago. sp_doc_orden_pago_asiento_save. %. %.',
                         sqlstate, sqlerrm;
      else

         p_error := -1;
         p_error_msg := sqlstate || ';' || sqlerrm || ';';

      end if;

end;
$BODY$
  language plpgsql volatile
  cost 100;
alter function sp_doc_orden_pago_asiento_save(integer, integer, integer)
  owner to postgres;