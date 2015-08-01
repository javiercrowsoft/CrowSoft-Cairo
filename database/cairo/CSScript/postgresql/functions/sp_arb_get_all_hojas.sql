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
-- Function: sp_arbgetallhojas(integer, integer, integer)

-- drop function sp_arbgetallhojas(integer, integer, integer);

create or replace function sp_arbgetallhojas(
in p_ram_id integer, 
in p_clienteid integer default 0, 
in p_tblidalias integer default 0)
  returns void as
$BODY$
declare
   v_tot2 integer;
   v_tot1 integer;
   v_n integer;
begin

   drop table if exists tt_t_rama;

   create temporary table tt_t_rama
   (
     ram_id integer  not null,
     N integer  not null
   ) on commit drop;

   if p_ram_id = 0 then
      RETURN;
   end if;

   if p_clienteId = 0 then
      raise exception '@@ERROR_SP:El procedimiento almacenado sp_ArbGetAllHojas no puede ser llamado para obtener un cursor. Se debe usar sp_ArbGetAllHojasRs.';
      RETURN;
   end if;
	 
   v_tot1 := -1;

   v_tot2 := 0;

   v_n := 1;

   insert into tt_t_rama ( ram_id, N )
                  values ( p_ram_id, 0 );

   while v_tot1 < v_tot2
   loop
      begin
         v_tot1 := v_tot2;

         insert into tt_t_rama
           ( ram_id, N )
           ( select r.ram_id,
                    v_n
             from Rama r,
                  tt_t_rama t
                where r.ram_id_padre = t.ram_id
                        and t.N = v_n - 1
                        and r.ram_id <> t.ram_id );

         select COUNT(*)
         into v_tot2
         from tt_t_rama;

         v_n := v_n + 1;

      end;
   end loop;

   if p_clienteId <> 0 then
   declare
      v_tbl_id integer;
   begin
      select tbl_id
        into v_tbl_id
      from Arbol inner join Rama on Arbol.arb_id = Rama.arb_id
      where Rama.ram_id = p_ram_id;

      if p_tblIdAlias <> 0 then
         v_tbl_id := p_tblIdAlias;
      end if;

      insert into rptArbolRamaHoja
        ( rptarb_cliente, rptarb_hojaid, tbl_id, ram_id )
        ( select DISTINCT p_clienteId,
                          h.id,
                          v_tbl_id,
                          t.ram_id
          from Hoja h inner join tt_t_rama t on h.ram_id = t.ram_id );

   end;
   end if;

end;
$BODY$
  language plpgsql volatile
  cost 100;
alter function sp_arbgetallhojas(integer, integer, integer)
  owner to postgres;
