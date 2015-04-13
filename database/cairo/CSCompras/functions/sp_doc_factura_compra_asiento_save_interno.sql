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
-- Function: sp_doc_factura_compra_asiento_save_interno()

-- drop function sp_doc_factura_compra_asiento_save_interno(integer, integer, integer, integer, integer, decimal, decimal, integer);

create or replace function sp_doc_factura_compra_asiento_save_interno
(
  in p_fc_id integer,
  in p_as_id integer,
  in p_mon_id integer,
  in p_doct_id_factura integer,
  in p_ccos_id integer,
  in p_desc1 decimal(18, 6),
  in p_desc2 decimal(18, 6),
  in p_doc_esresumenbco integer
)
  returns void as
$BODY$
declare
   v_iva decimal(18,6);
   v_fci_importe decimal(18,6);
   v_fci_importeorigen decimal(18,6);
   v_cue_id integer;
   v_asi_debe decimal(18,6);
   v_asi_haber decimal(18,6);
   v_asi_origen decimal(18,6);
   v_fci_neto decimal(18,6);
   v_asi_orden smallint;
   v_asi_id integer;
   v_is_new integer;

   c_items refcursor;
begin

   select max(asi_orden)
     into v_asi_orden
   from AsientoItem
   where as_id = p_as_id;

   -- los resumenes bancarios no agrupan los renlgones por cuenta
   -- para ayudar a la conciliacion bancaria
   --
   if p_doc_esresumenbco <> 0 then

      open c_items for
         select fci.fci_internos,
                fci.fci_importe,
                fci.fci_importeorigen,
                ti.cue_id
         from FacturaCompraItem fci
         join Producto p
           on fci.pr_id = p.pr_id
         join TasaImpositiva ti
            on p.ti_id_internosc = ti.ti_id
         where fci.fc_id = p_fc_id;

   else

      open c_items for
         select sum(fci.fci_internos),
                sum(fci.fci_importe),
                sum(fci.fci_importeorigen),
                ti.cue_id
         from FacturaCompraItem fci
         join Producto p
           on fci.pr_id = p.pr_id
         join TasaImpositiva ti
           on p.ti_id_internosc = ti.ti_id
         where fci.fc_id = p_fc_id
         group by ti.cue_id
         having sum(fci.fci_internos) <> 0;

   end if;

   loop
      fetch c_items into v_iva,v_fci_importe,v_fci_importeorigen,v_cue_id;
      exit when c_items%notfound;

      v_asi_id := null;

      if p_doct_id_factura = 2 /* Factura */ or p_doct_id_factura = 10 /* Nota de Debito */ then

         v_asi_debe := v_iva;
         v_asi_debe := v_asi_debe - (v_asi_debe * p_desc1 / 100);
         v_asi_debe := v_asi_debe - (v_asi_debe * p_desc2 / 100);
         v_asi_haber := 0;

         select asi_id
           into v_asi_id
         from AsientoItem
         where as_id = p_as_id
           and cue_id = v_cue_id
           and asi_haber = 0
           and coalesce(ccos_id, 0) = coalesce(p_ccos_id, 0);

      else

         if p_doct_id_factura = 8 /* Nota de Credito */ then

            v_asi_debe := 0;
            v_asi_haber := v_iva;
            v_asi_haber := v_asi_haber - (v_asi_haber * p_desc1 / 100);
            v_asi_haber := v_asi_haber - (v_asi_haber * p_desc2 / 100);

            select asi_id
              into v_asi_id
            from AsientoItem
            where as_id = p_as_id
              and cue_id = v_cue_id
              and asi_debe = 0
              and coalesce(ccos_id, 0) = coalesce(p_ccos_id, 0);

         end if;

      end if;

      if v_fci_importeorigen <> 0 then

         v_fci_importeorigen := v_fci_importeorigen - (v_fci_importeorigen * p_desc1 / 100);
         v_fci_importeorigen := v_fci_importeorigen - (v_fci_importeorigen * p_desc2 / 100);
         v_asi_origen := v_iva / (v_fci_importe / v_fci_importeorigen);

      else

         v_asi_origen := 0;

      end if;

      v_asi_id := coalesce(v_asi_id, 0);

      -- en los resumenes bancarios no juntamos los importes por cuenta
      -- para facilitar la conciliacion con el banco
      --
      if p_doc_esresumenbco <> 0 then
         v_asi_id := 0;
      end if;

      if v_asi_id = 0 then

         select sp_dbGetNewId('AsientoItem', 'asi_id') into v_asi_id;

         v_asi_orden := v_asi_orden + 1;

         insert into AsientoItem( as_id, asi_id, asi_orden, asi_descrip, asi_debe, asi_haber, asi_origen, cue_id,
                                  ccos_id, mon_id )
         values ( p_as_id, v_asi_id, v_asi_orden, '', v_asi_debe, v_asi_haber, v_asi_origen, v_cue_id, p_ccos_id, p_mon_id );

      else

         update AsientoItem
            set asi_debe = asi_debe + v_asi_debe,
                asi_haber = asi_haber + v_asi_haber,
                asi_origen = asi_origen + v_asi_origen
         where asi_id = v_asi_id;

      end if;

   end loop;

   close c_items;

end;
$BODY$
  language plpgsql volatile
  cost 100;
alter function sp_doc_factura_compra_asiento_save_interno(integer, integer, integer, integer, integer, decimal, decimal, integer)
  owner to postgres;