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
-- Function: sp_auditoria_estado_check_doc_pv()

-- drop function sp_auditoria_estado_check_doc_pv(integer);
create or replace function sp_auditoria_estado_check_doc_pv
(
  in p_pv_id integer,
  out p_success integer,
  out p_error_msg varchar
)
  returns record as
$BODY$
declare
   v_error smallint;
   v_doct_id integer;
   v_pv_nrodoc varchar(50);
   v_pv_numero varchar(50);
   v_pv_pendiente decimal(18,6);
   v_est_id integer;
begin

   v_error := 0;
   p_success := 0;
   p_error_msg := '@@ERROR_SP:';

   select doct_id,
          pv_nrodoc,
          trim(to_char(pv_numero)),
          est_id
     into v_doct_id,
          v_pv_nrodoc,
          v_pv_numero,
          v_est_id
   from PedidoVenta
   where pv_id = p_pv_id;

   if exists ( select *
               from PedidoVentaItem pvi
               where (pvi.pvi_pendiente + (  coalesce(( select sum(pvfv_cantidad)
                                                        from PedidoFacturaVenta
                                                        where pvi_id = pvi.pvi_id ), 0)
                                           + coalesce(( select sum(pvdv_cantidad)
                                                        from PedidoDevolucionVenta
                                                        where  ( pvi_id_pedido = pvi.pvi_id and v_doct_id = 5 )
                                                            or ( pvi_id_devolucion = pvi.pvi_id and v_doct_id = 22 )
                                                       ), 0)
                                           + coalesce(( select sum(pvrv_cantidad)
                                                        from PedidoRemitoVenta
                                                        where pvi_id = pvi.pvi_id ), 0))
                     ) <> pvi.pvi_cantidadaremitir
                 and pvi.pv_id = p_pv_id
             ) then

      v_error := 1;
      p_error_msg := p_error_msg
                     || 'El pendiente de los items de este pedido no coincide con la suma de sus aplicaciones'
                     || CHR(10);

   end if;

   if exists ( select *
               from PedidoVentaItem pvi
               where (pvi_pendientepklst + (coalesce(( select sum(pvpklst_cantidad)
                                                       from PedidoPackingList
                                                       where pvi_id = pvi.pvi_id ), 0))
                     ) <> pvi_cantidadaremitir
                 and pv_id = p_pv_id ) then

      v_error := 1;
      p_error_msg := p_error_msg
                     || 'El pendiente de los items de este pedido no coincide con la suma de sus aplicaciones'
                     || CHR(10);

   end if;

   if v_est_id <> 7 and v_est_id <> 5 and v_est_id <> 4 then

      select sum(pvi_pendiente)
        into v_pv_pendiente
      from PedidoVentaItem
      where pv_id = p_pv_id;

      if v_pv_pendiente = 0 then

         v_error := 1;
         p_error_msg := p_error_msg
                        || 'El pedido no tiene items pendientes y su estado no es finalizado, o anulado, o pendiente de firma'
                        || CHR(10);

      end if;

   end if;

   -- no hubo errores asi que todo bien
   --
   if v_error = 0 then
      p_success := 1;
   end if;

end;
$BODY$
  language plpgsql volatile
  cost 100;
alter function sp_auditoria_estado_check_doc_pv(integer)
  owner to postgres;