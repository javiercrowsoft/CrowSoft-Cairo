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
-- Function: sp_doc_factura_venta_get_cuenta_deudor()

-- drop function sp_doc_factura_venta_get_cuenta_deudor(integer);

create or replace function sp_doc_factura_venta_get_cuenta_deudor
/*
proposito: devuelve la cuenta deudor por ventas de la factura para ser utilizada en la interfaz
					      de aplicacion de documentos de venta.
select * from sp_doc_factura_venta_get_cuenta_deudor(1);
*/
(
  in p_fv_id integer,
  out p_cue_id integer,
  out p_mon_id integer
)
  returns record as
$BODY$
declare
   v_cue_deudoresXvta integer;
begin

   v_cue_deudoresXvta := 4;

   select c.cue_id, c.mon_id
     into p_cue_id, p_mon_id
   from AsientoItem
   join FacturaVenta
    on AsientoItem.as_id = FacturaVenta.as_id
   join Cuenta c
    on AsientoItem.cue_id = c.cue_id
   where asi_debe <> 0
     and c.cuec_id = v_cue_deudoresXvta
     and fv_id = p_fv_id
   group by fv_id,c.cue_id,c.mon_id,FacturaVenta.cobz_id;

end;
$BODY$
  language plpgsql volatile
  cost 100;
alter function sp_doc_factura_venta_get_cuenta_deudor(integer)
  owner to postgres;