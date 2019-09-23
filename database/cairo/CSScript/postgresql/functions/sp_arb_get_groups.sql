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
-- Function: sp_arbgetgroups()

-- drop function sp_arbgetgroups();

create or replace function sp_arbgetgroups(
  in p_clienteId integer,
  in p_arbv_id integer,
  in p_IsRaiz integer
)
  returns refcursor as
$BODY$
declare

   v_ram_id integer;
   v_ram_id_padre integer;
   v_last_padre integer;-- el ultimo padre antes del expandido

   v_ram_estado smallint;
   v_tbl_id integer;

begin

      if p_IsRaiz <> 0 then

         select a.tbl_id
           into v_tbl_id
         from Arbol a join ArbolVista av on a.arb_id = av.arb_id
         where av.arbv_id = p_arbv_id;

         insert into rptArbolRamaHoja
           ( rptarb_cliente, ram_id, rptarb_hojaid, tbl_id )
           ( select p_clienteId,
                    min(r.ram_id),
                    h.id,
                    v_tbl_id
             from Rama r join ArbolVista a on r.arb_id = a.arb_id
                         join Hoja h on r.ram_id = h.ram_id
             where a.arbv_id = p_arbv_id
             group by h.id );

      end if;

      for v_ram_id in
         select distinct ram_id
         from rptArbolRamaHoja
         where rptarb_cliente = p_clienteId
      loop

            if exists ( select *
                        from RamaVista
                        where ram_id = v_ram_id
                          and arbv_id = p_arbv_id
                          and ramv_estado in ( 0,3 ) ) then

                /*colapsada*/
               -- Esto es asi por que si el padre esta expandido se tienen que
               -- ver las ramas hijas o sea esta rama que aunque esta colapsada
               -- y por ende no muestra sus hijos, si su padre esta expandido
               -- esta rama si se ve
               --
               v_last_padre := v_ram_id;

               select ram_id_padre
                 into v_ram_id_padre
               from Rama
               where ram_id = v_ram_id;

               select ramv_estado
                 into v_ram_estado
               from RamaVista
               where ram_id = v_ram_id_padre
                 and arbv_id = p_arbv_id;

               while v_ram_id_padre is not null  /*solo cuando ram_id no existe (por que justo borraron la rama)*/
                 and v_ram_estado not in ( 1,2 ) /*expandida*/
                 and v_ram_id_padre <> 0
               loop
                     /*raiz*/
                     -- Si el padre no esta expandido voy a su abuelo y asi sigo hasta la raiz
                     -- o hasta encontrar una rama expandida
                     --
                     v_last_padre := v_ram_id_padre;

                     select ram_id_padre
                       into v_ram_id_padre
                     from Rama
                     where ram_id = v_ram_id_padre;

                     select ramv_estado
                       into v_ram_estado
                     from RamaVista
                     where ram_id = v_ram_id_padre
                       and arbv_id = p_arbv_id;

               end loop;

               -- Si esta expandida, la rama tiene que quedar en el ultimo padre colapsado
               -- (que puede ser la misma rama o cualquiera de sus ancestros)
               --
               if v_ram_estado in ( 1,2 ) then

                  update rptArbolRamaHoja set ram_id = v_last_padre where ram_id = v_ram_id;


               else

                  -- Si el padre es la rama 0 (la raiz de todas las ramas)
                  -- pongo la raiz de este arbol (es decir @last_padre)
                  -- pues significa que la raiz del arbol esta colapsada
                  --
                  if v_ram_id_padre = 0 then

                     /*raiz*/
                     update rptArbolRamaHoja set ram_id = v_last_padre where ram_id = v_ram_id;

                  end if;
               end if;

            -- else @ram_id_padre is null -- no me interesa si la rama fue borrada

            end if;
      end loop;
   end;
end;
$BODY$
  language plpgsql volatile
  cost 100;
alter function sp_arbgetgroups(integer, integer, integer)
  owner to postgres;
