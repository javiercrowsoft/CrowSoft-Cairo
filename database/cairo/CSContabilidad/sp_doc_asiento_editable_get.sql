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
-- Function: sp_doc_asiento_editable_get()

-- drop function sp_doc_asiento_editable_get(integer, integer, integer, integer, integer);
create or replace
function sp_doc_asiento_editable_get
/*
    select * from asiento where doct_id_cliente is null;
    select * from sp_doc_asiento_editable_get(1,225,1, 0, 1);
    select * from sp_doc_asiento_editable_get(1,2,1,0,1);
*/
(
  in p_emp_id integer,
  in p_as_id integer,
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
   v_as_fecha date;
   v_doct_id_cliente integer;
   v_firmado integer;
   v_emp_id integer;
   v_emp_nombre varchar(255);
   v_impreso smallint;

   v_anulado integer := 7;
   v_csPreConEditAsiento integer := 19002;
   v_csPreConDeleteAsiento integer := 19003;

   v_pre_id integer;
   v_doc_nombre varchar(255);
   v_fca_id integer;

   v_fca_fechaDesde date;
   v_fca_fechaHasta date;

   v_edit_AST_MF smallint;

   v_cfg_valor varchar(5000);

   v_doc_editarimpresos smallint;
begin

   if p_as_id <> 0 then

      select d.doc_id,
             d.emp_id,
             c.as_fecha,
             c.doct_id_cliente,
             c.impreso
        into v_doc_id,
             v_emp_id,
             v_as_fecha,
             v_doct_id_cliente,
             v_impreso
      from Asiento c
      join Documento d
        on c.doc_id = d.doc_id
      where c.as_id = p_as_id;

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

      if p_delete = 0 then
         v_pre_id := v_csPreConEditAsiento;
      else
         v_pre_id := v_csPreConDeleteAsiento;
      end if;

      -- Tiene permiso para editar asientos contables
      --
      if not exists ( select per_id
                      from Permiso
                      where pre_id = v_pre_id
                        and ( ( us_id = p_us_id )
                             or exists ( select us_id
                                         from UsuarioRol
                                         where us_id = p_us_id
                                           and rol_id = Permiso.rol_id ) ) ) then
         p_editable := 0;

         if p_delete = 0 then
            p_edit_msg := 'Usted no tiene permiso para editar asientos contables';
         else
            p_edit_msg := 'Usted no tiene permiso para borrar asientos contables';
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
                                           and rol_id = Permiso.rol_id ) ) ) then
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
                           and v_as_fecha between fca_fechaDesde and fca_fechaHasta ) then

            select fca_fechaDesde,
                   fca_fechaHasta
              into v_fca_fechaDesde,
                   v_fca_fechaHasta
            from FechaControlAcceso
            where fca_id = v_fca_id;

            p_editable := 0;
            p_edit_msg := 'La fecha del asiento esta fuera del intervalo definido por las fechas de control de acceso ('
                          || to_char(coalesce(v_fca_fechaDesde, ''), 'dd-mm-yyyy')
                          || ' - '
                          || to_char(coalesce(v_fca_fechaHasta, ''), 'dd-mm-yyyy')
                          || ')';
            return;

         end if;

      end if;

      if coalesce(v_doct_id_cliente, 0) <> 0 then

         v_edit_AST_MF := 0;

         if v_doct_id_cliente = 26 then
            -- Veo si se permite editar asientos de movimientos de fondos
            --
            select sp_cfg_getValor('Tesoreria-General', 'Modificar Asientos MF') into v_cfg_valor;

            if isnumeric(v_cfg_valor) = 0 then
               v_edit_AST_MF := 0;
            else
               v_edit_AST_MF := to_number(v_cfg_valor);
            end if;

         end if;

         if v_edit_AST_MF = 0 then

            p_editable := 0;
            p_edit_msg := 'Este documento se ha generado automaticamente por otro documento. No puede editarse directamente.';

            return;

         end if;

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
alter function sp_doc_asiento_editable_get(integer, integer, integer, integer, integer)
  owner to postgres;