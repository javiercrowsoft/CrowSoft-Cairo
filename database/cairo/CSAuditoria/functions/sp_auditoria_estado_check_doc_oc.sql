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
-- Function: sp_auditoria_estado_check_doc_oc()

-- drop function sp_auditoria_estado_check_doc_oc(integer);

create or replace function sp_auditoria_estado_check_doc_oc
(
  in p_oc_id integer,
  out p_success integer,
  out p_error_msg varchar
)
  returns record as
$BODY$
declare
   v_error smallint;
   v_doct_id integer;
   v_oc_nrodoc varchar(50);
   v_oc_numero varchar(50);
   v_oc_pendiente decimal(18,6);
   v_est_id integer;
begin

   v_error := 0;
   p_success := 0;
   p_error_msg := '@@ERROR_SP:';

   select doct_id,
          oc_nrodoc,
          trim(to_char(oc_numero)),
          est_id
     into v_doct_id,
          v_oc_nrodoc,
          v_oc_numero,
          v_est_id
   from OrdenCompra
   where oc_id = p_oc_id;

   if exists ( select *
               from OrdenCompraItem oci
               where (oci.oci_pendientefac
                      + (coalesce(( select sum(ocfc_cantidad)
                                    from OrdenFacturaCompra
                                    where oci_id = oci.oci_id ), 0)
                       + coalesce(( select sum(ocdc_cantidad)
                                    from OrdenDevolucionCompra
                                    where ( oci_id_Orden = oci.oci_id and v_doct_id = 35 )
                                       or ( oci_id_devolucion = oci.oci_id and v_doct_id = 36 ) ), 0)
                       + coalesce(( select sum(ocrc_cantidad)
                                    from OrdenRemitoCompra
                                    where oci_id = oci.oci_id ), 0)
                        )
                     ) <> oci.oci_cantidadaremitir
                 and oci.oc_id = p_oc_id ) then

      v_error := 1;
      p_error_msg := p_error_msg
                     || 'El pendiente de los items de esta orden de compra no coincide con la suma de sus aplicaciones'
                     || CHR(10);

   end if;


   if exists ( select *
               from OrdenCompraItem oci
               where (oci_pendiente
                      + (coalesce(( select sum(pcoc_cantidad)
                                    from PedidoOrdenCompra
                                    where oci_id = oci.oci_id ), 0))
                     ) <> oci_cantidadaremitir
                 and oc_id = p_oc_id ) then

      v_error := 1;
      p_error_msg := p_error_msg
                     || 'El pendiente de los items de esta orden de compra no coincide con la suma de sus aplicaciones'
                     || CHR(10);

   end if;

   if v_est_id <> 7 and v_est_id <> 5 and v_est_id <> 4 then

      select sum(oci_pendientefac)
        into v_oc_pendiente
      from OrdenCompraItem
      where oc_id = p_oc_id;

      if v_oc_pendiente = 0 then

         v_error := 1;
         p_error_msg := p_error_msg
                        || 'La orden de compra no tiene items pendientes y su estado no es finalizado, o anulado, o pendiente de firma'
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
alter function sp_auditoria_estado_check_doc_oc(integer)
  owner to postgres;