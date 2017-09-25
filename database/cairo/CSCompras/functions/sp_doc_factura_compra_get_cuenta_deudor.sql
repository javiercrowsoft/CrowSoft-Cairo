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
-- Function: sp_doc_factura_compra_get_cuenta_deudor()

-- drop function sp_doc_factura_compra_get_cuenta_deudor(integer);

create or replace function sp_doc_factura_compra_get_cuenta_deudor
/*
proposito: devuelve la cuenta deudor por compras de la factura para ser utilizada en la interfaz
					      de aplicacion de documentos de Compra.
select * from sp_doc_factura_compra_get_cuenta_deudor(1);
*/
(
  in p_fc_id integer,
  out p_cue_id integer,
  out p_mon_id integer,
  out p_pago_automatico integer
)
  returns record as
$BODY$
declare
   v_cue_deudoresXcpra integer;
begin

   v_cue_deudoresXcpra := 8;

   select c.cue_id, c.mon_id, case when FacturaCompra.opg_id is not null then 1 else 0 end
     into p_cue_id, p_mon_id, p_pago_automatico
   from AsientoItem
   join FacturaCompra
    on AsientoItem.as_id = FacturaCompra.as_id
   join Cuenta c
    on AsientoItem.cue_id = c.cue_id
   where asi_haber <> 0
     and c.cuec_id = v_cue_deudoresXcpra
     and fc_id = p_fc_id
   group by fc_id,c.cue_id,c.mon_id,FacturaCompra.opg_id;

end;
$BODY$
  language plpgsql volatile
  cost 100;
alter function sp_doc_factura_compra_get_cuenta_deudor(integer)
  owner to postgres;