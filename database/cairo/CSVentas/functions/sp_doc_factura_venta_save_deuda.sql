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
-- Function: sp_doc_factura_venta_save_deuda()

-- drop function sp_doc_factura_venta_save_deuda(integer, integer, date, date, decimal, integer);

create or replace function sp_doc_factura_venta_save_deuda
(
  in p_fv_id integer,
  in p_cpg_id integer,
  in p_fv_fecha date,
  in p_fv_fechaVto date,
  in p_fv_total decimal(18,6),
  in p_est_id integer
)
  returns void as
$BODY$
declare
   v_sys_error varchar := '';
   v_fv_id integer;
   v_cpg_id integer;
   v_fv_fecha date;
   v_fv_total decimal(18,6);
   v_fv_pendiente decimal(18,6);
   v_cpg_escontado smallint;
   v_cpg_eslibre smallint;
   
   v_fv_fechaVto date;
   
   c_pago_item refcursor;
   v_cpgi_dias smallint;
   v_cpgi_porcentaje decimal(18,6);
   v_fvd_id integer;
   v_fvd_fecha date;
   v_fvd_fecha2 date;
   v_fvd_pendiente decimal(18,6);
   v_importe decimal(18,6);
   v_n smallint;
   v_count_cpgi smallint;

begin

   v_fv_fechaVto := p_fv_fechaVto;
   v_fv_id := p_fv_id;
   v_cpg_id := p_cpg_id;
   v_fv_fecha := p_fv_fecha;
   v_fv_total := p_fv_total;

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
   delete FacturaVentaDeuda where fv_id = v_fv_id;

   select cpg_escontado,
          cpg_eslibre
     into v_cpg_escontado,
          v_cpg_eslibre
   from CondicionPago
   where cpg_id = v_cpg_id;

   if p_fv_total <> 0 and p_est_id <> 7 then

      if v_cpg_escontado <> 0 then
         open c_pago_item for select 0 cpgi_dias, 100 cpgi_porcentaje;
      else
         if v_cpg_eslibre <> 0 then
            if v_p_fv_fechaVto < p_fv_fecha then
               v_p_fv_fechaVto := dateadd('D', 1, p_fv_fecha);
            end if;
            open c_pago_item for select datediff('D', p_fv_fecha, v_p_fv_fechaVto) cpgi_dias, 100 cpgi_porcentaje;
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
         
         v_fvd_fecha := dateadd('D', v_cpgi_dias, v_fv_fecha);
         v_n := v_n + 1;

         if v_n < v_count_cpgi then

            v_fvd_pendiente := v_fv_total * v_cpgi_porcentaje / 100;
            v_importe := v_importe + v_fvd_pendiente;

         else

            v_fvd_pendiente := v_fv_total - v_importe;

         end if;

         v_fvd_pendiente := round(v_fvd_pendiente, 2);

         select sp_dbGetNewId('FacturaVentaDeuda', 'fvd_id') into v_fvd_id;

         select sp_doc_get_fecha2(v_fvd_fecha, 0, null) into v_fvd_fecha2;

         insert into FacturaVentaDeuda( fvd_id, fvd_fecha, fvd_fecha2, fvd_importe, fvd_pendiente, fv_id )
         values ( v_fvd_id, v_fvd_fecha, v_fvd_fecha2, v_fvd_pendiente, v_fvd_pendiente, v_fv_id );

      end loop;

      close c_pagoItem;

      select sum(fvd_pendiente)
        into v_fv_pendiente
      from FacturaVentaDeuda
      where fv_id = v_fv_id;

   else

      v_fv_pendiente := 0;

   end if;

   update FacturaVenta
      set fv_pendiente = coalesce(v_fv_pendiente, 0)
   where fv_id = v_fv_id;

end;
$BODY$
  language plpgsql volatile
  cost 100;
alter function sp_doc_factura_venta_save_deuda(integer, integer, date, date, decimal, integer)
  owner to postgres;