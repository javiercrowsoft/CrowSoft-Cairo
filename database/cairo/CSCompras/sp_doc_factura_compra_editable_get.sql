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
-- Function: sp_doc_factura_compra_editable_get()

-- drop function sp_doc_factura_compra_editable_get(integer, integer, integer, integer, integer);

create or replace function sp_doc_factura_compra_editable_get
/*
          select * from sp_doc_factura_compra_editable_get(1,7,1)
*/
(
  in p_emp_id integer,
  in p_fc_id integer,
  in p_us_id integer,
  in p_no_anulado integer default 0,
  in p_delete integer default 0,
  out p_editable integer,
  out p_edit_msg varchar  
)
  returns record as
$BODY$
declare
   v_doc_id integer;
   v_fc_fecha date;
   v_estado integer;
   v_firmado integer;
   v_emp_id integer;
   v_emp_nombre varchar(255);
   v_impreso numeric(3,0);

   v_anulado integer := 7;
   v_csPreCpraEditFactura integer := 17003;
   v_csPreCpraDeleteFactura integer := 17004;

   v_pre_id integer;
   v_doc_nombre varchar(255);
   v_fca_id integer;

   v_fca_fechaDesde date;
   v_fca_fechaHasta date;

   v_doc_editarimpresos smallint;
begin

   if p_fc_id <> 0 then

      select d.doc_id,
             d.emp_id,
             c.fc_fecha,
             c.est_id,
             c.impreso
        into v_doc_id,
             v_emp_id,
             v_fc_fecha,
             v_estado,
             v_impreso
      from FacturaCompra c
               join Documento d
                on c.doc_id = d.doc_id
      where c.fc_id = p_fc_id;

      if p_emp_id <> v_emp_id then

         select emp_nombre
           into v_emp_nombre
         from Empresa
         where emp_id = v_emp_id;

         p_editable := 0;

         if p_delete = 0 then
            p_edit_msg := 'El comprobante pertenece a la empresa ' || v_emp_nombre || ', para editarlo debe ingresar al sistema indicando dicha empresa.';
         else
            p_edit_msg := 'El comprobante pertenece a la empresa ' || v_emp_nombre || ', para borrarlo debe ingresar al sistema indicando dicha empresa.';
         end if;

         return;

      end if;

      if v_estado = v_anulado and p_no_anulado = 0 then

         p_editable := 0;
         p_edit_msg := 'El comprobante esta anulado';

         return;

      end if;

      if p_delete = 0 then
         v_pre_id := v_csPreCpraEditFactura;
      else
         v_pre_id := v_csPreCpraDeleteFactura;
      end if;

      -- Tiene permiso para editar facturas de compra
      --
      if not exists ( select per_id
                      from Permiso
                      where pre_id = v_pre_id
                        and ( ( us_id = p_us_id )
                             or exists ( select us_id
                                         from UsuarioRol
                                         where us_id = p_us_id
                                           and rol_id = Permiso.rol_id ))) then

         p_editable := 0;

         if p_delete = 0 then
            p_edit_msg := 'Usted no tiene permiso para editar facturas de compra';
         else
            p_edit_msg := 'Usted no tiene permiso para borrar facturas de compra';
         end if;

         return;

      end if;

      v_pre_id := null;

      select case
               when p_delete = 0 then pre_id_edit
               else pre_id_delete
             end,
             doc_nombre
        into v_pre_id,
             v_doc_nombre
      from Documento
      where doc_id = v_doc_id;

      if not exists ( select per_id
                      from Permiso
                      where pre_id = v_pre_id
                        and ( ( us_id = p_us_id )
                             or exists ( select us_id
                                         from UsuarioRol
                                         where us_id = p_us_id
                                           and rol_id = Permiso.rol_id))) then
         p_editable := 0;

         if p_delete = 0 then
            p_edit_msg := 'Usted no tiene permiso para editar ' || v_doc_nombre;
         else
            p_edit_msg := 'Usted no tiene permiso para borrar ' || v_doc_nombre;
         end if;

         return;

      end if;

      -- Fechas de control de Acceso
      select fca_id
        into v_fca_id
      from Documento
      where doc_id = v_doc_id;

      if not v_fca_id is null then

         if not exists ( select fca_id
                         from FechaControlAcceso
                         where fca_id = v_fca_id
                           and v_fc_fecha BETWEEN fca_fechaDesde and fca_fechaHasta ) then

            select fca_fechaDesde,
                   fca_fechaHasta
              into v_fca_fechaDesde,
                   v_fca_fechaHasta
            from FechaControlAcceso
            where fca_id = v_fca_id;

            p_editable := 0;

            p_edit_msg := 'La fecha del comprobante esta fuera del intervalo definido por las fechas de control de acceso ('
                            || to_char(coalesce(v_fca_fechaDesde, ''), 'dd-mm-yyyy')
                            || ' - '
                            || to_char(coalesce(v_fca_fechaHasta, ''), 'dd-mm-yyyy')
                            || ')';
            return;

         end if;

      end if;

      if exists ( select fc_id
                  from FacturaCompraOrdenPago
                  where fc_id = p_fc_id ) then

         -- Si la condicion de pago es por debito automatico
         -- la aplicacion no impide la edicion
         --
         if not exists ( select fc.cpg_id
                         from FacturaCompra fc
                         join CondicionPago cpg
                           on fc.cpg_id = cpg.cpg_id
                          and cpg.cpg_tipo in ( 2,3 )
                         where fc.fc_id = p_fc_id ) then
            p_editable := 0;
            p_edit_msg := 'El comprobante esta vinculado a una orden de pago';

            return;

         end if;

      end if;

      if exists ( select fc_id_factura
                  from FacturaCompraNotaCredito
                  where fc_id_factura = p_fc_id
                     or fc_id_notacredito = p_fc_id ) then

         p_editable := 0;
         p_edit_msg := 'El comprobante esta vinculado a una factura o nota de credito';

         return;

      end if;


      if exists ( select fci.fc_id
                  from RemitoFacturaCompra r
                  join FacturaCompraItem fci
                    on r.fci_id = fci.fci_id
                  where fci.fc_id = p_fc_id ) then

         p_editable := 0;
         p_edit_msg := 'El comprobante esta vinculado a un remito';

         return;

      end if;

      if exists ( select fci.fc_id
                  from OrdenFacturaCompra oc
                  join FacturaCompraItem fci
                    on oc.fci_id = fci.fci_id
                  where fci.fc_id = p_fc_id ) then

         p_editable := 0;
         p_edit_msg := 'El comprobante esta vinculado a una orden de compra';

         return;

      end if;

      if v_impreso <> 0 and p_no_anulado = 0 then

         select doc_editarimpresos
           into v_doc_editarimpresos
         from Documento
         where doc_id = v_doc_id;

         if v_doc_editarimpresos = 0 then

            p_editable := 0;

            if p_delete = 0 then
               p_edit_msg := 'El comprobante esta impreso y la definición de su documento no permite la edición de comprobantes impresos.';
            else
               p_edit_msg := 'El comprobante esta impreso y la definición de su documento no permite eliminar comprobantes impresos.';
            end if;

            return;

         end if;

      end if;

   end if;

   p_editable := 1;
   p_edit_msg := '';

end;
$BODY$
  language plpgsql volatile
  cost 100;
alter function sp_doc_factura_compra_editable_get(integer, integer, integer, integer, integer)
  owner to postgres;