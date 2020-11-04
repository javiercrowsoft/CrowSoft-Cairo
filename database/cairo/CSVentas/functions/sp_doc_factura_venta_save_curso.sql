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
-- Function: sp_doc_factura_venta_save_curso()

-- drop function sp_doc_factura_venta_save_curso(integer, integer);

create or replace function sp_doc_factura_venta_save_curso
(
  in v_fv_id integer,
  in p_fvTMP_id integer,
  out p_success integer,
  out p_error_msg varchar
)
  returns record as
$BODY$
declare
   v_error smallint;
   v_cli_id integer;
   v_cli_nombre varchar(255);
   v_cur_id integer;
   v_curi_id integer;
   v_alum_id integer;
   v_modifico integer;
   v_fv_fecha timestamp with time zone;

   v_prs_id integer;
   v_prs_apellido varchar(255);
   v_prs_nombre varchar(255);
   v_i integer;
begin

   v_error := 0;
   p_success := 0;
   p_error_msg := '@@ERROR_SP:';

   select fv.cli_id,
          fv.modifico,
          fv.fv_fecha,
          cli.cli_nombre
     into v_cli_id,
          v_modifico,
          v_fv_fecha,
          v_cli_nombre
   from FacturaVenta fv
   join Cliente cli
     on fv.cli_id = cli.cli_id
   where fv.fv_id = v_fv_id;

   select alum.alum_id
     into v_alum_id
   from Persona prs
   join Alumno alum
     on prs.prs_id = alum.prs_id
   where prs.cli_id = v_cli_id;

   -- si no existe aun un alumno lo creamos
   --
   if v_alum_id is null then

      v_i := instr(v_cli_nombre, ',', 1);

      if v_i <> 0 then

         v_prs_apellido := substr(v_cli_nombre, 1, v_i);
         v_prs_nombre := substr(v_cli_nombre, v_i + 1, 1000);

      else

         v_i := instr(v_cli_nombre, ' ', 1);

         if v_i <> 0 then

            v_prs_apellido := substr(v_cli_nombre, 1, v_i);
            v_prs_nombre := substr(v_cli_nombre, v_i + 1, 1000);

         else

            v_prs_apellido := v_cli_nombre;
            v_prs_nombre := '.';

         end if;

      end if;

      select sp_dbGetNewId('Persona', 'prs_id') into v_prs_id;

      insert into Persona( prs_id, prs_apellido, prs_nombre, prs_codigo, modifico, cli_id )
      values ( v_prs_id, v_prs_apellido, v_prs_nombre, trim(to_char(v_prs_id,'00000')), v_modifico, v_cli_id );

      select sp_dbGetNewId('Alumno', 'alum_id') into v_alum_id;

      insert into Alumno( alum_id, alum_codigo, modifico, prs_id, alum_fechaingreso )
      values ( v_alum_id, trim(to_char(v_alum_id,'00000')), v_modifico, v_prs_id, v_fv_fecha );

   end if;

   if v_alum_id is not null then

      begin

         for v_cur_id in
              select distinct pr.cur_id
              from FacturaVentaItem t
              join Producto pr
                on t.pr_id = pr.pr_id
              where t.fv_id = v_fv_id
                and pr.cur_id is not null
         loop

            if not exists ( select *
                            from CursoItem
                            where cur_id = v_cur_id
                              and alum_id = v_alum_id ) then

               select sp_dbGetNewId('CursoItem', 'curi_id') into v_curi_id;

               insert into CursoItem( cur_id, curi_id, alum_id, est_id, fv_id )
               values ( v_cur_id, v_curi_id, v_alum_id, 10, /*En curso*/v_fv_id );
            end if;

         end loop;

      exception
         when others then

            p_success := 0;
            p_error_msg := p_error_msg
                           || format('No se pudo inscribir al alumno a los cursos mencionados por la factura. %s. %s.',
                                     sqlstate, sqlerrm);
            return;
      end;

      begin
         -- borro cualquier inscripcion a cursos que ya no este reflejada por esta factura
         -- y se halla generado por esta factura en versiones anteriores de la misma
         -- (en castellano: por que modificaron o borraron los productos de la factura)
         --
         delete from CursoItem
         where fv_id = v_fv_id
         and not exists ( select distinct pr.cur_id
                          from FacturaVentaItem t
                          join Producto pr
                            on t.pr_id = pr.pr_id
                          where t.fv_id = v_fv_id
                            and pr.cur_id = CursoItem.cur_id );
      exception
         when others then

            p_success := 0;
            p_error_msg := p_error_msg
                           || format('No se pudo borrar la inscripcion a los cursos mencionados por la version anterior de la factura. %s. %s.',
                                     sqlstate, sqlerrm);
            return;
      end;

   end if;

   -- no hubo errores asi que todo bien
   --
   p_success := 1;

exception
   when others then

      p_success := 0;
      p_error_msg := p_error_msg
                     || format('No se pudo guardar el curso asociado a esta factura. sp_doc_factura_venta_save_curso. %s. %s.',
                               sqlstate, sqlerrm);

end;
$BODY$
  language plpgsql volatile
  cost 100;
alter function sp_doc_factura_venta_save_curso(integer, integer)
  owner to postgres;