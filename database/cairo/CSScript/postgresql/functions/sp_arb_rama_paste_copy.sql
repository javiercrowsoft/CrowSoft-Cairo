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
-- Function: sp_arbcopiarrama()

-- drop function sp_arbcopiarrama();

create or replace function sp_arbcopiarrama
(
  in p_us_id integer,
  in p_ram_id_copy_from integer ,
  in p_ram_id_copy_to integer ,
  in p_solo_los_hijos smallint ,
  out rtn refcursor
)
  returns refcursor as
$BODY$
declare
   v_ram_id integer;
   v_new_ram_id integer;
   v_new_hoja_id integer;
   v_ram_id_padre integer;
   v_orden integer;
   v_arb_id integer;
   v_incluir_ram_id_to_copy integer;

   c_branches_to_copy refcursor;
   c_leaves_to_copy refcursor;
   v_branch_row record;
   v_leave_row record;
   v_tran_id integer;
begin

   if p_ram_id_copy_from = 0 then RETURN; end if;

   if p_ram_id_copy_to = 0 then RETURN; end if;

   if not exists(select 1 from rama where ram_id = p_ram_id_copy_from) then RETURN; end if;

   if not exists(select 1 from rama where ram_id = p_ram_id_copy_to) then RETURN; end if;

   --------------------------------------------------------------------

        create TEMP table t_rama_new
        (
          ram_id integer  not null,
          ram_id_new integer  not null,
          tran_id integer  not null
        ) on commit drop;

        v_tran_id := nextval('t_rama_new_seq');

   --------------------------------------------------------------------

   select arb_id into v_arb_id from rama where ram_id = p_ram_id_copy_to;

   if p_solo_los_hijos <> 0 then
      v_incluir_ram_id_to_copy := 0;

   else
      v_incluir_ram_id_to_copy := 1;

   end if;

   select into c_branches_to_copy t.rtn from SP_ArbGetDecendencia(p_ram_id_copy_from,v_incluir_ram_id_to_copy,0,0,0) t;

   loop
      fetch c_branches_to_copy into v_branch_row;
      exit when not found;
      
      begin

         v_ram_id := v_branch_row.ram_id;

         -- si esta es la rama principal de la copia, su padre tiene que ser la rama en la que estoy pegando
         if v_ram_id = p_ram_id_copy_from then
            v_ram_id_padre := p_ram_id_copy_to;
            select max(ram_orden) into v_orden from rama where ram_id_padre = v_ram_id_padre;
            v_orden := coalesce(v_orden + 1, 0); 

         else
         begin
            -- Obtengo el padre de la rama que estoy copiando
            select ram_id_padre into v_ram_id_padre from rama where ram_id = v_ram_id;

            -- Si pedi copiar solo los hijos y la rama que estoy copiando es hija directa, 
            -- entonces su padre es la rama en la que estoy pegando
            if p_solo_los_hijos <> 0 and v_ram_id_padre = p_ram_id_copy_from then
            begin
               v_ram_id_padre := p_ram_id_copy_to;
               select max(ram_orden) into v_orden from rama where ram_id_padre = v_ram_id_padre;
               v_orden := coalesce(v_orden + 1, 0); 

            end;
            else
            begin
               -- Obtengo el nuevo padre
               select ram_id_new into v_ram_id_padre
               from rama
               inner join t_rama_new
                    on rama.ram_id = t_rama_new.ram_id
                        and rama.ram_id = v_ram_id_padre
               where tran_id = v_tran_id;

               v_orden := null;
               
            end;
            end if;

         end;
         end if;

         select SP_DBGetNewId('rama',
                              'ram_id') into v_new_ram_id;

         insert into rama
           ( ram_id, ram_nombre, arb_id, modifico, ram_id_padre, ram_orden )
           ( select v_new_ram_id,
                    ram_nombre,
                    v_arb_id,
                    p_us_id,
                    v_ram_id_padre,
                    coalesce(v_orden, ram_orden)
             from rama
                where ram_id = v_ram_id );

         insert into t_rama_new ( ram_id, ram_id_new, tran_id ) values ( v_ram_id, v_new_ram_id, v_tran_id );

         -- Creo un cursor para recorrer cada una de las hojas e insertarlas
         open c_leaves_to_copy for select hoja_id from Hoja where ram_id = v_ram_id;

         loop
            fetch c_leaves_to_copy into v_leave_row;
            exit when not found;
            begin
               -- Por cada hoja obtengo un id nuevo
               select SP_DBGetNewId('hoja',
                                    'hoja_id') into v_new_hoja_id;

               insert into hoja
                 ( hoja_id, id, modifico, ram_id, arb_id )
                 ( select v_new_hoja_id,
                          id,
                          modifico,
                          v_new_ram_id,
                          v_arb_id
                   from Hoja
                      where hoja_id = v_leave_row.hoja_id );

            end;
         end loop;

         close c_leaves_to_copy;

      end;
   end loop;

   close c_branches_to_copy;

   rtn := 'rtn';

   open rtn for select * from rama where ram_id = p_ram_id_copy_to;

end;
$BODY$
  language plpgsql volatile
  cost 100;
alter function sp_arbcopiarrama(integer, integer, integer, smallint)
  owner to postgres;