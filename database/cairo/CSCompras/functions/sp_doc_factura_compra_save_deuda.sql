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
-- Function: sp_doc_factura_compra_save_deuda()

-- drop function sp_doc_factura_compra_save_deuda(integer, integer, date, date, decimal, integer);

create or replace
function sp_doc_factura_compra_save_deuda
(
  in p_fc_id integer,
  in p_cpg_id integer,
  in p_fc_fecha date,
  in p_fc_fechaVto date,
  in p_fc_total decimal(18,6),
  in p_est_id integer
)
  returns void as
$BODY$
declare
   v_sys_error varchar := '';
   v_fc_id integer;
   v_cpg_id integer;
   v_fc_fecha date;
   v_fc_total decimal(18,6);
   v_fc_pendiente decimal(18,6);
   v_cpg_escontado smallint;
   v_cpg_eslibre smallint;

   v_p_fc_fechaVto date;

   c_pago_item refcursor;
   v_cpgi_dias smallint;
   v_cpgi_porcentaje decimal(18,6);
   v_fcd_id integer;
   v_fcd_fecha date;
   v_fcd_fecha2 date;
   v_fcd_pendiente decimal(18,6);
   v_importe decimal(18,6);
   v_n smallint;
   v_count_cpgi smallint;
begin

   v_p_fc_fechaVto := p_fc_fechaVto;
   v_fc_id := p_fc_id;
   v_cpg_id := p_cpg_id;
   v_fc_fecha := p_fc_fecha;
   v_fc_total := p_fc_total;

/*
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
//                                     pago en cta cte y contado                                                      //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
*/
   -- la factura no puede estar aplicada a ninguna cobranza
   -- por lo tanto lo primero que hago es borrar toda la info de deuda
   -- y volver a generarla
   --
   delete from FacturaCompraDeuda where fc_id = v_fc_id;

   select cpg_escontado,
          cpg_eslibre
     into v_cpg_escontado,
          v_cpg_eslibre
   from CondicionPago
   where cpg_id = v_cpg_id;

   if p_fc_total <> 0 and p_est_id <> 7 then

      if v_cpg_escontado <> 0 then
         open c_pago_item for select 0 cpgi_dias, 100 cpgi_porcentaje;
      else
         if v_cpg_eslibre <> 0 then
            if v_p_fc_fechaVto < p_fc_fecha then
               v_p_fc_fechaVto := dateadd('D', 1, p_fc_fecha);
            end if;
            open c_pago_item for select datediff('D', p_fc_fecha, v_p_fc_fechaVto) cpgi_dias, 100 cpgi_porcentaje;
         else
            open c_pago_item for select cpgi_dias, cpgi_porcentaje from CondicionPagoItem where cpg_id = v_cpg_id;
         end if;
      end if;

      v_n := 0;
      v_importe := 0;

      select count(*)
        into v_count_cpgi
      from CondicionPagoItem
      where cpg_id = v_cpg_id;

      loop

         fetch c_pago_item into v_cpgi_dias,v_cpgi_porcentaje;
         exit when not found;
                  
         v_fcd_fecha := dateadd('D', v_cpgi_dias, v_fc_fecha);
         v_n := v_n + 1;

         if v_n < v_count_cpgi then

            v_fcd_pendiente := v_fc_total * v_cpgi_porcentaje / 100;
            v_importe := v_importe + v_fcd_pendiente;

         else

            v_fcd_pendiente := v_fc_total - v_importe;

         end if;

         v_fcd_pendiente := round(v_fcd_pendiente, 2);

         select sp_dbGetNewId('FacturaCompraDeuda', 'fcd_id') into v_fcd_id;

         select sp_doc_get_fecha2(v_fcd_fecha, 0, null) into v_fcd_fecha2;

         insert into FacturaCompraDeuda( fcd_id, fcd_fecha, fcd_fecha2, fcd_importe, fcd_pendiente, fc_id )
         values ( v_fcd_id, v_fcd_fecha, v_fcd_fecha2, v_fcd_pendiente, v_fcd_pendiente, v_fc_id );

      end loop;

      close c_pago_item;

      select sum(fcd_pendiente)
        into v_fc_pendiente
      from FacturaCompraDeuda
      where fc_id = v_fc_id;

   else

      v_fc_pendiente := 0;

   end if;

   update FacturaCompra
      set fc_pendiente = coalesce(v_fc_pendiente, 0)
   where fc_id = v_fc_id;

end;
$BODY$
  language plpgsql volatile
  cost 100;
alter function sp_doc_factura_compra_save_deuda(integer, integer, date, date, decimal, integer)
  owner to postgres;