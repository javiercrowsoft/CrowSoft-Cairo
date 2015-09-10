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
-- Function: sp_doc_factura_venta_get_items()

-- drop function sp_doc_factura_venta_get_items(integer);
/*
select * from sp_doc_factura_venta_get_items(1);
fetch all from rtn;
fetch all from rtn_serie;
*/
create or replace function sp_doc_factura_venta_get_items
(
  in p_fv_id integer,
  out rtn refcursor,
  out rtn_serie refcursor,
  out rtn_kit refcursor
)
  returns record as
$BODY$
declare
   v_st_id integer;
   v_pr_id integer;
begin

   rtn := 'rtn';

   select st_id
     into v_st_id
   from FacturaVenta
   where fv_id = p_fv_id;

   open rtn for
      
      select fvi.*,
             pr_nombreventa,
             pr_llevanroserie,
             pr_llevanrolote,
             pr_lotefifo,
             pr_eskit,
             pr_porcinternov,
             tri.ti_porcentaje iva_ri_porcentaje,
             trni.ti_porcentaje iva_rni_porcentaje,
             tint.ti_porcentaje internos_porcentaje,
             ccos_nombre,
             un_nombre,
             to_nombre,
             stl_codigo,
             fvi_orden as orden
      from FacturaVentaItem fvi
      join Producto pr
       on fvi.pr_id = pr.pr_id
      join Unidad un
       on pr.un_id_venta = un.un_id
      join TipoOperacion tp
       on fvi.to_id = tp.to_id
      left join TasaImpositiva tri
       on pr.ti_id_ivariventa = tri.ti_id
      left join TasaImpositiva trni
       on pr.ti_id_ivarniventa = trni.ti_id
      left join TasaImpositiva tint
       on pr.ti_id_internosv = tint.ti_id
      left join CentroCosto ccos
       on fvi.ccos_id = ccos.ccos_id
      left join StockLote stl
       on fvi.stl_id = stl.stl_id
      where fv_id = p_fv_id
        and pr_eskit = 0
      
      union
      
      select fvi.*,
             pr_nombreventa,
             ( select min(stik_llevanroserie)
               from StockItemKit
               where pr_id = fvi.pr_id
                 and st_id = v_st_id ) pr_llevanroserie,
             pr_llevanrolote,
             pr_lotefifo,
             pr_eskit,
             pr_porcinternov,
             tri.ti_porcentaje iva_ri_porcentaje,
             trni.ti_porcentaje iva_rni_porcentaje,
             tint.ti_porcentaje internos_porcentaje,
             ccos_nombre,
             un_nombre,
             to_nombre,
             stl_codigo,
             fvi_orden as orden
      from FacturaVentaItem fvi
      join Producto pr
       on fvi.pr_id = pr.pr_id
      join Unidad un
       on pr.un_id_venta = un.un_id
      join TipoOperacion tp
       on fvi.to_id = tp.to_id
      left join TasaImpositiva tri
       on pr.ti_id_ivariventa = tri.ti_id
      left join TasaImpositiva trni
       on pr.ti_id_ivarniventa = trni.ti_id
      left join TasaImpositiva tint
       on pr.ti_id_internosv = tint.ti_id
      left join CentroCosto ccos
       on fvi.ccos_id = ccos.ccos_id
      left join StockLote stl
       on fvi.stl_id = stl.stl_id
      where fv_id = p_fv_id
        and pr_eskit <> 0
      order by orden;

 --///////////////////////////////////////////////////////////////////////////////////////////////////
 --
 --  NUMEROS DE SERIE
 --
 --///////////////////////////////////////////////////////////////////////////////////////////////////

   rtn_serie := 'rtn_serie';

   open rtn_serie for
   
      select prns.pr_id,
                     p.pr_nombrecompra,
                     prns.prns_id,
                     prns.prns_codigo,
                     prns.prns_descrip,
                     prns.prns_fechavto,
                     fvi.fvi_id
      from FacturaVentaItem fvi
      join FacturaVenta fv
        on fvi.fv_id = fv.fv_id
       and fvi.fv_id = p_fv_id
      join StockItem sti
        on sti.st_id = fv.st_id
       and sti.sti_grupo = fvi.fvi_id
      join ProductoNumeroSerie prns
        on prns.prns_id = sti.prns_id
      join Producto p
        on prns.pr_id = p.pr_id
      group by prns.prns_id,prns.pr_id,
               p.pr_nombrecompra,
               prns.prns_codigo,
               prns.prns_descrip,
               prns.prns_fechavto,fvi.fvi_id
      order by fvi.fvi_id;
      
   create temporary table tt_kit_item_serie
   (
    pr_id_kit_padre     integer,
    pr_id_kit           integer,
    cantidad            decimal(18,6) not null,
    cant_kits           integer default (0) not null,
    faltante            integer default (0) not null,
    pr_id               integer not null,
    prk_id              integer not null,
    costo               decimal(18,6) default (0) not null,
    costo_x_insumos     decimal(18,6) default (0) not null,
    col_order           integer default (3) not null,
    nivel               smallint default (0) not null
   ) on commit drop;

   for v_pr_id in select pr_id from StockItemKit where st_id = v_st_id
   loop

         perform sp_stock_producto_get_kit_info(v_pr_id, 0);

         update tt_kit_item_serie
            set pr_id_kit = v_pr_id
         where pr_id_kit is null;

   end loop;

   open rtn_kit for
   
      select k.pr_id_kit pr_id,
             k.pr_id pr_id_item,
             p.pr_nombrecompra,
             p.pr_llevanroserie,
             cantidad
      from tt_kit_item_serie k
      join Producto p
        on k.pr_id = p.pr_id;

end;
$BODY$
  language plpgsql volatile
  cost 100;
alter function sp_doc_factura_venta_get_items(integer)
  owner to postgres;