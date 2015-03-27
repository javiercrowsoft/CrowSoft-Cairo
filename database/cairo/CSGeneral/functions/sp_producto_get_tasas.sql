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
-- Function: sp_producto_get_tasas()

-- drop function sp_producto_get_tasas(integer, integer, integer, varchar, integer, integer, varchar);

create or replace function sp_producto_get_tasas
/*
 select * from sp_producto_get_tasas(3);
 fetch all from rtn;
*/
(
  in p_pr_id integer,
  out rtn refcursor
)
  returns refcursor as
$BODY$
begin

    rtn := 'rtn';

    open rtn for
         select pr.ti_id_ivaricompra,
                pr.ti_id_ivarnicompra,
                tiric.ti_porcentaje as ti_ri_porc_compra,
                tirnic.ti_porcentaje as ti_rni_porc_compra,
                tiric.cue_id as cue_id_ri_compra,
                tirnic.cue_id as cue_id_rni_compra,

                pr.ti_id_ivariventa,
                pr.ti_id_ivarniventa,
                tiriv.ti_porcentaje as ti_ri_porc_venta,
                tirniv.ti_porcentaje as ti_rni_porc_venta,
                tiriv.cue_id as cue_id_ri_venta,
                tirniv.cue_id as cue_id_rni_venta,

                pr.ti_id_internosc,
                pr.ti_id_internosv,
                tiintc.ti_porcentaje as ti_int_porc_compra,
                tiintv.ti_porcentaje as ti_int_porc_venta,

                pr.pr_porcinternoc,
                pr.pr_porcinternov
         from Producto pr
         left join TasaImpositiva tiric  on pr.ti_id_ivaricompra = tiric.ti_id
         left join TasaImpositiva tirnic on pr.ti_id_ivarnicompra = tirnic.ti_id
         left join TasaImpositiva tiriv  on pr.ti_id_ivariventa = tiriv.ti_id
         left join TasaImpositiva tirniv on pr.ti_id_ivarniventa = tirniv.ti_id
         left join TasaImpositiva tiintc on pr.ti_id_internosc = tiintc.ti_id
         left join TasaImpositiva tiintv on pr.ti_id_internosv = tiintv.ti_id
         where pr.pr_id = p_pr_id;

end;
$BODY$
  language plpgsql volatile
  COST 100;
alter function sp_producto_get_tasas(integer)
  owner to postgres;