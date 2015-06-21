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
-- Function: sp_doc_factura_compra_wizard_save()

-- drop function sp_doc_factura_compra_wizard_save(integer);

create or replace
function sp_doc_factura_compra_wizard_save
(
  in p_fcTMP_id integer
)
  returns void as
$BODY$
begin

 -- Cargo las cuentas del producto y de la tasa impositiva
 --
 update FacturaCompraItemTMP

      set
           cue_id      = (select coalesce(pcg.cue_id,cg.cue_id)
                          from Producto p
                                 inner join CuentaGrupo cg
                                   on p.cueg_id_compra = cg.cueg_id
                                 inner join FacturaCompraTMP t
                                   on t.fcTMP_id = p_fcTMP_id
                                 left join ProveedorCuentaGrupo pcg
                                   on cg.cueg_id = pcg.cueg_id
                                   and t.prov_id = pcg.prov_id
                          where p.pr_id = FacturaCompraItemTMP.pr_id
                          ),

           cue_id_ivari   = (select tiri.cue_id
                             from Producto p
                                    inner join TasaImpositiva tiri
                                      on p.ti_id_ivaricompra = tiri.ti_id
                             where p.pr_id = FacturaCompraItemTMP.pr_id
                            ),

           cue_id_ivarni  = (select tirni.cue_id
                             from Producto p
                                    inner join TasaImpositiva tirni
                                      on p.ti_id_ivarnicompra = tirni.ti_id
                             where p.pr_id = FacturaCompraItemTMP.pr_id
                             )

  where fcTMP_id = p_fcTMP_id;

end;
$BODY$
  language plpgsql volatile
  cost 100;
alter function sp_doc_factura_compra_wizard_save(integer)
  owner to postgres;