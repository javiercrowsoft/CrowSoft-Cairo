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
-- Function: sp_doc_factura_compra_get_items()

-- drop function sp_doc_factura_compra_get_items(integer);
/*
select * from sp_doc_factura_compra_get_items(1);
fetch all from rtn;
fetch all from rtn_serie;
*/
create or replace function sp_doc_factura_compra_get_items
(
  in p_fc_id integer,
  out rtn refcursor,
  out rtn_serie refcursor
)
  returns record as
$BODY$
begin

   rtn := 'rtn';

   open rtn for
      select fci.*,
             pr_nombreCompra,
             pr_llevanroserie,
             pr_llevanrolote,
             pr_porcinternoc,
             tri.ti_porcentaje iva_ri_porcentaje,
             trni.ti_porcentaje iva_rni_porcentaje,
             tint.ti_porcentaje internos_porcentaje,
             ccos.ccos_nombre,
             un_nombre,
             to_nombre,
             stl.stl_codigo
      from FacturaCompraItem fci
       join Producto
        on fci.pr_id = Producto.pr_id
       join Unidad
        on Producto.un_id_compra = Unidad.un_id
       join TipoOperacion
        on fci.to_id = TipoOperacion.to_id
       left join TasaImpositiva tri
        on Producto.ti_id_ivaricompra = tri.ti_id
       left join TasaImpositiva trni
        on Producto.ti_id_ivarnicompra = trni.ti_id
       left join TasaImpositiva tint
        on Producto.ti_id_internosc = tint.ti_id
       left join CentroCosto ccos
        on fci.ccos_id = ccos.ccos_id
       left join StockLote stl
        on fci.stl_id = stl.stl_id
      where fci.fc_id = p_fc_id
      order by fci.fci_orden;

--///////////////////////////////////////////////////////////////////////////////////////////////////
--
--  NUMEROS DE SERIE
--
--///////////////////////////////////////////////////////////////////////////////////////////////////

   rtn_serie := 'rtn_serie';

   open rtn_serie for
      select prns.prns_id,
             prns.prns_codigo,
             prns.prns_descrip,
             prns.prns_fechavto,
             fci.fci_id
      from ProductoNumeroSerie prns
       join StockItem sti
        on prns.prns_id = sti.prns_id
       join FacturaCompraItem fci
        on sti.sti_grupo = fci.fci_id
       join FacturaCompra fc
        on fci.fc_id = fc.fc_id
      where fci.fc_id = p_fc_id and sti.st_id = fc.st_id
      GROUP by prns.prns_id,prns.prns_codigo,prns.prns_descrip,prns.prns_fechavto,fci.fci_id
      order by fci.fci_id;

end;
$BODY$
  language plpgsql volatile
  cost 100;
alter function sp_doc_factura_compra_get_items(integer)
  owner to postgres;