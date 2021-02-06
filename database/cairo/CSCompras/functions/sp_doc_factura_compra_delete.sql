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
-- Function: sp_doc_factura_compra_delete()

-- drop function sp_doc_factura_compra_delete(integer, integer, integer, integer);

create or replace function sp_doc_factura_compra_delete
(
 in p_fc_id integer,
 in p_emp_id integer,
 in p_us_id integer
)
 returns void as
$BODY$
declare
   v_editable integer;
   v_edit_msg varchar(255);
   v_as_id integer;
   v_st_id integer;
   v_doct_id integer;
   v_cpg_id integer;
begin
 
   if coalesce(p_fc_id, 0) = 0 then
      return;
   end if;

   drop table if exists tt_nro_serie_delete;
   create temporary table tt_nro_serie_delete
   (
      prns_id integer
   ) on commit drop;

   select * from sp_doc_factura_compra_editable_get(p_emp_id, p_fc_id, p_us_id, 0, 1) into v_editable, v_edit_msg;

   if v_editable = 0 then

      raise notice 'por aca';

      raise exception '@@ERROR_SP: %', v_edit_msg;

   end if;

   SET TRANSACTION READ WRITE;

   begin

      select as_id into v_as_id from FacturaCompra where fc_id = p_fc_id;

      update FacturaCompra set as_id = null where fc_id = p_fc_id;

      perform sp_doc_asiento_delete(v_as_id, p_emp_id, p_us_id, 1);-- No check access

      select st_id into v_st_id from FacturaCompra where fc_id = p_fc_id;

      update FacturaCompra set st_id = null where fc_id = p_fc_id;

      select doct_id into v_doct_id from FacturaCompra where fc_id = p_fc_id;

      if v_doct_id <> 8 then
         insert into tt_nro_serie_delete ( prns_id ) ( select prns_id from StockItem where st_id = v_st_id );
      end if;

      perform sp_doc_stock_delete(v_st_id, p_emp_id, p_us_id, 0, 1);-- No check access

      if v_doct_id <> 8 then
         delete from StockCache where prns_id in ( select prns_id from tt_nro_serie_delete );

         delete from ProductoNumeroSerie where prns_id in ( select prns_id from tt_nro_serie_delete );

      end if;

      perform sp_doc_factura_compra_orden_pago_delete(p_fc_id, p_emp_id, p_us_id);

      select cpg_id into v_cpg_id from FacturaCompra where fc_id = p_fc_id;

      if exists ( select cpg_id
                  from CondicionPago
                  where cpg_id = v_cpg_id
                    and cpg_tipo in ( 2,3 ) ) then

         delete from FacturaCompraPago where fc_id = p_fc_id;
      end if;

      delete from FacturaCompraDeuda where fc_id = p_fc_id;

      perform sp_doc_factura_compra_set_credito(p_fc_id, 1);

      delete from FacturaCompraItem where fc_id = p_fc_id;
      delete from FacturaCompraOtro where fc_id = p_fc_id;
      delete from FacturaCompraPercepcion where fc_id = p_fc_id;
      delete from FacturaCompraLegajo where fc_id = p_fc_id;
      delete from FacturaCompra where fc_id = p_fc_id;

   exception
      when others then
         raise exception 'Ha ocurrido un error al borrar la factura de compra. sp_doc_factura_compra_delete.',
                          sqlstate, sqlerrm;
   end;

   return;

end;
$BODY$
 language plpgsql volatile
                  COST 100;
alter function sp_doc_factura_compra_delete(integer, integer, integer)
 owner to postgres;