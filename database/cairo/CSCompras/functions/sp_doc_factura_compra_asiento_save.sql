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
-- Function: sp_doc_factura_compra_asiento_save()

-- drop function sp_doc_factura_compra_asiento_save(integer, integer);

create or replace
function sp_doc_factura_compra_asiento_save
(
  in p_fc_id integer,
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
   v_as_fecha timestamp with time zone;
   v_as_descrip varchar(5000);
   v_as_doc_cliente varchar(5000);

   v_asi_orden smallint;
   v_asi_debe decimal(18,6);
   v_asi_haber decimal(18,6);
   v_asi_origen decimal(18,6);
   v_asi_tipo smallint;

   v_prov_id integer;
   v_doc_id_factura integer;

   v_desc1 decimal(18,6);
   v_desc2 decimal(18,6);
   v_descuento1 decimal(18,6);
   v_descuento2 decimal(18,6);

   v_doct_id integer;
   v_doc_id integer;
   v_doct_id_factura integer;
   v_doc_id_cliente integer;
   v_doc_esresumenbco smallint;

   v_ta_id integer;

   v_ccos_id integer;
   v_ccos_id_cliente integer;

   v_mon_id integer;

   v_cue_id integer;

   v_to_id integer;
   v_to_count smallint;

   v_fci_id integer;
   v_fci_orden smallint;
   v_fci_importe decimal(18,6);
   v_fci_importeorigen decimal(18,6);
   v_fci_neto decimal(18,6);

   v_fcot_debe decimal(18,6);
   v_fcot_haber decimal(18,6);
   v_fcot_origen decimal(18,6);
   v_fcperc_origen decimal(18,6);
   v_fcperc_importe decimal(18,6);

   v_error smallint;
   v_aux decimal(18,6);
   v_coef decimal(18,6);

   v_orden_item smallint;

   v_ta_ultimoNro integer;
   v_ta_mascara varchar(50);

   v_creado timestamp with time zone;
   v_modificado timestamp with time zone;
   v_modifico integer;

   v_cfg_valor varchar(5000);

   c_items refcursor;
begin

   p_error := 0;

   -- si no existe chau
   --
   if not exists ( select fc_id
                   from FacturaCompra
                   where fc_id = p_fc_id
                     and est_id <> 7 ) then
      return;
   end if;

   select fc.as_id,
          fc.prov_id,
          fc.doc_id,
          fc.fc_descuento1,
          fc.fc_descuento2,
          case
             when cpg.cpg_asientoXVto <> 0 and cpg.cpg_tipo not in ( 2,3 ) then fc.fc_fechaVto
             else fc.fc_fechaiva
          end
     into v_as_id,
          v_prov_id,
          v_doc_id_factura,
          v_desc1,
          v_desc2,
          v_as_fecha
   from FacturaCompra fc
   join CondicionPago cpg
     on fc.cpg_id = cpg.cpg_id
   where fc.fc_id = p_fc_id;

   v_as_id := coalesce(v_as_id, 0);

   select doc_esresumenbco
     into v_doc_esresumenbco
   from Documento
   where doc_id = v_doc_id_factura;

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
          FacturaCompra.doct_id,
          Documento.doc_id,
          Documento.mon_id,
          ccos_id,
          fc_nrodoc || ' ' || prov_nombre
     into v_doc_id,
          v_doct_id_factura,
          v_doc_id_cliente,
          v_mon_id,
          v_ccos_id_cliente,
          v_as_doc_cliente
   from FacturaCompra
   join Documento
     on FacturaCompra.doc_id = Documento.doc_id
   join Proveedor
     on FacturaCompra.prov_id = Proveedor.prov_id
   where fc_id = p_fc_id;

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
                 fc_descrip,
                 v_as_fecha,
                 v_as_doc_cliente,
                 v_doc_id,
                 v_doct_id,
                 v_doct_id_factura,
                 v_doc_id_cliente,
                 p_fc_id,
                 modifico
          from FacturaCompra
          where fc_id = p_fc_id );

/*
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
//                                        update                                                                      //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
*/
   else

      v_is_new := 0;

      select fc_descrip,
             modifico,
             modificado
        into v_as_descrip,
             v_modifico,
             v_modificado
      from FacturaCompra
      where fc_id = p_fc_id;

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
             id_cliente = p_fc_id,
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
   from FacturaCompraItem
   where fc_id = p_fc_id;

   if v_doct_id_factura = 2 /* Factura */ or v_doct_id_factura = 10 /* Nota de Debito */ then
      v_asi_orden := 1;
   else
      if v_doct_id_factura = 8 /* Nota de Credito */ then

         v_orden_item := v_to_count;

         if v_desc1 <> 0 or v_desc2 <> 0 then
            v_asi_orden := v_orden_item + 2;
         else
            v_asi_orden := v_orden_item + 1;
         end if;

      end if;

   end if;

   -- los resumenes bancarios no agrupan los renlgones por cuenta
   -- para ayudar a la conciliacion bancaria
   --
   if v_doc_esresumenbco <> 0 then

      open c_items for
         select fci.fci_neto,
                fci.fci_importe,
                fci.fci_importeorigen,
                coalesce(pcueg.cue_id, cueg.cue_id),
                fci.ccos_id
         from FacturaCompraItem fci
         join Producto p
           on fci.pr_id = p.pr_id
         join CuentaGrupo cueg
           on p.cueg_id_compra = cueg.cueg_id
         left join ProveedorCuentaGrupo pcueg
           on cueg.cueg_id = pcueg.cueg_id and pcueg.prov_id = v_prov_id
         where fci.fc_id = p_fc_id;

   -- las facturas normales agrupan por cuenta para hacer los asientos
   -- mas breves y ahorrar espacio en el libro diario
   --
   else

      open c_items for
         select sum(fci.fci_neto),
                sum(fci.fci_importe),
                sum(fci.fci_importeorigen),
                coalesce(pcueg.cue_id, cueg.cue_id),
                fci.ccos_id
         from FacturaCompraItem fci
         join Producto p
           on fci.pr_id = p.pr_id
         join CuentaGrupo cueg
           on p.cueg_id_compra = cueg.cueg_id
         left join ProveedorCuentaGrupo pcueg
           on cueg.cueg_id = pcueg.cueg_id and pcueg.prov_id = v_prov_id
         where fci.fc_id = p_fc_id
         group by coalesce(pcueg.cue_id, cueg.cue_id),fci.ccos_id;

   end if;

   loop

      fetch c_items into v_fci_neto,v_fci_importe,v_fci_importeorigen,v_cue_id,v_ccos_id;
      exit when not found;

      if v_doct_id_factura = 2 /* Factura */ or v_doct_id_factura = 10 /* Nota de Debito */ then

         v_asi_debe := v_fci_neto;
         v_asi_haber := 0;

      else

         if v_doct_id_factura = 8 /* Nota de Credito */ then

            v_asi_debe := 0;
            v_asi_haber := v_fci_neto;

         end if;

      end if;

      if v_fci_importeorigen <> 0 then
         v_asi_origen := v_fci_neto / (v_fci_importe / v_fci_importeorigen);
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

   close c_items;

   -- los resumenes bancarios no agrupan los renlgones por cuenta
   -- para ayudar a la conciliacion bancaria
   --
   if v_doc_esresumenbco <> 0 then

      open c_items for
         select fcot_debe,
                fcot_haber,
                fcot_origen,
                cue_id,
                ccos_id
      from FacturaCompraOtro fcot
      where fc_id = p_fc_id;

   else

      open c_items for
         select sum(fcot_debe),
                sum(fcot_haber),
                sum(fcot_origen),
                cue_id,
                ccos_id
         from FacturaCompraOtro fcot
         where fc_id = p_fc_id
         group by cue_id,ccos_id;

   end if;

   loop

      fetch c_items into v_asi_debe,v_asi_haber,v_asi_origen,v_cue_id,v_ccos_id;
      exit when not found;

      if v_doct_id_factura = 8 /* Nota de Credito */ then

         v_aux := v_asi_debe;
         v_asi_debe := v_asi_haber;
         v_asi_haber := v_aux;

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

   close c_items;

/*
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
//                                        percepciones                                                                //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
*/

   -- los resumenes bancarios no agrupan los renlgones por cuenta
   -- para ayudar a la conciliacion bancaria
   --
   if v_doc_esresumenbco <> 0 then

      open c_items for
         select fcperc.fcperc_importe,
                fcperc.fcperc_origen,
                pt.cue_id,
                fcperc.ccos_id
         from FacturaCompraPercepcion fcperc
         join Percepcion p
           on fcperc.perc_id = p.perc_id
         join PercepcionTipo pt
           on p.perct_id = pt.perct_id
         where fcperc.fc_id = p_fc_id;

   else

      open c_items for
         select sum(fcperc.fcperc_importe),
                sum(fcperc.fcperc_origen),
                pt.cue_id,
                fcperc.ccos_id
         from FacturaCompraPercepcion fcperc
         join Percepcion p
           on fcperc.perc_id = p.perc_id
         join PercepcionTipo pt
           on p.perct_id = pt.perct_id
         where fcperc.fc_id = p_fc_id
         group by pt.cue_id,fcperc.ccos_id;

   end if;

   v_asi_haber := 0;

   loop

      fetch c_items into v_asi_debe,v_asi_origen,v_cue_id,v_ccos_id;
      exit when not found;

      if v_doct_id_factura = 8 /* Nota de Credito */ then

         v_asi_haber := v_asi_debe;
         v_asi_debe := 0;

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

   close c_items;

/*
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
//                                        iva                                                                         //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
*/
   perform sp_doc_factura_compra_asiento_save_iva(
                                    p_fc_id,
                                    v_as_id,
                                    1,
                                    v_mon_id,
                                    v_doct_id_factura,
                                    v_ccos_id,
                                    v_desc1,
                                    v_desc2,
                                    v_doc_esresumenbco);

   perform sp_doc_factura_compra_asiento_save_iva(
                                    p_fc_id,
                                    v_as_id,
                                    0,
                                    v_mon_id,
                                    v_doct_id_factura,
                                    v_ccos_id,
                                    v_desc1,
                                    v_desc2,
                                    v_doc_esresumenbco);

/*
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
//                                        internos                                                                    //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
*/
   perform sp_doc_factura_compra_asiento_save_interno(
                                    p_fc_id,
                                    v_as_id,
                                    v_mon_id,
                                    v_doct_id_factura,
                                    v_ccos_id,
                                    v_desc1,
                                    v_desc2,
                                    v_doc_esresumenbco);

/*
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
//                                        ahora la cuenta del proveedor                                               //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
*/

   v_descuento2 := 0;
   v_descuento1 := 0;

   open c_items for
      select sum(fci_neto),
             sum(fci_importe),
             sum(fci_importeorigen),
             to_id
      from FacturaCompraItem
      where fc_id = p_fc_id
      group by to_id;

   loop

      fetch c_items into v_fci_neto,v_fci_importe,v_fci_importeorigen,v_to_id;
      exit when not found;

      select * from sp_doc_get_cue_id
                    (
                     v_prov_id,
                     v_doc_id_factura,
                     v_to_id
                    )
               into
                     v_cue_id,
                     v_mon_id;

      if v_doct_id_factura = 8 /* Nota de Credito */ then

         v_asi_debe := v_fci_importe;

         -- otros y percepciones van con la cuenta asociada al tipo de operacion 1 (comercial)
         --
         if v_to_id = 1 /* Comercial */ or v_to_count = 1 then

            -- sumo otros
            --
            select sum(fcot_haber),
                   sum(fcot_debe),
                   sum(fcot_origen)
              into v_fcot_haber,
                   v_fcot_debe,
                   v_fcot_origen
            from FacturaCompraOtro
            where fc_id = p_fc_id;

            v_aux := v_fcot_debe;
            v_fcot_debe := v_fcot_haber;
            v_fcot_haber := v_aux;

            -- sumo percepciones
            --
            select sum(fcperc_importe),
                   sum(fcperc_origen)
              into v_fcperc_importe,
                   v_fcperc_origen
            from FacturaCompraPercepcion
            where fc_id = p_fc_id;

         else

            -- otros tipos de operaciones
            --
            v_fcot_debe := 0;
            v_fcot_haber := 0;
            v_fcot_origen := 0;
            v_fcperc_importe := 0;
            v_fcperc_origen := 0;

         end if;

         v_asi_debe := v_asi_debe + coalesce(v_fcot_haber, 0) - coalesce(v_fcot_debe, 0) + coalesce(v_fcperc_importe, 0);
         v_fci_importeorigen := v_fci_importeorigen + coalesce(v_fcot_origen, 0) + coalesce(v_fcperc_origen, 0);

         if v_fci_importeorigen <> 0 then
            v_coef := v_asi_debe / v_fci_importeorigen;
         else
            v_coef := 0;
         end if;

         v_asi_debe := v_asi_debe - (v_asi_debe * v_desc1 / 100);
         v_asi_debe := v_asi_debe - (v_asi_debe * v_desc2 / 100);
         v_descuento2 := v_descuento2 + (v_fci_neto - v_fci_neto * v_desc1 / 100) * v_desc2 / 100;
         v_descuento1 := v_descuento1 + v_fci_neto * v_desc1 / 100;
         v_asi_haber := 0;
         v_asi_orden := 1;

      else

         if v_doct_id_factura = 2 /* Factura */ or v_doct_id_factura = 10 /* Nota de Debito */ then

            v_asi_debe := 0;
            v_asi_haber := v_fci_importe;

            -- otros y percepciones van con la cuenta asociada al tipo de operacion 1 (comercial)
            --
            if v_to_id = 1 /* Comercial */ or v_to_count = 1 then

               -- sumo otros
               --
               select sum(fcot_debe),
                      sum(fcot_haber),
                      sum(fcot_origen)
                 into v_fcot_debe,
                      v_fcot_haber,
                      v_fcot_origen
               from FacturaCompraOtro
               where fc_id = p_fc_id;

               -- sumo percepciones
               --
               select sum(fcperc_importe),
                      sum(fcperc_origen)
                 into v_fcperc_importe,
                      v_fcperc_origen
               from FacturaCompraPercepcion
               where fc_id = p_fc_id;

            else

               -- otros tipos de operaciones
               --
               v_fcot_debe := 0;
               v_fcot_haber := 0;
               v_fcot_origen := 0;
               v_fcperc_importe := 0;
               v_fcperc_origen := 0;

            end if;

            v_asi_haber := v_asi_haber + coalesce(v_fcot_debe, 0) - coalesce(v_fcot_haber, 0) + coalesce(v_fcperc_importe, 0);
            v_fci_importeorigen := v_fci_importeorigen + coalesce(v_fcot_origen, 0) + coalesce(v_fcperc_origen, 0);

            if v_fci_importeorigen <> 0 then
               v_coef := v_asi_haber / v_fci_importeorigen;
            else
               v_coef := 0;
            end if;

            v_asi_haber := v_asi_haber - (v_asi_haber * v_desc1 / 100);
            v_asi_haber := v_asi_haber - (v_asi_haber * v_desc2 / 100);
            v_descuento2 := v_descuento2 + (v_fci_neto - v_fci_neto * v_desc1 / 100) * v_desc2 / 100;
            v_descuento1 := v_descuento1 + v_fci_neto * v_desc1 / 100;

            select max(asi_orden) + 1
              into v_asi_orden
            from AsientoItem
            where as_id = v_as_id;

         end if;

      end if;

      if v_fci_importeorigen <> 0 then

         v_fci_importeorigen := v_fci_importeorigen - (v_fci_importeorigen * v_desc1 / 100);
         v_fci_importeorigen := v_fci_importeorigen - (v_fci_importeorigen * v_desc2 / 100);
         v_asi_origen := v_fci_importeorigen;

      else

         v_asi_origen := 0;

      end if;

      if v_to_count = 1 then

         v_asi_tipo := 2;-- Cta acreedor

      else

         select to_generadeuda
           into v_asi_tipo
         from TipoOperacion
         where to_id = v_to_id;

         if v_asi_tipo <> 0 or v_to_count = 1 then
            v_asi_tipo := 2;-- Cta acreedor
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
                            v_asi_tipo,
                            v_mon_id,
                            v_cue_id,
                            v_ccos_id_cliente,
                            null);

      v_asi_orden := v_asi_orden + 1;

   end loop;

   close c_items;

/*
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
//                                descuentos globales                                                                 //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
*/
   if v_desc1 <> 0 or v_desc2 <> 0 then

      select sp_cfg_getValor('Compras-General', 'Cuenta Descuento Global') into v_cfg_valor;

      v_cue_id := to_number(v_cfg_valor);

      if v_doct_id_factura = 8 /* Nota de Credito */ then

         v_asi_orden := 2;

      else

         if v_doct_id_factura = 2 /* Factura */ or v_doct_id_factura = 10 /* Nota de Debito */ then

            select max(asi_orden) + 1
              into v_asi_orden
            from AsientoItem
            where as_id = v_as_id;

         end if;

      end if;

      if v_desc1 <> 0 then

         if v_doct_id_factura = 8 /* Nota de Credito */ then

            v_asi_debe := v_descuento1;
            v_asi_haber := 0;

         else

            if v_doct_id_factura = 2 /* Factura */ or v_doct_id_factura = 10 /* Nota de Debito */ then

               v_asi_debe := 0;
               v_asi_haber := v_descuento1;

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

         if v_doct_id_factura = 8 /* Nota de Credito */ then

            v_asi_debe := v_asi_debe + v_descuento2;
            v_asi_haber := 0;

         else

            if v_doct_id_factura = 2 /* Factura */ or v_doct_id_factura = 10 /* Nota de Debito */ then

               v_asi_debe := 0;
               v_asi_haber := v_asi_haber + v_descuento2;

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
   update FacturaCompra
      set as_id = v_as_id,
          fc_grabarasiento = 0
   where fc_id = p_fc_id;

   p_error := 0;
   p_as_id := v_as_id;

exception
   when others then

      if p_raise_error <> 0 then

         raise exception 'Ha ocurrido un error al grabar la factura de Compra. sp_doc_factura_compra_asiento_save. %. %.',
                         sqlstate, sqlerrm;
      else

         p_error := -1;
         p_error_msg := sqlstate || ';' || sqlerrm || ';';

      end if;

end;
$BODY$
  language plpgsql volatile
  cost 100;
alter function sp_doc_factura_compra_asiento_save(integer, integer)
  owner to postgres;