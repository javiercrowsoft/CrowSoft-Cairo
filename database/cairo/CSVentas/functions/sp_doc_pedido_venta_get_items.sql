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
-- Function: sp_doc_pedido_venta_get_items()

-- drop function sp_doc_pedido_venta_get_items(integer);
/*
select * from sp_doc_pedido_venta_get_items(1);
fetch all from rtn;
fetch all from rtn_serie;
*/
create or replace function sp_doc_pedido_venta_get_items
(
  in p_pv_id integer,
  out rtn refcursor
)
  returns refcursor as
$BODY$
begin

   rtn := 'rtn';

   open rtn for
      select PedidoVentaItem.*,
             pr_nombreventa,
             tri.ti_porcentaje iva_ri_porcentaje,
             trni.ti_porcentaje iva_rni_porcentaje,
             ccos.ccos_nombre,
             un_nombre
      from PedidoVentaItem
      join Producto
        on PedidoVentaItem.pr_id = Producto.pr_id
      join Unidad
        on Producto.un_id_venta = Unidad.un_id
      left join TasaImpositiva tri
        on Producto.ti_id_ivariventa = tri.ti_id
      left join TasaImpositiva trni
        on Producto.ti_id_ivarniventa = trni.ti_id
      left join CentroCosto ccos
        on PedidoVentaItem.ccos_id = ccos.ccos_id
      where pv_id = p_pv_id
      order by pvi_orden;

end;
$BODY$
  language plpgsql volatile
  cost 100;
alter function sp_doc_pedido_venta_get_items(integer)
  owner to postgres;