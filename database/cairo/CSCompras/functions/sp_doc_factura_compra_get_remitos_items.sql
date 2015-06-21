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
-- Function: sp_doc_factura_compra_get_remitos_items()

-- drop function sp_doc_factura_compra_get_remitos_items(varchar);
/*
  select * from remitocompraitem where rci_pendientefac > 0
  select * from sp_doc_factura_compra_get_remitos_items('77');--('4,6,7');
  fetch all from rtn;

*/

create or replace
function sp_doc_factura_compra_get_remitos_items
(
  in p_strIds varchar,
  out rtn refcursor
)
  returns refcursor as
$BODY$
declare
   v_timeCode timestamp with time zone;
begin

   v_timeCode := CURRENT_TIMESTAMP;

   perform sp_str_string_to_table(v_timeCode, p_strIds, ',');

   rtn := 'rtn';

   open rtn for
      select rci.rci_id,
             rc.rc_id,
             rc.rc_numero,
             rc.rc_nrodoc,
             p.pr_nombreCompra,
             p.pr_llevanroserie,
             rci.pr_id,
             case
                when prov.prov_catfiscal = 1
                  or prov.prov_catfiscal = 2
                  or prov.prov_catfiscal = 4
                  or prov.prov_catfiscal = 7
                  or prov.prov_catfiscal = 8
                  or prov.prov_catfiscal = 9
                  or prov.prov_catfiscal = 10
                  or prov.prov_catfiscal = 11 then
                   ((rci.rci_neto / rci.rci_cantidad) * (1 + tiri.ti_porcentaje / 100))
                   + (((rci.rci_neto * p.pr_porcinternoc / 100) * coalesce(tiint.ti_porcentaje, 0) / 100) / rci.rci_cantidad)

                -- No inscripto
                --
                when prov.prov_catfiscal = 3
                  or prov.prov_catfiscal = 10 then
                   ((rci.rci_neto / rci.rci_cantidad) * (1 + tiri.ti_porcentaje / 100))
                   + ((rci.rci_neto * tirni.ti_porcentaje / 100) / rci.rci_cantidad)
                   + (((rci.rci_neto * p.pr_porcinternoc / 100) * coalesce(tiint.ti_porcentaje, 0) / 100) / rci.rci_cantidad)

                -- Exentos
                else (rci.rci_neto / rci.rci_cantidad) + (((rci.rci_neto * p.pr_porcinternoc / 100)
                     * coalesce(tiint.ti_porcentaje, 0) / 100) / rci.rci_cantidad)-- Internos

             end rci_precio,
             rci.rci_cantidadaremitir,
             rci.rci_pendientefac,
             case
                when prov.prov_catfiscal = 1
                  or prov.prov_catfiscal = 2
                  or prov.prov_catfiscal = 4
                  or prov.prov_catfiscal = 7
                  or prov.prov_catfiscal = 8
                  or prov.prov_catfiscal = 9
                  or prov.prov_catfiscal = 10
                  or prov.prov_catfiscal = 11 then
                   rci.rci_pendientefac * ((rci.rci_neto / rci.rci_cantidad) * (1 + tiri.ti_porcentaje / 100))
                   + rci.rci_pendientefac * (((rci.rci_neto * p.pr_porcinternoc / 100) * coalesce(tiint.ti_porcentaje, 0) / 100) / rci.rci_cantidad)

                -- No inscripto
                --
                when prov.prov_catfiscal = 3 then
                 rci.rci_pendientefac * ((rci.rci_neto / rci.rci_cantidad) * (1 + tiri.ti_porcentaje / 100))
                 + rci.rci_pendientefac * ((rci.rci_neto * tirni.ti_porcentaje / 100) / rci.rci_cantidad)
                 + rci.rci_pendientefac * (((rci.rci_neto * p.pr_porcinternoc / 100) * coalesce(tiint.ti_porcentaje, 0) / 100) / rci.rci_cantidad)

                -- Exentos
                else rci.rci_pendientefac * (rci.rci_neto / rci.rci_cantidad) + rci.rci_pendientefac
                     * (((rci.rci_neto * p.pr_porcinternoc / 100) * coalesce(tiint.ti_porcentaje, 0) / 100) / rci.rci_cantidad)

             end rci_importe,
             rci.rci_descrip,
             rci.rci_precio rci_precio2,
             rci.rci_precioLista,
             rci.rci_precioUsr,
             rci.rci_descuento,
             rci.ccos_id,
             case prov.prov_catfiscal
                 when 1  then tiri.ti_porcentaje--'Inscripto'
                 when 2  then tiri.ti_porcentaje-- FALTA VERIFICAR QUE SEA ASI --'Exento'
                 when 4  then tiri.ti_porcentaje--'Consumidor Final'
                 when 7  then tiri.ti_porcentaje--'Extranjero Iva'
                 when 8  then tiri.ti_porcentaje--'No responsable'
                 when 9  then tiri.ti_porcentaje-- FALTA VERIFICAR QUE SEA ASI --'No Responsable exento'
                 when 10 then tiri.ti_porcentaje--'No categorizado'
                 when 11 then tiri.ti_porcentaje--'InscriptoM'
                 else 0
             end rci_ivariporc,
             case prov.prov_catfiscal
                 when 3 then tirni.ti_porcentaje--'No categorizado'
                 else 0
             end rci_ivarniporc,
             tiint.ti_porcentaje fci_internosporc,
             p.pr_porcinternoc

        from RemitoCompra rc
        join RemitoCompraItem rci
          on rci.rc_id = rc.rc_id
        join TmpStringToTable
          on rc.rc_id = cast(TmpStringToTable.tmpstr2tbl_campo as integer)
        join Producto p
          on rci.pr_id = p.pr_id
        join Proveedor prov
          on rc.prov_id = prov.prov_id
        join TasaImpositiva tiri
          on p.ti_id_ivaricompra = tiri.ti_id
        left join TasaImpositiva tirni
          on p.ti_id_ivarnicompra = tirni.ti_id
        left join TasaImpositiva tiint
          on p.ti_id_internosc = tiint.ti_id

        where rci.rci_pendientefac > 0
          and tmpstr2tbl_id = v_timeCode

        order by rc.rc_nrodoc,
                 rc.rc_fecha;

end;

$BODY$
  language plpgsql volatile
  cost 100;
alter function sp_doc_factura_compra_get_remitos_items(varchar)
  owner to postgres;