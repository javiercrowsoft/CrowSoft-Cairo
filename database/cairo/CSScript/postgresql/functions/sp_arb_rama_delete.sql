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
-- Function: sp_arbborrarrama()

-- drop function sp_arbborrarrama(int, int);

create or replace function sp_arbborrarrama(
  in p_us_id integer,
  in p_ram_id integer
)
  returns void as
$BODY$
declare
   v_error_code varchar := '00';
   -- si la rama es raiz tengo que borrar el arbol
   v_arb_id integer;
   -- para actulizar el orden
   v_ram_orden integer;
   v_ram_id_padre integer;
   rtn refcursor;
   v_row record;
   v_tran_id integer;
begin

          if not exists(select 1 from rama where ram_id = p_ram_id) then RETURN; end if;

   --------------------------------------------------------------------

        create TEMP table tt_t_ramas_a_borrar
        (
          ram_id integer  not null,
          tran_id integer  not null
        ) on commit drop;
        
        v_tran_id := nextval('t_ramas_a_borrar_seq');
        
   --------------------------------------------------------------------
   
   set TRANSACTION READ WRITE;

   if p_ram_id = 0 then RETURN; end if;

   select arb_id,
          ram_orden,
          ram_id_padre
     into v_arb_id,
          v_ram_orden,
          v_ram_id_padre
     from Rama
     where ram_id = p_ram_id
       and ram_id_padre = 0;

   select into rtn t.rtn from SP_ArbGetDecendencia(p_ram_id,1,0,0,0) t;

   loop
          fetch rtn into v_row;
          exit when not found;
          insert into tt_t_ramas_a_borrar(ram_id, tran_id) values (v_row.ram_id, v_tran_id);
   end loop;
   close rtn;

   begin
      -- primero las hojas
      delete from Hoja where exists(select 1 from tt_t_ramas_a_borrar where Hoja.ram_id = tt_t_ramas_a_borrar.ram_id);

   exception
      when others then
         v_error_code := SQLSTATE;
   end;

   if not is_error(v_error_code) then

             begin
                -- ahora las ramas
                delete from Rama where exists (select 1 from tt_t_ramas_a_borrar where Rama.ram_id = tt_t_ramas_a_borrar.ram_id);
             exception
                when others then
                   v_error_code := SQLSTATE;
             end;

             if not is_error(v_error_code) then
             begin
                       -- si era una raiz borro el arbol
                       if v_arb_id is not null then

                          delete from Arbol where arb_id = v_arb_id;

                       else
                          -- sino, tengo que actualizar el orden de los que estaban bajo esta rama
                          update rama
                             set ram_orden = ram_orden - 1
                          where ram_id_padre = v_ram_id_padre
                            and ram_orden < v_ram_orden;

                       end if;

                       RETURN;

             exception
                when others then
                   v_error_code := SQLSTATE;
             end;
             end if;
   end if;
   
   if is_error(v_error_code) then

          RAISE exception 'No se pude borrar la rama. % %', SQLSTATE, SQLERRM;
          
   end if;

end;
$BODY$
  language plpgsql volatile
  COST 100;
alter function sp_arbborrarrama(integer, integer)
  owner to postgres;