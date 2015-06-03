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
-- Function: sp_doc_get_doc_id_for_doct_id()

-- drop function sp_doc_get_doc_id_for_doct_id(integer, integer, integer, integer, integer, integer);

/*
          select * from remitoventa;
          select sp_doc_get_doc_id_for_doct_id(1,1,2,4,1,0);

*/
create or replace function sp_doc_get_doc_id_for_doct_id
(
  in p_emp_id integer,
  in p_us_id integer,
  in p_doct_id integer,
  in p_doct_id_aplic integer,
  in p_id integer,
  in p_idEx integer,  -- -1 Factura de Venta sobre Horas
                      -- -2 Remito de venta basado en boms
  out p_doc_id integer,
  out p_doc_name varchar
)
  returns record as
$BODY$
declare
  v_mon_id integer;
begin

   p_doc_id := 0;
   p_doc_name := '';

   if p_doct_id_aplic = 3 then -- Remitos de Venta

      select doc.mon_id
        into v_mon_id
      from RemitoVenta rv
      join Documento doc
        on rv.doc_id = doc.doc_id
      where rv.rv_id = p_id;

   else
      if p_doct_id_aplic = 4 then -- Remitos de Compra

         select doc.mon_id
           into v_mon_id
         from RemitoCompra rc
         join Documento doc
           on rc.doc_id = doc.doc_id
         where rc.rc_id = p_id;

      end if;
   end if;

   if p_doct_id_aplic = 5 then -- Pedidos de Venta

      select doc.mon_id
        into v_mon_id
      from PedidoVenta pv
      join Documento doc
        on pv.doc_id = doc.doc_id
      where pv.pv_id = p_id;

   else

      if p_doct_id_aplic = 11 then -- Presupuesto de Venta

         select doc.mon_id
           into v_mon_id
         from PresupuestoVenta prv
         join Documento doc
           on prv.doc_id = doc.doc_id
         where prv.prv_id = p_id;

      else

         if p_doct_id_aplic = 35 then -- Ordenes de Compra

            select doc.mon_id
              into v_mon_id
            from OrdenCompra oc
            join Documento doc
              on oc.doc_id = doc.doc_id
            where oc.oc_id = p_id;

         end if;

      end if;

   end if;

   if v_mon_id is null then

      select mon_id
        into v_mon_id
      from Moneda
      where mon_legal <> 0;

   end if;

   /*
      csETFacDirecta = 0
      csETFacPedido = 1
      csETFacRemito = 2
      csETFacPackingList = 3
      csETFacProyecto = 4
      csETFacOrden = 5
   */

   select doc_id, doc_nombre
     into p_doc_id, p_doc_name
   from Documento doc
   where doc.doct_id = p_doct_id
     and doc.mon_id = v_mon_id
     and doc.emp_id = p_emp_id
     and ( ( doc_rv_desde_pv <> 0 and p_doct_id_aplic = 5 and p_doct_id = 3 )
          or ( doc_rv_desde_os <> 0 and p_doct_id_aplic = 42 and p_doct_id = 3 )
          or ( doc_rv_bom <> 0 and p_doct_id_aplic = 5 and p_doct_id = 3 and p_IdEx = -2 )
          or ( doc_pv_desde_prv <> 0 and p_doct_id_aplic = 11 and p_doct_id = 5 )
          or ( doc_rc_desde_oc <> 0 and p_doct_id_aplic = 35 and p_doct_id = 4 )
          or ( doc_tipofactura = 5 and p_doct_id_aplic = 35 and p_doct_id = 2 )
          or ( doc_tipofactura = 2 and p_doct_id_aplic = 4 and p_doct_id = 2 )
          or ( doc_tipofactura = 1 and p_doct_id_aplic = 5 and p_doct_id = 1 )
          or ( doc_tipofactura = 2 and p_doct_id_aplic = 3 and p_doct_id = 1 )
          or ( doc_tipofactura = 3 and p_doct_id_aplic = 21 and p_doct_id = 1 )
          or ( doc_tipofactura = 4 and p_doct_id_aplic = 0 and p_doct_id = 1 and p_IdEx = -1 )
         )
     and exists ( select *
                  from Permiso
                  where pre_id = doc.pre_id_new
                    and ( ( us_id = p_us_id )
                          or exists ( select us_id from UsuarioRol
                                      where us_id = p_us_id
                                        and rol_id = Permiso.rol_id ) ) )
     limit 1;

end;
$BODY$
  language plpgsql volatile
  cost 100;
alter function sp_doc_get_doc_id_for_doct_id(integer, integer, integer, integer, integer, integer)
  owner to postgres;