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
-- Function: sp_doc_get_editable()

-- drop function sp_doc_get_editable(integer, integer, integer, integer);

create or replace
function sp_doc_get_editable
/*
  select * from sp_doc_get_editable(2,61,1,17002)
*/
(
  in p_emp_id integer,
  in p_doc_id integer,
  in p_us_id integer,
  in p_pre_id integer,
  out p_editable_status integer,
  out p_editable_message varchar
)
  returns record as
$BODY$
begin

   declare
      v_doct_id integer;
      v_emp_id integer;
      v_emp_nombre varchar(255);
      v_doct_nombre varchar(255);
      v_editable smallint;
      v_edit_msg varchar(255);
      v_csPreVtaNew integer;
   begin
      v_csPreVtaNew := p_pre_id;

      select doc.emp_id,
             doc.doct_id,
             doct.doct_nombre
        into v_emp_id,
             v_doct_id,
             v_doct_nombre
      from Documento doc
      join DocumentoTipo doct
        on doc.doct_id = doct.doct_id
      where doc.doc_id = p_doc_id;

      v_editable := 1;

      v_edit_msg := '';

      if p_emp_id <> v_emp_id then
         select emp_nombre
           into v_emp_nombre
         from Empresa
         where emp_id = v_emp_id;

         v_editable := 0;
         v_edit_msg := 'El documento pertenece a la empresa ' || v_emp_nombre
                        || ', para crear nuevos comprobantes debe ingresar al sistema indicando dicha empresa.';

      else

         -- Tiene permiso para crear nuevos documentos
         --
         if not exists ( select per_id
                         from Permiso
                         where pre_id = v_csPreVtaNew
                           and ( ( us_id = p_us_id )
                                or exists ( select us_id
                                            from UsuarioRol
                                            where us_id = p_us_id
                                              and rol_id = Permiso.rol_id ))) then
            v_editable := 0;
            v_edit_msg := 'Usted no tiene permiso para generar nuevos comprobantes para el tipo de documento ' || v_doct_nombre;
         else
          declare
            -- Tiene permiso para crear comprobantes de este documento
            --
            v_pre_id_new integer;
            v_doc_nombre varchar(255);
          begin
            select pre_id_new,
                   doc_nombre
              into v_pre_id_new,
                   v_doc_nombre
            from Documento
            where doc_id = p_doc_id;

            if not exists ( select per_id
                            from Permiso
                            where pre_id = v_pre_id_new
                             and ( ( us_id = p_us_id )
                                  or exists ( select us_id
                                              from UsuarioRol
                                              where us_id = p_us_id
                                                and rol_id = Permiso.rol_id))) then
               v_editable := 0;
               v_edit_msg := 'Usted no tiene permiso para generar nuevos comprobantes para el documento ' || v_doc_nombre;

            end if;

          end;
         end if;

      end if;

      p_editable_status := coalesce(v_editable, 0);
      p_editable_message := coalesce(v_edit_msg, 'Error al obtener el estado de edicion del documento');

   end;
end;
$BODY$
  language plpgsql volatile
  cost 100;
alter function sp_doc_get_editable(integer, integer, integer, integer)
  owner to postgres;