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
create or replace function sp_doc_factura_venta_prepare_kit
(
  in p_fv_id integer
)
  returns void as
$BODY$
begin

   if exists(
        select 1
        from FacturaVentaItem fvi
        join Producto p
          on fvi.pr_id = p.pr_id
        where fvi.fv_id = p_fv_id
          and p.pr_llevastock <> 0
          and fvi.fvi_nostock = 0
          and p.pr_eskit <> 0) then

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

   end if;

end;
$BODY$
  language plpgsql volatile
  cost 100;
alter function sp_doc_factura_venta_prepare_kit(integer)
  owner to postgres;