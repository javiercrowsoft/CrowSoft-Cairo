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
-- Function: sp_doc_factura_venta_asiento_save()

-- drop function sp_doc_factura_venta_asiento_save(integer, integer);

create or replace function sp_doc_factura_venta_asiento_save
(
  in p_fv_id integer,
  in p_raise_error integer default -1,
  out p_error integer,
  out p_error_msg varchar,
  out p_as_id integer
)
  returns record as
$BODY$
declare
   v_is_new integer;

   v_as_id integer;
   v_as_numero integer;
   v_as_nrodoc varchar(50);
   v_as_fecha date;
   v_as_descrip varchar(5000);
   v_as_doc_cliente varchar(5000);

   v_asi_orden smallint;
   v_asi_debe decimal(18,6);
   v_asi_haber decimal(18,6);
   v_asi_origen decimal(18,6);
   v_asi_tipo smallint;

   v_cli_id integer;
   v_doc_id_factura integer;

   v_desc1 decimal(18,6);
   v_desc2 decimal(18,6);
   v_descuento1 decimal(18,6);
   v_descuento2 decimal(18,6);

   v_doct_id integer;
   v_doc_id integer;
   v_doct_id_factura integer;
   v_doc_id_cliente integer;

   v_ta_id integer;

   v_ccos_id_cliente integer;
   v_ccos_id integer;

   v_mon_id integer;

   v_cue_id integer;

   v_to_id integer;
   v_to_count smallint;

   v_fvi_id integer;
   v_fvi_orden smallint;
   v_fvi_importe decimal(18,6);
   v_fvi_importeorigen decimal(18,6);
   v_fvi_neto decimal(18,6);

   v_fvperc_origen decimal(18,6);
   v_fvperc_importe decimal(18,6);

   v_error smallint;
   v_aux decimal(18,6);
   v_coef decimal(18,6);

   v_ordenItem smallint;

   v_ta_ultimoNro integer;
   v_ta_mascara varchar(50);

   v_creado date;
   v_modificado date;
   v_modifico integer;

   v_cfg_valor varchar(5000);
begin

   p_error := 0;

   -- si no existe chau
   --
   if not exists ( select fv_id
                   from FacturaVenta
                   where fv_id = p_fv_id
                     and est_id <> 7 ) then
      return;
   end if;

   select fv.as_id,
          fv.cli_id,
          fv.doc_id,
          fv.fv_descuento1,
          fv.fv_descuento2,
          case
             when cpg.cpg_asientoXVto <> 0 then fv.fv_fechaVto
             else fv.fv_fechaiva
          end
     into v_as_id,
          v_cli_id,
          v_doc_id_factura,
          v_desc1,
          v_desc2,
          v_as_fecha
   from FacturaVenta fv
   join CondicionPago cpg
     on fv.cpg_id = cpg.cpg_id
   where fv.fv_id = p_fv_id;

   v_as_id := coalesce(v_as_id, 0);

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
          FacturaVenta.doct_id,
          Documento.doc_id,
          Documento.mon_id,
          ccos_id,
          fv_nrodoc || ' ' || cli_nombre
   into v_doc_id,
        v_doct_id_factura,
        v_doc_id_cliente,
        v_mon_id,
        v_ccos_id_cliente,
        v_as_doc_cliente
   from FacturaVenta
   join Documento
     on FacturaVenta.doc_id = Documento.doc_id
   join Cliente
     on FacturaVenta.cli_id = Cliente.cli_id
   where fv_id = p_fv_id;

   -- obtengo el as_nrodoc
   --
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
                 fv_descrip,
                 v_as_fecha,
                 v_as_doc_cliente,
                 v_doc_id,
                 v_doct_id,
                 v_doct_id_factura,
                 v_doc_id_cliente,
                 p_fv_id,
                 modifico
          from FacturaVenta
          where fv_id = p_fv_id );

/*
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
//                                        update                                                                      //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
*/
   else

      v_is_new := 0;

      select fv_descrip,
             modifico,
             modificado
        into v_as_descrip,
             v_modifico,
             v_modificado
      from FacturaVenta
      where fv_id = p_fv_id;

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
             doct_id_cliente = v_doct_id_factura,
             doc_id_cliente = v_doc_id_cliente,
             id_cliente = p_fv_id,
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

   select count(distinct to_id)
     into v_to_count
   from FacturaVentaItem
   where fv_id = p_fv_id;

   if v_doct_id_factura = 1 /* Factura */ or v_doct_id_factura = 9 /* Nota de Debito */then

      select count(distinct to_id)
        into v_ordenItem
      from FacturaVentaItem
      where fv_id = p_fv_id;

      if v_desc1 <> 0 or v_desc2 <> 0 then
         v_asi_orden := v_ordenItem + 2;
      else
         v_asi_orden := v_ordenItem + 1;
      end if;

   else

      if v_doct_id_factura = 7 /* Nota de Credito */ then
         v_asi_orden := 1;
      end if;

   end if;


   for v_fvi_neto,v_fvi_importe,v_fvi_importeorigen,v_cue_id,v_ccos_id in
        select sum(fvi.fvi_neto),
               sum(fvi.fvi_importe),
               sum(fvi.fvi_importeorigen),
               coalesce(ccueg.cue_id, cueg.cue_id),
               fvi.ccos_id
        from FacturaVentaItem fvi
        join Producto p
          on fvi.pr_id = p.pr_id
        join CuentaGrupo cueg
          on p.cueg_id_venta = cueg.cueg_id
        left join ClienteCuentaGrupo ccueg
          on cueg.cueg_id = ccueg.cueg_id and ccueg.cli_id = v_cli_id
        where fvi.fv_id = p_fv_id
        group by coalesce(ccueg.cue_id, cueg.cue_id),fvi.ccos_id
   loop

      if v_doct_id_factura = 1 /* Factura */ or v_doct_id_factura = 9 /* Nota de Debito */ then

         v_asi_debe := 0;
         v_asi_haber := v_fvi_neto;

      else

         if v_doct_id_factura = 7 /* Nota de Credito */ then

            v_asi_debe := v_fvi_neto;
            v_asi_haber := 0;

         end if;

      end if;

      if v_fvi_importeorigen <> 0 then

         v_asi_origen := v_fvi_neto / (v_fvi_importe / v_fvi_importeorigen);

      else

         v_asi_origen := 0;

      end if;

      perform sp_doc_asiento_save_item(
                            v_is_new,
                            0,
                            v_as_id,
                            v_asi_orden,
                            v_asi_debe,
                            v_asi_haber,
                            v_asi_origen,
                            0,
                            v_mon_id,
                            v_cue_id,
                            v_ccos_id,
                            null);

      v_asi_orden := v_asi_orden + 1;

   end loop;

/*
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
//                                        percepciones                                                                //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
*/

   v_asi_debe := 0;

   for v_asi_haber,v_asi_origen,v_cue_id,v_ccos_id in
        select sum(fvperc.fvperc_importe),
               sum(fvperc.fvperc_origen),
               pt.cue_id,
               fvperc.ccos_id
        from FacturaVentaPercepcion fvperc
        join Percepcion p
          on fvperc.perc_id = p.perc_id
        join PercepcionTipo pt
          on p.perct_id = pt.perct_id
        where fvperc.fv_id = p_fv_id
        group by pt.cue_id,fvperc.ccos_id
   loop

      if v_doct_id_factura = 7 /* Nota de Credito */ then

         v_asi_debe := v_asi_haber;
         v_asi_haber := 0;

      end if;

      perform sp_doc_asiento_save_item(
                            v_is_new,
                            0,
                            v_as_id,
                            v_asi_orden,
                            v_asi_debe,
                            v_asi_haber,
                            v_asi_origen,
                            0,
                            v_mon_id,
                            v_cue_id,
                            v_ccos_id,
                            null);

      v_asi_orden := v_asi_orden + 1;

   end loop;


/*
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
//                                        iva                                                                         //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
*/

   perform sp_doc_factura_venta_asiento_save_iva(
                              p_fv_id,
                              v_as_id,
                              1,
                              v_mon_id,
                              v_doct_id_factura,
                              v_ccos_id,
                              v_desc1,
                              v_desc2);

   perform sp_doc_factura_venta_asiento_save_iva(
                              p_fv_id,
                              v_as_id,
                              0,
                              v_mon_id,
                              v_doct_id_factura,
                              v_ccos_id,
                              v_desc1,
                              v_desc2);

/*
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
//                                        internos                                                                    //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
*/

   perform sp_doc_factura_venta_asiento_save_interno(
                                  p_fv_id,
                                  v_as_id,
                                  v_mon_id,
                                  v_doct_id_factura,
                                  v_ccos_id,
                                  v_desc1,
                                  v_desc2);

   v_descuento2 := 0;
   v_descuento1 := 0;


   for v_fvi_neto,v_fvi_importe,v_fvi_importeorigen,v_to_id in
        select sum(fvi_neto),
               sum(fvi_importe),
               sum(fvi_importeorigen),
               to_id
        from FacturaVentaItem
        where fv_id = p_fv_id
        group by to_id
   loop

      select * from sp_doc_get_cue_id
                    (
                     v_cli_id,
                     v_doc_id_factura,
                     v_to_id
                    )
               into
                     v_cue_id,
                     v_mon_id;

      if v_doct_id_factura = 7 /* Nota de Credito */ then

         v_asi_debe := 0;
         v_asi_haber := v_fvi_importe;

         -- las percepciones van con la cuenta asociada al tipo de operacion 1 (comercial)
         --
         if v_to_id = 1 /* Comercial */ or v_to_count = 1 then

            -- sumo percepciones
            --
            select sum(fvperc_importe),
                   sum(fvperc_origen)
              into v_fvperc_importe,
                   v_fvperc_origen
            from FacturaVentaPercepcion
            where fv_id = p_fv_id;

         else

            -- otro tipo de operaciones
            --
            v_fvperc_importe := 0;
            v_fvperc_origen := 0;

         end if;

         v_asi_haber := v_asi_haber + coalesce(v_fvperc_importe, 0);
         v_fvi_importeorigen := v_fvi_importeorigen + coalesce(v_fvperc_origen, 0);

         if v_fvi_importeorigen <> 0 then
            v_coef := v_asi_haber / v_fvi_importeorigen;
         else
            v_coef := 0;
         end if;

         v_asi_haber := v_asi_haber - (v_asi_haber * v_desc1 / 100);
         v_asi_haber := v_asi_haber - (v_asi_haber * v_desc2 / 100);
         v_descuento2 := v_descuento2 + (v_fvi_neto - v_fvi_neto * v_desc1 / 100) * v_desc2 / 100;
         v_descuento1 := v_descuento1 + v_fvi_neto * v_desc1 / 100;

         select max(asi_orden) + 1
           into v_asi_orden
         from AsientoItem
         where as_id = v_as_id;

      else

         if v_doct_id_factura = 1 /* Factura */ or v_doct_id_factura = 9 /* Nota de Debito */ then

            v_asi_debe := v_fvi_importe;

            -- las percepciones van con la cuenta asociada al tipo de operacion 1 (comercial)
            --
            if v_to_id = 1 /* Comercial */ or v_to_count = 1 then

               -- sumo percepciones
               --
               select sum(fvperc_importe),
                      sum(fvperc_origen)
                 into v_fvperc_importe,
                      v_fvperc_origen
               from FacturaVentaPercepcion
               where fv_id = p_fv_id;

            else

               -- otros tipos de operaciones
               --
               v_fvperc_importe := 0;
               v_fvperc_origen := 0;

            end if;

            v_asi_debe := v_asi_debe + coalesce(v_fvperc_importe, 0);
            v_fvi_importeorigen := v_fvi_importeorigen + coalesce(v_fvperc_origen, 0);

            if v_fvi_importeorigen <> 0 then
               v_coef := v_asi_debe / v_fvi_importeorigen;
            else
               v_coef := 0;
            end if;

            v_asi_debe := v_asi_debe - (v_asi_debe * v_desc1 / 100);
            v_asi_debe := v_asi_debe - (v_asi_debe * v_desc2 / 100);
            v_descuento2 := v_descuento2 + (v_fvi_neto - v_fvi_neto * v_desc1 / 100) * v_desc2 / 100;
            v_descuento1 := v_descuento1 + v_fvi_neto * v_desc1 / 100;
            v_asi_haber := 0;
            v_asi_orden := 1;

         end if;

      end if;

      if v_fvi_importeorigen <> 0 then

         v_fvi_importeorigen := v_fvi_importeorigen - (v_fvi_importeorigen * v_desc1 / 100);
         v_fvi_importeorigen := v_fvi_importeorigen - (v_fvi_importeorigen * v_desc2 / 100);
         v_asi_origen := v_fvi_importeorigen;

      else

         v_asi_origen := 0;

      end if;

      if v_to_count = 1 then

         v_asi_tipo := 1;-- Cta deudor

      else

         select to_generadeuda
           into v_asi_tipo
         from TipoOperacion
         where to_id = v_to_id;

         if v_asi_tipo <> 0 then

            v_asi_tipo := 1; -- Cta deudor

         end if;

      end if;

      perform sp_doc_asiento_save_item(
                            v_is_new,
                            0,
                            v_as_id,
                            v_asi_orden,
                            v_asi_debe,
                            v_asi_haber,
                            v_asi_origen,
                            v_asi_tipo,-- TO

                            v_mon_id,
                            v_cue_id,
                            v_ccos_id_cliente,
                            null);

      v_asi_orden := v_asi_orden + 1;

   end loop;

/*
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
//                                descuentos globales                                                                 //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
*/
   if v_desc1 <> 0 or v_desc2 <> 0 then

      select sp_cfg_getValor('Ventas-General', 'Cuenta Descuento Global') into v_cfg_valor;

      v_cue_id := to_number(v_cfg_valor);

      if v_doct_id_factura = 7 /* Nota de Credito */ then

         select max(asi_orden) + 1
           into v_asi_orden
         from AsientoItem
         where as_id = v_as_id;

      else

         if v_doct_id_factura = 1 /* Factura */ or v_doct_id_factura = 9 /* Nota de Debito */ then

            v_asi_orden := 2;

         end if;

      end if;

      if v_desc1 <> 0 then

         if v_doct_id_factura = 7 /* Nota de Credito */ then

            v_asi_debe := 0;
            v_asi_haber := v_descuento1;

         else

            if v_doct_id_factura = 1 /* Factura */ or v_doct_id_factura = 9 /* Nota de Debito */ then

               v_asi_debe := v_descuento1;
               v_asi_haber := 0;

            end if;

         end if;

         if v_coef <> 0 then

            v_asi_origen := v_descuento1 / v_coef;

         else

            v_asi_origen := 0;

         end if;

      end if;

      if v_desc2 <> 0 then

         select max(asi_orden) + 1
           into v_asi_orden
         from AsientoItem
         where as_id = v_as_id;

         if v_doct_id_factura = 7 /* Nota de Credito */ then

            v_asi_debe := 0;
            v_asi_haber := v_asi_haber + v_descuento2;

         else

            if v_doct_id_factura = 1 /* Factura */ or v_doct_id_factura = 9 /* Nota de Debito */ then

               v_asi_debe := v_asi_debe + v_descuento2;
               v_asi_haber := 0;

            end if;

         end if;

         if v_coef <> 0 then

            v_asi_origen := v_asi_origen + v_descuento2 / v_coef;

         else

            v_asi_origen := 0;

         end if;

      end if;

      perform sp_doc_asiento_save_item(
                            v_is_new,
                            0,
                            v_as_id,
                            v_asi_orden,
                            v_asi_debe,
                            v_asi_haber,
                            v_asi_origen,
                            0,
                            v_mon_id,
                            v_cue_id,
                            v_ccos_id_cliente,
                            null);

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
//                                vinculo la factura con su asiento                                                   //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
*/
   update FacturaVenta
      set as_id = v_as_id,
          fv_grabarasiento = 0
   where fv_id = p_fv_id;

   p_error := 0;
   p_as_id := v_as_id;

exception
   when others then

      if p_raise_error <> 0 then

         raise exception 'Ha ocurrido un error al grabar la factura de venta. sp_doc_factura_venta_asiento_save. %. %.',
                         sqlstate, sqlerrm;
      else

         p_error := -1;
         p_error_msg := sqlstate || ';' || sqlerrm || ';';

      end if;

end;
$BODY$
  language plpgsql volatile
  cost 100;
alter function sp_doc_factura_venta_asiento_save(integer, integer)
  owner to postgres;